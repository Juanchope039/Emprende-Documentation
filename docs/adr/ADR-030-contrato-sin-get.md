# ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo `/api/v0`

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-030-contrato-sin-get.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-17 | 2026-09-17 | [API](../INDICE.md#etiqueta-api) · [Contrato](../INDICE.md#etiqueta-contrato) · [Seguridad](../INDICE.md#etiqueta-seguridad) |

## Contexto

El contrato `0.4.0` tenía 26 operaciones, y nueve de ellas eran `GET`. Quien dirige el proyecto
pidió que no existan peticiones `GET`.

Un `GET` lleva sus datos donde se ven: en la ruta y en la cadena de consulta. Esa cadena queda en
el registro del servidor, en el historial del navegador, en la barra de direcciones que alguien
fotografía y en el `Referer` que se manda al siguiente sitio. Para `/version` da igual; para un
`limite` tampoco importa; el día en que una consulta lleve un rango de fechas, un identificador de
persona o un filtro de nómina, ya importa, y para entonces cambiarla es un cambio de contrato con
dos lados construidos encima.

También hay un motivo de forma. Este sistema firma cada petición sobre
`método + ruta + timestamp + nonce + sha256(cuerpo)` ([ADR-021](ADR-021-canal-firmado.md)), y exige `Idempotency-Key` en todo
lo que escribe ([ADR-020](ADR-020-idempotencia.md)). Dos reglas que se enuncian «según el verbo» obligan a saber, en cada
sitio, de qué lado de la frontera cae cada operación. Con un solo verbo, la frontera se declara en
la ruta y se puede comprobar con una prueba en vez de con disciplina.

El momento es el bueno: de las 26 operaciones solo dos estaban implementadas —`GET /version` y
`GET /formularios/{nombre}`—, las otras 24 eran contrato acordado sin una línea que las sirviera, y
el sistema todavía no ha salido a producción.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Ninguna operación usa GET; las lecturas van por `POST /api/v0/consultas/…`** | Una sola regla, y la ruta dice si lee o escribe sin mirar el verbo; ningún dato de consulta viaja en la URL; el cuerpo crece a filtros sin cambiar el contrato | Se pierde la semántica que todo el mundo espera de HTTP; toda petición dispara preflight; quien lea el contrato sin este documento va a pensar que está mal hecho |
| Dejar `GET` en las lecturas, como estaba | Es lo que HTTP significa; una lectura se puede repetir, cachear y sondear sin pensarlo | Es justo lo que se pidió cambiar, y deja los datos de consulta en la URL |
| Quitar `GET` solo de las lecturas con datos sensibles | Cambia lo mínimo y conserva la semántica donde no estorba | **La frontera hay que decidirla caso por caso y cada vez.** Es la clase de regla que se aplica bien seis meses y mal el séptimo |
| `POST` en la misma ruta del recurso | Ninguna ruta nueva que inventar | Imposible: `POST /cuentas` ya existe y **crea** una cuenta. Lo mismo en categorías, usuarios y cargos |

## Decisión

> **Ninguna operación del contrato usa `GET`.** Las nueve lecturas viajan por `POST` bajo
> `/api/v0/consultas/…`, con sus datos en el cuerpo; las diecisiete escrituras se quedan en su
> recurso, con el mismo prefijo. Y `Idempotency-Key` deja de colgar del verbo: la lleva toda
> petición, lea o escriba.

### El prefijo, y por qué dice `v0`

Toda la API cuelga de `/api/v0`. El número sigue al MAJOR del artefacto, que hoy es `0` porque
antes del go-live todo es `0.y.z` ([ADR-014](ADR-014-semver.md)): con la primera publicación en producción pasa a
`/api/v1`. Es un cambio de rutas más, hecho a propósito el día en que el contrato deja de ser
provisional y no antes, para que la ruta nunca prometa una estabilidad que el número no tiene.

El prefijo lo pone un único `WebMvcConfigurer` sobre el paquete de los controladores. Swagger,
`/error` y las sondas de Actuator no cuelgan de él: no son operaciones del contrato.

### Qué queda fuera, dicho para que nadie lo lea de más

Esto es una regla sobre **el contrato de la API**, no sobre el protocolo:

- El navegador se baja el front —HTML, JavaScript, CSS e íconos— por `GET`, y no hay forma de
  evitarlo ni motivo para intentarlo.
- `GET /docs/openapi` y la interfaz de Swagger siguen igual: son documentación generada, y la
  prueba [C-04](../12-pruebas-y-calidad.md#c-04) descarga ese documento para compararlo con la copia fijada.
- `GET /actuator/health/readiness` es la sonda del despliegue, y sigue siendo la sonda.
  **`/version` nunca fue un endpoint de salud**: es el contrato de compatibilidad de [ADR-014](ADR-014-semver.md), que
  el front consulta al arrancar para saber si su MAJOR sirve contra este servidor.
- El `OPTIONS` del preflight lo emite el navegador, no el código.

### La lectura lleva clave de idempotencia, y por eso lleva una nueva cada vez

La clave nace con la intención ([ADR-020](ADR-020-idempotencia.md)). En una escritura, la intención es «registrar este gasto»,
y el reintento la reutiliza. En una lectura, **cada consulta es una intención nueva** y lleva una
clave nueva; solo el reintento de esa misma consulta reutiliza la suya. Reutilizarla entre dos
consultas distintas haría que la segunda recibiera la respuesta guardada de la primera, hasta 72
horas después.

Las dos operaciones de sesión —`POST /api/v0/sesiones` y `/sesiones/renovacion`— siguen exentas,
por la razón que ya tenían y que no cambia: todavía no hay clave de firma con qué firmar, y su
respuesta trae secretos que no deben quedar guardados en la tabla de idempotencia.

## Justificación

**La regla «lee o escribe» tiene que poder comprobarse, no recordarse.** Mientras colgaba del
verbo, había que aplicarla en el controlador, en el filtro de idempotencia, en el interceptor de
firma del front y en la cabeza de quien escribiera el siguiente endpoint. Colgando del primer
segmento de la ruta, una prueba recorre el OpenAPI generado y falla la compilación si aparece un
`GET`, igual que [C-03](../12-pruebas-y-calidad.md#c-03) y [C-04](../12-pruebas-y-calidad.md#c-04) ya hacen con el catálogo y con el contrato. Se acuerda la máquina o no
se acuerda nadie.

**El costo está admitido y es real.** Se pierde la semántica de HTTP, que es un idioma común que
todo el mundo lee sin explicación, y se paga un viaje extra por cada lectura, porque `POST` con
`Content-Type: application/json` siempre dispara preflight. A cambio, ningún dato de consulta
vuelve a viajar en una URL, y la frontera entre leer y escribir deja de depender de que alguien la
recuerde. Es un intercambio deliberado, no un descuido, y por eso existe este documento.

**El prefijo hace falta aunque no se hubiera pedido.** Sin él, `/consultas/cuentas` compite por el
espacio de rutas con lo que sirva los estáticos del front el día en que la API y el front compartan
dominio. Con él, todo lo que es contrato está en un sitio y todo lo que no, fuera.

## Consecuencias

- **Positivas:** ningún dato de consulta en la URL, en el registro del servidor ni en el historial
  del navegador; una sola regla de idempotencia, sin excepción por verbo; la frontera entre leer y
  escribir es visible en la ruta y la verifica una prueba; una consulta puede ganar filtros, rangos
  y paginación sin cambiar de forma, porque ya tiene cuerpo.
- **Negativas:** el contrato deja de leerse como REST y necesita este documento para entenderse;
  **toda** petición dispara preflight, donde antes varias lecturas viajaban directas, así que una
  lectura son dos viajes; ninguna respuesta es cacheable por HTTP —lo que aquí no cuesta nada,
  porque la caché sin conexión es IndexedDB propia y no caché de protocolo—; la tabla de
  idempotencia recibe una fila por cada consulta, y con retención de 72 horas eso pide vigilar su
  tamaño antes de lo que se habría pedido; y el día del go-live hay que mover todas las rutas de
  `/api/v0` a `/api/v1`.

## Referencias

- [ADR-020](ADR-020-idempotencia.md) · Idempotencia obligatoria en toda escritura — la regla que
  dejaba fuera a `GET` y que este documento pasa a enunciar sobre la ruta.
- [ADR-021](ADR-021-canal-firmado.md) · El canal firmado — firma el método, y su ejemplo era
  «convertir un `GET` en un `DELETE`». El mecanismo no cambia: con un solo verbo, lo que queda
  protegido es la ruta.
- [ADR-014](ADR-014-semver.md) · SemVer independiente por proyecto — de donde sale el `v0` del
  prefijo y la promesa de que `v1` llega con la primera publicación en producción.
- [ADR-022](ADR-022-openapi-generado.md) · OpenAPI generado del código — por eso este cambio se
  escribe primero en el contrato y después en los controladores, y [C-04](../12-pruebas-y-calidad.md#c-04) avisa si los dos se
  separan.
- [`20-contrato-de-api.md`](../20-contrato-de-api.md) — cómo se pide una consulta, con las
  cabeceras enteras.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [23](../23-diagramas-de-casos-de-uso.md "23 · Diagramas de los casos de uso") · [Contrato](../../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-012](ADR-012-identidad-a-postgres.md "ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando") · [ADR-014](ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-020](ADR-020-idempotencia.md "ADR-020 · Idempotencia obligatoria en toda escritura") · [ADR-021](ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
