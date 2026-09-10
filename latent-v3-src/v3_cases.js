/* the studio gallery: every picture drifts at its own speed against the scroll, and fades as it leaves through the top */
(function(){
  var sec = document.querySelector(".js-cs"); if(!sec) return;
  var items = [].slice.call(sec.querySelectorAll(".cs-item")), reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false;
  function frame(){
    ticking = false; var vh = window.innerHeight;
    items.forEach(function(el){
      var r = el.getBoundingClientRect(); if(r.bottom < -vh || r.top > vh * 2) return;
      var k = reduce ? 0 : parseFloat(el.style.getPropertyValue("--k")) || 0;
      var mid = r.top + r.height / 2 - vh / 2;
      var fade = Math.min(1, Math.max(0, r.bottom / (vh * .22)));
      el.style.setProperty("--py", (-mid * k).toFixed(1) + "px");
      el.style.setProperty("--fade", fade.toFixed(3));
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", onScroll); frame();
})();
