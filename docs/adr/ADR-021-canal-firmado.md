# ADR-021 · Canal firmado contra repetición y manipulación

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.2](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-021-canal-firmado.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-15 | 2026-10-30 | [Seguridad](../INDICE.md#etiqueta-seguridad) · [API](../INDICE.md#etiqueta-api) · [Contrato](../INDICE.md#etiqueta-contrato) |

> **La decisión sigue vigente; un ejemplo del cuerpo dejó de describir el sistema.** Firmar el
> método se justificaba con «convertir un `GET` en un `DELETE`». Desde
> [ADR-030](ADR-030-contrato-sin-get.md) casi todo es `POST`, así que esa pieza de la firma ya no
> separa leer de escribir: lo que separa eso es la **ruta**, y la ruta también va firmada. El
> mecanismo no cambia, y el método se sigue firmando por lo poco que aún distingue —un `PUT` de
> un `DELETE` sobre el mismo recurso—.

## Contexto

El usuario pidió **un canal seguro adicional** para las comunicaciones entre `emprende_front` y
`emprende_api`. Al preguntarle contra qué debía proteger ese canal, escogió **anti-repetición e
integridad**.

Conviene leer bien qué significa eso, porque HTTPS ya hace una parte del trabajo. TLS cifra el
tráfico e impide que un intermediario lo lea o lo altere **mientras viaja**. Lo que TLS no
resuelve es lo que pasa con una petición válida **después** de salir del dispositivo: si alguien
consigue una copia completa —el historial de un proxy, un registro mal configurado, un celular
prestado con la sesión abierta— puede volver a enviarla tal cual, y la API no tendría cómo
distinguirla de la original. Un adelanto de nómina registrado dos veces sale tan caro como uno
que no se registró.

El taller trabaja sobre redes compartidas y celulares que no administra nadie. No es un entorno
donde se pueda suponer que la única copia de una petición es la que llegó al servidor.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Firma HMAC por petición, con nonce y marca de tiempo** | Detecta el reenvío y cualquier cambio del método, la ruta o el cuerpo; se implementa con un filtro en la API y un interceptor en el front, sin piezas de infraestructura nuevas | Hay que custodiar una clave de sesión en el cliente, sostener un registro de nonce y depender de que el reloj del celular no esté muy corrido |
| Solo HTTPS, sin capa adicional | Cero trabajo y cero piezas nuevas | Protege el trayecto mientras dura la conexión, pero no distingue una petición legítima de esa misma petición reenviada después. Es exactamente el hueco que el usuario pidió cubrir |
| mTLS, con certificado de cliente | Autentica el dispositivo, no solo la sesión | **Impracticable en un navegador:** el certificado lo instala y lo elige el sistema operativo con sus propios diálogos, la página no lo controla desde JavaScript, y habría que emitir, distribuir, revocar y rotar un certificado por cada celular del taller. Y aun así no impide el reenvío desde ese mismo dispositivo |
| Cifrar la carga útil extremo a extremo, por encima de TLS | Oculta el contenido incluso ante un intermediario que rompiera TLS | **Complica depurar y Swagger:** los cuerpos dejan de ser legibles en los registros y en el visor, los ejemplos de la documentación dejan de ser reales y hay que mantenerlos aparte. Y tampoco impide el reenvío, que era justo el problema que se quería atacar |
| Endurecer el canal existente: HSTS, CSP, tokens cortos, fijado de certificado | Barato, probado y sin código propio que mantener | **No es una alternativa.** Es el suelo mínimo y va igual, con firma o sin ella. Va escrito en la decisión para que nadie lo proponga como sustituto |

## Decisión

**Cada petición del front a la API va firmada, sobre HTTPS y no en vez de HTTPS.**

Al iniciar sesión, la API entrega —además del token— una **clave de firma de sesión**. Esa clave
vive **solo en memoria** del cliente: nunca en `localStorage`, nunca en una cookie, nunca en
disco. Si la persona recarga la página, la clave se pierde y se obtiene una nueva al renovar la
sesión. Eso es deliberado: una clave que sobrevive al cierre del navegador es una clave que
sobrevive también al robo del dispositivo.

### Las tres cabeceras

| Cabecera | Contenido |
|---|---|
| `X-Prisma-Nonce` | UUID v4 único por petición |
| `X-Prisma-Timestamp` | ISO 8601 en UTC |
| `X-Prisma-Firma` | HMAC-SHA256 de `método + ruta + timestamp + nonce + sha256(cuerpo)` con la clave de sesión |

Firmar el método, la ruta y el hash del cuerpo es lo que da la integridad: cambiar un peso del
cuerpo o apuntar la misma petición a otra ruta invalida la firma.

### Los tres rechazos

| Caso | Código | Qué significa |
|---|---|---|
| La firma no cuadra | `40101` | El cuerpo, la ruta o el método cambiaron después de firmarse, o la clave no es la de esta sesión |
| Marca de tiempo fuera de ±5 minutos | `40102` | El reloj del dispositivo está corrido, o la petición se guardó para reenviarla más tarde |
| Nonce ya visto dentro de la ventana | `40103` | Es un reenvío literal de una petición que ya se procesó |

Los mensajes en español de esos tres códigos salen del catálogo único de
[ADR-019](ADR-019-contrato-de-respuesta.md), como los de cualquier otro código. Aquí se fija
cuándo se emiten, no cómo se redactan.

Los nonce vistos se guardan en **PostgreSQL**, en la tabla `nonces_vistos`, con vencimiento igual
a la ventana. Fuera de la ventana no hace falta recordarlos, porque la marca de tiempo ya los
rechaza, y una tarea programada los purga junto con las claves de idempotencia.

> **En memoria no sirve, y conviene decir por qué antes de que alguien lo intente.** Guardar los
> nonce en memoria de la API funciona mientras haya una sola instancia. Con dos, un reenvío que
> caiga en la instancia que no vio el nonce **pasa**: la protección desaparece justo cuando el
> sistema crece, sin fallar y sin avisar. Es el mismo modo de fallo que hace peligroso conectar
> la API con la clave de servicio ([ADR-012](ADR-012-identidad-a-postgres.md)): no se rompe, deja
> de proteger.

No hace falta infraestructura nueva. Ya hay base de datos y ya existe el patrón idéntico
funcionando: la tabla de claves de idempotencia de [ADR-020](ADR-020-idempotencia.md), con su
mismo vencimiento y su misma purga. El costo es **una consulta más por petición**; a cambio, la
protección sobrevive a tener más de una instancia sin que nadie tenga que acordarse de nada.

**Cinco minutos de ventana es un equilibrio, no una cifra bonita.** Más corta empieza a rechazar
peticiones legítimas de celulares reales, que llevan el reloj corrido con toda naturalidad; más
larga le regala al atacante justo eso, más tiempo para reenviar algo capturado. Cinco minutos
cubre el desajuste normal de un teléfono sin dejar una puerta abierta media hora.

**El nonce y la clave de idempotencia no son lo mismo y no se deben confundir.** El nonce cambia
en cada intento y sirve para rechazar el reenvío; la `Idempotency-Key` se conserva entre los
reintentos de la misma intención y sirve para que esa repetición legítima no cobre dos veces
([ADR-020](ADR-020-idempotencia.md)). Un reintento del front lleva **nonce y firma nuevos, con
la misma clave de idempotencia**.

### La higiene que va de base

No es una alternativa a lo anterior, es el suelo mínimo y va igual: HSTS, CSP estricta, tokens de
vida corta con rotación del token de refresco, cookies `HttpOnly` y `SameSite`, y fijado de
certificado en las compilaciones nativas de Flutter, donde sí es posible.

## Justificación

**Cifrar no es lo mismo que distinguir.** TLS garantiza que nadie en medio lea ni altere la
petición, pero una copia exacta reenviada después es, para el servidor, indistinguible de la
original. El nonce es lo que la vuelve distinguible: cada petición solo vale una vez.

**La marca de tiempo es lo que hace que el registro de nonce sea sostenible.** Sin ella habría
que recordar todos los nonce para siempre. Con ella, basta con recordarlos cinco minutos.

**La clave solo en memoria es lo que hace que el mecanismo no se vuelva su propio riesgo.** Una
clave de firma guardada en `localStorage` queda al alcance de cualquier script que se cuele en la
página, y entonces el atacante no necesita reenviar nada: firma lo que quiera.

**El filtro va en la capa de interfaz**, junto al sobre de respuesta y al filtro de idempotencia
([ADR-002](ADR-002-arquitectura-hexagonal.md)): es un asunto de transporte y el dominio no debe
enterarse de que existe.

### Lo que esto NO protege, escrito para que nadie se confíe

> **Esto protege el trayecto, no el extremo.** Impide que alguien reenvíe una petición capturada
> o la manipule en el camino. **No protege de un cliente comprometido:** en un navegador, la
> clave de firma vive en memoria de JavaScript, y quien controla la página controla la clave.

Creer que esto sustituye a la autenticación, a los permisos o a RLS sería peligroso. Es una capa
más, y la única que de verdad decide sigue siendo la base de datos
([ADR-006](ADR-006-rls-por-rol.md), [ADR-012](ADR-012-identidad-a-postgres.md)).

## Consecuencias

- **Positivas:** una petición capturada no se puede reenviar; una petición alterada no pasa;
  el rechazo es explícito y con código propio, así que se ve en los registros en vez de pasar
  por un error genérico; y la clave, al vivir solo en memoria, no queda en el dispositivo
  después de cerrar.
- **Negativas:** un celular con el reloj muy corrido recibe `40102` y no entiende por qué, así
  que soporte tiene que saber que la primera pregunta es la hora del teléfono. Cada petición
  cuesta un HMAC, un hash del cuerpo y **una consulta más a la base** para el registro de nonce,
  que es poco pero no es cero, y ata la disponibilidad de la firma a la de la base de datos.
  Y probar la API a mano con `curl` deja de ser trivial: hay que firmar, así que el proyecto
  debe entregar un script que firme, o depurar se vuelve un castigo.

## Referencias

- [ADR-006 · Permisos con Row Level Security](ADR-006-rls-por-rol.md) — la capa que sí decide.
  Esta firma no la reemplaza.
- [ADR-009 · Acceso con nombre de usuario, no con correo](ADR-009-login-por-usuario.md) — el
  inicio de sesión donde se entrega la clave de firma.
- [ADR-012 · La API propaga la identidad a PostgreSQL](ADR-012-identidad-a-postgres.md) — la
  identidad viaja aparte de la firma y sigue llegando viva hasta la base.
- [ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API](ADR-017-api-en-java.md)
  — el filtro de firma es un filtro de Spring.
- [ADR-019 · Contrato de respuesta y catálogo de códigos](ADR-019-contrato-de-respuesta.md) — de
  ahí salen los mensajes de `40101`, `40102` y `40103`.
- [ADR-020 · Idempotencia obligatoria en toda escritura](ADR-020-idempotencia.md) — resuelve un
  problema distinto y complementario al de este ADR.
- [`11-riesgos-y-proteccion-de-datos.md`](../11-riesgos-y-proteccion-de-datos.md)
- [`07-arquitectura.md`](../07-arquitectura.md)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [ADR-020](ADR-020-idempotencia.md "ADR-020 · Idempotencia obligatoria en toda escritura") · [ADR-030](ADR-030-contrato-sin-get.md "ADR-030 · El contrato no usa GET: toda operación viaja por POST bajo /api/v0")
<!-- /generado:referenciado-desde -->
