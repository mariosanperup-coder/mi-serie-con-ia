// Hoja de prueba: personajes secundarios corregidos + objetos. Uso: node prueba-objetos.js <carpeta>
const path = require('path');
const { chromium } = require('playwright');
const O = require('./objetos/objetos');
const { farol } = require('./personajes/teo');
const html = `<html><body style="margin:0;background:#cfcfcf;padding:20px;width:2460px;display:flex;flex-wrap:wrap;gap:20px;align-items:center">
  ${O.avion()}${O.caza({ postquemador: true })}${O.expediente()}${O.expediente({ abierto: true })}${O.microfono()}
  <svg viewBox="-60 -40 120 140" width="240" height="280">${farol(0, 0, false)}</svg><svg viewBox="-60 -40 120 140" width="240" height="280">${farol(0, 0, true)}</svg>
</body></html>`;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 2500, height: 1400 } });
  await pg.setContent(html); await pg.locator('body').screenshot({ path: path.join(process.argv[2] || '.', 'objetos.png') }); await b.close();
})();
