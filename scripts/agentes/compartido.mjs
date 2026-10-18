// Lo que comparten los cuatro repositorios: reglas, skills y agentes (ADR-070).
//
// La fuente es esta especificación y las copias son generadas: `repartir.mjs` las escribe y
// `verificar.mjs` las compara byte a byte. Aquí vive lo que las dos necesitan saber, para que la
// forma de una copia esté escrita una sola vez.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const MANIFIESTO_RUTA = 'scripts/agentes/compartido.json';

// El manifiesto de esta copia, cuando hay una. En la tubería de un repositorio de código este
// archivo llega descargado y al lado no hay especificación: ahí el manifiesto se baja, y leerlo del
// disco al importar dejaría la puerta sin poder correr.
export const MANIFIESTO = fs.existsSync(path.join(RAIZ, MANIFIESTO_RUTA))
  ? JSON.parse(fs.readFileSync(path.join(RAIZ, MANIFIESTO_RUTA), 'utf8'))
  : null;

// El aviso que lleva una copia que no es idéntica a su fuente, porque la fuente no es un archivo de
// `.claude/`. Una copia que no dice que es una copia se edita, y entonces la puerta se pone roja sin
// que nadie sepa por qué.
const AVISO = [
  '<!-- generado:compartido · no editar a mano -->',
  '<!-- Copia de FUENTE en Emprende-Documentation. Se cambia allá y se reparte con',
  '     `node scripts/agentes/repartir.mjs`; la puerta «Lo compartido está al día» la compara. -->',
  '',
  '',
].join('\n');

export function avisoDe(fuente) {
  return AVISO.replace('FUENTE', fuente);
}

// Lo que le toca a una copia: el texto de la fuente, con el aviso delante si la pieza lo pide.
export function contenidoDe(pieza, texto) {
  return pieza.encabezado ? avisoDe(pieza.fuente) + texto : texto;
}

export function textoDeLaFuente(pieza) {
  return fs.readFileSync(path.join(RAIZ, pieza.fuente), 'utf8');
}
