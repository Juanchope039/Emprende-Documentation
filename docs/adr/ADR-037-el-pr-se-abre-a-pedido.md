# ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-037-el-pr-se-abre-a-pedido.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md) | 2026-09-22 | 2026-09-24 | [Proceso](../INDICE.md#etiqueta-proceso) · [Paralelo](../INDICE.md#etiqueta-paralelo) |

> **Lo reemplaza [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md):** la rama sigue saliendo de la base al día y de una copia
> limpia, y el PR sigue sin abrirse por cuenta propia, tal como se argumenta abajo. Cambia la
> tercera regla: **la base ya no se trae antes de avisar que la rama está lista**, sino cuando quien
> dirige autoriza el PR. Y toda rama empieza por `feature/`, también la que no es una tarea.

## Contexto

El [21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración) describe el ciclo de una tarea en seis pasos, y el quinto es «abrir el PR». Escrito
así, un agente que termina una tarea entiende que abrirlo es parte de terminarla, y lo abre. Dos
cosas se rompieron con eso.

**La primera: quien dirige se enteró del PR después de que existía.** Abrir un PR es una acción
hacia afuera —notifica, pide revisión y deja una puerta abierta en el repositorio— y la decisión de
cuándo pedir esa revisión es de quien dirige el proyecto, no de quien escribe el código. El agente
no sabe si hay otra tarea del mismo carril a punto de entrar, ni si conviene juntar dos PR, ni si
quien revisa está disponible.

