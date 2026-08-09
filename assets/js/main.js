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
   
   
     /* ---------- Moodboard hero: smooth, bounded interaction + gentle idle motion ---------- */
     const moodboard = document.querySelector('.moodboard-hero');
     if (moodboard && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
       const cards = Array.from(moodboard.querySelectorAll('.mb-card[data-parallax]'));
       const state = new Map(cards.map(card => [card, {x:0, y:0, tx:0, ty:0}]));
       let raf = null;
   
       const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
   
       const render = () => {
         let moving = false;
         state.forEach((v, card) => {
           /* Ease toward the target instead of snapping to the pointer position. */
           v.x += (v.tx - v.x) * .085;
           v.y += (v.ty - v.y) * .085;
           if (Math.abs(v.tx-v.x) > .05 || Math.abs(v.ty-v.y) > .05) moving = true;
           card.style.setProperty('--mx', `${v.x.toFixed(2)}px`);
           card.style.setProperty('--my', `${v.y.toFixed(2)}px`);
         });
         if (moving) raf = requestAnimationFrame(render);
         else raf = null;
       };
   
       const moveTo = (e) => {
         const r = moodboard.getBoundingClientRect();
         const nx = clamp((e.clientX - r.left) / r.width - .5, -.5, .5);
         const ny = clamp((e.clientY - r.top) / r.height - .5, -.5, .5);
   
         cards.forEach(card => {
           const amount = parseFloat(card.dataset.parallax || '0');
           const v = state.get(card);
           /* A defined, intentionally small movement. The title never moves. */
           v.tx = nx * amount * 52;
           v.ty = ny * amount * 38;
         });
         if (!raf) raf = requestAnimationFrame(render);
       };
   
       const returnToRest = () => {
         state.forEach(v => { v.tx = 0; v.ty = 0; });
         if (!raf) raf = requestAnimationFrame(render);
       };
   
       moodboard.addEventListener('pointermove', moveTo, {passive:true});
       moodboard.addEventListener('pointerleave', returnToRest, {passive:true});
     }
   
     /* ---------- Footer year ---------- */
     document.querySelectorAll('[data-year]').forEach(el => {
       el.textContent = new Date().getFullYear();
     });
   
   });
