// 004 · Ría de Bilbao en el siglo XVII al atardecer. 1080 x 1920. Agua agitada abajo (donde se pierde Francisco).
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function bilbao() {
  const r = azar(42);
  const barco = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-160 0 H160 L120 70 H-120 Z" fill="#7A4E2A" stroke="${T}" stroke-width="6"/>
    <path d="M-150 20 H150" stroke="#5A3A1E" stroke-width="6"/><path d="M0 0 V-300" stroke="#5A3A1E" stroke-width="12"/><path d="M0 -280 L-120 0 M0 -280 L120 0" stroke="#3A2A1E" stroke-width="3"/>
    <path d="M10 -260 Q110 -200 90 -100 L10 -110 Z" fill="#E8DCC0" stroke="${T}" stroke-width="4"/></g>`;
  let edificios = '';
  [[0, 640, 200, 260], [190, 680, 170, 230], [350, 700, 190, 210], [530, 740, 150, 170], [670, 770, 130, 140], [790, 790, 110, 120]].forEach(([x, y, w, h], i) => {
    edificios += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i % 2 ? '#E2CDA4' : '#D8BE90'}" stroke="${T}" stroke-width="4"/><path d="M${x - 8} ${y} L${x + w / 2} ${y - 30} L${x + w + 8} ${y} Z" fill="#B8552E" stroke="${T}" stroke-width="3"/>
      ${Array.from({ length: Math.floor(w / 46) }, (_, k) => `<rect x="${x + 14 + k * 46}" y="${y + 30}" width="24" height="34" fill="#3A2A1E"/><rect x="${x + 10 + k * 46}" y="${y + 64}" width="32" height="6" fill="#2A2A2A"/>`).join('')}
      ${Array.from({ length: Math.floor(w / 70) }, (_, k) => `<path d="M${x + 12 + k * 70} ${y + h} V${y + h - 60} Q${x + 42 + k * 70} ${y + h - 100} ${x + 72 + k * 70} ${y + h - 60} V${y + h}" fill="#5A4A3A" stroke="${T}" stroke-width="3"/>`).join('')}`; });
  let olas = '';
  for (let i = 0; i < 26; i++) { const y = 1000 + Math.pow(i / 26, 1.4) * 900, s = 0.4 + i / 26 * 1.6;
    for (let k = -1; k < 6; k++) { const x = k * 220 + (i % 2) * 110 + r() * 40;
      olas += `<path d="M${x} ${y} q${55 * s} -${30 * s} ${110 * s} 0 q-${30 * s} -${6 * s} -${44 * s} ${2 * s}" fill="#1E4A50" stroke="#E8DCC0" stroke-width="${2 + s * 2}"/>`; } }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A6E78"/><stop offset="0.5" stop-color="#E08A3A"/><stop offset="1" stop-color="#F2B35A"/></linearGradient>
  <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A6A60"/><stop offset="1" stop-color="#173A40"/></linearGradient>${halo('hSol', '#FFD27A', 0.7)}</defs>
  <rect width="1080" height="1920" fill="url(#cielo)"/>
  <circle cx="860" cy="720" r="320" fill="url(#hSol)"/><circle cx="860" cy="740" r="80" fill="#FFE3A0"/>
  ${[[300, 300, 200], [700, 220, 180], [200, 520, 160]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="30" fill="#F08A3A" opacity="0.8"/>`).join('')}
  <path d="M0 760 Q300 600 620 640 Q860 680 1080 700 V1000 H0 Z" fill="#5A6A3A"/>
  ${Array.from({ length: 8 }, () => `<rect x="${(500 + r() * 560).toFixed(0)}" y="${(680 + r() * 80).toFixed(0)}" width="22" height="16" fill="#E8DCC0" stroke="${T}" stroke-width="2"/>`).join('')}
  <!-- iglesia -->
  <rect x="220" y="430" width="110" height="300" fill="#C8A878" stroke="${T}" stroke-width="5"/><path d="M220 430 Q275 360 330 430 Z" fill="#B8956A" stroke="${T}" stroke-width="5"/><path d="M275 360 V320 M262 336 H288" stroke="${T}" stroke-width="5"/>
  <path d="M255 470 Q275 450 295 470 V520 H255 Z" fill="#3A2A1E"/><rect x="330" y="560" width="220" height="180" fill="#C8A878" stroke="${T}" stroke-width="5"/><circle cx="440" cy="620" r="30" fill="#8A6A40" stroke="${T}" stroke-width="4"/>
  ${edificios}
  <!-- puente al fondo -->
  <path d="M600 890 H1080 V940 H600 Z" fill="#A89878" stroke="${T}" stroke-width="4"/>${[640, 820, 1000].map(x => `<path d="M${x} 1000 Q${x} 940 ${x + 80} 940 Q${x + 160} 940 ${x + 160} 1000 Z" fill="#2A3A3A" stroke="${T}" stroke-width="4"/>`).join('')}
  <rect x="0" y="910" width="600" height="70" fill="#9A8A6A" stroke="${T}" stroke-width="4"/>
  <!-- agua -->
  <rect y="980" width="1080" height="940" fill="url(#agua)"/>
  <path d="M760 990 L820 1300 L900 990 Z" fill="#F2B35A" opacity="0.35"/>
  ${olas}
  ${barco(480, 1040, 0.6)}${barco(130, 1180, 1.1)}
  <!-- muelle y bolardo en primer plano -->
  <path d="M0 1700 L360 1820 L420 1920 H0 Z" fill="#8A7A5A" stroke="${T}" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M${i * 120} ${1720 + i * 40} L${80 + i * 120} ${1920}" stroke="#6A5A40" stroke-width="3"/>`).join('')}
  <rect x="20" y="1480" width="110" height="240" rx="10" fill="#6A4A2A" stroke="${T}" stroke-width="5"/><path d="M20 1560 q55 30 110 0 M20 1590 q55 30 110 0" stroke="#C8A060" stroke-width="10" fill="none"/>
  </svg>`;
};
