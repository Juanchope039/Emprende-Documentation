# 19 · Ambientes, versionado y entrega

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [13.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/19-ambientes-y-entrega.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-15 | 2026-10-17 | [Entrega](INDICE.md#etiqueta-entrega) · [Proceso](INDICE.md#etiqueta-proceso) |

Cómo se configura, se prueba, se publica y —si hace falta— se devuelve cada versión de PRISMA.

> **Construcción: la integración continua corre y dev ya está alojado; uat todavía no.**
> La API, el front, la base y esta especificación se verifican en cada push y cada PR ([§6.1](#61-en-cada-empuje-en-paralelo)). **Dev vive en
> Railway** desde el [ADR-032](adr/ADR-032-railway-en-dev-ahora.md), con la API en un servicio y el front en otro. Desde el [ADR-044](adr/ADR-044-dos-ambientes-desplegados.md)
> qa es una etapa de la tubería ([§6.3](#63-las-tres-etapas-cada-una-más-exhaustiva)), y desde el [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md) **este proyecto aloja dev y
> uat**, y qa desde el [ADR-056](adr/ADR-056-qa-se-aloja-desde-su-rama.md): uat llega en el [Sprint 9](08-plan-de-desarrollo.md#sprint-9), al final del desarrollo, y prod, donde trabaja el taller, vive en
> otro repositorio. Este documento fija cómo deben quedar
> antes del go-live, para que la decisión se tome ahora y no la noche de la primera publicación.
>
> **Dev se duerme, y eso no es una avería.** Su proyecto de Supabase está en plan gratuito y se pausa
> tras una semana sin actividad; con la sonda de disponibilidad mirando la base ([§2.4](#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)), un despliegue
> intentado con el proyecto pausado **no pasa a verde hasta que alguien lo despierte** en la consola
> de Supabase y reintente. El [RNF-20](03-requisitos-y-bdd.md#rnf-20) habla de los ambientes de negocio, no de dev.

---

## 1. Los cuatro ambientes

| Ambiente | Para qué sirve | Quién entra | Datos |
|---|---|---|---|
| **dev** | Desarrollo diario | Quien desarrolla | Ficticios. Se pueden borrar y volver a sembrar |
| **qa** | Etapa de la tubería: extremo a extremo, permisos y el artefacto construido una vez. **No se aloja** | Nadie: corre en la tubería | Ficticios, con semilla reproducible |
| **uat** | **El último ambiente alojado aquí, donde Gerencia aprueba** ([ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)). Se construye desde `main` del monorepo de producto, y su batería sobre datos realistas la corre la etapa `main` ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)) | Gerencia y quien desarrolla | Realistas, **anonimizados** |
| **prod** | El negocio de verdad. **Vive en otro repositorio** y recibe el artefacto tras cada release | El equipo del taller | Reales |

La semilla reproducible de qa es la que ya existe (`supabase/seed.sql`, en `prisma_db`), descrita
en [`16-base-de-datos-y-snapshots.md`](16-base-de-datos-y-snapshots.md). No se inventa otra: es la misma de la base local y la de dev,
y se aplica a un ambiente remoto con `scripts/db/sembrar.ps1` ([16 §5.2](16-base-de-datos-y-snapshots.md#52-la-semilla-en-dev-y-en-qa)).

**A uat y a prod no entra nunca.** La semilla crea usuarios con contraseña conocida y cifras
inventadas, y ahí los datos son realistas anonimizados y reales. El guion solo admite `dev` y `qa`,
así que la regla no depende de que alguien se acuerde: la etapa `main` se puebla con la semilla
anonimizada ([9.2](08-plan-de-desarrollo.md#tarea-9-2)), y en el uat alojado y en prod los usuarios los crea Gerencia desde la
aplicación. **El uat alojado nace sin nadie en `usuarios`**, y la primera cuenta se crea con la
credencial temporal de la [9.16](08-plan-de-desarrollo.md#tarea-9-16) ([ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)).

### 1.1 Las seis reglas

1. **Cada ambiente desplegado es un proyecto de Supabase distinto**, con su propia base, sus
   propias claves y su propio almacenamiento. Nunca comparten base. **Las etapas qa y `main` de la
   tubería usan la base que levanta la tubería**, no el proyecto alojado, ni siquiera la que llega
   al uat alojado ([ADR-044](adr/ADR-044-dos-ambientes-desplegados.md), [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)).
2. **Las migraciones se promueven en orden**: dev → qa → uat → prod. Nunca se aplica en
   prod una migración que no haya pasado por los tres anteriores.
3. **Una migración ya aplicada no se edita jamás.** Si estaba mal, se escribe otra que corrige.
4. **El artefacto se promueve, no se reconstruye.** Lo que pasó la etapa `main` es exactamente lo
   que corre en uat y lo que llega a prod, con la misma versión.
5. **Nunca se copian datos de prod a otro ambiente sin anonimizar.** Los nombres completos, los
   documentos y los salarios de las empleadas son datos personales bajo la Ley 1581 de 2012, y
   [`11-riesgos-y-proteccion-de-datos.md`](11-riesgos-y-proteccion-de-datos.md) ya fija su
   tratamiento. UAT lleva datos anonimizados.
6. **La configuración no vive en el código.** En Flutter entra por `--dart-define` al compilar;
   en la API, por variables de entorno. Ningún secreto queda en el repositorio.

Las reglas 2, 3 y 4 son el resto de este documento: la promoción está en el [§2](#2-la-promoción) y la
configuración de la regla 6, en el [§3](#3-la-configuración-de-cada-ambiente).

---

## 2. La promoción

### 2.1 Las migraciones suben en orden, nunca saltan

```
dev ──▶ qa ──▶ uat ──▶ prod
```

Una migración nace en dev, pasa la etapa qa con sus pruebas, pasa la etapa `main` sobre la semilla
anonimizada, se aplica en el uat alojado, y solo entonces puede ir a prod. Saltarse un escalón deja
prod con un esquema que nadie probó. En las dos etapas del medio la migración corre sobre la base que
levanta la tubería, no sobre un proyecto alojado ([§6.3](#63-las-tres-etapas-cada-una-más-exhaustiva)).

**Y en cada ambiente, la migración llega antes que la API que la necesita.** Viven en repositorios
distintos ([ADR-025](adr/ADR-025-cuatro-repositorios.md)), así que nada obliga a publicarlas
juntas: la migración tiene que ser compatible con la API que ya está corriendo, la API nueva se
publica después, y lo que quedó viejo se quita en una versión posterior.

> **El esquema vive en migraciones, no en un volcado.** Un volcado es la foto de un momento; las
> migraciones son la receta reproducible, y son lo único que puede aplicarse cuatro veces en el
> mismo orden y dar cuatro bases idénticas.

### 2.2 Una migración aplicada no se edita nunca

Es el mismo principio que ya rige el dinero y la historia del sistema:

| Dónde ya se aplica | Cómo se corrige un error |
|---|---|
| Un movimiento mal registrado (`CU-04`) | Con un **contra-asiento**, no borrando la fila |
| La base de datos ([ADR-004](adr/ADR-004-base-solo-escritura.md)) | Escribiendo encima, nunca con `DELETE` |
| Una migración ya aplicada | Con **otra migración** que corrige |

La razón es la misma en los tres casos: lo que ya ocurrió, ocurrió. Editar el archivo de una
migración que prod ya aplicó no cambia prod —ahí sigue el error— y sí deja dev y qa creyendo una
historia distinta de la real. A partir de ahí, los cuatro ambientes dejan de ser comparables y
no hay forma de saber cuál dice la verdad.

### 2.3 El artefacto se promueve, no se reconstruye

Se compila **una vez**, en la etapa qa. Ese mismo archivo —el mismo `build/web` del front, la
misma imagen de contenedor de `prisma_api`— es el que pasa la etapa `main` y el que se entrega a prod.
Lo único que cambia entre ambientes es la configuración del [§3](#3-la-configuración-de-cada-ambiente).

> **uat no corre ese archivo: se construye desde `main` del monorepo, como dev desde su rama** ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)).
> El árbol es el mismo que compiló qa, porque la etapa `main` lo comprueba; lo que puede diferir
> es la compilación. Gerencia aprueba en uat ese árbol, no el archivo que llega a prod.

> **Recompilar para prod sería aprobar una cosa y publicar otra.** Entre dos compilaciones cambia
> la versión de una dependencia, la fecha, el compilador. Lo que Gerencia firmó en UAT dejaría de
> ser lo que corre en el taller, y la firma no valdría nada.

> **Dev es la excepción, y es deliberada** ([ADR-032](adr/ADR-032-railway-en-dev-ahora.md)). Railway construye dev desde el repositorio en
> cada fusión, sin pasar por el registro, y uat igual desde el monorepo ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)). qa también, desde
> su rama ([ADR-056](adr/ADR-056-qa-se-aloja-desde-su-rama.md)). La regla de arriba gobierna **qa → prod**, que es
> donde una firma depende de ella. Dev construye desde su rama porque dev es precisamente donde se
> comprueba que la imagen construye.

**El registro es GHCR** ([9.3](08-plan-de-desarrollo.md#tarea-9-3)), con una imagen por repositorio:

| Paso | Qué pasa |
|---|---|
| Se publica | La etapa qa construye y publica `ghcr.io/juanchope039/finanzas-prisma-api:<versión>` y `…-front:<versión>`. El `+` del front pasa a `_`, que Docker no admite |
| Se reconoce | Cada imagen lleva el árbol de git del que salió, en la etiqueta OCI `prisma.arbol`. «Es la misma» se juzga por el árbol y no por el commit, porque los PR de promoción crean commits de fusión con el mismo contenido |
| No se repite | Si qa encuentra su versión ya publicada con otro árbol, falla: una versión es un solo artefacto. Con el mismo árbol, no recompila |
| Se promueve | `main` comprueba que la imagen de su versión trae su árbol, y en el empuje mueve la etiqueta `uat` hacia ella **sin recompilar**: es lo que el monorepo lleva al uat alojado ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)). La etiqueta `prod` la mueve la entrega del [§7.5](#75-la-entrega-a-prod-en-el-repositorio-del-taller), que además copia la imagen al registro del taller. Lo que llegó a `main` sin pasar por qa no encuentra su imagen y se queda en rojo |

Consecuencia práctica: la configuración del front **no puede compilarse dentro del artefacto de
prod en el momento de publicar**, porque eso es recompilar. Cada ambiente compila su propio
artefacto: el de prod lo compila la etapa qa con sus `--dart-define`, y el de uat lo compila
Railway desde `main` del monorepo de producto, con su configuración ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)).

> **El alojamiento todavía no despliega desde GHCR: construye desde la rama.** Las imágenes son
> privadas, como sus repositorios ([ADR-051](adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)), y Railway solo acepta credenciales de un registro privado
> en su plan Pro. Hacer pública la imagen no es salida: lleva la API compilada y no se recoge. Se
> intentó con la API de qa el 2026-10-15, el despliegue no pudo bajar la imagen y se volvió a la
> rama. Se retoma cuando haya plan Pro, una etapa a la vez y empezando por la API de qa.

### 2.4 El artefacto de la API: una imagen de contenedor con una JVM adentro

`prisma_api` es una aplicación Java 25 con Spring Boot, y eso decide cómo se construye, qué se
promueve y qué hace falta para alojarla:

| Asunto | Cómo queda | Por qué |
|---|---|---|
| **Construcción** | **Gradle** (`./gradlew bootJar`) produce un **JAR ejecutable** de Spring Boot: un solo archivo con la aplicación y sus dependencias | Un JAR y nada más que copiar. Lo que corre en prod no depende de qué haya instalado en la máquina, **ni siquiera del JDK**: Gradle descarga el 25 por su cuenta ([ADR-024](adr/ADR-024-java-25-y-gradle.md)) |
| **Artefacto** | Una **imagen de contenedor** en dos etapas: se compila con el JDK, se publica solo con el JRE 25 | La etiqueta de la imagen es la versión SemVer del [§4](#4-versionado). Esa imagen es la que se promueve tal cual por los cuatro ambientes |
| **Memoria** | **512 MB como mínimo** por instancia, y el contenedor arranca con `-XX:MaxRAMPercentage=75` | La JVM reserva su montón según lo que cree que tiene disponible |
| **Arranque** | Segundos, no milisegundos. La comprobación de salud espera a que termine | Un orquestador impaciente reinicia en bucle una aplicación que solo estaba arrancando |
| **Salud** | `/actuator/health`, con sondas separadas de vida y de disponibilidad | El tráfico no entra antes de que la base esté conectada y las migraciones verificadas |

> **La JVM no adivina cuánta memoria le dieron.** Si no se le dice, toma como referencia la de la
> máquina anfitriona, reserva de más y el contenedor la mata sin explicación. Ese fallo se ve como
> «la API se cae sola» y se pierde una tarde buscándolo en el código, donde no está.

Esto tiene dos consecuencias que hay que asumir, no esconder: un binario pequeño arrancaría más
rápido y pediría menos memoria, y **alojar una JVM en cuatro ambientes cuesta más**. El costo está
en el [§8](#8-el-costo-dicho-sin-adornos); el arranque en frío decide que uat y prod no pueden vivir en un plan que duerme el
servicio por inactividad, porque la primera petición después de la siesta paga el arranque entero.

---

## 3. La configuración de cada ambiente

### 3.1 El front: `--dart-define` al compilar

Flutter Web no lee variables de entorno en el navegador: los valores entran al compilar y quedan
dentro del artefacto.

| Clave | Qué es | Ejemplo en dev | Ejemplo en prod |
|---|---|---|---|
| `PRISMA_API_URL` | Dónde vive `prisma_api` | `https://api-dev.prisma.com` | `https://api.prisma.com` |
| `PRISMA_AMBIENTE` | Cuál de los ambientes es | `dev` | `prod` |
| `PRISMA_API_MAJOR` | Qué MAJOR de la API exige ([§4.3](#43-el-contrato-de-compatibilidad)) | `1` | `1` |
| `PRISMA_COMMIT` | Referencia del commit compilado | `a3f19c4` | `a3f19c4` |
| `PRISMA_FECHA_COMPILACION` | Cuándo se compiló, ISO 8601 | `2026-09-15T09:40:00-05:00` | `2026-09-15T09:40:00-05:00` |

> **`PRISMA_API_MAJOR` no se configura en el alojamiento.** Sale del repositorio del front:
> del `ARG` del `Dockerfile` y de los dos respaldos del `ci.yml`, que `ambiente_test` obliga a
> coincidir con `Config.apiMajor`. Una copia en el panel del alojamiento no la mira nadie, y la
> que había en dev se quedó en `0` hasta plantar el front contra una API `1.1.0`.

> **En el front no entra ningún secreto, nunca.** Todo lo que se compila en un Flutter Web queda
> a la vista de cualquiera que abra las herramientas del navegador. Una URL no es un secreto; una
> clave de base de datos sí. Por eso el front ya no lleva ninguna: habla con `prisma_api` y nada
> más.

### 3.2 La API: variables de entorno

| Variable | Para qué | Nota |
|---|---|---|
| `PRISMA_AMBIENTE` | Lo que responde `POST /api/v0/consultas/version` y lo que pinta la franja | `dev`, `qa`, `uat` o `prod` |
| `DATABASE_URL` | Conexión a PostgreSQL | Con el rol `prisma_api`, **sin `BYPASSRLS`** y sin ser dueño de las tablas |
| `SUPABASE_URL` | Proyecto de Supabase del ambiente | Uno distinto por ambiente |
| `SUPABASE_ANON_KEY` | Iniciar sesión contra Supabase Auth | Solo la usa la API, no el front |
| `SUPABASE_JWT_SECRET` | Verificar el token que llega en cada petición | Secreto |
| `SUPABASE_SERVICE_ROLE_KEY` | Migraciones, y crear identidades contra GoTrue | **Jamás contra PostgreSQL** ([ADR-033](adr/ADR-033-service-role-solo-en-auth.md)). Secreto aparte, con acceso aparte |
| `DOMINIO_CORREO_SINTETICO` | Armar el correo interno del login ([ADR-009](adr/ADR-009-login-por-usuario.md)) | Fijo de por vida. El front nunca lo ve |
| `ORIGENES_PERMITIDOS` | CORS: el dominio del front de ese ambiente, y solo ese | prod no acepta al front de qa. Varios se separan con comas |
| `PUERTO_FRONT` | En una máquina no hay dominio: hay un puerto. De él salen los dos orígenes que la API acepta, `http://localhost` y `http://127.0.0.1`, que para el navegador **no son el mismo** | `8080` por defecto, el del `--web-port` del front. Solo se toca si ese puerto está ocupado. Donde hay dominio manda `ORIGENES_PERMITIDOS` y este número no se usa |
| `DOCS_PROTEGIDA` | Si Swagger pide credencial. Solo uat y prod lo ponen en `true`, y lo hace su perfil ([ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)) | En dev y qa queda abierto en `/docs` ([07 §9.4](07-arquitectura.md#94-swagger-generado-del-código)) |
| `DOCS_USUARIO` · `DOCS_CLAVE` | La credencial con que se entra a Swagger en uat y en prod | **Obligatorias donde `DOCS_PROTEGIDA` esté en `true`: si faltan, las rutas del catálogo no se abren, contestan como si no existieran.** Sin `DOCS_CLAVE`, la clave es `UAT_GERENCIA_CLAVE` ([ADR-049](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md)); sin ninguna de las dos, sigue cerrado. La clave es un secreto |
| `UAT_GERENCIA_CLAVE` | La clave de Swagger cuando falta `DOCS_CLAVE` ([ADR-049](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md)). Lleva el valor de la clave inicial con que se creó la primera Gerencia del ambiente | Secreto. Donde están las dos, gana `DOCS_CLAVE` |
| `SERVER_PORT` | Dónde escucha | Spring Boot la lee tal cual, sin código de por medio |
| `SPRING_PROFILES_ACTIVE` | Qué perfil de configuración carga | Uno por ambiente. El perfil no trae secretos: trae qué se activa y qué no |
| `JAVA_TOOL_OPTIONS` | Ajustes de la JVM, empezando por `-XX:MaxRAMPercentage=75` | Ver [§2.4](#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro). Sin esto la JVM reserva según la máquina anfitriona |

### 3.3 Dónde viven los secretos

| Secreto | Dónde vive | Dónde NO |
|---|---|---|
| Claves de la API por ambiente | Gestor de secretos del proveedor de despliegue | En el repositorio |
| Claves que necesita la integración continua | Secretos del repositorio, uno por ambiente | En el archivo del pipeline |
| `SUPABASE_SERVICE_ROLE_KEY` | Secreto separado del de la base y del de las migraciones | En el front, y en cualquier conexión a PostgreSQL |
| `DOCS_CLAVE`, la de Swagger en uat y en prod | Gestor de secretos del proveedor de despliegue | En el repositorio. En `.env.ejemplo` va su nombre, con el valor vacío |
| `UAT_GERENCIA_CLAVE`, la de Swagger cuando falta `DOCS_CLAVE` | Gestor de secretos del proveedor de despliegue | En el repositorio. En `.env.ejemplo` va su nombre, con el valor vacío |

En el repositorio solo hay un `.env.ejemplo` con las claves y los valores vacíos. Sirve para
saber qué hace falta, no para arrancar nada.

---

## 4. Versionado

### 4.1 Tres cosas versionadas por separado

| Proyecto | Dónde vive la versión | Formato |
|---|---|---|
| `prisma_front` | `pubspec.yaml` | `MAJOR.MINOR.PATCH+BUILD` |
| `prisma_api` | `build.gradle.kts` | `MAJOR.MINOR.PATCH`, y la misma cadena etiqueta la imagen de contenedor |
| Esquema de base (`prisma_db`) | Migraciones numeradas + tabla `schema_version` | `MAJOR.MINOR.PATCH` |

**Cada número se escribe una sola vez, y todo lo demás lo lee** ([ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md)):

| Número | Se escribe en | Y de ahí lo leen |
|---|---|---|
| Del front | `pubspec.yaml` | La tubería, que lo compila entero en `PRISMA_VERSION`. `lib/ambiente.dart` lo repite para compilar a mano, y una prueba exige que sea el mismo |
| De la API | `build.gradle.kts` | El `application.yml`, que lo recibe al compilar, y `POST /api/v0/consultas/version`, que lo responde |
| Del esquema | La migración que inserta la fila en `schema_version` | `POST /api/v0/consultas/version`, que lee la última fila **de la base de ese ambiente** —con la sesión de quien pregunta; sin sesión responde `desconocido`— |

La versión del esquema que la API **necesita** es otro número y vive en otro sitio: `prisma.esquema`,
fijo en el artefacto. Es el que va a comparar la sonda de disponibilidad del [ADR-025](adr/ADR-025-cuatro-repositorios.md) y el que usa la
tubería del [ADR-029](adr/ADR-029-esquema-por-etiqueta.md). El panel muestra la que la base **tiene**, que es lo que contesta «qué estaba
corriendo».

### 4.2 Las reglas

- **Antes del go-live todo es `0.y.z`.** La primera publicación en prod es `1.0.0`. Es lo que
  dice SemVer y evita fingir una estabilidad que todavía no existe. **Ya está puesto**: la
  [tarea 9.10](08-plan-de-desarrollo.md#tarea-9-10) dejó la API en `1.0.0` y el front en `1.0.0+47`, y de ahí en adelante un MAJOR
  significa que el contrato rompió y no «todavía no hay nada que prometer».
- **Cada versión lleva su etiqueta de git, `v<versión>`, y la pone la tubería.** En cada empuje a
  `develop`, sobre el commit con que esa versión entró, y sin mover nunca una que ya exista. A mano
  se saltaba: en `prisma_db` ocho veces seguidas. Las anteriores a la `1.0.0` no la tienen. Su
  esquema, su mensaje y cuándo nace un release están en el [§4.4](#44-etiquetas-y-releases).
- **MAJOR** de la API: cambio que rompe el contrato con el front —un campo que desaparece, un
  tipo que cambia, un endpoint que se va—.
- **MINOR**: funcionalidad nueva compatible hacia atrás.
- **PATCH**: corrección que no cambia el contrato.
- **Las versiones del front y de la API son independientes.** No se sincronizan artificialmente:
  fingir que van juntas oculta cuál de las dos cambió de verdad.
- **Cada PR que cambia lo que se publica sube la versión de su proyecto un paso** —el PATCH, el
  MINOR o el MAJOR siguiente de la que había en `develop`, y nada más—, y la integración continua de
  cada repositorio lo exige con la prueba [C-05](12-pruebas-y-calidad.md#c-05) ([ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md)). Cuál de los tres pasos toca lo decide
  quien escribe, con las tres reglas de arriba; saltarse números, no.
- **Lo que no se publica no pide versión:** las pruebas, el README, la licencia, los flujos de
  `.github/` y la configuración del repositorio y del despliegue. Todo lo demás, sí, incluida una
  carpeta nueva que nadie haya listado: lo peor que eso cuesta es un PATCH de más.
- **En el front, el número de compilación sube de uno en uno con la versión**, y solo con ella: es
  el `versionCode` de Android, que solo puede crecer.
- **La versión del esquema se publica en el mismo PR que la migración**, en la última migración que
  agrega, y el bloque `1.12` de `verificar-base.sql` espera ese mismo número. Una migración que ya
  estaba no cambia nunca ([§2.2](#22-una-migración-aplicada-no-se-edita-nunca)): si cambiara, el número dejaría de describir algo fijo.

### 4.3 El contrato de compatibilidad

Para que ser independientes no signifique romperse en silencio:

| Pieza | Qué hace |
|---|---|
| `POST /api/v0/consultas/version` | La API publica su versión, la del esquema y el ambiente |
| `PRISMA_API_MAJOR` | El front declara al compilar qué MAJOR de la API necesita |
| Comprobación al arrancar | El front consulta `/version`; si el MAJOR no coincide, muestra «Esta versión ya no sirve con el servidor» y no deja seguir |
| Ventana de soporte | Cada versión de la API declara hasta cuándo sostiene el MAJOR anterior |

> **Fallar ruidoso es mejor que fallar en la pantalla 7 con un campo nulo.** Una pantalla que
> dice qué pasa y qué hacer cuesta una vez; un formulario que se cae a medio pedido cuesta cada
> día, y nadie sabe por qué.

**Subir el MAJOR es un despliegue coordinado, y deja una ventana.** La comprobación exige
**igualdad** en las dos direcciones: un front viejo contra una API nueva se planta, y uno adelantado
contra una API vieja también. Así que entre el despliegue de uno y el del otro **el front se planta,
y es correcto que se plante**: lo que hay en medio es un front hablándole a un contrato que no es el
suyo.

| Qué hacer | Por qué |
|---|---|
| Fusionar los dos PR seguidos, y mirar los dos despliegues | La ventana es de minutos, no de horas: lo que la cierra es el segundo despliegue |
| No empezarlo a media jornada del taller | La pantalla no deja trabajar, y con razón. Es el único cambio de versión del que eso se puede decir |
| Si algo sale mal, revertir **el que se publicó último** | Es la cuarta fila del [§7.2](#72-volver-atrás), y vuelve a dejar los dos del mismo lado en los segundos que midió el [§7.4](#74-el-ensayo-en-dev-con-el-reloj-en-la-mano) |

**El prefijo de la ruta no es el MAJOR de SemVer.** Todo cuelga de `/api/v0` por el
[ADR-030](adr/ADR-030-contrato-sin-get.md), y el paso a `1.0.0` no lo movió: el contrato no rompió, solo dejó de ser
provisional. Si algún día rompe, es ese ADR el que decide qué pasa con la ruta.

### 4.4 Etiquetas y releases

**Una etiqueta dice que una versión existe; un release, que se le entrega a alguien**
([ADR-059](adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md)). Las dos las pone la tubería, y ninguna persona ni sesión las crea a mano.

| | Etiqueta | Release |
|---|---|---|
| **Cuándo** | Cada vez que una versión entra a `develop`; en el monorepo, en cada entrega | Cuando esa versión llega a `main`, aprobada en uat; en el monorepo, en cada `entrega-vN` |
| **Tramo** | Desde la etiqueta anterior del mismo patrón | Desde el release anterior: junta las etiquetas intermedias |
| **Contenido** | Lo escribe la tubería: `Paso:` e `Incluye:` | Lo generan los `CHANGELOG.md` del tramo |
| **Para quién** | La tubería y quien depura | Quien adopta: el equipo y, en el monorepo, cada emprendimiento |

**El nombre.** `N` es un número sin ceros a la izquierda, y el punto y el `+` son literales:

| Repositorio | Patrón | Vale | No vale, y por qué | Nace en |
|---|---|---|---|---|
| `prisma_api` | `vN.N.N` | `v2.4.0` | `2.4.0` (sin la `v`), `v2.4` (le falta el PATCH) | `develop` |
| `prisma_front` | `vN.N.N+N` | `v2.1.3+55` | `v2.1.3` (sin `+BUILD`), `v2.1.03+55` (cero a la izquierda) | `develop` |
| `prisma_db` | `esquema-vN.N.N` | `esquema-v0.26.1` | `v0.26.1` (sin el prefijo), `esquema-0.26.1` (sin la `v`) | `develop` |
| Monorepo | `entrega-vN`, desde 1 | `entrega-v3` | `entrega-v0`, `entrega-v03`, `entrega-v1.0.0` (es un consecutivo) | `main` |

**Las reglas de toda etiqueta:**

- es anotada, nunca ligera, y **no se mueve ni se borra jamás**;
- va sobre el commit de la primera línea con que la versión entró;
- **sube un solo paso** con respecto a la anterior del mismo patrón: después de `v2.4.0` valen
  `v2.4.1`, `v2.5.0` o `v3.0.0`, y no `v2.6.0`; en el front, después de `v2.1.3+55` vale
  `v2.1.4+56` y no `v2.1.4+57`; después de `entrega-v3`, solo `entrega-v4`.

**El mensaje** tiene forma fija, y no nombra otras etiquetas: la anterior se deduce.

```text
prisma_api 2.5.0

Paso: MINOR
Incluye:
- #141 Sprint 9 / 9.18: lo que agrega la tarea
- #143 Arreglo: lo que corrige
```

- `Incluye:` son los PR fusionados en la primera línea desde la etiqueta anterior, **sin las
  fusiones de promoción** (las que vienen de `develop`, `qa`, `main` o `uat`).
- La base agrega `Migraciones:`, con los archivos nuevos del tramo, y la API `Esquema que pide:`.
- **Solo se nombra otra etiqueta para corregirla**, en un renglón `Corrige: <etiqueta>: lo que estaba
  mal`. Una etiqueta equivocada no se rehace: la siguiente lo declara.

**Lo verifica `verificar-etiquetas.sh`** en cada repositorio de código, en el empuje a `develop`.
Las etiquetas de antes del [ADR-059](adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md) llevan el mensaje viejo, y ocho de la base no cumplen el resto
(seis ligeras y dos fuera de la primera línea): están en su lista de excepciones, que solo se
encoge.

**El release** junta las entradas del `CHANGELOG.md` que caen en su tramo, y no se publica si la
versión que llega no tiene la suya (el changelog cuenta lo que llega a qa, que puede juntar varias
versiones en una entrada), o si a la API o al front les falta su imagen en GHCR con el árbol de esa versión. Su cuerpo nombra la
imagen con su digest, dice qué versiones junta y no nombra el release anterior. En el monorepo, el
mismo texto queda en `entrega/RELEASE.md`, que se reescribe en cada entrega.

---

## 5. La versión y el ambiente, visibles en el front

### 5.1 La insignia permanente

Siempre visible, discreta, **al pie de la barra lateral, abajo a la izquierda**, debajo de la
navegación. Ahí no compite con nada y es donde la gente la busca por costumbre; la barra superior
es para la identidad y las acciones de la sesión, y la versión no es ninguna de las dos cosas:

```
v0.4.2 · QA
```

| Ambiente | Cómo se ve |
|---|---|
| dev, qa, uat | Versión **y** nombre del ambiente, en color de advertencia (`--warn`) |
| prod | Solo la versión, en color neutro |

Rotular «PROD» en el sistema real es ruido: si no dice nada, es el de verdad. El nombre del
ambiente va completo y en español: `Desarrollo`, `QA`, `Aprobación`.

### 5.2 La franja de ambiente

En dev, qa y uat, además de la insignia, una **franja fija** arriba, con el mismo patrón que la
franja de «Ver como Operación» que ya existe en el mockup:

> **Ambiente de QA · los datos no son reales**

En prod no hay franja.

Esto no es adorno: es lo que evita que alguien registre la venta del día en UAT y la dé por
guardada. El patrón visual ya está construido y aprobado para exactamente este propósito
([`10-ux-y-mockups.md`](10-ux-y-mockups.md)).

### 5.3 El panel «Acerca de»

Dentro del menú de la sesión, una opción que abre un panel con:

| Dato | Ejemplo |
|---|---|
| Versión del front | `0.4.2+118` |
| Versión de la API | `0.3.9` |
| Versión del esquema | `0.3.0` |
| Ambiente | `QA` |
| Fecha de compilación | `15 sep 2026, 9:40 a. m.` |
| Referencia del commit | `a3f19c4` |

Sirve para lo que sirve de verdad: cuando alguien reporta un fallo, lo primero que hay que saber
es qué versión estaba usando y contra qué servidor.

**Y por eso ningún dato se escribe a mano en el panel:** cada uno sale de su fuente ([§4.1](#41-tres-cosas-versionadas-por-separado)).

| Dato | De dónde sale |
|---|---|
| Versión del front | El `pubspec.yaml`, **entera**, con su `+BUILD`. La insignia del [§5.1](#51-la-insignia-permanente) lleva la misma sin el número de compilación |
| Versión de la API | El `build.gradle.kts`, por `POST /api/v0/consultas/version` |
| Versión del esquema | La última fila de `schema_version` **en la base de ese ambiente**, que la API lee con la sesión de quien pregunta. El panel solo existe con la sesión abierta; sin sesión, la consulta responde `desconocido` |
| Ambiente, fecha de compilación y commit | La tubería, al compilar el artefacto |

Las dos primeras las sube cada PR y la tercera cada migración, y la prueba [C-05](12-pruebas-y-calidad.md#c-05) lo exige. Lo que el
panel no puede hacer es inventar: si la API no contesta, las dos filas que dependen de ella dicen
que no se pudo consultar.

---

## 6. Integración continua

### 6.1 En cada empuje, en paralelo

**Los trabajos que no dependen uno del otro corren a la vez.** Esperar a que termine el formato para
empezar las pruebas, o a que terminen las pruebas para construir la imagen, no evita ningún error:
solo hace esperar. La puerta para fusionar es que **todos** terminen en verde, no que corran en fila.

| Repositorio | Trabajos que corren a la vez |
|---|---|
| `prisma_api` | **Compilar y probar** —formato, compilación, regla de dependencias y todas las pruebas—, **la versión subió**, solo contra `develop`, y **el artefacto**, este solo de qa a `main`: qa construye la imagen y las demás comprueban que es la misma ([§6.3](#63-las-tres-etapas-cada-una-más-exhaustiva)) |
| `prisma_front` | **Formato y análisis**, **pruebas** —incluida la regla de frontera—, **la versión subió**, solo contra `develop`, y **compilación web** |
| `prisma_db` | **La versión subió**, que por ahora es su única comprobación: lo demás del [§6.2](#62-en-cada-promoción) necesita levantar Supabase, y llega con la tubería del [ADR-029](adr/ADR-029-esquema-por-etiqueta.md) |
| `Finanzas-PRISMA` | **Verificar la documentación**: encabezados, enlaces, referencias, plan y versiones ([`22-documentacion.md`](22-documentacion.md)) |

**A esos trabajos se les suman las dos puertas**, al final y dependiendo de todos los demás
([ADR-048](adr/ADR-048-las-ramas-principales-las-protege-github.md)): **Tubería completa**, que termina en verde en cuanto la tubería llegó al final, sin
juzgar el resultado, y **Tubería en verde**, que falla si algún trabajo quedó en rojo o cancelado.
La primera es la que exige `develop` para recibir un PR; la segunda, la que exigen `qa` y `main`.
De las dos depende **el sentido de la promoción**, que en el PR a `qa` exige que todo lo que trae
la rama ya esté en `develop`, sin excepción, y en el PR a `main`, que ya esté en `qa`
([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md), [ADR-061](adr/ADR-061-se-promueve-con-merge-commit.md)). Las dos promociones se fusionan con merge commit. Corren con `if: always()`, así que existen aunque la tubería falle: un check
exigido que nunca se reporta deja el PR bloqueado para siempre.

Lo que comprueba cada etapa:

| Etapa | Qué hace | Bloquea si… |
|---|---|---|
| Formato | `dart format --set-exit-if-changed` en el front; `Spotless` en la API | El código no está formateado |
| Análisis estático | `dart analyze --fatal-infos` en el front; compilación con `-Xlint:all -Werror` en la API | Hay un aviso sin resolver |
| Regla de dependencias | El dominio no importa nada de infraestructura ni de HTTP. En la API lo verifica `ArchUnit` | Alguien la cruzó |
| Pruebas unitarias | Las fórmulas financieras, sin base ni red ([`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md)) | Falla una |
| **Secretos** | Recorre el repositorio entero buscando **valores** y no nombres: un JWT entero, una referencia de proyecto de Supabase, una cadena de conexión con la credencial adentro, o una variable de `.env.ejemplo` que dejó de estar vacía ([RNF-24](03-requisitos-y-bdd.md#rnf-24)) | Hay un secreto pegado en un archivo versionado |
| **OpenAPI** | Regenera el documento desde los controladores y lo compara con el `openapi.json` versionado ([ADR-022](adr/ADR-022-openapi-generado.md)) | El regenerado difiere del versionado |
| Compilación | `flutter build web` y la imagen de contenedor de `prisma_api` | No compila |
| **Versión** | Compara con `develop` y exige que la versión del proyecto suba un paso si el PR cambia lo que se publica; en `prisma_db`, además, que ninguna migración vieja cambie ([C-05](12-pruebas-y-calidad.md#c-05), [ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md)) | Cambió lo que se publica y la versión no subió, o subió más de un paso |
| Documentación | `node scripts/docs/documentar.mjs verificar --base <commit>` en la especificación | Un encabezado está mal, algo quedó sin enlazar o un documento cambió sin subir su versión |

> **La documentación desactualizada deja de ser un descuido y pasa a ser una compilación roja.** El
> OpenAPI se genera del código, así que la única forma de que difiera del versionado es que alguien
> cambiara el contrato sin volver a generarlo. Actualizarlo cuesta un comando; descubrir en prod
> que Swagger describe una API que ya no existe cuesta mucho más. Es la prueba [C-04](12-pruebas-y-calidad.md#c-04) de
> [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md) y lo que hace exigible el **[RNF-30](03-requisitos-y-bdd.md#rnf-30)**.

> **Una integración continua roja no despliega, y no avisa.** Railway espera a ese mismo conjunto de
> comprobaciones antes de construir dev ([ADR-032](adr/ADR-032-railway-en-dev-ahora.md)): si falla, marca el despliegue `SKIPPED` y el
> ambiente **se queda en la versión anterior**, en verde, sin una sola señal en la pantalla. Fusionar
> no es entregar: entregar es lo que pasa **después** de que las comprobaciones pasen.

> **Y en verde tampoco despliega solo: alguien tiene que aprobarlo.** Railway deja cada despliegue
> de dev en `NEEDS_APPROVAL` hasta que una persona lo apruebe **en el panel**, y eso **no se puede
> hacer por API**: no lo expone ni la interfaz del proveedor ni su propio agente. Es una fricción
> puesta a propósito, y aquí se escribe porque el efecto es el mismo que el de arriba.
>
> Se descubrió el 2026-10-04, con **cuatro despliegues en espera** —los de las tareas [9.4](08-plan-de-desarrollo.md#tarea-9-4) y
> [9.10](08-plan-de-desarrollo.md#tarea-9-10), en los dos servicios— y dev contestando todavía la versión de antes, en verde y sin
> avisar de nada. **Mirar que la fusión entró no es mirar que dev se movió**: eso se pregunta al
> ambiente, que es lo que hace `revertir.sh ahora <url>` ([§7.4](#74-el-ensayo-en-dev-con-el-reloj-en-la-mano)).

> **Y si lo que está roto es el archivo del flujo, no hay ni registros que abrir.** GitHub no llega a
> crear ningún trabajo: la ejecución aparece con el nombre de la ruta en vez del suyo, y ahí se acaba
> el rastro. Le pasó a `prisma_front` entre el 17 y el 18 de septiembre de 2026 —un `: ` dentro de un
> escalar plano—, y dev pasó un día entero sirviendo la versión anterior mientras se fusionaban tres
> tareas. Por eso `prisma_front` comprueba ahora sus propios flujos en `flutter test`: un archivo que
> no se deja leer no puede correr el trabajo que comprobaría que se deja leer.

### 6.2 En cada promoción

Lo anterior más lo que solo se puede probar contra una base real del ambiente destino:

| Etapa | Qué hace | Por qué no basta con lo unitario |
|---|---|---|
| Migraciones | Aplica las pendientes sobre la base del ambiente | Una migración solo se sabe buena cuando corre |
| Pruebas de integración | Repositorios y transacciones contra la base real | El `if` de Java no prueba la restricción de PostgreSQL |
| **Prueba de permisos** | Sesión **real** de tipo Operación a través de la API: `POST /api/v0/consultas/nomina`, `/consultas/usuarios` y `/consultas/patrimonio` devuelven vacío o 403 | Es lo único que demuestra que RLS sigue juzgando con la API en medio |
| Traducción de errores | Recorre `pg_constraint` y exige que cada restricción nombrada tenga mensaje en español | Una regla nueva en la base sin mensaje sale al usuario como un error del motor |

La prueba de permisos es la que sostiene [ADR-006](adr/ADR-006-rls-por-rol.md) y
[ADR-012](adr/ADR-012-identidad-a-postgres.md), y se hace con un giro que no es opcional:
**se desactiva temporalmente la comprobación de la capa de
aplicación y el resultado debe ser el mismo.** Si al quitar el `if` los datos aparecen, RLS no
está actuando y la prueba falla, aunque en el ambiente de verdad nadie note nada. Las pruebas
`P-01` a `P-39` de [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md) son el catálogo concreto.

> **Una prueba de permisos que pasa por el `if` de Java no prueba permisos: prueba el `if`.**
> El único juez válido es PostgreSQL, y la única forma de comprobarlo es quitándole al juez de
> encima todo lo que pueda estar respondiendo en su lugar.

### 6.3 Las tres etapas, cada una más exhaustiva

**Una etapa es una rama, y se promueve con un PR desde la anterior** ([ADR-044](adr/ADR-044-dos-ambientes-desplegados.md)). Cada una corre lo
de la anterior y le agrega lo que es más caro o más lento, para que lo barato falle primero. Solo
despliegan tres: develop, a dev; qa, al qa alojado ([ADR-056](adr/ADR-056-qa-se-aloja-desde-su-rama.md)), y `main`, que llega al uat alojado a través del monorepo de
producto ([ADR-050](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md), [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md), [ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)).

| Etapa | Rama | Lo que agrega | Despliega |
|---|---|---|---|
| develop | `develop` | Lo del [§6.1](#61-en-cada-empuje-en-paralelo), y la integración contra la base que levanta la tubería | dev, en Railway |
| qa | `qa` | Extremo a extremo, permisos con sesión real y la traducción de errores del [§6.2](#62-en-cada-promoción). **Compila el artefacto una vez** y lo publica en GHCR con su versión ([§2.3](#23-el-artefacto-se-promueve-no-se-reconstruye)) | qa, en Railway, construido desde la rama ([ADR-056](adr/ADR-056-qa-se-aloja-desde-su-rama.md)) |
| main | `main` | La semilla realista y anonimizada, y la batería entera sobre ella, contra la base que levanta la tubería. Comprueba que el árbol es el que compiló qa y marca la imagen `uat`, en el PR desde `qa` y en el empuje de su fusión ([ADR-050](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md), [ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)) | uat, en Railway, cuando el monorepo trae este `main` a su `main` ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)) |
| prod | — | No es una etapa: es la entrega del [§7.5](#75-la-entrega-a-prod-en-el-repositorio-del-taller), que una persona dispara desde `prisma_db` leyendo `main` | prod, fuera de este proyecto |

**La prueba de permisos corre en las tres**, dos veces ([9.5](08-plan-de-desarrollo.md#tarea-9-5)): contra la base que levanta la
tubería, en el PR y en el empuje, y contra la base de dev en el empuje, porque una política puede
estar en la migración y no en el ambiente.

> **Una etapa que no despliega sigue siendo una puerta.** Lo que el [§6.2](#62-en-cada-promoción) pedía «contra una base
> real del ambiente destino» corre contra la base de Supabase que levanta la tubería, con sus
> migraciones, su RLS y sus triggers. Lo único que ninguna etapa del medio ve es lo que solo falla
> desplegado, y eso se ve en dev.

---

## 7. Publicar y volver atrás

### 7.1 Publicar

| # | Paso | Quién |
|---|---|---|
| 1 | Las pruebas del [§6.1](#61-en-cada-empuje-en-paralelo) pasan en verde en la rama | Automático |
| 2 | Se promueve a la etapa qa, que compila el artefacto una vez y corre las pruebas del [§6.2](#62-en-cada-promoción) | Automático |
| 3 | Se fusiona `qa` en `main`, la última etapa, que corre la batería entera sobre la semilla anonimizada y vuelve a comprobar que el árbol es el que compiló qa ([ADR-050](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md), [ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)) | Desarrollo |
| 4 | Se aplican las migraciones en el uat alojado, y el monorepo de producto trae `main` de cada repositorio a sus subárboles con un PR. Al fusionarlo, Railway construye uat desde `main` del monorepo **con el mismo árbol** ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)). Se avisa a Gerencia | Desarrollo |
| 5 | Gerencia revisa en uat lo que pidió y lo aprueba | Gerencia |
| 6 | Se dispara la entrega del [§7.5](#75-la-entrega-a-prod-en-el-repositorio-del-taller), que lee `main`: al monorepo de producto llegan las migraciones, la referencia al **mismo artefacto** y la etiqueta `entrega-vN`, y queda anotado versión, commit, fecha y quién aprobó | Desarrollo |
| 7 | Cada emprendimiento adopta la entrega desde su copia, cuando decide, y comprueba `POST /api/v0/consultas/version` en su prod | Cada emprendimiento |

**`main` del monorepo es lo que está en uat, no lo aprobado** ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)). Lo aprobado es solo la
etiqueta `entrega-vN` del paso 6, y es lo único que un emprendimiento adopta: nunca sigue `main`.

Las migraciones van antes que el artefacto a propósito: el esquema nuevo tiene que estar listo
cuando llegue el código que lo usa.

### 7.2 Volver atrás

Es lo que casi nadie escribe y lo que siempre hace falta. **Se decide en minutos, no se
improvisa.**

| Situación | Qué se hace |
|---|---|
| La API no arranca, o falla todo | **Reversión inmediata** al artefacto anterior |
| Una pantalla se rompe y hay forma de trabajar sin ella | Se avisa y se corrige hacia adelante |
| Los datos se están guardando mal | **Reversión inmediata**, y después se revisa qué quedó escrito |
| El front no cuadra con el MAJOR de la API | Se revierte el que se publicó último |

El procedimiento:

| # | Paso | Detalle |
|---|---|---|
| 1 | Publicar de nuevo la versión anterior | Está guardada: el artefacto se promovió, no se reconstruyó ([§2.3](#23-el-artefacto-se-promueve-no-se-reconstruye)), así que existe tal cual |
| 2 | Revertir front y API por separado | Sus versiones son independientes ([§4.2](#42-las-reglas)). Se devuelve solo el que rompió |
| 3 | Comprobar el MAJOR | Tras revertir, el front y la API tienen que seguir cumpliendo el contrato del [§4.3](#43-el-contrato-de-compatibilidad) |
| 4 | **No tocar la base** | Ver abajo |
| 5 | Anotar qué se revirtió, cuándo y por qué | Y qué versión quedó corriendo |

### 7.3 Las migraciones no se deshacen

Este es el punto que hace distinta una reversión de base de datos de una reversión de código:

> **El código vuelve atrás; el esquema no.** Una migración ya aplicada no se deshace: si el daño
> está en el esquema, se escribe **otra migración** que corrige y se promueve por los cuatro
> ambientes como cualquier otra. Deshacerla borrando lo que creó destruiría los datos que se
> escribieron mientras tanto.

De ahí sale una regla que hay que respetar al escribir cada migración, no al revertir:

**Toda migración debe dejar la base funcionando también con la versión anterior de la API.** En
la práctica: primero se agrega, después se usa, y solo mucho después —cuando ninguna versión viva
lo necesite— se retira. Una columna nueva nace aceptando nulos; una columna que sobra se deja de
escribir en una versión y se elimina en otra posterior.

Si una migración no cumple esa regla, la reversión del paso 1 deja a la versión anterior hablando
con un esquema que ya no entiende. Y entonces no hay reversión posible: solo queda corregir hacia
adelante, a las carreras y en producción, que es exactamente la situación que este documento
existe para evitar.

Para el caso extremo —datos mal escritos que hay que recuperar— el respaldo del proveedor y el
`PITR` siguen siendo la red de seguridad, descrita en
[`16-base-de-datos-y-snapshots.md`](16-base-de-datos-y-snapshots.md) y en
[`13-respaldo-y-exportacion.md`](13-respaldo-y-exportacion.md).

---

### 7.4 El ensayo en dev, con el reloj en la mano

Un procedimiento que nadie ha ejecutado es una intención. El de arriba se ensayó en **dev**, que es
el único ambiente alojado antes de uat ([ADR-044](adr/ADR-044-dos-ambientes-desplegados.md), [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)), el **2026-10-04**: los dos tareas a la vez, de uno en uno
y sin tocar la base ([tarea 9.4](08-plan-de-desarrollo.md#tarea-9-4)).

**Cómo se dispara.** En el alojamiento se vuelve a publicar el despliegue anterior. No se recompila:
se republica la construcción que ya estaba guardada, que es el paso 1 del [§7.2](#72-volver-atrás). Es **una sola acción**
—en el panel del alojamiento o por su interfaz—, y la decide una persona mirando: una reversión se
resuelve en minutos y a la vista, no a ciegas desde un script.

**Cómo se comprueba, desde fuera y por HTTP.** Que el panel del alojamiento diga «desplegado» no es
que la versión anterior esté contestando: en medio están el arranque, la conexión a la base y el
chequeo de salud. El reloj que importa es el de la persona del taller.

| Dónde | Qué se pregunta | Qué contesta |
|---|---|---|
| API | `POST /api/v0/consultas/version` y `/actuator/health/readiness` | La versión que está corriendo, y si está lista |
| Front | `/version.json`, que la compilación web de Flutter escribe sola | La versión con su número de compilación |
| Front | El commit dentro de `main.dart.js`, que `--dart-define` deja al compilar ([§3.1](#31-el-front---dart-define-al-compilar)) | De qué commit salió lo que se sirve |

En cada repositorio de código, `.github/scripts/revertir.sh` hace esas preguntas: `ahora` dice qué
hay publicado —se anota antes de tocar nada—, `vigilar` espera a la versión que tiene que volver y
dice a qué hora llegó, y en el front `confirmar` juzga el commit. Fallan si no vuelve en el plazo.

**Lo que se midió.** De la hora del disparo a la hora en que la versión anterior contestó por HTTP:

| Dónde | Qué se hizo | Tardó | Sin respuesta en medio |
|---|---|---:|---|
| API | Volver a la versión anterior | 17 s | ~4 s |
| API | Volver a la versión al día | 19 s | ~5 s |
| Front | Volver a la versión anterior | 10 s | No se vio ninguno |
| Front | Volver a la versión al día | 10 s | No se vio ninguno |

**Medio minuto, no media hora**, y eso cambia la conversación: una reversión no es el último recurso
del que hay que tener miedo, es la primera respuesta ante cualquiera de las dos situaciones que el
[§7.2](#72-volver-atrás) manda revertir de inmediato.

Y cuatro cosas más, que es para lo que sirve ensayar:

- **La API deja un hueco de cuatro o cinco segundos sin contestar; el front no deja ninguno.** El
  front cambia de contenedor con el nuevo ya listo, y la API tiene que arrancar la JVM y pasar su
  sonda. Quien revierte la API durante la jornada avisa; quien revierte el front, no hace falta.
- **Un intento de reversión puede fallar sin tumbar lo que está sirviendo.** Uno de los dos intentos
  del front falló al preparar la imagen, y la versión que estaba publicada siguió atendiendo todo
  ese tiempo. Se reintentó sin cambiar nada y entró. **Una reversión que falla no es una caída.**
- **Dos despliegues con la misma versión son indistinguibles desde fuera.** En dev pasa y es
  legítimo: a `develop` entran cambios que no suben la versión ([C-05](12-pruebas-y-calidad.md#c-05) exime las pruebas, los
  flujos y las guías), así que los tres últimos despliegues de la API llevaban el mismo número y el
  ensayo tuvo que ir al último que llevaba otro. El front se salva porque publica su commit, y **la
  API no publica el suyo por ninguna parte** ([TODO §10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar)).
- **La base no se tocó, y la versión anterior de la API habló con el esquema de hoy.** Es el paso 4
  del [§7.2](#72-volver-atrás) comprobado, no supuesto, y es la regla del [§7.3](#73-las-migraciones-no-se-deshacen) mirada desde el otro lado.

**Qué de esto vale para uat, y qué no.** El procedimiento y las comprobaciones, enteros. Los
números, como piso y no como promesa: en uat la reversión apunta al artefacto que ya pasó por
las etapas anteriores ([§2.3](#23-el-artefacto-se-promueve-no-se-reconstruye)), con su imagen etiquetada, y el uat alojado todavía no existe ([9.12](08-plan-de-desarrollo.md#tarea-9-12)). **En prod
vale solo si el otro repositorio lo adopta** ([ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md)).

---

### 7.5 La entrega a prod, en el repositorio del taller

> **Desde el [ADR-054](adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md) el destino es el monorepo de producto, uno solo**, y no el espejo de un taller.
> Cada emprendimiento parte de él con una copia o un fork, lo despliega en su propia infraestructura
> y adopta cada entrega desde ahí. Las imágenes no se copian a ningún registro: se quedan donde las
> construyó qa, y el emprendimiento las lee con un permiso que se le concede y se le quita. Lo que un
> emprendimiento ajusta vive en las variables y los secretos de Actions y en `personalizacion/`, y
> lo demás, `.github/` incluido, solo lo escribe la entrega. Instalar es copiar el monorepo, cargar
> tres secretos y correr «Instalar»; actualizar es correr «Actualizar» con la etiqueta. Lo de abajo
> sigue valiendo en todo lo demás.

**Prod no es una etapa de la tubería: es una entrega**, y la dispara una persona desde `prisma_db`,
con `.github/workflows/entregar-release.yml`, después del paso 5 ([ADR-052](adr/ADR-052-la-entrega-del-release-a-prod.md)). El destino es un
repositorio espejo de la cuenta del taller, al que los documentos llaman **prisma-estampados**: su
propietario y su nombre salen de dos variables del repositorio, porque esta especificación es
pública.

**Sale de `main`**, que desde el [ADR-050](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) es la última etapa: entra por PR desde `qa`, su CI
vuelve a comprobar que el árbol es el que compiló qa, y el monorepo lo lleva al uat alojado, donde
Gerencia lo aprueba ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)).

**Qué recibe.** El árbol fuente de `main` de los tres repositorios —la API, el front y las
migraciones— y, además, las dos imágenes que compiló qa, copiadas al registro de esa cuenta con
`imagetools create`: el manifiesto y las capas, sin recompilar y conservando el label
`prisma.arbol`. El pipeline del taller despliega la imagen; el código viaja para que lo tenga.

| Qué va en el sobre | Para qué |
|---|---|
| `api/`, `front/`, `db/` | El árbol aprobado. Está para auditar, no para compilar |
| `entrega/release.json` | Las tres versiones, los tres commits, los tres árboles, las dos imágenes, la fecha y quién aprobó |
| `entrega/HISTORIAL.md` | Una fila por entrega, que escribe el flujo |
| `entrega/DESPLIEGUE.md` y `compose.yaml` | El orden —migraciones y después el artefacto— y con qué se levanta |
| `entrega/revertir.md` | El procedimiento del [§7.2](#72-volver-atrás) y del [§7.4](#74-el-ensayo-en-dev-con-el-reloj-en-la-mano), para que el taller lo adopte |
| `entrega/plantillas/desplegar.yml` | Un pipeline de referencia. El `.github/` del espejo es del taller y la entrega no lo toca |

**Qué no va.** La semilla, ni la de uat; ningún `.env`; `pila/` ni los guiones de promoción. De la
base sale una lista explícita y corta en vez de una exclusión, porque una exclusión se olvida más
fácil. En prod los usuarios los crea Gerencia desde la aplicación.

**Las dos llaves y las seis puertas.** Hay que decir quién aprobó y escribir entero el nombre del
repositorio espejo, como `promover.ps1` pide la referencia del proyecto; y `en-seco` viene
encendido. Antes de escribir nada, el flujo comprueba que la imagen de cada pieza existe, que su
`prisma.arbol` es el árbol de `main`, que la etiqueta `:uat` apunta a ese mismo árbol, que la API
no pide un esquema que la base no publique, que el sobre no lleva nada con forma de secreto, y que
el nombre coincide.

> **La puerta mira `:uat`, que marca el empuje a `main`.** La etiqueta conserva su nombre porque
> dice lo que el monorepo lleva al uat alojado, aunque Railway lo compile desde el monorepo y no
> desde la imagen ([ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md)).

**Un commit y una etiqueta `entrega-vN` por entrega**, y nada del desarrollo interno. Ese empuje,
que va con una llave de despliegue, es lo que dispara el pipeline del otro lado: un empuje hecho
con el `GITHUB_TOKEN` del flujo no dispararía nada.

**Lo que hace falta antes de la primera entrega** no es código: las variables `PROD_API_URL` y
`PROD_API_MAJOR` en `prisma_front`, sin las cuales la etapa qa se salta el artefacto de prod con un
aviso; el repositorio espejo con su llave de despliegue; la credencial de paquetes de esa cuenta;
un token con lectura de la API y del front, que son privados ([ADR-051](adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)); y el proyecto de Supabase
de prod, que lo paga ese lado.

---
## 8. El costo, dicho sin adornos

[ADR-001](adr/ADR-001-stack.md) declaró **presupuesto de operación cero**. Ese objetivo ya no se
sostiene, y por eso el **[RNF-14](03-requisitos-y-bdd.md#rnf-14) se reescribió**: lo que se exige es **costo mensual de operación al
mínimo sostenible**, no cero. Hay que saberlo antes del go-live, no el día del go-live.

Dos cosas lo rompen, cada una por su lado:

| Qué rompe el costo cero | Por qué |
|---|---|
| **[RNF-20](03-requisitos-y-bdd.md#rnf-20) · siempre en línea** | El plan gratuito de Supabase pausa el proyecto tras una semana de inactividad. Un taller que factura los lunes encontraría el sistema dormido |
| **La API en Java** ([ADR-017](adr/ADR-017-api-en-java.md)) | Una JVM pide memoria y tarda segundos en arrancar ([§2.4](#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)). **Alojar una JVM en cuatro ambientes cuesta más que alojar un binario pequeño**, y eso fue parte del precio de elegir Java |

### 8.1 Qué se paga y qué no

| Ambiente | Base de datos | Alojamiento de la API | Por qué |
|---|---|---|---|
| dev | Gratuito | Gratuito, o en la máquina de quien desarrolla | Que se pause por inactividad no molesta a nadie |
| qa | Gratuito, y quieto | No se aloja | Es una etapa de la tubería ([ADR-044](adr/ADR-044-dos-ambientes-desplegados.md)) |
| uat | **De pago** | **De pago, sin dormirse** | Es a la vez la última etapa de la tubería y el ambiente que Gerencia aprueba, y no puede encontrarlo dormido ([ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md)) |
| prod | Lo paga el otro repositorio | Lo paga el otro repositorio | «Siempre en línea» es el requisito, y se cumple allá |

Es, como mínimo, **un proyecto de Supabase de pago y una instancia de la API encendida** —eran dos
y dos hasta el [ADR-044](adr/ADR-044-dos-ambientes-desplegados.md)—, con 512 MB de memoria como piso ([§2.4](#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)). No es un impedimento: es una factura, y es pequeña.
Pero es mayor de la que habría con un binario de unas decenas de megabytes, y decirlo es parte de
haber elegido Java a conciencia y no por descuido.

El alojamiento de la API y del front es **Railway**. **Dev se aloja desde ya**, en plan gratuito y
asumiendo que se duerme; qa y uat, en el mismo proyecto, con un ambiente cada uno
([ADR-032](adr/ADR-032-railway-en-dev-ahora.md), [ADR-044](adr/ADR-044-dos-ambientes-desplegados.md), [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md), [ADR-056](adr/ADR-056-qa-se-aloja-desde-su-rama.md)). La máquina de quien desarrolla sigue siendo un dev
válido contra el mismo proyecto de Supabase: lo que cambia es que ahora hay además una URL que
alguien de fuera puede abrir.

> **Costo al mínimo no es costo cero, y confundirlos se paga en disponibilidad.** Lo que se ahorra
> apagando uat o dejando dormir a prod se cobra el día que Gerencia no puede aprobar, o que la
> empleada abre la aplicación y se queda esperando el arranque. El mínimo es el más barato **de los
> que cumplen [RNF-20](03-requisitos-y-bdd.md#rnf-20)**, no el más barato de todos.

Queda escrito aquí, en [ADR-013](adr/ADR-013-cuatro-ambientes.md) y en
[`09-plan-de-implantacion.md`](09-plan-de-implantacion.md) para que nadie lo descubra tarde.

---

## 9. Lo que este documento no cubre

**Este documento no repite la arquitectura.** Cómo está construido el sistema por dentro —las
capas, la regla de dependencias, el dominio, cómo `prisma_api` propaga la identidad hasta
PostgreSQL— está en [`07-arquitectura.md`](07-arquitectura.md), y ahí es donde se cambia. Aquí
solo está **con qué configuración corre cada ambiente y cómo se mueve una versión entre ellos**.

| Si buscas… | Ve a… |
|---|---|
| Cómo está construido por dentro | [`07-arquitectura.md`](07-arquitectura.md) |
| Qué se prueba y con qué criterio | [`12-pruebas-y-calidad.md`](12-pruebas-y-calidad.md) |
| Cómo se recrea la base y qué datos de prueba hay | [`16-base-de-datos-y-snapshots.md`](16-base-de-datos-y-snapshots.md) |
| Qué pasa cuando no hay señal | [`17-resiliencia-offline-y-cache.md`](17-resiliencia-offline-y-cache.md) |
| Qué objetivos de compilación se publican y cuándo | [`18-distribucion-y-pipelines.md`](18-distribucion-y-pipelines.md) |
| Qué forma tiene cada respuesta de la API y qué cabeceras lleva | [`20-contrato-de-api.md`](20-contrato-de-api.md) |

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](04-modelo-de-datos.md "04 · Modelo de datos") · [07](07-arquitectura.md "07 · Arquitectura técnica") · [08](08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [09](09-plan-de-implantacion.md "09 · Plan de implantación") · [10](10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [16](16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [18](18-distribucion-y-pipelines.md "18 · Distribución multiplataforma y automatización (pipelines)") · [20](20-contrato-de-api.md "20 · Contrato de la API") · [ADR-014](adr/ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-022](adr/ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [ADR-024](adr/ADR-024-java-25-y-gradle.md "ADR-024 · Java 25, Gradle y Spring Boot 4 en la API") · [ADR-025](adr/ADR-025-cuatro-repositorios.md "ADR-025 · Cuatro repositorios: la base de datos sale de la API") · [ADR-026](adr/ADR-026-railway-al-final.md "ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo") · [ADR-029](adr/ADR-029-esquema-por-etiqueta.md "ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase") · [ADR-032](adr/ADR-032-railway-en-dev-ahora.md "ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final") · [ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md "ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige") · [ADR-038](adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md "ADR-038 · La pila local se orquesta desde prisma_db, y cada receta se apunta desde su .env") · [ADR-044](adr/ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-045](adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md "ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio") · [ADR-046](adr/ADR-046-pre-prod-se-construye-desde-su-rama.md "ADR-046 · pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería") · [ADR-048](adr/ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-049](adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md "ADR-049 · Sin DOCS_CLAVE, Swagger toma PREPROD_GERENCIA_CLAVE") · [ADR-050](adr/ADR-050-main-vuelve-a-ser-la-ultima-etapa.md "ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR") · [ADR-051](adr/ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md "ADR-051 · La visibilidad de un repositorio no se cambia") · [ADR-052](adr/ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-053](adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado") · [ADR-054](adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md "ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia") · [ADR-055](adr/ADR-055-uat-se-despliega-desde-el-monorepo.md "ADR-055 · uat se despliega desde main del monorepo de producto, y lo aprobado es solo la etiqueta") · [ADR-056](adr/ADR-056-qa-se-aloja-desde-su-rama.md "ADR-056 · qa también se aloja en Railway, construido desde la rama qa") · [ADR-059](adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main") · [ADR-070](adr/ADR-070-las-migraciones-las-aplica-la-tuberia.md "ADR-070 · Las migraciones las aplica la tubería, no una persona") · [CLAUDE](../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [18 · Distribución y pipelines](18-distribucion-y-pipelines.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [20 · Contrato de la API](20-contrato-de-api.md)
