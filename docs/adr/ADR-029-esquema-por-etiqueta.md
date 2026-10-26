# ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-029-esquema-por-etiqueta.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-16 | 2026-09-16 | [Base de datos](../INDICE.md#etiqueta-base-de-datos) · [API](../INDICE.md#etiqueta-api) · [Entrega](../INDICE.md#etiqueta-entrega) · [Calidad](../INDICE.md#etiqueta-calidad) |

## Contexto

[ADR-025](ADR-025-cuatro-repositorios.md) sacó el esquema de `prisma_api` y lo puso en `prisma_db`, y dejó escrita una pregunta
sin responder: **de dónde saca el esquema la API para sus pruebas de integración**, ahora que vive en
otro repositorio. Es la tarea [1.20](../08-plan-de-desarrollo.md#tarea-1-20) del plan, y bloquea tres tareas que no son opcionales:

- La **prueba de permisos con sesión real** ([1.7](../08-plan-de-desarrollo.md#tarea-1-7)): una sesión de tipo Operación pide datos
  restringidos y **la base** la rechaza, con la comprobación de la API desactivada a propósito. Es lo
  que hace cierto a [ADR-006](ADR-006-rls-por-rol.md), y sin una base real no se puede escribir.
- La **traducción restricción → código del catálogo** ([1.8](../08-plan-de-desarrollo.md#tarea-1-8)), cuya prueba recorre `pg_constraint`
  y falla si falta una entrada. Necesita las restricciones aplicadas, no el archivo `.sql`.
- La **prueba de corte** de la idempotencia ([1.15](../08-plan-de-desarrollo.md#tarea-1-15)), que interrumpe el proceso entre el efecto y el
  registro de la clave dentro de una transacción de verdad.

Tres cosas más, que son las que deciden:

1. **El esquema no es PostgreSQL a secas: es Supabase.** La migración inicial usa `auth.users`,
   `auth.uid()` y el rol `authenticated`, y las políticas de [04 §7](../04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) se evalúan contra ese rol con
   `FORCE ROW LEVEL SECURITY`. Probar RLS contra una base sin el esquema `auth` obliga a inventarlo, y
   entonces la prueba dice que los permisos funcionan **en algo que no es lo que corre en producción**.
2. **El esquema ya tenía versión propia** ([ADR-014](ADR-014-semver.md)) y la API ya declara la que necesita, en
   `prisma.esquema` ([19 §2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)). Falta el paso de convertir ese número en algo que se pueda
   descargar.
3. **Docker no arranca en la máquina de desarrollo, y sí en los ejecutores de GitHub.** Lo primero es
   una avería local; lo segundo, un hecho con el que se puede contar.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Etiqueta de `prisma_db` + Supabase CLI en la integración continua** | La base de las pruebas es la misma que la de producción, con `auth` y sus roles; la referencia es una **versión del esquema**, no un commit; no hay artefacto nuevo que publicar ni registro que mantener | La tubería de la API descarga otro repositorio y tarda unos minutos más; si la base es privada hace falta un token; y en local, sin Docker, esas pruebas no corren |
| Imagen de PostgreSQL con el esquema, publicada en GHCR | La tubería arranca en segundos y no depende del CLI | Hay que montar y mantener otra tubería, y la imagen `postgres` no trae `auth` ni los roles de Supabase: habría que emularlos, que es exactamente lo que vuelve mentirosa una prueba de RLS |
| `prisma_db` como submódulo de `prisma_api` | `git clone --recurse-submodules` y ya está | Un submódulo fija un **commit**, no una versión del esquema, y el número de `prisma.esquema` quedaría de adorno. Y los submódulos se olvidan de actualizar justo cuando importa |
| Probar contra el proyecto dev de Supabase en la nube | No hay nada que levantar | Es una base compartida: una prueba que falla por lo que otro guardó hace diez minutos se termina ignorando ([21 §6.4](../21-trabajo-en-paralelo.md#64-ambientes)). Y las pruebas de RLS escriben y anulan datos |

## Decisión

1. **`prisma_db` etiqueta cada versión del esquema:** `esquema-vX.Y.Z`, con el mismo número que
   guarda `schema_version` (tarea [0.10](../08-plan-de-desarrollo.md#tarea-0-10)). Una migración fusionada sin etiquetar no existe para nadie más.
2. **La API sigue declarando el esquema que necesita** en `prisma.esquema`, y ese número es el que la
   tubería convierte en etiqueta. No hay una segunda lista que mantener al día.
3. **La integración continua de `prisma_api` corre las pruebas de integración en un trabajo aparte**,
   que descarga `prisma_db` en esa etiqueta —`actions/checkout` con `repository` y `ref`—, instala el
   Supabase CLI y levanta la base con `supabase db start`, que aplica las migraciones y la semilla.
   Las pruebas corren contra `127.0.0.1:54322`, que es la misma dirección que usa la configuración
   local.
4. **Las pruebas de integración llevan una etiqueta de JUnit y no corren en la compilación normal.**
   `./gradlew build` sigue pasando sin Docker y sin base, que es la única forma de trabajar en esta
   máquina; las de integración se piden a propósito y fallan claro si no hay base a la que hablarle.
5. **Si el repositorio de la base es privado, la tubería lleva un token de solo lectura** en el
   secreto `PRISMA_DB_TOKEN`, y nada más. La `service_role` no entra: la crea y la usa `supabase db
   start` en su propia base local, y los secretos de las migraciones se quedan en `prisma_db`.
6. **Cuando una función necesita una columna nueva, primero se etiqueta la base y después sube
   `prisma.esquema`.** Es el punto 3 de [ADR-025](ADR-025-cuatro-repositorios.md) dicho en la tubería: la migración se publica antes que
   la API que la necesita.

## Justificación

**Una prueba de permisos vale lo que valga la base contra la que corre.** Todo el diseño de
[ADR-006](ADR-006-rls-por-rol.md) y [ADR-012](ADR-012-identidad-a-postgres.md) —la identidad propagada, el rol `authenticated`, las políticas con `FORCE`— se
apoya en piezas que pone Supabase. La opción rápida era una imagen de PostgreSQL con las tablas
adentro, y el precio de esa rapidez es emular `auth`: la prueba pasaría, y no diría nada sobre lo que
corre en producción. Levantar Supabase cuesta minutos de tubería; equivocarse aquí cuesta creer que
los permisos están probados.

**La etiqueta es la traducción natural de algo que ya existía.** El esquema tenía versión propia y la
API declaraba cuál necesita; lo único que faltaba era poder pedirla. Un submódulo habría cambiado esa
versión por un commit, y con ella el único aviso ruidoso que hay cuando la base y la API se desfasan.

**Lo local y lo automático se separan a propósito.** En esta máquina Docker no arranca, y atar
`./gradlew build` a una base sería atar todo el trabajo diario a una avería. Con la etiqueta de JUnit,
la compilación de siempre sigue en verde y las pruebas que necesitan base corren donde hay base.

## Consecuencias

- **Positivas:** las pruebas de RLS, de restricciones y de idempotencia se escriben contra la base de
  verdad; la tubería dice en qué versión del esquema corrió; y el desfase entre base y API se
  descubre en la integración continua, no al desplegar.

- **Negativas:** la tubería de la API descarga otro repositorio y levanta Docker, así que tarda más y
  puede fallar por algo que no es la API. Aparece un secreto nuevo si la base es privada. Y **quien
  desarrolla en esta máquina no puede correr esas pruebas** hasta que Docker arranque: las ve fallar
  o pasar en la tubería, que es un lazo de realimentación más largo.

- **A vigilar:** si se vuelve costumbre empujar código de la API sin poder correr las pruebas de
  integración en local, el número de veces que la tubería falla por esas pruebas es la señal de que
  hace falta resolver Docker o darle a cada carril su propio proyecto gratuito de Supabase.

## Referencias

- [ADR-025](ADR-025-cuatro-repositorios.md) — la decisión que dejó esta pregunta abierta
- [ADR-014](ADR-014-semver.md) — el esquema ya tenía su propio SemVer
- [ADR-006](ADR-006-rls-por-rol.md) y [ADR-012](ADR-012-identidad-a-postgres.md) — lo que estas pruebas tienen que poder comprobar
- [12-pruebas-y-calidad.md](../12-pruebas-y-calidad.md) — las pruebas de permisos con sesión real
- [19-ambientes-y-entrega.md](../19-ambientes-y-entrega.md) [§2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro) — la API declara el esquema que necesita
- Tareas [1.7](../08-plan-de-desarrollo.md#tarea-1-7), [1.8](../08-plan-de-desarrollo.md#tarea-1-8) y [1.15](../08-plan-de-desarrollo.md#tarea-1-15) — las que esta decisión destraba, y donde se monta la tubería

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [16](../16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-025](ADR-025-cuatro-repositorios.md "ADR-025 · Cuatro repositorios: la base de datos sale de la API") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main") · [ADR-070](ADR-070-las-migraciones-las-aplica-la-tuberia.md "ADR-070 · Las migraciones las aplica la tubería, no una persona")
<!-- /generado:referenciado-desde -->
