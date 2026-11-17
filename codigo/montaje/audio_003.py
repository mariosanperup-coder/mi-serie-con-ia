"""Episodio 003 (El Ecce Homo de Borja): alinea el guion con las voces, monta la pista de voz en orden,
sintetiza música y efectos, y escribe la línea de tiempo para el render.
Uso: python3 audio_001_v2.py <carpeta_salida>"""
import json, sys, os, re, difflib
import numpy as np, librosa, soundfile as sf

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
VOZ = os.path.join(RAIZ, 'voces/003-ecce-homo-borja')
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
os.makedirs(OUT, exist_ok=True)
SR = 44100
rng = np.random.default_rng(7)

# --- Guion: líneas en orden de audio (se leen del guion v2) ---
g = open(os.path.join(RAIZ, 'guiones/003-ecce-homo-borja.md')).read()
LINEAS = re.findall(r'\*\*(TEO|LUCÍA):\*\* (.+?) \|', g)
norm = lambda w: re.sub(r'[^a-z0-9áéíóúñü]', '', w.lower())
NUM = {'1930': 'milnovecientostreinta', '81': 'ochentayuno', '2012': 'dosmildoce', 'bbc': 'bbc'}

def transcribir(nombre, texto):
    cache = os.path.join(VOZ, nombre + '_palabras.json')
    if os.path.exists(cache): return json.load(open(cache))
    from faster_whisper import WhisperModel
    y16, _ = librosa.load(os.path.join(VOZ, nombre + '.mp3'), sr=16000)
    m = WhisperModel('small', device='cpu', compute_type='int8')
    segs, _ = m.transcribe(y16, language='es', word_timestamps=True, condition_on_previous_text=False)
    pal = [{'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2)} for s in segs for w in s.words]
    json.dump(pal, open(cache, 'w'), ensure_ascii=False, indent=0)
    return pal

def alinear(nombre, lineas):
    """Devuelve, para cada línea, la lista de (palabra_del_guion, inicio, fin) usando la transcripción."""
    texto = ' '.join(lineas)
    pal = transcribir(nombre, texto)
    guion = [w for l in lineas for w in l.split()]
    a = [NUM.get(norm(w['w']), norm(w['w'])) for w in pal]
    b = [norm(w) for w in guion]
    tiempos = [None] * len(guion)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size): tiempos[blk.b + k] = (pal[blk.a + k]['s'], pal[blk.a + k]['e'])
    # Interpolar las palabras sin pareja entre sus vecinas
    i = 0
    while i < len(tiempos):
        if tiempos[i] is None:
            j = i
            while j < len(tiempos) and tiempos[j] is None: j += 1
            t0 = tiempos[i - 1][1] if i > 0 else 0.0
            t1 = tiempos[j][0] if j < len(tiempos) else pal[-1]['e']
            n = j - i
            for k in range(n): tiempos[i + k] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
            i = j
        else: i += 1
    out, k = [], 0
    for l in lineas:
        n = len(l.split()); out.append([(w, *tiempos[k + q]) for q, w in enumerate(l.split())]); k += n
    return out

teo_l = [t for q, t in LINEAS if q == 'TEO']; luc_l = [t for q, t in LINEAS if q == 'LUCÍA']
AL = {'teo': alinear('teo', teo_l), 'lucia': alinear('lucia', luc_l)}
AUD = {q: librosa.load(os.path.join(VOZ, q + '.mp3'), sr=SR, mono=True)[0] for q in ('teo', 'lucia')}

def limite_fin(y, t, tope):  # alarga el final hasta el silencio real
    while t < tope - 0.05:
        s = y[int(t * SR):int((t + 0.05) * SR)]
        if len(s) == 0 or 20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-9) < -42: break
        t += 0.05
    return t

# Cortes en silencios reales: cada frase empieza al final de un silencio y acaba al empezar el siguiente.
def huecos(y, umbral=-45, minimo=0.12):
    paso = int(0.02 * SR); db = np.array([20 * np.log10(np.sqrt((y[i:i + paso] ** 2).mean()) + 1e-9) for i in range(0, len(y), paso)])
    sil = db < umbral; out = []; i = 0
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]: j += 1
            if (j - i) * 0.02 >= minimo: out.append((i * 0.02, j * 0.02))
            i = j
        else: i += 1
    return out
HUECOS = {q: [(0.0, 0.0)] + huecos(AUD[q]) + [(len(AUD[q]) / SR, len(AUD[q]) / SR)] for q in ('teo', 'lucia')}
# Fronteras entre frases: en cada cambio de párrafo, la pausa MÁS LARGA cerca del cambio previsto.
def fronteras(q):
    lineas = AL[q]; H = HUECOS[q]; fr = []
    for i in range(len(lineas) - 1):
        t = (lineas[i][-1][2] + lineas[i + 1][0][1]) / 2
        fin_i, ini_j = lineas[i][-1][2], lineas[i + 1][0][1]
        cand = [h for h in H if fin_i - 0.4 <= (h[0] + h[1]) / 2 <= ini_j + 0.3]
        if not cand: cand = [h for h in H if abs((h[0] + h[1]) / 2 - t) < 1.8]
        fr.append(max(cand, key=lambda h: h[1] - h[0]) if cand else (t, t))
    return fr
