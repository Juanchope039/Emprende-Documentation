# ADR-070 · Una regla puede vivir en `.claude/rules/` con su alcance, y lo compartido tiene una fuente y copias verificadas

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-070-las-reglas-con-alcance-y-lo-compartido.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-17 | 2026-10-17 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

Las reglas de Emprende viven en dos archivos por repositorio: su `CLAUDE.md` y su `AGENTS.md`, que
el primero importa al final ([ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md)). Los dos entran **enteros** en toda sesión, y eso tiene dos
precios:

- **Lo que no hace falta pesa.** Las reglas de la migración se cargan para escribir una pantalla de
  Flutter, y las del hexágono para tocar un `.ps1`. Son miles de palabras que la sesión lee antes de
  saber qué va a hacer.
- **Lo que hace falta no está.** Las diez skills del proceso y las reglas del proyecto solo existen
  en la especificación. Una sesión en la nube que trae un solo repositorio no las ve, y la mayor
  parte del trabajo pasa justo ahí. Siete de esas skills además escriben rutas
  `repositories/<repo>` que no coinciden ni con el `AGENTS.md` ni con esa clase de sesión.

Y nada verifica lo que hay en `.claude/`: `scripts/docs/config.mjs` lo excluye a propósito, porque no
es documentación versionada.

Quien dirige lo pidió el 2026-10-17: que haya agentes y skills adaptados a cada repositorio, que se
contemple usar reglas, y que lo compartido sea **agentes, skills, reglas y `CLAUDE.md`**.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejarlo en `CLAUDE.md` y `AGENTS.md` | Cero trabajo, y una sola forma de escribir una regla | Todo se carga siempre, y los otros tres repositorios siguen sin las reglas ni las skills |
| Un plugin con todo adentro | Un solo paquete, instalable | **Una sesión en la nube no carga los plugins de la configuración local**, y ahí es donde más se trabaja. Esto es lo que invalidó el plan anterior |
| Un submódulo de git | Una sola copia de verdad | Un submódulo hay que acordarse de actualizarlo, y una copia desactualizada no avisa |
| **Reglas con alcance, y copias generadas y verificadas** | Cada regla se carga donde importa, y los cuatro repositorios tienen lo mismo | Hay copias, y una copia editada a mano rompe la puerta hasta que alguien la reparta otra vez |

## Decisión

1. **Una regla puede vivir en `.claude/rules/<tema>.md`, con su `paths:`**, y entonces se carga solo
   al abrir un archivo que calza. Lo que hace falta antes de abrir nada —la rama, el commit, la
   versión, el PR— no lleva `paths:` y se carga siempre.
2. **Esto no cambia de dueño a ninguna regla** ([ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md)): una regla sigue viviendo en un solo
   sitio. Un archivo de `rules/` nombra y enlaza lo que ya está escrito, y agrega lo que no se puede
   equivocar al tocar ese archivo.
3. **Lo compartido son cuatro cosas**, y solo esas: las reglas del proyecto, las skills del proceso,
   los agentes que no son de un repositorio, y el `CLAUDE.md` del proyecto, que llega a cada
   repositorio de código como `.claude/rules/proceso.md`. Los tres se versionan: hasta ahora de
   `.claude` solo subían las skills, y `.gitignore` deja pasar también `agents/` y `rules/`.
4. **Hay una fuente y copias generadas**, como el contrato con [C-04](../12-pruebas-y-calidad.md#c-04): la fuente es esta
   especificación, `scripts/agentes/repartir.mjs` escribe las copias y
   `scripts/agentes/verificar.mjs` falla si una copia no es la fuente byte a byte. El manifiesto es
   `scripts/agentes/compartido.json`, y cada pieza es un archivo, no una carpeta, para que la puerta
   compruebe lo mismo con la fuente en disco y con la fuente descargada de GitHub.
5. **La puerta corre en los cuatro.** En la especificación comprueba que el manifiesto no nombre algo
   que ya no existe; en la API, la base y el front, que sus copias sean la fuente de `main`, que se
   descarga sin token porque esta especificación es pública.
6. **Los agentes leen y no escriben**, salvo el `documentalista`, que corre la herramienta de
   documentación y arregla lo que ella pide. Un revisor que arregla lo que encuentra deja de
   informar y empieza a decidir.
7. **Las rutas no se suponen**: la skill `donde-estoy` dice en qué repositorio corre la sesión y cómo
   llegar a los otros, y las skills que escriben rutas de la carpeta de trabajo la nombran.
8. **Los hooks quedan fuera por ahora.** La lista de lo compartido que fijó quien dirige no los
   incluye, y un hook que se equivoca bloquea trabajo legítimo. Si entran, entran con su propio ADR
   y probados en los dos sentidos.

## Justificación

El reparto por capas es el que ya usa el proyecto para los documentos, y aquí se aplica igual: lo
que es cierto siempre, en pocas líneas; lo que es cierto de un archivo, junto a ese archivo; y el
paso a paso, en su skill. Lo nuevo es que ahora la segunda capa existe y el agente la recibe sola.

Y las copias se eligen sobre el plugin y el submódulo por una razón comprobada: la sesión en la nube
no carga plugins locales, y un submódulo desactualizado no avisa. Una copia verificada byte a byte sí
avisa, en el PR, que es cuando se puede arreglar.

## Consecuencias

- **Positivas:** una sesión carga la regla del archivo que abre; los cuatro repositorios tienen las
  mismas skills y las mismas reglas del proyecto; y `.claude/` deja de ser la única carpeta que nada
  verifica.
- **Negativas:** hay cuatro copias de lo compartido, y cambiar algo son cuatro ramas y cuatro PR.
  Mientras los tres repositorios de código no reciban el suyo, su puerta está en rojo a propósito.
- **A vigilar:** que una regla no termine con `paths:` cuando hacía falta antes de abrir nada, que es
  la forma de que una sesión no la vea. Y que la versión de Claude Code importa: las reglas con
  alcance se comportan distinto antes de la 2.1.211.

## Referencias

- `scripts/agentes/README.md`, con los comandos y los mensajes de la herramienta.
- [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md), que es la regla que esto respeta: cada regla en un solo sitio.
- [ADR-022](ADR-022-openapi-generado.md), que es el molde: una fuente, una copia y una prueba que las compara.
- [ADR-069](ADR-069-el-proyecto-se-llama-emprende.md), que entró antes de este.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [AGENTS](../../AGENTS.md "AGENTS.md") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/agentes/README.md "Herramienta de lo compartido")
<!-- /generado:referenciado-desde -->
