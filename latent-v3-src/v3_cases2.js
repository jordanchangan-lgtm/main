/* version two after the hero: the statement brightens word by word with the scroll; the blinds close from ink to ivory */
(function(){
  var line = document.querySelector(".js-bright"), blindsAll = [].slice.call(document.querySelectorAll(".js-blinds")), sec = document.querySelector(".js-st2"); if(!line && !blindsAll.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, words = [], ticking = false;
  if(line){ var ws = line.textContent.trim().split(/\s+/); line.textContent = "";
    ws.forEach(function(w, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = w; sp.style.setProperty("--i", i); line.appendChild(sp); if(i < ws.length - 1) line.appendChild(document.createTextNode(" ")); words.push(sp); }); }
  var sets = blindsAll.map(function(b){ return { el: b, slats: [].slice.call(b.children) }; });
  function frame(){
    ticking = false; var vh = window.innerHeight;
    if(line){ var st = sec.getBoundingClientRect(); var p = reduce ? 1 : Math.min(1, Math.max(0, -st.top / (vh * .52))); line.classList.toggle("on", reduce || st.top <= 1); var lr = line.getBoundingClientRect(); line.classList.toggle("out", !reduce && lr.bottom < vh * .15); line.style.setProperty("--p", (p * (words.length + 3)).toFixed(2)); }
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
    cards.forEach(function(c){ var b = c.getBoundingClientRect(); reveal(c, on ? (b.left < vw * .88 && b.right > 0) : (b.top < vh * .9 && b.bottom > 0)); c.classList.toggle("out", on ? (b.right < vw * .22 && b.right > -10) : (b.bottom < vh * .12 && b.bottom > -10)); });
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
    reveal.textContent = m === "grid" ? "[ Back to the list ]" : "[ Reveal full projects ]"; requestAnimationFrame(function(){ window.dispatchEvent(new Event("scroll")); });
    if(hint) hint.textContent = m === "grid" ? "Click any piece to open it full frame." : "Hover a project to see it. Click it to open all its pieces.";
  }
  var touch = window.matchMedia("(hover: none)").matches, tapped = -1;
  rows.forEach(function(r, k){
    r.addEventListener("mouseenter", function(){ if(!touch) show(k); }); r.addEventListener("focus", function(){ if(!touch) show(k); });
    r.addEventListener("click", function(e){ e.preventDefault(); if(touch && tapped !== k){ tapped = k; show(k); return; } setMode("grid"); var g = groups[k]; if(g) setTimeout(function(){ g.scrollIntoView({ behavior:"smooth", block:"start" }); }, 60); });
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
      if(b.top < vh * .92 && !it.classList.contains("in")) it.classList.add("in"); if(b.top > vh * 1.05) it.classList.remove("in");
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
      var rot = -p * TAU * r.dir, env = Math.min(1, p / .06) * (1 - Math.max(0, (p - .93) / .07)); env = env * env * (3 - 2 * env); if(reduce) env = 1;
      r.hold.classList.toggle("in", p > .01 && p < .96); r.hold.classList.toggle("gone", p >= .96);
      r.cards.forEach(function(c, i){
        var th = i * r.step + rot, cos = Math.cos(th), sin = Math.sin(th);
        var x = r.dir * cos * r.rx, y = sin * r.ry, s = MIN + (1 - MIN) * ((cos + 1) / 2);
        c.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + (s * env).toFixed(3) + ")";
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
  var words = [].slice.call(document.querySelectorAll(".ty2-stack > span")); if(!words.length) return;
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
  var tk = false;
  function tyFrame(){ tk = false; var vh = window.innerHeight, vw = window.innerWidth, hz = document.querySelector(".hz-on");
    words.forEach(function(w){ var b = w.getBoundingClientRect(); var horiz = hz && w.closest(".hz-track");
      w.classList.toggle("out", horiz ? (b.right < vw * .2 && b.right > -10) : (b.bottom < vh * .1 && b.bottom > -10));
      if(!w.closest(".hz-type")){ if(b.top > vh * 1.05) w.classList.remove("in"); else if(b.top < vh * .9) w.classList.add("in"); } }); }
  window.addEventListener("scroll", function(){ if(!tk){ tk = true; requestAnimationFrame(tyFrame); } }, { passive:true }); tyFrame();
})();
/* every revealed thing goes both ways: it rises when scrolled to, lifts out as it leaves at the top, and resets
   below the screen so it plays again on the way back. Inside the pinned horizontal track the axis is horizontal. */
(function(){
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; if(reduce) return;
  var els = [].slice.call(document.querySelectorAll(".rv")).filter(function(el){ return !el.closest(".js-lk") && !el.closest(".ty2-stack"); }).map(function(el){ return { el: el, track: !!el.closest(".hz-track") }; });
  if(!els.length) return; var ticking = false;
  function frame(){
    ticking = false; var vh = window.innerHeight, vw = window.innerWidth, hzOn = !!document.querySelector(".hz-on");
    els.forEach(function(o){
      var el = o.el; if(el.offsetParent === null && getComputedStyle(el).position !== "fixed") return;
      var b = el.getBoundingClientRect();
      if(o.track && hzOn){
        if(b.left > vw * 1.05 || b.top > vh * 1.05){ el.classList.remove("in"); el.classList.remove("out"); return; }
        if(b.left < vw * .92) el.classList.add("in");
        el.classList.toggle("out", b.right < vw * .18 && b.right > -10);
      } else {
        if(b.top > vh * 1.05){ el.classList.remove("in"); el.classList.remove("out"); return; }
        if(b.top < vh * .92) el.classList.add("in");
        el.classList.toggle("out", b.bottom < vh * .1 && b.bottom > -10);
      }
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); window.addEventListener("load", onScroll); setTimeout(frame, 300);
})();
/* How it works, version three: the text-rotate demo. The page scroll moves the pictures past the centre of the left
   half; whenever a new one is nearest, the kicker, the word and the line rotate: the old characters leave upward with a
   5 ms stagger, then the new ones rise in from 50 px below (mode "wait", spring with no bounce, .6 s). */
(function(){
  var sec = document.querySelector(".js-tr"); if(!sec) return;
  var hold = sec.querySelector(".js-tr-hold"), col = sec.querySelector(".js-tr-col"), items = [].slice.call(col.children),
      kick = sec.querySelector(".js-tr-kick"), word = sec.querySelector(".js-tr-word"), line = sec.querySelector(".js-tr-line"),
      idxEl = sec.querySelector(".js-tr-idx"), cue = sec.querySelector(".js-tr-cue"), steps = JSON.parse(sec.dataset.steps || "[]"), N = items.length;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, cur = -1, timers = {};
  function seg(t){ if(typeof Intl !== "undefined" && "Segmenter" in Intl){ var s = new Intl.Segmenter("en", { granularity:"grapheme" }); return Array.from(s.segment(t), function(x){ return x.segment; }); } return Array.from(t); }
  function build(text, by){
    var now = document.createElement("span"); now.className = "tr-now"; var n = 0, ws = text.split(" ");
    ws.forEach(function(w, wi){
      var m = document.createElement("span"); m.className = "tr-w";
      (by === "words" ? [w] : seg(w)).forEach(function(ch){ var c = document.createElement("span"); c.textContent = ch; c.style.setProperty("--d", (n * (by === "words" ? .03 : .005)).toFixed(3)); n++; m.appendChild(c); });
      now.appendChild(m); if(wi < ws.length - 1){ var sp = document.createElement("span"); sp.className = "tr-sp"; sp.textContent = " "; now.appendChild(sp); }
    });
    return now;
  }
  function rotate(el, text, by){
    var key = el.className; if(timers[key]) clearTimeout(timers[key]);
    var old = el.querySelector(".tr-now:not(.leave)");
    [].forEach.call(el.querySelectorAll(".tr-now.leave"), function(x){ x.remove(); });
    var enter = function(){
      var now = build(text, by); now.classList.add("pre"); el.appendChild(now);
      if(reduce){ now.classList.remove("pre"); return; }
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ now.classList.remove("pre"); }); });
    };
    if(old && !reduce){ old.classList.add("leave"); timers[key] = setTimeout(function(){ old.remove(); enter(); }, 320); }
    else { if(old) old.remove(); enter(); }
  }
  function show(i){
    if(i === cur) return; cur = i; var s = steps[i] || {};
    rotate(kick, "( " + s.n + " ) Step " + s.n + " of " + (N < 10 ? ["zero","one","two","three","four","five","six","seven","eight","nine"][N] : N), "chars");
    rotate(word, s.w || "", "chars"); rotate(line, s.t || "", "words");
    if(idxEl) idxEl.textContent = s.n || ""; if(cue) cue.textContent = i === N - 1 ? "Last step" : "Scroll";
  }
  function frame(){
    ticking = false; var vh = window.innerHeight, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    var run = Math.max(1, hold.offsetHeight - vh), p = Math.min(1, Math.max(0, -b.top / run)), f = p * (N - 1);
    var itemH = items[0].offsetHeight || vh;
    if(!reduce) col.style.transform = "translate3d(0," + (-f * itemH).toFixed(1) + "px,0)";
    items.forEach(function(it, i){ var d = Math.min(1, Math.abs(i - f)); var im = it.firstElementChild; im.style.transform = "scale(" + (1 - .22 * d).toFixed(3) + ")"; im.style.opacity = (1 - .6 * d).toFixed(3); });
    hold.classList.toggle("in", b.top < vh * .6 && p < .999 || (p >= .999 && b.bottom > vh * .55)); hold.classList.toggle("gone", p >= .999 && b.bottom <= vh * .55);
    show(Math.round(f));
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); window.addEventListener("load", onScroll); frame();
})();
/* How it works, version four: one locked stage. The scroll runs through the steps in turn: the previous pair leaves
   (picture closing back to the left, words dimming), the picture opens widthwise from the left, then the sentence
   appears word by word; the page cannot move on until the last word is there. */
(function(){
  var sec = document.querySelector(".js-sq"); if(!sec) return;
  var hold = sec.querySelector(".js-sq-hold"), steps = [].slice.call(sec.querySelectorAll(".js-sq-step")), N = steps.length;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false;
  var S = steps.map(function(st){
    var txt = st.querySelector(".js-sq-txt"), ws = txt.textContent.trim().split(/\s+/), spans = []; txt.textContent = "";
    ws.forEach(function(w, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = w; sp.style.setProperty("--i", i); txt.appendChild(sp); if(i < ws.length - 1) txt.appendChild(document.createTextNode(" ")); spans.push(sp); });
    return { el: st, img: st.querySelector(".js-sq-img"), txt: txt, n: ws.length };
  });
  var ease = function(t){ return t * t * (3 - 2 * t); }, clamp = function(v){ return Math.min(1, Math.max(0, v)); };
  function frame(){
    ticking = false; var vh = window.innerHeight, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    var run = Math.max(1, hold.offsetHeight - vh), p = reduce ? 1 : clamp(-b.top / run), f = p * N;
    S.forEach(function(s, i){
      var local = f - i;                          // 0 at the start of this step, 1 at its end
      var on = reduce || (local > -0.001 && local < 1.16);
      s.el.classList.toggle("on", on); if(!on && !reduce) return;
      if(reduce){ s.img.style.clipPath = "none"; s.txt.style.setProperty("--p", s.n + 2); return; }
      var open = ease(clamp(local / .32));                                   // the picture opens over the first third
      var words = clamp((local - .34) / .62);                                // the words arrive over the rest
      var leave = i < N - 1 ? ease(clamp((local - 1) / .16)) : 0;           // then the pair leaves as the next step starts
      var w = open * (1 - leave);
      s.img.style.clipPath = "inset(0 " + ((1 - w) * 100).toFixed(2) + "% 0 0 round clamp(10px,1vw,16px))";
      s.txt.style.setProperty("--p", (words * (s.n + 1)).toFixed(2)); s.txt.style.opacity = Math.min(1 - leave, clamp((local - .3) / .05)).toFixed(3);
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); window.addEventListener("load", onScroll); frame();
})();
/* How it works, version five: the picture opens widthwise from its own side as the page scrolls, on a window short
   enough that one scroll reveals it whole, smoothed frame to frame so it plays as one wipe; it closes back the same
   way as it leaves at the top. The sentence beside it brightens word by word on the same window. */
(function(){
  var sec = document.querySelector(".js-wp"); if(!sec) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, running = false;
  var imgs = [].slice.call(sec.querySelectorAll(".js-wp-img")).map(function(im){ return { el: im, left: im.closest(".wp-step").classList.contains("left"), cur: 0, t: 0 }; });
  var txts = [].slice.call(sec.querySelectorAll(".js-wp-txt")).map(function(t){
    var ws = t.textContent.trim().split(/\s+/); t.textContent = "";
    ws.forEach(function(w, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = w; sp.style.setProperty("--i", i); t.appendChild(sp); if(i < ws.length - 1) t.appendChild(document.createTextNode(" ")); });
    return { el: t, n: ws.length, cur: 0, t: 0, q: 1 };
  });
  var ease = function(t){ return t * t * (3 - 2 * t); }, clamp = function(v){ return Math.min(1, Math.max(0, v)); };
  function targets(){
    var vh = window.innerHeight;
    imgs.forEach(function(o){ var r = o.el.closest(".wp-step").getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      o.t = reduce ? 1 : clamp((vh * .92 - r.top) / (vh * .1)) * (1 - ease(clamp((vh * .2 - r.bottom) / (vh * .18)))); });
    txts.forEach(function(t){ var r = t.el.closest(".wp-step").getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      t.t = reduce ? 1 : clamp((vh * .92 - r.top) / (vh * .12)); t.q = reduce ? 1 : clamp(r.bottom / (vh * .16)); t.el.style.setProperty("--q", t.q.toFixed(3)); });
  }
  function paint(){
    var more = false;
    imgs.forEach(function(o){ var d = o.t - o.cur; if(Math.abs(d) < .002){ if(o.cur !== o.t){ o.cur = o.t; } else return; } else { o.cur += d * .16; more = true; }
      var hide = ((1 - ease(o.cur)) * 100).toFixed(2) + "%";
      o.el.style.clipPath = o.left ? "inset(0 " + hide + " 0 0 round clamp(10px,1vw,16px))" : "inset(0 0 0 " + hide + " round clamp(10px,1vw,16px))";
      o.el.classList.toggle("an-on", o.cur > .9); });
    txts.forEach(function(t){ var d = t.t - t.cur; if(Math.abs(d) < .002){ if(t.cur !== t.t) t.cur = t.t; else return; } else { t.cur += d * .16; more = true; }
      t.el.style.setProperty("--p", (t.cur * (t.n + 1)).toFixed(2)); });
    if(more) requestAnimationFrame(paint); else running = false;
  }
  function frame(){ ticking = false; targets(); if(!running){ running = true; requestAnimationFrame(paint); } }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); window.addEventListener("load", onScroll); frame();
})();
/* the four moves, version two: the nearest move to the reading line is the active one; the sticky card swaps its
   picture and colour to match (after Aceternity's sticky scroll reveal) */
(function(){
  var sec = document.querySelector(".js-ss"); if(!sec) return;
  var steps = [].slice.call(sec.querySelectorAll(".js-ss-step")), card = sec.querySelector(".js-ss-card"), imgs = [].slice.call(card.querySelectorAll("img")),
      cap = sec.querySelector(".js-ss-cap"), cap2 = sec.querySelector(".js-ss-cap2"), tabs = [].slice.call(sec.querySelectorAll(".js-ss-tab")), ticking = false, at = -1;
  var COL = ["var(--ink)", "var(--marrow)", "#2A2A31", "var(--band)"], CAPS = ["Mark · construction", "Mark · in the world", "Mark · on the plate", "Mark · shipped"];
  function show(i){
    if(i === at) return; at = i;
    steps.forEach(function(s, k){ s.classList.toggle("on", k === i); }); imgs.forEach(function(im){ im.classList.toggle("on", +im.dataset.i === i); });
    tabs.forEach(function(t, k){ t.classList.toggle("on", k === i); });
    card.style.setProperty("--c", COL[i % COL.length]); if(cap) cap.textContent = steps[i].querySelector(".ss-t").textContent; if(cap2) cap2.textContent = CAPS[i] || "";
  }
  function frame(){
    ticking = false; var vh = window.innerHeight, line = vh * .42, best = 0, bd = 1e9;
    steps.forEach(function(s, k){ var r = s.getBoundingClientRect(), c = (r.top + r.bottom) / 2, d = Math.abs(c - line); if(d < bd){ bd = d; best = k; } });
    show(best);
  }
  tabs.forEach(function(t, k){ t.addEventListener("click", function(){ steps[k].scrollIntoView({ behavior:"smooth", block:"center" }); }); });
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true }); window.addEventListener("resize", frame); frame();
})();
/* portfolio, version four: the white path mechanism. The lead piece opens widthwise from its side as it rises and
   closes back as it leaves; the name and line brighten word by word; the strip below wipes in piece by piece. */
(function(){
  var sec = document.querySelector(".js-pb"); if(!sec) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false;
  var leads = [].slice.call(sec.querySelectorAll(".js-pb-lead")).map(function(el){ return { el: el, left: el.closest(".pb-row").classList.contains("left"), v: el.querySelector("video") }; });
  var thumbs = [].slice.call(sec.querySelectorAll(".js-pb-th"));
  var texts = [].slice.call(sec.querySelectorAll(".js-pb-name, .js-pb-line")).map(function(t){
    var ws = t.textContent.trim().split(/\s+/); t.textContent = "";
    ws.forEach(function(w, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = w; sp.style.setProperty("--i", i); t.appendChild(sp); if(i < ws.length - 1) t.appendChild(document.createTextNode(" ")); });
    return { el: t, n: ws.length };
  });
  var ease = function(t){ return t * t * (3 - 2 * t); }, clamp = function(v){ return Math.min(1, Math.max(0, v)); };
  function frame(){
    ticking = false; var vh = window.innerHeight;
    leads.forEach(function(o){
      var r = o.el.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10){ if(o.v && !o.v.paused) o.v.pause(); return; }
      var open = reduce ? 1 : ease(clamp((vh * .9 - r.top) / (vh * .34))) * (1 - ease(clamp((vh * .2 - r.bottom) / (vh * .2))));
      var hide = ((1 - open) * 100).toFixed(2) + "%";
      o.el.style.clipPath = o.left ? "inset(0 " + hide + " 0 0 round clamp(10px,1vw,16px))" : "inset(0 0 0 " + hide + " round clamp(10px,1vw,16px))";
      if(o.v){ if(open > .5 && o.v.paused){ var pr = o.v.play(); if(pr && pr.catch) pr.catch(function(){}); } else if(open <= .5 && !o.v.paused) o.v.pause(); }
    });
    thumbs.forEach(function(t){ var r = t.getBoundingClientRect(); if(r.top > vh * 1.05) t.classList.remove("in"); else if(r.top < vh * .92) t.classList.add("in"); });
    texts.forEach(function(t){
      var r = t.el.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      var p = reduce ? 1 : clamp((vh * .9 - r.top) / (vh * .42)), q = reduce ? 1 : clamp(r.bottom / (vh * .16));
      t.el.style.setProperty("--p", (p * (t.n + 1)).toFixed(2)); t.el.style.setProperty("--q", q.toFixed(3));
    });
  }
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true }); window.addEventListener("resize", frame); window.addEventListener("load", frame); frame();
})();
/* the price list: on touch screens a tap opens the row's items first, a second tap follows the link */
(function(){
  var rows = [].slice.call(document.querySelectorAll(".pq-row")); if(!rows.length) return;
  var touch = window.matchMedia("(hover: none)").matches; if(!touch) return;
  rows.forEach(function(r){ r.addEventListener("click", function(e){ if(!r.classList.contains("open")){ e.preventDefault(); rows.forEach(function(x){ x.classList.remove("open"); }); r.classList.add("open"); } }); });
})();
/* the annotation labels never leave their picture: measured after layout, nudged back inside when they run past an edge */
(function(){
  var figs = [].slice.call(document.querySelectorAll(".wp-img")); if(!figs.length) return;
  function fit(){
    figs.forEach(function(f){
      var fr = f.getBoundingClientRect(); if(!fr.width) return;
      [].forEach.call(f.querySelectorAll(".an-lb"), function(l){
        l.style.marginLeft = "0px"; l.style.marginTop = "0px";
        var r = l.getBoundingClientRect(), dx = 0, dy = 0, pad = 8;
        if(r.left < fr.left + pad) dx = fr.left + pad - r.left; else if(r.right > fr.right - pad) dx = fr.right - pad - r.right;
        if(r.top < fr.top + pad) dy = fr.top + pad - r.top; else if(r.bottom > fr.bottom - pad) dy = fr.bottom - pad - r.bottom;
        if(dx) l.style.marginLeft = dx.toFixed(1) + "px"; if(dy) l.style.marginTop = dy.toFixed(1) + "px";
      });
    });
  }
  window.addEventListener("resize", fit); window.addEventListener("load", fit); if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit); setTimeout(fit, 400); fit();
})();
/* prices, version five: the giant sentence. One line wider than the screen, moved right to left by the page scroll;
   each letter carries its own vertical offset and settles onto the baseline as it crosses the screen. */
