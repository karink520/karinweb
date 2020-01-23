var selectedEquation = "lif"
var cellParameters =
{"appliedcurrent": 0, "membranecapacitance": 100e-12, "leakconductance": 10e-9, "leakequilibriumpotential": -70e-3, "selectedEquation":selectedEquation, "delta_th": 5e-3};
var currdataset = calculatevoltagetrace(cellParameters);
plotVoltageTrace(currdataset);
setModelAdjustmentPane(selectedEquation);
//setEquationText(selectedEquation);
renderKatex();

//Highlight selected equation
$('button').on('click', function(){
  $('button').removeClass('highlight');
  $(this).addClass('highlight');
  selectedEquation = this.id;
  cellParameters.selectedEquation = selectedEquation;
  if (selectedEquation == "hodgkinhuxley") {
    cellParameters.leakequilibriumpotential = -0.060;
  }
  setEquationText(this.id)
  setModelAdjustmentPane(selectedEquation);
  plotVoltageTrace(calculatevoltagetrace(cellParameters))
});
$( window ).resize(function() {
  plotVoltageTrace(calculatevoltagetrace(cellParameters));
});

function setEquationText(selectedEquation){
    if (selectedEquation == "lif") {
      katex.render(lifEquationLine1, modelEquation, {  throwOnError: false  });
      katex.render(lifEquationLine2, modelEquationLine2, { throwOnError: false });
      katex.render("", modelEquationLine3, { throwOnError: false  });
      katex.render("", modelEquationLine4, { throwOnError: false  });
    } else if (selectedEquation == "elif") {
      katex.render(elifEquationLine1, modelEquation, {  throwOnError: false  });
      katex.render(lifEquationLine2, modelEquationLine2, {  throwOnError: false  });
      katex.render("", modelEquationLine3, { throwOnError: false  });
      katex.render("", modelEquationLine4, { throwOnError: false  });
    } else if (selectedEquation == "hodgkinhuxley"){
      katex.render(hodgkinhuxleyEquationLine1, modelEquation, {  throwOnError: false  });
      katex.render(hodgkinhuxleyEquationLine2, modelEquationLine2, { throwOnError: false  });
      katex.render(hodgkinhuxleyEquationLine3, modelEquationLine3, { throwOnError: false  });
      katex.render(hodgkinhuxleyEquationLine4, modelEquationLine4, { throwOnError: false  });
    }

}

function setModelAdjustmentPane(selectedEquation){
      $('#modeladjustmentpane').empty();
      //Applied Current

      if(cellParameters.selectedEquation == "lif" || cellParameters.selectedEquation == "elif"){
        var property = {"title": "Applied Current", "id": "appliedcurrent", 'katex': 'I_app', "min": "0", "max": "50","defaultValue": "0", "units": "nA", "SIFactor":"-11"}
        $('#modeladjustmentpane').append(makeSlider(property));
        makeResponseToSlider(property);

        //Membrane Capacitance
        property = {"title": "Membrane Capacitance", "id": "membranecapacitance", 'katex': 'C_m', "min": "50", "max": "200","defaultValue": "100", "units": "pF", "SIFactor":"-12"}
        $('#modeladjustmentpane').append(makeSlider(property));
        makeResponseToSlider(property);

        //Leak Conductance
        property = {"title": "Leak Conductance", "id": "leakconductance", 'katex': 'G_L', "min": "3", "max": "20","defaultValue": "10", "units": "nS", "SIFactor":"-9"}
        $('#modeladjustmentpane').append(makeSlider(property));
        makeResponseToSlider(property)

        //Equilibrium Potential
        property = {"title": "Equilibrium Potential", "id": "leakequilibriumpotential", 'katex': 'E_L', "min": "-80", "max": "-40","defaultValue": "-70", "units": "mV", "SIFactor":"-3"}
        $('#modeladjustmentpane').append(makeSlider(property));
        makeResponseToSlider(property);
        renderKatex();
    }

    if (cellParameters.selectedEquation == "elif") {
      console.log('elif selected');
      property = {"title": "Spike Voltage Range Constant", "id": "delta_th", 'katex': 'Delta_th', "min": "2", "max": "20","defaultValue": "5", "units": "mV", "SIFactor":"-3"}
      $('#modeladjustmentpane').append(makeSlider(property));
      makeResponseToSlider(property)
      katex.render("\\Delta_{th}", Delta_th, {throwOnError: false });
     }

    if (cellParameters.selectedEquation =="hodgkinhuxley"){
      property = {"title": "Applied Current", "id": "appliedcurrent", 'katex': 'I_app', "min": "0", "max": "100","defaultValue": "0", "units": "nA", "SIFactor":"-11"}
           $('#modeladjustmentpane').append(makeSlider(property));
       makeResponseToSlider(property);
       katex.render("I_{app}", I_app, {  throwOnError: false});
    }
  }

 function makeSlider(p){
   var label = "<label for='" + p.id + "'>" + p.title + ": <span id='" + p.katex+ "'></span><span> = " + p.defaultValue + " " + p.units + "</span></label>";
   var sliderInput = "<input name='" + p.id + "' type='range' min='" + p.min + "' max='" + p.max + "' value='" + p.defaultValue + "' class='slider' id='" + p.id + "Range'>"
   return "<div class='slidecontainer'>" + label + sliderInput + "</div>";
 }

 function makeResponseToSlider(p){
   var slider = document.getElementById(p.id + "Range");
   slider.oninput = function() {
     this.previousElementSibling.childNodes[2].innerHTML =  " = " + this.value + p.units;
     cellParameters[p.id] = this.value * Number(1 + 'E' + p.SIFactor);
     console.log(cellParameters);
     plotVoltageTrace(calculatevoltagetrace(cellParameters));
   }
 }

var lifEquationLine1 = "C_m \\dfrac{dV_m}{dt} = G_L (E_L - V_m) + I_{app} ";
var lifEquationLine2 = "\\text{if } V_m > V_{th} \\text{ then } V_m \\mapsto V_{reset}";

var elifEquationLine1 = "C_m \\dfrac{dV_m}{dt} = G_L \\left(E_L - V_m + \\Delta_{th} \\exp \\left( \\dfrac{V_m - V_{th}}{\\Delta_{th} }\\right) \\right)+ I_{app} ";
var elifEquationLine2 = lifEquationLine1;

var hodgkinhuxleyEquationLine1 = "C_m \\dfrac{dV_m}{dt} = G_L(E_L - V_m) + G_{Na}^{max} m^3 h (E_{Na} - V_m) + G_K^{max}n^4(E_K - V_m)+ I_{app} ";
var hodgkinhuxleyEquationLine2 = "\\dfrac{dm}{dt} = \\alpha_m(1-m) + \\beta_m m";
var hodgkinhuxleyEquationLine3 = "\\dfrac{dh}{dt} = \\alpha_h(1-h) + \\beta_h h";
var hodgkinhuxleyEquationLine4 = "\\dfrac{dn}{dt} = \\alpha_n(1-n) + \\beta_n n"

katex.render(lifEquationLine1, modelEquation, {  throwOnError: false });

katex.render(lifEquationLine2, modelEquationLine2, {
  throwOnError: false
});

function renderKatex(){

  katex.render("C_m", C_m, {
    throwOnError: false
  });

  katex.render("G_L", G_L, {
    throwOnError: false
  });

  katex.render("E_L", E_L, {
    throwOnError: false
  });
}
