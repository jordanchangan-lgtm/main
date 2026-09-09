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
