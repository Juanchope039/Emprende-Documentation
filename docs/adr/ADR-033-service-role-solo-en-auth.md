# ADR-033 · La clave de servicio entra, pero solo para crear identidades

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-033-service-role-solo-en-auth.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-066](ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md) | 2026-09-18 | 2026-10-17 | [Seguridad](../INDICE.md#etiqueta-seguridad) · [API](../INDICE.md#etiqueta-api) |

> **Reemplazado por [ADR-066](ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md).** Lo que este ADR decide sigue
> siendo cierto: contra PostgreSQL esa clave no se usa nunca, y contra GoTrue solo en las dos
> llamadas de abajo. Lo que ya no es cierto es que esas dos sean la lista completa: el respaldo que
> la programación dispara no tiene sesión con la que subir al bucket, y sube con ella. El cuerpo de
> abajo se conserva tal como se escribió.

## Contexto

La tarea [2.7](../08-plan-de-desarrollo.md#tarea-2-7) pide que Gerencia cree usuarios y restablezca contraseñas, y al ir a hacerla
apareció un hueco que ningún documento cubría.

El [CU-29](../02-casos-de-uso.md#cu-29) paso 6 dice que «el sistema crea la identidad con el correo sintético». No dice con
qué. Y no hay con qué:

- `usuarios.id` es `REFERENCES auth.users(id)` ([04 §4.2](../04-modelo-de-datos.md#42-cargos-usuarios-y-cuentas)), así que antes de la ficha tiene que
  existir la identidad.
- El rol `prisma_api` **no alcanza el esquema `auth`**: no es dueño de nada, no tiene `BYPASSRLS` y
  sus permisos son `SELECT`, `INSERT` y `UPDATE` sobre `public` ([04 §9](../04-modelo-de-datos.md#9-el-rol-con-el-que-se-conecta-la-api)).
- La clave anónima, que es la única que la API conoce hoy, sirve para autenticar a alguien que ya
  existe. **No puede cambiarle la contraseña a otra persona**, que es el [RF-78](../03-requisitos-y-bdd.md#rf-78).
- Y la cuarta condición del [ADR-012](ADR-012-identidad-a-postgres.md) dice, sin matices, que la clave `service_role` «no se usa
  nunca en el camino de una petición de usuario».

O sea: la operación que el caso de uso describe **no tenía credencial con la que hacerse**. No es un
detalle de implementación; es una contradicción entre documentos que había que resolver antes de
escribir código.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **Una función `SECURITY DEFINER` que escriba en `auth.users`** con `crypt(clave, gen_salt('bf'))`, como ya hace `seed.sql` | No añade ningún secreto al despliegue. El permiso seguiría viviendo en PostgreSQL, que es donde el [ADR-006](ADR-006-rls-por-rol.md) lo quiere | Replica el interior de GoTrue, y el propio `seed.sql` advierte que esas columnas **cambian entre versiones del CLI**. Y restablecer así **no revoca las sesiones abiertas**: quien tuviera sesión seguiría dentro con la clave vieja, que es justo lo que un restablecimiento tiene que cortar |
| **Registrar con la clave anónima** (`/auth/v1/signup`) | Ningún secreto nuevo | Cubre el alta y nada más: la contraseña de otra persona no se toca desde ahí. Dejaría el [RF-78](../03-requisitos-y-bdd.md#rf-78) sin hacer, y obligaría a dejar el registro abierto en el proyecto |
| **No hacer la [2.7](../08-plan-de-desarrollo.md#tarea-2-7)** | — | El sistema se queda con las seis personas que `seed.sql` escribió a mano, con contraseñas conocidas. Mientras sea así, el enlace de dev no se puede compartir |

## Decisión

**La API usa la clave `service_role` contra la API de administración de GoTrue, y contra nada más.**

Dos operaciones, y solo dos:

| Para qué | Llamada |
|---|---|
| Crear la identidad de alguien nuevo | `POST /auth/v1/admin/users` |
| Restablecer la contraseña de otra persona | `PUT /auth/v1/admin/users/{id}` |

**La cuarta condición del [ADR-012](ADR-012-identidad-a-postgres.md) se acota a PostgreSQL**, que es lo que siempre protegió, y
pasa a leerse así:

> La clave `service_role` no se usa nunca **para hablar con PostgreSQL**: ni por conexión directa,
> ni por PostgREST, ni por ninguna vía que evalúe —o deje de evaluar— Row Level Security. Contra
> GoTrue se usa solo en las dos operaciones de administración de identidades que este ADR enumera.

Lo que **no** cambia, y es lo que el [R-21](../11-riesgos-y-proteccion-de-datos.md#r-21) mide:

1. La API se sigue conectando a la base como `prisma_api`, sin `SUPERUSER` y sin `BYPASSRLS`.
2. La ficha de `public.usuarios` se sigue insertando por `ConIdentidad`, como `authenticated`, y
   quien decide si Gerencia puede crearla sigue siendo la política `usuarios_insercion`. **Si la
   política dijera que no, la fila no entra**, tenga la API la clave que tenga.
3. `service_role` sigue viviendo en un secreto distinto del de la base y del de las migraciones.

## Justificación

**El peligro que el [ADR-012](ADR-012-identidad-a-postgres.md) nombra es que RLS deje de aplicar, y eso aquí no pasa.** Con esa
clave contra PostgREST o contra la base, las políticas se vuelven decorado. Contra `/auth/v1/admin/*`
no hay ninguna política que saltarse: ese camino no toca `public`. La seguridad del negocio la sigue
decidiendo PostgreSQL sobre la misma conexión de siempre.

**Crear una identidad es exactamente para lo que existe esa API.** La alternativa era escribir a
mano, desde una función de PostgreSQL, lo que GoTrue guarda de cada usuario —el hash, la identidad,
las columnas de confirmación— y mantener eso al día versión tras versión. Es replicar la
implementación de otro para no usar su interfaz.

**Y un restablecimiento tiene que cortar las sesiones abiertas.** Si Gerencia le cambia la clave a
alguien porque se la olvidó, da igual; si se la cambia porque la persona ya no debería entrar, una
sesión viva es el fallo entero. La API de administración lo hace; escribir `encrypted_password` a
mano, no.

**Lo que se paga se dice en voz alta:** el secreto más peligroso del sistema pasa a estar en el
despliegue que atiende usuarios. Si esa máquina se compromete, quien entre tiene una clave que sí
sirve contra PostgREST, y ahí RLS no juzga. Esa es la consecuencia real de esta decisión y no se
compensa con nada: se acota, se aísla y se rota.

## Consecuencias

- **Positivas:** la [2.7](../08-plan-de-desarrollo.md#tarea-2-7) se puede hacer; el alta y el restablecimiento se comportan como el
  proveedor manda, sesiones revocadas incluidas; y la contradicción entre el [CU-29](../02-casos-de-uso.md#cu-29) y el
  [ADR-012](ADR-012-identidad-a-postgres.md) queda resuelta por escrito en vez de por omisión.
- **Negativas:** `SUPABASE_SERVICE_ROLE_KEY` pasa a ser una variable del despliegue de la API. El
  [9.8](../08-plan-de-desarrollo.md#tarea-9-8) —«repaso de secretos: nada en el repositorio y `service_role` solo en migraciones»— deja
  de poder cumplirse tal como está escrito y pasa a comprobar esto otro: que la clave **solo** se use
  en las dos llamadas de este ADR.
- **Obligación que nace de esta decisión:** una regla de arquitectura que falle la compilación si
  alguna clase fuera del adaptador de Supabase lee esa clave, del mismo modo que
  `ReglaDeDependenciasTest` impide hoy que alguien que no sea `ConIdentidad` toque un `JdbcClient`.
  Sin esa regla, «solo en dos llamadas» dura hasta que alguien tenga prisa.
- **Lo que sigue prohibido, y conviene releerlo:** conectarse a PostgreSQL con esa clave, usarla
  contra PostgREST, y pasarla al front por cualquier vía. El front no habla con Supabase
  ([ADR-018](ADR-018-front-sin-decisiones.md)), y eso no se toca.

## Referencias

- [ADR-012](ADR-012-identidad-a-postgres.md) · la identidad viaja hasta PostgreSQL — es su cuarta condición la que aquí se acota
- [ADR-009](ADR-009-login-por-usuario.md) · el correo sintético que la identidad nueva lleva
- [04 §9](../04-modelo-de-datos.md#9-el-rol-con-el-que-se-conecta-la-api) · el rol con el que la API se conecta, que no cambia
- [R-21](../11-riesgos-y-proteccion-de-datos.md#r-21) · el riesgo que esta decisión roza y no mueve
- [CU-29](../02-casos-de-uso.md#cu-29) y [CU-31](../02-casos-de-uso.md#cu-31) · los dos casos de uso que la necesitaban

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [11](../11-riesgos-y-proteccion-de-datos.md "11 · Riesgos y protección de datos") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-012](ADR-012-identidad-a-postgres.md "ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando") · [ADR-066](ADR-066-la-clave-de-servicio-sube-el-respaldo-programado.md "ADR-066 · La clave de servicio también sube el respaldo que nadie pidió")
<!-- /generado:referenciado-desde -->
