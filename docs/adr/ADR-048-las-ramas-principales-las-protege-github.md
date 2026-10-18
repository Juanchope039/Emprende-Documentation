# ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.3.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-048-las-ramas-principales-las-protege-github.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-05 | 2026-10-15 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

> **Lo modifica [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md):** las ramas principales son **cuatro**, no cinco: `pre-prod` se quitó.
> `develop` sigue pidiendo «Tubería completa» y las otras tres, «Tubería en verde». El cuerpo de
> abajo se conserva tal como se escribió.
>
> **Nota del 2026-10-14:** la cuenta pasó a GitHub Pro, así que lo que las consecuencias dan
> por bloqueado ya no lo está: los tres privados admiten reglas de rama y se pueden aplicar.
> Falta aplicarlas. La decisión de no publicar ningún repositorio no cambia ([ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)).

> **Lo modifica [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md):** las ramas principales son **tres**: `uat` sale, y su
> etapa la corre `main`. `develop` sigue pidiendo «Tubería completa», y `qa` y `main`, «Tubería en
> verde». El cuerpo de abajo se conserva tal como se escribió.

## Contexto

El proyecto tiene cinco ramas principales en cada repositorio de código —`develop`, `qa`, `uat`,
`pre-prod` y `main`— y la cadena de promoción del [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) las recorre en ese orden. La
especificación no tiene `develop`: su base es `main` ([21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración)).

