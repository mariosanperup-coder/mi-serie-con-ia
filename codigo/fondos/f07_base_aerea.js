// Escena 8: base aérea de Los Llanos (Albacete) de noche, pista lista para el despegue. 1080 x 1920.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');

module.exports = function baseAerea() {
  const r = azar(77), t = P.tinta;
  // Pista en perspectiva: de lejos (izquierda, horizonte) a cerca (derecha, abajo).
  const borde = (k, lado) => { const x = 0 + k * 1300, y = 1120 + Math.pow(k, 1.6) * 420 + lado * (20 + k * 160); return [x, y]; };
  let balizas = '';
  for (let i = 0; i <= 14; i++) {
    const k = i / 14;
    for (const lado of [-1, 1]) { const [x, y] = borde(k, lado); const rr = 2 + k * 9;
      balizas += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(rr * 3).toFixed(1)}" fill="url(#hBaliza)"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(1)}" fill="${P.ambarClaro}"/>`; }
  }
  const sup = Array.from({ length: 11 }, (_, i) => borde(i / 10, -1)), inf = Array.from({ length: 11 }, (_, i) => borde(i / 10, 1)).reverse();
  const pista = 'M' + [...sup, ...inf].map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(' L') + ' Z';
  let marcas = '';
  for (let i = 1; i < 10; i += 2) { const [x1, y1] = borde(i / 10, 0), [x2, y2] = borde((i + 0.6) / 10, 0); marcas += `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#D8D2C2" stroke-width="${2 + i * 1.5}" opacity="0.8"/>`; }
  let matas = '';
  for (let i = 0; i < 40; i++) { const x = r() * 1080, y = 1620 + r() * 300, h = 20 + r() * 50;
    matas += `<path d="M${x} ${y} l-14 ${-h} M${x} ${y} l0 ${-h * 1.2} M${x} ${y} l14 ${-h}" stroke="#4A3A22" stroke-width="4"/>`; }
  const hangar = x => `<path d="M${x} 1140 V1040 Q${x + 110} 960 ${x + 220} 1040 V1140 Z" fill="${P.hormigon}" stroke="${t}" stroke-width="4"/><rect x="${x + 50}" y="1060" width="120" height="80" fill="#4A4036" stroke="${t}" stroke-width="3"/><circle cx="${x + 30}" cy="1060" r="40" fill="url(#hBaliza)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.cieloAlto}"/><stop offset="0.75" stop-color="${P.cieloMedio}"/><stop offset="1" stop-color="${P.cieloBajo}"/></linearGradient>
  <linearGradient id="campo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4A30"/><stop offset="1" stop-color="#9A6E36"/></linearGradient>
  ${halo('hBaliza', P.ambar, 0.6)}${halo('hRojo', '#FF4A3A', 0.9)}</defs>
  <rect width="1080" height="1140" fill="url(#cielo)"/>
  ${estrellas(r, 150, 1080, 0, 1000)}
  ${nube(-40, 360, 420, r, { opacidad: 0.7 })}${nube(560, 640, 420, r, { opacidad: 0.75 })}${nube(160, 820, 300, r, { opacidad: 0.5 })}
  <path d="M0 1100 Q250 1040 520 1080 T1080 1070 V1140 H0 Z" fill="${P.montanaLejos}"/>
  <rect y="1130" width="1080" height="790" fill="url(#campo)"/>
  ${hangar(0)}${hangar(200)}
  <rect x="460" y="980" width="60" height="160" fill="${P.hormigon}" stroke="${t}" stroke-width="4"/>
  <path d="M440 940 H540 V985 H440 Z" fill="${P.ambar}" stroke="${t}" stroke-width="4"/>
  <path d="M520 1140 H640 V1090 H520 Z" fill="#B29670" stroke="${t}" stroke-width="3"/>
  <path d="M400 1140 V880" stroke="#ddd" stroke-width="8" stroke-dasharray="22 22"/><path d="M400 1140 V880" stroke="#C0392B" stroke-width="8" stroke-dasharray="22 22" stroke-dashoffset="22"/>
  <circle cx="400" cy="872" r="7" fill="#FF4A3A"/><circle cx="400" cy="872" r="30" fill="url(#hRojo)"/>
  <path d="${pista}" fill="#2E2C2A" stroke="${t}" stroke-width="4"/>
  ${marcas}${balizas}${matas}
  </svg>`;
};
