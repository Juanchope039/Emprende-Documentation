# Tareas de PRISMA

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [9.83.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/TODO.md "Historial de cambios") | [🔄 Vivo](docs/22-documentacion.md#estados) | 2026-09-16 | 2026-10-25 | [Plan](docs/INDICE.md#etiqueta-plan) · [Paralelo](docs/INDICE.md#etiqueta-paralelo) |

Lo hecho y lo pendiente, con los números de tarea del
[plan de desarrollo](docs/08-plan-de-desarrollo.md). El plan dice **qué** hay que hacer, **en qué
vive** y **de qué depende**; este archivo dice **en qué va**. Si discrepan sobre qué hay que
hacer, manda el plan.

| Marca | Significa | Quién la pone |
|---|---|---|
| `[x]` | **Hecha** y verificada: pruebas en verde y commit en `develop` | Quien la termina |
| 🚧 | **En progreso:** alguien la tiene en las manos ahora | Quien la toma |
| ⚡ | **Puede empezar hoy:** todo lo que necesita ya está hecho | La herramienta, del plan |
| 🔒 | Espera a otra tarea que todavía no está hecha | La herramienta, del plan |
| ✏️ | Escrita pero sin verificar: SQL que todavía no corrió contra ninguna base | Quien la escribe |
| ⏭️ | Movida a otro sprint | La herramienta, del plan |

Cada tarea dice su **Dónde**: **API** (`prisma_api`), **Base** (`prisma_db`), **Front**
(`prisma_front`), **Contrato** (`contrato/`, los dos lados) o **Decisión** (sin código).

---
## Índice
- [1. Hecho, en progreso y pendiente](#titulo-1)
- [2. Sprint 0 · proyectos, ambientes y contrato](#titulo-2)
- [3. Sprint 1 · base, RLS, identidad e idempotencia](#titulo-3)
- [4. Sprint 2 · acceso, usuarios, cargos y canal firmado](#titulo-4)
- [5. Sprints 3 a 8 · funcionalidades en cadenas paralelas](#titulo-5)
- [6. Sprint 9 · promoción, PWA y endurecimiento](#titulo-6)
- [7. Decisiones pendientes](#titulo-7)
- [8. Documentación](#titulo-8)
- [9. A vigilar](#titulo-9)
- [10. Decisiones de construcción que conviene revisar](#titulo-10)
- [Cómo se mantiene este archivo](#titulo-11)
---

## <a id="titulo-1"></a>1. Hecho, en progreso y pendiente

Las tres preguntas de siempre. Las secciones 2 a 6 enumeran **todas las tareas del plan**, una por
una y con su marca; el conteo lo pone la herramienta en el cuadro de abajo, para que no haya dos
números que puedan discrepar. Que no falte ninguna no depende de la memoria de nadie: la
herramienta compara el tablero con el plan y la verificación falla si alguna no está.

### 1.1 Sprint por sprint

<!-- generado:plan-tablero · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
| Sprint | Tareas | ✅ Hechas | 🚧 En progreso | ⬜ Pendientes | Días que faltan |
|---|---:|---:|---:|---:|---:|
| [Sprint 0](#sprint-0) · Dos proyectos, cuatro ambientes, tubería y contrato de respuesta | 19 | 19 | 0 | 0 | 0 |
| [Sprint 1](#sprint-1) · Base de datos, RLS, identidad propagada e idempotencia | 21 | 21 | 0 | 0 | 0 |
| [Sprint 2](#sprint-2) · Acceso, usuarios, cargos y canal firmado | 22 | 22 | 0 | 0 | 0 |
| [Sprint 3](#sprint-3) · Movimientos | 25 | 25 | 0 | 0 | 0 |
| [Sprint 4](#sprint-4) · Pedidos y anticipos | 11 | 11 | 0 | 0 | 0 |
| [Sprint 5](#sprint-5) · Productos y costeo | 11 | 11 | 0 | 0 | 0 |
| [Sprint 6](#sprint-6) · Reportes y KPIs | 11 | 11 | 0 | 0 | 0 |
| [Sprint 7](#sprint-7) · Capital, retiros y patrimonio | 10 | 10 | 0 | 0 | 0 |
| [Sprint 8](#sprint-8) · Nómina, cotizador y cierre | 19 | 18 | 0 | 1 | 1 |
| [Sprint 9](#sprint-9) · Promoción, PWA y endurecimiento | 17 | 15 | 0 | 2 | 1 |
| [Sprint 10](#sprint-10) · La retroalimentación de Gerencia | 8 | 8 | 0 | 0 | 0 |
| [Sprint 11](#sprint-11) · El privilegio mínimo de la API | 5 | 4 | 0 | 1 | 2 |
| **Total** | **179** | **175** | **0** | **4** | **4** |
<!-- /generado:plan-tablero -->

### 1.2 ✅ Hecho

Lo que tiene su commit en `develop` con la integración continua en verde, que es lo que la
[definición de terminado](docs/08-plan-de-desarrollo.md#4-definición-de-terminado) exige mientras no exista el ambiente qa ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)).

| Dónde | Qué hay | Tareas |
|---|---|---|
| **API · cimientos** | Esqueleto hexagonal con su regla de dependencias verificada, el sobre `{status, mensaje, data}` en toda respuesta, el catálogo de códigos de cinco dígitos, la consulta de versión, el descriptor de formulario, el contrato v0.5.0 fijado y los hilos virtuales de Java 25 | [0.1](docs/08-plan-de-desarrollo.md#tarea-0-1) · [0.2](docs/08-plan-de-desarrollo.md#tarea-0-2) · [0.6](docs/08-plan-de-desarrollo.md#tarea-0-6) · [0.7](docs/08-plan-de-desarrollo.md#tarea-0-7) · [0.11](docs/08-plan-de-desarrollo.md#tarea-0-11) · [0.14](docs/08-plan-de-desarrollo.md#tarea-0-14) … [0.18](docs/08-plan-de-desarrollo.md#tarea-0-18) |
| **API · dominio** | `Dinero`; `Movimiento` con los nueve tipos y su efecto sobre las tres cifras; `Pedido` con sus cinco estados; `Producto`, `Costeo` partido en materia y tiempo, la tarifa por hora, los tres márgenes y el cuadro que lee cada producto contra el resto del taller; y `RegistrarMovimiento`, el primer caso de uso, con la marca de registro tardío | [1.9](docs/08-plan-de-desarrollo.md#tarea-1-9) · [3.1](docs/08-plan-de-desarrollo.md#tarea-3-1) · [3.2](docs/08-plan-de-desarrollo.md#tarea-3-2) · [3.11](docs/08-plan-de-desarrollo.md#tarea-3-11) · [4.1](docs/08-plan-de-desarrollo.md#tarea-4-1) · [5.1](docs/08-plan-de-desarrollo.md#tarea-5-1) · [5.3](docs/08-plan-de-desarrollo.md#tarea-5-3) · [5.6](docs/08-plan-de-desarrollo.md#tarea-5-6) |
| **API · la base** | `ConIdentidad`, **la única puerta a PostgreSQL**: abre la transacción, le dice a la base quién pregunta y se vuelve `authenticated`, y fuera de ella ninguna consulta sale —ni por un `DataSource` o un `@Transactional` de otra clase, que ArchUnit impide—. Probada contra la base local conectada como `prisma_api`: Gerencia ve el pro-labore, Operación no, y la conexión vuelve al pool sin la identidad de nadie. **Y el libro ya llega a la base**: `MovimientosEnPostgres` guarda lo que `RegistrarMovimiento` decide, con el autor y el instante que puso el caso de uso; registrar a nombre de otra persona lo rechaza `mov_insercion` y no un `if`, y la bitácora la escribe el trigger con la persona de la sesión. **Y ya se le puede pedir por HTTP**: `PUT /api/v0/movimientos/{id}` registra un ingreso, un gasto o una transferencia con el formulario que la API describe, y devuelve lo que quedó escrito —con los nombres de la cuenta, la categoría y quien registró, leídos de la base dentro de la misma transacción—. Los cuatro rechazos que no caben en el descriptor estrenan código propio, `42223` a `42226` | [1.6](docs/08-plan-de-desarrollo.md#tarea-1-6) · [3.3](docs/08-plan-de-desarrollo.md#tarea-3-3) · [3.4](docs/08-plan-de-desarrollo.md#tarea-3-4) |
| **API · los permisos** | **Ya no se suponen: se prueban con una sesión de verdad.** Marcela entra por HTTP con su usuario y su contraseña, y de esa sesión de Operación salen [P-01](docs/12-pruebas-y-calidad.md#p-01) a [P-32](docs/12-pruebas-y-calidad.md#p-32): el patrimonio, los costos, la auditoría y las cuatro tablas de Gerencia llegan vacías; el desprendible propio llega y el ajeno no; y ascenderse sola, crear un usuario, tocar el catálogo de cargos o registrarse un adelanto los rechaza PostgreSQL, con el `42501` de una política o el `P0001` de un trigger en el fallo. [P-32](docs/12-pruebas-y-calidad.md#p-32) repite la lectura **sin capa de aplicación en medio** y el resultado no cambia. **Y la tubería por fin las corre**: un trabajo descarga `prisma_db` por etiqueta y levanta Supabase ([ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) [§3](#3-sprint-1--base-rls-identidad-e-idempotencia)), así que [C-01](docs/12-pruebas-y-calidad.md#c-01) y las demás gatean un PR | [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7) |
| **API · el acceso** | Las cuatro operaciones de `/sesiones` contra Supabase Auth, el **canal firmado** comprobando cada petición y la navegación que dicta qué ve cada sesión. La sesión dura 30 días en la cookie `prisma_renovacion` —`HttpOnly`, así que el front no la ve—, cada renovación estrena token y clave de firma, y un token vencido responde `40100` para que el cliente renueve en vez de mandar a la pantalla de acceso | [2.1](docs/08-plan-de-desarrollo.md#tarea-2-1) · [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2) · [2.12](docs/08-plan-de-desarrollo.md#tarea-2-12) · [2.13](docs/08-plan-de-desarrollo.md#tarea-2-13) · [2.14](docs/08-plan-de-desarrollo.md#tarea-2-14) |
| **API y Front · el soporte del movimiento** | **La foto del recibo ya llega al bucket, y pasa por la API** ([3.6](docs/08-plan-de-desarrollo.md#tarea-3-6), [07 §1](docs/07-arquitectura.md)). En el celular se elige con la cámara y **se encoge en el navegador** —1600 px de lado mayor, JPEG— antes de salir, que es lo que se ahorra del plan de datos de quien registra. `POST /api/v0/movimientos/{id}/adjuntos` es **la primera ruta que recibe archivos**: el cuerpo es `multipart/form-data` de una sola parte y la API lo lee de los bytes que el canal firmado ya retuvo, porque `MultipartFile` habría llegado tarde. **El id del adjunto es la clave de idempotencia** ([04 §4.12](docs/04-modelo-de-datos.md#412-adjuntos--el-soporte-de-un-movimiento-o-de-un-pedido), [ADR-020](docs/adr/ADR-020-idempotencia.md)), así que dos intentos escriben el mismo objeto en vez de dejar copias sueltas. Sube como `authenticated`, con el token de la sesión y nunca con la clave de servicio ([ADR-033](docs/adr/ADR-033-service-role-solo-en-auth.md)), y **primero el objeto y después la ficha**, para que ninguna fila prometa un archivo que no está. Estrena los códigos `40020` y `40021`, y **el bucket los vuelve a imponer por su cuenta**: con Storage levantado en la pila local, un PDF de 6 MB y un GIF los para el servicio y no un `if` ([ADR-015](docs/adr/ADR-015-validacion-tres-capas.md)). **Y con la [4.8](docs/08-plan-de-desarrollo.md#tarea-4-8) la misma tubería cuelga la factura de un pedido** ([RF-27](docs/03-requisitos-y-bdd.md#rf-27)): no estrena ningún código —el `40020` y el `40021` no dependen de quién es el padre—, `Adjunto` pasó a llevar de qué cuelga, de donde sale la carpeta del objeto, y el pedido la devuelve en `adjuntos`. En el front la trae la **fila abierta del pedido**, que el mockup y el [10 §4.2](docs/10-ux-y-mockups.md#42-pedidos) estrenan **para los dos tipos de usuario**, porque adjuntan los dos; **se encola antes de salir a la red**, como la foto, y bajar un adjunto se mudó a `lib/datos/soportes.dart`, que es la misma operación para los dos padres | [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) · [4.8](docs/08-plan-de-desarrollo.md#tarea-4-8) |
| **API · los saldos** | **La caja ya dice cuánta plata hay en cada cuenta, y cuánta en total.** `POST /api/v0/consultas/saldos` suma en el dominio —el saldo inicial más el `aporteACaja` de cada movimiento vigente, sin un `if` por tipo— y deja `v_saldos_cuenta` de segunda opinión, como pide el [04 §6](docs/04-modelo-de-datos.md#6-vistas-de-cálculo-financiero): una prueba contra la base las enfrenta fila por fila. El total viaja sumado, porque el front no suma plata ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). **Solo Gerencia, y sin un `if` de tipos**: la tabla la leen los dos, así que el adaptador le pregunta a la base `fn_es_gerencia()` antes de leer los saldos, y a Operación le responde `40300`. La copia fijada del contrato pasa a `0.18.0` | [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12) |
| **API · los pedidos** | **El pedido ya cobra su anticipo, y es un pasivo y no un ingreso** ([RN-05](docs/03-requisitos-y-bdd.md#rn-05)). `POST /api/v0/pedidos/{id}/anticipos` escribe dos filas en la misma transacción: el movimiento `anticipo_recibido`, que sube la caja de la cuenta sin tocar la utilidad, y el anticipo, que queda por devengar hasta la entrega. Cobran los dos tipos, y la respuesta es **el pedido entero** —el cliente, los renglones, lo anticipado, el saldo y si está estancado, con la regla del [RF-24](docs/03-requisitos-y-bdd.md#rf-24) ya en el dominio—. **Un rechazo no deja nada escrito**: el filtro de idempotencia confirma los `4xx`, así que todo se valida antes de la primera escritura. Y **dos cobros a la vez no se pasan juntos del valor del pedido**, porque la base no lo impide: el pedido se lee reservado con `FOR UPDATE`, y una prueba contra la base lo comprueba con otra transacción de por medio. Y con la [4.9](docs/08-plan-de-desarrollo.md#tarea-4-9) **el pedido que no se va a entregar se cancela**: queda `cancelado` con su motivo y con el destino del anticipo —devolución o ingreso—, y lo ya cerrado lo rechaza el `WHERE` del `UPDATE` con el `40932`. **No escribe ningún movimiento**, porque ninguno de los nueve tipos baja la caja sin tocar la utilidad ni sube la utilidad sin volver a subir la caja: el pasivo sale de la caja libre por el estado del pedido | [4.4](docs/08-plan-de-desarrollo.md#tarea-4-4) · [4.9](docs/08-plan-de-desarrollo.md#tarea-4-9) |
| **API y Front · el pedido con sus líneas** | **Tomar un pedido ya es una sola cosa de punta a punta** ([4.3](docs/08-plan-de-desarrollo.md#tarea-4-3), [RF-19](docs/03-requisitos-y-bdd.md#rf-19), [CU-05](docs/02-casos-de-uso.md#cu-05)). `PUT /api/v0/pedidos/{id}` escribe el encabezado y sus renglones en la misma transacción, y **el valor total no viaja en la petición**: sale de las líneas, porque mandarlo sería dejar que el front calcule plata ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). Todo se valida antes de la primera escritura —el cliente contra su catálogo con el `42232`, los renglones contra el de productos con el `42231`—, porque el filtro de idempotencia sella también los `4xx`. **El número visible lo pone la API**, `P-0287`, consecutivo y único, repartido con un cerrojo de aviso: sin él, dos registros a la vez arman el mismo y el segundo pierde un pedido ya digitado, y una prueba contra la base lo comprueba con las dos peticiones a la vez. **Los costos los congela la [5.5](docs/08-plan-de-desarrollo.md#tarea-5-5)**, con el costeo que regía el día del pedido: la 4.3 los dejó en cero a propósito y esa decisión duró hasta ahí ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). El contrato estrena `POST /api/v0/consultas/resumen-de-pedido` en el `0.22.0`: las tres cifras que la pantalla pinta antes de guardar las da la API y juzga las líneas con la misma regla, así que lo que acepta es lo que el registro escribe. En el front, **«Nuevo pedido» entra encima de los clientes**, con su lista de renglones pintada a mano —el descriptor no sabe expresar una lista ([20 §4.4](docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más))— y, **al guardar, pregunta por el abono**: el «sí» abre el formulario del anticipo con el pedido referenciado por su número, que es otro caso de uso y la única ruta que escribe el pasivo ([RN-05](docs/03-requisitos-y-bdd.md#rn-05)) | [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3) |
| **API y Front · los clientes** | **El pedido ya sabe a nombre de quién va, y la pantalla que los administra por fin se abre.** Las tres operaciones de cliente —crear con el id de la ruta, anular con motivo escrito y consultar los vigentes ordenados por nombre— no estrenan ningún código, y los permisos son tres distintos en la base: `clientes_lectura` y `clientes_insercion` dicen `USING (TRUE)`, porque sin cliente no hay pedido, y `clientes_actualizacion` pide `fn_es_gerencia()`. En el front nace **«Pedidos y facturas»** con un solo panel, «Clientes del taller», como la [7.3](docs/08-plan-de-desarrollo.md#tarea-7-3) abrió «Inversiones y retiros» con el pro-labore solo: la lista de pedidos y «Nuevo pedido» entran debajo con sus tareas. **Los clientes no son la pantalla número doce**: existen para que haya un pedido, así que se administran donde se usan, y la API no manda ninguna clave que se llame así. Y **quién puede anular lo dice la API**: el contrato estrena `Navegacion.puedeAnularClientes` en el `0.21.0`, que vale lo mismo que `puedeGestionarCuentas` y se declara aparte para que el día que uno cambie el otro no se rompa en silencio. Ni el tipo de la sesión se mira en `lib/` ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)) ni el botón oculto protege nada ([ADR-006](docs/adr/ADR-006-rls-por-rol.md)) | [4.2](docs/08-plan-de-desarrollo.md#tarea-4-2) |
| **API y Front · el capital** | **El trabajo de la gerencia ya tiene precio, y se define desde la aplicación.** `PUT /api/v0/prolabore/{id}` escribe una definición nueva del pro-labore —el valor mensual, las horas productivas y la justificación—, vigente desde el día en que se guarda en Bogotá, y `POST /api/v0/consultas/prolabore` devuelve la que rige con la tarifa por hora que de ella toman los costeos. **Nada se sobrescribe**: el historial queda entero, y no se pinta. Leer y definir son de Gerencia, y lo dice `prolabore_solo_gerencia`: a Operación la consulta le llega vacía y definir le responde `40300`, las dos cosas desde la base. Estrena el `42294` y, con él, el rango `90`–`99`. En el front se abre **«Inversiones y retiros»**, con el panel del pro-labore y, desde la [7.1](docs/08-plan-de-desarrollo.md#tarea-7-1), el de los activos del negocio. **Y con la [7.2](docs/08-plan-de-desarrollo.md#tarea-7-2) entra el tercero, «Aportes de capital», que es el primer panel sin tabla**: el contrato no declara ninguna consulta de aportes, así que el panel no lista nada y pinta el comprobante que la API devolvió de lo último que entró. Y **el descriptor del front aprende el tipo `numero`**, que la API genera desde la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2): las horas llevan decimales | [7.1](docs/08-plan-de-desarrollo.md#tarea-7-1) · [7.2](docs/08-plan-de-desarrollo.md#tarea-7-2) · [7.3](docs/08-plan-de-desarrollo.md#tarea-7-3) |
| **API y Front · las personas** | **Quién entra al sistema, administrado desde el sistema**: crear con clave temporal, editar el nombre, el cargo y el tipo, desactivar con motivo escrito y restablecer la contraseña —que además corta las sesiones abiertas—. **Ni un permiso vive en la API**: crear lo autoriza `usuarios_insercion`, y al último usuario activo de Gerencia lo rechaza un trigger que estaba puesto desde el esquema inicial. La identidad se crea contra GoTrue con la clave de servicio, acotada a eso por el [ADR-033](docs/adr/ADR-033-service-role-solo-en-auth.md) y vigilada por una prueba que rompe la compilación si aparece en otro archivo. **Y desde la [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16) esos cambios se leen y se deshacen**: los doce eventos con nombre, la bitácora redactada por la API —qué pasó, sobre quién, el «de → a» y qué pasaría al revertir— y la reversión, que escribe un cambio nuevo y deja la entrada original intacta. **Y con la [2.17](docs/08-plan-de-desarrollo.md#tarea-2-17) el cambio de clave obligatorio lo impone la API y no la pantalla**: quien no ha creado la suya alcanza seis rutas y en las otras 80 lee «Crea tu contraseña para continuar.» | [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) · [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16) · [2.17](docs/08-plan-de-desarrollo.md#tarea-2-17) |
| **Front** | El proyecto Flutter con su integración continua, la insignia de versión y ambiente, el bloqueo por MAJOR incompatible y `Dinero` en Dart | [0.3](docs/08-plan-de-desarrollo.md#tarea-0-3) · [0.12](docs/08-plan-de-desarrollo.md#tarea-0-12) · [0.13](docs/08-plan-de-desarrollo.md#tarea-0-13) · [1.9](docs/08-plan-de-desarrollo.md#tarea-1-9) |
| **Front · sistema de diseño** | La tabla, el panel de confirmación en línea, la píldora de estado y los formatos colombianos de fecha y porcentaje; el cliente HTTP con clave de idempotencia; y el panel «Acerca de» | [0.19](docs/08-plan-de-desarrollo.md#tarea-0-19) · [1.19](docs/08-plan-de-desarrollo.md#tarea-1-19) · [2.10](docs/08-plan-de-desarrollo.md#tarea-2-10) |
| **Front · formularios** | El renderizador del descriptor: pinta los campos que manda la API con su teclado, sus límites, sus opciones y sus avisos, y no trae ninguna regla propia | [1.18](docs/08-plan-de-desarrollo.md#tarea-1-18) |
| **Front · la sesión** | **La puerta**: sin sesión se ve «Entra con tu usuario», y quien entra con una clave temporal va a «Crea tu contraseña» en vez de al tablero —que ni siquiera se construye hasta que la cambie—. Los dos formularios los manda la API, y los rechazos también: el «Usuario o contraseña incorrectos» que se lee en pantalla no está escrito en ninguna parte del front. **Recargar la página ya no saca a nadie**: lo primero que hace la aplicación al abrirse es renovar con la cookie, y si un token vence a media jornada el cliente lo repone y reintenta sin que se note. Arriba, la identidad con su menú de la sesión; a la izquierda, el menú que dicta la API | [2.6](docs/08-plan-de-desarrollo.md#tarea-2-6) · [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2) · [2.12](docs/08-plan-de-desarrollo.md#tarea-2-12) · [2.14](docs/08-plan-de-desarrollo.md#tarea-2-14) |
| **Front · el Inicio** | **«Cómo va el negocio», con las tres cifras del mes lado a lado** ([6.3](docs/08-plan-de-desarrollo.md#tarea-6-3)): utilidad causada, movimiento de caja y caja libre, y debajo la línea que las concilia **tal como la redacta la API**. El panel «Cuentas» trae cada saldo, el total y la escalera que lleva a la caja libre —menos los anticipos por devengar, menos los gastos fijos comprometidos—, y el de «Por entregar», las cinco cifras de los pendientes. **Todo llega de una sola consulta y con el cuerpo vacío**: cuál es el mes del negocio lo decide la API en Bogotá. **No escribe nada, y hay una prueba que lo afirma** ([RF-95](docs/03-requisitos-y-bdd.md#rf-95)). Se construyó contra el contrato acordado, que la API todavía no sirve ([§10](#10-decisiones-de-construcción-que-conviene-revisar)) | [6.3](docs/08-plan-de-desarrollo.md#tarea-6-3) |
| **Front · sin conexión** | La PWA con su manifiesto en español y la cola local en IndexedDB: cada intención se guarda con su clave **antes** de intentar enviarse, y se reintenta con la espera de [17 §5.2](docs/17-resiliencia-offline-y-cache.md#52-cuánto-se-espera-entre-reintentos) hasta que la API la acepte o la rechace con motivo | [9.1](docs/08-plan-de-desarrollo.md#tarea-9-1) |
| **Contrato** | El contrato v0.17.0 en [`contrato/openapi.json`](contrato/openapi.json), **entero**: el sobre, el descriptor con sus listas, cuentas y categorías, y **los sprints [2](docs/08-plan-de-desarrollo.md#sprint-2), [3](docs/08-plan-de-desarrollo.md#sprint-3), [4](docs/08-plan-de-desarrollo.md#sprint-4), [5](docs/08-plan-de-desarrollo.md#sprint-5), [6](docs/08-plan-de-desarrollo.md#sprint-6), [7](docs/08-plan-de-desarrollo.md#sprint-7) y [8](docs/08-plan-de-desarrollo.md#sprint-8) acordados antes de implementarlos** —`/sesiones`, `/usuarios`, `/cargos`, `/bitacora`, `/navegacion` y las tres cabeceras del canal firmado; los movimientos con su registro, su anulación, su adjunto y su libro con filtros; los clientes, los pedidos y sus anticipos; los productos con su costeo, su cuadro de márgenes y lo que Operación no recibe; y el capital: las inversiones, los aportes, el retiro partido en pro-labore y distribución, el pro-labore, los sobres y el patrimonio; y la nómina entera con el simulador, el cotizador y el importador; y los reportes: el Inicio en una sola consulta —las tres cifras, las alertas, los saldos, los sobres, los doce meses y los pendientes—, el año mes a mes con el promedio de ganancias y el punto de equilibrio, el cierre mensual y la descarga en CSV o PDF— | [0.15](docs/08-plan-de-desarrollo.md#tarea-0-15) · [0.18](docs/08-plan-de-desarrollo.md#tarea-0-18) · [1.17](docs/08-plan-de-desarrollo.md#tarea-1-17) · [2.19](docs/08-plan-de-desarrollo.md#tarea-2-19) · [3.13](docs/08-plan-de-desarrollo.md#tarea-3-13) · [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10) · [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10) · [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10) · [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) · [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11) |
| **Base** | **El esquema ya no está solo escrito: está probado contra una base.** 30 tablas con la semilla del mockup, los nueve dominios de [04 §4.1](docs/04-modelo-de-datos.md#41-tipos-y-convenciones-comunes) en sus 64 columnas, toda restricción con nombre explícito, `DELETE` y `TRUNCATE` revocados a todo el que no sea el dueño, los dieciocho triggers de auditoría escribiendo y las 55 políticas juzgando a una sesión de verdad —Operación no alcanza los retiros ni el pro-labore; Gerencia sí—, también sobre el catálogo de cargos, que lee todo el mundo y escribe solo Gerencia, y sobre las claves de idempotencia, que cada persona alcanza solo si son suyas, Gerencia incluida. `schema_version` y el rol `prisma_api`, con el que **RLS ya juzga a la API**. La semilla es fija, re-ejecutable y con filas en toda tabla que preguntan las pruebas de permisos, y `sembrar.ps1` la lleva a dev y a qa sin dejarla acercarse a uat ni a prod. Y esto ya no es solo dev: **qa quedó al día con la promoción de la [1.12](docs/08-plan-de-desarrollo.md#tarea-1-12)**, con sus 109 comprobaciones en `OK` y `schema_version` en `0.3.0`. Y con la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) el esquema estrena la tabla `adjuntos` —la ficha del soporte, con su trigger y sus dos flechas excluyentes— y el **bucket privado `soportes`**, que impone el techo de 5 MB y los cuatro tipos de contenido **antes** de que los bytes se guarden: son 123 comprobaciones en `OK` contra la base local, y `0.4.0` **todavía sin promover a dev ni a qa**. Y con la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) el libro impone al fin **las tres reglas de la cuenta de destino** —un gasto ya no llega con destino, y una transferencia ya no va de una cuenta a sí misma, que además le **bajaba el saldo** a esa cuenta— y **la fecha se juzga con el día de Bogotá y no con el huso de la sesión**, que de siete a doce de la noche aceptaba el mañana que la API rechaza: 141 comprobaciones en `OK`, y la `0.6.0` esperando promoción como la `0.4.0`. Y con la [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11) **`pedidos` tiene dónde guardar la cancelación**, que el contrato prometía desde el `0.10.0`: cuándo, quién, por qué y qué pasó con el anticipo, sin cancelación muda y sin reusar las columnas de la anulación —un pedido cancelado y después anulado perdería una de las dos historias—. 199 comprobaciones en `OK`, y la `0.11.0` tampoco está promovida. Y con la [3.18](docs/08-plan-de-desarrollo.md#tarea-3-18) **editar una fila ya no tumba la escritura en cinco de las dieciséis tablas auditadas**: `fn_auditar` leía `anulado_en` también donde no existe, y el `UPDATE` se caía con `42703` dentro del trigger. 216 comprobaciones en `OK`, una edición por tabla auditada, y la `0.12.0` sin promover. Y con la [3.19](docs/08-plan-de-desarrollo.md#tarea-3-19) **el libro tiene de dónde leer cómo se ve cada tipo**: `presentacion_tipos`, con las nueve lecturas que ya pintaba escritas por la migración, que leen los dos tipos y cambia solo Gerencia —la sesión de Operación no alcanza ninguna fila— y con el decimosexto trigger de auditoría. 235 comprobaciones en `OK`, y la `0.13.0` sin promover. Y con la [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20) **anular ya no queda a medias**: `fn_anular_movimiento` anula el movimiento y lo que va con él —el anticipo de un pedido en proceso, el activo, el aporte, las dos mitades del retiro, que une la columna nueva `aportes_retiros.retiro_id`, o el adelanto sin descontar— con el mismo motivo, autor e instante, y rechaza entera la anulación de lo que ya siguió su vida. 259 comprobaciones, y la `0.14.0` sin promover. Y con la [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12) **el cotizador tiene dónde guardar**: `cotizaciones` y `cotizacion_lineas`, que el contrato de la [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11) prometía y la base no tenía, con la validez que no vence antes de emitirse, el pedido en que se convierte y la anulación con motivo. **Llevan RLS** porque anular es solo de Gerencia, y a Operación se lo niega la base con `42501`. 291 comprobaciones, y la `0.15.0` sin promover. Y con la [5.5](docs/08-plan-de-desarrollo.md#tarea-5-5) **el historial de costos por fin se lee hacia atrás**: `fn_costeo_vigente` dice qué costeo regía un día dado, y es `SECURITY DEFINER` a propósito, porque el pedido lo registran los dos tipos de usuario y `costos_solo_gerencia` no le devuelve a Operación ni una fila: con `INVOKER`, el costo que un pedido congela dependería de quién lo digitó. 337 comprobaciones, y la `0.19.0` sin promover. Y con la [6.8](docs/08-plan-de-desarrollo.md#tarea-6-8) **un cierre guardado ya no se puede editar**: `UPDATE` sobre `cierres_mensuales` queda revocado para todos los roles de la aplicación, porque la foto que congela el mes la va a leer un reporte impreso meses después, y un `UPDATE` de la API la volvería una cifra más que se puede corregir en silencio. Un cierre equivocado se arregla con un ajuste en el mes corriente. 346 comprobaciones, y la `0.20.0` sin promover | [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4) · [0.5](docs/08-plan-de-desarrollo.md#tarea-0-5) · [0.10](docs/08-plan-de-desarrollo.md#tarea-0-10) · [1.1](docs/08-plan-de-desarrollo.md#tarea-1-1) … [1.5](docs/08-plan-de-desarrollo.md#tarea-1-5) · [1.11](docs/08-plan-de-desarrollo.md#tarea-1-11) · [1.13](docs/08-plan-de-desarrollo.md#tarea-1-13) · [2.3](docs/08-plan-de-desarrollo.md#tarea-2-3) · [2.4](docs/08-plan-de-desarrollo.md#tarea-2-4) · [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) · [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) · [3.18](docs/08-plan-de-desarrollo.md#tarea-3-18) · [3.19](docs/08-plan-de-desarrollo.md#tarea-3-19) · [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20) · [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11) · [5.5](docs/08-plan-de-desarrollo.md#tarea-5-5) · [6.8](docs/08-plan-de-desarrollo.md#tarea-6-8) · [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12) |
| **Decisión** | Cuatro repositorios ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md)), Java 25 y Gradle ([ADR-024](docs/adr/ADR-024-java-25-y-gradle.md)), Railway con dev desde ya ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)), documentación versionada ([ADR-027](docs/adr/ADR-027-documentacion-versionada.md)), el esquema por etiqueta ([ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md)) y el mockup confirmado ([H0](docs/08-plan-de-desarrollo.md#h0)) | [1.20](docs/08-plan-de-desarrollo.md#tarea-1-20) |

**1423 pruebas en verde en la API** —y 335 más contra la base local, que desde la [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7) sí corre la tubería— y 575 en el front. El dominio se prueba con las cifras de los
documentos [05](docs/05-reglas-financieras.md) y [06](docs/06-nomina-y-capacidad-de-pago.md): si una prueba falla, o se rompió el código o el documento dice
otra cosa.

### 1.3 🚧 En progreso

**La pantalla de Pedidos ya toma pedidos, y su dibujo cambió con ella.** Con la [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3), «Nuevo
pedido» entra encima de «Clientes del taller» con su lista de renglones, y el mockup pasó de un
producto suelto a la lista con «+ Agregar renglón». **Dos piezas del dibujo se quedaron fuera a
propósito** ([§10](#10-decisiones-de-construcción-que-conviene-revisar)): el alta de cliente dentro del formulario —el panel está justo debajo— y el
anticipo editable, que ahora es el paso siguiente: al guardar, la pantalla pregunta si se registra
el abono y lleva al formulario del anticipo con el pedido referenciado. **Queda mirar el dibujo
entero**, que trae además el panel de Gerencia y la lista con sus filtros, que es la [4.6](docs/08-plan-de-desarrollo.md#tarea-4-6).

**El hilo del libro está cerrado, y queda la pila local ([3.25](docs/08-plan-de-desarrollo.md#tarea-3-25)).** El libro lo sirve la API
([3.21](docs/08-plan-de-desarrollo.md#tarea-3-21)), lo pinta la pantalla ([3.8](docs/08-plan-de-desarrollo.md#tarea-3-8)), el botón de anular vive en la fila abierta ([3.9](docs/08-plan-de-desarrollo.md#tarea-3-9)),
anular se lleva el registro hermano ([3.23](docs/08-plan-de-desarrollo.md#tarea-3-23)) y lo que no se puede anular se corrige con un
contra-asiento sin tocar el original ([3.10](docs/08-plan-de-desarrollo.md#tarea-3-10)). Lo que falta decidir está en el
[§10](#10-decisiones-de-construcción-que-conviene-revisar), y lo que hay que vigilar —las ocho etiquetas
del esquema que faltan, y que desde ahora pone una tubería— en el [§9](#9-a-vigilar).

**El alta de usuarios volvió a servir, y falta ejercitarla contra dev.** Crear a alguien respondía
«algo salió mal» con cualquier nombre de usuario, porque faltaba `SUPABASE_SERVICE_ROLE_KEY` en el
despliegue de la API y el fallo no sabía decirlo: `ProveedorNoDisponible` no tenía código propio.
Dejaba sin servir la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) recién terminada. **El arreglo entró en los dos repositorios**
—el `50300` que estrenó el contrato `0.9.0`— **y la variable ya está cargada en Railway**, que era lo
único que el código no podía hacer solo. Es un arreglo suelto: no lleva número de tarea y no entra en
las cuentas de abajo. **Queda ejercitarlo contra dev** con una sesión de Gerencia: es lo
único del arreglo que no se ve desde fuera.

**Los equipos del negocio ya se registran, y ya tienen su panel.** Con la mitad Front, la [7.1](docs/08-plan-de-desarrollo.md#tarea-7-1)
queda cerrada: «Activos del negocio» va debajo del pro-labore en «Inversiones y retiros», pinta lo
que el taller compró del equipo más caro al más barato y estrena el botón que registra la compra,
que el mockup no dibujaba ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).
**Y el costeo de bordado ([5.4](docs/08-plan-de-desarrollo.md#tarea-5-4)) ya está, con la regla que le faltaba escrita en
[05 §7.1](docs/05-reglas-financieras.md#71-costo-unitario)**: el tiempo de máquina no le suma pesos al costo unitario y sí ocupa el taller, así
que el margen por hora divide entre el mayor de los dos tiempos. Con eso **el [Sprint 5](docs/08-plan-de-desarrollo.md#sprint-5) queda
cerrado**.

**Y la plata que entra desde afuera ya entra, y ya tiene su panel.** Con la mitad Front, la
[7.2](docs/08-plan-de-desarrollo.md#tarea-7-2) queda cerrada: `PUT /api/v0/aportes/{id}` escribe el movimiento y su fila de
`aportes_retiros` en la misma transacción, y **sube la caja y el patrimonio sin tocar la utilidad**,
que es la fila del [05 §2](docs/05-reglas-financieras.md) y lo que el patrimonio de la [7.5](docs/08-plan-de-desarrollo.md#tarea-7-5) va a necesitar. **No pidió
migración ni código nuevo**: la clase `aporte` estaba en el esquema inicial, el `42290` y el `42291`
ya la nombraban, y `fn_anular_movimiento` ya la arrastra desde la [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20). **Y su panel entra
debajo del de los activos**, con una particularidad: **es el primero sin tabla**, porque el contrato
no declara ninguna consulta de aportes. No lista nada, dice dónde se ve lo aportado y pinta el
comprobante que la API devolvió, que el mockup tampoco dibujaba ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).

**Y el reparto de cada peso ya se define desde la aplicación, con su pantalla.** Con la mitad Front,
la [7.7](docs/08-plan-de-desarrollo.md#tarea-7-7) queda cerrada: los cuatro sobres se configuran y se leen, y **cada cambio es una
fila nueva**, así que el historial que pide el [RF-51](docs/03-requisitos-y-bdd.md#rf-51) queda entero. **Las dos reglas son de la
base**: el «no» a Operación lo pone `sobres_solo_gerencia` y que los cuatro sumen 100, `suma_cien`,
que estrena el `42293`. **Y su panel cierra «Inversiones y retiros» por abajo**, donde los activos y
los aportes ya entraron: pinta la barra de cuatro tramos y desde cuándo rige, **no pinta el
historial** —el requisito pide conservarlo, no mostrarlo— y **no suma los cuatro campos**, porque esa
regla es de la base. Como el pro-labore, no estaba dibujado, y el mockup lo estrena
([§10](#10-decisiones-de-construcción-que-conviene-revisar)). **Con él quedan cerradas las oleadas 1
y 2 del [Sprint 7](docs/08-plan-de-desarrollo.md#sprint-7)**.

**Y lo repartido ya se mira contra lo gastado.** La [7.8](docs/08-plan-de-desarrollo.md#tarea-7-8) pinta «Los 4 sobres» en el Inicio,
detrás de «Cuentas»: la barra de cuatro tramos y, por sobre, lo asignado contra lo usado y lo
disponible con su signo, en verde o en rojo, con el avance de la reserva hacia los tres meses de
gastos fijos. **No pidió contrato, pero sí las dos mitades**: el [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) ya declaraba los cuatro
sobres dentro del tablero, y la API los mandaba vacíos esperando esta tarea, así que `RepartirEnSobres`
llegó con ella. **Lo que no se escribió es la frase con que el mockup
cierra el panel**, «los gastos fijos consumieron el 49% de lo que entró»: es una lectura redactada
sobre las cifras y le toca a la API ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).
**Con ella el [Sprint 7](docs/08-plan-de-desarrollo.md#sprint-7) queda cerrado, 9 de 9**, y el Inicio no le debe nada al mockup.

**La factura del pedido ya se sube, y ya hay desde dónde subirla.** Con la mitad Front, la [4.8](docs/08-plan-de-desarrollo.md#tarea-4-8)
queda cerrada: `POST /api/v0/pedidos/{id}/adjuntos` cuelga la factura con la misma tubería que la
foto del recibo, y el pedido la devuelve entre sus `adjuntos`, que es de donde la pantalla saca con
qué id bajarla. **Lo que no estaba era la pantalla**: el mockup no dibujaba de dónde se adjunta,
así que esta tarea estrena la **fila abierta del pedido**, que era solo de Gerencia y ahora se abre
para los dos tipos de usuario, porque la factura la adjuntan los dos ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). **La factura se encola antes
de salir a la red**, como la foto: lo que se toma en el taller no se pierde porque en ese momento
no hubiera señal. **Con ella se cierra el [Sprint 4](docs/08-plan-de-desarrollo.md#sprint-4)**, que era el único con una tarea suelta.

**El año mes a mes ya se puede pedir, y todavía no hay dónde verlo.** La mitad API de la
[6.5](docs/08-plan-de-desarrollo.md#tarea-6-5) está hecha: `POST /api/v0/consultas/reporte` devuelve los doce meses, el promedio de
ganancias del [05 §9.1](docs/05-reglas-financieras.md#91-resultado) y el punto de equilibrio del [05 §10](docs/05-reglas-financieras.md#10-punto-de-equilibrio). **Un mes cerrado no se
vuelve a calcular**: sale tal cual de `cierres_mensuales` ([RN-16](docs/03-requisitos-y-bdd.md#rn-16)), que es lo que llena la [6.8](docs/08-plan-de-desarrollo.md#tarea-6-8); los abiertos se calculan, y el que no tiene registro no viaja. **El promedio se divide entre
los meses cerrados**, no entre los que vinieron, que es lo que el [CU-14](docs/02-casos-de-uso.md#cu-14) pide, y sin ningún mes cerrado
no hay promedio ni proyección. **El «no» a Operación lo pone el caso de uso y no la base**, porque
el reporte se arma de tablas que leen los dos tipos de usuario: es el `40300` que el contrato ya
declaraba para esta ruta. **Y el punto de equilibrio viaja dentro de esta misma respuesta**, que es
lo que el contrato acordó.

**Y con la [6.6](docs/08-plan-de-desarrollo.md#tarea-6-6) se cierra el [Sprint 6](docs/08-plan-de-desarrollo.md#sprint-6).** Cada mes de la tabla dice ahora cuánto vendió
por encima o por debajo del punto de equilibrio, que es la última columna del mockup y la fila
«ventas sobre el punto» del [05 §12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes). Esa tarea se recortó a eso, porque la [6.5](docs/08-plan-de-desarrollo.md#tarea-6-5) ya había
traído la fórmula entera, y **de paso corrigió esas dos cifras del ejemplo de septiembre**, que repetían el ejemplo
del [05 §10](docs/05-reglas-financieras.md#10-punto-de-equilibrio) en vez de salir de los datos de septiembre.

**Y el patrimonio ya se calcula, y todavía no hay dónde verlo.** La [7.5](docs/08-plan-de-desarrollo.md#tarea-7-5) está hecha:
`POST /api/v0/consultas/patrimonio` devuelve aportes menos distribuciones más utilidades acumuladas
([05 §6.4](docs/05-reglas-financieras.md#64-patrimonio-y-descapitalización)), con sus tres términos, los doce meses de la tasa de retiro ([05 §9.3](docs/05-reglas-financieras.md#93-estructura-y-patrimonio)) y cómo se
partió el retiro del mes. **El pro-labore no se resta como retiro**: es gasto y ya está dentro de
las utilidades. **Las utilidades son las causadas mes a mes**, la misma cuenta del Inicio y del
reporte. El «no» a Operación lo pregunta la API, como en aquellas dos, porque las cifras salen del
libro. **Y con la [7.6](docs/08-plan-de-desarrollo.md#tarea-7-6) esa tasa ya alerta**: en `critica` avisa que se está retirando más de lo
que el negocio genera, sin esperar a que el patrimonio se ponga en rojo.
**Falta su pantalla**, que es el bloque del pie de «Inversiones y retiros» y todavía no tiene sitio en el plan
asignado ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).

**Lo siguiente, en cuanto alguien lo tome:** cerrar la base del [Sprint 1](docs/08-plan-de-desarrollo.md#sprint-1) destrabó lo que la estaba
esperando. En el trabajo de la API **la prueba de permisos con sesión real ya está** ([1.7](docs/08-plan-de-desarrollo.md#tarea-1-7)), y con ella
la tubería que corre lo que habla con la base: [C-01](docs/12-pruebas-y-calidad.md#c-01) y las demás **por fin gatean un PR**, que era el
agujero por el que la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) fusionó `adjuntos` sin sus mensajes y nadie lo vio en días.
**Y en su primera corrida encontró dos rojos que nadie veía**: una prueba de la propia [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7) que daba
por hecho que el reloj del ejecutor está en Bogotá, y dos de la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) que se apoyaban en una política
de contraseñas que ningún archivo declaraba ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). El filtro de idempotencia
([1.14](docs/08-plan-de-desarrollo.md#tarea-1-14)) ya salió de esa lista: necesitaba la transacción de la [1.6](docs/08-plan-de-desarrollo.md#tarea-1-6) y la tabla de la [1.13](docs/08-plan-de-desarrollo.md#tarea-1-13), y con las dos
quedó hecho; detrás de él se abre la prueba de corte ([1.15](docs/08-plan-de-desarrollo.md#tarea-1-15)). En el trabajo de la base, con
`cargos` ([2.3](docs/08-plan-de-desarrollo.md#tarea-2-3)), la tabla de idempotencia ([1.13](docs/08-plan-de-desarrollo.md#tarea-1-13)), su purga ([1.16](docs/08-plan-de-desarrollo.md#tarea-1-16)) y la semilla reproducible
([1.11](docs/08-plan-de-desarrollo.md#tarea-1-11)) y la primera promoción a qa ([1.12](docs/08-plan-de-desarrollo.md#tarea-1-12)) cerradas, sigue la tabla `usuarios` ([2.4](docs/08-plan-de-desarrollo.md#tarea-2-4)). El
trabajo del contrato acordó con la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10) los diez módulos del plan, **y lo reabre el dibujo del libro**:
la tarea [3.17](docs/08-plan-de-desarrollo.md#tarea-3-17) ya acordó en el `v0.19.0` lo que el libro pide y el contrato del `0.11.0` no sabía servir. **El acceso está cerrado de punta a punta**: con la
sesión de 30 días ([2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)) se entra, se recarga la página y se sigue dentro, se sale por el menú de
la sesión y quien entra con clave temporal la cambia y llega al tablero. Y con la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) **Gerencia ya
puede dar de alta a alguien**, que era lo último que solo sabía hacer `seed.sql`. **Con la [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16) la pantalla de Gestión de usuarios queda entera**: arriba las personas, en medio
la bitácora de cambios y abajo el catálogo de cargos. Y con la [2.17](docs/08-plan-de-desarrollo.md#tarea-2-17) **quien vuelve ya no pasa del «Crea tu
contraseña»**, y no porque el front no le pinte el tablero sino porque la API responde `40302` a
todo lo demás. Al [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2) no le queda nada en este proyecto: solo la [2.11](docs/08-plan-de-desarrollo.md#tarea-2-11), que se
cierra en el de qa. **Con la [2.18](docs/08-plan-de-desarrollo.md#tarea-2-18) el trabajo del front cerró su parte del sprint:**
Gerencia ya mira la pantalla como la ve la empleada, y sale de ahí con un clic. **Y el [Sprint 3](docs/08-plan-de-desarrollo.md#sprint-3) es el que más se movió: el libro llega
a PostgreSQL** ([3.3](docs/08-plan-de-desarrollo.md#tarea-3-3)) **y su contrato ya está acordado** ([3.13](docs/08-plan-de-desarrollo.md#tarea-3-13)). **Y los dos que destrabó ya están**: los
endpoints ([3.4](docs/08-plan-de-desarrollo.md#tarea-3-4)) y el registro rápido del front ([3.5](docs/08-plan-de-desarrollo.md#tarea-3-5)), que fueron a la vez, así que el libro se
registra hoy de punta a punta. Con el contrato entró también una tarea nueva: **la tabla
`adjuntos` no existía y ninguna tarea la creaba** ([3.14](docs/08-plan-de-desarrollo.md#tarea-3-14)). **Y con la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) el gasto ya se
registra con su foto**, que era lo último que el sprint tenía pendiente de las dos puntas: quedan
el listado ([3.8](docs/08-plan-de-desarrollo.md#tarea-3-8)) y la anulación ([3.9](docs/08-plan-de-desarrollo.md#tarea-3-9)); **los saldos por
cuenta ([3.12](docs/08-plan-de-desarrollo.md#tarea-3-12)) ya están, y las transferencias ([3.7](docs/08-plan-de-desarrollo.md#tarea-3-7))
resultaron estarlo también**: las dejaron hechas las tareas de las que colgaban. **Y el [Sprint 6](docs/08-plan-de-desarrollo.md#sprint-6) ya se ve en pantalla**: con la [6.3](docs/08-plan-de-desarrollo.md#tarea-6-3) el Inicio pinta las tres cifras del mes, y lo que le falta —el gráfico, las alertas y los sobres— entra con su tarea. Lo que ninguna tarea tiene todavía es **la ruta que se las sirve**: la API no la implementa, y está en el [§10](#10-decisiones-de-construcción-que-conviene-revisar). La lista al día la calcula la herramienta, y está justo abajo.

> **El [Sprint 0](docs/08-plan-de-desarrollo.md#sprint-0) está cerrado.** La base existe, tiene dueño distinto del de la API y **RLS ya
> juzga**: conectada como `prisma_api`, la misma consulta devuelve cero filas de `usuarios` y las
> cuatro `cuentas`, porque lo decide la base y no un `if`. Lo último que le faltaba era la [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4), y
> **se partió**: dev y qa llevan meses en pie, y uat y prod son de pago, los firma Gerencia y hasta
> el [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9) no hay nada que promover a ellos, así que son la [9.12](docs/08-plan-de-desarrollo.md#tarea-9-12). El trabajo de la base ya siguió: el
> [Sprint 1](docs/08-plan-de-desarrollo.md#sprint-1) tiene cerrada su mitad de base ([1.1](docs/08-plan-de-desarrollo.md#tarea-1-1) a [1.5](docs/08-plan-de-desarrollo.md#tarea-1-5)).

### 1.4 ⬜ Pendiente: lo que puede empezar hoy, en paralelo

Calculado de las dependencias del plan con lo marcado como hecho. Cada fila es un repositorio: **todo lo
de una misma fila se puede trabajar a la vez que lo de las demás.**

<!-- generado:plan-listas-ya · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
| Dónde | Pueden empezar hoy, porque todo lo que necesitan ya está hecho |
|---|---|
| **API** | [11.5](docs/08-plan-de-desarrollo.md#tarea-11-5) |
| **Front** | [8.19](docs/08-plan-de-desarrollo.md#tarea-8-19) |
| **Decisión** | [9.12](docs/08-plan-de-desarrollo.md#tarea-9-12) · [9.13](docs/08-plan-de-desarrollo.md#tarea-9-13) |
<!-- /generado:plan-listas-ya -->

### 1.5 Cuánto falta

<!-- generado:plan-restante · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
Quedan **4 tareas y 4 días de trabajo** de 179 tareas del plan.

| Tareas a la vez | Desarrollo que falta | Con la estabilización |
|:---:|---:|---:|
| 1 | 0,5 semanas | **3,5 semanas** |
| 2 | 0,3 semanas | **3,3 semanas** |
| 3 | 0,4 semanas | **3,4 semanas** |
<!-- /generado:plan-restante -->

### 1.6 Para destrabar, en orden de lo que más libera

El orden sale de las dependencias del [plan](docs/08-plan-de-desarrollo.md): cuántas tareas pendientes cuelgan de cada una, directa
o indirectamente. No es el orden en que se descubrieron.

- [x] **El contrato del libro que dibujó el mockup** ([3.17](docs/08-plan-de-desarrollo.md#tarea-3-17)) — hecho en el `v0.19.0`. Tenía **ocho tareas detrás**
      por un día de trabajo. Cinco son directas: la función que anula con el registro hermano
      ([3.20](docs/08-plan-de-desarrollo.md#tarea-3-20)), el libro en la API ([3.21](docs/08-plan-de-desarrollo.md#tarea-3-21)), leer y cambiar cómo se ve cada tipo ([3.22](docs/08-plan-de-desarrollo.md#tarea-3-22)), la anulación
      que arrastra ([3.23](docs/08-plan-de-desarrollo.md#tarea-3-23)) y el bloque de Gerencia ([3.24](docs/08-plan-de-desarrollo.md#tarea-3-24)). Tres son indirectas: el libro ([3.8](docs/08-plan-de-desarrollo.md#tarea-3-8)), su
      botón de anular ([3.9](docs/08-plan-de-desarrollo.md#tarea-3-9)) y el contra-asiento ([3.10](docs/08-plan-de-desarrollo.md#tarea-3-10)). **Reabre el trabajo del contrato**, que la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10)
      había cerrado con los diez módulos, y es el primero que no sale de los documentos sino de un
      dibujo aprobado. **Las reglas del registro que ya siguió su vida las propuso él**, y quien dirige
      las aprobó: están en el [CU-03](docs/02-casos-de-uso.md#cu-03)
- [x] **Que `fn_auditar` deje de leer `anulado_en` donde no existe** ([3.18](docs/08-plan-de-desarrollo.md#tarea-3-18)) — hecho en el esquema
      `0.12.0`. Tenía **seis tareas detrás** por medio día. La directa es la tabla de cómo se ve cada
      tipo ([3.19](docs/08-plan-de-desarrollo.md#tarea-3-19)), que ya está hecha, y detrás de ella vienen el libro en la API, leer y cambiar
      cada tipo, el libro, su botón y el contra-asiento. Era además el arreglo que el [§9](#9-a-vigilar) venía
      pidiendo para cinco tablas en las que un `UPDATE` fallaba dentro del trigger
- [x] **Cómo se ve cada tipo, en la base** ([3.19](docs/08-plan-de-desarrollo.md#tarea-3-19)) — hecho en el esquema `0.13.0`. Tenía **cinco
      tareas detrás** por medio día. Las directas son el libro en la API ([3.21](docs/08-plan-de-desarrollo.md#tarea-3-21)) y leer y cambiar
      cada tipo ([3.22](docs/08-plan-de-desarrollo.md#tarea-3-22)), y detrás vienen el libro ([3.8](docs/08-plan-de-desarrollo.md#tarea-3-8)), su botón ([3.9](docs/08-plan-de-desarrollo.md#tarea-3-9)) y el contra-asiento ([3.10](docs/08-plan-de-desarrollo.md#tarea-3-10)).
      Las dos directas ya no esperan a ninguna tarea, pero la API solo recoge el esquema cuando
      exista la etiqueta `esquema-v0.13.0`, y **el PR de base de la 3.19 va después del de la 3.18**,
      que no se ha fusionado: su rama lleva debajo ese commit, porque sin su `fn_auditar` el primer
      cambio de Gerencia se caería con `42703`
- [x] **Anular con el registro hermano, en la base** ([3.20](docs/08-plan-de-desarrollo.md#tarea-3-20)) — hecho en el esquema `0.14.0`.
      Tenía **tres tareas detrás** por un día: la directa es la anulación que arrastra en la API
      ([3.23](docs/08-plan-de-desarrollo.md#tarea-3-23)), y detrás vienen el botón de anular ([3.9](docs/08-plan-de-desarrollo.md#tarea-3-9)) y el contra-asiento ([3.10](docs/08-plan-de-desarrollo.md#tarea-3-10)). La 3.23 recoge el
      esquema cuando exista la etiqueta `esquema-v0.14.0`, y **el PR de base de la 3.20 va después de
      los de la 3.18 y la 3.19**, que ya están en `develop`
- [x] **El contrato de reportes, indicadores, alertas y cierre mensual** ([6.10](docs/08-plan-de-desarrollo.md#tarea-6-10)) — hecho, y
      **era la última tarea del trabajo del contrato**: con ella los diez módulos del plan están acordados
      antes de implementarse ([21 §3.2](docs/21-trabajo-en-paralelo.md#32-contrato-acordado-y-contrato-generado-no-se-contradicen)). Tenía **siete tareas detrás** por medio día: dos directas —el
      dashboard ([6.3](docs/08-plan-de-desarrollo.md#tarea-6-3)) y el reporte anual ([6.5](docs/08-plan-de-desarrollo.md#tarea-6-5))— y cinco indirectas: el gráfico de doce meses
      ([6.4](docs/08-plan-de-desarrollo.md#tarea-6-4)), el cierre mensual ([6.8](docs/08-plan-de-desarrollo.md#tarea-6-8)), el Inicio de solo consulta con su descarga ([6.9](docs/08-plan-de-desarrollo.md#tarea-6-9)) y,
      fuera del sprint, el simulador ([8.5](docs/08-plan-de-desarrollo.md#tarea-8-5)) y las unidades por vender ([8.6](docs/08-plan-de-desarrollo.md#tarea-8-6)). El `v0.17.0` estrena
      el rango `60`–`69`, **el último que seguía vacío**. Como el de capital y el de nómina, sale de
      los documentos y no de un dominio construido. Lo que decide: que **el Inicio es una sola
      consulta y no seis**; que **el promedio de ganancias y el punto de equilibrio faltan en vez de
      valer cero** cuando no hay de dónde sacarlos; que **cerrar un mes no manda cifras**, solo el
      período; y que **el aviso de caja libre del retiro lo impone la API** con el `40990`. Y cerró la
      consulta sin contrato que el `0.11.0` daba por escrita: los saldos por cuenta de la [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12)
- [x] **El contrato de nómina, simulador, cotizaciones e importación** ([8.11](docs/08-plan-de-desarrollo.md#tarea-8-11)) — hecho: tenía
      **once tareas detrás**, que es el [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8) entero menos él mismo. Seis directas —las empleadas
      ([8.1](docs/08-plan-de-desarrollo.md#tarea-8-1)), el simulador ([8.5](docs/08-plan-de-desarrollo.md#tarea-8-5)), el cotizador ([8.8](docs/08-plan-de-desarrollo.md#tarea-8-8)), el anticipo mínimo ([8.9](docs/08-plan-de-desarrollo.md#tarea-8-9)), el importador ([8.10](docs/08-plan-de-desarrollo.md#tarea-8-10)) y las
      tablas del cotizador ([8.12](docs/08-plan-de-desarrollo.md#tarea-8-12))— y cinco indirectas: los adelantos ([8.3](docs/08-plan-de-desarrollo.md#tarea-8-3)), la liquidación en la base
      ([8.2](docs/08-plan-de-desarrollo.md#tarea-8-2)), el desprendible ([8.4](docs/08-plan-de-desarrollo.md#tarea-8-4)), las unidades por vender ([8.6](docs/08-plan-de-desarrollo.md#tarea-8-6)) y las horas pagadas contra
      facturadas ([8.7](docs/08-plan-de-desarrollo.md#tarea-8-7)). El `v0.15.0` estrena **los tres rangos que quedaban vacíos** —`50`–`59`,
      `70`–`79` y `80`–`89`— y con eso los diez módulos del plan tienen el suyo. Como el de capital,
      **sale de los documentos y no de un dominio construido**. Lo que decide es **cómo baja un
      archivo**: dentro del sobre, en base64 y con tope de 5 MB, que sirve también para la descarga de
      la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10) y para devolver un adjunto ([3.6](docs/08-plan-de-desarrollo.md#tarea-3-6)). **Y cerró la migración sin tarea que la [8.8](docs/08-plan-de-desarrollo.md#tarea-8-8) daba por
      hecha**: `cotizaciones` y `cotizacion_lineas` son ahora la [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12).
- [x] **El contrato de capital** ([7.9](docs/08-plan-de-desarrollo.md#tarea-7-9)) — hecho: tenía **19 tareas detrás** por medio día de trabajo.
      Cuatro directas —las inversiones ([7.1](docs/08-plan-de-desarrollo.md#tarea-7-1)), los aportes ([7.2](docs/08-plan-de-desarrollo.md#tarea-7-2)), el pro-labore ([7.3](docs/08-plan-de-desarrollo.md#tarea-7-3)) y los sobres
      ([7.7](docs/08-plan-de-desarrollo.md#tarea-7-7))— y quince indirectas: el retiro partido ([7.4](docs/08-plan-de-desarrollo.md#tarea-7-4)), el patrimonio ([7.5](docs/08-plan-de-desarrollo.md#tarea-7-5)) y su alerta ([7.6](docs/08-plan-de-desarrollo.md#tarea-7-6)), y
      las tres cifras ([6.1](docs/08-plan-de-desarrollo.md#tarea-6-1)), que esperan al pro-labore y al retiro, con casi todo el [Sprint 6](docs/08-plan-de-desarrollo.md#sprint-6) detrás. El
      `v0.13.0` le da a Capital el rango `90`–`99`, que estaba reservado, y **a diferencia de los tres
      contratos anteriores no transcribe un dominio construido**: sale de los documentos. Lo que
      decide es cómo se parte un retiro cuando nadie lo dice, que el pro-labore y los sobres se
      definen desde el día en que se guardan, y que una inversión puede entrar sin cuenta. **Dejó para
      quien dirige que ninguno de sus cinco formularios tiene pantalla**, en el [§10](#10-decisiones-de-construcción-que-conviene-revisar).
- [x] **El contrato de productos y costeo** ([5.10](docs/08-plan-de-desarrollo.md#tarea-5-10)) — hecho: tenía **24 tareas detrás** por medio día
      de trabajo, y era lo que más liberaba. Dos directas —el catálogo ([5.2](docs/08-plan-de-desarrollo.md#tarea-5-2)) y el cuadro
      comparativo ([5.9](docs/08-plan-de-desarrollo.md#tarea-5-9))— y 22 indirectas, porque la cadena no se queda en el sprint: la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2)
      destraba el pedido con líneas ([4.3](docs/08-plan-de-desarrollo.md#tarea-4-3)), y de ahí salen la función de entrega ([4.5](docs/08-plan-de-desarrollo.md#tarea-4-5)) —del camino
      crítico—, las tres cifras ([6.1](docs/08-plan-de-desarrollo.md#tarea-6-1)) y con ellas casi todo el [Sprint 6](docs/08-plan-de-desarrollo.md#sprint-6). El `v0.12.0` estrena el
      rango `40`–`49`, y el contrato casi no decide: **transcribe el dominio que ya estaba
      construido** por la [5.1](docs/08-plan-de-desarrollo.md#tarea-5-1), la [5.3](docs/08-plan-de-desarrollo.md#tarea-5-3) y la [5.6](docs/08-plan-de-desarrollo.md#tarea-5-6). Lo que sí decide es que **a Operación no le
      llegan el costo, los márgenes ni los minutos**, con lo que la [5.8](docs/08-plan-de-desarrollo.md#tarea-5-8) deja de ser un `if`.
- [x] **El contrato de movimientos** ([3.13](docs/08-plan-de-desarrollo.md#tarea-3-13)) — hecho: tenía **32 tareas detrás** por medio día de
      trabajo, y era lo único que les faltaba a los endpoints ([3.4](docs/08-plan-de-desarrollo.md#tarea-3-4)). El `v0.11.0` llena el rango
      `20`–`29`, que estaba en tres de nueve. Un movimiento se registra con `PUT` a su propio id, se
      anula con motivo, se le adjunta el soporte y se lee con filtros; **se acordó antes de
      implementarlo** ([21 §3.2](docs/21-trabajo-en-paralelo.md#32-contrato-acordado-y-contrato-generado-no-se-contradicen)), así que el trabajo del front puede pintar el registro rápido ([3.5](docs/08-plan-de-desarrollo.md#tarea-3-5)) sin
      esperar a la API. **Y cerró la migración sin tarea que el [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10) había dejado anotada**: la tabla
      `adjuntos` es ahora la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14).
- [x] **El contrato de pedidos** ([4.10](docs/08-plan-de-desarrollo.md#tarea-4-10)) — hecho: tenía **22 tareas detrás**, una directa —la
      gestión de clientes ([4.2](docs/08-plan-de-desarrollo.md#tarea-4-2))— y 21 indirectas, y la [4.5](docs/08-plan-de-desarrollo.md#tarea-4-5) está en el camino crítico. El
      `v0.10.0` estrena el rango `30`–`39`, que estaba entero libre. **Dejó una pregunta para
      Gerencia y una migración sin tarea:** el mockup no tiene pantalla de clientes y `pedidos` no
      tiene dónde guardar el motivo de la cancelación, las dos en el [§10](#10-decisiones-de-construcción-que-conviene-revisar).
- [x] **Poner qa al día** ([1.12](docs/08-plan-de-desarrollo.md#tarea-1-12)) — hecho: **dev y qa vuelven a ser el mismo esquema**, y con eso se
      destraba la prueba de permisos contra qa ([2.11](docs/08-plan-de-desarrollo.md#tarea-2-11)). El retrato de antes desmintió al tablero en
      lo que más importaba: qa **sí** rechazaba ya el saldo negativo, el sobre del 120 % y el motivo
      en blanco, porque los dominios ([1.1](docs/08-plan-de-desarrollo.md#tarea-1-1)) y la revocación del borrado ([1.2](docs/08-plan-de-desarrollo.md#tarea-1-2)) llevaban tiempo
      aplicados allá. Lo que de verdad le faltaba eran cinco migraciones: las claves de idempotencia
      ([1.13](docs/08-plan-de-desarrollo.md#tarea-1-13)), su purga ([1.16](docs/08-plan-de-desarrollo.md#tarea-1-16)), las dos tablas del canal firmado ([2.20](docs/08-plan-de-desarrollo.md#tarea-2-20)) y las dos filas de versión.
      De 45 comprobaciones en falla a **109 en `OK`**. Queda al revés: dev sin la `0.3.0`.
- [ ] ⚡ **uat** ([9.12](docs/08-plan-de-desarrollo.md#tarea-9-12)) · Decisión — **la base ya existe, pero no el ambiente.** Es el proyecto
      que se creó para pre-prod, y quien dirige confirmó el 2026-10-14 que es el de uat; la viñeta
      del [§9](#9-a-vigilar) cuenta lo que eso deja pendiente. Prod salió de esta tarea con el [ADR-053](docs/adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md): el 08 solo le
      pide uat, y prod vive en el repositorio del taller. Lo que falta no cambia, y es **de pago**
      ([19 §8.1](docs/19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no)), y **ya no falta averiguar nada:** el expediente está en el
      [§7.1](#71-el-expediente-de-uat-y-prod) con la cifra —≈ 55 USD al mes—, cada fuente con su fecha de consulta y las cuatro
      condiciones del [ADR-026](docs/adr/ADR-026-railway-al-final.md) comprobadas contra Railway una por una. Lo que falta es la firma de
      Gerencia, que es el paso 2 del [09 §3.1](docs/09-plan-de-implantacion.md#31-alistamiento-técnico-de-los-ambientes), y hasta el [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9) no hay nada que promover a ellos.
- [x] **El repositorio de movimientos** ([3.3](docs/08-plan-de-desarrollo.md#tarea-3-3)) — hecho: tenía **36 tareas detrás** y abría el
      [Sprint 3](docs/08-plan-de-desarrollo.md#sprint-3) entero. Lo que el dominio calcula ya llega a PostgreSQL con la persona de la sesión,
      y quien juzga si puede escribirlo es `mov_insercion`, no la API. Detrás se abren los saldos por
      cuenta ([3.12](docs/08-plan-de-desarrollo.md#tarea-3-12)) y el anticipo como pasivo ([4.4](docs/08-plan-de-desarrollo.md#tarea-4-4)), y los endpoints ([3.4](docs/08-plan-de-desarrollo.md#tarea-3-4)) quedan esperando solo
      a su contrato.
- [x] **La gestión de usuarios** ([2.7](docs/08-plan-de-desarrollo.md#tarea-2-7)) — hecha: era lo que más quedaba por destrabar del
      [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2), y detrás se abren la tabla única de activos y desactivados ([2.15](docs/08-plan-de-desarrollo.md#tarea-2-15)), la bitácora
      con su reversión ([2.16](docs/08-plan-de-desarrollo.md#tarea-2-16)) y el cambio obligatorio al reactivar ([2.17](docs/08-plan-de-desarrollo.md#tarea-2-17)). **Hasta hoy las únicas
      personas que existían eran las seis de `seed.sql`**, con contraseñas conocidas; ahora Gerencia
      da de alta a quien haga falta, y el aviso de este mismo [§10](#10-decisiones-de-construcción-que-conviene-revisar) sobre esas contraseñas por fin se
      puede cerrar. Con ella entró el [ADR-033](docs/adr/ADR-033-service-role-solo-en-auth.md), que resolvió una contradicción que llevaba abierta
      desde el [CU-29](docs/02-casos-de-uso.md#cu-29): crear una identidad no tenía credencial con la que hacerse.
- [x] **La sesión de 30 días** ([2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)) — hecha: era lo último del acceso. La aplicación pasa de
      «entra y no la recargues» a usarse un día entero, y con ella entraron las tres operaciones de
      `/sesiones` que el front llamaba contra un 404.
- [x] **El filtro de firma** ([2.13](docs/08-plan-de-desarrollo.md#tarea-2-13)) — hecho: tenía **41 tareas detrás** y era el último eslabón
      del camino crítico [2.1](docs/08-plan-de-desarrollo.md#tarea-2-1) → [2.12](docs/08-plan-de-desarrollo.md#tarea-2-12) → esta. El canal firmado existe de los dos lados, y con él
      entró en servicio el registro de idempotencia.
- [x] **Una sola licencia** · Decisión — resuelta: **AGPL-3.0 en los cuatro repositorios**. La API y
      la base venían con GPL-3.0 del `Initial commit` con que GitHub crea un repositorio, sin que
      nadie la hubiera elegido, y el hueco caía justo donde importa: PRISMA no se distribuye, se
      **sirve por la red**, así que la GPL no obliga a publicar nada a quien tome la API, la
      modifique y la ofrezca como servicio. La sección 13 de la AGPL es lo que cierra eso, y estaba
      puesta en el front —que no decide nada— y no en la API, donde vive toda la lógica.
- [x] **La sesión contra Supabase Auth** ([2.1](docs/08-plan-de-desarrollo.md#tarea-2-1)) — hecha: era lo que más liberaba, con 51 tareas
      detrás, y con ella arranca el [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2) entero. El trabajo del front deja de estar parado, y la
      puerta a la base de la [1.6](docs/08-plan-de-desarrollo.md#tarea-1-6) pasa de estar probada a estar usada.
- [x] **La tabla `usuarios`** ([2.4](docs/08-plan-de-desarrollo.md#tarea-2-4)) — hecha: ya se le ve cumplir el [04 §4.2](docs/04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas) con sesión de verdad.
      Destrabó la [2.1](docs/08-plan-de-desarrollo.md#tarea-2-1), y con ella el [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2) entero.
- [x] **El filtro de idempotencia** ([1.14](docs/08-plan-de-desarrollo.md#tarea-1-14)) — hecha: tenía **46 tareas detrás**, y ninguna vuelve a
      tocarse por esto. Toda petición bajo `/api/v0/` exige `Idempotency-Key` ([ADR-020](docs/adr/ADR-020-idempotencia.md)) salvo el
      ingreso y la renovación, y **el filtro abre la única transacción de la petición**, que es lo
      que hace que la clave y el efecto caigan juntos. Registrar la clave espera al filtro de sesión
      ([2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)): hasta ese día ninguna petición trae identidad.
- [x] **La identidad hasta PostgreSQL** ([1.6](docs/08-plan-de-desarrollo.md#tarea-1-6)) — hecha: RLS ya juzga a la persona y no a
      `prisma_api`. Destrabó la prueba de permisos ([1.7](docs/08-plan-de-desarrollo.md#tarea-1-7)) y, con la tabla de la [1.13](docs/08-plan-de-desarrollo.md#tarea-1-13), la idempotencia
      ([1.14](docs/08-plan-de-desarrollo.md#tarea-1-14)); el acceso del [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2) espera ahora a la tabla `usuarios` ([2.4](docs/08-plan-de-desarrollo.md#tarea-2-4)).

---

## <a id="titulo-2"></a>2. <a id="sprint-0"></a>[Sprint 0](docs/08-plan-de-desarrollo.md#sprint-0) · proyectos, ambientes y contrato

- [x] [**0.1**](docs/08-plan-de-desarrollo.md#tarea-0-1) Proyecto `prisma_api`: Java 25, Spring Boot 4 y Gradle, con el esqueleto hexagonal · API
- [x] [**0.2**](docs/08-plan-de-desarrollo.md#tarea-0-2) Regla de frontera con ArchUnit en la integración continua · API
- [x] [**0.3**](docs/08-plan-de-desarrollo.md#tarea-0-3) Proyecto `prisma_front` en Flutter, web por defecto · Front
- [x] [**0.4**](docs/08-plan-de-desarrollo.md#tarea-0-4) Los proyectos **dev y qa** de Supabase · Decisión — los dos gratuitos, cada uno con
      su base, sus claves y su almacenamiento, y encima el esquema, la semilla y el rol `prisma_api`,
      con el que RLS ya juzga a la API. **Los dos de pago se fueron al [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9)**, a la [9.12](docs/08-plan-de-desarrollo.md#tarea-9-12): uat y
      prod los firma Gerencia y hasta allá no hay nada que promover a ellos
- [x] [**0.5**](docs/08-plan-de-desarrollo.md#tarea-0-5) Rol `prisma_api` sin `BYPASSRLS`, sin `SUPERUSER` y sin ser dueño de las tablas ·
      Base — creado en dev y en qa; en dev ya se comprobó que RLS lo juzga
- [x] [**0.6**](docs/08-plan-de-desarrollo.md#tarea-0-6) Secretos fuera del repositorio: variables de entorno en la API y `--dart-define` en el
      front · API, Front
- [x] [**0.7**](docs/08-plan-de-desarrollo.md#tarea-0-7) Integración continua por proyecto: formato, análisis, pruebas y compilación · API, Front
- [x] [**0.8**](docs/08-plan-de-desarrollo.md#tarea-0-8) Imagen de la API arrancando **en dev**, en Railway ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)) · API — la aplicación
      lee el `PORT` que le inyectan, y la sonda de disponibilidad mira la base en vez de responder
      `UP` con ella caída: `/actuator/health/readiness` contesta `UP` en dev, así que arranca **y**
      alcanza la base. Los otros tres ambientes, en el [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9)
- [x] [**0.9**](docs/08-plan-de-desarrollo.md#tarea-0-9) Entrega a dev al fusionar ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)), con la receta de construcción del front
      —`Dockerfile`, `nginx` y `.dockerignore`— que hasta ahora no existía · API, Front — dev sirve
      la `0.3.0`, que es lo último de `develop`, y los dos servicios tienen su último despliegue en
      `SUCCESS`. Se marcó **al ver el despliegue en verde**, no al fusionar: el
      artefacto publicado ya trae `X-Prisma-Firma`
- [x] [**0.10**](docs/08-plan-de-desarrollo.md#tarea-0-10) SemVer y migraciones con `schema_version` · Base — la tabla guarda una fila por
      versión publicada y hoy va por la `0.3.0`, con sus etiquetas de [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) puestas. Desde el
      [ADR-034](docs/adr/ADR-034-la-version-sube-en-cada-pr.md) la API la lee de la base, en vez de la variable `PRISMA_ESQUEMA`, y cada migración
      publica la suya en su mismo PR
- [x] [**0.11**](docs/08-plan-de-desarrollo.md#tarea-0-11) `POST /api/v0/consultas/version`: versión de la API, del esquema y ambiente · API
- [x] [**0.12**](docs/08-plan-de-desarrollo.md#tarea-0-12) Insignia `v0.1.0 · Desarrollo` en el pie de la barra lateral y franja de ambiente · Front
- [x] [**0.13**](docs/08-plan-de-desarrollo.md#tarea-0-13) El front comprueba el MAJOR de la API y bloquea con la pantalla del mockup · Front
- [x] [**0.14**](docs/08-plan-de-desarrollo.md#tarea-0-14) Sobre `{status, mensaje, data}` en toda respuesta, también en los errores · API
- [x] [**0.15**](docs/08-plan-de-desarrollo.md#tarea-0-15) Catálogo único de códigos de cinco dígitos · API, Contrato
- [x] [**0.16**](docs/08-plan-de-desarrollo.md#tarea-0-16) Prueba [C-03](docs/12-pruebas-y-calidad.md#c-03): el catálogo contra el código fuente, en los dos sentidos · API
- [x] [**0.17**](docs/08-plan-de-desarrollo.md#tarea-0-17) Descriptor de formulario generado del propio validador ([RF-102](docs/03-requisitos-y-bdd.md#rf-102)) · API
- [x] [**0.18**](docs/08-plan-de-desarrollo.md#tarea-0-18) Swagger en `/docs` y prueba [C-04](docs/12-pruebas-y-calidad.md#c-04) contra la copia fijada del contrato · API, Contrato
- [x] [**0.19**](docs/08-plan-de-desarrollo.md#tarea-0-19) Sistema de diseño del mockup en widgets: tablas, paneles de confirmación en línea, y
      fechas y porcentajes con el formato colombiano · Front — la tabla se desplaza de lado cuando
      no cabe en vez de encoger las columnas, y el panel de confirmación no trae ninguna regla:
      el campo y el mensaje de error se los pasan

**Hecho fuera de la numeración:**

- [x] CORS con un origen por ambiente · API
- [x] Hilos virtuales de Java 25 en cada petición, vigilados por `HilosVirtualesTest` · API
- [x] Java 25, Gradle y Spring Boot 4 ([ADR-024](docs/adr/ADR-024-java-25-y-gradle.md)) · API
- [x] Cuatro repositorios en GitHub, cada uno con su remoto ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md)); este, desde el 16/09/2026 · Decisión
- [x] Contrato v0.2.0 en `contrato/`, con su copia fijada en la API · Contrato
- [x] Alojamiento: Railway, con dev en línea desde ya y los otros tres al final ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)) · Decisión
- [x] Hito [H0](docs/08-plan-de-desarrollo.md#h0): mockup confirmado por Gerencia el 16/09/2026 · Decisión

**Hito [H1](docs/08-plan-de-desarrollo.md#h1):** la insignia y el sobre en toda respuesta ya se cumplen; el despliegue automático a dev
se cierra con la [0.9](docs/08-plan-de-desarrollo.md#tarea-0-9), que volvió a este sprint por [ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md).

---

## <a id="titulo-3"></a>3. <a id="sprint-1"></a>[Sprint 1](docs/08-plan-de-desarrollo.md#sprint-1) · base, RLS, identidad e idempotencia

✏️ quiere decir que el SQL ya está en la migración inicial de `prisma_db`
(`20260915120000_esquema_inicial.sql`) pero nunca corrió contra una base: no cuenta como hecho
hasta aplicarlo y probarlo.

- [x] [**1.1**](docs/08-plan-de-desarrollo.md#tarea-1-1) Esquema completo con restricciones con nombre explícito · Base — en dev: los **nueve
      dominios** de [04 §4.1](docs/04-modelo-de-datos.md#41-tipos-y-convenciones-comunes) puestos en sus **61 columnas** —solo doce traían la regla escrita a
      mano—, once restricciones y un índice renombrados como los llama el documento, y **ninguna
      restricción con el nombre que le puso PostgreSQL**
- [x] [**1.2**](docs/08-plan-de-desarrollo.md#tarea-1-2) Revocar `DELETE` y `TRUNCATE` · Base — a **todos** los roles menos al dueño, no solo a
      `authenticated`: `anon` borraba filas de verdad por la Data API y **vaciaba `auditoria` con un
      `TRUNCATE`**, que no pasa por RLS
- [x] [**1.3**](docs/08-plan-de-desarrollo.md#tarea-1-3) Triggers de auditoría sobre las tablas de negocio · Base — las catorce tablas de
      [04 §5.4](docs/04-modelo-de-datos.md#54-auditoría-por-triggers) escriben, y la anulación queda marcada `ANULAR` y no `UPDATE`. Una sesión no puede
      escribir la bitácora por su cuenta
- [x] [**1.4**](docs/08-plan-de-desarrollo.md#tarea-1-4) `fn_es_gerencia` y políticas RLS · Base — probadas **con sesión real**: Operación se ve
      solo a sí misma y no alcanza retiros, pro-labore, sobres, cierres, costos ni bitácora;
      Gerencia ve todo y ni ella degrada a la última Gerencia
- [x] [**1.5**](docs/08-plan-de-desarrollo.md#tarea-1-5) `FORCE ROW LEVEL SECURITY` · Base — en **catorce** tablas, en dev y en qa. No en
      `usuarios` ni en `auditoria`, que [04 §7.1](docs/04-modelo-de-datos.md#71-force-row-level-security-por-qué-ahora-sí-hace-falta) excluye a propósito: a la primera le volvería la
      recursión infinita y la segunda dejaría de escribirse entera
- [x] [**1.6**](docs/08-plan-de-desarrollo.md#tarea-1-6) Transacción por petición con `request.jwt.claims` y `SET LOCAL ROLE authenticated` · API —
      `ConIdentidad` fija los claims con `set_config(…, true)` y el rol con `SET LOCAL`, así que los dos se
      van con la transacción; los repositorios piden el acceso a `jdbc()`, que fuera de ella lanza
      `ConsultaSinIdentidad` ([T-01](docs/12-pruebas-y-calidad.md#t-01)). Siete pruebas contra la base local, conectada como `prisma_api`, y
      rotas a propósito: sin el `true`, la identidad de una petición se quedaba pegada a la conexión
      y la siguiente veía lo que no debía. Las corre `./gradlew integracion`, no `build`
- [x] [**1.7**](docs/08-plan-de-desarrollo.md#tarea-1-7) Prueba de permisos con sesión real · API — marcela entra **por HTTP, con su
      usuario y su contraseña**, y de esa sesión de Operación salen [P-01](docs/12-pruebas-y-calidad.md#p-01) a [P-32](docs/12-pruebas-y-calidad.md#p-32): el patrimonio, los costos, la
      auditoría y las cuatro tablas de Gerencia llegan vacías —y la base tiene filas en todas, o el
      vacío no probaría nada—; el desprendible propio llega y el ajeno no; y crear un usuario,
      ascenderse sola, tocar el catálogo de cargos, corregir un cliente o registrarse un adelanto
      los rechaza PostgreSQL. De cada rechazo se afirma **que trajo el `42501` de una política o el
      `P0001` de un trigger**, no que lanzó algo. [P-32](docs/12-pruebas-y-calidad.md#p-32) repite la lectura **sin capa de aplicación en
      medio** y el resultado no cambia. **Y la tubería ya las corre**: un trabajo nuevo descarga
      `prisma_db` por etiqueta y levanta Supabase ([ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) [§3](#3-sprint-1--base-rls-identidad-e-idempotencia)), así que [C-01](docs/12-pruebas-y-calidad.md#c-01) y las demás por fin
      gatean un PR. Rota a propósito abriendo `usuarios_lectura`: [P-10](docs/12-pruebas-y-calidad.md#p-10) y [P-32](docs/12-pruebas-y-calidad.md#p-32) en rojo las dos
- [x] [**1.8**](docs/08-plan-de-desarrollo.md#tarea-1-8) Traducción restricción → código del catálogo · API —
      `TraduccionDeRestricciones` cruza `(objeto, restricción)` con el catálogo, y [C-01](docs/12-pruebas-y-calidad.md#c-01) la compara
      con `pg_constraint` en las dos direcciones: renombrar una restricción falla las dos a la vez
- [x] [**1.9**](docs/08-plan-de-desarrollo.md#tarea-1-9) `Dinero` en Java y en Dart · API, Front — en la API, sumas que fallan al desbordar,
      porcentaje `HALF_UP` y formato colombiano; en el front, un tipo sin operadores y su formato en
      `ui/formato/moneda.dart`. Pruebas con las cifras de los documentos [05](docs/05-reglas-financieras.md) y [06](docs/06-nomina-y-capacidad-de-pago.md), verificadas en negativo
- [x] [**1.10**](docs/08-plan-de-desarrollo.md#tarea-1-10) Cuentas y categorías: endpoints y pantalla ([RF-97](docs/03-requisitos-y-bdd.md#rf-97)) · API, Front, Base —
      salió de un rojo que se veía en dev: las tres listas del registro rápido decían «no se
      pudieron cargar las opciones», y el aviso era cierto, porque las rutas que el formulario
      «movimiento» nombra en `origen` estaban acordadas desde la [1.17](docs/08-plan-de-desarrollo.md#tarea-1-17) y no las servía nadie. Ahora
      existen las cuatro operaciones: las cuentas **sin saldo**, para que Operación elija sin ver la
      caja; el árbol de categorías con su naturaleza, su marca de fijo y su madre; y el alta de cada
      una, que estrena `42220`, `42221` y `42222` y el tipo de campo `casilla`. El «solo Gerencia»
      del contrato **lo impone ahora la base** —`cuentas_escritura` y `categorias_escritura`, con el
      molde de `cargos`—, que era la decisión que el [§10](#10-decisiones-de-construcción-que-conviene-revisar) le dejó anotada a esta tarea: sin la
      migración, Operación creaba las dos. En el front, el panel «Cuentas de dinero» vive dentro de
      Movimientos y **se pinta solo si la navegación lo dice**, en el campo `puedeGestionarCuentas`
      que estrena el contrato `0.16.0`. 133 comprobaciones de la base en `OK`, 701 pruebas y 12 de
      integración en la API, y 317 en el front
- [x] [**1.11**](docs/08-plan-de-desarrollo.md#tarea-1-11) Semilla reproducible para dev y qa · Base — ids y fechas escritos,
      re-ejecutable sin borrar nada, y con filas en toda tabla que leen [P-01](docs/12-pruebas-y-calidad.md#p-01) a [P-31](docs/12-pruebas-y-calidad.md#p-31), porque una tabla
      vacía hace pasar «no ve lo ajeno» por la razón equivocada. `scripts/db/sembrar.ps1` la lleva a
      dev y a qa, y se niega con uat y prod. 78 comprobaciones en `OK` contra la base local, y la
      semilla corrida entera contra dev dentro de una transacción revertida
- [x] [**1.12**](docs/08-plan-de-desarrollo.md#tarea-1-12) Primera promoción de migraciones dev → qa · Base — corrida con el
      procedimiento del [16 §5.3](docs/16-base-de-datos-y-snapshots.md#53-promover-a-qa-paso-a-paso), que estrenó su paso 0: apuntar el CLI a qa, porque
      `--linked` obedece al último `supabase link` y ese apuntaba a dev. El retrato de antes dio **45
      comprobaciones en falla de 109**; el de después, **109 en `OK`**, con la semilla recargada. Se
      aplicaron **cinco** migraciones y no las cuatro que decían los documentos: los dominios y la
      revocación del borrado **ya estaban en qa**, y lo que le faltaba de verdad era la idempotencia
      entera, el canal firmado entero y la purga. `schema_version` publica `0.3.0`, que esta misma
      tarea escribió para no dejar a la `0.2.0` describiendo de menos
- [x] [**1.13**](docs/08-plan-de-desarrollo.md#tarea-1-13) Tabla `peticiones_idempotentes` · Base — transcrita del [04 §4.9](docs/04-modelo-de-datos.md#49-claves-de-idempotencia) en
      una migración nueva, con su índice por vencimiento, las tres políticas `idem_*` y `FORCE`. Cada
      persona lee, escribe y sella solo sus claves, **y Gerencia no es excepción**; nadie que atienda
      peticiones borra una. `verificar-base.sql` lo pregunta con sesión de verdad ([P-33](docs/12-pruebas-y-calidad.md#p-33), [P-34](docs/12-pruebas-y-calidad.md#p-34) y
      [P-37](docs/12-pruebas-y-calidad.md#p-37)) y lo vio fallar abriendo cada política. Sin trigger de auditoría ni purga, que es la [1.16](docs/08-plan-de-desarrollo.md#tarea-1-16)
- [x] [**1.14**](docs/08-plan-de-desarrollo.md#tarea-1-14) Filtro de idempotencia · API — el filtro abre **la única transacción de la
      petición** y corre la cadena adentro, así que la fila de la clave y el efecto se confirman o se
      revierten juntos ([20 §5.5](docs/20-contrato-de-api.md#55-la-regla-que-hace-que-esto-sea-real-y-no-decorativo)); una regla de ArchUnit deja que nadie más la abra. La cabecera se
      exige en toda petición, lea o escriba, con las dos de sesión exentas por ruta exacta, y la
      frontera la escribe un solo sitio que usan el filtro **y** el OpenAPI generado. Las cuatro
      situaciones del [20 §5.2](docs/20-contrato-de-api.md#52-las-cuatro-situaciones) probadas contra la base, más la clave vencida que se reutiliza y el
      `5xx` que no se guarda: 447 pruebas en verde y 20 de integración
- [x] [**1.15**](docs/08-plan-de-desarrollo.md#tarea-1-15) Prueba de corte entre el efecto y la clave · API — [I-02](docs/12-pruebas-y-calidad.md#i-02)
      no espera el corte: lo provoca en los tres sitios donde puede caer. **Entre las dos
      escrituras** —con la fila de la clave ya puesta, que el endpoint mira antes de reventar,
      para que el verde no sea el de una operación que nunca empezó—, **después del efecto**, y
      **sin aviso**: le matan la conexión desde fuera con el gasto ya escrito, así que nadie pide
      ningún `rollback` y lo que cumple la promesa es PostgreSQL. Los tres cuentan **las filas de
      las dos tablas**. Rotos a propósito sacando la clave a su propia transacción: los cortes en
      rojo e [I-01](docs/12-pruebas-y-calidad.md#i-01) en verde, que es justo lo que el [12 §10.1](docs/12-pruebas-y-calidad.md#101-i-02--el-corte-es-lo-que-hace-real-la-idempotencia) dice que
      pasa. 131 de integración
- [x] [**1.16**](docs/08-plan-de-desarrollo.md#tarea-1-16) Purga de claves vencidas a las 72 horas · API, Base — `pg_cron` agenda
      `purgar_peticiones_idempotentes` con el horario y la sentencia del [04 §4.9](docs/04-modelo-de-datos.md#49-claves-de-idempotencia), corriendo como el
      rol de migraciones y no como el de la aplicación, que sigue sin `DELETE`. `verificar-base.sql`
      no mira el catálogo: siembra una clave vencida y una vigente, corre la purga y pregunta qué
      quedó ([P-38](docs/12-pruebas-y-calidad.md#p-38)), y comprueba que la vigilancia del [16 §10.2](docs/16-base-de-datos-y-snapshots.md#102-cómo-se-vigila-que-siguen-corriendo) calla sana y habla con una fila
      vieja ([P-39](docs/12-pruebas-y-calidad.md#p-39)). 83 comprobaciones en `OK` y cinco roturas a propósito vistas fallar
- [x] [**1.17**](docs/08-plan-de-desarrollo.md#tarea-1-17) Contrato de cuentas y categorías · Contrato — `openapi.json` v0.3.0: leer y crear
      de `/cuentas` y `/categorias`, los formularios `cuenta` y `categoria` con sus mensajes, y los
      códigos `42220` a `42222`. El descriptor suma `opciones`, `origen` y el tipo `casilla`, que es
      lo que una lista necesitaba para pintarse sin que el front decida nada. La copia fijada en
      `prisma_api` sube con la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10)
- [x] [**1.18**](docs/08-plan-de-desarrollo.md#tarea-1-18) Renderizador del descriptor de formulario en el front ([RF-102](docs/03-requisitos-y-bdd.md#rf-102)) · Front — pinta los cinco
      tipos de campo con el teclado, los límites, las opciones y los avisos que manda la API, y
      entrega los valores listos para una `Accion`. Un descriptor que no se puede pintar entero no se
      pinta: la prueba que sostiene el requisito cambia el mensaje en el descriptor y exige que
      cambie el de la pantalla
- [x] [**1.19**](docs/08-plan-de-desarrollo.md#tarea-1-19) Cliente HTTP con `Idempotency-Key`, generada una vez por acción ([ADR-020](docs/adr/ADR-020-idempotencia.md)) · Front — la
      clave nace con la `Accion` y no con la petición: reenviar la misma acción es reintentar, y
      crear otra es hacer otra cosa
- [x] [**1.20**](docs/08-plan-de-desarrollo.md#tarea-1-20) Decidir cómo consiguen la API y su CI el esquema de `prisma_db` · Decisión — por
      **etiqueta** ([ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md)): `prisma_db` etiqueta cada versión del esquema, la API declara la que
      necesita en `prisma.esquema` y su integración continua descarga ese repositorio en esa etiqueta
      y levanta la base con el Supabase CLI. Las pruebas de integración llevan etiqueta de JUnit y no
      corren en la compilación normal, que es la única forma de trabajar sin Docker
- [x] [**1.21**](docs/08-plan-de-desarrollo.md#tarea-1-21) `anon` no toca nada · Base — la migración escribe el bloque del
      [04 §9.1](docs/04-modelo-de-datos.md#91-anon-no-toca-nada) y le suma el `EXECUTE` de las cinco funciones, que ese bloque no nombra.
      No era teórico: contra la base local, `anon` —cuya clave es pública— leía **las 352 filas de
      `movimientos`**, miraba la secuencia de la auditoría y ejecutaba `fn_es_gerencia`. Apagar la
      Data API lo tapa en el proyecto donde se apaga y en ninguno más, así que **uat y prod nacerían
      abiertos**; el `ALTER DEFAULT PRIVILEGES` es lo que hace que la próxima tabla nazca cerrada.
      `schema_version` publica `0.7.0`, y `verificar-base.sql` lo pregunta volviéndose `anon` en vez
      de mirar el catálogo: **150 comprobaciones en `OK`**, nueve suyas

---

## <a id="titulo-4"></a>4. <a id="sprint-2"></a>[Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2) · acceso, usuarios, cargos y canal firmado

- [x] [**2.1**](docs/08-plan-de-desarrollo.md#tarea-2-1) Autenticación contra Supabase Auth desde la API, con el correo sintético en el
      servidor · API — `POST /api/v0/sesiones`, y con ella **la primera transacción con identidad
      que abre una petición de verdad**: la ficha de `usuarios` se lee con RLS juzgando, no con un
      `if`. El usuario se normaliza y el correo se arma en el servidor ([ADR-009](docs/adr/ADR-009-login-por-usuario.md)); un usuario que no
      existe y una contraseña equivocada responden **el mismo cuerpo byte a byte** ([A-04](docs/12-pruebas-y-calidad.md#a-04)), y el
      desactivado responde `40301` solo con la contraseña correcta. Trae el tipo de campo `clave`,
      el formulario «acceso» y los códigos `40104` y `40301`. Veintisiete pruebas nuevas, 417 en
      verde, y siete más entrando con las cinco personas de la semilla contra el Supabase local
- [x] [**2.2**](docs/08-plan-de-desarrollo.md#tarea-2-2) Sesión de 30 días y enrutamiento según la navegación que dicta la API · API, Front —
      **la sesión sobrevive a recargar la página**, que es lo que faltaba para que la aplicación se
      pueda usar: el token y la clave de firma siguen viviendo solo en memoria ([ADR-021](docs/adr/ADR-021-canal-firmado.md)) y lo que
      queda es la cookie `prisma_renovacion`, `HttpOnly`, que el front **no puede leer** —se comprobó
      en Chrome: `document.cookie` viene vacío—. Con ella entran las otras tres operaciones de
      `/sesiones`, que el front llamaba y respondían 404: renovar, cerrar y cambiar la propia
      contraseña. Un token vencido pasa a responder `40100` y no `40101`, y con eso el cliente
      renueva y reintenta solo en vez de mandar a la pantalla de acceso cada hora. Arriba, el topbar
      del [10 §5.3](docs/10-ux-y-mockups.md#53-la-sesión-en-el-topbar) con la identidad ([RF-83](docs/03-requisitos-y-bdd.md#rf-83)) y el menú de la sesión, donde «Gestión de usuarios»
      aparece solo si la API lo dijo
- [x] [**2.3**](docs/08-plan-de-desarrollo.md#tarea-2-3) Tabla `cargos` con semilla y RLS · Base — **sin migración nueva**: la tabla,
      sus seis cargos de arranque y sus dos políticas ya eran las del [04 §4.2](docs/04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas) y el [§7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls). Lo
      que la cierra es verla juzgar con sesión real ([P-14](docs/12-pruebas-y-calidad.md#p-14) y [P-15](docs/12-pruebas-y-calidad.md#p-15)): Operación lee el catálogo, no
      crea un cargo y su intento de desactivar uno no alcanza ninguna fila; Gerencia crea y desactiva,
      y ni ella desactiva sin motivo. Once comprobaciones en `verificar-base.sql`, en verde en local
      y en dev
- [x] [**2.4**](docs/08-plan-de-desarrollo.md#tarea-2-4) Tabla `usuarios` con `usuario`, `nombre_completo`, `cargo_id` y `tipo` · Base —
      **sin migración nueva**, como la [2.3](docs/08-plan-de-desarrollo.md#tarea-2-3): la tabla ya traía las trece columnas del [04 §4.2](docs/04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas), sus
      nueve restricciones con nombre y el índice parcial `idx_usuarios_tipo`. Lo que la cierra es
      verla cumplir: el formato de `usuario`, el único **sin distinguir mayúsculas** —que es para lo
      que está el `CITEXT`—, el nombre de tres letras, el cargo que tiene que existir y la
      desactivación con motivo, autor y hora. Diez comprobaciones más en `verificar-base.sql`, cada
      una **diciendo con qué sesión corre**: `tg_congelar_ficha_propia` es un trigger `BEFORE` y
      rechaza antes que la restricción a todo el que no sea Gerencia, ni siquiera el dueño de la
      tabla
- [x] [**2.5**](docs/08-plan-de-desarrollo.md#tarea-2-5) Trigger `tg_proteger_ultima_gerencia` · Base — estaba escrito desde la
      migración inicial y **no lo había probado nadie**, que es lo que le daba la ✏️. Él y
      `tg_verificar_gerencia_restante` son **lo único** que impide que el sistema se quede sin
      quien lo administre: no hay `CHECK`, ni política, ni columna detrás. De los tres caminos
      del [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) solo uno tenía comprobación —y vivía en el bloque 1.4, que es de otra
      tarea—; ahora están los tres y ese se mudó a su sitio. **176 comprobaciones en `OK`**,
      nueve suyas, y rota a propósito el informe saca 25 rojas. Sin migración: el esquema se
      queda en `0.9.0`, porque las pruebas no piden versión ([ADR-034](docs/adr/ADR-034-la-version-sube-en-cada-pr.md))
- [x] [**2.6**](docs/08-plan-de-desarrollo.md#tarea-2-6) Pantalla de acceso y cambio obligatorio de contraseña · Front — las dos capas del
      mockup, con sus campos pedidos a `POST /api/v0/consultas/formularios`, «acceso» y «cambio-de-clave».
      «Crea tu contraseña» no se puede saltar porque el tablero **no está en el árbol** hasta que la
      cambie ([BDD-32-1](docs/03-requisitos-y-bdd.md#bdd-32-1)), y ningún mensaje de la API vive en el front: una prueba de frontera
      falla si aparece. Trae el sexto tipo de campo del descriptor, `clave`, que el contrato v0.4.0
      agregó y el renderizador de la [1.18](docs/08-plan-de-desarrollo.md#tarea-1-18) todavía no conocía
- [x] [**2.7**](docs/08-plan-de-desarrollo.md#tarea-2-7) Gestión de usuarios: crear, editar, desactivar con motivo y restablecer clave · API, Front —
      Gerencia ya puede dar de alta a alguien, que hasta ahora solo sabía hacerlo `seed.sql`. Las
      seis operaciones acordadas menos la reactivación, que es la [2.15](docs/08-plan-de-desarrollo.md#tarea-2-15), y **ni un permiso escrito
      en la API**: quien decide si Gerencia puede crear es `usuarios_insercion`, y al último usuario
      de Gerencia lo rechaza un trigger que estaba puesto desde el esquema inicial. El descriptor
      estrena `opciones` y `origen`, que el contrato declaraba y ningún formulario usaba
- [x] [**2.8**](docs/08-plan-de-desarrollo.md#tarea-2-8) Catálogo de cargos: crear, renombrar, reordenar y desactivar con motivo · API, Front —
      las seis operaciones estaban acordadas desde el contrato `0.4.0` y **ninguna existía**: las
      seis rutas respondían 404. Ahora existen, con los dos códigos que el contrato promete y que
      la API no sabía emitir —el `42214` del nombre repetido y el `40911` del cargo que todavía
      tienen personas—, y **los dos los decide la base**: el primero es `cargos_nombre_key` sobre la
      columna `CITEXT` de la [2.22](docs/08-plan-de-desarrollo.md#tarea-2-22) y el segundo es su trigger, reconocido por el texto de su
      `RAISE` como ya se hacía con el último usuario de Gerencia. `asignables()` se muda al puerto
      de cargos, que es donde vive el catálogo desde hoy. En el front, el **bloque B** de Gestión
      de usuarios, con dos flechas para mover un cargo. La API sube a la `0.9.0` del esquema, que
      es lo que estas dos reglas necesitan. **744 pruebas y 140 de integración** en la API y **323**
      en el front. Destraba la [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16), que era la última 🔒 del sprint
- [x] [**2.9**](docs/08-plan-de-desarrollo.md#tarea-2-9) Registro de cada inicio de sesión con fecha, dispositivo e IP · API, Base —
      el contrato lo prometía desde el `0.4.0` y **la API no escribía ninguno de los tres**: ni
      `inicio_sesion`, ni `inicio_sesion_fallido`, ni `cierre_sesion`. Ahora los escribe
      `fn_registrar_evento`, que es lo único que puede —`auditoria` tiene RLS y ninguna política de
      inserción—, y el fallido va desde una transacción **autenticada y sin nadie adentro**, porque
      cuando el usuario no existe no hay `sub` que poner. Del intento se guarda el usuario tecleado
      **solo si tiene forma de nombre de usuario** ([RNF-18](docs/03-requisitos-y-bdd.md#rnf-18)). La otra mitad es de Base: `fn_auditar`
      deja de sacar el dispositivo de una variable que nadie llenaba y la IP de `inet_client_addr()`,
      que era **la de la API**, y las toma de las cabeceras que ahora publica `ConIdentidad`. De paso
      desactiva una mina que llevaba puesta desde la migración inicial: `''::json`. `schema_version`
      publica `0.10.0`, la API pasa a exigir la `0.8.0` —y con eso **[C-01](docs/12-pruebas-y-calidad.md#c-01) vuelve a verde**, porque
      entran las dos filas de traducción que la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) dejó pedidas—, y `verificar-base.sql` va en
      **181 comprobaciones en `OK`**, cinco de ellas suyas
- [x] [**2.10**](docs/08-plan-de-desarrollo.md#tarea-2-10) Panel «Acerca de» ([RF-100](docs/03-requisitos-y-bdd.md#rf-100)) · Front, API — los seis datos de [19 §5.3](docs/19-ambientes-y-entrega.md#53-el-panel-acerca-de), y lo que
      no se pudo consultar lo dice en vez de inventarlo
- [x] [**2.11**](docs/08-plan-de-desarrollo.md#tarea-2-11) La prueba de permisos del [Sprint 1](docs/08-plan-de-desarrollo.md#sprint-1), también contra la base de qa · API —
      el código está en `develop` desde el PR #24: la guarda pregunta por la semilla y no por el
      anfitrión, el segundo cerrojo pide que se diga por escrito antes de salir de la máquina, y el
      trabajo `permisos-en-qa` del CI la lanza en cada empuje a `develop` saltándose con aviso si
      faltan secretos. La configuración de qa —contraseña del rol y los seis secretos— es la [9.13](docs/08-plan-de-desarrollo.md#tarea-9-13)
- [x] [**2.12**](docs/08-plan-de-desarrollo.md#tarea-2-12) Clave de firma de sesión, solo en memoria en el front · API, Front — la API ya la entregaba; ahora el front **firma con ella**: `Authorization` y las tres cabeceras del [20 §6.1](docs/20-contrato-de-api.md#61-las-tres-cabeceras) en cada petición con sesión, y ninguna en las dos rutas exentas
- [x] [**2.13**](docs/08-plan-de-desarrollo.md#tarea-2-13) Filtro de firma: HMAC, nonce y marca de tiempo (`40101` a `40103`) · API — el
      canal firmado existe por fin de los dos lados: desde la [2.12](docs/08-plan-de-desarrollo.md#tarea-2-12) el front mandaba las tres
      cabeceras y **nadie las miraba**. Los cuatro casos del [H3](docs/08-plan-de-desarrollo.md#h3) corren contra la base: pasa firmada,
      `40103` al reenviarla tal cual, `40102` con la marca corrida seis minutos a cualquiera de los
      dos lados, y `40101` con un byte cambiado en el cuerpo después de firmar
- [x] [**2.14**](docs/08-plan-de-desarrollo.md#tarea-2-14) Navegación dictada por la API ([RF-103](docs/03-requisitos-y-bdd.md#rf-103)) · API, Front — la API
      decide qué secciones ve cada tipo y el front las pinta **sin ninguna lista propia**: una
      prueba de frontera falla si alguien escribe una en `lib/`. Y con ella el filtro de firma
      **publica la identidad**, que es lo que destraba el registro de idempotencia: llevaba desde
      la [1.14](docs/08-plan-de-desarrollo.md#tarea-1-14) escrito y sin usarse porque ninguna petición traía identidad
- [x] [**2.15**](docs/08-plan-de-desarrollo.md#tarea-2-15) Tabla única de usuarios activos y desactivados ([RF-84](docs/03-requisitos-y-bdd.md#rf-84) a [RF-87](docs/03-requisitos-y-bdd.md#rf-87)) · API, Front —
      `POST /api/v0/usuarios/{id}/reactivacion`, la séptima operación y **la última que le faltaba
      a la gestión de usuarios**: el contrato la declaraba desde el `0.4.0` y la ruta respondía 404.
      **Sin migración**: lo que necesitaba ya lo habían dejado puesto la [2.21](docs/08-plan-de-desarrollo.md#tarea-2-21) —la columna
      `auditoria.motivo`, la acción `usuario_reactivado` y `fn_registrar_evento`— y la [2.9](docs/08-plan-de-desarrollo.md#tarea-2-9), que
      publica el dispositivo y la IP de verdad en `request.headers`. **El porqué de una reactivación
      vive en `auditoria.motivo` y en ningún otro sitio**, que es la consecuencia de limpiar
      `desactivado_motivo`: la ficha dice el estado actual y el porqué es historia. Por eso la ficha
      y la entrada se escriben dentro de la misma transacción —una bitácora que no se pueda escribir
      deshace también la reactivación ([ADR-004](docs/adr/ADR-004-base-solo-escritura.md))—, y `debe_cambiar_clave` se enciende en el
      mismo `UPDATE`, sin un instante en que la clave vieja sirva ([RF-90](docs/03-requisitos-y-bdd.md#rf-90)). Reactivar a quien no
      se puede ver responde **`40400` y no `40300`**: `usuarios_lectura` no deja ver esa fila, así
      que para esa sesión esa persona no existe. En el front, **una sola tabla** con su separador, y
      la columna Estado pasa a ser el botón que cambia el estado, con la fecha y la hora de la baja
      debajo; «Desactivar» deja de ser acción de fila. La copia fijada del contrato va a `0.15.0`,
      con 25 de las 86 rutas. **753 pruebas y 146 de integración** en la API y **329** en el front
- [x] [**2.16**](docs/08-plan-de-desarrollo.md#tarea-2-16) Bitácora de cambios y reversión sin borrar ([RF-88](docs/03-requisitos-y-bdd.md#rf-88), [RF-89](docs/03-requisitos-y-bdd.md#rf-89), [RF-91](docs/03-requisitos-y-bdd.md#rf-91)) · Base, API, Front —
      **los cambios ya se pueden leer y deshacer.** Ocho de los doce eventos con nombre no los
      escribía nadie: la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) es anterior a `fn_registrar_evento` y la [2.8](docs/08-plan-de-desarrollo.md#tarea-2-8) no quiso escribir
      la mitad, así que `auditoria` tenía los cambios como el `INSERT` o el `UPDATE` genérico del
      trigger, que no distingue un cambio de nombre de una desactivación. Ahora los escribe quien
      los provoca, **uno por campo cambiado**: una edición que toca el nombre, el cargo y el tipo
      deja tres entradas, o no habría forma de decir cuál revierte quien pulse el botón. **Sin
      migración**, como la [2.3](docs/08-plan-de-desarrollo.md#tarea-2-3) y la [2.5](docs/08-plan-de-desarrollo.md#tarea-2-5): `revierte_a`, su índice único,
      `reversion_con_origen` y la vista estaban puestos desde el esquema inicial y la [2.21](docs/08-plan-de-desarrollo.md#tarea-2-21), y lo
      que faltaba era verlos cumplir —**187 comprobaciones en `OK`**, seis suyas—. **Revertir es
      aplicar el «antes» de la entrada**, así que el caso de uso no interpreta doce eventos sino un
      dato, y revertir una reversión sale gratis. Los dos rechazos que decide la API son el `40912`
      —la contraseña anterior nunca se guardó— y el `40913` —nadie se cierra la puerta por dentro—;
      el `40910` de la última Gerencia lo siguen rechazando los dos guardianes de siempre, y **una
      reversión que un guardián tumba ni llega a anotarse**, porque el `UPDATE` y la entrada van en
      la misma transacción. En el front, el panel de en medio, con el botón que **no se apaga**: el
      porqué lo redacta la API y `frontera_test.dart` falla si alguna de esas frases aparece en
      `lib/`. La copia fijada del contrato va a `0.16.0`, con 27 de las 86 rutas. **801 pruebas y
      154 de integración** en la API y **336** en el front
- [x] [**2.17**](docs/08-plan-de-desarrollo.md#tarea-2-17) Cambio de clave obligatorio al reactivar ([RF-90](docs/03-requisitos-y-bdd.md#rf-90)) · API, Front — **lo que faltaba
      no era encenderlo, era cumplirlo**: la [2.15](docs/08-plan-de-desarrollo.md#tarea-2-15) ya dejaba `debe_cambiar_clave` en cierto al
      reactivar, pero el contrato promete `40302` en 80 rutas y la API lo lanzaba en una, así que lo
      único que separaba del sistema entero a quien no ha creado su contraseña era que el front no le
      pintara el tablero ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). Ahora el filtro de firma lo rechaza en todas menos las **seis**
      que el contrato exime —entrar, renovar, salir, cambiarse la clave, la versión y los
      formularios—, y lee la marca de la ficha en cada petición, así que crearla abre el resto **sin
      renovar la sesión**. El rechazo llega **antes** de gastar el nonce y la clave de idempotencia.
      En el front, el aviso del panel de reactivación decía que la clave anterior dejaba de servir y
      no era cierto ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). **801 pruebas y 159 de integración** en la API y **342** en el front
- [x] [**2.18**](docs/08-plan-de-desarrollo.md#tarea-2-18) Vista previa de Operación para Gerencia ([RF-92](docs/03-requisitos-y-bdd.md#rf-92) a [RF-94](docs/03-requisitos-y-bdd.md#rf-94)) · Front, API — el
      contrato ya la declaraba entera y ahora el servidor la cumple: `vista=operacion` devuelve el
      menú de Operación y el aviso de la franja, y **volver a mi vista es pedir la navegación con el
      cuerpo vacío**, que por eso no tiene un `vista=gerencia`. **El front no recorta el menú: lo
      vuelve a pedir** ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)), y `frontera_test.dart` ya lo hacía imposible de otra forma. Las dos
      banderas siguen saliendo del tipo **real**: `puedeGestionarUsuarios` cae ([A-17](docs/12-pruebas-y-calidad.md#a-17)) y
      `puedeVerComoOperacion` no ([A-18](docs/12-pruebas-y-calidad.md#a-18)), o Gerencia quedaría atrapada. La franja no se cierra
      ([A-19](docs/12-pruebas-y-calidad.md#a-19)), se apila con la de ambiente, y su texto lo redacta la API: el título y el párrafo del
      [RF-94](docs/03-requisitos-y-bdd.md#rf-94) entraron al mapa de `frontera_test.dart`, así que escribirlos en `lib/` rompe la
      compilación
- [x] [**2.20**](docs/08-plan-de-desarrollo.md#tarea-2-20) Tablas del canal firmado: `sesiones` y `nonces_vistos` · Base — apareció al ir a
      hacer la [2.13](docs/08-plan-de-desarrollo.md#tarea-2-13): el filtro no tenía dónde leer la clave de firma que la [2.12](docs/08-plan-de-desarrollo.md#tarea-2-12) entrega
      y olvida, y `nonces_vistos` llevaba días especificada en el [04 §4.10](docs/04-modelo-de-datos.md#410-los-nonce-vistos) sin que ninguna
      migración la creara. Aplicada en la base local y con sus **catorce** comprobaciones en `OK`
      dentro de las 109 de `verificar-base.sql`
- [x] [**2.19**](docs/08-plan-de-desarrollo.md#tarea-2-19) Contrato de acceso, usuarios, cargos y canal firmado · Contrato — v0.4.0: `/sesiones`,
      `/navegacion`, `/usuarios`, `/cargos` y `/bitacora`, siete formularios más y los códigos `40100`
      a `40104`, `40301`, `40302`, `40910` a `40913` y `42210` a `42214`. El canal firmado va con sus
      tres cabeceras `X-Prisma-`; cómo se arma la firma, al byte, vive en [20 §6.2](docs/20-contrato-de-api.md#62-cómo-se-arma-la-firma) y no se copia aquí
- [x] [**2.21**](docs/08-plan-de-desarrollo.md#tarea-2-21) Auditoría de `usuarios` y eventos con nombre · Base — `usuarios` era la
      única tabla de negocio **sin auditar**, y no por olvido: la genérica decide que un `UPDATE`
      fue una baja mirando `anulado_en`, y ahí se da de baja con `desactivado_en`. Con eso,
      desactivar a una persona no dejaba rastro. Entran las cuatro piezas que el
      [04 §5.4](docs/04-modelo-de-datos.md#54-auditoría-por-triggers) ya tenía escritas: `fn_auditar_usuarios` con su trigger, la columna
      `auditoria.motivo` —el único sitio donde cabe el porqué de una **reactivación**, que deja las
      tres columnas de estado en `NULL`—, las cinco acciones que le faltaban al `CHECK` y
      `fn_registrar_evento`, lo único que puede escribir un evento en una tabla con RLS y sin
      política de inserción. `schema_version` publica `0.8.0` y `verificar-base.sql` va en
      **161 comprobaciones en `OK`**, once suyas. Destraba la [2.9](docs/08-plan-de-desarrollo.md#tarea-2-9), la [2.15](docs/08-plan-de-desarrollo.md#tarea-2-15) y la [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16)
- [x] [**2.22**](docs/08-plan-de-desarrollo.md#tarea-2-22) `cargos`: nombre único sin mayúsculas y el cargo que no se desactiva · Base — dos
      códigos que el contrato promete desde el `0.4.0` y que la base no imponía, **y las dos
      faltaban de verdad**: «Domiciliaria» y «domiciliaria» entraban como dos cargos distintos, y
      un cargo que todavía tenían personas activas se apagaba dejando esas fichas apuntando a un
      cargo muerto. `nombre` pasa a `CITEXT` —el tipo y no un índice sobre `lower(nombre)`, para
      **conservar `cargos_nombre_key`**, de donde cuelga su fila de traducción— y
      `tg_proteger_cargo_con_personas` impone lo segundo. `schema_version` publica `0.9.0` y
      `verificar-base.sql` va en **168 comprobaciones en `OK`**, siete suyas. Destraba la [2.8](docs/08-plan-de-desarrollo.md#tarea-2-8)

---

## <a id="titulo-5"></a>5. Sprints 3 a 8 · funcionalidades en cadenas paralelas

**Las cadenas avanzan a la vez y comparten lo mínimo**: cada una tiene sus tablas y su rango de
códigos ([21 §4.3](docs/21-trabajo-en-paralelo.md#43-fase-2--rebanadas-verticales-sprints-3-a-8)). El orden exacto dentro de cada una lo dan las dependencias del plan.

### Cadena A · el dinero

<a id="sprint-3"></a>**[Sprint 3](docs/08-plan-de-desarrollo.md#sprint-3) · Movimientos**

- [x] [**3.1**](docs/08-plan-de-desarrollo.md#tarea-3-1) Dominio `Movimiento`, tipos y su efecto sobre utilidad, caja y patrimonio · API —
      los nueve tipos con su efecto sobre las tres cifras, y `aporteAUtilidad`, `aporteACaja` y
      `aporteAPatrimonio`, que devuelven lo que un movimiento le suma a cada una. Lo anulado aporta cero
- [x] [**3.2**](docs/08-plan-de-desarrollo.md#tarea-3-2) Caso de uso `RegistrarMovimiento` con doble fecha · API — la del movimiento la trae
      quien registra y la de digitación la pone el reloj del servidor; el futuro se rechaza y «hoy» es
      el día en `America/Bogota`
- [x] [**3.3**](docs/08-plan-de-desarrollo.md#tarea-3-3) Repositorio de movimientos contra PostgreSQL · API — `MovimientosEnPostgres`
      guarda por `ConIdentidad` el autor y el instante que puso el caso de uso, y la base juzga:
      registrar a nombre de otra persona lo rechaza `mov_insercion`
- [x] [**3.4**](docs/08-plan-de-desarrollo.md#tarea-3-4) Endpoints de movimientos con sus códigos del catálogo · API —
      `PUT /api/v0/movimientos/{id}` con el formulario «movimiento» y los cuatro códigos que
      estrenan el rango: la fecha futura, la cuenta, la categoría y la cuenta de destino. **La
      respuesta se lee de la base después de escribir**, en la misma transacción, porque el
      contrato declara nombres que la petición no trae. `prisma_api` en `0.4.0`, contrato `0.14.0`
      y 649 pruebas
- [x] [**3.5**](docs/08-plan-de-desarrollo.md#tarea-3-5) Formulario de registro rápido para celular, pintado del descriptor · Front —
      **la primera pantalla de sección**: el formulario «movimiento» lo describe la API, el registro
      es un `PUT` a su propio id —generado con la clave de idempotencia— y la intención se encola
      antes de salir a la red, así que sin señal queda «Pendiente de sincronizar». `prisma_front` en
      `0.4.0+4`, con 276 pruebas
- [x] [**3.6**](docs/08-plan-de-desarrollo.md#tarea-3-6) Foto del recibo comprimida, subida a través de la API · Front, API —
      el recibo se fotografía en el celular, **se encoge en el navegador** a 1600 px y sube por
      `POST /api/v0/movimientos/{id}/adjuntos`, que es la primera ruta que recibe archivos. **El id
      del adjunto es la clave de idempotencia**, así que dos intentos escriben el mismo objeto. Sin
      señal la foto **espera en la cola con sus bytes**, detrás de su movimiento. Y el bucket
      **estrenó los dos rechazos que nadie había visto**: 6 MB y un GIF los para Storage, no un
      `if`. `prisma_api` en `0.11.0`, `prisma_front` en `0.11.0+13`, contrato `0.18.0`; 852 pruebas
      en la API, 165 contra la base y 370 en el front
- [x] [**3.7**](docs/08-plan-de-desarrollo.md#tarea-3-7) Transferencias entre cuentas · API — **no hizo
      falta escribir nada**: la dejaron hecha las tareas de las que colgaba. La 3.13 le dio el campo
      `cuentaDestinoId` y el código `42226`; la 3.4, el endpoint que ya registra los tres tipos; la
      3.15, las tres restricciones que la base impone; y la 3.12, los saldos que la reflejan. `PUT
      /api/v0/movimientos/{id}` registra una transferencia con su cuenta de destino, el dominio le da
      **caja neutra** —baja la de origen, sube la de destino por el mismo valor— y **utilidad y
      patrimonio en cero** ([RN-03](docs/03-requisitos-y-bdd.md#rn-03)), y las tres situaciones que no cuadran —sin destino, con el mismo
      de origen, o un tipo que no lo admite— las rechaza PostgreSQL con `42226`. El descriptor **no
      la declara obligatoria a propósito**: «obligatorio si» sería una regla en el front ([20 §4.4](docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)).
      891 pruebas en la API y 175 contra la base, sin una sola línea nueva
- [x] [**3.8**](docs/08-plan-de-desarrollo.md#tarea-3-8) Listado con filtros · API, Front — el libro cuelga de
      «Movimientos», debajo del registro rápido. **Se abre pidiendo sin fechas**, porque el mes en
      curso es el de Bogotá y eso lo sabe la API, no el reloj del navegador; con `mesEnCurso` en la
      mano se coloca, las flechas lo mueven y la de adelante se apaga sola en el mes actual. Cada
      fila se pinta con lo que la API resolvió —el nombre del tipo, su color y el signo del valor—,
      y **el color y el signo llegan aparte a propósito**: el color lo elige Gerencia en la
      [3.24](docs/08-plan-de-desarrollo.md#tarea-3-24) y el signo es lo que el movimiento le hace a la caja. La fila se abre en su
      sitio, sin otra consulta, con quién registró, cuándo se digitó, con qué registro va y sus
      soportes, que **baja la API en base64 y nunca una URL al almacén**. «Ver anulados» es un
      interruptor y solo existe si la API dijo que quien mira puede: cambia qué libro se lee, así que
      el panel cambia de aspecto mientras está puesto, y lo anulado se queda atenuado y tachado con
      su motivo. Un rango a medias **no se ataja en el front**: se manda, y se lee el `42227` con las
      palabras de la API. `prisma_front` en `0.12.0+16`; 429 pruebas
- [x] [**3.9**](docs/08-plan-de-desarrollo.md#tarea-3-9) Anulación con motivo obligatorio · API, Front — `POST
      /api/v0/movimientos/{id}/anulacion` saca el movimiento de las cuentas con motivo escrito y
      **no borra nada** —la fila se queda entera y solo estrena sus tres columnas de anulación—, y
      desde ese momento no suma en ninguna cifra. **El «no» a Operación lo dice PostgreSQL** con
      `mov_anulacion`, no un `if`, y la prueba lo afirma contra la base ([BDD-03-4](docs/03-requisitos-y-bdd.md#bdd-03-4)); la auditoría
      la escribe el trigger con su acción propia, `ANULAR`. Anular dos veces responde `40900` y **no
      pisa el motivo del primero**: lo sostiene el `WHERE anulado_en IS NULL` del `UPDATE`, no una
      pregunta previa. **Y ya está el botón**, en la fila abierta del libro: existe solo si la API
      dijo que ese movimiento se deja anular, y con `sePuedeAnular` en `false` lo que se lee es el
      porqué que ella redactó, no un botón apagado. El motivo se pide **antes** de confirmar, en un
      panel debajo de la fila, y lo pinta el formulario «anulacion-de-movimiento» que describe la
      API: su etiqueta, su ayuda y sus avisos no están escritos en `lib/`. Si el movimiento va con
      otro registro, el panel lo dice antes con las palabras del `registroHermano`, y anulado el
      libro **se vuelve a pedir**, porque qué quedó anulado lo decide la base. `prisma_api` en
      `0.16.0` y `prisma_front` en `0.12.0+16`; 436 pruebas en el front
- [x] [**3.10**](docs/08-plan-de-desarrollo.md#tarea-3-10) Corrección por contra-asiento · Base, API — `PUT
      /api/v0/movimientos/{id}/correccion/{correccionId}` registra un movimiento que reversa al
      errado y lo deja apuntando a él, y **el original queda intacto**: los dos se leen en el libro,
      así que la historia cuenta también el error ([RF-15](docs/03-requisitos-y-bdd.md#rf-15), [04 §5.3](docs/04-modelo-de-datos.md#53-corrección-por-contra-asiento)). **La API no calcula la
      reversa**: no le da la vuelta al tipo ni copia el valor, porque ningún documento dice qué tipo
      reversa a cuál. Los dos ids van en la ruta para que el cuerpo siga siendo el formulario
      «movimiento» tal cual. **El «solo Gerencia» del [CU-04](docs/02-casos-de-uso.md#cu-04) lo dice la base**: `mov_insercion` pasa
      a juzgar quién llena `corrige_a_id`, y registrar sigue siendo de los dos tipos; a Operación le
      responde `42501`, que sale como `40300`. Contrato `v0.20.0`, `prisma_api` en `0.16.0` y
      esquema `0.16.0`, **que `prisma.esquema` todavía no declara porque su etiqueta no existe**
      ([§9](#9-a-vigilar)); 1024 pruebas en la API, 216 contra la base y 295 comprobaciones en la base
- [x] [**3.11**](docs/08-plan-de-desarrollo.md#tarea-3-11) Marca de registro tardío · API — más de 7 días entre lo que ocurrió y lo que se
      digitó, contados en días de Bogotá
- [x] [**3.12**](docs/08-plan-de-desarrollo.md#tarea-3-12) Saldos por cuenta · API — `POST /api/v0/consultas/saldos`: cada
      cuenta sin anular con su saldo y el total sumado. **La suma es del dominio** y la vista
      `v_saldos_cuenta` queda de contraste; a Operación le responde `40300` lo que dice
      `fn_es_gerencia()`. `prisma_api` en `0.13.0`, copia fijada del contrato en `0.18.0`; 891
      pruebas en la API y 178 contra la base
- [x] [**3.13**](docs/08-plan-de-desarrollo.md#tarea-3-13) Contrato de movimientos · Contrato — registrar con `PUT` a su propio id,
      anular con motivo, adjuntar el soporte y el libro con filtros; ocho esquemas, el formulario
      `movimiento` y seis códigos del rango 20-29. Contrato `0.11.0`
- [x] [**3.14**](docs/08-plan-de-desarrollo.md#tarea-3-14) Tabla `adjuntos` y bucket de soportes · Base — la ficha del soporte
      con sus dos flechas excluyentes, su trigger de auditoría —el decimoquinto— y el bucket
      privado `soportes`, que **impone el techo de 5 MB y los cuatro tipos antes que el `CHECK`**.
      Esquema `0.4.0`, con 123 comprobaciones en `OK` contra la base local. **Falta promoverla a
      dev y a qa**
- [x] [**3.15**](docs/08-plan-de-desarrollo.md#tarea-3-15) `movimientos`: destino solo en transferencias, origen distinto del destino y la
      fecha contra el día de Bogotá · Base — las dos del destino solo las rechazaba el dominio de la
      API, y la transferencia a la misma cuenta **bajaba el saldo** en `v_saldos_cuenta`. Y
      `fecha_no_futura` dejó de mirar `CURRENT_DATE`, que es el día del huso con que se conecte la
      sesión: con la base en `UTC` aceptaba, de siete a doce de la noche, el mañana que la API
      rechaza con `42223`. Esquema `0.6.0`, con 141 comprobaciones en `OK` contra la base local.
      **Le deja dos filas a la API**, que van en el PR que suba su `prisma.esquema`, y **falta
      promoverla a dev y a qa**
- [x] [**3.16**](docs/08-plan-de-desarrollo.md#tarea-3-16) El andamio en el celular · Front — de 760 px para abajo, como el
      mockup, **el menú va arriba y de lado**: el logo y las pestañas en una barra fija, el topbar
      debajo a todo el ancho y la insignia al pie de la pantalla. Girar el celular no borra lo que
      se estaba escribiendo. `prisma_front` en `0.5.0+5`, con 296 pruebas
- [x] [**3.17**](docs/08-plan-de-desarrollo.md#tarea-3-17) Contrato del libro que dibujó el mockup · Contrato — **hecho en el
      `v0.19.0`**: cada fila del libro dice cómo se pinta su tipo, con qué registro va y si se deja
      anular; la consulta pagina, filtra por grupo y rechaza el rango con una sola fecha (`42227`);
      Gerencia lee y cambia cómo se ve cada tipo, y el soporte baja en base64. **Las reglas del
      registro que ya siguió su vida las aprobó quien dirige** y están en el [CU-03](docs/02-casos-de-uso.md#cu-03), A4 a A8, con
      sus cuatro 409, `40920` a `40923`
- [x] [**3.18**](docs/08-plan-de-desarrollo.md#tarea-3-18) `fn_auditar` deja de leer `anulado_en` donde no existe · Base — se
      comprobó antes de arreglarlo: un `UPDATE` sobre `costos_producto`, `prolabore_config`,
      `nomina_detalle`, `sobres_config` o `cierres_mensuales` se caía con `42703` dentro del trigger.
      Ahora la columna se lee de `to_jsonb(OLD)` y `to_jsonb(NEW)`, como ya decía el [04 §5.4](docs/04-modelo-de-datos.md#54-auditoría-por-triggers), y
      la verificación edita una fila de cada una de las quince tablas auditadas y compara la lista
      con los triggers que de verdad llaman a `fn_auditar`. Esquema `0.12.0`, con 216 comprobaciones
      en `OK`. **No le deja nada a la API**, y **falta promoverla a dev y a qa**
- [x] [**3.19**](docs/08-plan-de-desarrollo.md#tarea-3-19) Cómo se ve cada tipo, en la base: `presentacion_tipos` · Base — la
      tabla del [04 §4.13](docs/04-modelo-de-datos.md#413-cómo-se-ve-cada-tipo-de-movimiento) con sus nueve lecturas, **que escribe la migración y no la semilla**, para que el
      libro las tenga también en uat y en prod. La leen los dos tipos, la cambia solo Gerencia y nadie
      inserta, ni ella; el «no» a Operación lo da la base, que no le deja alcanzar ninguna fila
      ([BDD-104-2](docs/03-requisitos-y-bdd.md#bdd-104-2)), y cada cambio de Gerencia queda en la bitácora con el antes y el después.
      Esquema `0.13.0`, con 235 comprobaciones en `OK` contra un PostgreSQL 16 con lo que las
      migraciones usan de Supabase, **porque la pila de Docker no se pudo levantar**: falta correr el
      informe contra ella. **Le deja cuatro filas a la API**, y **falta promoverla a dev y a qa**.
      Verificándola salió que una fila de la 3.18 salía roja o verde según el azar de los ids, y su
      arreglo va en un commit aparte
- [x] [**3.20**](docs/08-plan-de-desarrollo.md#tarea-3-20) `fn_anular_movimiento`: el movimiento y su registro hermano en una sola
      transacción · Base — la cuarta función del [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas), `SECURITY INVOKER` para que RLS juzgue
      cada fila. Toma el movimiento con `FOR UPDATE`, así que `mov_anulacion` juzga antes que nada y
      a Operación le responde `42501`; lo anula, y después lo que va con él, que busca por
      `movimiento_id` en cada tabla. Lo que ya siguió su vida lo rechaza con un `RAISE` cuyo texto es
      contrato, y la transacción cae entera ([CU-03](docs/02-casos-de-uso.md#cu-03) A1 a A8). **Trae `aportes_retiros.retiro_id`**, que
      une las dos mitades de un retiro: quien dirige decidió que entrara aquí y no en un PR aparte.
      Esquema `0.14.0`, con 259 comprobaciones, todas en `OK` salvo la de `pg_cron`, contra el mismo
      PostgreSQL 16 de la [3.19](docs/08-plan-de-desarrollo.md#tarea-3-19). **No le deja filas a la API**, y **falta promoverla a dev y a qa**
- [x] [**3.21**](docs/08-plan-de-desarrollo.md#tarea-3-21) El libro que dibujó el mockup, en la API · API — cada fila
      trae ahora **cómo se pinta su tipo** —el nombre, el color y el signo del valor—, **con qué
      registro va** y **si se deja anular**, con el porqué en palabras cuando no. Las tres salen de
      la misma consulta: la presentación de `presentacion_tipos`, el registro hermano de un
      `LATERAL` que pregunta en las seis tablas que pueden tenerlo, y el impedimento de lo mismo que
      mira `fn_anular_movimiento` antes de anular ([CU-03](docs/02-casos-de-uso.md#cu-03) A2 a A7), **dicho antes de que nadie toque
      el botón**. La consulta pagina, filtra por grupo y rechaza con `42227` el rango con una sola
      fecha o al revés, que hasta hoy devolvía la lista vacía y lo escondía. El máximo por página lo
      decide la API y viaja en la respuesta, con las dos banderas de Gerencia y el mes en curso de
      Bogotá. Y `POST /api/v0/consultas/soporte` **baja el recibo por la API**, en base64 dentro del
      sobre, nunca por una URL al bucket. `prisma_api` en `0.16.0`, copia fijada del contrato en
      `0.19.0` y `prisma.esquema` en `0.14.0`, que trae las seis filas que la 3.15, la 3.19 y la
      4.11 le habían dejado a la tabla de traducción; 1012 pruebas en la API y 202 contra la base
- [x] [**3.22**](docs/08-plan-de-desarrollo.md#tarea-3-22) Cómo se ve cada tipo: leerlo y cambiarlo ([RF-104](docs/03-requisitos-y-bdd.md#rf-104)) · API —
      `POST /api/v0/consultas/presentacion-de-tipos` devuelve los nueve renglones del bloque, **en
      el orden del ENUM y no en el alfabético**, y la edición cambia el nombre, el color y el grupo
      del filtro. Cada renglón enseña además **lo que ese cambio no toca**: el efecto sobre las tres
      cifras, que sale de `TipoDeMovimiento` y no de la tabla, porque una columna de efecto habría
      sido una segunda copia del [05 §2](docs/05-reglas-financieras.md#2-naturaleza-de-cada-movimiento) y además editable. **Los dos «no» a Operación los
      dice la base**: el de leer con `fn_es_gerencia()` antes de la consulta, porque la tabla se la
      enseña a los dos tipos —Operación necesita el libro—, y el de escribir con
      `presentacion_actualizacion`, que no le deja alcanzar ninguna fila ([BDD-104-2](docs/03-requisitos-y-bdd.md#bdd-104-2)). El cambio
      queda en la bitácora con el antes y el después. 1019 pruebas en la API y 208 contra la base
- [x] [**3.23**](docs/08-plan-de-desarrollo.md#tarea-3-23) Anular arrastra al registro hermano · API — la anulación
      dejó de ser un `UPDATE` de tres columnas y pasa a llamar a `fn_anular_movimiento`, que anula
      también el anticipo, el activo, el aporte, las dos mitades de un retiro o el adelanto que
      cuelgan del movimiento, **con el mismo motivo, el mismo autor y el mismo instante y en la
      misma transacción** ([04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas)). Lo que vuelve trae su `registroHermano` con la
      anulación puesta, y eso es lo que más se anuló. **Quién anula y cuándo ya no viajan desde la
      API**: los pone la función con `auth.uid()` y el `now()` de la transacción. Y lo que ya siguió
      su vida **no anula nada y la transacción cae entera**, con su código: `40920`, `40921`,
      `40922`, `40923` y el `40960` del mes cerrado ([CU-03](docs/02-casos-de-uso.md#cu-03) A3 a A7). Los cinco se reconocen **por
      el texto del `RAISE`**, que es contrato con la base porque todos salen con `P0001`, y del
      mismo mapa con que el libro pinta `porQueNo` antes de que nadie toque el botón. `prisma_api`
      en `0.16.0` —la rama entera es un PR y la versión sube un solo paso ([C-05](docs/12-pruebas-y-calidad.md#c-05))—; 1019 pruebas
      en la API y 211 contra la base
- [x] [**3.24**](docs/08-plan-de-desarrollo.md#tarea-3-24) «Cómo se ve cada tipo», el bloque de Gerencia ([RF-104](docs/03-requisitos-y-bdd.md#rf-104)) · Front — el
      bloque va dentro del panel «Cuentas de dinero», que es donde lo dibujó el mockup. Cada renglón
      pinta la píldora **tal como se lee hoy** —nunca el valor del ENUM: el front no traduce tipos—
      y, al lado, **lo que ese cambio no toca**: lo que el tipo le hace a las tres cifras, que llega
      resuelto de la API. «Cambiar» abre el formulario que describe la API **lleno con lo que el
      tipo dice hoy**, porque cambiarle el color a uno no puede obligar a volver a escribir su
      nombre; para eso `FormularioDescrito` estrena `valoresIniciales`, que es lo que separa un
      formulario de alta de uno de edición. Guardado, la lista se vuelve a pedir. Lo único que se
      elige aquí es **con qué se dibuja**: el tono de la paleta de cada color y el símbolo de cada
      efecto —▲, ▼, ↔ y —, los del mockup—; un color que esta versión no conozca se pinta neutro,
      que es no decir nada. `prisma_front` en `0.12.0+16`, con 413 pruebas
- [x] [**3.25**](docs/08-plan-de-desarrollo.md#tarea-3-25) La pila local en contenedores · Base, API, Front —
      `./scripts/db/pila-local.ps1` levanta las tres piezas con un solo comando: `supabase start`,
      la clave local del rol `prisma_api` —cada reset lo deja sin contraseña a propósito— y
      `docker compose` con las recetas de la API y del front, que ya existían desde el [Sprint 0](docs/08-plan-de-desarrollo.md#sprint-0).
      **Ninguna ruta va escrita**: cada receta, cada puerto y el nombre de la pila se apuntan desde
      `pila/.env`, que está ignorado, así que da igual cómo se llame cada carpeta en cada máquina y
      cambiar `PRISMA_API_PUERTO` mueve a la vez lo que publica la API y la URL que el front
      compila dentro. **La base no entra en el `compose.yaml`**: la de PRISMA es la de Supabase, con
      `auth`, GoTrue, Storage y `pg_cron`, y un `postgres:16` escrito a mano no tendría `auth.uid()`
      que juzgar. Ninguna clave se versiona. Con su [ADR-038](docs/adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md). **Queda por hacer la primera
      construcción de las dos imágenes** en una máquina con cuota de Docker Hub ([§9](#9-a-vigilar))

<a id="sprint-6"></a>**[Sprint 6](docs/08-plan-de-desarrollo.md#sprint-6) · Reportes y KPIs**

- [x] [**6.1**](docs/08-plan-de-desarrollo.md#tarea-6-1) Utilidad causada, flujo de caja y caja libre · API —
      **las tres cifras del [05 §1](docs/05-reglas-financieras.md) ya se calculan.** `CalcularUtilidadCausada` arma el estado de
      resultados del mes —ingresos causados, costo directo, gastos operativos y el pro-labore que va
      dentro de ellos— y `CalcularFlujoDeCaja`, las entradas contra las salidas; **la caja libre no
      la hizo esta tarea**, la había hecho la [7.4](docs/08-plan-de-desarrollo.md#tarea-7-4), y aquí se reutiliza tal cual. Los cuatro son
      funciones puras, sin base y sin Spring, y **ninguna tiene un `if` por tipo de movimiento**: el
      signo lo decide `TipoDeMovimiento` y lo anulado ya aporta cero. Las pruebas reproducen
      septiembre del [05 §12](docs/05-reglas-financieras.md#12-ejemplo-integral--septiembre-completo), que el [12 §4](docs/12-pruebas-y-calidad.md#4-juego-de-datos-de-prueba-oficial) declara juego de datos oficial: $1.258.000 de
      utilidad causada con 16,0 % de margen neto, y −$1.255.000 de flujo el mismo mes, con las dos
      invariantes del [12 §4.2](docs/12-pruebas-y-calidad.md#4-juego-de-datos-de-prueba-oficial) que le tocan. **Lo que decidió**: que el ingreso causado sale del pedido
      entregado **y además** del `ingreso` que no es de ningún pedido —el apunte de la entrega lleva
      `pedido_id`, así que contar los dos no duplica y la venta de mostrador deja de perderse—, y
      que un gasto de categoría de costo directo, o atado a un pedido, no vuelve a restar en los
      operativos. **No trae endpoint**: `POST /api/v0/consultas/tablero` junta además los doce meses
      ([6.4](docs/08-plan-de-desarrollo.md#tarea-6-4)), las alertas ([6.7](docs/08-plan-de-desarrollo.md#tarea-6-7)) y los sobres ([7.8](docs/08-plan-de-desarrollo.md#tarea-7-8)), que todavía no existen. `prisma_api` en `0.32.0`,
      con 27 pruebas nuevas ([§10](#10-decisiones-de-construcción-que-conviene-revisar))
- [x] [**6.2**](docs/08-plan-de-desarrollo.md#tarea-6-2) Pruebas con el ejemplo de septiembre completo · API —
      **el septiembre del [05 §12](docs/05-reglas-financieras.md#12-ejemplo-integral--septiembre-completo) dejó de ser una tabla y es un juego de datos que corre.** `Septiembre`, en el
      paquete de pruebas `oficial`, trae los registros que producen esas cifras: 42 pedidos
      entregados que suman $7.850.000 de venta, $3.612.000 de costo y 104 horas —con la mitad de cada
      uno cobrada en agosto y la otra contra entrega, que es la política del 50 % del [05 §3.1](docs/05-reglas-financieras.md#31-el-anticipo-no-es-un-ingreso)—, los
      cuatro pedidos de octubre con sus $2.100.000 de anticipo, las tres compras de insumos y los seis
      gastos del mes, pagados igual en agosto que en septiembre. **Los cuatro cálculos de la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1) leen
      ese mismo libro** y reproducen [§12.1](docs/05-reglas-financieras.md#121-estado-de-resultados-causación), [§12.2](docs/05-reglas-financieras.md#122-flujo-de-caja-del-mismo-mes) y [§12.3](docs/05-reglas-financieras.md#123-caja-libre-al-cierre) al peso —$1.258.000 de utilidad, −$1.255.000
      de flujo y $545.000 de caja libre—, y el saldo final cuadra por dos caminos: el que lo deriva
      del flujo y el que lo suma cuenta por cuenta, que reparte la transferencia. **Y las invariantes
      del [12 §4.2](docs/12-pruebas-y-calidad.md#4-juego-de-datos-de-prueba-oficial) dejaron de probarse con un solo mes**: corren contra 500 meses inventados con
      semilla fija, y con ellas dos propiedades que ningún documento escribió como igualdad —anular un
      movimiento deja las tres cifras como si no existiera, y moverle la fecha fuera del mes le quita
      exactamente su aporte—. **Lo que decidió**: que el juego vive en las pruebas y no en el dominio,
      porque es un dato de verificación y no una regla; que el mes lleva el ruido que el documento no
      menciona —un gasto anulado, un pedido anulado, una cotización, un cancelado, una transferencia y
      un gasto digitado diez días tarde— para que se vea que ninguna cifra se mueve; y que la compra
      de insumos entra al libro con su categoría marcada de costo directo, que es **la primera vez que
      ese conjunto llega lleno**: vacío, como está hoy, el mismo mes da −$2.642.000 de utilidad, que
      es lo que la 6.1 dejó anotado en el [§10](#10-decisiones-de-construcción-que-conviene-revisar). **No trae código de producción y no sube la versión**
      ([C-05](docs/12-pruebas-y-calidad.md#c-05) no la pide por `src/test/`): son 33 pruebas nuevas, 1415 en verde
- [x] [**6.3**](docs/08-plan-de-desarrollo.md#tarea-6-3) Dashboard con las tres cifras · Front —
      **el Inicio dejó de anunciar que llegaba en un sprint posterior y pinta el mes.** Las tres
      cifras van lado a lado —una debajo de otra en el celular—, y debajo la línea que las concilia
      **tal como la redacta la API**, con sus montos dentro. El panel «Cuentas» trae cada saldo, el
      total y **la escalera que lleva a la caja libre**: el total, menos los anticipos por devengar,
      menos los gastos fijos comprometidos. Los tres términos llegan por separado en el contrato, y
      enseñarlos es lo que hace que la cifra de arriba se lea como una resta y no como un número
      suelto ([05 §3.3](docs/05-reglas-financieras.md#33-caja-libre--la-cifra-que-hoy-no-existe-en-ninguna-parte)). El panel «Por entregar» cierra con las cinco cifras de los
      pendientes, y el ámbar de los estancados es el de la lista de pedidos. **Todo llega de una sola
      consulta y con el cuerpo vacío**: cuál es el mes del negocio lo decide la API en Bogotá
      ([RNF-08](docs/03-requisitos-y-bdd.md#rnf-08)). **Lo que decidió**: que de las tres cifras se pinta la pregunta del mockup y no su
      veredicto —el «16,0% de margen» es una cifra que el tablero no manda—, que «Ver todos» no se
      pinta porque el contrato no le da destino, y que **la pantalla se construyó contra el contrato
      aunque la API todavía no sirva la ruta**, así que hoy lee su `40400` ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). El gráfico de doce
      meses ([6.4](docs/08-plan-de-desarrollo.md#tarea-6-4)), las alertas ([6.7](docs/08-plan-de-desarrollo.md#tarea-6-7)), los sobres ([7.8](docs/08-plan-de-desarrollo.md#tarea-7-8)) y «Descargar» ([6.9](docs/08-plan-de-desarrollo.md#tarea-6-9)) entran con su
      tarea. `prisma_front` en `0.25.0+31`, con 28 pruebas nuevas y 603 en total
- [x] [**6.4**](docs/08-plan-de-desarrollo.md#tarea-6-4) Gráfico de 12 meses · Front —
      **el Inicio pinta «Últimos 12 meses», entre la línea que concilia y «Cuentas»**: barras de
      utilidad y línea punteada de caja, que son las mismas dos cifras de arriba mes a mes y llegan
      en la misma consulta. **La rejilla sale de los datos y no del mockup**: el prototipo fija el
      marco entre $2,4 M y −$1,4 M porque sus doce meses son fijos, y con los de un año cualquiera
      una barra se saldría. `EscalaDelGrafico` elige el paso de la serie de siempre —1, 2 y 5 por una
      potencia de diez, desde $100.000—, deja el cero siempre dentro y no pasa de seis rayas. **Lo
      que decidió**: que la escala viva aparte del pincel, porque lo que dibuja un `CustomPainter`
      solo se afirma con goldens y aquí no hay ninguno, así que se prueba lo que decide —el paso, las
      marcas y la altura de cada peso— y del lienzo salen solo las rayas, las barras y la línea; que
      el rótulo del eje y el del mes sean **texto de verdad** y no letras dibujadas, lo que además
      los deja desplazarse de lado en el celular sin arrastrar la página; que el rótulo vaya en
      millones con un decimal y **sea exacto**, porque con el paso múltiplo de $100.000 ninguna marca
      redondea; y que **el gráfico no interprete nada** —ni tendencia, ni promedio, ni «mejor mes»—,
      porque ninguna de esas cifras viaja en el tablero. La barra guarda el color de su serie aunque
      la utilidad sea negativa, que lo que dice el signo es hacia dónde crece, y el punto de la caja
      se pone rojo cuando es negativo, como las tres cifras de arriba. **Para un lector de pantalla
      es una sola imagen con su nombre**, que es el `role="img"` del mockup: veinticuatro cifras
      leídas una por una y sin poder recorrerlas no dicen nada. `prisma_front` en `0.26.0+32`, con 43
      pruebas nuevas y 646 en total
- [x] [**6.5**](docs/08-plan-de-desarrollo.md#tarea-6-5) Reporte mensual y anual con promedio de ganancias · API, Front — **la
      mitad API estaba hecha**: `POST /api/v0/consultas/reporte` arma el año mes a mes, con el promedio
      de ganancias del [05 §9.1](docs/05-reglas-financieras.md#91-resultado) y su proyección a doce meses ([BDD-14-1](docs/03-requisitos-y-bdd.md#bdd-14-1)). **Un mes cerrado no se
      recalcula nunca**: viene tal cual de `cierres_mensuales`, la foto que congela la [6.8](docs/08-plan-de-desarrollo.md#tarea-6-8)
      ([RN-16](docs/03-requisitos-y-bdd.md#rn-16)); los abiertos los calcula `CalcularUtilidadCausada`, y **el mes sin un solo registro no
      viaja**, para que un año a medias no pinte diez meses en cero. **El promedio se divide entre los
      meses cerrados** y no entre los que trae la lista, que es lo que dice el [CU-14](docs/02-casos-de-uso.md#cu-14): sin ninguno
      cerrado no hay promedio ni proyección, y la respuesta lo omite. **El rechazo a Operación lo
      decide el caso de uso**, no la base, porque el reporte se arma de tablas que leen los dos tipos
      de usuario y RLS no tiene a qué decirle que no: es el `40300` que el contrato ya declaraba para
      esta ruta. **Estrena un código**, el `42260` para un año fuera de 2020..2100, que el contrato
      declaraba y el catálogo no tenía. **Y arregla un silencio**: `vigentes()` nunca traía la
      categoría ni el pedido de cada movimiento, así que los gastos fijos comprometidos de la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1)
      salían siempre en cero. `prisma_api` en 0.34.0, con 1444 pruebas sin base —veintinueve nuevas— y 340
      contra ella —siete nuevas— ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). **Y ahora se abre la pantalla**: «Reportes», «Cómo va el
      año», con una sola llamada en `lib/datos/reportes.dart`. Arriba la utilidad acumulada del año
      con el promedio mensual y su proyección a doce meses; debajo la lectura que la API redacta, la
      tabla mes a mes —ingresos, costo directo, gastos, utilidad, margen y la utilidad sin
      pro-labore al lado, que es la comparación del [05 §6.3](docs/05-reglas-financieras.md#63-el-pro-labore--la-trampa-del-trabajo-invisible-rn-08)— y el panel del punto de
      equilibrio con sus términos. **Ni una cifra se calcula aquí** ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). **Y faltar no es
      valer cero**: sin un mes cerrado no se pintan ni el promedio ni la proyección, sin margen de
      contribución positivo no se pinta el punto de equilibrio, y un mes sin ingresos deja la celda
      del margen en una raya; lo que se lee en su lugar es la lectura del año, que dice por qué
      falta. **Lo que decidió**: que el punto de equilibrio se pinte aquí aunque sea de la [6.6](docs/08-plan-de-desarrollo.md#tarea-6-6), que
      es de la API y ya viaja dentro de esta respuesta; y que el año no se elija todavía, porque la
      consulta va con el cuerpo vacío y cuál es el año del negocio lo decide la API en Bogotá
      ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). La frontera estrena su tercera excepción, `nomina`, que es un campo del
      contrato y no la sección. `prisma_front` en `0.29.0+35`, con 30 pruebas nuevas y 692 en total
- [x] [**6.6**](docs/08-plan-de-desarrollo.md#tarea-6-6) Punto de equilibrio · API — **casi toda estaba
      hecha**: la [6.5](docs/08-plan-de-desarrollo.md#tarea-6-5) trajo la fórmula del [05 §10](docs/05-reglas-financieras.md#10-punto-de-equilibrio) entera —margen de contribución, ventas
      necesarias y pedidos necesarios—, y el front ya pintaba su panel. Lo que faltaba es **la última
      columna de la tabla mes a mes**, «Contra el punto de equilibrio»: los ingresos causados del mes
      menos las ventas necesarias, que es la fila «ventas sobre el punto» del [05 §12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes) y lo único
      de ese [§12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes) que la prueba oficial de septiembre dejaba escrito como pendiente de esta tarea.
      **La resta la hace la API** aunque sea una resta ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)), **el listón es uno solo para todo el
      año** —el mismo del panel; con uno por mes cada fila se compararía contra otra cifra— y **viaja
      ausente y no en cero** sin punto de equilibrio, porque un cero diría que el mes quedó justo en
      él. **Y corrige el [05 §12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes)**, que daba $4.769.231 de punto de equilibrio y +$3.080.769 de
      ventas por encima: son los números del ejemplo del [§10](docs/05-reglas-financieras.md#10-punto-de-equilibrio) —$2.480.000 de fijos al 52 %—, no los de
      septiembre, que tiene $2.630.000 de fijos al 53,99 % y da $4.871.272 y +$2.978.728. Con los de
      antes, ninguna prueba podía reproducir a la vez las cifras del mes y sus indicadores. Contrato `0.25.0`,
      `prisma_api` en `0.42.0` con 1579 pruebas —cuatro nuevas— y `prisma_front` en `0.31.0+37` con 706
      —dos nuevas—
- [x] [**6.7**](docs/08-plan-de-desarrollo.md#tarea-6-7) Alertas: caja libre negativa, anticipos y pedidos estancados · API, Front —
      **el Inicio dice qué hay que atender.** `POST /api/v0/consultas/tablero` deja de mandar
      `alertas` vacía: `DerivarAlertas` mira la caja libre y los pedidos por entregar y devuelve solo
      las cuatro del [05 §3.4](docs/05-reglas-financieras.md#34-alertas-derivadas) que se cumplen, **con los montos y qué hacer en el texto** ([10 §6](docs/10-ux-y-mockups.md#6-micro-decisiones-que-importan)): la
      caja libre negativa en rojo, aunque el mes sea rentable ([BDD-13-3](docs/03-requisitos-y-bdd.md#bdd-13-3)); los anticipos por encima
      del saldo y cada pedido estancado en ámbar ([RF-24](docs/03-requisitos-y-bdd.md#rf-24)); y cada cliente con más del 40 % de los
      anticipos sin alarma. Van por nivel, y los estancados del anticipo más viejo al más nuevo. El
      front pinta «Alertas activas» debajo de la línea que concilia, que es el orden del [10 §4.1](docs/10-ux-y-mockups.md#41-dashboard), y
      una alerta con destino lleva a su sección si la API la puso en el menú. **Lo que decidió**:
      que el destino lo ponga la interfaz y no el dominio, que los anticipos se midan sobre los
      pedidos por entregar como los pendientes, y que la concentración con un solo cliente alerte
      ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). `prisma_api` en 0.36.0 con 21 pruebas nuevas, y `prisma_front` en `0.28.0+34` con 11
      nuevas y 662 en total
- [x] [**6.8**](docs/08-plan-de-desarrollo.md#tarea-6-8) Cierre mensual con snapshot inmutable · Base, API —
      **un mes se puede cerrar, y lo cerrado ya no se mueve.** `PUT /api/v0/cierres/{id}` congela las
      nueve cifras del mes —el estado de resultados con su pro-labore, la utilidad causada, el flujo
      de caja, la nómina, la caja libre y los anticipos abiertos— y `POST /api/v0/consultas/cierres`
      las devuelve, del mes más reciente al más viejo ([RN-16](docs/03-requisitos-y-bdd.md#rn-16), [05 §8](docs/05-reglas-financieras.md)). Desde que el mes está
      cerrado, un movimiento anotado después **no le mueve ninguna cifra**, y el reporte impreso meses
      más tarde dice lo mismo que el día del cierre. **Y que lo cerrado no se edite lo impone la
      base**: el esquema `0.20.0` revoca `UPDATE` sobre `cierres_mensuales` para todos los roles de la
      aplicación, y `DELETE` lo estaba desde la [1.2](docs/08-plan-de-desarrollo.md#tarea-1-2). **Lo que decidió**: que las cifras sean
      las que el Inicio mostraba ese día, del mismo `TableroDelMes` de la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1) y no de un cálculo
      aparte; que la nómina vaya en cero hasta que exista; y que el punto 4 del [05 §8](docs/05-reglas-financieras.md)
      quede fuera ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). `prisma_db` publica el esquema `0.20.0` y `prisma_api` queda en 0.40.0, con
      25 pruebas nuevas y 1563 en total, y 12 de integración
- [x] [**6.9**](docs/08-plan-de-desarrollo.md#tarea-6-9) Inicio de solo consulta y su descarga en CSV o PDF ([RF-95](docs/03-requisitos-y-bdd.md#rf-95), [RF-96](docs/03-requisitos-y-bdd.md#rf-96)) · Front, API
- [x] [**6.10**](docs/08-plan-de-desarrollo.md#tarea-6-10) Contrato de reportes, indicadores, alertas y cierre mensual · Contrato —
      v0.17.0: seis operaciones, veintiún esquemas y cinco códigos, cuatro de ellos en el rango
      `60`–`69`, el último que quedaba vacío. **Cierra el trabajo del contrato**: los diez módulos del
      plan quedan acordados antes de implementarse
- [x] [**6.11**](docs/08-plan-de-desarrollo.md#tarea-6-11) La consulta que sirve el Inicio entero · API —
      **el Inicio dejó de leer el «No se encontró lo que buscas» de una ruta que nadie servía.**
      `POST /api/v0/consultas/tablero` devuelve el dashboard entero en una sola consulta ([10 §4.1](docs/10-ux-y-mockups.md#41-dashboard),
      [CU-13](docs/02-casos-de-uso.md#cu-13)): las tres cifras del mes con la línea que las concilia —la redacta la API y lleva los
      montos dentro—, los saldos por cuenta con su total, los pendientes y los doce meses del
      gráfico de la [6.4](docs/08-plan-de-desarrollo.md#tarea-6-4). **No estrena una sola fórmula**: `ArmarTablero` junta los cuatro cálculos
      de la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1) y les agrega lo que el Inicio pinta alrededor. Un mes cerrado sale de su snapshot
      también en el gráfico ([RN-16](docs/03-requisitos-y-bdd.md#rn-16)), y por eso `CierreDelMes` ya lee el flujo de caja que
      `cierres_mensuales` guardaba sin que nadie lo mirara. **Lo que decidió**: que las alertas
      ([6.7](docs/08-plan-de-desarrollo.md#tarea-6-7)) y los sobres ([7.8](docs/08-plan-de-desarrollo.md#tarea-7-8)) viajen vacíos, que es lo que el contrato admite y lo que deja cada
      regla en su tarea; que las cuentas por cobrar descuenten también el ingreso cobrado contra
      entrega y no solo los anticipos; y que si llega solo el año o solo el mes, el que falta sea el
      de hoy en Bogotá. `prisma_api` en 0.35.0 ([§10](#10-decisiones-de-construcción-que-conviene-revisar))

<a id="sprint-7"></a>**[Sprint 7](docs/08-plan-de-desarrollo.md#sprint-7) · Capital, retiros y patrimonio**

- [x] [**7.1**](docs/08-plan-de-desarrollo.md#tarea-7-1) Inversiones en activos · API, Front —
      `PUT /api/v0/activos/{id}` registra la compra de un equipo y
      `POST /api/v0/consultas/activos` los lista del más caro al más barato. Con cuenta escribe en la
      misma transacción el activo y un movimiento `inversion`, que **baja la caja y no toca ni la
      utilidad ni el patrimonio** ([BDD-15-1](docs/03-requisitos-y-bdd.md#bdd-15-1)); sin cuenta entra solo el activo, que es como se
      registran los equipos que el taller ya tenía el día del corte ([09 §4.1](docs/09-plan-de-implantacion.md#41-qué-se-migra-y-qué-no)). El «no» a Operación es
      de la base **en los dos sentidos**: le rechaza la escritura con el `42501` de
      `activos_solo_gerencia` y al leer le filtra las filas, así que recibe la lista vacía y no un
      `40300` ([P-20](docs/12-pruebas-y-calidad.md#p-20)). No estrena ningún código: el `42290` y el `42291` ya los emitía la 7.4, y aquí
      el primero va sobre `fechaCompra`. `prisma_api` en 0.24.0, con 13 pruebas nuevas y 10 contra la
      base local ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). **En el front, el
      panel «Activos del negocio» entra debajo del pro-labore**: la tabla de cuatro columnas del
      mockup, con la píldora «En uso» que escribe la pantalla porque los activos no tienen tabla de
      presentación, y «+ Registrar inversión», que abre el formulario «activo» que genera la API.
      Guardar **vuelve a pedir la lista**, y sin ningún activo el panel lo dice con una frase. El
      botón no estaba dibujado y el mockup lo estrena ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).
      `prisma_front` en `0.19.0+23`, con 17 pruebas nuevas —8 del modelo y 9 del panel— y 525 en
      total
- [x] [**7.2**](docs/08-plan-de-desarrollo.md#tarea-7-2) Aportes de capital · API, Front — `PUT /api/v0/aportes/{id}` registra plata que entra desde afuera, y escribe en la misma
      transacción el movimiento `aporte` —que **sube la caja y el patrimonio y no toca la utilidad**
      ([05 §2](docs/05-reglas-financieras.md))— y su fila de `aportes_retiros` con clase `aporte`. **Aquí la cuenta sí es
      obligatoria**, al contrario que en la compra de un activo: `aportes_retiros.movimiento_id` no
      admite nulo, así que todo aporte es un movimiento ([04 §4.6](docs/04-modelo-de-datos.md#46-inversiones-capital-y-pro-labore)). **El id de la ruta es el de la
      fila**, y no se deja al `DEFAULT` como en el retiro: así el mismo id dos veces choca con
      `aportes_retiros_pkey` y responde `40900` en vez de dejar dos filas, y el id del movimiento se
      deriva de él como en el activo. El «no» a Operación es de la base, con el `42501` de
      `ret_solo_gerencia` y su control positivo en el fallo. **No estrena ningún código ni pide
      migración**: el `42290` y el `42291` ya nombraban al aporte, la clase `aporte` está en el
      esquema desde el inicial y `fn_anular_movimiento` ya lo arrastra desde la [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20). `prisma_api`
      en 0.25.0. **En el front, el panel «Aportes de capital» entra debajo de los activos, y es el
      primero sin tabla**: el contrato no declara ninguna consulta de aportes, así que el panel no
      consulta nada al abrirse y dice dónde se ve lo aportado —en el libro, cada uno en su
      movimiento, y lo acumulado en el patrimonio—. Armar la lista pidiendo el libro filtrado por
      tipo sería consultar de más ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). Lo que sí pinta es **el comprobante que devolvió la
      API**, leído del `data` del sobre y no del formulario: sin fecha el aporte es de hoy en Bogotá,
      así que la que vuelve puede no ser la que se mandó. El panel no estaba dibujado y el mockup lo
      estrena ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). `prisma_front` en
      `0.20.0+24`, con 17 pruebas nuevas —8 del modelo y 9 del panel— y 542 en total
- [x] [**7.3**](docs/08-plan-de-desarrollo.md#tarea-7-3) Pro-labore con justificación · API, Front — `PUT /api/v0/prolabore/{id}`
      escribe una definición nueva, vigente desde el día de Bogotá, y
      `POST /api/v0/consultas/prolabore` devuelve la que rige con su tarifa por hora: **nada se
      sobrescribe**. El «no» a Operación es de la base, que le rechaza la escritura y no le
      devuelve la fila. La justificación la exige el formulario aunque la columna la admita
      nula. Estrena el `42294` y, en el front, el tipo de campo `numero` y «Inversiones y
      retiros», con el panel del pro-labore. **La pantalla la aprobó quien dirige** ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).
      `prisma_api` en `0.19.0` y `prisma_front` en `0.14.0+18`, con 35 pruebas nuevas en la API,
      9 contra la base local y 14 en el front
- [x] [**7.4**](docs/08-plan-de-desarrollo.md#tarea-7-4) Retiro con división automática en pro-labore y distribución · API —
      `PUT /api/v0/retiros/{id}` escribe un movimiento y una fila de `aportes_retiros` por cada parte
      que no sea cero, unidas por `retiro_id`, así que anular una mitad anula el retiro entero. Sin
      decir cuánto es pro-labore, **la API lo parte**: completa el del mes, vigente en la fecha del
      retiro, y el resto es distribución; `POST /api/v0/consultas/division-de-retiro` lo propone
      antes de guardar. **Trae la primera caja libre**, que era de la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1) y el contrato le pedía
      al retiro: un retiro que se pasa responde `40990` hasta que llegue confirmado. El «no» a
      Operación es de la base. Estrena el `40990`, el `42290`, el `42291` y el `42292`. `prisma_api`
      en `0.22.0`, con 33 pruebas nuevas y 11 contra la base local ([§10](#10-decisiones-de-construcción-que-conviene-revisar))
- [x] [**7.5**](docs/08-plan-de-desarrollo.md#tarea-7-5) Cálculo de patrimonio · API —
      `POST /api/v0/consultas/patrimonio` devuelve lo que se ha construido y lo que se ha sacado:
      aportes menos distribuciones más utilidades acumuladas ([05 §6.4](docs/05-reglas-financieras.md#64-patrimonio-y-descapitalización)), con sus tres términos, lo
      repartido y lo generado en los últimos doce meses, la tasa de retiro que sale de ellos y cómo
      se partió el retiro del mes en curso. **El pro-labore no se resta como retiro**: es gasto y ya
      está dentro de las utilidades, así que restarlo otra vez lo contaría dos veces. **Las
      utilidades son las causadas mes a mes**, la misma cuenta del Inicio y del reporte, y no la
      suma del libro, que daría otra cifra con el mismo nombre en otra pantalla. La tasa falta
      cuando las utilidades del período no son positivas, y la lectura lo dice en palabras. El «no»
      a Operación lo pregunta la API con `fn_es_gerencia()`, como el tablero y el reporte. **La
      lectura viaja informativa**: su umbral es la [7.6](docs/08-plan-de-desarrollo.md#tarea-7-6). No estrena ningún código. `prisma_api` en
      `0.37.0`, con 12 pruebas nuevas y 2 contra la base local
- [x] [**7.6**](docs/08-plan-de-desarrollo.md#tarea-7-6) Alerta de descapitalización a 12 meses · API — la lectura del
      patrimonio pasa a nivel `critica` cuando lo repartido en los últimos doce meses supera lo que
      el negocio generó en el mismo período ([RF-49](docs/03-requisitos-y-bdd.md#rf-49), [BDD-24-1](docs/03-requisitos-y-bdd.md#bdd-24-1)): «Estás retirando más de lo que el
      negocio genera», con los dos montos y cuánto salió del patrimonio en vez de la ganancia.
      **No espera a que el patrimonio se ponga en rojo**, que es lo que la vuelve útil: el ejemplo
      del [05 §6.4](docs/05-reglas-financieras.md#64-patrimonio-y-descapitalización) deja $1.000.000 de patrimonio y aun así alerta. **Y sin nada repartido no
      alerta**, aunque el período haya dado pérdida ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). Por debajo del umbral dice cuántos
      centavos de cada peso generado se retiran, que es la frase del [10 §6](docs/10-ux-y-mockups.md#6-micro-decisiones-que-importan). No estrena ningún
      código ni mueve el contrato. `prisma_api` en `0.38.0`, con 3 pruebas nuevas
- [x] [**7.7**](docs/08-plan-de-desarrollo.md#tarea-7-7) Los cuatro sobres con historial · API, Front — **las dos mitades
      aterrizaron**. La API: `PUT /api/v0/sobres/{id}` define desde hoy cómo se reparte cada peso que
      entra en efectivo —costo directo, gastos fijos, reserva y retiro ([05 §11](docs/05-reglas-financieras.md#11-la-regla-de-los-4-sobres))— y
      `POST /api/v0/consultas/sobres` devuelve el reparto que rige. **Nada se sobrescribe**: cada
      cambio es una fila de `sobres_config`, vigente desde el día de Bogotá, así que el historial del
      [RF-51](docs/03-requisitos-y-bdd.md#rf-51) queda entero y la configuración de la semilla sigue donde estaba. **Las dos
      reglas las impone la base, con su control positivo en el fallo**: el «no» a Operación lo pone
      `sobres_solo_gerencia` —configurar responde `40300` y consultar le llega vacía, no con error
      ([P-07](docs/12-pruebas-y-calidad.md#p-07), [P-22](docs/12-pruebas-y-calidad.md#p-22))— y que los cuatro sumen 100 lo para `suma_cien`, cuyo `23514`
      **estrena el `42293`**, el código que el contrato de capital dejó pendiente para esta tarea. Una
      regla entre cuatro campos no cabe en el descriptor ([20 §4.4](docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)), y la API no la sabría
      mejor que la base. **No pidió migración**: la tabla, la restricción y la política están desde el
      esquema inicial. `prisma_api` en `0.27.0`, con 13 pruebas nuevas y 11 contra la base local.
      Y el Front: el panel «Los 4 sobres» cierra «Inversiones y retiros» por abajo, con la barra de
      cuatro tramos, los cuatro con su color y su porcentaje, y desde cuándo rige. **El historial no
      se pinta** —el [RF-51](docs/03-requisitos-y-bdd.md#rf-51) pide conservarlo, no mostrarlo— **y la suma tampoco se comprueba ahí**:
      el `42293` llega sobre `pctRetiro` y se lee debajo del último sobre. **Los cuatro colores los
      pone la pantalla**, los de la tarjeta del Inicio, porque el contrato manda cuatro claves
      sueltas y ninguna presentación ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). El panel no estaba dibujado y el mockup lo
      estrena. `prisma_front` en `0.22.0+27`, con 14 pruebas nuevas
- [x] [**7.8**](docs/08-plan-de-desarrollo.md#tarea-7-8) Panel de sobres: asignado contra usado · Front — el Inicio
      estrena «Los 4 sobres», detrás de «Cuentas», que es el orden del [10 §4.1](docs/10-ux-y-mockups.md#41-dashboard). La barra de
      cuatro tramos y, por sobre, lo asignado contra lo usado y lo disponible con su signo, en verde
      o en rojo; la reserva enseña además su avance hacia los tres meses de gastos fijos
      ([05 §11](docs/05-reglas-financieras.md#11-la-regla-de-los-4-sobres)). **Aterrizó en dos mitades, y las dos hacían falta**: el
      [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) declaró los cuatro sobres dentro del tablero, pero la API los venía mandando
      vacíos a propósito desde la [6.11](docs/08-plan-de-desarrollo.md#tarea-6-11), así que el panel no habría pintado nada. En la API,
      `RepartirEnSobres` aplica el porcentaje vigente de cada sobre a **lo que entró en efectivo en el
      mes** y le resta lo gastado con cargo a él, y la fila de cada sobre entra también en el archivo
      que se descarga del Inicio. **La reserva no gasta nada** —ningún movimiento se marca contra el
      colchón— y es la única con acumulado y meta: lo apartado mes a mes, con el porcentaje que regía
      en cada mes, contra tres meses de gasto fijo. El [08](docs/08-plan-de-desarrollo.md) la daba solo al front
      ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). `prisma_api` en `0.43.0`, con 19 pruebas nuevas. **Los nombres y los
      colores los pone la pantalla**, los mismos del panel de la [7.7](docs/08-plan-de-desarrollo.md#tarea-7-7), y una clave que el front
      no conozca se pinta neutra con su clave por nombre. **Lo que no se escribe es la frase con que
      el mockup cierra el panel** —«los gastos fijos consumieron el 49% de lo que entró»—, que es una
      lectura redactada sobre las cifras y le toca a la API ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). Sin reparto configurado la
      lista llega vacía y el panel no se pinta. `prisma_front` en `0.32.0+38`, con 12 pruebas nuevas
- [x] [**7.9**](docs/08-plan-de-desarrollo.md#tarea-7-9) Contrato de inversiones, aportes, retiros, pro-labore y sobres · Contrato — v0.13.0:
      diez operaciones, veintitrés esquemas y cinco códigos que estrenan el rango `90`–`99`. El
      retiro se registra de una vez y se parte solo si no se dice cómo: pro-labore hasta completar
      el del mes y el resto distribución. El pro-labore y los sobres no se editan: cada cambio es una
      fila nueva, vigente desde el día en que se guarda
- [x] [**7.10**](docs/08-plan-de-desarrollo.md#tarea-7-10) El límite de horas de una semana, que define Gerencia · Base, API,
      Front — de este número cuelgan tarifas ya cobradas, así que no se pisa: cada definición es
      una fila de `horas_limite_config` con su vigencia, y «Inversiones y retiros» estrena el panel
      debajo del pro-labore porque es el techo de sus horas ([RN-20](docs/03-requisitos-y-bdd.md#rn-20), [05 §6.5](docs/05-reglas-financieras.md)). El máximo del mes
      es el límite semanal por 52 entre 12, y pasarse responde el `42295`. **La tabla puede estar
      vacía a propósito**: mientras Gerencia no haya definido ninguno rige el valor por omisión del
      ambiente, 48 horas, y la respuesta lo dice con `porOmision`, así que el día que la jornada
      legal baje cambia la configuración y la base no se toca. Por lo mismo la migración no trae
      ningún trigger que juzgue las horas: quien conoce ese valor es la API, y un trigger que no lo
      conoce rechazaría lo que la aplicación acepta

### Cadena B · el pedido

<a id="sprint-5"></a>**[Sprint 5](docs/08-plan-de-desarrollo.md#sprint-5) · Productos y costeo**

- [x] [**5.1**](docs/08-plan-de-desarrollo.md#tarea-5-1) Dominio `Producto` y servicio `calcularMargenes` · API — los tres márgenes de
      [05 §7.2](docs/05-reglas-financieras.md#72-los-dos-márgenes) reproducidos producto por producto, con el margen por hora vacío —no en cero—
      cuando el ítem no consume tiempo
- [x] [**5.2**](docs/08-plan-de-desarrollo.md#tarea-5-2) Catálogo de productos y servicios · API, Front — **las dos mitades
      aterrizaron.** La API trae las seis rutas del contrato de la [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10) —crear con su primer
      costeo, guardar, desactivar y reactivar, el cuadro y la vista previa del formulario—, los
      códigos `40940` y `42240` y el tipo `numero` del descriptor, con el esquema `0.17.0`. La tarifa
      sale del pro-labore y se congela en el costeo; con la semilla, el cuadro es el de [05 §7.2](docs/05-reglas-financieras.md#72-los-dos-márgenes).
      **Y en el front se abre «Productos y servicios»**: la tabla de ocho columnas, y **las cinco de
      cifras se pintan solo si llegó el costeo**, así que a Operación le quedan el producto y el
      precio ([BDD-02-2](docs/03-requisitos-y-bdd.md#bdd-02-2)) sin que el front pregunte quién mira. El formulario lo describe la API y
      **su vista previa la calcula la API**: al teclear algo que costea se pide el costeo, agrupado a
      400 ms, y el deslizador de margen objetivo estrena el `precioSugerido` de la [5.7](docs/08-plan-de-desarrollo.md#tarea-5-7). Desactivar
      pide motivo con su descriptor y reactivar no pregunta nada. El cuadro ordenable con su barra es
      la [5.9](docs/08-plan-de-desarrollo.md#tarea-5-9)
- [x] [**5.3**](docs/08-plan-de-desarrollo.md#tarea-5-3) Costeo unitario: insumo, consumibles y minutos de trabajo · API — las dos fórmulas
      de [05 §7.1](docs/05-reglas-financieras.md#71-costo-unitario): el costo partido en materia y tiempo, y la tarifa por hora que sale del
      pro-labore o del salario. Reproduce la tabla de [06 §4.1](docs/06-nomina-y-capacidad-de-pago.md#41-el-margen-de-contribución-correcto). Atar el costeo al historial de cada producto es
      la [5.5](docs/08-plan-de-desarrollo.md#tarea-5-5), y el tiempo de máquina del bordado, la [5.4](docs/08-plan-de-desarrollo.md#tarea-5-4)
- [x] [**5.4**](docs/08-plan-de-desarrollo.md#tarea-5-4) Costeo de bordado por tiempo de máquina · API — **la columna
      `minutos_maquina` existía desde el esquema inicial y no tenía regla; ya la tiene.** Los
      minutos de máquina **no le suman pesos al costo unitario**: la tarifa por hora es un sueldo
      entre horas productivas y la bordadora no cobra sueldo, y su energía ya estaba nombrada entre
      los consumibles de [05 §7.1](docs/05-reglas-financieras.md#71-costo-unitario); cobrárselos a la tarifa de la persona contaría dos veces la
      hora que esa persona dedica a otra cosa ([RN-17](docs/03-requisitos-y-bdd.md#rn-17)). Lo que sí hacen es **ocupar el taller**, así
      que el margen por hora divide entre el mayor de los dos tiempos y no entre su suma: los dos
      corren solapados, y mientras la bordadora anda no se puede empezar otro bordado. El bordado
      de la tabla de [05 §7.2](docs/05-reglas-financieras.md#72-los-dos-márgenes), declarado como cinco minutos de persona y veintidós de máquina,
      baja de $11.800 a $9.136 de costo y sube a $43.265 por hora, con el mismo denominador de 22
      minutos. **Nace en cero, así que nada de lo que hay hoy cambia de cifra.** Contrato `0.24.0`
      con `minutosMaquina` en el formulario «producto», en la vista previa del costeo y en la
      respuesta `Costeo`, y el `42241` nuevo para sus decimales. **No pidió migración ni tocó el
      front**: el campo entra por el descriptor. `prisma_api` en `0.41.0`, con 1575 pruebas sin base
      ([§10](#10-decisiones-de-construcción-que-conviene-revisar))
- [x] [**5.5**](docs/08-plan-de-desarrollo.md#tarea-5-5) Historial de costos con fecha de vigencia · Base, API — el historial
      ya estaba; lo que faltaba era **leerlo hacia atrás**. `fn_costeo_vigente` dice qué costeo
      regía un día dado —la vigencia mayor que no pase de esa fecha, y el último registrado si hay
      empate—, y con él **cada pedido congela el costo que tenía el día en que se pidió**:
      `pedido_lineas.costo_unitario`, `horas_unitarias` y `pedidos.costo_directo` dejan de ser cero.
      Es `SECURITY DEFINER` a propósito, con el esquema `0.19.0`: el pedido lo registran los dos
      tipos de usuario y `costos_solo_gerencia` no le devuelve a Operación ni una fila, así que con
      `INVOKER` el costo dependería de quién lo digitó. **Y no lo devuelve a nadie**: el contrato no
      declara ningún campo de costo en el pedido ([RF-34](docs/03-requisitos-y-bdd.md#rf-34))
- [x] [**5.6**](docs/08-plan-de-desarrollo.md#tarea-5-6) Margen por hora · API — `CompararMargenes` arma el cuadro de [10 §4.4](docs/10-ux-y-mockups.md#44-productos-y-servicios),
      ordenado por margen por hora y también por porcentaje, y lee cada producto contra la mediana de
      los demás: con la tabla de [05 §7.2](docs/05-reglas-financieras.md#72-los-dos-márgenes), solo el rompecabezas rinde menos. Trae la lectura, su nivel y el
      texto con los montos; el endpoint es la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2) y su contrato, la [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10)
- [x] [**5.7**](docs/08-plan-de-desarrollo.md#tarea-5-7) Sugerencia de precio por margen objetivo · API — la vista
      previa de `POST /api/v0/consultas/costeo` dice **a cuánto habría que vender**: con
      `margenObjetivo` en el cuerpo devuelve el `precioSugerido` ([RF-33](docs/03-requisitos-y-bdd.md#rf-33)), que es el costo dividido por
      lo que queda del precio después del margen. **No es una fórmula nueva**: es despejar la
      definición de margen porcentual de [05 §7.2](docs/05-reglas-financieras.md#72-los-dos-márgenes), y el llavero del cuadro —$2.100 al 70 %— da sus
      $7.000. Sale en pesos enteros **sin redondeo comercial**, y **no depende del precio escrito**:
      con el precio en cero los márgenes no viajan y el sugerido sí, que es cuando más sirve
- [x] [**5.8**](docs/08-plan-de-desarrollo.md#tarea-5-8) Costos y márgenes ocultos al tipo Operación: la API no los envía · API —
      **no hizo falta código**: la base no le devuelve el costeo y sin él no hay de dónde sacar los
      márgenes. Lo que faltaba era la prueba del [12 §3](docs/12-pruebas-y-calidad.md#3-pruebas-de-permisos): [P-02](docs/12-pruebas-y-calidad.md#p-02) va ahora **por HTTP, con la sesión real
      de Operación**, y recorre el sobre entero del catálogo sin encontrar una cifra; la vista previa,
      guardar y reactivar le responden `40300` sin dejar nada escrito. `prisma_api` sigue en `0.22.0`
- [x] [**5.9**](docs/08-plan-de-desarrollo.md#tarea-5-9) Cuadro comparativo ordenable por margen por hora · Front —
      **el orden lo pone la API y el front solo lo pide**: «Ordenar por margen %» vuelve a pedir el
      cuadro con `orden: margen_porcentual`, el título dice cuál se pidió y la tabla se pinta como
      llega, sin reordenarla. El botón se decide por ausencia, como las columnas: sin cifras la API
      manda el catálogo por nombre. La última columna estrena la barra del mockup, el margen por hora
      contra el mayor del cuadro con el color del `nivel`. `prisma_front` sube a `0.27.0+33`
- [x] [**5.10**](docs/08-plan-de-desarrollo.md#tarea-5-10) Contrato de productos, servicios y costeo · Contrato — v0.12.0: seis
      operaciones, once esquemas y dos códigos que estrenan el rango `40`–`49`. El formulario se
      guarda de una vez y el costo no se sobrescribe: si cambió, entra una fila nueva. **A Operación
      no le llegan ni el costo ni los márgenes ni los minutos**, porque `costos_producto` lleva RLS
- [x] [**5.11**](docs/08-plan-de-desarrollo.md#tarea-5-11) El «solo Gerencia» de `productos`, en la base · Base — el contrato de la
      [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10) declara de solo Gerencia el alta, la edición, la desactivación y la reactivación, y
      la tabla tenía **RLS apagada**: `authenticated` conservaba `INSERT` y `UPDATE`, así que la
      [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2) lo habría resuelto con un `if`, que es lo que el [ADR-006](docs/adr/ADR-006-rls-por-rol.md) evita. Entran
      `productos_lectura` y `productos_escritura`, con el molde que la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10) le dio a `cuentas` y
      `categorias`: la lectura abierta, porque sin catálogo no hay pedido ni cotización, y la
      escritura en `FOR ALL`, porque desactivar y reactivar son `UPDATE`. Y las dos restricciones que
      `cargos` tiene desde el esquema inicial —`anulacion_con_motivo` y `desactivacion_con_motivo`—,
      con las que **ningún producto sale del catálogo sin motivo escrito**. Esquema `0.17.0` —y no la
      `0.16.0` que traía, que se llevó la [3.10](docs/08-plan-de-desarrollo.md#tarea-3-10) mientras esta tarea estaba abierta—, con 308
      comprobaciones, todas en `OK` salvo la de `pg_cron`, contra el mismo PostgreSQL 16 de la
      [3.19](docs/08-plan-de-desarrollo.md#tarea-3-19) y con la 3.10 ya adentro. **Le deja dos filas a la API**, y **falta promoverla a
      dev y a qa**

<a id="sprint-4"></a>**[Sprint 4](docs/08-plan-de-desarrollo.md#sprint-4) · Pedidos y anticipos**

- [x] [**4.1**](docs/08-plan-de-desarrollo.md#tarea-4-1) Dominio `Pedido`, estados y transiciones · API — los cinco estados y los siete pasos
      que existen entre ellos; entregado y cancelado son finales, y anular no es cancelar
- [x] [**4.2**](docs/08-plan-de-desarrollo.md#tarea-4-2) Gestión de clientes · API, Front — las tres operaciones de cliente
      sin estrenar ningún código, y **la pantalla «Pedidos y facturas», que nace con un solo panel**:
      «Clientes del taller». Los clientes no son una sección del menú —existen para que haya un
      pedido, así que se administran donde se usan— y la clave `pedidos` ya estaba en la navegación.
      **Lo que trababa la tarea era que el front no tenía de dónde saber quién puede anular**: el
      contrato estrena `puedeAnularClientes` en `Navegacion` (`0.21.0`), que vale lo mismo que
      `puedeGestionarCuentas` y se declara aparte para no atar dos permisos sin relación ([§10](#10-decisiones-de-construcción-que-conviene-revisar))
- [x] [**4.3**](docs/08-plan-de-desarrollo.md#tarea-4-3) Pedido con líneas de producto · API, Front — **el pedido ya se toma
      de punta a punta**: `PUT /api/v0/pedidos/{id}` escribe el encabezado y sus renglones en la
      misma transacción, con el valor que sale de las líneas y **no del cuerpo**, porque mandarlo
      sería dejar que el front calcule plata. Estrena el `42231` y el `42232`, que el contrato tenía
      pendientes. **El número visible lo pone la API** —`P-0287`, consecutivo y único— y se reparte
      con un cerrojo de aviso: sin él, dos registros a la vez arman el mismo y el segundo pierde un
      pedido ya digitado. **Los costos se quedan en cero**, y es la decisión de la tarea ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).
      **Y el contrato estrena una consulta**, `resumen-de-pedido` (`0.22.0`): las tres cifras que la
      pantalla pinta antes de guardar las da la API. En el front, «Nuevo pedido» entra encima de los
      clientes con su lista de renglones, y **al guardar pregunta por el abono**, que es otro caso de
      uso y otro formulario. `prisma_api` en `0.25.0`, con 1284 pruebas sin base y 300 contra ella;
      `prisma_front` en `0.17.0+21`, con 499
- [x] [**4.4**](docs/08-plan-de-desarrollo.md#tarea-4-4) `CobrarAnticipo`: crea pasivo, no ingreso · API —
      `POST /api/v0/pedidos/{id}/anticipos` escribe un movimiento `anticipo_recibido` colgado del
      pedido y su fila en `anticipos`, y responde el pedido entero con lo anticipado, el saldo y si
      está estancado. **Todo se valida antes de escribir**, porque el filtro confirma los `4xx`, y el
      pedido se lee reservado con `FOR UPDATE`: sin eso, dos cobros a la vez se pasaban juntos del
      valor. Estrena `40930`, `42230`, `42233` y `42234`. `prisma_api` en `0.15.0`, con 11 pruebas
      nuevas contra la base local
- [x] [**4.5**](docs/08-plan-de-desarrollo.md#tarea-4-5) Función en la base que entrega el pedido y causa la venta en una
      transacción · Base — `fn_entregar_pedido(p_pedido, p_fecha, p_cuenta)` es **la primera de las
      cuatro funciones de negocio del [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas)**: deja el pedido `entregado` con su fecha, devenga
      sus anticipos vigentes y escribe el `ingreso` por el saldo, las tres cosas o ninguna. **El
      movimiento vale el saldo y no el valor total**, que es la única lectura con la que las dos
      frases del contrato son ciertas a la vez y la cuenta no sube dos veces por la misma plata; **la
      venta causada la causa el pedido**, porque los ingresos causados del [05 §9.1](docs/05-reglas-financieras.md#9-catálogo-de-kpis) son la suma de
      los pedidos entregados del período ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). Sin cuenta se entrega igual y el saldo queda por
      cobrar ([CU-07 A1](docs/02-casos-de-uso.md#cu-07)). Esquema `0.18.0`, con 325 comprobaciones en `OK` contra la base local,
      diecisiete suyas. **No le deja ninguna fila a la API**: no agrega restricciones
- [x] [**4.6**](docs/08-plan-de-desarrollo.md#tarea-4-6) Listado ordenado por fecha con filtros · API, Front — **la pantalla
      de Pedidos ya lista lo que hay** ([RF-20](docs/03-requisitos-y-bdd.md#rf-20), [CU-08](docs/02-casos-de-uso.md#cu-08)). `POST /api/v0/consultas/pedidos` devuelve los
      pedidos por fecha, los más recientes primero y con el número desempatando el mismo día, con
      filtros por estado, cliente y rango. Cada fila trae lo anticipado, el saldo y si está
      estancado **ya calculados**, porque el front no suma plata ni cuenta días ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)).
      **Son tres consultas para toda la lista y no tres por pedido**: los renglones y los anticipos
      se leen con el mismo filtro que los encabezados, en la misma transacción, y una ficha por
      pedido serían `1 + 2n` viajes a la base para pintar una tabla. **Un rango al revés responde
      `42200` y no la lista vacía**, que escondería el error detrás de una tabla en blanco; media
      fecha sí vale, a diferencia del libro. Los anulados salen solo si se piden, y quién alcanza a
      ver uno lo dice `fn_es_gerencia()`. En el front, la lista entra **dentro del panel de
      Pedidos**, debajo del formulario, y el segmentado que el mockup dibujaba sin conectar pasa a
      ser el desplegable de los cinco estados del contrato ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). `prisma_api` en `0.30.0` con 19
      pruebas nuevas —9 de ellas contra la base local— y `prisma_front` en `0.23.0+28` con 7
      pruebas de la pantalla. El contrato sube a `0.22.1`: la descripción de `Idempotency-Key` de
      esa consulta decía la de una escritura, de antes del [ADR-030](docs/adr/ADR-030-contrato-sin-get.md)
- [x] [**4.7**](docs/08-plan-de-desarrollo.md#tarea-4-7) Resaltado de pedidos estancados · API, Front — **no agregó
      comportamiento, porque ya estaba: lo que faltaba era poder verlo fallar.** La regla la escribió
      la tarea [4.4](docs/08-plan-de-desarrollo.md#tarea-4-4) —el anticipo vigente más viejo con quince días o más y el pedido sin llegar a un
      estado final, con la entrega parcial contando como sin entregar ([RF-24](docs/03-requisitos-y-bdd.md#rf-24))— y la tarea [4.6](docs/08-plan-de-desarrollo.md#tarea-4-6) la
      trajo por fila y pintó la píldora «Sin entregar» en ámbar. **Lo que cierra esta tarea es la
      verificación**: la prueba de la pantalla afirmaba el *texto* de la píldora, así que cambiar el
      ámbar por el neutro pasaba en verde y el pedido crítico se quedaba tan callado como los demás
      ([10 §3.1](docs/10-ux-y-mockups.md#31-color)). Ahora afirma el tono, y también que **la condición le gana al estado**: con anticipo
      cobrado y estancado, el morado no se pinta al lado. [BDD-08-1](docs/03-requisitos-y-bdd.md#bdd-08-1) queda nombrado en las dos mitades,
      el caso de los 18 días en el dominio y el ámbar en la pantalla. **No se agregó ningún filtro
      «solo estancados» ni el conteo de días** ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). `prisma_front` en `0.23.1+29`, con las mismas
      563 pruebas: ninguna nueva, dos que ya estaban pasaron a mirar lo que importaba
- [x] [**4.8**](docs/08-plan-de-desarrollo.md#tarea-4-8) Factura adjunta al pedido · API, Front — **aterrizaron las dos
      mitades**. La de API ya estaba: `POST /api/v0/pedidos/{id}/adjuntos` sube la factura y la deja
      colgada del pedido ([RF-27](docs/03-requisitos-y-bdd.md#rf-27)), con el mismo cuerpo, el mismo techo de 5 MB y los mismos
      cuatro tipos que el soporte de un movimiento; el id del adjunto sigue siendo la clave de
      idempotencia, así que dos intentos escriben el mismo objeto. **No estrenó ningún código**: el
      `40020` y el `40021` no dependen de quién es el padre, y un pedido que no existe es el `40400`
      que produce `adjuntos_pedido_id_fkey`. `Adjunto` dejó de llevar el id del movimiento y lleva
      **de qué cuelga**, de donde sale la carpeta del objeto, y `vigentePorId` cambió su unión
      interna por dos por la izquierda: sin eso la factura de un pedido no se podía bajar. El pedido
      la devuelve en `adjuntos`, que el contrato estrena en el `0.23.0`. `prisma_api` en 0.30.0, con
      1336 pruebas sin base —doce nuevas— y cinco nuevas contra ella ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).
      **La pantalla la trae esta tarea**, y va donde no estaba dibujada: el mockup y el [10 §4.2](docs/10-ux-y-mockups.md#42-pedidos)
      estrenan la **fila abierta del pedido**, que hasta ahora era solo de Gerencia y ahora se abre
      para los dos tipos de usuario, porque la factura la adjuntan los dos. Adentro va lo que el
      pedido ya tiene —que llega con él, así que verlo no cuesta otra consulta— y «Adjuntar
      factura». **La factura se encola antes de salir a la red**, como la foto del recibo: lo que se
      toma en el taller no se pierde porque en ese momento no hubiera señal ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). Bajar un adjunto
      se mudó a `lib/datos/soportes.dart`, porque es la misma operación para los dos padres, y
      `AdjuntoDelLibro` se retiró: el contrato tiene un solo esquema. `prisma_front` en `0.24.0+30`,
      con 575 pruebas —doce nuevas—, y la fila abierta verificada en el navegador a 375 y a 1440 px
- [x] [**4.9**](docs/08-plan-de-desarrollo.md#tarea-4-9) Cancelación con destino del anticipo · API — `POST
      /api/v0/pedidos/{id}/cancelacion` deja el pedido `cancelado` con su motivo y con **qué pasa con
      el anticipo ya cobrado**: devolución o ingreso, en las cuatro columnas de la [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11). **Que el
      destino sea obligatorio depende del pedido y no del campo** —solo si le quedan anticipos por
      devengar—, así que lo exige la API con el `42235` que estrena, y no el descriptor ni el `CHECK`.
      Lo ya cerrado lo para el `WHERE` y no un `if`: dos cancelaciones a la vez no se pisan y la
      segunda responde `40932`. **No escribe ningún movimiento, y es la decisión de la tarea** ([§10](#10-decisiones-de-construcción-que-conviene-revisar))
- [x] [**4.10**](docs/08-plan-de-desarrollo.md#tarea-4-10) Contrato de clientes, pedidos y anticipos · Contrato — v0.10.0:
      nueve operaciones, catorce esquemas y nueve códigos que estrenan el rango `30`–`39`. La entrega
      recibe lo que recibe `fn_entregar_pedido` y nada más; cancelar y anular son dos operaciones
- [x] [**4.11**](docs/08-plan-de-desarrollo.md#tarea-4-11) `pedidos`: el motivo de la cancelación y el destino del anticipo · Base — las
      cuatro columnas que el contrato declaraba desde el `0.10.0` y la tabla no tenía.
      `cancelacion_con_motivo` no deja cancelar sin decir cuándo, quién y por qué, y
      `destino_del_anticipo_valido` solo admite devolución o ingreso. **Cancelar no es anular**, así
      que no reusa las columnas `anulado_*`. Y `v_pedidos` se volvió a crear, porque su `SELECT *` se
      congeló al crearla y no veía las columnas nuevas. Esquema `0.11.0`, con 199 comprobaciones en
      `OK` contra la base local. **Le deja tres filas a la API, y no dos**: la foránea de
      `cancelado_por` también la cuenta [C-01](docs/12-pruebas-y-calidad.md#c-01). Van en el PR que suba su `prisma.esquema`, y **falta
      promoverla a dev y a qa**

<a id="sprint-8"></a>**[Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8) · Cotizador**

- [x] [**8.8**](docs/08-plan-de-desarrollo.md#tarea-8-8) Cotizaciones y remisiones en PDF con logo · API, Front — seis rutas
      del rango `80`–`89`: emitir, listar, aceptar, anular y los dos papeles. El total lo calcula la
      API con el precio del catálogo del día, aceptar escribe el pedido y la cotización en la única
      transacción de la petición, y el PDF se arma a mano, sin librería, con el membrete en la
      configuración. Contrato `0.26.2`, que corrigió el `201` de la aceptación
- [x] [**8.9**](docs/08-plan-de-desarrollo.md#tarea-8-9) Validador de anticipo mínimo · API — `POST /api/v0/consultas/anticipo-minimo`, que el formulario de pedido y el cotizador rehacen con
      cada línea, antes de que exista nada que guardar. Cuenta el costo directo al costo vigente de
      cada producto, lo divide entre el valor total y devuelve el faltante en pesos con el
      porcentaje sugerido, el mínimo redondeado hacia arriba a múltiplo de cinco con cinco puntos
      de holgura. **El costo lo lee de `costos_producto` y no de `fn_costeo_vigente`**: esa función
      es `SECURITY DEFINER` para que las dos sesiones congelen el mismo costo sin verlo, y aquí el
      costo sale en la pantalla, así que `costos_solo_gerencia` tiene que poder decir que no. Por
      eso Operación recibe el mismo `40982` que un producto sin costear, dicho por la base
- [x] [**8.11**](docs/08-plan-de-desarrollo.md#tarea-8-11) Contrato de nómina, simulador, cotizaciones e importación · Contrato — v0.15.0:
      25 operaciones, 46 esquemas y 17 códigos que estrenan a la vez los tres rangos que quedaban
      vacíos. Un archivo baja dentro del sobre, en base64: es el esquema `Documento`
- [x] [**8.12**](docs/08-plan-de-desarrollo.md#tarea-8-12) Tablas `cotizaciones` y `cotizacion_lineas` · Base — las
      especifica el [04 §4.5](docs/04-modelo-de-datos.md#45-productos-costeo-y-cotizaciones) y las crea una migración: la cotización con su número único, la
      validez que **no vence antes de emitirse** (`42281`), el pedido en que se convirtió, que es único,
      y la anulación con motivo; y sus líneas, **sin costo ni horas**, porque el papel del cliente no los
      lleva y Operación lee la tabla. Una aceptada no se anula (`40980`), y el estado no es columna: se
      lee de la validez, el pedido y la anulación. **Llevan RLS aunque el [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) dijera que no
      hacía falta**: el contrato hizo de la anulación algo de solo Gerencia. Las leen y las emiten los dos
      tipos, a nombre propio; las aceptan los dos, y a Operación la anulación se la niega la base con
      `42501`; las líneas no las cambia nadie. Esquema `0.15.0`, con 291 comprobaciones en `OK` contra el
      PostgreSQL 16 de la [3.19](docs/08-plan-de-desarrollo.md#tarea-3-19), ahora con el `pg_cron` de verdad. **Le deja doce filas a la API**, y
      **falta promoverla a dev y a qa**


### Respaldo y auditoría · las puso el [ADR-047](docs/adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md)

Entraron al final del sprint, con el sprint ya en 12 de 12. **Sus siete dependencias están hechas**
—[8.11](docs/08-plan-de-desarrollo.md#tarea-8-11), [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12),
[6.8](docs/08-plan-de-desarrollo.md#tarea-6-8), [2.14](docs/08-plan-de-desarrollo.md#tarea-2-14),
[2.21](docs/08-plan-de-desarrollo.md#tarea-2-21), [1.4](docs/08-plan-de-desarrollo.md#tarea-1-4) y
[3.14](docs/08-plan-de-desarrollo.md#tarea-3-14)—, así que la primera se puede tomar ya.

- [x] [**8.13**](docs/08-plan-de-desarrollo.md#tarea-8-13) Contrato del respaldo y de la auditoría completa · Contrato — seis
      operaciones, tres formularios y tres códigos en el contrato `0.32.0`: el respaldo se genera, se
      baja por partes y se programa, y toda la auditoría se consulta con sus cuatro filtros
- [x] [**8.14**](docs/08-plan-de-desarrollo.md#tarea-8-14) El bucket `respaldos` y lo que la base impone · Base
- [x] [**8.15**](docs/08-plan-de-desarrollo.md#tarea-8-15) El respaldo en la API · API
- [x] [**8.16**](docs/08-plan-de-desarrollo.md#tarea-8-16) La programación automática del respaldo · Base, API
- [x] [**8.17**](docs/08-plan-de-desarrollo.md#tarea-8-17) La pantalla «Configuración» y el panel «Exportar respaldo» · Front
- [x] [**8.18**](docs/08-plan-de-desarrollo.md#tarea-8-18) La auditoría completa en la API · API
- [ ] ⚡ [**8.19**](docs/08-plan-de-desarrollo.md#tarea-8-19) El panel «Auditoría» en Configuración · Front

### Amortiguador · Nómina

La toma quien termine primero su cadena: es la funcionalidad más independiente del sistema.

- [x] [**8.1**](docs/08-plan-de-desarrollo.md#tarea-8-1) Registro de empleadas · API, Front
- [x] [**8.2**](docs/08-plan-de-desarrollo.md#tarea-8-2) Liquidación de nómina en la base, descontando adelantos · Base — `fn_liquidar_nomina`,
      la segunda función de negocio del [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas): en una sola transacción escribe el movimiento del
      pago, la fila de `nomina_detalle` con las cifras del [06 §6.1](docs/06-nomina-y-capacidad-de-pago.md#61-fórmulas) y la marca `descontado_en` de los
      adelantos pendientes de esa persona. Al devengado entran el salario del período y el total de
      las horas extra, y **no las tarifas por hora**, que son el precio de una hora y dan los
      1.366.019 que el [06 §6.2](docs/06-nomina-y-capacidad-de-pago.md#62-ejemplo-de-liquidación) llama el error frecuente. **El movimiento vale el neto y no el
      devengado**: es la plata que de verdad sale de la cuenta —el adelanto ya había salido— y el
      gasto de personal lo causa `nomina_detalle`, como la venta la causa el pedido. Un solo
      rechazo, el del mes cerrado, cuyo texto la API traduce al `40951`; lo demás ya tiene quien lo
      rechace. Esquema `0.22.0`, sin restricciones nuevas
- [x] [**8.3**](docs/08-plan-de-desarrollo.md#tarea-8-3) Adelantos como cuenta por cobrar · API — las tres rutas de
      `/adelantos`: entregar uno escribe en la misma transacción el adelanto y un movimiento de tipo
      `adelanto_empleada`, anularlo deshace los dos de una vez con `fn_anular_movimiento`, y la
      consulta devuelve la cuenta por cobrar viva con la antigüedad en días. **Baja la caja y no
      registra gasto**: el de personal se reconoce entero en la liquidación ([RN-11](docs/03-requisitos-y-bdd.md#rn-11)). La antigüedad la
      calcula el caso de uso, que es quien tiene el reloj, y quién ve qué lo decide
      `adelantos_lectura`. Contrato `0.26.2`, ya acordado, sin migración
- [x] [**8.4**](docs/08-plan-de-desarrollo.md#tarea-8-4) Desprendible PDF con acceso restringido al propio · API —
      `POST /api/v0/consultas/desprendible` devuelve el desprendible de una liquidación en PDF con el
      logo, dentro del sobre y en base64: las seis secciones del [06 §8](docs/06-nomina-y-capacidad-de-pago.md#8-desprendible-de-pago), con cada adelanto en su
      renglón con su fecha y el neto en números y en letras. **Que Operación vea únicamente el suyo
      lo decide `nom_lectura`**, no la API: la fila de otra persona no vuelve de la consulta, así que
      para la API no existe y responde `40400` ([RF-63](docs/03-requisitos-y-bdd.md#rf-63)). Las cinco tablas se leen en **una sola
      consulta**, que es la [P-31](docs/12-pruebas-y-calidad.md#p-31): leídas por separado, una política demasiado estrecha en
      `empleados` vaciaría el papel sin dar ningún error. El papel no se imprime si la resta no da el
      neto liquidado. Esquema `0.22.0`, contrato `0.26.2`, ya acordado, sin migración
- [x] [**8.5**](docs/08-plan-de-desarrollo.md#tarea-8-5) Simulador de capacidad de pago · API, Front — `POST
      /api/v0/consultas/simulacion-de-contratacion` promedia la utilidad operativa de los meses
      terminados con registro, aparta la reserva y compara lo que queda con el salario que se
      evalúa. **La utilidad ya trae el pro-labore descontado**, que es el error del [06 §3.2](docs/06-nomina-y-capacidad-de-pago.md#32-por-qué-el-pro-labore-es-obligatorio-en-este-cálculo-rn-09): por eso
      la consulta se bloquea con el `40950` cuando no hay pro-labore vigente en vez de contestar una
      cifra inflada. Cuando no alcanza propone media jornada o pago por obra, con el faltante
      mensual. El front lo pinta con dos deslizadores, el del salario y el de la reserva, que
      vuelven a preguntar 350 ms después del último movimiento. Contrato `0.26.2`, ya acordado, sin
      migración
- [x] [**8.6**](docs/08-plan-de-desarrollo.md#tarea-8-6) Traducción a unidades de producto por vender · API — cuando el
      simulador dice que no alcanza, la misma respuesta trae un renglón por producto con cuántas
      unidades más al mes y cuánto trabajo piden, y las horas del camino más barato ([06 §4](docs/06-nomina-y-capacidad-de-pago.md#4-ventas-adicionales-necesarias--la-traducción-a-unidades)). El
      margen que traduce es el de contribución, `precio − (insumo + consumibles)`: descontar también
      el tiempo contaría dos veces el gasto que se trata de cubrir ([RN-17](docs/03-requisitos-y-bdd.md#rn-17)). **Y cuando esa meta
      pide menos del 20 % de la jornada evaluada, el veredicto dice que la restricción no es la
      capacidad de producir sino la demanda** ([06 §4.2](docs/06-nomina-y-capacidad-de-pago.md#42-resultado-para-el-faltante-de-556000)). Contrato `0.26.2`, ya acordado, sin
      migración
- [x] [**8.7**](docs/08-plan-de-desarrollo.md#tarea-8-7) Horas pagadas contra horas facturadas · API, Front — la nómina
      liquidada más el pro-labore, contra las horas congeladas de lo entregado en el mes, y lo que
      cuesta la diferencia con la tarifa del pro-labore que regía ese mes ([06 §9](docs/06-nomina-y-capacidad-de-pago.md#9-horas-pagadas-vs-horas-facturadas)). Los tres
      tramos los decide la API sobre el porcentaje con un decimal que se pinta; sin pro-labore es el
      `40950`. El front lo pinta en Reportes, al lado del punto de equilibrio, con su propia
      consulta. Contrato `0.26.2`, ya acordado, sin migración
- [x] [**8.10**](docs/08-plan-de-desarrollo.md#tarea-8-10) Importador de CSV con mapeo y reporte de errores · API, Front — la API
      lee el CSV sin escribir y lo confirma con su id, con el informe fila por fila y el `40970` de
      las duplicadas. El front lo pinta en Movimientos, en el panel «Importar el histórico» que el
      [10 §4.3](docs/10-ux-y-mockups.md#43-movimientos) dibujó para esta tarea: elegir, relacionar las columnas y revisar antes de cargar.
      Contrato `0.26.2`, ya acordado, sin migración

---

## <a id="titulo-6"></a>6. <a id="sprint-9"></a>[Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9) · promoción, PWA y endurecimiento

**No se parte: se hace todo junto**, porque consiste en integrar y probar lo de todos.

- [x] [**9.1**](docs/08-plan-de-desarrollo.md#tarea-9-1) PWA instalable y cola persistente con la clave guardada antes de enviar · Front — el
      manifiesto en español con el tema del mockup, y la cola en IndexedDB que sobrevive a cerrar la
      aplicación: guarda la intención con su clave antes de enviarla, reintenta con la espera de
      [17 §5.2](docs/17-resiliencia-offline-y-cache.md#52-cuánto-se-espera-entre-reintentos) y deja «no sincronizada», con el mensaje de la API, lo que se rechazó con motivo
- [x] [**9.2**](docs/08-plan-de-desarrollo.md#tarea-9-2) Las etapas qa y uat de la tubería, uat con su semilla anonimizada · Base, API — la
      rama del PR o del empuje dice qué etapa corre, y a mano se elige sobre cualquier rama. En la
      base, qa levanta Supabase y **exige el informe entero en `OK`**, y uat le suma
      `semilla-uat.sql` —la semilla fija más 200 clientes, 600 pedidos y 5 000 movimientos
      sintéticos— y lo vuelve a pedir. En la API, qa construye la imagen y uat corre la integración
      sobre ese volumen. **La primera corrida encontró seis filas rojas**: las tres de la [7.10](docs/08-plan-de-desarrollo.md#tarea-7-10),
      y otras tres que solo fallan en Supabase, donde `postgres` no es superusuario y no podía
      hacer `SET ROLE prisma_api`. Nadie las había visto porque ninguna tubería corría el informe.
      El CHECK del límite de horas pasó a `horas_limite_config_horas_positivas`, en el esquema `0.23.0`
- [x] [**9.3**](docs/08-plan-de-desarrollo.md#tarea-9-3) El artefacto se construye una vez en qa y llega a prod sin recompilar · API, Front — la
      etapa qa publica en GHCR la imagen de la API y la de prod del front, con su versión y el árbol
      de git en `prisma.arbol`. uat y `main` comprueban por el árbol que es la misma y la marcan
      sin recompilar. **El despliegue a prod queda escrito pero sin ensayar**, porque prod no existe
- [x] [**9.4**](docs/08-plan-de-desarrollo.md#tarea-9-4) Reversión ensayada en dev, con el tiempo medido · API, Front — se revirtieron
      los dos tareas a la vez en dev y se volvieron a adelantar, midiendo de la hora del disparo a la hora
      en que la versión anterior contestó por HTTP: **la API en 17 s y 19 s, con cuatro o cinco
      segundos sin contestar; el front en 10 s y 10 s, sin hueco**. Medio minuto, no media hora, y
      eso vuelve la reversión la primera respuesta y no el último recurso. En cada repositorio de
      código `.github/scripts/revertir.sh` pregunta qué versión hay publicada, espera a la que tiene
      que volver y, en el front, juzga el commit. **Un intento del front falló al preparar la imagen
      y la versión publicada siguió atendiendo**: reintentado sin cambiar nada, entró. La base no se
      tocó, y la API anterior habló con el esquema de hoy. Lo que el ensayo dejó a la vista está en
      el [19 §7.4](docs/19-ambientes-y-entrega.md#74-el-ensayo-en-dev-con-el-reloj-en-la-mano) y la decisión que abrió, en el [§10](#titulo-10)
- [x] [**9.5**](docs/08-plan-de-desarrollo.md#tarea-9-5) Prueba de permisos con sesión real en cada etapa y contra dev · API — [P-01](docs/12-pruebas-y-calidad.md#p-01) a
      [P-32](docs/12-pruebas-y-calidad.md#p-32) ya corrían en cada etapa contra la base de la tubería, y en uat sobre su volumen. Lo que
      cambia es el trabajo que las lanza contra un ambiente: `permisos-en-qa` pasa a
      `permisos-en-dev`, con seis secretos `DEV_*`, en el empuje a las cuatro etapas y de a una
      corrida. **Sin esos secretos se salta con aviso**, y cargarlos es la [9.13](docs/08-plan-de-desarrollo.md#tarea-9-13)
- [x] [**9.6**](docs/08-plan-de-desarrollo.md#tarea-9-6) Pruebas de extremo a extremo de los flujos críticos en qa · API,
      Front — los siete flujos del [12 §11](docs/12-pruebas-y-calidad.md#11-flujos-críticos-de-extremo-a-extremo): entrar y recibir el menú, registrar un gasto y
      **verlo mover la utilidad del mes por su valor**, cobrar un anticipo y verla **no moverse**,
      anular con motivo y ver volver la cifra con la fila intacta, reenviar con la misma clave y
      seguir con una sola fila, el PDF de la cotización y el veredicto del simulador.
      **Escritos una vez y corriendo en dos sitios**: contra la aplicación que levanta la tubería,
      en cada empuje, que es lo que prueba que las pruebas sirven; y contra la API desplegada, que
      es lo que prueba que el ambiente sirve. La mitad de front los recorre **por el código del
      front** y no por HTTP a mano, que es lo único que comprueba que la ruta, el verbo y el nombre
      de cada campo son los que esta aplicación manda. ✏️ queda la corrida contra qa, escrita y sin
      correr: **el ambiente qa de aplicación no existe todavía** ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)), así que el trabajo de la
      tubería se salta nombrando lo que falta, y [M-03](docs/12-pruebas-y-calidad.md#m-03) no se pudo escribir porque su ruta está
      acordada y sin implementar ([§10](#10-decisiones-de-construcción-que-conviene-revisar))
- [x] [**9.7**](docs/08-plan-de-desarrollo.md#tarea-9-7) Rendimiento en celular real con 4G · Front — el trabajo
      «Rendimiento con 4G» de la CI mide en cada empuje, con Chromium de celular, la CPU cuatro
      veces más lenta y dos perfiles de red. **Las visitas siguientes cumplen** —1,3 s, y 1,1 s sin
      red, desde el service worker— y son la puerta. **La primera no**: 3,6 MB, 4,5 s con 4G típico
      y unos 20 s con el lento ([§10](#10-decisiones-de-construcción-que-conviene-revisar)). ✏️ queda la medición en un celular del taller, que es la del [RNF-01](docs/03-requisitos-y-bdd.md#rnf-01)
- [x] [**9.8**](docs/08-plan-de-desarrollo.md#tarea-9-8) Repaso de secretos: nada en los repositorios y `service_role` solo en migraciones · API — el
      escaneo que pedía [RNF-24](docs/03-requisitos-y-bdd.md#rnf-24) y que no existía, buscando **valores** y no nombres: un JWT entero, una
      referencia de proyecto, una credencial dentro de una cadena de conexión y un `.env.ejemplo` que
      dejó de estar vacío. Va en su propia tarea de Gradle, porque dentro de `test` la caché lo daba
      por bueno sin correrlo. Lo que se vio en los otros dos tareas a la vez quedó en el [§9](#titulo-9)
- [x] [**9.9**](docs/08-plan-de-desarrollo.md#tarea-9-9) El front rechaza de verdad un MAJOR de API distinto · Front — [C-02](docs/12-pruebas-y-calidad.md#c-02) ya
      cubría sus tres casos, pero todos pasándole el MAJOR a mano: **nada probaba que la aplicación
      usara `PRISMA_API_MAJOR`**, así que un `0` escrito en `main.dart` pasaba en verde. Ahora se
      prueban el cableado, la consulta en el cable, que un sobre raro no plante y el texto del
      documento. La pantalla se desviaba del mockup y **el documento se alineó al código**, con
      autorización. **La prueba contra una API real ya corrió**, contra dev y con la [9.10](docs/08-plan-de-desarrollo.md#tarea-9-10): no le
      faltaba ambiente, le faltaba poder salir a la red —el arnés de Flutter sustituye el cliente
      HTTP y la petición nacía en su reloj falso—, y eso se arregló ahí
- [x] [**9.10**](docs/08-plan-de-desarrollo.md#tarea-9-10) Etiquetar `1.0.0` del front y de la API · API, Front — la API queda en
      `1.0.0` y el front en `1.0.0+47`, y **la etiqueta `v<versión>` la pone la tubería**: un flujo
      por repositorio la crea en cada empuje a `develop`, sobre el commit con que esa versión entró,
      y nunca mueve una que ya exista. A mano se saltaba —en la base, ocho veces seguidas—. Las
      anteriores a la `1.0.0` se quedan sin etiqueta: ponerlas ahora sería inventar fechas.
      **Subir el MAJOR es un despliegue coordinado**: el front exige igualdad en las dos
      direcciones, así que entre los dos despliegues se planta, y es correcto. Lo que eso pide está
      en el [19 §4.3](docs/19-ambientes-y-entrega.md#43-el-contrato-de-compatibilidad). El MAJOR que el front exige estaba escrito en cuatro sitios y **ninguna
      prueba los cruzaba**: ahora `ambiente_test` falla si se desincronizan. La ruta sigue siendo
      `/api/v0`: el prefijo no es el MAJOR de SemVer ([ADR-030](docs/adr/ADR-030-contrato-sin-get.md))
- [x] [**9.11**](docs/08-plan-de-desarrollo.md#tarea-9-11) Swagger detrás de autenticación en prod · API — autenticación básica en un
      filtro propio, que es lo único que un navegador resuelve solo. **Y son cuatro puertas, no una**:
      `/docs` solo redirige, el documento entero cuelga de `/docs/openapi` y la interfaz sale de
      `/swagger-ui` y de `/webjars`, así que cerrar `/docs` dejaba el mapa igual de público. Se vio
      probándolo contra la aplicación levantada. **Falla cerrado**: sin credencial configurada esas
      rutas contestan como si no existieran. Se quitó el apagón provisional del perfil `prod`
- [ ] ⚡ [**9.12**](docs/08-plan-de-desarrollo.md#tarea-9-12) El proyecto uat de Supabase, el único de pago de este proyecto · Decisión — salió
      de partir la [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4), y desde el [ADR-044](docs/adr/ADR-044-dos-ambientes-desplegados.md) ya no llevaba uat. El [ADR-045](docs/adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md) lo llamó
      pre-prod, y el [ADR-053](docs/adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) quitó pre-prod y le devolvió el papel a uat; el prod del taller sigue
      en otro repositorio. El expediente y la cifra están en el
      [§7.1](#71-el-expediente-de-uat-y-prod) y lo único que falta es la firma
- [ ] ⚡ [**9.13**](docs/08-plan-de-desarrollo.md#tarea-9-13) Los secretos de GitHub para correr permisos y extremo a extremo contra dev · Decisión — la configuración que los trabajos del CI ya esperan desde la [2.11](docs/08-plan-de-desarrollo.md#tarea-2-11) y la [9.6](docs/08-plan-de-desarrollo.md#tarea-9-6), que apuntaban a qa y desde el [ADR-044](docs/adr/ADR-044-dos-ambientes-desplegados.md) apuntan a dev; sin ella se saltan con aviso. Los de permisos ya se llaman `DEV_BASE_URL`, `DEV_BASE_CLAVE_DUENO`, `DEV_BASE_CLAVE_API`, `DEV_AUTH_URL`, `DEV_ANON_KEY` y `DEV_SERVICE_ROLE_KEY` ([9.5](docs/08-plan-de-desarrollo.md#tarea-9-5))
- [x] [**9.14**](docs/08-plan-de-desarrollo.md#tarea-9-14) El ambiente de despliegue en el código · API, Front — se hizo con
      `pre-prod`, que entró al contrato (`0.28.0`), a `PRISMA_AMBIENTE` y a un perfil de Spring con
      Swagger cerrado, igual que prod. **El [ADR-053](docs/adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) quitó ese ambiente y puso a `uat` en su lugar**:
      el contrato (`0.34.0`) deja el enum en `dev`, `qa`, `uat` y `prod`, el perfil que cierra
      Swagger se llama `uat` y su clave es `UAT_GERENCIA_CLAVE`. `:prod` queda para la entrega ([9.15](docs/08-plan-de-desarrollo.md#tarea-9-15)).
      La base no cambió: `sembrar.ps1` y `promover.ps1` solo admiten dev y qa
- [x] [**9.15**](docs/08-plan-de-desarrollo.md#tarea-9-15) La entrega del release a prod, en el repositorio del taller · Base,
      Decisión — quien dirige respondió las tres preguntas, y el [ADR-052](docs/adr/ADR-052-la-entrega-del-release-a-prod.md) las escribe: un solo
      repositorio espejo de la cuenta del taller, que recibe **el árbol de `main` y además las dos
      imágenes** que compiló qa —copiadas con `imagetools create`, sin recompilar y con su
      `prisma.arbol` intacto—, y **la dispara una persona**, nunca un empuje. Sale de `main` porque
      es la última etapa desde el [ADR-050](docs/adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md), que lo dejó a vigilar justo para esta
      tarea. `entregar-release.yml` vive en `prisma_db`, pide quién aprobó y el nombre del espejo
      escrito entero, y viene en seco por omisión. La etiqueta `entrega-vN` que empuja es lo que
      arranca el pipeline del otro lado. ✏️ **la entrega no ha corrido nunca**: faltan las variables
      `PROD_API_URL` y `PROD_API_MAJOR` del front, sin las cuales qa no compila el artefacto de
      prod, el repositorio espejo con su llave, la credencial de paquetes de esa cuenta, un token
      con lectura de los dos repositorios privados ([ADR-051](docs/adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)) y el proyecto de Supabase de prod,
      que paga ese lado. Las puertas que miran el sobre se vieron fallar una por una; las tres que
      le preguntan al registro necesitan esas credenciales
- [x] [**9.16**](docs/08-plan-de-desarrollo.md#tarea-9-16) La cuenta de administrador del primer arranque · Base, API, Front — una
      credencial temporal por ambiente, `Admin`/`Admin` por defecto, que solo sirve para crear la
      primera cuenta de Gerencia cuando no hay ninguna, y que se apaga sola cuando esa cuenta existe
- [x] [**9.17**](docs/08-plan-de-desarrollo.md#tarea-9-17) La entrega a cada emprendimiento, desde el monorepo de producto · Base, Decisión —
      la entrega va una sola vez al monorepo de producto y sin copiar las imágenes ([ADR-054](docs/adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md)), y
      cada emprendimiento instala con «Instalar» y tres secretos, y actualiza con «Actualizar».
      Los dos flujos están escritos y todavía no han corrido contra cuentas reales

**<a id="sprint-10"></a>[Sprint 10](docs/08-plan-de-desarrollo.md#sprint-10) · la retroalimentación de Gerencia**

**Salen de usar la aplicación**, no de diseñarla: Gerencia dijo las tres primeras el 2026-10-06 y
las cinco siguientes el 2026-10-16, mirando dev. Cada una pasa primero por la especificación y el
mockup, porque todas cambian lo acordado.

- [x] [**10.1**](docs/08-plan-de-desarrollo.md#tarea-10-1) El asterisco de los campos obligatorios · Front — la etiqueta de un campo
      obligatorio termina en asterisco rojo y su lector de pantalla lee «obligatorio». Lo dicta el
      descriptor, que ya trae `obligatorio`, así que el contrato no cambia
- [x] [**10.2**](docs/08-plan-de-desarrollo.md#tarea-10-2) Un solo medio de pago, y el destino solo en la transferencia · API, Front — la
      pantalla de un gasto pedía una cuenta de destino para después avisar que sobraba. El front
      vuelve a pedir el formulario con el tipo elegido y la API contesta con los campos que aplican
- [x] [**10.3**](docs/08-plan-de-desarrollo.md#tarea-10-3) Fuera el tiempo, y el margen por producto · Base, API, Front — el catálogo deja
      de pedir minutos, la mano de obra se escribe en pesos y el margen por hora sale de la pantalla
      y del contrato. Con el tiempo se retiran [RF-31](docs/03-requisitos-y-bdd.md#rf-31), [RF-32](docs/03-requisitos-y-bdd.md#rf-32), [RF-62](docs/03-requisitos-y-bdd.md#rf-62), [CU-10](docs/02-casos-de-uso.md#cu-10) y [CU-27](docs/02-casos-de-uso.md#cu-27)
- [x] [**10.4**](docs/08-plan-de-desarrollo.md#tarea-10-4) Entregar el pedido, y no sin pagarlo · API — la ruta que el contrato
      acordó y nadie implementó, llamando a `fn_entregar_pedido`. Con ella entra la regla nueva: un
      pedido no se entrega con saldo pendiente, y sin la cuenta donde entra lo que falta responde
      `42236`. La base no cambia
- [x] [**10.5**](docs/08-plan-de-desarrollo.md#tarea-10-5) La condición de pago, y qué se puede hacer con un pedido · API — cada pedido
      viaja diciendo si está sin pagar, pagado a medias o pagado, y si se le puede cobrar, entregar
      o cancelar. Ninguna es columna nueva
- [x] [**10.6**](docs/08-plan-de-desarrollo.md#tarea-10-6) La fila abierta del pedido: cobrar, entregar y cancelar · Front — las tres
      acciones que hoy no tienen botón. Es lo que Gerencia reportó: un pedido registrado sin cobrar
      no se puede marcar pagado al día siguiente
- [x] [**10.7**](docs/08-plan-de-desarrollo.md#tarea-10-7) La columna Estado dice si está pagado · Front — «Sin pagar», «Pago parcial» o
      «Pagado» mientras el pedido vive, y «Entregado» o «Cancelado» al final. Retira «Anticipo
      cobrado», que decía que había plata pero no cuánta faltaba
- [x] [**10.8**](docs/08-plan-de-desarrollo.md#tarea-10-8) Cuándo entró cada caso de uso · Contrato — la tabla del [02 §4](docs/02-casos-de-uso.md#4-cuándo-entró-cada-caso-de-uso) llenada hacia
      atrás para los 32 que faltan, y la comprobación que impide que envejezca

**<a id="sprint-11"></a>[Sprint 11](docs/08-plan-de-desarrollo.md#sprint-11) · el privilegio mínimo de la API**

**Sale de una decisión de seguridad**, no de una queja de uso: quien dirige pidió el 2026-10-23
bajar el riesgo al mínimo y aprobó el nivel 7 de la escala, que es privilegios explícitos sobre
migraciones aplicadas por tubería. El proyecto está hoy en el nivel 5. Cerrar el esquema detrás de
un catálogo de funciones, que sería el 8, queda para después y no está descartado.

- [x] [**11.1**](docs/08-plan-de-desarrollo.md#tarea-11-1) Los guiones de la base corren en Linux · Base — `la-version-subio`,
      `promover` y `sembrar` pasan a `sh`, con el `.ps1` como envoltorio de una línea y una sola
      implementación. El `ci.yml` dejó de descargar PowerShell 7.4.6 en cada PR, y la puerta [C-05](docs/12-pruebas-y-calidad.md#c-05)
      lleva sus 23 pruebas, que no necesitan base ni red ([ADR-070](docs/adr/ADR-070-las-migraciones-las-aplica-la-tuberia.md))
- [x] [**11.2**](docs/08-plan-de-desarrollo.md#tarea-11-2) El PR dice qué va a aplicar · Base — el `db push` en seco contra el
      ambiente de la etapa, en el resumen de la corrida. Falla si el ambiente ya tiene una
      migración del PR, porque entonces alguien la aplicó por fuera de la tubería, y avisa sin
      bloquear si el ambiente está atrasado. El juicio vive en `el-ensayo-en-seco.sh`, con sus 11
      pruebas sin base y sin red ([ADR-070](docs/adr/ADR-070-las-migraciones-las-aplica-la-tuberia.md))
- [x] [**11.3**](docs/08-plan-de-desarrollo.md#tarea-11-3) La tubería aplica las migraciones · Base — `migrar.yml` aplica al
      fusionar: a dev, a qa y a uat, cada ambiente un GitHub Environment, así que quién aprueba uat
      se configura en *Settings → Environments* y no en el archivo. Corre en seco primero y deja en
      el resumen qué aplicó y qué versión quedó. La clave del rol la pone el flujo desde el secreto
      de su ambiente, con `fijar-clave-del-rol.sh` y sus 11 pruebas. **Falta poner los cuatro
      secretos por ambiente** ([ADR-070](docs/adr/ADR-070-las-migraciones-las-aplica-la-tuberia.md))
- [x] [**11.4**](docs/08-plan-de-desarrollo.md#tarea-11-4) El privilegio de `prisma_api` es del tamaño de su uso · Base — el
      `GRANT … ON ALL TABLES` se reemplazó por la lista explícita por tabla y por columna, y
      `ALTER DEFAULT PRIVILEGES` dejó de conceder. Como toda consulta corre con
      `SET LOCAL ROLE authenticated`, la lista es de ese rol y `prisma_api` quedó **sin ninguna
      tabla**: lo que acota una clave robada conectada directo. Esquema 0.28.0, con sus ocho filas
      en `verificar-base.sql` y las dos roturas vistas fallar. RLS no se tocó ([ADR-071](docs/adr/ADR-071-el-privilegio-es-del-tamano-del-uso.md))
- [ ] [**11.5**](docs/08-plan-de-desarrollo.md#tarea-11-5) [C-06](docs/12-pruebas-y-calidad.md#c-06), la puerta que cruza el uso con la concesión · API — los adaptadores
      contra `information_schema.column_privileges`, en los dos sentidos: una concesión que nadie
      usa también falla

---

## <a id="titulo-7"></a>7. Decisiones pendientes



| # | Decisión | Quién | Bloquea | Estado |
|---|---|---|---|---|
| 1 | Dónde se aloja la API | Quien dirige | Tarea [0.8](docs/08-plan-de-desarrollo.md#tarea-0-8) | ✅ Railway, y **dev desde ya** ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md), que reemplazó al [ADR-026](docs/adr/ADR-026-railway-al-final.md)); qa, uat y prod al final |
| 2 | Dónde se publica el front web | Quien dirige | Tarea [0.9](docs/08-plan-de-desarrollo.md#tarea-0-9) | ✅ Railway, y **dev desde ya** ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md), que reemplazó al [ADR-026](docs/adr/ADR-026-railway-al-final.md)); qa, uat y prod al final |
| 3 | El pago de pre-prod, el proyecto de Supabase que falta ([ADR-045](docs/adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)) | Quien dirige crea; Gerencia paga | Tarea [9.12](docs/08-plan-de-desarrollo.md#tarea-9-12) | 🟡 dev y qa quedaron configurados, con el esquema y la semilla aplicados, y con ellos se cerró la [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4). **El expediente está listo y la cifra es ≈ 55 USD al mes** ([§7.1](#71-el-expediente-de-uat-y-prod)); falta la firma de Gerencia, que es el paso 2 del [09 §3.1](docs/09-plan-de-implantacion.md#31-alistamiento-técnico-de-los-ambientes) |
| 4 | PostgreSQL para desarrollar sin Docker | Quien dirige | Tareas [0.5](docs/08-plan-de-desarrollo.md#tarea-0-5) y [0.10](docs/08-plan-de-desarrollo.md#tarea-0-10) | ✅ El proyecto dev de Supabase, mientras Docker no arranque |
| 5 | Remotos de los repositorios | Quien dirige | Integración continua | ✅ Los cuatro en GitHub |
| 6 | Cómo consiguen la API y su CI el esquema de `prisma_db` | La API | Tareas [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7), [1.8](docs/08-plan-de-desarrollo.md#tarea-1-8) y [1.15](docs/08-plan-de-desarrollo.md#tarea-1-15) | ✅ Por etiqueta, con el Supabase CLI en la tubería ([ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md)) |
| 7 | Quién trabaja cada repositorio, y quién sabe Flutter y Java para revisar el contrato | Quien dirige | Trabajar en más de una tarea a la vez | ⬜ |
| 8 | Contrato por etiqueta de git o como paquete publicado | Los dos lados | El primer cambio de contrato | ✅ **Por etiqueta**: `contrato-vX.Y.Z` en cada fusión que cambie `openapi.json`, como se inclinaba el [21 §8](docs/21-trabajo-en-paralelo.md#8-qué-hay-que-decidir-antes-de-trabajar-dos-tareas-a-la-vez). Un paquete publicado pedía un registro y credenciales que no existen, para resolver dependencias que nadie tiene |
| 9 | Quién desempata un cambio de contrato | Quien dirige | El primer desacuerdo | ✅ **Quien dirige**, que además es quien revisa los PR: partir las dos cosas dejaría a alguien decidiendo sobre lo que no lee |
| 10 | Supuestos [S1](docs/01-vision-y-alcance.md#s1) a [S5](docs/01-vision-y-alcance.md#s5) de [01 §6](docs/01-vision-y-alcance.md#6-supuestos) | Gerencia | [Sprint 1](docs/08-plan-de-desarrollo.md#sprint-1) | ⬜ Por confirmar; el mockup ya está confirmado |
| 11 | El dominio, del que dependen el correo sintético, la URL de la API y CORS | Gerencia | — | ✅ `prisma.com`: la API en `api.prisma.com` y `api-dev.prisma.com`, el correo sintético en `@usuarios.prisma.com`. Se cambió sin migrar nada porque todavía no existe ningún usuario real; desde el primero, «fijo de por vida» quiere decir exactamente eso ([ADR-009](docs/adr/ADR-009-login-por-usuario.md)) |
| 12 | Plazos de conservación y registro de bases de datos personales (Ley 1581) | Un abogado | Go-live | ⬜ |
| 13 | Qué objetivos nativos se publican | Gerencia | Nada hoy: no hay disparador | ⬜ |
| 14 | Una sola licencia para los cuatro repositorios | Quien dirige | Nada técnico | ✅ **AGPL-3.0 en los cuatro**: PRISMA se sirve por la red y no se distribuye, y la sección 13 es lo único que obliga a publicar lo que alguien modifique de un servicio |
| 15 | Encabezado de licencia en cada archivo fuente | Quien dirige | Nada técnico | ✅ **No lleva: la licencia se declara una vez por repositorio, no en cada archivo.** Los tres repositorios de código son privados, así que ningún archivo fuente sale solo de ellos. Las migraciones ya fusionadas de `prisma_db` no se editan, así que una regla de «cada archivo» nacería con excepciones. El aviso por archivo es un consejo del apéndice de la AGPL, no una condición de la licencia. Se revisa si un repositorio de código se hace público, y entonces basta una línea `SPDX-License-Identifier`. La versión que declara y el titular son la fila 17 |
| 16 | Dónde vive la orquestación de la pila local, y cómo encuentra cada receta | Quien dirige | Tarea [3.25](docs/08-plan-de-desarrollo.md#tarea-3-25) | ✅ **En `prisma_db`**, el repositorio más idóneo: ya levanta la base local y reparte sus puertos ([21 §6.4](docs/21-trabajo-en-paralelo.md#64-ambientes)). Cada receta de contenedor y cada puerto se apuntan desde el `.env` de la orquestación, no con rutas escritas. La especificación no va en un contenedor. El ADR lo escribe la propia tarea |
| 17 | Quién es el titular de PRISMA, y si la licencia es `AGPL-3.0-only` o `AGPL-3.0-or-later` | Quien dirige | Nada técnico | ✅ **Juan David Garzón Vallejo, con `AGPL-3.0-only`.** Lo declara la sección «Licencia» del README de cada repositorio, con su `SPDX-License-Identifier`. Solo la versión 3 porque, con un solo titular, `-or-later` no da nada que no se logre volviendo a licenciar, y deja en manos de la FSF una versión que todavía no existe. Las licencias que el titular otorgue a otros van por contrato aparte, fuera de los repositorios |

**Lo que el modelo de datos todavía no define** ([`04-modelo-de-datos.md`](docs/04-modelo-de-datos.md)):

- [ ] La variante del trigger de auditoría para `usuarios`, que detecta `desactivado_en` · [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2)
- [x] El `CREATE TABLE` de `adjuntos` · lo escribió la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) en el [04 §4.12](docs/04-modelo-de-datos.md#412-adjuntos--el-soporte-de-un-movimiento-o-de-un-pedido)
- [x] El `CREATE TABLE` de `cotizaciones` y `cotizacion_lineas` · lo escribió la [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12) en el [04 §4.5](docs/04-modelo-de-datos.md#45-productos-costeo-y-cotizaciones)

### 7.1 El expediente de uat y prod

> **Desde el [ADR-044](docs/adr/ADR-044-dos-ambientes-desplegados.md) solo se contrata prod.** uat es una etapa de la tubería y no se aloja.
> Con las mismas fuentes, la cifra baja a **≈ 45 USD al mes**: Supabase Pro con un solo proyecto son
> 25 + 10 − 10 = **25 USD**, y Railway sigue en sus **20** del plan Pro, porque prod con 1 GB ya no cabe
> en los 5 de Hobby. Lo de abajo se conserva como se escribió, con uat adentro.

Lo que le falta a la fila 3 para poder decidirse. **Ningún documento del proyecto traía una cifra**:
el [19 §8.1](docs/19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no) decía «es una factura, y es pequeña», y eso no es un número. Aquí están, **consultadas
el 2026-09-18**, con su fuente, porque un precio sin fecha envejece sin avisar.

**1 · Cuánto cuesta al mes**

| Proveedor | Qué hay que contratar | Al mes |
|---|---|---:|
| Supabase | Plan **Pro** en una organización nueva para uat y prod: 25 USD de plan + 10 por proyecto − 10 de crédito incluido | **35 USD** |
| Railway | Plan **Pro** por espacio de trabajo, 20 USD con 20 USD de crédito incluido | **20 USD** |
| | **Total** | **≈ 55 USD** |

- **El plan de Supabase es por organización, no por proyecto**, y la cuenta tiene **dos proyectos
  gratuitos en total** repartidos como quiera: dev y qa ya los gastaron. Así que uat y prod no caben
  en el plan gratuito ni aunque se aceptara que se pausen. Se pueden tener una organización gratuita
  y una de pago a la vez, y por eso lo barato es **dejar dev y qa donde están y abrir una
  organización nueva para los dos de pago**: meter los cuatro en una sola sube a 55 USD solo en
  Supabase, y lo único que se gana es que dev y qa dejen de pausarse.
- **El plan gratuito pausa el proyecto tras una semana de inactividad; el Pro dice «nunca».** Eso, y
  no otra cosa, es lo que compra el [RNF-20](docs/03-requisitos-y-bdd.md#rnf-20).
- **Railway cobra lo que se usa, no lo que se reserva**: 10 USD por GB al mes y 20 por vCPU al mes,
  facturado por segundo. uat con 768 MB y prod con 1 GB ([09 §3.2](docs/09-plan-de-implantacion.md#32-alojar-la-api-de-java-en-los-cuatro-ambientes)) son 1,75 GB, o sea **17,50 USD de
  memoria** si los dos estuvieran siempre en su piso, más la CPU que gasten. Cabe en el crédito de
  20 del plan Pro, pero **justo**: el de Hobby son 5 USD y no alcanza. Y dev ya está en Railway
  ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)), así que lo que gaste cuenta contra el mismo crédito.
- Fuentes: [supabase.com/pricing](https://supabase.com/pricing), [su guía de facturación](https://supabase.com/docs/guides/platform/billing-on-supabase),
  [railway.com/pricing](https://railway.com/pricing) y [su referencia de precios](https://docs.railway.com/reference/pricing).

**2 · Qué desbloquea**

Desde el [ADR-044](docs/adr/ADR-044-dos-ambientes-desplegados.md), **ninguna tarea del plan espera a la `9.12`**: las etapas qa y uat ([9.2](docs/08-plan-de-desarrollo.md#tarea-9-2)) corren
en la tubería, y la etapa prod ([9.3](docs/08-plan-de-desarrollo.md#tarea-9-3)) se deja lista y se salta con aviso mientras prod no exista. Lo
que desbloquea es el go-live: sin el proyecto prod contratado, el artefacto aprobado no tiene adónde
llegar.

**3 · Qué pasa si se aplaza**

Nada, hasta el [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9): antes no hay nada que promover ahí, y el [ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md) ya decidió no abrir
los cuatro ambientes ahora. Lo que no se puede aplazar es **decidirlo**: el [09 §3.1](docs/09-plan-de-implantacion.md#31-alistamiento-técnico-de-los-ambientes) dice que «dos de
los pasos cuestan plata y hay que decidirlos con tiempo», y una decisión de gasto descubierta la
semana de la firma se toma mal o se pospone. Posponerla mueve el go-live.

**Las cuatro condiciones del [ADR-026](docs/adr/ADR-026-railway-al-final.md), comprobadas contra Railway**

| # | Condición | Cómo responde Railway |
|---|---|---|
| 1 | Se promueve la imagen, no se recompila | Despliega imágenes de contenedor, que es lo que la API ya produce. **Falta el registro de imágenes**, que no existe todavía y sin el cual esta condición no se cumple entre ambientes |
| 2 | uat y prod no se duermen | **No descarta ningún plan**, que era el miedo: dormirse es un interruptor por servicio —«Serverless», en los ajustes de despliegue— que viene apagado. Se deja apagado en uat y prod y ya. Encendido, duerme el servicio a los 10 minutos sin actividad y **la primera petición puede contestar 502**, que es exactamente lo que invalidaría la revisión de Gerencia |
| 3 | Los secretos viven en el gestor del proveedor | Variables por ambiente, que es como ya corre dev |
| 4 | La `service_role` no entra en el servicio de la API | No depende del proveedor: es nuestra ([ADR-033](docs/adr/ADR-033-service-role-solo-en-auth.md)) |

El [ADR-026](docs/adr/ADR-026-railway-al-final.md) las numera como tres porque junta las dos últimas en una; se separan aquí porque se
comprueban por separado.

**Quién hace cada paso del [09 §3.1](docs/09-plan-de-implantacion.md#31-alistamiento-técnico-de-los-ambientes)**

De los nueve, **el paso 2 es el único de Gerencia** —contratar lo que hay que pagar, antes de
levantar uat— y los otros ocho son de apoyo técnico. Ninguno de esos ocho puede correr para uat y
prod hasta que el 2 esté hecho, porque los proyectos todavía no existen.

**Y lo que uat exige y no es dinero:** datos **realistas y anonimizados**, con su propia semilla
([9.2](docs/08-plan-de-desarrollo.md#tarea-9-2)). La de dev y qa no entra ahí nunca —lleva nombres reales del equipo—, y `sembrar.ps1` solo
admite `dev` y `qa` para que la regla no dependa de que alguien se acuerde. Es el riesgo [R-23](docs/11-riesgos-y-proteccion-de-datos.md) y es
la Ley 1581.

**Lo que este expediente deja fuera a propósito**, para que una decisión de gasto no se convierta en
una reunión de todo: las cuatro del [21 §8](docs/21-trabajo-en-paralelo.md#8-qué-hay-que-decidir-antes-de-trabajar-dos-tareas-a-la-vez) —quién trabaja cada repositorio, los permisos de escritura,
contrato por etiqueta o por paquete, y quién desempata un cambio de contrato—; el **plan pago de
dev**; el **registro de imágenes** de la condición 1; y **apagar la Data API** o revocarle el acceso
a `anon`.

**Dos de esa lista tienen fecha externa y no esperan a Gerencia:**

- **Las claves heredadas.** Supabase «deprecia las claves `anon` y `service_role` para finales de
  2026» y las reemplaza por `sb_publishable_…` y `sb_secret_…` ([su documentación](https://supabase.com/docs/guides/api/api-keys), consultada el
  2026-09-18). Crear uat y prod con claves que van a morir es hacer el trabajo dos veces, y las
  variables que hoy las nombran están en el [09 §3.2](docs/09-plan-de-implantacion.md#32-alojar-la-api-de-java-en-los-cuatro-ambientes).
- **Las contraseñas de la semilla en dev**, hoy alcanzables desde internet.

---

## <a id="titulo-8"></a>8. Documentación

- [x] Encabezado con versión, estado, fechas y etiquetas en todos los documentos de los cuatro
      repositorios ([ADR-027](docs/adr/ADR-027-documentacion-versionada.md)) — 84 hoy, y los cuenta `verificar`, no esta línea
- [x] Toda referencia enlazada a su sitio exacto, con anclas propias y «Referenciado desde»
- [x] Las reglas escritas en [`22-documentacion.md`](docs/22-documentacion.md), y la herramienta en `scripts/docs/`
- [x] El plan organizado por repositorios, con dependencias, oleadas, camino crítico y calendario calculado
- [x] La integración continua de este repositorio verifica la documentación en cada push y cada PR

---

## <a id="titulo-9"></a>9. A vigilar

- **Con el CLI de Supabase 2.117.0, el GoTrue local acepta la clave «x»**, y las dos pruebas de
  `GoTrueIntegracionTest` que esperan un `weak_password` salen rojas. Pasa también en `develop`, sin
  ningún cambio de por medio, aunque `config.toml` declara `minimum_password_length = 6` justo para
  que no dependa de la versión. Se vio al correr la suite de integración en la máquina propia
  para la [4.4](docs/08-plan-de-desarrollo.md#tarea-4-4). Queda por saber si la tubería, con su propio CLI, tiene el mismo comportamiento.
  **Ya se sabe que sí**: la tubería tenía las mismas dos rojas, y no las causa el `config.toml` sino
  la versión de GoTrue que trae el CLI. Está en «Del arreglo de GoTrue en la tubería»

- **La integración continua no corre [C-01](docs/12-pruebas-y-calidad.md#c-01), y por eso estuvo un día en rojo sin que nadie lo
  viera.** El trabajo de CI de `prisma_api` corre `./gradlew build`, que **excluye la etiqueta
  `integracion`** ([ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) [§4](docs/12-pruebas-y-calidad.md#4-juego-de-datos-de-prueba-oficial)), así que la prueba que cruza la tabla de traducción con `pg_constraint`
  solo falla en la máquina de quien la corra a mano contra una base con el esquema puesto. Se
  descubrió al hacer la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10): la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) había fusionado la tabla `adjuntos` sin sus nueve filas,
  y **su PR pudo fusionarse igual**. Ya está arreglado; lo que queda por
  decidir es si [C-01](docs/12-pruebas-y-calidad.md#c-01) debe correr en la CI, que pide levantarle una base con el esquema y la
  semilla. Mientras no corra, **toda promesa de las que solo miran las pruebas de integración
  —[C-01](docs/12-pruebas-y-calidad.md#c-01) entre ellas— depende de que alguien se acuerde de correrlas**

- **«La versión subió» avisa, pero todavía no bloquea el botón de fusionar.** Es un trabajo más de la
  integración continua de los tres repositorios de código, y GitHub deja fusionar un PR en rojo
  mientras la comprobación no esté marcada como obligatoria en la protección de `develop`. Lo que sí
  hace hoy en la API y el front, aunque se fusione en rojo, es parar el despliegue: el empuje a
  `develop` también la corre, y Railway no construye dev con la integración continua en rojo.
  `prisma_db` no se despliega, así que ahí la única cerradura es esa casilla. Hasta el 2026-10-14 esa
  casilla no existía: los tres repositorios de código son privados y el plan gratuito contestaba
  *«Upgrade to GitHub Pro or make this repository public»* tanto a la protección de rama como a los
  rulesets (comprobado el 2026-09-19 contra su API). Las dos salidas costaban algo —pagar el plan, o
  hacer públicos unos repositorios de los que `prisma_db` lleva la semilla con nombres reales del
  equipo ([R-23](docs/11-riesgos-y-proteccion-de-datos.md))—, así que se decidió dejarlo y escribirlo aquí. **Ya no es así: la cuenta
  pasó a GitHub Pro el 2026-10-14**, la casilla se puede marcar, y publicar quedó prohibido aparte
  ([ADR-051](docs/adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)). **Y ya se hizo:** la casilla está marcada, como cuenta la viñeta siguiente.

- **Las protecciones de rama están puestas en los cinco repositorios, y la costumbre dejó de ser la
  cerradura.** `node scripts/github/politicas-de-ramas.mjs verificar` dice `las politicas de rama
  estan puestas`: trece cosas, dos en la especificación, tres en cada uno de los tres repositorios
  de código y dos en el monorepo de producto. Que las ramas principales no se borren, y que a
  `develop` y a las demás no se entre sin PR con su puerta de tubería. Quien dirige lo aplicó el
  2026-10-14 con `politicas-de-ramas.mjs aplicar`, después de que la cuenta pasara a GitHub Pro.
  **Lo que podía dejar PR colgados se comprobó antes**, y no pasa: una puerta que exige un check
  cuyo nombre no produce ningún flujo bloquea el PR para siempre, así que se miró repositorio por
  repositorio. En los tres de código los dos trabajos existen con `if: always()`, y su `ci.yml`
  dispara en `pull_request` a `develop`, `qa`, `uat` y `main`; en el monorepo, «Tubería en verde»
  vive en `sincronia.yml` y dispara en `pull_request` a `main`; en la especificación las dos
  corrieron en verde en el PR 217 ([ADR-048](docs/adr/ADR-048-las-ramas-principales-las-protege-github.md), `scripts/github/README.md`). **Lo que queda es
  vigilar que sigan puestas:** `verificar` las compara con la definición y es lo que avisa si alguien
  las cambia desde el panel.
- **La base de uat existe, pero está en el plan gratuito, así que el [RNF-20](docs/03-requisitos-y-bdd.md#rnf-20) todavía no se cumple
  ahí.** Comprobado el 2026-10-14 contra la API de Supabase: la organización tiene **dos proyectos**,
  el de dev y el que se creó para pre-prod, y **no hay un tercero**. Quien dirige confirmó que ese
  segundo es la base de uat: es el que la [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4) creó como qa, pasó a pre-prod con el [ADR-045](docs/adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md) y quedó
  como uat al quitarse pre-prod ([ADR-053](docs/adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)). De ahí que su nombre siga diciendo pre-prod; renombrarlo
  es del panel, porque ni el CLI ni la herramienta de la sesión lo hacen. **Lo que hay que vigilar
  son dos cosas.** La primera: **la organización está en el gratuito**, y ese plan pausa el proyecto
  tras una semana sin uso, que es justo lo que el [RNF-20](docs/03-requisitos-y-bdd.md#rnf-20) no admite en un ambiente desplegado
  ([§7.1](#71-el-expediente-de-uat-y-prod)) —que exista la base no es que el ambiente esté listo, y por eso la [9.12](docs/08-plan-de-desarrollo.md#tarea-9-12) sigue sin
  marcar—. La segunda: **a ese proyecto le faltan ocho migraciones**, desde la `0.24.0` hasta la
  `0.26.1`; está en la `0.23.0`, de 2026-10-03. Promoverlas es `promover.ps1 -Ambiente uat`, que
  pide el ambiente y la referencia del proyecto escrita entera, y conviene `-EnSeco` antes: una
  migración aplicada no se edita jamás ([ADR-004](docs/adr/ADR-004-base-solo-escritura.md), [19 §2.2](docs/19-ambientes-y-entrega.md#22-una-migración-aplicada-no-se-edita-nunca))

- **`cuentas` y `categorias` ya llevan RLS, y la decidió la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10).** El [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) las dejaba a
  propósito sin política, y entonces el «solo Gerencia» del contrato de la [1.17](docs/08-plan-de-desarrollo.md#tarea-1-17) no lo imponía
  nadie: **Operación podía crear las dos**. Se tomó la primera de las dos salidas —política, no
  `if`— con el molde que el esquema inicial ya usaba para `cargos`: lectura `USING (TRUE)`, que es
  lo que el [§7](#7-decisiones-pendientes) quería conservar, y escritura `FOR ALL` con `fn_es_gerencia()`. `FOR ALL` y no
  `FOR INSERT` para que la anulación, que es un `UPDATE`, no quede abierta el día que exista ese
  endpoint. Lo que queda por revisar es si alguna de las otras siete tablas sin RLS está en el
  mismo caso. **La [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12) lo contestó para cuatro de ellas**: las dos del cotizador lo estaban, y
  ya llevan RLS; y `pedidos` y `productos` también lo estaban. **`productos` ya la lleva**, con este
  mismo molde, desde la [5.11](docs/08-plan-de-desarrollo.md#tarea-5-11); a `pedidos` le falta, y la necesitará la [4.9](docs/08-plan-de-desarrollo.md#tarea-4-9) ([§10](#10-decisiones-de-construcción-que-conviene-revisar)).
- **`fn_auditar` leía `OLD.anulado_en` en cinco tablas que no tienen esa columna, y ya no.** Lo
  arregló la [3.18](docs/08-plan-de-desarrollo.md#tarea-3-18), en el esquema `0.12.0`, después de comprobarlo contra una base: un `UPDATE` sobre
  `costos_producto`, `prolabore_config`, `nomina_detalle`, `sobres_config` o `cierres_mensuales` se
  caía con `42703` dentro del trigger. Ahora la verificación edita una fila de cada tabla auditada, y
  la lista la compara con los triggers que llaman a `fn_auditar`. **Lo que queda por vigilar**: la
  [5.5](docs/08-plan-de-desarrollo.md#tarea-5-5), la [6.8](docs/08-plan-de-desarrollo.md#tarea-6-8), la [8.2](docs/08-plan-de-desarrollo.md#tarea-8-2) y las 7.x ya no tropiezan con esto, pero `nomina_detalle` **no tiene política de
  `UPDATE`** ([04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls)): si alguna de ellas necesita editarla con la sesión y no desde una función
  `SECURITY DEFINER`, la base le va a responder cero filas y no un error

- **Quedan diferencias entre lo que sirve la API y lo acordado, y son del contrato.** El arreglo
  de la copia fijada cerró 31 de 61 —las cabeceras de firma, que faltaban en **todas** las
  operaciones con sesión; dos `operationId`; ocho descripciones; el `201` de crear usuario; las dos
  etiquetas; el `cuando` del `40101`— y dejó medidas las que no son del código: los `minLength` y
  `maxLength` que la API emite de sus `@Size` y el acordado no declara; cinco descripciones de
  esquema que el acordado no tiene; el `style: simple` que springdoc le pone a `Set-Cookie`; la
  etiqueta de `cargos-asignables`, donde **el acordado es el que está mal** porque `cargos` la lee
  todo el mundo ([P-14](docs/12-pruebas-y-calidad.md#p-14)); y el `requestBody` de la navegación, que el acordado declara obligatorio y
  el código acepta ausente —cambiarlo es una decisión, porque el front vuelve a su vista pidiéndola
  sin cuerpo—. **Las del `DescriptorDeCampo` ya se cerraron**: `casilla` llegó con la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10) y
  `numero` con la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2), y el esquema es el acordado letra por letra. La 5.2 sumó una del contrato:
  a la cabecera `Idempotency-Key` de `/consultas/productos` y `/consultas/costeo` el acordado le dejó
  el texto de una escritura, como a la de `/consultas/movimientos`. **Mientras queden, la copia fijada
  no es el acordado byte a byte**, que es lo que haría exigible la promesa del [21 §3.1](docs/21-trabajo-en-paralelo.md#31-el-punto-débil-de-tener-repositorios-separados-y-cómo-se-tapa).
- **Las reglas del dominio todavía no tienen código del catálogo.** `Movimiento`, `Pedido` y
  `Costeo` rechazan lo que no se puede registrar con excepciones de Java, y hoy eso saldría como
  `50000`, «algo salió mal». Las de `Movimiento` y `Pedido` **ya tienen nombre y mensaje acordados**
  ([3.13](docs/08-plan-de-desarrollo.md#tarea-3-13), [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10) y [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10)). **Las de `Movimiento` ya se emiten** desde la [3.4](docs/08-plan-de-desarrollo.md#tarea-3-4): la fecha futura y
  las tres situaciones de la cuenta de destino tienen excepción de dominio y código propio. **Las de
  `Costeo` se emiten desde la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2)**: los minutos con más de dos decimales son el `42240`, la falta
  de pro-labore el `40940`, y los negativos los ataja el formulario. Las de `Pedido` esperan a la
  [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3), y hasta entonces ninguno de esos mensajes es el que verá el taller.
- **Las dos imágenes de la pila local no se han construido nunca.** La orquestación de la [3.25](docs/08-plan-de-desarrollo.md#tarea-3-25)
  resuelve cada ruta, cada puerto y cada variable, y apuntar una receta que no existe falla
  diciendo cuál; pero **construir la imagen de la API y la del front quedó sin ejercitar**, porque
  Docker Hub responde `429` a la máquina donde se escribió. Es lo primero que hay que correr en una
  máquina con cuota: `./scripts/db/pila-local.ps1`, y ver las tres piezas arriba
- **A `prisma_db` le faltan ocho etiquetas `esquema-vX.Y.Z`, y por eso la CI de `develop` de la API
  está en rojo.** El [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) dice que la API descarga la base en la etiqueta de su `prisma.esquema`.
  Están la `esquema-v0.1.0` y de la `0.3.0` a la `0.10.0`; **faltan la `0.2.0` y de la `0.11.0` a
  la `0.17.0`**, aunque sus migraciones estén fusionadas en `develop`. La [3.21](docs/08-plan-de-desarrollo.md#tarea-3-21) subió
  `prisma.esquema` a `0.14.0` antes de que su etiqueta existiera, y desde entonces el trabajo «Probar
  contra la base» falla al traer `prisma_db`: ya estaba en rojo en el PR que la llevó a `develop`, y
  se fusionó igual, porque ese trabajo avisa pero no frena. **Las pone el flujo
  `etiquetas-del-esquema.yml` de `prisma_db`**, que en su primera corrida pone las ocho, cada una
  sobre el commit con que se fusionó su PR —`0.2.0` en `15dce67`, `0.11.0` en `89982e6`, `0.12.0` en
  `2dd0e11`, `0.13.0` en `f24cf39`, `0.14.0` en `1c337b2`, `0.15.0` en `ca14398`, `0.16.0` en
  `e916e85` y `0.17.0` en `6d5d5af`—, y desde ahí una por fusión. **Hasta que ese PR se fusione, la
  API no puede subir su `prisma.esquema`**, y con él esperan las doce filas de traducción que le dejó
  la [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12), las dos de la [5.11](docs/08-plan-de-desarrollo.md#tarea-5-11) y la política del contra-asiento de la [3.10](docs/08-plan-de-desarrollo.md#tarea-3-10), cuya prueba
  de permiso se salta mientras tanto en vez de pasar en verde sin mirar
- **Una comprobación de la [2.5](docs/08-plan-de-desarrollo.md#tarea-2-5) se pone en rojo con dos personas de Gerencia activas.** El
  informe espera que, con el guardián de fila apagado, la desactivación masiva la atrape el de
  sentencia; lo que responde es el trigger de permisos —«Solo Gerencia cambia el tipo, el cargo…»—,
  porque la sesión desactiva su **propia** fila antes de llegar a la otra y deja de ser Gerencia a
  mitad del `UPDATE`. Es de la comprobación, no de la regla: los dos guardianes siguen puestos. Se
  vio contra la base local con la semilla, y no lo causa ninguna tarea de este sprint
- **El contra-asiento ya tiene ruta, y la corrección no tiene pantalla.** La [3.10](docs/08-plan-de-desarrollo.md#tarea-3-10) le acordó el
  contrato que le faltaba: `PUT /api/v0/movimientos/{id}/correccion/{correccionId}`, con el
  formulario «movimiento» de siempre y los dos ids en la ruta, que es lo que deja `corrigeAId`
  fuera del descriptor sin inventarle un campo que nadie pinta. **Lo que sigue sin existir es la
  pantalla**: el mockup dibuja el botón de anular y no el de corregir, así que la API sirve una
  corrección que hoy nadie puede pedir desde el front. Cuando se dibuje, entra como tarea del [08](docs/08-plan-de-desarrollo.md)
  con su mitad del front.
- **Nadie comprueba que la categoría sea de la naturaleza del movimiento.** Un gasto con una
  categoría de ingreso entra: la base no lo impide —`categorias.naturaleza` no se cruza con
  `movimientos.tipo`—, el dominio no lo mira y el contrato de la [3.13](docs/08-plan-de-desarrollo.md#tarea-3-13) no le dio código, porque
  ningún documento escribe esa regla. O se escribe en el [05](docs/05-reglas-financieras.md) y entonces tiene código y
  restricción, o se dice por qué da igual.
- **El mockup le muestra el tiempo a Operación y la base no se lo deja ver.** En la tabla de
  productos, las columnas de costo y margen llevan la marca de Gerencia y la de «Tiempo» no; pero
  `minutos_trabajo` vive en `costos_producto`, que lleva la política `costos_solo_gerencia`, así que
  **PostgreSQL no le devuelve ni una fila a una sesión de Operación** ([04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls)). El contrato de la
  [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10) siguió a la base, que es lo que [ADR-006](docs/adr/ADR-006-rls-por-rol.md) manda, y le declara a Operación el nombre, el tipo,
  la unidad y el precio. O se ajusta el mockup, o los minutos salen de la tabla de costos: mientras
  tanto, esa columna no se puede pintar para Operación.
- **`productos` dejaba apagarse sin motivo, y lo cerró la [5.11](docs/08-plan-de-desarrollo.md#tarea-5-11).** Las dos tablas dicen «inactivo»
  con `activo` y guardan el porqué en `anulado_*`, y solo `cargos` tenía el par de `CHECK` que amarra
  las dos cosas ([04 §4.2](docs/04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas)). El contrato promete que ningún producto sale del catálogo sin motivo
  escrito, y esa promesa la sostenía solo la API, que es la capa que [ADR-015](docs/adr/ADR-015-validacion-tres-capas.md) dice que sí se puede
  saltar. Entraron primero al [04](docs/04-modelo-de-datos.md) y después a la migración, con los mismos dos nombres de `cargos`:
  `desactivacion_con_motivo` y `anulacion_con_motivo`. **`pedidos` no las necesita**, porque cancelar
  no es apagar y sus cuatro columnas las escribió la [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11).
- **La semilla y los documentos no dicen la misma tarifa por hora.** `prolabore_config` siembra
  $1.500.000 sobre 160 horas, que dan **$9.375**; el [05 §7](docs/05-reglas-financieras.md#7-costeo-por-producto-y-margen) y el [06 §4.1](docs/06-nomina-y-capacidad-de-pago.md#41-el-margen-de-contribución-correcto) trabajan con **$9.400**, que
  es lo que la semilla escribe a mano en `costos_producto.tarifa_hora`. Mientras la tarifa fuera un
  número de ejemplo daba igual; desde el contrato de la [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10) la calcula la API con esa división,
  y **desde la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2) ya sale así**: un costeo nuevo congela $9.375, 25 pesos por hora por debajo del
  documento, y los cinco de la semilla conservan sus $9.400. El cuadro de [05 §7.2](docs/05-reglas-financieras.md#72-los-dos-márgenes) da igual por eso.
- **Anular desde el libro un movimiento que pertenece a otro registro lo deja cojo.** La anulación
  del contrato de la [3.13](docs/08-plan-de-desarrollo.md#tarea-3-13) sirve para cualquier movimiento, y varios no están solos: el de un
  anticipo tiene su fila en `anticipos`, el de una inversión en `activos`, el de un aporte o un retiro
  en `aportes_retiros` y el de un adelanto en `adelantos`. Anular el movimiento deja esa fila en pie,
  apuntando a una plata que ya no suma: un activo comprado con plata que no salió, un anticipo que el
  pedido sigue contando. La [3.9](docs/08-plan-de-desarrollo.md#tarea-3-9) tiene que decidir si rechaza anular desde el libro lo que
  pertenece a otro registro, para que se anule desde su pantalla, o si arrastra ese registro en la
  misma transacción. Cualquiera de las dos cambia una operación del `0.11.0`, así que pasa primero
  por el contrato. **Lo decidió quien dirige el 2026-09-22: se anula desde el libro y arrastra su
  registro** en la misma transacción. Ya está dibujado en el mockup, y lo que pide al contrato y a
  la base está en el [§10](#10-decisiones-de-construcción-que-conviene-revisar).
- **El patrimonio empezaría en cero el día del corte.** El [09 §4.1](docs/09-plan-de-implantacion.md#41-qué-se-migra-y-qué-no) pide migrar los aportes de
  capital históricos «como base del patrimonio», y no tienen por dónde entrar:
  `aportes_retiros.movimiento_id` no admite nulo, así que todo aporte es un movimiento, y uno de antes
  del corte le subiría a la caja una plata que ya está en los saldos iniciales. Tampoco están en el
  libro las utilidades de antes del corte. Los activos sí pueden entrar sin movimiento, y el contrato
  de la [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) lo usa. Falta un patrimonio inicial —o aportes históricos sin movimiento— y se
  decide en el [04](docs/04-modelo-de-datos.md). **La [7.5](docs/08-plan-de-desarrollo.md#tarea-7-5) se hizo sin eso**: calcula con lo que hay en el libro, así
  que el día del corte el patrimonio arranca en lo que digan los aportes y las utilidades
  registradas, y no en lo que el taller ya valía. Lo que se decida entra como una fuente más de sus
  dos primeros términos, sin cambiar la fórmula.
- **Diez lecturas del contrato llevan la clave de idempotencia de una escritura**, y cada tarea que
  implementa una suma otra. `consultas/adelantos`, `/anticipo-minimo`, `/clientes`, `/costeo`,
  `/desprendible`, `/empleados`, `/importacion`, `/movimientos`, `/productos` y
  `/simulacion-de-contratacion` copiaron la cabecera `Idempotency-Key` de una operación que escribe,
  y dicen que la clave «se reutiliza en cada reintento». La API genera otro texto para todo lo que
  cuelga de `/consultas/`, «UUID v4 nuevo en cada consulta» (`ConfiguracionDelContrato`), así que la
  copia fijada se aparta del acordado en esas diez y la [C-04](docs/12-pruebas-y-calidad.md#c-04) pasa igual, porque compara contra la
  copia. Las lecturas del `0.13.0` ya llevan el de lectura. Es un arreglo del contrato, y va con las
  correcciones del trabajo del contrato.
- **Dinero con decimales en la frontera, y la comprobación está atrasada.** La [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10) era el
  primer endpoint que recibe plata y ya está hecha, con veinte más detrás; **ninguna prueba manda
  `1500.5` en un campo de dinero** para ver que se rechaza en vez de truncarse a `1500` en silencio.
  Hay pruebas de decimales en minutos y en horas, que no son plata. [ADR-003](docs/adr/ADR-003-dinero-entero.md) exige rechazarlo, y
  la conversión de Jackson hay que verla, no suponerla.
- **La base de desarrollo es compartida.** Mientras dev sea el proyecto de Supabase en la nube, todos
  las dos tareas desarrollan contra la misma base, que es lo que [21 §6.4](docs/21-trabajo-en-paralelo.md#64-ambientes) pide evitar. Con una sola tarea a la vez no
  estorba; con varios, cada uno necesita su PostgreSQL local.
- **Sin qa hasta el [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9)** ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)): mientras tanto, «terminado» es fusionado a `develop` con la
  integración continua en verde. Que dev ya esté en línea no crea la puerta de qa.
- **Los íconos de la PWA siguen siendo los de la plantilla de Flutter.** El logo del taller es
  apaisado —760×253— y volverlo un ícono cuadrado de 192 y 512 píxeles es una decisión de diseño,
  no un recorte: hay que decidir si va la marca sola o el nombre sobre el color de la insignia.
- **Falta ver que la PWA ofrece instalarse.** Que el service worker se registra y que la
  aplicación abre sin red ya lo comprueba la CI en cada empuje, en Chromium ([9.7](docs/08-plan-de-desarrollo.md#tarea-9-7)). Ofrecer la
  instalación depende del navegador y de los íconos, y se ve a mano en un celular.
- **La pantalla «Datos sin conexión» de [17 §7](docs/17-resiliencia-offline-y-cache.md#7-purga-de-la-caché-por-el-usuario) sigue sin existir**, y ya no espera a nadie: el
  aviso de «pendiente de sincronizar» que la [9.1](docs/08-plan-de-desarrollo.md#tarea-9-1) dejó listo para pintar tenía que llegar con el
  registro rápido ([3.5](docs/08-plan-de-desarrollo.md#tarea-3-5)), que está hecho. La cola cuenta cuántas esperan y nadie lo muestra;
  **ninguna tarea del [08](docs/08-plan-de-desarrollo.md) la pide**, así que entra como tarea nueva del trabajo del front o se dice por
  qué no hace falta.
- **El servicio de Railway conectado a `prisma_front`** intentaba construir en cada push y fallaba,
  porque no había receta de construcción para Flutter. Ya la hay ([0.9](docs/08-plan-de-desarrollo.md#tarea-0-9)): falta revisar en la consola
  si ese servicio se reconfigura o se borra, para no terminar con dos y sin saber cuál es el bueno.

- **El `.gitignore` de `prisma_front` no tiene el glob `.env.*` que sí tienen los otros dos.** Ignora
  `.env` y nada más, así que un `.env.local` o un `.env.produccion` entrarían al repositorio sin que
  nadie se diera cuenta. Se vio haciendo la [9.8](docs/08-plan-de-desarrollo.md#tarea-9-8), que es del trabajo de la API y no toca el front: **es
  un arreglo suelto de una línea en `prisma_front`**, y hoy no hay ningún archivo así en disco.

- **La prueba de compatibilidad contra una API real está escrita y nunca ha corrido** (✏️). Vive en
  `test/integracion/compatibilidad_contra_api_real_test.dart`, en `prisma_front`, y se salta sola
  mientras no se le dé `PRISMA_API_URL_REAL`. Se escribió con la [9.9](docs/08-plan-de-desarrollo.md#tarea-9-9) porque es lo único que
  comprueba que la ruta, el verbo y el nombre del campo son los que la API **de verdad** contesta: una
  API simulada dice lo que uno escribió que dijera. **Hay que correrla en cuanto exista qa**, que es
  la [9.13](docs/08-plan-de-desarrollo.md#tarea-9-13), y hasta entonces la 9.9 está terminada solo en la mitad que se puede verificar.

- **`service_role` aparece en `prisma_db` fuera de las migraciones**, que es lo que la [9.8](docs/08-plan-de-desarrollo.md#tarea-9-8) promete
  que no pasa: en `scripts/db/verificar-base.sql`, que comprueba que ese rol tampoco borre, y en los
  tres archivos de la pila local, que pasan de largo lo que imprime `supabase status`. Los cuatro
  tienen su justificación escrita y ninguno lleva un valor, así que **la promesa se cumple en lo que
  importa y la frase de la tarea es la que está corta**. Queda por decidir si el escaneo de secretos
  se replica en los otros dos repositorios o si basta con el de la API.

---

## <a id="titulo-10"></a>10. Decisiones de construcción que conviene revisar

Las tomó quien construyó, no quien dirige el proyecto. Ninguna contradice a los documentos: son
huecos que los documentos no cubrían y que el código tuvo que llenar para poder existir.

**De la 11.4, el privilegio del tamaño del uso:**

- [ ] **La política de `UPDATE` de `cuentas` quedó sin quien la use.** Al medir qué escribe cada
      adaptador para armar la lista de concesiones, `cuentas` resultó una tabla que la API solo
      lee: ninguna ruta del contrato edita una cuenta. La política sigue ahí, intacta, y la
      concesión de `UPDATE` no se dio. **O falta esa operación** —editar el nombre o el tipo de una
      cuenta, que nadie pidió— **o la política es código muerto** y lo que corresponde es decirlo

**De la 8.2, la liquidación de nómina en la base:**

- [ ] **El movimiento del pago vale el neto, y con eso el gasto de personal del mes hay que leerlo de
      `nomina_detalle` y no del apunte.** El [06 §6.3](docs/06-nomina-y-capacidad-de-pago.md#63-el-efecto-correcto-sobre-utilidad-y-caja) le pide a la liquidación dos cifras distintas
      —gasto 1.350.784 y salida de caja 1.050.784— y un `gasto` le hace lo mismo a la utilidad que a
      la caja. Se resolvió como la [4.5](docs/08-plan-de-desarrollo.md#tarea-4-5) con el ingreso de la entrega: el apunte vale la plata
      que de verdad salió, porque el adelanto ya había salido y lo contrario diría que se pagó
      1.650.784. **Queda pendiente del lado de la API**: quien sume los gastos operativos tiene que
      tomar la nómina de `nomina_detalle`, igual que ya toma los ingresos causados de los pedidos
      entregados, o el mes contará de menos lo adelantado
- [ ] **Si los adelantos pendientes suman más que el devengado, la liquidación se cae entera.** El
      [06 §6.1](docs/06-nomina-y-capacidad-de-pago.md#61-fórmulas) dice que los descuentos son los adelantos pendientes, y nada dice qué pasa cuando no
      caben: el neto daría negativo y lo rechaza `dinero_no_negativo`, sin escribir nada.
      **Partirlo entre dos meses sería inventar una regla de negocio**, así que no se hizo. Lo que
      hay que decidir es si un adelanto se descuenta hasta donde alcance y el resto sigue vivo
- [ ] **Nada prohíbe una ficha de empleada con cero horas pactadas.** El dominio `horas` admite el
      cero y la API también, así que la función tuvo que decidir qué vale la hora ordinaria en ese
      caso: **cero**, porque una división por cero la tiraría con un `22012` por una ficha que el
      sistema deja guardar. Con eso la hora extra tampoco vale nada. Si las horas pactadas no pueden
      ser cero, le falta su `CHECK` con nombre a `empleados`, y entonces también su fila en la tabla
      de traducción de la API
- [ ] **`nomina_detalle` no tiene dónde guardar el recargo de la hora extra ni la fecha de pago**, y
      el contrato las devuelve las dos. El recargo viaja en el formulario porque `empleados` no tiene
      columna —lo dice el contrato de la [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11)— y la fecha de pago vive solo en el movimiento,
      así que una liquidación de neto cero no la guarda en ninguna parte. Al leer una liquidación
      vieja, la API no puede decir con qué recargo se pagó
- [ ] **`nomina_detalle_empleado_id_fkey` todavía no da el `42251`.** El contrato dice que ese código
      sale de «la llave foránea `empleado_id` de `adelantos` o de `nomina_detalle`», y en la API solo
      la de `adelantos` está en las traducciones propias; la otra sigue con el transversal. Es una
      fila, y va en el PR de la API que implemente la liquidación
- [x] **Tres filas del informe de la base quedaron en rojo desde la [7.10](docs/08-plan-de-desarrollo.md#tarea-7-10)**, y la 8.2 las dejó como
      estaban porque no son suyas: el conteo de columnas con dominio espera 68 y hay 69, la lista de
      tablas que audita `fn_auditar` no nombra a `horas_limite_config`, y
      `horas_limite_config_horas_semanales_check` termina en `_check`, que es lo que la fila de la
      [1.1](docs/08-plan-de-desarrollo.md#tarea-1-1) prohíbe. Las dos primeras son una línea cada una; la tercera es una migración de
      renombre **y** su fila en `prisma_api`, por [C-01](docs/12-pruebas-y-calidad.md#c-01). **Las arregló la [9.2](docs/08-plan-de-desarrollo.md#tarea-9-2)**, porque la etapa qa no podía nacer roja

**De la 8.4, el desprendible de pago:**

- [ ] **El desprendible de un mes ya cerrado sí se imprime.** El contrato enumera los códigos que la
      ruta devuelve y no hay ninguno para el período cerrado, así que no se inventó: cerrar el mes
      congela las cifras, y el papel de un mes congelado es justo el que alguien va a querer de
      vuelta. Negarlo dejaría a la persona sin el desprendible del mes que ya le pagaron. Lo que hay
      que decidir es si el papel de un mes cerrado lleva alguna marca que lo diga
- [ ] **La fecha de pago de una liquidación sin movimiento sale del período, no de la base.** Es el
      hueco que ya anotó la 8.2: la fecha vive solo en el movimiento, y sin neto no hay movimiento.
      El papel lleva entonces el último día del mes liquidado, porque es la única fecha que la base
      sabe y dejarla en blanco obligaría a quien dibuja a inventarse una. **El pie también va sin
      cuenta de origen**, que es correcto: no hubo pago del cual sacarla
- [ ] **El adelanto que se anuló después de descontarse va en un renglón sin fecha.**
      `adelantos_desc` ya lo contó y la consulta ya no lo trae, así que sin ese renglón la resta no
      daría el neto y **no se imprimiría ningún desprendible**. Se imprime como «Otros adelantos
      descontados», con la diferencia. Lo que hay que decidir es si anular un adelanto ya descontado
      debería estar prohibido, que es lo que haría innecesario este renglón
- [ ] **El membrete del desprendible es el mismo de los papeles del cliente**, el de la
      configuración de la [8.8](docs/08-plan-de-desarrollo.md#tarea-8-8). No hay tabla que lo guarde, y el [06 §8](docs/06-nomina-y-capacidad-de-pago.md#8-desprendible-de-pago) solo pide «el logo y el
      nombre del negocio». Si el desprendible necesita un membrete propio —un NIT, una dirección—,
      eso es una tabla y es de la base

**De la 8.6, la traducción a unidades por vender:**

- [ ] **La meta va en unidades y no trae el plazo estimado que pide el [06 §5](docs/06-nomina-y-capacidad-de-pago.md#5-alternativas-cuando-no-es-viable).** «Aumentar ventas
      primero» promete «meta mensual en unidades y plazo estimado», y el plazo necesita una tasa de
      demanda —cuántas unidades al mes se venden hoy de ese producto— que ningún documento define y
      que los pedidos entregados solo insinúan. Se entregó la meta sin el plazo antes que un plazo
      inventado
- [ ] **La lista se ordena por trabajo, y el contrato solo dice «el camino más barato».** Lo barato
      se midió en horas de persona, que es lo escaso cuando se está evaluando contratar; medido en
      unidades el primer renglón sería otro, el de margen más alto. Si la pantalla quiere el cuadro
      en otro orden, es una decisión de [10 §4](docs/10-ux-y-mockups.md#4-las-12-pantallas) y no de la API
- [ ] **Las otras dos alternativas del [06 §5](docs/06-nomina-y-capacidad-de-pago.md#5-alternativas-cuando-no-es-viable) siguen sin salir.** «Subir precios» necesita el cuadro
      de márgenes por hora puesto al lado del faltante y «reducir tiempo ocioso» necesita las horas
      facturadas, que son la [8.7](docs/08-plan-de-desarrollo.md#tarea-8-7). Proponerlas sin sus números sería el consejo genérico que el
      documento quiere evitar

**De la 8.7, las horas pagadas contra las facturadas:**

- [ ] **Las horas de nómina son las pactadas, enteras.** El contrato dice «las horas pactadas de
      quienes se liquidaron en el mes», y eso se sumó tal cual: `horas_mensuales` de cada ficha con
      fila en `nomina_detalle`. No se prorratea por `dias_trabajados` ni se suman las horas extra,
      porque ningún documento lo pide. Quien entró el 20 cuenta el mes entero de horas pagadas
- [ ] **El pro-labore es el que regía el último día del mes**, o el de hoy si el mes no ha
      terminado. El contrato dice «el vigente», sin decir a qué fecha. Con el de hoy, el ocio de
      marzo se cobraría con la tarifa de octubre. Un mes anterior al primer pro-labore responde el
      `40950`, porque ese mes no tenía con qué medirse
- [ ] **El tramo se juzga sobre el porcentaje redondeado a un decimal**, que es el que se pinta. Los
      bordes van así: menos de 15 es `informativa`, de 15 a 35 inclusive `alta` y más de 35
      `critica`. El [06 §9](docs/06-nomina-y-capacidad-de-pago.md#9-horas-pagadas-vs-horas-facturadas) escribe «15% – 35%» sin decir de qué lado cae cada borde
- [ ] **Un mes fuera de rango responde `42260`, como el tablero, y el contrato no lo enumera** entre
      los códigos de esta ruta. Es la misma validación del período que ya usan el tablero y el
      reporte; lo que falta es agregar el código a la descripción de la ruta en el contrato
- [ ] **La copia fijada no es la ruta del contrato byte a byte.** Lleva la descripción de
      `Idempotency-Key` que la API usa para todas las consultas desde el [ADR-030](docs/adr/ADR-030-contrato-sin-get.md), y no
      la de las escrituras que tiene el contrato acordado. Le pasa igual a las demás consultas
      fijadas, como la del simulador: es deuda del contrato, no de esta tarea

**De la 8.10, el importador en pantalla:**

- [ ] **El panel se pinta con `puedeGestionarCuentas`**, el mismo permiso de «Cuentas de dinero».
      La navegación no trae uno para importar, y agregarlo era un PR de contrato y otro de API por
      un booleano que hoy vale lo mismo. Si un día importar y crear cuentas se separan, es un
      `puedeImportar` en `Navegacion`
- [ ] **La confirmación no pasa por la cola de pendientes.** Es una conversación: lo que se pinta
      después es el informe que devuelve, y un CSV de 5 MB guardado para cuando vuelva la señal no
      tendría a quién mostrárselo. El reintento sí vuelve al mismo id con la misma clave
- [ ] **El botón dice cuántas se van a cargar sumando dos cifras de la API**: las válidas, y las
      duplicadas si el interruptor está puesto. Es la única cuenta del panel. Si se quiere que ni
      eso lo haga el front, el informe tendría que traer cuántas entrarían con y sin duplicadas

**Del [ADR-044](docs/adr/ADR-044-dos-ambientes-desplegados.md), dos ambientes desplegados:**

- [ ] **El ensayo de la migración del histórico va a la pila local**, con los datos reales del
      negocio en la máquina de quien la hace. El [09 §3](docs/09-plan-de-implantacion.md#3-los-cuatro-ambientes-en-la-puesta-en-marcha) lo ponía en qa, que ya no se aloja; en dev
      quedarían datos personales en un ambiente compartido, contra la regla 5 del [19 §1.1](docs/19-ambientes-y-entrega.md#11-las-seis-reglas). Si
      quien dirige no quiere esos datos fuera de prod, el ensayo se hace con el Excel anonimizado
- [ ] **Gerencia firma en dev, y dev hay que sembrarlo con la semilla de uat antes.** Hoy
      `sembrar.ps1` solo conoce la semilla ficticia. La [9.2](docs/08-plan-de-desarrollo.md#tarea-9-2) escribe la de uat, y llevarla a dev
      el día de la firma es un paso del [09 §6.1](docs/09-plan-de-implantacion.md#61-la-promoción-hasta-prod) que todavía no tiene guion

**De la 9.3, el artefacto que se promueve:**

- [ ] **El registro es GHCR**, porque es gratis y entra con el mismo token del flujo, sin otra
      cuenta. Si prod se aloja en Railway, para traer una imagen privada de GHCR necesita una
      credencial de lectura: es un paso de la [9.12](docs/08-plan-de-desarrollo.md#tarea-9-12) que hoy nadie ha escrito
- [ ] ⚡ **El front de prod necesita dos variables de repositorio: `PROD_API_URL` y
      `PROD_API_MAJOR`.** Sin ellas el trabajo se salta con aviso, y por eso hoy ninguna etapa
      publica el front de prod. Se cargan cuando prod tenga dominio
- [ ] **Un arreglo empujado directo a `uat` o a `main` deja la etapa en rojo**, porque su árbol ya
      no es el que compiló qa. Es a propósito: el arreglo urgente también entra por develop y pasa por qa

**De la 9.5, los permisos contra dev:**

- [ ] **Los flujos de extremo a extremo siguen leyendo los secretos `QA_*`.** La 9.5 movió solo
      el trabajo de permisos, que es el suyo. Pasar `extremo-a-extremo-en-qa` a dev es cambiar
      tres nombres, y conviene hacerlo el mismo día que se carguen los de la [9.13](docs/08-plan-de-desarrollo.md#tarea-9-13)
- [ ] **La prueba escribe filas en dev, que es donde Gerencia aprueba.** Limpia lo suyo como
      dueño, pero mientras corre se ven sus filas. Corre de a una por la `concurrency` del trabajo

**De la 9.6, los flujos críticos de extremo a extremo:**

- [ ] ⚡ **Hace falta un secreto más de los que la [9.13](docs/08-plan-de-desarrollo.md#tarea-9-13) enumera: `QA_API_URL`.** La 9.13 pide la
      contraseña del rol y los seis secretos de GitHub que `permisos-en-qa` espera, y esos secretos
      apuntan a la **base** de qa. Correr los flujos contra la API **desplegada** necesita además su
      URL, que no puede escribirse en este repositorio porque es público. El trabajo de la tubería
      se salta nombrándola, así que no hay nada roto; lo que hay que decidir es si ese nombre entra
      a la lista de la 9.13 o si la URL de qa se publica como variable y no como secreto
- [ ] **[M-03](docs/12-pruebas-y-calidad.md#m-03) —entregar el pedido y cobrar el saldo— se quedó sin flujo automático.** `fn_entregar_pedido`
      existe desde la [4.5](docs/08-plan-de-desarrollo.md#tarea-4-5), pero `POST /api/v0/pedidos/{id}/entrega` está acordada en el contrato y
      **no implementada**: no aparece en la copia fijada de la API. Se descartó escribir la prueba
      contra la ruta ausente, porque una roja que hay que acordarse de encender no es una prueba.
      Es el octavo flujo del [12 §11](docs/12-pruebas-y-calidad.md#11-flujos-críticos-de-extremo-a-extremo) en cuanto la ruta entre, y **conviene mirar de qué tarea es**:
      el recorrido manual del 12 la da por existente
- [ ] **La respuesta guardada de un reintento no vuelve igual, y el orden de las claves no lo
      explica.** La [1.14](docs/08-plan-de-desarrollo.md#tarea-1-14) dejó anotado más abajo que el `jsonb` reserializa —otro orden, otro
      espaciado—, y eso lo absorbe comparar los dos JSON ya leídos. Pero el flujo [E-05](docs/12-pruebas-y-calidad.md#e-05) comparó los
      dos sobres enteros de `PUT /api/v0/movimientos/{id}` y **salió rojo**, así que cambia algo más.
      Queda afirmando lo que promete el [20 §5.2](docs/20-contrato-de-api.md) —el mismo `status`, el mismo id y el mismo valor, y
      una sola fila—, y **qué campo difiere está sin averiguar**. Se intentó: la consola de Gradle
      imprime `AssertionFailedError at FlujosCriticos.java:247` y nada más, y el mensaje vive en el
      informe HTML, que es un artefacto que no se puede descargar desde donde se escribió esto. Para
      que la próxima falla se lea en el registro hace falta `exceptionFormat = FULL` en el
      `testLogging` de `build.gradle.kts`, que **sí pide versión**, así que va en un PR que ya la suba
- [ ] **La mitad de front deja un movimiento anulado por corrida.** No habla con la base, así que no
      puede borrar lo que escribe: registra un gasto de **un peso** con su descripción marcada y lo
      anula con motivo, que es lo único que deshace algo ([ADR-004](docs/adr/ADR-004-base-solo-escritura.md)). En un ambiente con semilla
      reproducible eso no molesta, pero **si qa deja de recrearse** conviene decidir si esa mitad
      pasa a pedir también la base, como la de la API

**Del panel de los cuatro sobres del Inicio ([7.8](docs/08-plan-de-desarrollo.md#tarea-7-8)):**

- [ ] **La frase con que el mockup cierra el panel no se escribió.** El dibujo termina con «los
      gastos fijos consumieron el 49% de lo que entró, no el 25% configurado. O se suben las
      ventas, o se recalibran los porcentajes». Es una división y un consejo, y el front no
      calcula ni redacta ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). **Su sitio es una alerta de la API**, que ya tiene tipo,
      nivel y detalle redactado, y que el Inicio pinta encima. Mientras no exista, el panel enseña
      las cifras y no las interpreta
- [ ] **El encabezado tampoco dice sobre cuánta plata se repartió.** El mockup escribe «Sobre
      $6.025.000 que entraron», y lo que entró en el mes no viaja en el contrato: sacarlo de lo
      asignado entre el porcentaje sería calcular. Si esa cifra importa en pantalla, es un campo
      más de la consulta del tablero y un PR de contrato
- [ ] **Los nombres y los colores de los cuatro sobres los pone la pantalla**, como en la
      [7.7](docs/08-plan-de-desarrollo.md#tarea-7-7): el contrato manda la clave y ninguna presentación. Una clave que el front no
      conozca se pinta neutra y con la clave por nombre, para no esconder lo que llegó
- [ ] **A qué sobre carga cada salida lo decidió quien construyó**, porque ninguna columna lo dice:
      el gasto de categoría fija y el pro-labore a gastos fijos —el [05 §11](docs/05-reglas-financieras.md#11-la-regla-de-los-4-sobres) los nombra juntos—,
      el gasto que no es de categoría fija a costo directo, y el retiro de distribución a retiro. La
      inversión y el adelanto a la empleada no cargan a ninguno: cambian plata por un activo o por
      una cuenta por cobrar. **El día que una columna diga qué categoría es costo directo**, que es
      la deuda ya declarada del reporte del año, ese reparto se afina solo
- [ ] **La reserva no tiene usado.** Ningún movimiento se marca como hecho contra el colchón, así
      que darle un criterio sería inventar una regla de negocio. Lo que enseña es su avance, y **su
      meta son tres meses de gasto fijo medidos como los mide la caja libre**: lo pagado en
      categorías fijas el mes anterior, con el pro-labore dentro. Ningún documento dice de dónde sale
      la cifra mensual, y usar dos definiciones de «gasto fijo» en la misma tarjeta sería peor
- [ ] **Lo asignado se reparte sobre las entradas de caja del mes**, que incluyen el aporte de
      capital y el anticipo recibido: el [05 §11](docs/05-reglas-financieras.md#11-la-regla-de-los-4-sobres) dice «cada peso que entra en efectivo» y esas son
      las entradas. La transferencia no reparte, porque es la misma plata en otro bolsillo. **Un mes
      cerrado se reparte sobre el libro y no sobre su snapshot**, que congela el flujo neto y no las
      entradas por separado
- [ ] **La 7.8 llevó también su mitad de API, y el [08](docs/08-plan-de-desarrollo.md) la tenía como del front.** Sin ella el
      panel no pinta nunca nada, y partirla en dos tareas habría dejado media tarea sin número. Si la
      fila del 08 debe decir «API, Front», eso lo autoriza quien dirige

**Del costeo de bordado (5.4):**

- [ ] ⚡ **Cómo entra el tiempo de máquina en el costo unitario lo decidió quien construyó.** Era la
      regla que faltaba y la que tenía parada la tarea. Se decidió que **no entra en pesos y sí en
      ocupación**: el costo del tiempo sigue siendo el de la persona, y el margen por hora divide
      entre el mayor de los dos tiempos ([05 §7.1](docs/05-reglas-financieras.md#71-costo-unitario), [05 §7.2](docs/05-reglas-financieras.md#72-los-dos-márgenes)). La razón es que la tarifa por hora es
      un sueldo entre horas productivas y la máquina no cobra sueldo, y que cobrarle esos minutos a
      la tarifa de la persona contaría dos veces la hora que la persona dedica a otra cosa ([RN-17](docs/03-requisitos-y-bdd.md#rn-17)).
      **Se descartó una tarifa de máquina propia** —depreciación, energía y mantenimiento entre
      horas de uso—, que es lo más fiel pero pide columna, panel e historial, y el [08](docs/08-plan-de-desarrollo.md) le da a la 5.4
      una sola tarea y un día. Si el taller quiere que la bordadora cueste plata por hora, eso es
      esa tarifa y es otra tarea

**De la 9.7, el rendimiento con 4G:**

- [ ] **La primera visita no cumple el [RNF-01](docs/03-requisitos-y-bdd.md#rnf-01), y no es cuestión de afinar.** Flutter Web con
      CanvasKit baja 3,6 MB antes del primer cuadro: 2,4 MB de `canvaskit.wasm` y 1 MB de
      `main.dart.js`. Con 4G típico son 4,5 s; con el lento, entre 19 y 21 s. Hay que decidir si el [RNF-01](docs/03-requisitos-y-bdd.md#rnf-01)
      habla de la primera visita o de las siguientes, que cumplen con 1,3 s, o si se cambia el
      motor de pintura. La CI la informa sin bloquear hasta que se decida
- [ ] **El front baja la fuente Roboto de `fonts.gstatic.com` cada vez que abre sin caché.** Es una
      dependencia de un tercero que el resto del artefacto evita con `--no-web-resources-cdn`. Empaquetarla
      en los recursos del front la quita
- [ ] **La medición es un sustituto.** Chromium en la CI con la red y la CPU frenadas no es el
      celular del taller, y el criterio del [RNF-01](docs/03-requisitos-y-bdd.md#rnf-01) es «medición en dispositivo real». Falta abrir
      dev en ese celular, con la caché vacía y después con ella llena, y anotar los dos tiempos

**De la pantalla Reportes (6.5):**

- [ ] 🔒 **El punto de equilibrio se pinta en Reportes aunque sea de la [6.6](docs/08-plan-de-desarrollo.md#tarea-6-6).** La 6.6 es de la API y
      su mitad ya viaja dentro de la respuesta del reporte, que es lo que el contrato de la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10)
      acordó. El [10 §4.6](docs/10-ux-y-mockups.md#46-reportes) lo pone dentro de esta pantalla, así que leerlo y no mostrarlo sería
      guardar datos que nadie mira. Si la 6.6 tiene que entregar algo más, lo decide quien dirige
- [ ] **El año no se elige: se pide el que la API decida.** La consulta va con el cuerpo vacío, como
      la del Inicio, y sin `anio` la API responde el año en curso en Bogotá. El contrato admite el
      campo y declara el `42260` para uno fuera de 2020..2100, así que el selector de años existe en
      el acuerdo y no en el plan: entra cuando una tarea lo pida
- [ ] **La columna «Contra el punto de equilibrio» del mockup no se pintó.** Esa barra sale de
      restar los ingresos de cada mes menos las ventas necesarias, y restar plata en el front es
      decidir ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). El contrato no manda esa diferencia por mes: si tiene que verse, la
      calcula la API

**De las alertas del Inicio (6.7):**

- [ ] **Con un solo cliente con anticipos, la concentración alerta siempre.** El [05 §3.4](docs/05-reglas-financieras.md#34-alertas-derivadas) dice «un
      solo cliente concentra más del 40 %», y el único que tiene anticipos tiene el 100 %: un taller
      con un pedido abierto ve la alerta informativa cada día. **Se escribió la regla tal cual**; si
      hace falta un mínimo de clientes o de plata para que cuente, lo decide quien dirige
- [ ] **La caja libre negativa y los anticipos sobre el saldo salen juntas casi siempre.** Si los
      anticipos superan el saldo, la caja libre ya es negativa, así que la segunda nunca sale sola.
      El documento las lista como dos y dicen cosas distintas —cuánto falta para usar y cuánto falta
      para devolver—, así que viajan las dos
- [ ] **El panel va debajo de la línea que concilia y no junto a los sobres, como en el mockup.**
      El [10 §4.1](docs/10-ux-y-mockups.md#41-dashboard) las pone en ese orden —cifras, explicación, alertas— y el documento manda sobre el
      dibujo. La etiqueta de cada alerta es su nivel y no su tipo, porque nombrar el tipo sería
      redactar en el front

**Del Inicio (6.3):**

- [ ] 🔒 **La tarea de API que faltaba entró como [6.11](docs/08-plan-de-desarrollo.md#tarea-6-11), y el número lo confirma quien dirige.** La
      6.1 dejó los cuatro cálculos como servicios puros y anotó que no traía endpoint; la 6.3 es
      del front y la pantalla ya lo consumía, porque el contrato es el acuerdo, así que el Inicio
      de dev pintaba el «No se encontró lo que buscas» de la API. Se numeró al final del sprint 6
      porque el Inicio es su objetivo y porque una tarea solo puede depender de anteriores
      ([ADR-043](docs/adr/ADR-043-dependencias-solo-hacia-atras.md)): depende de la [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12), la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1) y la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10), las tres hechas. La [6.3](docs/08-plan-de-desarrollo.md#tarea-6-3) y la
      [6.4](docs/08-plan-de-desarrollo.md#tarea-6-4), que la consumen, son anteriores y no la declaran
- [ ] **Las tres frases que el mockup pone debajo de cada cifra no viajan en el contrato.** «¿El
      negocio es rentable? — sí, 16,0% de margen» lleva una cifra que `Tablero` no manda, y «bajó, y
      es normal» es un juicio. La pantalla pinta la pregunta y la cifra, y lo que las explica es la
      línea que redacta la API. Si el veredicto tiene que leerse, lo manda el servidor: el margen
      neto ya lo calcula la 6.1 y el contrato lo sirve en el reporte de la [6.5](docs/08-plan-de-desarrollo.md#tarea-6-5)
- [ ] **El botón «Ver todos» de «Por entregar» no se pintó, porque no hay a dónde mandarlo.** La clave
      de una sección solo puede escribirse en `registro_de_secciones.dart`, y el contrato no manda
      ningún destino para esa zona; las alertas sí lo traen, en `Alerta.destino`. Con un `destino` en
      `Pendientes` —o con el mismo criterio en otra zona— el botón entra sin que el front decida nada

**Del gráfico de doce meses (6.4):**

- [ ] **El contrato exige `doceMeses` pero no dice que traiga doce, ni qué se lee si llega vacía.**
      `Tablero.doceMeses` es obligatorio y su esquema no pone `minItems`, así que una API que
      devuelva la lista vacía cumple el contrato. Con la lista vacía **el panel no se pinta**, que es
      lo mismo que el contrato manda para los sobres —«vacío mientras no haya configuración: el panel
      no se pinta y nada se inventa»—, antes que inventar un «todavía no hay meses» que ningún
      documento escribió. Si el Inicio de un taller recién abierto tiene que decir algo ahí, el texto
      lo manda la API

**Del tablero del Inicio ([6.11](docs/08-plan-de-desarrollo.md#tarea-6-11)):**

- [ ] **Las cuentas por cobrar descuentan también lo cobrado contra entrega, y no solo los
      anticipos.** `FichaDePedido.saldoPendiente()` resta únicamente los anticipos, y la entrega no
      escribe uno por el saldo: escribe un `ingreso` con el pedido adentro ([CU-07 A1](docs/02-casos-de-uso.md#cu-07)). Sin contar ese
      ingreso, un pedido cobrado del todo seguiría contándose por cobrar. La cifra nunca baja de
      cero: cobrar de más es otra cosa y ninguna pantalla la pinta aquí
- [ ] **Si llega solo el año o solo el mes, el que falta es el de hoy.** El contrato los declara
      opcionales por separado y no como un par, y suponer enero cuando alguien pide un año entero
      sería inventar un mes que nadie pidió
- [ ] **La caja libre es la de hoy, aunque se mire otro mes.** Sus tres términos —el saldo, los
      anticipos abiertos y los gastos fijos comprometidos— son del presente, y rehacer el saldo de un
      día pasado pide el libro entero desde el principio. El mes que se mira manda en la utilidad, en
      el flujo y en los gastos fijos que se comparan
- [ ] **«Por entregar» son los pedidos en proceso y los parciales**, que es el mismo conjunto de
      `v_anticipos_por_devengar`: una cotización todavía no compromete nada y un cancelado ya no se
      va a entregar. Ningún documento enumera cuáles cuenta esa zona del [10 §4.1](docs/10-ux-y-mockups.md#41-dashboard)

**Del costo congelado ([5.5](docs/08-plan-de-desarrollo.md#tarea-5-5)):**

- [ ] **Un producto sin costeo a la fecha del pedido congela cero, y el pedido entra igual.**
      `costos_producto` solo tiene filas desde la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2), y un producto anterior —o uno cuyo primer
      costeo empieza después— deja el renglón en cero. Rechazar el pedido habría sido inventar una
      regla que ningún documento escribió, y un hueco del catálogo no puede impedir que el taller
      tome un pedido. Se ve en que el costo directo sale más bajo, no en un error
- [ ] **El costo congelado no se lee de vuelta, ni siquiera para Gerencia.** Las tres columnas se
      escriben al registrar y la ficha del pedido sigue trayendo solo el producto, la cantidad y el
      precio: el contrato no declara ningún campo de costo, y leerlo sí y no enviarlo sería confiar
      en que nadie lo ponga en la respuesta por descuido. `pedido_lineas` no lleva RLS, así que el
      «no» del [RF-34](docs/03-requisitos-y-bdd.md#rf-34) ahí lo sostiene la API y no la base
- [ ] **Retro-fechar un costeo sigue sin ruta, y esta tarea dice que no hace falta.** La pregunta
      estaba abierta más arriba en esta misma lista: congelar lee el historial hacia atrás, así que un
      pedido de marzo conserva lo que costaba en marzo sin que nadie corrija el costo de marzo. Si
      alguna vez hay que corregir un costeo mal digitado, eso es una pantalla que nadie ha dibujado

**De las tres cifras ([6.1](docs/08-plan-de-desarrollo.md#tarea-6-1)):**

- [ ] **Nada dice qué categoría de gasto es costo directo, y el estado de resultados lo necesita.**
      El [05 §12.1](docs/05-reglas-financieras.md#12-ejemplo-integral--septiembre-completo) descuenta el costo de los pedidos entregados —$3.612.000— y **no** la compra de
      insumos del mes —$3.900.000—, que solo está en el flujo de caja. Si los dos entraran, el costo
      se restaría dos veces. `categorias` tiene `es_fijo` y nada más, así que hoy el conjunto llega
      vacío y **los insumos cuentan como gasto operativo**: la utilidad causada sale más baja de lo
      que el documento dice. Hace falta una marca en `categorias`, con el molde de `es_fijo`, y es
      de la base: va antes que la API que la use ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md)). **Conviene escribirlo también en el 05**,
      que es donde vive la fórmula
- [x] **`pedidos.costo_directo` ya lo escribe alguien: lo congela la [5.5](docs/08-plan-de-desarrollo.md#tarea-5-5) al registrar el
      pedido**, junto con `pedido_lineas.costo_unitario` y `horas_unitarias`, que la [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3) dejó
      anotadas. Sale del costeo que regía el día del pedido, y por eso el margen bruto del tablero
      deja de ser el ingreso entero. Lo que queda abierto son los huecos del catálogo, en el [§10](#10-decisiones-de-construcción-que-conviene-revisar)
- [ ] **La entrega parcial no causa venta, y el [CU-07 A2](docs/02-casos-de-uso.md#cu-07) dice que causaría en proporción.** Ninguna
      columna guarda qué parte se entregó, así que contar el pedido entero causaría de más y no
      contarlo, de menos. Se cuenta cero, que es lo que no miente, y queda a la vista
- [ ] **La nómina no viaja en el estado de resultados, y el contrato la pide.** `MesDelReporte` trae
      `nomina` dentro de los gastos operativos, pero un pago de nómina se reconoce por estar en
      `nomina_detalle`, que es del [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8): el dominio no lo distingue de cualquier otro gasto. Lo
      necesitará la [6.5](docs/08-plan-de-desarrollo.md#tarea-6-5)
- [ ] **El ingreso sin pedido entra en la utilidad causada, y el [05 §9.1](docs/05-reglas-financieras.md#9-catálogo-de-kpis) solo nombra los pedidos.**
      El registro rápido deja anotar una venta que nunca fue pedido, y esa venta existe: dejarla
      fuera haría que el libro y el tablero contaran cosas distintas. No duplica, porque el apunte
      de la entrega lleva `pedido_id`

**De la factura del pedido ([4.8](docs/08-plan-de-desarrollo.md#tarea-4-8)), en su mitad API:**

- [ ] **Subir un archivo es un solo caso de uso con dos padres, y no dos clases.** `AdjuntarSoporte`
      sirve a las dos rutas, porque lo único que cambia es de qué cuelga. Partirlo duplicaría el orden
      de las dos escrituras —primero el objeto y después la ficha—, que es el invariante que no puede
      quedar en dos sitios: dos copias de una regla así se separan en cuanto una se toca
- [ ] **El mockup no dibujaba de dónde se adjunta la factura de un pedido, y la mitad Front lo
      dibujó.** La pantalla de Pedidos tenía el formulario de «Nuevo pedido» y la lista, y ningún
      sitio para el archivo, aunque el [RF-27](docs/03-requisitos-y-bdd.md#rf-27) lo pide y la fila del libro sí lo tiene dibujado para el
      movimiento ([10 §4.3](docs/10-ux-y-mockups.md#43-movimientos)). Se estrena en la **fila abierta del pedido**, que ya existía en el
      mockup con «Modificar», «Marcar entregado» y «Anular pedido». **Cambiar una pantalla aprobada
      lo decide quien dirige**, como el botón de los activos y el panel de los sobres
- [ ] **Una factura no se anula, y la tabla sí sabe.** `adjuntos` tiene sus cinco columnas de
      anulación desde la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) y el contrato no declara ninguna operación que las llene, ni para el
      soporte del movimiento ni para la factura: la lectura filtra `anulado_en IS NULL` y nada más.
      Cambiar una factura equivocada es hoy subir la buena, y las dos quedan
- [ ] **El pedido trae sus facturas, y no hay consulta que las pida aparte.** Van dentro del pedido
      como los soportes van dentro del movimiento, con la segunda consulta que junta
      `ConsultarPedido`. Una ruta propia sería una ida más a la base para pintar la misma fila, y el
      contrato no la declara

**De la factura del pedido ([4.8](docs/08-plan-de-desarrollo.md#tarea-4-8)), en su mitad Front:**

- [ ] **La fila abierta del pedido deja de ser de Gerencia.** Era suya con tres acciones que solo
      ella tiene, y la factura la adjuntan los dos tipos de usuario: esconderla detrás de ese panel
      sería decidir un permiso en la pantalla ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). Las tres acciones siguen siendo de
      Gerencia en el mockup, y en el front todavía no existe ninguna
- [ ] **La fila abierta del front trae solo la factura.** Modificar, marcar entregado y anular son
      de otras tareas y de otras rutas, así que construirlas aquí sería adelantar trabajo sin su
      verificación. La fila queda abierta para recibirlas
- [ ] **La factura se encola, y por eso `Pedidos` devuelve una intención y no la manda.** Es la
      regla del front —la intención se guarda antes de salir a la red ([17 §5](docs/17-resiliencia-offline-y-cache.md))— y lo que ya hace la
      foto del recibo. **Ningún otro escrito de pedidos se encola**, así que la factura es la
      primera: se decidió por el archivo, que es lo que se pierde si no hay señal, y no por la ruta
- [ ] **`adjuntos` se lee estricto en el pedido.** El contrato lo declara obligatorio, así que un
      pedido sin esa lista deja ilegible la lectura entera, como un renglón que no se entiende:
      enseñar el pedido sin su factura sería decir que no tiene
- [ ] **`AdjuntoDelLibro` se retiró y la ruta de bajar un adjunto se mudó a `Soportes`.** El
      contrato tiene un solo esquema `Adjunto` y una sola operación para los dos padres, y tenerlos
      dos veces en el front serían dos sitios donde arreglar lo mismo

**Del listado de pedidos ([4.6](docs/08-plan-de-desarrollo.md#tarea-4-6)):**

- [ ] **El segmentado «Todos · Por entregar · Entregados» del mockup se cambió por el desplegable
      de los cinco estados del contrato.** Estaba dibujado y no filtraba nada, y «por entregar» son
      tres estados a la vez: agruparlos en la pantalla sería decidir en el front lo que dice la API,
      y pedirle a la API un filtro por varios estados sería cambiar el contrato por comodidad de un
      botón. El [10 §4.2](docs/10-ux-y-mockups.md#42-pedidos) ya pedía «filtros por estado, cliente y rango», así que el dibujo se
      acercó a lo escrito. **Cambiar una pantalla aprobada lo decide quien dirige**
- [ ] **La columna «Detalle» cruza los renglones con el catálogo de productos.** El contrato manda
      el `productoId` de cada línea y no su nombre, y el mockup enseña «60 × Mug estampado», así que
      el nombre sale del mismo catálogo que llena «Nuevo pedido». No es calcular nada, pero es una
      consulta más y un producto retirado se nombra como tal
- [ ] **Las tres cifras de arriba de la pantalla —«Por entregar», «Anticipos por devengar» y
      «Entregados»— no se construyeron.** Ninguna operación del contrato las devuelve, y sumarlas en
      el front sería calcular plata. El mockup las dibuja desde el principio

**Del resaltado de estancados ([4.7](docs/08-plan-de-desarrollo.md#tarea-4-7)):**

- [ ] 🔒 **La tarea se cerró sin comportamiento nuevo, y conviene saberlo.** Las tareas [4.4](docs/08-plan-de-desarrollo.md#tarea-4-4) y [4.6](docs/08-plan-de-desarrollo.md#tarea-4-6) se la
      habían llevado por delante —una escribió la regla porque su respuesta necesitaba el campo, la
      otra la pintó porque su fila lo traía—, así que lo único que quedaba era que el ámbar estuviera
      protegido. **Si el resaltado tenía que ser algo más que la píldora, lo dice quien dirige**
- [ ] **No se agregó un filtro «solo estancados», que es la otra lectura de «resaltado».** Serían una
      operación nueva del contrato y un PR en la especificación antes, y el [10 §4.2](docs/10-ux-y-mockups.md#42-pedidos) fija a
      propósito el desplegable de los cinco estados: «por entregar» son tres a la vez, y decidir
      cuáles caben ahí sería decidir en la pantalla. Encontrar los estancados es hoy recorrer la lista
- [ ] **Tampoco se enseña cuántos días lleva**, que es lo que el mockup dibuja en el resumen del
      Inicio. El contrato manda `estancado` como un sí o un no, y contar los días en el front sería
      decidir ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)): enseñar «18 días» pide un campo nuevo, y ese es el Inicio y otro sprint

**De los activos ([7.1](docs/08-plan-de-desarrollo.md#tarea-7-1)), en su mitad API:**

- [ ] **`activos.vida_util_meses` se queda vacía.** La columna existe desde el esquema inicial y
      ningún documento dice cómo se deprecia un equipo ni el contrato la declara, así que escribirla
      sería inventar una regla financiera. El día que la depreciación exista, la columna ya está y el
      contrato sube la MINOR
- [ ] **Un activo no se anula, y la tabla sí sabe.** `activos` tiene `anulado_en`, `anulado_por` y
      `anulado_motivo`, y el contrato no declara ninguna operación que las llene: la lista filtra
      `anulado_en IS NULL` y nada más. Vender un equipo o darlo de baja tampoco está en ningún
      documento, y es lo mismo que dice el `estado`, que tiene un solo valor
- [ ] **El `42290` va sobre `fechaCompra` y el retiro lo manda sobre `fecha`.** Los dos formularios
      llaman distinto a su fecha y el código es el mismo, así que `FechaDeCapitalInvalida` ahora
      lleva el campo: el aviso se pinta debajo del que existe en cada formulario, como el catálogo
      del contrato lo describe

**De los activos ([7.1](docs/08-plan-de-desarrollo.md#tarea-7-1)), en su mitad Front:**

- [ ] **El botón «+ Registrar inversión» se agregó, y el mockup lo estrena.** El panel dibujado era
      solo tabla, pero el [RF-45](docs/03-requisitos-y-bdd.md#rf-45) y el [CU-15](docs/02-casos-de-uso.md#cu-15) son *registrar* una inversión y la API ya sirve el
      formulario: dejarla de solo lectura habría dejado `PUT /api/v0/activos/{id}` sin nadie que lo
      llame. El molde es el del pro-labore, que quien dirige aprobó en esta misma pantalla
- [ ] **La píldora «En uso» la escribe el front.** El contrato manda `estado: "en_uso"` y para los
      activos no hay tabla de presentación como `presentacion_tipos` para los movimientos, así que
      la traducción vive en la pantalla, como el «GER» y el «OPE» de la tabla de personas. Se
      descartó pedirle a la API una presentación, que es contrato nuevo que nadie pidió
- [ ] **Un activo sí se anula, y la entrada de arriba se queda corta.** La tabla no lleva columna de
      acciones porque el contrato no declara la operación, pero anular el movimiento de `inversion`
      en el libro arrastra la fila de `activos` desde la [3.23](docs/08-plan-de-desarrollo.md#tarea-3-23). El que entró sin cuenta no tiene
      movimiento, así que ese sí no tiene por dónde
- [ ] **Los mensajes y las ayudas del formulario «activo» van sin tildes.** Es lo que el record
      `NuevoActivo` tiene escrito y por tanto lo que llega por el cable; los demás formularios sí
      las llevan. Es de la mitad API y se arregla donde está escrito, no traduciéndolo en el front

**De los aportes ([7.2](docs/08-plan-de-desarrollo.md#tarea-7-2)), en su mitad Front:**

- [ ] **El panel «Aportes de capital» se dibujó, y el mockup lo estrena.** No existía: los aportes
      solo aparecían en un KPI del patrimonio, que es una cifra y no un registro. El [RF-46](docs/03-requisitos-y-bdd.md#rf-46) y el
      [CU-15](docs/02-casos-de-uso.md#cu-15) son *registrar* un aporte y la API ya sirve el formulario, así que el molde es el del
      panel de activos, que está justo encima
- [ ] **El panel no lleva tabla, y el historial se manda al libro.** El contrato no declara ninguna
      consulta de aportes. Se descartó armarla con `consultas/movimientos` filtrado por el tipo
      `aporte`, que sería consultar de más y decidir qué página del libro le toca a esta pantalla.
      Queda por mirar si conviene una consulta propia, que es contrato nuevo
- [ ] **El comprobante de lo último registrado se pierde al recargar.** Vive en el estado del panel
      y no en ninguna consulta, porque no hay de dónde volver a leerlo: es un acuse de que la
      escritura entró, no un historial. Quien quiera verlo después va al libro

**De los costos ocultos a Operación ([5.8](docs/08-plan-de-desarrollo.md#tarea-5-8)):**

- [ ] **`pedidos` y `pedido_lineas` guardan costos y van sin RLS.** El [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) las deja abiertas
      porque «no hay nada que separar», pero `pedidos.costo_directo` y `pedido_lineas.costo_unitario`
      y `horas_unitarias` son justo lo que `costos_solo_gerencia` le esconde a Operación en
      `costos_producto`. Hoy la API los lee y **no los envía**, y la 5.8 no los tocó. **La [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3) no
      los escribió**, y los dejó en cero por la razón de abajo; la [8.9](docs/08-plan-de-desarrollo.md#tarea-8-9) los va a necesitar. Sigue
      sin decidirse si se protegen en la base, con una vista o con una función, o si basta con que
      la API no los mande

**Del costeo de bordado ([5.4](docs/08-plan-de-desarrollo.md#tarea-5-4)), que no se pudo empezar:**

- [ ] **Cómo entra el tiempo de máquina en el costo unitario.** La tabla tiene
      `costos_producto.minutos_maquina` desde el esquema inicial y el [04 §4.5](docs/04-modelo-de-datos.md#45-productos-costeo-y-cotizaciones) dice que «es lo que
      permite costear el bordado por tiempo de máquina», pero **la fórmula del [05 §7.1](docs/05-reglas-financieras.md#71-costo-unitario) no lo
      menciona**: solo minutos de trabajo por la tarifa. ¿Se cobra a la misma tarifa, a una de
      máquina que no existe en ninguna tabla, o sustituye a los minutos de trabajo en el margen por
      hora? Es una regla financiera y no se inventa aquí
- [ ] **El contrato no lo declara.** Ningún esquema de costeo tiene `minutosMaquina` —ni
      `ConsultaDeCosteo`, ni `Costeo`, ni el formulario «producto»—, así que la tarea necesita primero
      su PR de contrato, revisado por los dos lados ([ADR-022](docs/adr/ADR-022-openapi-generado.md))
- [ ] **Las puntadas no tienen dónde guardarse.** El [CU-10](docs/02-casos-de-uso.md#cu-10) promete «costo por tiempo de máquina **y
      puntadas** registrado» y no hay columna: si entran, son una migración, y eso son dos PR en orden

**Del pedido con sus líneas ([4.3](docs/08-plan-de-desarrollo.md#tarea-4-3)):**

- [ ] **El costo del pedido y el de cada renglón se escriben en cero.** No hay forma de escribirlos
      igual para todos: `costos_solo_gerencia` no le devuelve ni una fila de `costos_producto` a una
      sesión de Operación, y el [CU-05](docs/02-casos-de-uso.md#cu-05) dice que el pedido lo registran los dos tipos. Copiarlos
      cuando la sesión los ve daría pedidos con costos distintos según quién digitara, y una función
      `SECURITY DEFINER` que los diera sin exponer la tabla es una migración, o sea de la base y dos
      PR en orden. **Es la misma pregunta de arriba**, y la [8.9](docs/08-plan-de-desarrollo.md#tarea-8-9) la va a encontrar de frente
- [ ] **El número visible es `P-` y cuatro dígitos, y lo reparte un cerrojo de aviso.** Ningún
      documento dice cómo se forma: el contrato y el mockup lo escriben `P-0287` y la semilla usa
      `PED-2026-0001`, así que se siguió el contrato y el consecutivo mira solo los que casan con ese
      patrón. Se descartó una secuencia en la base, que es migración. El cerrojo hace falta porque
      sin él dos registros a la vez arman el mismo número y el segundo choca contra
      `pedidos_numero_key`; **a 9.999 pedidos habrá que decidir si se ensancha el formato**
- [ ] **La fecha del pedido no se rechaza aunque sea futura.** El movimiento sí lo hace, pero el
      contrato de `registrarPedido` no declara ningún código para eso —el `42234` es de la fecha del
      anticipo y de la entrega—, así que la API la acepta. Si el taller no debe poder fechar un
      pedido mañana, es un código nuevo y un PR de contrato
- [ ] **El contrato se acordó y se implementó en la misma rama.** Lo autorizó quien dirige. El
      [ADR-022](docs/adr/ADR-022-openapi-generado.md) prefiere que el acuerdo vaya en su propio PR antes de construir, para que los dos
      lados lo revisen sin nada implementado detrás
- [ ] **El alta de cliente en línea sigue dibujada y sin construir.** El mockup la tiene dentro del
      formulario de pedido desde la [4.2](docs/08-plan-de-desarrollo.md#tarea-4-2), y el front no la implementó: el cliente se crea en
      «Clientes del taller», que está justo debajo. No tiene tarea en el 08
- [ ] **El formulario «pedido» estrena un campo que el descriptor no describe.** Las líneas van
      marcadas para quedar fuera, porque el descriptor solo sabe expresar campos sueltos ([20 §4.4](docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)),
      y la pantalla las pinta a mano. **Es la primera vez**, y conviene mirar que no se convierta en
      la puerta por la que un formulario se salte el descriptor

**De la cancelación de un pedido (4.9):**

- [ ] **Con qué movimiento se registra el destino del anticipo.** Cancelar deja escrito si la plata se
      le devuelve al cliente o se queda en el negocio, pero **no escribe ningún movimiento**: la
      devolución necesitaría bajar la caja sin tocar la utilidad, y el ingreso subir la utilidad sin
      volver a subir la caja —la plata del anticipo ya entró—, y ninguno de los nueve tipos de
      `tipo_movimiento` expresa eso. Se descartaron un `gasto`, que bajaría la utilidad; anular el
      `anticipo_recibido`, que deja el saldo bien y la historia falsa; y un tipo nuevo en el ENUM, que
      es de la base y el contrato no declara. **Es la misma pregunta que le espera a la entrega**
      ([4.5](docs/08-plan-de-desarrollo.md#tarea-4-5)), donde la venta se causa por el total y la caja sube solo por el saldo
- [ ] **La cuenta de la devolución se comprueba y no se guarda.** El contrato la pide —«de dónde sale
      la plata»— y `pedidos` no tiene columna para ella, así que hoy se valida contra el catálogo
      (`42233`) y se descarta. Será la cuenta del movimiento cuando exista el de arriba
- [ ] **`devengado_en` no se toca al cancelar.** Devengar es causar la venta y eso solo pasa al
      entregar ([RN-06](docs/03-requisitos-y-bdd.md#rn-06)); el pasivo ya deja de contar en la caja libre porque
      `v_anticipos_por_devengar` solo suma los anticipos de pedidos en proceso o parciales ([04 §6](docs/04-modelo-de-datos.md#6-vistas-de-cálculo-financiero))

**Del pro-labore (7.3):**

- [x] **La pantalla del pro-labore la aprobó quien dirige el 2026-09-25**, en el PR de la tarea.
      Se dibujó sin estar aprobada, como la de clientes: nada se construye sin su pantalla
      aprobada, y el mockup pintaba «Inversiones y retiros» solo para consultar. Se dibujó el
      panel «El pro-labore» —lo que rige, el vacío y el formulario en línea— y se construyó a la
      vez, que es lo que quien dirige pidió para la [4.2](docs/08-plan-de-desarrollo.md#tarea-4-2). El [10](docs/10-ux-y-mockups.md) sube a MAJOR, porque el
      pro-labore cambió de sitio en el mapa
- [ ] **El pro-labore vive en «Inversiones y retiros», y ya no en «Configuración».** El mapa del
      [10 §2](docs/10-ux-y-mockups.md#2-mapa-de-navegación) lo colgaba de una «Configuración» que no es ninguna de las once pantallas ni
      tiene clave en el menú, y el menú lo dicta la API: dársela es un cambio de contrato. Ponerlo
      donde se parte el retiro no lo es. Los sobres de la [7.7](docs/08-plan-de-desarrollo.md#tarea-7-7) siguen colgando de
      «Configuración», con la misma pregunta
- [ ] **La pantalla de capital se abre con un solo panel.** Ninguna tarea tenía la pantalla de
      «Inversiones y retiros» —la [7.4](docs/08-plan-de-desarrollo.md#tarea-7-4), la [7.5](docs/08-plan-de-desarrollo.md#tarea-7-5) y la [7.6](docs/08-plan-de-desarrollo.md#tarea-7-6) son solo API—, y sin cablear la clave
      `capital` al panel no llegaba nadie. Los activos, los aportes, el retiro partido y el
      patrimonio entran con sus tareas, cada uno debajo del anterior
- [ ] **El tipo de campo `numero` lo estrenó en el front el pro-labore, y no el catálogo.** La API
      lo genera desde la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2), para los minutos; en el front no existía, y las horas del
      pro-labore llevan decimales y no son plata, así que sin él el formulario no se podía pintar.
      La mitad Front de la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2) ya lo encuentra hecho: acepta coma o punto, y viaja como número
- [ ] **Unas horas por encima de 9.999,99 salen como `50000`.** No caben en `NUMERIC(6,2)` y el
      contrato no le puso máximo al formulario, así que la base las rechaza sin traducción. Se
      descartó reusar el `42294`, que habla de decimales, y se descartó inventar un tope de 744
      horas sin contrato. El arreglo es un `maximum` en `NuevoProlabore.horasMensuales`, y sube la
      MINOR del contrato. Es el mismo hueco que la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2) dejó en los minutos

**Del retiro partido ([7.4](docs/08-plan-de-desarrollo.md#tarea-7-4)):**

- [x] **Los gastos fijos comprometidos son los del mes anterior que este mes todavía no se pagan.**
      Lo decidió quien dirige el 2026-09-26. El [05 §3.3](docs/05-reglas-financieras.md#33-caja-libre--la-cifra-que-hoy-no-existe-en-ninguna-parte) dice «gastos fijos pendientes del mes» y ningún
      documento dice cuánto se espera pagar: `categorias.es_fijo` marca qué es fijo, pero no hay
      monto. Por cada categoría fija se toma lo pagado el mes anterior y se le resta lo pagado en
      este, sin bajar de cero. Se descartó dejarlos en cero hasta la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1), que subía la caja libre
      y retrasaba el aviso del retiro. **Conviene escribirlo en el 05**, que es donde vive la fórmula
- [ ] 🔒 **La caja libre la construyó el retiro, y no la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1).** El contrato del retiro la pide
      —`cajaLibre` en la propuesta y el `40990`— y la 6.1 dependía de la 7.4: era un círculo, y el
      [§10](#10-decisiones-de-construcción-que-conviene-revisar) ya lo había anotado al acordar el capital. `CalcularCajaLibre` queda en el dominio para que
      la 6.1 la reutilice en el tablero y la [6.8](docs/08-plan-de-desarrollo.md#tarea-6-8) en el cierre
- [ ] **Los ids de los dos movimientos salen del id del retiro.** El retiro no tiene tabla propia, así
      que el mismo id dos veces tenía que chocar en algún sitio: los movimientos llevan un UUID v3 del
      id y su tipo, y la llave primaria de `movimientos` responde el `40900` sin preguntar antes
- [ ] **El `40300` de la propuesta lo da la lectura de los saldos**, que pregunta `fn_es_gerencia()`,
      y no el pro-labore, que a Operación le llega vacío sin error. Es la base la que dice que no,
      pero por la puerta de la caja libre
- [ ] **El retiro no tiene pantalla.** La 7.4 es solo API, y «Inversiones y retiros» ya pinta el
      pro-labore y los activos, pero no el retiro. Es la misma pregunta que ya estaba abierta para la [7.5](docs/08-plan-de-desarrollo.md#tarea-7-5) y
      la [7.6](docs/08-plan-de-desarrollo.md#tarea-7-6): o ganan mitad Front, o se dice cuál de las 7.x la lleva

**De la alerta de descapitalización ([7.6](docs/08-plan-de-desarrollo.md#tarea-7-6)):**

- [ ] **Sin nada repartido no alerta, aunque el período haya dado pérdida.** El [05 §6.4](docs/05-reglas-financieras.md#64-patrimonio-y-descapitalización) compara
      retiros contra utilidades y no dice qué pasa cuando no hay retiros y las utilidades son
      negativas, donde la comparación se cumple sola. La cifra que dispara la alerta es lo que se
      sacó, así que sin retiros no hay aviso: un mes malo alertaría de un retiro que nadie hizo
- [ ] **El umbral es «más que», no «más o igual».** Retirar exactamente lo generado deja el
      patrimonio donde estaba, así que no descapitaliza. Es la regla tal cual, y se anota porque el
      caso del empate no aparece en ningún documento

**De los cuatro sobres ([7.7](docs/08-plan-de-desarrollo.md#tarea-7-7)), en su mitad Front:**

- [ ] **El panel «Los 4 sobres» se dibujó, y el mockup lo estrena.** No existía: el prototipo solo
      tenía la tarjeta del Inicio, que es lo asignado contra lo usado y es la [7.8](docs/08-plan-de-desarrollo.md#tarea-7-8), no dónde se
      configura. Se dibujó y se construyó a la vez, como el pro-labore de la [7.3](docs/08-plan-de-desarrollo.md#tarea-7-3), que es lo que
      quien dirige pidió para la [4.2](docs/08-plan-de-desarrollo.md#tarea-4-2). **Falta que lo apruebe**
- [ ] **Los sobres viven en «Inversiones y retiros», y ya no en «Configuración».** Es lo que el
      [§10](#10-decisiones-de-construcción-que-conviene-revisar) dejó pendiente al mover el pro-labore, con la misma razón: «Configuración» no es
      ninguna de las once pantallas ni tiene clave en el menú, y el menú lo dicta la API. El [10](docs/10-ux-y-mockups.md) sube
      a MAJOR y su mapa los cuelga de «Inversiones y retiros». **«Configuración» se queda con la
      auditoría y el respaldo**, y esos dos siguen sin pantalla ni clave
- [ ] **Los cuatro colores los pone el front.** El contrato manda cuatro claves sueltas y ninguna
      presentación, como pasa con los activos: son los de la tarjeta del Inicio, para que el reparto
      configurado y lo usado se lean como lo mismo. Se descartó pedirle a la API una presentación,
      que es contrato nuevo que nadie pidió
- [ ] **El historial no se pinta en ninguna parte.** El [RF-51](docs/03-requisitos-y-bdd.md#rf-51) pide conservarlo y el contrato no
      declara ninguna consulta que lo devuelva, así que no hay de dónde leerlo. Conviene mirar si al
      cambiar el reparto hace falta ver con qué venía, que es contrato nuevo
- [ ] **La suma se queda en un solo sitio, y es la base.** El panel manda los cuatro como se
      escribieron y lee el `42293` debajo del último sobre. Se descartó sumarlos antes de enviar, que
      ahorraría un viaje y pondría una regla de negocio en Flutter, y también pintar el total mientras
      se llena, que es la misma regla disfrazada de ayuda

**De la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2), el catálogo de productos, en su mitad API:**

- [ ] 🔒 **La vista previa del formulario es de la 5.2, y el precio sugerido de la [5.7](docs/08-plan-de-desarrollo.md#tarea-5-7).** El formulario
      del mockup pinta el costo, los márgenes y la lectura mientras se escribe, y sin la consulta la
      pantalla de la 5.2 no tendría de dónde sacarlos. `POST /api/v0/consultas/costeo` ya acepta y
      valida `margenObjetivo`, y `precioSugerido`, que el contrato deja ausente, llega con la 5.7
- [ ] **Editar un producto desactivado responde `40900`.** El contrato lo declara en la edición sin
      decir cuándo, y el único estado con el que choca guardar el formulario es estar fuera del
      catálogo: el panel del mockup solo ofrece reactivarlo. Se descartó editarlo en silencio, que
      dejaría un código acordado sin emitir nunca
- [ ] **Guardar agrega un costeo solo si cambió lo que el formulario trae de él**: el material, los
      consumibles, los minutos o el precio. Un pro-labore nuevo no reescribe costos por su cuenta, y
      corregir el nombre no congela otra tarifa. Si no hay costeo a la vista, cuenta como cambiado
- [ ] **`incluirInactivos` lo juzga la base, y a Operación no le cambia nada.** El contrato lo hace de
      solo Gerencia y no le da `40300` a la consulta, y `productos_lectura` le deja leer todo a
      Operación. La consulta pide `activo OR (? AND fn_es_gerencia())`: la bandera pesa solo para
      quien la política llama Gerencia, sin un `if` sobre el tipo
- [ ] **A Operación, crear y la vista previa le responden `40300` desde `fn_es_gerencia()`.** La
      tarifa sale de `prolabore_config`, que a Operación le responde vacío como si no hubiera
      pro-labore; sin la pregunta, la respuesta sería `40940`. Desactivar y reactivar no necesitan
      tarifa, y a ellos los detiene `productos_escritura`
- [ ] **El catálogo lleva lo que no está en el cuadro, y donde va lo decide la API**: primero el cuadro
      en el orden pedido, después lo que se vende sin costeo a la vista —todo, para Operación— y al
      final lo desactivado, con sus márgenes y sin lectura. «Por nombre» es con el orden del español
- [ ] **Los minutos de 10.000 o más no caben en `NUMERIC(6,2)` y salen como `50000`.** Ningún
      documento les pone techo, y el descriptor no puede anunciarlo sin cambiar el contrato: **o el
      contrato les da un máximo, o se acepta** que nadie tarda 166 horas en producir una unidad
- [ ] **Las restricciones del cotizador van por su clase en la tabla de traducción**, como toda
      restricción cuyo módulo no tiene API todavía: `no_vence_antes_de_emitirse` responde `42200` y
      no el `42281` de su contrato, y `aceptada_no_se_anula` tampoco el `40980`. Los pone la [8.8](docs/08-plan-de-desarrollo.md#tarea-8-8)

**De la 5.2, el catálogo de productos, en su mitad Front:**

- [ ] **Cargando, catálogo vacío y error de red se inventaron, porque el mockup no los dibuja.** Un
      indicador mientras no llega la lista, `AvisoDeLectura` con «Reintentar» cuando falla, y «Todavía
      no hay ningún producto en el catálogo.» cuando no hay ninguno. Esa frase es legítima —no es del
      catálogo de la API, como «Todavía no hay ninguna cuenta.»—, pero los tres hay que dibujarlos
- [ ] **La columna «Tiempo» se va con las de Gerencia, aunque el mockup la pinte para los dos.** Su
      `<th>` no lleva `data-ger`, pero `minutosTrabajo` vive **dentro** del costeo y a Operación no le
      llega ni una fila de `costos_producto`. Las dos salidas de verdad son ajustar el mockup o subir
      los minutos fuera del costeo, y ninguna es del trabajo del front
- [ ] **El deslizador del margen objetivo se mueve entre 20 y 80, y el contrato admite de 1 a 99.** Se
      tomó el rango del mockup, que es la pantalla aprobada. Si algún día se abre, la API ya lo
      acepta: no hay que tocar nada del otro lado
- [ ] 🔒 **La mitad Front del precio sugerido entró aquí sin tener tarea en el 08.** La [5.7](docs/08-plan-de-desarrollo.md#tarea-5-7) es del
      API y la palabra «sugerido» no aparece en el [08](docs/08-plan-de-desarrollo.md): sin esta decisión, el control que el mockup
      dibuja en este formulario no habría tenido dueño. Lo autorizó quien dirige
- [ ] **Los controles de escritura se pintan siempre, y el «no» lo dice la base.** El mockup marca
      «+ Nuevo producto», «Editar» y «Desactivar» como de Gerencia, y el front no tiene con qué
      distinguirlo. Se descartó atarlos a que haya cifras a la vista: con el catálogo vacío, Gerencia
      se quedaría sin poder crear el primero
- [ ] **El margen porcentual se pinta entero, y el contrato lo manda con dos decimales.** Esa es la
      precisión del dato y no la de la pantalla: el mockup lo redondea, y en ocho columnas los
      decimales sobran. El valor completo sigue llegando
- [ ] **El color del margen por hora sale del `nivel` de la lectura, no del umbral del mockup.** El
      mockup pinta en rojo por debajo de `$30.000`, un número que no está en ningún documento y que
      escrito en `lib/` sería una regla del front. Se mapean `critica` a rojo y `alta` a ámbar, y un
      nivel que esta versión no conozca se pinta neutro

**Del cuadro ordenable ([5.9](docs/08-plan-de-desarrollo.md#tarea-5-9)):**

- [ ] **El panel «Lo que revela el cuadro» no se pintó, porque el contrato no declara sus frases.**
      El mockup escribe dos hallazgos a mano; el contrato solo manda la `lectura` de cada producto,
      y escoger aquí cuáles subir a ese panel sería decidir en el front ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). Si el panel
      tiene que existir, sus frases las redacta la API en la respuesta del cuadro
- [ ] **La barra usa el verde cuando el nivel no pide color, y no tiene largo con el margen a
      pérdida.** El mockup la pinta roja o verde según el umbral de `$30.000` que el 5.2 ya descartó:
      aquí `critica` y `alta` tiñen como la cifra y lo demás va en verde. Su escala es el mayor margen
      por hora del cuadro, que es dibujo y no una cifra, como la del gráfico de la [6.4](docs/08-plan-de-desarrollo.md#tarea-6-4)
- [ ] **La primera consulta no manda `orden`, y las siguientes sí.** Sin él la API ya ordena por
      margen por hora, así que abrir la pantalla pide lo mismo que antes; una vez pulsado el botón,
      cada recarga repite el orden elegido para que guardar no devuelva la tabla al otro

**De la gestión de clientes (4.2):**

- [ ] **La pantalla de clientes se dibujó sin estar aprobada, y hay que aprobarla.** La regla es que
      nada se construye sin su pantalla aprobada, y la 4.2 no tenía ninguna: el [10](docs/10-ux-y-mockups.md) fija once
      pantallas y ninguna es «Clientes». Se decidió que **no son una pantalla sino un panel de
      Pedidos** —el menú lo dicta la API y ninguna de sus ocho claves se llama así— y se dibujó en
      el mockup para poder aprobarla. El [10](docs/10-ux-y-mockups.md) sube a MAJOR porque **invierte** lo que había: el
      cliente de «Nuevo pedido» era un campo de texto libre y ahora es un desplegable, que es lo que
      el contrato prometía desde la [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10).

      **El panel ya está montado y el dibujo sigue sin aprobar**, que es lo que hay que mirar antes
      de la [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3): lo construido es el panel, no el desplegable de «Nuevo pedido», que es de
      esa tarea
- [ ] 🔒 **La pantalla de Pedidos nació con un solo panel, y no esperó a la [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3).** El panel de
      clientes vive dentro de Pedidos, y Pedidos era la pantalla de la 4.3, que a su vez espera a la
      4.2: la espera era circular y el panel quedaba sin abrir. Se hizo lo que hizo la [7.3](docs/08-plan-de-desarrollo.md#tarea-7-3) con
      «Inversiones y retiros», que abrió con el pro-labore solo. **El panel queda donde va a vivir
      siempre**, así que la 4.3 agrega debajo y no rehace nada
- [x] **El front ya sabe si esta sesión puede anular un cliente, y lo sabe porque la API lo dice.**
      La navegación estrena `puedeAnularClientes` en el contrato `0.21.0`, que era la salida que esta
      casilla dejaba abierta. **Vale lo mismo que `puedeGestionarCuentas` —Gerencia y fuera de la
      vista previa— y se declara aparte**: reusar la otra ataría dos permisos sin relación, y el día
      que uno cambiara el otro se rompería en silencio. Se descartó también `puedeVerComoOperacion`,
      que sale del tipo real y seguiría en cierto justo cuando el botón tiene que desaparecer
- [ ] **Un pedido de un cliente anulado se sigue pudiendo modificar**, y su cliente vuelve al
      desplegable mientras esa ficha esté abierta, marcado como anulado. Ningún documento decía qué
      pasa ahí; sin eso, guardar le cambiaba el cliente al pedido por su cuenta

**Del arreglo de las etiquetas del esquema:**

- [ ] **Las etiquetas `esquema-vX.Y.Z` las pone la tubería, no una persona.** Es la respuesta a
      «quién etiqueta y cuándo», que quedó abierta en la [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7): a mano se saltaron ocho seguidas, y una
      sesión de Claude en la nube no puede ponerlas, porque recibe `403` al empujar una etiqueta
      aunque sí pueda empujar una rama. El flujo `etiquetas-del-esquema.yml` de `prisma_db` corre en
      cada empuje a `develop` con permiso de escritura, y es lo único de ese repositorio que lo tiene.
      **Si las reglas del repositorio no dejan escribir etiquetas a la tubería**, la primera corrida
      falla y lo dice
- [ ] **La etiqueta va sobre el commit más viejo de la primera línea de `develop` que tocó el
      `…_publica_version_X_Y_Z.sql`.** Es el commit con que se fusionó el PR, y da el mismo que eligió
      quien puso a mano las ocho etiquetas viejas que tienen ese archivo. Se descartó buscar sin
      `--first-parent`, que las pone en commits de las ramas de trabajo, y tomar el más nuevo, que
      movería la versión a la edición si alguien tocara una migración ya fusionada —lo que [C-05](docs/12-pruebas-y-calidad.md#c-05)
      prohíbe—. **Nunca mueve una etiqueta que ya existe**, aunque apunte a otro commit: moverla le
      cambiaría la base a quien ya la descargó, y si alguna estuviera mal se decide a mano

**De la corrección por contra-asiento ([3.10](docs/08-plan-de-desarrollo.md#tarea-3-10)):**

- [ ] **La ruta lleva dos ids y no uno, y el `corrigeAId` no entra al cuerpo.** `PUT
      /api/v0/movimientos/{id}/correccion/{correccionId}`: el primero es el movimiento que se
      corrige y el segundo el del contra-asiento, que lo genera quien corrige, como en cualquier
      registro ([ADR-020](docs/adr/ADR-020-idempotencia.md)). **Se descartó meterlo en el cuerpo**: el cuerpo de `PUT
      /api/v0/movimientos/{id}` **es** el formulario «movimiento», y el generador exige que cada
      campo del cuerpo sea un campo del formulario, así que `corrigeAId` obligaría a pintar una caja
      con un UUID. Con los dos en la ruta, el formulario no cambia: la pantalla de corregir, cuando
      se dibuje, pinta el mismo de registrar
- [ ] **La tarea se llevó una migración, así que su «Dónde» pasó de «API» a «Base, API».** El
      [CU-04](docs/02-casos-de-uso.md#cu-04) dice que corrige Gerencia, y `mov_insercion` dejaba registrar a los dos tipos: sin la
      política, ese «solo Gerencia» habría quedado en un `if` de la API, que es lo que el
      [ADR-006](docs/adr/ADR-006-rls-por-rol.md) prohíbe. Se escribió la migración primero y la API después, que es el orden del
      [ADR-025](docs/adr/ADR-025-cuatro-repositorios.md). **Conviene revisar si el 08 quería eso** o si la política era tarea aparte
- [ ] **Nada impide corregir un movimiento ya anulado.** Anular ya lo sacó de las cuentas, así que
      un contra-asiento encima lo restaría dos veces. Ningún documento escribe esa regla: el
      [04 §5.3](docs/04-modelo-de-datos.md#53-corrección-por-contra-asiento) solo dice que el original queda intacto, y el [CU-03](docs/02-casos-de-uso.md#cu-03) A3 pone al contra-asiento
      como la salida cuando **no** se puede anular. **Decidido: no se inventa aquí.** Si hay que
      prohibirlo, es un `CHECK` o un trigger en la base y una tarea de Base, no un `if` de la API
- [ ] **La corrección no anula el original, y el libro no los junta todavía.** Los dos movimientos
      se leen como dos filas, y la fila abierta no dice «corregido por» ni «corrige a». El
      `corrige_a_id` está en la base desde el esquema inicial y la consulta del libro no lo trae:
      cuando haya pantalla de corregir ([§9](#9-a-vigilar)), es lo primero que va a hacer falta

**De las tablas del cotizador ([8.12](docs/08-plan-de-desarrollo.md#tarea-8-12)):**

- [x] **La mitad de `productos` está cerrada; la de `pedidos` sigue abierta.** El contrato le da a
      `pedidos` una anulación de «solo Gerencia» con `40300`, y a `productos` el alta, la edición, la
      desactivación y la reactivación, también de solo Gerencia; y ninguna de las dos llevaba RLS. Es
      la pregunta que el [§9](#9-a-vigilar) dejó abierta con la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10). **La de `productos` la resolvió la
      [5.11](docs/08-plan-de-desarrollo.md#tarea-5-11)**, que entró al plan justo por esto: la tenía delante la [5.2](docs/08-plan-de-desarrollo.md#tarea-5-2), que construye el
      catálogo, y sin política la habría resuelto con un `if` de la API, que el [ADR-006](docs/adr/ADR-006-rls-por-rol.md) prohíbe. **La
      de `pedidos` sigue sin tarea y es una migración de Base**, y la necesitará la [4.9](docs/08-plan-de-desarrollo.md#tarea-4-9), que es la
      que cancela un pedido
- [ ] **Las dos del cotizador llevan RLS, aunque el [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) las pusiera entre las que no.** Ese texto
      es de antes del contrato de la [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11), que hizo de la anulación algo de solo Gerencia. Se
      tomó la salida de la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10) —política, no `if`— y el 04 ya lo cuenta así
- [ ] **Aceptar es una política propia, y Operación recibe `42501` al anular.** Dos políticas de
      `UPDATE` que PostgreSQL suma con `OR`: la de aceptar, de los dos tipos, va de vigente sin aceptar
      a aceptada sin anular, y la de anular es de Gerencia. **Lo que tiene que saber la [8.8](docs/08-plan-de-desarrollo.md#tarea-8-8)**: a
      Operación una aceptada o anulada no le aparece en un `SELECT … FOR UPDATE`, que pasa por las
      políticas de `UPDATE`, así que el `40980` y el `40981` salen de leer el estado antes, con una
      lectura normal
- [ ] **La base no impone tres reglas del contrato, y las sostiene la API como en el pedido**: que
      haya al menos una línea (`42280`), que el total sea la suma de las líneas y que una vencida no se
      acepte (`40981`). La tercera depende del día, y un `CHECK` con la fecha de hoy rechazaría al
      restaurar un respaldo la cotización que venció después de aceptarse. **El estado tampoco es
      columna**: se lee de `valida_hasta`, `pedido_id` y `anulado_en`
- [ ] **«Una cotización no se edita» la base lo sostiene a medias.** Las líneas no tienen política de
      `UPDATE`, así que no las cambia nadie; pero a Operación, en la misma sentencia en que acepta, nada
      le impide cambiar otra columna, porque RLS filtra filas y no columnas. No se puso un trigger que
      congele la fila porque ninguna tabla hermana lo tiene y la regla sigue aquí, en el [§10](#10-decisiones-de-construcción-que-conviene-revisar), desde la
      [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11). Si se quiere en la base, es una lista blanca como `tg_congelar_ficha_propia`
- [ ] **Aceptar toca tres tablas y no tiene función atómica.** Crea el pedido y sus líneas y marca la
      cotización, y el [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas) dice que lo que no puede quedar a medias vive en la base. La
      [8.8](docs/08-plan-de-desarrollo.md#tarea-8-8) lo haría en la única transacción de la petición, que ya es atómica; si se quiere como las
      otras cuatro, es una `fn_aceptar_cotizacion` con su tarea
- [ ] **Las líneas no guardan orden de renglón, igual que las del pedido.** Se leen en el orden que
      dé la base, y el PDF podría no repetir el orden en que se digitaron. Si importa, es una columna en
      las dos tablas de líneas
- [ ] **La semilla no trae ninguna cotización.** Ninguna prueba de permisos las lee todavía, y la que
      edita la verificación la escribe el propio informe. Cuando el cotizador tenga pantalla, dev puede
      querer una de ejemplo

**De `fn_anular_movimiento` ([3.20](docs/08-plan-de-desarrollo.md#tarea-3-20)):**

- [ ] **La venta que causó una entrega es un `ingreso` con `pedido_id`.** El [CU-03](docs/02-casos-de-uso.md#cu-03) A5 la nombra y
      ningún documento dice cómo se reconoce, y la función que entrega todavía no existe. Un ingreso
      ligado a un pedido no tiene otro origen, así que ninguno se anula: responde `40921`, también el
      de un pedido cancelado cuyo anticipo se volvió ingreso. Si la [4.5](docs/08-plan-de-desarrollo.md#tarea-4-5), que escribe `fn_entregar_pedido`, o la [4.9](docs/08-plan-de-desarrollo.md#tarea-4-9) escriben otros
      ingresos con pedido, la regla hay que afinarla
- [ ] **Un anticipo ya devengado tampoco se anula, aunque su pedido siga en `parcial`.** El A4
      habla del pedido entregado o cancelado; una entrega parcial ya lo volvió venta, que es la razón
      que da el A4. Responde el mismo `40920`
- [ ] **Un retiro sin `retiro_id` se anula solo, con su fila.** Uno escrito antes de la columna no
      sabe cuál es su otra mitad, y adivinarla por fecha y valor es peor que no hacerlo. Hoy no hay
      ninguno fuera de la semilla, que ya lleva el suyo
- [ ] **Operación recibe `42501` levantado por la función, y no el silencio de un `UPDATE` sin
      filas.** La función toma la fila con `FOR UPDATE`, que pasa por `mov_anulacion`; si la fila
      existe y la política la esconde, lo dice. No pregunta `fn_es_gerencia()` por su cuenta. Lo que
      no existe y lo ya anulado también son `RAISE`, para el `40400` y el `40900`
- [ ] **Es `SECURITY INVOKER`, aunque el `CLAUDE.md` de `prisma_db` diga que toda función es
      `SECURITY DEFINER`.** Lo manda el [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas), que es el documento de la regla: así RLS juzga cada
      fila con los permisos de quien llama. La regla del `CLAUDE.md` vale para las de trigger y las
      que tienen que saltarse RLS, y conviene que diga la excepción
- [ ] **El informe compara el texto de esos `RAISE`, y no solo el `P0001`.** El `AGENTS.md` de la base
      pide comparar el SQLSTATE y no el mensaje, porque el de PostgreSQL cambia con el idioma y la
      versión; estos textos los escribe la migración y son contrato con la API, y los siete «no» de la
      función comparten `P0001`. Sin el texto, el informe no distingue el adelanto descontado del mes
      cerrado

**De la entrada de la 3.25 al 08:**

- [ ] 🔒 **Entró una tarea nueva al plan, la [3.25](docs/08-plan-de-desarrollo.md#tarea-3-25), y el total pasa de 151 a 152.** La
      pidió quien dirige para agilizar y homogeneizar lo local. Lo que ya había —la imagen de la API,
      la receta del front y `supabase start`— no se levanta junto, y cada quien reparte sus puertos
      copiando a mano un `config.toml` que no se versiona ([21 §6.4](docs/21-trabajo-en-paralelo.md#64-ambientes))
- [ ] **La orquestación va en `prisma_db`, y no en la especificación ni en la API.** Quien dirige pidió
      el repositorio más idóneo ([§7](#7-decisiones-pendientes), decisión 16), y lo es por lo que ya hace: levanta la base
      local y guarda ese `config.toml`, así que lo difícil —Supabase con los puertos de cada copia—
      se queda donde ya vive. Su versión solo se mueve con las migraciones ([C-05](docs/12-pruebas-y-calidad.md#c-05)) y desde ahí no se
      despliega nada. La especificación es pública, su integración continua no construye código y
      dejaría de ser solo documentos y contrato; en la API o en el front, cada archivo nuevo pide
      versión, y la API tendría que conocer al front, que depende de ella y no al revés
- [ ] **En el [Sprint 3](docs/08-plan-de-desarrollo.md#sprint-3) y no en el roadmap**, adonde el [08 §6](docs/08-plan-de-desarrollo.md#6-backlog-priorizado) manda lo que surge. No agrega alcance al
      producto —no hay requisito detrás— y ninguna tarea pasa a depender de ella. La lleva Base aunque
      en ese sprint ya tenga la 3.18, la 3.19 y la 3.20, porque la orquestación vive en `prisma_db`
- [ ] **La receta de la base no es una imagen de PostgreSQL.** RLS lee `auth` y los roles de Supabase,
      el acceso pasa por GoTrue, los soportes por Storage y la purga por `pg_cron`: con otra base, lo
      que pasa en local fallaría en dev. La integración continua ya levanta Supabase con el CLI
      ([ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md)), y la pila local tiene que ser la misma

**Del dibujo del libro de movimientos:**

- [x] **El dibujo pide al contrato cosas que todavía no tiene**, y van en un MINOR antes de
      construir la mitad Front de la [3.8](docs/08-plan-de-desarrollo.md#tarea-3-8) y de la [3.9](docs/08-plan-de-desarrollo.md#tarea-3-9), porque el contrato se acuerda antes de
      implementarse ([21 §3.2](docs/21-trabajo-en-paralelo.md#32-contrato-acordado-y-contrato-generado-no-se-contradicen)):
      - **cómo se ve cada tipo**: el nombre que se lee, el color —uno de los cuatro que el [10 §3.1](docs/10-ux-y-mockups.md#31-color)
        deja para un tipo—, el grupo del filtro y lo que le hace a la utilidad, la caja y el
        patrimonio, que sale del [05 §2](docs/05-reglas-financieras.md#2-naturaleza-de-cada-movimiento), no se configura y da el signo del valor;
      - **el filtro por grupo** en `POST /api/v0/consultas/movimientos`, que hoy filtra por `tipos`;
      - **qué responde esa consulta a un rango sin una de sus fechas, o al revés**, y con qué
        mensaje: el libro pinta ese rechazo donde iría la tabla, y hoy el contrato no lo dice;
      - **las páginas**: hoy la consulta trae los `limite` más recientes y el `total`, pero no puede
        pedir la segunda página. Falta también el máximo por página, que la API lee de una
        variable de entorno y es 50 si no está, y el mes en curso, que es el de Bogotá;
      - **la bandera de Gerencia para «Anular» y «Ver anulados»**, como `puedeGestionarCuentas`: sin
        ella, el front tendría que mirar el tipo de la sesión;
      - **con qué registro va cada movimiento** —el pedido de un anticipo, el activo de una
        inversión—, que la fila abierta dice y el esquema `Movimiento` no trae;
      - **leer y editar cómo se ve cada tipo**;
      - **bajar un adjunto**, en base64 dentro del sobre como decidió la [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11), y quién puede verlo;
      - y que **anular arrastre al registro hermano**, que cambia la operación del `0.11.0`.

      **Lo acordó todo la tarea [3.17](docs/08-plan-de-desarrollo.md#tarea-3-17)**, en un solo MINOR: el `v0.19.0`.
- [ ] **Y a la base, una tabla y una función; políticas nuevas, ninguna.** La tabla es la de cómo
      se ve cada tipo, `presentacion_tipos`, con lo que el libro ya pintaba, su RLS —la leen los dos
      tipos y la cambia Gerencia—, su trigger de auditoría y sus restricciones con nombre ([04 §4.13](docs/04-modelo-de-datos.md#413-cómo-se-ve-cada-tipo-de-movimiento)).
      **Las políticas no hacen falta**: las cuatro tablas ya dejan a Gerencia anular su fila.
      `activos` y `aportes_retiros` tienen sus políticas `FOR ALL`, `adelantos` tiene
      `adelantos_actualizacion` y `anticipos` no lleva RLS. Lo que falta es anular los dos en una
      sola transacción, que el [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas) manda hacer en la base, y que la tabla nueva se pueda auditar,
      que pide arreglar antes `fn_auditar`. Son las tareas [3.18](docs/08-plan-de-desarrollo.md#tarea-3-18), [3.19](docs/08-plan-de-desarrollo.md#tarea-3-19) y [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20)
- [x] **Hay reglas que ningún documento escribe todavía, y el dibujo no las decide.** No se sabe
      qué pasa al anular el anticipo de un pedido ya entregado, un adelanto ya descontado en una
      nómina liquidada o una de las dos mitades de un retiro partido en pro-labore y distribución.
      Y el [CU-03](docs/02-casos-de-uso.md#cu-03) A3 dice que en un mes cerrado no se anula, sino que se corrige con un
      contra-asiento, así que la API tendrá que decir fila por fila cuál de las dos acciones
      ofrece. Con el cierre mensual ([6.8](docs/08-plan-de-desarrollo.md#tarea-6-8)) ya hecho, un mes se puede cerrar.
      Al escribir las tareas salieron **dos casos más**: el pago de una nómina, cuya fila de
      `nomina_detalle` no tiene columnas de anulación, y el ingreso con que se causó la venta de un
      pedido entregado. **Las reglas las propone el contrato de la tarea [3.17](docs/08-plan-de-desarrollo.md#tarea-3-17) y las aprueba quien
      dirige al revisarlo**, como el contrato de capital decidió cómo se parte un retiro cuando nadie
      lo dice. Quedan escritas en el [CU-03](docs/02-casos-de-uso.md#cu-03) antes de que la [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20) las imponga. Se descartó una
      tarea de Decisión aparte, que habría detenido el contrato igual
- [x] **Las reglas las aprobó quien dirige el 2026-09-23** y están en el [CU-03](docs/02-casos-de-uso.md#cu-03), A4 a A8: el
      anticipo de un pedido en proceso, un activo, un aporte y un adelanto sin descontar se anulan
      con su movimiento; **un retiro partido se anula entero**, las dos mitades, porque anular una
      sola cambiaría cuánto fue pro-labore sin que la regla del mes lo decidiera; y el anticipo de
      un pedido entregado o cancelado, la venta de una entrega, un adelanto ya descontado y el pago
      de una nómina **no se anulan**, y se corrigen con contra-asiento. Se descartó anular en
      cascada la entrega o la liquidación: tienen su propia pantalla y su propio flujo
- [ ] **Los cuatro rechazos son 409 y no 422**, `40920` a `40923`: no es un dato mal escrito sino el
      estado del registro, como `40932`. Estrenan el 409 del rango de movimientos. **El mes cerrado
      reutiliza `40960 MES_YA_CERRADO`** en vez de estrenar otro, con su «cuándo» ampliado: su
      mensaje, «Ese mes ya está cerrado», dice poco al anular, y la fila lo completa con `porQueNo`
- [x] **Para anular el retiro entero, la base tiene que saber cuáles son sus dos mitades.** El
      `Retiro` del contrato tiene un id y cada mitad es un movimiento con su fila de
      `aportes_retiros`, pero el [04 §4.6](docs/04-modelo-de-datos.md#46-inversiones-capital-y-pro-labore) no escribe ninguna columna que las una. Si la migración de capital
      no la trae, es un PR de base antes de la [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20), y una columna nueva son dos PR ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md))
- [x] **La columna entró en la misma [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20), y no en un PR antes**, porque así lo decidió quien dirige
      el 2026-09-23. Es `aportes_retiros.retiro_id`, el id del `PUT /api/v0/retiros/{id}`, nulable y
      sin llave foránea, porque el retiro no tiene tabla propia. Sigue siendo compatible con la API
      que corre, que no escribe `aportes_retiros`: la escribirá la [7.4](docs/08-plan-de-desarrollo.md#tarea-7-4), y ese es el segundo PR
      del [ADR-025](docs/adr/ADR-025-cuatro-repositorios.md). Se descartó una tarea nueva de base antes de la 3.20, que habría puesto un PR de una
      línea a esperar su turno
- [ ] **Sin `limite`, el libro trae el máximo por página y ya no todo.** Es un cambio de
      comportamiento dentro de un MINOR, y se aceptó porque ninguna pantalla pide todavía el libro:
      su mitad Front es la de la [3.8](docs/08-plan-de-desarrollo.md#tarea-3-8), que no está hecha. `limite` pasó a ser el tamaño de página en
      vez de estrenar `porPagina`, y uno por encima del máximo responde `42200` en vez de recortarse
      en silencio. **Lo mismo el rango**: `desde` sola ya no vale, y responde `42227`
- [ ] **La presentación del tipo viaja en cada fila y no una vez por página**, y la consulta de los
      nueve tipos es solo de Gerencia. Con 50 filas como máximo, repetirla cuesta poco y el front
      no cruza nada. Se descartó mandar los nueve en la página
- [ ] **Cada fila dice si se deja anular, además de la bandera de la página.** `puedeAnular` dice
      si quien mira es Gerencia; `sePuedeAnular` y `porQueNo`, si ese movimiento en concreto se deja.
      Es lo que el [CU-03](docs/02-casos-de-uso.md#cu-03) A3 pedía, fila por fila, y lo que evita que el botón falle al tocarlo
- [ ] **El `Documento` suma tres tipos de foto** para bajar el soporte, y es un enum de respuesta
      que crece. Se llamó adición compatible, como en el `0.15.0` y el `0.17.0`: un cliente que
      trate como error un tipo que no conoce es el que tiene que cambiar
- [x] **Las tareas entraron al 08 el 2026-09-23, con el dibujo ya aprobado**, y son ocho y no
      las cuatro que decía esta línea: el contrato ([3.17](docs/08-plan-de-desarrollo.md#tarea-3-17)), tres de Base ([3.18](docs/08-plan-de-desarrollo.md#tarea-3-18), [3.19](docs/08-plan-de-desarrollo.md#tarea-3-19) y
      [3.20](docs/08-plan-de-desarrollo.md#tarea-3-20)), tres de API ([3.21](docs/08-plan-de-desarrollo.md#tarea-3-21), [3.22](docs/08-plan-de-desarrollo.md#tarea-3-22) y [3.23](docs/08-plan-de-desarrollo.md#tarea-3-23)) y el bloque de Gerencia ([3.24](docs/08-plan-de-desarrollo.md#tarea-3-24)). La [3.8](docs/08-plan-de-desarrollo.md#tarea-3-8) y la
      [3.9](docs/08-plan-de-desarrollo.md#tarea-3-9) ya no se marcan como que pueden empezar hoy: la 3.8 espera a la 3.21, y la 3.9 a
      la 3.8 y a la 3.23. El requisito es [RF-104](docs/03-requisitos-y-bdd.md#rf-104), en el [03](docs/03-requisitos-y-bdd.md), y la tabla, `presentacion_tipos`
- [ ] **Son ocho tareas y no cuatro, y la anulación va por su cuenta.** Con una sola tarea de API,
      el libro habría esperado también a que se decidieran las reglas de la anulación, que nada
      tienen que ver con pintar una tabla, y habrían sido cuatro días en un commit. La tabla nueva,
      además, necesita antes el arreglo de `fn_auditar`. Se descartó partir también el contrato: sus
      dos mitades serían del mismo sitio y del mismo sprint, así que no irían a la vez
- [ ] **Anular arrastra desde una función de la base, y no con dos `UPDATE` desde la API**, porque
      el [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas) lo pide para todo lo que toca varias tablas y no puede quedar a medias. Anula
      primero el movimiento, para que `mov_anulacion` juzgue antes de tocar nada más
- [ ] **`presentacion_tipos` se cambia en su sitio, como `cargos`**, y no con una fila por cambio
      como `sobres_config`: el libro pinta todo con la lectura de hoy, y no hay ninguna cifra que
      calcular con la de antes. Quién la cambió y cuándo lo guarda la bitácora
- [ ] **El nombre con que se lee un tipo va de 1 a 30 caracteres.** Ningún documento le ponía
      techo, y el mockup solo exige que no esté vacío. Treinta dejan holgura sobre el nombre más
      largo de los nueve tipos, «Transferencia entre cuentas», que tiene 27. **Lo confirma quien
      dirige**
- [ ] **[RF-104](docs/03-requisitos-y-bdd.md#rf-104) es S y no M**: sin él el sistema sigue respondiendo las tres preguntas, que es lo
      que el [08 §6](docs/08-plan-de-desarrollo.md#6-backlog-priorizado) llama importante. La 3.8 no espera a lo que es S, así que negociarlo no
      frena el libro. **La prioridad la fija el [03](docs/03-requisitos-y-bdd.md), y la confirma quien dirige**
- [ ] **El 08, el 03, el 04 y este tablero subieron MINOR, como cada vez que entraron tareas al
      plan**, aunque el [22 §3](docs/22-documentacion.md#3-versiones) pone «un sprint cambia sus tareas» entre los ejemplos de MAJOR. Se
      siguió lo que se hizo con la 3.16, con las cuatro tareas de Base, con la 0.4 y con la 9.13:
      se agrega, y lo que había sigue valiendo. **Conviene decidir cuál de las dos lecturas vale** y
      escribirla en el [22](docs/22-documentacion.md)
- [ ] **El panel de confirmar de Pedidos salía apretado en una sola columna.** `abrirPanelFila()`
      le daba al panel tantas columnas como celdas tenía la fila, y la fila de acciones de un
      pedido es una sola celda: el panel de anular un pedido medía 303 px dentro de una tabla de
      970. Ahora cuenta las columnas que abarca la fila. Lo destapó el libro, que abre su panel
      desde una fila igual; es el único cambio de este PR fuera de Movimientos

**De la tarea [4.4](docs/08-plan-de-desarrollo.md#tarea-4-4):**

- [ ] **La ruta es parte de la tarea, aunque el 08 diga «caso de uso».** Los cuatro códigos que el
      contrato reserva para cobrar un anticipo —`40930`, `42230`, `42233` y `42234`— esperaban a la
      [4.4](docs/08-plan-de-desarrollo.md#tarea-4-4) para emitirse, y sin ruta un caso de uso no emite nada
- [ ] 🔒 **`estancado` ya se decide en el dominio, aunque el resaltado sea la [4.7](docs/08-plan-de-desarrollo.md#tarea-4-7).** La respuesta del
      cobro devuelve el pedido entero y el contrato exige el campo, así que un `false` fijo habría
      mentido con un pedido que lleva un mes esperando. La regla que se escribió: **el anticipo
      vigente más viejo tiene 15 días o más y el pedido no ha llegado a un estado final**. Una
      entrega parcial cuenta como sin entregar, como en `v_anticipos_por_devengar`, y ningún
      documento lo decía. La [4.7](docs/08-plan-de-desarrollo.md#tarea-4-7) la reusa en el listado y le queda la pantalla
- [ ] **El movimiento del anticipo lleva la descripción «Anticipo del pedido P-…».** El esquema
      `Movimiento` del libro no trae el pedido, así que sin texto una fila de anticipo no dice de qué
      es. Ningún documento lo pedía; si el libro llega a enseñar el pedido, sobra
- [ ] **El cero y los negativos responden `42230` y no `42200`**, porque así lo acordó el contrato.
      Por eso el formulario «anticipo» no declara mínimo para el valor, a diferencia de «movimiento»,
      y el front no lo puede atajar antes de enviar
- [ ] **La suma de los anticipos no la impone la base.** Que no pase del valor del pedido lo comprueba
      la API, y lo hace a salvo de dos cobros a la vez porque lee el pedido con `FOR UPDATE`. Pero un
      `INSERT` que se saltara la API pasaría: es media regla del [ADR-015](docs/adr/ADR-015-validacion-tres-capas.md). **Conviene decidir si una
      tarea de Base le pone un trigger**, con su código en la tabla de traducción
- [ ] **Los renglones de un pedido salen ordenados por su id.** `pedido_lineas` no tiene ninguna
      columna que guarde el orden en que se escribieron, así que por id es por lo menos el mismo en
      cada lectura. La [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3), que es la que los crea, puede necesitarla
- [ ] **El formulario «anticipo» no tiene pantalla en el mockup.** El 10 pone «Cobrar anticipo» bajo
      el detalle del pedido y el prototipo solo pinta el anticipo dentro del pedido nuevo, así que las
      etiquetas y la ayuda —valor, cuenta y fecha, con «hoy viene puesta»— salen del [CU-06](docs/02-casos-de-uso.md#cu-06) y del
      contrato, no de una pantalla aprobada

**Del arreglo de las lecturas rechazadas:**

- [ ] **El texto de «sin respuesta» no es el mismo en todas las pantallas, y el 10 solo da el de
      Acceso.** El [10 §5.1](docs/10-ux-y-mockups.md#51-acceso) escribe «No se pudo conectar con el servidor. Revisa tu conexión e
      intenta de nuevo.» para cuando los campos de acceso no llegan, y el front lo usa ahí y en el
      formulario de la contraseña. «Gestión de usuarios», el panel de cuentas y categorías, el
      registro rápido y los desplegables dicen otra cosa, que no está en ningún documento: «No se
      pudo hablar con el servidor. Revisa la conexión y vuelve a intentarlo.», con sus variantes para
      la lista —«No se pudo cargar la lista…»— y para las opciones —«No se pudieron cargar las
      opciones…»—. Con el de «no llegó el formulario» pasa lo mismo: el 10 dice «No se pudo cargar el
      formulario. Intenta de nuevo en un momento.» y las otras pantallas «El servidor respondió, pero
      no mandó el formulario…». **Conviene decidir si los textos del [10 §5.1](docs/10-ux-y-mockups.md#51-acceso) valen para toda la
      aplicación** —y entonces el front tiene uno de cada uno— o si cada pantalla necesita el suyo en
      el 10. Este arreglo no cambió ninguna redacción: cada pantalla le pasa su texto al aviso, así
      que unificarlos es cambiar una constante
- [ ] **Una lectura rechazada se pinta con el mensaje del sobre, y ya no se lee como falta de red.**
      Las seis lecturas que traen una lista —personas, cargos, bitácora, cuentas, categorías y las
      opciones de un desplegable— devolvían `null` para todo lo que no fuera un éxito, y por eso el
      `404` de la API vieja de dev, el que cuenta el bloque de GoTrue más abajo, se leía «No se pudo
      hablar con el servidor». Lo que llega sin la forma del contrato —la página de un proxy, o un
      éxito con datos que no se dejan leer— **reusa el aviso que el front ya tenía para eso**: «El
      servidor respondió algo que esta versión no entiende. Intenta de nuevo.», el de la sesión que
      no se puede leer (tarea [2.6](docs/08-plan-de-desarrollo.md#tarea-2-6)). Se descartaron el de «sin respuesta», que es el que confundía, y
      uno nuevo para las listas, que sería otro texto del front sin documento
- [ ] **«Reintentar» se queda también ante un rechazo**, como estaba. La navegación no lo ofrece,
      porque ahí el rechazo es un `40302` que no cambia reintentando; aquí el caso que lo destapó es
      una API vieja, y la ruta que le falta llega con el despliegue siguiente: el botón la trae sin
      recargar la página

**Del arreglo de GoTrue en la tubería:**

- [ ] **Las dos rojas de GoTrue no eran el `config.toml`: era la versión de GoTrue.** Lo que se anotó
      en la primera corrida de la tubería, la de la tarea [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7) —que faltaba escribir
      `minimum_password_length`, y que la etiqueta que lo llevara las pondría verdes— no se cumplió: la etiqueta
      `esquema-v0.9.0` ya lleva el 6, y `GoTrueIntegracionTest` siguió con las mismas dos rojas en
      cada corrida de `develop`. **La v2.196.0 de GoTrue no mira la clave mínima en el alta por
      administración**, y es la que trae la última versión publicada del CLI de Supabase; la v2.197.0
      es la primera que la exige, y es la que corre dev. En esta máquina las dos pasaban porque
      `supabase link` deja fijada la versión del proyecto remoto en `supabase/.temp/gotrue-version`.
      **Decidido: la tubería escribe ahí la versión de la nube** antes de `supabase start`, y después
      comprueba que es la que quedó corriendo. Solo GoTrue: Postgres, PostgREST y Storage también van
      distintos de lo que fijó el vínculo con la nube, pero hoy ninguna prueba cambia por eso. Se
      descartó tocar las pruebas, que dicen la verdad de lo que corre en dev. **El número va escrito
      a mano en el flujo, y hay que subirlo cuando Supabase actualice los proyectos**
- [ ] **Con `develop` en rojo, dev no se desplegó durante tres días y nada lo avisó.** Railway solo
      despliega con la integración continua en verde ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)), así que la API de dev se quedó en la
      0.5.1, la del 2026-09-19, mientras el front de dev iba en la 0.11.0. En «Gestión de usuarios»,
      la bitácora y el catálogo de cargos le pedían rutas que esa API no tenía: respondía 404 con su
      sobre, y la pantalla decía «No se pudo hablar con el servidor». En esos tres días entraron
      veinte fusiones con «Probar contra la base» en rojo. **Conviene decidir si ese trabajo pasa a
      ser obligatorio para fusionar**, con una regla de protección de `develop`: una roja que se deja
      pasar enseña a ignorar el rojo, y esta dejó a dev con una API vieja sin que nadie lo viera

**De la 3.9, la anulación con motivo:**

- [x] **La tarea entró en dos pasos, y el botón fue el segundo.** El 08 le da «API, Front»,
      pero el botón de anular vive dentro de la tabla del libro, que es la 3.8, y cuando se entregó
      la API `mockup/` tenía escrita la regla y **no la pantalla**. **Fue la misma 3.9 en dos PR**,
      no una tarea nueva del 08: la API primero, y el botón después, con la pantalla de la 3.8 ya
      construida. Lo que el dibujo le sumó a su mitad API —que anular arrastre al registro
      hermano— es la tarea [3.23](docs/08-plan-de-desarrollo.md#tarea-3-23), que entró antes que el botón
- [ ] **La anulación no entra en la bitácora de cambios reversibles.** Los eventos de
      `EventoDeBitacora` son de usuarios y cargos, y agregar uno de movimiento pediría un ámbito
      nuevo y un valor nuevo del ENUM de la base, o sea una migración y dos PR. **Ningún documento
      pide que anular sea reversible**: el [04 §5.3](docs/04-modelo-de-datos.md#53-corrección-por-contra-asiento) dice lo contrario, que lo que haya que corregir
      va por contra-asiento. La huella queda igual, porque **la auditoría la escribe el trigger**
      con su acción propia `ANULAR` ([ADR-005](docs/adr/ADR-005-auditoria-por-triggers.md))
- [ ] **`anulado_dispositivo` y `anulado_ip` se quedan vacías.** [RN-13](docs/03-requisitos-y-bdd.md#rn-13) pide motivo, autor, fecha
      **y dispositivo**, y las columnas existen en la tabla desde el principio; pero ni el contrato
      declara de dónde saldría el dispositivo ni la petición lo trae, y la IP no la ve la API detrás
      del proxy. Se escriben las tres que sí se tienen y **no se inventa la cuarta**. Queda para
      quien dirige: o el contrato lo declara, o [RN-13](docs/03-requisitos-y-bdd.md#rn-13) se ajusta a lo que de verdad se guarda

**Del arreglo de Storage en la tubería:**

- [ ] **La tubería no levantaba el servicio que la 3.6 encendió, y se supo contando las rojas.** El
      flujo de la API excluía `storage-api` de `supabase start` desde la 1.7, con un comentario que
      decía la verdad de entonces: que ninguna prueba lo miraba. La 3.6 encendió
      `[storage] enabled = true` en `prisma_db` —para que el techo del bucket y sus cuatro tipos se
      pudieran comprobar de verdad— y escribió las primeras pruebas que sí lo miran; el flujo se
      quedó con la lista vieja. Sin nadie detrás de `/storage/v1` el gateway contesta **503**, y las
      cuatro de `SoportesIntegracionTest` caen con `ProveedorNoDisponible`. **Decidido: sale de la
      lista de exclusión**, que es una línea. Marcarlas como «solo en esta máquina» habría dejado
      sin cubrir en la tubería justo la mitad del [ADR-015](docs/adr/ADR-015-validacion-tres-capas.md) que la 3.6 vino a comprobar, y es el mismo
      error que la 1.7 ya pagó con las dos de GoTrue. `imgproxy` sigue fuera: solo transforma
      imágenes, que ninguna prueba pide, y Storage arranca sano sin él
- [ ] **Dos pruebas llevaban desde la 3.6 en verde sin comprobar nada, y eso no se veía.** Las del
      bucket que se defiende solo afirman que la respuesta **no es 200** y que el objeto no quedó en
      `storage.objects`: con el servicio apagado, el 503 cumple lo primero y no haber subido nada
      cumple lo segundo. Pasaban igual si el bucket no tuviera ni techo ni tipos, que es justo lo
      que el [ADR-015](docs/adr/ADR-015-validacion-tres-capas.md) les manda vigilar. Se comprobó parando el contenedor: las cuatro rojas y esas
      dos verdes. Con el servicio arriba vuelven a comprobar lo que dicen, y con eso basta para este
      arreglo; **queda por decidir si además deben exigir un código concreto** en vez de «cualquier
      cosa que no sea 200». Eso ya es cambiar una prueba y no entra en un arreglo suelto
**De la [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12), los saldos por cuenta:**

- [ ] **El `40300` lo decide `fn_es_gerencia()`, y no un `if` sobre el tipo de usuario.** El acordado
      dice que los saldos los niega la API y no la base, porque salen del libro y el libro lo leen
      los dos tipos; y la API no decide permisos. Las dos cosas se cumplen preguntándole a la base con
      la función de sus trece políticas: el adaptador corre `SELECT fn_es_gerencia()` en la
      transacción de la petición y traduce el `false` a `SinPermiso`, como un `42501`. La API sigue
      sin mirar de qué tipo es nadie, y el día que la base sepa negar los saldos sola, se borra esa
      pregunta. El patrimonio y el tablero, que tienen la misma decisión pendiente, pueden ir igual
- [ ] **La cifra que manda es la del dominio, y `v_saldos_cuenta` es la segunda opinión.** Es el
      [04 §6](docs/04-modelo-de-datos.md#6-vistas-de-cálculo-financiero) al pie de la letra, y evita escribir la clasificación de los nueve tipos por
      segunda vez, que ya se desincronizó una vez ([3.15](docs/08-plan-de-desarrollo.md#tarea-3-15)). La vista no se toca: una prueba de
      integración enfrenta las dos fila por fila, también después de transferir y de anular
- [ ] **La copia fijada del contrato declara `0.18.0` con 30 de 86 rutas, y así queda la regla**: el
      número dice de qué versión del acordado sale cada letra de la copia —la más nueva de la que
      trae texto—, y la cobertura la dice `contrato/README.md` de la API. La operación de saldos solo
      existe desde el `0.17.0` y la descripción del adjunto de la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) ya era del `0.18.0`, así que
      quedarse en `0.16.0` era falso en dos sitios. Responde lo que dejaron abierto la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10) y la
      3.6, más abajo
- [ ] **`40302` está declarado y no se emite**, igual que en `/consultas/cuentas`: saber si alguien
      entró con la clave temporal pide leer su ficha, y ninguna consulta lo hace salvo la navegación
- [ ] **Una cuenta anulada no sale, y su plata tampoco está en el total.** El contrato pide «las
      cuentas sin anular» y la vista hace lo mismo. Que esa plata desaparezca de la caja es del
      modelo: anular una cuenta todavía no tiene ni pantalla ni operación
- [ ] **Cada consulta lee el libro vigente entero**, ocho columnas y sin `JOIN`. Hoy son pocas filas;
      el día que pese, lo que hay que traer es el corte del cierre mensual (`cierres_mensuales`), y
      se cambia un método detrás del puerto sin tocar ni el dominio ni el contrato

**Del arreglo de las conexiones de las pruebas:**

- [ ] **Las pruebas que caían al correr la suite entera no eran cosa de GoTrue ni de la semilla: la
      suite agotaba las conexiones de la base.** Cada clase de integración levanta su propio
      contexto de Spring —el `@DynamicPropertySource` de la clase entra en la llave con la que
      Spring los cachea, así que dos clases no comparten nada—, quince al medirlo, y un contexto
      cacheado no se cierra hasta que termina el JVM. Cada uno traía el `maximum-pool-size` de
      producción y, sin `minimum-idle`, que Hikari iguala al máximo, sostenía diez conexiones aunque
      su clase hubiera terminado hacía medio minuto. Medido con `pg_stat_activity`, pico de 104
      conexiones —96 de ellas ociosas— contra las 64 que la base local deja libres. Pasado el techo,
      PostgreSQL responde `remaining connection slots are reserved…` y el pool que la pedía se cae
      entero antes de su primera consulta, así que **cuál prueba se pone roja depende del orden y
      del instante**: 4, 10 y 3 en tres corridas seguidas, y aislada no falla ninguna. El síntoma
      era un `50000` con `data` en null al entrar
- [ ] **Se acotó el arnés y no se tocó ninguna prueba.** `minimum-idle` en 1, como propiedad del
      sistema en la tarea de Gradle y no en el `application.yml`, que viajaría al artefacto y le
      pondría a producción un pool dimensionado para que quepan quince contextos de prueba. Un
      contexto parado pasa a sostener una conexión y no diez, así que el total crece de a una por
      clase nueva. **El máximo se queda en el de producción**, para que ninguna prueba cambie de
      concurrencia por esto
- [ ] **Queda sin hacer la raíz: un contexto por clase para atender una petición a la vez.** Que
      todas compartan uno arreglaría el consumo de frente y dejaría la suite mucho más rápida, pero
      toca cada clase y cambia qué cableado ve cada prueba. No es trabajo de un arreglo suelto:
      **hace falta decidir si entra como tarea del plan**

**De la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6), la foto del recibo:**

- [ ] ⚡ **El id del adjunto es la clave de idempotencia de la petición.** El [04 §4.12](docs/04-modelo-de-datos.md#412-adjuntos--el-soporte-de-un-movimiento-o-de-un-pedido) manda que lo
      ponga quien pide, al decidir la acción ([ADR-020](docs/adr/ADR-020-idempotencia.md)), y el contrato no le dio campo propio: el
      cuerpo es una sola parte binaria, así que la clave es lo único de esa intención que viaja. Con
      ella, dos intentos escriben el mismo objeto en la misma ruta, que es lo que `adjuntos_ruta_key`
      sostiene. Queda escrito en la descripción de la operación, en el contrato `0.18.0`
- [ ] **La foto se encoge a 1600 px de lado mayor y se sube como JPEG**, bajando la calidad de 0,82
      hasta 0,5 mientras no quepa. **Ningún documento dice a cuánto comprimir**: lo escrito es el
      techo de 5 MB. Mil seiscientos es lo que deja legible un recibo térmico, que es el papel
      difícil. **Lo confirma quien dirige.** El PDF no se toca: comprimirlo pediría entender su
      formato
- [ ] **La cola aprendió que una intención puede esperar a otra.** Registrar el movimiento y colgarle
      la foto son dos operaciones del contrato, y la segunda nombra el id de la primera; sin la
      espera, sin señal la foto saldría contra un id que la API no conoce y el `40400` la
      descartaría. Si a la primera la rechazan con motivo, la segunda queda rechazada con el mismo.
      **Le sirve igual a la factura del pedido** ([4.8](docs/08-plan-de-desarrollo.md#tarea-4-8))
- [ ] **Los bytes de la foto se guardan en la cola, en base64**, que ocupa un tercio más. Es lo que
      hace que sobreviva a cerrar la aplicación, y el almacén guarda texto para que la misma cola
      sirva en IndexedDB y en memoria ([17 §5.3](docs/17-resiliencia-offline-y-cache.md#53-la-foto-del-recibo-va-en-la-cola-con-sus-bytes))
- [ ] **El cuerpo multipart lo lee la API a mano, de los bytes que el filtro ya retuvo.** No se puede
      usar `MultipartFile`: el canal firmado hashea el cuerpo y la huella de idempotencia también,
      así que cuando el controlador corre el flujo ya se leyó y `getParts()` vería cero partes. El
      front lo arma igual de a mano, y por lo mismo: **la firma va sobre los bytes que de verdad
      viajan**
- [ ] **Retener el cuerpo pasó a tener techo: 6 MB.** Son los 5 del adjunto más el sobre multipart.
      Sin él, una petición con sesión podía pedirle a la API que se guardara en memoria lo que
      quisiera. Por encima responde `40020` si venía como archivo y `40000` si no
- [ ] **`adjuntos_movimiento_id_fkey` responde `40400` y no el `42200` de su clase.** Colgar un
      soporte de un movimiento que no existe es que no se encontró lo que se buscaba, y el contrato
      de la operación ya prometía ese código. Es la única foránea de las cuarenta y siete que no
      lleva el transversal
- [ ] **`prisma.contrato.version` se queda en `0.16.0` con el acordado en `0.18.0`.** La API
      implementa lo que esta versión agrega, pero no los reportes del `0.17.0`, así que declarar
      `0.18.0` afirmaría algo falso. **Sigue sin estar escrito** qué número declara un artefacto que
      implementa partes sueltas de dos versiones: es la misma decisión que quedó anotada en la
      [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10), y van dos veces. **La respondió la [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12)**, más arriba
- [ ] **La pila local levanta Storage desde esta tarea** (`[storage] enabled = true`). Sin el
      servicio, el techo del bucket y sus cuatro tipos solo se podían comprobar leyendo
      `storage.buckets`: se veía la configuración y nunca el comportamiento
- [ ] **La prueba de integración usa la clave de servicio para una sola cosa**: retirar del bucket lo
      que ella subió. `storage.objects` no deja borrar por SQL y el bucket no tiene política de
      borrado ([ADR-004](docs/adr/ADR-004-base-solo-escritura.md)), así que no hay otra forma de dejar la máquina como estaba. Es lo mismo
      que ya hace la prueba de GoTrue con las identidades que crea

**Del [Sprint 0](docs/08-plan-de-desarrollo.md#sprint-0):**

- [ ] Los errores 405, 406 y 415 responden 400 con el código `40000`
- [ ] `@PendienteDeEmitir` marca en el catálogo los códigos que todavía nadie emite
- [ ] El catálogo de códigos va dentro del OpenAPI, en `x-prisma-codigos`
- [ ] La pantalla de versión incompatible tiene tres filas de versiones y no las dos del mockup
- [ ] Se siguió el texto del mockup y no el literal del escenario [BDD-101-1](docs/03-requisitos-y-bdd.md#bdd-101-1)

**De poner dev en línea ([ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md)):**

- [ ] **Dev construye desde el repositorio y no promueve una imagen**, que es lo contrario de lo que
      pide [19 §2.3](docs/19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye). Cumplirlo pide publicar la imagen en un registro desde la integración continua
      y que el alojamiento despliegue esa etiqueta; es trabajo de la promoción del [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9)
- [ ] **La API y el front quedan en dos dominios distintos**, por decisión de quien dirige. La cookie
      `prisma_renovacion` de la [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2) va a exigir `SameSite=None` y `allowCredentials=true` —hoy en
      `false` con su justificación escrita—, y `*.up.railway.app` está en la Public Suffix List, así
      que ni siendo subdominios hermanos la comparten. La alternativa era un dominio con `nginx`
      haciendo de proxy
- [ ] **Las contraseñas de la semilla quedan alcanzables desde internet.** Mientras sigan siendo las
      de la semilla, el enlace de dev no se comparte fuera de quien tenga que verlo. Cambiarlas en el
      proyecto dev es lo que cierra el riesgo
- [ ] El nivel de registro de `org.springframework.jdbc.core` en dev pasa a salir de `LOG_SQL`, con
      `INFO` por defecto: las consultas llevan adentro el correo sintético de cada persona, y dev ya
      no es solo una máquina
- [ ] La imagen que compila el front es `ghcr.io/cirruslabs/flutter`, fijada por versión. Es una
      dependencia de un tercero en tiempo de construcción; la alternativa sin terceros es clonar
      Flutter por git sobre Debian, más lenta
- [ ] El `railway.json` de cada repositorio guarda la sonda, su tiempo de espera y la política de
      reinicio. Son decisiones de entrega que hoy no describe ningún documento

**Del canal firmado ([ADR-021](docs/adr/ADR-021-canal-firmado.md)), y la 2.13 tiene que leer lo mismo:**

- [ ] **`sha256(cuerpo)` se escribe en hexadecimal minúsculo.** El [20 §6.2](docs/20-contrato-de-api.md#62-cómo-se-arma-la-firma) nombra el
      resumen pero no dice en qué base se escribe, y hay que elegir una o la firma no es
      reproducible. Se eligió hexadecimal porque es lo que imprime un `sha256sum`, así que una firma
      se puede rehacer a mano desde una terminal cuando haya que depurarla
- [ ] **La clave de firma se usa decodificada de Base64, no como texto.** Son los bytes que la API
      generó; firmar con las letras del Base64 sería firmar con otra clave —una que nadie eligió— y
      funcionaría igual de bien hasta el día en que el otro extremo decodificara
- [ ] 🔒 **El front firma aunque todavía nadie comprueba.** El filtro es la [2.13](docs/08-plan-de-desarrollo.md#tarea-2-13); hasta que exista,
      las cabeceras viajan y se ignoran. El orden inverso dejaría dev roto entre una tarea y la
      siguiente

**Del filtro de firma ([2.13](docs/08-plan-de-desarrollo.md#tarea-2-13)) y sus tablas ([2.20](docs/08-plan-de-desarrollo.md#tarea-2-20)):**

- [ ] **`sesiones` guarda el `sha256` del token, no el token.** El [20 §6](docs/20-contrato-de-api.md#6-el-canal-firmado) no dice dónde vive la
      clave de firma del lado del servidor, y había que elegir por dónde encontrarla. Con el resumen
      alcanza, y una copia de la tabla no entrega tokens con los que entrar
- [ ] **El `sub` sale de decodificar el token sin verificar su firma.** Toda consulta pasa por
      `ConIdentidad` ([ADR-012](docs/adr/ADR-012-identidad-a-postgres.md)), así que el filtro necesita un `sub` **antes** de poder buscar la
      sesión. No autentica a nadie: un `sub` falsificado encuentra la sesión de otra persona y la
      firma no cuadra igual, y el rechazo es `40101`. Verificar el token de verdad es la [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)
- [ ] **El filtro de firma no publica identidad**, aunque la averigua: no llama a
      `IdentidadDeLaPeticion.poner`. Hacerlo destrabaría de paso el registro de idempotencia, que
      hoy exige la cabecera sin anotar nada, pero eso es la [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2) con su contrato de cookie y su
      prueba, y meterla aquí sería meterla sin tarea
- [ ] **La purga de `sesiones` no la pide ningún documento.** Se agrega con el mismo criterio y el
      mismo rol que las otras dos: una clave de firma vencida no deja entrar, pero seguir
      guardándola es superficie de ataque a cambio de nada
- [ ] **La regla de arquitectura ganó una segunda envoltura**, `SesionesDelRecienAutenticado`.
      Abrir la transacción sigue siendo cosa de los filtros; la excepción del ingreso ya existía
      para leer la ficha y ahora hay que guardar la sesión en esa misma ruta exenta. Se enumera la
      clase, como la primera, en vez de abrirle la puerta al paquete
- [ ] **El contrato subió a `0.6.0` sin que cambiara ninguna operación.** Los tres códigos del canal
      firmado dejaron de llevar `pendienteDeEmitir`, que es un cambio del documento aunque no lo sea
      del comportamiento: la prueba [C-04](docs/12-pruebas-y-calidad.md#c-04) lo trata como cambio de contrato y obliga a pasar por aquí
- [ ] **El proveedor de identidad falso devolvía un vencimiento fijo** —`2026-09-17T15:00:00Z`— y
      pasó a ser relativo. Una fecha escrita a mano deja de ser futura al día siguiente de
      escribirla, y desde que la sesión se guarda, `sesiones_vence_despues` la rechaza. Lo
      encontraron las pruebas de integración, no la compilación: es el tipo de fallo que solo
      aparece contra una base de verdad
- [ ] **El vencimiento viaja como `OffsetDateTime` en UTC y no como `java.sql.Timestamp`**, que no
      lleva zona: contra un `TIMESTAMPTZ`, el valor guardado dependería del huso de la máquina que
      atienda la petición, y en `America/Bogota` son cinco horas sobre una ventana que dura una
- [ ] **La consulta de vigilancia del [16 §10.2](docs/16-base-de-datos-y-snapshots.md) sigue preguntando por una sola tabla**, aunque
      desde la [2.20](docs/08-plan-de-desarrollo.md#tarea-2-20) se purguen tres. Ampliarla es cambiar ese documento, no el guion de
      verificación, y no había tarea para hacerlo

**De la navegación dictada ([2.14](docs/08-plan-de-desarrollo.md#tarea-2-14)):**

- [ ] ⚡ **El [10 §2.1](docs/10-ux-y-mockups.md#21-navegación-por-rol) y el contrato no listan las mismas secciones.** El contrato fija ocho
      claves y el documento nombra además **«Configuración»** para Gerencia y **«Inicio»** y **«Mi
      desprendible»** para Operación, que no tienen ninguna. Se emiten las ocho del contrato, porque
      una clave que el front no conoce no se pinta. **Lo decide quien dirija**: o el 10 se pone al
      día, o el contrato gana dos claves
- [ ] 🔒 **El filtro de firma publica la identidad, y eso adelanta media [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2).** Se publica
      **después** de que el HMAC cuadre, nunca al leer el `sub`: el token no está verificado, pero
      una firma que cuadra sí autentica —solo quien tiene la clave de esa sesión puede producirla—.
      Lo demás de la [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2) —la expiración a 30 días, la cookie de renovación y el enrutamiento del
      front— llegó después, y está en el bloque de abajo
- [ ] **El código `40302` entra al catálogo de la API.** El contrato acordado lo tenía desde la
      [2.19](docs/08-plan-de-desarrollo.md#tarea-2-19) marcado como pendiente de la [2.1](docs/08-plan-de-desarrollo.md#tarea-2-1), que no lo emitió. Lo emite esta tarea: quien entró con
      la contraseña temporal no recibe menú
- [x] **La operación ya acepta `vista=operacion`** — lo cerró la [2.18](docs/08-plan-de-desarrollo.md#tarea-2-18). Estuvo declarado sin
      emitirse desde la [2.19](docs/08-plan-de-desarrollo.md#tarea-2-19), que es el error que esta misma lista tenía anotado para la cookie de
      renovación, y la copia fijada del contrato convergió hacia el acordado sin subirle la versión:
      no se declaró nada nuevo, se empezó a cumplir lo que ya estaba escrito
- [ ] **El menú pinta y no lleva a ninguna parte todavía.** Las pantallas de cada sección son de los
      sprints 3 a 8; la activa se marca y el contenido es un marcador de posición

**De la sesión de 30 días ([2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)):**

- [ ] ⚡ **Cerrar sesión no apaga la clave de firma, y el contrato dice que sí.** Se revoca la
      renovación en el proveedor y se vence la cookie, así que **nadie vuelve a entrar con ella**;
      pero el token de acceso que ya salió sigue sirviendo hasta que venza, como mucho una hora, y
      `sesiones` no admite `UPDATE` ni `DELETE` ([ADR-004](docs/adr/ADR-004-base-solo-escritura.md)), así que no hay dónde marcar esa fila.
      **Cerrarla del todo es una tarea de Base**, como lo fue la [2.20](docs/08-plan-de-desarrollo.md#tarea-2-20), y la decide quien dirija: o se
      agrega esa tarea, o el contrato se pone al día con lo que de verdad ocurre
- [ ] **La cookie lleva dentro el testigo de renovación del proveedor**, no una referencia a una
      fila. Es lo que evitó una migración: con una cookie opaca habría que ir actualizando la fila
      que apunta, y esta tabla no se actualiza. Es `HttpOnly`, así que el front no la lee —se
      comprobó en Chrome—, y lo que se guarda del lado del servidor sigue siendo solo el resumen del
      token
- [ ] **`SameSite=None` en vez del `Strict` que decía el contrato.** El front y la API viven en
      dominios distintos desde el [ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md) y `*.up.railway.app` está en la Public Suffix List: con
      `Strict` la cookie no viaja nunca. **Va con un dominio único y `nginx` de proxy volvería a ser
      `Strict`**, que es lo que ese mismo ADR dejó anotado como alternativa. Mientras tanto la API
      responde con credenciales permitidas, y eso obliga a que `ORIGENES_PERMITIDOS` nunca sea `*`
- [ ] **Un token vencido responde `40100` y ya no `40101`.** Antes, una petición perfectamente
      firmada con la sesión caducada recibía «tu firma no cuadra», y el front no tenía cómo saber
      que lo que tocaba era renovar. La fila de `sesiones` se lee ahora sin filtrar por vencimiento y
      es la base quien dice si sigue viva
- [ ] **Renovar dos veces seguidas devuelve la clave de firma guardada, no una nueva.** GoTrue tiene
      una ventana en la que reutiliza la sesión ya emitida —para que un reintento no deje a nadie
      fuera— y devuelve el mismo token; como la tabla no admite `UPDATE`, la clave recién generada no
      se guardaba y el cliente firmaba con una que la base no conocía. Lo encontró la prueba de
      integración, no la compilación
- [ ] **El `40302` solo lo emite la navegación.** Mientras `debeCambiarClave` siga puesto, el
      contrato dice que todo lo que no sea cambiar la clave, renovar, cerrar o pedir un formulario
      responde `40302`; hoy la única operación con sesión que lo comprueba es la navegación, que es
      la que decide qué se pinta. Cuando existan más habrá que decidir si esa regla vive en un filtro
- [x] **«Cambiar el tema» ya entró al menú de la sesión**, donde el [10 §5.3](docs/10-ux-y-mockups.md#53-la-sesión-en-el-topbar) lo lista y el
      mockup lo traía. Lo que faltaba era acordar dónde se guarda la preferencia, y queda en
      `localStorage`: es cómo se ve la pantalla, no un dato del negocio ni un secreto. Sin nada
      elegido se sigue al tema del sistema, igual que antes
- [ ] **El formulario «cambio-de-clave» estrena el mínimo en un campo de tipo `clave`.** El
      generador de descriptores solo admitía `@Size` en un texto, y el contrato pide ocho caracteres
      en una contraseña. Una contraseña se cuenta igual que un texto; lo único que su tipo cambia es
      que se pinta oculta

**Del contrato sin GET ([ADR-030](docs/adr/ADR-030-contrato-sin-get.md)):**

- [ ] La copia fijada de `prisma_api` declara el contrato `0.5.0` aunque solo sirva tres de sus 26 operaciones. Declara contra qué versión está escrita, no cuánto implementa; dejarla en `0.2.0` habría dado dos contratos distintos con el mismo número
- [ ] Las lecturas van a `POST /api/v0/consultas/<recurso>`, con `cargos/asignables` aplanado a `cargos-asignables`
- [ ] Las seis consultas sin datos que filtrar viajan sin cuerpo; solo bitácora, navegación y formularios lo llevan
- [ ] Las dos operaciones de sesión siguen exentas de `Idempotency-Key`, por la razón que ya tenían: no hay clave de firma todavía y su respuesta trae secretos
- [ ] La sonda del despliegue es `GET /actuator/health/readiness`, que ya existía y no es del contrato. `/version` nunca fue una sonda de salud: es el contrato de compatibilidad de [ADR-014](docs/adr/ADR-014-semver.md), y el documento [09](docs/09-plan-de-implantacion.md) decía lo contrario por error
- [ ] El prefijo `/api/v0` lo pone un `WebMvcConfigurer` sobre el paquete de los controladores, no cada anotación. Swagger, `/error` y Actuator quedan fuera

**Del proyecto dev de Supabase (tarea [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4)):**

- [ ] Supabase enciende RLS sola en cada tabla nueva de `public`, con un event trigger suyo,
      `ensure_rls`. Se apagó en las seis que [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) deja sin RLS a propósito, en una migración
      aparte: con RLS encendida y cero políticas habrían quedado mudas en cuanto exista el rol
      `prisma_api`
- [ ] Las cuatro vistas que nacieron sin `security_invoker` ya lo llevan, por el mismo motivo que
      [04 §5.6](docs/04-modelo-de-datos.md#56-la-bitácora-de-la-pantalla-es-una-vista-no-una-tabla-nueva) se lo exige a `v_bitacora_usuarios`. Hoy no cambia nada; el día que esas
      tablas restrinjan filas, la fuga habría sido silenciosa
- [x] **La Data API exponía `public`, y era más grande de lo que esta casilla decía.** No eran «las
      seis tablas sin RLS»: `anon` tenía `SELECT`, `INSERT` y `UPDATE` sobre **las veintiséis**, y la
      sonda con la clave anónima —que es pública por diseño— devolvía filas en las seis **y en
      `movimientos`**, porque su política `mov_lectura` es `USING (true)`. O sea, **el libro del
      taller entero**. Solo `usuarios` quedaba tapada. Se cerró el 2026-09-19 con las dos cosas que
      hacían falta: `db_schema` pasó a vacío en dev y en qa —PostgREST contesta ahora `503
      PGRST002`— y entró al plan la [1.21](docs/08-plan-de-desarrollo.md#tarea-1-21), **ya escrita**, que se lo revoca con una migración ([04 §9.1](docs/04-modelo-de-datos.md#91-anon-no-toca-nada)),
      porque una casilla de consola no viaja a uat ni a prod
- [ ] El proyecto firma los JWT con clave asimétrica **ES256**, no con un secreto compartido:
      `SUPABASE_JWT_SECRET` va vacío y la verificación del token ([2.1](docs/08-plan-de-desarrollo.md#tarea-2-1)) tendrá que ir contra el
      JWKS del proyecto
- [ ] Las claves `anon` y `service_role` son las heredadas, y Supabase las retira a finales de
      2026: antes del go-live hay que pasar a las publicables y secretas
- [ ] La semilla necesitó `SET search_path = public, extensions`, porque `pgcrypto` no vive en
      `public` y sin eso `gen_salt()` no existe
- [ ] El `.env` de la API lo carga `spring.config.import`, que no estaba en ninguna parte: hasta
      ahora el archivo se llenaba y no lo leía nadie

**De las tareas [0.5](docs/08-plan-de-desarrollo.md#tarea-0-5) y [0.10](docs/08-plan-de-desarrollo.md#tarea-0-10):**

- [ ] **La contraseña del rol `prisma_api` no está en la migración.** [04 §9](docs/04-modelo-de-datos.md#9-el-rol-con-el-que-se-conecta-la-api) la escribe como
      `:'clave_prisma_api'`, que es sintaxis de `psql` y no existe dentro de un archivo de
      migración, y este repositorio es público. El rol nace sin contraseña —con `LOGIN` y sin
      contraseña no autentica— y se le fija la suya por ambiente, desde fuera
- [ ] Esa migración tampoco puede reafirmar `NOSUPERUSER` ni `NOBYPASSRLS` con un `ALTER ROLE`:
      cambiar esos dos atributos exige ser superusuario, y el rol con el que Supabase aplica las
      migraciones no lo es. Quedan fijados en el `CREATE ROLE`, y la verificación los comprueba
- [ ] **`schema_version` no la describe ningún documento.** La nombran [ADR-014](docs/adr/ADR-014-semver.md), [19 §4.1](docs/19-ambientes-y-entrega.md#41-tres-cosas-versionadas-por-separado) y el
      [RNF-23](docs/03-requisitos-y-bdd.md#rnf-23), pero ninguno dice qué columnas lleva. Se decidió un **histórico**: una fila por
      versión publicada, no un número que se pisa, que es lo coherente con [ADR-004](docs/adr/ADR-004-base-solo-escritura.md)
- [ ] **qa reusa el proyecto de Supabase que sobraba** en vez de crear uno nuevo, y su rol
      `prisma_api` queda sin contraseña hasta que algo apunte ahí

**De la tarea [1.5](docs/08-plan-de-desarrollo.md#tarea-1-5):**

- [ ] **`exportaciones` lleva `FORCE` aunque [04 §7.1](docs/04-modelo-de-datos.md#71-force-row-level-security-por-qué-ahora-sí-hace-falta) no la nombre** en su bloque SQL. Ese mismo
      párrafo dice «son catorce de las dieciséis tablas con RLS» y justifica solo dos exclusiones,
      `usuarios` y `auditoria`: sin `exportaciones` la lista se queda en trece. Se tomó por descuido
      de la lista y no por decisión
- [ ] `schema_version` se queda **sin** `FORCE`: es tabla técnica, no la describe el [04](docs/04-modelo-de-datos.md), su lectura
      es abierta y quien la escribe es el rol de migraciones

**De la tarea [1.6](docs/08-plan-de-desarrollo.md#tarea-1-6):**

- [ ] **Una transacción con identidad no se abre dentro de otra**, ni dentro de una transacción
      ajena: se rechaza. Unidas, el `SET LOCAL` de adentro seguiría vigente cuando el cuerpo ya
      terminó. [07 §7.2](docs/07-arquitectura.md#72-la-solución-obligatoria) dice «una transacción por petición» pero no qué pasa si se anidan
- [ ] Los claims llevan `sub` y `role: authenticated`, con la forma que ya usa `verificar-base.sql`, y
      nada más del token
- [ ] El `JdbcClient` se usa pero no se guarda: cada consulta se lo pide a `ConIdentidad.jdbc()`
- [ ] **La prueba de integración le pone a `prisma_api` una contraseña local** antes de empezar,
      conectada como el dueño, y se niega si la base no es de esta máquina. La migración deja ese rol
      sin contraseña a propósito
- [ ] `./gradlew integracion` no guarda estado ni usa la caché de Gradle: lo que mira es la base, que
      Gradle no ve como entrada
- [ ] El ejemplo de [07 §7.2](docs/07-arquitectura.md#72-la-solución-obligatoria) se corrigió: fijaba los claims con `jdbc.update`, y el controlador de
      PostgreSQL rechaza una actualización que devuelve filas

**De la tarea [2.6](docs/08-plan-de-desarrollo.md#tarea-2-6):**

- [ ] **El botón de mostrar va en los dos campos de clave**, y no solo en el primero como el mockup:
      el descriptor dice `clave` en `claveNueva` y en `repeticion`, y el renderizador no puede
      distinguirlos sin traerse una regla propia
- [ ] **Una contraseña no se recorta:** los espacios del principio y del final viajan tal cual. Un
      campo de texto sí se recorta, como hasta ahora
- [ ] `ClienteApi.enviarSinClave` existe solo para las dos rutas que el contrato exime de
      `Idempotency-Key`. El inicio de sesión tampoco pasa por la cola de pendientes: reintentar un
      ingreso sin red no significa nada
- [ ] **Tres avisos los escribe la pantalla**, porque no hay sobre del que sacarlos: no se pudo
      conectar, el servidor respondió algo que no se entiende y no se pudo cargar el formulario.
      Ninguno habla de una regla de negocio
- [ ] Un rechazo con errores por campo se pinta bajo su campo y no se repite arriba

**De las tareas [1.1](docs/08-plan-de-desarrollo.md#tarea-1-1) a [1.4](docs/08-plan-de-desarrollo.md#tarea-1-4):**

- [ ] **Los tres `CHECK` de `exportaciones` los bautizó el código.** El [13 §8](docs/13-respaldo-y-exportacion.md#8-tabla-de-registro) es el único sitio
      del proyecto que escribe restricciones sin nombre, y uno de los tres se llamaba
      `exportaciones_check`: un nombre que PostgreSQL numera **por posición** y que cambiaría con la
      siguiente restricción que entre a esa tabla. Se siguió el patrón del [04 §4.1](docs/04-modelo-de-datos.md#41-tipos-y-convenciones-comunes):
      `exportaciones_alcance_tipo_valido`, `exportaciones_formato_valido` y
      `manifiesto_salvo_en_pantalla`
- [ ] **`DELETE` y `TRUNCATE` se le revocaron también a `anon` y a `service_role`**, que [04 §5.1](docs/04-modelo-de-datos.md#51-revocación-real-del-borrado) no
      nombra. No fue precaución: con `anon` —clave pública, Data API abierta— se borró una fila de
      verdad y se vació `auditoria` entera con un `TRUNCATE`, que **no pasa por RLS**. `service_role`
      entra aunque sea el rol «administrador», por coherencia con [ADR-004](docs/adr/ADR-004-base-solo-escritura.md): la única excepción del
      modelo, la purga de claves vencidas, la corre el dueño
- [ ] **`schema_version` se queda en `0.1.0`** aunque el esquema haya cambiado. Ningún documento dice
      cuándo sube el SemVer del esquema; el precedente de la [1.5](docs/08-plan-de-desarrollo.md#tarea-1-5) es no moverlo, y `prisma_api`
      declara `0.1.0` en su configuración, que no puede viajar en el mismo commit ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md)). Cuándo y
      cómo se publica una versión nueva del esquema es lo que tiene que escribir la [1.12](docs/08-plan-de-desarrollo.md#tarea-1-12)
- [x] **Los docs [07](docs/07-arquitectura.md) y [12](docs/12-pruebas-y-calidad.md) nombraban una restricción `movimientos_valor_positivo` que no
      existe.** El [04](docs/04-modelo-de-datos.md), que es el que manda sobre el esquema, hace de esa regla un dominio: quien
      rechaza un valor cero es `dinero_positivo_mayor_que_cero`. Corregido en los dos por la [1.8](docs/08-plan-de-desarrollo.md#tarea-1-8), y
      la tabla salió del [04](docs/04-modelo-de-datos.md). **El [ADR-015](docs/adr/ADR-015-validacion-tres-capas.md) se queda como estaba**: está reemplazado, y un
      documento reemplazado «se conserva como historia» ([22 §4](docs/22-documentacion.md))
- [ ] **La verificación de la base es un guion SQL** (`scripts/db/verificar-base.sql`) y no un marco
      de pruebas: `prisma_db` no tiene ninguno, y lo que hay que comprobar son respuestas de
      PostgreSQL a sesiones de verdad. Corre dentro de una transacción que termina en `ROLLBACK`

**De la tarea [1.13](docs/08-plan-de-desarrollo.md#tarea-1-13):**

- [ ] **`peticiones_idempotentes` no exige que la clave venza después de creada**, y `nonces_vistos`
      sí lo exige (`nonces_vistos_vence_despues`, [04 §4.10](docs/04-modelo-de-datos.md#410-los-nonce-vistos)). Se transcribió el [04 §4.9](docs/04-modelo-de-datos.md#49-claves-de-idempotencia) tal cual:
      sumarlo sería una regla que el documento no escribió. Si hace falta, entra primero al [04](docs/04-modelo-de-datos.md) y
      después en una migración nueva
- [ ] **La migración no repite el `REVOKE DELETE`**: la tabla nace sin borrado por los
      `ALTER DEFAULT PRIVILEGES` de la [1.2](docs/08-plan-de-desarrollo.md#tarea-1-2), como dice el [04 §4.9](docs/04-modelo-de-datos.md#49-claves-de-idempotencia), y `verificar-base.sql` lo comprueba en
      ella. Ese amparo depende de qué rol crea la tabla: los privilegios por defecto de `postgres` quitan
      el borrado, pero los de `supabase_admin` lo conceden. Hoy las migraciones las aplica `postgres`, y
      si algún día no fuera así, la fila de la [1.2](docs/08-plan-de-desarrollo.md#tarea-1-2) del guion lo diría

**Del dominio (tareas [3.1](docs/08-plan-de-desarrollo.md#tarea-3-1), [3.2](docs/08-plan-de-desarrollo.md#tarea-3-2), [4.1](docs/08-plan-de-desarrollo.md#tarea-4-1), [5.1](docs/08-plan-de-desarrollo.md#tarea-5-1), [5.3](docs/08-plan-de-desarrollo.md#tarea-5-3) y [5.6](docs/08-plan-de-desarrollo.md#tarea-5-6)):**

- [ ] El dominio rechaza dos cosas que la base permite: un gasto con cuenta de destino, y una
      transferencia de una cuenta a sí misma ([§9](#9-a-vigilar))
- [ ] El margen por hora de un ítem que no consume tiempo de taller **no existe**, y viaja vacío en
      vez de cero: pintarlo como cero lo dejaría de último en el cuadro comparativo de la tarea [5.9](docs/08-plan-de-desarrollo.md#tarea-5-9),
      como si fuera el peor negocio del taller
- [ ] Un tiempo con más de dos decimales se rechaza en vez de redondearse, porque es lo que la
      columna `NUMERIC(6,2)` puede guardar
- [ ] Un pedido `cotizado` no se puede entregar sin confirmarse antes
- [ ] El identificador de un movimiento lo genera la API y no la base, para que repetir una petición
      que se cortó no cree dos ([ADR-020](docs/adr/ADR-020-idempotencia.md))
- [ ] La zona `America/Bogota` vive en el dominio y no en la configuración, porque cambiarla
      cambiaría a qué mes pertenece un movimiento ([RNF-08](docs/03-requisitos-y-bdd.md#rnf-08))
- [ ] La tarifa por hora se calcula aparte y el costeo guarda la que tenía cuando se produjo:
      recalcularla desde el pro-labore de hoy cambiaría los costos de los pedidos viejos
- [ ] Un mes sin horas productivas no tiene tarifa y se rechaza; un costo mensual en cero sí da
      tarifa cero
- [ ] Un producto rinde menos cuando deja por hora menos del 70 % de la mediana de **los demás**, que
      es la regla del formulario del mockup. No se tomó el umbral fijo de $30.000 con que el mockup
      pinta la columna de la tabla: depende de los precios del taller de ejemplo
- [ ] La mediana de una cantidad par es el promedio de los dos del centro, redondeado a peso; el
      mockup tomaba el de arriba
- [ ] Vender a pérdida es alerta crítica y rendir menos, alta. [11 §2](docs/11-riesgos-y-proteccion-de-datos.md#2-riesgos-del-negocio-que-el-sistema-ayuda-a-detectar) pone «margen por hora bajo
      o negativo» juntos en Alta; [12 §5](docs/12-pruebas-y-calidad.md#5-casos-límite-que-deben-probarse) pide el negativo en rojo, y el rojo es de lo crítico ([10 §3.1](docs/10-ux-y-mockups.md#31-color))
- [ ] Pérdida es margen negativo, no margen cero: el mockup avisaba «vendes a pérdida» también en cero

**Del contrato (tarea [1.17](docs/08-plan-de-desarrollo.md#tarea-1-17)):**

- [ ] Crear categorías queda como algo de Gerencia: la matriz de [01 §4](docs/01-vision-y-alcance.md#4-matriz-de-tipos-de-usuario-y-permisos) nombra las cuentas de dinero
      y no dice nada de las categorías
- [ ] `casilla` es un quinto tipo de campo del descriptor, para el `BOOLEAN` de `es_fijo`
- [ ] Una lista trae `opciones` —fijas— o `origen` —la ruta que las da—, y nunca las dos
- [ ] 🔒 `POST /api/v0/consultas/cuentas` no devuelve saldos, ni a Gerencia: los saldos son la [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12),
      que los dio en su propia ruta, `POST /api/v0/consultas/saldos`
- [ ] Tres códigos nuevos para las reglas que no caben en el descriptor: `42220`, `42221` y `42222`
- [ ] Editar y anular cuentas y categorías no entran al contrato todavía, porque ningún requisito
      las pide

**De la purga de las claves vencidas (tarea [1.16](docs/08-plan-de-desarrollo.md#tarea-1-16)):**

- [ ] **El horario quedó literal, y no corre de madrugada.** `pg_cron` agenda en el huso de
      `cron.timezone`, que en Supabase es `GMT` y no admite un huso por tarea, así que el
      `20 3 * * *` del [04 §4.9](docs/04-modelo-de-datos.md#49-claves-de-idempotencia) corre a las **22:20 de Bogotá**. Se dejó el valor escrito en vez de
      cambiarlo por la espalda. Si se quiere de madrugada de verdad es `20 8 * * *`, y hay que
      cambiar el [04](docs/04-modelo-de-datos.md) y el [16 §10](docs/16-base-de-datos-y-snapshots.md#10-tareas-programadas-dentro-de-la-base)
- [ ] **No se tocó `prisma_api`, aunque el plan ponga «API, Base».** Los documentos
      movieron la purga dentro de la base: corre como el rol de migraciones, y [04 §4.9](docs/04-modelo-de-datos.md#49-claves-de-idempotencia) y
      [16 §10.1](docs/16-base-de-datos-y-snapshots.md#101-qué-hace-falta-en-cada-ambiente) dicen que darle `DELETE` al rol de la API sería el error. Una prueba en la API que
      solo leyera `cron.job` probaría la base desde el repositorio equivocado
- [ ] **La purga de `nonces_vistos` no entra todavía:** su tabla es del [04 §4.10](docs/04-modelo-de-datos.md) y llega con el canal
      firmado del [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2). La consulta de vigilancia pregunta por la tabla que existe

**De la primera promoción a qa (tarea [1.12](docs/08-plan-de-desarrollo.md#tarea-1-12)):**

- [ ] **La versión del esquema sube a `0.2.0`, y luego a `0.3.0`, y esa regla no la escribió ningún
      documento.** [19 §4.2](docs/19-ambientes-y-entrega.md#42-las-reglas) define MAJOR, MINOR y PATCH **para la API**; del esquema solo se
      sabe que lleva SemVer propio. Se decidió lo mínimo: mientras todo siga en `0.y.z` y ninguna API
      en producción escriba, una tabla nueva y unas restricciones más estrictas son **MINOR**. Es la
      decisión que esta lista le pedía a la [1.12](docs/08-plan-de-desarrollo.md#tarea-1-12), y responde la entrada de arriba sobre
      `schema_version`
- [ ] **La `0.2.0` describe cuatro cambios y la base tiene cinco, y se arregló con una fila más y no
      corrigiéndola.** Entre que se fusionó y que se promovió entraron las dos tablas del canal
      firmado ([2.20](docs/08-plan-de-desarrollo.md#tarea-2-20)), que su descripción no nombra. Corregirla es lo que pediría el cuerpo, pero ya
      estaba aplicada, y editar una migración aplicada no cambia el ambiente que la corrió y sí deja
      a los demás creyendo otra historia. La `0.3.0` lo dice en una fila nueva. El precio fue tocar
      el bloque `1.12` de `verificar-base.sql`, que llevaba los dos valores escritos a mano
- [ ] **Dos frases del [§10](#10-decisiones-de-construcción-que-conviene-revisar) sobre la rama `qa` no pueden ser verdad a la vez.** Arriba: moverlas
      «sería inventar un flujo de ramas por ambiente que nadie decidió». Abajo, en lo de empujar
      siempre: «en `prisma_db`, promover a qa es un PR contra la rama `qa`». El [21 §6.5](docs/21-trabajo-en-paralelo.md#65-ramas-e-integración) solo nombra
      `develop` y `main`, y el procedimiento del [16 §5.3](docs/16-base-de-datos-y-snapshots.md#53-promover-a-qa-paso-a-paso) promueve con `db push` desde `develop`, sin
      tocar ninguna de las tres. Promover no necesita la respuesta; el flujo de ambientes del
      [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9), sí
- [ ] **`prisma_db` es privado, y sus guiones dicen que es público.** `promover.ps1` y el
      [16 §5.3](docs/16-base-de-datos-y-snapshots.md#53-promover-a-qa-paso-a-paso) justifican no escribir ahí ninguna referencia ni contraseña «porque el repositorio es
      público», y quien manda es el hábito, no el motivo: la referencia sigue sin escribirse. Pero el
      privado es el que necesita el secreto `PRISMA_DB_TOKEN` de la [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7), y el que decide si `prisma_db`
      puede recibir integración continua sin gastar minutos de una cuenta. Público es **este**
      repositorio, no aquel
- [ ] **Las ramas `qa`, `uat` y `prod` de `prisma_db` no se tocaron.** Existen en el remoto, las tres
      en el mismo commit viejo, y **ningún documento las menciona**: [21 §6.5](docs/21-trabajo-en-paralelo.md#65-ramas-e-integración) solo nombra `develop` y
      `main`. O son el estado de cada ambiente y llevan tiempo mintiendo, o son restos de cuando se
      creó el repositorio. Moverlas sería inventar un flujo de ramas por ambiente que nadie decidió
- [ ] **La promoción se hace a mano, aunque [19 §7.1](docs/19-ambientes-y-entrega.md#71-publicar) la dé por «Automático».** Esa tubería llega en el
      [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9) ([ADR-026](docs/adr/ADR-026-railway-al-final.md)), y `prisma_db` no tiene integración continua: no existe `.github/` en
      el repositorio. El procedimiento de [16 §5.3](docs/16-base-de-datos-y-snapshots.md#53-promover-a-qa-paso-a-paso) dice lo que hay, no lo que habrá
- [ ] **Nadie sabía en qué estado estaba qa, y esa es la lección de la promoción.** Los documentos
      decían cuatro migraciones de atraso; eran cinco, y no las mismas: los dominios y la revocación
      del borrado ya estaban aplicados allá, sin que ningún commit ni ninguna etiqueta lo dijera.
      Salió bien porque `migration list` y el `-EnSeco` se miran antes de aplicar, no porque el
      tablero acertara. Mientras el estado de un ambiente se lleve escrito a mano en un documento va
      a volver a pasar; lo que lo arregla de verdad es la etiqueta por versión del [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md), y que
      alguien la ponga en cada promoción
- [ ] **Ahora el que va atrás es dev, y no hay guion que lo arregle.** Le falta la `0.3.0`, que se
      escribió en esta tarea y viajó a qa en la misma pasada. `promover.ps1` solo admite `qa` a
      propósito —ofrecer destinos que nadie puede comprobar sería peor—, así que poner dev al día
      hoy es volver a vincular el CLI y correr `db push` a mano, justo lo que el guion existe para
      no tener que hacer. O el guion admite `dev`, o la tubería del [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9) se encarga de los dos
- [ ] **Se promovió desde una rama de trabajo, no desde `develop`.** El [16 §5.3](docs/16-base-de-datos-y-snapshots.md#53-promover-a-qa-paso-a-paso) no dice desde
      dónde se corre, y se corrió desde la rama de la propia [1.12](docs/08-plan-de-desarrollo.md#tarea-1-12), antes de fusionarla: qa tiene la
      `0.3.0` aplicada mientras su migración todavía espera revisión. El contenido es el mismo que se
      va a fusionar, pero el orden correcto es al revés, y la etiqueta del [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) solo se puede
      poner después. Si el PR se rechazara, qa tendría una migración que el repositorio no tiene

**De la preparación de uat y prod (tarea [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4)):**

- [ ] **La contradicción de la factura se resolvió contra el [09](docs/09-plan-de-implantacion.md), que era el que estaba mal.** Decía «dos
      proyectos de Supabase de pago y **un** alojamiento de API»; el [19 §8.1](docs/19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no) dice **dos**. Ganó el 19
      porque no está solo: el [19 §2.4](docs/19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro) explica el porqué —«la primera petición después de la siesta paga
      el arranque entero»— y la condición 2 del [ADR-026](docs/adr/ADR-026-railway-al-final.md), que el [ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md) dejó **intacta**, dice que uat y
      prod no se duermen. Tres fuentes contra una. De paso, la fila de uat del [09 §3.2](docs/09-plan-de-implantacion.md#32-alojar-la-api-de-java-en-los-cuatro-ambientes) aceptaba el
      arranque en frío sin distinguir cuál: ahora acepta el de después de desplegar y no el de la
      inactividad, que es el que cuesta dinero
- [ ] **La tarea de los cuatro proyectos de Supabase se partió en dos, y así es como acabó
      marcada.** Estaba previsto marcarla y no se hizo: pedía «los cuatro»
      y uat y prod no existen, así que marcarla habría sido escribir en el tablero algo que no es
      cierto, que es justo lo que costó trabajo descubrir en qa. Lo que resolvió el desacuerdo fue
      partirla: los dos gratuitos se quedan en la [0.4](docs/08-plan-de-desarrollo.md#tarea-0-4), hecha, y los dos de pago son la
      [9.12](docs/08-plan-de-desarrollo.md#tarea-9-12), en el [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9). La fila 3 del [§7](#7-decisiones-pendientes) sigue 🟡 y ahora bloquea a la 9.12: lo que está
      listo es el expediente, no la decisión
- [ ] **No se escribió ningún ADR nuevo, y esa también es una decisión.** El plan pedía uno solo si algo
      cambiaba respecto del [ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md) —adelantar uat o prod, pagar dev, montar el registro de imágenes— y
      no cambió nada: uat y prod siguen esperando al [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9) y no se contrató nada. Poner precio a lo
      ya decidido no es decidir de nuevo. Lo que sí apareció es que el [ADR-033](docs/adr/ADR-033-service-role-solo-en-auth.md) **no estaba en el índice
      de ADR**, que por eso contaba 32

**De la vista previa de Operación (tarea [2.18](docs/08-plan-de-desarrollo.md#tarea-2-18)):**

- [ ] **A Operación se le ignora el pedido de vista previa, en vez de rechazárselo.** Ningún
      documento dice qué hacer con ese caso: el contrato declara la operación con un `40300` entre
      sus códigos posibles y dice que «solo la pide Gerencia», pero no declara esa respuesta y
      ninguna prueba la pide. Se decidió lo mínimo —quien no es Gerencia recibe su propio menú, sin
      franja y sin interruptor—, porque pedirla sería pedir el menú que ya tiene y rechazarla
      abriría un camino de error que nadie especificó. Si quien dirige prefiere el rechazo, es una
      línea en `MenuDeLaSesion` y una prueba
- [ ] **El [10 §2.1](docs/10-ux-y-mockups.md) nombra tres secciones que el contrato no tiene:** «Configuración», «Inicio» y
      «Mi desprendible». No estorbaron a esta tarea —el [10 §5.6](docs/10-ux-y-mockups.md#56-vista-previa-de-operación) solo habla de Inversiones, Reportes y
      Nómina, y esas tres sí están entre las ocho claves— pero o el documento sobra tres o el
      contrato le faltan tres, y eso lo decide quien dirige y no quien pinta
- [ ] **La mitad de la vista previa que no se pudo construir es la que no tiene pantalla.** El
      [10 §5.6](docs/10-ux-y-mockups.md) también pide que «Productos deje de mostrar costos y márgenes» y que «Nómina quede
      bloqueada»: las dos pantallas son de los sprints 5 y 8, así que hoy la sección simplemente no
      viene en el menú, que es lo que sí se puede comprobar. Al construirlas hay que volver aquí

**Del front (tareas [0.19](docs/08-plan-de-desarrollo.md#tarea-0-19), [1.19](docs/08-plan-de-desarrollo.md#tarea-1-19), [1.18](docs/08-plan-de-desarrollo.md#tarea-1-18), [2.10](docs/08-plan-de-desarrollo.md#tarea-2-10) y [9.1](docs/08-plan-de-desarrollo.md#tarea-9-1)):**

- [ ] «Acerca de» se abre tocando la insignia de versión. El mockup lo pone en el menú de la
      sesión, que llega con el [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2) ([2.2](docs/08-plan-de-desarrollo.md#tarea-2-2) y [2.14](docs/08-plan-de-desarrollo.md#tarea-2-14)); la insignia ya es el sitio donde se mira la versión
- [ ] Una celda más ancha que su columna desborda a la vista en vez de recortarse: el aviso de
      Flutter es la señal de que la columna está mal medida
- [ ] El panel de confirmación recibe el campo y el mensaje de error ya hechos, en vez de
      construirlos. Es lo que impide que el front se quede con una regla propia
- [ ] Un descriptor al que le falte algo —un tipo desconocido, una regla sin mensaje, una lista sin
      opciones ni origen— no se pinta a medias: no se pinta, y la pantalla lo dice
- [ ] Los avisos de un formulario salen al enviar, no mientras se escribe, y se van en cuanto la
      persona toca el campo; el error del servidor, igual
- [ ] Un campo opcional vacío viaja como `null` y no como cadena vacía
- [ ] El botón que envía lo pone la pantalla, no el renderizador, porque su texto es parte de la
      acción
- [ ] Encolar una acción devuelve «nada» cuando queda pendiente, y eso es lo que la pantalla muestra
      como *Pendiente de sincronizar*: nunca un «listo» que mentiría
- [ ] Solo se reintentan solas la falta de respuesta, los `5xx` y el `40902`; lo que la API rechaza
      con motivo espera a una persona
- [ ] Lo guardado que no se puede leer —de una versión anterior del formato— se deja quieto en vez de
      borrarse

**De la tarea [2.1](docs/08-plan-de-desarrollo.md#tarea-2-1):**

- [ ] **El `sub` sale del cuerpo que devuelve GoTrue, no de verificar la firma del token.** En el
      inicio de sesión el token nace en una llamada servidor a servidor, y ningún endpoint recibe
      todavía un token de un cliente. Verificarlo contra el JWKS ES256 es del filtro de sesión
      ([2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)), que es quien lee `Authorization: Bearer`
- [ ] **`activo` lo comprueba la API, no una política de RLS.** Las políticas dejan a una persona
      desactivada leer su propia ficha, y el contrato exige que `40301` salga **solo** con la
      contraseña correcta ([BDD-28-3](docs/03-requisitos-y-bdd.md#bdd-28-3)). Esconderla con una política daría `40104` y contradiría al
      contrato
- [ ] **Quien autentica bien y no tiene ficha en `usuarios` responde `40104`**, igual que quien no
      existe. Cualquier otra respuesta le confirmaría a un desconocido que ese correo sí existe en
      Auth. Queda una línea en el registro del servidor, porque es una inconsistencia de datos
- [ ] **El acceso es el único endpoint sin firma, sin idempotencia y sin tope de intentos.** El
      catálogo no tiene un `429` y ningún documento pide bloqueo ni retardo tras varios fallos: se
      dejó fuera a propósito, y conviene decidir si hace falta antes del go-live
- [ ] 🔒 **El catálogo acordado le atribuye a la «Tarea [2.1](docs/08-plan-de-desarrollo.md#tarea-2-1)» tres marcas que no le corresponden.**
      `40302` lo emite el filtro de sesión ([2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)) y `42210` el cambio de contraseña; y la marca de
      `20100` dice que el primer endpoint que crea algo es el alta de usuarios, cuando resultó ser
      el inicio de sesión. Los tres textos hay que corregirlos en un PR de contrato
- [ ] **La copia fijada publica el 201 sin la cabecera `Set-Cookie`** que el contrato acordado le
      pone: la cookie `prisma_renovacion` es de la [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2), y declararla sin emitirla sería mentir. La
      descripción de la operación sí se copió literal, para no reescribirla en cada tarea
- [ ] **`TipoDeCampo` estrena `clave` pero no `casilla`**, que el enum acordado tiene en medio.
      Ningún formulario usa `casilla` todavía, y el generador valida tipo contra tipo de Java al
      arrancar: declararlo sería código que ninguna prueba ejerce
- [ ] **La clave de firma se genera y se devuelve, y no se guarda en ningún sitio.** El esquema
      `Sesion` la declara obligatoria; dónde vive del lado del servidor y quién la comprueba son la
      [2.12](docs/08-plan-de-desarrollo.md#tarea-2-12) y la [2.13](docs/08-plan-de-desarrollo.md#tarea-2-13)
- [ ] **Una `SUPABASE_URL` vacía no impide arrancar**: la API responde `50000` a todo intento de
      entrar, en vez de negarse a arrancar. Es a propósito, para no romper la compilación donde no
      hay Supabase, pero deja el fallo lejos del sitio donde se causó

**De la tarea [1.14](docs/08-plan-de-desarrollo.md#tarea-1-14):**

- [ ] **La cabecera se exige en toda petición, lea o escriba, y no solo en las escrituras.** La fila
      del plan dice «toda escritura», pero es anterior al [ADR-030](docs/adr/ADR-030-contrato-sin-get.md): desde que todo es `POST`, el
      [20 §5.1](docs/20-contrato-de-api.md#51-la-cabecera) dice «toda petición» y el contrato acordado la declara requerida en 24 de sus
      26 operaciones. Seguir la fila del plan dejaría al OpenAPI generado mintiendo sobre nueve
- [ ] **La exención es por ruta exacta, no por «si escribe».** El ingreso **escribe** y va sin clave,
      así que eximir por verbo o por prefijo de consultas le rompería el acceso al front
- [ ] **Una clave presente que no es un UUID v4 responde `40002`, igual que si faltara.** Ningún
      documento cubría el caso: es el mismo defecto del cliente y se arregla igual
- [ ] **La huella es SHA-256 de método, ruta con query, usuario y los bytes crudos del cuerpo**, sin
      normalizar el JSON. Normalizar obligaría a parsear dentro de un filtro, y la huella existe para
      detectar una clave reutilizada para otra cosa, no para juzgar equivalencia semántica
- [ ] **El `40902` sale de un tiempo límite de espera en la llave primaria, no de leer
      `estado = 'en_curso'`:** la fila de la primera petición está sin confirmar y ninguna otra sesión
      la ve nunca. Y como corolario, **no existe una fila «en curso» colgada**
- [ ] **Ese tiempo agotado llega como `55P03`, y Spring no lo clasifica:** viaja en un
      `UncategorizedSQLException`, así que se mira el SQLSTATE. Confiando solo en las excepciones de
      Spring, la segunda petición respondía `50000` en vez de `40902`
- [ ] **La respuesta guardada vuelve del `jsonb` reserializada:** mismo contenido y mismo `status`,
      pero otro orden de claves y otro espaciado, así que no es byte a byte. Serlo exigiría guardar el
      texto crudo en vez de un objeto que se pueda inspeccionar en la base
- [ ] **No se guarda un `5xx`: se revierte.** El front reintenta todo `5xx` con la misma clave, y
      guardarlo dejaría la operación muerta 72 horas devolviendo el mismo fallo. Un `4xx` sí se guarda
- [ ] **Una petición sin identidad exige la cabecera pero no registra fila.** `usuario_id` es
      `NOT NULL` y las tres políticas cuelgan de `auth.uid()`. **Hoy eso es todo el tráfico**: el
      filtro de sesión llega con la [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2), y hasta ese día el efecto visible es el `40002` y el
      parámetro en el contrato
- [ ] **El ingreso responde `50000` contra una base real, y no lo rompió esta tarea:**
      `UsuariosEnPostgres` pide la conexión sin transacción abierta, y en `main` tampoco la abría
      nadie. La abre el filtro de sesión de la [2.2](docs/08-plan-de-desarrollo.md#tarea-2-2)

**De la regla de empujar siempre ([21 §6.5](docs/21-trabajo-en-paralelo.md#65-ramas-e-integración)):**

- [ ] **La regla se acota a la rama de trabajo, y las de ambiente siguen sin dueño escrito.**
      `develop`, `main`, `qa`, `uat` y `prod` no se mueven por cuenta propia, pero ningún documento
      dice quién las mueve ni cuándo; en `prisma_db`, promover a qa es un PR contra la rama `qa`
- [ ] **Empujar una rama `feature/` en este repositorio no comprueba nada:** la acción corre solo en
      `main` y en los PR contra `main`, aunque el [22 §8](docs/22-documentacion.md#herramienta) y el [19 §6.1](docs/19-ambientes-y-entrega.md#61-en-cada-empuje-en-paralelo) hablen de «cada
      empuje». O se amplía el disparador a `feature/**` —y cada empuje gasta minutos de acción— o se
      precisa la frase en los dos sitios. La regla da respaldo remoto y un sitio desde donde abrir el
      PR, no verificación
- [ ] **Los documentos no se ponen de acuerdo en cuál es la rama base:** el [21 §6.5](docs/21-trabajo-en-paralelo.md#65-ramas-e-integración) y el
      [08 §4](docs/08-plan-de-desarrollo.md#4-definición-de-terminado) dicen `develop`; el [ADR-026](docs/adr/ADR-026-railway-al-final.md) y el [ADR-028](docs/adr/ADR-028-un-commit-por-tarea.md), `main`. La regla de empujar esquiva la
      contradicción nombrando la rama de trabajo, pero la contradicción sigue ahí

**De los dos arreglos del camino real (no son tareas del plan):**

- [ ] **La transacción del ingreso la abre un adaptador del puerto**, `UsuariosDelRecienAutenticado`,
      y no el filtro: cuando el filtro corre todavía no hay identidad, porque la devuelve el
      proveedor al comprobar la contraseña. La regla de ArchUnit pasa de «solo un filtro» a enumerar
      **dos clases**, y ninguna otra puede abrirla
- [ ] **Un cuerpo sin `nombre` en `POST /api/v0/consultas/formularios` responde `40000`.** Ningún
      documento cubría el caso: el [20 §4.3](docs/20-contrato-de-api.md#43-cómo-se-pide-y-qué-forma-tiene) solo decía qué pasa con un nombre que no existe
      (`40400`). Se descartó `42200`, que habría exigido validación en ese record y cambiado el
      esquema publicado
- [ ] **La prueba que caza esto no corre en la integración continua.** La tubería de la API solo
      hace `./gradlew build`, y el trabajo aparte con la base que decidió [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) [§3](#3-sprint-1--base-rls-identidad-e-idempotencia) todavía no
      existe. Además ese trabajo levanta `supabase db start`, que **no** trae GoTrue: las pruebas del
      ingreso necesitan `supabase start`. Mientras tanto, el cableado del ingreso solo se comprueba
      en la máquina de quien lo corre

**De la gestión de usuarios ([2.7](docs/08-plan-de-desarrollo.md#tarea-2-7)):**

- [ ] ⚡ **Tres huecos de Base que la bitácora necesita y nadie ha planificado.** `usuarios` no tiene
      trigger de auditoría —la migración inicial lo dice en su línea 481: «necesita su propia
      variante, aún no especificada»—; la función `SECURITY DEFINER` que el [04](docs/04-modelo-de-datos.md) dice que escribe
      `usuario_creado` y `clave_restablecida` **no tiene nombre, ni firma, ni migración**; y el
      `CHECK auditoria_accion_valida` no admite `nombre_cambiado`, `cargo_cambiado` ni
      `tipo_cambiado`, que el contrato promete en `EntradaDeBitacora`. La [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16) no se puede hacer
      sin resolver los tres, y ninguno es suyo: son del trabajo de la base
- [ ] **Los cuatro conflictos de estado de una ficha los rechaza la API, no la base.** El contrato
      dice `40900` y ninguna restricción lo impone: `usuarios_actualizacion` deja a Gerencia
      actualizar cualquier fila, activa o no. Son editar, restablecer la clave y desactivar a quien
      ya está desactivada, y desde la [2.15](docs/08-plan-de-desarrollo.md#tarea-2-15) también **reactivar a quien ya tiene acceso**,
      que sin ese rechazo escribiría una entrada «Reactivado» por algo que no ocurrió. Es la
      excepción a «los permisos viven en PostgreSQL» y se anota como tal. Bajarlo a un trigger es
      una tarea de Base
- [ ] **El alta toca dos sistemas sin una transacción común.** Si GoTrue crea la identidad y la
      ficha falla, se compensa borrándola; si la compensación también falla, sale el error de la
      ficha y queda una identidad huérfana que no deja entrar a nadie pero ocupa ese nombre de
      usuario. No hay forma de cerrarlo del todo sin una cola de compensaciones
- [ ] **`Motivo` es una clase con un solo `@Formulario`, y el contrato declara cuatro.** Desactivar
      y reactivar una persona, desactivar un cargo y revertir un cambio comparten campo y esquema
      pero tienen etiquetas y mensajes distintos. Aquí se declara el de desactivar una persona;
      como `@Formulario` es por clase, las tareas [2.8](docs/08-plan-de-desarrollo.md#tarea-2-8), [2.15](docs/08-plan-de-desarrollo.md#tarea-2-15) y [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16) van a necesitar una clase cada
      una, y entonces sus esquemas en el OpenAPI dejarán de llamarse todos `Motivo`
- [ ] 🔒 **`cargos-asignables` entra con esta tarea y no con la [2.8](docs/08-plan-de-desarrollo.md#tarea-2-8)**, que es la del catálogo de
      cargos. Es el `origen` declarado del campo `cargoId`: sin ella el formulario de alta no se
      puede pintar, y esperar a la 2.8 habría dejado la 2.7 sin desplegable
- [ ] **El tipo de campo `lista` pasa a admitir `UUID` además de `String`.** Hay dos clases de
      lista: la que elige entre valores de un ENUM y la que elige una fila. En JSON las dos son una
      cadena, y obligar a que el cargo llegara como texto solo conseguiría que alguien lo
      convirtiera a mano
- [ ] **Un tipo de usuario que no es ni Gerencia ni Operación sale como `42200`**, porque el
      catálogo no tiene código propio para eso y no debería: las dos opciones viajan en el
      descriptor y el front pinta esas
- [ ] ⚡ **El sello de idempotencia tapaba el rechazo de la base, y se arregló aquí.** Cuando una
      sentencia falla, PostgreSQL deja la transacción abortada y no acepta ni una más; el filtro de
      la [1.14](docs/08-plan-de-desarrollo.md#tarea-1-14) intentaba sellar la respuesta dentro de esa misma transacción, y su `25P02` salía
      del filtro **pisando** el sobre que el controlador ya había armado. Operación intentando
      quitarse el acceso leía «algo salió mal» con el guardián haciendo exactamente su trabajo.
      Ahora, si el sello no cabe, se revierte la clave y se responde lo que salió —el mecanismo que
      el filtro ya tenía para los 5xx—. **No se vio antes porque hasta la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) ninguna escritura
      llegaba a que la base la rechazara**, y ningún doble aborta una transacción de verdad
- [ ] **Dos rechazos de la base pasan a `40300`**: el de una política sobre un `INSERT` y el del
      trigger que congela la ficha propia. Los dos significan «no te alcanza» y salían como error
      del sistema. Que la API los traduzca no es que decida permisos: sigue sin mirar de qué tipo
      es nadie
- [x] **La traducción de restricción a código estaba escrita a mano en `UsuariosEnPostgres`**, y
      desde la [3.3](docs/08-plan-de-desarrollo.md#tarea-3-3) también en `MovimientosEnPostgres`. Buscaban literales con `contains` sobre el
      mensaje crudo, y `row-level security policy` estaba escrito dos veces. **Cerrado por la
      [1.8](docs/08-plan-de-desarrollo.md#tarea-1-8)**: el texto se lee en un solo sitio, `RechazoDeLaBase`, que entrega el estado, la
      restricción y la tabla por separado. Ningún adaptador busca texto ya

**Del arreglo del alta de usuarios:**

- [ ] 🔒 **El alta estuvo caída en dev desde el día en que se publicó la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7), y nadie lo supo.**
      Faltaba `SUPABASE_SERVICE_ROLE_KEY` en el servicio de la API. Esa variable la lista el
      [19](docs/19-ambientes-y-entrega.md), la documenta el `.env.ejemplo` y `application.yml` avisa por escrito de qué deja de
      funcionar sin ella: **el documento estaba bien y aun así el ambiente salió sin cargarla**. Lo
      que no existe es nada que compruebe que un ambiente publicado tiene lo que dice necesitar, y
      eso no lo arregla este plan
- [ ] **`ProveedorNoDisponible` estrena el décimo código base, `50300`.** Antes no tenía manejador y
      salía como `50000`, «Algo salió mal. Intenta de nuevo en un momento», que era falso en las dos
      mitades. Falta configurar y proveedor caído comparten código a propósito: para quien está
      delante son la misma situación. Cuál fue queda en el registro
- [ ] **Quién es un usuario repetido lo decide ahora el `error_code` de GoTrue y no el estado.** El
      adaptador daba por repetido todo 409 y todo 422, y GoTrue usa el 422 también para la clave
      débil y el correo que no acepta: comprobado contra el GoTrue local, `weak_password` llegaba a
      Gerencia como «Ya hay alguien con ese usuario. Elige otro.» Si el cuerpo no trae `error_code`
      se decide por el estado, como antes
- [x] **Ya no caen al `50000` los cuatro rechazos de `usuarios`**: `usuarios_nombre_completo_minimo`,
      `usuarios_id_fkey`, `usuarios_pkey` y `motivo_con_contenido`. Los recogió la [1.8](docs/08-plan-de-desarrollo.md#tarea-1-8) con el código
      transversal de su clase —`42200` los tres primeros, `40900` el identificador repetido— y hay
      cuatro pruebas de integración que los provocan contra PostgreSQL y miran qué sale
- [x] **`@Size(min = 3)` sobre `nombreCompleto` no recorta y el `CHECK` de la base sí**, así que
      `"  a"` pasa la validación del formulario y lo rechaza PostgreSQL. **Sigue siendo alcanzable
      desde la pantalla**, y lo que cambió con la [1.8](docs/08-plan-de-desarrollo.md#tarea-1-8) es que sale como `42200` señalando
      `nombreCompleto` en vez de como error del sistema. Que el formulario y la base recorten igual
      es otra cosa, y no la arregla esa tarea

**De dejar la integración continua en verde:**

- [ ] **Seis pruebas salen de la compilación de siempre y dejan de comprobarse en cada empuje.**
      Cinco necesitan PostgreSQL —el ingreso lee la ficha de `public.usuarios` con la identidad
      puesta— y pasan a llevar `@Tag("integracion")`, así que corren con `./gradlew integracion`
      contra una base de verdad. La sexta, la del filtro y la sonda de salud, acepta `200` o `503`:
      lo suyo es que la petición llegue a la sonda, no que la base esté viva. El hueco lo cierra el
      trabajo aparte que el [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) manda levantar con Supabase, y que depende de la [1.20](docs/08-plan-de-desarrollo.md#tarea-1-20)

**Del arreglo de la pantalla de acceso:**

- [ ] **El envío del formulario sigue sin distinguir «no hubo respuesta» de «llegó algo sin forma de
      sobre»**: las dos se leen como «No se pudo conectar con el servidor». La carga del formulario ya
      las separa; el envío no, porque `Sesiones` devuelve `Sobre?` y cambiarlo arrastra a la cola de
      pendientes del [Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9) dentro de un arreglo pequeño. Es la misma imprecisión, en la otra
      mitad de la misma pantalla
- [ ] **«Reintentar» quedó escrito dos veces**: como componente para las dos pantallas de sesión, y a
      mano dentro de la capa de versión incompatible. Es el mismo botón; unificarlos toca una pantalla
      aprobada que ese arreglo no abría, y queda dicho en el propio componente para que no se descubra
      por sorpresa
- [ ] **El arreglo no subió la versión del front**, siguiendo lo que hizo el arreglo suelto anterior.
      Si un cambio de comportamiento visible debe llevar versión propia, la regla no está escrita

**De los datos de dev:**

- [ ] **El cargo «Gerente General (CEO)» existe solo en la semilla**, no en el catálogo de arranque
      del [04](docs/04-modelo-de-datos.md). Se decidió así para no ampliar el catálogo del negocio de paso: una migración lo
      metería también en uat y en prod. Si el cargo es de verdad del negocio, le toca su migración
- [ ] **Cada `supabase db reset` deja al rol `prisma_api` sin contraseña** y la API falla contra la
      base con el resto en pie, porque las dos consultas que se sirven de memoria siguen respondiendo
      `200`. La migración lo crea así a propósito —el repositorio es público—, pero `reset-local.ps1`
      tampoco la repone, así que cada quien lo descubre solo

**Del repositorio de movimientos ([3.3](docs/08-plan-de-desarrollo.md#tarea-3-3)):**

- [ ] **El autor y el instante de un movimiento los pone el caso de uso, no la base.** `creado_por`
      es el de la digitación y no `auth.uid()`: así `mov_insercion` compara dos cosas distintas y
      juzga de verdad —registrar a nombre de otra persona lo rechaza la base, y hay prueba—. Y
      `creado_en` es el instante con que `RegistrarMovimiento` decidió qué día era hoy, y no el
      `DEFAULT NOW()`: con dos relojes, el movimiento devuelto y la fila guardada podrían caer en días
      distintos cerca de la medianoche
- [x] **La bitácora de lo que escribe la API ya sabe desde dónde.** Lo arregló la [2.9](docs/08-plan-de-desarrollo.md#tarea-2-9) donde decía
      esta nota que había que arreglarlo: `ConIdentidad` publica las cabeceras de la petición junto a
      los claims, y `fn_auditar` las prefiere —`user-agent` para el aparato y `x-real-ip` para la
      dirección— en vez de leer una variable vacía y `inet_client_addr()`, que con la API en medio
      era la conexión **de la API**. Lo que sigue abierto es la fila: `dispositivo` e `ip` de
      `movimientos` siguen vacíos, porque el dominio no los trae y ningún documento dice de dónde
      salen en la fila. La bitácora sí los tiene, que es lo que promete el [ADR-005](docs/adr/ADR-005-auditoria-por-triggers.md)
- [x] **Los rechazos de `movimientos` ya no caen todos al código transversal.** La [3.4](docs/08-plan-de-desarrollo.md#tarea-3-4) les cambió
      el código a las cinco filas que ya estaban: `fecha_no_futura` al `42223`,
      `transferencia_con_destino` y la foránea de la cuenta de destino al `42226`, y las de cuenta
      y categoría al `42224` y al `42225`. **No se agregaron filas**, que es lo que [C-01](docs/12-pruebas-y-calidad.md#c-01) exige. Tres
      de los cuatro los ataja antes el dominio, y una prueba compara los dos caminos
- [ ] **El mismo id dos veces lo rechaza la llave primaria, y no se traga en silencio.** El id lo
      pone quien pide, al decidir la acción ([ADR-020](docs/adr/ADR-020-idempotencia.md)): si la clave de idempotencia ya se purgó y la
      misma acción vuelve, el libro no la duplica. Qué responde la API en ese caso **ya lo dice el
      contrato**: `40900`, el mismo que un pedido repetido
- [ ] **Un movimiento que llega anulado no se guarda como nuevo**: el adaptador lo rechaza antes de
      pedir conexión. Ningún documento lo pedía, pero el `INSERT` no escribe la anulación, y
      guardarlo así la habría perdido sin avisar
- [x] **`RegistrarMovimiento` ya está cableado**, con `ConsultarMovimiento` al lado: los dos beans
      los puso la [3.4](docs/08-plan-de-desarrollo.md#tarea-3-4), y el reloj es `Clock.systemUTC()` inyectado para poder fijarlo

**Del contrato de movimientos ([3.13](docs/08-plan-de-desarrollo.md#tarea-3-13)):**

- [ ] **Registrar es `PUT /api/v0/movimientos/{id}` y no `POST` a la colección**, como en pedidos y
      clientes. El id lo genera quien registra junto con la clave de idempotencia ([ADR-020](docs/adr/ADR-020-idempotencia.md)), así que
      en el cuerpo sobraría: el generador de descriptores pinta **todos** los campos del record, y un
      id no se pinta. Con el id en la ruta, el cuerpo es exactamente el formulario, y el mismo dos
      veces responde `40900` en vez de duplicar el libro
- [ ] **El formulario «movimiento» ofrece tres tipos de los nueve**: ingreso, gasto y transferencia.
      Los otros seis tienen su pantalla y su tarea de contrato —[4.10](docs/08-plan-de-desarrollo.md#tarea-4-10), [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) y [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11)—, y ofrecerlos
      hoy sería acordar pantallas que nadie ha diseñado. La lectura sí devuelve los nueve
- [ ] 🔒 **Seis códigos y no diez**, por lo mismo que el [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10) dio nueve y no dieciséis: una pregunta
      sobre un campo es un código, y el texto concreto viaja en `data.errores`. Por eso `42226` cubre
      las tres situaciones de la cuenta de destino —falta en una transferencia, es la misma de
      origen, o la trae un tipo que no la lleva—, y el id repetido y el movimiento ya anulado salen
      con el `40900` genérico. Quedan libres `42227` a `42229`
- [ ] **El adjunto pesa 5 MB como máximo y es JPEG, PNG, WebP o PDF.** Ningún documento lo decía, y
      sin un límite escrito el front de la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) no sabe a cuánto comprimir. **Lo confirma quien
      dirige.** Sus dos rechazos van en `400` y no en `422` porque no hay campo de formulario al que
      señalarle el aviso
- [ ] **Devolver el adjunto no se declaró.** Ninguna pantalla del [10](docs/10-ux-y-mockups.md) ni del mockup lo pinta
      todavía, y acordarlo ahora sería decidir desde el contrato cómo se sirve Supabase Storage
- [ ] 🔒 **El libro sí pagina, y la consulta de pedidos no.** Es la decisión contraria a la del [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10),
      y por la misma razón que allí se dio: el libro es la única lista que crece sin tope —una fila
      por cada peso que entra o sale, todos los días—, así que `limite` sin `total` dejaría al front
      mostrando una lista incompleta sin saberlo. Es el par que ya usa la bitácora
- [ ] **`cuentaDestinoId` y `categoriaId` viajan sin `obligatorio`** aunque una transferencia exija la
      primera y un gasto pida la segunda: el descriptor no sabe decir «obligatorio si» ([20 §4.4](docs/20-contrato-de-api.md#44-las-reglas-que-caben-y-por-qué-no-caben-más)), y
      una regla condicional ahí sería código en el front
- [ ] **Los textos del mockup se adaptaron**, porque el formulario cubre tres tipos y no solo el
      gasto: «Escribe cuánto se gastó» pasó a «Escribe cuánto fue», y la fecha dejó de nombrar al
      gasto. La segunda frase de cada aviso quedó igual
- [ ] 🔒 **Entró una tarea nueva al plan, la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14), y el total pasa de 133 a 134.** La tabla
      `adjuntos` está en el diagrama y el catálogo del [04](docs/04-modelo-de-datos.md) sin `CREATE TABLE`, [16 §9](docs/16-base-de-datos-y-snapshots.md#9-límites-conocidos-heredados-del-doc-04) dice que queda
      pendiente de especificar, y **ninguna tarea la creaba**: la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) y la [4.8](docs/08-plan-de-desarrollo.md#tarea-4-8) daban por hecho
      que existía
- [ ] **El [20 §8](docs/20-contrato-de-api.md#8-el-contrato-funcionando) ejemplificaba con `POST /api/v0/gastos`, una ruta que nunca existió**, y el
      descriptor del [§4.3](docs/20-contrato-de-api.md#43-cómo-se-pide-y-qué-forma-tiene) con un formulario «gasto» que tampoco. Los dos pasan a los de verdad: si
      no, el propio documento se contradecía al decir que el mensaje del error es el mismo que el del
      descriptor

**De la tarea [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10):**

- [ ] 🔒 **El mockup no tiene pantalla de clientes, y el contrato acaba de acordar tres operaciones
      de cliente.** En el prototipo que Gerencia aprobó, el campo «Cliente» del formulario de pedido
      es **texto libre**: no hay lista, ni pantalla donde darlos de alta, ni panel de anulados. Pero
      la [4.2](docs/08-plan-de-desarrollo.md#tarea-4-2) es «Gestión de clientes · API **y** Front» y cuelga de este contrato, así que no
      declarar nada la dejaba bloqueada. Se acordó el mínimo que esa tarea necesita —crear,
      consultar y anular, con los cuatro campos del [RF-18](docs/03-requisitos-y-bdd.md#rf-18)—, y **queda por decidir si se diseña la
      pantalla o si el cliente se sigue escribiendo a mano**. Si se decide lo segundo, sobran tres
      operaciones y un formulario
- [ ] **Nueve códigos y no dieciséis, porque los de campo se agrupan.** Los rechazos que las reglas
      justifican dan, uno por uno, muchos más `422` de los que caben con sentido en un módulo, y el
      [20 §2.4](docs/20-contrato-de-api.md#24-los-rangos-por-módulo) dice que cuando eso pasa «varios de ellos merecían un estado más preciso». Una
      pregunta sobre un campo es un código y el texto concreto viaja en `data.errores`; lo que lleva
      código propio es lo que choca con el **estado** del pedido, porque ahí no hay campo que
      corregir. Quedan libres `42236` a `42239` y `40933` a `40939`
- [ ] 🔒 **`pedidos` no tiene dónde guardar el motivo de la cancelación ni el destino del anticipo.**
      El contrato ya declara `POST /api/v0/pedidos/{id}/cancelacion` con los dos campos, y el dominio
      de la [4.1](docs/08-plan-de-desarrollo.md#tarea-4-1) lo había anotado: «el modelo todavía no tiene dónde guardarlo». La [4.9](docs/08-plan-de-desarrollo.md#tarea-4-9) necesita
      una migración que no está en ninguna tarea. A la tabla `adjuntos` le pasó lo mismo con el
      contrato de movimientos, y ahí ya se resolvió metiéndola al plan: es la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14)
- [ ] **El número visible del pedido lo pone la API, y ningún documento decía quién.** El mockup los
      pinta como `P-0287`, así que existen y son correlativos. Por eso `numero` no está en
      `NuevoPedido` y `pedidos_numero_key` se quedó sin código: el cliente no puede provocar ese
      choque. Con qué regla se genera la serie es de la [4.3](docs/08-plan-de-desarrollo.md#tarea-4-3)
- [ ] **El `precioUnitario` viaja en cada línea en vez de leerse del catálogo.** Es lo que hace que
      un pedido de septiembre siga valiendo lo que valía cuando el precio del producto cambie en
      noviembre, y es la razón de que `pedido_lineas.precio_unitario` sea una columna y no un `JOIN`.
      El front lo toma del catálogo al pintar; el contrato no adivina de dónde salió
- [ ] **La consulta de pedidos no pagina, y el listado de bitácora sí.** El [RF-20](docs/03-requisitos-y-bdd.md#rf-20) pide orden por
      fecha y filtros por estado y cliente, no páginas, y los filtros de fecha ya acotan lo que
      vuelve. Si el taller acumula años de pedidos habrá que paginarla, y entonces cambia el contrato
- [ ] **La entrega parcial entra como estado y no como operación.** Es prioridad C ([RF-25](docs/03-requisitos-y-bdd.md#rf-25)) y el
      [CU-07](docs/02-casos-de-uso.md#cu-07) A2 la describe como una variante de la entrega, no como otra cosa. `parcial` está en el
      ENUM y en el contrato; `en_proceso → parcial` es el único paso del dominio sin operación que lo
      dé, junto con `cotizado → en_proceso`, que es del cotizador
- [ ] **El anticipo mínimo y el adjunto de la factura se cedieron por nombre.** El anticipo mínimo
      ([RF-38](docs/03-requisitos-y-bdd.md#rf-38), [RF-39](docs/03-requisitos-y-bdd.md#rf-39), [CU-12](docs/02-casos-de-uso.md#cu-12)) el mockup lo pinta dentro del formulario de pedido, pero su fórmula es
      del costeo y su operación es del cotizador: va con la [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11). El adjunto ([RF-27](docs/03-requisitos-y-bdd.md#rf-27)) depende de
      la tabla `adjuntos`, que no existe, y su tarea es la [4.8](docs/08-plan-de-desarrollo.md#tarea-4-8)

**De la tarea [1.8](docs/08-plan-de-desarrollo.md#tarea-1-8):**

- [ ] 🔒 **La tabla no la puede leer un adaptador, y el plan daba por hecho que sí.** Sus filas
      nombran códigos del catálogo, que viven en `interfaz`, y `ReglaDeDependenciasTest` prohíbe
      que `infraestructura` conozca esa capa ([07 §3](docs/07-arquitectura.md#3-regla-de-dependencias)). Así que los dos `traducir` no se fueron con
      ella: lo que se fue es la búsqueda de texto, que era la duplicación real. Cada adaptador
      sigue convirtiendo en excepción de dominio **lo que su puerto promete** —tres reglas de
      `usuarios` y el rechazo de política— y el manejador global traduce todo lo demás con la
      tabla. Que las dos digan lo mismo lo comprueba `TraduccionDeRestriccionesTest`, y sin esa
      prueba se separarían sin que nadie lo notara
- [ ] **Casi todas las filas comparten dos códigos, y no es pereza: es el formato.** Un rechazo de
      llave foránea ocurre en cualquier módulo, y los dos dígitos de caso están repartidos por
      módulo ([20 §2.4](docs/20-contrato-de-api.md#24-los-rangos-por-módulo)), así que un código propio afirmaría pertenecer a uno al que no pertenece.
      Los transversales son los diez base, y el caso `00` de `422` y `409` ya está tomado. Quien
      quiera un mensaje afinado para un módulo lo acuerda en el contrato de ese módulo
- [ ] **El [04 §11](docs/04-modelo-de-datos.md#11-el-contrato-de-errores) promete más de lo que la tabla entrega en dos puntos.** Dice que un `NOT NULL`
      se lee «Falta *campo*» y que el rechazo de un dominio se arma «con el campo de la petición y
      el texto del dominio»; las dos frases son mensajes propios, y la fila lleva un código, nunca
      un `String`. Hoy salen como `42200` señalando el campo cuando la base lo dice. Cumplirlo al
      pie exige códigos nuevos —o el cuerpo de la petición en el manejador— y las dos cosas son
      cambio de contrato
- [ ] **El controlador de PostgreSQL pasó a ser dependencia de compilación**, y antes solo lo era
      de ejecución. `PSQLException.getServerErrorMessage()` es lo único que entrega la restricción,
      la tabla y la columna por separado; ningún tipo de `java.sql` los expone, y la alternativa
      era volver a buscar texto
- [ ] **La tabla enumera las 93 restricciones del filtro y las 26 llaves primarias, una por una.**
      Una regla por clase habría bastado para responder, pero entonces agregar una restricción
      nueva no rompería nada y nadie decidiría su mensaje, que es justo lo que el [04 §11](docs/04-modelo-de-datos.md#11-el-contrato-de-errores) quiere
      impedir. El precio es que quien agregue una restricción tiene que agregar su fila
- [ ] **A las llaves foráneas y a los `CHECK` de tabla no se les señala campo.** El rechazo de una
      foránea trae la tabla y la restricción, no la columna, y deducirla del nombre sería adivinar;
      un `CHECK` de tabla es una regla entre columnas y no tiene una sola a la que apuntar. Salen
      como `42200` sin `data.errores`, hasta que el contrato de cada módulo diga a qué campo van

**De la tarea [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10):**

- [ ] **Guardar el formulario es una sola operación, y por dentro son dos escrituras.** El mockup
      tiene un solo botón, y el modelo tiene dos tablas; partirlo en «editar la ficha» y «registrar
      un costeo» habría mandado dos peticiones y, con ellas, dos transacciones ([20 §5.1](docs/20-contrato-de-api.md#51-la-cabecera)): media
      edición podría quedar escrita. `edicion` recibe el formulario entero y **agrega fila de costo
      solo si el costo o el precio cambiaron**, porque un costeo no se sobrescribe nunca
- [ ] **Editar dos veces el mismo día deja dos costeos con la misma vigencia, y vale el último.**
      `idx_costos_vigencia` no es único y ningún documento dice qué pasa con el empate, así que sin
      esa regla escrita «el costeo de hoy» sería ambiguo el segundo día de trabajo de cualquiera.
      La alternativa era rechazar el segundo guardado del día, que es una edición normal
- [ ] 🔒 **La vigencia no se elige: es el día en que se guarda.** El mockup no tiene campo de fecha,
      y ponerlo sería diseñar una pantalla que nadie diseñó. Retro-fechar un costeo —corregir el
      costo de marzo— **no tiene ruta**, y la [5.5](docs/08-plan-de-desarrollo.md#tarea-5-5) es la que dirá si hace falta
- [ ] **Desactivar un producto escribe en `anulado_*`, y no hay operación de anular.** Es la forma de
      `cargos` ([04 §4.2](docs/04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas)), y `productos` no tiene columnas propias de desactivación. Anular un
      producto —el registro que no debió existir, [RN-13](docs/03-requisitos-y-bdd.md#rn-13)— existe en el dominio y en la tabla, y se queda
      **sin ruta** porque ninguna pantalla lo pinta: el panel del mockup solo desactiva y reactiva
- [ ] **La tarifa por hora la pone la API y no viaja en el formulario**, como no viaja en el mockup:
      sale del pro-labore ([05 §7.1](docs/05-reglas-financieras.md#71-costo-unitario)) y se congela en el costeo. Pero **quién produce no se pregunta**,
      y el documento dice «según quién haga el trabajo»: hoy se toma el pro-labore, que es el único
      que existirá hasta la [7.3](docs/08-plan-de-desarrollo.md#tarea-7-3). Cuando haya empleadas con salario ([8.1](docs/08-plan-de-desarrollo.md#tarea-8-1)), eso es una decisión
      de quien dirige y cambia el contrato
- [ ] **El formulario gana un campo que el mockup no tiene, `unidad`, y pierde el margen objetivo.**
      La columna existe y la semilla la usa —el bordado se cuenta «por servicio»—, así que sin campo
      no habría forma de escribirla; va opcional y con «unidad» por omisión. El margen objetivo, en
      cambio, **no se guarda**: es una pregunta, y va en `POST /api/v0/consultas/costeo`
- [ ] **La vista previa del formulario cuesta una petición por cambio.** Es el precio de que el
      front no calcule plata ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)): el costo, los tres márgenes, la lectura y el precio sugerido
      los da la API. Cada una lleva su clave de idempotencia y su firma, así que el trabajo del front
      tendrá que espaciar las llamadas mientras se escribe
- [ ] **El costo unitario viaja en el costeo y no en los márgenes**, al revés que en el dominio. Un
      producto sin precio no tiene márgenes y **sí tiene costo**, y su lectura lo dice con el monto;
      repetirlo en los dos sitios habría sido mandar dos veces la misma cifra
- [ ] **Dos códigos, no diez.** Las reglas del formulario son `obligatorio` y `minimo` y responden
      `42200`; los choques de estado son el `40900` genérico, como en los cargos. Solo quedan fuera
      el tiempo con más de dos decimales (`42240`) y la falta de pro-labore (`40940`). Quedan libres
      `40941` a `40949` y `42241` a `42249`
- [ ] **El historial de costos se escribe y no se lee.** El [RF-35](docs/03-requisitos-y-bdd.md#rf-35) pide conservarlo, no mostrarlo, y
      ninguna pantalla del [10](docs/10-ux-y-mockups.md) ni del mockup lo pinta: darle consulta sería acordar una pantalla que
      nadie diseñó. Si Gerencia quiere verlo, es una operación nueva y sube la MINOR
- [ ] **El `minutos_maquina` del bordado se cede por nombre.** La columna existe y la tarifa de
      máquina no está en ningún documento, así que el costeo no la declara; la [5.4](docs/08-plan-de-desarrollo.md#tarea-5-4) **no depende de
      este contrato** y, cuando esa decisión exista, el costeo gana el campo
- [ ] **El descriptor gana `numero` y el `porcentaje` del `0.10.0` desaparece.** Los minutos no son
      ninguno de los seis tipos anteriores, y sin tipo el front no puede pintar el campo. De paso, el
      `anticipoPct` del formulario «pedido» se declaraba de un tipo que nunca existió en el contrato

**De las cuatro tareas de Base ([2.21](docs/08-plan-de-desarrollo.md#tarea-2-21), [2.22](docs/08-plan-de-desarrollo.md#tarea-2-22), [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) y [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11)):**

- [ ] **Los eventos con nombre los escribe la función y no el trigger de fila**, y eso se aparta de
      la hoja de ruta, que se los pedía a la variante del trigger. No puede, por dos
      razones: **el motivo de una reactivación no está en la fila** —reactivar deja las tres columnas
      `desactivado_*` en `NULL`, y un trigger solo ve `OLD` y `NEW`— y **un `UPDATE` que cambia el
      nombre y el cargo a la vez tiene que dejar dos entradas**, porque el contrato y el mockup
      pintan una por campo con su «de → a». El [04 §5.4](docs/04-modelo-de-datos.md#54-auditoría-por-triggers) ya repartía así el trabajo
- [ ] **Son cinco acciones nuevas del `CHECK` y no tres.** A las de `usuarios` —`nombre_cambiado`,
      `cargo_cambiado` y `tipo_cambiado`— se suman las dos del catálogo, `cargo_renombrado` y
      `cargo_reactivado`: al cruzar los doce eventos del contrato contra `auditoria_accion_valida`
      faltaban las cinco. Sin ellas, renombrar y reactivar un cargo llegan a la bitácora como
      `UPDATE`, que es justo lo que no distingue una cosa de la otra
- [ ] **`auditoria` gana una columna `motivo`**, en vez de guardarlo dentro de `datos_despues`. El
      contrato lo declara como campo propio de una entrada y el mockup lo captura aparte de los
      valores de antes y después; en el JSON habría que adivinar dónde está según la acción
- [ ] **`cargos.nombre` pasa a `CITEXT` y no a un índice sobre `lower(nombre)`.** Así conserva el
      nombre `cargos_nombre_key`, del que ya cuelga el `42214` en la tabla de traducción de la API, y
      no entra ninguna extensión nueva: `usuarios.usuario` ya la usa
- [ ] **`destino_del_anticipo` es un `TEXT` con `CHECK` y no un ENUM nuevo.** Es el precedente de
      `aportes_retiros.clase`; los ENUM de este modelo son los que viajan por varias tablas, y de un
      ENUM no se quita un valor. Que sea obligatorio depende del pedido y no del campo, así que eso
      lo sigue comprobando la API con el `42235`
- [ ] **Cancelar y anular no comparten columnas en `pedidos`.** Un pedido cancelado y después anulado
      perdería una de las dos historias. Son cuatro columnas nuevas y un `CHECK` propio
- [ ] ⚡ **Tres de las cuatro le dejan trabajo a la API el mismo día.** La [C-01](docs/12-pruebas-y-calidad.md#c-01) cruza `pg_constraint`
      con la tabla de traducción **en las dos direcciones**, así que la fila no se puede poner antes
      de que exista la migración ni después: va en el mismo PR en que la API recoja el esquema. Son
      dos filas por la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) y **tres por la [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11), no dos**; la [2.22](docs/08-plan-de-desarrollo.md#tarea-2-22) no pide ninguna. La
      tercera es la foránea `pedidos_cancelado_por_fkey`: [C-01](docs/12-pruebas-y-calidad.md#c-01) filtra
      `contype IN ('c','u','f','x')`, así que las foráneas también cuentan, y el plan solo había
      contado los dos `CHECK`. Corrida contra el esquema `0.11.0`, la prueba nombra esas tres y
      ninguna otra

**De la tarea [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9):**

- [ ] **Capital estrena el `90`–`99`, que era la reserva.** El reparto de [ADR-019](docs/adr/ADR-019-contrato-de-respuesta.md) no le dio rango, y
      el [21 §4.3](docs/21-trabajo-en-paralelo.md#43-fase-2--rebanadas-verticales-sprints-3-a-8) le había puesto el de Exportación. Se descartó el `20`–`29`, porque a su `422` le quedaban
      tres casos para cinco y Movimientos todavía puede necesitarlos, y mover Exportación, que gasta
      la misma reserva y cambia de rango un módulo ya nombrado. **Ya no queda ningún rango libre.** En
      `prisma_api`, `CatalogoDeCodigos.Modulo` llama `RESERVADO` a ese rango: lo renombra a
      `CAPITAL_Y_PATRIMONIO` la tarea que emita el primero de estos códigos
- [ ] **Diez operaciones y ninguna anulación.** Una escritura y una lectura por cosa que el
      [Sprint 7](docs/08-plan-de-desarrollo.md#sprint-7) hace. Anular un activo, un aporte o un retiro no lo pide ningún RF de capital, no lo
      pinta ninguna pantalla y no lo construye ninguna tarea; se queda sin ruta, como anular un
      producto en la [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10). Mientras tanto se anula su movimiento en el libro, con el problema que
      queda escrito en el [§9](#9-a-vigilar)
- [ ] **Una inversión puede entrar sin cuenta, y entonces no hay movimiento.** Es como entran los
      equipos que el taller ya tenía el día del corte ([09 §4.1](docs/09-plan-de-implantacion.md#41-qué-se-migra-y-qué-no)), cuya plata ya no está en ninguna
      cuenta, y `activos.movimiento_id` admite nulo para eso. **El riesgo:** olvidar la cuenta en una
      compra nueva no le resta a la caja, y el descriptor no sabe decir «obligatoria después del
      corte»; lo dice la ayuda del campo
- [ ] **Un retiro sin pro-labore escrito se parte solo, y resta lo que ya se sacó ese mes.**
      Pro-labore hasta completar el del mes, vigente en la fecha del retiro, y el resto distribución:
      da los $1.500.000 y $500.000 del [BDD-25-1](docs/03-requisitos-y-bdd.md#bdd-25-1). **Descontar lo ya retirado en el mes es una
      decisión**: ningún documento lo escribe, y sin ella dos retiros de $1.000.000 en un mes serían
      $2.000.000 de pro-labore sobre uno de $1.500.000. La persona puede escribir otra partición, y
      solo se rechaza la que pasa del retiro (`42292`)
- [ ] **El id de un retiro no tiene fila propia.** Son una o dos filas de `aportes_retiros`, pares y
      sin columna que las agrupe. El contrato promete lo de siempre —el mismo id dos veces responde
      `40900`— y la [7.4](docs/08-plan-de-desarrollo.md#tarea-7-4) decide cómo, por ejemplo poniéndole ese id a la primera parte. Si algún día
      hay que anular un retiro entero, lo primero es esa columna
- [ ] **La justificación del pro-labore es obligatoria en el formulario y opcional en la base.** La
      tarea se llama «con justificación» ([7.3](docs/08-plan-de-desarrollo.md#tarea-7-3)), y la columna admite nulo, así que la regla la
      sostiene la API. Las horas no son obligatorias, como los minutos del producto, y un pro-labore
      en cero se puede escribir: `valor_mensual` es `dinero` y no `dinero_positivo`
- [ ] **El pro-labore y los sobres rigen desde el día en que se guardan, y su historial se escribe y
      no se lee.** Es lo que la [5.10](docs/08-plan-de-desarrollo.md#tarea-5-10) decidió para el costeo: el mockup no tiene campo de fecha, y
      el [RF-51](docs/03-requisitos-y-bdd.md#rf-51) pide conservar el historial, no mostrarlo. Si Gerencia quiere verlo, es una operación
      nueva y sube la MINOR
- [ ] **El patrimonio y la división del retiro se los niega la API a Operación, no la base.** En
      activos, pro-labore y sobres la base ya le devuelve conjuntos vacíos, y el contrato dice eso.
      Pero el patrimonio sale del libro, que los dos tipos leen: es la decisión pendiente de los
      saldos por cuenta ([3.12](docs/08-plan-de-desarrollo.md#tarea-3-12)), y hasta que se tome el `40300` lo pone un `if`. La división del
      retiro, sin la fila del pro-labore, le daría a Operación una propuesta equivocada con cara de
      cierta, y responde `40300` como la vista previa del costeo
- [ ] **La tasa de retiro no tiene umbral de advertencia.** La lectura va en `critica` cuando las
      distribuciones de 12 meses superan las utilidades ([BDD-24-1](docs/03-requisitos-y-bdd.md#bdd-24-1)) e `informativa` en lo demás. El
      mockup pinta en ámbar una tasa del 78 %, y ningún documento dice desde cuánto una tasa es
      advertencia: ese número lo pone Gerencia, no el contrato
- [ ] **Lo que se cedió, por nombre.** El aviso de caja libre del retiro ([CU-16](docs/02-casos-de-uso.md#cu-16) A1, [BDD-16-2](docs/03-requisitos-y-bdd.md#bdd-16-2)) necesita
      la caja libre de la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1), que depende del retiro: va con la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10). El «por qué» del retiro del
      mes —el margen con y sin pro-labore— es de la 6.10 y de la [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11). La meta de la reserva va con
      el panel de sobres ([7.8](docs/08-plan-de-desarrollo.md#tarea-7-8)). Y la vida útil y los estados del activo no están en ningún documento
- [ ] **Tres de los cinco formularios de capital siguen sin pantalla, y tres tareas no tienen mitad
      Front.** El pro-labore ([7.3](docs/08-plan-de-desarrollo.md#tarea-7-3)) y el activo ([7.1](docs/08-plan-de-desarrollo.md#tarea-7-1)) ya la tienen. El mockup pintaba
      «Inversiones y retiros» solo para consultar, y el [10 §2](docs/10-ux-y-mockups.md#2-mapa-de-navegación) manda el
      pro-labore y los sobres a una «Configuración» sin clave de navegación. Pasa lo que con los
      clientes en la [4.10](docs/08-plan-de-desarrollo.md#tarea-4-10): el contrato acuerda lo que las tareas necesitan y **las pantallas las diseña
      el trabajo del front en el mockup antes de construir**, con la aprobación de quien dirige. Además, la
      [7.4](docs/08-plan-de-desarrollo.md#tarea-7-4), la [7.5](docs/08-plan-de-desarrollo.md#tarea-7-5) y la [7.6](docs/08-plan-de-desarrollo.md#tarea-7-6) son solo API, y la pantalla del [10 §4.5](docs/10-ux-y-mockups.md#45-inversiones-y-retiros) pinta el retiro y el
      patrimonio: o ganan mitad Front, o se dice cuál de las 7.x la lleva
- [ ] **Cinco códigos, todos `422`.** Lo que cabe en el descriptor responde `42200`, y el id repetido
      es el `40900` genérico. Quedan la fecha futura y la cuenta del catálogo, con código del módulo
      como en pedidos y movimientos; el pro-labore que no cabe en el retiro; `suma_cien`, que deja
      de salir sin campo y va sobre `pctRetiro`; y las horas con más de dos decimales. Quedan libres
      `42295` a `42299` y todos los demás estados del rango

**De la tarea [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11):**

- [ ] **Un archivo baja dentro del sobre, en base64, y no como bytes crudos.** Es la primera vez que
      el contrato entrega un archivo, y vale también para la descarga de la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10). Devolver el PDF
      directamente obligaría a la misma ruta a tener **dos formas de respuesta** —el archivo cuando
      sale bien y el sobre cuando sale un `40300` o un `40400`—, y el front tendría que mirar el
      `Content-Type` antes de saber cómo leer lo que le llegó. Se paga un 33 % de tamaño y **el tope
      queda escrito: 5 MB**, el mismo del adjunto de subida. Si la exportación completa del
      [13](docs/13-respaldo-y-exportacion.md) llega a pesar más, esta decisión no le sirve y necesita la suya
- [ ] **El recargo de hora extra viaja en la liquidación porque no tiene dónde vivir.** El
      [06 §6.1](docs/06-nomina-y-capacidad-de-pago.md#61-fórmulas) lo llama «configurable por empleada» y `empleados` **no tiene columna** para él;
      `nomina_detalle` guarda el resultado, `valor_horas_extra`, no la tarifa. Se decidió lo mínimo:
      el formulario `liquidacion` lo pide con 25 % puesto, que es la cifra del ejemplo del documento.
      Si quien dirige lo quiere en la ficha, son una columna y una tarea de Base
- [x] **El importador no guarda historial, y por eso no necesita tabla.** La matriz del
      [03](docs/03-requisitos-y-bdd.md) nombraba una tabla `importaciones` que **ningún documento definía** —lo mismo que pasaba con
      `adjuntos`—. En vez de inventarla, la importación se parte en dos llamadas sin estado entre
      ellas: la consulta lee y no escribe, y `PUT /api/v0/importaciones/{id}` vuelve a recibir el
      archivo y escribe. El mismo id confirmado dos veces responde `40900` por la idempotencia que ya
      existe ([ADR-020](docs/adr/ADR-020-idempotencia.md)), y los duplicados del [BDD-21-3](docs/03-requisitos-y-bdd.md#bdd-21-3) se detectan contra `movimientos`. Si se
      quiere un historial de importaciones, es una tarea nueva. **Resuelto:** quien dirige decidió
      quitarla de la matriz, y el [03 §5](docs/03-requisitos-y-bdd.md#5-matriz-de-trazabilidad) ya no la nombra
- [ ] **El simulador sin pro-labore responde `40950`, y a Operación le responde lo mismo.** El
      [BDD-18-2](docs/03-requisitos-y-bdd.md#bdd-18-2) pide bloquearlo sin pro-labore y el [BDD-02-3](docs/03-requisitos-y-bdd.md#bdd-02-3) pide que a Operación la rechace la base.
      `prolabore_config` lleva RLS y le devuelve cero filas, así que **desde la API los dos casos son
      indistinguibles**: contestar `40300` a uno y `40950` al otro sería que la API vuelva a decidir un
      permiso, que es lo que el [ADR-006](docs/adr/ADR-006-rls-por-rol.md) le prohíbe. Es la misma lectura que hizo la [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) con los
      conjuntos vacíos de `activos` y `sobres_config`
- [ ] **Tres reglas que el contrato promete y `empleados` y `adelantos` no imponen.** La fecha de
      retiro anterior a la de ingreso responde `42250` y **no hay `CHECK` que lo rechace**; y las dos
      tablas tienen las tres columnas de anulación **sin el `CHECK anulacion_con_motivo`** que
      `movimientos` sí lleva ([04 §4.3](docs/04-modelo-de-datos.md#43-movimientos--el-libro-único)), así que hoy se puede anular sin motivo y sin autor. Son del
      mismo tipo que las cuatro que recuperó el trabajo de la base ([2.21](docs/08-plan-de-desarrollo.md#tarea-2-21), [2.22](docs/08-plan-de-desarrollo.md#tarea-2-22), [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) y [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11)) y no están en
      ninguna tarea
- [ ] **Cuatro operaciones de empleada, y ningún RF pide tres de ellas.** El [RF-54](docs/03-requisitos-y-bdd.md#rf-54) solo pide
      registrarlas. La edición, el retiro y la anulación entran porque **las columnas ya existen**
      —`fecha_retiro` y las tres de anulación— y sin operación se quedarían muertas; lo mismo el
      cierre del período de nómina, que es lo único que escribiría `cerrado_en`. Anular un activo o un
      aporte se quedó sin ruta en la [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) por el criterio contrario, y conviene que quien dirige elija
      uno de los dos para todo el contrato
- [ ] **Una cotización no se edita: se anula y se emite otra.** Es un papel que ya se le pasó al
      cliente, y cambiarle el precio por debajo dejaría el PDF que él tiene diciendo otra cosa. El
      catálogo de productos sí se edita, porque nadie se lo llevó impreso
- [ ] **El importador tiene pantalla, y es Configuración**, que es lo que la matriz del [03](docs/03-requisitos-y-bdd.md) le pone a
      [RF-64](docs/03-requisitos-y-bdd.md#rf-64)–[RF-70](docs/03-requisitos-y-bdd.md#rf-70) y el [10 §2.1](docs/10-ux-y-mockups.md#21-navegación-por-rol) le da a Gerencia. **El mockup no la dibuja** y la lista de secciones del
      contrato tampoco la tiene —son ocho y Configuración no está—, que es la discrepancia ya anotada
      más arriba. El Front la diseña antes de construir la [8.10](docs/08-plan-de-desarrollo.md#tarea-8-10). **Se diseñó en Movimientos y no en
      Configuración** ([10 §4.3](docs/10-ux-y-mockups.md#43-movimientos)), por lo mismo que el pro-labore y los sobres
- [ ] **Devolver un adjunto ya tiene forma y sigue sin operación.** El `openapi.json` decía «devolver
      el archivo todavía no está acordado»; ahora dice que la forma es `Documento` y que la operación
      es de la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6). No se metió aquí porque es del rango de movimientos y del sitio de otra tarea
- [ ] 🔒 **Entró una tarea nueva al plan, la [8.12](docs/08-plan-de-desarrollo.md#tarea-8-12), y el total pasa de 140 a 141.** `cotizaciones` y
      `cotizacion_lineas` están en el catálogo y el diagrama del [04](docs/04-modelo-de-datos.md) sin `CREATE TABLE`, el
      [16 §9](docs/16-base-de-datos-y-snapshots.md#9-límites-conocidos-heredados-del-doc-04) decía que quedaban pendientes de especificar y **ninguna tarea las creaba**: la [8.8](docs/08-plan-de-desarrollo.md#tarea-8-8) las
      daba por hechas. Es lo mismo que le pasó a `adjuntos` con el contrato de movimientos, y se
      resolvió igual. La [8.8](docs/08-plan-de-desarrollo.md#tarea-8-8) pasa a depender de ella
- [ ] 🔒 **La [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11) no cabía en el medio día que el [08](docs/08-plan-de-desarrollo.md) le calcula, y no se recortó.** Son cuatro
      módulos y 25 operaciones, contra las 9 de pedidos y las 6 de productos, y como la [7.9](docs/08-plan-de-desarrollo.md#tarea-7-9) sale de los
      documentos en vez de transcribir un dominio ya construido. La cifra del plan no se corrige:
      es la estimación con que se planificó
- [ ] **El [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8) dice cubrir hasta el [RF-69](docs/03-requisitos-y-bdd.md#rf-69) y este contrato llega al [RF-65](docs/03-requisitos-y-bdd.md#rf-65).** Los cuatro que
      faltan no son suyos: la exportación ([RF-66](docs/03-requisitos-y-bdd.md#rf-66)) es de la [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10), la bitácora ([RF-67](docs/03-requisitos-y-bdd.md#rf-67)) ya está en el
      contrato desde el `0.4.0`, «ver anulados» ([RF-68](docs/03-requisitos-y-bdd.md#rf-68)) viaja como `incluirAnulados` en cada consulta,
      y la PWA ([RF-69](docs/03-requisitos-y-bdd.md#rf-69)) no es contrato: es la [9.1](docs/08-plan-de-desarrollo.md#tarea-9-1), que ya está hecha

**De la tarea [6.10](docs/08-plan-de-desarrollo.md#tarea-6-10):**

- [ ] **El Inicio es una sola consulta y no seis.** `POST /api/v0/consultas/tablero` devuelve las
      siete zonas del [10 §4.1](docs/10-ux-y-mockups.md#41-dashboard) juntas. Ninguna se explica sola —la línea que concilia las tres cifras
      necesita los anticipos, y el panel de sobres necesita lo que entró en el mes—, así que
      repartirlas dejaría al front esperándolas todas y juntándolas, que es decidir
      ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)). Es el mismo criterio de `consultas/patrimonio`. **Las alertas viajan dentro**, sin
      ruta propia, porque no se pintan en ninguna otra pantalla; sacarlas es una MINOR
- [ ] **El promedio de ganancias y el punto de equilibrio faltan en vez de valer cero.** El primero
      divide entre meses cerrados —la precondición de [CU-14](docs/02-casos-de-uso.md#cu-14)— y el segundo entre el margen de
      contribución. Sin meses cerrados o con margen no positivo viajan **ausentes**, con una
      `Lectura` que lo explica, que es lo que ya hace `tasaDeRetiro`. Un `$0` en pantalla parece una
      cifra y no lo es
- [ ] **Cerrar un mes no manda cifras, solo el período.** Las once columnas de `cierres_mensuales`
      las calcula la API en la misma transacción. Si el front mandara lo que tiene en pantalla,
      estaría decidiendo el contenido de un registro que nadie puede corregir después ([RN-16](docs/03-requisitos-y-bdd.md#rn-16)), y un
      reporte impreso dejaría de poder creerse. Cerrar el mes en curso responde `40961`: el corte es
      en Bogotá ([RNF-08](docs/03-requisitos-y-bdd.md#rnf-08))
- [ ] **El aviso de caja libre del retiro lo impone la API, no la pantalla.** `DivisionDeRetiro` gana
      la caja libre y su lectura para que la pantalla avise con la cifra delante, y
      `PUT /api/v0/retiros/{id}` rechaza con `40990` el retiro que se pasa y no trae `confirmado`
      ([CU-16](docs/02-casos-de-uso.md#cu-16) A1, [BDD-16-2](docs/03-requisitos-y-bdd.md#bdd-16-2)). El código va en el rango de capital y no en el de reportes, porque **el
      rango dice de qué módulo es la operación que lo emite**, y quien lo emite es el retiro
- [ ] **El saldo por cuenta entró aquí aunque sea del rango de movimientos.** El `0.11.0` dice que
      las cuentas no traen saldo porque «los saldos tienen su propia consulta (tarea [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12))», y esa
      consulta no existía. La 3.12 no depende de ninguna tarea de contrato, así que quien la tomara
      hoy tendría que inventarse la ruta, y [21 §6.3](docs/21-trabajo-en-paralelo.md#63-el-contrato) dice que lo que no está acordado no se implementa.
      **Esta era la última tarea que podía escribirla.** Conviene revisar si eso merecía tarea propia,
      como la tuvieron `adjuntos` ([3.14](docs/08-plan-de-desarrollo.md#tarea-3-14)) y las tablas del cotizador ([8.12](docs/08-plan-de-desarrollo.md#tarea-8-12))
- [ ] 🔒 **El respaldo del [RF-66](docs/03-requisitos-y-bdd.md#rf-66) no es de esta tarea, y no tiene ninguna.** Este mismo
      [§10](#10-decisiones-de-construcción-que-conviene-revisar) lo dio por hecho en la
      [8.11](docs/08-plan-de-desarrollo.md#tarea-8-11), pero [CU-22](docs/02-casos-de-uso.md#cu-22) es «exportar la base completa o de un mes, con manifiesto»: es respaldo,
      del rango `70`–`79`, y no reportes. **No figura en el plan y ningún documento dice qué formato
      tiene**, así que no se inventó. La descarga que sí entró es la del [RF-96](docs/03-requisitos-y-bdd.md#rf-96): lo que el Inicio ya
      muestra, en CSV o PDF
- [ ] **El tablero, el reporte, la descarga y los saldos los niega hoy la API con `40300`.** Son de
      Gerencia ([01 §4](docs/01-vision-y-alcance.md#4-matriz-de-tipos-de-usuario-y-permisos)), pero las cifras salen del libro, que leen los dos tipos, así que la base no
      rechaza sola: es la **misma decisión pendiente** del patrimonio y de los saldos por cuenta, y
      mientras no se tome lo pone un `if`. Los cierres sí los niega la base, con `cierres_solo_gerencia`
- [ ] **Ninguna de las seis operaciones tiene formulario, y el Inicio de Operación no está acordado.**
      Las cinco consultas no piden nada que valide un descriptor, y el cierre solo lleva año y mes:
      no hacía falta ninguno. Y el [10 §2.1](docs/10-ux-y-mockups.md#21-navegación-por-rol) le da a Operación una entrada «Inicio» que no es el dashboard
      —no ve utilidad, ni caja, ni caja libre— y que ningún documento describe. La decide la
      navegación ([2.14](docs/08-plan-de-desarrollo.md#tarea-2-14)), no este contrato
- [ ] **El `Documento` gana `text/csv` y eso toca un esquema del `0.16.0`.** Es una ampliación: las
      rutas que ya existían —el desprendible, la cotización y la remisión— siguen devolviendo solo
      `application/pdf`, así que ningún cliente recibe un valor que no esperaba. Si alguna vez la
      descarga necesitara XLSX, es otra ampliación igual

**De la versión en cada PR ([ADR-034](docs/adr/ADR-034-la-version-sube-en-cada-pr.md)):**

- [ ] **Sin sesión, `esquema` responde `desconocido`.** La consulta de versión es anónima —el front la
      hace antes de que nadie entre—, y leer la base sin identidad habría sido la primera excepción al
      [ADR-012](docs/adr/ADR-012-identidad-a-postgres.md), además de atar la comprobación del MAJOR a que la base conteste. Con sesión se lee
      dentro de la transacción que ya abrió el filtro de idempotencia, que es el caso del panel.
      **El contrato no lo dice**: la descripción del campo sigue siendo «Versión del esquema de base
      de datos», y cambiarla es cambiar el contrato. Queda para el próximo que se acuerde, igual que
      volver el campo opcional, que era la otra salida limpia y no había versión del contrato que
      la API pudiera fijar con solo ese cambio
- [ ] **La versión que muestra el panel es la última de `schema_version` por `aplicada_en`, y por
      SemVer si empatan**, que es la misma consulta del bloque `1.12` de `verificar-base.sql`. La
      prueba de integración calcula lo esperado solo por SemVer, para que las dos no puedan
      torcerse juntas
- [ ] **`prisma.esquema` deja de ser la variable `PRISMA_ESQUEMA` y pasa a `0.3.0` fijo.** Es lo que
      el artefacto necesita, y eso viaja con el artefacto, no con el ambiente. Nada la lee todavía:
      la leerán la sonda del [ADR-025](docs/adr/ADR-025-cuatro-repositorios.md) y la tubería del [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md). Si en Railway hay una `PRISMA_ESQUEMA`, ya no
      hace nada
- [ ] **Un paso por PR, y ni uno más.** La puerta no distingue una corrección de una función nueva
      —eso lo decide quien escribe—, pero sí rechaza saltarse números. [19 §4.2](docs/19-ambientes-y-entrega.md#42-las-reglas) define PATCH, MINOR y
      MAJOR para la API; para el front y el esquema se usaron las mismas palabras: corrige, agrega o
      rompe
- [ ] **Lo que no se publica, por repositorio.** En el front: `test/`, `tool/`, `.github/`, el README,
      la licencia, `.gitignore`, `.gitattributes`, `.metadata`, `analysis_options.yaml` y
      `railway.json`. En la API: `src/test/`, `contrato/`, `.github/`, el README, la licencia, los dos
      de git, `.env.ejemplo` y `railway.json`. **`railway.json` no pide versión** —cambia cómo se
      despliega, no lo que se despliega— y **`.dockerignore` sí**, porque cambia lo que entra a la
      imagen. Lo que no esté en la lista pide versión, carpetas nuevas incluidas
- [ ] **El número de compilación del front sube de uno en uno con la versión, y solo con ella.** Ningún
      documento decía cómo se mueve; es el `versionCode` de Android y tiene que crecer, y atarlo a la
      versión lo vuelve el conteo de versiones publicadas
- [ ] **La puerta corre también en el empuje a `develop`, y no en `main`.** En el empuje es la segunda
      cerradura: lo que entre sin subir la versión deja la integración continua en rojo y Railway no
      despliega. A `main` llega `develop` entero, con varios pasos juntos
- [ ] **La versión del esquema se publica en la última migración del PR**, y el bloque `1.12` de
      `verificar-base.sql` cambia en ese mismo PR. La etiqueta `esquema-vX.Y.Z` del [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) se sigue
      poniendo a mano después de fusionar: automatizarla es que la integración continua escriba en
      el repositorio, y eso no se decidió
- [ ] **La puesta al día fue un MINOR en los dos proyectos**: el front de `0.2.0+2` a `0.3.0+3` y la
      API de `0.2.0` a `0.3.0`. No se reconstruyeron las versiones que habría habido si cada PR hubiera
      subido la suya, por la misma razón por la que [22 §3](docs/22-documentacion.md#3-versiones) no reconstruyó las de los documentos.
      Que los dos queden en `0.3.0` es coincidencia, no sincronización
- [ ] **Las cadenas del guion de `prisma_db` van sin tildes.** Windows PowerShell 5.1 lee un `.ps1`
      sin BOM como ANSI, y una raya dentro de una cadena se vuelve una comilla tipográfica que cierra
      la cadena. Los demás guiones no llevan BOM, y ponérselo a uno solo sería una excepción más

**De poner el tablero al día:**

- [ ] 🔒 **La [0.8](docs/08-plan-de-desarrollo.md#tarea-0-8) y la [0.9](docs/08-plan-de-desarrollo.md#tarea-0-9) se marcaron sin PR de tarea propio.** Las dos llevaban 🚧 desde
      el 2026-09-17 y su trabajo ya estaba fusionado; lo que faltaba era mirar si había surtido
      efecto, y lo había. Se marcan en este PR de tablero y no en el de su tarea, como pide el
      [21 §6.5](docs/21-trabajo-en-paralelo.md#65-ramas-e-integración), porque esos PR entraron hace dos días

**De la entrada de la 3.16 al 08:**

- [ ] 🔒 **Entró una tarea nueva al plan, la [3.16](docs/08-plan-de-desarrollo.md#tarea-3-16), y el total pasa de 139 a 140.** El
      [H4](docs/08-plan-de-desarrollo.md#h4) se cronometra en un celular y el front no tiene diseño para uno: la barra
      lateral mide 224 px en cualquier pantalla. El mockup sí lo diseñó —por debajo de 760 px la barra
      pasa arriba y el menú se desplaza de lado—, así que era trabajo real que no estaba en ninguna
      parte, como le pasó a la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) y a las cuatro tareas de Base
- [ ] 🔒 **Una tarea propia y no parte de la [3.5](docs/08-plan-de-desarrollo.md#tarea-3-5).** El registro rápido es de Movimientos; el
      diseño para celular toca el andamio de **todas** las pantallas —la barra, el topbar, las dos
      franjas y el botón flotante—, y meterlo dentro habría hecho dos cosas en un commit, que es lo
      que el [ADR-028](docs/adr/ADR-028-un-commit-por-tarea.md) prohíbe
- [ ] 🔒 **La [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) pasa a depender de ella y la [3.5](docs/08-plan-de-desarrollo.md#tarea-3-5) no.** El cronómetro del
      [M-01](docs/12-pruebas-y-calidad.md#m-01) se corre con la 3.6 —el gasto con foto— en un celular de verdad, así que sin la
      3.16 el [H4](docs/08-plan-de-desarrollo.md#h4) no se puede medir. El registro rápido, en cambio, se construye y se prueba en
      escritorio, y hacerlo esperar lo habría frenado sin que el [H4](docs/08-plan-de-desarrollo.md#h4) ganara nada
- [ ] **En el [Sprint 3](docs/08-plan-de-desarrollo.md#sprint-3) y no en el [9](docs/08-plan-de-desarrollo.md#sprint-9)**, donde están la PWA y el endurecimiento. El [H4](docs/08-plan-de-desarrollo.md#h4) es
      del [Sprint 3](docs/08-plan-de-desarrollo.md#sprint-3), y esperar al 9 para ver la aplicación en un celular sería medirlo meses después

**De la 3.5:**

- [ ] **La clave de una sección solo puede escribirse en un archivo, y es una excepción nombrada en
      la prueba de la frontera.** El contrato pide las dos cosas a la vez —el menú lo dicta la API
      ([RF-103](docs/03-requisitos-y-bdd.md#rf-103)) y «una clave que el front no conoce no se pinta»—, así que el front tiene que
      conocer las claves de las pantallas que sabe pintar. Con `registro_de_secciones.dart` exento
      por nombre, qué secciones existen y cómo se llaman lo sigue decidiendo el servidor, y la
      prueba sigue cazando a quien escriba una clave en cualquier otro sitio. Es el patrón con el
      que ya conviven `http` y `crypto`. **La primera sección la necesitaba: sacarla a una tarea
      aparte habría dejado la 3.5 esperando por algo que ella misma estrena**
- [ ] **El botón flotante pregunta por la posición, no por la clave.** El [10 §4.3](docs/10-ux-y-mockups.md#43-movimientos) dice que flota
      sobre todas las pantallas menos el Inicio, porque el Inicio no escribe; cuál es el Inicio ya lo
      decide la API desde la [2.14](docs/08-plan-de-desarrollo.md#tarea-2-14) —es la primera sección que manda, y la que se abre al entrar—.
      Preguntar «es la primera» en vez de «se llama dashboard» cumple el 10 sin que el andamio sepa
      cómo se llama ninguna sección
- [ ] **Se encola siempre, también con señal.** `encolar` guarda la intención y **después** intenta
      enviarla, así que el camino es el mismo con red y sin ella y no hay dos rutas de escritura que
      mantener. Un `null` no es un fallo: es «se guardó y se sigue intentando»
- [ ] **El botón dice «Guardar movimiento» y el mockup decía «Guardar gasto»**, por lo mismo que la
      [3.13](docs/08-plan-de-desarrollo.md#tarea-3-13) adaptó los textos: el formulario cubre los tres tipos. **Y el aviso de «Pendiente de
      sincronizar» no tiene diseño en el mockup**: se pintó como píldora dentro del panel, que es el
      componente que el [17](docs/17-resiliencia-offline-y-cache.md) pide y el sistema de diseño ya tiene
- [ ] ⚡ **La pantalla todavía no se ha visto contra la API de verdad**, porque el formulario
      «movimiento» lo emite la [3.4](docs/08-plan-de-desarrollo.md#tarea-3-4) y no está fusionada. Se probó contra un descriptor de fixture
      copiado del contrato y, en el navegador, el camino de «el servidor respondió y no mandó
      formulario». **Queda por hacer en cuanto la 3.4 llegue a `develop`**, y antes del cronómetro
      del [M-01](docs/12-pruebas-y-calidad.md#m-01)

**De la 3.16:**

- [ ] **El corte es 760, y 760 ya es celular.** Es el `@media (max-width:760px)` del mockup, y
      `max-width` incluye su valor. Se pregunta en un solo sitio, `disposicion.dart`, para que el
      andamio y las pantallas no puedan partir en anchos distintos. **Un celular acostado mide más
      de 760 y recibe el andamio de escritorio**, igual que en el mockup
- [ ] **La insignia va al pie de la pantalla, no al final de lo que se desplaza.** El mockup la deja
      caer al final del contenido porque ahí se desplaza la página entera; en el front cada pantalla
      se desplaza por dentro, y el [10 §5.7](docs/10-ux-y-mockups.md#57-la-versión-y-el-ambiente-a-la-vista) pide conservar la esquina, no el mecanismo. En el pie **el
      teclado la tapa en vez de empujarla**, y el botón flotante se acomoda solo encima de ella
- [ ] **Las pestañas se tocan en 44 px de alto aunque se vean de 31**, como las del mockup: el
      [10 §3.3](docs/10-ux-y-mockups.md#33-accesibilidad) pide 44 × 44 como mínimo y manda sobre el mockup. Y **el menú de lado también se
      arrastra con el ratón**, porque sin barra de desplazamiento una ventana angosta en un computador
      no tenía otra forma de llegar a la última sección
- [ ] **Las franjas siguen arriba de todo en el celular.** En el mockup van dentro del `.topbar`; en
      el front van encima del andamio desde que existen, y moverlas solo en el celular haría que el
      mismo aviso viviera en dos sitios según el ancho
- [ ] **`TopbarSesion` no cambió:** entre 600 y 760 px el front muestra el cargo que el mockup
      esconde. Por debajo de 600 los dos lo esconden, y el front además pone iniciales, como pide el
      [10 §5.3](docs/10-ux-y-mockups.md#53-la-sesión-en-el-topbar)
- [ ] **La tarjeta de las secciones sin pantalla se desplaza y ya no dice «el menú de la
      izquierda»**: a 320 px con las dos franjas puestas no cabía, y en el celular el menú ya no está
      a la izquierda
- [ ] ⚡ **El andamio no se ha visto en un celular de verdad.** Se probó a 375, 320 y 1280 px en las
      pruebas, y en el navegador con la vista de celular a 375 contra una API simulada. **Queda por
      hacer en un teléfono**, antes del cronómetro del [M-01](docs/12-pruebas-y-calidad.md#m-01)

**De la 3.14:**

- [ ] ⚡ **Ningún documento decía con qué credencial habla la API con Storage.** El [07 §1](docs/07-arquitectura.md) dice que
      el archivo pasa por la API y nunca va directo al almacenamiento, y ahí se acaba. Se decidió
      que el bucket lo alcanza **`authenticated`**, con el token de la sesión que la API ya
      comprobó, y no `service_role`: el [ADR-033](docs/adr/ADR-033-service-role-solo-en-auth.md) acotó esa clave a dos operaciones de GoTrue y
      Storage no puede ser la tercera. Así el permiso sigue viviendo en PostgreSQL ([ADR-006](docs/adr/ADR-006-rls-por-rol.md)). **La
      [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) lo confirmó**: sube con el token de la sesión y contra el Storage de verdad, y las dos
      políticas de `storage.objects` lo dejan pasar
- [ ] **El techo de 5 MB y los cuatro tipos están escritos dos veces**, en el bucket y en el `CHECK`
      de la tabla. No es descuido: el bucket impide que los bytes lleguen a guardarse y el `CHECK`
      impide que se guarde una ficha que miente sobre lo que se guardó. La API los vuelve a
      preguntar para poder contestar `40020` y `40021` con su mensaje, pero **no es la única que
      pregunta** ([ADR-015](docs/adr/ADR-015-validacion-tres-capas.md))
- [x] **La tabla de traducción ya tiene las nueve filas de `adjuntos`**, y con la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6) tres de
      ellas llevan su código propio: el `40020` del techo, el `40021` de los tipos y el `40400` de
      la foránea del movimiento. [C-01](docs/12-pruebas-y-calidad.md#c-01) cruza la tabla con `pg_constraint` en las dos direcciones y
      está en verde
- [ ] **`adjuntos` va al final del [§4](docs/04-modelo-de-datos.md#4-esquema-sql) y no junto a `movimientos`, que es su sitio.** Los números
      de esas secciones se citan por todo el proyecto —`§4.9` son las claves de idempotencia en once
      sitios—, y correr las ocho siguientes un puesto dejaría cada cita apuntando en silencio a otra
      sección. Es lo mismo que se hizo con `sesiones` en la [2.20](docs/08-plan-de-desarrollo.md#tarea-2-20)
- [ ] **La semilla no siembra ningún adjunto.** `adjuntos` no lleva RLS, así que ninguna de las
      pruebas de permisos la lee, y una fila sembrada apuntaría a un objeto que no está en el
      bucket: una ficha que miente
- [x] **El bucket ya se vio rechazar un archivo**, con la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6): la pila local levanta Storage
      desde su `config.toml`, y contra el servicio de verdad un PDF de 6 MB y un `image/gif` no
      llegan a guardarse. Antes el techo y los cuatro tipos solo se habían comprobado leyendo
      `storage.buckets` y `pg_policy`, que es mirar la configuración y no el comportamiento
- [ ] **El esquema pasó a `0.4.0` y no a `0.3.1`**, como la `0.2.0` y la `0.3.0`: una tabla nueva es
      MINOR mientras todo siga en `0.y.z`. Qué cuenta como cada cosa en el esquema **sigue sin estar
      escrito en ningún documento**

**De la tarea [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10):**

- [ ] **El orden en que se pintan las categorías no lo dice ningún documento.** El contrato pide «el
      árbol […] en el orden en que se pintan» y `categorias` no tiene columna `orden`, así que hubo
      que elegirlo: primero los ingresos y después los gastos, luego por familia —el nombre de la
      madre, o el propio si es principal— y dentro de cada una la madre antes que sus hijas,
      alfabéticas. Así el front pinta la lista como llega y no reordena nada. **Los ingresos
      primero se escribe con un `CASE`**: alfabéticamente «gasto» va antes que «ingreso», así que
      `ORDER BY naturaleza` daría lo contrario de lo que el contrato enuncia
- [ ] **Una cuenta nueva se pinta al final**, con `orden` = el mayor que haya más uno. El contrato
      no le da campo `orden` al formulario «cuenta» y ningún documento dice qué lugar le toca a una
      cuenta recién abierta. Reordenarlas es otra pantalla que nadie ha pedido
- [ ] **El panel de categorías no tiene mockup.** El [10 §4.3](docs/10-ux-y-mockups.md) diseñó el de «Cuentas de dinero» y no
      dijo nada del de categorías, que esta tarea también pide. Se hizo **el mismo panel con el otro
      formulario**: inventarle una pantalla propia habría sido decidir diseño, y dejarlo fuera
      habría dejado a Gerencia sin manera de crear una categoría, con lo que la lista del registro
      rápido no podría crecer
- [ ] **`prisma.contrato.version` se queda en `0.14.0` aunque el acordado vaya en `0.16.0`.** La API
      ya emite el campo que estrena el `0.16.0`, pero **no implementa el `0.15.0`** —nómina y
      cotizaciones—, así que subirla sería afirmar algo falso. Qué número declara un artefacto que
      implementa partes sueltas de dos versiones no está escrito en ningún documento. **Lo respondió
      la [3.12](docs/08-plan-de-desarrollo.md#tarea-3-12)**, al principio de esta sección
- [ ] **Un nombre de cuenta o de categoría no tiene largo máximo.** Se probó a ponerle uno y se
      quitó: el contrato no lo declara y la columna es `TEXT`, así que el `@Size` habría sido una
      regla inventada en el código. Si hace falta, se acuerda en el contrato primero

**Del arreglo de los mensajes de `adjuntos`:**

- [x] **El tamaño y el tipo de un adjunto ya salen con su código**, desde la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6): `40020` el
      archivo que pasa de 5 MB y `40021` el que no es foto ni PDF. Estuvieron un tiempo saliendo con
      el `42200` transversal a propósito —emitirlos sin que ninguna ruta subiera nada habría
      afirmado algo que no pasaba—, que es el mismo camino que siguieron los de `movimientos` entre
      la [1.8](docs/08-plan-de-desarrollo.md#tarea-1-8) y la [3.4](docs/08-plan-de-desarrollo.md#tarea-3-4)
- [ ] **Las filas de una tabla nueva no tienen dueño mientras su tarea de API esté lejos.** El plan
      de la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) dijo que las agregaría «`prisma_api` en el mismo PR en que recoja este esquema»,
      y ese PR fue el de la [3.6](docs/08-plan-de-desarrollo.md#tarea-3-6), tres tareas más allá. Entre una cosa y otra, [C-01](docs/12-pruebas-y-calidad.md#c-01) estuvo
      días en rojo contra cualquier base con la `0.4.0`. **Sigue sin decidirse si una tarea de Base
      que agrega tabla debe pedir sus filas en el mismo sprint**, como ya hacen la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) y la
      [4.11](docs/08-plan-de-desarrollo.md#tarea-4-11) con las suyas

**De partir la 0.4:**

- [ ] **El rol `prisma_api` sigue prometiendo cuatro ambientes y solo existe en dos.** La tarea que
      lo crea ([0.5](docs/08-plan-de-desarrollo.md#tarea-0-5)) dice «en los cuatro», lleva marcada desde el primer día y el rol vive solo en
      dev y en qa: es el mismo desajuste que se le acaba de arreglar a la 0.4. No se partió también
      porque nadie lo pidió y porque parte de ese trabajo ya cae dentro de la [9.2](docs/08-plan-de-desarrollo.md#tarea-9-2), que levanta uat.
      **Conviene decidir si se parte igual que la 0.4 o si la 9.2 y la [9.3](docs/08-plan-de-desarrollo.md#tarea-9-3) se hacen cargo del rol**
- [ ] **El `README` de `prisma_db` dice que la 0.4 «sigue abierta», y desde hoy no.** Vive en otro
      repositorio ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md)), con su propio PR y su propia versión, así que no se tocó desde aquí:
      se corrige en el primer PR que toque ese repositorio

**De la tarea [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7):**

- [ ] **[P-32](docs/12-pruebas-y-calidad.md#p-32) se hizo sin la bandera de configuración que pide el [12 §3.1](docs/12-pruebas-y-calidad.md#p-32).** El documento manda
      desactivar «la comprobación de la capa de aplicación» con una bandera que solo valga en dev y en
      qa. **En esta API no hay ninguna comprobación que desactivar**: ni una clase de `aplicacion` mira
      el tipo de usuario, por diseño ([ADR-012](docs/adr/ADR-012-identidad-a-postgres.md)), y todo `SinPermiso` nace de un `42501` que traduce
      `RechazoDeLaBase`. Una bandera que no apaga nada sería configuración muerta que encima parece que
      protege algo. En su lugar la prueba corre la misma lectura **sin capa de aplicación ninguna**, que
      es más fuerte que apagar un `if`. **Si algún día una clase de aplicación filtra por tipo, la
      bandera tiene que existir**
- [ ] **De las tres lecturas de [P-32](docs/12-pruebas-y-calidad.md#p-32) solo `usuarios` se pudo comparar.** `/consultas/nomina` y
      `/consultas/patrimonio` no existen —son del [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8) y del [Sprint 7](docs/08-plan-de-desarrollo.md#sprint-7)—, así que las otras dos se leen sin
      capa de aplicación y se afirma que salen vacías. **Cuando existan sus endpoints hay que volver a
      esta prueba** y cerrarles la comparación
- [ ] **Las pruebas cuya tabla todavía no tiene endpoint van por `ConIdentidad`**, con los claims de la
      sesión real, en vez de saltarse. El [12 §3](docs/12-pruebas-y-calidad.md#3-pruebas-de-permisos) las quiere «llamando a la API», y catorce de las tablas que
      enumera no tienen ruta hasta los sprints 4 a 8. Esperar habría sido descubrir en el [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8) que
      una política nunca estuvo. `ConIdentidad` es la única puerta de la API a la base, así que la
      política que juzga ahí es la misma que juzgará al endpoint
- [ ] **[P-02](docs/12-pruebas-y-calidad.md#p-02) y [P-06](docs/12-pruebas-y-calidad.md#p-06) dicen «Rechazado» para una lectura, y una lectura con RLS no se rechaza: llega
      vacía.** Es la distinción que el propio [12 §3](docs/12-pruebas-y-calidad.md#3-pruebas-de-permisos) explica dos párrafos más abajo. Las dos se escribieron
      como conjunto vacío, y además se comprueba que la tabla tiene filas de verdad. **Conviene
      corregir esas dos celdas del documento**
- [ ] **El trabajo nuevo de la tubería no se pudo probar desde aquí, y le falta un secreto.**
      `Finanzas-PRISMA-DB` es privado, así que el trabajo necesita `PRISMA_DB_TOKEN` en `prisma_api`, y
      ese no lo puede poner el código. Hasta que esté, el trabajo falla, y falla claro
- [ ] **`prisma_db` llevaba dos versiones del esquema sin etiquetar**, la `0.4.0` y la `0.5.0`, que el
      punto 1 del [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) da por hechas y de las que cuelga la tubería entera. Se escribieron y se
      empujaron sobre los commits de fusión de la [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14) y la [1.10](docs/08-plan-de-desarrollo.md#tarea-1-10), como la `esquema-v0.3.0`.
      **Conviene decidir quién etiqueta y cuándo**: el ADR dice que una migración fusionada sin
      etiquetar no existe para nadie más, pero ninguna tarea del plan lo tiene como paso, y por eso se
      saltaron dos seguidas

**De la primera corrida de la tubería de integración (tarea [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7)):**

- [ ] 🔒 **Dos pruebas de la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) se apoyaban en un número que ningún archivo decía.** Crean un usuario con
      la contraseña `x` y esperan que GoTrue la rechace por débil. En esta máquina el contenedor
      trae `GOTRUE_PASSWORD_MIN_LENGTH=6` y pasaban; en la tubería el alta **se aceptó** y salieron
      rojas, porque `config.toml` no declaraba `minimum_password_length` y cada versión del CLI
      pone la suya. Quedó escrito en `prisma_db`, con el 6 que ya había. **Una política que nadie
      escribe es una política que cambia sola**, y llevaba desde la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) sin que se notara porque
      nadie corría esas pruebas fuera de esta máquina.
      **No era eso**: con el 6 ya escrito siguieron rojas. Lo que cambiaba era la versión de GoTrue,
      y está en «Del arreglo de GoTrue en la tubería»
- [x] **Un cambio de `config.toml` no llega a la tubería hasta que se publique una versión nueva del
      esquema.** El [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) manda descargar `prisma_db` **en la etiqueta**, y la etiqueta lleva el número
      de `schema_version`; pero `config.toml` no es esquema y subir ese número por un cambio de
      configuración sería afirmar algo falso. **Decidido: lo arrastra la próxima migración**, que es
      la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) —la que esta misma corrida acabó de probar que hace falta—. Al publicarse el
      esquema siguiente, su etiqueta ya lleva el `config.toml` escrito, y el [ADR-029](docs/adr/ADR-029-esquema-por-etiqueta.md) se queda
      como está. De ahí sale el orden: la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) publica y se etiqueta, y **el PR de la API que suba
      su `prisma.esquema` a esa versión** es el que pone verdes las dos pruebas de GoTrue y el que
      lleva las dos filas de traducción que la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) pide. Hasta entonces esas dos siguen rojas.
      **No las puso verdes**: la API ya pide el esquema `0.9.0` y seguían rojas; ver «Del arreglo de
      GoTrue en la tubería»
- [x] **Una prueba con `LocalDate.now()` depende de en qué huso corre.** [P-08](docs/12-pruebas-y-calidad.md#p-08) registraba un
      movimiento con la fecha del reloj de la máquina, y el ejecutor va en UTC: entre las 7 de la
      noche y la medianoche de Bogotá le mandaba mañana, y la API la rechazaba con `42223`, que es
      lo correcto. Arreglado con `ZonaDelNegocio`, y **buscadas las demás**: en `prisma_api` no
      queda ninguna —`src/main` no lee el reloj sin huso, y las dos lecturas que hay en las
      pruebas pasan `ZonaDelNegocio.BOGOTA`—, y en `prisma_front` el calendario toma el reloj del
      aparato solo para saber hasta dónde se puede desplazar, que no es la regla de qué fecha vale.
      **Donde sigue es en la base**: `fecha_no_futura` compara contra `CURRENT_DATE`, que va en el
      huso de la sesión, y la sesión va en `UTC` —a las ocho de la noche del 19 en Bogotá, la base
      local contesta `2026-09-20`—, así que acepta el mañana que la API rechaza con `42223`. Eso
      ya es la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15), y esta es la comprobación de que hace falta ([RNF-08](docs/03-requisitos-y-bdd.md#rnf-08)).
      **Hecha**: desde el esquema `0.6.0` la restricción compara contra el día de Bogotá

**De la 3.15:**

- [ ] **La zona del negocio va escrita en la restricción, no en la sesión.** `fecha_no_futura`
      compara contra `(NOW() AT TIME ZONE 'America/Bogota')::date`. La alternativa era ponerle la
      zona al rol o a la base y dejar `CURRENT_DATE`, y se descarta por lo que dice el
      [RNF-08](docs/03-requisitos-y-bdd.md#rnf-08) y ya aplica el dominio con `ZonaDelNegocio`: **la zona es del modelo y no del
      ambiente**. Una configuración se cambia sin tocar ninguna migración, no viaja en la etiqueta
      del esquema y no se ve al leer la tabla. Tampoco se envolvió en un `fn_hoy_bogota()`: sería
      un objeto más que mantener y auditar para ahorrar una línea que se lee igual que la regla
- [ ] ⚡ **La tabla de traducción se queda sin las dos filas del destino hasta el PR de la API que
      suba su `prisma.esquema` a `0.6.0`.** Es el orden que fijan el [04 §11](docs/04-modelo-de-datos.md#11-el-contrato-de-errores) y esta misma
      lista, y la 3.15 es del trabajo de la base: la tabla vive en `prisma_api`. **Mientras tanto,
      [C-01](docs/12-pruebas-y-calidad.md#c-01) sale roja contra cualquier base que ya tenga la `0.6.0`**, igual que pasó con la
      [3.14](docs/08-plan-de-desarrollo.md#tarea-3-14). Ese mismo PR es el que pone verdes las dos pruebas de GoTrue que esperaban el
      `config.toml`, porque la etiqueta `esquema-v0.6.0` es la que por fin lo lleva.
      **Eso último no pasó**: la etiqueta lo llevó y las dos de GoTrue siguieron rojas; ver «Del
      arreglo de GoTrue en la tubería»
- [ ] **El esquema pasó a `0.6.0` y no a `0.5.1`.** Apretar una regla es MINOR mientras todo siga
      en `0.y.z`: lo que estas restricciones rechazan es lo que el dominio de la API ya rechazaba,
      así que ninguna API que hoy corra se queda sin escribir algo que escribía. Qué cuenta como
      cada cosa en el esquema **sigue sin estar escrito en ningún documento**
- [ ] **Una comprobación del propio guion pasaba por el motivo equivocado.** La fila de la
      [1.1](docs/08-plan-de-desarrollo.md#tarea-1-1) que prueba `dinero_positivo` registraba el movimiento con `CURRENT_DATE`, así que
      desde esta migración habría salido verde por `fecha_no_futura` y no por el dominio que dice
      estar probando. Pasó al día de Bogotá, como el resto
- [ ] **`v_saldos_cuenta` no se tocó.** La vista resta la salida y suma la entrada por separado, y
      con la transferencia a la misma cuenta imposible en el origen deja de tener con qué
      equivocarse. Reescribirla sería arreglar un síntoma que ya no puede ocurrir

**De la 1.15:**

- [ ] **El corte de verdad se hace matando la conexión, y lo mata el dueño.** El [12 §10.1](docs/12-pruebas-y-calidad.md#101-i-02--el-corte-es-lo-que-hace-real-la-idempotencia) pide
      inyectar un fallo y no dice cómo. Una excepción de Java prueba el camino amable: la atiende
      el propio proceso, y lo que revierte es un `rollback` que alguien alcanzó a pedir. Con
      `pg_terminate_backend` no hay quien lo pida, que es lo que pasa cuando el contenedor muere.
      Lo dispara el dueño desde fuera porque dentro de la transacción la API es `authenticated`
      ([ADR-012](docs/adr/ADR-012-identidad-a-postgres.md)) y ese rol no puede señalar a un proceso de `prisma_api`
- [ ] 🔒 **Ocho pruebas de la [1.14](docs/08-plan-de-desarrollo.md#tarea-1-14) y una de la [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7) escribían el movimiento con
      `current_date`**, que es el día del huso con que se conecte el pool. Contra el esquema
      `0.6.0` —que juzga con el día de Bogotá— y con la JVM en UTC, como va la tubería, **las
      nueve salen rojas de siete a doce de la noche**. Arregladas con `ZonaDelNegocio`, que es de
      donde tiene que salir la fecha ([RNF-08](docs/03-requisitos-y-bdd.md#rnf-08)), y comprobadas corriendo la JVM en UTC a
      esa hora. **Es la tercera vez que aparece la misma trampa** —[P-08](docs/12-pruebas-y-calidad.md#p-08) en la [1.7](docs/08-plan-de-desarrollo.md#tarea-1-7), una
      fila de `verificar-base.sql` en la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) y estas nueve—, y las tres se vieron solo
      porque alguien corrió las pruebas en otro huso

**De la 1.21:**

- [ ] **El `EXECUTE` de las cinco funciones entra en la migración, y el bloque del [04 §9.1](docs/04-modelo-de-datos.md#91-anon-no-toca-nada) no lo
      nombra.** El documento revoca tablas y secuencias, y deja fuera `fn_es_gerencia`,
      `fn_auditar`, `fn_congelar_ficha_propia`, `fn_proteger_ultima_gerencia` y
      `fn_verificar_gerencia_restante`, las cinco `SECURITY DEFINER` y dueñas de `postgres`. Hoy no
      filtran nada —`fn_es_gerencia()` con `anon` devuelve `false`, porque `auth.uid()` viene nulo,
      y las otras cuatro devuelven `trigger`, que PostgreSQL no deja llamar directamente—, pero el
      título de la tarea es «`anon` no toca nada». Mismo criterio que la [1.2](docs/08-plan-de-desarrollo.md#tarea-1-2), que revocó el
      borrado a tres roles y no solo al que el [04 §5.1](docs/04-modelo-de-datos.md#51-revocación-real-del-borrado) alcanzaba a nombrar
- [ ] **Y ahí apareció la trampa: `prisma_api` tenía ese `EXECUTE` por `PUBLIC` y no por una
      concesión suya.** Quitárselo a `anon` obliga a revocárselo a `PUBLIC`, y eso se lo quita
      también al rol con el que se conecta la API; la migración se lo vuelve a conceder en la
      sentencia siguiente. Aplicada sin ese `GRANT` —a propósito, para verla fallar—, la prueba de
      integración «sin identidad no se ve nada: la base falla cerrado» responde
      `permission denied for function fn_es_gerencia`: lo que se rompe son las consultas que la API
      hace **sin** asumir identidad, porque las que hacen `SET LOCAL ROLE authenticated` sí tienen
      concesión propia. **Le puede volver a pasar a cualquier revocación a `PUBLIC`**, y nada lo
      avisa: `prisma_api` no figura en los `GRANT` de las funciones del esquema inicial
- [ ] **`REVOKE USAGE ON SCHEMA public FROM anon` no le quita el `USAGE`, y la migración lo escribe
      igual.** El esquema se lo concede dos veces, a `anon` y a `PUBLIC`, y la segunda sobrevive:
      después de la migración `has_schema_privilege('anon','public','USAGE')` sigue diciendo `t`. No
      importa —entrar a un esquema donde no se tiene permiso sobre ninguna tabla, ninguna secuencia
      y ninguna función no alcanza para nada— y por eso ninguna fila de `verificar-base.sql` lo
      pregunta. Cerrarlo de verdad sería revocarle el `USAGE` a `PUBLIC`, que le pega a roles que
      esta tarea no tiene por qué tocar, `authenticator` entre ellos
- [ ] **`service_role` se queda con exactamente los permisos que tenía `anon`**: `SELECT`, `INSERT`,
      `UPDATE`, `REFERENCES` y `TRIGGER` sobre las 32 relaciones de `public`. El [ADR-033](docs/adr/ADR-033-service-role-solo-en-auth.md) dice que
      contra PostgreSQL no se usa nunca, así que le sobran todos. No entró en esta migración porque
      su clave es un secreto del despliegue y no una clave pública: no es el mismo riesgo ni la
      misma tarea, y toca el camino por el que Gerencia da de alta a alguien ([2.7](docs/08-plan-de-desarrollo.md#tarea-2-7)). Queda para que
      lo decida quien dirige

**De la 2.21:**

- [ ] **Toda función nueva nace abierta a `PUBLIC`, y a partir de aquí es una regla y no una
      anécdota.** PostgreSQL le concede el `EXECUTE` a `PUBLIC` por omisión, así que
      `fn_registrar_evento` —que escribe en `auditoria` corriendo como el dueño— habría quedado al
      alcance de `anon` sin figurar en ningún `GRANT`: cualquiera con la clave pública escribiendo
      una bitácora falsa, que es lo último que debería poder falsificarse. El `ALTER DEFAULT
      PRIVILEGES` que dejó la [1.21](docs/08-plan-de-desarrollo.md#tarea-1-21) cubre a `anon`, **pero no a `PUBLIC`**: eso hay que escribirlo en
      cada migración que cree una función. No hizo falta acordarse: aplicada sin la revocación, la
      fila de la [1.21](docs/08-plan-de-desarrollo.md#tarea-1-21) que cuenta las funciones que `anon` alcanza se puso roja diciendo dos
- [ ] **El contrato y la base no llaman igual a tres de los eventos.** `EntradaDeBitacora.evento`
      dice `desactivado`, `reactivado` y `reversion`; `auditoria.accion` dice
      `usuario_desactivado`, `usuario_reactivado` y `cambio_revertido`. Los otros nueve coinciden
      letra por letra. La base se queda con los nombres del [04](docs/04-modelo-de-datos.md), que es el que manda sobre el
      esquema, así que **la traducción le toca a la API**, como ya le toca la de restricciones. No
      estaba escrito en ninguna parte y la [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16) se lo va a encontrar
- [ ] **Lo que la migración deja sin imponer, a propósito.** El [04 §5.4](docs/04-modelo-de-datos.md#54-auditoría-por-triggers) dice que `registro_id` es
      nulo «solo en `inicio_sesion_fallido`», y ninguna restricción lo amarra; y cualquier sesión
      `authenticated` que alcance `fn_registrar_evento` puede escribir una entrada de algo que no
      pasó. Las dos se sostienen hoy porque **nadie habla con la base salvo `prisma_api`**
      ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)) y porque la [1.21](docs/08-plan-de-desarrollo.md#tarea-1-21) cerró la puerta pública. Apretarlas es su propia decisión
- [ ] **La vista se tira y se vuelve a crear en vez de reemplazarse.** `CREATE OR REPLACE VIEW`
      solo deja agregar columnas al final, y el [04 §5.6](docs/04-modelo-de-datos.md#56-la-bitácora-de-la-pantalla-es-una-vista-no-una-tabla-nueva) pone `motivo` entre `registro_id` y
      `autor_id`. Es el camino que ya tomó la migración de los dominios con las otras cuatro
      vistas, y los permisos vuelven solos por el `ALTER DEFAULT PRIVILEGES` del esquema

**De la [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16):**

- [ ] **Los dos rechazos de la reversión los decide la API, y ninguno es un permiso.** El `40912` es
      que el dato que habría que restaurar **nunca se guardó** —el sistema tiene el hash, no la
      contraseña—, así que no hay restricción que pueda mirarlo; y el `40913` depende de **quién**
      pide la reversión, y una regla que depende de la sesión no es una restricción de la tabla. Los
      otros dos, el `40910` y el `40911`, los siguen rechazando los triggers de siempre. Es la
      segunda excepción a «los permisos viven en PostgreSQL», después de los cuatro conflictos de
      estado de la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7), y se anota como tal
- [ ] **`reversion.posible` no mira si quedaría Gerencia activa, y el botón no se apaga por eso.**
      Contarlo aquí sería la misma regla escrita dos veces, y entre el `SELECT` que cuenta y el
      `UPDATE` que cambia cabe otra sesión ([04 §5.7](docs/04-modelo-de-datos.md#57-reactivar-y-revertir-escrituras-compensatorias)). Así que esas reversiones salen posibles y el
      rechazo llega al intentarlas, con el mensaje de la base. Es lo mismo que ya hace el botón de
      sacar un cargo del catálogo con gente adentro, y la pantalla lo cuenta igual de bien
- [ ] **La entrada se cuenta sola, y por eso guarda el nombre además del id.** Un cambio de cargo
      guarda `cargo_id` **y** `cargo`, y un renombre guarda los dos nombres. Se descartó unir la
      vista contra `cargos`: un cargo renombrado ya no se llama como decía la entrada, así que el
      `JOIN` traería el nombre de hoy para contar lo de hace un año. Y habría obligado a cambiar la
      forma de la vista, que el [04 §5.6](docs/04-modelo-de-datos.md#56-la-bitácora-de-la-pantalla-es-una-vista-no-una-tabla-nueva) fija columna por columna
- [ ] **Revertir es aplicar el «antes» de la entrada, y el estado manda sobre el campo.** Un `antes`
      vacío significa que el cambio creó lo que hoy existe, así que deshacerlo es apagarlo; y si el
      `antes` trae `activo`, eso es lo que se aplica aunque también traiga el nombre. El orden está
      escrito en los dos sitios que lo usan —la redacción y la aplicación— porque si leyeran los
      campos distinto, la pantalla anunciaría una cosa y pasaría otra
- [ ] **Reordenar el catálogo de cargos no deja entrada.** El contrato no tiene evento de reorden y
      no se le inventa uno: un valor nuevo en `auditoria_accion_valida` es una migración, y el
      contrato tendría que acordarlo antes. Lo que sí queda es el `UPDATE` genérico del trigger
- [ ] **Editar `auditoria` no se rechaza: no alcanza ninguna fila.** `authenticated` tiene el permiso
      de `UPDATE` sobre la tabla, y lo que lo para es que no hay política de `UPDATE`, así que la
      sentencia termina bien habiendo cambiado cero. El efecto es el mismo y la promesa se sostiene,
      pero el [04 §5.7](docs/04-modelo-de-datos.md#57-reactivar-y-revertir-escrituras-compensatorias) decía «se rechaza» y ahora dice lo que pasa. Se encontró escribiendo la
      comprobación con `42501` esperado, que salía roja diciendo que la bitácora era editable
- [ ] **`Bitacora` perdió el método `reactivacion`.** Desde esta tarea hay **una sola** forma de
      anotar un evento con nombre, `anotar(CambioAnotado)`, y la reactivación pasa por ella como las
      demás. Dos caminos para lo mismo era lo que hacía que la vuelta guardara menos datos que la
      baja, y sin el motivo de entonces no se puede deshacer

**Del arreglo del huso en el front:**

- [ ] **El front era el único de los tres que no cumplía [RNF-08](docs/03-requisitos-y-bdd.md#rnf-08).** Pintaba con `toLocal()`, o sea con
      el reloj de quien mira, cuando [R6](docs/01-vision-y-alcance.md) y el [04 §1](docs/04-modelo-de-datos.md#1-principios-del-modelo) dicen que todas las fechas se manejan en
      `America/Bogota`. La base lo arregló en la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) y la API lo tiene en `ZonaDelNegocio`. Lo
      destapó la integración continua: una prueba de la [2.15](docs/08-plan-de-desarrollo.md#tarea-2-15) que pasaba en la máquina de quien la
      escribió —en Bogotá— y fallaba en el runner, que corre en UTC. **La prueba tenía razón y el
      código no**, así que se arregló el código
- [ ] **El desplazamiento es fijo, de cinco horas, y no un paquete de husos.** Colombia no tiene
      horario de verano desde 1993 y su huso es `−05:00` sin excepciones, así que restar cinco es
      exacto para siempre. Se descartó el paquete `timezone`: trae la base de datos de husos entera
      para resolver algo que no cambia nunca. **Si algún día Colombia cambiara de huso, esto es lo
      que hay que tocar**
- [ ] **Convertir no es un paso público, y eso costó una prueba para descubrirlo.** La primera
      versión exponía un `enBogota` que los modelos llamaban al leer el JSON; una prueba de
      idempotencia lo cazó: aplicado dos veces resta **diez** horas, porque lo que vuelve sigue
      marcado en UTC y restar otra vez es legal. Ahora solo existen `fechaYHoraEnBogota` y
      `fechaCortaEnBogota`, que convierten al pintar, y los modelos guardan el instante tal como
      llegó
- [ ] **La fecha de compilación del panel «Acerca de» se queda en el reloj de quien mira.** No es
      una fecha del negocio: es cuándo se compiló el artefacto

**De la 2.22:**

- [ ] **El texto del `RAISE EXCEPTION` es contrato, y nada lo comprueba.** La API reconoce los
      rechazos de trigger **por su texto** —`RechazoDeLaBase` guarda `"último usuario de Gerencia"`
      y `"Solo Gerencia cambia"` como constantes, porque un trigger no deja nombre de restricción
      donde agarrarse—, así que la frase de `tg_proteger_cargo_con_personas` es lo que la [2.8](docs/08-plan-de-desarrollo.md#tarea-2-8) va a
      tener que buscar: **«No se puede desactivar un cargo que todavía tienen personas activas»**,
      con tildes. Hasta entonces ese rechazo sale como `50000` y no como el `40911` del contrato
- [ ] **Y eso [C-01](docs/12-pruebas-y-calidad.md#c-01) no lo caza.** Esa prueba cruza `pg_constraint` con la tabla de traducción, y
      un trigger no está en `pg_constraint`: agregar un guardián **no pone nada en rojo**. Es el
      mismo trato que la [3.15](docs/08-plan-de-desarrollo.md#tarea-3-15) le dio a sus dos filas, pero **sin la red** —allá la prueba avisa,
      aquí no avisa nadie—, y ya van tres triggers en esa situación contando los dos de `usuarios`
- [ ] **El tipo y no un índice funcional.** Un `CREATE UNIQUE INDEX ... ON cargos (lower(nombre))`
      daría el mismo resultado y costaría un nombre nuevo, que es de donde cuelga el mensaje en
      español; cambiar el tipo deja `cargos_nombre_key` intacta con su fila. De paso, con `CITEXT`
      ignora las mayúsculas **toda** comparación contra esa columna y no solo la unicidad, que es
      lo que alguien espera de un catálogo. Es lo que ya se hizo con `usuarios.usuario`

**De la 2.5:**

- [ ] **El segundo guardián no se dispara nunca por el camino para el que se escribió.** Apagar a
      todas las gerencias de un `UPDATE` lo rechaza **el de fila**, no el de sentencia: cuando le
      toca la segunda fila, su `count(*)` ya ve apagada la primera. O sea que «la red de seguridad
      para la desactivación masiva» del [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) nunca llega a hablar, y una comprobación que solo
      mirara el mensaje de siempre la daría por buena el día en que desapareciera. Se comprueba
      **apagando el de fila** dentro de la transacción revertida, y ahí el de sentencia contesta
      con su propia frase
- [ ] **El guion de verificación pasó a apagar y encender triggers**, que es lo primero que hace
      en el esquema y no solo preguntarle. Va con tres precauciones: los dos ensayos corren
      **antes** del informe —PostgreSQL no deja `ALTER TABLE usuarios` mientras el `SELECT` la
      está leyendo— y dejan su respuesta en una tabla temporal; los vuelven a encender siempre; y
      la restauración de las fichas va **como el dueño**, porque apagadas todas las gerencias la
      sesión deja de serlo y la política `usuarios_actualizacion` no le alcanza ninguna fila, sin
      error y sin avisar
- [ ] **Una comprobación se mudó del bloque 1.4 al 2.5.** La degradación masiva ya estaba probada,
      pero colgando de la tarea de las políticas RLS en vez de la del guardián. Se movió entera,
      con su porqué; el conteo total no cambia por eso

**De la 2.11:**

- [ ] **La guarda pregunta por la semilla y no por el anfitrión.** «Es `localhost`» no quiere decir
      «es mío»: un túnel o un reenvío de puertos lo vuelven falso sin avisar. «Están los usuarios de
      la semilla» sí quiere decir algo, porque la semilla existe **solo** donde se puede borrar —sus
      contraseñas son conocidas a propósito y por eso no viaja a uat ni a prod—. Se pregunta con la
      conexión del dueño y **antes** del `ALTER ROLE`, que es lo único de esa clase que dejaría
      rastro en un ambiente equivocado. El cerrojo del anfitrión se queda igual, como segundo
- [ ] **La prueba dejó de tocar la configuración del ambiente.** El `ALTER ROLE ... PASSWORD` tiene
      sentido en una base que se levanta y se tira; contra qa sería cambiarle la contraseña a un rol
      que está sin ninguna a propósito. Si viene dada en `PRISMA_PRUEBAS_BASE_CLAVE_API`, se usa y
      no se ejecuta ningún `ALTER`. Comprobado comparando el hash del rol antes y después
- [ ] **El trabajo de la tubería se salta, no falla, cuando no hay secretos.** Este repositorio es
      público: un PR de fuera no puede leerlos, y un trabajo rojo por eso enseñaría a ignorar el
      rojo. Se salta con un aviso que dice cuál falta y dónde se carga, como ya hace el de
      integración con `PRISMA_DB_TOKEN`
- [x] **En uat esta prueba no va a poder correr tal como está.** El [12 §1.1](docs/12-pruebas-y-calidad.md#11-dónde-corre-cada-nivel) dice que [P-01](docs/12-pruebas-y-calidad.md#p-01) a
      [P-39](docs/12-pruebas-y-calidad.md#p-39) corren también en uat, con datos «realistas y anonimizados» —o sea, sin semilla—, y
      esta clase entra como Marcela con la contraseña de la semilla. O uat tiene sus propias
      credenciales de prueba, o esas pruebas no son las mismas. La [9.5](docs/08-plan-de-desarrollo.md#tarea-9-5) se lo va a encontrar —
      **Ya no aplica**: desde el [ADR-044](docs/adr/ADR-044-dos-ambientes-desplegados.md) uat es una etapa, y su semilla es la fija con
      volumen encima ([9.2](docs/08-plan-de-desarrollo.md#tarea-9-2)), así que Marcela está y la prueba corre igual

**De la 2.9:**

- [ ] **El usuario tecleado de un intento fallido va en `datos_despues`, y no en una columna suya.**
      No hay ninguna donde quepa: `auditoria` guarda quién hizo el cambio, y en un intento fallido
      nadie lo hizo. Sin el nombre, la entrada diría que alguien intentó entrar sin decir como quién,
      que es la mitad de lo que el [04 §5.4](docs/04-modelo-de-datos.md#54-auditoría-por-triggers) pide guardar. Se guarda como `{"usuario": "..."}`
- [ ] **Y solo si lo tecleado tiene forma de nombre de usuario.** La casilla del usuario y la de la
      contraseña están una encima de la otra: quien teclee la segunda en la primera dejaría su
      contraseña escrita en la tabla que nunca se borra y que Gerencia lee entera. El formato que la
      base ya exige es el filtro, y lo que no lo cumple se anota **como intento sin nombre**. Es
      [RNF-18](docs/03-requisitos-y-bdd.md#rnf-18) llevado hasta el final, y ningún documento lo pedía así
- [ ] **El intento fallido se anota desde una transacción `authenticated` y sin `sub`.** No hay
      ninguno que poner. Quedarse en `prisma_api` habría sido una puerta **más ancha**: ese rol tiene
      `SELECT`, `INSERT` y `UPDATE` sobre todas las tablas y las políticas del [04 §7](docs/04-modelo-de-datos.md#7-seguridad-por-tipo-de-usuario-rls) no llevan
      cláusula `TO`, así que se le aplican igual. Con `authenticated` y `auth.uid()` nulo, toda
      política que pregunte por la persona deniega. Es el segundo método de apertura de
      `ConIdentidad`, y la regla de arquitectura que enumera quién abre transacciones pasa a mirar
      los dos nombres: mirar solo el viejo era el agujero que su propio comentario anunciaba
- [ ] **Si el rastro no se puede escribir, no se entra.** [RF-05](docs/03-requisitos-y-bdd.md#rf-05) dice «cada inicio de sesión», y una
      bitácora que se rinde cuando estorba es la que no está el día que hace falta. El precio es que
      una base caída deja de responder `40104` y responde `50000`, que es lo mismo que ya pasa con
      todo lo demás
- [ ] **El rastro del ingreso va en su propia transacción, aparte de la que guarda la sesión.** En la
      ruta exenta ya había dos —leer la ficha y guardar la sesión—; esta es la tercera. Unirlas
      obligaba a escribir la bitácora dentro del repositorio de sesiones, y entonces dejaría de tener
      puerto propio. Lo que se pierde es que un corte entre las dos deje una sesión sin su entrada
- [ ] **Una variable de sesión vacía tumbaba la escritura auditada, y nadie lo sabía.** `set_config(…,
      true)` no devuelve la variable a «no existe» al cerrar la transacción: la devuelve a **la
      cadena vacía**, y `''::json` —que es lo que hacía `fn_auditar`— falla. La mina llevaba puesta
      desde la migración inicial y no se disparó porque nadie llenaba `request.headers`; la llenó la
      2.9. Se arregló en los dos lados: la API publica `{}` cuando no sabe nada, y el trigger lee con
      un `nullif` dentro de funciones que atrapan el error. **Vale la pena mirar si hay más
      `current_setting(...)::` sin `nullif` el día que algo más publique variables**

**De la 2.8:**

- [ ] **Reordenar el catálogo son dos flechas por fila, y el mockup no dice nada.** El [10 §5.4](docs/10-ux-y-mockups.md#54-gestión-de-usuarios) dice
      que un cargo «se agrega, se renombra y se desactiva con motivo» y no menciona moverlo, aunque
      el contrato declare `PUT /api/v0/cargos/orden` y la tarea lo nombre. Se eligió lo mínimo que
      funciona con teclado, con lector de pantalla y en un celular sin arrastrar nada. Si el diseño
      quería arrastrar, esto se cambia sin tocar la API: lo que viaja es el catálogo entero
- [ ] **El botón de sacar un cargo del catálogo no se esconde aunque la fila diga que lo tienen dos
      personas.** Quien rechaza es la base, y su aviso trae el número. Esconderlo sería decidir un
      permiso en el front con un dato que puede estar viejo ([ADR-018](docs/adr/ADR-018-front-sin-decisiones.md)), y dejaría a quien
      administra sin entender por qué no puede
- [ ] **`POST /api/v0/consultas/cargos` no responde `40300`, y el contrato dice que puede.** El
      catálogo lo lee todo el mundo porque `cargos_lectura` es `USING (TRUE)`, y tiene que ser así:
      el desplegable de un formulario lo necesita. Lo que sí le queda recortado a una sesión de
      Operación es `personasActivas`, porque la subconsulta que lo cuenta corre bajo
      `usuarios_lectura`. Es lo mismo que ya pasa con la consulta de personas, y la salida —si se
      quiere una— es de Base, no de un `if` en la API
- [ ] **Los cuatro eventos con nombre de cargos siguen sin escribirse.** `cargo_creado`,
      `cargo_renombrado`, `cargo_desactivado` y `cargo_reactivado` son valores válidos de `accion`
      desde la [2.21](docs/08-plan-de-desarrollo.md#tarea-2-21), y la descripción de la reactivación los promete. No los escribe la 2.8 a
      propósito: los de **personas** tampoco están —la [2.7](docs/08-plan-de-desarrollo.md#tarea-2-7) es anterior a `fn_registrar_evento`— y
      escribir la mitad dejaría una bitácora que cuenta los cargos y no las personas. Son de la
      [2.16](docs/08-plan-de-desarrollo.md#tarea-2-16), que es «la bitácora de todo cambio sobre usuarios y cargos». El trigger genérico sí
      deja su `INSERT`, `UPDATE` o `ANULAR`, que es lo que había
- [ ] **La copia fijada del contrato se desvió del acordado, y nada los compara.** [C-04](docs/12-pruebas-y-calidad.md#c-04) compara el
      OpenAPI generado con la copia de `prisma_api`, y quien compara esa copia con el original de
      este repositorio es una persona. Hoy difieren en las palabras clave de validación que salen de
      las anotaciones —`minLength`, `maxLength`, `minItems`—, que el original no tiene porque se
      escribió antes que el código, y en dos descripciones, la de `Desactivacion` y la de `Motivo`.
      Las **rutas** sí coinciden byte a byte, y eso se comprobó una por una en esta tarea. Una
      prueba que cruce los dos documentos es barata y no existe
- [ ] **El formulario «desactivacion-de-cargo» tiene sus etiquetas y no sus mensajes.** El contrato
      usa **un solo esquema** de cuerpo, `Motivo`, para los once formularios de motivo, y
      `@Formulario` es por clase: si la clase del cargo apareciera en la firma del controlador, el
      OpenAPI generado traería un esquema que el contrato no tiene. Así que el cuerpo que se valida
      es el de desactivar a una persona, y un motivo en blanco al sacar un cargo se rechaza con el
      mensaje de esa otra. Lo que la pantalla pinta sí es propio

**De la [2.17](docs/08-plan-de-desarrollo.md#tarea-2-17):**

- [ ] ⚡ **La reactivación no genera clave temporal, y el [04 §5.7](docs/04-modelo-de-datos.md#57-reactivar-y-revertir-escrituras-compensatorias) insinúa que sí.** Ahí se lee
      «la clave temporal se entrega en persona, como en [CU-31](docs/02-casos-de-uso.md#cu-31)», pero ni el flujo del [CU-34](docs/02-casos-de-uso.md#cu-34) ni el
      formulario `reactivacion-de-usuario` del contrato tienen dónde ponerla, y generarla sin
      enseñarla dejaría a la persona sin poder entrar. Se hace lo mínimo: **entra con la suya y la
      cambia de una vez**, y si no la recuerda se le restablece, que es la ruta que ya existe.
      **Lo decide quien dirija**: o esa frase del 04 se corrige, o reactivar pide clave temporal y
      eso es cambio de contrato
- [ ] **La pantalla de usuarios no estrena avisos.** El mockup pinta una franja encima de la tabla
      después de cada escritura —crear, editar, desactivar, reactivar, restablecer y revertir— y el
      front no tiene ninguna. Construirla ahora las traería las seis, y eso no es esta tarea. El
      aviso de la clave se da **antes** de confirmar, dentro del panel, que es donde ya está y donde
      todavía sirve para decidir
- [ ] **El aviso del panel decía que la clave anterior dejaba de servir, y no era cierto.**
      Desactivar no le toca la contraseña a nadie, así que la de siempre sí sirve para entrar —y
      tiene que servir, o la persona no llegaría ni a «Crea tu contraseña»—. Quedó como lo dice el
      mockup: entra con la que tenía, el sistema la obliga a cambiarla en ese ingreso y, si no la
      recuerda, se le restablece
- [ ] **El cerrojo va dentro del filtro de firma y no en uno propio.** El plan preveía un filtro
      aparte; al escribirlo se vio que el de firma **ya juzga el estado de la sesión** —rechaza la
      vencida— y que el dato sale de la consulta que ese mismo filtro ya hace, así que un filtro
      nuevo habría necesitado recibirlo por un atributo de la petición: la separación habría sido
      solo de nombre
- [ ] **La navegación conserva su propio rechazo, que ahora es el mismo dos veces.** Lo puso la
      [2.14](docs/08-plan-de-desarrollo.md#tarea-2-14) en `ConsultarNavegacion` y sigue ahí: protege también a quien llame al caso de uso sin
      pasar por HTTP. El precio es que esa ruta responde `40302` por dos caminos, así que la prueba
      de punta a punta usa otra —la de cuentas—, o diría que el cerrojo existe aunque no existiera

**De la 3.8:**

- [ ] **Quien registró un movimiento se dice «Otra persona» cuando la sesión no alcanza a verlo.**
      `mov_lectura` le enseña el libro entero a los dos tipos, pero `usuarios_lectura` solo deja ver
      la ficha propia y, a Gerencia, todas ([P-10](docs/12-pruebas-y-calidad.md#p-10)). Con el `JOIN` interno que usaba la ficha de la
      [3.4](docs/08-plan-de-desarrollo.md#tarea-3-4), el libro de Operación **habría perdido en silencio** cada movimiento que registró
      otra persona; con `LEFT JOIN` la fila se queda y lo que falta es el nombre, que el contrato
      declara obligatorio. Se eligió un texto que no identifica a nadie sobre inventar que lo
      registró quien pregunta. **Arreglarlo de verdad es de la base**: que los dos tipos puedan leer
      el nombre de una persona sin ver su ficha entera, que es una migración y otra tarea
- [ ] **Pedir los anulados sin ser Gerencia devuelve el libro vigente, no un rechazo.** El [04 §5.5](docs/04-modelo-de-datos.md#55-vistas-limpias-por-defecto)
      dice que el modo «ver anulados» es de Gerencia, y el contrato **no declara `40300`** para esta
      operación. Así que la consulta le pregunta a la base con `fn_es_gerencia()` —la misma función
      de las políticas— en vez de comprobarlo en la API, y a Operación le vuelve lo que sí puede ver.
      Es lo mismo que ya hace la bitácora, que a Operación le llega vacía
- [ ] 🔒 **El libro lee las columnas de la anulación, que escribe la [3.9](docs/08-plan-de-desarrollo.md#tarea-3-9).** Un `incluirAnulados` que
      trajera los anulados sin decir que lo están no sería pedir nada. Leer es de esta tarea y
      escribir de la suya; la ficha gana el nombre de quien anuló, con la misma regla de arriba
- [ ] **Un tipo de movimiento que no existe sale como `42200` sobre el campo `tipos`.** Es el molde
      de `TipoDeUsuarioDesconocido` y `TipoDeCuentaDesconocido`: los nueve están en el contrato, así
      que un décimo quiere decir que la petición no la armó la pantalla. Leído de una columna sigue
      siendo un fallo del sistema, que no es lo mismo
- [ ] **La copia fijada del contrato describe la cabecera `Idempotency-Key` de esta ruta como una
      consulta, y el original la describe como una escritura.** La API elige el texto sola según la
      ruta sea de lectura o de escritura, así que dice lo mismo que en las otras nueve consultas; el
      original le dejó a esta el texto de una escritura. **No cambia nada de lo que alguien hace**,
      pero el original y la copia no dicen lo mismo hasta que alguien decida cuál se corrige

**De la [4.5](docs/08-plan-de-desarrollo.md#tarea-4-5):**

- [ ] **El movimiento que causa la venta vale el saldo, no el valor total del pedido.** El contrato
      dice las dos cosas —«causa la venta por el valor total» y «sube la caja por el saldo»— y el
      [04 §10](docs/04-modelo-de-datos.md#10-funciones-de-negocio-atómicas) dice que es **un** movimiento: solo el saldo hace ciertas las dos. Y es lo que exige
      el saldo de la cuenta, porque el anticipo ya la subió una vez. **Lo que cuelga de esto es la
      [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1)**: los ingresos causados no se pueden sumar de los movimientos, porque los de un
      pedido entregado dicen el saldo y no la venta; salen de `pedidos`, como el costo directo
- [ ] **Causar el costo no escribe ningún apunte.** El [05 §9.1](docs/05-reglas-financieras.md#9-catálogo-de-kpis) define el costo directo del período
      como la suma del costo de los pedidos entregados en él, y el insumo ya se registró como gasto
      el día que se compró: un segundo apunte lo contaría dos veces. Así que «causa el costo» del
      contrato lo cumple el pedido al quedar `entregado` con su fecha, y no una escritura nueva
- [ ] **De `cotizado` la base sí deja entregar, y la API no.** El contrato le da a la entrega un
      único código de estado, el `40931`, y su texto es «ya está cerrado»: solo `entregado` y
      `cancelado`. La máquina de estados de la [4.1](docs/08-plan-de-desarrollo.md#tarea-4-1) es más estricta, y hoy es la única que para
      una cotización que nunca se confirmó. **Cerrarlo en la base pide un código nuevo**, y un
      código nuevo es un PR en la especificación
- [ ] **La fecha futura la rechaza la base y la anterior al pedido la rechaza la API**, y las dos
      son el mismo `42234`. Sin cuenta no hay movimiento, así que `fecha_no_futura` no mira y solo
      la base puede cerrar ese hueco; la otra mitad es un error de campo, va en `data.errores` y ya
      estaba escrita desde la [4.4](docs/08-plan-de-desarrollo.md#tarea-4-4). Repetirla en la base sería la segunda versión de una regla
- [ ] **La entrega parcial del [CU-07 A2](docs/02-casos-de-uso.md#cu-07) no se puede pedir.** El formulario `entrega` del contrato son
      dos campos —la fecha y la cuenta— y ni uno más, así que no hay dónde decir qué parte se
      entrega. El estado `parcial` existe y la función lo entrega entero. Nadie ha planificado la
      tarea que la escriba

**Del juego de datos oficial ([6.2](docs/08-plan-de-desarrollo.md#tarea-6-2)):**

- [ ] **La invariante «lo asignado a los cuatro sobres suma las entradas del mes» no es exacta.** El
      [12 §4.2](docs/12-pruebas-y-calidad.md#4-juego-de-datos-de-prueba-oficial) la escribe como igualdad, y cada sobre es un porcentaje redondeado a peso con
      `HALF_UP`: cuatro redondeos dejan hasta dos pesos de diferencia con el total. Con los $6.025.000
      y el 45/25/10/20 del [05 §12.4](docs/05-reglas-financieras.md#124-los-4-sobres-sobre-las-entradas-del-mes) cuadra al peso, y eso es justo lo que la esconde. La prueba fija
      la cota y afirma que algún mes deja resto, para no probar en falso. **A qué sobre va ese resto lo
      tiene que decidir la [7.8](docs/08-plan-de-desarrollo.md#tarea-7-8)**, que es quien reparte: decidirlo desde una prueba sería inventar una
      regla de negocio
- [ ] **El índice de puntualidad de registro del [05 §12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes) no lo reclama ninguna tarea del [08](docs/08-plan-de-desarrollo.md).** El
      [05 §4](docs/05-reglas-financieras.md#4-las-dos-fechas-de-todo-registro) lo define sobre 48 horas, y lo único que hay en el código es la marca de registro tardío
      de [RN-14](docs/03-requisitos-y-bdd.md#rn-14), que son siete días: dos umbrales para dos cosas distintas, y ninguna clase calcula el
      primero. El juego de datos no reproduce el 86 % del documento, y no lo va a reproducir hasta que
      la tarea exista
- [ ] **Tres filas del [05 §12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes) todavía no las calcula nadie, y son de tareas que ya existen.** El punto de
      equilibrio y el ticket promedio son de la [6.6](docs/08-plan-de-desarrollo.md#tarea-6-6), y las horas pagadas contra facturadas, con su
      tiempo ocioso, de la [8.7](docs/08-plan-de-desarrollo.md#tarea-8-7). El juego ya trae de dónde sacarlas —los 42 pedidos con sus horas— y
      las dos que sí salen del dominio, el ticket promedio y las 104 horas, quedan fijadas
- [ ] **El margen bruto del mes es 53,99 % y el [05 §12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes) dice 54,0 %.** El cálculo guarda dos decimales,
      el documento redondea a uno, y la prueba afirma los dos: el exacto y el del documento. Es lo
      mismo que ya pasa con el 16,03 % de margen neto que el [§12.1](docs/05-reglas-financieras.md#121-estado-de-resultados-causación) llama 16,0 %, y **conviene que el
      documento diga que redondea**, porque la cifra del tablero va a traer los dos decimales

**Del año mes a mes ([6.5](docs/08-plan-de-desarrollo.md#tarea-6-5)), en su mitad API:**

- [ ] 🔒 **El punto de equilibrio es de la [6.6](docs/08-plan-de-desarrollo.md#tarea-6-6), y el contrato lo mete dentro de la respuesta de la
      [6.5](docs/08-plan-de-desarrollo.md#tarea-6-5).** `Reporte` lo declara desde el `0.17.0`, así que la ruta no se podía servir sin él
      y la mitad API lo trae: los gastos fijos del mes, el margen de contribución, las ventas
      necesarias y los pedidos necesarios del [05 §10](docs/05-reglas-financieras.md#10-punto-de-equilibrio). **Lo que queda para la [6.6](docs/08-plan-de-desarrollo.md#tarea-6-6) es la fila del
      [05 §12.5](docs/05-reglas-financieras.md#125-indicadores-del-mes) y el ticket promedio como indicador del mes**, no el cálculo, y quien dirige decide si
      la tarea se recorta o si se marca con esta
- [ ] **Los gastos fijos mensuales salen de promediar lo registrado, porque nadie los declara.** El
      [05 §10](docs/05-reglas-financieras.md#10-punto-de-equilibrio) los pide «del mes» y ninguna tabla guarda un presupuesto: se suman los gastos de categoría
      `es_fijo` más el pro-labore del año y se dividen entre los meses con registro. **Un mes suelto
      —un seguro anual, un arriendo pagado doble— mueve la cifra de todos**, y la alternativa sería
      una tabla de gastos fijos declarados, que ningún documento pide
- [ ] **Un mes cerrado no dice cuáles de sus gastos eran fijos.** `cierres_mensuales` congela las
      cifras del estado de resultados, no sus categorías, así que el promedio de gastos fijos se arma
      solo con los movimientos vigentes. Con la [6.8](docs/08-plan-de-desarrollo.md#tarea-6-8) ya hecha, un año con meses cerrados calcula
      su punto de equilibrio con menos meses de los que muestra
- [ ] **La nómina de un mes abierto va en cero.** El contrato la declara en cada mes, la foto del
      cierre la trae y el cálculo de un mes abierto no tiene de dónde sacarla: la nómina es del
      [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8) y todavía no hay tabla. Es cero, no ausente, para que la pantalla no tenga que
      distinguir dos casos
- [ ] **El promedio de ganancias divide la utilidad de todo el año, no la de los meses cerrados.** El
      [05 §9.1](docs/05-reglas-financieras.md#91-resultado) dice «utilidad acumulada entre meses cerrados», y acumulada es la del año: con un mes
      abierto que ya dio utilidad, el promedio sube sin que haya un mes más cerrado. **Se escribió lo
      que el documento dice literalmente**, y si lo que quería decir era otra cosa, lo corrige él
- [ ] **Sin gastos fijos, los pedidos necesarios son cero y no «ninguno».** Es la cuenta del [05 §10](docs/05-reglas-financieras.md#10-punto-de-equilibrio)
      con el numerador en cero, y el documento no dice qué pintar cuando un negocio no tiene gastos
      fijos registrados. La pantalla de la mitad Front decidirá si eso se muestra
- [ ] **`vigentes()` no traía la categoría ni el pedido de cada movimiento**, y los dos llegaban
      nulos al dominio. La caja libre de la [6.1](docs/08-plan-de-desarrollo.md#tarea-6-1) contaba entonces cero gastos fijos comprometidos, y
      ninguna prueba lo veía porque las de dominio arman los movimientos a mano. **Entra arreglado en
      esta tarea** porque el punto de equilibrio necesita la categoría, y conviene mirar si alguna
      cifra ya publicada se leyó con ese cero

**Del cierre mensual ([6.8](docs/08-plan-de-desarrollo.md#tarea-6-8)):**

- [ ] **La nómina del snapshot va en cero, porque todavía no existe.** El cierre congela
      las nueve cifras del [05 §8](docs/05-reglas-financieras.md), y una de ellas es lo pagado a las empleadas: hoy eso entra como
      gasto operativo y ninguna tabla lo separa. **Los meses que se cierren antes del [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8)
      guardan un cero que después no se va a poder corregir**, porque la fila no se edita
- [ ] **El punto 4 del [05 §8](docs/05-reglas-financieras.md) queda fuera de la tarea.** El documento pide que el ajuste de un mes
      cerrado aparezca en el mes corriente **identificado como tal**, y marcarlo pide un campo en
      `Movimiento` que el contrato no tiene. Lo que sí quedó es el punto 2 —el mes cerrado no admite
      movimientos, y el `40960` lo dice—, así que el ajuste se registra, pero no se distingue
- [ ] **El mes en curso no se cierra, y el `40961` lo dice.** Ningún documento decía qué pasa si
      alguien pide cerrar un mes que no ha terminado: se decidió lo mínimo, que se cierra cuando pasó
      su último día en `America/Bogota`, porque un snapshot de un mes a medias congelaría cifras que
      todavía se están escribiendo. **Cerrar un mes viejo sí se puede**, y no se exige orden
- [ ] **El contrato acordado tiene dos descuidos de redacción en `/api/v0/cierres/{id}`.** El
      parámetro de la ruta se describe como «el id del retiro, que genera quien lo registra», y
      `Idempotency-Key` usa el texto de una consulta y no el de una acción, que es el que llevan las
      demás escrituras. **No se tocaron**: el contrato se corrige en su propio PR, y [C-04](docs/12-pruebas-y-calidad.md#c-04) los exige

**Del límite de horas ([7.10](docs/08-plan-de-desarrollo.md#tarea-7-10)):**

- [ ] **El límite nace porque quien dirige lo pidió**, al revisar el `50000` de las horas del
      pro-labore: el tope deja de ser un número del contrato, lo edita Gerencia y su valor por
      omisión es parametrizable. Se descartó el `maximum` de 9.999,99 a secas, que era el arreglo
      más corto, y un tope fijo de 744 horas, que sería una regla de negocio sin documento
- [ ] **Rige para el pro-labore y para una empleada, y lo eligió quien dirige.** Una semana tiene
      las mismas horas para cualquiera, así que hay una tabla, un código y un panel en vez de dos
      de cada cosa. La mitad de la empleada la aplica la [8.1](docs/08-plan-de-desarrollo.md#tarea-8-1), que por eso pasó a depender de esta
- [ ] **El valor por omisión son 48 horas, y es el único que no deja inválido el 192 del [04 §4.7](docs/04-modelo-de-datos.md#47-personal-y-nómina).**
      48 × 52 ÷ 12 son 208 horas al mes, y las 192 que la columna de la empleada trae por omisión
      caben. Con 42 no cabrían. **No se inventó ninguna regla**: el número vive en la configuración
      de cada ambiente y Gerencia lo cambia desde la aplicación
- [ ] **La consulta trae `porOmision` en vez de devolver `data` en null.** Un null diría que no hay
      límite, y sí lo hay: el que trae la API mientras nadie haya guardado uno. Es la diferencia con
      el pro-labore, que sin definir de verdad no existe
- [ ] **Un límite más bajo no invalida lo que ya está guardado.** Se decidió lo mínimo: el límite
      juzga la definición que llega, no las anteriores. Revisarlas pediría decir qué pasa con un
      costeo que ya tomó una tarifa de unas horas que hoy no cabrían

**Del cotizador ([8.8](docs/08-plan-de-desarrollo.md#tarea-8-8)):**

- [ ] **El membrete vive en la configuración de la API, no en la base.** El logo, el nombre y el pie
      del papel son del taller y no de una cotización, así que son propiedades de `application.yml`
      y el logo un recurso del artefacto. Si algún día hay más de un taller, eso es una tabla y un
      PR de contrato
- [ ] **El PDF se escribe a mano, sin librería.** Es una página con texto en Helvetica y una imagen,
      y una dependencia nueva para eso pesa más que el código que se evita. Lo que se pierde es el
      acomodo automático: el ancho de las columnas lo decide el código
- [ ] **Una cotización vencida o ya aceptada también se imprime.** El papel es un registro de lo que
      se ofreció, y negarlo obligaría a quien atiende a buscarlo por fuera. Solo se niega el de una
      anulada (`40981`), porque ese papel ya no vale
- [ ] **La hoja no la dibuja el front: la vista previa es el PDF que arma la API.** Así el papel que
      firma el cliente y el que se imprime son el mismo byte a byte. El mockup dibuja una hoja en
      pantalla, y dibujarla dos veces es tener dos papeles que se van a separar
- [ ] **«Anular» se pinta para todo el mundo.** Ninguna consulta de navegación trae una bandera que
      diga quién puede, y esconder el botón no protege nada: quien rechaza es la política
      `cotizaciones_anulacion` en PostgreSQL, con su `42501`, y el front pinta el `40300` del sobre
- [ ] **El `42501` de esa política se traducía a `50000`.** El adaptador de cotizaciones no
      traducía el rechazo de la base, así que la seguridad funcionando se leía como «algo salió
      mal». Se arregló copiando la traducción que ya hacía el de movimientos

**Del validador de anticipo mínimo ([8.9](docs/08-plan-de-desarrollo.md#tarea-8-9)):**

- [ ] **El costo de esta consulta se lee de `costos_producto` y no de `fn_costeo_vigente`.** Esa
      función es `SECURITY DEFINER` para que las dos sesiones congelen el mismo costo de un pedido
      **sin verlo** ([5.5](docs/08-plan-de-desarrollo.md#tarea-5-5)), y aquí el costo sale en la pantalla. Si la consulta la usara, Operación
      vería el costo directo y el margen de cada pedido, que es justo lo que `costos_solo_gerencia`
      esconde. Así el contrato se cumple tal como está escrito —Operación recibe `40982`— y quien
      rechaza sigue siendo la base. **Conviene revisar si Operación debería poder preguntar**, y en
      ese caso qué se le contesta sin enseñarle el costo
- [ ] **El mínimo redondea hacia arriba.** El [05 §5.2](docs/05-reglas-financieras.md#52-la-fórmula) solo dice que es el costo directo sobre el
      valor total. Con 65,19 puntos, un 65 dejaría plata faltando y el nombre mentiría
- [ ] **Unas líneas que no valen nada no dividen.** Con valor total cero el mínimo se fija en 100 y
      no cubre, porque ningún porcentaje de cero paga un costo. Ningún documento cubre ese caso
- [ ] **La lectura sale `alta` y no `critica`.** El pedido no está mal hecho: va a costar plata
      mientras tanto. El [10 §3.1](docs/10-ux-y-mockups.md#31-color) pinta en ámbar lo que avisa y en rojo lo que no deja seguir

**De los adelantos ([8.3](docs/08-plan-de-desarrollo.md#tarea-8-3)):**

- [ ] **Un adelanto ya descontado responde `40900` y no el `40922` del movimiento.** El impedimento
      es el mismo y lo levanta la misma función, pero el contrato de `anularAdelanto` solo declara
      el `40900` para esa ruta. Los otros cuatro impedimentos suben como llegan, así que un mes
      cerrado devuelve el `40960`, que esa ruta tampoco declara. **Conviene revisar si el contrato
      debería declarar los dos**, o si el `40900` tiene que cubrirlos a todos
- [ ] **La fecha del adelanto es opcional y sin ella es hoy.** El esquema `NuevoAdelanto` del
      contrato acordado la deja opcional y dice «Sin ella, hoy», mientras el `contrato/README` de la
      API la lista como obligatoria. Se siguió el esquema, que es lo que compara [C-04](docs/12-pruebas-y-calidad.md#c-04)

**Del simulador ([8.5](docs/08-plan-de-desarrollo.md#tarea-8-5)):**

- [ ] **Las alternativas viajan sin las ventas en unidades, y van vacías.** Traducir el faltante a
      unidades de producto es el [RF-60](docs/03-requisitos-y-bdd.md#rf-60) y es la [8.6](docs/08-plan-de-desarrollo.md#tarea-8-6), que depende de esta. Una alternativa sin sus
      números es el consejo genérico que el [06 §5](docs/06-nomina-y-capacidad-de-pago.md#5-alternativas-cuando-no-es-viable) quiere evitar, así que el campo existe y queda
      vacío hasta que entre la [8.6](docs/08-plan-de-desarrollo.md#tarea-8-6)
- [ ] **El mes en curso no entra en el promedio.** Un mes a medio registrar siempre parece peor de
      lo que es, y hundiría la utilidad promedio justo cuando se está decidiendo contratar. Ningún
      documento dice qué hacer con él
- [ ] **Se promedian los meses con registro, no los seis del calendario.** Un mes sin nada anotado
      no ganó cero: no se sabe. Por eso viajan los dos conteos y, cuando difieren, el aviso de que
      la proyección es menos confiable. El [06 §3](docs/06-nomina-y-capacidad-de-pago.md) habla de «seis meses» sin decir qué pasa si faltan
- [ ] **No alcanzar se lee `alta` y no `critica`.** Contratar sin plata no es un dato mal escrito:
      es una decisión que conviene no tomar. El [10 §3.1](docs/10-ux-y-mockups.md#31-color) pinta en ámbar lo que avisa y en rojo lo que
      no deja seguir, y aquí no hay nada que no deje seguir
- [ ] **El mockup dibuja un deslizador de pro-labore y el front no lo tiene.** La API lee el
      pro-labore vigente de la base y no admite uno tentativo, así que el deslizador no tendría
      dónde mandar su número. Se dejaron los dos que sí decide quien pregunta, el salario y la
      reserva, y **conviene revisar si el pro-labore debería poder simularse**

**De la 9.4:**

- [ ] **La API no publica por ninguna parte de qué commit salió, y el front sí.** Al revertir, lo
      único que la API dice de sí misma es su versión, y dos despliegues seguidos pueden llevar la
      misma: a `develop` entran cambios que no la suben y la [C-05](docs/12-pruebas-y-calidad.md#c-05) los exime. En el ensayo los tres
      últimos despliegues de dev llevaban `0.55.0`, así que hubo que ir al último con otro número
      para poder comprobar desde fuera que la reversión había ocurrido. **El front no tiene el
      problema** porque `--dart-define` le deja el commit dentro de la compilación. Agregárselo al
      sobre de `POST /api/v0/consultas/version` **sería cambiar el contrato**, y eso se acuerda antes
      de implementarse, así que queda para quien dirige

**Del detalle de los 37 casos de uso y sus diagramas, que no es una tarea del 08:**

- [ ] **Los 20 casos que solo vivían como fila de la tabla maestra se detallaron a partir de los
      requisitos, del contrato y del modelo, no de una decisión nueva.** Donde el 03 y el contrato
      coincidían, el flujo salió de los dos; donde solo lo decía el contrato, salió de él. **Ningún
      flujo nuevo inventa una regla de negocio**, y vale la pena que quien dirige lea los de [CU-13](docs/02-casos-de-uso.md#cu-13),
      [CU-19](docs/02-casos-de-uso.md#cu-19) y [CU-25](docs/02-casos-de-uso.md#cu-25), que son los que tocan plata y nómina
- [ ] **El [`23-diagramas-de-casos-de-uso.md`](docs/23-diagramas-de-casos-de-uso.md) nace en 🔍 En revisión y no ✅ Vigente.** Los dibujos
      son fieles a lo que hoy dicen los documentos y el contrato, pero la derivación la hizo quien
      construye. Pasa a 1.0.0 cuando quien dirige los apruebe
- [ ] **La reactivación de un cargo está en el contrato y no la pide ningún requisito.** [RF-81](docs/03-requisitos-y-bdd.md#rf-81)
      enumera «crear, renombrar, reordenar y desactivar», y `POST /api/v0/cargos/{id}/reactivacion`
      existe desde el [Sprint 2](docs/08-plan-de-desarrollo.md#sprint-2). Se documentó en [CU-33](docs/02-casos-de-uso.md#cu-33) porque está construida, pero **le falta su
      requisito en el 03**
- [x] **[CU-22](docs/02-casos-de-uso.md#cu-22) y [CU-23](docs/02-casos-de-uso.md#cu-23) entraron al 08.** Quien dirige lo decidió, y lo escribe el
      [ADR-047](docs/adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md): el respaldo con manifiesto de [RF-66](docs/03-requisitos-y-bdd.md#rf-66) y la consulta filtrable de toda la
      auditoría de [RF-67](docs/03-requisitos-y-bdd.md#rf-67) son las tareas [8.13](docs/08-plan-de-desarrollo.md#tarea-8-13) a [8.19](docs/08-plan-de-desarrollo.md#tarea-8-19). La auditoría va en ruta nueva,
      `POST /api/v0/consultas/auditoria`: la bitácora no cambia de forma
- [ ] **Confirmar que «Configuración» vuelve al menú de Gerencia.** El [10 §2](docs/10-ux-y-mockups.md#2-mapa-de-navegación) la dibujaba y el [10 §2.1](docs/10-ux-y-mockups.md#21-navegación-por-rol) la
      listaba desde siempre, pero el mockup la había disuelto cuando el pro-labore y los sobres se
      fueron a Inversiones y la importación a Movimientos. Vuelve porque el respaldo y la auditoría
      no tienen otra casa, y con ella las pantallas pasan de once a doce. **Lo decide quien dirige**
- [ ] 🔒 **Entraron siete tareas nuevas al plan y el total pasa de 157 a 164.** Las puso el
      [ADR-047](docs/adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) al final del [Sprint 8](docs/08-plan-de-desarrollo.md#sprint-8), que ya estaba en 12 de 12, y le suman unos diez
      días. Todas sus dependencias estaban hechas, así que la [8.13](docs/08-plan-de-desarrollo.md#tarea-8-13) se tomó el primer día. **Conviene
      revisar si el sprint aguanta siete tareas más o si conviene partirlo**
- [ ] 🔒 **El techo del bucket `respaldos` quedó en 512 MiB por objeto, y lo decidió la [8.14](docs/08-plan-de-desarrollo.md#tarea-8-14).**
      Ningún documento dice cuánto puede pesar un respaldo, y el [13 §6](docs/13-respaldo-y-exportacion.md#6-programación-automática) avisa que con cuatro
      alcances y tres formatos el bucket puede crecer más de lo previsto. 512 MiB es más de lo que
      un taller produce en un ZIP de toda su historia y menos de lo que convertiría un error en una
      factura; se cambia con un `UPDATE` de una línea. **Conviene mirar el tamaño real en los
      primeros meses y decidir si ese número se queda**

- [ ] 🔒 **La retención de doce descarta el archivo y deja la fila, y lo decidió la [8.14](docs/08-plan-de-desarrollo.md#tarea-8-14).** El
      [ADR-004](docs/adr/ADR-004-base-solo-escritura.md) dice que nada se borra, y la fila de `exportaciones` es el historial que el
      [13 §7](docs/13-respaldo-y-exportacion.md#7-alcance-por-rol) le ofrece a Gerencia; lo que pesa es el ZIP. Así «disponible» quiere decir que el
      objeto sigue en el bucket, y un respaldo descartado se distingue de uno que nunca existió.
      **Si quien dirige prefiere que la fila también se vaya, eso sería una excepción nueva al
      [ADR-004](docs/adr/ADR-004-base-solo-escritura.md) y pide su propio ADR**

- [ ] **`respaldo_programacion` no entra en el respaldo: es la quinta tabla de funcionamiento.** Las
      que se respaldan siguen siendo 27 ([13 §3](docs/13-respaldo-y-exportacion.md#3-formatos)). No es historia de nadie, y un respaldo que al
      restaurarse devolviera la programación vieja encendería solo un trabajo que nadie pidió. **Lo
      decidió la [8.14](docs/08-plan-de-desarrollo.md#tarea-8-14)**
- [ ] **En un PR a `main`, la tubería de `prisma_db` no corre ningún trabajo.** Sus
      dos trabajos son solo para `develop`, `qa` y `uat`, así que la puerta «Tubería en verde» que
      pide el [ADR-048](docs/adr/ADR-048-las-ramas-principales-las-protege-github.md) se reporta verde sin haber comprobado nada. Se dejó así para no tocar la
      condición de un trabajo que ya existía; **lo que hay que decidir es si el informe de la base
      tiene que correr también en esa rama**. Con el [ADR-053](docs/adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) la rama `pre-prod` dejó de existir, así que
      ahora es una sola
- [ ] **El respaldo baja por partes y siempre en un ZIP, y ningún documento lo decía.** Un respaldo
      total pasa de los 5 MB que caben en un `Documento`, y el [13 §5.1](docs/13-respaldo-y-exportacion.md#51-quién-arma-el-archivo-la-api) pide que el archivo salga de la
      API. El contrato `0.32.0` lo resuelve con `POST /respaldos/{id}/descarga` y un trozo de hasta
      3 MiB por petición, y los tres formatos bajan dentro de un ZIP porque el manifiesto es un
      archivo aparte. **Pedir la primera parte es lo que marca el respaldo como bajado.** El front
      tiene que juntar las partes y comprobar el `sha256`: es lógica nueva en la 8.17. Se escribió en
      el [13](docs/13-respaldo-y-exportacion.md). **Lo decide quien dirige** si prefiere otra salida
- [ ] **Las tablas que se respaldan son 27, y quedaron fuera cuatro de funcionamiento.** El total y
      «una tabla» no incluyen `nonces_vistos`, `peticiones_idempotentes`, `sesiones` ni
      `schema_version`: no son historia de nadie y `sesiones` guarda huellas de claves de renovación.
      Entran `auditoria` y `exportaciones`. El [13 §2](docs/13-respaldo-y-exportacion.md#2-alcance-seleccionable) dice «todas las tablas» sin decir cuáles
- [ ] **La programación dice si opera, y programar donde no opera responde `40971`.** El
      [13 §1.1](docs/13-respaldo-y-exportacion.md#11-el-respaldo-es-por-ambiente-y-solo-uno-importa) dice que solo opera en prod y que en los demás ambientes «no se programa». No dice si
      la pantalla de un ambiente de pruebas debe ofrecerla: el contrato `0.32.0` trae `opera` y la
      pantalla no pinta el bloque con `false`, para no decidir el ambiente en el front
- [x] **La auditoría la redacta la API, no la pantalla: decidido el 2026-10-18.** La [8.18](docs/08-plan-de-desarrollo.md#tarea-8-18) devolvía
      el antes y el después con los nombres de columna de la base, y quedaba por decidir si Gerencia
      debía leer «Cargo: Domiciliaria → Asistente» y no un JSON. Quien dirige decidió que sí, así que
      la [8.19](docs/08-plan-de-desarrollo.md#tarea-8-19) cambió el contrato: cada entrada trae «sobre qué» y «qué cambió» ya
      redactados, y los dos mapas siguen viajando para quien revise a fondo
- [ ] **El filtro por persona de la auditoría trae también los intentos fallidos que tecleó su
      usuario.** Un intento fallido no tiene persona, porque nadie entró; el [BDD-23-2](docs/03-requisitos-y-bdd.md#bdd-23-2) los espera
      al filtrar por persona, así que la API los cruza con el usuario tecleado. Lo escribió la
      8.13 en el contrato; la 8.18 lo tiene que cumplir

**De la auditoría completa ([8.18](docs/08-plan-de-desarrollo.md#tarea-8-18)):**

- [ ] **`clave_cambiada` no la escribía nadie, y ahora la escribe `CambiarMiClave`.** El [CU-23](docs/02-casos-de-uso.md#cu-23) y el
      [BDD-23-1](docs/03-requisitos-y-bdd.md#bdd-23-1) la esperan en la auditoría, pero ninguna ruta la anotaba, así que la lista la
      prometía vacía. Se anota en la misma transacción que marca la clave, y queda **fuera** de los
      doce cambios de administración: cambiarse la propia clave no es uno, y meterla ahí la haría
      aparecer en la bitácora de usuarios ofreciendo un «revertir» que no existe
- [ ] **El antes y el después descartan cualquier clave que suene a secreto, con su valor.** Hoy
      ninguna tabla auditada tiene columna de clave —el hash vive en `auth.users`—, así que el
      filtro no quita nada; se puso igual porque es [RNF-18](docs/03-requisitos-y-bdd.md#rnf-18) y porque confiar en que ninguna de las
      19 tablas tenga nunca una columna así sale más caro que sostenerlo
- [ ] **La página de la auditoría trae 50 entradas como máximo, y es su propia variable.** El [10 §4.11](docs/10-ux-y-mockups.md#411-configuración-solo-gerencia)
      no dice cuántas, y el techo del libro no sirve: una fila de auditoría es más ancha y la lista
      crece con cada cambio de cada tabla. Pedir más del máximo se rechaza en vez de recortarse en
      silencio, para que un total no deje de cuadrar sin que nadie sepa por qué

**De la [10.4](docs/08-plan-de-desarrollo.md#tarea-10-4), entregar el pedido:**

- [ ] **«Entregado» quedó queriendo decir «pagado y entregado», y por eso no hay entrega con cuenta
      por cobrar.** El [CU-07](docs/02-casos-de-uso.md#cu-07) permitía terminar de pagar con la entrega, y la regla que puso quien
      dirige es que el pedido se paga antes de entregarse. Con eso un pedido entregado nunca deja
      saldo, y la pantalla no necesita una cifra de «le deben». **Lo que hay que decidir es qué se
      hace cuando el cliente se lleva el pedido debiendo**: hoy la única salida es no marcarlo
      entregado hasta que pague
- [ ] **La descripción que el contrato acordó para la ruta de entrega dice cinco escrituras y son
      tres.** La API fue con el texto acordado, porque cambiarlo es un PR de la especificación y la
      ruta no se comporta distinto por eso. Corregirlo es una línea del [20](docs/20-contrato-de-api.md) y su copia fijada

**De la 8.15, el respaldo en la API:**

- [ ] **`pedido_lineas` entra en el alcance de mes y de rango por la fecha de su pedido.** No tiene
      fecha propia, y dejarla fuera daría un respaldo de un mes con pedidos sin sus líneas, que no
      sirve para nada. El [13 §2](docs/13-respaldo-y-exportacion.md#2-alcance-seleccionable) dice «lo de ese mes» sin decir qué pasa con una tabla que
      cuelga de otra. **Es la única tabla que entra por la fecha de otra**, y si quien dirige
      prefiere que un alcance de mes lleve solo tablas con fecha propia, se quita en una línea
- [ ] **La hora de cada entrada del ZIP va fijada en 1970, para que dos respaldos de los mismos
      datos resuman igual.** Así el `sha256` del manifiesto sirve de comparación, y cuándo se generó
      lo dice el propio manifiesto. Ningún documento pide que el archivo sea reproducible: se
      decidió porque un resumen que cambia con el reloj no deja comprobar nada
- [ ] **La descarga trae el objeto entero en cada parte y corta el trozo en la API.** Storage
      entrega objetos y no rangos, y pedirle un rango sería confiar en que el objeto no cambió entre
      dos llamadas. Un respaldo no se corrige nunca ([ADR-004](docs/adr/ADR-004-base-solo-escritura.md)), así que lo seguro y lo simple
      coinciden, pero **es tráfico repetido** si un respaldo total llega a muchas partes
- [ ] **La fila de `exportaciones` se escribe antes de subir el ZIP, y no al revés.** Así el «no» a
      Operación lo da la política de la tabla y sale como el `40300` que el contrato promete;
      subiendo primero, el «no» vendría del bucket y se leería como un fallo del proveedor. Si la
      subida falla después, la transacción se revierte y no queda fila

**Del arreglo de la razón de no escribir credenciales en `prisma_db`, que no es una tarea del 08:**

- [ ] **La migración del rol `prisma_api` sigue diciendo que el repositorio es público, y se dejó
      así.** Es falso desde el [ADR-051](docs/adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md), que fija que `prisma_db` es privado. Está fusionada y una
      migración aplicada no se edita jamás, así que corregirla pide otra migración, y entonces la
      puerta obliga a publicar el esquema siguiente y detrás va un PR de la API subiendo
      `prisma.esquema`: dos versiones y tres PR por una frase que nadie ejecuta. **Se decidió no
      gastarla**, y que la corrección viaje en la cabecera de la próxima migración que se escriba
      por su cuenta. Donde sí se lee la afirmación ya está corregida: los dos guiones que la
      repetían
- [ ] **Las cadenas de los guiones `.ps1` se arreglaron quitándoles las tildes, no poniéndoles el
      BOM.** Con un BOM, PowerShell 5.1 leería el archivo como UTF-8 y no haría falta la regla: se
      arreglarían de una vez las cadenas y los comentarios. Se siguió la regla que ya estaba, porque
      cambiar de remedio es cambiar el `AGENTS.md` de `prisma_db` y eso va con su ADR. **Si se
      prefiere el BOM**, se escribe ese ADR y la regla se retira

---

## <a id="titulo-11"></a>Cómo se mantiene este archivo

- **Una tarea hecha es un commit, y el commit explica por qué** ([ADR-028](docs/adr/ADR-028-un-commit-por-tarea.md)). El asunto lleva el
  sprint y el número —`Sprint 3 / 3.11: marca de registro tardio`— y el cuerpo son tres párrafos:
  `Hace:`, `Decide:` y `Verifica:`, el último con qué se rompió a propósito para ver fallar las
  pruebas. Dos tareas no van en un mismo commit aunque toquen la misma clase. Así `git log
  --oneline` es esta misma lista, en el orden en que se hizo.
- **Y el mensaje no tiene tope total** ([ADR-036](docs/adr/ADR-036-sin-limite-en-el-commit.md)), pero cada párrafo cabe en cuatro líneas de 100
  columnas ([ADR-041](docs/adr/ADR-041-cuatro-lineas-por-parrafo.md)). El porqué largo va en el plan de trabajo, que se escribió antes; un párrafo
  que no cabe es la señal de que algo del plan se fue al commit.
- Una tarea se marca `[x]` cuando su commit está en `develop` con la integración continua en verde
  ([21 §6.5](docs/21-trabajo-en-paralelo.md#65-ramas-e-integración)). La marca viaja en el PR de la especificación de esa misma tarea, que se
  acepta junto con el del código. Lo escrito pero no probado lleva ✏️, no `[x]`; lo que alguien
  tiene en las manos lleva 🚧.
- Después de marcar algo, se corre `node scripts/docs/documentar.mjs enlazar`: rehace las marcas ⚡ y
  🔒, lo que puede empezar hoy y cuánto falta. **Las dependencias no se escriben aquí**: viven en el
  plan.
- **Lo nuevo no entra aquí primero.** Una tarea que no está en el plan va al plan o, si es una idea
  para después, al roadmap ([08 §6](docs/08-plan-de-desarrollo.md#6-backlog-priorizado)).
- Es un documento compartido, como todo `docs/`: lo actualizan todos. Cada cambio sube
  su versión ([`22-documentacion.md`](docs/22-documentacion.md)).
