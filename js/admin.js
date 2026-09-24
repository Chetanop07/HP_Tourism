/* ─── Admin Panel JS ────────────────────────────────────────────── */

const STORAGE_KEY = 'hp_bookings';
const ADMIN_PASS = 'admin@2004';  // Change this password
const AUTH_KEY = 'hp_admin_auth';
const NTFY_KEY = 'hp_ntfy_config';

/* ── Auth ────────────────────────────────────────────────────────── */
function isAuthed() { return sessionStorage.getItem(AUTH_KEY) === 'true'; }
function setAuth() { sessionStorage.setItem(AUTH_KEY, 'true'); }
function clearAuth() { sessionStorage.removeItem(AUTH_KEY); }

function showLoginPage() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
}

function initAuth() {
  if (isAuthed()) { showDashboard(); initDashboard(); return; }
  showLoginPage();

  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const pass = document.getElementById('adminPassword').value;
    if (pass === ADMIN_PASS) {
      setAuth();
      showDashboard();
      initDashboard();
    } else {
      const err = document.getElementById('loginError');
      err.classList.add('show');
      err.textContent = '❌ Incorrect password. Please try again.';
      setTimeout(() => err.classList.remove('show'), 3500);
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuth();
    showLoginPage();
  });
}

/* ── Bookings Data ───────────────────────────────────────────────── */
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveBookings(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function updateBookingStatus(id, status) {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx !== -1) { bookings[idx].status = status; saveBookings(bookings); }
}

function deleteBooking(id) {
  const bookings = getBookings().filter(b => b.id !== id);
  saveBookings(bookings);
}

/* ── Dashboard Render ────────────────────────────────────────────── */
function initDashboard() {
  renderStats();
  renderTable(getBookings());
  renderChart();
  renderActivity();
  initTableFilters();
  initNotifPanel();
  updateNavBadge();

  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuth();
    location.reload();
  });

  // Poll for new bookings every 10s (for demo)
  setInterval(() => {
    renderStats();
    renderTable(getFilteredBookings());
    renderActivity();
    updateNavBadge();
  }, 10000);
}

function renderStats() {
  const bookings = getBookings();
  const pending = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const revenue = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.total || 0), 0);

  setEl('statTotal', bookings.length);
  setEl('statPending', pending);
  setEl('statConfirmed', confirmed);
  setEl('statRevenue', '₹' + (revenue / 1000).toFixed(1) + 'K');
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── Table Rendering ─────────────────────────────────────────────── */
let currentFilter = 'all';
let currentSearch = '';

function getFilteredBookings() {
  return getBookings().filter(b => {
    const matchStatus = currentFilter === 'all' || b.status === currentFilter;
    const matchSearch = !currentSearch || [b.id, b.name, b.email, b.destinationLabel, b.phone]
      .some(v => String(v || '').toLowerCase().includes(currentSearch));
    return matchStatus && matchSearch;
  });
}

