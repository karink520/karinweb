$(".example").hide()
$(".explanation").hide()
$(".example-header").hide()

$(".has-explanation").click(function(){
    $(".example").hide()
    $(".explanation").hide()
    $(".has-explanation").removeClass("highlight-yellow")
    $(this).addClass("highlight-yellow")
    var classToShow = String("." + $(this).attr('id') + "-info");
    console.log(classToShow);
    $(classToShow).show()
  //toggle explanation and examples - show or hide.
  //set explanation and examples
})

var readmeExp = "A file with basics about the project"
$('.readme-what').attr('title', 
    readmeExp);

//$( document ).tooltip();
$( document ).tooltip( {
  // close: function( event, ui ) {
  //   $(this).css("z-index","4")
  // }
});
