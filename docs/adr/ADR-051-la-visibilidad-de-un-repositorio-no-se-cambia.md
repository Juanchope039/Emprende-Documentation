# ADR-051 · La visibilidad de un repositorio no se cambia

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-06 | 2026-10-30 | [Proceso](../INDICE.md#etiqueta-proceso) |

> **Nota del 2026-10-14:** la cuenta pasó a GitHub Pro, la primera de las dos salidas que el
> contexto describe. Los tres privados ya admiten reglas de rama, y la consecuencia negativa de
> abajo queda sin efecto. **La decisión no cambia:** la visibilidad sigue sin tocarse, porque lo
> que la sostiene es la semilla con contraseñas en claro, no el plan de la cuenta.

## Contexto

El [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md) dejó escritas las protecciones de las cinco ramas principales, con su herramienta y
sus dos trabajos puerta. Al ir a aplicarlas apareció lo que las bloquea: la cuenta está en el plan
Free de GitHub, que no tiene reglas de rama en un repositorio privado, y tres de los cuatro
repositorios son privados. La API contesta `403 Upgrade to GitHub Pro or make this repository
public`, y de ahí salieron dos salidas: pasar la cuenta a Pro, o publicar los repositorios.

La auditoría previa a publicar encontró lo que se publicaría: la semilla crea usuarios con
contraseña en claro, y el [19 §1](../19-ambientes-y-entrega.md) la aplica a local, dev y qa. Publicar `emprende_db` es publicar con
qué se entra a dev.

Quien dirige lo decidió el 2026-10-06: **no se publican, y queda prohibido cambiar la visibilidad de
cualquiera de los cuatro.**

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Prohibirlo en los cuatro, en las dos direcciones** (la decisión) | Una sola regla, sin casos; publicar es irreversible en lo que importa, y volver privada la especificación rompe sus enlaces públicos | Pasar a Pro queda como la única salida para las reglas de rama |
| **Prohibir solo publicar un privado** | Cubre el riesgo que se encontró | Deja abierta la otra dirección, que también es una decisión de quien dirige y no de una sesión |
| **Publicarlos después de cambiar las contraseñas de la semilla** | Destraba las reglas de rama sin pagar | Sigue siendo irreversible: lo indexado, clonado o en cachés ya no se recoge |
| **Dejarlo como una nota en el README de la herramienta** | Nada que decidir | Una nota no es una regla, y el README ofrecía justo lo que se quiere evitar |

## Decisión

1. **La visibilidad de los cuatro repositorios no se cambia.** `Finanzas-PRISMA` es público;
   `Finanzas-PRISMA-API`, `Finanzas-PRISMA-Front` y `Finanzas-PRISMA-DB` son privados, y así se
   quedan.
2. **Rige en las dos direcciones**: ni se publica un privado, ni se vuelve privada la especificación.
3. **Ninguna sesión lo cambia, ni lo intenta, ni lo propone como salida a otro problema.** Si algún
   día hiciera falta, lo decide quien dirige y se escribe otro ADR que reemplace a este.
4. **La única salida para las reglas de rama de los tres privados es GitHub Pro**, y mientras no la
   haya, ahí la protección sigue siendo la costumbre.

## Justificación

Publicar un repositorio privado no se deshace: lo que quedó indexado, clonado o en una caché no se
recoge volviéndolo privado. Y lo que se publicaría no es hipotético —son las credenciales con las
que se entra a dev—, así que el riesgo no se mide por lo que hay en el árbol de hoy sino por los
439 commits de historia.

Que esté prohibido, y no solo desaconsejado, importa porque la pregunta aparece disfrazada de
solución a otra cosa: la próxima sesión que choque con el `403` de GitHub va a encontrar la misma
salida, y tiene que encontrarla cerrada.

## Consecuencias

**Positivas**

- Las reglas de rama de los tres privados dependen de una sola decisión, y es reversible.
- Ninguna sesión vuelve a plantear publicar como un paso técnico.
- La especificación sigue pública, que es para lo que se escribió.

**Negativas**

- Mientras la cuenta esté en Free, los tres repositorios de código no tienen reglas de rama.

**A vigilar**

- Que la semilla deje de llevar contraseñas en claro sigue siendo bueno por sí mismo, aunque ya no
  sea la condición para publicar nada.

## Referencias

- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), que es lo que se estaba aplicando cuando apareció la pregunta.
- [ADR-035](ADR-035-repositorios-hermanos.md) y [ADR-025](ADR-025-cuatro-repositorios.md), que explican por qué son cuatro.
- El [`CLAUDE.md`](../../CLAUDE.md) de la especificación, donde vive la regla.
- `scripts/github/README.md`, la herramienta de las políticas.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md "ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia") · [ADR-058](ADR-058-el-monorepo-no-va-adelante-de-develop.md "ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop") · [ADR-069](ADR-069-el-proyecto-se-llama-emprende.md "ADR-069 · El proyecto se llama Emprende, y el nombre viejo se va por donde se toca") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