function renderTable(bookings) {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  if (!bookings.length) {
    tbody.innerHTML = `
      <tr><td colspan="8">
        <div class="table-empty">
          <div class="empty-icon">📋</div>
          <p>No bookings found</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => `
    <tr onclick="viewBooking('${b.id}')" title="Click to view details">
      <td><span class="booking-id">${b.id}</span></td>
      <td>
        <div class="booking-name">${escHtml(b.name || '—')}</div>
        <div class="booking-email">${escHtml(b.email || '')}</div>
      </td>
      <td><span class="dest-pill">🏔️ ${escHtml(b.destinationLabel || b.destination || '—')}</span></td>
      <td>${escHtml(b.checkIn || '—')}</td>
      <td>${escHtml(b.checkOut || '—')}</td>
      <td>${b.guests || '—'}</td>
      <td><span class="status-badge status-${b.status || 'pending'}">${b.status || 'pending'}</span></td>
      <td>
        <div class="action-btns" onclick="event.stopPropagation()">
          <button class="btn-view"    onclick="viewBooking('${b.id}')">View</button>
          <button class="btn-confirm" onclick="confirmBooking('${b.id}')">✓</button>
          <button class="btn-delete"  onclick="removeBooking('${b.id}')">✕</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function initTableFilters() {
  const filterSel = document.getElementById('statusFilter');
  const searchEl = document.getElementById('adminSearch');

  filterSel?.addEventListener('change', e => {
    currentFilter = e.target.value;
    renderTable(getFilteredBookings());
  });

  searchEl?.addEventListener('input', e => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderTable(getFilteredBookings());
  });

  document.getElementById('exportBtn')?.addEventListener('click', exportCSV);
}

function updateNavBadge() {
  const pending = getBookings().filter(b => b.status === 'pending').length;
  const badge = document.getElementById('pendingBadge');
  if (badge) { badge.textContent = pending; badge.style.display = pending ? 'inline' : 'none'; }
}

/* ── View Booking Modal ──────────────────────────────────────────── */
function viewBooking(id) {
  const booking = getBookings().find(b => b.id === id);
  if (!booking) return;

  const modal = document.getElementById('bookingModal');
  const backdrop = document.getElementById('modalBackdrop');

  document.getElementById('modalBookingId').textContent = booking.id;
  document.getElementById('modalTitle').textContent = `${booking.destinationLabel || booking.destination} Booking`;

  // Fill modal fields
  const fields = {
    mfName: booking.name,
    mfEmail: booking.email,
    mfPhone: booking.phone,
    mfState: booking.state,
    mfCity: booking.city,
    mfDest: booking.destinationLabel || booking.destination,
    mfPackage: booking.packageLabel || booking.package,
    mfCheckIn: booking.checkIn,
    mfCheckOut: booking.checkOut,
    mfGuests: booking.guests,
    mfNights: booking.nights,
    mfRoomType: booking.roomType,
    mfStatus: booking.status,
    mfTotal: booking.total ? '₹' + parseInt(booking.total).toLocaleString('en-IN') : '—',
    mfCreatedAt: booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-IN') : '—',
    mfRequests: booking.requests || 'None',
  };

  Object.entries(fields).forEach(([key, val]) => {
    const el = document.getElementById(key);
    if (el) el.textContent = val || '—';
  });

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Action buttons
  document.getElementById('modalConfirmBtn').onclick = () => {
    confirmBooking(id);
    updateBookingStatus(id, 'confirmed');
    const statusEl = document.getElementById('mfStatus');
    if (statusEl) statusEl.textContent = 'confirmed';
  };

  document.getElementById('modalCancelBtn').onclick = () => {
    updateBookingStatus(id, 'cancelled');
    const statusEl = document.getElementById('mfStatus');
    if (statusEl) statusEl.textContent = 'cancelled';
    renderStats();
    renderTable(getFilteredBookings());
  };

  document.getElementById('modalPrintBtn').onclick = () => window.print();
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('active');
  document.body.style.overflow = '';
}

window.viewBooking = viewBooking;

window.confirmBooking = function (id) {
  updateBookingStatus(id, 'confirmed');
  renderStats();
  renderTable(getFilteredBookings());
  renderActivity();
  showAdminToast('success', '✓ Booking confirmed!');
};

window.removeBooking = function (id) {
  if (!confirm('Delete this booking permanently?')) return;
  deleteBooking(id);
  renderStats();
  renderTable(getFilteredBookings());
  renderActivity();
  showAdminToast('error', '🗑️ Booking deleted');
};

/* ── Chart ───────────────────────────────────────────────────────── */
function renderChart() {
  const bookings = getBookings();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = Array(12).fill(0);

  bookings.forEach(b => {
    if (b.createdAt) {
      const m = new Date(b.createdAt).getMonth();
      counts[m]++;
    }
  });

  const max = Math.max(...counts, 1);
  const chart = document.getElementById('bookingsChart');
  if (!chart) return;

  const last6months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6months.push({ label: months[d.getMonth()], count: counts[d.getMonth()] });
  }

  const maxCount = Math.max(...last6months.map(m => m.count), 1);

  chart.innerHTML = last6months.map(m => `
    <div class="bar-item">
      <div class="bar" style="height:${Math.max(4, (m.count / maxCount) * 100)}px" title="${m.count} bookings"></div>
      <span class="bar-label">${m.label}</span>
    </div>
  `).join('');
}

