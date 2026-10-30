# ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-034-la-version-sube-en-cada-pr.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-19 | 2026-10-30 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) · [Calidad](../INDICE.md#etiqueta-calidad) |

## Contexto

El [ADR-014](ADR-014-semver.md) decidió tres versiones independientes —la del front, la de la API y la del esquema— y un
panel, «Acerca de», que las muestra para contestar la primera pregunta de todo reporte de fallo: qué
estaba corriendo. La [definición de terminado](../08-plan-de-desarrollo.md#4-definición-de-terminado) pide además que «la versión del proyecto tocado
subió según SemVer». Ninguna de las dos cosas tenía quien la comprobara.

El 18 de septiembre de 2026, con dev en línea desde el [ADR-032](ADR-032-railway-en-dev-ahora.md), «Acerca de» decía: front `0.2.0`, API
`0.2.0`, esquema `0.1.0`. Las tres cifras estaban mal, y por tres caminos distintos:

- **El front y la API no se habían movido en diecisiete PR.** Siete sobre la `0.2.0+2` del front y
  diez sobre la `0.2.0` de la API, con funciones nuevas en los dos lados. Nadie olvidó una regla
  difícil: se olvidó una regla que nadie miraba.
- **El esquema no se leía de ningún lado.** Era el valor por defecto de una variable, `EMPRENDE_ESQUEMA`,
  junto a un comentario que prometía leer la tabla `schema_version` «en el [Sprint 1](../08-plan-de-desarrollo.md#sprint-1)». La tabla
  existía, y la base iba en `0.3.0`.
- **Y aunque el front hubiera subido su versión, el panel no la habría mostrado entera:** la
  tubería le cortaba el `+BUILD`, que el mockup aprobado reserva justo para ese panel.

Lo que el panel sí decía bien —el ambiente, la fecha de compilación y el commit— lo ponía la
tubería. La diferencia entre las cifras correctas y las incorrectas no era de dificultad: era quién
las escribía.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Una puerta en la integración continua de cada repositorio: si el PR cambia lo que se publica, la versión sube un paso** | La comprueba una máquina en cada PR; quien escribe sigue decidiendo si es PATCH, MINOR o MAJOR; el mensaje dice qué archivos lo exigen y cuáles son los tres pasos posibles | Son tres puertas en tres lenguajes, y cada una con su lista de lo que no se publica |
| Un bot que sube la versión al fusionar | Nadie tiene que acordarse de nada | Mueve `develop` por su cuenta, que [`CLAUDE.md`](../../CLAUDE.md) prohíbe; y tiene que adivinar si el cambio es PATCH o MINOR a partir del commit, que en este proyecto no lleva esa marca |
| Derivar la versión del número de commits o de PR | Crece sola y no se olvida nunca | Deja de decir nada: `0.3.1` y `0.4.0` dejan de significar cosas distintas, que es para lo único que existe SemVer |
| Dejarlo a la definición de terminado, como hasta ahora | No cuesta nada | Es lo que había, y dio diecisiete PR sin subir la versión en dos días |

## Decisión

1. **Todo PR contra `develop` que cambia lo que se publica sube la versión de su proyecto un paso:**
   el PATCH, el MINOR o el MAJOR siguiente de la que había en la base, y nada más. Cuál de los tres
   lo decide quien escribe, con las reglas de [19 §4.2](../19-ambientes-y-entrega.md#42-las-reglas); saltarse números, no.

2. **«Lo que se publica» es todo, menos una lista corta y escrita en cada puerta:** las pruebas, el
   README, la licencia, los flujos de `.github/` y la configuración del repositorio y del despliegue.

3. **En el front, el número de compilación sube de uno en uno con la versión**, y solo con ella.

4. **En la base, la versión del esquema se publica en el mismo PR que la migración**, en la última
   migración que agrega y un paso por encima de la mayor publicada. Ninguna migración que ya estaba
   cambia, y `verificar-base.sql` espera esa misma versión.

5. **Lo comprueba la prueba [C-05](../12-pruebas-y-calidad.md#c-05), en un trabajo propio de cada integración continua: «La versión
   subió».** Corre en el PR contra `develop` y en el empuje a `develop`; en `main` no.

   | Repositorio | Dónde está la versión | Forma | La puerta, en una máquina |
   |---|---|---|---|
   | `emprende_front` | `pubspec.yaml` | `MAJOR.MINOR.PATCH+BUILD` | `dart run tool/la_version_subio.dart origin/develop` |
   | `prisma_api` | `build.gradle.kts` | `MAJOR.MINOR.PATCH` | `./gradlew laVersionSubio --args=origin/develop` |
   | `emprende_db` | La migración que inserta en `schema_version` | `MAJOR.MINOR.PATCH` | `./scripts/db/la-version-subio.ps1 -Base origin/develop` |

6. **Cada dato de «Acerca de» sale de una sola fuente, y ninguna se escribe dos veces a mano:** la
   versión del front, del `pubspec.yaml`, entera; la de la API, del `build.gradle.kts`; la del
   esquema, de `schema_version`, que la API lee de la base de ese ambiente; el ambiente, la fecha y
   el commit, de la tubería. La API lee el esquema **con la sesión de quien pregunta**, como toda
   consulta ([ADR-012](ADR-012-identidad-a-postgres.md)); sin sesión responde `desconocido`, y el panel solo existe con la sesión
   abierta.

## Justificación

**Una regla que nadie comprueba es una sugerencia.** La definición de terminado ya pedía subir la
versión, y la pedía bien. Lo que le faltaba no era claridad: era alguien que dijera que no. Es el
mismo diagnóstico del [ADR-031](ADR-031-commit-de-256-caracteres.md) sobre el tamaño de los commits, y el remedio es el mismo: que lo mida
la integración continua, no la memoria de quien escribe.

**Un paso, y no «mayor que».** La puerta no puede saber si el cambio corrige o agrega —eso se sabe
leyendo el cambio—, pero sí puede saber que `0.3.0` → `0.30.0` es una errata, y que saltarse
números es publicar versiones que nunca existieron. Con un paso por PR, la historia de versiones de
un proyecto es la historia de sus PR, y dos PR abiertos a la vez que suben la versión chocan en la
misma línea: el segundo tiene que traerse la base y subir el paso siguiente, que es exactamente lo
que tiene que pasar.

**La lista de lo que no viaja, y no la de lo que sí.** Una lista de lo que se publica falla en el
sentido caro: una carpeta nueva que entra al artefacto quedaría fuera sin que nadie lo notara. La de
lo que no se publica falla en el barato: lo peor que pasa es subir un PATCH que no hacía falta.

**El empuje a `develop` es la segunda cerradura, y la que protege a dev.** Railway espera a la
integración continua antes de desplegar ([19 §6.1](../19-ambientes-y-entrega.md#61-en-cada-empuje-en-paralelo)). Si algo entra a `develop` sin subir la versión —un
PR fusionado en rojo, un empuje directo—, la CI queda roja y dev se queda en la versión anterior,
que al menos dice la verdad sobre sí misma.

**La versión del esquema se publica con la migración, no al promover.** Publicarla al promover a qa
dejaba a dev, entre dos promociones, con un esquema que su número no describía. Con la versión en
el mismo PR, la base dice la verdad en cuanto se le aplica la migración, y el panel con ella.

**El esquema se lee con sesión porque el panel la tiene, y el arranque no la necesita.** La
consulta de versión es anónima porque el front la hace antes de que nadie entre, para comprobar el
MAJOR de la API. Leer la base ahí habría sido la primera consulta sin identidad del sistema, y habría
atado esa comprobación a que la base conteste. No compraba nada: sin sesión no hay panel.

## Consecuencias

- **Positivas:** «Acerca de» dice la verdad sin que nadie tenga que acordarse; un número de versión
  vuelve a servir para saber qué cambió y dónde; la versión del esquema describe la base en cada
  ambiente, no la del último día de promoción; y un PR que se olvida de la versión lo dice él mismo,
  con los tres números posibles.

- **Negativas:** son tres puertas que mantener, en Dart, en Java y en PowerShell, y cada una con su
  lista de lo que no se publica. Un PR que toca una coma en `lib/` o en `src/main/` paga un PATCH.
  Y las versiones suben mucho más seguido: al go-live se va a llegar con un MINOR de dos cifras, lo
  cual es honesto —es la cantidad de veces que cambió—, pero conviene saberlo antes.

- **A vigilar:** que el PATCH se vuelva el paso por defecto para no tener que pensar, y que la lista
  de lo que no se publica crezca con cosas que sí se publican para no tener que subir la versión. La
  señal de lo segundo es un cambio de comportamiento en dev con el mismo número de antes.

## Referencias

- [ADR-014](ADR-014-semver.md) — las tres versiones independientes y el panel que las muestra
- [ADR-031](ADR-031-commit-de-256-caracteres.md) — el mismo remedio para otra regla que dependía de la memoria
- [ADR-032](ADR-032-railway-en-dev-ahora.md) — dev en línea, y Railway esperando a la integración continua
- [ADR-012](ADR-012-identidad-a-postgres.md) — por qué la versión del esquema se lee con la sesión
- [19-ambientes-y-entrega.md §4](../19-ambientes-y-entrega.md#4-versionado) — dónde vive cada versión y cómo sube
- [12-pruebas-y-calidad.md](../12-pruebas-y-calidad.md) — la prueba [C-05](../12-pruebas-y-calidad.md#c-05)
- [16-base-de-datos-y-snapshots.md §5.3](../16-base-de-datos-y-snapshots.md#53-promover-a-qa-paso-a-paso) — la versión del esquema, en el PR de la migración

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [03](../03-requisitos-y-bdd.md "03 · Requisitos, reglas de negocio y escenarios BDD") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [16](../16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [ADR-014](ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-037](ADR-037-el-pr-se-abre-a-pedido.md "ADR-037 · La rama sale de la base al día, y el PR se abre a pedido y sin conflictos") · [ADR-040](ADR-040-rama-feature-y-pr-autorizado.md "ADR-040 · Toda rama empieza por feature/, y el PR se abre solo con autorización expresa, trayendo entonces la base") · [ADR-042](ADR-042-la-version-del-documento-es-la-de-la-api.md "ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en x-prisma-contrato") · [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main") · [ADR-077](ADR-077-snapshot-hasta-la-release.md "ADR-077 · La versión es -SNAPSHOT hasta que la entrega crea su release/X.Y.Z") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
