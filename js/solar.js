$(window).load(function(){
  var body = $("body"),
  universe = $("#universe"),
  solarsys = $("#solar-system");
  setTimeout(function(){
    firstTime = false;
  }, 5000)
  var init = function() {
    body.removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
      $(this).removeClass('hide-UI').addClass("set-speed");
      $(this).dequeue();
    });
  };

  var setView = function(view) {
    universe.removeClass().addClass(view);
  };

  $("#toggle-data").click(function(e) {
    body.toggleClass("data-open data-close");
    e.preventDefault();
  });

  $("#toggle-controls").click(function(e) {
    body.toggleClass("controls-open controls-close");
    e.preventDefault();
  });

  $("#data .url-container > a").click(function(e) {
    var ref = $(this).attr("class").replace('hide-planet', '');
    solarsys.removeClass().addClass(ref);
    $("#data .url-container > a[href!='" + $(this).attr("href") + "']").removeClass('active show-planet').addClass("hide-planet");
    $(this).removeClass("hide-planet").addClass('active show-planet');
    $("#data .url-container > a").addClass("disabled-motion");
    
    $(".info-button-container").addClass("show");
    $(".info-button-container a").removeClass("info-active").addClass("disabled-motion hide");
    $(".info-button-container a[id='hide-info']").removeClass("disabled-motion hide");
    $(".info-button-container a[id='" + $(this).attr("title") + "-info']").addClass("info-active").removeClass("disabled-motion hide");
    e.preventDefault();
  });
  
  $(".info-button-container a[id='hide-info']").click(function(e){
    $(".info-button-container").removeClass("show");
    $("#data .url-container > a").removeClass("hide-planet show-planet");
    
    setTimeout(function(){
      $("#data .url-container > a").removeClass("disabled-motion");
    }, 2000)
    e.preventDefault();
  })

  $(".info-button-container a[id!='hide-info']").click(function(e){
    var htmlName = $(this).attr("href").replace(/-info/, '') + ".html";
    $.colorbox({href: htmlName, fixed: true, width: "80%", height: "80%", onLoad: function(){
        $('#cboxClose').remove();
    }});
    e.preventDefault();
  })

  $(".set-view").click(function() {
    body.toggleClass("view-3D view-2D");
    var viewEl = $(this);
    viewEl.addClass("disabled-motion");
    setTimeout(function(){
      viewEl.removeClass("disabled-motion")
    }, 2000)
  });
  $(".set-zoom").click(function() {
    body.toggleClass("zoom-large zoom-close");
    var zoomEl = $(this);
    zoomEl.addClass("disabled-motion");
    setTimeout(function(){
      zoomEl.removeClass("disabled-motion")
    }, 2000)
  });
  $(".set-speed").click(function() {
    setView("scale-stretched set-speed");
  });
  $(".set-size").click(function() {
    setView("scale-s set-size");
  });
  $(".set-distance").click(function() {
    setView("scale-d set-distance");
  });

  init();

});

//$(document).bind("click", "#controls", function(){
//  $(this).find("input").trigger("click");
//})

$(document).bind("cbox_cleanup", function(){
  $("#solar-system").removeClass("hide-planet");
  $("#data a").removeClass("disabled-motion");
  $(".info-button-container a.info-active").removeClass("disabled-motion");
  $("#controls label").removeClass("disabled-motion");
  $(".set-view").removeClass("disabled-motion");
  $(".set-zoom").removeClass("disabled-motion");

  $("div#close-modal-box").addClass("disabled-motion");
  $("div#scroll-up").addClass("disabled-motion");
  $("div#scroll-down").addClass("disabled-motion");

  $("#canvas-source").removeClass("more-index");
})

$(document).bind("cbox_load", function(){
  $("#solar-system").addClass("hide-planet");

  $("#data a").addClass("disabled-motion");
  $(".info-button-container a").addClass("disabled-motion");
  $("#controls label").addClass("disabled-motion");
  $(".set-view").addClass("disabled-motion");
  $(".set-zoom").addClass("disabled-motion");

  $("div#close-modal-box").removeClass("disabled-motion");
  
  $("#canvas-source").addClass("more-index");

})

$(document).bind("cbox_complete", function(){
  if($("#cboxLoadedContent").hasVerticalScrollbar() == true){
    $("div#scroll-down").removeClass("disabled-motion");
  }  
})

$(document).on("click", "div#close-modal-box", function(){
  $.colorbox.close();
})

$(document).on("click", "#scroll-up", function(){
  var topPos = $("#cboxLoadedContent").scrollTop();

  $("#cboxLoadedContent").animate({scrollTop: topPos - 40 + "px"}, 400, function(){
    var bottomPos = ($("#cboxLoadedContent").height() + $("#cboxLoadedContent").scrollTop());
    var scrollHeight = $("#cboxLoadedContent")[0].scrollHeight;
    var topPos = $("#cboxLoadedContent").scrollTop();
    if ($("#cboxLoadedContent").scrollTop() == 0){
      $("div#scroll-up").addClass("disabled-motion");
      $("div#scroll-down").removeClass("disabled-motion");
    } else if(topPos > 0 && scrollHeight > bottomPos) {
      $("div#scroll-up").removeClass("disabled-motion");
      $("div#scroll-down").removeClass("disabled-motion");
    }
  })
})

$(document).on("click", "#scroll-down", function(){
  var topPos = $("#cboxLoadedContent").scrollTop();

  $("#cboxLoadedContent").animate({scrollTop: topPos + 40 + "px"}, 400, function(){
    var bottomPos = ($("#cboxLoadedContent").height() + $("#cboxLoadedContent").scrollTop());
    var scrollHeight = $("#cboxLoadedContent")[0].scrollHeight;
    var topPos = $("#cboxLoadedContent").scrollTop();

    if (scrollHeight == bottomPos){
      $("div#scroll-up").removeClass("disabled-motion");
      $("div#scroll-down").addClass("disabled-motion");
    } else if(topPos > 0 && scrollHeight > bottomPos) {
      $("div#scroll-up").removeClass("disabled-motion");
      $("div#scroll-down").removeClass("disabled-motion");
    }
  })
})