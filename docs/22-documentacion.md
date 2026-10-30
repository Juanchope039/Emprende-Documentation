# 22 · Documentación: versiones, estados y referencias

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.3.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/22-documentacion.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-16 | 2026-10-30 | [Proceso](INDICE.md#etiqueta-proceso) |

Cómo se escribe, se versiona y se enlaza la documentación de Emprende: la de este repositorio y los
README, `CLAUDE.md` y `AGENTS.md` de los tres repositorios de código. La decisión y su porqué están en [ADR-027](adr/ADR-027-documentacion-versionada.md); aquí están las
reglas.

> **Las reglas no dependen de que alguien se acuerde.** `scripts/docs/documentar.mjs` pone las
> anclas, los enlaces y los bloques generados, y la integración continua falla si algo queda roto,
> sin enlazar, o con el contenido cambiado sin subir la versión.

---

## 1. Qué cubre

- **Todo archivo Markdown de este repositorio:** `README.md`, [`TODO.md`](../TODO.md), `docs/`, `docs/adr/`,
  `contrato/README.md` y `scripts/docs/README.md`.
- **Los README, los `CLAUDE.md` y los `AGENTS.md` de `prisma_api`, `emprende_db` y `emprende_front`**, y
  el README de la copia fijada del contrato dentro de `prisma_api`. La herramienta los encuentra al
  lado de esta especificación, en la carpeta de trabajo ([ADR-035](adr/ADR-035-repositorios-hermanos.md)).
- **Fuera quedan las plantillas de terceros**, como el README que Flutter pone dentro de
  `ios/Runner/Assets.xcassets/`: no las escribió el proyecto. La lista vive en
  `scripts/docs/config.mjs`.
- **Fuera quedan también las carpetas de herramientas** —`.claude/` y `.agents/`, con las
  habilidades y la configuración de agentes de cualquiera de los cuatro repositorios—. Las que
  instala alguien no las escribe el proyecto, y las que sí escribe son instrucciones para un
  agente, no documentos.

---

## 2. El encabezado

Debajo del título, todo documento lleva la misma tabla:

| Columna | Qué dice | Cuándo cambia |
|---|---|---|
| **Versión** | SemVer del documento ([§3](#3-versiones)). El enlace abre su historial de cambios en GitHub | Con cada cambio |
| **Estado** | En qué punto de su vida está ([§4](#4-estados)). El enlace lleva a la definición | Cuando cambia de etapa |
| **Creado** | El día en que nació el documento | Nunca |
| **Actualizado** | El día de su última versión | Con cada cambio |
| **Etiquetas** | De qué trata, con el vocabulario del [§5](#5-etiquetas). Cada una lleva al índice por etiqueta | Cuando cambia de qué trata |

Dos columnas más, donde corresponde:

- **Código**, solo en los README de código: la versión SemVer del proyecto, leída de
  `build.gradle.kts` o de `pubspec.yaml`. Los `CLAUDE.md` y los `AGENTS.md` no la llevan: cambiarían
  con cada subida de versión aunque su texto siguiera igual ([ADR-035](adr/ADR-035-repositorios-hermanos.md)). `emprende_db` no tiene todavía dónde guardarla (tarea [0.10](08-plan-de-desarrollo.md#tarea-0-10)) y lleva «—».
- **Contrato**, en `contrato/README.md`: la versión de `contrato/openapi.json`.

> **La versión del documento y la del código son dos números distintos, y la columna lo dice.** El
> README de `prisma_api` puede ir en 1.3.0 mientras la API sigue en 0.1.0: uno cuenta los cambios
> del texto y el otro los del programa.

Las fechas van como AAAA-MM-DD, en hora de Bogotá.

---

## 3. <a id="versiones"></a>Versiones

SemVer, leído para un documento:

| Sube | Cuando el cambio… | Ejemplos |
|---|---|---|
| **MAJOR** | …hace que quien actuaba según la versión anterior ahora actúe mal | Una fórmula financiera cambia; un requisito se quita o se renumera; un sprint cambia sus tareas; una regla del proceso se invierte |
| **MINOR** | …agrega algo compatible con lo que había | Una sección nueva, un requisito nuevo, un ejemplo, una nota que aclara un caso |
| **PATCH** | …no cambia nada de lo que alguien haría | Erratas, redacción, enlaces, formato |

- **0.y.z es borrador:** todo puede cambiar. Un documento en 📝 Borrador, 💡 Propuesta o
  🔍 En revisión va en 0.y.z; uno ✅ Vigente o 🔄 Vivo, en 1.0.0 o más.
- **Los bloques generados no cuentan** ([§7](#7-bloques-generados)). Si otro documento empieza a citar el tuyo y cambia tu
  «Referenciado desde», tu versión no sube.
- **La línea base es la 1.0.0 del 16/09/2026.** Lo anterior queda en el historial de git; no se
  reconstruyeron versiones pasadas, porque habría sido inventarlas.
- **El cuerpo de un ADR aceptado no se edita** ([índice de ADR](adr/README.md)). Sube MINOR cuando
  se le agrega una nota o cambia de estado, y PATCH por erratas o enlaces.

---

## 4. <a id="estados"></a>Estados

| Estado | Significa | Versión |
|---|---|:---:|
| 📝 Borrador | Se está escribiendo; puede cambiar entero | 0.y.z |
| 💡 Propuesta | Una idea escrita, todavía sin decisión | 0.y.z |
| 🔍 En revisión | Completo, esperando aprobación | 0.y.z |
| ✅ Vigente | Es la referencia: lo que dice, se hace | 1.0.0 o más |
| 🔄 Vivo | Se actualiza a diario por diseño: tareas, índices, roadmap | 1.0.0 o más |
| ⛔ Reemplazado | Otro documento tomó su lugar; se conserva como historia | Cualquiera |

**«Vigente» no dice que algo esté construido: dice que es lo que manda.** Si un documento cuenta
además cómo va la construcción, lo dice en su texto, como «Construcción: diseñado, no construido».

### <a id="estados-de-un-adr"></a>Estados de un ADR

| Estado | Significa | Versión |
|---|---|:---:|
| 📝 Propuesto | En discusión | 0.y.z |
| ✅ Aceptado | Decidido y vigente | 1.0.0 o más |
| ❌ Rechazado | Se discutió y se descartó; se conserva para no repetir la discusión | Cualquiera |
| ⛔ Reemplazado por ADR-NNN | Otro ADR tomó su lugar, y el encabezado enlaza al que manda | Cualquiera |

---

## 5. <a id="etiquetas"></a>Etiquetas

| Etiqueta | Para qué documentos |
|---|---|
| Negocio | Lo que necesita leer quien dirige el negocio |
| Finanzas | Reglas, fórmulas y cifras |
| Nómina | Personal, liquidación y capacidad de pago |
| Requisitos | Casos de uso, requisitos y escenarios |
| UX | Pantallas, mockup y sistema de diseño |
| Arquitectura | La estructura del sistema y sus fronteras |
| API | `prisma_api` |
| Front | `emprende_front` |
| Base de datos | `emprende_db`: esquema, RLS, migraciones y respaldos |
| Seguridad | Acceso, permisos, secretos y canal firmado |
| Datos personales | Ley 1581 y lo que se guarda de las personas |
| Calidad | Pruebas y verificación |
| Entrega | Ambientes, versiones, integración continua y despliegue |
| Plan | Calendario, tareas e implantación |
| Paralelo | Cómo se trabaja en varias tareas a la vez |
| Contrato | El contrato entre front y API |
| Proceso | Cómo trabaja el proyecto |

Una etiqueta nueva se agrega aquí y en `scripts/docs/config.mjs` en el mismo commit, y sube MINOR
de este documento. El [índice](INDICE.md) lista los documentos de cada una.

---

## 6. <a id="referencias"></a>Referencias

**Toda referencia es un enlace.** Quien lee «ver [RF-84](03-requisitos-y-bdd.md#rf-84)» tiene que poder hacer clic y llegar a la
fila exacta. La herramienta enlaza sola lo que tenga estas formas:

| Se escribe | Lleva a |
|---|---|
| `ADR-012` | El archivo del ADR |
| `RF-84`, `RNF-26`, `RN-07`, `BDD-07-1` | Su fila en el [documento 03](03-requisitos-y-bdd.md) |
| `CU-04` | Su sección en el [documento 02](02-casos-de-uso.md), o su fila si no tiene sección |
| `R-08` | El riesgo en el [documento 11](11-riesgos-y-proteccion-de-datos.md) |
| `P-32`, `A-01`, `M-01`, `I-01`, `F-01`, `T-01`, `RE-01`, `C-04` | La prueba en el [documento 12](12-pruebas-y-calidad.md) |
| `D-05` | Lo diferido en el [documento 14](14-roadmap-e-ideas.md) |
| `S1` … `S5`, con la palabra «supuesto» en la misma línea | El supuesto en el [documento 01](01-vision-y-alcance.md) |
| `H1` | El hito en el [plan](08-plan-de-desarrollo.md) |
| `tarea 1.9`, `tareas 0.8 y 0.9`, `**1.9**` | La fila de la tarea en el plan |
| `Sprint 3` | La sección del sprint en el plan |
| `principio 9`, dentro del 10 o nombrándolo | El principio de diseño en el [documento 10](10-ux-y-mockups.md) |
| [`07-arquitectura.md`](07-arquitectura.md), con o sin comillas invertidas | El documento |
| `07 §4.1`, `07-arquitectura §4.1`, `§5.3 del doc 04` | La sección de ese documento |
| `§4.1`, solo | La sección del documento nombrado antes en la misma oración; si no nombró ninguno, la del propio |

- **Las anclas de los identificadores las pone la herramienta** en la fila o en el encabezado donde
  se definen, como `<a id="rf-84"></a>`. No se escriben a mano.
- **Para que algo no se enlace, va entre comillas invertidas.** `` `RF-104` `` se queda como texto,
  y los bloques de código no se tocan.
- **Una referencia que no lleva a ningún sitio falla la verificación**: una sección que no existe,
  un ADR que no existe, un requisito sin definir. Se corrige el texto; no se desactiva la regla.
- **En los README de código, lo que apunta a la especificación enlaza a GitHub**, porque es otro
  repositorio y una ruta relativa no llega.

### <a id="referenciado-desde"></a>Referenciado desde

Al pie de cada documento de `docs/` y del contrato hay un bloque **🔗 Referenciado desde** con los
documentos que lo citan. Lo genera la herramienta. No cuentan los índices —`README.md`, [`TODO.md`](../TODO.md),
[`INDICE.md`](INDICE.md) y el índice de ADR— ni la navegación del pie, porque enlazan a todo y el bloque dejaría
de decir algo.

---

## 7. <a id="bloques-generados"></a>Bloques generados

Lo que está entre `<!-- generado:… -->` y `<!-- /generado:… -->` lo escribe la herramienta y se
rehace entero en cada corrida. **No se edita a mano.**

| Bloque | Dónde | Qué sale |
|---|---|---|
| `referenciado-desde` | Pie de cada documento | Quién lo cita |
| `estado-de-la-documentacion` y `etiquetas` | [Índice](INDICE.md) | Versión y estado de cada documento, y los documentos de cada etiqueta |
| `plan-calendario`, `plan-camino-critico`, `plan-gantt` y `plan-oleadas-N` | [Plan](08-plan-de-desarrollo.md) | El calendario con 1, 2 y 3 tareas a la vez, la cadena que no se parte y qué va a la vez en cada sprint |
| `plan-dependencias-hacia-adelante` | [Plan](08-plan-de-desarrollo.md) | La deuda declarada de [ADR-043](adr/ADR-043-dependencias-solo-hacia-atras.md): qué tarea espera a una posterior, y por qué |
| `plan-tablero`, `plan-restante` y `plan-listas-ya` | [Tareas](../TODO.md) | El estado de cada sprint, cuánto falta desde hoy y qué se puede empezar ya |

Las marcas ⚡ y 🔒 de las tareas de [`TODO.md`](../TODO.md) también las pone la herramienta, a partir de las
dependencias del plan: ⚡ si todo lo que la tarea necesita ya está hecho, 🔒 si no.

Las otras dos marcas dicen **en qué va** una tarea, y eso no se deduce de ninguna dependencia: 🚧
cuando alguien la está haciendo y ✏️ cuando está escrita pero sin verificar. Las pone quien trabaja
la tarea, y la herramienta las respeta y las deja de primeras en la línea.

**Cada sprint del tablero lleva a su sección del propio [`TODO.md`](../TODO.md)**, y esa sección enlaza la del
plan. La sección es el encabezado o la línea en negrita que empieza por «Sprint N ·», y su ancla
`sprint-N` la pone la herramienta ahí y en ningún otro sitio. Si un sprint no tiene sección, su
enlace va al plan y la verificación falla.

**El tablero y el plan tienen que tener las mismas tareas, y la verificación lo comprueba.** Si el
plan gana una tarea que [`TODO.md`](../TODO.md) no enumera, o el tablero lista una que el plan no tiene, la
construcción falla. Sin eso, una tarea nueva puede quedarse fuera del tablero para siempre: nadie la
echa de menos, porque el tablero es justo el sitio donde uno iría a buscarla.

---

## 8. <a id="herramienta"></a>La herramienta

```bash
node scripts/docs/documentar.mjs enlazar
```

Pone anclas, enlaces y bloques generados, y deja los encabezados con su forma exacta. Se corre antes
de cada commit que toque documentación. Con `--en-seco` muestra lo que cambiaría sin escribir nada.

```bash
node scripts/docs/documentar.mjs verificar
```

Falla si un documento no tiene encabezado o lo tiene mal; si un estado no corresponde a su versión;
si un enlace apunta a un archivo o a un ancla que no existe; si una referencia no lleva a ningún
sitio; si el plan tiene dependencias rotas o en ciclo; o si falta correr `enlazar`. Con
`--base <commit>` exige además que todo documento cuyo contenido cambió desde ese commit haya subido
su versión y no haya retrocedido su fecha. Es lo que corre la integración continua en cada push y en
cada PR.

Necesita Node 20 o más y no tiene dependencias. Si los repositorios de código están al lado, en la
carpeta de trabajo —`../backend-api`, `../backend-db` y `../frontend-flutter`—, también revisa sus
README, sus `CLAUDE.md` y sus `AGENTS.md`, y un enlace relativo que escriban hacia
`../documentation/…` lo reescribe a GitHub, donde los repositorios no están juntos.

---

## 9. <a id="como-se-cambia"></a>Cómo se cambia un documento

1. Se cambia el texto.
2. Se sube la versión según el [§3](#3-versiones), y **Actualizado** pasa a la fecha de hoy.
3. Se corre `node scripts/docs/documentar.mjs enlazar`.
4. Commit, empuje y PR. La rama se empuja desde su primer commit ([21 §6.5](21-trabajo-en-paralelo.md#65-ramas-e-integración)), también cuando lo
   único que cambia es un documento. Si el documento es compartido entre repositorios, lo revisa el otro
   ([21 §2.1](21-trabajo-en-paralelo.md#21-lo-que-se-posee-en-conjunto)).

### En paralelo, sin pisarse

- **Un documento por PR cuando se pueda.** Dos PR que tocan el mismo documento chocan en el
  encabezado aunque el texto no choque.
- **Un conflicto en un bloque generado no se resuelve a mano:** se toma cualquiera de los dos lados
  y se vuelve a correr `enlazar`, que lo rehace entero.
- **Si dos PR suben el mismo documento a la misma versión**, el que se fusiona segundo la vuelve a
  subir al rebasar. La verificación con `--base` lo detecta.

---

## 10. <a id="planes"></a>Los planes de trabajo

**Los planes de trabajo no son documentación.** Antes de tocar código se escribe un plan —qué se va
a hacer, qué se decidió y por qué, y cómo se va a verificar—, pero vive fuera de los cuatro
repositorios, no se versiona y **ningún documento lo cita**, ni por ruta ni por número ([ADR-035](adr/ADR-035-repositorios-hermanos.md)). Lo
que de un plan le importe a la documentación se escribe en el documento que afecta. Cuándo y cómo se
escribe un plan lo dicen las reglas del proyecto, en [`CLAUDE.md`](../CLAUDE.md).
<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [ADR-027](adr/ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [ADR-031](adr/ADR-031-commit-de-256-caracteres.md "ADR-031 · El mensaje de commit cabe en 256 caracteres") · [ADR-035](adr/ADR-035-repositorios-hermanos.md "ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo") · [ADR-039](adr/ADR-039-cada-regla-en-un-solo-sitio.md "ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill") · [ADR-041](adr/ADR-041-cuatro-lineas-por-parrafo.md "ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo") · [CLAUDE](../CLAUDE.md "CLAUDE.md") · [README](../scripts/docs/README.md "Herramienta de documentación")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [21 · Trabajo en paralelo](21-trabajo-en-paralelo.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [23 · Diagramas de los casos de uso](23-diagramas-de-casos-de-uso.md)
