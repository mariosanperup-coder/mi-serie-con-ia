// 005 · El Dioni (vigilante de 1989) y policías brasileños. También el furgón blindado y el coche.
const { figura, T } = require('./figura');
const AZUL_CLARO = '#A9C3E3', MARINO = '#1E2A44';
const gorra = (vista) => vista === 'perfil'
  ? `<path d="M126 84 Q134 30 204 28 Q258 32 266 70 L300 84 Q270 94 126 96 Z" fill="${MARINO}" stroke="${T}" stroke-width="5"/><path d="M200 44 l10 12 l-10 12 l-10 -12 z" fill="#E8C060"/>`
  : `<ellipse cx="200" cy="52" rx="100" ry="30" fill="${MARINO}" stroke="${T}" stroke-width="5"/><path d="M130 60 H270 V86 H130 Z" fill="${MARINO}" stroke="${T}" stroke-width="5"/><path d="M134 76 H266" stroke="#E8C060" stroke-width="5"/>
     <path d="M200 30 l14 16 l-14 16 l-14 -16 z" fill="#E8C060" stroke="${T}" stroke-width="2"/><path d="M136 86 Q200 106 264 86 L262 98 Q200 116 138 98 Z" fill="${T}"/>`;
const bigoteGafas = (vista) => vista === 'perfil'
  ? `<path d="M230 142 Q248 130 266 144 Q250 152 230 148 Z" fill="${T}"/><circle cx="240" cy="122" r="18" fill="#BFD8E8" opacity="0.5" stroke="#C9A040" stroke-width="3"/>`
  : `<path d="M168 144 Q184 128 200 140 Q216 128 232 144 Q218 156 200 148 Q182 156 168 144 Z" fill="${T}"/>
     <path d="M138 112 H190 Q192 142 166 142 Q140 140 138 112 Z M210 112 H262 Q260 140 234 142 Q208 142 210 112 Z" fill="#BFD8E8" opacity="0.55" stroke="#C9A040" stroke-width="3"/><path d="M190 116 H210" stroke="#C9A040" stroke-width="3"/>`;
const peloOscuro = `<path d="M124 120 Q118 90 132 80 L132 120 Z M276 120 Q282 90 268 80 L268 120 Z" fill="#2A2018"/>`;
const camisaCorbata = `<path d="M176 226 L200 250 L224 226" fill="none" stroke="${T}" stroke-width="4"/><path d="M200 248 L190 262 L196 370 L200 380 L204 370 L210 262 Z" fill="${MARINO}" stroke="${T}" stroke-width="3"/>
  <rect x="216" y="276" width="40" height="16" fill="#2A2A2A"/><path d="M136 424 H264" stroke="#151515" stroke-width="12"/><rect x="188" y="416" width="24" height="18" fill="#9A9A9A"/>`;
