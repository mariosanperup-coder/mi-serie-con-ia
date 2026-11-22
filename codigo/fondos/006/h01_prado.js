// 006 · Prado de Cantabria (s. XIX): nubes, montaña con cortado, casona de piedra, rocas calizas con la boca de la cueva, flores. 1080 x 1920.
const { azar } = require('../comun');
const T = '#0B0E13';
module.exports = function prado() {
  const r = azar(61);
  const nube = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[[0, 0, 90], [80, -40, 100], [170, 0, 90], [90, 30, 110]].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="${c}" fill="#F4EBD6"/>`).join('')}<path d="M-90 40 H260" stroke="#D9CFB8" stroke-width="30" stroke-linecap="round"/></g>`;
  const roca = (x, y, w, h) => `<path d="M${x} ${y} q${w * 0.1} -${h} ${w * 0.5} -${h} q${w * 0.4} 0 ${w * 0.5} ${h} Z" fill="#CFCBBE" stroke="${T}" stroke-width="5"/><path d="M${x + w * 0.3} ${y - h * 0.6} q${w * 0.15} -${h * 0.2} ${w * 0.35} 0" stroke="#A8A496" stroke-width="5" fill="none"/>
    <path d="M${x + w * 0.2} ${y - h * 0.85} q${w * 0.2} -${h * 0.1} ${w * 0.4} -${h * 0.05}" stroke="#8AA05A" stroke-width="10" fill="none" opacity="0.7"/>`;
  const arbusto = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[[-40, 0, 50], [10, -30, 60], [60, 0, 50]].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="${c}" fill="#3E6A34" stroke="${T}" stroke-width="4"/>`).join('')}</g>`;
  const flor = (x, y, c) => `<path d="M${x} ${y} v40" stroke="#4A7A3A" stroke-width="4"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${x + Math.cos(a / 57.3) * 9}" cy="${y + Math.sin(a / 57.3) * 9}" r="7" fill="${c}"/>`).join('')}<circle cx="${x}" cy="${y}" r="5" fill="#E8B030"/>`;
  let flores = ''; for (let i = 0; i < 40; i++) flores += flor(Math.round(r() * 1080), Math.round(1580 + r() * 320), ['#F2D04A', '#F4F0E0', '#B888C0'][i % 3]);
  let hierba = ''; for (let i = 0; i < 70; i++) { const x = r() * 1080, y = 1450 + r() * 470; hierba += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q4 -30 -6 -50 M${(x + 8).toFixed(0)} ${y.toFixed(0)} q2 -26 12 -40" stroke="#5E8A3A" stroke-width="4" fill="none"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB0B4"/><stop offset="1" stop-color="#D8DCC8"/></linearGradient>
  <linearGradient id="prado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AB858"/><stop offset="1" stop-color="#6E9A40"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#cielo)"/>
  ${nube(120, 260, 1)}${nube(700, 180, 1.3)}${nube(820, 520, 0.8)}${nube(300, 560, 0.7)}
  <!-- montañas -->
  <path d="M0 860 Q200 640 420 600 Q560 560 700 620 Q850 640 1080 700 V1000 H0 Z" fill="#6E8A6A" stroke="${T}" stroke-width="4"/>
  <path d="M420 600 Q560 560 700 620 L690 680 Q560 640 430 670 Z" fill="#C8C6B4" stroke="${T}" stroke-width="3"/>${[460, 520, 580, 640].map(x => `<path d="M${x} 600 v60" stroke="#9A9888" stroke-width="4"/>`).join('')}
  <path d="M0 960 Q300 820 600 880 Q850 920 1080 860 V1100 H0 Z" fill="#7EA050" stroke="${T}" stroke-width="4"/>
  <!-- casona -->
  <g transform="translate(720 900)"><rect x="0" y="0" width="190" height="90" fill="#E2D6BC" stroke="${T}" stroke-width="4"/><path d="M-12 4 L95 -40 L202 4 Z" fill="#B85A3A" stroke="${T}" stroke-width="4"/>
    ${[30, 90, 150].map(x => `<rect x="${x}" y="30" width="20" height="26" fill="#3A3A32"/>`).join('')}<rect x="190" y="30" width="60" height="60" fill="#D8CAAE" stroke="${T}" stroke-width="4"/><path d="M184 34 L220 10 L256 34 Z" fill="#B85A3A" stroke="${T}" stroke-width="4"/></g>
  <path d="M520 1080 L1080 980 M560 1110 L1080 1030" stroke="#B8B4A0" stroke-width="8"/>
  <!-- ladera con la cueva -->
  <path d="M0 1000 Q300 940 620 1120 Q860 1250 1080 1240 V1920 H0 Z" fill="url(#prado)" stroke="${T}" stroke-width="5"/>
  ${arbusto(130, 980, 1.3)}<path d="M80 900 v-140" stroke="#4A3220" stroke-width="22"/>${arbusto(90, 760, 2)}
  ${roca(0, 1260, 300, 260)}${roca(220, 1230, 260, 240)}
  <path d="M190 1260 Q200 1110 290 1110 Q380 1110 390 1260 Z" fill="#151A16" stroke="${T}" stroke-width="6"/><path d="M210 1260 Q220 1150 290 1150 Q360 1150 370 1260" fill="#0B0E0C"/>
  ${roca(500, 1300, 260, 160)}${arbusto(470, 1240, 1)}${arbusto(860, 1260, 0.9)}
  <path d="M260 1270 Q330 1360 420 1430 Q500 1500 640 1560" stroke="#C8B488" stroke-width="40" fill="none" opacity="0.75"/>
  ${roca(-40, 1880, 400, 180)}${hierba}${flores}
  </svg>`;
};
