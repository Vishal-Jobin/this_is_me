/* ========================================================================
   YOUR NAME — DESIGN + PHOTOGRAPHY
   Shared behaviour. Loaded by every page.
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      body.style.overflow = isOpen ? 'hidden' : '';
    });
    document.querySelectorAll('.nav-mobile a').forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
        body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Smooth, bounded moodboard mouse movement ---------- */
  const hero = document.querySelector('.moodboard-hero');
  const cards = hero ? [...hero.querySelectorAll('.mb-card')] : [];

  if (hero && cards.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let inside = false;
    let raf = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;

      cards.forEach(card => {
        const depth = Number(card.dataset.parallax || 0.1);
        const x = currentX * depth;
        const y = currentY * depth;
        card.style.setProperty('--mx', `${x.toFixed(2)}px`);
        card.style.setProperty('--my', `${y.toFixed(2)}px`);
      });

      raf = requestAnimationFrame(render);
    };

    const updatePointer = (event) => {
      const rect = hero.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      // Keep the movement intentionally small and bounded.
      targetX = Math.max(-34, Math.min(34, (px - 0.5) * 68));
      targetY = Math.max(-26, Math.min(26, (py - 0.5) * 52));
      inside = true;
    };

    hero.addEventListener('pointermove', updatePointer, { passive: true });
    hero.addEventListener('pointerenter', () => { inside = true; }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      inside = false;
      targetX = 0;
      targetY = 0;
    }, { passive: true });

    // Keep the animation loop running so the return-to-center is smooth.
    raf = requestAnimationFrame(render);

    window.addEventListener('beforeunload', () => cancelAnimationFrame(raf), { once: true });
  }

  /* ---------- GSAP hero entrance: never animate card transforms ---------- */
  if (window.gsap) {
    gsap.from('.mb-title-wrap[data-hero-in], .mb-sticker[data-hero-in]', {
      y: 28,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.15,
      clearProps: 'transform'
    });
  }

  /* ---------- Lightbox (Photography page) ---------- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbCap = lightbox.querySelector('.lightbox-cap');
    const items = Array.from(document.querySelectorAll('.ph[data-full]'));
    let current = 0;

    const openAt = (index) => {
      current = (index + items.length) % items.length;
      const el = items[current];
      lbImg.src = el.dataset.full;
      lbImg.alt = el.dataset.alt || '';
      lbCap.textContent = el.dataset.caption || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
    };

    items.forEach((el, i) => {
      el.addEventListener('click', () => openAt(i));
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', el.dataset.caption ? `View image: ${el.dataset.caption}` : 'View image');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
      });
    });

    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', () => openAt(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => openAt(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') openAt(current + 1);
      if (e.key === 'ArrowLeft') openAt(current - 1);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
