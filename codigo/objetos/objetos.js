// Objetos del episodio 001 dibujados en SVG.
const T = '#151515';

// Avión de pasajeros de los 70 (tipo Caravelle), de perfil mirando a la derecha. Caja 1200 x 360.
function avion({ ventanasEncendidas = true } = {}) {
  let ventanas = '';
  for (let i = 0; i < 21; i++) ventanas += `<rect x="${450 + i * 28}" y="160" width="14" height="18" rx="4" fill="${ventanasEncendidas ? '#FFE3A0' : '#9AA3AE'}" stroke="${T}" stroke-width="2"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" width="1200" height="360">
  <g stroke-linejoin="round" stroke-linecap="round">
    <!-- deriva y estabilizador -->
    <path d="M150 140 L110 30 L170 30 L280 140 Z" fill="#1F5BB0" stroke="${T}" stroke-width="5"/>
    <path d="M118 48 L176 48 L270 138" stroke="#F4F1EA" stroke-width="10" fill="none"/>
    <path d="M60 64 L230 58 L236 76 L60 80 Z" fill="#C9CDD2" stroke="${T}" stroke-width="4"/>
    <!-- fuselaje -->
    <path d="M90 150 Q100 132 160 130 L1080 130 Q1150 134 1170 180 Q1150 222 1080 226 L200 226 Q120 220 90 180 Z" fill="#F4F1EA" stroke="${T}" stroke-width="5"/>
    <path d="M100 186 Q140 214 200 222 L1080 222 Q1140 218 1162 196 L1162 190 L96 190 Z" fill="#1F5BB0"/>
    <path d="M110 184 H1166" stroke="#F4F1EA" stroke-width="6"/>
    <path d="M90 150 Q100 132 160 130 L1080 130 Q1150 134 1170 180 Q1150 222 1080 226 L200 226 Q120 220 90 180 Z" fill="none" stroke="${T}" stroke-width="5"/>
    <!-- morro y cabina -->
    <path d="M1150 160 Q1180 170 1182 182 Q1176 196 1150 202 Q1160 182 1150 160 Z" fill="#1A1A1A" stroke="${T}" stroke-width="3"/>
    <path d="M1086 150 L1130 150 L1144 164 L1086 166 Z" fill="#FFE3A0" stroke="${T}" stroke-width="3"/><path d="M1104 150 V166 M1122 150 V166" stroke="${T}" stroke-width="3"/>
    ${ventanas}
    <rect x="1050" y="152" width="0" height="0" rx="5" fill="none" stroke="${T}" stroke-width="3"/><rect x="1040" y="152" width="22" height="40" rx="5" fill="none" stroke="${T}" stroke-width="3"/>
    <!-- motor trasero -->
    <path d="M230 150 Q236 128 300 128 L420 132 Q440 150 420 168 L300 172 Q236 172 230 150 Z" fill="#D7DADE" stroke="${T}" stroke-width="5"/>
    <ellipse cx="420" cy="150" rx="12" ry="18" fill="#2A2A2A" stroke="${T}" stroke-width="3"/>
    <!-- ala -->
    <path d="M520 220 L860 214 Q900 216 900 226 L620 252 L500 246 Z" fill="#C9CDD2" stroke="${T}" stroke-width="5"/>
    <!-- luces de navegación -->
    <circle cx="512" cy="240" r="6" fill="#FF4A3A"/><circle cx="140" cy="30" r="6" fill="#fff"/>
  </g></svg>`;
}

