# ADR-078 · Los archivos de IA solo cambian con autorización de quien dirige, y van en X.Y

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-078-los-archivos-de-ia-solo-cambian-con-autorizacion.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-11-02 | 2026-11-02 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

En Emprende-API#211 una sesión editó `CLAUDE.md` y `AGENTS.md` porque el plan aprobado decía
«documentos al día», sin que quien dirige hubiera visto ese texto. Además, esos archivos subían de
versión con el x.y.z del [ADR-027](ADR-027-documentacion-versionada.md) en cada PR que los tocaba. Quien dirige fijó el 2026-11-02
que son de solo lectura salvo con su autorización, y que no llevan la versión del proyecto.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Seguir como en el [ADR-027](ADR-027-documentacion-versionada.md) | No cambia nada | Una sesión los reescribe con cualquier plan aprobado, y la versión sube sin que nadie la decida |
| Quitarles la versión | Nada que mantener | No dice qué versión del archivo de reglas siguió una sesión |
| **X.Y, y solo con autorización** | Cada cambio tiene dueño, y la versión dice cuántos hubo | Cada ajuste espera a quien dirige |

## Decisión

1. **Los archivos de IA son `CLAUDE.md`, `AGENTS.md` y todo `.claude/`**: las reglas, las skills y
   los agentes, en los cuatro repositorios y el monorepo de producto.
2. **Solo cambian con autorización previa de quien dirige**, que ve antes el texto que entra o
   sale. Un plan aprobado no la da si no nombra ese texto, y ninguna autorización amplia para
   ajustar documentación los alcanza.
3. **Su versión es X.Y.** X cuenta las versiones promovidas a uat, e Y sube con cada cambio
   autorizado. Las skills y los agentes, que no tienen encabezado, no llevan versión.
4. **No llevan la versión del proyecto ni su resumen**: eso vive solo en el `CHANGELOG.md`.

## Justificación

Estos archivos dicen cómo trabaja cada sesión. Si una sesión los cambia por su cuenta, cambia las
reglas con las que la siguiente juzgará su trabajo. Que los decida una persona mantiene las reglas
en manos de quien responde por ellas.

## Consecuencias

- **Positivas:** ninguna regla cambia por un plan leído de más, y la versión solo sube cuando hay
  una decisión detrás.
- **Negativas:** cuando un cambio deja viejo un archivo de IA, la sesión lista las líneas y espera
  la autorización, en vez de corregirlas.
- **`verificar` acepta X.Y en esos encabezados** y no les exige subir la versión.

## Referencias

- [ADR-027](ADR-027-documentacion-versionada.md), que sigue rigiendo los demás `.md`: este lo reemplaza solo para los archivos de IA.
- [ADR-072](ADR-072-las-reglas-con-alcance-y-lo-compartido.md), que reparte las copias de lo compartido.
- HT [Juanchope039/Emprende-MiniApp-MonoRepo#75](https://github.com/Juanchope039/Emprende-MiniApp-MonoRepo/issues/75).

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-027](ADR-027-documentacion-versionada.md "ADR-027 · La documentación se versiona, se fecha y se enlaza, y la integración continua lo verifica") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
