# Código de la serie

Todo se dibuja en código (SVG), sin imágenes generadas dentro del vídeo final.

- `personajes/teo.js`: Teo de frente. Expresiones: `serio`, `chulo`, `empatico`, `sorpresa`, `miedo`.
- `personajes/tinta.js`: Tinta. Poses: `tranquilo`, `susto`, `desconfia`.
- `prueba-personajes.js`: genera una hoja de prueba en PNG.

```bash
node codigo/prueba-personajes.js salida.png
```
- `personajes/lucia.js`: Lucía de frente. Caras: `esceptica`, `ojosBlanco`, `leyendo`, `sorpresa`, `chulita`, `explicando`.
- `personajes/figura.js`: monigote genérico (frente o perfil, de pie o sentado) para secundarios y elenco.
- `personajes/secundarios.js`: comandante, copiloto, piloto del caza, controlador y controladora.
- `objetos/objetos.js`: avión, caza (con y sin postquemador), expediente (cerrado y abierto) y micrófono. El farol está en `teo.js`.
- `fondos/`: los 9 fondos del episodio 001. `node codigo/render-fondos.js <carpeta>` los exporta a PNG.
