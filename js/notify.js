/* ─── Push Notifications via ntfy.sh ───────────────────────────── */
// ntfy.sh is a free, open-source notification service.
// Install the "ntfy" app on your phone (Android/iOS) and subscribe to your topic.
// API docs: https://ntfy.sh/docs/

const NTFY_STORAGE_KEY = 'hp_ntfy_config';

function getNtfyConfig() {
  try {
    const cfg = JSON.parse(localStorage.getItem(NTFY_STORAGE_KEY) || '{}');
    return {
      topic:   cfg.topic  || 'hp-tourism-bookings',
      server:  cfg.server || 'https://ntfy.sh',
      enabled: cfg.enabled !== false,
    };
  } catch { return { topic: 'hp-tourism-bookings', server: 'https://ntfy.sh', enabled: true }; }
}

function saveNtfyConfig(cfg) {
  localStorage.setItem(NTFY_STORAGE_KEY, JSON.stringify(cfg));
}

async function sendNtfyNotification({ title, body, priority = 'high', tags = [] }) {
  const cfg = getNtfyConfig();
  if (!cfg.enabled || !cfg.topic) return false;

  try {
    const res = await fetch(`${cfg.server}/${cfg.topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Title':    title,
        'Priority': priority,
        'Tags':     tags.join(','),
      },
      body,
    });
    return res.ok;
  } catch (err) {
    console.error('ntfy notification failed:', err);
    return false;
  }
}

// Called from booking.js after a successful booking
window.sendBookingNotification = async function(booking) {
  const msg = [
    `🏔️ New Booking Received!`,
    `ID: ${booking.id}`,
    `Name: ${booking.name}`,
    `Destination: ${booking.destinationLabel}`,
    `Package: ${booking.packageLabel}`,
    `Dates: ${booking.checkIn} → ${booking.checkOut}`,
    `Guests: ${booking.guests}`,
    `Total: ₹${booking.total?.toLocaleString('en-IN')}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
  ].join('\n');

  const ok = await sendNtfyNotification({
    title:    `New HP Tourism Booking — ${booking.destinationLabel}`,
    body:      msg,
    priority: 'high',
    tags:     ['mountain', 'tada'],
  });

  // Also show browser notification if permission granted
  if (Notification.permission === 'granted') {
    new Notification(`✈️ New Booking: ${booking.destinationLabel}`, {
      body:  `${booking.name} | ${booking.packageLabel} | ₹${booking.total?.toLocaleString('en-IN')}`,
      icon:  'assets/favicon.png',
      badge: 'assets/favicon.png',
    });
  }

  return ok;
};

// Request browser notification permission
window.requestBrowserNotifications = async function() {
  if (!('Notification' in window)) return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
};

// Send a test notification
window.sendTestNotification = async function() {
  return sendNtfyNotification({
    title:    'HP Tourism — Test Notification 🏔️',
    body:     'Notifications are working! You will receive alerts for new bookings.',
    priority: 'default',
    tags:     ['white_check_mark'],
  });
};

// Export for admin panel
window.getNtfyConfig  = getNtfyConfig;
window.saveNtfyConfig = saveNtfyConfig;
