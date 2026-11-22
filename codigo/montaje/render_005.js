// Episodio 005 — El Dioni. Anima las escenas y exporta el vídeo vertical 1080x1920 a 30 fps.
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
const D = require(B + '/personajes/dioni');
const { figura } = require(B + '/personajes/figura');
const archivo = F('f09_archivo');
const LT = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/linea_tiempo_005.json')));
const BOCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/boca_005.json'))).boca;
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
const calle = () => F('005/g01_calle')(), garaje = () => F('005/g02_garaje')(), brasil = () => F('005/g03_brasil')(), plato = () => F('005/g04_plato')();
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
Object.assign(T, { diez: PAL('diez', 44), ciento: PAL('ciento', 52), discos: PAL('discos', 61), superv: PAL('supervivientes', 61), trescientos: PAL('trescientos', 0) });
const fur = (x, y, s, id = '') => `${sombra(x + 450 * s, y + 456 * s, 430 * s)}${capa(D.furgon(), x, y, s, id)}`;
const coche = (x, y, s, id = '') => `<g ${id ? `id="${id}"` : ''}>${sombra(x + 380 * s, y + 298 * s, 360 * s)}${capa(D.coche(), x, y, s)}</g>`;
const panel = (id, lineas) => `<g id="${id}" opacity="0"><rect x="90" y="470" width="900" height="${lineas.length * 120 + 80}" rx="18" fill="#0B0E13" opacity="0.88"/>
  ${lineas.map(([t, c, f], i) => `<text x="540" y="${580 + i * 120}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${f || 96}" fill="${c}">${t}</text>`).join('')}</g>`;
const publico = () => Array.from({ length: 11 }, (_, i) => { const f = i < 6 ? 0 : 1, x = (f ? 100 : 0) + (i % 6) * 200 - 20 + (f ? 0 : 60), y = f ? 1830 : 1745;
  const pelo = ['#2A2018', '#8A5A2A', '#C8A040', '#5A5A5A', '#1A1A1A', '#A0442A'][i % 6];
  return `<circle cx="${x}" cy="${y}" r="46" fill="${pelo}" stroke="#0B0E13" stroke-width="5"/><rect x="${x - 18}" y="${y + 40}" width="36" height="30" fill="#E8E2D2"/>`; }).join('');
