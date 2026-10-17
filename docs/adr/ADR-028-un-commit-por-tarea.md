# ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.4.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-028-un-commit-por-tarea.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-16 | 2026-09-24 | [Proceso](../INDICE.md#etiqueta-proceso) · [Plan](../INDICE.md#etiqueta-plan) |

> **El cuerpo son tres párrafos, de cuatro líneas como máximo.** El [ADR-041](ADR-041-cuatro-lineas-por-parrafo.md) partió en párrafos los
> tres títulos que la nota de abajo deja en una línea cada uno: `Hace:`, `Decide:` y `Verifica:` van
> separados por una línea en blanco, y cada uno cabe en cuatro líneas de 100 columnas. El mensaje
> sigue sin tope total.

> **Una línea del cuerpo se fue, y el tope que la sacó ya no existe.** El [ADR-031](ADR-031-commit-de-256-caracteres.md) dejó los tres
> títulos en una línea cada uno y abreviados a `Hace:`, `Decide:` y `Verifica:`, y borró la línea
> `Tarea: N.M del Sprint S` del punto 3 porque repite lo que ya dice el asunto: eso sigue. Su tope
> de 256 caracteres, en cambio, lo levantó el [ADR-036](ADR-036-sin-limite-en-el-commit.md), y el mensaje ya no tiene límite de
> longitud. Todo lo demás de este ADR sigue vigente, y el porqué largo que aquí se pedía vive ahora
> en el plan de `plan/`.

> **Los planes de trabajo ya no se citan.** Desde el [ADR-035](ADR-035-repositorios-hermanos.md) viven fuera de todo repositorio y
> ningún documento los nombra. El porqué largo sigue yendo al plan, como dicen el cuerpo y la nota
> anterior, pero el plan ya no se enlaza desde aquí ni desde ningún otro documento.

## Contexto

El plan tiene 132 tareas numeradas, repartidas en diez sprints y cuatro carriles que avanzan a la
vez ([21-trabajo-en-paralelo.md](../21-trabajo-en-paralelo.md)). El tablero ([TODO.md](../../TODO.md)) dice en qué va cada una, y la definición de
terminado del plan ([08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado)) dice cuándo una tarea puede marcarse hecha: con su commit en `main` y la
integración continua en verde.

Lo que no estaba dicho es **cuántos commits es una tarea, ni qué tiene que decir el commit**. Y sin
eso pasan dos cosas, las dos vistas ya en este proyecto:

