# 06 · Nómina y capacidad de pago

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.1.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/06-nomina-y-capacidad-de-pago.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-06 | [Nómina](INDICE.md#etiqueta-nomina) · [Finanzas](INDICE.md#etiqueta-finanzas) · [Negocio](INDICE.md#etiqueta-negocio) |

> **Módulo exclusivo del tipo Gerencia.** El tipo Operación solo puede ver su propio desprendible.

---

## 1. Alcance de esta versión

| Incluido | No incluido (ver [`14-roadmap-e-ideas.md`](14-roadmap-e-ideas.md)) |
|---|---|
| Salario acordado y días trabajados | Aportes a seguridad social |
| Horas extra y recargos configurables | Parafiscales (SENA, ICBF, caja de compensación) |
| Adelantos y descuentos | Provisión de prestaciones sociales |
| Neto a pagar y desprendible en PDF | Factor prestacional por figura jurídica |
| Simulador de capacidad de pago | Liquidación definitiva de contrato |
| El pro-labore y las horas pagadas del mes | Parámetros legales versionados por año |

La nómina es **simple y de control interno**. No es una liquidación laboral legal.
Antes de formalizar una contratación, esos cálculos deben revisarse con un contador.

---

## 2. Clasificación de los pagos a personal

La pregunta *"¿el pago a la empleada es retiro o gasto?"* se responde con una sola prueba:

> **¿El negocio necesita esto para poder producir?**

El trabajo de la empleada sí — sin ella hay menos producción, igual que sin tinta. El retiro de
la gerencia no: el negocio opera idéntico si no se hace.

| Concepto | Naturaleza | ¿Utilidad? | ¿Caja? | ¿Patrimonio? | Sobre |
|---|---|:---:|:---:|:---:|---|
| Salario de la empleada | Gasto de personal | ▼ **baja** | ▼ | ▼ | Gastos fijos |
| Horas extra | Gasto de personal | ▼ baja | ▼ | ▼ | Gastos fijos |
| **Adelanto** | Cuenta por cobrar | — **no baja** | ▼ | — | — |
| **Pro-labore** de la gerencia | Gasto de personal | ▼ **baja** | ▼ | ▼ | Gastos fijos |
| **Retiro de utilidades** | Distribución | — **no baja** | ▼ | ▼ | Retiro |
| Aporte de capital | Capital | — | ▲ | ▲ | — |

**Ejemplo ([RN-10](03-requisitos-y-bdd.md#rn-10)).** Ventas $8.000.000, otros gastos $5.000.000, salario de la empleada
$1.300.000 → **utilidad $1.700.000**. El salario sí la reduce, a diferencia del retiro.

---

## 3. Motor de capacidad de pago

### 3.1 La fórmula

```
  Utilidad operativa promedio de los últimos 6 meses
     (obligatoriamente con el pro-labore ya descontado como gasto)
− Reserva de seguridad (% parametrizable)
= PRESUPUESTO MENSUAL DISPONIBLE PARA PERSONAL
```

### 3.2 Por qué el pro-labore es obligatorio en este cálculo (RN-09)

| Base de cálculo | Utilidad promedio | Salario que parecería viable |
|---|---:|---:|
| ❌ Sin descontar el trabajo propio | $3.000.000 | ~$2.400.000 |
| ✅ Con pro-labore de $1.500.000 | $1.500.000 | ~$1.200.000 |

La cifra inflada haría contratar al doble de lo sostenible. **Ese error exacto —contratar con
base en una utilidad que no cuenta el trabajo propio— es la causa típica de que un
emprendimiento contrate y quiebre al cuarto mes.** Por eso el simulador se bloquea si no hay
pro-labore definido.

### 3.3 Ejemplo con datos reales del negocio

| Concepto | Valor |
|---|---:|
| Utilidad operativa promedio de 6 meses (con pro-labore) | $1.180.000 |
| − Reserva de seguridad (20%) | −$236.000 |
| **= Presupuesto disponible para personal** | **$944.000** |

### 3.4 Veredicto según el salario evaluado

| Escenario | Costo mensual | ¿Viable? | Diferencia |
|---|---:|:---:|---:|
| Medio tiempo · $800.000 | $800.000 | ✅ Sí | sobran $144.000 |
| Tiempo completo · $1.300.000 | $1.300.000 | ❌ No | faltan $356.000 |
| Tiempo completo · $1.500.000 | $1.500.000 | ❌ No | faltan $556.000 |

---

## 4. Ventas adicionales necesarias — la traducción a unidades

Saber que "faltan $556.000" no orienta. Saber cuántos mugs hay que vender sí.

### 4.1 El margen de contribución correcto

Para este cálculo **no se incluye la mano de obra en el costo**: precisamente el trabajo es el
gasto fijo que se está tratando de cubrir. Incluirlo sería contarlo dos veces ([RN-17](03-requisitos-y-bdd.md#rn-17)).

```
Margen de contribución unitario = Precio − (Insumo + Consumibles)
Unidades adicionales necesarias = Faltante ÷ Margen de contribución unitario
```

| Producto | Costo total | − Mano de obra | = Materiales | Precio | **MC unitario** |
|---|---:|---:|---:|---:|---:|
| Mug estampado | $8.400 | $1.880 | $6.520 | $18.000 | **$11.480** |
| Camiseta DTF | $19.500 | $2.350 | $17.150 | $32.000 | **$14.850** |
| Llavero acrílico | $2.100 | $940 | $1.160 | $7.000 | **$5.840** |
| Rompecabezas A4 | $14.200 | $2.820 | $11.380 | $22.000 | **$10.620** |
| Bordado mediano | $11.800 | $3.447 | $8.353 | $25.000 | **$16.647** |

La mano de obra se escribe en pesos por producto ([05 §7.1](05-reglas-financieras.md#71-costo-unitario)), así que aquí se resta tal cual:
antes salía de unos minutos por unidad y una tarifa por hora, y las cifras son las mismas.

### 4.2 Resultado para el faltante de $556.000

| Producto | Unidades adicionales al mes |
|---|---:|
| Camisetas DTF | **38** |
| Bordados medianos | **34** |
| Mugs estampados | **49** |
| Rompecabezas | **53** |
| Llaveros | **96** |

> **Lectura clave.** El faltante se lee en unidades, que es la forma en que alguien lo puede
> decidir: «38 camisetas más al mes» se compara con lo que el taller ya vende, y «$556.000» no.
> **Contratar no resuelve un problema de ventas**: agrega costo fijo sin agregar clientes.

> **⛔ Retirado el 2026-10-06: cuánto trabajo piden esas unidades.** El cuadro traía una columna
> de horas, y con ella la regla de que una meta por debajo del 20% de la jornada evaluada
> significaba que la restricción era la demanda y no la capacidad de producir. Las dos salían de
> los minutos por unidad del costeo, y el catálogo dejó de pedir tiempo ([05 §7.1](05-reglas-financieras.md#71-costo-unitario)): sin ese dato
> no hay de dónde calcularlas, y una cifra que ningún producto nuevo puede llenar se leería como
> que esas ventas no cuestan trabajo.

---

## 5. Alternativas cuando no es viable

Cuando el presupuesto disponible no alcanza, el sistema no se limita a decir "no".

| Alternativa | Cuándo tiene sentido | Qué muestra el sistema |
|---|---|---|
| **Medio tiempo** | El presupuesto cubre la mitad | Costo y veredicto recalculados |
| **Por obra o pedido** | La demanda es irregular | Costo por pedido y punto en que conviene fijo |
| **Aumentar ventas primero** | La utilidad no alcanza para el salario | Meta mensual en unidades y plazo estimado |
| **Subir precios** | Hay productos con margen en pesos bajo | Cuánto subir cada producto para cerrar la brecha |
| **Cambiar la mezcla** | Se vende sobre todo lo que menos deja | Qué productos dan más margen en pesos por unidad |

> La tercera suele ser la más reveladora: vender lo mismo cambiando qué se empuja no cuesta un
> peso más de nómina, y el faltante de $556.000 del ejemplo cabe en la diferencia de margen entre
> un producto y otro.

---

## 6. Liquidación mensual

### 6.1 Fórmulas

```
Valor hora ordinaria = Salario acordado ÷ Horas mensuales pactadas
Valor hora extra     = Valor hora ordinaria × (1 + Recargo %)

Devengado = Salario proporcional a días trabajados
          + Horas extra × Valor hora extra
          + Otros devengados

Descuentos = Adelantos pendientes + Otros descuentos

NETO A PAGAR = Devengado − Descuentos
```

El recargo de hora extra y las horas mensuales pactadas son **parámetros configurables** por
empleada, no valores fijos en el código.

### 6.2 Ejemplo de liquidación

Empleada con salario acordado de **$1.300.000**, jornada de 192 horas mensuales, recargo de
hora extra del 25%, 30 días trabajados, 6 horas extra y un adelanto de $300.000 recibido el
día 12.

**Paso 1 · Tarifas por hora** *(cálculo previo — estos valores son unitarios, no se suman al devengado)*

| Tarifa | Cálculo | Valor por hora |
|---|---|---:|
| Valor hora ordinaria | 1.300.000 ÷ 192 | $6.771 |
| Valor hora extra | 6.771 × 1,25 | $8.464 |

**Paso 2 · Desglose del devengado** *(estos son los conceptos que sí se suman)*

| Concepto | Cálculo | Valor |
|---|---|---:|
| Salario del período | 30 de 30 días | $1.300.000 |
| + Horas extra | 6 h × $8.464 | $50.784 |
| **= Total devengado** | 1.300.000 + 50.784 | **$1.350.784** |
| − Adelanto del día 12 | recibido antes de liquidar | −$300.000 |
| **= NETO A PAGAR** | 1.350.784 − 300.000 | **$1.050.784** |

> **Ojo con un error frecuente.** El total devengado es **$1.350.784**, no $1.366.019. La
> diferencia sale de sumar por equivocación las *tarifas por hora* ($6.771 y $8.464): esas son
> el precio de **una** hora, un paso para calcular las horas extra, no un monto que se devengue.
> Al devengado solo entran el salario del período y el total de las horas extra ($50.784).

### 6.3 El efecto correcto sobre utilidad y caja

| | Gasto del mes | Salida de caja |
|---|---:|---:|
| Adelanto (día 12) | $0 | $300.000 |
| Liquidación (día 30) | $1.350.784 | $1.050.784 |
| **Total** | **$1.350.784** | **$1.350.784** |

> **El gasto se reconoce una sola vez, completo, en la liquidación.** La caja salió en dos
> momentos. Registrar el adelanto como gasto y luego el salario completo contaría **$1.650.784**
> — $300.000 de más, mes tras mes.

---

## 7. Adelantos (RN-11)

| Momento | Qué hace el sistema |
|---|---|
| Se entrega el adelanto | Reduce la caja · Crea cuenta por cobrar · **No registra gasto** |
| Se liquida la nómina | Descuenta el adelanto del neto · Cancela la cuenta por cobrar |

El índice parcial `idx_adelantos_pendientes` de la base de datos garantiza que un adelanto
**no pueda descontarse dos veces** (ver [`04-modelo-de-datos.md`](04-modelo-de-datos.md) [§4.7](04-modelo-de-datos.md#47-personal-y-nómina)).

Si al cerrar el mes queda un adelanto sin descontar, aparece en el panel como cuenta por cobrar
viva, con su antigüedad en días.

---

## 8. Desprendible de pago

PDF generado con el logo del negocio. Contiene:

| Sección | Contenido |
|---|---|
| Encabezado | Logo, nombre del negocio, período liquidado |
| Identificación | Nombre y documento de la empleada, cargo, fecha de ingreso |
| Devengados | Salario, horas extra con su detalle, otros devengados |
| Descuentos | Adelantos con su fecha, otros descuentos |
| Total | Neto pagado, en números y en letras |
| Pie | Fecha de pago, cuenta de origen, espacio para firma |

**Acceso:** Gerencia genera y ve todos. Operación ve **únicamente el suyo**, restricción
aplicada por Row Level Security en `nomina_detalle` (política `nom_lectura`).

---

## 9. Horas pagadas vs. horas facturadas

> **⛔ Retirado el 2026-10-06.** Las horas facturadas se sacaban del tiempo por unidad del costeo,
> y el catálogo dejó de pedir tiempo ([05 §7.1](05-reglas-financieras.md#71-costo-unitario)). Las horas pagadas se siguen viendo en
> nómina y en el pro-labore; lo que ya no existe es contra qué compararlas, así que el tiempo
> ocioso no se calcula. Lo que sigue queda escrito para que se entienda qué regía antes.

```
Horas pagadas    = Horas de nómina + Horas de pro-labore
Horas facturadas = Σ (minutos por unidad × unidades entregadas) ÷ 60
Tiempo ocioso    = Horas pagadas − Horas facturadas
Costo del ocio   = Tiempo ocioso × Tarifa por hora
```

| Tiempo ocioso | Interpretación | Acción sugerida por el sistema |
|---|---|---|
| < 15% | Normal: alistamiento, limpieza, atención | Ninguna |
| 15% – 35% | Hay capacidad libre sin vender | Buscar demanda antes de contratar |
| > 35% | Exceso de capacidad o trabajo no cobrado | Revisar ajustes, repeticiones y diseños regalados |

Este indicador era el contrapeso del simulador: **antes de agregar horas pagadas conviene vender
las que ya se pagan.**

---

## 10. Resumen de reglas de este módulo

| Regla | Enunciado |
|---|---|
| **[RN-08](03-requisitos-y-bdd.md#rn-08)** | El pro-labore es gasto de personal y reduce la utilidad |
| **[RN-09](03-requisitos-y-bdd.md#rn-09)** | El simulador usa obligatoriamente la utilidad con pro-labore descontado |
| **[RN-10](03-requisitos-y-bdd.md#rn-10)** | El salario de la empleada es gasto y reduce la utilidad |
| **[RN-11](03-requisitos-y-bdd.md#rn-11)** | El adelanto es cuenta por cobrar; el gasto se reconoce en la liquidación |
| **[RN-17](03-requisitos-y-bdd.md#rn-17)** | El margen de contribución para el simulador excluye el costo del tiempo |

---

## 11. Advertencia

Este módulo es una herramienta de **decisión y control interno**. No calcula aportes a
seguridad social, parafiscales ni prestaciones sociales, y no constituye una liquidación laboral
conforme a la normativa colombiana.

**Antes de formalizar una contratación**, los cálculos deben revisarse con un contador público,
y el costo real del empleador será **mayor** que el salario acordado que aquí se maneja. El
simulador, por tanto, entrega una cota **optimista**: si con estos números no alcanza, con los
números completos tampoco.

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](02-casos-de-uso.md "02 · Casos de uso") · [03](03-requisitos-y-bdd.md "03 · Requisitos, reglas de negocio y escenarios BDD") · [04](04-modelo-de-datos.md "04 · Modelo de datos") · [05](05-reglas-financieras.md "05 · Reglas financieras y KPIs") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [Contrato](../contrato/README.md "Contrato de la API · v0.35.0")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [05 · Reglas financieras](05-reglas-financieras.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [07 · Arquitectura](07-arquitectura.md)
