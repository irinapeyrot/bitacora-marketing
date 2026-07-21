/* =========================================================================
   FIGURAS INTERACTIVAS — motor de render (solo web)
   Reemplaza cada <div data-figura="figNN"></div> del contenido por un
   componente interactivo construido a partir de window.FIGURAS[figNN].
   El PDF conserva sus SVGs; esto vive únicamente en la web.
   ========================================================================= */
(function () {
  'use strict';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* marco común: título FIG, hint, cuerpo interactivo y lectura al pie */
  function marco(fig, inner) {
    const hint = fig.hint
      ? `<p class="fig-i-hint">${esc(fig.hint)}</p>` : '';
    const lect = fig.lectura
      ? `<div class="fig-i-lectura"><span class="lbl">Lectura</span>${fig.lectura}</div>` : '';
    return `
      <div class="fig-i" data-tipo="${esc(fig.tipo)}">
        <div class="fig-i-tit"><span class="fnum">FIG. ${esc(fig.num)}</span><span class="fnom">${esc(fig.nom)}</span></div>
        ${hint}
        <div class="fig-i-cuerpo">${inner}</div>
        ${lect}
      </div>`;
  }

  /* panel de detalle reutilizable (debajo de la mayoría de los componentes) */
  function detalleBox(id) {
    return `<div class="fig-i-detalle" id="${id}" hidden></div>`;
  }

  /* =====================================================================
     TIMELINE — pasos numerados sobre un eje horizontal
     ===================================================================== */
  function renderTimeline(fig, uid) {
    const box = `${uid}-d`;
    const escala = (fig.escala && fig.escala.length === 2)
      ? `<div class="tl-escala"><span>${esc(fig.escala[0])}</span><span>${esc(fig.escala[1])}</span></div>` : '';
    const steps = fig.pasos.map((p, i) => `
      <button class="tl-step" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(p.t)}" data-k="${esc(p.k || '')}" data-body="${esc(p.body)}">
        <span class="tl-dot"></span>
        <span class="tl-n">${esc(p.n || (i + 1))}</span>
        <span class="tl-t">${esc(p.t)}</span>
        ${p.k ? `<span class="tl-k">${esc(p.k)}</span>` : ''}
      </button>`).join('');
    return marco(fig, `
      <div class="tl">
        <div class="tl-track">${steps}</div>
        ${escala}
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     PIRÁMIDE — niveles apilados (arriba = más elevada)
     ===================================================================== */
  function renderPiramide(fig, uid) {
    const box = `${uid}-d`;
    const n = fig.niveles.length;
    const rows = fig.niveles.map((lv, i) => {
      // ancho creciente hacia abajo (base ancha)
      const w = 42 + (i / (n - 1)) * 58; // 42%..100%
      return `
        <button class="pir-row" data-box="${box}" style="width:${w.toFixed(1)}%"
          type="button" data-t="${esc(lv.t)}" data-body="${esc(lv.body)}">
          <span class="pir-t">${esc(lv.t)}</span>
        </button>`;
    }).join('');
    return marco(fig, `
      <div class="pir">
        <div class="pir-flag pir-top">${esc(fig.topLabel || '')}</div>
        <div class="pir-stack">${rows}</div>
        <div class="pir-flag pir-bottom">${esc(fig.bottomLabel || '')}</div>
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     BALANZA — fórmula + dos platillos (beneficios / costos)
     ===================================================================== */
  function renderBalanza(fig, uid) {
    const box = `${uid}-d`;
    const cols = fig.lados.map((lado) => {
      const items = lado.items.map((it) => `
        <button class="bal-item" data-box="${box}" type="button"
          data-t="${esc(it.l)}" data-body="${esc(it.d)}">
          <span class="bal-sig">${esc(lado.signo)}</span>
          <span class="bal-l">${esc(it.l)}</span>
        </button>`).join('');
      return `
        <div class="bal-col bal-${lado.signo === '+' ? 'ben' : 'cos'}">
          <div class="bal-tit">${esc(lado.t)}</div>
          ${items}
        </div>`;
    }).join('<div class="bal-fulcro">−</div>');
    return marco(fig, `
      <div class="bal-formula">${esc(fig.formula)}</div>
      <div class="bal">${cols}</div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     TARJETAS — grilla de N tarjetas (2-4 col) que expanden su detalle
     ===================================================================== */
  function renderTarjetas(fig, uid) {
    const box = `${uid}-d`;
    const cards = fig.items.map((it, i) => `
      <button class="tj-card" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(it.t)}" data-k="${esc(it.k || '')}" data-body="${esc(it.body)}">
        ${it.n ? `<span class="tj-n">${esc(it.n)}</span>` : ''}
        <span class="tj-t">${esc(it.t)}</span>
        ${it.k ? `<span class="tj-k">${esc(it.k)}</span>` : ''}
      </button>`).join('');
    return marco(fig, `
      <div class="tj" data-cols="${fig.cols || fig.items.length}">${cards}</div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     NÚCLEO — un centro y varios satélites alrededor
     ===================================================================== */
  function renderNucleo(fig, uid) {
    const box = `${uid}-d`;
    const sats = fig.items.map((it, i) => `
      <button class="nu-sat" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(it.t)}" data-k="${esc(it.k || '')}" data-body="${esc(it.body)}">
        <span class="nu-t">${esc(it.t)}</span>
        ${it.k ? `<span class="nu-k">${esc(it.k)}</span>` : ''}
      </button>`).join('');
    const nota = fig.nota ? `<p class="nu-nota">${esc(fig.nota)}</p>` : '';
    return marco(fig, `
      <div class="nu">
        <div class="nu-centro"><span class="nu-c-t">${esc(fig.centro.t)}</span><span class="nu-c-k">${esc(fig.centro.k || '')}</span></div>
        <div class="nu-sats">${sats}</div>
      </div>
      ${nota}
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     GIRO — comparación en dos columnas emparejadas (A ↔ B)
     ===================================================================== */
  function renderGiro(fig, uid) {
    const box = `${uid}-d`;
    const rows = fig.pares.map((p, i) => `
      <button class="gi-row" data-box="${box}" data-i="${i}" type="button"
        data-body="${esc(p.body)}">
        <span class="gi-a">
          <span class="gi-h">${esc(p.a)}</span>
          ${p.ad ? `<span class="gi-d">${esc(p.ad)}</span>` : ''}
        </span>
        <span class="gi-arrow" aria-hidden="true">→</span>
        <span class="gi-b">
          <span class="gi-h">${esc(p.b)}</span>
          ${p.bd ? `<span class="gi-d">${esc(p.bd)}</span>` : ''}
        </span>
      </button>`).join('');
    return marco(fig, `
      <div class="gi">
        <div class="gi-heads"><span>${esc(fig.ladoA)}</span><span>${esc(fig.ladoB)}</span></div>
        <div class="gi-rows">${rows}</div>
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     ESPECTRO — 3 zonas sobre un eje con extremos etiquetados
     ===================================================================== */
  function renderEspectro(fig, uid) {
    const box = `${uid}-d`;
    const cols = fig.items.map((it, i) => `
      <button class="es-col" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(it.t)}" data-k="${esc(it.k || '')}" data-body="${esc(it.body)}">
        <span class="es-t">${esc(it.t)}</span>
        <span class="es-en">${esc(it.en || '')}</span>
        ${it.detalle ? `<span class="es-det">${esc(it.detalle)}</span>` : ''}
        ${it.k ? `<span class="es-k">${esc(it.k)}</span>` : ''}
      </button>`).join('');
    return marco(fig, `
      <div class="es">
        <div class="es-cols">${cols}</div>
        ${fig.eje ? `<div class="es-eje">${esc(fig.eje)}</div>` : ''}
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     EMBUDO — etapas apiladas que se angostan hacia abajo
     ===================================================================== */
  function renderEmbudo(fig, uid) {
    const box = `${uid}-d`;
    const n = fig.etapas.length;
    const rows = fig.etapas.map((et, i) => {
      const w = 100 - (i / (n)) * 46; // 100%..~54%
      return `
        <button class="emb-row" data-box="${box}" style="width:${w.toFixed(1)}%"
          type="button" data-t="${esc(et.t)}" data-k="${esc(et.k || '')}" data-body="${esc(et.body)}">
          <span class="emb-t">${esc(et.t)}</span>
          ${et.k ? `<span class="emb-k">${esc(et.k)}</span>` : ''}
        </button>`;
    }).join('');
    return marco(fig, `
      <div class="emb">
        <div class="emb-flag emb-top">${esc(fig.topLabel || '')}</div>
        <div class="emb-stack">${rows}</div>
        <div class="emb-flag emb-bottom">${esc(fig.bottomLabel || '')}</div>
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     MATRIZ — 2×2 con eje vertical etiquetado
     ===================================================================== */
  function renderMatriz(fig, uid) {
    const box = `${uid}-d`;
    const cells = fig.cuadrantes.map((c, i) => `
      <button class="mx-cell mx-${esc(c.eje)}" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(c.t)}" data-body="${esc(c.body)}">
        <span class="mx-t">${esc(c.t)}</span>
        <span class="mx-items">${esc(c.items)}</span>
      </button>`).join('');
    const ejeX = (fig.ejeX && fig.ejeX.length === 2)
      ? `<div class="mx-axis-x">
           <span>${esc(fig.ejeX[0])}</span>
           <span>${esc(fig.ejeX[1])}</span>
         </div>` : '';
    return marco(fig, `
      <div class="mx-wrap${fig.ejeX ? ' mx-has-x' : ''}">
        <div class="mx-axis">
          <span>${esc(fig.ejeY ? fig.ejeY[0] : '')}</span>
          <span>${esc(fig.ejeY ? fig.ejeY[1] : '')}</span>
        </div>
        <div class="mx-grid">
          <div class="mx">${cells}</div>
          ${ejeX}
        </div>
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     GRILLA — categorías con ejemplos (tipo tarjetas, con "ej.")
     ===================================================================== */
  function renderGrilla(fig, uid) {
    const box = `${uid}-d`;
    const cards = fig.items.map((it, i) => `
      <button class="gr-card" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(it.t)}" data-k="${esc(it.k || '')}" data-body="${esc(it.body)}">
        <span class="gr-t">${esc(it.t)}</span>
        ${it.k ? `<span class="gr-k">${esc(it.k)}</span>` : ''}
        ${it.ej ? `<span class="gr-ej">${esc(it.ej)}</span>` : ''}
      </button>`).join('');
    return marco(fig, `
      ${fig.sub ? `<div class="gr-sub">${esc(fig.sub)}</div>` : ''}
      <div class="gr" data-cols="${fig.cols || 3}">${cards}</div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     FÓRMULA — términos + ecuación de engagement
     ===================================================================== */
  function renderFormula(fig, uid) {
    const box = `${uid}-d`;
    const terms = fig.terminos.map((t, i) => `
      <button class="fo-term" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(t.t)}" data-body="${esc(t.body)}">
        <span class="fo-t">${esc(t.t)}</span>
        <span class="fo-k">${esc(t.k)}</span>
      </button>`).join('');
    const eq = fig.ecuacion;
    const eqHtml = eq ? `
      <div class="fo-eq">
        <span class="fo-res">${esc(eq.res)}</span>
        <span class="fo-ig">=</span>
        <span class="fo-frac"><span class="fo-num">${esc(eq.num)}</span><span class="fo-den">${esc(eq.den)}</span></span>
        <span class="fo-fac">${esc(eq.factor)}</span>
      </div>
      <p class="fo-pie">${esc(eq.pie)}</p>` : '';
    return marco(fig, `
      <div class="fo-terms">${terms}</div>
      ${eqHtml}
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     TRADUCCIÓN — pregunta de marketing → decisión de diseño
     ===================================================================== */
  function renderTraduccion(fig, uid) {
    const box = `${uid}-d`;
    const rows = fig.pares.map((p, i) => `
      <button class="tr-row" data-box="${box}" data-i="${i}" type="button"
        data-body="${esc(p.body)}">
        <span class="tr-a">${esc(p.a)}</span>
        <span class="tr-arrow" aria-hidden="true">→</span>
        <span class="tr-b">${esc(p.b)}</span>
      </button>`).join('');
    return marco(fig, `
      <div class="tr">
        <div class="tr-heads"><span>${esc(fig.ladoA)}</span><span>${esc(fig.ladoB)}</span></div>
        <div class="tr-rows">${rows}</div>
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     FICHA — Buyer Persona: cabecera con foto + bloques de campos
     ===================================================================== */
  function renderFicha(fig, uid) {
    const box = `${uid}-d`;
    const foto = fig.foto
      ? `<img class="fi-foto" src="${esc(fig.foto)}" alt="${esc(fig.nombre)}" onerror="this.classList.add('sinimg');this.removeAttribute('src');" data-ini="${esc(fig.iniciales || '')}">`
      : `<div class="fi-foto sinimg" data-ini="${esc(fig.iniciales || '')}"></div>`;
    const bloques = fig.bloques.map((bl, i) => `
      <button class="fi-bloque" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(bl.t)}" data-body="${esc(bl.items.join(' · '))}">
        <span class="fi-b-t">${esc(bl.t)}</span>
      </button>`).join('');
    return marco(fig, `
      <div class="fi-card">
        <div class="fi-head">
          ${foto}
          <div class="fi-id">
            <span class="fi-nom">${esc(fig.nombre)}</span>
            <span class="fi-datos">${esc(fig.datos)}</span>
            <span class="fi-lema">“${esc(fig.lema)}”</span>
          </div>
        </div>
        <div class="fi-bloques">${bloques}</div>
      </div>
      ${detalleBox(box)}`);
  }

  /* =====================================================================
     EMPATÍA — mapa: centro + 4 cuadrantes + dos franjas al pie
     ===================================================================== */
  function renderEmpatia(fig, uid) {
    const box = `${uid}-d`;
    const cuad = fig.cuadrantes.map((c, i) => `
      <button class="em-q" data-box="${box}" data-i="${i}" type="button"
        data-t="${esc(c.t)}" data-body="${esc(c.body)}">
        <span class="em-q-t">${esc(c.t)}</span>
      </button>`).join('');
    return marco(fig, `
      <div class="em">
        <div class="em-centro"><span class="em-c-t">${esc(fig.centro.t)}</span><span class="em-c-k">${esc(fig.centro.k || '')}</span></div>
        <div class="em-quads">${cuad}</div>
        <div class="em-franjas">
          <button class="em-franja em-esf" data-box="${box}" type="button" data-t="ESFUERZOS / TEMORES" data-body="${esc(fig.esfuerzos)}">
            <span class="em-f-t">Esfuerzos / temores</span>
          </button>
          <button class="em-franja em-ben" data-box="${box}" type="button" data-t="BENEFICIOS / RESULTADOS ESPERADOS" data-body="${esc(fig.beneficios)}">
            <span class="em-f-t">Beneficios / resultados esperados</span>
          </button>
        </div>
      </div>
      ${detalleBox(box)}`);
  }

  const RENDERERS = {
    ficha: renderFicha,
    empatia: renderEmpatia,
    timeline: renderTimeline,
    piramide: renderPiramide,
    balanza: renderBalanza,
    tarjetas: renderTarjetas,
    nucleo: renderNucleo,
    giro: renderGiro,
    espectro: renderEspectro,
    embudo: renderEmbudo,
    matriz: renderMatriz,
    grilla: renderGrilla,
    formula: renderFormula,
    traduccion: renderTraduccion,
  };

  /* =====================================================================
     interacción: al tocar un elemento con [data-box], mostrar su detalle
     ===================================================================== */
  function activar(root) {
    root.querySelectorAll('[data-box]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const box = document.getElementById(btn.dataset.box);
        if (!box) return;
        const grupo = btn.closest('.fig-i-cuerpo') || root;
        const yaActivo = btn.classList.contains('activo');
        // limpiar hermanos del mismo grupo
        grupo.querySelectorAll('[data-box].activo').forEach((b) => b.classList.remove('activo'));
        if (yaActivo) { box.hidden = true; box.innerHTML = ''; return; }
        btn.classList.add('activo');
        const t = btn.dataset.t || '';
        const k = btn.dataset.k || '';
        const body = btn.dataset.body || '';
        box.innerHTML =
          (t ? `<span class="fig-i-d-t">${t}</span>` : '') +
          (k ? `<span class="fig-i-d-k">${k}</span>` : '') +
          (body ? `<p class="fig-i-d-b">${body}</p>` : '');
        box.hidden = false;
      });
    });
  }

  /* =====================================================================
     API pública: reemplazar placeholders [data-figura] dentro de `root`
     ===================================================================== */
  window.renderFiguras = function (root) {
    if (!root || !window.FIGURAS) return;
    let uidc = 0;
    root.querySelectorAll('[data-figura]').forEach((ph) => {
      const key = ph.getAttribute('data-figura');
      const fig = window.FIGURAS[key];
      if (!fig) return;
      const rend = RENDERERS[fig.tipo];
      if (!rend) return;
      const uid = `figi-${key}-${uidc++}`;
      const wrap = document.createElement('div');
      wrap.innerHTML = rend(fig, uid);
      const node = wrap.firstElementChild;
      ph.replaceWith(node);
      activar(node);
    });
  };
})();
