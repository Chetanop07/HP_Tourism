/* ═══════════════════════════════════════════════════════════════════
   FEATURES.JS — Additional Interactive Features
   HP Tourism — Premium Enhancements
   ═══════════════════════════════════════════════════════════════════ */

/* ── Hero Typing Effect ─────────────────────────────────────────── */
function initTypingEffect() {
  const el = document.getElementById('heroTyping');
  if (!el) return;

  const phrases = [
    'Journey through snow-capped Himalayas, emerald valleys, and ancient monasteries.',
    'Premium curated experiences across Himachal Pradesh\'s most breathtaking destinations.',
    'Where every mountain trail tells a story of courage, beauty, and wonder.',
    'Adventure awaits in the land where the clouds touch the earth.',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseTime = 0;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        pauseTime = 2500;
        isDeleting = true;
      } else {
        pauseTime = 30 + Math.random() * 40;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseTime = 500;
      } else {
        pauseTime = 15;
      }
    }

    setTimeout(type, pauseTime);
  }

  // Start after hero animation finishes
  setTimeout(type, 1200);
}

/* ── Live Viewer Counter ────────────────────────────────────────── */
function initLiveViewers() {
  const el = document.getElementById('liveViewerCount');
  if (!el) return;

  const base = 35 + Math.floor(Math.random() * 30);
  el.textContent = base;

  setInterval(() => {
    const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
    const current = parseInt(el.textContent);
    const next = Math.max(20, Math.min(120, current + delta));
    el.textContent = next;
  }, 4000);
}

/* ── Back-to-Top with Scroll Progress ───────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  const bar = document.getElementById('topProgressBar');
  if (!btn || !bar) return;

  const circumference = 2 * Math.PI * 16;
  bar.style.strokeDasharray = circumference;
  bar.style.strokeDashoffset = circumference;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);

    bar.style.strokeDashoffset = circumference - (progress * circumference);
    btn.classList.toggle('visible', scrollTop > 400);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Trip Cost Calculator ───────────────────────────────────────── */
function initCalculator() {
  const roomPrices = {
    budget: 800, standard: 2500, deluxe: 5000, suite: 8500, luxury: 15000
  };

  let nights = 3, guests = 2;

  const nightsEl = document.getElementById('calcNightsVal');
  const guestsEl = document.getElementById('calcGuestsVal');
  if (!nightsEl || !guestsEl) return;

  function calc() {
    const roomType = document.getElementById('calcRoom')?.value || 'standard';
    const roomPrice = roomPrices[roomType] || 2500;

    const meals = document.getElementById('calcMeals')?.checked ? 1200 * nights * guests : 0;
    const guide = document.getElementById('calcGuide')?.checked ? 2000 * nights : 0;
    const transport = document.getElementById('calcTransport')?.checked ? 3500 : 0;
    const insurance = document.getElementById('calcInsurance')?.checked ? 500 * guests : 0;

    const stay = roomPrice * nights * guests;
    const subtotal = stay + meals + guide + transport + insurance;
    const gst = Math.round(subtotal * 0.12);
    const total = subtotal + gst;

    // Breakdown
    const breakdown = document.getElementById('calcBreakdown');
    if (breakdown) {
      breakdown.innerHTML = `
        <div class="calc-line"><span>Stay (${nights}N × ${guests}P × ₹${roomPrice.toLocaleString('en-IN')})</span><span>₹${stay.toLocaleString('en-IN')}</span></div>
        ${meals ? `<div class="calc-line"><span>Meals (${nights}D × ${guests}P × ₹1,200)</span><span>₹${meals.toLocaleString('en-IN')}</span></div>` : ''}
        ${guide ? `<div class="calc-line"><span>Expert Guide (${nights}D × ₹2,000)</span><span>₹${guide.toLocaleString('en-IN')}</span></div>` : ''}
        ${transport ? `<div class="calc-line"><span>Transport</span><span>₹${transport.toLocaleString('en-IN')}</span></div>` : ''}
        ${insurance ? `<div class="calc-line"><span>Insurance (${guests}P × ₹500)</span><span>₹${insurance.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="calc-line calc-line-tax"><span>GST (12%)</span><span>₹${gst.toLocaleString('en-IN')}</span></div>
      `;
    }

    const totalEl = document.getElementById('calcTotalAmount');
    if (totalEl) {
      // Animate the number change
      const current = parseInt(totalEl.textContent.replace(/[₹,\s]/g, '')) || 0;
      animateValue(totalEl, current, total, 400);
    }

    const ppEl = document.getElementById('calcPerPerson');
    if (ppEl) ppEl.textContent = `₹${Math.round(total / guests).toLocaleString('en-IN')} per person`;
  }

  function animateValue(el, start, end, duration) {
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = `₹${current.toLocaleString('en-IN')}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Stepper handlers
  document.getElementById('calcNightsMinus')?.addEventListener('click', () => {
    if (nights > 1) { nights--; nightsEl.textContent = nights; calc(); }
  });
  document.getElementById('calcNightsPlus')?.addEventListener('click', () => {
    if (nights < 30) { nights++; nightsEl.textContent = nights; calc(); }
  });
  document.getElementById('calcGuestsMinus')?.addEventListener('click', () => {
    if (guests > 1) { guests--; guestsEl.textContent = guests; calc(); }
  });
  document.getElementById('calcGuestsPlus')?.addEventListener('click', () => {
    if (guests < 20) { guests++; guestsEl.textContent = guests; calc(); }
  });

  // Change handlers
  document.getElementById('calcRoom')?.addEventListener('change', calc);
  document.getElementById('calcDest')?.addEventListener('change', calc);
  ['calcMeals', 'calcGuide', 'calcTransport', 'calcInsurance'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', calc);
  });

  // Book button
  document.getElementById('calcBookNow')?.addEventListener('click', () => {
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  calc();
}

/* ── Enhanced Gallery Lightbox with Navigation ──────────────────── */
function initEnhancedGallery() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const counter = document.getElementById('lightboxCounter');
  if (!lightbox || !lbImg) return;

  const galleryItems = [...document.querySelectorAll('.gallery-item[data-src]')];
  let currentIndex = 0;

  const galleryData = [
    { src: 'images/srsv.jpg', caption: 'Sunrise over Spiti Valley — a symphony of gold and ice' },
    { src: 'images/rohtangsnow.jpg', caption: 'Rohtang Pass — where the earth meets the clouds at 3,978m' },
    { src: 'images/parvatiriver.jpg', caption: 'Parvati River in Kasol — crystal-clear waters through emerald forests' },
    { src: 'images/khajiar.jpg', caption: 'Khajjiar — the mini Switzerland of India' },
    { src: 'images/keymonastery.jpg', caption: 'Key Monastery — a 1,000-year-old fortress of faith in Spiti' },
  ];

  function showImage(index) {
    if (index < 0 || index >= galleryData.length) return;
    currentIndex = index;
    lbImg.src = galleryData[index].src;
    if (caption) caption.textContent = galleryData[index].caption;
    if (counter) counter.textContent = `${index + 1} / ${galleryData.length}`;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      showImage(i);
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
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) return;
    if (e.target === lightbox) closeLb();
  });

  document.getElementById('lightboxPrev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage((currentIndex - 1 + galleryData.length) % galleryData.length);
  });

  document.getElementById('lightboxNext')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage((currentIndex + 1) % galleryData.length);
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + galleryData.length) % galleryData.length);
    if (e.key === 'ArrowRight') showImage((currentIndex + 1) % galleryData.length);
  });
}

/* ── Chat Widget ────────────────────────────────────────────────── */
function initChatWidget() {
  const trigger = document.getElementById('chatTrigger');
  const popup = document.getElementById('chatPopup');
  const closeBtn = document.getElementById('chatPopupClose');
  if (!trigger || !popup) return;

  trigger.addEventListener('click', () => {
    popup.classList.toggle('open');
    trigger.classList.toggle('active');
  });

  closeBtn?.addEventListener('click', () => {
    popup.classList.remove('open');
    trigger.classList.remove('active');
  });

  // Auto-show after 15 seconds
  setTimeout(() => {
    if (!popup.classList.contains('open')) {
      trigger.classList.add('bounce');
      setTimeout(() => trigger.classList.remove('bounce'), 2000);
    }
  }, 15000);
}

/* ── Cookie Consent ─────────────────────────────────────────────── */
function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  if (!banner || localStorage.getItem('hp_cookie_consent')) return;

  setTimeout(() => banner.classList.add('show'), 3000);

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('hp_cookie_consent', 'accepted');
    banner.classList.remove('show');
  });

  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('hp_cookie_consent', 'declined');
    banner.classList.remove('show');
  });
}

