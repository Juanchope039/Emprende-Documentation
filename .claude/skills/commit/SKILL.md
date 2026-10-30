---
name: commit
description: Hace el commit de Emprende con el formato del proyecto y empuja la rama. Úsala cada vez que vayas a hacer un commit en cualquiera de los cuatro repositorios, sea de una tarea o no: el asunto, los tres párrafos Hace/Decide/Verifica de cuatro líneas y el empuje.
argument-hint: "[repositorio]"
model: sonnet
---

# Hacer el commit

Las reglas del commit están en el `CLAUDE.md` de la especificación (§2): una tarea es un commit, y
el commit explica por qué. Aquí va el procedimiento.

## 1. Antes

- `git status` y `git diff` en el repositorio: todo lo que va en el commit es de una sola tarea.
- **La prueba en negativo**: rompe a propósito lo que protege cada prueba nueva, mírala fallar y deja
  todo como estaba.
- Las pruebas del repositorio pasan. Anota cuántas son y qué rompiste: eso va en `Verifica:`.

## 2. El mensaje

```
Sprint 3 / 3.11: marca de registro tardio

Hace: lo que hace, en el lenguaje del negocio y no en el del diff. Si no cabe en una linea, sigue
en la siguiente.

Decide: lo que se decidio que ningun documento decia, y por que.

Verifica: 746 en verde; sin el filtro, 3 rojas.
```

- **El asunto**, si es una tarea, es `Sprint N / N.M: frase corta`. Si no, va sin número y con lo
  que toca delante: `README: …`, `Arreglo: …`, `Herramienta: …`, `Skills: …`, `ADR-NNN: …` o
  `Trae develop: …`.
- **Cada párrafo se parte a mano en líneas de 100 columnas**, con una línea en blanco entre los
  tres. Si alguno no cabe, para y aplica la regla de los párrafos del `CLAUDE.md`: la autorización
  de quien dirige, o el porqué largo al plan.
- **Mídelo antes de commitear.** Las dos órdenes tienen que salir vacías:

  ```bash
  awk 'length > 100 { print "linea " NR " de " length " columnas" }' mensaje.txt
  awk 'BEGIN { RS = "" } { n = split($0, l, "\n"); if (n > 4) print "parrafo " NR " de " n " lineas" }' mensaje.txt
  ```

## 3. El commit y el empuje

```bash
git add <rutas explícitas>
git status                          # un add con una ruta que no existe aborta el add entero
git commit -F mensaje.txt
git push -u origin <rama>          # la feature/…, desde el primer commit; nunca develop, main, qa, uat ni prod
```

- **Si en el índice hay cambios que no son tuyos** (un `.env`, cosas a medias de otra persona), no
  los toques: `git commit -F mensaje.txt -- <rutas>` solo se lleva esas rutas.
