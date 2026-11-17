const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const B = require('./personajes/borja');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const n of ['c01_santuario', 'c02_interior']) { await pg.setViewportSize({ width: 1080, height: 1920 }); await pg.setContent(`<html><body style="margin:0">${require('./fondos/003/' + n)()}</body></html>`); await pg.screenshot({ path: path.join(out, n + '.png') }); }
  const ps = [B.cecilia.depie(), B.cecilia.pintando(), B.cecilia.orgullosa(), B.turista(0), B.turista(1), B.turista(2), B.turista(3)];
  await pg.setViewportSize({ width: 2800 + 640, height: 800 });
  await pg.setContent(`<html><body style="margin:0;background:#cfcfcf;display:flex;align-items:center">${ps.join('')}${B.cuadroOriginal()}${B.cuadroRestaurado()}</body></html>`);
  await pg.screenshot({ path: path.join(out, 'personajes.png') });
  await b.close();
})();
