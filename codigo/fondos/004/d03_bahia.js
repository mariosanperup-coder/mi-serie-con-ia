// 004 · Bahía de Cádiz (siglo XVII): mar turquesa, ciudad blanca al fondo. La barca se dibuja aparte. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function bahia() {
  const r = azar(43);
  let ciudad = '';
  for (let i = 0; i < 26; i++) { const x = 70 + i * 38 + r() * 10, h = 30 + r() * 50; ciudad += `<rect x="${x}" y="${1050 - h}" width="${34 + r() * 12}" height="${h}" fill="#F2EAD8" stroke="#B8A888" stroke-width="2"/>`; }
  let reflejos = '';
  for (let i = 0; i < 70; i++) { const y = 1100 + Math.pow(r(), 1.3) * 820, w = 20 + (y - 1100) / 8 * r(); reflejos += `<path d="M${(r() * 1080).toFixed(0)} ${y.toFixed(0)} h${w.toFixed(0)}" stroke="${r() < 0.4 ? '#F2D58A' : '#7AD0C8'}" stroke-width="${(2 + (y - 1100) / 160).toFixed(1)}" opacity="0.75"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E7A8A"/><stop offset="1" stop-color="#E8D8A0"/></linearGradient>
  <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3AA8A0"/><stop offset="1" stop-color="#14706E"/></linearGradient>${halo('hSol', '#FFF0C0', 0.4)}</defs>
  <rect width="1080" height="1100" fill="url(#cielo)"/>
  <circle cx="540" cy="900" r="500" fill="url(#hSol)"/>
  ${[[180, 520, 180], [880, 300, 160], [1000, 600, 120]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="40" fill="#F4E4B0"/><ellipse cx="${x - 40}" cy="${y - 34}" rx="${w * 0.5}" ry="44" fill="#F8EEC8"/>`).join('')}
  <!-- murallas y ciudad -->
  <rect x="40" y="1040" width="1040" height="60" fill="#E2C890" stroke="${T}" stroke-width="3"/>
  ${ciudad}
  <path d="M560 1000 V900 Q600 850 640 900 V1000 Z" fill="#F2EAD8" stroke="${T}" stroke-width="3"/><circle cx="600" cy="880" r="34" fill="#E2B04A" stroke="${T}" stroke-width="3"/>
  <rect x="680" y="860" width="40" height="140" fill="#F2EAD8" stroke="${T}" stroke-width="3"/><rect x="740" y="870" width="40" height="130" fill="#F2EAD8" stroke="${T}" stroke-width="3"/>
  <path d="M676 860 L700 830 L724 860 Z M736 870 L760 840 L784 870 Z" fill="#E2C890" stroke="${T}" stroke-width="3"/>
  <rect x="40" y="980" width="90" height="70" fill="#D8BE80" stroke="${T}" stroke-width="3"/>
  <g transform="translate(950 1040)"><path d="M-50 0 H50 L36 22 H-36 Z" fill="#6A4222"/><path d="M-10 0 V-90 M14 0 V-70" stroke="#3A2A1E" stroke-width="4"/><path d="M-8 -84 L-40 -20 H-8 Z M16 -64 L40 -20 H16 Z" fill="#E8DCC0"/></g>
  <rect y="1100" width="1080" height="820" fill="url(#mar)"/>${reflejos}
  </svg>`;
};
