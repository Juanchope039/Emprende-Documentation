# 09 · Plan de implantación

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [7.3.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/09-plan-de-implantacion.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-15 | [Plan](INDICE.md#etiqueta-plan) · [Entrega](INDICE.md#etiqueta-entrega) · [Negocio](INDICE.md#etiqueta-negocio) |

Cómo se pasa de tener el software construido a que el negocio realmente lo use.

> **La mayoría de estos proyectos no fracasan por el código. Fracasan porque el registro diario
> no se convierte en hábito.** Este documento existe para evitar eso.

---

## 1. Checklist de aprobación del mockup

**Nada se programa hasta que esto esté firmado.** Corregir una pantalla en el mockup cuesta
minutos; corregirla después de construida cuesta días.

Abrir [`../mockup/prisma-mockup.html`](../mockup/prisma-mockup.html) y revisar pantalla por
pantalla:

| # | Pantalla | Qué verificar | ✓ |
|---|---|---|:---:|
| 0 | Acceso | ¿Entrar con usuario y contraseña es simple? ¿El mensaje de error se entiende? | ⬜ |
| 1 | Dashboard | ¿Las tres cifras se entienden sin explicación? ¿Las alertas son claras? | ⬜ |
| 2 | Pedidos | ¿El orden por fecha y los estados reflejan cómo trabajas? | ⬜ |
| 3 | Movimientos | ¿El registro rápido tiene todos los campos que necesitas y ninguno de más? | ⬜ |
| 4 | Productos | ¿Están todos tus productos? ¿Falta alguna categoría de bordado? | ⬜ |
| 5 | Inversiones y retiros | ¿La división pro-labore / distribución es clara? | ⬜ |
| 6 | Reportes | ¿Responden lo que necesitas saber cada mes? | ⬜ |
| 7 | Nómina | ¿El simulador te daría confianza para decidir? | ⬜ |
| 8 | Cotizador | ¿La cotización se ve presentable para enviar por WhatsApp? | ⬜ |
| 9 | Gestión de usuarios | ¿Están todas las personas del equipo? ¿Los cargos son los del taller? | ⬜ |
| — | Tipos de usuario | Entrar con un usuario de Operación: ¿es correcto lo que se oculta? | ⬜ |
| — | Celular | Abrirlo en el celular: ¿se ve bien y se puede usar con una mano? | ⬜ |

**Firma de aprobación:** ______________________  **Fecha:** ____________

### 1.1 La segunda firma: el mismo checklist, en UAT

El mockup se aprueba antes de programar. Pero aprobar un prototipo no es aprobar el sistema: el
prototipo no tiene datos, no falla y no se demora. Por eso **estas mismas 12 filas se vuelven a
recorrer en UAT, contra el sistema real**, con datos realistas anonimizados, antes de publicar
nada en prod.

| Firma | Qué autoriza | Sobre qué se hace |
|---|---|---|
| Firma del mockup | Empezar a construir | El mockup HTML |
| **Firma de UAT** | Publicar en prod | El artefacto corriendo en pre-prod, con datos anonimizados ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)) |

En UAT se verifica, además, lo que un prototipo no puede mostrar:

| # | Qué verificar | ✓ |
|---|---|:---:|
| 13 | La franja dice **«Ambiente de Aprobación · los datos no son reales»** arriba, y la versión aparece **en el pie de la barra lateral, abajo a la izquierda** | ⬜ |
| 14 | Registrar un movimiento con datos de verdad sigue tomando menos de 30 segundos | ⬜ |
| 15 | La sesión de Operación se prueba con un usuario real de uat, no con la vista previa de Gerencia | ⬜ |
| 16 | Lo que Operación no debe ver, no llega: lo niega la base, no la pantalla | ⬜ |
| 17 | Las tres cifras del mes de prueba cuadran con el cálculo hecho a mano | ⬜ |
| 18 | Tocar **Guardar dos veces** porque la confirmación se demoró deja **un solo** movimiento, no dos | ⬜ |
| 19 | Con el celular en modo avión se registra un gasto, queda visible como pendiente de enviar, y al volver la señal se envía solo y una sola vez | ⬜ |

> **Se firma una versión, no una impresión.** Lo que se aprueba en UAT es el artefacto con su
> número de versión, y **ese mismo artefacto es el que va a prod, sin recompilar**
> ([ADR-013](adr/ADR-013-cuatro-ambientes.md)). Si se vuelve a compilar, se publicó algo distinto
> de lo que se aprobó.

**Firma de aprobación en UAT:** ______________________  **Versión aprobada:** ____________
**Fecha:** ____________

---

