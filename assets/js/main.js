/* ==========================================================================
   YOUR NAME — DESIGN + PHOTOGRAPHY
   Shared behaviour. Loaded by every page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const body = document.body;
  if (toggle){
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
  const here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
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

  /* ---------- GSAP hero entrance (progressive enhancement) ---------- */
  if (window.gsap){
    gsap.from('[data-hero-in]', {
      y: 36, opacity: 0, duration: 1.1, stagger: 0.09,
      ease: 'power3.out', delay: 0.15
    });
  }

  /* ---------- Lightbox (Photography page) ---------- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox){
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
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openAt(i); }
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => openAt(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => openAt(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') openAt(current + 1);
      if (e.key === 'ArrowLeft') openAt(current - 1);
    });
  }


  /* ---------- Moodboard hero parallax ---------- */
  const moodboard = document.querySelector('.moodboard-hero');
  if (moodboard && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const parallaxItems = moodboard.querySelectorAll('[data-parallax]');
    let mx = 0, my = 0, raf = null;
    moodboard.addEventListener('pointermove', (e) => {
      const r = moodboard.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5;
      my = (e.clientY - r.top) / r.height - .5;
      if (!raf){
        raf = requestAnimationFrame(() => {
          parallaxItems.forEach(el => {
            const amount = parseFloat(el.dataset.parallax || 0);
            const base = el.dataset.baseTransform || getComputedStyle(el).transform;
            el.style.transform = `${base === 'none' ? '' : base} translate(${mx * amount * 45}px, ${my * amount * 45}px)`;
          });
          raf = null;
        });
      }
    });
    moodboard.addEventListener('pointerleave', () => {
      parallaxItems.forEach(el => el.style.transform = '');
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
