// Escena 5: mapa antiguo del este de España y Baleares. 1080 x 1920.
// La ruta Palma → Canarias que se tuerce hacia Valencia se dibuja encima, animada.
const { PALETA: P } = require('./comun');

const COSTA = 'M712 0 L690 90 L620 207 L660 250 L717 276 L680 320 L620 379 L540 470 L482 551 L430 610 L396 666 L402 700 L402 746 L350 820 L287 907 L282 970 L293 1033 L350 1060 L396 1079 L360 1120 L316 1182 L270 1290 L230 1389 L149 1423 L60 1480 L0 1538 L0 0 Z';
const MALLORCA = 'M666 953 L712 918 L780 884 L815 867 L872 918 L844 1010 L792 1033 L735 987 L672 976 Z';
const MENORCA = 'M918 821 L1022 838 L1010 872 L930 855 Z';
const IBIZA = 'M505 1056 L574 1039 L578 1070 L516 1085 Z';
const FORMENTERA = 'M540 1112 L566 1108 L562 1124 Z';
const CIUDADES = { valencia: [270, 907], palma: [720, 955] };

module.exports = function mapa() {
  const t = P.tinta, tierra = '#D9A452', mar = '#2F7A78';
  let montes = '';
  [[120, 260], [230, 420], [90, 560], [180, 760], [80, 1050], [150, 1240], [300, 120]].forEach(([x, y]) =>
    montes += `<path d="M${x - 40} ${y + 20} L${x - 10} ${y - 20} L${x + 5} ${y} L${x + 20} ${y - 30} L${x + 50} ${y + 20}" stroke="#7E8A4A" stroke-width="4" fill="none" opacity="0.8"/>`);
  let olas = '';
  for (let i = 0; i < 90; i++) { const x = (i * 197) % 1080, y = (i * 389) % 1920; olas += `<path d="M${x} ${y} q20 -10 40 0 t40 0" stroke="#256462" stroke-width="5" fill="none" opacity="0.7"/>`; }
  const isla = d => `<path d="${d}" fill="${tierra}" stroke="${t}" stroke-width="4"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs><filter id="papel"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.16  0 0 0 0 0.05  0 0 0 0.35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <radialGradient id="vineta"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3A2410" stop-opacity="0.55"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="${mar}"/>${olas}
  <path d="${COSTA}" fill="${tierra}" stroke="${t}" stroke-width="5"/>
  <path d="M0 300 Q120 330 250 300 T500 360 M0 700 Q100 650 200 720 T380 700 M0 1150 Q120 1180 300 1130" stroke="#5A3A18" stroke-width="2.5" fill="none" stroke-dasharray="10 6"/>
  ${montes}
  ${isla(MALLORCA)}${isla(MENORCA)}${isla(IBIZA)}${isla(FORMENTERA)}
  <rect width="1080" height="1920" filter="url(#papel)"/>
  <rect width="1080" height="1920" fill="url(#vineta)"/>
  ${Object.values(CIUDADES).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${t}"/>`).join('')}
  </svg>`;
};
module.exports.CIUDADES = CIUDADES;