/* ── FAQ Accordion ──────────────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      const icon = item.querySelector('.faq-icon');
      if (icon) icon.textContent = item.open ? '−' : '+';

      // Close others
      if (item.open) {
        items.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
            const otherIcon = other.querySelector('.faq-icon');
            if (otherIcon) otherIcon.textContent = '+';
          }
        });
      }
    });
  });
}

/* ── Destination Quick-View Modal ───────────────────────────────── */
function initDestModal() {
  const modal = document.getElementById('destModal');
  if (!modal) return;

  const destDetails = {
    shimla: {
      name: 'Shimla',
      tag: 'Queen of Hills',
      emoji: '🏛️',
      desc: 'The former summer capital of British India, Shimla is a stunning hillstation at 2,206m altitude. Walk along the iconic Mall Road, ride the UNESCO Heritage Toy Train, and lose yourself in the colonial charm of the Ridge.',
      highlights: ['🚂 Toy Train (UNESCO Heritage)', '🏰 Viceregal Lodge', '⛪ Christ Church', '🏔️ Jakhu Temple', '🎿 Kufri Snow Point'],
      altitude: '2,206m', bestTime: 'Mar – Jun', temp: '15–25°C', travelFrom: '8h from Delhi',
    },
    manali: {
      name: 'Manali',
      tag: 'Valley of Gods',
      emoji: '🏔️',
      desc: 'India\'s adventure capital nestled in the Kullu Valley at 2,050m. From Rohtang Pass snow to Solang Valley thrills and Old Manali\'s bohemian vibe — Manali offers something for every kind of traveller.',
      highlights: ['🏔️ Rohtang Pass (3,978m)', '🪂 Solang Valley Paragliding', '🏛️ Hadimba Temple', '🌊 Beas River Rafting', '♨️ Vashisht Hot Springs'],
      altitude: '2,050m', bestTime: 'Oct – Feb', temp: '-5–20°C', travelFrom: '12h from Delhi',
    },
    spiti: {
      name: 'Spiti Valley',
      tag: 'Little Tibet',
      emoji: '🏯',
      desc: 'A cold desert mountain valley at 4,200m altitude — barren moonscapes, ancient Buddhist monasteries perched on cliffs, crystal-clear lakes, and some of the most star-filled skies on Earth.',
      highlights: ['🏯 Key Monastery', '💎 Chandratal Lake', '🌌 Stargazing at 4,200m', '🏔️ Kunzum Pass', '🦬 Pin Valley Wildlife'],
      altitude: '4,200m', bestTime: 'Jun – Sep', temp: '-15–15°C', travelFrom: '24h from Delhi',
    },
    dharamshala: {
      name: 'Dharamshala',
      tag: 'Abode of Gods',
      emoji: '🙏',
      desc: 'Home to the Dalai Lama and the Tibetan government-in-exile. McLeodganj offers a perfect blend of Tibetan culture, trekking trails to Triund, and arguably the most dramatic cricket ground on the planet.',
      highlights: ['🙏 Dalai Lama Temple', '🏏 HPCA Stadium', '⛰️ Triund Trek', '🎭 Tibetan Culture', '☕ McLeodganj Cafes'],
      altitude: '1,475m', bestTime: 'Mar – Jun', temp: '10–28°C', travelFrom: '10h from Delhi',
    },
    kasol: {
      name: 'Kasol',
      tag: 'Mini Israel',
      emoji: '🌿',
      desc: 'A tiny hamlet on the Parvati River, Kasol is the backpacker capital of India. Lush pine forests, hot springs, Israeli-influenced cafes, and trailheads for Kheerganga and Malana make it a paradise for free spirits.',
      highlights: ['🌿 Parvati Valley', '♨️ Kheerganga Hot Springs', '🏔️ Malana Village', '🎶 Trance Culture', '🌲 Pine Forest Treks'],
      altitude: '1,640m', bestTime: 'Mar – Jun', temp: '5–22°C', travelFrom: '13h from Delhi',
    },
    dalhousie: {
      name: 'Dalhousie',
      tag: 'Scotland of India',
      emoji: '🌸',
      desc: 'Named after Lord Dalhousie, this colonial hillstation features Scottish architecture, lush meadows, and the famous Khajjiar — India\'s Switzerland. A serene escape from the chaos, with stunning Dhauladhar views.',
      highlights: ['🌿 Khajjiar Meadows', '⛪ St. John\'s Church', '🏔️ Dhauladhar Views', '💐 Dainkund Peak', '🛶 Chamera Lake'],
      altitude: '1,970m', bestTime: 'Apr – Jun', temp: '8–22°C', travelFrom: '11h from Delhi',
    }
  };

  function openModal(destId) {
    const data = destDetails[destId];
    if (!data) return;

    document.getElementById('destModalName').textContent = data.name;
    document.getElementById('destModalTag').textContent = `${data.emoji} ${data.tag}`;
    document.getElementById('destModalBadge').textContent = data.emoji;
    document.getElementById('destModalDesc').innerHTML = `<p>${data.desc}</p>`;

    const highlights = data.highlights.map(h => `<span class="dest-modal-highlight">${h}</span>`).join('');
    document.getElementById('destModalHighlights').innerHTML = `<h4>Must-See Highlights</h4><div class="dest-modal-highlight-grid">${highlights}</div>`;

    document.getElementById('destModalInfo').innerHTML = `
      <div class="dest-info-item"><span class="dest-info-label">Altitude</span><strong>${data.altitude}</strong></div>
      <div class="dest-info-item"><span class="dest-info-label">Best Time</span><strong>${data.bestTime}</strong></div>
      <div class="dest-info-item"><span class="dest-info-label">Temperature</span><strong>${data.temp}</strong></div>
      <div class="dest-info-item"><span class="dest-info-label">From Delhi</span><strong>${data.travelFrom}</strong></div>
    `;

    // Set header gradient based on destination
    const gradients = {
      shimla: 'linear-gradient(135deg, #1a3a2a, #2d6a4f)',
      manali: 'linear-gradient(135deg, #1a4a6e, #2d6a9a)',
      spiti: 'linear-gradient(135deg, #3a2a1a, #8a6a3a)',
      dharamshala: 'linear-gradient(135deg, #1a4a6e, #2d8a9a)',
      kasol: 'linear-gradient(135deg, #1a3a1a, #2d6a2d)',
      dalhousie: 'linear-gradient(135deg, #3a1a4a, #6a2d8a)',
    };
    document.getElementById('destModalHeader').style.background = gradients[destId] || gradients.shimla;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Book button
    document.getElementById('destModalBookBtn').onclick = () => {
      closeModal();
      const radio = document.querySelector(`input[name="destination"][value="${destId}"]`);
      if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change')); }
      document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close handlers
  document.getElementById('destModalClose')?.addEventListener('click', closeModal);
  document.getElementById('destModalBackdrop')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Double-click destination cards to open modal
  document.querySelectorAll('[data-book-dest]').forEach(card => {
    card.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal(card.dataset.bookDest);
    });

    // Add a "Quick View" eye icon overlay
    const quickView = document.createElement('button');
    quickView.className = 'dest-quick-view';
    quickView.innerHTML = '👁️ Quick View';
    quickView.setAttribute('aria-label', 'Quick view destination details');
    quickView.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModal(card.dataset.bookDest);
    });

    const overlay = card.querySelector('.dest-card-overlay');
    if (overlay) overlay.appendChild(quickView);
  });
}

