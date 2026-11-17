// Cabina de pasajeros de noche, en perspectiva cónica (punto de fuga en la puerta de la cabina de mando).
// Todo se define en coordenadas "reales" (x, y en el plano cercano, z = profundidad) y se proyecta.
// pasajeros: true sienta pasajeros (vistos de espaldas) en algunos asientos.
const { halo } = require('./comun');
const T = '#0B0E13';
const VP = [700, 760];
const pr = (x, y, z) => [VP[0] + (x - VP[0]) / z, VP[1] + (y - VP[1]) / z];
const poli = (pts, fill, extra = '') => `<path d="M${pts.map(([x, y, z]) => pr(x, y, z).map(v => v.toFixed(1)).join(' ')).join(' L')} Z" fill="${fill}" ${extra}/>`;
// Oscurece un color según la profundidad (niebla cálida hacia el fondo).
function niebla(hex, z) {
  const k = Math.min(0.7, (z - 1) * 0.045), c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)), f = [24, 20, 18];
  return '#' + c.map((v, i) => Math.round(v * (1 - k) + f[i] * k).toString(16).padStart(2, '0')).join('');
}

// Medidas (plano cercano)
const PARED_I = -260, PARED_D = 1700, TECHO = -500, SUELO = 2400, FONDO = 16.6;
const PASILLO = [420, 980];
const RESPALDO_ARRIBA = 1060, FUNDA = [1090, 1300], PROF_ASIENTO = 0.32;
const BLOQUE_I = [PARED_I + 30, 390], BLOQUE_D = [1010, PARED_D - 30];
const FILAS = Array.from({ length: 26 }, (_, k) => 1.8 + k * 0.57);

function asiento(x1, x2, z, { ladoPasillo = null } = {}) {
  const s = 1 / z, [a, b] = pr(x1, RESPALDO_ARRIBA, z), [c, d] = pr(x2, SUELO, z), rad = 50 * s;
  const col = niebla('#24474A', z), funda = niebla('#CDB88E', z), lado = niebla('#17302F', z), brazo = niebla('#8A5A34', z);
  let g = '';
  // Lateral visible desde el pasillo
  if (ladoPasillo === 'derecha') g += poli([[x2, RESPALDO_ARRIBA + 30, z], [x2, RESPALDO_ARRIBA + 60, z + PROF_ASIENTO], [x2, SUELO, z + PROF_ASIENTO], [x2, SUELO, z]], lado, `stroke="${T}" stroke-width="${4 * s}"`);
  if (ladoPasillo === 'izquierda') g += poli([[x1, RESPALDO_ARRIBA + 30, z], [x1, RESPALDO_ARRIBA + 60, z + PROF_ASIENTO], [x1, SUELO, z + PROF_ASIENTO], [x1, SUELO, z]], lado, `stroke="${T}" stroke-width="${4 * s}"`);
  // Respaldo (cara frontal, paralela a la pantalla) con esquinas redondeadas
  g += `<path d="M${a} ${d} V${b + rad} Q${a} ${b} ${a + rad} ${b} H${c - rad} Q${c} ${b} ${c} ${b + rad} V${d} Z" fill="${col}" stroke="${T}" stroke-width="${5 * s}"/>`;
  const [fa, fb] = pr(x1 + 40, FUNDA[0], z), [fc, fd] = pr(x2 - 40, FUNDA[1], z);
  g += `<rect x="${fa}" y="${fb}" width="${fc - fa}" height="${fd - fb}" rx="${12 * s}" fill="${funda}" stroke="${T}" stroke-width="${3 * s}"/>`;
  // Costura y bolsillo
  const [pa, pb] = pr(x1 + 60, 1700, z), [pc, pd] = pr(x2 - 60, 1900, z);
  g += `<rect x="${pa}" y="${pb}" width="${pc - pa}" height="${pd - pb}" rx="${8 * s}" fill="none" stroke="${niebla('#16302F', z)}" stroke-width="${5 * s}"/>`;
  // Reposabrazos en el lado del pasillo
  if (ladoPasillo) {
    const x = ladoPasillo === 'derecha' ? x2 : x1, dx = ladoPasillo === 'derecha' ? -60 : 60;
    g += poli([[x + dx, 1600, z], [x, 1600, z], [x, 1600, z + PROF_ASIENTO], [x + dx, 1600, z + PROF_ASIENTO]], niebla('#A8703E', z), `stroke="${T}" stroke-width="${3 * s}"`);
    g += poli([[x + dx, 1600, z], [x, 1600, z], [x, 1700, z], [x + dx, 1700, z]], brazo, `stroke="${T}" stroke-width="${3 * s}"`);
  }
  return g;
}

