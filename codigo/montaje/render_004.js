// Episodio 004 — El hombre pez de Liérganes. Anima las escenas y exporta el vídeo vertical 1080x1920 a 30 fps.
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
const L = require(B + '/personajes/lierganes');
const { figura } = require(B + '/personajes/figura');
const archivo = F('f09_archivo');
const LT = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/linea_tiempo_004.json')));
const BOCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/boca_004.json'))).boca;
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
const lierganes = () => F('004/d01_lierganes')(), bilbao = () => F('004/d02_bilbao')(), bahia = () => F('004/d03_bahia')(), orilla = () => F('004/d04_orilla')();
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
// Barca de pesca (caja propia) con dos pescadores tirando de la red. Centro de la barca en (x, y).
const barca = (x, y, s, conGente = true) => `<g transform="translate(${x} ${y}) scale(${s})">
  ${conGente ? capa(L.pescador.dos('decidido', true), -250, -470, 0.72) + capa(L.pescador.uno('decidido', true), -40, -470, 0.72) : ''}
  <path d="M-300 -60 Q0 -40 300 -60 L290 -20 Q0 0 -290 -20 Z" fill="#4A2E18"/>
  <path d="M-300 -60 H300 Q290 40 220 70 H-220 Q-290 40 -300 -60 Z" fill="#7A4E2A" stroke="#0B0E13" stroke-width="8"/>
  <path d="M-290 -30 H292 M-270 10 H272" stroke="#5A3A1E" stroke-width="6"/><path d="M-300 -60 H300" stroke="#9A6A3A" stroke-width="12"/>
  <path d="M-320 70 Q0 100 320 70" stroke="#E8F4F0" stroke-width="8" fill="none" opacity="0.8"/></g>`;
const redConPez = (id) => `<g id="${id}">
  <svg x="-200" y="-130" width="400" height="240" viewBox="0 0 400 240" overflow="visible">${aislar(L.nadando()).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>
  <g stroke="#8A6A40" stroke-width="4" fill="none">${Array.from({ length: 11 }, (_, i) => `<path d="M${-220 + i * 44} -160 Q${-200 + i * 40} 40 ${-180 + i * 36} 140"/>`).join('')}${Array.from({ length: 8 }, (_, j) => `<path d="M-220 ${-160 + j * 40} Q0 ${-120 + j * 44} 220 ${-160 + j * 40}"/>`).join('')}</g>
  ${[-160, -60, 40, 140].map(x => `<circle cx="${x}" cy="-160" r="14" fill="#C08A3A" stroke="#0B0E13" stroke-width="3"/>`).join('')}</g>`;

