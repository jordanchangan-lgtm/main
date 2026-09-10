/* version two after the hero: the statement brightens word by word with the scroll; the blinds close from ink to ivory */
(function(){
  var line = document.querySelector(".js-bright"), blindsAll = [].slice.call(document.querySelectorAll(".js-blinds")), sec = document.querySelector(".js-st2"); if(!line && !blindsAll.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, words = [], ticking = false;
  if(line){ var ws = line.textContent.trim().split(/\s+/); line.textContent = "";
    ws.forEach(function(w, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = w; sp.style.setProperty("--i", i); line.appendChild(sp); if(i < ws.length - 1) line.appendChild(document.createTextNode(" ")); words.push(sp); }); }
  var sets = blindsAll.map(function(b){ return { el: b, slats: [].slice.call(b.children) }; });
  function frame(){
    ticking = false; var vh = window.innerHeight;
    if(line){ var st = sec.getBoundingClientRect(); var p = reduce ? 1 : Math.min(1, Math.max(0, -st.top / (vh * .52))); line.classList.toggle("on", reduce || st.top <= 1); line.style.setProperty("--p", (p * (words.length + 3)).toFixed(2)); }
    sets.forEach(function(st){ var b = st.el.getBoundingClientRect(); var q = reduce ? 1 : Math.min(1, Math.max(0, (vh * .9 - b.top) / (vh * .55)));
      st.slats.forEach(function(sl, i){ sl.classList.toggle("on", q > (i + 1) / (st.slats.length + 1)); }); });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); frame();
})();
/* how it works: a pinned horizontal scroll, as in the reference. The page scrolls down, the track slides left;
   each card reveals when it enters the screen (from below on phones), the film plays only while its card is in */
(function(){
  var sec = document.querySelector(".js-hz"); if(!sec) return;
  var hold = sec.querySelector(".js-hz-hold"), track = sec.querySelector(".js-hz-track"), cards = [].slice.call(sec.querySelectorAll(".js-hw")), type = sec.querySelector(".hz-type");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, on = false;
  function measure(){
    on = window.innerWidth > 820 && !reduce; sec.classList.toggle("hz-on", on);
    if(!on){ hold.style.height = ""; track.style.transform = ""; frame(); return; }
    var run = track.scrollWidth - window.innerWidth; hold.style.height = (window.innerHeight + Math.max(0, run)) + "px"; frame();
  }
  function reveal(c, yes){
    if(yes === c.classList.contains("in")) return; c.classList.toggle("in", yes);
    var v = c.querySelector(".js-hw-v"); if(v){ if(yes){ var pr = v.play(); if(pr && pr.catch) pr.catch(function(){}); } else v.pause(); }
  }
  function frame(){
    ticking = false; var vw = window.innerWidth, vh = window.innerHeight;
    if(on){
      var r = hold.getBoundingClientRect(), run = Math.max(1, hold.offsetHeight - vh);
      var p = Math.min(1, Math.max(0, -r.top / run)), x = p * (track.scrollWidth - vw);
      track.style.transform = "translate3d(" + (-x).toFixed(1) + "px,0,0)";
      if(type) type.classList.toggle("in", p > .82);
    }
    cards.forEach(function(c){ var b = c.getBoundingClientRect(); reveal(c, on ? (b.left < vw * .88 && b.right > 0) : (b.top < vh * .9 && b.bottom > 0)); });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", measure); window.addEventListener("load", measure); measure();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();
/* portfolio, version one: hover a row to see one piece of it in the centre; the button reveals the full grid */
(function(){
  var sec = document.querySelector(".js-wk3"); if(!sec) return;
  var rows = [].slice.call(sec.querySelectorAll(".js-wk3-row")), pvs = [].slice.call(sec.querySelectorAll(".js-wk3-pv")), prev = sec.querySelector(".js-wk3-prev"),
      listwrap = sec.querySelector(".js-wk3-listwrap"), grid = sec.querySelector(".js-wk3-grid"), groups = [].slice.call(sec.querySelectorAll(".js-wk3-group")),
      reveal = sec.querySelector(".js-wk3-reveal"), views = [].slice.call(sec.querySelectorAll(".js-wk3-view")), filters = [].slice.call(sec.querySelectorAll(".js-wk3-filter span")),
      hint = sec.querySelector(".js-wk3-hint"), at = -1, mode = "list";
  function show(i){ if(i === at) return; at = i; rows.forEach(function(r, k){ r.classList.toggle("on", k === i); }); pvs.forEach(function(p, k){ p.classList.toggle("on", k === i); }); prev.classList.toggle("live", i >= 0); }
  function setMode(m){
    mode = m; grid.hidden = m !== "grid"; listwrap.hidden = m === "grid"; sec.classList.toggle("grid-on", m === "grid");
    views.forEach(function(v){ v.classList.toggle("on", v.dataset.v === m); });
    reveal.textContent = m === "grid" ? "[ Back to the list ]" : "[ Reveal full projects ]";
    if(hint) hint.textContent = m === "grid" ? "Click any piece to open it full frame." : "Hover a project to see it. Click it to open all its pieces.";
  }
  rows.forEach(function(r, k){
    r.addEventListener("mouseenter", function(){ show(k); }); r.addEventListener("focus", function(){ show(k); });
    r.addEventListener("click", function(e){ e.preventDefault(); setMode("grid"); var g = groups[k]; if(g) setTimeout(function(){ g.scrollIntoView({ behavior:"smooth", block:"start" }); }, 60); });
  });
  reveal.addEventListener("click", function(){ setMode(mode === "grid" ? "list" : "grid"); if(mode === "list") sec.scrollIntoView({ behavior:"smooth", block:"start" }); });
  views.forEach(function(v){ v.addEventListener("click", function(){ setMode(v.dataset.v); }); });
  filters.forEach(function(f){ f.addEventListener("click", function(){
    filters.forEach(function(x){ x.classList.toggle("on", x === f); }); var tag = f.dataset.f, first = -1;
    function ok(el){ return tag === "all" || (" " + el.dataset.tags + " ").indexOf(" " + tag + " ") >= 0; }
    rows.forEach(function(r, k){ var y = ok(r); r.hidden = !y; if(y && first < 0) first = k; });
    groups.forEach(function(g){ g.hidden = !ok(g); });
    show(first);
  }); });
  show(0);
})();
/* the dark path sections (portfolio version two, How it works version two): names and step texts gather out of
   scattered starts as they arrive and fade as they leave; pieces wipe open as they arrive and squash onto their
   bottom edge as they leave at the top */
(function(){
  var secs = [].slice.call(document.querySelectorAll(".js-path, .js-pf2")).filter(function(s, i, a){ return a.indexOf(s) === i; }); if(!secs.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, seed = 11;
  function rnd(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var all = []; secs.forEach(function(sec){ all = all.concat([].slice.call(sec.querySelectorAll(".js-words"))); });
  all.forEach(function(el){
    var words = el.textContent.trim().split(/\s+/); el.textContent = "";
    words.forEach(function(w, i){
      var sp = document.createElement("span"); sp.className = "cw"; sp.textContent = w;
      sp.style.setProperty("--dx", ((rnd() - .5) * 90).toFixed(0) + "px"); sp.style.setProperty("--dy", ((rnd() - .5) * 60 + 30).toFixed(0) + "px"); sp.style.setProperty("--i", i);
      el.appendChild(sp); if(i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.dataset.n = words.length;
  });
  var chs = [], free = all.filter(function(el){ return !el.closest(".pf2-lab"); }), items = [];
  secs.forEach(function(sec){
    [].forEach.call(sec.querySelectorAll(".pf2-ch"), function(ch){ chs.push({ el: ch, lab: ch.querySelector(".pf2-lab"), words: [].slice.call(ch.querySelectorAll(".pf2-lab .js-words")) }); });
    items = items.concat([].slice.call(sec.querySelectorAll(".pf2-item")));
  });
  function set(w, pin, pout){ w.style.setProperty("--p", (reduce ? 1 : pin * ((w.dataset.n || 1) * .045 + .55)).toFixed(3)); w.style.setProperty("--q", (reduce ? 1 : pout).toFixed(3)); }
  function frame(){
    ticking = false; var vh = window.innerHeight;
    chs.forEach(function(c){
      var r = c.el.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      var pin = Math.min(1, Math.max(0, (vh * .95 - r.top) / (vh * .45)));
      var pout = Math.min(1, Math.max(0, (r.bottom - vh * .36 - c.lab.offsetHeight * .5) / (vh * .22)));
      c.words.forEach(function(w){ set(w, pin, pout); });
    });
    free.forEach(function(w){
      var r = w.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      set(w, Math.min(1, Math.max(0, (vh - r.top) / (vh * .38))), Math.min(1, Math.max(0, r.bottom / (vh * .16))));
    });
    items.forEach(function(it){
      var box = it.firstElementChild, b = box.getBoundingClientRect();
      if(b.top < vh * .92 && !it.classList.contains("in")) it.classList.add("in");
      if(reduce || b.bottom < -10 || b.top > vh + 10) return;
      var t = Math.min(1, Math.max(0, (vh * .46 - b.bottom) / (vh * .32))), e = t * t * (3 - 2 * t);
      box.style.transform = e > 0 ? "scaleY(" + (1 - .985 * e).toFixed(4) + ")" : "";
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); window.addEventListener("load", onScroll); frame();
})();
/* portfolio, version three: the halo reel, ported from the React component. Card i sits at θ = i·step + rotation on an
   ellipse (rx, ry) anchored to one edge of the screen: x = rx·cosθ, y = ry·sinθ, scale = min + (1−min)(cosθ+1)/2, so one
   number places, sizes and stacks every card. The page's scroll lock is the rotation: one full turn per project. */
(function(){
  var holds = [].slice.call(document.querySelectorAll(".js-hr")); if(!holds.length) return;
  var TAU = Math.PI * 2, MIN = .4, RX = .45, RY = .36, SPREAD = 1.2, MAXC = 64, ticking = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rings = holds.map(function(h){
    var ring = h.querySelector(".js-hr-ring"), orig = [].slice.call(ring.children), stage = h.querySelector(".hr-stage");
    return { hold:h, stage:stage, ring:ring, orig:orig, cards:[], dir: h.classList.contains("left") ? -1 : 1, cw:+ring.dataset.w, ch:+ring.dataset.h, w:0, h:0, slots:0, step:0, rx:0, ry:0, fit:1, cue:h.querySelector(".js-hr-cue") };
  });
  function copyOf(fig){
    var c = fig.cloneNode(true), v = c.querySelector("video");
    if(v){ var im = document.createElement("img"); im.src = v.getAttribute("poster") || ""; im.alt = ""; im.loading = "lazy"; v.parentNode.replaceChild(im, v); }
    c.classList.add("hr-copy"); c.setAttribute("aria-hidden", "true"); c.removeAttribute("tabindex"); c.removeAttribute("role");
    c.addEventListener("click", function(){ fig.click(); });
    return c;
  }
  function measure(){
    var phone = window.innerWidth <= 820;
    rings.forEach(function(r){
      r.w = r.stage.offsetWidth; r.h = r.stage.offsetHeight;
      r.rx = r.w * (phone ? .5 : RX); r.ry = r.h * (phone ? .2 : RY);
      var n = r.orig.length;
      r.slots = Math.max(n, Math.min(Math.max(n, MAXC), Math.ceil(TAU * Math.max(r.rx / (r.cw * SPREAD), r.ry / (r.ch * SPREAD)))));
      r.step = TAU / r.slots;
      r.fit = Math.max(.45, Math.min(1, Math.min(r.w / (r.rx + r.cw), r.h / (2 * r.ry + r.ch))));
      if(phone) r.fit = Math.max(.45, Math.min(1, Math.min((r.w * .9) / (r.rx + r.cw), (r.h * .52) / (2 * r.ry + r.ch))));
      // fill the ring: the originals first, then copies until it holds the spacing
      while(r.ring.children.length < r.slots) r.ring.appendChild(copyOf(r.orig[r.ring.children.length % n]));
      while(r.ring.children.length > r.slots && r.ring.children.length > n) r.ring.removeChild(r.ring.lastElementChild);
      r.cards = [].slice.call(r.ring.children);
      var W = r.cw * r.fit, H = r.ch * r.fit;
      r.cards.forEach(function(c){ c.style.width = W + "px"; c.style.height = H + "px"; c.style.marginLeft = (-W / 2) + "px"; c.style.marginTop = (-H / 2) + "px"; });
      r.stage.style.setProperty("--lab", Math.round(r.rx + W / 2 + 24) + "px");
      r.stage.style.setProperty("--lab", (r.dir > 0 ? Math.round(r.rx + W / 2 + 24) : Math.round(r.rx + W / 2 + 24)) + "px");
    });
    frame();
  }
  function frame(){
    ticking = false; var vh = window.innerHeight;
    rings.forEach(function(r){
      var b = r.hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
      var run = Math.max(1, r.hold.offsetHeight - vh), p = reduce ? 0 : Math.min(1, Math.max(0, -b.top / run));
      var rot = -p * TAU * r.dir;
      r.cards.forEach(function(c, i){
        var th = i * r.step + rot, cos = Math.cos(th), sin = Math.sin(th);
        var x = r.dir * cos * r.rx, y = sin * r.ry, s = MIN + (1 - MIN) * ((cos + 1) / 2);
        c.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + s.toFixed(3) + ")";
        c.style.zIndex = Math.round(s * 1000);
      });
      if(r.cue) r.cue.textContent = p >= .99 ? "Full turn" : "Scroll to spin";
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", measure); window.addEventListener("load", measure); measure();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();
/* the type block: every word is split into letters inside a line mask; it rises when its block is in view and
   the letters roll on hover, the delay spreading from the letter under the pointer */
(function(){
  var words = [].slice.call(document.querySelectorAll(".ty2-stack span")); if(!words.length) return;
  words.forEach(function(w){
    var txt = w.textContent, inner = document.createElement("span"); inner.className = "ty2-in"; w.textContent = ""; w.setAttribute("aria-label", txt);
    var chars = txt.split("").map(function(ch, i){
      var c = document.createElement("span"); c.className = "ty2-c"; var a = document.createElement("span"), b = document.createElement("span");
      a.textContent = ch === " " ? "\u00a0" : ch; b.textContent = a.textContent; b.setAttribute("aria-hidden", "true"); c.appendChild(a); c.appendChild(b); inner.appendChild(c);
      c.addEventListener("mouseenter", function(){ chars.forEach(function(x, k){ x.style.setProperty("--d", Math.abs(k - i)); }); w.classList.add("roll"); });
      return c;
    });
    w.appendChild(inner);
    w.addEventListener("mouseleave", function(){ w.classList.remove("roll"); });
  });
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin:"0px 0px -20% 0px" });
    words.forEach(function(w){ if(!w.closest(".hz-type")) io.observe(w); });
  } else words.forEach(function(w){ w.classList.add("in"); });
})();
