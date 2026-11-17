// Personajes del 004: Francisco (normal, hombre pez, nadando), pescadores, madre, secretario, y la estatua.
const { figura, T } = require('./figura');
// Pelo oscuro despeinado: masa de mechones redondeados por encima de la cabeza (sin pelos sueltos).
const pelo = (vista) => {
  const pts = vista === 'perfil'
    ? [[200, 50], [172, 52], [148, 66], [132, 90], [126, 118], [134, 146], [228, 52], [250, 66]]
    : [[200, 44], [170, 48], [230, 48], [146, 60], [254, 60], [128, 82], [272, 82], [120, 108], [280, 108]];
  const r = 24;
  return pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="${T}"/>`).join('') + pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2E2218"/>`).join('')
    + pts.filter((_, i) => i % 2 === 0).map(([x, y]) => `<path d="M${x - 10} ${y - 4} q6 -8 16 -4" stroke="#5A4434" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('');
};
const camisa = (vista, rota) => {
  if (vista === 'perfil') return `<path d="M210 228 L236 232 L232 270 Z" fill="#E8DCC0" stroke="${T}" stroke-width="3"/>`;
  return `<path d="M176 226 L200 262 L224 226" fill="none" stroke="${T}" stroke-width="4"/>` + (rota
    ? `<path d="M140 420 l20 -30 l16 30 l18 -26 l14 26 l20 -30 l18 30 l22 -26 l12 26" fill="none" stroke="${T}" stroke-width="4"/><path d="M160 300 l14 20 l-10 14 Z M236 340 l12 -16 l10 18 Z" fill="#8AA898" stroke="${T}" stroke-width="3"/>` : '');
};
const escamas = (x, y, w, h) => { let s = ''; for (let f = 0; f < h / 14; f++) for (let c = 0; c < w / 16; c++) s += `<path d="M${x + c * 16 + (f % 2) * 8} ${y + f * 14} q8 10 16 0" stroke="#2E6A6A" stroke-width="2.5" fill="#6AA8A0"/>`; return s; };
const algas = `<path d="M150 236 Q130 300 150 360 Q140 400 160 440" stroke="#4E7A30" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M250 236 Q270 290 250 340" stroke="#5E8A3A" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M170 236 Q190 260 176 290" stroke="#4E7A30" stroke-width="10" fill="none"/>`;
const gotas = [[150, 200], [260, 190], [140, 470], [270, 460], [200, 520]].map(([x, y]) => `<path d="M${x} ${y} q-6 12 0 16 q6 -4 0 -16 Z" fill="#9ACCD8" stroke="${T}" stroke-width="2"/>`).join('');
const ropaF = (rota) => ({ torso: rota ? '#B8AE98' : '#E8DCC0', pantalon: rota ? '#5A4630' : '#6A4A2A', zapatos: '#F4F0EA', manos: '#fff', largoChaqueta: 430 });
const carta = (x, y) => `<g transform="translate(${x} ${y}) rotate(-8)"><rect x="-28" y="-20" width="56" height="40" fill="#E8D8B0" stroke="${T}" stroke-width="3"/><path d="M-28 -20 L0 4 L28 -20" fill="none" stroke="${T}" stroke-width="3"/><circle cx="0" cy="8" r="6" fill="#B03A2E"/></g>`;

const francisco = {
  normal: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: ropaF(false), pecho: camisa('frente', false), cabeza: pelo('frente') }),
  pez: () => figura({ vista: 'frente', cara: 'serio', ropa: ropaF(true), pecho: camisa('frente', true) + `${escamas(186, 236, 30, 36)}` + algas,
    cabeza: pelo('frente') + `<path d="M150 100 Q156 92 170 96 M230 96 Q244 92 250 100" stroke="${T}" stroke-width="5" fill="none"/>` + gotas,
    delante: ['M150 238 L130 330 L126 420', 'M250 238 L270 330 L274 420'].map(d => `<path d="${d}" stroke="#5E9A90" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#2E6A6A" stroke-width="12" fill="none" stroke-dasharray="3 9" stroke-linecap="round"/>`).join('') }),
  andando: () => figura({ vista: 'perfil', cara: 'serio', ropa: ropaF(false), pecho: camisa('perfil'), cabeza: pelo('perfil'), brazoDer: [[230, 330], [262, 400]], delante: carta(266, 404) }),
  pelo, escamas,
};

