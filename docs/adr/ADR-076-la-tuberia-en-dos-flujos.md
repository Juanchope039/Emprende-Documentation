# ADR-076 · La tubería de cada repositorio de código va en dos flujos

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-076-la-tuberia-en-dos-flujos.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-29 | 2026-10-29 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

`prisma_api`, `prisma_db` y `prisma_front` tenían 18 flujos entre los tres. `milestone-del-pr.yml` y
`proyecto-del-pr.yml` eran copias idénticas en los tres, `changelog.yml` solo cambiaba en los
comentarios, y cada repositorio tenía además su flujo de etiquetas y, en la API, el de SonarCloud.
La API corría también en el empuje a `feature/*`, así que cada empuje a una rama con PR abierto
corría la tubería dos veces. Y el changelog, aunque su comentario lo pedía, no bloqueaba nada.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejar un flujo por puerta | Cada archivo es corto | Copias que se desalinean, y un empuje que corre dos veces |
| Un flujo reusable en otro repositorio | Una sola copia de las reglas del PR | Abre el acceso de Actions entre repositorios privados y ata cada uno a otro |
| **Dos flujos por repositorio, agrupados por clase** | La tubería en un archivo y las reglas del PR en otro | Un archivo de tubería más largo |

## Decisión

1. **`continuous-integration.yml` es toda la tubería**, con el mismo nombre en los tres
   repositorios. Corre en el empuje a `develop`, `qa` y `main`, en cada PR a esas tres y a mano.
   **Ningún empuje a otra rama la dispara.**
2. **Adentro van, cada uno en su trabajo y solo en su etapa,** el changelog (`qa`), las etiquetas
   de la versión (al fusionar a `develop`) y, en `prisma_api`, el análisis de SonarCloud
   (`develop`). Los nombres de los trabajos no cambian, así que los rulesets ven los mismos checks.
3. **El changelog y SonarCloud entran a las dos puertas.** En `qa` el changelog bloquea por
   «Tubería en verde»; SonarCloud corre en `develop`, donde «Tubería completa» pide que termine y
   no que pase ([ADR-048](ADR-048-las-ramas-principales-las-protege-github.md)).
4. **`reglas-del-pr.yml` lleva lo que se mira del PR mismo**: «El PR tiene milestone» ([ADR-063](ADR-063-todo-issue-y-todo-pr-lleva-milestone.md)).
   «El PR está en el proyecto» ya no está ([ADR-074](ADR-074-el-check-del-proyecto-se-quita.md)).
5. **`prisma_db` conserva aparte `migrar.yml` y `entregar-release.yml`**, porque escriben en bases
   con datos. Esta especificación no tiene tubería y conserva `milestone-del-pr.yml`.
6. **Los pasos repetidos van a una acción compuesta**: `preparar-java` en `prisma_api`, como
   `preparar-flutter` en `prisma_front`.
7. **La medición de rendimiento de `prisma_front` publica su nginx en el 18080.** El runner propio es
   la misma máquina donde corre el front de dev, que ya tiene el 8080.

## Justificación

Las piezas que cambian juntas viven juntas: la tubería de un repositorio es una, y las reglas del
PR son otra. Copiar el mismo archivo en tres repositorios es lo que permitía que una copia se
quedara atrás, y disparar en `feature/*` no protegía nada que el PR no protegiera ya.

## Consecuencias

- **Positivas:** de 18 flujos a 8, una sola corrida por empuje y el changelog con dientes en `qa`.
- **Negativas:** `continuous-integration.yml` crece, y un error de sintaxis en él apaga toda la
  tubería del repositorio a la vez.
- **A vigilar:** que un trabajo nuevo entre a los `needs` de las dos puertas, o queda fuera de la
  protección de la rama.

## Referencias

- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), con las dos puertas; [ADR-063](ADR-063-todo-issue-y-todo-pr-lleva-milestone.md), con el milestone; [ADR-074](ADR-074-el-check-del-proyecto-se-quita.md), que quita el check del proyecto.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-074](ADR-074-el-check-del-proyecto-se-quita.md "ADR-074 · El check del proyecto se quita de los cuatro repositorios") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
