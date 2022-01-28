// Show and hide explanation classes

$('.showExplanation').click(function() {
  $(this).next().toggle();
}
)
$('.explanation').click(function() {
  $(this).toggle();
}
)
//Hide explanations to start
$('.explanation').css("display", "none");

// Accordion functionality

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

var acc1 = document.getElementsByClassName("alternative-accordion");

for (i = 0; i < acc1.length; i++) {
  acc1[i].addEventListener("click", function() {
    this.classList.toggle("active-alternative-accordion");
  });
}