const ropaVig = { torso: AZUL_CLARO, pantalon: '#1E2230', zapatos: '#151515', manos: '#fff', mangaCorta: true, largoChaqueta: 430 };
const saca = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-12 -40 q-6 14 0 24 Q-62 0 -58 60 Q-50 100 0 102 Q50 100 58 60 Q62 0 12 -16 q6 -10 0 -24 Z" fill="#D9C08A" stroke="${T}" stroke-width="5"/>
  <path d="M-14 -20 q14 8 28 0" stroke="#8A6A3A" stroke-width="5" fill="none"/><text x="0" y="66" text-anchor="middle" font-family="Inter" font-weight="900" font-size="56" fill="${T}">$</text></g>`;
const hawaiana = `<path d="M176 226 L200 262 L224 226" fill="none" stroke="${T}" stroke-width="4"/>${[[160, 270], [230, 300], [170, 350], [240, 380], [196, 410], [150, 400], [250, 250]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="12" fill="#F2C640"/><circle cx="12" r="8" fill="#F2C640"/><circle cx="-12" r="8" fill="#F2C640"/><circle r="5" fill="#E07A2A"/></g>`).join('')}
  ${[[190, 300], [210, 360], [150, 330]].map(([x, y]) => `<path d="M${x} ${y} q12 -14 24 0 q-12 10 -24 0" fill="#3E8A3A"/>`).join('')}`;
const peluca = `<path d="M114 200 Q70 100 130 50 Q200 0 270 50 Q330 100 286 200 Q300 260 260 270 Q276 200 250 150 Q220 90 200 96 Q160 90 140 160 Q124 220 140 270 Q100 260 114 200 Z" fill="#F2C860" stroke="${T}" stroke-width="5"/>
  ${[150, 180, 220, 250].map(x => `<path d="M${x} 70 q-14 60 -6 140" stroke="#D8A840" stroke-width="5" fill="none"/>`).join('')}`;
const gafasSol = `<path d="M140 110 H192 Q194 140 168 140 Q142 138 140 110 Z M208 110 H260 Q258 138 232 140 Q206 140 208 110 Z" fill="#151515"/><path d="M192 114 H208" stroke="#151515" stroke-width="5"/>`;
const coctel = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-26 -60 H26 L4 -10 V30 H-4 V-10 Z" fill="#F29A3A" stroke="${T}" stroke-width="4" opacity="0.9"/><path d="M-20 34 H20" stroke="${T}" stroke-width="5"/>
  <circle cx="24" cy="-60" r="12" fill="#F2C640" stroke="${T}" stroke-width="3"/><path d="M-6 -60 l-20 -40" stroke="#E0442E" stroke-width="4"/><path d="M-40 -100 q14 -14 28 0 z" fill="#E0607A"/></g>`;
const esposas = `<g transform="translate(200 410)"><circle cx="-20" r="16" fill="none" stroke="#A8A8A8" stroke-width="7"/><circle cx="20" r="16" fill="none" stroke="#A8A8A8" stroke-width="7"/><path d="M-4 0 H4" stroke="#A8A8A8" stroke-width="6"/></g>`;

const peloCorto = `<path d="M118 110 Q112 40 200 34 Q288 40 282 110 Q270 70 200 66 Q130 70 118 110 Z" fill="#2A2018" stroke="${T}" stroke-width="4"/>`;
const traje = `<path d="M176 226 L200 262 L224 226" fill="#F2F2F2" stroke="${T}" stroke-width="4"/><path d="M200 258 L192 270 L197 360 L200 368 L203 360 L208 270 Z" fill="#C0392B" stroke="${T}" stroke-width="3"/>
  <path d="M150 230 L196 300 L190 440 M250 230 L204 300 L210 440" stroke="${T}" stroke-width="4" fill="none"/>`;
const microMano = `<g transform="translate(286 268)"><rect x="-8" y="0" width="16" height="70" rx="6" fill="#2A2A2A" stroke="${T}" stroke-width="3"/><circle cy="-6" r="18" fill="#6A6A6A" stroke="${T}" stroke-width="4"/></g>`;
const dioni = {
  plato: (cara = 'contento') => figura({ vista: 'frente', cara, ropa: { torso: '#3A3A44', pantalon: '#3A3A44', zapatos: '#151515', manos: '#fff', largoChaqueta: 450 }, pecho: traje,
    cabeza: peloCorto + bigoteGafas('frente').replace('#BFD8E8', '#E8D8A8'), brazoDer: [[284, 330], [286, 300]], delante: microMano }),
  uniforme: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: ropaVig, pecho: camisaCorbata, cabeza: peloOscuro + gorra('frente') + bigoteGafas('frente') }),
  mirando: () => figura({ vista: 'perfil', cara: 'preocupado', ropa: ropaVig, pecho: `<path d="M220 228 L236 232 L230 250 Z" fill="#fff" stroke="${T}" stroke-width="3"/><path d="M162 424 H240" stroke="#151515" stroke-width="12"/>`, cabeza: gorra('perfil') + bigoteGafas('perfil') }),
  sacas: (cara = 'decidido') => figura({ vista: 'frente', cara, ropa: ropaVig, pecho: camisaCorbata, cabeza: peloOscuro + gorra('frente') + bigoteGafas('frente'), brazoIzq: [[124, 330], [110, 430]], brazoDer: [[276, 330], [290, 430]], delante: saca(100, 470) + saca(300, 470) }),
  playa: () => figura({ vista: 'frente', cara: 'contento', ropa: { torso: '#D8442E', pantalon: '#2E4A7A', zapatos: '#E8DCC8', manos: '#fff', mangaCorta: true, largoChaqueta: 420 }, pecho: hawaiana,
    detrasCabeza: peluca, cabeza: gafasSol + `<path d="M168 150 Q184 136 200 146 Q216 136 232 150 Q218 160 200 154 Q182 160 168 150 Z" fill="${T}"/>`, brazoDer: [[280, 300], [300, 250]], delante: coctel(300, 250) }),
  esposado: () => figura({ vista: 'frente', cara: 'sorpresa', ropa: { torso: '#D8442E', pantalon: '#2E4A7A', zapatos: '#E8DCC8', manos: '#fff', mangaCorta: true, largoChaqueta: 420 }, pecho: hawaiana,
    detrasCabeza: peluca, cabeza: gafasSol, brazoIzq: [[150, 340], [186, 410]], brazoDer: [[250, 340], [214, 410]], delante: esposas }),
};

const gorraPM = `<ellipse cx="200" cy="50" rx="104" ry="30" fill="#1E2A50" stroke="${T}" stroke-width="5"/><path d="M128 58 H272 V86 H128 Z" fill="#1E2A50" stroke="${T}" stroke-width="5"/>
  <circle cx="200" cy="54" r="20" fill="#E8C060" stroke="${T}" stroke-width="3"/><path d="M200 42 l4 9 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -1 z" fill="#1E2A50"/><path d="M134 86 Q200 106 266 86 L264 98 Q200 116 136 98 Z" fill="${T}"/>`;
const uniformePM = `<path d="M176 226 L200 252 L224 226" fill="none" stroke="${T}" stroke-width="4"/><rect x="150" y="270" width="40" height="34" fill="none" stroke="${T}" stroke-width="3"/><rect x="210" y="270" width="40" height="34" fill="none" stroke="${T}" stroke-width="3"/>
  <rect x="214" y="246" width="30" height="16" fill="#151515"/><text x="229" y="259" text-anchor="middle" font-family="Inter" font-weight="900" font-size="12" fill="#fff">PM</text><path d="M136 424 H264" stroke="#151515" stroke-width="14"/><rect x="250" y="420" width="20" height="44" fill="#151515"/>`;
const policia = (bigote, esposasEnMano) => figura({ vista: 'frente', cara: 'decidido', ropa: { torso: '#1E2A50', pantalon: '#1E2A50', zapatos: '#151515', manos: '#151515', mangaCorta: true, largoChaqueta: 430 }, pecho: uniformePM,
  cabeza: gorraPM + (bigote ? `<path d="M168 146 Q184 130 200 140 Q216 130 232 146 Q218 158 200 150 Q182 158 168 146 Z" fill="${T}"/>` : ''),
  delante: esposasEnMano ? `<g transform="translate(126 470)"><circle cy="0" r="18" fill="none" stroke="#A8A8A8" stroke-width="7"/><circle cy="44" r="18" fill="none" stroke="#A8A8A8" stroke-width="7"/><path d="M0 18 V26" stroke="#A8A8A8" stroke-width="6"/></g>` : '' });

// Furgón blindado (caja 900 x 460), de perfil mirando a la derecha.
function furgon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 460" width="900" height="460"><g stroke="${T}" stroke-linejoin="round">
    <path d="M20 60 H610 V380 H20 Z" fill="#8A9098" stroke-width="7"/>${[150, 280, 410, 540].map(x => `<path d="M${x} 70 V370" stroke="#6A7078" stroke-width="5"/>`).join('')}
    ${[40, 590].map(x => Array.from({ length: 8 }, (_, i) => `<circle cx="${x}" cy="${90 + i * 38}" r="5" fill="#5A6068" stroke="none"/>`).join('')).join('')}
    <rect x="20" y="200" width="590" height="40" fill="#2E4A7A" stroke-width="4"/><rect x="60" y="100" width="70" height="40" rx="6" fill="#3A4048" stroke-width="4"/>
    <path d="M610 120 H760 Q820 130 850 220 L880 260 V380 H610 Z" fill="#9AA0A8" stroke-width="7"/>
    <path d="M630 140 H750 Q790 150 812 220 H630 Z" fill="#9FC6DE" stroke-width="5"/><rect x="630" y="140" width="80" height="80" fill="#9FC6DE" stroke-width="5"/>
    <rect x="820" y="270" width="64" height="40" rx="6" fill="#E8E2C8" stroke-width="4"/><rect x="600" y="370" width="290" height="30" rx="8" fill="#3A3E42" stroke-width="5"/><rect x="10" y="370" width="200" height="30" rx="8" fill="#3A3E42" stroke-width="5"/>
    ${[150, 720].map(x => `<circle cx="${x}" cy="390" r="66" fill="#1A1A1A" stroke-width="7"/><circle cx="${x}" cy="390" r="28" fill="#8A8A8A" stroke-width="5"/>`).join('')}
  </g></svg>`;
}
// Coche de los 80 (caja 760 x 320), berlina de perfil mirando a la derecha.
function coche() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 320" width="760" height="320"><g stroke="${T}" stroke-linejoin="round">
    <path d="M20 170 L60 130 H210 L290 60 H520 L600 130 H720 Q750 140 750 180 V240 H20 Z" fill="#C8B070" stroke-width="7"/>
    <path d="M300 74 H410 V130 H230 Z M430 74 H510 L580 130 H430 Z" fill="#9FC6DE" stroke-width="5"/><path d="M420 70 V240" stroke-width="5"/>
    <rect x="700" y="160" width="46" height="24" fill="#F2E6C8" stroke-width="3"/><rect x="20" y="160" width="30" height="24" fill="#C0392B" stroke-width="3"/><path d="M20 200 H750" stroke="#8A7A4A" stroke-width="6"/>
    ${[160, 600].map(x => `<circle cx="${x}" cy="240" r="58" fill="#1A1A1A" stroke-width="7"/><circle cx="${x}" cy="240" r="24" fill="#9A9A9A" stroke-width="5"/>`).join('')}
  </g></svg>`;
}
// Maletero abierto del coche (para meter las sacas)
// Compañeros del furgón: mismo uniforme, sin bigote ni gafas (uno con pelo canoso).
const compa = (canoso, vista = 'frente') => figura({ vista, cara: 'serio', ropa: ropaVig, pecho: vista === 'frente' ? camisaCorbata : `<path d="M162 424 H240" stroke="#151515" stroke-width="12"/>`,
  cabeza: (vista === 'frente' && canoso ? `<path d="M124 120 Q118 90 132 80 L132 120 Z M276 120 Q282 90 268 80 L268 120 Z" fill="#B8B8B8"/>` : '') + gorra(vista) });
module.exports = { compa, dioni, policia, furgon, coche, saca };
