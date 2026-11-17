// Logo con Teo sujetando la carpeta "EXPEDIENTE VELA" (y Tinta en el hombro).
// Uso: node marca4.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { teoFrente, COLORES_TEO: CT } = require('../personajes/teo');
const { tinta } = require('../personajes/tinta');
const { azar, estrellas, halo, nube } = require('../fondos/comun');
const { luciaFrente } = require('../personajes/lucia');
const { avion } = require('../objetos/objetos');
let n = 0;
const aislar = s => { const p = 'w' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc) => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const T = '#151515', AMBAR = '#F2B35A', CREMA = '#F2E6CF', ROJO = '#C0392B';

// Teo (caja 400 x 760) sujetando la carpeta a la altura del pecho.
function teoConCarpeta(cara = 'chulo') {
  const manga = (d) => `<path d="${d}" fill="none" stroke="${T}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${CT.abrigo}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
  const carpeta = `<g transform="rotate(-4 200 380)">
    <rect x="62" y="282" width="276" height="196" rx="8" fill="#EFE6D2" stroke="${T}" stroke-width="5" transform="rotate(3 200 380)"/>
    <path d="M52 296 V270 Q52 260 62 260 H150 Q160 260 164 270 L172 296 Z" fill="#C9A066" stroke="${T}" stroke-width="5"/>
    <rect x="48" y="292" width="304" height="200" rx="10" fill="#D9B27A" stroke="${T}" stroke-width="6"/>
    <text x="200" y="352" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="32" letter-spacing="4" fill="#2A1A0C">EXPEDIENTE</text>
    <path d="M70 366 H330" stroke="#8A6438" stroke-width="3" stroke-dasharray="10 7"/>
    <text x="200" y="448" text-anchor="middle" font-family="Inter" font-weight="900" font-size="86" letter-spacing="4" fill="${AMBAR}" stroke="${T}" stroke-width="10" paint-order="stroke">VELA</text>
    <g transform="translate(282 474) rotate(-10)"><rect x="-62" y="-16" width="124" height="32" rx="5" fill="none" stroke="${ROJO}" stroke-width="4"/>
      <text x="0" y="7" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="16" fill="${ROJO}">CASO ABIERTO</text></g>
  </g>`;
  // Las mangas salen de los hombros y se doblan hacia los bordes de la carpeta; los guantes la agarran por delante.
  const brazos = manga('M132 244 L98 330 L66 392') + manga('M268 244 L304 330 L334 382');
  const guantes = `<ellipse cx="62" cy="400" rx="20" ry="24" fill="${T}"/><path d="M70 384 q16 4 20 16" stroke="${T}" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="336" cy="388" rx="20" ry="24" fill="${T}"/><path d="M328 372 q-16 4 -20 16" stroke="${T}" stroke-width="12" stroke-linecap="round"/>`;
  const base = teoFrente({ cara, conFarol: false });
  return base.replace(/<\/g><\/svg>\s*$/, `${brazos}${carpeta}${guantes}</g></svg>`);
}

// 1) Logo transparente: Teo de cuerpo entero con la carpeta y Tinta en el hombro.
function logo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 820" width="520" height="820">
  <defs><radialGradient id="halo"><stop offset="0" stop-color="#FFC066" stop-opacity="0.45"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="260" cy="420" rx="250" ry="330" fill="url(#halo)"/>
  ${capa(teoConCarpeta(), 60, 30, 1)}
  ${capa(tinta({ pose: 'tranquilo' }), 282, 130, 0.34)}
  </svg>`;
}

