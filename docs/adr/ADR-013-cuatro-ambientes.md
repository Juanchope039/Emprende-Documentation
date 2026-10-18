# ADR-013 · Cuatro ambientes y promoción de migraciones

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-013-cuatro-ambientes.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-10-03 | [Entrega](../INDICE.md#etiqueta-entrega) |

> **Lo modifica [ADR-044](ADR-044-dos-ambientes-desplegados.md):** los cuatro ambientes y su orden de
> promoción siguen, pero **solo dev y prod se despliegan**. qa y uat son etapas de la tubería, cada
> una más exhaustiva que la anterior, y el proyecto qa de Supabase queda quieto. El cuerpo de abajo
> se conserva tal como se escribió.

## Contexto

El esquema ya se recrea con migraciones versionadas y semilla fija
([`16-base-de-datos-y-snapshots.md`](../16-base-de-datos-y-snapshots.md)), pero nunca se dijo
**a dónde** se aplican ni **en qué orden**. Eso sirve mientras nadie use el sistema de verdad; el
día que la dueña del taller registre la venta del lunes, probar una migración es probar sobre la
plata real.

Se pidieron tres ambientes —dev, qa y uat— y, al preguntar por producción, quedaron **cuatro**.
Se pidió también que la base esté **siempre en línea**.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| Un solo ambiente | Cero costo, cero ceremonia | Cada prueba y cada migración se hacen sobre datos reales; no hay dónde equivocarse |
| Dos: dev y prod | Barato y simple; separa lo real de lo que se está escribiendo | No hay dónde correr las pruebas automáticas sin ensuciar dev, ni dónde aprobar antes de publicar |
| Tres: dev, qa y uat | Cubre desarrollo, pruebas y aprobación | No existe el ambiente del negocio: lo aprobado en UAT no tiene a dónde ir |
| **Cuatro: dev, qa, uat y prod** | Cada actividad tiene su sitio y prod solo recibe lo ya aprobado | Cuatro proyectos que configurar, versionar y pagar en parte |

## Decisión

**Cuatro ambientes, cada uno un proyecto de Supabase distinto, y las migraciones se promueven en
orden.**

| Ambiente | Para qué sirve | Quién entra | Datos |
|---|---|---|---|
| **dev** | Desarrollo diario | Quien desarrolla | Ficticios. Se pueden borrar y volver a sembrar |
| **qa** | Pruebas automáticas y manuales | Desarrollo y pruebas | Ficticios, con semilla reproducible |
| **uat** | Aprobación de Gerencia antes de publicar | Gerencia y la empleada | Realistas, **anonimizados** |
| **prod** | El negocio de verdad | El equipo del taller | Reales |

Las reglas que hacen que eso signifique algo:

1. **Cada ambiente es un proyecto de Supabase distinto**, con su propia base, sus propias claves
   y su propio almacenamiento. Nunca comparten base.
2. **Las migraciones se promueven en orden**: dev → qa → uat → prod. Nunca se aplica una
   migración en prod que no haya pasado por los tres anteriores.
3. **Una migración ya aplicada no se edita jamás.** Si estaba mal, se escribe otra que corrige.
   Es el mismo principio del contra-asiento de [CU-04](../02-casos-de-uso.md#cu-04) ([`02-casos-de-uso.md`](../02-casos-de-uso.md))
   y de la base de solo escritura de [ADR-004](ADR-004-base-solo-escritura.md).
4. **El artefacto se promueve, no se reconstruye.** Lo que se aprobó en UAT es exactamente lo
   que llega a prod, con la misma versión. Recompilar para prod sería aprobar una cosa y
   publicar otra.
5. **Nunca se copian datos de prod a otro ambiente sin anonimizar.** Los nombres completos, los
   documentos y los salarios de las empleadas son datos personales bajo la Ley 1581 de 2012, y
   [`11-riesgos-y-proteccion-de-datos.md`](../11-riesgos-y-proteccion-de-datos.md) ya fija su
   tratamiento. UAT lleva datos anonimizados.
6. **La configuración no vive en el código.** En Flutter entra por `--dart-define` en el momento
   de compilar; en la API, por variables de entorno. Ningún secreto queda en el repositorio.

## Justificación

**Separar ambientes es lo que permite equivocarse.** Sin qa no hay dónde correr las pruebas sin
ensuciar el trabajo de nadie; sin uat, Gerencia aprueba mirando capturas de pantalla; sin prod
separado, cada despliegue es una apuesta sobre los datos del negocio.

**Promover en orden es lo que hace que la aprobación signifique algo.** Si prod puede recibir una
migración que no pasó por uat, entonces lo que se aprobó y lo que se publicó no son lo mismo, y
la aprobación era un trámite.

**No editar una migración aplicada es el mismo principio que ya rige los movimientos.** Una
migración es un hecho ocurrido en una base; corregirla hacia atrás deja dos ambientes que dicen
tener el mismo esquema y no lo tienen.

## Consecuencias

- **Positivas:** hay dónde equivocarse sin consecuencias; lo que llega a prod es exactamente lo
  aprobado, con la misma versión; el historial de migraciones cuenta la verdad de lo que pasó en
  cada base.
- **Negativas:** cuatro proyectos que configurar y mantener sincronizados, cuatro juegos de
  claves que custodiar, y un despliegue que ya no es «subir y listo» sino una promoción que
  atraviesa los cuatro ambientes en orden.
- **Costo, dicho sin adornos:** [ADR-001](ADR-001-stack.md) declaró **presupuesto de operación
  cero**. Esto lo rompe. «Siempre en línea» significa que la base **no puede estar en el plan
  gratuito de Supabase**, porque ese plan pausa el proyecto tras una semana de inactividad: un
  taller que factura los lunes encontraría el sistema dormido. **prod y uat necesitan plan de
  pago.** dev y qa pueden quedarse en el gratuito, porque que se pausen por inactividad ahí no
  molesta a nadie. Son, como mínimo, **dos proyectos de pago** en vez de cero.

> **Esto no es un impedimento, es una factura.** Va escrita aquí y en el plan de implantación
> para que nadie la descubra el día del go-live.

> **De prod no sale un dato sin anonimizar, nunca.** Copiar la base de prod a uat «para probar
> con datos de verdad» es la forma más rápida de sacar nombres, documentos y salarios de las
> empleadas del único sitio donde tienen tratamiento declarado.

## Referencias

- [ADR-001 · Stack tecnológico](ADR-001-stack.md)
- [ADR-004 · Base de datos de solo escritura](ADR-004-base-solo-escritura.md)
- [`11-riesgos-y-proteccion-de-datos.md`](../11-riesgos-y-proteccion-de-datos.md)
- [`16-base-de-datos-y-snapshots.md`](../16-base-de-datos-y-snapshots.md)
- [`09-plan-de-implantacion.md`](../09-plan-de-implantacion.md)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [13](../13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [16](../16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-011](ADR-011-stack-flutter-dart.md "ADR-011 · Stack: Flutter y Dart con API propia") · [ADR-017](ADR-017-api-en-java.md "ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API") · [ADR-025](ADR-025-cuatro-repositorios.md "ADR-025 · Cuatro repositorios: la base de datos sale de la API") · [ADR-026](ADR-026-railway-al-final.md "ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo") · [ADR-032](ADR-032-railway-en-dev-ahora.md "ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md "ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio")
<!-- /generado:referenciado-desde -->
