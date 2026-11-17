// Personajes secundarios del episodio 001, construidos sobre figura().
const { figura, T } = require('./figura');

const AZUL = '#1F2A48', ORO = '#E0B040', OLIVA = '#4D5A33', OLIVA2 = '#3E4A28';

// ---------- Accesorios ----------
const gorraPiloto = (vista) => vista === 'perfil'
  ? `<path d="M130 76 Q140 30 214 28 Q262 32 262 64 L250 80 L136 84 Z" fill="${AZUL}" stroke="${T}" stroke-width="5"/>
     <path d="M136 70 L252 66 L252 82 L136 86 Z" fill="${ORO}" stroke="${T}" stroke-width="3"/>
     <path d="M230 80 Q280 78 300 96 L238 92 Z" fill="${T}"/>`
  : `<ellipse cx="200" cy="44" rx="104" ry="34" fill="${AZUL}" stroke="${T}" stroke-width="5"/>
     <path d="M130 52 H270 V84 H130 Z" fill="${AZUL}" stroke="${T}" stroke-width="5"/>
     <path d="M130 60 H270 V72 H130 Z" fill="${ORO}" stroke="${T}" stroke-width="3"/>
     <path d="M136 84 Q200 104 264 84 L262 96 Q200 114 138 96 Z" fill="${T}"/>`;

const bigote = (vista) => vista === 'perfil'
  ? `<path d="M234 140 Q246 132 262 140 Q252 148 234 146 Z" fill="${T}"/>`
  : `<path d="M174 142 Q186 130 200 138 Q214 130 226 142 Q214 148 200 142 Q186 148 174 142 Z" fill="${T}"/>`;

const auriculares = (vista) => vista === 'perfil'
  ? `<path d="M140 110 Q150 36 220 40" stroke="#222" stroke-width="12" fill="none"/>
     <rect x="160" y="100" width="34" height="54" rx="14" fill="#2A2A2A" stroke="${T}" stroke-width="4"/>
     <path d="M188 146 Q214 182 246 172" stroke="#222" stroke-width="5" fill="none"/><circle cx="248" cy="172" r="7" fill="#222"/>`
  : `<path d="M126 118 Q130 30 200 34 Q270 30 274 118" stroke="#222" stroke-width="12" fill="none"/>
     <rect x="108" y="100" width="34" height="56" rx="14" fill="#2A2A2A" stroke="${T}" stroke-width="4"/>
     <rect x="258" y="100" width="34" height="56" rx="14" fill="#2A2A2A" stroke="${T}" stroke-width="4"/>
     <path d="M272 150 Q262 176 232 172" stroke="#222" stroke-width="5" fill="none"/><circle cx="230" cy="172" r="7" fill="#222"/>`;

const casco = (vista) => vista === 'perfil'
  ? `<path d="M118 150 Q100 40 196 36 Q270 36 280 100 L246 104 Q230 70 196 74 Q160 80 160 150 Z" fill="#EDEBE4" stroke="${T}" stroke-width="5"/>
     <path d="M150 50 Q200 22 262 60 L250 80 Q200 54 160 74 Z" fill="#1E1E1E" stroke="${T}" stroke-width="4"/>
     <circle cx="148" cy="120" r="12" fill="#BDBAB0" stroke="${T}" stroke-width="3"/>
     <path d="M150 156 Q170 196 140 236" stroke="#4E4E44" stroke-width="12" fill="none" stroke-dasharray="6 3"/>`
  : `<path d="M112 160 Q96 40 200 36 Q304 40 288 160 L268 160 Q272 76 200 76 Q128 76 132 160 Z" fill="#EDEBE4" stroke="${T}" stroke-width="5"/>
     <path d="M134 60 Q200 20 266 60 L258 82 Q200 54 142 82 Z" fill="#1E1E1E" stroke="${T}" stroke-width="4"/>
     <circle cx="122" cy="130" r="10" fill="#BDBAB0" stroke="${T}" stroke-width="3"/><circle cx="278" cy="130" r="10" fill="#BDBAB0" stroke="${T}" stroke-width="3"/>`;

const peloBob = (vista) => vista === 'perfil'
  ? `<path d="M126 150 Q110 40 200 38 Q250 40 268 80 Q240 70 218 90 Q190 80 170 96 L170 170 Q150 176 126 150 Z" fill="#fff" stroke="${T}" stroke-width="5"/>`
  : `<path d="M118 172 Q96 40 200 36 Q304 40 282 172 L256 172 Q262 120 250 96 Q200 108 150 96 Q138 120 144 172 Z" fill="#fff" stroke="${T}" stroke-width="5"/>
     <path d="M156 98 V84 M180 102 V86 M204 104 V88 M228 102 V86 M248 98 V84" stroke="${T}" stroke-width="3"/>`;

