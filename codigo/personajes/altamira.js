// 006 · Altamira: Marcelino Sanz de Sautuola, su hija María (niña), el cazador Modesto Cubillas con su perro y los académicos escépticos.
const { figura, T } = require('./figura');
const bombin = `<path d="M118 82 Q200 64 282 82 Q294 96 280 100 Q200 88 120 100 Q106 96 118 82 Z" fill="#3A2A1E" stroke="${T}" stroke-width="5"/><path d="M140 84 Q140 18 200 16 Q260 18 260 84 Z" fill="#3A2A1E" stroke="${T}" stroke-width="5"/><path d="M142 72 H258" stroke="#1A120A" stroke-width="8"/>`;
const barbaOscura = `<path d="M134 140 Q136 206 200 214 Q264 206 266 140 Q248 176 200 178 Q152 176 134 140 Z" fill="#2A1E16" stroke="${T}" stroke-width="4"/><path d="M168 152 Q184 138 200 148 Q216 138 232 152 Q216 162 200 156 Q184 162 168 152 Z" fill="#2A1E16"/>`;
const chaleco = `<path d="M176 226 L200 250 L224 226" fill="#F2F2F2" stroke="${T}" stroke-width="4"/><path d="M188 232 L200 252 L212 232 Z" fill="#1A1A1A"/><path d="M164 240 L200 300 L236 240 L240 420 H160 Z" fill="#4A3628" stroke="${T}" stroke-width="4"/>
  ${[310, 350, 390].map(y => `<circle cx="200" cy="${y}" r="5" fill="#C89A3A"/>`).join('')}<path d="M150 232 L194 304 L186 470 M250 232 L206 304 L214 470" stroke="${T}" stroke-width="4" fill="none"/>`;
const candil = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-24 0 h48 v-10 h-48 z" fill="#B88A3A" stroke="${T}" stroke-width="3"/><path d="M-18 -10 Q-24 -60 0 -66 Q24 -60 18 -10 Z" fill="#FFE3A0" opacity="0.7" stroke="#B88A3A" stroke-width="4"/>
  <path d="M0 -22 q-9 -16 0 -30 q9 14 0 30" fill="#FFB040"/><circle cy="-30" r="70" fill="#FFC066" opacity="0.18"/></g>`;
const ropaMarcelino = { torso: '#3A2A1E', pantalon: '#3A3028', zapatos: '#1A120A', manos: '#fff', largoChaqueta: 520 };
const marcelino = {
  // Mira al suelo con el candil bajo.
  suelo: () => figura({ vista: 'frente', cara: 'serio', ropa: ropaMarcelino, pecho: chaleco, cabeza: bombin + barbaOscura, brazoDer: [[262, 340], [246, 440]], delante: candil(246, 450) }),
  // Candil en alto, mirando arriba asombrado.
  arriba: () => figura({ vista: 'frente', cara: 'sorpresa', ropa: ropaMarcelino, pecho: chaleco, cabeza: bombin + barbaOscura, brazoDer: [[300, 260], [300, 190]], delante: candil(300, 200) }),
  perfil: () => figura({ vista: 'perfil', cara: 'serio', ropa: ropaMarcelino, pecho: `<path d="M220 228 L236 232 L230 250 Z" fill="#fff" stroke="${T}" stroke-width="3"/>`, cabeza: bombin.replace(/118 82|282 82/g, m => m) + `<path d="M222 150 Q236 206 196 210 Q186 180 190 160 Z" fill="#2A1E16" stroke="${T}" stroke-width="4"/>`, brazoDer: [[236, 330], [270, 400]], delante: candil(270, 410) }),
};
// María: niña de unos 8 años → se dibuja con la caja de adulto y se coloca a escala 0,65 del adulto.
const trenzas = `<path d="M128 110 Q120 40 200 38 Q280 40 272 110 Q260 70 200 70 Q140 70 128 110 Z" fill="#3A2416" stroke="${T}" stroke-width="4"/>
  ${[[126, 1], [274, -1]].map(([x, l]) => `<path d="M${x} 120 q${-14 * l} 40 0 80 q${14 * l} 40 0 80" stroke="#3A2416" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${x - 14} 286 l14 -10 l14 10 l-14 10 z" fill="#F2F2F2" stroke="${T}" stroke-width="3"/>`).join('')}`;
const delantal = `<path d="M176 226 Q200 240 224 226" fill="none" stroke="#F2F2F2" stroke-width="10"/><path d="M160 260 H240 L246 520 H154 Z" fill="#F2EEE2" stroke="${T}" stroke-width="4"/><path d="M154 330 H246" stroke="#D8D0C0" stroke-width="6"/>`;
const ropaMaria = { torso: '#8AA8C8', pantalon: '#2A2A2A', zapatos: '#5A3A22', manos: '#fff', largoChaqueta: 430, falda: '#8AA8C8' };
const maria = {
  normal: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: ropaMaria, pecho: delantal, detrasCabeza: '', cabeza: trenzas }),
  senala: () => figura({ vista: 'frente', cara: 'sorpresa', ropa: ropaMaria, pecho: delantal, cabeza: trenzas, brazoDer: [[296, 230], [330, 150]] }),
};
// Cazador (Modesto Cubillas): boina, chaqueta marrón, pañuelo y faja rojos, botas, escopeta al hombro.
const boina = `<ellipse cx="190" cy="54" rx="104" ry="36" fill="#1E1E22" stroke="${T}" stroke-width="5"/><path d="M190 18 v-14" stroke="${T}" stroke-width="6"/>`;
const pechoCazador = `<path d="M170 226 L200 262 L230 226 L214 280 L200 262 L186 280 Z" fill="#B8342A" stroke="${T}" stroke-width="4"/><rect x="140" y="380" width="120" height="44" fill="#A0302A" stroke="${T}" stroke-width="4"/>
  <path d="M150 232 L190 300 L184 470 M250 232 L210 300 L216 470" stroke="${T}" stroke-width="4" fill="none"/>`;
const escopeta = `<g transform="translate(150 250) rotate(-34)"><rect x="-120" y="-8" width="300" height="12" fill="#3A3A3A" stroke="${T}" stroke-width="3"/><path d="M-120 -10 L-220 -4 Q-236 10 -220 28 L-110 10 Z" fill="#7A4A22" stroke="${T}" stroke-width="4"/></g>`;
const cazador = () => figura({ vista: 'frente', cara: 'decidido', ropa: { torso: '#7A4E2A', pantalon: '#2A2420', zapatos: '#151515', manos: '#fff', largoChaqueta: 470 }, pecho: pechoCazador, cabeza: boina,
  brazoIzq: [[112, 320], [118, 262]], brazoDer: [[296, 360], [262, 420]], detrasCabeza: escopeta });
// Perro sentado (caja 260 x 300), mirando a la derecha; sombra en los pies a y≈290.
const perro = (cara = 'serio') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 300" width="260" height="300"><g stroke="${T}" stroke-width="5" stroke-linejoin="round">
  <path d="M30 280 Q10 240 40 230" fill="none" stroke-width="10" stroke-linecap="round"/><path d="M40 160 Q40 290 70 290 H180 Q190 250 160 200 Q150 150 130 140 Z" fill="#8A5A30"/>
  <path d="M120 290 V220 M150 290 V214" stroke-width="4"/><path d="M110 290 h40 M140 290 h36" stroke-width="6"/>
  <ellipse cx="150" cy="90" rx="70" ry="62" fill="#8A5A30"/><path d="M190 90 Q240 92 232 124 Q220 140 186 128 Z" fill="#A87A4A"/><ellipse cx="230" cy="102" rx="12" ry="9" fill="#151515"/>
  <path d="M100 60 Q60 70 70 170 Q100 160 120 100 Z" fill="#6A4222"/><path d="M110 152 Q150 170 190 150" stroke="#A0302A" stroke-width="14" fill="none"/><circle cx="150" cy="172" r="10" fill="#E8C060"/>
  <g class="ojo"><ellipse cx="176" cy="80" rx="6" ry="8" fill="${T}" stroke="none"/></g>${cara === 'sorpresa' ? '<path d="M160 56 q16 -10 30 0" fill="none" stroke-width="6"/>' : '<path d="M160 64 L192 70" stroke-width="6"/>'}</g></svg>`;
