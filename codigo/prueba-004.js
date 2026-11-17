const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const L = require('./personajes/lierganes');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const n of ['d01_lierganes', 'd02_bilbao', 'd03_bahia', 'd04_orilla']) { await pg.setViewportSize({ width: 1080, height: 1920 }); await pg.setContent(`<html><body style="margin:0">${require('./fondos/004/' + n)()}</body></html>`); await pg.screenshot({ path: path.join(out, n + '.png') }); }
  const ps = [L.francisco.normal(), L.francisco.pez(), L.francisco.andando(), L.pescador.uno(), L.pescador.dos(), L.pescador.uno('decidido', true), L.madre.depie('preocupado', true), L.secretario.depie(), L.estatua(), L.nadando()];
  await pg.setViewportSize({ width: 4000, height: 900 });
  await pg.setContent(`<html><body style="margin:0;background:#cfcfcf;display:flex;align-items:flex-end">${ps.join('')}</body></html>`);
  await pg.screenshot({ path: path.join(out, 'personajes.png') });
  await b.close();
})();