// Francisco nadando (caja 400 x 240): cuerpo horizontal en el agua, solo cabeza y un brazo fuera.
function nadando() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <path d="M60 150 L300 140" stroke="${T}" stroke-width="30" stroke-linecap="round"/><path d="M60 150 L300 140" stroke="#B8AE98" stroke-width="22" stroke-linecap="round" opacity="0.7"/>
  <path d="M290 140 L360 110" stroke="${T}" stroke-width="9" stroke-linecap="round"/><ellipse cx="364" cy="108" rx="12" ry="14" fill="#fff" stroke="${T}" stroke-width="4"/>
  <path d="M60 150 L10 170 M60 150 L14 136" stroke="${T}" stroke-width="9" stroke-linecap="round"/>
  <circle cx="300" cy="90" r="52" fill="#fff" stroke="${T}" stroke-width="5"/>
  <path d="M252 90 Q240 30 300 28 Q340 30 352 60 Q330 52 316 62 Q300 48 284 62 Q270 56 262 76 Z" fill="#2E2218" stroke="${T}" stroke-width="3"/>
  <ellipse cx="322" cy="92" rx="5" ry="7" fill="${T}"/><path d="M312 74 L336 80" stroke="${T}" stroke-width="5" stroke-linecap="round"/><path d="M314 112 L334 110" stroke="${T}" stroke-width="4"/>
  <rect x="0" y="128" width="400" height="112" fill="#2E7A8A" opacity="0.75"/>
  <path d="M0 128 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#E8F4F0" stroke-width="5" fill="none"/>
  </svg>`;
}

const gorroRojo = `<path d="M118 100 Q110 30 200 26 Q290 30 282 100 Q240 80 200 80 Q160 80 118 100 Z" fill="#B03A2E" stroke="${T}" stroke-width="5"/><path d="M118 100 Q200 70 282 100" stroke="#8A2A20" stroke-width="10" fill="none"/>`;
const sombreroPaja = `<ellipse cx="200" cy="70" rx="140" ry="30" fill="#D9B060" stroke="${T}" stroke-width="5"/><path d="M128 70 Q136 4 200 2 Q264 4 272 70 Z" fill="#D9B060" stroke="${T}" stroke-width="5"/><path d="M132 58 H268" stroke="#5A3A1E" stroke-width="10"/>`;
const barba = `<path d="M146 150 Q200 210 254 150" stroke="${T}" stroke-width="3" fill="none" stroke-dasharray="4 6"/>`;
const rayas = `${[260, 290, 320, 350, 380].map(y => `<path d="M140 ${y} H260" stroke="#3E5A8A" stroke-width="10"/>`).join('')}`;
const faja = `<rect x="134" y="400" width="132" height="30" fill="#A03A2E" stroke="${T}" stroke-width="4"/><path d="M240 430 L250 500 L226 496 Z" fill="#A03A2E" stroke="${T}" stroke-width="3"/>`;
const pan = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="28" ry="18" fill="#C88A3A" stroke="${T}" stroke-width="4"/><path d="M${x - 14} ${y - 6} q6 -6 12 0 M${x + 2} ${y - 6} q6 -6 12 0" stroke="#8A5A20" stroke-width="3" fill="none"/>`;
const ropaPesc = (torso, pant) => ({ torso, pantalon: pant, zapatos: '#F4F0EA', manos: '#fff', mangaCorta: true, largoChaqueta: 430 });
const pescador = {
  uno: (cara = 'sorpresa', tirando = false) => figura({ vista: tirando ? 'perfil' : 'frente', cara, ropa: ropaPesc('#F2EAD8', '#7A4E2A'), cabeza: gorroRojo, pecho: tirando ? '' : rayas,
    brazoDer: tirando ? [[270, 320], [330, 340]] : [[260, 330], [230, 360]], brazoIzq: tirando ? [[250, 330], [320, 360]] : undefined, delante: tirando ? '' : pan(232, 372) }),
  dos: (cara = 'serio', tirando = false) => figura({ vista: tirando ? 'perfil' : 'frente', cara, ropa: ropaPesc('#E8DCC0', '#4E5A3A'), cabeza: sombreroPaja + (tirando ? '' : barba), pecho: tirando ? '' : faja,
    brazoDer: tirando ? [[270, 320], [330, 340]] : undefined, brazoIzq: tirando ? [[250, 330], [320, 360]] : undefined }),
};

