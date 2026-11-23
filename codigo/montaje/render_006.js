// Episodio 006 — Altamira. Anima las escenas y exporta el vídeo vertical 1080x1920 a 30 fps.
// Uso:
//   node render_001.js video  <salida.mp4>          → vídeo completo con audio
//   node render_001.js fotos  <carpeta> 3.2 12 ...  → fotogramas sueltos para revisar
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('playwright');
const B = path.join(__dirname, '..');
const { teoFrente } = require(B + '/personajes/teo');
const { tinta } = require(B + '/personajes/tinta');
const { luciaFrente } = require(B + '/personajes/lucia');
const { teoPerfil, luciaPerfil } = require(B + '/personajes/perfiles');
const S = require(B + '/personajes/secundarios');
const O = require(B + '/objetos/objetos');
const F = n => require(B + '/fondos/' + n);
const A = require(B + '/personajes/altamira');
const { figura } = require(B + '/personajes/figura');
const archivo = F('f09_archivo');
const LT = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/linea_tiempo_006.json')));
const BOCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/boca_006.json'))).boca;
const FPS = 30, W = 1080, H = 1920;

// --- utilidades SVG ---
let cont = 0;
// Cada SVG incrustado recibe ids únicos para que sus degradados no choquen con los de otros.
function aislar(svg) {
  const p = 'i' + (cont++) + '_';
  return svg.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`);
}
const interior = s => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const vb = s => s.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
// Coloca un SVG en (x, y) con escala; id opcional para animarlo.
function capa(svg, x = 0, y = 0, esc = 1, id = '', quien = '') {
  const [w, h] = vb(svg);
  return `<g ${id ? `id="${id}"` : ''} ${quien ? `data-quien="${quien}"` : ''}><svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${interior(aislar(svg))}</svg></g>`;
}
const fondo = (svg) => interior(aislar(svg));
const luzRoja = (id, x, y, r) => `<g id="${id}"><circle cx="${x}" cy="${y}" r="${r * 4}" fill="url(#hRojoG)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FF5040"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#FFD0C0"/></g>`;
const rotulo = (id, txt, y = 250) => `<g id="${id}" opacity="0"><rect x="${540 - txt.length * 19 - 30}" y="${y - 58}" width="${txt.length * 38 + 60}" height="84" rx="6" fill="#0B0E13" opacity="0.8"/>
  <text x="540" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="54" fill="#F2E6CF" letter-spacing="2">${txt}</text></g>`;

// --- tiempos clave ---
const T = LT.clave;
const archivoSinMesa = archivo({ conMesa: false }), mesa = () => `<g>${aislar(archivo.mesa())}</g>`;
const prado = () => F('006/h01_prado')(), cueva = () => F('006/h02_cueva')(), congreso = () => F('006/h03_congreso')(), techo = () => F('006/h02_cueva').techo();
const etiqueta = (id, txt, x, y) => `<g id="${id}" opacity="0"><rect x="${x - txt.length * 17 - 24}" y="${y - 50}" width="${txt.length * 34 + 48}" height="72" rx="6" fill="#0B0E13" opacity="0.85"/>
  <text x="${x}" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="46" fill="#F2E6CF">${txt}</text></g>`;
const sombra = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.16}" fill="#000" opacity="0.35"/>`;
const sello = (id, txt, x, y, rot) => `<g id="${id}" opacity="0" transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-txt.length * 26 - 30}" y="-58" width="${txt.length * 52 + 60}" height="116" rx="10" fill="#F2E6CF" opacity="0.9"/>
  <rect x="${-txt.length * 26 - 30}" y="-58" width="${txt.length * 52 + 60}" height="116" rx="10" fill="none" stroke="#C0392B" stroke-width="12"/>
  <text x="0" y="24" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="76" fill="#C0392B">${txt}</text></g>`;
const rotuloCanal = id => `<g id="${id}" opacity="0" transform="translate(540 300)">
  <rect x="-300" y="-112" width="600" height="86" rx="8" fill="#0B0E13" opacity="0.55" transform="rotate(-2)"/>
  <rect x="-300" y="-112" width="600" height="86" rx="8" fill="none" stroke="#C0392B" stroke-width="8" transform="rotate(-2)"/>
  <text x="0" y="-50" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="62" letter-spacing="12" fill="#E0503E" transform="rotate(-2)">EXPEDIENTE</text>
  <text x="0" y="130" text-anchor="middle" font-family="Inter" font-weight="900" font-size="200" fill="#F2B35A" stroke="#0B0E13" stroke-width="14" paint-order="stroke">VELA</text></g>`;


