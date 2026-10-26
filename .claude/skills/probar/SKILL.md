---
name: probar
description: Corre las puertas del repositorio en que estás —formato, análisis, pruebas, informe y la versión— y cuenta qué pasó y qué no. Úsala antes de decir que algo está terminado, antes de pedir el PR y cada vez que haya que saber si el árbol está en verde.
argument-hint: "[repositorio, o nada para el de esta sesión]"
model: sonnet
---

# Correr las puertas

Qué tiene que pasar para decir que algo está terminado lo dice el [08 §4](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/08-plan-de-desarrollo.md#4-definición-de-terminado), y el `AGENTS.md` de
cada repositorio lo repite en su «Las puertas del PR». Aquí están los comandos, para no volver a
traducir esa prosa en cada sesión.

**En qué repositorio estás** lo decide la skill `donde-estoy`. Las puertas son las de ese
repositorio, no las de los cuatro.

## 1. Las puertas de cada repositorio

| Repositorio | En orden |
|---|---|
| **La especificación** | `node scripts/docs/documentar.mjs enlazar` · `node scripts/docs/documentar.mjs verificar --base origin/main` |
| **La API** | `./gradlew spotlessApply` · `./gradlew build` · `./gradlew integracion` (aparte, y solo si se toca la base) · `./gradlew laVersionSubio --args=origin/develop` |
| **La base** | `./scripts/db/reset-local.ps1` · `supabase db query --local -f scripts/db/verificar-base.sql` · `./scripts/db/la-version-subio.ps1 -Base origin/develop` |
| **El front** | `dart format --set-exit-if-changed .` · `dart analyze --fatal-infos` · `flutter test` · `dart run tool/la_version_subio.dart origin/develop` |

- **`build` e `integracion` van en invocaciones separadas** en la API: juntas se agotan las
  conexiones de la base local.
- **El informe de la base se lee entero**: no basta con que el comando termine, hay que ver que no
  haya ningún `>>> FALLA`.
- **Las puertas se pasan con la base ya traída a la rama.** Un verde de antes de la fusión no dice
  nada de después, y eso lo cierra la skill `sin-conflictos`.

## 2. Qué se reporta

Una línea por puerta, con lo que salió, y **el conteo de pruebas donde lo haya**. Lo que importa de
verdad son dos cosas:

- **Qué puerta no se pudo correr, y por qué.** Una sesión sin PowerShell no corre la de la base, y
  una sin la base local levantada no corre `integracion`. Eso se dice; no se calla y no se da por
  verde.
- **Qué se rompió a propósito**, si la tarea agregó una guarda. Una guarda que nadie vio fallar no
  está probada, y el commit la pide ([ADR-028](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/ADR-028-un-commit-por-tarea.md)).

## 3. Si una puerta queda en rojo

**No se abre el PR y no se dice que está terminado.** Se arregla, o se dice qué falta y con qué
salida. Y nunca se desactiva, se salta ni se pone en cuarentena una prueba para llegar al verde: una
puerta que molesta se vuelve advertencia con su ADR ([ADR-065](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/ADR-065-el-check-del-proyecto-avisa.md)), no se borra.
