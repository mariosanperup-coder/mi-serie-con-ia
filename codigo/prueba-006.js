const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const A = require('./personajes/altamira');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const n of ['h01_prado', 'h02_cueva', 'h03_congreso']) { await pg.setViewportSize({ width: 1080, height: 1920 }); await pg.setContent(`<html><body style="margin:0">${require('./fondos/006/' + n)()}</body></html>`); await pg.screenshot({ path: path.join(out, n + '.png') }); }
  const ps = [A.marcelino.suelo(), A.marcelino.arriba(), A.marcelino.perfil(), A.maria.normal(), A.maria.senala(), A.cazador(), A.perro(), A.academico(false), A.academico(true)];
  await pg.setViewportSize({ width: 2900 + 900, height: 800 });
  await pg.setContent(`<html><body style="margin:0;background:#cfcfcf;display:flex;align-items:flex-end;flex-wrap:wrap">${ps.join('')}</body></html>`);
  await pg.screenshot({ path: path.join(out, 'personajes.png'), fullPage: true });
  await pg.setViewportSize({ width: 1080, height: 1920 }); const C = require('./fondos/006/h02_cueva'); await pg.setContent(`<html><body style="margin:0"><svg viewBox="0 0 1080 1920" width="1080" height="1920">${C().replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}${C.techo().replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg></body></html>`); await pg.screenshot({ path: path.join(out, 'techo.png') });
  await b.close();
})();
