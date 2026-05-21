/* ========================================
   岡田印刷 - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation scroll effect ──────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    });
  }

  // ── Hamburger menu ────────────────────────────
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ── Scroll reveal (IntersectionObserver) ─────
  const revealEls = document.querySelectorAll(
    '.reveal, .service-card, .project-card, .news-item, .timeline-item'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach((el, i) => {
    if (!el.dataset.delay) {
      el.dataset.delay = (i % 4) * 80;
    }
    revealObserver.observe(el);
  });

  // ── Stagger children ──────────────────────────
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
      child.classList.add('reveal');
      revealObserver.observe(child);
    });
  });

  // ── Active nav link ───────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath) && currentPath !== 'index.html') {
      link.style.color = 'var(--navy)';
      link.style.fontWeight = '700';
    }
  });

  // ── Smooth scroll for anchor links ───────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Contact form ──────────────────────────────
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = '送信中...';
      btn.disabled = true;
      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align:center;padding:4rem 2rem">
            <div style="font-size:3rem;margin-bottom:1.5rem">✓</div>
            <h3 style="font-family:var(--font-jp);color:var(--navy);font-size:1.4rem;margin-bottom:1rem">
              お問い合わせを受け付けました
            </h3>
            <p style="color:var(--text-secondary);line-height:2">
              お問い合わせいただきありがとうございます。<br>
              担当者より2〜3営業日以内にご連絡いたします。
            </p>
          </div>`;
      }, 1200);
    });
  }

  // ── Hero title char-by-char reveal ───────────
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    text.split('').forEach((c, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = c === ' ' ? ' ' : c;
      span.style.animationDelay = `${0.5 + i * 0.06}s`;
      el.appendChild(span);
    });
  });

  // ── Mouse parallax on hero floating items ────
  const heroCanvas = document.querySelector('.hero-v2__canvas');
  if (heroCanvas && window.matchMedia('(hover: hover)').matches) {
    const items = heroCanvas.querySelectorAll('.float-item');
    let raf = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    heroCanvas.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    heroCanvas.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function loop() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      items.forEach((item, i) => {
        const depth = parseFloat(item.dataset.depth || 1);
        const tx = currentX * depth * 20;
        const ty = currentY * depth * 20;
        item.style.transform = `translate(${tx}px, ${ty}px)`;
      });
      raf = requestAnimationFrame(loop);
    }
    loop();
  }

  // ── Scroll-driven parallax ───────────────────
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          parallaxEls.forEach(el => {
            const speed = parseFloat(el.dataset.parallax || 0.3);
            el.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Cursor follower ──────────────────────────
  if (window.matchMedia('(hover: hover)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);

    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.opacity = 1;
    });

    function cursorLoop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    document.querySelectorAll('a, button, .svc-card, .story__step').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-follower--hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-follower--hover'));
    });
  }

  // ── Heritage twinkling stars ─────────────────
  const heritageStars = document.querySelector('.heritage__stars');
  if (heritageStars) {
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('span');
      s.className = 'heritage__star';
      s.style.top = `${Math.random() * 100}%`;
      s.style.left = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 3}s`;
      s.style.opacity = (0.1 + Math.random() * 0.4).toFixed(2);
      heritageStars.appendChild(s);
    }
  }

  // ── News filter (if present) ──────────────────
  const filterBtns = document.querySelectorAll('.news-filter__btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('.news-item').forEach(item => {
          item.style.display =
            (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

});
