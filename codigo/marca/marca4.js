// Logo con Teo sujetando la carpeta "EXPEDIENTE VELA" (y Tinta en el hombro).
// Uso: node marca4.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { teoFrente, COLORES_TEO: CT } = require('../personajes/teo');
const { tinta } = require('../personajes/tinta');
const { azar, estrellas } = require('../fondos/comun');
let n = 0;
const aislar = s => { const p = 'w' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc) => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const T = '#151515', AMBAR = '#F2B35A', CREMA = '#F2E6CF', ROJO = '#C0392B';

// Teo (caja 400 x 760) sujetando la carpeta a la altura del pecho.
function teoConCarpeta(cara = 'chulo') {
  const manga = (d) => `<path d="${d}" fill="none" stroke="${T}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${CT.abrigo}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
  const carpeta = `<g transform="rotate(-4 200 380)">
    <rect x="62" y="282" width="276" height="196" rx="8" fill="#EFE6D2" stroke="${T}" stroke-width="5" transform="rotate(3 200 380)"/>
    <path d="M52 296 V270 Q52 260 62 260 H150 Q160 260 164 270 L172 296 Z" fill="#C9A066" stroke="${T}" stroke-width="5"/>
    <rect x="48" y="292" width="304" height="200" rx="10" fill="#D9B27A" stroke="${T}" stroke-width="6"/>
    <text x="200" y="352" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="32" letter-spacing="4" fill="#2A1A0C">EXPEDIENTE</text>
    <path d="M70 366 H330" stroke="#8A6438" stroke-width="3" stroke-dasharray="10 7"/>
    <text x="200" y="448" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" letter-spacing="4" fill="${AMBAR}" stroke="${T}" stroke-width="10" paint-order="stroke">VELA</text>
    <g transform="translate(282 474) rotate(-10)"><rect x="-62" y="-16" width="124" height="32" rx="5" fill="none" stroke="${ROJO}" stroke-width="4"/>
      <text x="0" y="7" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="16" fill="${ROJO}">CASO ABIERTO</text></g>
  </g>`;
  // Las mangas salen de los hombros y se doblan hacia los bordes de la carpeta; los guantes la agarran por delante.
  const brazos = manga('M132 244 L98 330 L66 392') + manga('M268 244 L304 330 L334 382');
  const guantes = `<ellipse cx="62" cy="400" rx="20" ry="24" fill="${T}"/><path d="M70 384 q16 4 20 16" stroke="${T}" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="336" cy="388" rx="20" ry="24" fill="${T}"/><path d="M328 372 q-16 4 -20 16" stroke="${T}" stroke-width="12" stroke-linecap="round"/>`;
  const base = teoFrente({ cara, conFarol: false });
  return base.replace(/<\/g><\/svg>\s*$/, `${brazos}${carpeta}${guantes}</g></svg>`);
}

// 1) Logo transparente: Teo de cuerpo entero con la carpeta y Tinta en el hombro.
function logo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 820" width="520" height="820">
  <defs><radialGradient id="halo"><stop offset="0" stop-color="#FFC066" stop-opacity="0.45"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="260" cy="420" rx="250" ry="330" fill="url(#halo)"/>
  ${capa(teoConCarpeta(), 60, 30, 1)}
  ${capa(tinta({ pose: 'tranquilo' }), 282, 130, 0.34)}
  </svg>`;
}

// 2) Foto de perfil: plano medio (cabeza + carpeta) dentro de un círculo de noche con aro dorado.
function perfil() {
  const r = azar(41);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs><radialGradient id="cielo" cx="0.5" cy="0.45" r="0.65"><stop offset="0" stop-color="#2A5A70"/><stop offset="0.6" stop-color="#12324A"/><stop offset="1" stop-color="#0A1622"/></radialGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#FFC066" stop-opacity="0.5"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient>
  <clipPath id="c"><circle cx="400" cy="400" r="384"/></clipPath></defs>
  <g clip-path="url(#c)"><rect width="800" height="800" fill="url(#cielo)"/>${estrellas(r, 70, 800, 0, 800)}
    <circle cx="400" cy="470" r="330" fill="url(#halo)"/>
    ${capa(teoConCarpeta(), 130, 62, 1.35)}
    ${capa(tinta({ pose: 'tranquilo' }), 430, 197, 0.46)}</g>
  <circle cx="400" cy="400" r="384" fill="none" stroke="${AMBAR}" stroke-width="14"/>
  </svg>`;
}

(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nombre, svg, w, h] of [['logo_teo_transparente.png', logo(), 520, 820], ['perfil_teo_800.png', perfil(), 800, 800]]) {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nombre), omitBackground: true });
  }
  await b.close();
})();
