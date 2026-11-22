// 005 · Garaje subterráneo (1989): columnas numeradas, fluorescente, rampa al fondo con luz de atardecer. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function garaje() {
  const r = azar(52);
  const columna = (x, y0, y1, w, num) => `<rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" fill="#B8B4A4" stroke="${T}" stroke-width="5"/>
    <rect x="${x}" y="${y0 + (y1 - y0) * 0.35}" width="${w}" height="${(y1 - y0) * 0.17}" fill="#A8442E"/><text x="${x + w / 2}" y="${y0 + (y1 - y0) * 0.48}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${w * 0.5}" fill="#F2E6CF">${num}</text>
    <rect x="${x}" y="${y1 - (y1 - y0) * 0.18}" width="${w}" height="${(y1 - y0) * 0.18}" fill="#E8B830"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${x + i * w / 4 - w / 4} ${y1} l${w / 3} -${(y1 - y0) * 0.18}" stroke="#1A1A1A" stroke-width="${w / 9}"/>`).join('')}
    <rect x="${x}" y="${y1 - (y1 - y0) * 0.18}" width="${w}" height="${(y1 - y0) * 0.18}" fill="none" stroke="${T}" stroke-width="4"/>`;
  let manchas = ''; for (let i = 0; i < 8; i++) manchas += `<ellipse cx="${(r() * 1000).toFixed(0)}" cy="${(1400 + r() * 480).toFixed(0)}" rx="${(40 + r() * 140).toFixed(0)}" ry="${(14 + r() * 30).toFixed(0)}" fill="#1A1A16" opacity="0.6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4A3A"/><stop offset="1" stop-color="#5E5A48"/></linearGradient>
  <linearGradient id="fuera" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2A04A"/><stop offset="1" stop-color="#C87A3A"/></linearGradient>${halo('hFluo', '#FFE8B0', 0.5)}</defs>
  <rect width="1080" height="1920" fill="#2E3430"/>
  <rect width="1080" height="560" fill="#3A403A"/><path d="M0 560 H1080" stroke="#1E2420" stroke-width="10"/>
  ${[180, 360].map(y => `<rect x="0" y="${y}" width="1080" height="26" fill="#4A4E46" stroke="${T}" stroke-width="3"/>`).join('')}
  <path d="M0 220 H1080 M0 270 H760 L860 330" stroke="#8A4A2E" stroke-width="12" fill="none"/>
  <!-- abertura con la rampa -->
  <rect x="560" y="800" width="300" height="200" fill="url(#fuera)" stroke="${T}" stroke-width="5"/>
  <path d="M600 900 q40 -60 100 -40 q50 -50 120 -10" stroke="#5A6A3A" stroke-width="30" fill="none"/>
  <path d="M560 1000 L860 1000 L860 840 L760 840 Z" fill="#6A6658" stroke="${T}" stroke-width="4"/>
  <path d="M380 1100 L560 1000 L860 1000 L880 1100 Z" fill="#5A5648" stroke="${T}" stroke-width="4"/><path d="M380 1060 L560 960 M380 1040 L560 940" stroke="#8A8A80" stroke-width="5"/>
  <rect x="170" y="560" width="900" height="520" fill="#4A4E46" opacity="0.5"/>
  <!-- fluorescente -->
  <path d="M520 300 V380" stroke="${T}" stroke-width="5"/><rect x="290" y="380" width="460" height="56" rx="8" fill="#3A3E3A" stroke="${T}" stroke-width="5"/><rect x="310" y="394" width="420" height="28" rx="6" fill="#FFF4D0"/>
  <circle cx="520" cy="500" r="560" fill="url(#hFluo)"/>
  ${columna(290, 860, 1100, 80, 18)}${columna(1000, 860, 1100, 80, 19)}${columna(0, 600, 1300, 170, 17)}
  <!-- suelo con líneas amarillas -->
  <path d="M0 1100 H1080 V1920 H0 Z" fill="url(#suelo)"/>
  <path d="M0 1520 L420 1100 M0 1100 H420 M1080 1430 L780 1100 M780 1100 H1080" stroke="#E8C030" stroke-width="12" fill="none"/>
  <ellipse cx="520" cy="1400" rx="300" ry="160" fill="#FFE8B0" opacity="0.12"/>${manchas}
  </svg>`;
};
