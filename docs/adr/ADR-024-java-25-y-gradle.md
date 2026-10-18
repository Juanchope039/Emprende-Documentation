# ADR-024 · Java 25, Gradle y Spring Boot 4 en la API

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-024-java-25-y-gradle.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-16 | 2026-09-16 | [API](../INDICE.md#etiqueta-api) · [Entrega](../INDICE.md#etiqueta-entrega) |

## Contexto

[ADR-017](ADR-017-api-en-java.md) decidió `prisma_api` en **Java 21 con Spring Boot**, y
[`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro) eligió **Maven** para
construirlo, con un argumento explícito: *«es lo que produce Spring Initializr por defecto y lo
que más gente sabe leer»*.

Ahora se pide **Java 25 y Gradle**. Y al ir a hacerlo aparece un tercer asunto que no estaba en
la petición y que obliga igual:

> **Spring Boot 3.5 llegó al final de su vida en abierto el 30 de junio de 2026.** El último
> parche gratuito fue el 3.5.16. Todas las ramas 3.x están sin soporte, y eso significa que un
> CVE nuevo en cualquiera de sus dependencias no va a tener arreglo publicado.

El esqueleto del [Sprint 0](../08-plan-de-desarrollo.md#sprint-0) se había escrito contra Spring Boot 3.5.6. Seguir ahí era arrancar un
proyecto nuevo sobre una base que ya no recibe parches de seguridad, en un sistema que va a
guardar los salarios de las empleadas y los movimientos de plata del taller.

## Alternativas consideradas

### La herramienta de construcción

| Opción | A favor | En contra |
|---|---|---|
| **Gradle** | **Descarga el JDK por su cuenta** con toolchains: quien clone el proyecto compila sin instalar nada ni averiguar por qué su JDK no vale. Compilación incremental y caché, que en un proyecto que va a crecer se nota cada día. El archivo de construcción es código con tipos y autocompletado | **Necesita un demonio**, que es un proceso más que puede fallar por su cuenta —y falla, como se cuenta abajo—. Menos gente lo sabe leer. Que el archivo de construcción sea código es también su riesgo: un `pom.xml` no puede tener lógica, un `build.gradle.kts` sí, y con el tiempo la acumula |
| Maven (lo que había) | Lo que produce Spring Initializr por defecto y lo que más gente sabe leer. Declarativo: no hay dónde esconder lógica. No necesita ningún proceso de fondo | El JDK lo tiene que poner cada persona, y la versión correcta es una nota en un README que nadie lee hasta que falla. Sin compilación incremental de verdad |

### La versión de Java

| Opción | A favor | En contra |
|---|---|---|
| **Java 25** | Es **LTS**, con soporte largo. Cuatro años más de arreglos que 21, y este sistema va a durar | Menos rodaje que 21, y alguna herramienta del ecosistema puede ir por detrás |
| Java 21 (lo que había) | Muy rodado, todo lo soporta | Su ventana de soporte empieza a quedar corta para algo que arranca hoy |

### La versión de Spring Boot

Esta no se eligió: **Spring Boot 4.1.1 es la única opción con soporte en abierto.** Quedarse en
3.5.x era elegir no recibir parches.

## Decisión

**Java 25, Gradle 9.7.1 y Spring Boot 4.1.1.**

| Pieza | Versión | Nota |
|---|---|---|
| Java | **25** (LTS, Temurin) | Declarado como *toolchain*, no como «lo que tengas instalado» |
| Gradle | **9.7.1** | Java 25 está soportado desde 9.1.0 |
| Spring Boot | **4.1.1** | Requiere Spring Framework 7. Java 17 a 26 |
| springdoc-openapi | **3.1.1** | Es la línea que soporta Spring Boot 4 |
| Resilience4j | **2.4.0** | Ojo: el artefacto es `resilience4j-spring-boot4`, no `-spring-boot3` |

Tres consecuencias del cómo que merecen decirse:

**El JDK lo pone el proyecto, no la máquina.** El `build.gradle.kts` declara Java 25 como
toolchain y `settings.gradle.kts` activa el resolvedor de Foojay. Gradle se ejecuta con
cualquier JDK entre 17 y 26 y **descarga el 25 solo** si no está. Es lo que hace que «clona y
compila» sea cierto en vez de ser una aspiración con tres pasos manuales escondidos.

**La versión de la API se muda del `pom.xml` al `build.gradle.kts`.** Lo que decide
[ADR-014](ADR-014-semver.md) —SemVer independiente por proyecto— no cambia; cambia el archivo
donde vive el número.

**La distribución de Gradle se verifica con su suma SHA-256.** Está en
`gradle-wrapper.properties`. Si alguien intercepta la descarga o el archivo cambia, la
compilación se detiene en vez de ejecutar lo que llegó.

## Justificación

**El argumento de Maven era bueno y sigue siendo cierto; lo que cambió es cuánto pesa.** Que más
gente sepa leer un `pom.xml` importa mucho cuando el equipo rota y poco cuando son dos equipos
fijos que van a vivir tres años en el mismo proyecto. Frente a eso, que Gradle resuelva el JDK
por su cuenta vale más: es la diferencia entre que alguien nuevo compile el primer día o pierda
la mañana averiguando por qué su Java 17 no sirve.

**Java 25 no se elige por las novedades del lenguaje, se elige por la fecha.** Ninguna regla
financiera necesita nada que 21 no tenga. Lo que se compra es ventana de soporte, y para un
sistema que va a estar funcionando en 2030 esa ventana es la decisión.

**Spring Boot 4 no es una mejora, es una obligación.** Y conviene decirlo así para que nadie lo
recuerde como «nos actualizamos porque salió algo nuevo». Nos actualizamos porque lo anterior
dejó de recibir parches, y un sistema que guarda datos personales bajo la Ley 1581 no puede
correr sobre una base sin soporte de seguridad.

## Consecuencias

- **Positivas:** el JDK deja de ser un requisito manual y pasa a ser parte del proyecto; las
  compilaciones repetidas son más rápidas por la caché; la distribución de Gradle va verificada
  con su suma; y la API queda sobre una versión de Spring Boot que recibe parches.

- **Negativas:** hay **un demonio más que puede fallar**, y no es teórico —ver más abajo—. Menos
  gente sabe leer un `build.gradle.kts` que un `pom.xml`, y como es código, con el tiempo tiende
  a acumular lógica que un `pom.xml` no habría permitido. El salto a Spring Boot 4 arrastra
  Spring Framework 7 y obliga a revisar cada dependencia del ecosistema: `springdoc` y
  `Resilience4j` ya cambiaron de artefacto o de línea, y las que vengan también pueden.

- **El riesgo que ya se materializó, dicho para que no se descubra dos veces:** en la máquina
  donde se montó esto, el demonio de Gradle **no arranca**. Falla con
  `java.io.IOException: Unable to establish loopback connection`, y la causa no es Gradle: es
  que `java.nio.channels.Selector.open()` está roto en esa máquina —lo mismo le pasa a un
  programa Java de seis líneas—. Con Maven no se habría notado, porque Maven no levanta ningún
  proceso de fondo. **Pero tampoco habría estado arreglado:** Tomcat usa ese mismo `Selector`,
  así que la API no podría ni arrancar ahí. Gradle no causó el problema; lo destapó antes.

- **A vigilar:** si el `build.gradle.kts` empieza a tener condicionales y tareas propias, se
  perdió lo que hacía bueno al `pom.xml` y conviene revisar esta decisión. Un archivo de
  construcción que hay que leer entero para saber qué hace ya es un programa, y los programas
  tienen errores.

## Referencias

- [ADR-017](ADR-017-api-en-java.md) — la decisión que este reemplaza
- [ADR-014](ADR-014-semver.md) — SemVer por proyecto: sigue vigente, cambia el archivo
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro) — cómo se construye y se promueve
- [Spring Boot · System Requirements](https://docs.spring.io/spring-boot/system-requirements.html)
- [Gradle · Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [18](../18-distribucion-y-pipelines.md "18 · Distribución multiplataforma y automatización (pipelines)") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-014](ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-017](ADR-017-api-en-java.md "ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API") · [ADR-018](ADR-018-front-sin-decisiones.md "ADR-018 · Tres partes, y el front no toma decisiones") · [ADR-023](ADR-023-tres-repositorios.md "ADR-023 · Tres repositorios y el contrato como artefacto versionado")
<!-- /generado:referenciado-desde -->