function pasajero(cx, z, n) {
  const zz = z + 0.12, s = 1 / zz, [x, y] = pr(cx, 1035, zz), r = 112 * s;
  const pelo = [
    `<path d="M${x - r} ${y - r * 0.1} Q${x - r} ${y - r * 1.15} ${x} ${y - r * 1.05} Q${x + r} ${y - r * 1.15} ${x + r} ${y - r * 0.1} Q${x} ${y - r * 0.45} ${x - r} ${y - r * 0.1} Z" fill="#2A2420"/>`,
    `<circle cx="${x}" cy="${y - r * 1.02}" r="${r * 0.36}" fill="#5A3A22" stroke="${T}" stroke-width="${r * 0.05}"/><path d="M${x - r} ${y} Q${x} ${y - r * 1.6} ${x + r} ${y} Q${x} ${y - r * 0.6} ${x - r} ${y} Z" fill="#5A3A22"/>`,
    `<path d="M${x - r * 0.95} ${y - r * 0.3} Q${x} ${y - r * 1.3} ${x + r * 0.95} ${y - r * 0.3} L${x + r * 0.9} ${y - r * 0.55} Q${x} ${y - r * 1.05} ${x - r * 0.9} ${y - r * 0.55} Z" fill="#9A9A96"/>`,
    `<path d="M${x - r * 1.05} ${y - r * 0.55} H${x + r * 1.05} L${x + r * 0.75} ${y - r * 0.8} Q${x} ${y - r * 1.5} ${x - r * 0.75} ${y - r * 0.8} Z" fill="#3A3A44" stroke="${T}" stroke-width="${r * 0.05}"/>`,
    `<path d="M${x - r} ${y - r * 0.1} Q${x - r} ${y - r * 1.15} ${x} ${y - r * 1.05} Q${x + r} ${y - r * 1.15} ${x + r} ${y - r * 0.1} Q${x} ${y - r * 0.45} ${x - r} ${y - r * 0.1} Z" fill="#D9B860"/>`,
    `<path d="M${x - r * 1.02} ${y + r * 0.5} Q${x - r * 1.2} ${y - r * 1.2} ${x} ${y - r * 1.08} Q${x + r * 1.2} ${y - r * 1.2} ${x + r * 1.02} ${y + r * 0.5} Q${x} ${y - r * 0.2} ${x - r * 1.02} ${y + r * 0.5} Z" fill="#6A2E1E"/>`,
    ``,
    `<path d="M${x - r} ${y - r * 0.1} Q${x - r} ${y - r * 1.15} ${x} ${y - r * 1.05} Q${x + r} ${y - r * 1.15} ${x + r} ${y - r * 0.1} Q${x} ${y - r * 0.45} ${x - r} ${y - r * 0.1} Z" fill="#1A1A1A"/>`,
  ][n % 8];
  return `<g class="pasajero"><circle cx="${x}" cy="${y}" r="${r}" fill="${niebla('#FFFFFF', zz)}" stroke="${T}" stroke-width="${r * 0.08}"/>${pelo}</g>`;
}

