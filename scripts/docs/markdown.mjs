// Lectura y escritura de Markdown para la documentación de Emprende: anclas como las calcula GitHub,
// separación de lo que no se toca (código, enlaces, HTML), encabezados de metadatos y bloques
// generados. Sin dependencias: corre con Node tal cual.

import path from 'node:path';

// ---------------------------------------------------------------------------------------------
// Anclas
// ---------------------------------------------------------------------------------------------

// El mismo algoritmo de github-slugger: minúsculas, fuera todo lo que no sea letra, marca, número,
// guion bajo, guion o espacio, y los espacios pasan a guiones.
export function slug(texto) {
  return texto
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}

// El texto que GitHub ve en un encabezado: sin HTML, sin marcas de énfasis ni de código, y los
// enlaces reducidos a su texto.
export function textoDeEncabezado(md) {
  return md
    .replace(/<[^>]*>/g, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/(^|\s)_([^_]+)_(?=\s|$)/g, '$1$2')
    .trim();
}

const FENCE = /^\s{0,3}(`{3,}|~{3,})/;

// Recorre las líneas y marca las que están dentro de un bloque de código cercado.
export function lineasDeCodigo(lineas) {
  const enCodigo = new Array(lineas.length).fill(false);
  let cerca = null;
  lineas.forEach((linea, i) => {
    const m = linea.match(FENCE);
    if (cerca) {
      enCodigo[i] = true;
      if (m && m[1][0] === cerca[0] && m[1].length >= cerca.length) cerca = null;
    } else if (m) {
      enCodigo[i] = true;
      cerca = m[1];
    }
  });
  return enCodigo;
}

export function encabezados(lineas) {
  const enCodigo = lineasDeCodigo(lineas);
  const vistos = new Map();
  const lista = [];
  lineas.forEach((linea, i) => {
    if (enCodigo[i]) return;
    const m = linea.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (!m) return;
    const texto = textoDeEncabezado(m[2]);
    let base = slug(texto);
    let final = base;
    if (vistos.has(base)) {
      let n = vistos.get(base);
      do {
        n++;
        final = `${base}-${n}`;
      } while (vistos.has(final));
      vistos.set(base, n);
    }
    vistos.set(final, vistos.get(final) ?? 0);
    const seccion = texto.match(/^(\d+(?:\.\d+)*)\.?\s/);
    lista.push({ linea: i, nivel: m[1].length, crudo: m[2], texto, slug: final, seccion: seccion ? seccion[1] : null });
  });
  return lista;
}

export function anclasExplicitas(contenido) {
  const anclas = new Set();
  for (const m of contenido.matchAll(/<a\s+(?:id|name)="([^"]+)"/g)) anclas.add(m[1]);
  return anclas;
}

export function anclasDe(contenido) {
  const lineas = contenido.split('\n');
  const anclas = anclasExplicitas(contenido);
  for (const e of encabezados(lineas)) anclas.add(e.slug);
  return anclas;
}

// «7.2» → el slug del encabezado «### 7.2 …». Si un número se repite, gana el primero.
export function seccionesDe(contenido) {
  const mapa = new Map();
  for (const e of encabezados(contenido.split('\n'))) {
    if (e.seccion && !mapa.has(e.seccion)) mapa.set(e.seccion, e.slug);
  }
  return mapa;
}

// ---------------------------------------------------------------------------------------------
// Separar una línea en trozos: lo que se puede enlazar y lo que no se toca
// ---------------------------------------------------------------------------------------------

function cerrarCorchete(linea, i) {
  let profundidad = 0;
  for (let j = i; j < linea.length; j++) {
    const c = linea[j];
    if (c === '\\') {
      j++;
      continue;
    }
    if (c === '`') {
      let n = 0;
      while (linea[j + n] === '`') n++;
      const cierre = linea.indexOf('`'.repeat(n), j + n);
      j = cierre === -1 ? j + n - 1 : cierre + n - 1;
      continue;
    }
    if (c === '[') profundidad++;
    else if (c === ']') {
      profundidad--;
      if (profundidad === 0) return j;
    }
  }
  return -1;
}

function cerrarParentesis(linea, i) {
  let profundidad = 0;
  for (let j = i; j < linea.length; j++) {
    const c = linea[j];
    if (c === '\\') {
      j++;
      continue;
    }
    if (c === '(') profundidad++;
    else if (c === ')') {
      profundidad--;
      if (profundidad === 0) return j;
    }
  }
  return -1;
}