- Un commit con dos tareas adentro. El primer empuje del dominio metió las tareas [3.1](../08-plan-de-desarrollo.md#tarea-3-1) y [3.11](../08-plan-de-desarrollo.md#tarea-3-11) en el
  mismo commit porque el código tocaba la misma clase. El tablero decía «dos tareas hechas» y el
  historial mostraba una sola: para saber qué trajo la 3.11 había que leer el diff entero.
- Un commit que dice **qué** cambió y no **por qué**. El diff ya dice qué cambió; lo que no se puede
  reconstruir después es la decisión: por qué el margen por hora viaja vacío en vez de cero, por qué
  la zona horaria vive en el dominio, qué se probó rompiendo el código a propósito.

El proyecto tiene un solo sitio donde la decisión queda pegada al cambio que la motivó, y es el
historial. Los ADR guardan las decisiones grandes; las pequeñas —las de una tarea— no tienen otro
sitio, y son la mayoría.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Un commit por tarea, con cuerpo documentado** | El tablero y el historial dicen lo mismo; `git log --oneline` es la lista de lo hecho; revertir una tarea es revertir un commit; `git bisect` señala una tarea, no un lote | Obliga a partir el trabajo aunque el código toque los mismos archivos, y a escribir el cuerpo aunque el cambio sea pequeño |
| Un commit por sprint | Menos commits que escribir | Un sprint son semanas: el commit se vuelve imposible de revisar y de revertir, y el porqué de cada tarea se pierde en el montón |
| Commits libres, y el porqué en el PR | Es lo que hace casi todo el mundo | El PR vive en GitHub y el historial viaja con el repositorio. Quien clona en cinco años tiene el segundo, no el primero |
| Commits libres, y el porqué en el código | Queda donde se lee | El comentario explica el estado final, no la alternativa que se descartó ni lo que se rompió para probar |

## Decisión

1. **Una tarea del plan es un commit, y un commit es una tarea.** Si el trabajo de una tarea toca la
   misma clase que otra, se parten igual: primero la que sostiene a la otra.
2. **El asunto lleva sprint y número de tarea:** `Sprint 3 / 3.11: marca de registro tardio`. Así
   `git log --oneline` es la lista de lo hecho, en el vocabulario del plan.
3. **El cuerpo responde tres preguntas, con ese orden y esos títulos:**
   - **Qué hace** — en el lenguaje del negocio, no en el del diff.
   - **Qué se decidió, y por qué** — cada decisión que los documentos no cubrían, con su razón. Es
     la parte que no se puede reconstruir después.
   - **Cómo se verificó** — cuántas pruebas nuevas y el total en verde, y **qué se rompió a
     propósito para ver fallar las pruebas** («verificado en negativo»).
   Y cierra con la línea `Tarea: N.M del Sprint S`, que enlaza el commit con el plan.
4. **Lo que no es una tarea también se commitea aparte**: documentación, herramientas, arreglos de
   infraestructura. No llevan número de tarea y siguen la misma estructura de cuerpo.
5. **El tablero se actualiza en el mismo empuje**, no después: marcar `[x]` en [TODO.md](../../TODO.md) y correr
   `node scripts/docs/documentar.mjs enlazar` es parte de terminar la tarea ([08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado)).
6. **Los mensajes van en español sin tildes**, como el resto del historial, para que no dependan de
   la codificación del terminal de quien lea.

## Justificación

**El tablero y el historial tienen que decir lo mismo.** El tablero dice qué está hecho hoy; el
historial dice cómo llegó a estarlo. Si una tarea marcada no tiene commit propio, el tablero es lo
único que queda, y un tablero sin respaldo en el historial es una lista de buenas intenciones.

**El porqué es lo caro de reconstruir.** El código dice qué hace; las pruebas dicen qué se espera de
él; el diff dice qué cambió. Ninguno dice por qué se eligió esto y no lo otro, ni qué se descartó.
Eso se olvida en semanas, y es exactamente lo que alguien necesita cuando va a cambiarlo.

**«Verificado en negativo» es la única prueba de que la prueba sirve.** Una prueba que nunca se vio
fallar puede estar comprobando nada. Escribir en el commit qué se rompió y cuántas pruebas cayeron
deja constancia de que se comprobó, y le ahorra a quien revisa tener que confiar.

**Un commit por tarea hace reversible el plan.** Si una tarea resulta mal pensada —y con 132 alguna
lo será—, revertirla es `git revert` de un commit, no una cirugía sobre un lote.

## Consecuencias

- **Positivas:** `git log --oneline` es la lista de tareas hechas, en el orden en que se hicieron;
  cada decisión pequeña queda fechada y atribuida; `git bisect` señala una tarea; y el commit sirve
  de revisión para quien no estuvo, que es el caso normal en carriles paralelos.

- **Negativas:** escribir el cuerpo cuesta, y se nota más en las tareas chicas. Partir dos tareas que
  tocan la misma clase obliga a reconstruir un estado intermedio, que es trabajo que no queda a la
  vista. Y nada de esto lo verifica la integración continua: es la primera regla del proyecto que
  depende de quien escribe.

- **A vigilar:** si los cuerpos se vuelven fórmula rellenada sin pensar —«Qué se decidió: nada»—, la
  regla deja de comprar nada y conviene reducirla al asunto con el número de tarea. La señal de
  alarma es un commit cuyo «por qué» se puede deducir del diff.

## Referencias

- [08-plan-de-desarrollo.md](../08-plan-de-desarrollo.md) [§4](../08-plan-de-desarrollo.md#4-definición-de-terminado) — la definición de terminado, que ahora exige el commit por tarea
- [TODO.md](../../TODO.md) — el tablero: la otra mitad, la que dice en qué va cada tarea
- [ADR-027](ADR-027-documentacion-versionada.md) — la documentación versionada y enlazada; esta decisión hace lo mismo con el historial
- [21-trabajo-en-paralelo.md](../21-trabajo-en-paralelo.md) — los carriles que hacen que el commit sea, casi siempre, para alguien que no estuvo

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [ADR-031](ADR-031-commit-de-256-caracteres.md "ADR-031 · El mensaje de commit cabe en 256 caracteres") · [ADR-035](ADR-035-repositorios-hermanos.md "ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo") · [ADR-036](ADR-036-sin-limite-en-el-commit.md "ADR-036 · El mensaje de commit no tiene limite de longitud") · [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md "ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos") · [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md "ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base") · [ADR-041](ADR-041-cuatro-lineas-por-parrafo.md "ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
