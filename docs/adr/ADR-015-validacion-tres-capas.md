# ADR-015 · Validación en tres capas, con la base como juez

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-015-validacion-tres-capas.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-018](ADR-018-front-sin-decisiones.md) | 2026-09-15 | 2026-09-16 | [Arquitectura](../INDICE.md#etiqueta-arquitectura) · [Front](../INDICE.md#etiqueta-front) · [API](../INDICE.md#etiqueta-api) |

> **Lo reemplaza [ADR-018](ADR-018-front-sin-decisiones.md):** la base y la API siguen decidiendo
> y el contrato de errores se conserva, pero el front deja de tener su copia de las reglas y pasa
> a pintar el descriptor que la API le dicta. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

Con `prisma_api` en medio, una misma regla —«el valor de un movimiento es mayor que cero»— puede
vivir en tres sitios: el formulario del front, el caso de uso de la API y la restricción de
PostgreSQL. Hay que decidir en cuántos de los tres vive.

Lo que pidió el usuario fue explícito: **que la base valide todo lo posible y que la lógica
interna sea «un poco redundante pero necesaria».** Este ADR escribe esa idea de forma que se
pueda sostener, porque a alguien le va a parecer trabajo repetido y va a querer quitarlo.

La pregunta no es si validar tres veces cuesta más. Cuesta más. La pregunta es qué se pierde al
validar una sola vez, y dónde.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Las tres capas, con la base como juez** | Nadie se salta la base; el fallo llega rápido y en español | Tres sitios que pueden separarse con el tiempo |
| Validar solo en la base | Una sola fuente de verdad; imposible de saltar | Devuelve `23514 check_violation`, no un mensaje para la dueña del taller; un viaje a la red por cada error de dedo |
| Validar solo en la API | Mensajes buenos y una sola implementación | Se salta llamando a la base por fuera; **no resuelve la concurrencia**: dos peticiones simultáneas pasan las dos el mismo `if` |
| Validar solo en el front | Respuesta instantánea, cero costo de red | Se salta con las herramientas del navegador. No es validación, es comodidad |

## Decisión

> **La base de datos es la única capa que nadie puede saltarse, así que es la única que decide.
> Las otras dos existen para que el fallo sea rápido y comprensible, nunca para autorizar.**

Si las tres capas discrepan, gana la base. Siempre. Y si la base rechaza algo que las otras dos
dejaron pasar, eso es un defecto de las otras dos, no de la base.

### Qué hace cada capa

| Capa | Qué valida | Qué pasa si falla | Se puede saltar |
|---|---|---|---|
| **PostgreSQL** | `NOT NULL`, `CHECK`, `FOREIGN KEY`, `UNIQUE`, `EXCLUDE`, dominios, triggers, RLS, `REVOKE DELETE` | Error del motor con nombre de restricción | **No** |
| **`prisma_api`** | Las mismas reglas, otra vez, antes de ir a la base | 400 o 422 con mensaje en español | Sí, si alguien llama a la base por fuera |
| **`prisma_front`** | Las mismas reglas, otra vez, en el formulario | Aviso inmediato, sin viaje a la red | Sí, con las herramientas del navegador |

### El contrato de errores

Es la parte obligatoria de la decisión, no un anexo:

1. **Toda restricción de la base lleva nombre explícito.** Nada de nombres generados por
   PostgreSQL. `CONSTRAINT movimientos_valor_positivo CHECK (valor > 0)`.
2. **Existe una tabla única de traducción** en `prisma_api`: nombre de restricción → código HTTP
   + mensaje en español + campo del formulario al que señala. Un solo archivo, revisable de un
   vistazo.
3. **Si la API recibe un error de la base que no está en esa tabla, devuelve 500 y lo registra
   como defecto.** Significa que hay una regla en la base que la API no conocía: eso es
   exactamente lo que hay que descubrir, no esconder.
4. **Prueba automática**: recorrer todas las restricciones nombradas de la base (`pg_constraint`)
   y comprobar que cada una tiene entrada en la tabla de traducción. Si alguien agrega una
   restricción y olvida el mensaje, la prueba falla.

## Justificación

La redundancia no es desperdicio porque **las tres capas no están haciendo el mismo trabajo**.
Hacen la misma comprobación por cuatro razones distintas:

- **La base no sabe hablar.** Devuelve `23514 check_violation` en la restricción
  `movimientos_valor_positivo`. Eso no se le puede mostrar a la dueña del taller. La API traduce.
- **La red cuesta.** Validar en el formulario evita un viaje de ida y vuelta por datos móviles en
  un taller con señal intermitente.
- **La API valida cosas que la base no ve barato**: forma de la petición, tamaño de un archivo,
  límite de intentos, coherencia entre campos que vienen de pantallas distintas.
- **Y la base valida cosas que la API no puede garantizar**: concurrencia. Dos peticiones
  simultáneas pueden pasar las dos el `if` de Dart y solo una puede pasar el `UNIQUE`.

Quitar una capa no ahorra trabajo: cambia qué se pierde. Sin el front, cada error de dedo cuesta
una ida a la red. Sin la API, el error que ve la persona es el del motor. Sin la base, la regla
depende de que ningún camino la esquive y de que dos peticiones nunca lleguen a la vez.

Es el mismo criterio de [ADR-006](ADR-006-rls-por-rol.md) aplicado a los datos en lugar de a los
permisos: **lo que vive en PostgreSQL se cumple sin importar cómo se construya la consulta ni
desde dónde venga.** Un `if` de Dart, como un botón oculto, es comodidad, no garantía.

## Consecuencias

- **Positivas:** ninguna regla se puede esquivar, venga la escritura de donde venga; la persona
  ve mensajes en español en el campo correcto; el error de dedo no cuesta red; la concurrencia
  queda resuelta donde de verdad se puede resolver; y una regla nueva en la base no puede quedar
  sin mensaje sin que falle la prueba.
- **Negativas:** **hay tres sitios que pueden separarse con el tiempo** y terminar diciendo cosas
  distintas. Es el riesgo real y no se disimula. Lo que lo ataca es el punto 4 del contrato de
  errores: la prueba automática que recorre `pg_constraint` y comprueba que toda restricción
  nombrada tiene mensaje. **Sin esa prueba, la redundancia se convierte en deuda**, así que la
  prueba no es opcional y no se desactiva para «desbloquear» una entrega. Además, escribir una
  regla nueva cuesta tres ediciones en vez de una, y hay que resistir la tentación de saltarse la
  de la base porque las otras dos «ya la cubren».

## Referencias

- [ADR-006 · Permisos con Row Level Security](ADR-006-rls-por-rol.md) — la misma idea aplicada a
  los permisos: lo que decide vive en la base.
- [ADR-004 · Base de datos de solo escritura](ADR-004-base-solo-escritura.md) — `REVOKE DELETE`
  es una de las validaciones que nadie puede saltarse.
- [ADR-003 · Dinero como entero de pesos](ADR-003-dinero-entero.md) — el dominio `dinero` lleva
  esa regla a la base para que viva en un solo sitio.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [Contrato](../../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-018](ADR-018-front-sin-decisiones.md "ADR-018 · Tres partes, y el front no toma decisiones") · [ADR-019](ADR-019-contrato-de-respuesta.md "ADR-019 · Contrato de respuesta y catálogo de códigos de cinco dígitos") · [ADR-020](ADR-020-idempotencia.md "ADR-020 · Idempotencia obligatoria en toda escritura")
<!-- /generado:referenciado-desde -->
