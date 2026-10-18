---
name: limpiar
description: Deja las cuatro copias de la carpeta de trabajo en su base, al día y con el árbol limpio. Primero comprueba en cada una que no falte nada por subir; si falta algo, lo informa y para sin tocar nada. Se invoca a mano.
argument-hint: "[repositorio, o nada para los cuatro]"
model: sonnet
---

# Limpiar la carpeta de trabajo

**Las rutas de este archivo suponen la carpeta de trabajo**, la que tiene los cuatro
repositorios. Si una no existe en tu sesión, la skill `donde-estoy` dice cómo llegar.

Las rutas son relativas a la carpeta de trabajo, la que contiene `repositories/`.

De aquí sale la tarea siguiente: su primer paso es la base al día en una copia limpia
([ADR-040](https://github.com/Juanchope039/Finanzas-PRISMA/blob/main/docs/adr/ADR-040-rama-feature-y-pr-autorizado.md)). Esta skill es ese paso hecho aparte, en las cuatro copias y sin
abrir ninguna tarea.

**Todo pasa en las copias de `repositories/`.** Ni worktrees, ni clones, ni carpetas temporales: si
una copia no se puede limpiar, se informa y se para.

**Nada se borra.** Esta skill mira, cambia de rama y trae lo que hay. Lo que encuentre sin subir lo
enseña y espera, porque qué se hace con el trabajo de alguien lo decide quien dirige.

## 1. Mirar las cuatro, sin tocar nada

| Copia | Base |
|---|---|
| `documentation` | `main` |
| `backend-api` | `develop` |
| `backend-db` | `develop` |
| `frontend-flutter` | `develop` |

Con un argumento, solo esa copia. Sin argumento, las cuatro, y cada una por su cuenta.

```bash
git -C repositories/<repo> fetch --prune origin      # no toca el arbol de trabajo
git -C repositories/<repo> status --short --branch
git -C repositories/<repo> stash list
git -C repositories/<repo> branch -vv                # [gone], las que nunca se empujaron, y que worktree tiene cada una
```

**El `fetch` va primero.** Sin él, «al día» y «ya está en la base» se contestan con lo de ayer.

## 2. Qué cuenta como que falta algo por subir

| Hallazgo | Cómo se ve | Por qué para |
|---|---|---|
| **Archivos sin commitear**, seguidos o sin seguir | cualquier línea de `status --short` | Cambiar de rama se los lleva a donde no van, y un `pull` que los pise los borra |
| **Commits sin empujar** | `git rev-list --count @{upstream}..HEAD` mayor que 0 | Solo están en esta máquina |
| **Una rama que nunca se empujó** | en `branch -vv`, sin `[origin/…]` | Igual: solo está aquí |
| **Una rama con el remoto borrado** (`[gone]`) **que la base no contiene** | `git merge-base --is-ancestor <rama> origin/<base>` con salida distinta de 0 | El remoto se fue y el contenido no llegó a la base: lo que tenga vive solo aquí |
| **Un `stash`** | `git stash list` con líneas | Nadie más lo tiene, no se ve en `status` y se olvida |

Las tres filas de ramas se miran con esto, rama por rama:

```bash
git -C repositories/<repo> for-each-ref --format='%(refname:short) [%(upstream:short)] %(upstream:track)' refs/heads
git -C repositories/<repo> merge-base --is-ancestor <rama> origin/<base>   # salida 0: la base ya la contiene
```

**`@{upstream}` falla en la rama `[gone]`**, con `fatal: ambiguous argument`, porque el remoto que
tenía apuntado ya no existe. No es un error de la copia: es esa rama cayendo en la cuarta fila, y se
contesta con `merge-base`.

**Y qué no cuenta, aunque lo parezca:**

- **Una rama que la base ya contiene**, aunque diga `[gone]`: su PR entró, y su contenido está en la
  base. Salir de ella no pierde nada, y `git switch <rama>` vuelve.
- **Una rama con su remoto al día**: está guardada, aunque todavía no esté en la base.
- **Que la copia esté limpia no basta.** Puede estar limpia y sesenta commits atrás: limpio es el
  árbol, al día es la base. Son las dos cosas del §3.

## 3. Si no falta nada: a la base y al día

```bash
git -C repositories/<repo> switch <base>
git -C repositories/<repo> pull --ff-only origin <base>
git -C repositories/<repo> log --oneline -1
git -C repositories/<repo> status --short --branch    # limpio, y sin «behind»
```

- **Si `pull --ff-only` no puede avanzar**, la base local divergió de la remota: no lo fuerces, dilo.
- **Di de qué rama saliste y cómo volver**, con el `git switch <rama>` escrito. Es barato justamente
  porque solo se sale de ramas que ya están guardadas.
- **Si otra sesión puede estar en esa rama, pregunta antes de salir de ella.** Las copias se
  comparten: la rama que tiene sacada una copia puede ser el trabajo de ahora de alguien más.

## 4. Si falta algo: se informa y se espera

**No se toca nada.** Ni `stash`, ni `add`, ni `commit`, ni `switch`, ni `restore`, ni `clean`, ni
`reset`, ni un worktree para esquivar la copia ocupada. Se enseña lo que hay, con lo que hace falta
para decidir:

```bash
git -C repositories/<repo> status --short
git -C repositories/<repo> diff --stat
git -C repositories/<repo> log --oneline origin/<base>..HEAD     # que tiene la rama que la base no
```

Y se dicen las salidas, para que elija quien dirige:

- **commitearlo**, con la skill `commit`, si es el trabajo de una tarea que se está haciendo;
- **dejarlo donde está** y saltarse esa copia, que es lo que toca cuando es de otra sesión;
- **tirarlo**, y eso solo si lo pide con esas palabras.

**Las demás copias se limpian igual:** una con hallazgos no detiene a las otras.

## 5. Qué se informa al final

Una fila por copia:

| Copia | Estaba en | Quedó en | Trajo | Pendiente |
|---|---|---|---|---|

Y debajo, lo que no se tocó y alguien tiene que ver:

- **las ramas locales que la base ya contiene**, con su `git branch -d` listo para copiar; aquí no se
  borran;
- **los worktrees registrados fuera de la carpeta de trabajo**, si hay. Cada uno retiene su rama, y la
  copia no puede sacarla mientras exista; `git worktree prune` limpia los que ya no están en disco,
  cuando lo pidan;
- **lo que quedó sin subir**, copia por copia, y de quién parece ser.

## 6. Lo que esta skill no hace

- **No borra nada**: ni ramas, ni worktrees, ni archivos, ni stashes.
- **No commitea ni empuja**: eso es la skill `commit`.
- **No abre ramas**: eso es la skill `tarea`, que empieza donde esta termina.
- **No trae la base a una rama ni resuelve conflictos**: eso es la skill `sin-conflictos`.
- **No corre las puertas del [08 §4](https://github.com/Juanchope039/Finanzas-PRISMA/blob/main/docs/08-plan-de-desarrollo.md#4-definición-de-terminado)**: aquí no se está terminando nada.
