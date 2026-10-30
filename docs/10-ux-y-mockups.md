# 10 · Diseño de experiencia y mockups

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [9.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/10-ux-y-mockups.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-30 | [UX](INDICE.md#etiqueta-ux) · [Front](INDICE.md#etiqueta-front) |

Prototipo navegable: [`../mockup/prisma-mockup.html`](../mockup/prisma-mockup.html)

> **El mockup HTML es el contrato de diseño, y lo sigue siendo.** El front se construye en
> Flutter, pero lo que Flutter implementa es esto: cada pantalla, cada estado y cada texto salen
> del prototipo, no del criterio de quien programa. Cambió la tecnología con la que se construye,
> no quién manda en el diseño. La regla de oro del proyecto sigue igual: **nada se construye
> hasta que el mockup de esa pantalla esté aprobado.** Lo que no está dibujado aquí todavía no
> existe.

---

## 1. Principios de diseño

| # | Principio | Consecuencia concreta |
|---|---|---|
| <a id="principio-1"></a>1 | **El celular es el dispositivo principal** | Todo se diseña primero para una pantalla de 375 px y una sola mano |
| <a id="principio-2"></a>2 | **Registrar debe costar menos que no registrar** | El botón de registro rápido flota sobre todas las pantallas menos el Inicio; máximo 4 campos obligatorios |
| <a id="principio-3"></a>3 | **Las tres cifras nunca van solas** | Utilidad, caja y caja libre siempre juntas, nunca una sin las otras |
| <a id="principio-4"></a>4 | **Nada de jerga contable** | "Lo que ganaste" en vez de "utilidad neta del ejercicio" |
| <a id="principio-5"></a>5 | **Las alertas dicen qué hacer** | No "caja libre negativa" sino "estás usando plata de anticipos" |
| <a id="principio-6"></a>6 | **Lo restringido no se ve, no se atenúa** | El rol Operación no ve menús deshabilitados: simplemente no existen. El menú llega armado desde el ingreso —lo manda la API según el tipo de la sesión ([principio 9](#principio-9), [RF-103](03-requisitos-y-bdd.md#rf-103))—, no se recorta después |
| <a id="principio-7"></a>7 | **El dinero siempre con formato colombiano** | `$1.350.784` — punto de miles, sin decimales |
| <a id="principio-8"></a>8 | **El Inicio es un espejo, no un formulario** | Ninguna acción que escriba en la base vive en el Inicio: cada cosa se registra en la pantalla de su asunto —el dinero en Movimientos, los pedidos en Pedidos, el catálogo en Productos, la gente en Gestión de usuarios |
| <a id="principio-9"></a>9 | **El front no decide nada** | Los mensajes de error, las reglas de los formularios y qué opciones de menú existen los dicta la API; el front los pinta |

> **Por qué el Inicio no escribe.** Un tablero que además crea datos compite consigo mismo: la
> cifra que acabas de mirar cambia por algo que hiciste dos centímetros más abajo, y ya no sabes
> si el número que recuerdas era de antes o de después. Y un Inicio que no escribe se puede
> exportar entero sin ambigüedad: lo que ves es lo que descargas, porque nada de lo que hay ahí
> está a medio hacer. Por eso el botón flotante de registro rápido del [principio 2](#principio-2) flota sobre
> todas las pantallas menos esta: un botón que escribe plata volvería formulario justo a la
> pantalla que se definió como espejo.

> **Por qué el front no decide.** Una regla escrita en dos sitios se separa. Y cuando se separa,
> la que la persona ve en pantalla deja de ser la que el sistema aplica: el formulario acepta algo
> que la API después rechaza, o avisa de algo que la API ya permitía. Quien queda mal es la
> pantalla, y quien pierde el trabajo escrito es la empleada. Con una sola fuente —la API— el
> aviso y la decisión no pueden divergir. Esto no le quita agilidad al diseño: la pantalla sigue
> avisando al instante, pero lo que avisa se lo dictaron ([§3.4](#34-el-descriptor-de-formulario)).

---

## 2. Mapa de navegación

```mermaid
graph TD
  A0{¿La versión del front sirve
con la de la API?} -->|No| VI[Versión incompatible · no hay salida]
  A0 -->|Sí| L[Acceso · usuario y contraseña]
  L --> V{¿Debe cambiar la clave?}
  V -->|Sí| CC[Crea tu contraseña]
  V -->|No| D[Dashboard]
  CC --> D

  D --> P[Pedidos]
  D --> M[Movimientos]
  D --> PR[Productos]
  D --> R[Reportes]
  D --> I[Inversiones y retiros]
  D --> N[Nómina]
  D --> C[Cotizador]
  D --> CF[Configuración]

  MS[Menú de la sesión · el nombre en el topbar] --> U[Gestión de usuarios]
  MS --> MP[Cambiar mi contraseña]
  MS --> VO[Ver como Operación]

  P --> CL[Clientes del taller]
  P --> PD[Detalle del pedido]
  PD --> PA[Cobrar anticipo]
  PD --> PE[Entregar y cobrar saldo]

  M --> MR[Registro rápido]
  M --> MA[Anular con motivo]
  M --> MV[Ver anulados]
  M --> MT[Cómo se ve cada tipo]

  N --> NS[Simulador de capacidad]
  N --> NL[Liquidación mensual]

  I --> IP[Pro-labore]
  I --> IL[Límite de horas]
  I --> IS[Los 4 sobres]

  CF --> CA[Auditoría]
  CF --> CE[Exportar respaldo]

  U --> UT[Tabla única · activas y desactivadas]
  U --> UB[Bitácora de cambios]
  U --> UC[Catálogo de cargos]

  style N fill:#fde68a
  style I fill:#fde68a
  style CF fill:#fde68a
  style U fill:#fde68a
  style MA fill:#fde68a
  style MV fill:#fde68a
  style MT fill:#fde68a
  style VI fill:#fecaca
```

Lo que va en amarillo es **exclusivo de Gerencia**: pantallas enteras, y dentro de Movimientos,
anular, ver los anulados y decidir cómo se ve cada tipo.

**Gestión de usuarios cuelga aparte a propósito.** No está en el menú lateral: se abre desde el
menú de la sesión, el que aparece al pulsar el nombre en el topbar. Administrar quién entra no
es una tarea del día a día del taller, como sí lo son Pedidos o Movimientos: es una tarea de
cuenta, y vive donde ya están «Cambiar mi contraseña» y «Cerrar sesión». Las pantallas siguen
siendo 11; lo que cambia es por dónde se llega a una de ellas.

El acceso ya no es una caja de paso: es una pantalla con diseño propio, y es donde se decide
todo lo demás. Quien entra con la clave temporal que le dio Gerencia no llega al Dashboard
sino a **Crea tu contraseña**, y de ahí no sale sin cambiarla.

### 2.1 Navegación por rol

| Tipo de usuario | Menú visible |
|---|---|
| **Gerencia** | Dashboard · Pedidos · Movimientos · Productos · Reportes · Inversiones · Nómina · Cotizador · Configuración |
| **Operación** | Inicio · Pedidos · Movimientos · Productos (sin costos) · Cotizador · Mi desprendible |

**Gestión de usuarios no aparece en ninguna de las dos listas**, porque no es una entrada del menú
lateral: se alcanza desde el menú de la sesión y allí solo existe para Gerencia. Para Operación la
entrada no está en ninguna parte: no se atenúa, no se deshabilita, no existe ([principio 6](#principio-6)).

> **Configuración vuelve a la lista, y esta vez el prototipo la tiene.** Estuvo en esta tabla todo
> el tiempo, pero el mockup la había disuelto: el pro-labore y los sobres se fueron a Inversiones y
> la importación a Movimientos, y la entrada quedó sin inquilinos. Con el [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) tiene dos —el
> respaldo y la auditoría— y el [§4.11](#411-configuración-solo-gerencia) los describe. Así el menú de Gerencia son nueve entradas, las
> nueve de arriba.

---

## 3. Sistema de diseño

### 3.1 Color

El color tiene significado funcional, no decorativo.

| Uso | Color | Dónde |
|---|---|---|
| Marca | Índigo profundo | Encabezados, acciones principales |
| Positivo | Verde | Ingresos, márgenes sanos, metas alcanzadas |
| Negativo | Rojo | Gastos, caja libre negativa, alertas críticas |
| Advertencia | Ámbar | Anticipos pendientes, pedidos estancados, registro tardío |
| Neutro | Gris | Transferencias, información secundaria |
| Anticipo | Morado | Todo lo relacionado con plata que aún no es del negocio |

> **El morado para anticipos es deliberado.** Es la categoría que más se confunde, y darle un
> color propio —ni verde de ingreso ni gris de neutro— ayuda a recordar que es una tercera cosa.

**En el libro de movimientos, Gerencia elige el color de cada tipo entre cuatro de estos: verde,
rojo, morado y gris** ([§4.3](#43-movimientos)). Cambia qué color lleva un tipo, no lo que significa cada color: por eso
no hay un selector libre. Quedan fuera los otros dos:
- el ámbar es de las advertencias, y «Registro tardío» y «Anulado» ya son ámbar en la misma fila;
- el índigo es de la marca y las acciones.

Un tipo de esos colores se leería como un aviso o como un botón.

### 3.2 Tipografía y jerarquía

| Elemento | Tratamiento |
|---|---|
| Cifra principal del dashboard | Muy grande, peso fuerte, tabular |
| Cifras secundarias | Grandes, peso medio |
| Etiquetas | Pequeñas, mayúsculas, gris medio |
| Cuerpo | 16 px mínimo — legible en el taller, con luz de día |

Todas las cifras usan **numeración tabular** para que las columnas se alineen.

### 3.3 Accesibilidad

- Contraste mínimo AA en todo texto.
- Objetivos táctiles de 44×44 px como mínimo.
- El color nunca es el único portador de información: siempre hay ícono o texto.
- Soporte de tema claro y oscuro.

### 3.4 El descriptor de formulario

Un formulario que solo avisa cuando el servidor contesta se siente lento y gasta datos móviles en
cada equivocación. Un formulario que decide por su cuenta vuelve a poner la regla en dos sitios,
que es justo lo que prohíbe el [principio 9](#principio-9). El diseño no escoge entre las dos cosas: **la pantalla
sigue avisando al instante, pero lo que avisa se lo dictaron.**

Junto con cada formulario, la API entrega el **descriptor** de sus campos: etiqueta, tipo, si es
obligatorio, mínimos y máximos, qué teclado conviene abrir, el texto de ayuda y **las palabras
exactas** del aviso cuando una regla no se cumple. El front lee ese descriptor y pinta.

| Lo dicta la API | Lo hace la pantalla |
|---|---|
| Qué campos hay y en qué orden | Los dibuja en ese orden, sin reordenarlos |
| Qué regla aplica a cada campo | La comprueba mientras se escribe, sin ir al servidor |
| Cuál campo es obligatorio | Le pone un asterisco a la etiqueta |
| Qué campos trae el formulario | Los vuelve a pedir cuando una elección los cambia |
| Con qué palabras se avisa | Muestra el texto tal cual, sin redactar nada |
| Qué teclado conviene | Abre el numérico donde va plata, el de texto donde va texto |

**El obligatorio se ve antes de equivocarse.** La etiqueta de un campo obligatorio termina en un
asterisco rojo, y la etiqueta entera se lee «Valor, obligatorio» para quien usa lector de pantalla.
No es una regla nueva: es la que el descriptor ya trae en `obligatorio`, dicha donde se llena y no
cuando el servidor contesta.

**Un campo que no viene al caso no se pinta, y eso también lo decide la API.** Cuando una elección
cambia qué campos aplican —el tipo de un movimiento es el caso—, el front **vuelve a pedir el
formulario con esa elección** y pinta lo que le contesten. No esconde nada por su cuenta: el
descriptor sigue sin saber decir «este campo depende de aquel», que es la regla de dos campos que
el [20 §4.4](20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más) deja fuera a propósito.

> **La pantalla no sabe por qué existe la regla.** No sabe que un gasto tiene que ser mayor que
> cero: sabe que hay una regla llamada `minimo` con valor 1 y un mensaje que mostrar si no se
> cumple. Por eso corregir una palabra o mover un tope no obliga a publicar una versión nueva del
> front, y por eso el aviso que se lee en el celular es siempre el mismo que aplica el servidor.

El aviso inmediato es cortesía, no autoridad: la API vuelve a comprobar todo cuando llega la
petición, siempre. Cubre `RF-102`.

---

## 4. Las 12 pantallas

### 4.0 Acceso

**Pregunta:** *¿quién está entrando?*

Capa a pantalla completa, sin menú y sin topbar: mientras no haya sesión no hay nada más que
ver. Logo, campo **Usuario**, campo **Contraseña** con botón de mostrar u ocultar, y el botón
**Entrar**. El foco arranca en Usuario y Enter envía desde cualquiera de los dos campos.
El detalle de sus decisiones está en [§5](#5-la-sesión-acceso-y-gestión-de-usuarios).

### 4.1 Dashboard

**Pregunta que responde:** *¿cómo va el negocio ahora mismo?*

| Zona | Contenido |
|---|---|
| Encabezado | El botón **Descargar**, única acción de toda la pantalla |
| Superior | Las tres cifras del mes: utilidad causada, movimiento de caja, **caja libre** |
| Explicación | Una línea que concilia las tres: "La diferencia son $2.100.000 en anticipos" |
| Alertas | Solo las activas, con acción sugerida |
| Cuentas | Saldo de efectivo, Nequi, Daviplata, banco |
| Los 4 sobres | Barras con asignado contra usado |
| Gráfico | 12 meses de utilidad y caja superpuestas |
| Pendientes | Pedidos por entregar, y lo que falta por cobrar de ellos |

**Solo consulta.** Aquí no se crea, no se edita y no se anula nada ([principio 8](#principio-8)). Lo único que
hace el botón **Descargar** es sacar en CSV o PDF lo que la pantalla ya muestra: las tres cifras
del mes, los saldos de cuentas al corte, los 12 meses de utilidad y caja, las alertas activas y
los pedidos por entregar. Se elige con casillas qué incluir. Crear cuentas de dinero se hace en
Movimientos ([§4.3](#43-movimientos)).

> **En el prototipo el botón Descargar no descarga.** Al pulsarlo aparece un aviso que dice qué
> archivo se generaría y con qué contenido, y nada más. Prometer una descarga que no ocurre es
> peor que no ofrecerla.

### 4.2 Pedidos

**Pregunta:** *¿qué debo entregar y qué me deben?*

Lista **ordenada por fecha**, con la condición de cada pedido a la vista: sin pagar, pago parcial
(morado), pagado, entregado (verde), cancelado, y estancado 15+ días (ámbar). Filtros por estado,
cliente y rango de fechas. Cada fila muestra valor total, lo pagado y saldo.

#### La lista y sus tres filtros

**El orden no se elige**: llega por fecha, lo más reciente primero, y dos pedidos del mismo día
los desempata el número. Las cifras de cada fila —el total, lo anticipado y el saldo— y **si está
estancado** llegan hechas de la API: la pantalla pinta el ámbar, no cuenta los días.

**El estado que se filtra es uno de los cinco del contrato**, no un grupo. «Por entregar» son tres
a la vez —cotizado, en proceso y entrega parcial—, y decidir cuáles caben ahí sería decidir en la
pantalla lo que dice la API. Por eso el filtro es un desplegable con los cinco y «todos», y no
tres botones.

**La columna Estado dice dos cosas en una sola píldora**, y se leen en este orden:

1. **«Sin entregar»**, en ámbar, si el pedido lleva quince días o más con plata del cliente adentro
   y sin entregarse ([RF-24](03-requisitos-y-bdd.md#rf-24)). Tapa a las demás a propósito: es lo que pide que se mire hoy.
2. **«Entregado»** en verde o **«Cancelado»** si el pedido ya llegó a un final.
3. Y si no, **la condición de pago**: «Sin pagar», «Pago parcial» en morado, o «Pagado».

**El estado y la condición de pago son dos datos distintos**, y por eso la API manda los dos: el
estado dice en qué punto va el trabajo, y la condición de pago, cuánto se ha cobrado. Se enseñan
juntos porque quien mira la lista pregunta una sola cosa —«¿este en qué va?»—, pero mezclarlos en
un solo campo obligaría a inventar estados como «entregado y pagado». **«Pago parcial» reemplazó a
«Anticipo cobrado»**, que decía que había plata pero no cuánto faltaba.

**Y la píldora se toca**: abre la fila del pedido, igual que su número, que es donde están las
acciones. Un estado que se ve y no se puede cambiar manda a buscar dónde se cambia.

**El rango va por la fecha del pedido, y sus dos fechas son independientes**: «de septiembre en
adelante» es una pregunta legítima. Lo único que no se puede pedir es un rango al revés, y
entonces, en lugar de la tabla, va el aviso que manda la API, como en el libro ([§4.3](#43-movimientos)).

Si no queda ninguna fila, la tabla lo dice; y solo habla de filtros cuando hay alguno puesto,
porque sin ellos mandaría a buscar uno que no existe.

#### La factura vive en la fila abierta, y la adjuntan los dos tipos de usuario

**Tocar una fila la abre debajo**, como en el libro ([§4.3](#43-movimientos)): dice de qué pedido y de qué cliente es,
enseña la factura y trae las acciones. La cierran «Cerrar» y Escape.

**Se abre para los dos tipos de usuario**, porque la factura la adjuntan los dos ([RF-27](03-requisitos-y-bdd.md#rf-27)). Esconderla
detrás de un panel de Gerencia sería decidir un permiso en la pantalla ([ADR-018](adr/ADR-018-front-sin-decisiones.md)), y quien lo
impediría de verdad es la base. Modificar, marcar entregado y anular siguen siendo de Gerencia.

**Las tres acciones de la fila**, además de la factura, y **cuáles se ofrecen lo dice la API**, no
la pantalla: viajan con el pedido, como `sePuedeAnular` viaja con el movimiento ([§4.3](#43-movimientos)).

| Acción | Cuándo se ofrece | Qué pregunta |
|---|---|---|
| **Registrar un pago** | Mientras el pedido está en proceso y le falta por cobrar | Valor, medio de pago y fecha. Caben varios, de a partes ([CU-06](02-casos-de-uso.md#cu-06)) |
| **Marcar entregado** | Mientras no esté entregado ni cancelado | La fecha de entrega, y **si queda saldo**, en qué cuenta entra, con el monto a la vista. Si ya estaba pagado, no pregunta cuenta ([CU-07](02-casos-de-uso.md#cu-07)) |
| **Cancelar pedido** | Mientras no esté entregado ni cancelado | El motivo, y si hay plata pagada, qué se hace con ella: devolverla o dejarla como ingreso |

**Entregar es también cobrar lo que falta** ([RF-22](03-requisitos-y-bdd.md#rf-22)): un pedido no se entrega a medio pagar, y si
se intenta, el error llega sobre el campo de la cuenta y se pinta ahí, no en un aviso suelto.

**Entregado y cancelado no ofrecen nada**, porque son finales: la fila abierta de uno de ellos
enseña su factura y nada más.

**Las facturas que ya tiene el pedido llegan con él**, así que verlas no pide otra consulta. Bajar
una sí: el archivo sale de la API y nunca del almacenamiento ([07 §1](07-arquitectura.md#1-stack)), y viaja en base64 dentro del
sobre, igual que el soporte de un movimiento. La foto se agranda al tocarla; del PDF se dice cuál
es, porque abrirlo es del navegador. Un pedido sin factura lo dice.

**La pantalla no juzga el archivo**: ni el peso ni el tipo. El techo de 5 MB y los cuatro tipos que
se admiten los impone la API, y lo que se lee cuando rechaza es su mensaje, tal cual llegó. La clave
de la petición es el id de la factura, así que reintentar sube el mismo archivo y no otro ([ADR-020](adr/ADR-020-idempotencia.md)).

#### Tomar un pedido son tres formularios, y no uno

**El pedido lleva renglones, no un producto suelto** ([RF-19](03-requisitos-y-bdd.md#rf-19), [CU-05](02-casos-de-uso.md#cu-05)). «Qué se entrega» es una
lista: cada renglón es un producto del catálogo y su cantidad, con «+ Agregar renglón» y «Quitar».
El precio es el del catálogo el día en que se pidió, y viaja con el pedido: el catálogo cambia y un
pedido de septiembre sigue valiendo lo que valía.

**Las tres cifras del resumen las da la API** —el valor del pedido, el anticipo al confirmar y el
saldo contra entrega—, y la pantalla las pinta. Se le piden mientras se captura, con los renglones y
el porcentaje, porque multiplicar precio por cantidad en el cliente sería decidir plata
([ADR-018](adr/ADR-018-front-sin-decisiones.md)). Por eso el valor total no viaja en la petición que registra.

**El costo directo que el prototipo dibuja al lado todavía no llega**, y por eso no se pinta: lo
trae el validador de anticipo mínimo (tarea [8.9](08-plan-de-desarrollo.md#tarea-8-9)), que es el que sabe si ese porcentaje alcanza para
pagar el material. Es de Gerencia, así que tampoco puede salir en la misma consulta para todos.

**Al guardar se pregunta por el abono, y ahí empieza otro caso de uso.** Cobrar el anticipo escribe
el movimiento y el pasivo en la misma transacción ([RN-05](03-requisitos-y-bdd.md#rn-05), [CU-06](02-casos-de-uso.md#cu-06)), así que tiene su propio
formulario: el «sí» lleva a él con el pedido ya referenciado por su número, y el «ahora no» cierra.
Meterlo dentro del formulario del pedido dejaría dos escrituras colgando de un solo botón.

**El número del pedido lo pone el sistema**, como `P-0287`, y es único en toda la base: no se
escribe ni se elige.

#### Los clientes viven aquí, y no en una pantalla propia

Un cliente existe para que haya un pedido, así que se administra donde se usa. **No es la pantalla
número doce**: el menú lo dicta la API y sus claves no incluyen ninguna que se llame así, y una
clave que el front no conoce no se pinta.

- **El cliente de un pedido se elige de una lista, no se escribe.** El campo «Cliente» de «Nuevo
  pedido» es un desplegable con los clientes vigentes, ordenados por nombre. Dos maneras de escribir
  el mismo nombre serían dos clientes y ningún historial común.
- **«+ Cliente nuevo…» abre el alta en la misma pantalla**, debajo del campo: nombre, teléfono,
  correo y notas. Solo el nombre es obligatorio, porque en el taller el cliente entra por teléfono
  mientras se toma el pedido y el correo llega después ([CU-05](02-casos-de-uso.md#cu-05)). Al guardar, el cliente recién
  creado queda elegido; nadie sale del pedido a medio tomar.
- **El panel «Clientes del taller»** lista los vigentes con su contacto, sus notas y cuántos pedidos
  tiene cada uno. Crear puede cualquiera de los dos tipos de usuario: sin cliente no hay pedido.
- **Anular es de Gerencia y pide motivo escrito.** Sale del desplegable y del panel, pero no se
  borra ([RN-13](03-requisitos-y-bdd.md#rn-13)): queda con cuándo, quién y por qué, y sus pedidos siguen enteros. Lo pide el mismo
  panel de confirmación en línea que el resto del prototipo, y a Operación el botón no se le
  atúna: no existe ([principio 6](#principio-6)).

  **Quién puede anular lo dice la API, no la pantalla**: la navegación trae `puedeAnularClientes`, y
  el front no lo deduce de su propio tipo, que sería decidir un permiso ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).

  Que a Operación no se le pinte es comodidad, no permiso: quien lo impide de verdad es
  `clientes_actualizacion` en PostgreSQL ([04 §7](04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls)).
- **Un cliente anulado no desaparece de los pedidos que ya lo nombran.** Si se modifica uno de esos
  pedidos, su cliente vuelve al desplegable mientras esa ficha esté abierta, marcado como anulado:
  guardar no puede cambiarle el cliente a un pedido por su cuenta.

### 4.3 Movimientos

**Pregunta:** *¿en qué se fue la plata?*

Registro rápido en un panel que se abre con el botón flotante, y ese botón flota sobre todas las
pantallas menos el Inicio: valor, tipo, categoría, **medio de pago**, fecha (hoy por defecto),
foto. El Inicio queda fuera porque no escribe ([principio 8](#principio-8)). Debajo va **el libro**: la lista con
filtros, la marca de registro tardío y la acción de anular con motivo obligatorio.

**El medio de pago es un solo campo.** Quien registra elige de dónde entró o salió la plata y no
ve nada más: el campo se llama «Medio de pago» y las opciones son las cuentas del taller. El
segundo campo, «A qué medio de pago llega», aparece **solo cuando el tipo es transferencia**, que
es el único movimiento que toca dos bolsillos: al cambiar el tipo el front vuelve a pedir el
formulario y pinta lo que le contesten ([§3.4](#34-el-descriptor-de-formulario)). En un gasto no
aparece, así que ya no se puede llenar para que después le digan que sobraba.

**El libro.** Una tabla por mes, con lo más reciente primero, ordenada por la fecha en que ocurrió
cada movimiento y no por la de digitación ([RN-01](03-requisitos-y-bdd.md#rn-01)). De arriba abajo:

| Zona | Contenido |
|---|---|
| Encabezado | `‹ Septiembre 2026 ›`: las flechas cambian de mes, y la de adelante no pasa del mes en curso. Al lado, **Otro rango**, que abre «Desde» y «Hasta» con el mes ya puesto y un botón «Volver al mes» |
| Filtros | **Todos · Ingresos · Gastos**, la categoría, la cuenta —solo con los nombres, sin saldos— y, para Gerencia, el interruptor **Ver anulados** |
| Tabla | Fecha, concepto, categoría, cuenta, valor, tipo y la marca de registro tardío. El valor lleva el signo de lo que el movimiento le hace a la caja y el color de su tipo. Una transferencia dice «Nequi → Bancolombia», va sin signo y sale al filtrar por cualquiera de sus dos cuentas |
| Pie | **Por página: 10 · 25 · 50** y «‹ Anterior · 1–10 de 14 · Siguiente ›» |

Si no queda ninguna fila, la tabla lo dice con el período: «No hay movimientos en julio de 2026.»
Si hay algún filtro puesto, agrega «con estos filtros», y nunca lo dice sin filtros: mandaría a
buscar uno que no existe.

Un rango que no se puede pedir no deja la tabla en blanco. Si le falta una fecha o está al revés,
en lugar de la tabla va el aviso, en rojo, como se pinta una lectura que la API rechaza.

**La fila abierta.** Tocar una fila la abre debajo, como en Pedidos. Dice quién registró el
movimiento, cuándo se digitó y con qué registro va —el pedido de un anticipo, el activo de una
inversión—, y enseña el soporte: la foto del recibo, que se agranda al tocarla, o el PDF. Para
Gerencia trae además **Anular movimiento**. La cierran «Cerrar» y Escape.

**Anular.** Pide el motivo antes de confirmar, en un panel debajo de la fila. El panel dice que el
movimiento sale de todas las cifras sin borrarse y que, si lo que está mal es el valor, se corrige
con un contra-asiento. Si el movimiento va junto con otro registro —el anticipo de un pedido, un
activo, un aporte, un retiro o un adelanto—, dice también que ese registro se anula con él, en la
misma transacción. Una vez anulado, el movimiento sale del libro y se ve con **Ver anulados**.

**Ver anulados.** Con el interruptor puesto el panel cambia de aspecto —borde ámbar y, encima de
la tabla, «Estás viendo también los anulados · no suman en ninguna cifra»—, para que ese modo
nunca se confunda con el libro de siempre ([04 §5.5](04-modelo-de-datos.md#55-vistas-limpias-por-defecto)). Los anulados salen en su fecha, apagados,
con el valor tachado, la marca «Anulado» y debajo el motivo, quién y cuándo. El mes y los
filtros valen igual.

**Lo que dicta la API.** El libro no decide nada ([principio 9](#principio-9)):

| Lo dicta la API | Lo hace la pantalla |
|---|---|
| El nombre, el color y el signo de cada tipo, y si cuenta en «Ingresos», en «Gastos» o en ninguno | Pinta la píldora y el valor tal como llegan |
| El mes en curso, que es el de Bogotá | Apaga la flecha de adelante ahí |
| Cuántos movimientos caben por página como máximo: lo lee de una variable de entorno, y son 50 si no está | Ofrece 10, 25 y 50 sin pasar del máximo, y arranca en el máximo |
| Que un rango sin una de sus fechas, o al revés, no se puede pedir, y con qué palabras | Pinta el aviso donde iría la tabla |
| Si quien mira puede anular y ver los anulados | Pinta el botón y el interruptor solo si se lo dicen |
| Con qué registro va cada movimiento, y el aviso de que se anula con él | Los muestra en la fila abierta y en el panel de anular |
| La foto o el PDF, en base64 dentro del sobre | Los enseña |

| Decisión | Por qué |
|---|---|
| El libro va por meses, con flechas | El negocio razona por meses: el reporte y el cierre son mensuales. «Otro rango» cubre lo demás sin volver pesado lo de todos los días |
| «Ingresos» y «Gastos» son un filtro del libro, no una cifra | Que Gerencia ponga el anticipo en «Ingresos» cambia en qué filtro sale, no lo que es: sigue siendo un pasivo ([RN-05](03-requisitos-y-bdd.md#rn-05)), y las tres cifras siguen el [05 §2](05-reglas-financieras.md#2-naturaleza-de-cada-movimiento) |
| El signo es el de la caja | Dice si la plata entró a las cuentas o salió. Con el de la utilidad, el anticipo —que es lo que más se confunde— se quedaría sin signo |
| «Ver anulados» es un interruptor y no un filtro más | Cambia qué libro se lee, no cuánto de él. Por eso cambia también el aspecto del panel |
| Lo anulado se apaga con color y no con transparencia | Con transparencia el motivo quedaba por debajo del contraste AA ([§3.3](#33-accesibilidad)) |
| «Anular» vive en la fila abierta y no en un botón al final de cada fila | En el celular la última columna queda fuera de la vista hasta desplazar la tabla. La fila abierta se ve entera |
| Anular un movimiento anula también su registro hermano | Anular solo el movimiento dejaría el anticipo, el activo o el adelanto contando una plata que ya no suma |

Aloja además el panel **«Cuentas de dinero»**, exclusivo de Gerencia, que es donde se crean las
cuentas: efectivo, Nequi, Daviplata, banco. Vive aquí y no en el Inicio porque una cuenta es el
recipiente de un movimiento: quien crea una cuenta está pensando dónde va a registrar la plata, y
esta pantalla ya es esa. El `<select>` de cuenta del registro rápido debe mostrar solo nombres,
sin saldos, para que Operación pueda elegir una cuenta sin ver la caja.

**Cómo se ve cada tipo.** Es un bloque del panel «Cuentas de dinero», así que solo lo ve
Gerencia. Lista los nueve tipos, y de cada uno dice:
- el nombre que se lee en el libro, el color de su píldora y el grupo del filtro en que cuenta,
  que es lo que Gerencia cambia;
- lo que le hace a la utilidad, a la caja y al patrimonio, en tres columnas: «▲ sube», «▼ baja»,
  «↔ neutra» o «—».

Esas tres columnas **no se configuran**: las fija el [05 §2](05-reglas-financieras.md#2-naturaleza-de-cada-movimiento), y de la caja sale el signo del valor.
Están a la vista para que quien cambia cómo se lee un tipo vea, en el mismo renglón, lo que ese
cambio no toca. **Editar** abre debajo un panel con una píldora de muestra, para verla antes de
guardarla. Los colores son los cuatro que el [§3.1](#31-color) deja para un tipo. Cada «Editar» dice, para un
lector de pantalla, de qué tipo es: «Editar cómo se lee «Retiro · pro-labore»» ([§3.3](#33-accesibilidad)).

Arranca con lo que el libro ya pintaba:
- «Ingreso» en verde;
- «Gasto» en rojo, también el pro-labore, que es gasto;
- «Anticipo · pasivo» en morado;
- «No afecta utilidad» en gris para la distribución y el adelanto;
- la transferencia, la inversión y el aporte en gris, con su nombre.

> **En el prototipo, anular solo cambia el libro, y el PDF no se abre.** Las cifras de las otras
> pantallas son de ejemplo y no se recalculan. En el sistema real, la API saca el movimiento de
> las tres cifras y anula el registro hermano en la misma transacción.

#### El histórico se importa aquí, y tampoco en una «Configuración»

Lo que trae el Excel de antes son movimientos, y este es su libro. Es el caso del pro-labore y de
los sobres ([§4.5](#45-inversiones-y-retiros)): el menú no tiene clave para «Configuración», y dársela sería un cambio de contrato.
El panel **«Importar el histórico»** va debajo de «Cuentas de dinero», y existe con el mismo permiso
que ella. Son tres pasos en el mismo panel ([RF-64](03-requisitos-y-bdd.md#rf-64), [RF-65](03-requisitos-y-bdd.md#rf-65), [CU-21](02-casos-de-uso.md#cu-21)):

1. **Elegir el archivo.** «Elegir archivo CSV» y, al lado, su nombre. Elegirlo ya lo manda, sin
   mapeo, y la API contesta qué columnas trae y cuáles necesita ([BDD-21-1](03-requisitos-y-bdd.md#bdd-21-1)).
2. **Relacionar las columnas.** Una fila por cada columna que Emprende necesita, con su etiqueta y un
   `<select>` con las del archivo; las obligatorias lo dicen. Ninguna viene elegida: adivinar por el
   nombre sería decidir qué significa la columna de otro. Si falta una obligatoria, el aviso del
   `42270` va debajo, en rojo.
3. **Revisar y cargar.** Cuatro cifras —filas en el archivo, cuántas entran, cuántas no y cuántas ya
   existían— y la tabla de todas las filas, no solo las malas ([BDD-21-2](03-requisitos-y-bdd.md#bdd-21-2)): el número de la línea,
   «Entra», «No entra» o «Ya existe», y el motivo con su columna. **«Cargar N movimientos»**
   confirma, y la tabla pasa a decir «Cargada» en lo que entró.

**Las que ya existen no entran sin pedirlo** ([BDD-21-3](03-requisitos-y-bdd.md#bdd-21-3)). Si hay alguna, aparece el interruptor
«Cargar también las que ya existen», y el botón cuenta con él. Sin el interruptor, la API respondería
`40970` y no escribiría nada.

| Lo dicta la API | Lo hace la pantalla |
|---|---|
| Qué columnas necesita, cómo se llaman y cuáles son obligatorias | Pinta una fila por cada una |
| Las columnas que trae el archivo | Las ofrece en cada `<select>` |
| Qué pasa con cada fila, en qué columna está el problema y con qué palabras | Pinta la píldora y el motivo |
| Cuántas entran, cuántas no, cuántas ya existían y cuántas se escribieron | Pinta las cuatro cifras |
| Que falta una columna obligatoria, que el archivo pasa de 5 MB o que no es un CSV | Pinta el aviso |

> **En el prototipo no se lee ningún archivo.** «Elegir archivo CSV» hace como si hubiera llegado
> uno de ejemplo con ocho filas, y lo que pasa con cada una está escrito a mano.

### 4.4 Productos y servicios

**Pregunta:** *¿qué me deja más plata?*

Tabla ordenable con costo, precio, **margen en pesos** y margen porcentual. Ordenar por margen en
pesos es la vista por defecto, porque es lo que de verdad entra a la caja por unidad
([05 §7.2](05-reglas-financieras.md#72-los-dos-márgenes)).

**La pantalla no pide tiempo y no lo muestra.** Ni minutos de trabajo ni minutos de máquina: el
formulario pide el insumo, los consumibles y **el costo de mano de obra en pesos**, que es lo que
una unidad cuesta de trabajo. Quien conoce el taller sabe esa cifra; los minutos eran un dato que
había que cronometrar para llegar a ella.

**El rol Operación ve la tabla sin las columnas de costo ni margen.**

### 4.5 Inversiones y retiros

**Pregunta:** *¿cuánto he construido y cuánto he sacado?*

Tres bloques: activos del negocio, aportes de capital, y retiros **separados en pro-labore y
distribución**. Al pie, el patrimonio calculado y la alerta de descapitalización si aplica.

#### El pro-labore se define aquí, y no en una pantalla «Configuración»

El retiro se parte con el pro-labore vigente en su fecha, así que el pro-labore vive donde se parte
el retiro. **No es una pantalla de configuración**: el menú lo dicta la API, sus claves no incluyen
ninguna que se llame así, y una clave que el front no conoce no se pinta. Toda la pantalla es de
Gerencia.

- **El panel «El pro-labore» pinta lo que rige hoy**: el valor mensual, las horas productivas del
  mes, desde cuándo rige y con qué se justificó. **El costeo ya no toma nada de aquí**: desde el
  2026-10-06 la mano de obra de un producto se escribe en pesos ([05 §7.1](05-reglas-financieras.md#71-costo-unitario)).
- **Sin pro-labore definido, el panel lo dice y explica lo que eso bloquea**: el simulador de
  capacidad de pago no arranca ([RN-08](03-requisitos-y-bdd.md#rn-08)).
- **«Definir pro-labore» abre el formulario en la misma pantalla**, con tres campos: el valor mensual,
  las horas productivas y la justificación. El valor y la justificación son obligatorios; las horas
  llevan dos decimales como máximo. La ayuda de la justificación es la pregunta del [05 §6.3](05-reglas-financieras.md#63-el-pro-labore--la-trampa-del-trabajo-invisible-rn-08): cuánto
  habría que pagarle a alguien para que hiciera ese trabajo.
- **Guardar no edita la definición anterior**: la nueva rige desde hoy y la anterior queda en el
  historial, que no se pinta. Los costeos ya guardados conservan su tarifa, y un retiro se sigue
  partiendo con el pro-labore de su fecha.

#### El límite de horas de una semana va debajo, porque es el techo de esas horas

Unas horas imposibles no dan un error: dan una tarifa barata, y con ella un costeo que parece sano
([RN-20](03-requisitos-y-bdd.md#rn-20), [05 §6.5](05-reglas-financieras.md#65-el-límite-de-horas-de-una-semana-rn-20)). El límite es lo que lo evita, y lo define Gerencia en el panel «El límite de
horas de una semana», justo debajo del pro-labore.

- **El panel pinta las horas de una semana y el máximo del mes que sale de ellas.** El máximo lo
  calcula la API, con 52 entre 12, porque el front no calcula cifras.
- **Mientras no haya ninguno definido, el panel dice que rige el que trae la aplicación**, y que se
  puede cambiar. No dice que no haya límite, porque sí lo hay: la API manda el valor por omisión de
  su ambiente, y la consulta lo marca.
- **«Definir límite» abre el formulario en la misma pantalla**, con dos campos: las horas de una
  semana y la justificación. Las dos son obligatorias, el límite va de 1 a 168 horas y las horas
  llevan dos decimales como máximo.
- **Guardar no edita la definición anterior**, como en el pro-labore. Y **no toca lo que ya está
  guardado**: un límite más bajo no invalida un pro-labore anterior, y la próxima definición sí
  tiene que caber.

#### Un equipo se registra aquí, y se da de baja en el libro

Comprar una prensa no es un gasto: cambia plata por un bien, así que baja la caja y no toca ni la
utilidad ni el patrimonio ([RN-04](03-requisitos-y-bdd.md#rn-04), [BDD-15-1](03-requisitos-y-bdd.md#bdd-15-1)). Por eso los activos viven en esta pantalla y no entre
los gastos, y por eso el panel lleva su cintillo: «Una inversión no reduce la utilidad».

- **El panel «Activos del negocio» pinta cuatro columnas**: qué se compró, cuándo, cuánto costó y en
  qué está. **El orden lo da la API**, del equipo más caro al más barato, y la pantalla no reordena
  ni filtra ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).
- **«En uso» lo escribe la pantalla.** El contrato manda el estado como `en_uso`, y para los activos
  no hay tabla de presentación como la de los tipos de movimiento, así que la traducción es del
  front —como el «GER» y el «OPE» de la tabla de personas—. Un estado que no conozca lo pinta como
  llegó.
- **Sin ningún activo el panel lo dice con una frase**, porque una tabla de cero filas no se
  distingue de una que no cargó.
- **«+ Registrar inversión» abre el formulario en la misma pantalla**, con cuatro campos: el nombre,
  el valor de compra, la cuenta y la fecha. El nombre y el valor son obligatorios; **la cuenta es
  opcional**, y así entran los equipos que el taller ya tenía el día del corte ([09 §4.1](09-plan-de-implantacion.md#41-qué-se-migra-y-qué-no)), que no
  mueven ningún saldo porque no escriben movimiento. Sin fecha, la compra es de hoy en Bogotá
  ([RNF-08](03-requisitos-y-bdd.md#rnf-08)).
- **De dónde salió la plata no se pinta**, porque no llega: el contrato devuelve cinco claves y
  ninguna es la cuenta. Un equipo comprado con cuenta y uno que ya estaba el día del corte se ven
  igual en la tabla, y la plata que salió se ve en el libro, en su movimiento de inversión.
- **Guardar vuelve a pedir la lista**: lo que se pinta es lo que quedó en la base y no lo que se
  escribió. Lo que la API rechace —la fecha de mañana, la cuenta que no sirve— se lee con su mensaje
  debajo del campo que corresponda, y lo escrito no se pierde.
- **La tabla no lleva acciones, porque aquí no se anula un activo**: el contrato no declara la
  operación. El que se compró con cuenta se da de baja anulando su movimiento de inversión en el
  libro, que se lleva la fila del activo; el que entró sin cuenta no tiene movimiento, así que hoy
  no hay por dónde.
- **Toda la pantalla es de Gerencia, y lo impone la base**: a Operación `activos_solo_gerencia` le
  filtra las filas al leer —le llega la lista vacía, no un error— y le rechaza la compra ([P-20](12-pruebas-y-calidad.md#p-20)).

#### Un aporte de capital se registra aquí, y su historial vive en el libro

Un aporte es plata que entra desde afuera: **sube la caja y el patrimonio, y no toca la utilidad**
([05 §2](05-reglas-financieras.md#2-naturaleza-de-cada-movimiento)), porque no la generó el negocio. Por eso el panel lleva su cintillo:
«Sube la caja y el patrimonio · no es utilidad».

- **«+ Registrar aporte» abre el formulario en la misma pantalla**, con cuatro campos: el valor, la
  cuenta, la fecha y una nota. El valor y **la cuenta son obligatorios**, al contrario que en la
  compra de un equipo: todo aporte es un movimiento, porque `aportes_retiros.movimiento_id` no
  admite nulo ([04 §4.6](04-modelo-de-datos.md#46-inversiones-capital-y-pro-labore)). Sin fecha, el aporte es de hoy en Bogotá ([RNF-08](03-requisitos-y-bdd.md#rnf-08)).
- **La nota es opcional, y es para acordarse de dónde salió la plata**: un préstamo de la familia,
  la venta de algo propio. Si no se escribe, no viaja.
- **El panel no lleva tabla, porque el contrato no declara ninguna consulta de aportes.** Lo
  aportado se ve en el libro, cada uno en su movimiento, y lo acumulado en el patrimonio, que es una
  de sus tres cifras. Armar la lista pidiendo el libro filtrado por tipo sería consultar de más y
  decidir qué página del libro le toca a esta pantalla ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).
- **Lo que sí se pinta es el aporte que la API acaba de devolver**: cuánto, cuándo y la nota, como
  quedaron en la base y no como se escribieron. **La cuenta no se pinta**, porque del sobre llega su
  id, y traducirlo a un nombre no le toca a este panel: el nombre lo manda la API en el libro.
- **Lo que la API rechace se lee debajo de su campo, y lo escrito no se pierde.** La fecha posterior
  a hoy y la cuenta que no sirve no caben en el descriptor y llegan con su código, como en la compra
  de un equipo.
- **Toda la pantalla es de Gerencia, y lo impone la base**: `ret_solo_gerencia` no deja escribir
  `aportes_retiros`, así que el rechazo no lo decide la pantalla.

#### Los cuatro sobres se configuran aquí, y tampoco en una «Configuración»

El reparto manda sobre cada peso que entra en efectivo ([05 §11](05-reglas-financieras.md#11-la-regla-de-los-4-sobres)), así que vive donde se mira
la plata del negocio. Es el mismo caso del pro-labore, y por la misma razón: el menú lo dicta la API
y no tiene clave para «Configuración», así que dársela sería un cambio de contrato. Ponerlo aquí no
lo es.

- **El panel «Los 4 sobres» pinta el reparto que rige**: la barra de cuatro tramos y, debajo, los
  cuatro con su color y su porcentaje —costo directo, gastos fijos, reserva y retiro—, y desde cuándo
  rige. **Los colores son los de la tarjeta del Inicio**, para que el reparto configurado y lo
  asignado contra lo usado ([7.8](08-plan-de-desarrollo.md#tarea-7-8)) se lean como lo mismo. La API manda cuatro claves sueltas y
  ninguna presentación, así que la traducción a color es del front, como la píldora «En uso» de los
  activos.
- **El historial no se pinta.** El [RF-51](03-requisitos-y-bdd.md#rf-51) pide conservarlo, no mostrarlo, y el contrato no declara
  ninguna consulta que lo devuelva. Lo que se pinta es desde cuándo rige lo que rige.
- **Sin reparto configurado, el panel lo dice**: cada peso que entra se queda sin destino, y no hay
  con qué decir cuánto va al próximo pedido, cuánto a los gastos fijos, cuánto a la reserva y cuánto
  a la propiedad.
- **«Configurar los sobres» abre el formulario en la misma pantalla**, con los cuatro porcentajes en
  puntos enteros. Los cuatro son obligatorios y cada uno va de 0 a 100, que es lo que el descriptor
  sabe decir.
- **Que los cuatro sumen 100 no lo comprueba la pantalla.** Es una regla entre cuatro campos, que no
  cabe en el descriptor ([20 §4.4](20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)): la impone `suma_cien` y llega como el `42293`, con su aviso debajo
  del último sobre. Sumarlos aquí sería escribir una regla de negocio en el front ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).
- **Guardar no edita el reparto anterior**: el nuevo rige desde hoy y el anterior queda en el
  historial. El panel vuelve a pedir lo vigente en vez de dar por hecho lo que escribió.
- **Toda la pantalla es de Gerencia, y lo impone la base**: a Operación `sobres_solo_gerencia` le
  deja la consulta vacía —no con error— y le rechaza configurar ([P-07](12-pruebas-y-calidad.md#p-07), [P-22](12-pruebas-y-calidad.md#p-22)).

### 4.6 Reportes

**Pregunta:** *¿cómo va el año?*

Tabla mes a mes con ingresos, costos, gastos, utilidad y margen. Promedio de ganancias,
proyección anual y punto de equilibrio. Exportación de la vista.

### 4.7 Nómina *(solo Gerencia)*

**Pregunta:** *¿puedo pagarle a alguien y cuánto?*

Arriba, el **simulador**: controles de reserva y salario tentativo que recalculan en vivo, con
veredicto explícito y traducción a unidades de producto por vender. Abajo, la liquidación
mensual con adelantos descontados y el desprendible en PDF.

#### El registro de empleadas va antes de la liquidación, porque sin ficha no hay a quién liquidar

La ficha de una empleada no es un usuario: se puede estar en nómina sin entrar al sistema, y entrar
sin estar en nómina ([04 §4.2](04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas)). El panel «Las empleadas» da de alta, edita, retira y anula, y
vive debajo del simulador porque la pregunta de la pantalla sigue siendo si se puede pagar
([RF-54](03-requisitos-y-bdd.md#rf-54), [CU-19](02-casos-de-uso.md#cu-19)).

- **La tabla pinta el salario acordado y, debajo de las horas, el valor de la hora ordinaria**, que
  es con lo que se pagan las extra ([06 §6.1](06-nomina-y-capacidad-de-pago.md#61-fórmulas)). La cuenta la hace la API, porque el front no calcula
  cifras.
- **«+ Registrar empleada» abre el formulario en la misma pantalla**, con el nombre, la cédula, la
  fecha de ingreso, el salario acordado, las horas pactadas del mes y el usuario con que entra. El
  nombre, la fecha y el salario son obligatorios; la cédula es opcional, y el usuario también: la
  primera opción del desplegable dice «no entra al sistema».
- **El desplegable solo ofrece usuarios activos sin ficha.** Dos fichas colgadas del mismo usuario le
  enseñarían el desprendible a quien no es, y por eso la columna es única: la pantalla no provoca ese
  error, y de todos modos lo rechaza la base.
- **Las horas pactadas no pasan del máximo del mes**, el que sale del límite de horas que define
  Gerencia en Capital ([RN-20](03-requisitos-y-bdd.md#rn-20)). El formulario dice cuál es el máximo y de qué límite viene, antes de
  que la persona escriba.
- **Editar no pide la fecha de ingreso**, porque moverla cambiaría de mes liquidaciones ya hechas. El
  aumento se escribe encima, y el aviso dice que lo ya liquidado conserva su salario.
- **Retirar y anular no son lo mismo, y el formulario lo dice en el título.** El retiro la saca de
  las liquidaciones de los meses siguientes y le deja su historia, con su fecha, que no puede ser
  anterior al ingreso. La anulación dice que la ficha nunca debió existir, y pide motivo escrito
  ([RN-13](03-requisitos-y-bdd.md#rn-13)). Una ficha anulada no se edita ni se retira: lo que queda es su motivo, a la vista.
- **Las retiradas y las anuladas no se pintan de entrada**, y dos casillas las traen, cada grupo bajo
  su separador. Nada se borra: lo que sale de la nómina sigue ahí.

### 4.8 Cotizador

**Pregunta:** *¿qué le cobro y cuánto anticipo le pido?*

Selección de productos y cantidades, vista previa del PDF con logo, y el **validador de
anticipo mínimo** que advierte cuando el 50% no cubre el costo directo.

### 4.9 Gestión de usuarios *(solo Gerencia)*

**Pregunta:** *¿quién entra al sistema y qué hace cada quien?*

Tres bloques en una sola pantalla: la **tabla de personas con acceso** —activas y desactivadas
juntas— arriba, la **bitácora de cambios** en medio y el **catálogo de cargos** abajo. Se
administran juntos porque no se puede crear a alguien sin el cargo que le toca, y porque cada
cambio del primer bloque queda explicado en el segundo. Es la única pantalla que no se abre
desde el menú lateral sino desde el menú de la sesión. El detalle de sus decisiones está en [§5](#5-la-sesión-acceso-y-gestión-de-usuarios).

### 4.10 Versión incompatible

**Pregunta:** *¿por qué no puedo entrar?*

Capa a pantalla completa, como la de Acceso. Aparece cuando el front arranca y descubre que la
versión mayor que necesita no coincide con la que ofrece la API (`RF-101`). Muestra el logo, el
título **«Esta versión ya no sirve con el servidor»**, una explicación sin jerga, **tres filas** —la
versión que se tiene, el servidor que esta versión espera y el servidor que hay— y un único botón,
**Reintentar**.

Tres decisiones que merecen su razón:

| Decisión | Por qué |
|---|---|
| **Se muestran las versiones** | Es lo primero que pregunta quien atiende el reporte. Sin ellas, la llamada empieza con «no me deja entrar» y hay que ir a buscarlas al dispositivo de la persona |
| **Son tres filas y no dos** | El front y la API son dos SemVer independientes ([ADR-014](adr/ADR-014-semver.md)), y pueden coincidir en el número —0.1.0 y 0.1.0— sobre una pantalla que dice que no se entienden. Las dos últimas comparan lo mismo con lo mismo: el servidor que esta versión espera contra el que contestó. Y no se escribe «el servidor necesita tal versión» porque **la API no publica qué versión de aplicación necesita**: es la aplicación la que declara qué servidor espera ([19 §4.3](19-ambientes-y-entrega.md#43-el-contrato-de-compatibilidad)) |
| **No hay forma de continuar** | Es el punto entero de la pantalla. Dejar seguir con un contrato roto no evita el fallo: lo aplaza hasta un campo nulo en la pantalla 7, donde ya nadie lo relaciona con la versión. Fallar ruidoso al arrancar es más barato que fallar tarde |

El texto no dice «versión mayor incompatible» ni menciona la API: dice que la aplicación y el
servidor no se entienden y que casi siempre se arregla actualizando. Quien la lee está en un
taller, no en una consola.

### 4.11 Configuración *(solo Gerencia)*

**Pregunta:** *¿me puedo llevar todo, y quién hizo qué?*

La entrada vuelve al menú lateral de Gerencia, donde el [§2](#2-mapa-de-navegación) ya la dibujaba y el [§2.1](#21-navegación-por-rol) ya la listaba.
Se había disuelto porque sus tres inquilinos de entonces —el pro-labore, los sobres y la
importación— encontraron mejor casa dentro de Inversiones y de Movimientos. Estos dos no la tienen,
y el [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) los puso en el [Sprint 8](08-plan-de-desarrollo.md#sprint-8).

Son dos paneles, y nada más. Para Operación la entrada **no existe**: ni atenuada ni deshabilitada
([principio 6](#principio-6)), y la vista previa la hace desaparecer igual.

**Panel «Exportar respaldo»** ([CU-22](02-casos-de-uso.md#cu-22), tarea [8.17](08-plan-de-desarrollo.md#tarea-8-17))

Arriba, lo que se pide: **alcance** —toda la base, un mes, un rango de fechas o una sola tabla— y
**formato** —ZIP con un CSV por tabla, Excel o JSON—. El botón dice **Generar respaldo**, no
«Descargar»: lo que hace es armar el archivo, y bajarlo es el paso siguiente.

Abajo, la tabla de los **últimos doce**, que es lo que la retención del
[13 §5](13-respaldo-y-exportacion.md#5-generación-y-descarga) guarda: cuándo se generó, su alcance, su formato, su tamaño, cuántos registros trae y
**si ya se bajó o todavía no**. Esa última columna es la que distingue un respaldo generado de uno
que de verdad salió del sistema, y por eso se enseña.

| Decisión | Por qué |
|---|---|
| **Generar y bajar son dos acciones** | El archivo se arma en el servidor y queda disponible; bajarlo es una decisión aparte, de un momento concreto, y es la que queda registrada ([13 §5](13-respaldo-y-exportacion.md#5-generación-y-descarga)) |
| **La columna «¿se bajó?» está a la vista** | Un respaldo que nadie bajó no protege de nada: sigue dentro del sistema del que se quería independizar |
| **El manifiesto no se enseña, se baja con el archivo** | Son hashes y totales de control: no son para leer en pantalla, son para comprobar el archivo cuando haga falta |
| **La programación vive aquí y no en otra pantalla** | Es la misma decisión —cada cuánto sale información del sistema— y separarla invita a configurarla y olvidarla |

**Panel «Auditoría»** ([CU-23](02-casos-de-uso.md#cu-23), tarea [8.19](08-plan-de-desarrollo.md#tarea-8-19))

La tabla de toda la auditoría, lo más reciente primero, con cuatro filtros: **fecha**, **persona**,
**qué se tocó** y **qué pasó**. Cada fila dice cuándo, quién, qué pasó, **sobre qué**, desde qué
dispositivo, desde qué IP y el **detalle** de lo que cambió.

**«Qué pasó» son tres clases, no diecinueve acciones**: accesos, cambios sobre usuarios y cargos, y
cambios sobre el resto del libro. A cuál pertenece una entrada lo decide la API por su acción y su
tabla, y no es una columna que alguien escriba. «Qué se tocó» son las tablas que llevan trigger de
auditoría. Las dos listas, con las etiquetas de cada opción, las dicta el formulario
`filtro-de-auditoria`, así que la pantalla no escribe ninguna.

**«Sobre qué» y «Detalle» llegan redactados del servidor**, decidido el 2026-10-18. No se lee un
JSON de antes y después, sino «Nombre completo: Marcela Rivera → Marcela Rivera Ospina», con el
nombre de la tabla y el de la columna en palabras. Los dos mapas siguen viajando en la respuesta
para quien revise a fondo, pero la pantalla no los interpreta: redactar es una decisión, y las
decisiones son de la API ([ADR-018](adr/ADR-018-front-sin-decisiones.md)).

Trae lo que la «Bitácora de cambios» del [§5.5](#55-bitácora-de-cambios) no trae: **los inicios de sesión, los cierres y los
intentos fallidos**, y los cambios sobre el resto de las tablas. De un intento fallido se ve el
usuario tecleado, la fecha, el dispositivo y la IP, y **nunca la contraseña**, ni completa ni parcial
([RNF-18](03-requisitos-y-bdd.md#rnf-18)).

> **Nada de esta pantalla se edita, y no lleva ni un botón que lo insinúe.** La auditoría la escriben
> triggers ([ADR-005](adr/ADR-005-auditoria-por-triggers.md)) y ninguna de sus filas se toca ([ADR-004](adr/ADR-004-base-solo-escritura.md)). Revertir un cambio no se hace
> desde aquí: se hace desde la bitácora de Gestión de usuarios, que es donde está el contexto para
> entender qué se va a deshacer ([CU-35](02-casos-de-uso.md#cu-35)).

---

## 5. La sesión: acceso y gestión de usuarios

Las dos pantallas nuevas son las que más decisiones de diseño cargan, porque tocan algo que
antes no existía en el producto: la sesión. Antes el modo se cambiaba con un interruptor que
veía cualquiera; ahora lo determina quién inició sesión. Con ellas entran dos piezas más: la
pantalla de cambio obligatorio de contraseña y el bloque de identidad del topbar.

### 5.1 Acceso

Lo que se ve, en orden: logo, **Usuario**, **Contraseña**, **Entrar**. Nada más. No hay campo
de correo —se entra con nombre de usuario— y no hay enlace de recuperación.

| Decisión | Por qué |
|---|---|
| El error es siempre el mismo: **«Usuario o contraseña incorrectos»** | Un mensaje que distinga «ese usuario no existe» de «la clave está mal» le entrega a un desconocido la lista de quién trabaja aquí, un nombre a la vez. El mensaje genérico cuesta un segundo de duda y cierra esa puerta |
| El usuario desactivado **sí** recibe un mensaje propio: **«Este usuario está desactivado. Habla con Gerencia.»** | Para alguien que ya trabajó en el taller eso no es un secreto: sabe que existía y sabe que se fue. Y es lo único que evita que siga intentando, creyendo que olvidó la clave |
| No hay «olvidé mi contraseña» | No hay correo real a donde mandar nada. La clave la restablece Gerencia en persona; decirlo en la pantalla ahorra la búsqueda del enlace que no existe |
| El campo Usuario no autocapitaliza ni autocorrige | En el celular, `Marcela` con mayúscula inicial sería el primer intento fallido de todas |
| Enter envía desde los dos campos y el foco arranca en Usuario | Se entra sin soltar el teclado ni mover el pulgar. [RNF-19](03-requisitos-y-bdd.md#rnf-19) pide menos de 10 segundos con una sola mano |

**Cuando los campos no llegan.** Los campos los dicta la API ([RF-102](03-requisitos-y-bdd.md#rf-102)),
así que hay dos formas de quedarse sin ellos. La pantalla **las distingue**, porque no se arreglan
igual y porque un aviso equivocado manda a buscar el fallo al sitio equivocado:

| Lo que pasó | Lo que se lee |
|---|---|
| No se pudo hablar con el servidor: sin conexión, servidor caído o tiempo agotado | «No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.» |
| El servidor respondió, y aun así no hay formulario que pintar | «No se pudo cargar el formulario. Intenta de nuevo en un momento.» |

En los dos casos la tarjeta queda **sin campos** y con un botón **Reintentar** debajo del aviso, que
vuelve a pedir el formulario sin recargar la página. Sin ese botón el primer texto promete un
reintento que no se puede hacer.

Son de los poquísimos textos que **escribe el front**, igual que los de [§4.10](#410-versión-incompatible)
y por la misma razón: se muestran justo cuando no hay servidor que los dicte. Ninguno habla de una
regla de negocio, así que [RNF-28](03-requisitos-y-bdd.md#rnf-28) sigue en pie.

**Vista previa · entra con un clic.** Debajo del formulario hay un botón por cada usuario de
ejemplo que rellena y envía. Existe **solo en el mockup**, y por dos razones. La primera es que
reemplaza lo único útil que tenía el interruptor de rol: mostrarle el sistema a alguien sin
pedirle que memorice claves. La segunda es que en el sistema real no habría nada que rellenar,
porque la contraseña no vive en la pantalla. Va marcado como vista previa para que nadie lo
confunda con una función del producto.

> **El mockup no es seguridad.** Valida las contraseñas en el navegador, contra un arreglo en
> JavaScript que cualquiera puede leer. En el sistema real la verificación ocurre en el
> servidor y los permisos los aplica la base de datos.

### 5.2 Crea tu contraseña

Si la persona entra con una clave temporal, en lugar del Dashboard aparece esta pantalla:
contraseña nueva, repetirla, mínimo 8 caracteres, **Guardar y entrar**. No se puede saltar; la
única salida es cerrar sesión. Una clave temporal que Gerencia dictó en voz alta la conocen
dos personas, y eso deja de ser cierto en el primer ingreso.

### 5.3 La sesión en el topbar

Donde estaba el interruptor de rol va la identidad: el **nombre completo** en negrita, debajo
en letra pequeña el **cargo**, y una insignia `GER` u `OPE`.

| Decisión | Por qué |
|---|---|
| El topbar muestra el cargo, no solo el nombre | Para que la persona reconozca su sesión de un vistazo. En un computador compartido, ver «Domiciliaria» debajo del nombre evita media hora de trabajo registrada en la sesión de otra |
| La insignia dice el tipo; el renglón de abajo dice el cargo | «El tipo dice qué puede ver. El cargo dice qué hace.» Son dos cosas distintas y se muestran distinto a propósito |
| En pantallas angostas el nombre colapsa a iniciales y el cargo se oculta | A 375 px la identidad no puede competir con el contenido; la insignia del tipo es lo que nunca se va |

**El menú de la sesión.** Pulsar el nombre abre un menú con lo que es de la cuenta, no del
negocio. Queda así, en este orden:

| Entrada | Visible para |
|---|---|
| **Gestión de usuarios** | Solo Gerencia |
| Cambiar mi contraseña | Todos |
| Cambiar el tema | Todos |
| Acerca de | Todos |
| — separador — | |
| Cerrar sesión | Todos |

«Gestión de usuarios» va primero y separada del resto, porque es la única que lleva a una
pantalla; las demás se resuelven donde estás, sin moverte. Si el tipo no es Gerencia, la
entrada no está: no se atenúa, no se deshabilita, no existe. Al elegirla se cierra el menú y el
foco pasa al encabezado de la pantalla. En la sesión de Gerencia el menú lleva además el
interruptor **Ver como Operación**, que se explica en [§5.6](#56-vista-previa-de-operación).

### 5.4 Gestión de usuarios

**Bloque A — Personas con acceso.** Una sola tabla con nombre completo, usuario, cargo, tipo,
estado y último acceso. Las activas primero; las desactivadas al final, atenuadas y detrás de un
separador que dice `Desactivadas · nada se borra, queda el motivo`. La columna **Estado** es un
botón: pastilla verde si la persona está activa, pastilla atenuada si no, y debajo, en letra
pequeña, la fecha y la hora de la desactivación. Por fila quedan **Editar** y **Restablecer
clave**, ambas ocultas en las filas desactivadas. «+ Nuevo usuario» abre un formulario en línea,
igual que el de productos.

**Bloque B — Catálogo de cargos.** Cada cargo con su descripción, cuántas personas lo tienen y
su estado. Se agrega, se renombra y se desactiva con motivo.

| Decisión | Por qué |
|---|---|
| Activas y desactivadas van en **una sola tabla** | Separarlas en dos paneles esconde la mitad de la verdad y obliga a mirar en dos sitios para responder «¿quién puede entrar hoy?». Juntas, con el estado en cada fila, la respuesta se lee de un vistazo |
| El estado es un **botón**, no una opción dentro de un menú de acciones | Es lo que más se consulta y lo que se quiere cambiar justo cuando se está mirando. Enterrarlo en un menú lo esconde en el único lugar donde estorba |
| La fecha y la hora de la desactivación van en la propia fila | «Desactivada», sola, no dice si fue ayer o hace un año. `14 sep 2026, 3:42 p. m.` sí |
| Desactivar y reactivar confirman en un panel en línea, debajo de la fila | Los diálogos del navegador no se estilizan, no respetan el tema y en celular quedan fatal. El panel usa el mismo patrón de los formularios desplegables |
| Reactivar también pide motivo, y deja la clave marcada para cambio obligatorio | Quien vuelve después de meses no debería entrar con la clave vieja. El panel lo advierte antes de confirmar |
| Desactivar pide motivo escrito y obligatorio | Un usuario nunca se borra. Dentro de un año, «Retiro voluntario, 30 de junio de 2026» explica un registro histórico que un renglón vacío no explica |
| El sistema se niega a desactivar al último usuario activo de Gerencia | Nadie podría volver a entrar a administrar. El aviso lo dice con esas palabras: «No puedes desactivar al último usuario de Gerencia.» |
| Un cargo con personas activas asignadas no se puede desactivar | Dejaría usuarios apuntando a un cargo que ya no se ofrece. El aviso dice cuántas personas lo tienen |
| Los cargos y las personas viven en la misma pantalla | No se puede crear a alguien sin el cargo que le toca. Separarlos obligaría a ir y volver en mitad del formulario |
| El `<select>` de cargo solo ofrece cargos activos | Los desactivados se conservan en quienes ya los tenían, pero no se reparten más |

> **El tipo no se hereda del cargo.** Dos personas con el mismo cargo pueden tener tipos
> distintos, y el sistema se comporta igual con todas las de tipo Operación sin mirar su cargo.
> El cargo es descriptivo; el tipo es autoridad.

### 5.5 Bitácora de cambios

Va entre la tabla y el catálogo de cargos, con una bajada que dice a qué vino: *Quién cambió
qué, cuándo y por qué. Nada se borra.* Cada entrada trae la fecha y la hora, quién hizo el
cambio, sobre quién, qué pasó, el detalle —`de → a`, o el motivo escrito— y un botón
**Revertir**. Las más recientes primero.

> **Revertir es escribir un cambio nuevo que deshace el anterior, nunca borrar el registro del
> error.** Si alguien desactivó a la persona equivocada, la bitácora tiene que mostrar las dos
> cosas: que se desactivó y que se corrigió. Borrar la primera entrada convertiría la bitácora
> en un relato editable, y una bitácora editable no sirve como evidencia.

> **Esta bitácora es media auditoría, y la otra media está en Configuración.** Aquí se ven los
> cambios sobre usuarios y cargos, que son los que se pueden revertir y los que tienen el contexto
> para entender qué se deshace. Los inicios de sesión, los intentos fallidos y los cambios del resto
> de las tablas están en el panel «Auditoría» del [§4.11](#411-configuración-solo-gerencia): es la misma `auditoria`, sin el filtro.

No es una idea nueva en el proyecto: es la misma que ya resuelve el «me equivoqué» del dinero.
Un movimiento errado no se edita, se reversa con un contra-asiento, y los dos quedan visibles
(`CU-04`, `RF-15`). La reversión de un cambio de usuario es una **escritura compensatoria**,
hermana de ese contra-asiento.

| Decisión | Por qué |
|---|---|
| Una entrada jamás se modifica ni desaparece | Es lo único que la hace servir como evidencia. Si se puede editar, no prueba nada |
| Revertir agrega una entrada nueva y marca la original como «Revertida» | La original conserva el error y la nueva conserva la corrección. El botón de revertir de la original se apaga, con un enlace a la entrada que la reversó |
| Revertir una reversión es legal | Vuelve a dejar el valor anterior, y también se anota. Nadie tiene que acertar de primeras |
| **Clave restablecida** es el único evento que no se puede revertir | Revertirlo sería restaurar la contraseña anterior, y el sistema no la conserva: solo guarda su hash. No se puede deshacer lo que no se guardó. Para volver atrás se restablece otra vez. Esta razón va escrita en la pantalla, no solo aquí |
| Se rechaza, con aviso claro, toda reversión que dejaría un estado inválido | Devolver un tipo que deje cero usuarios activos de Gerencia, o revertir la creación de quien tiene la sesión abierta, cierra la puerta por dentro |

> **La bitácora no es una tabla nueva de la base de datos.** Es una vista sobre `auditoria` —la
> que ya escriben los triggers de `ADR-005`— filtrada por las tablas `usuarios` y `cargos`. Y
> `usuarios.desactivado_en / _por / _motivo` guardan el **estado actual**, no la historia: al
> reactivar se limpian, y la historia sigue completa en `auditoria`. Parece que se pierde
> información y no se pierde ninguna.

### 5.6 Vista previa de Operación

En el mismo menú de la sesión, y solo si el tipo real es Gerencia, hay un interruptor **Ver como
Operación**. Al activarlo la interfaz se comporta como para una sesión de Operación: el menú
lateral pierde Inversiones, Reportes y Nómina; Productos deja de mostrar costos y márgenes;
Nómina queda bloqueada; y **Gestión de usuarios desaparece del propio menú de la sesión**,
porque también es exclusiva de Gerencia. Al desactivarlo, todo vuelve.

> **Para qué sirve:** para que Gerencia decida si la pantalla que va a ver la empleada tiene
> sentido, si le falta algo o si le sobra.
> **Para qué NO sirve:** para comprobar que la empleada no puede llegar a los datos ocultos.
> Eso se prueba con una sesión real, y así está en
> [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md).

Ese par de frases va visible en la pantalla mientras la vista previa esté activa, no solo en
este documento. `ADR-006` ya lo dice sin rodeos: *ocultar un menú no es seguridad*. La vista
previa solo cambia lo que el navegador pinta; en el sistema real los permisos los aplica
PostgreSQL con Row Level Security.

El riesgo del modo no es técnico, es humano: Gerencia lo activa, se distrae, y media hora
después cree que el sistema se dañó porque no encuentra la Nómina. Por eso, mientras esté
activa:

| Señal | Comportamiento |
|---|---|
| Una franja fija arriba del contenido, en color de advertencia | Dice `Estás viendo el sistema como lo ve Operación` y trae el botón **`Volver a mi vista`** |
| La franja no se puede cerrar | Solo desaparece al salir del modo. Una franja que se cierra es una franja que se olvida |
| La insignia de tipo del chip de la sesión, en el topbar, muestra `OPE`, pero marcada como simulada | Su `title` dice `Vista previa de Operación · tu tipo real es Gerencia`, para que la insignia no mienta |
| Cerrar sesión apaga la vista previa | Nadie hereda el modo de otra sesión |

El interruptor existe o no según el **tipo real** de la sesión, nunca según el que se está
simulando. Si dependiera del simulado, al activarlo desaparecería y Gerencia quedaría atrapada
en la vista de Operación. El botón `Volver a mi vista` de la franja es la segunda red.

### 5.7 La versión y el ambiente, a la vista

Quien tiene la pantalla enfrente debe poder responder dos cosas sin preguntarle a nadie: **qué
versión estoy usando** y **contra qué servidor está hablando**. Se resuelve con tres piezas, de
la más discreta a la más detallada: una insignia siempre visible, una franja imposible de
ignorar y un panel con el detalle. Cubren `RF-98`, `RF-99` y `RF-100`.

**La insignia permanente.** En el **pie de la barra lateral, abajo a la izquierda**, debajo de la
navegación, pequeña y sin competir con nada:

```
┌──────────────┐
│  PRISMA M&Y  │
│              │
│  • Inicio    │
│  • Pedidos   │
│  ...         │
│              │
│              │
│  v0.4.2 · QA │  ← pie de la barra lateral
└──────────────┘
```

| Decisión | Por qué |
|---|---|
| La insignia va en el pie de la barra lateral, no en el topbar | La barra superior es donde viven la identidad y las acciones de la sesión. La versión no es ninguna de las dos cosas: es un dato de soporte. Abajo a la izquierda está siempre visible, no compite con nada y es donde la gente la busca por costumbre |
| En pantallas angostas el pie pasa al final del contenido | Cuando la barra lateral se vuelve pestañas horizontales ya no hay pie donde vivir. La insignia baja al final del contenido conservando la esquina inferior izquierda: cambia el sitio en el árbol, no el sitio donde la mira quien la busca |
| Sigue siendo pulsable y abre el panel «Acerca de» | Cambió de lugar, no de trabajo. Es el atajo al detalle que se dicta por teléfono cuando alguien reporta un fallo |
| En dev, qa y uat la insignia va en color de advertencia | Es el mismo ámbar que ya significa «ojo con esto» en todo el sistema ([§3.1](#31-color)). No hay que aprender un código nuevo |
| En **prod** la insignia muestra solo la versión, en color neutro, y **no rotula «PROD»** | Si no dice nada, es el de verdad. Rotular el sistema real es ruido: un aviso que se lee todos los días deja de leerse, y el día que aparezca uno que sí importa tampoco se va a notar. La advertencia solo funciona si es la excepción |
| El nombre del ambiente va completo y en español: `Desarrollo`, `QA`, `Aprobación` | Una sigla que hay que traducir no advierte: la lee quien ya sabe lo que significa, que es justo quien no la necesita |
| La versión va siempre, también en prod | Es la mitad de la respuesta cuando alguien reporta un fallo, y no molesta a nadie |

**La franja de ambiente.** En dev, qa, uat y pre-prod ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)), además de la insignia, una franja fija arriba del
contenido:

> **Ambiente de QA · los datos no son reales**

En prod no hay franja. La ausencia es el mensaje.

| Decisión | Por qué |
|---|---|
| Reutiliza el patrón visual de la franja de «Ver como Operación» ([§5.6](#56-vista-previa-de-operación)) | Es exactamente el mismo propósito: avisar de que **lo que ves no es lo que crees**. El patrón ya está construido, aprobado y probado en celular; inventar un segundo aviso para el mismo trabajo solo agregaría una cosa más que mantener y una forma más que aprender |
| Tampoco se puede cerrar | Una franja que se cierra es una franja que se olvida, y esta existe justo para el momento en que ya se olvidó |
| No lleva botón de salida, a diferencia de la de vista previa | De la vista previa se sale con un clic porque es un modo; de un ambiente no se sale apagándolo. Ofrecer un botón que no puede cumplir sería peor que no ofrecer ninguno |
| **La franja no se movió con la insignia**: sigue arriba del contenido | Las dos dicen el ambiente, pero no hacen el mismo trabajo. La insignia está para que la encuentres cuando la buscas, y por eso vive tranquila en el pie. La franja está para interrumpir a quien no está buscando nada, y solo interrumpe desde arriba, en el camino de la mirada |

> **Esto no es adorno: es lo que evita que alguien registre la venta del día en UAT y la dé por
> guardada.** Ese error no avisa en el momento, se descubre en el cierre, y para entonces ya no
> se sabe qué se registró dónde.

**El panel «Acerca de».** Se abre desde el menú de la sesión ([§5.3](#53-la-sesión-en-el-topbar)) y muestra:

| Dato | Ejemplo |
|---|---|
| Versión del front | `0.4.2+118` |
| Versión de la API | `0.3.9` |
| Versión del esquema | `0.3.0` |
| Ambiente | `QA` |
| Fecha de compilación | `15 sep 2026, 9:40 a. m.` |
| Referencia del commit | `a3f19c4` |

Sirve para lo que sirve de verdad: **cuando alguien reporta un fallo, lo primero que hay que
saber es qué versión estaba usando y contra qué servidor.** Sin eso, la conversación arranca con
«¿y a ti te pasa?» y se va media hora en averiguar algo que la pantalla podía haber dicho de
una. Por eso el panel se lee y se dicta por teléfono: seis renglones, ninguno que haya que
interpretar.

**En el mockup.** La insignia, la franja y el panel se dibujan en el prototipo con datos de
ejemplo, igual que todo lo demás. Sin eso no estarían aprobadas, y sin aprobar no se construyen.

---

## 6. Micro-decisiones que importan

| Decisión | Por qué |
|---|---|
| La fecha del movimiento por defecto es hoy, pero siempre visible y editable | El 90% de los registros son del día; el 10% restante no debe quedar mal por descuido |
| El botón de registro rápido flota sobre todas las pantallas menos el Inicio | Si hay que navegar para registrar, no se registra. El Inicio queda fuera porque no escribe ([principio 8](#principio-8)) |
| Anular pide el motivo **antes** de confirmar, no después | Obliga a pensar, y el texto queda mejor escrito |
| La flecha de adelante del libro no pasa del mes en curso | No hay movimientos del futuro ([RF-16](03-requisitos-y-bdd.md#rf-16)): un mes que no ha llegado siempre saldría vacío |
| Lo anulado no se reactiva: no hay «Reactivar» en «Ver anulados» | Lo que hay que arreglar se corrige con un contra-asiento, y el original queda intacto ([RF-15](03-requisitos-y-bdd.md#rf-15)) |
| El libro no ofrece ningún tamaño de página por encima del máximo que dice la API | El máximo existe para que una consulta no traiga el libro entero: ofrecer más sería prometer lo que la API no va a dar |
| Los anticipos tienen su propio color en todas las pantallas | Es el concepto que más se confunde |
| El simulador se bloquea sin pro-labore definido, con explicación | Un resultado inflado es peor que ningún resultado |
| Las alertas muestran el monto exacto, no solo el aviso | "Caja libre en −$340.000" orienta; "revisa tu caja" no |

---

## 7. Verificación del diseño

El checklist de aprobación pantalla por pantalla está en
[`09-plan-de-implantacion.md`](09-plan-de-implantacion.md) [§1](09-plan-de-implantacion.md#1-checklist-de-aprobación-del-mockup).

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](02-casos-de-uso.md "02 · Casos de uso") · [03](03-requisitos-y-bdd.md "03 · Requisitos, reglas de negocio y escenarios BDD") · [04](04-modelo-de-datos.md "04 · Modelo de datos") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [22](22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [Contrato](../contrato/README.md "Contrato de la API · v0.36.0") · [ADR-014](adr/ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8") · [CLAUDE](../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [09 · Plan de implantación](09-plan-de-implantacion.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [11 · Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md)
