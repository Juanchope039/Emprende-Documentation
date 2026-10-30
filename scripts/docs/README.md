# Herramienta de documentación

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.4.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/scripts/docs/README.md "Historial de cambios") | [✅ Vigente](../../docs/22-documentacion.md#estados) | 2026-09-16 | 2026-10-30 | [Proceso](../../docs/INDICE.md#etiqueta-proceso) |

Pone y verifica los encabezados, las anclas, los enlaces y los bloques generados de toda la
documentación de Emprende. Las reglas que hace cumplir están en [`docs/22-documentacion.md`](../../docs/22-documentacion.md), y la
decisión en [ADR-027](../../docs/adr/ADR-027-documentacion-versionada.md).

## Uso

```bash
node scripts/docs/documentar.mjs enlazar             # escribe anclas, enlaces y bloques generados
node scripts/docs/documentar.mjs enlazar --en-seco   # muestra lo que cambiaría, sin escribir
node scripts/docs/documentar.mjs verificar           # falla si algo está roto o sin enlazar
node scripts/docs/documentar.mjs verificar --base <commit>   # y exige subir la versión de lo que cambió
```

Necesita Node 20 o más y no tiene dependencias, y se puede correr desde cualquier carpeta: la raíz la
calcula el propio script. Si los repositorios de código están al lado —`../backend-api`,
`../backend-db` y `../frontend-flutter`, como en la carpeta de trabajo del [ADR-035](../../docs/adr/ADR-035-repositorios-hermanos.md)—, también revisa
sus README, sus `CLAUDE.md` y sus `AGENTS.md`.

## Archivos

| Archivo | Qué hace |
|---|---|
| `config.mjs` | Repositorios, estados, etiquetas, familias de identificadores y parámetros del calendario. Si cambia algo aquí, cambia [`docs/22-documentacion.md`](../../docs/22-documentacion.md) en el mismo commit |
| `markdown.mjs` | Anclas con el mismo algoritmo de GitHub, separación de código y enlaces, encabezados y bloques generados |
| `plan.mjs` | El plan como grafo de dependencias: oleadas, camino crítico, calendario con 1, 2 y 3 tareas a la vez, y el tablero por sprint |
| `documentar.mjs` | La orden: junta todo, escribe o verifica |

## Cuando la verificación falla

| Mensaje | Qué hacer |
|---|---|
| «faltan anclas, enlaces o bloques generados» | Correr `enlazar` y hacer commit de lo que cambie |
| «no lleva a ningún sitio» | La referencia apunta a una sección, un ADR o un identificador que no existe: corregir el texto |
| «apunta a un ancla que no existe» | Un encabezado cambió de nombre o de número: corregir el enlace o el encabezado |
| «cambió el contenido y la versión sigue en…» | Subir la versión según [`docs/22-documentacion.md`](../../docs/22-documentacion.md) [§3](../../docs/22-documentacion.md#3-versiones) y poner la fecha de hoy |
| «el plan se bloquea» o «hay un ciclo de dependencias» | Revisar la columna «Depende de» de las tablas del plan |
| «depende de N, que es posterior» | [ADR-043](../../docs/adr/ADR-043-dependencias-solo-hacia-atras.md): una tarea solo depende de tareas anteriores. Renumerar con autorización de quien dirige, o declarar el par en `DEPENDENCIAS_HACIA_ADELANTE` de `config.mjs` con su motivo |
| «declara N → M y el plan ya no la tiene» | Se arregló una dependencia y la deuda quedó vieja: borrar ese par de `DEPENDENCIAS_HACIA_ADELANTE`. Esa lista solo se encoge |
| «no enumera N tareas del plan» | El plan tiene una tarea que el tablero no lista: agregarla a su sprint en [`TODO.md`](../../TODO.md) |
| «enumera tareas que el plan no tiene» | Al revés: una tarea del tablero no existe en el plan. Lo nuevo entra primero al plan ([08 §6](../../docs/08-plan-de-desarrollo.md#6-backlog-priorizado)) |
| «tiene su flujo en el `§2` y no tiene fila en el `§4`» | Un caso de uso detallado en [`docs/02-casos-de-uso.md`](../../docs/02-casos-de-uso.md) sin su fila de trazabilidad: decir cuándo entró, o dejarlo ⏭️ |
| «nombra un caso de uso que no está en el `§2`» | La fila de trazabilidad apunta a un CU que no existe: corregir el identificador |
| «lleva el estado «…», que no está en la leyenda» | Los estados de la trazabilidad son ✅, 🚧, ⏭️ y ⛔ |
| «se declara integrada y no dice con qué tarea entró» | Una fila ✅ de la trazabilidad nombra la tarea que la integró |
| «no tiene sección para el Sprint N» | El tablero lleva cada sprint a su sección de [`TODO.md`](../../TODO.md) y no la encontró: devolverle a su encabezado o a su línea en negrita el «Sprint N ·» del principio. Mientras tanto, el enlace va al plan |
