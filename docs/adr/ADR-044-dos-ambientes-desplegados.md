# ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.3.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-044-dos-ambientes-desplegados.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-03 | 2026-10-14 | [Entrega](../INDICE.md#etiqueta-entrega) · [Plan](../INDICE.md#etiqueta-plan) |

> **Lo modifica [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md):** el ambiente que este ADR llama prod **se llama pre-prod**, no tiene
> datos reales y es donde Gerencia aprueba. **prod vive en otro repositorio**, recibe el artefacto
> tras cada release y es donde trabaja el taller. El cuerpo de abajo se conserva tal como se escribió.

> **Lo modifica [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md):** pre-prod se quita, y **uat pasa a ser el segundo ambiente desplegado**.
> La cadena es develop → qa → uat → main: cuatro ramas y tres PR. uat sigue corriendo su etapa de la
> tubería contra la base que esta levanta. El cuerpo de abajo se conserva tal como se escribió.

> **Lo modifica [ADR-056](ADR-056-qa-se-aloja-desde-su-rama.md):** qa también se despliega, en Railway y desde la rama `qa`. La
> etapa qa sigue compilando el artefacto de prod. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

El [ADR-013](ADR-013-cuatro-ambientes.md) fijó cuatro ambientes —dev, qa, uat y prod—, cada uno con su
proyecto de Supabase, y el [ADR-032](ADR-032-railway-en-dev-ahora.md) alojó dev en Railway y dejó los otros
tres para el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9). Con el [Sprint 8](../08-plan-de-desarrollo.md#sprint-8) cerrado, ese sprint es el siguiente, y seis de sus
tareas daban por hecho tres ambientes alojados más: dos de ellos de pago, porque uat y prod no se
pueden dormir ([19 §8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no)).

Quien dirige lo decidió el 2026-10-03:

- la promoción sigue siendo **develop → qa → uat → prod**;
- **solo dev y prod se despliegan**, y prod se configura al final, con el desarrollo terminado;
- **cada etapa tiene su tubería**, incremental y más exhaustiva que la anterior. qa y uat se podrán
  desplegar a futuro; hoy no.

Las ramas `qa`, `uat` y `main` ya existen en los tres repositorios de código. Lo que no existe es
qué corre en cada una.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Dos desplegados y cuatro etapas de tubería** | Un solo proyecto de pago y una sola instancia encendida. El orden de promoción no cambia, y cada etapa sigue siendo una puerta que se puede ver fallar | Ningún ambiente alojado prueba la versión entre dev y prod, y la aprobación de Gerencia pierde el sitio donde vivía |
| Sostener el [ADR-013](ADR-013-cuatro-ambientes.md): cuatro alojados | La aprobación ocurre sobre el artefacto que llega a prod, que es la garantía más fuerte | Dos proyectos de pago y dos JVM encendidas desde el primer día, para un taller con dos usuarias. Es el gasto que quien dirige decidió no hacer |
| Dos desplegados y la promoción reducida a develop → main | Lo más simple | Pierde el orden que quien dirige mantuvo, y con él el sitio donde cada batería más cara se corre una sola vez |

## Decisión

**dev y prod son los dos ambientes desplegados. qa y uat son etapas de la tubería**, cada una con
lo de la anterior y más. Una etapa es una rama, y se promueve con un PR de la anterior.

| Etapa | Rama | Lo que agrega a la anterior | Despliega |
|---|---|---|---|
| develop | `develop` | Lo que ya corre ([19 §6.1](../19-ambientes-y-entrega.md#61-en-cada-empuje-en-paralelo)): formato, análisis, unitarias, integración contra la base de la tubería, versión y compilación | dev, en Railway |
| qa | `qa` | Extremo a extremo, permisos con sesión real y la traducción de errores contra la base de la tubería. **El artefacto se construye aquí, una vez**, y se publica con su versión | Nada |
| uat | `uat` | La semilla realista y anonimizada, y la batería entera sobre ella | Nada |
| prod | `main` | Comprueba que el artefacto es el que construyó qa, sin recompilar | prod, cuando exista |

- **La regla 4 del [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas) se lee por etapas**: lo que llega a prod es el artefacto que
  pasó la etapa uat, con la misma versión. Gerencia aprueba en dev el commit de ese artefacto.
- **El proyecto qa de Supabase queda quieto.** No se borra, porque volver a desplegar qa es lo que
  se dejó para el futuro. Las pruebas que lo apuntaban pasan a apuntar a dev.
- **Donde otro documento diga «el ambiente qa» o «el ambiente uat»** como sitio alojado, se lee la
  etapa de la tubería con ese nombre. Se reescriben solo los que dicen qué se aloja, qué se paga o
  qué hay que hacer.

### Qué cambia en el plan

Las 13 tareas del [Sprint 9](../08-plan-de-desarrollo.md#sprint-9) siguen siendo 13, con su número:

| Tarea | Era | Queda |
|---|---|---|
| [9.2](../08-plan-de-desarrollo.md#tarea-9-2) | Ambiente uat en pie | Las etapas qa y uat de la tubería, uat con su semilla anonimizada. Deja de esperar a la [9.12](../08-plan-de-desarrollo.md#tarea-9-12) |
| [9.3](../08-plan-de-desarrollo.md#tarea-9-3) | Promoción de uat a prod | El artefacto que construyó qa llega a prod sin recompilar |
| [9.4](../08-plan-de-desarrollo.md#tarea-9-4) | Reversión ensayada en qa | Reversión ensayada en dev, el único alojado |
| [9.5](../08-plan-de-desarrollo.md#tarea-9-5) | Permisos en los cuatro ambientes | Permisos en cada etapa y contra dev. Deja de esperar a la [9.13](../08-plan-de-desarrollo.md#tarea-9-13) |
| [9.12](../08-plan-de-desarrollo.md#tarea-9-12) | uat y prod de pago | Solo prod de pago |
| [9.13](../08-plan-de-desarrollo.md#tarea-9-13) | Los secretos de qa | Los secretos para correr las pruebas contra dev |

## Justificación

**Lo que se ahorra en plata es poco, y hay que decirlo.** Con las cifras del [expediente](../../TODO.md#71-el-expediente-de-uat-y-prod),
Supabase baja de 35 a 25 USD al mes y Railway sigue en sus 20 del plan Pro: de ≈ 55 a ≈ 45. Lo que
más se ahorra es lo otro: un ambiente menos que migrar, asegurar, vigilar y promover en cada cambio,
para un taller con dos usuarias donde un uat alojado pasaría casi todo el mes sin que nadie lo abra.

**Lo que no se pierde es la puerta.** Cada batería cara —extremo a extremo, permisos, la semilla
realista— sigue corriendo antes de prod y se puede ver fallar. Corre contra la base que levanta la
tubería, que tiene RLS, los triggers y las migraciones de verdad
([ADR-029](ADR-029-esquema-por-etiqueta.md)).

## Consecuencias

**Positivas**

- Un solo proyecto de pago y una sola JVM encendida hasta que se decida desplegar qa o uat.
- Las dos dependencias hacia adelante de la [9.2](../08-plan-de-desarrollo.md#tarea-9-2) y la [9.5](../08-plan-de-desarrollo.md#tarea-9-5) salen de la deuda del [ADR-043](ADR-043-dependencias-solo-hacia-atras.md).

**Negativas**

- **Gerencia no aprueba el archivo que llega a prod: aprueba su commit en dev**, que Railway
  construye desde la rama. Es una garantía más débil que la del [ADR-013](ADR-013-cuatro-ambientes.md), y se acepta.
- **Lo que solo falla desplegado** —memoria de la JVM, CORS entre dominios reales, el pooler— se ve
  en dev o en prod, no antes.
- La reversión se ensaya en dev, cuyos datos son ficticios y cuyo plan se duerme.

**A vigilar**

- Si Gerencia necesita aprobar con datos realistas antes de un cambio grande, ese es el momento de
  desplegar uat, no de copiar datos a dev.
- Si una falla que solo se ve desplegada llega a prod dos veces, desplegar qa deja de ser un lujo.

## Referencias

- [ADR-013](ADR-013-cuatro-ambientes.md), los cuatro ambientes, y [ADR-032](ADR-032-railway-en-dev-ahora.md), dev en Railway.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md), donde viven las etapas.
- [`08-plan-de-desarrollo.md`](../08-plan-de-desarrollo.md), el [Sprint 9](../08-plan-de-desarrollo.md#sprint-9).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo por carriles") · [ADR-013](ADR-013-cuatro-ambientes.md "ADR-013 · Cuatro ambientes y promoción de migraciones") · [ADR-032](ADR-032-railway-en-dev-ahora.md "ADR-032 · Railway aloja dev desde ahora, y los otros tres ambientes siguen al final") · [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md "ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado") · [ADR-056](ADR-056-qa-se-aloja-desde-su-rama.md "ADR-056 · qa también se aloja en Railway, construido desde la rama qa")
<!-- /generado:referenciado-desde -->
