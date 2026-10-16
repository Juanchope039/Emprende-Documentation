#!/usr/bin/env node
// Mantiene la documentación de PRISMA enlazada y la verifica.
//
//   node scripts/docs/documentar.mjs enlazar              escribe anclas, enlaces y bloques generados
//   node scripts/docs/documentar.mjs verificar            falla si algo está roto o sin enlazar
//   node scripts/docs/documentar.mjs verificar --base SHA además exige subir la versión de lo que
//                                                        cambió
//
// Las reglas están en docs/22-documentacion.md.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cfg from './config.mjs';
import * as md from './markdown.mjs';
import * as plan from './plan.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ESPEC = 'especificacion';
const URL_ESPEC = `${cfg.ESPECIFICACION.github}/blob/${cfg.ESPECIFICACION.rama}/`;
// Cómo se llama esta especificación vista desde un repositorio hermano (ADR-035).
const HERMANA = `../${path.basename(RAIZ)}/`;

// ---------------------------------------------------------------------------------------------
// Archivos
// ---------------------------------------------------------------------------------------------

function markdownDe(carpeta) {
  const cwd = path.join(RAIZ, carpeta);
  if (!fs.existsSync(path.join(cwd, '.git'))) return [];
  const salida = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', '*.md'], {
    cwd,
    encoding: 'utf8',
  });
  return salida
    .split('\0')
    .filter(Boolean)
    .map((r) => (carpeta ? `${carpeta}/${r}` : r))
    .filter((r) => !cfg.EXCLUIDOS.has(r) && !enCarpetaExcluida(r) && fs.existsSync(path.join(RAIZ, r)));
}

/** Si el archivo vive dentro de una carpeta de herramientas, a cualquier profundidad. */
function enCarpetaExcluida(ruta) {
  const partes = ruta.split('/');
  return cfg.CARPETAS_EXCLUIDAS.some((carpeta) => partes.includes(carpeta));
}

function cargarArchivos() {
  const archivos = [];
  for (const ruta of markdownDe('')) archivos.push({ ruta, repo: ESPEC });
  for (const repo of cfg.REPOS_DE_CODIGO) {
    for (const ruta of markdownDe(repo.carpeta)) archivos.push({ ruta, repo });
  }
  for (const a of archivos) {
    // En Windows, con core.autocrlf, git deja los archivos con CRLF al sacarlos. Se trabaja en LF,
    // que es lo que guarda el repositorio: si no, cada corrida mezclaría los dos finales de línea.
    a.original = fs.readFileSync(path.join(RAIZ, a.ruta), 'utf8').replace(/\r\n/g, '\n');
    a.contenido = a.original;
    a.tipo = /^docs\/adr\/ADR-\d{3}-.*\.md$/.test(a.ruta) ? 'adr' : 'documento';
    a.enRepo = a.repo === ESPEC ? a.ruta : a.ruta.slice(a.repo.carpeta.length + 1);
  }
  return archivos;
}

const esEspec = (a) => a.repo === ESPEC;

// ---------------------------------------------------------------------------------------------
// Contexto: qué documentos, secciones, anclas y definiciones existen
// ---------------------------------------------------------------------------------------------

function construirContexto(archivos) {
  const porRuta = new Map(archivos.map((a) => [a.ruta, a]));
  const especificacion = archivos.filter(esEspec);
  const porNumero = new Map();
  const porNombre = new Map();
  const adrPorId = new Map();
  for (const a of especificacion) {
    const base = path.posix.basename(a.ruta);
    const numero = a.ruta.match(/^docs\/(\d{2})-[^/]+\.md$/);
    if (numero) porNumero.set(numero[1], a.ruta);
    const adr = base.match(/^(ADR-\d{3})-/);
    if (adr) adrPorId.set(adr[1], a.ruta);
    if (/^(\d{2}-|ADR-\d{3}-)/.test(base) || ['INDICE.md', 'TODO.md'].includes(base)) porNombre.set(base, a.ruta);
  }
  const secciones = new Map();
  const anclas = new Map();
  for (const a of archivos) {
    secciones.set(a.ruta, md.seccionesDe(a.contenido));
    anclas.set(a.ruta, md.anclasDe(a.contenido));
  }
  const ctx = { porRuta, porNumero, porNombre, adrPorId, secciones, anclas, definiciones: new Map() };
  ctx.url = (desde, ruta, ancla) => {
    const fragmento = ancla ? `#${ancla}` : '';
    if (ruta === desde.ruta) return fragmento || path.posix.basename(ruta);
    if (esEspec(desde)) return md.rutaRelativa(desde.ruta, ruta) + fragmento;
    return URL_ESPEC + ruta + fragmento;
  };
  ctx.rutaPorNombre = (nombre) => {
    const limpio = nombre.replace(/^\.?\/?(docs\/)?(adr\/)?/, '');
    return porNombre.get(path.posix.basename(limpio)) ?? null;
  };
  ctx.rutaPorPrefijo = (prefijo) => {
    for (const [base, ruta] of porNombre) if (base.startsWith(`${prefijo}-`) || base === `${prefijo}.md`) return ruta;
    return null;
  };
  // Resuelve el destino de un enlace escrito en `desde` a una ruta local, si es un archivo conocido.
  ctx.resolver = (desde, destino) => {
    let [camino, ancla] = destino.split('#');
    if (destino.startsWith(URL_ESPEC)) {
      [camino, ancla] = destino.slice(URL_ESPEC.length).split('#');
      return { ruta: path.posix.normalize(camino), ancla: ancla ? decodeURIComponent(ancla) : null, externo: false };
    }
    if (/^[a-z]+:/i.test(destino)) return null;
    if (camino === '') return { ruta: desde.ruta, ancla: ancla ? decodeURIComponent(ancla) : null };
    let ruta = path.posix.normalize(path.posix.join(path.posix.dirname(desde.ruta), decodeURIComponent(camino)));
    // Desde un repositorio hermano, la especificación es `../documentation/…`: se trata como suya,
    // para que `enlazar` lo reescriba a GitHub en vez de dejar un enlace que allá no existe.
    if (ruta.startsWith(HERMANA)) ruta = ruta.slice(HERMANA.length);
    return { ruta, ancla: ancla ? decodeURIComponent(ancla) : null };
  };
  return ctx;
}

// ---------------------------------------------------------------------------------------------
// Anclas en las definiciones
// ---------------------------------------------------------------------------------------------

const ID_EN_CELDA = /^(?:<a id="[^"]*"><\/a>)?(\*\*)?(BDD-(?:RNF-)?\d{2,3}-\d+|RNF-\d{2}|RF-\d{2,3}|RN-\d{2}|CU-\d{2}|RE-\d{2}|[RPAMIFTCD]-\d{2}|H\d{1,2}|S\d)(\*\*)?$/;

export function familiaDe(id) {
  return id.match(/^(BDD|RNF|RF|RN|CU|RE|[RPAMIFTCD]|H|S)/)[1];
}

const anclaDe = (id) => id.toLowerCase();

