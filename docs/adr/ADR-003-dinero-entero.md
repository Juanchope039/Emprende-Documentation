# ADR-003 · Dinero como entero de pesos

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-003-dinero-entero.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-13 | 2026-09-16 | [Finanzas](../INDICE.md#etiqueta-finanzas) · [API](../INDICE.md#etiqueta-api) · [Base de datos](../INDICE.md#etiqueta-base-de-datos) |

## Contexto

Los números de punto flotante no representan decimales de forma exacta: `0.1 + 0.2` no da `0.3`.
En un sistema financiero, ese error se acumula de forma invisible hasta que un reporte no cuadra
por unos pesos y nadie sabe por qué.

El peso colombiano, en la práctica del negocio, no usa centavos.

## Decisión

Todo valor monetario se almacena y se opera como **entero de pesos**:

- En la base de datos: `BIGINT`. Nunca `NUMERIC`, nunca `FLOAT`.
- En el código: un objeto de valor `Dinero` que rechaza cualquier valor no entero.
- Los porcentajes se aplican con redondeo explícito a peso entero.

## Justificación

El problema deja de existir en lugar de gestionarse. Y el objeto de valor hace imposible pasar
un número suelto por descuido: el sistema de tipos lo impide.

## Consecuencias

- **Positivas:** cero errores de redondeo acumulado; los reportes siempre cuadran.
- **Negativas:** hay que ser explícito al calcular porcentajes. Es deseable: obliga a decidir
  conscientemente cómo se redondea, en lugar de que lo decida el azar del punto flotante.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [ADR-015](ADR-015-validacion-tres-capas.md "ADR-015 · Validación en tres capas, con la base como juez") · [ADR-039](ADR-039-cada-regla-en-un-solo-sitio.md "ADR-039 · Cada regla vive en un solo sitio: CLAUDE.md, AGENTS.md o una skill") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
