// Teo Vela, vista frontal, dibujado en SVG.
// Coordenadas en una caja de 400 x 760. Origen arriba a la izquierda.
const C = {
  tinta: '#151515', piel: '#ffffff', abrigo: '#D9A13B', abrigoSombra: '#B9852C',
  bufanda: '#B8312F', bufandaSombra: '#8E2322', camisa: '#2A2626', pantalon: '#3B3536',
  bota: '#7A4A2B', botaSombra: '#5C361E', laton: '#A9782C', latonOscuro: '#6E4D1C',
  luz: '#FFE6A6', libreta: '#6B4A30',
};

// Expresiones: cejas [x1,y1,x2,y2] izquierda y derecha, ojos y boca.
const CARAS = {
  serio:    { ci: [148,98,184,108], cd: [216,108,252,98], ojos: 'punto', boca: 'M186 150 L214 150' },
  chulo:    { ci: [148,104,184,106], cd: [214,100,246,86], ojos: 'entorna', boca: 'M184 150 Q206 158 222 144' },
  empatico: { ci: [150,104,184,98], cd: [216,98,250,104], ojos: 'punto', boca: 'M184 148 Q200 158 216 148' },
  sorpresa: { ci: [150,88,182,82], cd: [218,82,250,88], ojos: 'abiertos', boca: 'M200 152 m-7 0 a7 9 0 1 0 14 0 a7 9 0 1 0 -14 0' },
  miedo:    { ci: [150,96,182,86], cd: [218,86,250,96], ojos: 'abiertos', boca: 'M184 154 q4 -5 8 0 q4 5 8 0 q4 -5 8 0 q4 5 8 0' },
};

function ojos(tipo) {
  return `<g class="ojo">${ojosDentro(tipo)}</g>`;
}
function ojosDentro(tipo) {
  if (tipo === 'abiertos') return `
    <circle cx="170" cy="124" r="14" fill="#fff" stroke="${C.tinta}" stroke-width="4"/>
    <circle cx="230" cy="124" r="14" fill="#fff" stroke="${C.tinta}" stroke-width="4"/>
    <circle cx="170" cy="125" r="5" fill="${C.tinta}"/><circle cx="230" cy="125" r="5" fill="${C.tinta}"/>`;
  if (tipo === 'entorna') return `
    <ellipse cx="168" cy="124" rx="7" ry="5" fill="${C.tinta}"/><ellipse cx="230" cy="124" rx="7" ry="6" fill="${C.tinta}"/>
    <path d="M158 120 L178 120" stroke="${C.tinta}" stroke-width="4" stroke-linecap="round"/>`;
  return `<ellipse cx="168" cy="124" rx="6" ry="8" fill="${C.tinta}"/><ellipse cx="232" cy="124" rx="6" ry="8" fill="${C.tinta}"/>`;
}

