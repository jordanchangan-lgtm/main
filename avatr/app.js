/* ================= AVATR 07 — The Walk, Amman ================= */

const CONFIG = {
  // Paste your deployed Google Apps Script web app URL here (see README.md).
  // While it still contains "PASTE_", the page runs in demo mode: no network
  // call is made and every submission "succeeds" locally.
  ENDPOINT: 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE',
  INSTAGRAM_URL: 'https://www.instagram.com/avatr.jordan',
  INSTAGRAM_HANDLE: '@avatr.jordan',
};

const LS = {
  LANG: 'avatr_lang',
  LEAD: 'avatr_lead',      // {name, mobile, code, ts, redeemed, redeemedAt}
  PENDING: 'avatr_pending' // payload that failed to send
};

/* ---------------- i18n ---------------- */
const I18N = {
  en: {
    title: 'AVATR 07 — The Walk, Amman',
    heroSub: 'REEV Experience • The Walk, Amman',
    heroHook: '30 seconds. Free ice cream. 🍦',
    nameLabel: 'Full name',
    nameErr: 'Please enter your full name',
    mobileLabel: 'Mobile number',
    mobileErr: 'Enter a valid Jordanian mobile (07XXXXXXXX)',
    dupErr: 'This number is already registered',
    carLabel: 'Current car (optional)',
    timelineLabel: 'When are you planning to buy?',
    t03: '0–3 months', t36: '3–6 months', t612: '6–12 months', tLook: 'Just looking',
    testDriveLabel: 'Book a test drive?',
    tdWeek: 'Yes — this week', tdLater: 'Yes — later', tdNo: 'No',
    whatsappLabel: 'Send me AVATR offers on WhatsApp',
    submit: 'Get my ice cream 🍦',
    finaleCaption: 'Free at the Crema Creme cart',
    sending: 'Sending…',
    netErr: 'Connection problem — your details are saved, nothing was lost.',
    retry: 'Try again',
    enjoy: 'Enjoy your ice cream!',
    showAtCart: 'Show this screen at the Crema Creme cart',
    redeemBtn: 'Redeemed — staff only',
    redeemConfirm: 'Tap again to confirm',
    redeemedStamp: 'REDEEMED',
    draw: "You're entered in the draw to win a weekend with the AVATR 07",
    langBtn: 'عربي',
  },
  ar: {
    title: 'AVATR 07 — ذا ووك، عمّان',
    heroSub: 'تجربة REEV • ذا ووك، عمّان',
    heroHook: '30 ثانية فقط… وآيس كريم مجاني 🍦',
    nameLabel: 'الاسم الكامل',
    nameErr: 'الرجاء إدخال الاسم الكامل',
    mobileLabel: 'رقم الموبايل',
    mobileErr: 'أدخل رقم موبايل أردني صحيح (07XXXXXXXX)',
    dupErr: 'هذا الرقم مسجّل مسبقاً',
    carLabel: 'سيارتك الحالية (اختياري)',
    timelineLabel: 'متى تخطط لشراء سيارة؟',
    t03: '0–3 أشهر', t36: '3–6 أشهر', t612: '6–12 شهر', tLook: 'أتصفّح فقط',
    testDriveLabel: 'حجز تجربة قيادة؟',
    tdWeek: 'نعم — هذا الأسبوع', tdLater: 'نعم — لاحقاً', tdNo: 'لا',
    whatsappLabel: 'أرسلوا لي عروض AVATR على واتساب',
    submit: 'أعطوني الآيس كريم 🍦',
    finaleCaption: 'مجاناً عند عربة Crema Creme',
    sending: 'جارٍ الإرسال…',
    netErr: 'مشكلة في الاتصال — بياناتك محفوظة ولم تُفقد.',
    retry: 'حاول مجدداً',
    enjoy: 'بالهناء! استمتع بالآيس كريم',
    showAtCart: 'أظهِر هذه الشاشة عند عربة Crema Creme',
    redeemBtn: 'تم الاستلام — للموظف فقط',
    redeemConfirm: 'اضغط مرة أخرى للتأكيد',
    redeemedStamp: 'تم الاستخدام',
    draw: 'أنت مشارك في السحب على عطلة نهاية أسبوع مع AVATR 07',
    langBtn: 'EN',
  },
};

