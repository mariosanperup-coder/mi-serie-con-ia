// Episodio 001 — El caso Manises (VERSIÓN LARGA). Anima las escenas y exporta el vídeo vertical 1080x1920 a 30 fps.
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
const archivo = F('f09_archivo');
const LT = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/linea_tiempo_001_v2.json')));
const BOCA = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/boca_001_v2.json'))).boca;
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

// --- piezas reutilizables ---
const archivoSinMesa = archivo({ conMesa: false }), mesa = () => `<g>${aislar(archivo.mesa())}</g>`;
const pista = F('f01_pista_noche')(), mapa = () => F('f05_mapa')(), mar = () => F('f02_cielo_mar')();
const teoPista = (p, cara = 'serio') => `<g id="${p}zoom">${fondo(pista)}
  <g id="${p}teo"><ellipse cx="620" cy="1712" rx="130" ry="16" fill="#000" opacity="0.45"/>
    <g id="${p}F">${capa(teoFrente({ cara }), 420, 1000, 1, '', 'teo')}${capa(tinta({ pose: 'tranquilo' }), 642, 1100, 0.34)}</g>
    <g id="${p}P" style="display:none">${capa(teoPerfil(), 420, 1000, 1, '', 'teo')}${capa(tinta({ pose: 'tranquilo' }), 518, 1100, 0.34)}</g></g></g>`;
const etiqueta = (id, txt, x, y) => `<g id="${id}" opacity="0"><rect x="${x - txt.length * 17 - 24}" y="${y - 50}" width="${txt.length * 34 + 48}" height="72" rx="6" fill="#0B0E13" opacity="0.85"/>
  <text x="${x}" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="46" fill="#F2E6CF">${txt}</text></g>`;
const rotuloCanal = id => `<g id="${id}" opacity="0" transform="translate(540 300)">
  <rect x="-300" y="-112" width="600" height="86" rx="8" fill="#0B0E13" opacity="0.55" transform="rotate(-2)"/>
  <rect x="-300" y="-112" width="600" height="86" rx="8" fill="none" stroke="#C0392B" stroke-width="8" transform="rotate(-2)"/>
  <text x="0" y="-50" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="62" letter-spacing="12" fill="#E0503E" transform="rotate(-2)">EXPEDIENTE</text>
  <text x="0" y="130" text-anchor="middle" font-family="Inter" font-weight="900" font-size="200" fill="#F2B35A" stroke="#0B0E13" stroke-width="14" paint-order="stroke">VELA</text></g>`;
const avionMapa = id => `<g id="${id}"><circle r="20" fill="#B3261E" stroke="#151515" stroke-width="4"/></g>`;
const ruta = (id, d) => `<path id="${id}" d="${d}" fill="none" stroke="#B3261E" stroke-width="10" stroke-dasharray="26 14" stroke-linecap="round"/>`;

