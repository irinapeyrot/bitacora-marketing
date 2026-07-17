import { STATIONS, MAP } from './stations.js';

/* =========================================================================
   EL MAPA QUE YA CONOCÍA — recorrido cartográfico (25 estaciones)
   Pines en capa HTML (nítidos a cualquier zoom). Ruta que se dibuja sola.
   ========================================================================= */

const stations = STATIONS.map((s, i) => ({ ...s, n: String(i).padStart(2, '0') }));

const viewport   = document.getElementById('viewport');
const mapWrap    = document.getElementById('map-wrap');
const svg        = document.getElementById('territory');
const pinLayer   = document.getElementById('pins');
const legend     = document.getElementById('legend');
const coordsEl   = document.getElementById('coords');
const panel      = document.getElementById('panel');
const pKicker    = document.getElementById('panel-kicker');
const pTitle     = document.getElementById('panel-title');
const pBody      = document.getElementById('panel-body');
const progress   = document.getElementById('progress');
const stationLbl = document.getElementById('station-label');

let current = 0;
let reading = false;
let camScale = 1, camX = 0, camY = 0;

/* =========================================================================
   RUTA — generada por JS, pasa EXACTO por cada pin (Catmull-Rom).
   Se dibuja siempre hasta el pin actual (medimos la long. a cada pin).
   ========================================================================= */
function catmullRom(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i];
    const p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

let routePath = null, routeGuide = null, routeLen = 0, pinLens = [];

function buildRoute() {
  const ns = 'http://www.w3.org/2000/svg';
  const d = catmullRom(stations.map(s => [s.x, s.y]));

  routeGuide = document.createElementNS(ns, 'path');
  routeGuide.setAttribute('d', d);
  routeGuide.setAttribute('fill', 'none');
  routeGuide.setAttribute('stroke', '#d8412f');
  routeGuide.setAttribute('stroke-width', '3');
  routeGuide.setAttribute('stroke-linecap', 'round');
  routeGuide.setAttribute('stroke-dasharray', '2 13');
  routeGuide.setAttribute('opacity', '0.26');

  routePath = document.createElementNS(ns, 'path');
  routePath.setAttribute('id', 'route');
  routePath.setAttribute('d', d);
  routePath.setAttribute('fill', 'none');
  routePath.setAttribute('stroke', '#d8412f');
  routePath.setAttribute('stroke-width', '3.6');
  routePath.setAttribute('stroke-linecap', 'round');

  svg.appendChild(routeGuide);
  svg.appendChild(routePath);

  routeLen = routePath.getTotalLength();
  const SAMPLES = 1600, samples = [];
  for (let k = 0; k <= SAMPLES; k++) {
    const l = (k / SAMPLES) * routeLen;
    const pt = routePath.getPointAtLength(l);
    samples.push({ l, x: pt.x, y: pt.y });
  }
  pinLens = stations.map(s => {
    let best = 0, bestD = Infinity;
    for (const smp of samples) {
      const dd = (smp.x - s.x) ** 2 + (smp.y - s.y) ** 2;
      if (dd < bestD) { bestD = dd; best = smp.l; }
    }
    return best;
  });
  pinLens[0] = 0;
  pinLens[stations.length - 1] = routeLen;

  routePath.style.strokeDasharray = `${routeLen} ${routeLen}`;
  routePath.style.strokeDashoffset = routeLen;
  routePath.style.transition = 'stroke-dashoffset 1.05s cubic-bezier(.22,.61,.36,1)';
}

function drawRouteTo(i) {
  if (!routePath) return;
  const shown = pinLens[i] ?? 0;
  routePath.style.strokeDashoffset = routeLen - shown;
}

/* =========================================================================
   PINES en capa HTML (nunca se pixelan)
   ========================================================================= */
function buildPins() {
  pinLayer.innerHTML = stations.map((s, i) => `
    <button class="pin" data-i="${i}" style="left:${s.x}px;top:${s.y}px">
      <span class="pin-label">${s.short}</span>
      <span class="pin-mark">
        <span class="pin-halo"></span>
        <span class="pin-ring"><span class="pin-n">${s.n}</span></span>
      </span>
    </button>`).join('');
  pinLayer.querySelectorAll('.pin').forEach(el =>
    el.addEventListener('click', e => { e.stopPropagation(); go(+el.dataset.i, true); }));
}

/* posicionar la capa de pines con la misma transformación que el mapa */
function syncLayers() {
  const t = `translate(${camX}px,${camY}px) scale(${camScale})`;
  mapWrap.style.transform = t;
  pinLayer.style.transform = t;
  // contra-escalar cada pin para que mantenga tamaño constante en pantalla
  const inv = 1 / camScale;
  pinLayer.style.setProperty('--pin-inv', inv);
}

/* =========================================================================
   CÁMARA — centrar la estación activa
   ========================================================================= */
let overview = true;   // al arrancar mostramos la isla completa

