(() => {
  'use strict';

  // ---------- Language switching ----------
  const STORAGE_KEY = 'lindaSiteLang';
  const supported = ['es', 'en'];

  const setLanguage = (lang) => {
    if (!supported.includes(lang)) return;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }
  };

  const initLang = () => {
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) { /* ignore */ }
    if (stored && supported.includes(stored)) {
      setLanguage(stored);
      return;
    }
    const browserLang = (navigator.language || 'es').slice(0, 2).toLowerCase();
    setLanguage(supported.includes(browserLang) ? browserLang : 'es');
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    setLanguage(btn.dataset.lang);
  });

  // ---------- Close mobile navbar on link click ----------
  document.querySelectorAll('#mainNav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const collapseEl = document.getElementById('mainNav');
      if (!collapseEl.classList.contains('show')) return;
      const instance = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl, { toggle: false });
      instance.hide();
    });
  });

  // ---------- Navbar shadow on scroll ----------
  const navbar = document.querySelector('.navbar-custom');
  const onScroll = () => {
    if (window.scrollY > 8) {
      navbar.style.boxShadow = '0 4px 24px -8px rgba(75, 50, 95, 0.12)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll(
    '.section-title, .eyebrow, .before-after-card, .service-card, .tip-card, .contact-card, .stat-card, .check-list, .hero-text, .hero-photo-wrap'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // ---------- Video loader: show spinner while buffering ----------
  document.querySelectorAll('.video-wrap').forEach((wrap) => {
    const video = wrap.querySelector('video');
    const showLoader = () => wrap.classList.add('is-loading');
    const hideLoader = () => wrap.classList.remove('is-loading');
    // On first play nothing is downloaded yet, so show the spinner right away
    video.addEventListener('play', () => { if (video.readyState < 3) showLoader(); });
    video.addEventListener('waiting', showLoader);
    video.addEventListener('playing', hideLoader);
    video.addEventListener('pause', hideLoader);
    video.addEventListener('error', hideLoader);
  });

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Init ----------
  initLang();
  onScroll();
})();
