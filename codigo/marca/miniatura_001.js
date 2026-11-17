// Miniatura del episodio 001 (horizontal 1280x720 y vertical 1080x1920). Uso: node miniatura_001.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { teoFrente } = require('../personajes/teo');
const { tinta } = require('../personajes/tinta');
const { avion } = require('../objetos/objetos');
const cieloMar = require('../fondos/f02_cielo_mar');
let n = 0;
const aislar = s => { const p = 'z' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc, extra = '') => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible" ${extra}>${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const T = '#0B0E13', AMARILLO = '#FFD34D', ROJO = '#C0392B';
const luz = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 5}" fill="url(#hRojo)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FF5A44"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#FFE0D0"/>`;
const defs = `<defs><radialGradient id="hRojo"><stop offset="0" stop-color="#FF3A2A" stop-opacity="0.9"/><stop offset="1" stop-color="#FF3A2A" stop-opacity="0"/></radialGradient>
  <radialGradient id="vin" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient></defs>`;
const texto = (x, y, lineas, tam, anchor = 'start') => lineas.map((l, i) => `<text x="${x}" y="${y + i * tam * 1.02}" text-anchor="${anchor}" font-family="Inter" font-weight="900" font-size="${tam}" fill="${i === lineas.length - 1 ? AMARILLO : '#FFFFFF'}" stroke="${T}" stroke-width="${tam * 0.16}" paint-order="stroke" letter-spacing="-1">${l}</text>`).join('');
const sello = (x, y, esc) => `<g transform="translate(${x} ${y}) rotate(-6) scale(${esc})"><rect x="-190" y="-44" width="380" height="88" rx="8" fill="#F2E6CF"/><rect x="-190" y="-44" width="380" height="88" rx="8" fill="none" stroke="${ROJO}" stroke-width="8"/>
  <text x="0" y="16" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="44" fill="${ROJO}">MANISES · 1979</text></g>`;

function horizontal() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">${defs}
  ${capa(cieloMar(), -60, -60, 0.42)}
  ${capa(avion(), 470, 210, 0.62)}
  ${luz(400, 250, 22)}${luz(330, 300, 22)}
  <rect width="1280" height="720" fill="url(#vin)"/>
  ${capa(teoFrente({ cara: 'sorpresa' }), 30, 300, 0.75)}${capa(tinta({ pose: 'susto' }), 190, 345, 0.28)}
  ${texto(1240, 520, ['ALGO LO', 'PERSEGUÍA'], 108, 'end')}
  ${sello(1060, 90, 0.9)}
  </svg>`;
}
function vertical() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">${defs}
  ${capa(cieloMar(), -1500, 0, 1)}
  ${capa(avion(), 120, 720, 0.75)}
  ${luz(90, 770, 30)}${luz(10, 840, 30)}
  <rect width="1080" height="1920" fill="url(#vin)"/>
  ${texto(540, 300, ['ALGO LO', 'PERSEGUÍA'], 150, 'middle')}
  ${sello(540, 520, 1.2)}
  ${capa(teoFrente({ cara: 'sorpresa' }), 270, 1000, 1.4)}${capa(tinta({ pose: 'susto' }), 580, 1135, 0.48)}
  </svg>`;
}
(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nombre, svg, w, h] of [['001-miniatura_1280x720.png', horizontal(), 1280, 720], ['001-miniatura_vertical_1080x1920.png', vertical(), 1080, 1920]]) {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nombre) });
  }
  await b.close();
})();
