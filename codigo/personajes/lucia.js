// Lucía "la Escéptica", vista frontal. Caja de 400 x 760 (misma escala que Teo).
const C = {
  tinta: '#151515', piel: '#ffffff', jersey: '#24402B', jerseySombra: '#1A3020',
  pantalon: '#6A4428', pantalonRaya: '#4E301A', zapa: '#F4F4F0', suela: '#BDBDB6',
  lapiz: '#E2B33C', goma: '#E79A9A',
};

// Cejas [x1,y1,x2,y2], ojos y boca.
const CARAS = {
  esceptica: { ci: [146,96,184,106], cd: [216,98,250,86], ojos: 'punto', boca: 'M190 154 L208 152' },
  ojosBlanco:{ ci: [148,96,184,94], cd: [216,94,252,96], ojos: 'arriba', boca: 'M190 154 L208 154' },
  leyendo:   { ci: [148,104,184,110], cd: [216,110,252,104], ojos: 'abajo', boca: 'M192 154 L206 154' },
  sorpresa:  { ci: [150,88,182,82], cd: [218,82,250,88], ojos: 'punto', boca: 'M200 156 m-6 0 a6 8 0 1 0 12 0 a6 8 0 1 0 -12 0' },
  chulita:   { ci: [148,100,184,100], cd: [216,98,250,92], ojos: 'entorna', boca: 'M186 152 Q202 160 216 148' },
  explicando:{ ci: [148,98,184,104], cd: [216,104,252,98], ojos: 'punto', boca: 'M194 152 q6 8 12 0 z' },
};

function ojos(tipo) { return `<g class="ojo">${ojosDentro(tipo)}</g>`; }
function ojosDentro(tipo) {
  const t = C.tinta;
  if (tipo === 'arriba') return `<path d="M154 124 h28 M218 124 h28" stroke="${t}" stroke-width="4"/><circle cx="170" cy="114" r="5" fill="${t}"/><circle cx="234" cy="114" r="5" fill="${t}"/>`;
  if (tipo === 'abajo') return `<ellipse cx="168" cy="132" rx="5" ry="6" fill="${t}"/><ellipse cx="230" cy="132" rx="5" ry="6" fill="${t}"/>`;
  if (tipo === 'entorna') return `<path d="M156 122 h26 M218 122 h26" stroke="${t}" stroke-width="4"/><ellipse cx="170" cy="127" rx="6" ry="4" fill="${t}"/><ellipse cx="232" cy="127" rx="6" ry="4" fill="${t}"/>`;
  return `<ellipse cx="170" cy="126" rx="6" ry="8" fill="${t}"/><ellipse cx="232" cy="126" rx="6" ry="8" fill="${t}"/>`;
}

