# ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-15 | 2026-10-15 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

Las etiquetas de git ya las pone la tubería: `v<versión>` en la API y el front, en cada empuje a
`develop` (tarea [9.10](../08-plan-de-desarrollo.md#tarea-9-10)), `esquema-vX.Y.Z` en la base ([ADR-029](ADR-029-esquema-por-etiqueta.md)) y `entrega-vN` en el monorepo de
producto ([ADR-052](ADR-052-la-entrega-del-release-a-prod.md), [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md)). Los nombres ya los consumen otros: la CI de la API descarga la base por
etiqueta, y «Actualizar» del monorepo pide la entrega por la suya.

Lo que no había era contenido ni comprobación. El 2026-10-15 había 44 etiquetas:

- el mensaje solo decía la versión, como `prisma_api 2.4.0`, y no qué había entrado desde la
  anterior;
- leer el tramo con `git log` devolvía las fusiones de promoción mezcladas con las tareas;
- seis etiquetas de la base eran ligeras, y dos estaban fuera de la primera línea de `develop`;
- y no existía ningún GitHub Release en ninguno de los cinco repositorios.

Quien dirige pidió ese día un esquema que se respete, y decidir cuándo nace una etiqueta, cuándo un
release y qué cuenta cada uno de su tramo, sabiendo que son incrementales.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Los nombres de hoy, con un patrón, un paso por vez y un mensaje fijo que la tubería escribe y un verificador exige** (la decisión) | No rompe a quien ya descarga por etiqueta. El tramo queda escrito en cada una | Hay que declarar las ocho viejas que no cumplen |
| Un prefijo común (`api-v…`, `front-v…`) | Se ve igual en los cinco | Rompe la CI de la API y «Actualizar» a cambio de nada: cada repositorio ya separa sus etiquetas |
| Rehacer las viejas con el mensaje nuevo | Todas quedarían iguales | Hay que borrarlas del remoto, y dos cambiarían de commit: le cambia la base a quien ya las descargó |
| Un release por etiqueta | Automático y simple | Llena la página con noticias que nadie adopta, casi iguales a la etiqueta |
| Un release solo en la entrega del monorepo | Uno por lo que llega a prod | Esconde cuál de las tres piezas cambió |
| Notas automáticas de GitHub | Ningún guion | Listan PR, promociones incluidas, y no dicen qué cambió para quien usa la versión |

## Decisión

1. **El nombre de cada etiqueta sigue el patrón de su repositorio**, con números sin ceros a la
   izquierda: `vX.Y.Z` en la API, `vX.Y.Z+B` en el front, `esquema-vX.Y.Z` en la base y
   `entrega-vN`, con N desde 1, en el monorepo. La especificación no lleva etiquetas: cada documento
   lleva su versión ([ADR-027](ADR-027-documentacion-versionada.md)).
2. **Toda etiqueta es anotada, la crea el bot de la tubería y no se mueve ni se borra nunca.** Va
   sobre el commit de la primera línea con que la versión entró: `develop` en los tres de código y
   `main` en el monorepo.
3. **Es incremental**: a lo largo de la primera línea, cada una sube un solo paso con respecto a la
   anterior del mismo patrón. En el front el `+BUILD` sube uno, y en el monorepo el número.
4. **Su mensaje tiene forma fija**: un asunto con el proyecto y la versión, y un cuerpo con `Paso:`
   e `Incluye:`, los PR del tramo sin las fusiones de promoción. La base agrega `Migraciones:` y la
   API `Esquema que pide:`. **No nombra otras etiquetas**, salvo en un renglón `Corrige:` cuando
   declara que otra quedó mal.
5. **Lo verifica `verificar-etiquetas.sh`** en cada repositorio de código, en el empuje a `develop`.
   Las ocho etiquetas viejas que no cumplen, y el mensaje de las 44 de antes, quedan en una lista
   cerrada de excepciones que solo se encoge.
6. **El release de la API, el front y la base se publica al llegar a `main`**, sobre la etiqueta de
   su versión, y cuenta el tramo desde el release anterior: junta las etiquetas intermedias. En el
   monorepo, uno por cada `entrega-vN`.
7. **Su cuerpo se genera de los `CHANGELOG.md`, no se escribe.** Junta las entradas que caen en su
   tramo; si la versión que llega no tiene la suya, o a la API y al front su imagen en GHCR con el árbol de esa versión, el release no se
   publica. Tampoco nombra el release anterior.
8. **`RELEASE.md` existe solo en el monorepo**, en `entrega/RELEASE.md`, generado con el mismo texto
   que el release de la entrega. En los repositorios de desarrollo sería un commit en `main` que no
   viene de qa.
9. **Ninguna persona ni sesión crea una etiqueta o un release a mano.** Las skills `etiqueta` y
   `release` revisan, explican y vuelven a correr el flujo; no crean.

## Justificación

**Una etiqueta dice que una versión existe; un release, que se le entrega a alguien.** Por eso la
primera nace en `develop`, donde la versión entra, y el segundo en `main`, donde Gerencia ya la
aprobó en uat. qa no lleva release porque ya lo cuenta su `CHANGELOG.md`.

**El mensaje lo escribe una máquina porque una persona lo olvida.** Las etiquetas de la base se
automatizaron después de saltarse ocho veces seguidas a mano.

**La anterior no se escribe porque se deduce.** Con un paso por vez es siempre la inmediata del
mismo patrón, y escribirla solo agrega algo que puede quedar mal.

## Consecuencias

**Positivas**

- Cada etiqueta dice qué trae, y cada release qué trae desde el anterior.
- Una versión que entró sin etiqueta, o que saltó un número, se ve en la CI.
- Los emprendimientos leen en `entrega/RELEASE.md` qué adoptan antes de correr «Actualizar».

**Negativas**

- Un guion y un verificador más en cada repositorio de código.
- Una entrada que falte en el changelog frena el release en `main`, no en qa.

**A vigilar**

- **Que la lista de excepciones no crezca.** Una etiqueta nueva que no cumple se arregla con la
  siguiente, con su `Corrige:`.
- **Que la imagen del front exista**: hasta que estén `PROD_API_URL` y `PROD_API_MAJOR`, la etapa qa
  se la salta, y el release del front no sale.

## Referencias

- [ADR-014](ADR-014-semver.md) y [ADR-034](ADR-034-la-version-sube-en-cada-pr.md), SemVer por proyecto y un paso por PR.
- [ADR-029](ADR-029-esquema-por-etiqueta.md), la etiqueta del esquema.
- [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md), por qué el cuerpo sale del changelog.
- [ADR-052](ADR-052-la-entrega-del-release-a-prod.md) y [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md), la entrega y su etiqueta.
- [19 §4.4](../19-ambientes-y-entrega.md#44-etiquetas-y-releases), el esquema con sus ejemplos.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
