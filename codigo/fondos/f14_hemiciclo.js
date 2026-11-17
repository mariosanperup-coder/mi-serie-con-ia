// Hemiciclo parlamentario genérico (sin escudos ni banderas). 1080 x 1920.
const { PALETA: P, halo } = require('./comun');

module.exports = function hemiciclo() {
  const t = P.tinta, ORO = '#D9A452', ORO2 = '#B5823A', ROJO = '#9E2A22', ROJO2 = '#C0392B', MADERA = '#6A4228';
  let filas = '';
  for (let i = 0; i < 6; i++) {
    const ry = 120 + i * 85, rx = 330 + i * 140, cy = 1250 + i * 10;
    filas += `<path d="M${540 - rx} ${cy + i * 60} A${rx} ${ry} 0 0 0 ${540 + rx} ${cy + i * 60}" fill="none" stroke="${t}" stroke-width="${44 + i * 10}"/>
      <path d="M${540 - rx} ${cy + i * 60} A${rx} ${ry} 0 0 0 ${540 + rx} ${cy + i * 60}" fill="none" stroke="${MADERA}" stroke-width="${36 + i * 10}"/>
      <path d="M${540 - rx} ${cy + i * 60 - 30 - i * 6} A${rx} ${ry} 0 0 0 ${540 + rx} ${cy + i * 60 - 30 - i * 6}" fill="none" stroke="${ROJO2}" stroke-width="${26 + i * 8}" stroke-dasharray="${40 + i * 12} ${10 + i * 3}"/>`;
  }
  let columnas = '';
  [120, 330, 750, 960].forEach(x => columnas += `<rect x="${x - 26}" y="430" width="52" height="560" fill="${ORO}" stroke="${t}" stroke-width="4"/><rect x="${x - 36}" y="410" width="72" height="30" fill="${ORO2}" stroke="${t}" stroke-width="3"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hLuz', '#FFC066', 0.45)}<linearGradient id="vidriera" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FA0B0"/><stop offset="1" stop-color="#3A6A7A"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="#5A3A22"/>
  <!-- cúpula con lucernario -->
  <path d="M0 0 H1080 V380 Q540 220 0 380 Z" fill="${ORO2}" stroke="${t}" stroke-width="5"/>
  <path d="M240 0 Q540 140 840 0 Z" fill="url(#vidriera)" stroke="${t}" stroke-width="5"/>
  ${[300, 420, 540, 660, 780].map(x => `<path d="M${x} 0 L${540 + (x - 540) * 0.6} 90" stroke="#2A4A54" stroke-width="4"/>`).join('')}
  ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${60 + i * 165}" y="${230 + Math.abs(i - 2.5) * 22}" width="120" height="80" rx="6" fill="${ORO}" stroke="${t}" stroke-width="3"/>`).join('')}
  <!-- pared con paneles rojos y columnas -->
  <rect x="0" y="380" width="1080" height="620" fill="${ORO}"/>
  ${[[150, 150], [370, 140], [570, 140], [790, 150]].map(([x, w]) => `<rect x="${x}" y="470" width="${w}" height="460" fill="${ROJO}" stroke="${t}" stroke-width="4"/>`).join('')}
  ${columnas}
  <path d="M0 590 H220 M860 590 H1080" stroke="${ORO2}" stroke-width="30"/>
  ${[0, 1, 2, 3, 4].map(i => `<path d="M${10 + i * 40} 560 V600 M${880 + i * 40} 560 V600" stroke="${t}" stroke-width="5"/>`).join('')}
  ${[[240, 700], [840, 700]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#FFE3A0"/><circle cx="${x}" cy="${y}" r="160" fill="url(#hLuz)"/>`).join('')}
  <!-- mesa presidencial y tribuna -->
  <rect x="300" y="1000" width="480" height="120" fill="${MADERA}" stroke="${t}" stroke-width="5"/>
  ${[360, 450, 540, 630, 720].map(x => `<rect x="${x - 24}" y="950" width="48" height="56" rx="8" fill="${ROJO2}" stroke="${t}" stroke-width="3"/>`).join('')}
  <rect x="470" y="1120" width="140" height="130" fill="#7A4E30" stroke="${t}" stroke-width="5"/><path d="M520 1120 l-10 -40 M560 1120 l10 -40" stroke="${t}" stroke-width="3"/>
  <ellipse cx="540" cy="1270" rx="230" ry="40" fill="${ROJO}" stroke="${t}" stroke-width="4"/>
  ${filas}
  <!-- pasillo central -->
  <path d="M500 1300 H580 L720 1920 H360 Z" fill="${ROJO}" stroke="${t}" stroke-width="4"/><path d="M520 1300 L400 1920 M560 1300 L680 1920" stroke="${ORO}" stroke-width="4"/>
  </svg>`;
};
