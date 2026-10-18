// La puerta de lo compartido (ADR-070): una copia que no es byte a byte la fuente pone el PR en rojo.
//
//   node scripts/agentes/verificar.mjs                 # desde la especificación, contra los que haya en disco
//   node scripts/agentes/verificar.mjs --fuente        # desde un repositorio de código, contra la fuente en GitHub
//   node scripts/agentes/verificar.mjs --fuente <url>  # contra otra copia de la fuente, por ejemplo una rama
//
// Desde un repositorio de código no hace falta token: la especificación es pública. Si no se puede
// descargar la fuente, la puerta lo dice y falla, porque callar aquí es no tenerla.
//
// Con `--fuente`, las copias se buscan desde donde se corre, no desde donde está el guion: en la
// tubería de un repositorio de código este archivo llega descargado y la especificación no está.

import fs from 'node:fs';
import path from 'node:path';
import { MANIFIESTO, MANIFIESTO_RUTA, RAIZ, contenidoDe, textoDeLaFuente } from './compartido.mjs';

const FUENTE_POR_OMISION = 'https://raw.githubusercontent.com/Juanchope039/Emprende-Documentation/main';

const i = process.argv.indexOf('--fuente');
const url = i === -1 ? null : (process.argv[i + 1]?.startsWith('http') ? process.argv[i + 1] : FUENTE_POR_OMISION);
const problemas = [];

async function bajar(ruta) {
  const respuesta = await fetch(`${url}/${ruta}`);
  if (!respuesta.ok) throw new Error(`${respuesta.status}`);
  return respuesta.text();
}

function comparar(etiqueta, ruta, esperado) {
  const actual = fs.existsSync(ruta) ? fs.readFileSync(ruta, 'utf8') : null;
  if (actual === null) problemas.push(`${etiqueta}: falta`);
  else if (actual !== esperado) problemas.push(`${etiqueta}: no es la fuente byte a byte`);
}

if (url) {
  // Desde un repositorio de código: sus propias copias contra la fuente descargada. El manifiesto
  // también se baja, para que agregar una pieza no obligue a tocar los otros tres repositorios.
  const raizDestino = process.cwd();
  let piezas;
  try {
    piezas = JSON.parse(await bajar(MANIFIESTO_RUTA)).piezas;
  } catch (error) {
    console.error(`✗ no se pudo bajar ${MANIFIESTO_RUTA} de ${url}: ${error.message}`);
    process.exit(1);
  }
  for (const pieza of piezas) {
    let texto;
    try {
      texto = await bajar(pieza.fuente);
    } catch (error) {
      problemas.push(`no se pudo bajar la fuente ${pieza.fuente}: ${error.message}`);
      continue;
    }
    comparar(pieza.destino, path.join(raizDestino, pieza.destino), contenidoDe(pieza, texto));
  }
} else if (!MANIFIESTO) {
  console.error(`\u2717 no hay ${MANIFIESTO_RUTA} al lado: desde un repositorio de código, corre con \`--fuente\`.`);
  process.exit(1);
} else {
  // Desde la especificación: los repositorios que estén en disco. Los que no, se saltan con aviso.
  for (const pieza of MANIFIESTO.piezas) {
    if (!fs.existsSync(path.join(RAIZ, pieza.fuente))) problemas.push(`la fuente «${pieza.fuente}» no existe`);
  }
  for (const destino of MANIFIESTO.destinos) {
    const raizDestino = path.resolve(RAIZ, destino);
    if (!fs.existsSync(path.join(raizDestino, '.git'))) {
      console.log(`· ${destino} no está en disco: se salta`);
      continue;
    }
    for (const pieza of MANIFIESTO.piezas) {
      comparar(`${destino}/${pieza.destino}`, path.join(raizDestino, pieza.destino), contenidoDe(pieza, textoDeLaFuente(pieza)));
    }
  }
}

if (problemas.length) {
  for (const problema of problemas) console.error(`✗ ${problema}`);
  console.error(`\n${problemas.length} copias fuera de sitio: corre \`node scripts/agentes/repartir.mjs\` en la especificación.`);
  process.exit(1);
}

console.log('✓ lo compartido está al día.');
