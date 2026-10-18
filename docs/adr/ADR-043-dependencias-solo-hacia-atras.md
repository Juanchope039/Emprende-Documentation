# ADR-043 · Una tarea solo depende de tareas anteriores

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-043-dependencias-solo-hacia-atras.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-27 | 2026-09-27 | [Plan](../INDICE.md#etiqueta-plan) · [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El [08](../08-plan-de-desarrollo.md) abre su [§7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué) diciendo que «el orden no es arbitrario: sale de las
dependencias de las tareas». De ahí salen calculados las oleadas de cada sprint, el camino crítico,
el calendario y lo que se puede empezar hoy: si el orden y las dependencias no dicen lo mismo, los
cinco bloques generados dicen algo que el plan no sostiene.

Hoy no lo dicen. De las 481 dependencias de las 153 tareas, **47 apuntan a una tarea posterior** y
tres de ellas cruzan de sprint: la [4.3](../08-plan-de-desarrollo.md#tarea-4-3) espera la
[5.2](../08-plan-de-desarrollo.md#tarea-5-2), y la [6.1](../08-plan-de-desarrollo.md#tarea-6-1) espera
la [7.3](../08-plan-de-desarrollo.md#tarea-7-3) y la [7.4](../08-plan-de-desarrollo.md#tarea-7-4).

Las 47 tienen todas el mismo origen, y no es descuido: **una tarea que faltaba se escribe al final de
la tabla de su sprint, y después una tarea vieja pasa a depender de ella.** Es lo que hizo el [08 §6.1](../08-plan-de-desarrollo.md#61-los-requisitos-que-estaban-sin-sprint) al
asignar los requisitos sin sprint, lo que hizo el dibujo del libro con las tareas [3.17](../08-plan-de-desarrollo.md#tarea-3-17) a [3.24](../08-plan-de-desarrollo.md#tarea-3-24), y lo
que hizo cada contrato por funcionalidad: la 1.17 nació después de la 1.10 y la 1.10 la necesita.

Lo que eso cuesta no es teórico. `validarPlan` comprueba que no haya ciclos, que ninguna tarea
dependa de sí misma y que ninguna dependa de algo que no existe, pero nada comprueba la dirección.
Y el número es lo que todo el mundo lee como orden: quien recorre el 08 de arriba abajo llega a la
0.11 antes que a la 0.14, de la que depende. En las tres que cruzan de sprint es peor, porque el
sprint sí es un orden: el [Sprint 4](../08-plan-de-desarrollo.md#sprint-4) no puede cerrar hasta que
haya avanzado el [Sprint 5](../08-plan-de-desarrollo.md#sprint-5), y el propio [§7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué) del 08 lo dice con
otras palabras —«ponía Pedidos antes que Costeo, pero registrar un pedido con sus líneas necesita el
catálogo de productos»— sin sacar la conclusión: esos dos sprints están numerados al revés.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **Renumerar las tareas para que el orden y las dependencias coincidan** | Deja el plan sin deuda y la regla sin excepciones | Toca cientos de citas en el tablero, en los tres README y en commits ya empujados, que no se reescriben. El [08 §6.1](../08-plan-de-desarrollo.md#61-los-requisitos-que-estaban-sin-sprint) ya decidió «sin mover ninguno de sitio ni renumerar nada» |
| **Escribir la regla y no comprobarla** | Cuesta un párrafo | Es lo que hay hoy con la frase del [08 §7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué), y así aparecieron las 47 |
| **Declarar la deuda y cerrar la puerta a la siguiente** (la decisión) | La regla rige desde hoy sin reescribir el pasado; la deuda queda contada, a la vista y se vacía sola | Convive una lista de excepciones mientras el plan no se termine |
| **Prohibirlo solo entre sprints** | Son solo tres casos y es donde más duele | Dentro del sprint el número seguiría mintiendo, y las 44 seguirían creciendo |

## Decisión

1. **Ninguna tarea del [08](../08-plan-de-desarrollo.md) depende de una tarea posterior**, donde
   «posterior» es la que tiene un número mayor: primero el sprint, después el número dentro de él.
2. **Cruzar de sprint hacia adelante es el caso grave.** Un sprint es un orden de entrega: si una
   tarea suya espera a otra de un sprint posterior, lo que está mal es el número del sprint, y
   cambiarlo lo decide quien dirige.
3. **Dentro de un sprint, el número no promete un orden**: lo que dice qué va antes es la oleada,
   que la herramienta calcula. Aun así la dirección se respeta, porque el número es lo que se lee.
4. **Una tarea nueva se escribe después de todo lo que necesita.** Si hace falta que una tarea vieja
   dependa de ella, la tarea nueva no va al final: va donde el orden la deje antes, y si eso pide
   renumerar, se pide autorización a quien dirige con la razón.
5. **La comprobación la hace la herramienta** y no la memoria de nadie:
   `node scripts/docs/documentar.mjs verificar` falla con cualquier dependencia hacia adelante que
   no esté en la lista de `DEPENDENCIAS_HACIA_ADELANTE` de `scripts/docs/config.mjs`.
6. **La deuda declarada son las 47 de hoy**, en esa lista, cada una con el porqué de su grupo. La
   herramienta **también falla si una declarada ya no existe**, así que la lista solo puede
   encogerse; cuando quede vacía, se borra y la regla se queda sin excepciones.
7. **El 08 lleva la deuda en un bloque generado**, `plan-dependencias-hacia-adelante`, para que
   nadie tenga que buscarla en la configuración y para que no pueda quedar vieja.

## Justificación

**Que lo compruebe la herramienta es la decisión, no la regla.** La frase «el orden sale de las
dependencias» lleva escrita en el [08 §7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué) desde que el plan pasó a carriles, y en ese tiempo se
acumularon 47 excepciones. Lo que cambia hoy no es lo que se cree, es que se mide.

**La lista que solo se encoge es lo que la vuelve deuda y no permiso.** Una lista de excepciones que
se puede ampliar es la regla apagada. Que la herramienta exija que cada línea corresponda a una
dependencia que sigue existiendo obliga a borrarla cuando se arregla, y hace visible el saldo.

**Los tres casos que cruzan de sprint se declaran sin resolverse a propósito.** La 4.3 y la 5.2 ya
están hechas, así que renumerar no destraba nada; lo que queda es la constancia de que Productos va
antes que Pedidos. La 6.1 con la 7.3 y la 7.4 es el entrelazado que el grafo del [08 §7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué) ya dibuja en un
recuadro. Cambiar el número de un sprint mueve los hitos, el calendario y el tablero: es una decisión
de quien dirige, y este ADR la deja planteada, no tomada.

**El número dentro del sprint se respeta aunque no sea un orden.** Es la contradicción que conviene
aceptar: la oleada es la verdad, pero nadie lee las oleadas antes de leer la tabla.

## Consecuencias

**Positivas**

- Los cinco bloques generados del 08 y del tablero vuelven a decir lo mismo que las tablas.
- Quien lea el plan de arriba abajo no se encuentra una tarea que espera a otra de más abajo, salvo
  las que están declaradas y contadas.
- La próxima tarea que se agregue al 08 no puede estrenar una dependencia hacia adelante sin que la
  integración continua lo diga.

**Negativas**

- Agregar una tarea que una vieja necesita deja de ser gratis: o se renumera con autorización, o se
  parte en dos, o se declara.
- La lista de 47 líneas hay que mantenerla, y cada arreglo obliga a tocar dos archivos.

**A vigilar**

- Que la lista no se amplíe «solo esta vez». La señal es un commit que toca
  `DEPENDENCIAS_HACIA_ADELANTE` agregando una línea, y la regla es que ahí falta una autorización.
- Que los tres casos de sprint se queden sin decidir. Mientras estén, el [08 §7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué) y el diagrama de
  sprints describen un orden que las tareas no respetan.

## Referencias

- [08 §1.2](../08-plan-de-desarrollo.md#12-la-cadena-que-no-se-parte) — el camino crítico, que se
  calcula de estas dependencias
- [08 §7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué) — «el orden sale de las
  dependencias de las tareas»
- [08 §6.1](../08-plan-de-desarrollo.md#61-los-requisitos-que-estaban-sin-sprint) — «sin mover
  ninguno de sitio ni renumerar nada», de donde salen doce de las 47
- [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md) — cada regla en un solo sitio: esta vive en el
  `CLAUDE.md` y se comprueba en `scripts/docs/`
- [21 §4.3](../21-trabajo-en-paralelo.md#43-fase-2--rebanadas-verticales-sprints-3-a-8) — las
  rebanadas verticales, que son las que entrelazan los sprints 4 con 5 y 6 con 7

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [22](../22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive") · [ADR-068](ADR-068-los-sprints-cerrados-no-reciben-tareas.md "ADR-068 · Los sprints del 0 al 10 están cerrados, y una tarea nueva abre un sprint nuevo") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/docs/README.md "Herramienta de documentación")
<!-- /generado:referenciado-desde -->
