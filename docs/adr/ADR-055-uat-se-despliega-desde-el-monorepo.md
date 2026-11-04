# ADR-055 · uat se despliega desde `main` del monorepo de producto, y lo aprobado es solo la etiqueta

| Versión | Estado | Creado | Actualizado | Etiquetas |
|---|---|---|---|---|
| [1.1.2](https://github.com/Juanchope039/Emprende-Documentation/commits/main/docs/adr/ADR-055-uat-se-despliega-desde-el-monorepo.md "Historial de cambios") | [✅ Aceptado](../22-documentacion.md#estados-de-un-adr) | 2026-10-14 | 2026-10-30 | [Entrega](../INDICE.md#etiqueta-entrega) · [Proceso](../INDICE.md#etiqueta-proceso) |

> **Lo modifica [ADR-061](ADR-061-se-promueve-con-merge-commit.md):** a `qa` ya no entra la entrada del changelog por su cuenta;
> llega por `develop`, como todo lo demás. Las promociones se fusionan con merge commit.

## Contexto

Desde el [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md), Railway construye el uat alojado desde la rama `uat` de dos repositorios: la
API desde `emprende_api` y el front desde `emprende_front`. Son dos orígenes para un ambiente, y
ninguno es el que reciben los emprendimientos, que parten del monorepo de producto ([ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md)).

El monorepo ya lleva los cuatro repositorios como subárboles de git, en `backend-api/`,
`frontend-flutter/`, `database/` y `documentation/`, al día con su `main`. Comprobado el
2026-10-14: los cuatro árboles son, hash por hash, los de `main` y los de `uat`.

Quien dirige lo decidió el 2026-10-14: **uat deja de construirse desde las ramas `uat`, y pasa a
construirse desde `main` del monorepo**. Un solo repositorio para todo el despliegue.

Y el mismo día decidió lo que eso deja a la rama `uat`: «uat va de salida, se elimina y lo
reemplaza main del monorepo». La cadena de cada repositorio se acorta a develop → qa → main.

## Alternativas consideradas

| Opción | A favor | En contra |
|---|---|---|
| **uat desde `main` del monorepo, y lo aprobado es la etiqueta `entrega-vN`** (la decisión) | Un origen para el ambiente. Gerencia aprueba exactamente el árbol que reciben los emprendimientos. Railway ya sabe compilar cada subárbol: es el mismo `Dockerfile` | `main` del monorepo pasa a llevar algo que Gerencia todavía no aprobó, y un fork que lo siga recibe eso |
| Sostener el [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md): uat desde las ramas `uat` | Nada que cambiar | Dos orígenes, y lo que Gerencia aprueba no es lo que se entrega sino una copia que se arma después |
| uat desde una rama aparte del monorepo, `uat`, y `main` solo con lo aprobado | `main` nunca lleva nada sin aprobar | Una quinta rama que mantener, y lo que quien dirige pidió es `main` |
| Conservar la rama `uat` como etapa que no despliega | La batería cara sigue aparte de `main` | Una rama que no lleva a ningún ambiente, y un PR más por cada versión |
| uat desde la imagen que compiló qa | Sería la misma imagen que llega a prod | Railway solo tira de un registro privado con el plan Pro y la credencial puesta en el panel. Se puede dar después, sin cambiar el origen del código |

## Decisión

1. **Los dos servicios del ambiente uat de Railway se construyen desde `Juanchope039/PRISMA`, rama
   `main`**: la API con raíz `/backend-api` y el front con raíz `/frontend-flutter`, cada uno con
   el `Dockerfile` de su carpeta. Solo en el ambiente uat: dev sigue construyendo desde `develop`
   y qa desde su rama `qa`, en cada repositorio.
2. **Cada servicio redespliega solo si cambia su carpeta.** Un cambio en `documentation/` o en
   `.github/` del monorepo no toca uat.
3. **El monorepo recibe `main` de los repositorios de desarrollo** por subárbol de git, con un PR
   en el monorepo. Fusionarlo es lo que lleva una versión al uat alojado. Por eso `qa` entra en
   `main` antes de que Gerencia mire, y no después ([ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md)).
4. **Lo que Gerencia aprobó es la etiqueta `entrega-vN`, no la rama.** `main` del monorepo es «lo
   que está en uat». La entrega del [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md) se dispara solo después de la aprobación, y su
   etiqueta es lo único que un emprendimiento adopta: «Actualizar» la exige.
5. **Un emprendimiento nunca sigue `main` del monorepo**, ni con *Sync fork* ni con un `git pull`.
   Lo dice la guía de despliegue del monorepo.
6. **La rama `uat` sale de los tres repositorios de código, y `main` hace su papel**: la batería
   entera sobre la semilla anonimizada y la comprobación de que el artefacto es el de qa, en el PR
   desde `qa` y en el empuje de su fusión. Las ramas se borran solo con el sí de quien dirige.
7. **La etiqueta `:uat` de cada imagen conserva su nombre, y la mueve el empuje a `main`.** Dice
   lo que el monorepo lleva al uat alojado, y la entrega y la reversión la siguen buscando igual.
8. **El sentido de la promoción lo exige la tubería**: a `qa` solo entra lo que ya está en
   `develop`, más la entrada del changelog, y a `main` solo lo que ya está en `qa`. Es un trabajo
   del que dependen las dos puertas, porque una regla de rama no sabe de qué rama viene un PR.
9. **Las migraciones del uat alojado no cambian de camino**: `promover.ps1 -Ambiente uat` desde
   `emprende_db`, al promover a `main` y antes de fusionar el subárbol de la API que las necesita.

## Justificación

**Un ambiente, un origen.** Con dos repositorios detrás, uat podía quedar con la API de una versión
y el front de otra sin que nada lo mostrara. Con el monorepo, un commit de `main` dice las dos.

**Y lo que se aprueba es lo que se entrega.** Antes, Gerencia aprobaba lo que había en las ramas
`uat`, y la entrega armaba otra copia desde `main` de cada repositorio. Ahora aprueba el árbol que
ya está en el monorepo, y la etiqueta lo marca sin copiarlo.

**Y una etapa que no despliega no paga su rama.** Lo que corría en `uat` cabe en `main`, que ya
era la última etapa y ya comprobaba el árbol. Va después de qa, que es donde se compila, para que
lo barato falle primero.

**Lo que se pierde es que `main` del monorepo esté siempre aprobado.** Por eso la decisión 4 mueve
la garantía a la etiqueta, que ya era lo único que los flujos de cada emprendimiento leen.

## Consecuencias

**Positivas**

- Un solo repositorio de despliegue para uat, y el mismo que reciben los emprendimientos.
- La API y el front de uat no pueden quedar de dos commits distintos sin que se vea.
- Un PR menos por versión, y ninguna rama que no lleve a un ambiente.

**Negativas**

- `main` del monorepo lleva versiones sin aprobar mientras Gerencia revisa.
- La batería cara corre en el PR a `main`: si falla, lo que hay que corregir vuelve por `develop`.
- Railway sigue compilando uat, como antes: la regla 4 del [19 §1.1](../19-ambientes-y-entrega.md#11-las-seis-reglas) sigue cumpliéndose en prod,
  que corre la imagen de qa, y no en uat.

**A vigilar**

- **Que ningún emprendimiento siga `main`.** Si uno lo hace, recibe lo que Gerencia no ha visto.
- **Que el sentido de la promoción solo mira el PR.** Un empuje directo a `qa` o a `main` lo
  frenan las reglas de rama, que exigen PR, y no este trabajo.
- **Que el subárbol de la base lleva la semilla**, con contraseñas en claro. No se despliega, pero
  viaja a cada copia del monorepo. Hay que sacarla de ahí.
- **La entrega copia la API y el front otra vez**, en `api/` y `front/`, al lado de los subárboles.
  Son dos copias del mismo árbol en el monorepo, y unificarlas es la siguiente decisión.

## Referencias

- [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md), que este modifica en su punto 1 y en la rama `uat`, y [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md), en qué entra en
  `main` y cuándo.
- [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md), cuyas ramas principales pasan a ser `develop`, `qa` y `main`.
- [ADR-054](ADR-054-la-entrega-va-al-monorepo-de-producto.md), cuya entrega pasa a marcar con la etiqueta lo que uat ya tiene.
- [`19-ambientes-y-entrega.md`](../19-ambientes-y-entrega.md), donde viven los ambientes y la entrega.

---

<!-- generado:referenciado-desde · no editar a mano: lo escribe scripts/docs/documentar.mjs -->
**🔗 Referenciado desde:** [09](../09-plan-de-implantacion.md "09 · Plan de implantación") · [19](../19-ambientes-y-entrega.md "19 · Ambientes, versionado y entrega") · [ADR-044](ADR-044-dos-ambientes-desplegados.md "ADR-044 · Dos ambientes desplegados, dev y prod, y qa y uat como etapas de la tubería") · [ADR-048](ADR-048-las-ramas-principales-las-protege-github.md "ADR-048 · Las cinco ramas principales las protege GitHub, y la tubería es la puerta para entrar") · [ADR-050](ADR-050-main-vuelve-a-ser-la-ultima-etapa.md "ADR-050 · main vuelve a ser la última etapa, y pre-prod entra en ella por PR") · [ADR-053](ADR-053-se-quita-pre-prod-y-uat-se-despliega.md "ADR-053 · Se quita pre-prod, y uat pasa a ser el segundo ambiente desplegado") · [ADR-056](ADR-056-qa-se-aloja-desde-su-rama.md "ADR-056 · qa también se aloja en Railway, construido desde la rama qa") · [ADR-061](ADR-061-se-promueve-con-merge-commit.md "ADR-061 · Se promueve con merge commit, y qa no recibe nada que no esté en develop") · [CLAUDE](../../CLAUDE.md "CLAUDE.md")
<!-- /generado:referenciado-desde -->
