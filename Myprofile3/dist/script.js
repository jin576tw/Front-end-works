$(window).scroll(function(evt){
  if ($(window).scrollTop()>0) {
    $(".navbar").removeClass("navbar-top");
    $(".navbar").addClass("bg-light");
    $(".navbar").addClass("navbar-light ");
    
  }
  else {
      $(".navbar").addClass("navbar-top");
      $(".navbar").removeClass("bg-light");
      $(".navbar").removeClass("navbar-light ");
  }

});

if ($(document).height() > $(window).height()) {
    $("html").addClass("noscroll");
}else{
    $("html").addClass("fixWindow"); 
}


if ($(document).height() > $(window).height()) {
     $("html").removeClass("noscroll");
 }else{
    $("html").removeClass("fixWindow");
}


var s = skrollr.init();