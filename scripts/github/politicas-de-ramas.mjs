#!/usr/bin/env node
// Las politicas de rama de los cuatro repositorios de PRISMA, puestas desde un solo sitio.
//
//   node scripts/github/politicas-de-ramas.mjs mostrar     imprime lo que se le pediria a GitHub
//   node scripts/github/politicas-de-ramas.mjs verificar   compara con lo que hay, sin escribir
//   node scripts/github/politicas-de-ramas.mjs aplicar     crea o corrige lo que falte
//   node scripts/github/politicas-de-ramas.mjs aplicar --en-seco   dice que haria, sin hacerlo
//
// Cualquiera de las tres acepta el nombre de un repositorio al final, para trabajar solo en ese.
// La decision esta en docs/adr/ADR-048-las-ramas-principales-las-protege-github.md y en ADR-062, y
// lo que hace falta para correrlo, en scripts/github/README.md.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DUENO = 'Juanchope039';
const DEF = JSON.parse(fs.readFileSync(path.join(AQUI, 'politicas-de-ramas.json'), 'utf8'));

// ---------------------------------------------------------------------------------------------
// Las reglas que pide cada conjunto
// ---------------------------------------------------------------------------------------------

/** Entrar solo por PR. Sin revisiones obligatorias: una sola persona no aprueba su propio PR. */
function pullRequest(extra = {}) {
  return {
    type: 'pull_request',
    parameters: {
      required_approving_review_count: 0,
      dismiss_stale_reviews_on_push: false,
      require_code_owner_review: false,
      require_last_push_approval: false,
      required_review_thread_resolution: false,
      ...extra,
    },
  };
}

/** Los checks que tienen que estar en verde, y la app que los reporta: solo GitHub Actions. */
function checksExigidos(contextos) {
  return {
    type: 'required_status_checks',
    parameters: {
      strict_required_status_checks_policy: false,
      required_status_checks: contextos.map((c) => ({ context: c, integration_id: DEF.puertas.integracion })),
    },
  };
}

/** La puerta de la tuberia y, si el repositorio la lleva, la del proyecto del tablero (ADR-062). */
function puertasDe(repo, tuberia) {
  return repo['pr-en-el-proyecto'] ? [tuberia, DEF.puertas.proyecto] : [tuberia];
}

const REGLAS = {
  'sin-borrar': () => [{ type: 'deletion' }],
  'tuberia-completa': (repo) => [pullRequest(), checksExigidos(puertasDe(repo, DEF.puertas.completa))],
  // Las etapas se promueven solo con merge commit: squash y rebase reescriben la historia (ADR-061).
  'tuberia-en-verde': (repo) => [
    pullRequest({ allowed_merge_methods: ['merge'] }),
    checksExigidos(puertasDe(repo, DEF.puertas['en-verde'])),
  ],
};

/** Los conjuntos que le toca a un repositorio: los que tienen al menos una rama. */
function conjuntosDe(repo) {
  return DEF.conjuntos
    .filter((c) => (repo.ramas[c.clave] ?? []).length > 0)
    .map((c) => ({
      conjunto: c,
      cuerpo: {
        name: c.nombre,
        target: 'branch',
        enforcement: 'active',
        bypass_actors: [],
        conditions: { ref_name: { include: repo.ramas[c.clave].map((r) => `refs/heads/${r}`), exclude: [] } },
        rules: REGLAS[c.clave](repo),
      },
    }));
}

// ---------------------------------------------------------------------------------------------
// GitHub
// ---------------------------------------------------------------------------------------------

