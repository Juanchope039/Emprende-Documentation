# ADR-070 · Las migraciones las aplica la tubería, no una persona

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-070-las-migraciones-las-aplica-la-tuberia.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-23 | 2026-10-23 | [Base de datos](../INDICE.md#etiqueta-base-de-datos) · [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

`prisma_db` prueba sus migraciones muy bien y no las aplica en ninguna parte. El trabajo «El informe
de la base» del `ci.yml` levanta un Supabase nuevo en cada PR a `qa` y a `main`, le aplica las 62
migraciones y la semilla, y exige el informe entero en `OK`. Pero **ninguno de los seis flujos de
`.github/workflows/` aplica una migración a un ambiente**: eso lo hace una persona, desde su
consola, con `./scripts/db/promover.ps1 -Ambiente qa|uat`.

De ahí salen cuatro cosas que nadie puede responder hoy sin abrir el panel de Supabase:

- **Qué esquema tiene cada ambiente.** `schema_version` lo guarda, pero solo de la base a la que se
  le pregunte. Una migración aplicada a qa y no a dev no deja rastro en ningún otro sitio.
- **Qué va a aplicar un PR antes de fusionarlo.** El `db push` en seco existe, pero lo corre quien
  quiera y el resultado se queda en su terminal.
- **Si se aplicó entera.** `promover.ps1` no es transaccional sobre el conjunto: si la tercera de
  cuatro migraciones falla, el ambiente queda a medias y la señal es el texto de la consola.
- **Quién tiene la contraseña del rol `prisma_api`.** Cada ambiente se la fija a mano con un
  `ALTER ROLE`, lo que significa que vive en manos de una persona y no se rota nunca.

Y hay una razón más, que es la que lo vuelve urgente: **`promover.ps1` es un `.ps1`**, y las
tuberías corren en Linux. El propio `ci.yml` ya tiene un paso que descarga PowerShell 7.4.6 de
GitHub y lo desempaca, solo para poder correr `la-version-subio.ps1`.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejarlo como está y documentar el procedimiento | Cero trabajo, y quien promueve ve con sus ojos lo que pasa | Un procedimiento que depende de que alguien se acuerde no es una garantía, y no deja registro |
| Aplicar al fusionar, sin ensayo en el PR | La mitad del valor por la mitad del trabajo | El PR seguiría sin decir qué va a hacer, que es justo lo que se quiere ver antes y no después |
| Aplicar directamente desde el PR, antes de fusionar | El ambiente de dev siempre refleja lo último | Una rama que no se fusiona habría dejado su migración puesta, y una migración aplicada no se edita jamás |
| **Ensayo en seco en el PR, y aplicación al fusionar** | El PR dice qué va a aplicar; lo que se aplica es lo que se fusionó; queda registro de la corrida | Dos piezas que mantener, y un flujo que lleva llaves |
| Una herramienta de migraciones de terceros | Trae el registro y el bloqueo hechos | Cambia la forma de las 62 migraciones que ya están, y Supabase ya trae el `db push` |

## Decisión

1. **En cada PR, el ensayo en seco contra el ambiente de la etapa**, publicado en el resumen de la
   corrida. El PR dice, antes de fusionarse, qué sentencias va a aplicar y contra qué estado.
2. **Al fusionar, la aplicación la hace un flujo**, `migrar.yml`, con GitHub Environments: a dev al
   entrar a `develop`, a qa al entrar a `qa`, y a uat al entrar a `main` **con aprobación
   obligatoria de quien dirige**. A prod no se promueve: eso es la entrega del [ADR-052](ADR-052-la-entrega-del-release-a-prod.md).
3. **La contraseña del rol `prisma_api` la fija ese mismo flujo** desde su secreto, con lo que deja
   de estar en manos de nadie y se puede rotar cambiando un secreto.
4. **El flujo va en `ubuntu-latest`**, no en el runner propio, por la misma razón por la que
   `entregar-release.yml` se quedó ahí: lleva llaves.
5. **Lo que la tubería corre, corre en Linux.** `la-version-subio`, `promover` y `sembrar` pasan a
   `sh`, y el `.ps1` de cada uno queda como un envoltorio de una línea que llama al `.sh`: una sola
   implementación, y quien escribe el `.ps1` en PowerShell sigue encontrando lo que busca. Con eso
   el `ci.yml` deja de descargar PowerShell.
6. **El orden con la API no cambia y no se reinventa**: `prisma.esquema` solo sube cuando ya existe
   la etiqueta `esquema-vX.Y.Z` ([ADR-025](ADR-025-cuatro-repositorios.md), [ADR-029](ADR-029-esquema-por-etiqueta.md)), así que la migración llega al ambiente antes
   que la API que la usa. Lo único nuevo es que quien la lleva sea un flujo.

## Justificación

El ensayo y la aplicación se separan porque responden preguntas distintas. El ensayo responde «¿qué
va a pasar?», y tiene que estar **antes** de fusionar, cuando la respuesta todavía puede cambiar la
decisión. La aplicación responde «¿pasó?», y tiene que estar **después**, sobre lo que de verdad se
fusionó, porque una migración aplicada desde una rama que luego no entra deja el ambiente con un
esquema que ningún commit describe, y una migración aplicada no se edita jamás.

La aprobación se pide solo en uat porque es el último eslabón antes de la entrega y el único donde
Gerencia mira. En dev y qa la aprobación sería una ventana que alguien cierra sin leer, que es peor
que no tenerla.

Y los guiones se mudan a `sh` en vez de envolver PowerShell en la tubería porque el envoltorio ya
está escrito y ya duele: un paso que descarga un intérprete entero de GitHub es una dependencia de
red más en el camino crítico de cada PR.

## Consecuencias

- **Positivas:** el esquema de cada ambiente queda descrito por un commit y por la corrida que lo
  aplicó. El PR dice qué va a hacer. La contraseña del rol deja de estar en manos de una persona y
  se puede rotar. El `ci.yml` pierde el paso que baja PowerShell. Y [C-05](../12-pruebas-y-calidad.md#c-05) se puede correr en
  cualquier máquina, también en una sesión de nube.
- **Negativas:** un flujo más que mantener, y con llaves adentro. Fusionar pasa a cambiar un
  ambiente, lo que significa que un PR mal revisado llega más lejos y más rápido.
- **A vigilar:** que el ensayo en seco no se vuelva un paso que nadie lee. Si empieza a dar siempre
  el mismo texto, hay que hacer que falle cuando lo que va a aplicar no es lo que el PR declara. Y
  que los `.ps1` envoltorio no vuelvan a tener lógica propia: si la tienen, hay dos
  implementaciones otra vez.

## Referencias

- [19 §4](../19-ambientes-y-entrega.md#4-versionado) y [19 §6](../19-ambientes-y-entrega.md#6-integración-continua), donde vive el camino de la promoción.
- [ADR-025](ADR-025-cuatro-repositorios.md) y [ADR-029](ADR-029-esquema-por-etiqueta.md): el orden entre la migración y la API que la usa.
- [ADR-052](ADR-052-la-entrega-del-release-a-prod.md): a prod no se promueve, se entrega.
- [ADR-071](ADR-071-el-privilegio-es-del-tamano-del-uso.md), que es la otra mitad del mismo sprint.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [ADR-071](ADR-071-el-privilegio-es-del-tamano-del-uso.md "ADR-071 · El privilegio que la base le concede a la API es del tamaño de su uso")
<!-- /generado:referenciado-desde -->
