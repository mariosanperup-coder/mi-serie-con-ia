// 005 · Playa de Río (1989): palmera, chiringuito, Pan de Azúcar, sombrillas, paseo de ondas. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function brasil() {
  const r = azar(53);
  const sombrilla = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V120" stroke="#5A4A3A" stroke-width="8"/><path d="M-110 10 Q0 -70 110 10 Z" fill="#F2B640" stroke="${T}" stroke-width="5"/>${[-60, 0, 60].map(a => `<path d="M0 -50 L${a} 10" stroke="#F8E6B0" stroke-width="10"/>`).join('')}
    <path d="M-60 160 l60 -40 l20 0 l-50 40 z M30 160 l60 -40 l20 0 l-50 40 z" fill="#D8C090" stroke="${T}" stroke-width="3"/></g>`;
  let ondas = '';
  for (let i = 0; i < 9; i++) { const y = 1480 + i * 60; ondas += `<path d="M-40 ${y} q135 -${30 + i * 4} 270 0 t270 0 t270 0 t270 0" stroke="#2A2A2A" stroke-width="${18 + i * 3}" fill="none"/>`; }
  const hoja = (x, y, a, l) => `<path d="M${x} ${y} q${Math.cos(a) * l * 0.5} ${Math.sin(a) * l * 0.5 - 40} ${Math.cos(a) * l} ${Math.sin(a) * l}" stroke="#3E7A30" stroke-width="22" fill="none" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E7A8A"/><stop offset="1" stop-color="#7AC8C0"/></linearGradient>
  <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E8A9A"/><stop offset="1" stop-color="#3AB0A0"/></linearGradient></defs>
  <rect width="1080" height="1050" fill="url(#cielo)"/>
  ${[[860, 520, 170], [400, 780, 110], [1000, 760, 120]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.45}" fill="#F8F2E0"/><ellipse cx="${x - w * 0.4}" cy="${y + 10}" rx="${w * 0.6}" ry="${w * 0.3}" fill="#F2E6C8"/>`).join('')}
  <!-- Pan de Azúcar -->
  <path d="M580 980 Q600 720 700 690 Q790 700 800 980 Z" fill="#7A6A4A" stroke="${T}" stroke-width="4"/><path d="M640 780 Q700 700 760 790" stroke="#9A8A62" stroke-width="18" fill="none"/>
  <path d="M480 1000 Q640 820 820 860 Q960 880 1080 940 V1040 H480 Z" fill="#3E6A3A" stroke="${T}" stroke-width="4"/>
  ${Array.from({ length: 30 }, () => `<rect x="${(520 + r() * 520).toFixed(0)}" y="${(990 + r() * 40).toFixed(0)}" width="${(16 + r() * 20).toFixed(0)}" height="${(20 + r() * 30).toFixed(0)}" fill="#F2EAD8" stroke="#B8A888" stroke-width="2"/>`).join('')}
  <rect y="1040" width="1080" height="210" fill="url(#mar)"/>
  ${[1100, 1160, 1210].map((y, i) => `<path d="M${360 + i * 40} ${y} q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#F4FBF8" stroke-width="${5 + i * 2}" fill="none"/>`).join('')}
  <!-- arena -->
  <path d="M0 1250 Q540 1210 1080 1240 V1480 H0 Z" fill="#F2D28A"/>
  ${sombrilla(560, 1250, 0.6)}${sombrilla(820, 1240, 0.8)}${sombrilla(940, 1290, 0.55)}
  <!-- chiringuito -->
  <rect x="0" y="1170" width="420" height="180" fill="#C88A3A" stroke="${T}" stroke-width="5"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${20 + i * 28}" y="1190" width="14" height="40" rx="4" fill="${['#3A8A4A', '#8A3A2A', '#E8C060'][i % 3]}"/>`).join('')}
  <rect x="0" y="1250" width="460" height="30" fill="#8A5A2A" stroke="${T}" stroke-width="4"/>
  ${[90, 190, 290, 390].map(x => `<rect x="${x - 20}" y="1290" width="40" height="14" fill="#6A4222"/><path d="M${x - 14} 1304 v60 M${x + 14} 1304 v60" stroke="#6A4222" stroke-width="6"/>`).join('')}
  <path d="M-30 1170 Q200 940 470 1150 Z" fill="#D9A84A" stroke="${T}" stroke-width="5"/>${Array.from({ length: 18 }, (_, i) => `<path d="M${-10 + i * 26} ${1130 - Math.sin(i / 17 * Math.PI) * 140} l-6 50" stroke="#B88A3A" stroke-width="4"/>`).join('')}
  <path d="M440 1150 V1350" stroke="#6A4222" stroke-width="12"/>
  <!-- palmera -->
  <path d="M120 1380 Q60 900 200 300" stroke="#6A4A2A" stroke-width="44" fill="none"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${130 - i * 2} ${1340 - i * 75} q20 -6 40 0" stroke="#4A3220" stroke-width="5" fill="none"/>`).join('')}
  ${[[-2.6, 420], [-2.0, 400], [-1.3, 380], [-0.6, 440], [0.1, 460], [0.6, 380], [2.8, 300]].map(([a, l]) => hoja(200, 300, a, l)).join('')}
  <ellipse cx="100" cy="1400" rx="160" ry="70" fill="#3E7A30" stroke="${T}" stroke-width="4"/>
  <!-- paseo de ondas -->
  <rect y="1460" width="1080" height="460" fill="#F2EAD8"/>${ondas}
  <path d="M0 1460 Q540 1430 1080 1470" stroke="#C8B89E" stroke-width="10" fill="none"/>
  </svg>`;
};
