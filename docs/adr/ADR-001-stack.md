# ADR-001 · Stack tecnológico

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-001-stack.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-011](ADR-011-stack-flutter-dart.md) | 2026-09-13 | 2026-10-30 | [Arquitectura](../INDICE.md#etiqueta-arquitectura) |

> **Lo reemplaza [ADR-011](ADR-011-stack-flutter-dart.md):** el front pasa a Flutter Web y se
> agrega `emprende_api` en Dart, porque el navegador no debe hablar directo con la base ni cargar
> sus credenciales. El cuerpo de abajo se conserva tal como se escribió.

## Contexto

Se necesita un sistema administrativo y financiero para un emprendimiento de una persona, con
uso principal desde el celular en el taller. Los criterios pedidos fueron explícitos: **ligero,
fácil de usar, poco tiempo de desarrollo y seguro.** El presupuesto de operación es cero.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **React + Vite + Supabase** | Ecosistema enorme, TypeScript, sin backend propio, RLS | Curva de React |
| Svelte + Supabase | ~40% menos código, app más liviana | Menos gente sabe mantenerlo |
| Python + Streamlit | El más rápido de construir | Experiencia pobre en celular, interfaz rígida |
| Google Sheets + AppSheet | Sin programar, 2-3 semanas | Límites de cálculo, lentitud, dependencia de Google |

## Decisión

**React + Vite + TypeScript + Tailwind + Supabase, desplegado en Vercel.**

## Justificación

**Ligero.** Vite produce una app que carga en menos de 2 segundos con datos móviles, sin
servidor propio ni base de datos que administrar.

**Rápido de construir.** Lo más lento y riesgoso de cualquier sistema es el backend: usuarios,
contraseñas, permisos, archivos, respaldos. Supabase lo entrega hecho. Reduce el proyecto de
unas 20 semanas a 14.

**Seguro.** Los permisos viven dentro de PostgreSQL (RLS), no en código de aplicación. Ver
[ADR-006](ADR-006-rls-por-rol.md).

**Mantenible.** React es el ecosistema con más soporte del mundo. Para un sistema del que
dependerá un negocio durante años, la disponibilidad de quien pueda retomarlo pesa más que
ahorrar unas semanas de desarrollo. Ese fue el factor que descartó Svelte pese a ser más liviano.

## Consecuencias

- **Positivas:** costo mensual $0; sin infraestructura que mantener; tipado fuerte en los
  cálculos de plata; instalable en el celular.
- **Negativas:** dependencia de dos proveedores externos. Mitigada por la arquitectura
  hexagonal ([ADR-002](ADR-002-arquitectura-hexagonal.md)): cambiar de proveedor toca
  adaptadores, no reglas de negocio.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-010](ADR-010-almacenamiento-contrasenas.md "ADR-010 · Almacenamiento de contraseñas: hashing delegado con salt por usuario") · [ADR-011](ADR-011-stack-flutter-dart.md "ADR-011 · Stack: Flutter y Dart con API propia") · [ADR-013](ADR-013-cuatro-ambientes.md "ADR-013 · Cuatro ambientes y promoción de migraciones") · [ADR-017](ADR-017-api-en-java.md "ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API")
<!-- /generado:referenciado-desde -->
