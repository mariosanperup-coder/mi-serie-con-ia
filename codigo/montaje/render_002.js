// Episodio 002 — Las caras de Bélmez. Anima las escenas y exporta el vídeo vertical 1080x1920 a 30 fps.
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
const { maria, albanil } = require(B + '/personajes/belmez');
const { figura } = require(B + '/personajes/figura');
const archivo = F('f09_archivo');
const LT = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/linea_tiempo_002.json')));
const BOCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/boca_002.json'))).boca;
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

// --- tiempos clave (calculados del audio) ---
const T = LT.clave;

const archivoSinMesa = archivo({ conMesa: false }), mesa = () => `<g>${aislar(archivo.mesa())}</g>`;
const cocina = () => F('002/b01_cocina')(), pueblo = () => F('002/b02_pueblo')();
// Cara en el suelo de cemento (perspectiva aplastada). id para animar su opacidad.
// Cara en el suelo de cemento: mancha irregular de humedad con rasgos (ojos hundidos, nariz, boca), deformada con ruido.
const caraSuelo = (id, x, y, s) => `<g id="${id}" opacity="0" transform="translate(${x} ${y}) scale(${s} ${s * 0.55})" filter="url(#mancha)">
  <ellipse cx="0" cy="6" rx="92" ry="118" fill="#4A433A" opacity="0.32"/>
  <ellipse cx="0" cy="-2" rx="70" ry="92" fill="#3E372F" opacity="0.25"/>
  <ellipse cx="-34" cy="-28" rx="26" ry="10" fill="#2E2822" opacity="0.45"/><ellipse cx="34" cy="-27" rx="24" ry="9" fill="#2E2822" opacity="0.45"/>
  <ellipse cx="-34" cy="-12" rx="17" ry="12" fill="#211C17" opacity="0.85"/><ellipse cx="34" cy="-11" rx="16" ry="12" fill="#211C17" opacity="0.85"/>
  <path d="M-6 -4 Q-14 22 -4 36 Q8 38 10 28 Q4 14 4 -2 Z" fill="#2E2822" opacity="0.6"/>
  <path d="M-36 54 Q0 66 36 52 Q20 76 0 76 Q-22 76 -36 54 Z" fill="#211C17" opacity="0.75"/>
  <ellipse cx="0" cy="100" rx="40" ry="14" fill="#3E372F" opacity="0.35"/></g>`;
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
const periodico = id => `<g id="${id}" opacity="0"><g transform="rotate(-5 540 720)">
  <rect x="190" y="380" width="700" height="760" fill="#EFE8D6" stroke="#0B0E13" stroke-width="6"/>
  <text x="540" y="470" text-anchor="middle" font-family="DejaVu Serif" font-weight="700" font-size="74" fill="#1A1A1A">EL DIARIO</text>
  <path d="M220 500 H860 M220 512 H860" stroke="#1A1A1A" stroke-width="4"/>
  <text x="540" y="600" text-anchor="middle" font-family="Inter" font-weight="900" font-size="92" fill="#1A1A1A">¿FRAUDE EN</text>
  <text x="540" y="700" text-anchor="middle" font-family="Inter" font-weight="900" font-size="92" fill="#1A1A1A">BÉLMEZ?</text>
  <rect x="240" y="740" width="300" height="250" fill="#8A847A" stroke="#1A1A1A" stroke-width="4"/>
  <g transform="translate(390 865) scale(1.1)" fill="none" stroke="#2A2620" stroke-width="7"><path d="M-40 -28 q12 -12 26 0 M14 -28 q12 -12 26 0 M-26 40 q26 14 52 0"/><circle cx="-27" cy="-10" r="8" fill="#2A2620"/><circle cx="27" cy="-10" r="8" fill="#2A2620"/></g>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M570 ${760 + i * 30} H${840 - (i % 3) * 40}" stroke="#7A766E" stroke-width="8"/>`).join('')}
  ${[0, 1, 2, 3].map(i => `<path d="M240 ${1030 + i * 28} H${840 - (i % 2) * 120}" stroke="#7A766E" stroke-width="8"/>`).join('')}</g></g>`;
const sobreAzucar = id => `<g id="${id}" opacity="0" transform="translate(260 1452) rotate(-8) scale(0.4)"><rect x="-120" y="-70" width="240" height="140" rx="8" fill="#F4F0E6" stroke="#0B0E13" stroke-width="6"/>
  <path d="M-120 -40 H120" stroke="#C0392B" stroke-width="10"/><text x="0" y="40" text-anchor="middle" font-family="Inter" font-weight="900" font-size="46" fill="#C0392B">AZÚCAR</text></g>`;
const curioso = (i) => figura({ vista: 'frente', cara: ['sorpresa', 'serio', 'preocupado', 'sorpresa', 'serio'][i % 5],
  ropa: { torso: ['#5A6A8A', '#8A4A3A', '#4A6A4A', '#7A6A4A', '#3A3A4A'][i % 5], pantalon: '#2E2E34', manos: '#151515', falda: i % 2 ? '#3A2A30' : null, largoChaqueta: 440 } });

const ESCENAS = {
  e01: `<g id="e01zoom">${fondo(cocina())}${caraSuelo('e01cara', 600, 1660, 1.5)}${sombra(520, 1420, 90)}
    <g transform="translate(1100 0) scale(-1 1)"><g id="e01maria">${capa(maria.cocinando('serio'), 390, 755, 0.95)}</g>
      <g id="e01mariaS" style="display:none">${capa(maria.cocinando('sorpresa'), 390, 755, 0.95)}</g></g></g>`,
  e02: `<g id="e02zoom">${fondo(pueblo())}<g id="e02teo">${sombra(760, 1760, 70)}
    ${capa(teoFrente({ cara: 'chulo' }), 660, 1404, 0.5, '', 'teo')}${capa(tinta({ pose: 'tranquilo' }), 771, 1454, 0.17)}</g></g>${rotuloCanal('e02rot')}`,
  e03: `<g id="e03a"><g id="e03zoomA">${fondo(pueblo())}</g>${etiqueta('e03rot', 'BÉLMEZ DE LA MORALEDA', 540, 260)}${etiqueta('e03rot2', 'JAÉN · 1971', 540, 360)}</g>
    <g id="e03b" style="display:none"><g id="e03zoomB">${fondo(cocina())}${caraSuelo('e03cara', 600, 1660, 1.5)}</g></g>`,
  e04: `<g id="e04zoom">${fondo(cocina())}${caraSuelo('e04cara', 600, 1660, 1.5)}
    <ellipse id="e04yeso" cx="600" cy="1660" rx="200" ry="80" fill="#EDE7DA" opacity="0"/>
    <g id="e04alb">${sombra(420, 1730, 130)}${capa(albanil.raspando(), 230, 1010, 1.05)}</g></g><rect id="e04fundido" width="1080" height="1920" fill="#000" opacity="0"/>
    ${etiqueta('e04dias', 'DÍAS DESPUÉS…', 540, 300)}`,
  e05: `<g id="e05a">${fondo(F('002/b03_pasillo')())}${caraSuelo('e05c1', 560, 1180, 0.7)}${caraSuelo('e05c2', 420, 1450, 1.0)}${caraSuelo('e05c3', 700, 1700, 1.3)}</g>
    <g id="e05b" style="display:none">${fondo(pueblo())}${[4, 3, 2, 1, 0].map(i => { const sc = 0.4 + i * 0.05, x = 360 + i * 120, y = 1660 + i * 50; return sombra(x, y, 60 * sc / 0.4) + capa(curioso(i), x - 200 * sc, y - 712 * sc, sc); }).join('')}</g>`,
  e06: `<g id="e06fondo">${fondo(F('002/b03_pasillo')())}</g><rect width="1080" height="1920" fill="#000" opacity="0.35"/>
    ${caraSuelo('e06cara', 620, 1720, 1.4)}${sombra(320, 1650, 50)}
    <g id="e06tinta"><g id="e06a">${capa(tinta({ pose: 'tranquilo' }), 230, 1437, 0.6)}</g><g id="e06b" style="display:none">${capa(tinta({ pose: 'desconfia' }), 230, 1437, 0.6)}</g>
      <g id="e06c" style="display:none">${capa(tinta({ pose: 'susto' }), 230, 1437, 0.6)}</g></g>`,
  e07: `${fondo(archivoSinMesa)}<g id="e07lucia"><g id="e07F">${capa(luciaFrente({ cara: 'esceptica' }), 290, 760, 1.25, '', 'lucia')}</g>
      <g id="e07P" style="display:none">${capa(luciaPerfil(), 290, 760, 1.25, '', 'lucia')}</g></g>${mesa()}`,
  e08: `${fondo(archivoSinMesa)}<g id="e08teo"><g id="e08F">${capa(teoFrente({ cara: 'chulo' }), 290, 760, 1.25, '', 'teo')}</g>
      <g id="e08P" style="display:none" transform="translate(1080 0) scale(-1 1)">${capa(teoPerfil(), 290, 760, 1.25, '', 'teo')}</g></g>${mesa()}${periodico('e08diario')}`,
  e09: `${fondo(F('002/b04_laboratorio')())}${sombra(790, 1719, 110)}${capa(luciaFrente({ cara: 'explicando' }), 560, 900, 1.15, '', 'lucia')}${sobreAzucar('e09sobre')}${etiqueta('e09rot', 'CSIC', 260, 300)}`,
  e10: `<g id="e10zoom">${fondo(cocina())}${caraSuelo('e10cara', 600, 1660, 1.5)}</g><rect width="1080" height="1920" fill="#000" opacity="0.25"/>
    ${sello('e10s1', 'PARANORMAL', 540, 520, -8)}${sello('e10s2', 'FRAUDE', 540, 820, 6)}${sello('e10s3', 'SIN PINTURA', 540, 1120, -4)}${etiqueta('e10ano', '2014', 540, 1300)}`,
  e11: `<g id="e11zoom">${fondo(pueblo())}</g><rect id="e11noche" width="1080" height="1920" fill="#0A1A2E" opacity="0"/>
    <circle id="e11luz" cx="245" cy="1450" r="160" fill="url(#hFocoG)" opacity="0"/>`,
  e12: `<g id="e12zoom">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'serio' }), 290, 760, 1.25, '', 'teo')}${mesa()}${capa(O.expediente(), 600, 1380, 0.55, 'e12exp')}</g>`,
  e13: `<rect width="1080" height="1920" fill="#07090D"/><circle cx="540" cy="760" r="520" fill="url(#hFocoG)"/>
    <g id="e13tinta" opacity="0">${capa(tinta({ pose: 'desconfia' }), 390, 520, 1.0)}</g>
    <g id="e13txt" opacity="0"><text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">¿Fraude o</text>
      <text x="540" y="1160" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">misterio?</text>
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
    case 'e01': { zoom('e01zoom', 1 + 0.15 * suave(prog(t, T.aparece - 1, e.fin)), 600, 1560);
      const k = prog(t, T.aparece - 0.6, T.aparece + 0.8); op('e01cara', suave(k));
      const sust = t >= T.aparece + 0.4; ver('e01maria', !sust); ver('e01mariaS', sust); break; }
    case 'e02': $('e02zoom').setAttribute('transform', \`translate(540 1150) scale(\${1.75 + 0.1 * suave(p)}) translate(-700 -1560)\`); zoom('e02teo', resp, 760, 1760);
      op('e02rot', prog(d, 0.15, 0.5)); $('e02rot').setAttribute('transform', \`translate(540 300) scale(\${1.25 - 0.25 * suave(prog(d, 0.15, 0.45))})\`); break;
    case 'e03': { const b = t >= T.cemento; ver('e03a', !b); ver('e03b', b);
      zoom('e03zoomA', 1 + 0.12 * prog(t, e.ini, T.cemento), 680, 700); op('e03rot', prog(d, 0.2, 0.6)); op('e03rot2', prog(d, 0.6, 1));
      $('e03zoomB').setAttribute('transform', \`translate(540 960) scale(\${3.15 + 0.3 * suave(prog(t, T.cemento, e.fin))}) translate(-600 -1612)\`); op('e03cara', 0.6 + 0.4 * prog(t, T.cemento, T.cemento + 1)); break; }
    case 'e04': { zoom('e04zoom', 1.15, 560, 1500);
      const rasp = prog(t, e.ini, T.resuelto); op('e04cara', t < T.resuelto ? 1 - 0.8 * rasp : prog(t, T.volvio - 0.6, T.volvio + 0.8));
      op('e04yeso', t < T.resuelto ? 0.9 * suave(prog(t, e.ini + 1.5, T.resuelto)) : Math.max(0, 0.9 - prog(t, T.volvio - 0.8, T.volvio + 0.6)));
      ver('e04alb', t < T.resuelto + 0.4); $('e04alb').setAttribute('transform', \`translate(\${8 * Math.sin(t * 14)} 0)\`);
      op('e04fundido', Math.max(0, 1 - Math.abs(t - (T.resuelto + 0.4)) * 2.5)); op('e04dias', prog(t, T.resuelto + 0.5, T.resuelto + 0.8) * (1 - prog(t, T.volvio - 0.5, T.volvio))); break; }
    case 'e05': { const b = t >= T.noticia; ver('e05a', !b); ver('e05b', b);
      op('e05c1', prog(t, e.ini + 0.4, e.ini + 1.4)); op('e05c2', prog(t, e.ini + 1.4, e.ini + 2.4)); op('e05c3', prog(t, e.ini + 2.4, e.ini + 3.4));
      if (b) $('e05b').setAttribute('transform', \`translate(540 1300) scale(\${1 + 0.06 * prog(t, T.noticia, e.fin)}) translate(-540 -1300)\`); break; }
    case 'e06': { const fase = d < 0.45 ? 'a' : d < 0.85 ? 'b' : 'c'; ver('e06a', fase === 'a'); ver('e06b', fase === 'b'); ver('e06c', fase === 'c');
      op('e06cara', prog(d, 0.3, 0.8)); const tiembla = fase === 'c' ? 10 * Math.sin(d * 80) * Math.max(0, 1 - (d - 0.85) * 1.2) : 0;
      $('e06tinta').setAttribute('transform', \`translate(\${tiembla} 0)\`); $('e06').setAttribute('transform', \`translate(540 1550) scale(\${1.5 + 0.1 * d}) translate(-480 -1600)\`); break; }
    case 'e07': { const an = d < 0.9 ? 1 : 0; andar('e07lucia', an); ver('e07P', an); ver('e07F', !an); mueve('e07lucia', -620 * (1 - suave(prog(d, 0, 0.9))), -paso(t) * an); break; }
    case 'e08': { const an = d < 0.9 ? 1 : 0; andar('e08teo', an); ver('e08P', an); ver('e08F', !an);
      $('e08teo').setAttribute('transform', \`translate(\${700 * (1 - suave(prog(d, 0, 0.9)))} \${-paso(t) * an}) translate(540 1650) scale(\${resp}) translate(-540 -1650)\`);
      const k = suave(prog(t, T.periodico - 0.2, T.periodico + 0.3)); op('e08diario', k);
      $('e08diario').setAttribute('transform', \`translate(540 760) scale(\${0.6 + 0.4 * k}) rotate(\${(1 - k) * 25}) translate(-540 -760)\`); break; }
    case 'e09': op('e09rot', prog(d, 0.2, 0.6)); { const k = suave(prog(t, T.sobre - 0.2, T.sobre + 0.25)); op('e09sobre', k);
      $('e09sobre').setAttribute('transform', \`translate(260 \${1452 - 120 * (1 - k)}) rotate(-8) scale(0.4)\`); } break;
    case 'e10': $('e10zoom').setAttribute('transform', \`translate(540 960) scale(\${3.15 + 0.3 * suave(p)}) translate(-600 -1612)\`);
      [['e10s1', T.parapsicologo, -8, 520], ['e10s2', T.esceptico, 6, 820], ['e10s3', T.catorce, -4, 1120]].forEach(([id, t0, r, y]) => {
        const s = prog(t, t0, t0 + 0.12); op(id, s); $(id).setAttribute('transform', \`translate(540 \${y}) rotate(\${r}) scale(\${(1.6 - 0.6 * suave(s)) * 0.8})\`); });
      op('e10ano', prog(t, T.catorce - 0.6, T.catorce - 0.3)); op('e10cara', 0.9); break;
    case 'e11': zoom('e11zoom', 1 + 0.1 * suave(p), 240, 1450); op('e11noche', 0.55 * suave(p)); op('e11luz', 0.3 + 0.6 * suave(p)); break;
    case 'e12': zoom('e12zoom', 1 + 0.2 * suave(p), 540, 1000); op('negro', prog(t, e.fin - 0.7, e.fin)); break;
    case 'e13': op('e13tinta', prog(d, 0.3, 0.8)); op('e13txt', prog(d, 0.6, 1.1)); op('negro', 1 - prog(d, 0, 0.4)); break;
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
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  if (modo === 'fotos') {
    fs.mkdirSync(salida, { recursive: true });
    for (const t of tiempos) { await pg.evaluate(t => render(t), +t); await pg.screenshot({ path: path.join(salida, `t${(+t).toFixed(1).padStart(5, '0')}.png`) }); }
  } else {
    const total = Math.ceil(LT.duracion * FPS);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', path.join(__dirname, 'salida/audio_002.wav'),
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
