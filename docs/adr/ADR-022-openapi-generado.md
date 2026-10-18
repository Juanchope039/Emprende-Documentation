# ADR-022 · OpenAPI generado del código y verificado en integración continua

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-022-openapi-generado.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-09-16 | [Contrato](../INDICE.md#etiqueta-contrato) · [Calidad](../INDICE.md#etiqueta-calidad) |

## Contexto

El usuario pidió que la API implemente **Swagger, actualizado, con documentación funcional**. Son
tres exigencias y no una, y la difícil es «actualizado».

Con [ADR-018](ADR-018-front-sin-decisiones.md), el front dejó de tener reglas propias: pide,
recibe y pinta lo que la API le dicta. Eso convierte al contrato de la API en el único sitio
donde está escrito qué puede hacer el sistema. Si ese contrato no coincide con lo que la API hace
de verdad, quien construya el front construirá contra algo que no existe, y el desajuste
aparecerá en pantalla, delante de la empleada.

Un documento de API escrito a mano **se desactualiza el primer día en que alguien tiene prisa**.
No hace falta mala fe: basta con un campo agregado un viernes.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Generado del código y verificado en integración continua** | El documento no puede mentir: sale de los controladores reales, y la compilación falla si el archivo versionado difiere del regenerado | Anotar bien los controladores cuesta trabajo; una firma nueva obliga a regenerar y volver a confirmar |
| Escribirlo a mano en un archivo YAML | Se redacta con calma y con el lenguaje que uno quiera | Se desactualiza solo. Nadie se entera de que mintió hasta que el front falla contra él |
| Generarlo del código, pero solo servirlo en vivo en `/docs` | Cero ceremonia; siempre refleja lo desplegado | No queda nada que revisar cuando se propone el cambio, no se puede comparar entre versiones, y **nada avisa** de que una firma cambió de forma incompatible |
| Contrato primero: escribir el OpenAPI y generar de ahí los controladores | El contrato manda de verdad; se puede acordar antes de programar | Es la disciplina correcta para varios equipos que negocian; aquí es un solo desarrollo y agrega una capa de generación que hay que sostener sin que nadie del otro lado la esté esperando |

## Decisión

**`springdoc-openapi` produce el documento OpenAPI 3.1 desde los controladores y los DTO de Spring
Boot** ([ADR-017](ADR-017-api-en-java.md)). **El documento nunca se escribe a mano.**

### Lo que lo mantiene actualizado de verdad

> El archivo `openapi.json` está **versionado en el repositorio**. La integración continua
> regenera el documento y **falla la compilación si difiere del versionado**. Actualizar la
> documentación deja de ser disciplina y pasa a ser un requisito para poder mezclar el cambio.

Esa es la parte que hace que la decisión signifique algo. Generar el documento asegura que
coincide con el código desplegado; versionarlo y compararlo es lo que hace que el cambio de
contrato **se vea en la revisión**, antes de publicarse, y no después.

### Documentación funcional, no solo técnica

Un esquema de campos dice qué forma tiene la petición. No dice qué hace la operación ni para qué
existe. Cada operación documenta, además de su forma:

| Qué documenta | Por qué |
|---|---|
| **Qué caso de uso implementa**, enlazado a [`02-casos-de-uso.md`](../02-casos-de-uso.md) ([CU-01](../02-casos-de-uso.md#cu-01) a [CU-37](../02-casos-de-uso.md#cu-37)) | Para poder ir del endpoint a lo que el negocio pidió, y al revés |
| **La regla de negocio** que aplica, en español y sin jerga | Quien retome la API dentro de dos años necesita saber por qué la operación rechaza lo que rechaza |
| **Qué códigos de `status` puede devolver**, con su mensaje, sacados del catálogo de [ADR-019](ADR-019-contrato-de-respuesta.md) | El front debe poder tratar cada caso sin adivinarlo ni inventarse mensajes |
| **Un ejemplo real** de petición y de respuesta | Un ejemplo copiable ahorra más tiempo que tres párrafos de descripción |
| **Qué tipo de usuario** puede llamarla, y que **el permiso lo aplica la base** | Documentar el permiso sin decir quién lo hace cumplir invita a confiar en el front. Lo hace cumplir RLS ([ADR-006](ADR-006-rls-por-rol.md)) |

Los códigos y los mensajes no se copian a la documentación: salen del mismo catálogo del que
salen las respuestas. Copiarlos sería volver a crear el problema que este ADR cierra.

### Dónde se publica

| Ambiente | Acceso a `/docs` |
|---|---|
| `dev`, `qa`, `uat` | Abierto |
| `prod` | **Detrás de autenticación** |

En producción va detrás de autenticación por una razón concreta: **el catálogo de endpoints es un
mapa del sistema.** Dice qué operaciones existen, qué parámetros aceptan y qué errores devuelven.
Eso le ahorra trabajo a quien esté buscando por dónde entrar, y no le sirve a nadie del taller.
No es secreto —la seguridad no depende de esconderlo, depende de RLS y de la autenticación—, pero
tampoco hay motivo para regalarlo.

## Justificación

**Generar el documento elimina la forma más obvia de mentir.** Si sale de los controladores, no
puede describir un campo que no existe ni omitir uno que sí.

**Verificar en integración continua elimina la que queda.** Un documento generado pero no
comparado se actualiza en silencio: la firma cambia, el archivo cambia, nadie lo mira y el front
descubre el cambio al fallar. Con el archivo versionado, el cambio de contrato aparece en el
mismo cambio que lo causó, con nombre y apellido, y quien revisa decide si es compatible o si
merece un MAJOR de la API ([ADR-014](ADR-014-semver.md)).

**La documentación funcional es lo que la vuelve útil para este proyecto en concreto.** Con el
front sin reglas propias, la pregunta «¿qué pasa si el valor es cero?» solo se puede responder
desde la API. Si la respuesta no está en el documento, hay que leer el código de Java, y entonces
la documentación no sirvió para nada.

## Consecuencias

- **Positivas:** el documento siempre coincide con la API desplegada; un cambio de contrato es
  visible en la revisión y no se descubre en producción; quien construya el front tiene el
  contrato, los mensajes y los ejemplos en un solo sitio; y el enlace al caso de uso mantiene
  cosida la documentación técnica con la funcional.
- **Negativas:** anotar los controladores cuesta trabajo real, y un cambio de firma obliga a
  regenerar y confirmar el `openapi.json` antes de poder mezclar. **Va a haber días en que esa
  compilación fallida moleste**, y ese es exactamente su trabajo: es la única barrera que impide
  que la documentación se quede atrás. No se desactiva para «desbloquear» una entrega. Además, el
  archivo generado produce diferencias grandes cuando cambia la versión de `springdoc`, así que
  conviene fijar la versión de la herramienta y no dejarla flotar.

## Referencias

- [ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API](ADR-017-api-en-java.md)
  — `springdoc-openapi` viene del ecosistema; no hay que construir el generador.
- [ADR-018 · Tres partes, y el front no toma decisiones](ADR-018-front-sin-decisiones.md) — por
  eso el contrato de la API es la única fuente de lo que el sistema puede hacer.
- [ADR-019 · Contrato de respuesta y catálogo de códigos](ADR-019-contrato-de-respuesta.md) — de
  ahí salen los códigos y mensajes que documenta cada operación.
- [ADR-014 · SemVer independiente por proyecto](ADR-014-semver.md) — un cambio incompatible del
  contrato es un MAJOR de la API.
- [ADR-006 · Permisos con Row Level Security](ADR-006-rls-por-rol.md) — quien aplica de verdad el
  permiso que documenta cada operación.
- [`02-casos-de-uso.md`](../02-casos-de-uso.md) — [CU-01](../02-casos-de-uso.md#cu-01) a [CU-37](../02-casos-de-uso.md#cu-37), a los que enlaza cada operación.
- [`12-pruebas-y-calidad.md`](../12-pruebas-y-calidad.md)
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [ADR-019](ADR-019-contrato-de-respuesta.md "ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos") · [ADR-023](ADR-023-tres-repositorios.md "ADR-023 · Tres repositorios y el contrato como artefacto versionado") · [ADR-027](ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [ADR-030](ADR-030-contrato-sin-get.md "ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0") · [ADR-042](ADR-042-la-version-del-documento-es-la-de-la-api.md "ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato") · [ADR-070](ADR-070-las-reglas-con-alcance-y-lo-compartido.md "ADR-070 · Una regla puede vivir en .claude/rules/ con su alcance, y lo compartido tiene una fuente y copias verificadas") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