/* ── Activity Feed ───────────────────────────────────────────────── */
function renderActivity() {
  const bookings = getBookings().slice(0, 8);
  const feed = document.getElementById('activityFeed');
  if (!feed) return;

  if (!bookings.length) {
    feed.innerHTML = '<div style="text-align:center;color:var(--admin-text-muted);font-size:0.82rem;padding:2rem;">No activity yet</div>';
    return;
  }

  feed.innerHTML = bookings.map(b => {
    const dotColor = b.status === 'confirmed' ? 'green' : b.status === 'cancelled' ? 'red' : '';
    const timeAgo = getTimeAgo(b.createdAt);
    return `
      <div class="activity-item">
        <div class="activity-dot ${dotColor}"></div>
        <div>
          <div class="activity-text">
            <strong>${escHtml(b.name || 'Guest')}</strong> booked 
            <strong>${escHtml(b.destinationLabel || '')}</strong>
            — <span class="status-badge status-${b.status || 'pending'}" style="font-size:0.65rem;">${b.status || 'pending'}</span>
          </div>
          <div class="activity-time">${timeAgo}</div>
        </div>
      </div>
    `;
  }).join('');
}

function getTimeAgo(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return Math.floor(hrs / 24) + 'd ago';
}

/* ── Export CSV ──────────────────────────────────────────────────── */
function exportCSV() {
  const bookings = getFilteredBookings();
  if (!bookings.length) { showAdminToast('error', 'No bookings to export'); return; }

  const headers = ['ID', 'Name', 'Email', 'Phone', 'Destination', 'Package', 'Check-In', 'Check-Out', 'Guests', 'Status', 'Total', 'Created At'];
  const rows = bookings.map(b => [
    b.id, b.name, b.email, b.phone, b.destinationLabel, b.packageLabel,
    b.checkIn, b.checkOut, b.guests, b.status,
    b.total ? '₹' + b.total : '', b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '',
  ].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hp-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showAdminToast('success', '📥 CSV exported!');
}

/* ── Notification Panel ──────────────────────────────────────────── */
function initNotifPanel() {
  const panel = document.getElementById('notifPanel');
  const openBtn = document.getElementById('openNotifPanel');
  const closeBtn = document.getElementById('closeNotifPanel');

  openBtn?.addEventListener('click', () => {
    panel?.classList.add('open');
    loadNtfySettings();
  });

  closeBtn?.addEventListener('click', () => panel?.classList.remove('open'));

  document.getElementById('saveNtfyBtn')?.addEventListener('click', () => {
    const topic = document.getElementById('ntfyTopic')?.value.trim();
    if (!topic) { showAdminToast('error', 'Enter a topic name'); return; }
    const cfg = getNtfyConfig();
    cfg.topic = topic;
    cfg.enabled = true;
    saveNtfyConfig(cfg);
    updateNtfyLink();
    showAdminToast('success', '✓ Notification settings saved!');
    updateSidebarNtfyStatus(true);
  });

  document.getElementById('testNtfyBtn')?.addEventListener('click', async () => {
    const ok = await sendTestNotification();
    if (ok) showAdminToast('success', '📱 Test notification sent!');
    else showAdminToast('error', '❌ Failed. Check your topic name & internet.');
  });

  document.getElementById('ntfyTopic')?.addEventListener('input', updateNtfyLink);
}

function loadNtfySettings() {
  const cfg = getNtfyConfig();
  const topicEl = document.getElementById('ntfyTopic');
  if (topicEl) topicEl.value = cfg.topic;
  updateNtfyLink();
  updateSidebarNtfyStatus(cfg.enabled);
}

function updateNtfyLink() {
  const topic = document.getElementById('ntfyTopic')?.value.trim() || '';
  const link = document.getElementById('ntfyLink');
  if (link) link.textContent = `https://ntfy.sh/${topic}`;
}

function updateSidebarNtfyStatus(enabled) {
  const dot = document.getElementById('ntfyStatusDot');
  const label = document.getElementById('ntfyStatusLabel');
  if (dot) dot.classList.toggle('active', enabled);
  if (label) label.textContent = enabled ? 'Notifications Active' : 'Notifications Off';
}

function getNtfyConfig() {
  try {
    const cfg = JSON.parse(localStorage.getItem(NTFY_KEY) || '{}');
    return { topic: cfg.topic || 'hp-tourism-bookings', server: cfg.server || 'https://ntfy.sh', enabled: cfg.enabled !== false };
  } catch { return { topic: 'hp-tourism-bookings', server: 'https://ntfy.sh', enabled: false }; }
}

function saveNtfyConfig(cfg) {
  localStorage.setItem(NTFY_KEY, JSON.stringify(cfg));
}

async function sendTestNotification() {
  const cfg = getNtfyConfig();
  try {
    const res = await fetch(`${cfg.server}/${cfg.topic}`, {
      method: 'POST',
      headers: { 'Title': 'HP Tourism — Test 🏔️', 'Priority': 'default', 'Tags': 'white_check_mark' },
      body: 'Admin panel notifications are working! You\'ll receive alerts for new bookings.',
    });
    return res.ok;
  } catch { return false; }
}

/* ── Admin Toast ─────────────────────────────────────────────────── */
function showAdminToast(type, msg) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;

  toast.className = `admin-toast ${type}`;
  toast.querySelector('.toast-text').textContent = msg;
  toast.classList.add('show');

  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── Sidebar Navigation ──────────────────────────────────────────── */
function initSidebarNav() {
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const section = item.dataset.section;
      document.querySelectorAll('.admin-section').forEach(s => {
        s.style.display = s.id === section ? 'block' : 'none';
      });
    });
  });
}

