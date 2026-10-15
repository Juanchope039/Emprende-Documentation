# Índice navegable de la documentación

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.23.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/INDICE.md "Historial de cambios") | [🔄 Vivo](22-documentacion.md#estados) | 2026-09-15 | 2026-10-14 | — |

> Guía para moverte por toda la documentación de PRISMA **sin perderte y sin saber de programación**.
> Cada documento dice para qué sirve, en lenguaje sencillo, y está marcado si es técnico.

**Cómo leer este índice**

- 📗 **Para todos** — lo entiende cualquier persona del negocio.
- 📘 **Mixto** — empieza sencillo pero tiene partes técnicas; se puede leer por encima.
- 🔧 **Técnico** — pensado para quien va a programar. Si no es tu caso, puedes saltarlo.

---

## 1. ¿Por dónde empiezo? (según quién eres)

| Si eres… | Lee en este orden |
|----------|-------------------|
| 🧑‍💼 **Dueña o gerente del negocio** | [Resumen ejecutivo](00-resumen-ejecutivo.md) → abre el [mockup](../mockup/prisma-mockup.html) → [Reglas financieras](05-reglas-financieras.md) |
| 👷 **Trabajas en el negocio (Operación)** | [Resumen ejecutivo](00-resumen-ejecutivo.md) → abre el [mockup](../mockup/prisma-mockup.html) |
| 🧾 **Eres el contador** | [Reglas financieras](05-reglas-financieras.md) → [Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md) → [Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md) |
| 💻 **Vas a programar** | [Visión y alcance](01-vision-y-alcance.md) → [Casos de uso](02-casos-de-uso.md) → [Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md) → [Requisitos y BDD](03-requisitos-y-bdd.md) → [Modelo de datos](04-modelo-de-datos.md) → [Arquitectura](07-arquitectura.md) → [Contrato de API](20-contrato-de-api.md) |
| 📚 **Solo quieres entender una palabra** | [Glosario](15-glosario.md) |

---

## 2. Encuentra lo que buscas (por pregunta)

| Si te preguntas… | Ve a… |
|------------------|-------|
| ¿Qué es PRISMA y qué problema resuelve? | 📗 [Resumen ejecutivo](00-resumen-ejecutivo.md) |
| ¿Cómo se ve el sistema por dentro? | 📗 [Mockup interactivo](../mockup/prisma-mockup.html) |
| ¿Cuánto gané de verdad este mes? | 📗 [Reglas financieras](05-reglas-financieras.md) |
| ¿Cuánto le puedo pagar a una empleada sin quebrar? | 📗 [Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md) |
| ¿Quién puede hacer qué dentro del sistema? | 📘 [Visión y alcance](01-vision-y-alcance.md) |
| ¿Qué cosas se pueden hacer, paso a paso? | 📘 [Casos de uso](02-casos-de-uso.md) |
| ¿Me lo puedes dibujar? | 📘 [Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md) |
| ¿Está mi información segura y protegida? | 📘 [Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md) |
| ¿Qué pasa si se daña el computador? (respaldos) | 📘 [Respaldo y exportación](13-respaldo-y-exportacion.md) |
| ¿Cuándo va a estar listo y cómo lo empezamos a usar? | 📘 [Plan de desarrollo](08-plan-de-desarrollo.md) · [Plan de implantación](09-plan-de-implantacion.md) |
| ¿Qué está hecho y qué falta? | 📘 [Tareas](../TODO.md) |
| ¿Este documento está al día? ¿Qué versión es? | 📗 [Estado de la documentación](#5-estado-de-la-documentación) |
| ¿Qué viene después de la primera versión? | 📗 [Roadmap e ideas](14-roadmap-e-ideas.md) |
| No entiendo una palabra del proyecto | 📗 [Glosario](15-glosario.md) |

---

## 3. Todos los documentos, explicados

| # | Documento | ¿De qué trata, en cristiano? | Tipo |
|---|-----------|------------------------------|------|
| 00 | [Resumen ejecutivo](00-resumen-ejecutivo.md) | La versión de 5 minutos de todo el proyecto. **Empieza aquí.** | 📗 |
| 01 | [Visión y alcance](01-vision-y-alcance.md) | Para qué existe, quién lo usa, qué SÍ hace y qué NO hace. | 📘 |
| 02 | [Casos de uso](02-casos-de-uso.md) | Todo lo que se puede hacer, contado como pasos. | 📘 |
| 03 | [Requisitos y BDD](03-requisitos-y-bdd.md) | La lista formal de requisitos y cómo se comprueba cada uno. | 🔧 |
| 04 | [Modelo de datos](04-modelo-de-datos.md) | Cómo se guarda la información por dentro. | 🔧 |
| 05 | [Reglas financieras](05-reglas-financieras.md) | Las fórmulas exactas del dinero. **El corazón del sistema.** | 📗 |
| 06 | [Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md) | Cuánto se puede pagar y cómo se liquida un sueldo. | 📗 |
| 07 | [Arquitectura](07-arquitectura.md) | Cómo está construido el sistema por dentro. | 🔧 |
| 08 | [Plan de desarrollo](08-plan-de-desarrollo.md) | En cuánto tiempo se hace y en qué orden. | 📘 |
| 09 | [Plan de implantación](09-plan-de-implantacion.md) | Cómo se pone en marcha y se capacita a la gente. | 📘 |
| 10 | [UX y mockups](10-ux-y-mockups.md) | Cómo se ven y se navegan las pantallas. | 📘 |
| 11 | [Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md) | Qué puede salir mal y cómo se protegen los datos (Ley 1581). | 📘 |
| 12 | [Pruebas y calidad](12-pruebas-y-calidad.md) | Cómo se comprueba que todo funciona bien. | 🔧 |
| 13 | [Respaldo y exportación](13-respaldo-y-exportacion.md) | Cómo se sacan copias de seguridad de la información. | 🔧 |
| 14 | [Roadmap e ideas](14-roadmap-e-ideas.md) | Ideas para más adelante, después de la primera versión. | 📗 |
| 15 | [Glosario](15-glosario.md) | El diccionario del proyecto: cada palabra explicada. | 📗 |
| 16 | [Base de datos: snapshots y datos de prueba](16-base-de-datos-y-snapshots.md) | Cómo se recrea la base en cualquier computador y cómo se cargan datos de ejemplo. | 🔧 |
| 17 | [Resiliencia, offline y caché](17-resiliencia-offline-y-cache.md) | Cómo el sistema seguirá funcionando cuando se cae el internet y cómo se limpia lo guardado. | 📘 |
| 18 | [Distribución y pipelines](18-distribucion-y-pipelines.md) | La idea de ofrecer el sistema en web, celular y computador, y de automatizar las pruebas. | 📘 |
| 19 | [Ambientes, versionado y entrega](19-ambientes-y-entrega.md) | Los cuatro ambientes, cómo sube un cambio hasta el taller y cómo se devuelve si sale mal. | 🔧 |
| 20 | [Contrato de API](20-contrato-de-api.md) | Cómo le habla el front a la API: qué responde siempre, cómo se evita cobrar dos veces lo mismo y cómo se protege el camino. | 🔧 |
| 21 | [Trabajo en paralelo](21-trabajo-en-paralelo.md) | Cómo avanzan varios carriles de trabajo a la vez —personas, equipos o sesiones— y qué reglas impiden que se pisen. | 🔧 |
| 22 | [Documentación: versiones, estados y referencias](22-documentacion.md) | Cómo se lleva la documentación: qué dice el encabezado de cada documento, cuándo sube su versión y cómo se enlazan las referencias. | 📘 |
| 23 | [Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md) | Los 37 casos de uso dibujados dos veces: uno para quien dirige el negocio y uno para quien programa. | 📘 |
| — | [Decisiones de arquitectura (ADRs)](adr/) | Por qué se tomó cada decisión técnica importante. | 🔧 |

---

## 4. Las decisiones de arquitectura (ADRs)

Son notas cortas que explican **por qué** se decidió algo. Son técnicas, pero cada una responde
a una pregunta concreta. Ver el [índice de ADRs](adr/README.md).

| # | Decisión | Responde a… |
|---|----------|-------------|
| [001](adr/ADR-001-stack.md) | Con qué herramientas se construía antes · **Reemplazado por 011** | ¿Qué tecnología usamos? |
| [002](adr/ADR-002-arquitectura-hexagonal.md) | Cómo se organiza el código | ¿Cómo lo hacemos mantenible? |
| [003](adr/ADR-003-dinero-entero.md) | Dinero en pesos enteros, sin centavos | ¿Cómo evitamos errores de redondeo? |
| [004](adr/ADR-004-base-solo-escritura.md) | La base de datos nunca borra | ¿Cómo garantizamos que no se pierda historia? |
| [005](adr/ADR-005-auditoria-por-triggers.md) | Todo movimiento queda registrado | ¿Cómo sabemos quién hizo qué? |
| [006](adr/ADR-006-rls-por-rol.md) | Los permisos viven en la base de datos | ¿Cómo aseguramos quién ve qué? |
| [007](adr/ADR-007-pwa.md) | Funciona como app sin tienda de apps · **Reemplazado por 016** | ¿Cómo se instala y se usa? |
| [008](adr/ADR-008-exportacion.md) | Cómo se exporta la información | ¿Cómo sacamos los datos cuando haga falta? |
| [009](adr/ADR-009-login-por-usuario.md) | Cada persona entra con su propio usuario | ¿Cómo distinguimos quién es quién? |
| [010](adr/ADR-010-almacenamiento-contrasenas.md) | Contraseñas guardadas con "sal" por usuario | ¿Cómo evitamos que dos claves iguales se vean iguales? |
| [011](adr/ADR-011-stack-flutter-dart.md) | Con qué herramientas se construye: Flutter y Dart, con API propia · **Reemplazado por 017** | ¿Qué tecnología usamos? |
| [012](adr/ADR-012-identidad-a-postgres.md) | La API le dice a la base quién está pidiendo | ¿Los permisos siguen decidiéndose en la base? |
| [013](adr/ADR-013-cuatro-ambientes.md) | Cuatro copias del sistema: desarrollo, pruebas, aprobación y el de verdad | ¿Dónde se prueba antes de tocar lo real? |
| [014](adr/ADR-014-semver.md) | Cada parte lleva su propio número de versión | ¿Cómo sabemos qué versión está corriendo? |
| [015](adr/ADR-015-validacion-tres-capas.md) | Se valida tres veces y la base es la que manda · **Reemplazado por 018** | ¿Por qué se repite la misma regla? |
| [016](adr/ADR-016-flutter-web-pwa.md) | Funciona como app sin tienda de apps, con Flutter Web | ¿Cómo se instala y se usa? |
| [017](adr/ADR-017-api-en-java.md) | El front sigue en Flutter y la API pasa a Java con Spring Boot · **Reemplazado por 024** | ¿En qué está hecha cada parte? |
| [018](adr/ADR-018-front-sin-decisiones.md) | Tres partes, y la pantalla no decide nada por su cuenta | ¿Quién manda cuando hay una regla? |
| [019](adr/ADR-019-contrato-de-respuesta.md) | La API responde siempre con la misma forma y un código de cinco dígitos | ¿Cómo sé qué me contestó el sistema? |
| [020](adr/ADR-020-idempotencia.md) | Tocar Guardar dos veces no cobra dos veces | ¿Y si se me va la señal a mitad? |
| [021](adr/ADR-021-canal-firmado.md) | Cada petición va sellada contra reenvíos y cambios en el camino | ¿Alguien puede copiar una petición y repetirla? |
| [022](adr/ADR-022-openapi-generado.md) | La documentación de la API sale del código, no de la memoria de nadie | ¿Cómo sé que el manual dice la verdad? |
| [023](adr/ADR-023-tres-repositorios.md) | El código vive en tres repositorios, y el contrato es un artefacto con versión propia · **Reemplazado por 025** | ¿Dónde vive cada parte y cómo no se desincronizan? |
| [024](adr/ADR-024-java-25-y-gradle.md) | La API se construye con Gradle, sobre Java 25 y Spring Boot 4 | ¿Con qué se compila y hasta cuándo tiene soporte? |
| [025](adr/ADR-025-cuatro-repositorios.md) | La base de datos tiene su propio repositorio · **dónde vive cada uno en disco lo cambia el 035** | ¿Dónde vive cada parte, y qué se pierde al separar la base? |
| [026](adr/ADR-026-railway-al-final.md) | El código vive en GitHub y el sistema se publica en Railway, al final del desarrollo · **Reemplazado por 032** | ¿Dónde se publica el sistema, y desde cuándo? |
| [027](adr/ADR-027-documentacion-versionada.md) | Cada documento lleva versión, estado y fechas, y toda referencia es un enlace que la CI verifica | ¿Cómo sé si un documento cambió y qué versión estoy leyendo? |
| [028](adr/ADR-028-un-commit-por-tarea.md) | Cada tarea hecha es un commit, y el commit explica por qué | ¿Cómo sé qué se hizo en cada cambio y por qué se decidió así? |
| [029](adr/ADR-029-esquema-por-etiqueta.md) | El esquema de la base llega a la API por etiqueta, y la CI lo levanta con Supabase | ¿Contra qué versión de la base se probó la API? |
| [030](adr/ADR-030-contrato-sin-get.md) | Ninguna operación de la API usa GET: toda lectura viaja por POST bajo `/api/v0` | ¿Por qué el contrato no se parece a lo que esperaría de una API? |
| [031](adr/ADR-031-commit-de-256-caracteres.md) | Cada commit cuenta su porqué en 256 caracteres · **Reemplazado por 036** | ¿Dónde queda escrito por qué se hizo cada cambio? |
| [032](adr/ADR-032-railway-en-dev-ahora.md) | El ambiente dev se aloja en Railway desde ya; qa, uat y prod, al final del desarrollo | ¿Puedo ver el sistema funcionando en línea hoy? |
| [033](adr/ADR-033-service-role-solo-en-auth.md) | La llave maestra de Supabase solo se usa para dar de alta a una persona | ¿Quién puede saltarse los permisos de la base? |
| [034](adr/ADR-034-la-version-sube-en-cada-pr.md) | Cada cambio que se publica sube la versión un paso, y la CI lo exige | ¿Cómo sé que «Acerca de» dice la versión que de verdad corre? |
| [035](adr/ADR-035-repositorios-hermanos.md) | Los cuatro repositorios viven lado a lado, y cada uno trae sus reglas y su guía para los agentes | ¿Dónde vive cada parte en disco, y qué lee un agente antes de tocarla? |
| [036](adr/ADR-036-sin-limite-en-el-commit.md) | El mensaje de un commit puede ser tan largo como haga falta | ¿Cuánto puedo escribir para explicar un cambio? |
| [037](adr/ADR-037-el-pr-se-abre-a-pedido.md) | Cada tarea arranca de una copia limpia y al día, y la solicitud de revisión la pide quien dirige, con la rama ya sin choques · **Reemplazado por 040** | ¿Quién decide cuándo se revisa un cambio, y por qué llega sin pelearse con lo que ya estaba? |
| [038](adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md) | Un solo comando levanta el sistema entero en la máquina de quien trabaja, y cada quien le dice dónde tiene sus carpetas | ¿Cómo pruebo todo junto sin armarlo a mano cada vez? |
| [039](adr/ADR-039-cada-regla-en-un-solo-sitio.md) | Cada regla del proyecto está escrita en un solo lugar, y los demás la señalan sin copiarla | ¿Dónde busco una regla, y cómo sé que no hay otra versión en otro lado? |
| [040](adr/ADR-040-rama-feature-y-pr-autorizado.md) | Cada cambio va en una rama que dice qué trae, y la revisión solo se pide cuando quien dirige la autoriza: ahí se pone al día con lo último | ¿Quién decide cuándo se revisa un cambio, y cuándo se pone al día con lo que ya estaba? |
| [041](adr/ADR-041-cuatro-lineas-por-parrafo.md) | Cada párrafo que explica algo en el código o en un cambio cabe en cuatro líneas, salvo que quien dirige autorice más | ¿Cuánto se puede escribir para explicar un cambio o un pedazo de código? |
| [042](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md) | La página técnica de la API muestra la misma versión que «Acerca de»: la del programa que está corriendo. La del acuerdo con el front sigue anotada al lado | ¿Por qué la página técnica de la API mostraba un número distinto al de «Acerca de»? |
| [043](adr/ADR-043-dependencias-solo-hacia-atras.md) | Ninguna tarea del plan espera a otra que esté más abajo en la lista, y una herramienta lo comprueba en cada cambio | ¿Puedo confiar en que el orden del plan es el orden en que se puede trabajar? |
| [044](adr/ADR-044-dos-ambientes-desplegados.md) | Solo hay dos copias del sistema en línea: la de pruebas y la del taller. Las revisiones intermedias las hace la tubería antes de publicar, sin pagar por más servidores | ¿Dónde se prueba una versión antes de que llegue al taller, y cuánto cuesta? |
| [045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md) | La copia en línea donde Gerencia aprueba se llama pre-prod y no tiene datos reales. El taller trabaja en prod, que vive en otro repositorio y recibe cada versión aprobada | ¿Dónde aprueba Gerencia, y dónde trabaja el taller? |
| [046](adr/ADR-046-pre-prod-se-construye-desde-su-rama.md) | La copia donde aprueba Gerencia se arma igual que la de pruebas: desde su propia rama, cada vez que se le pasa una versión aprobada en uat | ¿Cómo llega una versión a la copia donde aprueba Gerencia? |
| [047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) | Bajar una copia completa y verificable de todo, y ver quién entró y quién cambió qué, se construyen antes de arrancar y no después. Estaban diseñados y nadie los había puesto en el calendario | ¿Cuándo podremos llevarnos nuestra información, y revisar quién hizo qué? |
| [048](adr/ADR-048-las-ramas-principales-las-protege-github.md) | Las cinco ramas de las que vive el producto no se pueden borrar, y para entrar en ellas hay que pasar por la revisión automática: en la del día a día basta con que haya corrido, y en las que se publican tiene que estar en verde | ¿Quién cuida que nadie borre o rompa lo que ya funciona? |
| [049](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md) | El catálogo técnico de la aplicación, que solo ve el equipo, se abre con su propia clave; y si nadie la configuró, con la clave inicial de Gerencia, en vez de quedar cerrado sin remedio | ¿Con qué clave entra el equipo técnico a ver el catálogo de la aplicación? |
| [050](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) | Lo que Gerencia aprueba en su copia pasa al final a la rama principal del proyecto, con la misma revisión automática, para que lo que cualquiera ve primero sea lo último aprobado | ¿Dónde queda guardado lo último que aprobó Gerencia? |
| [051](adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md) | Los repositorios del proyecto se quedan como están: el de la documentación a la vista de cualquiera, y los tres del programa cerrados, porque abrir uno no se puede deshacer | ¿Quién puede abrir al público el código del proyecto? |
| [052](adr/ADR-052-la-entrega-del-release-a-prod.md) | Entregarle una versión al taller es un acto que alguien ejecuta a mano, después de que Gerencia la aprueba. Llega a un repositorio propio del taller, con el programa ya armado —no se vuelve a armar— y con el código, y desde ahí su propia automatización la publica | ¿Cómo llega al taller la versión que Gerencia aprobó? |
| [053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) | Se quita una de las copias del programa: la que Gerencia abría para aprobar pasa a ser la misma donde se corren todas las pruebas, con lo que hay una copia menos que mantener y un paso menos en cada entrega | ¿En qué copia del programa aprueba Gerencia? |
| [054](adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md) | Cada versión aprobada se entrega una sola vez a un repositorio de producto. Cada emprendimiento tiene su propia copia, la instala en su propia infraestructura y decide cuándo actualizarla; lo que ajusta va en su configuración y en una carpeta propia, para que las versiones nuevas le entren sin choques | ¿Cómo llega una versión a cada emprendimiento que usa PRISMA? |
| [057](adr/ADR-057-la-atribucion-va-una-vez-y-sin-la-sesion.md) | Lo que un asistente automático publica en GitHub lleva su firma una sola vez, y no deja a la vista el enlace privado de la conversación que lo produjo | ¿Por qué un cambio hecho por un asistente no repite su firma ni enlaza a su conversación? |
| [058](adr/ADR-058-el-monorepo-no-va-adelante-de-develop.md) | La copia del programa que reciben los emprendimientos solo puede llevar lo que ya pasó por las pruebas del día a día. Una revisión automática lo comprueba antes de cada cambio | ¿Puede la copia que reciben los emprendimientos tener algo que no se probó? |

Del 017 al 026 están las decisiones del modelo de tres partes: el cambio de Dart a Java en la
API, que el front no decide nada, el contrato de respuesta, la idempotencia, el canal firmado,
la documentación generada del código, Java 25, el reparto en cuatro repositorios y dónde se
despliega. Del 027 al 030 son de cómo se trabaja: la propia documentación, el commit por tarea, la etiqueta
del esquema y el contrato sin GET. El 032 vuelve sobre el 026 y adelanta un solo ambiente, dev, para
que el sistema se pueda ver en línea antes del final. El 031, el 034 y el 035 vuelven a cómo se
trabaja: el tamaño del commit, la versión que sube en cada PR y dónde vive cada repositorio, y el 033
limita la única llave que se salta los permisos de la base. Del 039 al 041 ordenan lo que leen y
escriben los agentes: cada regla en un solo sitio, la rama y la revisión que solo pide quien dirige,
y cuánto mide cada párrafo que explica algo. El 042 y el 043 cierran dos huecos de confianza: qué
versión enseña la página técnica de la API, y que el orden del plan sea de verdad el orden en que se
puede trabajar.

---

## 5. Estado de la documentación

La versión, el estado y la última actualización de cada documento, tal como los dice su encabezado.
Qué significa cada estado y cuándo sube una versión está en
[`22-documentacion.md`](22-documentacion.md).

<!-- generado:estado-de-la-documentacion · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
| Documento | Versión | Estado | Actualizado | Etiquetas |
|---|:---:|---|:---:|---|
| [PRISMA — Sistema de Gestión Administrativa y Financiera](../README.md) | 1.9.0 | ✅ Vigente | 2026-10-14 | [Negocio](#etiqueta-negocio) · [Plan](#etiqueta-plan) |
| [Tareas de PRISMA](../TODO.md) | 9.67.0 | 🔄 Vivo | 2026-10-14 | [Plan](#etiqueta-plan) · [Paralelo](#etiqueta-paralelo) |
| [Índice navegable de la documentación](INDICE.md) | 1.23.0 | 🔄 Vivo | 2026-10-14 | — |
| [00 · Resumen ejecutivo](00-resumen-ejecutivo.md) | 1.0.0 | ✅ Vigente | 2026-09-16 | [Negocio](#etiqueta-negocio) · [Finanzas](#etiqueta-finanzas) · [Plan](#etiqueta-plan) |
| [01 · Visión y alcance](01-vision-y-alcance.md) | 2.1.0 | ✅ Vigente | 2026-10-06 | [Negocio](#etiqueta-negocio) · [Requisitos](#etiqueta-requisitos) |
| [02 · Casos de uso](02-casos-de-uso.md) | 2.0.0 | ✅ Vigente | 2026-10-06 | [Requisitos](#etiqueta-requisitos) · [Negocio](#etiqueta-negocio) |
| [03 · Requisitos, reglas de negocio y escenarios BDD](03-requisitos-y-bdd.md) | 4.0.0 | ✅ Vigente | 2026-10-06 | [Requisitos](#etiqueta-requisitos) · [Calidad](#etiqueta-calidad) |
| [04 · Modelo de datos](04-modelo-de-datos.md) | 6.1.0 | ✅ Vigente | 2026-10-08 | [Base de datos](#etiqueta-base-de-datos) · [Arquitectura](#etiqueta-arquitectura) |
| [05 · Reglas financieras y KPIs](05-reglas-financieras.md) | 3.0.0 | ✅ Vigente | 2026-10-06 | [Finanzas](#etiqueta-finanzas) · [Negocio](#etiqueta-negocio) |
| [06 · Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md) | 2.1.0 | ✅ Vigente | 2026-10-06 | [Nómina](#etiqueta-nomina) · [Finanzas](#etiqueta-finanzas) · [Negocio](#etiqueta-negocio) |
| [07 · Arquitectura técnica](07-arquitectura.md) | 6.0.0 | ✅ Vigente | 2026-10-04 | [Arquitectura](#etiqueta-arquitectura) · [API](#etiqueta-api) · [Front](#etiqueta-front) · [Base de datos](#etiqueta-base-de-datos) · [Seguridad](#etiqueta-seguridad) |
| [08 · Plan de desarrollo](08-plan-de-desarrollo.md) | 10.2.0 | ✅ Vigente | 2026-10-13 | [Plan](#etiqueta-plan) · [Paralelo](#etiqueta-paralelo) |
| [09 · Plan de implantación](09-plan-de-implantacion.md) | 7.2.0 | ✅ Vigente | 2026-10-10 | [Plan](#etiqueta-plan) · [Entrega](#etiqueta-entrega) · [Negocio](#etiqueta-negocio) |
| [10 · Diseño de experiencia y mockups](10-ux-y-mockups.md) | 7.1.0 | ✅ Vigente | 2026-10-10 | [UX](#etiqueta-ux) · [Front](#etiqueta-front) |
| [11 · Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md) | 2.1.0 | ✅ Vigente | 2026-10-06 | [Seguridad](#etiqueta-seguridad) · [Datos personales](#etiqueta-datos-personales) · [Negocio](#etiqueta-negocio) |
| [12 · Pruebas y calidad](12-pruebas-y-calidad.md) | 4.2.1 | ✅ Vigente | 2026-10-04 | [Calidad](#etiqueta-calidad) |
| [13 · Respaldo y exportación](13-respaldo-y-exportacion.md) | 2.3.0 | ✅ Vigente | 2026-10-10 | [Base de datos](#etiqueta-base-de-datos) · [Datos personales](#etiqueta-datos-personales) |
| [14 · Roadmap e ideas de valor](14-roadmap-e-ideas.md) | 2.1.0 | 🔄 Vivo | 2026-10-13 | [Negocio](#etiqueta-negocio) · [Plan](#etiqueta-plan) |
| [15 · Glosario](15-glosario.md) | 2.0.0 | ✅ Vigente | 2026-10-06 | [Negocio](#etiqueta-negocio) |
| [16 · Base de datos: snapshots y datos de prueba](16-base-de-datos-y-snapshots.md) | 3.4.0 | ✅ Vigente | 2026-09-23 | [Base de datos](#etiqueta-base-de-datos) · [Calidad](#etiqueta-calidad) |
| [17 · Resiliencia, trabajo sin conexión y caché](17-resiliencia-offline-y-cache.md) | 1.1.0 | ✅ Vigente | 2026-09-22 | [Front](#etiqueta-front) · [API](#etiqueta-api) · [Arquitectura](#etiqueta-arquitectura) |
| [18 · Distribución multiplataforma y automatización (pipelines)](18-distribucion-y-pipelines.md) | 0.1.0 | 💡 Propuesta | 2026-09-16 | [Entrega](#etiqueta-entrega) · [Front](#etiqueta-front) |
| [19 · Ambientes, versionado y entrega](19-ambientes-y-entrega.md) | 11.0.0 | ✅ Vigente | 2026-10-13 | [Entrega](#etiqueta-entrega) · [Proceso](#etiqueta-proceso) |
| [20 · Contrato de la API](20-contrato-de-api.md) | 3.1.0 | ✅ Vigente | 2026-10-14 | [Contrato](#etiqueta-contrato) · [API](#etiqueta-api) · [Front](#etiqueta-front) |
| [21 · Trabajo en paralelo por carriles](21-trabajo-en-paralelo.md) | 6.3.0 | ✅ Vigente | 2026-10-10 | [Paralelo](#etiqueta-paralelo) · [Proceso](#etiqueta-proceso) |
| [22 · Documentación: versiones, estados y referencias](22-documentacion.md) | 2.2.1 | ✅ Vigente | 2026-10-04 | [Proceso](#etiqueta-proceso) |
| [23 · Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md) | 0.4.0 | 🔍 En revisión | 2026-10-06 | [Requisitos](#etiqueta-requisitos) · [Negocio](#etiqueta-negocio) · [Arquitectura](#etiqueta-arquitectura) |
| [Contrato de la API · v0.33.0](../contrato/README.md) | 4.5.0 | ✅ Vigente | 2026-10-10 | [Contrato](#etiqueta-contrato) · [API](#etiqueta-api) · [Front](#etiqueta-front) |
| [Decisiones de arquitectura (ADR)](adr/README.md) | 1.27.0 | 🔄 Vivo | 2026-10-14 | [Arquitectura](#etiqueta-arquitectura) |
| [ADR-001 · Stack tecnológico](adr/ADR-001-stack.md) | 1.0.0 | ⛔ Reemplazado | 2026-09-16 | [Arquitectura](#etiqueta-arquitectura) |
| [ADR-002 · Arquitectura hexagonal con regla de dependencias verificada](adr/ADR-002-arquitectura-hexagonal.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Arquitectura](#etiqueta-arquitectura) · [API](#etiqueta-api) |
| [ADR-003 · Dinero como entero de pesos](adr/ADR-003-dinero-entero.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Finanzas](#etiqueta-finanzas) · [API](#etiqueta-api) · [Base de datos](#etiqueta-base-de-datos) |
| [ADR-004 · Base de datos de solo escritura](adr/ADR-004-base-solo-escritura.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Base de datos](#etiqueta-base-de-datos) |
| [ADR-005 · Auditoría por triggers, no por la aplicación](adr/ADR-005-auditoria-por-triggers.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Base de datos](#etiqueta-base-de-datos) · [Seguridad](#etiqueta-seguridad) |
| [ADR-006 · Permisos con Row Level Security](adr/ADR-006-rls-por-rol.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Seguridad](#etiqueta-seguridad) · [Base de datos](#etiqueta-base-de-datos) |
| [ADR-007 · PWA en lugar de aplicación nativa](adr/ADR-007-pwa.md) | 1.0.0 | ⛔ Reemplazado | 2026-09-16 | [Front](#etiqueta-front) |
| [ADR-008 · Exportación con descarga manual](adr/ADR-008-exportacion.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Base de datos](#etiqueta-base-de-datos) · [Datos personales](#etiqueta-datos-personales) |
| [ADR-009 · Acceso con nombre de usuario, no con correo](adr/ADR-009-login-por-usuario.md) | 1.1.0 | ✅ Aceptado | 2026-09-17 | [Seguridad](#etiqueta-seguridad) · [API](#etiqueta-api) |
| [ADR-010 · Almacenamiento de contraseñas: hashing delegado con salt por usuario](adr/ADR-010-almacenamiento-contrasenas.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Seguridad](#etiqueta-seguridad) |
| [ADR-011 · Stack: Flutter y Dart con API propia](adr/ADR-011-stack-flutter-dart.md) | 1.0.0 | ⛔ Reemplazado | 2026-09-16 | [Arquitectura](#etiqueta-arquitectura) · [Front](#etiqueta-front) · [API](#etiqueta-api) |
| [ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando](adr/ADR-012-identidad-a-postgres.md) | 2.0.0 | ✅ Aceptado | 2026-09-18 | [Seguridad](#etiqueta-seguridad) · [API](#etiqueta-api) · [Base de datos](#etiqueta-base-de-datos) |
| [ADR-013 · Cuatro ambientes y promoción de migraciones](adr/ADR-013-cuatro-ambientes.md) | 1.1.0 | ✅ Aceptado | 2026-10-03 | [Entrega](#etiqueta-entrega) |
| [ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad](adr/ADR-014-semver.md) | 1.3.0 | ✅ Aceptado | 2026-10-01 | [Entrega](#etiqueta-entrega) · [Proceso](#etiqueta-proceso) |
| [ADR-015 · Validación en tres capas, con la base como juez](adr/ADR-015-validacion-tres-capas.md) | 1.0.0 | ⛔ Reemplazado | 2026-09-16 | [Arquitectura](#etiqueta-arquitectura) · [Front](#etiqueta-front) · [API](#etiqueta-api) |
| [ADR-016 · Flutter Web instalable como PWA](adr/ADR-016-flutter-web-pwa.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Front](#etiqueta-front) |
| [ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API](adr/ADR-017-api-en-java.md) | 1.0.0 | ⛔ Reemplazado | 2026-09-16 | [Arquitectura](#etiqueta-arquitectura) · [API](#etiqueta-api) |
| [ADR-018 · Tres partes, y el front no toma decisiones](adr/ADR-018-front-sin-decisiones.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Arquitectura](#etiqueta-arquitectura) · [Front](#etiqueta-front) |
| [ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos](adr/ADR-019-contrato-de-respuesta.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Contrato](#etiqueta-contrato) · [API](#etiqueta-api) |
| [ADR-020 · Idempotencia obligatoria en toda escritura](adr/ADR-020-idempotencia.md) | 1.2.0 | ✅ Aceptado | 2026-09-17 | [API](#etiqueta-api) · [Contrato](#etiqueta-contrato) |
| [ADR-021 · Canal firmado contra repetición y manipulación](adr/ADR-021-canal-firmado.md) | 1.1.0 | ✅ Aceptado | 2026-09-17 | [Seguridad](#etiqueta-seguridad) · [API](#etiqueta-api) · [Contrato](#etiqueta-contrato) |
| [ADR-022 · OpenAPI generado del código y verificado en integración continua](adr/ADR-022-openapi-generado.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Contrato](#etiqueta-contrato) · [Calidad](#etiqueta-calidad) |
| [ADR-023 · Tres repositorios y el contrato como artefacto versionado](adr/ADR-023-tres-repositorios.md) | 1.0.0 | ⛔ Reemplazado | 2026-09-16 | [Proceso](#etiqueta-proceso) · [Paralelo](#etiqueta-paralelo) |
| [ADR-024 · Java 25, Gradle y Spring Boot 4 en la API](adr/ADR-024-java-25-y-gradle.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [API](#etiqueta-api) · [Entrega](#etiqueta-entrega) |
| [ADR-025 · Cuatro repositorios: la base de datos sale de la API](adr/ADR-025-cuatro-repositorios.md) | 1.2.0 | ✅ Aceptado | 2026-09-21 | [Proceso](#etiqueta-proceso) · [Paralelo](#etiqueta-paralelo) · [Base de datos](#etiqueta-base-de-datos) |
| [ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo](adr/ADR-026-railway-al-final.md) | 1.1.0 | ⛔ Reemplazado | 2026-09-17 | [Entrega](#etiqueta-entrega) · [Plan](#etiqueta-plan) |
| [ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica](adr/ADR-027-documentacion-versionada.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Proceso](#etiqueta-proceso) |
| [ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué](adr/ADR-028-un-commit-por-tarea.md) | 1.4.0 | ✅ Aceptado | 2026-09-24 | [Proceso](#etiqueta-proceso) · [Plan](#etiqueta-plan) |
| [ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase](adr/ADR-029-esquema-por-etiqueta.md) | 1.0.0 | ✅ Aceptado | 2026-09-16 | [Base de datos](#etiqueta-base-de-datos) · [API](#etiqueta-api) · [Entrega](#etiqueta-entrega) · [Calidad](#etiqueta-calidad) |
| [ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0](adr/ADR-030-contrato-sin-get.md) | 1.0.0 | ✅ Aceptado | 2026-09-17 | [API](#etiqueta-api) · [Contrato](#etiqueta-contrato) · [Seguridad](#etiqueta-seguridad) |
| [ADR-031 · El mensaje de commit cabe en 256 caracteres](adr/ADR-031-commit-de-256-caracteres.md) | 1.2.0 | ⛔ Reemplazado | 2026-09-21 | — |
| [ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final](adr/ADR-032-railway-en-dev-ahora.md) | 1.1.0 | ✅ Aceptado | 2026-10-03 | [Entrega](#etiqueta-entrega) · [Plan](#etiqueta-plan) |
| [ADR-033 · La clave de servicio entra, pero solo para crear identidades](adr/ADR-033-service-role-solo-en-auth.md) | 1.0.0 | ✅ Aceptado | 2026-09-18 | [Seguridad](#etiqueta-seguridad) · [API](#etiqueta-api) |
| [ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige](adr/ADR-034-la-version-sube-en-cada-pr.md) | 1.0.0 | ✅ Aceptado | 2026-09-19 | [Entrega](#etiqueta-entrega) · [Proceso](#etiqueta-proceso) · [Calidad](#etiqueta-calidad) |
| [ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo](adr/ADR-035-repositorios-hermanos.md) | 1.0.0 | ✅ Aceptado | 2026-09-21 | [Proceso](#etiqueta-proceso) · [Paralelo](#etiqueta-paralelo) |
| [ADR-036 · El mensaje de commit no tiene limite de longitud](adr/ADR-036-sin-limite-en-el-commit.md) | 1.1.0 | ✅ Aceptado | 2026-09-24 | — |
| [ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos](adr/ADR-037-el-pr-se-abre-a-pedido.md) | 1.1.0 | ⛔ Reemplazado | 2026-09-24 | [Proceso](#etiqueta-proceso) · [Paralelo](#etiqueta-paralelo) |
| [ADR-038 · La pila local se orquesta desde prisma_db, y cada receta se apunta desde su .env](adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md) | 1.0.0 | ✅ Aceptado | 2026-09-24 | [Proceso](#etiqueta-proceso) · [Base de datos](#etiqueta-base-de-datos) |
| [ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill](adr/ADR-039-cada-regla-en-un-solo-sitio.md) | 1.0.0 | ✅ Aceptado | 2026-09-24 | [Proceso](#etiqueta-proceso) |
| [ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base](adr/ADR-040-rama-feature-y-pr-autorizado.md) | 1.0.0 | ✅ Aceptado | 2026-09-24 | [Proceso](#etiqueta-proceso) · [Paralelo](#etiqueta-paralelo) |
| [ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo](adr/ADR-041-cuatro-lineas-por-parrafo.md) | 1.0.0 | ✅ Aceptado | 2026-09-24 | [Proceso](#etiqueta-proceso) · [Calidad](#etiqueta-calidad) |
| [ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md) | 1.0.0 | ✅ Aceptado | 2026-09-26 | [API](#etiqueta-api) · [Contrato](#etiqueta-contrato) · [Calidad](#etiqueta-calidad) |
| [ADR-043 · Una tarea solo depende de tareas anteriores](adr/ADR-043-dependencias-solo-hacia-atras.md) | 1.0.0 | ✅ Aceptado | 2026-09-27 | [Plan](#etiqueta-plan) · [Proceso](#etiqueta-proceso) |
| [ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería](adr/ADR-044-dos-ambientes-desplegados.md) | 1.2.0 | ✅ Aceptado | 2026-10-10 | [Entrega](#etiqueta-entrega) · [Plan](#etiqueta-plan) |
| [ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md) | 1.2.0 | ✅ Aceptado | 2026-10-10 | [Entrega](#etiqueta-entrega) · [Plan](#etiqueta-plan) |
| [ADR-046 · pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería](adr/ADR-046-pre-prod-se-construye-desde-su-rama.md) | 1.2.0 | ⛔ Reemplazado | 2026-10-10 | [Entrega](#etiqueta-entrega) |
| [ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) | 1.0.0 | ✅ Aceptado | 2026-10-04 | [Plan](#etiqueta-plan) · [Base de datos](#etiqueta-base-de-datos) · [Seguridad](#etiqueta-seguridad) |
| [ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar](adr/ADR-048-las-ramas-principales-las-protege-github.md) | 1.2.0 | ✅ Aceptado | 2026-10-14 | [Entrega](#etiqueta-entrega) · [Proceso](#etiqueta-proceso) |
| [ADR-049 · Sin DOCS_CLAVE, Swagger toma PREPROD_GERENCIA_CLAVE](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md) | 1.1.0 | ✅ Aceptado | 2026-10-10 | [Entrega](#etiqueta-entrega) · [Seguridad](#etiqueta-seguridad) |
| [ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) | 1.1.0 | ✅ Aceptado | 2026-10-10 | [Entrega](#etiqueta-entrega) · [Proceso](#etiqueta-proceso) |
| [ADR-051 · La visibilidad de un repositorio no se cambia](adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md) | 1.1.0 | ✅ Aceptado | 2026-10-14 | [Proceso](#etiqueta-proceso) |
| [ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada](adr/ADR-052-la-entrega-del-release-a-prod.md) | 1.2.0 | ✅ Aceptado | 2026-10-13 | [Entrega](#etiqueta-entrega) · [Plan](#etiqueta-plan) |
| [ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) | 1.0.0 | ✅ Aceptado | 2026-10-10 | [Entrega](#etiqueta-entrega) · [Proceso](#etiqueta-proceso) |
| [ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia](adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md) | 1.0.0 | ✅ Aceptado | 2026-10-13 | [Entrega](#etiqueta-entrega) · [Plan](#etiqueta-plan) |
| [ADR-057 · La atribución de un agente va una sola vez, y sin el enlace ni el id de su sesión](adr/ADR-057-la-atribucion-va-una-vez-y-sin-la-sesion.md) | 1.0.0 | ✅ Aceptado | 2026-10-14 | [Proceso](#etiqueta-proceso) |
| [ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop](adr/ADR-058-el-monorepo-no-va-adelante-de-develop.md) | 1.0.0 | ✅ Aceptado | 2026-10-14 | [Entrega](#etiqueta-entrega) · [Proceso](#etiqueta-proceso) |
| [AGENTS.md](../AGENTS.md) | 2.0.0 | ✅ Vigente | 2026-10-14 | [Proceso](#etiqueta-proceso) |
| [CLAUDE.md](../CLAUDE.md) | 12.5.0 | ✅ Vigente | 2026-10-14 | [Proceso](#etiqueta-proceso) |
| [Herramienta de documentación](../scripts/docs/README.md) | 2.2.0 | ✅ Vigente | 2026-09-27 | [Proceso](#etiqueta-proceso) |
| [Políticas de rama](../scripts/github/README.md) | 2.2.0 | ✅ Vigente | 2026-10-14 | [Proceso](#etiqueta-proceso) |
<!-- /generado:estado-de-la-documentacion -->

---

## 6. Por etiqueta

Cada etiqueta del encabezado de un documento lleva aquí.

<!-- generado:etiquetas · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
### <a id="etiqueta-negocio"></a>Negocio

[PRISMA — Sistema de Gestión Administrativa y Financiera](../README.md) · [00 · Resumen ejecutivo](00-resumen-ejecutivo.md) · [01 · Visión y alcance](01-vision-y-alcance.md) · [02 · Casos de uso](02-casos-de-uso.md) · [05 · Reglas financieras y KPIs](05-reglas-financieras.md) · [06 · Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md) · [09 · Plan de implantación](09-plan-de-implantacion.md) · [11 · Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md) · [14 · Roadmap e ideas de valor](14-roadmap-e-ideas.md) · [15 · Glosario](15-glosario.md) · [23 · Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md)

### <a id="etiqueta-finanzas"></a>Finanzas

[00 · Resumen ejecutivo](00-resumen-ejecutivo.md) · [05 · Reglas financieras y KPIs](05-reglas-financieras.md) · [06 · Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md) · [ADR-003 · Dinero como entero de pesos](adr/ADR-003-dinero-entero.md)

### <a id="etiqueta-nomina"></a>Nómina

[06 · Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md)

### <a id="etiqueta-requisitos"></a>Requisitos

[01 · Visión y alcance](01-vision-y-alcance.md) · [02 · Casos de uso](02-casos-de-uso.md) · [03 · Requisitos, reglas de negocio y escenarios BDD](03-requisitos-y-bdd.md) · [23 · Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md)

### <a id="etiqueta-ux"></a>UX

[10 · Diseño de experiencia y mockups](10-ux-y-mockups.md)

### <a id="etiqueta-arquitectura"></a>Arquitectura

[04 · Modelo de datos](04-modelo-de-datos.md) · [07 · Arquitectura técnica](07-arquitectura.md) · [17 · Resiliencia, trabajo sin conexión y caché](17-resiliencia-offline-y-cache.md) · [23 · Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md) · [Decisiones de arquitectura (ADR)](adr/README.md) · [ADR-001 · Stack tecnológico](adr/ADR-001-stack.md) · [ADR-002 · Arquitectura hexagonal con regla de dependencias verificada](adr/ADR-002-arquitectura-hexagonal.md) · [ADR-011 · Stack: Flutter y Dart con API propia](adr/ADR-011-stack-flutter-dart.md) · [ADR-015 · Validación en tres capas, con la base como juez](adr/ADR-015-validacion-tres-capas.md) · [ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API](adr/ADR-017-api-en-java.md) · [ADR-018 · Tres partes, y el front no toma decisiones](adr/ADR-018-front-sin-decisiones.md)

### <a id="etiqueta-api"></a>API

[07 · Arquitectura técnica](07-arquitectura.md) · [17 · Resiliencia, trabajo sin conexión y caché](17-resiliencia-offline-y-cache.md) · [20 · Contrato de la API](20-contrato-de-api.md) · [Contrato de la API · v0.33.0](../contrato/README.md) · [ADR-002 · Arquitectura hexagonal con regla de dependencias verificada](adr/ADR-002-arquitectura-hexagonal.md) · [ADR-003 · Dinero como entero de pesos](adr/ADR-003-dinero-entero.md) · [ADR-009 · Acceso con nombre de usuario, no con correo](adr/ADR-009-login-por-usuario.md) · [ADR-011 · Stack: Flutter y Dart con API propia](adr/ADR-011-stack-flutter-dart.md) · [ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando](adr/ADR-012-identidad-a-postgres.md) · [ADR-015 · Validación en tres capas, con la base como juez](adr/ADR-015-validacion-tres-capas.md) · [ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API](adr/ADR-017-api-en-java.md) · [ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos](adr/ADR-019-contrato-de-respuesta.md) · [ADR-020 · Idempotencia obligatoria en toda escritura](adr/ADR-020-idempotencia.md) · [ADR-021 · Canal firmado contra repetición y manipulación](adr/ADR-021-canal-firmado.md) · [ADR-024 · Java 25, Gradle y Spring Boot 4 en la API](adr/ADR-024-java-25-y-gradle.md) · [ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase](adr/ADR-029-esquema-por-etiqueta.md) · [ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0](adr/ADR-030-contrato-sin-get.md) · [ADR-033 · La clave de servicio entra, pero solo para crear identidades](adr/ADR-033-service-role-solo-en-auth.md) · [ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md)

### <a id="etiqueta-front"></a>Front

[07 · Arquitectura técnica](07-arquitectura.md) · [10 · Diseño de experiencia y mockups](10-ux-y-mockups.md) · [17 · Resiliencia, trabajo sin conexión y caché](17-resiliencia-offline-y-cache.md) · [18 · Distribución multiplataforma y automatización (pipelines)](18-distribucion-y-pipelines.md) · [20 · Contrato de la API](20-contrato-de-api.md) · [Contrato de la API · v0.33.0](../contrato/README.md) · [ADR-007 · PWA en lugar de aplicación nativa](adr/ADR-007-pwa.md) · [ADR-011 · Stack: Flutter y Dart con API propia](adr/ADR-011-stack-flutter-dart.md) · [ADR-015 · Validación en tres capas, con la base como juez](adr/ADR-015-validacion-tres-capas.md) · [ADR-016 · Flutter Web instalable como PWA](adr/ADR-016-flutter-web-pwa.md) · [ADR-018 · Tres partes, y el front no toma decisiones](adr/ADR-018-front-sin-decisiones.md)

### <a id="etiqueta-base-de-datos"></a>Base de datos

[04 · Modelo de datos](04-modelo-de-datos.md) · [07 · Arquitectura técnica](07-arquitectura.md) · [13 · Respaldo y exportación](13-respaldo-y-exportacion.md) · [16 · Base de datos: snapshots y datos de prueba](16-base-de-datos-y-snapshots.md) · [ADR-003 · Dinero como entero de pesos](adr/ADR-003-dinero-entero.md) · [ADR-004 · Base de datos de solo escritura](adr/ADR-004-base-solo-escritura.md) · [ADR-005 · Auditoría por triggers, no por la aplicación](adr/ADR-005-auditoria-por-triggers.md) · [ADR-006 · Permisos con Row Level Security](adr/ADR-006-rls-por-rol.md) · [ADR-008 · Exportación con descarga manual](adr/ADR-008-exportacion.md) · [ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando](adr/ADR-012-identidad-a-postgres.md) · [ADR-025 · Cuatro repositorios: la base de datos sale de la API](adr/ADR-025-cuatro-repositorios.md) · [ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase](adr/ADR-029-esquema-por-etiqueta.md) · [ADR-038 · La pila local se orquesta desde prisma_db, y cada receta se apunta desde su .env](adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md) · [ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md)

### <a id="etiqueta-seguridad"></a>Seguridad

[07 · Arquitectura técnica](07-arquitectura.md) · [11 · Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md) · [ADR-005 · Auditoría por triggers, no por la aplicación](adr/ADR-005-auditoria-por-triggers.md) · [ADR-006 · Permisos con Row Level Security](adr/ADR-006-rls-por-rol.md) · [ADR-009 · Acceso con nombre de usuario, no con correo](adr/ADR-009-login-por-usuario.md) · [ADR-010 · Almacenamiento de contraseñas: hashing delegado con salt por usuario](adr/ADR-010-almacenamiento-contrasenas.md) · [ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando](adr/ADR-012-identidad-a-postgres.md) · [ADR-021 · Canal firmado contra repetición y manipulación](adr/ADR-021-canal-firmado.md) · [ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0](adr/ADR-030-contrato-sin-get.md) · [ADR-033 · La clave de servicio entra, pero solo para crear identidades](adr/ADR-033-service-role-solo-en-auth.md) · [ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) · [ADR-049 · Sin DOCS_CLAVE, Swagger toma PREPROD_GERENCIA_CLAVE](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md)

### <a id="etiqueta-datos-personales"></a>Datos personales

[11 · Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md) · [13 · Respaldo y exportación](13-respaldo-y-exportacion.md) · [ADR-008 · Exportación con descarga manual](adr/ADR-008-exportacion.md)

### <a id="etiqueta-calidad"></a>Calidad

[03 · Requisitos, reglas de negocio y escenarios BDD](03-requisitos-y-bdd.md) · [12 · Pruebas y calidad](12-pruebas-y-calidad.md) · [16 · Base de datos: snapshots y datos de prueba](16-base-de-datos-y-snapshots.md) · [ADR-022 · OpenAPI generado del código y verificado en integración continua](adr/ADR-022-openapi-generado.md) · [ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase](adr/ADR-029-esquema-por-etiqueta.md) · [ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige](adr/ADR-034-la-version-sube-en-cada-pr.md) · [ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo](adr/ADR-041-cuatro-lineas-por-parrafo.md) · [ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md)

### <a id="etiqueta-entrega"></a>Entrega

[09 · Plan de implantación](09-plan-de-implantacion.md) · [18 · Distribución multiplataforma y automatización (pipelines)](18-distribucion-y-pipelines.md) · [19 · Ambientes, versionado y entrega](19-ambientes-y-entrega.md) · [ADR-013 · Cuatro ambientes y promoción de migraciones](adr/ADR-013-cuatro-ambientes.md) · [ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad](adr/ADR-014-semver.md) · [ADR-024 · Java 25, Gradle y Spring Boot 4 en la API](adr/ADR-024-java-25-y-gradle.md) · [ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo](adr/ADR-026-railway-al-final.md) · [ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase](adr/ADR-029-esquema-por-etiqueta.md) · [ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final](adr/ADR-032-railway-en-dev-ahora.md) · [ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige](adr/ADR-034-la-version-sube-en-cada-pr.md) · [ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería](adr/ADR-044-dos-ambientes-desplegados.md) · [ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md) · [ADR-046 · pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería](adr/ADR-046-pre-prod-se-construye-desde-su-rama.md) · [ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar](adr/ADR-048-las-ramas-principales-las-protege-github.md) · [ADR-049 · Sin DOCS_CLAVE, Swagger toma PREPROD_GERENCIA_CLAVE](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md) · [ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) · [ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada](adr/ADR-052-la-entrega-del-release-a-prod.md) · [ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) · [ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia](adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md) · [ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop](adr/ADR-058-el-monorepo-no-va-adelante-de-develop.md)

### <a id="etiqueta-plan"></a>Plan

[PRISMA — Sistema de Gestión Administrativa y Financiera](../README.md) · [Tareas de PRISMA](../TODO.md) · [00 · Resumen ejecutivo](00-resumen-ejecutivo.md) · [08 · Plan de desarrollo](08-plan-de-desarrollo.md) · [09 · Plan de implantación](09-plan-de-implantacion.md) · [14 · Roadmap e ideas de valor](14-roadmap-e-ideas.md) · [ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo](adr/ADR-026-railway-al-final.md) · [ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué](adr/ADR-028-un-commit-por-tarea.md) · [ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final](adr/ADR-032-railway-en-dev-ahora.md) · [ADR-043 · Una tarea solo depende de tareas anteriores](adr/ADR-043-dependencias-solo-hacia-atras.md) · [ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería](adr/ADR-044-dos-ambientes-desplegados.md) · [ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md) · [ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) · [ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada](adr/ADR-052-la-entrega-del-release-a-prod.md) · [ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia](adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md)

### <a id="etiqueta-paralelo"></a>Paralelo

[Tareas de PRISMA](../TODO.md) · [08 · Plan de desarrollo](08-plan-de-desarrollo.md) · [21 · Trabajo en paralelo por carriles](21-trabajo-en-paralelo.md) · [ADR-023 · Tres repositorios y el contrato como artefacto versionado](adr/ADR-023-tres-repositorios.md) · [ADR-025 · Cuatro repositorios: la base de datos sale de la API](adr/ADR-025-cuatro-repositorios.md) · [ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo](adr/ADR-035-repositorios-hermanos.md) · [ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos](adr/ADR-037-el-pr-se-abre-a-pedido.md) · [ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base](adr/ADR-040-rama-feature-y-pr-autorizado.md)

### <a id="etiqueta-contrato"></a>Contrato

[20 · Contrato de la API](20-contrato-de-api.md) · [Contrato de la API · v0.33.0](../contrato/README.md) · [ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos](adr/ADR-019-contrato-de-respuesta.md) · [ADR-020 · Idempotencia obligatoria en toda escritura](adr/ADR-020-idempotencia.md) · [ADR-021 · Canal firmado contra repetición y manipulación](adr/ADR-021-canal-firmado.md) · [ADR-022 · OpenAPI generado del código y verificado en integración continua](adr/ADR-022-openapi-generado.md) · [ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0](adr/ADR-030-contrato-sin-get.md) · [ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md)

### <a id="etiqueta-proceso"></a>Proceso

[19 · Ambientes, versionado y entrega](19-ambientes-y-entrega.md) · [21 · Trabajo en paralelo por carriles](21-trabajo-en-paralelo.md) · [22 · Documentación: versiones, estados y referencias](22-documentacion.md) · [ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad](adr/ADR-014-semver.md) · [ADR-023 · Tres repositorios y el contrato como artefacto versionado](adr/ADR-023-tres-repositorios.md) · [ADR-025 · Cuatro repositorios: la base de datos sale de la API](adr/ADR-025-cuatro-repositorios.md) · [ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica](adr/ADR-027-documentacion-versionada.md) · [ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué](adr/ADR-028-un-commit-por-tarea.md) · [ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige](adr/ADR-034-la-version-sube-en-cada-pr.md) · [ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo](adr/ADR-035-repositorios-hermanos.md) · [ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos](adr/ADR-037-el-pr-se-abre-a-pedido.md) · [ADR-038 · La pila local se orquesta desde prisma_db, y cada receta se apunta desde su .env](adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md) · [ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill](adr/ADR-039-cada-regla-en-un-solo-sitio.md) · [ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base](adr/ADR-040-rama-feature-y-pr-autorizado.md) · [ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo](adr/ADR-041-cuatro-lineas-por-parrafo.md) · [ADR-043 · Una tarea solo depende de tareas anteriores](adr/ADR-043-dependencias-solo-hacia-atras.md) · [ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar](adr/ADR-048-las-ramas-principales-las-protege-github.md) · [ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) · [ADR-051 · La visibilidad de un repositorio no se cambia](adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md) · [ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) · [ADR-057 · La atribución de un agente va una sola vez, y sin el enlace ni el id de su sesión](adr/ADR-057-la-atribucion-va-una-vez-y-sin-la-sesion.md) · [ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop](adr/ADR-058-el-monorepo-no-va-adelante-de-develop.md) · [AGENTS.md](../AGENTS.md) · [CLAUDE.md](../CLAUDE.md) · [Herramienta de documentación](../scripts/docs/README.md) · [Políticas de rama](../scripts/github/README.md)
<!-- /generado:etiquetas -->

---

← Volver al [README principal](../README.md)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [22](22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [AGENTS](../AGENTS.md "AGENTS.md") · [CLAUDE](../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