let lang = localStorage.getItem(LS.LANG) || 'ar';

const $ = (id) => document.getElementById(id);

function t(key) { return I18N[lang][key] || I18N.en[key] || key; }

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $('langToggle').textContent = t('langBtn');
  $('igLink').textContent = CONFIG.INSTAGRAM_HANDLE;
  localStorage.setItem(LS.LANG, lang);
}

$('langToggle').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  applyLang();
});

/* ---------------- phone helpers ---------------- */

// Convert Arabic-Indic and Persian digits to Latin
function latinDigits(str) {
  return str.replace(/[٠-٩۰-۹]/g, (d) => {
    const c = d.charCodeAt(0);
    return String((c >= 0x06F0 ? c - 0x06F0 : c - 0x0660));
  });
}

// Normalize any reasonable way of typing a Jordanian mobile to 07XXXXXXXX
function normalizeMobile(raw) {
  let d = latinDigits(raw).replace(/\D/g, '');
  if (d.startsWith('00962')) d = '0' + d.slice(5);
  else if (d.startsWith('962')) d = '0' + d.slice(3);
  else if (d.length === 9 && d.startsWith('7')) d = '0' + d;
  return d;
}

// Jordanian mobiles: 077 / 078 / 079 + 7 digits
function isValidMobile(m) { return /^07[789]\d{7}$/.test(m); }

// Reproducible 4-char voucher code derived from the phone number.
// Ambiguous characters (0/O, 1/I/L) are excluded. Must match Code.gs.
function voucherCode(mobile) {
  let h = 5381;
  for (let i = 0; i < mobile.length; i++) {
    h = ((h * 33) ^ mobile.charCodeAt(i)) >>> 0;
  }
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += A[h % A.length];
    h = Math.floor(h / A.length);
  }
  return code;
}

/* ---------------- chips ---------------- */
function initChips(groupId) {
  const group = $(groupId);
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    const wasOn = btn.getAttribute('aria-pressed') === 'true';
    group.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
    if (!wasOn) btn.setAttribute('aria-pressed', 'true');
  });
}
function chipValue(groupId) {
  const on = $(groupId).querySelector('.chip[aria-pressed="true"]');
  return on ? on.dataset.value : '';
}
initChips('timelineChips');
initChips('testDriveChips');

/* ---------------- submission ---------------- */
const form = $('leadForm');
const submitBtn = $('submitBtn');

function setSubmitting(on) {
  submitBtn.disabled = on;
  submitBtn.querySelector('.spinner').hidden = !on;
  submitBtn.querySelector('.cta-label').textContent = on ? t('sending') : t('submit');
}

function buildPayload() {
  const mobile = normalizeMobile($('mobile').value);
  return {
    timestamp: new Date().toISOString(),
    name: $('name').value.trim(),
    mobile,
    currentCar: $('car').value.trim(),
    timeline: chipValue('timelineChips'),
    testDrive: chipValue('testDriveChips'),
    whatsappOptIn: $('whatsapp').checked,
    language: lang,
    voucherCode: voucherCode(mobile),
  };
}

function validate() {
  let ok = true;
  const name = $('name').value.trim();
  const mobile = normalizeMobile($('mobile').value);

  $('nameErr').hidden = !!name;
  $('name').classList.toggle('invalid', !name);
  if (!name) ok = false;

  const mOk = isValidMobile(mobile);
  $('mobileErr').hidden = mOk;
  $('dupErr').hidden = true;
  $('mobile').classList.toggle('invalid', !mOk);
  if (!mOk) ok = false;

  return ok;
}