// Persona de pie con los pies en (fx, fy) y escala s (caja 400x760; pies en y≈712).
const pie = (svg, fx, fy, s, id = '', quien = '') => `${sombra(fx, fy, 70 * s / 0.5)}${capa(svg, fx - 200 * s, fy - 712 * s, s, id, quien)}`;
// Primer instante en que suena una palabra (a partir de un tiempo dado).
const PAL = (txt, desde = 0) => { const w = LT.subtitulos.find(w => w.ini >= desde && w.p.toLowerCase().replace(/[^a-záéíóúñ0-9]/g, '').startsWith(txt)); if (!w) throw new Error('falta ' + txt); return w.ini; };
Object.assign(T, { padre: PAL('padre'), verano: PAL('verano'), marcelino: PAL('marcelino'), mil1902: PAL('novecientos', 56), mea: PAL('mea', 56), cartailhac: PAL('cartailhac', 56) });
const cuevaTecho = (id, oscuro = true) => `${fondo(cueva())}<rect id="${id}os" x="0" y="0" width="1080" height="900" fill="#0B0E13" opacity="${oscuro ? 0.6 : 0}"/><g id="${id}tec" opacity="${oscuro ? 0 : 1}">${fondo(techo())}</g>`;
const marcelino = (v, fx, fy, s, id = '') => pie(A.marcelino[v](), fx, fy, s, id);

const ESCENAS = {
  e01: `<g id="e01zoom">${cuevaTecho('e01')}</g>${sello('e01sello', '¿FALSO?', 540, 1080, -8)}`,
  e02: `<g id="e02zoom">${fondo(prado())}<g id="e02teo">${pie(teoFrente({ cara: 'chulo' }), 560, 1760, 0.55, '', 'teo')}${capa(tinta({ pose: 'tranquilo' }), 560 - 110 + 122, 1760 - 392 + 55, 0.19)}</g></g>${rotuloCanal('e02rot')}`,
  e03: `<g id="e03zoom">${fondo(prado())}${sombra(300, 1268, 40)}${capa(A.perro(), 300 - 130 * 0.2, 1268 - 290 * 0.2, 0.2)}${pie(A.cazador(), 470, 1420, 0.26)}</g>${etiqueta('e03rot', 'SANTILLANA DEL MAR · 1868', 540, 260)}`,
  e04: `<g id="e04zoom">${cuevaTecho('e04')}${marcelino('suelo', 400, 1660, 0.9)}<g id="e04maria" opacity="0">${pie(A.maria.normal(), 760, 1690, 0.58)}</g></g>
    ${etiqueta('e04rot', 'MARCELINO SANZ DE SAUTUOLA', 540, 260)}${etiqueta('e04rot2', 'VERANO DE 1879', 540, 260)}`,
  e05: `<g id="e05zoom">${cuevaTecho('e05')}<g id="e05m1">${marcelino('suelo', 400, 1660, 0.9)}</g><g id="e05m2" style="display:none">${marcelino('arriba', 400, 1660, 0.9)}</g>
    <g id="e05a">${pie(A.maria.normal('serio'), 760, 1690, 0.58)}</g><g id="e05b" style="display:none">${pie(A.maria.senala(), 760, 1690, 0.58)}</g></g>${etiqueta('e05rot', '«¡MIRA, PAPÁ, BUEYES!»', 540, 260)}`,
  e06: `<g id="e06zoom">${cuevaTecho('e06', false)}${sombra(540, 1640, 70)}<g id="e06a">${capa(tinta({ pose: 'tranquilo' }), 430, 1420, 0.5)}</g><g id="e06b" style="display:none">${capa(tinta({ pose: 'susto' }), 430, 1420, 0.5)}</g></g>`,
  e07: `${fondo(archivoSinMesa)}<g id="e07lucia"><g id="e07F">${capa(luciaFrente({ cara: 'sorpresa' }), 290, 760, 1.25, '', 'lucia')}</g>
      <g id="e07P" style="display:none">${capa(luciaPerfil(), 290, 760, 1.25, '', 'lucia')}</g></g>${mesa()}${etiqueta('e07rot', 'BISONTES', 540, 260)}`,
  e08: `<g id="e08zoom">${fondo(congreso())}${pie(A.academico(false), 340, 1172, 0.5)}${pie(A.academico(true), 820, 1176, 0.5)}</g>${etiqueta('e08rot', 'PUBLICADO EN 1880', 540, 260)}${sello('e08sello', 'FALSO', 540, 560, -10)}`,
  e09: `${fondo(archivoSinMesa)}${capa(luciaFrente({ cara: 'leyendo' }), 290, 760, 1.25, '', 'lucia')}${mesa()}
    ${etiqueta('e09rot', '1902 · ÉMILE CARTAILHAC', 540, 260)}${etiqueta('e09rot2', '«MEA CULPA DE UN ESCÉPTICO»', 540, 360)}`,
  e10: `<g id="e10zoom">${cuevaTecho('e10', false)}${marcelino('arriba', 400, 1660, 0.9)}${pie(A.maria.senala(), 760, 1690, 0.58)}</g>
    ${etiqueta('e10r0', '≈ 15.000 AÑOS', 540, 260)}${etiqueta('e10r1', 'PATRIMONIO DE LA HUMANIDAD', 540, 260)}${etiqueta('e10r2', 'LA «CAPILLA SIXTINA» DEL ARTE', 540, 260)}`,
  e11: `<g id="e11zoom">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'chulo' }), 290, 760, 1.25, '', 'teo')}${mesa()}<g transform="translate(560 1505) scale(0.55 0.22)">${capa(O.expediente(), 0, 0, 1)}</g></g>`,
  e12: `<rect width="1080" height="1920" fill="#07090D"/><circle cx="540" cy="760" r="520" fill="url(#hFocoG)"/>
    <g id="e12tinta" opacity="0">${capa(tinta({ pose: 'desconfia' }), 390, 520, 1.0)}</g>
    <g id="e12txt" opacity="0"><text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">¿Tú le habrías</text>
      <text x="540" y="1160" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">creído?</text>
      <text x="540" y="1290" text-anchor="middle" font-family="Inter" font-weight="700" font-size="52" fill="#F2E6CF">Te leo en comentarios ↓</text></g>`,
};

