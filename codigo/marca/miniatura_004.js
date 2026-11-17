const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const L = require('../personajes/lierganes');
const bahia = require('../fondos/004/d03_bahia');
let n = 0;
const aislar = s => { const p = 'w' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const interior = s => aislar(s).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const capa = (svg, x, y, esc) => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number); return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${interior(svg)}</svg>`; };
const T = '#0B0E13', AM = '#FFD34D', R = '#C0392B';
const txt = (x, y, l, tam, a) => l.map((s, i) => `<text x="${x}" y="${y + i * tam * 1.02}" text-anchor="${a}" font-family="Inter" font-weight="900" font-size="${tam}" fill="${i === l.length - 1 ? AM : '#fff'}" stroke="${T}" stroke-width="${tam * 0.16}" paint-order="stroke">${s}</text>`).join('');
const sello = (x, y, s) => `<g transform="translate(${x} ${y}) rotate(-6) scale(${s})"><rect x="-200" y="-44" width="400" height="88" rx="8" fill="#F2E6CF"/><rect x="-200" y="-44" width="400" height="88" rx="8" fill="none" stroke="${R}" stroke-width="8"/><text x="0" y="16" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="40" fill="${R}">LIÉRGANES · 1679</text></g>`;
const h = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <g transform="translate(640 360) scale(1.25) translate(-540 -1150)">${interior(bahia())}</g><rect width="1280" height="720" fill="#000" opacity="0.25"/>
  ${capa(L.francisco.pez(), 40, 60, 0.9)}<rect x="0" y="420" width="1280" height="2000" fill="#1E8A86"/><path d="M0 420 q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#E8F4F0" stroke-width="8" fill="none"/>${txt(1240, 170, ['LO PESCARON', 'EN EL MAR'], 108, 'end')}${sello(1000, 440, 1)}</svg>`;
const v = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">${interior(bahia())}<rect width="1080" height="1920" fill="#000" opacity="0.2"/>
  ${txt(540, 260, ['LO PESCARON', 'EN EL MAR'], 130, 'middle')}${sello(540, 470, 1.2)}${capa(L.francisco.pez(), 220, 620, 1.6)}<rect x="0" y="1260" width="1080" height="2000" fill="#1E8A86"/><path d="M0 1260 q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#E8F4F0" stroke-width="8" fill="none"/></svg>`;
(async () => {
  const out = process.argv[2]; const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nm, svg, w, hh] of [['004-miniatura_1280x720.png', h(), 1280, 720], ['004-miniatura_vertical_1080x1920.png', v(), 1080, 1920]]) {
    await pg.setViewportSize({ width: w, height: hh }); await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nm) }); }
  await b.close();
})();