const mono = `<path d="M126 110 Q120 40 200 40 Q280 40 274 110 Q250 74 200 72 Q150 74 126 110 Z" fill="#9A9A96" stroke="${T}" stroke-width="4"/><circle cx="200" cy="34" r="26" fill="#9A9A96" stroke="${T}" stroke-width="4"/>`;
const chal = `<path d="M136 230 L264 230 L230 330 L200 360 L170 330 Z" fill="#2A2420" stroke="${T}" stroke-width="4"/>`;
const madre = {
  depie: (cara = 'preocupado', emocion = false) => figura({ vista: 'frente', cara, ropa: { torso: '#E8DCC0', pantalon: '#151515', zapatos: '#2A2A2A', manos: '#fff', falda: '#6A4A30', largoChaqueta: 420 },
    cabeza: mono, pecho: chal, brazoIzq: emocion ? [[160, 330], [196, 290]] : undefined, brazoDer: emocion ? [[240, 330], [204, 290]] : undefined }),
};
const tonsura = `<path d="M124 120 Q126 70 160 60 M276 120 Q274 70 240 60" stroke="#3A2A1E" stroke-width="18" fill="none" stroke-linecap="round"/>`;
const cuelloBlanco = `<path d="M130 232 H270 L250 290 H150 Z" fill="#F4F0EA" stroke="${T}" stroke-width="4"/><path d="M190 400 V520" stroke="#B8A888" stroke-width="5"/>`;
const libro = (x, y) => `<rect x="${x - 24}" y="${y - 34}" width="48" height="66" rx="4" fill="#6A3E1E" stroke="${T}" stroke-width="4"/>`;
const secretario = { depie: (cara = 'serio') => figura({ vista: 'frente', cara, ropa: { torso: '#1E1E1E', pantalon: '#1E1E1E', zapatos: '#151515', manos: '#fff', falda: '#1E1E1E', largoChaqueta: 520 },
  cabeza: tonsura, pecho: cuelloBlanco, brazoDer: [[260, 330], [230, 380]], delante: libro(236, 380) }) };

// Estatua de bronce del hombre pez sobre pedestal (caja 400 x 900)
function estatua() {
  const f = francisco.pez().replace(/fill="#fff"/g, 'fill="#6E7A64"').replace(/fill="#B8AE98"|fill="#5A4630"|fill="#E8DCC0"|fill="#F4F0EA"|fill="#2E2218"|fill="#8AA898"|fill="#6AA8A0"|fill="#4E7A30"|fill="#5E8A3A"|fill="#9ACCD8"/g, 'fill="#5E6A54"')
    .replace(/stroke="#2E6A6A"|stroke="#4E7A30"|stroke="#5E8A3A"|stroke="#2E2218"/g, 'stroke="#3E4A38"');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 900" width="400" height="900">
  <svg x="0" y="0" width="400" height="760" viewBox="0 0 400 760">${f.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>
  <rect x="90" y="700" width="220" height="200" fill="#A8A08A" stroke="${T}" stroke-width="6"/><rect x="70" y="690" width="260" height="30" fill="#B8B09A" stroke="${T}" stroke-width="5"/>
  <rect x="130" y="760" width="140" height="60" fill="#8A8270"/></svg>`;
}

module.exports = { francisco, nadando, pescador, madre, secretario, estatua };
