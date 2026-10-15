# AGENTS.md

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [2.3.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/AGENTS.md "Historial de cambios") | [✅ Vigente](docs/22-documentacion.md#estados) | 2026-09-21 | 2026-10-15 | [Proceso](docs/INDICE.md#etiqueta-proceso) |

Guía para los agentes de código que trabajan en la especificación de PRISMA. **Las reglas están en
[`CLAUDE.md`](CLAUDE.md)**, tanto las del proceso como las de la arquitectura y las de este
repositorio: léelas antes de tocar nada. Aquí se explica cómo se hace cada cosa, y el paso a paso de
lo que se repite está en las skills del [§3](#3-los-procedimientos).

---

## 1. Qué hay aquí

| Carpeta o archivo | Qué es |
|---|---|
| `docs/` | Los documentos numerados. [`docs/INDICE.md`](docs/INDICE.md) los ordena por perfil y por pregunta |
| `docs/adr/` | Las decisiones de arquitectura, con su índice en `docs/adr/README.md` |
| `contrato/` | `openapi.json`, el contrato acordado entre el front y la API, con el catálogo de códigos adentro |
| `mockup/` | El prototipo navegable. Nada se construye sin su pantalla aprobada |
| [`TODO.md`](TODO.md) | El tablero: en qué va cada tarea y qué decisiones tiene que revisar quien dirige |
| `scripts/docs/` | La herramienta que pone y verifica encabezados, enlaces y bloques generados |
| `.claude/skills/` | Los procedimientos paso a paso del [§3](#3-los-procedimientos). Son Markdown: cualquier agente los puede leer |
| `scripts/github/` | La herramienta que pone en GitHub las protecciones de las ramas principales ([ADR-048](docs/adr/ADR-048-las-ramas-principales-las-protege-github.md)) |

Los repositorios de código están al lado, en `../backend-api`, `../backend-db` y
`../frontend-flutter`. Cuando están en disco, la herramienta también revisa sus `.md`.

---

## 2. La herramienta

```bash
node scripts/docs/documentar.mjs enlazar                        # pone anclas, enlaces y bloques generados
node scripts/docs/documentar.mjs enlazar --en-seco              # muestra lo que cambiaría, sin escribir
node scripts/docs/documentar.mjs verificar                      # falla si algo quedó roto o sin enlazar
node scripts/docs/documentar.mjs verificar --base origin/main   # además: versiones subidas
```

- Se corre desde cualquier carpeta. Cuándo y en qué orden, lo dice la skill `documentar`.
- `verificar --base` es lo que corre la integración continua en cada PR.
- Qué hacer con cada mensaje de error está en `scripts/docs/README.md`.

**Y las políticas de rama**, que se ponen desde aquí para los cuatro repositorios:

```bash
node scripts/github/politicas-de-ramas.mjs verificar   # compara las protecciones con la definición
node scripts/github/politicas-de-ramas.mjs aplicar     # las pone; necesita un token que administre
```

- Qué pone cada conjunto, qué token hace falta y cómo se hace a mano: `scripts/github/README.md`.
- Se puede aplicar en los cuatro: la cuenta pasó a GitHub Pro el 2026-10-14, que es lo que pedían
  los privados para tener reglas de rama. Lo que falta es aplicarlas, y `verificar` dice cuánto. La
  regla y el porqué están en el [`CLAUDE.md`](CLAUDE.md) y en [ADR-048](docs/adr/ADR-048-las-ramas-principales-las-protege-github.md).

---

## 3. Los procedimientos

Cada uno es una skill, en `.claude/skills/<nombre>/SKILL.md`:

| Skill | Para qué |
|---|---|
| `tarea` | Empezar una tarea del 08: la base al día, la rama y el plan |
| `plan` | Escribir el plan de trabajo, antes de tocar código |
| `documentar` | Cambiar un `.md`: la versión, la fecha, los enlaces y la herramienta |
| `contrato` | Cambiar `contrato/openapi.json` byte a byte, y lo que sigue en la API |
| `commit` | Hacer el commit con el formato del proyecto, y empujar |
| `sin-conflictos` | Traer la base a la rama y resolver cada clase de choque, dentro del PR |
| `pr` | Abrir el PR, cuando quien dirige lo autoriza, asociado a su issue de PRISMA |
| `limpiar` | Dejar las cuatro copias en su base, al día y con el árbol limpio, sin perder nada |
| `etiqueta` | Revisar las etiquetas de git contra su esquema y contar qué entró entre dos |
| `release` | Preparar el release de lo que llega a `main` o de una entrega, y revisar lo que salió |

---

## 4. Cómo se escribe un ADR

- **Número:** el siguiente al mayor de `docs/adr/`. Un número que ya se asignó no se vuelve a usar.
- **Nombre:** `ADR-NNN-titulo-corto.md`, con el título `# ADR-NNN · La decisión en una frase`.
- **Secciones:**
  - Contexto;
  - Alternativas consideradas, en una tabla con lo que va a favor y en contra;
  - Decisión;
  - Justificación;
  - Consecuencias: positivas, negativas y a vigilar;
  - Referencias.
- **Estado:** 📝 Propuesto en 0.y.z y ✅ Aceptado desde 1.0.0. Cuando otro lo reemplaza, queda
  ⛔ Reemplazado, con el número del que lo reemplaza.
- **Índices:** va a mano en dos, la tabla de `docs/adr/README.md` y la de [`docs/INDICE.md`](docs/INDICE.md) [§4](docs/INDICE.md#4-las-decisiones-de-arquitectura-adrs).
  En este último se describe en palabras de alguien que no es técnico.

---

## 5. El tablero

- **Una tarea nueva se escribe en el 08**, con su carril y lo que la bloquea. Después el tablero la
  lista en su sprint.
- **Al terminar una tarea** se marca `[x]` en [`TODO.md`](TODO.md) y se corre `enlazar`, que rehace las marcas
  ⚡ y 🔒, lo que puede empezar hoy y cuánto falta. Va en el PR de la tarea.

---

## 6. Las puertas del PR

- **`verificar --base origin/main` en verde, con `main` ya traído a la rama.** Sin él adentro, salen
  falsos positivos cuando `main` ya subió un documento.
- **Si es una tarea, va marcada `[x]` en el tablero**, como dice el [§5](#5-el-tablero).
- **Si al traer `main` chocan [`TODO.md`](TODO.md) o [`docs/INDICE.md`](docs/INDICE.md)**, la receta cierra la skill
  `documentar`. Cualquier otra clase de choque, la skill `sin-conflictos`.
