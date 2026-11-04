# 16 · Base de datos: snapshots y datos de prueba

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [3.4.2](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/16-base-de-datos-y-snapshots.md "Historial de cambios") | [✅ Vigente](22-documentacion.md#estados) | 2026-09-15 | 2026-10-30 | [Base de datos](INDICE.md#etiqueta-base-de-datos) · [Calidad](INDICE.md#etiqueta-calidad) |

> **Construcción: construido y corriendo contra dev y contra qa**, donde el esquema está aplicado y
> verificado línea por línea (tareas [0.4](08-plan-de-desarrollo.md#tarea-0-4), [0.5](08-plan-de-desarrollo.md#tarea-0-5), [1.1](08-plan-de-desarrollo.md#tarea-1-1) a [1.5](08-plan-de-desarrollo.md#tarea-1-5) y [1.13](08-plan-de-desarrollo.md#tarea-1-13)). **qa quedó al día** con el
> procedimiento del [§5.3](#53-promover-a-qa-paso-a-paso), que es lo que cerró la [1.12](08-plan-de-desarrollo.md#tarea-1-12): cinco migraciones aplicadas y las 109
> comprobaciones en `OK`. El que va atrás ahora es dev, al que le falta la `0.3.0`. Fue la primera pieza de código ejecutable del proyecto.
> Convierte el esquema que describe [`04-modelo-de-datos.md`](04-modelo-de-datos.md) en una
> base de datos real, reproducible en cualquier ambiente con un comando.

> ### 📍 Estos archivos viven en `emprende_db`, no aquí
>
> Desde el [ADR-025](adr/ADR-025-cuatro-repositorios.md), `supabase/` y `scripts/db/` tienen
> repositorio propio, `emprende_db`, que en disco va en `backend-db`, al lado de esta especificación. **Todas las rutas
> de este documento son relativas a `emprende_db`.** Antes vivieron dentro de `emprende_api`
> ([ADR-023](adr/ADR-023-tres-repositorios.md)).
>
> Separarlos de la API tiene un precio que vale la pena repetir: **una migración y el código que
> depende de ella ya no entran en el mismo commit.** Por eso la migración se publica antes que la
> API que la necesita, y compatible con la API que ya corre. Al revés se produce el fallo más caro
> de todos: una versión desplegada esperando una columna que todavía no existe.
>
> Lo que sí se queda aquí es **este documento** y el [modelo de datos](04-modelo-de-datos.md):
> decidir qué debe existir y ejecutar el cambio son dos cosas distintas.

---

## 1. Qué resuelve

| Necesidad | Cómo se resuelve |
|---|---|
| Recrear la BD en otro ambiente sin problemas | **Migraciones versionadas** (`supabase/migrations/`) |
| Recrear la BD localmente para desarrollar | `supabase db reset` (migraciones + seed) |
| Datos de prueba realistas y estables | **Seed fijo** (`supabase/seed.sql`), los 5 usuarios del mockup |
| Datos de volumen para pruebas de carga | **Generador parametrizable** (`scripts/db/generar-datos-prueba.sql`) |
| Copia puntual del estado actual | **Snapshot** (`scripts/db/snapshot.ps1`) |

La idea de fondo: **el esquema vive en migraciones, no en un dump.** Un dump es una foto de
un momento; las migraciones son la receta reproducible. Los snapshots se usan para llevarse los
**datos**, no para definir la estructura.

---

## 2. Mapa de archivos

```
supabase/
  config.toml                          Configuración de la pila local
  migrations/                          Catorce, en orden y ninguna editable una vez aplicada:
    …_esquema_inicial.sql              Todo el esquema (doc 04 + tabla exportaciones del doc 13)
    …_ajusta_rls_y_vistas_al_doc_04.sql Apaga la RLS que Supabase enciende sola; security_invoker
    …_rol_prisma_api.sql               El rol con el que se conecta la API (doc 04 §9)
    …_schema_version.sql               La tabla del SemVer del esquema (ADR-014)
    …_force_row_level_security.sql     FORCE en catorce tablas (doc 04 §7.1)
    …_dominios_y_restricciones_con_nombre.sql  Los nueve dominios del §4.1 y los nombres del §11
    …_revoca_borrado_a_todos_los_roles.sql     Nadie borra salvo el dueño (doc 04 §5.1)
    …_peticiones_idempotentes.sql      Las claves de idempotencia, cada una solo de quien la envió (doc 04 §4.9)
    …_purga_de_claves_vencidas.sql     La purga de las vencidas, agendada con pg_cron (doc 04 §7.1)
    …_publica_version_0_2_0.sql        Publica la 0.2.0 en schema_version (ADR-029)
    …_tablas_del_canal_firmado.sql     nonces_vistos y sesiones, las dos del filtro de firma (doc 04 §4.10)
    …_publica_version_0_3_0.sql        Publica la 0.3.0, que es la anterior más esas dos tablas
    …_tabla_adjuntos_y_bucket_de_soportes.sql  La ficha del soporte y el bucket privado (doc 04 §4.12)
    …_publica_version_0_4_0.sql        Publica la 0.4.0, que es la anterior más esa tabla y su bucket
  seed.sql                             Datos de prueba fijos y deterministas

scripts/db/
  reset-local.ps1                      Recrea la BD local (migraciones + seed)
  promover.ps1                         Aplica a qa lo que le falte, con sus dos llaves (ver §5.3)
  sembrar.ps1                          Lleva la semilla a dev o a qa, y no la deja acercarse a uat ni a prod
  verificar-base.sql                   Le pregunta a la base si cumple el doc 04 (ver §5.1)
  la-version-subio.ps1                 C-05: el PR que agrega migraciones publica su versión (ver §5.3)
  snapshot.ps1                         Toma un snapshot (esquema y/o datos) con marca de tiempo
  restore.ps1                          Restaura un snapshot .sql sobre una BD destino
  generar-datos-prueba.ps1             Wrapper del generador de volumen (opcional)
  generar-datos-prueba.sql             Generador parametrizable y categórico

snapshots/                             Salida de snapshot.ps1 (ignorada por git)
```

---

## 3. Requisitos

| Herramienta | Para qué | Nota |
|---|---|---|
| [Supabase CLI](https://supabase.com/docs/guides/cli) | Migraciones, seed, dump, reset | `supabase --version` |
| Docker Desktop | Correr la BD local (`supabase start`) | Requerido solo para el ambiente local |
| `psql` | Restaurar snapshots y generar volumen | Viene con PostgreSQL; el CLI de Supabase también lo trae |

---

## 4. Recrear la BD **localmente** (el caso más común)

```powershell
supabase start                 # levanta PostgreSQL + Auth + Studio en Docker
./scripts/db/reset-local.ps1   # aplica migraciones y carga el seed
```

Al terminar tienes la base completa con datos de prueba y estos usuarios listos para entrar
(los mismos del [mockup](../mockup/prisma-mockup.html), ver README [§3](#3-requisitos)):

| Usuario | Contraseña | Tipo | Estado |
|---|---|---|---|
| `yuliana` | `prisma2026` | Gerencia | Activa |
| `marcela` | `prisma2026` | Operación | Activa |
| `daniela` | `prisma2026` | Operación | Activa |
| `camila` | `temporal01` | Operación | Clave temporal (obliga a cambiarla) |
| `lorena` | `prisma2026` | Operación | **Desactivada** (prueba del rechazo) |

> El login usa el **correo sintético** `usuario@usuarios.prisma.com` por dentro
> ([ADR-009](adr/ADR-009-login-por-usuario.md)); nunca se teclea el correo.

---

## 5. Recrear la BD en **otro ambiente** (qa, uat, prod, otro equipo)

El esquema se aplica con migraciones, no con un dump:

> **Las migraciones se promueven en orden: dev → qa → uat → prod, y una ya aplicada no se
> edita.** Los cuatro ambientes y el procedimiento completo están en
> [`19-ambientes-y-entrega.md`](19-ambientes-y-entrega.md) [§2](19-ambientes-y-entrega.md#2-la-promoción) y en
> [ADR-013](adr/ADR-013-cuatro-ambientes.md). Aquí va solo el comando.

```powershell
supabase link --project-ref <ref-del-proyecto>   # una sola vez
supabase db push                                  # aplica las migraciones al remoto
```

`db push` aplica solo lo que falte, así que es seguro correrlo de nuevo tras cada migración
nueva. La semilla no viaja con las migraciones y tiene su propia regla: [§5.2](#52-la-semilla-en-dev-y-en-qa).
Y el comando suelto no es el procedimiento: promover un ambiente entero, en orden y comprobándolo,
es el [§5.3](#53-promover-a-qa-paso-a-paso).

### 5.1 Comprobar que quedó como dice el modelo

Aplicar no es lo mismo que quedar bien. `scripts/db/verificar-base.sql` le hace a la base las
preguntas del [`04-modelo-de-datos.md`](04-modelo-de-datos.md) y contesta `OK` o `>>> FALLA` por
cada una: los nueve dominios y sus 62 columnas, que ninguna restricción se haya quedado con el
nombre que le puso PostgreSQL, que nadie salvo el dueño pueda borrar, que los quince triggers de
auditoría **escriban**, que RLS le conteste distinto a una sesión de Operación y a una de
Gerencia, que el catálogo de cargos lo lea todo el mundo y lo escriba solo Gerencia, que cada
persona alcance sus claves de idempotencia y ninguna otra, y que el bucket de soportes sea privado
y traiga el techo y los cuatro tipos que el contrato promete.

```powershell
supabase db query --linked -f scripts/db/verificar-base.sql                        # el proyecto vinculado
supabase db query --linked --project-ref <ref> -f scripts/db/verificar-base.sql    # otro ambiente
psql "<cadena de conexión>" -f scripts/db/verificar-base.sql                       # o directo
```

Dos condiciones: se corre **como el dueño** de las tablas —el guion se cambia de rol para probar qué
puede hacer cada uno, y para eso tiene que poder volver— y **contra una base con la semilla**, porque
las pruebas de permisos necesitan una persona de Gerencia y otra de Operación de verdad.

> **No deja rastro.** Lo poco que escribe —mover un cargo para ver si el trigger de auditoría se
> dispara, y sembrar una clave de idempotencia por persona para ver quién alcanza cuál— va dentro
> de una transacción que termina en `ROLLBACK`. Se puede correr contra cualquier ambiente, incluido
> uno con datos.

Es también la forma de ver qué le falta a un ambiente contra otro: corrido contra qa hoy, el guion
dice en qué se quedó atrás ([1.12](08-plan-de-desarrollo.md#tarea-1-12)). Si al ambiente le falta una tabla entera, el informe no
se cae: las preguntas sobre ella salen en `>>> FALLA`.

### 5.2 La semilla en dev y en qa

**La semilla va a la base local, a dev y a qa. A uat y a prod no entra nunca.** Crea usuarios con
contraseña conocida y cifras inventadas; en uat los datos son realistas y anonimizados, y en prod
son los del negocio, donde los usuarios reales los crea Gerencia desde la aplicación ([19 §1](19-ambientes-y-entrega.md#1-los-cuatro-ambientes)). El
corte no es «local contra remoto» —dev y qa también son remotos—, es **qué datos son de verdad**.

```powershell
./scripts/db/sembrar.ps1 -Ambiente dev -EnSeco   # la corre entera y la revierte: no cambia nada
./scripts/db/sembrar.ps1 -Ambiente dev           # la deja puesta
```

El guion pide dos llaves: el **ambiente**, que solo admite `dev` y `qa`, y la **referencia del
proyecto vinculado**, que hay que escribir entera. Sembrar no puede ser un descuido, y la
salvaguarda va dentro del guion y no en este documento: un aviso escrito no detiene a nadie a la
una de la mañana. En la base local no hace falta: `supabase db reset` ya la carga ([§4](#4-recrear-la-bd-localmente-el-caso-más-común)).

La semilla es **re-ejecutable**: sobre una base ya sembrada completa lo que falte y pone los correos
al día, sin borrar nada, así que correrla dos veces deja lo mismo que correrla una. Y es
**determinista**: los ids están escritos y las fechas que alguien lee también, porque con `NOW()`
todo movimiento con más de una semana se vería como registro tardío ([RN-14](03-requisitos-y-bdd.md#rn-14)) y la semilla dejaría de
ser la misma cada vez.

### 5.3 Promover a qa, paso a paso

Arriba está el comando; esto es **el procedimiento**, que es lo que pedía la tarea [1.12](08-plan-de-desarrollo.md#tarea-1-12). Se hace
**a mano**: [19 §7.1](19-ambientes-y-entrega.md#71-publicar) da el paso a qa por «Automático», pero esa tubería llega en el
[Sprint 9](08-plan-de-desarrollo.md#sprint-9) ([ADR-026](adr/ADR-026-railway-al-final.md)) y `emprende_db` todavía no tiene integración continua.

```powershell
# 0 · Apuntar el CLI a qa. Los cinco pasos que siguen dicen --linked, y el vínculo
#     se queda donde se trabajó, que es dev
supabase link --project-ref <la referencia de qa>

# 1 · Qué le falta al ambiente, antes de tocarlo. No deja rastro: termina en ROLLBACK
supabase db query --linked -f scripts/db/verificar-base.sql

# 2 · Qué se aplicaría, sin aplicar nada
./scripts/db/promover.ps1 -Ambiente qa -EnSeco

# 3 · Aplicarlo. El CLI enseña la lista y pregunta antes
./scripts/db/promover.ps1 -Ambiente qa

# 4 · La semilla, que no viaja con las migraciones
./scripts/db/sembrar.ps1 -Ambiente qa

# 5 · Preguntarle otra vez a la base, ahora entero en OK
supabase db query --linked -f scripts/db/verificar-base.sql
```

| Paso | Por qué no se salta |
|---|---|
| **0** | `--linked` no elige ambiente: obedece al último `supabase link`, y ese apunta a dev porque es donde se trabaja. Sin este paso el procedimiento promueve al ambiente equivocado sin que nada avise, y **es el único error del que no hay vuelta**. `promover.ps1` compara la referencia tecleada con el vínculo real, pero detectar el error es peor que no cometerlo. Si el proyecto está dormido —qa va en plan gratuito y se duerme tras una semana quieto ([19 §8.1](19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no))—, hay que despertarlo primero |
| **1** | Es la única forma de saber **en qué se quedó atrás** el ambiente, y queda como prueba de lo que había antes. Después ya no se puede mirar |
| **2** | Enseña la lista de migraciones pendientes. Si ahí aparece algo que no se esperaba, el ambiente no era el que se creía |
| **3** | `db push` aplica **solo lo que falte** y en orden. Una migración ya aplicada no se edita jamás ([§2.2](19-ambientes-y-entrega.md#22-una-migración-aplicada-no-se-edita-nunca)): si subió mal, se corrige con otra |
| **4** | `verificar-base.sql` necesita una persona de Gerencia y otra de Operación **de verdad** ([§5.1](#51-comprobar-que-quedó-como-dice-el-modelo)). Sin semilla, lo que falla es la falta de gente, no el esquema |
| **5** | Aplicar no es quedar bien. El informe entero en `OK` es lo que cierra la promoción, y el bloque `1.12` comprueba además que la base publique la versión que dice el repositorio |

**El guion pide dos llaves**, las mismas que `sembrar.ps1`: el **ambiente** —que hoy solo admite
`qa`, porque uat y prod no existen ([9.12](08-plan-de-desarrollo.md#tarea-9-12))— y la **referencia del proyecto vinculado**, escrita
entera. Y una tercera la pone el CLI, que enseña la lista y pregunta antes de aplicar. Promover no
puede ser un descuido, y la salvaguarda va dentro del guion y no en este documento.

**Con qué credencial.** No con la del rol `prisma_api`, que es la de la aplicación y no promueve
nada ([19 §3.3](19-ambientes-y-entrega.md#33-dónde-viven-los-secretos)): con el vínculo del proyecto que el CLI guarda tras `supabase link`. Ninguna
referencia ni contraseña se escribe en el repositorio, que es público.

**Y cada migración llega con su número.** El esquema lleva su propio SemVer en `schema_version`
([19 §4.1](19-ambientes-y-entrega.md#41-tres-cosas-versionadas-por-separado)) y [ADR-029](adr/ADR-029-esquema-por-etiqueta.md) lo ata a la etiqueta `esquema-vX.Y.Z` de `emprende_db`: son el mismo número
escrito dos veces. **La versión se publica en el mismo PR que la migración**, no al promover
([ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md)): la última migración del PR inserta la fila de la versión siguiente —un paso—, y el bloque
`1.12` de `verificar-base.sql` pasa a esperarla. Lo exige la prueba [C-05](12-pruebas-y-calidad.md#c-05), que además rechaza el PR que
toque una migración ya fusionada. Así, promover ya no publica nada: lleva a qa las migraciones que le
falten, y con ellas sus números. Publicarla al promover dejaba a dev, entre dos promociones, con un
esquema que su número no describía —y «Acerca de» lo muestra—.

Después de fusionar se etiqueta el commit ya fusionado en `develop`, y la etiqueta anterior **no se
mueve**: es la foto de por dónde pasó cada ambiente. Una migración fusionada sin etiquetar sigue sin
existir «para nadie más».

---

## 6. Snapshots (llevarse el estado actual)

```powershell
# Esquema + datos de la BD local, con marca de tiempo, en /snapshots
./scripts/db/snapshot.ps1

# Del proyecto remoto vinculado
./scripts/db/snapshot.ps1 -Target linked

# Solo datos
./scripts/db/snapshot.ps1 -DataOnly
```

Restaurar sobre una base con el esquema ya aplicado:

```powershell
./scripts/db/restore.ps1 -File .\snapshots\20260915_120000_data.sql
```

> **Snapshot ≠ respaldo del usuario.** Esto es una herramienta de desarrollo. El respaldo
> exportable para Gerencia (con manifiesto y verificación) es otra cosa y se especifica en
> [`13-respaldo-y-exportacion.md`](13-respaldo-y-exportacion.md). No confundir.

---

## 7. Datos de prueba de volumen (opcional)

El seed fijo es pequeño y estable. Para pruebas de carga hay un generador **categórico**:
cada conteo controla una categoría y un `0` la omite.

```powershell
./scripts/db/generar-datos-prueba.ps1                          # 30 clientes, 80 pedidos, 400 movimientos
./scripts/db/generar-datos-prueba.ps1 -Movimientos 5000        # solo movimientos
./scripts/db/generar-datos-prueba.ps1 -Clientes 200 -Pedidos 0 -Movimientos 0
```

Requiere el seed fijo cargado (usa sus cuentas, categorías, productos y a `yuliana` como autor).
Corre `reset-local.ps1` antes si quieres partir de cero.

---

## 8. Sembrar usuarios de prueba (nota técnica)

`seed.sql` inserta directamente en `auth.users` y `auth.identities`. Ese esquema pertenece a
Supabase (GoTrue) y **sus columnas pueden cambiar entre versiones del CLI**. Si el bloque de
auth falla al correr `db reset`:

1. Revisa las columnas que tu versión exige: `\d auth.users` y `\d auth.identities` en `psql`.
2. Ajusta el `INSERT` a esas columnas (lo más habitual es que `auth.identities` pida o sobre
   `provider_id`).
3. Alternativa robusta: crear los usuarios con la API de administración de Supabase y luego
   insertar solo las filas de `public.usuarios` con esos `id`.

El seed desactiva los triggers durante la carga (`session_replication_role = replica`) para
que sea limpio y rápido; los reactiva al final.

---

## 9. Límites conocidos (heredados del doc 04)

- **Ya no queda ninguna tabla sin `CREATE TABLE` en la doc.** Las del catálogo y el diagrama del
  doc [04](04-modelo-de-datos.md) que no tenían definición escrita no se inventaron: cada una entró al plan con el contrato que
  la prometía y se escribió en su tarea. `adjuntos` salió de esta lista con la [3.14](08-plan-de-desarrollo.md#tarea-3-14), que la
  especifica en el [04 §4.12](04-modelo-de-datos.md#412-adjuntos--el-soporte-de-un-movimiento-o-de-un-pedido), y `cotizaciones` y `cotizacion_lineas` con la [8.12](08-plan-de-desarrollo.md#tarea-8-12), que las especifica en
  el [04 §4.5](04-modelo-de-datos.md#45-productos-costeo-y-cotizaciones) y las crea en el esquema `0.15.0`.
- **Auditoría de `usuarios`:** el doc [04](04-modelo-de-datos.md) [§5.4](04-modelo-de-datos.md#54-auditoría-por-triggers) dice que necesita una variante propia del trigger
  (detecta `desactivado_en`, no `anulado_en`) y no la especifica. Por eso `usuarios` aún no
  tiene trigger de auditoría de fila.
- **Política RLS de `exportaciones`:** el doc [13](13-respaldo-y-exportacion.md) [§7](13-respaldo-y-exportacion.md#7-alcance-por-rol) dice "acceso exclusivo de Gerencia" pero no
  escribe la política; en la migración se creó una coherente con el patrón, marcada como tal.
- **Nombre de los `CHECK` de `exportaciones`:** el doc [13](13-respaldo-y-exportacion.md) [§8](13-respaldo-y-exportacion.md#8-tabla-de-registro) los escribe sin nombre, que es lo que
  el [04 §4.1](04-modelo-de-datos.md#41-tipos-y-convenciones-comunes) prohíbe. Se bautizaron siguiendo su patrón al cerrar la [1.1](08-plan-de-desarrollo.md#tarea-1-1), y quedó anotado en
  [`TODO.md` §10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar).

Cada uno de estos puntos está comentado en el propio SQL para que no pase desapercibido.

---

## 10. Tareas programadas dentro de la base

Dos tablas del modelo se limpian solas. Van aquí y no solo en el doc [04](04-modelo-de-datos.md) porque **una tarea
programada que nadie mira es una tarea que se cae en silencio**, y quien administra la base es
quien tiene que saber que existen.

| Tarea | Tabla | Cuándo corre | Retención | Estado |
|---|---|---|---|---|
| `purgar_peticiones_idempotentes` | `peticiones_idempotentes` | `20 3 * * *` | 72 horas | **Agendada** ([1.16](08-plan-de-desarrollo.md#tarea-1-16)) |
| `purgar_nonces_vistos` | `nonces_vistos` | `*/10 * * * *` — cada diez minutos | 5 minutos | Escrita, sin tabla todavía ([Sprint 2](08-plan-de-desarrollo.md#sprint-2)) |

> **`20 3 * * *` no son las 3:20 de Bogotá.** `pg_cron` agenda en el huso de `cron.timezone`, que
> en Supabase es `GMT` y **no admite un huso por tarea**, así que la purga corre a las **22:20**
> hora local. Para una purga de higiene la hora da lo mismo, y se dejó el valor que ya estaba
> escrito en el [04 §4.9](04-modelo-de-datos.md#49-claves-de-idempotencia) en vez de cambiarlo por la espalda. Está anotado en [`TODO.md`](../TODO.md) [§10](../TODO.md#10-decisiones-de-construcción-que-conviene-revisar) para
> revisarlo: si se quiere que corra de madrugada de verdad, es `20 8 * * *` y hay que cambiar el
> [04](04-modelo-de-datos.md) y esta tabla.

### 10.1 Qué hace falta en cada ambiente

`pg_cron` es una extensión y **se habilita una sola vez por ambiente**, desde el panel de Supabase
o con `CREATE EXTENSION IF NOT EXISTS pg_cron;` ejecutado por el rol de migraciones. Son los
cuatro ambientes de [`ADR-013`](adr/ADR-013-cuatro-ambientes.md): dev, qa, uat y prod.

Desde la [1.16](08-plan-de-desarrollo.md#tarea-1-16) lo hace la migración `…_purga_de_claves_vencidas.sql`, que habilita la extensión y
agenda la tarea. Se puede volver a aplicar sin miedo: la extensión lleva `IF NOT EXISTS` y
`cron.schedule` reemplaza el trabajo que ya tuviera ese nombre, así que no quedan dos.

Las dos purgas corren como el **rol de migraciones**, no como la aplicación. Es dueño de las
tablas y el único rol del proyecto con `BYPASSRLS`, así que atraviesa el `FORCE ROW LEVEL
SECURITY` sin necesitar una política de `DELETE` escrita para él. Conceder `DELETE` al rol de la
API sería el error: abriría el borrado a quien atiende peticiones de usuario para resolver una
tarea de madrugada.

### 10.2 Cómo se vigila que siguen corriendo

Las dos fallan distinto y por eso se vigilan distinto:

| Si se cae… | Qué pasa | Gravedad |
|---|---|---|
| `purgar_peticiones_idempotentes` | La tabla crece. No se pierde información ni se rompe la idempotencia: cada fila trae su `expira_en` y la API ignora las vencidas | Higiene |
| `purgar_nonces_vistos` | La tabla crece **rápido**: una fila por petición, y solo necesita recordarlas cinco minutos | Corrección |

La comprobación es la misma para las dos y no necesita herramientas nuevas: **si la fila más
vieja supera su ventana de retención, algo dejó de correr.**

```sql
-- Devuelve filas solo cuando hay un problema. Vacío es la respuesta sana.
SELECT 'peticiones_idempotentes' AS tabla, min(expira_en) AS mas_vieja
  FROM peticiones_idempotentes WHERE expira_en < NOW() - INTERVAL '2 hours'
UNION ALL
SELECT 'nonces_vistos', min(expira_en)
  FROM nonces_vistos WHERE expira_en < NOW() - INTERVAL '30 minutes';
```

El margen —dos horas y treinta minutos— es deliberado: da espacio a que una ejecución se salte
sin levantar una alarma falsa, y sigue detectando que la tarea lleva días muerta.

---

## 11. Snapshots incrementales (diseño)

> **Construcción: diseñado, no construido.** El `snapshot.ps1` actual es **completo** (vuelca todo).
> Aquí se especifica cómo hacerlo **incremental** cuando el volumen lo justifique.

El diseño de solo escritura ([ADR-004](adr/ADR-004-base-solo-escritura.md)) hace el snapshot
incremental natural: como **nada se edita ni se borra**, "lo nuevo desde la última vez" se
identifica por la marca de tiempo de creación.

### 11.1 Incremental propio (por marca de tiempo)

- Cada tabla de negocio tiene `creado_en`; `auditoria` además tiene `fecha_hora` y un `id`
  `BIGSERIAL` siempre creciente.
- Se guarda un **cursor** (`snapshots/.cursor.json`) con el corte del último snapshot.
- Un incremento exporta solo las filas con `creado_en > cursor` por tabla (`\copy ... WHERE`).
- **Cadena:** un snapshot **base** + N **incrementos**. Restaurar = base, luego cada incremento
  en orden.

| Aspecto | Incremental propio |
|---|---|
| Tamaño | Pequeño: solo el delta |
| Frecuencia | Barato de correr seguido |
| Encaje | Perfecto con las tablas append-only |
| Punto ciego | Una **anulación posterior** (un `UPDATE` que llena `anulado_en`) no la ve un corte por `creado_en`. Se complementa capturando también filas con `anulado_en > cursor` / `desactivado_en > cursor`. Se documenta por tabla. |

Sketch del comando (una tabla):

```sql
\copy (SELECT * FROM movimientos
       WHERE creado_en > :cursor OR anulado_en > :cursor) TO 'mov_delta.csv' CSV HEADER
```

En el script, esto sería un modo `-Incremental` de `snapshot.ps1` que lee y actualiza el cursor.

### 11.2 Alternativa del proveedor (PITR)

Supabase (plan de pago) ofrece **Point-in-Time Recovery** basado en WAL: recuperación a cualquier
segundo, sin escribir scripts. Es la opción recomendada para el **respaldo real de producción**;
el incremental propio es para **desarrollo** y para llevarse deltas de forma portable.

| | Incremental propio | PITR del proveedor |
|---|---|---|
| Para qué | Desarrollo, deltas portables | Respaldo de producción |
| Costo | Gratis (scripts) | Plan de pago de Supabase |
| Granularidad | Por corte de `creado_en` | Al segundo |
| Esfuerzo | Mantener cursor + orden | Ninguno |

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](04-modelo-de-datos.md "04 · Modelo de datos") · [12](12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [13](13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [19](19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-013](adr/ADR-013-cuatro-ambientes.md "ADR-013 · Cuatro ambientes y promoción de migraciones") · [ADR-025](adr/ADR-025-cuatro-repositorios.md "ADR-025 · Cuatro repositorios: la base de datos sale de la API") · [ADR-034](adr/ADR-034-la-version-sube-en-cada-pr.md "ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige")
<!-- /generado:referenciado-desde -->

---

### 🧭 Navegación

**⬅️ Anterior:** [15 · Glosario](15-glosario.md)  ·  **🗂️ [Índice general](INDICE.md)**  ·  **Siguiente ➡️:** [17 · Resiliencia, trabajo sin conexión y caché](17-resiliencia-offline-y-cache.md)
