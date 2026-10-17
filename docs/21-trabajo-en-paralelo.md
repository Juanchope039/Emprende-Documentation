# 21 · Trabajo en paralelo

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [7.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/21-trabajo-en-paralelo.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-16 | 2026-10-17 | [Paralelo](INDICE.md#etiqueta-paralelo) · [Proceso](INDICE.md#etiqueta-proceso) |

Cómo avanza PRISMA con varias tareas a la vez sin que se bloqueen ni se pisen. **Lo que avanza en
paralelo son tareas, no personas:** una tarea la puede llevar una persona, un equipo o una sesión de
trabajo. Este documento fija las reglas; dónde vive cada tarea, de qué depende y cuánto dura el
desarrollo con 1, 2 o 3 a la vez lo calcula el plan ([08-plan-de-desarrollo.md](08-plan-de-desarrollo.md)).

> **Hoy: los cuatro repositorios ya existen y el plan ya dice dónde vive cada tarea.** Los
> repositorios están en GitHub ([ADR-025](adr/ADR-025-cuatro-repositorios.md) y [ADR-026](adr/ADR-026-railway-al-final.md)). Lo que falta es decidir quién trabaja cada
> parte ([§8](#8-qué-hay-que-decidir-antes-de-trabajar-dos-tareas-a-la-vez)), y eso conviene hacerlo **antes** de que la segunda escriba su primera línea:
> después ya hay código que reorganizar y decisiones tomadas por omisión.

---

## 1. Lo que hace esto posible, y lo que lo haría imposible

El paralelismo no sale de repartir tareas. Sale de que **ya existe una frontera explícita** entre
las partes. Tres decisiones tomadas antes lo permiten:

| Decisión | Por qué habilita el paralelismo |
|---|---|
| [ADR-018](adr/ADR-018-front-sin-decisiones.md) · el front no decide nada | El front no necesita conocer ninguna regla: solo el contrato. Puede construirse entero contra un servidor simulado |
| [ADR-019](adr/ADR-019-contrato-de-respuesta.md) · sobre y catálogo de códigos | La forma de toda respuesta está fijada antes de escribir la primera. Nadie negocia el formato dos veces |
| [ADR-022](adr/ADR-022-openapi-generado.md) · OpenAPI verificado en CI | El contrato no se desincroniza en silencio: la compilación falla |

Y una que lo haría imposible si se relajara:

> **Si el front empieza a decidir algo —un umbral, un mensaje, qué opción de menú existe— los
> repositorios dejan de tener una frontera y pasan a tener una negociación permanente.** Cada
> funcionalidad exigiría ponerse de acuerdo sobre dónde vive cada regla. El principio 9 de
> [`10-ux-y-mockups.md`](10-ux-y-mockups.md) no es una preferencia de estilo: es lo que mantiene independientes a los
> repositorios.

---

## 2. <a id="2-los-carriles"></a>Dónde vive cada tarea

Cada tarea del plan vive en un sitio. La columna **Dónde** de las tablas del 08 lo dice.

| Dónde | En qué repositorio | Escribe | Responde por | No toca |
|---|---|---|---|---|
| **API** | `prisma_api` | Java 25, Spring Boot | Que la regla se cumpla y el mensaje sea correcto | Widgets ni rutas del front |
| **Base** | `prisma_db` | SQL: migraciones, funciones, RLS y semilla | Que la base siga siendo el juez de los permisos y no pierda historia | Código de la API ni del front |
| **Front** | `prisma_front` | Dart, Flutter | Que la pantalla sea la del mockup y pinte lo que le dictan | SQL, reglas de negocio, textos de error |
| **Contrato** | `contrato/` de esta especificación | OpenAPI y el catálogo de códigos | Que los dos lados construyan contra lo mismo | La implementación de ninguno de los dos |
| **Decisión** | Ningún repositorio | — | Destrabar lo que el código no puede decidir | — |

**La base es un sitio del plan, pero no un equipo aparte.** Un equipo de datos se vuelve cuello de botella,
porque toda funcionalidad necesita una migración y todas lo esperarían. Por eso las tareas de Base
las toma quien trabaja la API, y solo se separan en un frente propio cuando hay tres tareas a la vez
activos y la carga de SQL lo justifica, como en el [Sprint 1](08-plan-de-desarrollo.md#sprint-1).

### 2.1 Lo que se posee en conjunto

Tres cosas no son de ningún repositorio en particular y **cambian con revisión de los dos lados**:

- El **contrato** (`openapi.json` y el catálogo de códigos).
- El **mockup**, que sigue siendo el contrato de diseño.
- Los **documentos** de `docs/`, con las reglas de [`22-documentacion.md`](22-documentacion.md).

Un cambio en cualquiera de las tres afecta a todos, así que una sola parte no puede decidirlo por
su cuenta. Es la única coordinación obligatoria que queda, y por eso conviene que sea la única.

---

## 3. Cuatro repositorios

| Repositorio | En disco | Qué vive ahí | Dónde |
|---|---|---|---|
| **`Finanzas-PRISMA`** | `repositories/documentation` | Documentación, ADR, mockup **y el contrato**: `openapi.json` y el catálogo de códigos | Contrato y documentación, con revisión cruzada |
| **`prisma_api`** | `repositories/backend-api` | Java y Spring Boot | API |
| **`prisma_db`** | `repositories/backend-db` | `supabase/migrations/`, la semilla y los scripts de la base | Base |
| **`prisma_front`** | `repositories/frontend-flutter` | Flutter | Front |

Los cuatro son hermanos dentro de una carpeta de trabajo que no es un repositorio: ninguno contiene
a otro y cada uno conserva su propia historia ([ADR-025](adr/ADR-025-cuatro-repositorios.md), [ADR-035](adr/ADR-035-repositorios-hermanos.md)).

Las migraciones tienen repositorio propio, y eso tiene un precio que hay que tener presente
**porque una migración y el código que depende de ella ya no entran en el mismo commit.** Si la
API se publica antes que su migración, se produce el fallo más caro de todos: una versión
desplegada que espera una columna que todavía no existe. Por eso el orden es una regla ([§6.1](#61-migraciones)).

El modelo de datos escrito ([`04-modelo-de-datos.md`](04-modelo-de-datos.md)) se queda en la especificación. Es la diferencia
entre **qué debe existir** y **cómo se llegó a eso**: lo primero se decide y se revisa, lo segundo
se ejecuta.

### 3.1 El punto débil de tener repositorios separados, y cómo se tapa

> **Con un solo repositorio, un cambio de contrato entra en un commit con sus dos lados. Con
> varios, son varios cambios coordinados, y el día que se desincronizan alguien pierde media tarde
> buscando por qué el front pide un campo que la API ya no manda.**

Se tapa convirtiendo el contrato en un **artefacto con versión propia**, no en un archivo que
cada quien copia:

1. El contrato vive en `Finanzas-PRISMA` y se versiona con **SemVer**, igual que los otros tres
   proyectos de [ADR-014](adr/ADR-014-semver.md).
2. Un cambio de contrato es **un solo PR**, en ese repositorio, revisado por los dos lados. Al
   fusionarse se etiqueta una versión.
3. **Cada lado actualiza su dependencia cuando puede.** El front genera de esa versión su cliente
   y su servidor simulado; la API genera de ella sus modelos.
4. La prueba [C-04](12-pruebas-y-calidad.md#c-04) compara el OpenAPI que la API genera contra la versión etiquetada del contrato.
   **Si difieren, la compilación falla.**

Así los cambios coordinados se vuelven uno solo más dos actualizaciones de dependencia, que ocurren
cuando a cada lado le conviene y no el mismo día.

### 3.2 Contrato acordado y contrato generado no se contradicen

[ADR-022](adr/ADR-022-openapi-generado.md) dice que el OpenAPI se genera del código y nunca se escribe a mano. Este documento dice que
el contrato se acuerda antes de escribir el código. Las dos cosas son ciertas y cumplen papeles
distintos:

| | Para qué sirve | Cuándo |
|---|---|---|
| **Contrato acordado** | Que el front pueda empezar sin esperar a la API | Antes de implementar: es la tarea de contrato de cada funcionalidad, como las tareas [1.17](08-plan-de-desarrollo.md#tarea-1-17) o [3.13](08-plan-de-desarrollo.md#tarea-3-13) |
| **OpenAPI generado** | Que lo implementado siga siendo lo acordado | En cada compilación |

El primero es el plano; el segundo, la verificación de que lo construido corresponde al plano.
Si alguna vez discrepan, **gana el generado y falla la compilación**: significa que alguien
implementó algo distinto a lo acordado sin decirlo.

---

## 4. Cómo se reparte el trabajo: cimientos, luego rebanadas

### 4.1 Por qué no se reparte por capas todo el tiempo

Repartir por capa de principio a fin —alguien siempre en el front, otro siempre en la API— es lo
más fácil de organizar y lo peor de entregar: **ninguna funcionalidad está lista hasta que los
dos terminan su mitad**, así que nada se entrega hasta que acaba el más lento, y el trabajo
terminado de uno se queda esperando en una rama.

Repartir por rebanada vertical desde el primer día tampoco sirve aquí: los cimientos —sesión,
propagación de identidad, sobre de respuesta, idempotencia, canal firmado— **son transversales
y los necesitan todas las rebanadas**. Construirlos dos veces, o a empujones entre funcionalidades,
es exactamente donde se rompen los sistemas.

Por eso: **cimientos por capa, y a partir de ahí rebanadas completas.**

### 4.2 Fase 1 · Cimientos (Sprints 0 a 2)

Aquí el reparto **es por capa**, porque lo que se construye es la capa misma. Las tareas exactas de
cada parte están en las tablas del plan, y sus oleadas dicen cuáles van a la vez.

| Sprint | API | Base | Front | Contrato |
|---|---|---|---|---|
| **0** | Proyecto Java, sobre de respuesta, catálogo de códigos, descriptor | Rol `prisma_api` y `schema_version` | Proyecto Flutter, insignia de versión, sistema de diseño en widgets | El contrato v0.2.0 |
| **1** | Transacción con identidad, traducción de restricciones, idempotencia | Esquema, auditoría, RLS y semilla | Renderizador del descriptor y cliente HTTP con clave de idempotencia | Cuentas y categorías |
| **2** | Acceso, usuarios, cargos, canal firmado | Cargos, usuarios y la bitácora | Pantallas de acceso, cambio de clave y gestión de usuarios | Acceso, usuarios y firma |

> **El trabajo del front no se queda esperando, y ya no depende de acordarse de planificarlo.** Durante
> los Sprints 0 y 1 la API todavía no tiene endpoints de negocio, así que el trabajo del front es
> traducir el mockup a componentes de Flutter y construir el renderizador del descriptor. Esas
> tareas están numeradas en el plan y dependen del contrato, no de los endpoints.

Al final del [Sprint 2](08-plan-de-desarrollo.md#sprint-2) existe lo que permite trabajar por rebanadas: contrato estable, sesión real,
sobre de respuesta y un servidor simulado del que el front puede tirar sin la API.

### 4.3 Fase 2 · Rebanadas verticales (Sprints 3 a 8)

Cada tarea toma funcionalidades **completas**: su SQL, su endpoint y su pantalla. Con dos tareas a la vez
activos, las dos cadenas se eligieron para que compartan lo mínimo:

| | **Cadena A · el dinero** | **Cadena B · el pedido** |
|---|---|---|
| Primero | Movimientos y cuentas | Productos y costeo |
| Después | Reportes y KPIs | Pedidos y anticipos |
| Al final | Capital, retiros y patrimonio | Cotizador |
| Tablas propias | `movimientos`, `cuentas`, `categorias`, `activos`, `aportes_retiros` | `productos`, `costos_producto`, `pedidos`, `pedido_lineas`, `clientes`, `cotizaciones` |
| Rango de códigos | `20`–`29`, `60`–`69`, `90`–`99` | `30`–`39`, `40`–`49`, `80`–`89` |

**Nómina** queda fuera de las dos cadenas a propósito: es la funcionalidad más independiente del
sistema y sirve de amortiguador. Con dos tareas a la vez la toma el que termine primero su cadena; **con
tres, es la tercera cadena desde el principio de las rebanadas**, y esa cadena pasa
después a la PWA y al endurecimiento del [Sprint 9](08-plan-de-desarrollo.md#sprint-9), que ya no esperan a nadie.

> **Los rangos de código ya estaban repartidos por módulo desde [ADR-019](adr/ADR-019-contrato-de-respuesta.md), y eso resulta ser justo
> lo que hace falta ahora.** Cada módulo escribe en su propio rango del catálogo, así que dos
> tareas agregando códigos a la vez no se pisan ni una sola línea. No estaba pensado para esto;
> conviene notarlo antes de que alguien proponga reorganizar el catálogo.
>
> **Nómina no tiene fila en esta tabla porque queda fuera de las dos cadenas, y sí tiene rango:** el
> `50`–`59`, que estrenó la tarea [8.11](08-plan-de-desarrollo.md#tarea-8-11) junto con el `80`–`89` de cotizaciones —que sí es de la
> cadena B— y el `70`–`79`, que pasó a llamarse «Exportación, importación y respaldo» ([20 §2.4](20-contrato-de-api.md#24-los-rangos-por-módulo)).
> El `60`–`69` de reportes, que es de la cadena A, lo estrenó la [6.10](08-plan-de-desarrollo.md#tarea-6-10), **la última tarea del
> trabajo del contrato**. Con eso **los diez módulos del plan tienen códigos en su rango**, y ninguna
> funcionalidad queda por acordar.
>
> **Capital fue la excepción, y ya no lo es.** [ADR-019](adr/ADR-019-contrato-de-respuesta.md) no le había dado rango, y esta tabla le
> ponía el `70`–`79`, que es de Exportación y respaldo. Desde la tarea [7.9](08-plan-de-desarrollo.md#tarea-7-9) tiene el `90`–`99`,
> que era la reserva ([20 §2.4](20-contrato-de-api.md#24-los-rangos-por-módulo)).

### 4.4 Las dependencias que sí existen entre las cadenas

Las cadenas no son del todo independientes, y el plan lo dice tarea por tarea en vez de por sprint:

- **Reportes consume las dos.** La tarea [6.1](08-plan-de-desarrollo.md#tarea-6-1) necesita los saldos de Movimientos (3.12), la venta
  causada de Pedidos (4.5), el costeo de Productos (5.3) y los retiros de Capital (7.3 y 7.4).
- **Pedidos necesita Productos.** Un pedido con líneas (4.3) necesita el catálogo (5.2); por eso la
  cadena B empieza por Productos.
- **Capital necesita Movimientos**, porque un aporte o un retiro es un movimiento de plata.

Se resuelve por orden, no por coordinación: cada tarea arranca cuando lo que necesita está
**fusionado a `develop` con la integración continua en verde**. Hasta el [Sprint 9](08-plan-de-desarrollo.md#sprint-9) no hay qa donde
integrar ([ADR-032](adr/ADR-032-railway-en-dev-ahora.md)), así que `develop` hace de puerta.

---

## 5. Cuánto se gana de verdad

El plan lo calcula de las dependencias ([08 §1.1](08-plan-de-desarrollo.md#11-cuánto-dura-con-1-2-o-3-carriles-activos)): con 1, 2 y 3 tareas a la vez, contando que cada
tarea simultánea de más cobra su coordinación y que la estabilización no se parte. Antes de existir ese
cálculo, este documento estimaba a ojo **unas 17 semanas con dos equipos**; el cálculo da
prácticamente lo mismo, y eso es lo que permite creerle a la cifra de tres.

> **No es la mitad, y quien prometa la mitad se va a equivocar.** Tres razones concretas: los
> cimientos casi no se parten, porque son una cadena —el esquema antes que la identidad, la
> identidad antes que el acceso—; la estabilización no se parte en absoluto, porque es integrar y
> probar lo de todos; y el paralelismo cobra su parte en revisiones cruzadas, acuerdos de contrato
> y reuniones que trabajando de una en una no existían. **Una cuarta a la vez ya casi no suma.**

---

## 6. Reglas de convivencia

Siete reglas, y cada una evita un choque concreto que si no ocurrirá.

### 6.1 Migraciones

- **Se nombran por marca de tiempo**, como ya hace `supabase/migrations/`. Dos tareas a la vez no pueden
  chocar de número.
- **Nunca se edita una aplicada.** Si estaba mal, se escribe otra que corrige. Es el mismo
  principio del contra-asiento de [CU-04](02-casos-de-uso.md#cu-04) y de [ADR-004](adr/ADR-004-base-solo-escritura.md).
- **Dos tareas a la vez no alteran la misma tabla en el mismo sprint.** El reparto de tablas del [§4.3](#43-fase-2--rebanadas-verticales-sprints-3-a-8)
  está hecho para que no haga falta; cuando haga falta, se habla antes de escribir.
- **Se publican antes que la API que las necesita, y compatibles con la API que ya corre.** Viven
  en `prisma_db`, así que una columna nueva y el código que la usa son dos commits: primero se
  agrega, y lo viejo se quita en una versión posterior, cuando ya ninguna API desplegada lo use
  ([ADR-025](adr/ADR-025-cuatro-repositorios.md)).
- Las revisa quien trabaja el trabajo de la API, aunque las proponga otro.

### 6.2 El mockup

Es **un solo archivo HTML de más de 4.700 líneas**, y eso lo vuelve el punto de conflicto más
probable de todo el proyecto: dos tareas a la vez editándolo a la vez producen un conflicto que git no
sabe resolver solo.

- **Una pantalla, una tarea, a la vez.** Se avisa antes de abrirlo.
- Los cambios se fusionan el mismo día. Una rama de mockup abierta una semana es un conflicto
  garantizado.
- **Cuando una pantalla ya está construida en Flutter, el mockup deja de ser el sitio donde se
  cambia.** La regla de oro sigue intacta —nada se construye sin mockup aprobado— pero se aplica
  **antes** de construir, no después. Después manda la implementación, y el mockup queda como
  registro de lo que se aprobó.

### 6.3 El contrato

- Cambiarlo es siempre un PR en `Finanzas-PRISMA`, revisado por los dos lados. **Cada
  funcionalidad tiene su tarea de contrato en el plan**, y las demás tareas de esa funcionalidad
  dependen de ella.
- Un cambio que rompe el contrato sube la versión **mayor** y obliga a la comprobación de
  compatibilidad de [RF-101](03-requisitos-y-bdd.md#rf-101). No se hacen a la ligera.
- Mientras el cambio no esté etiquetado, **no se implementa en ninguno de los dos lados**. Es lo
  que evita que dos tareas a la vez construyan contra ideas distintas de lo mismo.

### 6.4 Ambientes

- **Cada tarea desarrolla contra su propio PostgreSQL**, levantado con Docker (`reset-local.ps1` de
  `prisma_db`). Nadie desarrolla contra una base compartida: una prueba que falla por lo que otro
  guardó hace diez minutos se termina ignorando, y con ella se ignoran las de verdad.
- **Docker ya arranca**, así que la excepción que mandaba a cada frente a su propio proyecto gratuito
  de Supabase se acabó: no quedan proyectos gratuitos que repartir —dev y qa gastaron los dos
  ([§7.1](../TODO.md#71-el-expediente-de-uat-y-prod) del tablero)— y desarrollar contra la nube era desarrollar contra un ambiente. **Cada
  tarea que toque la base levanta su propio Supabase local**, con otro `project_id` y otros puertos
  en una copia de `supabase/config.toml` que no se versiona. Sin eso, API y Base comparten el
  `54321` y el `54322`, y el `reset` de uno rompe las pruebas del otro a mitad de camino —y de paso
  la API de integración contra la que trabaja el Front—.
- **dev, qa, uat y prod siguen siendo los cuatro de siempre**, y solo dev y prod se despliegan: qa y
  uat son etapas de la tubería ([ADR-044](adr/ADR-044-dos-ambientes-desplegados.md)). No hay un ambiente por tarea.
- **La puerta es `develop` con la integración continua en verde** hasta el [Sprint 9](08-plan-de-desarrollo.md#sprint-9), y **la etapa qa** desde
  entonces. Lo de todas las tareas tiene que estar verde junto antes de promover.

### 6.5 Ramas e integración

**La rama base es `develop`.** De ahí sale y ahí vuelve todo el trabajo de los tres repositorios de
código; `main` es la rama de publicación y solo recibe lo que se publica, desde `develop`. **Este
repositorio, el de la especificación, no tiene `develop`:** su base es `main`, porque lo que se
integra aquí son documentos y el contrato, no código que se despliegue.

El ciclo de una tarea, entero:

| # | Paso | Qué es exactamente |
|---|---|---|
| 1 | Traer la base, en una copia limpia | `git status` sin nada pendiente, y después `git switch develop && git pull --ff-only`. Se arranca desde lo último integrado, no desde lo que había ayer, y **el árbol sucio no se arrastra**: lo que hay sin commitear se enseña y se pregunta, porque suele ser de otra cosa ([ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md)) |
| 2 | Abrir la rama | `git switch -c feature/2.19`, con **el id de la tarea del plan** en el nombre: `feature/1.10`, `feature/0.11`. Es el mismo número que llevan el asunto del commit ([ADR-028](adr/ADR-028-un-commit-por-tarea.md)) y la fila del tablero, así que una rama abierta dice sola qué tarea es y contra qué fila se revisa. Lo que no es una tarea lleva el título de lo que agrega, en minúsculas y con guiones: `feature/reglas-en-un-solo-sitio`. **Toda rama empieza por `feature/`, sin excepción**, también en una sesión que trae otra asignada ([ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md)) |
| 3 | El trabajo, con su commit | Una tarea es un commit ([ADR-028](adr/ADR-028-un-commit-por-tarea.md)). La rama puede llevar más de uno si hace falta, pero la tarea no se parte en dos. El mensaje **no tiene tope de longitud** ([ADR-036](adr/ADR-036-sin-limite-en-el-commit.md)): tres líneas de cuerpo, y el porqué largo en el plan |
| 4 | **La documentación y la versión al día** | Antes de avisar que la rama está lista: subir la versión de cada `.md` tocado, poner la fecha, correr `enlazar` y luego `verificar` ([§6.7](#67-la-documentación)). Y si la tarea cambia lo que se publica, **subir un paso la versión del proyecto** —o publicar la del esquema, si agrega una migración— ([ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md)). Un PR con cualquiera de las dos desfasada lo rechaza la integración continua igual, y descubrirlo ahí es descubrirlo tarde |
| 5 | Avisar que está lista | La rama ya está empujada desde su primer commit —la regla de abajo—, así que aquí solo se dice que está lista y contra qué base se abriría. **El PR no se abre por cuenta propia, ni en borrador: se abre cuando quien dirige lo autoriza** ([ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md)). Empujar respalda; abrir el PR pide el turno de una persona. La base todavía no se trae |
| 6 | **Con el PR autorizado: traer la base, dejar la rama sin conflictos y abrirlo** | Solo ahora se fusiona la base en la rama: entre el paso 1 y aquí pudieron entrar otros PR. Se resuelve lo que choque y **se comprueba que la fusión de vuelta daría limpia**, volviendo a pasar las puertas del [08 §4](08-plan-de-desarrollo.md#4-definición-de-terminado) con la base adentro: hay conflictos que git no ve, como dos ramas que suben la versión al mismo número. Después se abre el PR contra la base ([ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md)). La receta es la skill `pr` |
| 7 | **Esperar a que lo acepten** | Una vez abierto, no se empieza otra tarea hasta que el PR esté aceptado. Si la base se mueve mientras espera, se repite el paso 6 |

**La espera del paso 7 tiene una excepción, y solo una: que la siguiente tarea sea paralelizable.**
Lo es cuando el tablero la marca ⚡ —todo lo que necesita ya está hecho—, no depende de lo que está
en revisión y no toca los mismos archivos. Entonces su rama sale de `develop` sin esperar. En
cualquier otro caso, empezar antes es construir sobre algo que la revisión todavía puede cambiar, y
rehacerlo cuesta más de lo que ahorró no esperar.

**Y la marca ⚡ se lee por mitades.** Una tarea de dos tareas a la vez —«API, Front»— se marca cuando están
hechas las dos mitades de todo lo que necesita, y eso hace esperar a la mitad API por una mitad Front
que va detrás por diseño y que no usa. Así que **la mitad de un repositorio puede empezar en cuanto están
fusionadas las mitades de su propio repositorio —y las tareas de un solo repositorio— de todo lo que necesita**,
aunque el tablero todavía no marque la tarea. La tarea se marca hecha cuando aterrizan sus dos
mitades, no antes. Lo demás del paso 7 no cambia: se espera igual a que acepten el PR.

- **La rama se empuja siempre**, en cuanto tiene su primer commit y sin esperar a que alguien lo
  pida, también cuando el commit no es una tarea del plan —documentación, herramientas, un arreglo
  suelto—: `git push -u origin feature/2.19`. Lo que solo vive en una máquina no está respaldado,
  nadie más lo puede mirar y no hay desde dónde abrir el PR. **Empujar no adelanta ninguna puerta:**
  la documentación al día sigue siendo condición para avisar que está lista, no para empujar. Y se
  empuja la rama de trabajo y nada más: `develop`, `main` y las ramas de ambiente no se mueven por
  cuenta propia.
- **Ramas cortas.** Una rama que vive más de dos o tres días deja de ser una rama y empieza a ser
  otra versión del producto.
- **Dos tareas a la vez en el mismo repositorio nunca comparten copia de trabajo:** cada uno en su rama y,
  si están en la misma máquina, en su propio `git worktree`.
- Se integra a `develop` al menos una vez al día por tarea. El paralelismo se paga integrando
  seguido, no integrando al final.
- **Y las cuatro ramas principales las protege GitHub, no la costumbre** ([ADR-048](adr/ADR-048-las-ramas-principales-las-protege-github.md), [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)): `develop`, `qa`,
  `uat` y `main` no se pueden borrar, y a ninguna se entra sin PR. A `develop` con la
  tubería terminada, aunque haya terminado mal; a las otras tres, con la tubería en verde. La
  definición y lo que todavía falta para poder aplicarla están en `scripts/github/README.md`.

### 6.6 El ritual mínimo

Con varias tareas a la vez hace falta coordinación, y conviene que sea **la mínima y siempre la misma**:

| Cuándo | Qué | Cuánto |
|---|---|---|
| Diario | Quien trabaja cada parte mira en [`TODO.md`](../TODO.md) qué puede empezar hoy | 10 minutos |
| Lunes | **Acuerdo de contrato**: qué cambia esta semana en `openapi.json` | 30 minutos, todos |
| Viernes | **Integración en `develop`** —y en qa desde el [Sprint 9](08-plan-de-desarrollo.md#sprint-9)— y revisión de lo que quedó verde | 30 minutos, todos |
| Fin de sprint | Aprobación de Gerencia | Según el plan |

Una hora a la semana de coordinación obligatoria. Si hace falta más, es señal de que la frontera
entre los repositorios no está donde debería.

### 6.7 La documentación

Los documentos se comparten entre todos, así que siguen las reglas de
[`22-documentacion.md`](22-documentacion.md): cada cambio sube su versión, un documento por PR cuando se pueda, y un
conflicto en un bloque generado no se resuelve a mano sino volviendo a correr la herramienta.

---

## 7. Riesgos propios de trabajar en paralelo

| # | Riesgo | Cómo se ataja |
|---|---|---|
| 1 | El contrato se acuerda tarde y el trabajo del front queda bloqueado | Cada funcionalidad tiene su tarea de contrato, y es de las primeras de su sprint. Si algo se retrasa, no puede ser esto |
| 2 | Dos tareas editan el mockup a la vez | Regla [§6.2](#62-el-mockup): una pantalla, una tarea, fusionar el mismo día |
| 3 | La arquitectura termina copiando la forma del reparto | Las rebanadas del [§4.3](#43-fase-2--rebanadas-verticales-sprints-3-a-8) son de negocio, no de tecnología. Revisar en cada sprint que ninguna frontera nueva coincida con la frontera entre repositorios sin razón |
| 4 | Cada tarea escribe su versión de lo mismo: formatear dinero, manejar errores | Todo lo compartido del front vive en los widgets de la tarea [0.19](08-plan-de-desarrollo.md#tarea-0-19); todo lo compartido de la API, en `dominio` |
| 5 | Ramas largas que chocan al final | [§6.5](#65-ramas-e-integración): integrar a diario |
| 6 | Una parte termina y espera | [`TODO.md`](../TODO.md) dice qué puede empezar hoy en cada repositorio; Nómina es el amortiguador ([§4.3](#43-fase-2--rebanadas-verticales-sprints-3-a-8)), y el trabajo de accesibilidad y de pruebas de widget nunca se acaba |
| 7 | Se relaja el principio 9 «para ir más rápido» y el front empieza a decidir | Es el que sostiene la frontera. Revisarlo explícitamente en cada revisión de código del front |
| 8 | El calendario calculado se toma como una fecha prometida | Es el calendario del trabajo descrito, sin vacaciones ni imprevistos ([08 §1.1](08-plan-de-desarrollo.md#11-cuánto-dura-con-1-2-o-3-carriles-activos)). Se comunica como estimación, y se recalcula solo cuando cambia una tarea |

> **El riesgo 7 es el que hay que vigilar de verdad**, porque llega disfrazado de sensatez: «esta
> validación es trivial, la hago aquí y nos ahorramos un viaje». Cada vez que ocurre, la frontera
> entre los repositorios se corre un poco, y el día que hay que cambiar esa regla nadie sabe en cuántos
> sitios vive.

---

## 8. Qué hay que decidir antes de trabajar dos tareas a la vez

1. **Quién trabaja cada repositorio** —personas, equipos o sesiones—, y quién sabe Flutter y Java a la
   vez: esa persona es la que debe revisar los cambios de contrato.
2. **Dónde se alojan los cuatro repositorios** y quién tiene permiso de escritura en cada uno.
   Lo primero ya está decidido: en GitHub ([ADR-026](adr/ADR-026-railway-al-final.md)). Los permisos se reparten cuando haya con
   quién repartirlos.
3. **Si el contrato se publica como paquete** (artefacto en un repositorio Maven —que es el
   formato, lo publique Gradle o quien sea— y paquete de Dart) o se consume por etiqueta de git.
   **Decidido: por etiqueta**, `contrato-vX.Y.Z` en cada fusión que cambie `openapi.json` ([TODO §7](../TODO.md#7-decisiones-pendientes),
   fila 8). El paquete pedía un registro y unas credenciales que no existen, para resolver unas
   dependencias que nadie tiene.
4. **Quién aprueba un cambio de contrato** cuando los dos lados no se ponen de acuerdo. **Decidido:
   quien dirige**, que además es quien revisa los PR (fila 9).

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [20](20-contrato-de-api.md "20 · Contrato de la API") · [22](22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [Contrato](../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-023](adr/ADR-023-tres-repositorios.md "ADR-023 · Tres repositorios y el contrato como artefacto versionado") · [ADR-025](adr/ADR-025-cuatro-repositorios.md "ADR-025 · Cuatro repositorios: la base de datos sale de la API") · [ADR-026](adr/ADR-026-railway-al-final.md "ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo") · [ADR-027](adr/ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [ADR-028](adr/ADR-028-un-commit-por-tarea.md "ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué") · [ADR-029](adr/ADR-029-esquema-por-etiqueta.md "ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase") · [ADR-031](adr/ADR-031-commit-de-256-caracteres.md "ADR-031 · El mensaje de commit cabe en 256 caracteres") · [ADR-032](adr/ADR-032-railway-en-dev-ahora.md "ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final") · [ADR-035](adr/ADR-035-repositorios-hermanos.md "ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo") · [ADR-037](adr/ADR-037-el-pr-se-abre-a-pedido.md "ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos") · [ADR-038](adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md "ADR-038 · La pila local se orquesta desde prisma_db, y cada receta se apunta desde su .env") · [ADR-039](adr/ADR-039-cada-regla-en-un-solo-sitio.md "ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill") · [ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md "ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base") · [ADR-043](adr/ADR-043-dependencias-solo-hacia-atras.md "ADR-043 · Una tarea solo depende de tareas anteriores") · [ADR-048](adr/ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-067](adr/ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive") · [CLAUDE](../CLAUDE.md "CLAUDE.md") · [README](../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [20 · Contrato de la API](20-contrato-de-api.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [22 · Documentación](22-documentacion.md)
