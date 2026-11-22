// 005 · Plató de TV de los 90: focos, mesa, pantalla con logo, micrófono, escalones, butacas. 1080 x 1920.
const { halo } = require('../comun');
const T = '#0B0E13';
module.exports = function plato() {
  const foco = (x) => `<path d="M${x} 0 V70" stroke="#1A1A1A" stroke-width="6"/><rect x="${x - 50}" y="70" width="100" height="70" rx="12" fill="#2A2A2A" stroke="${T}" stroke-width="4"/><circle cx="${x}" cy="128" r="34" fill="#FFE3A0"/>
    <path d="M${x - 40} 150 L${x + 40} 150 L${x + 160} 1300 L${x - 160} 1300 Z" fill="#FFE3A0" opacity="0.13"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hSpot', '#FFC066', 0.55)}<linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C86A3A"/><stop offset="1" stop-color="#8A3E22"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="#1E4A50"/>
  <rect y="0" width="1080" height="60" fill="#142A30"/><path d="M0 40 H1080" stroke="#3A3A3A" stroke-width="12"/>
  <!-- pantalla con logo -->
  <path d="M-40 500 L520 460 L560 1080 L-40 1080 Z" fill="#E8A040" stroke="${T}" stroke-width="6"/><path d="M0 540 L480 510 L510 1040 L0 1040 Z" fill="#2E6A6E"/>
  <circle cx="200" cy="780" r="170" fill="#F2A040"/><path d="M-20 820 L500 700 M-20 860 L500 740 M-20 900 L500 780" stroke="#E8763A" stroke-width="22"/>
  <!-- columnas de luces -->
  <rect x="840" y="560" width="140" height="560" fill="#E8A040" stroke="${T}" stroke-width="5"/>${Array.from({ length: 8 }, (_, i) => `<circle cx="910" cy="${610 + i * 64}" r="18" fill="#FFE3A0"/>`).join('')}
  <rect x="990" y="560" width="90" height="560" fill="#D88A30" stroke="${T}" stroke-width="5"/>
  <!-- planta -->
  <rect x="680" y="880" width="110" height="200" fill="#C88A3A" stroke="${T}" stroke-width="4"/>${[-1.4, -0.8, -0.2, 0.4, 1.0, 1.6, 2.2].map(a => `<path d="M735 880 q${Math.cos(a - 1.6) * 80} ${-60} ${Math.cos(a - 1.6) * 170} ${-110 + Math.abs(a) * 30}" stroke="#4A7A3A" stroke-width="20" fill="none" stroke-linecap="round"/>`).join('')}
  <!-- escalones -->
  ${[0, 1, 2, 3].map(i => `<rect x="${700 + i * 40}" y="${1080 + i * 50}" width="${380 - i * 40}" height="50" fill="#2E6A6E" stroke="${T}" stroke-width="4"/>`).join('')}
  <!-- suelo del escenario -->
  <path d="M0 1080 H1080 V1520 Q540 1600 0 1520 Z" fill="url(#suelo)" stroke="${T}" stroke-width="5"/>
  <ellipse cx="560" cy="1380" rx="360" ry="90" fill="#FFE3A0" opacity="0.45"/>
  <!-- mesa del presentador -->
  <path d="M-20 1060 H500 Q520 1060 520 1080 V1260 H-20 Z" fill="#E8A040" stroke="${T}" stroke-width="6"/><path d="M180 1100 L360 1240 H180 Z" fill="#2E6A6E"/>
  <rect x="140" y="980" width="110" height="80" rx="20" fill="#1E3A40" stroke="${T}" stroke-width="4"/>
  <!-- borde del escenario y butacas -->
  <path d="M0 1520 Q540 1600 1080 1520 V1620 Q540 1700 0 1620 Z" fill="#C8662A" stroke="${T}" stroke-width="4"/>
  ${[0, 1].map(f => Array.from({ length: 6 }, (_, i) => `<path d="M${-60 + i * 200 + f * 100} ${1920} V${1760 + f * 80} Q${40 + i * 200 + f * 100} ${1700 + f * 80} ${140 + i * 200 + f * 100} ${1760 + f * 80} V1920 Z" fill="#14303A" stroke="${T}" stroke-width="4"/>`).join('')).join('')}
  ${[120, 380, 640, 900].map(foco).join('')}
  </svg>`;
};
