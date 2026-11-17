// Hoja de prueba del 002: fondos y personajes. Uso: node prueba-002.js <carpeta>
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { maria, albanil } = require('./personajes/belmez');
const F = ['b01_cocina', 'b02_pueblo', 'b03_pasillo', 'b04_laboratorio'].map(n => [n, require('./fondos/002/' + n)]);
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [n, f] of F) { await pg.setViewportSize({ width: 1080, height: 1920 }); await pg.setContent(`<html><body style="margin:0">${f()}</body></html>`); await pg.screenshot({ path: path.join(out, n + '.png') }); }
  const ps = [maria.depie(), maria.cocinando(), maria.susto(), albanil.depie(), albanil.raspando()];
  await pg.setViewportSize({ width: 2100, height: 800 });
  await pg.setContent(`<html><body style="margin:0;background:#cfcfcf;display:flex">${ps.join('')}</body></html>`);
  await pg.screenshot({ path: path.join(out, 'personajes.png') });
  await b.close();
})();
