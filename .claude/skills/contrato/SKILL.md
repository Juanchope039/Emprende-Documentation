---
name: contrato
description: Cambia el contrato de la API de Emprende, contrato/openapi.json. Respeta su formato byte a byte, los rangos de códigos, la versión y el orden con la copia fijada de emprende_api. Úsala cada vez que haya que tocar el contrato o su README.
paths: "**/contrato/**"
model: sonnet
---

# Cambiar el contrato

**Las rutas de este archivo suponen la carpeta de trabajo**, la que tiene los cuatro
repositorios. Si una no existe en tu sesión, la skill `donde-estoy` dice cómo llegar.

El contrato es el acuerdo entre el front y la API, y su cambio es un solo PR en la especificación
que revisan los dos lados. Las reglas están en el `CLAUDE.md` de la especificación (§3 y §4). Rutas
relativas a `repositories/documentation`.

## 1. El cambio

- **Lee primero `20-contrato-de-api.md`.** Ahí están el sobre `{status, mensaje, data}`, los códigos
  de cinco dígitos —`HTTP(3) + caso(2)`— y la tabla de rangos por módulo.
- **Las lecturas van por `POST …/consultas/…`.**
- **Un código nuevo:**
  - va en el rango de su módulo, con un caso que no esté usado;
  - su mensaje va en español, sin jerga técnica, dirigido a quien usa la pantalla;
  - se agrega a `x-prisma-codigos` y a la lista de respuestas de cada operación que lo emite.
- **Un formulario nuevo** se describe con los campos y reglas que la API va a generar de su propio
  validador.

## 2. El formato, byte a byte

`contrato/openapi.json` es el formato que genera la API, y la API guarda una copia exacta que la
prueba C-04 compara:

- las claves van ordenadas a cualquier profundidad;
- `tags` y `required` también van ordenados;
- se escribe `"clave" : valor`, con dos espacios de sangría;
- los arreglos de valores simples van en una sola línea: `[ "a", "b" ]`;
- los saltos de línea son LF, y el archivo termina en uno.

Un cambio a mano tiene que dejar exactamente esos bytes: reescribir el archivo sin cambios tiene que
dar el mismo archivo. Después de editar, compruébalo:

```bash
git diff --stat contrato/openapi.json                 # solo las líneas que querías
git ls-files --eol contrato/openapi.json              # tiene que decir i/lf w/lf
node -e "JSON.parse(require('fs').readFileSync('contrato/openapi.json','utf8'))"   # es JSON válido
```

## 3. La versión

- **Sube `info.version`**: MINOR si agrega algo compatible, MAJOR si rompe algo, PATCH si solo
  corrige descripciones.
- **Al `contrato/README.md`** se le suben dos cosas:
  - su versión de documento;
  - una fila nueva **arriba** en la tabla del historial, con qué cambió, por qué, qué requisitos y
    qué tarea.

  La columna «Contrato» del encabezado la pone `enlazar`, leyendo `info.version`.
- **Luego la skill `documentar`**: `enlazar`, `verificar` y `--base`.

## 4. Después, en la API

Cuando se fusione el PR del contrato, en el repositorio `backend-api` se hace esto:

1. Se copia el archivo tal cual a `contrato/openapi.json`, sin editarlo.
2. Se sube `emprende.contrato.version` en `application.yml`.
3. Lo acordado que todavía no se emite se marca con `@PendienteDeEmitir(sprint, quien)`.
4. Se corre `./gradlew build`: C-04 compara lo generado con la copia, y C-03 el catálogo con el
   código fuente. Si C-04 falla, manda la regla del `CLAUDE.md` de la API.
