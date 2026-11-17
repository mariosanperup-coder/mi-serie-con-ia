// Escenas 1 y 11: plataforma del aeropuerto de Manises de noche (1979). 1080 x 1920.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');

module.exports = function pistaNoche() {
  const r = azar(11), t = P.tinta;
  let ventanas = '';
  for (let i = 0; i < 6; i++) ventanas += `<rect x="${40 + i * 70}" y="1210" width="56" height="58" fill="${P.ambar}" stroke="${t}" stroke-width="3"/>`;
  for (let i = 0; i < 4; i++) ventanas += `<rect x="${40 + i * 70}" y="1280" width="56" height="44" fill="#E59A3F" stroke="${t}" stroke-width="3"/>`;
  let balizas = '', reflejos = '';
  for (let i = 0; i < 14; i++) {
    const x = 640 + i * 32, c = i % 3 === 1 ? '#5FD0E0' : P.ambar;
    balizas += `<circle cx="${x}" cy="1318" r="4" fill="${c}"/><circle cx="${x}" cy="1318" r="14" fill="url(#hAmbar)"/>`;
  }
  const columnas = [[90, 160], [180, 110], [250, 120], [330, 80], [470, 150], [700, 40], [760, 40]];
  for (const [x, w] of columnas) reflejos += `<rect x="${x - w / 2}" y="1360" width="${w}" height="${520 + r() * 60}" fill="url(#reflejo)"/>`;
  let juntas = '';
  for (let i = 0; i < 6; i++) juntas += `<path d="M0 ${1440 + i * 95 + i * i * 8} L1080 ${1420 + i * 100 + i * i * 9}" stroke="#14110E" stroke-width="2.5" opacity="0.7"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.cieloAlto}"/><stop offset="0.6" stop-color="${P.cieloMedio}"/><stop offset="1" stop-color="${P.cieloBajo}"/></linearGradient>
    <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A3F33"/><stop offset="1" stop-color="#2A241E"/></linearGradient>
    <linearGradient id="reflejo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.ambar}" stop-opacity="0.55"/><stop offset="1" stop-color="${P.ambar}" stop-opacity="0"/></linearGradient>
    ${halo('hAmbar', P.ambarClaro, 0.8)}${halo('hFoco', P.ambarClaro, 0.5)}${halo('hRojo', '#FF4A3A', 0.9)}
    <filter id="difuso"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <rect width="1080" height="1360" fill="url(#cielo)"/>
  ${estrellas(r, 160, 1080, 0, 1050)}
  ${nube(-60, 470, 260, r, { opacidad: 0.6 })}${nube(700, 860, 380, r, { opacidad: 0.7 })}${nube(860, 640, 260, r, { opacidad: 0.5 })}
  <!-- montañas lejanas con luces de pueblo -->
  <path d="M0 1130 Q180 1040 360 1090 T720 1060 T1080 1100 V1360 H0 Z" fill="${P.montanaLejos}"/>
  <path d="M300 1150 Q520 1080 760 1120 T1080 1140 V1360 H300 Z" fill="${P.montana}"/>
  ${Array.from({ length: 40 }, () => `<circle cx="${(560 + r() * 520).toFixed(0)}" cy="${(1140 + r() * 60).toFixed(0)}" r="2" fill="${P.ambar}" opacity="0.8"/>`).join('')}
  <!-- suelo mojado -->
  <rect y="1330" width="1080" height="590" fill="url(#suelo)"/>
  <g filter="url(#difuso)">${reflejos}</g>
  ${juntas}
  <!-- terminal -->
  <path d="M0 1180 H600 V1340 H0 Z" fill="${P.hormigon}" stroke="${t}" stroke-width="4"/>
  <path d="M0 1180 H620 V1200 H0 Z" fill="${P.hormigonSombra}" stroke="${t}" stroke-width="4"/>
  ${ventanas}
  <path d="M440 1230 H760 V1340 H440 Z" fill="#B29670" stroke="${t}" stroke-width="4"/>
  <path d="M430 1222 H770 V1236 H430 Z" fill="${P.hormigonSombra}" stroke="${t}" stroke-width="3"/>
  <circle cx="520" cy="1250" r="40" fill="url(#hFoco)"/><circle cx="680" cy="1250" r="40" fill="url(#hFoco)"/>
  <!-- escalerilla -->
  <path d="M560 1340 L640 1270 H672 V1340 M572 1330 L648 1266" stroke="${t}" stroke-width="5" fill="none"/>
  <!-- torre de control -->
  <rect x="130" y="760" width="150" height="430" fill="${P.hormigon}" stroke="${t}" stroke-width="4"/>
  <rect x="130" y="760" width="40" height="430" fill="${P.hormigonSombra}" opacity="0.6"/>
  <path d="M80 740 H330 V770 H80 Z" fill="${P.hormigonSombra}" stroke="${t}" stroke-width="4"/>
  <path d="M96 650 H314 L330 740 H80 Z" fill="${P.ambar}" stroke="${t}" stroke-width="4"/>
  <path d="M140 650 L134 740 M205 650 V740 M270 650 L276 740" stroke="${t}" stroke-width="4"/>
  <path d="M86 628 H324 V652 H86 Z" fill="${P.hormigonSombra}" stroke="${t}" stroke-width="4"/>
  <path d="M205 628 V520 M150 628 V570 M260 628 V585" stroke="${t}" stroke-width="4"/>
  <circle cx="205" cy="518" r="7" fill="#FF4A3A"/><circle cx="205" cy="518" r="30" fill="url(#hRojo)"/>
  <!-- mástil de focos -->
  <path d="M520 1180 V820" stroke="#1d1d1d" stroke-width="10"/>
  <rect x="482" y="800" width="76" height="26" rx="6" fill="#2b2b2b" stroke="${t}" stroke-width="3"/>
  <circle cx="496" cy="812" r="9" fill="${P.ambarClaro}"/><circle cx="520" cy="812" r="9" fill="${P.ambarClaro}"/><circle cx="544" cy="812" r="9" fill="${P.ambarClaro}"/>
  <circle cx="520" cy="830" r="190" fill="url(#hFoco)"/>
  <!-- manga de viento -->
  <path d="M960 1320 V1120" stroke="#cfcfcf" stroke-width="5"/>
  <path d="M962 1124 L1060 1140 L1056 1162 L962 1150 Z" fill="#E6E0D6" stroke="${t}" stroke-width="3"/>
  <path d="M985 1128 L983 1153 M1010 1132 L1008 1156 M1035 1136 L1033 1159" stroke="#D2463A" stroke-width="12"/>
  ${balizas}
  </svg>`;
};
