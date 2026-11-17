// Hoja de prueba de los personajes secundarios. Uso: node prueba-secundarios.js <salida.png>
const { chromium } = require('playwright');
const S = require('./personajes/secundarios');
const lista = [
  ['Comandante', S.comandante.depie()], ['a los mandos', S.comandante.mandos()], ['con la radio', S.comandante.radio()],
  ['Copiloto', S.copiloto.depie()], ['sentado', S.copiloto.sentado()], ['señalando', S.copiloto.senala()],
  ['Piloto del caza', S.pilotoCaza.depie()], ['en la cabina', S.pilotoCaza.cabina()],
  ['Controlador', S.controlador.depie()], ['sentado', S.controlador.sentado()], ['señalando', S.controlador.senala()],
  ['Controladora', S.controladora.depie()], ['sentada', S.controladora.sentada()], ['sorpresa', S.controladora.sorpresa()],
];
const html = `<html><body style="margin:0;background:#cfcfcf;display:grid;grid-template-columns:repeat(7,400px);gap:6px;padding:20px;width:max-content">
${lista.map(([n, s]) => `<div style="text-align:center">${s}<div style="font:600 22px sans-serif;color:#333">${n}</div></div>`).join('')}</body></html>`;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 2900, height: 1700 } });
  await pg.setContent(html); await pg.locator('body').screenshot({ path: process.argv[2] || 'secundarios.png' }); await b.close();
})();
