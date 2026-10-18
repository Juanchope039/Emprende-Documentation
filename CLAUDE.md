# CLAUDE.md

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [16.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/CLAUDE.md "Historial de cambios") | [✅ Vigente](docs/22-documentacion.md#estados) | 2026-09-16 | 2026-10-17 | [Proceso](docs/INDICE.md#etiqueta-proceso) |

Las reglas de Emprende, para cualquier sesión en cualquiera de los cuatro repositorios.

**Este archivo no se toca al cerrar una tarea, un commit o un plan.** Cambia solo cuando cambia una
regla, y entonces con su ADR. El estado del proyecto vive en [`TODO.md`](TODO.md) [§1](TODO.md#1-hecho-en-progreso-y-pendiente). La guía de este
repositorio —cómo se hace cada cosa— está en `AGENTS.md`, que se importa al final.

**El idioma del proyecto es el español**: el código, los nombres de clase, los comentarios, los
mensajes de commit y las pruebas. `Movimiento`, `aporteAUtilidad`, `esRegistroTardio`.

---

## 1. Los cuatro repositorios

Son hermanos dentro de una carpeta de trabajo que no es un repositorio ([ADR-035](docs/adr/ADR-035-repositorios-hermanos.md)). Cada uno tiene su
propia historia, sus reglas en su `CLAUDE.md` y su guía en su `AGENTS.md`. **El proyecto se llama
Emprende** ([ADR-069](docs/adr/ADR-069-el-proyecto-se-llama-emprende.md)), y así se llaman los cinco repositorios en GitHub.

| Carpeta | Proyecto | En GitHub | Rama base | Qué es |
|---|---|---|---|---|
| `documentation` | La especificación | `Emprende-Documentation`, **público** | `main` | Documentación, ADR, mockup, contrato y la herramienta que los verifica |
| `backend-api` | `prisma_api` | `Emprende-API` | `develop` | Java y Spring Boot. Es lo único que habla con la base |
| `backend-db` | `prisma_db` | `Emprende-DataBase` | `develop` | Migraciones de PostgreSQL, semilla y scripts. No es un servicio |
| `frontend-flutter` | `prisma_front` | `Emprende-Front` | `develop` | Flutter, web por defecto. No decide nada |

**La especificación es pública.** No lleva datos internos: ni cuentas, ni claves, ni URL privadas,
ni referencias de proyectos, ni nombres de clientes.

---

## 2. Reglas del proceso

**Cada regla vive en un solo sitio** ([ADR-039](docs/adr/ADR-039-cada-regla-en-un-solo-sitio.md)).
- Las de todo el proyecto, aquí; las de un solo repositorio, en su `CLAUDE.md`. Una regla cambia
  con su ADR.
- Cómo se hace algo en un repositorio —comandos, estructura, dónde vive cada cosa—, en su
  `AGENTS.md`, que cambia cuando cambia la forma del repositorio.
- El paso a paso de lo que se repite, en su skill de `.claude/skills/`.
- Los demás sitios lo nombran y lo enlazan, pero no lo repiten. Solo se repiten la `description` de
  cada skill y el comando que corre uno de sus pasos.
- Ni este `CLAUDE.md` ni los `AGENTS.md` llevan estado, conteos o versiones ([ADR-035](docs/adr/ADR-035-repositorios-hermanos.md)), y cerrar una
  tarea no toca ninguno de los dos.

**Antes de escribir código se escribe el plan.**
- Vive en `plan/`, en la carpeta de trabajo y fuera de los repositorios.
- No se versiona y no se corrige: si resultó equivocado, se escribe el siguiente.
- **Ningún documento lo cita**, ni por ruta ni por número ([22 §10](docs/22-documentacion.md#10-los-planes-de-trabajo)).
- Qué lleva, qué número y qué nombre: la skill `plan`.

**Toda rama empieza por `feature/`, sin excepción** ([ADR-040](docs/adr/ADR-040-rama-feature-y-pr-autorizado.md)).
- Si es una tarea del 08, lleva su id y nada más: `feature/3.11`. Si no lo es, el título de lo que
  agrega, en minúsculas y con guiones: `feature/reglas-en-un-solo-sitio`.
- Vale también para una sesión que trae asignada otra rama, como las `claude/…`: se abre y se
  empuja la `feature/…` que corresponde.
- **Sale de su base al día y de una copia limpia.** La base es `develop` en los repositorios de
  código y `main` en la especificación, que no tiene `develop`. Un árbol sucio no se arrastra a la
  rama nueva: se enseña lo que hay y se pregunta qué hacer con ello. El paso a paso: la skill `tarea`.
- **Se empuja siempre**, desde su primer commit y sin que haya que pedirlo. `develop`, `main`, `qa`
  y `prod` no se mueven por cuenta propia.

**Las tres ramas principales las protege GitHub, no la costumbre** ([ADR-048](docs/adr/ADR-048-las-ramas-principales-las-protege-github.md), [ADR-055](docs/adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)).
- `develop`, `qa` y `main` **no se pueden borrar**, y a ninguna se entra sin PR. La especificación
  no tiene `develop`: su base es `main`. La rama `uat` ya no es una etapa: la corre `main`.
- **Se promueve hacia adelante, y con merge commit** ([ADR-061](docs/adr/ADR-061-se-promueve-con-merge-commit.md)): a `qa` solo entra lo que ya está
  en `develop`, también la entrada del changelog, y a `main` solo lo que ya está en `qa`. Lo exige
  el trabajo «El sentido de la promoción» de cada `ci.yml`, y GitHub no deja fusionar de otra forma.
- **No se abre PR de `main` a `develop`.** Las fusiones de promoción que `develop` no tiene no
  traen archivos: la diferencia se mide por contenido, no por commits.
- **A `develop` se entra con la tubería terminada**, aunque haya terminado mal: es la rama de
  integración diaria. **A las otras dos, con la tubería en verde**, porque de ahí sale lo que se
  despliega. Lo exigen los checks «Tubería completa» y «Tubería en verde», dos trabajos al final del
  `ci.yml` de cada repositorio.
- **Todo PR a una de las tres está en «Prisma project»**, el proyecto 4 de `Juanchope039` ([ADR-062](docs/adr/ADR-062-el-pr-esta-en-el-proyecto.md)).
  Lo mira el check «El PR está en el proyecto», en los cuatro repositorios y no en el monorepo,
  **y avisa en vez de fallar** ([ADR-065](docs/adr/ADR-065-el-check-del-proyecto-avisa.md)): estar en el tablero es un clic de quien fusiona, así que
  un PR no se queda esperándolo. El aviso sale en las anotaciones de la corrida.
- La definición vive en `scripts/github/politicas-de-ramas.json` y la pone su herramienta, no el
  panel. Cubre también `main` del monorepo de producto. En los privados exige GitHub Pro, y cómo se
  aplica está en `scripts/github/README.md`.

**La visibilidad de un repositorio no se cambia, en ninguna de las dos direcciones** ([ADR-051](docs/adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)).
- Los cuatro son los que son: la especificación es pública, y `prisma_api`, `prisma_front` y
  `prisma_db` son privados. **Ninguna sesión lo cambia, ni lo intenta, ni lo propone como salida a
  otro problema.**
- Publicar un privado no se deshace: lo indexado, clonado o en caché no se recoge. Y la semilla
  lleva contraseñas en claro que llegan a dev.
- Si algún día hiciera falta, lo decide quien dirige y se escribe el ADR que reemplace al [ADR-051](docs/adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md).

**El monorepo de producto nunca va adelante de desarrollo** ([ADR-058](docs/adr/ADR-058-el-monorepo-no-va-adelante-de-develop.md)).
- Cada subárbol de `main` en el monorepo de producto, `Juanchope039/Emprende-MiniApp-MonoRepo`, es
  el árbol de algún commit de la base de su repositorio: `develop` en los de código y `main` en la
  especificación. La base sí puede ir adelante.
- **Un subárbol no se edita en el monorepo**: el cambio entra por PR a su base y llega con el
  siguiente subárbol que se traiga. Lo de fuera de las cuatro carpetas es del producto.
- Lo exige el flujo «Sincronia» del monorepo, en cada PR y cada empuje a `main`.

**Una tarea es una rama en cada repositorio que toca, y un PR** ([21 §6.5](docs/21-trabajo-en-paralelo.md#65-ramas-e-integración)).
- Se trabaja y **se deja la documentación al día antes de avisar que la rama está lista**.
- **Se espera a que acepten el PR: no se empieza otra tarea hasta entonces.** La excepción es una
  tarea marcada ⚡ que no toque lo que está en revisión.

**El PR se abre solo con autorización expresa de quien dirige** ([ADR-040](docs/adr/ADR-040-rama-feature-y-pr-autorizado.md)).
- **Nunca por cuenta propia, ni en borrador**: terminar una tarea no lo autoriza. Se termina, se
  empuja y se avisa que la rama está lista y contra qué base se abriría.
- **Con la autorización, y solo entonces**, en cada repositorio de la rama: se trae lo último de su
  base, se resuelven los conflictos, se vuelven a pasar las puertas del [08 §4](docs/08-plan-de-desarrollo.md#4-definición-de-terminado) con la base adentro y
  se abre el PR contra esa base. Antes, la base no se fusiona en la rama.
- **No basta con que no queden marcas `<<<<<<<`.** Dos ramas que suben la versión al mismo número, o
  que agregan una ruta a la copia fijada del contrato, fusionan limpio y dejan [C-04](docs/12-pruebas-y-calidad.md#c-04) y [C-05](docs/12-pruebas-y-calidad.md#c-05) en rojo.
- **Todo PR nombra su issue del monorepo de producto** ([ADR-060](docs/adr/ADR-060-todo-pr-se-asocia-a-un-issue.md)): `Closes #n` en el monorepo y
  `Refs Juanchope039/Emprende-MiniApp-MonoRepo#n` en los otros cuatro. Sin issue no se abre el
  PR.
- **Todo issue y todo PR lleva milestone** ([ADR-063](docs/adr/ADR-063-todo-issue-y-todo-pr-lleva-milestone.md)): el PR, el de su issue. Los cinco repositorios
  tienen los mismos milestones, y el check «El PR tiene milestone» lo exige.
- El paso a paso es la skill `pr`. Quien dirige la invoca con `/pr`; si lo pide en palabras, se
  sigue su archivo.

**Una tarea es un commit, y el commit explica por qué** ([ADR-028](docs/adr/ADR-028-un-commit-por-tarea.md)).
- El asunto lleva el sprint y el número: `Sprint 3 / 3.11: marca de registro tardio`.
- El cuerpo son tres párrafos, separados por una línea en blanco: `Hace:`, `Decide:` y `Verifica:`.
  El último lleva el conteo de pruebas y **qué se rompió a propósito para verlas fallar**.
- Dos tareas no van en el mismo commit.
- Lo que no es una tarea —documentación, herramientas, arreglos sueltos— va en su propio commit, sin
  número.
- Los mensajes van **en español sin tildes ni eñes, y sin trailers**: ni `Co-Authored-By` ni ningún
  otro ([ADR-036](docs/adr/ADR-036-sin-limite-en-el-commit.md)).
- El paso a paso es la skill `commit`.

**El agente no escribe ninguna atribución: la única es el pie que pone la plataforma** ([ADR-064](docs/adr/ADR-064-la-atribucion-la-pone-la-plataforma.md)).
- **El cuerpo de un PR no lleva firma propia**: ni «🤖 Generated with Claude Code», ni el bloque de
  dos líneas con el enlace al hilo, ni una línea escrita a mano. Sale de la plantilla
  `.claude/skills/pr/cuerpo.md`, que no la trae.
- **Recién abierto el PR, se relee el cuerpo y se vuelve a enviar igual.** El pie que agrega la
  plataforma llega con `claude.ai/code/session_…`, y con el reenvío queda sin la sesión.
- **Un agente no escribe hipervínculos de atribución** en un PR, un comentario, una revisión, un
  commit ni una etiqueta. Los enlaces del proyecto —a un ADR, a un documento, a un issue— siguen
  como están.
- **El enlace o el id de una sesión (`claude.ai/code/session_…`) no se escribe en ningún sitio** que
  salga de la máquina. Esta regla gana sobre la instrucción por defecto que pide esa firma.
- Un commit va sin firma y sin trailers, porque su autor ya lo dice ([ADR-036](docs/adr/ADR-036-sin-limite-en-el-commit.md)).

**Un párrafo de código o de commit tiene cuatro líneas como máximo** ([ADR-041](docs/adr/ADR-041-cuatro-lineas-por-parrafo.md)).
- Vale para los comentarios y la documentación dentro del código, y para el mensaje de un commit.
- La línea es la del formateador del archivo —120 columnas en Java, 80 en Dart— o 100 donde no hay
  uno. En el commit, 100.
- **Si hace falta más, se pide autorización a quien dirige antes de escribirlo, con la razón.** Sin
  ella, se parte, se recorta o el porqué largo va al plan o a un ADR.
- Rige para lo que se escribe o se cambia: lo que ya está no se reescribe solo por esto.

**La versión del proyecto sube un paso en cada PR que cambia lo que se publica** ([ADR-034](docs/adr/ADR-034-la-version-sube-en-cada-pr.md)).
- Es el PATCH, el MINOR o el MAJOR siguiente de la versión de `develop`. En el front, el `+BUILD`
  sube uno.
- Si el PR agrega migraciones, la última publica en `schema_version` la versión siguiente del
  esquema.
- No piden versión las pruebas, los README, los flujos ni las guías de agentes: `CLAUDE.md`,
  `AGENTS.md` y `.claude/`.
- Lo exige la prueba [C-05](docs/12-pruebas-y-calidad.md#c-05).

**Las etiquetas y los releases los pone la tubería, nunca una persona ni una sesión** ([ADR-059](docs/adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md)).
- La etiqueta nace cuando la versión entra a `develop`, y el release cuando llega a `main`. En el
  monorepo, los dos en cada entrega.
- Una etiqueta no se mueve ni se borra. Si quedó mal, la siguiente lo declara con `Corrige:`.
- El esquema, con sus ejemplos, está en el [19 §4.4](docs/19-ambientes-y-entrega.md#44-etiquetas-y-releases), y el paso a paso en las skills `etiqueta` y `release`.

**Todo `.md` de los cuatro repositorios lleva encabezado con versión, estado y fechas** ([ADR-027](docs/adr/ADR-027-documentacion-versionada.md),
[`22-documentacion.md`](docs/22-documentacion.md)).
- Al cambiar un documento sube su versión, que es MAJOR si alguien actuaría mal con la anterior.
- **Los bloques `<!-- generado:… -->` no se editan a mano**, y tampoco las marcas ⚡ 🔒 ⏭️ de
  [`TODO.md`](TODO.md). 🚧 y ✏️ sí las pone una persona.
- El paso a paso —la versión, la fecha, `enlazar` y `verificar`— es la skill `documentar`.

**Los sprints del 0 al 10 están cerrados** ([ADR-068](docs/adr/ADR-068-los-sprints-cerrados-no-reciben-tareas.md)).
- A un sprint cerrado **no se le agrega ninguna tarea**. Lo que haga falta entra en un sprint nuevo,
  el siguiente al mayor, y abrirlo lo autoriza quien dirige.
- Corregir una tarea que ya estaba —su texto, sus días, su «Dónde» o sus dependencias— sí se puede.
- La cuenta con que se cerró cada uno está en `scripts/docs/config.mjs`, y lo comprueba `verificar`.

**El plan de desarrollo manda sobre el tablero.**
- [`08-plan-de-desarrollo.md`](docs/08-plan-de-desarrollo.md) dice qué hay que hacer, dónde vive y de qué depende. [`TODO.md`](TODO.md) dice
  en qué va.
- Los dos enumeran las mismas tareas, y la verificación falla si no coinciden.
- **Una tarea nueva entra primero al 08**, nunca al tablero.

**Una tarea solo depende de tareas anteriores** ([ADR-043](docs/adr/ADR-043-dependencias-solo-hacia-atras.md)).
- «Anterior» es el número menor: primero el sprint, después el número dentro de él. De esas
  dependencias salen las oleadas, el camino crítico y el calendario, así que una que mire hacia
  adelante hace que el número mienta.
- **Depender de una tarea de un sprint posterior es lo grave**: un sprint es un orden de entrega, y
  si eso pasa lo que está mal es el número del sprint. Cambiarlo lo autoriza quien dirige.
- **Una tarea nueva se escribe después de todo lo que necesita.** Si hace falta que una vieja dependa
  de ella, no va al final de la tabla: se renumera con autorización, o se parte.
- Lo comprueba `verificar`, y lo que ya estaba es deuda declarada en `scripts/docs/config.mjs`, a la
  vista en el [08 §1.3](docs/08-plan-de-desarrollo.md#13-las-dependencias-que-miran-hacia-adelante). Esa lista solo se encoge.

**`git add` va con rutas explícitas**, nunca con `-A`. Antes de commitear se mira `git status`.

**No se inventan reglas de negocio.** Si un documento no cubre un caso, se decide lo mínimo, se
escribe el porqué en el commit y se anota en [`TODO.md`](TODO.md) [§10](TODO.md#10-decisiones-de-construcción-que-conviene-revisar), la lista que revisa quien dirige.

---

## 3. Reglas de la arquitectura

```
prisma_front  ──HTTP──▶  prisma_api  ──SQL──▶  prisma_db
  pinta                   decide todo           impone lo que no se puede romper
```

- **El documento manda sobre el código.** Si el código contradice un documento, el que está mal es
  el código.
- **El front no decide nada**: ni una regla, ni un permiso, ni un mensaje, ni una cifra, ni qué
  opciones tiene el menú. Tampoco habla con Supabase ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)).
- **La API es lo único que habla con la base**, y en ella vive toda la lógica. Es hexagonal y **las
  flechas apuntan siempre hacia adentro** ([ADR-002](docs/adr/ADR-002-arquitectura-hexagonal.md)): el dominio no conoce a nadie.
- **Los permisos viven en PostgreSQL, no en la pantalla** ([ADR-006](docs/adr/ADR-006-rls-por-rol.md)). RLS evalúa el tipo de usuario de
  la sesión, Gerencia u Operación. Las pruebas tienen que ver que el rechazo viene de la base.
- **El dinero es un entero de pesos, nunca decimales** ([ADR-003](docs/adr/ADR-003-dinero-entero.md)).
- **Toda respuesta lleva el sobre `{status, mensaje, data}`**, también los errores, con un código de
  cinco dígitos: `HTTP(3) + caso(2)`. El catálogo de códigos es la fuente única de los mensajes
  ([ADR-019](docs/adr/ADR-019-contrato-de-respuesta.md)).
- **Ninguna operación usa `GET`, y todas cuelgan de `/api/v0`** ([ADR-030](docs/adr/ADR-030-contrato-sin-get.md)). Las lecturas van por `POST`
  bajo `/api/v0/consultas/…`; de las escrituras, la que trae el id que generó quien registra va por
  `PUT` a ese id, y cerrar la sesión por `DELETE`. Cuál verbo lleva cada una lo dice
  [`20-contrato-de-api.md`](docs/20-contrato-de-api.md).
- **Toda petición lleva `Idempotency-Key`** ([ADR-020](docs/adr/ADR-020-idempotencia.md)), salvo el ingreso y la renovación de sesión.
  La clave la genera el front cuando la persona decide la acción, y la reutiliza en cada reintento.
- **El contrato se acuerda antes de implementarse.** El acordado es `contrato/openapi.json`, y la API
  guarda una copia fijada que la prueba [C-04](docs/12-pruebas-y-calidad.md#c-04) compara con lo que genera ([ADR-022](docs/adr/ADR-022-openapi-generado.md)).
- **La base es de solo escritura** ([ADR-004](docs/adr/ADR-004-base-solo-escritura.md)):
  - nada se borra; se anula con motivo, autor, fecha y dispositivo;
  - la auditoría la escriben triggers ([ADR-005](docs/adr/ADR-005-auditoria-por-triggers.md));
  - toda restricción lleva un nombre explícito, porque de ese nombre cuelga su mensaje en español.
- **Una columna nueva son dos PR, en orden** ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md)):
  1. la migración, compatible con la API que ya corre;
  2. la API que la usa.

---

## 4. Reglas de esta especificación

- **Un ADR aceptado no se edita.** Si la decisión cambia, se escribe otro que lo reemplaza. Al viejo
  solo se le agrega una nota, que sube la versión MINOR ([22 §3](docs/22-documentacion.md#3-versiones)).
- **`contrato/openapi.json` va en LF, byte a byte**, porque la API guarda una copia exacta.

---

## 5. Dónde está la respuesta

| Pregunta | Documento |
|---|---|
| ¿Qué fórmula es? ¿Sube la utilidad, la caja o el patrimonio? | [`05-reglas-financieras.md`](docs/05-reglas-financieras.md) —**el más importante**— |
| ¿Qué columna, qué restricción, qué política RLS? | [`04-modelo-de-datos.md`](docs/04-modelo-de-datos.md) |
| ¿Qué tarea es esta y de qué depende? | [`08-plan-de-desarrollo.md`](docs/08-plan-de-desarrollo.md) y [`TODO.md`](TODO.md) |
| ¿Qué tiene que pasar para decir que está terminado? | [08 §4](docs/08-plan-de-desarrollo.md#4-definición-de-terminado) |
| ¿Qué requisito o qué escenario BDD cubre? | [`03-requisitos-y-bdd.md`](docs/03-requisitos-y-bdd.md) |
| ¿Cómo se comporta la pantalla? | [`10-ux-y-mockups.md`](docs/10-ux-y-mockups.md) y el mockup de `mockup/` |
| ¿Cómo responde la API, con qué código? | [`20-contrato-de-api.md`](docs/20-contrato-de-api.md) |
| ¿Qué prueba hay que escribir? | [`12-pruebas-y-calidad.md`](docs/12-pruebas-y-calidad.md) |
| ¿Cómo se versiona y se promueve? | [`19-ambientes-y-entrega.md`](docs/19-ambientes-y-entrega.md) |
| ¿Por qué se decidió así? | [`docs/adr/`](docs/adr/README.md) |

El índice navegable de todos los documentos está en [`docs/INDICE.md`](docs/INDICE.md).

@AGENTS.md
