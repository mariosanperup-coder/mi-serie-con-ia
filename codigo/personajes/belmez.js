// Personajes del episodio 002: María (vecina de Bélmez, 1971) y el albañil.
const { figura, T } = require('./figura');
const NEGRO = '#1E1E1E', DELANTAL = '#F2EAD8';
const mono = (vista) => vista === 'perfil'
  ? `<path d="M196 50 Q150 40 130 90 Q124 130 150 160 L170 150 Q150 110 170 80 Q190 64 214 60 Z" fill="#3A2418"/><circle cx="130" cy="120" r="30" fill="#3A2418" stroke="${T}" stroke-width="4"/>`
  : `<path d="M126 110 Q120 40 200 40 Q280 40 274 110 Q250 74 200 72 Q150 74 126 110 Z" fill="#3A2418" stroke="${T}" stroke-width="4"/><circle cx="128" cy="120" r="28" fill="#3A2418" stroke="${T}" stroke-width="4"/>`;
const delantal = (vista) => vista === 'perfil'
  ? `<path d="M226 300 L246 300 L258 520 L232 520 Z" fill="${DELANTAL}" stroke="${T}" stroke-width="4"/><path d="M166 300 H240" stroke="${DELANTAL}" stroke-width="10"/>`
  : `<path d="M176 226 Q200 246 224 226" fill="none" stroke="#fff" stroke-width="4"/><path d="M156 300 H244 L262 520 H138 Z" fill="${DELANTAL}" stroke="${T}" stroke-width="4"/><path d="M140 300 H260" stroke="${DELANTAL}" stroke-width="10"/><path d="M180 228 L200 252 L220 228" fill="none" stroke="#fff" stroke-width="5"/>`;
const ropaMaria = { torso: NEGRO, pantalon: NEGRO, zapatos: '#2A2A2A', manos: '#fff', falda: NEGRO, largoChaqueta: 440 };
const cuchara = (x, y) => `<path d="M${x} ${y} L${x + 30} ${y - 120}" stroke="#7A4E2C" stroke-width="10" stroke-linecap="round"/><ellipse cx="${x + 32}" cy="${y - 128}" rx="10" ry="16" fill="#7A4E2C"/>`;

const maria = {
  depie: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: ropaMaria, pecho: delantal('frente'), cabeza: mono('frente') }),
  cocinando: (cara = 'serio') => figura({ vista: 'perfil', cara, ropa: ropaMaria, pecho: delantal('perfil'), cabeza: mono('perfil'), brazoDer: [[260, 320], [320, 300]], brazoIzq: [[240, 340], [300, 360]], delante: cuchara(318, 300) }),
  susto: (cara = 'sorpresa') => figura({ vista: 'frente', cara, ropa: ropaMaria, pecho: delantal('frente'), cabeza: mono('frente'), brazoIzq: [[120, 290], [140, 160]], brazoDer: [[280, 290], [260, 160]] }),
};

const gorra = (vista) => vista === 'perfil'
  ? `<path d="M128 80 Q140 30 210 30 Q262 34 270 70 L300 86 Q260 92 128 92 Z" fill="#6A5A48" stroke="${T}" stroke-width="5"/>`
  : `<path d="M118 84 Q120 26 200 26 Q280 26 282 84 Q240 70 200 70 Q160 70 118 84 Z" fill="#6A5A48" stroke="${T}" stroke-width="5"/><path d="M130 84 Q200 110 270 84" fill="none" stroke="${T}" stroke-width="5"/>`;
const ropaAlbanil = { torso: '#F4F2EC', pantalon: '#5E5E5E', zapatos: '#3A2A20', manos: '#151515', mangaCorta: true, largoChaqueta: 430 };
const paleta = (x, y, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-6" y="-40" width="12" height="40" rx="5" fill="#8A5A30" stroke="${T}" stroke-width="3"/><path d="M-30 0 H30 L0 70 Z" fill="#B8B8B0" stroke="${T}" stroke-width="4"/></g>`;
const cubo = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-40 0 H40 L32 80 H-32 Z" fill="#6A6E72" stroke="${T}" stroke-width="4"/><ellipse cx="0" cy="0" rx="40" ry="10" fill="#F2EEE6" stroke="${T}" stroke-width="3"/><path d="M-38 0 Q0 -60 38 0" fill="none" stroke="#9A9A9A" stroke-width="4"/></g>`;
const albanil = {
  depie: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: ropaAlbanil, cabeza: gorra('frente'), pecho: `<path d="M170 226 Q200 270 230 226" fill="none" stroke="${T}" stroke-width="4"/>`, delante: paleta(126, 440, 20) + cubo(276, 440) }),
  raspando: (cara = 'decidido') => figura({ vista: 'perfil', pose: 'arrodillado', cara, ropa: ropaAlbanil, cabeza: gorra('perfil'), brazoIzq: [[260, 330], [320, 420]], brazoDer: [[280, 360], [350, 600]], delante: paleta(356, 606, -60) }),
};

module.exports = { maria, albanil };
