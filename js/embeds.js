/* =========================================================================
   EMBEDS SOCIALES (solo web) — Instagram, TikTok, YouTube
   Reemplaza cada <div data-embed="..." data-url="..."> por el embed real.
   - YouTube      → <iframe> (siempre confiable)
   - Instagram    → blockquote oficial + carga de embed.js (con fallback a card)
   - TikTok       → blockquote oficial + carga de embed.js (con fallback a card)
   Para varios posts en fila: data-embed="instagram" data-multi="url1;url2;url3".
   El PDF ignora estos bloques; viven solo en la web.
   ========================================================================= */
(function () {
  'use strict';

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---- carga perezosa (una sola vez) de los scripts oficiales ---- */
  const loaded = {};
  function loadScript(src, key) {
    if (loaded[key]) return loaded[key];
    loaded[key] = new Promise((res) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.body.appendChild(s);
    });
    return loaded[key];
  }

  /* ---- YouTube: extraer ID y armar iframe ---- */
  function ytId(url) {
    const m = url.match(/(?:youtu\.be\/|watch\?v=|\/embed\/|\/shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  function youtube(url) {
    const id = ytId(url);
    const wrap = document.createElement('div');
    wrap.className = 'emb-yt';
    if (!id) { wrap.appendChild(cardLink(url, 'YouTube')); return wrap; }
    wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" title="Video de YouTube"
      loading="lazy" frameborder="0" allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
    return wrap;
  }

  /* ---- card de respaldo (link elegante con la identidad de la bitácora) ---- */
  function cardLink(url, red) {
    const a = document.createElement('a');
    a.className = 'emb-card';
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    let handle = '';
    try {
      const u = new URL(url);
      handle = u.pathname.replace(/\/(p|reel|reels|video|watch|embed)\/.*$/, '')
        .replace(/^\//, '').replace(/\/$/, '');
    } catch (e) {}
    a.innerHTML =
      `<span class="emb-c-red">${esc(red)}</span>` +
      (handle ? `<span class="emb-c-h">@${esc(handle)}</span>` : '') +
      `<span class="emb-c-cta">Ver publicación →</span>`;
    return a;
  }

  /* ---- Instagram: blockquote oficial (+ fallback) ---- */
  function instagram(url) {
    const wrap = document.createElement('div');
    wrap.className = 'emb-ig';
    const clean = url.split('?')[0];
    wrap.innerHTML =
      `<blockquote class="instagram-media" data-instgrm-permalink="${esc(clean)}"
        data-instgrm-version="14" style="margin:0;max-width:340px;width:100%;min-width:240px"></blockquote>`;
    // fallback visible mientras carga / si falla
    const fb = cardLink(url, 'Instagram');
    fb.classList.add('emb-fallback');
    wrap.appendChild(fb);
    loadScript('https://www.instagram.com/embed.js', 'ig').then((ok) => {
      if (ok && window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
        // si el blockquote se llenó, ocultar el fallback
        setTimeout(() => {
          const q = wrap.querySelector('.instagram-media');
          if (q && q.querySelector('iframe')) fb.style.display = 'none';
        }, 1200);
      }
    });
    return wrap;
  }

  /* ---- TikTok: blockquote oficial (+ fallback) ---- */
  function tiktokId(url) {
    const m = url.match(/\/video\/(\d+)/);
    return m ? m[1] : '';
  }
  function tiktok(url) {
    const wrap = document.createElement('div');
    wrap.className = 'emb-tt';
    const id = tiktokId(url);
    wrap.innerHTML =
      `<blockquote class="tiktok-embed" cite="${esc(url)}" data-video-id="${esc(id)}"
        style="max-width:340px;min-width:240px;margin:0"><section></section></blockquote>`;
    const fb = cardLink(url, 'TikTok');
    fb.classList.add('emb-fallback');
    wrap.appendChild(fb);
    loadScript('https://www.tiktok.com/embed.js', 'tt').then((ok) => {
      setTimeout(() => {
        const q = wrap.querySelector('.tiktok-embed');
        if (q && q.querySelector('iframe')) fb.style.display = 'none';
      }, 1600);
    });
    return wrap;
  }

  function facebook(url) {
    const wrap = document.createElement('div');
    wrap.className = 'emb-fb';
    wrap.appendChild(cardLink(url, 'Facebook'));
    return wrap;
  }

  const BUILDERS = { youtube: youtube, instagram: instagram, tiktok: tiktok, facebook: facebook };

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
