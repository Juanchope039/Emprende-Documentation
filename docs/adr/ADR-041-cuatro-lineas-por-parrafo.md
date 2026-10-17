# ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-041-cuatro-lineas-por-parrafo.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-24 | 2026-09-24 | [Proceso](../INDICE.md#etiqueta-proceso) · [Calidad](../INDICE.md#etiqueta-calidad) |

## Contexto

El [ADR-036](ADR-036-sin-limite-en-el-commit.md) levantó el tope de 256 caracteres del mensaje de commit y dejó la brevedad como una guía
que aplica quien escribe. Anotó qué vigilar: cuerpos de más de 400 caracteres, la señal de que algo
del plan se fue al commit.

La señal llegó. Desde el 2026-09-22, 10 de los 58 commits con cuerpo tienen al menos un párrafo que,
partido en líneas de 100 columnas, pasa de cuatro; el más largo mide 756 caracteres, ocho líneas.
En el código pasa lo mismo con los comentarios: pasan de cuatro líneas el 8,5 % de los párrafos de
comentario de la API, el 4,2 % de los del front y el 34 % de los de las migraciones, donde la
cabecera cuenta el porqué entero.

Un párrafo largo en un commit no se relee: `git log` se lee de a uno. En el código es peor, porque
el comentario largo es el primero que se queda viejo cuando el código cambia y nadie lo reescribe.

Quien dirige decidió el tope: cuatro líneas por párrafo, en el código y en el commit, y para más,
su autorización, con la razón.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| **Un tope al mensaje entero**, como el [ADR-031](ADR-031-commit-de-256-caracteres.md) | Se mide con una orden | El [ADR-036](ADR-036-sin-limite-en-el-commit.md) lo levantó por arbitrario, y un tope total castiga al commit que tiene tres cosas que decir |
| **Seguir con la guía sin cifra** del [ADR-036](ADR-036-sin-limite-en-el-commit.md) | No estorba nunca | Es la que dejó crecer los párrafos: uno de cada seis commits |
| **Cuatro líneas por párrafo, con excepción autorizada** (la decisión) | Acota cada idea sin limitar cuántas hay; se ve de un vistazo; la excepción existe, pero hay que pedirla y explicarla | Hay que definir qué es una línea, y nadie lo mide todavía |
| **Además, que lo verifique la integración continua** | No dependería de nadie | Medir comentarios en varios lenguajes es otra herramienta; queda para cuando la regla haya probado que se sostiene |

## Decisión

1. **Un párrafo tiene cuatro líneas como máximo** cuando es:
   - de un comentario o de la documentación dentro del código: javadoc, dartdoc, la cabecera de una
     migración, los comentarios de un guion, de un flujo de integración o de la configuración;
   - del mensaje de un commit.
2. **Una línea** es, en el código, la del archivo, sin pasar el ancho de su formateador —120
   columnas en Java, 80 en Dart— o 100 donde no hay formateador. En el commit, 100 columnas.
3. **Un párrafo termina en una línea en blanco**, o en un comentario vacío. Cada elemento de una lista
   cuenta como un párrafo. Un ejemplo de código o una tabla dentro de un comentario no son párrafos.
4. **En el commit**, el asunto es una línea, y el cuerpo son tres párrafos —`Hace:`, `Decide:` y
   `Verifica:`— separados por una línea en blanco.
5. **Si un párrafo necesita más de cuatro líneas**, se pide autorización a quien dirige antes de
   escribirlo, diciendo por qué no cabe. Sin ella, se parte en dos ideas, se recorta, o el porqué
   largo va al plan o a un ADR.
6. **Rige para lo que se escribe o se cambia.** Lo que ya está no se reescribe solo por esta regla.

El mensaje sigue sin tope total ([ADR-036](ADR-036-sin-limite-en-el-commit.md)): lo que tiene tope es cada párrafo. Los documentos `.md`
no entran aquí; su forma la dice [`22-documentacion.md`](../22-documentacion.md).

## Justificación

**Cuatro líneas es una idea.** Si no cabe, son dos, o es un porqué que tiene un sitio mejor: el
plan, escrito antes y sin tope, o el ADR, cuando la decisión es grande.

**Por párrafo y no por mensaje.** Un tope al mensaje entero obliga a elegir qué parte de lo que pasó
no se cuenta; uno por párrafo solo obliga a contarlo corto. Y no resucita la resta del [ADR-031](ADR-031-commit-de-256-caracteres.md), que
dependía de los trailers.

**La línea se define porque si no, la regla no dice nada.** Un párrafo escrito en una sola línea de
setecientos caracteres es «una línea». El ancho de cada lenguaje es el que su formateador ya impone,
y el del commit es 100, el mismo en que el proyecto parte la prosa de sus documentos. Se descartó
72, la convención de git para parches por correo, que el proyecto no usa y que deja 288 caracteres.

**Los tres párrafos del commit se separan con una línea en blanco** para que «párrafo» sea lo que
git también llama párrafo, y las cuatro líneas se cuenten de un vistazo. Pegados, con el texto
partido en líneas, no se ve dónde termina uno y empieza el otro.

**La excepción cuesta, a propósito.** Pedir permiso y dar la razón hace visible el párrafo largo
antes de que exista, que es cuando todavía se puede decidir que va a otro sitio.

## Consecuencias

**Positivas**

- Los commits y los comentarios se leen de corrido, y cada párrafo dice una cosa.
- El porqué largo vuelve al plan y a los ADR, que es donde el [ADR-031](ADR-031-commit-de-256-caracteres.md) y el [ADR-036](ADR-036-sin-limite-en-el-commit.md) lo querían.

**Negativas**

- La cabecera de las migraciones es donde más choca: hoy pasa de cuatro líneas uno de cada tres de
  sus párrafos. El carril de la base va a partirla más o a pedir más autorizaciones.
- Nadie lo mide todavía: depende de quien escribe y de quien revisa, como la guía del [ADR-036](ADR-036-sin-limite-en-el-commit.md).

**A vigilar**

- Que las autorizaciones se vuelvan rutina. La señal es que un mismo tipo de párrafo las pida
  siempre, y entonces lo que está mal es la regla o el sitio del porqué.
- Que un párrafo largo se parta en dos seguidos que dicen lo mismo, solo para cumplir.

## Referencias

- [ADR-028](ADR-028-un-commit-por-tarea.md) — un commit por tarea, con sus tres preguntas
- [ADR-031](ADR-031-commit-de-256-caracteres.md) — el tope de 256, reemplazado
- [ADR-036](ADR-036-sin-limite-en-el-commit.md) — el mensaje sin tope total, que sigue en pie
- [22 §10](../22-documentacion.md#10-los-planes-de-trabajo) — los planes de trabajo, donde va el porqué largo
- [08 §4](../08-plan-de-desarrollo.md#4-definición-de-terminado) — la definición de terminado, que describe el commit

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [08](../08-plan-de-desarrollo.md "08 · Plan de desarrollo") · [ADR-028](ADR-028-un-commit-por-tarea.md "ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué") · [ADR-036](ADR-036-sin-limite-en-el-commit.md "ADR-036 · El mensaje de commit no tiene limite de longitud") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
