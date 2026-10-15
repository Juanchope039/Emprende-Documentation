# ADR-050 · `main` vuelve a ser la última etapa, y `pre-prod` entra en ella por PR

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.2.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-05 | 2026-10-14 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

> **Lo modifica [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md):** a `main` entra `uat` por PR, no `pre-prod`, que se quitó. `main` sigue
> siendo la última etapa y sigue comprobando que el árbol es el que compiló qa, sin construir, sin
> publicar y sin desplegar. El cuerpo de abajo se conserva tal como se escribió.

> **Lo modifica [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md):** la rama `uat` sale, y a `main` entra `qa` por PR, antes de que
> Gerencia mire, porque de `main` sale lo que el monorepo lleva al uat alojado. `main` corre lo
> que corría la etapa uat. Lo aprobado es la etiqueta `entrega-vN`, no la rama.

## Contexto

El [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) dejó la cadena de ramas en **develop → qa → uat → pre-prod** y dijo que `main`
dejaba de ser una etapa: seguía siendo la rama por defecto, pero nada llegaba a ella por la
tubería. El [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md) igual la protegió con «Tubería en verde», y los flujos ya corrían en el PR a
`main`, pero no la trataban como etapa.

Quien dirige lo corrigió el 2026-10-05: **el ciclo es develop → qa → uat → pre-prod → main**, y
`pre-prod` entra en `main` por PR.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **`main` es la quinta etapa, y comprueba lo mismo que `pre-prod`** (la decisión) | Lo que Gerencia aprobó en pre-prod queda en la rama por defecto, con la misma comprobación de que el árbol es el que compiló qa | Una etapa más que no despliega |
| **`main` marca además el release con una etiqueta** | El release queda nombrado | Nadie lo pidió, y la etiqueta de prod ya es de la entrega ([9.15](../08-plan-de-desarrollo.md#tarea-9-15)) |
| **`main` dispara la entrega a prod** | Una etapa con oficio propio | Es la decisión de la 9.15, que todavía no se ha tomado: qué repositorio, qué recibe y quién la dispara |
| **Dejar `main` fuera, como decía el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md)** | Nada que cambiar | Es lo que se pidió cambiar |

## Decisión

1. **La cadena es develop → qa → uat → pre-prod → main**, cada una por PR desde la anterior.
2. **En `main` la CI comprueba que el árbol es el que compiló qa**, igual que en `pre-prod`, en el PR
   y en el empuje que deja su fusión. No construye, no publica y no despliega.
3. **No se marca ninguna imagen con `main`.** La etiqueta de prod la pone la entrega.
4. **Lo demás del [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) sigue igual**: Railway construye pre-prod desde la rama `pre-prod`.
5. **`prisma_db` no cambia**: su CI ya corre en el PR a `pre-prod` y a `main`, y no en el empuje.

## Justificación

La rama por defecto es la que cualquiera abre primero. Que tenga lo último que Gerencia aprobó, y
que llegue ahí por el mismo camino que todo lo demás, hace que lo que se ve en `main` sea lo que
corre en pre-prod. Darle a `main` algo más que esa comprobación sería decidir la 9.15 por la
puerta de atrás.

## Consecuencias

**Positivas**

- `main` vuelve a decir algo: es lo último aprobado.
- La cadena tiene una sola forma, cinco ramas y cuatro PR.

**Negativas**

- Un PR más por release, de `pre-prod` a `main`.

**A vigilar**

- Cuando se decida la 9.15, la entrega puede salir de `main` y no de `pre-prod`: se dice entonces,
  en su ADR.

## Referencias

- [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md), que este modifica.
- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), que protege las cinco ramas.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§6.3](../19-ambientes-y-entrega.md#63-las-tres-etapas-cada-una-más-exhaustiva), donde viven las etapas.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md "ADR-046 · pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado") · [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md "ADR-055 · uat se despliega desde main del monorepo de producto, y lo aprobado es solo la etiqueta")
<!-- /generado:referenciado-desde -->
