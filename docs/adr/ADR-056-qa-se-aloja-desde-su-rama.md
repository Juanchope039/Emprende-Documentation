# ADR-056 · qa también se aloja en Railway, construido desde la rama `qa`

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.2](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-056-qa-se-aloja-desde-su-rama.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-14 | 2026-10-30 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El [ADR-044](ADR-044-dos-ambientes-desplegados.md) dejó qa como una etapa de la tubería que no despliega, y el [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) dejó alojados
solo dev y uat. Pero el proyecto de Railway ya tenía un ambiente para qa, y sus dos servicios se
construían desde la rama `develop`: qa mostraba lo mismo que dev, no lo que había pasado la etapa.

Quien dirige lo decidió el 2026-10-14, y lo dejó hecho en el panel: **el ambiente de qa en Railway
construye la API y el front desde la rama `qa`** de cada repositorio.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **qa alojado y construido desde la rama `qa`** (la decisión) | Lo que se ve en qa es lo que pasó la etapa qa. Cada ambiente alojado sale de su propia rama, como dev y uat | Un ambiente más que se paga y que se mira |
| qa alojado y construido desde `develop` | Nada que cambiar en el panel | qa repite a dev y no muestra lo promovido |
| Sostener el [ADR-044](ADR-044-dos-ambientes-desplegados.md): qa sin alojar | Un ambiente menos | Quien dirige lo quiere ver en línea, y el ambiente ya existe |

## Decisión

1. **Railway construye el ambiente de qa desde la rama `qa`** de `emprende_api` y de `emprende_front`,
   cuando la integración continua de ese empuje termina en verde.
2. **Se despliegan tres ambientes de este proyecto**: dev desde `develop`, qa desde `qa` y uat
   desde el monorepo de producto ([ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md)).
3. **La etapa qa no cambia**: sigue compilando el artefacto de prod una vez y publicándolo en
   GHCR. Lo que Railway construye en qa es otra compilación, como la de dev, y no lo que llega a
   prod.
4. **Las migraciones de qa siguen su camino**: `promover.ps1 -Ambiente qa` desde `emprende_db`, antes
   de fusionar en `qa` la API que las necesita.

## Justificación

**Un ambiente alojado muestra la rama de su etapa.** Con `develop` detrás, qa era una segunda copia
de dev. Con `qa` detrás, enseña lo que pasó la etapa, antes de que suba a uat.

## Consecuencias

**Positivas**

- Lo promovido a qa se puede abrir en línea antes de llevarlo a uat.

**Negativas**

- Un ambiente más en la factura de Railway, y su base de Supabase vuelve a tener uso.

**A vigilar**

- **Que la base de qa vaya al día.** Si la API de `qa` pide un esquema que la base de qa no tiene,
  el ambiente no arranca.

## Referencias

- [ADR-044](ADR-044-dos-ambientes-desplegados.md), que este modifica en que qa no se despliega.
- [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md), que dejaba alojados solo dev y uat, y [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md), que ya nombra la rama de qa.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md), donde viven los ambientes y las etapas.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería")
<!-- /generado:referenciado-desde -->