/* ── Seed Demo Data ──────────────────────────────────────────────── */
function seedDemoData() {
  if (getBookings().length > 0) return;

  const demos = [
    { id: 'HP-DEMO001', name: 'Arjun Sharma', email: 'arjun@email.com', phone: '9876543210', destination: 'shimla', destinationLabel: 'Shimla', packageLabel: 'Luxury', package: 'luxury', checkIn: '2026-09-10', checkOut: '2026-09-17', guests: '2', nights: 7, roomType: 'Deluxe', total: 89597, status: 'confirmed', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'HP-DEMO002', name: 'Priya Mehta', email: 'priya@email.com', phone: '9123456780', destination: 'manali', destinationLabel: 'Manali', packageLabel: 'Adventure', package: 'adventure', checkIn: '2026-09-15', checkOut: '2026-09-20', guests: '4', nights: 5, roomType: 'Standard', total: 111997, status: 'pending', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'HP-DEMO003', name: 'Rohit Nair', email: 'rohit@email.com', phone: '9988776655', destination: 'spiti', destinationLabel: 'Spiti Valley', packageLabel: 'Explorer', package: 'explorer', checkIn: '2026-10-01', checkOut: '2026-10-04', guests: '2', nights: 3, roomType: 'Budget', total: 35838, status: 'confirmed', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'HP-DEMO004', name: 'Neha Gupta', email: 'neha@email.com', phone: '9811223344', destination: 'dharamshala', destinationLabel: 'Dharamshala', packageLabel: 'Honeymoon', package: 'honeymoon', checkIn: '2026-09-20', checkOut: '2026-09-25', guests: '2', nights: 5, roomType: 'Suite', total: 66798, status: 'pending', createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'HP-DEMO005', name: 'Vikram Singh', email: 'vikram@email.com', phone: '9701234567', destination: 'kasol', destinationLabel: 'Kasol', packageLabel: 'Explorer', package: 'explorer', checkIn: '2026-10-10', checkOut: '2026-10-13', guests: '6', nights: 3, roomType: 'Standard', total: 107514, status: 'cancelled', createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 'HP-DEMO006', name: 'Ananya Joshi', email: 'ananya@email.com', phone: '9654321098', destination: 'dalhousie', destinationLabel: 'Dalhousie', packageLabel: 'Luxury', package: 'luxury', checkIn: '2026-11-01', checkOut: '2026-11-08', guests: '2', nights: 7, roomType: 'Deluxe', total: 89597, status: 'confirmed', createdAt: new Date(Date.now() - 432000000).toISOString() },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
}

/* ── Init ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  initAuth();
  initSidebarNav();

  document.getElementById('modalBackdrop')?.addEventListener('click', e => {
    if (e.target.id === 'modalBackdrop') closeModal();
  });

  document.getElementById('closeModal')?.addEventListener('click', closeModal);

  updateNtfyLink();
  loadNtfySettings();
});
