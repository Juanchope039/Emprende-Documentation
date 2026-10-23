# ADR-071 · El privilegio que la base le concede a la API es del tamaño de su uso

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-071-el-privilegio-es-del-tamano-del-uso.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-23 | 2026-10-23 | [Base de datos](../INDICE.md#etiqueta-base-de-datos) · [API](../INDICE.md#etiqueta-api) |

## Contexto

El rol con el que se conecta la API nació bien cerrado en lo que más importa ([ADR-012](ADR-012-identidad-a-postgres.md)): no es dueño
de nada, no es `service_role`, no tiene `BYPASSRLS`, no tiene `DELETE` ni `TRUNCATE`, y con
`NOINHERIT` tiene que pedir `authenticated` con un `SET LOCAL ROLE` explícito en cada transacción.
Sobre eso, todas las tablas llevan `ENABLE` y `FORCE ROW LEVEL SECURITY` ([ADR-006](ADR-006-rls-por-rol.md)), así que RLS
juzga cada fila con el tipo de usuario de la sesión.

Pero el alcance concedido es de brocha gorda. La migración del rol dice:

```sql
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO prisma_api;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE ON TABLES TO prisma_api;
```

O sea que **el rol puede leer, insertar y actualizar cualquiera de las 33 tablas**, incluidas las que
solo lee, y lo podrá hacer también con las que vengan sin que ninguna migración lo decida. Lo único
que lo estrecha es RLS, en tiempo de ejecución.

RLS filtra **filas**, no tablas. Lo que queda sin cubrir es todo lo que no es una fila que la
política niegue:

- Una inyección de SQL, o un adaptador escrito por error contra la tabla equivocada, alcanza
  cualquiera de las 33 y escribe en ella si alguna política de `UPDATE` la deja pasar.
- Una ruta puede leer por la puerta equivocada sin que nada la detenga. Pasó en la [8.9](../08-plan-de-desarrollo.md#tarea-8-9):
  `POST /consultas/anticipo-minimo` usó `fn_costeo_vigente`, que es `SECURITY DEFINER` a propósito
  para que los dos tipos de usuario congelen el mismo costo, y por eso le mostró a Operación un
  costo que el contrato dice que no puede ver. **Lo atrapó una prueba, no la base.**
- Una tabla nueva nace alcanzable. La concesión por omisión se la da antes de que nadie piense si
  este rol tenía que tocarla.

Quien dirige pidió el 2026-10-23 bajar el riesgo al mínimo, y aprobó el nivel 7 de la escala del
plan: privilegios explícitos, con las migraciones ya aplicadas por tubería ([ADR-070](ADR-070-las-migraciones-las-aplica-la-tuberia.md)).

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejarlo en RLS, que para eso está | Cero trabajo, y el segundo juez ya funciona | RLS filtra filas; una tabla que este flujo no necesita sigue a su alcance, y la concesión por omisión alcanza también las futuras |
| Quitar `ALTER DEFAULT PRIVILEGES` y nada más | Una tabla nueva ya no nace alcanzable, y es una línea | Las 33 que ya están siguen con el `GRANT` ancho |
| **Lista explícita por tabla y por columna, con una puerta que la cruce contra el uso** | El privilegio concedido es del tamaño del uso, y no envejece solo | Una concesión que falte aparece como un error que hay que leer, y hay que mantener la puerta |
| Cerrar el esquema detrás de un catálogo de funciones | El privilegio mínimo de verdad: lo que no está en el catálogo no se puede ni intentar | Un sprint entero: entre 120 y 180 funciones y los 43 adaptadores reescritos. Queda como paso siguiente, no descartado |
| Un rol por módulo | Cada flujo con su alcance | La API abre una sola conexión por identidad, no por módulo: habría que repartir el pool y la transacción única de la petición se parte |

## Decisión

1. **`GRANT … ON ALL TABLES` se reemplaza por una lista explícita, tabla por tabla y columna por
   columna**, del tamaño de lo que los adaptadores de verdad usan. Las tablas que la API solo lee
   pierden `INSERT` y `UPDATE`.
2. **`ALTER DEFAULT PRIVILEGES` deja de conceder nada a `prisma_api`.** Una tabla nueva nace fuera
   de su alcance hasta que su propia migración se lo dé, que es donde se puede pensar si hacía
   falta.
3. **Una puerta nueva lo sostiene**, al estilo de [C-01](../12-pruebas-y-calidad.md#c-01): cruza lo que los adaptadores escriben
   contra `information_schema.column_privileges`, **en los dos sentidos**. Un `INSERT` a una columna
   sin concesión falla, y una concesión que nadie usa también.
4. **RLS no se toca y sigue siendo el juez.** Son dos jueces con oficios distintos: la concesión
   decide a qué se puede preguntar, y la política decide qué filas contesta. Quitar el segundo
   convertiría un error de una concesión en una fuga.
5. **El catálogo de funciones queda como paso siguiente y no se descarta.** Esta decisión es su
   primer paso: la lista explícita de concesiones es la lista de lo que cada función tendría que
   cubrir.

## Justificación

La diferencia entre este ADR y «ya tenemos RLS» es la diferencia entre un permiso y un filtro. RLS
contesta «esta fila no es tuya», y lo hace bien. Lo que no contesta es «esta tabla no es asunto de
este programa», porque para RLS la tabla ya está concedida y lo único que queda por decidir son las
filas. El [ADR-006](ADR-006-rls-por-rol.md) nunca dijo que la concesión pudiera ser ancha: dijo que el permiso lo juzga
PostgreSQL y no un `if`, y una concesión estrecha es exactamente eso.

La puerta va en los dos sentidos por la misma razón por la que [C-01](../12-pruebas-y-calidad.md#c-01) cruza la tabla de
traducciones con `pg_constraint` en los dos: una lista que solo se comprueba hacia un lado crece y
nunca se encoge, y a los seis meses vuelve a ser `ON ALL TABLES` escrito de otra forma.

Y se hace por columna, no solo por tabla, porque las tablas que más importan son justo las que se
leen y se escriben a medias: de `usuarios` la API escribe la ficha y no el tipo de usuario, y de
`costos_producto` hay rutas que leen el costo y rutas que no pueden verlo.

## Consecuencias

- **Positivas:** el proyecto pasa del nivel 5 al 7 de la escala. Una inyección o un adaptador
  equivocado chocan contra la concesión, antes de que RLS tenga que juzgar. Una consulta nueva que
  lea una tabla que nadie acordó falla en el PR. Y queda escrito, en un solo sitio y en SQL, a qué
  puede preguntar la API.
- **Negativas:** una concesión que falte se ve en caliente la primera vez, con el `42501` que el
  adaptador traduce al `40300`. La puerta la atrapa en el PR, pero el día que se escribe un
  adaptador hay un paso más. Y la migración que la pone es larga y aburrida de revisar.
- **A vigilar:** que la lista no se ensanche «por si acaso» al escribir una tarea nueva. Si una
  tarea necesita una columna más, la concesión entra en su migración y se ve en el diff; si entra
  una tabla entera, hay que preguntarse si el adaptador está en la capa correcta.

## Referencias

- [04 §9](../04-modelo-de-datos.md#9-el-rol-con-el-que-se-conecta-la-api), donde se describe el rol de la API.
- [ADR-006](ADR-006-rls-por-rol.md), que puso RLS por rol, y [ADR-012](ADR-012-identidad-a-postgres.md), que puso las cuatro condiciones del rol.
- [ADR-070](ADR-070-las-migraciones-las-aplica-la-tuberia.md), la otra mitad del sprint: sin migraciones aplicadas por tubería, una concesión que falte se arregla a mano en un ambiente y nadie se enteraría.
- [C-01](../12-pruebas-y-calidad.md#c-01), el molde de la puerta que cruza una lista con lo que la base dice.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [ADR-070](ADR-070-las-migraciones-las-aplica-la-tuberia.md "ADR-070 · Las migraciones las aplica la tubería, no una persona")
<!-- /generado:referenciado-desde -->
