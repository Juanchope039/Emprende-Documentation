# 20 · Contrato de la API

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [3.1.1](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/20-contrato-de-api.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-15 | 2026-10-17 | [Contrato](INDICE.md#etiqueta-contrato) · [API](INDICE.md#etiqueta-api) · [Front](INDICE.md#etiqueta-front) |

Qué forma tiene toda respuesta de `prisma_api`, cómo se numeran los errores y qué cabeceras lleva
cada petición. Es el documento de referencia para quien vaya a construir o a consumir la API.

> **Construcción: en parte.** Todo lo que este documento describe —el sobre, el catálogo, el
> descriptor, la idempotencia y el canal firmado— está construido de los dos lados. De las
> operaciones, el contrato acordado va por el `0.22.0` y la copia fijada de `prisma_api` lo sigue;
> **qué rutas sirve ya la API y cuáles todavía no, lo dice su README**, no este documento, para que
> un número no envejezca en dos sitios ([ADR-039](adr/ADR-039-cada-regla-en-un-solo-sitio.md)).
> Este documento fijó el contrato antes de escribir el primer controlador, porque un contrato
> acordado después es un contrato que ya se rompió en tres sitios distintos.

**Este documento no repite la arquitectura.** Cómo está construido el sistema por dentro —las
capas, la regla de dependencias, cómo la identidad llega hasta PostgreSQL— está en
[`07-arquitectura.md`](07-arquitectura.md). Aquí solo está **lo que viaja por el cable**.

> **Ninguna operación usa `GET`** ([ADR-030](adr/ADR-030-contrato-sin-get.md)). Toda la API cuelga
> de `/api/v0`; las lecturas viajan por `POST` bajo `/api/v0/consultas/…`, con sus datos en el cuerpo
> y no en la URL, y las escrituras se quedan en su recurso. El `v0` es el MAJOR de la API y pasa a
> `v1` con la primera publicación en producción ([ADR-014](adr/ADR-014-semver.md)).
> Fuera del prefijo y fuera de la regla quedan los estáticos del front, Swagger, `/error` y las
> sondas de Actuator: no son operaciones del contrato.
>
> **Y tres verbos, no uno.** «Sin `GET`» no quiere decir «todo por `POST`»: del `0.22.0`, **37
> lecturas y 31 escrituras van por `POST`, 22 escrituras por `PUT` y una operación por `DELETE`**.
> El `PUT` es para la escritura cuyo id lo genera quien registra, junto con la clave de idempotencia
> ([§8.1](#81-éxito--20100)), y el `DELETE` es cerrar la sesión ([§6.5](#65-la-sesión-qué-vive-dónde-y-qué-pasa-cuando-se-recarga-la-página)). Son 91 operaciones en 91 rutas.

---

## 1. El sobre de respuesta

### 1.1 Las tres claves

**Toda** respuesta de la API, con éxito o con error, tiene exactamente estas tres claves. Ni una
más, ni una menos, ni en un orden distinto:

```json
{
  "status": 20100,
  "mensaje": "Gasto registrado.",
  "data": { }
}
```

| Clave | Tipo | Regla |
|---|---|---|
| `status` | Entero de cinco dígitos | Siempre presente. Ver [§2](#2-el-código-de-cinco-dígitos) |
| `mensaje` | Texto | Siempre presente. **En español, listo para mostrarle a una persona del taller.** Nunca jerga técnica, nunca un nombre de restricción, nunca una traza |
| `data` | Cualquiera | El contrato propio de cada operación. `null` cuando no hay datos que devolver |

> **El sobre es el mismo siempre, y por eso el front puede ser tonto.** Si la respuesta de error
> tuviera otra forma que la de éxito, el cliente necesitaría saber cuándo esperar cuál —y saber
> eso ya es decidir—. Con un solo sobre, el front lee `status`, muestra `mensaje` y pinta `data`
> sin entender nada del negocio.

La decisión completa, con las alternativas que se descartaron, está en
[ADR-019](adr/ADR-019-contrato-de-respuesta.md).

El `mensaje` lo dicta la API, no el front. Es la consecuencia directa de que el front no contenga
ningún catálogo de textos: el día que una regla cambie, cambia el mensaje en un solo sitio y todos
los clientes —web, Android, escritorio— lo dicen igual sin recompilar nada.

### 1.2 Los errores de campo van dentro de `data`

Un formulario con tres campos malos necesita decir cuáles son los tres. Eso **no puede agregar una
cuarta clave al sobre**: viaja dentro de `data`, en una lista llamada `errores`.

```json
{
  "status": 42200,
  "mensaje": "Revisa los datos.",
  "data": {
    "errores": [
      { "campo": "valor", "mensaje": "El valor tiene que ser mayor que cero." }
    ]
  }
}
```

| Clave dentro de `errores[]` | Qué es |
|---|---|
| `campo` | El mismo nombre que la API usó en el descriptor del formulario ([§4](#4-el-descriptor-de-formulario)). Así el front sabe junto a qué caja pintar el aviso |
| `mensaje` | El texto en español que se muestra debajo de esa caja |

El `mensaje` de arriba —el del sobre— resume; los de `errores` señalan. Los dos vienen de la API y
ninguno se escribe en el cliente.

---

## 2. El código de cinco dígitos

### 2.1 Cómo se compone

**`HTTP(3) + caso(2)`.** Los tres primeros dígitos son el código HTTP de la respuesta; los dos
últimos, el caso concreto dentro de ese código.

```
2 0 1 0 0                      4 2 2 1 3
└───┘ └─┘                      └───┘ └─┘
 201   00  → genérico           422   13  → módulo de usuarios, caso 3
```

Que los tres primeros dígitos sean el HTTP no es adorno: significa que el `status` del sobre y el
código de la respuesta HTTP **nunca pueden contradecirse**, porque uno se deriva del otro. Un `404`
con `status` `20000` es imposible de escribir por accidente.

### 2.2 Los códigos base

Diez códigos transversales, los que aparecen en cualquier módulo. **Todos terminan en `00`**,
que es el caso reservado al genérico de cada estado HTTP:

| Código | HTTP | Significado |
|---|---|---|
| `20000` | 200 | Consulta correcta |
| `20100` | 201 | Recurso creado |
| `40000` | 400 | Petición mal formada |
| `40100` | 401 | No autenticado |
| `40300` | 403 | Sin permiso |
| `40400` | 404 | No existe |
| `40900` | 409 | Conflicto de estado |
| `42200` | 422 | Los datos no pasan las reglas |
| `50000` | 500 | Error no previsto |
| `50300` | 503 | El sistema no está disponible |

> **Por qué `50300` no es un `50000`.** El genérico dice «Algo salió mal. Intenta de nuevo en un
> momento», y hay una familia de fallos para la que esa frase es falsa en las dos mitades: cuando un
> servicio del que la API depende no contesta, o cuando le falta una variable para hablar con él, no
> ha pasado nada imprevisto —está previsto y tiene nombre— y reintentar no arregla nada, porque una
> variable sin cargar sigue sin cargarse un momento después. Que los dos casos compartan código es a
> propósito: para quien está delante son la misma situación y no puede hacer nada distinto en
> ninguna, así que lo único útil es que avise. Cuál de los dos fue queda en el registro del servidor,
> que es donde lo lee quien administra.

La idempotencia ([§5](#5-idempotencia)) y el canal firmado ([§6](#6-el-canal-firmado)) agregan los suyos, y están listados en esas secciones.

### 2.3 El límite del formato, dicho con honestidad

Este formato tiene dos límites reales y hay que escribirlos, no descubrirlos:

1. **Solo caben 99 casos por cada estado HTTP.**
2. **El código no dice de qué módulo vino.** `42207` no se lee solo.

El segundo se mitiga sin cambiar el formato: **los dos dígitos de caso se reparten por rango de
módulo, igual en todos los estados HTTP.**

### 2.4 Los rangos por módulo

| Rango | Módulo |
|---|---|
| `00` | **Genérico, sin módulo.** El caso base de cada estado HTTP |
| `01`–`09` | Sesión, seguridad y transporte |
| `10`–`19` | Usuarios y cargos |
| `20`–`29` | Movimientos y cuentas |
| `30`–`39` | Pedidos y clientes |
| `40`–`49` | Productos y costeo |
| `50`–`59` | Nómina y adelantos |
| `60`–`69` | Reportes y cierres |
| `70`–`79` | Exportación, importación y respaldo |
| `80`–`89` | Cotizaciones |
| `90`–`99` | Capital y patrimonio: inversiones, aportes, retiros, pro-labore y sobres |

Así `42213` se lee de un vistazo: **HTTP 422, módulo de usuarios, caso 3 de ese módulo.**

> **Desde el contrato `v0.17.0` ya no queda ningún rango sin códigos.** El `50`–`59` de nómina, el
> `80`–`89` de cotizaciones y el `70`–`79` los estrenó a la vez la tarea
> [8.11](08-plan-de-desarrollo.md#tarea-8-11), con diecisiete códigos. El tercero **cambió de nombre**: era
> «Exportación y respaldo» y pasó a ser «Exportación, importación y respaldo», porque importar es la
> otra mitad de lo mismo y la matriz del [03](03-requisitos-y-bdd.md) ya los tenía en la misma fila. **El `60`–`69` fue el
> último en llenarse**, y lo estrena la [6.10](08-plan-de-desarrollo.md#tarea-6-10) con dos códigos del cierre mensual —`40960` y
> `40961`— y dos de las consultas del Inicio —`42260` y `42261`—.
> **Ningún módulo ha agotado un estado HTTP**: el más lleno es movimientos y cuentas, con siete
> casos de `422` de los diez que le caben.
>
> **El `90`–`99` era la reserva, y desde el contrato `v0.13.0` es de Capital y patrimonio** (tarea
> [7.9](08-plan-de-desarrollo.md#tarea-7-9)). El reparto de [ADR-019](adr/ADR-019-contrato-de-respuesta.md) no le había dado rango a un módulo que el plan sí tiene, y el
> [21 §4.3](21-trabajo-en-paralelo.md#43-fase-2--rebanadas-verticales-sprints-3-a-8) le había puesto el `70`–`79`, que es de Exportación y respaldo. No cabía en el de
> Movimientos: al `422` del `20`–`29` le quedaban tres casos, y Capital necesitó cinco. Con esto
> **cada módulo del plan tiene su rango y ya no queda ninguno reservado.**

> **El caso `00` está reservado al genérico y no pertenece a ningún módulo.** Sin esa reserva, los
> diez códigos base habrían caído dentro del rango de Sesión y seguridad y `42200` habría
> afirmado ser de un módulo al que no pertenece. El reparto por rangos empieza en `01`.

El rango `01`–`09` cubre **sesión, seguridad y transporte**: lo que ocurre *antes* de que la
petición llegue a un módulo de negocio. Ahí viven los códigos del canal firmado —`40101` firma
inválida, `40102` marca de tiempo fuera de ventana, `40103` nonce repetido— y los de idempotencia
—`40901` clave repetida con petición distinta, `40902` operación en curso—, y los de la cuenta de
administrador del primer arranque, `40303` y `40903`. No son excepciones al
reparto: son un módulo más, el del transporte.

Y el primer límite deja de ser un problema por lo que significa cuando aparece:

> **Si un módulo agota su rango en un estado HTTP, el formato no se quedó corto: ese estado está
> haciendo demasiado trabajo.** Diez casos distintos de 422 en un solo módulo quieren decir que
> varios de ellos merecían un estado más preciso —409, 404, 403— y se metieron todos en el mismo
> cajón. La solución es repartirlos, no ampliar el código.

---

## 3. El catálogo

### 3.1 Uno solo, y de él sale todo lo demás

Existe **un solo catálogo** de códigos, y vive en `prisma_api`. Cada entrada lleva código, HTTP,
módulo, mensaje en español y cuándo se emite.

De ese catálogo salen tres cosas, **generadas, nunca copiadas a mano**:

| # | Qué se genera | Por qué de ahí y no aparte |
|---|---|---|
| 1 | Las respuestas de la API | El `status` y el `mensaje` que viajan en el sobre son los del catálogo, sin intermediario |
| 2 | La documentación de Swagger ([§7](#7-swagger)) | Documentar a mano qué códigos devuelve una operación se desactualiza el primer día en que alguien tiene prisa |
| 3 | La tabla de traducción de restricciones de base de datos que fijó [ADR-015](adr/ADR-015-validacion-tres-capas.md) —reemplazado por [ADR-018](adr/ADR-018-front-sin-decisiones.md), que conserva intacto ese contrato de errores— | Un `23514 check_violation` tiene que salir como mensaje en español, y ese mensaje es el mismo del catálogo |

Copiar sería tenerlo tres veces, y tres copias de una lista se separan siempre: la pregunta no es
si pasa, es en qué mes.

### 3.2 La prueba que lo mantiene honesto

Es la prueba `C-03` de [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md), y comprueba las dos
direcciones:

| Dirección | Qué comprueba | Qué significa si falla |
|---|---|---|
| Código → catálogo | **Ningún código emitido por el código fuente falta en el catálogo** | Alguien inventó un `status` en un controlador. Sale al taller sin mensaje revisado y sin quedar en Swagger |
| Catálogo → código | **Ningún código del catálogo quedó sin usar** | Un mensaje muerto. Peor que sobrar: esconde que el caso que lo emitía desapareció |

> **La segunda dirección es la que casi nadie escribe, y es la que descubre las regresiones.** Un
> código huérfano en el catálogo no rompe nada hoy: solo deja creyendo que el sistema todavía
> cubre un caso que dejó de cubrir hace cuatro versiones.

---

## 4. El descriptor de formulario

### 4.1 El problema que resuelve

Que el front no decida no puede significar que cada campo mal escrito cueste un viaje por datos
móviles en un taller con señal intermitente. La salida no es devolverle las reglas al cliente: es
que **las reglas viajen como datos**.

La API entrega, junto a cada formulario, el descriptor de sus campos:

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

| Clave | Para qué sirve |
|---|---|
| `campo` | El nombre con el que viaja el dato, y con el que vuelve un error de [§1.2](#12-los-errores-de-campo-van-dentro-de-data) |
| `etiqueta` | Lo que se pinta encima de la caja |
| `tipo` | Cómo se presenta y se formatea: `dinero`, `texto`, `fecha`, `lista`, `casilla`, `clave`, `numero` |
| `obligatorio` | Si puede quedar vacío |
| `minimo` · `maximo` | Los límites, como valores, no como condición programada |
| `teclado` | Qué teclado abre el celular. Es presentación pura |
| `ayuda` | La línea gris debajo de la caja |
| `mensajes` | Qué decir cuando una regla no se cumple, ya redactado en español |
| `opciones` | En una lista cerrada, las opciones en su orden: cada una con el `valor` que viaja y la `etiqueta` que se pinta |
| `origen` | En una lista que sale de datos, la ruta de consulta del contrato que la llena |

### 4.2 Por qué esto no es devolverle las reglas al front

> **El front no sabe que el valor debe ser mayor que cero.** Sabe que hay una regla llamada
> `minimo` con valor `1` y un texto que mostrar si el contenido de la caja es menor. La regla
> sigue siendo de la API, y **la API la vuelve a comprobar cuando llega la petición, siempre.**

La diferencia es toda la diferencia: el front interpreta un dato, no ejecuta una decisión. El día
que el mínimo cambie a otra cifra, cambia en la API y el front lo obedece sin enterarse.

Y el descriptor **se genera del mismo sitio que las validaciones del servidor**. No se escribe a
mano dos veces: si se escribiera dos veces, se separarían, que es justo lo que este diseño evita.

La decisión de que el front no contenga ninguna regla está en
[ADR-018](adr/ADR-018-front-sin-decisiones.md).

### 4.3 Cómo se pide y qué forma tiene

> **Construcción: construido** desde el contrato `v0.2.0` (tarea [0.17](08-plan-de-desarrollo.md#tarea-0-17)). El catálogo de
> formularios está vacío hasta que llegue el primero de verdad, con las cuentas y categorías de la
> tarea [1.10](08-plan-de-desarrollo.md#tarea-1-10); el mecanismo y su forma ya están fijados para que el trabajo del front construya el
> renderizador (tarea [1.18](08-plan-de-desarrollo.md#tarea-1-18)) contra un servidor simulado. **`opciones`, `origen` y `casilla` están
> acordados desde el contrato `v0.3.0`** (tarea [1.17](08-plan-de-desarrollo.md#tarea-1-17)) y la API los construye con la 1.10, junto con los
> formularios `cuenta` y `categoria` que los usan. **El tipo `clave` entró con el contrato
> `v0.4.0`** (tarea [2.19](08-plan-de-desarrollo.md#tarea-2-19)), porque lo necesitan los formularios `acceso` y `cambio-de-clave`: el front
> lo pinta desde la [2.6](08-plan-de-desarrollo.md#tarea-2-6) y la API lo genera con la [2.1](08-plan-de-desarrollo.md#tarea-2-1). **Y el tipo `numero` entró con el contrato
> `v0.12.0`** (tarea [5.10](08-plan-de-desarrollo.md#tarea-5-10)), porque los minutos de trabajo de un producto no son ninguno de los
> seis anteriores y sin un tipo que los exprese el front no puede pintar el campo; con él, el
> anticipo de un pedido deja de declararse `porcentaje`, que nunca existió. **La API lo genera
> desde la tarea [5.2](08-plan-de-desarrollo.md#tarea-5-2)**, en los minutos del formulario «producto», **y el front lo pinta desde la
> [7.3](08-plan-de-desarrollo.md#tarea-7-3)**, que lo estrena en las horas del formulario «prolabore»: una cantidad con decimales,
> que se escribe con coma y viaja como número.

```http
POST /api/v0/consultas/formularios HTTP/1.1
Host: api.prisma.com
Content-Type: application/json
Idempotency-Key: 0c8a5e21-4b73-4f16-9d40-7a1e5c2b9f63

{ "nombre": "movimiento" }
```

```json
{
  "status": 20000,
  "mensaje": "Consulta correcta.",
  "data": {
    "formulario": "movimiento",
    "campos": [
      {
        "campo": "valor",
        "etiqueta": "Valor",
        "tipo": "dinero",
        "obligatorio": true,
        "minimo": 1,
        "teclado": "numerico",
        "mensajes": {
          "obligatorio": "Escribe cuánto fue. Un movimiento de $0 no dice nada.",
          "minimo": "El valor tiene que ser mayor que cero."
        }
      }
    ]
  }
}
```

Es **uno de los seis campos** que trae «movimiento» —siete, si la petición dice que el tipo es
transferencia—, y ahí se ve la primera regla de abajo: como el
valor no tiene tope, ni `maximo` ni su mensaje viajan —no viajan en `null`, sencillamente no están—.

Un nombre que no existe responde `404` con `40400`. Y **un cuerpo sin `nombre`, o con el nombre en
blanco, responde `400` con `40000`**: el esquema lo declara obligatorio, y una petición que no nombra
ningún formulario no se entiende. No es `40400` —no se buscó nada, así que decir «no se encontró»
sería mentir— ni `42200`, que es para datos que llegan bien formados y no pasan las reglas.

| Regla de la forma | Por qué |
|---|---|
| `campos` llega **en el orden en que se pinta** | El front no reordena. Qué va primero es una decisión de la pantalla aprobada, no del cliente |
| **Una clave que no aplica no viaja**, ni siquiera en `null` | Un campo sin máximo no lleva `maximo`. El front no tiene que distinguir «no hay límite» de «el límite es nulo» |
| `tipo` es uno de `dinero`, `texto`, `fecha`, `lista`, `casilla`, `clave`, `numero` | Cada uno exige un tipo concreto en la API: `dinero` solo acepta pesos enteros ([ADR-003](adr/ADR-003-dinero-entero.md)) y `casilla`, un sí o un no. Una `clave` es un texto que se pinta oculto, con un botón para mostrarlo. Un `numero` es una cantidad que **no es plata** —las horas productivas de un mes, un porcentaje—, y por eso no es `dinero`: ahí sí caben decimales |
| `minimo` y `maximo` se leen según el tipo | En `dinero` son pesos; en `texto` y en `clave`, caracteres; en `numero`, la cantidad misma |
| `teclado` es `numerico` o `texto` | Y no viaja en `fecha`, `lista` ni `casilla`, que se eligen y no abren teclado; una `clave` abre el de texto y un `numero`, el numérico |
| **Una `lista` trae `opciones` o `origen`, nunca los dos ni ninguno** | Las opciones fijas —el tipo de una cuenta— viajan en el descriptor. Las que salen de datos —la categoría madre— dicen de qué ruta salen: una consulta del contrato, bajo `/api/v0/consultas/…`, cuya `data` es una lista de objetos con `id` y `nombre`, y el `id` es el valor. **El front no decide ni los valores ni a dónde pedirlos**, y la API vuelve a comprobar que lo elegido está entre ellos |
| **Una elección puede cambiar qué campos trae el formulario**, y entonces la petición la lleva | `{"nombre": "movimiento", "tipo": "transferencia"}` contesta con el medio de pago de origen y el de destino; sin `tipo`, o con cualquier otro, contesta con uno solo. La elección viaja tal como la hizo quien registra, y **quien decide qué campos aplican sigue siendo la API**: el front vuelve a pedir el formulario y pinta lo que llegue, sin esconder nada por su cuenta ([§4.4](#44-las-reglas-que-caben-y-por-qué-no-caben-más)). Una elección que el formulario no conoce se ignora, no responde error |
| `mensajes` trae un texto **por cada regla que el campo tiene** | Es el mismo texto que llega en `data.errores` cuando esa regla falla en el servidor ([§8.2](#82-los-datos-no-pasan-las-reglas--42200)), y la prueba `DescriptorContraValidacionTest` lo compara palabra por palabra |

### 4.4 Las reglas que caben, y por qué no caben más

El descriptor expresa **tres reglas y ninguna más**: `obligatorio`, `minimo` y `maximo`.

No es una limitación pendiente de resolver: es el borde que impide que el descriptor se convierta
en un lenguaje de reglas disfrazado, que es justo lo que
[ADR-018](adr/ADR-018-front-sin-decisiones.md) pide vigilar. Un formato de correo, una expresión
regular o una regla que mira dos campos a la vez son **código**, y el día que el front los
interpretara volvería a ser dueño de reglas.

Por eso la API **no arranca** si un formulario usa una regla que el descriptor no sabe expresar,
o si una regla no trae su mensaje redactado en español. El fallo dice qué campo y qué regla:

> *El campo «correo» del formulario «contacto» no se puede describir: usa @Email, que el
> descriptor no sabe expresar. Solo caben obligatorio, mínimo y máximo.*

Una regla así sigue pudiendo existir: la comprueba la API cuando llega la petición, y su mensaje
vuelve en `data.errores`. Lo que no puede es **anunciarse en el descriptor**, y quien diseña el
formulario lo sabe al arrancar la API, no cuando una empleada ve un error que la pantalla nunca
le avisó.

**Pedir el formulario con una elección no rompe este borde.** Decir «el tipo es transferencia» y
recibir un campo más no es una regla que mire dos campos: es la API devolviendo **otro
formulario**, con sus propios campos y sus propios mensajes. El front no evalúa nada; vuelve a
preguntar y pinta. La diferencia está en quién decide, que es lo que vigila el [ADR-018](adr/ADR-018-front-sin-decisiones.md).

**Y hay un caso más, que no es una regla sino una forma: un campo que es una lista de renglones.**
Las líneas de un pedido no son un campo con un valor, son una tabla que se agrega y se quita, y el
descriptor no tiene cómo decirla. Ese campo va marcado para quedar fuera del descriptor, y entonces
**la pantalla lo pinta a mano**: el formulario «pedido» llega con su cliente, sus fechas y su
porcentaje, y los renglones los dibuja el front.

Marcarlo no le devuelve ninguna regla al front. Lo que el renglón puede tener de malo —que no haya
ninguno, que la cantidad no sea positiva o que el producto ya no esté en el catálogo— lo responde la
API con su código y su aviso en `data.errores`, igual que las reglas de arriba. Lo único que cambia
es quién dibuja la caja.

---

## 5. Idempotencia

### 5.1 La cabecera

**Toda petición lleva obligatoriamente la cabecera `Idempotency-Key` con un UUID v4**, lea o
escriba. Sin ella, la API responde `40002` y no procesa nada, y **una clave presente que no es un
UUID v4 responde lo mismo**: para quien la manda rota y para quien no la manda el defecto es el
mismo y se arregla igual, así que partirlo en dos códigos solo le daría al front una diferencia que
no puede aprovechar.

La regla ya no cuelga del verbo, porque desde [ADR-030](adr/ADR-030-contrato-sin-get.md) todo es
`POST`. Lo que dice si una operación lee o escribe es **su ruta**: una lectura está bajo
`/api/v0/consultas/…` y cualquier otra cosa escribe. Así la frontera se comprueba con una prueba
en vez de recordarse en cuatro sitios distintos.

Se eximen tres operaciones, y por una razón que no es comodidad: `POST /api/v0/sesiones`,
`POST /api/v0/sesiones/renovacion` y `POST /api/v0/sesiones/administrador`, la que crea la primera
cuenta de Gerencia (tarea [9.16](08-plan-de-desarrollo.md#tarea-9-16)). Cuando se piden todavía no hay clave de firma con qué firmar,
y su respuesta trae secretos que no deben quedar guardados en la tabla de idempotencia.

> **Eximir de la clave no exime de la transacción.** Quien abre la transacción de una petición es el
> filtro de esta cabecera ([§5.5](#55-la-regla-que-hace-que-esto-sea-real-y-no-decorativo)), así que una ruta exenta se queda sin ella y toda consulta suya
> viajaría sin identidad. En las tres exentas la abre el adaptador del caso de uso, que es donde por
> fin se sabe quién pregunta: [`07-arquitectura.md`](07-arquitectura.md) [§7.2](07-arquitectura.md#72-la-solución-obligatoria) y [T-02](12-pruebas-y-calidad.md#t-02).

> **La clave la genera el front en el momento en que la persona decide la acción**, no en cada
> reintento. Es la diferencia entre «reintentar esta acción» y «hacer otra acción igual»: si la
> empleada toca Guardar dos veces porque no vio la confirmación, es la misma intención y debe
> cobrarse una vez.

**En una lectura, cada consulta es una intención nueva** y estrena clave; solo el reintento de esa
misma consulta reutiliza la suya. Reutilizarla entre dos consultas distintas haría que la segunda
recibiera la respuesta guardada de la primera, hasta 72 horas después ([§5.4](#54-retención-72-horas)).

La cola local del front guarda cada intención **con su clave ya puesta antes de intentar enviarla**
([`17-resiliencia-offline-y-cache.md`](17-resiliencia-offline-y-cache.md)). Así el reintento es
seguro por construcción y no por disciplina de quien programa el reintento.

### 5.2 Las cuatro situaciones

| Situación | Qué hace la API |
|---|---|
| Clave nueva | Procesa y guarda la respuesta junto con la huella de la petición |
| Clave repetida, **misma** huella | Devuelve la respuesta guardada. **No vuelve a ejecutar nada** |
| Clave repetida, **distinta** huella | `40901` · «Esa operación ya se registró con otros datos.» |
| Clave repetida, la primera sigue en curso | `40902` · «Esa operación se está procesando. Espera un momento.» |

La segunda fila es el corazón del asunto: devuelve **la respuesta guardada**, no una respuesta
nueva equivalente. El cliente que reintenta ve exactamente lo mismo que habría visto si el primer
intento hubiera llegado, incluido el `status`.

### 5.3 La huella, y para qué sirve

La huella es el **hash del método, la ruta, el cuerpo y el usuario**.

Sirve para una sola cosa, y conviene decir cuál: **detectar que alguien reutilizó una clave para
otra cosa.** Eso no es una repetición legítima, es un error del cliente —una clave que se quedó
pegada en una variable, un formulario que no la renovó— y responder «ya lo hice» sería mentir.
Por eso `40901` existe en vez de devolver la respuesta vieja.

### 5.4 Retención: 72 horas

Las claves viven **72 horas**, suficiente para cubrir un fin de semana sin señal. Las vencidas se
purgan con una tarea programada.

> **Es la única tabla del sistema de la que sí se borran filas.** Hay que decirlo explícitamente
> porque contradice en apariencia a [ADR-004](adr/ADR-004-base-solo-escritura.md): no es
> información del negocio, es un mecanismo de transporte con fecha de caducidad. Lo que no se
> borra nunca es el efecto de la operación; lo que caduca es el recibo de que ya se hizo.

La tabla vive en la capa de datos, con la clave, la huella, el usuario, el estado, el `status` y la
respuesta guardados, más la fecha de vencimiento indexada para la purga. Su forma exacta está en
[`04-modelo-de-datos.md`](04-modelo-de-datos.md).

### 5.5 La regla que hace que esto sea real y no decorativo

> **El registro de la clave y el efecto de la operación tienen que ocurrir en la MISMA transacción
> de base de datos.** Si se guardan por separado, un corte entre las dos escrituras deja el sistema
> exactamente en el estado que la idempotencia prometía evitar.

Los dos órdenes posibles fallan igual de mal, y por eso no hay un orden bueno:

| Si se escribe primero… | Y se cae antes de la segunda escritura | Resultado |
|---|---|---|
| El efecto | La clave no queda registrada | El reintento **vuelve a cobrar el gasto** |
| La clave | El efecto no se aplica | El reintento devuelve «ya está hecho» y **nunca se hizo** |

Una transacción, las dos escrituras adentro, o ninguna. Encaja con la **transacción por petición**
que ya fija [`07-arquitectura.md`](07-arquitectura.md) para propagar la identidad hasta PostgreSQL:
es la misma transacción, no una segunda.

La decisión está en [ADR-020](adr/ADR-020-idempotencia.md).

---

## 6. El canal firmado

Sobre HTTPS, **no en vez de HTTPS**. Protege contra repetición y manipulación.

### 6.1 Las tres cabeceras

Al iniciar sesión, la API entrega —además del token— una **clave de firma de sesión**, que vive
**solo en memoria** del cliente: nunca en `localStorage`, nunca en una cookie, nunca en disco.

| Cabecera | Contenido |
|---|---|
| `X-Prisma-Nonce` | UUID v4 único por petición |
| `X-Prisma-Timestamp` | ISO 8601 en UTC |
| `X-Prisma-Firma` | El HMAC del [§6.2](#62-cómo-se-arma-la-firma) |

### 6.2 Cómo se arma la firma

**HMAC-SHA256** sobre la concatenación de cinco piezas, con la clave de sesión:

```
método + ruta + timestamp + nonce + sha256(cuerpo)
```

Cada pieza está por una razón concreta:

| Pieza | Qué impide cambiar por el camino |
|---|---|
| Método | Convertir un `PUT` en un `DELETE` sobre el mismo recurso. Separa menos que antes, porque desde [ADR-030](adr/ADR-030-contrato-sin-get.md) casi todo es `POST`: lo que separa leer de escribir es la ruta, que también va firmada |
| Ruta | Mover la misma operación a otro recurso |
| Marca de tiempo | Guardar la petición para reenviarla mañana |
| Nonce | Reenviarla dos veces dentro de la ventana |
| `sha256(cuerpo)` | Cambiar el valor del gasto sin tocar nada más |

### 6.3 Los tres códigos de rechazo

| Caso | Código |
|---|---|
| Firma que no cuadra | `40101` |
| Marca de tiempo fuera de ±5 minutos | `40102` |
| Nonce ya visto dentro de la ventana | `40103` |

Los nonce vistos se guardan en **PostgreSQL**, en la tabla `nonces_vistos`, con vencimiento igual
a la ventana. No en memoria de la API: con más de una instancia, un reenvío que caiga en la que no
vio el nonce pasaría, y la protección desaparecería justo al crecer. El rechazo lo produce la
**llave primaria** al insertar, no una consulta previa: consultar antes sería más lento y abriría
una carrera entre las dos operaciones.

**Cinco minutos** es el equilibrio entre los relojes desajustados de celulares reales y el tiempo
que un atacante tendría para reenviar algo capturado: más ventana es más margen para el atacante,
menos ventana es rechazar peticiones legítimas de un teléfono con la hora corrida.

### 6.4 Lo que esto NO protege, escrito para que nadie se confíe

> **Esto protege el trayecto, no el extremo.** Impide que alguien reenvíe una petición capturada o
> la manipule en el camino. **No protege de un cliente comprometido**: en un navegador, la clave de
> firma vive en memoria de JavaScript, y quien controla la página controla la clave.

Creer que esto sustituye a la autenticación, a los permisos o a RLS sería peligroso. Es una capa
más, y la única que de verdad decide sigue siendo la base de datos
([ADR-006](adr/ADR-006-rls-por-rol.md), [ADR-012](adr/ADR-012-identidad-a-postgres.md)).

La higiene de siempre va igual y no es alternativa a nada de lo anterior: HSTS, CSP estricta,
tokens de vida corta con rotación del token de refresco, cookies `HttpOnly` y `SameSite`, y fijado
de certificado en las compilaciones nativas de Flutter, donde sí es posible.

La decisión está en [ADR-021](adr/ADR-021-canal-firmado.md).

### 6.5 La sesión: qué vive dónde, y qué pasa cuando se recarga la página

Una sesión abierta tiene **tres piezas**, y lo que las separa es dónde puede vivir cada una.

| Pieza | Dónde vive | Por qué ahí |
|---|---|---|
| El **token de acceso** | En la memoria del cliente, y viaja en `Authorization: Bearer` | Dura una hora. Es lo que PostgreSQL lee para saber quién pregunta ([ADR-012](adr/ADR-012-identidad-a-postgres.md)) |
| La **clave de firma** | Solo en la memoria del cliente | Se usa en cada petición, así que el código tiene que tenerla a mano ([§6.1](#61-las-tres-cabeceras)) |
| El **testigo de renovación** | En la cookie `prisma_renovacion`, `HttpOnly` | Se usa una vez cada tanto, así que puede vivir donde el código **no llega**: ni un script que se colara en la página se lo lleva |

**Recargar la página pierde las dos primeras** —están en memoria, que es donde el
[ADR-021](adr/ADR-021-canal-firmado.md) quiere que estén— y conserva la tercera, porque la guarda el
navegador. Por eso lo primero que hace el front al abrirse es pedir
`POST /api/v0/sesiones/renovacion`: si la cookie sigue valiendo, vuelve con un token nuevo, una
clave de firma nueva y una cookie nueva; si no, responde `40100` y lo que toca es la pantalla de
acceso. El front no lee la cookie en ningún momento: solo la manda el navegador.

| Atributo de la cookie | Valor | Por qué |
|---|---|---|
| `HttpOnly` | sí | Es lo que la pone fuera del alcance del JavaScript de la página |
| `Secure` | sí | Solo viaja por https. Los navegadores tratan `localhost` como sitio de confianza, así que en una máquina local funciona igual |
| `SameSite` | `None` | El front y la API viven en **dominios distintos** ([ADR-032](adr/ADR-032-railway-en-dev-ahora.md)), y con `Strict` el navegador no la mandaría nunca. Con un dominio único volvería a ser `Strict` |
| `Path` | `/api/v0/sesiones` | Solo las tres operaciones que la necesitan. No acompaña a cada consulta del día |
| `Max-Age` | 30 días, otra vez enteros en cada renovación | Es el [RF-04](03-requisitos-y-bdd.md#rf-04): una sesión sin usar treinta días caduca sola |

`SameSite=None` obliga a que la API responda con credenciales de navegador permitidas, y eso a su
vez obliga a que **los orígenes estén enumerados uno a uno**: con un comodín, el navegador rechaza
la respuesta entera. Es la razón por la que `ORIGENES_PERMITIDOS` nunca puede ser `*`.

**Cada renovación estrena clave de firma**, y eso es lo que hace que renovar no sea solo alargar un
plazo: una sesión copiada con la clave anterior no puede firmar las peticiones de la nueva. La única
excepción la pone el proveedor: si dos renovaciones caen muy seguidas, devuelve la sesión que ya
había emitido —para que un reintento no deje a nadie fuera— y entonces la clave de firma que se
responde es **la que ya estaba guardada**, no una nueva.

**Un token vencido responde `40100`, no `40101`.** Son dos cosas distintas y el cliente hace cosas
distintas con cada una: `40100` es «renueva», y `40101` es «alguien está fabricando peticiones».
Confundirlas obligaría a volver a teclear la contraseña cada hora.

> **Cerrar sesión deja el testigo sin valor, no el token.** `DELETE /api/v0/sesiones/actual` revoca
> la renovación en el proveedor y vence la cookie, así que nadie vuelve a entrar con ella; pero el
> token de acceso que ya salió sigue sirviendo hasta que venza, como mucho una hora. La tabla
> `sesiones` no admite `UPDATE` ni `DELETE` —nada se borra ([ADR-004](adr/ADR-004-base-solo-escritura.md))—, así que hoy no hay dónde
> marcar esa fila. Cerrarla del todo pide una tarea de Base, y está anotado en
> [`TODO.md`](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar).

---

## 7. Swagger

### 7.1 Generado del código, nunca escrito a mano

El documento OpenAPI 3.1 se produce desde los controladores y los DTO de la API. Un documento
escrito a mano se desactualiza el primer día en que alguien tiene prisa, y a partir de ahí miente
con toda la autoridad de un documento oficial.

**El badge dice qué artefacto está corriendo**: `info.version` es la versión de la API, la misma
que responde `POST /api/v0/consultas/version` y la misma que muestra «Acerca de». La versión del
contrato que ese artefacto implementa viaja al lado, en `x-prisma-contrato` ([ADR-042](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md)).

### 7.2 Dónde se publica en cada ambiente

| Ambiente | Dónde | Quién entra |
|---|---|---|
| dev | `/docs` | Abierto |
| qa | `/docs` | Abierto |
| **uat** | `/docs` | **Detrás de autenticación** |
| **prod** | `/docs` | **Detrás de autenticación** |

El JSON del documento cuelga de `/docs/openapi`, con la misma puerta que la página.

En uat y en prod va cerrado a propósito: **el catálogo de endpoints es un mapa del sistema** y no
tiene por qué ser público. La puerta es autenticación básica, desde la tarea [9.11](08-plan-de-desarrollo.md#tarea-9-11), y sin credencial
configurada las rutas contestan como si no existieran.

**prod cuenta aunque no viva en el dominio del proyecto.** Cada emprendimiento lo despliega en su
propia infraestructura, desde su copia del monorepo de producto ([ADR-054](adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md)), con esta misma imagen y
el perfil `prod`. La puerta viaja en la imagen, así que ahí también queda cerrado. Los ambientes
están descritos en [`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md).

### 7.3 Qué documenta cada operación

Además de su forma técnica —ruta, parámetros, esquema—, cada operación documenta cinco cosas, y
son las que la vuelven **documentación funcional** y no una lista de campos:

| Qué | De dónde sale |
|---|---|
| Qué caso de uso implementa | Enlazado a [`02-casos-de-uso.md`](02-casos-de-uso.md), de [CU-01](02-casos-de-uso.md#cu-01) a [CU-37](02-casos-de-uso.md#cu-37) |
| La regla de negocio que aplica | En español y sin jerga, como en [`05-reglas-financieras.md`](05-reglas-financieras.md) |
| Qué códigos de `status` puede devolver, con su mensaje | Del catálogo del [§3](#3-el-catálogo), generado |
| Un ejemplo real de petición y respuesta | Como los del [§8](#8-el-contrato-funcionando) |
| Qué tipo de usuario puede llamarla | Y que **el permiso lo aplica la base**, no la anotación |

### 7.4 Cómo se verifica que está al día

> El archivo `openapi.json` está **versionado en el repositorio**. La integración continua regenera
> el documento y **falla la compilación si difiere del versionado**. Actualizar la documentación
> deja de ser disciplina y pasa a ser un requisito para poder mezclar el cambio.

Es la prueba `C-04` de [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md), y el mismo mecanismo
que sostiene a `C-01`: nada que dependa de que alguien se acuerde. Se acuerda la máquina o no se
acuerda nadie. La decisión está en [ADR-022](adr/ADR-022-openapi-generado.md).

---

## 8. El contrato funcionando

Cuatro intercambios completos —tres sobre la misma escritura, registrar un gasto, y uno de
lectura— para que el contrato se vea, no solo se lea. Las cabeceras van enteras; el sobre, entero.

### 8.1 Éxito · `20100`

```http
PUT /api/v0/movimientos/b21f8c40-3d7e-4a19-9c62-0e5a7f1d8b34 HTTP/1.1
Host: api.prisma.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Idempotency-Key: 6f1c2f3a-8f4b-4f9a-9a2e-1b7c5d3e0a11
X-Prisma-Nonce: c9d2b4e1-7a03-4f52-8b6d-2e9f1a4c7b08
X-Prisma-Timestamp: 2026-09-15T19:32:07Z
X-Prisma-Firma: 9f2a4c7d1e85b03a6f4c2d9e7b1a5c38d0f6e2b49a7c1d3e5f8a0b2c4d6e8f1a

{
  "tipo": "gasto",
  "valor": 120000,
  "fechaMovimiento": "2026-09-15",
  "cuentaId": "3f9a1c02-7d84-4e6b-9051-c8a2e4b70d13",
  "categoriaId": "a70e5d81-2b9c-4f36-8ae4-1d05c3b97e6f",
  "descripcion": "Tinta plastisol negra"
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": 20100,
  "mensaje": "Movimiento registrado.",
  "data": {
    "id": "b21f8c40-3d7e-4a19-9c62-0e5a7f1d8b34",
    "tipo": "gasto",
    "valor": 120000,
    "fechaMovimiento": "2026-09-15",
    "cuenta": "Caja",
    "cuentaId": "3f9a1c02-7d84-4e6b-9051-c8a2e4b70d13",
    "categoria": "Insumos",
    "categoriaId": "a70e5d81-2b9c-4f36-8ae4-1d05c3b97e6f",
    "descripcion": "Tinta plastisol negra",
    "registradoPor": "Marcela Ríos",
    "registradoEn": "2026-09-15T19:32:07Z",
    "registroTardio": false,
    "adjuntos": []
  }
}
```

**El id del movimiento va en la ruta, y lo genera quien registra** al decidir la acción, junto con la
clave de idempotencia ([ADR-020](adr/ADR-020-idempotencia.md)). Por eso el verbo es `PUT` y no `POST`, como en pedidos y en
clientes: la petición dice dónde va lo que trae, así que repetirla nunca duplica el libro, ni
siquiera cuando la clave ya se purgó. Un id que ya está registrado responde `40900`.

### 8.2 Los datos no pasan las reglas · `42200`

Otro movimiento —otro id en la ruta y otra clave de idempotencia, porque es otra intención— con el
valor en cero:

```http
PUT /api/v0/movimientos/7c0d5e93-1a46-4b28-8fd1-6e93a0c25b47 HTTP/1.1
Host: api.prisma.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Idempotency-Key: 0a4d9e17-5c82-4b31-8f06-7e2c1a9d4b55
X-Prisma-Nonce: 41e0b8a2-96c5-4d17-b3ea-58f7c0d21e6b
X-Prisma-Timestamp: 2026-09-15T19:34:52Z
X-Prisma-Firma: 3c7e19a5d84b0f62c1e73a9d5b08f4e6a2c9d17b30e58f4a6c2b9d0e7f1a3c58

{
  "tipo": "gasto",
  "valor": 0,
  "fechaMovimiento": "2026-09-15",
  "cuentaId": "3f9a1c02-7d84-4e6b-9051-c8a2e4b70d13",
  "categoriaId": "a70e5d81-2b9c-4f36-8ae4-1d05c3b97e6f",
  "descripcion": "Tinta plastisol negra"
}
```

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/json

{
  "status": 42200,
  "mensaje": "Revisa los datos.",
  "data": {
    "errores": [
      { "campo": "valor", "mensaje": "El valor tiene que ser mayor que cero." }
    ]
  }
}
```

El texto de `errores[0].mensaje` es **el mismo** que el descriptor del [§4](#4-el-descriptor-de-formulario) ya le había entregado al
front bajo `mensajes.minimo`. No son dos redacciones parecidas: es una sola, la del catálogo, que
llega dos veces por caminos distintos.

### 8.3 Clave de idempotencia repetida con otros datos · `40901`

La clave del [§8.1](#81-éxito--20100), reutilizada con un cuerpo distinto:

```http
PUT /api/v0/movimientos/b21f8c40-3d7e-4a19-9c62-0e5a7f1d8b34 HTTP/1.1
Host: api.prisma.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Idempotency-Key: 6f1c2f3a-8f4b-4f9a-9a2e-1b7c5d3e0a11
X-Prisma-Nonce: 7b3f2e08-c194-4a6d-85f1-2c0e9a4d7b63
X-Prisma-Timestamp: 2026-09-15T19:36:10Z
X-Prisma-Firma: e5a1c39d7f204b86e0c1a7d3f95b28c4d6e0a71f39b5c2d8e4a06f1b7c3d9e52

{
  "tipo": "gasto",
  "valor": 95000,
  "fechaMovimiento": "2026-09-15",
  "cuentaId": "3f9a1c02-7d84-4e6b-9051-c8a2e4b70d13",
  "categoriaId": "a70e5d81-2b9c-4f36-8ae4-1d05c3b97e6f",
  "descripcion": "Tinta plastisol roja"
}
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "status": 40901,
  "mensaje": "Esa operación ya se registró con otros datos.",
  "data": null
}
```

Si el cuerpo hubiera sido **idéntico** al del [§8.1](#81-éxito--20100), la respuesta no sería esta: sería palabra por
palabra la del [§8.1](#81-éxito--20100), con su `201` y su `20100`, sin registrar un segundo gasto. Esa es la
diferencia entre reintentar y repetir, y la huella del [§5.3](#53-la-huella-y-para-qué-sirve) es lo único que la distingue.

### 8.4 Una lectura · `20000`

La cuarta es una consulta, para que se vea que no se parece a lo que uno esperaría. No lleva cuerpo
porque no tiene nada que filtrar todavía, pero **sí lleva su clave de idempotencia**, como cualquier
otra petición ([§5.1](#51-la-cabecera)):

```http
POST /api/v0/consultas/cuentas HTTP/1.1
Host: api.prisma.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Idempotency-Key: 4d0b7a92-1e65-4c38-b7f4-8c3a0d5e1b27
X-Prisma-Nonce: a1f39c60-2d84-4e7b-9051-6b8c3e0f7a4d
X-Prisma-Timestamp: 2026-09-17T14:02:11Z
X-Prisma-Firma: 7c4e0a93b58d1f62e0a7c3d95b284fc6d1e0a73f29b5c8d4e6a01f3b7c9d5e28
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": 20000,
  "mensaje": "Consulta correcta.",
  "data": [
    { "id": "3f8c1a04-9d27-4e61-b350-7c2a9e4f1d86", "nombre": "Efectivo", "tipo": "efectivo" },
    { "id": "b7e2d915-4a68-4c03-9f71-2e5b8a0c3d49", "nombre": "Nequi", "tipo": "billetera" }
  ]
}
```

Tres cosas que conviene mirar: el `status` es `20000` y no `20100`, porque **leer no crea nada**; la
firma se arma igual que en una escritura, con `sha256` del cuerpo vacío; y esta petición dispara un
`OPTIONS` de preflight antes, que el navegador manda solo. Ese viaje extra es el precio admitido de
[ADR-030](adr/ADR-030-contrato-sin-get.md).

---

## 9. Lo que este documento no cubre

| Si buscas… | Ve a… |
|---|---|
| Cómo está construido el sistema por dentro | [`07-arquitectura.md`](07-arquitectura.md) |
| Qué puede hacer cada operación, contada como pasos | [`02-casos-de-uso.md`](02-casos-de-uso.md) |
| Las fórmulas del dinero que la API aplica | [`05-reglas-financieras.md`](05-reglas-financieras.md) |
| Dónde vive la tabla de idempotencia | [`04-modelo-de-datos.md`](04-modelo-de-datos.md) |
| Qué se prueba y con qué criterio | [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md) |
| Qué pasa cuando no hay señal y cómo espera la cola local | [`17-resiliencia-offline-y-cache.md`](17-resiliencia-offline-y-cache.md) |
| Con qué configuración corre cada ambiente y cómo se publica | [`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md) |

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](04-modelo-de-datos.md "04 · Modelo de datos") · [07](07-arquitectura.md "07 · Arquitectura técnica") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [15](15-glosario.md "15 · Glosario") · [17](17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [Contrato](../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-030](adr/ADR-030-contrato-sin-get.md "ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0") · [ADR-042](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md "ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato") · [ADR-049](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md "ADR-049 · Sin DOCS_CLAVE, Swagger toma PREPROD_GERENCIA_CLAVE") · [CLAUDE](../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [19 · Ambientes, versionado y entrega](19-ambientes-y-entrega.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [21 · Trabajo en paralelo](21-trabajo-en-paralelo.md)
