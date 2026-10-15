# ADR-062 · Todo PR a una rama principal está en el proyecto del tablero, y un check lo exige

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-062-el-pr-esta-en-el-proyecto.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-15 | 2026-10-15 | [Proceso](../INDICE.md#etiqueta-proceso) |

> **Nota del 2026-10-15:** las consecuencias negativas hablan de «un token personal con `repo`»,
> y eso quedó de un borrador. El token es el de la decisión (punto 3): uno fino, limitado a los cuatro
> repositorios, con *Pull requests* y *Projects* en lectura. Lo que sí vale es que vence.

## Contexto

El tablero de PRISMA es «Prisma project», el proyecto 4 de la cuenta `Juanchope039`. Los issues
están ahí, pero los PR entraban o no según alguien se acordara de agregarlos. Quien dirige pidió el
2026-10-15 que los PR a `develop`, `qa` y `main` exijan estar en ese proyecto, y que la skill `pr`
los agregue: a ese por defecto, o al que él indique.

Cuatro hechos limitan cómo se hace:

- **GitHub no tiene una regla de rama para «está en un proyecto».** Un ruleset solo puede exigir un
  check por su nombre ([ADR-048](ADR-048-las-ramas-principales-las-protege-github.md)).
- **El `GITHUB_TOKEN` de Actions no lee los proyectos de un usuario**: hace falta un token del dueño
  que lea el proyecto y los PR. Uno clásico necesitaría `repo`, que escribe en todos sus
  repositorios; uno fino se limita a los cuatro y a la lectura.
- **Agregar un PR a un proyecto no dispara ningún evento del PR**, así que un check no se entera solo
  de que ya está.
- **Una sesión de agente en la nube no alcanza los proyectos**: ni GraphQL ni las rutas REST de
  proyectos. Solo los agrega quien tenga un `gh` con el alcance `project`, o el propio proyecto.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Solo la skill `pr` lo agrega | Nada que mantener en la tubería | Los PR de promoción los abre quien dirige, no la skill, y una sesión en la nube no puede agregarlos |
| Solo el auto-add del proyecto | Sin token ni código: el proyecto agrega cada PR nuevo del repositorio | Nada lo exige. Si alguien lo apaga o cambia el filtro, nadie se entera |
| **Un check exigido, con el auto-add y la skill para que pase** | La regla queda en GitHub, como las demás, y el auto-add hace que casi nunca haya que tocar nada | Un secreto más en cada repositorio, y el check hay que volver a correrlo si el PR entra al proyecto después |

## Decisión

1. **Todo PR a `develop`, `qa` o `main` de la especificación, la API, el front y la base tiene que
   estar en «Prisma project»**, el proyecto 4 de `Juanchope039`.
2. **Lo comprueba el trabajo «El PR está en el proyecto»**, del flujo `proyecto-del-pr.yml` de cada
   uno de los cuatro, y los rulesets de [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md) lo exigen junto a la tubería. Espera hasta dos
   minutos a que el PR aparezca, y si no, falla diciendo qué hacer.
3. **Lee el proyecto con el secreto `PRISMA_PROYECTO_TOKEN`**, que pone quien dirige en cada
   repositorio: un token fino suyo, limitado a los cuatro repositorios, con *Pull requests* y
   *Projects* en lectura. Sin él, el check falla y lo dice.
4. **El proyecto agrega solo cada PR nuevo**, con un flujo «Auto-add to project» por repositorio,
   filtrado por `is:pr`. Lo activa quien dirige en el panel del proyecto.
5. **La skill `pr` agrega el PR al proyecto 4**, o al que quien dirige nombre al pedir el PR. Un
   proyecto distinto no quita el 4: el check sigue pidiéndolo.
6. **El monorepo de producto queda fuera.** Cada emprendimiento lo copia, y el proyecto 4 es de
   quien dirige: el check fallaría en todas las copias.

## Justificación

Una regla que depende de que alguien se acuerde no se cumple ([ADR-027](ADR-027-documentacion-versionada.md)). Exigirla en GitHub la
pone en el mismo sitio que las otras puertas de las ramas, y el auto-add hace que cumplirla no cueste
nada: el check solo falla cuando el auto-add no hizo su trabajo, que es justo lo que hay que ver.

## Consecuencias

- **Positivas:** el tablero cuenta todos los PR, también los de promoción que abre quien dirige.
- **Negativas:** un token personal con `repo` vive como secreto en cuatro repositorios, y vence. Si el
  PR entra al proyecto después del check, hay que volver a correr el trabajo a mano.
- **A vigilar:** el orden. Primero el flujo en las bases y el secreto, después `aplicar`; al revés,
  ningún PR pasa. Y el vencimiento del token, que deja todos los PR en rojo el mismo día.

## Referencias

- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), cuyos rulesets ganan este check.
- La skill `pr`, que agrega el PR al proyecto.
- [`scripts/github/README.md`](../../scripts/github/README.md), con el secreto, el auto-add y el orden.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
