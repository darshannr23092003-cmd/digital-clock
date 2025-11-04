// script.js

// ====== Elements
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const formatToggle = document.getElementById('formatToggle');
const themeToggle = document.getElementById('themeToggle');

// ====== State (from localStorage)
const LS_KEYS = {
  format24: 'clock:format24',
  theme: 'clock:theme', // 'dark' | 'light'
};

let is24h = JSON.parse(localStorage.getItem(LS_KEYS.format24) ?? 'false'); // default 12h
let theme = localStorage.getItem(LS_KEYS.theme) ?? 'dark';

// Apply initial UI state
formatToggle.checked = is24h;
applyTheme(theme);

// ====== Helpers
const pad = (n) => String(n).padStart(2, '0');

function formatTime(date, use24h) {
  let h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  let suffix = '';
  if (!use24h) {
    suffix = h >= 12 ? ' PM' : ' AM';
    h = h % 12 || 12; // 0 or 12 -> 12
  }

  return `${pad(h)}:${pad(m)}:${pad(s)}${suffix}`;
}

function formatDate(date) {
  // e.g., Tue, 04 Nov 2025
  const weekday = date.toLocaleString(undefined, { weekday: 'short' });
  const day = pad(date.getDate());
  const month = date.toLocaleString(undefined, { month: 'short' });
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

function tick() {
  const now = new Date();
  timeEl.textContent = formatTime(now, is24h);
  dateEl.textContent = formatDate(now);
}

function applyTheme(next) {
  document.body.classList.toggle('light', next === 'light');
  themeToggle.textContent = next === 'light' ? 'Dark' : 'Light';
  themeToggle.setAttribute('aria-pressed', String(next !== 'light'));
}

// ====== Events
formatToggle.addEventListener('change', (e) => {
  is24h = e.currentTarget.checked;
  localStorage.setItem(LS_KEYS.format24, JSON.stringify(is24h));
  tick(); // update immediately
});

themeToggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(LS_KEYS.theme, theme);
  applyTheme(theme);
});

// ====== Start clock
tick();
setInterval(tick, 1000);