/** Llama a `gh api`. Devuelve `{ ok, datos }` o `{ ok: false, mensaje }` ya traducido. */
function gh(ruta, { metodo = 'GET', cuerpo = null } = {}) {
  const completos = ['api', '-H', 'Accept: application/vnd.github+json'];
  if (metodo !== 'GET') completos.push('-X', metodo);
  completos.push(ruta);
  if (cuerpo) completos.push('--input', '-');
  try {
    const salida = execFileSync('gh', completos, {
      encoding: 'utf8',
      input: cuerpo ? JSON.stringify(cuerpo) : undefined,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { ok: true, datos: salida.trim() ? JSON.parse(salida) : null };
  } catch (e) {
    return { ok: false, mensaje: traducir(`${e.stdout ?? ''}${e.stderr ?? ''}`) };
  }
}

/** Los dos rechazos que se esperan, dichos con lo que hay que hacer para levantarlos. */
function traducir(bruto) {
  const texto = bruto.replace(/\s+/g, ' ').trim();
  if (/Upgrade to GitHub Pro/i.test(texto)) {
    return 'el plan Free no tiene reglas de rama en un repositorio privado: o se hace publico, o la cuenta pasa a GitHub Pro';
  }
  if (/not accessible by integration|not permitted through this proxy|Must have admin rights/i.test(texto)) {
    return 'el token no administra este repositorio: hace falta uno del dueno con permiso de administracion';
  }
  if (/Not Found/i.test(texto)) return 'no se encuentra, o el token no lo ve';
  return texto || 'sin mensaje';
}

// ---------------------------------------------------------------------------------------------
// Comparar
// ---------------------------------------------------------------------------------------------

/** Si `puesto` cumple lo que pide `pedido`: se miran las claves de la definicion y nada mas. */
function cumple(pedido, puesto) {
  if (Array.isArray(pedido)) {
    return Array.isArray(puesto) && pedido.length === puesto.length && pedido.every((v, i) => cumple(v, puesto[i]));
  }
  if (pedido && typeof pedido === 'object') {
    return puesto && typeof puesto === 'object' && Object.entries(pedido).every(([k, v]) => cumple(v, puesto[k]));
  }
  return pedido === puesto;
}

/** Que le falta a un ruleset que ya existe para ser el que pide la definicion. */
function diferencias(cuerpo, puesto) {
  const faltas = [];
  if (puesto.enforcement !== cuerpo.enforcement) faltas.push(`no esta activo, esta «${puesto.enforcement}»`);

  const pedidas = cuerpo.conditions.ref_name.include;
  const presentes = puesto.conditions?.ref_name?.include ?? [];
  for (const rama of pedidas.filter((r) => !presentes.includes(r))) faltas.push(`no cubre ${rama}`);
  for (const rama of presentes.filter((r) => !pedidas.includes(r))) faltas.push(`cubre ${rama}, que no esta en la definicion`);

  for (const regla of cuerpo.rules) {
    const igual = (puesto.rules ?? []).find((r) => r.type === regla.type);
    if (!igual) faltas.push(`sin la regla ${regla.type}`);
    else if (!cumple(regla.parameters ?? {}, igual.parameters ?? {})) faltas.push(`la regla ${regla.type} esta con otros parametros`);
  }
  if ((puesto.bypass_actors ?? []).length) faltas.push(`${puesto.bypass_actors.length} actores con excusa`);
  return faltas;
}

// ---------------------------------------------------------------------------------------------
// Las tres ordenes
// ---------------------------------------------------------------------------------------------

function repositorios(filtro) {
  const todos = DEF.repositorios;
  if (!filtro) return todos;
  const uno = todos.filter((r) => r.nombre.toLowerCase() === filtro.toLowerCase());
  if (!uno.length) {
    console.log(`✗ «${filtro}» no esta en politicas-de-ramas.json. Hay: ${todos.map((r) => r.nombre).join(', ')}`);
    process.exit(2);
  }
  return uno;
}

function mostrar(filtro) {
  for (const repo of repositorios(filtro)) {
    console.log(`\n# ${repo.nombre} — ${repo.proyecto}, ${repo.visibilidad}`);
    for (const { conjunto, cuerpo } of conjuntosDe(repo)) {
      console.log(`\n## ${conjunto.nombre}\n# ${conjunto.porque}`);
      console.log(JSON.stringify(cuerpo, null, 2));
    }
  }
}

/** Lo que hay en GitHub, por nombre de ruleset, con sus reglas adentro. */
function puestosEn(nombre) {
  const lista = gh(`/repos/${DUENO}/${nombre}/rulesets`);
  if (!lista.ok) return lista;
  const puestos = new Map();
  for (const r of lista.datos ?? []) {
    const detalle = gh(`/repos/${DUENO}/${nombre}/rulesets/${r.id}`);
    if (!detalle.ok) return detalle;
    puestos.set(r.name, detalle.datos);
  }
  return { ok: true, puestos };
}

function revisar(filtro) {
  const informe = [];
  for (const repo of repositorios(filtro)) {
    const leido = puestosEn(repo.nombre);
    if (!leido.ok) {
      informe.push({ repo, error: leido.mensaje });
      continue;
    }
    for (const { conjunto, cuerpo } of conjuntosDe(repo)) {
      const puesto = leido.puestos.get(conjunto.nombre);
      if (!puesto) informe.push({ repo, conjunto, cuerpo, estado: 'falta' });
      else {
        const faltas = diferencias(cuerpo, puesto);
        informe.push({ repo, conjunto, cuerpo, puesto, faltas, estado: faltas.length ? 'difiere' : 'puesto' });
      }
    }
    const sobran = [...leido.puestos.keys()].filter((n) => !DEF.conjuntos.some((c) => c.nombre === n));
    for (const nombre of sobran) informe.push({ repo, estado: 'sobra', nombre });
  }
  return informe;
}

function imprimir(informe) {
  let repo = null;
  for (const fila of informe) {
    if (fila.repo.nombre !== repo) console.log(`\n${(repo = fila.repo.nombre)}`);
    if (fila.error) console.log(`  ✗ no se pudieron leer las reglas: ${fila.error}`);
    else if (fila.estado === 'puesto') console.log(`  ✓ ${fila.conjunto.nombre}`);
    else if (fila.estado === 'falta') console.log(`  · falta: ${fila.conjunto.nombre}`);
    else if (fila.estado === 'difiere') console.log(`  ✗ ${fila.conjunto.nombre}: ${fila.faltas.join('; ')}`);
    else if (fila.estado === 'sobra') console.log(`  · sobra, y no se toca: «${fila.nombre}»`);
  }
}

function aplicar(filtro, enSeco) {
  const informe = revisar(filtro);
  imprimir(informe);
  let escritos = 0;
  let fallidos = informe.filter((f) => f.error).length;

  for (const fila of informe.filter((f) => f.estado === 'falta' || f.estado === 'difiere')) {
    const ruta = `/repos/${DUENO}/${fila.repo.nombre}/rulesets${fila.puesto ? `/${fila.puesto.id}` : ''}`;
    const metodo = fila.puesto ? 'PUT' : 'POST';
    if (enSeco) {
      console.log(`\n${metodo} ${ruta}\n${JSON.stringify(fila.cuerpo, null, 2)}`);
      continue;
    }
    const hecho = gh(ruta, { metodo, cuerpo: fila.cuerpo });
    if (hecho.ok) {
      escritos += 1;
      console.log(`\n✓ ${fila.repo.nombre}: ${fila.conjunto.nombre}`);
    } else {
      fallidos += 1;
      console.log(`\n✗ ${fila.repo.nombre}: ${fila.conjunto.nombre} — ${hecho.mensaje}`);
    }
  }
  if (!enSeco) console.log(`\n${escritos} conjuntos escritos, ${fallidos} sin escribir.`);
  return fallidos ? 1 : 0;
}

function main() {
  const [orden, ...resto] = process.argv.slice(2);
  const enSeco = resto.includes('--en-seco');
  const filtro = resto.find((a) => !a.startsWith('--')) ?? null;

  if (orden === 'mostrar') {
    mostrar(filtro);
    process.exit(0);
  }
  if (orden === 'verificar') {
    const informe = revisar(filtro);
    imprimir(informe);
    const mal = informe.filter((f) => f.error || f.estado === 'falta' || f.estado === 'difiere');
    console.log(`\n${mal.length ? `${mal.length} cosas por poner.` : '✓ las politicas de rama estan puestas.'}`);
    process.exit(mal.length ? 1 : 0);
  }
  if (orden === 'aplicar') process.exit(aplicar(filtro, enSeco));

  console.log('Uso: node scripts/github/politicas-de-ramas.mjs mostrar | verificar | aplicar [--en-seco] [repositorio]');
  process.exit(2);
}

main();
