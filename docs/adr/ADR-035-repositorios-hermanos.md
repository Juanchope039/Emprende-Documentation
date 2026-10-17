# ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-035-repositorios-hermanos.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-21 | 2026-09-21 | [Proceso](../INDICE.md#etiqueta-proceso) · [Paralelo](../INDICE.md#etiqueta-paralelo) |

## Contexto

El [ADR-025](ADR-025-cuatro-repositorios.md) separó el código en cuatro repositorios y dejó los tres de código **dentro** de esta
especificación, en `repositories/`, ignorados por su `.gitignore`. En pocos días ese anidamiento
empezó a estorbar más de lo que ordenaba:

- **La especificación contenía tres repositorios que no versionaba.** Una búsqueda hecha desde su
  raíz no entraba en `repositories/`, porque git lo ignora, así que cada búsqueda tenía que nombrar
  la carpeta del repositorio.
- **Cada copia de trabajo de la especificación arrastraba las de los demás.** Para trabajar en
  paralelo había que repetir el anidamiento en cada worktree, y las copias terminaron separándose.
- **Los planes de trabajo vivían en una carpeta ignorada, y cada copia tenía la suya.** Dos copias
  llegaron a darle el mismo número a planes distintos, y [`TODO.md`](../../TODO.md) citaba por ruta planes que en
  otra copia no existían.
- **El `CLAUDE.md` de la especificación crecía con cada tarea.** Además de las reglas contaba en qué
  iba el proyecto, así que subía de versión en cada PR. En cinco días llegó a la 7.24.0.

El 2026-09-21 se reorganizó la carpeta de trabajo: los cuatro repositorios quedaron como hermanos y
la especificación dejó de contener a los demás.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Hermanos, en una carpeta de trabajo que no es repositorio** | Los cuatro repositorios quedan en pie de igualdad. Una búsqueda desde la carpeta de trabajo entra en los cuatro, y un clon de la especificación ya no trae una carpeta vacía que haya que llenar | Lo que no es de ningún repositorio, como los planes, queda sin respaldo, y la herramienta tiene que saber dónde están los demás |
| Seguir anidados, como en el [ADR-025](ADR-025-cuatro-repositorios.md) | No hay nada que cambiar | Siguen los cuatro problemas del contexto |
| La carpeta de trabajo como quinto repositorio | Los planes y la configuración local quedarían respaldados | Es un repositorio más que mantener, para archivos que no usa nadie más |
| La herramienta de documentación fuera de la especificación, sin versionar | La herramienta queda junto a los cuatro repositorios que revisa | La integración continua de la especificación se queda sin herramienta, y el [ADR-027](ADR-027-documentacion-versionada.md) sin quien lo haga cumplir |

## Decisión

**Los cuatro repositorios son hermanos dentro de una carpeta de trabajo, y la especificación es uno
más.**

| Carpeta | Repositorio | Qué es |
|---|---|---|
| `documentation` | `Finanzas-PRISMA` | Esta especificación: documentación, ADR, mockup, contrato y la herramienta que los verifica |
| `backend-api` | `prisma_api` | La API |
| `backend-db` | `prisma_db` | Las migraciones, la semilla y los scripts de la base |
| `frontend-flutter` | `prisma_front` | El front |

1. **La carpeta de trabajo no es un repositorio.** Guarda solo dos cosas: los planes de trabajo y
   un `CLAUDE.md` de una línea que importa el de la especificación. Así Claude carga las reglas del
   proyecto desde cualquiera de los cuatro repositorios.
2. **La herramienta de documentación se queda en la especificación, con su integración continua.**
   A los demás repositorios los encuentra como `../backend-api`, `../backend-db` y
   `../frontend-flutter`. Si no están en disco, como pasa en la integración continua, no los
   revisa.
3. **Los planes de trabajo no son documentación.** Viven fuera de todo repositorio, no se versionan
   y **ningún documento los cita**, ni por ruta ni por número. La regla de cuándo y cómo se escriben
   está en el `CLAUDE.md` de la especificación, y la herramienta deja de revisarlos.
4. **Cada repositorio lleva un `CLAUDE.md` y un `AGENTS.md`.**
   - El `CLAUDE.md` guarda las reglas y lo que casi no cambia. No se toca al cerrar una tarea, un
     commit o un plan: cambia solo cuando cambia una regla.
   - El `AGENTS.md` es la guía para cualquier agente de código —comandos, estructura, cómo se
     agrega algo— y cambia cuando cambia la forma del repositorio.
   - El `CLAUDE.md` importa el `AGENTS.md`, y así Claude lee los dos.
   - El estado del proyecto no va en ninguno de los dos: vive en [`TODO.md`](../../TODO.md).
