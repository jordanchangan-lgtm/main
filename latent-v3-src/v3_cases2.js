/* version two after the hero: the statement brightens word by word with the scroll; the blinds close from ink to ivory */
(function(){
  var line = document.querySelector(".js-bright"), blinds = document.querySelector(".js-blinds"); if(!line && !blinds) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, words = [], ticking = false;
  if(line){ var ws = line.textContent.trim().split(/\s+/); line.textContent = "";
    ws.forEach(function(w, i){ var sp = document.createElement("span"); sp.className = "bw"; sp.textContent = w; sp.style.setProperty("--i", i); line.appendChild(sp); if(i < ws.length - 1) line.appendChild(document.createTextNode(" ")); words.push(sp); }); }
  var slats = blinds ? [].slice.call(blinds.children) : [];
  function frame(){
    ticking = false; var vh = window.innerHeight;
    if(line){ var r = line.getBoundingClientRect(); var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * .82 - r.top) / (r.height + vh * .25))); line.style.setProperty("--p", (p * (words.length + 3)).toFixed(2)); }
    if(blinds){ var b = blinds.getBoundingClientRect(); var q = reduce ? 1 : Math.min(1, Math.max(0, (vh * .9 - b.top) / (vh * .55)));
      slats.forEach(function(sl, i){ sl.classList.toggle("on", q > (i + 1) / (slats.length + 1)); }); }
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); frame();
})();
