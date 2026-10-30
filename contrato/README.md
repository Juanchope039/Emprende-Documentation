# Contrato de la API · v0.37.0

| Versión | Estado | Creado | Actualizado | Contrato | Etiquetas |
|---|---|---|---|---|---|
| [5.3.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/contrato/README.md "Historial de cambios") | [✅ Vigente](../docs/22-documentacion.md#estados) | 2026-09-16 | 2026-10-30 | [0.37.0](openapi.json) | [Contrato](../docs/INDICE.md#etiqueta-contrato) · [API](../docs/INDICE.md#etiqueta-api) · [Front](../docs/INDICE.md#etiqueta-front) |

Este es **el contrato entre `prisma_front` y `prisma_api`**: lo que viaja por el cable, dicho en
un solo archivo. Vive aquí, y no en ninguno de los repositorios de código, porque no le pertenece
a ninguno de los dos lados ([ADR-023](../docs/adr/ADR-023-tres-repositorios.md), que en eso
sigue vigente a través de [ADR-025](../docs/adr/ADR-025-cuatro-repositorios.md)).

| Archivo | Qué es |
|---|---|
| [`openapi.json`](openapi.json) | El documento OpenAPI 3.1 con las rutas, los esquemas y, dentro de `x-emprende-codigos` (y de `x-prisma-codigos`, el nombre de antes), **el catálogo completo de códigos** |

---

## Qué trae

| Parte | Dónde | Para qué le sirve a cada equipo |
|---|---|---|
| Rutas y esquemas | `paths`, `components` | El front genera de aquí su cliente y su servidor simulado; la API comprueba que implementa esto |
| El sobre | Cada respuesta es `Sobre…` con `status` y `mensaje` obligatorios | Ninguno de los dos negocia la forma de una respuesta dos veces |
| El catálogo de códigos | `x-emprende-codigos`, repetido en `x-prisma-codigos` mientras alguien lea el nombre de antes | El front sabe qué significa cada `status`, **sin guardar ningún texto propio**: el mensaje lo manda la API en cada respuesta |
| Los códigos pendientes | `pendienteDeEmitir`, dentro de cada código que aún no se emite | El front conoce desde ya los códigos del canal firmado y de la idempotencia, y sabe en qué sprint empezará a recibirlos |
| El descriptor de formulario | `POST /api/v0/consultas/formularios` y los esquemas `DescriptorDeFormulario`, `DescriptorDeCampo`, `OpcionDeCampo` y `MensajesDeCampo` | El front construye el renderizador de formularios sin esperar a que exista el primero ([`20-contrato-de-api.md`](../docs/20-contrato-de-api.md) [§4.3](../docs/20-contrato-de-api.md#43-cómo-se-pide-y-qué-forma-tiene)). Una lista trae sus `opciones` o el `origen` de donde salen, y el front no decide ninguna de las dos cosas. Una `clave` se pinta oculta |
| Cuentas y categorías | `POST /api/v0/consultas/cuentas` y `/consultas/categorias` para leer, `POST /api/v0/cuentas` y `/api/v0/categorias` para crear, los formularios `cuenta` y `categoria` ([abajo](#los-formularios-acordados)) y los códigos `42220` a `42222` | La API implementa la tarea [1.10](../docs/08-plan-de-desarrollo.md#tarea-1-10) contra esto, y el front pinta sus pantallas sin esperarla |
| Acceso y navegación | `/api/v0/sesiones` para entrar, renovar, salir y cambiar la propia contraseña, y `POST /api/v0/consultas/navegacion` con la vista previa de Operación. Los formularios `acceso` y `cambio-de-clave`, y los códigos `40104`, `40301`, `40302` y `42210` | La API construye el acceso ([2.1](../docs/08-plan-de-desarrollo.md#tarea-2-1), [2.2](../docs/08-plan-de-desarrollo.md#tarea-2-2), [2.12](../docs/08-plan-de-desarrollo.md#tarea-2-12), [2.14](../docs/08-plan-de-desarrollo.md#tarea-2-14)) y el front, su pantalla ([2.6](../docs/08-plan-de-desarrollo.md#tarea-2-6)), a la vez |
| Usuarios, cargos y bitácora | `/api/v0/usuarios`, `/api/v0/cargos` y las consultas de usuarios, cargos y bitácora, siete formularios más y los códigos `40910` a `40913` y `42211` a `42214` | La pantalla de Gestión de usuarios entera ([2.7](../docs/08-plan-de-desarrollo.md#tarea-2-7), [2.8](../docs/08-plan-de-desarrollo.md#tarea-2-8), [2.15](../docs/08-plan-de-desarrollo.md#tarea-2-15) a [2.18](../docs/08-plan-de-desarrollo.md#tarea-2-18)) |
| Pedidos y clientes | `/api/v0/clientes`, `/api/v0/pedidos` con sus cuatro transiciones, `/api/v0/pedidos/{id}/adjuntos` para colgarle la factura, las consultas de clientes y pedidos, los formularios `cliente`, `pedido`, `anticipo`, `entrega` y `cancelacion` ([abajo](#los-formularios-acordados)) y los códigos `40930` a `40932` y `42230` a `42236` | La [4.2](../docs/08-plan-de-desarrollo.md#tarea-4-2) construye la gestión de clientes, la [4.3](../docs/08-plan-de-desarrollo.md#tarea-4-3) a la [4.9](../docs/08-plan-de-desarrollo.md#tarea-4-9) los pedidos y la [4.8](../docs/08-plan-de-desarrollo.md#tarea-4-8) su factura; el trabajo del front pinta sus pantallas sin esperar a ninguna |
| Movimientos | `PUT /api/v0/movimientos/{id}` para registrar, `/{id}/anulacion` y `/{id}/adjuntos` para anular y adjuntar, `PUT /api/v0/movimientos/{id}/correccion/{correccionId}` para corregir por contra-asiento sin tocar el original, `POST /api/v0/consultas/movimientos` para el libro con filtros, el formulario `movimiento` ([abajo](#los-formularios-acordados)) y los códigos `40020`, `40021` y `42223` a `42226` | El [Sprint 3](../docs/08-plan-de-desarrollo.md#sprint-3) entero acordado antes de implementarlo: los endpoints ([3.4](../docs/08-plan-de-desarrollo.md#tarea-3-4)), el registro rápido ([3.5](../docs/08-plan-de-desarrollo.md#tarea-3-5)), el adjunto ([3.6](../docs/08-plan-de-desarrollo.md#tarea-3-6)), las transferencias ([3.7](../docs/08-plan-de-desarrollo.md#tarea-3-7)), el listado ([3.8](../docs/08-plan-de-desarrollo.md#tarea-3-8)) y la anulación ([3.9](../docs/08-plan-de-desarrollo.md#tarea-3-9)) |
| El libro que dibujó el mockup | `POST /api/v0/consultas/movimientos` con grupo, páginas y el rango que no se puede pedir; cada movimiento con su `presentacion`, su `registroHermano` y si `sePuedeAnular`; `POST /api/v0/consultas/presentacion-de-tipos` y `/api/v0/presentacion-de-tipos/{tipo}/edicion` para leer y cambiar cómo se ve cada tipo, con el formulario `presentacion-de-tipo` ([abajo](#los-formularios-acordados)); `POST /api/v0/consultas/soporte` para bajar la foto o el PDF; la anulación que arrastra al registro hermano, y los códigos `40920` a `40923` y `42227` | Las tareas [3.20](../docs/08-plan-de-desarrollo.md#tarea-3-20) a [3.24](../docs/08-plan-de-desarrollo.md#tarea-3-24) y, detrás, la pantalla del libro de la 3.8 y su botón de anular de la 3.9. Las reglas de qué se anula con qué están en el [CU-03](../docs/02-casos-de-uso.md#cu-03) |
| Productos y costeo | `PUT /api/v0/productos/{id}` para crear, `/{id}/edicion`, `/{id}/desactivacion` y `/{id}/reactivacion` para lo demás, `POST /api/v0/consultas/productos` para el cuadro y `POST /api/v0/consultas/costeo` para la vista previa del formulario, los formularios `producto` y `desactivacion-de-producto` ([abajo](#los-formularios-acordados)) y los códigos `40940`, `42240` y `42241` | El catálogo ([5.2](../docs/08-plan-de-desarrollo.md#tarea-5-2)), el cuadro comparativo ([5.9](../docs/08-plan-de-desarrollo.md#tarea-5-9)), el historial de costos ([5.5](../docs/08-plan-de-desarrollo.md#tarea-5-5)), la sugerencia de precio ([5.7](../docs/08-plan-de-desarrollo.md#tarea-5-7)), el bordado por tiempo de máquina ([5.4](../docs/08-plan-de-desarrollo.md#tarea-5-4)) y lo que Operación no recibe ([5.8](../docs/08-plan-de-desarrollo.md#tarea-5-8)). Detrás quedan el pedido con líneas ([4.3](../docs/08-plan-de-desarrollo.md#tarea-4-3)) y, con él, el [Sprint 6](../docs/08-plan-de-desarrollo.md#sprint-6) |
| Capital | `PUT /api/v0/activos/{id}`, `/aportes/{id}`, `/retiros/{id}`, `/prolabore/{id}` y `/sobres/{id}` para registrar y definir; `POST /api/v0/consultas/activos`, `/division-de-retiro`, `/prolabore`, `/sobres` y `/patrimonio` para leer; los formularios `activo`, `aporte`, `retiro`, `prolabore` y `sobres` ([abajo](#los-formularios-acordados)) y los códigos `42290` a `42294`, que estrenan el rango `90`–`99` | Las inversiones ([7.1](../docs/08-plan-de-desarrollo.md#tarea-7-1)), los aportes ([7.2](../docs/08-plan-de-desarrollo.md#tarea-7-2)), el pro-labore ([7.3](../docs/08-plan-de-desarrollo.md#tarea-7-3)), el retiro partido ([7.4](../docs/08-plan-de-desarrollo.md#tarea-7-4)), el patrimonio y su alerta ([7.5](../docs/08-plan-de-desarrollo.md#tarea-7-5), [7.6](../docs/08-plan-de-desarrollo.md#tarea-7-6)) y los cuatro sobres ([7.7](../docs/08-plan-de-desarrollo.md#tarea-7-7)). Detrás quedan las tres cifras ([6.1](../docs/08-plan-de-desarrollo.md#tarea-6-1)), que esperan al pro-labore y al retiro, y con ellas el [Sprint 6](../docs/08-plan-de-desarrollo.md#sprint-6) |
| Nómina y adelantos | `PUT /api/v0/empleados/{id}` con su edición, su retiro y su anulación; `PUT /api/v0/adelantos/{id}` y su anulación; `PUT /api/v0/nomina/periodos/{id}` con su cierre y `PUT /api/v0/nomina/liquidaciones/{id}`; seis consultas —las empleadas, los adelantos pendientes, los meses de nómina, las liquidaciones, el desprendible en PDF y el simulador—, los formularios `empleada`, `edicion-de-empleada`, `retiro-de-empleada`, `adelanto`, `periodo-de-nomina`, `liquidacion` y `simulacion` ([abajo](#los-formularios-acordados)) y los códigos `40950` a `40952` y `42250` a `42253`, que estrenan el rango `50`–`59` | El registro de empleadas ([8.1](../docs/08-plan-de-desarrollo.md#tarea-8-1)), la liquidación en la base ([8.2](../docs/08-plan-de-desarrollo.md#tarea-8-2)), los adelantos como cuenta por cobrar ([8.3](../docs/08-plan-de-desarrollo.md#tarea-8-3)), el desprendible ([8.4](../docs/08-plan-de-desarrollo.md#tarea-8-4)), el simulador ([8.5](../docs/08-plan-de-desarrollo.md#tarea-8-5), [8.6](../docs/08-plan-de-desarrollo.md#tarea-8-6)) y las horas pagadas contra facturadas ([8.7](../docs/08-plan-de-desarrollo.md#tarea-8-7)) |
| Cotizaciones y remisiones | `PUT /api/v0/cotizaciones/{id}` con su anulación, su aceptación —que la convierte en pedido— y su PDF; `POST /api/v0/pedidos/{id}/remision`; `POST /api/v0/consultas/cotizaciones` y `POST /api/v0/consultas/anticipo-minimo`, el formulario `cotizacion` ([abajo](#los-formularios-acordados)) y los códigos `40980` a `40982`, `42280` y `42281`, que estrenan el rango `80`–`89` | El cotizador con su PDF y su remisión ([8.8](../docs/08-plan-de-desarrollo.md#tarea-8-8)) y el validador de anticipo mínimo ([8.9](../docs/08-plan-de-desarrollo.md#tarea-8-9)), que la [4.10](../docs/08-plan-de-desarrollo.md#tarea-4-10) cedió por escrito |
| Importación | `POST /api/v0/consultas/importacion`, que lee el CSV y no escribe nada, y `PUT /api/v0/importaciones/{id}`, que confirma; los códigos `40070`, `40071`, `40970`, `42270` y `42271`, que estrenan el rango `70`–`79` | El importador con su mapeo de columnas y su informe fila por fila ([8.10](../docs/08-plan-de-desarrollo.md#tarea-8-10)) |
| Reportes y cierres | `POST /api/v0/consultas/tablero` con el Inicio entero, `/reporte` con el año mes a mes, `/cierres` con los meses cerrados y `/descarga` con lo que el Inicio muestra en CSV o PDF; `PUT /api/v0/cierres/{id}` para cerrar un mes; y los códigos `40960`, `40961`, `42260` y `42261`, que estrenan el rango `60`–`69`, el último que quedaba sin usar | El dashboard ([6.3](../docs/08-plan-de-desarrollo.md#tarea-6-3)), el gráfico de doce meses ([6.4](../docs/08-plan-de-desarrollo.md#tarea-6-4)), el reporte con el promedio de ganancias ([6.5](../docs/08-plan-de-desarrollo.md#tarea-6-5)), el punto de equilibrio ([6.6](../docs/08-plan-de-desarrollo.md#tarea-6-6)), las alertas ([6.7](../docs/08-plan-de-desarrollo.md#tarea-6-7)), el cierre mensual ([6.8](../docs/08-plan-de-desarrollo.md#tarea-6-8)), el Inicio de solo consulta con su descarga ([6.9](../docs/08-plan-de-desarrollo.md#tarea-6-9)) y el panel de sobres ([7.8](../docs/08-plan-de-desarrollo.md#tarea-7-8)) |
| Saldos por cuenta | `POST /api/v0/consultas/saldos`: cuánto hay en cada cuenta y cuánto en total, que es la consulta que `/consultas/cuentas` dice que existe desde el `0.11.0` y ningún contrato había escrito | La [3.12](../docs/08-plan-de-desarrollo.md#tarea-3-12) tiene por fin su ruta acordada, y el tablero la reusa entera en vez de decir un saldo de dos maneras |
| El archivo que baja | El esquema `Documento`: `nombre`, `tipo`, `bytes` y `contenido` en base64, **dentro del sobre**. Lo devuelven el desprendible, la cotización, la remisión y la descarga del Inicio, que es la que estrenó `text/csv` | Ninguna ruta tiene dos formas de contestar, una para cuando sale bien y otra para el error. Queda por delante devolver un adjunto ([3.6](../docs/08-plan-de-desarrollo.md#tarea-3-6)) |
| Respaldo y auditoría completa | `POST /api/v0/respaldos` para generar un respaldo, `POST /api/v0/respaldos/{id}/descarga` para bajarlo **por partes** y `POST /api/v0/consultas/respaldos` para ver los guardados; `PUT /api/v0/respaldos/programacion` y `POST /api/v0/consultas/respaldos/programacion` para la programación; y `POST /api/v0/consultas/auditoria`, la auditoría entera y filtrable. Tres formularios —`respaldo`, `programacion-de-respaldo` y `filtro-de-auditoria`— ([abajo](#los-formularios-acordados)) y los códigos `42215`, `40971` y `42272`. `configuracion` entra a las claves de `Seccion` | El panel «Exportar respaldo» y el panel «Auditoría» de Configuración, que hasta aquí no tenían ruta acordada: tareas [8.15](../docs/08-plan-de-desarrollo.md#tarea-8-15) y [8.17](../docs/08-plan-de-desarrollo.md#tarea-8-17) para el primero, 8.18 y 8.19 para el segundo |
| El canal firmado | Las cabeceras `X-Prisma-Nonce`, `X-Prisma-Timestamp` y `X-Prisma-Firma` en cada operación con sesión, también en las de cuentas y categorías. Cómo se arma la firma, al byte, está en [`20-contrato-de-api.md`](../docs/20-contrato-de-api.md) [§6.2](../docs/20-contrato-de-api.md#62-cómo-se-arma-la-firma) | El filtro de la API ([2.13](../docs/08-plan-de-desarrollo.md#tarea-2-13)) y el interceptor del front firman y comprueban exactamente lo mismo |

> **El catálogo va dentro del OpenAPI a propósito.** El contrato son dos cosas —rutas y códigos—,
> y si vivieran en dos archivos podrían versionarse por separado y separarse. Así es un solo
> artefacto, y una sola prueba lo verifica entero.

---

## Los formularios acordados

El descriptor de un formulario no está en `openapi.json`: lo sirve
`POST /api/v0/consultas/formularios` con `{"nombre": "…"}`, y lo genera la API de sus propias
validaciones. Lo que se acuerda aquí es **qué campos tiene, cómo se
llaman, qué reglas llevan y con qué palabras avisa**, para que los dos lados construyan contra lo
mismo. Si la API genera otra cosa, la 1.10 no está terminada.

### `cuenta` · crear una cuenta de dinero

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombre` | Nombre de la cuenta | `texto` | obligatorio | obligatorio: «Escribe el nombre de la cuenta.» | `ayuda`: «Por ejemplo: Davivienda, Bancolombia ahorros, Bold.» |
| `tipo` | Tipo | `lista` | obligatorio | obligatorio: «Elige el tipo de cuenta.» | `opciones`: `banco` «Cuenta bancaria» · `billetera` «Billetera digital» · `efectivo` «Efectivo» |
| `saldoInicial` | Saldo actual | `dinero` | obligatorio · `minimo` 0 | obligatorio: «Escribe cuánto tiene hoy la cuenta. Si está vacía, escribe 0.» · minimo: «El saldo no puede ser negativo.» | `ayuda`: «Entra como saldo inicial, no como ingreso: no afecta la utilidad del mes.» |

### `categoria` · crear una categoría

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombre` | Nombre de la categoría | `texto` | obligatorio | obligatorio: «Escribe el nombre de la categoría.» | — |
| `naturaleza` | Naturaleza | `lista` | obligatorio | obligatorio: «Elige si es de ingreso o de gasto.» | `opciones`: `ingreso` «Ingreso» · `gasto` «Gasto» |
| `esFijo` | Gasto fijo mensual | `casilla` | — | — | `ayuda`: «Arriendo, servicios, internet: lo que se paga todos los meses y descuenta la caja libre.» |
| `padreId` | Dentro de | `lista` | — | — | `origen`: `/api/v0/consultas/categorias` · `ayuda`: «Déjalo vacío para una categoría principal.» |

Las tres reglas que miran más de un campo o la base —la madre existe, es de la misma naturaleza y
solo un gasto es fijo— **no caben en el descriptor** ([`20-contrato-de-api.md`](../docs/20-contrato-de-api.md) [§4.4](../docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)). Las comprueba la
API y responden `42220`, `42221` y `42222`, con el aviso en `data.errores` sobre el campo que
corresponde.

### `acceso` · iniciar sesión

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `usuario` | Usuario | `texto` | obligatorio | obligatorio: «Escribe tu usuario.» | — |
| `clave` | Contraseña | `clave` | obligatorio | obligatorio: «Escribe tu contraseña.» | — |

Es el único formulario que se pide sin sesión. **La contraseña no trae `minimo` a propósito**: lo
que se escriba va al proveedor, y la única respuesta posible a una contraseña equivocada es `40104`,
«Usuario o contraseña incorrectos», la misma de un usuario que no existe.

### `cambio-de-clave` · crear o cambiar la propia contraseña

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `claveNueva` | Contraseña nueva | `clave` | obligatorio · `minimo` 8 | obligatorio: «Escribe tu contraseña nueva.» · minimo: «La contraseña debe tener mínimo 8 caracteres.» | `ayuda`: «Mínimo 8 caracteres. No pedimos símbolos ni mayúsculas: una clave larga que recuerdes es mejor que una corta que termina anotada en un papel.» |
| `repeticion` | Repite la contraseña | `clave` | obligatorio | obligatorio: «Repite la contraseña.» | — |

Que las dos coincidan mira dos campos, así que no cabe en el descriptor: lo comprueba la API y
responde `42210` sobre `repeticion`. Es el mismo formulario para «Crea tu contraseña» y para
«Cambiar mi contraseña», y ninguno pide la contraseña actual, como en el mockup.

### `usuario` · crear un usuario

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombreCompleto` | Nombre completo | `texto` | obligatorio · `minimo` 3 | obligatorio: «Escribe el nombre completo de la persona.» · minimo: «El nombre completo tiene que tener al menos 3 caracteres.» | — |
| `usuario` | Usuario | `texto` | obligatorio · `minimo` 3 · `maximo` 20 | obligatorio: «Escribe el usuario con el que va a entrar.» · minimo: «El usuario tiene que tener al menos 3 caracteres.» · maximo: «El usuario puede tener máximo 20 caracteres.» | `ayuda`: «El usuario va en minúsculas, de 3 a 20 caracteres, y admite números, punto, guion y guion bajo.» |
| `claveTemporal` | Contraseña temporal | `texto` | obligatorio · `minimo` 8 | obligatorio: «Escribe la contraseña temporal.» · minimo: «La contraseña temporal debe tener mínimo 8 caracteres.» | `ayuda`: «Se muestra en claro a propósito: Gerencia tiene que poder dictarla. Quien entre con ella la cambia de una vez.» |
| `cargoId` | Cargo | `lista` | obligatorio | obligatorio: «Elige un cargo del catálogo. Si el que necesitas no está, créalo abajo.» | `origen`: `/api/v0/consultas/cargos-asignables` |
| `tipo` | Tipo | `lista` | obligatorio | obligatorio: «Elige el tipo: Gerencia u Operación.» | `opciones`: `gerencia` «Gerencia» · `operacion` «Operación» · `ayuda`: «El tipo dice qué puede ver. El cargo dice qué hace.» |

`claveTemporal` es `texto` y no `clave`: Gerencia la dicta en voz alta y tiene que verla. Tres
reglas no caben en el descriptor y responden con su código, con el aviso en `data.errores`: el
formato del usuario ya en minúsculas (`42212`), el usuario que ya existe (`42211`) y el cargo que no
está activo (`42213`).

### `edicion-de-usuario` · editar un usuario

Los campos `nombreCompleto`, `cargoId` y `tipo` de `usuario`, con las mismas reglas y los mismos
mensajes. **El usuario no está**: es la identidad con la que la persona entra y de la que sale su
correo sintético, y no se edita. La contraseña tampoco: para eso está `clave-temporal`.

### `clave-temporal` · restablecer la contraseña de otra persona

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `claveTemporal` | Contraseña temporal | `texto` | obligatorio · `minimo` 8 | obligatorio: «Escribe la contraseña temporal.» · minimo: «La contraseña temporal debe tener mínimo 8 caracteres.» | `ayuda`: «Se la entregas en persona: no hay correo de recuperación. Al entrar tendrá que cambiarla.» |

### `cargo` · crear o renombrar un cargo

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombre` | Cargo | `texto` | obligatorio | obligatorio: «El cargo necesita un nombre.» | — |
| `descripcion` | Descripción | `texto` | — | — | — |

Un nombre que ya tiene otro cargo, sin distinguir mayúsculas, responde `42214` sobre `nombre`.

### `cliente` · crear un cliente

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombre` | Cliente | `texto` | obligatorio | obligatorio: «Escribe el nombre del cliente.» | `ayuda`: «La persona, el colegio o la empresa, como se le dice en el taller.» |
| `telefono` | Teléfono | `texto` | — | — | `ayuda`: «Es por donde se le escribe.» |
| `correo` | Correo | `texto` | — | — | — |
| `notas` | Notas | `texto` | — | — | — |

**Solo el nombre es obligatorio, y eso es deliberado.** En el taller un cliente entra por teléfono
y el correo llega después, si llega; exigirlo obligaría a inventárselo para poder guardar el pedido.

### `pedido` · registrar un pedido

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `clienteId` | Cliente | `lista` | obligatorio | obligatorio: «Elige el cliente. Si no está, créalo primero.» | `origen`: `/api/v0/consultas/clientes` |
| `fechaPedido` | Fecha del pedido | `fecha` | — | — | `ayuda`: «Sin ella, hoy.» |
| `fechaEntregaPrevista` | Fecha de entrega | `fecha` | — | — | — |
| `anticipoPct` | Anticipo al confirmar | `numero` | `minimo` 0 · `maximo` 100 | minimo y maximo: «El anticipo va entre 0 y 100 %.» | `teclado`: `numerico` · `ayuda`: «La política del negocio es 50 %.» |
| `notas` | Notas | `texto` | — | — | — |

**Las líneas del pedido no están en el descriptor, y no por olvido.** El descriptor sabe expresar
`obligatorio`, `minimo` y `maximo` sobre seis tipos de campo ([`20-contrato-de-api.md`](../docs/20-contrato-de-api.md) [§4.3](../docs/20-contrato-de-api.md#43-cómo-se-pide-y-qué-forma-tiene) y [§4.4](../docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)), y
una lista de renglones repetibles no es ninguno de ellos. El esquema `NuevoPedido` sí las declara,
con `minItems` 1, y la API las juzga: un pedido sin líneas, con una cantidad que no es positiva o
con un producto que no existe responde `42231` sobre `lineas`. Un cliente que no existe o está
anulado responde `42232` sobre `clienteId`.

> **El mockup pinta el anticipo con un deslizador y el descriptor no sabe decir eso.** Captura
> `anticipo_pct` con un `range` de paso 5, y aquí el campo se declara como el número que es, con su
> mínimo y su máximo. **Cómo se pinta es del trabajo del front:** la API dicta reglas, no controles. El
> `0.10.0` lo declaró de tipo `porcentaje`, que no existe en el contrato ni en el
> [§4.3](../docs/20-contrato-de-api.md#43-cómo-se-pide-y-qué-forma-tiene); el `0.12.0` lo corrige a `numero`, el tipo que entró con el formulario
> `producto`.

> **El valor total no se manda, se calcula.** Sale de las líneas, y por eso no es un campo del
> formulario: mandarlo sería dejar que el front calcule plata ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)). Lo mismo el número
> visible del pedido, que lo pone la API.

### `anticipo` · cobrar un anticipo

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `valor` | Anticipo a cobrar | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe cuánto se recibió.» · minimo: «El anticipo tiene que ser mayor que cero.» | `ayuda`: «Entra como pasivo, no como ingreso: no sube la utilidad hasta que se entregue.» |
| `cuentaId` | Cuenta | `lista` | obligatorio | obligatorio: «Elige en qué cuenta entró la plata.» | `origen`: `/api/v0/consultas/cuentas` |
| `fecha` | Fecha | `fecha` | — | — | `ayuda`: «Cuándo se recibió de verdad. Sin ella, hoy.» |

Que el anticipo quepa en el pedido mira el pedido entero y no cabe en el descriptor: lo comprueba
la API y responde `42230` sobre `valor`.

### `entrega` · entregar y cobrar el saldo

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `fecha` | Fecha de entrega | `fecha` | — | — | `ayuda`: «Es la fecha que causa la venta. Sin ella, hoy.» |
| `cuentaId` | Cuenta | `lista` | — | — | `origen`: `/api/v0/consultas/cuentas` · `ayuda`: «Aquí entra el saldo que falta. Con el pedido ya pagado, déjala vacía.» |

**Dos campos y ni uno más**, porque son exactamente los que recibe `fn_entregar_pedido`
([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§10](../docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas)). Declarar otro sería invitar a la API a rehacer los pasos de la
función, que es lo que la regla 1 de ese mismo párrafo prohíbe.

**`cuentaId` no es obligatorio en el descriptor y sí lo es a veces**, por la misma razón que
`destinoDelAnticipo` en la cancelación: obligatorio depende de si al pedido le queda saldo, y eso
mira el pedido y no el campo. La API lo comprueba y responde `42236` sobre `cuentaId`
([RF-22](../docs/03-requisitos-y-bdd.md#rf-22)).

### `cancelacion` · cancelar un pedido

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `destinoDelAnticipo` | Qué pasa con el anticipo | `lista` | — | — | `opciones`: `devolucion` «Se le devuelve al cliente» · `ingreso` «Se convierte en ingreso» |
| `cuentaId` | Cuenta | `lista` | — | — | `origen`: `/api/v0/consultas/cuentas` · `ayuda`: «De dónde sale la plata de la devolución.» |
| `motivo` | Motivo | `texto` | obligatorio · `minimo` 5 | obligatorio: «Escribe por qué se cancela.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» | — |

**`destinoDelAnticipo` no es obligatorio en el descriptor y sí lo es a veces**, y esa es la razón de
que no lo declare: obligatorio depende de si el pedido tiene anticipos por devengar, y eso mira el
pedido y no el campo. La API lo comprueba y responde `42235` sobre `destinoDelAnticipo`.

### `movimiento` · registrar un ingreso, un gasto o una transferencia

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `tipo` | Tipo | `lista` | obligatorio | obligatorio: «Elige si entró plata, salió plata o solo cambió de cuenta.» | `opciones`: `ingreso` «Ingreso» · `gasto` «Gasto» · `transferencia` «Transferencia entre cuentas» |
| `valor` | Valor | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe cuánto fue. Un movimiento de $0 no dice nada.» · minimo: «El valor tiene que ser mayor que cero.» | `teclado`: `numerico` |
| `fechaMovimiento` | Fecha del movimiento | `fecha` | obligatorio | obligatorio: «Falta la fecha en que ocurrió. Es la que manda en los reportes.» | `ayuda`: «Cuándo ocurrió de verdad, no cuándo lo estás registrando. Hoy viene puesta.» |
| `cuentaId` | Medio de pago | `lista` | obligatorio | obligatorio: «Elige el medio de pago por donde entró o salió la plata.» | `origen`: `/api/v0/consultas/cuentas` |
| `cuentaDestinoId` | A qué medio de pago llega | `lista` | — | — | **Solo viaja cuando la consulta dice que el tipo es `transferencia`** · `origen`: `/api/v0/consultas/cuentas` · `ayuda`: «La transferencia es el único movimiento que toca dos bolsillos.» |
| `categoriaId` | Categoría | `lista` | — | — | `origen`: `/api/v0/consultas/categorias` · `ayuda`: «Una transferencia no lleva categoría: la plata solo cambia de bolsillo.» |
| `descripcion` | Descripción | `texto` | — | — | `ayuda`: «En qué se fue la plata. Es lo que se lee después en el libro.» |

**El medio de pago es un solo campo, y el destino solo existe en una transferencia** ([10 §4.3](../docs/10-ux-y-mockups.md#43-movimientos)).
La consulta lleva la elección —`{"nombre": "movimiento", "tipo": "transferencia"}`— y la API
contesta con siete campos; sin `tipo`, o con cualquier otro, contesta con seis y `cuentaDestinoId`
no viaja. Al cambiar el tipo **el front vuelve a pedir el formulario** y pinta lo que llegue
([20 §4.3](../docs/20-contrato-de-api.md#43-cómo-se-pide-y-qué-forma-tiene)): así un gasto ya no
tiene un campo que se puede llenar para que después le digan que sobraba.

**El `<select>` de cuenta muestra solo nombres, sin saldos** ([`10-ux-y-mockups.md`](../docs/10-ux-y-mockups.md) [§4.3](../docs/10-ux-y-mockups.md#43-movimientos)), para que
Operación pueda elegir una cuenta sin ver la caja; por eso `origen` apunta a
`/api/v0/consultas/cuentas`, que no devuelve saldo.

Cuatro reglas no caben en el descriptor y responden con su código, con el aviso en `data.errores`
sobre el campo que corresponde: la fecha posterior a hoy (`42223`), la cuenta (`42224`) y la
categoría (`42225`) que no están en el catálogo o quedaron anuladas, y **las tres situaciones de la
cuenta de destino** (`42226`) —una transferencia sin ella, una con la misma de origen, y cualquier
otro tipo que la traiga—. Son la misma pregunta sobre el mismo campo, así que comparten código y lo
que cambia es el texto de `data.errores`.

**`cuentaDestinoId` y `categoriaId` viajan sin `obligatorio`** aunque una transferencia exija la
primera y un gasto pida la segunda: el descriptor solo sabe decir `obligatorio`, `minimo` y `maximo`,
nunca «obligatorio si» ([§4.4](../docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)). Una regla condicional en el descriptor sería código en el front.

### `presentacion-de-tipo` · cambiar cómo se ve un tipo en el libro

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `seLeeComo` | Se lee como | `texto` | obligatorio · `maximo` 30 | obligatorio: «Escribe cómo se lee este tipo en el libro.» · maximo: «El nombre cabe en 30 caracteres.» | `ayuda`: «Es lo que dice la píldora. No cambia lo que el tipo le hace a las cifras.» |
| `color` | Color | `lista` | obligatorio | obligatorio: «Elige el color de la píldora.» | `opciones`: `verde` «Verde» · `rojo` «Rojo» · `morado` «Morado» · `gris` «Gris» |
| `grupo` | Sale en | `lista` | obligatorio | obligatorio: «Elige en qué filtro sale.» | `opciones`: `ingresos` «Ingresos» · `gastos` «Gastos» · `ninguno` «Solo en Todos» |

**Todo cabe en el descriptor**, así que no tiene códigos propios: lo que no cuadra responde `42200`
con `data.errores`, y lo vuelven a juzgar las tres restricciones de `presentacion_tipos`
([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§4.13](../docs/04-modelo-de-datos.md#413-cómo-se-ve-cada-tipo-de-movimiento)). Los colores son los cuatro que el [10 §3.1](../docs/10-ux-y-mockups.md#31-color) deja para un tipo.
**Lo que el tipo le hace a la utilidad, la caja y el patrimonio no está en el formulario**: no se
configura, y la consulta lo trae aparte, en `efecto`, para pintarlo en el mismo renglón.

### `producto` · crear o editar un producto o un servicio

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombre` | Nombre | `texto` | obligatorio | obligatorio: «Escribe el nombre del producto o del servicio.» | `ayuda`: «Como se le dice en el taller: gorra bordada, tula estampada…» |
| `tipo` | Tipo | `lista` | obligatorio | obligatorio: «Elige si es un producto o un servicio.» | `opciones`: `producto` «Producto» · `servicio` «Servicio» |
| `unidad` | Unidad | `texto` | — | — | `ayuda`: «En qué se cuenta: unidad, docena, metro. Déjala vacía para contarlo por unidad.» |
| `costoManoObra` | Mano de obra | `dinero` | `minimo` 0 | minimo: «El costo de mano de obra no puede ser negativo.» | `teclado`: `numerico` · `ayuda`: «Lo que vale el trabajo de una unidad, en pesos. En cero si el taller no le dedica tiempo.» |
| `precioVenta` | Precio de venta | `dinero` | `minimo` 0 | minimo: «El precio de venta no puede ser negativo.» | `teclado`: `numerico` · `ayuda`: «En cero mientras no se sepa a cuánto se vende.» |
| `costoInsumo` | Material | `dinero` | `minimo` 0 | minimo: «El costo del material no puede ser negativo.» | `teclado`: `numerico` · `ayuda`: «Lo que cuesta el material que se convierte en el producto.» |
| `costoConsumibles` | Consumibles | `dinero` | `minimo` 0 | minimo: «El costo de los consumibles no puede ser negativo.» | `teclado`: `numerico` · `ayuda`: «Tinta, papel transfer, hilo, energía: lo que se gasta produciéndolo.» |

**Es el mismo formulario para crear y para editar**, como el de cargo, porque el mockup tiene uno
solo y un solo botón de guardar. Al guardar, la ficha se corrige y el costo **no se sobrescribe**:
si cambió, entra una fila nueva en `costos_producto` ([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§4.5](../docs/04-modelo-de-datos.md#45-productos-costeo-y-cotizaciones)), y así un pedido
viejo conserva el costo que tenía cuando se produjo.

**El material y los consumibles son dos campos, y el mockup los suma en uno.** Los separan
[`05-reglas-financieras.md`](../docs/05-reglas-financieras.md) [§7.1](../docs/05-reglas-financieras.md#71-costo-unitario) y el [RF-29](../docs/03-requisitos-y-bdd.md#rf-29), y la tabla tiene una columna para cada uno: juntarlos
dejaría una en cero para siempre.

**El precio no es obligatorio, a propósito.** Un precio en cero es un producto al que todavía
nadie le puso precio, y su lectura lo dice; exigirlo dejaría sin poder escribirse justo el caso que
el dominio modela.

**La mano de obra es un campo en pesos, y el tiempo no es ningún campo.** Desde el contrato
`0.30.0` el catálogo no pide minutos de trabajo ni minutos de máquina: lo que una unidad cuesta de
trabajo se escribe directamente, en pesos enteros ([§7.1](../docs/05-reglas-financieras.md#71-costo-unitario)). Con eso **ninguna regla de este
formulario se queda fuera del descriptor**: las tres cifras son plata, y plata es lo que el
descriptor sabe decir.

> **El margen objetivo del mockup no es un campo del formulario.** Su deslizador no se guarda: pide
> un precio sugerido, y eso es `POST /api/v0/consultas/costeo` con `margenObjetivo`. Esa misma
> consulta devuelve el costo unitario, los tres márgenes y la lectura que el formulario pinta en
> vivo, porque las cuatro son plata o son reglas y ninguna se calcula en el front
> ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)).

### `activo` · registrar una inversión en un activo

> **Ni este formulario ni los cuatro de capital que siguen tienen pantalla todavía.** El mockup
> pinta «Inversiones y retiros» solo para consultar, y [`10-ux-y-mockups.md`](../docs/10-ux-y-mockups.md) [§2](../docs/10-ux-y-mockups.md#2-mapa-de-navegación) manda el pro-labore y
> los sobres a una «Configuración» que no tiene clave de navegación. Lo que aquí se acuerda es lo
> que las tareas necesitan para existir: dónde se pintan lo diseña el trabajo del front en el mockup
> antes de construirlo, y lo aprueba quien dirige ([`TODO.md`](../TODO.md) [§10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar)).

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombre` | Activo | `texto` | obligatorio | obligatorio: «Escribe qué se compró.» | `ayuda`: «Como se le dice en el taller: prensa de calor 40×50, máquina bordadora.» |
| `valorCompra` | Valor de compra | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe cuánto costó.» · minimo: «El valor de compra tiene que ser mayor que cero.» | `teclado`: `numerico` · `ayuda`: «Una inversión no es un gasto: baja la caja y no toca la utilidad.» |
| `fechaCompra` | Fecha de compra | `fecha` | — | — | `ayuda`: «Cuándo se compró de verdad. Sin ella, hoy.» |
| `cuentaId` | Cuenta | `lista` | — | — | `origen`: `/api/v0/consultas/cuentas` · `ayuda`: «De dónde salió la plata. Déjala vacía solo si se compró antes de empezar a llevar las cuentas en PRISMA: esa plata ya no está en ningún saldo.» |

**De la cuenta depende si hay movimiento.** Con ella, entran en la misma transacción el activo y un
movimiento de tipo `inversion`, que baja la caja de esa cuenta y no toca la utilidad
([`05-reglas-financieras.md`](../docs/05-reglas-financieras.md) [§6.1](../docs/05-reglas-financieras.md#61-las-tres-salidas-de-plata-que-no-son-iguales)). Sin ella, entra solo el activo: es como se registran los equipos
que el taller ya tenía el día del corte ([`09-plan-de-implantacion.md`](../docs/09-plan-de-implantacion.md) [§4.1](../docs/09-plan-de-implantacion.md#41-qué-se-migra-y-qué-no)), cuya plata ya no está en
ninguna cuenta, y `activos.movimiento_id` admite nulo justo para eso. **Por eso la cuenta no es
obligatoria, y ese es su riesgo:** olvidarla en una compra nueva no le resta a la caja. El descriptor
no sabe decir «obligatoria si la compra es posterior al corte» —y el corte ni siquiera está en el
modelo—, así que lo dice la ayuda.

La fecha futura y la cuenta que no existe o está anulada no caben en el descriptor, y responden
`42290` sobre `fechaCompra` y `42291` sobre `cuentaId`. **Ni la vida útil ni el estado son campos:**
`vida_util_meses` existe y ningún documento la usa, y un activo nace `en_uso` sin que nada diga
todavía cómo se vende o se da de baja.

### `aporte` · registrar un aporte de capital

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `valor` | Valor del aporte | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe cuánto entró.» · minimo: «El aporte tiene que ser mayor que cero.» | `teclado`: `numerico` · `ayuda`: «Plata que entra desde afuera del negocio: sube la caja y el patrimonio, no la utilidad.» |
| `cuentaId` | Cuenta | `lista` | obligatorio | obligatorio: «Elige en qué cuenta entró la plata.» | `origen`: `/api/v0/consultas/cuentas` |
| `fecha` | Fecha | `fecha` | — | — | `ayuda`: «Cuándo entró de verdad. Sin ella, hoy.» |
| `nota` | Nota | `texto` | — | — | `ayuda`: «De dónde salió la plata, si sirve recordarlo.» |

**Aquí la cuenta sí es obligatoria**, porque todo aporte es un movimiento: `aportes_retiros.movimiento_id`
no admite nulo ([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§4.6](../docs/04-modelo-de-datos.md#46-inversiones-capital-y-pro-labore)). La fecha futura responde `42290` sobre `fecha` y la cuenta
que no sirve, `42291` sobre `cuentaId`.

### `retiro` · registrar un retiro, partido en pro-labore y distribución

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `valor` | Valor del retiro | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe cuánto sacaste.» · minimo: «El retiro tiene que ser mayor que cero.» | `teclado`: `numerico` |
| `cuentaId` | Cuenta | `lista` | obligatorio | obligatorio: «Elige de qué cuenta salió la plata.» | `origen`: `/api/v0/consultas/cuentas` |
| `fecha` | Fecha | `fecha` | — | — | `ayuda`: «Cuándo salió de verdad. Sin ella, hoy.» |
| `prolabore` | De eso, pro-labore | `dinero` | `minimo` 0 | minimo: «El pro-labore no puede ser negativo.» | `teclado`: `numerico` · `ayuda`: «La parte que paga tu trabajo en el taller: es gasto. El resto es distribución y no toca la utilidad. Si lo dejas vacío, se parte solo con lo que falta de tu pro-labore del mes.» |
| `nota` | Nota | `texto` | — | — | — |

**El orden es el del [CU-16](../docs/02-casos-de-uso.md#cu-16):** primero el valor, la cuenta y la fecha, y después cómo se clasifica.
**La división la propone la API y la decide la persona.** `POST /api/v0/consultas/division-de-retiro`,
con el valor y la fecha, devuelve cuánto sería pro-labore y cuánto distribución, con la explicación
en palabras, y el formulario pinta la propuesta en `prolabore`. Si el campo llega vacío, la API lo
parte con la misma regla: pro-labore hasta completar el del mes —el vigente en la fecha del retiro,
menos lo que ya se sacó como pro-labore ese mes— y el resto distribución. Sin pro-labore definido, todo es
distribución. Un pro-labore mayor que el retiro responde `42292` sobre `prolabore`.

> **El aviso de caja libre no está, y no por olvido.** El [CU-16](../docs/02-casos-de-uso.md#cu-16) pide advertir cuando la caja libre
> no alcanza y exigir confirmación ([BDD-16-2](../docs/03-requisitos-y-bdd.md#bdd-16-2)). Pero la caja libre la calcula la tarea [6.1](../docs/08-plan-de-desarrollo.md#tarea-6-1), que depende
> del retiro, así que no hay orden en que el retiro la pueda usar: va con el contrato de las tres
> cifras ([6.10](../docs/08-plan-de-desarrollo.md#tarea-6-10)), que le puede sumar el aviso a esta misma vista previa con una MINOR.

### `prolabore` · definir el pro-labore

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `valorMensual` | Pro-labore mensual | `dinero` | obligatorio · `minimo` 0 | obligatorio: «Escribe cuánto vale al mes tu trabajo en el taller.» · minimo: «El pro-labore no puede ser negativo.» | `teclado`: `numerico` · `ayuda`: «Lo que tendrías que pagarle a alguien para que hiciera lo que tú haces en el taller. No es lo que necesitas para vivir: es lo que vale el trabajo.» |
| `horasMensuales` | Horas productivas al mes | `numero` | `minimo` 0 | minimo: «Las horas no pueden ser negativas.» | `teclado`: `numerico` · `ayuda`: «Las horas del mes que trabajas produciendo. De ellas sale hasta dónde puede llegar el pro-labore del mes.» |
| `justificacion` | Justificación | `texto` | obligatorio | obligatorio: «Escribe por qué ese valor: con qué lo comparaste.» | `ayuda`: «Queda junto al valor, para que dentro de un año se sepa de dónde salió.» |

**No se edita: se vuelve a definir.** Cada vez que se guarda entra una fila nueva en
`prolabore_config`, vigente desde ese día, como el costeo. Cada retiro se parte con el pro-labore
vigente en su fecha.

**La justificación es obligatoria aquí y opcional en la base.** La tarea es «Configuración del
pro-labore **con justificación**» ([7.3](../docs/08-plan-de-desarrollo.md#tarea-7-3)), y [`05-reglas-financieras.md`](../docs/05-reglas-financieras.md) [§6.3](../docs/05-reglas-financieras.md#63-el-pro-labore--la-trampa-del-trabajo-invisible-rn-08) dice cómo se fija ese
valor; la columna admite nulo, así que esa regla la sostiene la API. **Un pro-labore en cero se
puede escribir**, porque la columna es `dinero` y no `dinero_positivo`: entonces todo retiro es
distribución. Las horas con más de dos decimales —lo que guarda `NUMERIC(6,2)`— responden `42294`
sobre `horasMensuales`.

### `sobres` · configurar los cuatro sobres

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `pctCostoDirecto` | Costo directo | `numero` | obligatorio · `minimo` 0 · `maximo` 100 | obligatorio: «Escribe qué porcentaje va a este sobre.» · minimo y maximo: «Cada sobre va entre 0 y 100 %.» | `teclado`: `numerico` · `ayuda`: «Los insumos del próximo pedido. Para empezar se sugiere 45 %.» |
| `pctGastosFijos` | Gastos fijos | `numero` | obligatorio · `minimo` 0 · `maximo` 100 | obligatorio: «Escribe qué porcentaje va a este sobre.» · minimo y maximo: «Cada sobre va entre 0 y 100 %.» | `teclado`: `numerico` · `ayuda`: «Arriendo, servicios, internet, pro-labore y nómina. Se sugiere 25 %.» |
| `pctReserva` | Reserva | `numero` | obligatorio · `minimo` 0 · `maximo` 100 | obligatorio: «Escribe qué porcentaje va a este sobre.» · minimo y maximo: «Cada sobre va entre 0 y 100 %.» | `teclado`: `numerico` · `ayuda`: «El colchón del negocio para imprevistos. Se sugiere 10 %.» |
| `pctRetiro` | Retiro | `numero` | obligatorio · `minimo` 0 · `maximo` 100 | obligatorio: «Escribe qué porcentaje va a este sobre.» · minimo y maximo: «Cada sobre va entre 0 y 100 %.» | `teclado`: `numerico` · `ayuda`: «Lo que se reparte la propiedad. Se sugiere 20 %.» |

**Que los cuatro sumen 100 mira los cuatro campos, y no cabe en el descriptor.** Es la restricción
`suma_cien` de `sobres_config` ([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§4.8](../docs/04-modelo-de-datos.md#48-sobres-y-cierres)), y responde `42293` sobre `pctRetiro`, el
último: la regla mira los cuatro y el aviso cae donde se termina de escribir, como el `42210` cae
sobre `repeticion`. Los sugeridos de la ayuda son los de arranque de
[`05-reglas-financieras.md`](../docs/05-reglas-financieras.md) [§11](../docs/05-reglas-financieras.md#11-la-regla-de-los-4-sobres). Cada cambio es una fila nueva con su fecha de vigencia, y así se conserva
el historial ([RF-51](../docs/03-requisitos-y-bdd.md#rf-51)).

### `empleada` · dar de alta a quien entra a nómina

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `nombre` | Nombre | `texto` | obligatorio | obligatorio: «Escribe el nombre de la persona.» | `ayuda`: «Como se le dice en el taller. Es el nombre que sale en el desprendible.» |
| `documento` | Documento | `texto` | — | — | `teclado`: `numerico` · `ayuda`: «La cédula. Sale en el desprendible; déjala vacía si no la tienes a la mano.» |
| `fechaIngreso` | Fecha de ingreso | `fecha` | obligatorio | obligatorio: «Falta desde cuándo trabaja.» | `ayuda`: «Desde cuándo está en nómina. Hoy viene puesta.» |
| `salarioAcordado` | Salario acordado | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe el salario acordado.» · minimo: «El salario tiene que ser mayor que cero.» | `teclado`: `numerico` · `ayuda`: «Lo que se pactó al mes. Con esto se calcula el valor de la hora.» |
| `horasMensuales` | Horas al mes | `numero` | `minimo` 0 | minimo: «Las horas del mes no pueden ser negativas.» | `teclado`: `numerico` · `ayuda`: «Las horas pactadas al mes. Si no se pactaron, deja 192.» |
| `usuarioId` | Usuario | `lista` | — | — | `origen`: `/api/v0/consultas/usuarios` · `ayuda`: «Con qué usuario entra al sistema, si entra. Déjalo vacío si no usa PRISMA.» |

**Es el mismo formulario para crear y `edicion-de-empleada` para editar**, y la diferencia entre los
dos es la fecha de ingreso: **editarla no está**. Moverla cambiaría de mes liquidaciones ya hechas,
y este módulo no reescribe lo liquidado.

**Se puede estar en nómina sin entrar al sistema, y al revés**, que es por lo que `usuarios` y
`empleados` son dos tablas ([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§4.2](../docs/04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas)). Un usuario que ya tiene ficha responde `42253`
sobre `usuarioId`: es el `UNIQUE` `empleados_usuario_id_key`, y sin él el desprendible se le mostraría
a la persona equivocada.

**El aumento se escribe encima.** A diferencia del costo de un producto, `empleados` no guarda
historial de salario: lo que conserva el suyo es cada liquidación, en `nomina_detalle.salario_base`.

### `retiro-de-empleada` · sacar a alguien de la nómina

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `fechaRetiro` | Fecha de retiro | `fecha` | obligatorio | obligatorio: «Falta desde cuándo dejó de estar en nómina.» | `ayuda`: «Desde esta fecha no entra en las liquidaciones. Sus liquidaciones anteriores siguen enteras.» |

**Retirar no es anular.** Se retira a quien trabajó y dejó de hacerlo; se anula la ficha que no
debió crearse. Una fecha anterior a la de ingreso responde `42250`, que es la única regla de este
formulario que no cabe en el descriptor: mira dos fechas y una de ellas no está en el formulario.

**No es una liquidación definitiva de contrato**, que este módulo no calcula
([`06-nomina-y-capacidad-de-pago.md`](../docs/06-nomina-y-capacidad-de-pago.md) [§1](../docs/06-nomina-y-capacidad-de-pago.md#1-alcance-de-esta-versión)): es el interruptor que la saca de la nómina del mes siguiente.

### `adelanto` · entregar plata a cuenta del salario

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `empleadaId` | Persona | `lista` | obligatorio | obligatorio: «Elige a quién se le entrega.» | `origen`: `/api/v0/consultas/empleados` |
| `valor` | Valor | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe cuánto se le entrega.» · minimo: «El adelanto tiene que ser mayor que cero.» | `teclado`: `numerico` |
| `fecha` | Fecha | `fecha` | obligatorio | obligatorio: «Falta la fecha en que se entregó.» | `ayuda`: «Cuándo se entregó de verdad. Hoy viene puesta.» |
| `cuentaId` | Cuenta | `lista` | obligatorio | obligatorio: «Elige de qué cuenta sale la plata.» | `origen`: `/api/v0/consultas/cuentas` |
| `descripcion` | Descripción | `texto` | — | — | `ayuda`: «Para qué fue. Queda en el libro y en el desprendible del mes.» |

**El adelanto no es un gasto, y el formulario no pregunta por categoría.** Baja la caja y crea una
cuenta por cobrar; el gasto se reconoce entero en la liquidación
([RN-11](../docs/03-requisitos-y-bdd.md#rn-11), [`06-nomina-y-capacidad-de-pago.md`](../docs/06-nomina-y-capacidad-de-pago.md) [§6.3](../docs/06-nomina-y-capacidad-de-pago.md#63-el-efecto-correcto-sobre-utilidad-y-caja)). Registrarlo aquí como gasto y después pagar el
salario completo contaría $300.000 de más, mes tras mes.

Dos reglas no caben en el descriptor: la fecha posterior a hoy (`42223`, el `CHECK fecha_no_futura`
del movimiento que se escribe con él) y la cuenta que no está en el catálogo o quedó anulada
(`42224`). Son las mismas del formulario `movimiento`, porque **el adelanto escribe un movimiento**.

### `periodo-de-nomina` · abrir el mes que se va a liquidar

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `anio` | Año | `numero` | obligatorio · `minimo` 2020 · `maximo` 2100 | obligatorio: «Elige el año que vas a liquidar.» · minimo y maximo: «El año tiene que estar entre 2020 y 2100.» | `teclado`: `numerico` |
| `mes` | Mes | `lista` | obligatorio | obligatorio: «Elige el mes que vas a liquidar.» | `opciones`: los doce, `1` «Enero» … `12` «Diciembre» |

**No es el cierre mensual del negocio.** Ese es `cierres_mensuales` y es de otro sprint; este es el
calendario de la nómina. El segundo período con el mismo año y el mismo mes responde `42252`, que es
`nomina_periodos_anio_mes_key`.

### `liquidacion` · liquidar el mes de una empleada

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `periodoId` | Mes | `lista` | obligatorio | obligatorio: «Elige el mes que estás liquidando.» | `origen`: `/api/v0/consultas/periodos-de-nomina` |
| `empleadaId` | Persona | `lista` | obligatorio | obligatorio: «Elige a quién estás liquidando.» | `origen`: `/api/v0/consultas/empleados` |
| `diasTrabajados` | Días trabajados | `numero` | `minimo` 0 · `maximo` 31 | minimo y maximo: «Los días trabajados van entre 0 y 31.» | `teclado`: `numerico` · `ayuda`: «Del mes que se liquida. Vienen puestos 30.» |
| `horasExtra` | Horas extra | `numero` | `minimo` 0 | minimo: «Las horas extra no pueden ser negativas.» | `teclado`: `numerico` · `ayuda`: «Cuántas horas extra hizo. En cero si no hizo ninguna.» |
| `recargoExtraPct` | Recargo de hora extra | `numero` | `minimo` 0 · `maximo` 200 | minimo y maximo: «El recargo va entre 0 y 200 %.» | `teclado`: `numerico` · `ayuda`: «Cuánto más vale la hora extra que la ordinaria. Viene puesto 25 %.» |
| `otrosDevengados` | Otros devengados | `dinero` | `minimo` 0 | minimo: «Los otros devengados no pueden ser negativos.» | `teclado`: `numerico` · `ayuda`: «Bonificaciones o auxilios del mes.» |
| `otrosDescuentos` | Otros descuentos | `dinero` | `minimo` 0 | minimo: «Los otros descuentos no pueden ser negativos.» | `teclado`: `numerico` · `ayuda`: «Los adelantos no van aquí: se descuentan solos.» |
| `cuentaId` | Cuenta | `lista` | obligatorio | obligatorio: «Elige de qué cuenta sale el pago.» | `origen`: `/api/v0/consultas/cuentas` |
| `fechaPago` | Fecha de pago | `fecha` | — | — | `ayuda`: «Cuándo se pagó. Hoy viene puesta.» |

**Los adelantos no son un campo**, y esa es la regla del módulo: los toma la liquidación sola, con
`fn_liquidar_nomina`, que en una sola transacción escribe la fila, marca los pendientes de esa
persona con `descontado_en` y escribe el movimiento del pago
([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§10](../docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas)). Pedirlos a mano dejaría que se descontaran dos veces, o ninguna.

**El salario acordado y las horas pactadas tampoco son campos:** salen de la ficha. Lo que sí es
campo es el recargo de la hora extra, y **no debería serlo**: el
[`06-nomina-y-capacidad-de-pago.md`](../docs/06-nomina-y-capacidad-de-pago.md) [§6.1](../docs/06-nomina-y-capacidad-de-pago.md#61-fórmulas) lo llama «configurable por empleada» y `empleados` no tiene columna
para él. Se decidió lo mínimo —viaja en la liquidación, con 25 % puesto, que es la cifra del ejemplo
del documento— y queda anotado en [`TODO.md`](../TODO.md) [§10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar).

**Al devengado solo entran el salario del período y el total de las horas extra.** Las dos tarifas
por hora que devuelve la respuesta —`valorHoraOrdinaria` y `valorHoraExtra`— son el precio de **una**
hora y no se suman: sumarlas da $1.366.019 donde el devengado es $1.350.784, que es el error que el
[§6.2](../docs/06-nomina-y-capacidad-de-pago.md#62-ejemplo-de-liquidación) señala con nombre propio.

### `simulacion` · el simulador de capacidad de pago

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `salarioTentativo` | Salario que evalúas | `dinero` | obligatorio · `minimo` 1 | obligatorio: «Escribe el salario que estás evaluando.» · minimo: «El salario tiene que ser mayor que cero.» | `teclado`: `numerico` |
| `reservaPct` | Reserva de seguridad | `numero` | `minimo` 0 · `maximo` 90 | minimo y maximo: «La reserva va entre 0 y 90 %.» | `teclado`: `numerico` · `ayuda`: «Cuánto de la utilidad no se compromete. Viene puesta 20 %.» |
| `horasMensuales` | Jornada | `numero` | `minimo` 0 | minimo: «La jornada no puede ser negativa.» | `teclado`: `numerico` · `ayuda`: «Las horas al mes de la persona que evalúas contratar. 192 es tiempo completo.» |
| `mesesDeHistoria` | Meses de historia | `numero` | `minimo` 1 · `maximo` 24 | minimo y maximo: «Los meses de historia van entre 1 y 24.» | `teclado`: `numerico` · `ayuda`: «Cuántos meses de utilidad se promedian. Vienen puestos 6.» |

**Es el primer descriptor que alimenta una lectura y no una escritura**, y por eso se dice aquí en
vez de dejarlo implícito. Los tres primeros son los controles que el mockup recalcula en vivo
([`10-ux-y-mockups.md`](../docs/10-ux-y-mockups.md) [§4.7](../docs/10-ux-y-mockups.md#47-nómina-solo-gerencia)); sus mínimos y sus máximos tienen que llegar de la API, porque si no los
decide el front ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)).

**Sin pro-labore definido no hay simulador**, y responde `40950` antes de pedir el formulario. No es
una cortesía: el cálculo que no descuenta el trabajo propio haría contratar al doble de lo
sostenible, que es la causa típica de contratar y quebrar al cuarto mes
([RN-09](../docs/03-requisitos-y-bdd.md#rn-09), [§3.2](../docs/06-nomina-y-capacidad-de-pago.md#32-por-qué-el-pro-labore-es-obligatorio-en-este-cálculo-rn-09)).

### `cotizacion` · lo que se le pasa al cliente antes del pedido

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `clienteId` | Cliente | `lista` | obligatorio | obligatorio: «Elige a quién va la cotización.» | `origen`: `/api/v0/consultas/clientes` |
| `fechaEmision` | Fecha | `fecha` | — | — | `ayuda`: «Cuándo se cotiza. Hoy viene puesta.» |
| `validaHasta` | Válida hasta | `fecha` | — | — | `ayuda`: «Hasta cuándo se sostiene el precio. Déjala vacía si no se comprometió.» |
| `anticipoPct` | Anticipo | `numero` | `minimo` 0 · `maximo` 100 | minimo y maximo: «El anticipo va entre 0 y 100 %.» | `teclado`: `numerico` · `ayuda`: «Qué porcentaje se le propone. Viene puesto 50 %.» |
| `notas` | Notas | `texto` | — | — | `ayuda`: «Lo que quieras que salga en el PDF: plazos, condiciones, lo que se acordó.» |

**Las líneas no están en el descriptor**, igual que en el formulario `pedido`: una lista de renglones
con producto, cantidad y precio no cabe en él ([`20-contrato-de-api.md`](../docs/20-contrato-de-api.md) [§4.4](../docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)). Son las mismas de un
pedido y comparten esquema, que es lo que hace que aceptarla no tenga que volver a digitar nada
([RF-40](../docs/03-requisitos-y-bdd.md#rf-40)). Sin líneas responde `42280`, y una validez anterior a la emisión, `42281`.

**El anticipo de aquí no se valida contra el costo**, y eso es otra pregunta: la responde
`POST /api/v0/consultas/anticipo-minimo`, que el cotizador consulta con cada línea que se agrega.
El 50 % **no siempre alcanza para pagar el material**: en un pedido de 35 % de margen faltan 15
puntos ([`05-reglas-financieras.md`](../docs/05-reglas-financieras.md) [§5.1](../docs/05-reglas-financieras.md#51-el-problema)).

### `respaldo` · generar un respaldo

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `alcance` | Qué se respalda | `lista` | obligatorio | obligatorio: «Elige qué quieres respaldar.» | `opciones`: `total` «Toda la base» · `mes` «Un mes» · `rango` «Un rango de fechas» · `tabla` «Una sola tabla» |
| `formato` | Formato | `lista` | obligatorio | obligatorio: «Elige en qué formato lo quieres.» | `opciones`: `csv_zip` «ZIP con un CSV por tabla» · `excel` «Excel, una hoja por tabla» · `json` «JSON, con todas las relaciones» · `ayuda`: «El CSV es el que se podrá abrir dentro de quince años sin ningún programa en particular.» |
| `anio` | Año | `numero` | `minimo` 2020 · `maximo` 2100 | minimo: «El año va de 2020 a 2100.» · maximo: «El año va de 2020 a 2100.» | `teclado`: `numerico` · `ayuda`: «Solo si el alcance es un mes.» |
| `mes` | Mes | `numero` | `minimo` 1 · `maximo` 12 | minimo: «El mes va de 1 a 12.» · maximo: «El mes va de 1 a 12.» | `teclado`: `numerico` · `ayuda`: «Solo si el alcance es un mes.» |
| `desde` | Desde | `fecha` | — | — | `ayuda`: «Solo si el alcance es un rango de fechas.» |
| `hasta` | Hasta | `fecha` | — | — | `ayuda`: «Solo si el alcance es un rango de fechas. Va con «Desde».» |
| `tabla` | Tabla | `lista` | — | — | `opciones`: `activos` «Activos» · `adelantos` «Adelantos» · `adjuntos` «Soportes y facturas» · `anticipos` «Anticipos» · `aportes_retiros` «Aportes y retiros» · `auditoria` «Auditoría» · `cargos` «Cargos» · `categorias` «Categorías» · `cierres_mensuales` «Cierres mensuales» · `clientes` «Clientes» · `costos_producto` «Costos de producto» · `cotizacion_lineas` «Líneas de las cotizaciones» · `cotizaciones` «Cotizaciones» · `cuentas` «Cuentas» · `empleados` «Empleadas» · `exportaciones` «Respaldos y descargas» · `horas_limite_config` «Límite de horas» · `movimientos` «Movimientos» · `nomina_detalle` «Liquidaciones de nómina» · `nomina_periodos` «Períodos de nómina» · `pedido_lineas` «Líneas de los pedidos» · `pedidos` «Pedidos» · `presentacion_tipos` «Cómo se ve cada tipo» · `productos` «Productos» · `prolabore_config` «Pro-labore» · `sobres_config` «Sobres» · `usuarios` «Usuarios» · `ayuda`: «Solo si el alcance es una sola tabla.» |

**Los cinco campos que dependen del alcance viajan sin `obligatorio`** y la pantalla los pinta siempre,
con su `ayuda` diciendo cuándo valen: el descriptor solo sabe decir `obligatorio`, `minimo` y
`maximo`, nunca «obligatorio si», y una regla condicional en el descriptor sería código en el front
([`20-contrato-de-api.md`](../docs/20-contrato-de-api.md) [§4.4](../docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)). Lo que no cuadra —un mes sin año o sin mes, un rango sin sus dos fechas o con
la primera después de la segunda, una tabla sin decir cuál— lo comprueba la API y responde `42272`,
con el aviso en `data.errores` sobre el campo que corresponde.

**Las 27 tablas de `tabla` son las del negocio**: todas las de la base menos cinco que son de
funcionamiento y no historia de nadie —`nonces_vistos`, `peticiones_idempotentes`, `sesiones`,
`schema_version` y `respaldo_programacion`—. El total las deja fuera por la misma razón. La
última no estaba cuando se acordó este contrato: la creó la tarea [8.14](../docs/08-plan-de-desarrollo.md#tarea-8-14), y la cuenta de 27 no
cambia, porque con ella la base pasó a tener 32 tablas. El archivo es **siempre un ZIP**, sea cual
sea el formato: el manifiesto es un archivo aparte ([13 §4](../docs/13-respaldo-y-exportacion.md#4-manifiesto-de-integridad)) y un Excel o un JSON suelto no
podría llevarlo.

### `programacion-de-respaldo` · cuándo se genera solo

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `modo` | Cuándo se genera solo | `lista` | obligatorio | obligatorio: «Elige cuándo quieres que se genere solo.» | `opciones`: `desactivada` «Nunca: lo genero yo» · `mensual` «El día 1 de cada mes, con el mes anterior» · `al_cerrar_el_mes` «Al cerrar cada mes (recomendada)» · `ayuda`: «Al cerrar el mes, el respaldo queda atado a un estado ya verificado y no a un momento cualquiera.» |

**Solo se pide donde la programación opera**, que es en prod ([13 §1.1](../docs/13-respaldo-y-exportacion.md#11-el-respaldo-es-por-ambiente-y-solo-uno-importa)): la consulta de la programación
trae `opera`, y con `false` la pantalla no pinta el bloque. Si alguien la manda igual a otro ambiente,
la API responde `40971` y no cambia nada. Todo lo demás cabe en el descriptor y responde `42200`.

### `filtro-de-auditoria` · lo que se mira en la auditoría

| `campo` | `etiqueta` | `tipo` | Reglas | `mensajes` | Lo demás |
|---|---|---|---|---|---|
| `desde` | Desde | `fecha` | — | — | — |
| `hasta` | Hasta | `fecha` | — | — | `ayuda`: «Va con «Desde».» |
| `personaId` | Persona | `lista` | — | — | `origen`: `/api/v0/consultas/usuarios` · `ayuda`: «También salen los intentos fallidos que tecleó su usuario.» |
| `tabla` | Qué se tocó | `lista` | — | — | `opciones`: `activos` «Activos» · `adelantos` «Adelantos» · `adjuntos` «Soportes y facturas» · `anticipos` «Anticipos» · `aportes_retiros` «Aportes y retiros» · `cargos` «Cargos» · `cierres_mensuales` «Cierres mensuales» · `costos_producto` «Costos de producto» · `cotizaciones` «Cotizaciones» · `empleados` «Empleadas» · `horas_limite_config` «Límite de horas» · `movimientos` «Movimientos» · `nomina_detalle` «Liquidaciones de nómina» · `pedidos` «Pedidos» · `presentacion_tipos` «Cómo se ve cada tipo» · `productos` «Productos» · `prolabore_config` «Pro-labore» · `sobres_config` «Sobres» · `usuarios` «Usuarios y accesos» |

Es el formulario de una consulta, como `simulacion`, y **ningún campo es obligatorio**: sin nada,
sale la primera página de toda la auditoría. Las dos fechas van juntas o no van, y la API lo juzga
con `42215`. Las 19 tablas son las que llevan el trigger de auditoría, y las 19 acciones son las que
admite `auditoria_accion_valida` en la base.

Desde el `0.36.0` **«Qué pasó» es `clase`**, de tipo `lista` y con tres opciones: `acceso`
«Accesos: ingresos, cierres e intentos fallidos», `usuarios` «Cambios sobre usuarios y cargos» y
`negocio` «Cambios sobre el resto del libro». Es como lo pregunta el mockup, y **a qué clase
pertenece una entrada lo decide la API**, por su acción y su tabla: no es una lista de acciones
escrita en la pantalla.

**`accion` sale del descriptor y no del contrato.** Sigue viajando en la consulta, con sus
diecinueve valores, para quien busque exactamente una; puesta junto a `clase`, lo que se pide es la
intersección. Pero no es una casilla del panel: el mockup no la dibuja, y las diecinueve en un
selector al lado de las tres clases preguntan dos veces lo mismo.

Las tablas que ofrece son **21**: las 19 de antes más `respaldo_programacion` y
`respaldo_pendiente`, que llevan trigger de auditoría desde el esquema `0.26.0` y el `0.27.0`.

### Los once formularios de motivo

Tienen un solo campo, `motivo`, de tipo `texto`, obligatorio y con `minimo` 5, que es lo que
exige el dominio `motivo` de la base ([`04-modelo-de-datos.md`](../docs/04-modelo-de-datos.md) [§4.1](../docs/04-modelo-de-datos.md#41-tipos-y-convenciones-comunes)). Lo que cambia es la etiqueta y
lo que dice cuando falta, que es el texto del mockup para cada caso:

| Formulario | `etiqueta` | `mensajes` |
|---|---|---|
| `desactivacion-de-usuario` | Motivo | obligatorio: «Escribe el motivo. Sin motivo escrito no se desactiva a nadie.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `reactivacion-de-usuario` | Motivo de la reactivación | obligatorio: «Escribe el motivo de la reactivación. Queda en la bitácora.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `desactivacion-de-cargo` | Motivo | obligatorio: «Escribe el motivo. Sin motivo escrito no sale ningún cargo del catálogo.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `desactivacion-de-producto` | Motivo | obligatorio: «Escribe el motivo. Sin motivo escrito no sale ningún producto del catálogo.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `reversion` | Motivo de la reversión | obligatorio: «Escribe el motivo de la reversión. Queda al lado del cambio que deshace.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `anulacion-de-pedido` | Motivo de la anulación | obligatorio: «Escribe el motivo. Nada se borra: el pedido queda con su motivo a la vista.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `anulacion-de-cliente` | Motivo de la anulación | obligatorio: «Escribe el motivo. Sus pedidos siguen enteros.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `anulacion-de-movimiento` | Motivo de la anulación | obligatorio: «Escribe el motivo. Sin motivo escrito no se anula ningún movimiento.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `anulacion-de-empleada` | Motivo de la anulación | obligatorio: «Escribe el motivo. La ficha queda con su motivo a la vista.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `anulacion-de-adelanto` | Motivo de la anulación | obligatorio: «Escribe el motivo. Se anula también el movimiento que lo registró.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |
| `anulacion-de-cotizacion` | Motivo de la anulación | obligatorio: «Escribe el motivo. Nada se borra: la cotización queda con su motivo a la vista.» · minimo: «El motivo tiene que explicar algo: escribe al menos 5 caracteres.» |

---

## Cómo se cambia

1. **Un solo PR, aquí**, con el `openapi.json` nuevo. Lo revisan los dos lados.
2. Al fusionarse, sube la versión del contrato con SemVer
   ([ADR-014](../docs/adr/ADR-014-semver.md)). Si rompe algo —un campo que desaparece, un tipo
   que cambia—, sube la MAJOR.
3. **Cada lado actualiza su copia cuando le conviene**, no el mismo día.
4. Mientras el cambio no esté fusionado, **no se implementa en ninguno de los dos lados**. Es lo
   que evita que cada equipo construya contra una idea distinta de lo mismo.

### Cómo se entera la API de que se desvió

`prisma_api` guarda una **copia fijada** de este archivo en `contrato/openapi.json` y la prueba
**[C-04](../docs/12-pruebas-y-calidad.md#c-04)** la compara, en cada compilación, con el documento que la API genera de sus propios
controladores. Si difieren, la compilación falla y dice en qué línea
([`12-pruebas-y-calidad.md`](../docs/12-pruebas-y-calidad.md) [§9.4](../docs/12-pruebas-y-calidad.md#94-c-04--el-openapi-versionado-es-el-que-sale-del-código)).

---

## Estado

| | |
|---|---|
| **Versión** | `0.19.0` |
| **Rutas** | Todas bajo `/api/v0`, y **ninguna usa GET** ([ADR-030](../docs/adr/ADR-030-contrato-sin-get.md)): las treinta y seis lecturas cuelgan de `/api/v0/consultas/…` y las cincuenta y tres escrituras, de su recurso. 89 operaciones en 89 rutas |
| **Códigos** | 81: los 10 genéricos, 9 en tres de los cuatro módulos que ya tenían contrato —sesión y transporte, usuarios y cargos, y pedidos y clientes—, 14 de movimientos y cuentas, 3 de productos y costeo, 6 de capital y patrimonio, 7 de nómina y adelantos, 5 de cotizaciones, 5 de exportación, importación y respaldo y 4 de reportes y cierres. **Ya no queda un solo rango sin códigos**: el `60`–`69` era el último, y lo estrena la [6.10](../docs/08-plan-de-desarrollo.md#tarea-6-10). Ninguno ha agotado un estado HTTP: el más lleno es movimientos y cuentas, con 8 casos de 422 de los 10 que le caben. 50 siguen marcados como pendientes de emitir |
| **Copia fijada en `prisma_api`** | Va en `0.16.0`, tres MINOR por detrás de esta, y sirve **veintiocho** de las 89 operaciones: la versión, el descriptor, la navegación, la bitácora y su reversión, las cuatro de `/sesiones`, las de `/usuarios` y `/cargos`, las cuentas y las categorías, el registro de un movimiento y **su soporte**, que entra con la [3.6](../docs/08-plan-de-desarrollo.md#tarea-3-6). Se queda en `0.16.0` **a propósito**: la API no implementa los reportes del `0.17.0`, así que declarar el `0.18.0` o el `0.19.0` afirmaría algo falso ([TODO §10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar)). **No declara que las implemente todas**: declara contra qué versión del contrato está escrita, y `0.2.0` dejó de existir el día en que sus dos rutas cambiaron de verbo y de ruta. Saltarse el número habría sido peor: dos contratos distintos con el mismo `0.2.0` |
| **Origen** | Las dos versiones se generaron del esqueleto de la API durante el [Sprint 0](../docs/08-plan-de-desarrollo.md#sprint-0) y se revisaron antes de fijarlas. De aquí en adelante el orden es el inverso: primero se acuerda aquí, después se implementa |

---

## Historial

| Versión | Qué cambió | Por qué |
|---|---|---|
| `0.37.0` | **El contrato dice Emprende, sin soltar los nombres de antes.** Se titula «Emprende · emprende_api»; declara `x-emprende-contrato` y `x-emprende-codigos` con lo mismo que `x-prisma-contrato` y `x-prisma-codigos`; las cabeceras del canal firmado se llaman `X-Emprende-Nonce`, `X-Emprende-Timestamp` y `X-Emprende-Firma`, y valen también las `X-Prisma-*`; la cookie es `emprende_renovacion`, y la API renueva también con la `prisma_renovacion` de las sesiones ya abiertas | HT [Emprende-App/Emprende#261](https://github.com/Emprende-App/Emprende/issues/261), fase 2 del renombre prisma → emprende autorizada por quien dirige el 2026-10-30. **Adición compatible**: un front que firma con `X-Prisma-*` y lee `x-prisma-codigos` sigue funcionando igual; retirar los nombres de antes sube el MAJOR del contrato, en la HT [#264](https://github.com/Emprende-App/Emprende/issues/264) |
| `0.36.0` | **La auditoría se lee en palabras, y «Qué pasó» son tres clases.** `EntradaDeAuditoria` gana `sobre`, obligatorio, y `detalle`: sobre qué fue y qué cambió, ya redactados y con los nombres de columna en español. `ConsultaDeAuditoria` gana `clase` —`acceso`, `usuarios` o `negocio`—, y el formulario `filtro-de-auditoria` la lleva con la etiqueta «Qué pasó», mientras `accion` sale del descriptor sin dejar de viajar en la consulta; la lista de tablas del formulario sube a 21 con las dos del respaldo | Decisión de quien dirige del 2026-10-18, que es la que el [`TODO.md`](../TODO.md) [§10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar) dejó abierta para antes de la [8.19](../docs/08-plan-de-desarrollo.md#tarea-8-19): Gerencia lee «Cargo: Domiciliaria → Asistente» y no un JSON, y quien redacta es la API ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)). Con eso el panel «Auditoría» queda como está dibujado en el mockup, cuyo selector pregunta por las tres clases y no por una de las diecinueve acciones. **Adición compatible**: ninguna de las 100 operaciones cambia de forma, `antes` y `despues` siguen viajando —quien revisa a fondo los necesita— y un campo nuevo obligatorio en una respuesta no rompe a nadie. Se descartó que el front compusiera las frases, que es el front decidiendo, y guardar la clase en una columna, que podría contradecir a la acción y a la tabla |
| `0.35.0` | **Un pedido enseña si está pagado, y no se entrega sin terminar de pagarse.** `Pedido` gana `condicionDePago` —`sin_pagar`, `parcial` o `pagado`— y las banderas `sePuedeCobrar`, `sePuedeEntregar` y `sePuedeCancelar`, las cuatro obligatorias. En `/pedidos/{id}/entrega`, `cuentaId` pasa a ser obligatoria cuando queda saldo, y el catálogo estrena el `42236` sobre ese campo. `Pendientes.cuentasPorCobrar` pasa a contar los pedidos sin entregar | Retroalimentación de Gerencia del 2026-10-16: la columna Estado no se podía tocar y no decía si el pedido estaba pagado, y entregar y cancelar no tenían por dónde. La condición de pago va **aparte del estado** porque responden preguntas distintas —el estado dice en qué punto va el trabajo— y así ningún valor del ENUM `estado_pedido` cambia de significado. Las tres banderas siguen el molde de `sePuedeAnular` ([CU-03](../docs/02-casos-de-uso.md#cu-03)): quién puede qué lo decide la API, no la pantalla ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)). **Rompe**, y en una versión `0.x` eso sube la MINOR: un pedido que antes se entregaba con saldo pendiente ahora se rechaza, lo que retira el [CU-07](../docs/02-casos-de-uso.md#cu-07) A1 y el `BDD-07-2`, así que el front y la API se publican juntos. Se descartó que la base impusiera la regla, que necesita otra tabla y dejaría dos versiones de una sola regla ([04 §10](../docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas)), y que el front mirara `estado` para decidir qué ofrece, que es el front decidiendo |
| `0.34.0` | **Se quita `pre-prod` del enum `ambiente`**, en `Version`, que queda `dev`, `qa`, `uat` y `prod` | El ambiente pre-prod se quitó y uat pasa a ser el que se despliega y en el que Gerencia aprueba ([ADR-053](../docs/adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)), así que ningún despliegue puede responder `pre-prod`. **Adición compatible aunque quite un valor**: es un enum de respuesta, no de petición, así que nada que un cliente mande deja de servir, y un front ya publicado que tenga la rama de `pre-prod` simplemente no la toma nunca. Se descartó dejarlo muerto en el contrato, que invita a configurarlo en un ambiente donde ya no significa nada |
| `0.33.0` | **Lo que el `0.30.0` dejó a medias fuera del catálogo.** `VentaAdicional` pierde `horas` y `SimulacionDeContratacion` pierde `horasRequeridas`, y el orden `margen_por_hora` del cuadro de productos pasa a llamarse `margen_en_pesos` | Las dos cifras de horas salían de los minutos por unidad del costeo, que el `0.30.0` dejó de pedir: sin ese dato no hay de dónde calcularlas, y una que ningún producto nuevo puede llenar se leería como que esas ventas no cuestan trabajo ([06 §4.2](../docs/06-nomina-y-capacidad-de-pago.md#42-resultado-para-el-faltante-de-556000)). Con ellas se retira la regla de que una meta por debajo del 20% de la jornada evaluada significaba que la restricción era la demanda. **Rompe**, y en una versión `0.x` eso sube la MINOR: dos esquemas cambian de forma y un valor de enumeración se renombra, así que el front y la API se publican juntos. Se descartó dejar `horas` en cero, que es una cifra inventada, y conservar el nombre `margen_por_hora` para un orden que ya ordena por pesos |
| `0.32.0` | Respaldo y auditoría completa: seis operaciones nuevas —cinco del respaldo, que son generarlo, bajarlo por partes, ver los guardados y cambiar y leer la programación, y `POST /api/v0/consultas/auditoria`—; catorce esquemas, entre ellos `NuevoRespaldo`, `Respaldo`, `ParteDeRespaldo` y `EntradaDeAuditoria`; tres formularios acordados, `respaldo`, `programacion-de-respaldo` y `filtro-de-auditoria`; y tres códigos: `42215`, que es para la auditoría lo que el `42227` es para el libro, `42272` y `40971`. `Seccion` nombra la clave `configuracion` | [RF-66](../docs/03-requisitos-y-bdd.md#rf-66), [RF-67](../docs/03-requisitos-y-bdd.md#rf-67) y [RF-05](../docs/03-requisitos-y-bdd.md#rf-05), [CU-22](../docs/02-casos-de-uso.md#cu-22) y [CU-23](../docs/02-casos-de-uso.md#cu-23), [BDD-22-1](../docs/03-requisitos-y-bdd.md#bdd-22-1), [BDD-22-2](../docs/03-requisitos-y-bdd.md#bdd-22-2), [BDD-23-1](../docs/03-requisitos-y-bdd.md#bdd-23-1), [BDD-23-2](../docs/03-requisitos-y-bdd.md#bdd-23-2) y [BDD-02-5](../docs/03-requisitos-y-bdd.md#bdd-02-5), [ADR-047](../docs/adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md), tarea [8.13](../docs/08-plan-de-desarrollo.md#tarea-8-13). **Adición compatible**: de las 94 operaciones del `0.31.1` no cambia ninguna de forma; solo se retoca la descripción de `Seccion.clave`. Como la 7.9, la 8.11 y la 6.10, **sale de los documentos y no de un dominio construido**. Lo que decide: que **un respaldo baja por partes**, porque uno total pasa de los 5 MB que caben en un `Documento` y el [13 §5.1](../docs/13-respaldo-y-exportacion.md#51-quién-arma-el-archivo-la-api) pide que el archivo salga de la API sin depender de la memoria del navegador; que **siempre es un ZIP**, porque el manifiesto es un archivo aparte; que **pedir la primera parte es lo que lo marca como bajado**, porque ahí empieza a salir del sistema; que **la programación dice si opera**, y programar donde no opera responde `40971` en vez de que la pantalla conozca el ambiente; que **el filtro de persona incluye los intentos fallidos que tecleó su usuario**, que es lo que el [BDD-23-2](../docs/03-requisitos-y-bdd.md#bdd-23-2) espera; que **la auditoría devuelve el antes y el después como la base los guarda**, sin traducir 19 tablas; que **no se respaldan las cuatro tablas de funcionamiento**; y que **`40072` queda libre**, porque ninguna operación lo necesita |
| `0.31.1` | **Lo que el `0.30.0` dejó a medias.** La tabla del formulario «producto» de este README todavía listaba `minutosTrabajo` y `minutosMaquina` y no `costoManoObra`, y `LecturaDeMargen` describía su título y su detalle con el margen por hora que ese mismo cambio retiró | Solo texto: ni un campo, ni una ruta, ni un código cambian de forma, así que el front y la API ya publicados siguen sirviendo. Se corrige donde estaba la contradicción, porque la tabla decía lo contrario del párrafo que va debajo de ella, y `medianaDelResto` ya decía «el margen en pesos» mientras el título seguía diciendo «por hora» |
| `0.31.0` | **Un solo medio de pago.** `ConsultaDeFormulario` gana `tipo`, la elección que cambia qué campos trae el formulario. En «movimiento», `cuentaId` pasa a llamarse «Medio de pago» y `cuentaDestinoId`, «A qué medio de pago llega»: **solo viaja cuando la consulta dice `transferencia`** | Retroalimentación de Gerencia del 2026-10-06: la pantalla de un gasto pedía una cuenta de destino para después avisar que sobraba. **Adición compatible**: `tipo` es opcional y una consulta que no lo manda recibe exactamente lo de antes, salvo las dos etiquetas. Quién decide qué campos aplican sigue siendo la API, y el front vuelve a pedir el formulario en vez de esconder nada por su cuenta ([20 §4.4](../docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)). Se descartó que el descriptor llevara la condición —«este campo solo aparece si otro vale esto»—, que es justo la regla entre dos campos que ese documento no admite, y esconderlo en el front, que sería el front decidiendo. **El destino sigue sin declararse obligatorio**, aunque en una transferencia lo sea: «obligatorio si» tampoco cabe en el descriptor, y esa exigencia la responde el `42226` del servidor, como hasta ahora |
| `0.30.0` | **El tiempo sale del contrato.** `minutosTrabajo` y `minutosMaquina` desaparecen del formulario «producto», del cuerpo de `POST /api/v0/consultas/costeo` y de la respuesta `Costeo`, y en su lugar entra `costoManoObra`, en pesos y obligatorio en el costeo guardado. `Margenes` pierde `porHora`, `CosteoCalculado` y `Prolabore` pierden `tarifaHora`, y se van la ruta `POST /api/v0/consultas/productividad` con sus tres esquemas y los códigos `40940`, `42240` y `42241` | Retroalimentación de Gerencia del 2026-10-06: el tiempo no tiene relevancia para el caso de uso y el margen es del producto, no de la hora. La mano de obra se escribe en pesos una vez por producto, que es el mismo dato sin pedir un cronómetro ([05 §7.1](../docs/05-reglas-financieras.md#71-costo-unitario), [05 §7.2](../docs/05-reglas-financieras.md#72-los-dos-márgenes)). **Rompe**, y en una versión `0.x` eso sube la MINOR: tres esquemas cambian de forma y una operación se va, así que el front y la API se publican juntos. Con el tiempo se retiran [RF-31](../docs/03-requisitos-y-bdd.md#rf-31), [RF-32](../docs/03-requisitos-y-bdd.md#rf-32) y [RF-62](../docs/03-requisitos-y-bdd.md#rf-62), y con ellos el [CU-10](../docs/02-casos-de-uso.md#cu-10) y el [CU-27](../docs/02-casos-de-uso.md#cu-27): las horas facturadas salían del tiempo por unidad y sin él no hay contra qué comparar las pagadas. Se descartó dejar los minutos guardados y solo no pedirlos, que deja un campo que nadie llena decidiendo un margen |
| `0.29.0` | `POST /api/v0/sesiones/administrador` y su formulario «primer-administrador», el esquema `PrimerAdministrador` y dos códigos: `40303`, que el ingreso responde con la credencial temporal del ambiente cuando no hay ninguna Gerencia, y `40903`, cuando ya la hay | Tarea [9.16](../docs/08-plan-de-desarrollo.md#tarea-9-16): una base sin semilla, como la de pre-prod, no tiene quién dé de alta a la primera Gerencia. La credencial temporal no es una cuenta: la API la compara en memoria y la base decide si todavía vale. La operación nueva va sin firma ni `Idempotency-Key`, como el ingreso. **Sube la MINOR**: una operación y dos códigos más, y el ingreso suma uno que antes no podía salir |
| `0.28.0` | El `ambiente` de la consulta de versión admite `pre-prod`, entre `uat` y `prod` | Tarea [9.14](../docs/08-plan-de-desarrollo.md#tarea-9-14) y [ADR-045](../docs/adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md): el último ambiente alojado se llama pre-prod, y `prod` se queda para el del taller, que corre la misma imagen. **Sube la MINOR**: un valor más en una respuesta, que el front ya sabe recibir porque lo desconocido lo trata como dev |
| `0.27.0` | Los dos códigos del registro de empleadas —`42250` y `42253`— dejan de estar marcados como pendientes de emitir | Tarea [8.1](../docs/08-plan-de-desarrollo.md#tarea-8-1): la API ya los emite. El `42250` lo ataja el caso de uso al retirar con una fecha anterior al ingreso, y el `42253` sale de `empleados_usuario_id_key` cuando dos fichas cuelgan del mismo usuario. **Sube la MINOR sin cambiar ninguna operación**, como el `0.14.0` y el `0.18.0`: las cinco rutas estaban acordadas y aquí solo empiezan a existir |
| `0.26.2` | Tres correcciones en las cotizaciones: `POST /api/v0/cotizaciones/{id}/aceptacion` declara `201` y no `200`, la descripción de `Idempotency-Key` en `POST /api/v0/consultas/cotizaciones` es la de las consultas, y `Cotizacion.fechaEmision` y `Cotizacion.lineas` pierden una `description` en `null` | Tarea [8.8](../docs/08-plan-de-desarrollo.md#tarea-8-8), la que implementa el cotizador. **Corrección de descripciones y de un código**: ninguna de las 94 operaciones cambia de forma. El `201` es lo que la operación siempre dijo en palabras —«Puede devolver 20100»— y el sobre manda sobre el número de al lado; un `200` ahí haría que el front generado esperara lo que la API no manda. La clave de la consulta es el mismo caso del `0.23.1`, que dejó dicho que cada consulta sin implementar se corrige cuando su tarea la construya. Y una `description` en `null` no es una descripción: ningún generador la escribe, así que se quita en vez de inventarle texto. Quedan trece `null` en esquemas de otras tareas del sprint 8, y cada una se quita con la suya |
| `0.26.1` | `registrarEmpleada` y `editarEmpleada` declaran el `42295`, y `horasMensuales` dice en `NuevaEmpleada` y en `EdicionDeEmpleada` que no pasa del máximo del mes. En la edición reemplaza una descripción que estaba en null | Tarea [8.1](../docs/08-plan-de-desarrollo.md#tarea-8-1), con [RN-20](../docs/03-requisitos-y-bdd.md#rn-20) detrás. **Solo descripciones**: el catálogo ya decía desde el `0.26.0` que el `42295` es «del pro-labore y de la empleada», pero las dos operaciones de la empleada no lo declaraban, y una API que validara las horas habría dejado la prueba del contrato en rojo |
| `0.26.0` | Dos operaciones del límite de horas de una semana —`POST /api/v0/consultas/limite-de-horas` y `PUT /api/v0/limite-de-horas/{id}`—, sus tres esquemas, dos códigos nuevos, el `42295` y el `42296`, y un `maximum` de 9.999,99 en `NuevoProlabore.horasMensuales` | Tarea [7.10](../docs/08-plan-de-desarrollo.md#tarea-7-10), con [RN-20](../docs/03-requisitos-y-bdd.md#rn-20) y el [05 §6.5](../docs/05-reglas-financieras.md#65-el-límite-de-horas-de-una-semana-rn-20) detrás. **Adición compatible**: ninguna operación cambia de forma, y el `maximum` declara lo que la columna ya rechazaba. **El límite lo define Gerencia y su valor por omisión es configuración del ambiente**, no un número del contrato: por eso la consulta trae `porOmision` en vez de devolver `data` en null, que diría que no hay límite cuando sí hay. **El `42295` es del pro-labore y de la empleada**, y el `42296` del límite mismo: un mensaje que dice «baja las horas» no sirve para quien está fijando el techo. Se descartó un `maximum` fijo de 744 horas, que sería una regla de negocio sin documento, y reusar el `42294`, que habla de decimales |
| `0.25.0` | Un campo, `ventasSobreElPuntoDeEquilibrio`, en `MesDelReporte`: lo que cada mes vendió por encima o por debajo del punto de equilibrio del año | Tarea [6.6](../docs/08-plan-de-desarrollo.md#tarea-6-6), con [RF-52](../docs/03-requisitos-y-bdd.md#rf-52) detrás. **Adición compatible**: ninguna operación cambia de forma y el campo es opcional. Es la última columna de la tabla mes a mes del mockup, «Contra el punto de equilibrio», y la fila «Ventas sobre el punto de equilibrio» del [05 §12.5](../docs/05-reglas-financieras.md#125-indicadores-del-mes). **La resta la hace la API** aunque sea una resta, porque el front no calcula cifras ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)). **Viaja ausente y no en cero** cuando el reporte no trae punto de equilibrio: sin margen de contribución positivo no hay listón, y un cero diría que el mes quedó justo en él. Se descartó un punto de equilibrio por mes, con los gastos fijos y el margen de cada uno, porque la pantalla enseña un solo listón en su panel y la columna se compararía contra uno distinto en cada fila |
| `0.24.0` | Un campo, `minutosMaquina`, en los tres sitios donde viaja un costeo: el formulario «producto», el cuerpo de `POST /api/v0/consultas/costeo` y la respuesta `Costeo`, donde es obligatorio. Y un código, el `42241`, para los minutos de máquina con más de dos decimales | Tarea [5.4](../docs/08-plan-de-desarrollo.md#tarea-5-4), con [RF-32](../docs/03-requisitos-y-bdd.md#rf-32) y el [CU-10](../docs/02-casos-de-uso.md#cu-10) detrás. **Adición compatible**: ninguna de las 92 operaciones cambia de forma, y el campo es opcional al escribir. **La columna existía desde el esquema inicial y no tenía regla**; se la puso [05 §7.1](../docs/05-reglas-financieras.md#71-costo-unitario): los minutos de máquina no le suman pesos al costo unitario —la tarifa por hora es un sueldo entre horas productivas, y la bordadora no cobra sueldo; su energía ya está entre los consumibles— y sí ocupan el taller, así que el margen por hora divide entre el mayor de los dos tiempos. Se descartó una tarifa de máquina propia, que pedía columna, panel e historial, y cobrar esos minutos a la tarifa de la persona, que contaría dos veces la hora que la persona dedica a otra cosa ([RN-17](../docs/03-requisitos-y-bdd.md#rn-17)). **El `42241` es código nuevo y no el `42240`** porque los dos tiempos son dos campos del mismo formulario, y con uno solo el mensaje no podría decir cuál revisar |
| `0.23.1` | La descripción de `Idempotency-Key` en `POST /api/v0/consultas/pedidos`, que ahora dice lo que dicen las otras veintiuna consultas: la clave es nueva en cada consulta, y solo el reintento de esa misma consulta la reutiliza | Tarea [4.6](../docs/08-plan-de-desarrollo.md#tarea-4-6). **Corrección de descripción**: ninguna de las 92 operaciones cambia de forma, y el front no tiene que cambiar nada. La operación se acordó en el `0.10.0`, **antes de que el [ADR-030](../docs/adr/ADR-030-contrato-sin-get.md) llevara las lecturas a `POST`** y de que el texto distinguiera leer de escribir, así que se quedó con el de escribir. La API lo genera según la ruta, de modo que al implementar la consulta [C-04](../docs/12-pruebas-y-calidad.md#c-04) enseñó la diferencia. Quedan catorce consultas acordadas y sin implementar con el texto viejo, y cada una se corrige cuando su tarea la construya |
| `0.23.0` | Una operación: `POST /api/v0/pedidos/{id}/adjuntos`, que le cuelga la factura a un pedido con el mismo cuerpo que el soporte de un movimiento. Y un campo: `Pedido.adjuntos`, obligatorio y vacío cuando no tiene, con el que la pantalla sabe cuáles hay y con qué id bajar cada una. El esquema `Adjunto`, la consulta `POST /api/v0/consultas/soporte` y el «cuando» de los códigos `40020` y `40021` dejan de hablar solo del movimiento | Tarea [4.8](../docs/08-plan-de-desarrollo.md#tarea-4-8), con [RF-27](../docs/03-requisitos-y-bdd.md#rf-27) y el [CU-05](../docs/02-casos-de-uso.md#cu-05) detrás. **Adición compatible**: de las 91 operaciones del `0.22.0` no cambia ninguna de forma, y quedan 92. **La tabla ya tenía las dos flechas** desde la [3.14](../docs/08-plan-de-desarrollo.md#tarea-3-14) —`adjunto_cuelga_de_una_sola_cosa` exige exactamente una ([04 §4.12](../docs/04-modelo-de-datos.md#412-adjuntos--el-soporte-de-un-movimiento-o-de-un-pedido))—, así que lo que faltaba era la ruta que llenara la del pedido. **No estrena ningún código**: el techo y los cuatro tipos no dependen de quién es el padre, y un pedido que no existe es el `40400` que produce la llave foránea. Se descartó una ruta genérica `/api/v0/adjuntos` con el padre en el cuerpo, que dejaría el id del pedido fuera de la ruta y rompería el molde de todo el contrato; y devolver las facturas en una consulta propia, que sería una ida más a la base para pintar la misma fila |
| `0.22.0` | Una consulta: `POST /api/v0/consultas/resumen-de-pedido`, que devuelve el valor del pedido, el anticipo al confirmar y el saldo contra entrega de unos renglones, sin escribir nada. Con ella, `ConsultaDeResumenDePedido`, `ResumenDePedido` y su sobre. Y los dos códigos del registro —`42231` y `42232`— **dejan de estar marcados como pendientes de emitir** | Tarea [4.3](../docs/08-plan-de-desarrollo.md#tarea-4-3), con [RF-19](../docs/03-requisitos-y-bdd.md#rf-19) y el [CU-05](../docs/02-casos-de-uso.md#cu-05) detrás. **Adición compatible**: ninguna de las 86 operaciones cambia de forma. **Sin ella el formulario de pedido no se podía pintar como está dibujado**: el mockup enseña el valor, el anticipo y el saldo mientras se capturan los renglones, y el front no multiplica precio por cantidad ni saca porcentajes ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)) —por eso `registrarPedido` tampoco recibe el valor total—. El molde es `consultas/division-de-retiro`, que también calcula y no escribe. Juzga las líneas con la misma regla que el registro, así que lo que la consulta acepta es lo que el registro escribe, y lo que rechaza trae el mismo `42231` sobre el mismo campo. Se descartó devolver las cifras dentro del descriptor del formulario, que las volvería reglas de pintado, y calcularlas en el front |
| `0.21.0` | Un campo: `Navegacion.puedeAnularClientes`, obligatorio, que dice si el panel «Clientes del taller» de Pedidos lleva «Anular» en cada cliente | Tarea [4.2](../docs/08-plan-de-desarrollo.md#tarea-4-2), con [RN-13](../docs/03-requisitos-y-bdd.md#rn-13) y el [10 §4.2](../docs/10-ux-y-mockups.md) detrás. **Adición compatible**: ninguna de las 86 operaciones cambia de forma. Es el caso idéntico que el `0.16.0` resolvió con `puedeGestionarCuentas`, y se calcula igual —cae a `false` en la vista previa—. **Sin él la [4.2](../docs/08-plan-de-desarrollo.md#tarea-4-2) no se podía cerrar**: el panel existía en el front y recibía `puedeAnular` de quien lo montara, y no había de dónde sacarlo. Se descartó reusar `puedeGestionarCuentas`, que hoy vale lo mismo, porque ataría dos permisos sin relación y el día que uno cambiara el otro se rompería en silencio; y mirar el tipo de la sesión en el front, que es decidir un permiso ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)). Ocultar el botón no protege nada: quien intente anular sin ser Gerencia se topa con `clientes_actualizacion` en PostgreSQL ([ADR-006](../docs/adr/ADR-006-rls-por-rol.md)) |
| `0.19.0` | El libro que dibujó el mockup: tres operaciones nuevas —leer y cambiar cómo se ve cada tipo, y bajar el soporte de un movimiento—; nueve esquemas, entre ellos `PresentacionDeMovimiento`, `PresentacionDeTipo`, `EfectoDeTipo` y `RegistroHermano`; la consulta del libro con `grupo` y `pagina`, y su página con el mes en curso, el máximo por página y las dos banderas de Gerencia; cada `Movimiento` con su presentación, su registro hermano y si se deja anular; el `Documento` con los tres tipos de foto; el formulario `presentacion-de-tipo`, y cinco códigos: los cuatro rechazos de la anulación, `40920` a `40923`, que estrenan el 409 de movimientos, y el rango de fechas que no se puede pedir, `42227`. El `40960` se amplía a la anulación de un mes cerrado | Tarea [3.17](../docs/08-plan-de-desarrollo.md#tarea-3-17), con [RF-104](../docs/03-requisitos-y-bdd.md#rf-104) y el [CU-03](../docs/02-casos-de-uso.md#cu-03) detrás. **Adición compatible**, con dos cambios de comportamiento que ninguna pantalla usa todavía: la consulta del libro sin `limite` ya no trae todo sino el máximo por página, y el rango pide las dos fechas o ninguna. La pantalla del libro es la mitad Front de la 3.8, que no está hecha, así que nadie dependía de ninguno de los dos. **Qué se anula con qué lo propuso este contrato y lo aprobó quien dirige**, y está escrito en el [CU-03](../docs/02-casos-de-uso.md#cu-03): el anticipo de un pedido en proceso, un activo, un aporte y un adelanto sin descontar se anulan con su movimiento; un retiro partido se anula entero; y el anticipo de un pedido cerrado, la venta de una entrega, un adelanto ya descontado y el pago de una nómina no se anulan, y se corrigen con contra-asiento. Por eso son 409 y no 422: no es un dato mal escrito, es el estado del registro. La presentación viaja en cada fila y no una vez por página, para que el front no cruce nada; y `limite` pasa a ser el tamaño de página en vez de estrenar un campo |
| `0.18.0` | Ningún campo y ninguna operación nueva: los dos códigos del adjunto —`40020`, el archivo que pasa de 5 MB, y `40021`, el que no es foto ni PDF— **dejan de estar marcados como pendientes de emitir**, y la descripción de `POST /api/v0/movimientos/{id}/adjuntos` dice ahora de dónde sale el id del adjunto | Tarea [3.6](../docs/08-plan-de-desarrollo.md#tarea-3-6), la que sube el primer archivo. **Adición compatible**: de las 86 operaciones no cambia ninguna de forma. Lo que la implementación tuvo que decidir y el contrato no decía: **el id del adjunto es la clave de idempotencia de la petición**, porque el [04 §4.12](../docs/04-modelo-de-datos.md#412-adjuntos--el-soporte-de-un-movimiento-o-de-un-pedido) manda que lo ponga quien pide ([ADR-020](../docs/adr/ADR-020-idempotencia.md)) y el cuerpo, que es una sola parte binaria, no tiene dónde traerlo. Queda escrito en la descripción para que los dos lados lo lean en el mismo sitio |
| `0.17.0` | Reportes, indicadores, alertas y cierre mensual: seis operaciones nuevas —el tablero del Inicio, el reporte del año, los meses cerrados, la descarga en CSV o PDF, el cierre de un mes y los saldos por cuenta—; veintiún esquemas, entre ellos `Tablero`, `Reporte`, `CierreMensual` y `Alerta`; y cinco códigos: cuatro que **estrenan el rango `60`–`69`**, el último que quedaba sin usar, y el `40990` del aviso de caja libre, que va en el de capital | [RF-41](../docs/03-requisitos-y-bdd.md#rf-41) a [RF-44](../docs/03-requisitos-y-bdd.md#rf-44), [RF-52](../docs/03-requisitos-y-bdd.md#rf-52), [RF-53](../docs/03-requisitos-y-bdd.md#rf-53), [RF-95](../docs/03-requisitos-y-bdd.md#rf-95) y [RF-96](../docs/03-requisitos-y-bdd.md#rf-96), [RN-16](../docs/03-requisitos-y-bdd.md#rn-16), [CU-13](../docs/02-casos-de-uso.md#cu-13), [CU-14](../docs/02-casos-de-uso.md#cu-14) y [CU-37](../docs/02-casos-de-uso.md#cu-37), tarea [6.10](../docs/08-plan-de-desarrollo.md#tarea-6-10), **la última del trabajo del contrato**. **Adición compatible**: de las 80 operaciones del `0.16.0` no cambia ninguna de forma; se tocan cuatro descripciones y tres esquemas —`Documento` gana `text/csv` en `tipo`, `DivisionDeRetiro` gana la caja libre y su lectura, y `NuevoRetiro` gana `confirmado`, que es opcional—. Como la [7.9](../docs/08-plan-de-desarrollo.md#tarea-7-9) y la [8.11](../docs/08-plan-de-desarrollo.md#tarea-8-11), **sale de los documentos y no de un dominio construido**. Lo que decide: que **el Inicio es una sola consulta y no seis**, porque ninguna de sus siete zonas se explica sola y juntarlas sería que el front decidiera ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)); que **las alertas viajan dentro de ella** y no en una ruta propia, porque no se pintan en ninguna otra pantalla; que **el promedio de ganancias y el punto de equilibrio faltan en vez de valer cero** cuando no hay meses cerrados o el margen de contribución no es positivo, con una `Lectura` que lo explica, como ya hace `tasaDeRetiro`; que **cerrar un mes no manda cifras**, solo el período, porque el snapshot es inmutable ([RN-16](../docs/03-requisitos-y-bdd.md#rn-16)); que **el aviso de caja libre del retiro lo impone la API** con el `40990` y un `confirmado`, y no la pantalla; y que **el saldo por cuenta entra aquí** aunque sea del rango de movimientos, porque el `0.11.0` prometió esa consulta, la [3.12](../docs/08-plan-de-desarrollo.md#tarea-3-12) no depende de ninguna tarea de contrato y esta es la última que podía escribirla |
| `0.16.0` | Un campo: `Navegacion.puedeGestionarCuentas`, obligatorio, que dice si Movimientos lleva el panel «Cuentas de dinero». Y los tres códigos del alta de categorías —`42220`, `42221` y `42222`— dejan de estar marcados como pendientes de emitir | Tarea [1.10](../docs/08-plan-de-desarrollo.md#tarea-1-10). El panel es **exclusivo de Gerencia** ([RF-97](../docs/03-requisitos-y-bdd.md#rf-97), [10 §4.3](../docs/10-ux-y-mockups.md)) y el front no puede deducir de su propio tipo si lo pinta, porque eso es decidir un permiso ([ADR-018](../docs/adr/ADR-018-front-sin-decisiones.md)): el contrato ya había resuelto el caso idéntico de «Gestión de usuarios» con `puedeGestionarUsuarios`, y este campo se calcula igual —cae a `false` en la vista previa—. **Adición compatible**: ninguna de las 80 operaciones cambia de forma. Ocultar el panel no protege nada, y no pretende hacerlo: quien intente crear sin ser Gerencia se topa con `cuentas_escritura` en PostgreSQL ([ADR-006](../docs/adr/ADR-006-rls-por-rol.md)) |
| `0.15.0` | Nómina, simulador, cotizaciones e importación: 25 operaciones nuevas —dieciséis de nómina: cuatro de empleadas, tres de adelantos, tres de períodos y liquidación y seis consultas, entre ellas el desprendible, el simulador y la productividad; siete de cotizaciones, con su PDF, la remisión y el anticipo mínimo; y dos de importación—; 46 esquemas, entre ellos `Documento`, que es **cómo baja un archivo**; ocho formularios nuevos y tres de motivo, con lo que `Motivo` pasa de ocho a once; y 17 códigos que estrenan a la vez los tres rangos que quedaban vacíos: `50`–`59` de nómina, `80`–`89` de cotizaciones y `70`–`79`, que pasa a ser de exportación, **importación** y respaldo | [RF-36](../docs/03-requisitos-y-bdd.md#rf-36) a [RF-40](../docs/03-requisitos-y-bdd.md#rf-40) y [RF-54](../docs/03-requisitos-y-bdd.md#rf-54) a [RF-65](../docs/03-requisitos-y-bdd.md#rf-65), [CU-11](../docs/02-casos-de-uso.md#cu-11), [CU-12](../docs/02-casos-de-uso.md#cu-12), [CU-18](../docs/02-casos-de-uso.md#cu-18) a [CU-21](../docs/02-casos-de-uso.md#cu-21), [CU-26](../docs/02-casos-de-uso.md#cu-26) y [CU-27](../docs/02-casos-de-uso.md#cu-27), tarea [8.11](../docs/08-plan-de-desarrollo.md#tarea-8-11). **Adición compatible**: ninguna de las 55 operaciones de `0.14.0` cambia de forma, y lo único que se toca de ellas son dos descripciones —la de `Motivo`, que pasa a nombrar once formularios, y la del adjunto, que ya no dice que devolver el archivo esté sin acordar—. Como la [7.9](../docs/08-plan-de-desarrollo.md#tarea-7-9), **no transcribe un dominio construido**: sale de los documentos. Lo que decide: que **un archivo baja dentro del sobre, en base64 y con tope de 5 MB**, para que ninguna ruta tenga dos formas de contestar; que **el importador no guarda historial** y por eso no necesita la tabla `importaciones` que la matriz del [03](../docs/03-requisitos-y-bdd.md) nombra y ningún documento define; que **el recargo de hora extra viaja en la liquidación** porque `empleados` no tiene columna para él; que **el anticipo mínimo es una consulta** y no un campo de otra respuesta, como `consultas/costeo`; que **la remisión cuelga del pedido** y no de la cotización; y que **el simulador sin pro-labore responde `40950` también a Operación**, porque es lo que la base produce y la API no vuelve a decidir un permiso ([ADR-006](../docs/adr/ADR-006-rls-por-rol.md)) |
| `0.14.0` | Los cuatro códigos de movimientos —`42223`, `42224`, `42225` y `42226`— dejan de estar marcados como pendientes de emitir | Tarea [3.4](../docs/08-plan-de-desarrollo.md#tarea-3-4): `PUT /api/v0/movimientos/{id}` ya los emite. Los dos primeros y el último los ataja el dominio antes de escribir, y los cuatro los vuelve a juzgar PostgreSQL —el `CHECK fecha_no_futura` y las tres llaves foráneas de `movimientos`—, así que un `INSERT` que se saltara la API sale con el mismo código y sobre el mismo campo ([ADR-015](../docs/adr/ADR-015-validacion-tres-capas.md)). **Sube la MINOR sin cambiar ninguna operación**, como el `0.6.0` y el `0.8.0`: la ruta estaba acordada desde el `0.11.0` y aquí solo empieza a existir |
| `0.13.0` | Capital: `PUT /api/v0/activos/{id}`, `/aportes/{id}`, `/retiros/{id}`, `/prolabore/{id}` y `/sobres/{id}`, y cinco consultas —los activos, la división de un retiro, el pro-labore y los sobres vigentes, y el patrimonio—; veintitrés esquemas, los formularios `activo`, `aporte`, `retiro`, `prolabore` y `sobres`, y cinco códigos —`42290` a `42294`— en el rango `90`–`99`, que estaba reservado y pasa a ser de capital y patrimonio | [RF-45](../docs/03-requisitos-y-bdd.md#rf-45) a [RF-51](../docs/03-requisitos-y-bdd.md#rf-51), [CU-15](../docs/02-casos-de-uso.md#cu-15), [CU-16](../docs/02-casos-de-uso.md#cu-16), [CU-17](../docs/02-casos-de-uso.md#cu-17), [CU-24](../docs/02-casos-de-uso.md#cu-24) y [CU-25](../docs/02-casos-de-uso.md#cu-25), tarea [7.9](../docs/08-plan-de-desarrollo.md#tarea-7-9). **Adición compatible**: nada de `0.12.0` cambia de forma. A diferencia del `0.12.0`, aquí no había dominio que transcribir y el contrato sale de los documentos. Lo que decide: **cómo se parte un retiro cuando no se dice** —pro-labore hasta completar el del mes, y el resto distribución—; que el pro-labore y los sobres **se definen desde el día en que se guardan**, sin editar la definición anterior; que **una inversión puede entrar sin cuenta**, que es como entran los equipos que el taller ya tenía el día del corte; y que Capital tiene **rango propio** en vez de apretarse en el de movimientos |
| `0.12.0` | Productos y costeo: `PUT /api/v0/productos/{id}`, su edición, su desactivación y su reactivación, `POST /api/v0/consultas/productos` y `POST /api/v0/consultas/costeo`; once esquemas, los formularios `producto` y `desactivacion-de-producto`, el tipo `numero` en el descriptor y dos códigos —`40940` y `42240`— que estrenan el rango `40`–`49` | [RF-28](../docs/03-requisitos-y-bdd.md#rf-28) a [RF-35](../docs/03-requisitos-y-bdd.md#rf-35) y [BDD-02-2](../docs/03-requisitos-y-bdd.md#bdd-02-2), tarea [5.10](../docs/08-plan-de-desarrollo.md#tarea-5-10). **Adición compatible**: nada de `0.11.0` cambia de forma; el descriptor gana un tipo —como ganó `casilla` en el `0.3.0` y `clave` en el `0.4.0`—, el esquema `Motivo` pasa de siete formularios a ocho, y el `porcentaje` que el `0.10.0` le puso a `anticipoPct` en este README pasa a `numero`, que es el tipo que sí existe. El contrato casi no decide: transcribe el dominio que ya construyeron la [5.1](../docs/08-plan-de-desarrollo.md#tarea-5-1), la [5.3](../docs/08-plan-de-desarrollo.md#tarea-5-3) y la [5.6](../docs/08-plan-de-desarrollo.md#tarea-5-6). Lo que sí decide es que **a Operación no le llegan ni el costo ni los márgenes ni los minutos**, porque `costos_producto` lleva RLS y PostgreSQL no le devuelve esas filas ([ADR-006](../docs/adr/ADR-006-rls-por-rol.md)) |
| `0.11.0` | Movimientos: `PUT /api/v0/movimientos/{id}`, su anulación, su adjunto y `POST /api/v0/consultas/movimientos`; ocho esquemas, el formulario `movimiento`, el séptimo de motivo y seis códigos —`40020`, `40021` y `42223` a `42226`— | Tarea [3.13](../docs/08-plan-de-desarrollo.md#tarea-3-13), con [RF-08](../docs/03-requisitos-y-bdd.md#rf-08) a [RF-16](../docs/03-requisitos-y-bdd.md#rf-16) detrás. **Adición compatible**: nada de `0.10.0` cambia de forma, y solo se amplía la descripción del esquema `Motivo`, que ya servía a seis formularios y ahora a siete. El registro reutiliza lo que el `0.10.0` acababa de fijar: `PUT` al id que genera quien pide ([ADR-020](../docs/adr/ADR-020-idempotencia.md)), el mismo dos veces responde `40900`, la anulación cuelga del recurso con el esquema `Motivo`, y `Anulacion` se comparte en vez de repetirse |
| `0.10.0` | Clientes, pedidos y anticipos: 9 operaciones nuevas, 14 esquemas, los formularios `cliente`, `pedido`, `anticipo`, `entrega` y `cancelacion`, los dos de motivo, y 9 códigos en el rango `30`–`39`, que esta versión estrena. Todos van marcados como pendientes de emitir | [RF-18](../docs/03-requisitos-y-bdd.md#rf-18) a [RF-26](../docs/03-requisitos-y-bdd.md#rf-26), [RN-05](../docs/03-requisitos-y-bdd.md#rn-05), [RN-06](../docs/03-requisitos-y-bdd.md#rn-06) y [RN-13](../docs/03-requisitos-y-bdd.md#rn-13), tarea [4.10](../docs/08-plan-de-desarrollo.md#tarea-4-10). **Adición compatible**: un cliente de `0.9.0` no encuentra nada suyo cambiado, así que sube la MINOR. Es el mismo caso que `0.3.0` |
| `0.9.0` | El décimo código base, `50300`, para cuando un servicio del que la API depende no contesta o le falta una variable | Arreglo del alta de usuarios. Antes ese fallo salía como `50000`, «Algo salió mal. Intenta de nuevo en un momento», que era falso en las dos mitades: no había pasado nada imprevisto y reintentar no arreglaba nada. **Sube la MINOR sin cambiar ninguna operación**, como el `0.6.0` y el `0.8.0`. La fila se escribió tarde, con la [4.10](../docs/08-plan-de-desarrollo.md#tarea-4-10): el encabezado y el `openapi.json` ya iban en `0.9.0` y este historial no lo decía |
| `0.8.0` | Cuatro códigos de usuarios —`40910`, `42211`, `42212` y `42213`— dejan de estar marcados como pendientes de emitir | Tarea [2.7](../docs/08-plan-de-desarrollo.md#tarea-2-7): la gestión de usuarios ya los emite, y los cuatro los decide la base —el `UNIQUE` del usuario, su `CHECK` de formato, la llave foránea del cargo y el trigger de la última Gerencia—. **Sube la MINOR sin cambiar ninguna operación**, como el `0.6.0`: las seis rutas de `/usuarios` estaban acordadas desde el `0.4.0` y aquí solo empiezan a existir |
| `0.7.0` | La cookie `prisma_renovacion` pasa a `SameSite=None` y `Path=/api/v0/sesiones`, se declara **opcional** en la renovación, y `40302` y `42210` dejan de estar pendientes de emitir | Tarea [2.2](../docs/08-plan-de-desarrollo.md#tarea-2-2). El front y la API viven en dominios distintos desde [ADR-032](../docs/adr/ADR-032-railway-en-dev-ahora.md), y con `Strict` el navegador no manda la cookie nunca; el `Path` se escribió antes de que [ADR-030](../docs/adr/ADR-030-contrato-sin-get.md) pusiera el prefijo, así que no alcanzaba ninguna ruta real. La cookie es opcional porque **sin ella la respuesta es `40100` y no un `400`**: quien abre la aplicación por primera vez no armó mal la petición, es que todavía no ha entrado. **Sube la MINOR sin cambiar ninguna operación**: la prueba [C-04](../docs/12-pruebas-y-calidad.md#c-04) trata la descripción de una cabecera como cambio de contrato igual |
| `0.6.0` | Los tres códigos del canal firmado —`40101`, `40102` y `40103`— dejan de estar marcados como pendientes de emitir | Tarea [2.13](../docs/08-plan-de-desarrollo.md#tarea-2-13): el filtro de firma ya los emite. **Sube la MINOR sin cambiar ninguna operación**, porque `pendienteDeEmitir` es lo que le dice al front qué códigos puede esperar ya |
| `0.5.0` | **Ninguna operación usa GET.** Las nueve lecturas pasan a `POST /api/v0/consultas/…` con su cuerpo, las diecisiete escrituras ganan el prefijo `/api/v0`, y `Idempotency-Key` pasa a ser obligatoria también al leer. Tres esquemas nuevos: `ConsultaDeBitacora`, `ConsultaDeFormulario` y `ConsultaDeNavegacion` | [ADR-030](../docs/adr/ADR-030-contrato-sin-get.md). **Sube la MINOR aunque rompe todo lo anterior**, por el mismo motivo que `0.4.0`: antes del go-live todo es `0.y.z` ([ADR-014](../docs/adr/ADR-014-semver.md)) y esta vez los dos lados cambian en el mismo día, no cada uno a su ritmo. Es el primer cambio de contrato que invalida algo ya construido: `prisma_api` servía dos rutas y `prisma_front` las consumía |
| `0.4.0` | Acceso, navegación, usuarios, cargos y bitácora: 20 operaciones nuevas, los formularios `acceso`, `cambio-de-clave`, `usuario`, `edicion-de-usuario`, `clave-temporal`, `cargo` y los cuatro de motivo, y 12 códigos. El canal firmado entra en cada operación con sesión, también en las de cuentas y categorías, y el descriptor gana el tipo `clave` | [RF-01](../docs/03-requisitos-y-bdd.md#rf-01) a [RF-05](../docs/03-requisitos-y-bdd.md#rf-05), [RF-71](../docs/03-requisitos-y-bdd.md#rf-71) a [RF-94](../docs/03-requisitos-y-bdd.md#rf-94), [RF-103](../docs/03-requisitos-y-bdd.md#rf-103) y [RNF-29](../docs/03-requisitos-y-bdd.md#rnf-29), tarea [2.19](../docs/08-plan-de-desarrollo.md#tarea-2-19). **Sube la MINOR aunque no es del todo compatible**: las cabeceras de firma pasan a ser obligatorias en cuatro operaciones de `0.3.0` y la lista de tipos del descriptor crece. Antes del go-live todo es `0.y.z` ([ADR-014](../docs/adr/ADR-014-semver.md)), y ningún lado había construido todavía esas cuatro operaciones |
| `0.3.0` | Cuentas y categorías: `GET` y `POST` de `/cuentas` y `/categorias`, sus esquemas, los formularios `cuenta` y `categoria`, y los códigos `42220` a `42222`. En el descriptor, `opciones` y `origen` para las listas y el tipo `casilla` | [RF-06](../docs/03-requisitos-y-bdd.md#rf-06), [RF-17](../docs/03-requisitos-y-bdd.md#rf-17) y [RF-97](../docs/03-requisitos-y-bdd.md#rf-97), tarea [1.17](../docs/08-plan-de-desarrollo.md#tarea-1-17). **Adición compatible**: un cliente de `0.2.0` no encuentra nada suyo cambiado, así que sube la MINOR |
| `0.2.0` | `GET /formularios/{nombre}` y los tres esquemas del descriptor | [RF-102](../docs/03-requisitos-y-bdd.md#rf-102), tarea [0.17](../docs/08-plan-de-desarrollo.md#tarea-0-17). Es una **adición compatible**: nada de `0.1.0` cambió, así que sube la MINOR |
| `0.1.0` | Primera versión: `GET /version`, el sobre y el catálogo de 15 códigos | Cierre de la 0.18 |

> **Cómo nació `0.2.0`, dicho con honestidad:** igual que `0.1.0`, se generó desde la implementación
> del [Sprint 0](../docs/08-plan-de-desarrollo.md#sprint-0) y se revisó antes de fijarla. No pasó por el PR revisado por los dos lados que pide
> este mismo documento, porque todavía no hay dos tareas a la vez trabajando. El primer cambio de contrato
> con el desarrollo en marcha tiene que ir por ese camino.

> **`0.3.0` es la primera que se acordó antes de implementarse**, como pide este documento: no hay
> todavía una línea de `prisma_api` que la sirva. Trabajando de una en una, «revisado por los dos lados»
> quiere decir revisado por quien dirige el proyecto, que tiene las decisiones de construcción en
> [`TODO.md`](../TODO.md) [§10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar).

> **Queda una decisión abierta**, y bloquea el primer cambio de contrato, no este archivo: si cada
> lado consume el contrato **por etiqueta de git** o **como paquete publicado**
> ([`21-trabajo-en-paralelo.md`](../docs/21-trabajo-en-paralelo.md) [§8](../docs/21-trabajo-en-paralelo.md#8-qué-hay-que-decidir-antes-de-trabajar-dos-tareas-a-la-vez), punto 3). Hasta decidirlo, la
> copia fijada de cada lado se actualiza copiando el archivo de una versión fusionada.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** ningún otro documento lo cita todavía.
<!-- /generado:referenciado-desde -->
