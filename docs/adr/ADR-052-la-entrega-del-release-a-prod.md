# ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.2.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-052-la-entrega-del-release-a-prod.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-05 | 2026-10-13 | [Entrega](../INDICE.md#etiqueta-entrega) · [Plan](../INDICE.md#etiqueta-plan) |

> **Lo modifica [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md):** Gerencia aprueba en uat, no en pre-prod, que se quitó. La entrega no
> cambia de forma: sale del árbol de `main`, no recompila nada y la dispara una persona. El cuerpo de
> abajo se conserva tal como se escribió.
>
> **Lo modifica [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md):** el destino ya no es el espejo de un taller sino el monorepo de producto,
> uno solo, del que cada emprendimiento adopta las entregas desde su copia. Las imágenes no se copian
> a ningún registro ajeno: se quedan donde las construyó qa.

## Contexto

El [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md) puso prod fuera de este proyecto: el taller trabaja allá, con sus datos reales, y recibe
el artefacto tras cada release. Y dejó el hueco escrito con todas sus letras, en la 9.15: **falta
decir cuál es ese repositorio, qué recibe y quién la dispara.**

El [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) movió después la última etapa a la rama `pre-prod`, que Railway compila como compila dev
desde `develop`. Eso cambió qué es lo que Gerencia aprueba: **aprueba un árbol**, no un archivo. La
etapa comprueba que ese árbol es el que compiló qa, pero lo que Gerencia ve corriendo es una
compilación de Railway.

Y el [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) devolvió a `main` su oficio: la cadena es develop → qa → uat → pre-prod → main, y lo
aprobado entra ahí por PR, donde la CI vuelve a comprobar el árbol. Ese ADR dejó escrito lo que
esta decisión cierra: «cuando se decida la 9.15, la entrega puede salir de `main` y no de
`pre-prod`: se dice entonces, en su ADR».

Por eso esta decisión carga más de lo que cargaba. La etiqueta `:prod` del registro está libre desde
el [19 §2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye), reservada para aquí, y la imagen que qa construyó de ese mismo árbol sigue guardada. Si
la entrega no la lleva, prod correría una **tercera** compilación del árbol: ni la de qa ni la que
Gerencia tuvo delante.

Quien dirige lo definió el 2026-10-05: **el taller tiene su propia cuenta de GitHub**, y ahí vive un
repositorio con la aplicación entera. El release se ejecuta a mano desde este lado, y los pipelines
del otro lado despliegan.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Un repositorio espejo con todo, disparado a mano, con el árbol fuente y la imagen** | Un disparo, un sobre y un pipeline del otro lado. El taller se queda con el código que paga, y corre la imagen que qa compiló del árbol aprobado, sin recompilar | Un repositorio más que mantener, y la cuenta del taller necesita credenciales que este proyecto tiene que guardar |
| Tres espejos, uno por repositorio | Cada uno es espejo fiel del suyo, y el pipeline de cada pieza es independiente | Hay que coordinar tres disparos en el orden correcto para que la API no llegue antes que su migración, y el manifiesto de la entrega se escribe a tres manos |
| Solo el artefacto, sin código | El sobre es mínimo y no hay nada que recompilar por error | El taller no se queda con el código que paga, y no puede auditar lo que corre |
| Solo el código, y que compilen allá | Este proyecto no necesita conocer la URL ni el MAJOR de prod | Sería la tercera compilación del mismo árbol, hecha otro día y con otras dependencias. Rompe la regla 4 del [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas) justo donde hay datos reales |
| El espejo con la historia de git entera | `git push --mirror` y no hay nada que armar | El taller recibe el historial de desarrollo, las ramas y los PR. Lo que necesita es qué corre hoy, no cómo se llegó |
| Que salga de `pre-prod` y no de `main` | Es literalmente lo que Gerencia tuvo delante, compilado por Railway desde esa rama | Podría correr antes del PR a `main`, y entonces la rama por defecto quedaría por detrás de lo que corre en el taller |
| Que la dispare la tubería al empujar a `main` | No se olvida, y no depende de que alguien esté | Empujar no es entregar: entre la aprobación y prod hay una persona decidiendo, y un disparo automático la saltaría |

## Decisión