**La segunda: la rama llegaba al PR desfasada.** El paso 1 del ciclo —traer la base— está solo al
principio, y entre que arranca una tarea y termina pueden entrar dos o tres PR de otros carriles. En
el [Sprint 3](../08-plan-de-desarrollo.md#sprint-3) pasó dos veces en el mismo día: la [3.8](../08-plan-de-desarrollo.md#tarea-3-8) se abrió sobre una `develop` que después recibió la
[3.6](../08-plan-de-desarrollo.md#tarea-3-6), y la fusión de vuelta traía nueve archivos en conflicto —el modelo compartido, la copia
fijada del contrato, los dos README y los contadores de pruebas— más una versión de proyecto que las
dos ramas habían movido al mismo número. Nada de eso se ve desde la rama: se ve cuando alguien
intenta fusionar, que es el peor momento para verlo.

Y hay un tercer hueco, más viejo: **el ciclo no dice de qué copia sale la rama.** Dice «`git switch
develop && git pull`», pero no que el árbol tenga que estar limpio. Una rama abierta sobre un árbol
sucio se lleva puesto lo que había —los archivos sin commitear de otra cosa— y eso aparece después
como un cambio que nadie recuerda haber escrito.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **Dejarlo como está**: el agente abre el PR al terminar | Un paso menos; el PR existe apenas el trabajo está listo | Es una acción hacia afuera decidida por quien no dirige, y los conflictos se descubren en el PR |
| **Que el agente abra el PR pero en borrador** | Queda el enlace, y no pide revisión todavía | Sigue creando algo en el repositorio sin que nadie lo pida, y un borrador olvidado es ruido que alguien tiene que cerrar |
| **Rebase sobre la base en vez de fusión** | Historia lineal, sin commits de fusión | Reescribe una rama ya empujada, y estas ramas se empujan desde el primer commit ([21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración)). Obligaría a forzar el empuje |
| **Traer la base solo cuando GitHub avise del conflicto** | No se toca la rama mientras nadie se queje | GitHub avisa de conflictos de texto, no de los que compilan: dos versiones al mismo número fusionan limpio y rompen [C-05](../12-pruebas-y-calidad.md#c-05) después |
| **La decisión** (abajo) | Quien dirige decide cuándo se revisa, y el conflicto se resuelve donde hay contexto para resolverlo | La rama lleva commits de fusión, y hay que traer la base más de una vez en una tarea larga |

## Decisión

**Tres reglas, una por cada punta del ciclo.**

1. **Una tarea arranca en una copia limpia y en la base al día.** Antes de abrir la rama:
   `git status` sin nada pendiente, `git switch <base>` y `git pull --ff-only`. Si el árbol trae
   cambios sin commitear, no se arrastran a la rama nueva: se enseñan y se pregunta qué hacer con
   ellos. La base es `develop` en los repositorios de código y `main` en la especificación.
2. **El PR no se abre por cuenta propia: se abre cuando quien dirige lo pide.** El agente termina la
   tarea, empuja la rama —eso no cambia— y dice que está lista y desde dónde se abriría. Ahí para.
3. **Antes de decir que está lista, la rama se trae su base y queda sin un solo conflicto**, y eso
   se comprueba: la fusión de vuelta tiene que dar limpia. Si la base se movió otra vez entre el
   aviso y el PR, se repite.

La receta de la tercera es la skill `sin-conflictos`, y la de abrir el PR sigue siendo la skill
`pr`, que ya se invoca a mano.

## Justificación

**Empujar y abrir el PR no son lo mismo, y confundirlos fue el error.** Empujar respalda y deja
mirar; abrir el PR pide un turno de revisión. La rama se sigue empujando siempre y sin que nadie lo
pida, porque lo que solo vive en una máquina no está respaldado. Pedir revisión, en cambio, consume
el tiempo de una persona, y eso lo decide esa persona.

**El conflicto se resuelve donde está el contexto.** Quien acaba de escribir la tarea sabe por qué su
`FichaDeMovimiento` ganó un campo y por qué la otra rama le agregó otro; dos días después, en la
pantalla de conflictos de GitHub, eso ya no lo sabe nadie. Traer la base antes de pedir el PR pone la
resolución en el único momento en que es barata.

**Y hay conflictos que git no ve.** Dos ramas que suben la versión del proyecto al mismo número
fusionan sin una sola marca `<<<<<<<` y dejan [C-05](../12-pruebas-y-calidad.md#c-05) en rojo; dos ramas que agregan una ruta a la
copia fijada del contrato fusionan limpio y dejan [C-04](../12-pruebas-y-calidad.md#c-04) en rojo si nadie regenera el documento. Por
eso la comprobación no es «no quedaron marcas», sino «las puertas del [08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado) vuelven a pasar con la
base adentro».

## Consecuencias

**Positivas**

- Quien dirige decide cuándo se pide revisión, y puede juntar o espaciar los PR.
- El PR llega fusionable: quien revisa mira el cambio y no la pelea con la base.
- Los conflictos se resuelven con el contexto fresco y por quien lo tiene.
- Una tarea nunca arrastra los cambios sin commitear de otra.

**Negativas**

- La rama lleva commits de fusión —`Trae develop: …`—, así que su historia no es lineal.
- En una tarea larga hay que traer la base más de una vez.
- Una rama lista puede quedarse esperando a que alguien pida su PR.

**A vigilar**

- Que la espera no crezca: una rama lista y sin PR es una rama que se vuelve a desfasar. Si la
  espera pasa de un día, se avisa.
- Que «sin conflictos» no se degrade a «sin marcas de conflicto». Lo que se comprueba es que las
  puertas pasan con la base adentro.
- Que las ramas sigan siendo cortas ([21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración)): traer la base es barato en una rama de dos días y
  caro en una de dos semanas.

## Referencias

- [21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración), el ciclo de una tarea
- [08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado), la definición de terminado
- [ADR-028](ADR-028-un-commit-por-tarea.md), un commit por tarea
- [ADR-034](ADR-034-la-version-sube-en-cada-pr.md), la versión sube en cada PR
- [ADR-035](ADR-035-repositorios-hermanos.md), los cuatro repositorios hermanos

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md "ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill") · [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md "ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive")
<!-- /generado:referenciado-desde -->
