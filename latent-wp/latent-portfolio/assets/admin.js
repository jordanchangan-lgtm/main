/* the Project editor: pick pieces from the Media Library, reorder, label, choose a poster frame for films */
(function($){
  var L = window.LATENT_ADMIN || {};
  var $list = $(".js-latent-pieces"), $json = $(".js-latent-pieces-json"), tpl = $(".js-latent-row").html();
  function sync(){
    var out = [];
    $list.children().each(function(){
      var $r = $(this);
      out.push({ id: +$r.data("id"), label: $r.find(".js-latent-label").val(), poster: +$r.attr("data-poster") || 0, ar: $r.find(".js-latent-ar").text().indexOf("/") > 0 ? $r.find(".js-latent-ar").text() : "" });
    });
    $json.val(JSON.stringify(out));
  }
  function arOf(att){ return att.width && att.height ? att.width + "/" + att.height : ""; }
  function row(att){
    var $r = $(tpl), video = (att.mime || att.type) && ((att.mime || "").indexOf("video/") === 0 || att.type === "video");
    $r.attr("data-id", att.id).data("id", att.id).attr("data-poster", 0).attr("data-video", video ? 1 : 0).toggleClass("is-video", !!video);
    var thumb = video ? (att.image && att.image.src && att.image.src.indexOf("/wp-includes/") < 0 ? att.image.src : "") : ((att.sizes && (att.sizes.thumbnail || att.sizes.medium) || {}).url || att.url);
    $r.find(".latent-thumb").css("background-image", thumb ? "url(" + thumb + ")" : "").html(video ? "<b>" + (L.film || "Film") + "</b>" : "");
    $r.find(".js-latent-ar").text(arOf(att) || "—");
    if(!video) $r.find(".js-latent-poster").remove();
    $r.find(".js-latent-label").val(att.title && !/^\w+-\d+$/.test(att.title) ? "" : "");
    return $r;
  }
  $list.sortable({ update: sync });
  $list.on("input", ".js-latent-label", sync);
  $list.on("click", ".js-latent-remove", function(){ $(this).closest("li").remove(); sync(); });
  $(".js-latent-add").on("click", function(){
    var frame = wp.media({ title: L.pick, multiple: "add", library: { type: ["image", "video"] }, button: { text: L.add } });
    frame.on("select", function(){ frame.state().get("selection").each(function(m){ $list.append(row(m.toJSON())); }); sync(); });
    frame.open();
  });
  $list.on("click", ".js-latent-poster", function(){
    var $r = $(this).closest("li");
    var frame = wp.media({ title: L.poster, multiple: false, library: { type: "image" }, button: { text: L.use } });
    frame.on("select", function(){
      var att = frame.state().get("selection").first().toJSON();
      $r.attr("data-poster", att.id).find(".latent-thumb").css("background-image", "url(" + ((att.sizes && att.sizes.thumbnail || {}).url || att.url) + ")");
      if($r.find(".js-latent-ar").text().indexOf("/") < 0 && arOf(att)) $r.find(".js-latent-ar").text(arOf(att));
      sync();
    });
    frame.open();
  });
  $(".js-latent-pdf").on("click", function(){
    var frame = wp.media({ title: "PDF", multiple: false, library: { type: "application/pdf" }, button: { text: "Use this PDF" } });
    frame.on("select", function(){ var att = frame.state().get("selection").first().toJSON(); $("input[name=_latent_pdf]").val(att.id); $(".latent-pdf-name").text(att.filename || att.title); $(".js-latent-pdf-clear").prop("hidden", false); });
    frame.open();
  });
  $(".js-latent-pdf-clear").on("click", function(){ $("input[name=_latent_pdf]").val(0); $(".latent-pdf-name").text("None"); $(this).prop("hidden", true); });
  sync();
})(jQuery);
