# ADR-039 · Cada regla vive en un solo sitio: `CLAUDE.md`, `AGENTS.md` o una skill

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-039-cada-regla-en-un-solo-sitio.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-24 | 2026-09-24 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El [ADR-035](ADR-035-repositorios-hermanos.md) repartió lo que lee un agente al entrar a un repositorio: el `CLAUDE.md` guarda las
reglas, y el `AGENTS.md`, la guía. Las skills de `.claude/skills/` llegaron el mismo día, después,
y el reparto no las nombró. Cada una se escribió para leerse sola, y para eso repitió las reglas
que aplicaba.

En tres días se vio el costo:

- **El flujo del PR del [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md) quedó escrito en nueve sitios**: el `CLAUDE.md` y el `AGENTS.md` de
  esta especificación, el `AGENTS.md` de `prisma_api` y el de `prisma_db`, las skills `pr`,
  `sin-conflictos` y `tarea`, el [21 §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración) y el propio ADR. Cambiarlo obliga a cambiar los nueve, y
  el que se olvide queda contradiciendo a los demás.
- **Las copias ya se separaron.** La skill `commit` seguía contando bytes dos días después de que el
  [ADR-036](ADR-036-sin-limite-en-el-commit.md) levantara el tope, y decía a la vez que el mensaje cierra con el trailer de coautoría y
  que no lleva `Co-Authored-By`. Las skills `pr` y `sin-conflictos` nombran `la-version-subio.sh` y
  `reset-local.sh`, que no existen: los guiones de `prisma_db` son `.ps1`.
- **Los tres `AGENTS.md` de código cierran con una lista «Nunca»** que repite reglas de algún
  `CLAUDE.md`. Una guía que enuncia reglas es una segunda copia de ellas.

Quien dirige pidió que las reglas no se repitan sin necesidad entre los `CLAUDE.md`, los
`AGENTS.md` y las skills.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **Dejarlo como está** | Cada archivo se lee solo | Cada regla que cambia hay que buscarla en varios sitios, y ya hay copias que se contradicen |
| **Todo en el `CLAUDE.md`** | Un solo archivo | Se carga en cada sesión y crecería con cada procedimiento; los agentes que solo leen `AGENTS.md` se quedan sin guía |
| **Todo en las skills** | Se cargan solo cuando hacen falta | Una regla tiene que estar presente siempre, no solo cuando alguien invoca su procedimiento |
| **Un sitio por clase de contenido, y enlaces** (la decisión) | Una regla cambia en un sitio y ninguna copia se queda vieja | Para ver el detalle hay que seguir un enlace |

## Decisión

**Cada cosa tiene un solo sitio, según lo que es:**

| Qué es | Dónde vive |
|---|---|
| Una regla de todo el proyecto | El `CLAUDE.md` de la especificación |
| Una regla de un solo repositorio | El `CLAUDE.md` de ese repositorio |
| Cómo se hace algo en un repositorio: comandos, estructura, dónde vive cada cosa | Su `AGENTS.md` |
| El paso a paso de un procedimiento que se repite | Su skill, en `.claude/skills/` |

1. **Los demás sitios nombran y enlazan; no repiten.** Una skill cita la regla que aplica, no la
   copia. Un `AGENTS.md` dice qué skill tiene el paso a paso, no lo resume. Un `CLAUDE.md` no
   describe comandos.
2. **La duplicación necesaria es poca, y es esta:**
   - la `description` de una skill, que Claude lee para decidir cuándo usarla;
   - el comando que corre un paso de una skill, que se escribe en el paso para poder seguirlo.
3. **Concretar no es repetir.** Que el `Dinero` de la API guarde un `long` concreta el [ADR-003](ADR-003-dinero-entero.md) en
   sus nombres; decir otra vez que el dinero es un entero de pesos es repetirlo.
4. **Los documentos numerados y los ADR quedan fuera**: su forma la dice [`22-documentacion.md`](../22-documentacion.md).

Los agentes que no son Claude no cargan skills, pero leen archivos: para ellos, el paso a paso es el
`SKILL.md` de la skill, y el `AGENTS.md` les dice cuál abrir.

## Justificación

**Una regla escrita dos veces son dos reglas.** Mientras digan lo mismo, la segunda no aporta nada;
el día que una cambie, aporta una contradicción. Con este reparto, cambiar el flujo del PR es
cambiar su regla en el `CLAUDE.md` y su paso a paso en la skill `pr`: los demás solo la nombran.

**Cada archivo se lee cuando hace falta.** El `CLAUDE.md` se carga siempre, y el de la
especificación llega a todas las sesiones por el que importa la carpeta de trabajo ([ADR-035](ADR-035-repositorios-hermanos.md)):
lo que va ahí tiene que valer la pena en cada sesión. Una skill se carga cuando se usa, y ahí cabe
el paso a paso largo sin costarle nada a las sesiones que no lo necesitan.

## Consecuencias

**Positivas**

- Una regla cambia en un sitio.
- Las skills se quedan con sus pasos, y los `AGENTS.md` con la guía.

**Negativas**

- Una skill leída sola no trae las reglas que aplica: cuenta con que el `CLAUDE.md` esté cargado.
- Quien clona un solo repositorio de código lee las reglas del proyecto por un enlace, no en su
  disco, como ya decía el [ADR-035](ADR-035-repositorios-hermanos.md).

**A vigilar**

- Que «nombrar» se estire hasta «resumir»: un resumen que crece es una copia.
- La señal de que volvió la duplicación: cambiar una regla obliga a tocar más de uno de estos
  archivos.

## Referencias

- [ADR-035](ADR-035-repositorios-hermanos.md) — el reparto entre `CLAUDE.md` y `AGENTS.md`, que este ADR extiende a las skills
- [`22-documentacion.md`](../22-documentacion.md) — la forma de los documentos numerados y de los ADR

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [20](../20-contrato-de-api.md "20 · Contrato de la API") · [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md "ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base") · [ADR-043](ADR-043-dependencias-solo-hacia-atras.md "ADR-043 · Una tarea solo depende de tareas anteriores") · [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main") · [ADR-070](ADR-070-las-reglas-con-alcance-y-lo-compartido.md "ADR-070 · Una regla puede vivir en .claude/rules/ con su alcance, y lo compartido tiene una fuente y copias verificadas") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
