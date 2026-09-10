/* version two after the hero: the statement brightens word by word with the scroll; the blinds close from ink to ivory */
(function(){
  var line = document.querySelector(".js-bright"), blinds = document.querySelector(".js-blinds"), sec = document.querySelector(".js-st2"); if(!line && !blinds) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, words = [], ticking = false;
  if(line){ var ws = line.textContent.trim().split(/\s+/); line.textContent = "";
    ws.forEach(function(w, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = w; sp.style.setProperty("--i", i); line.appendChild(sp); if(i < ws.length - 1) line.appendChild(document.createTextNode(" ")); words.push(sp); }); }
  var slats = blinds ? [].slice.call(blinds.children) : [];
  function frame(){
    ticking = false; var vh = window.innerHeight;
    if(line){ var st = sec.getBoundingClientRect(); var p = reduce ? 1 : Math.min(1, Math.max(0, -st.top / (vh * .52))); line.classList.toggle("on", reduce || st.top <= 1); line.style.setProperty("--p", (p * (words.length + 3)).toFixed(2)); }
    if(blinds){ var b = blinds.getBoundingClientRect(); var q = reduce ? 1 : Math.min(1, Math.max(0, (vh * .9 - b.top) / (vh * .55)));
      slats.forEach(function(sl, i){ sl.classList.toggle("on", q > (i + 1) / (slats.length + 1)); }); }
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); frame();
})();
/* how it works: a pinned horizontal scroll, as in the reference. The page scrolls down, the track slides left;
   each card reveals when it enters the screen (from below on phones), the film plays only while its card is in */
(function(){
  var sec = document.querySelector(".js-hz"); if(!sec) return;
  var hold = sec.querySelector(".js-hz-hold"), track = sec.querySelector(".js-hz-track"), cards = [].slice.call(sec.querySelectorAll(".js-hw"));
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
    }
    cards.forEach(function(c){ var b = c.getBoundingClientRect(); reveal(c, on ? (b.left < vw * .88 && b.right > 0) : (b.top < vh * .9 && b.bottom > 0)); });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", measure); window.addEventListener("load", measure); measure();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();
