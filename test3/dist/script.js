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


$('#newChickItem').on('hidden.bs.modal', function () {
      document.getElementsByTagName('body')[0].className = 'modal-open';
});

var s = skrollr.init();