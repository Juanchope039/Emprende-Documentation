# ADR-018 · Tres partes, y el front no toma decisiones

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.2](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-018-front-sin-decisiones.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-10-30 | [Arquitectura](../INDICE.md#etiqueta-arquitectura) · [Front](../INDICE.md#etiqueta-front) |

> **La decisión sigue vigente; un dato del cuerpo dejó de serlo.** Donde abajo dice «Java 21», la
> API ya es **Java 25**: lo cambió [ADR-024](ADR-024-java-25-y-gradle.md), que reemplazó a
> [ADR-017](ADR-017-api-en-java.md). Nada de lo que este ADR decide depende de esa versión. El
> cuerpo se conserva tal como se escribió.

## Contexto

El desarrollo queda en **tres partes**: front, API y capa de datos. Y sobre ellas se pide una
regla que no admite matices: **el front solo hace peticiones, no toma decisiones.** Pide, recibe
y muestra. La API hace toda la lógica, decide y dicta los errores que se muestran.

Eso choca de frente con [ADR-015](ADR-015-validacion-tres-capas.md), escrito el mismo día, que
puso las mismas reglas de negocio en tres sitios: la base, la API y el formulario del front. Su
tercera capa —el front con su propia copia de las reglas— es exactamente lo que ahora no puede
existir.

La convención del proyecto dice que un ADR no se modifica. Así que [ADR-015](ADR-015-validacion-tres-capas.md) queda **reemplazado** y
este recoge el modelo correcto. Lo que [ADR-015](ADR-015-validacion-tres-capas.md) acertó —la base como único juez, el contrato de
errores, la prueba que recorre `pg_constraint`— **se conserva palabra por palabra**. Lo que cambia
es únicamente qué hace el front.

El problema real a resolver: si el front no tiene ninguna regla, ¿cómo avisa que un valor está
mal sin gastar un viaje por datos móviles en un taller con señal intermitente?

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| El front valida con su copia de las reglas (lo de [ADR-015](ADR-015-validacion-tres-capas.md)) | Respuesta instantánea, cero costo de red | Es una regla de negocio viviendo en el cliente: se separa de la de la API con el tiempo y contradice el pedido explícito de que el front no decida |
| El front no valida nada y todo va por petición | Una sola fuente de verdad, imposible de que se separe; el front queda trivial | Cada error de dedo cuesta un viaje de ida y vuelta por datos móviles; con señal intermitente el formulario se vuelve inusable |
| **La API envía el descriptor del formulario y el front lo pinta** | Respuesta inmediata sin que el front sea dueño de ninguna regla; las reglas viajan como datos desde donde ya viven | Hay que definir y versionar el formato del descriptor, y generarlo del mismo sitio que las validaciones del servidor |

## Decisión

### Las tres partes

```
┌──────────────────────┐  HTTPS/JSON   ┌──────────────────────┐   JDBC   ┌──────────────────┐
│ emprende_front         │ ────────────▶ │ emprende_api           │ ───────▶ │ Capa de datos    │
│ Flutter multiplat.   │ ◀──────────── │ Java 21 · Spring Boot│ ◀─────── │ PostgreSQL       │
│ web por defecto      │               │ TODA la lógica       │          │ Supabase         │
│ pide, recibe, muestra│               │ dicta los mensajes   │          │ siempre en línea │
└──────────────────────┘               └──────────────────────┘          └──────────────────┘
```

| Parte | Qué es | Qué hace | Qué NO hace |
|---|---|---|---|
| **emprende_front** | Flutter, un solo código; objetivo por defecto **web**, y el mismo código compila a Android, iOS y escritorio | Pide, recibe y muestra. Pinta lo que la API le dicta | **No decide nada.** Ni reglas, ni permisos, ni mensajes, ni cálculos de negocio |
| **prisma_api** | Java 21 con Spring Boot ([ADR-017](ADR-017-api-en-java.md)) | Toda la lógica. Toma todas las decisiones. Dicta qué mensaje se muestra y cuándo | No confía en el front. No decide permisos que le tocan a la base |
| **Capa de datos** | PostgreSQL en Supabase, más migraciones, funciones de negocio, índices, particiones y el pool de conexiones | Garantiza lo que no se puede romper: restricciones, RLS, atomicidad, durabilidad | No es un servicio desplegable. La API le habla directo |

**La capa de datos no es un servicio aparte.** Se consideró un tercer servicio desplegable entre
la API y la base y se descartó por una razón concreta: **la identidad del usuario tiene que llegar
viva hasta PostgreSQL** ([ADR-012](ADR-012-identidad-a-postgres.md)). Cada salto que atraviesa es
un sitio más donde puede perderse, y si se pierde, RLS deja de proteger sin fallar y sin avisar.
Es una de las tres partes **por responsabilidad, no por despliegue**; y como
[ADR-002](ADR-002-arquitectura-hexagonal.md) exige puertos y adaptadores, el día que haya de
verdad varias bases se extrae como servicio sin rehacer la API.

### Dos capas deciden, una pinta

> **El front no contiene ni una sola regla de negocio.** Ni un umbral, ni un porcentaje, ni una
> comprobación de permisos, ni un catálogo de mensajes, ni una cifra calculada. Si algo hay que
> decidir, lo decide la API y el front pinta el resultado.

Esto **reemplaza el modelo de tres capas de [ADR-015](ADR-015-validacion-tres-capas.md)**:

| Capa | Qué hace | Se puede saltar |
|---|---|---|
| **PostgreSQL** | **Decide.** `NOT NULL`, `CHECK`, `FOREIGN KEY`, `UNIQUE`, `EXCLUDE`, dominios, triggers, RLS, `REVOKE DELETE` | **No** |
| **`emprende_api`** | **Decide.** Las mismas reglas, otra vez, antes de ir a la base; traduce el error de la base a mensaje en español | Sí, si alguien llama a la base por fuera |
| **`emprende_front`** | **Pinta.** Aplica el descriptor que la API le mandó y muestra el mensaje que la API redactó | Sí, y no importa: no autoriza nada |

Sigue siendo cierto lo que decía [ADR-015](ADR-015-validacion-tres-capas.md) y no se toca: si las capas discrepan, **gana la base**;
toda restricción lleva nombre explícito; existe una tabla única de traducción de restricción a
mensaje; un error de la base que no esté en esa tabla devuelve 500 y se registra como defecto; y
la prueba automática recorre `pg_constraint` para que ninguna restricción quede sin mensaje.

La diferencia está en la tercera línea. Antes el front tenía **su copia** de la regla. Ahora
recibe la regla **como dato** y no sabe qué significa.

### Qué desaparece del front

| Hoy en el mockup | A partir de ahora |
|---|---|
| `data-ger` decide qué se muestra según el tipo | **La API devuelve el menú** que esa sesión puede ver. El front lo pinta |
| Mensajes de error escritos en el cliente | **La API dicta el mensaje**, ya redactado en español y listo para mostrar |
| Reglas de validación en el formulario | **La API envía el descriptor** del formulario |
| Cálculo de totales en pantalla | **La API los calcula** y los manda listos |

Esto **no reemplaza a RLS**: sigue siendo defensa en profundidad. Que la API no mande una opción
de menú es comodidad; que la base no devuelva la fila es seguridad.

### El descriptor de formulario

Las reglas viajan **como datos**, no como código:

```json
{
  "campo": "valor",
  "etiqueta": "Valor del gasto",
  "tipo": "dinero",
  "obligatorio": true,
  "minimo": 1,
  "maximo": 99999999,
  "teclado": "numerico",
  "ayuda": "En pesos, sin centavos",
  "mensajes": {
    "obligatorio": "Escribe cuánto fue el gasto.",
    "minimo": "El gasto tiene que ser mayor que cero."
  }
}
```

El front **no sabe** que el valor debe ser mayor que cero: sabe que hay una regla llamada `minimo`
con valor 1 y un mensaje que mostrar si no se cumple.

> **El descriptor se genera del mismo sitio que las validaciones del servidor.** No se escribe a
> mano dos veces: si se escribiera dos veces, se separarían, que es justo lo que este diseño
> evita. Y la API **vuelve a comprobar la regla cuando llega la petición, siempre**, porque un
> descriptor entregado al cliente es un dato que el cliente puede alterar.

## Justificación

**El descriptor es la clave de la decisión.** Resuelve la tensión que parecía obligar a elegir
entre respuesta inmediata y front sin reglas: las reglas siguen siendo de la API, pero viajan como
datos, así que hay aviso instantáneo **sin que el front sea dueño de ninguna regla**. Lo que el
front ejecuta es un intérprete genérico —obligatorio, mínimo, máximo, tipo—, no el conocimiento
del negocio.

**Una regla nueva deja de costar tres ediciones.** Con [ADR-015](ADR-015-validacion-tres-capas.md) había tres sitios que podían
separarse. Ahora hay dos que deciden, y el tercero recibe lo que le dicten. El riesgo que [ADR-015](ADR-015-validacion-tres-capas.md)
declaraba como su consecuencia negativa se reduce a la mitad sin perder el aviso rápido.

**Cambiar un mensaje deja de exigir publicar el front.** El texto que ve la empleada vive en el
catálogo de la API. Corregir una redacción es un despliegue de API, no una versión nueva de la
aplicación esperando a que cada dispositivo la recoja.

**La capa que decide es la que se puede auditar.** Revisar qué reglas rigen el sistema pasa a ser
mirar la base y la API. El front deja de ser un sitio donde buscar.

**Es el mismo criterio de [ADR-006](ADR-006-rls-por-rol.md) llevado al extremo que le
corresponde:** lo que decide vive donde nadie lo puede esquivar. Un `if` en el cliente, como un
botón oculto, es comodidad y nunca garantía.

## Consecuencias

- **Positivas:** ninguna regla de negocio vive en el dispositivo; los mensajes se corrigen sin
  publicar el front; el aviso al escribir sigue siendo inmediato gracias al descriptor; hay dos
  sitios que mantener sincronizados en vez de tres; y el front se vuelve mucho más simple de
  probar, porque lo único que hace es pintar datos.
- **Negativas:** **el descriptor es un contrato nuevo que hay que definir, versionar y mantener**,
  y mientras se decide su formato el front no puede avanzar en formularios. Una pantalla sin señal
  no puede estrenar un formulario que nunca recibió su descriptor: hay que guardar en caché el
  último descriptor conocido y decir qué pasa cuando no hay ninguno. El primer ingreso a cada
  pantalla gasta una petición más para traer descriptor y menú. Y si el intérprete del front
  crece —condiciones, campos que dependen de otros—, termina siendo un lenguaje de reglas
  disfrazado: **hay que vigilar que el descriptor no se vuelva código**, porque entonces la
  decisión se habría revertido sin que nadie la revirtiera.

## Referencias

- [ADR-015 · Validación en tres capas, con la base como juez](ADR-015-validacion-tres-capas.md) —
  reemplazado por este; su contrato de errores se conserva.
- [ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API](ADR-017-api-en-java.md)
- [ADR-012 · La API propaga la identidad a PostgreSQL](ADR-012-identidad-a-postgres.md) — la razón
  por la que la capa de datos no es un servicio aparte.
- [ADR-006 · Permisos con Row Level Security](ADR-006-rls-por-rol.md)
- [ADR-002 · Arquitectura hexagonal con regla de dependencias verificada](ADR-002-arquitectura-hexagonal.md)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](../10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [13](../13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [Contrato](../../contrato/README.md "Contrato de la API · v0.36.0") · [ADR-015](ADR-015-validacion-tres-capas.md "ADR-015 · Validación en tres capas, con la base como juez") · [ADR-019](ADR-019-contrato-de-respuesta.md "ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos") · [ADR-022](ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [ADR-023](ADR-023-tres-repositorios.md "ADR-023 · Tres repositorios y el contrato como artefacto versionado") · [ADR-033](ADR-033-service-role-solo-en-auth.md "ADR-033 · La clave de servicio entra, pero solo para crear identidades") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
