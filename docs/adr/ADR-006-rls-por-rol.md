# ADR-006 · Permisos con Row Level Security

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-006-rls-por-rol.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-13 | 2026-09-16 | [Seguridad](../INDICE.md#etiqueta-seguridad) · [Base de datos](../INDICE.md#etiqueta-base-de-datos) |

## Contexto

El sistema maneja dos roles con acceso muy distinto. El rol Operación —la empleada— no debe ver
la utilidad del negocio, los retiros, el patrimonio, los márgenes de los productos ni la nómina
de nadie más que la suya.

La forma habitual de implementar esto es ocultar menús y botones en la interfaz.

## Decisión

Los permisos se aplican con **Row Level Security dentro de PostgreSQL**. La interfaz también
oculta lo que no corresponde, pero eso es comodidad visual, no seguridad.

## Justificación

**Ocultar un botón no es seguridad.** Si el dato viaja al navegador, basta abrir las
herramientas de desarrollo para verlo. Y si la restricción vive en un `if` del código, basta
construir la petición a mano para saltárselo.

Con RLS, PostgreSQL **no devuelve esas filas** a una sesión con rol Operación, sin importar
cómo se construya la consulta ni desde dónde venga.

Esto importa especialmente porque no se trata de un atacante externo hipotético: se trata de la
confianza dentro de un negocio pequeño donde todos se conocen. Que el sistema garantice la
separación protege esa relación.

## Consecuencias

- **Positivas:** garantía real e independiente del código de interfaz; un error en una pantalla
  no puede exponer datos sensibles; las políticas son revisables en un solo lugar.
- **Negativas:** depurar un problema de permisos es menos evidente que leer un `if`, y hay que
  probar con sesiones reales de cada rol. Por eso las pruebas de permisos con sesión de rol
  Operación son obligatorias en cada tarea sensible.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [01](../01-vision-y-alcance.md "01 · Visión y alcance") · [02](../02-casos-de-uso.md "02 · Casos de uso") · [04](../04-modelo-de-datos.md "04 · Modelo de datos") · [07](../07-arquitectura.md "07 · Arquitectura técnica") · [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [20](../20-contrato-de-api.md "20 · Contrato de la API") · [23](../23-diagramas-de-casos-de-uso.md "23 · Diagramas de los casos de uso") · [Contrato](../../contrato/README.md "Contrato de la API · v0.35.0") · [ADR-001](ADR-001-stack.md "ADR-001 · Stack tecnológico") · [ADR-011](ADR-011-stack-flutter-dart.md "ADR-011 · Stack: Flutter y Dart con API propia") · [ADR-012](ADR-012-identidad-a-postgres.md "ADR-012 · La API propaga la identidad a PostgreSQL para que RLS siga juzgando") · [ADR-015](ADR-015-validacion-tres-capas.md "ADR-015 · Validación en tres capas, con la base como juez") · [ADR-018](ADR-018-front-sin-decisiones.md "ADR-018 · Tres partes, y el front no toma decisiones") · [ADR-021](ADR-021-canal-firmado.md "ADR-021 · Canal firmado contra repetición y manipulación") · [ADR-022](ADR-022-openapi-generado.md "ADR-022 · OpenAPI generado del código y verificado en integración continua") · [ADR-029](ADR-029-esquema-por-etiqueta.md "ADR-029 · El esquema llega a la API por etiqueta, y la integración continua lo levanta con Supabase") · [ADR-033](ADR-033-service-role-solo-en-auth.md "ADR-033 · La clave de servicio entra, pero solo para crear identidades") · [ADR-038](ADR-038-la-pila-local-se-orquesta-desde-prisma-db.md "ADR-038 · La pila local se orquesta desde prisma_db, y cada receta se apunta desde su .env") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
