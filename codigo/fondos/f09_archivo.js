// El Archivo: sótano base de Teo y Lucía. 1080 x 1920.
const { azar, PALETA: P, halo } = require('./comun');

function archivo({ conMesa = true } = {}) {
  const r = azar(99), t = P.tinta;
  const caja = (x, y, w, h) => {
    const c = ['#B07A3E', '#A06C35', '#BF8A4A', '#94622F'][Math.floor(r() * 4)];
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${t}" stroke-width="3"/>
      <rect x="${x + w / 2 - 16}" y="${y + h * 0.35}" width="32" height="10" rx="5" fill="#2a1c10"/>`;
  };
  const carpetas = (x, y, w, h) => Array.from({ length: Math.floor(w / 18) }, (_, i) =>
    `<rect x="${x + i * 18}" y="${y + (r() * 12)}" width="16" height="${h - r() * 12}" fill="${['#C99A58', '#B98845', '#D6AA66'][i % 3]}" stroke="${t}" stroke-width="2"/>`).join('');
  const estanteria = (x, w) => {
    let s = `<rect x="${x}" y="200" width="${w}" height="1300" fill="#2B2620"/>`;
    for (let i = 0; i < 6; i++) {
      const y = 380 + i * 200;
      s += r() < 0.5 ? caja(x + 10, y - 130, w * 0.45, 130) + carpetas(x + w * 0.5, y - 150, w * 0.45, 150)
                     : carpetas(x + 10, y - 150, w * 0.4, 150) + caja(x + w * 0.45, y - 120, w * 0.5, 120);
      s += `<rect x="${x - 6}" y="${y}" width="${w + 12}" height="14" fill="#5A5148" stroke="${t}" stroke-width="3"/>`;
    }
    s += `<rect x="${x - 10}" y="200" width="14" height="1300" fill="#5A5148" stroke="${t}" stroke-width="3"/><rect x="${x + w - 4}" y="200" width="14" height="1300" fill="#5A5148" stroke="${t}" stroke-width="3"/>`;
    return s;
  };
  const fotos = [[520, 700, 110, 130], [660, 690, 100, 90], [800, 710, 110, 120], [560, 870, 100, 120], [700, 850, 150, 160], [880, 870, 90, 120], [620, 1030, 110, 90], [800, 1030, 100, 110]];
  let tablon = fotos.map(([x, y, w, h], i) =>
    `<g transform="rotate(${(r() - 0.5) * 8} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#EDE3CF" stroke="${t}" stroke-width="3"/>
     <rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h * 0.65}" fill="${i % 2 ? '#5E6A70' : '#7C7660'}"/></g>`).join('');
  const pins = fotos.map(([x, y, w]) => [x + w / 2, y + 6]);
  tablon += `<path d="M${pins[0]} L${pins[4]} L${pins[2]} M${pins[1]} L${pins[3]} L${pins[6]} L${pins[4]} L${pins[7]} M${pins[5]} L${pins[4]}" stroke="#C0392B" stroke-width="3" fill="none"/>`;
  tablon += pins.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#C0392B" stroke="${t}" stroke-width="2"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16262A"/><stop offset="1" stop-color="#22383A"/></linearGradient>
    <linearGradient id="mesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773A"/><stop offset="1" stop-color="#7A4A22"/></linearGradient>
    ${halo('hBombilla', '#FFC066', 0.75)}${halo('hSombra', '#000', 0.6)}
  </defs>
  <rect width="1080" height="1920" fill="url(#pared)"/>
  <!-- arco con escalera y ventanuco -->
  <path d="M330 1500 V700 Q430 600 530 700 V1500 Z" fill="#0F1C20" stroke="${t}" stroke-width="4"/>
  <rect x="380" y="720" width="70" height="60" fill="#2E6B6E" stroke="${t}" stroke-width="3"/>
  ${Array.from({ length: 8 }, (_, i) => `<path d="M330 ${880 + i * 70} H${530 - i * 6}" stroke="#1D3034" stroke-width="6"/>`).join('')}
  <!-- tablón de corcho -->
  <rect x="490" y="660" width="540" height="520" fill="#8C5A2E" stroke="${t}" stroke-width="6"/>
  <rect x="504" y="674" width="512" height="492" fill="#A36B38"/>
  ${tablon}
  <!-- archivador metálico -->
  <rect x="520" y="1220" width="230" height="330" fill="#2F3B32" stroke="${t}" stroke-width="4"/>
  ${[0, 1, 2].map(i => `<rect x="536" y="${1236 + i * 104}" width="198" height="92" fill="#36443A" stroke="${t}" stroke-width="3"/><rect x="605" y="${1270 + i * 104}" width="60" height="12" rx="6" fill="#151a16"/>`).join('')}
  ${caja(780, 1300, 200, 120)}${caja(800, 1420, 180, 130)}
  ${estanteria(-20, 330)}${estanteria(890, 240)}
  <!-- luz de la bombilla -->
  <circle cx="540" cy="520" r="760" fill="url(#hBombilla)"/>
  <path d="M540 0 V380" stroke="#111" stroke-width="5"/>
  <path d="M460 470 Q540 360 620 470 Z" fill="#2A2A2A" stroke="${t}" stroke-width="4"/>
  <circle cx="540" cy="490" r="26" fill="#FFE3A0" stroke="${t}" stroke-width="3"/>
  ${conMesa ? mesa() : ''}
  </svg>`;
}

// Mesa de madera en primer plano: va POR DELANTE de los personajes.
function mesa() {
  const t = P.tinta;
  let tablas = '';
  for (let i = 0; i < 5; i++) tablas += `<path d="M0 ${1560 + i * 34} H1080" stroke="#5E3A1C" stroke-width="3" opacity="0.6"/>`;
  return `<defs><linearGradient id="mesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773A"/><stop offset="1" stop-color="#7A4A22"/></linearGradient>${halo('hSombraMesa', '#000', 0.6)}</defs>
  <!-- mesa de madera en primer plano -->
  <rect x="0" y="1500" width="1080" height="420" fill="url(#mesa)" stroke="${t}" stroke-width="6"/>
  ${tablas}
  <path d="M0 1500 H1080" stroke="#D99A55" stroke-width="6"/>
  <ellipse cx="540" cy="1920" rx="700" ry="160" fill="url(#hSombraMesa)"/>`;
}

module.exports = archivo;
module.exports.mesa = mesa;
