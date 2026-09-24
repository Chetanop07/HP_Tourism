/* ─── Booking Logic ─────────────────────────────────────────────── */

const STORAGE_KEY = 'hp_bookings';

const destinations = [
  { id: 'shimla',       label: 'Shimla',       emoji: '🏛️', tag: 'Queen of Hills' },
  { id: 'manali',       label: 'Manali',       emoji: '🏔️', tag: 'Valley of Gods' },
  { id: 'spiti',        label: 'Spiti Valley', emoji: '🏯', tag: 'Little Tibet' },
  { id: 'dharamshala',  label: 'Dharamshala',  emoji: '🙏', tag: 'Abode of Gods' },
  { id: 'kasol',        label: 'Kasol',        emoji: '🌿', tag: 'Mini Israel' },
  { id: 'dalhousie',    label: 'Dalhousie',    emoji: '🌸', tag: 'Scotland of India' },
];

const packages = [
  { id: 'explorer',   label: 'Explorer',    duration: '3N/4D', price: 15999 },
  { id: 'adventure',  label: 'Adventure',   duration: '5N/6D', price: 24999 },
  { id: 'luxury',     label: 'Luxury',      duration: '7N/8D', price: 39999 },
  { id: 'honeymoon',  label: 'Honeymoon',   duration: '5N/6D', price: 29999 },
];

let currentStep = 1;
const totalSteps = 4;
let formData = {};

function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'HP-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function initBookingForm() {
  updateStepUI();
  bindFormNavigation();
}

function bindFormNavigation() {
  document.querySelectorAll('.btn-form-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        collectStepData(currentStep);
        if (currentStep < totalSteps) {
          currentStep++;
          updateStepUI();
          if (currentStep === totalSteps) populateSummary();
        }
      }
    });
  });

  document.querySelectorAll('.btn-form-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) { currentStep--; updateStepUI(); }
    });
  });

  const submitBtn = document.getElementById('submitBooking');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }
}

function validateStep(step) {
  const panel = document.getElementById(`step-panel-${step}`);
  if (!panel) return true;

  if (step === 1) {
    const dest = panel.querySelector('input[name="destination"]:checked');
    if (!dest) { showFieldError('Please select a destination'); return false; }
    const checkIn  = panel.querySelector('#checkIn');
    const checkOut = panel.querySelector('#checkOut');
    if (!checkIn?.value)  { highlightField(checkIn,  'Check-in date required'); return false; }
    if (!checkOut?.value) { highlightField(checkOut, 'Check-out date required'); return false; }
    if (new Date(checkOut.value) <= new Date(checkIn.value)) {
      showFieldError('Check-out must be after check-in'); return false;
    }
  }

  if (step === 2) {
    const required = panel.querySelectorAll('[required]');
    for (const field of required) {
      if (!field.value.trim()) { highlightField(field, `${field.placeholder || 'This field'} is required`); return false; }
    }
    const email = panel.querySelector('#email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      highlightField(email, 'Invalid email address'); return false;
    }
    const phone = panel.querySelector('#phone');
    if (phone && !/^[6-9]\d{9}$/.test(phone.value.replace(/\s/g, ''))) {
      highlightField(phone, 'Invalid Indian phone number'); return false;
    }
  }

  if (step === 3) {
    const pkg = panel.querySelector('select[name="package"]');
    if (pkg && !pkg.value) { showFieldError('Please select a package'); return false; }
  }

  return true;
}

function highlightField(field, msg) {
  if (!field) return;
  field.style.borderColor = '#ef4444';
  field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
  showFieldError(msg);
  field.addEventListener('input', () => {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    clearFieldError();
  }, { once: true });
  field.focus();
}

function showFieldError(msg) {
  let el = document.getElementById('form-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'form-error';
    el.style.cssText = 'background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;padding:0.6rem 1rem;border-radius:10px;font-size:0.82rem;margin-bottom:0.75rem;animation:fadeUp 0.3s ease;';
    document.querySelector('.booking-form-wrap')?.prepend(el);
  }
  el.textContent = '⚠️ ' + msg;
  el.style.display = 'block';
  setTimeout(() => clearFieldError(), 4000);
}

function clearFieldError() {
  const el = document.getElementById('form-error');
  if (el) el.style.display = 'none';
}

