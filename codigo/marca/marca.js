// Identidad del canal "Expediente Vela": foto de perfil, logo y banner, dibujados en código.
// Uso: node marca.js <carpeta-salida>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { teoFrente, farol } = require('../personajes/teo');
const { tinta } = require('../personajes/tinta');
const { luciaFrente } = require('../personajes/lucia');
const { azar, estrellas, halo } = require('../fondos/comun');

let n = 0;
const aislar = s => { const p = 'm' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc) => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };

const AMBAR = '#F2B35A', CREMA = '#F2E6CF', TINTA = '#0B0E13', ROJO = '#C0392B';

// Rótulo: "EXPEDIENTE" a máquina de escribir dentro de un sello + "VELA" grande con la llama del farol en la A.
function rotulo(cx, y, esc = 1, { sello = true } = {}) {
  return `<g transform="translate(${cx} ${y}) scale(${esc})">
    ${sello ? `<rect x="-330" y="-118" width="660" height="92" rx="8" fill="none" stroke="${ROJO}" stroke-width="8" transform="rotate(-2)"/>` : ''}
    <text x="0" y="-50" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="68" letter-spacing="14" fill="${sello ? ROJO : CREMA}" transform="rotate(-2)">EXPEDIENTE</text>
    <text x="0" y="150" text-anchor="middle" font-family="Inter" font-weight="900" font-size="230" letter-spacing="6" fill="${AMBAR}" stroke="${TINTA}" stroke-width="16" paint-order="stroke">VELA</text>
  </g>`;
}

// 1) Foto de perfil (YouTube y TikTok): Tinta con el farol, sin texto (se ve pequeña).
function avatar() {
  const r = azar(3);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs><radialGradient id="fondo" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#1E4A5E"/><stop offset="1" stop-color="#060C16"/></radialGradient>${halo('hFarol', '#FFC066', 0.6)}</defs>
  <rect width="800" height="800" fill="url(#fondo)"/>
  ${estrellas(r, 60, 800, 0, 800)}
  <circle cx="560" cy="560" r="300" fill="url(#hFarol)"/>
  ${capa(tinta({ pose: 'tranquilo' }), 130, 70, 1.65)}
  <g transform="translate(560 470) scale(2.6)">${aislar(`<svg>${farol(0, 0, true)}</svg>`).replace(/<\/?svg>/g, '')}</g>
  </svg>`;
}

// 2) Logo (fondo transparente): rótulo + Tinta asomado.
function logo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 560" width="1400" height="560">
  ${rotulo(640, 260, 1.15)}
  ${capa(tinta({ pose: 'desconfia' }), 1060, 60, 0.95)}
  </svg>`;
}

// 3) Banner de YouTube 2560 x 1440. Zona segura (se ve en todos los dispositivos): 1546 x 423 en el centro.
function banner() {
  const r = azar(9);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050B14"/><stop offset="0.6" stop-color="#0E2236"/><stop offset="1" stop-color="#174055"/></linearGradient>
  ${halo('hFarol', '#FFC066', 0.55)}${halo('hRojo', '#FF4A3A', 0.8)}${halo('hCentro', '#F2B35A', 0.18)}</defs>
  <rect width="2560" height="1440" fill="url(#cielo)"/>
  ${estrellas(r, 500, 2560, 0, 1440)}
  <ellipse cx="1280" cy="720" rx="900" ry="300" fill="url(#hCentro)"/>
  <!-- dos luces rojas a lo lejos (guiño al primer caso) -->
  <circle cx="1990" cy="560" r="60" fill="url(#hRojo)"/><circle cx="1990" cy="560" r="9" fill="#FF6A50"/>
  <circle cx="2040" cy="585" r="60" fill="url(#hRojo)"/><circle cx="2040" cy="585" r="9" fill="#FF6A50"/>
  <!-- suelo y siluetas lejanas -->
  <path d="M0 960 Q640 900 1280 940 T2560 930 V1440 H0 Z" fill="#132A3B"/>
  <path d="M0 1010 H2560 V1440 H0 Z" fill="#0F1C26"/>
  <!-- Teo con el farol (izquierda de la zona segura) -->
  <circle cx="760" cy="800" r="230" fill="url(#hFarol)"/>
  ${capa(teoFrente({ cara: 'chulo' }), 590, 512, 0.55)}
  <!-- Lucía (derecha) -->
  ${capa(luciaFrente({ cara: 'esceptica' }), 1750, 512, 0.55)}
  <!-- Tinta volando sobre el título -->
  ${capa(tinta({ pose: 'tranquilo' }), 1580, 515, 0.36)}
  ${rotulo(1280, 700, 0.95)}
  <text x="1280" y="900" text-anchor="middle" font-family="Inter" font-weight="700" font-size="46" fill="${CREMA}">Historias reales que no te contaron</text>
  </svg>`;
}

(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  const foto = async (svg, nombre, w, h, transparente = false) => {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nombre), omitBackground: transparente });
  };
  await foto(avatar(), 'perfil_800.png', 800, 800);
  await foto(logo(), 'logo_transparente.png', 1400, 560, true);
  await foto(banner(), 'banner_youtube_2560x1440.png', 2560, 1440);
  // Vista previa con la zona segura marcada (solo para revisar)
  const b2 = banner(), i = b2.lastIndexOf('</svg>');
  await foto(b2.slice(0, i) + '<rect x="507" y="508" width="1546" height="423" fill="none" stroke="#0f0" stroke-width="4" stroke-dasharray="20 10"/></svg>', 'banner_zona_segura_PREVIA.png', 2560, 1440);
  await b.close();
})();
