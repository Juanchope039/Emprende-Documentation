# ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-10 | 2026-10-14 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

> **Lo modifica [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md):** Railway ya no construye el uat alojado desde la rama `uat` de cada
> repositorio, sino desde `main` del monorepo de producto, y la rama `uat` sale: su etapa la corre
> `main`. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

La cadena venía de tres correcciones seguidas. El [ADR-044](ADR-044-dos-ambientes-desplegados.md) dejó dos ambientes alojados y convirtió qa
y uat en etapas de la tubería. El [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md) llamó pre-prod al último alojado aquí y mandó prod a
otro repositorio. El [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) hizo que Railway construyera pre-prod desde su propia rama, y el
[ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) devolvió a `main` su lugar como quinta etapa.

Lo que quedó son **cinco ramas y cuatro PR por release**, con dos eslabones seguidos que hacen casi
lo mismo: `uat` corre la batería entera y marca el artefacto, y `pre-prod` vuelve a comprobar el
árbol y lo despliega. Y pre-prod **nunca llegó a existir**: su proyecto de Supabase es la
[9.12](../08-plan-de-desarrollo.md#tarea-9-12), una decisión pendiente, y es el único de pago de todo el proyecto
([19 §8.1](../19-ambientes-y-entrega.md#81-qué-se-paga-y-qué-no)).

Quien dirige lo decidió el 2026-10-10: **pre-prod se quita, y uat pasa a ser el ambiente de
despliegue** en su lugar.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Quitar pre-prod y desplegar uat** (la decisión) | Un eslabón menos y un PR menos por release. El ambiente que corre la batería entera es el mismo que Gerencia abre, así que lo aprobado y lo probado no se pueden separar. El proyecto de pago sigue siendo uno | uat deja de ser solo una etapa: hay que decidir si la batería escribe en el ambiente que Gerencia mira, y Swagger queda expuesto en un dominio público |
| Sostener el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md): pre-prod alojado y uat como etapa | Nada que cambiar, y la aprobación ocurre en un ambiente que nadie más toca | Cinco ramas para cuatro cosas distintas, y un ambiente que en una semana de trabajo nadie abre dos veces |
| Quitar pre-prod y no desplegar nada en su lugar | Lo más barato: un solo ambiente alojado | Gerencia aprobaría un commit en dev, que es justo lo que el [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md) deshizo |
| Renombrar la rama `pre-prod` a `uat` y dejar la etapa uat sin rama | El cambio sería de una línea | Dos cosas distintas con un nombre: la etapa que prueba y el ambiente que se despliega. El problema no era el nombre |

## Decisión

**La cadena tiene cuatro eslabones, y dos se alojan: dev y uat.**

| Eslabón | Rama | Qué es | Se aloja | Datos |
|---|---|---|---|---|
| develop | `develop` | La etapa de cada fusión | dev, en Railway, construido desde la rama | Ficticios |
| qa | `qa` | Etapa de la tubería. **Compila el artefacto una vez** | No | Ficticios |
| **uat** | `uat` | Etapa de la tubería sobre la semilla anonimizada, y **el ambiente donde Gerencia aprueba** | Sí, de pago y sin dormirse, construido desde la rama | **Anonimizados** |
| main | `main` | Comprueba que el árbol es el que compiló qa. No construye, no publica y no despliega | No | — |
| prod | — | Donde trabaja el taller. **Vive en otro repositorio** y recibe el artefacto tras cada release | Fuera de este proyecto | Reales |

1. **uat hereda de pre-prod todo lo que pre-prod heredó de prod**: el proyecto de Supabase de pago
   de la [9.12](../08-plan-de-desarrollo.md#tarea-9-12), el alojamiento que no se duerme, Swagger detrás de autenticación y la
   aprobación de Gerencia. Railway lo construye desde la rama `uat`, como dev desde `develop`.
2. **`main` sigue siendo la última etapa** ([ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md)), y ahora recibe a `uat` por PR. La cadena de
   ramas es **develop → qa → uat → main**: cuatro ramas y tres PR.
3. **La etapa uat de la tubería sigue levantando su propia base** y sumándole
   `scripts/db/semilla-uat.sql`. La batería no escribe en el ambiente alojado: una prueba que
   escribe donde Gerencia está mirando lo ensucia.
4. **El uat alojado nace sin nadie en `usuarios`**, como iba a nacer pre-prod. La semilla no entra
   —el guion solo admite `dev` y `qa`—, y la primera cuenta la crea Gerencia con la credencial
   temporal de la [9.16](../08-plan-de-desarrollo.md#tarea-9-16).
5. **Swagger queda cerrado en uat.** El perfil de Spring `pre-prod` pasa a llamarse `uat` y hereda
   lo que hacía, y `PREPROD_GERENCIA_CLAVE` pasa a ser `UAT_GERENCIA_CLAVE` ([ADR-049](ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md)). El catálogo
   de endpoints es un mapa del sistema, y uat pasa a tener dominio público.
6. **El valor `pre-prod` sale del contrato y del front**: el enum `ambiente` queda `dev`, `qa`,
   `uat` y `prod`, y con él se va `Ambiente.preProd`. La franja de «los datos no son reales» queda
   en dev, qa y uat. `prod` se queda, porque sigue nombrando el ambiente del taller.
7. **Las ramas principales pasan de cinco a cuatro** en `scripts/github/politicas-de-ramas.json`:
   `develop`, `qa`, `uat` y `main` ([ADR-048](ADR-048-las-ramas-principales-las-protege-github.md)). La rama `pre-prod` se borra en los tres
   repositorios de código **después** de que las promociones hayan subido.
8. **La entrega a prod no cambia de forma** ([ADR-052](ADR-052-la-entrega-del-release-a-prod.md)): sale de `main`, no recompila nada y se
   dispara a mano. Lo que cambia es dónde aprobó Gerencia, que ahora es uat.

## Justificación

**Dos eslabones seguidos que comprueban el mismo árbol no son dos garantías, son una repetida.** La
etapa uat ya corría la batería entera sobre la semilla anonimizada; pre-prod volvía a comprobar el
árbol y además lo desplegaba. Juntarlos deja la aprobación de Gerencia sobre el mismo ambiente que
pasó la batería más cara, que es más fuerte que aprobarla en un ambiente que solo comprobó un hash.

**Lo que se pierde es el aislamiento.** Con pre-prod, el ambiente que Gerencia abría no era el que
ninguna prueba tocaba. Por eso la decisión 3: la batería sigue corriendo contra la base que levanta
la tubería, y el uat alojado solo recibe migraciones y despliegues. Si algún día la batería tuviera
que correr contra el ambiente de verdad, eso es otra decisión y otro ADR.

**En plata no cambia nada**, y conviene decirlo: el proyecto de pago sigue siendo uno, solo que
ahora se llama uat. Lo que se ahorra es un PR por release, una rama que mantener y un ambiente
menos que configurar, asegurar y vigilar.

## Consecuencias

**Positivas**

- Cuatro ramas y tres PR por release, en lugar de cinco y cuatro.
- Gerencia aprueba en el ambiente que pasó la batería entera, no en uno que solo comprobó el árbol.
- Un ambiente menos que configurar, y una decisión pendiente —la [9.12](../08-plan-de-desarrollo.md#tarea-9-12)— que ya no espera a un
  nombre que no existía.

**Negativas**

- La etapa uat y el ambiente uat se llaman igual y no son lo mismo: una prueba y un sitio. Los
  documentos tienen que decir cuál de los dos es cada vez.
- Swagger pasa a estar cerrado en uat, así que hay una credencial más que configurar donde antes no
  hacía falta.
- Seis ADR aceptados quedan con una nota que los modifica, y el [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md) queda reemplazado.

**A vigilar**

- **Que nadie confunda la etapa con el ambiente.** Si una prueba empieza a escribir en el uat
  alojado, Gerencia va a aprobar datos que puso una prueba.
- **La reversión en uat** ([19 §7.2](../19-ambientes-y-entrega.md#72-volver-atrás)) nunca se ensayó: lo medido es el ensayo en dev de la
  [9.4](../08-plan-de-desarrollo.md#tarea-9-4). Los números valen como piso.

## Referencias

- [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md), que este reemplaza.
- [ADR-044](ADR-044-dos-ambientes-desplegados.md), [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md), [ADR-049](ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md), [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md) y [ADR-052](ADR-052-la-entrega-del-release-a-prod.md), que este modifica.
- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), que protege las ramas principales, ahora cuatro.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md), donde viven los ambientes, las etapas y la entrega.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [Contrato](../../contrato/README.md "Contrato de la API · v0.37.0") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md "ADR-045 · El ambiente alojado al final se llama pre-prod, y prod vive en otro repositorio") · [ADR-046](ADR-046-pre-prod-se-construye-desde-su-rama.md "ADR-046 · pre-prod se construye desde su rama, como dev, y es la última etapa de la tubería") · [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-049](ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md "ADR-049 · Sin DOCS_CLAVE, Swagger toma PREPROD_GERENCIA_CLAVE") · [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md "ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR") · [ADR-052](ADR-052-la-entrega-del-release-a-prod.md "ADR-052 · La entrega del release a prod va a un repositorio espejo del taller, la dispara una persona y no recompila nada") · [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md "ADR-054 · La entrega va una vez al monorepo de producto, y cada emprendimiento la adopta desde su copia") · [ADR-055](ADR-055-uat-se-despliega-desde-el-monorepo.md "ADR-055 · uat se despliega desde main del monorepo de producto, y lo aprobado es solo la etiqueta") · [ADR-056](ADR-056-qa-se-aloja-desde-su-rama.md "ADR-056 · qa también se aloja en Railway, construido desde la rama qa")
<!-- /generado:referenciado-desde -->
