# 15 · Glosario

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.0.2](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/15-glosario.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-30 | [Negocio](INDICE.md#etiqueta-negocio) |

Vocabulario compartido entre el negocio, la contabilidad y el sistema. Cuando haya duda sobre
qué significa algo, este documento manda.

---

## Términos financieros

**Adelanto**
Plata entregada a la empleada a cuenta de su salario. **No es gasto**: es una cuenta por cobrar
que se descuenta al liquidar la nómina. Registrarlo como gasto y luego pagar el salario completo
cuenta el mismo dinero dos veces.

**Anticipo**
El 50% que paga el cliente al confirmar un pedido. **No es un ingreso**: es una deuda con el
cliente hasta que se entrega. Aumenta la caja pero no la utilidad.

**Aporte de capital**
Plata que entra al negocio desde afuera, puesta por la propiedad. Aumenta la caja y el
patrimonio, pero no es un ingreso.

**Caja**
Movimiento real de dinero: lo que entró y salió de las cuentas en un período. Responde
*"¿cuánta plata hay?"*

**Caja libre**
Saldo total menos anticipos de pedidos no entregados menos gastos fijos comprometidos. Responde
*"¿cuánto puedo usar hoy sin meterme en problemas?"* **Es la cifra más importante del sistema.**

**Causación**
Registrar un ingreso o un gasto cuando ocurre el hecho económico, independientemente de cuándo
se mueve la plata. En Emprende, la venta se causa **al entregar el pedido**.

**Contra-asiento**
Movimiento nuevo que reversa uno anterior sin modificarlo. Es la forma de corregir un error
cuando el original no se puede tocar.

**Costo directo**
Lo que cuesta producir específicamente ese pedido: insumos, consumibles y tiempo de trabajo.
Varía con la cantidad.

**Descapitalización**
Retirar más de lo que el negocio genera. Se puede tener doce meses rentables seguidos y estar
vaciando el negocio. El sistema alerta cuando los retiros de 12 meses superan las utilidades.

**Distribución de utilidades**
Plata que se saca del negocio por ser propietario. **No es gasto**: no reduce la utilidad, pero
sí la caja y el patrimonio.

**Gasto**
Lo que el negocio consume para poder operar. La prueba es: *¿sin esto puedo producir?* Si la
respuesta es no, es gasto. Arriendo, tinta, salario y pro-labore son gastos.

**Gasto fijo**
Se paga todos los meses sin importar cuánto se venda: arriendo, servicios, internet, pro-labore,
salario.

**Inversión**
Compra de un activo que dura: una prensa, una máquina de bordar. **No reduce la utilidad**:
cambia plata por un bien que sigue siendo del negocio.

**Margen bruto**
Ingresos menos costo directo. Lo que queda para cubrir gastos fijos.

**Margen de contribución**
Precio menos costo variable. Lo que aporta cada unidad vendida a cubrir los gastos fijos.
Para el simulador de nómina se excluye el costo del tiempo, porque el tiempo es justamente el
gasto fijo que se busca cubrir.

**Margen neto**
Utilidad causada dividida entre ingresos. Lo que realmente queda de cada peso vendido.

**Margen por hora**
⛔ Retirado el 2026-10-06. Era el margen en pesos dividido entre las horas que exigía el producto,
y guiaba qué priorizar cuando había más pedidos que tiempo. El catálogo dejó de pedir tiempo, así
que hoy se prioriza por **margen en pesos** por unidad.

**Patrimonio**
Aportes menos distribuciones más utilidades acumuladas. Lo que se ha construido.

**Pro-labore**
Sueldo que se asigna quien dirige el negocio por el trabajo que hace en el taller. **Es gasto**
y reduce la utilidad. Sin él, el negocio parece rentable porque tiene mano de obra gratis.
Se fija preguntándose *"¿cuánto tendría que pagarle a alguien para que hiciera lo que yo hago?"*

**Punto de equilibrio**
Ventas necesarias para no ganar ni perder. Gastos fijos divididos entre el margen de
contribución porcentual.

**Registro tardío**
Movimiento digitado más de 7 días después de haber ocurrido. No es un error, es una señal de
que el hábito de registro se está aflojando.

**Reserva**
Porcentaje de cada entrada que se aparta como colchón del negocio. Meta sugerida: tres meses de
gastos fijos.

**Retiro**
Salida de plata hacia la propiedad. Se divide en **pro-labore** (gasto) y **distribución**
(no gasto). Distinguirlos es la base de saber si el negocio realmente gana.

**Sobres (los 4)**
Reparto automático de cada peso que entra: costo directo, gastos fijos, reserva y retiro. Los
porcentajes son parametrizables.

**Tiempo ocioso**
Horas pagadas menos horas cargadas a pedidos. El tiempo que se paga y no se vende.

**Utilidad causada**
Ingresos causados menos costos y gastos del período. Responde *"¿el negocio es rentable?"*

---

## Términos del sistema

**Anulación**
Marcar un registro como sin efecto, con motivo obligatorio, autor, fecha, dispositivo e IP.
**Nunca se borra.**

**Auditoría**
Bitácora de todos los cambios: quién, cuándo, desde dónde y qué cambió. La escriben triggers de
la base de datos, no la aplicación.

**Bitácora de cambios**
El panel de Gestión de usuarios que muestra quién cambió qué, cuándo y por qué, con lo más
reciente arriba. Es la cara legible de la **auditoría**: la auditoría registra todo cambio del
sistema y la escriben los triggers; la bitácora muestra los de usuarios y cargos en lenguaje
llano y es el único sitio desde donde se puede **revertir**. En ninguna de las dos se borra nada.

**Cargo**
Lo que una persona **hace en el negocio**: Gerente, Empleada de producción, Domiciliaria,
Asistente administrativa, Aprendiz SENA, Contratista externo. Es descriptivo y sirve para
contexto y reportes. **Nunca decide un permiso.** Vive en `usuarios.cargo_id`.

**Catálogo de cargos**
La lista de cargos disponibles, administrada por Gerencia desde el sistema. Es abierta: se
agregan y renombran cargos sin tocar el código. Un cargo no se borra, se desactiva con motivo,
para que los usuarios que lo tuvieron sigan teniendo sentido. Vive en la tabla `cargos`.

**Cierre mensual**
Congelar un mes con sus cifras definitivas. Un movimiento registrado después con fecha de ese
mes no altera el reporte histórico.

**Clave temporal**
Contraseña que Gerencia entrega en persona al crear un usuario o al restablecerle el acceso.
Obliga a cambiarla en el primer ingreso (`debe_cambiar_clave`). Se entrega en persona porque
no hay canal de correo para recuperar contraseñas.

**Correo sintético**
Dirección interna que el sistema arma a partir del nombre de usuario para autenticar contra
el proveedor, que solo entiende correos: `marcela` → `marcela@usuarios.prisma.com`. Es un
detalle técnico: **nunca se muestra, nunca se pide, nunca se imprime.**

**Descarga del Inicio**
Bajar en CSV o PDF lo que el Inicio está mostrando: las tres cifras del mes, los saldos de
cuentas al corte, los últimos doce meses, las alertas activas y los pedidos por entregar.
**No es un respaldo**: no trae tablas completas ni manifiesto, y con ella no se restaura nada.
Es el único archivo que el Inicio produce, y aun así no escribe nada en la base. Solo Gerencia.

**Fecha del movimiento**
Cuándo ocurrió de verdad. Es la que manda en todos los reportes.

**Fecha de digitación**
Cuándo se registró en el sistema. Automática, no editable, solo para auditoría.

**Gerencia**
Tipo de usuario con acceso total. Único que ve utilidad, retiros, patrimonio, nómina, costos y
auditoría.

**Nombre de usuario**
Con lo que cada persona inicia sesión: entre 3 y 20 caracteres, minúsculas, números, punto,
guion y guion bajo. Es único y no distingue mayúsculas, así que `Marcela` y `marcela` son la
misma persona. Se usa en lugar del correo porque en el taller no todo el mundo tiene correo.

**Operación**
Tipo de usuario restringido. Registra ventas y gastos, consulta productos sin ver márgenes, y
ve únicamente su propio desprendible.

**PWA**
Aplicación web que se instala en el celular como si fuera una app normal y funciona con señal
intermitente.

**Reversión**
Deshacer un cambio registrado en la bitácora escribiendo una entrada nueva, nunca borrando la
original: la entrada deshecha queda marcada como `Revertida` y la nueva dice qué se deshizo y
por qué. Es al historial de usuarios lo que el **contra-asiento** es a la contabilidad. Se
rechaza si dejaría el sistema sin un usuario activo de Gerencia. Un restablecimiento de
contraseña no se puede revertir: el sistema nunca guardó la anterior.

**Rol**
Palabra ambigua que **este proyecto ya no usa**, porque significaba dos cosas a la vez: los
permisos y el oficio de la persona. Lo primero es el **tipo de usuario**; lo segundo, el
**cargo**. Si aparece «rol» en un documento viejo, se refiere al tipo de usuario.

**Solo escritura**
Diseño de base de datos en el que nada se elimina. El permiso de borrado está revocado en el
motor, no solo en el código.

**Tipo de usuario**
Lo que una persona **puede ver y hacer** en el sistema. Solo hay dos valores y no se agregan
más: `gerencia` y `operacion`. Es lo que evalúa Row Level Security. Vive en `usuarios.tipo`.
**El tipo dice qué puede ver; el cargo dice qué hace.**

**Usuario desactivado**
Usuario al que se le quitó el acceso con motivo escrito, autor y fecha. **Nunca se borra**: su
historia de movimientos, pedidos y nómina se conserva intacta. No puede iniciar sesión aunque
la contraseña sea correcta. Siempre debe quedar al menos un usuario activo de tipo Gerencia.

**Vista previa de Operación**
Interruptor del menú de la sesión, disponible solo para Gerencia, que pinta la interfaz como la
vería una persona de tipo Operación. **No es una prueba de permisos**: solo cambia lo que dibuja
el navegador, y los permisos de verdad los aplica Row Level Security dentro de la base de datos.
Sirve para decidir si a la empleada le falta o le sobra algo en pantalla; para comprobar que no
puede llegar a los datos ocultos hay que entrar con una sesión real. Mientras está activa, una
franja fija lo advierte y ofrece salir con un clic.

---

## Términos técnicos

**Ambiente**
Una copia completa del sistema —front, API y base de datos— separada de todas las demás. Hay
cuatro: desarrollo, QA, aprobación y producción. Cada uno tiene su propia base, así que lo que
se registra en uno no aparece en los otros. El front siempre dice en cuál estás, para que nadie
anote la venta del día en el sitio equivocado y la dé por guardada.

**Arquitectura hexagonal**
Separar las reglas de negocio de la tecnología mediante interfaces. Permite cambiar de base de
datos o de interfaz sin tocar los cálculos.

**Artefacto**
El paquete ya compilado que se instala en un ambiente: el front listo para servir o la API lista
para ejecutar. Se construye una sola vez y ese mismo paquete va pasando de ambiente en ambiente.
Volver a compilarlo para producción sería aprobar una cosa y publicar otra.

**BFF**
*Backend for frontend*: una capa de servidor hecha a la medida de una pantalla, que le entrega
los datos ya armados como los necesita. En Emprende no es un proyecto aparte: `emprende_api` hace de
API y de BFF al mismo tiempo, porque hoy hay un solo cliente.

**Caso de uso**
Una acción completa del sistema, en un archivo propio. Corresponde a un `CU-xx` del documento [02](02-casos-de-uso.md).

**Clave de idempotencia**
Un número irrepetible que la aplicación le pega a cada acción que va a guardar algo, como el
consecutivo de un recibo. Se genera una sola vez, cuando la persona decide la acción, y viaja
igual en todos los reintentos. Es lo que le permite a la API distinguir *"la misma venta que
llegó dos veces"* de *"dos ventas distintas"*.

**Código de status**
Número de cinco cifras que acompaña a toda respuesta de la API y dice exactamente qué pasó:
`20100` es «se creó», `42200` es «los datos no pasan las reglas». Las tres primeras cifras son el
resultado general y las dos últimas dicen de qué módulo y de qué caso se trata. Sirve para
soporte: con ese número se sabe qué ocurrió sin tener que adivinar por el texto.

**Contrato de API**
El acuerdo escrito de cómo se hablan el front y la API: qué se le pide, qué devuelve, con qué
forma y con qué códigos. Se llama contrato porque ninguna de las dos partes puede cambiarlo por
su cuenta. Está en el documento [20 · Contrato de API](20-contrato-de-api.md).

**Descriptor de formulario**
La lista de reglas de un formulario que la API le manda al front **como datos**: qué campos hay,
cuáles son obligatorios, qué mínimo y qué máximo tienen y qué frase mostrar si algo no cumple.
Así el front puede avisar de un error al instante sin llevar la regla escrita dentro. La regla
sigue siendo de la API, que la vuelve a comprobar cuando la petición llega, siempre.

**Dominio**
El núcleo del sistema: modelo y reglas de negocio. No conoce Flutter, ni la base de datos, ni
internet.

**Dominio (de base de datos)**
Tipo propio que se define una sola vez en PostgreSQL con su regla incluida —por ejemplo,
«dinero es un entero que no puede ser negativo»— y se usa en todas las columnas que lo
necesiten. Así la regla vive en un solo sitio y no se puede olvidar en la siguiente tabla. Nada
que ver con el **dominio** de la arquitectura hexagonal; coinciden en el nombre y en nada más.

**Firma de petición**
Sello que el front le pone a cada petición con una clave secreta que solo él y la API conocen.
Si alguien cambia aunque sea una coma en el camino, el sello deja de cuadrar y la API rechaza la
petición. **Protege el trayecto, no el aparato:** si el celular o el computador desde donde se
trabaja están comprometidos, esto no ayuda.

**Función pura**
Con las mismas entradas devuelve siempre el mismo resultado y no modifica nada externo. Todos
los cálculos financieros son funciones puras, y por eso se pueden probar en milisegundos.

**Idempotencia**
Propiedad de una acción que se puede repetir sin que el efecto se duplique. Si la empleada toca
Guardar tres veces porque no vio la confirmación, el gasto queda registrado una sola vez. Es lo
que hace seguro reintentar cuando la señal se cae a mitad de camino, y sin ella la única forma
de no duplicar sería no reintentar.

**Migración**
Archivo con los cambios que hay que aplicarle a la base de datos para llevarla de una versión a
la siguiente: una tabla nueva, una columna, una regla. Se aplican en orden, y **una migración ya
aplicada no se edita jamás**: si estaba mal, se escribe otra que corrige. Es el mismo principio
del **contra-asiento**, aplicado al esquema.

**Nonce**
Un valor que se usa una sola vez y nunca se repite, y que acompaña a cada petición. Si a la API
le llega dos veces el mismo, sabe que alguien capturó una petición vieja y la está reenviando, y
la rechaza. Se pronuncia «nons» y no tiene traducción cómoda al español.

**OpenAPI**
Formato estándar para describir todo lo que una API sabe hacer: qué operaciones tiene, qué recibe
y qué devuelve. Es un archivo, no una pantalla. En Emprende se genera solo, a partir del código, y
así nunca puede decir una cosa distinta de la que el sistema hace de verdad.

**Promoción**
Pasar a un ambiente lo mismo que ya funciona en el anterior, siempre en el mismo orden:
desarrollo → QA → aprobación → producción. Se promueven las **migraciones** y se promueve el
**artefacto**. Nada llega a producción sin haber pasado por los tres ambientes previos.

**Propagación de identidad**
Hacer que la base de datos sepa **quién** es la persona que está detrás de una petición, aunque
quien se conecte sea la API y no el navegador. Antes de tocar ninguna tabla, la API le pasa a
PostgreSQL los datos de la sesión, y así **RLS** sigue decidiendo los permisos. Sin esto, la
base solo vería a la API, y los permisos se caerían a la aplicación: justo lo que este proyecto
decidió no hacer.

**Puerto y adaptador**
El puerto es la interfaz que declara qué necesita el dominio. El adaptador es la implementación
concreta con una tecnología específica.

**RLS (Row Level Security)**
Mecanismo de PostgreSQL que decide qué filas puede ver cada usuario **dentro de la base de
datos**. Los permisos no dependen de que la aplicación esconda un botón.

**SemVer**
Forma estándar de numerar versiones con tres números, `MAJOR.MINOR.PATCH`. El primero sube
cuando algo deja de ser compatible y obliga a actualizar; el segundo, cuando se agrega
funcionalidad que no rompe nada; el tercero, cuando solo se corrige. El front y la API llevan
versiones independientes: fingir que van juntas esconde cuál de las dos cambió de verdad.

**Sobre de respuesta**
La forma fija que tiene toda respuesta de la API, salga bien o salga mal: siempre las mismas
tres casillas. `status`, el **código de status**; `mensaje`, la frase en español lista para
mostrarle a alguien del taller; y `data`, la información pedida, si la hay. Que sea siempre igual
evita que cada pantalla tenga que entender una respuesta distinta.

**Swagger**
La página que muestra el **OpenAPI** de forma legible y deja probar la API desde el navegador.
Sirve para entender y revisar qué hace el sistema sin leer código. En desarrollo, QA y aprobación
está abierta; en producción va detrás de contraseña, porque la lista de operaciones es un mapa
del sistema.

**Trigger**
Código que PostgreSQL ejecuta automáticamente al insertar o modificar una fila. Se usa para la
auditoría, para que sea imposible evitarla desde la aplicación.

---

## Equivalencias con el lenguaje contable

| En Emprende se dice | Un contador diría |
|---|---|
| Utilidad causada | Utilidad del ejercicio |
| Caja | Flujo de efectivo |
| Anticipo por devengar | Anticipos recibidos de clientes (pasivo) |
| Pro-labore | Gasto de personal de la administración |
| Distribución | Retiro del propietario |
| Los 4 sobres | Presupuesto por destinación |
| Anulación | Reverso |
| Contra-asiento | Asiento de reversión |

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [09](09-plan-de-implantacion.md "09 · Plan de implantación")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [14 · Roadmap e ideas](14-roadmap-e-ideas.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [16 · Base de datos: snapshots y datos de prueba](16-base-de-datos-y-snapshots.md)
