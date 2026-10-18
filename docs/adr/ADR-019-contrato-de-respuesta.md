# ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-019-contrato-de-respuesta.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-09-16 | [Contrato](../INDICE.md#etiqueta-contrato) · [API](../INDICE.md#etiqueta-api) |

## Contexto

El usuario pidió un estándar de respuesta explícito: `{status, mensaje, data}`, donde `status` es
un código interno de cinco dígitos, y dio un ejemplo concreto, `20100`. No es un capricho de
formato. Es la consecuencia directa de que el front no tome decisiones: si la API dicta qué
mensaje se muestra, el sobre que lleva ese mensaje es parte del contrato y no un detalle de
implementación de cada endpoint.

Quedan dos preguntas por responder, y la segunda es la difícil:

1. **Qué forma tiene toda respuesta**, con éxito o con error.
2. **Cómo se componen esos cinco dígitos**, sabiendo que el número elegido hoy va a estar
   quemado en trazas, en tableros de soporte y en el código del front durante años.

Un código mal compuesto no se corrige después. Se arrastra.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **`HTTP(3)` + `caso(2)`** | El HTTP se lee de un vistazo y coincide con el de la respuesta; es lo que el usuario ejemplificó con `20100` | Solo 99 casos por estado, y el código no dice de qué módulo vino |
| `familia(1)` + `módulo(2)` + `caso(2)` | Dice el módulo sin ambigüedad; 99 casos por módulo | Se pierde el HTTP exacto; `4` no distingue un 403 de un 422, que es justo lo que el front necesita para saber si reintentar |
| `familia(2)` + `secuencia(3)` | 999 códigos por familia, sin límite práctico | Un número corrido no dice nada por sí solo; obliga a consultar la tabla para cada código |
| Solo los códigos HTTP, sin código interno | Cero invención; cualquiera lo entiende | 422 no distingue «el valor es negativo» de «ese cliente ya no existe». Obligaría a meter la causa en un campo aparte, que es reinventar el código interno peor |

## Decisión

> **Toda respuesta de la API, con éxito o con error, tiene exactamente tres claves: `status`,
> `mensaje` y `data`. El `status` son cinco dígitos que se componen como `HTTP(3) + caso(2)`.**

No hay excepciones por endpoint. Un endpoint que devuelva otra cosa es un defecto.

### El sobre

```json
{
  "status": 20100,
  "mensaje": "Gasto registrado.",
  "data": { }
}
```

| Clave | Tipo | Regla |
|---|---|---|
| `status` | entero de cinco dígitos | Siempre presente |
| `mensaje` | texto | Siempre presente. **En español, listo para mostrarle a una persona del taller.** Nunca jerga técnica, nunca un nombre de restricción, nunca una traza |
| `data` | cualquiera | El contrato de cada operación. `null` cuando no hay datos que devolver |

Los errores de campo van **dentro de `data`**, para no romper el sobre de tres claves:

```json
{
  "status": 42200,
  "mensaje": "Revisa los datos del gasto.",
  "data": { "errores": [ { "campo": "valor", "mensaje": "El gasto tiene que ser mayor que cero." } ] }
}
```

### Los cinco dígitos

`20100` es HTTP **201** Created, caso **00**, el genérico de ese estado. El caso `00` está
reservado al genérico de cada estado HTTP y no pertenece a ningún módulo. Códigos base:

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

Son los códigos base, no la lista completa: la lista completa vive en el catálogo (ver abajo) y
crece con cada caso de uso.

### El límite del formato, dicho sin adornos

> **Este formato tiene dos límites reales: solo caben 99 casos por cada estado HTTP, y el código
> no dice de qué módulo vino.** Se elige igual, pero se escribe aquí para que nadie lo descubra
> tarde y crea que fue un descuido.

Son 99 y no 100 porque el caso `00` queda **reservado al genérico** de cada estado HTTP.

**La mitigación** recupera el módulo sin cambiar el formato: los dos dígitos de caso se reparten
por rango de módulo, y el reparto es **igual en todos los estados HTTP**.

| Rango | Módulo |
|---|---|
| `00` | **Genérico, sin módulo** |
| `01`–`09` | Sesión, seguridad y transporte |
| `10`–`19` | Usuarios y cargos |
| `20`–`29` | Movimientos y cuentas |
| `30`–`39` | Pedidos y clientes |
| `40`–`49` | Productos y costeo |
| `50`–`59` | Nómina y adelantos |
| `60`–`69` | Reportes y cierres |
| `70`–`79` | Exportación y respaldo |
| `80`–`89` | Cotizaciones |
| `90`–`99` | Reservado |

Así `42213` se lee de un vistazo: HTTP 422, módulo de usuarios, caso 3 de ese módulo.

> **Reservar el `00` no es un detalle cosmético: es lo que evita que el sistema mienta sobre sí
> mismo.** Sin esa reserva, los nueve códigos base habrían terminado en `01` y `42200` habría
> afirmado pertenecer al módulo de Sesión y seguridad, del que no forma parte. Un código que
> dice de dónde viene y se equivoca es peor que uno que no lo dice.

El rango `01`–`09` cubre **sesión, seguridad y transporte**: lo que ocurre antes de que la
petición llegue a un módulo de negocio. Ahí viven `40101`, `40102` y `40103` del canal firmado, y
`40002`, `40901` y `40902` de la idempotencia. Es el rango más apretado, nueve casos en vez de
diez, y el que hay que vigilar primero.

