// 005 · Calle de ciudad española en 1989 al atardecer: edificio de ladrillo con banco, cabina, farolas. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function calle() {
  const r = azar(51);
  const edificio = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${T}" stroke-width="3"/>${Array.from({ length: Math.floor(h / 90) * Math.floor(w / 70) }, (_, i) => { const cx = i % Math.floor(w / 70), cy = Math.floor(i / Math.floor(w / 70));
    return `<rect x="${x + 14 + cx * 70}" y="${y + 20 + cy * 90}" width="36" height="46" fill="${r() < 0.4 ? '#F2C470' : '#5A4A3E'}" stroke="${T}" stroke-width="2"/><rect x="${x + 8 + cx * 70}" y="${y + 66 + cy * 90}" width="48" height="8" fill="#2A2A2A"/>`; }).join('')}`;
  const balcon = (x, y) => `<rect x="${x}" y="${y}" width="250" height="22" fill="#C8B49A" stroke="${T}" stroke-width="4"/>${Array.from({ length: 13 }, (_, i) => `<path d="M${x + 6 + i * 19} ${y} v-80" stroke="#1A1A1A" stroke-width="4"/>`).join('')}<path d="M${x} ${y - 80} h250" stroke="#1A1A1A" stroke-width="6"/>
    <rect x="${x + 70}" y="${y - 210}" width="120" height="200" fill="#E2D2B8" stroke="${T}" stroke-width="4"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${x + 70} ${y - 200 + i * 20} h120" stroke="#B8A890" stroke-width="3"/>`).join('')}
    ${[30, 210].map(dx => `<rect x="${x + dx}" y="${y - 30}" width="26" height="22" fill="#C0602A"/><circle cx="${x + dx + 13}" cy="${y - 38}" r="16" fill="#4A7A3A"/>`).join('')}`;
  const arbol = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 0 V-260 M0 -200 l60 -60" stroke="#3A2A1E" stroke-width="22"/>${[[-60, -330, 110], [60, -360, 120], [0, -440, 120], [-100, -250, 80], [110, -270, 90]].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="${c}" fill="#2E5A3A" stroke="${T}" stroke-width="3"/>`).join('')}${[[-40, -400], [70, -330], [10, -500]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="50" fill="#5E7A3A" opacity="0.7"/>`).join('')}</g>`;
  const farola = (x, y, h) => `<path d="M${x} ${y} V${y - h} q0 -40 70 -40" stroke="#4A4E52" stroke-width="12" fill="none"/><path d="M${x + 50} ${y - h - 50} h60 l-8 20 h-44 z" fill="#3A3E42" stroke="${T}" stroke-width="3"/><ellipse cx="${x + 80}" cy="${y - h - 26}" rx="22" ry="8" fill="#FFE3A0"/><circle cx="${x + 80}" cy="${y - h}" r="120" fill="url(#hFarola)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C0442A"/><stop offset="0.5" stop-color="#F08A3A"/><stop offset="1" stop-color="#F6B85A"/></linearGradient>
  ${halo('hSol', '#FFE3A0', 0.7)}${halo('hFarola', '#FFD27A', 0.55)}
  <linearGradient id="asfalto" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4E48"/><stop offset="1" stop-color="#3A3230"/></linearGradient></defs>
  <rect width="1080" height="1300" fill="url(#cielo)"/>
  <circle cx="330" cy="600" r="260" fill="url(#hSol)"/><circle cx="330" cy="620" r="100" fill="#FFD27A"/>
  ${[[150, 260, 160], [600, 180, 200]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="22" fill="#F6A04A" opacity="0.8"/>`).join('')}
  ${edificio(-20, 640, 220, 560, '#B8604A')}${edificio(170, 700, 180, 500, '#C87A5A')}${edificio(400, 520, 220, 680, '#B8604A')}
  ${[80, 230, 480, 560].map(x => `<path d="M${x} ${x === 80 ? 640 : x === 230 ? 700 : 520} v-50 M${x - 20} ${x === 80 ? 600 : x === 230 ? 660 : 480} h40" stroke="${T}" stroke-width="3"/>`).join('')}
  ${arbol(140, 1300, 1)}${arbol(520, 1280, 0.85)}
  <!-- edificio principal de ladrillo -->
  <rect x="620" y="0" width="460" height="1300" fill="#B85A3A" stroke="${T}" stroke-width="5"/>
  ${Array.from({ length: 60 }, (_, i) => `<path d="M620 ${i * 22} H1080" stroke="#9A4A2E" stroke-width="2" opacity="0.5"/>`).join('')}
  ${balcon(640, 300)}${balcon(640, 680)}${[820, 1010].map(y => `<rect x="920" y="${y - 400}" width="120" height="200" fill="#E2D2B8" stroke="${T}" stroke-width="4"/>`).join('')}
  <path d="M640 390 L780 390 L800 450 L620 450 Z" fill="#E8E2D2" stroke="${T}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${640 + i * 30} 390 l-4 60" stroke="#4A7A5A" stroke-width="12"/>`).join('')}
  <rect x="990" y="760" width="70" height="56" fill="#E8E8E8" stroke="${T}" stroke-width="3"/><circle cx="1025" cy="788" r="18" fill="none" stroke="#8A8A8A" stroke-width="4"/>
  <!-- bajo con el banco -->
  <rect x="620" y="900" width="460" height="400" fill="#D9CDB8" stroke="${T}" stroke-width="5"/>
  <rect x="660" y="920" width="400" height="80" fill="#2A2E32" stroke="#C9A040" stroke-width="5"/>
  <text x="860" y="978" text-anchor="middle" font-family="Inter" font-weight="900" font-size="52" letter-spacing="6" fill="#F2E6CF">BANCO</text><path d="M690 940 l20 20 l-20 20 l-20 -20 z" fill="#F2B35A"/>
  <rect x="700" y="1030" width="360" height="270" fill="#6A6E72" stroke="${T}" stroke-width="5"/>${Array.from({ length: 16 }, (_, i) => `<path d="M700 ${1040 + i * 16} H1060" stroke="#4A4E52" stroke-width="3"/>`).join('')}
  <!-- valla y acera -->
  <path d="M0 1240 H620" stroke="#2A2A2A" stroke-width="8"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${i * 21} 1240 v60" stroke="#2A2A2A" stroke-width="4"/>`).join('')}
  <rect y="1300" width="1080" height="140" fill="#C8B89E"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 100} 1300 l-20 140" stroke="#A8987E" stroke-width="3"/>`).join('')}
  <rect y="1440" width="1080" height="24" fill="#8A8070" stroke="${T}" stroke-width="3"/>
  <!-- cabina telefónica -->
  <rect x="140" y="1000" width="170" height="320" fill="#9CC8D8" opacity="0.5" stroke="#3A4A5A" stroke-width="10"/><rect x="130" y="980" width="190" height="40" fill="#2E5A9A" stroke="${T}" stroke-width="4"/>
  <rect x="205" y="1080" width="40" height="70" fill="#4A4E52" stroke="${T}" stroke-width="3"/><path d="M215 1100 h20" stroke="#B8B8B8" stroke-width="4"/>
  <rect x="80" y="1250" width="40" height="70" rx="6" fill="#3A3E42" stroke="${T}" stroke-width="3"/>
  ${farola(60, 1310, 520)}${farola(480, 1310, 420)}
  <!-- calzada con plaza de aparcamiento -->
  <rect y="1464" width="1080" height="456" fill="url(#asfalto)"/>
  <path d="M0 1610 H1080 M330 1470 L270 1610 M760 1470 L820 1610" stroke="#E8E2D2" stroke-width="7" opacity="0.85"/>
  ${Array.from({ length: 8 }, () => `<path d="M${(r() * 1080).toFixed(0)} ${(1650 + r() * 250).toFixed(0)} q20 -10 40 4 q14 10 30 -4" stroke="#2A2422" stroke-width="3" fill="none"/>`).join('')}
  ${Array.from({ length: 6 }, () => `<path d="M${(r() * 1000).toFixed(0)} ${(1500 + r() * 400).toFixed(0)} l14 -8 l10 10 l-12 6 z" fill="#C88A3A"/>`).join('')}
  </svg>`;
};
