# ADR-068 · Los sprints del 0 al 10 están cerrados, y una tarea nueva abre un sprint nuevo

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-068-los-sprints-cerrados-no-reciben-tareas.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-17 | 2026-10-17 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El plan tiene once sprints, del 0 al 10, con 174 tareas. **Y han venido creciendo por dentro.** Una
tarea que apareció después de que su sprint ya estaba entregado se escribía al final de la tabla de
ese sprint, porque era el sitio donde encajaba por tema.

Eso tiene tres precios, y los tres ya se pagaron:

- **El número del sprint deja de decir cuándo se entregó algo.** Un sprint entregado que recibe una
  tarea nueva pasa a contener trabajo que no estaba cuando se cerró.
- **Las dependencias hacia adelante.** Una tarea nueva al final de un sprint viejo es, casi siempre,
  una tarea que necesita algo posterior, y eso es exactamente lo que el [ADR-043](ADR-043-dependencias-solo-hacia-atras.md) prohíbe. La lista
  de deuda declarada de `config.mjs` existe por esto, y solo se encoge.
- **El calendario y las oleadas se mueven hacia atrás.** Agregar días a un sprint ya entregado
  cambia el cálculo de todo lo que venía después, que ya ocurrió.

Quien dirige lo pidió el 2026-10-17: los sprints del 0 al 10 quedan cerrados, y se abren sprints
nuevos según haga falta.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Seguir agregando al sprint del tema | La tarea queda al lado de lo suyo, y se encuentra leyendo | El número del sprint miente, y cada tarea nueva es una dependencia hacia adelante |
| Renumerar el plan cada vez | Todo quedaría en orden de verdad | Rompe los enlaces, los nombres de rama, los asuntos de commit y las filas del tablero, que llevan el número |
| **Cerrar del 0 al 10 y abrir sprints nuevos** | El número vuelve a decir cuándo; lo nuevo depende de lo anterior sin esfuerzo | El tema queda repartido: una tarea de movimientos puede estar en el [Sprint 3](../08-plan-de-desarrollo.md#sprint-3) y en el 11 |

## Decisión

1. **Los sprints del 0 al 10 están cerrados.** No se les agrega ninguna tarea, ni al final de su
   tabla ni en medio.
2. **Lo que haga falta entra en un sprint nuevo**, el siguiente al mayor. El primero disponible es el
   **Sprint 11**.
3. **Abrir un sprint nuevo lo autoriza quien dirige**, como cualquier cambio de la forma del plan.
   Al abrirlo, el anterior se cierra con la cuenta de tareas que tenga.
4. **Una tarea de un sprint cerrado sí se puede corregir**: su texto, sus días, su `Dónde` o sus
   dependencias. Lo que no se puede es agregar una fila.
5. **La cuenta de cada sprint cerrado está en `scripts/docs/config.mjs`**, en `SPRINTS_CERRADOS`, y
   `verificar` compara esa tabla con las del plan. Una fila de más en un sprint cerrado pone el PR en
   rojo, con el número de las que sobran.

## Justificación

Un sprint es un orden de entrega, y eso solo se sostiene si lo que contiene es lo que se entregó. La
guarda va por la cuenta y no por la lista de ids porque es lo que distingue el caso que importa
—una fila nueva— del que no —corregir una fila que ya estaba—, y porque una lista de 174 ids en la
configuración envejece en cada corrección.

## Consecuencias

- **Positivas:** el número del sprint vuelve a decir cuándo; una tarea nueva depende de lo anterior
  sin que haya que pensarlo; y el calendario de lo ya entregado deja de moverse.
- **Negativas:** un tema queda repartido entre un sprint cerrado y uno nuevo, así que para ver todo
  lo de movimientos hay que mirar en dos sitios. El tablero sigue listándolo por sprint.
- **A vigilar:** que un sprint nuevo no se vuelva un cajón de sastre. Si recibe tareas de cinco
  temas distintos, lo que falta es decidir qué se entrega en él, no otro sprint.

## Referencias

- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md) [§3](../08-plan-de-desarrollo.md#3-sprints), donde están los sprints.
- [ADR-043](ADR-043-dependencias-solo-hacia-atras.md), que es la regla que esto deja de forzar.
- [ADR-067](ADR-067-el-plan-no-tiene-carriles.md), que entró con este.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