**Qué hacer si un módulo agota su rango.** No se amplía el rango ni se estira el formato: se
revisa el estado HTTP. Que un solo módulo necesite más casos de los que caben en su rango dentro
del mismo estado significa que ese estado está haciendo demasiado trabajo y que hay respuestas
que merecen un HTTP más preciso. El rango lleno es el aviso, no el problema.

### El catálogo

Existe **un solo catálogo** de códigos en `prisma_api`, con cinco columnas: código, HTTP, módulo,
mensaje en español y cuándo se emite. De él salen tres cosas, **generadas, nunca copiadas a
mano**:

1. Las respuestas de la API.
2. La documentación de Swagger.
3. La tabla de traducción de restricciones de base de datos.

Y una prueba automática comprueba las dos direcciones: que **ningún código emitido por el código
fuente falta en el catálogo**, y que **ningún código del catálogo quedó sin usar**.

## Justificación

**Se eligió `HTTP(3) + caso(2)` porque el front necesita saber qué hacer antes de saber qué
pasó.** Un 401 se resuelve renovando la sesión, un 409 no se reintenta, un 500 sí se reintenta
más tarde y un 422 se pinta en el formulario. Esa decisión depende del estado HTTP, y tenerlo en
los tres primeros dígitos la vuelve inmediata. Las alternativas con familia de un dígito borran
justo esa distinción: `4` no dice si reintentar.

**El código interno existe porque el HTTP solo no alcanza.** Un 422 puede ser «el valor es
negativo» o «ese cliente ya no existe»; el soporte necesita distinguirlos por teléfono, con la
dueña del taller leyendo un número de la pantalla.

**La redundancia entre el HTTP del sobre y el de la cabecera es deliberada.** Un proxy, un
registro de servidor o una captura de red muestran la cabecera; un registro de la aplicación
muestra el cuerpo. Que digan lo mismo cuesta cinco caracteres y evita tener que cruzar dos
fuentes durante un incidente.

**El catálogo único es lo que impide que esto se degrade.** Tres cosas que salen del mismo sitio
no pueden separarse. Si el mensaje de `42213` se escribiera a mano en el código, otra vez en
Swagger y otra vez en la tabla de restricciones, en tres meses dirían tres cosas distintas y la
persona del taller vería una y el soporte leería otra. Es el mismo argumento de
[ADR-015](ADR-015-validacion-tres-capas.md): la redundancia sin una prueba que la vigile se
convierte en deuda.

**Y la prueba automática vale en las dos direcciones por razones distintas.** Un código emitido
que no está en el catálogo es un mensaje que nadie redactó: llega a la persona sin revisar. Un
código del catálogo que nadie emite es basura que envejece en la documentación y le hace perder
tiempo a quien lo lea.

## Consecuencias

- **Positivas:** el front trata todas las respuestas igual, con éxito o con error, y no necesita
  un camino distinto por endpoint; el mensaje viaja ya redactado en español, que es lo que hace
  posible que el front no tenga catálogo de mensajes; el soporte identifica un caso exacto con un
  número de cinco dígitos leído por teléfono; el módulo se deduce del código sin consultar nada;
  y Swagger, las respuestas y la traducción de restricciones no pueden contradecirse porque
  salen del mismo archivo.
- **Negativas:** **el formato se queda corto si un estado HTTP acumula más de 99 casos, o un
  módulo más de diez dentro del mismo estado.** No se disimula: es el precio de que el HTTP ocupe
  tres de los cinco dígitos. La señal de alarma está definida arriba y la salida es repartir en
  estados HTTP más precisos, no ampliar el formato. Además, el reparto por rangos es una
  convención que hay que sostener con disciplina —nada en el número impide asignar mal un
  módulo—, y envolver toda respuesta obliga a que hasta el error más tonto pase por el catálogo
  antes de salir, que es trabajo extra por cada caso nuevo.

## Referencias

- [ADR-018 · Tres partes, y el front no toma decisiones](ADR-018-front-sin-decisiones.md) — este
  sobre es lo que hace posible que el front pinte el mensaje sin tener catálogo propio.
- [ADR-015 · Validación en tres capas](ADR-015-validacion-tres-capas.md) — la tabla de traducción
  de restricciones que este catálogo genera, y el mismo criterio sobre redundancia vigilada por
  una prueba. Está reemplazado por `ADR-018`, que conserva intacto ese contrato de errores.
- [ADR-014 · SemVer independiente por proyecto](ADR-014-semver.md) — quitar un código del
  catálogo o cambiar el significado de uno existente rompe el contrato con el front: es un
  cambio MAJOR de la API.
- [ADR-020 · Idempotencia obligatoria en toda escritura](ADR-020-idempotencia.md) — los códigos
  `40002`, `40901` y `40902` del rango de sesión y seguridad salen de ahí.
- [ADR-022 · OpenAPI generado del código](ADR-022-openapi-generado.md) — la documentación de
  Swagger es una de las tres cosas que se generan de este catálogo.
- [`../07-arquitectura.md`](../07-arquitectura.md) — dónde vive el sobre dentro de la capa de
  interfaz de `prisma_api`.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [23](../23-diagramas-de-casos-de-uso.md "23 · Diagramas de los casos de uso") · [ADR-020](ADR-020-idempotencia.md "ADR-020 · Idempotencia obligatoria en toda escritura") · [ADR-021](ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [ADR-022](ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
