// Portadas de las listas de reproducción (1280x720). Uso: node portadas_listas.js <carpeta>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { teoFrente } = require('../personajes/teo');
const { tinta } = require('../personajes/tinta');
const { luciaFrente } = require('../personajes/lucia');
const { expediente } = require('../objetos/objetos');
const { azar, estrellas, halo, nube } = require('../fondos/comun');
let n = 0;
const aislar = s => { const p = 'p' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc, extra = '') => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible" ${extra}>${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const T = '#0B0E13', AMARILLO = '#FFD34D', CREMA = '#F2E6CF', ROJO = '#C0392B';
const titulo = (x, y, l1, l2, tam, anchor = 'start', c2 = AMARILLO) => `
  <text x="${x}" y="${y}" text-anchor="${anchor}" font-family="JetBrains Mono" font-weight="800" font-size="${tam * 0.36}" letter-spacing="8" fill="${CREMA}" stroke="${T}" stroke-width="8" paint-order="stroke">${l1}</text>
  <text x="${x}" y="${y + tam * 0.95}" text-anchor="${anchor}" font-family="Inter" font-weight="900" font-size="${tam}" fill="${c2}" stroke="${T}" stroke-width="${tam * 0.15}" paint-order="stroke">${l2}</text>`;
const marca = `<g transform="translate(1180 660)"><rect x="-150" y="-30" width="210" height="52" rx="8" fill="${T}" opacity="0.7"/>
  <text x="-45" y="5" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="24" fill="${CREMA}">EXPEDIENTE VELA</text></g>`;
const cara = (x, y, s, o) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}" fill="none" stroke="#8A8274" stroke-width="7" stroke-linecap="round">
  <path d="M-40 -20 q10 -10 22 0 M18 -20 q10 -10 22 0"/><circle cx="-29" cy="0" r="9" fill="#8A8274"/><circle cx="29" cy="0" r="9" fill="#8A8274"/><path d="M0 10 v26 M-24 58 q24 18 48 0"/><ellipse cx="0" cy="10" rx="70" ry="90"/></g>`;

// 👻 MIEDO: noche, suelo de cemento con caras, luces rojas en el cielo, Teo con el farol
function miedo() {
  const r = azar(5);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03070D"/><stop offset="1" stop-color="#14324A"/></linearGradient>
  ${halo('hRojo', '#FF3A2A', 0.85)}${halo('hFarol', '#FFC066', 0.55)}
  <radialGradient id="vin" cx="0.35" cy="0.6" r="0.85"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></radialGradient></defs>
  <rect width="1280" height="720" fill="url(#cielo)"/>${estrellas(r, 160, 1280, 0, 420)}
  ${nube(700, 180, 360, r, { opacidad: 0.6 })}
  <circle cx="1030" cy="120" r="90" fill="url(#hRojo)"/><circle cx="1030" cy="120" r="12" fill="#FF6A50"/><circle cx="1085" cy="150" r="90" fill="url(#hRojo)"/><circle cx="1085" cy="150" r="12" fill="#FF6A50"/>
  <!-- suelo de cemento con caras (guiño a Bélmez) -->
  <path d="M0 470 H1280 V720 H0 Z" fill="#3E3A34"/><path d="M0 470 H1280" stroke="#2A2722" stroke-width="6"/>
  ${cara(760, 600, 0.75, 0.55)}${cara(980, 640, 0.55, 0.4)}${cara(560, 660, 0.45, 0.35)}
  <!-- silueta de La Sombra al fondo -->
  <path d="M1180 470 Q1170 330 1195 300 Q1185 270 1205 255 Q1228 270 1218 300 Q1243 330 1232 470 Z" fill="#05080C" opacity="0.85"/><circle cx="1200" cy="276" r="3" fill="#fff"/><circle cx="1213" cy="276" r="3" fill="#fff"/>
  <circle cx="250" cy="500" r="260" fill="url(#hFarol)"/>
  ${capa(teoFrente({ cara: 'miedo' }), 90, 160, 0.72)}${capa(tinta({ pose: 'susto' }), 250, 190, 0.26)}
  <rect width="1280" height="720" fill="url(#vin)"/>
  ${titulo(470, 230, 'EXPEDIENTES DE', 'MIEDO', 190)}
  <text x="476" y="460" font-family="Inter" font-weight="700" font-size="34" fill="${CREMA}" stroke="${T}" stroke-width="6" paint-order="stroke">Misterios reales de España</text>
  ${marca}
  </svg>`;
}

