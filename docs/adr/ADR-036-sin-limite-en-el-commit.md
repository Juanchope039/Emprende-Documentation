# ADR-036 · El mensaje de commit no tiene limite de longitud

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-036-sin-limite-en-el-commit.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-21 | 2026-09-24 | — |

> **El mensaje sigue sin tope total, pero cada párrafo tiene uno.** El [ADR-041](ADR-041-cuatro-lineas-por-parrafo.md) fijó cuatro líneas
> de 100 columnas por párrafo, en el commit y en los comentarios del código. Lo que este ADR
> decide —que el mensaje entero no tiene cifra— sigue en pie; la brevedad de cada párrafo, en
> cambio, ya no es solo una guía.

## Contexto

El [ADR-031](ADR-031-commit-de-256-caracteres.md) fijo el tope en 256 caracteres. Su justificacion
numerica era concreta: el trailer `Co-Authored-By` (53 caracteres fijos) mas el asunto (≈46) mas
los saltos (4) dejaban 152 para las tres respuestas del cuerpo. El numero 256 no era arbitrario,
era el resultado de una resta.

El proyecto ya no usa trailers. El presupuesto del [ADR-031](ADR-031-commit-de-256-caracteres.md)
crecia en 53 caracteres sin que la regla lo dijera, y el razonamiento que la sostenía perdía su
anclaje. Con los trailers fuera, cualquier tope nuevo seria arbitrario: no habría una cuenta
natural que lo justificara.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Eliminar el tope** | La regla deja de depender de una premisa que ya no existe; el commit puede decir lo que tenga que decir | Vuelve el riesgo de cuerpos de tres mil caracteres que habia antes del [ADR-031](ADR-031-commit-de-256-caracteres.md) |
| Subir el tope (a 350 o 400) | Sigue siendo verificable | El numero nuevo es arbitrario; la verificacion del CI falla por razones sin justificacion clara |
| Mantener 256 | No hay que tocar nada | La justificacion esta rota: el 256 contaba 53 caracteres de trailer que ya no existen |

## Decisión

El mensaje de commit no tiene tope de longitud verificado por la herramienta. El [ADR-028](ADR-028-un-commit-por-tarea.md) sigue
rigiendo: asunto con sprint y numero, cuerpo con `Hace:`, `Decide:` y `Verifica:`, y el porqué
largo en el plan de `plan/`. La brevedad es una guia, no una regla con cifra.

## Justificación

El 256 era el resultado de una resta. Sin los trailers, la resta da otro numero, y ese numero
no tiene razon para ser el tope. Una regla cuya justificacion desaparecio es peor que no tener
regla: falla de formas inesperadas y obliga a explicar por que el limite es ese y no otro.

La guia de brevedad del [ADR-028](ADR-028-un-commit-por-tarea.md) —tres frases, una por respuesta— sigue en pie. La diferencia
es que la guia no la verifica la herramienta: la aplica quien escribe.

## Consecuencias

- **Positivas:** el CI no falla por longitud de commit; quien escribe puede dar el contexto que
  necesita sin restar caracteres; la regla es coherente con la ausencia de trailers.

- **Negativas:** sin verificacion automatica, el cuerpo puede volver a crecer. El plan de trabajo
  sigue siendo el sitio para el porqué largo, pero ahora depende de la disciplina de quien escribe.

- **A vigilar:** commits con cuerpos de mas de 400 caracteres son una señal de que algo que debía
  ir en el plan fue al commit en su lugar.

## Referencias

- [ADR-028](ADR-028-un-commit-por-tarea.md) — la regla de fondo: un commit por tarea, con sus tres preguntas
- [ADR-031](ADR-031-commit-de-256-caracteres.md) — la decision que este ADR reemplaza

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo por carriles") · [ADR-028](ADR-028-un-commit-por-tarea.md "ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué") · [ADR-031](ADR-031-commit-de-256-caracteres.md "ADR-031 · El mensaje de commit cabe en 256 caracteres") · [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md "ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill") · [ADR-041](ADR-041-cuatro-lineas-por-parrafo.md "ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo") · [ADR-057](ADR-057-la-atribucion-va-una-vez-y-sin-la-sesion.md "ADR-057 · La atribución de un agente va una sola vez, y sin el enlace ni el id de su sesión") · [ADR-064](ADR-064-la-atribucion-la-pone-la-plataforma.md "ADR-064 · La atribución la pone la plataforma, y el agente no escribe ninguna") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
