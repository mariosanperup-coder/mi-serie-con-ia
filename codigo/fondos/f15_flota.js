// Barcos de guerra genéricos de noche en el Mediterráneo. 1080 x 1920.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');

function barco(x, y, s) {
  const t = P.tinta, g = '#4E565C', g2 = '#3A4046';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-500 0 L520 0 L460 90 L-470 90 Z" fill="${g2}" stroke="${t}" stroke-width="6"/>
    <path d="M-440 0 V-70 H-180 V-150 H40 V-70 H200 V0 Z" fill="${g}" stroke="${t}" stroke-width="5"/>
    <path d="M-120 -150 V-260 H-20 V-150" fill="${g}" stroke="${t}" stroke-width="5"/>
    <path d="M-70 -260 V-520 M-140 -420 H0 M-120 -340 H-20" stroke="${t}" stroke-width="10"/>
    <rect x="-130" y="-560" width="120" height="70" fill="none" stroke="${t}" stroke-width="6"/><path d="M-130 -525 H-10 M-70 -560 V-490" stroke="${t}" stroke-width="3"/>
    <circle cx="-70" cy="-575" r="10" fill="#FF4A3A"/><circle cx="-70" cy="-575" r="40" fill="url(#hRojoF)"/>
    <circle cx="-210" cy="-190" r="34" fill="#C9CCCC" stroke="${t}" stroke-width="4"/><circle cx="90" cy="-110" r="28" fill="#C9CCCC" stroke="${t}" stroke-width="4"/>
    <path d="M-280 -380 V-80" stroke="${t}" stroke-width="6"/><circle cx="-280" cy="-390" r="9" fill="#fff"/>
    ${[-380, -300, -220, -100, 0, 100].map(xx => `<rect x="${xx}" y="-50" width="40" height="18" fill="#F2D59A"/>`).join('')}
    <path d="M300 -10 L380 -60 M300 -30 L380 -80" stroke="${t}" stroke-width="10"/>
    <circle cx="500" cy="0" r="8" fill="#FF4A3A"/>
  </g>`;
}

module.exports = function flota() {
  const r = azar(15), t = P.tinta;
  let olas = '';
  for (let i = 0; i < 70; i++) { const y = 1110 + Math.pow(i / 70, 1.5) * 800, x = r() * 1080; olas += `<path d="M${x} ${y} h${50 + r() * 180}" stroke="#2E4D6A" stroke-width="${2 + (y - 1110) / 200}" opacity="0.7"/>`; }
  let brillo = '';
  for (let i = 0; i < 30; i++) { const y = 1120 + i * 26, w = 40 + r() * 160; brillo += `<rect x="${700 - w / 2 + (r() - 0.5) * 80}" y="${y}" width="${w}" height="${7 + i * 0.4}" rx="3" fill="${P.ambar}" opacity="${(0.7 - i * 0.02).toFixed(2)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#08121F"/><stop offset="1" stop-color="#16324A"/></linearGradient>
  <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#132D45"/><stop offset="1" stop-color="#0A1828"/></linearGradient>
  ${halo('hLuna', P.ambarClaro, 0.45)}${halo('hRojoF', '#FF4A3A', 0.8)}</defs>
  <rect width="1080" height="1110" fill="url(#cielo)"/>${estrellas(r, 150, 1080, 0, 1000)}
  <circle cx="740" cy="360" r="280" fill="url(#hLuna)"/><circle cx="740" cy="360" r="110" fill="#F7DFA0" stroke="${t}" stroke-width="3"/>
  <circle cx="710" cy="330" r="22" fill="#E2C27C"/><circle cx="770" cy="400" r="14" fill="#E2C27C"/>
  ${nube(-40, 470, 520, r, { opacidad: 0.7 })}${nube(640, 560, 420, r, { opacidad: 0.8 })}${nube(700, 860, 380, r, { opacidad: 0.6 })}
  <rect y="1100" width="1080" height="820" fill="url(#mar)"/>${olas}${brillo}
  ${barco(960, 1100, 0.18)}${barco(700, 1110, 0.32)}${barco(330, 1130, 0.62)}
  <path d="M60 1150 Q300 1170 640 1150" stroke="#9AB4C8" stroke-width="5" fill="none" opacity="0.6"/>
  </svg>`;
};
