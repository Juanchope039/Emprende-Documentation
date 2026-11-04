# ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-04 | 2026-10-04 | [Plan](../INDICE.md#etiqueta-plan) · [Base de datos](../INDICE.md#etiqueta-base-de-datos) · [Seguridad](../INDICE.md#etiqueta-seguridad) |

## Contexto

El detalle de los 37 casos de uso dejó al descubierto que dos de ellos no se podían dibujar contra
una ruta real, y la razón era distinta en cada uno.

**[CU-22](../02-casos-de-uso.md#cu-22), el respaldo con manifiesto, tenía todo menos por dónde pedirlo.** Su diseño está completo en
[`13-respaldo-y-exportacion.md`](../13-respaldo-y-exportacion.md) —los cuatro alcances, los tres formatos, el contenido del manifiesto,
la retención de doce archivos y la programación—, la tabla `exportaciones` está migrada con el CHECK
que exige manifiesto a todo lo que no sea una descarga de pantalla, y el rango 70–79 del catálogo de
códigos está reservado para él. No tenía ruta, ni tarea, ni pantalla.

**[CU-23](../02-casos-de-uso.md#cu-23) tenía la mitad.** `POST /api/v0/consultas/bitacora` devuelve los doce eventos de
administración sobre `usuarios` y `cargos`, y su propia descripción dice que no trae los inicios de
sesión. Su cuerpo lleva un solo campo, `limite`: ni fecha, ni persona, ni qué se tocó. Y su entrada
no trae `dispositivo` ni `ip`.

Lo que hace grave lo segundo es que el dato ya está escrito. Desde la tarea [2.9](../08-plan-de-desarrollo.md#tarea-2-9), `auditoria` guarda
`inicio_sesion`, `cierre_sesion` e `inicio_sesion_fallido` con su fecha, su dispositivo y su IP. El
hueco es de lectura: la vista `v_bitacora_usuarios` filtra por dos tablas y la pantalla filtra
además por acción, así que lo que la base guarda no tiene por dónde salir.

Y el plan ya se había comprometido con los dos. La fila de requisitos del [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) declara cubrir
[RF-54](../03-requisitos-y-bdd.md#rf-54) a [RF-69](../03-requisitos-y-bdd.md#rf-69) —[RF-66](../03-requisitos-y-bdd.md#rf-66) y [RF-67](../03-requisitos-y-bdd.md#rf-67) adentro— y ninguna de sus doce tareas los construye. [RF-67](../03-requisitos-y-bdd.md#rf-67) es prioridad
**M**. El escenario [BDD-23-1](../03-requisitos-y-bdd.md#bdd-23-1) pide ver «usuario, rol, fecha, dispositivo, IP, datos antes y después»,
y hoy no lo cumple ninguna operación del contrato.

Contra eso, cuatro documentos decían que el exportador no se construía en esta versión: el 01 en su
tabla de fuera de alcance, la cabecera y el [13 §1](../13-respaldo-y-exportacion.md#1-niveles-de-respaldo), el [07 §11](../07-arquitectura.md#11-respaldos), y el 14 con la deuda [D-05](../14-roadmap-e-ideas.md#d-05) y la idea
01, las dos fechadas en «mes 2 post go-live».

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Los dos entran al [Sprint 8](../08-plan-de-desarrollo.md#sprint-8)** | Cumple lo que la fila de requisitos del [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) ya prometía. [RF-67](../03-requisitos-y-bdd.md#rf-67) es M y deja de estar sin construir. El checklist de go-live del 09 pide una exportación inicial que hoy nadie puede hacer. [BDD-23-1](../03-requisitos-y-bdd.md#bdd-23-1) pasa a tener quien lo cumpla | El [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) crece unos diez días, y es el que cierra el alcance funcional. Son cuatro documentos que se invierten, y el 13 y el 01 en MAJOR |
| Sostener el estado anterior: los dos al roadmap | No cambia ningún documento y el [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) no crece | Obliga a bajar [RF-66](../03-requisitos-y-bdd.md#rf-66) de la fila de requisitos del [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) y a declarar [RF-67](../03-requisitos-y-bdd.md#rf-67) sin construir, siendo M. Deja dos casos de uso dibujados contra una nota en vez de una ruta |
| Solo la auditoría ahora, el respaldo al roadmap | Arregla lo urgente —[RF-67](../03-requisitos-y-bdd.md#rf-67) es M y [RF-66](../03-requisitos-y-bdd.md#rf-66) es S— sin tocar el alcance del MVP | Deja el 09 pidiendo en el go-live un respaldo que nadie puede generar, y a [CU-22](../02-casos-de-uso.md#cu-22) como el único caso de los 37 sin ruta |
| Ampliar `consultas/bitacora` en vez de una ruta nueva | Una sola operación en lugar de dos | Esa operación alimenta Gestión de usuarios y es la que [CU-35](../02-casos-de-uso.md#cu-35) revierte; su forma está acordada desde el contrato 0.16.0. Mezclar la auditoría de todas las tablas junta dos pantallas que el 10 tiene separadas |

## Decisión

**La construcción del exportador de respaldos deja de ser posterior al go-live y entra al [Sprint 8](../08-plan-de-desarrollo.md#sprint-8),
y la consulta filtrable de toda la auditoría —que nunca estuvo diferida— gana por fin su tarea.**

| Qué | Dónde queda |
|---|---|
| El contrato de las seis operaciones nuevas | Tarea [8.13](../08-plan-de-desarrollo.md#tarea-8-13) |
| El bucket `respaldos`, la RLS y la purga de retención | Tarea [8.14](../08-plan-de-desarrollo.md#tarea-8-14) |
| El respaldo en la API: alcances, formatos, `sha256` y manifiesto | Tarea [8.15](../08-plan-de-desarrollo.md#tarea-8-15) |
| La programación automática del [13 §6](../13-respaldo-y-exportacion.md#6-programación-automática) | Tarea [8.16](../08-plan-de-desarrollo.md#tarea-8-16) |
| La pantalla «Configuración» y el panel «Exportar respaldo» | Tarea [8.17](../08-plan-de-desarrollo.md#tarea-8-17) |
| La auditoría completa en la API | Tarea [8.18](../08-plan-de-desarrollo.md#tarea-8-18) |
| El panel «Auditoría» | Tarea [8.19](../08-plan-de-desarrollo.md#tarea-8-19) |

**El alcance que se construye es el ancho**: los cuatro alcances del [13 §2](../13-respaldo-y-exportacion.md#2-alcance-seleccionable) —total, por mes, por rango
y una tabla—, los tres formatos del [§3](../13-respaldo-y-exportacion.md#3-formatos) y la programación del [§6](../13-respaldo-y-exportacion.md#6-programación-automática). [RF-66](../03-requisitos-y-bdd.md#rf-66) habla de «la base completa o
de un mes», que es el piso; el 13 ya especifica los cuatro y los tres. **[RF-66](../03-requisitos-y-bdd.md#rf-66) y [RF-67](../03-requisitos-y-bdd.md#rf-67) no cambian de
texto**: el 13 manda sobre el alcance.

**La auditoría completa va en ruta nueva, `POST /api/v0/consultas/auditoria`**, con filtros por
fecha, persona, tabla y acción, y con `dispositivo`, `ip` y el antes y el después en cada entrada.
Lee `auditoria` entera, no la vista. `POST /api/v0/consultas/bitacora` no cambia.

**Las dos pantallas viven en «Configuración», que vuelve al menú de Gerencia.** Es la casa que ya les
da el [10 §2](../10-ux-y-mockups.md#2-mapa-de-navegación), y su [§2.1](../10-ux-y-mockups.md#21-navegación-por-rol) ya lista esa entrada; el mockup la había disuelto cuando el pro-labore, los
sobres y la importación encontraron mejor sitio, y estos dos no lo tienen. Las pantallas pasan de
once a doce y la clave `configuracion` se suma a las ocho de `Seccion`.

**[D-06](../14-roadmap-e-ideas.md#d-06) se queda diferido.** El procedimiento y el simulacro de restauración siguen fuera de alcance,
y la prueba [RE-01](../12-pruebas-y-calidad.md#re-01) del 12 depende de ellos, no de esto.

## Justificación

**Lo que decide es que el plan ya lo había prometido.** No es alcance que aparece durante el
desarrollo —ese va al roadmap, como manda el [08 §6](../08-plan-de-desarrollo.md#6-backlog-priorizado)—, sino dos requisitos que llevan en la lista desde
el principio, uno de ellos imprescindible, y que la fila de requisitos del [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) declara cubrir.
Lo que había era una contradicción entre el plan y el roadmap, y se resuelve hacia el plan.

**Lo segundo que decide es el costo de no hacerlo.** El 09 pone «se hizo una exportación de respaldo
inicial» en el paso 7 del checklist de go-live. Sin la tarea, ese paso no se puede marcar nunca, y un
checklist con una casilla imposible deja de ser un checklist.

**Y en la auditoría no hay ni siquiera esa discusión.** [RF-67](../03-requisitos-y-bdd.md#rf-67) es M, nunca estuvo en ninguna lista de
diferidos, y [BDD-23-1](../03-requisitos-y-bdd.md#bdd-23-1) describe una pantalla que no existe. Lo único que faltaba era que alguien
escribiera la tarea.

## Consecuencias

**Positivas**

- Los 37 casos de uso quedan dibujados contra rutas reales, y el [23 §6](../23-diagramas-de-casos-de-uso.md#6-las-negativas-que-no-vienen-de-la-base) se reduce a las siete
  negativas que hoy da la API y no la base.
- La independencia del proveedor, que es lo que el [13 §1](../13-respaldo-y-exportacion.md#1-niveles-de-respaldo) dice que protege el nivel 2, deja de
  depender de una fase que nadie había fechado.
- Los inicios de sesión que la base guarda desde la tarea [2.9](../08-plan-de-desarrollo.md#tarea-2-9) pasan a poder leerse, y [RNF-18](../03-requisitos-y-bdd.md#rnf-18) se
  comprueba sobre algo visible en vez de sobre una tabla.

**Negativas**

- **El [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) crece unos diez días** y es el que cierra el alcance funcional, así que el calendario
  del [08 §1.1](../08-plan-de-desarrollo.md#11-cuánto-dura-con-1-2-o-3-carriles-activos) se mueve en los tres escenarios de carriles.
- **El 13 y el 01 suben MAJOR**, y con ellos el 07 y el 14: quien leyera la versión anterior creería
  que el respaldo no se construye.
- Aparece infraestructura nueva que hasta ahora no hacía falta: un segundo bucket privado y una
  programación con `pg_cron` que genera archivos pesados sin que nadie la mire.

**A vigilar**

- **Un respaldo que nunca se restauró sigue siendo una suposición.** Lo que cambia es que ahora
  existirá el archivo; [D-06](../14-roadmap-e-ideas.md#d-06) sigue pendiente y conviene no confundir una cosa con la otra.
- La retención de doce archivos con los cuatro alcances y los tres formatos puede crecer más de lo
  previsto. El tope de 5 MB que el contrato fija para otras cosas no le sirve a esto.
- Si «Configuración» vuelve al menú, hay que vigilar que no se convierta otra vez en el cajón donde
  cae lo que no tiene casa. Hoy tiene dos inquilinos y una razón para cada uno.

## Referencias

- [ADR-008](ADR-008-exportacion.md), que decidió cómo es la exportación; este decide cuándo se construye.
- [ADR-005](ADR-005-auditoria-por-triggers.md) y [ADR-004](ADR-004-base-solo-escritura.md), de donde sale que la auditoría la escriben triggers y no se edita.
- [`13-respaldo-y-exportacion.md`](../13-respaldo-y-exportacion.md), el diseño entero del respaldo, y [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md), el
  [Sprint 8](../08-plan-de-desarrollo.md#sprint-8).
- [`14-roadmap-e-ideas.md`](../14-roadmap-e-ideas.md), de donde salen [D-05](../14-roadmap-e-ideas.md#d-05) y la idea 01, y donde se queda [D-06](../14-roadmap-e-ideas.md#d-06).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [01](../01-vision-y-alcance.md "01 · Visión y alcance") · [02](../02-casos-de-uso.md "02 · Casos de uso") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](../10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [13](../13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [14](../14-roadmap-e-ideas.md "14 · Roadmap e ideas de valor") · [23](../23-diagramas-de-casos-de-uso.md "23 · Diagramas de los casos de uso") · [Contrato](../../contrato/README.md "Contrato de la API · v0.37.0") · [ADR-066](ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md "ADR-066 · La clave de servicio también sube el respaldo que nadie pidió") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive")
<!-- /generado:referenciado-desde -->
