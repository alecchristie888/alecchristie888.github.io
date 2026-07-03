/* ============ Alec Christie site — interactions ============ */
(function () {
  'use strict';

  // ---------- Year ----------
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Nav scrolled state ----------
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Theme toggle ----------
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function store() { try { return window['local' + 'Storage']; } catch (e) { return null; } }
  function setTheme(t) {
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    try { var s = store(); if (s) s.setItem('theme', t); } catch (e) {}
  }
  function toggleTheme() {
    setTheme(currentTheme() === 'light' ? 'dark' : 'light');
    if (window.__repaintBg) window.__repaintBg();
  }
  ['theme-toggle', 'theme-toggle-m'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', toggleTheme);
  });

  // ---------- Mobile menu ----------
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  // ---------- Scroll reveal ----------
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.section, .hero-inner, #contact .foot-inner');
  revealEls.forEach(function (el) { if (!reduce) el.classList.add('reveal'); });
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ============ Growing-vines background ============
  var c = document.getElementById('bg');
  if (!c || reduce) return;
  var x = c.getContext('2d');
  var W, H, DPR;
  var mx = -9999, my = -9999;
  var branches = [];
  var MAX = 170;

  function seedBranch(fromBottom) {
    return {
      x: Math.random() * W,
      y: fromBottom ? H + 10 : Math.random() * H,
      a: -Math.PI / 2 + (Math.random() - 0.5) * 0.55,
      len: 0,
      max: 130 + Math.random() * 200,
      w: 1.5 + Math.random() * 1.3
    };
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    c.width = W * DPR;
    c.height = H * DPR;
    c.style.width = W + 'px';
    c.style.height = H + 'px';
    x.setTransform(DPR, 0, 0, DPR, 0, 0);
    x.fillStyle = getComputedStyle(document.body).backgroundColor || '#08130f';
    x.fillRect(0, 0, W, H);
    branches = [];
    var n = Math.max(6, Math.round(W / 190));
    for (var i = 0; i < n; i++) branches.push(seedBranch(true));
  }
  resize();
  window.addEventListener('resize', resize);
  // expose a repaint so theme toggles clear old-coloured trails immediately
  window.__repaintBg = function () {
    x.fillStyle = getComputedStyle(document.body).backgroundColor || '#08130f';
    x.fillRect(0, 0, W, H);
  };

  window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  window.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });
  window.addEventListener('touchmove', function (e) {
    if (e.touches[0]) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }
  }, { passive: true });

  // theme-aware vine colours
  function palette() {
    if (currentTheme() === 'light') {
      return {
        fade: 'rgba(242,246,241,0.05)',
        line: 'rgba(31,158,143,0.30)',
        lineNear: 'rgba(15,143,107,0.55)',
        leaf: 'rgba(15,143,107,0.55)',
        leafNear: 'rgba(11,122,90,0.85)'
      };
    }
    return {
      fade: 'rgba(8,19,15,0.04)',
      line: 'rgba(47,214,160,0.30)',
      lineNear: 'rgba(127,233,176,0.55)',
      leaf: 'rgba(127,233,176,0.6)',
      leafNear: 'rgba(127,233,176,0.85)'
    };
  }

  function draw() {
    var pal = palette();
    // soft fade to leave gentle trails without permanent clutter
    x.fillStyle = pal.fade;
    x.fillRect(0, 0, W, H);

    var next = [];
    for (var i = 0; i < branches.length; i++) {
      var b = branches[i];
      var dxm = mx - b.x, dym = my - b.y, dm = Math.hypot(dxm, dym);
      // steer toward cursor
      if (dm < 340 && mx > -9000) {
        var targ = Math.atan2(dym, dxm);
        var da = targ - b.a;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        b.a += da * 0.045 * (1 - dm / 340);
      }
      b.a += (Math.random() - 0.5) * 0.24;

      var step = 2.3;
      var nx = b.x + Math.cos(b.a) * step;
      var ny = b.y + Math.sin(b.a) * step;
      var near = dm < 230 && mx > -9000;

      x.strokeStyle = near ? pal.lineNear : pal.line;
      x.lineWidth = b.w;
      x.lineCap = 'round';
      x.beginPath();
      x.moveTo(b.x, b.y);
      x.lineTo(nx, ny);
      x.stroke();

      b.x = nx; b.y = ny; b.len += step; b.w *= 0.9975;

      // occasional leaf-dot
      if (Math.random() < 0.02) {
        x.beginPath();
        x.arc(nx, ny, near ? 2.4 : 1.7, 0, 7);
        x.fillStyle = near ? pal.leafNear : pal.leaf;
        x.fill();
      }

      var alive = b.len < b.max && b.w > 0.45 && b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20;
      if (alive) {
        next.push(b);
        // branch split
        if (Math.random() < 0.012 && (branches.length + next.length) < MAX) {
          next.push({
            x: b.x, y: b.y,
            a: b.a + (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.45),
            len: 0, max: b.max * 0.6, w: b.w * 0.72
          });
        }
      } else {
        next.push(seedBranch(true));
      }
    }
    branches = next;
    requestAnimationFrame(draw);
  }
  draw();
})();
