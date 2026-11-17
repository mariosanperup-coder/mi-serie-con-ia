// Escena 3: primer plano de la ventanilla lateral de la cabina. 1080 x 1920.
const { azar, PALETA: P, estrellas, nube } = require('./comun');

module.exports = function ventanilla() {
  const r = azar(44), t = P.tinta;
  let remaches = '';
  for (let i = 0; i < 16; i++) remaches += `<circle cx="70" cy="${330 + i * 56}" r="7" fill="#7A6A52" stroke="${t}" stroke-width="2"/>`;
  for (let i = 0; i < 14; i++) remaches += `<circle cx="${220 + i * 60}" cy="1250" r="7" fill="#7A6A52" stroke="${t}" stroke-width="2"/>`;
  const reloj = (x, y, rr) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="#1A1712" stroke="${t}" stroke-width="6"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<path d="M${x + Math.cos(a) * (rr - 22)} ${y + Math.sin(a) * (rr - 22)} L${x + Math.cos(a) * (rr - 10)} ${y + Math.sin(a) * (rr - 10)}" stroke="#E8A65A" stroke-width="4"/>`; }).join('')}
    <path d="M${x} ${y} V${y - rr + 20}" stroke="#F2C37A" stroke-width="6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.cieloAlto}"/><stop offset="1" stop-color="${P.cieloMedio}"/></linearGradient>
  <linearGradient id="marco" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A5A44"/><stop offset="1" stop-color="#3A3226"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="#2A241C"/>
  <!-- cristal -->
  <path d="M190 330 Q190 260 260 260 H1080 V1180 H260 Q190 1180 190 1110 Z" fill="url(#cielo)"/>
  ${estrellas(r, 60, 1080, 0, 900).replace(/cy="(\d+(\.\d+)?)/g, (m, y) => `cy="${280 + (+y)}`)}
  ${nube(300, 900, 380, r, { opacidad: 0.7 })}${nube(700, 1060, 400, r, { opacidad: 0.8 })}${nube(820, 640, 260, r, { opacidad: 0.5 })}
  <!-- marco metálico -->
  <path d="M0 0 H1080 V260 H260 Q190 260 190 330 V1110 Q190 1180 260 1180 H1080 V1290 H0 Z" fill="url(#marco)" stroke="${t}" stroke-width="6"/>
  <path d="M190 330 Q190 260 260 260 H1080 M190 1110 Q190 1180 260 1180 H1080 M190 330 V1110" stroke="#C98B4A" stroke-width="6" fill="none"/>
  ${remaches}
  <!-- panel inferior -->
  <rect y="1290" width="1080" height="630" fill="#221D16" stroke="${t}" stroke-width="5"/>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${30 + i * 130}" y="1320" width="70" height="30" rx="4" fill="${i % 3 === 1 ? '#3A2E20' : '#F59A3C'}" stroke="${t}" stroke-width="3"/>`).join('')}
  ${reloj(170, 1600, 150)}${reloj(540, 1600, 150)}${reloj(910, 1600, 150)}
  </svg>`;
};
