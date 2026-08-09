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

  /* ---------- Hero motion: mouse parallax + independent floating ---------- */
  const hero = document.querySelector('.moodboard-hero');
  const cards = hero ? [...hero.querySelectorAll('.mb-card')] : [];

  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const title = hero.querySelector('.mb-title-wrap');
    const stickers = [...hero.querySelectorAll('.mb-sticker')];
    const crosses = [...hero.querySelectorAll('.mb-cross')];
    const lines = [...hero.querySelectorAll('.mb-line')];

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let pointerX = 0, pointerY = 0, currentPX = 0, currentPY = 0;
    let raf = 0;
    const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

    const updatePointer = (e) => {
      const r = hero.getBoundingClientRect();
      const x = clamp((e.clientX-r.left)/r.width-.5,-.5,.5);
      const y = clamp((e.clientY-r.top)/r.height-.5,-.5,.5);
      targetX=x; targetY=y; pointerX=x; pointerY=y;
    };
    hero.addEventListener('pointermove',updatePointer,{passive:true});
    hero.addEventListener('pointerleave',()=>{targetX=targetY=pointerX=pointerY=0},{passive:true});

    const render = (time) => {
      currentX += (targetX-currentX)*.055;
      currentY += (targetY-currentY)*.055;
      currentPX += (pointerX-currentPX)*.06;
      currentPY += (pointerY-currentPY)*.06;

      cards.forEach((card,i)=>{
        const depth=Number(card.dataset.parallax||.1);
        const phase=i*.93;
        const float=Math.sin(time*.00105+phase)*7;
        const drift=Math.cos(time*.00072+phase)*3;
        const mx=currentX*150*depth;
        const my=currentY*120*depth;
        const rot=currentPX*depth*5;
        card.style.setProperty('--mx',`${mx.toFixed(2)}px`);
        card.style.setProperty('--my',`${(my+drift).toFixed(2)}px`);
        card.style.setProperty('--float',`${float.toFixed(2)}px`);
        card.style.setProperty('--mouse-rot',`${rot.toFixed(2)}deg`);
      });

      if(title){
        title.style.transform=`translate3d(${(currentX*20).toFixed(2)}px,${(currentY*14).toFixed(2)}px,0)`;
      }
      stickers.forEach((el,i)=>{
        const phase=i*2.2;
        el.style.transform=`translate3d(${(currentX*(i? -16:18)).toFixed(2)}px,${(currentY*(i? 12:-10)+Math.sin(time*.001+phase)*6).toFixed(2)}px,0) rotate(${i? -10:11}deg)`;
      });
      crosses.forEach((el,i)=>{
        el.style.transform=`translate3d(${(currentX*(i?18:-14)).toFixed(2)}px,${(currentY*(i?-15:12)+Math.sin(time*.002+i)*5).toFixed(2)}px,0) rotate(${Math.sin(time*.0015+i)*12}deg)`;
      });
      lines.forEach((el,i)=>{
        el.style.translate=`${(currentX*(i?10:-12)).toFixed(2)}px ${(currentY*(i?-7:7)).toFixed(2)}px`;
      });

      raf=requestAnimationFrame(render);
    };
    raf=requestAnimationFrame(render);
    window.addEventListener('beforeunload',()=>cancelAnimationFrame(raf),{once:true});
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