**El destino es un repositorio espejo en la cuenta del taller, uno solo, con la aplicación entera
dentro.** En los documentos se le llama **prisma-estampados**, y el propietario y el nombre exactos
salen de `vars.ESPEJO_PROPIETARIO` y `vars.ESPEJO_REPO`: la especificación es pública y no lleva
cuentas ([`CLAUDE.md` §1](../../CLAUDE.md#1-los-cuatro-repositorios)).

| Qué | Cómo queda |
|---|---|
| **De dónde sale** | De `main` en los tres repositorios, que desde el [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) es la quinta y última etapa: ahí entra por PR el árbol que Gerencia aprobó en pre-prod |
| **Qué recibe** | Ese árbol fuente —la API, el front y las migraciones de la base— **y además** las dos imágenes que compiló qa, copiadas al registro de esa cuenta |
| **Qué historia tiene** | Un commit y una etiqueta `entrega-vN` por entrega. Ninguna rama ni commit del desarrollo interno |
| **Quién la dispara** | Una persona, con `workflow_dispatch`, después de que Gerencia aprueba en pre-prod y de que eso entra en `main`. Nunca un empuje |
| **Desde dónde** | `prisma_db`, en `.github/workflows/entregar-release.yml`: es el orquestador por el [ADR-038](ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md) y la entrega empieza por sus migraciones |
| **Con qué credenciales** | Una llave de despliegue SSH para el git del espejo, una credencial de paquetes para su registro —una llave SSH no sirve para un registro— y un token con lectura de la API y del front, que son privados ([ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md)) |

- **La imagen se copia, no se reconstruye.** `imagetools create` mueve el manifiesto y las capas y
  conserva el label `prisma.arbol`, así que el otro lado puede comprobar por sí mismo que la imagen
  salió del árbol aprobado. **La regla 4 del [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas) vuelve a valer de qa a prod**, que es donde el
  [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) la había dejado debilitada.
- **El código viaja para que el taller lo tenga, no para que lo compile.** El `README.md` del
  espejo lo dice como lo único que no se puede hacer.
- **La etiqueta `:prod` la mueve esta entrega**, en el registro de origen y en el del taller, que es
  lo que el [19 §2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye) había reservado.
- **El empuje de la etiqueta es lo que dispara el pipeline del otro lado.** Una llave de despliegue
  sirve para eso; el `GITHUB_TOKEN` del propio flujo no dispararía nada.
- **El `.github/` del espejo es del taller y la entrega no lo toca.** El sobre sincroniza `api/`,
  `front/`, `db/`, `entrega/` y el `README.md`, y nada más. En `entrega/plantillas/` va un pipeline
  de referencia, para que lo copien si quieren.
- **El número de la entrega es un consecutivo que lleva el espejo**, no una cuarta versión SemVer.
  Las tres versiones del [ADR-014](ADR-014-semver.md) viven dentro de `entrega/release.json`, con los commits, los
  árboles, las imágenes, la fecha y quién aprobó, que es lo que pide el [19 §7.1](../19-ambientes-y-entrega.md#71-publicar) paso 6.

### Las dos llaves, y las puertas

**Se dispara con las dos llaves de `promover.ps1`**: hay que decir quién aprobó y escribir entero el
nombre del repositorio espejo. Y una tercera, que es que **`en-seco` viene encendido**: la corrida
que nadie pidió a propósito no escribe nada.

Antes de escribir, seis puertas. Ninguna es nueva como idea: son las que ya existen, corridas en el
momento de entregar.

| # | Puerta |
|---|---|
| 1 | La imagen de la API con la versión de `main` existe, y su `prisma.arbol` es el árbol de esa rama |
| 2 | Lo mismo con la imagen de prod del front, que es su única imagen desde el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) |
| 3 | La etiqueta `:uat` de cada una apunta a ese mismo árbol: es la última etapa que marca, y la que corrió la batería entera |
| 4 | La API no pide un esquema que la base no publique: la migración llega antes ([19 §2.1](../19-ambientes-y-entrega.md#21-las-migraciones-suben-en-orden-nunca-saltan)) |
| 5 | El sobre no lleva la semilla, ningún `.env` ni nada con forma de secreto ([RNF-24](../03-requisitos-y-bdd.md#rnf-24)) |
| 6 | El nombre del espejo coincide con el que se escribió a mano |

**La puerta 3 mira `:uat` y no una etiqueta posterior.** Con `main` no se marca ninguna imagen
([ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) punto 3), y el front no marca pre-prod, porque desde el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) su única imagen es la de
prod y pre-prod lo compila Railway desde su rama. uat es la última que marca las dos por igual.

**La semilla no entra nunca**, y el sobre no la excluye: incluye una lista explícita y corta de lo
que sale de la base, porque una exclusión se olvida más fácil que una inclusión. En prod los
usuarios los crea Gerencia desde la aplicación.

## Justificación

**Lo que más se gana es que la firma de Gerencia llega hasta el taller.** El [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md) recuperó que
Gerencia apruebe el artefacto y no un commit, y el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) lo dejó aprobando un árbol. Copiando la
imagen que qa compiló de ese árbol, prod corre lo más cercano a lo aprobado que existe, y es
comprobable desde el otro lado con el mismo label que usa la tubería.

**Lo que más se pierde es que hay que confiar una credencial.** Este proyecto guarda una llave con
escritura sobre un repositorio de otra cuenta y una credencial que puede publicar en su registro.
Es el precio de que la entrega sea un acto repetible y no un archivo enviado a mano, que es lo que
el [ADR-032](ADR-032-railway-en-dev-ahora.md) descartó porque «nadie podría repetirlo ni revertirlo».

**Y se dispara a mano a propósito.** Lo que hace repetible a una entrega no es que la lance un
evento: son las seis puertas, el sobre derivado del árbol y el historial que queda escrito. Entre
la aprobación y prod hay una persona decidiendo, y un disparo automático la saltaría.

## Consecuencias

**Positivas**

- El taller corre la imagen que qa compiló del árbol que Gerencia aprobó, y puede comprobarlo él
  mismo con el label `prisma.arbol`.
- Se queda con el código que paga, con un historial de entregas legible: una por commit.
- La entrega deja escrito qué versión, qué commit, qué fecha y quién aprobó, sin que nadie lo anote.
- Los pipelines del taller son suyos: la entrega no los sobreescribe nunca.

**Negativas**

- **Hay un repositorio y un registro más que mantener**, en una cuenta que este proyecto no
  administra.
- **Tres credenciales, dos de ellas sobre una cuenta ajena**, que caducan o se rotan y que hay que
  vigilar. Sin ellas el flujo no para a mitad de camino: para en la primera puerta.
- **La configuración de prod tiene que conocerse en la etapa qa**, porque el front de prod se
  compila allí con su URL adentro. Lo anotó ya el [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md), y ahora bloquea: sin `PROD_API_URL` y
  `PROD_API_MAJOR` el trabajo se salta con aviso y no hay artefacto de prod que entregar.
- **Lo que pase después del empuje no lo ve este proyecto.** Si el pipeline del taller falla, la
  entrega quedó hecha y el despliegue no.

**A vigilar**

- **Lo que corre en prod no es byte a byte lo que Gerencia vio en pre-prod**, y no por esta
  decisión: el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) hizo que pre-prod se compile en Railway. Las dos salen del mismo árbol y la
  de prod es la de qa, que es la que pasó uat. Si algo funciona en pre-prod y falla en prod por una
  diferencia de compilación, lo que hay que revisar es el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md).
- Si el taller acaba compilando del espejo en vez de desplegar la imagen, la regla 4 se rompe sin
  que nadie lo note desde aquí. El `README.md` del sobre lo advierte, y es lo único que lo sostiene.
- El espejo acumula un árbol completo por entrega. Si llega a pesar, se mira entonces: hoy son tres
  árboles de código y 52 migraciones.
- La reversión del [19 §7.4](../19-ambientes-y-entrega.md#74-el-ensayo-en-dev-con-el-reloj-en-la-mano) vale en prod solo si el taller la adopta. El sobre lleva el procedimiento
  escrito, pero adoptarlo es del otro lado.

## Referencias

- [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md), que dejó el hueco que este llena; [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md), que movió la última etapa a su rama, y
  [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md), que devolvió `main` a la cadena y dejó esta elección a la 9.15.
- [ADR-032](ADR-032-railway-en-dev-ahora.md), que descartó el despliegue a mano sin papeleo; [ADR-038](ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md), por el que la orquestación vive
  en `prisma_db`, y [ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md), por el que la API y el front son privados.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md), con las seis reglas, las etapas y los siete pasos de publicar.
- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md), la 9.15 del [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado") · [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md "ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia")
<!-- /generado:referenciado-desde -->
