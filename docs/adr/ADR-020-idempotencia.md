# ADR-020 · Idempotencia obligatoria en toda escritura

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.2.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-020-idempotencia.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-09-17 | [API](../INDICE.md#etiqueta-api) · [Contrato](../INDICE.md#etiqueta-contrato) |

> **La decisión sigue vigente; su enunciado ya no cuelga del verbo.** Cuando se escribió, las
> lecturas iban por `GET` y la regla se decía «toda escritura». Desde
> [ADR-030](ADR-030-contrato-sin-get.md) **ninguna operación usa `GET`**: la cabecera la lleva
> toda petición, lea o escriba, y lo que distingue una de otra es la ruta —`/api/v0/consultas/…`—
> y no el método. En una lectura, cada consulta es una intención nueva y lleva clave nueva; solo
> el reintento de esa misma consulta reutiliza la suya. Siguen exentas las dos operaciones de
> sesión, por la razón que ya tenían.

## Contexto

El taller tiene señal intermitente. La empleada toca Guardar, la pantalla se queda pensando, no
llega la confirmación y vuelve a tocar Guardar. O la petición sí llegó y la respuesta se perdió
en el camino. O el front reintenta desde su cola local porque el teléfono recuperó datos.

En los tres casos pasa lo mismo: **la API recibe dos veces la misma intención.** Sin nada que lo
impida, quedan dos gastos donde hubo uno, o dos adelantos de nómina donde hubo uno. Y como
[ADR-004](ADR-004-base-solo-escritura.md) prohíbe borrar, el duplicado no se elimina: hay que
anularlo con motivo escrito y contra-asiento. El error barato de la persona cuesta caro en el
historial.

El usuario lo pidió explícitamente: **las peticiones deben ser idempotentes.** Falta decidir cómo
se identifica «la misma intención» y qué hace la API cuando la ve otra vez.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Cabecera `Idempotency-Key` obligatoria en toda escritura** | El cliente declara la intención; funciona igual para crear, modificar y anular; es la convención que ya usan las pasarelas de pago | Una tabla más, una cabecera más y una purga programada |
| Sin idempotencia, confiando en que la persona no repita | Cero trabajo | **Confía en que no falle la red, justo en un taller donde falla.** El botón deshabilitado no sobrevive a recargar la página ni a un reintento automático de la cola |
| Deduplicar por contenido, con el hash del cuerpo en una ventana de tiempo | Ninguna cabecera nueva; el cliente no cambia | **No distingue repetir de volver a hacer.** Dos gastos idénticos de $5.000 el mismo día son legítimos y se perderían en silencio, que es peor que duplicar |
| Usar identificadores de negocio como clave (número de pedido, consecutivo) | Ya existen; no hay que inventar nada | No todas las operaciones tienen uno antes de crearse, y los que existen los asigna la base: el cliente no puede saberlos para reintentar |

## Decisión

> **Toda petición que escribe —`POST`, `PUT`, `PATCH` y `DELETE`— lleva obligatoriamente la
> cabecera `Idempotency-Key` con un UUID v4. Sin ella, la API responde `40002` y no ejecuta
> nada.**

`GET`, `HEAD` y `OPTIONS` son idempotentes por naturaleza y no la llevan.

**La clave la genera el front en el momento en que la persona decide la acción**, no en cada
reintento. Esa es exactamente la diferencia entre «reintentar esta acción» y «hacer otra acción
igual»: si la empleada toca Guardar dos veces porque no vio la confirmación, es la misma
intención y debe cobrarse una vez; si registra dos gastos iguales a propósito, son dos
intenciones y dos claves.

### Las cuatro situaciones

| Situación | Qué hace la API |
|---|---|
| Clave nueva | Procesa y guarda la respuesta junto con la huella de la petición |
| Clave repetida, **misma** huella | Devuelve la respuesta guardada. No vuelve a ejecutar nada |
| Clave repetida, **distinta** huella | `40901`: «Esa operación ya se registró con otros datos.» |
| Clave repetida, la primera sigue en curso | `40902`: «Esa operación se está procesando. Espera un momento.» |

**El `40902` sale de un tiempo límite de espera, y no de leer el estado.** Mientras la primera
petición corre, su fila está **sin confirmar**: ninguna otra sesión la ve, y preguntar por
`estado = 'en_curso'` no devolvería nada. Lo que ocurre de verdad es que el segundo `INSERT` se
queda esperando en la llave primaria; si la primera confirma a tiempo, la segunda lee su respuesta,
y si no, el tope de espera convierte esa espera en `40902`. El corolario conviene decirlo: **no
existe una fila «en curso» colgada**, porque si el proceso muere la transacción se revierte y la
fila desaparece sola.

**Una clave presente que no es un UUID v4 vale lo mismo que ninguna**, `40002`: es el mismo defecto
del cliente y se arregla igual.

La **huella** es el hash del método, la ruta, el cuerpo y el usuario. No sirve para detectar
repeticiones —para eso está la clave—; sirve para detectar que alguien reutilizó una clave para
otra cosa, que es un defecto del cliente y no una repetición legítima.

### Lo que hace que esto sea real y no decorativo

> **El registro de la clave y el efecto de la operación tienen que ocurrir en la MISMA
> transacción de base de datos.** Si se guardan por separado, un corte entre las dos escrituras
> deja el sistema exactamente en el estado que la idempotencia prometía evitar.

Guardar la clave en memoria, en una caché aparte o en una segunda transacción parece equivalente
y no lo es: entre la primera escritura y la segunda hay una ventana, y en esa ventana el proceso
se puede caer. Si se cayó después de cobrar el gasto y antes de registrar la clave, el reintento
lo cobra otra vez. La atomicidad no es una optimización: es la decisión.

### La tabla

```sql
CREATE TABLE peticiones_idempotentes (
  clave        UUID PRIMARY KEY,
  huella       TEXT NOT NULL,
  usuario_id   UUID NOT NULL REFERENCES usuarios(id),
  estado       TEXT NOT NULL CHECK (estado IN ('en_curso','terminada')),
  status       INTEGER,
  respuesta    JSONB,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_en    TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_idem_expira ON peticiones_idempotentes (expira_en);
```

Al llevarla al modelo de datos, la restricción `CHECK` se escribe con nombre explícito, como
exige [ADR-015](ADR-015-validacion-tres-capas.md). El `PRIMARY KEY` sobre `clave` es lo que hace
el trabajo: dos peticiones simultáneas con la misma clave no pueden insertar las dos, y la
segunda espera y lee el resultado de la primera. La concurrencia se resuelve donde se puede
resolver, que es la base.

### Retención: 72 horas

Suficiente para cubrir un fin de semana sin señal. Las filas vencidas se purgan con una tarea
programada, y el índice sobre `expira_en` existe para eso.

### El punto delicado: aquí sí se borra

> **Es la única tabla del sistema de la que sí se borran filas, y contradice en apariencia a
> [ADR-004](ADR-004-base-solo-escritura.md).**

Se escribe aquí y no se esconde, porque alguien lo va a notar y va a pensar que fue un descuido.

No es una contradicción de verdad. `ADR-004` protege **información del negocio**: un movimiento,
un pedido, una nómina, una anulación con su motivo. Eso cuenta lo que pasó en el taller y por eso
nunca se puede perder. `peticiones_idempotentes` no cuenta nada de eso: es **un mecanismo de
transporte con fecha de caducidad**, la anotación de que un mensaje ya llegó. Pasadas 72 horas
ningún cliente va a reintentar esa petición, y la fila deja de significar algo.

Dicho al revés, que es como se entiende mejor: el efecto de la operación —el gasto, el pedido—
queda para siempre y sigue bajo `ADR-004`. Lo que se borra es el sobre, no la carta.

Dos condiciones para que la excepción no se vuelva una puerta:

1. **Es la única.** Cualquier otra tabla que quiera borrar filas necesita su propio ADR.
2. **La purga solo toca filas con `expira_en` vencido.** Nunca por clave, nunca por usuario,
   nunca «para hacer espacio».

## Justificación

**La alternativa realista no era otra técnica, era no hacer nada**, y no hacer nada significa
apostar a que la red no falle en un taller donde falla. Deshabilitar el botón en el front no
sirve: no sobrevive a recargar la página, ni al reintento automático de la cola local, ni a que
la petición sí llegara y se perdiera la respuesta.

**Deduplicar por contenido se descartó por una razón concreta:** no distingue repetir de volver a
hacer. Dos compras de $5.000 en insumos el mismo día son perfectamente normales, y un sistema que
las fusiona en silencio pierde información del negocio, que es justo lo que `ADR-004` existe para
evitar. Que el cliente declare la intención con una clave resuelve esa ambigüedad sin adivinar.

**Que la clave sea obligatoria y no opcional es deliberado.** Una cabecera opcional se convierte
en una cabecera que falta el día de la prisa, y el endpoint que la olvidó es exactamente el que
va a duplicar. Rechazar con `40002` es ruidoso al principio y silencioso después; permitirlo es
al revés.

**Y la clave se genera al decidir la acción, no al enviarla,** porque es el único momento en que
existe una sola intención. Si se generara en cada envío, cada reintento sería una intención nueva
y la idempotencia no serviría para nada. Por eso la cola local del front guarda cada intención
**con su clave** antes de intentar mandarla: así el reintento es seguro por construcción y no por
suerte.

## Consecuencias

- **Positivas:** un reintento nunca duplica un movimiento; el front puede reintentar con espera
  exponencial sin pedir permiso ni preguntarle nada a la persona; la respuesta guardada hace que
  el segundo intento sea instantáneo y consistente con el primero; una clave reutilizada para
  otra cosa se detecta y se reporta en vez de ejecutarse; y la concurrencia entre dos peticiones
  simultáneas la resuelve el `PRIMARY KEY`, no un `if` de la aplicación.
- **Negativas:** toda escritura pasa por una tabla más dentro de su transacción, lo que agrega
  una inserción y un índice a mantener; el front tiene que generar y conservar la clave junto a
  cada intención pendiente, y si la pierde antes de enviarla el reintento se vuelve una acción
  nueva; hay una tarea programada más que vigilar, porque si la purga deja de correr la tabla
  crece sin límite; y queda **una excepción escrita a `ADR-004`**, que es el riesgo real de este
  ADR: alguien puede citarla dentro de un año para justificar otro borrado. Las dos condiciones
  de arriba existen para que citarla no alcance.

## Referencias

- [ADR-004 · Base de datos de solo escritura](ADR-004-base-solo-escritura.md) — la regla que esta
  tabla parece romper, y que en realidad protege otra cosa.
- [ADR-019 · Contrato de respuesta y catálogo de códigos](ADR-019-contrato-de-respuesta.md) — de
  ahí salen `40002`, `40901` y `40902`, con su mensaje en español.
- [ADR-012 · La API propaga la identidad a PostgreSQL](ADR-012-identidad-a-postgres.md) — la
  transacción en la que se escribe la clave es la misma en la que vive la identidad, y por eso
  `usuario_id` se puede llenar y RLS sigue juzgando.
- [ADR-021 · Canal firmado contra repetición y manipulación](ADR-021-canal-firmado.md) — el nonce
  y la clave de idempotencia no son lo mismo y conviene no confundirlos: el nonce es único **por
  petición** y rechaza el reenvío; la clave es única **por intención** y hace que el reenvío
  legítimo no duplique.
- [ADR-015 · Validación en tres capas](ADR-015-validacion-tres-capas.md) — la restricción con
  nombre explícito y su mensaje en la tabla de traducción. Está reemplazado por `ADR-018`, que
  conserva intacto ese contrato de errores.
- [`../04-modelo-de-datos.md`](../04-modelo-de-datos.md) — dónde queda la tabla dentro del
  modelo.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](../10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [Contrato](../../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-019](ADR-019-contrato-de-respuesta.md "ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos") · [ADR-021](ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [ADR-030](ADR-030-contrato-sin-get.md "ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