const ESCENAS = {
  e01: teoPista('e01'),
  e02: `${teoPista('e02', 'chulo')}${rotuloCanal('e02rot')}`,
  e03: `<g id="e03a"><g id="e03mapa">${fondo(mapa())}${ruta('e03ruta', 'M1150 220 L720 955 L-160 1990')}${avionMapa('e03avion')}</g>
      ${etiqueta('e03salz', 'DESDE SALZBURGO', 640, 200)}${etiqueta('e03lp', 'RUMBO A LAS PALMAS', 540, 1560)}</g>
    <g id="e03b" style="display:none"><g id="e03pan">${fondo(mar())}</g>${luzRoja('e03l1', 0, 0, 14)}${luzRoja('e03l2', 0, 0, 14)}
      ${capa(O.avion(), 0, 0, 0.55, 'e03avionB')}${rotulo('e03rot', '11 NOV 1979 · 23:00')}</g>`,
  e04: `<g id="e04a"><g id="e04giro">${fondo(F('f04_ventanilla')())}${luzRoja('e04l1', 640, 640, 20)}${luzRoja('e04l2', 820, 720, 20)}
      ${capa(S.comandante.radio('preocupado'), -60, 980, 1.55, 'e04com')}</g></g>
    <g id="e04b" style="display:none"><g id="e04zoom">${fondo(F('f11_sala_radar')())}</g>${rotulo('e04rot', 'RADAR DE TORREJÓN')}</g>`,
  e05: `<g id="e05pan">${fondo(mar())}</g>${luzRoja('e05l1', 0, 0, 16)}${luzRoja('e05l2', 0, 0, 16)}${capa(O.avion(), 0, 0, 0.55, 'e05avion')}`,
  e06: `<rect width="1080" height="1920" fill="#0D1418"/><circle cx="540" cy="900" r="700" fill="url(#hFocoG)"/>
    <g id="e06tinta"><g id="e06a">${capa(tinta({ pose: 'tranquilo' }), 210, 520, 2.2)}</g>
      <g id="e06b" style="display:none">${capa(tinta({ pose: 'desconfia' }), 210, 520, 2.2)}</g>
      <g id="e06c" style="display:none">${capa(tinta({ pose: 'susto' }), 210, 520, 2.2)}</g></g>`,
  e07: `<g id="e07a">${fondo(F('f10_cabina_pasajeros')())}</g>
    <g id="e07b" style="display:none"><g id="e07zoom">${fondo(mapa())}${ruta('e07ruta', 'M720 955 C650 1150 560 1320 470 1360 C380 1390 300 1250 270 907')}${avionMapa('e07avion')}</g>
      ${etiqueta('e07rot', 'MANISES', 460, 860)}</g>
    <g id="e07c" style="display:none">${fondo(pista)}${luzRoja('e07l1', 0, 0, 12)}${luzRoja('e07l2', 0, 0, 12)}${capa(O.avion(), 0, 0, 0.4, 'e07avionC')}</g>`,
  e08: `${fondo(archivoSinMesa)}<g id="e08lucia"><g id="e08F">${capa(luciaFrente({ cara: 'esceptica' }), 290, 760, 1.25, '', 'lucia')}</g>
      <g id="e08P" style="display:none">${capa(luciaPerfil(), 290, 760, 1.25, '', 'lucia')}</g></g>${mesa()}`,
  e09: `<g id="e09a">${fondo(archivoSinMesa)}<g id="e09teo"><g id="e09F">${capa(teoFrente({ cara: 'chulo' }), 290, 760, 1.25, '', 'teo')}</g>
      <g id="e09P" style="display:none" transform="translate(1080 0) scale(-1 1)">${capa(teoPerfil(), 290, 760, 1.25, '', 'teo')}</g></g>${mesa()}</g>
    <g id="e09b" style="display:none">${fondo(F('f06_torre_control')())}${luzRoja('e09l1', 420, 620, 12)}${luzRoja('e09l2', 520, 660, 12)}
      ${capa(S.controladora.sorpresa(), 300, 1120, 1.1)}${capa(S.controlador.senala(), -40, 1060, 1.25)}</g>`,
  e10: `${fondo(F('f07_base_aerea')())}${capa(O.caza({ postquemador: true }), 0, 0, 0.6, 'e10caza')}${rotulo('e10rot', 'BASE DE LOS LLANOS')}`,
  e11: `<g id="e11pan">${fondo(F('f08_cielo_nubes')())}</g>${luzRoja('e11luz', 0, 0, 16)}${capa(O.caza({ postquemador: true }), 0, 0, 0.5, 'e11caza')}`,
  e12: `<g id="e12shake">${fondo(F('f12_cabina_caza')())}${luzRoja('e12luz', 0, 0, 12)}</g><rect id="e12estatica" width="1080" height="1920" fill="#9FB7C4" opacity="0"/>`,
  e13: `<g id="e13a"><g id="e13zoom">${fondo(F('f14_hemiciclo')())}</g>${rotulo('e13rot', 'CONGRESO · 1980')}</g>
    <g id="e13b" style="display:none">${fondo(archivoSinMesa)}${capa(luciaFrente({ cara: 'leyendo' }), 290, 760, 1.25, '', 'lucia')}${mesa()}
      ${capa(O.expediente({ abierto: true }), 0, 0, 1.2, 'e13exp')}
      <g id="e13sello" opacity="0"><rect x="-330" y="-62" width="660" height="124" rx="10" fill="none" stroke="#C0392B" stroke-width="12"/>
        <text x="0" y="26" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="78" fill="#C0392B">DESCLASIFICADO</text></g></g>
    <g id="e13c" style="display:none"><g id="e13zoomc">${fondo(F('f13_refineria')())}</g>${rotulo('e13rotc', 'ESCOMBRERAS · CARTAGENA')}</g>`,
  e14: `<g id="e14zoom">${fondo(F('f15_flota')())}</g>${rotulo('e14rot', 'SEXTA FLOTA DE EE. UU.')}`,
  e15: `<g id="e15zoom">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'serio' }), 290, 760, 1.25, '', 'teo')}${mesa()}</g>`,
  e16: teoPista('e16'),
  e17: `<rect width="1080" height="1920" fill="#07090D"/><circle cx="540" cy="760" r="520" fill="url(#hFocoG)"/>
    <g id="e17tinta" opacity="0">${capa(tinta({ pose: 'desconfia' }), 390, 520, 1.0)}</g>
    <g id="e17txt" opacity="0"><text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">¿Tú qué crees</text>
      <text x="540" y="1160" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" fill="#FFD34D" stroke="#0B0E13" stroke-width="12" paint-order="stroke">que era?</text>
      <text x="540" y="1290" text-anchor="middle" font-family="Inter" font-weight="700" font-size="52" fill="#F2E6CF">Te leo en comentarios ↓</text></g>`,
};

