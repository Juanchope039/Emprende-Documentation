# 00 · Resumen ejecutivo

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/00-resumen-ejecutivo.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-09-16 | [Negocio](INDICE.md#etiqueta-negocio) · [Finanzas](INDICE.md#etiqueta-finanzas) · [Plan](INDICE.md#etiqueta-plan) |

> Documento de 5 minutos. Si solo vas a leer uno, que sea este.

---

## 1. Qué pasa hoy

Prisma M&Y Estampados produce estampados personalizados y bordados en Cali: mugs, llaveros,
camisetas, rompecabezas y más. El negocio funciona y vende. El problema no es comercial, es de
**visibilidad**: la información administrativa está repartida entre un archivo de Excel, un
cuaderno físico y fotos de facturas en el celular.

Eso produce cinco síntomas concretos:

| Síntoma | Consecuencia real |
|---|---|
| No se sabe cuánto se ganó el mes pasado | Se toman decisiones de precio a ojo |
| La plata del negocio y la personal están mezcladas | Es imposible saber si el negocio se sostiene solo |
| Los anticipos se confunden con ganancias | Se gasta plata comprometida con un cliente |
| El trabajo propio no se cuenta como costo | El negocio parece más rentable de lo que es |
| No hay base para decidir sobre contratar | La decisión más cara del negocio se toma sin números |

---

## 2. Qué es PRISMA

Una aplicación web instalable en el celular y usable desde el computador, que centraliza la
administración y las finanzas del negocio.

Por dentro son **tres partes**: un front hecho en Flutter —web por defecto, y el mismo código
compila a celular y a escritorio—, una API propia en Java 25 con Spring Boot y una base de datos
PostgreSQL siempre en línea. **El front solo pide, recibe y muestra**: no lleva dentro ni una
regla de negocio, ni un permiso, ni un mensaje de error. La API toma todas las decisiones, hace
todos los cálculos y le dicta al front qué mostrar y cuándo; la base, además, vuelve a aplicar
los permisos por su cuenta. Y ese conjunto existe cuatro veces, en cuatro ambientes separados
—desarrollo, QA, aprobación y producción—, para que nadie pruebe sobre los datos reales del
negocio.

### Lo que va a permitir hacer

1. **Organizar facturas y pedidos por fecha**, con el estado del anticipo y del saldo, y la foto
   o el PDF adjunto.
2. **Registrar ingresos y gastos** en segundos desde el celular, con la fecha real del
   movimiento y la foto del recibo.
3. **Controlar inversiones, aportes y retiros** separados de los gastos operativos.
4. **Saber cuánto se genera al mes y al año** y cuál es el promedio de ganancias.
5. **Calcular cuánto se puede destinar al pago de una empleada** y liquidar su nómina con
   desprendible en PDF.
6. **Conocer el margen real de cada producto** — mug, llavero, camiseta, rompecabezas, bordado —
   y cuál deja más plata por hora de trabajo.
7. **Generar cotizaciones y remisiones en PDF** con logo, listas para enviar por WhatsApp.

---

## 3. Las tres cifras que van a cambiar la forma de decidir

### 3.1 Utilidad causada — ¿el negocio es rentable?

Lo que realmente produjo el trabajo del mes, se haya cobrado o no.

### 3.2 Caja — ¿cuánta plata hay?

Lo que efectivamente entró y salió de las cuentas.

### 3.3 Caja libre — ¿cuánto puedo usar hoy?

```
CAJA LIBRE = Saldo en todas las cuentas
           − Anticipos de pedidos aún no entregados
           − Gastos fijos comprometidos del mes
```

**Esta última es la cifra más importante del sistema** y la que hoy no existe en ninguna parte.
Un anticipo del 50% que está en Nequi no es ganancia: es una deuda con el cliente hasta que se
entregue el pedido. Gastarlo antes de entregar es gastar plata que todavía no se ganó.

---

## 4. Los tres hallazgos del análisis

Del diseño salieron tres cosas que no eran el requisito original pero que valen más que varias
funcionalidades juntas.

### Hallazgo 1 — El anticipo del 50% no siempre cubre el material

| Producto | Margen | El material cuesta | ¿El 50% lo cubre? |
|---|---|---|---|
| Llaveros | 70% | 30% del precio | ✅ Sobra |
| Mugs | 53% | 47% del precio | ✅ Justo |
| Camisetas DTF | 39% | 61% del precio | ❌ Faltan 11 puntos |
| Rompecabezas | 35% | 65% del precio | ❌ Faltan 15 puntos |

En los pedidos de margen bajo, **el negocio le está prestando plata al cliente** para comprar
su propio material. PRISMA calculará el anticipo mínimo de cada cotización y avisará cuando el
50% no alcance.

### Hallazgo 2 — El trabajo propio no se cuenta, y eso infla la utilidad

Quien dirige el negocio también estampa y borda. Ese trabajo es un costo real, pero al cobrarse
en forma de retiro queda invisible.

| | Utilidad del mes | Margen |
|---|---|---|
| Sin contar el trabajo propio | $3.000.000 | 37,5% |
| Contándolo como pro-labore de $1.500.000 | **$1.500.000** | **18,75%** |

La cifra de la izquierda es la que haría contratar a alguien por $2.000.000 al mes. La de la
derecha muestra que no alcanza. **Este error es la causa típica de que un negocio contrate y
quiebre al cuarto mes.**

### Hallazgo 3 — Retirar más de lo que se genera no se nota hasta que es tarde

```
Patrimonio = Aportes − Retiros + Utilidades acumuladas
```

Se puede tener doce meses rentables seguidos y estar vaciando el negocio. PRISMA vigila esa
relación y alerta cuando los retiros de los últimos doce meses superan las utilidades del mismo
período.

---

## 5. Cómo se va a construir

| | |
|---|---|
| **Tecnología** | Flutter multiplataforma, web por defecto (front) + Java 25 con Spring Boot (API propia) + Supabase (PostgreSQL) |
| **Dónde funciona** | Navegador del PC y app instalable en el celular, con el mismo código |
| **Ambientes** | Cuatro: desarrollo, QA, aprobación y producción, cada uno con su propia base |
| **Versión** | Cada proyecto la lleva por separado, y el front la muestra abajo a la izquierda junto al ambiente |
| **Duración** | 10 sprints más 3 semanas de estabilización y puesta en marcha. Cuántas semanas en total depende de cuántos frentes de trabajo avancen a la vez ([§6](#6-cronograma-resumido)) |
| **Costo mensual de operación** | Ya no es $0: producción y aprobación necesitan plan de pago para no pausarse; desarrollo y QA siguen en el gratuito |
| **Seguridad** | Permisos dentro de la base de datos; borrado imposible por diseño |
| **Tipos de usuario** | Gerencia (todo) y Operación (registro, sin ver utilidad ni nómina) |

Cada persona entra con **su propio usuario y contraseña**, no con un selector compartido. Al
abrir la sesión el sistema sabe su nombre completo, su cargo y su tipo: el tipo dice qué puede
ver, el cargo dice qué hace en el negocio.

---

## 6. Cronograma resumido

El trabajo se reparte en **carriles**: frentes que avanzan a la vez sin esperarse, como la API, la
base de datos y las pantallas. Con más carriles se termina antes, pero no en la mitad: hay partes
que van en cadena y la puesta en marcha no se parte.

<!-- generado:plan-resumen · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**34,6 semanas con 1 carril**, **20,6 semanas con 2 carriles** y **16,3 semanas con 3 carriles**, contando las 3 de estabilización. El detalle está en el [cronograma por carriles](08-plan-de-desarrollo.md#1-cronograma-por-carriles).
<!-- /generado:plan-resumen -->

| Sprint | Entrega |
|---|---|
| 0 | Los dos proyectos, los cuatro ambientes y el contrato de respuesta |
| 1 | Base de datos, permisos en la base, identidad propagada hasta PostgreSQL e idempotencia |
| 2 | Acceso, usuarios, cargos y canal firmado |
| 3 | Ingresos, gastos, cuentas, saldos |
| 4 | Pedidos, anticipos, entregas |
| 5 | Productos, costeo y márgenes |
| 6 | Reportes y las tres cifras |
| 7 | Inversiones, retiros, pro-labore, patrimonio |
| 8 | Nómina, simulador, cotizador y cierre |
| 9 | Promoción hasta producción, PWA, endurecimiento y la publicación automática |
| — | Estabilización, aprobación en UAT, migración, capacitación y go-live |

**En qué semana llega cada hito**, según cuántos carriles avancen a la vez:

<!-- generado:plan-calendario · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**210 días de trabajo en 174 tareas.** Un carril avanza 6,59 días por semana, el ritmo del plan original; cada carril extra le quita un 10 % a todos por coordinación; y dos tareas del mismo carril y del mismo sprint no van a la vez.

| Carriles activos | Desarrollo | Estabilización | Total | Frente a 1 carril |
|:---:|---:|---:|---:|---:|
| 1 | 31,6 semanas | 3 semanas | **34,6 semanas** | — |
| 2 | 17,6 semanas | 3 semanas | **20,6 semanas** | −14,0 semanas |
| 3 | 13,3 semanas | 3 semanas | **16,3 semanas** | −18,3 semanas |

| Hito | 1 carril | 2 carriles | 3 carriles |
|---|:---:|:---:|:---:|
| [H1](08-plan-de-desarrollo.md#h1) · Sprint 0 | semana 4 | semana 3 | semana 3 |
| [H2](08-plan-de-desarrollo.md#h2) · Sprint 1 | semana 7 | semana 5 | semana 4 |
| [H3](08-plan-de-desarrollo.md#h3) · Sprint 2 | semana 11 | semana 7 | semana 6 |
| [H4](08-plan-de-desarrollo.md#h4) · Sprint 3 | semana 15 | semana 9 | semana 7 |
| [H5](08-plan-de-desarrollo.md#h5) · Sprint 4 | semana 18 | semana 11 | semana 9 |
| [H6](08-plan-de-desarrollo.md#h6) · Sprint 5 | semana 19 | semana 11 | semana 9 |
| [H7](08-plan-de-desarrollo.md#h7) · Sprint 6 | semana 22 | semana 13 | semana 10 |
| [H8](08-plan-de-desarrollo.md#h8) · Sprint 7 | semana 24 | semana 14 | semana 10 |
| [H9](08-plan-de-desarrollo.md#h9) · Sprint 8 | semana 28 | semana 17 | semana 14 |
| [H10](08-plan-de-desarrollo.md#h10) · Sprint 9 | semana 30 | semana 17 | semana 13 |
| [H11](08-plan-de-desarrollo.md#h11) · go-live | semana 35 | semana 21 | semana 17 |
<!-- /generado:plan-calendario -->

> **Son más de 16 semanas porque el backend volvió al proyecto.** Construir, probar y desplegar la
> API en cuatro ambientes es trabajo nuevo, no las mismas horas repartidas en más casillas. Y el
> calendario es el del trabajo descrito: no incluye vacaciones ni imprevistos, así que es una
> estimación y no una fecha prometida. El detalle, tarea por tarea, está en
> [`08-plan-de-desarrollo.md`](08-plan-de-desarrollo.md).

---

## 7. Qué NO hace esta versión

- **No emite facturas electrónicas ante la DIAN.** Registra y organiza; no transmite.
- **No calcula parafiscales ni aportes a seguridad social.** La nómina es simple.
- **No reemplaza a un contador.** Es control interno de gestión.

Todo lo anterior está documentado y priorizado en [`14-roadmap-e-ideas.md`](14-roadmap-e-ideas.md)
para fases posteriores.

---

## 8. La decisión que se pide ahora

Abrir [`../mockup/prisma-mockup.html`](../mockup/prisma-mockup.html), entrar con el usuario de
ejemplo `yuliana` (Gerencia), recorrer las 11 pantallas y marcar el checklist de aprobación del
documento [`09-plan-de-implantacion.md`](09-plan-de-implantacion.md).

**Nada se programa hasta que ese checklist esté firmado.** Corregir una pantalla en el mockup
cuesta minutos; corregirla después de construida cuesta días.

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** ningún otro documento lo cita todavía.
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [🏠 Inicio (README)](../README.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [01 · Visión y alcance](01-vision-y-alcance.md)
