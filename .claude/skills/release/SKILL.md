---
name: release
description: Prepara y revisa el release de una versión de PRISMA que llega a main, o el de una entrega del monorepo de producto. Úsala antes de abrir el PR a main, cuando un release no salió, o para contar qué trae una entrega. No publica releases a mano.
argument-hint: "[repositorio] [versión o entrega-vN]"
model: sonnet
---

# Preparar y revisar un release

La regla está en el [ADR-059](../../../docs/adr/ADR-059-etiquetas-con-esquema-y-release-en-main.md), y cuándo nace cada cosa, en el 19 §4.4. **El release lo
publica la tubería**: en el empuje a `main` de la API, el front y la base, y en el empuje de cada
`entrega-vN` en el monorepo. Aquí se prepara lo que necesita y se revisa lo que salió.

## 1. Antes del PR a `main`

En el repositorio de código, con `main` y las etiquetas al día:

```bash
git fetch --tags origin main qa
bash .github/scripts/notas-del-release.sh --en-seco origin/qa
```

- Arma el cuerpo con las entradas del `CHANGELOG.md` de cada versión entre el último release y la
  de `qa`, y lo imprime sin publicar nada.
- **Si la versión que llega no tiene su entrada, falla y la nombra.** Las intermedias pueden no
  tenerla: qa recibe varias versiones juntas y el changelog las cuenta en una. Se agrega por la promoción
  a qa, como cualquier entrada del changelog; no en `main`.
- En la API y el front, además, comprueba que la imagen `ghcr.io/…:<versión>` exista con el árbol
  de esa versión. Si el front no tiene imagen, es que faltan `PROD_API_URL` y `PROD_API_MAJOR`, y
  esas las pone quien dirige en el panel.

## 2. Después del empuje a `main`

- El flujo «Publicar el release» corre en ese empuje. Mira su resumen: la versión, la etiqueta sobre
  la que salió, las versiones que junta y la imagen con su digest.
- **Si no salió**, el resumen dice cuál de las puertas paró. Se arregla la causa y se vuelve a
  correr el flujo con `workflow_dispatch`. Un release nunca se escribe a mano en GitHub.
- Un release publicado no se edita. Si dice algo mal, el siguiente lo corrige en su changelog.

## 3. En el monorepo de producto

- La entrega (`entregar-release.yml` en `prisma_db`) deja `entrega/RELEASE.md` en el sobre, con el
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