// ---------- Torso ----------
const uniforme = (vista, galones) => {
  const g = (x, y) => Array.from({ length: galones }, (_, i) => `<path d="M${x - 14} ${y + i * 9} h28" stroke="${ORO}" stroke-width="5"/>`).join('');
  return vista === 'perfil'
    ? `<path d="M222 228 L236 228 L232 300 Z" fill="#fff" stroke="${T}" stroke-width="3"/><path d="M228 236 L232 290" stroke="${T}" stroke-width="6"/>
       <circle cx="226" cy="330" r="5" fill="${ORO}"/><circle cx="226" cy="380" r="5" fill="${ORO}"/>`
    : `<path d="M178 226 L200 290 L222 226 Z" fill="#fff" stroke="${T}" stroke-width="3"/><path d="M200 236 L194 280 L200 300 L206 280 Z" fill="${T}"/>
       <path d="M178 226 L200 300 L168 360 L150 236 Z M222 226 L200 300 L232 360 L250 236 Z" fill="${AZUL}" stroke="${T}" stroke-width="3" opacity="0.9"/>
       <circle cx="200" cy="340" r="5" fill="${ORO}"/><circle cx="200" cy="384" r="5" fill="${ORO}"/>
`;
};
// Galones dorados en los puños (de frente): van por delante de los brazos.
const galonesFrente = (n) => [126, 274].map(x => Array.from({ length: n }, (_, i) => `<path d="M${x - 13} ${398 - i * 9} h26" stroke="${ORO}" stroke-width="5"/>`).join('')).join('');
const arnes = (vista) => vista === 'perfil'
  ? `<path d="M190 232 L196 430 M166 380 H240" stroke="#5E5E52" stroke-width="10"/><rect x="186" y="368" width="20" height="22" fill="#A8A8A0" stroke="${T}" stroke-width="3"/>`
  : `<path d="M168 232 L176 430 M232 232 L224 430 M140 400 H260" stroke="#5E5E52" stroke-width="10"/>
     <rect x="188" y="388" width="24" height="24" fill="#A8A8A0" stroke="${T}" stroke-width="3"/><path d="M200 232 V380" stroke="${OLIVA2}" stroke-width="4"/>
     <rect x="150" y="300" width="32" height="34" fill="${OLIVA2}" stroke="${T}" stroke-width="3"/>`;
const camisaControlador = (vista) => vista === 'perfil'
  ? `<path d="M220 228 L236 228 L230 250 Z" fill="#fff" stroke="${T}" stroke-width="3"/><path d="M162 426 H240" stroke="#222" stroke-width="10"/>`
  : `<path d="M180 226 L200 252 L220 226" fill="none" stroke="${T}" stroke-width="4"/><path d="M200 252 V420" stroke="${T}" stroke-width="3"/>
     <rect x="214" y="280" width="30" height="30" fill="none" stroke="${T}" stroke-width="3"/><path d="M136 426 H264" stroke="#222" stroke-width="10"/><rect x="190" y="418" width="20" height="16" fill="#9A9A9A"/>`;
const rebeca = (vista) => vista === 'perfil'
  ? `<path d="M220 228 L238 230 L232 262 Z" fill="#F2EAD8" stroke="${T}" stroke-width="3"/><circle cx="232" cy="300" r="5" fill="${T}"/><circle cx="234" cy="350" r="5" fill="${T}"/>`
  : `<path d="M176 226 L200 262 L224 226 Z" fill="#F2EAD8" stroke="${T}" stroke-width="3"/><path d="M200 262 V420" stroke="${T}" stroke-width="3"/>
     <circle cx="200" cy="300" r="5" fill="${T}"/><circle cx="200" cy="340" r="5" fill="${T}"/><circle cx="200" cy="380" r="5" fill="${T}"/>`;

// ---------- Objetos de mano ----------
const microfono = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-16" y="-34" width="32" height="50" rx="12" fill="#4A4F3E" stroke="${T}" stroke-width="4"/>
  <path d="M-8 -22 h16 M-8 -14 h16 M-8 -6 h16" stroke="${T}" stroke-width="3"/>
  <path d="M0 16 q-10 16 4 22 q14 6 0 18 q-14 10 4 20 q16 8 0 20" stroke="#222" stroke-width="5" fill="none"/></g>`;
const cuernoMando = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 -50 V50" stroke="#222" stroke-width="20" stroke-linecap="round"/><path d="M-8 0 H40" stroke="#333" stroke-width="16"/></g>`;
const palanca = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-70" stroke="#2a2a2a" stroke-width="12"/><rect x="-12" y="-96" width="24" height="34" rx="8" fill="#333" stroke="${T}" stroke-width="3"/><circle cx="0" cy="-92" r="5" fill="#C0392B"/></g>`;
const cascoEnMano = (x, y) => `<g transform="translate(${x} ${y})"><circle r="56" fill="#EDEBE4" stroke="${T}" stroke-width="5"/><path d="M-40 -10 Q0 -44 40 -10 Q30 30 0 34 Q-30 30 -40 -10 Z" fill="#1E1E1E"/><path d="M0 34 q-10 30 10 60" stroke="#4E4E44" stroke-width="12" fill="none" stroke-dasharray="6 3"/></g>`;

