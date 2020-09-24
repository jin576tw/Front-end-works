var vm= new Vue({
  el: "#app",
  data: {
    classes: [{},{}]
  }
});

$.ajax({
  url: "https://awiclass.monoame.com/api/command.php?type=get&name=hahowdata",  
  success: function(res){
    vm.classes=JSON.parse(res);
 }
});