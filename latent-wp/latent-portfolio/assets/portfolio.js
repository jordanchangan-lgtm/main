/* Latent Portfolio — the stage. Vanilla JS, no dependencies.
   The stage sits sticky inside a tall hold; scroll progress through the hold picks the live project.
   Each project's pieces are laid out in justified rows (balanced by aspect ratio) that fill the media
   column, then wipe in one by one. The names stand stacked on the right; clicking one scrolls to it. */
(function(){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function vPlay(v){ var p = v.play(); if(p && p.catch) p.catch(function(){}); }
  function clamp01(n){ return n < 0 ? 0 : (n > 1 ? 1 : n); }
  function pad2(n){ return (n < 10 ? "0" : "") + n; }

  /* clock in the chrome */
  var clk = document.querySelector(".js-clock"), fmt = null;
  if(clk){
    try{ fmt = new Intl.DateTimeFormat("en-GB", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone: clk.dataset.tz || "UTC" }); }catch(e){ try{ fmt = new Intl.DateTimeFormat("en-GB", { hour:"2-digit", minute:"2-digit", hour12:false }); }catch(e2){} }
    function tick(){ if(fmt) clk.textContent = fmt.format(new Date()); } tick(); setInterval(tick, 15000);
  }

  /* reveals */
  var rv = [].slice.call(document.querySelectorAll(".rv"));
  if(reduce || !("IntersectionObserver" in window)) rv.forEach(function(e){ e.classList.add("in"); });
  else { var ro = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); ro.unobserve(e.target); } }); }, { threshold:.12, rootMargin:"0px 0px -6% 0px" }); rv.forEach(function(e){ ro.observe(e); }); }

  /* the full-frame player */
  var fm = document.querySelector(".js-fm");
  var openFor = function(){};
  if(fm){
    var fv = fm.querySelector(".js-fm-v"), fi = fm.querySelector(".js-fm-img"), stage = fm.querySelector(".js-fm-stage"), state = fm.querySelector(".js-fm-state"), time = fm.querySelector(".js-fm-time"), ft = fm.querySelector(".js-fm-title"), fc = fm.querySelector(".js-fm-client"), fn = fm.querySelector(".js-fm-note"), last = null, dur = "0:05";
    function fmtT(t){ t = Math.floor(t || 0); return Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2); }
    openFor = function(el){
      last = document.activeElement; ft.textContent = el.dataset.title || ""; fc.textContent = el.dataset.client || ""; fn.textContent = el.dataset.note || "";
      var src = el.querySelector("img, video");
      fm.hidden = false; document.body.style.overflow = "hidden"; requestAnimationFrame(function(){ fm.classList.add("on"); });
      if(el.dataset.img){ fv.pause(); fv.hidden = true; fi.hidden = false; fi.src = src.currentSrc || src.src; fm.classList.add("still"); }
      else {
        fi.hidden = true; fv.hidden = false; fm.classList.remove("still"); dur = el.dataset.dur || "0:05";
        var s = src.currentSrc || src.src; if(fv.src !== s){ fv.src = s; fv.poster = src.poster || ""; }
        fv.currentTime = 0; fv.muted = false; var p = fv.play(); if(p && p.catch) p.catch(function(){ fv.muted = true; vPlay(fv); });
        stage.classList.remove("paused"); state.textContent = "[ Pause ]"; time.textContent = "0:00 / " + dur;
      }
      fm.querySelector(".js-fm-close").focus();
    };
    function close(){ fv.pause(); fm.classList.remove("on"); document.body.style.overflow = ""; setTimeout(function(){ fm.hidden = true; }, 350); if(last && last.focus) last.focus(); }
    fm.querySelector(".js-fm-close").addEventListener("click", close);
    stage.addEventListener("click", function(){ if(fm.classList.contains("still")) return; if(fv.paused){ vPlay(fv); stage.classList.remove("paused"); state.textContent = "[ Pause ]"; } else { fv.pause(); stage.classList.add("paused"); state.textContent = "[ Play ]"; } });
    fv.addEventListener("timeupdate", function(){ time.textContent = fmtT(fv.currentTime) + " / " + (isFinite(fv.duration) && fv.duration ? fmtT(fv.duration) : dur); });
    fv.addEventListener("ended", function(){ stage.classList.add("paused"); state.textContent = "[ Replay ]"; });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape" && !fm.hidden) close(); });
  }
  [].forEach.call(document.querySelectorAll(".js-open"), function(el){ el.addEventListener("click", function(){ openFor(el); }); el.setAttribute("tabindex", "0"); el.setAttribute("role", "button"); el.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openFor(el); } }); });

  /* the stage */
  var wkHold = document.querySelector(".js-wk-hold");
  if(!wkHold) return;
  var wkStage = wkHold.querySelector(".js-wk-stage"), wkSets = [].slice.call(wkHold.querySelectorAll(".js-wk-set")), wkMedia = wkHold.querySelector(".js-wk-media"),
      wkStk = wkHold.querySelector(".js-wk-stk"), wkLines = [].slice.call(wkHold.querySelectorAll(".js-wk-stk .stk-l")), wkText = wkHold.querySelector(".wk-text"),
      wkProj = wkHold.querySelector(".js-wk-proj"), wkMeta = wkHold.querySelector(".js-wk-meta"), wkNote = wkHold.querySelector(".js-wk-note"),
      wkCount = wkHold.querySelector(".js-wk-count"), wkN = wkHold.querySelector(".js-wk-n"), wkOpen = wkHold.querySelector(".js-wk-open"), wkPdf = wkHold.querySelector(".js-wk-pdf"),
      wkFilter = [].slice.call(wkHold.querySelectorAll(".js-wk-filter span")), wkCue = wkHold.querySelector(".wk-cue"), wkAt = -1, WK = window.__WK || [];
  function wkSwap(el, html){ if(!el) return; if(reduce){ el.textContent = html; return; } el.classList.add("out"); setTimeout(function(){ el.textContent = html; el.classList.remove("out"); }, 260); }
  function wkLayout(){
    var W = wkMedia.clientWidth, H = wkMedia.clientHeight, gap = 8;
    if(W < 10 || H < 10) return;
    wkSets.forEach(function(set){
      var items = [].slice.call(set.querySelectorAll(".wk-m"));
      if(!items.length) return;
      var ars = items.map(function(m){ var r = m.style.getPropertyValue("--ar").split("/"); var a = parseFloat(r[0]) / parseFloat(r[1] || 1); return isFinite(a) && a > 0 ? a : 1; });
      var total = ars.reduce(function(a, c){ return a + c; }, 0), best = null;
      for(var r = 1; r <= Math.min(6, items.length); r++){
        var rows = [], cum = 0;
        ars.forEach(function(a, i){ var k = Math.min(r - 1, Math.floor((cum + a / 2) / total * r)); (rows[k] = rows[k] || []).push(i); cum += a; });
        rows = rows.filter(function(x){ return x && x.length; });
        var hs = rows.map(function(row){ var s = row.reduce(function(a, i){ return a + ars[i]; }, 0); return (W - gap * (row.length - 1)) / s; });
        var tot = hs.reduce(function(a, c){ return a + c; }, 0) + gap * (rows.length - 1), scale = Math.min(1, H / tot);
        var avg = hs.reduce(function(a, c){ return a + c; }, 0) / hs.length * scale;
        if(!best || avg > best.avg) best = { rows:rows, hs:hs, scale:scale, avg:avg };
      }
      var g = gap * best.scale, used = best.hs.reduce(function(a, c){ return a + c * best.scale; }, 0) + g * (best.rows.length - 1);
      // the block of rows sits centred in the media area; tiles are absolute, so the offset goes on each top
      var y = Math.max(0, Math.round((H - used) / 2));
      best.rows.forEach(function(row, ri){
        var h = best.hs[ri] * best.scale, x = 0;
        row.forEach(function(i){ var w = h * ars[i], m = items[i]; m.style.width = Math.round(w) + "px"; m.style.height = Math.round(h) + "px"; m.style.left = Math.round(x) + "px"; m.style.top = Math.round(y) + "px"; x += w + g; });
        y += h + g;
      });
      set.querySelector(".wk-in").style.paddingTop = "";
    });
  }
  function wkFit(){
    wkStk.style.setProperty("--fit", "1");
    var cs = getComputedStyle(wkText), room = wkText.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4, widest = 0;
    wkLines.forEach(function(l){ widest = Math.max(widest, l.scrollWidth); });
    if(widest > room && room > 0) wkStk.style.setProperty("--fit", (room / widest).toFixed(3));
  }
  function wkShow(i){
    if(i === wkAt) return;
    var first = wkAt < 0; wkAt = i;
    wkStage.classList.toggle("live", i >= 0);
    wkLines.forEach(function(l, k){ l.classList.toggle("on", k === i); });
    wkSets.forEach(function(set, k){
      set.classList.toggle("on", k === i);
      [].forEach.call(set.querySelectorAll(".js-tile-v"), function(v){ if(k === i) vPlay(v); else v.pause(); });
    });
    wkFilter.forEach(function(sp, k){ sp.classList.toggle("on", k === i); });
    if(!WK[i]){ wkCount.textContent = "— / " + pad2(WK.length); return; }
    var d = WK[i], n = d.n + (d.n === 1 ? " piece" : " pieces");
    if(first){ wkProj.textContent = d.proj; wkMeta.textContent = d.meta; wkNote.textContent = d.note; wkN.textContent = n; }
    else { wkSwap(wkProj, d.proj); wkSwap(wkMeta, d.meta); wkSwap(wkNote, d.note); wkSwap(wkN, n); }
    wkCount.textContent = pad2(i + 1) + " / " + pad2(WK.length);
    wkOpen.textContent = d.film ? "[ Play the film ]" : "[ Open full frame ]";
    if(wkPdf){ wkPdf.hidden = !d.pdf; if(d.pdf){ wkPdf.href = d.pdf; wkPdf.textContent = d.pdfl; } }
  }
  function wkTick(){
    var vh = window.innerHeight, run = Math.max(1, wkHold.offsetHeight - vh), N = wkSets.length;
    var p = clamp01(-wkHold.getBoundingClientRect().top / run);
    var q = (p - .06) / .94, idx = q < 0 ? -1 : Math.min(N - 1, Math.floor(q * N)), seg = idx < 0 ? 0 : q * N - idx;
    if(wkCue) wkCue.style.setProperty("--p", p.toFixed(3));
    wkMedia.style.setProperty("--sy", ((.5 - seg) * 28).toFixed(1));
    wkShow(idx);
  }
  wkHold.style.height = "calc(100svh + " + (wkSets.length * 80) + "vh)";
  var wkAll = function(){ wkLayout(); wkFit(); };
  wkAll(); window.addEventListener("resize", wkAll, { passive:true });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(wkAll);
  // whenever the media column changes size (fonts arriving, the admin bar, a rotation), lay the rows out again
  if("ResizeObserver" in window){ var wkRO = new ResizeObserver(function(){ wkAll(); }); wkRO.observe(wkMedia); wkRO.observe(wkText); }
  wkOpen.addEventListener("click", function(){ var set = wkSets[wkAt]; var m = set && set.querySelector(".wk-m"); if(m) m.click(); });
  wkLines.forEach(function(l, k){ l.addEventListener("click", function(){
    var vh = window.innerHeight, run = Math.max(1, wkHold.offsetHeight - vh);
    window.scrollTo({ top: window.scrollY + wkHold.getBoundingClientRect().top + run * (.06 + .94 * (k + .5) / wkSets.length), behavior: reduce ? "instant" : "smooth" });
  }); });
  var wkTicking = false;
  window.addEventListener("scroll", function(){ if(wkTicking) return; wkTicking = true; requestAnimationFrame(function(){ wkTicking = false; wkTick(); }); }, { passive:true });
  wkTick();
  /* deep link: /#work-N lands on project N */
  var m = /^#work-(\d+)$/.exec(location.hash);
  if(m && wkLines[+m[1]]) setTimeout(function(){ wkLines[+m[1]].click(); }, 400);
})();
