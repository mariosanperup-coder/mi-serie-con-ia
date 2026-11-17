// Episodio 001 — El caso Manises. Anima las escenas y exporta el vídeo vertical 1080x1920 a 30 fps.
// Uso:
//   node render_001.js video  <salida.mp4>          → vídeo completo con audio
//   node render_001.js fotos  <carpeta> 3.2 12 ...  → fotogramas sueltos para revisar
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('playwright');
const B = path.join(__dirname, '..');
const { teoFrente } = require(B + '/personajes/teo');
const { tinta } = require(B + '/personajes/tinta');
const { luciaFrente } = require(B + '/personajes/lucia');
const S = require(B + '/personajes/secundarios');
const O = require(B + '/objetos/objetos');
const F = n => require(B + '/fondos/' + n);
const archivo = F('f09_archivo');
const LT = JSON.parse(fs.readFileSync(path.join(__dirname, 'salida/linea_tiempo_001.json')));
const FPS = 30, W = 1080, H = 1920;

// --- utilidades SVG ---
let cont = 0;
// Cada SVG incrustado recibe ids únicos para que sus degradados no choquen con los de otros.
function aislar(svg) {
  const p = 'i' + (cont++) + '_';
  return svg.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`);
}
const interior = s => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const vb = s => s.match(/viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);
// Coloca un SVG en (x, y) con escala; id opcional para animarlo.
function capa(svg, x = 0, y = 0, esc = 1, id = '') {
  const [w, h] = vb(svg);
  return `<g ${id ? `id="${id}"` : ''}><svg x="${x}" y="${y}" width="${w * esc}" height="${h * esc}" viewBox="0 0 ${w} ${h}" overflow="visible">${interior(aislar(svg))}</svg></g>`;
}
const fondo = (svg) => interior(aislar(svg));
const luzRoja = (id, x, y, r) => `<g id="${id}"><circle cx="${x}" cy="${y}" r="${r * 4}" fill="url(#hRojoG)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FF5040"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#FFD0C0"/></g>`;
const rotulo = (id, txt, y = 250) => `<g id="${id}" opacity="0"><rect x="${540 - txt.length * 19 - 30}" y="${y - 58}" width="${txt.length * 38 + 60}" height="84" rx="6" fill="#0B0E13" opacity="0.8"/>
  <text x="540" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="54" fill="#F2E6CF" letter-spacing="2">${txt}</text></g>`;

// --- tiempos clave ---
const esc = Object.fromEntries(LT.escenas.map(e => [e.id, e]));
const palabra = (escena, txt, n = 0) => LT.subtitulos.filter(w => w.esc === escena && w.p.replace(/[^\wáéíóúñ]/gi, '').toLowerCase() === txt)[n].ini;
const T = {
  gira: palabra('e03', 'gira'), en: palabra('e07', 'en'), elPiloto: palabra('e08', 'piloto') - 0.15,
  escapan: palabra('e08', 'escapan'), como: palabra('e08', 'como'),
};

// --- escenas ---
const archivoSinMesa = archivo({ conMesa: false }), mesa = `<g>${aislar(archivo.mesa())}</g>`;
const pista = F('f01_pista_noche')();
const teoPista = (p) => `<g id="${p}zoom">${fondo(pista)}<ellipse cx="620" cy="1712" rx="130" ry="16" fill="#000" opacity="0.45"/>
  <g id="${p}teo">${capa(teoFrente({ cara: 'serio' }), 420, 1000, 1)}${capa(tinta({ pose: 'tranquilo' }), 642, 1100, 0.34)}</g></g>`;

const ESCENAS = {
  e01: teoPista('e01'),
  e02: `<g id="e02pan">${fondo(F('f02_cielo_mar')())}</g>
    ${luzRoja('e02l1', 0, 0, 14)}${luzRoja('e02l2', 0, 0, 14)}
    ${capa(O.avion(), 0, 0, 0.55, 'e02avion')}${rotulo('e02rot', '11 NOV 1979 · 23:00')}`,
  e03: `<g id="e03giro">${fondo(F('f04_ventanilla')())}
    ${luzRoja('e03l1', 640, 640, 20)}${luzRoja('e03l2', 820, 720, 20)}
    ${capa(S.comandante.radio('preocupado'), -60, 980, 1.55, 'e03com')}</g>`,
  e04: `<rect width="1080" height="1920" fill="#0D1418"/><circle cx="540" cy="900" r="700" fill="url(#hFocoG)"/>
    <g id="e04tinta">
      <g id="e04a">${capa(tinta({ pose: 'tranquilo' }), 210, 520, 2.2)}</g>
      <g id="e04b" style="display:none">${capa(tinta({ pose: 'desconfia' }), 210, 520, 2.2)}</g>
      <g id="e04c" style="display:none">${capa(tinta({ pose: 'susto' }), 210, 520, 2.2)}</g></g>`,
  e05: `<g id="e05zoom">${fondo(F('f05_mapa')())}
    <path id="e05ruta" d="M720 955 C650 1150 560 1320 470 1360 C380 1390 300 1250 270 907" fill="none" stroke="#B3261E" stroke-width="10" stroke-dasharray="26 14" stroke-linecap="round"/>
    <path id="e05mascara" d="M720 955 C650 1150 560 1320 470 1360 C380 1390 300 1250 270 907" fill="none" stroke="#2F7A78" stroke-width="0"/>
    <g id="e05avion"><circle r="18" fill="#B3261E" stroke="#151515" stroke-width="4"/></g>
    <g id="e05rot" opacity="0"><rect x="300" y="860" width="330" height="80" rx="6" fill="#0B0E13" opacity="0.85"/><text x="465" y="918" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="54" fill="#F2E6CF">MANISES</text></g></g>`,
  e06: `${fondo(archivoSinMesa)}${capa(luciaFrente({ cara: 'esceptica' }), 290, 760, 1.25, 'e06lucia')}${mesa}`,
  e07: `<g id="e07a">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'chulo', farolEncendido: true }), 290, 760, 1.25, 'e07teo')}${mesa}</g>
    <g id="e07b" style="display:none">${fondo(F('f06_torre_control')())}${luzRoja('e07l1', 420, 620, 12)}${luzRoja('e07l2', 520, 660, 12)}
      ${capa(S.controladora.sorpresa(), 300, 1120, 1.1)}${capa(S.controlador.senala(), -40, 1060, 1.25)}</g>`,
  e08: `<g id="e08a">${fondo(F('f07_base_aerea')())}${capa(O.caza({ postquemador: true }), 0, 0, 0.6, 'e08caza1')}${rotulo('e08rot', 'BASE DE LOS LLANOS')}</g>
    <g id="e08b" style="display:none"><g id="e08pan">${fondo(F('f08_cielo_nubes')())}</g>${luzRoja('e08luz', 0, 0, 16)}${capa(O.caza({ postquemador: true }), 0, 0, 0.5, 'e08caza2')}</g>`,
  e09: `${fondo(archivoSinMesa)}${capa(luciaFrente({ cara: 'leyendo' }), 290, 760, 1.25)}${mesa}
    ${capa(O.expediente({ abierto: true }), 0, 0, 1.2, 'e09exp')}
    <g id="e09sello" opacity="0" transform="translate(540 560) rotate(-12)"><rect x="-330" y="-62" width="660" height="124" rx="10" fill="none" stroke="#C0392B" stroke-width="12"/>
      <text x="0" y="26" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="78" fill="#C0392B">DESCLASIFICADO</text></g>`,
  e10: `<g id="e10zoom">${fondo(archivoSinMesa)}${capa(teoFrente({ cara: 'serio' }), 290, 760, 1.25)}${mesa}</g>`,
  e11: teoPista('e11'),
};

const html = `<!doctype html><html><head><style>body{margin:0;background:#000}#sub tspan{paint-order:stroke}</style></head><body>
<svg id="lienzo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><radialGradient id="hRojoG"><stop offset="0" stop-color="#FF4A3A" stop-opacity="0.85"/><stop offset="1" stop-color="#FF4A3A" stop-opacity="0"/></radialGradient>
<radialGradient id="hFocoG"><stop offset="0" stop-color="#FFC066" stop-opacity="0.35"/><stop offset="1" stop-color="#FFC066" stop-opacity="0"/></radialGradient>
<radialGradient id="vineta" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs>
${Object.entries(ESCENAS).map(([id, s]) => `<g id="${id}" style="display:none">${s}</g>`).join('\n')}
<rect width="${W}" height="${H}" fill="url(#vineta)" pointer-events="none"/>
<text id="sub" x="540" y="1420" text-anchor="middle" font-family="Inter" font-weight="900" font-size="84"></text>
<rect id="negro" width="${W}" height="${H}" fill="#000" opacity="0"/>
</svg>
<script>
const LT = ${JSON.stringify(LT)}, T = ${JSON.stringify(T)};
const $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const suave = x => { x = cl(x); return x * x * (3 - 2 * x); };
const prog = (t, a, b) => cl((t - a) / (b - a));
const mueve = (id, x, y, s = 1, r = 0, cx = 0, cy = 0) => $(id).setAttribute('transform', \`translate(\${x} \${y}) rotate(\${r} \${cx} \${cy}) scale(\${s})\`);
const zoom = (id, s, cx, cy) => $(id).setAttribute('transform', \`translate(\${cx} \${cy}) scale(\${s}) translate(\${-cx} \${-cy})\`);
const ver = (id, v) => $(id).style.display = v ? '' : 'none';
const op = (id, o) => $(id).setAttribute('opacity', o);
const luz = (id, x, y, s) => $(id).setAttribute('transform', \`translate(\${x} \${y}) scale(\${s})\`);

// Subtítulos: grupos de hasta 3 palabras; la palabra que suena, en amarillo.
const grupos = [];
{ let g = [];
  LT.subtitulos.forEach((w, i) => { const sig = LT.subtitulos[i + 1];
    g.push(w); if (g.length === 3 || /[.,?!:]$/.test(w.p) || !sig || sig.esc !== w.esc) { grupos.push(g); g = []; } }); }
function subtitulos(t) {
  const el = $('sub'); el.innerHTML = '';
  const g = grupos.find((g, i) => t >= g[0].ini - 0.05 && t < (grupos[i + 1] ? grupos[i + 1][0].ini - 0.05 : g[g.length - 1].fin + 0.6));
  if (!g || t > g[g.length - 1].fin + 0.6) return;
  const entra = suave(prog(t, g[0].ini - 0.05, g[0].ini + 0.08));
  el.setAttribute('transform', \`translate(540 1420) scale(\${0.85 + 0.15 * entra}) translate(-540 -1420)\`);
  g.forEach((w, j) => { const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    const sig = g[j + 1]; ts.textContent = w.p + ' ';
    const activa = t >= w.ini - 0.03 && (sig ? t < sig.ini - 0.03 : t < w.fin + 0.25);
    ts.setAttribute('fill', activa ? '#FFD34D' : '#FFFFFF'); ts.setAttribute('stroke', '#0B0E13'); ts.setAttribute('stroke-width', '14');
    el.appendChild(ts); });
}

function render(t) {
  const e = LT.escenas.find(e => t >= e.ini && t < e.fin) || (t < LT.escenas[0].ini ? LT.escenas[0] : LT.escenas[LT.escenas.length - 1]);
  for (const x of LT.escenas) ver(x.id, x.id === e.id);
  const p = prog(t, e.ini, e.fin), d = t - e.ini;
  op('negro', t < 0.4 ? 1 - t / 0.4 : Math.max(0, 0.6 - d * 4));
  const resp = 1 + 0.008 * Math.sin(t * 2.4); // respiración
  switch (e.id) {
    case 'e01': zoom('e01zoom', 1 + 0.07 * suave(p), 620, 1300); zoom('e01teo', resp, 620, 1712); break;
    case 'e11': zoom('e11zoom', 1.07 - 0.07 * suave(p), 620, 1300); zoom('e11teo', resp, 620, 1712); break;
    case 'e02': {
      $('e02pan').setAttribute('transform', \`translate(\${-1400 * suave(p)} 0)\`);
      const ax = -700 + 1900 * p; mueve('e02avion', ax, 780 + 20 * Math.sin(t * 1.3));
      const lp = prog(t, e.ini + 3.5, e.ini + 4.5);
      luz('e02l1', ax - 140 + 30 * Math.sin(t * 2), 760 + 30 * Math.sin(t * 1.7), lp * (1 + 0.15 * Math.sin(t * 9)));
      luz('e02l2', ax - 230 + 30 * Math.cos(t * 2.3), 820 + 25 * Math.cos(t * 1.9), lp * (1 + 0.15 * Math.cos(t * 8)));
      op('e02rot', prog(t, e.ini + 0.3, e.ini + 0.8) * (1 - prog(t, e.fin - 1, e.fin - 0.5))); break; }
    case 'e03': {
      const g = suave(prog(t, T.gira, T.gira + 1.2));
      $('e03giro').setAttribute('transform', \`rotate(\${-6 * g} 540 960) scale(\${1 + 0.06 * g})\`);
      const cre = 0.7 + 0.5 * p;
      luz('e03l1', 0, 0, cre * (1 + 0.12 * Math.sin(t * 10))); luz('e03l2', 0, 0, cre * (1 + 0.12 * Math.cos(t * 11)));
      $('e03l1').setAttribute('transform', \`translate(\${640 + 30 * Math.sin(t)} \${640}) scale(\${cre}) translate(-640 -640)\`);
      $('e03l2').setAttribute('transform', \`translate(\${820 + 30 * Math.cos(t)} \${720}) scale(\${cre}) translate(-820 -720)\`);
      $('e03l1').setAttribute('transform', \`translate(\${30 * Math.sin(t)} 0) translate(640 640) scale(\${cre}) translate(-640 -640)\`);
      $('e03l2').setAttribute('transform', \`translate(\${30 * Math.cos(t)} 0) translate(820 720) scale(\${cre}) translate(-820 -720)\`);
      zoom('e03com', resp, 250, 1900); break; }
    case 'e04': {
      const fase = d < 0.45 ? 'a' : d < 0.85 ? 'b' : 'c';
      ver('e04a', fase === 'a'); ver('e04b', fase === 'b'); ver('e04c', fase === 'c');
      const mira = d >= 0.45 && d < 0.65 ? -1 : 1;
      const tiembla = fase === 'c' ? 10 * Math.sin(d * 80) * Math.max(0, 1 - (d - 0.85) * 1.2) : 0;
      $('e04tinta').setAttribute('transform', \`translate(\${540 + tiembla} 0) scale(\${mira} 1) translate(-540 0)\`); break; }
    case 'e05': {
      const ruta = $('e05ruta'), L = ruta.getTotalLength(), k = suave(prog(t, e.ini + 0.3, e.fin - 1.6));
      ruta.setAttribute('stroke-dasharray', \`\${L * k} \${L}\`);
      const pt = ruta.getPointAtLength(L * k); $('e05avion').setAttribute('transform', \`translate(\${pt.x} \${pt.y})\`);
      op('e05rot', prog(t, e.fin - 1.6, e.fin - 1.2));
      zoom('e05zoom', 1.05 + 0.1 * suave(p), 480, 1100); break; }
    case 'e06': mueve('e06lucia', -620 * (1 - suave(prog(d, 0, 0.5))), 0); break;
    case 'e07': { const b = t >= T.en; ver('e07a', !b); ver('e07b', b);
      zoom('e07teo', resp, 540, 1650);
      const lp = 1 + 0.15 * Math.sin(t * 9); luz('e07l1', 0, 0, 1); $('e07l1').setAttribute('transform', \`translate(\${20 * Math.sin(t * 1.5)} 0)\`); $('e07l2').setAttribute('transform', \`translate(\${20 * Math.cos(t * 1.5)} 0)\`); break; }
    case 'e08': { const b = t >= T.elPiloto; ver('e08a', !b); ver('e08b', b);
      if (!b) { const k = prog(t, e.ini + 0.2, T.elPiloto); const x = -720 + 1500 * k * k, y = 1380 - 500 * Math.max(0, k - 0.3) ** 1.5;
        mueve('e08caza1', x, y, 1, -14 * Math.max(0, k - 0.3), 360, 108);
        op('e08rot', prog(t, e.ini + 0.2, e.ini + 0.6) * (1 - prog(t, T.elPiloto - 0.5, T.elPiloto - 0.2))); }
      else { const k = prog(t, T.elPiloto, e.fin);
        $('e08pan').setAttribute('transform', \`translate(\${-2160 * k} 0)\`);
        mueve('e08caza2', 40 + 30 * Math.sin(t * 1.3), 820 + 40 * Math.sin(t * 0.9), 1, 3 * Math.sin(t * 1.1), 300, 90);
        const huye = suave(prog(t, T.escapan - 0.3, T.escapan + 0.6));
        const lx = 820 + 60 * Math.sin(t * 2.2) + 900 * huye, ly = 760 + 80 * Math.sin(t * 1.6) - 600 * huye;
        luz('e08luz', lx, ly, 1 + 0.2 * Math.sin(t * 12)); }
      break; }
    case 'e09': {
      const k = suave(prog(d, 0.15, 0.5)); mueve('e09exp', 120, 260 + 300 * (1 - k), 0.9 + 0.1 * k); op('e09exp', k);
      const s = prog(d, 0.45, 0.55); op('e09sello', s);
      $('e09sello').setAttribute('transform', \`translate(330 560) rotate(-14) scale(\${(1.6 - 0.6 * suave(s)) * 0.52})\`); break; }
    case 'e10': zoom('e10zoom', 1 + 0.35 * suave(p), 540, 900); break;
  }
  subtitulos(t);
}
window.render = render;
</script></body></html>`;

(async () => {
  const [modo, salida, ...tiempos] = process.argv.slice(2);
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  if (modo === 'fotos') {
    fs.mkdirSync(salida, { recursive: true });
    for (const t of tiempos) { await pg.evaluate(t => render(t), +t); await pg.screenshot({ path: path.join(salida, `t${(+t).toFixed(1).padStart(5, '0')}.png`) }); }
  } else {
    const total = Math.ceil(LT.duracion * FPS);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', path.join(__dirname, 'salida/audio_001.wav'),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = 0; i < total; i++) {
      await pg.evaluate(t => render(t), i / FPS);
      const buf = await pg.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`${i}/${total} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('Hecho:', salida);
  }
  await b.close();
})();
