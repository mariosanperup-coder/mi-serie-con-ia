// Pasillo de la cabina de pasajeros de noche, con luz roja en las ventanillas. 1080 x 1920.
// pasajeros: true dibuja cabezas de pasajeros asomando por los asientos.
const { PALETA: P, halo } = require('./comun');

module.exports = function cabinaPasajeros({ pasajeros = true } = {}) {
  const t = P.tinta, ASIENTO = '#1F3A3A', ASIENTO2 = '#2A4A48', FUNDA = '#C9B48C', BRAZO = '#8A5A34';
  // Fila de asientos en perspectiva hacia el fondo (punto de fuga ~ 700, 760)
  const fila = (lado, k) => { // k=0 cerca, 1 lejos
    const s = 1 - k * 0.78, y = 1900 - k * 1050, fx = lado < 0 ? 560 - (560 + 160) * s : 820 + (1240 - 820) * s * 0.6;
    const w = 520 * s, h = 760 * s, x = lado < 0 ? fx - w * 0.15 : fx;
    return { x, y, w, h, s };
  };
  let asientos = '';
  for (const lado of [-1, 1]) for (let i = 6; i >= 0; i--) {
    const { x, y, w, h, s } = fila(lado, i / 6);
    const cab = pasajeros && i > 0 && (i + (lado > 0 ? 1 : 0)) % 2 === 1;
    asientos += `<g>
      <path d="M${x} ${y} V${y - h + 60 * s} Q${x} ${y - h} ${x + 60 * s} ${y - h} H${x + w - 60 * s} Q${x + w} ${y - h} ${x + w} ${y - h + 60 * s} V${y} Z" fill="${i % 2 ? ASIENTO : ASIENTO2}" stroke="${t}" stroke-width="${5 * s}"/>
      <rect x="${x + w * 0.12}" y="${y - h + 30 * s}" width="${w * 0.76}" height="${170 * s}" fill="${FUNDA}" stroke="${t}" stroke-width="${3 * s}"/>
      <rect x="${lado < 0 ? x + w - 40 * s : x - 10 * s}" y="${y - h * 0.45}" width="${50 * s}" height="${h * 0.12}" rx="${10 * s}" fill="${BRAZO}" stroke="${t}" stroke-width="${4 * s}"/>
      ${cab ? `<g class="pasajero"><circle cx="${x + w * 0.5}" cy="${y - h - 20 * s}" r="${70 * s}" fill="#fff" stroke="${t}" stroke-width="${6 * s}"/>
        <g class="ojo"><ellipse cx="${x + w * (lado < 0 ? 0.42 : 0.58)}" cy="${y - h - 26 * s}" rx="${6 * s}" ry="${9 * s}" fill="${t}"/><ellipse cx="${x + w * (lado < 0 ? 0.5 : 0.66)}" cy="${y - h - 26 * s}" rx="${6 * s}" ry="${9 * s}" fill="${t}"/></g></g>` : ''}</g>`;
  }
  let ventanas = '';
  [[60, 640, 110], [250, 650, 80], [370, 655, 56], [450, 660, 40]].forEach(([x, y, w], i) => {
    ventanas += `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w * 1.4}" ry="${w * 2}" fill="url(#hRojo)"/>
      <rect x="${x}" y="${y - w}" width="${w}" height="${w * 1.8}" rx="${w / 2}" fill="#C0281E" stroke="#5A4A3A" stroke-width="${10 - i * 2}"/>
      <path d="M${x + w * 0.1} ${y + w * 0.2} q${w * 0.3} ${-w * 0.3} ${w * 0.8} 0" stroke="#7A1410" stroke-width="${w * 0.12}" fill="none" opacity="0.7"/>`;
  });
  const lucesTecho = [[700, 40, 110], [700, 250, 70], [700, 380, 46], [700, 445, 34]].map(([x, y, w]) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${w * 0.3}" rx="${w * 0.1}" fill="#FFD27A" stroke="${t}" stroke-width="3"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>${halo('hRojo', '#FF3A2A', 0.5)}${halo('hTecho', '#FFC066', 0.35)}
  <linearGradient id="pasillo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#16262A"/><stop offset="1" stop-color="#22383A"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="#3A342C"/>
  <!-- techo abovedado -->
  <path d="M0 0 H1080 V520 Q860 380 700 470 Q540 380 300 560 L0 700 Z" fill="#2E3432" stroke="${t}" stroke-width="4"/>
  ${[0, 1, 2, 3, 4].map(i => `<path d="M${600 - i * 140} 0 L${660 - i * 10} 470 M${800 + i * 120} 0 L${740 + i * 10} 470" stroke="#1F2523" stroke-width="4"/>`).join('')}
  ${lucesTecho}<circle cx="700" cy="200" r="380" fill="url(#hTecho)"/>
  <!-- maleteros -->
  <path d="M0 0 L560 470 V560 L0 380 Z" fill="#8A7A60" stroke="${t}" stroke-width="5"/><path d="M0 380 L560 560 L560 600 L0 450 Z" fill="#5E5444" stroke="${t}" stroke-width="4"/>
  <path d="M1080 300 L840 470 V560 L1080 560 Z" fill="#8A7A60" stroke="${t}" stroke-width="5"/>
  ${[[110, 400], [320, 470], [450, 520]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#FFD27A"/><circle cx="${x}" cy="${y}" r="70" fill="url(#hTecho)"/>`).join('')}
  <!-- pared izquierda con ventanillas -->
  <path d="M0 450 L560 600 V900 L0 1100 Z" fill="#6A6050" stroke="${t}" stroke-width="4"/>
  ${ventanas}
  <!-- puerta de cabina al fondo -->
  <rect x="590" y="470" width="220" height="460" fill="#0E1620" stroke="${t}" stroke-width="5"/>
  <rect x="640" y="580" width="120" height="70" fill="#1E3550"/><path d="M640 680 h120 M650 700 h100" stroke="#F59A3C" stroke-width="6" stroke-dasharray="8 6"/>
  <path d="M590 470 Q620 700 600 930 L640 930 Q660 700 630 470 Z M810 470 Q780 700 800 930 L760 930 Q740 700 770 470 Z" fill="#2A3A4E" stroke="${t}" stroke-width="3"/>
  <!-- pasillo -->
  <path d="M640 930 H770 L920 1920 H420 Z" fill="url(#pasillo)"/>
  <path d="M650 930 L430 1920 M760 930 L900 1920" stroke="#C98A3A" stroke-width="5"/>
  ${asientos}
  </svg>`;
};
