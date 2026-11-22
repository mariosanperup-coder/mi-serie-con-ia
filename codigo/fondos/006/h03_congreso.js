// 006 · Sala del congreso (Lisboa, 1880): ventanal con cortinas, lámparas de araña, atril con lámpara, pizarra, bancos. 1080 x 1920.
const { halo } = require('../comun');
const T = '#0B0E13';
module.exports = function congreso() {
  const arana = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -400 V0" stroke="#6A5228" stroke-width="6"/><ellipse cx="0" cy="40" rx="150" ry="30" fill="none" stroke="#C89A3A" stroke-width="12"/>
    ${[-150, -90, -30, 30, 90, 150].map(dx => `<path d="M0 0 L${dx} 40" stroke="#C89A3A" stroke-width="5"/><circle cx="${dx}" cy="10" r="24" fill="#FFE8B0" stroke="#C89A3A" stroke-width="4"/>`).join('')}<circle cy="20" r="200" fill="url(#hAr)"/></g>`;
  const banco = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="40" fill="#8A4E22" stroke="${T}" stroke-width="5"/><rect x="${x + 10}" y="${y + 40}" width="${w - 20}" height="70" fill="#6A3A18" stroke="${T}" stroke-width="5"/>
    <path d="M${x + 20} ${y + 6} H${x + w - 20}" stroke="#C07A3A" stroke-width="6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hAr', '#FFD27A', 0.35)}<linearGradient id="ventana" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D8A0"/><stop offset="1" stop-color="#E8B868"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="#2E4A50"/><rect width="1080" height="120" fill="#E8D4A8"/><path d="M0 120 H1080" stroke="#B8A070" stroke-width="16"/>
  <!-- ventanal -->
  <path d="M40 1080 V420 Q40 260 200 260 Q360 260 360 420 V1080 Z" fill="url(#ventana)" stroke="#E8DCC0" stroke-width="16"/>
  <g opacity="0.8">${[[80, 820, '#E8E0D0'], [180, 760, '#F0E6D4'], [260, 850, '#E2D6C0']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="90" height="${1080 - y}" fill="${c}" stroke="#B89A70" stroke-width="3"/><path d="M${x - 6} ${y} L${x + 45} ${y - 40} L${x + 96} ${y} Z" fill="#C8643A"/>`).join('')}
    <circle cx="200" cy="640" r="60" fill="#E8DCC0"/><rect x="150" y="640" width="100" height="120" fill="#E8DCC0"/></g>
  <path d="M200 260 V1080 M40 560 H360 M40 820 H360" stroke="#E8DCC0" stroke-width="10"/>
  <path d="M0 160 Q60 600 20 1180 L-40 1180 V160 Z M120 160 Q100 400 160 520 Q60 800 140 1180 H40 Q20 600 60 160 Z" fill="#2A4E56" stroke="${T}" stroke-width="5"/>
  <path d="M300 160 Q340 500 300 680 Q380 900 360 1180 H440 Q460 700 420 160 Z" fill="#2A4E56" stroke="${T}" stroke-width="5"/><path d="M290 690 q20 30 0 80" stroke="#C89A3A" stroke-width="10" fill="none"/><path d="M80 520 q20 30 0 80" stroke="#C89A3A" stroke-width="10" fill="none"/>
  <!-- columna, busto y emblema -->
  <rect x="460" y="140" width="60" height="960" fill="#C8BCA0" stroke="${T}" stroke-width="4"/>
  <path d="M620 700 Q840 480 1080 700 V720 H620 Z" fill="#2A4448" stroke="#C8BCA0" stroke-width="10"/><circle cx="850" cy="620" r="60" fill="none" stroke="#C89A3A" stroke-width="8"/><path d="M790 620 H910 M850 560 V680" stroke="#C89A3A" stroke-width="6"/>
  <!-- pizarra -->
  <rect x="600" y="740" width="500" height="380" fill="#1E3A34" stroke="#6A3A18" stroke-width="18"/>
  <path d="M640 800 q60 -30 120 0 M640 860 h200" stroke="#C8D8C8" stroke-width="4" opacity="0.4" fill="none"/>
  ${arana(300, 400, 1)}${arana(860, 470, 0.7)}
  <!-- tarima, mesa y atril -->
  <rect x="0" y="1100" width="1080" height="80" fill="#7A4420" stroke="${T}" stroke-width="5"/><rect x="740" y="1010" width="340" height="110" fill="#8A4E22" stroke="${T}" stroke-width="5"/>
  <path d="M520 1100 L540 860 H700 L720 1100 Z" fill="#9A5A28" stroke="${T}" stroke-width="6"/><rect x="530" y="840" width="180" height="30" fill="#7A4420" stroke="${T}" stroke-width="5"/>
  <path d="M640 840 V800 M610 800 Q640 760 670 800 Z" stroke="#C89A3A" stroke-width="6" fill="#C89A3A"/><circle cx="640" cy="820" r="70" fill="url(#hAr)"/>
  <!-- suelo de madera y bancos -->
  <path d="M0 1180 H1080 V1920 H0 Z" fill="#9A5A28"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${540 + (i - 7) * 30} 1180 L${540 + (i - 7) * 160} 1920" stroke="#7A4420" stroke-width="4"/>`).join('')}
  ${[0, 1, 2, 3, 4].map(i => banco(-20, 1240 + i * 140, 420 + i * 30) + banco(700 - i * 40, 1240 + i * 140, 420 + i * 40)).join('')}
  </svg>`;
};
