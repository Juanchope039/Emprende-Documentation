# 02 · Casos de uso

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [3.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/02-casos-de-uso.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-16 | [Requisitos](INDICE.md#etiqueta-requisitos) · [Negocio](INDICE.md#etiqueta-negocio) |

Los 37 casos de uso del MVP, **todos con su flujo paso a paso** en el [§2](#2-casos-de-uso-detallados). Cada uno indica el
**rol autorizado**, y esa autorización se implementa en la base de datos, no en la pantalla.

Los diagramas de los 37 —uno para negocio y uno técnico por caso— están en
[`23-diagramas-de-casos-de-uso.md`](23-diagramas-de-casos-de-uso.md).

**Actores:**

| Actor | Descripción |
|---|---|
| **GER** | Gerencia — propiedad del negocio, acceso total |
| **OPE** | Operación — empleada, acceso restringido al registro |
| **SIS** | Sistema — procesos automáticos, sin intervención humana |

---

## 1. Tabla maestra

| ID | Caso de uso | Rol | Precondición | Postcondición |
|---|---|:---:|---|---|
| [CU-01](#cu-01) | Registrar ingreso | GER · OPE | Sesión activa, cuenta creada | Movimiento con doble fecha, saldo actualizado, auditoría escrita |
| [CU-02](#cu-02) | Registrar gasto con recibo | GER · OPE | Sesión activa | Movimiento y adjunto almacenados |
| [CU-03](#cu-03) | Anular movimiento errado | GER | Movimiento no anulado | Marcado anulado con motivo; **nunca borrado** |
| [CU-04](#cu-04) | Corregir por contra-asiento | GER | Movimiento existente | Movimiento nuevo que reversa el original; ambos visibles |
| [CU-05](#cu-05) | Registrar pedido de venta | GER · OPE | Cliente existente o nuevo | Pedido en estado `en_proceso` |
| [CU-06](#cu-06) | Registrar un pago del pedido | GER · OPE | Pedido creado | Pago registrado **como pasivo**, no como ingreso; el pedido queda sin pagar, pago parcial o pagado |
| [CU-07](#cu-07) | Entregar y cobrar saldo | GER · OPE | Pedido `en_proceso` y pagado, o que se termina de pagar con la entrega | Venta causada, pasivo liberado, saldo en cero, estado `entregado` |
| [CU-08](#cu-08) | Consultar pedidos por fecha | GER · OPE | — | Listado filtrable con pendientes resaltados |
| [CU-09](#cu-09) | Costear un producto | GER | Producto existente | Costo unitario y los dos márgenes recalculados |
| [CU-10](#cu-10) | ⛔ Retirado el 2026-10-06 · Costear servicio de bordado | GER | — | Sin tiempo en el catálogo no hay tiempo de máquina que separar |
| [CU-11](#cu-11) | Generar cotización PDF | GER · OPE | Productos costeados | PDF con logo listo para WhatsApp |
| [CU-12](#cu-12) | Validar anticipo mínimo | SIS | Cotización con costo directo | Advertencia si el anticipo no cubre el material |
| [CU-13](#cu-13) | Ver utilidad, caja y caja libre | GER | Movimientos del mes | Las tres cifras conciliadas |
| [CU-14](#cu-14) | Ver promedio de ganancias | GER | ≥1 mes cerrado | Promedio mensual y proyección anual |
| [CU-15](#cu-15) | Registrar inversión en activo | GER | — | Activo registrado; **no reduce la utilidad** |
| [CU-16](#cu-16) | Registrar retiro | GER | Caja libre suficiente | Retiro registrado; **no afecta utilidad**, sí caja y patrimonio |
| [CU-17](#cu-17) | Configurar los 4 sobres | GER | — | Porcentajes guardados con historial de cambios |
| [CU-18](#cu-18) | Simular capacidad de pago | GER | ≥6 meses de historia | Salario máximo sostenible y ventas necesarias |
| [CU-19](#cu-19) | Liquidar nómina del mes | GER | Empleada activa | Liquidación y desprendible PDF; adelantos descontados |
| [CU-20](#cu-20) | Ver el propio desprendible | GER · OPE | Nómina liquidada | Ve **solo** su desprendible |
| [CU-21](#cu-21) | Importar histórico de Excel | GER | Archivo CSV | Movimientos cargados con reporte de errores por fila |
| [CU-22](#cu-22) | Exportar respaldo | GER | — | Archivo con manifiesto; **descarga manual** |
| [CU-23](#cu-23) | Consultar auditoría | GER | — | Quién, cuándo, desde dónde y qué cambió |
| [CU-24](#cu-24) | Alertar descapitalización | SIS | 12 meses de historia | Aviso si los retiros superan las utilidades |
| [CU-25](#cu-25) | Definir el pro-labore | GER | — | Sueldo propio como **gasto**; el resto como distribución |
| [CU-26](#cu-26) | Registrar adelanto a empleada | GER | Empleada activa | Cuenta por cobrar; **no es gasto** hasta descontarse |
| [CU-27](#cu-27) | ⛔ Retirado el 2026-10-06 · Ver horas pagadas vs. facturadas | GER | Pedidos con tiempo cargado | Las horas facturadas salían del tiempo por unidad |
| [CU-28](#cu-28) | Iniciar sesión con usuario y contraseña | GER · OPE | Usuario activo | Sesión abierta con nombre, cargo y tipo cargados |
| [CU-29](#cu-29) | Crear un usuario | GER | Cargo existente en el catálogo | Usuario activo con clave temporal y cambio obligatorio |
| [CU-30](#cu-30) | Desactivar un usuario | GER | Usuario activo que no sea la última Gerencia | Marcado inactivo con motivo; **nunca borrado** |
| [CU-31](#cu-31) | Restablecer la contraseña de un usuario | GER | Usuario existente | Clave temporal entregada en persona; cambio obligatorio al entrar |
| [CU-32](#cu-32) | Cambiar la propia contraseña | GER · OPE | Sesión activa | Contraseña actualizada; `debe_cambiar_clave` en falso |
| [CU-33](#cu-33) | Administrar el catálogo de cargos | GER | — | Cargo creado, renombrado o desactivado con motivo |
| [CU-34](#cu-34) | Reactivar un usuario desactivado | GER | Usuario desactivado | Acceso devuelto con motivo escrito y cambio de clave obligatorio |
| [CU-35](#cu-35) | Revertir un cambio desde la bitácora | GER | Entrada reversible y aún no revertida | Entrada nueva que deshace el cambio; la original queda marcada, **nunca borrada** |
| [CU-36](#cu-36) | Previsualizar el sistema como lo ve Operación | GER | Sesión de tipo Gerencia | Interfaz pintada como para Operación, con aviso permanente y salida a un clic |
| [CU-37](#cu-37) | Descargar lo que muestra una pantalla | GER | Pantalla con datos a la vista | Archivo CSV o PDF **sin manifiesto**; la descarga queda registrada |

---

## 2. Casos de uso detallados

**Los 37 llevan sección, y todas tienen la misma forma:** el actor y el objetivo, la precondición
y la frecuencia, el flujo principal paso a paso, la tabla de flujos alternativos, la
postcondición y las reglas de negocio enlazadas. Donde la regla no es evidente, lleva además un
bloque **Regla de negocio central** que dice por qué es así y no de la otra manera.

**Los diagramas están en [`23-diagramas-de-casos-de-uso.md`](23-diagramas-de-casos-de-uso.md)**, dos por caso: un flujo para quien
dirige el negocio y una secuencia front → API → PostgreSQL para quien programa. Allí está también
el anexo que amarra cada caso con su operación del contrato, sus tablas y sus escenarios.

---

### <a id="cu-01"></a>CU-01 · Registrar ingreso

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Dejar registrado un ingreso en menos de 30 segundos |
| **Precondición** | Sesión activa y al menos una cuenta creada |
| **Frecuencia** | Varias veces al día |

**Flujo principal**

1. El actor abre el botón de registro rápido.
2. El sistema propone la fecha de hoy como **fecha del movimiento**, editable.
3. El actor ingresa el valor en pesos enteros.
4. Selecciona categoría y cuenta de destino.
5. Opcionalmente adjunta una foto y escribe una nota.
6. Confirma.
7. El sistema guarda el movimiento con `fecha_movimiento` (la indicada) y `creado_en`
   (automática, no editable), actualiza el saldo de la cuenta y escribe el registro de auditoría
   mediante trigger.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El movimiento ocurrió hace más de 7 días | Se guarda igual y se marca como **registro tardío** |
| A2 | La fecha indicada es futura | Se rechaza: no se registran movimientos que no han ocurrido |
| A3 | Sin conexión | Se encola localmente y se sincroniza al reconectar, conservando la fecha original |
| A4 | El valor es cero o negativo | Se rechaza con mensaje claro |

**Postcondición** — Movimiento persistido, saldo actualizado, auditoría escrita.

**Reglas de negocio** — [RN-01](03-requisitos-y-bdd.md#rn-01) (doble fecha), [RN-02](03-requisitos-y-bdd.md#rn-02) (pesos enteros), [RN-14](03-requisitos-y-bdd.md#rn-14) (registro tardío).


---

### <a id="cu-02"></a>CU-02 · Registrar gasto con recibo

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Dejar el gasto registrado con su soporte, sin tener que archivar el papel |
| **Precondición** | Sesión activa y al menos una cuenta creada |
| **Frecuencia** | Varias veces al día |

**Flujo principal**

1. El actor abre el registro rápido y elige *Gasto*.
2. Escribe el valor en pesos enteros, la categoría, la cuenta de origen y la fecha del
   movimiento, que el sistema propone en hoy.
3. Opcionalmente escribe una nota.
4. Confirma. El sistema guarda el movimiento igual que en [CU-01](#cu-01): con sus dos fechas, bajando el
   saldo de la cuenta y con la auditoría escrita por el trigger.
5. **El soporte se sube aparte, sobre el movimiento ya guardado.** El actor toma la foto del
   recibo o elige el PDF de la factura.
6. El archivo **pasa por la API**, que lo guarda en el almacenamiento privado y escribe su ficha
   en `adjuntos`, con quién lo subió, desde qué dispositivo y de qué movimiento cuelga.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | No hay recibo que adjuntar | Se guarda el gasto igual: el soporte es opcional y su falta no bloquea el registro |
| A2 | El archivo pasa de 5 MB | Se rechaza el adjunto, no el gasto: el movimiento ya quedó guardado |
| A3 | El archivo no es JPEG, PNG, WebP ni PDF | Se rechaza con el tipo permitido a la vista |
| A4 | Se reintenta la subida tras perder la señal | El adjunto lleva el id que generó el front, así que dos intentos de la misma intención dejan **un** archivo |
| A5 | El gasto se registró mal | No se edita: se anula con motivo ([CU-03](#cu-03)) o se corrige por contra-asiento ([CU-04](#cu-04)) |

**Postcondición** — Movimiento de gasto persistido con su saldo al día, y su soporte guardado en
el almacenamiento privado con la ficha que dice de qué cuelga.

**Reglas de negocio** — [RF-09](03-requisitos-y-bdd.md#rf-09) (gasto con adjunto), [RF-12](03-requisitos-y-bdd.md#rf-12) (fotos o PDF), [RN-02](03-requisitos-y-bdd.md#rn-02) (pesos enteros).
Los dos límites del adjunto —el tamaño y los cuatro tipos— se imponen a la vez en el
almacenamiento y en la tabla, porque cada mitad tiene que poder defenderse sola
([04 §4.12](04-modelo-de-datos.md#412-adjuntos--el-soporte-de-un-movimiento-o-de-un-pedido), [ADR-015](adr/ADR-015-validacion-tres-capas.md)).


---

### <a id="cu-03"></a>CU-03 · Anular movimiento errado

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Dejar sin efecto un registro equivocado sin perder la historia |

**Flujo principal**

1. Gerencia localiza el movimiento y elige *Anular*.
2. El sistema **exige un motivo escrito**. Sin motivo no continúa.
3. Gerencia escribe el motivo y confirma.
4. El sistema marca `anulado_en`, `anulado_por`, `anulado_motivo`, `anulado_dispositivo` e
   `anulado_ip`. **El registro no se borra.**
5. Si el movimiento va con otro registro —el anticipo de un pedido, un activo, un aporte, un
   retiro o un adelanto—, **ese registro se anula con él**, con el mismo motivo y en la misma
   transacción ([04 §5.2](04-modelo-de-datos.md#52-anulación-lógica-con-trazabilidad)). La tabla de abajo dice cuándo se puede.
6. Se recalculan los saldos excluyendo el movimiento anulado.
7. El trigger de auditoría guarda el estado anterior y el posterior en formato JSON.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Quien intenta anular es de tipo Operación | La base de datos rechaza la operación, no solo la pantalla |
| A2 | El movimiento ya está anulado | Se informa y no se hace nada |
| A3 | El movimiento pertenece a un mes cerrado | Se exige contra-asiento ([CU-04](#cu-04)) en lugar de anulación |
| A4 | Es el anticipo de un pedido ya entregado o cancelado | No se anula nada: ese anticipo ya se volvió venta, o ya se decidió si se devolvía. Se corrige con contra-asiento |
| A5 | Es el ingreso con que se causó la venta de un pedido entregado | No se anula nada: el pedido quedaría entregado sin venta. Se corrige con contra-asiento |
| A6 | Es un adelanto que ya se descontó en una nómina liquidada | No se anula nada: la nómina ya lo cobró ([RN-11](03-requisitos-y-bdd.md#rn-11)). Se corrige con contra-asiento |
| A7 | Es el pago de una nómina | No se anula nada: la liquidación no tiene cómo anularse. Se corrige con contra-asiento |
| A8 | Es una de las dos mitades de un retiro partido en pro-labore y distribución | Se anulan las dos mitades y sus dos registros de retiro |

**Qué pasa con el registro que va con el movimiento**

| El movimiento va con… | Al anularlo |
|---|---|
| Nada: un ingreso, un gasto o una transferencia del libro | Se anula solo |
| El anticipo de un pedido en proceso | Se anula con él |
| El anticipo de un pedido entregado o cancelado | No se anula (A4) |
| La venta que causó la entrega de un pedido | No se anula (A5) |
| Un activo o un aporte | Se anula con él |
| Una mitad de un retiro partido | Se anulan las dos mitades y sus dos registros (A8) |
| Un adelanto sin descontar | Se anula con él |
| Un adelanto ya descontado | No se anula (A6) |
| El pago de una nómina | No se anula (A7) |

- **El retiro se anula entero** porque fue una sola decisión: anular una mitad cambiaría cuánto fue
  pro-labore y cuánto distribución, y eso lo decide la regla del mes ([CU-16](#cu-16)), no una anulación.
- **Lo que no se anula no se deshace en cascada.** Una anulación de movimiento no deshace una
  entrega ni una liquidación, que tienen su propia pantalla y su propio flujo.
- **El libro lo dice antes de intentar.** Cada fila trae si se deja anular y, si no, por qué, con
  las mismas palabras con que respondería la anulación ([10 §4.3](10-ux-y-mockups.md#43-movimientos)).

Estas reglas las propuso el contrato de la tarea [3.17](08-plan-de-desarrollo.md#tarea-3-17) y las aprobó quien dirige. Las impone
`fn_anular_movimiento` ([04 §10](04-modelo-de-datos.md#10-funciones-de-negocio-atómicas)).

**Postcondición** — Movimiento invisible en reportes, visible en el modo *ver anulados*,
íntegro en la base de datos. Su registro hermano, si lo tiene, queda anulado con él.


---

### <a id="cu-04"></a>CU-04 · Corregir por contra-asiento

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Dejar las cifras bien sin tocar un registro que ya no se puede tocar |
| **Precondición** | El movimiento existe, y se corrige en lugar de anularse |
| **Frecuencia** | Ocasional |

**Flujo principal**

1. Gerencia localiza el movimiento en el libro y elige *Corregir*.
2. El sistema abre el mismo formulario de un movimiento cualquiera, con las mismas reglas y los
   mismos rechazos: un contra-asiento **es** un movimiento.
3. Gerencia escribe lo que reversa el error —el valor, la fecha y la cuenta que debieron ser— y
   confirma.
4. El sistema escribe un movimiento nuevo que queda **apuntando al que corrige**, y el original
   no se toca.
5. El libro muestra los dos, y la historia cuenta también el error.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El movimiento es de un mes cerrado | Es justo el caso para el que existe esto: no se anula, se corrige ([CU-03](#cu-03), A3) |
| A2 | Quien intenta corregir es de tipo Operación | La base de datos lo rechaza: registrar sigue siendo de los dos tipos, y lo que la política juzga es quién apunta a un movimiento anterior |
| A3 | Se reintenta la misma corrección | El contra-asiento lleva su propio id, generado al decidir la acción, así que el reintento no duplica el libro |
| A4 | El movimiento que se corrige no existe o está anulado | Se informa y no se escribe nada |

**Postcondición** — Dos movimientos visibles: el errado, intacto, y el que lo reversa, con el
enlace entre los dos. Ninguna cifra cuenta el error dos veces, y nada se borró.

**Reglas de negocio** — [RF-15](03-requisitos-y-bdd.md#rf-15) (corrección sin modificar el original), [RN-13](03-requisitos-y-bdd.md#rn-13) (nada se borra).
Es el mismo mecanismo con que la bitácora revierte un cambio ([CU-35](#cu-35)): una **escritura
compensatoria**, nunca un borrado ([04 §5.3](04-modelo-de-datos.md#53-corrección-por-contra-asiento)).


---

### <a id="cu-05"></a>CU-05 · Registrar pedido de venta

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Dejar el pedido escrito, con lo que vale y lo que se cobra al confirmar |
| **Precondición** | El cliente existe, o se crea en el mismo paso; los productos están en el catálogo |
| **Frecuencia** | Varias veces a la semana |

**Flujo principal**

1. El actor abre Pedidos y elige **+ Nuevo pedido**.
2. Elige el cliente, o lo crea ahí mismo con nombre, contacto y notas.
3. Agrega las líneas: producto, cantidad y precio. **El valor total no se teclea**: sale de las
   líneas y lo calcula la API, porque el front no calcula plata ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).
4. Mientras arma las líneas, el sistema le muestra las tres cifras del pedido: lo que vale, el
   anticipo que se cobra al confirmar y el saldo contra entrega.
5. Si el anticipo no cubre el costo directo, aparece la advertencia de [CU-12](#cu-12).
6. Confirma. El pedido queda en estado `en_proceso`, con su número visible puesto por la API.
7. Opcionalmente se adjunta la foto o el PDF de la factura, que cuelga del pedido.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El pedido viene de una cotización aceptada | No se vuelve a digitar nada: la cotización se convierte en pedido con sus mismas líneas, su cliente y su anticipo, y **con los precios que se le sostuvieron al cliente**, no con los del catálogo de hoy ([RF-40](03-requisitos-y-bdd.md#rf-40)) |
| A2 | El pedido no tiene líneas, o una cantidad no es positiva, o el producto no existe | Se rechaza: un pedido sin qué entregar no es un pedido |
| A3 | El cliente no existe o está anulado | Se rechaza y se ofrece crearlo |
| A4 | Se reintenta el registro tras perder la señal | El pedido lleva el id que generó quien registra, así que el reintento no crea dos pedidos |
| A5 | El pedido se registró por error | Se **anula** con motivo, que no es lo mismo que cancelarlo: se anula lo que no debió registrarse y se cancela lo que se registró bien y no va a entregarse ([CU-07](#cu-07), A3) |

**Postcondición** — Pedido en `en_proceso` con sus líneas, su valor calculado, su saldo pendiente
y su cliente, listo para cobrar el anticipo ([CU-06](#cu-06)).

**Reglas de negocio** — [RF-18](03-requisitos-y-bdd.md#rf-18) (clientes), [RF-19](03-requisitos-y-bdd.md#rf-19) (pedido con líneas), [RF-27](03-requisitos-y-bdd.md#rf-27) (factura adjunta),
[RF-40](03-requisitos-y-bdd.md#rf-40) (cotización aceptada sin redigitar).


---

### <a id="cu-06"></a>CU-06 · Registrar un pago del pedido

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Dejar escrito lo que el cliente ya pagó, el día que lo pague |

**Flujo principal**

1. Sobre un pedido en estado `en_proceso`, el actor registra un pago recibido. Puede ser el mismo
   día en que se registró el pedido o cualquier día después, **y puede haber más de uno**.
2. Indica valor, cuenta de destino y fecha del movimiento.
3. El sistema:
   - **Aumenta la caja** de la cuenta indicada.
   - **Registra un pasivo** `anticipos_por_devengar` por el mismo valor.
   - **No registra ingreso** ni utilidad.
4. El pedido queda con lo pagado, su saldo pendiente y su **condición de pago**, que es una de
   tres: sin pagar, pago parcial o pagado ([RF-23](03-requisitos-y-bdd.md#rf-23)).

**La condición de pago no es el estado.** El estado dice en qué punto va el trabajo —`en_proceso`,
`entregado`, `cancelado`— y la condición de pago dice cuánto se ha cobrado. Un pedido sin pagar y
uno pagado están los dos `en_proceso`, y ninguno ha causado venta todavía.

**Regla de negocio central ([RN-05](03-requisitos-y-bdd.md#rn-05))**

> Un anticipo **no es un ingreso**. Es una deuda con el cliente hasta que se entrega el pedido.
> Solo al entregar ([CU-07](#cu-07)) se causa la venta y el pasivo se libera.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El pago, sumado a los anteriores, supera el valor del pedido | Se rechaza: nadie puede haber pagado más de lo que vale |
| A2 | El anticipo no cubre el costo directo | Se muestra la advertencia de [CU-12](#cu-12) |
| A3 | El cliente paga todo por adelantado, al registrar el pedido o después | Se registra el 100% como pasivo hasta la entrega, y el pedido queda **pagado** ([BDD-06-4](03-requisitos-y-bdd.md#bdd-06-4)) |
| A4 | No se cobra nada al registrar el pedido | El pedido queda **sin pagar**, y el pago se registra el día que llegue ([BDD-06-3](03-requisitos-y-bdd.md#bdd-06-3), [BDD-06-5](03-requisitos-y-bdd.md#bdd-06-5)) |


---

### <a id="cu-07"></a>CU-07 · Entregar pedido y cobrar saldo

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Causar la venta en el momento correcto |

**Precondición** — El pedido está pagado, o el pago de lo que falta entra con esta misma entrega.

**Flujo principal**

1. El actor marca el pedido como entregado e indica la fecha de entrega, que puede ser hoy o
   cualquier día pasado: **es la fecha que causa la venta**, no la del teclado.
2. Si queda saldo, indica en qué cuenta entra. **Si el pedido ya estaba pagado, no hay nada que
   indicar**: la entrega no escribe ningún movimiento ([BDD-07-4](03-requisitos-y-bdd.md#bdd-07-4)).
3. El sistema, **en una sola transacción**:
   - Causa el ingreso por el **valor total del pedido** con fecha de entrega.
   - Causa el costo directo asociado.
   - Libera el pasivo de anticipos por devengar.
   - Aumenta la caja por el saldo cobrado, si lo había.
   - Cambia el estado a `entregado`.

**Regla de negocio ([RF-22](03-requisitos-y-bdd.md#rf-22))**

> **Un pedido no se entrega sin terminar de pagarse.** O ya estaba pagado, o el pago de lo que
> falta va dentro de la misma entrega. Entregar fiado deja al negocio con la plata del material
> puesta y sin cómo cobrarla, que es justo lo que el anticipo existía para evitar.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | ⛔ Retirado el 2026-10-16 · Se entrega sin cobrar el saldo | Ya no se puede: se rechaza y se pide la cuenta donde entra lo que falta ([BDD-07-5](03-requisitos-y-bdd.md#bdd-07-5)) |
| A2 | Entrega parcial | Se causa proporcionalmente y el pedido queda `parcial`. **Todavía no se puede pedir**: no hay forma de decirlo ni en el contrato ni en la base ([RF-25](03-requisitos-y-bdd.md#rf-25)) |
| A3 | El pedido se cancela, haya pagado o no | Queda `cancelado` con motivo obligatorio, y lo ya pagado se devuelve o se convierte en ingreso, según se indique. Cancelar **no escribe ningún movimiento** |
| A4 | El pedido ya está entregado o cancelado | Se rechaza: los dos son finales, y lo que haya que corregir va por contra-asiento |

**Postcondición** — La utilidad del mes de entrega refleja el pedido completo, el pedido queda
`entregado` y **su saldo es cero**.


---

### <a id="cu-08"></a>CU-08 · Consultar pedidos por fecha

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Saber qué hay que entregar, y qué lleva demasiado tiempo esperando |
| **Precondición** | — |
| **Frecuencia** | Todos los días |

**Flujo principal**

1. El actor abre Pedidos y ve el listado **ordenado por fecha**, los más recientes primero.
2. Filtra por estado, por cliente o por rango de fechas.
3. Cada fila trae lo anticipado, el saldo pendiente y si el pedido está estancado. **Las tres las
   calcula la API**: el front no calcula plata ni decide qué resaltar ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).
4. Los pedidos con anticipo cobrado y sin entregar hace 15 días o más aparecen resaltados como
   pendientes críticos.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Hay pedidos anulados en el rango | No salen, salvo que se pidan expresamente |
| A2 | La sesión es de tipo Operación | Ve el listado: entregar es su trabajo. Lo que no ve son los costos ni los márgenes de cada línea ([RF-34](03-requisitos-y-bdd.md#rf-34)) |
| A3 | El filtro no deja ninguna fila | Se dice que no hay pedidos con ese filtro, en lugar de una tabla vacía sin explicación |

**Postcondición** — Listado filtrable en pantalla, con los pendientes críticos a la vista. No
escribe nada.

**Reglas de negocio** — [RF-20](03-requisitos-y-bdd.md#rf-20) (orden por fecha y filtros), [RF-23](03-requisitos-y-bdd.md#rf-23) (saldo pendiente),
[RF-24](03-requisitos-y-bdd.md#rf-24) (resaltar los estancados). El escenario que lo fija es [BDD-08-1](03-requisitos-y-bdd.md#bdd-08-1).


---

### <a id="cu-09"></a>CU-09 · Costear un producto

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Saber cuánto cuesta de verdad cada cosa que el taller vende, y cuánto deja cada unidad |
| **Precondición** | El producto está en el catálogo, con su unidad y su precio |
| **Frecuencia** | Al dar de alta un producto, y cuando cambia un insumo |

**Flujo principal**

1. Gerencia abre Productos y da de alta el producto o el servicio, con su unidad y su precio.
2. Escribe el costeo: el insumo, los consumibles y **el costo de mano de obra, en pesos**.
3. **El tiempo no se pide.** Ni minutos de trabajo ni minutos de máquina: lo que una unidad cuesta
   de trabajo se escribe directamente en pesos ([05 §7.1](05-reglas-financieras.md#71-costo-unitario)).
4. Mientras escribe, el sistema le pinta en vivo el costo unitario, los dos márgenes, el precio
   que habría que cobrar para el margen objetivo y la lectura frente al resto del taller.
5. Confirma. La ficha del producto y su primer costeo **caen juntos o no cae ninguno**: es una
   sola transacción.
6. Al editar después, el costeo **no se sobrescribe**: si el costo o el precio cambiaron, se
   agrega una fila nueva con la fecha de hoy, y la vigente es la última registrada.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El costo de mano de obra queda en cero | Se acepta, y el margen lo dice: hay productos que no llevan trabajo. Lo que no se acepta es que sea negativo |
| A2 | La sesión es de tipo Operación | Ve el nombre, el tipo, la unidad y el precio, y **ni el costeo ni los márgenes**, porque la base no le devuelve esas filas ([RF-34](03-requisitos-y-bdd.md#rf-34), [BDD-02-2](03-requisitos-y-bdd.md#bdd-02-2)) |
| A3 | Algún costo llega con centavos | Se rechaza con la regla a la vista: el dinero es de pesos enteros ([ADR-003](adr/ADR-003-dinero-entero.md)) |
| A4 | El producto deja de venderse | Se **desactiva**, no se borra; deja de ofrecerse y los pedidos viejos conservan el suyo |
| A5 | Se edita dos veces el mismo día | Quedan dos filas de costeo con la misma vigencia, y manda la última: el historial no se recorta |

**Postcondición** — Producto con su costeo vigente y sus dos márgenes recalculados, y el historial
de costos y precios intacto.

**Reglas de negocio** — [RF-28](03-requisitos-y-bdd.md#rf-28) a [RF-31](03-requisitos-y-bdd.md#rf-31), [RF-33](03-requisitos-y-bdd.md#rf-33) (precio sugerido), [RF-34](03-requisitos-y-bdd.md#rf-34) (Operación no ve costos),
[RF-35](03-requisitos-y-bdd.md#rf-35) (historial). Las fórmulas están en [05 §7](05-reglas-financieras.md#7-costeo-por-producto-y-margen).


---

### <a id="cu-10"></a>CU-10 · Costear servicio de bordado

> **⛔ Retirado el 2026-10-06.** El catálogo dejó de pedir tiempo, así que no hay dos tiempos que
> separar ni margen por hora que calcular sobre el de máquina. Un bordado se costea como cualquier
> otro producto, con su mano de obra en pesos ([CU-09](#cu-09), [05 §7.1](05-reglas-financieras.md#71-costo-unitario)). Lo que sigue queda como
> estaba, para que se entienda qué regía antes.

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Cobrar un bordado por lo que de verdad ocupa el taller, no por lo que la persona tarda |
| **Precondición** | El pro-labore está definido; el servicio está en el catálogo |
| **Frecuencia** | Al costear cada servicio de bordado |

**Flujo principal**

1. Gerencia abre el costeo del servicio y escribe, por separado, el **tiempo de persona** y el
   **tiempo de máquina**.
2. El sistema carga al costo **solo el tiempo de persona**: la máquina no cobra sueldo, y su
   energía ya está contada en los consumibles.
3. Para el **margen por hora**, el sistema divide entre el tiempo que el pedido ocupa el taller,
   que es el de máquina cuando lo hay.
4. El cuadro comparativo muestra el servicio frente al resto del catálogo con esa cifra.

**Ejemplo**

> Bordado con 5 minutos de persona y 22 de máquina, con la hora a $9.400.
> El costo carga los 5 minutos de persona. Con $15.864 de margen, el **margen por hora** se
> calcula sobre los 22 minutos de máquina, no sobre los 5 de persona ni sobre la suma.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El producto no tiene tiempo de máquina | Nada cambia: el denominador del margen por hora sigue siendo el tiempo de persona |
| A2 | El tiempo de máquina lleva más de dos decimales | Se rechaza, con su propio mensaje, distinto del del tiempo de trabajo |
| A3 | No hay pro-labore definido | Se bloquea, igual que [CU-09](#cu-09) A1 |

**Postcondición** — Servicio costeado con sus dos tiempos guardados por separado, su costo sin el
tiempo de máquina y su margen por hora calculado sobre el tiempo que ocupa el taller.

**Reglas de negocio** — [RF-32](03-requisitos-y-bdd.md#rf-32), y la fórmula del [05 §7.1](05-reglas-financieras.md#71-costo-unitario). Los tres escenarios que lo fijan son
[BDD-32-2](03-requisitos-y-bdd.md#bdd-32-2), [BDD-32-3](03-requisitos-y-bdd.md#bdd-32-3) y [BDD-32-4](03-requisitos-y-bdd.md#bdd-32-4).


---

### <a id="cu-11"></a>CU-11 · Generar cotización PDF

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Pasarle al cliente por WhatsApp un papel con el logo, en menos de un minuto |
| **Precondición** | Los productos de las líneas están costeados |
| **Frecuencia** | Varias veces a la semana |

**Flujo principal**

1. El actor abre el Cotizador y arma las líneas, igual que en un pedido: comparten esquema.
2. Indica hasta cuándo vale la cotización. **El valor total lo calcula la API** de las líneas.
3. Mientras arma las líneas, el validador de [CU-12](#cu-12) le dice si el anticipo cubre el costo directo.
4. Confirma: la cotización queda emitida con su número.
5. Pide el documento. El sistema devuelve el **PDF con el logo del negocio**, listo para pasarlo
   por WhatsApp. **No lleva costos ni márgenes**: es el papel del cliente.
6. Cuando el cliente acepta, la cotización se convierte en pedido sin redigitar nada ([CU-05](#cu-05), A1).
7. Al entregar, el papel que corresponde es la **remisión**, que cuelga del pedido y no de la
   cotización: lo entregado es un pedido, y una cotización puede no haberse aceptado nunca.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La cotización no tiene líneas | Se rechaza |
| A2 | La validez es anterior al día de emisión | Se rechaza: nacería vencida |
| A3 | Se pide el PDF de una cotización anulada | Se rechaza: el papel afirmaría un precio que el negocio ya retiró |
| A4 | La cotización se venció y el cliente aparece después | No se acepta: se emite otra, con los precios de hoy |
| A5 | La sesión es de tipo Operación | Cotiza y genera el PDF: el documento no lleva costos ni márgenes, así que no hay nada que ocultarle |

**Postcondición** — Cotización emitida con su valor calculado y su PDF generado, sin costos ni
márgenes, y con el camino abierto para convertirla en pedido.

**Reglas de negocio** — [RF-36](03-requisitos-y-bdd.md#rf-36) (PDF con logo), [RF-37](03-requisitos-y-bdd.md#rf-37) (remisión), [RF-40](03-requisitos-y-bdd.md#rf-40) (conversión a pedido).


---

### <a id="cu-12"></a>CU-12 · Validar anticipo mínimo *(automático)*

| | |
|---|---|
| **Actor** | Sistema |
| **Disparador** | Generación de una cotización o registro de un pedido |

**Flujo principal**

1. El sistema calcula el costo directo del pedido a partir del costeo de los productos.
2. Calcula el anticipo mínimo como la proporción entre costo directo y valor total.
3. Compara contra el anticipo configurado para el pedido (50% por defecto).
4. Si el anticipo configurado es menor, muestra la advertencia con el faltante en pesos y el
   porcentaje sugerido, redondeado hacia arriba a un múltiplo de 5.

**Ejemplo**

> Pedido de $520.000 en rompecabezas. Costo directo $338.000 (65%).
> Anticipo del 50% = $260.000. **Faltan $78.000.**
> Mensaje: *"Con el 50% pones $78.000 de tu bolsillo hasta la entrega. Anticipo sugerido: 70%."*


---

### <a id="cu-13"></a>CU-13 · Ver utilidad, caja y caja libre

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Responder «¿cuánto gané?» sin confundirlo con «¿cuánta plata hay?» |
| **Precondición** | Movimientos registrados en el mes |
| **Frecuencia** | Todos los días |

**Flujo principal**

1. Gerencia abre el Inicio. El sistema pide **el panel entero en una sola consulta**, porque
   ninguna de sus zonas se explica sola y juntarlas en el front sería dejar que decida ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).
2. El panel trae las **tres cifras** con la línea que las concilia:
   - **utilidad causada** — lo que el negocio ganó, por los pedidos entregados en el mes;
   - **movimiento de caja** — la plata que entró y salió;
   - **caja libre** — lo que de verdad se puede comprometer, descontados los anticipos por
     devengar y los gastos fijos ya comprometidos.
3. Trae además los saldos por cuenta, los cuatro sobres con lo asignado contra lo usado, los doce
   meses del gráfico, los pendientes y las alertas activas.
4. **El Inicio no escribe nada.** No hay un botón que cree, edite o anule: solo cifras, alertas,
   listados, enlaces y la descarga de lo que ya está en pantalla ([CU-37](#cu-37)).
5. Cuando el mes termina, Gerencia lo **cierra**: el sistema calcula las cifras del mes y las
   congela en un snapshot que ya no cambia.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La caja libre queda negativa | Alerta roja, **aunque el mes sea rentable**: hay plata de anticipos comprometida ([BDD-13-3](03-requisitos-y-bdd.md#bdd-13-3)) |
| A2 | No se dice qué mes | El mes en curso en Bogotá |
| A3 | La sesión es de tipo Operación | No ve ni la utilidad ni la caja libre ([BDD-02-1](03-requisitos-y-bdd.md#bdd-02-1)) |
| A4 | Se intenta cerrar dos veces el mismo mes | Se rechaza: el snapshot de un mes existe una sola vez |
| A5 | Se intenta cerrar el mes en curso, o uno que todavía no llega | Se rechaza: no hay mes que congelar |
| A6 | Llega un movimiento con fecha de un mes ya cerrado | Se acepta —nunca se pierde información—, se marca como ajuste de período anterior y aparece en el mes corriente, sin mover el reporte cerrado |

**Postcondición** — Las tres cifras conciliadas en pantalla, y, cuando el mes se cierra, un
snapshot inmutable del que salen los reportes de ese mes.

**Reglas de negocio** — [RF-41](03-requisitos-y-bdd.md#rf-41) a [RF-43](03-requisitos-y-bdd.md#rf-43) (las tres cifras), [RF-52](03-requisitos-y-bdd.md#rf-52) (punto de equilibrio),
[RF-53](03-requisitos-y-bdd.md#rf-53) (cierre con snapshot), [RF-95](03-requisitos-y-bdd.md#rf-95) (el Inicio no escribe), [RN-16](03-requisitos-y-bdd.md#rn-16) (un mes cerrado no se
recalcula). Las fórmulas están en [05 §3](05-reglas-financieras.md#3-anticipos-causación-y-caja-libre) y el cierre en [05 §8](05-reglas-financieras.md#8-cierre-mensual).


---

### <a id="cu-14"></a>CU-14 · Ver promedio de ganancias

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Saber cuánto deja el negocio en un mes normal, y qué da eso al año |
| **Precondición** | Al menos un mes cerrado |
| **Frecuencia** | Mensual |

**Flujo principal**

1. Gerencia abre Reportes.
2. El sistema presenta el año **mes a mes**: ingresos, costos, gastos, utilidad y margen.
3. Los meses **cerrados salen de su snapshot y no se recalculan**; los abiertos se calculan con
   lo que hay hasta hoy.
4. Presenta el **promedio de ganancias** mensual con su proyección anual, y el punto de
   equilibrio en pesos y en pedidos.
5. Cada mes trae además la utilidad **sin** descontar el pro-labore, para poder comparar las dos
   lecturas lado a lado.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | No hay ningún mes cerrado | El promedio **falta**, y la pantalla explica por qué, en lugar de mandar un cero que parece una cifra |
| A2 | El margen de contribución no es positivo | El punto de equilibrio falta, con la misma explicación en palabras |
| A3 | Hay menos de doce meses de historia | Se presenta lo que hay y se advierte que la proyección es menos confiable |
| A4 | La sesión es de tipo Operación | No alcanza la pantalla |

**Postcondición** — Promedio mensual y proyección anual en pantalla, con la lectura que dice de
cuántos meses salen. No escribe nada.

**Reglas de negocio** — [RF-44](03-requisitos-y-bdd.md#rf-44) (promedio y proyección), [RF-52](03-requisitos-y-bdd.md#rf-52) (punto de equilibrio),
[RN-16](03-requisitos-y-bdd.md#rn-16) (los meses cerrados no se recalculan). El escenario es [BDD-14-1](03-requisitos-y-bdd.md#bdd-14-1) y las fórmulas, [05 §9](05-reglas-financieras.md#9-catálogo-de-kpis).


---

### <a id="cu-15"></a>CU-15 · Registrar inversión en activo

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Comprar un equipo sin que el mes parezca malo por haberlo comprado |
| **Precondición** | — |
| **Frecuencia** | Pocas veces al año |

**Flujo principal**

1. Gerencia abre Inversiones y registra el equipo o la herramienta: qué es, cuánto costó, de qué
   cuenta salió la plata y la fecha.
2. El sistema escribe, en la misma transacción, **el activo y un movimiento de inversión**.
3. Ese movimiento **baja la caja y no toca la utilidad ni el patrimonio**: el negocio cambió
   plata por una cosa que vale lo mismo.
4. El activo aparece en la tabla de Inversiones, de mayor a menor valor de compra, y suma en el
   patrimonio.
5. Un **aporte de capital** se registra por el camino hermano: plata que entra desde afuera, que
   **sube la caja y sube el patrimonio**, y tampoco es utilidad.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El equipo ya lo tenía el taller antes de empezar a usar el sistema | Se registra **sin cuenta**: queda el activo y no se escribe movimiento, porque esa plata ya no está en ningún saldo ([09 §4](09-plan-de-implantacion.md#4-migración-de-datos-históricos)) |
| A2 | La fecha es futura, o la cuenta no sirve | Se rechaza con el campo señalado |
| A3 | La compra se registró mal | Se anula con motivo, y el activo se anula con el movimiento, en la misma transacción ([CU-03](#cu-03)) |
| A4 | La sesión es de tipo Operación | La base de datos no le devuelve ni un activo, así que la tabla le llega vacía; y escribir lo rechaza la propia base |

**Postcondición** — Activo registrado, caja más baja por lo que se pagó y utilidad intacta. El
patrimonio refleja lo que el negocio tiene, no lo que le queda en la cuenta.

**Reglas de negocio** — [RF-45](03-requisitos-y-bdd.md#rf-45) (inversión sin afectar la utilidad), [RF-46](03-requisitos-y-bdd.md#rf-46) (aportes de capital),
[RF-48](03-requisitos-y-bdd.md#rf-48) (patrimonio). El escenario es [BDD-15-1](03-requisitos-y-bdd.md#bdd-15-1) y la naturaleza de cada uno, [05 §2](05-reglas-financieras.md#2-naturaleza-de-cada-movimiento).


---

### <a id="cu-16"></a>CU-16 · Registrar retiro

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Sacar plata del negocio sin distorsionar la utilidad |

**Flujo principal**

1. Gerencia indica valor, cuenta de origen y fecha.
2. El sistema pregunta cómo se clasifica:
   - **Pro-labore** — pago por el trabajo propio en el taller → **es gasto**.
   - **Distribución de utilidades** — retiro por ser propietario → **no es gasto**.
3. Si hay un pro-labore mensual configurado ([CU-25](#cu-25)), el sistema **propone la división
   automáticamente**.
4. Registra ambos componentes con su naturaleza correspondiente.
5. Reduce la caja por el total y el patrimonio por el componente de distribución.

**Regla de negocio central ([RN-07](03-requisitos-y-bdd.md#rn-07))**

> El retiro de utilidades **no reduce la utilidad del período**. Un gasto es lo que el negocio
> consume para operar; el retiro es reparto de una ganancia ya generada. Registrarlo como gasto
> hace que el negocio se vea peor cuanto más se retire, lo cual es absurdo.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La caja libre no alcanza | Se advierte que se estaría usando plata de anticipos; requiere confirmación explícita |
| A2 | Los retiros del año superan las utilidades | Se dispara la alerta de [CU-24](#cu-24) |


---

### <a id="cu-17"></a>CU-17 · Configurar los 4 sobres

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Decidir en qué se reparte cada peso que entra, antes de gastarlo |
| **Precondición** | — |
| **Frecuencia** | Pocas veces al año |

**Flujo principal**

1. Gerencia abre la configuración de los sobres y ve los cuatro vigentes: **costo directo**,
   **gastos fijos**, **reserva** y **retiro**.
2. Cambia los porcentajes. Cada uno va de 0 a 100 y **los cuatro tienen que sumar 100**.
3. Confirma. El sistema **no edita la configuración anterior**: escribe una definición nueva,
   vigente desde hoy, y la vieja queda con su período.
4. Desde ese día, el Inicio reparte las entradas de caja del mes con los porcentajes nuevos y
   muestra lo asignado contra lo usado en cada sobre.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Los cuatro no suman 100 | Se rechaza en la base de datos, no solo en la pantalla: la restricción se llama por su nombre y de ese nombre cuelga el mensaje |
| A2 | Se configura dos veces el mismo día | Quedan dos definiciones con la misma vigencia, y manda la última registrada; el historial no se recorta ([RF-51](03-requisitos-y-bdd.md#rf-51)) |
| A3 | La sesión es de tipo Operación | La base de datos lo rechaza |
| A4 | La reserva no alcanza todavía la meta de tres meses de gastos fijos | No se bloquea nada: el sistema muestra el avance hacia la meta |

**Postcondición** — Cuatro porcentajes vigentes desde hoy, sumando 100, y el historial de
cambios entero, con quién los cambió y desde cuándo rigen.

**Reglas de negocio** — [RF-50](03-requisitos-y-bdd.md#rf-50) (porcentajes configurables), [RF-51](03-requisitos-y-bdd.md#rf-51) (historial). La regla completa,
con los porcentajes de arranque y la meta de la reserva, está en [05 §11](05-reglas-financieras.md#11-la-regla-de-los-4-sobres).


---

### <a id="cu-18"></a>CU-18 · Simular capacidad de pago

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Responder con números si se puede contratar y por cuánto |

**Flujo principal**

1. Gerencia abre el simulador.
2. El sistema toma la **utilidad operativa promedio de los últimos 6 meses**, calculada
   **con el pro-labore ya descontado como gasto**.
3. Resta el porcentaje de reserva de seguridad configurado.
4. Presenta el presupuesto mensual disponible para personal.
5. Calcula, en sentido inverso, las **ventas adicionales necesarias** y las traduce a unidades
   de cada producto.
6. Permite mover los controles de reserva, salario tentativo y horas para ver el efecto en vivo.

**Regla de negocio central ([RN-09](03-requisitos-y-bdd.md#rn-09))**

> El simulador usa **obligatoriamente** la utilidad con pro-labore descontado. Usar la utilidad
> inflada por no contar el trabajo propio es el error que lleva a contratar y quebrar.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Menos de 6 meses de historia | Se usa el promedio disponible y se advierte que la proyección es menos confiable |
| A2 | El presupuesto disponible es negativo o muy bajo | El sistema lo declara **no viable** y sugiere alternativas: medio tiempo, por obra, o crecer primero |
| A3 | No hay pro-labore definido | Se bloquea el simulador y se pide definirlo ([CU-25](#cu-25)) |


---

### <a id="cu-19"></a>CU-19 · Liquidar nómina del mes

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Pagar bien, descontar los adelantos una sola vez y entregar el desprendible |
| **Precondición** | La empleada tiene ficha con su salario acordado y su fecha de ingreso |
| **Frecuencia** | Mensual |

**Flujo principal**

1. Gerencia da de alta a la empleada, si no tiene ficha. **Dar de alta en nómina no crea un
   usuario**: se puede estar en nómina sin entrar al sistema, y por eso son dos fichas distintas.
2. Abre el **período** del mes que va a liquidar. Es único por año y mes.
3. Liquida a cada empleada con los días trabajados, las horas extra y los otros conceptos.
4. **El sistema no rehace los pasos por su cuenta:** una sola función de la base de datos, en una
   sola transacción, escribe la liquidación, **marca los adelantos pendientes como descontados** y
   escribe el movimiento del pago.
5. Las cifras son las del [06 §6.1](06-nomina-y-capacidad-de-pago.md#61-fórmulas): el valor de la hora ordinaria sale del salario entre las horas
   pactadas, la extra lleva su recargo, y **al devengado solo entran el salario del período y el
   total de las horas extra**, nunca las tarifas por hora.
6. Gerencia descarga el **desprendible en PDF**, con los devengados, los descuentos con la fecha
   de cada adelanto, el neto en números y en letras y la cuenta de origen.
7. Cuando ya no falta nadie, **cierra el período**: desde ahí no admite más liquidaciones.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La empleada ya fue liquidada en ese período | Se rechaza: una liquidación por persona y por mes, y lo impone una clave única |
| A2 | El período está cerrado | Se rechaza. Lo que haya que corregir después va por contra-asiento ([CU-04](#cu-04)) |
| A3 | Hay adelantos pendientes | Se descuentan del neto, **una sola vez**, y la cuenta por cobrar queda cancelada ([CU-26](#cu-26)) |
| A4 | Los adelantos pendientes suman más que el devengado | El neto daría negativo y la base lo rechaza: la liquidación no se escribe. Partirlo entre dos meses sería inventar una regla de negocio |
| A5 | La empleada sale del taller | Se la retira de la nómina; la ficha no se borra |
| A6 | La sesión es de tipo Operación | La base de datos lo rechaza, no solo la pantalla |

**Postcondición** — Liquidación escrita, adelantos marcados como descontados, movimiento del pago
en el libro y desprendible disponible. El salario **sí reduce la utilidad** ([BDD-19-1](03-requisitos-y-bdd.md#bdd-19-1)).

**Reglas de negocio** — [RF-54](03-requisitos-y-bdd.md#rf-54) (ficha de la empleada), [RF-55](03-requisitos-y-bdd.md#rf-55) (liquidación mensual),
[RF-56](03-requisitos-y-bdd.md#rf-56) y [RN-11](03-requisitos-y-bdd.md#rn-11) (el adelanto se descuenta una vez), [RF-57](03-requisitos-y-bdd.md#rf-57) (desprendible). El cálculo completo está
en [06 §6](06-nomina-y-capacidad-de-pago.md#6-liquidación-mensual) y el efecto sobre utilidad y caja, en [06 §6.3](06-nomina-y-capacidad-de-pago.md#63-el-efecto-correcto-sobre-utilidad-y-caja).


---

### <a id="cu-20"></a>CU-20 · Ver el propio desprendible

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Que cada quien pueda ver y bajar lo que le pagaron, y solo eso |
| **Precondición** | La nómina del período está liquidada |
| **Frecuencia** | Mensual |

**Flujo principal**

1. La persona abre Nómina y ve los períodos en los que tiene desprendible.
2. Elige uno y el sistema le devuelve el PDF con el logo del negocio: devengados, descuentos con
   la fecha de cada adelanto, el neto en números y en letras, y la cuenta de origen.

**Regla de negocio central ([RF-63](03-requisitos-y-bdd.md#rf-63))**

> **Operación ve únicamente el suyo, y eso lo decide PostgreSQL.** La política de lectura no le
> devuelve la fila de otra persona, así que para la API **esa liquidación no existe** y responde
> «no existe», no «no puedes». No es que la pantalla esconda el botón: es que el dato no sale de
> la base ([ADR-006](adr/ADR-006-rls-por-rol.md)).

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Se pide el desprendible de otra persona por acceso directo | La base de datos no devuelve la fila y la respuesta es «no existe» |
| A2 | La sesión es de Gerencia | Ve los de todas: es quien liquida |
| A3 | El período todavía no está liquidado | No hay desprendible que bajar, y se dice así |

**Postcondición** — PDF del propio desprendible en poder de quien lo pidió, y ninguna fila ajena
a la vista.

**Reglas de negocio** — [RF-57](03-requisitos-y-bdd.md#rf-57) (desprendible en PDF), [RF-63](03-requisitos-y-bdd.md#rf-63) (solo el propio). Los escenarios son
[BDD-02-4](03-requisitos-y-bdd.md#bdd-02-4) y [BDD-02-6](03-requisitos-y-bdd.md#bdd-02-6), y el contenido del documento, [06 §8](06-nomina-y-capacidad-de-pago.md#8-desprendible-de-pago).


---

### <a id="cu-21"></a>CU-21 · Importar histórico de Excel

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Traer lo que ya estaba en la hoja de cálculo sin volver a teclearlo |
| **Precondición** | Un archivo CSV con los movimientos |
| **Frecuencia** | Una vez al arrancar, y después casi nunca |

**Flujo principal**

1. Gerencia sube el archivo. **El archivo pasa por la API**, igual que un adjunto, y la primera
   pasada **no escribe ni una fila**.
2. El sistema devuelve las columnas que trae el archivo y las que el importador necesita, para
   que Gerencia las relacione. Las columnas pueden venir en cualquier orden.
3. Con el mapeo puesto, el sistema devuelve el **informe fila por fila**: las válidas, las que no
   sirven y por qué, y las que coinciden con un movimiento que ya existe.
4. Gerencia revisa el informe y confirma.
5. El sistema escribe los movimientos de las filas válidas y devuelve el mismo informe con lo que
   entró de verdad.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Hay 3 filas inválidas de 200 | Se cargan 197 y se reportan las 3 con su motivo ([BDD-21-2](03-requisitos-y-bdd.md#bdd-21-2)) |
| A2 | Hay filas que coinciden con movimientos que ya existen | **No se escribe nada** hasta que Gerencia confirme que acepta los duplicados ([BDD-21-3](03-requisitos-y-bdd.md#bdd-21-3)) |
| A3 | Se confirma dos veces el mismo archivo | Se rechaza: es lo que impide cargarlo repetido |
| A4 | No queda ni una fila válida | Se rechaza y no se escribe nada |
| A5 | El archivo pasa de 5 MB, o no es un CSV | Se rechaza antes de leerlo |
| A6 | La sesión es de tipo Operación | No alcanza la operación |

**Postcondición** — Los movimientos de las filas válidas en el libro, con su fecha de movimiento
original, y el informe de lo que no entró, con el motivo de cada fila.

**Reglas de negocio** — [RF-64](03-requisitos-y-bdd.md#rf-64) (mapeo de columnas), [RF-65](03-requisitos-y-bdd.md#rf-65) (errores por fila). Los escenarios son
[BDD-21-1](03-requisitos-y-bdd.md#bdd-21-1), [BDD-21-2](03-requisitos-y-bdd.md#bdd-21-2) y [BDD-21-3](03-requisitos-y-bdd.md#bdd-21-3).


---

### <a id="cu-22"></a>CU-22 · Exportar respaldo

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Tener una copia completa y verificable, fuera del sistema |
| **Precondición** | — |
| **Frecuencia** | Mensual, o antes de cualquier cambio grande |

**Flujo principal**

1. Gerencia pide la exportación con su **alcance** —la base entera, un mes, un rango de fechas o
   una sola tabla— y su formato: ZIP con un CSV por tabla, Excel o JSON.
2. **La API arma el archivo**, no el navegador: abre la transacción con la identidad de quien
   pidió y lee lo que la base le permita leer.
3. Calcula el `sha256` de cada archivo, escribe el `manifiesto.json` con los totales de control y
   deja la fila en el registro de exportaciones: quién sacó qué, y cuándo.
4. Gerencia **baja el archivo con una acción explícita**. No hay envío automático a ningún sitio.

**Regla de negocio central**

> **El manifiesto lo firma el servidor, y por eso vale.** Un `sha256` calculado en el navegador
> certifica lo que el navegador quiso certificar; calculado donde están los datos, y en la misma
> transacción que los leyó, certifica lo que salió de la base.
>
> **Esto es el respaldo, y la descarga de pantalla de [CU-37](#cu-37) no lo es.** Si el archivo puede
> reconstruir el estado del sistema, es respaldo y lleva manifiesto; si solo responde una
> pregunta del momento, es descarga de pantalla y no lo lleva.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La sesión es de tipo Operación | La exportación se rechaza **en la base de datos**, no después en la API ([BDD-02-5](03-requisitos-y-bdd.md#bdd-02-5)) |
| A2 | El respaldo es grande | Lo arma la API y lo entrega: no depende de la memoria del navegador |
| A3 | El archivo se va a usar para restaurar | Sirve, porque lleva manifiesto: es lo que permite comprobar que no se corrompió |
| A4 | Se pide un respaldo anonimizado para pruebas | También lleva manifiesto, y su `ambiente` dice de dónde salió |
| A5 | Nadie lo pide y la programación está activa | Se genera igual, mensual o al cerrar el mes, y espera a que alguien lo baje. La retención guarda los últimos doce |

**Postcondición** — Archivo en poder de Gerencia con su `manifiesto.json`, sus `sha256` y sus
totales de control, y una fila nueva que deja constancia de qué salió del sistema y cuándo.

**Reglas de negocio** — [RF-66](03-requisitos-y-bdd.md#rf-66) (exportar con descarga manual), [ADR-008](adr/ADR-008-exportacion.md) y [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md), que lo puso en el
[Sprint 8](08-plan-de-desarrollo.md#sprint-8). El contenido del manifiesto, el alcance por rol, los formatos, la retención, la
programación y quién arma el archivo están en [13-respaldo-y-exportacion.md](13-respaldo-y-exportacion.md). Los escenarios son
[BDD-22-1](03-requisitos-y-bdd.md#bdd-22-1), [BDD-22-2](03-requisitos-y-bdd.md#bdd-22-2) y [BDD-02-5](03-requisitos-y-bdd.md#bdd-02-5).


---

### <a id="cu-23"></a>CU-23 · Consultar auditoría

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Responder «¿quién hizo esto, y cuándo?» sin depender de la memoria de nadie |
| **Precondición** | — |
| **Frecuencia** | Ocasional, y siempre que algo no cuadra |

**Flujo principal**

1. Gerencia abre la bitácora y la filtra por fecha, por persona o por qué se tocó.
2. Cada entrada dice **quién, cuándo, desde qué dispositivo, desde qué IP y qué cambió**, con el
   estado anterior y el posterior.
3. Los cambios sobre usuarios y cargos se leen además en la **Bitácora de cambios** de Gestión de
   usuarios, que es la misma información filtrada, y desde ahí se pueden revertir ([CU-35](#cu-35)).
4. Los inicios de sesión —los que entraron y los que fallaron— quedan registrados con su fecha,
   su dispositivo y su IP, y **nunca con la contraseña tecleada**, ni completa ni parcial.

**Regla de negocio central**

> **La auditoría no la escribe la aplicación: la escriben triggers de la base de datos**
> ([ADR-005](adr/ADR-005-auditoria-por-triggers.md)). Así queda escrita aunque el cambio entre por otro camino, y **ninguna de sus filas
> se edita ni se borra** ([ADR-004](adr/ADR-004-base-solo-escritura.md)). Una bitácora editable no sirve para nada.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La sesión es de tipo Operación | La base de datos no le devuelve ninguna fila de auditoría ([BDD-02-6](03-requisitos-y-bdd.md#bdd-02-6)) |
| A2 | Se busca un cambio que alguien revirtió | Salen las dos entradas: la original, marcada como revertida, y la reversión ([CU-35](#cu-35)) |
| A3 | Se busca quién borró algo | No hay borrados que buscar: lo que se deja sin efecto queda anulado con su motivo ([CU-03](#cu-03)) |

**Postcondición** — En pantalla, quién hizo qué, cuándo, desde dónde y qué cambió. La consulta no
escribe nada en la auditoría salvo lo que ya registra cualquier acceso.

**Reglas de negocio** — [RF-05](03-requisitos-y-bdd.md#rf-05) (cada inicio de sesión registrado), [RF-67](03-requisitos-y-bdd.md#rf-67) (bitácora filtrable),
[RF-88](03-requisitos-y-bdd.md#rf-88) (todo cambio sobre usuarios y cargos). Los escenarios son [BDD-23-1](03-requisitos-y-bdd.md#bdd-23-1) y [BDD-23-2](03-requisitos-y-bdd.md#bdd-23-2), y cómo se
escribe, [04 §5.4](04-modelo-de-datos.md#54-auditoría-por-triggers).

> **Son dos consultas y no una, y el [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) dice por qué.** La auditoría completa —todas las tablas
> y los accesos, filtrable— es la operación de este caso. La bitácora de usuarios y cargos es una
> vista filtrada de lo mismo, vive en Gestión de usuarios y es desde donde se revierte ([CU-35](#cu-35)).


---

### <a id="cu-24"></a>CU-24 · Alertar descapitalización *(automático)*

| | |
|---|---|
| **Actor** | Sistema |
| **Disparador** | La consulta del Inicio y la del patrimonio, con 12 meses de historia |
| **Frecuencia** | En cada consulta |

**Flujo principal**

1. El sistema suma las **distribuciones** de los últimos 12 meses y las **utilidades** del mismo
   período.
2. Calcula la **tasa de retiro**: cuánto de lo que el negocio generó se sacó de él.
3. Si los retiros superan las utilidades, la lectura que acompaña al patrimonio pasa a nivel
   crítico y el Inicio muestra la alerta.
4. La alerta dice la cifra, no solo el color: cuánto se retiró, cuánto se generó y la diferencia.

**Regla de negocio central**

> **Retirar más de lo que el negocio genera se está comiendo el patrimonio, y eso no se ve en la
> utilidad del mes.** Un mes puede ser rentable y la alerta seguir encendida: mide doce meses, no
> uno, porque un retiro grande se nota en el año y no en la semana.

**Ejemplo**

> Retiros de $20.000.000 y utilidades de $18.000.000 en 12 meses.
> El negocio devolvió $2.000.000 más de lo que ganó: la alerta se enciende aunque el último mes
> haya cerrado bien.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Hay menos de 12 meses de historia | Se calcula con lo que hay y la lectura dice de cuántos meses sale |
| A2 | El pro-labore está definido | No cuenta como distribución: es gasto, y ya bajó la utilidad ([CU-25](#cu-25)) |
| A3 | La sesión es de tipo Operación | No alcanza ni el Inicio ni el patrimonio |

**Postcondición** — Alerta visible mientras la tasa de retiro siga por encima de lo que el
negocio genera. No escribe nada: se recalcula en cada consulta.

**Reglas de negocio** — [RF-49](03-requisitos-y-bdd.md#rf-49) (alertar cuando los retiros de 12 meses superan las utilidades),
[RF-48](03-requisitos-y-bdd.md#rf-48) (patrimonio). El escenario es [BDD-24-1](03-requisitos-y-bdd.md#bdd-24-1) y la tasa de retiro, [05 §9.3](05-reglas-financieras.md#93-estructura-y-patrimonio).


---

### <a id="cu-25"></a>CU-25 · Definir el pro-labore

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Ponerle precio al trabajo propio, para que la utilidad diga la verdad |
| **Precondición** | — |
| **Frecuencia** | Pocas veces al año |

**Flujo principal**

1. Gerencia define **cuánto vale al mes su trabajo en el taller** y **cuántas horas produce**.
2. El sistema **no edita la definición anterior**: escribe una nueva, vigente desde hoy, y la
   vieja queda con su período.
3. Desde ese día:
   - cada retiro se parte con el pro-labore **vigente en la fecha del retiro** ([CU-16](#cu-16));
   - el simulador de contratación deja de estar bloqueado ([CU-18](#cu-18)).
4. El pro-labore se registra **como gasto**: baja la utilidad, la caja y el patrimonio. Lo que se
   saque por encima de él es distribución, y esa no baja la utilidad.

**Regla de negocio central ([RN-08](03-requisitos-y-bdd.md#rn-08))**

> **El trabajo propio también produce, así que también cuesta.** Una utilidad que no descuenta el
> trabajo de quien dirige no es la utilidad del negocio: es la utilidad de un negocio con un
> empleado gratis, y ese negocio no existe. Es la cifra con la que se decide si se puede
> contratar, y por eso el simulador la exige ([RN-09](03-requisitos-y-bdd.md#rn-09)).

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Las horas pasan del máximo que admite el mes | Se rechaza: el límite sale de las horas de una semana de trabajo por 52 entre 12 ([RN-20](03-requisitos-y-bdd.md#rn-20)) |
| A2 | Las horas llevan más de dos decimales | Se rechaza, con su propio mensaje |
| A3 | Se define dos veces el mismo día | Quedan dos definiciones con la misma vigencia y manda la última; el historial no se recorta |
| A4 | La sesión es de tipo Operación | La base de datos lo rechaza, y además no le devuelve la definición vigente |
| A5 | Antes no había pro-labore | La utilidad de los meses siguientes baja, y eso es lo correcto: antes estaba inflada ([BDD-25-2](03-requisitos-y-bdd.md#bdd-25-2)) |

**Postcondición** — Pro-labore vigente desde hoy, con su historial entero, y las tres cosas que
dependen de él al día: la tarifa de los costeos nuevos, la división de los retiros y el
simulador.

**Reglas de negocio** — [RF-47](03-requisitos-y-bdd.md#rf-47) (retiros partidos en pro-labore y distribución), [RN-08](03-requisitos-y-bdd.md#rn-08) (el
pro-labore es gasto), [RN-09](03-requisitos-y-bdd.md#rn-09) (el simulador lo exige), [RN-20](03-requisitos-y-bdd.md#rn-20) (el límite de horas). Los escenarios
son [BDD-25-1](03-requisitos-y-bdd.md#bdd-25-1) y [BDD-25-2](03-requisitos-y-bdd.md#bdd-25-2).


---

### <a id="cu-26"></a>CU-26 · Registrar adelanto a la empleada

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Entregar plata a cuenta del salario sin contarla dos veces |

**Flujo principal**

1. Gerencia registra el adelanto con valor, fecha y cuenta de origen.
2. El sistema:
   - **Reduce la caja.**
   - **Crea una cuenta por cobrar** a nombre de la empleada.
   - **No registra gasto.**
3. Al liquidar la nómina ([CU-19](#cu-19)), el adelanto se descuenta del neto a pagar y la cuenta por
   cobrar se cancela.

**Regla de negocio ([RN-11](03-requisitos-y-bdd.md#rn-11))**

> Registrar el adelanto como gasto y después pagar el salario completo cuenta el mismo dinero
> dos veces. El gasto se reconoce una sola vez, en la liquidación.


---

### <a id="cu-27"></a>CU-27 · Horas pagadas vs. horas facturadas

> **⛔ Retirado el 2026-10-06.** Las horas facturadas se sacaban del tiempo por unidad del costeo,
> y el catálogo dejó de pedirlo. Las horas pagadas se siguen viendo en nómina; lo que ya no se
> puede calcular es contra qué compararlas. Lo que sigue queda como estaba.

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Saber cuánto tiempo pagado no se está convirtiendo en ventas |

**Flujo principal**

1. El sistema suma las horas pagadas del mes: nómina + pro-labore.
2. Suma las horas cargadas a pedidos entregados en el mes, según el costeo.
3. Presenta la diferencia y su costo.

**Ejemplo**

> 160 horas pagadas · 104 horas cargadas a pedidos → **56 horas no facturadas**.
> A $9.400 la hora, son **$526.400 de capacidad sin vender** en el mes.

**Interpretación documentada** — Una diferencia alta indica falta de demanda, exceso de
capacidad o trabajo que no se está cobrando: ajustes, repeticiones, diseños regalados.


---

### <a id="cu-28"></a>CU-28 · Iniciar sesión con usuario y contraseña

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Entrar al sistema en menos de 10 segundos, sin necesitar correo electrónico |
| **Precondición** | Usuario creado y activo |
| **Frecuencia** | Varias veces al día |

**Flujo principal**

1. La persona abre la aplicación y ve la pantalla de acceso. El foco arranca en el campo
   **Usuario**.
2. Escribe su nombre de usuario y su contraseña.
3. Confirma con **Entrar** o con la tecla Enter desde cualquiera de los dos campos.
4. El sistema normaliza el usuario a minúsculas y arma el correo sintético
   `usuario@usuarios.prisma.com`. Ese correo es un detalle interno: **nunca se muestra, nunca
   se pide, nunca se imprime.**
5. El proveedor de autenticación valida la contraseña contra su hash. El código propio nunca
   ve la contraseña.
6. El sistema carga la sesión con `nombre_completo`, cargo y `tipo`, actualiza `ultimo_acceso`
   y escribe el evento `inicio_sesion` en auditoría.
7. La barra superior muestra quién tiene la sesión abierta y el menú se arma según el **tipo**,
   nunca según el cargo.

**Regla de negocio central**

> El usuario que no existe y la contraseña equivocada dan **el mismo mensaje**: «Usuario o
> contraseña incorrectos». Si uno de los dos dijera «ese usuario no existe», cualquiera podría
> averiguar quién trabaja en el taller probando nombres. El usuario desactivado sí recibe un
> mensaje propio, «Este usuario está desactivado. Habla con Gerencia.», porque quien ya trabajó
> aquí no descubre nada nuevo y es lo único que evita que siga intentando creyendo que olvidó
> la clave.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El usuario no existe | **«Usuario o contraseña incorrectos»** |
| A2 | La contraseña es incorrecta | El **mismo** mensaje de A1 |
| A3 | El usuario está desactivado | **«Este usuario está desactivado. Habla con Gerencia.»**, aunque la contraseña sea correcta |
| A4 | `debe_cambiar_clave` está en verdadero | En lugar del tablero aparece la pantalla de crear contraseña ([CU-32](#cu-32)). No hay forma de saltarla salvo cerrar sesión |
| A5 | El actor cierra la sesión | Se borra la sesión, se escribe `cierre_sesion` en auditoría y se vuelve a la pantalla de acceso |
| A6 | Intentos fallidos repetidos | El proveedor los limita. Cada intento se registra con usuario intentado, fecha, dispositivo e IP; **nunca la contraseña tecleada**, ni completa ni parcial |
| A7 | La persona olvidó su contraseña | No hay recuperación por correo porque no hay correo real: Gerencia la restablece en persona ([CU-31](#cu-31)) |

**Postcondición** — Sesión abierta con nombre, cargo y tipo cargados, `ultimo_acceso`
actualizado y `inicio_sesion` escrito en auditoría.


---

### <a id="cu-29"></a>CU-29 · Crear un usuario

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Dar acceso a una persona nueva sin pedirle un correo electrónico que quizá no tiene |
| **Precondición** | Al menos un cargo activo en el catálogo |

**Flujo principal**

1. Gerencia abre la pantalla de Gestión de usuarios y elige **+ Nuevo usuario**.
2. Escribe el **nombre completo** de la persona.
3. Define el **nombre de usuario**: de 3 a 20 caracteres, minúsculas, números, punto, guion y
   guion bajo. Es `CITEXT`, así que `Maria` y `maria` son la misma persona.
4. Selecciona el **cargo** del catálogo — solo se ofrecen los activos — y el **tipo**:
   Gerencia u Operación.
5. Escribe una **contraseña temporal** de al menos 8 caracteres.
6. Confirma. El sistema crea la identidad con el correo sintético, guarda la ficha con
   `debe_cambiar_clave = TRUE` y escribe `usuario_creado` en auditoría.
7. Gerencia entrega la clave temporal **en persona**. No hay correo por donde mandarla.

**Regla de negocio central**

> **El tipo dice qué puede ver. El cargo dice qué hace.** El tipo es autoridad y es lo que
> evalúa Row Level Security; el cargo es descriptivo y **nunca decide un permiso**. Dos
> personas con el mismo cargo pueden tener tipos distintos.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El nombre de usuario ya existe | Se rechaza con mensaje claro. No se sugiere una variante automática |
| A2 | El nombre de usuario no cumple el formato | Se rechaza y se muestra la regla completa |
| A3 | La clave temporal tiene menos de 8 caracteres | Se rechaza |
| A4 | El nombre completo está vacío o tiene menos de 3 caracteres | Se rechaza |
| A5 | Quien intenta crear es de tipo Operación | La base de datos rechaza la operación, no solo la pantalla |
| A6 | La persona no está en nómina, por ejemplo un contratista externo | Se crea igual: `usuarios` y `empleados` son tablas distintas con ciclos de vida propios |

**Postcondición** — Usuario activo con clave temporal y cambio de contraseña obligatorio en el
primer ingreso.


---

### <a id="cu-30"></a>CU-30 · Desactivar un usuario

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Quitarle el acceso a alguien sin perder la historia de quién hizo qué |

**Flujo principal**

1. Gerencia localiza a la persona en el listado y elige *Desactivar*.
2. El sistema **exige un motivo escrito**. Sin motivo no continúa.
3. Gerencia escribe el motivo y confirma.
4. El sistema marca `activo` en falso y guarda `desactivado_en`, `desactivado_por` y
   `desactivado_motivo`. **La ficha no se borra.**
5. El siguiente intento de ingreso de esa persona se rechaza ([CU-28](#cu-28), A3).
6. Se escribe `usuario_desactivado` en auditoría.
7. La fila baja al grupo de desactivadas, al final de la misma tabla y detrás del separador
   `Desactivadas · nada se borra, queda el motivo`, con la fecha y la hora a la vista. Sus
   movimientos históricos siguen mostrando su nombre.

**Regla de negocio central ([RN-19](03-requisitos-y-bdd.md#rn-19))**

> Siempre debe quedar **al menos un usuario activo de tipo Gerencia**. El sistema rechaza
> desactivar o degradar al último: sin Gerencia activa nadie podría crear usuarios ni
> restablecer claves, y el negocio quedaría por fuera de su propio sistema. El guardián vive
> en un trigger de la base de datos, no en la pantalla.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Es el último usuario activo de tipo Gerencia | Se rechaza: «No se puede desactivar ni degradar al último usuario de Gerencia» |
| A2 | Se intenta cambiarle el tipo de Gerencia a Operación siendo el último | Mismo rechazo: degradar equivale a desactivar |
| A3 | El usuario ya está inactivo | Se informa y no se hace nada |
| A4 | La persona está en nómina | El registro de `empleados` no se toca: se quita el acceso, no el vínculo laboral |

**Postcondición** — Usuario sin acceso, marcado inactivo con motivo, íntegro en la base de datos.


---

### <a id="cu-31"></a>CU-31 · Restablecer la contraseña de un usuario

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Devolverle el acceso a quien olvidó su contraseña, sin un correo de recuperación que no existe |
| **Precondición** | Usuario existente |

**Flujo principal**

1. La persona le dice a Gerencia que no puede entrar. Es una conversación, no un formulario: aquí
   no hay «¿olvidaste tu contraseña?» porque no hay a dónde mandarlo ([ADR-009](adr/ADR-009-login-por-usuario.md)).
2. Gerencia la localiza en el listado y elige *Restablecer clave*.
3. El sistema pide una **contraseña temporal** de al menos 8 caracteres, y la muestra en claro **a
   propósito**: Gerencia tiene que poder dictarla.
4. Al confirmar, el sistema cambia la contraseña en el proveedor de identidad, deja
   `debe_cambiar_clave = TRUE` y escribe `clave_restablecida` en auditoría.
5. **Las sesiones que esa persona tuviera abiertas dejan de servir.** Si el restablecimiento fue
   porque alguien no debería seguir entrando, una sesión viva sería el fallo entero.
6. Gerencia le entrega la clave temporal **en persona**, y en el siguiente ingreso el sistema la
   obliga a cambiarla ([RF-79](03-requisitos-y-bdd.md#rf-79), [CU-32](#cu-32)).

**Regla de negocio central**

> **La contraseña anterior no se recupera: se reemplaza.** El sistema guarda su hash y nada más, y
> eso es también lo que hace que restablecer una clave sea **el único cambio que la bitácora no
> puede revertir** ([CU-35](#cu-35)): no se puede devolver lo que nunca se guardó. Para volver atrás se
> restablece otra vez, y eso deja una entrada nueva.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La clave temporal tiene menos de 8 caracteres | Se rechaza |
| A2 | Quien lo intenta es de tipo Operación | Se rechaza. Cada quien cambia la suya por [CU-32](#cu-32), que es otra cosa |
| A3 | El usuario está desactivado | No se ofrece: una clave nueva no le devolvería el acceso. Lo que corresponde es reactivarlo ([CU-34](#cu-34)) |
| A4 | El proveedor de identidad no responde | No se cambia nada y se dice que no se pudo. Una clave a medias dejaría a la persona sin la vieja y sin la nueva |

**Postcondición** — Usuario con una contraseña temporal conocida por Gerencia, obligado a cambiarla
al entrar, y sin ninguna sesión anterior en pie.


---

### <a id="cu-32"></a>CU-32 · Cambiar la propia contraseña

| | |
|---|---|
| **Actor** | Gerencia · Operación |
| **Objetivo** | Que cada quien ponga una contraseña que solo ella sepa |
| **Precondición** | Sesión activa |
| **Frecuencia** | En el primer ingreso, y después cuando se quiera |

**Flujo principal**

1. La persona entra por una de dos puertas, y **son la misma operación**:
   - «Crea tu contraseña», que aparece en lugar del tablero cuando el cambio es obligatorio;
   - «Cambiar mi contraseña», en el menú de la sesión, cuando se quiere cambiar.
2. Escribe la contraseña nueva dos veces. **No se le pide la actual**: ya tiene la sesión abierta,
   y pedirla no agregaría nada que la sesión no haya probado.
3. Confirma. El sistema cambia la contraseña en el proveedor de identidad, deja de exigir el
   cambio y escribe el evento en la auditoría.
4. **La sesión sigue en pie**: el token y la clave de firma no cambian, así que no hay que volver
   a entrar.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Las dos contraseñas no coinciden | Se rechaza con el campo señalado |
| A2 | La contraseña tiene menos de 8 caracteres | Se rechaza y se muestra la regla completa |
| A3 | El cambio era obligatorio y se intenta saltar la pantalla | No hay forma de llegar al tablero sin cambiarla: la única salida es cerrar sesión ([CU-28](#cu-28), A4) |
| A4 | La persona olvidó la contraseña y **no** tiene sesión abierta | Esto no le sirve: lo que corresponde es que Gerencia la restablezca en persona ([CU-31](#cu-31)) |

**Postcondición** — Contraseña cambiada, el cambio obligatorio apagado, el evento en la
auditoría y la sesión abierta sin interrupción.

**Reglas de negocio** — [RF-79](03-requisitos-y-bdd.md#rf-79) (cambio obligatorio en el primer ingreso y tras un
restablecimiento), [RF-80](03-requisitos-y-bdd.md#rf-80) (cada quien cambia la suya). El escenario es [BDD-32-1](03-requisitos-y-bdd.md#bdd-32-1).


---

### <a id="cu-33"></a>CU-33 · Administrar el catálogo de cargos

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Que los cargos del taller se llamen como se llaman, sin tocar permisos |
| **Precondición** | — |
| **Frecuencia** | Pocas veces al año |

**Flujo principal**

1. Gerencia abre el catálogo de cargos, dentro de Gestión de usuarios.
2. **Crea** un cargo, que se agrega al final del catálogo.
3. **Renombra** uno que ya existe: quienes lo tienen pasan a leerse con el nombre nuevo.
4. **Reordena** el catálogo, que es el orden en que se ofrece al crear un usuario.
5. **Desactiva** uno con motivo escrito: deja de ofrecerse, y **quien lo tenía lo conserva**.
6. Cada uno de estos cambios deja su entrada en la bitácora, y desde ahí se puede revertir
   ([CU-35](#cu-35)).

**Regla de negocio central**

> **El cargo describe el oficio y no da ni quita un permiso.** Eso lo decide el **tipo** —Gerencia
> u Operación—, que es lo que evalúa la base de datos. Dos personas con el mismo cargo pueden
> tener tipos distintos, y renombrar un cargo no cambia lo que nadie puede ver.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El nombre ya existe, con otras mayúsculas | Se rechaza: el catálogo no distingue mayúsculas |
| A2 | El cargo todavía lo tienen personas **activas** | No se desactiva: primero se les cambia el cargo |
| A3 | El cargo ya está inactivo | Se informa y no se hace nada |
| A4 | Se crea un usuario después de desactivar un cargo | El cargo ya no aparece en la lista, y quienes lo tenían lo conservan en su ficha ([BDD-33-1](03-requisitos-y-bdd.md#bdd-33-1)) |
| A5 | Un usuario conserva un cargo que ya está inactivo | Se permite dejárselo; lo que no se permite es **cambiárselo** por uno inactivo |
| A6 | La sesión es de tipo Operación | La base de datos lo rechaza, no solo la pantalla |

**Postcondición** — Catálogo con el cargo creado, renombrado, reordenado o desactivado con su
motivo, el historial en la bitácora y ningún permiso cambiado.

**Reglas de negocio** — [RF-74](03-requisitos-y-bdd.md#rf-74) (cada usuario con un cargo del catálogo), [RF-81](03-requisitos-y-bdd.md#rf-81) (crear, renombrar,
reordenar y desactivar). El escenario es [BDD-33-1](03-requisitos-y-bdd.md#bdd-33-1).


---

### <a id="cu-34"></a>CU-34 · Reactivar un usuario desactivado

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Devolverle el acceso a quien vuelve, sin borrar por qué se le había quitado |
| **Precondición** | Usuario desactivado |

**Flujo principal**

1. Gerencia localiza a la persona en el grupo de desactivadas, al final de la misma tabla, y
   pulsa su estado.
2. El sistema abre el panel de confirmación `¿Reactivar a …?` y muestra **desde cuándo** está
   desactivada y **con qué motivo** se desactivó. Quien decide devolver un acceso tiene que ver
   primero por qué se quitó.
3. El sistema **exige un motivo escrito de la reactivación**. Sin motivo no continúa.
4. Gerencia escribe el motivo y confirma con **Sí, reactivar**.
5. El sistema marca `activo` en verdadero, limpia `desactivado_en`, `desactivado_por` y
   `desactivado_motivo`, y pone **`debe_cambiar_clave` en verdadero**.
6. Se escribe `usuario_reactivado` en auditoría. La entrada aparece en la **Bitácora de cambios**
   como `Reactivado`, con quién, cuándo y el motivo.
7. La fila vuelve al grupo de activas. En el siguiente ingreso, la persona no ve el tablero sino
   la pantalla de crear contraseña ([CU-28](#cu-28), A4): quien vuelve después de meses no debe entrar con
   la clave vieja.

**Regla de negocio central**

> **Limpiar las tres columnas de desactivación no borra la historia.**
> `usuarios.desactivado_en / _por / _motivo` dicen el **estado actual**, no lo que pasó. Lo que
> pasó vive en `auditoria`, y por eso la bitácora sigue mostrando la desactivación con su fecha
> y su motivo aunque la persona ya esté activa otra vez.
>
> **El motivo es obligatorio en los dos sentidos.** Desactivar lo pide y reactivar también.
> Devolver un acceso pesa tanto como quitarlo, y dentro de seis meses la pregunta *"¿por qué
> esta persona volvió a entrar?"* tiene que tener respuesta escrita.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El motivo está vacío al confirmar | Error visible y no se reactiva |
| A2 | El usuario ya está activo | Se informa y no se hace nada |
| A3 | La persona no recuerda su contraseña anterior | No importa: la reactivación obliga a cambiarla de todos modos |
| A4 | La persona sigue en nómina | El registro de `empleados` no se toca: se devuelve el acceso, no el vínculo laboral |
| A5 | Quien intenta reactivar es de tipo Operación | La base de datos rechaza la operación, no solo la pantalla |

**Postcondición** — Usuario activo con cambio de contraseña obligatorio, las tres columnas de
desactivación limpias y la entrada `Reactivado` escrita en la bitácora. Es la contraparte exacta
de [CU-30](#cu-30), y por eso revertir una desactivación desde la bitácora ([CU-35](#cu-35)) equivale a reactivar.


---

### <a id="cu-35"></a>CU-35 · Revertir un cambio desde la bitácora

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Deshacer un cambio equivocado sobre un usuario o un cargo sin borrar el rastro del error |
| **Precondición** | Una entrada de la bitácora reversible y todavía no revertida |

**Flujo principal**

1. Gerencia abre la **Bitácora de cambios**, dentro de la pantalla de Gestión de usuarios, y
   localiza la entrada.
2. Elige *Revertir*. El sistema abre un panel de confirmación que dice exactamente qué va a
   pasar: «El cargo volverá de Domiciliaria a Empleada de producción».
3. El sistema **exige un motivo escrito**. Sin motivo no continúa.
4. Gerencia escribe el motivo y confirma con **Sí, revertir**.
5. El sistema aplica el valor anterior.
6. Marca la entrada original como **Revertida**, con un enlace a la entrada nueva, y apaga su
   botón de revertir.
7. Agrega una entrada nueva de tipo **Reversión** que dice qué se deshizo y por qué.
8. **La entrada original no se borra ni se modifica.**

**Regla de negocio central**

> **Revertir es escribir un cambio nuevo que deshace el anterior, nunca borrar el registro del
> error.** Es el mismo mecanismo del contra-asiento de [CU-04](#cu-04): el movimiento errado no se edita,
> se reversa, y los dos quedan visibles. Si alguien desactivó a la persona equivocada, la
> bitácora tiene que mostrar las dos cosas: que se desactivó y que se corrigió. Borrar la
> primera entrada convertiría la bitácora en un relato editable, y una bitácora editable no
> sirve para nada.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | La entrada es `Clave restablecida` | No es reversible. El sistema solo guarda el hash, nunca la contraseña anterior: no se puede deshacer lo que no se guardó. Para volver atrás hay que restablecerla otra vez ([CU-31](#cu-31)) |
| A2 | Revertir un `Tipo cambiado` dejaría cero usuarios activos de Gerencia | Se rechaza con aviso claro. Es el guardián de [RN-19](03-requisitos-y-bdd.md#rn-19), que vive en un trigger de la base de datos |
| A3 | Se intenta revertir el `Usuario creado` de quien tiene la sesión abierta | Se rechaza: Gerencia se dejaría a sí misma por fuera del sistema |
| A4 | El usuario afectado ya no existe | Se rechaza. No debería ocurrir, porque nada se borra |
| A5 | La entrada ya está revertida | El botón está apagado; se informa y no se hace nada |
| A6 | El motivo está vacío al confirmar | Error visible y no se revierte |
| A7 | Se revierte una entrada de tipo `Reversión` | Es legal: vuelve a dejar el valor anterior y también queda anotado |
| A8 | Quien intenta revertir es de tipo Operación | La base de datos rechaza la operación, no solo la pantalla |

**Postcondición** — Valor anterior restablecido, entrada original marcada como revertida y
entrada de `Reversión` escrita. La reversión es una **escritura compensatoria**, hermana del
contra-asiento de [CU-04](#cu-04).

**Nota sobre el modelo** — La bitácora no es una tabla nueva: es una vista sobre `auditoria`
—escrita por triggers, [`ADR-005`](adr/ADR-005-auditoria-por-triggers.md)— filtrada por las
tablas `usuarios` y `cargos`. Ninguna de sus filas se edita ni se elimina, que es lo que fija
[`ADR-004`](adr/ADR-004-base-solo-escritura.md).


---

### <a id="cu-36"></a>CU-36 · Previsualizar el sistema como lo ve Operación

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Ver la pantalla que verá la empleada para decidir si tiene sentido |
| **Precondición** | Sesión de tipo Gerencia |

**Flujo principal**

1. Gerencia abre el menú de la sesión y activa el interruptor **Ver como Operación**.
2. La interfaz se pinta como para una sesión de Operación: el menú lateral pierde Inversiones,
   Reportes y Nómina, los costos y márgenes de Productos desaparecen, Nómina queda bloqueada y
   **Gestión de usuarios desaparece del propio menú de la sesión**.
3. Una franja fija arriba del contenido avisa `Estás viendo el sistema como lo ve Operación` y
   ofrece **Volver a mi vista**. No se puede cerrar.
4. Gerencia apaga el interruptor, o pulsa *Volver a mi vista*, y todo vuelve.

**Regla de negocio central**

> **Esto no es una prueba de permisos.** La vista previa sirve para que Gerencia decida si la
> pantalla de la empleada tiene sentido, si le falta algo o si le sobra. **No sirve para
> comprobar que la empleada no puede llegar a los datos ocultos.** Ocultar un menú no es
> seguridad: los permisos los aplica PostgreSQL con Row Level Security
> ([`ADR-006`](adr/ADR-006-rls-por-rol.md)), y la única prueba válida es entrar con una sesión
> real de Operación contra la base de datos, como está en
> [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md). Este par de frases va escrito en la
> pantalla mientras la vista previa esté activa, no solo aquí.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | El actor es de tipo Operación | El interruptor no existe. No se atenúa ni se deshabilita: no está |
| A2 | Gerencia cierra la sesión con la vista previa activa | La vista previa se apaga. Nadie hereda el modo de otra sesión |
| A3 | Gerencia quiere volver a Gestión de usuarios sin salir del modo | La entrada no está en el menú mientras la vista previa esté activa. El modo solo cambia lo que el navegador pinta; la sesión real sigue siendo de Gerencia |

**Postcondición** — La interfaz se comporta como para Operación mientras el modo esté activo,
con el aviso siempre visible. El tipo real de la sesión **nunca cambia**: sigue siendo Gerencia
y es lo que evalúa la base de datos.


---

### <a id="cu-37"></a>CU-37 · Descargar lo que muestra una pantalla

| | |
|---|---|
| **Actor** | Gerencia (exclusivo) |
| **Objetivo** | Llevarse a una reunión o a una hoja de cálculo lo que la pantalla ya está mostrando |
| **Precondición** | Pantalla con datos a la vista |
| **Frecuencia** | Ocasional |

**Flujo principal**

1. Gerencia pulsa **Descargar** en el encabezado de la pantalla. Hoy existe en el Inicio ([RF-96](03-requisitos-y-bdd.md#rf-96)).
2. El sistema abre un panel con lo que esa pantalla puede bajar y el formato de cada cosa:
   CSV, PDF o ambos.
3. Gerencia marca qué incluir y confirma.
4. El sistema arma el archivo **con las cifras ya calculadas que se están viendo**, sin volver a
   consultar nada ni recalcular con otro corte.
5. El archivo se baja en el mismo acto y la descarga queda registrada en `exportaciones` con
   `alcance_tipo = 'pantalla'` y sin manifiesto.

**Regla de negocio central**

> **Esto no es un respaldo y no lo reemplaza.** Un respaldo tiene que ser completo y verificable
> —manifiesto, `sha256`, totales de control ([CU-22](#cu-22))—; una descarga de pantalla tiene que ser
> legible, aunque esté incompleta. La regla que las separa es corta: si el archivo puede
> reconstruir el estado del sistema, es respaldo; si solo responde una pregunta del momento, es
> descarga de pantalla. Está desarrollada en
> [`13-respaldo-y-exportacion.md`](13-respaldo-y-exportacion.md), punto 2.1.

**Flujos alternativos**

| # | Situación | Comportamiento |
|---|---|---|
| A1 | Quien intenta descargar es de tipo Operación | No hay botón, y la base de datos rechaza la operación igual: lo que baja el Inicio incluye utilidad, caja y patrimonio |
| A2 | No se marca nada en el panel | No se genera archivo; se pide elegir al menos una cosa |
| A3 | La pantalla está filtrada | Baja lo filtrado, y el archivo dice en su encabezado qué filtro estaba puesto |
| A4 | Se pide con esto restaurar el sistema | No sirve: sin manifiesto no hay nada que verificar. Para eso está [CU-22](#cu-22) |

**Postcondición** — Archivo CSV o PDF en poder de Gerencia, sin manifiesto, y una fila nueva en
`exportaciones` que deja constancia de qué salió del sistema y cuándo.

## 3. Trazabilidad

La matriz que conecta cada caso de uso con su requisito, su escenario BDD, su pantalla del
mockup y sus tablas está en [`03-requisitos-y-bdd.md`](03-requisitos-y-bdd.md), sección 5.

[CU-28](#cu-28) a [CU-33](#cu-33) entran en esa matriz con los requisitos **[RF-71](03-requisitos-y-bdd.md#rf-71) a [RF-83](03-requisitos-y-bdd.md#rf-83)**, los escenarios
**[BDD-28-\*](03-requisitos-y-bdd.md#bdd-28-1), [BDD-29-\*](03-requisitos-y-bdd.md#bdd-29-1), [BDD-30-1](03-requisitos-y-bdd.md#bdd-30-1), [BDD-32-1](03-requisitos-y-bdd.md#bdd-32-1) y [BDD-33-1](03-requisitos-y-bdd.md#bdd-33-1)**, las pantallas **0 · Acceso** y
**9 · Gestión de usuarios**, y las tablas `usuarios`, `cargos` y `auditoria`.

[CU-34](#cu-34) a [CU-36](#cu-36) entran con los requisitos **[RF-84](03-requisitos-y-bdd.md#rf-84) a [RF-94](03-requisitos-y-bdd.md#rf-94)**, los escenarios
**[BDD-34-\*](03-requisitos-y-bdd.md#bdd-34-1), [BDD-35-\*](03-requisitos-y-bdd.md#bdd-35-1) y [BDD-36-1](03-requisitos-y-bdd.md#bdd-36-1)**, la pantalla **9 · Gestión de usuarios** y las mismas tres
tablas. Ninguno agrega tablas nuevas: la bitácora es una vista sobre `auditoria`, y la vista
previa de [CU-36](#cu-36) no toca la base de datos.

[CU-37](#cu-37) entra con el requisito **[RF-96](03-requisitos-y-bdd.md#rf-96)**, el escenario **[BDD-13-4](03-requisitos-y-bdd.md#bdd-13-4)**, la pantalla **1 · Dashboard**
y la tabla `exportaciones`. **[RF-96](03-requisitos-y-bdd.md#rf-96) cuelga de [CU-37](#cu-37), no de [CU-22](#cu-22):** el respaldo de [CU-22](#cu-22) lleva
manifiesto y la descarga de pantalla no, así que no pueden ser el mismo caso de uso sin que uno
de los dos quede mal descrito. Tampoco agrega tablas: reutiliza `exportaciones` con
`alcance_tipo = 'pantalla'` ([`13-respaldo-y-exportacion.md`](13-respaldo-y-exportacion.md),
puntos 2.1 y 8).

## 4. Cuándo entró cada caso de uso

Qué hay construido de cada caso de uso, y por dónde se llega a ese código. **Es la respuesta a
«¿esto ya está?»** sin tener que abrir cuatro repositorios.

**La columna que más sirve es la versión**, y no el commit: la etiqueta `v<versión>` que la
tubería pone cuando esa versión entra a `develop` ([ADR-059](adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md)) apunta a ese mismo commit, así que
con ella se llega al código, al release y a lo que entró entre dos entregas. El commit se anota
igual, porque cada tarea es **uno solo** y su asunto lleva el sprint y el número ([ADR-028](adr/ADR-028-un-commit-por-tarea.md)),
y la rama es siempre `feature/<id de la tarea>` ([ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md)).

**Quién llena la fila:** el PR de la tarea, igual que marca `[x]` en el tablero. Un caso de uso
que se declare integrado sin su fila es una promesa sin respaldo.

**La fila apunta a la última pieza que lo dejó usable**, no a la primera: un caso de uso se
construye entre dos o tres repositorios, y la columna Tarea enseña la cadena entera. **Un guion
quiere decir que el dato no está en la historia de git**, no que no aplique; el [§4.1](#41-las-filas-sin-rastro) dice por qué.

| Estado | Qué quiere decir |
|---|---|
| ✅ | Integrado: está en `develop` y se puede usar |
| 🚧 | En construcción: una parte está en `develop` y otra no, y el [§4.2](#42-lo-que-les-falta-a-las-filas-en-construcción) dice cuál |
| ⏭️ | Sin empezar |
| ⛔ | Retirado |

| Caso de uso | Estado | Tarea | Repositorio · PR | Commit | Rama | Fecha | Versión |
|---|:---:|---|---|---|---|---|---|
| [CU-01](#cu-01) · Registrar ingreso | ✅ | [3.4](08-plan-de-desarrollo.md#tarea-3-4) · [3.5](08-plan-de-desarrollo.md#tarea-3-5) | — | — | — | — | — |
| [CU-02](#cu-02) · Registrar gasto con recibo | ✅ | [3.6](08-plan-de-desarrollo.md#tarea-3-6) | `prisma_db` · PR #25 | `0a5b93a` | `feature/3.6` | 2026-09-22 | esquema `0.10.0` |
| [CU-03](#cu-03) · Anular movimiento errado | ✅ | [3.9](08-plan-de-desarrollo.md#tarea-3-9) · [3.20](08-plan-de-desarrollo.md#tarea-3-20) · [3.23](08-plan-de-desarrollo.md#tarea-3-23) | `prisma_db` · PR #30 | `da0b5e4` | `claude/tarea-pendiente-siguiente-mxvxly` | 2026-09-23 | esquema `0.14.0` |
| [CU-04](#cu-04) · Corregir por contra-asiento | ✅ | [3.10](08-plan-de-desarrollo.md#tarea-3-10) | `prisma_db` · PR #32 | `e12ec32` | `sprint3` | 2026-09-24 | esquema `0.16.0` |
| [CU-05](#cu-05) · Registrar pedido de venta | ✅ | [4.3](08-plan-de-desarrollo.md#tarea-4-3) | — | — | — | — | — |
| [CU-06](#cu-06) · Registrar un pago del pedido | ✅ | [4.4](08-plan-de-desarrollo.md#tarea-4-4) · [10.5](08-plan-de-desarrollo.md#tarea-10-5) · [10.6](08-plan-de-desarrollo.md#tarea-10-6) | `prisma_front` · PR #147 | `f08f8f2` | `feature/el-estado-del-pedido` | 2026-10-16 | `2.2.0+57` |
| [CU-07](#cu-07) · Entregar pedido y cobrar saldo | ✅ | [4.5](08-plan-de-desarrollo.md#tarea-4-5) · [10.4](08-plan-de-desarrollo.md#tarea-10-4) · [10.6](08-plan-de-desarrollo.md#tarea-10-6) | `prisma_front` · PR #147 | `f08f8f2` | `feature/el-estado-del-pedido` | 2026-10-16 | `2.2.0+57` |
| [CU-07 A3](#cu-07) · Cancelar el pedido | ✅ | [4.9](08-plan-de-desarrollo.md#tarea-4-9) · [10.6](08-plan-de-desarrollo.md#tarea-10-6) | `prisma_front` · PR #147 | `f08f8f2` | `feature/el-estado-del-pedido` | 2026-10-16 | `2.2.0+57` |
| [CU-08](#cu-08) · Consultar pedidos por fecha | ✅ | [4.6](08-plan-de-desarrollo.md#tarea-4-6) · [10.7](08-plan-de-desarrollo.md#tarea-10-7) | `prisma_front` · PR #147 | `f08f8f2` | `feature/el-estado-del-pedido` | 2026-10-16 | `2.2.0+57` |
| [CU-09](#cu-09) · Costear un producto | ✅ | [5.2](08-plan-de-desarrollo.md#tarea-5-2) · [5.3](08-plan-de-desarrollo.md#tarea-5-3) · [5.9](08-plan-de-desarrollo.md#tarea-5-9) | `prisma_front` · PR #49 | `166156c` | `feature/5.9` | 2026-09-29 | `0.27.0+33` |
| [CU-10](#cu-10) · Costear servicio de bordado | ⛔ | [5.4](08-plan-de-desarrollo.md#tarea-5-4) · [10.3](08-plan-de-desarrollo.md#tarea-10-3) | `prisma_api` · PR #77 | `13fbb39` | `feature/5.4` | 2026-09-30 | `0.41.0` |
| [CU-11](#cu-11) · Generar cotización PDF | ✅ | [8.8](08-plan-de-desarrollo.md#tarea-8-8) · [8.12](08-plan-de-desarrollo.md#tarea-8-12) | `prisma_front` · PR #56 | `35a813a` | `feature/8.8` | 2026-10-01 | `0.33.0+39` |
| [CU-12](#cu-12) · Validar anticipo mínimo | ✅ | [8.9](08-plan-de-desarrollo.md#tarea-8-9) | `prisma_api` · PR #86 | `a8bbe31` | `feature/8.9` | 2026-10-02 | `0.48.0` |
| [CU-13](#cu-13) · Ver utilidad, caja y caja libre | ✅ | [6.1](08-plan-de-desarrollo.md#tarea-6-1) · [6.3](08-plan-de-desarrollo.md#tarea-6-3) · [6.11](08-plan-de-desarrollo.md#tarea-6-11) | `prisma_front` · PR #47 | `3b47343` | `feature/6.3` | 2026-09-29 | `0.25.0+31` |
| [CU-14](#cu-14) · Ver promedio de ganancias | ✅ | [6.5](08-plan-de-desarrollo.md#tarea-6-5) | `prisma_front` · PR #51 | `d13f9a8` | `feature/6.5` | 2026-09-29 | `0.29.0+35` |
| [CU-15](#cu-15) · Registrar inversión en activo | ✅ | [7.1](08-plan-de-desarrollo.md#tarea-7-1) · [7.2](08-plan-de-desarrollo.md#tarea-7-2) | — | — | — | — | — |
| [CU-16](#cu-16) · Registrar retiro | ✅ | [7.4](08-plan-de-desarrollo.md#tarea-7-4) | — | — | — | — | — |
| [CU-17](#cu-17) · Configurar los 4 sobres | ✅ | [7.7](08-plan-de-desarrollo.md#tarea-7-7) · [7.8](08-plan-de-desarrollo.md#tarea-7-8) | `prisma_front` · PR #54 | `1f12af1` | `feature/7.8` | 2026-09-30 | `0.32.0+38` |
| [CU-18](#cu-18) · Simular capacidad de pago | ✅ | [8.5](08-plan-de-desarrollo.md#tarea-8-5) · [8.6](08-plan-de-desarrollo.md#tarea-8-6) | `prisma_api` · PR #92 | `510357e` | `feature/8.6` | 2026-10-03 | `0.53.0` |
| [CU-19](#cu-19) · Liquidar nómina del mes | 🚧 | [8.2](08-plan-de-desarrollo.md#tarea-8-2) | `prisma_db` · PR #41 | `e35406f` | `feature/8.2` | 2026-10-02 | esquema `0.22.0` |
| [CU-20](#cu-20) · Ver el propio desprendible | 🚧 | [8.4](08-plan-de-desarrollo.md#tarea-8-4) | `prisma_api` · PR #91 | `cf16129` | `feature/8.4` | 2026-10-03 | `0.52.0` |
| [CU-21](#cu-21) · Importar histórico de Excel | ✅ | [8.10](08-plan-de-desarrollo.md#tarea-8-10) | `prisma_front` · PR #64 | `5cf1cc5` | `feature/8.10` | 2026-10-03 | `0.39.0+46` |
| [CU-22](#cu-22) · Exportar respaldo | 🚧 | [8.13](08-plan-de-desarrollo.md#tarea-8-13) · [8.14](08-plan-de-desarrollo.md#tarea-8-14) · [8.15](08-plan-de-desarrollo.md#tarea-8-15) · [8.17](08-plan-de-desarrollo.md#tarea-8-17) | `prisma_db` · PR #61 | `18c63c5` | `feature/8.14` | 2026-10-08 | esquema `0.26.0` |
| [CU-23](#cu-23) · Consultar auditoría | 🚧 | [8.13](08-plan-de-desarrollo.md#tarea-8-13) · [8.18](08-plan-de-desarrollo.md#tarea-8-18) · [8.19](08-plan-de-desarrollo.md#tarea-8-19) | `prisma_api` · PR #118 | `558d99e` | `feature/8.18` | 2026-10-09 | `2.3.0` |
| [CU-24](#cu-24) · Alertar descapitalización | ✅ | [6.7](08-plan-de-desarrollo.md#tarea-6-7) · [7.6](08-plan-de-desarrollo.md#tarea-7-6) | `prisma_api` · PR #74 | `8d3378f` | `feature/7.6` | 2026-09-29 | `0.38.0` |
| [CU-25](#cu-25) · Definir el pro-labore | ✅ | [7.3](08-plan-de-desarrollo.md#tarea-7-3) | — | — | — | — | — |
| [CU-26](#cu-26) · Registrar adelanto a la empleada | ✅ | [8.3](08-plan-de-desarrollo.md#tarea-8-3) | `prisma_api` · PR #87 | `3089bc8` | `feature/8.3` | 2026-10-02 | `0.49.0` |
| [CU-27](#cu-27) · Horas pagadas vs. horas facturadas | ⛔ | [8.7](08-plan-de-desarrollo.md#tarea-8-7) · [10.3](08-plan-de-desarrollo.md#tarea-10-3) | `prisma_front` · PR #63 | `3cf3ab3` | `feature/8.7` | 2026-10-03 | `0.38.0+45` |
| [CU-28](#cu-28) · Iniciar sesión con usuario y contraseña | ✅ | [2.1](08-plan-de-desarrollo.md#tarea-2-1) · [2.2](08-plan-de-desarrollo.md#tarea-2-2) · [2.6](08-plan-de-desarrollo.md#tarea-2-6) | `prisma_front` | `561874c` | — | 2026-09-17 | `0.1.0+1` |
| [CU-29](#cu-29) · Crear un usuario | ✅ | [2.7](08-plan-de-desarrollo.md#tarea-2-7) | — | — | — | — | — |
| [CU-30](#cu-30) · Desactivar un usuario | ✅ | [2.7](08-plan-de-desarrollo.md#tarea-2-7) · [2.15](08-plan-de-desarrollo.md#tarea-2-15) | — | — | — | — | — |
| [CU-31](#cu-31) · Restablecer la contraseña de un usuario | ✅ | [2.7](08-plan-de-desarrollo.md#tarea-2-7) | — | — | — | — | — |
| [CU-32](#cu-32) · Cambiar la propia contraseña | ✅ | [2.6](08-plan-de-desarrollo.md#tarea-2-6) | `prisma_front` | `561874c` | — | 2026-09-17 | `0.1.0+1` |
| [CU-33](#cu-33) · Administrar el catálogo de cargos | ✅ | [2.8](08-plan-de-desarrollo.md#tarea-2-8) | — | — | — | — | — |
| [CU-34](#cu-34) · Reactivar un usuario desactivado | ✅ | [2.17](08-plan-de-desarrollo.md#tarea-2-17) | — | — | — | — | — |
| [CU-35](#cu-35) · Revertir un cambio desde la bitácora | ✅ | [2.16](08-plan-de-desarrollo.md#tarea-2-16) | `prisma_db` · PR #24 | `ab98f11` | `feature/2.16` | 2026-09-21 | esquema `0.10.0` |
| [CU-36](#cu-36) · Previsualizar el sistema como lo ve Operación | ✅ | [2.18](08-plan-de-desarrollo.md#tarea-2-18) | — | — | — | — | — |
| [CU-37](#cu-37) · Descargar lo que muestra una pantalla | ✅ | [6.9](08-plan-de-desarrollo.md#tarea-6-9) | `prisma_api` · PR #75 | `8556219` | `feature/6.9` | 2026-09-30 | `0.39.0` |

### 4.1 Las filas sin rastro

Trece filas llevan guion en el commit, la rama, la fecha o la versión, y **no es trabajo que
falte: es historia que no existe.** Son dos causas, las dos anteriores al 2026-09-21:

- **La API tiene tres commits raíz**, y el más nuevo —del 2026-09-29— agrega el árbol entero sin
  padres. Todo lo que la API hizo antes de esa fecha no está en su historia, así que `git log` no
  lo puede encontrar.
- **El `Sprint N / N.M:` del asunto empezó con el [ADR-028](adr/ADR-028-un-commit-por-tarea.md), y la rama `feature/<id>` con el [ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md).**
  De las tareas de antes, 79 no tienen commit que las nombre en ninguno de los cuatro
  repositorios, y las ramas de las que sí se llamaban `sprint3` o `claude/…`.

Donde el commit aparece pero la rama no es rastreable, se anota el commit y la rama queda en
guion: la fusión más antigua de su camino nombra una promoción posterior y no la rama de la tarea,
así que escribirla sería inventarla. **Un dato inventado en una tabla de trazabilidad es peor que
un hueco**, y de aquí para adelante no vuelve a pasar: cada tarea entra con su commit, su rama y
su PR.

### 4.2 Lo que les falta a las filas en construcción

- **[CU-19](#cu-19) · Liquidar nómina del mes.** La base liquida desde la [8.2](08-plan-de-desarrollo.md#tarea-8-2) y el contrato tiene sus
  seis rutas, pero **la API solo sirve `/consultas/desprendible`**: las cinco de `nomina` no las
  sirve nadie y **ninguna tarea del [08](08-plan-de-desarrollo.md) las construye**. Es un hueco del plan, no una tarea
  pendiente.
- **[CU-20](#cu-20) · Ver el propio desprendible.** La API lo sirve desde la [8.4](08-plan-de-desarrollo.md#tarea-8-4), y **falta la pantalla**,
  que tampoco tiene tarea.
- **[CU-22](#cu-22) · Exportar respaldo.** Le faltan la [8.15](08-plan-de-desarrollo.md#tarea-8-15), el respaldo en la API, y la [8.17](08-plan-de-desarrollo.md#tarea-8-17), su panel.
- **[CU-23](#cu-23) · Consultar auditoría.** Le falta la [8.19](08-plan-de-desarrollo.md#tarea-8-19), el panel «Auditoría».

### 4.3 La comprobación que impide que envejezca

`verificar` cruza esta tabla con el [§2](#2-casos-de-uso-detallados) en los dos sentidos y falla si algo no cuadra: un caso
de uso sin fila, una fila que nombra uno que no existe, un estado que no está en la leyenda o una
fila integrada sin tarea. Así un caso de uso nuevo no puede entrar sin decir cuándo entró.

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [03](03-requisitos-y-bdd.md "03 · Requisitos, reglas de negocio y escenarios BDD") · [04](04-modelo-de-datos.md "04 · Modelo de datos") · [05](05-reglas-financieras.md "05 · Reglas financieras y KPIs") · [07](07-arquitectura.md "07 · Arquitectura técnica") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [09](09-plan-de-implantacion.md "09 · Plan de implantación") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [13](13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [15](15-glosario.md "15 · Glosario") · [20](20-contrato-de-api.md "20 · Contrato de la API") · [21](21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [22](22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [23](23-diagramas-de-casos-de-uso.md "23 · Diagramas de los casos de uso") · [Contrato](../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-013](adr/ADR-013-cuatro-ambientes.md "ADR-013 · Cuatro ambientes y promoción de migraciones") · [ADR-022](adr/ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [ADR-027](adr/ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [ADR-033](adr/ADR-033-service-role-solo-en-auth.md "ADR-033 · La clave de servicio entra, pero solo para crear identidades") · [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8") · [README](../scripts/docs/README.md "Herramienta de documentación")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [01 · Visión y alcance](01-vision-y-alcance.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [03 · Requisitos y BDD](03-requisitos-y-bdd.md)