Hasta hoy las tres cosas que las cuidan están escritas y no impuestas: que esas ramas no se mueven
por cuenta propia, que el PR se abre con autorización ([ADR-040](ADR-040-rama-feature-y-pr-autorizado.md)) y que la puerta para fusionar es
que la tubería termine en verde ([19 §6.1](../19-ambientes-y-entrega.md#61-en-cada-empuje-en-paralelo)). Ninguna rama está protegida en GitHub: un
`git push --delete` borra `develop`, y el botón de fusionar no mira la tubería.

Quien dirige lo pidió el 2026-10-05, con una asimetría a propósito: **a `develop` basta con que la
tubería haya terminado, aunque haya terminado mal**, porque es la rama de integración diaria y
parar el trabajo de un carril por un trabajo rojo cuesta más de lo que protege; **a las otras cuatro
la tubería tiene que estar en verde**, porque de ahí sale lo que se despliega.

Y una restricción técnica que decide la forma de la solución: **GitHub no tiene la opción «el check
terminó, sin importar cómo»**. Un check exigido solo cuenta si termina en verde.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **Dos trabajos puerta, y la protección exige uno u otro** (la decisión) | Dice exactamente lo que se pidió: «terminó» y «terminó bien» son dos checks con dos nombres. La lista de trabajos puede cambiar sin tocar la protección | Dos trabajos más por ejecución, y un nombre que hay que mantener igual en el flujo y en la definición |
| **Exigir los nombres de los trabajos de hoy** | Nada que agregar a la tubería | No existe «terminó mal pero terminó», así que no sirve para `develop`. Y un trabajo que GitHub salta reporta `skipped`, que la protección cuenta como pasado: la puerta mentiría |
| **No exigir nada en `develop`, y solo PR** | Más simple | No obliga a que la tubería corra: un PR fusionado antes de que arranque pasaría sin que nadie la vea |
| **Un solo trabajo puerta que cambie de resultado según la rama destino** | Un trabajo, no dos | El nombre del check sería el mismo, y la protección solo ve el nombre: `develop` no podría pedir algo distinto que `qa` |
| **Que lo revise una persona en cada PR** | Cero configuración | Es lo que ya hay, y es lo que falló: una regla que depende de que alguien se acuerde no se cumple ([ADR-027](ADR-027-documentacion-versionada.md)) |

## Decisión

1. **Las cinco ramas principales no se pueden borrar**, en ninguno de los cuatro repositorios, y
   nadie queda con excusa: la lista de omisión va vacía.
2. **A las cinco se entra solo por PR.** Sin aprobaciones obligatorias: el repositorio es de una
   persona, y GitHub no deja aprobar el propio PR.
3. **A `develop` se entra con la tubería terminada**, en verde o en rojo. Lo exige el check
   **Tubería completa**.
4. **A `qa`, `uat`, `pre-prod` y `main` se entra con la tubería en verde.** Lo exige el check
   **Tubería en verde**, que falla si algún trabajo quedó en `failure` o `cancelled`. Un trabajo que
   la tubería salta no la rompe.
5. **Las dos puertas son trabajos del `ci.yml`** de cada repositorio —y del `documentacion.yml` de
   la especificación—, al final y dependiendo de todos los demás, con `if: always()` para que
   existan aunque algo falle. **Por eso `main` entra en los disparadores de los cuatro flujos**: un
   check exigido que nunca se reporta deja el PR bloqueado para siempre.
6. **La definición vive en `scripts/github/politicas-de-ramas.json`** y la pone
   `politicas-de-ramas.mjs`, con `verificar` y `aplicar`. No se configura a mano en el panel, salvo
   como salida de emergencia, que el README de esa carpeta explica.

## Justificación

**La asimetría es la de los dos oficios de las ramas.** `develop` integra: lo que entra ahí todavía
se puede arreglar, y lo arregla el siguiente commit del día. `qa`, `uat`, `pre-prod` y `main`
entregan: lo que entra ahí se despliega o se publica, y una tubería roja en una de ellas es un
ambiente roto.

**Dos checks y no uno, porque la protección solo ve el nombre.** Es la única forma de que dos ramas
pidan cosas distintas de la misma tubería.

**Y una puerta en vez de la lista de trabajos**, porque la lista cambia con cada tarea y porque un
trabajo saltado cuenta como pasado: exigir «La versión subió» en `qa`, donde no corre, sería exigir
algo que siempre se cumple sin comprobar nada.

**Sin actores con excusa.** Una excepción que existe se usa, y el día que haga falta de verdad se
agrega con su ADR, que es más barato que descubrir que la protección no protegía.

## Consecuencias

**Positivas**

- Ninguna de las cinco ramas se borra, ni por accidente ni con un `--force`.
- La tubería deja de ser una costumbre: sin ella, el botón de fusionar no está.
- Las políticas se leen en un archivo versionado y se comparan con lo que hay, en vez de vivir solo
  en el panel de una cuenta.

**Negativas**

- **Hoy solo se pueden aplicar en la especificación.** Los tres repositorios de código son privados
  en el plan Free, donde GitHub no ofrece reglas de rama: contesta `403 Upgrade to GitHub Pro or
  make this repository public`. Mientras no se resuelva, en ellos la protección sigue siendo la
  costumbre, y la herramienta lo dice cada vez que corre.
- Dos trabajos más por ejecución en cada repositorio, de unos segundos cada uno.
- Un nombre de check que tiene que decir lo mismo en el flujo y en la definición. Si alguien
  renombra el trabajo, los PR se quedan esperando un check que ya no existe.

**A vigilar**

- **En un PR a `main` o a `pre-prod`, la tubería de `prisma_db` no corre hoy ningún trabajo**: sus
  dos trabajos son solo para `develop`, `qa` y `uat`. La puerta queda en verde sin haber comprobado
  nada. Está anotado en [`TODO.md`](../../TODO.md) [§10](../../TODO.md#10-decisiones-de-construcción-que-conviene-revisar).
- Si una rama nueva se vuelve principal, hay que agregarla a la definición: la protección no la
  adivina.

## Referencias

- [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md), la rama `feature/…` y el PR autorizado, que esto hace exigible.
- [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md), la cadena de ramas que recorre la promoción.
- [21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración), el ciclo de una tarea, y [19 §6.1](../19-ambientes-y-entrega.md#61-en-cada-empuje-en-paralelo), los trabajos de la tubería.
- `scripts/github/README.md`, cómo se aplica y qué hace falta para poder aplicarlo.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md "ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR") · [ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md "ADR-051 · La visibilidad de un repositorio no se cambia") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado") · [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md "ADR-055 · uat se despliega desde main del monorepo de producto, y lo aprobado es solo la etiqueta") · [ADR-058](ADR-058-el-monorepo-no-va-adelante-de-develop.md "ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop") · [ADR-061](ADR-061-se-promueve-con-merge-commit.md "ADR-061 · Se promueve con merge commit, y qa no recibe nada que no esté en develop") · [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md "ADR-062 · Todo PR a una rama principal está en el proyecto del tablero, y un check lo exige") · [ADR-063](ADR-063-todo-issue-y-todo-pr-lleva-milestone.md "ADR-063 · Todo issue y todo PR lleva milestone, con los mismos milestones en los cinco repositorios") · [ADR-065](ADR-065-el-check-del-proyecto-avisa.md "ADR-065 · El check del proyecto avisa y no bloquea") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive") · [AGENTS](../../AGENTS.md "AGENTS.md") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
