# ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-017-api-en-java.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-024](ADR-024-java-25-y-gradle.md) | 2026-09-15 | 2026-10-30 | [Arquitectura](../INDICE.md#etiqueta-arquitectura) · [API](../INDICE.md#etiqueta-api) |

> **Lo reemplaza [ADR-024](ADR-024-java-25-y-gradle.md):** la API sigue siendo Java con Spring
> Boot y todo lo que este ADR argumenta sigue en pie, pero las versiones cambiaron. Java 21
> pasó a **Java 25**, la construcción pasó de Maven a **Gradle**, y Spring Boot 3.5 pasó a
> [**4.1**](../08-plan-de-desarrollo.md#tarea-4-1) porque la línea 3.5 llegó al final de su vida en abierto. El cuerpo de abajo se
> conserva tal como se escribió.

## Contexto

[ADR-011](ADR-011-stack-flutter-dart.md) decidió `emprende_front` en Flutter y `prisma_api` en Dart
con Dart Frog. Su argumento principal fue **un solo lenguaje en todo el proyecto**: Dart en el
front, Dart en la API, un solo dialecto para las reglas de plata.

Ahora se pide que **la API esté hecha en Java**. El front sigue en Flutter, y con él Dart, así que
la decisión no es «cambiar de lenguaje» sino «dejar de tener uno solo».

La pregunta que hay que contestar con honestidad es si lo que se gana compensa perder el
argumento que sostenía [ADR-011](ADR-011-stack-flutter-dart.md).

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Java 21 con Spring Boot** | Es el ecosistema de servidor con más gente disponible en Colombia; Swagger sale del ecosistema (`springdoc-openapi`); `Resilience4j` da reintentos, cortacircuitos y limitación de tasa ya probados; transacciones declarativas, que es justo lo que exigen [ADR-012](ADR-012-identidad-a-postgres.md) y la idempotencia | La JVM pide más memoria y arranca más lento; se acaba el lenguaje único; Spring Boot trae más maquinaria de la que un sistema de este tamaño necesita |
| Seguir con Dart y Dart Frog (lo de [ADR-011](ADR-011-stack-flutter-dart.md)) | Un solo lenguaje de punta a punta; binario liviano y arranque inmediato, que abarata cuatro ambientes; ya estaba decidido y documentado | Dart de servidor tiene poquísima gente en Colombia; Dart Frog es joven y de un solo proveedor; Swagger y resiliencia hay que construirlos a mano |
| Java con Quarkus | Arranque y memoria mucho mejores, sobre todo compilado a nativo con GraalVM; pensado para contenedores pequeños | Menos gente que lo conozca que Spring Boot, que es justo el criterio que manda aquí; la compilación nativa agrega una cadena de herramientas y reflexión que hay que configurar a mano |
| Java con Micronaut | Inyección resuelta en compilación, arranque rápido y poca memoria | El más pequeño de los tres ecosistemas; buscar una respuesta a un problema concreto es notablemente más difícil |
| Otro lenguaje de servidor (TypeScript, Python, Go, C#) | Ecosistemas grandes y con gente disponible | Ninguno cumple el pedido explícito de que la API sea en Java, y ninguno gana lo suficiente sobre Java como para discutirlo |

## Decisión

**`emprende_front` en Flutter, multiplataforma y con objetivo web por defecto.
`prisma_api` en Java 21 con Spring Boot. PostgreSQL en Supabase.**

- `emprende_front` — un solo código Flutter. Se compila a web por defecto, y el mismo código
  compila a Android, iOS y escritorio sin rehacer nada. [ADR-016](ADR-016-flutter-web-pwa.md)
  sigue vigente: «web por defecto» es exactamente lo que decidió.
- `prisma_api` — Java 21 con Spring Boot. Toda la lógica del sistema.
- **PostgreSQL gestionado por Supabase**, siempre en línea, un proyecto por ambiente.

Lo que **no** cambia de [ADR-011](ADR-011-stack-flutter-dart.md) y sigue mandando:

> **El front nunca habla con Supabase directamente.** Ni con la base, ni con Auth, ni con
> Storage. Todo pasa por `prisma_api`. Si aparece el cliente de Supabase dentro del código
> Flutter, se rechaza en revisión de código.

[ADR-002](ADR-002-arquitectura-hexagonal.md) tampoco cambia, solo de lenguaje. En Java los cuatro
paquetes quedan así:

| Paquete | Qué vive ahí |
|---|---|
| `dominio` | Entidades y reglas. Sin anotaciones de Spring, sin JDBC, sin HTTP |
| `aplicacion` | Casos de uso, uno por CU |
| `infraestructura` | Repositorios JDBC, cliente de Auth, Storage |
| `interfaz` | Controladores REST, el sobre de respuesta, el filtro de firma, el de idempotencia |

## Justificación

**Gente que lo pueda retomar.** Es el mismo criterio que usó
[ADR-001](ADR-001-stack.md) para preferir React a Svelte: para un sistema del que dependerá un
negocio durante años, la disponibilidad de quien pueda retomarlo pesa más que ahorrar unas
semanas. En Colombia hay muchísimo más Java de servidor que Dart de servidor. El mismo criterio
que en [ADR-001](ADR-001-stack.md) favoreció al ecosistema grande aquí favorece a Java, y sería incoherente aplicarlo
en el front y no en la API.

**Swagger sale del ecosistema, no se construye.** `springdoc-openapi` genera el OpenAPI desde los
controladores y los DTO. En Dart había que armarlo.

**Resiliencia con piezas probadas.** `Resilience4j` trae reintentos, cortacircuitos y limitación
de tasa. Son justo las piezas que exige «no se puede perder información», y no conviene
escribirlas a mano en el sistema que lleva la plata del negocio.

**Transacciones declarativas.** [ADR-012](ADR-012-identidad-a-postgres.md) obliga a fijar la
identidad al abrir la transacción y antes de cualquier consulta, y la idempotencia obliga a que
el registro de la clave y el efecto de la operación ocurran en la misma transacción. Spring hace
eso con `@Transactional` y sin inventar nada.

**Por qué Spring Boot y no Quarkus ni Micronaut.** Los dos arrancan más rápido y consumen menos,
que es exactamente lo que duele de esta decisión. Se eligió Spring Boot igual, porque el criterio
que manda es el de [ADR-001](ADR-001-stack.md): elegir Quarkus para ahorrar memoria y perder por el camino a la gente
que sabe Spring sería repetir el error que [ADR-001](ADR-001-stack.md) evitó al descartar Svelte.

## Consecuencias

- **Positivas:** hay mucha más gente que puede retomar la API; OpenAPI, resiliencia y
  transacciones vienen del ecosistema en vez de construirse; la propagación de identidad de
  [ADR-012](ADR-012-identidad-a-postgres.md) queda sostenida por `@Transactional`;
  [ADR-002](ADR-002-arquitectura-hexagonal.md) se conserva sin cambios, solo cambia el lenguaje
  de los adaptadores.
- **Negativas:** **se pierde el lenguaje único, que era la razón principal de
  [ADR-011](ADR-011-stack-flutter-dart.md).** Serán dos lenguajes, dos cadenas de herramientas y
  dos formas de modelar el mismo dominio, para un equipo de una persona. Hay que decirlo sin
  suavizarlo: el argumento con el que se justificó el cambio a Flutter hace unos días hoy es
  falso para la mitad del sistema. Y **la JVM pide más memoria y arranca más lento** que un
  binario de Dart, lo que **encarece alojar cuatro ambientes**
  ([ADR-013](ADR-013-cuatro-ambientes.md)). Con `RNF-14` reescrito a «costo mensual al mínimo
  sostenible» es asumible, pero es una factura real todos los meses, no un detalle de afinación.
  Se suma que un arranque en frío más lento castiga a los ambientes que se apagan por inactividad,
  que son justamente los baratos.

## Referencias

- [ADR-011 · Stack: Flutter y Dart con API propia](ADR-011-stack-flutter-dart.md) — reemplazado
  por este.
- [ADR-001 · Stack tecnológico](ADR-001-stack.md) — de donde sale el criterio de disponibilidad.
- [ADR-012 · La API propaga la identidad a PostgreSQL](ADR-012-identidad-a-postgres.md) — la
  implementación vigente, en Java, está en [`07-arquitectura.md`](../07-arquitectura.md).
- [ADR-016 · Flutter Web instalable como PWA](ADR-016-flutter-web-pwa.md) — sigue vigente.
- [ADR-013 · Cuatro ambientes y promoción de migraciones](ADR-013-cuatro-ambientes.md) — donde se
  ve el costo.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [17](../17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-002](ADR-002-arquitectura-hexagonal.md "ADR-002 · Arquitectura hexagonal con regla de dependencias verificada") · [ADR-011](ADR-011-stack-flutter-dart.md "ADR-011 · Stack: Flutter y Dart con API propia") · [ADR-012](ADR-012-identidad-a-postgres.md "ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando") · [ADR-014](ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-016](ADR-016-flutter-web-pwa.md "ADR-016 · Flutter Web instalable como PWA") · [ADR-018](ADR-018-front-sin-decisiones.md "ADR-018 · Tres partes, y el front no toma decisiones") · [ADR-021](ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [ADR-022](ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [ADR-024](ADR-024-java-25-y-gradle.md "ADR-024 · Java 25, Gradle y Spring Boot 4 en la API")
<!-- /generado:referenciado-desde -->
