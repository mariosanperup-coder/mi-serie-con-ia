// 006 · Interior de la cueva: techo bajo de caliza (mitad superior), candil sobre una roca, túnel oscuro, suelo irregular. 1080 x 1920.
// techo({ pinturas: true }) devuelve la capa con los bisontes, para superponerla al techo (0..900).
const { azar, halo } = require('../comun');
const T = '#0B0E13';
function cueva() {
  const r = azar(62);
  let placas = ''; for (let i = 0; i < 16; i++) { const y = 40 + i * 55, x = (i % 3) * 200 - 100; placas += `<path d="M${x} ${y} Q${x + 400} ${y - 60 + r() * 40} ${x + 1300} ${y + 30}" stroke="#4A3A22" stroke-width="5" fill="none" opacity="0.7"/>`; }
  let piedras = ''; for (let i = 0; i < 26; i++) { const x = r() * 1080, y = 1250 + r() * 640, w = 20 + r() * 60; piedras += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${w.toFixed(0)}" ry="${(w * 0.45).toFixed(0)}" fill="#7A6440" stroke="${T}" stroke-width="3"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="techo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6A3A"/><stop offset="1" stop-color="#5E4A30"/></linearGradient>
  <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A5432"/><stop offset="1" stop-color="#8A6E40"/></linearGradient>
  ${halo('hCandil', '#FFB040', 0.7)}<radialGradient id="tunel"><stop offset="0" stop-color="#05080A"/><stop offset="1" stop-color="#1A2A2A"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="#2E3A34"/>
  <path d="M0 0 H1080 V820 Q760 940 520 880 Q260 820 0 900 Z" fill="url(#techo)" stroke="${T}" stroke-width="6"/>${placas}
  <!-- túnel -->
  <path d="M520 1180 Q560 820 760 800 Q960 800 1000 1180 Z" fill="#26342E" stroke="${T}" stroke-width="5"/><path d="M590 1180 Q620 900 760 880 Q900 890 930 1180 Z" fill="url(#tunel)"/>
  <!-- pared izquierda -->
  <path d="M0 880 Q200 840 260 1000 L300 1220 L0 1240 Z" fill="#9A7A44" stroke="${T}" stroke-width="5"/><path d="M60 940 L120 1200 M180 900 L220 1180" stroke="#6A5230" stroke-width="5"/>
  <path d="M0 1180 H1080 V1920 H0 Z" fill="url(#suelo)"/>
  <!-- roca con candil -->
  <path d="M-20 1270 Q20 1220 200 1220 Q340 1230 380 1290 L360 1400 L-20 1420 Z" fill="#A8884E" stroke="${T}" stroke-width="6"/>
  <circle cx="140" cy="1120" r="380" fill="url(#hCandil)"/>
  <g transform="translate(140 1220)"><path d="M-40 0 h80 v-14 h-80 z" fill="#6A4A22" stroke="${T}" stroke-width="4"/><path d="M-34 -14 Q-40 -90 0 -100 Q40 -90 34 -14 Z" fill="#FFD27A" opacity="0.6" stroke="#6A4A22" stroke-width="6"/>
    <path d="M0 -30 q-14 -24 0 -46 q14 22 0 46" fill="#FFF0B0"/><path d="M-30 -100 h60 v-12 h-60 z M-18 -112 q18 -30 36 0" fill="none" stroke="#6A4A22" stroke-width="6"/></g>
  ${piedras}
  <path d="M700 1500 Q900 1460 1100 1500 V1640 H700 Z" fill="#8A6E40" stroke="${T}" stroke-width="5"/><path d="M-40 1760 Q200 1700 420 1780 L420 1920 H-40 Z" fill="#9A7A44" stroke="${T}" stroke-width="5"/>
  </svg>`;
}
// Bisonte pintado (ocre/rojo con contorno negro), mirando a la derecha; caja aprox. 300 x 180.
const bisonte = (x, y, s, rot = 0, tumbado = false) => {
  const cuerpo = tumbado
    ? 'M-150 30 Q-160 -40 -80 -60 Q-20 -130 50 -100 Q110 -70 120 -10 Q150 0 150 40 Q100 60 -40 56 Q-120 56 -150 30 Z'
    : 'M-150 -10 Q-160 -70 -90 -80 Q-40 -140 30 -122 Q90 -104 110 -40 Q150 -30 160 20 Q150 52 120 42 L106 100 H86 L80 44 Q10 52 -60 42 L-70 100 H-92 L-100 32 Q-150 30 -150 -10 Z';
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="0.93">
  <path d="${cuerpo}" fill="#B8442A" stroke="#1A120A" stroke-width="7" stroke-linejoin="round"/>
  <path d="${tumbado ? 'M-80 -60 Q-20 -130 50 -100' : 'M-90 -80 Q-40 -140 30 -122 Q80 -108 100 -60'}" stroke="#1A120A" stroke-width="22" fill="none" stroke-linecap="round"/>
  ${tumbado ? '<path d="M120 -10 q20 -40 0 -56" stroke="#1A120A" stroke-width="7" fill="none"/>' : `<path d="M128 -34 q14 -34 -6 -50" stroke="#1A120A" stroke-width="7" fill="none"/><path d="M150 44 q-8 24 -34 12" stroke="#1A120A" stroke-width="10" fill="none"/><circle cx="132" cy="2" r="6" fill="#1A120A"/>
    <path d="M-150 -10 q-24 20 -14 60" stroke="#1A120A" stroke-width="6" fill="none"/>`}
  <path d="M-90 -10 q24 14 50 0 M0 0 q24 14 50 0" stroke="#E0A04A" stroke-width="7" fill="none" opacity="0.55"/></g>`; };
function techo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 900" width="1080" height="900">
  ${bisonte(260, 220, 1.1, -6)}${bisonte(760, 170, 1.0, 8)}${bisonte(560, 470, 1.2, -2, true)}${bisonte(200, 600, 0.9, 10)}${bisonte(880, 560, 0.95, -12)}
  <g transform="translate(470 120)" opacity="0.85"><path d="M-60 0 Q0 -40 60 0 L80 -20 M60 0 L80 20 M-60 0 L-80 -30 M-60 0 L-80 30" stroke="#1A120A" stroke-width="7" fill="none"/></g>
  ${[[100, 400], [980, 380], [620, 700]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 c0 -30 30 -30 30 0 v40 h-30 z" fill="#B8442A" opacity="0.7"/></g>`).join('')}
  </svg>`;
}
module.exports = cueva; module.exports.techo = techo; module.exports.bisonte = bisonte;
