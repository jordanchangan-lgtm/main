
/* Safari will not play a film carried as a data: URI (it wants byte ranges), so
   every film is handed over as a blob: URL held in memory before the page script runs */
(function(){
  function swap(el, attr){
    var u = el.getAttribute(attr); if(!u || u.indexOf("data:video") !== 0) return;
    try{
      var parts = u.split(","), mime = parts[0].slice(5).split(";")[0], bin = atob(parts[1]), len = bin.length, arr = new Uint8Array(len);
      for(var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
      el.setAttribute(attr, URL.createObjectURL(new Blob([arr], { type: mime })));
    }catch(e){}
  }
  [].forEach.call(document.querySelectorAll("video[src], source[src]"), function(el){ swap(el, "src"); });
  [].forEach.call(document.querySelectorAll("video"), function(v){ if(v.querySelector("source")) v.load(); });
})();

;

(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)").matches;




  /* ---- symmetry: the right line's last word ends as far from the right
     edge as the left line's FIRST WORD starts from the left. The left inset
     is set on the mark, and the word begins after it plus its gap. ---- */
  var hsWord = document.querySelector(".hs-word");   // measured via its line box
  var hsRole = document.querySelector(".hs-role");
  if(hsWord && hsRole){
    var balance = function(){
      if(getComputedStyle(hsRole).position !== "absolute"){ hsRole.style.right = ""; return; }
      var name = hsWord.parentNode.getBoundingClientRect();
      hsRole.style.right = Math.round(name.left) + "px";
    };
    window.__hsBalance = balance;
    balance();
    window.addEventListener("resize", balance, { passive:true });
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(balance);
  }

  /* ---- hero word cycle (21st AnimatedTextCycle) ---- */
  var cyc = document.getElementById("cyc");
  if(cyc){
    var WORDS = ["posts","carousels","reels","campaigns","identities","websites","portfolios"];
    var ci = 0;

    // measure every word once so the container can spring between widths
    var meas = document.createElement("span");
    meas.className = "cyc-measure";
    meas.setAttribute("aria-hidden","true");
    WORDS.forEach(function(w){
      var m = document.createElement("span");
      m.textContent = w; m.style.display = "block";
      meas.appendChild(m);
    });
    cyc.appendChild(meas);
    var widths = [].map.call(meas.children, function(m){
      return m.getBoundingClientRect().width;
    });

    var live = document.createElement("span");
    live.className = "cyc-w";
    live.textContent = WORDS[0];
    cyc.appendChild(live);
    cyc.style.width = widths[0] + "px";

    var swap = function(){
      ci = (ci + 1) % WORDS.length;
      cyc.style.width = widths[ci] + "px";
      if(window.__hsBalance) window.__hsBalance();
      if(reduce){ live.textContent = WORDS[ci]; return; }
      live.classList.add("out");                       // AnimatePresence exit
      setTimeout(function(){
        live.textContent = WORDS[ci];
        live.classList.remove("out");
        live.classList.add("pre");                     // enter from above
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){ live.classList.remove("pre"); });
        });
      }, 300);
    };
    // keeps running while the page scrolls on
    setInterval(swap, 2400);
    window.addEventListener("resize", function(){
      widths = [].map.call(meas.children, function(m){
        return m.getBoundingClientRect().width;
      });
      cyc.style.width = widths[ci] + "px";
    }, { passive:true });
  }

  /* ---- the reference stamps a local time in its hero; so does this ---- */
  var clock = document.getElementById("clock");
  if(clock){
    var tick = function(){
      clock.textContent = new Date().toLocaleTimeString("en-GB",
        { hour:"2-digit", minute:"2-digit", timeZone:"Asia/Amman" });
    };
    tick(); setInterval(tick, 30000);
  }



  /* ---- SplittingText: segment the statement, then reveal on view ---- */
  var track = [].slice.call(document.querySelectorAll(".js-split"));
  track.forEach(function(el){
    /* One block can carry several pieces of copy (a heading and the line
       under it): the index runs straight through them, so the heading
       lands first and the explanation follows it word by word. */
    var parts = [].slice.call(el.querySelectorAll(".js-seg"));
    if(!parts.length){
      var only = el.querySelector("span:not(.mk)");
      if(only) parts = [only];
    }
    if(!parts.length) return;
    var mk = el.querySelector(".mk");
    var n = 0;
    if(mk){ mk.classList.add("sw"); mk.style.setProperty("--i", n++); }
    parts.forEach(function(body){
      var segs = body.textContent.split(/(\s+)/).filter(function(x){ return x.length; });
      body.innerHTML = "";
      segs.forEach(function(seg){
        /* Only the words become animated segments. The gaps stay ordinary
           text nodes so the browser can still collapse one at the end of a
           line — a `white-space:pre` span there would indent the next line. */
        if(/^\s+$/.test(seg)){ body.appendChild(document.createTextNode(seg)); return; }
        var sp = document.createElement("span");
        sp.className = "sw";
        sp.style.setProperty("--i", n++);
        sp.textContent = seg;
        body.appendChild(sp);
      });
    });
  });
  /* A locked block reads off the scroll instead (see locked() below), so
     it is left out of the observer that fires the timed stagger. */
  var timed = track.filter(function(el){ return !el.classList.contains("js-lock") && !el.closest(".js-lk"); });
  if(timed.length){
    if(reduce){ timed.forEach(function(el){ el.classList.add("in"); }); }
    else {
      var tObs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(!e.isIntersecting) return;
          e.target.classList.add("in");
          tObs.unobserve(e.target);
        });
      }, { threshold:.4 });
      timed.forEach(function(el){ tObs.observe(el); });
    }
  }

  /* ---- the locked paragraph ----
     The panel is stuck to the top of the screen and the scroll length
     under it is the reveal: the words land one after another as you
     scroll, and the page only moves on once the last one has. ---- */
  var locks = [].slice.call(document.querySelectorAll(".js-lock")).map(function(el){
    return { hold: el.closest(".js-hold"), words: [].slice.call(el.querySelectorAll(".sw")) };
  }).filter(function(g){ return g.hold && g.words.length; });
  if(reduce){
    locks.forEach(function(g){ g.words.forEach(function(w){ w.classList.add("on"); }); });
    locks = [];
  }

  /* ---- the slider: LayeredText, held for two seconds ----
     Every row's two lines get one running index, so the stagger walks
     the stack top to bottom like the GSAP timeline did. The stack climbs
     once, when its stage first fills the screen; from then on hovering
     brings it back down and leaving lets it climb again — the same one-row
     shift the component runs on hover, from the other resting state. ---- */
  var slider = document.querySelector(".js-slider");
  var lt = slider && slider.querySelector(".js-lt");
  var ltDone = false;
  var ltHover = false, ltSeen = true, ltTimer = null;
  if(lt){
    [].forEach.call(lt.querySelectorAll("p"), function(pp, k){ pp.style.setProperty("--k", k); });
    // hover takes over at full speed; the loop resumes once the pointer leaves
    lt.addEventListener("mouseenter", function(){ if(!ltDone) return; ltHover = true; lt.classList.remove("auto"); lt.classList.remove("up"); });
    lt.addEventListener("mouseleave", function(){ if(!ltDone) return; ltHover = false; lt.classList.add("up"); });
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ ltSeen = e.isIntersecting; }); }, { threshold:.2 }).observe(lt);
    }
  }
  /* After the first climb the stack runs by itself: every few seconds it
     comes back down or climbs again, slowly, unless it is hovered,
     off screen, or the tab is hidden. */
  function ltLoop(){
    if(ltTimer || reduce) return;
    ltTimer = setInterval(function(){
      if(ltHover || !ltSeen || document.hidden) return;
      lt.classList.add("auto");
      lt.classList.toggle("up");
    }, 4800);
  }
  function ltStart(){
    if(!lt || ltDone) return;
    ltDone = true;
    if(reduce){ lt.classList.add("up"); return; }
    requestAnimationFrame(function(){ lt.classList.add("up"); });
    setTimeout(ltLoop, 1800);
  }
  function ltLock(){
    if(!lt || ltDone || document.querySelector(".js-scenes")) return;
    var r = slider.getBoundingClientRect(), vh = window.innerHeight;
    if(r.top > 1 || r.bottom < vh * .6) return;
    ltDone = true;
    if(reduce){ lt.classList.add("up"); return; }
    if(!fine){ requestAnimationFrame(function(){ lt.classList.add("up"); }); setTimeout(ltLoop, 2000); return; }
    // Square the stage to the screen, then hold it there while the stack
    // climbs: wheel, touch and keyboard scrolling are swallowed for 2s.
    window.scrollTo({ top: window.scrollY + r.top, left:0, behavior:"instant" });
    var swallow = function(e){ e.preventDefault(); };
    var keys = function(e){
      if(e.key === " " || /^(Arrow(Up|Down)|Page(Up|Down)|Home|End)$/.test(e.key)) e.preventDefault();
    };
    var opts = { passive:false };
    window.addEventListener("wheel", swallow, opts);
    window.addEventListener("touchmove", swallow, opts);
    window.addEventListener("keydown", keys, opts);
    requestAnimationFrame(function(){ lt.classList.add("up"); });
    setTimeout(function(){
      window.removeEventListener("wheel", swallow, opts);
      window.removeEventListener("touchmove", swallow, opts);
      window.removeEventListener("keydown", keys, opts);
      ltLoop();
    }, 2000);
  }

  /* ---- packages: the expandable gallery ----
     One list feeds the row and the sheet. Hover follows the component
     (hoveredIndex); click opens (selectedIndex); prev / next wrap; Esc
     closes; the counter reads n / N. ---- */
  var PACKS = [
    { n:"01", name:"Starter", price:"200", desc:"A first month of showing up, done properly.",
      feats:["4 carousel posts","3 reels · 15s each","Showcase videos, one to two shots","1080p HD delivery"] },
    { n:"02", name:"Essential", price:"275", desc:"The steady feed: more posts, more reels.",
      feats:["5 carousel posts","4 reels · 15s each","Showcase videos, one to two shots","1080p HD delivery"] },
    { n:"03", name:"Growth", price:"375", desc:"Scripted film enters the picture.", pop:true,
      feats:["5 carousel posts","3 cinematic reels · 15s each","Full scripted video, cinematics, edits + SFX","2–7 shots per reel","1080p HD delivery"] },
    { n:"04", name:"Signature", price:"425", desc:"The full campaign, longer and louder.",
      feats:["6 carousel posts","3 cinematic reels · 20s each","Full scripted video, cinematics, edits + SFX","2–7 shots per reel","1080p HD delivery"] }
  ];
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  /* every package writes an email to the studio with the package named in it */
  var MAIL = "latentstudio.jo@gmail.com";
  function mailtoFor(what){
    var subject = "Enquiry \u00b7 " + what;
    var body = "Hello Latent Studio,\n\nI would like to start with the " + what + ".\n\nBrand / product:\nWhat we are launching:\nWhen:\n\nThanks,\n";
    return "mailto:" + MAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  var xg = document.querySelector(".js-xg");
  if(xg){
    var feats = function(pk){ return '<ul class="xg-feats">' + pk.feats.map(function(f){ return "<li>" + CHECK + "<span>" + f + "</span></li>"; }).join("") + "</ul>"; };
    xg.innerHTML = PACKS.map(function(pk, i){
      return '<a class="xg-p' + (pk.pop ? " pop" : "") + '" role="listitem" data-i="' + i + '" href="' + mailtoFor(pk.name + " package \u00b7 " + pk.price + " JD") + '">' +
        (pk.pop ? '<span class="xg-badge">Most chosen</span>' : "") +
        '<div class="xg-in"><div><div class="xg-n">' + pk.n + '</div><h3 class="xg-name">' + pk.name + '</h3>' +
        '<p class="xg-desc">' + pk.desc + '</p>' + feats(pk) + '</div>' +
        '<div><div class="xg-price"><b>' + pk.price + '</b><span>JD</span></div><span class="xg-open">Enquire</span></div></div></a>';
    }).join("");
    var panels = [].slice.call(xg.children);
    var modal = document.querySelector(".js-xg-modal"), sheet = modal.querySelector(".js-xg-sheet"), count = modal.querySelector(".js-xg-count");
    var selected = null, lastFocus = null;
    var hover = function(i){
      xg.classList.toggle("hov", i !== null);
      panels.forEach(function(p, k){ p.classList.toggle("on", k === i); });
    };
    var show = function(i){
      selected = i; var pk = PACKS[i];
      sheet.className = "xg-sheet js-xg-sheet" + (pk.pop ? " pop" : "");
      sheet.innerHTML = '<div><div class="xg-n">' + pk.n + (pk.pop ? " · Most chosen" : "") + '</div><h3 class="xg-name">' + pk.name + '</h3>' +
        '<p class="xg-desc">' + pk.desc + '</p><div class="xg-price" style="margin-top:22px"><b>' + pk.price + '</b><span>JD · per package</span></div>' +
        '<a class="xg-cta" href="' + mailtoFor(pk.name + " package \u00b7 " + pk.price + " JD") + '">Start with ' + pk.name + " " + ARROW + '</a></div>' +
        '<div>' + feats(pk) + '</div>';
      count.textContent = (i + 1) + " / " + PACKS.length;
      sheet.querySelector(".xg-cta").addEventListener("click", close);
    };
    var open = function(i){
      lastFocus = document.activeElement;
      show(i);
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ modal.classList.add("on"); }); });
      modal.querySelector(".js-xg-close").focus();
    };
    function close(){
      modal.classList.remove("on");
      document.body.style.overflow = "";
      setTimeout(function(){ modal.hidden = true; selected = null; if(lastFocus && lastFocus.focus) lastFocus.focus(); }, reduce ? 0 : 300);
    }
    var step = function(d){ if(selected === null) return; show((selected + d + PACKS.length) % PACKS.length); };
    panels.forEach(function(p, i){
      p.addEventListener("mouseenter", function(){ if(fine) hover(i); });
      p.addEventListener("mouseleave", function(){ if(fine) hover(null); });
      /* the card is a link to the written email; nothing to script */
    });
    modal.addEventListener("click", function(e){ if(e.target === modal) close(); });
    modal.querySelector(".js-xg-close").addEventListener("click", close);
    modal.querySelector(".js-xg-prev").addEventListener("click", function(e){ e.stopPropagation(); step(-1); });
    modal.querySelector(".js-xg-next").addEventListener("click", function(e){ e.stopPropagation(); step(1); });
    document.addEventListener("keydown", function(e){
      if(modal.hidden) return;
      if(e.key === "Escape") close();
      if(e.key === "ArrowRight") step(1);
      if(e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---- the two tenets: the showcase ----
     One record per side. Switching runs the component's sequence: the
     copy exits (y -10, blur, .2s), the picture exits (scale .6, blur, .25s),
     the row flips (a FLIP standing in for Framer's layout spring), then
     the new picture springs in from its own side and the copy comes back
     with the title and the line under it word by word. ---- */
  var sp = document.querySelector(".js-sp"), spSeen = false, spShow = null;
  if(sp){
    var SIDES = {
      left:{
        kick:"Principle one", title:"Minimalism", status:"In every frame",
        desc:"Nothing in the frame that is not earning its place. One product, one light, one idea, held long enough to be read. What we leave out is what makes the thing you are selling the only thing you see.",
        foot:"One product \u00b7 one light \u00b7 one idea"
      },
      right:{
        kick:"Principle two", title:"Simplicity", status:"In every brief",
        desc:"A short brief, one agreed direction, one set of final files. No crew call, no set build, no reshoot day, no version thirty. It is why the work moves in days and why the numbers further down look the way they do.",
        foot:"One brief \u00b7 one direction \u00b7 one delivery"
      }
    };
    var spDetails = sp.querySelector(".js-sp-details");
    var spVisual  = sp.querySelector(".js-sp-visual");
    var spRow     = sp.querySelector(".sp-row");
    var spPics    = { left: sp.querySelector(".sp-pic-l"), right: sp.querySelector(".sp-pic-r") };
    var spBtns    = [].slice.call(sp.querySelectorAll(".sp-pill button"));
    var spSide    = "left", spBusy = false;

    // the same word split the statement uses, so the copy reads in the same way
    var spWords = function(body, text, n){
      body.innerHTML = "";
      text.split(/(\s+)/).forEach(function(seg){
        if(!seg.length) return;
        if(/^\s+$/.test(seg)){ body.appendChild(document.createTextNode(seg)); return; }
        var w = document.createElement("span");
        w.className = "sw"; w.style.setProperty("--i", n++); w.textContent = seg;
        body.appendChild(w);
      });
      return n;
    };
    var spFill = function(side){
      var d = SIDES[side], n = 0;
      sp.querySelector(".js-sp-kick").textContent = d.kick;
      n = spWords(sp.querySelector(".js-sp-ttl span"), d.title, n);
      spWords(sp.querySelector(".js-sp-desc span"), d.desc, n);
      sp.querySelector(".js-sp-foot").textContent = d.foot;
    };
    var spSwitch = function(side){
      if(spBusy || side === spSide) return;
      spBusy = true;
      var from = spSide; spSide = side;
      spBtns.forEach(function(b){
        var on = b.dataset.side === side;
        b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false");
      });
      spDetails.classList.remove("in"); spDetails.classList.add("out");
      spPics[from].classList.remove("in"); spPics[from].classList.add("out");
      var surf = sp.querySelector(".sp-surface");
      surf.classList.add("moving");
      setTimeout(function(){ surf.classList.remove("moving"); }, 220);
      setTimeout(function(){
        // FLIP the row: measure, flip the side, measure again, play the difference
        var a = spVisual.getBoundingClientRect(), b = spDetails.getBoundingClientRect();
        sp.dataset.side = side;
        spFill(side);
        var a2 = spVisual.getBoundingClientRect(), b2 = spDetails.getBoundingClientRect();
        [[spVisual, a.left - a2.left, a.top - a2.top], [spDetails, b.left - b2.left, b.top - b2.top]].forEach(function(t){
          t[0].style.transition = "none";
          t[0].style.transform = "translate(" + t[1] + "px," + t[2] + "px)";
        });
        void spRow.offsetWidth;
        [spVisual, spDetails].forEach(function(el){
          el.style.transition = reduce ? "none" : "transform .9s cubic-bezier(.2,.8,.2,1)";
          el.style.transform = "";
        });
        // the old picture snaps back to its start state, silently
        spPics[from].classList.add("snap"); spPics[from].classList.remove("out");
        void spPics[from].offsetWidth; spPics[from].classList.remove("snap");
        spPics[side].classList.add("in");
        spDetails.classList.remove("out");
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ spDetails.classList.add("in"); }); });
        setTimeout(function(){ spBusy = false; }, 500);
      }, 250);
    };
    spBtns.forEach(function(b){ b.addEventListener("click", function(){ spSwitch(b.dataset.side); }); });
    spFill("left");
    spShow = function(){
      if(spSeen) return;
      spSeen = true;
      sp.classList.add("in");
      spPics.left.classList.add("in");
      spDetails.classList.add("in");
    };
    if(reduce){ spShow(); }
    else {
      var spObs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(!e.isIntersecting || spSeen) return;
          spShow(); spObs.disconnect();
        });
      }, { threshold:.35 });
      /* on the locked stage the scene decides, not the observer */
    }
  }

  /* ---- project list: hover swaps the background, cells scramble, the list
     runs an idle wave when nothing is hovered. Vanilla — the GSAP scramble
     plugin is paid, so the scrambler below is hand-rolled. ---- */
  var pl = document.querySelector(".js-pl");
  if(pl){
    var plRows = [].slice.call(pl.querySelectorAll(".pl-row"));
    var plBgs  = [].slice.call(document.querySelectorAll(".pl-bg"));
    var idleT = null, waveT = null, active = -1;

    // Build each cell as two stacked character layers.
    plRows.forEach(function(row){
      [].forEach.call(row.children, function(cell){
        var txt = cell.textContent, n = txt.length;
        var mk = function(cls){
          var lay = '<span class="lay ' + cls + '">';
          for(var i = 0; i < n; i++){
            var d = Math.abs(i - (n - 1) / 2);          // centre-out, as in the component
            lay += '<i style="--i:' + d.toFixed(2) + '">' +
                   (txt[i] === " " ? "&nbsp;" : txt[i].replace(/&/g,"&amp;").replace(/</g,"&lt;")) +
                   "</i>";
          }
          return lay + "</span>";
        };
        cell.innerHTML = '<span class="roll">' + mk("top") + mk("bot") + "</span>";
      });
    });

    function stopIdle(){
      clearTimeout(idleT); clearInterval(waveT); waveT = null;
      plRows.forEach(function(r){ r.style.opacity = ""; });
    }
    function startIdle(){
      clearTimeout(idleT);
      if(reduce) return;
      idleT = setTimeout(function(){
        if(active !== -1 || waveT) return;
        var k = 0;
        waveT = setInterval(function(){
          plRows.forEach(function(r, i){
            r.style.opacity = (i === k % plRows.length) ? ".28" : "";
          });
          k++;
        }, 190);
      }, 4000);
    }

    var pick = function(row, i){
      stopIdle();
      if(active === i) return;
      active = i;
      plRows.forEach(function(r){ r.classList.toggle("on", r === row); });
      plBgs.forEach(function(b){ b.classList.toggle("on", +b.dataset.i === i); });
    };
    plRows.forEach(function(row, i){
      row.addEventListener("mouseenter", function(){ pick(row, i); });
      row.addEventListener("click", function(){ pick(row, i); });
    });
    document.getElementById("work").addEventListener("mouseleave", function(){
      active = -1;
      plRows.forEach(function(r){ r.classList.remove("on"); });
      plBgs.forEach(function(b){ b.classList.remove("on"); });
      startIdle();
    });
    startIdle();

    var plc = document.getElementById("plclock");
    if(plc){
      var t2 = function(){
        var p = new Intl.DateTimeFormat("en-US", { timeZone:"Asia/Amman", hour12:true,
                  hour:"numeric", minute:"2-digit" }).formatToParts(new Date());
        var g = function(k){ return (p.find(function(x){ return x.type === k; }) || {}).value || ""; };
        plc.innerHTML = g("hour") + '<span class="blink">:</span>' + g("minute") + " " + g("dayPeriod");
      };
      t2(); setInterval(t2, 20000);
    }
  }

  /* ---- reveal: anything marked .rv rises when it is scrolled to ---- */
  var rv = [].slice.call(document.querySelectorAll(".rv")).filter(function(el){ return !el.closest(".js-lk"); });
  var lkRv = [].slice.call(document.querySelectorAll(".js-lk .rv"));
  if(rv.length){
    if(reduce || !("IntersectionObserver" in window)){ rv.forEach(function(el){ el.classList.add("in"); }); }
    else {
      var rvObs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(!e.isIntersecting) return;
          e.target.classList.add("in"); rvObs.unobserve(e.target);
        });
      }, { threshold:.12, rootMargin:"0px 0px -6% 0px" });
      rv.forEach(function(el){ rvObs.observe(el); });
    }
  }


  /* ---- the stack: one line awake at a time. The wake walks down the
     column on its own while the stack is on screen, and jumps to the
     line under the pointer. ---- */
  var stks = [].slice.call(document.querySelectorAll(".js-stk"));
  stks.forEach(function(stk){
    var lines = [].slice.call(stk.querySelectorAll(".stk-l")), at = -1, timer = null, hold = 0, seen = false;
    var every = +stk.dataset.every || 2400;
    function wake(i){
      at = i;
      lines.forEach(function(l, j){ l.classList.toggle("on", j === i); });
    }
    /* no line may break: the whole column shrinks to its longest line */
    function fit(){
      stk.style.setProperty("--fit", 1);
      var cw = stk.clientWidth, max = 0;
      lines.forEach(function(l){ max = Math.max(max, l.scrollWidth); });
      if(max > cw && cw > 0) stk.style.setProperty("--fit", (cw / max * .98).toFixed(3));
    }
    fit();
    window.addEventListener("resize", fit, { passive:true });
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    function step(){
      if(!seen || Date.now() < hold) return;
      wake((at + 1) % lines.length);
    }
    function start(){
      if(timer) return;
      timer = setInterval(step, every);
    }
    function show(){
      if(stk.classList.contains("in")) return;
      stk.classList.add("in");
      setTimeout(function(){ wake(0); start(); }, 700 + lines.length * 120);
    }
    lines.forEach(function(l, i){
      l.addEventListener("mouseenter", function(){ if(!fine) return; wake(i); hold = Date.now() + 3200; });
      l.addEventListener("touchstart", function(){ wake(i); hold = Date.now() + 3200; }, { passive:true });
    });
    if(reduce || !("IntersectionObserver" in window)){
      stk.classList.add("in"); wake(0); seen = true;
      if(!reduce) start();
    } else {
      new IntersectionObserver(function(es){
        es.forEach(function(e){
          seen = e.isIntersecting;
          if(seen) show();
        });
      }, { threshold:.25 }).observe(stk);
    }
  });

  /* ---- the brand film: it runs, muted, while its tile is on screen;
     the tile opens it full frame, with sound, under its title row ---- */
  function vPlay(v){ var p = v.play(); if(p && p.catch) p.catch(function(){}); }
  var filmTiles = [].slice.call(document.querySelectorAll(".js-film, .js-wk-row")), fm = document.querySelector(".js-fm");
  if(filmTiles.length && fm){
    var fv = fm.querySelector(".js-fm-v"), fmStage = fm.querySelector(".js-fm-stage"),
        fmState = fm.querySelector(".js-fm-state"), fmTime = fm.querySelector(".js-fm-time"),
        fmTitle = fm.querySelector(".js-fm-title"), fmClient = fm.querySelector(".js-fm-client"), fmNote = fm.querySelector(".js-fm-note"),
        fmLast = null, fmTile = null, fmDur = "0:05", fmImg = fm.querySelector(".js-fm-img");
    function fmt(t){ t = Math.floor(t || 0); return Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2); }
    filmTiles.forEach(function(tile){
      var tv = tile.querySelector(".js-tile-v"), ti = tile.dataset.img ? tile.querySelector("img") : null;
      if(tile.classList.contains("js-wk-row")){
        var wkPrev = tile.closest(".js-ixl").querySelector('.js-ixl-prev [data-i="' + tile.dataset.i + '"]');
        if(wkPrev && wkPrev.tagName === "VIDEO") tv = wkPrev; else ti = wkPrev;
      }
      var own = tv && tile.contains(tv);
      if(own && tile.closest(".js-wk-stage")){ /* the portfolio stage plays the active set itself */ }
      else if(own && "IntersectionObserver" in window){
        new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) vPlay(tv); else tv.pause(); }); }, { threshold:.3 }).observe(tile);
      } else if(own) vPlay(tv);
      function open(){
        if(ti){
          fmLast = document.activeElement; fmTile = tile;
          fmTitle.textContent = tile.dataset.title || ""; fmClient.textContent = tile.dataset.client || ""; fmNote.innerHTML = tile.dataset.note || "";
          fv.pause(); fv.hidden = true; fmImg.hidden = false; fmImg.src = ti.currentSrc || ti.src; fm.classList.add("still");
          fm.hidden = false; document.body.style.overflow = "hidden";
          requestAnimationFrame(function(){ fm.classList.add("on"); });
          fm.querySelector(".js-fm-close").focus();
          return;
        }
        fv.hidden = false; fmImg.hidden = true; fm.classList.remove("still");
        fmLast = document.activeElement; fmTile = tile; fmDur = tile.dataset.dur || "0:05";
        fmTitle.textContent = tile.dataset.title || ""; fmClient.textContent = tile.dataset.client || ""; fmNote.innerHTML = tile.dataset.note || "";
        var src = tv.currentSrc || tv.src;
        if(fv.src !== src){ fv.src = src; fv.poster = tv.poster || ""; }
        fmDur = tile.dataset.dur || fmDur;
        fm.hidden = false; document.body.style.overflow = "hidden";
        requestAnimationFrame(function(){ fm.classList.add("on"); });
        tv.pause(); fv.currentTime = 0; fv.muted = false;
        var p = fv.play(); if(p && p.catch) p.catch(function(){ fv.muted = true; vPlay(fv); });
        fmStage.classList.remove("paused"); fmState.textContent = "[ Pause ]"; fmTime.textContent = "0:00 / " + fmDur;
        fm.querySelector(".js-fm-close").focus();
      }
      tile.addEventListener("click", open);
      tile.setAttribute("tabindex", "0"); tile.setAttribute("role", "button"); tile.setAttribute("aria-label", "Play: " + (tile.dataset.title || "film"));
      tile.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); } });
    });
    function fmClose(){
      fv.pause(); fm.classList.remove("on"); document.body.style.overflow = "";
      setTimeout(function(){ fm.hidden = true; }, 350);
      if(fmLast && fmLast.focus) fmLast.focus();
      var tvb = fmTile && fmTile.querySelector(".js-tile-v"); if(tvb) vPlay(tvb);
    }
    fm.querySelector(".js-fm-close").addEventListener("click", fmClose);
    fmStage.addEventListener("click", function(){
      if(fv.paused){ vPlay(fv); fmStage.classList.remove("paused"); fmState.textContent = "[ Pause ]"; }
      else { fv.pause(); fmStage.classList.add("paused"); fmState.textContent = "[ Play ]"; }
    });
    fv.addEventListener("timeupdate", function(){ fmTime.textContent = fmt(fv.currentTime) + " / " + (isFinite(fv.duration) && fv.duration ? fmt(fv.duration) : fmDur); });
    fv.addEventListener("ended", function(){ fmStage.classList.add("paused"); fmState.textContent = "[ Replay ]"; });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape" && !fm.hidden) fmClose(); });
  }

  /* ---- the project list's film cells run while the panel is on screen ---- */
  var gwV = [].slice.call(document.querySelectorAll(".js-gw-v"));
  if(gwV.length){
    var workSec = document.getElementById("work");
    function gwRun(on){ gwV.forEach(function(v){ if(on){ if(!v.src) v.src = v.dataset.src; vPlay(v); } else v.pause(); }); }
    if(workSec && "IntersectionObserver" in window) new IntersectionObserver(function(es){ es.forEach(function(e){ gwRun(e.isIntersecting); }); }, { threshold:.05 }).observe(workSec);
    else gwRun(true);
  }

  /* ---- the foot: the studio clock ---- */
  var footClock = document.querySelector(".js-foot-clock");
  if(footClock){
    var fmt = null;
    try { fmt = new Intl.DateTimeFormat("en-GB", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:"Asia/Amman" }); } catch(e){}
    function footTick(){ if(fmt) footClock.textContent = fmt.format(new Date()); }
    footTick(); setInterval(footTick, 15000);
  }

  /* ---- the film: a portrait cut on a phone, the wide cut elsewhere.
     The sources carry media queries so the browser picks one; the
     poster follows the same split. ---- */
  var mv = document.querySelector(".js-method-v");
  if(mv && window.matchMedia("(max-width: 767px)").matches && mv.dataset.posterM){ mv.poster = mv.dataset.posterM; }


  /* ---- the index: the awake row moves on its own and follows the
     pointer; the still beside the rows floats to it and changes ---- */
  [].forEach.call(document.querySelectorAll(".js-ixl"), function(ixl){
    var ixRows = [].slice.call(ixl.querySelectorAll(".ixl-row")), ixPrev = ixl.querySelector(".js-ixl-prev"),
        ixImgs = [].slice.call(ixPrev.querySelectorAll("img, video")), ixCap = ixl.querySelector(".js-ixl-cap"), ixCap2 = ixl.querySelector(".js-ixl-cap2"),
        ixFilt = [].slice.call(ixl.querySelectorAll(".ixl-filter span")),
        ixAt = 0, ixHold = 0, ixSeen = false;
    /* the sectors index borrows its stills from the grid tiles */
    if(!ixl.classList.contains("js-wk")){
      var awTiles = [].slice.call(document.querySelectorAll("#sectors .aw-tile"));
      ixImgs.forEach(function(im){
        var t = awTiles[+im.dataset.i], src = t && t.querySelector(".aw-img img, .aw-img video");
        if(!src) return;
        im.src = src.src || src.currentSrc;
        if(im.tagName === "VIDEO" && src.poster) im.poster = src.poster;
      });
    }
    function ixWake(i){
      ixAt = i;
      ixRows.forEach(function(r, j){ r.classList.toggle("on", j === i); });
      ixImgs.forEach(function(im, j){
        var on = +im.dataset.i === i;
        im.classList.toggle("on", on);
        if(im.tagName === "VIDEO"){ if(on){ var p = im.play(); if(p && p.catch) p.catch(function(){}); } else im.pause(); }
      });
      ixFilt.forEach(function(f, j){ f.classList.toggle("on", j === i); });
      if(ixCap) ixCap.textContent = ixRows[i].querySelector(".nm").textContent;
      var act = ixImgs.filter(function(im){ return +im.dataset.i === i; })[0];
      if(act && act.dataset.ar){ ixPrev.style.setProperty("--ar", act.dataset.ar); var wh = act.dataset.ar.split("/"); ixPrev.classList.toggle("port", (+wh[0] / +wh[1]) < 1); }
      if(ixCap2){ var m = ixRows[i].querySelector(".meta"); ixCap2.textContent = m ? m.textContent : ""; }
      /* float the still to the row */
      var list = ixRows[0].parentNode;
      var row = ixRows[i], target = row.offsetTop + row.offsetHeight / 2 - ixPrev.offsetHeight / 2;
      var max = Math.max(0, list.offsetHeight - ixPrev.offsetHeight);
      ixPrev.style.setProperty("--py", Math.round(Math.max(0, Math.min(max, target))));
    }
    ixRows.forEach(function(r, i){
      r.addEventListener("mouseenter", function(){ if(!fine) return; ixWake(i); ixHold = Date.now() + 3600; });
      r.addEventListener("touchstart", function(){ ixWake(i); ixHold = Date.now() + 3600; }, { passive:true });
      r.addEventListener("click", function(){ ixWake(i); ixHold = Date.now() + 3600; });
    });
    ixFilt.forEach(function(f, i){
      f.addEventListener("mouseenter", function(){ if(!fine) return; ixWake(i); ixHold = Date.now() + 3600; });
      f.addEventListener("click", function(){ ixWake(i); ixHold = Date.now() + 3600; });
    });
    ixWake(0);
    window.addEventListener("resize", function(){ ixWake(ixAt); }, { passive:true });
    if(!reduce){
      var ixEvery = +ixl.dataset.every || 2600;
      setInterval(function(){ if(ixSeen && Date.now() > ixHold) ixWake((ixAt + 1) % ixRows.length); }, ixEvery);
      if("IntersectionObserver" in window) new IntersectionObserver(function(es){ es.forEach(function(e){ ixSeen = e.isIntersecting; }); }, { threshold:.2 }).observe(ixl);
      else ixSeen = true;
    }
  });

  /* ---- the spread: parallax against the scroll, tilt under the pointer ---- */
  var edF = [].slice.call(document.querySelectorAll(".js-ed"));
  function sxTick(){
    if(!edF.length) return;
    var vh = window.innerHeight;
    edF.forEach(function(f){
      var r = f.getBoundingClientRect(); if(r.bottom < -200 || r.top > vh + 200) return;
      var c = (r.top + r.height / 2) / vh - .5;                 // -0.5 top .. 0.5 bottom
      f.style.setProperty("--py", (c * (+f.dataset.rate || 1) * 48).toFixed(1));
    });
  }
  if(edF.length && fine && !reduce){
    edF.forEach(function(f){
      var img = f.querySelector(".ed-img");
      f.addEventListener("mousemove", function(e){
        var r = img.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        img.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
        img.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
      });
      f.addEventListener("mouseleave", function(){ img.style.setProperty("--ry", "0deg"); img.style.setProperty("--rx", "0deg"); });
    });
  }

  /* ---- scroll-velocity marquee: base drift plus the scroll's speed ----
     velocity is scrollY per second, smoothed; the factor caps at 5 and
     flips the row's direction with the scroll, as in the component. ---- */
  var mqRows = [].slice.call(document.querySelectorAll(".js-mq .mq-row"));
  if(mqRows.length && !reduce){
    var mqLastY = window.scrollY, mqLastT = performance.now(), mqVel = 0, mqSmooth = 0;
    var mqState = mqRows.map(function(row){
      var track = row.querySelector(".js-mq-track"), block = row.querySelector(".js-mq-block");
      var st = { row:row, track:track, block:block, x:0, dir: +row.dataset.dir || 1, cur: +row.dataset.dir || 1, v: +row.dataset.v || 3, bw:0, seen:true };
      var size = function(){
        [].slice.call(track.children).slice(1).forEach(function(c){ c.remove(); });
        st.bw = block.getBoundingClientRect().width || 1;
        var copies = Math.max(3, Math.ceil(row.offsetWidth / st.bw) + 2);
        for(var i = 1; i < copies; i++){ var c = block.cloneNode(true); c.setAttribute("aria-hidden","true"); track.appendChild(c); }
      };
      size(); window.addEventListener("resize", size, { passive:true });
      if("IntersectionObserver" in window) new IntersectionObserver(function(es){ es.forEach(function(e){ st.seen = e.isIntersecting; }); }).observe(row);
      return st;
    });
    var mqWrap = function(min, max, v){ var r = max - min; return ((((v - min) % r) + r) % r) + min; };
    var mqTick = function(now){
      var dt = Math.min(.05, (now - mqLastT) / 1000) || 0; mqLastT = now;
      var y = window.scrollY; if(dt > 0){ mqVel = (y - mqLastY) / dt; } mqLastY = y;
      mqSmooth += (mqVel - mqSmooth) * Math.min(1, dt * 8);            // the spring, roughly
      var sign = mqSmooth < 0 ? -1 : 1, mag = Math.min(5, Math.abs(mqSmooth) / 1000 * 5), vf = sign * mag;
      mqState.forEach(function(st){
        if(!st.seen || document.hidden) return;
        if(mag > .1) st.cur = st.dir * sign;
        var pps = st.bw * st.v / 100;
        st.x += st.cur * pps * (1 + mag) * dt;
        st.track.style.transform = "translateX(" + (-mqWrap(0, st.bw, st.x)) + "px)";
      });
      requestAnimationFrame(mqTick);
    };
    requestAnimationFrame(mqTick);
  }

  /* ---- process: the line fills across each quarter of the hold, and the
     visual for a point shows once its quarter has begun ---- */
  var pr = document.querySelector(".js-pr");
  var prPts = pr ? [].slice.call(pr.querySelectorAll(".pr-pt")) : [];
  var prImgs = pr ? [].slice.call(pr.querySelectorAll(".pr-img")) : [];
  function prTick(){
    if(!pr) return;
    var vh = window.innerHeight, run = Math.max(1, pr.offsetHeight - vh);
    var prog = Math.min(1, Math.max(0, -pr.getBoundingClientRect().top / run));
    prPts.forEach(function(pt){
      var a = +pt.style.getPropertyValue("--a"), b = +pt.style.getPropertyValue("--b");
      var pc = prog < a ? 0 : prog > b ? 100 : (prog - a) / (b - a) * 100;
      pt.querySelector(".pr-line i").style.setProperty("--p", pc + "%");
      pt.classList.toggle("on", pc > 0);
    });
    prImgs.forEach(function(im, i){ im.classList.toggle("on", i === 0 || prog > +im.dataset.at); });
  }

  /* ---- the cuts: the curtain lifts as each one is reached ---- */
  var wipes = [].slice.call(document.querySelectorAll(".wipe"));
  if(wipes.length && !reduce && "IntersectionObserver" in window){
    var wObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); wObs.unobserve(e.target); } });
    }, { threshold:0, rootMargin:"0px 0px -18% 0px" });
    wipes.forEach(function(el){ wObs.observe(el); });
  } else { wipes.forEach(function(el){ el.classList.add("in"); }); }

  /* ---- the bar shows once the hero has gone by, and takes the colour of
     whatever is under it ---- */
  var bar = document.querySelector(".js-bar"), hero = document.querySelector(".hero");
  var grounds = [].slice.call(document.querySelectorAll(".sec, .pl, .hero"));
  var foot = document.querySelector(".js-foot"), contactSec = document.getElementById("contact");
  /* the foot steps aside once the contact stage carries its own small print */
  function inContact(){ if(!contactSec) return false; var g = geo.grounds.filter(function(x){ return x.el === contactSec; })[0]; return g ? g.top - window.scrollY < window.innerHeight * .5 : false; }
  function barTick(){
    if(!bar || !hero) return;
    var sy = window.scrollY;
    bar.classList.toggle("on", geo.heroEnd - sy < 40);
    var y = sy + 28, ink = false, gg = geo.grounds;
    for(var i = 0; i < gg.length; i++){
      if(gg[i].top <= y && gg[i].bottom > y){ ink = gg[i].light; break; }
    }
    bar.classList.toggle("ink", ink);
    if(foot){ foot.classList.toggle("on", bar.classList.contains("on") && !inContact()); foot.classList.toggle("ink", ink); }
    /* belt and braces for observers that never fire: anything within the
       first screen is shown */
    var vh = window.innerHeight;
    if((barTick.n = (barTick.n || 0) + 1) % 3 === 0){
      wipes = wipes.filter(function(el){ if(el.classList.contains("in")) return false; if(el.getBoundingClientRect().top < vh * .82){ el.classList.add("in"); return false; } return true; });
      rv = rv.filter(function(el){ if(el.classList.contains("in")) return false; if(el.getBoundingClientRect().top < vh * .94){ el.classList.add("in"); return false; } return true; });
    }

  }

  if(reduce){ barTick(); window.addEventListener("scroll", barTick, { passive:true }); }

  function clamp01(n){ return n < 0 ? 0 : (n > 1 ? 1 : n); }

  var ticking = false;

  /* Words land as the locked panel is scrolled through, so it runs
     backwards too — scroll up and the sentence unwrites itself. */
  function locked(){
    var vh = window.innerHeight;
    locks.forEach(function(g){
      var run = g.hold.offsetHeight - vh, p;
      var stuck = getComputedStyle(g.hold.firstElementChild).position === "sticky";
      if(stuck && run > 40){ p = clamp01(-g.hold.getBoundingClientRect().top / run); }
      else {
        var r = g.words[0].parentNode.getBoundingClientRect();
        p = clamp01((vh * .88 - r.top) / (vh * .5));
      }
      if(g.hold.classList.contains("js-scenes")) p = clamp01((p - .02) / .22);
      var lead = p * (g.words.length + 2);
      g.words.forEach(function(w, i){
        if(i < lead) w.classList.add("on"); else w.classList.remove("on");
      });
    });
  }

  /* ---- the studio scenes: one stage, four scrolls, a ground that moves ---- */
  var scHold = document.querySelector(".js-scenes"), scStage = scHold && scHold.querySelector(".st-stage"),
      scs = scHold ? [].slice.call(scHold.querySelectorAll(".js-sc")) : [], scCue = scHold && scHold.querySelector(".js-cue"), scCueBar = scHold && scHold.querySelector(".st-cue"), scAt = "";
  var SC_NAMES = { a:"01 · Studio", b:"02 · What we make", c:"03 · Minimalism", d:"04 · Simplicity" };
  function scenes(){
    if(!scHold) return;
    var vh = window.innerHeight, run = Math.max(1, geo.scRun);
    var p = clamp01((window.scrollY - geo.sc) / run);
    var cur = p < .30 ? "a" : p < .58 ? "b" : p < .80 ? "c" : "d";
    if(window.innerWidth >= 900){ scStage.style.setProperty("--z", (1 + p * .9).toFixed(3)); scStage.style.setProperty("--py", Math.round(p * 90)); }
    if(scCueBar) scCueBar.style.setProperty("--p", p.toFixed(3));
    if(cur === scAt) return;
    scAt = cur; scStage.dataset.scene = cur;
    var order = ["a","b","c"], vis = cur === "d" ? "c" : cur;
    scs.forEach(function(el){
      var i = order.indexOf(el.dataset.s), j = order.indexOf(vis);
      el.classList.toggle("on", i === j); el.classList.toggle("gone", i < j);
    });
    if(scCue) scCue.textContent = SC_NAMES[cur];
    if(cur === "b") ltStart();
    if(cur === "c" || cur === "d"){ if(typeof spShow === "function") spShow(); }
    if(typeof spSwitch === "function" && sp){
      var want = cur === "d" ? "right" : "left";
      if((cur === "c" || cur === "d") && sp.dataset.side !== want) spSwitch(want);
    }
    if(lt){ ltSeen = cur === "b"; }
  }

  /* ---- the portfolio stage: five projects on one locked screen. It
     starts empty and ink; each project's pieces lay themselves out to
     fill the left side (justified rows, nothing cropped) as you scroll,
     and the names stand stacked on the right, the live one awake ---- */
  var wkHold = document.querySelector(".js-wk-hold"), wkStage = wkHold && wkHold.querySelector(".js-wk-stage"),
      wkSets = wkHold ? [].slice.call(wkHold.querySelectorAll(".js-wk-set")) : [], wkMedia = wkHold && wkHold.querySelector(".js-wk-media"),
      wkStk = wkHold && wkHold.querySelector(".js-wk-stk"), wkLines = wkHold ? [].slice.call(wkHold.querySelectorAll(".js-wk-stk .stk-l")) : [], wkText = wkHold && wkHold.querySelector(".wk-text"), wkProj = wkHold && wkHold.querySelector(".js-wk-proj"), wkMeta = wkHold && wkHold.querySelector(".js-wk-meta"),
      wkNote = wkHold && wkHold.querySelector(".js-wk-note"), wkCount = wkHold && wkHold.querySelector(".js-wk-count"), wkN = wkHold && wkHold.querySelector(".js-wk-n"),
      wkOpen = wkHold && wkHold.querySelector(".js-wk-open"), wkFilter = wkHold ? [].slice.call(wkHold.querySelectorAll(".js-wk-filter span")) : [],
      wkCue = wkHold && wkHold.querySelector(".wk-cue"), wkAt = -1, WK = window.__WK || [];
  function pad2(n){ return (n < 10 ? "0" : "") + n; }
  function wkRotate(txt){
    [].forEach.call(wkTitle.querySelectorAll(".w"), function(w){ w.classList.add("out"); setTimeout(function(){ if(w.parentNode) w.parentNode.removeChild(w); }, 700); });
    var w = document.createElement("span"), n = 0; w.className = "w";
    txt.split(" ").forEach(function(word, wi, arr){
      var ws = document.createElement("span"); ws.className = "wd";
      word.split("").forEach(function(ch){ var c = document.createElement("span"); c.className = "c"; c.textContent = ch; c.style.setProperty("--d", (n++ * .018).toFixed(3) + "s"); ws.appendChild(c); });
      w.appendChild(ws); if(wi < arr.length - 1) w.appendChild(document.createTextNode(" "));
    });
    wkTitle.appendChild(w);
    if(reduce){ w.classList.add("in"); return; }
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ w.classList.add("in"); }); });
  }
  function wkSwap(el, html){
    if(!el) return;
    if(reduce){ el.innerHTML = html; return; }
    el.classList.add("out"); setTimeout(function(){ el.innerHTML = html; el.classList.remove("out"); }, 260);
  }
  function wkLayout(){
    if(!wkMedia) return;
    var W = wkMedia.clientWidth, H = wkMedia.clientHeight, gap = 8;
    if(W < 10 || H < 10) return;
    wkSets.forEach(function(set){
      var items = [].slice.call(set.querySelectorAll(".wk-m"));
      var ars = items.map(function(m){ var r = m.style.getPropertyValue("--ar").split("/"); return parseFloat(r[0]) / parseFloat(r[1] || 1); });
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
      var y = 0, g = gap * best.scale;
      best.rows.forEach(function(row, ri){
        var h = best.hs[ri] * best.scale, x = 0;
        row.forEach(function(i){
          var w = h * ars[i], m = items[i];
          m.style.width = Math.round(w) + "px"; m.style.height = Math.round(h) + "px";
          m.style.left = Math.round(x) + "px"; m.style.top = Math.round(y) + "px";
          x += w + g;
        });
        y += h + g;
      });
      set.style.setProperty("--oy", Math.max(0, Math.round((H - (y - g)) / 2)) + "px");
    });
  }
  function wkFit(){
    if(!wkStk || !wkText) return;
    wkStk.style.setProperty("--fit", "1");
    var room = wkText.clientWidth - 4, widest = 0;
    wkLines.forEach(function(l){ widest = Math.max(widest, l.scrollWidth); });
    if(widest > room) wkStk.style.setProperty("--fit", (room / widest).toFixed(3));
  }
  function wkShow(i){
    if(i === wkAt) return;
    var first = wkAt < 0; wkAt = i;
    if(wkStage) wkStage.classList.toggle("live", i >= 0);
    wkLines.forEach(function(l, k){ l.classList.toggle("on", k === i); });
    if(!WK[i]){ wkCount.textContent = "— / " + pad2(WK.length); return; }
    wkSets.forEach(function(set, k){
      set.classList.toggle("on", k === i); set.classList.toggle("gone", k < i);
      [].forEach.call(set.querySelectorAll(".js-tile-v"), function(v){ if(k === i) vPlay(v); else v.pause(); });
    });
    wkFilter.forEach(function(sp, k){ sp.classList.toggle("on", k === i); });
    var meta = WK[i].meta, note = WK[i].note, proj = WK[i].proj, n = WK[i].n + (WK[i].n === 1 ? " piece" : " pieces");
    if(first){ wkProj.textContent = proj; wkMeta.textContent = meta; wkNote.textContent = note; wkN.textContent = n; }
    else { wkSwap(wkProj, proj); wkSwap(wkMeta, meta); wkSwap(wkNote, note); wkSwap(wkN, n); }
    wkCount.textContent = pad2(i + 1) + " / " + pad2(WK.length);
    wkOpen.textContent = WK[i].film ? "[ Play the film ]" : "[ Open full frame ]";
    var wkPdf = wkHold.querySelector(".js-wk-pdf"); if(wkPdf){ wkPdf.hidden = !WK[i].pdf; if(WK[i].pdf) wkPdf.href = WK[i].pdf; }
  }
  function wkTick(){
    if(!wkHold) return;
    var vh = window.innerHeight, run = Math.max(1, geo.wkRun), N = wkSets.length;
    var p = clamp01((window.scrollY - geo.wk) / run);
    var q = (p - .06) / .94, idx = q < 0 ? -1 : Math.min(N - 1, Math.floor(q * N)), seg = idx < 0 ? 0 : q * N - idx;
    if(wkCue) wkCue.style.setProperty("--p", p.toFixed(3));
    if(wkMedia) wkMedia.style.setProperty("--sy", ((.5 - seg) * 28).toFixed(1));
    wkShow(idx);
  }
  if(wkHold){
    wkHold.style.height = "calc(100svh + " + (wkSets.length * 80) + "vh)";
    var wkAll = function(){ wkLayout(); wkFit(); };
    wkAll(); window.addEventListener("resize", wkAll, { passive:true });
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(wkAll);
    /* the media area changes height on a phone (the browser bar collapsing, the text column
       swapping) and the tiles sit on measured coordinates, so any resize lays them out again */
    if("ResizeObserver" in window){ var wkRO = new ResizeObserver(function(){ wkLayout(); }); wkRO.observe(wkMedia); if(wkText) wkRO.observe(wkText); }
    wkOpen.addEventListener("click", function(){ var set = wkSets[wkAt]; var m = set && set.querySelector(".wk-m"); if(m) m.click(); });
    wkLines.forEach(function(l, k){ l.addEventListener("click", function(){
      var vh = window.innerHeight, run = Math.max(1, wkHold.offsetHeight - vh);
      window.scrollTo({ top: window.scrollY + wkHold.getBoundingClientRect().top + run * (.06 + .94 * (k + .5) / wkSets.length), behavior: reduce ? "instant" : "smooth" });
    }); });
  }

  /* ---- the home: words pull up (21st WordsPullUp), the film leans with the pointer ---- */
  var prisma = document.querySelector(".js-prisma");
  if(prisma){
    var pw = prisma.querySelector(".pw"), pvs = [].slice.call(prisma.querySelectorAll(".js-pv-v"));
    if(pw){ var txt = pw.textContent; pw.textContent = ""; txt.split("").forEach(function(ch, k){ var c = document.createElement("span"); c.className = "c"; c.textContent = ch; c.style.setProperty("--d", (k * .08 + .12).toFixed(2) + "s"); pw.appendChild(c); }); }
    function pvRun(){ pvs.forEach(function(v){ if(getComputedStyle(v).display === "none"){ v.pause(); } else vPlay(v); }); }
    pvRun(); window.addEventListener("resize", pvRun, { passive:true });
    if("IntersectionObserver" in window) new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) pvRun(); else pvs.forEach(function(v){ v.pause(); }); }); }, { threshold:.05 }).observe(prisma);
    if(!prisma.closest(".js-lk")) requestAnimationFrame(function(){ requestAnimationFrame(function(){ prisma.classList.add("pull"); }); });
    if(fine && !reduce){
      prisma.addEventListener("pointermove", function(e){
        var r = prisma.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        prisma.style.setProperty("--px", (x * -16).toFixed(1) + "px"); prisma.style.setProperty("--py", (y * -12).toFixed(1) + "px");
      });
      prisma.addEventListener("pointerleave", function(){ prisma.style.setProperty("--px", "0px"); prisma.style.setProperty("--py", "0px"); });
    }
  }

  /* ---- one-scroll locks: the panel holds for one screen of scroll and
     its pieces come in one after another as you scroll through it; a
     panel taller than the screen is left in flow and reveals as before ---- */
  var lks = [].slice.call(document.querySelectorAll(".js-lk")).map(function(h){
    return { hold:h, stage:h.firstElementChild, items:[].slice.call(h.querySelectorAll(".rv, .js-split, .js-pu2")) };
  });
  function lkMeasure(){
    lks.forEach(function(g){
      g.hold.classList.remove("nolock");
      var tall = g.stage.scrollHeight > window.innerHeight + 2;
      g.hold.classList.toggle("nolock", tall);
      if(tall) g.items.forEach(function(el){ if(el.getBoundingClientRect().top < window.innerHeight * .94) el.classList.add("in"); });
    });
  }
  function lkTick(){
    var vh = window.innerHeight;
    lks.forEach(function(g){
      if(g.hold.classList.contains("nolock")){
        g.items.forEach(function(el){ if(!el.classList.contains("in") && el.getBoundingClientRect().top < vh * .94) el.classList.add("in"); });
        return;
      }
      var run = Math.max(1, g.run || 1), p = clamp01((window.scrollY - g.top) / run), n = g.items.length;
      g.items.forEach(function(el, k){ el.classList.toggle("in", g === lks[0] || p >= .05 + .6 * (n > 1 ? k / (n - 1) : 0)); });
    });
  }
  if(lks.length){ lkMeasure(); window.addEventListener("resize", lkMeasure, { passive:true }); if(document.fonts && document.fonts.ready) document.fonts.ready.then(lkMeasure); }

  /* ---- page geometry, measured once: the scroll loop never asks layout
     for a rectangle, it compares scrollY with these ---- */
  var geo = { sc:0, scRun:1, wk:0, wkRun:1, heroEnd:0, grounds:[] };
  function docTop(el){ return el.getBoundingClientRect().top + window.scrollY; }
  function measureGeo(){
    var vh = window.innerHeight;
    if(scHold){ geo.sc = docTop(scHold); geo.scRun = scHold.offsetHeight - vh; }
    if(wkHold){ geo.wk = docTop(wkHold); geo.wkRun = wkHold.offsetHeight - vh; }
    lks.forEach(function(g){ g.top = docTop(g.hold); g.run = g.hold.offsetHeight - vh; });
    if(hero){ var hh = hero.closest(".js-lk") || hero; geo.heroEnd = docTop(hh) + hh.offsetHeight; }
    geo.grounds = grounds.map(function(el){ var h = el.closest(".js-lk") || el; var t = docTop(h); return { el:el, top:t, bottom:t + h.offsetHeight, light:el.classList.contains("light") }; });
  }
  measureGeo();
  window.addEventListener("resize", function(){ requestAnimationFrame(measureGeo); }, { passive:true });
  window.addEventListener("load", measureGeo);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ requestAnimationFrame(measureGeo); });
  setTimeout(measureGeo, 1500); setTimeout(measureGeo, 4000);

  function paint(){
    ticking = false;
    scenes();
    wkTick();
    lkTick();
    if(locks.length) locked();
    ltLock();
    barTick();
    prTick();
    sxTick();
  }

  function onScroll(){
    if(ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  paint();
})();

