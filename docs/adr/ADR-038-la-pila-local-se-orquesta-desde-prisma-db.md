# ADR-038 · La pila local se orquesta desde `emprende_db`, y cada receta se apunta desde su `.env`

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-24 | 2026-10-30 | [Proceso](../INDICE.md#etiqueta-proceso) · [Base de datos](../INDICE.md#etiqueta-base-de-datos) |

## Contexto

Las tres piezas que corren ya saben empaquetarse: la API tiene su receta de contenedor desde la
tarea [0.8](../08-plan-de-desarrollo.md#tarea-0-8), el front desde la 0.9 y la base corre en Docker con `supabase start` desde la 1.11.
**Lo que no existía es algo que las levante juntas.** Cada carril armaba su pila a mano: levantaba
la base, le ponía la clave al rol `prisma_api`, arrancaba la API con Gradle y el front con
`flutter run`, y repartía los puertos copiando un `config.toml` que está ignorado y no se versiona.

Eso cuesta tres cosas. La primera, **el tiempo de cada arranque**, que se paga entero cada vez que
alguien cambia de rama o de máquina. La segunda, **los puertos**: el 8080 del front y el 8081 de la
API están escritos en media docena de sitios —el `.env.ejemplo` de la API, el `README` del front,
los ejemplos de `--dart-define`— y cuando uno está ocupado hay que cambiarlos en todos. Y la
tercera, la peor: **cada máquina termina con una pila distinta**, y un fallo que solo aparece en
una de ellas no se puede reproducir en las demás.

Quien dirige pidió la tarea para este sprint. Queda por decidir **dónde vive la orquestación** y
**cómo encuentra cada receta**.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **En `emprende_db`, con las recetas apuntadas desde su `.env`** | Es quien ya levanta la base y quien ya reparte los puertos en `config.toml`; su versión solo se mueve con las migraciones, así que la orquestación no le cambia el número a nadie; desde él no se despliega nada, así que un archivo de más no se acerca a ningún ambiente | Es el repositorio que menos código corre, y hay que explicar por qué |
| En un quinto repositorio, solo para la pila | Nadie es dueño de nadie | Un repositorio más que clonar, versionar y mantener al día, para dos archivos. El [ADR-035](ADR-035-repositorios-hermanos.md) ya decidió que los repositorios son cuatro |
| En `documentation` | Es de los cuatro por igual | La especificación es **pública** y no lleva nada de máquina; además no tiene nada que levantar, y quien la lee no necesita Docker |
| En la API, que es quien manda | Es el centro del sistema | Levantar la base es de la base. La API tendría que saber del `config.toml` de otro repositorio, y su versión se mueve en cada PR |
| Con las rutas escritas en el `compose.yaml` | Un archivo menos | Fija cómo se llama cada carpeta en la máquina de quien lo escribió. Quien tenga el front en otro sitio edita un archivo versionado para poder trabajar, y ese cambio viaja en su siguiente PR |

## Decisión

**La orquestación vive en `emprende_db`**, en `pila/compose.yaml`, y se levanta con
`scripts/db/pila-local.ps1`, que corre `supabase start`, le pone al rol `prisma_api` su clave
local y construye la API y el front con `docker compose`.

**Ninguna ruta va escrita.** Cada receta, cada puerto y el nombre de la pila se apuntan desde
`pila/.env`, que sale de `pila/.env.ejemplo` y está ignorado. Los valores por defecto son los de
la carpeta de trabajo del [ADR-035](ADR-035-repositorios-hermanos.md), así que quien tenga los cuatro repositorios como
hermanos arranca sin tocar nada.

**La base sigue siendo la de Supabase**, levantada por su CLI, y no un `postgres:16` dentro del
`compose.yaml`.

## Justificación

**`emprende_db` es el sitio con menos efectos secundarios.** Ya levanta la base, ya reparte los
puertos y **su versión solo se mueve con las migraciones**: un archivo de orquestación no le hace
subir el número a nadie ni entra en la cuenta de ningún despliegue. Desde este repositorio no se
publica ninguna imagen, así que lo que se escriba aquí no puede llegarle a un ambiente por
descuido.

**La base no cabe en el `compose.yaml`, y eso no es un detalle.** La base de Emprende no es «un
PostgreSQL»: es un proyecto de Supabase con el esquema `auth` y sus roles, con GoTrue, con Storage
y con `pg_cron`. Sin `auth.uid()` no hay política que juzgar, y **todo lo que este proyecto protege
depende de eso** ([ADR-006](ADR-006-rls-por-rol.md)). Un `postgres:16` escrito a mano sería una base parecida, con la que
las pruebas de permisos pasarían por no tener nada que juzgar. Quien sabe levantar la de verdad,
con las versiones que le tocan, es el CLI de Supabase.

**Las rutas en el `.env` son lo que hace que la pila sea de cada quien.** Un `compose.yaml` con
`../backend-api` escrito dentro obliga a que la carpeta se llame así en todas las máquinas, y el
día que alguien la llame distinto tiene que editar un archivo versionado para poder trabajar —y ese
cambio viaja en su siguiente PR—. Con el `.env` afuera, la pila se adapta a cada máquina y el
repositorio no se entera.

**Y ninguna clave se versiona.** Las tres de GoTrue local las lee el guion de `supabase status`
—son iguales en todas las máquinas y no valen en ningún proyecto real— y la del rol `prisma_api`
vale solo contra la base de esa máquina. `pila/.env` está ignorado, y `pila/.env.ejemplo` dice qué
variables hacen falta sin llevar el valor de nadie.

## Consecuencias

**Positivas**

- Un solo comando levanta las tres piezas, y las levanta igual en todas las máquinas.
- Los puertos se cambian **en un solo sitio**, y el front se recompila apuntando al que la API
  publica: cambiar `EMPRENDE_API_PUERTO` mueve las dos cosas a la vez.
- Probar una receta nueva no obliga a tocar la de verdad: se apunta otra con `EMPRENDE_API_RECETA`.
- Se pueden levantar dos pilas a la vez —una por rama— cambiando `EMPRENDE_PILA_NOMBRE`.

**Negativas**

- `emprende_db` gana una carpeta que no es de la base, y hay que explicar por qué está ahí. Este ADR
  es esa explicación.
- La pila **no es la de producción**: en dev el front lo sirve nginx desde el contenedor, y quien
  esté trabajando en una pantalla sigue queriendo `flutter run` con su recarga en caliente. La pila
  sirve para probar el conjunto, no para escribir código de pantalla.
- Construir las dos imágenes la primera vez tarda, y baja la imagen de Flutter entera.

**A vigilar**

- **La receta del front compila la URL de la API dentro del artefacto** ([19 §3.1](../19-ambientes-y-entrega.md#31-el-front---dart-define-al-compilar)): si alguien
  levanta la pila con un puerto y abre el front que construyó con otro, la página se ve bien y
  habla con el puerto de antes. Por eso el `compose.yaml` saca las dos del mismo `.env`.
- Si un día la API necesita una variable nueva, hay que acordarse de este `compose.yaml`: el
  `.env.ejemplo` de la API y este archivo dicen cosas parecidas en dos sitios.

## Referencias

- [`21-trabajo-en-paralelo.md`](../21-trabajo-en-paralelo.md) [§6.4](../21-trabajo-en-paralelo.md#64-ambientes) · los ambientes de cada carril
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) · la configuración no vive en el código, y el front la compila dentro
- [ADR-006](ADR-006-rls-por-rol.md) · los permisos viven en PostgreSQL, que es por lo que la base tiene que ser la de verdad
- [ADR-035](ADR-035-repositorios-hermanos.md) · los cuatro repositorios son hermanos en una carpeta de trabajo
- Tarea [3.25](../08-plan-de-desarrollo.md#tarea-3-25) del plan de desarrollo

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-067](ADR-067-el-plan-no-tiene-carriles.md "ADR-067 · El plan no tiene carriles: cada tarea dice dónde vive")
<!-- /generado:referenciado-desde -->
