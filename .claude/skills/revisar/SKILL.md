---
name: revisar
description: Revisa lo que cambió en la rama contra las reglas de Emprende antes de pedir el PR: lanza los agentes que tocan ese diff, junta lo que encuentran y lo ordena por gravedad. Úsala cuando el árbol ya está en verde y antes de abrir el PR.
argument-hint: "[rama base, por omisión develop o main]"
model: sonnet
---

# Revisar antes del PR

Es el paso que falta entre «compila» y «abrir el PR». Las puertas dicen que nada se rompió; esto
dice si lo que entró se parece a lo que el proyecto decidió.

## 1. Qué cambió

```bash
git diff --name-only $(git merge-base origin/<base> HEAD)
```

La base es `develop` en los repositorios de código y `main` en la especificación.

## 2. A quién se le pregunta

Según las rutas que toque el diff, y **solo esos**: un agente que no tiene nada que juzgar devuelve
ruido. Los agentes están en `.claude/agents/` del repositorio.

| Si el diff toca | Agente |
|---|---|
| `src/main/java/**` | `arquitecto-api` |
| `lib/**` | `arquitecto-front` |
| `supabase/migrations/**`, `scripts/db/**` | `arquitecto-base` |
| cualquier cosa | `revisor-de-proceso` |
| `**/*.md` | `documentalista` |

## 3. Qué se hace con lo que encuentran

- **Se ordena por gravedad**, y lo primero es siempre lo que rompe una regla escrita, con el ADR o
  el documento que la dice.
- **Un hallazgo sin su ruta y su línea no sirve**: se da el `archivo:línea`.
- **No se arregla todo lo que aparezca.** Lo que rompe una regla se arregla; lo que es una opinión se
  dice y se deja decidir. Un revisor que arregla deja de informar y empieza a decidir.
- **Lo que no cubre ningún documento** se anota en `TODO.md` §10, que es la lista que revisa quien
  dirige, y no se inventa la regla.
