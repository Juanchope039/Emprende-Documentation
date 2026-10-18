// Reparte lo compartido a los otros tres repositorios (ADR-070).
//
//   node scripts/agentes/repartir.mjs            # escribe las copias que faltan o cambiaron
//   node scripts/agentes/repartir.mjs --en-seco  # dice qué cambiaría, sin escribir
//
// Solo escribe en los repositorios que estén en disco: en una sesión que tiene uno solo, los demás
// se saltan con un aviso y no es un error.

import fs from 'node:fs';
import path from 'node:path';
import { MANIFIESTO, RAIZ, contenidoDe, textoDeLaFuente } from './compartido.mjs';

const enSeco = process.argv.includes('--en-seco');

for (const pieza of MANIFIESTO.piezas) {
  if (fs.existsSync(path.join(RAIZ, pieza.fuente))) continue;
  console.error(`✗ la fuente «${pieza.fuente}» no existe: revisa compartido.json`);
  process.exit(1);
}

let escritos = 0;
let iguales = 0;

for (const destino of MANIFIESTO.destinos) {
  const raizDestino = path.resolve(RAIZ, destino);
  if (!fs.existsSync(path.join(raizDestino, '.git'))) {
    console.log(`· ${destino} no está en disco: se salta`);
    continue;
  }
  for (const pieza of MANIFIESTO.piezas) {
    const esperado = contenidoDe(pieza, textoDeLaFuente(pieza));
    const ruta = path.join(raizDestino, pieza.destino);
    const actual = fs.existsSync(ruta) ? fs.readFileSync(ruta, 'utf8') : null;
    if (actual === esperado) {
      iguales += 1;
      continue;
    }
    console.log(`${enSeco ? '~' : '→'} ${destino}/${pieza.destino}`);
    escritos += 1;
    if (enSeco) continue;
    fs.mkdirSync(path.dirname(ruta), { recursive: true });
    fs.writeFileSync(ruta, esperado);
  }
}

console.log(`\n${escritos} ${enSeco ? 'cambiarían' : 'se escribieron'}, ${iguales} ya estaban al día.`);
