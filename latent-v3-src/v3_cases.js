/* the cases: a picture scrolls in as it is, and as it nears the top it squashes down onto its own bottom edge,
   leaving a line above its caption, the way the reference does it */
(function(){
  var sec = document.querySelector(".js-cs"); if(!sec) return;
  var items = [].slice.call(sec.querySelectorAll(".cs-item")), reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false;
  function frame(){
    ticking = false; if(reduce) return; var vh = window.innerHeight;
    items.forEach(function(el){
      var box = el.firstElementChild, r = box.getBoundingClientRect(); if(r.bottom < -10 || r.top > vh + 10) return;
      // the squash runs while the picture's bottom edge travels from 46% of the screen up to 14%
      var t = Math.min(1, Math.max(0, (vh * .46 - r.bottom) / (vh * .32)));
      var e = t * t * (3 - 2 * t);
      box.style.transform = e > 0 ? "scaleY(" + (1 - .985 * e).toFixed(4) + ")" : "";
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); frame();
})();
