// Escena 2: cielo nocturno sobre el Mediterráneo. Panorámico 3240 x 1920 para el travelling lateral.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');

module.exports = function cieloMar() {
  const r = azar(22), t = P.tinta, W = 3240;
  let olas = '';
  for (let i = 0; i < 70; i++) {
    const y = 1300 + Math.pow(i / 70, 1.6) * 600, x = r() * W, w = 60 + r() * 240 * (y / 1300);
    olas += `<path d="M${x} ${y} h${w}" stroke="#2E4D6A" stroke-width="${1 + (y - 1300) / 200}" opacity="0.7"/>`;
  }
  let brillo = '';
  for (let i = 0; i < 26; i++) {
    const y = 1300 + i * 22, w = 40 + r() * 140;
    brillo += `<rect x="${2400 - w / 2 + (r() - 0.5) * 60}" y="${y}" width="${w}" height="${6 + i * 0.4}" rx="3" fill="${P.ambar}" opacity="${0.75 - i * 0.022}"/>`;
  }
  let pueblo = '';
  for (let i = 0; i < 70; i++) pueblo += `<circle cx="${(500 + r() * 900).toFixed(0)}" cy="${(1270 + r() * 22).toFixed(0)}" r="${(1.5 + r() * 2).toFixed(1)}" fill="${P.ambarClaro}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 1920" width="${W}" height="1920">
  <defs>
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.cieloAlto}"/><stop offset="0.7" stop-color="${P.cieloMedio}"/><stop offset="1" stop-color="${P.cieloBajo}"/></linearGradient>
    <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#132D45"/><stop offset="1" stop-color="#0A1828"/></linearGradient>
    ${halo('hLuna', P.ambarClaro, 0.45)}${halo('hPueblo', P.ambar, 0.35)}
  </defs>
  <rect width="${W}" height="1300" fill="url(#cielo)"/>
  ${estrellas(r, 420, W, 0, 1150)}
  <circle cx="2400" cy="420" r="300" fill="url(#hLuna)"/>
  <circle cx="2400" cy="420" r="110" fill="#F7DFA0" stroke="${t}" stroke-width="3"/>
  <circle cx="2370" cy="400" r="22" fill="#E2C27C"/><circle cx="2430" cy="450" r="14" fill="#E2C27C"/><circle cx="2440" cy="380" r="10" fill="#E2C27C"/>
  ${nube(120, 520, 620, r)}${nube(1200, 900, 700, r, { opacidad: 0.8 })}${nube(2600, 650, 560, r)}${nube(2000, 1080, 600, r, { opacidad: 0.7 })}${nube(300, 1120, 520, r, { opacidad: 0.6 })}
  <!-- costa lejana -->
  <path d="M300 1300 Q600 1220 900 1260 T1500 1270 Q1800 1240 2100 1280 L2300 1300 Z" fill="${P.montana}"/>
  <path d="M2700 1300 Q2900 1250 3240 1270 V1300 Z" fill="${P.montanaLejos}"/>
  <ellipse cx="950" cy="1285" rx="520" ry="40" fill="url(#hPueblo)"/>
  ${pueblo}
  <rect y="1300" width="${W}" height="620" fill="url(#mar)"/>
  ${olas}${brillo}
  <!-- rocas en primer plano -->
  <path d="M0 1800 L120 1740 L260 1790 L360 1760 L460 1920 H0 Z" fill="#2A2420" stroke="${t}" stroke-width="4"/>
  <path d="M2980 1920 L3040 1780 L3150 1750 L3240 1790 V1920 Z" fill="#2A2420" stroke="${t}" stroke-width="4"/>
  </svg>`;
};
