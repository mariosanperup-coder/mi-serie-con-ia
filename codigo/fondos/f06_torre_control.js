// Escena 7: interior de la torre de control de noche (sin referencia: diseño propio). 1080 x 1920.
const { azar, PALETA: P, estrellas, halo } = require('./comun');

module.exports = function torreControl() {
  const r = azar(66), t = P.tinta;
  let pista = '';
  for (let i = 0; i < 18; i++) pista += `<circle cx="${120 + i * 50}" cy="${1010 - i * 6}" r="4" fill="${P.ambar}"/>`;
  for (let i = 0; i < 12; i++) pista += `<circle cx="${80 + i * 80}" cy="${1060 - i * 3}" r="3" fill="#5FD0E0"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.cieloAlto}"/><stop offset="1" stop-color="${P.cieloBajo}"/></linearGradient>
  ${halo('hRadar', '#4CE07A', 0.45)}${halo('hLampara', '#FFC066', 0.4)}</defs>
  <rect width="1080" height="1920" fill="#1B1A17"/>
  <!-- cristaleras inclinadas -->
  <path d="M0 260 H1080 V1100 H0 Z" fill="url(#cielo)"/>
  ${estrellas(r, 80, 1080, 0, 700).replace(/cy="(\d+(\.\d+)?)/g, (m, y) => `cy="${280 + (+y)}`)}
  <path d="M0 960 Q300 930 600 950 T1080 940 V1100 H0 Z" fill="${P.montana}"/>
  ${pista}
  <path d="M0 200 H1080 V280 H0 Z M0 1080 H1080 V1140 H0 Z" fill="#3A372F" stroke="${t}" stroke-width="5"/>
  ${[0, 270, 540, 810, 1080].map(x => `<path d="M${x} 280 L${x + (x - 540) * 0.08} 1080" stroke="#2A2822" stroke-width="26"/>`).join('')}
  <!-- techo -->
  <rect width="1080" height="200" fill="#121110"/>
  <path d="M540 0 V120" stroke="#111" stroke-width="5"/><path d="M480 170 Q540 100 600 170 Z" fill="#2a2a2a" stroke="${t}" stroke-width="4"/>
  <circle cx="540" cy="240" r="420" fill="url(#hLampara)"/>
  <!-- consola -->
  <path d="M0 1240 L1080 1240 L1080 1920 H0 Z" fill="#4A4A40" stroke="${t}" stroke-width="6"/>
  <path d="M0 1140 H1080 L1080 1240 H0 Z" fill="#5C5B50" stroke="${t}" stroke-width="6"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${40 + i * 74}" y="1170" width="50" height="40" rx="4" fill="${r() < 0.5 ? '#E8C27A' : '#2D2C26'}" stroke="${t}" stroke-width="3"/>`).join('')}
  <!-- pantalla de radar -->
  <circle cx="760" cy="1520" r="230" fill="url(#hRadar)"/>
  <rect x="560" y="1320" width="400" height="400" rx="20" fill="#2D2C26" stroke="${t}" stroke-width="6"/>
  <circle cx="760" cy="1520" r="170" fill="#0E2A16" stroke="${t}" stroke-width="5"/>
  <circle cx="760" cy="1520" r="115" fill="none" stroke="#2F8A4A" stroke-width="3"/><circle cx="760" cy="1520" r="58" fill="none" stroke="#2F8A4A" stroke-width="3"/>
  <path d="M590 1520 H930 M760 1350 V1690" stroke="#2F8A4A" stroke-width="3"/>
  <path d="M760 1520 L880 1400 A170 170 0 0 1 930 1520 Z" fill="#4CE07A" opacity="0.35"/>
  <circle cx="830" cy="1440" r="7" fill="#9CFFB4"/><circle cx="700" cy="1600" r="5" fill="#9CFFB4"/>
  <!-- radio y teléfono -->
  <rect x="80" y="1340" width="380" height="200" rx="12" fill="#2D2C26" stroke="${t}" stroke-width="5"/>
  ${Array.from({ length: 5 }, (_, i) => `<circle cx="${140 + i * 64}" cy="1400" r="20" fill="#5A574C" stroke="${t}" stroke-width="3"/>`).join('')}
  <rect x="120" y="1460" width="300" height="40" rx="6" fill="#E8A65A" stroke="${t}" stroke-width="3"/>
  <path d="M120 1640 h120 v60 h-120 z" fill="#1E1E1A" stroke="${t}" stroke-width="4"/><path d="M110 1630 q70 -50 140 0" stroke="#1E1E1A" stroke-width="22" fill="none" stroke-linecap="round"/>
  </svg>`;
};
