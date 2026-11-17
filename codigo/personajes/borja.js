// Personajes del 003: Cecilia (pintora aficionada) y turistas. También los dos cuadros del Ecce Homo.
const { figura, T } = require('./figura');

const rizos = (vista) => { const c = vista === 'perfil' ? [[150, 70], [120, 110], [140, 160], [190, 46], [235, 52]] : [[130, 80], [118, 130], [150, 50], [200, 38], [250, 50], [282, 80], [292, 130]];
  return c.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="34" fill="#9A9A96" stroke="${T}" stroke-width="4"/>`).join('') + c.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="30" fill="#9A9A96"/>`).join(''); };
const gafas = (vista) => vista === 'perfil'
  ? `<circle cx="240" cy="124" r="18" fill="none" stroke="${T}" stroke-width="3"/><path d="M222 122 L160 116" stroke="${T}" stroke-width="3"/>`
  : `<circle cx="168" cy="126" r="20" fill="none" stroke="${T}" stroke-width="3"/><circle cx="232" cy="126" r="20" fill="none" stroke="${T}" stroke-width="3"/><path d="M188 124 Q200 118 212 124 M148 122 L126 118 M252 122 L274 118" stroke="${T}" stroke-width="3" fill="none"/>`;
const blusa = (vista) => {
  const flor = (x, y) => `<g transform="translate(${x} ${y})"><circle r="6" fill="#5A7ABA"/><circle cx="7" cy="0" r="4" fill="#7A9AD0"/><circle cx="-7" cy="0" r="4" fill="#7A9AD0"/><circle cx="0" cy="2" r="3" fill="#E8C060"/></g>`;
  return vista === 'perfil'
    ? `<path d="M214 228 L236 232 L240 420 L216 420 Z" fill="#F2EAD8" stroke="${T}" stroke-width="3"/>${flor(226, 270)}${flor(228, 330)}${flor(226, 390)}`
    : `<path d="M174 228 H226 L232 420 H168 Z" fill="#F2EAD8" stroke="${T}" stroke-width="3"/>${[[186, 260], [212, 290], [190, 330], [214, 370], [188, 400]].map(([x, y]) => flor(x, y)).join('')}
       <path d="M140 230 L174 230 L168 440 L136 440 Z M260 230 L226 230 L232 440 L264 440 Z" fill="#253458" stroke="${T}" stroke-width="4"/>`;
};
const ropaCecilia = { torso: '#253458', pantalon: '#151515', zapatos: '#1E2A44', manos: '#fff', falda: '#202020', largoChaqueta: 440 };
const paleta = (x, y) => `<g transform="translate(${x} ${y})"><ellipse rx="54" ry="36" fill="#B88A5A" stroke="${T}" stroke-width="4"/>${[['#3A5AA0', -26, -10], ['#E8D8B0', 0, -18], ['#4A7A3A', 22, -6], ['#8A5A3A', -8, 12]].map(([c, a, b]) => `<circle cx="${a}" cy="${b}" r="9" fill="${c}"/>`).join('')}<circle cx="30" cy="16" r="9" fill="#fff" stroke="${T}" stroke-width="3"/></g>`;
const pincel = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-5" y="0" width="10" height="90" rx="4" fill="#6A3E1E" stroke="${T}" stroke-width="3"/><path d="M-8 0 L8 0 L4 -26 L-4 -26 Z" fill="#D9C8A0" stroke="${T}" stroke-width="3"/><path d="M-4 -26 L4 -26 L0 -34 Z" fill="#3A5AA0"/></g>`;
const escalera = `<g stroke="${T}" stroke-width="6"><path d="M150 760 L190 500 M260 760 L230 500 M170 640 H245 M160 700 H252" stroke="#8A8A8A" stroke-width="10" fill="none"/><rect x="180" y="490" width="62" height="14" fill="#6A6A6A"/></g>`;