// Tipos: texto, codigo, enlace (con .destino y .etiqueta), html, url.
export function tokenizar(linea) {
  const tokens = [];
  let texto = '';
  const soltarTexto = () => {
    if (texto) tokens.push({ tipo: 'texto', valor: texto });
    texto = '';
  };
  let i = 0;
  while (i < linea.length) {
    const c = linea[i];
    if (c === '\\') {
      texto += linea.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (c === '`') {
      let n = 0;
      while (linea[i + n] === '`') n++;
      const marca = '`'.repeat(n);
      let j = i + n;
      let cierre = -1;
      while ((j = linea.indexOf(marca, j)) !== -1) {
        if (linea[j - 1] !== '`' && linea[j + n] !== '`') {
          cierre = j;
          break;
        }
        j++;
      }
      if (cierre !== -1) {
        soltarTexto();
        tokens.push({ tipo: 'codigo', valor: linea.slice(i, cierre + n) });
        i = cierre + n;
        continue;
      }
      texto += marca;
      i += n;
      continue;
    }
    if (c === '[' || (c === '!' && linea[i + 1] === '[')) {
      const inicio = c === '!' ? i + 1 : i;
      const j = cerrarCorchete(linea, inicio);
      if (j !== -1 && linea[j + 1] === '(') {
        const k = cerrarParentesis(linea, j + 1);
        if (k !== -1) {
          soltarTexto();
          tokens.push({
            tipo: 'enlace',
            valor: linea.slice(i, k + 1),
            etiqueta: linea.slice(inicio + 1, j),
            destino: linea.slice(j + 2, k).trim().split(/\s+/)[0],
            imagen: c === '!',
          });
          i = k + 1;
          continue;
        }
      }
      if (j !== -1 && linea[j + 1] === '[') {
        const k = linea.indexOf(']', j + 2);
        if (k !== -1) {
          soltarTexto();
          tokens.push({ tipo: 'html', valor: linea.slice(i, k + 1) });
          i = k + 1;
          continue;
        }
      }
    }
    if (c === '<') {
      const resto = linea.slice(i);
      const m =
        resto.match(/^<!--.*?-->/) ||
        resto.match(/^<code>.*?<\/code>/) ||
        resto.match(/^<https?:[^>]+>/) ||
        resto.match(/^<\/?[a-zA-Z][^>]*>/);
      if (m) {
        soltarTexto();
        tokens.push({ tipo: 'html', valor: m[0] });
        i += m[0].length;
        continue;
      }
    }
    if (c === 'h' && /^https?:\/\//.test(linea.slice(i, i + 8))) {
      const m = linea.slice(i).match(/^https?:\/\/[^\s)>\]|]+/);
      soltarTexto();
      tokens.push({ tipo: 'url', valor: m[0] });
      i += m[0].length;
      continue;
    }
    texto += c;
    i++;
  }
  soltarTexto();
  return tokens;
}

export function unir(tokens) {
  return tokens.map((t) => t.valor).join('');
}

// Todos los enlaces Markdown de un texto, con su línea.
export function enlacesDe(contenido) {
  const lineas = contenido.split('\n');
  const enCodigo = lineasDeCodigo(lineas);
  const enlaces = [];
  lineas.forEach((linea, i) => {
    if (enCodigo[i]) return;
    for (const t of tokenizar(linea)) {
      if (t.tipo === 'enlace') enlaces.push({ linea: i, destino: t.destino, etiqueta: t.etiqueta });
    }
  });
  return enlaces;
}

// ---------------------------------------------------------------------------------------------
// Rutas
// ---------------------------------------------------------------------------------------------

export function rutaRelativa(desde, hacia) {
  const relativa = path.posix.relative(path.posix.dirname(desde), hacia);
  return relativa === '' ? path.posix.basename(hacia) : relativa;
}

// ---------------------------------------------------------------------------------------------
// Versiones
// ---------------------------------------------------------------------------------------------