(function(){
  var sec = document.querySelector(".js-gs"); if(!sec) return;
  var hold = sec.querySelector(".js-gs-hold"), line = sec.querySelector(".js-gs-line"), reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, seed = 5;
  function rnd(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  var text = line.textContent, key = "Let’s generate", ki = text.indexOf(key); line.textContent = "";
  var chars = [];
  text.split(" ").forEach(function(w, wi, arr){
    var word = document.createElement("span"); word.className = "gw";
    var start = text.indexOf(w, wi ? undefined : 0);
    Array.from(w).forEach(function(ch){ var c = document.createElement("span"); c.className = "gc"; c.textContent = ch; c.dataset.r = ((rnd() - .5) * .9).toFixed(3); word.appendChild(c); chars.push(c); });
    if(ki >= 0 && (w.indexOf("Let") === 0 || w.indexOf("generate") === 0)) word.classList.add("gk");
    line.appendChild(word); if(wi < arr.length - 1) line.appendChild(document.createTextNode(" "));
  });
  var W = 0;
  function measure(){ W = line.scrollWidth; if(!reduce) hold.style.height = (window.innerHeight + W * 1.05 + window.innerWidth * .6) + "px"; frame(); }
  function frame(){
    ticking = false; if(reduce) return; var vh = window.innerHeight, vw = window.innerWidth, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    var run = Math.max(1, hold.offsetHeight - vh), p = Math.min(1, Math.max(0, -b.top / run));
    var x0 = vw * .96, x1 = vw * .92 - W, x = x0 + (x1 - x0) * p;
    line.style.transform = "translate3d(" + x.toFixed(1) + "px,-50%,0)";
    var fs = parseFloat(getComputedStyle(line).fontSize);
    chars.forEach(function(c){
      var cx = x + c.offsetLeft, t = Math.min(1, Math.max(0, (vw * .78 - cx) / (vw * .38))), e = t * t * (3 - 2 * t);
      c.style.transform = "translate3d(0," + ((1 - e) * parseFloat(c.dataset.r) * fs).toFixed(1) + "px,0)";
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", measure); window.addEventListener("load", measure); if(document.fonts && document.fonts.ready) document.fonts.ready.then(measure); measure();
})();
/* the four moves, version four: we close that gap, on the flowing dark run. Each move sits in the page and plays
   as it rises through the screen: the right words come in from the right, the left words from the left, the picture
   opens between them while the line sits mid-screen, the description shows, then the picture squeezes shut and the
   words close the gap as the line leaves at the top. Scrolling back replays it in reverse. */
(function(){
  var sec = document.querySelector(".js-gp"); if(!sec) return;
  var lines = [].slice.call(sec.querySelectorAll(".js-gp-line")), reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false;
  var L = lines.map(function(l){ return { el: l, a: l.querySelector(".gp-l"), b: l.querySelector(".gp-r"), t: l.querySelector(".gp-tile"), row: l.querySelector(".gp-row"), img: l.querySelector(".gp-tile img") }; });
  var ease = function(t){ return t * t * (3 - 2 * t); }, clamp = function(v){ return Math.min(1, Math.max(0, v)); };
  function frame(){
    ticking = false; if(reduce) return; var vh = window.innerHeight, vw = window.innerWidth;
    L.forEach(function(o){
      var r = o.el.getBoundingClientRect(); if(o.img && r.top < vh * 2.5 && o.img.loading !== "eager") o.img.loading = "eager";
      if(r.bottom < -10 || r.top > vh + 10) return;
      var a = clamp((vh * .92 - r.top) / (vh * .5)), e = clamp((vh * .42 - r.bottom) / (vh * .3));
      var inR = ease(clamp(a / .55)), inL = ease(clamp((a - .12) / .55)), open = ease(clamp((a - .5) / .5)) * (1 - ease(e));
      var fs = parseFloat(getComputedStyle(o.row).fontSize), tileW = fs * 2.0 * open;
      o.b.style.transform = "translate3d(" + ((1 - inR) * vw * .7).toFixed(1) + "px,0,0)";
      o.a.style.transform = "translate3d(" + (-(1 - inL) * vw * .7).toFixed(1) + "px,0,0)";
      o.t.style.width = tileW.toFixed(1) + "px";
      o.el.classList.toggle("told", a > .7 && e < .35);
      o.el.style.opacity = (1 - ease(clamp((e - .5) / .5))).toFixed(3);
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", frame); window.addEventListener("load", frame); frame();
})();
/* things we make: one bright at a time as the page scrolls the pinned list */
(function(){
  var sec = document.querySelector(".js-td"); if(!sec) return;
  var hold = sec.querySelector(".js-td-hold"), items = [].slice.call(sec.querySelectorAll(".js-td-item")), N = items.length, ticking = false, at = -1;
  function frame(){
    ticking = false; var vh = window.innerHeight, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    var run = Math.max(1, hold.offsetHeight - vh), p = Math.min(1, Math.max(0, -b.top / run)), i = Math.min(N - 1, Math.floor(p * N));
    if(i !== at){ at = i; items.forEach(function(it, k){ it.classList.toggle("on", k === i); });
      [].forEach.call(sec.querySelectorAll(".js-td-desc"), function(d, k){ d.classList.toggle("on", k === i); });
      var list = items[i].parentNode, st = list.parentNode.getBoundingClientRect(), it = items[i], c = it.offsetTop + it.offsetHeight / 2;
      list.style.transform = window.innerWidth > 820 ? "translate3d(0," + (list.offsetHeight / 2 - c).toFixed(1) + "px,0)" : "none"; }
  }
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true }); window.addEventListener("resize", frame); frame();
})();
/* hero lines rise word by word through line masks, the same move as the type block */
(function(){
  var els = [].slice.call(document.querySelectorAll(".hero .js-pu2")); if(!els.length) return;
  function mask(node, w){ var m = document.createElement("span"); m.className = "hm"; var i = document.createElement("span"); i.className = "hm-in"; i.style.setProperty("--w", w); m.appendChild(i); node.parentNode.insertBefore(m, node); i.appendChild(node); return m; }
  els.forEach(function(el){
    var w = 0, nodes = [];
    (function walk(n){ [].slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType === 3){ if(c.textContent.trim()) nodes.push(c); }
      else if(c.nodeType === 1){ if(c.tagName === "BR") return; if(c.classList.contains("cyc") || c.classList.contains("logo") || c.id === "clock"){ nodes.push(c); return; } walk(c); } }); })(el);
    nodes.forEach(function(n){
      if(n.nodeType === 1){ mask(n, w++); return; }
      var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
      parts.forEach(function(p){ if(!p) return; if(/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(" ")); return; } var t = document.createTextNode(p); frag.appendChild(t); mask(t, w++).parentNode; });
      n.parentNode.replaceChild(frag, n);
    });
    if(el.classList.contains("in")){ el.classList.remove("in"); void el.offsetWidth; requestAnimationFrame(function(){ el.classList.add("in"); }); }
  });
})();
/* the composer: the button opens the email; whatever was typed goes into the body */
(function(){
  var box = document.querySelector(".js-cb-box"); if(!box) return;
  var idea = box.querySelector(".js-cb-idea"), base = box.getAttribute("action");
  function go(){ var t = (idea && idea.value || "").trim(); var href = base + (t ? encodeURIComponent(t + "\n\n") : "") + encodeURIComponent("Please send me the price list.\n\nThanks,\n"); window.location.href = href; }
  box.addEventListener("submit", function(e){ e.preventDefault(); go(); });
  if(idea) idea.addEventListener("keydown", function(e){ if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); go(); } });
})();
