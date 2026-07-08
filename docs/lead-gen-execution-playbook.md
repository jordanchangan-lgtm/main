# AVATR 07 — Lead Generation Execution Playbook (Step-by-Step)

Scope: fixing lead quality and lead volume for the AVATR 07 REEV (42,000 JOD) in Amman.
Content strategy is intentionally out of scope (parked for later).

Order of execution matters — do the phases in sequence.

---

## Phase 0 — Foundations (Day 1–2, before spending 1 JOD)

### 0.1 Business Manager audit
1. Go to business.facebook.com → Settings.
2. Confirm the business OWNS (not just has access to): the Facebook Page, the Instagram account, the Ad Account, and payment method is set with no billing holds.
3. Add at least 2 admins (you + one backup). Single-admin accounts get locked and die.

### 0.2 Install the Meta Pixel
1. Events Manager → Connect Data Sources → Web → name it `AVATR Jordan Pixel`.
2. Install the base code on every page of the website (the dev can paste it into the site `<head>`; if the site runs on this repo, the pixel snippet goes into `index.html`).
3. Verify with the "Meta Pixel Helper" Chrome extension — it must fire on page load.
4. In Events Manager, set up two events: `Lead` (fires on any form/WhatsApp click) and `Contact`.

*Why: without a pixel you cannot retarget site visitors and Meta learns nothing about who your buyers are.*