// Caza tipo Mirage F1, de perfil mirando a la derecha. Caja 1200 x 360. postquemador = llama del motor.
function caza({ postquemador = false } = {}) {
  const camo = '#7C8188', camo2 = '#A7ACB2';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" width="1200" height="360">
  <defs><linearGradient id="llama" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#FFF4C2"/><stop offset="0.4" stop-color="#FFB040"/><stop offset="1" stop-color="#FF5A2A" stop-opacity="0"/></linearGradient></defs>
  <g stroke-linejoin="round" stroke-linecap="round">
    ${postquemador ? `<path d="M210 168 L0 150 L40 180 L0 210 L210 196 Z" fill="url(#llama)"/><path d="M210 172 L80 180 L210 190 Z" fill="#FFF8D8"/>` : ''}
    <!-- deriva -->
    <path d="M260 150 L230 30 L290 30 L420 150 Z" fill="${camo2}" stroke="${T}" stroke-width="5"/>
    <path d="M250 80 Q290 70 300 110 Q270 120 260 100 Z" fill="${camo}"/>
    <!-- fuselaje -->
    <path d="M210 160 L420 140 L860 130 Q960 132 1060 170 L1170 182 L1060 192 Q960 206 860 212 L420 212 L210 200 Z" fill="${camo2}" stroke="${T}" stroke-width="5"/>
    <path d="M440 150 Q520 140 560 170 Q520 200 460 196 Z M700 140 Q760 130 800 160 Q760 190 700 180 Z M300 160 Q360 150 380 186 Q330 200 300 190 Z" fill="${camo}"/>
    <path d="M1060 170 L1170 182 L1060 192 Z" fill="#2A2A2A" stroke="${T}" stroke-width="3"/>
    <path d="M1170 182 H1198" stroke="${T}" stroke-width="4"/>
    <!-- cabina -->
    <path d="M820 134 Q860 96 930 108 L980 140 Z" fill="#9FC6DE" stroke="${T}" stroke-width="4"/><path d="M880 104 L888 138" stroke="${T}" stroke-width="3"/>
    <!-- toma de aire -->
    <path d="M760 160 L820 158 L812 196 L760 194 Z" fill="${camo}" stroke="${T}" stroke-width="4"/>
    <!-- ala alta y estabilizador -->
    <path d="M460 170 L760 160 L700 176 L440 236 L400 230 Z" fill="${camo}" stroke="${T}" stroke-width="5"/>
    <path d="M240 196 L380 196 L330 224 L230 222 Z" fill="${camo}" stroke="${T}" stroke-width="4"/>
    <!-- tobera -->
    <rect x="200" y="158" width="26" height="44" rx="6" fill="#3A3A3A" stroke="${T}" stroke-width="4"/>
  </g></svg>`;
}

// Expediente: cerrado (con sello rojo) o abierto (con la foto de las dos luces). Caja 700 x 500.
function expediente({ abierto = false } = {}) {
  const papel = '#F1E9D8', carton = '#D6B07A';
  if (!abierto) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" width="700" height="500"><g stroke="${T}" stroke-width="5" stroke-linejoin="round">
    <path d="M200 40 H480 L486 470 H196 Z" fill="${papel}"/>
    <path d="M180 30 H470 Q476 30 476 36 V120 L500 130 V200 L476 210 V470 H180 Z" fill="${carton}"/>
    <g transform="rotate(-14 330 200)"><rect x="210" y="160" width="250" height="80" rx="8" fill="#C0392B" stroke="none" opacity="0.92"/><rect x="222" y="172" width="226" height="56" rx="4" fill="none" stroke="#F3D9C9" stroke-width="3"/></g>
  </g></svg>`;
  let lineas = '';
  for (let i = 0; i < 4; i++) lineas += `<path d="M390 ${90 + i * 18} h${200 - (i % 2) * 60}" stroke="#7A7A7A" stroke-width="5"/>`;
  for (let i = 0; i < 5; i++) lineas += `<path d="M390 ${380 + i * 18} h${210 - (i % 3) * 40}" stroke="#7A7A7A" stroke-width="5"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" width="700" height="500"><defs><radialGradient id="luz"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <g stroke="${T}" stroke-width="5" stroke-linejoin="round">
    <path d="M20 40 L340 60 V470 L30 470 Z" fill="${carton}"/>
    <path d="M350 50 H660 V470 H350 Z" fill="${carton}"/>
    <path d="M370 60 H640 V460 H370 Z" fill="${papel}" stroke-width="4"/>
    <rect x="390" y="170" width="230" height="170" fill="#3E3E3E" stroke-width="4"/>
    <path d="M390 300 Q450 270 500 300 T620 290 V340 H390 Z" fill="#232323" stroke="none"/>
    <circle cx="480" cy="230" r="26" fill="url(#luz)" stroke="none"/><circle cx="530" cy="224" r="26" fill="url(#luz)" stroke="none"/>
    <path d="M500 40 v40 q0 10 10 10 h4" fill="none" stroke="#9A9A9A" stroke-width="6"/>
  </g>${lineas}</svg>`;
}

// Micrófono de radio con cable en espiral. Caja 400 x 400.
function microfono() {
  let espiral = '';
  for (let i = 0; i < 14; i++) espiral += `<ellipse cx="${150 + i * 16}" cy="${250 + Math.sin(i / 3) * 30}" rx="10" ry="22" fill="none" stroke="#1E1E1E" stroke-width="8"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><g stroke="${T}" stroke-width="5" stroke-linejoin="round">
    <path d="M40 60 Q40 30 80 30 H150 Q180 30 180 70 V150 Q170 200 110 210 Q50 200 40 150 Z" fill="#6E735E"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="62" y="${60 + i * 20}" width="96" height="9" rx="4" fill="#1E1E1E" stroke="none"/>`).join('')}
    <rect x="176" y="80" width="22" height="46" rx="6" fill="#2A2A2A"/>
    <path d="M100 210 V236 Q110 252 140 252" fill="none" stroke="#1E1E1E" stroke-width="12"/>
  </g>${espiral}<rect x="360" y="${250 + Math.sin(13 / 3) * 30 - 16}" width="34" height="32" rx="6" fill="#A8A8A0" stroke="${T}" stroke-width="4"/></svg>`;
}

module.exports = { avion, caza, expediente, microfono };
