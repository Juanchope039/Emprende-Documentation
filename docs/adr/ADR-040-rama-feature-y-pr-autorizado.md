# ADR-040 · Toda rama empieza por `feature/`, y el PR se abre solo con autorización expresa, trayendo entonces la base

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-040-rama-feature-y-pr-autorizado.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-24 | 2026-09-24 | [Proceso](../INDICE.md#etiqueta-proceso) · [Paralelo](../INDICE.md#etiqueta-paralelo) |

## Contexto

El [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md) fijó tres reglas para el ciclo de una rama: arranca en una copia limpia y en la base al
día; el PR no se abre por cuenta propia; y antes de avisar que está lista, la rama se trae su base,
queda sin un solo conflicto y lo repite si la base se mueve entre el aviso y el PR. Dos días
después, dos cosas piden volver sobre él.

**La tercera regla hace el trabajo antes de saber si hace falta.** La base se trae al terminar, y
otra vez si se movió mientras quien dirige decidía cuándo pedir el PR. Desde el 2026-09-22 hubo once
fusiones «Trae develop» o «Trae main» en los cuatro repositorios. Quien dirige decide cuándo se pide
cada PR —puede juntar dos, o esperar a que entre otro—, así que la fusión que se hace al avisar es,
muchas veces, una que habrá que repetir.

**Y el nombre de la rama no tiene regla para lo que no es una tarea.** El [21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración) pide `feature/`
con el id de la tarea, y lo demás quedó a criterio: las sesiones en la nube empujaron con la rama
que traían asignada, y diez PR se fusionaron desde ramas `claude/…`, seis en esta especificación y
cuatro en `prisma_db`. Un nombre así no dice qué trae, y eso era lo que el [21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración) le pedía a una
rama: que dijera sola qué es.

Quien dirige decidió las dos cosas: toda rama empieza por `feature/`, y el PR se abre solo con su
autorización expresa. Solo entonces se trae la base, se resuelven los conflictos y se abre.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **Seguir con el [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md)**: la base se trae antes de avisar | La rama «lista» promete que fusiona limpio | La fusión se repite cada vez que la base se mueve antes de que se pida el PR, y los commits «Trae …» se acumulan |
| **Traer la base solo al autorizarse el PR** (la decisión) | Una fusión por PR, en el momento en que sirve; quien dirige decide cuándo se hace ese trabajo | «Lista» deja de prometer que fusiona limpio; los conflictos aparecen al pedir el PR, a veces días después de escribir el código |
| **Rebasar sobre la base al autorizarse** | Historia lineal | Reescribe una rama que está empujada desde su primer commit, y obliga a forzar el empuje |
| **Un prefijo por clase de cambio**: `fix/`, `docs/`, `chore/` | Es la convención de mucha gente | Más vocabulario para decidir lo mismo; el proyecto ya usa `feature/` para todo, y el [08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado) nombra la rama `feature/` |
| **Dejar las ramas de sesión**, como `claude/…` | La sesión no tiene que cambiar nada | La rama no dice qué trae, y hay que abrir el PR para saberlo |

## Decisión

1. **Toda rama de trabajo empieza por `feature/`, sin excepción.**
   - Si es una tarea del 08, lleva su id y nada más: `feature/3.11`.
   - Si no lo es, lleva el título de lo que agrega, en minúsculas, con guiones, sin tildes y sin
     puntos: `feature/reglas-en-un-solo-sitio`.
   - Vale también para una sesión que trae asignada otra rama: se abre y se empuja la `feature/…`
     que corresponde. `develop`, `main`, `qa`, `uat` y `prod` no son ramas de trabajo.
2. **Toda rama sale de su base al día y de una copia limpia**, como decía el [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md): un árbol
   sucio no se arrastra a la rama nueva. Vale también para lo que no es una tarea.
3. **El PR se abre solo con autorización expresa de quien dirige.** Terminar la tarea no lo
   autoriza, y un PR en borrador tampoco se abre sin ella. Se termina, se empuja y se avisa que la
   rama está lista y contra qué base se abriría.
4. **Con la autorización, y solo entonces, en cada repositorio de la rama y en este orden:**
   1. se trae lo último de la base: `develop` en los de código, `main` en la especificación;
   2. se resuelven los conflictos;
   3. se vuelven a pasar las puertas del [08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado) con la base adentro;
   4. se abre el PR contra esa base.

   Antes, la base no se fusiona en la rama. Si se mueve mientras el PR espera, se repite: la
   autorización es del PR, no del momento en que se dio.

La receta del punto 4 es la skill `pr`, que usa la skill `sin-conflictos` para los pasos 1 a 3.

## Justificación

**La fusión se hace una vez y cuando sirve.** Traer la base es preparar el PR, y el PR lo decide
quien dirige. Hacerlo antes es adivinar cuándo lo va a pedir, y cada vez que la base se mueve en la
espera, ese trabajo se tira.

**Lo que el [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md) ganó se queda.** La rama sigue saliendo de una copia limpia, el PR sigue sin
abrirse por cuenta propia y la comprobación sigue siendo que las puertas pasan con la base adentro,
no que no queden marcas: dos ramas que suben la versión al mismo número fusionan limpio y dejan [C-05](../12-pruebas-y-calidad.md#c-05)
en rojo.

**Una rama dice qué es por su nombre.** Con el id dice qué fila del tablero revisar, y con el título,
qué trae. Una rama `claude/…` no dice ninguna de las dos cosas, y «sin excepción» es lo que evita que
la próxima sesión vuelva a empujar con el nombre que traía.

## Consecuencias

**Positivas**

- Una sola fusión con la base por PR, hecha cuando quien dirige lo pide.
- Toda rama dice qué es: una tarea o un título.
- Una sesión con otra rama asignada tiene permiso escrito para usar la suya.

**Negativas**

- «Lista» ya no quiere decir «fusiona limpio»: eso se sabe al autorizar el PR.
- El conflicto se resuelve cuando se pide el PR, que puede ser días después de escribir el código.
  El [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md) quería resolverlo con el contexto fresco, y eso se pierde en parte.
- Si un conflicto pide una decisión, el PR espera esa decisión.

**A vigilar**

- Que la espera no crezca: una rama lista y sin PR se desfasa cada día. Si pasa de un día, se avisa.
- Que «sin conflictos» no se degrade a «sin marcas de conflicto».
- Que las ramas sigan siendo cortas ([21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración)).

## Referencias

- [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md) — la decisión que este ADR reemplaza
- [21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración) — el ciclo de una rama
- [08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado) — las puertas que se vuelven a pasar con la base adentro
- [ADR-028](ADR-028-un-commit-por-tarea.md) — un commit por tarea, con el id en el asunto
- [ADR-034](ADR-034-la-version-sube-en-cada-pr.md) — la versión sube en cada PR, que es lo que más choca al traer la base
- [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md) — por qué este cambio toca el `CLAUDE.md` y las skills, y no cada guía

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo por carriles") · [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md "ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos") · [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-057](ADR-057-la-atribucion-va-una-vez-y-sin-la-sesion.md "ADR-057 · La atribución de un agente va una sola vez, y sin el enlace ni el id de su sesión") · [ADR-058](ADR-058-el-monorepo-no-va-adelante-de-develop.md "ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
