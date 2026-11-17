// 002 · Bélmez de la Moraleda (pueblo blanco de Jaén) al atardecer. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function pueblo() {
  const r = azar(71);
  let casas = '';
  for (let i = 0; i < 46; i++) {
    const fila = Math.floor(i / 9), x = 380 + (i % 9) * 78 + (fila % 2) * 30 + r() * 20, y = 640 + fila * 70 + r() * 20, w = 60 + r() * 30, h = 50 + r() * 30;
    casas += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F4EBDA" stroke="${T}" stroke-width="2.5"/><path d="M${x - 4} ${y} L${x + w / 2} ${y - 18} L${x + w + 4} ${y} Z" fill="#C0602A" stroke="${T}" stroke-width="2.5"/><rect x="${x + w * 0.4}" y="${y + h * 0.4}" width="9" height="12" fill="#3A3A3A"/>`;
  }
  let olivos = '';
  for (let i = 0; i < 26; i++) { const x = 380 + r() * 720, y = 980 + r() * 520, s = 0.7 + (y - 980) / 520 * 0.8;
    olivos += `<path d="M${x} ${y} v${40 * s}" stroke="#4A3220" stroke-width="${8 * s}"/><ellipse cx="${x}" cy="${y - 10 * s}" rx="${46 * s}" ry="${32 * s}" fill="#5E7A40" stroke="${T}" stroke-width="3"/><ellipse cx="${x - 12 * s}" cy="${y - 18 * s}" rx="${22 * s}" ry="${14 * s}" fill="#7E9A58"/>`; }
  const maceta = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 H40 L30 70 H-30 Z" fill="#C0602A" stroke="${T}" stroke-width="4"/>
    <circle cx="-20" cy="-20" r="22" fill="#4A7A3A"/><circle cx="18" cy="-26" r="24" fill="#4A7A3A"/>${[[-28, -34], [0, -46], [26, -30], [-6, -14]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="10" fill="#E0442E" stroke="${T}" stroke-width="2"/>`).join('')}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A6A78"/><stop offset="0.45" stop-color="#E8A048"/><stop offset="0.6" stop-color="#F4B850"/></linearGradient>
  ${halo('hSol', '#FFE3A0', 0.7)}${halo('hFarol', '#FFD27A', 0.6)}</defs>
  <rect width="1080" height="1100" fill="url(#cielo)"/>
  <circle cx="200" cy="640" r="260" fill="url(#hSol)"/><circle cx="200" cy="650" r="80" fill="#FFD27A"/>
  <path d="M120 260 q120 -30 260 -6 M560 160 q140 -20 300 10" stroke="#F6C27A" stroke-width="10" fill="none" opacity="0.7"/>
  <!-- sierra -->
  <path d="M0 760 L180 620 L320 520 L420 360 L480 300 L560 380 L640 280 L740 230 L820 340 L940 300 L1080 380 V1100 H0 Z" fill="#B86A3A" stroke="${T}" stroke-width="4"/>
  <path d="M420 360 L470 480 L520 420 M640 280 L700 420 L760 360" stroke="#7A3E22" stroke-width="6" fill="none"/>
  <path d="M0 860 Q300 640 600 700 T1080 640 V1100 H0 Z" fill="#4E6A50"/>
  ${casas}
  <!-- iglesia -->
  <rect x="640" y="460" width="90" height="190" fill="#EFE2C8" stroke="${T}" stroke-width="4"/><path d="M630 460 L685 405 L740 460 Z" fill="#C0602A" stroke="${T}" stroke-width="4"/>
  <path d="M668 490 Q685 470 702 490 V530 H668 Z" fill="#3A3A3A"/><rect x="600" y="600" width="240" height="90" fill="#EFE2C8" stroke="${T}" stroke-width="4"/><path d="M590 600 L720 560 L850 600 Z" fill="#C0602A" stroke="${T}" stroke-width="4"/>
  <path d="M0 980 Q500 900 1080 960 V1920 H0 Z" fill="#8A6A3A"/>
  ${olivos}
  <!-- casa en primer plano -->
  <path d="M0 860 L420 1060 V1920 H0 Z" fill="#F4EBDA" stroke="${T}" stroke-width="5"/>
  <path d="M0 790 L470 1030 L440 1080 L0 870 Z" fill="#C0602A" stroke="${T}" stroke-width="5"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 50} ${812 + i * 25} q20 20 40 20" stroke="${T}" stroke-width="3" fill="none"/>`).join('')}
  <rect x="170" y="1300" width="150" height="320" fill="#2E5A3A" stroke="${T}" stroke-width="5"/><path d="M245 1300 V1620" stroke="#1E3A26" stroke-width="4"/>
  <rect x="150" y="1280" width="190" height="24" fill="#C9B898" stroke="${T}" stroke-width="4"/>
  <circle cx="260" cy="1080" r="140" fill="url(#hFarol)"/>
  <path d="M170 1060 H230" stroke="${T}" stroke-width="6"/><path d="M230 1040 h60 l10 20 h-80 z M230 1060 h70 v70 h-70 z" fill="#FFE3A0" stroke="${T}" stroke-width="5"/>
  ${maceta(80, 1580, 1.2)}${maceta(110, 1830, 1.4)}
  <!-- calle empedrada -->
  <path d="M420 1640 Q760 1580 1080 1620 V1920 H420 Z" fill="#C8A878"/>
  ${Array.from({ length: 40 }, () => `<ellipse cx="${(440 + r() * 640).toFixed(0)}" cy="${(1660 + r() * 250).toFixed(0)}" rx="26" ry="12" fill="none" stroke="#9A7A50" stroke-width="3"/>`).join('')}
  <path d="M900 1500 H1080 V1920 H900 Z" fill="#F4EBDA" stroke="${T}" stroke-width="5"/>${maceta(990, 1800, 1.3)}
  </svg>`;
};
