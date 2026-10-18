# ADR-002 · Arquitectura hexagonal con regla de dependencias verificada

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-002-arquitectura-hexagonal.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-13 | 2026-09-16 | [Arquitectura](../INDICE.md#etiqueta-arquitectura) · [API](../INDICE.md#etiqueta-api) |

> **Esta decisión no se deroga: [ADR-017](ADR-017-api-en-java.md) la refuerza.** Con `prisma_api`
> ya hay un backend donde aplicarla de verdad. Solo cambian nombres del cuerpo de abajo: la capa
> `ui` se llama `interfaz` dentro de la API, y las capas van en paquetes Java —`dominio`,
> `aplicacion`, `infraestructura`, `interfaz`—. Lo demás queda igual, y el detalle está en
> [`07-arquitectura.md`](../07-arquitectura.md) [§3](../07-arquitectura.md#3-regla-de-dependencias).
>
> **Cómo se verifica la regla de dependencias, hoy:** con **ArchUnit** en la API y con
> `analysis_options.yaml` en el front. Una nota anterior de este ADR decía que la verificaba
> `analysis_options.yaml` de Dart, y eso dejó de ser cierto para la API cuando
> [ADR-017](ADR-017-api-en-java.md) la pasó a Java. La decisión —que la regla se verifica de
> forma automática y no por disciplina— no cambia; cambia la herramienta.

## Contexto

El activo más valioso del sistema no es la interfaz ni la base de datos: son **las reglas
financieras**. Reconstruirlas costaría semanas y un error en ellas produce decisiones
equivocadas sobre plata real.

Además, el sistema depende de proveedores externos que pueden cambiar de condiciones.

## Decisión

Arquitectura **hexagonal (puertos y adaptadores)** sobre Clean Architecture, con cuatro capas:
`domain`, `application`, `infrastructure`, `ui`. Las dependencias apuntan **siempre hacia
adentro**, y esa regla se verifica automáticamente en cada compilación mediante ESLint.

## Justificación

1. **Los cálculos se prueban sin base de datos, sin internet y en milisegundos.** Eso permite
   que cada fórmula tenga pruebas automáticas que corren en cada cambio.
2. **Cambiar de proveedor no toca las reglas.** Si Supabase deja de servir, se escribe un
   adaptador nuevo y el dominio queda intacto.
3. **La regla es una barrera, no una recomendación.** Si alguien importa Supabase dentro del
   dominio, la compilación falla.

## Consecuencias

- **Positivas:** el núcleo es independiente y verificable; los casos de uso son legibles uno a
  uno; las pruebas no necesitan infraestructura.
- **Negativas:** más archivos y más interfaces que en una estructura plana. Es un costo real de
  escritura que se paga con creces en confiabilidad de los cálculos y en libertad tecnológica.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [07](../07-arquitectura.md "07 · Arquitectura técnica") · [17](../17-resiliencia-offline-y-cache.md "17 · Resiliencia, trabajo sin conexión y caché") · [ADR-001](ADR-001-stack.md "ADR-001 · Stack tecnológico") · [ADR-011](ADR-011-stack-flutter-dart.md "ADR-011 · Stack: Flutter y Dart con API propia") · [ADR-012](ADR-012-identidad-a-postgres.md "ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando") · [ADR-017](ADR-017-api-en-java.md "ADR-017 · Stack: Flutter en el front, Java con Spring Boot en la API") · [ADR-018](ADR-018-front-sin-decisiones.md "ADR-018 · Tres partes, y el front no toma decisiones") · [ADR-021](ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [ADR-027](ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
