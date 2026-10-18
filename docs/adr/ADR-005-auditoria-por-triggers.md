# ADR-005 · Auditoría por triggers, no por la aplicación

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-005-auditoria-por-triggers.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-13 | 2026-09-16 | [Base de datos](../INDICE.md#etiqueta-base-de-datos) · [Seguridad](../INDICE.md#etiqueta-seguridad) |

## Contexto

Se requiere saber quién, cuándo y desde dónde cambió cada dato. La forma habitual es que la
aplicación escriba el registro de auditoría junto con cada operación.

El problema de esa forma: **se puede olvidar.** Un caso de uso nuevo que no llame a la función
de auditoría deja un vacío que nadie nota hasta que se necesita el dato y no está.

## Decisión

La bitácora la escriben **triggers de PostgreSQL**, no el código de la aplicación. Un trigger
`AFTER INSERT OR UPDATE` sobre cada tabla de negocio inserta en `auditoria` el usuario, el rol,
la fecha, el dispositivo, la IP y los datos antes y después en formato JSON.

## Justificación

Es imposible saltársela. Cualquier escritura, venga de donde venga —de la aplicación, de una
consulta manual, de una importación— queda registrada. La auditoría deja de depender de la
disciplina de quien programa.

El trigger también distingue automáticamente la acción `ANULAR` de un `UPDATE` común, detectando
la transición de `anulado_en` de nulo a no nulo.

## Consecuencias

- **Positivas:** cobertura total garantizada; independiente del código de aplicación; los datos
  antes y después permiten reconstruir cualquier estado pasado.
- **Negativas:** la tabla de auditoría crece más rápido que las de negocio, y la lógica vive en
  SQL en vez de en TypeScript. Ambos costos son aceptables: el volumen es pequeño y la garantía
  de cobertura es lo que se está comprando.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [10](../10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [17](../17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [ADR-012](ADR-012-identidad-a-postgres.md "ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando") · [ADR-047](ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
