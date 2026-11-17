// Tres propuestas de logo alternativas para "Expediente Vela". Uso: node marca3.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { tinta } = require('../personajes/tinta');
let n = 0;
const aislar = s => { const p = 'q' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc) => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const AMBAR = '#F2B35A', CREMA = '#F2E6CF', TINTA = '#0B0E13', ROJO = '#C0392B', NOCHE = '#0E2236';

// A) "VELA" con la L convertida en vela encendida
function logoA() {
  const llama = `<g transform="translate(470 120)"><ellipse cx="0" cy="40" rx="70" ry="90" fill="url(#halo)"/>
    <path d="M0 -40 C-28 0 -26 40 0 64 C26 40 28 0 0 -40 Z" fill="#FFA63A" stroke="${TINTA}" stroke-width="7"/>
    <path d="M0 0 C-12 18 -10 40 0 52 C10 40 12 18 0 0 Z" fill="#FFF0B8"/></g>`;
  const vela = `<path d="M440 196 H500 V450 H440 Z" fill="${CREMA}" stroke="${TINTA}" stroke-width="12" stroke-linejoin="round"/>
    <path d="M440 196 H500 V230 Q492 262 484 230 Q478 280 468 230 Q458 250 452 226 Q446 240 440 230 Z" fill="#FFFFFF" stroke="${TINTA}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M470 196 V186" stroke="${TINTA}" stroke-width="8" stroke-linecap="round"/>
    <path d="M410 450 H600 Q620 450 620 470 V488 H410 Q396 488 396 470 Q396 450 410 450 Z" fill="${AMBAR}" stroke="${TINTA}" stroke-width="12" stroke-linejoin="round"/>`;
  const letra = (x, txt) => `<text x="${x}" y="488" font-family="Inter" font-weight="900" font-size="330" fill="${AMBAR}" stroke="${TINTA}" stroke-width="22" paint-order="stroke">${txt}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 620" width="1300" height="620">
  <defs><radialGradient id="halo"><stop offset="0" stop-color="#FFC066" stop-opacity="0.7"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient></defs>
  <text x="650" y="120" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="70" letter-spacing="22" fill="${CREMA}" stroke="${TINTA}" stroke-width="10" paint-order="stroke">EXPEDIENTE</text>
  ${letra(60, 'VE')}${vela}${llama}${letra(640, 'A')}
  <text x="650" y="575" text-anchor="middle" font-family="Inter" font-weight="700" font-size="40" letter-spacing="8" fill="${CREMA}" stroke="${TINTA}" stroke-width="8" paint-order="stroke">HISTORIAS REALES</text>
  </svg>`;
}

// B) Icono: farol plano con Tinta posado, y el nombre debajo
function logoB() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" width="800" height="900">
  <defs><radialGradient id="halo"><stop offset="0" stop-color="#FFC066" stop-opacity="0.8"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient></defs>
  <circle cx="400" cy="400" r="260" fill="url(#halo)"/>
  <g stroke="${TINTA}" stroke-width="12" stroke-linejoin="round">
    <circle cx="400" cy="170" r="34" fill="none" stroke="${AMBAR}" stroke-width="22"/><circle cx="400" cy="170" r="34" fill="none" stroke-width="6"/>
    <path d="M350 250 Q350 205 400 205 Q450 205 450 250 Z" fill="${AMBAR}"/>
    <path d="M300 250 H500 L520 284 H280 Z" fill="${AMBAR}"/>
    <path d="M300 284 Q270 400 300 520 H500 Q530 400 500 284 Z" fill="#FFE6A8"/>
    <path d="M400 470 C350 420 360 360 400 320 C440 360 450 420 400 470 Z" fill="#FFA63A" stroke-width="8"/>
    <path d="M400 455 C380 430 382 400 400 380 C418 400 420 430 400 455 Z" fill="#FFF3C4" stroke="none"/>
    <path d="M350 284 Q336 400 350 520 M450 284 Q464 400 450 520 M286 400 H514" stroke="${AMBAR}" stroke-width="14" fill="none"/>
    <path d="M300 284 Q270 400 300 520 H500 Q530 400 500 284 Z" fill="none"/>
    <rect x="276" y="520" width="248" height="40" rx="8" fill="${AMBAR}"/>
    <path d="M256 560 H544 V600 H256 Z" fill="#B5823A"/>
  </g>
  ${capa(tinta({ pose: 'tranquilo' }), 470, 70, 0.62)}
  <text x="400" y="700" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="62" letter-spacing="14" fill="${CREMA}" stroke="${TINTA}" stroke-width="10" paint-order="stroke">EXPEDIENTE</text>
  <text x="400" y="850" text-anchor="middle" font-family="Inter" font-weight="900" font-size="180" letter-spacing="10" fill="${AMBAR}" stroke="${TINTA}" stroke-width="16" paint-order="stroke">VELA</text>
  </svg>`;
}

// C) Sello de goma rojo con Tinta en el centro
function logoC() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <path id="arcoA" d="M150 400 A250 250 0 0 1 650 400"/><path id="arcoB" d="M128 400 A272 272 0 0 0 672 400"/>
    <filter id="tintaGastada"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="8" result="r"/>
      <feColorMatrix in="r" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
  </defs>
  <g transform="rotate(-8 400 400)" filter="url(#tintaGastada)">
    <circle cx="400" cy="400" r="360" fill="none" stroke="${ROJO}" stroke-width="22"/>
    <circle cx="400" cy="400" r="328" fill="none" stroke="${ROJO}" stroke-width="6"/>
    <circle cx="400" cy="400" r="215" fill="none" stroke="${ROJO}" stroke-width="10"/>
    <text font-family="JetBrains Mono" font-weight="800" font-size="68" letter-spacing="12" fill="${ROJO}"><textPath href="#arcoA" startOffset="50%" text-anchor="middle">EXPEDIENTE</textPath></text>
    <text font-family="Inter" font-weight="900" font-size="82" letter-spacing="26" fill="${ROJO}"><textPath href="#arcoB" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">VELA</textPath></text>
    ${[[92, 400], [708, 400]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${ROJO}"/>`).join('')}
    <rect x="230" y="372" width="340" height="66" fill="${CREMA}" stroke="${ROJO}" stroke-width="8"/>
    <text x="400" y="420" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="40" fill="${ROJO}">CASOS REALES</text>
  </g>
  ${capa(tinta({ pose: 'desconfia' }), 300, 160, 0.68)}
  </svg>`;
}

(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  for (const [nombre, svg, w, h] of [['logo_A_vela.png', logoA(), 1300, 620], ['logo_B_farol.png', logoB(), 800, 900], ['logo_C_sello.png', logoC(), 800, 800]]) {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nombre), omitBackground: true });
  }
  await b.close();
})();
