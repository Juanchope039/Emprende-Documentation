# Emprende — Sistema de Gestión Administrativa y Financiera
### Prisma M&Y Estampados · Cali, Valle del Cauca, Colombia

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.10.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/README.md "Historial de cambios") | [✅ Vigente](docs/22-documentacion.md#estados) | 2026-09-13 | 2026-10-30 | [Negocio](docs/INDICE.md#etiqueta-negocio) · [Plan](docs/INDICE.md#etiqueta-plan) |

> **Emprende** = **P**lataforma de **R**egistro, **I**nversión, **S**eguimiento, **M**árgenes y **A**dministración.
> Un solo lugar para saber cuánto entra, cuánto sale, cuánto queda y cuánto se puede pagar.

---
## Índice
- [1. El problema en una frase](#titulo-1)
- [2. Índice de la documentación](#titulo-2)
- [3. Mockup interactivo](#titulo-3)
- [4. Las tres piezas que se van a construir](#titulo-4)
- [5. Las 7 decisiones de diseño que definen el producto](#titulo-5)
- [6. Estado del proyecto](#titulo-6)
- [7. Cómo usar esta documentación](#titulo-7)
- [8. Advertencia](#titulo-8)
- [9. Licencia](#titulo-9)
---

## <a id="titulo-1"></a>1. El problema en una frase

Hoy la plata del negocio y la plata personal se mezclan, las facturas viven en fotos del celular
y en un cuaderno, y no hay forma confiable de responder tres preguntas críticas:

1. **¿Cuánto gané realmente este mes?** (no cuánto vendí)
2. **¿Cuánto de eso es mío y cuánto tiene que quedarse en el negocio?**
3. **¿Puedo pagarle a una empleada sin quebrar?**

Emprende existe para responder esas tres preguntas con números, no con intuición.

---

## <a id="titulo-2"></a>2. Índice de la documentación

> 🧭 **¿No eres técnico y no sabes por dónde empezar?** Abre el
> **[índice navegable](docs/INDICE.md)**: organiza toda la documentación por preguntas
> ("¿cuánto gané este mes?", "¿mi información está segura?") y por perfil (gerencia,
> contador, operación), y marca qué documentos son técnicos para que puedas saltarlos.

| # | Documento | Para qué sirve |
|---|-----------|----------------|
| 00 | [Resumen ejecutivo](docs/00-resumen-ejecutivo.md) | La versión de 5 minutos. **Empieza aquí.** |
| 01 | [Visión y alcance](docs/01-vision-y-alcance.md) | Objetivos, usuarios, roles y permisos, qué SÍ y qué NO hace |
| 02 | [Casos de uso](docs/02-casos-de-uso.md) | Los 37 casos de uso con flujos y rol autorizado |
| 03 | [Requisitos y BDD](docs/03-requisitos-y-bdd.md) | Requisitos + escenarios Gherkin + matriz de trazabilidad |
| 04 | [Modelo de datos](docs/04-modelo-de-datos.md) | Entidades, diagrama ER, SQL, base de solo escritura |
| 05 | [Reglas financieras](docs/05-reglas-financieras.md) | **Las fórmulas exactas. El corazón del sistema.** |
| 06 | [Nómina y capacidad de pago](docs/06-nomina-y-capacidad-de-pago.md) | Cuánto se puede pagar y cómo se liquida |
| 07 | [Arquitectura](docs/07-arquitectura.md) | Hexagonal, SOLID, stack, seguridad |
| 08 | [Plan de desarrollo](docs/08-plan-de-desarrollo.md) | 10 sprints por tareas en paralelo, con su calendario calculado para 1, 2 y 3 tareas a la vez |
| 09 | [Plan de implantación](docs/09-plan-de-implantacion.md) | Migración, capacitación, go-live, soporte |
| 10 | [UX y mockups](docs/10-ux-y-mockups.md) | Pantallas, navegación, sistema de diseño |
| 11 | [Riesgos y protección de datos](docs/11-riesgos-y-proteccion-de-datos.md) | Matriz de riesgos, respaldos, Ley 1581 |
| 12 | [Pruebas y calidad](docs/12-pruebas-y-calidad.md) | Estrategia de pruebas y datos de prueba |
| 13 | [Respaldo y exportación](docs/13-respaldo-y-exportacion.md) | Diseño de la exportación de la base |
| 14 | [Roadmap e ideas](docs/14-roadmap-e-ideas.md) | 30 ideas para después del MVP |
| 15 | [Glosario](docs/15-glosario.md) | Vocabulario compartido negocio ↔ técnico |
| 16 | [Base de datos: snapshots y datos de prueba](docs/16-base-de-datos-y-snapshots.md) | Recrear la BD en cualquier ambiente, seed y generador de datos |
| 17 | [Resiliencia, offline y caché](docs/17-resiliencia-offline-y-cache.md) | Trabajar sin conexión, sincronizar al reconectar y purgar la caché |
| 18 | [Distribución y pipelines](docs/18-distribucion-y-pipelines.md) | Descargas web/Android/iPhone/Windows y automatización (idea) |
| 19 | [Ambientes, versionado y entrega](docs/19-ambientes-y-entrega.md) | Los 4 ambientes, promoción de migraciones, SemVer y publicación |
| 20 | [Contrato de API](docs/20-contrato-de-api.md) | El sobre `{status, mensaje, data}`, los códigos de 5 dígitos, la idempotencia y el canal firmado |
| 21 | [Trabajo en paralelo](docs/21-trabajo-en-paralelo.md) | Cómo avanzan varias tareas a la vez sin bloquearse: repartos, repositorios y reglas de convivencia |
| 22 | [Documentación](docs/22-documentacion.md) | Versiones, estados, fechas, etiquetas y referencias enlazadas de todos los documentos |
| — | [ADRs](docs/adr/) | Las decisiones de arquitectura registradas, con su porqué |
| — | [Contrato de la API](contrato/) | El `openapi.json` acordado entre front y API, con el catálogo de códigos dentro |
| — | [Tareas](TODO.md) | Lo hecho y lo pendiente, tarea por tarea, y qué se puede avanzar en paralelo |

---

## <a id="titulo-3"></a>3. Mockup interactivo

Antes de escribir una sola línea de código de producción hay un **prototipo navegable**
en [`mockup/prisma-mockup.html`](mockup/prisma-mockup.html).

Ábrelo con doble clic. Abre en la **pantalla de ingreso**: cada persona entra con su propio
usuario y contraseña, y lo que ve después depende de con quién entró. Ya no hay selector de
rol; la diferencia entre Gerencia y Operación se ve entrando con un usuario o con otro.

Trae usuarios de ejemplo con **entrada de un clic**, para no teclear nada:

| Usuario | Contraseña | Quién es | Tipo |
|---|---|---|---|
| `yuliana` | `prisma2026` | Yuliana Martínez Ríos · Gerente | Gerencia |
| `marcela` | `prisma2026` | Marcela Ospina Vélez · Empleada de producción | Operación |
| `daniela` | `prisma2026` | Daniela Cortés Ramírez · Domiciliaria | Operación |
| `camila` | `temporal01` | Camila Restrepo Arango · Asistente administrativa | Operación |
| `lorena` | `prisma2026` | Lorena Sáenz Mejía · Empleada de producción | Operación |

`camila` entra con clave temporal: el prototipo la obliga a cambiarla antes de mostrar nada.
`lorena` está desactivada y sirve para ver el rechazo aunque la contraseña sea correcta.

Son 11 pantallas con datos ficticios realistas, contando la de acceso.

> **Regla de oro del proyecto:** nada se construye hasta que el mockup de esa pantalla
> esté aprobado.

---

## <a id="titulo-4"></a>4. Las tres piezas que se van a construir

El mockup es un archivo HTML suelto y se abre con doble clic. El sistema de verdad no: son
**tres piezas con vidas separadas**, y hay que saber cuál es cuál antes de tocar nada.

| Pieza | Qué es | Qué hace |
|---|---|---|
| `emprende_front` | Flutter, un solo código: el objetivo por defecto es **web**, instalable como PWA, y el mismo código compila a Android, iOS y escritorio | Pide, recibe y muestra. Nada más |
| `prisma_api` | API propia en **Java 25 con Spring Boot**. Hace de API y de BFF a la vez, y es la única que habla con la base | Toda la lógica. Toma las decisiones y dicta los mensajes que se ven |
| Capa de datos | PostgreSQL en Supabase, siempre en línea | Garantiza lo que no se puede romper: restricciones, permisos y durabilidad |

> **El front no decide nada.** Ni una regla de negocio, ni un permiso, ni un mensaje de error, ni
> una cifra calculada: todo eso lo dicta la API y el front solo lo pinta. Escribir una regla en
> Flutter es saltarse la arquitectura y se rechaza en revisión de código.

> **El front nunca habla con Supabase directamente.** Ni con la base, ni con Auth, ni con
> Storage: todo pasa por `prisma_api`. Meter el cliente de Supabase dentro del código Flutter
> también se rechaza en revisión.

**Cada pieza vive en su propio repositorio** ([ADR-025](docs/adr/ADR-025-cuatro-repositorios.md)), y los cuatro son hermanos dentro de una
carpeta de trabajo ([ADR-035](docs/adr/ADR-035-repositorios-hermanos.md)): este repositorio guarda la documentación, el mockup y el contrato;
`prisma_api` guarda la API; `emprende_db`, las migraciones y la semilla de la base; `emprende_front`,
el front.

| Repositorio | En disco, dentro de la carpeta de trabajo |
|---|---|
| `Finanzas-PRISMA`, este | `repositories/documentation` |
| `prisma_api` | `repositories/backend-api` |
| `emprende_db` | `repositories/backend-db` |
| `emprende_front` | `repositories/frontend-flutter` |

Ninguno contiene a otro: cada carpeta es un repositorio git con su propia historia, y la carpeta de
trabajo que los junta no es un repositorio.

Separar la base de la API tiene un precio: **una función que necesita una columna nueva son dos
commits, en dos repositorios y en orden.** Primero la migración, compatible con la API que ya
corre; después la API que la usa.

Cada proyecto lleva su propia versión SemVer, y las tres piezas existen cuatro veces: en
desarrollo, QA, aprobación y producción, cada ambiente con su propia base. El front muestra
siempre en pantalla qué versión es y contra qué ambiente está hablando. El detalle está en
[`docs/19-ambientes-y-entrega.md`](docs/19-ambientes-y-entrega.md).

---

## <a id="titulo-5"></a>5. Las 7 decisiones de diseño que definen el producto

| # | Decisión | Por qué |
|---|----------|---------|
| 1 | **Separación estricta negocio ↔ persona** | Un retiro NO es un gasto. Mezclarlos es la causa #1 de que un emprendimiento no sepa si gana plata. |
| 2 | **Triple vista: causación, caja y caja libre** | "Tengo plata en Nequi" ≠ "gané plata" ≠ "puedo gastarla". |
| 3 | **El anticipo es un pasivo, no un ingreso** | Mientras no entregues, esa plata no es tuya. |
| 4 | **El trabajo de la gerencia se cobra como pro-labore** | Si no se cuenta, el negocio parece rentable porque tiene mano de obra gratis. |
| 5 | **La base de datos nunca borra** | Solo anula con motivo, autor, fecha y dispositivo. La historia completa siempre queda. |
| 6 | **Los permisos viven en PostgreSQL, no en la pantalla** | Ocultar un botón no es seguridad. Lo que evalúa la base es el **tipo** de usuario de la sesión abierta: Gerencia u Operación. |
| 7 | **Todo en pesos enteros (sin decimales)** | El COP no usa centavos. Evita errores de redondeo acumulados. |

---

## <a id="titulo-6"></a>6. Estado del proyecto

| Fase | Estado |
|------|--------|
| Documentación y plan | ✅ Completo |
| Mockup navegable | ✅ Completo |
| Validación del mockup con la gerencia | ✅ Confirmado en reunión el 16/09/2026 |
| **[Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9)** · promoción, PWA y endurecimiento | 🔄 **En curso** |
| **[Sprint 10](docs/08-plan-de-desarrollo.md#sprint-10)** · la retroalimentación de Gerencia | 🔄 **Abierto el 2026-10-06**, con lo que Gerencia pidió usando dev |
| Desarrollo MVP (Sprints 1 a 9) | 🔄 **Iniciado**: la tarea [1.9](docs/08-plan-de-desarrollo.md#tarea-1-9), `Dinero`, está hecha |
| Implantación | ⬜ No iniciado |

**Lo que ya existe del [Sprint 0](docs/08-plan-de-desarrollo.md#sprint-0):** los cuatro repositorios, con el esqueleto de cada pieza, la
integración continua de la API y del front, y los cimientos que tienen que estar **antes** del primer
endpoint: el sobre en toda respuesta, el catálogo de códigos, la consulta de versión, las dos fronteras
verificadas, **el contrato v0.5.0** en [`contrato/`](contrato/), que era el camino crítico del
sprint, y el descriptor de formulario. Todavía no hay ninguna funcionalidad de negocio.

**Lo que falta para cerrarlo** son las dos tareas que necesitan una base de datos corriendo, 0.5 y
0.10. Se hacen contra el proyecto dev de Supabase, que ya existe y falta configurar, porque Docker
sigue sin arrancar en la máquina de desarrollo. Los otros tres proyectos de Supabase (0.4) se crean
antes de promover. La imagen de la API y la entrega automática a dev (0.8 y 0.9) **se hacen en este
sprint y solo para dev**, que se aloja en Railway desde el
[ADR-032](docs/adr/ADR-032-railway-en-dev-ahora.md); qa, uat y prod siguen esperando al
[Sprint 9](docs/08-plan-de-desarrollo.md#sprint-9).

El detalle tarea por tarea —lo hecho, lo pendiente, lo bloqueado y qué se puede avanzar en
paralelo— está en [`TODO.md`](TODO.md).

---

## <a id="titulo-7"></a>7. Cómo usar esta documentación

- **Si diriges el negocio:** lee [`00-resumen-ejecutivo.md`](docs/00-resumen-ejecutivo.md), abre el mockup, y luego [`05-reglas-financieras.md`](docs/05-reglas-financieras.md).
- **Si vas a programar:** lee `01`, `02`, `03`, `04`, `07`, `19` y `20` en ese orden.
- **Si eres el contador:** lee `05`, `06` y `11`.

**La documentación Swagger la genera la API** con springdoc, a partir de sus controladores
([ADR-022](docs/adr/ADR-022-openapi-generado.md)), y cuelga de la misma dirección que la API:

| Qué | Ruta | En una máquina, con `./gradlew bootRun` |
|---|---|---|
| Swagger UI, para leer y probar las operaciones | `/docs` | <http://localhost:8081/docs> |
| El OpenAPI generado, en JSON | `/docs/openapi` | <http://localhost:8081/docs/openapi> |

En dev y en qa está abierta. En uat y en prod pide usuario y clave, y prod cuenta aunque no se
despliegue en el dominio del proyecto sino en la copia de cada emprendimiento. Lo que se publica en
cada ambiente lo dice [20 §7.2](docs/20-contrato-de-api.md#72-dónde-se-publica-en-cada-ambiente). El contrato que manda sigue siendo el acordado, en [`contrato/`](contrato/).

---

## <a id="titulo-8"></a>8. Advertencia

**Este software no reemplaza a un contador público.** Es una herramienta de gestión y control
interno, no un sistema contable certificado ni un facturador electrónico DIAN.

Los aspectos tributarios y de facturación electrónica están **explícitamente fuera del alcance**
de esta versión y se documentan en [`docs/14-roadmap-e-ideas.md`](docs/14-roadmap-e-ideas.md).

---

## <a id="titulo-9"></a>9. Licencia

Copyright (C) 2026 Juan David Garzón Vallejo <juanchope039@gmail.com>.

Este repositorio se licencia bajo la GNU Affero General Public License, versión 3 y solo esa
(`SPDX-License-Identifier: AGPL-3.0-only`), sin ninguna garantía. El texto completo está en
[`LICENSE`](LICENSE).
