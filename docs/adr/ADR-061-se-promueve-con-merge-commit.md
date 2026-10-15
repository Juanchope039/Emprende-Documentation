# ADR-061 · Se promueve con merge commit, y qa no recibe nada que no esté en develop

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-061-se-promueve-con-merge-commit.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-15 | 2026-10-15 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

La cadena es develop → qa → main, cada paso por PR ([ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md)). Quien dirige preguntó el 2026-10-15
si había que abrir PR de `main` a `develop` para cerrar la diferencia de commits que GitHub muestra
entre las dos.

Esa misma fecha se auditó en los tres repositorios de código. `main` lleva commits que `develop` no
tiene: 21 en la API, 27 en el front y 16 en la base. Pero fusionar `main` en `develop` deja el
árbol idéntico al de `develop`. Lo que hay en `main` y no en `develop` es de dos clases:

- **Los commits de fusión de cada promoción.** Un PR que entra con merge commit crea uno nuevo en
  la rama que recibe. Es inevitable mientras a las etapas se entre solo por PR ([ADR-048](ADR-048-las-ramas-principales-las-protege-github.md)).
- **Commits escritos en `qa`**, casi todos entradas del `CHANGELOG.md`. El sentido de la promoción
  todavía los dejaba entrar si no tocaban otro archivo. Su contenido ya estaba en `develop`, y hoy el
  `CHANGELOG.md` de `develop` y el de `qa` son iguales en los tres repositorios.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Merge commit en las promociones, y nada propio en `qa`** (la decisión) | El contenido de cada etapa sale siempre de la anterior. La diferencia que queda son solo fusiones, sin archivos | GitHub sigue mostrando a `main` «adelante» de `develop` |
| PR de `main` a `develop` después de cada promoción | El contador queda en cero un momento | No cambia ni un archivo. La siguiente promoción crea dos fusiones nuevas, y el contador vuelve. Un arreglo hecho directo en `main` volvería a `develop` sin revisión |
| Promover con squash o rebase | Historia lineal en cada etapa | Reescribe los commits: las etapas quedan con historias distintas, y los conflictos vuelven en cada promoción |
| Empujar `develop` a `qa` en avance rápido, sin PR | Ninguna diferencia de commits | Las reglas de rama exigen PR, y sin PR no corre la tubería que lo juzga |

## Decisión

1. **A `qa` y a `main` se entra con merge commit, y GitHub no deja otro**: el ruleset «tubería en
   verde» de `scripts/github/politicas-de-ramas.json` lleva `allowed_merge_methods: ["merge"]`.
   Cubre `qa` y `main` de los tres repositorios de código, y `main` de la especificación y del
   monorepo de producto, que ya fusionan así. `develop` no cambia.
2. **A `qa` no entra nada que no esté en `develop`**, tampoco la entrada del changelog: llega por PR
   a `develop` antes de promover. `sentido-de-la-promocion.sh` deja de admitir el commit que solo
   toca `CHANGELOG.md`.
3. **No se abre PR de `main` a `develop`**, ni para sincronizar. Que `main` no traiga nada que
   `develop` no tenga se mide por contenido, como el [ADR-058](ADR-058-el-monorepo-no-va-adelante-de-develop.md), no por conteo de commits.

## Justificación

**Las fusiones de promoción no son diferencia.** Dicen cuándo entró cada cosa, y no traen ningún
archivo. Lo que importa es que una etapa no tenga contenido propio, y eso lo cierran las dos
puertas: la del sentido, que mira el PR, y las reglas de rama, que no dejan empujar sin PR.

**Una sola forma de fusionar en cada etapa evita que alguien elija otra por descuido.** Es la misma
idea del [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md): lo protege GitHub, no la costumbre.

## Consecuencias

**Positivas**

- El contenido de `qa` y de `main` siempre se puede rastrear hasta un commit de `develop`.
- No hace falta sincronizar hacia atrás, ni recordar hacerlo.

**Negativas**

- El contador «X commits adelante» de GitHub crece con cada promoción, y hay que saber leerlo.
- La entrada del changelog se escribe antes de promover, en su propio PR a `develop`.

**A vigilar**

- **Que el ruleset quede aplicado.** Lo pone `politicas-de-ramas.mjs aplicar` con el token de
  quien dirige. Hasta entonces, `verificar` lo marca «con otros parámetros».
- **Un arreglo urgente sigue el mismo camino**: `feature/…` → `develop` → `qa` → `main`. Si un día
  `develop` tiene algo que no puede salir, la rama de arreglo desde `main` necesita su propio ADR.

## Referencias

- [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md), cuyo punto 8 modifica en la excepción del changelog.
- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), cuyo ruleset de las etapas gana el método de fusión.
- [ADR-058](ADR-058-el-monorepo-no-va-adelante-de-develop.md), que mide por árbol lo mismo hacia el monorepo.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md "ADR-055 · uat se despliega desde main del monorepo de producto, y lo aprobado es solo la etiqueta") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
