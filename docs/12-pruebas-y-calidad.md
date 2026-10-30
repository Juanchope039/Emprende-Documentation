# 12 · Pruebas y calidad

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [5.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/12-pruebas-y-calidad.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-30 | [Calidad](INDICE.md#etiqueta-calidad) |

---

## 1. Estrategia

Ahora hay **dos bases de código** —`prisma_front` en Flutter y `prisma_api` en Java 25 con Spring
Boot— y **cuatro ambientes** —dev, qa, uat y prod—. La estrategia cambia de forma, no de fondo: la
arquitectura hexagonal sigue permitiendo invertir el esfuerzo donde más importa, **los cálculos de
plata y los permisos**.

```
        ╱╲          Manuales en dispositivo real
       ╱  ╲         10 recorridos · antes de cada entrega
      ╱────╲
     ╱      ╲       Integración de prisma_api contra un PostgreSQL real
    ╱        ╲      Acceso, permisos, transacciones, contrato de errores
   ╱──────────╲
  ╱            ╲    Unidad en JUnit 5 · widget en Flutter
 ╱              ╲   Milisegundos, sin red y sin base de datos
╱────────────────╲
```

| Nivel | Dónde vive | Qué prueba | Herramienta | Meta |
|---|---|---|---|---|
| Unitario de dominio | `prisma_api` | Servicios de dominio: fórmulas financieras | **JUnit 5** | **≥ 90% de cobertura** |
| Unitario de presentación | `prisma_front` | Formato de cifras y fechas, estado, y que el formulario aplique el descriptor que la API le dictó | `flutter test` | Cada regla del descriptor |
| Widget | `prisma_front` | Que cada pantalla pinte lo que debe y reaccione a lo que recibe | `flutter test` | Las 12 pantallas |
| Integración | `prisma_api` + base | Repositorios, transacciones, políticas RLS, contrato de errores | **JUnit 5 con contenedores de prueba** (`Testcontainers`): un PostgreSQL real y desechable | Casos críticos |
| Manual | Las dos | Recorridos completos en celular real | Lista de verificación | Antes de cada entrega |

> **Las pruebas de integración levantan su propio PostgreSQL, no se cuelgan de la base de un
> ambiente.** El contenedor nace con las migraciones aplicadas y la semilla de `supabase/seed.sql`,
> muere al terminar y no le deja basura a nadie. Una suite que depende de la base compartida de dev
> falla por lo que otra persona guardó hace diez minutos, y una prueba que falla por motivos ajenos
> se termina ignorando.

Un remedo con objetos falsos no sirve aquí: lo que se está probando son **restricciones, triggers y
políticas RLS**, y eso solo lo sabe PostgreSQL de verdad. Contra la base del ambiente corre otra
cosa distinta, la de la promoción ([`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md) [§6.2](19-ambientes-y-entrega.md#62-en-cada-promoción)):
comprobar que las migraciones aplican sobre lo que ese ambiente ya tiene escrito.

**Las pruebas de widget no levantan la API.** Hablan con un cliente HTTP falso. Si para probar una
pantalla hubiera que levantar `prisma_api` y su base, la pantalla quedó pegada al transporte: eso
es un defecto que se corrige, no una condición de la prueba. Lo que sí se prueba de verdad entre
el front y la API es el contrato de versiones, y eso está en la sección 9.

### 1.1 Dónde corre cada nivel

| Ambiente | Qué se ejecuta ahí | Con qué datos |
|---|---|---|
| **dev** | Unidad y widget en cada guardado; integración sobre su propio contenedor de PostgreSQL | Ficticios, se pueden borrar |
| **qa** | Todo, en cada integración a `develop`. **Es la que bloquea la promoción** | Ficticios, con semilla reproducible |
| **uat** | [P-01](#p-01) a [P-39](#p-39) —[P-32](#p-32) sin su paso 3, ver 3.1— y los recorridos manuales, antes de la aprobación de Gerencia. Además, [RE-01](#re-01) una vez por trimestre ([§10.4](#104-re-01--un-respaldo-que-nunca-se-restauró-no-es-un-respaldo)) | Realistas y anonimizados |
| **pre-prod** | Pruebas de humo después de desplegar, y los recorridos manuales de la aprobación de Gerencia ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)) | Realistas y anonimizados |
| **prod** | Pruebas de humo de solo lectura, después de publicar. Vive en otro repositorio | Reales |

> **Ninguna prueba automática escribe en prod.** Las de integración siembran filas y las borran;
> en la base del negocio eso no es una prueba, es un daño. Contra prod solo corren lecturas después
> de publicar: que `POST /api/v0/consultas/version` devuelva la versión que se acaba de promover y que el Inicio
> cargue. Nada más.

Que qa sea la que bloquea la promoción es a propósito: es el único ambiente donde la suite completa
corre contra una base con semilla reproducible. En dev los datos cambian a cada rato y una prueba
que falla ahí no siempre significa que el código esté mal.

### 1.2 Cuántas pruebas hay enumeradas

| Grupo | Identificadores | Cuántas |
|---|---|---:|
| Reglas de negocio ([§2](#2-lo-que-se-prueba-obligatoriamente)) | [RN-02](03-requisitos-y-bdd.md#rn-02) a [RN-19](03-requisitos-y-bdd.md#rn-19) | 18 |
| Permisos ([§3](#3-pruebas-de-permisos)) | [P-01](#p-01) a [P-39](#p-39) | 39 |
| Invariantes financieros ([§4.2](#42-invariantes-que-deben-cumplirse-siempre)) | Las cinco igualdades | 5 |
| Casos límite ([§5](#5-casos-límite-que-deben-probarse)) | Sin identificador | 10 |
| Recorridos manuales ([§6](#6-recorridos-manuales)) | [M-01](#m-01) a [M-10](#m-10) | 10 |
| Acceso y administración de usuarios ([§7](#7-pruebas-de-acceso-y-administración-de-usuarios)) | [A-01](#a-01) a [A-16](#a-16) | 16 |
| Vista previa de Operación ([§7.1](#71-la-vista-previa-de-operación)) | [A-17](#a-17) a [A-19](#a-19) | 3 |
| Contrato entre las tres partes ([§9](#9-pruebas-del-contrato-entre-las-tres-partes)) | [C-01](#c-01) a [C-05](#c-05) | 5 |
| Idempotencia, canal firmado y durabilidad ([§10](#10-idempotencia-canal-firmado-y-durabilidad)) | [I-01](#i-01), [I-02](#i-02), [F-01](#f-01), [F-02](#f-02), [T-01](#t-01), [T-02](#t-02), [RE-01](#re-01) | 7 |
| Flujos críticos de extremo a extremo ([§11](#11-flujos-críticos-de-extremo-a-extremo)) | [E-01](#e-01) a [E-07](#e-07) | 7 |
| **Total** | | **120** |

Son **109 automáticas, 10 manuales y 1 de operación trimestral** —[RE-01](#re-01), la restauración del
respaldo—. No son todas las que habrá: las unitarias del dominio serán muchas más y se miden por
cobertura, no por lista. Estas 120 están escritas aquí una por una porque ninguna puede quedar al
criterio de quien programe ese día.

---

## 2. Lo que se prueba obligatoriamente

Cada una de estas reglas tiene al menos una prueba automática. **Si una falla, el cambio no
llega a producción.**

| Regla | Prueba |
|---|---|
| [RN-02](03-requisitos-y-bdd.md#rn-02) · Dinero entero | `Dinero.de(1500.5)` lanza error |
| [RN-03](03-requisitos-y-bdd.md#rn-03) · Transferencia neutra | Una transferencia no altera la utilidad |
| [RN-04](03-requisitos-y-bdd.md#rn-04) · Inversión no es gasto | Comprar un activo no reduce la utilidad |
| [RN-05](03-requisitos-y-bdd.md#rn-05) · Anticipo es pasivo | Un anticipo cobrado no aparece en la utilidad |
| [RN-06](03-requisitos-y-bdd.md#rn-06) · Venta al entregar | La venta se causa en la fecha de entrega, completa |
| [RN-07](03-requisitos-y-bdd.md#rn-07) · Retiro no es gasto | Un retiro de distribución no reduce la utilidad |
| [RN-08](03-requisitos-y-bdd.md#rn-08) · Pro-labore es gasto | Definir pro-labore reduce la utilidad |
| [RN-09](03-requisitos-y-bdd.md#rn-09) · Simulador con pro-labore | El simulador parte de la utilidad ajustada |
| [RN-10](03-requisitos-y-bdd.md#rn-10) · Salario es gasto | El salario reduce la utilidad |
| [RN-11](03-requisitos-y-bdd.md#rn-11) · Adelanto una sola vez | Adelanto + liquidación no duplican el gasto |
| [RN-12](03-requisitos-y-bdd.md#rn-12) · Caja libre | Saldo − anticipos − gastos fijos comprometidos |
| [RN-13](03-requisitos-y-bdd.md#rn-13) · No se borra | Anular no elimina la fila |
| [RN-14](03-requisitos-y-bdd.md#rn-14) · Registro tardío | 8 días de diferencia marca el registro |
| [RN-15](03-requisitos-y-bdd.md#rn-15) · Anticipo mínimo | 35% de margen sugiere anticipo del 70% |
| [RN-16](03-requisitos-y-bdd.md#rn-16) · Mes cerrado | Un movimiento con fecha anterior no altera el cierre |
| [RN-17](03-requisitos-y-bdd.md#rn-17) · Sin doble conteo | El margen de contribución del simulador excluye el tiempo |
| [RN-18](03-requisitos-y-bdd.md#rn-18) · Un usuario no se borra | Desactivar no elimina la fila; la ficha conserva su historia |
| [RN-19](03-requisitos-y-bdd.md#rn-19) · Siempre queda una Gerencia | Desactivar al último usuario activo de tipo Gerencia falla |

---

## 3. Pruebas de permisos

Las más importantes desde el punto de vista de confianza. Todas se ejecutan con una **sesión
real de tipo Operación**, no simulada, abierta **a través de `prisma_api`** con usuario y
contraseña. La API propaga esa identidad a la sesión de PostgreSQL, así que quien decide sigue
siendo RLS.

| # | Prueba | Resultado esperado |
|---|---|---|
| <a id="p-01"></a>P-01 | Leer `aportes_retiros` | Conjunto vacío o error de la base de datos |
| <a id="p-02"></a>P-02 | Leer `costos_producto` | Rechazado |
| <a id="p-03"></a>P-03 | Leer `nomina_detalle` de otra persona | Conjunto vacío |
| <a id="p-04"></a>P-04 | Leer el propio `nomina_detalle` | Permitido |
| <a id="p-05"></a>P-05 | Anular un movimiento | Rechazado por la base de datos |
| <a id="p-06"></a>P-06 | Leer `auditoria` | Rechazado |
| <a id="p-07"></a>P-07 | Insertar en `sobres_config` | Rechazado |
| <a id="p-08"></a>P-08 | Registrar un movimiento | Permitido |
| <a id="p-09"></a>P-09 | Registrar un pedido y su anticipo | Permitido |
| <a id="p-10"></a>P-10 | Leer la ficha de otra persona en `usuarios` | Conjunto vacío |
| <a id="p-11"></a>P-11 | Leer la propia ficha en `usuarios` | Permitido |
| <a id="p-12"></a>P-12 | Crear un usuario | Rechazado |
| <a id="p-13"></a>P-13 | Cambiarse el `tipo` a `gerencia` | Rechazado |
| <a id="p-14"></a>P-14 | Leer el catálogo `cargos` | Permitido |
| <a id="p-15"></a>P-15 | Crear o desactivar un cargo | Rechazado |
| <a id="p-16"></a>P-16 | Leer `clientes` | Permitido: sin cliente no hay pedido |
| <a id="p-17"></a>P-17 | Crear un cliente | Permitido |
| <a id="p-18"></a>P-18 | Corregir el teléfono de un cliente | Rechazado |
| <a id="p-19"></a>P-19 | Anular un cliente | Rechazado |
| <a id="p-20"></a>P-20 | Leer `activos` | Conjunto vacío |
| <a id="p-21"></a>P-21 | Leer `prolabore_config` | Conjunto vacío |
| <a id="p-22"></a>P-22 | Leer `sobres_config` | Conjunto vacío |
| <a id="p-23"></a>P-23 | Leer `cierres_mensuales` | Conjunto vacío |
| <a id="p-24"></a>P-24 | Leer la propia ficha en `empleados` | Permitido |
| <a id="p-25"></a>P-25 | Leer la ficha de otra persona en `empleados` | Conjunto vacío |
| <a id="p-26"></a>P-26 | Cambiarse el `salario_acordado` en `empleados` | Rechazado |
| <a id="p-27"></a>P-27 | Leer el `nomina_periodos` del propio desprendible | Permitido |
| <a id="p-28"></a>P-28 | Leer un `nomina_periodos` sin desprendible propio | Conjunto vacío |
| <a id="p-29"></a>P-29 | Leer los propios `adelantos` y los de otra persona | Solo los propios; los ajenos, conjunto vacío |
| <a id="p-30"></a>P-30 | Registrarse un adelanto | Rechazado |
| <a id="p-31"></a>P-31 | Cargar el desprendible propio completo en una sola consulta | Permitido: llegan las cuatro tablas |
| [P-32](#p-32) | Leer nómina, usuarios y patrimonio **con la guarda de la capa de aplicación desactivada** | El mismo resultado que con la guarda puesta: vacío o 403. Ver 3.1 |
| <a id="p-33"></a>P-33 | Leer las claves de `peticiones_idempotentes` de otra persona | Conjunto vacío |
| <a id="p-34"></a>P-34 | Escribir una clave de idempotencia con el `usuario_id` de otra persona | Rechazado |
| <a id="p-35"></a>P-35 | Leer los `nonces_vistos` de otra persona | Conjunto vacío |
| <a id="p-36"></a>P-36 | Reenviar una petición con un nonce ya usado | Rechazado con `40103`, **por la llave primaria**, no por una consulta previa |
| <a id="p-37"></a>P-37 | Borrar una fila de `peticiones_idempotentes` o de `nonces_vistos` con el rol de la aplicación | Rechazado: el `REVOKE DELETE` del doc [04](04-modelo-de-datos.md) [§5.1](04-modelo-de-datos.md#51-revocación-real-del-borrado) también las cubre |
| <a id="p-38"></a>P-38 | Ejecutar la purga y comprobar qué borró | Solo filas con `expira_en` vencido. Ninguna fila vigente, y ninguna fila de ninguna otra tabla |
| <a id="p-39"></a>P-39 | Detener la tarea programada y esperar más de la ventana de retención | La consulta de vigilancia del doc [16](16-base-de-datos-y-snapshots.md) [§10.2](16-base-de-datos-y-snapshots.md#102-cómo-se-vigila-que-siguen-corriendo) devuelve filas, que es la señal de que algo dejó de correr |

> **Criterio clave:** el rechazo debe venir de PostgreSQL, no de un `if` de Java ni de una pantalla
> que no dibuja el botón. La prueba se hace llamando a la API con un token real, sin pasar por las
> pantallas. Y quien demuestra que el juez fue la base y no la API es [P-32](#p-32).

Esto vale doble para las pantallas de acceso y de Gestión de usuarios. Que la interfaz esconda
la entrada de Gestión de usuarios no prueba nada: prueba que el menú está escondido. La prueba
válida abre una sesión real de tipo Operación con su usuario y su contraseña, y le pide los datos
a la API, nunca a la pantalla. [P-10](#p-10) a [P-15](#p-15) ejercen las políticas `usuarios_lectura`, `usuarios_insercion`
y `usuarios_actualizacion` sobre `usuarios`, y `cargos_lectura` y `cargos_escritura` sobre
`cargos`. Es exactamente lo que decidió [`ADR-006`](adr/ADR-006-rls-por-rol.md):
**los permisos viven en la base, no en la pantalla.**

**[P-33](#p-33) a [P-39](#p-39) cubren las dos tablas de transporte** —`peticiones_idempotentes` y
`nonces_vistos`— y su purga. Van aparte porque se rompen distinto: las demás fallan dejando
ver lo que no debía verse; estas fallan dejando **crecer sin freno** una tabla que nadie mira.
[P-38](#p-38) y [P-39](#p-39) no prueban permisos: prueban que el mantenimiento automático hace lo que dice y
que se nota cuando deja de hacerlo.

**[P-16](#p-16) a [P-31](#p-31) ejercen las ocho tablas sensibles del [§7](#7-pruebas-de-acceso-y-administración-de-usuarios) de
[`04-modelo-de-datos.md`](04-modelo-de-datos.md):** `clientes`, `activos`, `prolabore_config`,
`empleados`, `nomina_periodos`, `adelantos`, `sobres_config` y `cierres_mensuales`. Hay que
leerlas con tres cosas en mente:

- **«Conjunto vacío» y «Rechazado» no son lo mismo, y confundirlos hace pasar una prueba que
  debería fallar.** Leer una tabla que RLS filtra devuelve **cero filas sin error**: la consulta
  es un éxito y el resultado está vacío. Escribir donde la política no deja devuelve un **error**
  de PostgreSQL. Una prueba que solo verifique «no explotó» da verde en [P-20](#p-20) aunque la política
  no exista, porque una tabla sin RLS tampoco explota: devuelve todo. Hay que afirmar sobre el
  **número de filas**, y para eso la base de pruebas debe tener datos sembrados en cada una de
  las ocho tablas. Una tabla vacía da conjunto vacío por razones equivocadas.
- **[P-16](#p-16) a [P-19](#p-19) son las de `clientes` y van en sentidos distintos a propósito.** Operación lee y
  crea —[CU-05](02-casos-de-uso.md#cu-05) dice «cliente existente o nuevo»—, pero no corrige ni anula. Si [P-16](#p-16) o [P-17](#p-17) salen
  rechazadas, el registro de pedidos quedó roto; si [P-18](#p-18) o [P-19](#p-19) salen permitidas, cualquiera
  puede anonimizar a un cliente de paso.
- **[P-31](#p-31) es la prueba de regresión de todo el conjunto.** Carga el desprendible propio como lo
  arma la aplicación —`nomina_detalle` con su `nomina_periodos`, su fila de `empleados` y sus
  `adelantos`, en una sola consulta— y verifica que llegue completo. Es la que atrapa el error
  silencioso de encender RLS en `empleados` con una política demasiado estrecha: `nom_lectura`
  mira `empleados` en una subconsulta, y si esa subconsulta deja de ver la fila propia el
  desprendible **se vacía sin dar ningún error**. [P-24](#p-24) sola no lo detecta: la ficha se lee bien
  y el desprendible igual sale en blanco.

### <a id="p-32"></a>3.1 P-32 · La prueba que distingue «protegido» de «parece protegido»

Es la prueba que hay que escribir primero y la única que no puede faltar: es la que verifica
[`ADR-012`](adr/ADR-012-identidad-a-postgres.md) y la que hace exigible el **[RNF-22](03-requisitos-y-bdd.md#rnf-22)**. Se escribe en
Java, con JUnit 5, igual que el resto de la integración de `prisma_api`. Con
`prisma_api` en medio, la base ya no ve a la empleada: ve a la API. Si la API se conectara con la
clave de servicio, RLS dejaría de aplicar,
todas las políticas de [`ADR-006`](adr/ADR-006-rls-por-rol.md) se volverían decorado **y ninguna
prueba existente se pondría roja**: [P-01](#p-01) a [P-31](#p-31) seguirían en verde porque el `if` de Java las
estaría sosteniendo. Eso es lo que [P-32](#p-32) rompe.

| Paso | Qué se hace |
|---|---|
| 1 | Abrir sesión **a través de la API** como una usuaria de tipo Operación, con su usuario y su contraseña del ambiente de pruebas |
| 2 | Pedir `POST /api/v0/consultas/nomina`, `/consultas/usuarios` y `/consultas/patrimonio`. Deben devolver conjunto vacío o 403 |
| 3 | **Desactivar la comprobación de la capa de aplicación** con la bandera de configuración que solo se acepta en dev y en qa, y repetir las tres peticiones |
| 4 | Comparar. El resultado debe ser **exactamente el mismo** |

> **Si al quitar el `if` los datos aparecen, RLS no está actuando y la prueba falla.** Ese es el
> punto entero: sin el paso 3 no se prueba la base, se prueba el `if`. Y un `if` lo borra
> cualquiera en una limpieza de código un martes por la tarde.

Lo que [P-32](#p-32) atrapa, y que ninguna otra prueba ve:

| Fallo real | ¿Lo atrapa [P-32](#p-32)? |
|---|---|
| La API se conecta **a PostgreSQL** con la clave `service_role` | **Sí.** Con esa clave RLS no aplica y los datos aparecen |
| El rol de base de datos de la API tiene `BYPASSRLS` | **Sí.** Mismo síntoma |
| El rol de la API es dueño de las tablas y falta `FORCE ROW LEVEL SECURITY` | **Sí.** El dueño se salta RLS por defecto |
| La API olvida propagar los claims a la sesión de PostgreSQL | No hace falta: sin identidad no se lee nada y [P-04](#p-04), [P-11](#p-11) y [P-24](#p-24) ya fallan por venir vacías |

Esa última fila es lo que hace que el conjunto funcione. [P-32](#p-32) vigila el lado permisivo —que la API
no sea más poderosa de la cuenta— y las pruebas de «Permitido» vigilan el restrictivo —que la
identidad sí esté llegando—. Ninguna de las dos sirve sola.

**Dónde corre.** Completa, en dev y en qa. En uat se ejecutan solo los pasos 1 y 2: la bandera no
existe allá, y un ambiente donde se puede apagar la guarda de la aplicación no sirve para aprobar
nada. En prod no corre.

---

## 4. Juego de datos de prueba oficial

El ejemplo de septiembre de [`05-reglas-financieras.md`](05-reglas-financieras.md) [§12](05-reglas-financieras.md#12-ejemplo-integral--septiembre-completo) es el
juego de datos autoritativo. Se convierte en una prueba ejecutable.

### 4.1 Valores esperados

| Concepto | Valor esperado |
|---|---:|
| Ingresos causados | $7.850.000 |
| Costo directo | $3.612.000 |
| Margen bruto | $4.238.000 |
| Margen bruto % | 54,0% |
| Gastos operativos (incluye pro-labore) | $2.980.000 |
| **Utilidad causada** | **$1.258.000** |
| Margen neto % | 16,0% |
| Saldo inicial | $3.900.000 |
| **Flujo de caja del mes** | **−$1.255.000** |
| Saldo final | $2.645.000 |
| Anticipos por devengar | $2.100.000 |
| **Caja libre** | **$545.000** |
| Punto de equilibrio | $4.769.231 |
| Horas pagadas | 160 |
| Horas facturadas | 104 |
| Tiempo ocioso | 56 h · $526.400 |

### 4.2 Invariantes que deben cumplirse siempre

```
Saldo final = Saldo inicial + Flujo de caja del mes
Caja libre  = Saldo total − Anticipos por devengar − Gastos fijos comprometidos
Σ Asignado a los 4 sobres = Entradas de caja del mes
Σ Diferencias de los 4 sobres = Flujo de caja del mes
Utilidad causada = Margen bruto − Gastos operativos
```

Estas cinco igualdades se prueban como **invariantes**: se generan cientos de escenarios
aleatorios y se verifica que se cumplan en todos. Si alguna falla con algún conjunto de datos,
hay un error en las fórmulas.

### 4.3 Datos del simulador

| Concepto | Valor esperado |
|---|---:|
| Utilidad promedio de 6 meses | $1.180.000 |
| Reserva del 20% | $236.000 |
| Presupuesto para personal | $944.000 |
| Veredicto con salario de $1.500.000 | No viable, faltan $556.000 |
| Camisetas adicionales necesarias | 38 |
| Mugs adicionales necesarios | 49 |

---

## 5. Casos límite que deben probarse

| Caso | Comportamiento esperado |
|---|---|
| Mes sin movimientos | Cifras en cero, sin errores |
| Pedido entregado el mismo día del anticipo | Venta causada y anticipo liberado en la misma fecha |
| Anticipo del 100% | Todo el valor como pasivo hasta entregar |
| Pedido cancelado tras el anticipo | Anticipo convertido en ingreso o devolución, con motivo |
| Movimiento el 31 de diciembre a las 23:59 | Se contabiliza en diciembre, no en enero |
| Dos adelantos en el mismo mes | Ambos descontados una sola vez cada uno |
| Retiro mayor que la caja libre | Advertencia y confirmación explícita |
| Producto con margen negativo | Se muestra en rojo, no se oculta |
| Costo de producto cambiado a mitad de mes | Los pedidos anteriores conservan el costo vigente entonces |
| Importación con 0 filas válidas | Mensaje claro, nada se carga |

---

## 6. Recorridos manuales

Antes de cada entrega, en **celular real**, no en el simulador del navegador.

| # | Recorrido | Criterio |
|---|---|---|
| <a id="m-01"></a>M-01 | Registrar un gasto con foto | Menos de 30 segundos |
| <a id="m-02"></a>M-02 | Registrar un pedido y cobrar el anticipo | El anticipo no aparece como ingreso |
| <a id="m-03"></a>M-03 | Entregar el pedido y cobrar el saldo | La venta se causa completa |
| <a id="m-04"></a>M-04 | Consultar el dashboard | Las tres cifras se entienden sin explicación |
| <a id="m-05"></a>M-05 | Anular un movimiento | Exige motivo, el original permanece |
| <a id="m-06"></a>M-06 | Generar una cotización | El PDF se abre y se puede compartir |
| <a id="m-07"></a>M-07 | Ejecutar el simulador | El veredicto es claro y accionable |
| <a id="m-08"></a>M-08 | Entrar con una usuaria de tipo Operación | No se ve nada restringido |
| <a id="m-09"></a>M-09 | Registrar sin conexión | Se encola y sincroniza con la fecha correcta |
| <a id="m-10"></a>M-10 | Instalar la aplicación en el celular | Se abre desde el escritorio del teléfono |

---

## 7. Pruebas de acceso y administración de usuarios

Cubren [CU-28](02-casos-de-uso.md#cu-28) a [CU-35](02-casos-de-uso.md#cu-35). Se ejecutan contra la base de datos, igual que las de la sección 3: lo
que importa no es qué muestra la pantalla, sino qué deja hacer el sistema.

| # | Prueba | Resultado esperado |
|---|---|---|
| <a id="a-01"></a>A-01 | Ingreso correcto de una usuaria de Gerencia | Sesión abierta; se cargan nombre completo, cargo y tipo; queda `inicio_sesion` en la auditoría |
| <a id="a-02"></a>A-02 | Ingreso correcto de una usuaria de Operación | Sesión abierta con tipo Operación; las pantallas de Gerencia no aparecen en el nav **ni responden si se piden directo** |
| <a id="a-03"></a>A-03 | Contraseña incorrecta | «Usuario o contraseña incorrectos»; queda `inicio_sesion_fallido` en la auditoría **sin la contraseña tecleada** |
| <a id="a-04"></a>A-04 | Usuario que no existe | El mismo mensaje de [A-03](#a-03), palabra por palabra. Si el mensaje difiere, revela qué usuarios existen |
| <a id="a-05"></a>A-05 | Usuario desactivado con la contraseña correcta | No entra. «Este usuario está desactivado. Habla con Gerencia.» |
| <a id="a-06"></a>A-06 | Primer ingreso con `debe_cambiar_clave = TRUE` | No llega al tablero: pantalla de cambio obligatorio. Al guardar, `debe_cambiar_clave` queda en falso |
| <a id="a-07"></a>A-07 | Crear un usuario con un nombre de usuario ya existente | Rechazado por el `UNIQUE` de `usuarios.usuario`, no solo por el aviso de la pantalla. `Marcela` y `marcela` son el mismo usuario. **En el camino real quien rechaza primero es el proveedor de identidad**, porque el correo sintético choca antes de que se llegue a insertar: se comprueba en los dos sitios, y en el proveedor por `error_code` y no por el estado, que también usa para la clave débil |
| <a id="a-08"></a>A-08 | Desactivar al último usuario activo de tipo Gerencia | Rechazado por el trigger `tg_proteger_ultima_gerencia`: «No se puede desactivar ni degradar al último usuario de Gerencia» |
| <a id="a-09"></a>A-09 | Desactivar un cargo que tiene personas activas asignadas | Rechazado con aviso claro; el cargo sigue activo y nadie se queda sin cargo |
| <a id="a-10"></a>A-10 | Desactivar un usuario dejando el motivo vacío | Rechazado por el `CHECK desactivacion_con_motivo`: el usuario sigue activo. Sin motivo no se desactiva, y el rechazo viene de la base, no solo del aviso de la pantalla |
| <a id="a-11"></a>A-11 | Desactivar un usuario con motivo escrito | `activo` en falso y `desactivado_en`, `desactivado_por` y `desactivado_motivo` escritos. La fila de la tabla queda atenuada y muestra **la fecha y la hora** de la desactivación con `fmtFechaHora`: `14 sep 2026, 3:42 p. m.` |
| <a id="a-12"></a>A-12 | Reactivar un usuario dejando el motivo vacío | Rechazado. Reactivar exige motivo igual que desactivar: devolverle el acceso a alguien también es un cambio que hay que justificar |
| <a id="a-13"></a>A-13 | Reactivar un usuario con motivo escrito | `activo` en verdadero, las tres columnas de desactivación limpias y `debe_cambiar_clave` en verdadero. En el siguiente ingreso el sistema **obliga** a cambiar la clave antes de llegar al tablero |
| <a id="a-14"></a>A-14 | Cualquier cambio sobre `usuarios` o `cargos` | Queda una entrada en `auditoria` con quién lo hizo, cuándo, sobre quién y por qué. La bitácora de la pantalla es una vista sobre esas filas, no una tabla aparte |
| <a id="a-15"></a>A-15 | Revertir un cambio desde la bitácora | Quedan **dos** entradas: la original marcada como `Revertida` y la `Reversión` que la deshace, enlazadas entre sí. La original conserva su texto: nunca se borra ni se edita. Se verifica contando las filas de `auditoria` antes y después |
| <a id="a-16"></a>A-16 | Revertir un `Tipo cambiado` que dejaría cero usuarios activos de tipo Gerencia | Rechazado con aviso claro. Ni el usuario ni la bitácora cambian; el trigger `tg_proteger_ultima_gerencia` es el último filtro |

> **[A-04](#a-04) es la prueba que más se olvida.** Un mensaje distinto para «usuario no existe» convierte
> la pantalla de acceso en una lista de quién trabaja aquí. Se compara el texto exacto, no que
> «salga un error».

### 7.1 La vista previa de Operación

[CU-36](02-casos-de-uso.md#cu-36) es la excepción de esta sección: se prueba **en la pantalla**, porque lo único que hace es
cambiar lo que el navegador pinta. Estas tres pruebas verifican que pinte lo correcto y que
Gerencia pueda salir; ninguna verifica un permiso.

| # | Prueba | Resultado esperado |
|---|---|---|
| <a id="a-17"></a>A-17 | Activar «Ver como Operación» desde una sesión de Gerencia | El menú lateral pierde Inversiones, Reportes y Nómina; los costos y márgenes de Productos no se pintan; **Gestión de usuarios desaparece del menú de la sesión**, porque también es exclusiva de Gerencia |
| <a id="a-18"></a>A-18 | El interruptor con la vista previa ya activa | **Sigue visible en el menú de la sesión.** Depende de `sesion.tipo`, no de `rol`: si dependiera de `rol` se ocultaría a sí mismo y Gerencia quedaría atrapada sin forma de volver |
| <a id="a-19"></a>A-19 | La franja de advertencia con la vista previa activa | Fija arriba del contenido, no se puede cerrar, dice `Estás viendo el sistema como lo ve Operación` y su botón `Volver a mi vista` devuelve todo con un clic |

> **La vista previa NO sustituye la prueba de permisos, y confundirla con una es el error grave
> de esta función.** Ninguna de las pruebas [A-17](#a-17) a [A-19](#a-19) demuestra que una persona de Operación no
> pueda llegar a los datos ocultos: solo demuestran que la pantalla no los dibuja. Eso lo prueban
> [P-01](#p-01) a [P-39](#p-39) de la sección 3, con una **sesión real de tipo Operación llamando a la API**, y muy
> especialmente [P-32](#p-32). Es exactamente lo que decidió [`ADR-006`](adr/ADR-006-rls-por-rol.md): **ocultar un
> menú no es seguridad.** Una pantalla revisada con la vista previa sigue teniendo sus permisos
> sin probar mientras no se ejecuten esas pruebas.

---

## 8. Calidad del código

| Control | En `prisma_front` (Flutter) | En `prisma_api` (Java) | Cuándo |
|---|---|---|---|
| Formato consistente | `dart format` | `Spotless` | Al guardar |
| Tipado estricto y avisos | `dart analyze` con `strict-casts` y `strict-raw-types` | Compilación con `-Xlint:all -Werror` | Cada compilación |
| Estilo y malas prácticas | Reglas de Flutter en `analysis_options.yaml` | Spotless para el formato y compilación con `-Xlint:all -Werror` | Cada compilación |
| Regla de frontera de arquitectura | Lint de importaciones: `dominio` no importa `infraestructura` ni `interfaz` | `ArchUnit`: `dominio` no conoce Spring, ni JDBC, ni HTTP | Cada compilación |
| Cobertura del dominio | `flutter test --coverage` | `JaCoCo`, **≥ 90%** | Cada cambio |

**Son dos lenguajes, y eso es parte de lo que cuesta tener la API en Java.** El argumento de «un
solo lenguaje en todo el proyecto» ya no aplica y no hay que fingir que sí. Lo que se sostiene es
el listón: formato automático, avisos tratados como errores, frontera de arquitectura verificada
por una prueba y cobertura medida. Cada ecosistema lo cumple con su herramienta; ninguna mitad se
revisa con una vara más floja que la otra.

**Regla de oro del proyecto:** si un cálculo financiero no tiene prueba, no está terminado.

---

## 9. Pruebas del contrato entre las tres partes

Dos capas deciden —la base y `prisma_api`— y una tercera solo pinta: el formulario, que aplica el
descriptor que la API le dictó. Eso solo es sostenible si algo vigila que las tres no se separen
con el tiempo. Y versionar el front y la API por separado solo es sostenible si algo detecta cuándo
dejaron de entenderse, y si los números que se comparan dicen la verdad. Estas cinco pruebas son
ese vigilante.

| # | Prueba | Resultado esperado |
|---|---|---|
| [C-01](#c-01) | Recorrer `pg_constraint` y cruzar cada restricción nombrada con la tabla de traducción de `prisma_api` | Todas tienen entrada. Si falta una, la prueba falla y dice cuál |
| [C-02](#c-02) | Arrancar el front declarando una MAJOR de API distinta a la que responde `POST /api/v0/consultas/version` | El front se planta en la primera pantalla y no deja seguir |
| [C-03](#c-03) | Cruzar los códigos de cinco dígitos que emite el código fuente contra el catálogo | Ninguno emitido falta en el catálogo y ninguno del catálogo sobra. Falla nombrando el código |
| [C-04](#c-04) | Regenerar el OpenAPI desde los controladores y compararlo con el `openapi.json` versionado | Idénticos, salvo las dos versiones que el documento declara de sí mismo ([ADR-042](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md)), que se afirman contra su fuente. Cualquier otra diferencia rompe la compilación |
| [C-05](#c-05) | Comparar cada PR contra `develop`: qué cambió y cómo quedó la versión del proyecto | Si cambió lo que se publica, la versión subió **un paso**. Si no, falla nombrando los archivos y los tres pasos posibles |

### <a id="c-01"></a>9.1 C-01 · Ninguna restricción sin mensaje

La base no sabe hablar: rechaza con `23514 check_violation` sobre
`dinero_positivo_mayor_que_cero`, y eso no se le muestra a la dueña del taller. La API traduce
**`(objeto, restricción)` → código de cinco dígitos + campo del formulario al que señala**, y el
mensaje en español sale de ese código. [C-01](#c-01) recorre `pg_constraint` del ambiente y comprueba
que cada restricción nombrada tenga su entrada en esa tabla. Es la prueba que sostiene la
traducción de restricciones —de [`ADR-015`](adr/ADR-015-validacion-tres-capas.md), recogida después
por [`ADR-018`](adr/ADR-018-front-sin-decisiones.md)— y la que verifica el **[RNF-25](03-requisitos-y-bdd.md#rnf-25)**.

Tres detalles deciden si la prueba sirve de algo:

- **Lee la base, no una lista escrita a mano.** Una lista se actualiza cuando alguien se acuerda;
  `pg_constraint` es lo que la base tiene hoy, le guste a quien le guste.
- **Falla nombrando la restricción huérfana.** «Faltan traducciones» no sirve: la prueba tiene que
  decir cuál, o el arreglo se vuelve una búsqueda a ciegas.
- **También falla al revés.** Una entrada en la tabla de traducción que ya no corresponde a ninguna
  restricción es un mensaje muerto, y peor: esconde que la regla desapareció de la base.

> **Renombrar una restricción falla las dos direcciones a la vez**, y por eso el
> [04 §4.1](04-modelo-de-datos.md#41-tipos-y-convenciones-comunes) dice que los nombres no se pueden mover: el nombre nuevo sale huérfano y el viejo,
> muerto. Es el único cambio que la prueba denuncia por duplicado, y el que más falta hacía.

**Corre con `./gradlew integracion`, no en cada empuje.** Necesita las restricciones *aplicadas* y
no el archivo `.sql` ([ADR-029](adr/ADR-029-esquema-por-etiqueta.md)), así que hoy queda fuera de la compilación de siempre; quien la
mete adentro es la tarea [1.7](08-plan-de-desarrollo.md#tarea-1-7), que descarga `prisma_db` por etiqueta y levanta Supabase. A cambio
es la más barata de las de integración: se conecta como el dueño y **solo lee** el catálogo de
PostgreSQL, sin RLS, sin identidad y sin semilla.

En ejecución, la contraparte es la regla de `prisma_api`: un error de la base que no esté en la
tabla se devuelve como 500 y se registra como defecto. [C-01](#c-01) existe para que eso nunca ocurra
por primera vez en prod.

### <a id="c-02"></a>9.2 C-02 · Un front viejo se planta, no se arrastra

El front y la API se versionan por separado ([`ADR-014`](adr/ADR-014-semver.md)), así que puede
haber un navegador con la aplicación de hace tres semanas pidiéndole cosas a una API que ya cambió
el contrato. Es **[BDD-101-1](03-requisitos-y-bdd.md#bdd-101-1)** convertido en prueba automática, y cubre los tres casos:

| Caso | Qué debe pasar |
|---|---|
| El front pide una MAJOR **menor** que la de la API | Pantalla «Esta versión ya no sirve con el servidor» y ninguna pantalla más |
| El front pide una MAJOR **mayor** que la de la API | Lo mismo. Un front adelantado contra un servidor viejo se rompe igual |
| Las dos MAJOR coinciden | Entra normal. Sin esta tercera no se sabe si la prueba está fallando por la razón correcta |

> **Fallar ruidoso al arrancar es mejor que fallar en la pantalla 7 con un campo nulo.** Un front
> que sigue andando contra una API incompatible no da un error: da cifras raras. Y una cifra rara
> en un sistema de plata se cree, se anota y se usa para decidir.

### <a id="c-03"></a>9.3 C-03 · El catálogo de códigos, completo y sin sobras

Hay **un solo catálogo** de códigos de cinco dígitos en `prisma_api`: código, HTTP, módulo, mensaje
en español y cuándo se emite. De él salen las respuestas, la documentación de Swagger y la tabla de
traducción de restricciones. [C-03](#c-03) lo compara con la realidad del código fuente, en los dos sentidos:

| Fallo | Qué pasaría sin [C-03](#c-03) |
|---|---|
| Un código emitido que **no está** en el catálogo | La API le devuelve al front un número sin mensaje redactado. La empleada ve una pantalla que no sabe explicar qué pasó |
| Un código del catálogo que **ya nadie emite** | Un mensaje muerto que nadie borra, y la falsa idea de que ese caso sigue cubierto |

> **La prueba falla nombrando el código, no diciendo «hay diferencias».** Un error que obliga a
> buscar a ciegas se termina silenciando.

### <a id="c-04"></a>9.4 C-04 · El OpenAPI versionado es el que sale del código

El `openapi.json` está versionado en el repositorio y se genera de los controladores, nunca se
escribe a mano. [C-04](#c-04) lo regenera y lo compara con el versionado; si difiere, la compilación falla.
La comparación se hace sobre el documento normalizado —mismo orden de claves, mismo formato—,
porque un falso rojo por cómo quedaron ordenadas las llaves enseña a ignorar la prueba. Es la que
hace exigible el **[RNF-30](03-requisitos-y-bdd.md#rnf-30)** y la que sostiene [`ADR-022`](adr/ADR-022-openapi-generado.md).

> **Actualizar la documentación deja de ser disciplina y pasa a ser un requisito para poder mezclar
> el cambio.** Un documento que depende de que alguien se acuerde se desactualiza el primer día en
> que alguien tiene prisa, y a partir de ahí miente con toda seguridad.

**Dos campos del documento servido no son del contrato** ([ADR-042](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md)): `info.version`,
que declara la versión de la API para que el badge de Swagger diga lo mismo que «Acerca de», y
`x-prisma-contrato`, adonde se mudó la del contrato.

Ninguno de los dos se compara con la copia fijada, y no porque se excluyan: antes de comparar, el
documento generado se lleva a la forma que se fija —la versión del contrato de vuelta en
`info.version`, sin la extensión—, y cada número se afirma aparte contra su fuente.

Así **subir `prisma.contrato.version` sin traer el documento nuevo sigue dejando la prueba en
rojo**, que es la garantía que antes daba comparar `info.version`, y además falla diciendo cuál de
las dos versiones se movió.

### <a id="c-05"></a>9.5 C-05 · La versión sube un paso en cada PR

[C-02](#c-02) compara números: el MAJOR que el front espera con el que la API responde. Esa comparación vale
lo que valgan los números, y el 18 de septiembre de 2026 no valían nada: «Acerca de» decía front
`0.2.0`, API `0.2.0` y esquema `0.1.0` después de diecisiete PR que no los tocaron, con la base en
`0.3.0`. [C-05](#c-05) es la que hace que el número se mueva cuando el proyecto se mueve ([ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md)).

Corre en un trabajo propio de cada integración continua, «La versión subió», en el PR contra
`develop` y en el empuje a `develop`. **Y exige el sufijo `-SNAPSHOT`** ([ADR-077](adr/ADR-077-snapshot-hasta-la-release.md)): los pasos se
cuentan sin él, y en el PR a `qa` y a `main` corre contra el mismo `HEAD`, donde lo único que juzga
es que la versión siga en `-SNAPSHOT`. Una versión sin sufijo, o en `-RELEASE`, falla siempre:

| Repositorio | Qué exige | Cómo se corre en una máquina |
|---|---|---|
| `prisma_front` | Si el PR cambia lo que se publica, el `pubspec.yaml` sube un paso y el número de compilación, uno | `dart run tool/la_version_subio.dart origin/develop` |
| `prisma_api` | Si el PR cambia lo que se publica, el `build.gradle.kts` sube un paso | `./gradlew laVersionSubio --args=origin/develop` |
| `prisma_db` | Ninguna migración que ya estaba cambia; si el PR agrega migraciones, la última publica en `schema_version` la versión siguiente; `verificar-base.sql` la espera; y `VERSION` la dice con `-SNAPSHOT` | `./scripts/db/la-version-subio.ps1 -Base origin/develop` |

Tres detalles deciden si sirve de algo:

- **Un paso, ni más ni menos.** La prueba no sabe si el cambio corrige o agrega, y no lo intenta: eso
  lo decide quien escribe. Lo que sí sabe es que `0.3.0` → `0.30.0` es una errata.
- **Lo que no se publica está escrito; todo lo demás, se publica.** Pruebas, README, flujos y
  configuración del repositorio no piden versión. Una carpeta nueva que nadie listó, sí: al revés,
  se escaparía sin avisar.
- **El mensaje trae el arreglo.** Dice qué archivos exigen la versión y cuáles son los tres pasos
  posibles, con sus números. Una prueba que solo dice «la versión está mal» se termina silenciando.

La lógica de las dos primeras tiene sus pruebas unitarias en el `test` de siempre de cada
repositorio, y la tercera se vio fallar contra cinco ramas rotas a propósito antes de fusionarse.

---

### <a id="c-06"></a>9.6 C-06 · El privilegio concedido es del tamaño del uso

[C-01](#c-01) cruza la tabla de traducciones con `pg_constraint` en los dos sentidos, para que ninguna
restricción se quede sin mensaje y ninguna traducción sobreviva a su restricción. [C-06](#c-06) hace lo
mismo con los privilegios: cruza **lo que los adaptadores de `infraestructura/postgres` usan de
verdad** con lo que la base le concede al rol **`authenticated`** ([ADR-071](adr/ADR-071-el-privilegio-es-del-tamano-del-uso.md)).

**El rol que se mide es `authenticated`, y no `prisma_api`.** `ConIdentidad` abre cada petición con
`SET LOCAL ROLE authenticated`, y el rol de la conexión es `NOINHERIT` ([ADR-012](adr/ADR-012-identidad-a-postgres.md)): toda consulta de
la API corre con los privilegios del otro. La concesión de `prisma_api` se mide contra cero, que es
la otra mitad del [ADR-071](adr/ADR-071-el-privilegio-es-del-tamano-del-uso.md) y va en su propia afirmación.

Corre contra la base, en el trabajo «Probar contra la base» de la integración continua de
`prisma_api`, y falla en los dos sentidos:

| Lo que encuentra | Por qué falla |
|---|---|
| Un adaptador escribe en una columna que el rol no tiene concedida | Es el error que hoy se ve en caliente, con el `42501` traducido al `40300` en la cara de quien usa la aplicación |
| El rol tiene una concesión que ningún adaptador usa | Es la mitad que se olvida. Una lista que solo se comprueba hacia un lado crece y nunca se encoge, y a los seis meses vuelve a ser `ON ALL TABLES` escrito de otra forma |

- **El uso se lee del código, no de una lista escrita a mano.** Una lista paralela se separa del
  código sin que nadie lo note, que es justo lo que [C-04](#c-04) existe para evitar en el contrato.
- **La concesión se le pregunta a la base**, con `information_schema.column_privileges`, y no se lee
  de la migración. Una migración se ve cerrada cuando no lo está: el `ALTER DEFAULT PRIVILEGES` que
  Supabase deja puesto concede por su cuenta, y solo preguntando aparece.
- **Lo que escribe una función `SECURITY INVOKER` cuenta como uso de quien la llama**, y su cuerpo
  se le pregunta a la base por `pg_proc`, en cierre transitivo. Con una `SECURITY DEFINER` el camino
  se corta: corre como el dueño y no cuesta ninguna concesión, que es por qué `auditoria` solo se
  lee.
- **Un `SELECT … FOR UPDATE` cuesta `UPDATE`** aunque no escriba nada, y a PostgreSQL le basta el
  privilegio en alguna columna, así que el bloqueo excusa la tabla y no una columna suya.
- **Lo que el lector del uso no sabe leer revienta la puerta**, en vez de quedarse callado: un
  `DO UPDATE SET`, un `INSERT` sin lista de columnas, un `DELETE`. Una forma que no se lee esconde
  una escritura, y su concesión aparecería como concesión sin uso.
- **Una concesión que hoy no tiene quien la use se declara con su razón**, y la declaración se
  comprueba en los dos sentidos: si la concesión desaparece, o si alguien empieza a usarla, la fila
  sobra y la puerta lo denuncia. Así la lista solo se encoge.

---

## 10. Idempotencia, canal firmado y durabilidad

Cuatro promesas que, sin una prueba que las ejerza, se quedan en promesas: que reintentar no cobra
dos veces, que una petición capturada no le sirve a nadie, que la identidad llega siempre a
PostgreSQL y que el respaldo de verdad se puede restaurar.

| # | Prueba | Resultado esperado |
|---|---|---|
| <a id="i-01"></a>I-01 | Enviar dos veces la misma petición de escritura con la **misma** `Idempotency-Key` | Un solo efecto en la base. La segunda respuesta es la guardada, con el mismo `status` y el mismo `mensaje` |
| [I-02](#i-02) | Inyectar un fallo **dentro** de la transacción, entre el registro de la clave y el efecto, y reintentar | Nada quedó escrito a medias: ni la clave sin efecto ni el efecto sin clave. El reintento se procesa como si fuera el primero |
| <a id="f-01"></a>F-01 | Reenviar una petición válida, tal cual, con el mismo `X-Prisma-Nonce` | Rechazada con `40103`. El efecto ocurre una sola vez |
| <a id="f-02"></a>F-02 | Enviar una petición con `X-Prisma-Timestamp` fuera de la ventana de ±5 minutos | Rechazada con `40102`, aunque la firma cuadre |
| [T-01](#t-01) | Recorrer las llamadas a repositorios y ejecutarlas sin transacción abierta | La llamada falla de inmediato. Ninguna consulta sale sin identidad |
| [RE-01](#re-01) | Restaurar en uat el respaldo de prod anonimizado y arrancar el sistema contra él | El sistema arranca, el Inicio carga y los cinco invariantes del [§4.2](#42-invariantes-que-deben-cumplirse-siempre) se cumplen sobre lo restaurado. **Una vez por trimestre** |

### <a id="i-02"></a>10.1 I-02 · El corte es lo que hace real la idempotencia

[I-01](#i-01) sola da una falsa sensación de seguridad: pasa igual aunque la clave y el efecto se guarden en
dos escrituras separadas, porque en una prueba feliz nunca se corta nada en la mitad.

> **El registro de la clave y el efecto de la operación tienen que ocurrir en la MISMA transacción
> de base de datos.** Si se guardan por separado, un corte entre las dos escrituras deja el sistema
> exactamente en el estado que la idempotencia prometía evitar: o una clave marcada como usada sin
> que se hiciera nada —y el reintento no vuelve a intentarlo—, o un gasto registrado sin clave —y
> el reintento lo cobra otra vez—.

Por eso [I-02](#i-02) no espera a que ocurra un corte: lo provoca. Se inyecta la falla después de escribir
la clave y antes de confirmar la transacción, y se afirma sobre el **número de filas** de las dos
tablas: quedan exactamente como estaban antes del intento, o la prueba falla.

### <a id="t-01"></a>10.2 T-01 · Sin transacción no hay identidad

Es la compañera de [P-32](#p-32) y sale del mismo sitio: la identidad se fija con `SET LOCAL` al abrir la
transacción, y `SET LOCAL` solo dura lo que dure esa transacción. Con un pool de conexiones, una
consulta que se ejecute **fuera** de una transacción viaja sin identidad, y ahí RLS no protege,
pero tampoco avisa: devuelve lo que le corresponda a la sesión de turno.

> **[P-32](#p-32) demuestra que la base juzga; [T-01](#t-01) demuestra que la base siempre sabe a quién está
> juzgando.** Un repositorio llamado fuera de transacción no rompe nada visible el día que se
> escribe. Rompe el día que alguien lee lo que no debía, y sin dejar rastro.

Regla que verifica: **ningún repositorio se llama fuera de una transacción.** La prueba la ejerce
en ejecución, comprobando que no hay transacción activa y exigiendo que la llamada falle en vez de
seguir.

### <a id="t-02"></a>10.3 T-02 · El cableado de producción también abre su transacción

[T-01](#t-01) exige que una consulta fuera de transacción **falle**. [T-02](#t-02) exige lo contrario y lo
complementario: que en el camino real de cada ruta haya alguien que **abra** la suya. Son las dos
caras, y sin la segunda cumplir la primera se ve exactamente igual que estar roto.

Ya pasó una vez: el inicio de sesión respondió `50000` a todo el mundo con sus tres pruebas en verde.
La ruta está exenta de la clave de idempotencia ([20 §5.1](20-contrato-de-api.md#51-la-cabecera)) y es el filtro de esa clave quien
abre la transacción de la petición, así que no la abría nadie; la consulta de la ficha salía sin
identidad y `ConsultaSinIdentidad` la detenía, que es justo lo que [T-01](#t-01) pide. **Lo que
ninguna prueba veía no era una clase: era el cableado**, y las tres lo sustituían —una con dobles de
los dos puertos y dos armando los adaptadores a mano, con la envoltura que producción no tenía—.

Regla que verifica: **cada ruta se prueba al menos una vez con el cableado de producción entero y
hablándole por HTTP.** Sin sustituir puertos, sin armar adaptadores y sin MockMvc: se levanta la
aplicación como se levanta de verdad, se manda la petición como la manda el front —con las cabeceras
que lleva y sin las que no— y se comprueba el `status` del sobre. Una prueba que arma el cableado
nunca prueba el cableado.

### <a id="re-01"></a>10.4 RE-01 · Un respaldo que nunca se restauró no es un respaldo

Es la única prueba de esta lista que no corre en cada cambio: corre **una vez por trimestre, en
uat**, y la ejecuta quien desarrolle con Gerencia avisada. Se restaura el respaldo de prod
anonimizado —anonimizado siempre, como exige
[`11-riesgos-y-proteccion-de-datos.md`](11-riesgos-y-proteccion-de-datos.md)— y se comprueba que el
sistema arranca contra él.

| Qué se anota cada trimestre | Por qué |
|---|---|
| Cuánto tardó la restauración | Es el tiempo real de recuperación, no el que uno se imagina |
| Hasta qué momento llegaron los datos | Es la pérdida máxima real ante un desastre |
| Qué falló o faltó | Un paso manual que nadie recordaba es exactamente lo que se busca encontrar hoy y no ese día |

> **Lo que se programa es una copia; lo que se prueba es un respaldo.** Entre las dos cosas hay un
> archivo corrupto, una migración que la copia no alcanzó, o una clave que ya nadie tiene. Eso se
> descubre restaurando, y es mejor descubrirlo un martes cualquiera en uat.

El procedimiento y las políticas de retención están en
[`13-respaldo-y-exportacion.md`](13-respaldo-y-exportacion.md) y en
[`16-base-de-datos-y-snapshots.md`](16-base-de-datos-y-snapshots.md). Aquí solo queda fijado que
**restaurar es una prueba con fecha, no una buena intención.**

---

## 11. Flujos críticos de extremo a extremo

Las pruebas de los apartados anteriores miran **una cosa cada una**: una regla, un permiso, una
restricción, una ruta. Estas siete miran lo otro, que es lo que se le rompe a quien usa el sistema:
que **registrar un gasto mueva la cifra del tablero**, que **cobrar un anticipo no la mueva**, y que
eso siga siendo cierto en el ambiente donde el artefacto está desplegado y no solo en la máquina de
quien programa.

Son la tarea [9.6](08-plan-de-desarrollo.md#tarea-9-6), y corren en dos sitios con el mismo código:

| Dónde | Contra qué | Cuándo |
|---|---|---|
| **En cada empuje** | La aplicación levantada por la tubería, con su base recién migrada y sembrada | Dentro de las pruebas de integración de `prisma_api` |
| **En qa** | La API **desplegada**, con su configuración y su base | A mano, y en cada empuje a `develop` |

> **La que corre en cada empuje es la que da fe de que las pruebas sirven.** La que corre en qa es
> la que da fe de que el ambiente sirve. Ninguna de las dos sustituye a la otra, y escribir los
> flujos dos veces los dejaría divergiendo en el primer cambio de contrato: se escriben una vez.

| # | Flujo | Qué afirma |
|---|---|---|
| <a id="e-01"></a>E-01 | Entrar, pedir el menú y la versión | La cadena entera contesta. El menú llega con secciones y lo decide la API ([ADR-018](adr/ADR-018-front-sin-decisiones.md)), y la versión que contesta es la del artefacto que corre |
| <a id="e-02"></a>E-02 | Registrar un gasto y leerlo en el libro | Sale en el libro, y **baja la utilidad causada del mes exactamente por su valor** ([M-01](#m-01), [M-04](#m-04)) |
| <a id="e-03"></a>E-03 | Registrar un pedido y cobrar su anticipo | Sube la caja por el valor cobrado y **la utilidad no se mueve**: un anticipo no es un ingreso ([RN-04](03-requisitos-y-bdd.md#rn-04), [M-02](#m-02)) |
| <a id="e-04"></a>E-04 | Anular un movimiento | Un motivo en blanco se rechaza con `42200`; con motivo, la cifra vuelve a donde estaba y **la fila sigue ahí con su motivo** ([M-05](#m-05)) |
| <a id="e-05"></a>E-05 | Reenviar la misma petición con la misma clave | La misma respuesta, y **una sola fila**: el reintento del celular sin señal no duplica el gasto ([ADR-020](adr/ADR-020-idempotencia.md)) |
| <a id="e-06"></a>E-06 | Cotizar y pedir el documento | El PDF llega con el número de la cotización en el nombre y adentro ([M-06](#m-06)) |
| <a id="e-07"></a>E-07 | El simulador de contratación | El veredicto llega dicho, y el presupuesto disponible es la utilidad promedio menos la reserva ([M-07](#m-07)) |

**Entran por la puerta.** Las demás pruebas de integración siembran la sesión en la tabla y le
fabrican su clave de firma; estas entran con usuario y contraseña, y de ahí sacan el token y la
clave. Contra una API desplegada no hay otra forma, y es lo que las vuelve de extremo a extremo:
entre la primera petición y la última están el filtro de sesión, el canal firmado, la idempotencia,
GoTrue y RLS.

**Ninguna cifra se afirma por su valor absoluto.** Se mide la diferencia entre antes y después,
porque la semilla de un ambiente cambia con cada tarea y una prueba que fije el número se vuelve
roja por algo que no es lo que ella vigila.

**Nunca contra uat ni contra prod**, como todo lo que escribe ([§1.1](#11-dónde-corre-cada-nivel)). Dos cerrojos lo impiden: salir
de la máquina hay que pedirlo por escrito, y la base tiene que traer la semilla, que es justo lo que
no entra en los ambientes del negocio.

**Lo que escriben lo borran**, como dueño y solo lo suyo, con ids fuera de los rangos de la semilla.
La mitad de front —entrar, el menú, registrar y leer de vuelta, por el código del front y no por
HTTP a mano— no habla con la base, así que deshace su gasto de un peso **anulándolo con motivo**,
que es lo único que deshace algo aquí ([ADR-004](adr/ADR-004-base-solo-escritura.md)).

> **El recorrido [M-03](#m-03) —entregar el pedido y cobrar el saldo— todavía no se puede automatizar.** La
> función de la base existe desde la [4.5](08-plan-de-desarrollo.md#tarea-4-5), pero la ruta que la llama no está en la copia fijada del
> contrato: está acordada y sin implementar. Cuando entre, es el octavo flujo de esta lista.

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](02-casos-de-uso.md "02 · Casos de uso") · [03](03-requisitos-y-bdd.md "03 · Requisitos, reglas de negocio y escenarios BDD") · [04](04-modelo-de-datos.md "04 · Modelo de datos") · [05](05-reglas-financieras.md "05 · Reglas financieras y KPIs") · [07](07-arquitectura.md "07 · Arquitectura técnica") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [11](11-riesgos-y-proteccion-de-datos.md "11 · Riesgos y protección de datos") · [13](13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [14](14-roadmap-e-ideas.md "14 · Roadmap e ideas de valor") · [16](16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [18](18-distribucion-y-pipelines.md "18 · Distribución multiplataforma y automatización (pipelines)") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](20-contrato-de-api.md "20 · Contrato de la API") · [21](21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [22](22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [Contrato](../contrato/README.md "Contrato de la API · v0.36.0") · [ADR-014](adr/ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-022](adr/ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [ADR-027](adr/ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [ADR-029](adr/ADR-029-esquema-por-etiqueta.md "ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase") · [ADR-030](adr/ADR-030-contrato-sin-get.md "ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0") · [ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md "ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige") · [ADR-037](adr/ADR-037-el-pr-se-abre-a-pedido.md "ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos") · [ADR-040](adr/ADR-040-rama-feature-y-pr-autorizado.md "ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base") · [ADR-042](adr/ADR-042-la-version-del-documento-es-la-de-la-api.md "ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato") · [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8") · [ADR-070](adr/ADR-070-las-migraciones-las-aplica-la-tuberia.md "ADR-070 · Las migraciones las aplica la tubería, no una persona") · [ADR-071](adr/ADR-071-el-privilegio-es-del-tamano-del-uso.md "ADR-071 · El privilegio que la base le concede a la API es del tamaño de su uso") · [ADR-072](adr/ADR-072-las-reglas-con-alcance-y-lo-compartido.md "ADR-072 · Una regla puede vivir en .claude/rules/ con su alcance, y lo compartido tiene una fuente y copias verificadas") · [ADR-077](adr/ADR-077-snapshot-hasta-la-release.md "ADR-077 · La versión es -SNAPSHOT hasta que la entrega crea su release/X.Y.Z") · [CLAUDE](../CLAUDE.md "CLAUDE.md") · [README](../scripts/agentes/README.md "Herramienta de lo compartido")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [11 · Riesgos y protección de datos](11-riesgos-y-proteccion-de-datos.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [13 · Respaldo y exportación](13-respaldo-y-exportacion.md)
