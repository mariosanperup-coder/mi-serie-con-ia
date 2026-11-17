// 004 · Liérganes (Cantabria): río, puente de piedra, casas con balcón de madera, montes verdes. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function lierganes() {
  const r = azar(41);
  const casa = (x, y, w, h, balcon) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C8A878" stroke="${T}" stroke-width="4"/>
    ${Array.from({ length: Math.floor(h / 40) * Math.floor(w / 50) }, (_, i) => { const c = i % Math.floor(w / 50), f = Math.floor(i / Math.floor(w / 50)); return `<rect x="${x + c * 50 + (f % 2) * 25}" y="${y + f * 40}" width="46" height="36" fill="none" stroke="#A88A5E" stroke-width="2"/>`; }).join('')}
    <path d="M${x - 20} ${y + 6} L${x + w / 2} ${y - 60} L${x + w + 20} ${y + 6} Z" fill="#C0552E" stroke="${T}" stroke-width="4"/>
    <rect x="${x + w * 0.2}" y="${y + h * 0.5}" width="30" height="44" fill="#3A2A1E"/><rect x="${x + w * 0.65}" y="${y + h * 0.5}" width="30" height="44" fill="#3A2A1E"/>
    ${balcon ? `<rect x="${x - 10}" y="${y + h * 0.25}" width="${w + 20}" height="16" fill="#6A4222" stroke="${T}" stroke-width="3"/>${Array.from({ length: Math.floor(w / 18) }, (_, i) => `<path d="M${x + i * 18} ${y + h * 0.25} v-50" stroke="#6A4222" stroke-width="5"/>`).join('')}<rect x="${x - 10}" y="${y + h * 0.25 - 54}" width="${w + 20}" height="10" fill="#6A4222"/>${[0.2, 0.5, 0.8].map(k => `<circle cx="${x + w * k}" cy="${y + h * 0.25 - 60}" r="10" fill="#C0392B"/>`).join('')}` : ''}</g>`;
  let hierba = '';
  for (let i = 0; i < 90; i++) { const x = r() * 640, y = 1450 + r() * 470; hierba += `<path d="M${x} ${y} q-6 -30 -2 -50 M${x} ${y} q8 -26 14 -40" stroke="${r() < 0.5 ? '#4E7A30' : '#6A9A40'}" stroke-width="4" fill="none"/>`; }
  let flores = ''; for (let i = 0; i < 18; i++) flores += `<circle cx="${(r() * 500).toFixed(0)}" cy="${(1600 + r() * 300).toFixed(0)}" r="6" fill="#F4F0E6"/>`;
  const roca = (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${60 * s}" ry="${34 * s}" fill="#8A8A78" stroke="${T}" stroke-width="4"/><ellipse cx="${x - 10 * s}" cy="${y - 12 * s}" rx="${34 * s}" ry="${12 * s}" fill="#7A9A50" opacity="0.7"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8AAAB8"/><stop offset="1" stop-color="#E6DCC4"/></linearGradient>
  <linearGradient id="rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E8A8A"/><stop offset="1" stop-color="#3A6A70"/></linearGradient>${halo('hLuz', '#FFE3A0', 0.3)}</defs>
  <rect width="1080" height="1920" fill="url(#cielo)"/>
  ${[[120, 140, 260], [520, 90, 300], [880, 180, 240]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="70" fill="#F4EEE0" opacity="0.9"/><ellipse cx="${x + 60}" cy="${y - 30}" rx="${w * 0.5}" ry="60" fill="#F8F4EA"/>`).join('')}
  <path d="M0 620 L200 470 L380 420 L520 300 L640 250 L780 340 L900 260 L1080 330 V900 H0 Z" fill="#6E8A60" stroke="${T}" stroke-width="4"/>
  <path d="M500 320 L560 420 M640 260 L700 400 M900 270 L940 380" stroke="#B8B8A8" stroke-width="18" opacity="0.7"/>
  <path d="M0 760 Q300 620 600 700 T1080 650 V1000 H0 Z" fill="#5A8A40"/>
  ${Array.from({ length: 30 }, () => `<circle cx="${(r() * 1080).toFixed(0)}" cy="${(700 + r() * 200).toFixed(0)}" r="${(22 + r() * 20).toFixed(0)}" fill="#3E6A30" stroke="${T}" stroke-width="2"/>`).join('')}
  <!-- iglesia y casas -->
  <rect x="610" y="580" width="90" height="200" fill="#C8A878" stroke="${T}" stroke-width="4"/><path d="M600 580 L655 530 L710 580 Z" fill="#C0552E" stroke="${T}" stroke-width="4"/><path d="M640 610 Q655 590 670 610 V650 H640 Z" fill="#3A2A1E"/>
  ${casa(470, 740, 220, 230, false)}${casa(700, 680, 300, 300, true)}${casa(140, 830, 200, 150, false)}
  ${casa(-60, 320, 330, 700, true)}
  <!-- puente -->
  <path d="M180 1060 H1080 V1180 H180 Z" fill="#A89878" stroke="${T}" stroke-width="5"/>
  <path d="M300 1280 Q300 1080 530 1080 Q760 1080 760 1280 Z" fill="#2E4A40" stroke="${T}" stroke-width="5"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${190 + i * 56}" y="1062" width="52" height="36" fill="none" stroke="#7A6A50" stroke-width="2"/>`).join('')}
  ${Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (i / 8); return `<path d="M${530 - Math.cos(a) * 230} ${1280 - Math.sin(a) * 200} L${530 - Math.cos(a) * 262} ${1280 - Math.sin(a) * 232}" stroke="${T}" stroke-width="3"/>`; }).join('')}
  <path d="M180 1180 V1290 M760 1180 V1290 H1080" stroke="${T}" stroke-width="5" fill="none"/><path d="M760 1180 H1080 V1290 H760 Z" fill="#A89878"/>
  <!-- río -->
  <path d="M300 1280 H1080 V1920 H640 Q560 1700 420 1500 Q340 1380 300 1280 Z" fill="url(#rio)"/>
  ${Array.from({ length: 30 }, () => { const x = 400 + r() * 680, y = 1300 + r() * 600; return `<path d="M${x} ${y} h${30 + r() * 80}" stroke="#A8C8C8" stroke-width="3" opacity="0.7"/>`; }).join('')}
  <path d="M520 1300 V1500" stroke="#8A7A5A" stroke-width="40" opacity="0.25"/>
  <!-- orilla verde -->
  <path d="M0 1160 Q200 1240 300 1290 Q360 1400 440 1520 Q560 1720 640 1920 H0 Z" fill="#5E8A3A" stroke="${T}" stroke-width="4"/>
  ${roca(340, 1380, 1)}${roca(420, 1500, 1.2)}${roca(520, 1640, 1.3)}${roca(780, 1560, 1)}${roca(900, 1720, 1.1)}${roca(260, 1840, 1.6)}
  ${hierba}${flores}
  <path d="M120 1900 Q260 1700 380 1640" stroke="#8A6A40" stroke-width="40" fill="none" opacity="0.6"/>
  <circle cx="700" cy="500" r="600" fill="url(#hLuz)"/>
  </svg>`;
};
