# ADR-077 · La versión es -SNAPSHOT hasta que la entrega crea su release/X.Y.Z

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-077-snapshot-hasta-la-release.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-30 | 2026-10-30 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

La versión de `prisma_api` y `prisma_front` no distinguía lo que está en curso de lo entregado: la
`2.13.2` de `develop` y la `2.8.0` de `main` se escribían igual, y la etiqueta `v<versión>` nacía al
fusionar a `develop` ([ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md)), antes de que la versión llegara a `qa` o a `main`. El release salía en
el empuje a `main`, y la entrega a prod no dejaba rastro en los repositorios de código.

El 2026-10-30 quien dirige definió el flujo en la política de versionamiento de Emprende
(`DocumentationMacroApp/core/05-versionamiento.md`, apartado 1.1, HT
[Emprende-App/Emprende#251](https://github.com/Emprende-App/Emprende/issues/251)): `develop` lleva `X.Y.Z-SNAPSHOT`, se promueve a `qa` y a `main` sin
cambiar el número, y al generar la entrega se crea `release/X.Y.Z` con `X.Y.Z-RELEASE` y la fecha.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Seguir sin sufijo y etiquetar en `develop` | No cambia nada | La versión no dice si se entregó, y la etiqueta existe antes de la aprobación en uat |
| Etiquetar en el empuje a `main` | Una etiqueta por versión aprobada | Sigue sin rastro de qué se entregó, y la versión de `main` no cambia al entregarla |
| **`-SNAPSHOT` hasta la entrega, que crea `release/X.Y.Z`** | El sufijo dice el estado, y la rama guarda lo entregado | La versión cambia de texto al entregar, y la imagen conserva el de qa |

## Decisión

1. **La versión lleva `-SNAPSHOT` en `develop`, `qa` y `main`**: `2.13.3-SNAPSHOT` en la API y
   `2.4.2-SNAPSHOT+62` en el front, con el sufijo delante del `+BUILD`. En `prisma_db` el sufijo va
   en el archivo `VERSION`, que dice la versión del esquema en curso; `schema_version` no lo lleva,
   porque es el número que la API compara y una migración aplicada no cambia.
2. **[C-05](../12-pruebas-y-calidad.md#c-05) exige el sufijo y cuenta los pasos solo con `X.Y.Z`** (y el `+BUILD`). SemVer
   ordena los sufijos por el alfabeto y pondría `-RELEASE` antes de `-SNAPSHOT`. En el PR a `qa` y a
   `main` corre contra el mismo `HEAD`, y lo único que juzga es el sufijo.
3. **La entrega a prod crea `release/X.Y.Z` en cada repositorio.** `entregar-release.yml` dispara
   `crear-release.yml` en los tres con el commit de `main` que entregó. Encima de él va un solo
   commit que pasa la versión a `-RELEASE` y escribe la entrada del `CHANGELOG.md` como
   `## [X.Y.Z-RELEASE] - AAAA-MM-DD`, con la fecha en hora de Bogotá.
4. **La etiqueta `vX.Y.Z` sale en `release/X.Y.Z`**, sobre ese commit, y ya no al fusionar a
   `develop`. Entre dos releases `develop` sube varios pasos: una etiqueta entregada solo tiene que
   subir, y su `Paso:` es el mayor número que cambió. **`esquema-vX.Y.Z` sigue naciendo en
   `develop`**: es la identidad del esquema que la tubería de la API trae ([ADR-029](ADR-029-esquema-por-etiqueta.md)).
5. **El release se titula `X.Y.Z-RELEASE · AAAA-MM-DD`** y lo publica `crear-release.yml`, con las
   notas del `CHANGELOG.md` y, en la API y el front, la imagen que compiló qa con su digest. La
   imagen no se recompila: conserva el número `-SNAPSHOT` con que la compiló qa. El de la entrega
   del monorepo se titula `PRISMA N · AAAA-MM-DD`.
6. **`develop` arranca la siguiente `-SNAPSHOT` por PR**: el primer PR que cambia lo publicado la
   sube, y [C-05](../12-pruebas-y-calidad.md#c-05) lo exige. Ningún flujo empuja a `develop`, `qa` ni `main`.
7. **`release/X.Y.Z` no se borra ni se reescribe**, y `crear-release.yml` no rehace lo que ya
   existe: se puede volver a correr.

## Justificación

El sufijo dice el estado sin mirar en qué rama está la versión, y la rama `release/X.Y.Z` es lo
entregado, punto de partida de su hotfix. Etiquetar al entregar deja una etiqueta por versión que
alguien recibió, en vez de una por PR. La etiqueta del esquema no se mueve porque su contrato es
otro: dice qué migraciones existen, y eso no espera a la entrega.

## Consecuencias

- **Positivas:** la versión dice si está en curso o entregada, y cada entrega deja su rama, su
  etiqueta y su release en los tres repositorios.
- **Negativas:** la entrega necesita el secreto `PRISMA_RELEASE_TOKEN`, con «Actions: Read and
  write» en los tres repositorios. La imagen y «Acerca de» muestran la versión con `-SNAPSHOT`,
  porque no se recompilan al entregar.
- **A vigilar:** que ninguna herramienta compare versiones con el sufijo, y que el primer PR
  después de una entrega suba la versión.

## Referencias

- [ADR-034](ADR-034-la-version-sube-en-cada-pr.md), que pide subir un paso en cada PR; [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md), con el esquema de las etiquetas, que este ADR cambia en dónde nacen; [ADR-029](ADR-029-esquema-por-etiqueta.md), con el esquema por etiqueta; el [19 §4.4](../19-ambientes-y-entrega.md#44-etiquetas-y-releases), con el detalle.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-059](ADR-059-etiquetas-con-esquema-y-release-en-main.md "ADR-059 · Toda etiqueta sigue un esquema que se verifica, y el release se publica al llegar a main") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
