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
const routePath  = document.getElementById('route');

let current = 0;
let reading = false;
let camScale = 1, camX = 0, camY = 0;

/* =========================================================================
   RUTA que se dibuja — usamos stroke-dashoffset
   ========================================================================= */
let routeLen = 0;
if (routePath) {
  routeLen = routePath.getTotalLength();
  routePath.style.strokeDasharray = routeLen;
  routePath.style.strokeDashoffset = routeLen;   // oculta toda la ruta
  routePath.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.22,.61,.36,1)';
}
function drawRouteTo(i) {
  if (!routePath) return;
  const frac = stations.length > 1 ? i / (stations.length - 1) : 1;
  // dejamos la ruta con guiones: dibujamos hasta el punto actual
  routePath.style.strokeDashoffset = routeLen * (1 - frac);
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
function frame(i) {
  const s = stations[i];
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  camScale = reading ? 2.1 : 1.55;
  const fx = reading ? vw * 0.28 : vw * 0.5;
  const fy = reading ? vh * 0.44 : vh * 0.5;
  camX = fx - s.x * camScale;
  camY = fy - s.y * camScale;
  syncLayers();
}

/* =========================================================================
   NAVEGACIÓN
   ========================================================================= */
function go(i, open = false) {
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
  coordsEl.textContent = fmtCoord(s);
  stationLbl.textContent = `${s.n} · ${s.short}`;
  progress.style.width = `${(current / (stations.length - 1)) * 100}%`;
}

function fmtCoord(s) {
  const lat = (34.9 + (s.y - MAP.cy) * 0.00028).toFixed(2);
  const lon = (56.16 + (s.x - MAP.cx) * 0.00028).toFixed(2);
  return `${lat}° S · ${lon}° O`;
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
updateChrome();
addEventListener('resize', () => frame(current));
requestAnimationFrame(() => {
  frame(0);
  drawRouteTo(0);
  document.body.classList.add('ready');
});
