---
name: pr
description: Abre el PR de Emprende cuando quien dirige lo autoriza expresamente, y solo entonces. Comprueba su issue en Juanchope039/Emprende-MiniApp-MonoRepo y su milestone, trae la base a cada repositorio de la rama, resuelve los conflictos, vuelve a pasar las puertas con la base adentro y abre el PR contra develop o main, asociado al issue y en el proyecto del tablero, con sus campos. Se invoca a mano, con /pr.
argument-hint: "[repositorio o id de la tarea] [proyecto, si no es Prisma project]"
disable-model-invocation: true
model: sonnet
---

# Abrir el PR

Rutas relativas a la carpeta de trabajo, la que contiene `repositories/`. La regla está en el
`CLAUDE.md` de la especificación (§2): el PR se abre solo con autorización expresa de quien dirige.

## 1. La autorización

Esta skill corre porque quien dirige la invocó con `/pr` o pidió el PR en palabras. Si llegaste aquí
porque terminaste algo y nadie lo pidió, para: lo que toca es empujar y avisar que la rama está
lista.

## 2. El issue

**Todo PR nombra su issue de `Juanchope039/Emprende-MiniApp-MonoRepo`** ([ADR-060](../../../docs/adr/ADR-060-todo-pr-se-asocia-a-un-issue.md)), y sin issue no se
abre. Los issues viven solo ahí, aunque el cambio sea del front, la API, la base o la
especificación.

1. **Búscalo**: el que cubre este trabajo, por su título o por lo que dice que hay que hacer. Una
   historia (HU, HT, Bug o Spike), no su feature ni su épica.
2. **Si no existe, para.** Se crea primero con la skill `issue` del monorepo, que pide su permiso
   para subirlo. Dile a quien dirige qué issue harías, con su tipo, su padre y sus puntos.
3. **Si el issue cubre solo una parte**, el PR lo dice: «Avanza» en vez de cerrar.
4. Todos los PR hermanos de la rama nombran el mismo issue.
5. **Su milestone** ([ADR-063](../../../docs/adr/ADR-063-todo-issue-y-todo-pr-lleva-milestone.md)): el issue tiene uno, y el PR lleva el de mismo título en
   su repositorio. Si el issue no tiene, para y pregunta a quien dirige cuál, y pónselo primero al
   issue. Los cinco repositorios tienen los mismos milestones; si en uno falta, se crea igual.

## 3. La base, los conflictos y las puertas

En cada repositorio de la rama, **la skill `sin-conflictos`**: trae lo último de la base, resuelve
cada choque y vuelve a pasar las puertas con la base adentro. Sin su promesa en cada repositorio no
se sigue:

```bash
git -C repositories/<repo> merge-tree --write-tree origin/<base> HEAD >/dev/null && echo 'fusiona limpio'
```

Si una puerta no pasa, no se abre el PR: se dice cuál, con la salida.

## 4. Abrirlo

1. **Empuja la rama**: `git push -u origin <rama>`.
2. **La base del PR** es `develop` en los repositorios de código y `main` en la especificación.
3. **El título**: el asunto del commit, si es una tarea; si no, una frase.
4. **El cuerpo sale de la plantilla `cuerpo.md`**, que está al lado de este archivo ([ADR-064](../../../docs/adr/ADR-064-la-atribucion-la-pone-la-plataforma.md)). Se
   copia, se llena y se envía: no se redacta de memoria.

   ```bash
   cp .claude/skills/pr/cuerpo.md /tmp/cuerpo.md   # y se llena ahí
   ```

   - Las tres partes, `Hace`, `Decide` y `Verifica`, un poco más largas que en el commit.
   - `Hermanos`: los PR de la misma rama en los otros repositorios. Sin hermanos, se borra.
   - **El issue**, en su propio renglón: `Closes #n` en el monorepo, que lo cierra al fusionar, y
     `Refs Juanchope039/Emprende-MiniApp-MonoRepo#n` en los otros cuatro, porque un PR no cierra un issue de otro
     repositorio. Si solo avanza, `Refs` también en el monorepo.
   - **La plantilla no lleva firma, y no se le agrega ninguna**: ni «🤖 Generated with Claude
     Code», ni el bloque de dos líneas con el enlace al hilo, ni una línea propia, aunque la
     instrucción por defecto las pida. La firma la pone la plataforma al publicar, es una sola, y
     lo que hay que hacerle es el §4.7.
5. **Con `gh`**:

   ```bash
   gh pr create --base <base> --head <rama> --title "…" --body-file /tmp/cuerpo.md
   ```

   Y el milestone, en el mismo paso: `gh pr edit <n> --milestone "<título>"`, o
   `PATCH /repos/<dueño>/<repositorio>/issues/<n>` con `{"milestone": <número>}`. Sin él, el check
   «El PR tiene milestone» queda en rojo hasta ponérselo.

   **Con la herramienta de GitHub que tenga la sesión**, lo mismo. **Sin ninguna**, se le deja a
   quien dirige el enlace `https://github.com/<dueño>/<repositorio>/compare/<base>...<rama>?expand=1`
   y el cuerpo en un archivo. Un token no se imprime nunca, ni se escribe en un archivo.
