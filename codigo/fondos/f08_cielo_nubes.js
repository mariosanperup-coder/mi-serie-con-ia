// Escena 8: cielo de la persecución, por encima de un mar de nubes. Panorámico 3240 x 1920.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');

module.exports = function cieloNubes() {
  const r = azar(88), W = 3240;
  let capas = '';
  // Filas de nubes: las de atrás pequeñas y oscuras, las de delante grandes y con más luz.
  for (let fila = 0; fila < 7; fila++) {
    const y = 1000 + fila * 150, ancho = 200 + fila * 120, n = Math.ceil(W / (ancho * 0.8)) + 1;
    const color = ['#14283A', '#182E42', '#1C344A', '#203A52', '#253F57', '#2A455C', '#2E4A60'][fila];
    for (let i = 0; i < n; i++) capas += nube(i * ancho * 0.8 - ancho * 0.3 + r() * 80, y + r() * 40, ancho, r, { color, borde: fila > 2 ? '#D9A25A' : '#7A6A50', opacidad: 1, luz: [-8, -10] });
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 1920" width="${W}" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060C16"/><stop offset="0.8" stop-color="${P.cieloMedio}"/><stop offset="1" stop-color="#1E4A5E"/></linearGradient>
  ${halo('hLuna', P.ambarClaro, 0.45)}</defs>
  <rect width="${W}" height="1920" fill="url(#cielo)"/>
  ${estrellas(r, 500, W, 0, 1000)}
  <circle cx="620" cy="360" r="300" fill="url(#hLuna)"/>
  <circle cx="620" cy="360" r="120" fill="#F7DFA0" stroke="${P.tinta}" stroke-width="3"/>
  <circle cx="590" cy="330" r="24" fill="#E2C27C"/><circle cx="660" cy="400" r="16" fill="#E2C27C"/>
  ${nube(200, 520, 500, r, { opacidad: 0.6 })}${nube(2400, 420, 600, r, { opacidad: 0.6 })}
  <rect y="960" width="${W}" height="60" fill="#D9A25A" opacity="0.18"/>
  ${capas}
  </svg>`;
};