function collectStepData(step) {
  const panel = document.getElementById(`step-panel-${step}`);
  if (!panel) return;

  if (step === 1) {
    const dest = panel.querySelector('input[name="destination"]:checked');
    formData.destination     = dest?.value || '';
    formData.destinationLabel = destinations.find(d => d.id === formData.destination)?.label || '';
    formData.checkIn         = panel.querySelector('#checkIn')?.value || '';
    formData.checkOut        = panel.querySelector('#checkOut')?.value || '';
    formData.guests          = panel.querySelector('#guests')?.value || '2';
  }

  if (step === 2) {
    formData.name    = panel.querySelector('#fullName')?.value || '';
    formData.email   = panel.querySelector('#email')?.value || '';
    formData.phone   = panel.querySelector('#phone')?.value || '';
    formData.state   = panel.querySelector('#state')?.value || '';
    formData.city    = panel.querySelector('#city')?.value || '';
  }

  if (step === 3) {
    const pkgId = panel.querySelector('select[name="package"]')?.value || '';
    const pkg   = packages.find(p => p.id === pkgId);
    formData.package      = pkgId;
    formData.packageLabel = pkg?.label || '';
    formData.packagePrice = pkg?.price || 0;
    formData.requests     = panel.querySelector('#specialReqs')?.value || '';
    formData.roomType     = panel.querySelector('select[name="roomType"]')?.value || 'Standard';
  }
}

function populateSummary() {
  const summary = document.getElementById('booking-summary');
  if (!summary) return;

  const nights = formData.checkIn && formData.checkOut
    ? Math.max(1, Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = formData.packagePrice * parseInt(formData.guests || 1);
  const taxes = Math.round(total * 0.12);

  summary.innerHTML = `
    <div style="background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:14px;padding:1.5rem;margin-bottom:1.2rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;font-size:0.85rem;">
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Destination</span><strong>${formData.destinationLabel}</strong></div>
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Package</span><strong>${formData.packageLabel}</strong></div>
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Check-In</span><strong>${formData.checkIn}</strong></div>
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Check-Out</span><strong>${formData.checkOut}</strong></div>
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Guests</span><strong>${formData.guests} Person(s)</strong></div>
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Nights</span><strong>${nights} Night(s)</strong></div>
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Traveller</span><strong>${formData.name}</strong></div>
        <div><span style="color:var(--color-text-muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.2rem;">Room Type</span><strong>${formData.roomType}</strong></div>
      </div>
    </div>
    <div style="border-top:1px dashed var(--color-border);padding-top:1rem;">
      <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:0.85rem;color:var(--color-text-muted);">
        <span>Package Price × ${formData.guests} guest(s)</span>
        <span>₹${total.toLocaleString('en-IN')}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:0.85rem;color:var(--color-text-muted);">
        <span>GST (12%)</span>
        <span>₹${taxes.toLocaleString('en-IN')}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:0.8rem;padding-top:0.8rem;border-top:1px solid var(--color-border);font-size:1.1rem;font-weight:700;">
        <span>Total Amount</span>
        <span style="color:var(--color-accent);">₹${(total + taxes).toLocaleString('en-IN')}</span>
      </div>
    </div>
  `;
}

function handleSubmit() {
  collectStepData(3);

  const nights = formData.checkIn && formData.checkOut
    ? Math.max(1, Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)))
    : 1;
  const total = formData.packagePrice * parseInt(formData.guests || 1);
  const taxes = Math.round(total * 0.12);

  const booking = {
    id:           generateBookingId(),
    ...formData,
    nights,
    total:        total + taxes,
    status:       'pending',
    createdAt:    new Date().toISOString(),
  };

  saveBooking(booking);

  // Trigger notification
  if (window.sendBookingNotification) {
    window.sendBookingNotification(booking);
  }

  // Show success UI
  showSuccess(booking.id);
}

function showSuccess(bookingId) {
  const wrap = document.querySelector('.booking-form-wrap');
  const success = document.getElementById('booking-success');
  const form    = document.getElementById('booking-form-inner');

  if (form)    form.style.display = 'none';
  if (success) {
    success.classList.add('show');
    const idEl = document.getElementById('success-booking-id');
    if (idEl) idEl.textContent = bookingId;
  }

  // Reset for next booking
  setTimeout(() => {
    currentStep = 1;
    formData = {};
  }, 500);
}

function updateStepUI() {
  // Update panels
  document.querySelectorAll('.form-panel').forEach((panel, i) => {
    panel.classList.toggle('active', i + 1 === currentStep);
  });

  // Update step indicators
  document.querySelectorAll('.form-step').forEach((step, i) => {
    const num = i + 1;
    step.classList.remove('active', 'done');
    if (num === currentStep) step.classList.add('active');
    else if (num < currentStep) step.classList.add('done');
  });

  // Update step lines
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('done', i + 1 < currentStep);
  });
}

// Set min date for check-in/out inputs
function initDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  const checkIn  = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');

  if (checkIn) {
    checkIn.min = today;
    checkIn.addEventListener('change', () => {
      if (checkOut) {
        const next = new Date(checkIn.value);
        next.setDate(next.getDate() + 1);
        checkOut.min = next.toISOString().split('T')[0];
        if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = '';
      }
    });
  }
  if (checkOut) checkOut.min = today;
}

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initDateInputs();
});
