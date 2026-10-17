# ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.3.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-014-semver.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-10-01 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

> **La decisión sigue vigente; un dato del cuerpo dejó de serlo.** Cuando se escribió, la API
> estaba en Dart y su versión vivía en un `pubspec.yaml`. [ADR-017](ADR-017-api-en-java.md) la
> pasó a Java con Spring Boot y [ADR-024](ADR-024-java-25-y-gradle.md) lo puso en Gradle, así
> que **la versión de `prisma_api` vive en su `build.gradle.kts`**. El
> front sigue en `pubspec.yaml` y el esquema sigue en sus migraciones. Lo que este ADR decide
> —SemVer independiente por proyecto y un contrato de compatibilidad que impide que ser
> independientes signifique romperse en silencio— no cambia en nada. La tabla vigente de dónde
> vive cada versión está en [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§4.1](../19-ambientes-y-entrega.md#41-tres-cosas-versionadas-por-separado).

> **Y un segundo dato.** Donde el cuerpo dice `GET /version`, hoy hay que leer
> `POST /api/v0/consultas/version`: desde [ADR-030](ADR-030-contrato-sin-get.md) ninguna operación
> usa `GET`. **El contrato de compatibilidad no cambia** —el front sigue preguntando al arrancar y
> plantándose si el MAJOR no coincide—, solo el verbo y la ruta. Y el `v0` del prefijo **es** este
> MAJOR: pasa a `v1` con la primera publicación en producción, que es cuando el número deja de ser
> `0.y.z`.

> **Y un tercero: que cada número diga la verdad ya no depende de nadie.** Este ADR da por hecho que
> las versiones suben; en dos días se fusionaron diecisiete PR sin subirlas, y «Acerca de» mostraba
> `0.2.0` y `0.1.0` en dev. Desde el [ADR-034](ADR-034-la-version-sube-en-cada-pr.md), **cada PR que cambia lo que se publica sube su versión
> un paso, y la integración continua de cada repositorio lo exige** (prueba [C-05](../12-pruebas-y-calidad.md#c-05)). La del esquema
> la publica la migración en su mismo PR, y la API la lee de `schema_version` en vez de repetirla
> en su configuración.

> **Y un cuarto, de redacción.** La frase que el cuerpo entrecomilla ya no es la que se muestra: la
> pantalla dice **«Esta versión ya no sirve con el servidor»**, y debajo pone las tres versiones que
> describe el [10 §4.10](../10-ux-y-mockups.md#410-versión-incompatible). Se quitó el «Actualiza.» porque la explicación de la pantalla ya lo dice con
> más detalle, y se pasó de dos filas a tres porque el front y la API son dos SemVer independientes y
> pueden coincidir en el número sobre una pantalla que dice que no se entienden. **Lo que este ADR
> decide no cambia**: el front se planta y no deja seguir.

## Contexto

El sistema deja de ser una sola cosa desplegable. Ahora son tres que se publican por separado:
el front en Flutter, la API en Dart y el esquema de la base de datos. Cada una puede cambiar sin
que las otras cambien, y cada una se promueve por los cuatro ambientes a su propio ritmo.

Eso obliga a decidir dos asuntos distintos que suelen confundirse:

1. **Cuántas versiones hay** —una para todo el sistema o una por proyecto—.
2. **Qué impide que dos piezas con versiones distintas se hablen mal.**

Sin lo segundo, lo primero es una trampa: el front pide un campo que la API ya no devuelve, nadie
se entera al arrancar, y el fallo aparece tres pantallas después con un valor nulo.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Tres versiones independientes + contrato de compatibilidad** | Cada número dice la verdad sobre su proyecto; el desajuste se detecta al arrancar | Hay que sostener el contrato y el endpoint que lo expone |
| Una sola versión para todo el sistema | Un número que recordar; fácil de explicar | Obliga a publicar las tres piezas juntas siempre, aunque solo cambie una |
| Versiones sincronizadas artificialmente | Parece ordenado en el papel | **Miente**: si el front sube a `0.5.0` porque la API subió, nadie sabe cuál de las dos cambió |
| Sin versionado formal | Cero ceremonia | Ante un fallo reportado no se puede saber qué estaba corriendo ni contra qué servidor |

## Decisión

**Cada proyecto lleva su propia versión SemVer, y la compatibilidad entre ellos se declara y se
comprueba al arrancar.**

### Tres cosas versionadas por separado

| Proyecto | Dónde vive la versión | Formato |
|---|---|---|
| `prisma_front` | `pubspec.yaml` | `MAJOR.MINOR.PATCH+BUILD` |
| `prisma_api` | `pubspec.yaml` | `MAJOR.MINOR.PATCH` |
| Esquema de base | Migraciones numeradas + tabla `schema_version` | `MAJOR.MINOR.PATCH` |

### Reglas

- **Antes del go-live todo es `0.y.z`.** La primera publicación en prod es `1.0.0`. Es lo que
  dice SemVer y evita fingir estabilidad que todavía no existe.
- **MAJOR** de la API: cambio que rompe el contrato con el front (un campo que desaparece, un
  tipo que cambia, un endpoint que se va).
- **MINOR**: funcionalidad nueva compatible hacia atrás.
- **PATCH**: corrección que no cambia el contrato.
- **Las versiones del front y de la API son independientes.** No se sincronizan artificialmente.

### El contrato de compatibilidad

Para que ser independientes no signifique romperse en silencio:

- La API expone `GET /version` con su versión, la del esquema y el ambiente.
- El front declara en tiempo de compilación **qué MAJOR de la API necesita**.
- Al arrancar, el front consulta `/version`. Si el MAJOR no coincide, muestra una pantalla clara
  —«Esta versión de la aplicación ya no sirve con el servidor. Actualiza.»— y no deja seguir.
- Cada versión de la API declara hasta cuándo sostiene el MAJOR anterior.

## Justificación

**Fingir que el front y la API van juntos oculta cuál de las dos cambió de verdad.** Si una sola
corrección de estilo en el formulario obliga a subir también el número de la API, el historial de
versiones deja de servir para lo único que sirve: mirar un número y saber qué se movió. Tres
proyectos que se despliegan por separado necesitan tres números que se muevan por separado.

**El contrato de compatibilidad es lo que impide que ser independientes signifique romperse en
silencio.** El front declara qué MAJOR de la API necesita, lo comprueba al arrancar contra
`GET /version`, y si no coincide se planta con un mensaje claro en vez de fallar en la pantalla 7
con un campo nulo. **Fallar ruidoso es mejor que fallar tarde:** un aviso al entrar lo entiende
cualquiera y se arregla actualizando; un valor nulo a mitad de un registro de venta parece un
error de la persona que lo está escribiendo.

Que el número `0.y.z` se sostenga hasta el go-live no es formalismo. `1.0.0` es una promesa de
estabilidad del contrato, y hacerla antes de que el contrato exista obliga a romperla enseguida.

## Consecuencias

- **Positivas:** cada número dice la verdad sobre su proyecto; se puede publicar una corrección
  de la API sin recompilar el front; un desajuste se descubre al arrancar y no en producción a
  mitad de una tarea; ante un fallo reportado, `GET /version` y el panel «Acerca de» dicen
  exactamente qué estaba corriendo y contra qué servidor.
- **Negativas:** hay tres números que mantener en vez de uno, y hay que sostener disciplina para
  que MAJOR signifique siempre lo mismo. La comprobación al arrancar agrega una petición antes de
  la primera pantalla, y si la API no responde el front no entra —lo cual es deliberado: entrar a
  medias sería peor—. Además, publicar un MAJOR de la API obliga a coordinar la publicación del
  front, que es justo el trabajo que el versionado independiente hace visible en vez de esconder.

## Referencias

- [ADR-004 · Base de datos de solo escritura](ADR-004-base-solo-escritura.md) — el mismo
  principio aplicado a las migraciones: una migración aplicada no se edita, se corrige con otra.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) — detalla los cuatro ambientes, la
  promoción de artefactos y el procedimiento de publicación y de reversión.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [10](../10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [18](../18-distribucion-y-pipelines.md "18 · Distribución multiplataforma y automatización (pipelines)") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [Contrato](../../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-019](ADR-019-contrato-de-respuesta.md "ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos") · [ADR-022](ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [ADR-023](ADR-023-tres-repositorios.md "ADR-023 · Tres repositorios y el contrato como artefacto versionado") · [ADR-024](ADR-024-java-25-y-gradle.md "ADR-024 · Java 25, Gradle y Spring Boot 4 en la API") · [ADR-025](ADR-025-cuatro-repositorios.md "ADR-025 · Cuatro repositorios: la base de datos sale de la API") · [ADR-026](ADR-026-railway-al-final.md "ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo") · [ADR-027](ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [ADR-029](ADR-029-esquema-por-etiqueta.md "ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase") · [ADR-030](ADR-030-contrato-sin-get.md "ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0") · [ADR-032](ADR-032-railway-en-dev-ahora.md "ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final") · [ADR-034](ADR-034-la-version-sube-en-cada-pr.md "ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige") · [ADR-042](ADR-042-la-version-del-documento-es-la-de-la-api.md "ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main")
<!-- /generado:referenciado-desde -->
