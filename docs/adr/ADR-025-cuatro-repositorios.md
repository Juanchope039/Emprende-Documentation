# ADR-025 · Cuatro repositorios: la base de datos sale de la API

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.2.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-025-cuatro-repositorios.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-16 | 2026-10-30 | [Proceso](../INDICE.md#etiqueta-proceso) · [Paralelo](../INDICE.md#etiqueta-paralelo) · [Base de datos](../INDICE.md#etiqueta-base-de-datos) |

> **Dónde vive cada repositorio en disco lo reemplaza el [ADR-035](ADR-035-repositorios-hermanos.md).** Los cuatro son ahora hermanos
> en una carpeta de trabajo, y la especificación es uno más: ya no hay `repositories/` dentro de
> ella. Lo demás de este ADR —la base con repositorio propio y cómo se tapa la pérdida del commit
> único— sigue en pie. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

[ADR-023](ADR-023-tres-repositorios.md) repartió el código en tres repositorios —especificación,
API y front— y dejó las migraciones **dentro de `prisma_api`**, con un argumento explícito: *una
migración y el código que depende de ella tienen que poder entrar en el mismo commit*.

Ahora se piden dos cambios:

1. **La base de datos sale a su propio repositorio:** `supabase/` —migraciones, semilla y
   configuración de la pila local— y `scripts/db/`.
2. **Los repositorios de código pasan a vivir dentro de la especificación**, en
   `Finanzas-PRISMA/repositories/`: la API en `backend-api`, la base en `backend-db` y el front en
   `frontend-flutter`. Hasta hoy eran carpetas hermanas de `Finanzas-PRISMA`.

El segundo es de orden y no mueve ninguna frontera: `repositories/` está en el `.gitignore` de la
especificación, así que cada carpeta sigue siendo un repositorio git con su propia historia, sus
permisos y su tubería. El primero sí mueve una. Deshace a propósito lo único que [ADR-023](ADR-023-tres-repositorios.md) había
protegido del lado de la base, y por eso este ADR existe.

Hay un antecedente que lo vuelve menos brusco de lo que parece: [ADR-014](ADR-014-semver.md)
**ya trataba el esquema como un proyecto aparte**, con su propio SemVer y su tabla
`schema_version`. Lo que cambia es que ahora también tiene casa aparte.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Repositorio propio para la base** | El esquema tiene historia, permisos y tubería propios, igual que ya tenía versión propia. La clave `service_role`, que solo deben usar las migraciones, queda lejos del código que atiende usuarios. La imagen de la API ya no tiene SQL que excluir | **Se pierde el commit único:** una función que necesita una columna nueva son dos commits en dos repositorios, y el orden entre ellos deja de garantizarlo git. Las pruebas de integración de la API van a depender de otro repositorio |
| Migraciones dentro de la API (lo de [ADR-023](ADR-023-tres-repositorios.md)) | La migración y el código que la usa entran juntos: es imposible desplegar uno sin el otro. Una tubería menos | El esquema, que se versiona aparte, comparte historial y permisos con la API. La `service_role` convive en el mismo repositorio que el código que atiende usuarios |
| Migraciones en la especificación | Todo lo que describe la base, junto | Mezcla decidir con ejecutar, que [ADR-023](ADR-023-tres-repositorios.md) separó con razón: el modelo de datos escrito se revisa; las migraciones se aplican |

## Decisión

**Cuatro repositorios, y los tres de código dentro de `Finanzas-PRISMA/repositories/`.**

| Repositorio | En disco | Qué vive ahí | Quién escribe |
|---|---|---|---|
| `Finanzas-PRISMA` | — | Documentación, ADR, mockup y el **contrato**: `openapi.json` y el catálogo de códigos | Los dos equipos, con revisión cruzada |
| `prisma_api` | `repositories/backend-api` | Java 25 y Spring Boot | Equipo API |
| `emprende_db` | `repositories/backend-db` | `supabase/` y `scripts/db/` | Equipo API |
| `emprende_front` | `repositories/frontend-flutter` | Flutter | Equipo Front |

Lo demás de [ADR-023](ADR-023-tres-repositorios.md) **sigue en pie tal cual**: el contrato vive en la especificación, se versiona
con SemVer, se cambia con un solo PR revisado por los dos equipos, y la prueba `C-04` detiene la
compilación si la API se desvía de él.

**`emprende_db` lo escribe el equipo API.** La base sigue sin equipo propio por la misma razón de
[`21-trabajo-en-paralelo.md`](../21-trabajo-en-paralelo.md) [§2](../21-trabajo-en-paralelo.md#2-los-carriles): un equipo de datos se vuelve el
cuello de botella de todo, porque toda funcionalidad necesita una migración.

### Cómo se tapa la pérdida del commit único

No hace falta maquinaria nueva. Las tres piezas ya estaban decididas en otros sitios; aquí se
juntan.

1. **El esquema lleva su propio SemVer** en la tabla `schema_version`
   ([ADR-014](ADR-014-semver.md); tarea [0.10](../08-plan-de-desarrollo.md#tarea-0-10) del [Sprint 0](../08-plan-de-desarrollo.md#sprint-0)).
2. **Cada versión de la API declara el esquema que necesita**, en `emprende.esquema`, y su sonda de
   disponibilidad **no deja entrar tráfico si la base es más vieja**
   ([`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)). El desajuste se descubre al
   desplegar, no a mitad de un registro de venta.
3. **La migración se publica antes que la API que la necesita, y compatible con la API que ya
   corre.** Primero se agrega; lo viejo se quita en una versión posterior, cuando ya ninguna API
   desplegada lo use.

El orden del punto 3 es el que el commit único garantizaba sin que nadie lo pensara. Ahora hay
que sostenerlo, y el punto 2 es lo que hace que olvidarlo falle ruidoso en vez de en silencio.

## Justificación

**El esquema ya era un proyecto aparte; faltaba reconocerlo.** [ADR-014](ADR-014-semver.md) le dio versión propia y
[ADR-013](ADR-013-cuatro-ambientes.md) lo promueve por los ambientes a su propio ritmo. Tenerlo
dentro del repositorio de la API mezclaba dos historias que avanzan distinto: la API cambia a
diario, y cada cambio del esquema es un hecho que no se edita nunca.

**La clave más peligrosa del sistema queda donde debe.** La `service_role` anula RLS entera
([ADR-012](ADR-012-identidad-a-postgres.md)), y la documentación ya exige que solo la usen las
migraciones y nunca el despliegue que atiende usuarios ([19 §3.3](../19-ambientes-y-entrega.md#33-dónde-viven-los-secretos); tarea [9.8](../08-plan-de-desarrollo.md#tarea-9-8)). Con la base aparte,
eso deja de ser una regla que hay que recordar y pasa a ser una frontera: los secretos de la
tubería de migraciones viven en otro repositorio.

**El precio es real y conviene no maquillarlo.** El argumento de [ADR-023](ADR-023-tres-repositorios.md) sigue siendo cierto: con
un solo commit es imposible desplegar la API sin su columna. Lo que se compra es separación, y lo
que se paga es disciplina de orden. Por eso la comprobación del punto 2 no es opcional: sin ella,
este ADR cambia un fallo imposible por uno silencioso.

## Consecuencias

- **Positivas:** el esquema tiene historial, permisos y tubería propios, coherentes con la versión
  propia que ya tenía; la `service_role` sale del repositorio del código que atiende usuarios; y
  quien clona `Finanzas-PRISMA` encuentra en `repositories/` el sitio exacto de cada pieza, en vez
  de carpetas hermanas que había que adivinar.

- **Negativas:** **una función que necesita una columna nueva son dos commits, en dos
  repositorios y en orden**, y ese orden ya no lo garantiza git. Las pruebas de integración de la
  API —la de `pg_constraint` de la tarea [1.8](../08-plan-de-desarrollo.md#tarea-1-8), las de RLS— necesitan el esquema de otro
  repositorio: **lo consiguen por etiqueta, y la integración continua lo levanta con el Supabase CLI**
  ([ADR-029](ADR-029-esquema-por-etiqueta.md), tarea [1.20](../08-plan-de-desarrollo.md#tarea-1-20)). Hay una tubería más que montar y un juego más de secretos. Y quien
  llega nuevo clona cuatro cosas en vez de tres.

- **A vigilar:** si casi toda función termina en una migración y un cambio de API que tienen que
  publicarse juntos, y los errores de orden empiezan a aparecer en qa, la separación está cobrando
  más de lo que da y conviene volver a las migraciones dentro de la API.

## Referencias

- [ADR-029](ADR-029-esquema-por-etiqueta.md) — cómo consiguen el esquema la API y su integración continua, que este ADR dejó abierto
- [ADR-023](ADR-023-tres-repositorios.md) — la decisión que este reemplaza
- [ADR-014](ADR-014-semver.md) — el esquema ya tenía versión propia
- [ADR-013](ADR-013-cuatro-ambientes.md) — la promoción de migraciones por los cuatro ambientes
- [ADR-012](ADR-012-identidad-a-postgres.md) — por qué la `service_role` no puede tocar el camino de una petición
- [`21-trabajo-en-paralelo.md`](../21-trabajo-en-paralelo.md) — el reparto entre equipos y las reglas de las migraciones
- [`16-base-de-datos-y-snapshots.md`](../16-base-de-datos-y-snapshots.md) — qué hay en `emprende_db` y cómo se usa

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [16](../16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [Contrato](../../contrato/README.md "Contrato de la API · v0.36.0") · [ADR-023](ADR-023-tres-repositorios.md "ADR-023 · Tres repositorios y el contrato como artefacto versionado") · [ADR-026](ADR-026-railway-al-final.md "ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo") · [ADR-027](ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [ADR-029](ADR-029-esquema-por-etiqueta.md "ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase") · [ADR-035](ADR-035-repositorios-hermanos.md "ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo") · [ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md "ADR-051 · La visibilidad de un repositorio no se cambia") · [ADR-066](ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md "ADR-066 · La clave de servicio también sube el respaldo que nadie pidió") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive") · [ADR-070](ADR-070-las-migraciones-las-aplica-la-tuberia.md "ADR-070 · Las migraciones las aplica la tubería, no una persona") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
