// Monigote genérico y configurable: sirve para el comandante, el copiloto, el piloto del caza,
// los controladores y el elenco de cada episodio. Caja de 400 x 760, misma escala que Teo y Lucía.
//
// opciones:
//   vista: 'frente' | 'perfil' (el perfil mira a la derecha)
//   pose: 'depie' | 'sentado'
//   cara: 'serio' | 'preocupado' | 'sorpresa' | 'grita' | 'decidido'
//   ropa: { torso, mangas, pantalon, zapatos, manos, largoChaqueta, mangaCorta, falda }
//   brazoIzq / brazoDer: [[codoX, codoY], [manoX, manoY]] (coordenadas absolutas de la caja)
//   cabeza: svg extra por encima de la cabeza (gorra, casco, auriculares, pelo)
//   detrasCabeza: svg por detrás de la cabeza (pelo largo, casco trasero)
//   pecho: svg extra encima del torso (corbata, botones, arneses)
//   delante: svg extra por delante de todo (objeto en la mano)
//   silla: true para dibujar el asiento (solo sentado)
const T = '#151515';

const CARAS = {
  frente: {
    serio:      { cejas: 'M148 98 L184 108 M216 108 L252 98', ojos: 'normal', boca: 'M186 150 L214 150' },
    decidido:   { cejas: 'M148 94 L186 110 M214 110 L252 94', ojos: 'normal', boca: 'M184 152 L216 150' },
    preocupado: { cejas: 'M150 104 L184 94 M216 94 L250 104', ojos: 'normal', boca: 'M186 154 q7 -6 14 0 q7 6 14 0' },
    sorpresa:   { cejas: 'M150 90 Q166 80 182 86 M218 86 Q234 80 250 90', ojos: 'grandes', boca: 'O' },
    grita:      { cejas: 'M148 96 L184 106 M216 106 L252 96', ojos: 'grandes', boca: 'G' },
  },
  perfil: {
    serio:      { cejas: 'M222 100 L254 108', ojo: [240, 124], boca: 'M232 152 L254 150' },
    decidido:   { cejas: 'M220 96 L256 110', ojo: [240, 126], boca: 'M230 152 L256 150' },
    preocupado: { cejas: 'M222 108 L254 96', ojo: [240, 124], boca: 'M232 154 q6 -5 12 0 q6 5 12 0' },
    sorpresa:   { cejas: 'M222 92 Q238 82 254 90', ojo: [240, 122], boca: 'O' },
    grita:      { cejas: 'M220 98 L254 106', ojo: [240, 122], boca: 'G' },
  },
};

