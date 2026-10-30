# 05 · Reglas financieras y KPIs

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [3.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/05-reglas-financieras.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-06 | [Finanzas](INDICE.md#etiqueta-finanzas) · [Negocio](INDICE.md#etiqueta-negocio) |

> **El documento más importante del proyecto.** Aquí viven las fórmulas exactas que el sistema
> debe implementar. Si algo en el código contradice este documento, el código está mal.

---

## 1. Las tres cifras

Ninguna sola responde la pregunta completa. El sistema muestra siempre las tres.

| Cifra | Pregunta que responde | Riesgo de mirarla sola |
|---|---|---|
| **Utilidad causada** | ¿El negocio es rentable? | Sentirse rico y quedarse sin efectivo |
| **Caja** | ¿Cuánta plata hay? | Confundir anticipos con ganancias y gastarlos |
| **Caja libre** | ¿Cuánto puedo usar hoy? | — Es la que hay que mirar para decidir |

**Regla mnemotécnica:** *la causación decide si subes precios; la caja libre decide si compras
materia prima esta semana.*

---

## 2. Naturaleza de cada movimiento

Antes de cualquier fórmula hay que clasificar bien. La prueba es una sola pregunta:

> **¿El negocio necesita esto para poder producir?**
> Si la respuesta es sí, es un gasto. Si no, es otra cosa.

| Movimiento | ¿Utilidad? | ¿Caja? | ¿Patrimonio? | Por qué |
|---|:---:|:---:|:---:|---|
| Venta entregada | ▲ sube | ▲ sube | ▲ sube | Es el ingreso del negocio |
| Compra de insumos | ▼ baja | ▼ baja | ▼ baja | Se consume para producir |
| Arriendo, servicios | ▼ baja | ▼ baja | ▼ baja | Sin eso no hay taller |
| Salario de la empleada | ▼ **baja** | ▼ baja | ▼ baja | Su trabajo produce |
| **Pro-labore** de la gerencia | ▼ **baja** | ▼ baja | ▼ baja | El trabajo propio también produce |
| Transferencia entre cuentas | — | ↔ neutra | — | La plata solo cambia de bolsillo |
| Compra de una prensa | — | ▼ baja | — | Cambia plata por un activo |
| **Anticipo recibido** | — | ▲ sube | — | Crea una **deuda** con el cliente |
| Adelanto a la empleada | — | ▼ baja | — | Crea una **cuenta por cobrar** |
| Aporte de capital | — | ▲ sube | ▲ sube | Plata que entra desde afuera |
| **Retiro de utilidades** | — | ▼ baja | ▼ baja | Reparte una ganancia ya generada |

---

## 3. Anticipos, causación y caja libre

### 3.1 El anticipo no es un ingreso

La política del negocio es **50% al confirmar el pedido y 50% contra entrega**. Eso protege el
flujo de caja, pero introduce una confusión peligrosa: la plata del anticipo está en la cuenta
y **parece** ganancia.

> **[RN-05](03-requisitos-y-bdd.md#rn-05).** Un anticipo es un **pasivo**: una deuda con el cliente, porque el negocio se
> comprometió a entregar algo que todavía no ha hecho. Solo al entregar se convierte en venta.

### 3.2 El caso que rompe la intuición: el pedido que cruza de mes

> **Marzo.** Un colegio encarga 200 camisetas por **$3.000.000**. Se cobra el anticipo del 50%:
> **$1.500.000**. Se compra el material de contado: **$1.200.000**. La entrega queda pactada
> para el **4 de abril**.

| | Caja (plata que se movió) | Causación (lo que se ganó) |
|---|---|---|
| **Marzo** | +$1.500.000 − $1.200.000 = **+$300.000** | **$0** — no se ha entregado |
| **Abril** (entrega y cobro del saldo) | **+$1.500.000** | $3.000.000 − $1.200.000 = **+$1.800.000** |

Marzo cierra con plata en el bolsillo y **cero ganancia**. Abril produce toda la ganancia del
pedido. Si se mira solo la caja, marzo parece flojo y abril parece extraordinario: ninguna de
las dos lecturas es cierta.

**Lo que esto enseña:** ese $1.500.000 en Nequi durante marzo **no es del negocio todavía**.
Gastarlo antes de entregar significa que, cuando llegue el momento de comprar el material del
siguiente pedido, la plata no va a estar.

### 3.3 Caja libre — la cifra que hoy no existe en ninguna parte

```
CAJA LIBRE = Saldo total en todas las cuentas
           − Anticipos de pedidos aún no entregados
           − Gastos fijos comprometidos del mes en curso
```

**Ejemplo.**

| Concepto | Valor |
|---|---:|
| Efectivo | $340.000 |
| Nequi | $2.150.000 |
| Bancolombia | $1.510.000 |
| **Saldo total** | **$4.000.000** |
| − Anticipos de pedidos no entregados | −$1.500.000 |
| − Gastos fijos pendientes del mes (arriendo, servicios, internet) | −$980.000 |
| **= CAJA LIBRE** | **$1.520.000** |

Hay $4.000.000 en las cuentas, pero solo **$1.520.000** se pueden comprometer sin arriesgar el
negocio.

### 3.4 Alertas derivadas

| Alerta | Condición | Por qué importa |
|---|---|---|
| 🔴 Caja libre negativa | `caja_libre < 0` | Ya se está usando plata de anticipos, incluso si el mes es rentable |
| 🟠 Anticipos por encima del saldo | `anticipos > saldo_total` | Se gastó plata comprometida |
| 🟠 Pedido estancado | Anticipo cobrado hace 15+ días sin entregar | El pasivo envejece y el cliente espera |
| 🟡 Concentración de anticipos | Un solo cliente concentra más del 40% | Si cancela, el golpe es grande |

---

## 4. Las dos fechas de todo registro

| Campo | Qué es | Editable | Manda en |
|---|---|:---:|---|
| `fecha_movimiento` | Cuándo ocurrió de verdad | ✅ obligatoria | **Todos los reportes** |
| `creado_en` | Cuándo se digitó en el sistema | ❌ automática | Auditoría |

Si se vende un sábado y se registra el lunes, el reporte debe contarlo el **sábado**, pero la
auditoría debe saber que se digitó el lunes. Guardar una sola fecha obliga a escoger entre
reportes que mienten y auditoría que miente.

**Alerta de registro tardío ([RN-14](03-requisitos-y-bdd.md#rn-14)).** Cuando `creado_en − fecha_movimiento > 7 días`, el
movimiento se marca. No es un error: es la señal temprana de que el hábito de registro se está
aflojando, que es la forma número uno en que estos sistemas mueren.

```
Índice de puntualidad del mes = Movimientos registrados dentro de 48 h ÷ Movimientos totales
```

Meta: superior al 80%.

---

## 5. Anticipo mínimo — el validador que protege cada pedido

### 5.1 El problema

El 50% de anticipo **no siempre alcanza para pagar el material**:

| Producto | Margen | El costo es | ¿El 50% lo cubre? | Faltante |
|---|---:|---:|:---:|---:|
| Llavero acrílico | 70% | 30% del precio | ✅ | sobra 20 pts |
| Mug estampado | 53% | 47% del precio | ✅ | sobra 3 pts |
| Camiseta DTF | 39% | 61% del precio | ❌ | **faltan 11 pts** |
| Rompecabezas A4 | 35% | 65% del precio | ❌ | **faltan 15 pts** |

En los pedidos de margen bajo, **el negocio financia al cliente** para que compre su propio
material. No se nota porque al final el pedido sí deja ganancia — pero mientras tanto la plata
salió del bolsillo del negocio.

### 5.2 La fórmula

```
Anticipo mínimo %  = Costo directo del pedido ÷ Valor total del pedido
Anticipo sugerido  = redondear hacia arriba a múltiplo de 5, con 5 puntos de holgura
Faltante en pesos  = Costo directo − (Anticipo configurado % × Valor total)
```

### 5.3 Ejemplo

> Pedido de rompecabezas: **$520.000**. Costo directo: **$338.000** (65%).
>
> - Anticipo mínimo: 338.000 ÷ 520.000 = **65%**
> - Anticipo configurado (50%): $260.000
> - **Faltante: $78.000**
> - Sugerencia del sistema: **70%**
>
> Mensaje en pantalla: *"Este pedido tiene 35% de margen. Con el 50% de anticipo pones $78.000
> de tu bolsillo hasta la entrega. Anticipo sugerido: 70%."*

---

## 6. Inversiones, retiros, pro-labore y patrimonio

### 6.1 Las tres salidas de plata que no son iguales

| Tipo | Ejemplo | ¿Utilidad? | ¿Caja? | ¿Patrimonio? |
|---|---|:---:|:---:|:---:|
| **Gasto** | Arriendo, tinta, papel transfer | ▼ | ▼ | ▼ |
| **Inversión** | Prensa de calor de $2.500.000 | — | ▼ | — cambia forma |
| **Retiro de utilidades** | $500.000 para uso personal | — | ▼ | ▼ |

### 6.2 Por qué el retiro no es gasto (RN-07)

Un gasto es lo que el negocio **consume para poder operar**. Sin arriendo no hay taller; sin
tinta no hay producción. Pero si no se retira plata, el negocio opera exactamente igual: el
retiro no produce nada, es el reparto de una ganancia ya generada.

**El daño de registrarlo mal.** Mes con ventas de $8.000.000, gastos reales de $5.000.000 y un
retiro de $2.000.000:

| | Cálculo | Utilidad | Margen |
|---|---|---:|---:|
| ❌ Retiro tratado como gasto | 8.000.000 − 5.000.000 − 2.000.000 | $1.000.000 | 12,5% |
| ✅ Retiro fuera del resultado | 8.000.000 − 5.000.000 | $3.000.000 | 37,5% |

Con el cálculo malo se decide mal: subir precios sin necesidad, rechazar un pedido rentable,
concluir que nunca se podrá contratar. Y algo directamente absurdo: **entre más se retire, peor
se ve el negocio**, cuando el retiro no cambia en nada qué tan bueno es. El error simétrico
también existe: retirando poco, el negocio se ve mejor de lo que realmente es.

### 6.3 El pro-labore — la trampa del trabajo invisible (RN-08)

Quien dirige el negocio también estampa, borda y atiende. **Ese trabajo es un costo real**,
pero al cobrarse en forma de retiro queda invisible, y el negocio parece rentable porque tiene
mano de obra gratis.

Por eso el retiro se separa en dos:

| Concepto | Definición | ¿Es gasto? |
|---|---|:---:|
| **Pro-labore** | Lo que costaría contratar a alguien que haga ese mismo trabajo | ✅ Sí |
| **Distribución** | Lo que se saca por encima de eso, por ser propietario | ❌ No |

**El mismo mes, bien calculado:**

| | Utilidad | Margen |
|---|---:|---:|
| Sin separar | $3.000.000 | 37,5% |
| Con pro-labore de $1.500.000 | **$1.500.000** | **18,75%** |

El retiro de $2.000.000 se descompone en $1.500.000 de pro-labore (gasto) y $500.000 de
distribución (no gasto).

> **Cómo fijar el pro-labore.** Preguntarse: *"¿cuánto tendría que pagarle a alguien para que
> hiciera lo que yo hago en el taller?"* Ese es el número. No es lo que se necesita para vivir;
> es lo que vale el trabajo.

### 6.4 Patrimonio y descapitalización

```
Patrimonio = Aportes − Retiros de distribución + Utilidades acumuladas
```

**Ejemplo de doce meses:**

| Concepto | Valor |
|---|---:|
| Aportes de capital | $3.000.000 |
| Utilidades acumuladas | $18.000.000 |
| Retiros de distribución | −$14.000.000 |
| **Patrimonio** | **$7.000.000** |

Eso es lo que se ha construido. Si se hubieran retirado $20.000.000, el patrimonio quedaría en
$1.000.000: **descapitalización, aunque cada mes haya sido rentable**.

**Alerta automática (RN, [CU-24](02-casos-de-uso.md#cu-24)):**

```
SI  Retiros de distribución de los últimos 12 meses  >  Utilidades de los últimos 12 meses
ENTONCES alertar: "Estás retirando más de lo que el negocio genera."
```

Es peligrosa justamente porque no se nota: cada mes puede ser rentable mientras el negocio se
vacía por dentro.

### 6.5 El límite de horas de una semana (RN-20)

Las horas del mes son la base del valor de la hora ordinaria de cada empleada
([06 §6.1](06-nomina-y-capacidad-de-pago.md#61-fórmulas)) y de lo que una hora de más cuesta de verdad. **Unas horas imposibles no dan
un error: dan una hora barata**, y con ella una liquidación que parece sana y un recargo que no
cubre lo que se trabajó.

Por eso hay un límite, y **lo define Gerencia desde la aplicación**:

```
Horas del mes como máximo = Límite semanal × 52 ÷ 12
```

| Límite semanal | Horas del mes como máximo |
|---:|---:|
| 48 horas | 208,00 |
| 44 horas | 190,67 |
| 42 horas | 182,00 |

- **Rige para las dos**: las horas productivas del pro-labore y las horas pactadas de cada
  empleada. Una semana tiene las mismas horas para quien sea.
- **El redondeo es `HALF_UP` a dos decimales**, que es lo que guarda la columna.
- **Por omisión son 48 horas**, y el valor vive en la configuración de cada ambiente: así el día
  que la jornada legal baje, nadie tiene que tocar código. Gerencia lo cambia cuando quiera, y
  **nada se sobrescribe**: cada definición queda, con quién la escribió y desde cuándo rige.
- **Es un límite, no una jornada.** No dice cuánto trabaja nadie: dice hasta dónde puede llegar un
  número que, más alto, haría mentir una tarifa.

---

## 7. Costeo por producto y margen

### 7.1 Costo unitario

```
Costo unitario = Costo del insumo
               + Costo de consumibles (tinta, papel transfer, hilo, energía)
               + Costo de mano de obra
```

**La mano de obra se escribe en pesos, una vez por producto.** No se calcula de unos minutos por
una tarifa: quien conoce el taller sabe lo que le cuesta hacer una camiseta, y pedirle que cronometre
cada producto es pedirle un dato que no tiene y que cambia con el día. Un número en pesos es el
mismo dato, dicho donde se sabe.

**El tiempo no se pide en ninguna parte del catálogo.** Ni los minutos de la persona, ni los de la
máquina: la aplicación no los pregunta, no los guarda y no los muestra. Lo que el tiempo aportaba
—cuánto vale una hora de trabajo— ya está dentro del costo de mano de obra de cada producto.

### 7.2 Los dos márgenes

```
Margen en pesos     = Precio de venta − Costo unitario
Margen porcentual   = Margen en pesos ÷ Precio de venta
```

**El margen es del producto, no de la hora.** La pregunta que responde es cuánto deja cada unidad
que sale por la puerta, y esa es la que se toma cuando hay que subir un precio o dejar de hacer
algo.

| Producto | Costo | Precio | Margen $ | Margen % |
|---|---:|---:|---:|---:|
| Llavero acrílico | $2.100 | $7.000 | **$4.900** | 70% |
| Mug estampado | $8.400 | $18.000 | **$9.600** | 53% |
| Camiseta DTF | $19.500 | $32.000 | **$12.500** | 39% |
| Rompecabezas A4 | $14.200 | $22.000 | **$7.800** | 35% |
| Bordado (logo mediano) | $11.800 | $25.000 | **$13.200** | 53% |

**Lectura del cuadro.** Las dos columnas no dicen lo mismo y conviene mirar las dos: por
porcentaje el llavero es el mejor del taller, y en pesos es el que menos deja de todos. El
rompecabezas queda último por las dos, y eso es lo que pide revisarle el precio.

> **Conclusión accionable:** se prioriza por **margen en pesos**, que es lo que de verdad entra a
> la caja por unidad, y se usa el porcentual para ver cuál producto está más apretado contra su
> costo.

### 7.3 Evitar el doble conteo (RN-17)

El costeo unitario carga la mano de obra como costo. La nómina y el pro-labore la cargan otra vez
como gasto mensual. **Sumar ambos contaría doble.**

Regla:

> **El costeo sirve para decidir precios. La nómina y el pro-labore determinan el resultado del
> mes.** El estado de resultados usa los segundos, nunca los primeros.

---

## 8. Cierre mensual

> **[RN-16](03-requisitos-y-bdd.md#rn-16).** Un mes cerrado no cambia retroactivamente.

Al cerrar un mes se congela un snapshot con: ingresos causados, costos directos, gastos
operativos, pro-labore, nómina, utilidad causada, flujo de caja, caja libre y anticipos
abiertos.

Si después se registra un movimiento con fecha de un mes cerrado:

1. Se acepta el registro (nunca se pierde información).
2. Se marca como **ajuste de período anterior**.
3. El reporte histórico del mes cerrado **no cambia**.
4. El ajuste aparece en el mes corriente, identificado.

Esto evita la situación en que un reporte impreso en marzo ya no coincide con lo que el sistema
muestra en julio.

---

## 9. Catálogo de KPIs

### 9.1 Resultado

| KPI | Fórmula | Frecuencia |
|---|---|---|
| Ingresos causados | Σ ventas de pedidos entregados en el período | Mensual |
| Costo directo | Σ costo de los pedidos entregados | Mensual |
| Margen bruto | Ingresos − Costo directo | Mensual |
| Margen bruto % | Margen bruto ÷ Ingresos | Mensual |
| Gastos operativos | Σ gastos no directos (incluye pro-labore y nómina) | Mensual |
| **Utilidad causada** | Margen bruto − Gastos operativos | Mensual |
| Margen neto % | Utilidad causada ÷ Ingresos | Mensual |
| Utilidad acumulada del año | Σ utilidades causadas del año | Anual |
| **Promedio mensual de ganancias** | Utilidad acumulada ÷ Meses cerrados | Anual |
| Proyección anual | Promedio mensual × 12 | Anual |

### 9.2 Liquidez

| KPI | Fórmula |
|---|---|
| Saldo total | Σ saldos de todas las cuentas |
| Anticipos por devengar | Σ anticipos de pedidos no entregados |
| Gastos fijos comprometidos | Σ gastos fijos pendientes del mes |
| **Caja libre** | Saldo total − Anticipos − Gastos fijos comprometidos |
| Flujo de caja del mes | Entradas − Salidas del período |
| Cobertura de gastos fijos | Caja libre ÷ Gastos fijos mensuales (en meses) |

### 9.3 Estructura y patrimonio

| KPI | Fórmula |
|---|---|
| Patrimonio | Aportes − Distribuciones + Utilidades acumuladas |
| Activos | Σ valor de compra de activos en uso |
| Tasa de retiro | Distribuciones 12 meses ÷ Utilidades 12 meses |
| Reserva acumulada | Saldo del sobre de reserva |

### 9.4 Operación

| KPI | Fórmula |
|---|---|
| Ticket promedio | Ingresos ÷ Número de pedidos entregados |
| Índice de puntualidad | Movimientos registrados en 48 h ÷ Total |
| Antigüedad de anticipos | Días promedio entre anticipo y entrega |

---

## 10. Punto de equilibrio

```
Margen de contribución % = (Ingresos − Costo directo) ÷ Ingresos

Punto de equilibrio $   = Gastos fijos mensuales ÷ Margen de contribución %

Punto de equilibrio     = Punto de equilibrio $ ÷ Ticket promedio
en número de pedidos
```

**Ejemplo.**

| Concepto | Valor |
|---|---:|
| Gastos fijos mensuales (arriendo, servicios, internet, pro-labore) | $2.480.000 |
| Margen de contribución | 52% |
| **Punto de equilibrio en ventas** | **$4.769.231** |
| Ticket promedio | $186.000 |
| **Pedidos necesarios al mes** | **≈ 26** |

Interpretación: por debajo de $4.769.231 en ventas entregadas, el mes da pérdida. Cada peso
vendido por encima de ese punto deja 52 centavos de utilidad.

---

## 11. La regla de los 4 sobres

Cada peso que **entra en efectivo** se reparte de inmediato en cuatro destinos. No es una
metáfora: el sistema lleva el saldo de cada sobre.

| Sobre | Para qué | % sugerido inicial |
|---|---|---:|
| 🟦 **Costo directo** | Insumos del próximo pedido | 45% |
| 🟨 **Gastos fijos** | Arriendo, servicios, internet, pro-labore, nómina | 25% |
| 🟩 **Reserva** | Colchón del negocio e imprevistos | 10% |
| 🟥 **Retiro** | Distribución para la propiedad | 20% |

> **Todos los porcentajes son parametrizables** y cada cambio queda registrado con su fecha de
> vigencia. El 10% de reserva es una sugerencia de arranque, no una imposición.

**Meta de la reserva:** acumular el equivalente a **3 meses de gastos fijos**. Con gastos fijos
de $2.480.000, la meta es $7.440.000. Mientras no se alcance, el sistema muestra el avance.

---

## 12. Ejemplo integral — septiembre completo

Un mes de punta a punta, con todas las reglas aplicadas. Este es el ejemplo que sirve para
verificar a mano que el sistema calcula bien.

### 12.1 Estado de resultados (causación)

| Concepto | Valor |
|---|---:|
| Ventas de pedidos **entregados** en septiembre | $7.850.000 |
| − Costo directo de esos pedidos | −$3.612.000 |
| **= Margen bruto** | **$4.238.000** (54%) |
| − Arriendo | −$800.000 |
| − Servicios públicos | −$180.000 |
| − Internet y plan de datos | −$150.000 |
| − Publicidad | −$120.000 |
| − Mantenimiento de equipos | −$90.000 |
| − Transporte | −$140.000 |
| − **Pro-labore de la gerencia** | −$1.500.000 |
| **= UTILIDAD CAUSADA** | **$1.258.000** (16,0%) |

### 12.2 Flujo de caja del mismo mes

| Concepto | Valor |
|---|---:|
| Saldo inicial (1 de septiembre) | $3.900.000 |
| + Saldos cobrados por entregas de septiembre | +$3.925.000 |
| + Anticipos recibidos de pedidos de octubre | +$2.100.000 |
| − Compra de insumos (incluye material de pedidos de octubre) | −$3.900.000 |
| − Gastos operativos pagados | −$1.480.000 |
| − Retiro de pro-labore | −$1.500.000 |
| − Retiro de distribución | −$400.000 |
| **= Flujo de caja del mes** | **−$1.255.000** |
| **Saldo final (30 de septiembre)** | **$2.645.000** |

> **El mes fue rentable y la caja bajó.** Utilidad de $1.258.000 con flujo de caja de
> −$1.255.000. La explicación: en septiembre se compró el material de los pedidos que se
> entregan en octubre. Es una situación normal y sana, pero sin las dos vistas parece un
> desastre o un milagro, según cuál se mire.

### 12.3 Caja libre al cierre

| Concepto | Valor |
|---|---:|
| Saldo total en cuentas | $2.645.000 |
| − Anticipos de pedidos no entregados | −$2.100.000 |
| − Gastos fijos comprometidos pendientes | $0 |
| **= CAJA LIBRE** | **$545.000** |

El mes dejó $1.258.000 de utilidad, pero solo hay **$545.000 realmente disponibles**. Los
$2.100.000 restantes pertenecen a clientes que todavía esperan su pedido.

### 12.4 Los 4 sobres sobre las entradas del mes

Entradas totales de caja: **$6.025.000**.

| Sobre | % | Asignado | Usado | Diferencia |
|---|---:|---:|---:|---:|
| 🟦 Costo directo | 45% | $2.711.250 | $3.900.000 | **−$1.188.750** |
| 🟨 Gastos fijos | 25% | $1.506.250 | $2.980.000 | **−$1.473.750** |
| 🟩 Reserva | 10% | $602.500 | $0 | +$602.500 |
| 🟥 Retiro | 20% | $1.205.000 | $400.000 | +$805.000 |
| | | $6.025.000 | $7.280.000 | **−$1.255.000** |

**Lectura del cuadro.** Los porcentajes configurados no reflejan la realidad: los gastos fijos
consumieron el 49% de las entradas, no el 25%. Dos caminos posibles, y el sistema los muestra:

1. **Subir ventas** hasta que el 25% cubra los gastos fijos reales → se necesitan entradas de
   $11.920.000 mensuales.
2. **Recalibrar los sobres** a la realidad actual y aceptar que la reserva y el retiro tienen
   que ser menores por ahora.

Ninguna de las dos es obvia sin este cuadro. Ese es el punto de tenerlo.

### 12.5 Indicadores del mes

| Indicador | Valor |
|---|---:|
| Margen bruto | 54,0% |
| Margen neto | 16,0% |
| Ticket promedio (42 pedidos entregados) | $186.905 |
| Horas pagadas | 160 |
| Punto de equilibrio | $4.871.272 |
| Ventas sobre el punto de equilibrio | +$2.978.728 |
| Índice de puntualidad de registro | 86% |

El punto de equilibrio sale de los datos de este mes con la fórmula del [§10](#10-punto-de-equilibrio): $2.630.000 de
gastos fijos —arriendo, servicios, internet y pro-labore— entre el 53,99 % de margen de
contribución. **No es el $4.769.231 del ejemplo del [§10](#10-punto-de-equilibrio)**, que tiene sus propios números.

---

## 13. Verificación

Cada fórmula de este documento tiene su prueba automática en el dominio de `prisma_api`, en Java.
Los valores del ejemplo de la sección 12 se usan como **juego de datos de prueba oficial**
(ver [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md) [§4](12-pruebas-y-calidad.md#4-juego-de-datos-de-prueba-oficial)).

Comprobación de consistencia que debe cumplirse siempre:

```
Saldo final = Saldo inicial + Flujo de caja del mes
Caja libre  = Saldo total − Anticipos por devengar − Gastos fijos comprometidos
Σ Asignado a los 4 sobres = Entradas de caja del mes
Σ Diferencias de los 4 sobres = Flujo de caja del mes
```

Si alguna de estas igualdades falla, hay un error de registro o de cálculo.

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](02-casos-de-uso.md "02 · Casos de uso") · [03](03-requisitos-y-bdd.md "03 · Requisitos, reglas de negocio y escenarios BDD") · [04](04-modelo-de-datos.md "04 · Modelo de datos") · [06](06-nomina-y-capacidad-de-pago.md "06 · Nómina y capacidad de pago") · [07](07-arquitectura.md "07 · Arquitectura técnica") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [20](20-contrato-de-api.md "20 · Contrato de la API") · [23](23-diagramas-de-casos-de-uso.md "23 · Diagramas de los casos de uso") · [Contrato](../contrato/README.md "Contrato de la API · v0.37.0") · [CLAUDE](../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [04 · Modelo de datos](04-modelo-de-datos.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [06 · Nómina y capacidad de pago](06-nomina-y-capacidad-de-pago.md)