;

/* repeats of a still or a film point at the one copy carried in the file */
(function(){
  var own = {};
  ["src","poster"].forEach(function(attr){ [].forEach.call(document.querySelectorAll("[data-u-" + attr + "]"), function(e){ own[e.getAttribute("data-u-" + attr)] = e; }); });
  ["src","poster"].forEach(function(attr){
    [].forEach.call(document.querySelectorAll("[data-ref-" + attr + "]"), function(e){
      var ref = e.getAttribute("data-ref-" + attr).split("|"), o = own[ref[0]]; if(o) e.setAttribute(attr, o.getAttribute(ref[1] || attr));
    });
  });
})();
/* Safari will not play a film carried as a data: URI (it wants byte ranges), so
   every film is handed over as a blob: URL held in memory before the page script runs */
(function(){
  function swap(el, attr){
    var u = el.getAttribute(attr); if(!u || u.indexOf("data:video") !== 0) return;
    try{
      var parts = u.split(","), mime = parts[0].slice(5).split(";")[0], bin = atob(parts[1]), len = bin.length, arr = new Uint8Array(len);
      for(var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
      el.setAttribute(attr, URL.createObjectURL(new Blob([arr], { type: mime })));
    }catch(e){}
  }
  [].forEach.call(document.querySelectorAll("video[src], source[src]"), function(el){ swap(el, "src"); });
  [].forEach.call(document.querySelectorAll("video"), function(v){ if(v.querySelector("source")) v.load(); });
})();

;

/* what loads first: the hero cut this screen shows, and nothing else heavy until it is needed */
(function(){
  var mq = matchMedia("(max-width:820px)");
  function hero(){ [].forEach.call(document.querySelectorAll(".js-pv-v"), function(v){
    var mine = v.classList.contains("pv-m") === mq.matches;
    if(mine && !v.getAttribute("src")){ v.src = v.getAttribute("data-src"); v.preload = "auto"; v.load(); }
  }); }
  hero(); if(mq.addEventListener) mq.addEventListener("change", hero);
  var mv = document.querySelector(".js-method-v");
  if(mv){
    function arm(){ if(mv.getAttribute("src")) return; mv.src = matchMedia("(max-width: 767px)").matches ? mv.getAttribute("data-src-m") : mv.getAttribute("data-src"); mv.preload = "auto"; var p = mv.play(); if(p && p.catch) p.catch(function(){}); }
    if("IntersectionObserver" in window) new IntersectionObserver(function(es, o){ es.forEach(function(e){ if(e.isIntersecting){ arm(); o.disconnect(); } }); }, { rootMargin:"150% 0px" }).observe(mv);
    else arm();
  }
})();

;

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
/* the wall: the meta column follows whichever row sits mid-screen; a hovered tile prints its name at the top right;
   the page snaps to rows while the wall is on screen */
(function(){
  var sec = document.querySelector(".js-pg"); if(!sec) return;
  var tiles = [].slice.call(sec.querySelectorAll(".js-pg-tile")), metas = [].slice.call(sec.querySelectorAll(".js-pg-meta")), count = sec.querySelector(".js-pg-count"),
      hov = sec.querySelector(".js-pg-hover"), hn = sec.querySelector(".js-pg-hn"), hp = sec.querySelector(".js-pg-hp"), ticking = false, at = -1, N = metas.length, snap = false;
  function frame(){
    ticking = false; var vh = window.innerHeight, line = vh * .5, best = -1, bd = 1e9, r0 = sec.getBoundingClientRect();
    var want = r0.top < vh * .5 && r0.bottom > vh * .5 && window.innerWidth > 820; if(want !== snap){ snap = want; document.documentElement.classList.toggle("pg-snap", snap); }
    tiles.forEach(function(t){ var r = t.getBoundingClientRect(); if(r.bottom < 0 || r.top > vh) return; var c = (r.top + r.bottom) / 2, d = Math.abs(c - line); if(r.top <= line && r.bottom >= line) d = -1; if(d < bd){ bd = d; best = +t.dataset.i; } });
    if(best < 0 || best === at) return; at = best;
    metas.forEach(function(m, k){ m.classList.toggle("on", k === best); }); if(count) count.textContent = (best + 1 < 10 ? "0" : "") + (best + 1) + " / " + (N < 10 ? "0" : "") + N;
  }
  [].slice.call(sec.querySelectorAll(".js-pg-open")).forEach(function(btn){
    var i = btn.dataset.i, more = [].slice.call(sec.querySelectorAll(".pg-more[data-i='" + i + "']")), lbl = btn.querySelector(".js-pg-open-t");
    function toggle(){
      var open = !btn.classList.contains("open"); btn.classList.toggle("open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); if(lbl) lbl.textContent = open ? "Close project" : "Reveal full project";
      if(open){ more.forEach(function(m, k){ m.hidden = false; m.classList.remove("in"); m.classList.remove("out"); m.style.setProperty("--k", k % 2 + Math.floor(k / 2)); }); void sec.offsetWidth; requestAnimationFrame(function(){ more.forEach(function(m){ m.classList.add("in"); }); }); }
      else { more.forEach(function(m){ m.classList.remove("in"); }); setTimeout(function(){ more.forEach(function(m){ m.hidden = true; }); }, 700); }
      frame();
    }
    btn.addEventListener("click", toggle); btn.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggle(); } });
  });
  tiles.forEach(function(t){
    t.addEventListener("mouseenter", function(){ if(hn) hn.textContent = t.dataset.name || ""; if(hp) hp.textContent = t.dataset.piece || ""; if(hov) hov.classList.add("on"); });
    t.addEventListener("mouseleave", function(){ if(hov) hov.classList.remove("on"); });
  });
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true }); window.addEventListener("resize", frame); frame();
})();
/* the scatter: a project's screen settles when it arrives and is thrown again when it leaves */
(function(){
  var sec = document.querySelector(".js-sx"); if(!sec) return;
  var panels = [].slice.call(sec.querySelectorAll(".js-sx-panel")), ticking = false;
  function frame(){
    ticking = false; var vh = window.innerHeight;
    panels.forEach(function(p){ var r = p.getBoundingClientRect(); var on = r.top < vh * .55 && r.bottom > vh * .45; p.classList.toggle("org", on); });
  }
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true }); window.addEventListener("resize", frame); window.addEventListener("load", frame); frame();
})();
/* the editorial hero: the rules draw when the lines arrive */
(function(){
  var rules = [].slice.call(document.querySelectorAll(".js-he-rule")); if(!rules.length) return;
  var first = document.querySelector(".hero .js-pu2"); if(!first) return;
  var mo = new MutationObserver(function(){ var on = first.classList.contains("in"); rules.forEach(function(r){ r.classList.toggle("in", on); }); });
  mo.observe(first, { attributes:true, attributeFilter:["class"] }); rules.forEach(function(r){ r.classList.toggle("in", first.classList.contains("in")); });
})();
/* the scatter, settled for real: each screen's resting positions are worked out in the browser against the actual
   text box and screen, with a seeded shuffle per screen so they stay put between visits; nothing overlaps */
