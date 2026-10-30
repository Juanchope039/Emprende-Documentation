# ADR-073 · Estar en el proyecto del tablero es recomendado, y se agrega a mano con el engranaje

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-073-el-proyecto-del-pr-es-recomendado.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-074](ADR-074-el-check-del-proyecto-se-quita.md) | 2026-10-26 | 2026-10-29 | [Proceso](../INDICE.md#etiqueta-proceso) |

> **Reemplazado por [ADR-074](ADR-074-el-check-del-proyecto-se-quita.md).** Estar en el tablero sigue siendo recomendado, pero el
> trabajo «El PR está en el proyecto» que este ADR conservaba avisando (punto 3) se quitó de los
> cuatro repositorios. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

El [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md) hizo obligatorio que todo PR a una rama principal estuviera en «Prisma project», el
proyecto 4 de `Juanchope039`, y el [ADR-065](ADR-065-el-check-del-proyecto-avisa.md) dejó el check en advertencia pero mantuvo la regla en
pie: el PR seguía debiendo estar en el tablero, y la definición de rama seguía pidiendo el check por
su nombre. Nueve días después eso tampoco se sostiene.

- **La regla no la cumple quien abre el PR.** Una sesión de agente en la nube no alcanza los
  proyectos: `gh project` contesta `unknown owner type` y `gh api graphql` responde 403. Así que la
  regla recaía siempre en quien dirige, que es justamente quien ya está en el panel del PR.
- **Y ahí se hace en un clic**: el engranaje de *Projects*, en la barra lateral del PR, y elegir
  «Prisma project». No hace falta una regla para eso.
- **Mientras el check siguió exigido por nombre**, cada PR arrastraba un check más que hay que mirar
  y que no dice nada del código que entra, y un token que al vencer deja a todos avisando lo mismo.
- **Lo que el tablero necesita de verdad es el auto-add del proyecto**, que no es una puerta del PR.

Quien dirige lo pidió el 2026-10-26: estar en el proyecto ya no es obligatorio en un PR.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejarlo como lo puso el [ADR-065](ADR-065-el-check-del-proyecto-avisa.md) | Nada que cambiar, y la definición ya estaba puesta | La regla manda algo que quien abre el PR no puede hacer, y el check exigido se mira sin leerse |
| Quitar el flujo `proyecto-del-pr.yml` | Un trabajo menos y un secreto menos | Perdería el aviso, y una puerta que no se quiere no se borra: se vuelve advertencia ([ADR-065](ADR-065-el-check-del-proyecto-avisa.md)) |
| **Recomendado, y el check sale de las reglas de rama** | El tablero se sigue pidiendo donde se hace, en el panel del PR, y el aviso queda | Un PR puede entrar sin estar en el tablero sin que nada lo cuente más que el aviso |

## Decisión

1. **Estar en «Prisma project» es recomendado, no obligatorio.** Un PR no está mal formado por no
   estar en el tablero, y ninguna puerta lo pide.
2. **Se agrega a mano, con el engranaje de *Projects*** en la barra lateral del PR, eligiendo
   «Prisma project». Lo hace quien dirige, cuando quiere el PR en el tablero.
3. **El flujo `proyecto-del-pr.yml` se queda y sigue avisando en verde**, como lo dejó el
   [ADR-065](ADR-065-el-check-del-proyecto-avisa.md): una puerta que no se quiere bloqueante se vuelve advertencia, no se borra.
4. **El check sale de las reglas de rama**: `pr-en-el-proyecto` queda en `false` en los cinco
   repositorios de `politicas-de-ramas.json`, y el nombre se conserva en `puertas` para el día que
   vuelva a hacer falta.
5. **El milestone y el issue no cambian**: el [ADR-063](ADR-063-todo-issue-y-todo-pr-lleva-milestone.md) y el [ADR-060](ADR-060-todo-pr-se-asocia-a-un-issue.md) siguen siendo obligatorios, y sus
   dos checks siguen exigidos.
6. **`campos-del-proyecto.yml` no cambia.** No es una puerta: agrega el PR si el auto-add no lo
   hizo, le pone `Status` y avisa en verde.

## Justificación

Una regla del proceso tiene que poder cumplirla quien hace el trabajo. Esta no: los proyectos solo
se escriben por GraphQL, y la sesión que abre el PR no llega. Lo único que quedaba era el recordatorio
a quien ya tiene el panel abierto, y para eso el aviso del flujo alcanza. Sacar el check de las
reglas de rama no quita nada que estuviera juzgando el código: quita un check verde de adorno.

## Consecuencias

- **Positivas:** un PR menos cargado de checks que no son suyos, y una regla menos que la skill `pr`
  no puede cumplir. Un token vencido deja de verse en todos los PR a la vez.
- **Negativas:** el tablero cuenta menos PR de los que entran, y recordarlo depende del aviso del
  flujo y del auto-add.
- **A vigilar:** si el tablero se queda vacío de PR, lo que hay que arreglar es el auto-add del
  proyecto, no volver a exigir el check.

## Referencias

- [ADR-065](ADR-065-el-check-del-proyecto-avisa.md), que este reemplaza, y [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md), de donde venía la regla.
- [ADR-063](ADR-063-todo-issue-y-todo-pr-lleva-milestone.md) y [ADR-060](ADR-060-todo-pr-se-asocia-a-un-issue.md), que siguen obligatorios.
- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), cuyos rulesets ya no nombran este check.
- [`scripts/github/README.md`](../../scripts/github/README.md), con el secreto y el auto-add.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-065](ADR-065-el-check-del-proyecto-avisa.md "ADR-065 · El check del proyecto avisa y no bloquea") · [ADR-074](ADR-074-el-check-del-proyecto-se-quita.md "ADR-074 · El check del proyecto se quita de los cuatro repositorios") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
