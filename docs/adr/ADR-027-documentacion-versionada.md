# ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-027-documentacion-versionada.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-16 | 2026-09-16 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

La especificación llegó a 53 documentos y unas 13 850 líneas, con más de 1 600 referencias por
identificador —[RF-84](../03-requisitos-y-bdd.md#rf-84), [CU-04](../02-casos-de-uso.md#cu-04), [ADR-012](ADR-012-identidad-a-postgres.md), [BDD-07-1](../03-requisitos-y-bdd.md#bdd-07-1)— y 311 referencias a secciones con «§».
**Ninguna era un enlace.** Seguir una referencia era buscarla a mano, y nada avisaba si apuntaba a
una sección que ya no existía.

Tampoco había forma de saber qué versión de un documento había leído cada quien. Los documentos
cambian con cada decisión —el paso a Java reescribió media arquitectura, [ADR-025](ADR-025-cuatro-repositorios.md) sacó la base de
datos a su propio repositorio— y la única pista era la fecha del archivo en disco, que cambia con
cualquier edición y no dice si el cambio importa.

Y aparece un motivo nuevo: **el plan pasa a trabajarse en carriles paralelos**
([08-plan-de-desarrollo.md](../08-plan-de-desarrollo.md) y [21-trabajo-en-paralelo.md](../21-trabajo-en-paralelo.md)). Varios frentes van a leer y cambiar los
mismos documentos a la vez, y un documento que cambió sin avisar es justo lo que desincroniza a dos
carriles.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Encabezado visible, anclas y enlaces generados, todo verificado en CI** | Se ve igual en GitHub, en el editor y en cualquier visor de Markdown. Las reglas las hace cumplir la integración continua, no la memoria de nadie | Una herramienta más que mantener, con sus falsos positivos. Los bloques generados chocan en los merge y hay que regenerarlos |
| Metadatos en *front matter* YAML | Cualquier herramienta los lee | GitHub los pinta, pero los editores y otros visores no; y no enlaza ninguna referencia |
| Solo el historial de git | Cero trabajo | No dice si un cambio importa, no se ve al leer, y las referencias siguen sin llevar a ningún sitio |
| Mover la documentación a una wiki o a Notion | Enlaces y versiones vienen hechos | Se separa del código y del contrato, que viven en git, y deja de revisarse en el mismo PR que el cambio que la motiva |

## Decisión

1. **Todo archivo Markdown del proyecto lleva un encabezado** con versión SemVer, estado, fecha de
   creación, fecha de actualización y etiquetas. Los README de código agregan la versión de su
   código, y el del contrato la del contrato. Las reglas están en [22-documentacion.md](../22-documentacion.md).
2. **Toda referencia es un enlace a su sitio exacto**, con anclas propias para cada identificador, y
   cada documento dice al pie quién lo cita.
3. **Lo pone una herramienta y lo verifica la integración continua:** `scripts/docs/documentar.mjs`.
   La construcción falla si un encabezado está mal, si un enlace o una referencia no llevan a ningún
   sitio, o si el contenido de un documento cambió sin subir su versión.
4. **La línea base es la 1.0.0 del 16/09/2026** para todo lo vigente, y 0.y.z para las propuestas.
   Las versiones anteriores no se reconstruyen.

## Justificación

**Una referencia que no se puede seguir no es una referencia: es una tarea.** Quien lee «ver [RF-84](../03-requisitos-y-bdd.md#rf-84)»
en el plan y tiene que abrir otro documento y buscar la fila, la mitad de las veces no lo hace. Con
el enlace, comprobar cuesta un clic, y la documentación se usa como se diseñó: como una red y no
como 53 archivos sueltos.

**La versión dice si hay que volver a leer.** Una fecha de modificación no distingue una errata de
una fórmula nueva. MAJOR sí: significa que lo que alguien hacía según la versión anterior ahora está
mal. Con carriles en paralelo, esa es la señal que evita trabajar sobre una regla vieja.

**Si no lo verifica la integración continua, no se cumple.** Es el mismo argumento de la regla de
dependencias con ArchUnit ([ADR-002](ADR-002-arquitectura-hexagonal.md)) y de la prueba [C-04](../12-pruebas-y-calidad.md#c-04) ([ADR-022](ADR-022-openapi-generado.md)): una regla que depende de que
alguien se acuerde se olvida al tercer PR.

## Consecuencias

- **Positivas:** toda referencia lleva a su sitio; la versión y el estado de cada documento se leen
  sin abrir git; «Referenciado desde» muestra qué se afecta al cambiar algo; y el plan calcula su
  calendario de las dependencias en vez de escribirlo a mano.

- **Negativas:** una herramienta de unas mil líneas que alguien tiene que mantener. Cada cambio de
  documentación pide dos pasos más: subir la versión y correr `enlazar`. Los bloques generados
  chocan en los merge y se regeneran en vez de resolverse a mano. Y el primer commit con los
  encabezados y los enlaces toca todos los documentos a la vez.

- **A vigilar:** si la herramienta empieza a necesitar excepciones por documento, o si la gente
  sube versiones sin mirar la regla solo para que pase la verificación, las versiones dejan de decir
  algo. En ese punto conviene quedarse solo con los enlaces verificados y soltar las versiones.

## Referencias

- [22-documentacion.md](../22-documentacion.md) — las reglas: encabezado, versiones, estados, etiquetas y referencias
- [ADR-014](ADR-014-semver.md) — SemVer para el código; esta decisión lo extiende a la documentación
- [ADR-022](ADR-022-openapi-generado.md) — el contrato generado y verificado en CI, el mismo principio aplicado al OpenAPI
- [21-trabajo-en-paralelo.md](../21-trabajo-en-paralelo.md) — los carriles que motivan versionar lo que se comparte

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [22](../22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [ADR-028](ADR-028-un-commit-por-tarea.md "ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué") · [ADR-035](ADR-035-repositorios-hermanos.md "ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo") · [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/docs/README.md "Herramienta de documentación")
<!-- /generado:referenciado-desde -->
