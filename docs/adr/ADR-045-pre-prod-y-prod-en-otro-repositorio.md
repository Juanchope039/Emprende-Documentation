# ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.2.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-045-pre-prod-y-prod-en-otro-repositorio.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-04 | 2026-10-10 | [Entrega](../INDICE.md#etiqueta-entrega) · [Plan](../INDICE.md#etiqueta-plan) |

> **Lo modifica [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md):** pre-prod no corre la imagen de qa: Railway lo construye desde
> la rama `pre-prod`, como dev desde `develop`, y esa rama es la última etapa de la tubería en lugar
> de `main`. El cuerpo de abajo se conserva tal como se escribió.

> **Lo modifica [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md):** el ambiente que este ADR llama pre-prod **se quita, y uat ocupa su
> lugar**: hereda su proyecto de Supabase de pago, su alojamiento sin dormirse, Swagger cerrado y la
> aprobación de Gerencia. prod sigue viviendo en otro repositorio, igual que aquí se decidió. El
> cuerpo de abajo se conserva tal como se escribió.

## Contexto

El [ADR-044](ADR-044-dos-ambientes-desplegados.md) dejó dos ambientes alojados, dev y prod, y qa y uat como etapas de la tubería. En ese
esquema, prod era a la vez el último ambiente que este proyecto aloja y el sitio donde el taller
trabaja con sus datos reales.

Quien dirige lo corrigió el 2026-10-04:

- qa y uat siguen siendo etapas de la tubería: **ninguna de las dos se aloja**;
- **el prod del [ADR-044](ADR-044-dos-ambientes-desplegados.md) se queda tal cual, pero se llama pre-prod**;
- **prod existe después de pre-prod, en otro repositorio**: tras cada release, el artefacto se
  despliega allá;
