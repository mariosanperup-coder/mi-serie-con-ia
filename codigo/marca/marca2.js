// Marca v2 de "Expediente Vela": emblema (foto de perfil), logo de carpeta y banner, dibujados en código.
// Uso: node marca2.js <carpeta-salida>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { teoFrente, farol } = require('../personajes/teo');
const { tinta } = require('../personajes/tinta');
const { luciaFrente } = require('../personajes/lucia');
const { avion } = require('../objetos/objetos');
const { azar, estrellas, halo, nube } = require('../fondos/comun');

let n = 0;
const aislar = s => { const p = 'k' + (n++) + '_'; return s.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`); };
const capa = (svg, x, y, esc, extra = '') => { const [w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
  return `<svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible" ${extra}>${aislar(svg).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`; };
const farolG = (x, y, esc) => `<g transform="translate(${x} ${y}) scale(${esc})">${aislar(`<svg>${farol(0, 0, true)}</svg>`).replace(/<\/?svg>/g, '')}</g>`;

const C = { noche: '#0A1622', noche2: '#12324A', ambar: '#F2B35A', ambarOsc: '#C98A3A', crema: '#F2E6CF', rojo: '#C0392B', tinta: '#0B0E13', carton: '#D9B27A', carton2: '#C29A60' };
const ESPANA_PUEBLO = (y, esc, color) => `<g transform="translate(0 ${y}) scale(${esc} 1)" fill="${color}">
  <path d="M0 0 V-40 H40 V-70 H70 V-40 H110 V-60 L130 -80 L150 -60 V-30 H190 V-90 H200 V-150 L215 -175 L230 -150 V-90 H240 V-30 H290 V-55 H330 V-20 H380 V-65 L400 -85 L420 -65 V-25 H470 V-45 H520 V0 Z"/></g>`;

// ---------- 1) EMBLEMA (foto de perfil) ----------
function emblema() {
  const r = azar(21), R = 400;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="cielo" cx="0.5" cy="0.62" r="0.62"><stop offset="0" stop-color="#2A5A70"/><stop offset="0.55" stop-color="${C.noche2}"/><stop offset="1" stop-color="${C.noche}"/></radialGradient>
    ${halo('hFarol', '#FFC066', 0.7)}
    <path id="arcoArriba" d="M140 400 A260 260 0 0 1 660 400"/><path id="arcoAbajo" d="M118 400 A282 282 0 0 0 682 400"/>
    <clipPath id="disco"><circle cx="400" cy="400" r="232"/></clipPath>
  </defs>
  <circle cx="400" cy="400" r="${R}" fill="${C.noche}"/>
  <circle cx="400" cy="400" r="372" fill="none" stroke="${C.ambar}" stroke-width="6"/>
  <circle cx="400" cy="400" r="240" fill="none" stroke="${C.ambar}" stroke-width="6"/>
  <text font-family="JetBrains Mono" font-weight="800" font-size="62" letter-spacing="10" fill="${C.crema}"><textPath href="#arcoArriba" startOffset="50%" text-anchor="middle">EXPEDIENTE</textPath></text>
  <text font-family="Inter" font-weight="900" font-size="74" letter-spacing="18" fill="${C.ambar}"><textPath href="#arcoAbajo" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">VELA</textPath></text>
  ${[[95, 400], [705, 400]].map(([x, y]) => `<path d="M${x} ${y - 16} L${x + 5} ${y - 5} L${x + 16} ${y} L${x + 5} ${y + 5} L${x} ${y + 16} L${x - 5} ${y + 5} L${x - 16} ${y} L${x - 5} ${y - 5} Z" fill="${C.ambar}"/>`).join('')}
  <g clip-path="url(#disco)">
    <rect width="800" height="800" fill="url(#cielo)"/>${estrellas(r, 70, 800, 0, 520)}
    <circle cx="520" cy="260" r="34" fill="#F7DFA0" opacity="0.9"/>
    ${ESPANA_PUEBLO(640, 1.6, '#0D2030')}
    <circle cx="455" cy="520" r="230" fill="url(#hFarol)"/>
    ${capa(tinta({ pose: 'tranquilo' }), 245, 245, 0.95)}
    ${farolG(470, 470, 2.2)}
  </g>
  </svg>`;
}

// ---------- 2) LOGO: carpeta de expediente ----------
function logoCarpeta({ conFarol = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 700" width="1500" height="700">
  <defs><linearGradient id="carton" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.carton}"/><stop offset="1" stop-color="${C.carton2}"/></linearGradient>
  ${halo('hFarol', '#FFC066', 0.6)}
  <filter id="sombra" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity="0.45"/></filter>
  <filter id="gastado"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.22 0 0 0 0 0.08 0 0 0 0.25 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
  <g filter="url(#sombra)">
    <!-- papeles asomando -->
    <rect x="235" y="150" width="1000" height="460" rx="10" fill="#EFE6D2" stroke="${C.tinta}" stroke-width="6" transform="rotate(-2 735 380)"/>
    <!-- pestaña y carpeta -->
    <path d="M210 190 V130 Q210 112 228 112 H560 Q578 112 586 128 L606 190 Z" fill="url(#carton)" stroke="${C.tinta}" stroke-width="7"/>
    <rect x="200" y="186" width="1080" height="430" rx="14" fill="url(#carton)" stroke="${C.tinta}" stroke-width="7"/>
    <rect x="200" y="186" width="1080" height="430" rx="14" filter="url(#gastado)"/>
  </g>
  <text x="240" y="170" font-family="JetBrains Mono" font-weight="800" font-size="40" letter-spacing="4" fill="#3A2614">CASOS REALES</text>
  <path d="M230 280 H1250" stroke="#8A6438" stroke-width="3" stroke-dasharray="14 10"/>
  <text x="730" y="530" text-anchor="middle" font-family="Inter" font-weight="900" font-size="300" letter-spacing="10" fill="${C.ambar}" stroke="${C.tinta}" stroke-width="20" paint-order="stroke">VELA</text>
  <text x="730" y="258" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="56" letter-spacing="16" fill="${C.tinta}">EXPEDIENTE</text>
  <!-- sello -->
  <g transform="translate(1185 628) rotate(-9)"><rect x="-150" y="-40" width="300" height="80" rx="10" fill="#F2E6CF" opacity="0.9"/><rect x="-150" y="-40" width="300" height="80" rx="10" fill="none" stroke="${C.rojo}" stroke-width="8"/>
    <text x="0" y="14" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="38" fill="${C.rojo}">CASO ABIERTO</text></g>
  <!-- farol colgando a la izquierda y Tinta sobre la carpeta -->
  ${conFarol ? `<circle cx="140" cy="430" r="190" fill="url(#hFarol)"/><path d="M140 250 V330" stroke="${C.tinta}" stroke-width="6"/>${farolG(140, 330, 2.1)}` : ''}
  ${capa(tinta({ pose: 'desconfia' }), 1160, -10, 0.62)}
  </svg>`;
}

// ---------- 3) BANNER 2560 x 1440 (zona segura central 1546 x 423) ----------
function banner() {
  const r = azar(33);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2560 1440" width="2560" height="1440">
  <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050B14"/><stop offset="0.55" stop-color="#0E2236"/><stop offset="0.8" stop-color="#1B4A60"/><stop offset="1" stop-color="#2A5A68"/></linearGradient>
  <linearGradient id="niebla" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A5A68" stop-opacity="0"/><stop offset="1" stop-color="#0A1622" stop-opacity="1"/></linearGradient>
  ${halo('hLuna', '#FFE3A0', 0.5)}${halo('hFarol', '#FFC066', 0.55)}${halo('hRojo', '#FF4A3A', 0.8)}${halo('hCentro', '#F2B35A', 0.16)}</defs>
  <rect width="2560" height="1440" fill="url(#cielo)"/>${estrellas(r, 600, 2560, 0, 1000)}
  <circle cx="1960" cy="560" r="260" fill="url(#hLuna)"/><circle cx="1960" cy="560" r="78" fill="#F7DFA0"/>
  <circle cx="1935" cy="540" r="14" fill="#E2C27C"/><circle cx="1985" cy="585" r="10" fill="#E2C27C"/>
  ${nube(300, 640, 520, r, { opacidad: 0.55 })}${nube(1700, 720, 480, r, { opacidad: 0.6 })}${nube(900, 520, 380, r, { opacidad: 0.35 })}
  <!-- el avión con sus dos luces, a lo lejos -->
  ${capa(avion(), 1500, 600, 0.16)}
  <circle cx="1710" cy="610" r="44" fill="url(#hRojo)"/><circle cx="1710" cy="610" r="6" fill="#FF6A50"/>
  <circle cx="1745" cy="628" r="44" fill="url(#hRojo)"/><circle cx="1745" cy="628" r="6" fill="#FF6A50"/>
  <!-- colinas y pueblo -->
  <path d="M0 900 Q400 800 820 870 T1700 850 T2560 880 V1440 H0 Z" fill="#132A3B"/>
  ${ESPANA_PUEBLO(905, 4.9, '#0E2030')}
  ${Array.from({ length: 50 }, () => `<rect x="${(r() * 2500).toFixed(0)}" y="${(830 + r() * 60).toFixed(0)}" width="6" height="8" fill="#F2B35A" opacity="0.85"/>`).join('')}
  <rect y="880" width="2560" height="560" fill="url(#niebla)"/>
  <path d="M0 1180 Q500 1080 1100 1150 T2560 1120 V1440 H0 Z" fill="#081420"/>
  ${Array.from({ length: 30 }, () => `<circle cx="${(r() * 2560).toFixed(0)}" cy="${(1170 + r() * 220).toFixed(0)}" r="3" fill="#F2B35A" opacity="0.6"/>`).join('')}
  <ellipse cx="1280" cy="720" rx="760" ry="260" fill="url(#hCentro)"/>
  <!-- personajes (dentro de la zona segura) -->
  <circle cx="740" cy="820" r="260" fill="url(#hFarol)"/>
  ${capa(teoFrente({ cara: 'chulo' }), 560, 512, 0.55)}
  ${capa(luciaFrente({ cara: 'esceptica' }), 1790, 512, 0.55)}
  <!-- logo de carpeta en el centro -->
  ${capa(logoCarpeta({ conFarol: false }), 830, 462, 0.6)}
  <text x="1280" y="924" text-anchor="middle" font-family="Inter" font-weight="700" font-size="42" letter-spacing="2" fill="${C.crema}">Historias reales que no te contaron</text>
  </svg>`;
}

(async () => {
  const out = process.argv[2] || '.'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage();
  const foto = async (svg, nombre, w, h, transp = false) => {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, nombre), omitBackground: transp });
  };
  await foto(emblema(), 'perfil_800.png', 800, 800, true);
  await foto(logoCarpeta(), 'logo_transparente.png', 1500, 700, true);
  const ban = banner(); await foto(ban, 'banner_youtube_2560x1440.png', 2560, 1440);
  const i = ban.lastIndexOf('</svg>');
  await foto(ban.slice(0, i) + '<rect x="507" y="508" width="1546" height="423" fill="none" stroke="#0f0" stroke-width="4" stroke-dasharray="20 10"/></svg>', 'banner_zona_segura_PREVIA.png', 2560, 1440);
  await b.close();
})();
