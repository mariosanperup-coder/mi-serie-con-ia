"""Episodio 001: monta la pista de voz en el orden del guion, sintetiza música y efectos,
y escribe la línea de tiempo (escenas + palabras) para el render.
Uso: python3 audio_001.py <carpeta_salida>"""
import json, sys, os, re
import numpy as np, librosa, soundfile as sf

RAIZ = os.path.join(os.path.dirname(__file__), '..', '..')
VOZ = os.path.join(RAIZ, 'voces/001-caso-manises/definitivo')
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
os.makedirs(OUT, exist_ok=True)
SR = 44100
rng = np.random.default_rng(1)

audio, _ = librosa.load(os.path.join(VOZ, 'completo_teo_lucia.mp3'), sr=SR, mono=True)
cortes = json.load(open(os.path.join(VOZ, 'cortes.json')))
palabras = [w for s in json.load(open(os.path.join(VOZ, 'transcripcion.json'))) for w in s['words']]

# Orden del guion: (escena, frase de audio o None = silencio de N segundos)
ORDEN = [('e01', '01_teo'), ('e02', '02_teo'), ('e03', '03_teo'), ('e04', 1.8), ('e05', '05_teo'),
         ('e06', '06_lucia'), ('e07', '07_teo'), ('e08', '08_teo'), ('e09', '09_lucia'), ('e10', '10_teo'), ('e11', '11_teo')]
HUECO = 0.35  # respiración entre frases
ARRANQUE = 0.4

# Arreglos de los subtítulos (la transcripción va en minúsculas o con cifras)
ARREGLOS = {'miraje': 'Mirage', 'albacete': 'Albacete', 'escombreras': 'Escombreras', 'ejército': 'Ejército', 'aire': 'Aire', '100': 'cien', '11': 'once'}

pista = [np.zeros(int(ARRANQUE * SR))]
t = ARRANQUE
escenas, subtitulos = [], []
for esc, frase in ORDEN:
    if isinstance(frase, float):
        escenas.append({'id': esc, 'ini': round(t, 3), 'fin': round(t + frase, 3)})
        pista.append(np.zeros(int(frase * SR))); t += frase
        continue
    a, b = cortes[frase]
    trozo = audio[int(a * SR):int(b * SR)]
    escenas.append({'id': esc, 'ini': round(t, 3), 'fin': round(t + len(trozo) / SR + HUECO, 3), 'frase': frase})
    for w in palabras:
        if w['s'] >= a - 0.01 and w['e'] <= b + 0.01:
            txt = w['w'].strip()
            limpio = re.sub(r'[^\wáéíóúñ]', '', txt.lower())
            if limpio in ARREGLOS: txt = re.sub(re.escape(re.sub(r'[^\wáéíóúñ]', '', txt)), ARREGLOS[limpio], txt, flags=re.I)
            subtitulos.append({'p': txt, 'ini': round(t + w['s'] - a, 3), 'fin': round(t + w['e'] - a, 3), 'esc': esc})
    pista.append(trozo); pista.append(np.zeros(int(HUECO * SR)))
    t += len(trozo) / SR + HUECO
pista.append(np.zeros(int(1.2 * SR)))
voz = np.concatenate(pista)
DUR = len(voz) / SR
E = {e['id']: e for e in escenas}

# ---------------- Síntesis ----------------
n = len(voz); tt = np.arange(n) / SR
def env(ini, fin, sube=0.5, baja=0.5):
    e = np.clip((tt - ini) / max(sube, 1e-3), 0, 1) * np.clip((fin - tt) / max(baja, 1e-3), 0, 1)
    return e
def ruido(color='rosa'):
    x = rng.standard_normal(n)
    if color == 'marron': x = np.cumsum(x); x -= np.convolve(x, np.ones(4410) / 4410, 'same'); x /= np.abs(x).max()
    elif color == 'rosa':
        f = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR); f /= np.sqrt(np.maximum(fr, 20)); x = np.fft.irfft(f, n); x /= np.abs(x).max()
    return x
def paso_banda(x, f1, f2):
    F = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); F[(fr < f1) | (fr > f2)] = 0
    y = np.fft.irfft(F, len(x)); return y / (np.abs(y).max() + 1e-9)