function cara(nombre = 'serio') {
  const f = CARAS[nombre];
  const ceja = ([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="${C.tinta}" stroke-width="7" stroke-linecap="round"/>`;
  return `${ceja(f.ci)}${ceja(f.cd)}${ojos(f.ojos)}
    <path class="boca" d="${f.boca}" stroke="${C.tinta}" stroke-width="4.5" fill="${nombre === 'sorpresa' ? C.tinta : 'none'}" stroke-linecap="round" stroke-linejoin="round"/>
    <g class="bocaAbierta" opacity="0" transform="translate(${nombre === 'chulo' ? 204 : 200} 154)"><ellipse class="bocaForma" rx="14" ry="12" fill="${C.tinta}"/></g>`;
}

// Farol de latón (según la referencia): aro arriba, cúpula con respiraderos, jaula de cristal
// abombada y base con dos remaches. (x, y) es el punto del aro donde se agarra.
function farol(x, y, encendido = true) {
  const L = C.laton, O = C.latonOscuro, t = C.tinta;
  return `<g transform="translate(${x} ${y})" stroke="${t}" stroke-width="3" stroke-linejoin="round">
    ${encendido ? `<defs><radialGradient id="halo"><stop offset="0" stop-color="${C.luz}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.luz}" stop-opacity="0"/></radialGradient></defs><circle cx="0" cy="40" r="72" fill="url(#halo)" stroke="none"/>` : ''}
    <circle cx="0" cy="0" r="8" fill="none" stroke="${L}" stroke-width="5"/><circle cx="0" cy="0" r="8" fill="none"/>
    <path d="M-6 8 h12 v6 h-12 z" fill="${L}"/>
    <path d="M-12 22 Q-12 13 0 13 Q12 13 12 22 Z" fill="${L}"/>
    <path d="M-18 22 H18 L22 28 H-22 Z" fill="${L}"/>
    <path d="M-5 17 v3 M0 16 v4 M5 17 v3" stroke="${O}" stroke-width="2"/>
    <path d="M-16 28 Q-21 44 -16 60 H16 Q21 44 16 28 Z" fill="${encendido ? C.luz : '#D9D6CC'}"/>
    ${encendido ? `<path d="M0 54 q-8 -10 0 -22 q8 12 0 22Z" fill="#FFB347" stroke="none"/><path d="M0 52 q-3 -5 0 -11 q3 6 0 11Z" fill="#FFF3C4" stroke="none"/>` : `<path d="M-1 46 v8 M1 46 v8" stroke="#bbb"/>`}
    <path d="M-8 28 Q-10 44 -8 60 M8 28 Q10 44 8 60 M-19 44 H19" stroke="${L}" stroke-width="3" fill="none"/>
    <path d="M-16 28 Q-21 44 -16 60 H16 Q21 44 16 28 Z" fill="none"/>
    <rect x="-19" y="60" width="38" height="8" fill="${L}"/>
    <circle cx="-10" cy="64" r="2" fill="${O}" stroke="none"/><circle cx="10" cy="64" r="2" fill="${O}" stroke="none"/>
    <path d="M-22 68 H22 V76 H-22 Z" fill="${O}"/>
  </g>`;
}

function teoFrente({ cara: expr = 'serio', farolEncendido = true, conFarol = true } = {}) {
  const t = C.tinta;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 760" width="400" height="760">
  <g stroke-linecap="round" stroke-linejoin="round">
    <!-- piernas: cada una en su grupo para girar desde la cadera -->
    <g class="pierna" data-cx="176" data-cy="470">
      <path d="M176 470 L170 660" stroke="${t}" stroke-width="30"/><path d="M176 470 L170 660" stroke="${C.pantalon}" stroke-width="22"/>
      <path d="M150 640 L190 640 L192 690 L196 694 L196 712 L132 712 Q126 690 150 682 Z" fill="${C.bota}" stroke="${t}" stroke-width="5"/>
      <path d="M132 704 L196 704" stroke="${C.botaSombra}" stroke-width="6"/><path d="M160 656 L180 650 M160 668 L180 662" stroke="${t}" stroke-width="3"/>
    </g>
    <g class="pierna" data-cx="224" data-cy="470">
      <path d="M224 470 L230 660" stroke="${t}" stroke-width="30"/><path d="M224 470 L230 660" stroke="${C.pantalon}" stroke-width="22"/>
      <path d="M210 640 L250 640 L250 682 Q274 690 268 712 L204 712 L204 694 L208 690 Z" fill="${C.bota}" stroke="${t}" stroke-width="5"/>
      <path d="M204 704 L268 704" stroke="${C.botaSombra}" stroke-width="6"/><path d="M220 650 L240 656 M220 662 L240 668" stroke="${t}" stroke-width="3"/>
    </g>
    <!-- camisa bajo el abrigo -->
    <path d="M178 235 L222 235 L226 470 L174 470 Z" fill="${C.camisa}" stroke="${t}" stroke-width="5"/>
    <!-- abrigo: dos mitades -->
    <path d="M196 232 L150 222 Q122 232 118 270 L112 500 L182 508 L186 330 Z" fill="${C.abrigo}" stroke="${t}" stroke-width="5"/>
    <path d="M204 232 L250 222 Q278 232 282 270 L288 500 L218 508 L214 330 Z" fill="${C.abrigo}" stroke="${t}" stroke-width="5"/>
    <!-- solapas -->
    <path d="M184 236 L150 226 L162 290 L184 330 Z" fill="${C.abrigoSombra}" stroke="${t}" stroke-width="4"/>
    <path d="M216 236 L250 226 L238 290 L216 330 Z" fill="${C.abrigoSombra}" stroke="${t}" stroke-width="4"/>
    <!-- bolsillos y libreta -->
    <rect x="128" y="372" width="36" height="12" fill="${C.libreta}" stroke="${t}" stroke-width="4" transform="rotate(-8 146 378)"/>
    <path d="M122 384 L170 382 L170 436 Q146 446 122 436 Z" fill="${C.abrigo}" stroke="${t}" stroke-width="4"/>
    <path d="M230 382 L278 384 L278 436 Q254 446 230 436 Z" fill="${C.abrigo}" stroke="${t}" stroke-width="4"/>
    <!-- mangas -->
    <path d="M128 240 Q104 262 102 330 L100 400 L132 402 L136 300 Z" fill="${C.abrigo}" stroke="${t}" stroke-width="5"/>
    <path d="M272 240 Q296 262 298 330 L300 400 L268 402 L264 300 Z" fill="${C.abrigo}" stroke="${t}" stroke-width="5"/>
    <rect x="98" y="384" width="36" height="18" rx="4" fill="${C.abrigoSombra}" stroke="${t}" stroke-width="4"/>
    <rect x="266" y="384" width="36" height="18" rx="4" fill="${C.abrigoSombra}" stroke="${t}" stroke-width="4"/>
    <!-- guantes -->
    <path d="M102 404 Q96 432 112 440 Q132 442 132 420 L130 404 Z" fill="${t}"/>
    <path d="M270 404 Q268 432 284 440 Q304 438 298 404 Z" fill="${t}"/>
    ${conFarol ? farol(286, 452, farolEncendido) : ''}
    <!-- bufanda: vueltas al cuello y caída -->
    <path d="M206 236 L238 238 L240 400 L208 400 Z" fill="${C.bufanda}" stroke="${t}" stroke-width="4"/>
    <path d="M214 244 V398 M224 244 V398 M232 244 V398" stroke="${C.bufandaSombra}" stroke-width="3"/>
    <path d="M208 400 l0 18 M216 400 l0 18 M224 400 l0 18 M232 400 l0 18 M240 400 l0 18" stroke="${C.bufanda}" stroke-width="4"/>
    <rect x="146" y="186" width="108" height="30" rx="15" fill="${C.bufanda}" stroke="${t}" stroke-width="4"/>
    <rect x="140" y="208" width="120" height="34" rx="17" fill="${C.bufanda}" stroke="${t}" stroke-width="4"/>
    <path d="M160 196 h80 M156 225 h88" stroke="${C.bufandaSombra}" stroke-width="3"/>
    <!-- cabeza -->
    <circle cx="200" cy="120" r="76" fill="${C.piel}" stroke="${t}" stroke-width="6"/>
    <path d="M200 46 Q194 24 182 18 M200 46 Q202 20 210 12 M201 46 Q214 30 226 28" stroke="${t}" stroke-width="4" fill="none"/>
    ${cara(expr)}
  </g></svg>`;
}

module.exports = { teoFrente, cara, farol, COLORES_TEO: C, CARAS_TEO: Object.keys(CARAS) };
