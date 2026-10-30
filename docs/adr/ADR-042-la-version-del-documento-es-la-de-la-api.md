# ADR-042 · El documento OpenAPI declara la versión de la API, y la del contrato viaja en `x-prisma-contrato`

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.0.1](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-042-la-version-del-documento-es-la-de-la-api.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-09-26 | 2026-10-30 | [API](../INDICE.md#etiqueta-api) · [Contrato](../INDICE.md#etiqueta-contrato) · [Calidad](../INDICE.md#etiqueta-calidad) |

## Contexto

Emprende maneja cuatro SemVer independientes ([ADR-014](ADR-014-semver.md)), y dos de ellos hablan de la API: la versión del
artefacto, que sube en cada PR que cambia lo publicado ([ADR-034](ADR-034-la-version-sube-en-cada-pr.md)), y la del contrato acordado, que
sube solo cuando el contrato cambia ([ADR-023](ADR-023-tres-repositorios.md)).

Hasta hoy el documento que sirve `/docs` declaraba en `info.version` la del contrato. Las dos
pantallas que una persona mira decían entonces números distintos del mismo sistema: el badge de
Swagger, `0.21.0`, y «Acerca de», `0.24.0`. Las dos eran ciertas y ninguna lo explicaba.

**Quien dirige pidió que coincidan, y que la que se vea sea la del repositorio.** Este ADR
registra esa decisión, lo que costó y qué se hizo para no perder nada por el camino.

El costo no es de opinión: [C-05](../12-pruebas-y-calidad.md#c-05) sube la versión de la API en casi todos los PR, y [C-04](../12-pruebas-y-calidad.md#c-04)
compara el documento generado contra la copia fijada, que no se edita a mano. Atar el badge a la
versión de la API deja [C-04](../12-pruebas-y-calidad.md#c-04) en rojo en cada PR, a menos que la comparación lo contemple.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **`info.version` es la de la API, y la del contrato se muda a `x-prisma-contrato`** | Una sola versión a la vista, la que se pidió. El dato del contrato no se pierde: sigue en el documento, sigue saliendo de `emprende.contrato.version` y sigue comparándose contra la copia fijada | Un cliente generado de la API en vivo lee en `info.version` algo que no es la versión del contrato. Hay que mirar una clave de extensión para saber contra qué contrato está escrita |
| Dejar `info.version` como estaba y pintar la versión del artefacto en la etiqueta del servidor | Más barata: no toca la identidad del documento ni lo que [C-04](../12-pruebas-y-calidad.md#c-04) compara de `info` | **Deja los dos números en la pantalla**, que es justo lo que había que quitar. Y la etiqueta del servidor sí es texto del contrato acordado |
| `info.version` es la de la API, y la del contrato deja de viajar en el documento | Lo más simple de escribir | La API en vivo deja de decir contra qué contrato está escrita. Y `emprende.contrato.version` se queda sin nadie que lo mire: se desactualiza sin avisar, como pasó con «Acerca de» en el `0.2.0` |
| Editar la copia fijada en cada PR para que siga a la versión de la API | Ninguna, salvo no tocar la prueba | Lo prohíbe el `CLAUDE.md` de la API, y con razón: una copia que se retoca a mano deja de ser la copia de nada. Convierte cada PR en una oportunidad de romper el contrato sin querer |

## Decisión

**El documento que sirve la API declara en `info.version` la versión del artefacto**, la misma que
responde `POST /api/v0/consultas/version` y la misma que pinta «Acerca de». Es lo que se ve en el
badge de Swagger.

**La versión del contrato que esa API implementa viaja en la extensión de raíz
`x-prisma-contrato`**, al lado de `x-prisma-codigos`, y sale de la misma propiedad de siempre.

**[C-04](../12-pruebas-y-calidad.md#c-04) no compara ninguna de las dos contra la copia fijada: las afirma contra su fuente.** Antes de
comparar, lleva el documento generado a la forma que se fija —la versión del contrato en
`info.version`, sin la extensión—, y aparte exige que el documento sirva exactamente
`emprende.version` y `emprende.contrato.version`.

## Justificación

**La pantalla es de quien la mira, no del contrato.** Dos números sin explicación en dos pantallas
del mismo sistema no informan: obligan a preguntar. Quien abre `/docs` en dev quiere saber qué
está corriendo ahí, y eso es el artefacto.

**Mudar el dato no es lo mismo que perderlo.** La objeción real a este cambio —que la API deje de
decir contra qué contrato está escrita— se resuelve con una clave, y por eso la decisión incluye
`x-prisma-contrato` y no solo el cambio del badge.

**La comparación no se afloja: se aprieta.** Se dejan de comparar dos campos y se agregan tres
igualdades afirmadas a mano. La que antes se cumplía de rebote —que la copia fijada sea de la
versión que la API declara implementar— ahora está escrita, y falla diciendo cuál de las dos se
movió.

**Lo que se rompe ruidoso no hace falta recordarlo.** Es el mismo argumento de [ADR-022](ADR-022-openapi-generado.md) y de [C-05](../12-pruebas-y-calidad.md#c-05):
un número que ninguna prueba mira se queda viejo sin avisar, y entonces miente con toda la
autoridad de un documento oficial.

## Consecuencias

- **Positivas:** el badge de `/docs` y «Acerca de» dicen lo mismo, y lo que dicen es qué artefacto
  está corriendo. El documento sigue declarando el contrato que implementa, ahora en una clave que
  no se confunde con nada. Y [C-04](../12-pruebas-y-calidad.md#c-04) pasa a afirmar tres igualdades que antes no estaban escritas,
  entre ellas que la copia fijada corresponde a `emprende.contrato.version`.

- **Negativas:** quien genere un cliente del documento en vivo leerá en `info.version` la versión
  del artefacto, no la del contrato, y tiene que mirar `x-prisma-contrato` para saber contra qué
  está escrito. Es una clave de extensión más que explicar a quien llega nuevo. Y la copia fijada
  deja de ser byte a byte lo que la API sirve: difiere en esos dos campos, a propósito.

- **A vigilar:** si algún día el front o una herramienta generan código del documento en vivo y no
  del contrato acordado, hay que comprobar que leen `x-prisma-contrato`. Y si aparece una tercera
  versión que quiera entrar al documento, no se resuelve agregando otra clave: significa que el
  documento está haciendo de tablero de versiones, que es lo que hace `POST /api/v0/consultas/version`.

## Referencias

- [ADR-014](ADR-014-semver.md) — SemVer independiente por proyecto, que es de donde salen las dos versiones
- [ADR-023](ADR-023-tres-repositorios.md) — el contrato como artefacto con versión propia
- [ADR-022](ADR-022-openapi-generado.md) — el OpenAPI se genera del código y lo verifica la integración continua
- [ADR-034](ADR-034-la-version-sube-en-cada-pr.md) — la versión del artefacto sube un paso en cada PR
- [12 §9.4](../12-pruebas-y-calidad.md#c-04) — [C-04](../12-pruebas-y-calidad.md#c-04), la prueba que compara el documento con la copia fijada
- [20 §7](../20-contrato-de-api.md#7-swagger) — Swagger: dónde se publica y qué documenta

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [12](../12-pruebas-y-calidad.md "12 · Pruebas y calidad") · [20](../20-contrato-de-api.md "20 · Contrato de la API")
<!-- /generado:referenciado-desde -->
