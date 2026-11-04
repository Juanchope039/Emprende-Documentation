# 17 · Resiliencia, trabajo sin conexión y caché

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/17-resiliencia-offline-y-cache.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-15 | 2026-10-30 | [Front](INDICE.md#etiqueta-front) · [API](INDICE.md#etiqueta-api) · [Arquitectura](INDICE.md#etiqueta-arquitectura) |

> **Construcción: diseñado, no construido.** Este documento define cómo la aplicación tolerará los
> cortes de red y trabajará sin conexión. Se escribe antes de programar para que la arquitectura
> ([`07-arquitectura.md`](07-arquitectura.md)) y la PWA ([ADR-016](adr/ADR-016-flutter-web-pwa.md))
> lo soporten desde el primer día. La implementación llega con la aplicación.

---

## 1. Qué se quiere lograr

| Requisito (lo que pediste) | Cómo lo cubre este diseño |
|---|---|
| Resiliente a la reconexión | Cola de operaciones que se reintenta sola al volver la señal ([§5](#5-escrituras-sin-conexión-la-cola), [§6](#6-detección-de-conexión-y-reconexión)) |
| Caché para **todos** los datos | Copia local de los datos que la persona ya vio, en el dispositivo ([§4](#4-lecturas-sin-conexión)) |
| Que se active en la desconexión | Al detectar que no hay red, la app lee de la caché y encola las escrituras ([§4](#4-lecturas-sin-conexión), [§5](#5-escrituras-sin-conexión-la-cola)) |
| Caché purgable por el usuario | Apartado en **Configuración → Datos sin conexión** para vaciarla ([§7](#7-purga-de-la-caché-por-el-usuario)) |

El objetivo de fondo: **en el taller la señal va y viene, y el trabajo no puede parar por eso.**
Registrar una venta o un gasto debe funcionar aunque en ese instante no haya internet.

### 1.1 La promesa, sin letra pequeña

> **Toda escritura que el sistema aceptó es duradera. Toda escritura que aún no aceptó sigue viva
> en el dispositivo hasta que se confirme o hasta que la persona la descarte a propósito.**

No hay un tercer estado. Nada desaparece en silencio: ni al cerrar la aplicación, ni al quedarse
el celular sin batería, ni al fallar el servidor. Una operación o está confirmada, o está
pendiente y a la vista. Si se descarta, la descarta una persona sabiendo qué descarta.

Esto se dice así de tajante porque la alternativa es la que arruina la confianza en un sistema de
plata: que la empleada registre un gasto, la app diga algo ambiguo y al otro día el gasto no
esté. Una vez que eso pasa, nadie vuelve a creerle a la pantalla.

### 1.2 Mecanismos por capa

Resiliencia no es una función que se programa una vez: es lo que hacen a la vez el front, la API
y la capa de datos. Si una sola de las tres falla en su parte, la promesa de arriba se cae.

| Capa | Mecanismo |
|---|---|
| **Front** | Cola local persistente. Cada intención se guarda **con su clave de idempotencia antes** de intentar enviarse, así el reintento es seguro por construcción ([§5](#5-escrituras-sin-conexión-la-cola)) |
| **Front** | Reintentos con espera exponencial y variación aleatoria. La cola sobrevive a cerrar la aplicación ([§5.2](#52-cuánto-se-espera-entre-reintentos)) |
| **Front** | La persona ve qué hay pendiente y desde cuándo. Nunca se descarta algo sin decirlo ([§7](#7-purga-de-la-caché-por-el-usuario)) |
| **API** | Idempotencia y transacciones: o todo el efecto de la operación, o nada |
| **API** | Cortacircuitos y tiempos de espera hacia la base, para degradar en vez de colapsar |
| **Datos** | Nada se borra ([ADR-004](adr/ADR-004-base-solo-escritura.md)). Auditoría por triggers ([ADR-005](adr/ADR-005-auditoria-por-triggers.md)) |
| **Datos** | WAL y recuperación a un punto en el tiempo en producción. Respaldos **verificados**, no solo programados |

El cortacircuitos de la API importa por lo que evita. Cuando la base tarda en responder, cada
petición que se queda esperando consume una conexión y empeora la congestión. Tras una racha de
fallos la API deja de intentar por un rato y responde de inmediato con un mensaje claro; el front
encola y reintenta después. El sistema se degrada, que es recuperable; no se cae, que no lo es.

> **Un respaldo que nunca se restauró no es un respaldo.** Restaurar el respaldo de producción
> anonimizado en UAT y comprobar que el sistema arranca contra él es parte del plan de pruebas,
> no un favor que alguien hace cuando le sobra tiempo.

---

## 2. El modelo de datos ya juega a favor

Dos decisiones ya tomadas hacen que el trabajo sin conexión sea **seguro**, no un parche:

- **Doble fecha** ([`04-modelo-de-datos.md`](04-modelo-de-datos.md) [§1](04-modelo-de-datos.md#1-principios-del-modelo)): `fecha_movimiento` es
  cuándo ocurrió; `creado_en` es cuándo se digitó. Un movimiento hecho sin señal se **sincroniza**
  cuando vuelve la conexión, pero se **contabiliza** el día en que realmente pasó. La cola sin
  conexión no distorsiona la contabilidad. Es exactamente lo que anticipó
  [ADR-007](adr/ADR-007-pwa.md) y lo que sostiene [ADR-016](adr/ADR-016-flutter-web-pwa.md).
- **Solo escritura** ([ADR-004](adr/ADR-004-base-solo-escritura.md)): nada se edita ni se borra;
  se agrega. Reproducir la cola en orden nunca "pisa" un dato anterior, así que los conflictos de
  sincronización se reducen al mínimo ([§8](#8-conflictos-y-su-resolución)).

---

## 3. Las tres capas

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Cascarón de la app (Service Worker)                        │
│    HTML, CSS, JS e íconos cacheados → la app ABRE sin red      │
├──────────────────────────────────────────────────────────────┤
│ 2. Caché de datos (IndexedDB en el dispositivo)               │
│    Lo que ya se consultó: movimientos, pedidos, catálogos...   │
├──────────────────────────────────────────────────────────────┤
│ 3. Cola de escrituras pendientes (IndexedDB)                  │
│    Cada registro hecho sin red espera aquí su turno de subir   │
└──────────────────────────────────────────────────────────────┘
```

| Capa | Tecnología prevista | Qué guarda | Vida |
|---|---|---|---|
| Cascarón | Service Worker de Flutter Web (`flutter_service_worker.js`) | Archivos de la app | Hasta la próxima versión |
| Caché de datos | IndexedDB | Respuestas ya leídas | Hasta purgar o expirar |
| Cola de escritura | IndexedDB | Operaciones sin confirmar, cada una con su clave de idempotencia | Hasta que la API la acepte, la rechace con motivo o la persona la descarte |

Las tecnologías de la tabla son las del objetivo web, que es el objetivo por defecto. Si algún día
se compila el mismo código a Android, iOS o escritorio, el cascarón deja de hacer falta —la app ya
está instalada— y el almacenamiento local cambia de motor. **Las tres capas y sus reglas no
cambian**: lo que cambia es dónde se guarda, no qué se garantiza.

---

## 4. Lecturas sin conexión

- **Con red:** la app pide a `emprende_api` y, de paso, **guarda una copia** en la caché de datos
  (estrategia *stale-while-revalidate*: muestra lo cacheado al instante y refresca por detrás).
- **Sin red:** la app lee directamente de la caché y marca la pantalla con un aviso visible
  (**"Sin conexión — mostrando datos guardados"**) para que nadie confunda una cifra vieja con la
  actual.
- **Qué se cachea:** lo que la persona ya consultó (su día a día). No se precargan datos que su
  rol no puede ver: la caché **nunca** contiene más de lo que Row Level Security ya le entregó a
  través de la API ([ADR-012](adr/ADR-012-identidad-a-postgres.md)).

---

## 5. Escrituras sin conexión (la cola)

1. La persona decide la acción. **En ese instante** se genera su **clave de idempotencia**
   (UUID v4) y la intención se guarda en IndexedDB **con la clave adentro**, antes de intentar
   cualquier envío.
2. La interfaz confirma con un estado **"Pendiente de sincronizar"** (no un "listo" que mentiría).
3. Cuando vuelve la red, la cola se **envía en orden**, una operación a la vez, cada una con su
   clave en la cabecera `Idempotency-Key`.
4. Cada operación confirmada por la API se retira de la cola. Si falla, se reintenta con espera
   exponencial y variación aleatoria ([§5.2](#52-cuánto-se-espera-entre-reintentos)).

La app **no valida con reglas propias**: comprueba el descriptor de campos que la API le entregó
con el formulario, y la API vuelve a comprobarlo todo cuando la petición llega. Lo que se encola
es una intención de la persona, no un dato que el front haya dado por bueno.

### 5.1 Por qué la clave se genera antes y no en cada reintento

> **La clave de idempotencia se genera cuando la persona decide la acción, no cuando el
> dispositivo decide reintentar.** Esa es la diferencia entre «reintentar esta operación» y
> «hacer otra operación igual».

Si la clave naciera en cada intento de envío, dos intentos de la misma intención llegarían a la
API como dos gastos distintos, y el reintento —que existe justamente para no perder nada— se
volvería la causa de duplicados. Con la clave guardada junto a la intención pasa lo contrario:
la API reconoce que ya procesó esa clave, devuelve la misma respuesta y no ejecuta nada de nuevo.

Y por eso se guarda **antes** de enviar, no después. Si la aplicación se cierra en el peor
momento posible —justo entre que sale la petición y llega la respuesta— al volver a abrir la cola
ya tiene la operación con su clave, y reintentar es seguro sin que nadie tenga que averiguar si
la primera llegó o no.

Qué hace la API con cada clave —nueva, repetida con los mismos datos, repetida con otros— está en
[`20-contrato-de-api.md`](20-contrato-de-api.md). Aquí solo importa el lado del dispositivo: la
clave se genera una vez, viaja con la intención y no se vuelve a generar nunca.

### 5.2 Cuánto se espera entre reintentos

| Intento | Espera base | Con variación aleatoria |
|---|---|---|
| 1.º | Inmediato | — |
| 2.º | 2 s | entre 1 s y 3 s |
| 3.º | 4 s | entre 2 s y 6 s |
| 4.º | 8 s | entre 4 s y 12 s |
| … | se duplica | ±50 % sobre la base |
| Tope | 5 min | entre 2,5 y 5 min; la variación nunca pasa del tope |

La variación aleatoria no es adorno: evita que todos los reintentos —de este dispositivo y de los
demás— caigan en el mismo instante y martillen un servidor que apenas se está levantando. El
taller tiene pocos dispositivos, así que el riesgo no es una avalancha; es golpear repetido y
sincronizado a algo que ya está frágil.

**No hay número máximo de reintentos.** Una operación no se descarta por cansancio: se queda en
la cola hasta que la API la acepte, hasta que la rechace con un motivo ([§8](#8-conflictos-y-su-resolución)), o hasta que la
persona la descarte a propósito ([§7](#7-purga-de-la-caché-por-el-usuario)). Es la promesa del [§1.1](#11-la-promesa-sin-letra-pequeña), escrita en el comportamiento.

---

### 5.3 La foto del recibo va en la cola, con sus bytes

**Un archivo adjunto es parte de la intención, no algo que se suba aparte cuando haya señal.** El
papel se bota al salir del almacén, así que una foto que solo viviera en memoria se perdería en
cuanto la pantalla se cierre. Por eso la intención de adjuntar se guarda como cualquier otra —con
su clave— y **los bytes se guardan con ella**, ya comprimidos por el dispositivo. Ocupan un tercio
más de lo que pesan, porque se guardan como texto en la misma tabla que el resto.

**Y espera a la suya.** Registrar el movimiento y colgarle el soporte son dos operaciones del
contrato, y la segunda nombra el id de la primera: mandarla antes sería pedirle a la API que
cuelgue algo de un movimiento que todavía no conoce, y el `40400` que respondería sacaría la foto
de la cola por un motivo que no es de nadie. Así que una intención puede declarar que va **detrás
de otra**: no sale hasta que la primera esté confirmada, y si a la primera la rechazan con motivo,
la segunda queda rechazada con ese mismo motivo, guardada y a la vista ([§8](#8-conflictos-y-su-resolución)).

## 6. Detección de conexión y reconexión

| Estado | Cómo se detecta | Qué hace la app |
|---|---|---|
| **En línea** | `navigator.onLine` + un *ping* liviano a `emprende_api` | Lee en vivo; vacía la cola pendiente |
| **Sin conexión** | Falla el *ping* o `offline` | Lee de la caché; encola escrituras; muestra el aviso |
| **Reconectando** | Vuelve `online` | Reintenta la cola con espera exponencial y variación ([§5.2](#52-cuánto-se-espera-entre-reintentos)); al terminar, quita el aviso |

`navigator.onLine` por sí solo miente a veces (dice "en línea" con wifi sin salida). Por eso la
señal real es un *ping* corto al servidor, no solo el estado del navegador.

---

## 7. Purga de la caché por el usuario

En **Configuración → Datos sin conexión**, la persona ve y controla su caché:

| Elemento | Qué muestra / hace |
|---|---|
| Espacio usado | Cuánto ocupa la caché de datos en el dispositivo |
| Última sincronización | Cuándo se actualizó por última vez con el servidor |
| Operaciones pendientes | Cuántas escrituras esperan subir, **cuál es cada una y desde cuándo espera** la más antigua ([§5](#5-escrituras-sin-conexión-la-cola)) |
| **Vaciar caché de datos** | Borra la copia local de lecturas. Se vuelve a llenar al reconectar |
| **Forzar re-sincronización** | Descarta lo cacheado y baja todo de nuevo |

> **Guardia importante:** vaciar la caché **no** descarta la **cola de escrituras pendientes** sin
> una advertencia explícita. Borrar operaciones sin subir es perder registros que nunca llegaron
> al servidor. Si hay pendientes, la app avisa y pide confirmar por separado.

Descartar una operación pendiente es la única forma de que algo no enviado desaparezca, y por eso
la app dice **qué** se va a descartar y **desde cuándo** llevaba esperando, antes de pedir la
confirmación. Es la otra mitad del [§1.1](#11-la-promesa-sin-letra-pequeña): la persona puede decidir tirar algo; el sistema no.

---

## 8. Conflictos y su resolución

Gracias al diseño de solo escritura, los conflictos son raros y su manejo es simple:

| Situación | Resolución |
|---|---|
| Dos dispositivos registran movimientos distintos sin red | Ambos entran al subir; son filas nuevas, no se pisan |
| Se corrige un dato hecho sin conexión | Contra-asiento ([§5.3 del doc 04](04-modelo-de-datos.md#53-corrección-por-contra-asiento)), nunca edición |
| La API rechaza una operación de la cola (regla de negocio, permiso) | Queda marcada como **"No sincronizada"** con el mensaje que la API dictó; la persona la revisa, no se pierde en silencio |

No hay "última escritura gana" que borre trabajo: **nada se sobrescribe**, así que no hay nada que
perder en una fusión.

---

## 9. Seguridad de los datos en el dispositivo

Trabajar sin conexión implica guardar datos en el equipo, y eso tiene un costo que hay que nombrar:

- **RLS protege el servidor, no el dispositivo.** Lo que la caché guarda ya pasó por RLS, pero una
  vez en el equipo, quien tenga acceso al equipo desbloqueado puede verlo. Por eso solo se cachea
  lo que ese rol ya podía ver, y la caché se puede purgar ([§7](#7-purga-de-la-caché-por-el-usuario)).
- **Cerrar sesión limpia la caché de datos y la cola confirmada.** No debe quedar información del
  negocio en un dispositivo compartido tras salir.
- **Nada de secretos en la caché.** Contraseñas y tokens de larga vida no se cachean; la sesión se
  maneja con los mecanismos del proveedor ([ADR-009](adr/ADR-009-login-por-usuario.md)).

Este punto se cruza con [`11-riesgos-y-proteccion-de-datos.md`](11-riesgos-y-proteccion-de-datos.md)
y debe revisarse allí cuando se implemente.

---

## 10. Lo que este diseño NO cubre (todavía)

| Tema | Estado |
|---|---|
| Cifrado en reposo de la caché local | A evaluar en la fase de construcción ([§9](#9-seguridad-de-los-datos-en-el-dispositivo)) |
| Sincronización en segundo plano (*Background Sync API*) | Deseable; soporte desigual en iOS |
| Trabajo colaborativo en tiempo real | Fuera de alcance; el negocio es de pocas personas |
| Límite de tamaño de la caché y expiración por antigüedad | Se define con datos reales de uso |

---

## 11. Estado y siguiente paso

Diseño listo; **implementación pendiente de que exista la aplicación web** (Flutter, objetivo web
por defecto, ver [ADR-016](adr/ADR-016-flutter-web-pwa.md) y
[ADR-017](adr/ADR-017-api-en-java.md)). Cuando se andamie la app, esta especificación se
traduce en: el service worker que genera Flutter Web para el cascarón, una capa de caché y cola
sobre `cliente_api.dart` —el único punto de salida a la red del front, coherente con la
arquitectura hexagonal, [ADR-002](adr/ADR-002-arquitectura-hexagonal.md)— y la pantalla de
Configuración del [§7](#7-purga-de-la-caché-por-el-usuario).

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](07-arquitectura.md "07 · Arquitectura técnica") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](20-contrato-de-api.md "20 · Contrato de la API")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [16 · Base de datos: snapshots y datos de prueba](16-base-de-datos-y-snapshots.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [18 · Distribución multiplataforma y automatización](18-distribucion-y-pipelines.md)
