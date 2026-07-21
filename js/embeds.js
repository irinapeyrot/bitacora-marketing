/* =========================================================================
   EMBEDS SOCIALES (solo web) — Instagram, Facebook, TikTok, YouTube
   Reemplaza cada <div data-embed="..." data-url="..."> por su representación.

   - YouTube  → <iframe> reproducible (siempre confiable).
   - Instagram / Facebook / TikTok → TARJETA DE PREVIEW enriquecida
     (miniatura + título + bajada + red), al estilo del recuadro que aparece
     cuando pegás un enlace en WhatsApp o Slack. Los datos se obtienen de la
     metadata Open Graph de la publicación vía microlink.io (API pública).
     Si no se puede recuperar el preview, cae a una tarjeta de enlace simple.

   Para varias piezas en fila: data-embed="instagram" data-multi="url1;url2;url3".
   El PDF ignora estos bloques; viven solo en la web.
   ========================================================================= */
(function () {
  'use strict';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const NAMES = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube' };

  /* ---- handle / cuenta a partir de la URL (para el pie de la tarjeta) ---- */
  function handleOf(url) {
    try {
      const u = new URL(url);
      let p = u.pathname;
      // instagram.com/<cuenta>/p/xxx  ·  tiktok.com/@cuenta/video/xxx  ·  facebook.com/<cuenta>/...
      p = p.replace(/\/(p|reel|reels|video|watch|embed|posts|photos|videos)(\/.*)?$/, '');
      p = p.replace(/^\//, '').replace(/\/$/, '');
      if (!p || p === 'watch') return '';
      return p.startsWith('@') ? p : '@' + p;
    } catch (e) { return ''; }
  }

  /* ---- YouTube: iframe reproducible ---- */
  function ytId(url) {
    const m = url.match(/(?:youtu\.be\/|watch\?v=|\/embed\/|\/shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  function youtube(url) {
    const id = ytId(url);
    const wrap = document.createElement('div');
    wrap.className = 'emb-yt';
    if (!id) { wrap.appendChild(cardSimple(url, 'youtube')); return wrap; }
    wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" title="Video de YouTube"
      loading="lazy" frameborder="0" allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
    return wrap;
  }

  /* ---- tarjeta simple de respaldo (sin imagen) ---- */
  function cardSimple(url, red) {
    const a = document.createElement('a');
    a.className = 'emb-card emb-card-plain emb-' + red;
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    const h = handleOf(url);
    a.innerHTML =
      `<span class="emb-c-top"><span class="emb-c-red">${esc(NAMES[red] || red)}</span>` +
      (h ? `<span class="emb-c-h">${esc(h)}</span>` : '') + `</span>` +
      `<span class="emb-c-cta">Ver publicación →</span>`;
    return a;
  }

  /* ---- tarjeta de PREVIEW enriquecida (miniatura + título + bajada) ---- */
  function cardPreview(url, red) {
    const a = document.createElement('a');
    a.className = 'emb-card emb-card-rich emb-' + red + ' is-loading';
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    const h = handleOf(url);
    a.innerHTML =
      `<div class="emb-thumb" aria-hidden="true"><span class="emb-thumb-ph"></span></div>
       <div class="emb-info">
         <span class="emb-c-red">${esc(NAMES[red] || red)}</span>
         <span class="emb-c-title">Cargando publicación…</span>
         ${h ? `<span class="emb-c-h">${esc(h)}</span>` : ''}
         <span class="emb-c-cta">Ver publicación →</span>
       </div>`;

    // pedir metadata Open Graph a microlink (imagen + título + descripción)
    const api = 'https://api.microlink.io/?url=' + encodeURIComponent(url) +
                '&audio=false&video=false&meta=true';
    fetch(api).then((r) => r.json()).then((res) => {
      if (!res || res.status !== 'success' || !res.data) { a.classList.remove('is-loading'); a.classList.add('is-plain'); return; }
      const d = res.data;
      const img = d.image && d.image.url ? d.image.url
                : (d.logo && d.logo.url ? d.logo.url : '');
      const titulo = (d.title || '').trim();
      const desc = (d.description || '').trim();
      const thumb = a.querySelector('.emb-thumb');
      const tEl = a.querySelector('.emb-c-title');
      if (img) {
        thumb.innerHTML = `<img src="${esc(img)}" alt="" loading="lazy">`;
      } else {
        thumb.classList.add('emb-thumb-empty');
      }
      if (titulo) {
        tEl.textContent = titulo.length > 90 ? titulo.slice(0, 88) + '…' : titulo;
      } else {
        tEl.textContent = 'Ver la publicación';
      }
      if (desc) {
        const dEl = document.createElement('span');
        dEl.className = 'emb-c-desc';
        dEl.textContent = desc.length > 130 ? desc.slice(0, 128) + '…' : desc;
        tEl.insertAdjacentElement('afterend', dEl);
      }
      a.classList.remove('is-loading');
    }).catch(() => { a.classList.remove('is-loading'); a.classList.add('is-plain'); });

    return a;
  }

  const BUILDERS = {
    youtube: youtube,
    instagram: (u) => cardPreview(u, 'instagram'),
    facebook:  (u) => cardPreview(u, 'facebook'),
    tiktok:    (u) => cardPreview(u, 'tiktok'),
  };

  /* ---- API pública ---- */
  window.processEmbeds = function (root) {
    if (!root) return;
    root.querySelectorAll('[data-embed]').forEach((ph) => {
      const red = ph.getAttribute('data-embed');
      const build = BUILDERS[red];
      if (!build) return;
      const multi = ph.getAttribute('data-multi');
      const urls = multi ? multi.split(';').map((u) => u.trim()).filter(Boolean)
        : [ph.getAttribute('data-url')].filter(Boolean);
      const cont = document.createElement('div');
      cont.className = 'emb-row' + (urls.length > 1 ? ' emb-multi' : '');
      const cap = ph.getAttribute('data-cap');
      urls.forEach((u) => cont.appendChild(build(u)));
      const outer = document.createElement('div');
      outer.className = 'emb-block';
      outer.appendChild(cont);
      if (cap) {
        const c = document.createElement('div');
        c.className = 'emb-cap';
        c.textContent = cap;
        outer.appendChild(c);
      }
      ph.replaceWith(outer);
    });
  };
})();
