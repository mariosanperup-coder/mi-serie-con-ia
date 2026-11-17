// 002 · Cocina de la casa de Bélmez (1971), tarde. 1080 x 1920. El suelo de cemento ocupa la mitad de abajo.
const { PALETA: P, halo } = require('../comun');
const T = '#0B0E13';
module.exports = function cocina() {
  let azulejos = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const x = 20 + c * 66, y = 760 + r * 66;
    azulejos += `<rect x="${x}" y="${y}" width="64" height="64" fill="#EFE6D2" stroke="#9AB0B8" stroke-width="2"/><path d="M${x + 32} ${y + 10} L${x + 40} ${y + 32} L${x + 32} ${y + 54} L${x + 24} ${y + 32} Z M${x + 10} ${y + 32} L${x + 32} ${y + 24} L${x + 54} ${y + 32} L${x + 32} ${y + 40} Z" fill="#2E5E8A"/>`; }
  let lena = ''; for (let i = 0; i < 9; i++) lena += `<circle cx="${210 + (i % 4) * 34 + (i > 3 ? 17 : 0)}" cy="${1280 - Math.floor(i / 4) * 30}" r="17" fill="#8A5A30" stroke="${T}" stroke-width="3"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hSol', '#FFD27A', 0.45)}${halo('hLamp', '#FFE3A0', 0.4)}
    <linearGradient id="pared" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2E8D2"/><stop offset="1" stop-color="#DCCBA8"/></linearGradient>
    <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A39B8C"/><stop offset="1" stop-color="#7E776A"/></linearGradient>
    <filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.25 0 0 0 0 0.23 0 0 0 0 0.2 0 0 0 0.35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
  <rect width="1080" height="1330" fill="url(#pared)"/>
  <!-- vigas del techo -->
  <rect width="1080" height="70" fill="#7A4E2C"/>${[60, 330, 600, 870].map(x => `<rect x="${x}" y="0" width="80" height="140" fill="#6A4222" stroke="${T}" stroke-width="4"/>`).join('')}
  <!-- campana y fogón -->
  <rect x="160" y="0" width="60" height="420" fill="#3A3A3A" stroke="${T}" stroke-width="4"/>
  <path d="M40 760 Q60 560 190 470 Q330 560 440 760 Z" fill="#F4EEE2" stroke="${T}" stroke-width="5"/>
  ${azulejos}
  <rect x="0" y="960" width="460" height="370" fill="#F4EEE2" stroke="${T}" stroke-width="5"/>
  <rect x="0" y="950" width="470" height="30" fill="#C9B898" stroke="${T}" stroke-width="4"/>
  <rect x="180" y="1000" width="200" height="140" fill="#3A3836" stroke="${T}" stroke-width="5"/><rect x="200" y="1020" width="160" height="100" fill="#2A2826" stroke="#555" stroke-width="3"/><circle cx="330" cy="1070" r="8" fill="#888"/>
  <path d="M180 1330 V1250 Q260 1170 340 1250 V1330 Z" fill="#2A1E14" stroke="${T}" stroke-width="4"/>${lena}
  <!-- olla -->
  <path d="M120 950 Q110 860 200 850 H300 Q390 860 380 950 Z" fill="#2E2E2E" stroke="${T}" stroke-width="5"/><rect x="180" y="828" width="140" height="26" rx="10" fill="#3A3A3A" stroke="${T}" stroke-width="4"/>
  <!-- repisa con cacharros -->
  <rect x="170" y="420" width="330" height="22" fill="#7A4E2C" stroke="${T}" stroke-width="4"/>
  <path d="M200 420 Q185 360 220 330 Q205 300 240 300 Q275 300 260 330 Q295 360 280 420 Z" fill="#EFE6D2" stroke="${T}" stroke-width="4"/><path d="M215 370 h50" stroke="#2E5E8A" stroke-width="10"/>
  <path d="M300 420 Q290 380 320 365 H350 Q380 380 370 420 Z" fill="#C0602A" stroke="${T}" stroke-width="4"/>
  <path d="M400 420 Q395 380 420 370 H470 Q495 380 490 420 Z" fill="#B8572A" stroke="${T}" stroke-width="4"/><path d="M445 370 Q430 330 460 310 M445 370 Q470 330 500 340 M445 370 Q420 380 410 440" stroke="#4A7A3A" stroke-width="8" fill="none"/>
  <!-- sartén colgada -->
  <path d="M570 380 V430" stroke="${T}" stroke-width="4"/><circle cx="570" cy="490" r="62" fill="#6A4A2A" stroke="${T}" stroke-width="5"/><circle cx="570" cy="490" r="44" fill="#4A3220"/>
  <!-- ventana con contraventanas y campanario -->
  <rect x="690" y="400" width="250" height="300" fill="#9CC8E0" stroke="${T}" stroke-width="5"/>
  <rect x="790" y="460" width="60" height="240" fill="#E9D8B8" stroke="${T}" stroke-width="3"/><path d="M790 460 L820 410 L850 460 Z" fill="#C0602A" stroke="${T}" stroke-width="3"/><rect x="808" y="480" width="24" height="30" fill="#3A3A3A"/>
  <path d="M690 620 H940 V700 H690 Z" fill="#F2EAD8"/><circle cx="740" cy="640" r="34" fill="#4A7A3A"/><circle cx="910" cy="650" r="30" fill="#4A7A3A"/>
  <path d="M750 400 V700 M810 400 V700 M870 400 V700" stroke="#3A3A3A" stroke-width="6"/>
  <rect x="600" y="390" width="90" height="320" fill="#2E5A3A" stroke="${T}" stroke-width="5"/><rect x="940" y="390" width="90" height="320" fill="#2E5A3A" stroke="${T}" stroke-width="5"/>
  ${[0, 1, 2].map(i => `<rect x="612" y="${410 + i * 100}" width="66" height="80" fill="none" stroke="#1E3A26" stroke-width="4"/><rect x="952" y="${410 + i * 100}" width="66" height="80" fill="none" stroke="#1E3A26" stroke-width="4"/>`).join('')}
  <rect x="680" y="700" width="270" height="20" fill="#E6D6B6" stroke="${T}" stroke-width="3"/>
  <!-- lámpara -->
  <path d="M960 0 V180" stroke="${T}" stroke-width="4"/><path d="M880 250 Q960 160 1040 250 Z" fill="#2E5A4A" stroke="${T}" stroke-width="4"/><circle cx="960" cy="256" r="14" fill="#FFE3A0"/><circle cx="960" cy="280" r="200" fill="url(#hLamp)"/>
  <!-- cántaro -->
  <path d="M520 1330 Q470 1190 520 1110 Q500 1080 540 1070 H600 Q640 1080 620 1110 Q670 1190 620 1330 Z" fill="#C8682E" stroke="${T}" stroke-width="5"/>
  <path d="M505 1180 Q570 1200 635 1180" stroke="#2E5E8A" stroke-width="12" fill="none"/>${[530, 560, 590, 620].map(x => `<circle cx="${x}" cy="1215" r="6" fill="#2E5E8A"/>`).join('')}
  <!-- mesa con mantel y silla -->
  <path d="M800 1020 H1080 V1330 H1040 V1090 H830 V1330 H800 Z" fill="#7A4E2C" stroke="${T}" stroke-width="5"/>
  <path d="M790 1000 H1080 V1110 Q1000 1130 900 1100 Q840 1120 790 1090 Z" fill="#F2F0EA" stroke="${T}" stroke-width="4"/><path d="M820 1000 V1100 M850 1000 V1105 M1000 1000 V1115" stroke="#6A8AB8" stroke-width="5"/>
  <path d="M960 990 Q920 950 960 930 H1060 Q1080 950 1060 990 Z" fill="#EFE6D2" stroke="${T}" stroke-width="4"/>${[970, 1000, 1030].map(x => `<circle cx="${x}" cy="930" r="18" fill="#F08A2A" stroke="${T}" stroke-width="3"/>`).join('')}
  <path d="M700 1330 V900 M780 1330 V900 M700 940 H780 M700 990 H780 M700 1040 H780 M700 1180 H780" stroke="#6A4222" stroke-width="16" fill="none"/>
  <rect x="690" y="1150" width="100" height="36" fill="#C9A066" stroke="${T}" stroke-width="4"/>
  <circle cx="830" cy="600" r="500" fill="url(#hSol)"/>
  <!-- suelo de cemento -->
  <rect y="1310" width="1080" height="610" fill="url(#suelo)"/><rect y="1310" width="1080" height="610" filter="url(#grano)"/>
  <path d="M0 1310 H1080" stroke="#5E584E" stroke-width="6"/>
  <path d="M300 1420 L760 1360 L1000 1560 L420 1700 Z" fill="#FFE3A0" opacity="0.18"/>
  </svg>`;
};