const cecilia = {
  depie: (cara = 'amable') => figura({ vista: 'frente', cara, ropa: ropaCecilia, pecho: blusa('frente'), detrasCabeza: rizos('frente'), cabeza: gafas('frente') }),
  orgullosa: () => figura({ vista: 'frente', cara: 'contento', ropa: ropaCecilia, pecho: blusa('frente'), detrasCabeza: rizos('frente'), cabeza: gafas('frente'),
    brazoIzq: [[150, 330], [192, 300]], brazoDer: [[250, 330], [208, 300]] }),
  // Pintando: perfil mirando a la derecha. El pincel llega a x≈350, y≈170 de su caja.
  pintando: () => figura({ vista: 'perfil', cara: 'amable', ropa: ropaCecilia, pecho: blusa('perfil'), detrasCabeza: rizos('perfil'), cabeza: gafas('perfil'),
    brazoDer: [[270, 250], [330, 190]], brazoIzq: [[230, 330], [276, 340]], delante: pincel(336, 196, 40) + paleta(290, 346) }),
  escalera,
};

const turista = (i) => {
  const tipos = [
    { torso: '#4E7A3E', pantalon: '#C8A670', zapatos: '#6A4A2A', cab: `<path d="M120 90 Q130 30 200 30 Q270 30 280 90 Z" fill="#8A8A60" stroke="${T}" stroke-width="5"/><path d="M270 80 L330 92 L280 98 Z" fill="#8A8A60" stroke="${T}" stroke-width="4"/>`, pecho: `<path d="M138 240 L120 420 M262 240 L280 420" stroke="#2E4A2E" stroke-width="16"/>` },
    { torso: '#C8483E', pantalon: '#3E5A8A', zapatos: '#F4F4F0', falda: '#3E5A8A', cab: `<rect x="140" y="104" width="120" height="36" rx="14" fill="#151515"/><path d="M196 50 C240 20 280 60 270 110 C300 150 300 200 280 220 C260 180 250 130 230 90 Z" fill="#6A4222" stroke="${T}" stroke-width="4"/>`, pecho: `<rect x="172" y="300" width="56" height="40" rx="6" fill="#2A2A2A" stroke="${T}" stroke-width="3"/><circle cx="200" cy="320" r="12" fill="#5A5A5A"/><path d="M160 240 L180 300 M240 240 L220 300" stroke="#151515" stroke-width="4"/>` },
    { torso: '#2E5AA0', pantalon: '#C8A670', zapatos: '#E8DCC8', cab: '', pecho: '', brazoDer: [[300, 200], [330, 90]], delante: `<rect x="310" y="40" width="44" height="70" rx="8" fill="#1A1A1A" stroke="${T}" stroke-width="4"/>` },
    { torso: '#8A6AA0', pantalon: '#151515', zapatos: '#6A4A2A', falda: '#5E6A3A', cab: `<ellipse cx="200" cy="60" rx="130" ry="30" fill="#E8C890" stroke="${T}" stroke-width="5"/><path d="M130 60 Q140 0 200 0 Q260 0 270 60 Z" fill="#E8C890" stroke="${T}" stroke-width="5"/><path d="M134 50 H266" stroke="#2A2A2A" stroke-width="10"/>`, pecho: `<path d="M270 330 h50 l10 90 h-70 z" fill="#C8A060" stroke="${T}" stroke-width="4"/>` },
  ][i % 4];
  return figura({ vista: 'frente', cara: ['amable', 'sorpresa', 'contento', 'amable'][i % 4], ropa: { torso: tipos.torso, pantalon: tipos.pantalon, zapatos: tipos.zapatos, manos: '#151515', falda: tipos.falda, mangaCorta: true, largoChaqueta: 430 },
    cabeza: tipos.cab, pecho: tipos.pecho, brazoDer: tipos.brazoDer, delante: tipos.delante });
};