// Académico escéptico: chistera, barba blanca (redonda o larga), levita negra, brazos cruzados.
const chistera = `<path d="M110 70 Q200 54 290 70 Q300 86 288 90 Q200 76 112 90 Q100 86 110 70 Z" fill="#151515" stroke="${T}" stroke-width="4"/><path d="M140 72 L134 -40 Q200 -52 266 -40 L260 72 Z" fill="#151515" stroke="${T}" stroke-width="5"/><path d="M140 52 H260" stroke="#3A3A3A" stroke-width="12"/>`;
const barbaBlanca = larga => larga
  ? `<path d="M140 150 Q150 196 200 330 Q250 196 260 150 Q236 176 200 176 Q164 176 140 150 Z" fill="#F2F2F2" stroke="${T}" stroke-width="4"/><path d="M180 200 L200 300 M216 200 L206 290" stroke="#C8C8C8" stroke-width="4"/>`
  : `<path d="M126 130 Q110 160 130 196 Q150 240 200 244 Q250 240 270 196 Q290 160 274 130 Q260 176 200 178 Q140 176 126 130 Z" fill="#F2F2F2" stroke="${T}" stroke-width="4"/>`;
const levita = `<path d="M176 226 L200 252 L224 226" fill="#F2F2F2" stroke="${T}" stroke-width="4"/><path d="M164 240 L200 300 L236 240 L240 430 H160 Z" fill="#2A2A2A" stroke="${T}" stroke-width="4"/>`;
const academico = (larga, cara = 'decidido') => figura({ vista: 'frente', cara, ropa: { torso: '#151515', pantalon: '#151515', zapatos: '#151515', manos: '#fff', largoChaqueta: 560 }, pecho: levita,
  cabeza: chistera + barbaBlanca(larga), brazoIzq: [[150, 330], [250, 320]], brazoDer: [[250, 340], [150, 330]] });
module.exports = { marcelino, maria, cazador, perro, academico };
