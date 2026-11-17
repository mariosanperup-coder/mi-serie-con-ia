// Refinería de noche en la costa, con antorchas (las llamas llevan class="llama"). 1080 x 1920.
const { azar, PALETA: P, estrellas, nube, halo } = require('./comun');

module.exports = function refineria() {
  const r = azar(13), t = P.tinta;
  const antorcha = (x, base, alto, ancho) => `<path d="M${x - ancho} ${base} L${x - ancho * 0.4} ${base - alto} H${x + ancho * 0.4} L${x + ancho} ${base}" fill="none" stroke="#2A2014" stroke-width="6"/>
    ${Array.from({ length: Math.floor(alto / 40) }, (_, i) => `<path d="M${x - ancho + i * ancho * 0.6 / (alto / 40)} ${base - i * 40} L${x + ancho - i * ancho * 0.6 / (alto / 40)} ${base - i * 40 - 40}" stroke="#2A2014" stroke-width="3"/>`).join('')}
    <rect x="${x - ancho * 0.5}" y="${base - alto - 14}" width="${ancho}" height="14" fill="#3A2E20"/>
    <circle cx="${x}" cy="${base - alto - 60}" r="${ancho * 4}" fill="url(#hFuego)"/>
    <g class="llama" data-cx="${x}" data-cy="${base - alto - 14}"><path d="M${x} ${base - alto - 14} q${-ancho * 1.2} -40 0 -${ancho * 3.4} q${ancho * 0.6} 50 ${ancho * 0.9} 20 q${ancho * 0.6} 40 ${-ancho * 0.9} ${ancho * 3.4 - 20}Z" fill="#FFA43A" stroke="#C0501A" stroke-width="3"/>
    <path d="M${x} ${base - alto - 18} q${-ancho * 0.5} -24 0 -${ancho * 1.8} q${ancho * 0.5} 24 0 ${ancho * 1.8}Z" fill="#FFE7A0"/></g>`;
  const deposito = (x, w, h) => `<path d="M${x} 1290 V${1290 - h} Q${x + w / 2} ${1290 - h - 30} ${x + w} ${1290 - h} V1290 Z" fill="#C9B48C" stroke="${t}" stroke-width="4"/><path d="M${x} ${1290 - h * 0.4} H${x + w}" stroke="#9A8460" stroke-width="3"/>`;
  let torres = '';
  [[440, 140, 280], [500, 120, 200], [560, 100, 240], [700, 90, 220], [760, 120, 160], [230, 70, 220]].forEach(([x, w, h]) =>
    torres += `<rect x="${x}" y="${1290 - h}" width="${w * 0.4}" height="${h}" fill="#5A4A34" stroke="${t}" stroke-width="3"/>${Array.from({ length: 5 }, (_, i) => `<circle cx="${x + w * 0.2}" cy="${1290 - h + 20 + i * h / 5}" r="4" fill="${P.ambar}"/>`).join('')}`);
  let reflejos = '';
  for (let i = 0; i < 40; i++) { const x = 120 + r() * 840, y = 1330 + r() * 500; reflejos += `<rect x="${x}" y="${y}" width="${20 + r() * 50}" height="6" rx="3" fill="#F59A3C" opacity="${(0.7 - (y - 1330) / 900).toFixed(2)}"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060D18"/><stop offset="1" stop-color="${P.cieloMedio}"/></linearGradient>
  <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16304A"/><stop offset="1" stop-color="#0A1828"/></linearGradient>
  ${halo('hFuego', '#FF9A3A', 0.5)}${halo('hPlanta', '#F2B35A', 0.3)}</defs>
  <rect width="1080" height="1320" fill="url(#cielo)"/>${estrellas(r, 140, 1080, 0, 1000)}
  ${nube(-60, 760, 360, r, { opacidad: 0.6 })}${nube(760, 620, 320, r, { opacidad: 0.6 })}
  <path d="M0 1200 Q200 980 380 1080 Q520 900 700 1040 Q860 960 1080 1120 V1320 H0 Z" fill="${P.montana}"/>
  <ellipse cx="540" cy="1230" rx="560" ry="140" fill="url(#hPlanta)"/>
  ${torres}${deposito(160, 220, 110)}${deposito(400, 160, 80)}${deposito(680, 200, 100)}
  <path d="M80 1240 H1000" stroke="#5A4A34" stroke-width="8"/>
  ${antorcha(330, 1290, 360, 18)}${antorcha(640, 1290, 560, 22)}${antorcha(900, 1290, 300, 16)}
  <rect x="0" y="1290" width="1080" height="40" fill="#2A2420" stroke="${t}" stroke-width="3"/>
  <rect y="1330" width="1080" height="590" fill="url(#mar)"/>${reflejos}
  <path d="M0 1780 L140 1730 L300 1790 L420 1920 H0 Z M900 1920 L960 1840 L1080 1820 V1920 Z" fill="#2A2420" stroke="${t}" stroke-width="4"/>
  </svg>`;
};
