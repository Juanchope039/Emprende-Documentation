# ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.2](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-058-el-monorepo-no-va-adelante-de-develop.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-14 | 2026-10-30 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El monorepo de producto, `Juanchope039/PRISMA`, lleva los cuatro repositorios de desarrollo como
subárboles de git: `backend-api/`, `database/`, `frontend-flutter/` y `documentation/`
([ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md)). Es lo que reciben los emprendimientos, y ahí se fusionan PR propios del
producto, en `.github/` y en sus guías.

Nada impedía que un PR del monorepo cambiara también un archivo de un subárbol. Ese cambio no
pasaría por la tubería de su repositorio, y la siguiente vez que se trajera el subárbol se
perdería o chocaría. Quien dirige pidió el 2026-10-14 que eso no pueda pasar: **lo que hay en
`main` del monorepo tiene que estar en `develop` de los repositorios; al revés, sí puede faltar**.

Esa misma fecha se auditó, por hash de árbol: los tres subárboles de código eran idénticos a la
punta de `develop` de su repositorio, y `documentation/` era un commit de `main` de la
especificación que iba cuatro commits atrás.

Comparar historias habría dado otro resultado. Los subárboles se traen desde `main` de cada
repositorio, y los merges de las etapas que viven en `main` no son ancestros de `develop`, aunque
traigan exactamente el mismo contenido.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **El árbol de cada subárbol es el de algún commit de la base, y la CI del monorepo lo exige** (la decisión) | Permite que la base vaya adelante. Compara contenido, así que no se confunde con los merges de las etapas. Bloquea el PR antes de fusionar | Necesita un token de lectura de los tres repositorios privados |
| Igual a la punta de `develop` y de `main` | Más simple de comprobar | Prohíbe lo que se permite: cada empuje a `develop` pondría el monorepo en rojo |
| El commit del subárbol es ancestro de `develop` | Usa la marca `git-subtree-split` | Falla hoy con los cuatro sincronizados, porque esos commits son merges de `main` |
| Vigilarlo desde `emprende_db` | Ya tiene un token de lectura de la API y del front | Solo lo ve después de fusionar: no bloquea nada |
| Solo la regla escrita, sin comprobación | Nada que mantener | La primera vez que se olvide nadie lo nota |

## Decisión

1. **Cada subárbol del monorepo tiene exactamente el árbol de algún commit de `develop` y de
   `main` de su repositorio**, en `emprende_api`, `emprende_db` y `emprende_front`, y de `main` en la
   especificación, que no tiene `develop`. Es el último paso de develop → qa → main → `main` del
   monorepo: las bases pueden ir adelante; el monorepo, nunca.
2. **Lo de fuera de las cuatro carpetas es del producto y queda fuera de la regla**: `.github/`,
   `.claude/`, `DEPLOY.md`, `README.md`, `.env.ejemplo`, `LICENSE`, `.gitignore`, y lo que la
   entrega deje en `entrega/`, `api/` y `front/`.
3. **Lo exige el flujo «Sincronia» del monorepo**, `.github/workflows/sincronia.yml` con
   `.github/scripts/sincronia.sh`, en cada PR y cada empuje a `main`. Si un árbol no está, falla
   y lista los archivos que difieren de la punta de la base. Termina en la puerta «Tubería en
   verde», y `main` del monorepo entra en las reglas del [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md): no se borra, y sin esa
   puerta en verde no se fusiona.
4. **Lee desarrollo con `PRISMA_DESARROLLO_TOKEN`**, de solo lectura y solo en el monorepo del
   producto. No es `PRISMA_PRODUCTO_TOKEN`, que tienen los emprendimientos. Sin él, el flujo se
   salta con aviso, que es lo que pasa en cada copia.
5. **Un arreglo que haga falta en un subárbol entra primero por PR a la base de su repositorio**,
   y llega al monorepo con el siguiente subárbol que se traiga.

## Justificación

**El monorepo es una copia, no un origen.** Lo que se escribe directamente en él no pasó ni la
batería de su repositorio ni las etapas, y es justo lo que reciben los emprendimientos.

**Se compara el contenido porque es lo que importa.** Que un árbol esté en la historia de
`develop` quiere decir que alguna vez `develop` fue exactamente eso, y por lo tanto pasó su
tubería. Que la punta sea otra solo dice que `develop` siguió.

## Consecuencias

**Positivas**

- Un cambio hecho a mano en un subárbol no llega a `main` del monorepo.
- La auditoría que se hizo a mano queda corriendo en cada PR.

**Negativas**

- Un token más que crear y renovar, con lectura de tres repositorios privados.
- Un arreglo urgente en un subárbol tarda lo que tarde su PR en la base.

**A vigilar**

- **Que el token no venza en silencio.** Sin él el flujo pasa con aviso: un PR con el resumen
  vacío es la señal.
- **Que no aparezca una quinta carpeta de desarrollo** sin su fila en el guion.

## Referencias

- [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md), que pone los subárboles y deja `.github/` al producto.
- [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md), que dice cómo entra un cambio a `develop`.
- [ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md), por qué los repositorios de código siguen privados y hace falta el token.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-061](ADR-061-se-promueve-con-merge-commit.md "ADR-061 · Se promueve con merge commit, y qa no recibe nada que no esté en develop") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
