// Miniatura del episodio 002 (1280x720 y 1080x1920). Uso: node miniatura_002.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { maria } = require('../personajes/belmez');
const { tinta } = require('../personajes/tinta');
const cocina = require('../fondos/002/b01_cocina');
let n = 0;
const aislar = s => { const p = 'y' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc) => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const T = '#0B0E13', AMARILLO = '#FFD34D', ROJO = '#C0392B';
const cara = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s} ${s * 0.6})" filter="url(#b)"><ellipse rx="85" ry="110" fill="#2A251F" opacity="0.25"/>
  <g fill="none" stroke="#1E1A15" stroke-width="10" stroke-linecap="round"><path d="M-50 -36 q15 -15 32 0 M18 -36 q15 -15 32 0 M0 -6 q-6 28 4 36 M-32 48 q32 20 64 0"/></g>
  <circle cx="-34" cy="-14" r="13" fill="#1E1A15"/><circle cx="34" cy="-14" r="13" fill="#1E1A15"/></g>`;
const defs = `<defs><filter id="b"><feGaussianBlur stdDeviation="2"/></filter><radialGradient id="vin" cx="0.5" cy="0.6" r="0.8"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.7"/></radialGradient></defs>`;
const texto = (x, y, l, tam, anchor) => l.map((s, i) => `<text x="${x}" y="${y + i * tam * 1.02}" text-anchor="${anchor}" font-family="Inter" font-weight="900" font-size="${tam}" fill="${i === l.length - 1 ? AMARILLO : '#fff'}" stroke="${T}" stroke-width="${tam * 0.16}" paint-order="stroke">${s}</text>`).join('');
const sello = (x, y, s) => `<g transform="translate(${x} ${y}) rotate(-6) scale(${s})"><rect x="-190" y="-44" width="380" height="88" rx="8" fill="#F2E6CF"/><rect x="-190" y="-44" width="380" height="88" rx="8" fill="none" stroke="${ROJO}" stroke-width="8"/>
  <text x="0" y="16" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="44" fill="${ROJO}">BÉLMEZ · 1971</text></g>`;
const horizontal = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">${defs}
  <g transform="translate(640 380) scale(1.9) translate(-560 -1500)">${aislar(cocina()).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</g>
  ${cara(820, 560, 2.4)}<rect width="1280" height="720" fill="url(#vin)"/>
  ${capa(maria.susto(), 20, 140, 0.78)}${capa(tinta({ pose: 'susto' }), 300, 470, 0.3)}
  ${texto(1240, 150, ['APARECIÓ', 'EN SU COCINA'], 100, 'end')}${sello(1080, 360, 0.9)}</svg>`;
const vertical = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">${defs}
  <g transform="translate(540 1000) scale(1.6) translate(-560 -1300)">${aislar(cocina()).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</g>
  ${cara(640, 1600, 3)}<rect width="1080" height="1920" fill="url(#vin)"/>
  ${texto(540, 260, ['APARECIÓ', 'EN SU COCINA'], 130, 'middle')}${sello(540, 470, 1.2)}
  ${capa(maria.susto(), 0, 820, 0.95)}${capa(tinta({ pose: "susto" }), 760, 1180, 0.4)}</svg>`;
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nm, svg, w, h] of [['002-miniatura_1280x720.png', horizontal(), 1280, 720], ['002-miniatura_vertical_1080x1920.png', vertical(), 1080, 1920]]) {
    await pg.setViewportSize({ width: w, height: h }); await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nm) }); }
  await b.close();
})();
