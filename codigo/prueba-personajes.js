// Renderiza una hoja de prueba con Teo y Tinta.
// Uso: node prueba-personajes.js <salida.png>
const { chromium } = require('playwright');
const { teoFrente } = require('./personajes/teo');
const { tinta } = require('./personajes/tinta');

const celda = (svg, txt, w) => `<div style="text-align:center;width:${w}px">${svg}<div style="font:600 22px sans-serif;color:#333;margin-top:6px">${txt}</div></div>`;
const html = `<html><body style="margin:0;background:#cfcfcf;display:flex;gap:10px;align-items:flex-end;padding:30px;width:max-content">
${['serio', 'chulo', 'empatico', 'sorpresa', 'miedo'].map(c => celda(teoFrente({ cara: c }), 'Teo · ' + c, 400)).join('')}
${['tranquilo', 'susto', 'desconfia'].map(p => celda(tinta({ pose: p }), 'Tinta · ' + p, 300)).join('')}
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ deviceScaleFactor: 1, viewport: { width: 3100, height: 900 } });
  await pg.setContent(html);
  await pg.locator('body').screenshot({ path: process.argv[2] || 'prueba.png' });
  await b.close();
})();
