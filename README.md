# El mapa que ya conocía — web (versión cartográfica ligera)

Bitácora de aprendizaje de Marketing Digital como territorio navegable.
Irina Peyrot · Comisión DGN5BV · Final.

Sin 3D ni librerías externas: HTML + CSS + SVG puro. Funciona en cualquier
navegador moderno.

## Cómo verlo en tu compu

Los módulos ES necesitan un servidor (no sirve abrir el archivo directo):

    python3 -m http.server 8000

Y abrir http://localhost:8000

## Navegación

- **scroll** / flechas → viajar de estación en estación por el mapa
- **click en un pin** o **Enter** → abrir el contenido de esa región
- **Esc** → volver al mapa
- La **leyenda** (derecha) salta a cualquier estación

## Deploy en Vercel

Sitio estático, sin build:

1. Subir esta carpeta a un repo de GitHub
2. Vercel → New Project → importar el repo
3. Framework Preset: **Other** · Build Command: vacío · Output: vacío
4. Deploy

O por CLI, desde esta carpeta:  `npx vercel --prod`

## Regenerar (si cambia el contenido)

El mapa y el contenido se generan con Python:

    python3 mapgen.py      # regenera map.svg + js/coords.js
    python3 build.py       # inyecta el mapa en index.html

`js/content.js` sale del PDF de la bitácora (script extract.py del proyecto).

## Estructura

    index.html          página (con el mapa SVG embebido)
    index.template.html  plantilla (antes de inyectar el mapa)
    mapgen.py           genera el territorio cartográfico
    build.py            arma el index final
    css/style.css       identidad visual (heredada del PDF)
    js/app.js           navegación: scroll, cámara, panel
    js/content.js       TODO el contenido de la bitácora
    js/coords.js        posiciones de las estaciones (generado)
    assets/             tipografías
