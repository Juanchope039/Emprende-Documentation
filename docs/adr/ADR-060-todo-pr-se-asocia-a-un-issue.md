# ADR-060 · Todo PR se asocia a un issue del monorepo de producto

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-060-todo-pr-se-asocia-a-un-issue.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-15 | 2026-10-15 | — |

## Contexto

Lo que falta por hacer se anota en issues de `Juanchope039/PRISMA`, y en ningún otro repositorio:
épicas, features e historias, con sus puntos, en el proyecto 4 (`.github/ISSUES.md` del
monorepo). Los PR, en cambio, se abrían sin decir a qué issue respondían. Un PR podía cerrar trabajo
anotado sin que el issue se enterara, y un issue podía quedar abierto con su trabajo ya fusionado.
Quien dirige pidió el 2026-10-15 que cada PR se asocie a su issue.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Seguir como estaba | Nada nuevo que hacer | El tablero y los PR cuentan historias distintas |
| Issues en cada repositorio | `Closes #n` cierra solo en todos | Cuatro tableros, y quien dirige decidió que los de desarrollo no reciben issues |
| **Todo PR nombra su issue de PRISMA** | Un solo tablero, y cada PR dice qué trabajo cierra | Fuera del monorepo el issue se cierra a mano |

## Decisión

1. **Todo PR, en cualquiera de los cinco repositorios, nombra el issue de `Juanchope039/PRISMA` al
   que responde.** Sin issue no se abre el PR: primero se crea, con la skill `issue` del monorepo.
2. **En el monorepo, el cuerpo lleva `Closes #n`**, y GitHub lo cierra al fusionar.
3. **En los otros cuatro, lleva `Refs Juanchope039/PRISMA#n`.** El PR de un repositorio no puede
   cerrar un issue de otro, así que el issue se cierra cuando el cambio llega al monorepo.
4. Los PR hermanos de una misma rama nombran el mismo issue.

## Justificación

El tablero es la fuente de lo que falta, y el PR la de lo que se hizo. Atarlos por un número deja
ver desde cualquiera de los dos qué pasó con el otro, sin buscar.

## Consecuencias

- **Positivas:** cada PR se puede rastrear hasta su historia y sus puntos.
- **Negativas:** un arreglo de una línea también pide su issue.
- **A vigilar:** los issues de cambios fuera del monorepo, que se cierran a mano.

## Referencias

- [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md), el PR se abre con autorización.
- La skill `pr`, que lo aplica paso a paso.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-063](ADR-063-todo-issue-y-todo-pr-lleva-milestone.md "ADR-063 · Todo issue y todo PR lleva milestone, con los mismos milestones en los cinco repositorios") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
