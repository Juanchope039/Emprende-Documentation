# 11 · Riesgos y protección de datos

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.1.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/11-riesgos-y-proteccion-de-datos.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-13 | 2026-10-30 | [Seguridad](INDICE.md#etiqueta-seguridad) · [Datos personales](INDICE.md#etiqueta-datos-personales) · [Negocio](INDICE.md#etiqueta-negocio) |

> Este documento **no trata temas tributarios ni de facturación electrónica**, que están fuera
> del alcance de esta versión. Ver [`14-roadmap-e-ideas.md`](14-roadmap-e-ideas.md).

---

## 1. Matriz de riesgos del proyecto

Escala: Probabilidad y Impacto de 1 (bajo) a 5 (alto). Exposición = P × I.

| ID | Riesgo | P | I | Exp. | Mitigación |
|---|---|:---:|:---:|:---:|---|
| <a id="r-01"></a>R-01 | El registro diario no se convierte en hábito | 4 | 5 | **20** | Registro en menos de 30 s como criterio de aceptación; índice de puntualidad vigilado; soporte de 90 días |
| <a id="r-21"></a>R-21 | La API se conecta con la clave de servicio y RLS deja de aplicar sin que nadie se entere | 4 | 5 | **20** | La API usa un rol dedicado `prisma_api` sin `BYPASSRLS`, sin `SUPERUSER` y que no es dueño de las tablas; `FORCE ROW LEVEL SECURITY` en todas; la clave `service_role` vive en un secreto aparte y **nunca se usa contra PostgreSQL**: solo contra GoTrue, para crear identidades y restablecer claves ([ADR-033](adr/ADR-033-service-role-solo-en-auth.md)); y la prueba de integración desactiva la comprobación de la API y exige que la base siga negando. Si al quitar el `if` los datos aparecen, RLS no está actuando y la prueba falla |
| <a id="r-02"></a>R-02 | La regla del anticipo se implementa mal | 3 | 5 | **15** | Sprint dedicado, escenarios BDD explícitos, ejemplo de septiembre como prueba |
| <a id="r-03"></a>R-03 | Los permisos quedan solo en la interfaz | 3 | 5 | **15** | RLS obligatorio; prueba con sesión de tipo Operación en cada tarea sensible |
| <a id="r-18"></a>R-18 | Se confunde la vista previa de Operación con una prueba de seguridad y se dan por validados unos permisos que nunca se probaron contra la base de datos | 3 | 5 | **15** | La vista previa solo cambia lo que el navegador pinta y lo dice en pantalla mientras está activa; la prueba válida son [P-01](12-pruebas-y-calidad.md#p-01) a [P-32](12-pruebas-y-calidad.md#p-32) de [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md), con sesión real de tipo Operación contra la base, y muy en especial [P-32](12-pruebas-y-calidad.md#p-32), que apaga el `if` de la aplicación para que responda solo la base; `ADR-006` deja escrito que ocultar un menú no es seguridad |
| <a id="r-23"></a>R-23 | Se copian datos reales de prod a uat para probar y nadie los anonimiza | 3 | 5 | **15** | UAT lleva datos anonimizados por regla, no por costumbre: nombres completos, documentos y salarios son datos personales bajo la Ley 1581 de 2012 ([§3](#3-protección-de-datos-personales)). Copiar de prod hacia otro ambiente no existe como procedimiento; el único camino es sembrar datos anonimizados |
| <a id="r-04"></a>R-04 | Los saldos no cuadran en el primer cierre | 4 | 3 | **12** | Verificación de saldos en la migración; primer cierre acompañado |
| <a id="r-05"></a>R-05 | El alcance crece durante el desarrollo | 4 | 3 | **12** | Todo lo nuevo va al roadmap, no al sprint en curso |
| <a id="r-06"></a>R-06 | El histórico de Excel llega incompleto | 4 | 3 | **12** | Importador con reporte por fila; jornada de digitación asistida |
| <a id="r-07"></a>R-07 | Se sigue usando el cuaderno en paralelo | 3 | 4 | **12** | Fecha de corte explícita; archivar el cuaderno físicamente |
| <a id="r-13"></a>R-13 | Una contraseña se comparte entre varias empleadas | 3 | 4 | **12** | Cada persona con su propio usuario; el topbar muestra quién tiene la sesión abierta; la auditoría registra `inicio_sesion` por usuario; Gerencia restablece claves en lugar de prestarlas |
| <a id="r-17"></a>R-17 | Alguien se retira y conserva el acceso porque nadie lo desactivó | 3 | 4 | **12** | Desactivar con motivo es parte del retiro, como entregar las llaves; el listado de usuarios muestra `ultimo_acceso` para ver quién dejó de entrar; revisión del listado en cada cierre mensual |
| <a id="r-22"></a>R-22 | Alguien registra la venta del día en UAT creyendo que es producción | 3 | 4 | **12** | Insignia permanente con la versión y el ambiente, y franja fija en color de advertencia que no se puede cerrar mientras el ambiente no sea producción (`RF-98`, `RF-99`). En prod no hay franja, así que el aviso nunca se vuelve paisaje |
| <a id="r-24"></a>R-24 | Las dos capas que deciden —la base y la API— se separan con el tiempo y dicen cosas distintas | 4 | 3 | **12** | Toda restricción de la base lleva nombre explícito; una sola tabla de traducción en la API va de nombre de restricción a código HTTP, mensaje en español y campo del formulario; un error de la base que no esté en esa tabla devuelve 500 y se registra como defecto; y una prueba automática recorre `pg_constraint` y falla si alguna restricción se quedó sin mensaje |
| <a id="r-27"></a>R-27 | Dos bases de código en vez de una: más superficie que mantener con el mismo equipo | 4 | 3 | **12** | Dos lenguajes, Dart en el front y Java en la API, y es un costo asumido a conciencia (`ADR-017`); el modelo del negocio vive una sola vez, en el dominio de `prisma_api`, y el front no reimplementa ninguna regla (`ADR-018`); `prisma_api` separada por capas para que ese dominio no se filtre a los adaptadores; una sola API que hace de API y de BFF, no dos despliegues; y el plan de sprints rehecho con el trabajo real en vez de apretarlo en el mismo tiempo |
| <a id="r-08"></a>R-08 | Errores de redondeo en cálculos | 2 | 5 | **10** | Objeto `Dinero` con enteros desde el [Sprint 1](08-plan-de-desarrollo.md#sprint-1) |
| <a id="r-16"></a>R-16 | Se desactiva al último usuario de Gerencia y nadie puede administrar | 2 | 5 | **10** | El trigger `tg_proteger_ultima_gerencia` rechaza en la base desactivar o degradar al último usuario activo de Gerencia; el sistema avisa antes de intentarlo |
| <a id="r-26"></a>R-26 | El plan gratuito de Supabase pausa la base por inactividad y el sistema aparece caído | 2 | 5 | **10** | Prod y uat van en plan de pago: «siempre en línea» no cabe en un plan que se duerme tras una semana quieto. Es la factura que `ADR-001` no contemplaba y queda escrita antes del go-live, no el día que el taller no pueda facturar. Dev y qa se quedan en el gratuito, donde la pausa no le molesta a nadie |
| <a id="r-14"></a>R-14 | La clave temporal se anota en papel y nunca se cambia | 3 | 3 | 9 | `debe_cambiar_clave` obliga a cambiarla en el primer ingreso; sin cambiarla no se llega al tablero |
| <a id="r-25"></a>R-25 | El front y la API se despliegan con versiones incompatibles | 3 | 3 | 9 | La API expone `POST /api/v0/consultas/version`; el front declara en tiempo de compilación qué MAJOR necesita y lo comprueba al arrancar. Si no coincide se detiene con un mensaje claro y no deja seguir (`RF-101`): fallar ruidoso al entrar es mejor que fallar en la pantalla 7 con un campo nulo |
| <a id="r-09"></a>R-09 | Se pierde el acceso a la cuenta | 2 | 4 | 8 | Recuperación del proveedor; un segundo usuario de Gerencia |
| <a id="r-10"></a>R-10 | El proveedor cambia condiciones o cierra | 2 | 4 | 8 | Arquitectura hexagonal: cambiar de proveedor toca adaptadores, no reglas |
| <a id="r-15"></a>R-15 | Se activa por error la confirmación de correo en el proveedor | 2 | 4 | 8 | Queda desactivada por configuración y escrito el porqué: si se activa, ningún usuario nuevo entra y el mensaje de error no lo explica. El síntoma se reconoce rápido porque está documentado |
| <a id="r-20"></a>R-20 | Se usa la reversión de la bitácora para deshacer una desactivación legítima y alguien que se retiró recupera el acceso | 2 | 4 | 8 | La reversión también exige motivo escrito y queda registrada con quién y cuándo; la entrada original nunca desaparece, así que la revisión del listado en cada cierre mensual encuentra el acceso devuelto |
| <a id="r-11"></a>R-11 | El celular se daña o se pierde | 3 | 2 | 6 | Todo está en la nube; basta iniciar sesión en otro equipo |
| <a id="r-12"></a>R-12 | La conexión falla en el taller | 3 | 2 | 6 | Cola sin conexión con fecha del movimiento preservada |
| <a id="r-19"></a>R-19 | Gerencia olvida que dejó activa la vista previa y cree que el sistema se dañó porque no encuentra la Nómina | 3 | 2 | 6 | Franja fija arriba del contenido que no se puede cerrar mientras el modo está activo, con el botón `Volver a mi vista`: la salida es un clic. Cerrar sesión también la apaga |

### 1.1 Los tres riesgos que de verdad importan

**[R-01](#r-01) · El registro no se convierte en hábito.** Es el riesgo más alto de todo el proyecto y no
es técnico. Un sistema perfecto sin datos no sirve de nada. Por eso el tiempo de registro es un
criterio de aceptación medido con cronómetro, y por eso el soporte dura 90 días con tres
momentos críticos identificados (día 10, primer cierre, día 60).

**[R-02](#r-02) · La regla del anticipo.** Es la regla menos intuitiva del sistema y la que más valor
aporta. Si se implementa mal, la utilidad y la caja libre quedan mal para siempre, y nadie lo
nota hasta que una decisión sale mal.

**[R-03](#r-03) · Permisos solo en la interfaz.** Si los datos de nómina y retiros llegaran al navegador
de tipo Operación, bastaría abrir las herramientas de desarrollo para verlos. Es un riesgo de
confianza dentro del negocio, no solo técnico. Desde la vista previa tiene una cara nueva,
**[R-18](#r-18)**: dar por probados unos permisos que solo se miraron con una pantalla simulada. Y con
`prisma_api` en medio aparece la peor de todas, **[R-21](#r-21)**: si la API se conecta a la base con la
clave de servicio, RLS deja de aplicar y las políticas siguen ahí, escritas y sin efecto. No
falla, no avisa, no rompe ninguna pantalla: solo deja de proteger.

---

## 2. Riesgos del negocio que el sistema ayuda a detectar

El sistema no elimina estos riesgos, pero los hace **visibles a tiempo**.

| Riesgo del negocio | Cómo lo detecta Emprende | Alerta |
|---|---|---|
| Gastar plata de anticipos | Caja libre negativa | 🔴 Crítica |
| Descapitalizar el negocio | Retiros de 12 meses sobre utilidades | 🟠 Alta |
| Vender productos a pérdida | Margen en pesos bajo o negativo | 🟠 Alta |
| Financiar al cliente sin saberlo | Anticipo menor al costo directo | 🟠 Alta |
| Pagar tiempo que no se vende | Horas pagadas sobre horas facturadas | 🟡 Media |
| Contratar sin capacidad real | Simulador con pro-labore descontado | 🔴 Crítica |
| Perder el control del registro | Índice de puntualidad bajo 80% | 🟡 Media |
| Depender de un solo cliente | Concentración de anticipos sobre 40% | 🟡 Media |

---

## 3. Protección de datos personales

El sistema almacena datos personales de terceros: clientes y personal. Aplica la
**Ley 1581 de 2012** y sus normas reglamentarias.

### 3.1 Qué datos se guardan

| Categoría | Datos | Finalidad | Sensibilidad |
|---|---|---|---|
| Clientes | Nombre, teléfono, correo, notas | Gestión de pedidos y contacto | Media |
| Personal | Nombre, documento, salario, liquidaciones | Gestión de nómina | **Alta** |
| Usuarios | Nombre completo, nombre de usuario, cargo, tipo, registro de accesos | Control de acceso y trazabilidad | Media |
| Operación | Movimientos, pedidos, costos | Gestión del negocio | Alta (comercial) |

### 3.2 Principios aplicados

| Principio | Cómo se cumple |
|---|---|
| **Finalidad** | Solo se piden datos necesarios para operar el negocio |
| **Minimización** | No se recogen datos que el sistema no use: sin dirección, sin fecha de nacimiento |
| **Acceso restringido** | Los datos de nómina solo los ve Gerencia; cada persona ve su propio desprendible |
| **Seguridad** | HTTPS, RLS en la base, contraseñas gestionadas por el proveedor |
| **Trazabilidad** | Toda consulta y cambio queda en la bitácora de auditoría |
| **Conservación** | Los datos no se eliminan; se anulan con motivo. Ver [§3.4](#34-la-tensión-entre-no-borrar-nunca-y-el-derecho-de-supresión) |

### 3.3 Obligaciones prácticas

| Obligación | Cómo se atiende |
|---|---|
| Informar la finalidad del tratamiento | Aviso de privacidad breve al crear un cliente |
| Obtener autorización | Casilla de autorización al registrar datos de contacto |
| Permitir consulta y corrección | La persona puede pedir ver y corregir sus datos |
| Proteger los datos del personal | Restricción por tipo de usuario aplicada en la base de datos |

> **Recomendación práctica:** un aviso de privacidad de un párrafo, incluido al pie de las
> cotizaciones, cubre la obligación de informar sin complicar la operación diaria.

### 3.4 La tensión entre "no borrar nunca" y el derecho de supresión

El diseño de base de datos de solo escritura entra en tensión con el derecho de una persona a
solicitar la eliminación de sus datos. La solución documentada:

| Situación | Respuesta del sistema |
|---|---|
| Un cliente pide que se eliminen sus datos | Se **anonimiza**: nombre y contacto se reemplazan por un identificador; el historial de pedidos permanece sin datos personales |
| Se necesita conservar el registro contable | Los movimientos y pedidos son registros del negocio, no datos personales; se conservan |
| Se solicita corrección | Se corrige el dato y el cambio queda en la auditoría |

La anonimización cumple el derecho de la persona **sin destruir la integridad contable** del
negocio, que es un interés legítimo distinto.

### 3.5 Los datos de quien entra al sistema

El nombre completo y el cargo de cada persona con acceso son datos personales. Les aplica la
misma **Ley 1581 de 2012** que a los datos de los clientes. Se dejan escritos aparte porque son
datos que antes no se guardaban: cuando el modo se cambiaba con un interruptor, el sistema no
sabía de quién era la sesión.

| Pregunta | Respuesta |
|---|---|
| Para qué se recogen | Para operar el sistema —saber quién registró cada movimiento— y para liquidar la nómina |
| Con quién se comparten | Con nadie. No salen del sistema ni se entregan a terceros |
| Quién los ve | Gerencia ve el listado completo; cada persona ve su propia ficha |
| Qué pasa cuando alguien se va | El usuario se desactiva con motivo; el nombre y el cargo se conservan |

Lo último necesita explicación, porque parece ir contra el derecho de supresión:
**desactivar no borra.** El nombre de quien registró un movimiento es parte del soporte de ese
movimiento, y los soportes del negocio hay que conservarlos por obligación contable. Borrar el
usuario dejaría la auditoría apuntando a un vacío y haría inservible la historia que la justifica.

> **Alcance de esta nota:** describe cómo trata el sistema esos datos. No es un concepto
> jurídico. Si el negocio necesita certeza sobre plazos de conservación o sobre el registro de
> sus bases de datos, eso lo define un abogado.

---

## 4. Seguridad de la información

| Amenaza | Control |
|---|---|
| Acceso no autorizado | Autenticación del proveedor + RLS por tipo de usuario |
| Borrado accidental o malicioso | `DELETE` revocado en el motor de base de datos |
| Alteración de registros | Auditoría por triggers, imposible de evitar desde la aplicación |
| Pérdida de datos | Respaldo diario del proveedor + exportación manual |
| Intercepción de tráfico | HTTPS obligatorio |
| Filtración de credenciales | Las contraseñas nunca tocan código propio |
| Fuga por dispositivo perdido | Sesión revocable; los datos no residen en el celular |

---

## 5. Continuidad

| Escenario | Respuesta | Tiempo estimado |
|---|---|---|
| El celular se pierde | Iniciar sesión en otro equipo | Minutos |
| Sin conexión en el taller | Registrar en la cola local o en papel con fecha real | Inmediato |
| El proveedor no está disponible | Registrar en papel; digitar al restablecerse | Horas |
| Datos corruptos por error propio | Restaurar desde la exportación de respaldo | Ver documento [13](13-respaldo-y-exportacion.md) |
| Cambio de proveedor tecnológico | Reescribir adaptadores; el dominio no cambia | Semanas |

El último punto es la razón concreta por la que la arquitectura es hexagonal: **las reglas de
negocio son el activo, la tecnología es reemplazable.**

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](04-modelo-de-datos.md "04 · Modelo de datos") · [12](12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [13](13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [17](17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [22](22-documentacion.md "22 · Documentación: versiones, estados y referencias") · [ADR-004](adr/ADR-004-base-solo-escritura.md "ADR-004 · Base de datos de solo escritura") · [ADR-010](adr/ADR-010-almacenamiento-contrasenas.md "ADR-010 · Almacenamiento de contraseñas: hashing delegado con salt por usuario") · [ADR-013](adr/ADR-013-cuatro-ambientes.md "ADR-013 · Cuatro ambientes y promoción de migraciones") · [ADR-021](adr/ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [ADR-033](adr/ADR-033-service-role-solo-en-auth.md "ADR-033 · La clave de servicio entra, pero solo para crear identidades") · [ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md "ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio") · [ADR-066](adr/ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md "ADR-066 · La clave de servicio también sube el respaldo que nadie pidió")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [10 · UX y mockups](10-ux-y-mockups.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [12 · Pruebas y calidad](12-pruebas-y-calidad.md)
