---
name: etiqueta
description: Revisa las etiquetas de git de un repositorio de PRISMA contra su esquema y explica qué entró entre dos de ellas. Úsala cuando haya que saber qué trae una versión, cuando falte una etiqueta o cuando el verificador de etiquetas esté en rojo. No crea etiquetas.
argument-hint: "[repositorio] [etiqueta]"
model: sonnet
---

# Revisar una etiqueta

La regla está en el [ADR-059](../../../docs/adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md), y el esquema, con sus ejemplos, en el 19 §4.4. Aquí va
el procedimiento. **Una etiqueta no se crea, no se mueve y no se borra a mano**: la pone la
tubería, y una sesión en la nube ni siquiera puede empujarla.

## 1. Comprobar el esquema

En el repositorio de código, con las etiquetas al día:

```bash
git fetch --tags origin develop
bash .github/scripts/verificar-etiquetas.sh origin/develop
```

- En verde, cada etiqueta cumple el patrón, es anotada, está en la primera línea de `develop`, sube
  un solo paso y trae su mensaje; o está en la lista de excepciones.
- En el monorepo la base es `origin/main` y el patrón `entrega-vN`.

## 2. Contar el tramo de una etiqueta

Lo que entró en una etiqueta es lo de la primera línea desde la anterior del mismo patrón:

```bash
bash .github/scripts/verificar-etiquetas.sh --tramo <etiqueta>
```

- Imprime el mensaje que esa etiqueta tendría: `Paso:`, `Incluye:` y, según el repositorio,
  `Migraciones:` o `Esquema que pide:`. Sirve igual para las viejas, que tienen el mensaje de antes.
- **Las fusiones de promoción no cuentan** (las que vienen de `develop`, `qa`, `main` o `uat`): si
  aparecen en el tramo, el guion está mal, no la etiqueta.

## 3. Si algo falla

| Lo que dice | Qué se hace |
|---|---|
| Falta la etiqueta de una versión | Volver a correr el flujo que la pone con `workflow_dispatch` («Etiquetas de la version» o «Etiquetas del esquema»). Nunca crearla a mano |
| Saltó un paso o repitió una versión | Lo arrastró C-05 sin verlo: avisar a quien dirige con las dos versiones. No se renumera nada |
| Una etiqueta está mal (ligera, otro commit, mensaje viejo) | No se rehace. La siguiente lo declara con un renglón `Corrige: <etiqueta>: lo que estaba mal`, y la mala entra a la lista de excepciones en el mismo PR |
| El mensaje nombra otra etiqueta | Solo vale en un renglón `Corrige:`. Se arregla en el guion que lo escribió |

## 4. Al contarlo

- Se dice qué trae la versión en palabras de quien la usa, a partir del `Incluye:`, y no se
  nombran otras etiquetas sin necesidad.
- Si el tramo junta varias versiones, eso ya es un release: sigue con la skill `release`.
