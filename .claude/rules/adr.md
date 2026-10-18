---
paths:
  - "docs/adr/**"
---

# Estás tocando un ADR

**Cómo se escribe uno está en el `AGENTS.md` §4** de este repositorio, con el número, el nombre, las
seis secciones y el estado. Esto es lo que no perdona:

- **Un ADR aceptado no se edita** (`CLAUDE.md` §4). Si la decisión cambió, lo que falta es otro que
  lo reemplace. Al viejo solo se le agrega una nota debajo del encabezado, con la forma `> **…**`, y
  eso sube su MINOR.
- **Un número que ya se asignó no se vuelve a usar**, ni siquiera si ese ADR quedó reemplazado.
- **La fila del índice va a mano en dos sitios** —`docs/adr/README.md` y `docs/INDICE.md` §4— y
  **`verificar` no avisa si falta**. Es el error más fácil de cometer aquí.
- **La cuenta de decisiones del `README.md`** se vuelve a contar cuando entra uno nuevo: tampoco la
  comprueba nadie.
- En el índice, la descripción es para alguien que no es técnico, y lleva la pregunta que contesta.