const ESCENAS = {
  e01: `<g id="e01zoom">${fondo(bahia())}${barca(540, 1420, 0.85)}<g id="e01red" transform="translate(700 1560)">${redConPez('e01rp')}</g>
    <rect x="0" y="1560" width="1080" height="360" fill="#14706E" opacity="0.55"/></g>`,
  e02: `<g id="e02zoom">${fondo(lierganes())}<g id="e02teo">${pie(teoFrente({ cara: 'chulo' }), 300, 1760, 0.55, '', 'teo')}${capa(tinta({ pose: 'tranquilo' }), 300 - 110 + 122, 1760 - 392 + 55, 0.19)}</g></g>${rotuloCanal('e02rot')}`,
  e03: `<g id="e03zoom">${fondo(bilbao())}<g id="e03fr">${capa(L.nadando(), 0, 0, 0.75)}</g></g>${etiqueta('e03rot', 'BILBAO · 1674', 540, 260)}`,
  e04: `<g id="e04zoom">${fondo(bahia())}${barca(400, 1400, 0.85)}<g id="e04fr" opacity="0">${capa(L.nadando(), 0, 0, 0.6)}</g>
    <g id="e04red" opacity="0" transform="translate(760 1500) scale(0.7)">${redConPez('e04rp')}</g></g>${etiqueta('e04rot', 'CÁDIZ · 1679', 540, 260)}
    <g id="e04pan" opacity="0" transform="translate(540 760)"><ellipse rx="160" ry="100" fill="#C88A3A" stroke="#0B0E13" stroke-width="8"/><path d="M-80 -30 q30 -30 60 0 M10 -30 q30 -30 60 0" stroke="#8A5A20" stroke-width="10" fill="none"/></g>`,
  e05: `<g id="e05zoom">${fondo(orilla())}${pie(L.francisco.pez(), 560, 1640, 0.62, '', 'fr')}</g>${etiqueta('e05rot', '«LIÉRGANES»', 540, 300)}`,
  e06: `<g id="e06zoom">${fondo(orilla())}<g id="e06pez"><path d="M-60 0 Q0 -40 60 0 Q0 40 -60 0 Z M60 0 L100 -30 V30 Z" fill="#5E9A90" stroke="#0B0E13" stroke-width="5"/><circle cx="-30" cy="-6" r="6" fill="#0B0E13"/></g>
    ${sombra(560, 1640, 60)}<g id="e06tinta"><g id="e06a">${capa(tinta({ pose: 'tranquilo' }), 470, 1528, 0.3)}</g><g id="e06b" style="display:none">${capa(tinta({ pose: 'desconfia' }), 470, 1528, 0.3)}</g>
      <g id="e06c" style="display:none">${capa(tinta({ pose: 'susto' }), 470, 1528, 0.3)}</g></g></g>`,
  e07: `${fondo(archivoSinMesa)}<g id="e07lucia"><g id="e07F">${capa(luciaFrente({ cara: 'esceptica' }), 290, 760, 1.25, '', 'lucia')}</g>
      <g id="e07P" style="display:none">${capa(luciaPerfil(), 290, 760, 1.25, '', 'lucia')}</g></g>${mesa()}`,
  e08: `<g id="e08a">${fondo(archivoSinMesa)}<g id="e08teo"><g id="e08F">${capa(teoFrente({ cara: 'chulo' }), 290, 760, 1.25, '', 'teo')}</g>
      <g id="e08P" style="display:none" transform="translate(1080 0) scale(-1 1)">${capa(teoPerfil(), 290, 760, 1.25, '', 'teo')}</g></g>${mesa()}</g>
    <g id="e08b" style="display:none"><g transform="translate(540 1920) scale(1.25) translate(-540 -1920)">${fondo(orilla())}
      ${pie(L.pescador.dos('sorpresa'), 230, 1700, 0.5)}${pie(L.francisco.pez(), 470, 1640, 0.48)}${pie(L.secretario.depie('decidido'), 760, 1700, 0.52)}</g>${etiqueta('e08rot', 'SECRETARIO DEL SANTO OFICIO', 540, 300)}</g>`,
  e09: `<g id="e09zoom">${fondo(lierganes())}${pie(L.francisco.normal('serio'), 170, 1840, 0.55)}
    <g id="e09m1">${pie(L.madre.depie('preocupado'), 400, 1800, 0.5)}</g><g id="e09m2" style="display:none">${pie(L.madre.depie('sorpresa', true), 400, 1800, 0.5)}</g></g>${etiqueta('e09rot', 'LIÉRGANES · CANTABRIA', 540, 260)}`,
  e10: `<g id="e10zoom">${fondo(lierganes())}<g id="e10fr"><g id="e10andar">${capa(L.francisco.andando(), 0, 0, 0.5, '', 'fr')}</g></g>
    <g id="e10ondas" opacity="0">${[0, 1, 2].map(i => `<ellipse cx="520" cy="1540" rx="${50 + i * 45}" ry="${18 + i * 14}" fill="none" stroke="#E8F4F0" stroke-width="5"/>`).join('')}</g></g>
    ${etiqueta('e10rot', 'PEDREÑA → SANTANDER', 540, 260)}`,
  e11: `${fondo(archivoSinMesa)}${capa(luciaFrente({ cara: 'leyendo' }), 290, 760, 1.25, '', 'lucia')}${mesa()}
    <g transform="translate(560 1505) scale(0.5 0.24)"><rect x="-220" y="-160" width="440" height="320" fill="#6A3E1E" stroke="#0B0E13" stroke-width="10"/><rect x="-200" y="-140" width="400" height="280" fill="#E8D8B0"/></g>
    ${etiqueta('e11rot', 'FEIJOO · 1726', 540, 260)}${etiqueta('e11rot2', 'GREGORIO MARAÑÓN', 540, 360)}`,
  e12: `<g id="e12zoom">${fondo(lierganes())}${sombra(140, 1780, 90)}${capa(L.estatua(), 140 - 200 * 0.55, 1780 - 900 * 0.55, 0.55)}</g>`,
  e13: `<g id="e13zoom">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'chulo' }), 290, 760, 1.25, '', 'teo')}${mesa()}<g transform="translate(560 1505) scale(0.55 0.22)">${capa(O.expediente(), 0, 0, 1)}</g></g>`,
  e14: `<rect width="1080" height="1920" fill="#07090D"/><circle cx="540" cy="760" r="520" fill="url(#hFocoG)"/>
    <g id="e14tinta" opacity="0">${capa(tinta({ pose: 'desconfia' }), 390, 520, 1.0)}</g>
    <g id="e14txt" opacity="0"><text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">¿Leyenda o</text>
      <text x="540" y="1160" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">realidad?</text>
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
    case 'e01': { zoom('e01zoom', 1.1 + 0.1 * suave(p), 620, 1450); const k = suave(prog(d, 0.3, 3)); $('e01red').setAttribute('transform', \`translate(700 \${1640 - 260 * k})\`); break; }
    case 'e02': $('e02zoom').setAttribute('transform', \`translate(540 1920) scale(\${1.35 + 0.08 * suave(p)}) translate(-420 -1920)\`); zoom('e02teo', resp, 300, 1760);
      op('e02rot', prog(d, 0.15, 0.5)); $('e02rot').setAttribute('transform', \`translate(540 300) scale(\${1.25 - 0.25 * suave(prog(d, 0.15, 0.45))})\`); break;
    case 'e03': { op('e03rot', prog(d, 0.2, 0.6) * (1 - prog(d, 3.5, 4)));
      const k = prog(t, e.ini, T.corriente), hunde = suave(prog(t, T.corriente, T.corriente + 1.6));
      $('e03fr').setAttribute('transform', \`translate(\${-120 + 520 * k + 300 * hunde} \${1380 + 12 * Math.sin(t * 3) + 160 * hunde}) rotate(\${-10 * hunde})\`); op('e03fr', 1 - hunde);
      zoom('e03zoom', 1.05 + 0.08 * p, 540, 1400); break; }
    case 'e04': { op('e04rot', prog(d, 0.2, 0.6) * (1 - prog(d, 3, 3.5))); zoom('e04zoom', 1.1, 540, 1450);
      const v = prog(t, T.parece - 2.5, T.atrapan); op('e04fr', prog(t, T.parece - 2.5, T.parece - 2) * (t < T.atrapan ? 1 : 0));
      $('e04fr').setAttribute('transform', \`translate(\${980 - 360 * v} \${1440 + 10 * Math.sin(t * 3)})\`);
      op('e04red', t >= T.atrapan ? 1 : 0); $('e04red').setAttribute('transform', \`translate(780 \${1560 - 160 * suave(prog(t, T.atrapan, T.atrapan + 1))}) scale(0.7)\`);
      const pn = prog(t, T.pan - 0.2, T.pan + 0.1) * (1 - prog(t, e.fin - 0.4, e.fin)); op('e04pan', pn); break; }
    case 'e05': $('e05zoom').setAttribute('transform', \`translate(540 1150) scale(\${1.5 + 0.35 * suave(p)}) translate(-560 -1300)\`); op('e05rot', prog(t, T.lierganes5 - 0.2, T.lierganes5 + 0.1)); break;
    case 'e06': { const fase = d < 0.5 ? 'a' : d < 0.85 ? 'b' : 'c'; ver('e06a', fase === 'a'); ver('e06b', fase === 'b'); ver('e06c', fase === 'c');
      zoom('e06zoom', 1.6, 560, 1450); const k = prog(d, 0.4, 1.2);
      $('e06pez').setAttribute('transform', \`translate(\${760 + 120 * k} \${1230 - 260 * Math.sin(Math.PI * k)}) rotate(\${-40 + 80 * k})\`); op('e06pez', k > 0 && k < 1 ? 1 : 0);
      const tiembla = fase === 'c' ? 8 * Math.sin(d * 80) * Math.max(0, 1 - (d - 0.85) * 1.2) : 0; $('e06tinta').setAttribute('transform', \`translate(\${tiembla} 0)\`); break; }
    case 'e07': { const an = d < 0.9 ? 1 : 0; andar('e07lucia', an); ver('e07P', an); ver('e07F', !an); mueve('e07lucia', -620 * (1 - suave(prog(d, 0, 0.9))), -paso(t) * an); break; }
    case 'e08': { const b = t >= T.hasta; ver('e08a', !b); ver('e08b', b); const an = d < 0.9 ? 1 : 0; andar('e08teo', an); ver('e08P', an); ver('e08F', !an);
      $('e08teo').setAttribute('transform', \`translate(\${700 * (1 - suave(prog(d, 0, 0.9)))} \${-paso(t) * an}) translate(540 1650) scale(\${resp}) translate(-540 -1650)\`);
      op('e08rot', prog(t, T.hasta + 0.2, T.hasta + 0.6)); break; }
    case 'e09': { $('e09zoom').setAttribute('transform', \`translate(540 1920) scale(\${1.45 + 0.08 * p}) translate(-360 -1920)\`); op('e09rot', prog(d, 0.2, 0.6) * (1 - prog(d, 2.5, 3)));
      const m = t >= T.madre; ver('e09m1', !m); ver('e09m2', m); break; }
    case 'e10': { $('e10zoom').setAttribute('transform', \`translate(540 1920) scale(1.4) translate(-480 -1920)\`);
      const k = prog(t, e.ini, T.volvio + 0.6), x = 40 + 360 * k, y = 1880 - 320 * k, entra = suave(prog(t, T.volvio + 0.6, T.volvio + 1.8)); andar('e10andar', k < 1 ? 1 : 0.6);
      $('e10fr').setAttribute('transform', \`translate(\${x + 110 * entra - 100 * (1 - 0.3 * k)} \${y - 30 * entra - 356 * (1 - 0.3 * k) - paso(t)}) scale(\${1 - 0.3 * k})\`);
      op('e10fr', 1 - prog(t, T.volvio + 0.7, T.volvio + 1.4)); op('e10ondas', prog(t, T.volvio + 0.8, T.volvio + 1.2) * (1 - prog(t, e.fin - 0.8, e.fin)));
      op('e10rot', prog(t, T.carta - 0.2, T.carta + 0.2) * (1 - prog(t, T.volvio - 0.6, T.volvio - 0.2))); break; }
    case 'e11': op('e11rot', prog(d, 0.3, 0.7)); op('e11rot2', prog(t, T.maranon - 0.3, T.maranon)); break;
    case 'e12': $('e12zoom').setAttribute('transform', \`translate(540 1920) scale(\${1.5 + 0.2 * suave(p)}) translate(-360 -1920)\`); break;
    case 'e13': zoom('e13zoom', 1 + 0.2 * suave(p), 540, 1000); op('negro', prog(t, e.fin - 0.7, e.fin)); break;
    case 'e14': op('e14tinta', prog(d, 0.3, 0.8)); op('e14txt', prog(d, 0.6, 1.1)); op('negro', 1 - prog(d, 0, 0.4)); break;
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
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', path.join(__dirname, 'salida/audio_004.wav'),
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
