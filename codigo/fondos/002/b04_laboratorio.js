// 002 · Laboratorio de los años 70. 1080 x 1920.
const { halo } = require('../comun');
const T = '#0B0E13';
module.exports = function laboratorio() {
  const frasco = (x, y, s, liquido) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 -90 H14 V-40 L50 30 Q55 50 35 50 H-35 Q-55 50 -50 30 L-14 -40 Z" fill="#CFE6E8" opacity="0.6" stroke="${T}" stroke-width="4"/><path d="M-36 0 H36 L48 30 Q52 46 34 46 H-34 Q-52 46 -48 30 Z" fill="${liquido}"/></g>`;
  const bola = (x, y, s, liquido) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="80" fill="#CFE6E8" opacity="0.55" stroke="${T}" stroke-width="5"/><path d="M-78 10 A80 80 0 0 0 78 10 Z" fill="${liquido}"/><rect x="-18" y="-150" width="36" height="76" fill="#CFE6E8" opacity="0.55" stroke="${T}" stroke-width="5"/></g>`;
  const tubos = (x, y) => `<rect x="${x}" y="${y}" width="200" height="16" fill="#7A4E2C" stroke="${T}" stroke-width="3"/>${[0, 1, 2, 3].map(i => `<rect x="${x + 20 + i * 44}" y="${y - 110}" width="22" height="150" rx="11" fill="#CFE6E8" opacity="0.6" stroke="${T}" stroke-width="3"/><rect x="${x + 22 + i * 44}" y="${y - 50}" width="18" height="86" rx="9" fill="${['#3AA0B0', '#3AA0B0', '#E8A048', '#3AA0B0'][i]}"/>`).join('')}<rect x="${x}" y="${y + 40}" width="200" height="14" fill="#7A4E2C" stroke="${T}" stroke-width="3"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hLamp', '#FFC066', 0.6)}<linearGradient id="pared" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E5A5E"/><stop offset="1" stop-color="#1A3A40"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#pared)"/>
  <!-- ventana con persiana -->
  <rect x="620" y="200" width="460" height="760" fill="#1E4A50" stroke="${T}" stroke-width="5"/>
  <rect x="660" y="560" width="420" height="380" fill="#3A7A70"/><circle cx="760" cy="640" r="90" fill="#2A5A50"/><rect x="920" y="560" width="120" height="380" fill="#24504A"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="620" y="${210 + i * 22}" width="460" height="14" fill="#5E9A98" stroke="#1E4A50" stroke-width="2"/>`).join('')}
  <path d="M620 560 H1080 M850 560 V960" stroke="#1E3A40" stroke-width="10"/>
  <!-- póster -->
  <rect x="380" y="560" width="200" height="270" fill="#D9C8A0" stroke="${T}" stroke-width="4"/><ellipse cx="480" cy="690" rx="70" ry="100" fill="none" stroke="#6A5A3A" stroke-width="4"/><circle cx="480" cy="680" r="24" fill="#8A7A5A"/>
  <!-- estantería con frascos -->
  <rect x="0" y="380" width="330" height="760" fill="#5E3A1E" stroke="${T}" stroke-width="5"/>
  ${[0, 1, 2].map(f => `<rect x="10" y="${600 + f * 210}" width="310" height="16" fill="#7A4E2C"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${24 + i * 60}" y="${600 + f * 210 - 90 + (i % 2) * 20}" width="40" height="${90 - (i % 2) * 20}" rx="8" fill="${['#CFE6E8', '#B8862E', '#CFE6E8', '#7A4E2C', '#CFE6E8'][(i + f) % 5]}" opacity="0.8" stroke="${T}" stroke-width="3"/>`).join('')}`).join('')}
  <rect x="0" y="380" width="330" height="760" fill="#9CC8D0" opacity="0.12"/>
  <!-- lámpara -->
  <path d="M190 0 V200" stroke="${T}" stroke-width="5"/><path d="M40 330 Q190 170 340 330 Z" fill="#2E4A40" stroke="${T}" stroke-width="5"/><ellipse cx="190" cy="330" rx="80" ry="20" fill="#FFD27A"/>
  <circle cx="190" cy="420" r="460" fill="url(#hLamp)"/>
  <!-- encimera del fondo -->
  <rect x="330" y="1140" width="750" height="40" fill="#8A5A30" stroke="${T}" stroke-width="5"/><rect x="330" y="1180" width="750" height="420" fill="#7A4E2C" stroke="${T}" stroke-width="5"/>
  ${[0, 1, 2].map(i => `<rect x="${600 + i * 160}" y="${1200}" width="140" height="${120}" fill="#8A5A30" stroke="${T}" stroke-width="3"/><rect x="${650 + i * 160}" y="1250" width="40" height="8" fill="#C9C9C9"/>`).join('')}
  <!-- microscopio -->
  <g transform="translate(470 1140)" stroke="${T}" stroke-width="5"><rect x="-90" y="-30" width="180" height="30" fill="#D9C8A0"/><path d="M40 -30 Q90 -120 40 -220" fill="none" stroke="#C9B48A" stroke-width="40"/><rect x="-40" y="-110" width="100" height="16" fill="#3A3A3A"/><path d="M-20 -280 L20 -150" stroke="#C9B48A" stroke-width="34"/><rect x="-40" y="-310" width="40" height="40" fill="#3A3A3A"/></g>
  ${frasco(850, 1090, 1.3, '#3AA0B0')}${tubos(650, 1110)}
  <!-- mesa en primer plano -->
  <path d="M0 1460 H760 L800 1520 H0 Z" fill="#B8783A" stroke="${T}" stroke-width="5"/><rect x="0" y="1520" width="800" height="40" fill="#8A5A30" stroke="${T}" stroke-width="5"/>
  <rect x="680" y="1560" width="40" height="360" fill="#6A4222" stroke="${T}" stroke-width="4"/>
  ${bola(120, 1360, 1.1, '#3AA0B0')}${frasco(330, 1430, 1.3, '#E8A048')}${tubos(420, 1440)}
  <rect x="30" y="1480" width="200" height="40" fill="#2E3A3A" stroke="${T}" stroke-width="4" transform="rotate(-3 130 1500)"/>
  <!-- taburete -->
  <ellipse cx="560" cy="1720" rx="150" ry="40" fill="#8A5A30" stroke="${T}" stroke-width="5"/><path d="M450 1740 L420 1920 M670 1740 L700 1920 M560 1760 V1920" stroke="#2A2A2A" stroke-width="12"/>
  <rect x="800" y="1600" width="280" height="320" fill="#4E8A8A" opacity="0.35"/>
  </svg>`;
};