/* ── Seasonal Ambient Particles (Snow / Leaves) ─────────────────── */
function initAmbientParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'ambientParticles';
  canvas.className = 'ambient-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  const month = new Date().getMonth();
  const isWinter = month >= 10 || month <= 2; // Nov-Feb

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createParticle = () => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: isWinter ? Math.random() * 3 + 1 : Math.random() * 4 + 2,
    vx: (Math.random() - 0.5) * 0.8,
    vy: Math.random() * 1.5 + 0.5,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 2,
    opacity: Math.random() * 0.4 + 0.1,
  });

  const init = () => {
    particles = Array.from({ length: 25 }, createParticle);
    particles.forEach(p => p.y = Math.random() * canvas.height);
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      if (isWinter) {
        // Snowflake
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      } else {
        // Leaf
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${100 + Math.random() * 40}, 60%, 45%, 0.6)`;
        ctx.fill();
      }

      ctx.restore();

      p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      if (p.y > canvas.height + 10) Object.assign(p, createParticle());
    });

    requestAnimationFrame(draw);
  };

  resize();
  init();
  draw();
  window.addEventListener('resize', resize, { passive: true });
}

/* ── Weather Card Hover Effect ──────────────────────────────────── */
function initWeatherCards() {
  document.querySelectorAll('.weather-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });
}

/* ── Blog Card Hover Tilt ───────────────────────────────────────── */
function initBlogCards() {
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-12px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

/* ── Currency Converter ─────────────────────────────────────────── */
const CURRENCY_RATES = {
  INR: { rate: 1,      symbol: '₹',   code: 'INR' },
  USD: { rate: 0.012,  symbol: '$',   code: 'USD' },
  EUR: { rate: 0.011,  symbol: '€',   code: 'EUR' },
  GBP: { rate: 0.0094, symbol: '£',   code: 'GBP' },
  AUD: { rate: 0.018,  symbol: 'A$',  code: 'AUD' },
  CAD: { rate: 0.016,  symbol: 'C$',  code: 'CAD' },
  ILS: { rate: 0.044,  symbol: '₪',   code: 'ILS' },
  AED: { rate: 0.044,  symbol: 'AED ', code: 'AED' },
};

function initCurrencyConverter() {
  const select = document.getElementById('currencySelector');
  if (!select) return;

  const saved = localStorage.getItem('hp_currency') || 'INR';
  select.value = saved;

  function updatePrices(currCode) {
    const config = CURRENCY_RATES[currCode] || CURRENCY_RATES.INR;
    localStorage.setItem('hp_currency', currCode);

    document.querySelectorAll('[data-price-inr]').forEach(el => {
      const inr = parseFloat(el.dataset.priceInr);
      if (isNaN(inr)) return;

      const converted = Math.round(inr * config.rate);
      const formatted = `${config.symbol}${converted.toLocaleString('en-IN')}`;

      const amountEl = el.querySelector('.amount');
      const currencyEl = el.querySelector('.currency');

      if (amountEl && currencyEl) {
        currencyEl.textContent = config.symbol;
        amountEl.textContent = converted.toLocaleString('en-IN');
      } else {
        el.textContent = formatted;
      }
    });

    if (window.showToast) {
      window.showToast('💱', 'Currency Updated', `Displaying rates in ${currCode} (${config.symbol})`);
    }
  }

  select.addEventListener('change', (e) => {
    updatePrices(e.target.value);
  });

  if (saved !== 'INR') {
    updatePrices(saved);
  }
}

/* ── Destination Search & Category Filter ───────────────────────── */
function initDestinationFilter() {
  const searchInput = document.getElementById('destSearchInput');
  const clearBtn = document.getElementById('destSearchClear');
  const pills = document.querySelectorAll('.dest-pill');
  const cards = document.querySelectorAll('.dest-card');
  if (!cards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function filterCards() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCats = (card.dataset.category || '').toLowerCase();
      const cardName = (card.querySelector('.dest-card-name')?.textContent || '').toLowerCase();
      const cardTag = (card.querySelector('.dest-card-tag')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.dest-card-desc')?.textContent || '').toLowerCase();

      const matchesCat = currentCategory === 'all' || cardCats.includes(currentCategory);
      const matchesSearch = !searchQuery ||
        cardName.includes(searchQuery) ||
        cardTag.includes(searchQuery) ||
        cardDesc.includes(searchQuery) ||
        cardCats.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden-filter');
        visibleCount++;
      } else {
        card.classList.add('hidden-filter');
      }
    });

    if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.filter || 'all';
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      filterCards();
    });
  }
}

/* ── Weather Unit & 3-Day Forecast Modal ────────────────────────── */
const CITY_FORECASTS = {
  shimla: {
    name: 'Shimla', icon: '🌤️', tempC: 22, condition: 'Partly Cloudy',
    humidity: '65%', wind: '12 km/h', uv: 'Moderate (Index 5)', air: 'AQI 32 (Good)',
    days: [
      { name: 'Today', icon: '🌤️', tempC: 22, desc: 'Pleasant & clear afternoon' },
      { name: 'Tomorrow', icon: '⛅', tempC: 20, desc: 'Passing alpine clouds' },
      { name: 'Day 3', icon: '🌦️', tempC: 19, desc: 'Brief light mountain showers' },
    ],
    advisory: '🛡️ Road advisory: Kalka-Shimla NH is clear and smooth. Pleasant weather; a light sweater or fleece is recommended for evening walks on Mall Road.'
  },
  manali: {
    name: 'Manali', icon: '❄️', tempC: 8, condition: 'Light Snow',
    humidity: '78%', wind: '18 km/h', uv: 'Low (Index 3)', air: 'AQI 22 (Pristine)',
    days: [
      { name: 'Today', icon: '❄️', tempC: 8, desc: 'Light snow at Solang & Gulaba' },
      { name: 'Tomorrow', icon: '🌨️', tempC: 5, desc: 'Fresh snowfall expected' },
      { name: 'Day 3', icon: '🌤️', tempC: 10, desc: 'Crisp sunny snow day' },
    ],
    advisory: '🛡️ Road advisory: Atal Tunnel is open. Carry snow chains if proceeding beyond Palchan. Waterproof boots and down jackets essential.'
  },
  spiti: {
    name: 'Spiti Valley', icon: '☀️', tempC: 4, condition: 'Clear Mountain Skies',
    humidity: '25%', wind: '22 km/h', uv: 'Very High (Index 8)', air: 'AQI 14 (Pure)',
    days: [
      { name: 'Today', icon: '☀️', tempC: 4, desc: 'Dry sunshine, crisp air' },
      { name: 'Tomorrow', icon: '🌤️', tempC: 3, desc: 'Windy at Kunzum Pass' },
      { name: 'Day 3', icon: '❄️', tempC: -2, desc: 'Freezing night, clear star skies' },
    ],
    advisory: '🛡️ Road advisory: High altitude (3,800m+). Diamox/acclimatization recommended. UV radiation is intense — wear UV400 sunglasses and high SPF sunscreen.'
  },
  dharamshala: {
    name: 'Dharamshala', icon: '🌦️', tempC: 18, condition: 'Light Mountain Rain',
    humidity: '82%', wind: '8 km/h', uv: 'Moderate (Index 4)', air: 'AQI 28 (Good)',
    days: [
      { name: 'Today', icon: '🌦️', tempC: 18, desc: 'Intermittent pine forest mist' },
      { name: 'Tomorrow', icon: '🌤️', tempC: 21, desc: 'Clearing skies with Dhauladhar views' },
      { name: 'Day 3', icon: '☀️', tempC: 23, desc: 'Ideal day for Triund ridge trek' },
    ],
    advisory: '🛡️ Road advisory: Roads clear. Triund trek trails may be damp in early morning — sturdy trekking shoes with ankle support strongly advised.'
  },
  kasol: {
    name: 'Kasol', icon: '🌿', tempC: 16, condition: 'Misty Alpine Valley',
    humidity: '72%', wind: '6 km/h', uv: 'Moderate (Index 5)', air: 'AQI 18 (Fresh)',
    days: [
      { name: 'Today', icon: '🌿', tempC: 16, desc: 'Misty breezes along Parvati River' },
      { name: 'Tomorrow', icon: '🌤️', tempC: 19, desc: 'Warm sunny cafe afternoons' },
      { name: 'Day 3', icon: '⛅', tempC: 17, desc: 'Pleasant hiking conditions' },
    ],
    advisory: '🛡️ Road advisory: Bhuntar-Kasol route is smooth. Riverside rocks are slippery — avoid wading into high-speed rapids of the Parvati River.'
  },
  dalhousie: {
    name: 'Dalhousie', icon: '🌫️', tempC: 14, condition: 'Foggy Colonial Ridges',
    humidity: '80%', wind: '10 km/h', uv: 'Low (Index 3)', air: 'AQI 25 (Clean)',
    days: [
      { name: 'Today', icon: '🌫️', tempC: 14, desc: 'Romantic rolling mountain fog' },
      { name: 'Tomorrow', icon: '🌤️', tempC: 18, desc: 'Clear views across Khajjiar lake' },
      { name: 'Day 3', icon: '⛅', tempC: 17, desc: 'Pleasant pine-scented walking day' },
    ],
    advisory: '🛡️ Road advisory: Pathankot-Dalhousie highway in excellent condition. Foggy mornings require cautious driving with low-beam fog lights.'
  }
};

function initWeatherUnitAndForecast() {
  let isCelsius = true;

  const unitToggle = document.getElementById('weatherUnitToggle');
  const unitButtons = unitToggle ? unitToggle.querySelectorAll('.unit-btn') : [];

  function updateWeatherTemps() {
    document.querySelectorAll('.weather-card').forEach(card => {
      const c = parseFloat(card.dataset.celsius || '20');
      const tempEl = card.querySelector('.weather-temp');
      if (tempEl) {
        if (isCelsius) {
          tempEl.textContent = `${Math.round(c)}°C`;
        } else {
          const f = Math.round(c * 9 / 5 + 32);
          tempEl.textContent = `${f}°F`;
        }
      }
    });
  }

  unitButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      unitButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      isCelsius = btn.dataset.unit === 'C';
      updateWeatherTemps();
    });
  });

  // 3-Day Forecast Modal
  const modal = document.getElementById('forecastModal');
  const modalCity = document.getElementById('forecastModalCity');
  const modalIcon = document.getElementById('forecastModalIcon');
  const fcCurrentTemp = document.getElementById('fcCurrentTemp');
  const fcCurrentCondition = document.getElementById('fcCurrentCondition');
  const fcCurrentMetrics = document.getElementById('fcCurrentMetrics');
  const forecastDaysGrid = document.getElementById('forecastDaysGrid');
  const forecastAdvisoryBox = document.getElementById('forecastAdvisoryBox');
  const forecastBookBtn = document.getElementById('forecastBookDestBtn');
  let selectedCityId = 'manali';

  function openForecast(cityId) {
    if (!modal) return;
    const data = CITY_FORECASTS[cityId] || CITY_FORECASTS.manali;
    selectedCityId = cityId;

    if (modalCity) modalCity.textContent = `${data.name} Mountain Weather`;
    if (modalIcon) modalIcon.textContent = data.icon;

    const displayTemp = isCelsius ? `${data.tempC}°C` : `${Math.round(data.tempC * 9 / 5 + 32)}°F`;
    if (fcCurrentTemp) fcCurrentTemp.textContent = displayTemp;
    if (fcCurrentCondition) fcCurrentCondition.textContent = data.condition;

    if (fcCurrentMetrics) {
      fcCurrentMetrics.innerHTML = `
        <div><strong>💧 Humidity:</strong> ${data.humidity}</div>
        <div><strong>💨 Wind:</strong> ${data.wind}</div>
        <div><strong>☀️ UV Index:</strong> ${data.uv}</div>
        <div><strong>🌲 Air Quality:</strong> ${data.air}</div>
      `;
    }

    if (forecastDaysGrid) {
      forecastDaysGrid.innerHTML = data.days.map(d => {
        const t = isCelsius ? `${d.tempC}°C` : `${Math.round(d.tempC * 9 / 5 + 32)}°F`;
        return `
          <div class="fc-day-card">
            <div class="fc-day-name">${d.name}</div>
            <div class="fc-day-icon">${d.icon}</div>
            <div class="fc-day-temp">${t}</div>
            <div class="fc-day-desc">${d.desc}</div>
          </div>
        `;
      }).join('');
    }

    if (forecastAdvisoryBox) {
      forecastAdvisoryBox.innerHTML = `<p>${data.advisory}</p>`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeForecast() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.weather-card[data-city-id]').forEach(card => {
    card.addEventListener('click', () => {
      openForecast(card.dataset.cityId);
    });
  });

  document.getElementById('forecastModalClose')?.addEventListener('click', closeForecast);
  document.getElementById('forecastModalBackdrop')?.addEventListener('click', closeForecast);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeForecast();
  });

  if (forecastBookBtn) {
    forecastBookBtn.addEventListener('click', () => {
      closeForecast();
      const radio = document.querySelector(`input[name="destination"][value="${selectedCityId}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
      document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* ── Mountain Passes & Circuit Elevation Visualizer ─────────────── */
const CIRCUITS_DATA = {
  spiti: {
    title: 'Spiti High-Altitude Frontier Expedition',
    badge: 'Trans-Himalayan Overland Circuit',
    desc: 'The ultimate overland pilgrimage into the high cold desert: barren moonscapes, thousand-year-old Buddhist clifftop fortresses, crossing 4,551m Kunzum Pass, and camping by the sapphire waters of Chandratal.',
    distance: '1,150 km',
    peak: '4,551m (Kunzum Pass)',
    days: '8 Nights / 9 Days',
    vehicle: 'High-Clearance 4x4 SUV',
    waypoints: [
      { name: 'Shimla',        alt: 2206, o2: 78, tip: 'Colonial capital, initial climb' },
      { name: 'Narkanda',      alt: 2708, o2: 74, tip: 'Apple orchards & Hatu Peak' },
      { name: 'Sangla',        alt: 2696, o2: 74, tip: 'Baspa river emerald valley' },
      { name: 'Kalpa',         alt: 2960, o2: 71, tip: 'Sacred Kinner Kailash sunrise' },
      { name: 'Nako Lake',     alt: 3625, o2: 66, tip: 'High-altitude oasis' },
      { name: 'Tabo',          alt: 3280, o2: 69, tip: 'Ajanta of the Himalayas (996 AD)' },
      { name: 'Kaza',          alt: 3800, o2: 64, tip: 'Heart of Spiti & highest petrol pump' },
      { name: 'Key Gompa',     alt: 4166, o2: 61, tip: 'Ancient cliffside monastery' },
      { name: 'Kunzum Pass',   alt: 4551, o2: 57, tip: 'High mountain pass & temple chortens' },
      { name: 'Chandratal',    alt: 4250, o2: 60, tip: 'Moon Lake alpine reflection' },
      { name: 'Manali',        alt: 2050, o2: 80, tip: 'Descent via Atal Tunnel' },
    ]
  },
  golden: {
    title: 'Classic Golden Himachal Circuit',
    badge: 'Premier Mountain Highlights',
    desc: 'The quintessential journey across Himachal Pradesh: British colonial heritage in Shimla, lush deodar valleys of Kullu, paragliding over Solang, and snow-filled panoramas of Rohtang Pass.',
    distance: '550 km',
    peak: '3,978m (Rohtang Pass)',
    days: '5 Nights / 6 Days',
    vehicle: 'Sedan / SUV / Coach',
    waypoints: [
      { name: 'Delhi',         alt: 216,  o2: 98, tip: 'Starting point' },
      { name: 'Chandigarh',    alt: 321,  o2: 97, tip: 'Gateway to Shivalik hills' },
      { name: 'Shimla',        alt: 2206, o2: 78, tip: 'Mall Road & Ridge walks' },
      { name: 'Mandi',         alt: 760,  o2: 92, tip: 'Beas river stone temples' },
      { name: 'Kullu Valley',  alt: 1278, o2: 88, tip: 'Shawl weavers & rafting' },
      { name: 'Manali',        alt: 2050, o2: 80, tip: 'Old Manali cafes & pine trails' },
      { name: 'Solang Valley', alt: 2400, o2: 76, tip: 'Paragliding & adventure' },
      { name: 'Rohtang Pass',  alt: 3978, o2: 62, tip: 'Glaciers & year-round snow' },
    ]
  },
  kangra: {
    title: 'Dhauladhar & Kangra Valley Spiritual Trail',
    badge: 'Tibetan Culture & Ridge Treks',
    desc: 'Immerse in the peaceful Tibetan monastery atmosphere of McLeodganj, hike the breathtaking Triund ridge beneath the vertical Dhauladhar rock walls, and soar from world-famous Bir Billing.',
    distance: '420 km',
    peak: '2,828m (Triund Ridge)',
    days: '4 Nights / 5 Days',
    vehicle: 'Any Vehicle',
    waypoints: [
      { name: 'Chandigarh',    alt: 321,  o2: 97, tip: 'Shivalik highway drive' },
      { name: 'Kangra Fort',   alt: 733,  o2: 93, tip: '3,500-year-old historic fort' },
      { name: 'Dharamshala',   alt: 1475, o2: 86, tip: 'International cricket ground' },
      { name: 'McLeodganj',    alt: 2082, o2: 80, tip: 'Dalai Lama Temple & Tibetan cafes' },
      { name: 'Triund Ridge',  alt: 2828, o2: 73, tip: 'Dramatic Dhauladhar snow wall' },
      { name: 'Palampur',      alt: 1220, o2: 88, tip: 'Lush Kangra tea estates' },
      { name: 'Bir Billing',   alt: 2400, o2: 76, tip: 'Paragliding takeoff site' },
    ]
  }
};

function initCircuitVisualizer() {
  const tabs = document.querySelectorAll('.circuit-tab');
  const titleEl = document.getElementById('circuitTitle');
  const badgeEl = document.getElementById('circuitBadge');
  const descEl = document.getElementById('circuitDesc');
  const distEl = document.getElementById('circuitDistance');
  const peakEl = document.getElementById('circuitPeak');
  const daysEl = document.getElementById('circuitDays');
  const vehEl = document.getElementById('circuitVehicle');
  const svg = document.getElementById('elevationSvg');
  const tooltip = document.getElementById('elevationTooltip');
  const waypointsGrid = document.getElementById('circuitWaypoints');
  const bookBtn = document.getElementById('bookCircuitBtn');

  let activeCircuit = 'spiti';

  function renderCircuit(circuitKey) {
    const data = CIRCUITS_DATA[circuitKey];
    if (!data) return;
    activeCircuit = circuitKey;

    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (descEl) descEl.textContent = data.desc;
    if (distEl) distEl.textContent = data.distance;
    if (peakEl) peakEl.textContent = data.peak;
    if (daysEl) daysEl.textContent = data.days;
    if (vehEl) vehEl.textContent = data.vehicle;

    // Render SVG
    if (svg) {
      const w = 800;
      const h = 220;
      const maxAlt = 5000;
      const pts = data.waypoints;

      const coords = pts.map((p, i) => {
        const x = 50 + (i / (pts.length - 1)) * (w - 100);
        const y = h - 35 - (p.alt / maxAlt) * (h - 70);
        return { x, y, ...p };
      });

      // Spline path generator
      let pathD = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i];
        const p1 = coords[i + 1];
        const cx1 = p0.x + (p1.x - p0.x) / 2;
        const cy1 = p0.y;
        const cx2 = p0.x + (p1.x - p0.x) / 2;
        const cy2 = p1.y;
        pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
      }

      const areaD = `${pathD} L ${coords[coords.length - 1].x} ${h - 15} L ${coords[0].x} ${h - 15} Z`;

      const circlesHtml = coords.map((c, i) => `
        <g class="elev-point-group" data-idx="${i}" tabindex="0">
          <circle cx="${c.x}" cy="${c.y}" r="6" fill="#c9a84c" stroke="#1a1a1a" stroke-width="2.5" class="elev-circle" />
          <circle cx="${c.x}" cy="${c.y}" r="14" fill="transparent" class="elev-hitbox" />
          <text x="${c.x}" y="${h - 4}" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.6">${c.name.split(' ')[0]}</text>
        </g>
      `).join('');

      svg.innerHTML = `
        <defs>
          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#c9a84c" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#38a169"/>
            <stop offset="50%" stop-color="#c9a84c"/>
            <stop offset="100%" stop-color="#e53e3e"/>
          </linearGradient>
        </defs>
        <!-- Horizontal Grid Lines -->
        <line x1="40" y1="35" x2="760" y2="35" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="4"/>
        <text x="35" y="38" text-anchor="end" font-size="9" fill="currentColor" opacity="0.4">4,500m</text>
        <line x1="40" y1="105" x2="760" y2="105" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="4"/>
        <text x="35" y="108" text-anchor="end" font-size="9" fill="currentColor" opacity="0.4">2,500m</text>
        <line x1="40" y1="185" x2="760" y2="185" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="4"/>
        <text x="35" y="188" text-anchor="end" font-size="9" fill="currentColor" opacity="0.4">0m</text>
        <!-- Filled Area -->
        <path d="${areaD}" fill="url(#elevGrad)"/>
        <!-- Elevation Spline -->
        <path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-linecap="round"/>
        <!-- Waypoint Points -->
        ${circlesHtml}
      `;

      // Event listeners for tooltips
      const pointGroups = svg.querySelectorAll('.elev-point-group');
      pointGroups.forEach(grp => {
        const idx = parseInt(grp.dataset.idx);
        const pt = coords[idx];

        const showTip = () => {
          if (!tooltip) return;
          tooltip.innerHTML = `
            <strong>📍 ${pt.name}</strong> · ${pt.alt}m (${Math.round(pt.alt * 3.28084)} ft)<br/>
            <span>🌬️ Oxygen Level: ~${pt.o2}%</span><br/>
            <em>${pt.tip}</em>
          `;
          tooltip.style.display = 'block';
          tooltip.style.left = `${(pt.x / w) * 100}%`;
          tooltip.style.top = `${(pt.y / h) * 100}%`;
        };

        const hideTip = () => {
          if (tooltip) tooltip.style.display = 'none';
        };

        grp.addEventListener('mouseenter', showTip);
        grp.addEventListener('focus', showTip);
        grp.addEventListener('mouseleave', hideTip);
        grp.addEventListener('blur', hideTip);
      });
    }

    // Render Waypoints Grid
    if (waypointsGrid) {
      waypointsGrid.innerHTML = data.waypoints.slice(0, 5).map((wp, i) => `
        <div class="waypoint-card">
          <span class="waypoint-num">${i + 1}</span>
          <div class="waypoint-name">${wp.name}</div>
          <div class="waypoint-alt">${wp.alt}m</div>
          <div class="waypoint-desc">${wp.tip}</div>
        </div>
      `).join('');
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderCircuit(tab.dataset.circuit);
    });
  });

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const destMap = { spiti: 'spiti', golden: 'manali', kangra: 'dharamshala' };
      const destId = destMap[activeCircuit] || 'spiti';
      const radio = document.querySelector(`input[name="destination"][value="${destId}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
      document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  renderCircuit('spiti');
}

/* ── Multi-Destination Itinerary Switcher ────────────────────────── */
const ITINERARIES_DATA = {
  manali: {
    duration: '5 Days / 4 Nights',
    altitude: '2,050m – 3,978m (Rohtang Pass)',
    level: 'Moderate & Thrilling Adventure',
    season: 'Year-Round (Best Oct–Jun)',
    days: [
      { num: 1, alt: '2,050m', title: 'Arrival & Old Manali Heritage Walk', desc: 'Arrive in Manali by luxury Volvo coach or flight. Check into riverside boutique stay. Evening walk through Old Manali cobblestone lanes, local cafes, and the ancient Manu Temple. Welcome dinner with live acoustic mountain music.', tags: ['🏨 Check-in', '🚶 Walking Tour', '🍽️ Welcome Dinner'] },
      { num: 2, alt: '2,400m', title: 'Solang Valley Paragliding & Adventure', desc: 'Full day at Solang Valley — paraglide over emerald alpine meadows with snow peaks in sight, zorbing, and optional ATV rides. Lunch at mountain-top restaurant with 360° Himalayan views. Evening bonfire & stargazing at resort.', tags: ['🪂 Paragliding', '⛷️ Snow Sports', '🔥 Bonfire Night'] },
      { num: 3, alt: '3,978m', title: 'Rohtang Pass & Atal Tunnel High-Altitude Drive', desc: 'Traverse through the world’s longest highway tunnel at 3,000m altitude into Lahaul, then ascend to legendary Rohtang Pass (3,978m). Pristine snow fields, glacier views of Beas Kund, and piping hot rajma-chawal at Marhi.', tags: ['🏔️ 3,978m Altitude', '❄️ Year-round Snow', '🚗 Atal Tunnel'] },
      { num: 4, alt: '1,750m', title: 'Naggar Castle, Art Village & Herbal Spa', desc: 'Visit 500-year-old timber and stone Naggar Castle, Roerich Art Gallery, and riverside trout farms. Afternoon relaxing Himalayan herbal spa session at your resort. Traditional Himachali folk dance & cultural dinner.', tags: ['🏰 Medieval Castle', '🎨 Nicholas Roerich Art', '💆 Herbal Spa'] },
      { num: 5, alt: '2,050m', title: 'Sunrise Yoga, Mall Road Shopping & Farewell', desc: 'Gentle morning yoga overlooking deodar forests. Hearty buffet breakfast, shopping for authentic Kullu shawls, wooden crafts, and organic mountain honey at Mall Road. Transfer to bus terminal or airport with fond memories.', tags: ['🧘 Yoga', '🛍️ Handicrafts', '✈️ Departure'] },
    ]
  },
  spiti: {
    duration: '7 Days / 6 Nights',
    altitude: '3,280m – 4,551m (Kunzum Pass)',
    level: 'Challenging & Unforgettable',
    season: 'Jun – Oct (Peak Summer & Autumn)',
    days: [
      { num: 1, alt: '2,206m', title: 'Shimla to Kalpa — Gateway to Kinnaur', desc: 'Scenic drive along the Hindustan-Tibet Highway through lush apple valleys of Kinnaur. Check into Kalpa with dramatic views of the sacred 6,050m Kinner Kailash peak at sunset.', tags: ['🚗 Scenic Highway', '🏔️ Kinner Kailash', '🏨 Kinnaur Stay'] },
      { num: 2, alt: '3,280m', title: 'Kalpa to Tabo — Thousand-Year-Old Monastery', desc: 'Enter the arid cold desert. Stop at Nako sacred lake and village. Arrive in Tabo to explore the UNESCO Heritage monastery founded in 996 AD, filled with ancient Buddhist frescoes.', tags: ['🏯 1,000-Yr Monastery', '💎 Nako Lake', '📜 Tibetan Frescoes'] },
      { num: 3, alt: '3,800m', title: 'Tabo to Kaza & Dhankar Clifftop Gompa', desc: 'Ascend along the Spiti river to Dhankar Monastery perched precariously on razor-sharp cliff pinnacles. Short hike to high-altitude Dhankar Lake, then drive to Kaza, the sub-divisional capital.', tags: ['🏰 Dhankar Cliff', '⛰️ High Lake Hike', '📍 Kaza Capital'] },
      { num: 4, alt: '4,166m', title: 'Key Monastery, Kibber & Chicham Bridge', desc: 'Visit the world-famous Key Gompa fortress, receive butter tea blessings from lamas, explore Kibber (one of the highest inhabited villages), and cross the sensational Chicham suspension gorge bridge.', tags: ['🏯 Key Gompa', '🌉 Chicham Bridge', '🦬 Snow Leopard Habitat'] },
      { num: 5, alt: '4,400m', title: 'Hikkim (Highest Post Office), Komic & Langza', desc: 'Send a postcard to your loved ones from Hikkim (the world’s highest post office at 4,400m). Visit the giant Buddha statue watching over the valley in Langza, searching for ancient marine fossils.', tags: ['📮 World Highest Post Office', '🙏 Langza Buddha', '🐚 Marine Fossils'] },
      { num: 6, alt: '4,250m', title: 'Kunzum Pass Crossing & Chandratal Moon Lake', desc: 'Cross the dramatic 4,551m Kunzum Pass to reach Chandratal (Moon Lake). Camp by the crystal turquoise waters beneath the galaxy of millions of visible Milky Way stars.', tags: ['🏔️ 4,551m Kunzum Pass', '🌌 Milky Way Stargazing', '🏕️ Glacial Lake Camp'] },
      { num: 7, alt: '2,050m', title: 'Chandratal to Manali via Atal Tunnel & Departure', desc: 'Drive down the rugged Batal riverbed boulders, enter the smooth Atal Tunnel, and arrive in Manali for farewell lunch and onward travel. Truly the trip of a lifetime!', tags: ['🌊 Batal Riverbed', '🚗 Atal Tunnel', '🎉 Expedition Complete'] },
    ]
  },
  shimla: {
    duration: '3 Days / 2 Nights',
    altitude: '2,206m – 2,622m (Kufri)',
    level: 'Easy & Leisure Family Friendly',
    season: 'Year-Round (Snow Dec–Feb)',
    days: [
      { num: 1, alt: '2,206m', title: 'Colonial Heritage & The Ridge Promenade', desc: 'Arrive in Shimla by the UNESCO Heritage Toy Train. Check into colonial-style heritage hotel. Afternoon walk across Mall Road, Christ Church, and the historic Gaiety Theatre.', tags: ['🚂 UNESCO Toy Train', '⛪ Christ Church', '☕ Mall Road Cafes'] },
      { num: 2, alt: '2,622m', title: 'Kufri Snow Adventure & Jakhu Hanuman Temple', desc: 'Morning drive to Kufri for horse riding, yak photos, and snow views. Afternoon ropeway ride up to Jakhu Temple atop Shimla’s highest peak with giant 108ft Hanuman statue.', tags: ['🎿 Kufri Snow Point', '🚡 Ropeway Ride', '🐒 Jakhu Temple'] },
      { num: 3, alt: '2,100m', title: 'Viceregal Lodge, Pine Forest Walks & Departure', desc: 'Tour the grand Viceregal Lodge (Indian Institute of Advanced Study) with its stately English Renaissance architecture. Leisure shopping for wooden walking sticks and jams before return.', tags: ['🏰 Viceregal Lodge', '🌲 Pine Forest Walk', '🛍️ Local Souvenirs'] },
    ]
  },
  kasol: {
    duration: '4 Days / 3 Nights',
    altitude: '1,640m – 2,960m (Kheerganga)',
    level: 'Moderate Trekking & Free Spirit',
    season: 'Mar – Jun & Sep – Nov',
    days: [
      { num: 1, alt: '1,640m', title: 'Arrival in Kasol & Parvati River Riverside Chill', desc: 'Arrive in Kasol. Check into riverside campsite or wooden cottage. Spend a relaxed afternoon listening to the roaring Parvati River, enjoying Israeli shakshuka and fresh mint tea.', tags: ['⛺ Riverside Camp', '🌊 Parvati Rapids', '🍲 Bohemian Cafes'] },
      { num: 2, alt: '1,760m', title: 'Manikaran Sahib Hot Springs & Chalal Forest Walk', desc: 'Morning visit to the sacred Manikaran Sahib Gurudwara and dip in natural geothermal healing sulfur springs. Afternoon walk through lush pine deodar forest trail to serene Chalal village.', tags: ['♨️ Hot Springs', '🙏 Manikaran Sahib', '🌲 Chalal Trail'] },
      { num: 3, alt: '2,960m', title: 'Trek to Kheerganga & Sunset Hot Springs Bath', desc: 'Trek 12km from Barshaini through waterfalls, oak forests, and alpine meadows up to Kheerganga. Soak in the open-air natural hot springs surrounded by snow-capped peaks at sunset.', tags: ['🥾 12km Forest Trek', '♨️ Clifftop Hot Spring', '🔥 Bonfire Camp'] },
      { num: 4, alt: '1,640m', title: 'Descent, Malana Village Glimpse & Departure', desc: 'Morning mountain sunrise from Kheerganga top. Hike down to Barshaini, optional visit towards the isolated ancient republic village of Malana, then onward transfer to Bhuntar.', tags: ['🌅 Sunrise Peak', '🚶 Hike Descent', '✈️ Departure'] },
    ]
  },
  dharamshala: {
    duration: '4 Days / 3 Nights',
    altitude: '1,475m – 2,828m (Triund Ridge)',
    level: 'Moderate Trekking & Tibetan Culture',
    season: 'Sep – Jun (Best Oct & Mar–May)',
    days: [
      { num: 1, alt: '1,475m', title: 'Arrival, HPCA Cricket Stadium & Tea Gardens', desc: 'Arrive in Dharamshala. Visit the picturesque HPCA Stadium with dramatic Dhauladhar mountain backdrop. Stroll through fragrant Kangra green tea estates and Norbulingka Institute.', tags: ['🏏 HPCA Stadium', '🍵 Kangra Tea Garden', '🎨 Tibetan Arts'] },
      { num: 2, alt: '2,082m', title: 'McLeodganj, Dalai Lama Temple & Bhagsu Waterfall', desc: 'Ascend to McLeodganj (Little Lhasa). Visit the Tsuglagkhang Complex (Dalai Lama’s residence), spin prayer wheels, hike to Bhagsu Waterfall, and enjoy Tibetan momos & thukpa.', tags: ['🙏 Dalai Lama Temple', '🌊 Bhagsu Falls', '🥟 Tibetan Cuisine'] },
      { num: 3, alt: '2,828m', title: 'The Legendary Triund Ridge Day Trek', desc: 'Trek through rhododendron and oak forests up to Triund Ridge at 2,828m. The sheer granite wall of the Dhauladhar range towers right in front of you. Evening sunset over Kangra valley.', tags: ['⛰️ Triund Ridge Trek', '🌺 Rhododendron Trail', '🌅 Dhauladhar Sunset'] },
      { num: 4, alt: '2,082m', title: 'St. John in the Wilderness & Departure', desc: 'Visit the hauntingly beautiful neo-Gothic St. John in the Wilderness Church nestled amid tall cedar deodars. Souvenir shopping at Tibetan market before departure.', tags: ['⛪ Forest Church', '🛍️ Prayer Flags & Singing Bowls', '✈️ Farewell'] },
    ]
  }
};

function initItineraryTabs() {
  const tabs = document.querySelectorAll('.itin-nav-tab');
  const durEl = document.getElementById('itinDuration');
  const altEl = document.getElementById('itinAltitude');
  const lvlEl = document.getElementById('itinLevel');
  const seaEl = document.getElementById('itinSeason');
  const timeline = document.getElementById('itineraryTimeline');

  function renderItinerary(key) {
    const data = ITINERARIES_DATA[key];
    if (!data) return;

    if (durEl) durEl.textContent = data.duration;
    if (altEl) altEl.textContent = data.altitude;
    if (lvlEl) lvlEl.textContent = data.level;
    if (seaEl) seaEl.textContent = data.season;

    if (timeline) {
      timeline.innerHTML = data.days.map((d, i) => `
        <div class="timeline-item" role="listitem">
          <div class="timeline-marker">${d.num}</div>
          <div class="timeline-content">
            <div class="timeline-day">Day ${d.num} · ${d.alt}</div>
            <h4>${d.title}</h4>
            <p>${d.desc}</p>
            <div class="timeline-tags">
              ${d.tags.map(t => `<span>${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderItinerary(tab.dataset.itin);
    });
  });
}

/* ── Smart Mountain Packing Checklist ───────────────────────────── */
const PACKING_BASE_DATA = {
  layers: {
    title: '🧥 Thermal & Mountain Layers',
    winter: [
      { id: 'w_down', text: 'Heavy down jacket (rated for -10°C / sub-zero)', defaultChecked: true },
      { id: 'w_thermal', text: 'Merino wool or synthetic thermal innerwear sets (2-3 pairs)', defaultChecked: true },
      { id: 'w_fleece', text: 'Warm fleece jacket or heavy pullover sweater', defaultChecked: true },
      { id: 'w_gloves', text: 'Waterproof insulated ski gloves + light inner liners', defaultChecked: true },
      { id: 'w_balaclava', text: 'Woolen beanie cap & windproof neck gaiter / balaclava', defaultChecked: true },
    ],
    summer: [
      { id: 's_wind', text: 'Windproof light softshell jacket for evening chills', defaultChecked: true },
      { id: 's_fleece', text: 'Light fleece pullover or cardigan', defaultChecked: true },
      { id: 's_cotton', text: 'Breathable dry-fit t-shirts & quick-dry trekking pants', defaultChecked: true },
      { id: 's_sunhat', text: 'Wide-brim UV sun protection hat / cap', defaultChecked: true },
    ],
    monsoon: [
      { id: 'm_raincoat', text: 'Waterproof Gore-Tex rain jacket or heavy-duty poncho', defaultChecked: true },
      { id: 'm_pants', text: 'Quick-drying synthetic trekking trousers (avoid denim)', defaultChecked: true },
      { id: 'm_cover', text: 'Waterproof backpack rain cover (essential)', defaultChecked: true },
    ]
  },
  footwear: {
    title: '🥾 Footwear & Trail Gear',
    winter: [
      { id: 'w_boots', text: 'Waterproof hiking boots with deep rubber lugs', defaultChecked: true },
      { id: 'w_socks', text: 'Thick merino woolen socks (3-4 pairs)', defaultChecked: true },
      { id: 'w_gaiters', text: 'Snow gaiters & microspikes / crampons for icy trails', defaultChecked: false },
    ],
    summer: [
      { id: 's_boots', text: 'Broken-in trekking shoes with good ankle support', defaultChecked: true },
      { id: 's_socks', text: 'Cushioned moisture-wicking athletic socks', defaultChecked: true },
      { id: 's_camp', text: 'Comfortable slip-on camp shoes / sandals', defaultChecked: true },
    ],
    monsoon: [
      { id: 'm_boots', text: 'Waterproof boots with anti-slip Vibram soles', defaultChecked: true },
      { id: 'm_socks', text: 'Extra pairs of dry socks sealed in ziploc bags', defaultChecked: true },
      { id: 'm_leech', text: 'Anti-leech socks / salt pouches for forest trails', defaultChecked: false },
    ]
  },
  medical: {
    title: '💊 High-Altitude & Medical Kit',
    common: [
      { id: 'med_ams', text: 'Diamox (Acetazolamide) — consultation for AMS prevention', defaultChecked: true },
      { id: 'med_pain', text: 'Pain relievers (Paracetamol / Ibuprofen) for altitude headache', defaultChecked: true },
      { id: 'med_ors', text: 'Electrolyte ORS sachets (staying hydrated is vital)', defaultChecked: true },
      { id: 'med_sun', text: 'High SPF 50+ Sunscreen & UV-blocking lip balm', defaultChecked: true },
      { id: 'med_first', text: 'Band-aids, antiseptic cream, crepe bandage & blister pads', defaultChecked: true },
      { id: 'med_motion', text: 'Motion sickness pills (Avomine) for winding mountain roads', defaultChecked: true },
    ]
  },
  documents: {
    title: '📄 Permits, Cash & Documents',
    common: [
      { id: 'doc_id', text: 'Original Government Photo ID (Aadhaar / Passport)', defaultChecked: true },
      { id: 'doc_permit', text: 'Rohtang Pass e-permit or Spiti Inner Line permit printout', defaultChecked: true },
      { id: 'doc_cash', text: 'Sufficient physical Cash (ATMs often offline in Spiti/Kasol)', defaultChecked: true },
      { id: 'doc_copies', text: 'Photocopies of passport & emergency contact card', defaultChecked: true },
    ]
  },
  electronics: {
    title: '📸 Electronics & Cold Protection',
    common: [
      { id: 'el_pbank', text: '20,000mAh Power bank (cold temps discharge batteries fast)', defaultChecked: true },
      { id: 'el_torch', text: 'LED Headlamp / flashlight with extra AAA batteries', defaultChecked: true },
      { id: 'el_sim', text: 'Jio or BSNL prepaid SIM (best coverage in remote HP)', defaultChecked: true },
      { id: 'el_thermos', text: 'Insulated vacuum flask for hot water on trails', defaultChecked: true },
    ]
  }
};

function initPackingChecklist() {
  const seasonSelect = document.getElementById('packingSeasonSelect');
  const styleSelect = document.getElementById('packingStyleSelect');
  const resetBtn = document.getElementById('packingResetBtn');
  const printBtn = document.getElementById('packingPrintBtn');
  const progressCount = document.getElementById('packingProgressCount');
  const progressFill = document.getElementById('packingProgressFill');
  const grid = document.getElementById('packingGrid');
  const customForm = document.getElementById('packingCustomForm');
  const customInput = document.getElementById('packingCustomInput');

  let state = {};
  try {
    state = JSON.parse(localStorage.getItem('hp_packing_state') || '{}');
  } catch { state = {}; }

  let customItems = [];
  try {
    customItems = JSON.parse(localStorage.getItem('hp_packing_custom') || '[]');
  } catch { customItems = []; }

  function getActiveItems() {
    const season = seasonSelect ? seasonSelect.value : 'winter';
    const categories = [];

    // Layers
    const layerItems = (PACKING_BASE_DATA.layers[season] || PACKING_BASE_DATA.layers.winter);
    categories.push({ title: PACKING_BASE_DATA.layers.title, items: layerItems });

    // Footwear
    const footItems = (PACKING_BASE_DATA.footwear[season] || PACKING_BASE_DATA.footwear.winter);
    categories.push({ title: PACKING_BASE_DATA.footwear.title, items: footItems });

    // Medical
    categories.push({ title: PACKING_BASE_DATA.medical.title, items: PACKING_BASE_DATA.medical.common });

    // Documents
    categories.push({ title: PACKING_BASE_DATA.documents.title, items: PACKING_BASE_DATA.documents.common });

    // Electronics & Gear
    const electroItems = [...PACKING_BASE_DATA.electronics.common];
    if (customItems.length) {
      customItems.forEach(ci => electroItems.push(ci));
    }
    categories.push({ title: PACKING_BASE_DATA.electronics.title, items: electroItems });

    return categories;
  }

  function updateProgress() {
    const checkboxes = grid ? grid.querySelectorAll('input[type="checkbox"]') : [];
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    const total = checkboxes.length;
    const pct = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

    if (progressCount) progressCount.textContent = `${checkedCount} / ${total} Packed (${pct}%)`;
    if (progressFill) progressFill.style.width = `${pct}%`;
  }

  function renderGrid() {
    if (!grid) return;
    const categories = getActiveItems();

    grid.innerHTML = categories.map(cat => `
      <div class="packing-category-card">
        <div class="packing-category-header">${cat.title}</div>
        <div class="packing-items-list">
          ${cat.items.map(item => {
            const isChecked = state[item.id] !== undefined ? state[item.id] : item.defaultChecked;
            return `
              <label class="packing-item-row ${isChecked ? 'packed' : ''}">
                <input type="checkbox" id="chk_${item.id}" data-item-id="${item.id}" ${isChecked ? 'checked' : ''} />
                <span>${item.text}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Attach checkbox events
    grid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.itemId;
        state[id] = e.target.checked;
        localStorage.setItem('hp_packing_state', JSON.stringify(state));
        e.target.closest('.packing-item-row')?.classList.toggle('packed', e.target.checked);
        updateProgress();
      });
    });

    updateProgress();
  }

  if (seasonSelect) seasonSelect.addEventListener('change', renderGrid);
  if (styleSelect) styleSelect.addEventListener('change', renderGrid);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = {};
      customItems = [];
      localStorage.removeItem('hp_packing_state');
      localStorage.removeItem('hp_packing_custom');
      renderGrid();
      if (window.showToast) window.showToast('🔄', 'Checklist Reset', 'Restored all items to default mountain checklist.');
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (customForm && customInput) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = customInput.value.trim();
      if (!val) return;

      const newItem = { id: `custom_${Date.now()}`, text: val, defaultChecked: false };
      customItems.push(newItem);
      localStorage.setItem('hp_packing_custom', JSON.stringify(customItems));
      customInput.value = '';
      renderGrid();
      if (window.showToast) window.showToast('➕', 'Gear Added', `Added "${val}" to your packing checklist.`);
    });
  }

  renderGrid();
}

/* ── Traveller Reviews & Submission Modal ───────────────────────── */
function initReviewModal() {
  const modal = document.getElementById('reviewModal');
  const openBtn = document.getElementById('openReviewModalBtn');
  const closeBtn = document.getElementById('reviewModalClose');
  const backdrop = document.getElementById('reviewModalBackdrop');
  const form = document.getElementById('submitReviewForm');
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('reviewRatingInput');

  function open() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) close();
  });

  // Star selector
  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.rating || '5');
      if (ratingInput) ratingInput.value = val;
      starButtons.forEach((b, i) => {
        b.classList.toggle('active', i < val);
      });
    });
  });

  // Submit review
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reviewAuthorName')?.value.trim();
      const city = document.getElementById('reviewCity')?.value.trim();
      const dest = document.getElementById('reviewDestSelect')?.value;
      const pkg = document.getElementById('reviewPkgSelect')?.value;
      const text = document.getElementById('reviewText')?.value.trim();
      const rating = parseInt(ratingInput?.value || '5');

      if (!name || !city || !text) return;

      const newReview = { name, city, dest, pkg, text, rating, date: 'Just now' };

      // Save in localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('hp_custom_reviews') || '[]');
        stored.unshift(newReview);
        localStorage.setItem('hp_custom_reviews', JSON.stringify(stored));
      } catch {}

      // Prepend to testimonial track
      const track = document.querySelector('.testimonials-track');
      if (track) {
        const card = document.createElement('article');
        card.className = 'testi-card';
        card.innerHTML = `
          <div class="testi-stars">${'★'.repeat(rating)}</div>
          <p class="testi-text">"${text}"</p>
          <div class="testi-author">
            <div class="testi-avatar" style="background:var(--grad-gold);color:#1a1a1a;">${name.charAt(0).toUpperCase()}</div>
            <div>
              <div class="testi-name">${name} <span style="font-size:0.7rem;color:var(--color-accent);font-weight:600;">✨ Verified Guest</span></div>
              <div class="testi-location">📍 ${city} • ${dest} (${pkg})</div>
            </div>
          </div>
        `;
        track.insertBefore(card, track.firstChild);
      }

      form.reset();
      close();
      if (window.showToast) {
        window.showToast('🎉', 'Review Published!', 'Thank you! Your mountain story has been shared with fellow travellers.');
      }
    });
  }

  // Load custom reviews on startup
  try {
    const saved = JSON.parse(localStorage.getItem('hp_custom_reviews') || '[]');
    const track = document.querySelector('.testimonials-track');
    if (track && saved.length) {
      saved.forEach(rev => {
        const card = document.createElement('article');
        card.className = 'testi-card';
        card.innerHTML = `
          <div class="testi-stars">${'★'.repeat(rev.rating || 5)}</div>
          <p class="testi-text">"${rev.text}"</p>
          <div class="testi-author">
            <div class="testi-avatar" style="background:var(--grad-gold);color:#1a1a1a;">${rev.name.charAt(0).toUpperCase()}</div>
            <div>
              <div class="testi-name">${rev.name} <span style="font-size:0.7rem;color:var(--color-accent);font-weight:600;">✨ Verified Guest</span></div>
              <div class="testi-location">📍 ${rev.city} • ${rev.dest}</div>
            </div>
          </div>
        `;
        track.insertBefore(card, track.firstChild);
      });
    }
  } catch {}
}

/* ── Mountain Safety & Emergency Hub Modal ───────────────────────── */
function initSafetyHub() {
  const modal = document.getElementById('safetyModal');
  const trigger = document.getElementById('safetyModalTrigger');
  const mobTrigger = document.getElementById('mobSafetyBtn');
  const closeBtn = document.getElementById('safetyModalClose');
  const backdrop = document.getElementById('safetyModalBackdrop');
  const amsBoxes = document.querySelectorAll('#amsQuestions input[type="checkbox"]');
  const resultBox = document.getElementById('amsResultBox');
  const resultText = document.getElementById('amsResultText');

  function open() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  trigger?.addEventListener('click', open);
  mobTrigger?.addEventListener('click', () => {
    const mobMenu = document.getElementById('mobileMenu');
    if (mobMenu) mobMenu.classList.remove('open');
    open();
  });
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) close();
  });

  // AMS Questionnaire logic
  function checkAMS() {
    let checked = 0;
    amsBoxes.forEach(cb => { if (cb.checked) checked++; });

    const dot = resultBox?.querySelector('.ams-status-dot');

    if (checked === 0) {
      if (dot) dot.className = 'ams-status-dot status-ok';
      if (resultText) resultText.textContent = 'No significant symptoms detected. Maintain good hydration (3-4L warm water daily) and avoid alcohol at altitude.';
    } else if (checked <= 2) {
      if (dot) dot.className = 'ams-status-dot status-warn';
      if (resultText) resultText.textContent = '⚠️ Mild Acute Mountain Sickness (AMS) possible. Rest at current altitude, drink electrolyte fluids, and DO NOT ascend higher until symptoms clear.';
    } else {
      if (dot) dot.className = 'ams-status-dot status-alert';
      if (resultText) resultText.textContent = '🚨 HIGH RISK WARNING: Serious altitude sickness risk. Alert your guide/medical personnel immediately and begin descending at least 500m to lower altitude.';
    }
  }

  amsBoxes.forEach(cb => cb.addEventListener('change', checkAMS));
}

/* ── Himalayan Soundscapes (Web Audio API Synthesizer) ──────────── */
function initSoundscapes() {
  const toggleBtn = document.getElementById('soundscapeBtn');
  const panel = document.getElementById('soundscapePanel');
  const closeBtn = document.getElementById('soundscapeClose');
  const playToggle = document.getElementById('soundPlayToggle');
  const playIcon = document.getElementById('soundPlayIcon');
  const statusEl = document.getElementById('soundscapeStatus');
  const volRange = document.getElementById('soundVolumeRange');
  const presetButtons = document.querySelectorAll('.sound-preset-btn');

  let audioCtx = null;
  let masterGain = null;
  let activeNodes = [];
  let isPlaying = false;
  let currentPreset = 'wind';
  let chimeInterval = null;

  function initAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(parseFloat(volRange?.value || '0.5'), audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function stopAllSounds() {
    activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {}
    });
    activeNodes = [];
    if (chimeInterval) {
      clearInterval(chimeInterval);
      chimeInterval = null;
    }
  }

  // Generate pink noise buffer
  function createPinkNoiseBuffer(ctx, seconds = 5) {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // Tibetan Singing Bowl chime generator
  function playTibetanChime() {
    if (!audioCtx || !isPlaying) return;
    const now = audioCtx.currentTime;
    const freqs = [528, 1056, 1584];

    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      const amp = (0.04 / (i + 1));
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 6);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 6.5);
    });
  }

  function startSound(preset) {
    initAudioCtx();
    stopAllSounds();

    if (preset === 'wind') {
      // Wind breeze + periodic Tibetan bowl
      const noise = audioCtx.createBufferSource();
      noise.buffer = createPinkNoiseBuffer(audioCtx, 6);
      noise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

      // Low frequency oscillator for wind gust swell
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.2, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(180, audioCtx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(masterGain);

      noise.start();
      lfo.start();
      activeNodes.push(noise, lfo, filter, lfoGain);

      playTibetanChime();
      chimeInterval = setInterval(playTibetanChime, 9000);

    } else if (preset === 'river') {
      // Parvati river rapids: multi-filtered bubbling water
      const noise = audioCtx.createBufferSource();
      noise.buffer = createPinkNoiseBuffer(audioCtx, 6);
      noise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, audioCtx.currentTime);

      const filter2 = audioCtx.createBiquadFilter();
      filter2.type = 'peaking';
      filter2.frequency.setValueAtTime(1200, audioCtx.currentTime);
      filter2.gain.setValueAtTime(6, audioCtx.currentTime);

      noise.connect(filter);
      filter.connect(filter2);
      filter2.connect(masterGain);

      noise.start();
      activeNodes.push(noise, filter, filter2);

    } else if (preset === 'forest') {
      // Pine forest breeze + sweet birdsong
      const noise = audioCtx.createBufferSource();
      noise.buffer = createPinkNoiseBuffer(audioCtx, 6);
      noise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.0, audioCtx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      activeNodes.push(noise, filter);

      // Periodic birdsong
      const chirp = () => {
        if (!isPlaying || !audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2800 + Math.random() * 800, now);
        osc.frequency.exponentialRampToValueAtTime(3800 + Math.random() * 600, now + 0.12);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.025, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.2);
      };
      chimeInterval = setInterval(() => {
        chirp();
        setTimeout(chirp, 180);
      }, 5000);

    } else if (preset === 'fire') {
      // Warm campfire rumble + crackles
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75, audioCtx.currentTime);
      oscGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      activeNodes.push(osc, oscGain);

      // Random crackle pops
      chimeInterval = setInterval(() => {
        if (!isPlaying || !audioCtx) return;
        if (Math.random() > 0.4) {
          const now = audioCtx.currentTime;
          const pop = audioCtx.createBufferSource();
          const popBuf = audioCtx.createBuffer(1, 200, audioCtx.sampleRate);
          const popData = popBuf.getChannelData(0);
          for (let i = 0; i < 200; i++) popData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
          pop.buffer = popBuf;

          const popGain = audioCtx.createGain();
          popGain.gain.setValueAtTime(0.08, now);

          pop.connect(popGain);
          popGain.connect(masterGain);
          pop.start(now);
        }
      }, 300);
    }
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    if (toggleBtn) toggleBtn.classList.toggle('playing', isPlaying);
    if (playIcon) playIcon.textContent = isPlaying ? '⏸' : '▶';
    if (statusEl) {
      const names = { wind: 'Ridge Wind & Bowls', river: 'Parvati Rapids', forest: 'Pine Forest & Birds', fire: 'Campfire & Night Sky' };
      statusEl.textContent = isPlaying ? `Playing: ${names[currentPreset]}` : 'Paused';
    }
    if (isPlaying) {
      startSound(currentPreset);
    } else {
      stopAllSounds();
    }
  }

  toggleBtn?.addEventListener('click', () => {
    panel?.classList.toggle('open');
    if (!isPlaying) setPlayingState(true);
  });

  closeBtn?.addEventListener('click', () => {
    panel?.classList.remove('open');
  });

  playToggle?.addEventListener('click', () => {
    setPlayingState(!isPlaying);
  });

  volRange?.addEventListener('input', (e) => {
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
    }
  });

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreset = btn.dataset.sound || 'wind';
      if (isPlaying) {
        startSound(currentPreset);
        if (statusEl) {
          const names = { wind: 'Ridge Wind & Bowls', river: 'Parvati Rapids', forest: 'Pine Forest & Birds', fire: 'Campfire & Night Sky' };
          statusEl.textContent = `Playing: ${names[currentPreset]}`;
        }
      }
    });
  });
}

/* ── Init All Features ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initLiveViewers();
  initBackToTop();
  initCalculator();
  initEnhancedGallery();
  initChatWidget();
  initCookieConsent();
  initFAQ();
  initDestModal();
  initAmbientParticles();
  initWeatherCards();
  initBlogCards();

  // Premium interactive enhancements
  initCurrencyConverter();
  initDestinationFilter();
  initWeatherUnitAndForecast();
  initCircuitVisualizer();
  initItineraryTabs();
  initPackingChecklist();
  initReviewModal();
  initSafetyHub();
  initSoundscapes();
});

