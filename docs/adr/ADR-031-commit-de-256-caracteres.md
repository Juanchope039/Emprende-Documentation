# ADR-031 · El mensaje de commit cabe en 256 caracteres

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.2.0](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-031-commit-de-256-caracteres.md "Historial de cambios") | [⛔ Reemplazado](../22-documentacion.md#estados-de-un-adr) por [ADR-036](ADR-036-sin-limite-en-el-commit.md) | 2026-09-17 | 2026-09-21 | — |

> **Reemplazado por [ADR-036](ADR-036-sin-limite-en-el-commit.md).** El proyecto ya no usa trailers, lo que
> elimina la justificacion numerica del tope. [ADR-036](ADR-036-sin-limite-en-el-commit.md) retira la regla y la verificacion del CI.

> **Los planes de trabajo ya no se citan.** Desde el [ADR-035](ADR-035-repositorios-hermanos.md) viven fuera de todo repositorio, no se
> versionan y ningún documento los nombra. Las menciones de abajo a su carpeta son de cuando vivían
> dentro de la especificación: el porqué largo sigue yendo al plan, y el plan ya no se enlaza.

## Contexto

El [ADR-028](ADR-028-un-commit-por-tarea.md) decidió que cada tarea es un commit y que el cuerpo responde tres preguntas: qué hace,
qué se decidió y por qué, y cómo se verificó. No dijo cuánto puede medir, y el historial contestó
solo: los commits de trabajo del proyecto van entre **1.145 y 2.971 caracteres**. El más largo,
`Cada plan de trabajo es un archivo numerado en plan/`, tiene casi tres mil.

Un cuerpo de tres mil caracteres no se lee en `git log`, que es donde vive. Se lee una vez, cuando
se escribe, y después estorba: `git log --oneline` deja de servir porque hay que abrir cada commit
para saber si el que se busca es ese, y el `git log` completo de un sprint no cabe en una pantalla.

Y hay algo que el 028 ya había previsto en su sección «A vigilar»: que el cuerpo se volviera fórmula
rellenada. Un cuerpo largo la invita, porque hay que llenar el espacio. Uno corto obliga a decidir
qué es lo único que había que decir.

Mientras tanto, el porqué largo dejó de no tener sitio. Desde la regla de `plan/` ([22 §10](../22-documentacion.md#planes)) cada
trabajo se planea antes en un archivo que no tiene tope, que dice las mismas tres cosas en futuro y
que no se corrige nunca. El commit ya no es el único sitio donde cabe la decisión: es el sitio donde
cabe su **resumen**.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **Tope duro de 256 caracteres al mensaje entero** | Se mide con una orden de una línea y lo verifica la herramienta; `git log --oneline` vuelve a ser la lista de lo hecho; obliga a escribir la frase, no el párrafo | Hay que cortar el cuerpo que pide el [ADR-028](ADR-028-un-commit-por-tarea.md), y una decisión que de verdad necesita tres párrafos no cabe |
| Tope solo al asunto | Es la convención de casi todo el mundo, 50 o 72 caracteres | Los asuntos del proyecto ya van entre 20 y 70: la regla no cambiaría nada de lo que ya se hace |
| Tope al cuerpo, sin contar asunto ni trailers | Más justo: los trailers no los elige quien escribe | Obliga a decidir qué línea es trailer y cuál no, y esa decisión vuelve a depender de una persona. Un tope que no se puede medir de un vistazo no se cumple |
| Un límite recomendado, sin verificar | No estorba nunca | Es lo que había: el 028 ya pedía cuerpos con criterio y salieron de tres mil caracteres |

## Decisión

1. **El mensaje de commit completo no pasa de 256 caracteres.** «Completo» es lo que devuelve
   `git log -1 --pretty=%B` sin los saltos de línea del final: asunto, línea en blanco, cuerpo y
   trailers. Se mide así:

   ```bash
   printf '%s' "$(git log -1 --pretty=%B)" | wc -c
   ```

2. **El asunto no cambia:** sigue llevando sprint y número, `[Sprint 2](../08-plan-de-desarrollo.md#sprint-2) / 2.1: la sesion contra
   Supabase Auth`.

3. **Los tres títulos del [ADR-028](ADR-028-un-commit-por-tarea.md) se quedan, en una línea cada uno**, y se acortan a una palabra:
   `Hace:`, `Decide:` y `Verifica:`. «Verifica» sigue llevando el conteo de pruebas y qué se rompió
   a propósito, que es lo que prueba que la prueba sirve.

4. **Se va la línea `Tarea: N.M del Sprint S`** que pedía el [ADR-028](ADR-028-un-commit-por-tarea.md). Cuesta 24 caracteres y repite
   lo que el asunto ya dice dos renglones más arriba.

5. **Los commits de fusión quedan exentos.** No los escribe una persona.

6. **Lo verifica `scripts/docs/documentar.mjs verificar --base <SHA>`**, que es lo que corre la
   integración continua sobre cada PR.

Un mensaje completo, medido, en 254 de los 256:

```
Sprint 2 / 2.1: la sesion contra Supabase Auth

Hace: entrar con usuario; el correo lo arma la API.
Decide: el dominio interno va en configuracion.
Verifica: 18 nuevas, 331 verdes; roto el mapeo, 12.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

## Justificación

**256 no es un número redondo cualquiera: es lo que queda después de restar.** El asunto se lleva
unos 46, el trailer `Co-Authored-By` exactamente 53, y los saltos de línea 4. Quedan **152 para las
tres respuestas**, unos 50 por respuesta, que es una frase. El tope está puesto en el punto donde
las tres siguen cabiendo y ninguna cabe dos veces.

**El commit es un índice, no un archivo.** Lo que se necesita de un commit meses después es
reconocerlo: qué tarea fue, qué se decidió, si se probó. Eso cabe en tres frases. Lo que no cabe
—las alternativas descartadas, el razonamiento entero— tiene dos sitios mejores y permanentes: el
plan de `plan/`, escrito antes, y el ADR, cuando la decisión es grande. El historial de git es el
peor lugar para un texto largo, porque es el único que no se puede corregir después.

**Un tope que se verifica vale más que una guía que se recuerda.** El [ADR-028](ADR-028-un-commit-por-tarea.md) se despide diciendo
que era «la primera regla del proyecto que depende de quien escribe». De este tope ya no depende: la
herramienta lo mide en cada PR, igual que mide las versiones de los documentos.

**Cortar duele en el sitio correcto.** Escribir «Decide:» en 50 caracteres obliga a saber cuál fue
la decisión. Cuando no se sabe, no sale; y que no salga es la señal, no el problema.

## Consecuencias

- **Positivas:** `git log --oneline` y `git log` vuelven a leerse de corrido; el cuerpo se escribe
  en un minuto y no en diez; el plan de `plan/` deja de ser opcional en la práctica, porque es donde
  queda el porqué largo; y la regla la verifica la integración continua.

- **Negativas:** una tarea con tres decisiones distintas no las puede contar todas en el commit, y
  hay que ir al plan para verlas. El tope cuenta el trailer `Co-Authored-By`, que quien escribe no
  elige y que se lleva 53 de los 256: si algún día se agrega un segundo trailer, el presupuesto para
  las tres respuestas baja de golpe y habrá que volver sobre este número.

- **A vigilar:** que las tres respuestas no se vuelvan abreviaturas sin contenido —«Decide: nada»—,
  que es el mismo riesgo que anotó el [ADR-028](ADR-028-un-commit-por-tarea.md) y que un tope corto agrava. La señal de alarma es un
  commit cuyo plan en `plan/` dice mucho más que él sobre la misma decisión.

## Referencias

- [ADR-028](ADR-028-un-commit-por-tarea.md) — la decisión que este ADR ajusta: un commit por tarea, y el cuerpo con sus tres preguntas
- [22-documentacion.md §10](../22-documentacion.md#10-los-planes-de-trabajo) — los planes de `plan/`, que es donde vive ahora el porqué largo
- [08-plan-de-desarrollo.md §4](../08-plan-de-desarrollo.md#4-definición-de-terminado) — la definición de terminado, que incluye el tope
- [21-trabajo-en-paralelo.md §6.5](../21-trabajo-en-paralelo.md#65-ramas-e-integración) — el ciclo de una tarea, donde se escribe el commit

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-028](ADR-028-un-commit-por-tarea.md "ADR-028 · Cada tarea hecha es un commit, y el commit explica por qué") · [ADR-034](ADR-034-la-version-sube-en-cada-pr.md "ADR-034 · La versión sube un paso en cada PR, y la integración continua lo exige") · [ADR-035](ADR-035-repositorios-hermanos.md "ADR-035 · Los cuatro repositorios, hermanos en una carpeta de trabajo") · [ADR-036](ADR-036-sin-limite-en-el-commit.md "ADR-036 · El mensaje de commit no tiene limite de longitud") · [ADR-041](ADR-041-cuatro-lineas-por-parrafo.md "ADR-041 · Un párrafo de código o de commit tiene cuatro líneas como máximo")
<!-- /generado:referenciado-desde -->
