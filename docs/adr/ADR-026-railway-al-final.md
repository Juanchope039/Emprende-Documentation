# ADR-026 · Railway aloja la API y el front, y el despliegue va al final del desarrollo

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-026-railway-al-final.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-032](ADR-032-railway-en-dev-ahora.md) | 2026-09-16 | 2026-09-17 | [Entrega](../INDICE.md#etiqueta-entrega) · [Plan](../INDICE.md#etiqueta-plan) |

> **Lo reemplaza [ADR-032](ADR-032-railway-en-dev-ahora.md):** el código vive en GitHub y se
> despliega en Railway, tal como se decide abajo, y **qa, uat y prod siguen esperando al
> [Sprint 9](../08-plan-de-desarrollo.md#sprint-9)** por la razón que aquí se argumenta. Cambia una cosa: **dev se aloja desde ahora**, por
> la condición que este mismo ADR dejó escrita en «A vigilar» —alguien necesita ver la aplicación
> fuera de la máquina de desarrollo—, y con ella vuelven las tareas [0.8](../08-plan-de-desarrollo.md#tarea-0-8) y [0.9](../08-plan-de-desarrollo.md#tarea-0-9) al [Sprint 0](../08-plan-de-desarrollo.md#sprint-0). La
> condición 1 de abajo —promover la imagen, no recompilarla— **no se cumple en dev**, y el
> [ADR-032](ADR-032-railway-en-dev-ahora.md) explica por qué. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

El [Sprint 0](../08-plan-de-desarrollo.md#sprint-0) daba por hecho que desde el primer día habría a dónde publicar. La tarea [0.8](../08-plan-de-desarrollo.md#tarea-0-8) pide la
imagen de la API **arrancando en los cuatro ambientes**; la 0.9, que **un cambio fusionado llegue
solo a dev**; y el hito [H1](../08-plan-de-desarrollo.md#h1) se cumple cuando eso pasa
([`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md)).

Pero ningún documento elegía proveedor. [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md)
[§8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no) dice qué se paga en cada ambiente y [`09-plan-de-implantacion.md`](../09-plan-de-implantacion.md)
[§3.2](../09-plan-de-implantacion.md#32-alojar-la-api-de-java-en-los-cuatro-ambientes) cuánta memoria necesita la JVM, sin decir dónde corre ninguna de las dos cosas.

Mientras tanto, el código ya tiene casa: los cuatro repositorios de
[ADR-025](ADR-025-cuatro-repositorios.md) tienen su remoto en GitHub, y la integración continua de
la API y del front corre en GitHub Actions.

Quien dirige el proyecto decidió dos cosas:

1. **El código vive en GitHub.**
2. **Se despliega en Railway, y al final del desarrollo.**

La primera ya era un hecho. La segunda mueve dos tareas del [Sprint 0](../08-plan-de-desarrollo.md#sprint-0) y parte un hito, y por eso
este ADR existe.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Railway, al final del desarrollo** | Despliega contenedores, que es justo lo que la API ya produce: un `Dockerfile` en dos etapas con JRE 25 y sonda de disponibilidad ([19 §2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro)). Y no se paga alojamiento durante meses para ambientes que todavía no tienen usuarios | **Nadie despliega en un ambiente de verdad hasta el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).** La puerta de qa ([21 §6.4](../21-trabajo-en-paralelo.md#64-ambientes)) y el «llegó al menos hasta qa» de la definición de terminado no existen mientras tanto. Y el front web no trae cómo construirse en Railway: hay que escribirlo |
| Railway desde el [Sprint 0](../08-plan-de-desarrollo.md#sprint-0), como decía el plan | [H1](../08-plan-de-desarrollo.md#h1) se cumple tal cual: cada cambio fusionado llega a dev, y los fallos de despliegue aparecen de a uno, cuando son baratos | Se paga alojamiento todo el desarrollo por ambientes que nadie usa todavía |
| Otro proveedor de contenedores | Cualquiera corre una imagen de contenedor | No se evaluaron a fondo, y conviene decirlo. Lo que pesó fue que Railway ya estaba elegido y conectado a `prisma_front` |

## Decisión

**El código vive en GitHub y se despliega en Railway, al final del desarrollo.**

| Qué | Dónde | Desde cuándo |
|---|---|---|
| Los cuatro repositorios | GitHub | Ya |
| Integración continua | GitHub Actions, en cada push y cada PR a `main` | Ya, en la API y en el front |
| La API, como imagen de contenedor | Railway | [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) |
| El front web, compilado por ambiente | Railway | [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) |
| Base de datos, Auth y Storage | Supabase, un proyecto por ambiente ([ADR-013](ADR-013-cuatro-ambientes.md)) | dev ya existe; qa, uat y prod antes de promover |

### Qué cambia en el plan

- **Las tareas [0.8](../08-plan-de-desarrollo.md#tarea-0-8) y [0.9](../08-plan-de-desarrollo.md#tarea-0-9) pasan al [Sprint 9](../08-plan-de-desarrollo.md#sprint-9)**, junto a la promoción (9.2 a 9.4), que es donde se
  vuelven a necesitar. El resto del [Sprint 0](../08-plan-de-desarrollo.md#sprint-0) no cambia.
- **[H1](../08-plan-de-desarrollo.md#h1) se parte en dos.** Lo que no depende de desplegar —la versión en el pie de la barra lateral y
  el sobre en toda respuesta— se cumple al cerrar el [Sprint 0](../08-plan-de-desarrollo.md#sprint-0). «Un cambio fusionado se despliega
  solo hasta dev» se cumple en el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).
- **Hasta entonces, dev es la máquina de quien desarrolla, contra el proyecto dev de Supabase.** Es
  lo que [19 §8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no) ya permitía para dev.
- **Mientras no exista qa, «terminado» significa fusionado a `main` con la integración continua en
  verde.** El requisito de llegar a qa vuelve a exigirse desde el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).

### Tres condiciones para el día que se configure

No son nuevas: ya estaban decididas, y Railway tiene que cumplirlas.

1. **Se promueve la imagen, no se recompila** ([ADR-013](ADR-013-cuatro-ambientes.md); [19 §2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye)). La
   imagen de la API se construye una vez, con su etiqueta SemVer
   ([ADR-014](ADR-014-semver.md)), y cada ambiente despliega esa etiqueta. Construir desde el
   repositorio en cada ambiente sería compilar cuatro veces.
2. **uat y prod no se duermen** ([19 §2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro) y [§8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no)). Si el plan contratado ofrece apagar el servicio
   por inactividad, queda desactivado en esos dos.
3. **Los secretos viven en las variables del ambiente, nunca en el repositorio** ([19 §3.3](../19-ambientes-y-entrega.md#33-dónde-viven-los-secretos)), y la
   `service_role` no entra en el servicio de la API ([ADR-012](ADR-012-identidad-a-postgres.md),
   [ADR-025](ADR-025-cuatro-repositorios.md)).

## Justificación

**Desplegar al final ahorra plata y cuesta integración, y el segundo costo es el que hay que
vigilar.** El plan puso la tubería en el [Sprint 0](../08-plan-de-desarrollo.md#sprint-0) con un argumento que sigue siendo cierto: sin
ella, cada despliegue se hace a mano y distinto ([08 §7](../08-plan-de-desarrollo.md#7-orden-de-construcción-y-por-qué)). Lo que se compra al moverla es no pagar
meses de alojamiento sin usuarios. Lo que se pierde es descubrir temprano lo que solo falla
desplegado: la memoria de la JVM, una variable que falta, la sonda de salud, CORS entre dominios
reales.

**Parte de ese riesgo ya está cubierto.** La integración continua de la API construye la imagen en
cada push a `main`, así que un `Dockerfile` roto se ve el mismo día; la del front compila la versión
web en cada push. Lo que queda sin probar hasta el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) es que esas piezas arranquen juntas en
un ambiente real, y esa es exactamente la parte que un despliegue temprano habría dado gratis.

## Consecuencias

- **Positivas:** no se paga alojamiento mientras no hay nada que mostrar; el [Sprint 0](../08-plan-de-desarrollo.md#sprint-0) se cierra con
  lo que depende del código y no de un proveedor; y las tres condiciones de arriba quedan escritas
  antes de configurar nada, que es cuando son baratas.

- **Negativas:** **el primer despliegue real llega en el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9)**, con todo lo construido encima.
  La puerta de qa no existe durante el desarrollo, así que dos equipos en paralelo integran contra
  `main` y no contra un ambiente compartido. El front necesita una receta de construcción para
  Railway que hoy no existe. Y mientras dev sea el proyecto de Supabase en la nube, la base de
  desarrollo es compartida, que es lo que [21 §6.4](../21-trabajo-en-paralelo.md#64-ambientes) pide evitar: con una sola persona desarrollando no
  estorba, con dos equipos sí.

- **A vigilar:** si antes del [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) hace falta que alguien vea una funcionalidad fuera de la
  máquina de desarrollo —Gerencia, por ejemplo—, ese es el momento de adelantar la 0.9, no de
  improvisar un despliegue a mano. Y si el primer despliegue del [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) obliga a rehacer algo de la
  API, esta decisión costó más de lo que ahorró, y conviene decirlo en la retrospectiva.

## Referencias

- [ADR-013](ADR-013-cuatro-ambientes.md) — los cuatro ambientes y la promoción
- [ADR-014](ADR-014-semver.md) — la etiqueta SemVer de la imagen
- [ADR-025](ADR-025-cuatro-repositorios.md) — los cuatro repositorios que viven en GitHub
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye), [§2.4](../19-ambientes-y-entrega.md#24-el-artefacto-de-la-api-una-imagen-de-contenedor-con-una-jvm-adentro), [§3.3](../19-ambientes-y-entrega.md#33-dónde-viven-los-secretos) y [§8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no)
- [`09-plan-de-implantacion.md`](../09-plan-de-implantacion.md) [§3.1](../09-plan-de-implantacion.md#31-alistamiento-técnico-de-los-ambientes) y [§3.2](../09-plan-de-implantacion.md#32-alojar-la-api-de-java-en-los-cuatro-ambientes)
- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md) — las tareas [0.8](../08-plan-de-desarrollo.md#tarea-0-8), [0.9](../08-plan-de-desarrollo.md#tarea-0-9) y el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9)

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [16](../16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [ADR-032](ADR-032-railway-en-dev-ahora.md "ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final")
<!-- /generado:referenciado-desde -->