export function leerSemver(texto) {
  const m = String(texto).match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

export function compararSemver(a, b) {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

// ---------------------------------------------------------------------------------------------
// Encabezado de metadatos
// ---------------------------------------------------------------------------------------------

const CABECERA = /^\|\s*Versión\s*\|\s*Estado\s*\|\s*Creado\s*\|\s*Actualizado\s*\|/;

export function lineaDelTitulo(lineas) {
  const enCodigo = lineasDeCodigo(lineas);
  return lineas.findIndex((l, i) => !enCodigo[i] && /^#\s+\S/.test(l));
}

function celdas(fila) {
  const partes = [];
  let actual = '';
  let profundidad = 0;
  for (const c of fila.trim().replace(/^\|/, '').replace(/\|$/, '')) {
    if (c === '[' || c === '(') profundidad++;
    if (c === ']' || c === ')') profundidad = Math.max(0, profundidad - 1);
    if (c === '|' && profundidad === 0) {
      partes.push(actual.trim());
      actual = '';
    } else actual += c;
  }
  partes.push(actual.trim());
  return partes;
}

// Devuelve null si el archivo no tiene encabezado.
export function leerEncabezado(contenido) {
  const lineas = contenido.split('\n');
  const titulo = lineaDelTitulo(lineas);
  if (titulo === -1) return null;
  for (let i = titulo + 1; i < Math.min(lineas.length, titulo + 8); i++) {
    if (!CABECERA.test(lineas[i])) continue;
    const nombres = celdas(lineas[i]);
    const valores = celdas(lineas[i + 2] ?? '');
    const campo = (nombre) => valores[nombres.indexOf(nombre)] ?? '';
    const estadoCelda = campo('Estado');
    const estado = (estadoCelda.match(/\[([^\]]+)\]/)?.[1] ?? estadoCelda).replace(/^\S+\s/, '').trim();
    const reemplazo = estadoCelda.match(/por \[(ADR-\d{3})\]/)?.[1] ?? null;
    return {
      lineaCabecera: i,
      lineaValores: i + 2,
      columnas: nombres,
      version: campo('Versión').match(/\d+\.\d+\.\d+/)?.[0] ?? campo('Versión'),
      estado,
      reemplazadoPor: reemplazo,
      creado: campo('Creado'),
      actualizado: campo('Actualizado'),
      codigo: nombres.includes('Código') ? campo('Código').match(/\d+\.\d+\.\d+/)?.[0] ?? null : undefined,
      extras: Object.fromEntries(
        nombres
          .filter((n) => !['Versión', 'Estado', 'Creado', 'Actualizado', 'Etiquetas'].includes(n))
          .map((n) => [n, campo(n).match(/\d+\.\d+\.\d+/)?.[0] ?? null]),
      ),
      etiquetas: [...campo('Etiquetas').matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]),
      celdas: { version: campo('Versión'), estado: estadoCelda, etiquetas: campo('Etiquetas') },
    };
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Bloques generados
// ---------------------------------------------------------------------------------------------

export function marcaDeInicio(nombre) {
  return `<!-- generado:${nombre} · no editar a mano: lo escribe scripts/docs/documentar.mjs -->`;
}

export function marcaDeFin(nombre) {
  return `<!-- /generado:${nombre} -->`;
}

export function bloquesGenerados(contenido) {
  const bloques = [];
  const re = /<!-- generado:([a-z0-9-]+)[^>]*-->[\s\S]*?<!-- \/generado:\1 -->/g;
  for (const m of contenido.matchAll(re)) bloques.push({ nombre: m[1], inicio: m.index, fin: m.index + m[0].length });
  return bloques;
}

export function reemplazarBloque(contenido, nombre, cuerpo) {
  const re = new RegExp(`<!-- generado:${nombre}[^>]*-->[\\s\\S]*?<!-- /generado:${nombre} -->`);
  const nuevo = `${marcaDeInicio(nombre)}\n${cuerpo.trim()}\n${marcaDeFin(nombre)}`;
  if (!re.test(contenido)) return null;
  return contenido.replace(re, () => nuevo);
}

export function sinBloquesGenerados(contenido) {
  return contenido.replace(/<!-- generado:([a-z0-9-]+)[^>]*-->[\s\S]*?<!-- \/generado:\1 -->/g, '');
}

// Líneas que pertenecen a bloques generados.
export function lineasGeneradas(contenido) {
  const lineas = contenido.split('\n');
  const marcadas = new Array(lineas.length).fill(false);
  let dentro = null;
  lineas.forEach((l, i) => {
    const inicio = l.match(/<!-- generado:([a-z0-9-]+)/);
    if (!dentro && inicio) dentro = inicio[1];
    if (dentro) marcadas[i] = true;
    if (dentro && l.includes(`<!-- /generado:${dentro} -->`)) dentro = null;
  });
  return marcadas;
}

// Español: 1,5 y no 1.5.
export function decimal(n, digitos = 1) {
  return n.toFixed(digitos).replace('.', ',');
}