- **el taller trabaja en ese prod**, con sus datos reales. Pre-prod no tiene datos reales;
- el cambio de nombre **se aplica en todo**: los documentos, el código y la tubería.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **pre-prod alojado aquí, y prod en otro repositorio** | Gerencia aprueba el artefacto mismo que llega a prod, no su commit en dev. Lo que solo falla desplegado se ve antes de prod. Los datos reales salen de este proyecto | Este proyecto deja de operar prod: la base, el despliegue y la reversión del taller viven en otro sitio. Además, hay un ambiente alojado y de pago que no es el del taller |
| Sostener el [ADR-044](ADR-044-dos-ambientes-desplegados.md): prod alojado aquí | Un ambiente pagado menos | Quien dirige quiere que el taller viva en otro repositorio |
| Cambiar solo el nombre, sin un prod después | No cambia nada más | Un ambiente que se llama «pre» y tiene los datos reales invita a probar sobre ellos. Es lo que el [R-22](../11-riesgos-y-proteccion-de-datos.md#r-22) quiere evitar |

## Decisión

**La cadena tiene cinco eslabones, y solo dos se alojan aquí: dev y pre-prod.**

| Eslabón | Rama | Qué es | Se aloja | Datos |
|---|---|---|---|---|
| develop | `develop` | La etapa de cada fusión | dev, en Railway | Ficticios |
| qa | `qa` | Etapa de la tubería. **Compila el artefacto una vez** | No | Ficticios |
| uat | `uat` | Etapa de la tubería, sobre la semilla anonimizada | No | Anonimizados |
| **pre-prod** | `main` | El prod del [ADR-044](ADR-044-dos-ambientes-desplegados.md) con otro nombre. Gerencia aprueba aquí | Sí, de pago y sin dormirse | **Anonimizados** |
| **prod** | — | Donde trabaja el taller. **Vive en otro repositorio** y recibe el artefacto tras cada release | Fuera de este proyecto | Reales |

- **pre-prod hereda todo lo que el [ADR-044](ADR-044-dos-ambientes-desplegados.md) decía de prod**: su proyecto de Supabase de pago
  ([9.12](../08-plan-de-desarrollo.md#tarea-9-12)), su alojamiento sin dormirse, Swagger detrás de autenticación y el artefacto que construyó
  qa, sin recompilar. **Lo único que no hereda son los datos reales**, que se quedan en prod.
- **La regla 4 del [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas) vuelve a su sitio**: Gerencia aprueba en pre-prod el mismo artefacto
  que después llega a prod. No aprueba un commit en dev.
- **Lo que este proyecto escribe sobre prod sigue valiendo para prod**, aunque lo opere otro
  repositorio: los datos reales, los tres niveles de respaldo, el alistamiento de usuarios, la
  migración del Excel y la regla de que ninguna prueba escribe ahí.
- **La rama `main` no cambia de nombre.** Es la rama por defecto de los cuatro repositorios, y lo
  que cambia es el ambiente al que despliega.

### Cómo se aplica el nombre en el código

`prod` no se borra: sigue nombrando el ambiente del taller, que corre este mismo artefacto. Lo que
se agrega es `pre-prod`.

| Dónde | Hoy | Queda |
|---|---|---|
| `PRISMA_AMBIENTE` y el `ambiente` del contrato | `dev`, `qa`, `uat`, `prod` | Se suma `pre-prod` |
| El perfil de Spring | `prod` | Se suma `pre-prod`, con Swagger detrás de autenticación |
| La insignia y la franja del front | Sin franja en prod | pre-prod lleva franja, como dev: sus datos no son reales. prod sigue sin franja |
| La etiqueta de GHCR | `:prod`, la pone la etapa de `main` | `:pre-prod`. `:prod` la pone la entrega a prod |
| Las variables de la CI del front | `PROD_API_URL`, `PROD_API_MAJOR` | Se suman `PRE_PROD_API_URL` y `PRE_PROD_API_MAJOR`: qa compila un front para cada uno |

**El front se compila una vez por destino**, como ya dice el [19 §2.3](../19-ambientes-y-entrega.md#23-el-artefacto-se-promueve-no-se-reconstruye): la URL de la API queda dentro
del artefacto. qa compila desde el mismo commit el de pre-prod y el de prod. La API es una sola
imagen para los dos.

### Qué cambia en el plan

| Tarea | Queda |
|---|---|
| [9.12](../08-plan-de-desarrollo.md#tarea-9-12) | El proyecto **pre-prod** de Supabase, el único de pago de este proyecto |
| [9.14](../08-plan-de-desarrollo.md#tarea-9-14), nueva | El nombre pre-prod en el código: contrato, perfil, ambiente, franja, CORS, etiqueta de GHCR y variables de la CI |
| [9.15](../08-plan-de-desarrollo.md#tarea-9-15), nueva | La entrega del release a prod en el otro repositorio. Falta decir cuál es, qué recibe y quién la dispara |

## Justificación

**Lo que más se gana es la firma de Gerencia.** Con el [ADR-044](ADR-044-dos-ambientes-desplegados.md), Gerencia aprobaba en dev un commit
que Railway construía desde la rama, y el artefacto que llegaba a prod era otro archivo. En pre-prod
aprueba el archivo mismo, y vuelve la garantía del [ADR-013](ADR-013-cuatro-ambientes.md).

**Lo que más se pierde es el control de prod.** Este proyecto puede garantizar lo que entrega, pero
no lo que hace el otro repositorio con ello. La reversión ensayada en la [9.4](../08-plan-de-desarrollo.md#tarea-9-4) y el [19 §7](../19-ambientes-y-entrega.md#7-publicar-y-volver-atrás)
valen hasta pre-prod. En prod valen solo si ese repositorio los adopta.

## Consecuencias

**Positivas**

- Gerencia aprueba el artefacto que llega al taller, sobre datos que no son reales.
- Lo que solo falla desplegado —memoria de la JVM, CORS entre dominios reales, el pooler— se ve en
  pre-prod, antes del taller.
- Los datos personales del taller ([Ley 1581 de 2012](../11-riesgos-y-proteccion-de-datos.md)) no pasan por ningún ambiente de este proyecto.

**Negativas**

- **Hay un ambiente de pago que el taller no usa.** pre-prod cuesta lo que costaba prod, y el prod
  de verdad se paga aparte, en el otro repositorio.
- **Un artefacto puede estar sano en pre-prod y romperse en prod** por lo que difiera entre los dos:
  la base, los datos reales, el dominio. Este proyecto no lo ve.
- La configuración de prod —URL, MAJOR, orígenes— tiene que conocerse en la etapa qa, porque el front
  se compila con ella.

**A vigilar**

- Si pre-prod pasa meses sin que Gerencia lo abra, dejarlo dormir es una decisión de costo que se
  puede tomar con otro ADR. Hoy se queda tal cual.
- Si la entrega a prod ([9.15](../08-plan-de-desarrollo.md#tarea-9-15)) termina siendo un paso a mano, la promesa de la regla 4 depende de
  que nadie recompile del otro lado.

## Referencias

- [ADR-044](ADR-044-dos-ambientes-desplegados.md), que este modifica, y [ADR-013](ADR-013-cuatro-ambientes.md), cuya garantía recupera.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md), donde viven los ambientes y las etapas.
- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md), el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [10](../10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [13](../13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [Contrato](../../contrato/README.md "Contrato de la API · v0.33.0") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md "ADR-046 · pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería") · [ADR-049](ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md "ADR-049 · Sin DOCS_CLAVE, Swagger toma PREPROD_GERENCIA_CLAVE") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado")
<!-- /generado:referenciado-desde -->