function frame(i) {
  const s = stations[i];
  const vw = viewport.clientWidth, vh = viewport.clientHeight;

  if (overview) {
    // vista general: encuadrar toda la isla (recorrido completo visible)
    const pad = 1.12;
    const spanX = 1300, spanY = 780;                 // extensión aprox. del recorrido
    const zx = vw / (spanX * pad), zy = vh / (spanY * pad);
    camScale = Math.min(zx, zy, 0.9);
    camX = vw * 0.5 - MAP.cx * camScale;
    camY = vh * 0.5 - MAP.cy * camScale;
    syncLayers();
    return;
  }

  // navegación normal: zoom moderado (menos pixelado) sobre la estación
  camScale = reading ? 1.9 : 1.15;
  const fx = reading ? vw * 0.27 : vw * 0.5;
  const fy = reading ? vh * 0.46 : vh * 0.5;
  camX = fx - s.x * camScale;
  camY = fy - s.y * camScale;
  syncLayers();
}

/* =========================================================================
   NAVEGACIÓN
   ========================================================================= */
function go(i, open = false) {
  overview = false;              // cualquier navegación sale de la vista general
  current = Math.max(0, Math.min(stations.length - 1, i));
  updateChrome();
  drawRouteTo(current);
  if (open) openPanel();
  else { closePanel(); frame(current); }
}

function updateChrome() {
  legend.querySelectorAll('.lg-item').forEach((el, i) =>
    el.classList.toggle('on', i === current));
  pinLayer.querySelectorAll('.pin').forEach((el, i) =>
    el.classList.toggle('active', i === current));
  const s = stations[current];
  const cityEl = document.getElementById('city');
  if (cityEl) cityEl.textContent = (s.city || '').toUpperCase();
  coordsEl.textContent = fmtCoord(s);
  stationLbl.textContent = `${s.n} · ${s.short}`;
  progress.style.width = `${(current / (stations.length - 1)) * 100}%`;
}

function fmtCoord(s) {
  const lat = Math.abs(s.lat).toFixed(2) + '° ' + (s.lat >= 0 ? 'N' : 'S');
  const lon = Math.abs(s.lon).toFixed(2) + '° ' + (s.lon >= 0 ? 'E' : 'O');
  return `${lat} · ${lon}`;
}

/* =========================================================================
   PANEL
   ========================================================================= */
function openPanel() {
  const s = stations[current];
  pKicker.textContent = (s.uni || '').toUpperCase();
  pTitle.textContent = s.title;
  pBody.innerHTML = renderStation(s);
  document.body.classList.add('reading');
  reading = true;
  frame(current);
  panel.scrollTop = 0;
}
function closePanel() {
  document.body.classList.remove('reading');
  reading = false;
}

function renderStation(s) {
  let out = '';
  // si es el comienzo de una unidad, mostramos su intro/desc/puntos
  if (s.is_unit_start) {
    if (s.unit_desc)  out += `<p class="lead">${s.unit_desc}</p>`;
    if (s.unit_points) out += `<div class="pts"><span class="pts-l">Puntos cartografiados</span>${s.unit_points}</div>`;
    if (s.unit_intro) out += s.unit_intro;
  }
  out += s.html;
  return out;
}

/* =========================================================================
   LEYENDA (índice) — consistente con los labels del mapa
   ========================================================================= */
legend.innerHTML = stations.map((s, i) => `
  <button class="lg-item" data-i="${i}">
    <span class="lg-n">${s.n}</span>
    <span class="lg-t">${s.short}</span>
  </button>`).join('');
legend.querySelectorAll('.lg-item').forEach(el =>
  el.addEventListener('click', () => go(+el.dataset.i, true)));

/* =========================================================================
   ENTRADA: scroll / teclado / táctil
   ========================================================================= */
let lock = false;
function stepNav(dir) {
  if (lock) return;
  lock = true;
  setTimeout(() => (lock = false), 600);
  go(current + dir);
}
viewport.addEventListener('wheel', e => {
  if (reading) return;
  if (Math.abs(e.deltaY) < 10) return;
  e.preventDefault();
  stepNav(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

addEventListener('keydown', e => {
  if (e.key === 'Escape' && reading) return go(current, false);
  if (reading) return;
  if (['ArrowDown','ArrowRight','PageDown'].includes(e.key)) { e.preventDefault(); stepNav(1); }
  if (['ArrowUp','ArrowLeft','PageUp'].includes(e.key))    { e.preventDefault(); stepNav(-1); }
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(); }
});

let ty0 = null;
viewport.addEventListener('touchstart', e => { if (!reading) ty0 = e.touches[0].clientY; }, { passive: true });
viewport.addEventListener('touchend', e => {
  if (reading || ty0 === null) return;
  const dy = ty0 - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 42) stepNav(dy > 0 ? 1 : -1);
  ty0 = null;
}, { passive: true });

document.getElementById('panel-close').addEventListener('click', () => go(current, false));
document.getElementById('enter').addEventListener('click', () => openPanel());
document.getElementById('open-hint').addEventListener('click', () => openPanel());

/* =========================================================================
   ARRANQUE
   ========================================================================= */
buildPins();
buildRoute();
updateChrome();
addEventListener('resize', () => frame(current));
requestAnimationFrame(() => {
  frame(0);
  drawRouteTo(0);
  document.body.classList.add('ready');
});
