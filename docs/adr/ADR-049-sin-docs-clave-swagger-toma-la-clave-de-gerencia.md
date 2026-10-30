# ADR-049 · Sin `DOCS_CLAVE`, Swagger toma `PREPROD_GERENCIA_CLAVE`

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-049-sin-docs-clave-swagger-toma-la-clave-de-gerencia.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-05 | 2026-10-30 | [Entrega](../INDICE.md#etiqueta-entrega) · [Seguridad](../INDICE.md#etiqueta-seguridad) |

> **Lo modifica [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md):** la variable se llama `UAT_GERENCIA_CLAVE`, no `PREPROD_GERENCIA_CLAVE`,
> porque el ambiente donde Gerencia aprueba es uat. La regla no cambia: sin `DOCS_CLAVE`, Swagger
> toma la clave inicial de la primera Gerencia del ambiente. El cuerpo de abajo se conserva tal como
> se escribió.

## Contexto

En pre-prod y en prod Swagger va detrás de autenticación ([07 §9.4](../07-arquitectura.md#94-swagger-generado-del-código), [20 §7.2](../20-contrato-de-api.md#72-dónde-se-publica-en-cada-ambiente)). La credencial son dos
variables, `DOCS_USUARIO` y `DOCS_CLAVE`, y el [19 §3.2](../19-ambientes-y-entrega.md#32-la-api-variables-de-entorno) las daba por **obligatorias**: si falta una,
las rutas del catálogo contestan como si no existieran.

Al alojar pre-prod, el 2026-10-05, quien dirige tuvo que llevar a mano una clave más por ambiente.
La base de pre-prod nace sin semilla, y la primera cuenta de Gerencia se crea con una clave inicial
que vive en el gestor de secretos con el nombre `PREPROD_GERENCIA_CLAVE`. Quien dirige pidió que,
**en ausencia de `DOCS_CLAVE`, la API tome esa clave por defecto**.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Sin `DOCS_CLAVE`, la API toma `PREPROD_GERENCIA_CLAVE`** (la decisión) | Un secreto menos que llevar a mano cuando se aloja un ambiente. Donde ya hay `DOCS_CLAVE`, no cambia nada | La clave de Swagger queda igual a la clave inicial de una persona. prod lee una variable con «PREPROD» en el nombre |
| **Dejar `DOCS_CLAVE` obligatoria y aparte**, como estaba | La credencial de Swagger y la de una persona no se tocan nunca | Es lo que se pidió cambiar |
| **Reusar `EMPRENDE_ADMIN_TEMPORAL_CLAVE` de la [9.16](../08-plan-de-desarrollo.md#tarea-9-16)** | Ya es una variable por ambiente | Esa credencial deja de servir en cuanto existe la primera Gerencia, y Swagger tiene que seguir abriendo después |
| **Darle también un valor por defecto a `DOCS_USUARIO`** | Ningún secreto que configurar para abrir Swagger | Nadie lo pidió, y un usuario por defecto sería una regla inventada |

## Decisión

1. **La clave de Swagger es `DOCS_CLAVE`, y si no está, `PREPROD_GERENCIA_CLAVE`.** El orden no se
   invierte: donde las dos existen, gana `DOCS_CLAVE`.
2. **`DOCS_USUARIO` sigue siendo obligatoria.** Sin usuario, Swagger sigue cerrado.
3. **Si no hay ninguna de las dos claves, nada cambia**: las rutas del catálogo siguen contestando
   como si no existieran. La puerta falla cerrada, como antes.
4. **`PREPROD_GERENCIA_CLAVE` es un secreto** y vive donde viven los demás: en el gestor de secretos
   del ambiente, y en `.env.ejemplo` solo su nombre.

## Justificación

**Es una salida, no un cambio de lo que ya funciona.** Cada ambiente que hoy configura `DOCS_CLAVE`
sigue igual, y uno que no la configure deja de quedar con Swagger cerrado sin remedio. El riesgo
nuevo —que la clave de Swagger sea la inicial de una persona— lo acota que esa clave sea temporal:
la aplicación obliga a cambiarla en el primer ingreso, y desde ahí deja de ser la de nadie.

## Consecuencias

**Positivas**

- Alojar un ambiente pide un secreto menos.
- Nada cambia donde `DOCS_CLAVE` ya está puesta.

**Negativas**

- **Swagger y la cuenta inicial de Gerencia comparten clave** mientras `DOCS_CLAVE` falte, y la
  clave de Swagger sigue siendo la inicial aunque la persona ya haya cambiado la suya.
- **prod lee una variable que se llama `PREPROD_…`.** El nombre lo eligió quien dirige; cambiarlo
  después es otro ADR.

**A vigilar**

- Si Swagger de prod llega a abrir con la clave inicial de una persona, se configura `DOCS_CLAVE` en
  ese ambiente y el valor por defecto deja de usarse.

## Referencias

- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md) [§3.2](../19-ambientes-y-entrega.md#32-la-api-variables-de-entorno) y [§3.3](../19-ambientes-y-entrega.md#33-dónde-viven-los-secretos), donde viven las variables y los secretos.
- [`07-arquitectura.md`](../07-arquitectura.md) [§9.4](../07-arquitectura.md#94-swagger-generado-del-código) y [`20-contrato-de-api.md`](../20-contrato-de-api.md) [§7.2](../20-contrato-de-api.md#72-dónde-se-publica-en-cada-ambiente), que cierran Swagger en pre-prod y prod.
- [ADR-045](ADR-045-pre-prod-y-prod-en-otro-repositorio.md), que puso Swagger detrás de autenticación en pre-prod.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado")
<!-- /generado:referenciado-desde -->