### 0.3 WhatsApp Business — connected and staffed
1. Dedicate ONE number for sales leads (not a salesman's personal SIM — the business must own it).
2. Set it up on WhatsApp Business, then connect it to the Facebook Page: Page Settings → Linked Accounts / WhatsApp → connect number.
3. Configure: greeting message, away message, and quick replies for the 5 most common questions (price, financing, test drive, trade-in, availability).
4. Assign ownership: one named person per shift is responsible for replying **within 5 minutes**, 9am–9pm, 7 days. Put it in their job description, not as a favor.

### 0.4 Lead log (your minimum CRM)
Create one Google Sheet, columns:
`Date | Name | Phone | Source (campaign/ad) | Budget answer | Timeline answer | Trade-in? | Status (New / Contacted / Qualified / Test drive booked / Showed up / Negotiating / Sold / Dead) | Salesman | Notes | Last follow-up date`

Definition of **Qualified** (write it on the wall): budget 40k+ OR financing-approved intent, AND buying within 3 months, AND answered the phone/WhatsApp.

### 0.5 Customer list
Collect every phone number you can legitimately use: past buyers (any Mallouk brand), past test drives, past showroom visitors, service customers. Format a CSV: one column `phone` in international format (`+9627XXXXXXXX`), optional `email`. You'll upload this in Phase 2.

---

## Phase 1 — Turn off the leak (Day 2)

1. Stop all running boosted posts. Every dinar spent on engagement-optimized delivery is training Meta to find more unqualified people.
2. From now on the ONLY acceptable use of the boost button: amplifying a reel to **warm custom audiences** (engagers/retargeting) for reach — never for lead generation, never to broad audiences.

---

## Phase 2 — Build the audiences (Day 2–3)

All in Ads Manager → Audiences → Create Audience.

### 2.1 Custom audiences (build all six)
| # | Type | Settings | Name it |
|---|---|---|---|
| 1 | Instagram account | Everyone who engaged, 365 days | `IG Engagers 365d` |
| 2 | Facebook Page | Everyone who engaged, 365 days | `FB Engagers 365d` |
| 3 | Video | People who watched 75% of any video, 90 days | `Video 75% 90d` |
| 4 | Website | All site visitors, 180 days (needs Pixel from 0.2) | `Site Visitors 180d` |
| 5 | Customer list | Upload the CSV from 0.5 | `Customers + Past Leads` |
| 6 | Lead form | People who opened or submitted the form, 90 days (create after Phase 3) | `Form Openers 90d` |

### 2.2 Lookalike
1. Create Audience → Lookalike → Source = `Customers + Past Leads` → Location = Jordan → Size = 1% (also create a 1–3%).
2. If the customer list is under ~300 numbers, use `IG Engagers 365d` as the source instead until the list grows.

### 2.3 The geo template (you'll reuse this in every prospecting ad set)
1. In the ad set location field, remove "Jordan".
2. Search/drop pins with a **3 km radius** on: Abdoun, Deir Ghbar, Dabouq, Sweifieh, Um Uthaina, Khalda, Rabieh, Um Al-Summaq, Fuheis, and the Airport Road corridor.
3. Set location type to **"People living in this location"** (not "recently in" — that catches taxis and delivery drivers passing through).

---

## Phase 3 — Launch the two lead campaigns (Day 3–5)

### 3.1 Campaign C1 — Click-to-WhatsApp (primary engine, ~40% of budget)

1. Ads Manager → Create → Objective: **Leads** → conversion location: **Messaging apps** → select **WhatsApp** (if your account doesn't show it under Leads, use the Engagement objective → Messaging apps).
2. Campaign budget: OFF (set budgets at ad set level so test cells are protected).
3. Create **3 ad sets**, identical except audience:
   - `WA – Affluent Geo Broad`: geo template from 2.3, age 30–55, NO interests (creative does the filtering).
   - `WA – Luxury Auto`: geo template + detailed targeting: Mercedes-Benz, BMW, Audi, Lexus, Land Rover/Range Rover, Porsche, Luxury goods.
   - `WA – Lookalike 1%`: geo = Amman (city-level is fine here), audience = Lookalike from 2.2.
   - Every ad set: **exclude** `Customers + Past Leads`.
4. Placements: **Manual**. Keep FB Feed, IG Feed, IG Reels, FB Reels, Stories. **Uncheck Audience Network and Messenger Inbox** (junk inventory).
5. Budget: 12–15 JOD/day per ad set.
6. Ad creative (even a simple one for now — content quality comes later, but these rules are non-negotiable):
   - The price **42,000 JOD** appears in the first 3 seconds / first line of primary text.
   - Primary text template: *"AVATR 07 REEV — ٤٢,٠٠٠ دينار. من عمان للعقبة ورجعة بدون شحن. تمويل بنكي متاح + استبدال سيارتك. احجز تجربة قيادة — معرضنا شارع مكة."*
   - CTA button: **Send WhatsApp Message**.
7. Set WhatsApp **ice-breakers** (in the ad setup, "message template"): 
   - "بدي أحجز تجربة قيادة" 
   - "شو خيارات التمويل والتقسيط؟" 
   - "بدي تقييم سيارتي للاستبدال"

### 3.2 Campaign C2 — Instant Forms, qualified (~25% of budget)

1. Create → Objective: **Leads** → conversion location: **Instant forms**.
2. Two ad sets: `Form – Affluent Geo Broad` and `Form – Luxury Auto` (same specs as 3.1). 12 JOD/day each.
3. Build the form (this is where qualification happens):
   - Form type: **Higher intent** (adds a review screen — kills accidental submits).
   - Intro: car photo + "AVATR 07 REEV — 42,000 JOD. Book your test drive."
   - Questions (multiple choice, exact wording):
     1. "متى ناوي تشتري سيارة؟" → هذا الشهر / خلال ١–٣ شهور / بس بتفرج
     2. "شو ميزانيتك تقريباً؟" → أقل من ٣٠ ألف / ٣٠–٤٠ ألف / ٤٠ ألف وأكثر
     3. "كاش ولا تمويل؟" → كاش / تمويل بنكي / لسا ما قررت
     4. "عندك سيارة للاستبدال؟" → نعم / لا
   - Prefill fields: full name + phone number only (every extra field drops completion; these two are all sales needs).
   - Privacy policy: link to a privacy page on your website (one paragraph is enough — must exist, Meta requires the URL).
   - Thank-you screen: "رح نتواصل معك خلال دقائق" + button **"احكي معنا عالواتساب الآن"** linking to wa.me/YOUR_NUMBER — the hot ones will click it and skip the wait.
4. Optimization: start with default **Leads**. (You'll upgrade to Conversion Leads in Phase 5.)

### 3.3 Campaign C3 — Retargeting (~20% of budget, launch Day 7–10 once audiences have volume)

1. Create → Objective: **Leads** → Messaging apps → WhatsApp.
2. One ad set: audience = `IG Engagers 365d` + `FB Engagers 365d` + `Video 75% 90d` + `Site Visitors 180d` + `Form Openers 90d`, location Jordan, exclude `Customers + Past Leads`. 8–10 JOD/day.
3. Creative: pure test-drive offer — *"شفت الـAVATR 07 عنا أكثر من مرة. حان وقت تجربها. ٣٠ دقيقة، قهوتك علينا، بدون أي التزام. احجز موعدك عالواتساب."*
4. Frequency check weekly: if frequency > 4/week, refresh the creative or lower budget.

---

## Phase 4 — Lead handling SOP (starts the minute C1 goes live)

**The 5-minute rule:** every WhatsApp/form lead gets a human reply within 5 minutes, 9am–9pm. After-hours leads get replied to by 9:15am. Log SLA compliance in the sheet.

**First-reply script (WhatsApp):**
> "أهلاً [name] 🌟 معك [salesman] من AVATR الأردن — شارع مكة. تمام إنك مهتم بالـAVATR 07. سؤالين سريعين لأخدمك أفضل: ناوي تشتري قريباً ولا بتقارن خيارات؟ وكاش ولا تمويل؟"

**Then route:**
- Qualified (per Phase 0.4 definition) → push ONE next step only: "شو أنسب إلك، بكرة الساعة ٥ ولا الجمعة الصبح؟ بجهزلك السيارة عالباب." Confirmed slot + salesman name + calendar entry.
- Not yet qualified but real → financing option pitch (monthly payment framing: "بالتمويل بتطلع حوالي X دينار شهرياً"), then follow-up track.
- Unqualified → polite close, mark `Dead – budget` in the sheet. **This tag matters for Phase 5.**

**Follow-up cadence (non-negotiable, in the sheet):**
- Day 0: first contact. Day 2: value follow-up (send a specific feature video or the fuel-cost math — not "بتفكر شي؟"). Day 7: test-drive re-invite. Day 14: financing/trade-in angle. Then monthly. A 42k decision takes weeks — most dealers stop after one call; that's where your deals are hiding.

**No-show protection:** WhatsApp reminder the morning of the test drive + 1 hour before.

---

## Phase 5 — The feedback loop (Week 2 onward — this is the permanent fix)

1. **Rate every lead in Meta Leads Center:** Business Suite → All tools → Leads Center. Move each lead through its stages there too (or connect your CRM later). Marking quality here is what feeds Meta's learning.
2. **Weekly offline upload:** Events Manager → Offline Events → create event set `Showroom Events`. Every week upload a CSV of phone numbers with events: `TestDrive` and `Purchase` (Meta hashes and matches them to ad accounts). Now Meta knows which clicks became showroom visits.
3. **Switch C2 to "Conversion Leads" optimization** once ~20+ qualified/converted leads per month are being marked. From this point Meta stops optimizing for form-fills and starts optimizing for *people who resemble the ones who bought or test-drove.* This is the structural end of the "audience can only afford half the car" problem.
4. Rebuild the Lookalike monthly from the growing qualified-lead list.

---

## Phase 6 — Read, kill, scale (from Day 7, then weekly)

**Decision rules:**
- Don't touch anything for the first 5–7 days per ad set (learning phase).
- Judge ONLY on: cost per **qualified** lead (from your sheet, not Meta's dashboard) and cost per test-drive booked. Ignore CPM, CPC, reach, engagement.
- Working benchmarks to calibrate against (estimates for Jordan luxury auto — replace with your own data after 2 weeks): WhatsApp conversation 2–5 JOD · qualified lead 15–40 JOD · test drive booked 50–120 JOD. A 42k car with healthy margin justifies even 150+ JOD per test drive if show-up rate is decent.
- After 7 days: kill the worst ad set of the three in C1, move its budget to the best. Never scale a winner by more than ~30% per day (bigger jumps reset learning).
- Every 2 weeks: introduce ONE new test cell (new audience or new creative angle) into C4/testing budget — one variable at a time.

**Weekly 30-minute review (same time every week):** leads by campaign → % qualified by campaign → SLA compliance → test drives booked → walk-ins (ask every walk-in what brought them in, log it) → kill/scale decisions → offline upload done?

---

## Budget summary (minimum viable)

| Campaign | Daily | Monthly (~) |
|---|---|---|
| C1 WhatsApp ×3 ad sets | 36–45 JOD | 1,100–1,350 JOD |
| C2 Forms ×2 ad sets | 24 JOD | 720 JOD |
| C3 Retargeting | 8–10 JOD | 250–300 JOD |
| C4 Testing (from week 3) | 10 JOD | 300 JOD |
| **Total** | **~80–90 JOD/day** | **~2,400–2,700 JOD/mo** |

One incremental car sale covers multiple months of this budget. If cash is tight, run C1 (two ad sets) + C3 only — never spread thinner than 10 JOD/day per ad set.

---

## Checklist recap (pin this)

- [ ] Day 1–2: BM audit · Pixel installed & verified · WhatsApp number connected + 5-min SLA owner · lead sheet created · customer CSV built
- [ ] Day 2: all boosts stopped · 6 custom audiences + lookalike built
- [ ] Day 3–5: C1 (3 ad sets) live · C2 (form with 4 qualifying questions) live · privacy page URL ready
- [ ] Day 7–10: C3 retargeting live · first kill/scale pass
- [ ] Week 2: Leads Center rating habit · first offline conversions upload
- [ ] Week 3–4: C2 → Conversion Leads optimization · first test cell in C4 · weekly review running
