/* the story after the hero, driven by scroll:
   words gather out of scattered, blurred positions as their block rises into view and thin out again as it leaves;
   pictures scroll in as they are and squash onto their bottom edge as they leave at the top, as in the reference */
(function(){
  var sec = document.querySelector(".js-cs"); if(!sec) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false;
  var seed = 7; function rnd(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  // split every text into words, each with its own scattered start
  var texts = [].slice.call(sec.querySelectorAll(".js-words")).map(function(el){
    var words = el.textContent.trim().split(/\s+/); el.textContent = "";
    var spans = words.map(function(w, i){
      var sp = document.createElement("span"); sp.className = "cw"; sp.textContent = w;
      sp.style.setProperty("--dx", ((rnd() - .5) * 90).toFixed(0) + "px"); sp.style.setProperty("--dy", ((rnd() - .5) * 60 + 30).toFixed(0) + "px");
      sp.style.setProperty("--i", i); el.appendChild(sp); if(i < words.length - 1) el.appendChild(document.createTextNode(" ")); return sp;
    });
    return { el: el, n: words.length };
  });
  var pics = [].slice.call(sec.querySelectorAll(".cs-item"));
  function frame(){
    ticking = false; var vh = window.innerHeight;
    texts.forEach(function(t){
      var r = t.el.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      // in: as the block travels from the bottom edge up to 62% of the screen. out: as it leaves through the top 16%
      var pin = Math.min(1, Math.max(0, (vh - r.top) / (vh * .38)));
      var pout = Math.min(1, Math.max(0, r.bottom / (vh * .16)));
      t.el.style.setProperty("--p", (reduce ? 1 : pin).toFixed(3)); t.el.style.setProperty("--q", (reduce ? 1 : pout).toFixed(3));
    });
    if(reduce) return;
    pics.forEach(function(el){
      var box = el.firstElementChild, r = box.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      var t = Math.min(1, Math.max(0, (vh * .46 - r.bottom) / (vh * .32))), e = t * t * (3 - 2 * t);
      box.style.transform = e > 0 ? "scaleY(" + (1 - .985 * e).toFixed(4) + ")" : "";
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); frame();
})();
