---
name: sin-conflictos
description: Trae la base a una rama de PRISMA —develop en los repositorios de código, main en la especificación— y la deja sin un solo conflicto, con las puertas en verde y la base adentro. Es el paso 2 de la skill pr, así que solo corre con el PR autorizado. Se invoca a mano.
argument-hint: "[repositorio, o id de la tarea para hacerlo en todos los que toca]"
disable-model-invocation: true
model: sonnet
---

# Traer la base y dejar la rama sin conflictos

**Las rutas de este archivo suponen la carpeta de trabajo**, la que tiene los cuatro
repositorios. Si una no existe en tu sesión, la skill `donde-estoy` dice cómo llegar.

Las rutas son relativas a la carpeta de trabajo, la que contiene `repositories/`. **Es el paso 2 de
la skill `pr`**: corre cuando quien dirige autorizó el PR, y otra vez si la base se mueve mientras
el PR espera. Antes, no.

## 1. Mirar antes de tocar

En cada repositorio que toca la tarea:

```bash
git -C repositories/<repo> status --short          # tiene que estar limpio
git -C repositories/<repo> fetch --all
git -C repositories/<repo> log --oneline HEAD..origin/<base>
```

- **La base es `develop`** en `backend-api`, `backend-db` y `frontend-flutter`, y **`main`** en
  `documentation`.
- Si no hay nada en `HEAD..origin/<base>`, la base no se movió: salta al paso 4 y comprueba igual.
- Si el árbol tiene cambios sin commitear, **no los arrastres a la fusión**: enséñalos y pregunta.

Antes de fusionar, mira **qué va a chocar**, que es más barato que descubrirlo a mitad de camino:

```bash
git -C repositories/<repo> merge-tree --write-tree --name-only origin/<base> HEAD
```

Con salida 0 y una sola línea —el árbol—, no hay conflicto de texto. Con salida distinta de 0, las
líneas siguientes son los archivos que chocan.

## 2. Traer la base

```bash
git -C repositories/<repo> merge origin/<base> --no-commit
```

Se fusiona, **no se rebasa**: la rama ya está empujada desde su primer commit, y reescribirla
obligaría a forzar el empuje.

## 3. Resolver, y cada clase de conflicto tiene su receta

**La regla general: ninguna de las dos partes se tira.** Las dos ramas hicieron algo que alguien
quería. Si de verdad una sobra, se dice por qué en el commit de fusión.

| Qué chocó | Qué se hace |
|---|---|
| **Un bloque `<!-- generado:… -->`** | Se toma cualquiera de los dos lados, se resuelve el archivo y se corre `node scripts/docs/documentar.mjs enlazar`, que lo reescribe con los números buenos |
| **La versión del proyecto** (`build.gradle.kts`, `pubspec.yaml`, `schema_version`) | **Nunca se queda la de la rama.** Se lee la de la base ya fusionada y se sube **un paso desde ahí**. Si la otra rama se llevó el número que tenías, el tuyo es el siguiente. En `prisma_db`, la migración que publica la versión todavía no salió: se renombra, o se escribe otra |
| **La versión de un `.md`** | Igual: la de la base más un paso, y la fecha de hoy |
| **`contrato/openapi.json`** (la copia fijada) | Se resuelve el resto, se corre `./gradlew build` y se copia `build/contrato/openapi.json` encima. [C-04](https://github.com/Juanchope039/Finanzas-PRISMA/blob/main/docs/12-pruebas-y-calidad.md#c-04) es quien dice si quedó bien |
| **Un contador de pruebas o de rutas** en un README | Se vuelve a contar con la base adentro. Un número heredado de antes de la fusión es falso |
| **Un modelo compartido** que las dos ramas ampliaron | Se queda con **los campos de las dos**, y el javadoc de las dos. Es el caso más común y el que más fácil se resuelve mal |
| **Una firma de constructor o de puerto** | Se juntan los dos cambios y se compila. Que compile no alcanza: mira si el método nuevo de la otra rama tiene que usarse también en tu camino |
| **`TODO.md` o `docs/INDICE.md`** | El §4 de la skill `documentar`: se toma el lado de `main`, `git add`, y después `enlazar` |

**Un archivo resuelto se marca resuelto:** `git add <ruta>`. Mientras un archivo siga en conflicto,
`git ls-files` lo lista una vez por etapa y las herramientas que leen esa lista —`documentar.mjs`,
entre otras— lo cuentan tres veces y escriben filas repetidas.

## 4. Comprobar que de verdad no queda nada

**Las marcas primero**, que es lo barato:

```bash
git -C repositories/<repo> diff --check
git -C repositories/<repo> grep -n -E '^(<{7}|={7}|>{7})' -- . || echo 'sin marcas'
git -C repositories/<repo> status --short | grep -E '^(UU|AA|DD|AU|UA|DU|UD)' || echo 'sin conflictos'
```

**Y después las puertas de cada repositorio, ya con la base adentro**, que es lo que de verdad se
está comprobando: están en su `AGENTS.md`, en la sección «Las puertas del PR». Hay conflictos que
git no ve: dos versiones al mismo número fusionan limpio y dejan [C-05](https://github.com/Juanchope039/Finanzas-PRISMA/blob/main/docs/12-pruebas-y-calidad.md#c-05) en rojo.

Si algo no se puede correr en esta máquina —sin Docker no hay `integracion` ni base local—, **se dice
cuál y por qué**, y no se da por pasado.

## 5. Cerrar la fusión

El commit de fusión lleva el formato del proyecto, con el asunto `Trae <base>: …`:

```
Trae develop: la foto del recibo y el arreglo de la version

Hace: el libro junta los soportes de la pagina en una consulta.

Decide: 0.12.0, porque la 3.6 ya se llevo la 0.11.0.

Verifica: 871 y 173, C-04 y C-05 en verde.
```

Después:

```bash
git -C repositories/<repo> push
git -C repositories/<repo> merge-tree --write-tree origin/<base> HEAD >/dev/null && echo 'fusiona limpio'
```

**Esa última línea es la promesa de esta skill.** Si no la imprime, el PR no se abre.

## 6. Qué se dice

Cuando los repositorios de la rama pasan los pasos 4 y 5, se sigue con el paso 3 de la skill `pr`,
y se dice:

- qué trajo la base y qué se resolvió, en una línea por conflicto que no fuera mecánico;
- qué puerta no se pudo correr aquí, si alguna.