function caraLucia(nombre = 'esceptica') {
  const f = CARAS[nombre], t = C.tinta;
  const ceja = ([a, b, c, d]) => `<path d="M${a} ${b} Q${(a + c) / 2} ${Math.min(b, d) - 4} ${c} ${d}" stroke="${t}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return `${ojos(f.ojos)}
    <circle cx="170" cy="126" r="24" fill="none" stroke="${t}" stroke-width="3"/>
    <circle cx="232" cy="126" r="24" fill="none" stroke="${t}" stroke-width="3"/>
    <path d="M194 124 Q201 118 208 124 M146 122 L126 116 M256 122 L274 116" stroke="${t}" stroke-width="3" fill="none"/>
    ${ceja(f.ci)}${ceja(f.cd)}
    <path class="boca" d="${f.boca}" stroke="${t}" stroke-width="4" fill="${/sorpresa|explicando/.test(nombre) ? t : 'none'}" stroke-linecap="round" stroke-linejoin="round"/>
    <g class="bocaAbierta" opacity="0" transform="translate(200 156)"><ellipse class="bocaForma" rx="12" ry="10" fill="${t}"/></g>`;
}

function luciaFrente({ cara = 'esceptica' } = {}) {
  const t = C.tinta;
  const rayas = (x1, x2, y1, y2, dx) => Array.from({ length: 6 }, (_, i) => {
    const k = (i + 1) / 7; const xa = x1 + (x2 - x1) * k;
    return `M${xa} ${y1} L${xa + dx * (k - 0.5) * 2} ${y2}`;
  }).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 760" width="400" height="760">
  <g stroke-linejoin="round" stroke-linecap="round">
    <!-- coleta (detrás de la cabeza) -->
    <path d="M176 52 C140 4 70 20 74 108 C78 170 52 206 30 220 C86 222 120 170 114 108 C110 66 150 48 186 64 Z" fill="${t}"/>
    <!-- piernas (pantalón + zapatilla), cada una en su grupo -->
    <g class="pierna" data-cx="180" data-cy="400">
      <path d="M158 396 L202 396 L196 684 L136 684 Z" fill="${C.pantalon}" stroke="${t}" stroke-width="5"/>
      <path d="${rayas(158, 202, 404, 680, -8)}" stroke="${C.pantalonRaya}" stroke-width="2.5"/>
      <path d="M132 680 L198 680 L200 712 L118 712 Q114 692 132 680 Z" fill="${C.zapa}" stroke="${t}" stroke-width="5"/>
      <path d="M118 704 H200" stroke="${C.suela}" stroke-width="6"/><path d="M150 688 l14 -4 M154 696 l14 -4" stroke="${t}" stroke-width="3"/>
    </g>
    <g class="pierna" data-cx="220" data-cy="400">
      <path d="M198 396 L242 396 L264 684 L204 684 Z" fill="${C.pantalon}" stroke="${t}" stroke-width="5"/>
      <path d="${rayas(198, 242, 404, 680, 10)}" stroke="${C.pantalonRaya}" stroke-width="2.5"/>
      <path d="M202 680 L268 680 Q286 692 282 712 L200 712 Z" fill="${C.zapa}" stroke="${t}" stroke-width="5"/>
      <path d="M200 704 H282" stroke="${C.suela}" stroke-width="6"/><path d="M236 684 l14 4 M232 692 l14 4" stroke="${t}" stroke-width="3"/>
    </g>
    <path d="M158 412 H242" stroke="${t}" stroke-width="4"/><circle cx="200" cy="404" r="4" fill="${t}"/>
    <!-- brazos en jarra (detrás del torso) -->
    <path d="M154 234 L108 318 L160 388" fill="none" stroke="${t}" stroke-width="26"/>
    <path d="M154 234 L108 318 L160 388" fill="none" stroke="${C.jersey}" stroke-width="18"/>
    <path d="M246 234 L292 318 L240 388" fill="none" stroke="${t}" stroke-width="26"/>
    <path d="M246 234 L292 318 L240 388" fill="none" stroke="${C.jersey}" stroke-width="18"/>
    <!-- torso: jersey de cuello alto -->
    <path d="M152 226 Q200 214 248 226 L242 404 L158 404 Z" fill="${C.jersey}" stroke="${t}" stroke-width="5"/>
    <!-- manos (guantes blancos) en la cadera -->
    <ellipse cx="164" cy="390" rx="16" ry="13" fill="${C.piel}" stroke="${t}" stroke-width="4"/>
    <ellipse cx="236" cy="390" rx="16" ry="13" fill="${C.piel}" stroke="${t}" stroke-width="4"/>
    <!-- cuello alto -->
    <rect x="172" y="186" width="56" height="44" rx="8" fill="${C.jersey}" stroke="${t}" stroke-width="5"/>
    <path d="M182 192 v32 M192 192 v32 M202 192 v32 M212 192 v32 M220 192 v32" stroke="${C.jerseySombra}" stroke-width="3"/>
    <!-- cabeza -->
    <circle cx="200" cy="120" r="76" fill="${C.piel}" stroke="${t}" stroke-width="6"/>
    <ellipse cx="180" cy="50" rx="12" ry="7" fill="${t}"/>
    <!-- lápiz detrás de la oreja -->
    <g transform="rotate(-50 132 110)">
      <rect x="100" y="104" width="62" height="12" fill="${C.lapiz}" stroke="${t}" stroke-width="3"/>
      <rect x="92" y="104" width="10" height="12" fill="${C.goma}" stroke="${t}" stroke-width="3"/>
      <path d="M162 104 L176 110 L162 116 Z" fill="#F3D9A8" stroke="${t}" stroke-width="3"/>
    </g>
    ${caraLucia(cara)}
  </g></svg>`;
}

module.exports = { luciaFrente, caraLucia, CARAS_LUCIA: Object.keys(CARAS) };
