// Miniaturas v2 (estilo cartel de cine) para 002, 003 y 004. Uso: node miniaturas_v2.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { maria } = require('../personajes/belmez');
const { cecilia, cuadroOriginal, cuadroRestaurado } = require('../personajes/borja');
const L = require('../personajes/lierganes');
const { tinta } = require('../personajes/tinta');
const { teoFrente } = require('../personajes/teo');
let n = 0;
const aislar = s => { const p = 'v' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const interior = s => aislar(s).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const capa = (svg, x, y, esc, extra = '') => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number); return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible" ${extra}>${interior(svg)}</svg>`; };
const T = '#0B0E13';

// Comunes: grano, viñeta, sombra de texto, sello del canal
const defsComunes = (W, H) => `<filter id="grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.09 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <radialGradient id="vin" cx="0.5" cy="0.5" r="0.75"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.78"/></radialGradient>
  <filter id="sombraTxt" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.7"/></filter>
  <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>`;
const acabado = (W, H) => `<rect width="${W}" height="${H}" fill="url(#vin)"/><rect width="${W}" height="${H}" filter="url(#grano)"/>`;
const sello = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="300" height="56" rx="10" fill="#0B0E13" opacity="0.82"/><rect x="0" y="0" width="300" height="56" rx="10" fill="none" stroke="#F2B35A" stroke-width="3"/>
  <circle cx="30" cy="28" r="11" fill="#FFC066"/><circle cx="30" cy="28" r="20" fill="#FFC066" opacity="0.25"/>
  <text x="54" y="37" font-family="JetBrains Mono" font-weight="800" font-size="22" letter-spacing="3" fill="#F2E6CF">EXPEDIENTE VELA</text></g>`;
// Título en dos líneas: la de arriba blanca, la de abajo en color con brillo detrás.
const titulo = (x, y, l1, l2, tam, color, anchor = 'start') => `<g filter="url(#sombraTxt)">
  <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Inter" font-weight="900" font-size="${tam * 0.62}" letter-spacing="2" fill="#FFFFFF" stroke="${T}" stroke-width="${tam * 0.08}" paint-order="stroke">${l1}</text>
  <text x="${x}" y="${y + tam * 0.98}" text-anchor="${anchor}" font-family="Inter" font-weight="900" font-size="${tam}" fill="${color}" stroke="${T}" stroke-width="${tam * 0.11}" paint-order="stroke">${l2}</text></g>`;
const etiqueta = (x, y, txt, color, s = 1) => `<g transform="translate(${x} ${y}) rotate(-4) scale(${s})"><rect x="0" y="-40" width="${txt.length * 26 + 40}" height="58" rx="6" fill="${color}"/><text x="20" y="2" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#0B0E13">${txt}</text></g>`;

