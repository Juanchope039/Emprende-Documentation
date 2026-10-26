---
name: donde-estoy
description: Dice en qué repositorio de Emprende corre la sesión y cómo llegar a los otros tres, porque las rutas no son las mismas en una carpeta de trabajo completa que en una sesión que tiene un solo repositorio. Úsala cuando una ruta de otra skill no exista.
model: haiku
---

# Dónde estoy, y cómo llego a los otros

Las rutas que escriben las demás skills suponen la **carpeta de trabajo**, la que tiene los cuatro
repositorios como hermanos ([ADR-035](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/ADR-035-repositorios-hermanos.md)). Eso no siempre es cierto: una sesión en la nube suele tener uno
solo, y a veces en una carpeta con otro nombre. Si una ruta no existe, el problema es esto.

## 1. En qué repositorio estoy

Se decide por lo que hay en la raíz, no por el nombre de la carpeta:

| Si existe | Es |
|---|---|
| `settings.gradle.kts` con `prisma_api` | la API |
| `supabase/config.toml` | la base |
| `pubspec.yaml` con `prisma_front` | el front |
| `docs/INDICE.md` | la especificación |

```bash
ls settings.gradle.kts supabase/config.toml pubspec.yaml docs/INDICE.md 2>/dev/null
```

## 2. Cómo llego a los otros tres

En este orden, y el primero que exista gana:

1. **Hermanos**, como dice el `AGENTS.md` de cada uno: `../backend-api`, `../backend-db`,
   `../frontend-flutter`, `../documentation`.
2. **Una carpeta de trabajo con `repositories/`**, que es como la nombran varias skills:
   `repositories/<repo>`.
3. **Por el nombre del repositorio en GitHub**, que es lo que usa una sesión en la nube:
   `../Emprende-API`, `../Emprende-DataBase`, `../Emprende-Front`, `../Emprende-Documentation`.

```bash
for c in ../backend-api ../Emprende-API repositories/backend-api; do [ -d "$c/.git" ] && echo "$c"; done
```

## 3. Si no está en disco

**No se clona por cuenta propia.** Lo que se hace es:

- **Leer lo que haga falta de GitHub**, que para la especificación es público y no necesita token.
- **Decirlo**, si lo que se pidió necesita ese repositorio: una tarea de dos repositorios no se
  termina a medias en silencio.
- Las reglas del proyecto no hacen falta buscarlas allá: cada repositorio tiene su copia en
  `.claude/rules/proceso.md`, que se reparte y se verifica ([ADR-072](https://github.com/Juanchope039/Emprende-Documentation/blob/main/docs/adr/ADR-072-las-reglas-con-alcance-y-lo-compartido.md)).
