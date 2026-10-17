# ADR-065 · El check del proyecto avisa y no bloquea

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.0](https://github.com/Juanchope039/Finanzas-PRISMA/commits/main/docs/adr/ADR-065-el-check-del-proyecto-avisa.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-17 | 2026-10-17 | [Proceso](../INDICE.md#etiqueta-proceso) |

## Contexto

El [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md) puso el check «El PR está en el proyecto» y lo hizo bloqueante: un PR que no estuviera en
«Prisma project» no entraba. Dos días de uso enseñaron el precio.

- **Lo que el check juzga no está en el PR.** Estar en el tablero no dice nada del código que entra:
  es un clic en el panel del proyecto, y lo da quien dirige.
- **Agregarlo no dispara ningún evento**, así que el clic no vuelve el check verde: hay que volver a
  correr el trabajo a mano. El PR queda en rojo mientras tanto.
- **Y falla también cuando no puede saberlo**: sin `PRISMA_PROYECTO_TOKEN`, con el token vencido o
  con un runner sin `gh`, el rojo no dice «no está en el tablero» sino «no se pudo mirar».
- **Una sesión de agente en la nube no alcanza los proyectos** ([ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md), punto 4 del contexto), así
  que quien abre el PR no puede dejarlo verde ni esperando.

Quien dirige lo pidió el 2026-10-17: que el trabajo avise y no falle.

## Alternativas consideradas

| Alternativa | A favor | En contra |
|---|---|---|
| Dejarlo bloqueante | La regla se cumple siempre, porque no hay otra salida | Bloquea el PR por algo que no es del PR, y el rojo tapa un «no se pudo saber» |
| Quitar el check | Un trabajo menos y un secreto menos | Nadie se enteraría de un PR fuera del tablero, que es lo que el [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md) vino a resolver |
| **Que avise y no falle** | El aviso queda en el resumen del trabajo y en las anotaciones, y el PR no se detiene | Un PR puede entrar sin estar en el tablero, y entonces el tablero no lo cuenta |

## Decisión

1. **La regla del [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md) sigue en pie**: todo PR a `develop`, `qa` o `main` de los cuatro
   repositorios va en «Prisma project», el proyecto 4 de `Juanchope039`.
2. **Pero el trabajo «El PR está en el proyecto» ya no falla.** Cuando el PR no está, cuando falta
   el secreto, cuando GitHub rechaza la consulta o cuando al runner le falta `gh`, escribe un
   `::warning::` y termina en verde.
3. **El ruleset puede seguir pidiendo el check por su nombre.** No hay que tocar
   `politicas-de-ramas.json`: un trabajo que siempre termina en verde satisface la regla de rama, y
   el día que vuelva a bloquear, la definición ya está puesta.
4. **El aviso es lo que queda**, en las anotaciones de la corrida y en el resumen del trabajo. Quien
   dirige decide si agrega el PR al tablero antes de fusionarlo.

## Justificación

Una puerta sirve cuando lo que juzga está en lo que entra. Esta juzga un clic de quien fusiona, así
que bloquear no le enseña nada a nadie: le quita la salida al PR y, cuando el token vence, a todos a
la vez. El aviso conserva lo único que el [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md) necesitaba de verdad —que se note— sin cobrarlo.

## Consecuencias

- **Positivas:** ningún PR se queda sin salida esperando un clic, y un fallo de token o de runner
  deja de verse como una regla incumplida.
- **Negativas:** un PR puede fusionarse sin estar en el tablero, y entonces el tablero no lo cuenta.
  Que se note depende de que alguien lea el aviso.
- **A vigilar:** si varios PR entran sin tablero, la respuesta no es volver a bloquear sino arreglar
  el auto-add del proyecto, que es lo que tendría que hacerlo solo.

## Referencias

- [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md), que este reemplaza.
- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), cuyos rulesets nombran el check.
- [`scripts/github/README.md`](../../scripts/github/README.md), con el secreto y el auto-add.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [ADR-062](ADR-062-el-pr-esta-en-el-proyecto.md "ADR-062 · Todo PR a una rama principal está en el proyecto del tablero, y un check lo exige") · [CLAUDE](../../CLAUDE.md "CLAUDE.md") · [README](../../scripts/github/README.md "Políticas de rama")
<!-- /generado:referenciado-desde -->