function ponerAncla(linea, ancla) {
  if (linea.includes(`<a id="${ancla}"></a>`)) return linea;
  const limpia = linea.replace(/<a id="[^"]*"><\/a>/, '');
  if (/^#{1,6}\s/.test(limpia)) return limpia.replace(/^(#{1,6}\s+)/, `$1<a id="${ancla}"></a>`);
  return limpia.replace(/^(\|\s*)/, `$1<a id="${ancla}"></a>`);
}

function insertarAnclas(archivos, ctx) {
  const definiciones = ctx.definiciones;
  const definir = (clave, ruta, ancla) => {
    if (!definiciones.has(clave)) definiciones.set(clave, { ruta, ancla });
  };
  const familiasPorDoc = new Map();
  for (const f of cfg.FAMILIAS) (familiasPorDoc.get(f.documento) || familiasPorDoc.set(f.documento, new Set()).get(f.documento)).add(f.familia);

  for (const a of archivos.filter(esEspec)) {
    const familias = familiasPorDoc.get(a.ruta);
    const esPlan = a.ruta === cfg.DOC_PLAN;
    const esUx = /^docs\/10-/.test(a.ruta);
    if (!familias && !esPlan && !esUx) continue;
    const lineas = a.contenido.split('\n');
    const enCodigo = md.lineasDeCodigo(lineas);
    const generadas = md.lineasGeneradas(a.contenido);

    // Primero los encabezados con identificador: ahí va el ancla si existen.
    const conEncabezado = new Map();
    lineas.forEach((l, i) => {
      if (enCodigo[i] || generadas[i]) return;
      const m = l.match(/^#{2,6}\s+(?:<a id="[^"]*"><\/a>)?(?:\d+(?:\.\d+)*\.?\s+)?([A-Z]{1,3}-\d{2}(?:-\d+)?)\s+·/);
      if (m && familias?.has(familiaDe(m[1])) && !conEncabezado.has(m[1])) conEncabezado.set(m[1], i);
    });

    let sprint = null;
    let enPrincipios = false;
    lineas.forEach((l, i) => {
      if (enCodigo[i] || generadas[i]) return;
      if (esPlan) {
        const s = l.match(/^###\s+(?:<a id="[^"]*"><\/a>)?Sprint (\d{1,2})\b/);
        if (s) {
          sprint = Number(s[1]);
          lineas[i] = ponerAncla(l, `sprint-${sprint}`);
          definir(`sprint:${sprint}`, a.ruta, `sprint-${sprint}`);
          return;
        }
        if (/^##\s/.test(l)) sprint = null;
      }
      if (esUx && /^##\s/.test(l)) enPrincipios = /principios/i.test(l);
      if (!l.startsWith('|')) return;
      const primera = l.replace(/^\|/, '').split('|')[0].trim();
      if (esPlan && sprint !== null && /^(?:<a id="[^"]*"><\/a>)?\d{1,2}\.\d{1,2}$/.test(primera)) {
        const id = primera.replace(/<[^>]*>/g, '');
        const ancla = `tarea-${id.replace('.', '-')}`;
        lineas[i] = ponerAncla(l, ancla);
        definir(`tarea:${id}`, a.ruta, ancla);
        return;
      }
      if (esUx && enPrincipios && /^(?:<a id="[^"]*"><\/a>)?\d{1,2}$/.test(primera)) {
        const n = primera.replace(/<[^>]*>/g, '');
        lineas[i] = ponerAncla(l, `principio-${n}`);
        definir(`principio:${n}`, a.ruta, `principio-${n}`);
        return;
      }
      const m = primera.match(ID_EN_CELDA);
      if (!m || !familias?.has(familiaDe(m[2]))) return;
      const id = m[2];
      if (conEncabezado.has(id) || definiciones.has(id)) return;
      lineas[i] = ponerAncla(l, anclaDe(id));
      definir(id, a.ruta, anclaDe(id));
    });
    for (const [id, i] of conEncabezado) {
      if (definiciones.has(id)) continue;
      lineas[i] = ponerAncla(lineas[i], anclaDe(id));
      definir(id, a.ruta, anclaDe(id));
    }
    a.contenido = lineas.join('\n');
  }
}

// ---------------------------------------------------------------------------------------------
// Enlaces en el texto
// ---------------------------------------------------------------------------------------------

const REFERENCIA = new RegExp(
  [
    String.raw`(?<![\p{L}\p{N}/._-])(?<archivo>(?:docs/)?(?:adr/)?(?:\d{2}-[a-z0-9-]+|ADR-\d{3}-[a-z0-9-]+|INDICE|TODO)\.md)(?<archivoSec>\s+§\d+(?:\.\d+)*)?`,
    String.raw`(?<![\p{L}\p{N}/._-])(?<corto>\d{2}-[a-z][a-z-]*[a-z])(?<cortoSec>\s+§\d+(?:\.\d+)*)`,
    String.raw`(?<![\p{L}\p{N}.,§/-])(?<num>[0-2]\d)(?<numSec>\s+§\d+(?:\.\d+)*)`,
    String.raw`(?<![\p{L}])(?<docPalabra>(?:[Dd]ocumentos?|docs?)\s+)(?<docLista>[0-2]\d(?:(?:\s*,\s*|\s+y\s+|\s+o\s+)[0-2]\d)*)(?![\p{N}])`,
    String.raw`(?<![\p{L}\p{N}-])(?<adr>ADR-\d{3})(?![\p{L}\p{N}-])`,
    String.raw`(?<![\p{L}\p{N}_-])(?<id>BDD-(?:RNF-)?\d{2,3}-(?:\d+|\\?\*)|RNF-\d{2}|RF-\d{2,3}|RN-\d{2}|CU-\d{2}|RE-\d{2}|[RPAMIFTCD]-\d{2}|H(?:1[01]|\d)|S[1-5])(?![\p{L}\p{N}_-])`,
    String.raw`(?<![\p{L}])(?<tareaPalabra>[Tt]areas?\s+)(?<tareaLista>\d{1,2}\.\d{1,2}(?:(?:\s*,\s*|\s+y\s+|\s+o\s+|\s+a\s+)\d{1,2}\.\d{1,2})*)(?![\p{N}])`,
    String.raw`(?<tareaNegrita>\*\*(?<tareaNum>\d{1,2}\.\d{1,2})\*\*)`,
    String.raw`(?<![\p{L}])(?<sprint>Sprint\s+(?<sprintNum>\d))(?![\p{N}]|[.,]\d)`,
    String.raw`(?<![\p{L}])(?<principio>principio\s+(?<principioNum>\d{1,2}))(?![\p{N}])`,
    String.raw`(?<secDoc>§(?<secDocNum>\d+(?:\.\d+)*)\s+del\s+(?:documento|doc)\s+(?<secDocDoc>[0-2]\d))(?![\p{N}])`,
    String.raw`(?<seccion>§(?<seccionNum>\d+(?:\.\d+)*))`,
  ].join('|'),
  'gu',
);

const CORTE_DE_ORACION = /[.;!?](?:\s|$)|\|/;

// `estado.ultimoDoc` sigue vivo de una línea a la siguiente dentro del mismo párrafo: una
// referencia como «19-ambientes-y-entrega.md» al final de una línea y «§8.1» al principio de la
// siguiente es una sola.
function enlazarLinea(linea, indice, archivo, ctx, noResueltos, estado) {
  const contextoSupuesto = /supuesto/i.test(linea);
  const esUx = /^docs\/10-/.test(archivo.ruta) || /10-ux/.test(linea);
  const enlace = (texto, ruta, ancla) => `[${texto}](${ctx.url(archivo, ruta, ancla)})`;
  const noResuelto = (texto, motivo) => noResueltos.push({ ruta: archivo.ruta, linea: indice + 1, texto, motivo });
  const seccionDe = (ruta, numero) => ctx.secciones.get(ruta)?.get(numero) ?? null;

  const reemplazo = (m) => {
    const g = m.groups;
    if (g.archivo) {
      const ruta = ctx.rutaPorNombre(g.archivo);
      if (!ruta) return null;
      estado.ultimoDoc = ruta;
      if (g.archivoSec) {
        const numero = g.archivoSec.trim().slice(1);
        const ancla = seccionDe(ruta, numero);
        if (ancla) return enlace(m[0], ruta, ancla);
        noResuelto(m[0], `${path.posix.basename(ruta)} no tiene sección ${numero}`);
        return ruta === archivo.ruta ? null : enlace(g.archivo, ruta) + g.archivoSec;
      }
      return ruta === archivo.ruta ? null : enlace(g.archivo, ruta);
    }
    if (g.corto) {
      const ruta = ctx.rutaPorPrefijo(g.corto);
      if (!ruta) return null;
      estado.ultimoDoc = ruta;
      const numero = g.cortoSec.trim().slice(1);
      const ancla = seccionDe(ruta, numero);
      if (ancla) return enlace(m[0], ruta, ancla);
      noResuelto(m[0], `${path.posix.basename(ruta)} no tiene sección ${numero}`);
      return null;
    }
    if (g.num) {
      const ruta = ctx.porNumero.get(g.num);
      if (!ruta) return null;
      estado.ultimoDoc = ruta;
      const numero = g.numSec.trim().slice(1);
      const ancla = seccionDe(ruta, numero);
      if (ancla) return enlace(m[0], ruta, ancla);
      noResuelto(m[0], `${path.posix.basename(ruta)} no tiene sección ${numero}`);
      return null;
    }
    if (g.docLista) {
      let hubo = false;
      const lista = g.docLista.replace(/\d{2}/g, (n) => {
        const ruta = ctx.porNumero.get(n);
        if (!ruta || ruta === archivo.ruta) return n;
        hubo = true;
        estado.ultimoDoc = ruta;
        return enlace(n, ruta);
      });
      return hubo ? g.docPalabra + lista : null;
    }
    if (g.adr) {
      const ruta = ctx.adrPorId.get(g.adr);
      if (!ruta) {
        noResuelto(g.adr, 'no existe ese ADR');
        return null;
      }
      return ruta === archivo.ruta ? null : enlace(g.adr, ruta);
    }
    if (g.id) {
      const familia = familiaDe(g.id);
      if (familia === 'S' && !contextoSupuesto) return null;
      const clave = g.id.includes('*') ? g.id.replace(/\\?\*$/, '1') : g.id;
      const def = ctx.definiciones.get(clave);
      if (!def) {
        if (!['S', 'H', 'P', 'A', 'M', 'I', 'F', 'T', 'C', 'D', 'R'].includes(familia)) noResuelto(g.id, 'no está definido');
        return null;
      }
      if (def.ruta === archivo.ruta && linea.includes(`<a id="${def.ancla}"></a>`)) return null;
      return enlace(g.id, def.ruta, def.ancla);
    }
    if (g.tareaLista) {
      let hubo = false;
      const lista = g.tareaLista.replace(/\d{1,2}\.\d{1,2}/g, (n) => {
        const def = ctx.definiciones.get(`tarea:${n}`);
        if (!def || linea.includes(`<a id="${def.ancla}"></a>`)) return n;
        hubo = true;
        return enlace(n, def.ruta, def.ancla);
      });
      return hubo ? g.tareaPalabra + lista : null;
    }
    if (g.tareaNegrita) {
      const def = ctx.definiciones.get(`tarea:${g.tareaNum}`);
      return def ? enlace(g.tareaNegrita, def.ruta, def.ancla) : null;
    }
    if (g.sprint) {
      const def = ctx.definiciones.get(`sprint:${g.sprintNum}`);
      if (!def || linea.includes(`<a id="${def.ancla}"></a>`)) return null;
      return enlace(g.sprint, def.ruta, def.ancla);
    }
    if (g.principio) {
      const def = ctx.definiciones.get(`principio:${g.principioNum}`);
      if (!esUx || !def || linea.includes(`<a id="${def.ancla}"></a>`)) return null;
      return enlace(g.principio, def.ruta, def.ancla);
    }
    if (g.secDoc) {
      const ruta = ctx.porNumero.get(g.secDocDoc);
      if (!ruta) return null;
      estado.ultimoDoc = ruta;
      const ancla = seccionDe(ruta, g.secDocNum);
      if (ancla) return enlace(g.secDoc, ruta, ancla);
      noResuelto(g.secDoc, `${path.posix.basename(ruta)} no tiene sección ${g.secDocNum}`);
      return null;
    }
    if (g.seccion) {
      // Un ADR no tiene secciones numeradas: si el último documento nombrado es uno, el «§» habla
      // del documento donde está escrito.
      const conSecciones = estado.ultimoDoc && ctx.secciones.get(estado.ultimoDoc)?.size;
      const ruta = conSecciones ? estado.ultimoDoc : archivo.ruta;
      const ancla = seccionDe(ruta, g.seccionNum);
      if (ancla) return enlace(g.seccion, ruta, ancla);
      noResuelto(g.seccion, `${path.posix.basename(ruta)} no tiene sección ${g.seccionNum}`);
      return null;
    }
    return null;
  };

  const salida = [];
  for (const t of md.tokenizar(linea)) {
    if (t.tipo === 'enlace') {
      const destino = ctx.resolver(archivo, t.destino);
      if (destino && ctx.porRuta.has(destino.ruta) && ctx.porRuta.get(destino.ruta).repo === ESPEC) {
        estado.ultimoDoc = destino.ruta;
        // Un README de código no puede enlazar la especificación por ruta relativa: en GitHub son
        // repositorios distintos.
        if (!esEspec(archivo) && !t.destino.startsWith('http')) {
          salida.push(`${t.imagen ? '!' : ''}[${t.etiqueta}](${ctx.url(archivo, destino.ruta, destino.ancla)})`);
          continue;
        }
      }
      salida.push(t.valor);
      continue;
    }
    if (t.tipo === 'codigo') {
      const nombre = t.valor.replace(/^`+\s*|\s*`+$/g, '');
      const ruta = /\.md$/.test(nombre) ? ctx.rutaPorNombre(nombre) : null;
      if (ruta && ruta !== archivo.ruta) {
        estado.ultimoDoc = ruta;
        salida.push(enlace(t.valor, ruta));
      } else salida.push(t.valor);
      continue;
    }
    if (t.tipo !== 'texto') {
      salida.push(t.valor);
      continue;
    }
    let resultado = '';
    let previo = 0;
    for (const m of t.valor.matchAll(REFERENCIA)) {
      const entre = t.valor.slice(previo, m.index);
      if (CORTE_DE_ORACION.test(entre)) estado.ultimoDoc = null;
      resultado += entre + (reemplazo(m) ?? m[0]);
      previo = m.index + m[0].length;
    }
    const resto = t.valor.slice(previo);
    if (CORTE_DE_ORACION.test(resto)) estado.ultimoDoc = null;
    salida.push(resultado + resto);
  }
  return salida.join('');
}

function enlazarArchivo(archivo, ctx, noResueltos) {
  const lineas = archivo.contenido.split('\n');
  const enCodigo = md.lineasDeCodigo(lineas);
  const generadas = md.lineasGeneradas(archivo.contenido);
  const encabezado = md.leerEncabezado(archivo.contenido);
  const estado = { ultimoDoc: null };
  let enComentario = false;
  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i];
    // Un párrafo nuevo, una fila de tabla, un encabezado o un elemento de lista empiezan de cero.
    if (/^\s*(>\s*)?$/.test(l) || /^\s*\|/.test(l) || /^\s{0,3}#/.test(l) || /^\s*(>\s*)?([-*+]|\d+\.)\s/.test(l)) {
      estado.ultimoDoc = null;
    }
    if (enComentario) {
      if (l.includes('-->')) enComentario = false;
      continue;
    }
    if (/^\s*<!--/.test(l) && !l.includes('-->')) {
      enComentario = true;
      continue;
    }
    if (enCodigo[i] || generadas[i]) continue;
    if (/^\s{0,3}#{1,6}\s/.test(l)) continue;
    if (encabezado && i >= encabezado.lineaCabecera && i <= encabezado.lineaValores) continue;
    if (/^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && l.includes('-')) continue;
    lineas[i] = enlazarLinea(l, i, archivo, ctx, noResueltos, estado);
  }
  archivo.contenido = lineas.join('\n');
}

// ---------------------------------------------------------------------------------------------
// Encabezados
// ---------------------------------------------------------------------------------------------

// La columna Código va solo en los README de código (22 §2): un CLAUDE.md o un AGENTS.md que la
// llevara cambiaría con cada subida de versión aunque su texto siguiera igual.
const esReadme = (archivo) => path.posix.basename(archivo.ruta) === 'README.md';

const slugDeEtiqueta = (etiqueta) => Object.entries(cfg.ETIQUETAS).find(([, v]) => v === etiqueta)?.[0] ?? null;

function versionDelCodigo(archivo) {
  if (esEspec(archivo) || !archivo.repo.version) return null;
  const fuente = path.join(RAIZ, archivo.repo.carpeta, archivo.repo.version.archivo);
  return fs.readFileSync(fuente, 'utf8').match(archivo.repo.version.patron)?.[1] ?? null;
}

function versionExtra(archivo) {
  const extra = cfg.VERSIONES_EXTRA[archivo.ruta];
  return extra.leer(fs.readFileSync(path.join(RAIZ, extra.archivo), 'utf8'));
}

export function renderizarEncabezado(archivo, meta, ctx) {
  const espec = esEspec(archivo);
  const historial = espec
    ? `${cfg.ESPECIFICACION.github}/commits/${cfg.ESPECIFICACION.rama}/${archivo.ruta}`
    : `${archivo.repo.github}/commits/main/${archivo.enRepo}`;
  const destinoDe = (ruta) => (espec ? md.rutaRelativa(archivo.ruta, ruta) : URL_ESPEC + ruta);
  const tipo = archivo.tipo === 'adr' ? 'adr' : 'documento';
  const icono = cfg.ESTADOS[tipo][meta.estado]?.icono ?? '❓';
  let estado = `[${icono} ${meta.estado}](${destinoDe(cfg.DOC_REGLAS)}#${tipo === 'adr' ? 'estados-de-un-adr' : 'estados'})`;
  if (meta.reemplazadoPor) {
    const ruta = ctx.adrPorId.get(meta.reemplazadoPor);
    estado += ` por [${meta.reemplazadoPor}](${ruta ? destinoDe(ruta) : '#'})`;
  }
  const etiquetas = meta.etiquetas.length
    ? meta.etiquetas.map((e) => `[${e}](${destinoDe(cfg.DOC_INDICE)}#etiqueta-${slugDeEtiqueta(e) ?? 'desconocida'})`).join(' · ')
    : '—';
  const columnas = ['Versión', 'Estado', 'Creado', 'Actualizado'];
  const valores = [`[${meta.version}](${historial} "Historial de cambios")`, estado, meta.creado, meta.actualizado];
  if (!espec && esReadme(archivo)) {
    columnas.push('Código');
    const version = versionDelCodigo(archivo);
    const fuente = archivo.repo.version
      ? path.posix.relative(path.posix.dirname(archivo.enRepo), archivo.repo.version.archivo)
      : null;
    valores.push(version ? `[${version}](${fuente})` : '—');
  }
  const extra = espec ? cfg.VERSIONES_EXTRA[archivo.ruta] : null;
  if (extra) {
    columnas.push(extra.columna);
    valores.push(`[${versionExtra(archivo)}](${md.rutaRelativa(archivo.ruta, extra.archivo)})`);
  }
  columnas.push('Etiquetas');
  valores.push(etiquetas);
  return [`| ${columnas.join(' | ')} |`, `|${columnas.map(() => '---').join('|')}|`, `| ${valores.join(' | ')} |`];
}

function normalizarEncabezado(archivo, ctx) {
  const meta = md.leerEncabezado(archivo.contenido);
  if (!meta) return;
  const lineas = archivo.contenido.split('\n');
  lineas.splice(meta.lineaCabecera, 3, ...renderizarEncabezado(archivo, meta, ctx));
  archivo.contenido = lineas.join('\n');
}

// ---------------------------------------------------------------------------------------------
// Bloques generados
// ---------------------------------------------------------------------------------------------

function tituloDe(archivo) {
  const lineas = archivo.contenido.split('\n');
  const i = md.lineaDelTitulo(lineas);
  return i === -1 ? archivo.ruta : md.textoDeEncabezado(lineas[i].replace(/^#\s+/, ''));
}

function etiquetaCorta(ruta) {
  const numero = ruta.match(/^docs\/(\d{2})-/);
  if (numero) return numero[1];
  const adr = ruta.match(/(ADR-\d{3})/);
  if (adr) return adr[1];
  if (ruta === 'contrato/README.md') return 'Contrato';
  if (ruta === 'docs/INDICE.md') return 'Índice';
  if (ruta === 'docs/adr/README.md') return 'ADR';
  return path.posix.basename(ruta, '.md');
}

function ordenDeDocumento(ruta) {
  const orden = ['README.md', 'TODO.md', 'docs/INDICE.md'];
  if (orden.includes(ruta)) return orden.indexOf(ruta);
  const numero = ruta.match(/^docs\/(\d{2})-/);
  if (numero) return 10 + Number(numero[1]);
  if (ruta === 'contrato/README.md') return 60;
  if (ruta === 'docs/adr/README.md') return 70;
  const adr = ruta.match(/ADR-(\d{3})/);
  if (adr) return 100 + Number(adr[1]);
  return 500;
}

function referenciasEntrantes(archivos, ctx) {
  const entrantes = new Map();
  for (const a of archivos.filter(esEspec)) {
    if (cfg.NO_CUENTAN_COMO_REFERENCIA.has(a.ruta)) continue;
    const lineas = a.contenido.split('\n');
    const generadas = md.lineasGeneradas(a.contenido);
    const encabezado = md.leerEncabezado(a.contenido);
    const navegacion = lineas.findIndex((l) => /^###\s+🧭/.test(l));
    for (const e of md.enlacesDe(a.contenido)) {
      if (generadas[e.linea]) continue;
      if (encabezado && e.linea >= encabezado.lineaCabecera && e.linea <= encabezado.lineaValores) continue;
      if (navegacion !== -1 && e.linea >= navegacion) continue;
      const destino = ctx.resolver(a, e.destino);
      if (!destino || destino.ruta === a.ruta || !ctx.porRuta.has(destino.ruta)) continue;
      (entrantes.get(destino.ruta) || entrantes.set(destino.ruta, new Set()).get(destino.ruta)).add(a.ruta);
    }
  }
  return entrantes;
}

function ponerBloque(archivo, nombre, cuerpo, lugar) {
  const reemplazado = md.reemplazarBloque(archivo.contenido, nombre, cuerpo);
  if (reemplazado !== null) {
    archivo.contenido = reemplazado;
    return true;
  }
  if (!lugar) return false;
  const bloque = `${md.marcaDeInicio(nombre)}\n${cuerpo.trim()}\n${md.marcaDeFin(nombre)}`;
  archivo.contenido = lugar(archivo.contenido, bloque);
  return true;
}

// Antes de la navegación del pie, o al final.
function antesDeLaNavegacion(contenido, bloque) {
  const lineas = contenido.split('\n');
  let i = lineas.findIndex((l) => /^###\s+🧭/.test(l));
  if (i !== -1) {
    let j = i - 1;
    while (j > 0 && lineas[j].trim() === '') j--;
    if (lineas[j].trim() === '---') i = j;
    lineas.splice(i, 0, bloque, '');
    return lineas.join('\n');
  }
  return `${contenido.replace(/\s*$/, '')}\n\n---\n\n${bloque}\n`;
}

function bloquesDeReferencias(archivos, ctx) {
  const entrantes = referenciasEntrantes(archivos, ctx);
  for (const a of archivos.filter(esEspec)) {
    if (!/^docs\//.test(a.ruta) && a.ruta !== 'contrato/README.md') continue;
    const desde = [...(entrantes.get(a.ruta) ?? [])].sort((x, y) => ordenDeDocumento(x) - ordenDeDocumento(y));
    const cuerpo = desde.length
      ? `**🔗 Referenciado desde:** ${desde
          .map((r) => `[${etiquetaCorta(r)}](${ctx.url(a, r)} "${tituloDe(ctx.porRuta.get(r)).replace(/"/g, "'")}")`)
          .join(' · ')}`
      : '**🔗 Referenciado desde:** ningún otro documento lo cita todavía.';
    ponerBloque(a, 'referenciado-desde', cuerpo, antesDeLaNavegacion);
  }
}

function bloquesDelIndice(archivos, ctx) {
  const indice = ctx.porRuta.get(cfg.DOC_INDICE);
  if (!indice) return;
  const documentos = archivos.filter(esEspec).sort((x, y) => ordenDeDocumento(x.ruta) - ordenDeDocumento(y.ruta));
  const filas = documentos.map((d) => {
    const meta = md.leerEncabezado(d.contenido);
    if (!meta) return `| [${tituloDe(d)}](${ctx.url(indice, d.ruta)}) | — | sin encabezado | — | — |`;
    const tipo = d.tipo === 'adr' ? 'adr' : 'documento';
    const icono = cfg.ESTADOS[tipo][meta.estado]?.icono ?? '❓';
    const etiquetas = meta.etiquetas.map((e) => `[${e}](#etiqueta-${slugDeEtiqueta(e)})`).join(' · ') || '—';
    return `| [${tituloDe(d)}](${ctx.url(indice, d.ruta)}) | ${meta.version} | ${icono} ${meta.estado} | ${meta.actualizado} | ${etiquetas} |`;
  });
  ponerBloque(
    indice,
    'estado-de-la-documentacion',
    ['| Documento | Versión | Estado | Actualizado | Etiquetas |', '|---|:---:|---|:---:|---|', ...filas].join('\n'),
  );
  const secciones = Object.entries(cfg.ETIQUETAS).map(([clave, nombre]) => {
    const con = documentos.filter((d) => md.leerEncabezado(d.contenido)?.etiquetas.includes(nombre));
    const lista = con.length ? con.map((d) => `[${tituloDe(d)}](${ctx.url(indice, d.ruta)})`).join(' · ') : 'Ningún documento todavía.';
    return `### <a id="etiqueta-${clave}"></a>${nombre}\n\n${lista}`;
  });
  ponerBloque(indice, 'etiquetas', secciones.join('\n\n'));
}

// El número de tarea de una línea del tablero: el del enlace al plan, o el que va en negrita.
function tareaDeLinea(linea) {
  const m = linea.match(/#tarea-(\d{1,2})-(\d{1,2})\)/) || linea.match(/\*\*(\d{1,2})\.(\d{1,2})\*\*/);
  return m ? `${m[1]}.${m[2]}` : null;
}

// Recorre las líneas de tarea del tablero -«- [ ]» y «- [x]»- y devuelve qué tarea es cada una.
// Con `filtro` se queda solo con las que cumplen algo: estar hechas, llevar 🚧, las que sean.
function tareasDelTablero(todo, filtro = () => true) {
  const ids = new Set();
  for (const l of todo.contenido.split('\n')) {
    if (!/^\s*- \[( |x)\]/.test(l) || !filtro(l)) continue;
    const id = tareaDeLinea(l);
    if (id) ids.add(id);
  }
  return ids;
}

function tareasHechas(todo) {
  return tareasDelTablero(todo, (l) => /^\s*- \[x\]/.test(l));
}

function tareasEnProgreso(todo) {
  return tareasDelTablero(todo, (l) => l.includes('🚧'));
}

// 🚧 y ✏️ las pone una persona y la herramienta las respeta: dicen en qué va una tarea, y eso no
// está en el plan. ⏭️, ⚡ y 🔒 salen de las dependencias y se reescriben enteras en cada corrida.
const MARCAS = /^((?:⚡|🔒|✏️|⏭️|🚧)\s*)*/u;

function marcasDeTareas(todo, tareas, hechas) {
  const listas = new Set(plan.listasYa(tareas, hechas).map((t) => t.id));
  const porId = new Map(tareas.map((t) => [t.id, t]));
  todo.contenido = todo.contenido
    .split('\n')
    .map((l) => {
      const m = l.match(/^(\s*- \[( |x)\] )(.*)$/);
      if (!m) return l;
      const ref = m[3].match(/#tarea-(\d)-(\d{1,2})\)/) || m[3].match(/\*\*(\d)\.(\d{1,2})\*\*/);
      if (!ref) return l;
      const id = `${ref[1]}.${ref[2]}`;
      const tarea = porId.get(id);
      if (!tarea) return l;
      const actuales = m[3].match(MARCAS)[0];
      const resto = m[3].slice(actuales.length);
      let marcas = '';
      if (actuales.includes('🚧')) marcas += '🚧';
      if (actuales.includes('✏️')) marcas += '✏️';
      if (tarea.movida) marcas += '⏭️';
      if (m[2] === ' ' && !tarea.movida) marcas += listas.has(id) ? '⚡' : '🔒';
      return `${m[1]}${marcas ? `${marcas} ` : ''}${resto}`;
    })
    .join('\n');
}

// La sección de cada sprint en el tablero: el encabezado o la línea en negrita que empieza por
// «Sprint N ·», la primera si hay dos. Su ancla `sprint-N` va ahí y en ningún otro sitio, porque
// una repetida lleva a la primera, aunque sea la de otro sprint.
function anclasDeSprints(todo) {
  const lineas = todo.contenido.split('\n');
  const enCodigo = md.lineasDeCodigo(lineas);
  const generadas = md.lineasGeneradas(todo.contenido);
  const sprintDeLinea = new Map();
  const conSeccion = new Set();
  lineas.forEach((l, i) => {
    if (enCodigo[i] || generadas[i]) return;
    const sinAnclas = l.replace(/<a id="[^"]*"><\/a>/g, '');
    const encabezado = sinAnclas.match(/^#{2,6}\s+(.*)$/);
    const titulo = encabezado ? encabezado[1] : /^\*\*.*\*\*\s*$/.test(sinAnclas) ? sinAnclas : null;
    const m = titulo && md.textoDeEncabezado(titulo).match(/^(?:\d+(?:\.\d+)*\.?\s+)?Sprint (\d{1,2}) ·/);
    if (!m || conSeccion.has(Number(m[1]))) return;
    conSeccion.add(Number(m[1]));
    sprintDeLinea.set(i, Number(m[1]));
  });
  todo.contenido = lineas
    .map((l, i) => {
      if (enCodigo[i] || generadas[i]) return l;
      const ancla = sprintDeLinea.has(i) ? `<a id="sprint-${sprintDeLinea.get(i)}"></a>` : null;
      const limpia = l.replace(/<a id="sprint-\d{1,2}"><\/a>/g, (a) => (a === ancla ? a : ''));
      if (!ancla || limpia.includes(ancla)) return limpia;
      if (/^#{2,6}\s/.test(limpia)) return limpia.replace(/^(#{2,6}\s+(?:\d+(?:\.\d+)*\.?\s+)?)/, `$1${ancla}`);
      return ancla + limpia;
    })
    .join('\n');
  return conSeccion;
}

function bloquesDelPlan(ctx, errores) {
  const plan08 = ctx.porRuta.get(cfg.DOC_PLAN);
  if (!plan08) return;
  const { tareas, errores: forma, titulos } = plan.leerPlan(plan08.contenido);
  for (const e of forma) errores.push({ ruta: cfg.DOC_PLAN, texto: e });
  const validacion = plan.validarPlan(tareas);
  for (const e of validacion) errores.push({ ruta: cfg.DOC_PLAN, texto: e });
  if (!tareas.length || forma.length || validacion.length) return;

  const enlaceEn = (desde) => (id) => {
    const def = ctx.definiciones.get(`tarea:${id}`);
    return def ? `[${id}](${ctx.url(desde, def.ruta, def.ancla)})` : id;
  };
  // El resumen y el calendario pueden ir en cualquier documento que tenga su marca, como el
  // resumen ejecutivo: los enlaces se escriben desde ese documento.
  const enlaceHitoDesde = (desde) => (n) => {
    const url = ctx.url(desde, cfg.DOC_PLAN, `h${n}`);
    return n === 11 ? `[H11](${url}) · go-live` : `[H${n}](${url}) · Sprint ${n - 1}`;
  };
  const detalleDesde = (desde) =>
    `El detalle está en el [cronograma por carriles](${ctx.url(desde, cfg.DOC_PLAN, '1-cronograma-por-carriles')}).`;
  for (const a of ctx.porRuta.values()) {
    if (!esEspec(a)) continue;
    if (a.contenido.includes('<!-- generado:plan-resumen')) ponerBloque(a, 'plan-resumen', plan.bloqueResumen(tareas, detalleDesde(a)));
    if (a.contenido.includes('<!-- generado:plan-calendario')) {
      ponerBloque(a, 'plan-calendario', plan.bloqueCalendario(tareas, enlaceHitoDesde(a)));
    }
  }
  ponerBloque(plan08, 'plan-grafo', plan.bloqueGrafoDeSprints(tareas, titulos));
  ponerBloque(plan08, 'plan-camino-critico', plan.bloqueCaminoCritico(tareas, enlaceEn(plan08)));
  ponerBloque(
    plan08,
    'plan-dependencias-hacia-adelante',
    plan.bloqueDependenciasHaciaAdelante(tareas, enlaceEn(plan08)),
  );
  ponerBloque(plan08, 'plan-gantt', plan.bloqueGantt(tareas));
  const ultimoSprint = tareas.reduce((max, t) => Math.max(max, Number(t.id.split('.')[0])), 0);
  for (let s = 0; s <= ultimoSprint; s++) ponerBloque(plan08, `plan-oleadas-${s}`, plan.bloqueOleadas(tareas, s, enlaceEn(plan08)));

  const todo = ctx.porRuta.get(cfg.DOC_TAREAS);
  if (!todo) return;
  const hechas = tareasHechas(todo);
  const enProgreso = tareasEnProgreso(todo);
  marcasDeTareas(todo, tareas, hechas);

  // El tablero enumera TODAS las tareas del plan, y ninguna que el plan no tenga. Sin esto, una
  // tarea nueva en el plan puede quedarse fuera del tablero para siempre: nadie la echa de menos,
  // porque el tablero es justo el sitio donde uno iría a buscarla.
  const enElTablero = tareasDelTablero(todo);
  const delPlan = new Set(tareas.map((t) => t.id));
  const faltan = tareas.filter((t) => !enElTablero.has(t.id)).map((t) => t.id);
  const sobran = [...enElTablero].filter((id) => !delPlan.has(id)).sort((a, b) => plan.ordenDeTarea(a) - plan.ordenDeTarea(b));
  if (faltan.length) {
    errores.push({
      ruta: cfg.DOC_TAREAS,
      texto: `no enumera ${faltan.length === 1 ? 'una tarea del plan' : `${faltan.length} tareas del plan`}: ${faltan.join(' · ')}`,
    });
  }
  if (sobran.length) {
    errores.push({
      ruta: cfg.DOC_TAREAS,
      texto: `enumera tareas que el plan no tiene: ${sobran.join(' · ')}. Lo nuevo entra primero al plan`,
    });
  }

  // Cada sprint del tablero lleva a su sección del propio TODO.md; sin ella, al plan.
  const conSeccion = anclasDeSprints(todo);
  const sinSeccion = [...new Set(tareas.map((t) => t.sprintEfectivo))].filter((s) => !conSeccion.has(s)).sort((a, b) => a - b);
  for (const s of sinSeccion) {
    errores.push({
      ruta: cfg.DOC_TAREAS,
      texto: `no tiene sección para el Sprint ${s}: un encabezado o una línea en negrita que empiece por «Sprint ${s} ·»`,
    });
  }
  const enlaceSprint = (n) => `[Sprint ${n}](${ctx.url(todo, conSeccion.has(n) ? cfg.DOC_TAREAS : cfg.DOC_PLAN, `sprint-${n}`)})`;
  ponerBloque(todo, 'plan-tablero', plan.bloqueTablero(tareas, hechas, enProgreso, titulos, enlaceSprint));
  ponerBloque(todo, 'plan-restante', plan.bloqueRestante(tareas, hechas));
  ponerBloque(todo, 'plan-listas-ya', plan.bloqueListasYa(tareas, hechas, enlaceEn(todo)));
}

// ---------------------------------------------------------------------------------------------
// Proceso completo
// ---------------------------------------------------------------------------------------------

function procesar() {
  const archivos = cargarArchivos();
  const errores = [];
  const noResueltos = [];
  let ctx = construirContexto(archivos);
  insertarAnclas(archivos, ctx);
  const definiciones = ctx.definiciones;
  ctx = construirContexto(archivos);
  ctx.definiciones = definiciones;
  for (const a of archivos) normalizarEncabezado(a, ctx);
  for (const a of archivos) enlazarArchivo(a, ctx, noResueltos);
  bloquesDelPlan(ctx, errores);
  bloquesDeReferencias(archivos, ctx);
  bloquesDelIndice(archivos, ctx);
  ctx = construirContexto(archivos);
  ctx.definiciones = definiciones;
  return { archivos, ctx, errores, noResueltos };
}

// ---------------------------------------------------------------------------------------------
// Verificación
// ---------------------------------------------------------------------------------------------

function hoyEnBogota() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: cfg.ZONA_HORARIA }).format(new Date());
}

function fechaValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const d = new Date(`${texto}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
}

function diaSiguiente(texto) {
  const d = new Date(`${texto}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function revisarEncabezados(archivos, errores) {
  const hoy = hoyEnBogota();
  for (const a of archivos) {
    const meta = md.leerEncabezado(a.contenido);
    const error = (texto) => errores.push({ ruta: a.ruta, texto });
    if (!meta) {
      error('no tiene encabezado de metadatos (Versión | Estado | Creado | Actualizado | Etiquetas)');
      continue;
    }
    const version = md.leerSemver(meta.version);
    const tipo = a.tipo === 'adr' ? 'adr' : 'documento';
    const reglaEstado = cfg.ESTADOS[tipo][meta.estado];
    if (!version) error(`la versión «${meta.version}» no es SemVer`);
    if (!reglaEstado) error(`el estado «${meta.estado}» no existe para un ${tipo === 'adr' ? 'ADR' : 'documento'}`);
    if (version && reglaEstado?.versiones === 'cero' && version[0] !== 0) error(`un documento en «${meta.estado}» va en 0.y.z, y está en ${meta.version}`);
    if (version && reglaEstado?.versiones === 'estable' && version[0] === 0) error(`un documento «${meta.estado}» va en 1.0.0 o más, y está en ${meta.version}`);
    if (meta.estado === 'Reemplazado' && tipo === 'adr' && !meta.reemplazadoPor) error('un ADR reemplazado tiene que decir por cuál');
    if (!fechaValida(meta.creado)) error(`la fecha de creación «${meta.creado}» no es AAAA-MM-DD`);
    if (!fechaValida(meta.actualizado)) error(`la fecha de actualización «${meta.actualizado}» no es AAAA-MM-DD`);
    if (fechaValida(meta.creado) && fechaValida(meta.actualizado) && meta.creado > meta.actualizado) error('se actualizó antes de crearse');
    if (fechaValida(meta.actualizado) && meta.actualizado > diaSiguiente(hoy)) error(`la actualización (${meta.actualizado}) está en el futuro`);
    for (const e of meta.etiquetas) if (!slugDeEtiqueta(e)) error(`la etiqueta «${e}» no está en el vocabulario de 22-documentacion.md`);
    if (!esEspec(a) && a.repo.version && esReadme(a)) {
      const real = versionDelCodigo(a);
      if (meta.codigo !== real) error(`la columna Código dice ${meta.codigo} y ${a.repo.version.archivo} dice ${real}`);
    }
    const extra = esEspec(a) ? cfg.VERSIONES_EXTRA[a.ruta] : null;
    if (extra) {
      const real = versionExtra(a);
      if (meta.extras[extra.columna] !== real) error(`la columna ${extra.columna} dice ${meta.extras[extra.columna]} y ${extra.archivo} dice ${real}`);
    }
  }
}

function revisarEnlaces(archivos, ctx, errores) {
  for (const a of archivos) {
    for (const e of md.enlacesDe(a.contenido)) {
      const destino = ctx.resolver(a, e.destino);
      if (!destino) continue;
      const donde = `${a.ruta}:${e.linea + 1}`;
      const existe = ctx.porRuta.has(destino.ruta) || fs.existsSync(path.join(RAIZ, destino.ruta));
      if (!existe) {
        if (!esEspec(a) && e.destino.startsWith(URL_ESPEC) && !fs.existsSync(path.join(RAIZ, 'docs'))) continue;
        errores.push({ ruta: donde, texto: `el enlace a «${e.destino}» apunta a un archivo que no existe` });
        continue;
      }
      if (destino.ancla && ctx.anclas.has(destino.ruta) && !ctx.anclas.get(destino.ruta).has(destino.ancla)) {
        errores.push({ ruta: donde, texto: `el enlace a «${e.destino}» apunta a un ancla que no existe` });
      }
    }
  }
}

function revisarVersionesSubidas(archivos, base, errores) {
  let cambiados;
  try {
    cambiados = execFileSync('git', ['diff', '--name-only', base, '--', '*.md'], { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\n')
      .filter(Boolean);
  } catch {
    errores.push({ ruta: '(git)', texto: `no se pudo comparar contra ${base}` });
    return;
  }
  for (const ruta of cambiados) {
    const a = archivos.find((x) => x.ruta === ruta);
    if (!a) continue;
    let anterior;
    try {
      anterior = execFileSync('git', ['show', `${base}:${ruta}`], { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      continue;
    }
    const antes = md.leerEncabezado(anterior);
    const ahora = md.leerEncabezado(a.contenido);
    if (!antes || !ahora) continue;
    const limpio = (texto, meta) => {
      const lineas = md.sinBloquesGenerados(texto).split('\n');
      return lineas.filter((_, i) => i < meta.lineaCabecera || i > meta.lineaValores).join('\n');
    };
    const mismoEstado = antes.estado === ahora.estado && antes.etiquetas.join() === ahora.etiquetas.join();
    if (limpio(anterior, antes) === limpio(a.contenido, md.leerEncabezado(a.contenido)) && mismoEstado) continue;
    const va = md.leerSemver(antes.version);
    const vn = md.leerSemver(ahora.version);
    if (va && vn && md.compararSemver(vn, va) <= 0) {
      errores.push({ ruta, texto: `cambió el contenido y la versión sigue en ${ahora.version}: súbela según 22-documentacion.md` });
    }
    if (ahora.actualizado < antes.actualizado) errores.push({ ruta, texto: 'la fecha de actualización retrocedió' });
  }
}

// La tabla del 02 §4 dice cuándo entró cada caso de uso. Esta comprobación la cruza con
// el §2 en los dos sentidos, para que un caso de uso nuevo no pueda entrar sin su fila.
const CASOS_DE_USO = 'docs/02-casos-de-uso.md';
const ESTADOS_DE_LA_TRAZA = ['✅', '🚧', '⏭️', '⛔'];

function revisarTrazabilidadDeCasosDeUso(archivos, errores) {
  const a = archivos.find((x) => x.ruta === CASOS_DE_USO);
  if (!a) return;
  const error = (texto) => errores.push({ ruta: CASOS_DE_USO, texto });
  const texto = md.sinBloquesGenerados(a.contenido);
  const detallados = [...texto.matchAll(/^### <a id="(cu-\d{2})"><\/a>/gm)].map((m) => m[1]);
  const seccion = texto.split(/^## 4\. /m)[1];
  if (!seccion) return error('no tiene la sección «4. Cuándo entró cada caso de uso»');
  const filas = seccion
    .split('\n')
    .filter((l) => /^\| \[CU-\d{2}\]/.test(l))
    .map((l) => l.split('|').map((c) => c.trim()));
  if (!filas.length) return error('la tabla del §4 no tiene ninguna fila');
  const conFila = new Set();
  for (const celdas of filas) {
    const [, caso, estado, tareas] = celdas;
    const ancla = caso.match(/\(#(cu-\d{2})\)/)?.[1];
    if (!ancla || !detallados.includes(ancla)) {
      error(`la fila «${caso}» del §4 nombra un caso de uso que no está en el §2`);
      continue;
    }
    conFila.add(ancla);
    if (!ESTADOS_DE_LA_TRAZA.includes(estado)) error(`la fila «${caso}» del §4 lleva el estado «${estado}», que no está en la leyenda`);
    if (estado === '✅' && !/\[\d+\.\d+\]/.test(tareas)) error(`la fila «${caso}» del §4 se declara integrada y no dice con qué tarea entró`);
  }
  for (const cu of detallados) {
    if (!conFila.has(cu)) error(`${cu.toUpperCase()} tiene su flujo en el §2 y no tiene fila en el §4: di cuándo entró`);
  }
}

function imprimir(lista, simbolo) {
  for (const e of lista) console.log(`${simbolo} ${e.ruta}${e.linea ? `:${e.linea}` : ''} · ${e.texto}${e.motivo ? ` (${e.motivo})` : ''}`);
}

function main() {
  const [orden, ...resto] = process.argv.slice(2);
  const base = resto.includes('--base') ? resto[resto.indexOf('--base') + 1] : null;
  if (!['enlazar', 'verificar'].includes(orden)) {
    console.log('Uso: node scripts/docs/documentar.mjs enlazar | verificar [--base SHA]');
    process.exit(2);
  }
  const { archivos, ctx, errores, noResueltos } = procesar();
  const cambiados = archivos.filter((a) => a.contenido !== a.original);

  if (orden === 'enlazar' && resto.includes('--en-seco')) {
    const muestra = Number(resto[resto.indexOf('--en-seco') + 1]) || 3;
    for (const a of cambiados) {
      const antes = a.original.split('\n');
      const despues = a.contenido.split('\n');
      const distintas = despues.map((l, i) => [i, antes[i], l]).filter(([, x, y]) => x !== y);
      console.log(`\n${a.ruta}: ${distintas.length} líneas cambian${antes.length !== despues.length ? ` (de ${antes.length} a ${despues.length} líneas)` : ''}`);
      for (const [i, x, y] of distintas.slice(0, muestra)) console.log(`  ${i + 1}- ${x}\n  ${i + 1}+ ${y}`);
    }
    imprimir(errores, '✗');
    imprimir(noResueltos, '·');
    process.exit(0);
  }

  if (orden === 'enlazar') {
    for (const a of cambiados) fs.writeFileSync(path.join(RAIZ, a.ruta), a.contenido);
    console.log(`${cambiados.length} de ${archivos.length} archivos actualizados.`);
    for (const a of cambiados) console.log(`  ${a.ruta}`);
    imprimir(errores, '✗');
    if (noResueltos.length) {
      console.log(`\n${noResueltos.length} referencias sin destino:`);
      imprimir(noResueltos, '·');
    }
    process.exit(errores.length ? 1 : 0);
  }

  revisarEncabezados(archivos, errores);
  revisarEnlaces(archivos, ctx, errores);
  revisarTrazabilidadDeCasosDeUso(archivos, errores);
  for (const a of cambiados) {
    errores.push({ ruta: a.ruta, texto: 'faltan anclas, enlaces o bloques generados: corre `node scripts/docs/documentar.mjs enlazar`' });
  }
  for (const n of noResueltos) {
    const archivo = archivos.find((a) => a.ruta === n.ruta);
    const reemplazado = archivo?.tipo === 'adr' && md.leerEncabezado(archivo.contenido)?.estado === 'Reemplazado';
    if (!reemplazado) errores.push({ ruta: n.ruta, linea: n.linea, texto: `«${n.texto}» no lleva a ningún sitio`, motivo: n.motivo });
  }
  if (base && !/^0+$/.test(base)) {
    revisarVersionesSubidas(archivos, base, errores);
  }
  if (errores.length) {
    imprimir(errores, '✗');
    console.log(`\n${errores.length} problemas en la documentación.`);
    process.exit(1);
  }
  console.log(`✓ ${archivos.length} documentos: encabezados, enlaces y referencias en orden.`);
}

main();
