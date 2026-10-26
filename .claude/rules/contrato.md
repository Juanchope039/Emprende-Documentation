---
paths:
  - "contrato/**"
---

# Estás tocando el contrato acordado

**Las reglas están en el `CLAUDE.md` del proyecto** (§3 y §4) y el paso a paso en la skill
`contrato`. Las trampas:

- **Va en LF, byte a byte.** Un `\r\n` rompe la comparación que hace la API.
- **La copia de la API no se copia de aquí.** C-04 compara esa copia con lo que **genera** el código,
  así que lo que cambia primero es el código de la API; pegar este archivo allá deja la prueba en
  rojo igual.
- **El contrato se acuerda antes de implementarse**: primero entra el PR de aquí, después el de la
  API.
- **Dos ramas que agreguen una ruta** fusionan limpio y dejan C-04 en rojo. Al traer la base hay que
  mirarlo, no basta con que no queden marcas de conflicto.
- **El catálogo de códigos de aquí es la fuente de los mensajes**, y cada código vive en el rango de
  su módulo.
