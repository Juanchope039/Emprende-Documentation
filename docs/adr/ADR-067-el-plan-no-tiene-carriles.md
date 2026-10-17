# ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-067-el-plan-no-tiene-carriles.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-17 | 2026-10-17 | [Proceso](../INDICE.md#etiqueta-proceso) · [Paralelo](../INDICE.md#etiqueta-paralelo) |

## Contexto

Desde que el plan se repartió para avanzar en paralelo, la palabra **carril** nombraba dos cosas a la
vez, y eso se notaba en cada documento.

- **Un sitio del plan.** La columna `Carril` de las tablas del 08 decía `API`, `Base`, `Front`,
  `Contrato` o `Decisión`, que son tres repositorios, una carpeta y una decisión de quien dirige.
  Eso no es un carril: es **dónde vive la tarea**.
- **Un frente de trabajo ocupado por alguien.** «Quién trabaja cada carril», «abrir un segundo
  carril», «un carril termina y espera». Ahí carril era una persona, un equipo o una sesión.

Con los dos sentidos encima de la misma palabra, el [`21-trabajo-en-paralelo.md`](../21-trabajo-en-paralelo.md) tenía que aclarar en
su primer párrafo que «un carril no es una persona», y el cálculo del calendario hablaba de
«carriles activos» cuando lo que simula son **tareas que avanzan a la vez**. La metáfora costaba una
explicación en cada documento que la usaba, 47 archivos en esta especificación.

Quien dirige lo pidió el 2026-10-17: que el concepto desaparezca.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejarlo como estaba | Cero trabajo, y el vocabulario ya estaba aprendido | La palabra seguía nombrando dos cosas, y cada documento pagaba la aclaración |
| Quitar también el modelo de trabajo en paralelo | Se iría el concepto entero, sin residuos | Se irían con él el calendario, las oleadas y el camino crítico, que son quince bloques generados y lo que dice qué se puede empezar hoy |
| Partir la palabra en dos nombres nuevos | Cada sentido tendría el suyo | Dos palabras nuevas que nadie usa, y la de «frente ocupado» no hace falta: lo que se mide son tareas |
| **Renombrar el sitio y contar tareas** | Cada cosa se llama por lo que es, y el cálculo no cambia de resultado | Toca muchos archivos de una vez, y queda un residuo declarado en los ADR aceptados |

## Decisión

1. **La columna del plan se llama `Dónde`**, con los mismos cinco valores. Dice en qué repositorio
   vive la tarea, y cuando hay varios, el primero es el que la lleva.
2. **El calendario cuenta tareas a la vez, no carriles.** `CARRILES_A_SIMULAR` pasa a
   `TAREAS_A_LA_VEZ_A_SIMULAR`, `CARRILES_DE_TRABAJO` a `DONDE_VIVE_LA_TAREA` y
   `COSTO_DE_COORDINACION_POR_CARRIL` a `COSTO_DE_COORDINACION_POR_TAREA`. **La cuenta es la misma**:
   solo cambian los nombres y los rótulos que se generan.
3. **El [`21-trabajo-en-paralelo.md`](../21-trabajo-en-paralelo.md) se llama «Trabajo en paralelo»** y se reescribe sin el concepto.
   Sube MAJOR, porque quien siga la versión anterior busca una columna que ya no existe.
4. **Lo que avanza en paralelo son tareas.** Donde un documento decía «un carril» dice el
   repositorio, la tarea o quien la trabaja, según lo que quisiera decir en ese sitio.
5. **Dos residuos quedan a propósito**, y no son un olvido:
   - **La prosa de los ADR aceptados no se toca**, porque un ADR aceptado no se edita
     ([`CLAUDE.md`](../../CLAUDE.md) [§4](../../CLAUDE.md#4-reglas-de-esta-especificación)). El [ADR-027](ADR-027-documentacion-versionada.md), el [ADR-028](ADR-028-un-commit-por-tarea.md), el [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md), el [ADR-038](ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md) y el [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md)
     siguen diciendo «carril», y ahí la palabra es el vocabulario de la fecha en que se decidió.
   - **Dos anclas viejas se conservan** —`#2-los-carriles` del 21 y
     `#11-cuánto-dura-con-1-2-o-3-carriles-activos` del 08—, escritas a mano con `<a id="…">`, porque
     las enlazan el [ADR-025](ADR-025-cuatro-repositorios.md) y el [ADR-047](ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md), que tampoco se editan. Un enlace roto cuesta más que una
     ancla con nombre viejo.

## Justificación

El nombre de una columna es lo primero que lee quien abre el plan, y `Dónde` contesta la pregunta
que esa columna contesta. Lo demás se sigue solo: si lo que el calendario simula son tareas que
avanzan a la vez, entonces el parámetro se llama así y el rótulo generado dice «2 tareas a la vez»
en vez de «2 carriles», que era una unidad que nadie contaba.

Y el modelo de trabajo en paralelo se queda porque lo que sobraba era la metáfora, no la cuenta: las
oleadas, el camino crítico y el calendario salen de las dependencias, no de la palabra.

## Consecuencias

- **Positivas:** la columna dice lo que contiene; el 21 ya no gasta su primer párrafo en aclarar lo
  que un carril no es; y los rótulos del calendario nombran lo que de verdad se simula.
- **Negativas:** es un cambio grande de una sola vez, y quien tenga una rama abierta con una tabla de
  tareas verá el conflicto en la cabecera. Se resuelve quedándose con `Dónde`.
- **A vigilar:** que la palabra no vuelva por la puerta de atrás en un documento nuevo. El
  `verificar` de hoy no lo mira, así que la guarda llega con la herramienta que vigile `.claude/`.

## Referencias

- [`21-trabajo-en-paralelo.md`](../21-trabajo-en-paralelo.md), reescrito sin el concepto.
- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md), con la columna `Dónde`.
- [ADR-043](ADR-043-dependencias-solo-hacia-atras.md), que es de donde salen las oleadas y el camino crítico.
- [ADR-068](ADR-068-los-sprints-cerrados-no-reciben-tareas.md), que entró con este y cierra los sprints del 0 al 10.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-068](ADR-068-los-sprints-cerrados-no-reciben-tareas.md "ADR-068 · Los sprints del 0 al 10 están cerrados, y una tarea nueva abre un sprint nuevo")
<!-- /generado:referenciado-desde -->
