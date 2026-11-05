/* Hero link-analysis graph. Draggable nodes, pointer repulsion, data packets
   travelling along edges. Click a node to open what it points to. */
window.initGraph = function (canvas) {
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const col = n => css.getPropertyValue(n).trim();

  const GROUP = {
    me:     { c: col('--amber') },
    cyber:  { c: col('--cyan') },
    police: { c: '#ff8a65' },
    build:  { c: '#b69cff' },
    learn:  { c: '#7bd88f' }
  };

  // x / y are fractions of the canvas, so the layout scales with the screen.
  const nodes = [
    { id: 'me',    label: 'Harsh',            sub: 'Cybersecurity + automation', x: .50, y: .50, r: 38, g: 'me' },
    { id: 'ceh',   label: 'CEH v13',          sub: 'EC-Council certified',       x: .20, y: .24, r: 22, g: 'cyber',  href: 'academics.html' },
    { id: 'thm',   label: 'TryHackMe', short: 'THM',        sub: 'Top 3% worldwide',           x: .13, y: .56, r: 20, g: 'cyber',  href: 'https://tryhackme.com/p/Hk.Hacker' },
    { id: 'vapt',  label: 'VAPT',             sub: 'See cyber projects',         x: .28, y: .84, r: 18, g: 'cyber',  href: 'projects.html?filter=cyber' },
    { id: 'phq',   label: 'Rajasthan Police', short: 'Raj. Police', sub: 'Cyber crime internship',     x: .78, y: .17, r: 24, g: 'police', href: 'experience.html' },
    { id: 'amr',   label: 'Amroha Police', short: 'Amroha',    sub: 'APCSIP 2026',                x: .90, y: .46, r: 20, g: 'police', href: 'experience.html' },
    { id: 'ccrm',  label: 'CCRM',             sub: 'Forensic link-analysis tool',x: .80, y: .76, r: 20, g: 'police', href: 'projects.html?open=ccrm' },
    { id: 'n8n',   label: 'n8n',              sub: 'Automation workflows',       x: .60, y: .88, r: 19, g: 'build',  href: 'projects.html?filter=n8n' },
    { id: 'py',    label: 'Python',           sub: 'Main language',              x: .42, y: .70, r: 18, g: 'build',  href: 'projects.html?filter=python' },
    { id: 'wgo',   label: 'What’s Going On', short: 'WGO',  sub: 'AI news video pipeline',     x: .56, y: .13, r: 21, g: 'build',  href: 'projects.html?open=whats-going-on' },
    { id: 'iitm',  label: 'IIT Madras',       sub: 'BS in Data Science',         x: .33, y: .09, r: 21, g: 'learn',  href: 'academics.html' },
    { id: 'pm',    label: 'PustakMart', short: 'Pustak',       sub: 'First startup',              x: .07, y: .84, r: 17, g: 'learn',  href: 'experience.html' }
  ];
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const edgeDefs = [
    ['me','ceh'],['me','thm'],['me','phq'],['me','amr'],['me','n8n'],['me','py'],['me','wgo'],['me','iitm'],['me','pm'],
    ['ceh','thm'],['ceh','iitm'],['phq','amr'],['amr','ccrm'],['ccrm','py'],['wgo','n8n'],['py','vapt'],['n8n','py']
  ];
  const edges = edgeDefs.map(([a, b]) => ({ a: byId[a], b: byId[b], t: Math.random() }));
  const neighbours = n => edges.filter(e => e.a === n || e.b === n).flatMap(e => [e.a, e.b]);

  // Profile photo inside the centre node (falls back to initials).
  const photo = new Image();
  let photoOk = false;
  photo.onload = () => { photoOk = true; };
  photo.src = 'assets/images/profile.png';

  let W = 0, H = 0, dpr = 1, visible = true, S = 1, narrow = false;
  const ptr = { x: -999, y: -999, down: null, moved: 0, type: 'mouse' };
  let hover = null;

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    narrow = W < 520; S = narrow ? Math.max(.62, W / 560) : 1;
    const pad = narrow ? 38 : 70;
    nodes.forEach(n => {
      n.hx = pad + n.x * (W - pad * 2);
      n.hy = 40 + n.y * (H - 90);
      if (n.px === undefined) {          // first layout: scatter in from the middle
        n.px = W / 2 + (Math.random() - .5) * 60;
        n.py = H / 2 + (Math.random() - .5) * 60;
        n.vx = n.vy = 0;
      }
    });
  }

  function nodeAt(x, y) {
    let best = null, bd = 1e9;
    nodes.forEach(n => {
      const d = Math.hypot(n.px - x, n.py - y);
      if (d < n.r * S + 12 && d < bd) { best = n; bd = d; }
    });
    return best;
  }

  function step() {
    nodes.forEach(n => {
      if (ptr.down && ptr.down.node === n && ptr.down.drag) return;
      let fx = (n.hx - n.px) * 0.045;
      let fy = (n.hy - n.py) * 0.045;
      const dx = n.px - ptr.x, dy = n.py - ptr.y, d = Math.hypot(dx, dy);
      if (d < 120 && d > 0.1) {
        const f = (1 - d / 120) * 2.2;
        fx += (dx / d) * f; fy += (dy / d) * f;
      }
      n.vx = (n.vx + fx) * 0.82;
      n.vy = (n.vy + fy) * 0.82;
      n.px += n.vx; n.py += n.vy;
    });
    edges.forEach(e => { e.t = (e.t + 0.0035) % 1; });
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);
    const near = hover ? new Set([hover, ...neighbours(hover)]) : null;

    // edges
    edges.forEach(e => {
      const lit = near && near.has(e.a) && near.has(e.b) && (e.a === hover || e.b === hover);
      ctx.beginPath();
      ctx.moveTo(e.a.px, e.a.py); ctx.lineTo(e.b.px, e.b.py);
      ctx.strokeStyle = lit ? col('--amber') : 'rgba(98,212,232,' + (near ? .1 : .28) + ')';
      ctx.lineWidth = lit ? 1.8 : 1;
      ctx.stroke();
      if (!reduce) {                      // data packet
        const t = e.t, x = e.a.px + (e.b.px - e.a.px) * t, y = e.a.py + (e.b.py - e.a.py) * t;
        ctx.beginPath(); ctx.arc(x, y, lit ? 2.6 : 1.8, 0, 6.283);
        ctx.fillStyle = lit ? col('--amber') : 'rgba(98,212,232,.75)'; ctx.fill();
      }
    });

    // nodes
    nodes.forEach(n => {
      const g = GROUP[n.g], dim = near && !near.has(n);
      const isHover = n === hover;
      const r = n.r * S + (isHover ? 4 : 0) + (n.id === 'me' && !reduce ? Math.sin(time / 700) * 1.5 : 0);
      ctx.globalAlpha = dim ? .28 : 1;

      if (isHover || n.id === 'me') {      // soft halo
        const gr = ctx.createRadialGradient(n.px, n.py, r * .6, n.px, n.py, r * 2.6);
        gr.addColorStop(0, g.c + '55'); gr.addColorStop(1, g.c + '00');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(n.px, n.py, r * 2.6, 0, 6.283); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, 6.283);
      ctx.fillStyle = col('--bg-2'); ctx.fill();
      ctx.lineWidth = n.id === 'me' ? 3 : 2; ctx.strokeStyle = g.c; ctx.stroke();

      if (n.id === 'me') {
        if (photoOk) {
          ctx.save(); ctx.beginPath(); ctx.arc(n.px, n.py, r - 3, 0, 6.283); ctx.clip();
          const s = Math.min(photo.width, photo.height);
          ctx.drawImage(photo, (photo.width - s) / 2, (photo.height - s) / 2, s, s, n.px - r + 3, n.py - r + 3, (r - 3) * 2, (r - 3) * 2);
          ctx.restore();
        } else {
          ctx.fillStyle = g.c; ctx.font = '700 22px "JetBrains Mono", monospace';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('HK', n.px, n.py + 1);
        }
      } else {
        ctx.beginPath(); ctx.arc(n.px, n.py, 4, 0, 6.283); ctx.fillStyle = g.c; ctx.fill();
      }

      // label
      ctx.font = '500 ' + (narrow ? 10.5 : 12.5) + 'px "JetBrains Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = isHover ? col('--ink') : col('--ink-2');
      ctx.fillText(narrow && n.short ? n.short : n.label, n.px, n.py + r + 6);
      if (isHover) {
        ctx.font = '400 11.5px "JetBrains Mono", monospace';
        ctx.fillStyle = g.c; ctx.fillText(n.sub, n.px, n.py + r + 24);
      }
      ctx.globalAlpha = 1;
    });
  }

  let raf;
  function loop(time) {
    if (visible) { step(); draw(time); }
    raf = requestAnimationFrame(loop);
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  canvas.addEventListener('pointermove', e => {
    const p = pos(e); ptr.x = p.x; ptr.y = p.y; ptr.type = e.pointerType;
    if (ptr.down) {
      ptr.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
      if (ptr.down.node && e.pointerType !== 'touch' && ptr.moved > 5) {
        ptr.down.drag = true; canvas.classList.add('grabbing');
        ptr.down.node.px = p.x; ptr.down.node.py = p.y;
        ptr.down.node.vx = ptr.down.node.vy = 0;
      }
    }
    hover = nodeAt(p.x, p.y);
    canvas.classList.toggle('pointing', !!(hover && hover.href) && !ptr.down);
    if (reduce) draw(0);
  });
  canvas.addEventListener('pointerleave', () => { ptr.x = ptr.y = -999; hover = null; canvas.classList.remove('pointing'); if (reduce) draw(0); });
  canvas.addEventListener('pointerdown', e => {
    const p = pos(e);
    ptr.down = { node: nodeAt(p.x, p.y), drag: false }; ptr.moved = 0;
    if (e.pointerType !== 'touch') canvas.setPointerCapture(e.pointerId);
  });
  const release = () => {
    const d = ptr.down; ptr.down = null; canvas.classList.remove('grabbing');
    if (d && d.node && !d.drag && d.node.href) {
      const h = d.node.href;
      if (/^https?:/.test(h)) window.open(h, '_blank', 'noopener');
      else (window.navigateTo || (u => (location.href = u)))(h);
    }
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', () => { ptr.down = null; canvas.classList.remove('grabbing'); });

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 }).observe(canvas);
  new ResizeObserver(() => { resize(); if (reduce) { nodes.forEach(n => { n.px = n.hx; n.py = n.hy; }); draw(0); } }).observe(canvas);

  resize();
  if (reduce) { nodes.forEach(n => { n.px = n.hx; n.py = n.hy; }); draw(0); }
  else raf = requestAnimationFrame(loop);
};
