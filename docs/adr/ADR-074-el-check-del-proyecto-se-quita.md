# ADR-074 · El check del proyecto se quita de los cuatro repositorios

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-074-el-check-del-proyecto-se-quita.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-29 | 2026-10-30 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El [ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md) dejó estar en «Emprende project» como recomendado y sacó el check «El PR está en el
proyecto» de las reglas de rama, pero conservó el trabajo avisando en verde, porque el [ADR-065](ADR-065-el-check-del-proyecto-avisa.md)
decía que una puerta que no se quiere bloqueante se vuelve advertencia y no se borra.

Un aviso que no frena nada y que nadie tiene que atender sigue costando: un trabajo por PR que
espera hasta dos minutos al auto-add del proyecto, un secreto (`PRISMA_PROYECTO_TOKEN`) que hay
que renovar, y un check más en cada PR que no dice nada del código. Quien dirige pidió el
2026-10-29 quitarlo de los pipelines.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejarlo avisando en verde | El aviso queda a la vista | Un trabajo, una espera y un secreto por algo que ya no es regla |
| **Quitar el trabajo** | Un check y un secreto menos, y el PR no espera al tablero | Un PR fuera del tablero ya no deja rastro en la corrida |

## Decisión

1. **El trabajo «El PR está en el proyecto» se quita** de los cuatro repositorios: de
   `reglas-del-pr.yml` en `prisma_api`, `emprende_db` y `emprende_front`, y de esta especificación,
   donde se borra `proyecto-del-pr.yml`.
2. **Estar en el tablero sigue siendo recomendado**, como dice el [ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md): se agrega a mano con el
   engranaje de *Projects* del PR. Ninguna puerta ni ningún aviso lo mira.
3. **`PRISMA_PROYECTO_TOKEN` queda sin uso** en los repositorios de código. En esta
   especificación lo sigue usando `campos-del-proyecto.yml`, que no es una puerta.
4. **`politicas-de-ramas.json` no cambia**: `pr-en-el-proyecto` ya está en `false` desde el
   [ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md), y el nombre en `puertas` queda como historia.
5. **Este ADR reemplaza el punto 3 del [ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md) y lo que quedaba del [ADR-065](ADR-065-el-check-del-proyecto-avisa.md).**

## Justificación

El [ADR-065](ADR-065-el-check-del-proyecto-avisa.md) tenía razón mientras la regla existía: un aviso conservaba que se notara. Cuando la
regla dejó de existir ([ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md)), el aviso quedó vigilando algo que nadie exige, y su costo no
compra nada.

## Consecuencias

- **Positivas:** cada PR corre un trabajo menos, no espera al auto-add y no depende de un token.
- **Negativas:** un PR fuera del tablero no se nota en la corrida. Quien dirige lo ve en el tablero.
- **A vigilar:** si hace falta volver a mirarlo, se escribe otro ADR; el trabajo está en la
  historia de cada repositorio.

## Referencias

- [ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md) y [ADR-065](ADR-065-el-check-del-proyecto-avisa.md), que este reemplaza en lo que queda del trabajo.
- [ADR-076](ADR-076-la-tuberia-en-dos-flujos.md), que agrupa las reglas del PR en `reglas-del-pr.yml`.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-073](ADR-073-el-proyecto-del-pr-es-recomendado.md "ADR-073 · Estar en el proyecto del tablero es recomendado, y se agrega a mano con el engranaje") · [ADR-076](ADR-076-la-tuberia-en-dos-flujos.md "ADR-076 · La tubería de cada repositorio de código va en dos flujos") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