## 2. Fase previa opcional: formalización

El negocio aún no está formalizado. **Esto no bloquea el software** —PRISMA funciona igual—
pero sí bloquea la contratación formal de una empleada.

| Paso | Qué implica | Cuándo |
|---|---|---|
| 1 | Inscripción en el RUT ante la DIAN | Antes de contratar |
| 2 | Registro mercantil en la Cámara de Comercio de Cali | Antes de contratar |
| 3 | Cuenta bancaria a nombre del negocio | Cuanto antes: facilita separar la plata |
| 4 | Decidir figura jurídica con un contador | Antes de contratar |

> **Recomendación independiente del software:** abrir la cuenta bancaria separada es lo más
> valioso que se puede hacer antes del go-live, porque hace física la separación que PRISMA hace
> contable. Cuesta poco y ordena mucho.

El paso 4 tiene consecuencias económicas importantes sobre el costo de una empleada, pero ese
análisis está fuera del alcance de esta versión y queda en
[`14-roadmap-e-ideas.md`](14-roadmap-e-ideas.md).

---

## 3. Los cuatro ambientes en la puesta en marcha

Poner PRISMA a andar ya no es «subirlo». Hay cuatro ambientes y lo que entra a prod solo llega
por promoción, en orden ([ADR-013](adr/ADR-013-cuatro-ambientes.md)). El procedimiento técnico
completo vive en [`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md); aquí va lo que le
toca a la implantación.

> **Desde el [ADR-044](adr/ADR-044-dos-ambientes-desplegados.md) qa es una etapa de la tubería** y no se puede abrir en un navegador:
> lo que la tabla de abajo hacía en ella se hace como dice su fila. **Y desde el [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)** este
> proyecto aloja dev y uat, y prod, donde trabaja el taller, vive en otro repositorio.

| Ambiente | Qué pasa aquí durante la implantación | Datos |
|---|---|---|
| **dev** | Se prueba la importación con archivos inventados y se corrigen los mapeos de columnas | Ficticios |
| **qa** | Es una etapa de la tubería. **El ensayo de la migración completa va a la pila local** ([ADR-038](adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md)) de quien la hace, porque es el único sitio sin despliegue que no comparte los datos reales: ahí se cronometra la jornada de digitación | Reales, solo en esa máquina |
| **uat** | Es la etapa de la tubería con la semilla anonimizada **y el ambiente que se despliega**: recibe el artefacto que esa etapa aprobó, sin recompilar, y Gerencia recorre aquí el checklist ([§1.1](#11-la-segunda-firma-el-mismo-checklist-en-uat)) y firma la versión ([ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)) | Realistas, **anonimizados** |
| **prod** | Vive en otro repositorio ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)). Recibe el mismo artefacto que se firmó en uat, sin recompilar. Aquí entra el alistamiento de usuarios y la migración de verdad | Reales |

> **Ensayo general antes del estreno.** La migración se ensaya completa antes de hacerla
> en prod. La primera vez que se importe el Excel del negocio no puede ser también la primera
> vez que alguien importa un Excel.

### 3.1 Alistamiento técnico de los ambientes

Va numerado primero porque **es lo primero**: sin esto no hay a dónde promover nada, y dos de los
pasos cuestan plata y hay que decidirlos con tiempo.

| # | Paso | Responsable | Cuándo |
|---|---|---|---|
| 1 | Crear los **proyectos de Supabase**: dev y qa en el [Sprint 0](08-plan-de-desarrollo.md#sprint-0), y pre-prod al final. Cada uno con su propia base, sus claves y su almacenamiento. uat no tiene proyecto, qa queda quieto ([ADR-044](adr/ADR-044-dos-ambientes-desplegados.md)), y el de prod lo pone el otro repositorio ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)) | Apoyo técnico | [Sprint 0](08-plan-de-desarrollo.md#sprint-0) y [Sprint 9](08-plan-de-desarrollo.md#sprint-9) |
| 2 | **Contratar lo que hay que pagar:** el plan de pago de Supabase en pre-prod, y el alojamiento de `prisma_api` en **pre-prod**, que no se puede apagar ([19 §2.4](19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro), condición 2 del [ADR-026](adr/ADR-026-railway-al-final.md)). dev y qa se quedan en planes gratuitos o apagables | Gerencia | Antes de levantar pre-prod |
| 3 | Crear el rol **`prisma_api`** en cada ambiente: sin `BYPASSRLS`, sin `SUPERUSER` y sin ser dueño de las tablas | Apoyo técnico | [Sprint 0](08-plan-de-desarrollo.md#sprint-0) |
| 4 | **Levantar el alojamiento de la API en los cuatro ambientes**: una imagen de contenedor por versión, con su memoria y sus variables ([§3.2](#32-alojar-la-api-de-java-en-los-cuatro-ambientes)), en Railway ([ADR-032](adr/ADR-032-railway-en-dev-ahora.md)) | Apoyo técnico | dev, en el [Sprint 0](08-plan-de-desarrollo.md#sprint-0); pre-prod, en el [Sprint 9](08-plan-de-desarrollo.md#sprint-9). qa y uat no se alojan |
| 5 | Cargar los **secretos de cada ambiente** fuera del repositorio: variables de entorno en la API, `--dart-define` al compilar el front | Apoyo técnico | [Sprint 0](08-plan-de-desarrollo.md#sprint-0) |
| 6 | Guardar la clave `service_role` de cada ambiente en un **secreto aparte**, reservado para migraciones y para crear identidades contra GoTrue ([ADR-033](adr/ADR-033-service-role-solo-en-auth.md)) | Apoyo técnico | [Sprint 0](08-plan-de-desarrollo.md#sprint-0) |
| 7 | Promover el esquema dev → qa → uat → prod y verificar `schema_version` en cada base | Apoyo técnico | Antes de cada hito |
| 8 | Comprobar en cada ambiente que `POST /api/v0/consultas/version` responde el ambiente correcto y que la franja aparece donde debe | Apoyo técnico | Antes de cada hito |
| 9 | Ejecutar la prueba de permisos con sesión real en cada etapa de la tubería, en dev, en pre-prod y en prod ([ADR-012](adr/ADR-012-identidad-a-postgres.md)) | Apoyo técnico | Antes del go-live |

> **Esto no es un impedimento, es una factura.** «Siempre en línea» significa que prod y uat no
> pueden estar en el plan gratuito de Supabase: ese plan pausa el proyecto tras una semana de
> inactividad y un taller que factura los lunes encontraría el sistema dormido. Y la API en Java
> necesita un contenedor encendido, que también se paga: **en prod porque el taller trabaja, y en
> uat porque la primera petición después de la siesta paga el arranque entero de la JVM y eso es lo
> que Gerencia se encontraría al ir a aprobar** ([19 §2.4](19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)). Son **dos proyectos de Supabase
> de pago y dos alojamientos de API encendidos**; desde el [ADR-044](adr/ADR-044-dos-ambientes-desplegados.md), uno y uno, porque uat
> ya no se aloja. Desde el [ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md), ese uno es pre-prod, donde Gerencia aprueba, y prod se paga
> aparte, en el otro repositorio. Por eso **[RNF-14](03-requisitos-y-bdd.md#rnf-14) ya no exige costo cero sino costo mensual al
> mínimo sostenible**: el costo cero era incompatible con [RNF-20](03-requisitos-y-bdd.md#rnf-20), y sostener la contradicción en
> el papel no la habría hecho desaparecer el día del go-live.

### 3.2 Alojar la API de Java en los cuatro ambientes

`prisma_api` es Java 25 con Spring Boot ([ADR-024](adr/ADR-024-java-25-y-gradle.md)). Eso no
cambia ni un caso de uso, pero sí cambia el alistamiento: ya no basta con publicar archivos
estáticos, hay **un proceso encendido** en cada ambiente. Lo que hay que dejar listo antes del
go-live:

**La imagen**

| Qué | Cómo queda | Por qué |
|---|---|---|
| Base | Imagen con solo el **entorno de ejecución de Java 25**, sin JDK ni herramientas | Lo que no está en la imagen no se puede ejecutar por error, y pesa menos multiplicado por cuatro |
| Contenido | El `jar` de Spring Boot y nada más | Ninguna consola, ningún script suelto |
| Etiqueta | El número de versión exacto, **nunca `latest`** | Lo que se promueve de uat a prod es una etiqueta, no una compilación nueva ([ADR-013](adr/ADR-013-cuatro-ambientes.md), [ADR-014](adr/ADR-014-semver.md)) |
| Verificación de salud | Recibe tráfico solo cuando `GET /actuator/health/readiness` responde | Un contenedor que arrancó todavía no es un contenedor listo. La sonda es la de Actuator ([19 §2.4](19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)), no la consulta de versión: esa es el contrato de compatibilidad con el front |

**La memoria y el arranque**

| Ambiente | Memoria mínima del contenedor | ¿Se acepta que arranque en frío? |
|---|---:|---|
| dev | 512 MB | Sí. Se puede apagar fuera de horario |
| qa | — | No se aloja: es una etapa de la tubería ([ADR-044](adr/ADR-044-dos-ambientes-desplegados.md)) |
| uat | — | No se aloja: es una etapa de la tubería |
| **pre-prod** | **1 GB** | **No.** Es donde Gerencia aprueba, y el arranque en frío es lo que se encontraría ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)) |
| **prod** | **1 GB** | **No.** [RNF-20](03-requisitos-y-bdd.md#rnf-20) exige estar siempre en línea. Lo aloja el otro repositorio, con la misma imagen |

> **La JVM pide memoria y eso no se negocia, se presupuesta.** Por debajo de 512 MB, Spring Boot
> arranca al límite y el primer pico de trabajo lo tumba. Estas cifras son el punto de partida:
> **se miden en dev antes de fijarlas en prod**, y si el consumo real pide más,
> se sube. Apretar la memoria para ahorrar unos pesos y que el taller encuentre la API caída es
> ahorrar por el lado más caro.

**Las variables de entorno, una tanda por ambiente**

La lista completa con sus valores de ejemplo vive en
[`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md) [§3.2](19-ambientes-y-entrega.md#32-la-api-variables-de-entorno). Aquí importa qué hay que tener
cargado, y cuatro veces, antes de promover nada:

| Variable | Qué cambia entre ambientes |
|---|---|
| `PRISMA_AMBIENTE` | `dev`, `qa`, `uat` o `prod`. Es lo que responde `POST /api/v0/consultas/version` y lo que pinta la franja |
| Perfil de Spring | El mismo valor del ambiente, para que no se mezclen configuraciones |
| Memoria de la JVM | La de la tabla anterior, como variable y no dentro de la imagen: así se ajusta sin recompilar |
| `DATABASE_URL` | La base de ese ambiente, siempre con el rol `prisma_api` |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET` | Uno por proyecto de Supabase. Son secretos |
| `SUPABASE_SERVICE_ROLE_KEY` | Uno por proyecto. La API lo lee para crear identidades contra GoTrue, y **nunca para hablar con PostgreSQL** ([ADR-033](adr/ADR-033-service-role-solo-en-auth.md)) |
| `ORIGENES_PERMITIDOS` | Solo el dominio del front de ese ambiente. Prod no le responde al front de qa |

> **La misma imagen en todos los ambientes; lo único distinto son las variables.** Si para que
> uat funcione hubo que compilar algo aparte, entonces lo que Gerencia firma en uat no es lo que
> va a correr en prod, y la firma de [§1.1](#11-la-segunda-firma-el-mismo-checklist-en-uat) deja de significar lo que dice.

---

## 4. Migración de datos históricos

Hay dos fuentes: **Excel/Sheets** y **cuaderno físico con fotos**.

### 4.1 Qué se migra y qué no

| Dato | ¿Se migra? | Por qué |
|---|:---:|---|
| Saldos actuales de cada cuenta | ✅ Obligatorio | Sin esto nada cuadra |
| Activos del negocio (equipos) | ✅ Obligatorio | Base del patrimonio |
| Aportes de capital históricos | ✅ Obligatorio | Base del patrimonio |
| Pedidos con anticipo cobrado y sin entregar | ✅ Obligatorio | Son pasivos vivos |
| Cuentas por cobrar vivas | ✅ Obligatorio | Plata que se espera |
| Movimientos de los últimos 6 meses | ✅ Muy recomendado | El simulador los necesita |
| Movimientos de más de 6 meses | ⚠️ Opcional | Solo si están en Excel y son confiables |
| Clientes | ✅ Recomendado | Ahorra digitación futura |
| Costos de productos | ✅ Obligatorio | Sin esto no hay márgenes |

> **Los 6 meses de historia no son opcionales si se quiere usar el simulador de capacidad de
> pago.** Sin ellos, la respuesta a "¿puedo contratar?" se basa en muy pocos datos y no es
> confiable.

### 4.2 Cómo se migra

**Se ensaya primero en qa.** La misma importación, con una copia del Excel real, contra la base de
qa. Sirve para dos cosas: descubrir los errores de mapeo sin tocar prod y saber cuánto se demora
de verdad la jornada. Solo cuando el ensayo sale limpio se repite en prod.

**Del Excel — importación asistida ([CU-21](02-casos-de-uso.md#cu-21))**

| Paso | Acción | Responsable |
|---|---|---|
| 1 | Exportar cada hoja a CSV | Gerencia |
| 2 | Cargar el archivo y mapear las columnas | Gerencia + apoyo técnico |
| 3 | Revisar la vista previa de las primeras 20 filas | Gerencia |
| 4 | Confirmar la importación | Gerencia |
| 5 | Revisar el reporte de errores por fila | Gerencia + apoyo técnico |
| 6 | Corregir y reimportar solo las filas fallidas | Gerencia |

> **Reimportar no duplica.** Cada fila viaja con su propia clave de idempotencia, así que volver a
> cargar el archivo completo por error deja los mismos datos, no el doble. Es justo el día en que
> esa garantía se necesita: el día en que nadie está seguro de qué alcanzó a entrar.

**Del cuaderno — jornada de digitación asistida**

Una sesión de trabajo de medio día, acompañada:

| Bloque | Duración | Contenido |
|---|---|---|
| 1 | 30 min | Saldos iniciales de todas las cuentas y activos del negocio |
| 2 | 60 min | Pedidos abiertos: los que tienen anticipo cobrado y no se han entregado |
| 3 | 90 min | Movimientos de los últimos 3 meses del cuaderno |
| 4 | 45 min | Costeo de los productos, uno por uno |
| 5 | 30 min | Verificación: ¿el saldo que calcula el sistema coincide con el real? |

**La verificación del bloque 5 es el momento de la verdad.** Si el saldo calculado no coincide
con el dinero que realmente hay, falta información. Se ajusta con un movimiento de
*"ajuste de saldo inicial"* documentado, no forzando números.

### 4.3 Regla de corte

Se define una **fecha de corte**, idealmente el primer día de un mes:

- Todo lo anterior entra como saldos iniciales y datos históricos.
- Todo lo posterior se registra únicamente en PRISMA.
- **El Excel y el cuaderno se archivan, no se siguen usando en paralelo.**

> Usar los dos sistemas al mismo tiempo es la forma más segura de terminar sin usar ninguno.

### 4.4 Alistamiento de usuarios

Va numerado de último pero **se hace de primero**: la migración necesita una sesión abierta, y
cada dato que entra queda firmado con el usuario que lo registró. Si se migra sin usuarios, la
auditoría arranca en blanco y no hay forma de reconstruirla después.

| Paso | Acción | Responsable |
|---|---|---|
| 1 | Crear el usuario de Gerencia. Es el primer usuario del sistema y el único que no se crea desde la pantalla de Gestión de usuarios, porque todavía no hay sesión | Apoyo técnico |
| 2 | Entrar con ese usuario y cambiar la clave temporal | Gerencia |
| 3 | Revisar el catálogo de cargos: quitar los que no aplican y agregar los que falten | Gerencia |
| 4 | Crear un usuario por cada persona del equipo con su nombre completo, su cargo y su tipo | Gerencia |
| 5 | Verificar que cada persona puede entrar con su propio usuario | Gerencia |

**El tipo dice qué puede ver. El cargo dice qué hace.** Solo Gerencia lleva tipo `gerencia`;
todo el resto del equipo va como `operacion`, sin importar el cargo que tenga.

> **Estos pasos se hacen en prod.** En uat hay usuarios de prueba con los mismos tipos y cargos,
> pero **con claves distintas y sin los nombres reales del equipo**: uat lleva datos anonimizados
> y una clave que sirve en dos ambientes es una clave que se filtró en el más flojo de los dos.

---

## 5. Capacitación

Tres sesiones cortas, separadas en el tiempo. Nadie aprende un sistema completo de una sentada.

### Sesión 1 · El día a día (90 min) — antes del go-live

| Tema | Qué se practica |
|---|---|
| Entrar con el propio usuario | La clave temporal se entrega **en persona**, en el taller, una por una |
| Cambiar la clave en el primer ingreso | El sistema obliga; cada quien escoge la suya y nadie más la ve |
| Registrar un ingreso y un gasto | Con el celular, con recibos reales |
| Adjuntar la foto del recibo | Cinco veces, hasta que sea automático |
| Registrar un pedido con su anticipo | Un pedido real del día |
| Marcar un pedido como entregado | Un pedido real |
| Anular un movimiento mal registrado | Con motivo escrito |

**Se termina con un ejercicio cronometrado:** registrar tres movimientos en menos de 90
segundos en total.

> **La contraseña no se comparte ni se presta.** Si dos personas entran con el mismo usuario, la
> auditoría deja de servir: el sistema va a decir quién hizo cada cosa y ese dato va a ser falso.
> Quien necesita entrar, necesita su propio usuario. Se pide a Gerencia y se crea en un minuto.

### Sesión 2 · Entender los números (60 min) — semana 2

| Tema | Qué se explica |
|---|---|
| Las tres cifras | Por qué utilidad, caja y caja libre no coinciden |
| El anticipo como deuda | Con un pedido real de la propia base de datos |
| Por qué el retiro no es gasto | Con los números del propio mes |
| El pro-labore | Definirlo juntos: *"¿cuánto le pagaría a alguien que haga lo que yo hago?"* |
| Las alertas | Qué significa cada una y qué hacer con ella |

### Sesión 3 · Decidir con datos (60 min) — mes 2

| Tema | Qué se explica |
|---|---|
| Margen en pesos | Qué producto conviene empujar, y por qué no es el del mejor porcentaje |
| Validador de anticipo | Por qué a veces hay que pedir más del 50% |
| Punto de equilibrio | Cuántos pedidos al mes se necesitan para no perder |
| El simulador | Cómo leerlo y por qué el pro-labore es obligatorio |
| Cierre mensual | Cómo cerrar un mes y por qué no cambia después |

### Material de apoyo

- Guía rápida de una página, impresa y pegada en el taller.
- Video de 3 minutos: cómo registrar un movimiento con el celular.
- Documento [`15-glosario.md`](15-glosario.md) para consultar términos.

---

## 6. Go-live

### 6.1 La promoción hasta prod

El go-live no empieza el día −1: empieza cuando la versión firmada termina de recorrer las
etapas. Ninguna se salta. Desde el [ADR-044](adr/ADR-044-dos-ambientes-desplegados.md), qa y uat son etapas de la tubería, no ambientes alojados, y desde el [ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md) la firma se hace en pre-prod.

| # | Paso | Quién | Qué tiene que pasar para seguir |
|---|---|---|---|
| 1 | La versión se promueve a la etapa qa, que construye el artefacto una vez y corre sus pruebas | Apoyo técnico | Las pruebas de extremo a extremo pasan en la etapa qa |
| 2 | Se promueve a `main`, la última etapa, que corre la batería entera sobre la semilla anonimizada ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)) | Apoyo técnico | La etapa `main` queda en verde |
| 3 | El artefacto se despliega en uat sin recompilar, y Gerencia recorre ahí el checklist de UAT ([§1.1](#11-la-segunda-firma-el-mismo-checklist-en-uat)) y firma la versión | Gerencia | La firma queda con número de versión y fecha |
| 4 | **El mismo artefacto** se entrega a prod, en el otro repositorio ([9.15](08-plan-de-desarrollo.md#tarea-9-15)), sin recompilar: la misma etiqueta de la imagen de la API y el mismo paquete web del front | Apoyo técnico | La versión en prod es idéntica a la firmada |
| 5 | Alistamiento de usuarios y migración de datos en prod ([§4](#4-migración-de-datos-históricos)) | Gerencia + apoyo técnico | Los saldos cuadran con el dinero real |

> **Recompilar para prod sería aprobar una cosa y publicar otra.** Si hace falta un cambio
> después de la firma, se vuelve a empezar en el paso 1 con una versión nueva. No hay atajo, y
> por eso el número de versión aparece en la línea de la firma.

### 6.2 Antes (día −1)

| # | Verificación | ✓ |
|---|---|:---:|
| 1 | Saldos del sistema coinciden con el dinero real en cada cuenta | ⬜ |
| 2 | Todos los productos tienen costo unitario definido | ⬜ |
| 3 | El pro-labore está definido | ⬜ |
| 4 | Los porcentajes de los 4 sobres están configurados | ⬜ |
| 5 | Los pedidos abiertos con anticipo están registrados | ⬜ |
| 6 | La aplicación está instalada en el celular | ⬜ |
| 7 | Se hizo una exportación de respaldo inicial | ⬜ |
| 8 | La sesión de tipo Operación se probó y oculta lo que debe ocultar | ⬜ |
| 9 | La confirmación de correo está **desactivada** en el proveedor de autenticación | ⬜ |
| 10 | Existe al menos un usuario de Gerencia activo y con la clave temporal ya cambiada | ⬜ |
| 11 | Cada persona del equipo entró al menos una vez con su propio usuario | ⬜ |
| 12 | La versión en prod es **exactamente** la firmada en UAT, con el mismo número | ⬜ |
| 13 | El plan de pago de prod está activo y la base no se pausa por inactividad | ⬜ |
| 14 | `POST /api/v0/consultas/version` en prod responde la versión del front, la de la API, la del esquema y el ambiente | ⬜ |
| 15 | En prod **no hay franja de ambiente** y la versión se ve en el pie de la barra lateral, en color neutro | ⬜ |
| 16 | El rol `prisma_api` de prod no tiene `BYPASSRLS` ni es dueño de las tablas | ⬜ |
| 17 | La prueba de permisos con sesión real se ejecutó **contra prod** y la base fue la que negó | ⬜ |
| 18 | La reversión está ensayada y se sabe a qué versión anterior se vuelve ([§7](#7-qué-se-hace-si-una-versión-rompe-prod)) | ⬜ |
| 19 | La memoria de la JVM de prod está fijada por variable y **medida en qa**, no copiada de un ejemplo | ⬜ |
| 20 | El alojamiento de la API de prod **no escala a cero** y no se pausa por inactividad | ⬜ |
| 21 | Swagger está **detrás de autenticación en prod**; en dev, qa y uat queda abierto en `/docs` | ⬜ El mecanismo existe desde la [9.11](08-plan-de-desarrollo.md#tarea-9-11) —autenticación básica, y apagado si no le configuraron la credencial—, así que lo que queda no es código: es poner `DOCS_USUARIO` y `DOCS_CLAVE` en el gestor de secretos de prod |
| 22 | Una escritura repetida con la misma clave de idempotencia **no duplica**, probado contra prod antes de abrir | ⬜ |
| 23 | El `openapi.json` publicado corresponde a la versión que está corriendo, y la integración continua lo comprobó | ⬜ |

### 6.3 El día del go-live

- Se registra todo el día **solo en PRISMA**.
- Al cerrar, se compara el efectivo en caja con el saldo del sistema.
- Si no coincide, se identifica qué faltó registrar. No se ajusta a ciegas.

### 6.4 Primera semana

| Día | Acompañamiento |
|---|---|
| 1 | Revisión al final del día, en persona o por llamada |
| 2 y 3 | Revisión al final del día, por mensaje |
| 4 y 5 | Revisión solo si hay dudas |
| 7 | Primera revisión semanal completa |

---

## 7. Qué se hace si una versión rompe prod

Va escrito antes del go-live, no después del primer susto. El procedimiento paso a paso —comandos,
artefactos y quién tiene acceso a qué— vive en
[`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md) y no se repite aquí; esta sección fija
**cuándo se revierte y quién decide**.