(function(){
  var sec = document.querySelector(".js-sx"); if(!sec) return;
  var panels = [].slice.call(sec.querySelectorAll(".js-sx-panel")), phone = function(){ return window.innerWidth <= 820; };
  function rng(seed){ return function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  function hit(a, b, m){ return !(a.x + a.w < b.x - m || a.x > b.x + b.w + m || a.y + a.h < b.y - m || a.y > b.y + b.h + m); }
  function layout(p, i){
    var W = p.clientWidth, H = p.clientHeight, txt = p.querySelector(".js-sx-text"), tr = txt.getBoundingClientRect(), pr = p.getBoundingClientRect();
    var tb = { x: tr.left - pr.left, y: tr.top - pr.top, w: tr.width, h: tr.height };
    var tiles = [].slice.call(p.querySelectorAll(".js-sx-t")).filter(function(t){ return getComputedStyle(t).display !== "none"; });
    var r = rng(17 + i * 101), m = Math.max(10, W * .012), placed = [], top = phone() ? H * .06 : H * .05, bottom = phone() ? tb.y - m : H * .95;
    tiles.forEach(function(t, k){
      var ar = (t.style.getPropertyValue("--ar") || "4/5").split("/"), a = parseFloat(ar[0]) / parseFloat(ar[1] || 1);
      var wmin = phone() ? W * .30 : W * .15, wmax = phone() ? W * .44 : W * .23, box = null, tries = 0, scale = 1;
      while(!box && tries < 4000){
        tries++; if(tries % 800 === 0) scale *= .88;
        var w = (wmin + r() * (wmax - wmin)) * scale, h = w / a; if(h > (bottom - top) * .9) continue;
        var x = W * .02 + r() * (W * .96 - w), y = top + r() * (bottom - top - h), b = { x: x, y: y, w: w, h: h };
        if((!phone() && hit(b, tb, m)) || placed.some(function(o){ return hit(b, o, m); })) continue;
        box = b;
      }
      if(!box) box = { x: W * .02 + k * W * .3, y: top, w: wmin * .8, h: wmin * .8 / a };
      placed.push(box);
      t.style.setProperty("--ox", (box.x / W * 100).toFixed(2)); t.style.setProperty("--oy", (box.y / H * 100).toFixed(2)); t.style.setProperty("--ow", (box.w / window.innerWidth * 100).toFixed(2));
      t.style.setProperty("--px", (box.x / W * 100).toFixed(2)); t.style.setProperty("--py", (box.y / H * 100).toFixed(2)); t.style.setProperty("--pw", (box.w / window.innerWidth * 100).toFixed(2));
    });
  }
  function all(){ panels.forEach(layout); }
  var t; window.addEventListener("resize", function(){ clearTimeout(t); t = setTimeout(all, 150); }); window.addEventListener("load", all); if(document.fonts && document.fonts.ready) document.fonts.ready.then(all); all();
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
/* the things list: the thumbnails sit in one column past the widest word and the list keeps room for them, so none
   runs off the edge of the screen */
(function(){
  var sec = document.querySelector(".js-td"); if(!sec) return;
  var list = sec.querySelector(".td-list"), items = [].slice.call(sec.querySelectorAll(".td-item")); if(!list || !items.length) return;
  function fit(){
    var gap = Math.max(12, Math.min(32, window.innerWidth * .02)), maxName = 0, maxThumb = 0;
    items.forEach(function(it){ var nm = it.querySelector(".td-name"), th = it.querySelector(".td-thumb"); if(nm) maxName = Math.max(maxName, nm.getBoundingClientRect().width); if(th){ var h = th.getBoundingClientRect().height, ar = (th.style.getPropertyValue("--ar") || "4/5").split("/"); maxThumb = Math.max(maxThumb, h * parseFloat(ar[0]) / parseFloat(ar[1] || 1)); } });
    if(window.innerWidth <= 820){ list.style.paddingRight = ""; list.style.removeProperty("--tx"); list.style.removeProperty("--tmax"); return; }
    var free = window.innerWidth - list.getBoundingClientRect().left - maxName - gap * 2; var tw = Math.min(maxThumb, Math.max(40, free));
    list.style.setProperty("--tx", (maxName + gap).toFixed(1) + "px"); list.style.paddingRight = (tw + gap).toFixed(1) + "px"; list.style.setProperty("--tmax", tw.toFixed(1) + "px");
  }
  window.addEventListener("resize", fit); window.addEventListener("load", fit); if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit); fit();
})();

/* our work: a row marked soon tells instead of leaving */
(function(){ [].forEach.call(document.querySelectorAll(".js-ow-row[data-soon]"), function(a){ a.addEventListener("click", function(e){ e.preventDefault(); var g=a.querySelector(".ow-go"); if(g){ g.textContent="Link coming"; } }); }); })();

/* our work: a client row opens its pieces below it with the side wipe, and closes them again */
(function(){
  [].forEach.call(document.querySelectorAll(".js-ow-client"), function(a){
    var gal = a.nextElementSibling, go = a.querySelector(".js-ow-go"); if(!gal || !gal.classList.contains("js-ow-gal")) return;
    var pieces = [].slice.call(gal.querySelectorAll(".ow-piece"));
    function toggle(e){ e.preventDefault(); var open = !a.classList.contains("open"); a.classList.toggle("open", open); a.setAttribute("aria-expanded", open ? "true" : "false");
      if(open){ gal.hidden = false; pieces.forEach(function(p){ p.classList.remove("in"); }); void gal.offsetWidth; requestAnimationFrame(function(){ pieces.forEach(function(p){ p.classList.add("in"); }); }); if(go) go.firstChild.textContent = "Close"; }
      else { pieces.forEach(function(p){ p.classList.remove("in"); }); setTimeout(function(){ gal.hidden = true; }, 700); if(go) go.firstChild.textContent = "Reveal"; } }
    a.addEventListener("click", toggle); a.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " ") toggle(e); });
  });
})();