// ===== 002 · BÉLMEZ: cenital del suelo con la cara gigante y la sombra de María =====
const caraGrande = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})" filter="url(#mancha)">
  <ellipse rx="150" ry="190" fill="#3E372F" opacity="0.4"/><ellipse rx="115" ry="150" fill="#332C24" opacity="0.35"/>
  <ellipse cx="-56" cy="-46" rx="44" ry="16" fill="#241E18" opacity="0.6"/><ellipse cx="56" cy="-44" rx="40" ry="15" fill="#241E18" opacity="0.6"/>
  <ellipse cx="-56" cy="-18" rx="30" ry="22" fill="#15110D" opacity="0.92"/><ellipse cx="56" cy="-16" rx="28" ry="22" fill="#15110D" opacity="0.92"/>
  <path d="M-10 -6 Q-22 40 -6 62 Q14 64 16 48 Q8 24 8 -4 Z" fill="#241E18" opacity="0.7"/>
  <path d="M-62 92 Q0 112 62 90 Q36 132 0 132 Q-38 132 -62 92 Z" fill="#15110D" opacity="0.85"/></g>`;
const defs002 = `<filter id="mancha" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="18"/><feGaussianBlur stdDeviation="1.6"/></filter>
  <filter id="cemento"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="9"/><feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.32 0 0 0 0 0.28 0 0 0 0.55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <radialGradient id="foco" cx="0.55" cy="0.45" r="0.6"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.55"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>`;
const suelo = (W, H) => `<rect width="${W}" height="${H}" fill="#7A7266"/><rect width="${W}" height="${H}" filter="url(#cemento)"/>
  ${Array.from({ length: 6 }, (_, i) => `<path d="M${-50 + i * W / 4} ${H} L${80 + i * W / 5} 0" stroke="#5E574C" stroke-width="3" opacity="0.4"/>`).join('')}<rect width="${W}" height="${H}" fill="url(#foco)"/>`;
const sombraMaria = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="0.55"><circle cx="0" cy="-330" r="70" fill="#0B0A08"/><circle cx="-60" cy="-340" r="34" fill="#0B0A08"/>
  <path d="M-80 -250 H80 L120 120 H-120 Z" fill="#0B0A08"/><path d="M-80 -240 L-150 -40 M80 -240 L150 -40" stroke="#0B0A08" stroke-width="30" stroke-linecap="round"/></g>`;
const h002 = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720"><defs>${defsComunes(1280, 720)}${defs002}</defs>
  ${suelo(1280, 720)}${caraGrande(660, 450, 1.45)}<ellipse cx="1080" cy="712" rx="190" ry="30" fill="#000" opacity="0.45"/>${capa(maria.susto(), 930, 180, 0.75)}
  ${acabado(1280, 720)}
  ${titulo(40, 120, 'APARECIÓ EN', 'SU COCINA', 118, '#FFD34D')}
  ${etiqueta(44, 330, 'JAÉN · 1971', '#E0503E', 0.95)}${sello(950, 24)}</svg>`;
const v002 = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs>${defsComunes(1080, 1920)}${defs002}</defs>
  ${suelo(1080, 1920)}${caraGrande(660, 1080, 2.2)}<ellipse cx="300" cy="1880" rx="260" ry="40" fill="#000" opacity="0.4"/>${capa(maria.susto(), -60, 1000, 1.25)}
  ${acabado(1080, 1920)}
  ${titulo(540, 260, 'APARECIÓ EN', 'SU COCINA', 150, '#FFD34D', 'middle')}
  ${etiqueta(360, 520, 'JAÉN · 1971', '#E0503E', 1.1)}${sello(390, 1820)}</svg>`;

// ===== 003 · BORJA: pared de galería con dos cuadros bajo focos, el restaurado en grande =====
const defs003 = `<linearGradient id="pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1E16"/><stop offset="1" stop-color="#140E0A"/></linearGradient>
  <radialGradient id="cono" cx="0.5" cy="0" r="1"><stop offset="0" stop-color="#FFE3A8" stop-opacity="0.6"/><stop offset="1" stop-color="#FFE3A8" stop-opacity="0"/></radialGradient>
  <linearGradient id="oro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6D27A"/><stop offset="0.5" stop-color="#B8862E"/><stop offset="1" stop-color="#F2C668"/></linearGradient>`;
const marcoOro = (svg, x, y, s, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-34" y="-34" width="368" height="468" fill="url(#oro)" stroke="${T}" stroke-width="6"/>
  <rect x="-16" y="-16" width="332" height="432" fill="none" stroke="#7A5418" stroke-width="5"/>${capa(svg, 0, 0, 1)}<rect width="300" height="400" fill="none" stroke="#3A2A10" stroke-width="5"/></g>`;
const foco = (x, y, w, h) => `<path d="M${x - 30} ${y} L${x + 30} ${y} L${x + w / 2} ${y + h} L${x - w / 2} ${y + h} Z" fill="url(#cono)"/><rect x="${x - 40}" y="${y - 20}" width="80" height="26" rx="6" fill="#1A1A1A"/>`;
const flecha = (x1, y1, x2, y2, c) => `<g filter="url(#sombraTxt)"><path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 90} ${x2} ${y2}" stroke="${c}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M${x2 - 38} ${y2 - 30} L${x2} ${y2} L${x2 - 44} ${y2 + 16}" stroke="${c}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const h003 = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720"><defs>${defsComunes(1280, 720)}${defs003}</defs>
  <rect width="1280" height="720" fill="url(#pared)"/>${foco(250, 0, 520, 720)}${foco(850, 0, 760, 720)}
  ${marcoOro(cuadroOriginal(), 120, 250, 0.72, -3)}${marcoOro(cuadroRestaurado(), 610, 110, 1.18, 2)}
  <circle cx="796" cy="350" r="120" fill="none" stroke="#E0503E" stroke-width="12" stroke-dasharray="40 14"/>
  ${flecha(320, 250, 590, 280, '#FFD34D')}
  ${capa(cecilia.orgullosa(), 1060, 380, 0.42)}
  ${acabado(1280, 720)}
  ${titulo(40, 92, 'LO ARREGLÓ', 'SU VECINA', 96, '#FFD34D')}
  ${etiqueta(70, 640, 'ANTES', '#F2E6CF', 0.9)}${etiqueta(720, 680, 'DESPUÉS', '#E0503E', 0.9)}${sello(950, 30)}</svg>`;
const v003 = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs>${defsComunes(1080, 1920)}${defs003}</defs>
  <rect width="1080" height="1920" fill="url(#pared)"/>${foco(540, 460, 1100, 1300)}${foco(220, 1300, 500, 620)}
  ${marcoOro(cuadroRestaurado(), 200, 600, 2.25, 1)}
  <circle cx="540" cy="1060" r="250" fill="none" stroke="#E0503E" stroke-width="16" stroke-dasharray="60 20"/>
  ${marcoOro(cuadroOriginal(), 60, 1480, 0.85, -5)}${flecha(330, 1480, 420, 1580, '#FFD34D')}
  ${capa(cecilia.orgullosa(), 700, 1440, 0.62)}
  ${acabado(1080, 1920)}
  ${titulo(540, 230, 'LO ARREGLÓ', 'SU VECINA', 150, '#FFD34D', 'middle')}${sello(390, 1830)}</svg>`;

// ===== 004 · LIÉRGANES: corte bajo el agua; arriba la barca, abajo el hombre pez nadando con rayos de luz =====
const defs004 = `<linearGradient id="cieloG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2A04A"/><stop offset="1" stop-color="#FFD89A"/></linearGradient>
  <linearGradient id="fondoMar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E8A8E"/><stop offset="0.5" stop-color="#0E4A5E"/><stop offset="1" stop-color="#05172A"/></linearGradient>
  <linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFF4EE" stop-opacity="0.45"/><stop offset="1" stop-color="#BFF4EE" stop-opacity="0"/></linearGradient>`;
const burbujas = (n, x0, y0, w, h, seed) => { let a = seed, s = ''; const r = () => { a = (a * 9301 + 49297) % 233280; return a / 233280; };
  for (let i = 0; i < n; i++) { const rr = 4 + r() * 14; s += `<circle cx="${x0 + r() * w}" cy="${y0 + r() * h}" r="${rr}" fill="none" stroke="#DFFAF6" stroke-width="3" opacity="0.7"/>`; } return s; };
const barcaSil = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-200 0 H200 Q190 50 140 70 H-140 Q-190 50 -200 0 Z" fill="#3A2414"/><path d="M-60 0 V-40 M60 0 V-40" stroke="#3A2414" stroke-width="16"/><circle cx="-60" cy="-56" r="20" fill="#3A2414"/><circle cx="60" cy="-56" r="20" fill="#3A2414"/></g>`;
const nadador = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <ellipse cx="0" cy="0" rx="420" ry="190" fill="#7FF0E0" opacity="0.22" filter="url(#brillo)"/>
  <g transform="rotate(-78)">${capa(L.francisco.pez(), -200, -400, 1)}</g></g>`;
const h004 = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720"><defs>${defsComunes(1280, 720)}${defs004}</defs>
  <rect width="1280" height="160" fill="url(#cieloG)"/><rect y="160" width="1280" height="560" fill="url(#fondoMar)"/>
  ${barcaSil(980, 150, 0.8)}<path d="M0 160 q40 -12 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#E8FFFB" stroke-width="6" fill="none"/>
  ${[150, 420, 700, 980].map((x, i) => `<path d="M${x} 160 L${x + 80} 160 L${x + 260} 720 L${x + 60} 720 Z" fill="url(#rayo)"/>`).join('')}
  ${nadador(860, 470, 0.62, -6)}${burbujas(26, 600, 180, 600, 400, 7)}
  <g opacity="0.85">${Array.from({ length: 6 }, (_, i) => `<path d="M${980 - i * 30} ${190 + i * 70} q-60 40 -120 ${60 + i * 6}" stroke="#C8A060" stroke-width="3" fill="none"/>`).join('')}</g>
  ${acabado(1280, 720)}
  ${titulo(40, 300, '¿HOMBRE', 'O PEZ?', 150, '#7FF0E0')}
  ${etiqueta(44, 580, 'CÁDIZ · 1679', '#FFD34D', 0.95)}${sello(950, 640)}</svg>`;
const v004 = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs>${defsComunes(1080, 1920)}${defs004}</defs>
  <rect width="1080" height="640" fill="url(#cieloG)"/><rect y="640" width="1080" height="1280" fill="url(#fondoMar)"/>
  ${barcaSil(700, 630, 1.1)}<path d="M0 640 q45 -14 90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0 t90 0" stroke="#E8FFFB" stroke-width="8" fill="none"/>
  ${[60, 380, 700].map(x => `<path d="M${x} 640 L${x + 110} 640 L${x + 360} 1920 L${x + 80} 1920 Z" fill="url(#rayo)"/>`).join('')}
  ${nadador(560, 1200, 1.45, -8)}${burbujas(40, 300, 700, 700, 1100, 5)}
  ${acabado(1080, 1920)}
  ${titulo(540, 230, '¿HOMBRE', 'O PEZ?', 190, '#7FF0E0', 'middle')}
  ${etiqueta(370, 1760, 'CÁDIZ · 1679', '#FFD34D', 1.05)}${sello(390, 1840)}</svg>`;

(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nm, svg, w, h] of [['002-miniatura_v2_1280x720.png', h002(), 1280, 720], ['002-miniatura_v2_vertical.png', v002(), 1080, 1920],
    ['003-miniatura_v2_1280x720.png', h003(), 1280, 720], ['003-miniatura_v2_vertical.png', v003(), 1080, 1920],
    ['004-miniatura_v2_1280x720.png', h004(), 1280, 720], ['004-miniatura_v2_vertical.png', v004(), 1080, 1920]]) {
    await pg.setViewportSize({ width: w, height: h }); await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nm) }); }
  await b.close();
})();