5. **La columna «Código» del encabezado va solo en los README de código**, como ya decía [22 §2](../22-documentacion.md#2-el-encabezado). Así
   un `CLAUDE.md` o un `AGENTS.md` no cambia cada vez que sube la versión del código.

De [ADR-025](ADR-025-cuatro-repositorios.md), esto reemplaza **dónde vive cada repositorio en disco**. El resto sigue en pie: la base
con repositorio propio, el orden de la migración antes que la API y la versión del esquema.

## Justificación

**Un repositorio no debería contener a otro.** El anidamiento de [ADR-025](ADR-025-cuatro-repositorios.md) no movía ninguna frontera,
pero escondía tres repositorios dentro de uno que no los versionaba. Como hermanos, cada uno es lo
que parece: una carpeta con su propia historia.

**La herramienta se queda donde la hace cumplir la integración continua.** Sacarla a la carpeta de
trabajo la dejaba junto a lo que revisa, pero fuera de la integración continua. El [ADR-027](ADR-027-documentacion-versionada.md) dice que
una regla que no comprueba una máquina no se cumple, y eso vale también para la herramienta que la
comprueba.

**Citar un plan es enlazar algo que el lector no tiene.** Los planes nunca viajaron con el
repositorio. Citarlos desde [`TODO.md`](../../TODO.md) era enlazar un archivo que existía en una sola máquina, y que
en otras copias podía llevar otro número. Lo que importe de un plan para la documentación se escribe
en el documento.

**Las reglas no pueden cambiar al ritmo de las tareas.** Un archivo que se carga al empezar cada
sesión y que cambia en cada PR termina sin que nadie lo relea, y una regla nueva se pierde entre
cuarenta párrafos de estado. Cada cosa va en el archivo que cambia a su ritmo: las reglas, la guía y
el estado.

## Consecuencias

- **Positivas:**
  - Una búsqueda desde la carpeta de trabajo entra en los cuatro repositorios.
  - Cualquier agente de código encuentra en cada repositorio su `AGENTS.md`, y Claude además las
    reglas.
  - El `CLAUDE.md` deja de subir de versión en cada tarea.
  - La documentación ya no enlaza nada que el lector no pueda abrir.
- **Negativas:**
  - Los planes no se respaldan en ningún repositorio, y la herramienta ya no vigila su numeración.
  - La carpeta de trabajo tiene una forma que hay que respetar: si los cuatro repositorios no son
    hermanos, la herramienta no ve a los de código.
  - Quien clona un solo repositorio no tiene la carpeta de trabajo. Le basta su `AGENTS.md` y el
    `CLAUDE.md` de la especificación, que está en GitHub.
- **A vigilar:** que el `CLAUDE.md` vuelva a llenarse de estado, conteos o versiones. La señal es que
  suba de versión en un PR que no cambió ninguna regla.

## Referencias

- [ADR-025](ADR-025-cuatro-repositorios.md) — la decisión que esto reemplaza en lo que toca al disco
- [ADR-027](ADR-027-documentacion-versionada.md) — la documentación versionada y la herramienta que la verifica
- [ADR-028](ADR-028-un-commit-por-tarea.md) y [ADR-031](ADR-031-commit-de-256-caracteres.md) — dónde queda escrito el porqué de cada cambio
- [`22-documentacion.md`](../22-documentacion.md) — el encabezado, la herramienta y los planes de trabajo
- [21 §3](../21-trabajo-en-paralelo.md#3-cuatro-repositorios) — los cuatro repositorios y sus carriles

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [22](../22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [ADR-025](ADR-025-cuatro-repositorios.md "ADR-025 · Cuatro repositorios: la base de datos sale de la API") · [ADR-028](ADR-028-un-commit-por-tarea.md "ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué") · [ADR-031](ADR-031-commit-de-256-caracteres.md "ADR-031 · El mensaje de commit cabe en 256 caracteres") · [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md "ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos") · [ADR-038](ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md "ADR-038 · La pila local se orquesta desde prisma_db, y cada receta se apunta desde su .env") · [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md "ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill") · [ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md "ADR-051 · La visibilidad de un repositorio no se cambia") · [ADR-069](ADR-069-el-proyecto-se-llama-emprende.md "ADR-069 · El proyecto se llama Emprende, y el nombre viejo se va por donde se toca") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/docs/README.md "Herramienta de documentación")
<!-- /generado:referenciado-desde -->
