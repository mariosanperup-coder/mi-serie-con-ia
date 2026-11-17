// Cabina del caza por dentro, mirando al frente, de noche. 1080 x 1920.
// La luz de alarma lleva id="alarma" (para hacerla parpadear) y la luz roja del cielo se dibuja aparte.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');

module.exports = function cabinaCaza() {
  const r = azar(12), t = P.tinta;
  const reloj = (x, y, rr) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="#14110D" stroke="${t}" stroke-width="6"/>
    ${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * 2 * Math.PI; return `<path d="M${x + Math.cos(a) * (rr - 18)} ${y + Math.sin(a) * (rr - 18)} L${x + Math.cos(a) * (rr - 6)} ${y + Math.sin(a) * (rr - 6)}" stroke="#E8A65A" stroke-width="4"/>`; }).join('')}
    <path d="M${x} ${y} L${x + rr * 0.5} ${y - rr * 0.5}" stroke="#F2C37A" stroke-width="6"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050B14"/><stop offset="1" stop-color="${P.cieloMedio}"/></linearGradient>${halo('hAlarma', '#FF3A2A', 0.7)}</defs>
  <rect width="1080" height="1920" fill="url(#cielo)"/>
  ${estrellas(r, 180, 1080, 0, 1200)}
  ${nube(-80, 1000, 300, r, { opacidad: 0.5 })}${nube(800, 1080, 360, r, { opacidad: 0.5 })}
  <!-- arco de la cubierta -->
  <path d="M-40 1300 Q-20 360 540 330 Q1100 360 1120 1300" fill="none" stroke="#3A3226" stroke-width="60"/>
  <path d="M-40 1300 Q-20 360 540 330 Q1100 360 1120 1300" fill="none" stroke="#7A6440" stroke-width="10"/>
  <path d="M60 760 L180 1300 M1020 760 L900 1300" stroke="#3A3226" stroke-width="40"/>
  ${Array.from({ length: 14 }, (_, i) => { const a = Math.PI * (0.1 + i * 0.06); return `<circle cx="${540 - Math.cos(a) * 560}" cy="${1300 - Math.sin(a) * 960}" r="6" fill="#9A845A"/>`; }).join('')}
  <!-- HUD -->
  <path d="M330 720 H750 L770 1000 H310 Z" fill="#7BD08A" opacity="0.18" stroke="#9CE0A8" stroke-width="5"/>
  <g stroke="#9CE0A8" stroke-width="4" fill="none" opacity="0.9"><circle cx="540" cy="860" r="44"/><path d="M540 790 V830 M540 890 V930 M430 860 H496 M584 860 H650 M370 860 H410 M670 860 H710"/></g>
  <path d="M300 1000 H780 L800 1060 H280 Z" fill="#2A241C" stroke="${t}" stroke-width="5"/>
  <!-- panel -->
  <path d="M0 1080 Q540 980 1080 1080 V1920 H0 Z" fill="#2A241C" stroke="${t}" stroke-width="6"/>
  <rect x="380" y="1100" width="320" height="60" rx="8" fill="#1E1A14" stroke="${t}" stroke-width="4"/>
  <circle cx="760" cy="1130" r="120" fill="url(#hAlarma)" id="alarmaHalo"/>
  <circle id="alarma" cx="760" cy="1130" r="34" fill="#FF3A2A" stroke="${t}" stroke-width="5"/>
  ${reloj(270, 1360, 130)}${reloj(810, 1360, 130)}${reloj(270, 1660, 110)}${reloj(810, 1660, 110)}
  <circle cx="540" cy="1360" r="130" fill="#14110D" stroke="${t}" stroke-width="6"/>
  <path d="M410 1360 A130 130 0 0 1 670 1360 Z" fill="#3E7FA0"/><path d="M410 1360 A130 130 0 0 0 670 1360 Z" fill="#9A5A2A"/>
  <path d="M470 1360 H610 M500 1330 H580" stroke="#F2C37A" stroke-width="5"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${30 + i * 40}" y="1500" width="28" height="20" fill="${i % 2 ? '#F59A3C' : '#3A2E20'}" stroke="${t}" stroke-width="2"/>`).join('')}
  <!-- palanca -->
  <path d="M540 1920 V1640" stroke="#1A1A1A" stroke-width="70" stroke-linecap="round"/><circle cx="540" cy="1630" r="60" fill="#2A2A2A" stroke="${t}" stroke-width="5"/>
  </svg>`;
};
