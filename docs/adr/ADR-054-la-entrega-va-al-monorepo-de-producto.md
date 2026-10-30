# ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-054-la-entrega-va-al-monorepo-de-producto.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-13 | 2026-10-30 | [Entrega](../INDICE.md#etiqueta-entrega) · [Plan](../INDICE.md#etiqueta-plan) |

## Contexto

El [ADR-052](ADR-052-la-entrega-del-release-a-prod.md) escribió la entrega para **un** taller: un repositorio espejo en la cuenta del taller,
al que llegan el árbol de `main` y las dos imágenes que compiló qa, copiadas a su registro. La 9.15
lo dejó construido y sin correr nunca.

Quien dirige precisó el 2026-10-13 que Emprende no es para un solo taller. Hay **dos proyectos**:

- **el de desarrollo**, que son los cuatro repositorios de siempre, con sus etapas develop → qa →
  uat → main;
- **el de producción**, un monorepo de producto que mantiene y actualiza quien dirige, y que **no
  se despliega en su cuenta**. Cada emprendimiento parte de él, lo despliega en su propia
  infraestructura y con su propio dominio, y lo ajusta a sus fines.

Con eso el diseño del [ADR-052](ADR-052-la-entrega-del-release-a-prod.md) no escala. Cada emprendimiento nuevo pediría una llave de despliegue
y una credencial de publicación más, guardadas en `emprende_db`, y una corrida de entrega por cliente.
Y quedaba sin decir lo más delicado: **qué puede ajustar un emprendimiento sin que la siguiente
versión le choque**.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Entregar una vez al monorepo, y que cada emprendimiento adopte desde su copia** | Una corrida y un juego de credenciales, crezca lo que crezca la lista. Cada emprendimiento decide cuándo actualiza su prod. Los clientes no se nombran en ningún sitio de este proyecto | Cada emprendimiento necesita un flujo propio para adoptar, y lectura de los dos paquetes del registro |
| Empujar desde `emprende_db` a N espejos, con una matriz de destinos | Nadie del otro lado tiene que hacer nada | N llaves y N credenciales de publicación en `emprende_db`. La lista de clientes tiene que vivir en algún sitio, y la especificación es pública. Un cliente caído deja la corrida a medias |
| Copiar las imágenes al registro de cada emprendimiento | Cada uno es dueño de su imagen | Una credencial de publicación por cliente. Y no agrega garantía: `prisma.arbol` se comprueba igual leyendo la imagen de origen |
| Que cada emprendimiento compile su imagen | No hace falta compartir el registro | Una compilación por cliente del mismo árbol, otro día y con otras dependencias. Rompe la regla 4 del [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas) justo donde hay datos reales |
| Dejar que cada emprendimiento cambie el código del monorepo | Máxima libertad | Ya no puede correr la imagen aprobada, y cada versión nueva le llega como un merge con conflictos. Tarde o temprano deja de actualizar |

## Decisión

**La entrega del [ADR-052](ADR-052-la-entrega-del-release-a-prod.md) cambia de destino, no de forma.** `entregar-release.yml` sigue en
`emprende_db`, se dispara a mano con las mismas llaves y las mismas seis puertas, y sale de `main`.
Lo que cambia es adónde va y qué hace cada emprendimiento con ella.

| Qué | Cómo queda |
|---|---|
| **A dónde va** | Al monorepo de producto, uno solo. Su propietario y su nombre siguen saliendo de `vars.ESPEJO_PROPIETARIO` y `vars.ESPEJO_REPO`: esta especificación no los escribe |
| **Las imágenes** | **No se copian.** Se quedan en el registro donde las construyó qa, con su `prisma.arbol`, y la entrega mueve ahí la etiqueta `:prod`. `entrega/release.json` las nombra por su digest |
| **Cada emprendimiento** | Parte del monorepo con una copia o un fork en su cuenta, y lo despliega en su infraestructura, con su dominio, sus secretos y su proyecto de Supabase |
| **Cómo actualiza** | Con el flujo «Actualizar», que se dispara a mano con la etiqueta `entrega-vN`: trae esa etiqueta del monorepo, comprueba que cada imagen existe y que su `prisma.arbol` es el del sobre, la fusiona y despliega, con las migraciones antes que la API |
| **Qué acceso necesita** | Lectura del monorepo y de los dos paquetes del registro, que quien dirige concede y quita por emprendimiento |

### La frontera de lo que se ajusta

**Un emprendimiento ajusta su despliegue, no el producto.** El monorepo se parte en tres zonas, y
ninguna la escriben los dos lados:

| Zona | Quién la escribe | Qué pasa al adoptar una versión |
|---|---|---|
| `api/`, `front/`, `db/`, `entrega/`, `.github/` y el `README.md` de la raíz | Solo la entrega | Se reemplaza entera. Quien la toque pierde la garantía de la imagen y compila por su cuenta |
| Las variables y los secretos de Actions, y los paneles de su proveedor | Solo el emprendimiento | No viven en archivos, así que ninguna fusión los toca |
| `personalizacion/` | Solo el emprendimiento | La entrega la crea vacía, con su `README.md`, y no la vuelve a tocar |

- **Con la frontera respetada, adoptar no puede chocar**: las dos partes nunca escriben en el mismo
  archivo. La fusión de la etiqueta es siempre limpia, y si no lo es, el emprendimiento cruzó la
  frontera.
- **Las migraciones propias van en `personalizacion/`**, en un esquema propio y nunca en `public`,
  y se aplican después de las del producto. No publican `schema_version`: esa historia es del
  producto y la API la exige entera.
