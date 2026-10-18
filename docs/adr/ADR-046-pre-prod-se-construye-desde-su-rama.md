# ADR-046 · pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.2.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-046-pre-prod-se-construye-desde-su-rama.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) | 2026-10-05 | 2026-10-10 | [Entrega](../INDICE.md#etiqueta-entrega) |

> **Lo modifica [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md):** `main` vuelve a ser la última etapa. La cadena es develop → qa → uat →
> pre-prod → main, y en `main` la CI comprueba el árbol igual que en `pre-prod`. Lo demás sigue en
> pie, y el cuerpo de abajo se conserva tal como se escribió.

> **Reemplazado por [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md).** pre-prod se quita y uat pasa a ser el ambiente de despliegue, así que
> ya no hay una rama `pre-prod` que Railway construya. Lo que sigue en pie es el mecanismo: el
> ambiente alojado se construye desde su rama, como dev desde `develop`, y ahora esa rama es `uat`.
> El cuerpo de abajo se conserva tal como se escribió.

## Contexto

El [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md) dejó pre-prod corriendo la imagen que construyó qa, sin recompilar, y la rama
`main` como la etapa que la despliega.

Quien dirige lo corrigió el 2026-10-05, al alojar pre-prod:

- en Railway, pre-prod es **un ambiente del mismo proyecto que dev**, con su propia configuración;
- **cada servicio se construye desde la rama `pre-prod`** de su repositorio, igual que dev se
  construye desde `develop`;
- la rama `pre-prod` recibe a `uat` por PR, como cada etapa recibe a la anterior.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Rama `pre-prod` como última etapa, y Railway la construye** | Igual que dev: una etapa es una rama y un PR. No hace falta token de Railway ni credenciales de GHCR | Gerencia aprueba una compilación del mismo árbol, no el archivo que compiló qa |
| Imagen de GHCR, como decía el [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md) | Gerencia aprueba el archivo mismo | Credenciales del registro en Railway, un token en la CI y un paso de despliegue más |
| Rama `pre-prod` copiada de `main` por la CI | `main` sigue siendo la etapa | Dos ramas para lo mismo, y una que nadie fusiona a mano |

## Decisión

**La cadena de ramas es develop → qa → uat → pre-prod**, cada una por PR desde la anterior.

| Rama | Etapa | Se aloja |
|---|---|---|
| `develop` | develop | dev, en Railway, construido desde la rama |
| `qa` | qa: **compila el artefacto una vez** | No |
| `uat` | uat: comprueba el artefacto y lo marca | No |
| `pre-prod` | pre-prod: comprueba el artefacto | pre-prod, en Railway, construido desde la rama |

- **La CI corre la etapa final en `pre-prod`**, no en `main`. Ahí comprueba que el árbol es el que
  compiló qa: lo que llegue sin pasar por qa se queda en rojo.
- **Railway construye pre-prod desde la rama**, con la configuración de su ambiente. No hay paso de
  despliegue en la CI.
- **El front de pre-prod no tiene imagen en GHCR.** La única que se compila en qa es la de prod, que
  recibe la entrega ([9.15](../08-plan-de-desarrollo.md#tarea-9-15)).
- **`main` deja de ser una etapa.** Sigue siendo la rama por defecto de los repositorios.

## Justificación

Quien dirige quiere que pre-prod funcione como dev, y un mismo mecanismo para los dos ambientes es
más fácil de operar que dos. **La garantía que se pierde es parcial**: el árbol que Railway compila
es el mismo que qa compiló y que la CI comprueba en `pre-prod`, así que el código es idéntico; lo que
puede diferir es la compilación.

## Consecuencias

**Positivas**

- Promover a pre-prod es un PR de `uat` a `pre-prod`, como cualquier otra etapa.
- Ni la CI ni Railway necesitan secretos del otro.

**Negativas**

- **La regla 4 del [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas) se debilita en pre-prod**: Gerencia aprueba una compilación del árbol, no el
  archivo que llega a prod.
- Volver atrás en pre-prod es republicar un despliegue anterior en Railway, como en dev.

**A vigilar**

- Si una compilación en Railway difiere de la de qa (otra versión de Flutter o del JDK), pre-prod
  puede pasar lo que prod no. Si pasa, se vuelve a la imagen con otro ADR.

## Referencias

- [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md), que este modifica.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md), donde viven las etapas y el artefacto.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md "ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio") · [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md "ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado")
<!-- /generado:referenciado-desde -->