// Los dos cuadros: caja 300 x 400 (lo que cabe dentro del marco del interior).
function cuadroOriginal() {
  let desconches = '';
  [[40, 60, 50, 30], [220, 90, 40, 26], [60, 300, 60, 34], [230, 320, 44, 30], [150, 360, 70, 22], [20, 200, 30, 50]].forEach(([x, y, w, h]) => desconches += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="#E8DCC0"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <rect width="300" height="400" fill="#4A3A2A"/><radialGradient id="g" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#6A5A44"/><stop offset="1" stop-color="#2A221A"/></radialGradient><rect width="300" height="400" fill="url(#g)"/>
  <!-- túnica -->
  <path d="M40 400 Q60 300 150 290 Q240 300 260 400 Z" fill="#8A3A2E"/><path d="M110 300 Q150 330 190 300" stroke="#5A2218" stroke-width="6" fill="none"/>
  <!-- cara serena con barba -->
  <path d="M150 300 L150 270" stroke="#C89A70" stroke-width="40"/>
  <ellipse cx="150" cy="190" rx="66" ry="84" fill="#D9AA80"/>
  <path d="M84 170 Q80 90 150 84 Q220 90 216 170 Q210 130 190 120 Q150 110 110 120 Q90 130 84 170 Z" fill="#4A2E1E"/>
  <path d="M88 180 Q60 260 100 300 M212 180 Q240 260 200 300" stroke="#4A2E1E" stroke-width="16" fill="none"/>
  <path d="M100 236 Q150 300 200 236 Q196 286 150 296 Q104 286 100 236 Z" fill="#4A2E1E"/>
  <path d="M120 186 q12 -8 24 0 M156 186 q12 -8 24 0" stroke="#3A2416" stroke-width="5" fill="none"/>
  <path d="M120 196 q12 5 24 0 M156 196 q12 5 24 0" stroke="#3A2416" stroke-width="3" fill="none"/>
  <path d="M150 196 Q144 222 152 230" stroke="#A8784E" stroke-width="4" fill="none"/><path d="M134 248 Q150 254 166 248" stroke="#6A3A24" stroke-width="4" fill="none"/>
  <!-- corona de espinas -->
  <path d="M82 120 Q150 90 218 120" stroke="#5A4A2A" stroke-width="10" fill="none"/>${[90, 110, 130, 150, 170, 190, 210].map((x, i) => `<path d="M${x} ${114 - (i === 3 ? 10 : 6)} l${i % 2 ? 8 : -8} -14" stroke="#5A4A2A" stroke-width="4"/>`).join('')}
  ${desconches}
  </svg>`;
}
function cuadroRestaurado() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
  <rect width="300" height="400" fill="#6A6A80"/><rect width="300" height="400" fill="#8A7A6A" opacity="0.5"/>
  <path d="M30 400 Q50 320 150 300 Q250 320 270 400 Z" fill="#9A4A3A"/>
  <!-- pelo y barba como una masa marrón -->
  <path d="M60 220 Q40 80 150 70 Q260 80 240 220 Q260 330 150 340 Q40 330 60 220 Z" fill="#6A3E22"/>
  <path d="M70 220 Q60 120 150 112 Q240 120 230 220 Q234 310 150 318 Q66 310 70 220 Z" fill="#7A4A2A" opacity="0.7"/>
  <!-- cara: óvalo plano -->
  <ellipse cx="150" cy="200" rx="58" ry="66" fill="#D9A47A"/>
  <ellipse cx="150" cy="215" rx="48" ry="44" fill="#C8906A" opacity="0.6"/>
  <!-- ojos pequeños y separados -->
  <ellipse cx="122" cy="186" rx="9" ry="6" fill="#2A1A10"/><ellipse cx="180" cy="188" rx="8" ry="6" fill="#2A1A10"/>
  <path d="M110 174 Q122 168 134 174 M168 176 Q180 170 192 176" stroke="#5A3420" stroke-width="5" fill="none"/>
  <!-- nariz y boca -->
  <ellipse cx="152" cy="214" rx="14" ry="8" fill="#B8785A"/><circle cx="146" cy="216" r="3" fill="#5A3420"/><circle cx="158" cy="216" r="3" fill="#5A3420"/>
  <path d="M130 240 Q150 250 170 240" stroke="#5A3420" stroke-width="5" fill="none"/>
  <!-- pinceladas sueltas -->
  <path d="M60 140 q10 30 0 60 M240 150 q-12 30 0 60 M90 300 q30 10 60 0" stroke="#5A3420" stroke-width="10" fill="none" opacity="0.6"/>
  </svg>`;
}

module.exports = { cecilia, turista, cuadroOriginal, cuadroRestaurado };