> **Primero se revierte, después se investiga.** Mientras el taller no pueda registrar, el
> diagnóstico puede esperar. Buscar la causa con el negocio detenido es la forma más rápida de
> perder un día de operación y la confianza en el sistema.

| Situación | Qué se hace |
|---|---|
| La API nueva falla y el front queda inservible | Se vuelve a la versión anterior de la API: **se despliega la etiqueta anterior de la imagen, que sigue publicada.** No se reconstruye nada |
| El front nuevo falla y la API responde bien | Se republica el front anterior, que sigue siendo compatible con el mismo MAJOR de la API |
| El front bloquea con «Esta versión ya no sirve con el servidor» | Las dos versiones quedaron descuadradas: se vuelve la que se haya movido de último ([ADR-014](adr/ADR-014-semver.md)) |
| Una migración dejó el esquema mal | **El esquema no se devuelve.** Se escribe otra migración que corrige y se promueve por los cuatro ambientes ([ADR-004](adr/ADR-004-base-solo-escritura.md), [ADR-013](adr/ADR-013-cuatro-ambientes.md)) |
| Se dañaron o se perdieron datos | Restauración desde el respaldo más reciente y comparación con la última exportación ([CU-22](02-casos-de-uso.md#cu-22)) |

| Quién | Qué decide |
|---|---|
| Gerencia | Avisa que el taller no puede trabajar. No tiene que diagnosticar nada |
| Apoyo técnico | Revierte sin pedir autorización cuando el registro diario está detenido, e informa después |

Mientras dura la reversión, el taller **registra en papel con la fecha real y digita después**:
la doble fecha del sistema lo respeta y el registro tardío queda marcado como lo que es.

---

## 8. Soporte de 90 días

| Período | Qué incluye | Frecuencia |
|---|---|---|
| Días 1–7 | Acompañamiento diario, corrección inmediata de errores | Diaria |
| Días 8–30 | Revisión semanal: ¿se está registrando? ¿los números cuadran? | Semanal |
| Días 31–60 | Revisión quincenal + primer cierre mensual acompañado | Quincenal |
| Días 61–90 | Revisión mensual + segundo cierre + ajustes finales | Mensual |

### 8.1 Los tres momentos críticos

| Momento | Riesgo | Qué se hace |
|---|---|---|
| **Día 10** | El entusiasmo inicial baja y se empieza a dejar de registrar | Revisar el índice de puntualidad; si cae del 80%, sesión de refuerzo |
| **Primer cierre mensual** | Los números no cuadran y se pierde la confianza | Cierre acompañado, revisando cada diferencia hasta explicarla |
| **Día 60** | Aparece la tentación de volver al cuaderno "para lo rápido" | Revisar qué se sintió lento y corregirlo |

### 8.2 Manejo de usuarios en la operación diaria

Dos cosas van a pasar seguro: alguien va a olvidar su contraseña y alguien se va a retirar.
Conviene tener resuelto de antemano cómo se atienden.

**Restablecer una contraseña — solo Gerencia, en persona**

| Paso | Acción |
|---|---|
| 1 | La persona le avisa a Gerencia. **No hay "olvidé mi contraseña" por correo**, porque detrás del usuario no hay un correo real |
| 2 | Gerencia abre la pantalla de Gestión de usuarios y pulsa **Restablecer clave** |
| 3 | Gerencia entrega la clave temporal en persona. Nunca por WhatsApp, nunca por un tercero |
| 4 | La persona entra y el sistema la obliga a cambiarla de inmediato |

**Desactivar a quien se retira**

| Paso | Acción |
|---|---|
| 1 | Gerencia abre la pantalla de Gestión de usuarios y pulsa **Desactivar** el mismo día del retiro |
| 2 | Escribe el motivo. Es obligatorio: *"Retiro voluntario, 30 de junio de 2026"* sirve; *"ya no"* no sirve |
| 3 | El usuario queda inactivo. **No se borra:** todo lo que registró sigue en su sitio y con su nombre |

> **El sistema no deja desactivar ni degradar al último usuario activo de Gerencia.** Si Gerencia
> cambia de manos, primero se crea el usuario nuevo y después se desactiva el viejo. En ese orden.

---

## 9. Indicadores de adopción

Se miden durante los 90 días. Son los que dicen si la implantación funcionó.

| Indicador | Meta | Cómo se mide |
|---|---|---|
| Días con al menos un registro | ≥ 90% | Movimientos por día |
| Índice de puntualidad | ≥ 80% | Registros dentro de 48 h |
| Pedidos registrados vs. reales | 100% | Comparación con el cuaderno de la primera semana |
| Productos con costo definido | 100% | Catálogo |
| Cierres mensuales completados | 3 de 3 | Cierres |
| Uso del Excel o del cuaderno | 0 | Pregunta directa en cada revisión |
| Tiempo dedicado a administración | ≤ 1 h/semana | Estimación en la revisión |

---

## 10. Criterio de éxito de la implantación

A los 90 días, la implantación se considera exitosa si:

1. El registro diario es un hábito y no requiere recordatorios.
2. Los dos cierres mensuales se hicieron sin ayuda técnica.
3. Las tres preguntas originales se responden en menos de un minuto cada una, con el sistema
   abierto.
4. El Excel y el cuaderno están archivados y no se usan.
5. Hay al menos una decisión del negocio —un precio, un pedido, una compra— que se tomó mirando
   un número de PRISMA.

**El punto 5 es el más importante.** Un sistema que se alimenta pero no se consulta es trabajo
sin retorno.

---

## 11. Plan de contingencia

| Situación | Respuesta |
|---|---|
| El registro se abandona en la semana 2 | Sesión de diagnóstico: identificar qué se siente lento y simplificarlo |
| Los saldos no cuadran y no se sabe por qué | Revisar la bitácora de auditoría movimiento por movimiento |
| Se descubre un error en una fórmula | Corregir, agregar prueba automática, recalcular períodos afectados |
| El sistema no está disponible | Si la aplicación abre, lo registrado queda en la cola local y se envía solo cuando vuelve la señal, una sola vez. Si no abre, se registra en papel con la fecha real y se digita después; la doble fecha lo respeta |
| Se pierde el acceso a la cuenta | Gerencia restablece la clave en persona ([§8.2](#82-manejo-de-usuarios-en-la-operación-diaria)). No hay recuperación por correo |
| Se necesita volver a los datos anteriores | Exportación de respaldo ([CU-22](02-casos-de-uso.md#cu-22)) |
| Una versión nueva rompe prod | Se revierte primero y se investiga después ([§7](#7-qué-se-hace-si-una-versión-rompe-prod)) |

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [00](00-resumen-ejecutivo.md "00 · Resumen ejecutivo") · [02](02-casos-de-uso.md "02 · Casos de uso") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [Contrato](../contrato/README.md "Contrato de la API · v0.36.0") · [ADR-013](adr/ADR-013-cuatro-ambientes.md "ADR-013 · Cuatro ambientes y promoción de migraciones") · [ADR-026](adr/ADR-026-railway-al-final.md "ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [08 · Plan de desarrollo](08-plan-de-desarrollo.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [10 · UX y mockups](10-ux-y-mockups.md)
