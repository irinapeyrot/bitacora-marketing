import { REGIONS } from './content.js';
import { MAP, PINS } from './coords.js';

/* =========================================================================
   EL MAPA QUE YA CONOCÍA — recorrido cartográfico (sin 3D)
   El mapa es un lienzo fijo; al avanzar de estación, la "cámara" (una
   transformación CSS sobre el mapa) viaja y hace zoom hacia cada pin.
   ========================================================================= */

const stations = REGIONS.map((r, i) => ({
  ...r,
  n: String(i).padStart(2, '0'),
  px: PINS[i][0], py: PINS[i][1],
}));

const viewport = document.getElementById('viewport');
const mapWrap  = document.getElementById('map-wrap');
const svg      = document.getElementById('territory');
const legend   = document.getElementById('legend');
const coordsEl = document.getElementById('coords');
const panel    = document.getElementById('panel');
const pKicker  = document.getElementById('panel-kicker');
const pTitle   = document.getElementById('panel-title');
const pBody    = document.getElementById('panel-body');
const progress = document.getElementById('progress');
const stationLbl = document.getElementById('station-label');

let current = 0;
let reading = false;

/* --- pines dibujados sobre el SVG --- */
function drawPins() {
  const ns = 'http://www.w3.org/2000/svg';
  stations.forEach((s, i) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'pin');
    g.setAttribute('data-i', i);
    g.setAttribute('transform', `translate(${s.px},${s.py})`);
    g.innerHTML = `
      <circle class="pin-halo" r="46" fill="none" stroke="#d8412f" stroke-width="1.4"/>
      <circle class="pin-ring" r="26" fill="#faf8f4" stroke="#d8412f" stroke-width="2.4"/>
      <circle class="pin-dot"  r="7"  fill="#d8412f"/>
      <text class="pin-n" y="5" text-anchor="middle" font-family="Space Grotesk"
            font-size="15" font-weight="600" fill="#141414">${s.n}</text>
      <text class="pin-label" y="-42" text-anchor="middle" font-family="Space Grotesk"
            font-size="15" font-weight="600" letter-spacing="1.5" fill="#141414">${(s.uni||s.kicker||'').toUpperCase()}</text>`;
    g.addEventListener('click', () => go(i, true));
    svg.appendChild(g);
  });
  /* rutas entre pines: línea punteada por el orden del recorrido */
  const path = document.createElementNS(ns, 'path');
  let d = `M${stations[0].px} ${stations[0].py}`;
  for (let i = 1; i < stations.length; i++) {
    const a = stations[i-1], b = stations[i];
    const mx = (a.px+b.px)/2, my = (a.py+b.py)/2;
    const off = 40 * (i%2 ? 1 : -1);
    d += ` Q${mx+off} ${my-off} ${b.px} ${b.py}`;
  }
  path.setAttribute('d', d);
  path.setAttribute('class', 'route');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#d8412f');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-dasharray', '3 8');
  path.setAttribute('opacity', '0.4');
  svg.insertBefore(path, svg.querySelector('.pin'));
}

/* --- mover la "cámara": centrar el pin activo con zoom --- */
function frameStation(i, zoom) {
  const s = stations[i];
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const z = zoom ?? (reading ? 1.9 : 1.35);
  // al leer, empujar el foco a la izquierda (el panel tapa la derecha)
  const focusX = reading ? vw * 0.30 : vw * 0.5;
  const focusY = reading ? vh * 0.42 : vh * 0.5;
  const tx = focusX - s.px * z;
  const ty = focusY - s.py * z;
  mapWrap.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
}

/* --- navegación --- */
function go(i, open = false) {
  current = Math.max(0, Math.min(stations.length - 1, i));
  updateChrome();
  if (open) openPanel();
  else { closePanel(); frameStation(current); }
}

function updateChrome() {
  legend.querySelectorAll('.lg-item').forEach((el, i) =>
    el.classList.toggle('on', i === current));
  svg.querySelectorAll('.pin').forEach((el, i) =>
    el.classList.toggle('active', i === current));
  const s = stations[current];
  coordsEl.textContent = fmtCoord(s);
  stationLbl.textContent = `${s.n} · ${(s.uni || s.kicker || s.title)}`;
  progress.style.width = `${(current / (stations.length - 1)) * 100}%`;
}

function fmtCoord(s) {
  const lat = (34.9 + (s.py - MAP.h/2) * 0.0004).toFixed(2);
  const lon = (56.16 + (s.px - MAP.w/2) * 0.0004).toFixed(2);
  return `${lat}° S · ${lon}° O`;
}

/* --- panel de contenido --- */
function openPanel() {
  const s = stations[current];
  pKicker.textContent = (s.uni || s.kicker || '').toUpperCase();
  pTitle.textContent = s.title;
  pBody.innerHTML = renderBlocks(s);
  document.body.classList.add('reading');
  reading = true;
  frameStation(current, 2.0);
  panel.scrollTop = 0;
}
function closePanel() {
  document.body.classList.remove('reading');
  reading = false;
}

function renderBlocks(s) {
  let out = '';
  if (s.desc) out += `<p class="lead">${s.desc}</p>`;
  if (s.points) out += `<div class="pts"><span class="pts-l">Puntos cartografiados</span>${s.points}</div>`;
  s.blocks.forEach(b => {
    out += (b.kind === 'punto')
      ? `<article class="pt">${b.html}</article>`
      : b.html;
  });
  return out;
}

/* --- leyenda --- */
legend.innerHTML = stations.map((s, i) => `
  <button class="lg-item" data-i="${i}">
    <span class="lg-n">${s.n}</span>
    <span class="lg-t">${s.uni || s.kicker || s.title}</span>
  </button>`).join('');
legend.querySelectorAll('.lg-item').forEach(el =>
  el.addEventListener('click', () => go(+el.dataset.i, true)));

/* =========================================================================
   ENTRADA POR SCROLL / TECLADO / TÁCTIL
   ========================================================================= */
let lock = false;
function step(dir) {
  if (lock) return;
  lock = true;
  setTimeout(() => (lock = false), 720);
  go(current + dir);
}

viewport.addEventListener('wheel', e => {
  if (reading) return;
  if (Math.abs(e.deltaY) < 10) return;
  e.preventDefault();
  step(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

addEventListener('keydown', e => {
  if (e.key === 'Escape' && reading) return go(current, false);
  if (reading) return;
  if (['ArrowDown','ArrowRight','PageDown'].includes(e.key)) { e.preventDefault(); step(1); }
  if (['ArrowUp','ArrowLeft','PageUp'].includes(e.key))    { e.preventDefault(); step(-1); }
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(); }
});

/* táctil */
let ty0 = null;
viewport.addEventListener('touchstart', e => { if (!reading) ty0 = e.touches[0].clientY; }, { passive: true });
viewport.addEventListener('touchend', e => {
  if (reading || ty0 === null) return;
  const dy = ty0 - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 40) step(dy > 0 ? 1 : -1);
  ty0 = null;
}, { passive: true });

document.getElementById('panel-close').addEventListener('click', () => go(current, false));
document.getElementById('enter').addEventListener('click', () => openPanel());
document.getElementById('open-hint').addEventListener('click', () => openPanel());

/* =========================================================================
   ARRANQUE
   ========================================================================= */
drawPins();
updateChrome();
addEventListener('resize', () => frameStation(current));
requestAnimationFrame(() => {
  frameStation(0);
  document.body.classList.add('ready');
});
