// Escenas 3 y 5: cabina del avión de noche, vista desde detrás de los asientos. 1080 x 1920.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');
const PANEL = '#2E2A22', PANEL2 = '#3A342A', BORDE = '#0B0E13';

function reloj(x, y, r, rnd) {
  const a = rnd() * Math.PI * 2;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#1A1712" stroke="${BORDE}" stroke-width="4"/>
    <circle cx="${x}" cy="${y}" r="${r - 6}" fill="none" stroke="#C99A55" stroke-width="2" stroke-dasharray="3 7"/>
    <path d="M${x} ${y} L${(x + Math.cos(a) * (r - 10)).toFixed(1)} ${(y + Math.sin(a) * (r - 10)).toFixed(1)}" stroke="#F2C37A" stroke-width="3"/>
    <circle cx="${x}" cy="${y}" r="3" fill="#F2C37A"/>`;
}
function luces(x, y, n, rnd, sep = 34) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<rect x="${x + i * sep}" y="${y}" width="22" height="14" rx="2" fill="${rnd() < 0.55 ? '#F59A3C' : '#3A2E20'}" stroke="${BORDE}" stroke-width="2"/>`;
  return s;
}
function interruptores(x, y, n, sep = 30) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${x + i * sep}" cy="${y}" r="7" fill="#5A5246" stroke="${BORDE}" stroke-width="2"/><path d="M${x + i * sep} ${y} v-20" stroke="#B9AE98" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}

module.exports = function cabina() {
  const r = azar(33), t = BORDE;
  let relojes = '';
  [[150, 830], [250, 830], [350, 830], [730, 830], [830, 830], [930, 830], [250, 940], [350, 940], [730, 940], [830, 940]].forEach(([x, y]) => relojes += reloj(x, y, 42, r));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.cieloAlto}"/><stop offset="1" stop-color="${P.cieloMedio}"/></linearGradient>
    <linearGradient id="asiento" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2F3427"/><stop offset="1" stop-color="#4A4A34"/></linearGradient>
    ${halo('hPanel', '#F59A3C', 0.25)}
  </defs>
  <rect width="1080" height="1920" fill="#16130F"/>
  <!-- parabrisas -->
  <rect y="330" width="1080" height="400" fill="url(#cielo)"/>
  ${estrellas(r, 70, 1080, 0, 720).replace(/cy="(\d+)/g, (m, y) => `cy="${330 + (+y % 380)}`)}
  ${nube(40, 640, 300, r, { opacidad: 0.7 })}${nube(600, 600, 360, r, { opacidad: 0.7 })}
  <path d="M0 330 H1080 V360 H560 V730 H520 V360 H0 Z" fill="${PANEL2}" stroke="${t}" stroke-width="5"/>
  <path d="M30 360 Q20 500 40 700 H500 V360 Z M580 360 V700 H860 Q900 520 880 360 Z" fill="none" stroke="#5A5040" stroke-width="10"/>
  <path d="M900 360 L1080 380 V730 L930 700 Z" fill="${PANEL2}" stroke="${t}" stroke-width="5"/>
  <path d="M920 400 L1060 410 V680 L950 660 Z" fill="url(#cielo)" stroke="#5A5040" stroke-width="6"/>
  <!-- panel del techo -->
  <path d="M0 0 H1080 V330 H0 Z" fill="${PANEL}"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${30 + i * 260}" y="20" width="240" height="290" rx="8" fill="${PANEL2}" stroke="${t}" stroke-width="4"/>${luces(50 + i * 260, 50, 6, r)}${interruptores(60 + i * 260, 130, 7)}${interruptores(60 + i * 260, 220, 7)}${luces(50 + i * 260, 270, 6, r)}`).join('')}
  ${reloj(470, 160, 40, r)}${reloj(610, 160, 40, r)}
  <!-- panel de instrumentos -->
  <path d="M0 730 H1080 V1060 H0 Z" fill="${PANEL}" stroke="${t}" stroke-width="5"/>
  <path d="M0 730 H1080 V770 H0 Z" fill="${PANEL2}" stroke="${t}" stroke-width="4"/>
  ${luces(200, 742, 20, r)}
  ${relojes}
  <circle cx="540" cy="850" r="62" fill="#1A1712" stroke="${t}" stroke-width="5"/>
  <path d="M478 850 A62 62 0 0 1 602 850 Z" fill="#3E7FA0"/><path d="M478 850 A62 62 0 0 0 602 850 Z" fill="#9A5A2A"/>
  <path d="M500 850 H580 M520 830 H560 M525 870 H555" stroke="#F2C37A" stroke-width="3"/>
  ${reloj(540, 975, 46, r)}
  <rect y="730" width="1080" height="330" fill="url(#hPanel)"/>
  <!-- cuernos de mando -->
  <path d="M180 1060 V1000 M120 980 Q180 1040 240 980" stroke="#0F0F0F" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M900 1060 V1000 M840 980 Q900 1040 960 980" stroke="#0F0F0F" stroke-width="22" fill="none" stroke-linecap="round"/>
  <!-- pedestal central con gases -->
  <path d="M400 1060 H680 V1920 H400 Z" fill="${PANEL2}" stroke="${t}" stroke-width="5"/>
  ${[470, 540, 610].map(x => `<rect x="${x - 18}" y="1100" width="36" height="160" rx="6" fill="#1F1B15" stroke="${t}" stroke-width="3"/><rect x="${x - 24}" y="1120" width="48" height="40" rx="6" fill="#D6CBB4" stroke="${t}" stroke-width="3"/>`).join('')}
  ${luces(425, 1320, 7, r)}${interruptores(440, 1420, 7)}${luces(425, 1500, 7, r)}
  <!-- asientos vacíos -->
  <path d="M-20 1040 Q150 1000 300 1060 L330 1920 H-20 Z" fill="url(#asiento)" stroke="${t}" stroke-width="6"/>
  <path d="M1100 1040 Q930 1000 780 1060 L750 1920 H1100 Z" fill="url(#asiento)" stroke="${t}" stroke-width="6"/>
  <path d="M260 1420 Q330 1400 360 1440 L370 1600 L280 1610 Z M820 1420 Q750 1400 720 1440 L710 1600 L800 1610 Z" fill="#C8B48A" stroke="${t}" stroke-width="5"/>
  </svg>`;
};
