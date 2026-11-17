# Mi serie con IA — Shorts animados de historias reales

Shorts verticales (9:16, 30–60 s) de **historias reales de miedo y curiosidades**, con personajes propios, pensados para monetizar en YouTube.

## Estructura

| Carpeta | Qué va dentro |
|---|---|
| `personajes/protagonista/` | Ficha del protagonista + imágenes de referencia (frente, perfil, 3/4, expresiones) |
| `personajes/secundarios/` | Una subcarpeta por personaje recurrente, con su ficha e imágenes |
| `fondos/` | Escenarios y ambientes (casas, bosques, ciudades, épocas…) |
| `voces/` | Muestras de voz, voces elegidas/diseñadas y locuciones generadas |
| `musica/` | Música y efectos de sonido **con licencia para uso comercial** |
| `referencias/` | Estilo visual, canales que te inspiran, paletas de color, tipografías |
| `guiones/` | Un archivo por episodio: `NNN-titulo-corto.md` |
| `videos-listos/` | Vídeos finales exportados, listos para subir |

## Convención de nombres
- Episodios: `001-la-casa-de-belmez`, `002-...` (mismo prefijo en guion, voz y vídeo).
- Imágenes de personaje: `protagonista_frente.png`, `protagonista_miedo.png`, etc.

## Notas de monetización
- Usar solo música/efectos con licencia comercial clara (guardar la licencia junto al archivo).
- Historias reales: citar fuentes en el guion y en la descripción del vídeo.
- Marcar en YouTube el contenido generado con IA cuando sea realista ("contenido alterado o sintético").

## Decisiones tomadas
- **Historias:** de España, siempre autoconclusivas, sin sangre ni muerte, en estilo documental.
- **Ritmo:** 2 shorts al día, de 60 a 90 s. Se publican en **YouTube y TikTok**.
- **Estilo:** 2D stickman. Todo **hecho con código**: personajes, fondos y animación se dibujan en código y la música ambiental oscura se sintetiza en código. Sin herramientas de pago.
- **Voces:** ElevenLabs, con voces de la biblioteca. Las genera el usuario y las pasa (ver `voces/README.md`).
- **Guiones:** los escribe Claude (ver `guiones/`).
- **Objetivo:** monetizar el canal en 3 meses.

## Pendientes
- [x] Frases de Teo: entrada "Soy Teo Vela… y esto pasó de verdad." · despedida "Expediente cerrado… o eso dicen."
- [ ] Crear el canal de YouTube y la cuenta de TikTok (lo hace el usuario).
- [ ] Elegir las voces en ElevenLabs y apuntarlas en `voces/README.md`.
- [ ] Elegir el **nombre del canal** (ver propuestas abajo).
- [ ] Aprobar el diseño de los personajes (`personajes/PROMPTS.md`).

## Propuestas de nombre (serie y canal)
1. **Expediente Vela** — @ExpedienteVela — *"Historias reales que no te contaron"* ← recomendado
2. **Pasó de Verdad** — @PasoDeVerdad
3. **Archivo Insólito** — @ArchivoInsolito
4. **Caso Abierto** — @CasoAbiertoShorts
5. **Lo Que Nadie Te Contó** — @LoQueNadieTeConto
