---
name: plan
description: Escribe el plan de trabajo numerado de PRISMA antes de tocar código. Úsala al empezar cualquier tarea del 08, cualquier arreglo suelto y cualquier cambio de herramientas, antes de editar el primer archivo.
model: opus
---

# Escribir el plan de trabajo

La regla está en el `CLAUDE.md` de la especificación (§2): antes de escribir código se escribe el
plan. Aquí va el procedimiento.

## 1. Dónde va y qué número lleva

1. **La carpeta es `plan/` de la carpeta de trabajo**, la que contiene `repositories/`.
2. **El número es el mayor más uno, con dos dígitos**: `07`, `45`. Mira primero lo que hay con
   `ls plan/`. Comprueba que entre el 01 y el mayor no falte ninguno ni se repita. Si pasa, avisa
   antes de seguir: no se arregla renumerando.
3. **El nombre es `NN-titulo-en-minusculas.md`**: palabras separadas por guiones, sin tildes, sin
   puntos y sin otros signos. Se escribe `45-la-3-16-entra-al-08.md`, nunca `45-la-3.16-….md`.

## 2. Qué lleva

```markdown
# NN · El título, en una frase

**AAAA-MM-DD** · Qué tarea hace, o por qué es un arreglo suelto; los repositorios y las
ramas que toca, y lo que no toca.

## Lo que ya existe
Opcional: el punto de partida, comprobado y no supuesto.

## Qué se va a hacer

## Qué se decidió, y por qué
Con las alternativas que se descartaron y la razón de cada una.

## Cómo se va a verificar
Con la prueba en negativo: qué se va a romper a propósito para ver fallar cada prueba.
```

- **Va en futuro.** El commit cuenta lo que pasó, el plan cuenta lo que se va a hacer, y cuál de los
  dos mintió se ve comparándolos.
- **Sin encabezado de versión.**
- **Los enlaces a la especificación son relativos a `plan/`**, por ejemplo
  `../repositories/documentation/docs/05-reglas-financieras.md`.
- **No lleva datos internos**, aunque no se publique: ni claves, ni referencias de proyectos, ni URL
  privadas.
- **Aquí cabe el porqué largo** que no cabe en el commit.