// 2) Foto de perfil: plano medio (cabeza + carpeta) dentro de un círculo de noche con aro dorado.
function perfil() {
  const r = azar(41);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs><radialGradient id="cielo" cx="0.5" cy="0.45" r="0.65"><stop offset="0" stop-color="#2A5A70"/><stop offset="0.6" stop-color="#12324A"/><stop offset="1" stop-color="#0A1622"/></radialGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#FFC066" stop-opacity="0.5"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient>
  <clipPath id="c"><circle cx="400" cy="400" r="384"/></clipPath></defs>
  <g clip-path="url(#c)"><rect width="800" height="800" fill="url(#cielo)"/>${estrellas(r, 70, 800, 0, 800)}
    <circle cx="400" cy="470" r="330" fill="url(#halo)"/>
    ${capa(teoConCarpeta(), 130, 62, 1.35)}
    ${capa(tinta({ pose: 'tranquilo' }), 430, 197, 0.46)}</g>
  <circle cx="400" cy="400" r="384" fill="none" stroke="${AMBAR}" stroke-width="14"/>
  </svg>`;
}

// 3) Banner de YouTube 2560 x 1440 con Teo y la carpeta (zona segura central 1546 x 423).
function banner() {
  const r = azar(33);
  const pueblo = (y, esc, color) => `<g transform="translate(0 ${y}) scale(${esc} 1)" fill="${color}"><path d="M0 0 V-40 H40 V-70 H70 V-40 H110 V-60 L130 -80 L150 -60 V-30 H190 V-90 H200 V-150 L215 -175 L230 -150 V-90 H240 V-30 H290 V-55 H330 V-20 H380 V-65 L400 -85 L420 -65 V-25 H470 V-45 H520 V0 Z"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050B14"/><stop offset="0.55" stop-color="#0E2236"/><stop offset="0.8" stop-color="#1B4A60"/><stop offset="1" stop-color="#2A5A68"/></linearGradient>
  <linearGradient id="niebla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A5A68" stop-opacity="0"/><stop offset="1" stop-color="#0A1622" stop-opacity="1"/></linearGradient>
  ${halo('hLuna', '#FFE3A0', 0.5)}${halo('hTeo', '#FFC066', 0.45)}${halo('hRojo', '#FF4A3A', 0.8)}</defs>
  <rect width="2560" height="1440" fill="url(#cielo)"/>${estrellas(r, 600, 2560, 0, 1000)}
  <circle cx="2010" cy="560" r="260" fill="url(#hLuna)"/><circle cx="2010" cy="560" r="78" fill="#F7DFA0"/>
  <circle cx="1985" cy="540" r="14" fill="#E2C27C"/><circle cx="2035" cy="585" r="10" fill="#E2C27C"/>
  ${nube(250, 640, 520, r, { opacidad: 0.55 })}${nube(1650, 720, 480, r, { opacidad: 0.6 })}${nube(1100, 520, 380, r, { opacidad: 0.35 })}
  ${capa(avion(), 1560, 590, 0.16)}
  <circle cx="1770" cy="600" r="44" fill="url(#hRojo)"/><circle cx="1770" cy="600" r="6" fill="#FF6A50"/>
  <circle cx="1805" cy="618" r="44" fill="url(#hRojo)"/><circle cx="1805" cy="618" r="6" fill="#FF6A50"/>
  <path d="M0 900 Q400 800 820 870 T1700 850 T2560 880 V1440 H0 Z" fill="#132A3B"/>${pueblo(905, 4.9, '#0E2030')}
  ${Array.from({ length: 50 }, () => `<rect x="${(r() * 2500).toFixed(0)}" y="${(830 + r() * 60).toFixed(0)}" width="6" height="8" fill="#F2B35A" opacity="0.85"/>`).join('')}
  <rect y="880" width="2560" height="560" fill="url(#niebla)"/>
  <path d="M0 1180 Q500 1080 1100 1150 T2560 1120 V1440 H0 Z" fill="#081420"/>
  <!-- Nombre a la izquierda -->
  <text x="930" y="660" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="70" letter-spacing="16" fill="${CREMA}" stroke="${T}" stroke-width="10" paint-order="stroke">EXPEDIENTE</text>
  <text x="930" y="850" text-anchor="middle" font-family="Inter" font-weight="900" font-size="230" letter-spacing="8" fill="${AMBAR}" stroke="${T}" stroke-width="18" paint-order="stroke">VELA</text>
  <text x="930" y="918" text-anchor="middle" font-family="Inter" font-weight="700" font-size="40" fill="${CREMA}">Historias reales que no te contaron</text>
  <!-- Teo con la carpeta y Tinta (centro-derecha) -->
  <ellipse cx="1500" cy="740" rx="260" ry="300" fill="url(#hTeo)"/>
  ${capa(teoConCarpeta(), 1390, 512, 0.53)}
  ${capa(tinta({ pose: 'tranquilo' }), 1508, 565, 0.18)}
  <!-- Lucía a la derecha -->
  ${capa(luciaFrente({ cara: 'esceptica' }), 1800, 512, 0.53)}
  </svg>`;
}

(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  const ban = banner(), i = ban.lastIndexOf('</svg>');
  for (const [nombre, svg, w, h] of [['logo_transparente.png', logo(), 520, 820], ['perfil_800.png', perfil(), 800, 800], ['banner_youtube_2560x1440.png', ban, 2560, 1440],
    ['banner_zona_segura_PREVIA.png', ban.slice(0, i) + '<rect x="507" y="508" width="1546" height="423" fill="none" stroke="#0f0" stroke-width="4" stroke-dasharray="20 10"/></svg>', 2560, 1440]]) {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nombre), omitBackground: !nombre.startsWith('banner') });
  }
  await b.close();
})();
