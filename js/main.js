/* Shared behaviour + page renderers. No backend, no build step. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const D = window.PORTFOLIO;
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const ext = u => /^https?:/.test(u);
  const imgTag = (src, alt) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'img-fallback',textContent:'</>'}))">`;

  /* ---------------- Page transitions ---------------- */
  const curtain = document.createElement('div');
  curtain.className = 'curtain'; curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span></span>'.repeat(6);
  document.body.append(curtain);

  window.navigateTo = url => {
    if (reduce) { location.href = url; return; }
    document.documentElement.classList.add('leaving');
    setTimeout(() => { location.href = url; }, 480);
  };
  addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove('leaving'); });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const h = a.getAttribute('href');
    if (!h || h.startsWith('#') || h.startsWith('mailto:') || ext(h)) return;
    e.preventDefault(); navigateTo(h);
  });

  /* ---------------- Toast ---------------- */
  const toastEl = document.createElement('div');
  toastEl.className = 'toast'; toastEl.setAttribute('role', 'status');
  document.body.append(toastEl);
  let toastT;
  const toast = msg => {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(D.email); toast('Email address copied'); }
    catch { toast(D.email); }
  };

  /* ---------------- Mobile menu ---------------- */
  const menuBtn = $('#menu-btn'), nav = $('#nav');
  if (menuBtn) menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  /* ---------------- Pointer effects ---------------- */
  let mx = innerWidth / 2, my = innerHeight * .3, raf = 0;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      document.documentElement.style.setProperty('--mx', mx + 'px');
      document.documentElement.style.setProperty('--my', my + 'px');
    });
  }, { passive: true });

  if (fine && !reduce) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring'; ring.setAttribute('aria-hidden', 'true');
    document.body.append(ring);
    let rx = mx, ry = my;
    (function follow() {
      rx += (mx - rx) * .22; ry += (my - ry) * .22;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(follow);
    })();
    addEventListener('pointermove', () => ring.classList.add('on'), { once: true });
    document.addEventListener('pointerover', e => {
      ring.classList.toggle('big', !!e.target.closest('a, button, [role="button"], .project, .badge-item, .cat, canvas.pointing'));
    });
    document.documentElement.addEventListener('mouseleave', () => ring.classList.remove('on'));
    document.documentElement.addEventListener('mouseenter', () => ring.classList.add('on'));
  }

  // Cards: glare follows the pointer, optional tilt
  function bindCards(root = document) {
    $$('.card', root).forEach(c => {
      if (c.dataset.bound) return; c.dataset.bound = '1';
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--gx', x * 100 + '%'); c.style.setProperty('--gy', y * 100 + '%');
        if (fine && !reduce && c.hasAttribute('data-tilt'))
          c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 8}deg) translateY(-3px)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
  }

  /* ---------------- Letter-rise headings ----------------
     Letters slide up out of a mask. Nothing changes width, so the text never reflows. */
  function splitReveal(el) {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = ''; el.classList.add('rv');
    let i = 0;
    text.split(' ').forEach((w, wi, arr) => {
      const ws = document.createElement('span'); ws.className = 'word'; ws.setAttribute('aria-hidden', 'true');
      [...w].forEach(c => {
        const ch = document.createElement('span'); ch.className = 'ch'; ch.style.setProperty('--i', i++); ch.textContent = c; ws.append(ch);
      });
      el.append(ws); if (wi < arr.length - 1) el.append(' ');
    });
  }
  const inView = (els, cb, th = .25) => {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); cb(en.target); } }), { threshold: th });
    els.forEach(e => io.observe(e));
  };
  const initScramble = () => {
    if (reduce) return;
    const els = $$('[data-scramble]'); els.forEach(splitReveal);
    inView(els, el => el.classList.add('go'), .1);
  };

  function countUp(el) {
    const to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
    const t0 = performance.now(), d = 1400;
    (function t(now) {
      const p = Math.min((now - t0) / d, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(t);
    })(t0);
  }

  /* ---------------- Command palette ---------------- */
  const pages = [
    ['Home', 'index.html', 'page'], ['Projects', 'projects.html', 'page'], ['Skills', 'skills.html', 'page'], ['Full map', 'map.html', 'page'],
    ['Experience', 'experience.html', 'page'], ['Academics & certificates', 'academics.html', 'page'], ['Contact', 'contact.html', 'page']
  ];
  const cmds = [
    ...pages.map(([t, u]) => ({ t: 'Go to ' + t, s: 'page', k: t, run: () => navigateTo(u) })),
    ...D.projects.map(p => ({ t: p.title.split(':')[0], s: 'project', k: p.tags.join(' '), run: () => navigateTo('projects.html?open=' + p.id) })),
    { t: 'Copy email address', s: 'action', k: 'mail contact', run: copyEmail },
    { t: 'Download resume', s: 'action', k: 'cv', run: () => window.open('https://flowcv.com/resume/rqnekh3fdcvd', '_blank', 'noopener') },
    { t: 'Open GitHub', s: 'link', k: 'code', run: () => window.open('https://github.com/Hk-Hacker-Harsh', '_blank', 'noopener') },
    { t: 'Open LinkedIn', s: 'link', k: 'network', run: () => window.open('https://linkedin.com/in/harsh-khandal-4941522b1/', '_blank', 'noopener') },
    { t: 'Open TryHackMe profile', s: 'link', k: 'ctf', run: () => window.open('https://tryhackme.com/p/Hk.Hacker', '_blank', 'noopener') }
  ];
  const pal = document.createElement('div');
  pal.className = 'palette'; pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-modal', 'true'); pal.setAttribute('aria-label', 'Command menu');
  pal.innerHTML = `<div class="palette-box"><input type="text" placeholder="Jump to a page, project or action" aria-label="Search commands" autocomplete="off" spellcheck="false"><ul class="palette-list" role="listbox"></ul><div class="palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>`;
  document.body.append(pal);
  const pIn = $('input', pal), pList = $('.palette-list', pal);
  let pItems = [], pSel = 0, pLast = null;
  function pRender() {
    const q = pIn.value.trim().toLowerCase();
    pItems = cmds.filter(c => !q || (c.t + ' ' + c.k + ' ' + c.s).toLowerCase().includes(q)).slice(0, 30);
    pSel = Math.min(pSel, Math.max(pItems.length - 1, 0));
    pList.innerHTML = pItems.length
      ? pItems.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === pSel}">${esc(c.t)}<small>${c.s}</small></li>`).join('')
      : `<li class="palette-empty" style="cursor:default">Nothing matches “${esc(q)}”. Try a skill like python or ctf.</li>`;
    const sel = $('[aria-selected="true"]', pList); if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  const pOpen = () => { pLast = document.activeElement; pal.classList.add('open'); pIn.value = ''; pSel = 0; pRender(); pIn.focus(); };
  const pClose = () => { pal.classList.remove('open'); if (pLast) pLast.focus(); };
  const pRun = i => { const c = pItems[i]; if (!c) return; pClose(); c.run(); };
  $('#palette-open')?.addEventListener('click', pOpen);
  pal.addEventListener('mousedown', e => { if (e.target === pal) pClose(); });
  pIn.addEventListener('input', () => { pSel = 0; pRender(); });
  pList.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) pRun(+li.dataset.i); });
  pList.addEventListener('mousemove', e => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== pSel) { pSel = +li.dataset.i; $$('li', pList).forEach((x, i) => x.setAttribute('aria-selected', i === pSel)); } });
  pIn.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); pSel = (pSel + 1) % Math.max(pItems.length, 1); pRender(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); pSel = (pSel - 1 + pItems.length) % Math.max(pItems.length, 1); pRender(); }
    else if (e.key === 'Enter') { e.preventDefault(); pRun(pSel); }
  });

  /* ---------------- Modal helper ---------------- */
  function makeModal(extraClass = '') {
    const m = document.createElement('div');
    m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="modal-box ${extraClass}"><button class="modal-close" aria-label="Close">&times;</button><div class="modal-content"></div></div>`;
    document.body.append(m);
    let last = null;
    const api = {
      el: m, body: $('.modal-content', m),
      open(html) { last = document.activeElement; api.body.innerHTML = html; m.classList.add('open'); document.body.style.overflow = 'hidden'; $('.modal-close', m).focus(); },
      close() { m.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); }
    };
    m.addEventListener('mousedown', e => { if (e.target === m) api.close(); });
    $('.modal-close', m).addEventListener('click', api.close);
    return api;
  }

  /* ---------------- Global keys + easter egg ---------------- */
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kpos = 0;
  addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.classList.contains('open') ? pClose() : pOpen(); return; }
    if (e.key === '/' && !typing && !pal.classList.contains('open')) { e.preventDefault(); pOpen(); return; }
    if (e.key === 'Escape') {
      if (pal.classList.contains('open')) pClose();
      $$('.modal.open').forEach(m => $('.modal-close', m).click());
      nav?.classList.remove('open'); menuBtn?.setAttribute('aria-expanded', 'false');
    }
    if (!typing) {
      kpos = e.key.toLowerCase() === KONAMI[kpos].toLowerCase() ? kpos + 1 : (e.key === KONAMI[0] ? 1 : 0);
      if (kpos === KONAMI.length) {
        kpos = 0;
        const root = document.documentElement, on = root.dataset.theme !== 'matrix';
        root.dataset.theme = on ? 'matrix' : '';
        toast(on ? 'Access granted. Welcome to the matrix.' : 'Back to amber.');
      }
    }
  });

  /* ======================================================================
     Page renderers
     ====================================================================== */

  /* ---------- Home ---------- */
  function home() {
    // Terminal: reads the static list, then types it out
    const body = $('#term-body');
    const items = $$('li', body).map(li => ({ k: li.dataset.k, html: li.innerHTML }));
    const finalHTML = `<div><span class="prompt">$</span> whoami</div>` + items.map(i => `<div><span class="k">${i.k}</span> ${i.html}</div>`).join('');
    if (reduce) { body.innerHTML = finalHTML; }
    else {
      body.innerHTML = '';
      const tmp = document.createElement('div'); tmp.innerHTML = finalHTML;
      const rows = [...tmp.children];
      let ri = 0;
      const next = () => {
        if (ri >= rows.length) { body.insertAdjacentHTML('beforeend', '<div><span class="prompt">$</span> <span class="caret"></span></div>'); return; }
        const row = rows[ri++], out = document.createElement('div');
        body.append(out);
        const plain = row.textContent; let n = 0;
        const t = setInterval(() => {
          n += 3;
          if (n >= plain.length) { clearInterval(t); out.innerHTML = row.innerHTML; setTimeout(next, 70); }
          else out.textContent = plain.slice(0, n);
        }, 16);
      };
      setTimeout(next, 500);
    }

    // Stats
    $('[data-count-projects]').dataset.count = D.projects.length;
    $('[data-count-certs]').dataset.count = D.certs.length;
    inView($$('[data-count]'), countUp, .6);

    // Recent builds
    const feat = ['whats-going-on', 'ccrm', 'placement-portal'].map(id => D.projects.find(p => p.id === id));
    $('#featured').innerHTML = feat.map(p => `
      <a class="card project" data-tilt href="projects.html?open=${esc(p.id)}">
        <div class="project-img">${imgTag(p.img, p.title)}</div>
        <div class="project-body"><h3>${esc(p.title.split(':')[0])}</h3><p>${esc(p.short)}</p>
        <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
      </a>`).join('');

    // Moments (real photos). Section stays hidden until data.js has entries.
    const mo = $('#moments');
    if (mo && D.gallery && D.gallery.length) {
      const mm = makeModal();
      $('#moments-strip').innerHTML = D.gallery.map((g, i) => `
        <button class="moment" data-i="${i}" aria-label="${esc(g.caption)}">
          <span class="moment-img">${imgTag(g.img, g.caption)}</span>
          <span class="moment-cap"><span class="tag">${esc(g.date || 'Moment')}</span><b>${esc(g.caption)}</b></span>
        </button>`).join('');
      $('#moments-strip').addEventListener('click', e => {
        const b = e.target.closest('.moment'); if (!b) return; const g = D.gallery[+b.dataset.i];
        mm.open(`<div class="modal-img" style="aspect-ratio:auto;max-height:70vh"><img src="${esc(g.img)}" alt="${esc(g.caption)}" style="object-fit:contain;max-height:70vh;margin:auto"></div><div class="modal-text"><div class="modal-tags"><span class="tag">${esc(g.date || 'Moment')}</span></div><h2>${esc(g.caption)}</h2>${g.note ? `<p>${esc(g.note)}</p>` : ''}</div>`);
      });
      mo.hidden = false;
    }

    initScramble(); bindCards();
    const cv = $('#graph');
    if (cv && window.initGraph) window.initGraph(cv);
  }

  /* ---------- Projects ---------- */
  function projects() {
    const grid = $('#projects-grid'), chipsEl = $('#chips'), q = $('#q'), count = $('#count');
    const tagCount = {};
    D.projects.forEach(p => p.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    const tags = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a] || a.localeCompare(b));
    // Unknown tags (e.g. "vapt") are kept on purpose so the empty state explains itself.
    let active = (params.get('filter') || 'all').toLowerCase();

    chipsEl.innerHTML = [`<button class="chip" data-t="all" aria-pressed="false">all<small>${D.projects.length}</small></button>`]
      .concat(tags.map(t => `<button class="chip" data-t="${esc(t)}" aria-pressed="false">${esc(t)}<small>${tagCount[t]}</small></button>`)).join('');

    const modal = makeModal();
    function openProject(p) {
      modal.open(`
        <div class="modal-img">${imgTag(p.img, p.title)}</div>
        <div class="modal-text">
          <div class="modal-tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <h2>${esc(p.title)}</h2><p>${esc(p.full)}</p>
          <div class="modal-links">${p.links.map((l, i) => `<a class="btn ${i ? '' : 'btn-primary'} btn-sm" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>
        </div>`);
    }

    function render() {
      const term = q.value.trim().toLowerCase();
      const list = D.projects.filter(p =>
        (active === 'all' || p.tags.includes(active)) &&
        (!term || (p.title + ' ' + p.short + ' ' + p.tags.join(' ')).toLowerCase().includes(term)));
      $$('.chip', chipsEl).forEach(c => c.setAttribute('aria-pressed', c.dataset.t === active));
      count.textContent = `${list.length} of ${D.projects.length} projects`;
      grid.innerHTML = list.length ? list.map(p => `
        <button class="card project" data-tilt data-id="${esc(p.id)}" aria-label="Open ${esc(p.title)}">
          <div class="project-img">${imgTag(p.img, '')}</div>
          <div class="project-body"><h3>${esc(p.title)}</h3><p>${esc(p.short)}</p>
          <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
        </button>`).join('')
        : `<div class="empty"><b>No projects match${active !== 'all' ? ' “' + esc(active) + '”' : ''} yet</b>Try a different tag or clear the search.<br><button class="btn btn-sm" id="reset">Show all projects</button></div>`;
      bindCards(grid);
    }
    chipsEl.addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return; active = c.dataset.t; render(); });
    q.addEventListener('input', render);
    grid.addEventListener('click', e => {
      const card = e.target.closest('.project[data-id]');
      if (card) openProject(D.projects.find(p => p.id === card.dataset.id));
      if (e.target.id === 'reset') { active = 'all'; q.value = ''; render(); }
    });
    render();
    const open = params.get('open');
    if (open) { const p = D.projects.find(x => x.id === open); if (p) openProject(p); }
    initScramble();
  }

  /* ---------- Skills ---------- */
  function skills() {
    const keys = Object.keys(D.skills);
    const list = $('#cat-list'), panel = $('#skill-panel');
    const C = 2 * Math.PI * 20;
    list.innerHTML = keys.map(k => {
      const s = D.skills[k];
      return `<button class="cat" role="tab" data-k="${k}" aria-selected="false">
        <span class="ring"><svg viewBox="0 0 48 48"><circle class="bg" cx="24" cy="24" r="20"/><circle class="fg" cx="24" cy="24" r="20" data-off="${s.mastery == null ? C : C * (1 - s.mastery / 100)}"/></svg><b>${s.mastery == null ? '·' : s.mastery + '%'}</b></span>
        <strong>${esc(s.title)}</strong></button>`;
    }).join('');
    function show(k, push) {
      if (!D.skills[k]) k = 'cyber';
      const s = D.skills[k];
      $$('.cat', list).forEach(c => c.setAttribute('aria-selected', c.dataset.k === k));
      panel.innerHTML = `<h2>${esc(s.title)}</h2>` + s.items.map(i => `
        <a class="skill-row" href="projects.html?filter=${encodeURIComponent(i.tag)}">
          <div class="skill-top"><span>${esc(i.name)}</span>${i.level == null ? '' : `<span class="pct">${i.level}%</span>`}</div>
          ${i.level == null ? '' : `<div class="bar"><i data-w="${i.level}"></i></div>`}
          <p class="skill-hint">See related projects</p>
        </a>`).join('');
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.bar i', panel).forEach(b => { b.style.width = b.dataset.w + '%'; })));
      if (push) history.replaceState(null, '', '#' + k);
    }
    list.addEventListener('click', e => { const c = e.target.closest('.cat'); if (c) show(c.dataset.k, true); });
    show(location.hash.slice(1) || params.get('type') || 'cyber');
    setTimeout(() => $$('.ring .fg', list).forEach(c => { c.style.strokeDasharray = C; c.style.strokeDashoffset = C; requestAnimationFrame(() => { c.style.strokeDashoffset = c.dataset.off; }); }), 150);
    addEventListener('hashchange', () => show(location.hash.slice(1)));
    initScramble();
  }

  /* ---------- Experience ---------- */
  function experience() {
    const tl = $('#timeline');
    tl.innerHTML = '<div class="progress"></div>' + D.experience.map((x, i) => {
      const k = { ongoing: '', success: 'ok', fail: 'bad' }[x.status.type];
      return `<div class="t-item"><span class="t-dot"></span>
        <article class="card exp" data-tilt>
          <div class="exp-head"><div><h3>${esc(x.title)}</h3><div class="exp-org">${esc(x.org)}</div></div><span class="exp-period">${esc(x.period)}</span></div>
          <p class="desc">${esc(x.desc)}</p>
          <button class="expand" aria-expanded="false" aria-controls="ex-${i}"><i>+</i> <span>View insights</span></button>
          <div class="extra" id="ex-${i}"><div><div class="extra-in">
            ${x.photo ? `<figure class="exp-photo"><img src="${esc(x.photo)}" alt="${esc(x.photoCaption || x.org)}" loading="lazy" onerror="this.closest('figure').remove()">${x.photoCaption ? `<figcaption>${esc(x.photoCaption)}</figcaption>` : ''}</figure>` : ''}
            <h4>Learnings</h4><p>${esc(x.learnings)}</p>
            <h4>Status</h4><p><span class="tag ${k}">${esc(x.status.type === 'ongoing' ? 'Ongoing' : x.status.type === 'success' ? 'Success' : 'Failed')}</span></p>
            ${x.status.type !== 'ongoing' ? `<p style="margin-top:10px">${esc(x.status.text.replace(/^(Success|Failed) - /, ''))}</p>` : ''}
            ${x.stats ? `<h4>${esc(x.statsTitle)}</h4><div class="mini-stats">${x.stats.map(s => `<div><b>${esc(s.v)}</b><span>${esc(s.l)}</span></div>`).join('')}</div>` : ''}
            ${x.links.length ? `<h4>Links</h4><div class="extra-links">${x.links.map(l => `<a class="btn btn-sm" href="${esc(l.url)}"${ext(l.url) ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`).join('')}</div>` : ''}
          </div></div></div>
        </article></div>`;
    }).join('');
    tl.addEventListener('click', e => {
      const b = e.target.closest('.expand'); if (!b) return;
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open); $('span', b).textContent = open ? 'Close insights' : 'View insights';
      $('#' + b.getAttribute('aria-controls')).classList.toggle('open', open);
    });
    const items = $$('.t-item', tl);
    function onScroll() {
      const r = tl.getBoundingClientRect(), mid = innerHeight * .6;
      tl.style.setProperty('--p', Math.max(0, Math.min(1, (mid - r.top) / r.height)).toFixed(3));
      items.forEach(it => { if (it.getBoundingClientRect().top < mid) it.classList.add('seen'); });
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    bindCards(tl); initScramble();
  }

  /* ---------- Academics ---------- */
  function academics() {
    $('#edu').innerHTML = D.education.map(e => `
      ${e.url ? `<a class="card edu" data-tilt href="${esc(e.url)}" target="_blank" rel="noopener">` : `<div class="card edu" data-tilt>`}
        <div><h3>${esc(e.title)}</h3><div class="where">${esc(e.where)}</div><p class="meta">${esc(e.meta)}</p></div>
        <div class="chips-row">${e.chips.map(c => `<span class="tag ${{ ongoing: '', ok: 'ok', future: 'future', mute: 'mute', score: 'score' }[c.k]}">${esc(c.t)}</span>`).join('')}</div>
      ${e.url ? '</a>' : '</div>'}`).join('');

    const vault = $('#vault');
    vault.innerHTML = D.badges.map((b, i) => `<button class="card badge-item" data-tilt data-i="${i}" aria-label="${esc(b.title)}">${imgTag(b.img, b.title)}</button>`).join('');
    const bm = makeModal('badge-modal');
    vault.addEventListener('click', e => {
      const b = e.target.closest('.badge-item'); if (!b) return; const x = D.badges[+b.dataset.i];
      bm.open(`<div class="modal-text">${imgTag(x.img, x.title)}<h2>${esc(x.title)}</h2><p>${esc(x.desc)}</p><div class="modal-links"><a class="btn btn-primary btn-sm" href="${esc(x.verify)}" target="_blank" rel="noopener">Verify</a></div></div>`);
    });

    const LABEL = { all: 'All', cert: 'Certifications', course: 'Courses', comp: 'Competitions', other: 'Others' };
    const cnt = k => k === 'all' ? D.certs.length : D.certs.filter(c => c.cat === k).length;
    $('#tabs').innerHTML = Object.keys(LABEL).map((k, i) => `<button class="chip" role="tab" data-k="${k}" aria-selected="${i === 0}">${LABEL[k]}<small>${cnt(k)}</small></button>`).join('');
    const grid = $('#certs-grid');
    grid.innerHTML = D.certs.map(c => `
      <article class="card cert" data-tilt data-cat="${c.cat}">
        <span class="tag ${c.cat === 'cert' ? '' : 'mute'}">${LABEL[c.cat].replace(/s$/, '')}</span>
        <h3>${esc(c.title)}</h3><span class="issuer">${esc(c.issuer)} · ${esc(c.date)}</span>
        <div class="acts"><a href="viewer.html?file=${encodeURIComponent(c.file)}">View certificate</a>
        ${c.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>
      </article>`).join('');
    $('#tabs').addEventListener('click', e => {
      const t = e.target.closest('.chip'); if (!t) return;
      $$('#tabs .chip').forEach(x => x.setAttribute('aria-selected', x === t));
      $$('.cert', grid).forEach(c => { c.hidden = t.dataset.k !== 'all' && c.dataset.cat !== t.dataset.k; });
    });
    bindCards(); initScramble();
  }

  /* ---------- Contact ---------- */
  function contact() {
    $('#copy-email').addEventListener('click', copyEmail);
    const form = $('#contact-form'), status = $('#form-status');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(form);
      const subject = (f.get('title') || '').toString().trim();
      const body = `${f.get('message')}\n\n-- \nReply to: ${f.get('email')}`;
      // No backend: this opens the visitor's mail app with the message filled in.
      location.href = `mailto:${D.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.className = 'form-status ok';
      status.textContent = 'Your mail app should open with the message ready. If nothing opens, copy my email above.';
    });
    bindCards(); initScramble();
  }

  /* ---------- Viewer ---------- */
  function viewer() {
    const file = params.get('file') || '';
    const area = $('#display-area'), name = $('#file-name'), dl = $('#file-open');
    // Only allow files inside /assets (the old viewer injected the raw value into innerHTML).
    const safe = /^assets\/[\w\-./ %()]+\.(pdf|png|jpe?g|webp)$/i.test(file) && !file.includes('..');
    if (!safe) {
      area.innerHTML = '<div class="empty"><b>No credential selected</b>Open one from the academics or experience pages.<br><a class="btn btn-sm" href="academics.html">Browse certificates</a></div>';
      dl.hidden = true; name.textContent = ''; return;
    }
    name.textContent = decodeURIComponent(file.split('/').pop());
    dl.href = file;
    if (/\.pdf$/i.test(file)) {
      const emb = document.createElement('iframe');
      emb.src = file; emb.className = 'cert-display'; emb.title = name.textContent;
      area.append(emb);
    } else {
      const img = document.createElement('img');
      img.src = file; img.alt = name.textContent; img.className = 'cert-display';
      img.onerror = () => { area.innerHTML = '<div class="empty"><b>File not found</b>This credential has not been uploaded to the assets folder yet.</div>'; };
      area.append(img);
    }
  }

  ({ home, projects, skills, experience, academics, contact, viewer, map: () => {} }[page] || initScramble)();
})();
