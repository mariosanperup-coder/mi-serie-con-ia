// Teo y Lucía de perfil (mirando a la derecha) para caminar. Para ir a la izquierda se refleja.
// Piernas y brazos van en grupos .pierna / .brazo que giran desde la cadera y el hombro.
const { COLORES_TEO: C, farol } = require('./teo');
const T = '#151515';
const trazo = (d, color, ancho) => `<path d="${d}" fill="none" stroke="${T}" stroke-width="${ancho + 8}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round"/>`;

function cabezaPerfil({ boca = 'M236 152 L258 150', cejas = 'M222 100 L256 108', ancho = 7 } = {}) {
  return `<circle cx="200" cy="120" r="76" fill="#fff" stroke="${T}" stroke-width="6"/>
    <path d="${cejas}" stroke="${T}" stroke-width="${ancho}" stroke-linecap="round" fill="none"/>
    <g class="ojo"><ellipse cx="242" cy="124" rx="6" ry="8" fill="${T}"/></g>
    <path class="boca" d="${boca}" stroke="${T}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <g class="bocaAbierta" opacity="0" transform="translate(248 154)"><ellipse class="bocaForma" rx="12" ry="10" fill="${T}"/></g>`;
}

function teoPerfil() {
  const bota = (relleno) => `<path d="M180 640 L214 640 L216 688 Q250 692 254 712 L176 712 Z" fill="${relleno}" stroke="${T}" stroke-width="5" stroke-linejoin="round"/>`;
  const pierna = (oscura) => `<g class="pierna" data-cx="200" data-cy="470">${trazo('M200 470 L200 660', oscura ? '#2C2728' : C.pantalon, 22)}${bota(oscura ? C.botaSombra : C.bota)}</g>`;
  const brazo = (cerca) => `<g class="brazo" data-cx="200" data-cy="244">${trazo('M200 244 L202 396', cerca ? C.abrigo : C.abrigoSombra, 22)}
    <rect x="186" y="384" width="32" height="16" rx="4" fill="${C.abrigoSombra}" stroke="${T}" stroke-width="4"/>
    <ellipse cx="202" cy="414" rx="15" ry="17" fill="${T}"/>${cerca ? farol(204, 412, true) : ''}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 760" width="400" height="760"><g stroke-linejoin="round">
    ${brazo(false)}${pierna(true)}${pierna(false)}
    <path d="M164 232 Q200 220 236 232 L246 380 L258 512 L148 512 L158 380 Z" fill="${C.abrigo}" stroke="${T}" stroke-width="5"/>
    <path d="M200 228 L238 232 L226 276 Z" fill="${C.abrigoSombra}" stroke="${T}" stroke-width="4"/>
    <path d="M206 420 L246 418 L250 466 Q228 474 208 466 Z" fill="${C.abrigo}" stroke="${T}" stroke-width="4"/>
    <rect x="150" y="186" width="98" height="30" rx="15" fill="${C.bufanda}" stroke="${T}" stroke-width="4"/>
    <rect x="146" y="208" width="104" height="32" rx="16" fill="${C.bufanda}" stroke="${T}" stroke-width="4"/>
    <path d="M226 236 L252 238 L248 376 L224 374 Z" fill="${C.bufanda}" stroke="${T}" stroke-width="4"/>
    <path d="M234 244 V372 M242 244 V372" stroke="${C.bufandaSombra}" stroke-width="3"/>
    <path d="M226 376 v14 M234 376 v14 M242 376 v14" stroke="${C.bufanda}" stroke-width="4"/>
    ${brazo(true)}
    ${cabezaPerfil()}
    <path d="M196 46 Q186 24 172 18 M198 46 Q196 20 204 12 M200 46 Q212 30 224 28" stroke="${T}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g></svg>`;
}

function luciaPerfil() {
  const L = { jersey: '#24402B', jerseyOsc: '#1A3020', pantalon: '#6A4428', pantalonOsc: '#523420', raya: '#4E301A', zapa: '#F4F4F0', zapaOsc: '#D6D6CE', suela: '#BDBDB6' };
  const pierna = (osc) => `<g class="pierna" data-cx="200" data-cy="400">
    <path d="M182 396 L218 396 L228 684 L174 684 Z" fill="${osc ? L.pantalonOsc : L.pantalon}" stroke="${T}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M192 404 L188 680 M204 404 L206 680 M214 404 L220 680" stroke="${L.raya}" stroke-width="2.5"/>
    <path d="M168 680 L228 680 Q256 690 254 712 L164 712 Z" fill="${osc ? L.zapaOsc : L.zapa}" stroke="${T}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M164 704 H254" stroke="${L.suela}" stroke-width="6"/></g>`;
  const brazo = (cerca) => `<g class="brazo" data-cx="200" data-cy="236">${trazo('M200 236 L200 386', cerca ? L.jersey : L.jerseyOsc, 18)}
    <ellipse cx="200" cy="398" rx="14" ry="15" fill="#fff" stroke="${T}" stroke-width="4"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 760" width="400" height="760"><g stroke-linejoin="round">
    <path d="M150 70 C100 40 56 84 66 150 C72 200 46 230 26 242 C80 242 112 200 106 140 C104 102 128 84 160 88 Z" fill="${T}"/>
    ${brazo(false)}${pierna(true)}${pierna(false)}
    <path d="M168 226 Q200 216 232 226 L234 406 L166 406 Z" fill="${L.jersey}" stroke="${T}" stroke-width="5"/>
    <path d="M166 412 H234" stroke="${T}" stroke-width="4"/>
    <rect x="178" y="186" width="50" height="44" rx="8" fill="${L.jersey}" stroke="${T}" stroke-width="5"/>
    <path d="M188 192 v32 M198 192 v32 M208 192 v32 M218 192 v32" stroke="${L.jerseyOsc}" stroke-width="3"/>
    ${brazo(true)}
    ${cabezaPerfil({ boca: 'M234 154 L252 154', cejas: 'M220 98 Q238 92 258 100', ancho: 5 })}
    <ellipse cx="172" cy="52" rx="12" ry="7" fill="${T}"/>
    <circle cx="238" cy="126" r="24" fill="none" stroke="${T}" stroke-width="3"/><path d="M214 122 L160 114" stroke="${T}" stroke-width="3"/>
    <g transform="rotate(-50 160 110)"><rect x="130" y="104" width="56" height="12" fill="#E2B33C" stroke="${T}" stroke-width="3"/>
      <rect x="122" y="104" width="10" height="12" fill="#E79A9A" stroke="${T}" stroke-width="3"/><path d="M186 104 L200 110 L186 116 Z" fill="#F3D9A8" stroke="${T}" stroke-width="3"/></g>
  </g></svg>`;
}

module.exports = { teoPerfil, luciaPerfil };
