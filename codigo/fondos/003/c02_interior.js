// 003 · Interior del santuario. Marco en la pared (el cuadro se dibuja aparte en el hueco: x 470-770, y 420-820). 1080 x 1920.
const { halo } = require('../comun');
const T = '#0B0E13';
module.exports = function interior() {
  const banco = (x, y, w, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="${w}" height="40" fill="#8A5A30" stroke="${T}" stroke-width="5"/>
    <rect x="0" y="40" width="${w}" height="170" fill="#7A4E2A" stroke="${T}" stroke-width="5"/><rect x="0" y="210" width="${w}" height="30" fill="#6A4222" stroke="${T}" stroke-width="4"/>
    <path d="M${w - 40} -40 Q${w + 10} -40 ${w + 10} 20 V300 H${w - 60} V20 Z" fill="#8A5A30" stroke="${T}" stroke-width="5"/>
    ${[[0, -10], [10, 0], [0, 10], [-10, 0]].map(([a, b]) => `<circle cx="${w - 25 + a}" cy="${70 + b}" r="9" fill="#3A2214"/>`).join('')}</g>`;
  let losas = '';
  for (let f = 0; f < 6; f++) for (let c = 0; c < 6; c++) { const y = 1300 + f * f * 18 + f * 60, h = 60 + f * 36, x = c * 200 - (f % 2) * 100 + 300 - f * 30;
    losas += `<rect x="${x}" y="${y}" width="200" height="${h}" fill="none" stroke="#8A6A40" stroke-width="3"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="pared" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8C890"/><stop offset="1" stop-color="#C89A5A"/></linearGradient>
  <linearGradient id="haz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE3A0" stop-opacity="0.55"/><stop offset="1" stop-color="#FFE3A0" stop-opacity="0"/></linearGradient>
  ${halo('hVela', '#FFC066', 0.6)}</defs>
  <rect width="1080" height="1920" fill="#2E5A5E"/>
  <!-- capilla del fondo a la izquierda -->
  <path d="M0 0 H260 V1300 H0 Z" fill="#24484C"/><path d="M20 520 Q130 380 240 520 V1300 H20 Z" fill="#2E5A5E" stroke="${T}" stroke-width="4"/>
  <path d="M120 600 V820 M70 670 H170" stroke="#3A2A1E" stroke-width="22"/>
  <rect x="0" y="1010" width="200" height="40" fill="#F2EAD8" stroke="${T}" stroke-width="3"/><rect x="0" y="1050" width="200" height="250" fill="#C8B898"/>
  <path d="M40 1010 V900 M180 1010 V900" stroke="#C9A050" stroke-width="10"/><rect x="34" y="860" width="12" height="40" fill="#F2EAD8"/><rect x="174" y="860" width="12" height="40" fill="#F2EAD8"/>
  <!-- pared principal -->
  <path d="M260 0 H1080 V1300 H260 Z" fill="url(#pared)"/>
  <rect x="260" y="1060" width="820" height="240" fill="#3E6A66"/><path d="M260 1060 H1080" stroke="#8A6A40" stroke-width="10"/>
  <!-- ventana alta -->
  <path d="M500 180 Q560 110 620 180 V420 H500 Z" fill="#FFE7A8" stroke="${T}" stroke-width="5"/><path d="M560 120 V420 M500 260 H620 M500 340 H620" stroke="#6A4A2A" stroke-width="6"/>
  <path d="M500 420 L620 420 L1080 1150 L1080 1300 L760 1300 Z" fill="url(#haz)"/>
  <!-- marco del cuadro -->
  <rect x="452" y="402" width="336" height="436" fill="none" stroke="#6A4222" stroke-width="22"/><rect x="452" y="402" width="336" height="436" fill="none" stroke="${T}" stroke-width="4"/>
  <rect x="470" y="420" width="300" height="400" fill="#D9BC88"/>
  <!-- farol de pared -->
  <path d="M1080 760 H990 Q960 760 960 730" stroke="#2A2A2A" stroke-width="8" fill="none"/>
  <path d="M920 600 L1000 600 L990 720 L930 720 Z" fill="#2A2A2A" stroke="${T}" stroke-width="4"/><rect x="945" y="630" width="30" height="70" fill="#FFE3A0"/>
  <path d="M915 600 L960 560 L1005 600 Z" fill="#2A2A2A"/><circle cx="960" cy="660" r="120" fill="url(#hVela)"/>
  <!-- columna -->
  <rect x="150" y="0" width="210" height="1150" fill="#D9C098" stroke="${T}" stroke-width="5"/><rect x="120" y="300" width="270" height="60" fill="#C8AE88" stroke="${T}" stroke-width="5"/>
  <rect x="120" y="1100" width="270" height="200" fill="#C8AE88" stroke="${T}" stroke-width="5"/><path d="M200 0 V1100" stroke="#C0A880" stroke-width="16"/>
  <!-- vigas -->
  <path d="M260 0 H1080 V60 H260 Z" fill="#5A3A20"/><rect x="600" y="0" width="80" height="110" fill="#6A4222" stroke="${T}" stroke-width="4"/><rect x="900" y="0" width="80" height="110" fill="#6A4222" stroke="${T}" stroke-width="4"/>
  <!-- suelo -->
  <rect y="1300" width="1080" height="620" fill="#C8A26A"/>${losas}
  <path d="M760 1300 L1080 1300 L1080 1700 Z" fill="#FFE3A0" opacity="0.25"/>
  <!-- bancos -->
  ${banco(-60, 1330, 700, 1)}${banco(-120, 1540, 560, 1.15)}${banco(-200, 1760, 440, 1.3)}
  </svg>`;
};
