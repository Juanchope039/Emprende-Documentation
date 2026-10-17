# ADR-008 · Exportación con descarga manual

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-008-exportacion.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-13 | 2026-09-16 | [Base de datos](../INDICE.md#etiqueta-base-de-datos) · [Datos personales](../INDICE.md#etiqueta-datos-personales) |

## Contexto

Se requiere poder exportar la base de datos como respaldo, total o por mes. La pregunta de
diseño es cómo llega ese archivo a manos del negocio.

## Decisión

- **Generación:** automática según programación, o manual a demanda.
- **Descarga:** **siempre manual.** El archivo queda disponible en el sistema y se baja con una
  acción explícita de Gerencia.
- **Sin envío automático** por correo ni a servicios externos.
- Cada archivo incluye un **manifiesto de integridad** con hashes SHA-256, conteo de registros
  y totales de control.

## Justificación

Un respaldo contiene todo: datos de clientes, salarios, márgenes, utilidades. Enviarlo
automáticamente a un correo lo deposita en un servidor de terceros sin que nadie haya decidido
hacerlo en ese momento.

Que exista una acción explícita significa que alguien decidió, en un momento concreto, sacar esa
información del sistema. Y eso queda registrado en `exportaciones` con quién y cuándo.

Los **totales de control** del manifiesto son la verificación más práctica: comparar tres
números —utilidad causada, caja libre, suma de movimientos— basta para saber si un respaldo es
confiable, sin necesidad de abrirlo.

## Consecuencias

- **Positivas:** ningún dato sale del sistema sin decisión humana registrada; el manifiesto
  permite detectar un archivo corrupto o alterado; el formato CSV garantiza legibilidad a largo
  plazo.
- **Negativas:** si nadie descarga, no hay copia externa. Se mitiga con el respaldo diario
  automático del proveedor y con el recordatorio al cerrar cada mes.
- **Limitación reconocida:** el procedimiento de restauración queda diferido a una fase
  posterior. Un respaldo que nunca se ha restaurado es una suposición, no una garantía. Está
  documentado como tal en [`../13-respaldo-y-exportacion.md`](../13-respaldo-y-exportacion.md) [§9](../13-respaldo-y-exportacion.md#9-fuera-de-alcance-de-esta-versión).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [02](../02-casos-de-uso.md "02 · Casos de uso") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [ADR-047](ADR-047-el-respaldo-y-la-auditoria-entran-al-plan.md "ADR-047 · El respaldo con manifiesto y la auditoría completa entran al Sprint 8")
<!-- /generado:referenciado-desde -->
