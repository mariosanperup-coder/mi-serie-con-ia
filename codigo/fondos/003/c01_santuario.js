// 003 · Santuario de piedra en una colina de Aragón, tarde soleada. 1080 x 1920.
const { azar, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function santuario() {
  const r = azar(31);
  let vinas = '';
  for (let f = 0; f < 9; f++) { const y = 1080 + f * 46, x0 = -40 + f * 10;
    vinas += `<path d="M${x0} ${y} Q300 ${y - 40 - f * 4} 620 ${y - 70 - f * 6}" stroke="#5E7A3A" stroke-width="${8 + f * 1.4}" fill="none" stroke-dasharray="${10 + f} ${6 + f * 0.6}"/>`; }
  let piedras = '';
  for (let i = 0; i < 70; i++) piedras += `<rect x="${(640 + (i % 7) * 50 + (Math.floor(i / 7) % 2) * 25).toFixed(0)}" y="${(1150 + Math.floor(i / 7) * 34).toFixed(0)}" width="46" height="30" fill="none" stroke="#A88A5E" stroke-width="2"/>`;
  const cipres = (x, y, h) => `<path d="M${x} ${y} Q${x - 38} ${y - h * 0.5} ${x} ${y - h} Q${x + 38} ${y - h * 0.5} ${x} ${y} Z" fill="#2E4A2E" stroke="${T}" stroke-width="4"/><path d="M${x - 6} ${y - h * 0.8} Q${x - 14} ${y - h * 0.5} ${x - 8} ${y - h * 0.2}" stroke="#4A6A40" stroke-width="5" fill="none"/>`;
  let graba = '';
  for (let i = 0; i < 60; i++) graba += `<ellipse cx="${(r() * 1080).toFixed(0)}" cy="${(1420 + r() * 480).toFixed(0)}" rx="${(4 + r() * 8).toFixed(0)}" ry="${(3 + r() * 4).toFixed(0)}" fill="#B89868" opacity="0.8"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E6A8A"/><stop offset="1" stop-color="#3E9AB0"/></linearGradient>
  <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9A860"/><stop offset="1" stop-color="#C08A48"/></linearGradient>${halo('hSol', '#FFE3A0', 0.35)}</defs>
  <rect width="1080" height="1920" fill="url(#cielo)"/>
  <path d="M640 720 q60 -30 140 -6 q40 -24 100 0 M120 900 q50 -20 110 -2" stroke="#F4F0E6" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.9"/>
  <!-- sierra al fondo -->
  <path d="M0 960 L80 920 L200 900 L320 880 L360 900 L420 870 L520 900 L640 960 V1100 H0 Z" fill="#C8A070" stroke="${T}" stroke-width="3"/>
  <path d="M60 925 H330" stroke="#E8D0A0" stroke-width="10"/>
  <path d="M0 1000 Q260 940 520 990 T1080 980 V1200 H0 Z" fill="#B88A4A"/>
  ${vinas}
  <!-- iglesia -->
  <path d="M400 1500 V1060 L600 950 L800 1060 V1500 Z" fill="#D9B87E" stroke="${T}" stroke-width="5"/>
  <path d="M390 1065 L600 940 L810 1065" fill="none" stroke="#B8582A" stroke-width="18"/>
  ${Array.from({ length: 50 }, (_, i) => `<rect x="${410 + (i % 8) * 48 + (Math.floor(i / 8) % 2) * 24}" y="${1090 + Math.floor(i / 8) * 64}" width="44" height="58" fill="none" stroke="#B8986A" stroke-width="2"/>`).join('')}
  <path d="M500 1500 V1300 Q600 1180 700 1300 V1500 Z" fill="#C8A670" stroke="${T}" stroke-width="5"/>
  <path d="M528 1500 V1310 Q600 1220 672 1310 V1500 Z" fill="#6A4222" stroke="${T}" stroke-width="5"/><path d="M600 1250 V1500" stroke="#4A2E16" stroke-width="5"/>
  <circle cx="620" cy="1400" r="7" fill="#2A2A2A"/>
  <rect x="588" y="1080" width="24" height="60" rx="12" fill="#3A2E20"/>
  <!-- campanario -->
  <rect x="800" y="760" width="200" height="740" fill="#D9B87E" stroke="${T}" stroke-width="5"/>
  ${Array.from({ length: 40 }, (_, i) => `<rect x="${806 + (i % 4) * 48}" y="${980 + Math.floor(i / 4) * 52}" width="44" height="46" fill="none" stroke="#B8986A" stroke-width="2"/>`).join('')}
  <path d="M845 960 V840 Q900 790 955 840 V960 Z" fill="#3A2E20" stroke="${T}" stroke-width="4"/>
  <path d="M900 850 Q872 870 876 920 H924 Q928 870 900 850 Z" fill="#5A4A30" stroke="${T}" stroke-width="3"/>
  <path d="M790 760 L900 700 L1010 760 Z" fill="#B8582A" stroke="${T}" stroke-width="5"/><path d="M900 700 V630 M880 655 H920" stroke="${T}" stroke-width="6"/>
  ${cipres(330, 1440, 560)}${cipres(1050, 1460, 520)}
  <!-- muro de piedra -->
  <path d="M640 1450 H1080 V1560 H640 Z" fill="#C8A670" stroke="${T}" stroke-width="4"/>${piedras.replace(/y="(\d+)"/g, (m, y) => `y="${+y + 312}"`)}
  <!-- explanada -->
  <path d="M0 1480 Q540 1440 1080 1500 V1920 H0 Z" fill="url(#suelo)"/>${graba}
  <circle cx="540" cy="1500" r="700" fill="url(#hSol)"/>
  <!-- banco de piedra -->
  <rect x="80" y="1600" width="380" height="60" fill="#C8B08A" stroke="${T}" stroke-width="5"/><rect x="110" y="1660" width="70" height="80" fill="#B8A07A" stroke="${T}" stroke-width="4"/><rect x="360" y="1660" width="70" height="80" fill="#B8A07A" stroke="${T}" stroke-width="4"/>
  <!-- árbol en primer plano -->
  <path d="M0 1200 Q60 700 30 300 L80 280 Q110 700 60 1200 Z" fill="#6A4A2A" stroke="${T}" stroke-width="5"/>
  <ellipse cx="160" cy="180" rx="280" ry="150" fill="#5A7A3A" stroke="${T}" stroke-width="5"/><ellipse cx="320" cy="120" rx="180" ry="90" fill="#6E8E48"/><ellipse cx="60" cy="300" rx="160" ry="90" fill="#4E6A32" stroke="${T}" stroke-width="4"/>
  <!-- rocas -->
  <path d="M0 1800 Q100 1720 220 1760 Q300 1780 320 1920 H0 Z M760 1920 Q820 1840 940 1850 Q1040 1860 1080 1920 Z" fill="#B8A07A" stroke="${T}" stroke-width="5"/>
  </svg>`;
};
