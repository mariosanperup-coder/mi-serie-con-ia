// Miniatura del 003 (1280x720 y 1080x1920). Uso: node miniatura_003.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { cecilia, cuadroOriginal, cuadroRestaurado } = require('../personajes/borja');
const { tinta } = require('../personajes/tinta');
let n = 0;
const aislar = s => { const p = 'x' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc) => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const T = '#0B0E13', AM = '#FFD34D';
const marco = (svg, x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-14" y="-14" width="328" height="428" fill="#6A4222" stroke="${T}" stroke-width="6"/>${capa(svg, 0, 0, 1)}</g>`;
const flecha = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 80} ${x2} ${y2}" stroke="${AM}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M${x2 - 30} ${y2 - 34} L${x2} ${y2} L${x2 - 42} ${y2 + 8}" stroke="${AM}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
const txt = (x, y, l, tam, a) => l.map((s, i) => `<text x="${x}" y="${y + i * tam * 1.02}" text-anchor="${a}" font-family="Inter" font-weight="900" font-size="${tam}" fill="${i === l.length - 1 ? AM : '#fff'}" stroke="${T}" stroke-width="${tam * 0.16}" paint-order="stroke">${s}</text>`).join('');
const fondo = (w, h) => `<defs><radialGradient id="f" cx="0.5" cy="0.5" r="0.8"><stop offset="0" stop-color="#5A3E24"/><stop offset="1" stop-color="#1A120C"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#f)"/>`;
const h = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">${fondo(1280, 720)}
  ${marco(cuadroOriginal(), 60, 230, 1.0, -4)}${marco(cuadroRestaurado(), 640, 200, 1.12, 3)}${flecha(400, 300, 620, 330)}
  ${txt(640, 120, ['LO "ARREGLÓ"', 'SU VECINA'], 92, 'middle')}${capa(cecilia.orgullosa(), 1030, 330, 0.5)}${capa(tinta({ pose: 'susto' }), 470, 560, 0.4)}</svg>`;
const v = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">${fondo(1080, 1920)}
  ${txt(540, 250, ['LO "ARREGLÓ"', 'SU VECINA'], 120, 'middle')}
  ${marco(cuadroOriginal(), 90, 520, 1.1, -4)}${marco(cuadroRestaurado(), 560, 560, 1.25, 3)}${flecha(330, 540, 600, 600)}
  ${capa(cecilia.orgullosa(), 330, 1180, 0.95)}</svg>`;
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nm, svg, w, hh] of [['003-miniatura_1280x720.png', h(), 1280, 720], ['003-miniatura_vertical_1080x1920.png', v(), 1080, 1920]]) {
    await pg.setViewportSize({ width: w, height: hh }); await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nm) }); }
  await b.close();
})();