const html = `<!doctype html><html><head><style>body{margin:0;background:#000} .ojo{transform-box:fill-box;transform-origin:center}#sub tspan{paint-order:stroke}</style></head><body>
<svg id="lienzo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><radialGradient id="hRojoG"><stop offset="0" stop-color="#FF4A3A" stop-opacity="0.85"/><stop offset="1" stop-color="#FF4A3A" stop-opacity="0"/></radialGradient>
<radialGradient id="hFocoG"><stop offset="0" stop-color="#FFC066" stop-opacity="0.35"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient>
<radialGradient id="vineta" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs>
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
    else if (pi.classList.contains('sentada')) ang = -4 * Math.max(0, Math.sin(t * 7 + i)) ** 4;
    else ang = lado * 2.2 * Math.sin(t * 1.3 + i * 0.7) + 2.5 * Math.max(0, Math.sin(t * 0.8 + i)) ** 6 * lado;
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
    case 'e01': case 'e16': { const P = e.id; zoom(P + 'zoom', e.id === 'e01' ? 1 + 0.07 * suave(p) : 1.07 - 0.07 * suave(p), 620, 1300);
      const an = e.id === 'e01' && d < 1.6 ? 1 : 0, k = e.id === 'e01' ? suave(prog(d, 0, 1.6)) : 1; andar(P + 'teo', an); ver(P + 'P', an); ver(P + 'F', !an);
      $(P + 'teo').setAttribute('transform', \`translate(\${-900 * (1 - k)} \${-paso(t) * an}) translate(620 1712) scale(\${resp}) translate(-620 -1712)\`);
      if (e.id === 'e16') op('negro', prog(t, e.fin - 0.7, e.fin)); break; }
    case 'e02': zoom('e02zoom', 1 + 0.14 * suave(p), 620, 1150); ver('e02P', 0); ver('e02F', 1); zoom('e02teo', resp, 620, 1712);
      op('e02rot', prog(d, 0.15, 0.5)); $('e02rot').setAttribute('transform', \`translate(540 300) scale(\${1.25 - 0.25 * suave(prog(d, 0.15, 0.45))})\`); break;
    case 'e03': { const b = t >= T.eran; ver('e03a', !b); ver('e03b', b);
      if (!b) { const r = $('e03ruta'), L = r.getTotalLength(), k = suave(prog(t, e.ini + 0.3, T.eran - 0.4));
        r.setAttribute('stroke-dasharray', \`\${L * k} \${L}\`); const pt = r.getPointAtLength(L * k); $('e03avion').setAttribute('transform', \`translate(\${pt.x} \${pt.y})\`);
        op('e03salz', prog(t, e.ini + 0.2, e.ini + 0.6)); op('e03lp', prog(t, T.eran - 2, T.eran - 1.5)); zoom('e03mapa', 1.05 + 0.05 * p, 540, 960); }
      else { const q = prog(t, T.eran, e.fin); $('e03pan').setAttribute('transform', \`translate(\${-1400 * suave(q)} 0)\`);
        const ax = -700 + 1900 * q; mueve('e03avionB', ax, 780 + 20 * Math.sin(t * 1.3)); const lp = prog(t, T.eran + 3, T.eran + 4);
        luz('e03l1', ax - 140 + 30 * Math.sin(t * 2), 760 + 30 * Math.sin(t * 1.7), lp * (1 + 0.15 * Math.sin(t * 9)));
        luz('e03l2', ax - 230 + 30 * Math.cos(t * 2.3), 820 + 25 * Math.cos(t * 1.9), lp * (1 + 0.15 * Math.cos(t * 8)));
        op('e03rot', prog(t, T.eran + 0.3, T.eran + 0.8) * (1 - prog(t, e.fin - 1, e.fin - 0.5))); } break; }
    case 'e04': { const b = t >= T.radar - 0.5; ver('e04a', !b); ver('e04b', b);
      if (!b) { const cre = 0.8 + 0.4 * prog(t, e.ini, T.radar);
        $('e04l1').setAttribute('transform', \`translate(\${30 * Math.sin(t)} 0) translate(640 640) scale(\${cre * (1 + 0.12 * Math.sin(t * 10))}) translate(-640 -640)\`);
        $('e04l2').setAttribute('transform', \`translate(\${30 * Math.cos(t)} 0) translate(820 720) scale(\${cre * (1 + 0.12 * Math.cos(t * 11))}) translate(-820 -720)\`);
        zoom('e04com', resp, 250, 1900); }
      else { document.querySelectorAll('#e04b .barrido').forEach((g, i) => g.setAttribute('transform', \`rotate(\${-(t * 140 + i * 70) % 360} \${g.dataset.cx} \${g.dataset.cy})\`));
        zoom('e04zoom', 1 + 0.06 * prog(t, T.radar, e.fin), 540, 960); op('e04rot', prog(t, T.radar - 0.4, T.radar)); } break; }
    case 'e05': { $('e05pan').setAttribute('transform', \`translate(\${-1500 * suave(p)} 0)\`);
      const sube = suave(prog(d, 0.8, 4)), ax = 120 + 60 * Math.sin(t * 0.7), ay = 1000 - 400 * sube;
      mueve('e05avion', ax, ay, 1, -9 * Math.sin(Math.PI * prog(d, 0.8, 4.5)), 330, 100);
      luz('e05l1', ax + 770, ay + 30 + 15 * Math.sin(t * 2), 1 + 0.15 * Math.sin(t * 9)); luz('e05l2', ax + 860, ay + 90 + 15 * Math.cos(t * 2), 1 + 0.15 * Math.cos(t * 8)); break; }
    case 'e06': { const fase = d < 0.45 ? 'a' : d < 0.85 ? 'b' : 'c'; ver('e06a', fase === 'a'); ver('e06b', fase === 'b'); ver('e06c', fase === 'c');
      const mira = d >= 0.45 && d < 0.65 ? -1 : 1, tiembla = fase === 'c' ? 10 * Math.sin(d * 80) * Math.max(0, 1 - (d - 0.85) * 1.2) : 0;
      $('e06tinta').setAttribute('transform', \`translate(\${540 + tiembla} 0) scale(\${mira} 1) translate(-540 0)\`); break; }
    case 'e07': { const f = t < T.comandante ? 'a' : t < T.justo ? 'b' : 'c'; ver('e07a', f === 'a'); ver('e07b', f === 'b'); ver('e07c', f === 'c');
      if (f === 'a') { document.querySelectorAll('#e07a .ventanilla').forEach((v, i) => v.setAttribute('opacity', 0.7 + 0.3 * Math.sin(t * 6 + i)));
        $('e07a').setAttribute('transform', \`translate(540 900) scale(\${1 + 0.06 * prog(t, e.ini, T.comandante)}) translate(-540 -900)\`); }
      else if (f === 'b') { const r = $('e07ruta'), L = r.getTotalLength(), k = suave(prog(t, T.comandante + 0.2, T.justo - 0.7));
        r.setAttribute('stroke-dasharray', \`\${L * k} \${L}\`); const pt = r.getPointAtLength(L * k); $('e07avion').setAttribute('transform', \`translate(\${pt.x} \${pt.y})\`);
        op('e07rot', prog(t, T.justo - 0.9, T.justo - 0.6)); zoom('e07zoom', 1.05 + 0.1 * prog(t, T.comandante, T.justo), 480, 1100); }
      else { const k = prog(t, T.justo, e.fin - 0.2), x = -520 + 1000 * k, y = 420 + 560 * k; mueve('e07avionC', x, y, 1, 7, 240, 72);
        const vis = 1 - prog(t, T.desaparecen - 0.2, T.desaparecen + 0.4);
        luz('e07l1', x + 560, y - 10 + 10 * Math.sin(t * 3), vis * (1 + 0.15 * Math.sin(t * 9))); luz('e07l2', x + 640, y + 30 + 10 * Math.cos(t * 3), vis * (1 + 0.15 * Math.cos(t * 9))); } break; }
    case 'e08': { const an = d < 0.9 ? 1 : 0; andar('e08lucia', an); ver('e08P', an); ver('e08F', !an); mueve('e08lucia', -620 * (1 - suave(prog(d, 0, 0.9))), -paso(t) * an); break; }
    case 'e09': { const b = t >= T.aeropuerto; ver('e09a', !b); ver('e09b', b);
      const an = d < 0.9 ? 1 : 0; andar('e09teo', an); ver('e09P', an); ver('e09F', !an);
      $('e09teo').setAttribute('transform', \`translate(\${700 * (1 - suave(prog(d, 0, 0.9)))} \${-paso(t) * an}) translate(540 1650) scale(\${resp}) translate(-540 -1650)\`);
      $('e09l1').setAttribute('transform', \`translate(\${20 * Math.sin(t * 1.5)} 0)\`); $('e09l2').setAttribute('transform', \`translate(\${20 * Math.cos(t * 1.5)} 0)\`); break; }
    case 'e10': { const k = prog(t, e.ini + 0.3, e.fin - 0.2), x = -720 + 1500 * k * k, y = 1380 - 520 * Math.max(0, k - 0.3) ** 1.5;
      mueve('e10caza', x, y, 1, -14 * Math.max(0, k - 0.3), 360, 108); op('e10rot', prog(d, 0.2, 0.6) * (1 - prog(t, e.fin - 0.8, e.fin - 0.4))); break; }
    case 'e11': { $('e11pan').setAttribute('transform', \`translate(\${-2160 * p} 0)\`);
      mueve('e11caza', 40 + 30 * Math.sin(t * 1.3), 820 + 40 * Math.sin(t * 0.9), 1, 3 * Math.sin(t * 1.1), 300, 90);
      const huye = suave(prog(t, T.persigue_escapa - 0.3, T.persigue_escapa + 0.6));
      luz('e11luz', 820 + 60 * Math.sin(t * 2.2) + 900 * huye, 760 + 80 * Math.sin(t * 1.6) - 600 * huye, 1 + 0.2 * Math.sin(t * 12));
      if (Math.abs(t - T.sonido) < 0.25) $('e11pan').setAttribute('transform', \`translate(\${-2160 * p + 12 * Math.sin(t * 90)} \${8 * Math.cos(t * 70)})\`); break; }
    case 'e12': { const al = t >= T.alarma, falla = t >= T.alarma + 2.6 && t < T.alarma + 4.6;
      $('e12shake').setAttribute('transform', \`translate(\${(al ? 5 : 2) * Math.sin(t * 37)} \${(al ? 5 : 2) * Math.cos(t * 41)})\`);
      const on = al ? (Math.sin(t * 25) > 0 ? 1 : 0.2) : 0.25;
      document.querySelectorAll('#e12 [id$="_alarma"], #e12 [id$="_alarmaHalo"]').forEach(x => x.setAttribute('opacity', on));
      luz('e12luz', 520 + 40 * Math.sin(t * 0.8), 230 + 20 * Math.sin(t * 1.3), 1 + 0.2 * Math.sin(t * 10));
      op('e12estatica', falla ? 0.08 + 0.12 * Math.abs(Math.sin(t * 53)) : 0); break; }
    case 'e13': { const f = t < T.anos ? 'a' : t < T.antorchas ? 'b' : 'c'; ver('e13a', f === 'a'); ver('e13b', f === 'b'); ver('e13c', f === 'c');
      zoom('e13zoom', 1 + 0.08 * prog(t, e.ini, T.anos), 540, 1100); op('e13rot', prog(d, 0.2, 0.6));
      const k = suave(prog(t, T.anos + 0.1, T.anos + 0.5)); mueve('e13exp', 120, 260 + 300 * (1 - k), 0.9 + 0.1 * k); op('e13exp', k);
      const s = prog(t, T.desclasifico, T.desclasifico + 0.12); op('e13sello', s);
      $('e13sello').setAttribute('transform', \`translate(330 560) rotate(-14) scale(\${(1.6 - 0.6 * suave(s)) * 0.52})\`);
      zoom('e13zoomc', 1 + 0.06 * prog(t, T.antorchas, e.fin), 540, 1100); op('e13rotc', prog(t, T.antorchas, T.antorchas + 0.4));
      document.querySelectorAll('#e13c .llama').forEach((l, i) => { const cx = +l.dataset.cx, cy = +l.dataset.cy;
        l.setAttribute('transform', \`translate(\${cx} \${cy}) scale(\${1 + 0.08 * Math.sin(t * 13 + i)} \${1 + 0.2 * Math.sin(t * 9 + i * 2)}) translate(\${-cx} \${-cy})\`); }); break; }
    case 'e14': zoom('e14zoom', 1 + 0.08 * suave(p), 540, 1150); op('e14rot', prog(d, 0.2, 0.6)); break;
    case 'e15': zoom('e15zoom', 1 + 0.35 * suave(p), 540, 900); break;
    case 'e17': op('e17tinta', prog(d, 0.3, 0.8)); op('e17txt', prog(d, 0.6, 1.1)); op('negro', 1 - prog(d, 0, 0.4)); break;
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
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', path.join(__dirname, 'salida/audio_001_v2.wav'),
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