function cara(vista, nombre) {
  const c = CARAS[vista][nombre] || CARAS[vista].serio;
  let s = `<path d="${c.cejas}" stroke="${T}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  if (vista === 'frente') {
    s += '<g class="ojo">' + (c.ojos === 'grandes'
      ? `<circle cx="168" cy="124" r="13" fill="#fff" stroke="${T}" stroke-width="4"/><circle cx="232" cy="124" r="13" fill="#fff" stroke="${T}" stroke-width="4"/><circle cx="168" cy="125" r="5" fill="${T}"/><circle cx="232" cy="125" r="5" fill="${T}"/>`
      : `<ellipse cx="168" cy="124" rx="6" ry="8" fill="${T}"/><ellipse cx="232" cy="124" rx="6" ry="8" fill="${T}"/>`) + '</g>';
    if (c.boca === 'O') s += `<ellipse cx="200" cy="156" rx="8" ry="10" fill="${T}"/>`;
    else if (c.boca === 'G') s += `<path d="M180 146 Q200 140 220 146 Q216 178 200 178 Q184 178 180 146 Z" fill="${T}"/><path d="M188 168 Q200 162 212 168" stroke="#C0504D" stroke-width="5" fill="none"/>`;
    else s += `<path d="${c.boca}" stroke="${T}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  } else {
    const [x, y] = c.ojo;
    s += `<g class="ojo"><ellipse cx="${x}" cy="${y}" rx="6" ry="8" fill="${T}"/></g>`;
    if (c.boca === 'O') s += `<ellipse cx="246" cy="156" rx="7" ry="9" fill="${T}"/>`;
    else if (c.boca === 'G') s += `<path d="M230 148 L262 144 Q258 176 244 176 Q232 174 230 148 Z" fill="${T}"/>`;
    else s += `<path d="${c.boca}" stroke="${T}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}

const trazo = (d, color, ancho) => `<path d="${d}" fill="none" stroke="${T}" stroke-width="${ancho + 8}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round"/>`;
const palo = (d) => `<path d="${d}" fill="none" stroke="${T}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;

function silla() {
  return `<g stroke="${T}" stroke-width="5" stroke-linejoin="round">
    <path d="M96 230 Q100 210 130 212 L176 216 Q186 220 186 240 L184 470 L106 470 Z" fill="#3E4250"/>
    <path d="M100 450 H350 Q362 452 360 470 L356 500 H104 Z" fill="#4A4F60"/>
    <rect x="214" y="500" width="30" height="140" fill="#55585F"/>
    <path d="M150 650 H310 L300 636 H160 Z" fill="#55585F"/></g>`;
}

function figura(o = {}) {
  const vista = o.vista || 'frente', sentado = o.pose === 'sentado';
  const r = Object.assign({ torso: '#2B3A5C', mangas: null, pantalon: '#2B2B33', zapatos: '#151515', manos: '#151515', largoChaqueta: 440 }, o.ropa || {});
  const mangas = r.mangas || r.torso;
  const perfil = vista === 'perfil';
  // Hombros y caderas
  const hI = perfil ? [196, 236] : [150, 238], hD = perfil ? [206, 236] : [250, 238];
  const cad = 430;
  const bI = o.brazoIzq || (perfil ? [[196, 330], [204, 420]] : [[130, 330], [126, 420]]);
  const bD = o.brazoDer || (perfil ? [[210, 330], [216, 420]] : [[270, 330], [274, 420]]);
  const brazo = (h, [c, m]) => `M${h[0]} ${h[1]} L${c[0]} ${c[1]} L${m[0]} ${m[1]}`;
  const dibBrazo = (h, b) => {
    if (r.mangaCorta) { const mx = h[0] + (b[0][0] - h[0]) * 0.55, my = h[1] + (b[0][1] - h[1]) * 0.55;
      return trazo(`M${h[0]} ${h[1]} L${mx} ${my}`, mangas, 26) + palo(`M${mx} ${my} L${b[0][0]} ${b[0][1]} L${b[1][0]} ${b[1][1]}`); }
    return trazo(brazo(h, b), mangas, 20);
  };
  const mano = ([, m]) => `<ellipse cx="${m[0]}" cy="${m[1] + 6}" rx="14" ry="16" fill="${r.manos}" stroke="${T}" stroke-width="4"/>`;
  // Piernas
  let piernas;
  if (sentado) {
    const pie = (x) => `<path d="M${x - 16} 640 h48 q12 0 12 14 v8 h-60 z" fill="${r.zapatos}" stroke="${T}" stroke-width="4"/>`;
    piernas = `<g class="pierna sentada" data-cx="316" data-cy="446">${(r.falda ? palo('M200 432 L318 446 L320 636') : trazo('M196 432 L316 446 L318 632', r.pantalon, 24)) + pie(318)}</g>`;
  } else if (perfil) {
    const zap = x => `<path d="M${x - 22} 680 h44 q20 2 20 18 v6 h-64 z" fill="${r.zapatos}" stroke="${T}" stroke-width="4"/>`;
    piernas = `<g class="pierna" data-cx="196" data-cy="432">${(r.falda ? palo('M198 520 L196 690') : trazo('M196 432 L194 684', r.pantalon, 24)) + zap(196)}</g>`
      + `<g class="pierna" data-cx="206" data-cy="432">${(r.falda ? palo('M206 520 L210 690') : trazo('M206 432 L210 684', r.pantalon, 24)) + zap(210)}</g>`;
  } else {
    piernas = `<g class="pierna" data-cx="176" data-cy="432">${(r.falda ? palo('M182 520 L178 690') : trazo('M176 432 L172 684', r.pantalon, 26))}<ellipse cx="164" cy="696" rx="34" ry="16" fill="${r.zapatos}" stroke="${T}" stroke-width="4"/></g>`
      + `<g class="pierna" data-cx="224" data-cy="432">${(r.falda ? palo('M218 520 L222 690') : trazo('M224 432 L228 684', r.pantalon, 26))}<ellipse cx="236" cy="696" rx="34" ry="16" fill="${r.zapatos}" stroke="${T}" stroke-width="4"/></g>`;
  }
  const falda = r.falda ? (perfil || sentado ? `<path d="M168 420 L240 420 L${sentado ? 300 : 250} 530 L${sentado ? 190 : 156} 530 Z" fill="${r.falda}" stroke="${T}" stroke-width="5"/>` : `<path d="M150 420 L250 420 L268 530 L132 530 Z" fill="${r.falda}" stroke="${T}" stroke-width="5"/>`) : '';
  const torso = perfil
    ? `<path d="M166 226 Q200 214 236 226 L240 ${r.largoChaqueta} L162 ${r.largoChaqueta} Z" fill="${r.torso}" stroke="${T}" stroke-width="5" stroke-linejoin="round"/>`
    : `<path d="M140 228 Q200 212 260 228 L264 ${r.largoChaqueta} L136 ${r.largoChaqueta} Z" fill="${r.torso}" stroke="${T}" stroke-width="5" stroke-linejoin="round"/>`;
  // En perfil el brazo izquierdo (el lejano) va por detrás del torso.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 760" width="400" height="760">
  ${sentado && o.silla !== false ? silla() : ''}
  ${perfil ? dibBrazo(hI, bI) + mano(bI) : ''}
  ${piernas}${falda}${torso}${o.pecho || ''}
  ${perfil ? '' : dibBrazo(hI, bI) + mano(bI)}
  ${dibBrazo(hD, bD)}${mano(bD)}
  ${o.detrasCabeza || ''}
  <circle cx="200" cy="120" r="76" fill="#fff" stroke="${T}" stroke-width="6"/>
  ${cara(vista, o.cara || 'serio')}
  ${o.cabeza || ''}
  ${o.delante || ''}
  </svg>`;
}

module.exports = { figura, T };