FR = {q: fronteras(q) for q in ('teo', 'lucia')}
def cortes_linea(q, x):
    fr = FR[q]
    a = fr[x - 1][1] if x > 0 else 0.0
    b = fr[x][0] if x < len(fr) else len(AUD[q]) / SR
    return max(0, a - 0.05), b + 0.1

# Escenas: (id, quién, índice de línea) o (id, None, segundos de silencio)
ORDEN = [('e01', 'teo', 0), ('e02', 'teo', 1), ('e03', 'teo', 2), ('e04', 'teo', 3), ('e05', 'teo', 4), ('e06', None, 2.0),
         ('e07', 'lucia', 0), ('e08', 'teo', 5), ('e09', 'teo', 6), ('e10', 'lucia', 1), ('e11', 'teo', 7), ('e12', 'teo', 8), ('e13', None, 3.6)]
HUECO, ARRANQUE = 0.3, 0.4
pista = [np.zeros(int(ARRANQUE * SR))]; t = ARRANQUE
escenas, subs = [], []
for esc, quien, x in ORDEN:
    if quien is None:
        escenas.append({'id': esc, 'ini': round(t, 3), 'fin': round(t + x, 3)}); pista.append(np.zeros(int(x * SR))); t += x; continue
    lin = AL[quien][x]; y = AUD[quien]
    sig = AL[quien][x + 1][0][1] if x + 1 < len(AL[quien]) else len(y) / SR
    a, b = cortes_linea(quien, x)
    trozo = y[int(a * SR):int(b * SR)]
    escenas.append({'id': esc, 'ini': round(t, 3), 'fin': round(t + len(trozo) / SR + HUECO, 3), 'frase': f'{x:02d}_{quien}'})
    for w, s, e in lin: subs.append({'p': w, 'ini': round(t + s - a, 3), 'fin': round(t + e - a, 3), 'esc': esc})
    pista += [trozo, np.zeros(int(HUECO * SR))]; t += len(trozo) / SR + HUECO
voz = np.concatenate(pista); DUR = len(voz) / SR; n = len(voz); tt = np.arange(n) / SR
E = {e['id']: e for e in escenas}

# Momentos clave (para los cambios de plano y los efectos)
def momento(esc, palabra, k=0):
    c = [s['ini'] for s in subs if s['esc'] == esc and norm(s['p']) == palabra]
    return round(c[k], 3)
CLAVE = {'santuario': momento('e03', 'en'), 'humedad': momento('e03', 'humedad'), 'decide': momento('e04', 'decide'), 'madre': momento('e07', 'madre'),
         'agosto': momento('e08', 'agosto'), 'mono': momento('e08', 'mono'), 'ecce_mono': momento('e08', 'ecce'), 'ciento': momento('e09', 'ciento'),
         'cinco': momento('e09', 'cinco'), 'dos': momento('e10', 'dos'), 'mundo': momento('e11', 'mundo')}

# ---------------- Síntesis ----------------
def env(ini, fin, sube=0.5, baja=0.5): return np.clip((tt - ini) / max(sube, 1e-3), 0, 1) * np.clip((fin - tt) / max(baja, 1e-3), 0, 1)
def paso_banda(x, f1, f2):
    F = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); F[(fr < f1) | (fr > f2)] = 0
    y = np.fft.irfft(F, len(x)); return y / (np.abs(y).max() + 1e-9)
def ruido_rosa(m):
    x = rng.standard_normal(m); f = np.fft.rfft(x); fr = np.fft.rfftfreq(m, 1 / SR); f /= np.sqrt(np.maximum(fr, 20)); y = np.fft.irfft(f, m); return y / np.abs(y).max()
def ruido_marron(m):
    x = np.cumsum(rng.standard_normal(m)); x -= np.convolve(x, np.ones(4410) / 4410, 'same'); return x / np.abs(x).max()

fin_musica = E['e12']['ini']
musica = np.zeros(n)
for f, a in [(65.41, 0.22), (98.0, 0.14), (130.81, 0.08)]:
    musica += a * np.sin(2 * np.pi * f * tt) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.08 * tt))