const html = `<!doctype html><html><head><style>body{margin:0;background:#000} .ojo{transform-box:fill-box;transform-origin:center}#sub tspan{paint-order:stroke}</style></head><body>
<svg id="lienzo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><radialGradient id="hRojoG"><stop offset="0" stop-color="#FF4A3A" stop-opacity="0.85"/><stop offset="1" stop-color="#FF4A3A" stop-opacity="0"/></radialGradient>
<radialGradient id="hFocoG"><stop offset="0" stop-color="#FFC066" stop-opacity="0.35"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient>
<filter id="mancha" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="11" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="16"/><feGaussianBlur stdDeviation="3"/></filter><radialGradient id="vineta" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs>
${Object.entries(ESCENAS).map(([id, s]) => `<g id="${id}" style="display:none">${s}</g>`).join('\n')}
<rect width="${W}" height="${H}" fill="url(#vineta)" pointer-events="none"/>
<text id="sub" x="540" y="1420" text-anchor="middle" font-family="Inter" font-weight="900" font-size="84"></text>
<rect id="negro" width="${W}" height="${H}" fill="#000" opacity="0"/>
</svg>
<script>
const LT = ${JSON.stringify(LT)}, T = ${JSON.stringify(T)}, BOCA = ${JSON.stringify(BOCA)};
const $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const suave = x => { x = cl(x); return x * x * (3 - 2 * x); };
const prog = (t, a, b) => cl((t - a) / (b - a));
const mueve = (id, x, y, s = 1, r = 0, cx = 0, cy = 0) => $(id).setAttribute('transform', \`translate(\${x} \${y}) rotate(\${r} \${cx} \${cy}) scale(\${s})\`);
const zoom = (id, s, cx, cy) => $(id).setAttribute('transform', \`translate(\${cx} \${cy}) scale(\${s}) translate(\${-cx} \${-cy})\`);
const ver = (id, v) => $(id).style.display = v ? '' : 'none';
const op = (id, o) => $(id).setAttribute('opacity', o);
const enc = (id, s, cx, cy, X, Y) => $(id).setAttribute('transform', \`translate(\${X} \${Y}) scale(\${s}) translate(\${-cx} \${-cy})\`);
const luz = (id, x, y, s) => $(id).setAttribute('transform', \`translate(\${x} \${y}) scale(\${s})\`);

// Subtítulos: grupos de hasta 3 palabras; la palabra que suena, en amarillo.
const grupos = [];
{ let g = [];
  LT.subtitulos.forEach((w, i) => { const sig = LT.subtitulos[i + 1];
    g.push(w); if (g.length === 3 || /[.,?!:]$/.test(w.p) || !sig || sig.esc !== w.esc) { grupos.push(g); g = []; } }); }
function subtitulos(t) {
  const el = $('sub'); el.innerHTML = '';
  const g = grupos.find((g, i) => t >= g[0].ini - 0.05 && t < (grupos[i + 1] ? grupos[i + 1][0].ini - 0.05 : g[g.length - 1].fin + 0.6));
  if (!g || t > g[g.length - 1].fin + 0.6) return;
  const entra = suave(prog(t, g[0].ini - 0.05, g[0].ini + 0.08));
  el.setAttribute('transform', \`translate(540 1420) scale(\${0.85 + 0.15 * entra}) translate(-540 -1420)\`);
  g.forEach((w, j) => { const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    const sig = g[j + 1]; ts.textContent = w.p + ' ';
    const activa = t >= w.ini - 0.03 && (sig ? t < sig.ini - 0.03 : t < w.fin + 0.25);
    ts.setAttribute('fill', activa ? '#FFD34D' : '#FFFFFF'); ts.setAttribute('stroke', '#0B0E13'); ts.setAttribute('stroke-width', '14');
    el.appendChild(ts); });
  const largo = g.reduce((n, w) => n + w.p.length + 1, 0);
  el.setAttribute('font-size', Math.min(84, Math.round(84 * 21 / largo)));
}

// --- Vida de los personajes ---
const ANDA = new Map(); // contenedor -> intensidad del paso (0..1)
function andar(id, k) { ANDA.set(id, k); }
const paso = t => Math.abs(Math.sin(t * 9)) * 10; // bote del cuerpo al andar
function vida(t, escena) {
  const raiz = $(escena.id);
  // Parpadeo: cada par de ojos con su propio ritmo
  raiz.querySelectorAll('.ojo').forEach((o, i) => {
    const per = 2.6 + ((i * 0.73) % 1.9), fase = (t + i * 1.37) % per;
    o.style.transform = fase < 0.13 ? 'scaleY(0.12)' : '';
  });
  // Boca: se abre con el volumen de la voz del personaje que habla en esta escena
  const quien = escena.frase ? escena.frase.split('_')[1] : '';
  const v = BOCA[Math.min(BOCA.length - 1, Math.floor(t * 30))] || 0;
  raiz.querySelectorAll('[data-quien]').forEach(c => {
    const a = c.dataset.quien === quien ? v : 0, abre = a > 0.1;
    c.querySelectorAll('.boca').forEach(b => b.setAttribute('opacity', abre ? 0 : 1));
    c.querySelectorAll('.bocaAbierta').forEach(b => b.setAttribute('opacity', abre ? 1 : 0));
    c.querySelectorAll('.bocaForma').forEach(b => { b.setAttribute('ry', 4 + 13 * a); b.setAttribute('rx', 10 + 4 * a); });
  });
  // Piernas: andar si el contenedor está andando; si no, pequeños cambios de peso (o golpecitos con el pie si está sentado)
  raiz.querySelectorAll('.pierna').forEach((pi, i) => {
    const cx = pi.dataset.cx, cy = pi.dataset.cy, lado = i % 2 ? -1 : 1;
    let k = 0; for (const [id, kk] of ANDA) if ($(id) && $(id).contains(pi)) k = kk;
    let ang;
    if (k > 0) ang = lado * 28 * k * Math.sin(t * 9);
    else ang = 0; // quietos: sin balanceo
    pi.setAttribute('transform', \`rotate(\${ang.toFixed(2)} \${cx} \${cy})\`);
  });
  raiz.querySelectorAll('.brazo').forEach((br, i) => {
    let k = 0; for (const [id, kk] of ANDA) if ($(id) && $(id).contains(br)) k = kk;
    const ang = (i % 2 ? 1 : -1) * 24 * k * Math.sin(t * 9);
    br.setAttribute('transform', \`rotate(\${ang.toFixed(2)} \${br.dataset.cx} \${br.dataset.cy})\`);
  });
}

function render(t) {
  ANDA.clear();
  const e = LT.escenas.find(e => t >= e.ini && t < e.fin) || (t < LT.escenas[0].ini ? LT.escenas[0] : LT.escenas[LT.escenas.length - 1]);
  for (const x of LT.escenas) ver(x.id, x.id === e.id);
  const p = prog(t, e.ini, e.fin), d = t - e.ini;
  op('negro', t < 0.4 ? 1 - t / 0.4 : Math.max(0, 0.6 - d * 4));
  const resp = 1 + 0.008 * Math.sin(t * 2.4); // respiración
  switch (e.id) {
    case 'e01': { const k = suave(prog(d, 0.2, 3.2)); enc('e01zoom', 1.5, 540, 1300 - 900 * k, 540, Math.min(1100 - 300 * k, 1.5 * (1300 - 900 * k)));
      const l = suave(prog(d, 0.8, 3)); op('e01os', 0.6 * (1 - l)); op('e01tec', l); op('e01sello', prog(t, T.padre + 0.6, T.padre + 0.9)); break; }
    case 'e02': $('e02zoom').setAttribute('transform', \`translate(540 1920) scale(\${1.35 + 0.08 * suave(p)}) translate(-560 -1920)\`); zoom('e02teo', resp, 560, 1760); op('e02rot', prog(d, 0.2, 0.5)); break;
    case 'e03': { const z = suave(prog(t, T.cueva - 0.3, T.cueva + 0.8)); enc('e03zoom', 2.2 + 1.2 * z, 400 - 110 * z, 1380 - 190 * z, 540, 1150 - 100 * z); op('e03rot', prog(d, 0.2, 0.6) * (1 - prog(d, 6, 6.5))); break; }
    case 'e04': { enc('e04zoom', 1.05 + 0.05 * p, 540, 1300, 540, 1300); op('e04rot', prog(t, T.marcelino, T.marcelino + 0.3) * (1 - prog(t, T.verano - 0.3, T.verano)));
      op('e04rot2', prog(t, T.verano, T.verano + 0.3)); op('e04maria', prog(t, T.maria - 0.2, T.maria + 0.2)); break; }
    case 'e05': { const up = t >= T.arriba; ver('e05m1', !up); ver('e05m2', up); ver('e05a', !up); ver('e05b', up);
      const l = suave(prog(t, T.arriba, T.arriba + 1.2)); op('e05os', 0.6 * (1 - l)); op('e05tec', l);
      const z = suave(prog(t, T.arriba + 0.4, T.bueyes)); { const s = 1.05 + 0.25 * z, cy = 1300 - 900 * z; enc('e05zoom', s, 540, cy, 540, Math.min(1300 - 700 * z, s * cy)); } op('e05rot', prog(t, T.bueyes, T.bueyes + 0.3)); break; }
    case 'e06': { enc('e06zoom', 1.1, 540, 1000, 540, 1000); ver('e06a', d < 0.8); ver('e06b', d >= 0.8); break; }
    case 'e07': { const an = d < 0.9 ? 1 : 0; andar('e07lucia', an); ver('e07P', an); ver('e07F', !an); mueve('e07lucia', -620 * (1 - suave(prog(d, 0, 0.9))), -paso(t) * an); op('e07rot', prog(d, 1.2, 1.5)); break; }
    case 'e08': { enc('e08zoom', 1.6 + 0.08 * p, 580, 1000, 540, 1000); op('e08rot', prog(t, T.publico, T.publico + 0.3) * (1 - prog(d, 7, 7.5))); op('e08sello', prog(t, T.pintado, T.pintado + 0.15)); break; }
    case 'e09': op('e09rot', prog(t, T.mil1902 - 0.4, T.mil1902)); op('e09rot2', prog(t, T.mea - 0.1, T.mea + 0.2)); break;
    case 'e10': { const z = 1 - suave(prog(t, T.nina - 1.2, T.nina + 0.4)); { const s = 1.05 + 0.35 * z, cy = 1300 - 900 * z; enc('e10zoom', s, 540, cy, 540, Math.min(1300 - 700 * z, s * cy)); }
      const hitos = [T.quince, T.patrimonio, T.capilla, T.nina]; [0, 1, 2].forEach(i => op('e10r' + i, prog(t, hitos[i], hitos[i] + 0.2) * (1 - prog(t, hitos[i + 1] - 0.15, hitos[i + 1])))); break; }
    case 'e11': zoom('e11zoom', 1 + 0.2 * suave(p), 540, 1000); op('negro', prog(t, e.fin - 0.7, e.fin)); break;
    case 'e12': op('e12tinta', prog(d, 0.3, 0.8)); op('e12txt', prog(d, 0.6, 1.1)); op('negro', 1 - prog(d, 0, 0.4)); break;
  }
  vida(t, e);
  subtitulos(t);
}
window.render = render;
</script></body></html>`;

(async () => {
  const [modo, salida, ...tiempos] = process.argv.slice(2);
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  pg.on('pageerror', e => console.log('ERROR:', e.message));
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  if (modo === 'fotos') {
    fs.mkdirSync(salida, { recursive: true });
    for (const t of tiempos) { await pg.evaluate(t => render(t), +t); await pg.screenshot({ path: path.join(salida, `t${(+t).toFixed(1).padStart(5, '0')}.png`) }); }
  } else {
    const total = Math.ceil(LT.duracion * FPS);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', path.join(__dirname, 'salida/audio_006.wav'),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = 0; i < total; i++) {
      await pg.evaluate(t => render(t), i / FPS);
      const buf = await pg.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`${i}/${total} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('Hecho:', salida);
  }
  await b.close();
})();
