// 004 · Playa de pescadores en Andalucía (siglo XVII). Arena despejada en el centro. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function orilla() {
  const r = azar(44);
  const red = (x, y, w, h) => { let s = `<path d="M${x} ${y} Q${x + w / 2} ${y + h * 0.3} ${x + w} ${y}" stroke="#6A4A2A" stroke-width="6" fill="none"/>`;
    for (let i = 0; i <= 8; i++) s += `<path d="M${x + i * w / 8} ${y + Math.sin(Math.PI * i / 8) * h * 0.3} Q${x + i * w / 8 + 10} ${y + h * 0.7} ${x + i * w / 8} ${y + h}" stroke="#8A6A40" stroke-width="3" fill="none"/>`;
    for (let j = 1; j < 6; j++) s += `<path d="M${x} ${y + j * h / 6} Q${x + w / 2} ${y + j * h / 6 + h * 0.25} ${x + w} ${y + j * h / 6}" stroke="#8A6A40" stroke-width="3" fill="none"/>`;
    return s + [0.2, 0.5, 0.8].map(k => `<circle cx="${x + w * k}" cy="${y + h * 0.95}" r="12" fill="#C08A3A" stroke="${T}" stroke-width="3"/>`).join(''); };
  let piedras = ''; for (let i = 0; i < 30; i++) piedras += `<ellipse cx="${(r() * 1080).toFixed(0)}" cy="${(1300 + r() * 600).toFixed(0)}" rx="${(8 + r() * 22).toFixed(0)}" ry="${(5 + r() * 10).toFixed(0)}" fill="#8A7A60" stroke="${T}" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E6A78"/><stop offset="1" stop-color="#E8C890"/></linearGradient>
  <linearGradient id="arena" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8B868"/><stop offset="1" stop-color="#D49A48"/></linearGradient>${halo('hSol', '#FFE3A0', 0.35)}</defs>
  <rect width="1080" height="1100" fill="url(#cielo)"/>
  ${[[700, 300, 220], [960, 560, 160]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="44" fill="#F4D898"/><ellipse cx="${x - 40}" cy="${y - 36}" rx="${w * 0.5}" ry="48" fill="#F8E6B8"/>`).join('')}
  <path d="M0 780 Q300 700 560 760 T1080 740 V1000 H0 Z" fill="#4E7A70" opacity="0.8"/>
  <!-- acantilado y pueblo -->
  <path d="M500 1000 L560 860 L700 820 L1080 800 V1020 H500 Z" fill="#D8A868" stroke="${T}" stroke-width="4"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${600 + i * 32}" y="${770 - (i % 3) * 18}" width="30" height="${40 + (i % 3) * 18}" fill="#F2EAD8" stroke="#B8A888" stroke-width="2"/>`).join('')}
  <rect x="760" y="660" width="50" height="130" fill="#F2EAD8" stroke="${T}" stroke-width="3"/><path d="M756 660 Q785 620 814 660 Z" fill="#E2B04A" stroke="${T}" stroke-width="3"/>
  <path d="M1000 760 Q990 640 1030 560 M1030 560 q-60 -10 -90 20 M1030 560 q-30 -50 -80 -50 M1030 560 q30 -50 70 -40 M1030 560 q60 0 80 40" stroke="#3A6A30" stroke-width="10" fill="none"/>
  <!-- mar con olas -->
  <path d="M0 1000 H1080 V1200 Q760 1160 540 1220 Q300 1280 0 1240 Z" fill="#2E7A8A"/>
  <path d="M0 1240 Q300 1280 540 1220 Q760 1160 1080 1200" stroke="#F4F0E6" stroke-width="16" fill="none"/>
  <path d="M0 1200 Q300 1240 540 1180 Q760 1130 1080 1160" stroke="#BCE6E0" stroke-width="6" fill="none" opacity="0.8"/>
  <!-- arena -->
  <path d="M0 1240 Q300 1280 540 1220 Q760 1160 1080 1200 V1920 H0 Z" fill="url(#arena)"/>${piedras}
  <!-- postes con redes (izquierda) -->
  <path d="M60 1360 V720 M300 1320 V820 M30 760 H340" stroke="#6A4A2A" stroke-width="18"/>${red(40, 780, 280, 360)}
  <!-- barca volcada (derecha) -->
  <path d="M700 1340 Q760 1150 980 1150 Q1080 1160 1100 1340 Z" fill="#7A4E2A" stroke="${T}" stroke-width="6"/>
  ${[0, 1, 2, 3].map(i => `<path d="M${720 + i * 10} ${1330 - i * 50} Q${880} ${1180 - i * 10} ${1090} ${1320 - i * 45}" stroke="#5A3A1E" stroke-width="4" fill="none"/>`).join('')}
  <path d="M960 1340 L1000 1260" stroke="#5A3A1E" stroke-width="10"/>
  <ellipse cx="900" cy="1360" rx="220" ry="20" fill="#000" opacity="0.2"/>
  <!-- cesta y cuerda en primer plano -->
  <path d="M40 1880 V1740 Q40 1720 60 1720 H220 Q240 1720 240 1740 V1880 Z" fill="#8A5A30" stroke="${T}" stroke-width="5"/>${[0, 1, 2].map(i => `<path d="M40 ${1760 + i * 40} H240" stroke="#5A3A1E" stroke-width="5"/>`).join('')}
  ${[0, 1, 2].map(i => `<ellipse cx="380" cy="${1860 - i * 14}" rx="${110 - i * 20}" ry="${28 - i * 4}" fill="none" stroke="#B8905A" stroke-width="10"/>`).join('')}
  <circle cx="540" cy="900" r="700" fill="url(#hSol)"/>
  </svg>`;
};
