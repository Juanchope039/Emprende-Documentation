# Políticas de rama

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [3.4.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/scripts/github/README.md "Historial de cambios") | [✅ Vigente](../../docs/22-documentacion.md#estados) | 2026-10-05 | 2026-10-17 | [Proceso](../../docs/INDICE.md#etiqueta-proceso) |

Pone en GitHub las protecciones de las tres ramas principales de los cuatro repositorios y de
`main` del monorepo de producto: que no se
borren, y qué tiene que haber pasado para entrar en cada una. La decisión está en
[ADR-048](../../docs/adr/ADR-048-las-ramas-principales-las-protege-github.md) y la regla, en el [`CLAUDE.md`](../../CLAUDE.md) de la especificación.

## Uso

```bash
node scripts/github/politicas-de-ramas.mjs mostrar              # lo que se le pediría a GitHub
node scripts/github/politicas-de-ramas.mjs verificar            # lo compara con lo que hay
node scripts/github/politicas-de-ramas.mjs aplicar              # crea o corrige lo que falte
node scripts/github/politicas-de-ramas.mjs aplicar --en-seco    # dice qué haría, sin hacerlo
node scripts/github/politicas-de-ramas.mjs verificar Emprende-API   # solo ese repositorio
```

- **Necesita Node 20 o más, el `gh` de GitHub en el `PATH`, y un token del dueño con permiso de
  administración** sobre los cinco repositorios: `gh auth login` como la cuenta dueña, o un
  `GH_TOKEN` fino con `Administration: write`. Con el token de una app o de una sesión de agente
  dice que no administra el repositorio y no escribe nada.
- **`verificar` no escribe nunca**, y devuelve 1 si falta algo. Es lo que conviene correr después de
  tocar la tubería o de crear una rama nueva.
- **`aplicar` nunca borra un conjunto que no esté en la definición**: lo nombra como «sobra» y lo
  deja quieto.

## Qué pone, y por qué

| Conjunto | En qué ramas | Qué exige |
|---|---|---|
| Las ramas principales no se borran | las tres | Nadie puede borrarlas, ni el dueño |
| A `develop` se entra por PR, con la tubería terminada | `develop` | PR, y el check **Tubería completa** en verde: la tubería corrió hasta el final. **No se le exige haber terminado bien** |
| A las demás ramas principales se entra por PR, con la tubería en verde | `qa`, `main` | PR, solo con merge commit ([ADR-061](../../docs/adr/ADR-061-se-promueve-con-merge-commit.md)), y el check **Tubería en verde**: ningún trabajo quedó en rojo ni cancelado |

Los dos checks son trabajos puerta al final del `ci.yml` de cada repositorio —y del
`documentacion.yml` de este—, y corren con `if: always()`, así que existen aunque la tubería falle.
Sin ellos, el check exigido no se reporta y el PR se queda bloqueado para siempre.

**Y el check «El PR está en el proyecto»**, junto a la tubería en los dos conjuntos de los cuatro
repositorios, no en el monorepo ([ADR-062](../../docs/adr/ADR-062-el-pr-esta-en-el-proyecto.md)). Es el trabajo de `proyecto-del-pr.yml`, el mismo en los
cuatro, y mira que el PR esté en «Prisma project», el proyecto 4 de `Juanchope039`.

**Ese trabajo avisa y no falla** ([ADR-065](../../docs/adr/ADR-065-el-check-del-proyecto-avisa.md)): cuando el PR no está en el tablero, o cuando no se
puede saber, escribe un `::warning::` y termina en verde. Se sigue exigiendo por su nombre a
propósito, para que el día que vuelva a bloquear la definición ya esté puesta.

**Y el check «El PR tiene milestone»**, en los cinco, también en el monorepo ([ADR-063](../../docs/adr/ADR-063-todo-issue-y-todo-pr-lleva-milestone.md)). Es el
trabajo de `milestone-del-pr.yml`, que solo lee el evento del PR y no necesita ningún secreto.

**La especificación no tiene `develop`**: su base es `main` ([21 §6.5](../../docs/21-trabajo-en-paralelo.md#65-ramas-e-integración)), así que ahí solo se ponen
dos conjuntos, y `main` entra en el de la tubería en verde.

## El orden importa

**Primero se fusiona la rama que trae las dos puertas, y después se aplican las reglas.** Al
revés, el PR que trae las puertas se queda esperando un check que todavía no existe en ninguna
ejecución, y no hay forma de fusionarlo sin quitar la regla.

Y lo mismo cada vez que una puerta cambie de nombre: mientras el nombre viejo siga exigido, ningún
PR pasa. Se cambian los dos a la vez —el `name:` del trabajo y el de la definición— y la regla se
vuelve a aplicar en cuanto la rama con el nombre nuevo esté en la base.

## El proyecto del PR

El check «El PR está en el proyecto» necesita dos cosas que esta herramienta no pone:

1. **El secreto `PRISMA_PROYECTO_TOKEN` en cada uno de los cuatro repositorios**, en *Settings →
   Secrets and variables → Actions → Secrets*. Es un token fino del dueño, limitado a los
   cuatro repositorios, con *Pull requests* y *Projects* (de la cuenta) en lectura: el
   `GITHUB_TOKEN` de Actions no lee los proyectos de un usuario. Uno clásico necesitaría `repo`,
   que escribe en todos los repositorios. Cuando vence,
   todos los PR quedan en rojo el mismo día.
2. **El auto-add del proyecto**, para que nadie tenga que agregar el PR a mano: en «Prisma project»,
   *⋯ → Workflows → Auto-add to project*, un flujo por repositorio con el filtro `is:pr`.

**El orden es el mismo de arriba, con un paso más**: primero `proyecto-del-pr.yml` en `develop` de
los tres de código y en `main` de la especificación, después el secreto y el auto-add, y por último
`aplicar`. Un PR de promoción trae el flujo consigo, así que `qa` y `main` no tienen que tenerlo
antes.

**Si el PR entró al proyecto después del check**, se vuelve a correr el trabajo desde el PR:
agregarlo no dispara ningún evento, y el check solo espera dos minutos.

## Los repositorios privados

- **Los privados solo admiten reglas con GitHub Pro.** En el plan Free la API contesta `403 Upgrade
  to GitHub Pro or make this repository public`. La segunda salida está prohibida: la visibilidad
  de un repositorio no se cambia ([ADR-051](../../docs/adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)). La cuenta pasó a Pro el 2026-10-14.
- **El monorepo de producto solo protege `main`**, y su puerta «Tubería en verde» es el último
  trabajo de su flujo «Sincronia» ([ADR-058](../../docs/adr/ADR-058-el-monorepo-no-va-adelante-de-develop.md)). Como dice el apartado anterior, se aplica después de
  que ese flujo esté en `main`.

## A mano, en el panel

Si se prefiere no correr nada: **Settings → Rules → Rulesets → New branch ruleset**, y para cada uno
de los tres conjuntos de la tabla de arriba:

1. **Ruleset Name**, el nombre de la tabla, y **Enforcement status** en `Active`.
2. **Bypass list** vacía: nadie tiene excusa.
3. **Target branches → Add target → Include by pattern**, una por rama: `main`, `develop` o `qa`,
   según el conjunto.
4. **Rules**: `Restrict deletions` en el primero. En los otros dos, `Require a pull request before
   merging` con **0** aprobaciones y `Require status checks to pass`, agregando el check por su
   nombre —**Tubería completa** o **Tubería en verde**, y **El PR está en el proyecto** salvo en el
   monorepo, y **El PR tiene milestone** en los cinco— y dejando sin marcar «Require branches to be
   up to date before merging».

`mostrar` imprime el mismo JSON que se envía, que sirve para comparar lo que quedó en el panel.