- **Los flujos viajan listos en `.github/`, y los escribe solo el producto.** Esto modifica al
  [ADR-052](ADR-052-la-entrega-del-release-a-prod.md), que dejaba `.github/` al taller: con varios emprendimientos, que cada uno mantenga sus
  flujos es trabajo repetido. Lo que cambia de uno a otro entra por variables y secretos.
- **Cada entrega lleva `entrega/NOTAS.md`**: las versiones, las migraciones nuevas y las variables
  nuevas o renombradas, que es lo que un emprendimiento necesita saber antes de adoptar.
- **«Sync fork» de GitHub no sirve para adoptar**, porque no trae etiquetas. Se adopta trayendo la
  etiqueta del remoto del producto, desde una copia o desde un fork por igual.

### Desplegar cuesta lo mínimo

Quien dirige lo pidió el 2026-10-13: **instalar Emprende en un emprendimiento nuevo tiene que costar
el mínimo esfuerzo.** Por eso hay un solo camino soportado, automatizado de punta a punta:

1. **Copiar el monorepo** a su cuenta.
2. **Cargar tres secretos** en Actions: un token de Supabase, un token de Railway y una credencial
   de lectura del registro. Nada más se escribe a mano.
3. **Correr «Instalar» una vez.** Crea el proyecto de Supabase, aplica las migraciones, genera la
   contraseña del rol `prisma_api` y las claves que falten y las guarda en los servicios, crea la
   API y el front en Railway desde las imágenes, pone los dominios y comprueba
   `POST /api/v0/consultas/version`. Las claves generadas no pasan por ningún archivo ni registro.
4. **Correr «Actualizar» con `entrega-vN`** cada vez que quiera una versión nueva: trae la etiqueta,
   comprueba las imágenes, migra y despliega en un solo disparo.

La primera cuenta de Gerencia la crea la persona desde la aplicación, con la credencial temporal de
la 9.16. Otro proveedor es posible, pero no es el camino fácil: queda del lado de quien lo elija.

## Justificación

**Lo que más se gana es que el costo de un emprendimiento nuevo deja de caer de este lado.** La
entrega es una corrida por versión, con un juego de credenciales, y la lista de clientes no existe
en ningún repositorio de desarrollo. Darle acceso a uno más es un permiso en el registro.

**Y la firma de Gerencia sigue llegando hasta prod.** Lo que corre en cada emprendimiento es la
imagen que qa compiló del árbol aprobado en uat, comprobable desde el otro lado con el mismo label.
La frontera es lo que lo sostiene: sin ella, cada emprendimiento terminaría compilando su variante.

**Lo que más se pierde es el control de cuándo se actualiza.** Un emprendimiento puede quedarse en
una versión vieja todo lo que quiera. Es lo correcto, porque la decisión de tocar su prod con datos
reales es suya, pero las notas de cada entrega tienen que bastar para ponerse al día de varias de
golpe.

## Consecuencias

**Positivas**

- Una entrega por versión, sin importar cuántos emprendimientos haya.
- `emprende_db` deja de necesitar la credencial de publicación de una cuenta ajena.
- Cada emprendimiento actualiza cuando quiere, y la actualización es una fusión limpia.
- Instalar es copiar el monorepo, cargar tres secretos y correr un flujo.

**Negativas**

- **Los dos paquetes del registro se comparten** con cada emprendimiento, en lectura.
- **El camino fácil ata a Railway y a Supabase.** Quien quiera otra infraestructura escribe sus
  propios flujos, y entonces sí cruza la frontera en `.github/`.
- **«Instalar» necesita tokens con permiso para crear proyectos** en las dos cuentas del
  emprendimiento. Son suyos y los carga él, pero mientras estén cargados pueden crear lo que sea.
- **Lo que un emprendimiento necesite y la frontera no permita** pasa por el producto: se pide, se
  construye en los cuatro repositorios y llega en una entrega.

**A vigilar**

- **Un fork de un repositorio privado puede desaparecer si a su dueño se le quita el acceso.** Un
  emprendimiento que no puede depender de eso parte de una copia y no de un fork. La adopción
  funciona igual.
- Si un emprendimiento cruza la frontera, nada lo detiene desde aquí. La fusión que choca es la
  señal, y lo único que la previene es el `README.md` de `personalizacion/`.
- El plan gratuito de Supabase pausa el proyecto tras una semana sin uso: «Instalar» tiene que
  decir qué plan crea, o prod se duerme.
- La etiqueta `:prod` señala la última entrega, no lo que corre en cada emprendimiento. Lo que
  corre en uno lo dice su `POST /api/v0/consultas/version`.

## Referencias

- [ADR-052](ADR-052-la-entrega-del-release-a-prod.md), que este modifica, y [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md), por el que Gerencia aprueba en uat.
- [ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md), por el que el monorepo y los paquetes no se publican para resolver el acceso.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§7.5](../19-ambientes-y-entrega.md#75-la-entrega-a-prod-en-el-repositorio-del-taller), la entrega; [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas), la regla 4.
- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md), la 9.17 del [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [14](../14-roadmap-e-ideas.md "14 · Roadmap e ideas de valor") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md "ADR-055 · uat se despliega desde main del monorepo de producto, y lo aprobado es solo la etiqueta") · [ADR-058](ADR-058-el-monorepo-no-va-adelante-de-develop.md "ADR-058 · El monorepo de producto nunca lleva en sus subárboles algo que no esté en develop") · [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main")
<!-- /generado:referenciado-desde -->
