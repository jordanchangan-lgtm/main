/* our work: the ledger. A plain-JS port of the Pigment Experience Ledger: a wash of pigment painted on a small canvas
   behind the row you point at, drifting after the pointer, kept by the open row, dried behind the closed ones. The
   stroke's length comes from the years, its dryness from how long ago the work ended. One row open at a time. */
(function(){
  var root = document.querySelector(".js-pel"); if(!root) return;
  var CORE = [187,74,46], BODY = [212,99,63], EDGE = [240,180,140], STRENGTH = .82, RESIDUE = .2, NOW = new Date().getFullYear(), BLEED = 64, BLEED_X = 40, MAX_W = 600;
  function clamp(v, lo, hi){ return v < lo ? lo : v > hi ? hi : v; }
  function smooth(a, b, x){ var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function hash2(x, y, seed){ var h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2246822519)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  function vnoise(x, y, seed){ var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), a = hash2(ix, iy, seed), b = hash2(ix + 1, iy, seed), c = hash2(ix, iy + 1, seed), d = hash2(ix + 1, iy + 1, seed); return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy; }
  function rampAt(edge, body, core, t){ var u = clamp(t, 0, 1), a = u < .5 ? edge : body, b = u < .5 ? body : core, k = u < .5 ? u * 2 : (u - .5) * 2; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function tenure(y){ var m = y.match(/(\d{4})\D+(\d{4}|now|present)/i); if(m){ var st = +m[1], en = /^\d{4}$/.test(m[2]) ? +m[2] : NOW; return { end: en, length: Math.max(.5, en - st) }; } var one = y.match(/\d{4}/); return one ? { end: +one[0], length: .5 } : null; }
  function makeBlobs(seed){ var r = function(i){ return hash2(i, 7, seed); }, out = []; for(var i = 0; i < 7; i++) out.push({ ox: -1 + (2 * i) / 6 + (r(i) - .5) * .22, oy: (r(i + 20) - .5) * .9, r: .72 + r(i + 40) * .36 - Math.abs(i - 3) * .05, w: .8 + r(i + 60) * .45 + (i === 3 ? .25 : 0), ph: r(i + 80) * 6.28, sp: .18 + r(i + 100) * .34 }); return out; }
  var rows = [].slice.call(root.querySelectorAll(".js-pel-row")), reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches, openIndex = 0, hovered = null, focused = null, visible = true;
  var S = rows.map(function(li, i){
    var seed = i * 7919 + 101, t = tenure(li.dataset.years || "") ;
    return { li: li, canvas: li.querySelector(".js-pel-ink"), name: li.querySelector(".js-pel-name"), trig: li.querySelector(".js-pel-trigger"), ctx: null, img: null, noise: null, hue: null, low: null, grain: null, bw: 0, bh: 0, cssW: 0, cssH: 0, headH: 0, homeX: 0, homeY: 0, bleedX: BLEED_X, nameW: 0, nameTop: 0, nameH: 0,
      reach: t ? clamp(.34 + t.length * .07, .38, .7) : .5, dry: t ? clamp((NOW - t.end) / 12, 0, .6) : 0, dim: 1, dimTarget: 1, lastActive: 0, level: 0, target: 0, cx: 0, cy: 0, tx: 0, ty: 0, pointer: false, blobs: makeBlobs(seed), seed: seed, painted: false };
  });
  function homeOf(s){ return [s.homeX ? s.bleedX + s.homeX : s.cssW * .6, BLEED + (s.homeY || s.headH * .5)]; }
  function sizeSmear(s, w, h, headH){
    s.cssW = w + s.bleedX * 2; s.cssH = h + BLEED * 2; s.headH = headH || h;
    var scale = clamp(s.cssW / MAX_W, 1.5, 3), bw = Math.max(8, Math.round(s.cssW / scale)), bh = Math.max(8, Math.round((s.cssH / s.cssW) * bw));
    s.canvas.style.left = -s.bleedX + "px"; s.canvas.style.width = "calc(100% + " + s.bleedX * 2 + "px)";
    if(bw === s.bw && bh === s.bh && s.img) return;
    s.bw = bw; s.bh = bh; s.canvas.width = bw; s.canvas.height = bh; s.ctx = s.canvas.getContext("2d"); s.img = s.ctx ? s.ctx.createImageData(bw, bh) : null;
    var n = bw * bh; s.noise = new Float32Array(n); s.hue = new Float32Array(n); s.low = new Float32Array(n); s.grain = new Float32Array(n); var u = scale / 3;
    for(var y = 0; y < bh; y++) for(var x = 0; x < bw; x++){ var i = y * bw + x, X = x * u, Y = y * u;
      s.noise[i] = .55 * vnoise(X / 11, Y / 8, s.seed) + .3 * vnoise(X / 4, Y / 4, s.seed + 11) + .15 * vnoise(X / 1.6, Y / 1.6, s.seed + 17);
      s.hue[i] = vnoise((.8 * X + .6 * Y) / 20, (.8 * Y - .6 * X) / 20, s.seed + 31); s.low[i] = vnoise(X / 40, Y / 40, s.seed + 41); s.grain[i] = hash2(x, y, s.seed + 23); }
    s.painted = false;
  }
  function paint(s, time, strength){
    var ctx = s.ctx, img = s.img; if(!ctx || !img) return; var data = img.data; data.fill(0); var level = s.level;
    if(level > .002){
      var bw = s.bw, bh = s.bh, sc = s.cssW / bw, grow = 1 - Math.pow(1 - clamp(level, 0, 1), 3), narrow = s.cssW < 560;
      var span = clamp((s.nameW || s.cssW * .3) * s.reach, 60, 320) * (.5 + .5 * grow), R = clamp(s.headH * (narrow ? .95 : 1.12), 70, 200) * (.55 + .45 * grow), dry = s.dry;
      var fade = smooth(0, .35, level) * strength * (1 - dry * .45), tooth = .76 + dry * .6, n = s.blobs.length, bx = new Float32Array(n), by = new Float32Array(n), br = new Float32Array(n), x0 = bw, x1 = 0, y0 = bh, y1 = 0, SQ = 1.65;
      for(var k = 0; k < n; k++){ var b = s.blobs[k], px = s.cx + b.ox * span + Math.sin(time * b.sp + b.ph) * R * .12, py = s.cy + b.oy * R * .4 + Math.cos(time * b.sp * .8 + b.ph) * R * .06, rr = (b.r * R) / sc;
        bx[k] = px / sc; by[k] = py / sc; br[k] = rr * rr; x0 = Math.min(x0, bx[k] - rr); x1 = Math.max(x1, bx[k] + rr); y0 = Math.min(y0, by[k] - rr / SQ); y1 = Math.max(y1, by[k] + rr / SQ); }
      var xs = Math.max(0, Math.floor(x0)), xe = Math.min(bw - 1, Math.ceil(x1)), ys = Math.max(0, Math.floor(y0)), ye = Math.min(bh - 1, Math.ceil(y1));
      var bandTop = s.nameH ? s.nameTop - s.nameH * .3 : 0, bandBottom = s.nameH ? s.nameTop + s.nameH * 1.02 : s.headH - 6, top = (BLEED + Math.max(0, bandTop)) / sc, bottom = (BLEED + bandBottom) / sc, feather = Math.min(36, (bandBottom - bandTop) * .4) / sc, side = Math.max(s.bleedX - 4, 28) / sc;
      for(var y = ys; y <= ye; y++){ var env = smooth(top, top + feather, y) * (1 - smooth(bottom - feather, bottom, y)); if(env <= 0) continue;
        for(var x = xs; x <= xe; x++){ var f = 0;
          for(k = 0; k < n; k++){ var dx = x - bx[k], dy = (y - by[k]) * SQ, d2 = dx * dx + dy * dy; if(d2 < br[k]){ var q = 1 - d2 / br[k]; f += q * q * s.blobs[k].w; } }
          f *= env * smooth(0, side, x) * (1 - smooth(bw - 1 - side, bw - 1, x)); if(f < .04) continue;
          var i = y * bw + x, fe = f * (1 - tooth / 2 + tooth * s.noise[i]) + (s.low[i] - .5) * .24, wash = smooth(.2, .6, fe), rim = smooth(.2, .3, fe) * (1 - smooth(.3, .5, fe));
          var depth = clamp(smooth(.3, 1.55, fe) + (s.hue[i] - .5) * .6 + rim * (.55 + dry * .4), 0, 1), c = rampAt(EDGE, BODY, CORE, depth);
          if(dry > 0){ var grey = c[0] * .3 + c[1] * .59 + c[2] * .11; for(var j = 0; j < 3; j++) c[j] += (grey - c[j]) * dry * .15; }
          var g = s.grain[i], shade = 1 - rim * (.07 + dry * .2) + (g - .5) * .05, a = (wash * (.86 + .14 * depth) + rim * .1) * (.9 + .1 * g * (1 + dry)) * fade, p = i * 4;
          data[p] = c[0] * shade; data[p + 1] = c[1] * shade; data[p + 2] = c[2] * shade; data[p + 3] = a > 1 ? 255 : a * 255; } }
    }
    ctx.putImageData(img, 0, 0); s.painted = level > .002;
  }
  var raf = 0, last = 0, frame = 0, clock = 0;
  function kick(){ if(raf) return; raf = requestAnimationFrame(tick); }
  function tick(now){
    raf = 0; var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now; frame++; var alive = false, moving = false, breathing = false;
    S.forEach(function(s){ if(!s.ctx) return; var pl = s.level, px = s.cx, py = s.cy;
      if(reduced){ if(s.dim !== s.dimTarget) s.painted = false; s.dim = s.dimTarget; s.level = s.target; s.cx = s.tx; s.cy = s.ty; }
      else { var tau = s.target > s.level ? .3 : .2; s.level += (s.target - s.level) * (1 - Math.exp(-dt / tau)); if(Math.abs(s.target - s.level) < .002) s.level = s.target;
        var pd = s.dim; s.dim += (s.dimTarget - s.dim) * (1 - Math.exp(-dt / .2)); if(Math.abs(s.dimTarget - s.dim) < .002) s.dim = s.dimTarget; if(s.dim !== pd) s.painted = false;
        var kk = 1 - Math.exp(-dt / .26); s.cx += (s.tx - s.cx) * kk; s.cy += (s.ty - s.cy) * kk; }
      var changed = Math.abs(s.level - pl) > 1e-4 || Math.abs(s.cx - px) > .05 || Math.abs(s.cy - py) > .05; if(changed) moving = true;
      var active = s.level > .002 || s.target > 0, breathes = active && !reduced && now - s.lastActive < 3000; if(breathes) breathing = true; if(active) alive = true;
      if(active || s.painted){ if(changed || !s.painted || (breathes && frame % 2 === 0) || !active) paint(s, clock, STRENGTH * s.dim); } });
    if(breathing) clock += dt; if(visible && alive && (moving || breathing)) raf = requestAnimationFrame(tick); else last = 0;
  }
  function setTargets(){
    S.forEach(function(s, i){ var pointed = i === hovered || i === focused, elsewhere = (hovered !== null && hovered !== i) || (focused !== null && focused !== i), open = i === openIndex;
      var rest = Math.min(.5, RESIDUE * (.55 + s.dry * .75)), next = pointed || open ? 1 : RESIDUE > 0 ? .75 : 0, dim = pointed ? 1 : open ? (elsewhere ? .22 : 1) : rest;
      if(next !== s.target || dim !== s.dimTarget) s.lastActive = performance.now(); s.target = next; s.dimTarget = dim; if(!s.pointer){ var h = homeOf(s); s.tx = h[0]; s.ty = h[1]; }
      s.li.dataset.lit = (open || pointed) ? "true" : "false"; });
    kick();
  }
  function fit(){ S.forEach(function(s){ var el = s.name; if(!el || !el.parentElement) return; el.style.fontSize = ""; var base = parseFloat(getComputedStyle(el).fontSize) || 64, tw = el.scrollWidth, av = el.parentElement.clientWidth; if(tw > 0 && tw > av) el.style.fontSize = Math.max(18, Math.floor(((base * av) / tw) * 100) / 100) + "px"; }); }
  function sizeRow(s){
    var li = s.li, head = s.trig, first = !s.cssW; s.bleedX = clamp(Math.floor(li.getBoundingClientRect().left - root.getBoundingClientRect().left) - 4, 0, BLEED_X);
    sizeSmear(s, li.clientWidth, li.offsetHeight, head ? head.offsetHeight : li.offsetHeight);
    var lr = li.getBoundingClientRect(), nr = s.name.getBoundingClientRect(); s.homeX = nr.left - lr.left + nr.width / 2; s.nameTop = nr.top - lr.top; s.nameH = nr.height; s.homeY = s.nameTop + nr.height * .5; s.nameW = nr.width;
    if(first || !s.pointer){ var h = homeOf(s); s.tx = h[0]; s.ty = h[1]; if(first){ s.cx = s.tx; s.cy = s.ty; } }
  }
  function sizeAll(){ fit(); S.forEach(sizeRow); kick(); }
  function toggle(i){ var s = S[i]; s.pointer = false; var h = homeOf(s); s.tx = h[0]; s.ty = h[1]; openIndex = openIndex === i ? null : i;
    S.forEach(function(o, k){ var on = k === openIndex; o.li.dataset.open = on ? "true" : "false"; o.trig.setAttribute("aria-expanded", on ? "true" : "false"); var p = o.li.querySelector(".pel-panel"); if(p) p.setAttribute("aria-hidden", on ? "false" : "true"); });
    setTargets(); }
  function onMove(i, e){ if(e.pointerType === "touch") return; var s = S[i], r = s.li.getBoundingClientRect(), hx = homeOf(s)[0], w = s.nameW || s.cssW * .3;
    s.tx = clamp(hx + (e.clientX - r.left + s.bleedX - hx) * .35, hx - w * .18, hx + w * .12); s.lastActive = performance.now();
    var y0 = s.nameH ? s.nameTop + s.nameH * .3 : s.headH * .35, y1 = s.nameH ? s.nameTop + s.nameH * .7 : s.headH * .7; s.ty = BLEED + clamp(e.clientY - r.top, y0, y1);
    if(s.level < .05){ s.cx = s.tx; s.cy = s.ty; } s.pointer = true; kick(); }
  S.forEach(function(s, i){
    s.li.addEventListener("pointerenter", function(e){ if(e.pointerType !== "touch"){ hovered = i; setTargets(); } onMove(i, e); });
    s.li.addEventListener("pointermove", function(e){ onMove(i, e); });
    s.li.addEventListener("pointerleave", function(){ s.pointer = false; var h = homeOf(s); s.tx = h[0]; s.ty = h[1]; if(hovered === i) hovered = null; setTargets(); });
    s.trig.addEventListener("click", function(){ toggle(i); });
    s.trig.addEventListener("focus", function(){ if(s.trig.matches(":focus-visible")){ s.lastActive = performance.now(); focused = i; setTargets(); } });
    s.trig.addEventListener("blur", function(){ if(focused === i){ focused = null; setTargets(); } });
  });
  if("ResizeObserver" in window){ var ro = new ResizeObserver(function(){ sizeAll(); }); ro.observe(root); S.forEach(function(s){ ro.observe(s.li); }); }
  else window.addEventListener("resize", sizeAll);
  if("IntersectionObserver" in window){ new IntersectionObserver(function(en){ visible = en[0].isIntersecting; if(visible) kick(); }, { threshold: .05 }).observe(root); }
  document.addEventListener("visibilitychange", function(){ visible = document.visibilityState === "visible"; if(visible) kick(); });
  sizeAll(); setTargets(); if(document.fonts) document.fonts.ready.then(sizeAll).catch(function(){});
})();
