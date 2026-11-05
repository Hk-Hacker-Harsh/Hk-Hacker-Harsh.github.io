/* Full map: a force-directed graph generated from js/data.js.
   Every link comes from something in the data (a tag, a certificate topic, a project
   listed under an internship), so the map stays honest when you add new content. */
(() => {
  'use strict';
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const col = n => css.getPropertyValue(n).trim();

  const TYPES = {
    me:       { label: 'Me',           c: col('--amber'), r: 30 },
    org:      { label: 'Experience',   c: '#ff8a65',      r: 17 },
    edu:      { label: 'Education',    c: '#7bd88f',      r: 16 },
    skill:    { label: 'Skills',       c: col('--cyan'),  r: 13 },
    project:  { label: 'Projects',     c: '#b69cff',      r: 10 },
    cert:     { label: 'Certificates', c: '#f78fb3',      r: 10 },
    platform: { label: 'Platforms',    c: '#c2c0ba',      r: 14 }
  };

  /* ------------------------------------------------------------ build data */
  const nodes = [], edges = [], byId = {};
  const add = (id, type, label, o = {}) => {
    const n = Object.assign({ id, type, label, r: TYPES[type].r, x: 0, y: 0, vx: 0, vy: 0, hidden: false, links: [] }, o);
    nodes.push(n); byId[id] = n; return n;
  };
  const link = (a, b, rel) => { if (byId[a] && byId[b]) edges.push({ a: byId[a], b: byId[b], rel }); };

  add('me', 'me', 'Harsh', {
    sub: 'Cybersecurity engineer & penetration tester',
    desc: 'IIT Madras BS student, EC-Council CEH v13 certified, currently interning at Rajasthan Police Headquarters. Builds security tools and AI automation.',
    links: [{ label: 'Contact', url: 'contact.html' }], fixed: true
  });

  const ORG_SHORT = { phq: 'Rajasthan Police HQ', apcsip: 'Amroha Police', pustakmart: 'PustakMart (venture)', shadowfox: 'ShadowFox', cfss: 'CFSS' };
  D.experience.forEach(x => add('x-' + x.id, 'org', ORG_SHORT[x.id] || x.org, {
    sub: x.period, desc: x.desc, links: [{ label: 'See experience', url: 'experience.html' }].concat(x.links)
  }));

  add('iitm', 'edu', 'IIT Madras', { sub: 'BS in Data Science & Applications', desc: 'Current enrollment, CGPA 7.91 / 10. Focus: Data Analytics & Security.', links: [{ label: 'Academics', url: 'academics.html' }] });
  add('nielit', 'edu', 'NIELIT', { sub: 'O / A / B / C Level', desc: 'O Level completed, A Level on-going.', links: [{ label: 'Academics', url: 'academics.html' }] });

  add('tryhackme', 'platform', 'TryHackMe', { sub: 'Top 3% rank', desc: 'CTF and training platform. Beginner and Pre Security paths and two Advent of Cyber events completed.', links: [{ label: 'Profile', url: 'https://tryhackme.com/p/Hk.Hacker' }] });
  add('htb', 'platform', 'HackTheBox', { sub: 'CTF player', desc: 'Hands-on hacking labs and CTFs.', links: [{ label: 'Profile', url: 'https://app.hackthebox.com/public/users/798264' }] });
  add('github', 'platform', 'GitHub', { sub: '25+ repositories', desc: 'Code vault for every project on this site.', links: [{ label: 'Profile', url: 'https://github.com/Hk-Hacker-Harsh' }] });

  // Skills: every skill from the skills page, de-duplicated by tag.
  const seen = new Set();
  Object.values(D.skills).forEach(cat => cat.items.forEach(i => {
    if (seen.has(i.tag)) return; seen.add(i.tag);
    add('s-' + i.tag, 'skill', i.name, {
      sub: i.level == null ? 'Skill' : `Skill level ${i.level}%`, level: i.level,
      desc: `Projects tagged "${i.tag}" are linked to this node.`,
      links: [{ label: 'Projects with this tag', url: 'projects.html?filter=' + encodeURIComponent(i.tag) }]
    });
  }));
  D.projects.forEach(p => p.tags.forEach(t => {
    if (!byId['s-' + t]) add('s-' + t, 'skill', t, { sub: 'Tag', desc: `Projects tagged "${t}".`, links: [{ label: 'Projects with this tag', url: 'projects.html?filter=' + t }] });
  }));

  D.projects.forEach(p => add('p-' + p.id, 'project', p.title.split(/[:]| - /)[0].trim(), {
    sub: p.tags.join(' · '), desc: p.short, links: [{ label: 'Open details', url: 'projects.html?open=' + p.id }].concat(p.links)
  }));

  const CERT_PICK = ['EC-Council CEH v13', 'PentesterLab Recon Badge', 'HackJKLU v5.0 Hackathon', 'AoC 2025 - Challenge Completion', 'Cybersecurity Course Completion', 'Ethical Hacking Course Completion'];
  const certIds = {};
  D.certs.filter(c => CERT_PICK.includes(c.title)).forEach((c, i) => {
    const id = 'c-' + i; certIds[c.title] = id;
    add(id, 'cert', c.title.replace(' - Challenge Completion', '').replace(' Course Completion', ' course'), {
      sub: `${c.issuer} · ${c.date}`, desc: `${c.title}, issued by ${c.issuer} on ${c.date}.`,
      links: [{ label: 'View certificate', url: 'viewer.html?file=' + encodeURIComponent(c.file) }].concat(c.links)
    });
  });
  const badge = D.badges.find(b => /AWS/.test(b.title));
  if (badge) add('c-aws', 'cert', 'AWS Cloud Foundations', { sub: 'AWS Academy badge', desc: badge.desc, links: [{ label: 'Verify', url: badge.verify }] });

  /* ------------------------------------------------------------ links */
  ['phq', 'apcsip', 'pustakmart', 'shadowfox', 'cfss'].forEach(k => link('me', 'x-' + k, 'experience'));
  link('me', 'iitm', 'studying'); link('me', 'nielit', 'studying');
  ['tryhackme', 'htb', 'github'].forEach(k => link('me', k, 'profile'));
  nodes.filter(n => n.type === 'skill' && n.level >= 70).forEach(n => link('me', n.id, 'strongest skills (70%+)'));

  const TOOLS = new Set(['python', 'bash', 'html', 'css', 'js', 'php', 'sql', 'bootstrap', 'wordpress', 'n8n', 'godot', 'cad']);
  D.projects.forEach(p => p.tags.forEach(t => link('p-' + p.id, 's-' + t, TOOLS.has(t) ? 'built with' : 'topic')));

  link('x-phq', 's-cyber', 'cyber crime investigation');
  link('x-apcsip', 's-cyber', 'cyber security'); link('x-apcsip', 's-python', 'Python scripting'); link('x-apcsip', 'p-ccrm', 'project built here');
  link('x-shadowfox', 's-python', 'Python'); link('x-shadowfox', 's-cyber', 'cyber security');
  link('x-cfss', 's-cyber', 'penetration testing');
  link('x-pustakmart', 's-wordpress', 'built on'); link('x-pustakmart', 's-startup', 'startup'); link('x-pustakmart', 'p-pustakmart', 'the product');
  link('iitm', 'p-placement-portal', 'MAD-1 course project');
  link('s-networking', 's-cyber', 'same category'); link('s-vapt', 's-cyber', 'same category');
  link('tryhackme', 's-ctf', 'CTF practice'); link('htb', 's-ctf', 'CTF practice');

  const C = t => certIds[t];
  link(C('EC-Council CEH v13'), 's-cyber', 'covers'); link(C('EC-Council CEH v13'), 'me', 'earned');
  link(C('PentesterLab Recon Badge'), 's-cyber', 'covers');
  link(C('HackJKLU v5.0 Hackathon'), 'me', 'competed');
  link(C('AoC 2025 - Challenge Completion'), 'tryhackme', 'earned on'); link(C('AoC 2025 - Challenge Completion'), 's-ctf', 'CTF event');
  link(C('Cybersecurity Course Completion'), 's-cyber', 'covers'); link(C('Cybersecurity Course Completion'), 's-python', 'covers');
  link(C('Cybersecurity Course Completion'), 's-sql', 'covers'); link(C('Cybersecurity Course Completion'), 's-bash', 'covers (Linux)');
  link(C('Ethical Hacking Course Completion'), 's-cyber', 'covers');
  link('c-aws', 'me', 'earned');

  const nbrs = n => edges.filter(e => e.a === n || e.b === n).map(e => ({ n: e.a === n ? e.b : e.a, rel: e.rel }));
  nodes.forEach(n => { n.deg = nbrs(n).length; if (n.type === 'skill') n.r += Math.min(n.deg, 10) * .9; });

  /* ------------------------------------------------------------ view state */
  const canvas = $('#map'), ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const view = { s: .8, x: 0, y: 0 };
  let selected = null, hover = null, alpha = 1, visible = true, ASP = 1.4, touched = false;
  const ptrs = new Map();
  let drag = null, pan = null, pinch = null, moved = 0;

  const toWorld = (px, py) => ({ x: (px - view.x) / view.s, y: (py - view.y) / view.s });
  const nodeAt = (px, py) => {
    const w = toWorld(px, py); let best = null, bd = 1e9;
    nodes.forEach(n => { if (n.hidden) return; const d = Math.hypot(n.x - w.x, n.y - w.y); if (d < n.r + 6 / view.s && d < bd) { best = n; bd = d; } });
    return best;
  };

  // Where each kind of node likes to sit (angle in degrees, radius), so the picture is readable.
  const ANCHOR = {
    org:      { a: -62, r: 430 }, edu: { a: -8, r: 440 }, platform: { a: 48, r: 440 },
    cert:     { a: -140, r: 460 }, skill: { r: 240 }, project: { r: 560 }
  };
  function seed() {
    nodes.forEach((n, i) => {
      if (n.fixed) { n.x = n.y = 0; return; }
      const a = Math.random() * 6.283, r = 120 + Math.random() * 300;
      n.x = Math.cos(a) * r; n.y = Math.sin(a) * r; n.vx = n.vy = 0;
    });
    alpha = 1;
  }

  function simulate() {
    const vis = nodes.filter(n => !n.hidden);
    for (let i = 0; i < vis.length; i++) {
      const a = vis[i];
      for (let j = i + 1; j < vis.length; j++) {
        const b = vis[j]; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 > 250000) continue;
        if (d2 < 1) { dx = Math.random() - .5; dy = Math.random() - .5; d2 = 1; }
        const d = Math.sqrt(d2), f = (5200 + (a.r + b.r) * 60) / d2, fx = dx / d * f, fy = dy / d * f;
        a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
      }
    }
    edges.forEach(e => {
      if (e.a.hidden || e.b.hidden) return;
      const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.hypot(dx, dy) || 1;
      const len = 110 + (e.a.r + e.b.r) * 2, f = (d - len) * .014, fx = dx / d * f, fy = dy / d * f;
      e.a.vx += fx; e.a.vy += fy; e.b.vx -= fx; e.b.vy -= fy;
    });
    vis.forEach(n => {
      if (n.fixed) return;
      const an = ANCHOR[n.type];
      if (an) {
        const tx = an.a === undefined ? 0 : Math.cos(an.a * Math.PI / 180) * an.r * ASP, ty = an.a === undefined ? 0 : Math.sin(an.a * Math.PI / 180) * an.r;
        if (an.a === undefined) {               // elliptical ring, wider than tall on wide screens
          const ex = n.x / ASP, d = Math.hypot(ex, n.y) || 1, k = (d - an.r) * .014;
          n.vx -= ex / d * k * ASP; n.vy -= n.y / d * k;
        } else { n.vx += (tx - n.x) * .008; n.vy += (ty - n.y) * .008; }
      }
      if (drag && drag.n === n) return;
      n.vx *= .82; n.vy *= .82;
      n.x += n.vx * alpha; n.y += n.vy * alpha;
    });
    alpha = Math.max(alpha * .992, .02);
  }

  /* ------------------------------------------------------------ drawing */
  function draw(time) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, dpr * view.x, dpr * view.y);
    const focus = selected || hover;
    const near = focus ? new Set([focus, ...nbrs(focus).map(x => x.n)]) : null;
    const s = view.s;

    edges.forEach(e => {
      if (e.a.hidden || e.b.hidden) return;
      const hot = focus && (e.a === focus || e.b === focus);
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y);
      ctx.strokeStyle = hot ? col('--amber') : `rgba(138,146,166,${focus ? .07 : .26})`;
      ctx.lineWidth = (hot ? 2 : 1) / Math.min(s, 1.4);
      ctx.stroke();
    });
    if (focus) {                                      // relationship labels on the focused node's links
      ctx.font = `${10.5 / s}px "JetBrains Mono", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      edges.forEach(e => {
        if (e.a.hidden || e.b.hidden || !(e.a === focus || e.b === focus)) return;
        const mx = (e.a.x + e.b.x) / 2, my = (e.a.y + e.b.y) / 2, w = ctx.measureText(e.rel).width + 8 / s;
        ctx.fillStyle = 'rgba(10,13,22,.88)'; ctx.fillRect(mx - w / 2, my - 8 / s, w, 16 / s);
        ctx.fillStyle = col('--amber'); ctx.fillText(e.rel, mx, my);
      });
    }

    nodes.forEach(n => {
      if (n.hidden) return;
      const T = TYPES[n.type], dim = near && !near.has(n), sel = n === selected, hov = n === hover;
      const r = n.r + (hov ? 3 : 0);
      ctx.globalAlpha = dim ? .18 : 1;
      if (sel || n.type === 'me') {
        const g = ctx.createRadialGradient(n.x, n.y, r * .5, n.x, n.y, r * 2.8);
        g.addColorStop(0, T.c + '66'); g.addColorStop(1, T.c + '00');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.8, 0, 6.283); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.283);
      ctx.fillStyle = n.type === 'me' ? col('--bg-2') : T.c + '33'; ctx.fill();
      ctx.lineWidth = (sel ? 3.5 : 2) / Math.min(s, 1.5); ctx.strokeStyle = T.c; ctx.stroke();
      if (n.type === 'me') { ctx.fillStyle = T.c; ctx.font = '700 20px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('HK', n.x, n.y + 1); }

      const big = n.type === 'me' || n.type === 'org' || n.type === 'edu' || n.type === 'platform' || n.type === 'skill';
      if (n.type !== 'me' && (hov || sel || (near && near.has(n)) || (big ? s > .45 : s > .7))) {
        ctx.font = `${(hov || sel ? 12.5 : 11) / s}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.lineWidth = 4 / s; ctx.strokeStyle = 'rgba(10,13,22,.92)'; ctx.strokeText(n.label, n.x, n.y + r + 4 / s);
        ctx.fillStyle = hov || sel ? col('--ink') : col('--ink-2'); ctx.fillText(n.label, n.x, n.y + r + 4 / s);
      }
      ctx.globalAlpha = 1;
    });
  }

  function frame(time) {
    if (visible) { if (!reduce || alpha > .021) simulate(); draw(time); }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------ view helpers */
  function resize() {
    const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; ASP = Math.max(1, Math.min(W / H, 2.2)) * .9;
    dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = W * dpr; canvas.height = H * dpr;
  }
  function fit() {
    const vis = nodes.filter(n => !n.hidden); if (!vis.length) return;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    vis.forEach(n => { x0 = Math.min(x0, n.x - n.r); x1 = Math.max(x1, n.x + n.r); y0 = Math.min(y0, n.y - n.r); y1 = Math.max(y1, n.y + n.r); });
    const pad = 60, s = Math.min((W - pad * 2) / (x1 - x0 || 1), (H - pad * 2) / (y1 - y0 || 1), 1.4);
    animateView(s, W / 2 - (x0 + x1) / 2 * s, H / 2 - (y0 + y1) / 2 * s);
  }
  let anim = 0;
  function animateView(s, x, y) {
    cancelAnimationFrame(anim);
    if (reduce) { Object.assign(view, { s, x, y }); return; }
    const f = { ...view }, t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / 500, 1), e = 1 - Math.pow(1 - p, 3);
      view.s = f.s + (s - f.s) * e; view.x = f.x + (x - f.x) * e; view.y = f.y + (y - f.y) * e;
      if (p < 1) anim = requestAnimationFrame(step);
    })(t0);
  }
  const zoomAt = (px, py, k) => {
    const ns = Math.max(.25, Math.min(3, view.s * k)), w = toWorld(px, py);
    view.s = ns; view.x = px - w.x * ns; view.y = py - w.y * ns;
  };
  function focusNode(n) {
    select(n);
    animateView(Math.max(view.s, 1), W / 2 - n.x * Math.max(view.s, 1) - (innerWidth > 860 ? 120 : 0), H / 2 - n.y * Math.max(view.s, 1));
  }

  /* ------------------------------------------------------------ pointer input */
  const pos = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.addEventListener('pointerdown', e => {
    touched = true; canvas.setPointerCapture(e.pointerId); const p = pos(e); ptrs.set(e.pointerId, p); moved = 0;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) }; drag = pan = null; return; }
    const n = nodeAt(p.x, p.y);
    if (n && !n.fixed) { drag = { n }; } else if (n) { drag = { n, still: true }; } else { pan = { x: p.x, y: p.y, vx: view.x, vy: view.y }; }
  });
  canvas.addEventListener('pointermove', e => {
    const p = pos(e); if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, p);
    if (pinch && ptrs.size === 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / pinch.d); pinch.d = d; moved = 99; return;
    }
    if (drag && !drag.still) {
      moved += 1; const w = toWorld(p.x, p.y); drag.n.x = w.x; drag.n.y = w.y; drag.n.vx = drag.n.vy = 0; alpha = Math.max(alpha, .35);
    } else if (pan) {
      moved += Math.abs(p.x - pan.x) + Math.abs(p.y - pan.y) > 3 ? 1 : 0;
      view.x = pan.vx + (p.x - pan.x); view.y = pan.vy + (p.y - pan.y);
    } else if (e.pointerType === 'mouse') {
      hover = nodeAt(p.x, p.y); canvas.style.cursor = hover ? 'pointer' : 'grab';
    }
  });
  const up = e => {
    const p = pos(e); ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (moved < 4) { const n = nodeAt(p.x, p.y); n ? select(n) : select(null); }
    drag = null; pan = null;
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', e => { ptrs.delete(e.pointerId); drag = pan = pinch = null; });
  canvas.addEventListener('pointerleave', () => { hover = null; });
  canvas.addEventListener('wheel', e => { touched = true; e.preventDefault(); const p = pos(e); zoomAt(p.x, p.y, e.deltaY < 0 ? 1.12 : 1 / 1.12); }, { passive: false });

  /* ------------------------------------------------------------ UI */
  const panel = $('#map-panel'), body = $('#map-panel-body');
  function select(n) {
    selected = n;
    if (!n) { panel.classList.remove('open'); history.replaceState(null, '', location.pathname); return; }
    const T = TYPES[n.type];
    const list = nbrs(n).sort((a, b) => a.n.type.localeCompare(b.n.type) || a.n.label.localeCompare(b.n.label));
    body.innerHTML = `
      <span class="tag" style="color:${T.c};background:${T.c}22">${T.label}</span>
      <h2>${esc(n.label)}</h2>
      ${n.sub ? `<p class="sub">${esc(n.sub)}</p>` : ''}
      ${n.desc ? `<p>${esc(n.desc)}</p>` : ''}
      ${n.links.length ? `<div class="modal-links">${n.links.map((l, i) => `<a class="btn btn-sm ${i ? '' : 'btn-primary'}" href="${esc(l.url)}"${/^https?:/.test(l.url) ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a>`).join('')}</div>` : ''}
      <h3>Connected to (${list.length})</h3>
      <ul class="conn">${list.map((x, i) => `<li><button data-id="${esc(x.n.id)}"><i style="background:${TYPES[x.n.type].c}"></i><span>${esc(x.n.label)}</span><small>${esc(x.rel)}</small></button></li>`).join('')}</ul>`;
    panel.classList.add('open');
    history.replaceState(null, '', '#' + n.id);
  }
  body.addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) focusNode(byId[b.dataset.id]); });
  $('#map-close').addEventListener('click', () => select(null));

  // filters
  const legend = $('#legend');
  legend.innerHTML = Object.entries(TYPES).filter(([k]) => k !== 'me').map(([k, t]) =>
    `<button class="chip" data-k="${k}" aria-pressed="true"><i style="background:${t.c}"></i>${t.label}<small>${nodes.filter(n => n.type === k).length}</small></button>`).join('');
  legend.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
    nodes.forEach(n => { if (n.type === b.dataset.k) n.hidden = !on; });
    if (selected && selected.hidden) select(null);
    alpha = Math.max(alpha, .5);
  });

  // search
  $('#node-list').innerHTML = nodes.map(n => `<option value="${esc(n.label)}">${TYPES[n.type].label}</option>`).join('');
  $('#search').addEventListener('change', e => {
    const q = e.target.value.trim().toLowerCase();
    const n = nodes.find(x => x.label.toLowerCase() === q) || nodes.find(x => x.label.toLowerCase().includes(q));
    if (n && q) { if (n.hidden) { n.hidden = false; $$chips(n.type); } focusNode(n); e.target.blur(); }
  });
  function $$chips(type) { const b = $(`.chip[data-k="${type}"]`, legend); if (b) b.setAttribute('aria-pressed', 'true'); }

  $('#zoom-in').addEventListener('click', () => zoomAt(W / 2, H / 2, 1.3));
  $('#zoom-out').addEventListener('click', () => zoomAt(W / 2, H / 2, 1 / 1.3));
  $('#fit').addEventListener('click', fit);
  $('#relayout').addEventListener('click', () => { seed(); setTimeout(fit, 900); });

  // keyboard / screen reader access
  $('#sr-nodes').innerHTML = nodes.map(n => `<li><button data-id="${esc(n.id)}">${esc(TYPES[n.type].label)}: ${esc(n.label)}</button></li>`).join('');
  $('#sr-nodes').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) focusNode(byId[b.dataset.id]); });

  $('#map-count').textContent = `${nodes.length} nodes · ${edges.length} links`;

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
  new ResizeObserver(() => { const first = !W; resize(); if (first) { view.x = W / 2; view.y = H / 2; } }).observe(canvas);

  resize(); seed(); view.x = W / 2; view.y = H / 2; view.s = Math.min(W, H) / 900 + .2;
  if (reduce) for (let i = 0; i < 400; i++) simulate();
  requestAnimationFrame(frame);
  [1500, 3500, 6000].forEach(t => setTimeout(() => { if (!location.hash && !touched) fit(); }, t));
  const start = byId[decodeURIComponent(location.hash.slice(1))];
  if (start) setTimeout(() => focusNode(start), 1200);
})();
