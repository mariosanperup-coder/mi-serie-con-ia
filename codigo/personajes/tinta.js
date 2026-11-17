// Tinta, el cuervo, vista frontal (3/4 suave como en la referencia).
// Caja de 300 x 380.
const C = { negro: '#141414', contorno: '#000', pico: '#3A3A3A', ojo: '#fff', bufanda: '#B8312F', bufandaSombra: '#8E2322' };

const POSES = {
  tranquilo: { erizado: false, ojoGrande: 13, cejaY: null, marcas: false },
  susto:     { erizado: true,  ojoGrande: 9,  cejaY: null, marcas: true },
  desconfia: { erizado: false, ojoGrande: 13, cejaY: 'baja', marcas: false },
};

function tinta({ pose = 'tranquilo' } = {}) {
  const p = POSES[pose];
  const k = C.contorno;
  const plumasErizadas = p.erizado
    ? `<path d="M70 150 l-22 -14 l14 22 l-26 -2 l22 14 l-24 10 l28 2 M230 150 l22 -14 l-14 22 l26 -2 l-22 14 l24 10 l-28 2" fill="${C.negro}" stroke="${k}" stroke-width="3"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 380" width="300" height="380">
  <g stroke-linejoin="round" stroke-linecap="round">
    ${p.marcas ? `<path d="M60 40 l18 10 M80 22 l10 18 M104 14 l2 20" stroke="${k}" stroke-width="5"/>` : ''}
    <!-- patas -->
    <path d="M128 300 L124 350 M172 300 L176 350" stroke="${k}" stroke-width="6"/>
    <path d="M124 350 l-22 6 M124 350 l-6 10 M124 350 l14 8 M176 350 l22 6 M176 350 l6 10 M176 350 l-14 8" stroke="${k}" stroke-width="5"/>
    <!-- cola -->
    <path d="M90 270 L46 296 L70 300 L52 316 L104 296 Z" fill="${C.negro}" stroke="${k}" stroke-width="3"/>
    <!-- cuerpo -->
    <path d="M78 200 Q70 300 150 312 Q230 300 222 200 Z" fill="${C.negro}" stroke="${k}" stroke-width="4"/>
    ${plumasErizadas}
    <!-- alas -->
    <path d="M84 206 Q58 250 70 296 L84 284 L90 300 L104 280 Z" fill="${C.negro}" stroke="#2c2c2c" stroke-width="3"/>
    <path d="M216 206 Q242 250 230 296 L216 284 L210 300 L196 280 Z" fill="${C.negro}" stroke="#2c2c2c" stroke-width="3"/>
    <!-- penacho -->
    <path d="M150 62 Q128 20 150 2 Q170 30 150 62 Z" fill="${C.negro}" stroke="${k}" stroke-width="3"/>
    <path d="M150 58 Q148 30 152 12" stroke="#3a3a3a" stroke-width="2.5" fill="none"/>
    <!-- cabeza -->
    <circle cx="150" cy="130" r="74" fill="${C.negro}" stroke="${k}" stroke-width="4"/>
    <!-- ojo grande y ojo pequeño -->
    <circle cx="116" cy="126" r="30" fill="${C.ojo}" stroke="${k}" stroke-width="4"/>
    <circle cx="${p.erizado ? 116 : 120}" cy="126" r="${p.ojoGrande / 1.5}" fill="${k}"/>
    <circle cx="194" cy="120" r="${p.erizado ? 7 : 5}" fill="${C.ojo}"/>
    ${p.cejaY ? `<path d="M88 100 L144 110" stroke="#555" stroke-width="6"/>` : ''}
    <!-- pico -->
    <path d="M136 150 L172 146 L154 176 Z" fill="${C.pico}" stroke="${k}" stroke-width="3"/>
    <path d="M140 156 L166 154" stroke="${k}" stroke-width="2"/>
    <!-- bufanda -->
    <rect x="86" y="196" width="128" height="30" rx="14" fill="${C.bufanda}" stroke="${k}" stroke-width="3"/>
    <path d="M100 200 v22 M114 200 v22 M128 200 v22 M142 200 v22 M156 200 v22 M170 200 v22 M184 200 v22 M198 200 v22" stroke="${C.bufandaSombra}" stroke-width="2.5"/>
    <path d="M176 220 L200 222 L198 290 L176 290 Z" fill="${C.bufanda}" stroke="${k}" stroke-width="3"/>
    <path d="M184 226 v62 M192 226 v62" stroke="${C.bufandaSombra}" stroke-width="2.5"/>
    <path d="M178 290 v12 M184 290 v12 M190 290 v12 M196 290 v12" stroke="${C.bufanda}" stroke-width="3"/>
  </g></svg>`;
}

module.exports = { tinta, POSES_TINTA: Object.keys(POSES) };
