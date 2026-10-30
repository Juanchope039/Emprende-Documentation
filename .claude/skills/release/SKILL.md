---
name: release
description: Prepara y revisa el release de una versión de Emprende que se entrega en su release/X.Y.Z, o el de una entrega del monorepo de producto. Úsala antes de abrir el PR a main, cuando un release no salió, o para contar qué trae una entrega. No publica releases a mano.
argument-hint: "[repositorio] [versión o entrega-vN]"
model: sonnet
---

# Preparar y revisar un release

La regla está en el [ADR-059](../../../docs/adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md) y en el [ADR-077](../../../docs/adr/ADR-077-snapshot-hasta-la-release.md), y cuándo nace cada cosa, en el 19 §4.4. **El
release lo publica la tubería**: «Crear la release» en la `release/X.Y.Z` de la API, el front y la
base, que dispara la entrega a prod, y el empuje de cada `entrega-vN` en el monorepo. Aquí se
prepara lo que necesita y se revisa lo que salió.

## 1. Antes del PR a `main`

En el repositorio de código, con `main` y las etiquetas al día:

```bash
git fetch --tags origin main qa
bash .github/scripts/notas-del-release.sh --en-seco origin/qa
```

- Arma el cuerpo con las entradas del `CHANGELOG.md` de cada versión entre el último release y la
  de `qa`, y lo imprime sin publicar nada.
- **Si la versión que llega no tiene su entrada, falla y la nombra.** Las intermedias pueden no
  tenerla: qa recibe varias versiones juntas y el changelog las cuenta en una. Se agrega por PR a
  `develop` antes de promover, como cualquier entrada del changelog; ni en qa ni en `main`.
- En la API y el front, además, comprueba que la imagen `ghcr.io/…:<versión>` exista con el árbol
  de esa versión. Si el front no tiene imagen, es que faltan `PROD_API_URL` y `PROD_API_MAJOR`, y
  esas las pone quien dirige en el panel.

## 2. Después de la entrega

- La entrega dispara «Crear la release» en cada repositorio con el commit de `main` que entregó.
  Mira su resumen: la rama `release/X.Y.Z`, la versión en `-RELEASE`, la etiqueta, las versiones
  que junta y la imagen con su digest. El release se titula `X.Y.Z-RELEASE · AAAA-MM-DD`.
- **Si no salió**, el resumen dice cuál de las puertas paró. Se arregla la causa y se vuelve a
  correr el flujo con `workflow_dispatch` y el mismo commit: no rehace lo que ya existe. Un release
  nunca se escribe a mano en GitHub.
- Un release publicado no se edita. Si dice algo mal, el siguiente lo corrige en su changelog.

## 3. En el monorepo de producto

- La entrega (`entregar-release.yml` en `emprende_db`) deja `entrega/RELEASE.md` en el sobre, con el
  mismo texto del release. Se mira en la corrida en seco, antes de entregar de verdad.
- El empuje de la etiqueta dispara «Publicar la entrega», que crea el release de `entrega-vN` con
  ese texto.
- **No lleva binarios nativos**: el monorepo no tiene la URL de nadie. Los nativos van en el release
  que crea «Actualizar» en la copia de cada emprendimiento, con su URL, y la llave de Android es
  opcional.

## 4. Al contarlo

- Se cuenta lo que trae para quien lo adopta, versión por versión, sin nombrar el release anterior
  ni otras etiquetas.
- Se dice qué imagen se despliega, y si hay migraciones que correr antes.