// 🧠 CURIOSIDADES: fondo cálido de corcho con recortes, Lucía con las gafas, bombilla
function curiosidades() {
  const recorte = (x, y, w, h, rot, contenido) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F2EAD8" stroke="${T}" stroke-width="4"/>${contenido}<circle cx="${x + w / 2}" cy="${y + 12}" r="9" fill="${ROJO}" stroke="${T}" stroke-width="2"/></g>`;
  const bola = (cx, cy, num) => `<circle cx="${cx}" cy="${cy}" r="34" fill="#F7E7B0" stroke="${T}" stroke-width="4"/><text x="${cx}" y="${cy + 12}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="32" fill="${T}">${num}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs><radialGradient id="corcho" cx="0.3" cy="0.4" r="0.9"><stop offset="0" stop-color="#C7864A"/><stop offset="1" stop-color="#7A4A24"/></radialGradient>
  ${halo('hBombilla', '#FFE38A', 0.8)}<filter id="poros"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.3 0 0 0 0 0.18 0 0 0 0 0.08 0 0 0 0.35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
  <rect width="1280" height="720" fill="url(#corcho)"/><rect width="1280" height="720" filter="url(#poros)"/>
  ${recorte(560, 470, 210, 150, -6, `${bola(620, 545, 22)}${bola(690, 555, 12)}<text x="665" y="605" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="18" fill="${T}">EL GORDO</text>`)}
  ${recorte(820, 480, 170, 170, 7, `<rect x="842" y="510" width="126" height="110" fill="#B58A5A" stroke="#6A4A2A" stroke-width="10"/><circle cx="905" cy="560" r="26" fill="#D8B48A"/><path d="M890 556 h8 M910 556 h8 M895 572 q10 6 20 0" stroke="${T}" stroke-width="4" fill="none"/>`)}
  ${recorte(1030, 470, 200, 160, -4, `<path d="M1050 600 l40 -60 l30 40 l25 -30 l40 50 Z" fill="#7E8A4A"/><text x="1130" y="520" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="18" fill="${T}">ALTAMIRA</text>`)}
  <path d="M665 490 L905 500 L1130 485" stroke="${ROJO}" stroke-width="4" fill="none"/>
  <!-- bombilla -->
  <circle cx="1150" cy="150" r="160" fill="url(#hBombilla)"/>
  <g transform="translate(1150 150)" stroke="${T}" stroke-width="6"><path d="M-46 0 A46 46 0 1 1 46 0 Q30 20 26 50 H-26 Q-30 20 -46 0 Z" fill="#FFE38A"/><rect x="-24" y="50" width="48" height="30" rx="6" fill="#9A9A9A"/><path d="M-12 30 l12 -24 l12 24" fill="none" stroke="#C98A3A"/></g>
  ${capa(luciaFrente({ cara: 'chulita' }), 40, 150, 0.72)}${capa(tinta({ pose: 'tranquilo' }), 250, 470, 0.3)}
  ${titulo(360, 160, 'HISTORIAS REALES', 'CURIOSIDADES', 112)}
  <text x="376" y="330" font-family="Inter" font-weight="700" font-size="36" fill="${CREMA}" stroke="${T}" stroke-width="6" paint-order="stroke">Tan raras que parecen mentira</text>
  ${marca}
  </svg>`;
}

// 📂 TODOS: archivador con carpetas numeradas, Teo y Lucía, Tinta encima
function todos() {
  const carpeta = (x, y, num, color, rot) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 120} ${y - 70} v-20 q0 -10 10 -10 h70 q8 0 12 8 l8 22 Z" fill="${color}" stroke="${T}" stroke-width="5"/>
    <rect x="${x - 125}" y="${y - 72}" width="250" height="160" rx="8" fill="${color}" stroke="${T}" stroke-width="5"/>
    <text x="${x}" y="${y + 30}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="52" fill="${T}">${num}</text></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs><radialGradient id="fondo" cx="0.5" cy="0.35" r="0.9"><stop offset="0" stop-color="#2A4A50"/><stop offset="1" stop-color="#0C171C"/></radialGradient>${halo('hLuz', '#FFC066', 0.5)}</defs>
  <rect width="1280" height="720" fill="url(#fondo)"/>
  <circle cx="640" cy="80" r="520" fill="url(#hLuz)"/>
  <path d="M640 0 V60" stroke="#111" stroke-width="5"/><path d="M590 100 Q640 40 690 100 Z" fill="#2a2a2a" stroke="${T}" stroke-width="4"/><circle cx="640" cy="108" r="16" fill="#FFE3A0"/>
  <!-- abanico de carpetas -->
  ${carpeta(470, 560, '001', '#D9B27A', -14)}${carpeta(640, 540, '002', '#C9A066', -3)}${carpeta(810, 560, '003', '#D9B27A', 10)}
  ${capa(teoFrente({ cara: 'chulo' }), 40, 330, 0.62)}${capa(luciaFrente({ cara: 'esceptica' }), 1000, 330, 0.62)}
  ${capa(tinta({ pose: 'desconfia' }), 870, 395, 0.3)}
  ${titulo(640, 190, 'TODOS LOS', 'EXPEDIENTES', 140, 'middle')}
  <text x="640" y="372" text-anchor="middle" font-family="Inter" font-weight="700" font-size="36" fill="${CREMA}" stroke="${T}" stroke-width="6" paint-order="stroke">Miedo y curiosidades · en orden</text>
  ${marca}
  </svg>`;
}

(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const [nombre, svg] of [['lista_miedo.png', miedo()], ['lista_curiosidades.png', curiosidades()], ['lista_todos.png', todos()]]) {
    await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nombre) });
  }
  await b.close();
})();