# Música: dron oscuro en La menor (La1, Mi2, Do3) con trémolo lento, viento y un latido grave.
fin_musica = E['e11']['ini']  # se corta en seco antes de la última frase
musica = np.zeros(n)
for f, a in [(55, 0.32), (82.41, 0.2), (110, 0.12), (130.81, 0.09), (164.81, 0.05)]:
    musica += a * np.sin(2 * np.pi * f * tt + 0.3 * np.sin(2 * np.pi * 0.07 * tt)) * (0.75 + 0.25 * np.sin(2 * np.pi * (0.05 + f / 4000) * tt))
viento = paso_banda(ruido('rosa'), 150, 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * tt)) * 0.18
musica += viento
latido = np.zeros(n)
for b in np.arange(2, fin_musica, 1.6):  # latido grave, más rápido en la persecución
    pass
tlat = 2.0
while tlat < fin_musica:
    i = int(tlat * SR); k = np.arange(int(0.5 * SR)) / SR
    golpe = np.sin(2 * np.pi * 48 * k) * np.exp(-k * 9)
    latido[i:i + len(golpe)] += golpe[:max(0, n - i)] * 0.5
    tlat += 1.0 if E['e08']['ini'] <= tlat < E['e10']['ini'] else 1.6
musica += latido
subida = 1 + 0.6 * env(E['e08']['ini'], E['e10']['ini'], 3, 1)  # sube en el clímax
musica *= subida * env(0, fin_musica, 1.5, 0.02)
musica /= np.abs(musica).max(); musica *= 0.22

sfx = np.zeros(n)
def pon(sonido, ini, vol):
    i = int(ini * SR); s = sonido[:max(0, n - i)]; sfx[i:i + len(s)] += s * vol
# Motor del avión (escenas 2 y 3)
motor = paso_banda(ruido('marron'), 40, 400) * env(E['e02']['ini'], E['e03']['fin'], 1.5, 1.0)
sfx += motor * 0.25
# Estática de radio (escena 3, "Llama por radio")
k = np.arange(int(1.6 * SR)) / SR
estatica = paso_banda(rng.standard_normal(len(k)), 1500, 4500) * (0.6 + 0.4 * (np.sin(2 * np.pi * 13 * k) > 0)) * np.minimum(1, (1.6 - k) * 4)
pon(estatica, E['e03']['ini'] + 0.1, 0.18)
# Aleteo + golpe grave (escena 4)
for j in range(7):
    k = np.arange(int(0.07 * SR)) / SR
    pon(paso_banda(rng.standard_normal(len(k)), 300, 2500) * np.sin(np.pi * k / 0.07), E['e04']['ini'] + 0.25 + j * 0.09, 0.35)
k = np.arange(int(1.4 * SR)) / SR
pon(np.sin(2 * np.pi * 40 * k * (1 - 0.3 * k)) * np.exp(-k * 3), E['e04']['ini'] + 0.9, 0.9)
# Golpe de transición en cada cambio de escena
for e in escenas[1:]:
    k = np.arange(int(0.6 * SR)) / SR
    pon(paso_banda(rng.standard_normal(len(k)), 80, 1800) * np.exp(-k * 7) * np.sin(np.pi * np.minimum(k / 0.05, 1) / 2), e['ini'] - 0.05, 0.12)
# Despegue del caza (escena 8): barrido de ruido que sube
k = np.arange(int(3.0 * SR)) / SR
barrido = np.zeros(len(k)); xr = rng.standard_normal(len(k))
for c in range(6):
    seg = slice(c * len(k) // 6, (c + 1) * len(k) // 6); barrido[seg] = paso_banda(xr[seg], 200 + c * 400, 1200 + c * 900)
pon(barrido * np.minimum(1, k * 2) * np.minimum(1, (3 - k) * 1.5), E['e08']['ini'], 0.3)
# Sello sobre el papel (escena 9)
k = np.arange(int(0.25 * SR)) / SR
pon(np.sin(2 * np.pi * 90 * k) * np.exp(-k * 30) + paso_banda(rng.standard_normal(len(k)), 200, 3000) * np.exp(-k * 40) * 0.5, E['e09']['ini'] + 0.5, 0.7)

mezcla = voz * 1.0 + musica + sfx
mezcla = mezcla / max(1.0, np.abs(mezcla).max() / 0.95)
sf.write(os.path.join(OUT, 'audio_001.wav'), mezcla.astype(np.float32), SR)
json.dump({'duracion': round(DUR, 3), 'escenas': escenas, 'subtitulos': subtitulos}, open(os.path.join(OUT, 'linea_tiempo_001.json'), 'w'), ensure_ascii=False, indent=1)
print(f'Duración {DUR:.2f}s, {len(escenas)} escenas, {len(subtitulos)} palabras')
for e in escenas: print(e)
