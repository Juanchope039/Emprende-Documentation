# 01 · Visión y alcance

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.1.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/01-vision-y-alcance.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-30 | [Negocio](INDICE.md#etiqueta-negocio) · [Requisitos](INDICE.md#etiqueta-requisitos) |

---

## 1. Visión del producto

> Para **quien dirige Prisma M&Y Estampados**,
> que hoy administra el negocio con Excel, un cuaderno y fotos en el celular,
> **Emprende** es una aplicación web de gestión administrativa y financiera
> que muestra en todo momento cuánto se ganó, cuánta plata está realmente disponible y
> cuánto se puede pagar a una empleada sin poner en riesgo el negocio.
>
> A diferencia de una hoja de cálculo, Emprende separa la plata del negocio de la personal,
> trata los anticipos como lo que son —una deuda con el cliente— y nunca pierde información.

---

## 2. Objetivos medibles

Cada objetivo tiene una forma de comprobarse. Sin métrica no hay objetivo.

| # | Objetivo | Métrica de éxito | Plazo |
|---|---|---|---|
| O1 | Tener las facturas y pedidos organizados por fecha | 100% de los pedidos del mes registrados en el sistema | Mes 1 post go-live |
| O2 | Conocer la utilidad mensual real | Cierre mensual disponible el día 3 del mes siguiente | Mes 1 |
| O3 | Separar plata del negocio de la personal | 0 movimientos personales en categorías de gasto operativo | Mes 2 |
| O4 | Dejar de gastar anticipos no devengados | Caja libre nunca negativa durante 3 meses seguidos | Mes 4 |
| O5 | Conocer el margen de cada producto | 100% de los productos con costo unitario definido | Mes 2 |
| O6 | Decidir sobre la contratación con datos | Simulador ejecutado con ≥6 meses de historia real | Mes 7 |
| O7 | Reducir el tiempo de administración | De ~4 h/semana a ≤1 h/semana | Mes 3 |
| O8 | No perder información nunca | 0 registros eliminados; 100% de anulaciones con motivo | Permanente |

---

## 3. Perfiles de usuario

El perfil corresponde al **tipo de usuario**, no al cargo. Los tipos son exactamente dos y no
se agregan más. Dentro del tipo Operación caben varios cargos, y todos se comportan igual
frente al sistema.

### 3.1 Gerencia (propiedad del negocio)

| | |
|---|---|
| **Quién es** | Quien dirige Prisma M&Y Estampados |
| **Dónde usa el sistema** | Celular en el taller, computador en la noche |
| **Conocimiento técnico** | Usuario de celular competente; no técnico |
| **Tiempo disponible** | Poco y fragmentado. Registrar algo debe tomar menos de 30 segundos |
| **Qué necesita** | Las tres cifras de un vistazo y la respuesta a "¿puedo contratar?" |
| **Qué le frustra** | Formularios largos, jerga contable, tener que pensar en qué categoría va algo |

### 3.2 Operación (el equipo del día a día)

| | |
|---|---|
| **Quién es** | Las personas que se contraten para producción, entregas y atención |
| **Qué cargos abarca** | Empleada de producción, Domiciliaria, Asistente administrativa, Aprendiz SENA, Contratista externo |
| **Dónde usa el sistema** | Celular en el taller |
| **Qué necesita** | Registrar ventas y gastos del día, consultar productos, ver su desprendible |
| **Qué NO debe ver** | Utilidad del negocio, retiros, patrimonio, nómina de otros, auditoría |

El cargo cambia lo que la persona hace en el taller, no lo que puede ver en el sistema. Una
domiciliaria y una asistente administrativa tienen exactamente los mismos permisos.

---

## 4. Matriz de tipos de usuario y permisos

Antes de la matriz hay que dejar clara una distinción que atraviesa todo el sistema: el **tipo
de usuario** y el **cargo** son cosas distintas y no se pueden usar como sinónimos.

| | **Tipo de usuario** | **Cargo** |
|---|---|---|
| Qué responde | ¿Qué puede **ver y hacer** en el sistema? | ¿Qué **hace en el negocio**? |
| Valores | Exactamente dos: `gerencia`, `operacion` | Lista abierta: Gerente, Empleada de producción, Domiciliaria, Asistente administrativa, Aprendiz SENA, Contratista externo… |
| Quién lo define | Fijo en el sistema, no se puede agregar uno nuevo | Gerencia lo administra desde el sistema |
| Para qué sirve | **Permisos.** Es lo que evalúa Row Level Security | **Contexto y reportes.** Nunca decide un permiso |
| Dónde vive | `usuarios.tipo` | `usuarios.cargo_id → cargos.nombre` |

> **Regla de oro:** ningún permiso se decide por el cargo. Dos personas con el mismo cargo
> pueden tener tipos distintos, y el sistema debe comportarse igual para todas las de tipo
> `operacion` sin importar su cargo. El cargo es descriptivo; el tipo es autoridad.

En una frase: **«El tipo dice qué puede ver. El cargo dice qué hace.»** La matriz que sigue
solo tiene dos columnas porque solo hay dos tipos.

| Acción | Gerencia | Operación |
|---|:---:|:---:|
| Iniciar sesión con usuario y contraseña | ✅ | ✅ |
| Cambiar **su propia** contraseña | ✅ | ✅ |
| Registrar ingreso | ✅ | ✅ |
| Registrar gasto | ✅ | ✅ |
| Adjuntar foto de recibo | ✅ | ✅ |
| Registrar pedido y anticipo | ✅ | ✅ |
| Marcar pedido como entregado | ✅ | ✅ |
| Consultar pedidos por fecha | ✅ | ✅ |
| Ver catálogo de productos | ✅ | ✅ |
| Ver **costo y margen** de productos | ✅ | ❌ |
| Definir costos y precios | ✅ | ❌ |
| Generar cotización | ✅ | ✅ |
| Ver **utilidad del negocio** | ✅ | ❌ |
| Ver caja y caja libre | ✅ | ❌ |
| Ver reportes mensuales y anuales | ✅ | ❌ |
| Registrar inversiones | ✅ | ❌ |
| Registrar aportes y retiros | ✅ | ❌ |
| Definir el pro-labore | ✅ | ❌ |
| Ver patrimonio | ✅ | ❌ |
| Simulador de capacidad de pago | ✅ | ❌ |
| Liquidar nómina | ✅ | ❌ |
| Ver **su propio** desprendible | ✅ | ✅ |
| Registrar adelantos de nómina | ✅ | ❌ |
| Anular movimientos | ✅ | ❌ |
| Crear cuentas de dinero | ✅ | ❌ |
| Configurar los 4 sobres | ✅ | ❌ |
| Importar desde Excel | ✅ | ❌ |
| Exportar respaldo | ✅ | ❌ |
| Ver bitácora de auditoría | ✅ | ❌ |
| Ver el listado de usuarios | ✅ | ❌ |
| Crear un usuario | ✅ | ❌ |
| Editar nombre, cargo o tipo de un usuario | ✅ | ❌ |
| Desactivar un usuario | ✅ | ❌ |
| Restablecer la contraseña de otro usuario | ✅ | ❌ |
| Administrar el catálogo de cargos | ✅ | ❌ |
| Reactivar un usuario | ✅ | ❌ |
| Ver la bitácora de cambios de usuarios | ✅ | ❌ |
| Revertir un cambio desde la bitácora | ✅ | ❌ |
| Previsualizar la vista de Operación | ✅ | ❌ |

> **Los saldos de las cuentas son la caja.** «Ver caja y caja libre» cubre también el saldo de
> Efectivo, Nequi, Daviplata y banco, y el total de todos. La equivalencia no era evidente y el
> prototipo alcanzó a mostrarle esos saldos a una sesión de Operación. Elegir una cuenta al
> registrar un movimiento no exige ver cuánto tiene: la lista ofrece nombres, no cifras.

> **Cómo se implementa:** con Row Level Security dentro de PostgreSQL. Ver
> [`07-arquitectura.md`](07-arquitectura.md) sección 6 y [`adr/ADR-006-rls-por-rol.md`](adr/ADR-006-rls-por-rol.md).
> Ocultar un menú no es seguridad: si el dato llega al navegador, ya está expuesto.

---

## 5. Alcance del MVP

### 5.1 Sí está incluido

| Módulo | Contenido |
|---|---|
| **Acceso y usuarios** | Autenticación con nombre de usuario, dos tipos de usuario, gestión de usuarios y de credenciales desde el sistema, catálogo de cargos, auditoría de sesiones |
| **Cuentas** | Efectivo, Nequi, Daviplata, bancos. Saldos y transferencias |
| **Movimientos** | Ingresos, gastos, categorías, doble fecha, adjuntos, anulación con motivo |
| **Pedidos y facturas** | Registro, orden por fecha, anticipo 50%, saldo contra entrega, estados |
| **Clientes** | Datos básicos, historial de pedidos |
| **Productos y servicios** | Catálogo, costo unitario con mano de obra en pesos, margen en pesos y porcentual |
| **Cotizaciones y remisiones** | PDF con logo, validador de anticipo mínimo |
| **Inversiones** | Activos del negocio, aportes de capital |
| **Retiros** | Separados en pro-labore y distribución de utilidades |
| **Reportes** | Mes, año, promedio, causación / caja / caja libre, punto de equilibrio |
| **Los 4 sobres** | Porcentajes parametrizables con historial |
| **Nómina simple** | Salario, días, horas extra, adelantos, descuentos, desprendible PDF |
| **Simulador** | Capacidad de pago y ventas adicionales necesarias |
| **Importación** | Carga de histórico desde CSV/Excel |
| **Alertas** | Caja libre negativa, anticipos sin entregar, registro tardío, descapitalización |
| **PWA** | Flutter multiplataforma, con **web por defecto**: el mismo código instalable en el celular como PWA y compilable a Android, iOS y escritorio sin envolver nada |
| **La API** | Java 25 con Spring Boot. Toma todas las decisiones del sistema y dicta los mensajes que muestra el front |
| **La capa de datos** | PostgreSQL en Supabase, con Row Level Security aplicando los permisos dentro de la base |
| **Cuatro ambientes** | Desarrollo, QA, aprobación y producción, cada uno con su propia base de datos. Nunca se prueba sobre datos reales |
| **Versionado visible** | La versión y el ambiente a la vista en el front, franja de aviso fuera de producción y panel «Acerca de» con el detalle |

### 5.2 No está incluido en esta versión

| Fuera de alcance | Motivo | Dónde queda |
|---|---|---|
| Facturación electrónica DIAN | Decisión explícita del negocio | Roadmap #1 |
| Cálculo de parafiscales y seguridad social | Requiere formalización previa | Roadmap #2 |
| Escenarios jurídicos y factor prestacional | Diferido | Roadmap #3 |
| Parámetros legales versionados por año | Diferido | Roadmap #4 |
| Procedimiento y simulacro de restauración | Fase posterior | Roadmap #6 |
| Inventario de insumos con control de existencias | No prioritario para el MVP | Roadmap #9 |
| Integración con pasarelas de pago | No requerido | Roadmap #18 |
| Multi-sucursal | Un solo taller | Roadmap #24 |

> **El exportador de respaldos salió de esta tabla.** Estuvo aquí como «se diseña ahora, se construye
> después» hasta el [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md), que lo metió al [Sprint 8](08-plan-de-desarrollo.md#sprint-8) con las tareas [8.13](08-plan-de-desarrollo.md#tarea-8-13) a [8.17](08-plan-de-desarrollo.md#tarea-8-17). Lo que sigue fuera
> es **restaurar**, que es la fila de arriba y no la misma cosa: el [13 §9](13-respaldo-y-exportacion.md#9-fuera-de-alcance-de-esta-versión) lo explica.

---

## 6. Supuestos

| # | Supuesto | Si resulta falso |
|---|---|---|
| <a id="s1"></a>S1 | Hay conexión a internet la mayor parte del tiempo en el taller | La PWA guarda en cola y sincroniza al reconectar |
| <a id="s2"></a>S2 | El negocio opera con una sola ubicación | Habría que agregar dimensión de sucursal al modelo |
| <a id="s3"></a>S3 | La política comercial es 50% anticipo y 50% contra entrega | El porcentaje es parametrizable por pedido |
| <a id="s4"></a>S4 | Habrá máximo una empleada en el horizonte del MVP | El modelo soporta varias sin cambios |
| <a id="s5"></a>S5 | Existe un Excel con histórico parcial | Si no, se arranca desde el saldo inicial |

---

## 7. Restricciones

| # | Restricción |
|---|---|
| R1 | Costo mensual de operación al mínimo sostenible: solo producción y aprobación en plan de pago —«siempre en línea» lo exige—; desarrollo y QA en el gratuito. Es la misma exigencia que fija `RNF-14`, escrita con las mismas palabras a propósito |
| R2 | Debe funcionar bien en un celular de gama media con datos móviles |
| R3 | Registrar un movimiento no puede tomar más de 30 segundos |
| R4 | Ningún dato puede ser eliminado físicamente de la base |
| R5 | Toda cifra monetaria en pesos colombianos enteros |
| R6 | Todas las fechas en zona horaria America/Bogota |

---

## 8. Criterios de éxito del proyecto

El proyecto se considera exitoso si, a los 90 días del go-live:

1. El registro diario es un hábito: ≥90% de los días con al menos un movimiento registrado.
2. El cierre mensual se produce sin intervención técnica.
3. La gerencia puede responder las tres preguntas originales con el sistema abierto, en menos
   de un minuto cada una.
4. El Excel y el cuaderno dejaron de usarse.
5. Cero registros perdidos y cero anulaciones sin motivo.

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](04-modelo-de-datos.md "04 · Modelo de datos") · [22](22-documentacion.md "22 · Documentación: versiones, estados y referencias")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [00 · Resumen ejecutivo](00-resumen-ejecutivo.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [02 · Casos de uso](02-casos-de-uso.md)
