# ADR-004 · Base de datos de solo escritura

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-004-base-solo-escritura.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-13 | 2026-09-16 | [Base de datos](../INDICE.md#etiqueta-base-de-datos) |

## Contexto

Requisito explícito del negocio: **bajo ningún criterio se debe eliminar información.** Hay dos
razones de fondo. Primera, un registro borrado por error es irrecuperable y en un sistema
financiero eso puede significar no poder explicar una diferencia. Segunda, el historial de
errores y correcciones es en sí mismo información valiosa: permite entender qué salió mal.

## Decisión

**No existe el borrado.** Se implementa en tres niveles:

1. **Revocación en el motor.** `REVOKE DELETE, TRUNCATE` sobre el rol de la aplicación.
   PostgreSQL rechaza el borrado aunque alguien lo intente desde fuera del sistema.
2. **Anulación lógica con trazabilidad.** Cada tabla lleva `anulado_en`, `anulado_por`,
   `anulado_motivo`, `anulado_dispositivo` y `anulado_ip`. Una restricción `CHECK` hace imposible
   anular sin motivo escrito.
3. **Corrección por contra-asiento.** Un movimiento errado no se edita: se crea uno nuevo que lo
   reversa, con `corrige_a_id` apuntando al original.

## Justificación

La diferencia entre revocar el permiso y confiar en que el código no borre es la diferencia
entre una garantía y una intención. El código cambia, se olvida, se escribe mal. El permiso
revocado no.

Exigir motivo escrito tiene un efecto adicional al de trazabilidad: obliga a pensar antes de
anular.

## Consecuencias

- **Positivas:** imposible perder información; historial completo auditable; las correcciones
  cuentan la verdad de lo que pasó.
- **Negativas:** la base crece de forma monótona y todas las consultas deben filtrar por
  `anulado_en IS NULL`. Se resuelve con vistas limpias por defecto e índices parciales. Para el
  volumen de este negocio, el crecimiento es irrelevante.
- **Tensión conocida:** entra en conflicto con el derecho de supresión de datos personales. Se
  resuelve con anonimización en lugar de borrado. Ver
  [`../11-riesgos-y-proteccion-de-datos.md`](../11-riesgos-y-proteccion-de-datos.md) [§3.4](../11-riesgos-y-proteccion-de-datos.md#34-la-tensión-entre-no-borrar-nunca-y-el-derecho-de-supresión).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [10](../10-ux-y-mockups.md "10 · Diseño de experiencia y mockups") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [13](../13-respaldo-y-exportacion.md "13 · Respaldo y exportación") · [16](../16-base-de-datos-y-snapshots.md "16 · Base de datos: snapshots y datos de prueba") · [17](../17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [21](../21-trabajo-en-paralelo.md "21 · Trabajo en paralelo") · [ADR-013](ADR-013-cuatro-ambientes.md "ADR-013 · Cuatro ambientes y promoción de migraciones") · [ADR-014](ADR-014-semver.md "ADR-014 · SemVer independiente por proyecto y contrato de compatibilidad") · [ADR-015](ADR-015-validacion-tres-capas.md "ADR-015 · Validación en tres capas, con la base como juez") · [ADR-020](ADR-020-idempotencia.md "ADR-020 · Idempotencia obligatoria en toda escritura") · [ADR-047](ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
