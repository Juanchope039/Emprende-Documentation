# Herramienta de lo compartido

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/scripts/agentes/README.md "Historial de cambios") | [✅ Vigente](../../docs/22-documentacion.md#estados) | 2026-10-17 | 2026-10-17 | [Proceso](../../docs/INDICE.md#etiqueta-proceso) |

Reparte y verifica lo que tiene que ser igual en los cuatro repositorios: las reglas del proyecto,
las skills del proceso y los agentes que no son de un repositorio ([ADR-072](../../docs/adr/ADR-072-las-reglas-con-alcance-y-lo-compartido.md)). **Hay una fuente, esta
especificación, y las copias son generadas**: es lo mismo que hace [C-04](../../docs/12-pruebas-y-calidad.md#c-04) con el contrato.

```bash
node scripts/agentes/repartir.mjs             # escribe las copias que faltan o cambiaron
node scripts/agentes/repartir.mjs --en-seco   # dice qué cambiaría, sin escribir
node scripts/agentes/verificar.mjs            # desde aquí, contra los hermanos que estén en disco
node scripts/agentes/verificar.mjs --fuente   # desde un repositorio de código, contra la fuente en GitHub
```

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `compartido.json` | El manifiesto: qué archivo de aquí va a qué ruta de los otros tres |
| `compartido.mjs` | Lo que las dos herramientas necesitan saber: la fuente, el aviso y el contenido que le toca a una copia |
| `repartir.mjs` | Escribe las copias. Se corre desde aquí, y solo en los hermanos que estén en disco |
| `verificar.mjs` | La puerta. Falla si una copia falta o no es la fuente byte a byte. Con `--fuente`, busca las copias desde donde se corre: en la tubería de un repositorio de código llega descargado y esta especificación no está en disco |

## Cómo se usa

- **Para cambiar algo compartido** se cambia **aquí**, en la fuente, y se corre `repartir.mjs`. Lo
  que sale son cuatro ramas, una por repositorio, que entran por su PR como cualquier otro cambio.
- **Una copia no se edita nunca.** Lleva su aviso arriba cuando su fuente está fuera de `.claude/`,
  y si se edita, la puerta del repositorio lo acusa en el siguiente PR.
- **Agregar una pieza es agregarla a los cuatro.** El manifiesto no tiene listas por repositorio: lo
  que es de un solo repositorio no es compartido y vive en su `.claude/`.

## Qué hace cada puerta

| Dónde | Qué comprueba |
|---|---|
| La tubería de aquí | Que el manifiesto no nombre un archivo que ya no existe. Los hermanos no están en disco y se saltan |
| La tubería de la API, la base y el front | Que sus copias sean byte a byte la fuente de `main`, que se descarga sin token porque esta especificación es pública |

## Mensajes

| Dice | Qué hacer |
|---|---|
| `la fuente «…» no existe` | El manifiesto nombra algo que se renombró o se borró: arréglalo en `compartido.json` |
| `…: falta` | Esa copia nunca se escribió: corre `repartir.mjs` |
| `…: no es la fuente byte a byte` | Alguien editó la copia. El cambio va en la fuente, y después se reparte |
| `no se pudo bajar la fuente …` | La tubería no alcanzó GitHub, o la ruta ya no existe en `main`. No es un verde: se mira antes de seguir |
