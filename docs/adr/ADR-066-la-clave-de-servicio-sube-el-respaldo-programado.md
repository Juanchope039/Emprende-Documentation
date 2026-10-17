# ADR-066 · La clave de servicio también sube el respaldo que nadie pidió

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-17 | 2026-10-17 | [Seguridad](../INDICE.md#etiqueta-seguridad) · [API](../INDICE.md#etiqueta-api) |

## Contexto

El [13 §6](../13-respaldo-y-exportacion.md#6-programación-automática) deja elegir entre tres modos: desactivada, mensual el día 1 con el mes anterior
completo, y al cerrar el mes. La [8.14](../08-plan-de-desarrollo.md#tarea-8-14) guardó la elección y la [8.15](../08-plan-de-desarrollo.md#tarea-8-15) dejó las dos rutas
para leerla y cambiarla. La [8.16](../08-plan-de-desarrollo.md#tarea-8-16) es la que tiene que ejecutarla, y al ir a hacerla apareció
un hueco que ningún documento cubría.

**Un respaldo programado no tiene a nadie detrás**, y el archivo solo lo puede armar la API:

- el ZIP y el `manifiesto.json` los escribe `prisma_api`, que es lo único que habla con la base
  ([ADR-025](ADR-025-cuatro-repositorios.md)), así que la base no puede dejar el archivo por su cuenta;
- las dos políticas del bucket `respaldos` son `TO authenticated` y preguntan por
  `fn_es_gerencia()` ([13 §5.1](../13-respaldo-y-exportacion.md#51-quién-arma-el-archivo-la-api)), así que subir pide un JWT que Storage pueda
  **verificar**;
- un JWT así lo emite GoTrue a cambio de una contraseña, y la API no guarda ninguna;
- y el [ADR-033](ADR-033-service-role-solo-en-auth.md) acotó la clave `service_role` a las dos llamadas de administración de
  identidades, así que tampoco hay con qué subir por ahí.

O sea: la programación que el [13 §6](../13-respaldo-y-exportacion.md#6-programación-automática) promete **no tenía credencial con la que cumplirse**.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **El respaldo programado se queda sin archivo**: la fila y el manifiesto, y el ZIP se arma cuando alguien lo baje | Ningún secreto nuevo. La programación opera sin credencial | Cambia lo que el [13 §5](../13-respaldo-y-exportacion.md#5-generación-y-descarga) promete —doce archivos retenidos— y convierte la retención en otra cosa. Un respaldo que solo existe si alguien lo pide no es un respaldo automático |
| **`pg_cron` llama a la API** con una credencial guardada en la base | El disparo se queda entero en la base | Pide escribir una credencial en la base, que es justo lo que el `CLAUDE.md` de `prisma_db` prohíbe. Y seguiría sin resolver con qué sube la API |
| **La API lo atiende con el token de la primera persona de Gerencia que entre** después de marcarse el mes | Ningún uso nuevo de la clave de servicio. El token es de verdad y Storage lo acepta | El archivo no aparece a medianoche, sino cuando alguien entra. Quien dirige lo descartó: la programación es para no depender de que alguien entre |
| **Guardar un usuario de servicio con contraseña** y entrar como él por GoTrue | La clave de servicio no se amplía | Es una cuenta con contraseña en el despliegue, que es el mismo secreto con otro nombre y además aparece en `usuarios` como si fuera una persona |

## Decisión

**La API usa la clave `service_role` para subir al bucket `respaldos` el archivo que la programación
disparó, y para nada más.** Es el segundo y último uso de esa clave.

| Para qué | Llamada | ADR |
|---|---|---|
| Crear la identidad de alguien nuevo | `POST /auth/v1/admin/users` | [ADR-033](ADR-033-service-role-solo-en-auth.md) |
| Restablecer la contraseña de otra persona | `PUT /auth/v1/admin/users/{id}` | [ADR-033](ADR-033-service-role-solo-en-auth.md) |
| Subir el respaldo que nadie pidió | `POST /storage/v1/object/respaldos/{ruta}` | este |

**Y queda acotado a subir.** La descarga sigue yendo con el `access_token` de quien la pide, así que
esta clave no abre ni un objeto que esa persona no pudiera abrir. Lo exige una prueba, no una frase.

**La identidad con que corre el respaldo es la de quien eligió la programación.** No «el sistema»:
la base no deja preguntar sin identidad, y quien pidió que esto pasara es esa persona. El id lo
entrega `fn_quien_eligio_la_programacion()`, que es `SECURITY DEFINER` porque la fila que dice quién
es no se puede leer sin ser alguien, y lo único que devuelve es un id.

Lo que **no** cambia:

1. La API se sigue conectando a la base como `prisma_api`, sin `SUPERUSER` y sin `BYPASSRLS`.
2. **La fila de `exportaciones` se escribe antes de subir, y con la identidad de una persona.** Quién
   puede tener un respaldo lo sigue juzgando `exportaciones_solo_gerencia`, no la clave.
3. La clave sigue viviendo en un secreto distinto del de la base y del de las migraciones, y no se
   usa nunca contra PostgreSQL ni contra PostgREST.
4. El trabajo programado solo existe en prod ([13 §1.1](../13-respaldo-y-exportacion.md#11-el-respaldo-es-por-ambiente-y-solo-uno-importa)), así que en dev, qa y uat esa clave no
   sube nada.

## Justificación

**El peligro que el [ADR-012](ADR-012-identidad-a-postgres.md) nombra es que RLS deje de aplicar, y aquí tampoco pasa.** El permiso
de fondo —quién puede tener un respaldo— vive en la política de la fila, que se evalúa antes de la
subida y con una persona puesta. La clave no decide quién puede: decide con qué se transportan unos
bytes a un bucket privado cuya ruta ya está apuntada en una fila que RLS juzgó.

**Subir no es leer, y es la mitad que importa.** El riesgo de una clave que anula políticas es sacar
datos, no meterlos. Acotarla a `subir` deja fuera precisamente el verbo peligroso, y eso se puede
comprobar mirando un archivo.

**La alternativa que no pedía secreto pedía una persona.** Atender el mes con el token de quien entre
funciona, y es más barata, pero hace que el respaldo del día 1 dependa de que alguien abra la
aplicación. Un respaldo automático existe para los días en que nadie la abre.

**Lo que se paga se dice en voz alta:** la clave más peligrosa del sistema gana un segundo camino, y
ese camino corre solo, sin nadie mirando. Si la máquina de prod se compromete, lo que el atacante
gana no es ese camino —ya tenía la clave—, pero el día que alguien amplíe este uso «un poquito más»
no habrá una frase que lo frene, sino una prueba. Esa es la razón de que la prueba exista.

## Consecuencias

- **Positivas:** la [8.16](../08-plan-de-desarrollo.md#tarea-8-16) se puede hacer; el [13 §6](../13-respaldo-y-exportacion.md#6-programación-automática) se cumple tal como está escrito,
  sin recortar la retención; y el respaldo programado se baja, se verifica y se retiene como
  cualquier otro, porque es el mismo archivo armado por el mismo camino.
- **Negativas:** en prod hay un trabajo que corre sin nadie delante y con la clave que anula
  políticas. Un fallo suyo no lo ve ningún usuario: queda en el registro, y la fila pendiente sin
  atender es la única señal visible de que algo no se hizo.
- **Obligación que nace de esta decisión:** la prueba que vigila la clave deja de aceptar un solo
  archivo y pasa a aceptar dos, y **comprueba además que en el almacén la clave solo sube**. Sin esa
  segunda mitad, «acotado a subir» dura hasta que alguien tenga prisa.
- **Lo que sigue prohibido, y conviene releerlo:** conectarse a PostgreSQL con esa clave, usarla
  contra PostgREST, usarla para bajar un respaldo, y pasarla al front por cualquier vía.
- **Reemplaza al [ADR-033](ADR-033-service-role-solo-en-auth.md)**, que queda ⛔ Reemplazado: su decisión sigue vigente en lo que dice,
  y lo que cambia es que ya no es la lista completa.

## Referencias

- [ADR-033](ADR-033-service-role-solo-en-auth.md) · el que este reemplaza, y de donde salen las dos primeras llamadas
- [ADR-012](ADR-012-identidad-a-postgres.md) · la identidad viaja hasta PostgreSQL — su cuarta condición sigue intacta
- [ADR-047](ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) · el que metió el respaldo con manifiesto al plan
- [13 §6](../13-respaldo-y-exportacion.md#6-programación-automática) · los tres modos que esta decisión permite cumplir
- [R-21](../11-riesgos-y-proteccion-de-datos.md#r-21) · el riesgo que esta decisión roza y no mueve

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [13](../13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [ADR-033](ADR-033-service-role-solo-en-auth.md "ADR-033 · La clave de servicio entra, pero solo para crear identidades")
<!-- /generado:referenciado-desde -->
