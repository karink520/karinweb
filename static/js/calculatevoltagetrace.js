function calculatevoltagetrace(cellParameters){
//  appliedCurrentValue, membraneCapacitance){
  //var appliedCurrentValue = 100e-11;//TEMP FOR TESTING HH-- nice to see 0, 5, 20, 100 to see different ranges
  var appliedCurrentValue = cellParameters.appliedcurrent;
  var  membraneCapacitance = cellParameters.membranecapacitance;
  var leakConductance = cellParameters.leakconductance;
  var leakEquilibriumPotential = cellParameters.leakequilibriumpotential;//-.070 // V -70mV as default
  //var appliedCurrentValue = .21e-9 //nanoamperes .21 as default
  //var membraneCapacitance = 100e-12 //F 100pF as default
  //var leakEquilibriumPotential = -.070 // V -70mV as default
  var thresholdVoltage = -0.050 //V -50mV as default
  var resetVoltage = -0.080 //V -80mV as default
  var maxVoltage = 0.050 //For elif
  //var leakConductance = 10e-9; //nS, 10 as default (G_L)

  var time = [];
  var timeStep = 0.00005;
  var t;
  for (t = 0; t < 0.3; t += timeStep) {
    time.push(t);
  }

  var voltage = [leakEquilibriumPotential];// CHANGE
  var dataset = [{"x": 0, "y": voltage[0]}];
  var dVdt = 0
  var i;
  if (cellParameters.selectedEquation == "lif"){
    for (i = 1; i<time.length; i++){
      dVdt = (1 / membraneCapacitance)*(leakConductance*(leakEquilibriumPotential - voltage[i-1]) + appliedCurrentValue);
      if (voltage[i-1] > thresholdVoltage) {
        voltage.push(resetVoltage);
      } else {
        voltage.push(voltage[i-1] + timeStep * dVdt);
      }
      dataset.push({"y": voltage[i]});
    }
  } else if (cellParameters.selectedEquation == "elif") {
    var delta_th = cellParameters.delta_th;
    for (i = 1; i<time.length; i++){
      dVdt = (1 / membraneCapacitance)*(leakConductance*(leakEquilibriumPotential - voltage[i-1] + delta_th*Math.exp((voltage[i-1] - thresholdVoltage)/delta_th)) + appliedCurrentValue);
      if (voltage[i-1] > maxVoltage) {
        voltage.push(resetVoltage);
      } else {
        voltage.push(voltage[i-1] + timeStep * dVdt);
      }
      dataset.push({"y": voltage[i]});
    }

  } else if (cellParameters.selectedEquation == "hodgkinhuxley") {
    voltage = [-.065];
    //Constants
    var sodiumConductance = 12e-6;
    var potassiumConductance = 36e-7;
    var naEquilibriumPotential = 0.045;
    var kEquilibriumPotential = -0.082;
    var leakConductance = 30e-9;

    //rate variables
    var alpha_m = [];
    var beta_m = [];
    var alpha_h = [];
    var beta_h = [];
    var alpha_n = [];
    var beta_n = [];

    //computed time varying quantities
    var leakTerm;
    var naTerm;
    var kTerm ;
    var m = [0.05]; //Initial values from pmiller Computational Neuroscience
    var h = [0.6];
    var n = [0.31];
    var leakTerm;
    var naTerm ;
    var kTerm ;
    for (i = 1; i<time.length; i++){
        var v_m = voltage[i-1];
        //rate variables alpha and beta
        if (Math.abs(-v_m - 0.045) < 0.0001) {
          alpha_m.push(1000);
        } else {
          alpha_m.push((1e5*(-v_m - 0.045))/(Math.exp(100*(-v_m- 0.045)) - 1));
        }
    //    console.log("alpha_m" + alpha_m[i-1])
        beta_m.push(4e3*Math.exp( (-v_m-0.070)/0.018));
    //    console.log("beta_m" + beta_m[i-1])

        alpha_h.push(70*Math.exp(50*(-v_m - 0.070)));
        beta_h.push(1e3/(1 + Math.exp(100*(-v_m - 0.040))));

        if ( Math.abs(-v_m - 0.060) < 0.0001) {
          alpha_n.push(100);
        } else {
          alpha_n.push((1e4 *( -v_m - 0.060)) / (Math.exp(100*(-v_m - 0.060)) - 1));
        }
  //      console.log("alpha_n: " + alpha_n[i-1])
        beta_n.push(Math.min(125 * Math.exp((-v_m-0.070)/0.080), 1000));
  //      console.log("beta_n: " + beta_n[i-1])

        //gating variables m,h,n
        dmdt = alpha_m[i-1]*(1-m[i-1]) - beta_m[i-1] * m[i-1];
        dhdt = alpha_h[i-1]*(1-h[i-1]) - beta_h[i-1] * h[i-1];
        dndt = alpha_n[i-1]*(1-n[i-1]) - beta_n[i-1] * n[i-1];

        m.push(dmdt*timeStep + m[i-1]);
        h.push(dhdt*timeStep + h[i-1]);
        n.push(dndt*timeStep + n[i-1]);

        //leak term, sodium term, potassium term
        leakTerm = leakConductance*(leakEquilibriumPotential - v_m);
      //  console.log("leak term: " + leakTerm);
        naTerm = sodiumConductance * Math.pow(m[i],3) * h[i] *(naEquilibriumPotential - v_m);
      //  console.log("naTerm: " + naTerm);
        kTerm= potassiumConductance * Math.pow(n[i],4) * (kEquilibriumPotential - v_m);
      //  console.log("n" + n[i-1]);
      //  console.log("kTerm: " + kTerm);

        //Change in voltage;
        dVdt = (1/membraneCapacitance)* (leakTerm + naTerm + kTerm + appliedCurrentValue);
      //  console.log("dVdt" + dVdt);
          //voltage.push(resetVoltage);
        // } else {
          if (voltage[i-1] + timeStep * dVdt <  -.080) {
            voltage.push(-.080);
          } else {
           voltage.push(voltage[i-1] + timeStep * dVdt);
         }
    //       console.log("voltage: " + voltage[i]);
        // }
    dataset.push({"x": i, "y": voltage[i]});
  } //end of for loop
  //  console.log("final voltage:" +  voltage);
  }

  return dataset;
}
