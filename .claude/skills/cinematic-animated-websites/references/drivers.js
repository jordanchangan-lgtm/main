// Scroll drivers from the Latent site, version E. Plain JS, no library. Each IIFE finds its section by a js- class and
// does nothing when the section is absent, so any subset can ship.

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

/* the annotation labels never leave their picture: measured after layout, nudged back inside when they run past an edge */
(function(){
  var figs = [].slice.call(document.querySelectorAll(".wp-img")); if(!figs.length) return;
  function fit(){
    figs.forEach(function(f){
      var fr = f.getBoundingClientRect(); if(!fr.width) return;
      [].forEach.call(f.querySelectorAll(".an-lb"), function(l){
        l.style.marginLeft = "0px"; l.style.marginTop = "0px"; l.style.whiteSpace = ""; l.style.maxWidth = "";
        var r = l.getBoundingClientRect(), dx = 0, dy = 0, pad = 8;
        if(r.width > fr.width - pad * 2){ l.style.whiteSpace = "normal"; l.style.maxWidth = (fr.width - pad * 2).toFixed(0) + "px"; r = l.getBoundingClientRect(); }
        if(r.left < fr.left + pad) dx = fr.left + pad - r.left; else if(r.right > fr.right - pad) dx = fr.right - pad - r.right;
        if(r.top < fr.top + pad) dy = fr.top + pad - r.top; else if(r.bottom > fr.bottom - pad) dy = fr.bottom - pad - r.bottom;
        if(dx) l.style.marginLeft = dx.toFixed(1) + "px"; if(dy) l.style.marginTop = dy.toFixed(1) + "px";
      });
    });
  }
  window.addEventListener("resize", fit); window.addEventListener("load", fit); if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit); setTimeout(fit, 400); fit();
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
  var quote = sec.querySelector(".td-quote"); if(quote && !sec.querySelector(".td-pv")){ var pvEl = document.createElement("div"); pvEl.className = "td-pv"; pvEl.innerHTML = '<img alt="" decoding="async">'; quote.appendChild(pvEl); }
  function frame(){
    ticking = false; var vh = window.innerHeight, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    var run = Math.max(1, hold.offsetHeight - vh), p = Math.min(1, Math.max(0, -b.top / run)), i = Math.min(N - 1, Math.floor(p * N));
    if(i !== at){ at = i; items.forEach(function(it, k){ it.classList.toggle("on", k === i); });
      [].forEach.call(sec.querySelectorAll(".js-td-desc"), function(d, k){ d.classList.toggle("on", k === i); });
      var pv = sec.querySelector(".td-pv"), th = items[i].querySelector(".td-thumb"), ti = th && th.querySelector("img");
      if(pv && ti){ pv.querySelector("img").src = ti.getAttribute("src"); pv.style.setProperty("--ar", th.style.getPropertyValue("--ar") || "4/5"); pv.classList.remove("in"); void pv.offsetWidth; pv.classList.add("in"); }
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

/* the staircase: each picture opens from the right on a one-scroll window as it rises, smoothed; its sentence in the
   pinned list brightens word by word on the same window; both close as the picture leaves at the top */
(function(){
  var sec = document.querySelector(".js-sk"); if(!sec) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, running = false;
  var steps = [].slice.call(sec.querySelectorAll(".js-sk-step")).map(function(st){ var k = st.dataset.k, li = sec.querySelector('.js-sk-li[data-k="' + k + '"]'), w = li && li.querySelector(".js-sk-w"), n = 0;
    if(w){ var ws = w.textContent.trim().split(/\s+/); w.textContent = ""; ws.forEach(function(x, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = x; sp.style.setProperty("--i", i); w.appendChild(sp); if(i < ws.length - 1) w.appendChild(document.createTextNode(" ")); }); n = ws.length; }
    return { el: st, img: st.querySelector(".js-sk-img"), li: li, n: n, cur: 0, t: 0 }; });
  var ease = function(t){ return t * t * (3 - 2 * t); }, clamp = function(v){ return Math.min(1, Math.max(0, v)); };
  function targets(){ var vh = window.innerHeight; steps.forEach(function(o){ var r = o.el.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10){ o.t = r.top > vh ? 0 : o.t; return; }
    o.t = reduce ? 1 : clamp((vh * .9 - r.top) / (vh * .12)) * (1 - ease(clamp((vh * .22 - r.bottom) / (vh * .18)))); }); }
  function paint(){ var more = false;
    steps.forEach(function(o){ var d = o.t - o.cur; if(Math.abs(d) < .002){ if(o.cur !== o.t) o.cur = o.t; else return; } else { o.cur += d * .16; more = true; }
      var hide = ((1 - ease(o.cur)) * 100).toFixed(2) + "%"; o.img.style.clipPath = "inset(0 0 0 " + hide + " round clamp(10px,1vw,16px))"; o.img.classList.toggle("an-on", o.cur > .9);
      if(o.li) o.li.style.setProperty("--p", (o.cur * (o.n + 1)).toFixed(2)); });
    if(more) requestAnimationFrame(paint); else running = false; }
  function frame(){ ticking = false; targets(); if(!running){ running = true; requestAnimationFrame(paint); } }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); window.addEventListener("load", onScroll); frame();
})();

// missing: /* the things list: the thumbnails
