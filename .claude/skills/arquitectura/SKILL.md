---
name: arquitectura
description: Contesta de qué capa es una clase, un archivo o una idea de Emprende, qué puede conocer y qué no, y dónde está escrito. Úsala antes de crear un archivo nuevo o cuando no esté claro en qué repositorio o capa vive algo.
argument-hint: "[la clase, el archivo o la pregunta]"
model: sonnet
---

# De qué capa es esto

Una pregunta, no un procedimiento: dónde vive algo y qué le está permitido conocer. La respuesta
sale de las reglas de la arquitectura del `CLAUDE.md` del proyecto, y aquí está el camino corto.

## 1. En qué repositorio

```
prisma_front  ──HTTP──▶  prisma_api  ──SQL──▶  prisma_db
  pinta                   decide todo           impone lo que no se puede romper
```

- **Si decide algo** —una regla, un permiso, un mensaje, una cifra, qué opciones tiene el menú—, es
  de la API. El front no decide nada ([ADR-018](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/ADR-018-front-sin-decisiones.md)).
- **Si lo tiene que impedir aunque la API se equivoque**, es de la base: una restricción, una
  política RLS o un trigger ([ADR-006](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/ADR-006-rls-por-rol.md)).
- **Si es una pantalla**, es del front, y no se construye sin su pantalla aprobada en el mockup.

## 2. En qué capa de la API

Las flechas apuntan hacia adentro ([ADR-002](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/ADR-002-arquitectura-hexagonal.md)), y `ReglaDeDependenciasTest` lo impone:

| Capa | Qué vive ahí | Qué no puede conocer |
|---|---|---|
| `dominio` | Objetos de valor, entidades, reglas puras y los puertos | Spring, JDBC, Jackson y las otras tres capas |
| `aplicacion` | Un caso de uso por clase, con su `SolicitudDe…` | HTTP y la interfaz |
| `infraestructura` | `ConIdentidad`, los adaptadores `…EnPostgres`, `GoTrue` | La interfaz |
| `interfaz` | Controladores, filtros, el sobre y el catálogo | — |

- **Un caso de uso no comprueba permisos**: eso lo juzga PostgreSQL.
- **Nadie toma una `Connection` ni un `JdbcClient`**: la única puerta a la base es `ConIdentidad`.
- **El dinero es `Dinero`**, pesos enteros, y el tiempo va por `Duracion`.

## 3. Dónde está escrito

| Pregunta | Dónde |
|---|---|
| ¿Qué fórmula es? ¿Sube la utilidad, la caja o el patrimonio? | [`05-reglas-financieras.md`](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/05-reglas-financieras.md) |
| ¿Qué columna, qué restricción, qué política? | [`04-modelo-de-datos.md`](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/04-modelo-de-datos.md) |
| ¿Qué ruta, qué verbo, qué código? | [`20-contrato-de-api.md`](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/20-contrato-de-api.md) |
| ¿Cómo se comporta la pantalla? | [`10-ux-y-mockups.md`](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/10-ux-y-mockups.md) y el mockup |
| ¿Por qué se decidió así? | [`docs/adr/`](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/README.md) |

**Si ningún documento lo cubre**, no se inventa la regla: se decide lo mínimo, se escribe el porqué
en el commit y se anota en `TODO.md` §10.
