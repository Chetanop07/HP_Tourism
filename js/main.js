/* ─── Main Site JS ──────────────────────────────────────────────── */

/* ── Dark Mode ───────────────────────────────────────────────────── */
function initDarkMode() {
  const stored = localStorage.getItem('hp_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hp_theme', next);
}

/* ── Navbar Scroll Behavior ──────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar-nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ── Mobile Menu ─────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll Reveal Animations ────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

  targets.forEach(el => observer.observe(el));
}

/* ── Animated Counter ────────────────────────────────────────────── */
function animateCount(el, target, duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;
  const isDecimal = String(target).includes('.');

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;

    if (isDecimal) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }

    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
  };

  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.count);
        animateCount(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Parallax Hero ───────────────────────────────────────────────── */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg img');
  if (!heroBg) return;

  // Lightweight RAF-based parallax
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Particles Canvas ────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const hero   = document.querySelector('.hero');
  let particles = [];
  let raf;

  const resize = () => {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  };

  const createParticle = () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 1.8 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.4 - 0.1,
    opacity: Math.random() * 0.6 + 0.1,
  });

  const init = () => {
    particles = Array.from({ length: 80 }, createParticle);
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.opacity -= 0.0006;

      if (p.y < -5 || p.opacity <= 0) Object.assign(p, createParticle(), { y: canvas.height + 5 });
    });
    raf = requestAnimationFrame(draw);
  };

  resize();
  init();
  draw();

  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
}

/* ── Gallery Lightbox ────────────────────────────────────────────── */
function initGallery() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  if (!lightbox || !lbImg) return;

  document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLb = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  };

  document.getElementById('lightboxClose')?.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}

/* ── Smooth Section Scroll ───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Toast Notification ──────────────────────────────────────────── */
window.showToast = function(icon, title, msg, duration = 4000) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'notification-toast';
    toast.innerHTML = `<div class="toast-icon" id="toastIcon"></div><div><div class="toast-title" id="toastTitle"></div><div class="toast-msg" id="toastMsg"></div></div>`;
    document.body.appendChild(toast);
  }

  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
};

/* ── Package Cards → Booking Jump ────────────────────────────────── */
function initPackageButtons() {
  document.querySelectorAll('[data-book-package]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgId = btn.dataset.bookPackage;
      // Pre-select package in booking form
      const pkgSelect = document.querySelector('select[name="package"]');
      if (pkgSelect) pkgSelect.value = pkgId;

      // Scroll to booking section
      document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Destination Cards → Booking ─────────────────────────────────── */
function initDestinationCards() {
  document.querySelectorAll('[data-book-dest]').forEach(card => {
    card.addEventListener('click', () => {
      const destId = card.dataset.bookDest;
      const radio = document.querySelector(`input[name="destination"][value="${destId}"]`);
      if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change')); }
      document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Newsletter ──────────────────────────────────────────────────── */
function initNewsletter() {
  document.getElementById('newsletterForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input?.value) {
      input.value = '';
      showToast('🎉', 'Subscribed!', 'Thank you! You\'ll hear about our exclusive deals.');
    }
  });
}

/* ── Init Everything ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initParallax();
  initParticles();
  initGallery();
  initSmoothScroll();
  initPackageButtons();
  initDestinationCards();
  initNewsletter();

  // Dark mode toggle button
  document.getElementById('darkToggle')?.addEventListener('click', toggleDarkMode);
});
// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');

    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute(
      'aria-label',
      isOpen ? 'Close mobile menu' : 'Open mobile menu'
    );

    hamburger.classList.toggle('active', isOpen);
  });

  // Close menu after selecting a navigation item
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open mobile menu');
    });
  });
}