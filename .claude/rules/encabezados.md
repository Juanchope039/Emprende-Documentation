---
paths:
  - "docs/**/*.md"
  - "*.md"
  - "contrato/README.md"
  - "scripts/**/*.md"
---

# Estás tocando un `.md` versionado

**La regla está en `docs/22-documentacion.md`** y en el `CLAUDE.md` del proyecto; el paso a paso, en
la skill `documentar`. Esto es solo lo que se olvida y deja el PR en rojo:

- **Sube la versión y «Actualizado»**, y «Creado» no cambia. En un mismo PR, una sola vez con
  respecto a la base, aunque el archivo se toque en varios commits.
- **No escribas dentro de un bloque `<!-- generado:… -->`**, ni toques las marcas ⚡ 🔒 ⏭️ del
  tablero: los escribe `documentar.mjs`, y lo que pongas se pierde en el siguiente `enlazar`.
- **No escribas anclas `<a id="…">` a mano.** Las dos que hay —`#2-los-carriles` y
  `#11-cuánto-dura-con-1-2-o-3-carriles-activos`— están a propósito, porque las enlazan dos ADR
  aceptados, y no se borran al rehacer las anclas.
- **Las referencias se escriben en texto** —`RF-01`, `ADR-025`, «tarea 3.4», «07 §3»— y `enlazar`
  las convierte en enlaces. Un `§N` suelto se toma como sección de este mismo archivo.
- **`enlazar` se corre sin los otros tres repositorios en disco** cuando va a rehacer bloques
  generados: con ellos adentro, los bloques salen con lo que haya en esas copias.
- **Antes del commit**: `enlazar` dos veces, la segunda en `0 de N`, y `verificar --base origin/main`
  en verde.
