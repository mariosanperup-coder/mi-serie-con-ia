// Episodio 003 — El Ecce Homo de Borja. Anima las escenas y exporta el vídeo vertical 1080x1920 a 30 fps.
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
const { cecilia, turista, cuadroOriginal, cuadroRestaurado } = require(B + '/personajes/borja');
const { figura } = require(B + '/personajes/figura');
const archivo = F('f09_archivo');
const LT = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/linea_tiempo_003.json')));
const BOCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/boca_003.json'))).boca;
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
const santuario = () => F('003/c01_santuario')(), iglesia = () => F('003/c02_interior')();
const cuadro = (id, rest) => `<g id="${id}">${capa(rest ? cuadroRestaurado() : cuadroOriginal(), 470, 420, 1)}</g>`;
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

// Teo pequeño (a escala con la puerta) delante del santuario. Pies en (fx, fy).
const SC = 0.27;
const teoMini = (cara, fx, fy) => `${sombra(fx, fy, 50)}${capa(teoFrente({ cara }), fx - 200 * SC, fy - 712 * SC, SC, '', 'teo')}${capa(tinta({ pose: 'tranquilo' }), fx - 200 * SC + 60, fy - 712 * SC + 27, 0.092)}`;
const turistaMini = (i, fx, fy, s = SC) => `${sombra(fx, fy, 46)}${capa(turista(i), fx - 200 * s, fy - 712 * s, s)}`;
// Multitud: muchos turistas con colores variados, más pequeños al fondo. Zona de la explanada.
const COLORES = ['#4E7A3E', '#C8483E', '#2E5AA0', '#8A6AA0', '#D9A030', '#2E8A8A', '#B85A8A', '#5A5A6A', '#E07A3A', '#3A6A4A', '#A03A3A', '#6A8AC0'];
function multitud(n, semilla, { y0 = 1480, y1 = 1900, x0 = -40, x1 = 1120, hueco = null } = {}) {
  let a = semilla; const rnd = () => { a = (a * 9301 + 49297) % 233280; return a / 233280; };
  const gente = [];
  for (let i = 0; i < n; i++) {
    const y = y0 + (y1 - y0) * Math.pow(rnd(), 0.8), x = x0 + (x1 - x0) * rnd();
    if (hueco && Math.abs(x - hueco[0]) < hueco[2] && Math.abs(y - hueco[1]) < hueco[2] * 0.5) continue;
    // Zonas prohibidas: el banco de piedra (y la gente justo detrás, que quedaría encima) y las rocas de las esquinas.
    if (x > 20 && x < 540 && y > 1592 && y < 1900) continue;
    if (x < 340 && y > 1730) continue;
    if (x > 740 && y > 1840) continue;
    const v = rnd(); gente.push([x, y, Math.floor(rnd() * 4), COLORES[Math.floor(rnd() * COLORES.length)], v < 0.5 ? 'espalda' : v < 0.85 ? 'perfil' : 'frente', x > 600]);
  }
  gente.sort((p, q) => p[1] - q[1]);
  return gente.map(([x, y, tipo, color, vista, mirarIzq]) => {
    const espejo = vista === 'perfil' ? mirarIzq : false;
    const sc = 0.17 + (y - y0) / (y1 - y0) * 0.17;
    let svg = turista(tipo, vista).replace(/#4E7A3E|#C8483E|#2E5AA0|#8A6AA0/g, color);
    const fig = capa(svg, x - 200 * sc, y - 712 * sc, sc);
    return sombra(x, y, 46 * sc / 0.27) + (espejo ? `<g transform="translate(${2 * x} 0) scale(-1 1)">${fig}</g>` : fig);
  }).join('');
}
const movil = (x, y, rot, titular, i) => `<g class="movil" data-i="${i}" opacity="0" transform="translate(${x} ${y}) rotate(${rot})">
  <rect x="-110" y="-200" width="220" height="400" rx="26" fill="#151515" stroke="#2A2A2A" stroke-width="6"/>
  <rect x="-96" y="-170" width="192" height="330" rx="6" fill="#F4F2EE"/>
  ${capa(cuadroRestaurado(), -80, -160, 0.53)}
  <rect x="-96" y="60" width="192" height="100" fill="#F4F2EE"/>
  <text x="0" y="104" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${titular.length > 11 ? 22 : 28}" fill="#151515">${titular}</text>
  <path d="M-60 130 H60 M-60 146 H30" stroke="#B0B0B0" stroke-width="7"/>
  ${[0, 1, 2].map(k => `<circle cx="${-30 + k * 30}" cy="182" r="6" fill="#E0442E"/>`).join('')}</g>`;

const ESCENAS = {
  e01: `<g id="e01zoom">${fondo(iglesia())}${cuadro('e01c', true)}</g>`,
  e02: `<g id="e02zoom">${fondo(santuario())}<g id="e02teo">${teoMini('chulo', 640, 1640)}</g></g>${rotuloCanal('e02rot')}`,
  e03: `<g id="e03a"><g id="e03zoomA">${fondo(santuario())}</g>${etiqueta('e03rot', 'BORJA · ZARAGOZA', 540, 260)}${etiqueta('e03rot2', 'SANTUARIO DE MISERICORDIA', 540, 360)}</g>
    <g id="e03b" style="display:none"><g id="e03zoomB">${fondo(iglesia())}${cuadro('e03c', false)}</g>${etiqueta('e03ano', 'HACIA 1930', 540, 1560)}</g>`,
  e04: `<g id="e04zoom">${fondo(iglesia())}${cuadro('e04orig', false)}<g id="e04rest" opacity="0">${cuadro('e04r', true)}</g>
    ${sombra(330, 1330, 110)}<g stroke="#0B0E13" stroke-width="5"><path d="M260 1330 L290 1125 M400 1330 L370 1125" stroke="#8A8A8A" stroke-width="12"/><path d="M270 1260 H390 M280 1195 H380" stroke="#8A8A8A" stroke-width="10"/><rect x="270" y="1118" width="120" height="16" fill="#6A6A6A"/></g>
    <g id="e04cec">${capa(cecilia.pintando(), 130, 418, 1)}</g></g>${etiqueta('e04rot', 'CECILIA · 81 AÑOS', 540, 260)}`,
  e05: `<rect width="1080" height="1920" fill="#14100C"/><circle cx="540" cy="900" r="700" fill="url(#hFocoG)"/>
    <g id="e05a"><g transform="translate(40 560) scale(1.6)">${capa(cuadroOriginal(), 0, 0, 1)}<rect width="300" height="400" fill="none" stroke="#6A4222" stroke-width="14"/></g>
      <text x="280" y="1290" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="60" fill="#F2E6CF">ANTES</text></g>
    <g id="e05b" opacity="0"><g transform="translate(560 560) scale(1.6)">${capa(cuadroRestaurado(), 0, 0, 1)}<rect width="300" height="400" fill="none" stroke="#6A4222" stroke-width="14"/></g>
      <text x="800" y="1290" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="60" fill="#FFD34D">DESPUÉS</text></g>`,
  e06: `<rect width="1080" height="1920" fill="#14100C"/><circle cx="540" cy="700" r="650" fill="url(#hFocoG)"/>
    <g transform="translate(300 260) scale(1.6)">${capa(cuadroRestaurado(), 0, 0, 1)}<rect width="300" height="400" fill="none" stroke="#6A4222" stroke-width="14"/></g>
    <path d="M0 1500 H1080 V1920 H0 Z" fill="#8A6A40"/>${sombra(540, 1500, 130)}
    <g id="e06tinta"><g id="e06a">${capa(tinta({ pose: 'tranquilo' }), 390, 1120, 1.0)}</g><g id="e06b" style="display:none">${capa(tinta({ pose: 'desconfia' }), 390, 1120, 1.0)}</g>
      <g id="e06c" style="display:none">${capa(tinta({ pose: 'susto' }), 390, 1120, 1.0)}</g></g>`,
  e07: `${fondo(archivoSinMesa)}<g id="e07lucia"><g id="e07F">${capa(luciaFrente({ cara: 'esceptica' }), 290, 760, 1.25, '', 'lucia')}</g>
      <g id="e07S" style="display:none">${capa(luciaFrente({ cara: 'sorpresa' }), 290, 760, 1.25, '', 'lucia')}</g>
      <g id="e07P" style="display:none">${capa(luciaPerfil(), 290, 760, 1.25, '', 'lucia')}</g></g>${mesa()}`,
  e08: `<rect width="1080" height="1920" fill="#0E1A26"/>
    <g opacity="0.25" stroke="#3A6A8A" stroke-width="3" fill="none">${[0, 1, 2, 3, 4, 5, 6].map(i => `<ellipse cx="540" cy="960" rx="${80 + i * 80}" ry="${520}"/>`).join('')}${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M0 ${360 + i * 140} H1080"/>`).join('')}</g>
    ${movil(250, 520, -8, 'ECCE MONO', 0)}${movil(800, 470, 7, 'MONKEY CHRIST', 1)}${movil(540, 980, 0, '¡VIRAL!', 2)}${movil(240, 1430, 6, 'BBC NEWS', 3)}${movil(830, 1440, -6, 'OMG 😂', 4)}
    <g id="e08sello" opacity="0" transform="translate(540 960) rotate(-8)"><rect x="-420" y="-110" width="840" height="220" rx="14" fill="#F2E6CF"/><rect x="-420" y="-110" width="840" height="220" rx="14" fill="none" stroke="#C0392B" stroke-width="16"/>
      <text x="0" y="50" text-anchor="middle" font-family="Inter" font-weight="900" font-size="150" fill="#C0392B">ECCE MONO</text></g>`,
  e09: `<g id="e09zoom">${fondo(santuario())}${multitud(190, 7)}</g>
    <rect id="e09flash" width="1080" height="1920" fill="#fff" opacity="0"/>
    <g id="e09cont" opacity="0"><rect x="200" y="240" width="680" height="210" rx="14" fill="#0B0E13" opacity="0.85"/>
      <text id="e09num" x="540" y="370" text-anchor="middle" font-family="Inter" font-weight="900" font-size="110" fill="#FFD34D">0</text><text x="540" y="420" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#F2E6CF">VISITANTES</text></g>
    ${etiqueta('e09hab', 'BORJA: 5.000 HABITANTES', 540, 580)}`,
  e10: `<g id="e10zoom">${fondo(iglesia())}${cuadro('e10c', true)}
    ${sombra(290, 1500, 150)}<rect x="150" y="1280" width="300" height="200" fill="#7A4E2A" stroke="#0B0E13" stroke-width="5"/><rect x="140" y="1266" width="320" height="22" fill="#8A5A30" stroke="#0B0E13" stroke-width="4"/>
    <g id="e10cartel" opacity="0"><rect x="190" y="1110" width="220" height="150" rx="8" fill="#F2E6CF" stroke="#0B0E13" stroke-width="5"/>
      <text x="300" y="1170" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#0B0E13">ENTRADA</text>
      <text x="300" y="1236" text-anchor="middle" font-family="Inter" font-weight="900" font-size="64" fill="#C0392B">2 €</text></g>
    ${sombra(780, 1660, 100)}${capa(luciaFrente({ cara: 'explicando' }), 650, 1000, 0.92, '', 'lucia')}</g>`,
  e11: `<g id="e11zoom">${fondo(santuario())}${multitud(170, 3, { hueco: [560, 1830, 170] })}
    <g id="e11teo">${teoMini('chulo', 560, 1860)}</g></g>`,
  e12: `<g id="e12zoom">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'chulo' }), 290, 760, 1.25, '', 'teo')}${mesa()}<g transform="translate(560 1505) scale(0.55 0.22)">${capa(O.expediente(), 0, 0, 1)}</g></g>`,
  e13: `<rect width="1080" height="1920" fill="#07090D"/><circle cx="540" cy="760" r="520" fill="url(#hFocoG)"/>
    <g id="e13tinta" opacity="0">${capa(tinta({ pose: 'desconfia' }), 390, 520, 1.0)}</g>
    <g id="e13txt" opacity="0"><text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">¿Obra maestra</text>
      <text x="540" y="1160" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">o desastre?</text>
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
    case 'e01': $('e01zoom').setAttribute('transform', \`translate(540 900) scale(\${1.5 + 0.9 * suave(prog(d, 0, 4))}) translate(-620 -640)\`); break;
    case 'e02': $('e02zoom').setAttribute('transform', \`translate(540 1150) scale(\${2.3 + 0.1 * suave(p)}) translate(-640 -1520)\`); zoom('e02teo', resp, 640, 1640);
      op('e02rot', prog(d, 0.15, 0.5)); $('e02rot').setAttribute('transform', \`translate(540 300) scale(\${1.25 - 0.25 * suave(prog(d, 0.15, 0.45))})\`); break;
    case 'e03': { const b = t >= T.santuario + 0.3; ver('e03a', !b); ver('e03b', b);
      zoom('e03zoomA', 1 + 0.1 * prog(t, e.ini, T.santuario), 600, 1200); op('e03rot', prog(d, 0.2, 0.6)); op('e03rot2', prog(d, 0.6, 1));
      $('e03zoomB').setAttribute('transform', \`translate(540 900) scale(\${1.7 + 0.5 * suave(prog(t, T.santuario, e.fin))}) translate(-620 -620)\`);
      op('e03ano', prog(t, T.santuario + 0.6, T.santuario + 1.0) * (1 - prog(t, T.humedad - 1, T.humedad - 0.6)));
      $('e03c').setAttribute('opacity', 1 - 0.35 * prog(t, T.humedad, e.fin)); break; }
    case 'e04': { zoom('e04zoom', 1.05, 400, 900); op('e04rot', prog(d, 0.3, 0.7) * (1 - prog(t, T.decide - 0.6, T.decide - 0.2)));
      const pinta = t >= T.decide + 0.5; $('e04cec').setAttribute('transform', \`translate(\${pinta ? 4 * Math.sin(t * 9) : 0} \${pinta ? 3 * Math.cos(t * 9) : 0})\`);
      op('e04rest', 0.85 * prog(t, T.decide + 0.5, e.fin + 0.5)); break; }
    case 'e05': { const k = suave(prog(d, 1.2, 1.6)); op('e05b', k); $('e05b').setAttribute('transform', \`translate(\${200 * (1 - k)} 0)\`); break; }
    case 'e06': { const fase = d < 0.5 ? 'a' : d < 0.95 ? 'b' : 'c'; ver('e06a', fase === 'a'); ver('e06b', fase === 'b'); ver('e06c', fase === 'c');
      const cae = suave(prog(d, 0.95, 1.2)); $('e06tinta').setAttribute('transform', \`translate(\${-30 * cae} \${40 * cae}) rotate(\${-70 * cae} 540 1500)\`); break; }
    case 'e07': { const an = d < 0.9 ? 1 : 0, s = t >= T.madre; andar('e07lucia', an); ver('e07P', an); ver('e07F', !an && !s); ver('e07S', !an && s);
      mueve('e07lucia', -620 * (1 - suave(prog(d, 0, 0.9))), -paso(t) * an); break; }
    case 'e08': document.querySelectorAll('#e08 .movil').forEach(m => { const i = +m.dataset.i, k = suave(prog(t, e.ini + 0.3 + i * 0.6, e.ini + 0.6 + i * 0.6));
        m.setAttribute('opacity', k * (1 - 0.6 * prog(t, T.ecce_mono - 0.2, T.ecce_mono))); });
      { const s = prog(t, T.ecce_mono - 0.1, T.ecce_mono + 0.05); op('e08sello', s); $('e08sello').setAttribute('transform', \`translate(540 960) rotate(-8) scale(\${1.6 - 0.6 * suave(s)})\`); } break;
    case 'e09': { $('e09zoom').setAttribute('transform', \`translate(540 1920) scale(\${1.3 + 0.08 * suave(p)}) translate(-560 -1920)\`);
      op('e09flash', Math.max(0, 0.5 - 6 * Math.min(...[1.3, 2.6, 4.1, 5.5].map(f => Math.abs(d - f)))));
      const k = prog(t, T.ciento - 0.1, T.ciento + 1.4); op('e09cont', prog(t, T.ciento - 0.3, T.ciento));
      $('e09num').textContent = Math.round(160000 * suave(k)).toLocaleString('es-ES');
      op('e09hab', prog(t, T.cinco - 0.2, T.cinco + 0.2)); break; }
    case 'e10': zoom('e10zoom', 1.05 + 0.05 * p, 400, 1200); { const s = prog(t, T.dos - 0.2, T.dos + 0.1); op('e10cartel', s); } break;
    case 'e11': $('e11zoom').setAttribute('transform', \`translate(540 1920) scale(\${2.1 - 1.1 * suave(prog(t, T.mundo - 1.5, e.fin))}) translate(\${-560 + 20 * suave(prog(t, T.mundo - 1.5, e.fin))} -1920)\`); zoom('e11teo', resp, 560, 1860); break;
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
  pg.on('pageerror', e => console.log('ERROR:', e.message));
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  if (modo === 'fotos') {
    fs.mkdirSync(salida, { recursive: true });
    for (const t of tiempos) { await pg.evaluate(t => render(t), +t); await pg.screenshot({ path: path.join(salida, `t${(+t).toFixed(1).padStart(5, '0')}.png`) }); }
  } else {
    const total = Math.ceil(LT.duracion * FPS);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', path.join(__dirname, 'salida/audio_003.wav'),
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