const rejas = id => `<g id="${id}" opacity="0"><rect width="1080" height="1920" fill="#0B0E13" opacity="0.45"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${40 + i * 125}" y="0" width="26" height="1920" fill="#3A3E42" stroke="#0B0E13" stroke-width="5"/>`).join('')}
  <rect x="0" y="380" width="1080" height="30" fill="#3A3E42" stroke="#0B0E13" stroke-width="5"/></g>`;

const ESCENAS = {
  e01: `<g id="e01zoom">${fondo(calle())}${fur(60, 1248, 0.85)}${pie(D.dioni.uniforme('serio'), 900, 1640, 0.3)}</g>${panel('e01cifra', [['≈ 300.000.000', '#FFD34D', 104], ['PESETAS', '#F2E6CF', 64]])}`,
  e02: `<g id="e02zoom">${fondo(calle())}<g id="e02teo">${pie(teoFrente({ cara: 'chulo' }), 300, 1760, 0.55, '', 'teo')}${capa(tinta({ pose: 'tranquilo' }), 300 - 110 + 122, 1760 - 392 + 55, 0.19)}</g></g>${rotuloCanal('e02rot')}`,
  e03: `<g id="e03zoom">${fondo(calle())}${fur(60, 1248, 0.85)}
    <g id="e03c1"><g id="e03c1F">${pie(D.compa(false), 330, 1680, 0.3)}</g><g id="e03c1P" style="display:none">${pie(D.compa(false, 'perfil'), 330, 1680, 0.3)}</g></g>
    <g id="e03c2"><g id="e03c2F">${pie(D.compa(true), 470, 1690, 0.3)}</g><g id="e03c2P" style="display:none">${pie(D.compa(true, 'perfil'), 470, 1690, 0.3)}</g></g>
    <g id="e03d1">${pie(D.dioni.uniforme('serio'), 900, 1640, 0.3)}</g><g id="e03d2" style="display:none">${pie(D.dioni.mirando(), 900, 1640, 0.3)}</g></g>${etiqueta('e03rot', '28 JULIO 1989 · 19:20', 540, 260)}`,
  e04: `<g id="e04a"><g id="e04zoomA">${fondo(calle())}<g id="e04fur">${fur(60, 1248, 0.85)}</g></g></g>
    <g id="e04b" style="display:none"><g id="e04zoomB">${fondo(garaje())}${fur(-330, 1300, 0.9)}<g id="e04coche">${coche(520, 1460, 0.6)}<g id="e04bolsas">${[0, 1, 2].map(i => `<g transform="translate(${600 + i * 70} ${1610}) scale(0.5)">${D.saca(0, 0)}</g>`).join('')}</g></g>
      <g id="e04dioni">${pie(D.dioni.sacas(), 470, 1720, 0.36)}</g></g></g>
    ${panel('e04cifra', [['298.000.000', '#FFD34D', 120], ['PESETAS', '#F2E6CF', 64]])}`,
  e05: `<g id="e05zoom">${fondo(brasil())}${pie(D.dioni.playa(), 560, 1760, 0.62, '', 'dioni')}</g>${etiqueta('e05rot', 'BRASIL · 1989', 540, 260)}${etiqueta('e05rot2', 'CON PELUCA', 540, 360)}`,
  e06: `<g id="e06zoom">${fondo(brasil())}${pie(D.dioni.playa(), 560, 1760, 0.62)}${sombra(820, 1790, 50)}
    <g id="e06a">${capa(tinta({ pose: 'desconfia' }), 740, 1660, 0.3)}</g><g id="e06b" style="display:none">${capa(tinta({ pose: 'susto' }), 740, 1660, 0.3)}</g></g>`,
  e07: `${fondo(archivoSinMesa)}<g id="e07lucia"><g id="e07F">${capa(luciaFrente({ cara: 'esceptica' }), 290, 760, 1.25, '', 'lucia')}</g>
      <g id="e07P" style="display:none">${capa(luciaPerfil(), 290, 760, 1.25, '', 'lucia')}</g></g>${mesa()}`,
  e08: `<g id="e08zoom">${fondo(brasil())}${pie(D.policia(false, false), 330, 1760, 0.6)}
    <g id="e08d1">${pie(D.dioni.playa(), 560, 1780, 0.62)}</g><g id="e08d2" style="display:none">${pie(D.dioni.esposado(), 560, 1780, 0.62)}</g>${pie(D.policia(true, true), 790, 1760, 0.6)}</g>
    ${rejas('e08rejas')}${etiqueta('e08rot', 'SEPTIEMBRE 1989', 540, 260)}${etiqueta('e08rot2', '10 MESES EN PRISIÓN', 540, 260)}`,
  e09: `${fondo(archivoSinMesa)}${capa(luciaFrente({ cara: 'explicando' }), 290, 760, 1.25, '', 'lucia')}${mesa()}
    <g id="e09p" opacity="0"><rect x="90" y="150" width="900" height="420" rx="18" fill="#0B0E13" opacity="0.88"/><text x="540" y="260" text-anchor="middle" font-family="Inter" font-weight="900" font-size="84" fill="#F2E6CF">298 M robados</text></g>
    <g id="e09q" opacity="0"><text x="540" y="380" text-anchor="middle" font-family="Inter" font-weight="900" font-size="84" fill="#7AD87A">175 M recuperados</text></g>
    <g id="e09r" opacity="0"><text x="540" y="500" text-anchor="middle" font-family="Inter" font-weight="900" font-size="84" fill="#FF6A50">123 M … ¿dónde?</g>`,
  e10: `<g id="e10zoom">${fondo(plato())}${pie(D.dioni.plato(), 600, 1450, 0.62, '', 'dioni')}${publico()}</g>
    ${['3 AÑOS Y 4 MESES', 'SABINA · CANCIÓN', 'DISCOS', 'TORRENTE', 'SUPERVIVIENTES', 'SU PROPIO LIBRO'].map((t, i) => etiqueta('e10r' + i, t, 540, 260)).join('')}
    <g id="e10notas" opacity="0">${[[200, 520], [860, 600], [300, 760]].map(([x, y]) => `<text x="${x}" y="${y}" font-size="110" fill="#FFD34D" stroke="#0B0E13" stroke-width="6" paint-order="stroke">♪</text>`).join('')}</g>`,
  e11: `<g id="e11zoom">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'chulo' }), 290, 760, 1.25, '', 'teo')}${mesa()}<g transform="translate(560 1505) scale(0.55 0.22)">${capa(O.expediente(), 0, 0, 1)}</g></g>`,
  e12: `<rect width="1080" height="1920" fill="#07090D"/><circle cx="540" cy="760" r="520" fill="url(#hFocoG)"/>
    <g id="e12tinta" opacity="0">${capa(tinta({ pose: 'desconfia' }), 390, 520, 1.0)}</g>
    <g id="e12txt" opacity="0"><text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">¿Dónde está el resto</text>
      <text x="540" y="1160" text-anchor="middle" font-family="Inter" font-weight="900" font-size="80" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">del dinero?</text>
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
    case 'e01': enc('e01zoom', 1.9 + 0.15 * suave(p), 760, 1640, 560, 1800); op('e01cifra', prog(t, T.trescientos - 0.1, T.trescientos + 0.2)); break;
    case 'e02': $('e02zoom').setAttribute('transform', \`translate(540 1920) scale(\${1.35 + 0.08 * suave(p)}) translate(-420 -1920)\`); zoom('e02teo', resp, 300, 1760); op('e02rot', prog(d, 0.2, 0.5)); break;
    case 'e03': { enc('e03zoom', 1.7, 680, 1660, 540, 1830); op('e03rot', prog(d, 0.2, 0.6) * (1 - prog(d, 7, 7.5)));
      const k = prog(t, T.compas, T.compas + 2.6), an = k > 0 && k < 1 ? 1 : 0;
      ['e03c1', 'e03c2'].forEach(c => { ver(c + 'F', k === 0); ver(c + 'P', k > 0); andar(c, an); mueve(c, 900 * k, -paso(t) * an); });
      const mira = t > T.compas + 1.2; ver('e03d1', !mira); ver('e03d2', mira); break; }
    case 'e04': { const b = t >= T.sacas; ver('e04a', !b); ver('e04b', b);
      if (!b) { enc('e04zoomA', 1.7, 680, 1660, 540, 1830); const k = prog(t, T.arranca, T.arranca + 2.2); mueve('e04fur', 1300 * k * k, 0); }
      else { enc('e04zoomB', 1.8, 560, 1700, 540, 1830); const ido = t >= T.desaparece; ver('e04dioni', !ido); op('e04bolsas', ido ? 0 : 1);
        const k = prog(t, T.desaparece, T.desaparece + 1.8); mueve('e04coche', 900 * k * k, 0); }
      op('e04cifra', prog(t, T.cifra - 0.1, T.cifra + 0.2)); break; }
    case 'e05': { const z = suave(prog(t, T.peluca - 0.2, T.peluca + 0.5)); enc('e05zoom', 1.4 + 1.2 * z, 560, 1760 - 360 * z, 540, 1900 - 900 * z); op('e05rot', prog(t, T.brasil - 0.2, T.brasil + 0.1)); op('e05rot2', prog(t, T.peluca, T.peluca + 0.3)); break; }
    case 'e06': { enc('e06zoom', 2.3, 700, 1720, 540, 1500); ver('e06a', d < 1); ver('e06b', d >= 1); break; }
    case 'e07': { const an = d < 0.9 ? 1 : 0; andar('e07lucia', an); ver('e07P', an); ver('e07F', !an); mueve('e07lucia', -620 * (1 - suave(prog(d, 0, 0.9))), -paso(t) * an); break; }
    case 'e08': { enc('e08zoom', 1.8 + 0.05 * p, 560, 1770, 540, 1912); const det = t >= T.detuvo; ver('e08d1', !det); ver('e08d2', det);
      op('e08rot', prog(t, T.detuvo, T.detuvo + 0.3) * (1 - prog(t, T.diez - 0.4, T.diez - 0.1))); op('e08rot2', prog(t, T.diez - 0.1, T.diez + 0.2)); op('e08rejas', prog(t, T.diez - 0.2, T.diez + 0.4)); break; }
    case 'e09': op('e09p', prog(d, 0.3, 0.6)); op('e09q', prog(t, T.ciento - 0.1, T.ciento + 0.2)); op('e09r', prog(t, T.resto - 0.1, T.resto + 0.2)); break;
    case 'e10': { enc('e10zoom', 1.55 + 0.08 * p, 600, 1450, 540, 1600);
      const hitos = [e.ini, T.sabina, T.discos, T.torrente, T.superv, T.libro]; hitos.forEach((h, i) => op('e10r' + i, prog(t, h, h + 0.2) * (1 - prog(t, (hitos[i + 1] || 99) - 0.15, hitos[i + 1] || 99))));
      op('e10notas', prog(t, T.sabina, T.sabina + 0.3) * (1 - prog(t, T.discos + 1, T.discos + 1.3))); break; }
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
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', path.join(__dirname, 'salida/audio_005.wav'),
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
