// Utilidades compartidas para los fondos (1080 x 1920 salvo panorámicos).
function azar(semilla = 1) { // generador reproducible (mulberry32)
  let a = semilla >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const PALETA = {
  cieloAlto: '#08121F', cieloMedio: '#0E2236', cieloBajo: '#174055',
  montana: '#132A3B', montanaLejos: '#1C3A4E', ambar: '#F2B35A', ambarClaro: '#FFD98A',
  tinta: '#0B0E13', hormigon: '#C9AE84', hormigonSombra: '#8C7556',
};

function estrellas(rnd, n, ancho, alto, maxY) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rnd() * ancho, y = rnd() * maxY, r = rnd() < 0.08 ? 2.6 : 0.8 + rnd() * 1.2;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.4 + rnd() * 0.6).toFixed(2)}"/>`;
    if (r > 2.5) s += `<path d="M${x - 9} ${y} H${x + 9} M${x} ${y - 9} V${y + 9}" stroke="#fff" stroke-width="1.2" opacity="0.7"/>`;
  }
  return s;
}

// Nube: bultos solapados con base plana. El borde iluminado sale de dibujar
// la misma forma desplazada hacia la luz, en color cálido, por debajo.
function nube(x, y, ancho, rnd, { color = '#1E3A50', borde = '#8A7350', opacidad = 0.95, luz = [-6, -7] } = {}) {
  const n = 4 + Math.floor(rnd() * 3), paso = ancho / (n - 1);
  let forma = '';
  for (let i = 0; i < n; i++) {
    const centro = 1 - Math.abs(i / (n - 1) - 0.5) * 1.2;
    const r = paso * (0.55 + rnd() * 0.35) * (0.6 + centro * 0.6);
    forma += `<circle cx="${(x + i * paso).toFixed(1)}" cy="${(y - r * 0.55).toFixed(1)}" r="${r.toFixed(1)}"/>`;
  }
  forma += `<ellipse cx="${x + ancho / 2}" cy="${y}" rx="${ancho / 2 + paso * 0.5}" ry="${paso * 0.32}"/>`;
  return `<g opacity="${opacidad}"><g fill="${borde}" transform="translate(${luz[0]} ${luz[1]})">${forma}</g><g fill="${color}">${forma}</g></g>`;
}

function halo(id, color, opacidad = 0.6) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${opacidad}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}

module.exports = { azar, PALETA, estrellas, nube, halo };
