// 002 · Pasillo de la casa de noche, suelo de cemento en perspectiva. 1080 x 1920.
const { halo } = require('../comun');
const T = '#0B0E13';
module.exports = function pasillo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hLuz', '#FFC066', 0.55)}
    <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A8070"/><stop offset="1" stop-color="#5E584E"/></linearGradient>
    <filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.18 0 0 0 0 0.15 0 0 0 0.4 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
  <rect width="1080" height="1920" fill="#0E1A2A"/>
  <!-- pared del fondo con puerta -->
  <rect x="380" y="300" width="380" height="740" fill="#E8D6B0" stroke="${T}" stroke-width="4"/>
  <rect x="380" y="960" width="380" height="80" fill="#5A7A90"/>
  <rect x="470" y="520" width="200" height="500" fill="#7A4E2C" stroke="${T}" stroke-width="6"/>${[0, 1, 2, 3].map(i => `<path d="M${500 + i * 46} 530 V1010" stroke="#5E3A1E" stroke-width="4"/>`).join('')}
  <circle cx="640" cy="780" r="8" fill="#2A2A2A"/>
  <!-- techo de vigas -->
  <path d="M300 0 H840 V300 H380 Z" fill="#6A4222"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${330 + i * 20}" y="${80 + i * 50}" width="${470 - i * 40}" height="26" fill="#7A4E2C" stroke="${T}" stroke-width="3"/>`).join('')}
  <path d="M300 0 L380 300 L760 300 L840 0" fill="none" stroke="${T}" stroke-width="4"/>
  <!-- paredes laterales en perspectiva -->
  <path d="M0 0 L380 300 V1040 L0 1660 Z" fill="#E2CDA4" stroke="${T}" stroke-width="5"/>
  <path d="M1080 0 L760 300 V1040 L1080 1660 Z" fill="#E2CDA4" stroke="${T}" stroke-width="5"/>
  <path d="M0 1420 L380 960 V1040 L0 1660 Z M1080 1420 L760 960 V1040 L1080 1660 Z" fill="#5A7A90"/>
  <!-- ventana con reja (izquierda) y macetas (derecha) -->
  <path d="M90 300 L260 400 V840 L90 820 Z" fill="#1E2A38" stroke="${T}" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<path d="M${120 + i * 38} ${318 + i * 22} V${822 + i * 4}" stroke="#2A2A2A" stroke-width="8"/>`).join('')}
  <path d="M110 740 h120 l-10 70 h-100 z" fill="#C0602A" stroke="${T}" stroke-width="4"/><circle cx="150" cy="720" r="34" fill="#4A7A3A"/><circle cx="200" cy="710" r="30" fill="#4A7A3A"/>
  ${[[880, 520, 1], [960, 420, 1.1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 H40 L30 60 H-30 Z" fill="#C0602A" stroke="${T}" stroke-width="4"/><circle cx="-14" cy="-16" r="22" fill="#4A7A3A"/><circle cx="16" cy="-20" r="22" fill="#4A7A3A"/><circle cx="-6" cy="-30" r="9" fill="#E0442E"/><circle cx="16" cy="-34" r="9" fill="#E0442E"/></g>`).join('')}
  <!-- bombilla -->
  <path d="M570 300 V400" stroke="${T}" stroke-width="4"/><path d="M510 450 Q570 380 630 450 Z" fill="#2A2A2A" stroke="${T}" stroke-width="4"/><circle cx="570" cy="462" r="20" fill="#FFE3A0"/>
  <circle cx="570" cy="560" r="560" fill="url(#hLuz)"/>
  <!-- suelo de cemento -->
  <path d="M380 1040 H760 L1080 1660 V1920 H0 V1660 Z" fill="url(#suelo)"/><path d="M380 1040 H760 L1080 1660 V1920 H0 V1660 Z" filter="url(#grano)"/>
  <path d="M380 1040 L0 1660 M760 1040 L1080 1660" stroke="${T}" stroke-width="5"/>
  </svg>`;
};
