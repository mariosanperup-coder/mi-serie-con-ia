// Renderiza fondos y la composición de la escena 1. Uso: node escena-prueba.js <carpeta-salida>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { teoFrente } = require('./personajes/teo');
const { tinta } = require('./personajes/tinta');
const { luciaFrente, CARAS_LUCIA } = require('./personajes/lucia');
const pista = require('./fondos/f01_pista_noche'), mar = require('./fondos/f02_cielo_mar'), archivo = require('./fondos/f09_archivo');

const sinCabecera = s => s.replace(/<svg[^>]*>/, '').replace('</svg>', '');
const capa = (svg, x, y, esc, vb) => `<svg x="${x}" y="${y}" width="${vb[0] * esc}" height="${vb[1] * esc}" viewBox="0 0 ${vb[0]} ${vb[1]}">${sinCabecera(svg)}</svg>`;

// Escena 1: Teo en la pista, Tinta en su hombro.
const escena1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  ${sinCabecera(pista())}
  <ellipse cx="620" cy="1712" rx="130" ry="16" fill="#000" opacity="0.45"/>
  ${capa(teoFrente({ cara: 'serio' }), 420, 1000, 1.0, [400, 760])}
  ${capa(tinta({ pose: 'tranquilo' }), 642, 1100, 0.34, [300, 380])}
</svg>`;
// Escena 6: Lucía en El Archivo.
const escena6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  ${sinCabecera(archivo({ conMesa: false }))}
  ${capa(luciaFrente({ cara: 'esceptica' }), 290, 760, 1.25, [400, 760])}
  ${archivo.mesa()}
</svg>`;
const hojaLucia = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 800" width="2400" height="800"><rect width="2400" height="800" fill="#cfcfcf"/>
  ${CARAS_LUCIA.map((c, i) => capa(luciaFrente({ cara: c }), 20 + i * 395, 20, 1, [400, 760])).join('')}</svg>`;

(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ deviceScaleFactor: 1 });
  const foto = async (svg, nombre, w, h) => {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await pg.screenshot({ path: path.join(out, nombre) });
  };
  await foto(hojaLucia, 'lucia_expresiones.png', 2400, 800);
  await foto(escena1, 'escena01.png', 1080, 1920);
  await foto(escena6, 'escena06.png', 1080, 1920);
  await foto(mar(), 'f02_cielo_mar.png', 3240, 1920);
  await b.close();
})();
