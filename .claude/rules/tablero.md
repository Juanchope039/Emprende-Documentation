---
paths:
  - "TODO.md"
  - "docs/08-plan-de-desarrollo.md"
---

# Estás tocando el plan o el tablero

**Las reglas están en el `CLAUDE.md` del proyecto** y en el `AGENTS.md` §5. Lo que hay que tener
delante al editar estos dos archivos:

- **Los sprints del 0 al 10 están cerrados**: no reciben ninguna tarea. Agregar una fila deja el PR
  en rojo con la cuenta que sobra, y lo que haga falta abre un sprint nuevo, con autorización de
  quien dirige. Corregir una tarea que ya estaba sí se puede.
- **La cabecera de las tablas de tareas es `| # | Tarea | Dónde | Depende de | Días |`.** `plan.mjs`
  la lee tal cual: si se le cambia una palabra, no se lee ninguna tarea.
- **Los cinco valores de «Dónde»** son `API`, `Base`, `Front`, `Contrato` y `Decisión`, y el primero
  es el que lleva la tarea.
- **Una tarea nueva se escribe después de todo lo que necesita**: una dependencia hacia adelante
  hace que el número del sprint mienta.
- **El 08 y el `TODO.md` enumeran lo mismo**, y `verificar` falla si no coinciden. Al marcar `[x]` se
  corre `enlazar`, que rehace las marcas y las cuentas: esos bloques no se editan a mano.
