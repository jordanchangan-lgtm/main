# AVATR 07 — The Walk, Amman · QR Landing Page

Mobile-first landing page for the AVATR 07 REEV street activation. Visitors
scan a QR code on the car, fill a 30-second form, and get an ice cream
voucher screen to show at the Crema Creme cart.

No framework, no build step — `index.html` + `styles.css` + `app.js`.

## Files you still need to drop in

| File | What it is |
|---|---|
| `background.jpg` | Full-bleed background photo (a dark gradient shows until you add it) |
| `logo.png` | AVATR logo, white on transparent (an "AVATR" text wordmark shows until you add it) |

The three brand font files are already in `fonts/`.

## Backend setup (Google Sheet + Apps Script) — ~3 minutes

1. Create a new Google Sheet at [sheets.new](https://sheets.new) (name it e.g. *AVATR Leads*).
2. In the Sheet: **Extensions → Apps Script**. Delete the sample code and paste
   the full contents of [`apps-script/Code.gs`](apps-script/Code.gs). Save.
3. **Deploy → New deployment → ⚙️ Select type → Web app**, then:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone** ← required, otherwise the phone's POST is rejected
4. Click **Deploy**, authorize when prompted, and copy the **Web app URL**
   (ends in `/exec`).
5. Open `app.js` and paste that URL into `CONFIG.ENDPOINT` at the top.

> **Editing the script later?** Changes only go live after
> **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
> The URL stays the same.

Quick test without a phone:

```bash
curl -L -d '{"name":"Test","mobile":"0791234567","currentCar":"","timeline":"0-3 months","testDrive":"No","whatsappOptIn":true,"language":"en","voucherCode":"TEST"}' \
  "https://script.google.com/macros/s/XXXX/exec"
```

First call returns `{"status":"ok"}` and adds a row; repeating it returns
`{"status":"duplicate"}`.

## Hosting + QR

Host the `avatr/` folder on any static host (GitHub Pages, Netlify, Vercel,
Cloudflare Pages — all free). Point the QR code at the page URL. Serve over
**https** — Apps Script won't accept POSTs from an insecure page.

Until `CONFIG.ENDPOINT` is set, the page runs in **demo mode**: submissions
succeed locally without any network call, so you can test the full flow
(including the voucher and redeem screens) before wiring the Sheet.

## How it behaves

- **Language:** defaults to Arabic (RTL); EN/عربي toggle top corner, choice remembered.
- **Fonts:** all Latin text and digits render in the official AVATR Font
  (Light 300 / Regular 400 / Bold 700); Arabic falls back to Noto Kufi Arabic.
- **Validation:** Jordanian mobiles only — normalizes `+962`, `00962`,
  Arabic-Indic digits, spaces, then requires `07[7|8|9]XXXXXXX`.
- **Duplicates:** blocked twice — locally (one voucher per device via
  localStorage; a returning visitor goes straight to their voucher) and on the
  backend (`{status:"duplicate"}` per mobile number, race-safe via LockService).
- **Offline / network failure:** the lead is saved in localStorage and a retry
  button appears — data is never lost, even if the visitor closes and reopens.
- **Voucher code:** 4 characters, derived deterministically from the phone
  number (same code on re-render; ambiguous chars 0/O/1/I excluded).
- **Live clock** on the voucher makes screenshots easy for staff to spot.
- **Redeem:** staff double-taps the redeem button (two taps within 3 s, so a
  visitor can't gray out their own voucher accidentally); redemption is
  permanent per device via localStorage.

## Config

Everything adjustable lives in the `CONFIG` object at the top of `app.js`:
endpoint URL, Instagram link and handle. All visible copy is in the `I18N`
object right below it.
