# ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-032-railway-en-dev-ahora.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-17 | 2026-10-03 | [Entrega](../INDICE.md#etiqueta-entrega) · [Plan](../INDICE.md#etiqueta-plan) |

> **Lo modifica [ADR-044](ADR-044-dos-ambientes-desplegados.md):** de los tres ambientes que este ADR
> dejaba para el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9), **solo prod se aloja**, y al final. qa y uat pasan a ser etapas de la
> tubería, sin servicio en Railway. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

El [ADR-026](ADR-026-railway-al-final.md) mandó el despliegue al [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) para no pagar alojamiento durante meses por
ambientes sin usuarios. Anotó también lo que eso costaba: **el primer despliegue real llegaría con
todo lo construido encima**, y lo que solo falla desplegado —la memoria de la JVM, una variable que
falta, la sonda de salud, CORS entre dominios reales— no se vería hasta entonces.

Y dejó una condición escrita para revisar la decisión:

> Si antes del [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) hace falta que alguien vea una funcionalidad fuera de la máquina de
> desarrollo —Gerencia, por ejemplo—, ese es el momento de adelantar la [0.9](../08-plan-de-desarrollo.md#tarea-0-9), no de improvisar un
> despliegue a mano.

Quien dirige pidió ver la aplicación funcionando en línea. Esa es la condición, cumplida. Este ADR
la ejecuta por la vía que el 026 nombró, y no por la que nombró para prohibirla.

Lo que hay para enseñar, con 45 de las 132 tareas hechas, es la puerta del sistema: el front con su
franja de ambiente y su insignia de versión, «Acerca de» preguntándole la versión a la API, y el
acceso funcionando contra Supabase Auth con los permisos juzgados por PostgreSQL. Detrás del acceso
no hay pantallas todavía. No es poco: es el camino entero —navegador, Railway, API, pooler, RLS—
funcionando junto por primera vez.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Solo dev en Railway ahora; qa, uat y prod en el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9)** | Se ve la aplicación en línea esta semana y aparecen hoy los fallos que el [ADR-026](ADR-026-railway-al-final.md) dejaba para el final, cuando son baratos. El gasto es el de un ambiente en plan gratuito, que es lo que el [19 §8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no) ya permitía para dev | La [0.8](../08-plan-de-desarrollo.md#tarea-0-8) pide «arranque verificado en los cuatro ambientes» y solo se verifica uno: queda cumplida a medias y hay que decirlo. Y el plan gratuito se duerme, así que lo que se enseñe hoy puede no estar el lunes |
| Los cuatro ambientes ahora | Cumple la [0.8](../08-plan-de-desarrollo.md#tarea-0-8) tal como está escrita y la promoción del [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) queda ensayada | uat y prod no pueden dormirse ([RNF-20](../03-requisitos-y-bdd.md#rnf-20)), así que son plan pago desde el primer día: es exactamente el gasto que el [ADR-026](ADR-026-railway-al-final.md) evitó, y sin nadie que los use. Y qa va cuatro migraciones atrás ([1.12](../08-plan-de-desarrollo.md#tarea-1-12)) |
| Sostener el [ADR-026](ADR-026-railway-al-final.md) y enseñar la aplicación desde la máquina de desarrollo | Cuesta cero y no mueve ninguna tarea | No se puede enseñar fuera de la máquina, que es justo lo que se pidió. Y deja intacto el riesgo que el propio 026 anotó: descubrir en el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9), con todo encima, lo que solo falla desplegado |
| Un despliegue a mano, sin papeleo | Está en línea hoy | Es lo único que el [ADR-026](ADR-026-railway-al-final.md) nombra explícitamente para prohibirlo. Nadie podría repetirlo ni revertirlo, y el segundo despliegue sería tan caro como el primero |

## Decisión

**Railway aloja el ambiente dev desde ahora. qa, uat y prod siguen en el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).**