async function send(payload) {
  if (CONFIG.ENDPOINT.includes('PASTE_')) {
    // Demo mode — endpoint not configured yet
    console.warn('AVATR: CONFIG.ENDPOINT not set, running in demo mode.');
    await new Promise((r) => setTimeout(r, 700));
    return { status: 'ok' };
  }
  // Body sent as text/plain (fetch default) so the browser skips the CORS
  // preflight, which Apps Script web apps cannot answer.
  const res = await fetch(CONFIG.ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function submit(payload) {
  setSubmitting(true);
  $('retryBox').hidden = true;
  try {
    const out = await send(payload);
    if (out.status === 'duplicate') {
      localStorage.removeItem(LS.PENDING);
      setSubmitting(false);
      $('dupErr').hidden = false;
      $('mobile').classList.add('invalid');
      return;
    }
    localStorage.removeItem(LS.PENDING);
    saveLead(payload);
    showVoucher();
  } catch (err) {
    // Network failure: keep the lead and offer retry — never lose the data
    localStorage.setItem(LS.PENDING, JSON.stringify(payload));
    setSubmitting(false);
    $('retryBox').hidden = false;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;
  // Duplicate check on this device
  const lead = getLead();
  if (lead) { showVoucher(); return; }
  submit(buildPayload());
});

$('retryBtn').addEventListener('click', () => {
  const pending = localStorage.getItem(LS.PENDING);
  if (pending) submit(JSON.parse(pending));
});

/* ---------------- voucher ---------------- */
function getLead() {
  try { return JSON.parse(localStorage.getItem(LS.LEAD)); } catch { return null; }
}

function saveLead(payload) {
  localStorage.setItem(LS.LEAD, JSON.stringify({
    name: payload.name,
    mobile: payload.mobile,
    code: payload.voucherCode,
    ts: payload.timestamp,
    redeemed: false,
  }));
}

let clockTimer = null;

function showVoucher() {
  const lead = getLead();
  if (!lead) return;

  $('formScreen').hidden = true;
  $('voucherScreen').hidden = false;
  $('voucherCode').textContent = lead.code;
  $('igLink').href = CONFIG.INSTAGRAM_URL;
  $('igLink').textContent = CONFIG.INSTAGRAM_HANDLE;

  // Live clock — hard to fake with a screenshot
  const tick = () => {
    $('voucherClock').textContent = new Date().toLocaleTimeString('en-GB');
  };
  tick();
  if (!clockTimer) clockTimer = setInterval(tick, 1000);

  if (lead.redeemed) markRedeemed();
}

function markRedeemed() {
  $('voucherCard').classList.add('redeemed');
  $('redeemedStamp').hidden = false;
}

// Two-tap redeem so a visitor can't gray out their voucher by accident:
// first tap arms the button, second tap within 3s confirms.
let redeemArmed = null;
$('redeemBtn').addEventListener('click', () => {
  const btn = $('redeemBtn');
  if (!redeemArmed) {
    btn.classList.add('confirm');
    btn.querySelector('span').textContent = t('redeemConfirm');
    redeemArmed = setTimeout(() => {
      redeemArmed = null;
      btn.classList.remove('confirm');
      btn.querySelector('span').textContent = t('redeemBtn');
    }, 3000);
    return;
  }
  clearTimeout(redeemArmed);
  redeemArmed = null;
  const lead = getLead();
  lead.redeemed = true;
  lead.redeemedAt = new Date().toISOString();
  localStorage.setItem(LS.LEAD, JSON.stringify(lead));
  markRedeemed();
});

/* ---------------- scroll reveal ---------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------------- init ---------------- */
applyLang();

// Keep phone field digits clean as the user types
$('mobile').addEventListener('input', (e) => {
  const el = e.target;
  el.value = latinDigits(el.value).replace(/[^\d+ ]/g, '');
});

// Returning visitor: straight to their voucher (redeemed or not)
if (getLead()) {
  showVoucher();
} else if (localStorage.getItem(LS.PENDING)) {
  // A submission failed last time — surface the retry immediately
  $('retryBox').hidden = false;
}
