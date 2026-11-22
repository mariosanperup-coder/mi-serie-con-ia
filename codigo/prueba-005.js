const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const D = require('./personajes/dioni');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const n of ['g01_calle', 'g02_garaje', 'g03_brasil', 'g04_plato']) { await pg.setViewportSize({ width: 1080, height: 1920 }); await pg.setContent(`<html><body style="margin:0">${require('./fondos/005/' + n)()}</body></html>`); await pg.screenshot({ path: path.join(out, n + '.png') }); }
  const ps = [D.dioni.uniforme(), D.dioni.mirando(), D.dioni.sacas(), D.dioni.playa(), D.dioni.esposado(), D.policia(false, false), D.policia(true, true)];
  await pg.setViewportSize({ width: 2900 + 900, height: 800 });
  await pg.setContent(`<html><body style="margin:0;background:#cfcfcf;display:flex;align-items:flex-end;flex-wrap:wrap">${ps.join('')}<div>${D.furgon()}${D.coche()}</div></body></html>`);
  await pg.screenshot({ path: path.join(out, 'personajes.png'), fullPage: true });
  await b.close();
})();
