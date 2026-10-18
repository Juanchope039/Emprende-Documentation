# 13 · Respaldo y exportación

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.4.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/13-respaldo-y-exportacion.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-17 | [Base de datos](INDICE.md#etiqueta-base-de-datos) · [Datos personales](INDICE.md#etiqueta-datos-personales) |

> **Construcción: en el [Sprint 8](08-plan-de-desarrollo.md#sprint-8), no después del go-live.** El [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) metió el respaldo al plan,
> en las tareas [8.13](08-plan-de-desarrollo.md#tarea-8-13) a [8.17](08-plan-de-desarrollo.md#tarea-8-17), y retiró del 14 la deuda [D-05](14-roadmap-e-ideas.md#d-05) y la idea 01. Lo que este documento
> describe se construye, no se difiere.
>
> **Lo único que sigue diferido es restaurar**: el procedimiento y su simulacro son [D-06](14-roadmap-e-ideas.md#d-06), y están en
> el [13 §9](#9-fuera-de-alcance-de-esta-versión). Un respaldo que nunca se restauró sigue siendo una suposición; lo que cambia es que
> ahora existirá el archivo.

---

## 1. Niveles de respaldo

| Nivel | Qué cubre | Frecuencia | Quién lo hace | Estado |
|---|---|---|---|---|
| 1 · Proveedor | Toda la base de datos de prod | Diaria automática | Supabase | ✅ Desde el día 1 |
| 2 · Exportación | Base completa, un mes, un rango o una tabla | A demanda o programada | Gerencia | ⬜ [Sprint 8](08-plan-de-desarrollo.md#sprint-8), tareas [8.13](08-plan-de-desarrollo.md#tarea-8-13) a [8.17](08-plan-de-desarrollo.md#tarea-8-17) |
| 3 · Código | Los dos proyectos, `prisma_front` y `prisma_api` | Cada cambio | Control de versiones | ✅ Desde el día 1 |

El nivel 1 protege contra fallas técnicas. **El nivel 2 protege contra algo distinto:** la
dependencia de un proveedor. Un archivo propio, en un disco propio, es lo que garantiza que la
información del negocio siga siendo del negocio pase lo que pase.

### 1.1 El respaldo es por ambiente, y solo uno importa

Ahora hay cuatro bases, una por ambiente ([`ADR-013`](adr/ADR-013-cuatro-ambientes.md)). Tratarlas
igual sería caro y, peor, confundiría lo que hay que proteger de verdad.

| Ambiente | Qué respaldo necesita | Por qué |
|---|---|---|
| **prod** | Los tres niveles, completos | Es el único con datos reales. Lo que se pierda ahí no está en ninguna otra parte |
| **pre-prod** | Ninguno. Se vuelve a sembrar | Sus datos son la misma siembra anonimizada de uat ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)) |
| **uat** | Ninguno. Se vuelve a sembrar | Sus datos son una siembra anonimizada (1.2). Si se pierden, se generan otra vez |
| **qa** | Ninguno. Es desechable | Migraciones y semilla reproducible lo devuelven al mismo estado: [`16-base-de-datos-y-snapshots.md`](16-base-de-datos-y-snapshots.md) |
| **dev** | Ninguno. Es desechable | Lo mismo, y además cada quien tiene la suya |

> **Respaldar un ambiente desechable no es prudencia, es ruido.** Cuatro juegos de respaldos
> diarios cuestan plata y, sobre todo, obligan a mirar cuatro veces para saber si corrió el que
> importa. El que hay que vigilar es uno solo: el de prod.

Consecuencia práctica: la retención de 12 archivos del punto 5, la programación automática del
punto 6 y el historial del punto 7 **solo operan en prod**. En los demás ambientes la exportación
se puede ejecutar —hay que probar que funciona— pero no se programa ni se conserva.

### 1.2 Lo que sale de prod hacia otro ambiente va anonimizado

Copiar datos de prod hacia uat es la forma más rápida de tener datos realistas, y también la más
rápida de sacar datos personales del único sitio donde tienen tratamiento declarado. Por eso
[`11-riesgos-y-proteccion-de-datos.md`](11-riesgos-y-proteccion-de-datos.md) ([R-23](11-riesgos-y-proteccion-de-datos.md#r-23)) deja escrito
que **copiar de prod a otro ambiente no existe como procedimiento**: el camino normal para uat es
sembrar datos anonimizados. Esta sección no abre esa puerta; fija qué pasa si alguna vez hay que
cruzarla.

> **Un respaldo de prod nunca se restaura tal cual en otro ambiente.** Pasa antes por
> anonimización, y la anonimización corre **antes de que el archivo salga de prod**. Un archivo con
> datos reales guardado «un momentico» en uat es exactamente la fuga que se quiere evitar.

| Dato | Qué se hace |
|---|---|
| Nombres y apellidos de empleadas y de clientes | Se reemplazan por nombres generados |
| Documento de identidad | Se reemplaza conservando el formato |
| Teléfono y correo de clientes | Se reemplazan |
| Salarios, adelantos y desprendibles | Se escalan con un mismo factor, para que las cifras sigan siendo coherentes entre sí |
| Contraseñas | No viajan. El ambiente destino siembra sus propios usuarios de prueba |
| Cifras del negocio: ventas, costos, movimientos | Se conservan. Son lo que hace útil al ambiente |

Nombres completos, documentos y salarios son datos personales bajo la **Ley 1581 de 2012**, y su
tratamiento ya está fijado en [`11-riesgos-y-proteccion-de-datos.md`](11-riesgos-y-proteccion-de-datos.md) [§3](11-riesgos-y-proteccion-de-datos.md#3-protección-de-datos-personales).
El archivo anonimizado también lleva manifiesto, y su `ambiente` dice de dónde salió (4.1): un
respaldo que no dice eso puede terminar restaurado en el sitio equivocado.

---

## 2. Alcance seleccionable

| Opción | Contenido | Uso típico |
|---|---|---|
| **Total** | Todas las tablas, todo el histórico | Respaldo periódico completo |
| **Por mes** | Movimientos, pedidos y nómina de un mes | Archivo mensual, entrega al contador |
| **Por rango** | Entre dos fechas | Revisión de un período específico |
| **Una tabla** | Una sola entidad completa | Análisis puntual |

### 2.1 La descarga del Inicio es una exportación parcial

El Inicio tiene su propio botón **Descargar** ([RF-96](03-requisitos-y-bdd.md#rf-96)): baja en CSV o PDF lo que esa pantalla ya
está mostrando — las tres cifras del mes, los saldos de cuentas al corte, los últimos doce meses,
las alertas activas y los pedidos por entregar. Es la misma maquinaria de exportación que
describe este documento, con un alcance mucho más estrecho.

| Aspecto | Respaldo (nivel 2) | Descarga del Inicio |
|---|---|---|
| Caso de uso | [CU-22](02-casos-de-uso.md#cu-22) · Exportar respaldo | [CU-37](02-casos-de-uso.md#cu-37) · Descargar lo que muestra una pantalla |
| Qué baja | Tablas completas, fila por fila | Cifras ya calculadas de una pantalla |
| Para qué | Que la información siga siendo del negocio | Llevarse un dato a una reunión o a una hoja de cálculo |
| Alcance | Total, por mes, por rango o una tabla | Lo que el Inicio muestra en ese momento |
| Formato | ZIP con CSV, Excel, JSON | CSV o PDF |
| Manifiesto | Obligatorio, con `sha256` y totales de control | No lleva: no pretende ser verificable ni restaurable |
| ¿Sustituye al otro? | — | **No.** Con esto no se restaura nada |

**Por qué conviven en lugar de fusionarse.** Un respaldo tiene que ser completo y verificable,
aunque resulte incómodo de leer; un reporte tiene que ser legible, aunque esté incompleto.
Pedirle las dos cosas al mismo archivo produce uno que no sirve para ninguna. La regla que las
separa es corta: si el archivo puede reconstruir el estado del sistema, es respaldo y se rige
por todo lo que sigue; si solo responde una pregunta del momento, es descarga de pantalla.

Por eso el PDF aparece aquí y no en la tabla de formatos del punto 3. Un respaldo no se lee, se
restaura, y el PDF no restaura nada. Una descarga de pantalla sí se lee, y a veces se imprime.

Lo que ambas sí comparten: el acceso es exclusivo de Gerencia, como fija el punto 7 — la
descarga del Inicio incluye utilidad, caja y patrimonio —, y cada descarga queda registrada en
la bitácora, como fija el punto 5, **y como una fila de `exportaciones`**, la tabla del punto 8.
Sacar información del sistema siempre deja rastro, sin importar el tamaño del archivo. Esa
promesa obligó a ampliar los dos `CHECK` de esa tabla; el punto 8 explica por qué.

---

## 3. Formatos

| Formato | Contenido | Para qué |
|---|---|---|
| **ZIP con CSV** | Un archivo `.csv` por tabla | Abrir en cualquier programa; formato duradero |
| **Excel** | Un libro con una hoja por tabla | Lectura humana, entrega al contador |
| **JSON** | Estructura completa con relaciones | Restauración fiel del estado |

> **El CSV es el formato de referencia.** Es el único que seguirá siendo legible dentro de
> quince años sin depender de ningún programa en particular. El Excel es por comodidad y el
> JSON por fidelidad técnica; el CSV es por permanencia.

**Los tres bajan dentro de un ZIP**, junto al `manifiesto.json` del punto 4. El manifiesto es un
archivo aparte, y un libro de Excel o un JSON suelto no podría llevarlo. Qué tablas entran en el
total y en «una tabla»: las 27 del negocio, no las cinco de funcionamiento —`nonces_vistos`,
`peticiones_idempotentes`, `sesiones`, `schema_version` y `respaldo_programacion`—.

`respaldo_programacion` ([04 §4.14](04-modelo-de-datos.md#414-la-programación-del-respaldo)) es la quinta desde la tarea [8.14](08-plan-de-desarrollo.md#tarea-8-14), y por la misma razón que las
otras cuatro: no es historia de nadie. Y por una propia: un respaldo que al restaurarse devolviera
la programación vieja encendería solo un trabajo que nadie pidió. Así las que se respaldan siguen
siendo 27.

### 3.1 Los datos anulados también se exportan

La exportación incluye las filas anuladas, con sus columnas de anulación completas. Un respaldo
que omitiera lo anulado contradiría el principio de solo escritura: la historia completa
incluye los errores y sus correcciones.

---

## 4. Manifiesto de integridad

Todo archivo de exportación incluye un `manifiesto.json`:

```json
{
  "generado_en": "2026-09-30T18:42:11-05:00",
  "generado_por": "gerencia@prisma.com",
  "alcance": { "tipo": "mes", "anio": 2026, "mes": 9 },
  "version_esquema": "1.4.0",
  "version_api": "1.4.2",
  "ambiente": "prod",
  "zona_horaria": "America/Bogota",
  "archivos": [
    { "nombre": "movimientos.csv", "registros": 412,
      "sha256": "3f9a...c1" },
    { "nombre": "pedidos.csv", "registros": 42,
      "sha256": "8b21...7e" }
  ],
  "totales_control": {
    "suma_movimientos": 18420500,
    "utilidad_causada": 1258000,
    "caja_libre": 545000
  }
}
```

### 4.1 Para qué sirve cada parte

| Campo | Por qué está |
|---|---|
| `sha256` por archivo | Detecta si un archivo se corrompió o fue alterado |
| `registros` por archivo | Detecta una exportación truncada |
| `version_esquema` | Permite saber si el respaldo corresponde a una estructura anterior |
| `version_api` | Dice qué versión de `prisma_api` armó el archivo. Es la que genera, así que es la que responde |
| `ambiente` | Dice de qué ambiente salió: `dev`, `qa`, `uat` o `prod` |
| `totales_control` | Permite verificar el respaldo **sin abrirlo**: si los totales no coinciden con los del sistema, algo falló |
| `zona_horaria` | Evita que las fechas se reinterpreten mal al abrir el archivo en otro lugar |

Los `totales_control` son la verificación más práctica: comparar tres números basta para saber
si un respaldo es confiable.

`ambiente` es consecuencia directa de 1.1: ahora hay cuatro bases y dos archivos abiertos uno al
lado del otro se ven idénticos. Sin ese campo, un respaldo de uat —con datos anonimizados y
cifras escaladas— puede pasar por uno de prod, y se restaura donde no era o se le cree a una cifra
que nunca fue real.

---

## 5. Generación y descarga

| Aspecto | Comportamiento |
|---|---|
| **Generación** | Automática según programación, o manual a demanda |
| **Descarga** | **Siempre manual.** El archivo queda disponible en el sistema y se baja con una acción explícita |
| **Envío** | Ninguno. No se envía por correo ni a servicios externos |
| **Acceso** | Exclusivo del rol Gerencia |
| **Retención** | Los últimos 12 archivos generados quedan disponibles; los anteriores se descartan |
| **Quién la aplica** | Un trabajo de `pg_cron` en la base, desde la tarea [8.14](08-plan-de-desarrollo.md#tarea-8-14) |
| **Auditoría** | Cada generación y cada descarga queda registrada en la bitácora |

**Lo que se descarta es el archivo, no la fila.** El [ADR-004](adr/ADR-004-base-solo-escritura.md) dice que nada se borra, y la fila de
`exportaciones` es información del negocio: es el historial que el punto 7 le ofrece a Gerencia y
el rastro que el 2.1 promete de cada descarga. Lo que pesa, y lo único que sobra, es el ZIP. Así
«disponible» quiere decir que el archivo sigue en el bucket, y un respaldo cuyo archivo ya se
descartó se distingue de uno que nunca existió: los dos responden `40400`, pero el historial
sigue diciendo que ese respaldo se generó y quién se lo llevó.

Este punto describe el **respaldo** ([CU-22](02-casos-de-uso.md#cu-22)). La descarga de pantalla (2.1, [CU-37](02-casos-de-uso.md#cu-37)) se genera y se
baja en el mismo acto, no se guarda para después y no entra en la retención de 12 archivos; de
este punto solo hereda la última fila, la auditoría.

**El archivo vive en el bucket `respaldos`**, privado y solo de ZIP, desde la tarea [8.14](08-plan-de-desarrollo.md#tarea-8-14). Como el
de los soportes, pasa siempre por la API y nunca se alcanza directo ([07 §1](07-arquitectura.md#1-stack)); a diferencia de
aquel, sus dos políticas preguntan por el tipo de usuario, porque el punto 7 reserva el respaldo a
Gerencia. La fila ya se lo niega a Operación, pero un objeto que pudiera leer sería la fuga que esa
fila no alcanza a tapar.

> **Por qué la descarga es manual y no hay envío automático.** Un respaldo contiene todo: datos
> de clientes, salarios, márgenes, utilidades. Enviarlo automáticamente a un correo lo pone en
> un servidor de terceros sin intervención humana. Que exista una acción explícita significa que
> alguien decidió, en un momento concreto, sacar esa información del sistema — y eso queda
> registrado.

### 5.1 Quién arma el archivo: la API

El diseño de la exportación no cambia; cambia quién lo ejecuta. Antes el cliente consultaba
Supabase y armaba el archivo en el navegador. Ahora **el front no habla con Supabase nunca**
([`ADR-018`](adr/ADR-018-front-sin-decisiones.md)), así que el trabajo queda entero del lado de
`prisma_api`.

| Paso | Quién | Qué pasa |
|---|---|---|
| 1 | `prisma_front` | Pide la exportación con su alcance y su formato |
| 2 | `prisma_api` | Abre la transacción con la identidad de quien pidió y lee lo que RLS le permita |
| 3 | `prisma_api` | Arma los archivos, calcula los `sha256`, escribe el `manifiesto.json` y la fila de `exportaciones` |
| 4 | `prisma_front` | Baja el archivo por la API, con una acción explícita de la usuaria |

Tres cosas mejoran con el cambio, y por eso vale la pena dejarlas escritas:

- **El manifiesto lo firma el servidor.** Un `sha256` calculado en el navegador certifica lo que el
  navegador quiso certificar; calculado en la API, certifica lo que salió de la base.
- **Los totales de control se calculan donde están los datos**, en la misma transacción que los
  leyó, así que no pueden quedar desfasados respecto del archivo.
- **Un respaldo grande deja de depender de la memoria del navegador.** La API lo arma y lo entrega.

**El archivo baja por partes.** Un respaldo total pasa de los 5 MB que caben en un archivo dentro del
sobre del contrato, así que `POST /respaldos/{id}/descarga` entrega un trozo por petición, hasta
3 MiB cada uno, con cuántos son y el `sha256` del ZIP entero. El front las pide en orden, las junta
sin interpretarlas y comprueba el `sha256`. **La primera parte es la acción explícita del punto 5**:
es la que marca el respaldo como bajado.

Y una que no cambia, que es la importante: **el alcance por rol del punto 7 lo sigue decidiendo
Row Level Security.** La API propaga la identidad de quien pide
([`ADR-012`](adr/ADR-012-identidad-a-postgres.md)); una exportación pedida por Operación no trae de
más porque **la base no se lo entrega**, no porque la API lo filtre después.

---

## 6. Programación automática

| Opción | Cuándo genera |
|---|---|
| Desactivada | Solo generación manual |
| Mensual | El día 1 de cada mes, del mes anterior completo |
| Al cerrar el mes | Automáticamente después de cada cierre mensual |

La opción recomendada es **al cerrar el mes**: el respaldo queda asociado a un estado
consistente y verificado, no a un momento arbitrario.

**Solo opera en prod** (1.1): en cualquier otro ambiente la programación no corre, y la API responde
que no opera aquí en vez de aceptarla.

**La elección vive en `respaldo_programacion`** ([04 §4.14](04-modelo-de-datos.md#414-la-programación-del-respaldo)), una fila por cambio, desde la tarea
[8.14](08-plan-de-desarrollo.md#tarea-8-14): de ella cuelga qué archivos existen, así que quién la cambió y desde cuándo es historia
del negocio. Mientras nadie elija rige **desactivada**. Si en este ambiente opera no se guarda ahí:
la base no sabe en cuál está, y lo decide el perfil de la API.

**Quién la ejecuta, desde la tarea [8.16](08-plan-de-desarrollo.md#tarea-8-16): la base es el reloj y la API la que trabaja.** La
base marca en `respaldo_pendiente` ([04 §4.15](04-modelo-de-datos.md#415-el-mes-que-toca-respaldar)) el mes que toca —con `pg_cron`, la misma extensión
con la que ya se purgan las claves de idempotencia, los nonce vistos y las sesiones vencidas, y con
un disparador del cierre mensual de la [6.8](08-plan-de-desarrollo.md#tarea-6-8) para la tercera opción, que es lo que la vuelve
recomendable—. El archivo lo arma la API, que es lo único que escribe un ZIP y lo único que habla con
el bucket.

**La API lo atiende cada día a las 00:10 de Bogotá**, no una vez al mes: el modo «al cerrar el mes»
marca cualquier día, así que un trabajo diario cumple los dos sin preguntar qué modo rige. Va detrás
del de la base, que corre a medianoche. Atiende **un mes por transacción**, para que el que falle no
revierta el que ya quedó, y el formato es el ZIP con CSV, que es el que se vuelve a leer sin nada
instalado.

**El archivo sube con la clave de servicio** ([ADR-066](adr/ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md)), porque a esa hora no hay sesión de la cual
tomar un token y las dos políticas del bucket piden uno que Storage pueda verificar. Está acotado a
subir: la descarga sigue siendo de la sesión que la pide. **A nombre de quién corre** es de la persona
que eligió la programación, así que el permiso de la fila lo sigue juzgando RLS como en cualquier
petición.

**Lo que falla se vuelve a intentar al día siguiente, solo.** La fila pendiente sigue sin atender,
que es la única señal visible de que un mes no se respaldó: nadie recibe un aviso.

> **Una programación que nadie mira genera archivos pesados igual.** La retención de doce del [13 §5](#5-generación-y-descarga)
> es lo único que la acota, y con los cuatro alcances y los tres formatos del [13 §2](#2-alcance-seleccionable) y [§3](#3-formatos) puede crecer
> más de lo previsto. Conviene mirar el tamaño del bucket en los primeros meses.

---

## 7. Alcance por rol

| Acción | Gerencia | Operación |
|---|:---:|:---:|
| Generar exportación | ✅ | ❌ |
| Descargar archivo | ✅ | ❌ |
| Descargar lo que muestra el Inicio (2.1) | ✅ | ❌ |
| Ver historial de exportaciones | ✅ | ❌ |
| Configurar la programación | ✅ | ❌ |

Restricción aplicada por Row Level Security, igual que el resto de datos sensibles. `prisma_api`
no la vuelve a implementar: la hereda, porque consulta con la identidad de quien pidió (5.1).

---

## 8. Tabla de registro

```sql
CREATE TABLE exportaciones (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alcance_tipo   TEXT NOT NULL CHECK (alcance_tipo IN ('total','mes','rango','tabla','pantalla')),
  alcance_desde  DATE,
  alcance_hasta  DATE,
  formato        TEXT NOT NULL CHECK (formato IN ('csv_zip','excel','json','csv','pdf')),
  archivo_path   TEXT NOT NULL,
  tamano_bytes   BIGINT NOT NULL,
  registros      INTEGER NOT NULL,
  sha256         TEXT NOT NULL,
  manifiesto     JSONB,
  generado_por   UUID NOT NULL REFERENCES usuarios(id),
  generado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  descargado_en  TIMESTAMPTZ,
  descargado_por UUID REFERENCES usuarios(id),
  CHECK (alcance_tipo = 'pantalla' OR manifiesto IS NOT NULL)
);
```

`descargado_en` y `descargado_por` quedan nulos hasta que alguien baja efectivamente el
archivo. Así se distingue entre respaldos generados y respaldos que realmente salieron del
sistema.

**Por qué se ampliaron los dos `CHECK`.** El punto 2.1 promete que la descarga de pantalla
también queda registrada, y con los valores anteriores no cabía ninguna fila: faltaba el alcance
y faltaba el formato.

| Valor nuevo | Columna | Por qué hacía falta |
|---|---|---|
| `'pantalla'` | `alcance_tipo` | Lo que baja no es todo, ni un mes, ni un rango, ni una tabla: es lo que una pantalla muestra en ese momento |
| `'csv'` | `formato` | `csv_zip` es un `.csv` por tabla dentro de un ZIP; una pantalla baja un solo archivo suelto |
| `'pdf'` | `formato` | Un respaldo no se lee, pero una descarga de pantalla sí, y a veces se imprime (2.1) |

`manifiesto` deja de ser obligatorio por lo mismo: la descarga de pantalla no lo lleva. El
`CHECK` final lo exige para todo lo demás, que es donde el manifiesto sí es la garantía de que el
archivo es verificable. `registros` sigue siendo obligatorio y cuenta las filas escritas: un PDF
de cifras del Inicio lleva `0`, y eso ya distingue un reporte de un respaldo vacío por error.

---

## 9. Fuera de alcance de esta versión

| Tema | Cuándo |
|---|---|
| Procedimiento de restauración documentado | Fase posterior · [D-06](14-roadmap-e-ideas.md#d-06) |
| Simulacro de restauración | Fase posterior · [D-06](14-roadmap-e-ideas.md#d-06) |
| Envío automático a almacenamiento externo | No previsto |
| Cifrado del archivo de exportación | Fase posterior |

**Lo que ya no está en esta tabla: construir el exportador.** Estuvo diferido hasta el [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md), que
lo metió al [Sprint 8](08-plan-de-desarrollo.md#sprint-8). Lo que queda fuera es restaurar, no exportar.

> **Nota honesta:** un respaldo que nunca se ha restaurado es una suposición, no una garantía. El
> procedimiento de restauración y su prueba siguen explícitamente diferidos en [D-06](14-roadmap-e-ideas.md#d-06), y eso es una
> limitación real de esta versión, no un olvido. Lo que cambia con el [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md) es que ahora existirá
> el archivo que algún día se restaure; mientras tanto, el respaldo diario automático del proveedor
> es la protección efectiva contra pérdida de datos.
>
> **Y la prueba [RE-01](12-pruebas-y-calidad.md#re-01) del 12 depende de [D-06](14-roadmap-e-ideas.md#d-06), no de esto.** Restaurar en uat el respaldo anonimizado
> de prod, una vez por trimestre, necesita el procedimiento escrito. Tener el exportador no la
> habilita.

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [01](01-vision-y-alcance.md "01 · Visión y alcance") · [02](02-casos-de-uso.md "02 · Casos de uso") · [04](04-modelo-de-datos.md "04 · Modelo de datos") · [07](07-arquitectura.md "07 · Arquitectura técnica") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [11](11-riesgos-y-proteccion-de-datos.md "11 · Riesgos y protección de datos") · [12](12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [16](16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [23](23-diagramas-de-casos-de-uso.md "23 · Diagramas de los casos de uso") · [Contrato](../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-008](adr/ADR-008-exportacion.md "ADR-008 · Exportación con descarga manual") · [ADR-047](adr/ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8") · [ADR-066](adr/ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md "ADR-066 · La clave de servicio también sube el respaldo que nadie pidió")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [12 · Pruebas y calidad](12-pruebas-y-calidad.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [14 · Roadmap e ideas](14-roadmap-e-ideas.md)
