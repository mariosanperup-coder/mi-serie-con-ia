// Renderiza todos los fondos a PNG. Uso: node render-fondos.js <carpeta-salida>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const FONDOS = {
  f01_pista_noche: [require('./fondos/f01_pista_noche'), 1080],
  f02_cielo_mar: [require('./fondos/f02_cielo_mar'), 3240],
  f03_cabina: [require('./fondos/f03_cabina'), 1080],
  f04_ventanilla: [require('./fondos/f04_ventanilla'), 1080],
  f05_mapa: [require('./fondos/f05_mapa'), 1080],
  f06_torre_control: [require('./fondos/f06_torre_control'), 1080],
  f07_base_aerea: [require('./fondos/f07_base_aerea'), 1080],
  f08_cielo_nubes: [require('./fondos/f08_cielo_nubes'), 3240],
  f09_archivo: [require('./fondos/f09_archivo'), 1080],
  f10_cabina_pasajeros: [require('./fondos/f10_cabina_pasajeros'), 1080],
  f11_sala_radar: [require('./fondos/f11_sala_radar'), 1080],
  f12_cabina_caza: [require('./fondos/f12_cabina_caza'), 1080],
  f13_refineria: [require('./fondos/f13_refineria'), 1080],
  f14_hemiciclo: [require('./fondos/f14_hemiciclo'), 1080],
  f15_flota: [require('./fondos/f15_flota'), 1080],
};
(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const solo = process.argv.slice(3);
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nombre, [fn, w]] of Object.entries(FONDOS)) {
    if (solo.length && !solo.includes(nombre)) continue;
    await pg.setViewportSize({ width: w, height: 1920 });
    await pg.setContent(`<html><body style="margin:0">${fn()}</body></html>`);
    await pg.screenshot({ path: path.join(out, nombre + '.png') });
  }
  await b.close();
})();
