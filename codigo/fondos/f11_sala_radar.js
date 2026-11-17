// Sala del radar militar (Torrejón, 1979). 1080 x 1920. Los barridos llevan class="barrido" para animarlos.
const { PALETA: P, halo } = require('./comun');

const ESPANA = 'M20 40 L60 30 L120 35 L180 30 L230 40 L260 45 L300 55 L345 70 L360 80 L340 110 L310 140 L290 175 L280 200 L270 215 L285 240 L290 245 L260 270 L245 285 L200 300 L150 305 L120 315 L90 300 L60 290 L40 260 L30 200 L20 150 L15 100 Z';

module.exports = function salaRadar() {
  const t = P.tinta;
  const pantalla = (cx, cy, r, i) => `<circle cx="${cx}" cy="${cy}" r="${r * 1.5}" fill="url(#hVerde)"/>
    <rect x="${cx - r - 50}" y="${cy - r - 50}" width="${2 * r + 220}" height="${2 * r + 140}" rx="16" fill="#3E423F" stroke="${t}" stroke-width="5"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0C2A16" stroke="${t}" stroke-width="6"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="none" stroke="#2F8A4A" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r * 0.33}" fill="none" stroke="#2F8A4A" stroke-width="3"/>
    <path d="M${cx - r} ${cy} H${cx + r} M${cx} ${cy - r} V${cy + r}" stroke="#2F8A4A" stroke-width="2"/>
    <g class="barrido" data-cx="${cx}" data-cy="${cy}"><path d="M${cx} ${cy} L${cx + r} ${cy} A${r} ${r} 0 0 0 ${cx + r * 0.7} ${cy - r * 0.7} Z" fill="#4CE07A" opacity="0.45"/></g>
    ${[0, 1, 2].map(k => `<rect x="${cx + r + 30}" y="${cy - r + k * 50}" width="70" height="34" fill="${(i + k) % 2 ? '#E8A65A' : '#2D2C26'}" stroke="${t}" stroke-width="3"/>`).join('')}
    ${[0, 1, 2, 3].map(k => `<circle cx="${cx - r + 20 + k * 60}" cy="${cy + r + 50}" r="14" fill="#5A574C" stroke="${t}" stroke-width="3"/>`).join('')}`;
  const silla = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${t}" stroke-width="5"><rect x="-90" y="-180" width="180" height="200" rx="30" fill="#1E1E1C"/><rect x="-100" y="20" width="200" height="40" rx="12" fill="#262624"/><path d="M0 60 V160 M-90 190 L0 160 L90 190" fill="none" stroke="#1E1E1C" stroke-width="14"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hVerde', '#4CE07A', 0.35)}${halo('hLampara', '#FFC066', 0.45)}</defs>
  <rect width="1080" height="1920" fill="#1E2624"/>
  <rect y="0" width="1080" height="110" fill="#141A19"/>
  <!-- ventana con antena -->
  <rect x="0" y="180" width="300" height="440" fill="#173038" stroke="${t}" stroke-width="6"/>
  <path d="M90 620 L140 470 L190 620 M140 470 V430" stroke="#0A1214" stroke-width="10" fill="none"/>
  <path d="M60 380 Q140 300 230 400 Q150 470 60 380 Z" fill="#0A1214"/><circle cx="135" cy="350" r="6" fill="#FF4A3A"/>
  <!-- mapa de España en la pared -->
  <rect x="400" y="300" width="560" height="440" fill="#13262E" stroke="#6A5A3A" stroke-width="10"/>
  <g transform="translate(470 360) scale(1.1)"><path d="${ESPANA}" fill="#B08A4E" stroke="#D9B070" stroke-width="3"/>
    <ellipse cx="360" cy="200" rx="18" ry="10" fill="#B08A4E"/><ellipse cx="390" cy="185" rx="10" ry="6" fill="#B08A4E"/></g>
  <path d="M400 520 H960 M680 300 V740" stroke="#2E4A50" stroke-width="2"/>
  <!-- lámparas -->
  <path d="M260 0 V120 M940 0 V200" stroke="#111" stroke-width="5"/>
  <path d="M180 200 Q260 100 340 200 Z M860 280 Q940 180 1020 280 Z" fill="#2a2a2a" stroke="${t}" stroke-width="4"/>
  <circle cx="260" cy="200" r="380" fill="url(#hLampara)"/><circle cx="940" cy="280" r="320" fill="url(#hLampara)"/>
  <!-- consolas con radares -->
  ${pantalla(250, 950, 170, 0)}${pantalla(640, 900, 110, 1)}${pantalla(920, 900, 90, 2)}
  <rect x="0" y="1180" width="1080" height="80" fill="#3E423F" stroke="${t}" stroke-width="5"/>
  <rect x="0" y="1260" width="1080" height="660" fill="#2A2E2C"/>
  ${silla(330, 1500, 1.4)}${silla(800, 1300, 0.9)}
  <!-- mesa con teléfono rojo -->
  <path d="M640 1560 H1080 V1920 H640 Z" fill="#3A3E3C" stroke="${t}" stroke-width="6"/><path d="M640 1560 H1080 V1600 H640 Z" fill="#4A4E4A" stroke="${t}" stroke-width="5"/>
  <path d="M800 1500 h160 l20 60 h-200 z" fill="#C0392B" stroke="${t}" stroke-width="5"/><path d="M790 1490 q90 -60 180 0" stroke="#A02A20" stroke-width="30" fill="none" stroke-linecap="round"/>
  <circle cx="880" cy="1530" r="18" fill="#EDE3CF" stroke="${t}" stroke-width="3"/>
  </svg>`;
};