| Qué | Dónde | Desde cuándo |
|---|---|---|
| La API de dev, como imagen de contenedor | Railway, construida desde el repositorio | Ahora ([0.8](../08-plan-de-desarrollo.md#tarea-0-8)) |
| El front web de dev, compilado con sus `--dart-define` | Railway, servido por `nginx` | Ahora ([0.9](../08-plan-de-desarrollo.md#tarea-0-9)) |
| La entrega automática a dev al fusionar en `develop` | Railway, enganchado al repositorio | Ahora ([0.9](../08-plan-de-desarrollo.md#tarea-0-9)) |
| qa, uat y prod | Railway | [Sprint 9](../08-plan-de-desarrollo.md#sprint-9), sin cambio |
| La promoción del artefacto entre ambientes | Registro de imágenes | [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) ([9.3](../08-plan-de-desarrollo.md#tarea-9-3)), sin cambio |

### Qué cambia en el plan

- **Las tareas [0.8](../08-plan-de-desarrollo.md#tarea-0-8) y [0.9](../08-plan-de-desarrollo.md#tarea-0-9) vuelven al [Sprint 0](../08-plan-de-desarrollo.md#sprint-0)**, de donde el [ADR-026](ADR-026-railway-al-final.md) las sacó. El [Sprint 9](../08-plan-de-desarrollo.md#sprint-9)
  vuelve a sus 11,5 días.
- **La [0.8](../08-plan-de-desarrollo.md#tarea-0-8) se cumple en dev, no en los cuatro ambientes**, y deja de depender de [H4](../08-plan-de-desarrollo.md#h4) a [H9](../08-plan-de-desarrollo.md#h9). Verificar el
  arranque en qa, uat y prod se hace cuando esos ambientes existan, en el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9). No se parte en dos
  tareas: el plan y el tablero tienen que enumerar las mismas 132.
- **El [H1](../08-plan-de-desarrollo.md#h1) se vuelve a unir.** Lo que el [ADR-026](ADR-026-railway-al-final.md) partió en dos —«un cambio fusionado se despliega solo
  hasta dev»— se cumple aquí.
- **«Terminado» sigue siendo fusionado a `develop` con la integración continua en verde.** Tener dev
  en línea no crea la puerta de qa: qa sigue sin existir, y el [21 §6.4](../21-trabajo-en-paralelo.md#64-ambientes) sigue esperando al [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).

### Las tres condiciones del [ADR-026](ADR-026-railway-al-final.md), revisadas

1. **«Se promueve la imagen, no se recompila» — no se cumple en dev, y es deliberado.** Railway
   construye desde el repositorio. Hoy no hay alternativa: el trabajo `imagen` de la integración
   continua hace un `docker build` suelto, sin registro ni `push`, y solo en `main`. La promoción
   por etiqueta ([19 §2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye)) sigue siendo la regla **entre ambientes**, que es donde importa: lo que
   Gerencia apruebe en uat será la imagen que vaya a prod. Dev construye desde su rama porque dev es
   donde se prueba que la imagen construye.
2. **«uat y prod no se duermen» — intacta.** Dev sí se duerme, y el plan gratuito de Supabase se
   pausa tras una semana sin actividad. Dev nunca estuvo cubierto por el [RNF-20](../03-requisitos-y-bdd.md#rnf-20), que habla de
   ambientes de negocio.
3. **«Los secretos viven en las variables del ambiente» — intacta y ahora comprobable.** Ningún
   secreto entra al repositorio ni al artefacto del front, que se compila con `--dart-define` y viaja
   al navegador. La `service_role` no toca el servicio de la API.

## Justificación

**Lo que se compra es el riesgo que el [ADR-026](ADR-026-railway-al-final.md) aceptó a sabiendas.** Su texto lo anotó como consecuencia
negativa: el primer despliegue llegaría al final, con todo encima. Adelantar dev convierte ese riesgo
en cuatro fallos concretos que ya aparecieron **antes** de desplegar nada, solo por preparar el
terreno: la aplicación ignoraba la variable `PORT` que Railway inyecta y habría quedado inalcanzable
con el proceso vivo; la sonda de disponibilidad respondía `UP` con la base caída; el front no tenía
receta de publicación; y el motor del front se descargaba de un CDN de Google en cada arranque. Los
cuatro habrían aparecido en el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) juntos y con prisa.

**Lo que se paga es poco y acotado.** Un ambiente en plan gratuito, que el [19 §8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no) ya contemplaba
para dev. La razón del [ADR-026](ADR-026-railway-al-final.md) —no pagar meses por ambientes sin usuarios— se conserva entera para
los tres que sí cuestan.

**Y hay un costo que no es dinero:** dev deja de ser «la máquina de quien desarrolla» y pasa a ser un
sitio en internet con las cuentas de la semilla abiertas. Mientras esas contraseñas sigan siendo las
de la semilla, el enlace no se comparte fuera de quien tenga que verlo. Cambiarlas en dev es lo que
cierra ese riesgo, y no está hecho.

## Consecuencias

- **Positivas:** la aplicación se puede enseñar; el [H1](../08-plan-de-desarrollo.md#h1) se cumple entero; los fallos que solo se ven
  desplegados aparecen de a uno y no todos juntos al final; y el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) llega con la receta de
  publicación escrita y probada, que era lo que el [ADR-026](ADR-026-railway-al-final.md) dejaba sin hacer.

- **Negativas:** dev construye desde el repositorio y no promueve una imagen, así que el
  [19 §2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye) describe lo que pasa entre ambientes y no lo que pasa en dev. El ambiente se duerme, así
  que lo que se enseñe hoy puede pedir un despertar manual el lunes. Y la [0.8](../08-plan-de-desarrollo.md#tarea-0-8) queda cumplida en un
  ambiente de cuatro.

- **A vigilar:** **dos dominios distintos para la API y el front comprometen a la [2.2](../08-plan-de-desarrollo.md#tarea-2-2)**. La cookie
  `prisma_renovacion` que esa tarea trae exigirá `SameSite=None` y `allowCredentials=true` —hoy en
  `false`, con su justificación escrita—, y `*.up.railway.app` está en la Public Suffix List, así que
  ni siendo subdominios hermanos la comparten. Si la [2.2](../08-plan-de-desarrollo.md#tarea-2-2) resulta cara por eso, el sitio de la
  decisión es este ADR y la alternativa era un solo dominio con `nginx` haciendo de proxy. Y si el
  ambiente dormido estorba más de lo que ahorra, el plan pago de dev es una decisión de gasto que
  toma quien dirige.

## Referencias

- [ADR-026](ADR-026-railway-al-final.md) — la decisión que este reemplaza, y de donde sale la condición que lo autoriza
- [ADR-013](ADR-013-cuatro-ambientes.md) — los cuatro ambientes y la promoción
- [ADR-014](ADR-014-semver.md) — la etiqueta SemVer de la imagen
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye), [§2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro), [§3.3](../19-ambientes-y-entrega.md#33-dónde-viven-los-secretos) y [§8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no)
- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md) — las tareas [0.8](../08-plan-de-desarrollo.md#tarea-0-8) y [0.9](../08-plan-de-desarrollo.md#tarea-0-9), el [H1](../08-plan-de-desarrollo.md#h1) y el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9)
- [RNF-20](../03-requisitos-y-bdd.md#rnf-20) — la base siempre en línea, que cubre los ambientes de negocio y no dev

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [Contrato](../../contrato/README.md "Contrato de la API · v0.37.0") · [ADR-026](ADR-026-railway-al-final.md "ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo") · [ADR-034](ADR-034-la-version-sube-en-cada-pr.md "ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada")
<!-- /generado:referenciado-desde -->
