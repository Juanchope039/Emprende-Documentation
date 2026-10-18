---
name: documentar
description: Deja al día un documento Markdown de PRISMA. Sube su versión según 22 §3, pone la fecha, respeta los bloques generados y corre enlazar, verificar y verificar --base. Úsala cada vez que cambie un .md de cualquiera de los cuatro repositorios.
paths: "**/*.md"
model: sonnet
---

# Dejar un documento al día

**Las rutas de este archivo suponen la carpeta de trabajo**, la que tiene los cuatro
repositorios. Si una no existe en tu sesión, la skill `donde-estoy` dice cómo llegar.

Las reglas están en `22-documentacion.md` y en el `CLAUDE.md` de la especificación. La herramienta
está en `repositories/documentation/scripts/docs/`, con sus comandos en el §2 del `AGENTS.md` de la
especificación. Se corre desde cualquier carpeta y revisa también los `.md` de los hermanos.

## 1. Mientras se edita

- **Toda referencia es un enlace, y la herramienta los pone sola:**
  - los identificadores: `RF-01`, `CU-02`, `C-05`, `ADR-025`, `P-12`;
  - las tareas y los sprints: «tarea 3.4», «Sprint 3»;
  - los documentos y sus secciones: `05-reglas-financieras.md` o «07 §3».

  Escríbelos en texto y deja que `enlazar` haga el enlace. Lo que va entre comillas invertidas no se
  enlaza, salvo el nombre de un documento numerado, de `INDICE.md` o de `TODO.md`.
- **Un `§N` suelto, después de un punto, se toma como sección del propio archivo.** Pon el documento
  justo antes: «22 §3» o «`TODO.md` §10».
- **Desde un repositorio de código, la especificación se enlaza en absoluto**
  (`https://github.com/Juanchope039/Finanzas-PRISMA/blob/main/…`). Un `../documentation/…` también
  sirve: la herramienta lo reescribe.
- **Las anclas `<a id="…">` las pone la herramienta**: no se escriben a mano.
- **La nota de un ADR aceptado va debajo del encabezado**, con la forma `> **…**`.

## 2. La versión y la fecha

- **La versión sube según 22 §3**: MAJOR, MINOR o PATCH, con sus ejemplos. Los bloques generados no
  cuentan.
- **En un mismo PR, un documento sube una sola vez** con respecto a la base, aunque se toque en
  varios commits.
- **«Actualizado»** va en AAAA-MM-DD, en hora de Bogotá. **«Creado»** no cambia nunca.
- **Un documento nuevo** arranca en 0.1.0 como 📝 Borrador, o en 1.0.0 si nace ✅ Vigente o 🔄 Vivo.

## 3. Correr la herramienta

```bash
node repositories/documentation/scripts/docs/documentar.mjs enlazar
node repositories/documentation/scripts/docs/documentar.mjs verificar
node repositories/documentation/scripts/docs/documentar.mjs verificar --base origin/main   # con el PR autorizado
```

- **`enlazar` se corre dos veces si hace falta**: la segunda tiene que decir `0 de N archivos
  actualizados`.
- **Lo que `enlazar` genera va en el mismo commit** que el cambio que lo provocó.
- **`--base origin/main` necesita a `main` adentro**, y `main` entra con el PR autorizado: sin él,
  salen falsos positivos cuando `main` ya subió un documento. Antes, se compara contra el punto de
  donde salió la rama: `--base $(git merge-base origin/main HEAD)`.
- **Qué hacer con cada mensaje de error** está en la tabla de `scripts/docs/README.md`.

## 4. Si hay conflicto en `TODO.md` o `docs/INDICE.md`

1. `git merge --no-commit origin/main`.
2. `git checkout --theirs TODO.md docs/INDICE.md` y se vuelve a poner encima lo de la rama. La
   versión de `TODO.md` queda por encima de la de `main`.
3. `git add` de los dos, **y recién después** `enlazar`. Si un archivo sigue en conflicto, la
   herramienta lo cuenta tres veces y duplica filas en el índice.
4. `git add`, `verificar --base origin/main`, y el commit del merge.

La señal de que salió bien: el diff de `docs/INDICE.md` contra `main` es de una sola fila.
