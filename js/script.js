(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================
     Smooth scrolling + offset
  ============================= */
  // CSS already handles smooth scrolling; we add a small JS offset for sticky nav
  const navbar = qs('#navbar');
  const getNavHeight = () => (navbar ? navbar.getBoundingClientRect().height : 72);

  qsa('a[href^="#"], a[href*="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const id = href.replace('#','');
    const target = qs('#' + CSS.escape(id));
    if (!target) return;

    a.addEventListener('click', (e) => {
      if (prefersReduced) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - getNavHeight() - 8;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu
      const navLinks = qs('#nav-links');
      const toggle = qs('#nav-toggle');
      if (navLinks && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded','false');
      }
    });
  });

  /* ============================
     Navbar mobile toggle
  ============================= */
  const toggle = qs('#nav-toggle');
  const navLinks = qs('#nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    qsa('#nav-links .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded','false');
      });
    });
  }

  /* ============================
     Navbar blur on scroll (extra)
  ============================= */
  const applyNavbarScroll = () => {
    if (!navbar) return;
    const y = window.scrollY || 0;
    if (y > 6) {
      navbar.style.background = 'rgba(7,10,18,.58)';
      navbar.style.borderBottomColor = 'rgba(255,255,255,.10)';
    } else {
      navbar.style.background = 'rgba(7,10,18,.35)';
      navbar.style.borderBottomColor = 'rgba(255,255,255,.06)';
    }
  };
  applyNavbarScroll();
  window.addEventListener('scroll', applyNavbarScroll, { passive:true });

  /* ============================
     Progress bar
  ============================= */
  const progressBar = qs('#progress-bar');
  const updateProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const max = (doc.scrollHeight - doc.clientHeight) || 1;
    const pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
    progressBar.style.width = pct + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive:true });

  /* ============================
     Scroll reveal
  ============================= */
  const reveals = qsa('.reveal');

  const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => ioReveal.observe(el));

  /* Timeline animate while scrolling */
  const timelineItems = qsa('.timeline-item');
  const ioTimeline = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.classList.add('is-active');
      }
    });
  }, { threshold: 0.25 });

  timelineItems.forEach(el => ioTimeline.observe(el));

  /* ============================
     Counters
  ============================= */
  const statValues = qsa('[data-counter]');
  const animateCounter = (el, target) => {
    const start = performance.now();
    const duration = 950;
    const initial = 0;

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(initial + (target - initial) * eased);
      el.textContent = String(val);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const ioCounters = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-counter') || '0', 10);
      if (!Number.isFinite(target)) return;
      animateCounter(el, target);
      ioCounters.unobserve(el);
    });
  }, { threshold: 0.35 });

  statValues.forEach(el => ioCounters.observe(el));

  /* ============================
     Mouse glow + hero parallax
  ============================= */
  const mouseGlow = qs('.mouse-glow');
  const heroIllustration = qs('#hero-illustration');
  let glowRaf = 0;
  let lastX = 0, lastY = 0;

  const setGlow = () => {
    if (!mouseGlow) return;
    mouseGlow.style.opacity = '1';
    mouseGlow.style.left = lastX + 'px';
    mouseGlow.style.top = lastY + 'px';
  };

  window.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;

    if (prefersReduced) return;

    if (!glowRaf) {
      glowRaf = requestAnimationFrame(() => {
        glowRaf = 0;
        setGlow();
      });
    }

    if (heroIllustration) {
      const rect = heroIllustration.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (e.clientX - cx) / (rect.width/2);
      const dy = (e.clientY - cy) / (rect.height/2);
      const rx = Math.max(-1, Math.min(1, -dy)) * 10;
      const ry = Math.max(-1, Math.min(1, dx)) * 14;
      heroIllustration.style.transform = `translate3d(${dx*6}px, ${dy*6}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  }, { passive:true });

  window.addEventListener('mouseleave', () => {
    if (mouseGlow) mouseGlow.style.opacity = '0';
    if (heroIllustration) heroIllustration.style.transform = '';
  }, { passive:true });

  /* ============================
     Particles canvas
  ============================= */
  const canvas = qs('#particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR,0,0,DPR,0,0);
    };

    const count = () => {
      const area = w*h;
      if (area < 600000) return 55;
      if (area < 1200000) return 85;
      return 120;
    };

    const rand = (min, max) => min + Math.random() * (max - min);

    let particles = [];
    const init = () => {
      particles = [];
      const n = prefersReduced ? 45 : count();
      for (let i=0;i<n;i++) {
        particles.push({
          x: rand(0,w),
          y: rand(0,h),
          r: rand(0.8, 2.2),
          vx: rand(-0.25, 0.25),
          vy: rand(-0.18, 0.18),
          a: rand(0.18, 0.65),
        });
      }
    };

    resize();
    init();
    window.addEventListener('resize', () => { resize(); init(); }, { passive:true });

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(40, now - last);
      last = now;

      ctx.clearRect(0,0,w,h);

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // glow
        const grad = ctx.createRadialGradient(p.x,p.y,0, p.x,p.y,p.r*6);
        grad.addColorStop(0, `rgba(56,189,248,${p.a})`);
        grad.addColorStop(1, 'rgba(56,189,248,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.35, p.a/2)})`;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }

      if (!prefersReduced) requestAnimationFrame(tick);
      else {
        // one frame only for reduced motion
      }
    };

    if (!prefersReduced) requestAnimationFrame(tick);
    else tick(performance.now());
  }

})();