// ---------- Personajes ----------
const ropaPiloto = { torso: AZUL, pantalon: '#1B2440', zapatos: '#111', manos: '#151515', largoChaqueta: 450 };

const comandante = {
  depie: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: ropaPiloto, pecho: uniforme('frente', 4), cabeza: gorraPiloto('frente') + bigote('frente'), delante: galonesFrente(4) }),
  mandos: (cara = 'serio') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: ropaPiloto, pecho: uniforme('perfil', 4),
    cabeza: gorraPiloto('perfil') + bigote('perfil'), brazoIzq: [[250, 320], [320, 316]], brazoDer: [[262, 330], [330, 330]], delante: cuernoMando(338, 322) }),
  radio: (cara = 'preocupado') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: ropaPiloto, pecho: uniforme('perfil', 4),
    cabeza: gorraPiloto('perfil') + bigote('perfil'), brazoIzq: [[240, 340], [300, 380]], brazoDer: [[262, 320], [262, 196]], delante: microfono(268, 196) }),
};
const copiloto = {
  depie: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: { ...ropaPiloto, manos: '#fff' }, pecho: uniforme('frente', 2), cabeza: auriculares('frente'), delante: galonesFrente(2) }),
  sentado: (cara = 'serio') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: { ...ropaPiloto, manos: '#fff' }, pecho: uniforme('perfil', 2), cabeza: auriculares('perfil'), brazoIzq: [[236, 360], [290, 420]], brazoDer: [[250, 370], [300, 420]] }),
  senala: (cara = 'sorpresa') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: { ...ropaPiloto, manos: '#fff' }, pecho: uniforme('perfil', 2), cabeza: auriculares('perfil'), brazoIzq: [[236, 360], [290, 420]], brazoDer: [[290, 250], [372, 236]] }),
};
const ropaCaza = { torso: OLIVA, pantalon: OLIVA, zapatos: '#151515', manos: '#151515', largoChaqueta: 460 };
const pilotoCaza = {
  depie: (cara = 'decidido') => figura({ vista: 'frente', cara, ropa: ropaCaza, pecho: arnes('frente'), brazoIzq: [[120, 320], [160, 360]], delante: cascoEnMano(130, 360) }),
  cabina: (cara = 'decidido') => figura({ vista: 'perfil', pose: 'sentado', silla: false, cara, ropa: ropaCaza, pecho: arnes('perfil'), cabeza: casco('perfil'), brazoIzq: [[236, 360], [290, 400]], brazoDer: [[250, 360], [300, 420]], delante: palanca(300, 470) }),
};
const controlador = {
  depie: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: { torso: '#A9C3E3', pantalon: '#26304A', manos: '#151515', mangaCorta: true, largoChaqueta: 430 }, pecho: camisaControlador('frente'), cabeza: auriculares('frente') }),
  sentado: (cara = 'serio') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: { torso: '#A9C3E3', pantalon: '#26304A', manos: '#151515', mangaCorta: true, largoChaqueta: 430 }, pecho: camisaControlador('perfil'), cabeza: auriculares('perfil'), brazoIzq: [[240, 340], [310, 360]], brazoDer: [[250, 350], [320, 370]] }),
  senala: (cara = 'grita') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: { torso: '#A9C3E3', pantalon: '#26304A', manos: '#151515', mangaCorta: true, largoChaqueta: 430 }, pecho: camisaControlador('perfil'), cabeza: auriculares('perfil'), brazoIzq: [[240, 340], [310, 360]], brazoDer: [[290, 260], [380, 250]] }),
};
const ropaControladora = { torso: '#C7AE8A', pantalon: '#151515', manos: '#151515', falda: '#5A4030', largoChaqueta: 440 };
const controladora = {
  depie: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: ropaControladora, pecho: rebeca('frente'), detrasCabeza: '', cabeza: peloBob('frente') + auriculares('frente') }),
  sentada: (cara = 'serio') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: ropaControladora, pecho: rebeca('perfil'), cabeza: peloBob('perfil') + auriculares('perfil'), brazoIzq: [[240, 340], [310, 360]], brazoDer: [[250, 350], [320, 370]] }),
  sorpresa: (cara = 'sorpresa') => figura({ vista: 'perfil', pose: 'sentado', cara, ropa: ropaControladora, pecho: rebeca('perfil'), cabeza: peloBob('perfil') + auriculares('perfil'), brazoIzq: [[240, 340], [310, 360]], brazoDer: [[270, 320], [250, 250]] }),
};

module.exports = { comandante, copiloto, pilotoCaza, controlador, controladora };
