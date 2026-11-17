# Prompts de imagen de los personajes (2D stickman)

Los prompts van en **inglés** porque los generadores (Kling, Midjourney, etc.) dan mejores resultados así. Cada uno empieza por el **BLOQUE DE ESTILO**: no lo cambies nunca, así todo el canal tiene el mismo aspecto.

**Orden de trabajo para que no cambien de cara:**
1. Genera la *hoja de giro* (turnaround) del protagonista y quédate con la mejor.
2. Usa esa imagen como **referencia** (image-to-image) para sacar las expresiones y las poses.
3. Cuando el diseño esté aprobado, se crea un **"elemento"** en Kling con esas imágenes y así se mantiene igual en los vídeos.
4. Repite lo mismo con cada personaje.

---

## BLOQUE DE ESTILO (pegar al principio de todos)
```
2D hand-drawn cartoon stickman character, perfectly round pure white head, thin black ink limbs and body lines with slightly varied line weight, deadpan meme-style face with two small black dot eyes and very expressive thin eyebrows, minimal mouth line, flat matte colors on clothing only, subtle paper grain texture, clean ink outlines, documentary cartoon look
```

## BLOQUE HOJA DE PERSONAJE (para turnarounds)
```
character turnaround reference sheet, same character shown 4 times: front view, three-quarter view, side profile, back view, full body, standing neutral pose, evenly spaced, plain light warm-grey background, soft even lighting, no text, no watermark
```

---

## 1. Protagonista — TEO VELA "el Vela" (propuesta)
Tiene 32 años y es de un pueblo de Cuenca, aunque vive en Madrid. Narra las historias e investiga en persona los lugares donde pasaron. Es amable, serio y divertido, empático, y tiene un punto chulo: la ceja levantada y la media sonrisa.

**Hoja de giro**
```
[BLOQUE DE ESTILO], adult male stickman, slim, average height, one small messy hair tuft on top of the white head, wearing a short mustard-yellow trench coat open at the front, long red knitted scarf, dark grey trousers drawn as thick lines, brown boots, an old small brass lantern hanging from his left hand, a worn notebook peeking from the coat pocket, confident relaxed posture, [BLOQUE HOJA DE PERSONAJE]
```

**Hoja de expresiones** (con la hoja de giro como referencia)
```
[BLOQUE DE ESTILO], expression sheet of the same stickman character with mustard trench coat and red scarf, head and shoulders only, 8 expressions in a 4x2 grid: neutral serious, cocky half smile with one raised eyebrow, warm empathetic smile, curious squint, surprised wide eyes, contained fear with eyebrows up, laughing, whispering with finger on lips, plain light warm-grey background, no text
```

**Poses clave**
```
[BLOQUE DE ESTILO], same stickman with mustard trench coat and red scarf, pose sheet with 6 full body poses: talking to camera with one hand open, holding the brass lantern up in the dark, writing in notebook, crouching to inspect the ground, walking sideways (side view), arms crossed with cocky smile, plain light warm-grey background, no text
```

**Escena de prueba** (para ver cómo queda con fondo)
```
[BLOQUE DE ESTILO], the stickman with mustard trench coat and red scarf standing at the gate of an abandoned stone house in a Spanish village at dusk, holding up his brass lantern, warm amber light against deep teal shadows, matte painted cinematic background, soft volumetric light, vertical 9:16 composition, character in lower third, no text, no watermark
```

---

## 2. Mascota — TINTA, el cuervo (propuesta)
Es el cuervo de Teo y va en su hombro. No habla: reacciona, se asusta y se burla. Es el icono del canal (sirve para el logo y la foto de perfil).
```
[BLOQUE DE ESTILO], small cartoon crow drawn in the same simple ink style, solid black body, round head, one big white eye and one small dot eye, tiny red knitted scarf matching the protagonist, expressive single feather on head, [BLOQUE HOJA DE PERSONAJE]
```
**Expresiones**
```
[BLOQUE DE ESTILO], expression sheet of the same small black crow with tiny red scarf, 6 expressions in a 3x2 grid: unimpressed deadpan, shocked feathers puffed, laughing beak open, scared hiding under wing, suspicious side-eye, sleeping, plain light warm-grey background, no text
```

---

## 3. Compañera — LUCÍA "la Escéptica" (propuesta)
Tiene 29 años y es documentalista e investigadora de archivo. Busca los papeles, las fechas y las fuentes, y le lleva la contraria a Teo con humor. Hace las preguntas que se haría el espectador.
```
[BLOQUE DE ESTILO], adult female stickman, slim, a high ponytail drawn as a single bold black curved line on the white head, large round glasses, dark green turtleneck sweater, brown corduroy trousers drawn as thick lines, white sneakers, carrying a stack of old paper files under one arm, a pencil behind the ear, skeptical posture with one hand on hip, [BLOQUE HOJA DE PERSONAJE]
```
**Expresiones**
```
[BLOQUE DE ESTILO], expression sheet of the same female stickman with round glasses, ponytail and dark green turtleneck, head and shoulders, 6 expressions in a 3x2 grid: skeptical raised eyebrow, eye roll, reading with focus, genuinely surprised, laughing, pushing glasses up smugly, plain light warm-grey background, no text
```

---

## 4. Experta — DOÑA REMEDIOS (propuesta, aparece de vez en cuando)
Es una abuela de un pueblo de Cuenca y conoce todas las leyendas de la zona. Da el toque costumbrista y aporta testimonios de "esto me lo contó mi abuela".
```
[BLOQUE DE ESTILO], elderly female stickman, small and slightly hunched, grey hair bun drawn on top of the white head, small round reading glasses on the tip of the face, black knitted shawl over a dark floral dress, wooden walking cane, slippers, kind but mischievous expression, [BLOQUE HOJA DE PERSONAJE]
```

---

## 5. Elenco genérico (para la gente de las historias reales)
Usamos un monigote base sin rasgos propios y le cambiamos la ropa y los accesorios según la época, para que no se confunda con los personajes fijos.

**Base**
```
[BLOQUE DE ESTILO], generic neutral stickman with no hair and no accessories, plain light-grey simple clothing, [BLOQUE HOJA DE PERSONAJE]
```
**Variantes** (sustituye la parte final de la base):
- `wearing a 1950s Spanish rural farmer outfit, beret, rolled sleeves`
- `wearing a 1970s police officer uniform with cap` (genérico, sin escudos reales)
- `wearing a nun habit`
- `small child stickman, striped shirt, shorts`
- `elderly man stickman, flat cap, cardigan, walking stick`
- `1920s gentleman in a suit and bowler hat` (para estafadores históricos)
- `doctor in white coat with round mirror headband, early 1900s`
- `sailor with striped shirt and wool cap`
- `medieval peasant with tunic and rope belt`

---

## 6. Opcional — LA SOMBRA
Una silueta recurrente que aparece al final de algunos vídeos para dejar intriga. Solo inquietante: nada de violencia.
```
[BLOQUE DE ESTILO], tall thin stickman silhouette made entirely of soft black smoke-like ink, no face except two faint white dot eyes, standing far away at the end of a dark corridor, slightly blurred edges, eerie but not violent, vertical 9:16, no text
```

---

## 7. Lugar base — EL ARCHIVO
Es el sótano donde Teo y Lucía abren y cierran cada caso.
```
2D hand-drawn matte painted background, cozy cluttered basement archive, tall shelves full of old cardboard boxes and yellowed folders, a single hanging warm light bulb, cork board with photos and red string, wooden desk with brass lantern and notebook, warm amber light with deep teal shadows, subtle paper grain, cinematic, empty scene with no characters, vertical 9:16, no text, no watermark
```
