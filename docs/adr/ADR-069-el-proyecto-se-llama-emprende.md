# ADR-069 · El proyecto se llama Emprende, y el nombre viejo se va por donde se toca

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-069-el-proyecto-se-llama-emprende.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-17 | 2026-10-17 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El proyecto se llamaba PRISMA, y los cinco repositorios se llamaban `Finanzas-PRISMA`,
`Finanzas-PRISMA-API`, `Finanzas-PRISMA-DB`, `Finanzas-PRISMA-Front` y `PRISMA`. Quien dirige lo
renombró el 2026-10-16: hoy son `Emprende-Documentation`, `Emprende-API`, `Emprende-DataBase`,
`Emprende-Front` y `Emprende-MiniApp-MonoRepo`, y pidió el 2026-10-17 que el nombre nuevo entre a la
documentación.

El nombre está en tres clases de sitio, y cada una tiene su propio riesgo:

- **Las URL absolutas de los encabezados.** Cada `.md` enlaza su propio historial de cambios en
  GitHub, y ese enlace lo escribe la herramienta a partir de una constante. GitHub redirige el
  nombre viejo, así que ninguno está roto, pero `documentar.mjs` solo reconoce como propio un enlace
  que empieza por la URL que tiene configurada: con la vieja, deja de verificar los enlaces que
  llegan desde los repositorios de código y los trata como externos.
- **La prosa.** Unas 210 menciones en los cinco repositorios, casi todas frases donde PRISMA es el
  nombre del producto.
- **Los identificadores.** El paquete `com.prismamy.api`, el rol `prisma_api` de la base, las claves
  `prisma.esquema` y `prisma.contrato.version`, y la etiqueta `prisma.arbol` que lee la entrega a
  prod.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Un PR con los 210 reemplazos | El nombre viejo desaparece de una vez | Nadie puede revisar 210 reemplazos, y un cambio de prosa masivo esconde el cambio que sí importa |
| Dejar la prosa como está | Cero trabajo | El proyecto se llamaría de dos formas según el documento que se abra |
| **Declarar el nombre y cambiarlo por donde se toca** | Cada PR cambia lo que ya estaba cambiando, y se revisa | El nombre viejo convive un tiempo con el nuevo |
| Renombrar también los identificadores | Un solo nombre en todo | Cada uno es un cambio con su propio riesgo: una migración fusionada no se edita, y la entrega a prod lee la etiqueta por su nombre |

## Decisión

1. **El proyecto se llama Emprende.** Los cinco repositorios son `Emprende-Documentation`,
   `Emprende-API`, `Emprende-DataBase`, `Emprende-Front` y `Emprende-MiniApp-MonoRepo`.
2. **Las URL de los repositorios salen de `scripts/docs/config.mjs`**, y ahí quedan con el nombre
   nuevo. `enlazar` reescribe con eso el encabezado de cada `.md`, así que la migración de las URL
   es un cambio de una constante y no 101 ediciones a mano.
3. **La prosa nueva dice Emprende, y la que ya está cambia cuando su documento se toque por otra
   razón.** No se abre un PR cuyo único contenido sea un reemplazo masivo.
4. **Los identificadores no se tocan en este ADR**: el paquete de la API, el rol `prisma_api`, las
   claves `prisma.*` y la etiqueta `prisma.arbol`. Cada uno necesita su propio PR, y el del paquete
   ya está decidido aparte.
5. **El historial no se reescribe**: ni el `CHANGELOG.md`, ni los ADR aceptados, ni los mensajes de
   commit. Un ADR aceptado no se edita, y un changelog reescrito falsea lo que se publicó.
6. **En los repositorios de código queda una tarea propia**: sus `.md` llevan la URL absoluta vieja
   escrita a mano, y hay que pasarla a la nueva en el PR que toque cada repositorio. Hasta entonces
   esos enlaces funcionan por la redirección de GitHub, pero la herramienta no los verifica.

## Justificación

El encabezado y la prosa se separan porque no cuestan lo mismo. El encabezado lo escribe la
herramienta: cambiar la constante y volver a generar es un cambio que se revisa leyendo cinco líneas
de configuración, y el `verificar` lo comprueba entero. La prosa, en cambio, es una frase a la vez y
no hay herramienta que juzgue si quedó bien escrita.

Y los identificadores quedan fuera porque el nombre de un repositorio en GitHub se redirige, pero el
de un rol de base de datos, de un paquete Java o de una etiqueta de imagen no: ahí el cambio es una
migración, una compilación o una entrega.

## Consecuencias

- **Positivas:** los enlaces de los encabezados vuelven a apuntar al nombre real, la herramienta los
  verifica otra vez, y el nombre del proyecto queda escrito en un sitio.
- **Negativas:** la prosa convive en dos nombres mientras los documentos se van tocando, y quien lea
  un documento viejo verá PRISMA.
- **A vigilar:** que la prosa nueva no siga diciendo PRISMA por costumbre. Hoy no hay guarda que lo
  mire, y si hace falta, entra con la herramienta que vigile `.claude/`.

## Referencias

- [`CLAUDE.md`](../../CLAUDE.md) [§1](../../CLAUDE.md#1-los-cuatro-repositorios), con la tabla de los repositorios.
- [ADR-035](ADR-035-repositorios-hermanos.md), que es donde se decidió que son hermanos en una carpeta de trabajo.
- [ADR-051](ADR-051-la-visibilidad-de-un-repositorio-no-se-cambia.md): renombrar no es cambiar la visibilidad, que sigue sin tocarse.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-072](ADR-072-las-reglas-con-alcance-y-lo-compartido.md "ADR-072 · Una regla puede vivir en .claude/rules/ con su alcance, y lo compartido tiene una fuente y copias verificadas") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
