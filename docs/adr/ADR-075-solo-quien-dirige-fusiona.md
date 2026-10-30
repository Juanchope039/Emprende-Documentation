# ADR-075 · Solo quien dirige fusiona los PR

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-075-solo-quien-dirige-fusiona.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-29 | 2026-10-29 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md) hace que a `develop`, `qa` y `main` solo se entre por PR, y los rulesets lo
cumplen. Pero no decía quién fusiona ese PR: una sesión de agente con permisos en el repositorio
puede correr `gh pr merge`, llamar a la API de merge o activar el auto-merge, y hacerlo porque se
lo pidieron en el chat. Quien dirige fijó el 2026-10-29 que la fusión es solo suya.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Que un agente fusione cuando se le pide | Menos clics | Un pedido mal leído, o el de otro agente, fusiona algo que nadie revisó |
| **Solo quien dirige fusiona, sin excepción** | La última palabra sobre lo que entra la tiene una persona | Cada fusión espera a quien dirige |

## Decisión

1. **Ninguna sesión de agente ni subagente fusiona un PR**, en ninguno de los cuatro repositorios
   ni en el monorepo de producto, **aunque se le pida explícitamente**.
2. **Tampoco activa el auto-merge ni empuja a una rama principal** (`develop`, `qa`, `main`).
3. **Lo que sí hace:** deja el PR en verde y avisa. Traer la base a su propia rama `feature/…`
   sigue permitido, porque no fusiona nada hacia una rama principal.
4. **La regla vale aunque un permiso no la bloquee.** Los repositorios pueden negar los comandos
   en `.claude/settings.json`, pero una lista de comandos nunca los cubre todos.

## Justificación

Lo que entra a una rama principal es lo que se despliega. Que lo decida una persona, y no un
pedido en un chat que un agente interpretó, es la única forma de que cada fusión tenga dueño.

## Consecuencias

- **Positivas:** ninguna fusión ocurre por un malentendido ni por un mensaje de otro agente.
- **Negativas:** los PR verdes esperan a quien dirige.
- **A vigilar:** si la espera se vuelve un cuello de botella, la salida es otro ADR, no una
  excepción en una sesión.

## Referencias

- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), que protege las ramas principales.
- La skill `pr`, que termina en «avisar», no en «fusionar».

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
