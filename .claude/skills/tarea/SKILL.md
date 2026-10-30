---
name: tarea
description: Prepara una tarea del plan de desarrollo de Emprende. Lee su fila del 08, comprueba que se pueda empezar, deja cada repositorio que toca en su base al día y con el árbol limpio, abre ahí la rama y deja escrito el plan. Se invoca a mano con el id de la tarea.
argument-hint: "[id de la tarea, p. ej. 3.4]"
model: opus
---

# Empezar la tarea $ARGUMENTS

**Las rutas de este archivo suponen la carpeta de trabajo**, la que tiene los cuatro
repositorios. Si una no existe en tu sesión, la skill `donde-estoy` dice cómo llegar.

Las rutas son relativas a la carpeta de trabajo, la que contiene `repositories/`. Las reglas que
aplica están en el `CLAUDE.md` de la especificación (§2).

## 1. Qué es y si se puede empezar

1. **Busca la tarea en `repositories/documentation/docs/08-plan-de-desarrollo.md`.** Su fila dice
   qué es, dónde vive, de qué depende y cuántos días lleva. El «Dónde» es API, Base, Front, Contrato o
   Decisión; si tiene varios, el primero es el que la lleva.
2. **Busca su línea en `repositories/documentation/TODO.md`:**
   - `[x]`: ya está hecha, así que para.
   - ⚡: se puede empezar hoy.
   - 🔒: le falta algo de lo que depende. Di qué es y para.
   - 🚧 o ✏️: alguien la tiene, o está escrita sin verificar. Pregunta antes de seguir.
3. **Mira si quedó un PR sin aceptar** en los repositorios que vas a tocar, y aplica la regla de la
   espera. Si no puedes saberlo, pregunta.
4. **Lee lo que la tarea nombra:**
   - el requisito, en el 03;
   - la regla, en el 05;
   - la tabla, en el 04;
   - la pantalla, en el 10 y en el mockup;
   - el contrato, en el 20 y en `contrato/openapi.json`;
   - la prueba, en el 12.

## 2. Las ramas: lo primero es la base al día, en una copia limpia

**Es el primer paso que toca disco, y va antes que leer una sola línea de código.** En cada
repositorio que toca, **y en este orden**:

```bash
git -C repositories/<repo> status --short                  # vacío, o no se sigue
git -C repositories/<repo> switch <base>                   # develop en los de código, main en la especificación
git -C repositories/<repo> pull --ff-only origin <base>    # siempre, aunque parezca que no se movió
git -C repositories/<repo> switch -c feature/$ARGUMENTS
git -C repositories/<repo> log --oneline -1                # di desde qué commit sale la rama
```

- **Si el árbol no está limpio, para.** Enseña `git status --short` y `git diff --stat`, y pregunta.
  No lo guardes por tu cuenta.
- **Si `pull --ff-only` no puede avanzar**, la base local divergió de la remota: no lo fuerces, dilo.
- **Lo que no es una tarea sigue los mismos pasos**, con `feature/<titulo>` en vez del id.
- **Si otra sesión usa la misma copia, trabaja en worktrees con el mismo acomodo**:
  `<carpeta>/repositories/<repo>`. Así la herramienta de documentación sigue viendo a los hermanos.

## 3. El plan

Antes de tocar código, sigue la skill `plan`.

## 4. Al terminar

- **El commit**, con la skill `commit`.
- **El tablero**, en el PR de la especificación: la tarea marcada `[x]`, como dice el §5 del
  `AGENTS.md` de la especificación.
- **Se empuja y se avisa que está lista**, con la base contra la que se abriría el PR. **Ahí se
  para**: la base no se trae hasta que quien dirige autorice el PR, y entonces es la skill `pr`.