/* the field: the scroll lifts every piece up through the pinned stage in lanes (three across on desktop, two on a
   phone), each lane at its own speed so the field has depth; inside a lane the pieces are stacked with a gap measured
   from their real heights, so none ever sits on another. One project at a time: its pieces enter from below, cross
   the stage and leave at the top; then the stage is empty for a stretch, the name goes, and the next project's name
   and pieces arrive. Smoothed frame to frame so it feels filmed */
(function(){
  var sec = document.querySelector(".js-fy"); if(!sec) return;
  var hold = sec.querySelector(".js-fy-hold"), cards = [].slice.call(sec.querySelectorAll(".js-fy-card")), names = [].slice.call(sec.querySelectorAll(".js-fy-name")), N = names.length,
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, at = -1, GAP = 7, REST = 26, cur = -1, target = 0, raf = 0, laid = 0, total = 1, bands = [];
  var C = cards.map(function(c){ return { el: c, i: +c.dataset.i, lane: +c.dataset.lane, c: 0, s: 1, x: 0, h: 0, hidden: false }; });
  function clamp(v){ return Math.min(1, Math.max(0, v)); }
  function layout(){
    var vh = window.innerHeight, vw = window.innerWidth, phone = vw < 820,
        xs = phone ? [-24, 24] : [-33, 0, 33], sp = phone ? [1, .8] : [1, .76, 1.18], L = xs.length, cam0 = 0;
    bands = [];
    for(var pi = 0; pi < N; pi++){
      var cursor = xs.map(function(){ return cam0; }), exit = cam0;
      C.forEach(function(o){
        if(o.i !== pi) return; o.hidden = getComputedStyle(o.el).display === "none"; if(o.hidden) return;
        var l = o.lane % L; o.x = xs[l]; o.s = sp[l]; o.h = o.el.offsetHeight / vh * 100;
        var edge = (50 + o.h / 2 + 3) / o.s, c = Math.max(cursor[l], cam0 + edge);   /* enters from below the screen once the band starts */
        o.c = c; cursor[l] = c + (o.h + GAP) / o.s; exit = Math.max(exit, c + edge);   /* has left the top by here */
      });
      bands.push([cam0, exit]); cam0 = exit + REST;
    }
    total = Math.max(1, cam0 - REST + 6); laid = vw * 10000 + vh;
  }
  function place(cam){
    var vh = window.innerHeight, vw = window.innerWidth; if(laid !== vw * 10000 + vh) layout();
    C.forEach(function(o){
      if(o.hidden) return; var y = (o.c - cam) * o.s;
      if(y < -120 || y > 120){ o.el.style.visibility = "hidden"; return; }
      o.el.style.visibility = "visible";
      o.el.style.transform = "translate3d(calc(-50% + " + (o.x * vw / 100).toFixed(1) + "px), calc(-50% + " + (y * vh / 100).toFixed(1) + "px), 0)";
    });
    var band = -1; for(var k = 0; k < bands.length; k++){ if(cam >= bands[k][0] - 12 && cam <= bands[k][1] + 1){ band = k; break; }   /* the name comes a beat before its first piece */ }
    if(band !== at){ names.forEach(function(n, k){ n.classList.toggle("off", k === at); n.classList.toggle("on", k === band); }); at = band; }
  }
  function tick(){
    raf = 0; cur += (target - cur) * .16; if(Math.abs(target - cur) < .02) cur = target; place(cur);
    if(cur !== target) raf = requestAnimationFrame(tick);
  }
  function onScroll(){
    if(reduce) return; var vh = window.innerHeight, vw = window.innerWidth, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    if(laid !== vw * 10000 + vh) layout();
    var run = Math.max(1, hold.offsetHeight - vh), p = clamp(-b.top / run); target = p * total;
    if(cur < 0) cur = target; if(!raf) raf = requestAnimationFrame(tick);
  }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", function(){ laid = 0; onScroll(); place(cur < 0 ? 0 : cur); });
  window.addEventListener("load", function(){ laid = 0; onScroll(); place(cur < 0 ? 0 : cur); }); onScroll(); place(cur < 0 ? 0 : cur);
})();

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



/* the wall: a filter keeps one field's marks; the kept ones rise again in order */
(function(){
  var w = document.querySelector(".js-lw"); if(!w) return;
  var fs = [].slice.call(w.querySelectorAll(".js-lw-f")), cells = [].slice.call(w.querySelectorAll(".js-lw-cell"));
  fs.forEach(function(f){ f.addEventListener("click", function(){
    var c = f.dataset.cat; fs.forEach(function(g){ g.classList.toggle("on", g === f); });
    cells.forEach(function(el){ var show = c === "all" || el.dataset.cat === c; el.classList.toggle("off", !show); el.classList.remove("in"); });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ var n = 0; cells.forEach(function(el){ if(!el.classList.contains("off")){ el.style.setProperty("--k", n++); el.classList.add("in"); } }); }); });
  }); });
})();