let OCUPADOS = 0;
// Asientos que quedan vacíos (índice = fila*3 + asiento), elegidos para que se vea natural.
const LIBRES = [1, 5, 9, 14, 20, 22, 27, 31, 36, 41, 44, 50, 53, 58, 63, 66, 71, 75, 80, 86, 89, 94, 98, 103, 107, 112, 117, 121, 125, 130, 134, 139, 143, 148, 151];
module.exports = function cabinaPasajeros({ pasajeros = true } = {}) {
  const p = (pts, fill, extra) => poli(pts, fill, extra);
  let g = '';
  // Estructura: suelo, paredes, maleteros, techo
  g += p([[PARED_I, SUELO, 1], [PARED_D, SUELO, 1], [PARED_D, SUELO, FONDO], [PARED_I, SUELO, FONDO]], '#1C2A2C');
  g += p([[PASILLO[0], SUELO, 1], [PASILLO[1], SUELO, 1], [PASILLO[1], SUELO, FONDO], [PASILLO[0], SUELO, FONDO]], 'url(#moqueta)');
  g += `<path d="M${pr(PASILLO[0] + 20, SUELO, 1)} L${pr(PASILLO[0] + 20, SUELO, FONDO)} M${pr(PASILLO[1] - 20, SUELO, 1)} L${pr(PASILLO[1] - 20, SUELO, FONDO)}" stroke="#C98A3A" stroke-width="5"/>`;
  g += p([[PARED_I, TECHO, 1], [PARED_I, SUELO, 1], [PARED_I, SUELO, FONDO], [PARED_I, TECHO, FONDO]], 'url(#paredI)');
  g += p([[PARED_D, TECHO, 1], [PARED_D, SUELO, 1], [PARED_D, SUELO, FONDO], [PARED_D, TECHO, FONDO]], 'url(#paredD)');
  // Ventanillas en ambas paredes, entre filas, por encima de los respaldos
  for (const z of FILAS) for (const [x, dir] of [[PARED_I, 1], [PARED_D, -1]]) {
    const z1 = z + 0.22, z2 = z + 0.5, y1 = 560, y2 = 920;
    const [cx, cy] = pr(x, (y1 + y2) / 2, (z1 + z2) / 2), r = 260 / ((z1 + z2) / 2);
    g += `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.9}" ry="${r * 1.1}" fill="url(#hRojo)"/>`;
    const oval = (m) => Array.from({ length: 28 }, (_, i) => { const t = i / 28 * 2 * Math.PI;
      return [x, (y1 + y2) / 2 + Math.sin(t) * ((y2 - y1) / 2 - m), (z1 + z2) / 2 + Math.cos(t) * ((z2 - z1) / 2 - m / 900)]; });
    g += p(oval(0), '#7A6A54', `stroke="${T}" stroke-width="${6 / z}"`);
    g += p(oval(34), '#C0281E', `class="ventanilla" stroke="#4A1A14" stroke-width="${3 / z}"`);
  }
  // Maleteros (cara inferior + cara interior) y techo
  g += p([[PARED_I, 380, 1], [220, 380, 1], [220, 380, FONDO], [PARED_I, 380, FONDO]], '#6A5E4A', `stroke="${T}" stroke-width="3"`);
  g += p([[220, -160, 1], [220, 380, 1], [220, 380, FONDO], [220, -160, FONDO]], '#8E7E60', `stroke="${T}" stroke-width="4"`);
  g += p([[PARED_D, 380, 1], [1180, 380, 1], [1180, 380, FONDO], [PARED_D, 380, FONDO]], '#6A5E4A', `stroke="${T}" stroke-width="3"`);
  g += p([[1180, -160, 1], [1180, 380, 1], [1180, 380, FONDO], [1180, -160, FONDO]], '#8E7E60', `stroke="${T}" stroke-width="4"`);
  g += p([[PARED_I, TECHO, 1], [220, -160, 1], [220, -160, FONDO], [PARED_I, TECHO, FONDO]], '#5A5040');
  g += p([[PARED_D, TECHO, 1], [1180, -160, 1], [1180, -160, FONDO], [PARED_D, TECHO, FONDO]], '#5A5040');
  g += p([[220, -160, 1], [450, TECHO, 1], [450, TECHO, FONDO], [220, -160, FONDO]], '#2F3533');
  g += p([[1180, -160, 1], [950, TECHO, 1], [950, TECHO, FONDO], [1180, -160, FONDO]], '#2F3533');
  g += p([[450, TECHO, 1], [950, TECHO, 1], [950, TECHO, FONDO], [450, TECHO, FONDO]], '#262C2A');
  for (const z of FILAS) {
    g += `<path d="M${pr(220, -160, z)} L${pr(220, 380, z)} M${pr(1180, -160, z)} L${pr(1180, 380, z)}" stroke="#5E5444" stroke-width="${4 / z}"/>`;
    g += p([[640, TECHO, z + 0.2], [760, TECHO, z + 0.2], [760, TECHO, z + 0.45], [640, TECHO, z + 0.45]], '#FFD27A');
    for (const x of [0, 1400]) { const [lx, ly] = pr(x, 380, z + 0.15); g += `<circle cx="${lx}" cy="${ly}" r="${70 / z}" fill="url(#hLuz)"/><circle cx="${lx}" cy="${ly}" r="${14 / z}" fill="#FFD27A"/>`; }
  }
  // Pared del fondo con la puerta de la cabina de mando
  g += p([[PARED_I, -160, FONDO], [PARED_D, -160, FONDO], [PARED_D, SUELO, FONDO], [PARED_I, SUELO, FONDO]], '#4A4236');
  g += p([[560, 200, FONDO], [840, 200, FONDO], [840, SUELO, FONDO], [560, SUELO, FONDO]], '#0E1620', `stroke="${T}" stroke-width="3"`);
  g += p([[590, 420, FONDO + 3], [810, 420, FONDO + 3], [810, 900, FONDO + 3], [590, 900, FONDO + 3]], '#1E3550');
  g += `<path d="M${pr(590, 1000, FONDO + 3)} L${pr(810, 1000, FONDO + 3)} M${pr(600, 1100, FONDO + 3)} L${pr(800, 1100, FONDO + 3)}" stroke="#F59A3C" stroke-width="4" stroke-dasharray="5 4"/>`;
  g += p([[560, 200, FONDO], [610, 200, FONDO], [600, SUELO, FONDO], [560, SUELO, FONDO]], '#2A3A4E');
  g += p([[790, 200, FONDO], [840, 200, FONDO], [840, SUELO, FONDO], [800, SUELO, FONDO]], '#2A3A4E');
  // Filas de asientos, de la más lejana a la más cercana.
  // Ocupamos todos menos LIBRES y, si sobran, vaciamos los del fondo hasta dejar exactamente 109.
  const total = FILAS.length * 6;
  const SENTADOS = new Set(Array.from({ length: total }, (_, i) => total - 1 - i).filter(i => LIBRES.indexOf(i) < 0).slice(0, 109));
  let n = 0; OCUPADOS = 0;
  for (const z of [...FILAS].reverse()) {
    for (const [b1, b2, lado] of [[...BLOQUE_I, 'derecha'], [...BLOQUE_D, 'izquierda']]) {
      const w = (b2 - b1 - 16) / 3;
      for (let k = 0; k < 3; k++) {
        const x1 = b1 + k * (w + 8), x2 = x1 + w;
        const pasillo = (lado === 'derecha' && k === 2) || (lado === 'izquierda' && k === 0) ? lado : null;
        if (pasajeros && SENTADOS.has(n * 3 + k)) { g += pasajero((x1 + x2) / 2, z, n * 3 + k); OCUPADOS++; }
        g += asiento(x1, x2, z, { ladoPasillo: pasillo });
      }
      n++;
    }
  }
  module.exports.ocupados = OCUPADOS;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hRojo', '#FF3A2A', 0.45)}${halo('hLuz', '#FFC066', 0.4)}
    <linearGradient id="paredI" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7A6E58"/><stop offset="1" stop-color="#3A342A"/></linearGradient>
    <linearGradient id="paredD" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#7A6E58"/><stop offset="1" stop-color="#3A342A"/></linearGradient>
    <linearGradient id="moqueta" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1E3436"/><stop offset="1" stop-color="#101C1E"/></linearGradient>
    <radialGradient id="niebla" cx="${VP[0] / 1080}" cy="${VP[1] / 1920}" r="0.6"><stop offset="0" stop-color="#FFB060" stop-opacity="0.18"/><stop offset="1" stop-color="#FFB060" stop-opacity="0"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="#2A2620"/>
  ${g}
  <rect width="1080" height="1920" fill="url(#niebla)"/>
  </svg>`;
};
