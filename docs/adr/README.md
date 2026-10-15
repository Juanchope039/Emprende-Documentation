# Decisiones de arquitectura (ADR)

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.31.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/README.md "Historial de cambios") | [🔄 Vivo](../22-documentacion.md#estados) | 2026-09-13 | 2026-10-15 | [Arquitectura](../INDICE.md#etiqueta-arquitectura) |

Registro de las decisiones técnicas importantes: qué se decidió, por qué, qué alternativas se
consideraron y qué consecuencias tiene.

| ADR | Decisión | Estado |
|---|---|---|
| [001](ADR-001-stack.md) | React + Vite + TypeScript + Supabase | Reemplazado por [011](ADR-011-stack-flutter-dart.md) |
| [002](ADR-002-arquitectura-hexagonal.md) | Arquitectura hexagonal con regla de dependencias verificada | Aceptado |
| [003](ADR-003-dinero-entero.md) | Dinero como entero de pesos | Aceptado |
| [004](ADR-004-base-solo-escritura.md) | Base de datos de solo escritura | Aceptado |
| [005](ADR-005-auditoria-por-triggers.md) | Auditoría por triggers, no por la aplicación | Aceptado |
| [006](ADR-006-rls-por-rol.md) | Permisos con Row Level Security | Aceptado |
| [007](ADR-007-pwa.md) | PWA en lugar de aplicación nativa | Reemplazado por [016](ADR-016-flutter-web-pwa.md) |
| [008](ADR-008-exportacion.md) | Exportación con descarga manual | Aceptado |
| [009](ADR-009-login-por-usuario.md) | Acceso con nombre de usuario, no con correo | Aceptado |
| [010](ADR-010-almacenamiento-contrasenas.md) | Contraseñas: hashing delegado con salt por usuario | Aceptado |
| [011](ADR-011-stack-flutter-dart.md) | Stack: Flutter y Dart con API propia | Reemplazado por [017](ADR-017-api-en-java.md) |
| [012](ADR-012-identidad-a-postgres.md) | La API propaga la identidad a PostgreSQL para que RLS siga juzgando | Aceptado |
| [013](ADR-013-cuatro-ambientes.md) | Cuatro ambientes y promoción de migraciones | Aceptado |
| [014](ADR-014-semver.md) | SemVer independiente por proyecto y contrato de compatibilidad | Aceptado |
| [015](ADR-015-validacion-tres-capas.md) | Validación en tres capas, con la base como juez | Reemplazado por [018](ADR-018-front-sin-decisiones.md) |
| [016](ADR-016-flutter-web-pwa.md) | Flutter Web instalable como PWA | Aceptado |
| [017](ADR-017-api-en-java.md) | Stack: Flutter en el front, Java con Spring Boot en la API | Reemplazado por [024](ADR-024-java-25-y-gradle.md) |
| [018](ADR-018-front-sin-decisiones.md) | Tres partes, y el front no toma decisiones | Aceptado |
| [019](ADR-019-contrato-de-respuesta.md) | Contrato de respuesta y catálogo de códigos de cinco dígitos | Aceptado |
| [020](ADR-020-idempotencia.md) | Idempotencia obligatoria en toda escritura | Aceptado |
| [021](ADR-021-canal-firmado.md) | Canal firmado contra repetición y manipulación | Aceptado |
| [022](ADR-022-openapi-generado.md) | OpenAPI generado del código y verificado en integración continua | Aceptado |
| [023](ADR-023-tres-repositorios.md) | Tres repositorios y el contrato como artefacto versionado | Reemplazado por [025](ADR-025-cuatro-repositorios.md) |
| [024](ADR-024-java-25-y-gradle.md) | Java 25, Gradle y Spring Boot 4 en la API | Aceptado |
| [025](ADR-025-cuatro-repositorios.md) | Cuatro repositorios: la base de datos sale de la API | Aceptado |
| [026](ADR-026-railway-al-final.md) | Railway aloja la API y el front, y el despliegue va al final del desarrollo | Reemplazado por [032](ADR-032-railway-en-dev-ahora.md) |
| [027](ADR-027-documentacion-versionada.md) | La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica | Aceptado |
| [028](ADR-028-un-commit-por-tarea.md) | Cada tarea hecha es un commit, y el commit explica por qué | Aceptado |
| [029](ADR-029-esquema-por-etiqueta.md) | El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase | Aceptado |
| [030](ADR-030-contrato-sin-get.md) | El contrato no usa GET: toda operación viaja por POST bajo `/api/v0` | Aceptado |
| [031](ADR-031-commit-de-256-caracteres.md) | El mensaje de commit cabe en 256 caracteres | Reemplazado por [036](ADR-036-sin-limite-en-el-commit.md) |
| [032](ADR-032-railway-en-dev-ahora.md) | Railway aloja dev desde ahora, y los otros tres ambientes siguen al final | Aceptado |
| [033](ADR-033-service-role-solo-en-auth.md) | La clave de servicio entra, pero solo para crear identidades | Aceptado |
| [034](ADR-034-la-version-sube-en-cada-pr.md) | La versión sube un paso en cada PR, y la integración continua lo exige | Aceptado |
| [035](ADR-035-repositorios-hermanos.md) | Los cuatro repositorios, hermanos en una carpeta de trabajo | Aceptado |
| [036](ADR-036-sin-limite-en-el-commit.md) | El mensaje de commit no tiene limite de longitud | Aceptado |
| [037](ADR-037-el-pr-se-abre-a-pedido.md) | La rama sale de la base al día, y el PR se abre a pedido y sin conflictos | Reemplazado por [040](ADR-040-rama-feature-y-pr-autorizado.md) |
| [038](ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md) | La pila local se orquesta desde `prisma_db`, y cada receta se apunta desde su `.env` | Aceptado |
| [039](ADR-039-cada-regla-en-un-solo-sitio.md) | Cada regla vive en un solo sitio: `CLAUDE.md`, `AGENTS.md` o una skill | Aceptado |
| [040](ADR-040-rama-feature-y-pr-autorizado.md) | Toda rama empieza por `feature/`, y el PR se abre solo con autorización expresa, trayendo entonces la base | Aceptado |
| [041](ADR-041-cuatro-lineas-por-parrafo.md) | Un párrafo de código o de commit tiene cuatro líneas como máximo | Aceptado |
| [042](ADR-042-la-version-del-documento-es-la-de-la-api.md) | El documento OpenAPI declara la versión de la API, y la del contrato viaja en `x-prisma-contrato` | Aceptado |
| [043](ADR-043-dependencias-solo-hacia-atras.md) | Una tarea solo depende de tareas anteriores | Aceptado |
| [044](ADR-044-dos-ambientes-desplegados.md) | Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería | Aceptado |
| [045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md) | El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio | Aceptado |
| [046](ADR-046-pre-prod-se-construye-desde-su-rama.md) | pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería | Reemplazado por [053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) |
| [047](ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) | El respaldo con manifiesto y la auditoría completa entran al [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) | Aceptado |
| [048](ADR-048-las-ramas-principales-las-protege-github.md) | Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar | Aceptado |
| [049](ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md) | Sin `DOCS_CLAVE`, Swagger toma `PREPROD_GERENCIA_CLAVE` | Aceptado |
| [050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) | `main` vuelve a ser la última etapa, y `pre-prod` entra en ella por PR | Aceptado |
| [051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md) | La visibilidad de un repositorio no se cambia | Aceptado |
| [052](ADR-052-la-entrega-del-release-a-prod.md) | La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada | Aceptado |
| [053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) | Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado | Aceptado |
| [054](ADR-054-la-entrega-va-al-monorepo-de-producto.md) | La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia | Aceptado |
| [055](ADR-055-uat-se-despliega-desde-el-monorepo.md) | uat se despliega desde `main` del monorepo de producto, y lo aprobado es solo la etiqueta | Aceptado |
| [056](ADR-056-qa-se-aloja-desde-su-rama.md) | qa también se aloja en Railway, construido desde la rama `qa` | Aceptado |
| [057](ADR-057-la-atribucion-va-una-vez-y-sin-la-sesion.md) | La atribución de un agente va una sola vez, y sin el enlace ni el id de su sesión | Aceptado |
| [058](ADR-058-el-monorepo-no-va-adelante-de-develop.md) | El monorepo de producto nunca lleva en sus subárboles algo que no esté en `develop` | Aceptado |
| [059](ADR-059-etiquetas-con-esquema-y-release-en-main.md) | Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a `main` | Aceptado |
| [060](ADR-060-todo-pr-se-asocia-a-un-issue.md) | Todo PR se asocia a un issue del monorepo de producto | Aceptado |
| [061](ADR-061-se-promueve-con-merge-commit.md) | Se promueve con merge commit, y qa no recibe nada que no esté en develop | Aceptado |
| [063](ADR-063-todo-issue-y-todo-pr-lleva-milestone.md) | Todo issue y todo PR lleva milestone, con los mismos milestones en los cinco repositorios | Aceptado |

Son **60 decisiones** registradas: 50 aceptadas y 10 reemplazadas.

> **Sobre la numeración.** El cambio de stack se planeó como [ADR-010](ADR-010-almacenamiento-contrasenas.md) y [ADR-011](ADR-011-stack-flutter-dart.md), pero el 010 ya
> estaba ocupado por la decisión de contraseñas. Un número asignado no se reutiliza, así que el
> stack quedó en 011 y la PWA en 016.

## Por qué existen estos documentos

Dentro de un año, alguien —quizá la misma persona— va a preguntarse por qué el dinero se guarda
como entero, o por qué no se puede borrar nada. Sin estos registros, la respuesta se pierde y la
decisión se revierte sin conocer su razón.

Un ADR no se modifica: si una decisión cambia, se escribe uno nuevo que reemplaza al anterior y
se marca el viejo como **Reemplazado**.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [22](../22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