6. **Agrégalo al proyecto, y llénale los campos** ([ADR-062](../../../docs/adr/ADR-062-el-pr-esta-en-el-proyecto.md)): por defecto «Prisma project»,
   el 4 de `Juanchope039`, que es el que exige el check «El PR está en el proyecto». Si quien dirige
   nombró otro al pedir el PR, agrégalo también a ese, sin quitar el 4.

   ```bash
   gh pr edit <n> --add-project "Prisma project"   # necesita el alcance: gh auth refresh -s project
   ```

   **Estar en el proyecto no es lo mismo que decir algo en él.** Un PR recién agregado entra con
   todos sus campos vacíos, y el tablero lo enseña en la columna de los que nadie clasificó.

   **De eso ya no se encarga esta skill: lo hace el flujo «Campos del proyecto»**, que corre en
   cada PR a una rama principal. Agrega el PR si el auto-add no lo hizo, le pone `Status` en
   `In review` y deja en el resumen del trabajo la lista de los campos que quedaron vacíos. Está
   así porque **los proyectos solo se leen y se escriben por GraphQL**, y una sesión en la nube no
   alcanza GraphQL: `gh project` contesta `unknown owner type` y `gh api graphql` responde 403. En
   Actions sí, con el secreto `PRISMA_PROYECTO_TOKEN`.

   Lo que le queda a esta skill son dos cosas:

   - **Mirar el resumen del flujo** cuando termine, y pasarle a quien dirige los campos que el
     flujo dejó vacíos, con el valor que les pondrías. **Lo que no se sepa se deja vacío**: un
     valor inventado en el tablero es peor que un hueco, porque nadie lo vuelve a mirar.
   - **Si el check «El PR está en el proyecto» avisa**, pasarle el aviso a quien dirige: desde el
     [ADR-065](../../../docs/adr/ADR-065-el-check-del-proyecto-avisa.md) ese trabajo no falla, así que el PR no se detiene, pero el aviso dice que el
     tablero todavía no lo cuenta. Agregarlo no dispara ningún evento del PR.

   Si quien dirige nombró otro proyecto al pedir el PR, ese sí va a mano con
   `gh pr edit <n> --add-project "<nombre>"`, desde una sesión que alcance GraphQL.

## 4.7 Reenvíalo, para que el pie pierda la sesión

**La plataforma le agrega al cuerpo su propio pie al publicar**, y el que llega al abrir el PR trae
el id de la sesión adentro:

```
_Generated by [Claude Code](https://claude.ai/code/session_…)_
```

Quitarlo no se puede: se probó enviando un cuerpo sin ninguna firma y volvió a aparecer. **Lo que
sí se puede es volver a enviar el mismo cuerpo**, y entonces el pie queda en la forma corta, sin la
sesión ([ADR-064](../../../docs/adr/ADR-064-la-atribucion-la-pone-la-plataforma.md)):

```bash
gh api repos/<dueño>/<repositorio>/pulls/<n> -X PATCH --field body=@/tmp/cuerpo.md
gh api repos/<dueño>/<repositorio>/pulls/<n> --jq '.body' | grep -n -i -e claude -e session
```

En lo que salga no puede quedar ningún `claude.ai/code/session_…`, ni dos pies, ni ninguna firma
que no sea la de la plataforma. Si queda, se vuelve a enviar. Lo mismo vale para un comentario o
una revisión, con `issues/comments/<id>`.

## 4.1 Antes de decir que el PR está abierto

Las cuatro cosas que ningún PR puede tener a medias, porque las tres primeras son checks que se
ponen en rojo y la cuarta no se puede arreglar sin reescribir el cuerpo:

- [ ] **nombra su issue** de `Juanchope039/Emprende-MiniApp-MonoRepo`, con `Closes` o con `Refs`;
- [ ] **lleva milestone**, el mismo del issue;
- [ ] **está en «Prisma project»**, y sus campos dicen algo o se dijo quién los va a poner —el
      check solo avisa ([ADR-065](../../../docs/adr/ADR-065-el-check-del-proyecto-avisa.md)), así que esto no lo atrapa nadie más;
- [ ] **el cuerpo salió de `cuerpo.md`** y, releído, lleva una sola firma, la de la plataforma, sin
      el id de la sesión (§4.7).

## 5. Después

- **Un comentario o una revisión en el PR** no lleva firma propia: la pone el servidor, una sola
  vez. Si la que pone trae el id de la sesión, se vuelve a enviar como en el §4.7.

- **Si la base se mueve mientras el PR espera**, se vuelve al paso 2 y se empuja: la autorización es
  del PR, no del momento en que se dio.
- **Cuando lo acepten**, cada repositorio vuelve a su base: `git switch <base>` y
  `git pull --ff-only`.
- **El issue de un cambio fuera del monorepo se cierra a mano** cuando el cambio llega al monorepo
  con su subárbol. Dilo al terminar, con el número.