notas = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23]
tl, j = 0.6, 0
while tl < fin_musica:
    i = int(tl * SR); k = np.arange(int(0.4 * SR)) / SR; f = notas[j % len(notas)]
    pl = (np.sin(2 * np.pi * f * k) + 0.3 * np.sin(2 * np.pi * 2 * f * k)) * np.exp(-k * 9)
    musica[i:i + len(pl)] += pl[:max(0, n - i)] * 0.22
    tl += 0.36; j += 1
musica *= env(0, fin_musica, 1.0, 0.02); musica /= np.abs(musica).max(); musica *= 0.16

sfx = np.zeros(n)
def pon(s, ini, vol): i = int(ini * SR); s = s[:max(0, n - i)]; sfx[i:i + len(s)] += s * vol
k_ = lambda d: np.arange(int(d * SR)) / SR
for e in escenas[1:]: k = k_(0.6); pon(paso_banda(rng.standard_normal(len(k)), 80, 1800) * np.exp(-k * 7), e['ini'] - 0.05, 0.12)  # transiciones
def brochazo(t0, vol=0.3):
    k = k_(0.35); pon(paso_banda(rng.standard_normal(len(k)), 1500, 7000) * np.sin(np.pi * k / 0.35) ** 2, t0, vol)
for j in range(8): brochazo(CLAVE['decide'] + 0.6 + j * 0.45)
k = k_(0.9); pon(np.sin(2 * np.pi * (300 - 180 * k) * k) * np.exp(-k * 4) * 0.6, E['e05']['ini'] + 1.4, 0.5)  # "tachán" desinflado
for j in range(5): k = k_(0.07); pon(paso_banda(rng.standard_normal(len(k)), 300, 2500) * np.sin(np.pi * k / 0.07), E['e06']['ini'] + 0.3 + j * 0.09, 0.35)  # aleteo
k = k_(0.5); pon(np.sin(2 * np.pi * 70 * k) * np.exp(-k * 10) + paso_banda(rng.standard_normal(len(k)), 100, 1500) * np.exp(-k * 14) * 0.6, E['e06']['ini'] + 1.0, 0.8)  # culetazo
def ping(t0, f=1320, vol=0.18):
    k = k_(0.35); pon((np.sin(2 * np.pi * f * k) + 0.5 * np.sin(2 * np.pi * f * 1.5 * k)) * np.exp(-k * 9), t0, vol)
for j in range(5): ping(E['e08']['ini'] + 0.3 + j * 0.6, 1100 + 120 * (j % 4))  # un ping por móvil
for j in range(8): ping(CLAVE['agosto'] + 0.2 + j * 0.42 + 0.1 * (j % 3), 1100 + 120 * (j % 4), 0.12)  # notificaciones
sfx += paso_banda(ruido_rosa(n), 250, 1800) * env(E['e09']['ini'], E['e09']['fin'], 0.6, 0.6) * 0.1  # gente
for j in range(6):  # obturadores
    k = k_(0.12); pon(paso_banda(rng.standard_normal(len(k)), 2000, 8000) * np.exp(-k * 50), E['e09']['ini'] + 0.8 + j * 1.1, 0.4)
k = k_(0.6); pon(np.sin(2 * np.pi * 2200 * k) * np.exp(-k * 8) * 0.5 + np.sin(2 * np.pi * 3300 * k) * np.exp(-k * 10) * 0.3, CLAVE['dos'], 0.35)  # caja registradora
for e in escenas[1:]: k = k_(0.6); pon(paso_banda(rng.standard_normal(len(k)), 80, 1800) * np.exp(-k * 7), e['ini'] - 0.05, 0.1)  # transiciones
k = k_(3.2); pon(np.sin(2 * np.pi * 36 * k) * np.exp(-k * 1.6) * 0.9 + np.sin(2 * np.pi * 55 * k) * np.exp(-k * 0.9) * 0.35, E['e13']['ini'] + 0.05, 0.8)  # cierre

mezcla = voz + musica + sfx; mezcla /= max(1.0, np.abs(mezcla).max() / 0.95)
sf.write(os.path.join(OUT, 'audio_003.wav'), mezcla.astype(np.float32), SR)
paso = SR // 30
rms = np.array([np.sqrt((voz[i:i + paso] ** 2).mean()) for i in range(0, n, paso)])
boca = np.convolve(np.clip((rms / (np.percentile(rms[rms > 0.01], 90) + 1e-9) - 0.12) * 1.3, 0, 1), [0.25, 0.5, 0.25], 'same')
json.dump({'boca': [round(float(v), 2) for v in boca]}, open(os.path.join(OUT, 'boca_003.json'), 'w'))
json.dump({'duracion': round(DUR, 3), 'escenas': escenas, 'subtitulos': subs, 'clave': CLAVE}, open(os.path.join(OUT, 'linea_tiempo_003.json'), 'w'), ensure_ascii=False, indent=1)
print(f'Duración {DUR:.1f}s'); [print(e) for e in escenas]; print(CLAVE)
