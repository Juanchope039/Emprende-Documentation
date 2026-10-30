# ADR-063 · Todo issue y todo PR lleva milestone, con los mismos milestones en los cinco repositorios

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-063-todo-issue-y-todo-pr-lleva-milestone.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-15 | 2026-10-15 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El tablero dice qué falta y el [ADR-060](ADR-060-todo-pr-se-asocia-a-un-issue.md) ata cada PR a su issue, pero nada decía a qué
entrega pertenece cada cosa. Quien dirige pidió el 2026-10-15 que todo issue y todo PR se asocie a
un milestone, con dos para empezar: el primero, todo lo ya construido; el segundo, desplegar desde
GHCR, las apps de Android, iOS y Windows, y el plan de los pedidos por chatbots de WhatsApp.

Los milestones de GitHub son **por repositorio**: un PR del front no puede llevar un milestone del
monorepo, y los issues solo viven en `Juanchope039/PRISMA` ([ADR-060](ADR-060-todo-pr-se-asocia-a-un-issue.md)).

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Milestone solo en el issue, y el PR lo hereda por su `Refs` | Un solo sitio que mantener | El PR no lo muestra, y no se puede filtrar ni exigir por check |
| Un proyecto o un campo del tablero en vez de milestones | Cruza repositorios | Lo que no se puede escribir desde la nube (GraphQL bloqueado), y no es lo que se pidió |
| **Los mismos milestones en los cinco repositorios** | Cada PR lleva el suyo y un check lo exige con `GITHUB_TOKEN` | Crear o cerrar un milestone son cinco pasos |

## Decisión

1. **Todo issue de `Juanchope039/PRISMA` lleva milestone.** La skill `issue` lo pide en el
   borrador y `subir.py` no sube uno sin él.
2. **Todo PR, en cualquiera de los cinco repositorios, lleva milestone**: el del issue que nombra.
   Si su issue no tiene, se le pone primero al issue.
3. **Los cinco repositorios tienen los mismos milestones, con el mismo número y el mismo título.**
   Uno nuevo se crea en los cinco a la vez, y se cierra en los cinco cuando no le queda nada
   abierto. Qué milestones hay lo decide quien dirige.
4. **Lo exige el check «El PR tiene milestone»** (`.github/workflows/milestone-del-pr.yml`) en los
   cinco, y las reglas de rama lo exigen. En el monorepo solo corre en el de `Juanchope039`: las copias de los emprendimientos no
   heredan la regla.
5. **Los dos primeros**, creados el 2026-10-15:
   - **M1 · Lo construido**: todo lo implementado hasta esa fecha, con todos los PR fusionados de
     los cinco repositorios;
   - **M2 · GHCR, apps nativas y WhatsApp**: desplegar desde la imagen de GHCR sin recompilar, los
     artefactos de Android, iOS y Windows, y el plan de los pedidos por WhatsApp, que se construye
     después.

## Justificación

El milestone responde «¿esto entra en qué entrega?» desde el issue y desde el PR, sin abrir el
otro. Repetirlo en los cinco es lo único que deja al PR mostrarlo y a un check exigirlo con el token
que ya trae la tubería.

## Consecuencias

- **Positivas:** cada entrega cuenta su avance en GitHub, por repositorio y en el tablero.
- **Negativas:** un milestone nuevo son cinco altas; si una falta, el PR de ese repositorio no
  encuentra el suyo.
- **A vigilar:** que los títulos sigan iguales en los cinco. El check entra en
  `politicas-de-ramas.json` junto al del [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md), y se exige cuando quien dirige vuelve a correr
  `aplicar` después de fusionar este cambio en los cinco.

## Referencias

- [ADR-060](ADR-060-todo-pr-se-asocia-a-un-issue.md), todo PR se asocia a un issue.
- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), las reglas de rama.
- Las skills `pr` de esta especificación e `issue` del monorepo, que lo aplican paso a paso.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md "ADR-073 · Estar en el proyecto del tablero es recomendado, y se agrega a mano con el engranaje") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
