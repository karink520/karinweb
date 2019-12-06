var betaPDFeq = "p(x | a, b) = \\frac{\\Gamma(a+b)}{\\Gamma(a)\\Gamma(b)} x^{a - 1}(1-x)^{b - 1}, \\, x \\in[0,1]";
var binomialPdfEq = "p(k | x ) = {n \\choose k}x^k(1-x)^{n-k}";
var multinomialPdfEq = "p( \\mathbf{k} | \\mathbf{x}) = \\frac{n!}{k_1! \\cdots k_M!} x_1^{k_1} \\cdots x_M^{k_M}";
var posteriorBetaPdfEq = "p(x | k) \\propto x^{(a + k) - 1}(1-x)^{(b +n-k) - 1}, \\, x \\in[0,1]";
var posteriorDirichletPdfEq = "p(\\mathbf{x} | \\mathbf{k}) \\propto p(\\mathbf{k} | \\mathbf{x}) p(\\mathbf{x}) \\propto x_1^{a_1 + k_1 - 1} \\cdots x_M^{a_M + k_M - 1}, \\,  \\text{where }  \\, \\sum_{i=1}^M x_i = 1";
var betaMean = "\\frac{a}{a+b}";
var aDisplay = "a";
var bDisplay = "b";
var bayesRuleExample = "p(x | k) \\propto p(k | x) p(x)";
var normalizedBetaPdfEq = "p(x | k) =  \\frac{\\Gamma(a+b+n)}{\\Gamma(a+k)\\Gamma(b+n-k)}x^{(a + k) - 1}(1-x)^{(b +n-k) - 1},\\, x \\in[0,1]";
var dirichletPdfEq = "p(\\mathbf{x} | \\mathbf{a}) = \\frac{\\prod_{i=1}^{M}\\Gamma(a_i)}{\\Gamma(\\sum_{i=1}^M a_i )}\\prod_{i=1}^{M}x_i^{a_i - 1}, \\,  \\text{where }  \\, \\sum_{i=1}^M x_i = 1";
var normalizedPosteriorDirichletPdfEq = "p(\\mathbf{x} | \\mathbf{k}) = \\frac{\\prod_{i=1}^{M}\\Gamma(a_i+k_i)}{\\Gamma(\\sum_{i=1}^M a_i + k_i )}\\prod_{i=1}^{M}x_i^{a_i +k_i - 1}, \\,  \\text{where }  \\, \\sum_{i=1}^M x_i = 1";
var dirichletParameterEq = "\\mathbf{a} = (a_1,...,a_M)";
var newTableProbabilityEq = "\\frac{\\alpha}{n + \\alpha - 1}";
var existingTableProbabilityEq = "\\frac{n_t}{n + \\alpha - 1}";
var stickBreakingEq = "\\sum_{n=1}^\\infty \\beta_n \\delta_{\\theta_n}";

katex.render(betaPDFeq, betaPDFequation, {  throwOnError: false  })
katex.render(betaMean, betaMeanequation, {  throwOnError: false  })
katex.render(dirichletPdfEq, dirichletPdfEquation, {  throwOnError: false  })
katex.render(binomialPdfEq, binomialPdfEquation, {  throwOnError: false  })
katex.render(posteriorBetaPdfEq, posteriorBetaPdfEquation, {  throwOnError: false  })
katex.render(bayesRuleExample, bayesRuleExampleEquation, {  throwOnError: false  })
katex.render(normalizedBetaPdfEq, normalizedBetaPdfEquation, {  throwOnError: false  })
katex.render(dirichletParameterEq, dirichletParameterEquation, {  throwOnError: false  })
katex.render(multinomialPdfEq, multinomialPdfEquation, {  throwOnError: false  })
katex.render(posteriorDirichletPdfEq, posteriorDirichletPdfEquation, {  throwOnError: false  })
katex.render(normalizedPosteriorDirichletPdfEq, normalizedPosteriorDirichletPdfEquation, {  throwOnError: false  })
katex.render(existingTableProbabilityEq, existingTableProbability, {  throwOnError: false  })
katex.render(newTableProbabilityEq, newTableProbability, {  throwOnError: false  })
katex.render("n_t", nT, {  throwOnError: false  })
katex.render("\\theta_n", thetaN, {throwOnError: false})
katex.render("\\beta_n", betaN, {throwOnError: false})
katex.render(stickBreakingEq, stickBreakingEquation, {  throwOnError: false  })
katex.render( "(A_1,...,A_k)",setlist, {  throwOnError: false  });
katex.render("(G(A_1),...,G(A_k))", setlist2, {  throwOnError: false  });
katex.render("(\\alpha H(A_1),...,\\alpha H(A_k))", setlist3, {  throwOnError: false  });

var tables=[]; //x, y, color, count, phi
var binary_samples = [0, 0];
var categorical_samples = [0, 0, 0, 0];
var tableColors = ['mediumseagreen','blue','red', 'cornflowerblue','DeepPink','cyan','green','violet','coral','mediumslateblue','orange','darkslategray'];
var maxTables = 8;
var total_draws = 0;

var alpha_0 = 1.2;
var betaSample;
var dirichletSample;
var numDecimals = 3;

var stickparam1;
var stickparam2;

var histWidth = {};
var histHeight = {};
var betaPdfWidth = document.getElementById('betaPDF').offsetWidth;

var betaPdf = plotBetaPdf([4],[2],'#betaPDF');
plotBetaPdf([5,9],[5,4],'#priorPosteriorBetaPlot');
var normalPdf = plotNormalPdf();
drawHistogram('DPhistogram');
drawHistogram('BetaHistogram');
drawHistogram('DirichletHistogram');
plotStickBreakingImage([], 'empty-stick');

$('#sampleFromBeta').click( function(){ sampleFromBeta();});
$('#sampleFromDirichlet').click( function(){ sampleFromDirichlet([3,4,5,1]);});
$("#sampleFromDPSample").click( function(){ sampleFromDPDraw()});
$('#sampleFromBetaSample').click( function() {simulateFromBetaDraw()})
$('#sampleFromDirichletSample').click( function() {sampleFromSampleDirichlet()})
$('#break-the-stick').click( function() {breakTheStick(alpha_0)});
$('#break-the-stick-again').click( function() {breakTheStickAgain(alpha_0)});
$('#choose-alpha').change(function(){ alpha_0 = $(this).val(); console.log(alpha_0);})
$('#startOverDP').click(function() {startOverDP()} )

function sampleFromDPDraw(){
  var rand = Math.random();
  console.log("rand is" + rand);
  var probSum = 0;
  for (var i = 0; i < tables.length; i++) {
    console.log("probSum is" + probSum);
    if (rand < probSum) {
      drawPersonAtTable(i);
        console.log("Person added at table" + i);
      return;
    }
    probSum += (tables[i].numPeople / (total_draws + alpha_0));
  }
  //in case person picks new table:
  //tables[tables.length-1].phi = clt_normal();
  tables.push({"x":0, "y":0, "numPeople":0, "phi":jStat.normal.sample(0,1)});
  //tables[tables.length-1].phi = jStat.normal.sample(0,1);
  drawTable();
  drawPersonAtTable(tables.length-1);

  if (tables.length > maxTables){
    var fillcolor = d3.color('gray');
  } else {
    var fillcolor = d3.color(tableColors[tables.length-1]);
  }
  normalPdf.plot.selectAll(".dot").data(tables)
  .enter().append("circle")
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return normalPdf.xScale(d.phi)})
    .attr("cy", function(d) { return normalPdf.yScale(0) })
    .attr("r", 5)
    .style("fill", fillcolor);
  return;
}

function drawPersonAtTable(tableIndex){
  var maxNumPeople = 15;
  personIndex = tables[tableIndex].numPeople;
  var canvas = document.getElementById('circle');
  if (canvas.getContext)
  {
    var ctx = canvas.getContext('2d');
    var X = tables[tableIndex].x + 30*Math.cos( personIndex / maxNumPeople * 2*Math.PI);
    var Y = tables[tableIndex].y + 30* Math.sin( personIndex / maxNumPeople *2 *Math.PI);
    var R = 5;
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = tableColors[tableIndex];
    ctx.fillStyle = tableColors[tableIndex];
    ctx.stroke();
    ctx.fill();
  }
  tables[tableIndex].numPeople += 1;
  console.log(tables[tableIndex].phi);
  addToHistogram(tableIndex, 'DPhistogram');
  total_draws += 1;
}


function drawTable(){
  var canvas = document.getElementById('circle');
  if (tables.length == 1){
    canvas.width = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
  }
  var padding = 10;
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var X = (canvas.width / (maxTables+1) + padding) * (tables.length - 0.5);
    var Y = canvas.height / 2;
    var R = 30;
    tables[tables.length -1 ].x = X;
    tables[tables.length -1 ].y = Y;
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.lineWidth=1;
    ctx.strokeStyle = tableColors[tables.length-1];
    ctx.fillStyle = tableColors[tables.length-1];
    ctx.strokeText((tables[tables.length-1].phi).toFixed(numDecimals), X-15, Y+2);
  }
}


function drawHistogram(histogramIdString){
  var canvas = document.getElementById(histogramIdString);
  canvas.width = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
  maxTables = Math.min(Math.floor(canvas.width / 90 )-1, 12);
  console.log(maxTables);
  var padding = 10;
  if (canvas.getContext)
  {
    var ctx = canvas.getContext('2d');
    var Y = canvas.height - padding;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.moveTo(10, Y);
    ctx.lineTo(canvas.width-10, Y);
    ctx.stroke();
    histWidth[histogramIdString] = canvas.width;
    histHeight[histogramIdString] =  canvas.height - padding;
  }
}

function addToHistogram(tableIndex, histogramIdString){
   var X = tableIndex * 75 + 70;
   var Y;
   if (histogramIdString == 'DPhistogram'){
     Y = histHeight[histogramIdString] - tables[tableIndex].numPeople * 10;
     X = tables[tableIndex].x;
   } else if (histogramIdString == 'BetaHistogram') {
     Y = histHeight[histogramIdString] - binary_samples[tableIndex] * 10;
   } else {
    Y = histHeight[histogramIdString] - categorical_samples[tableIndex] * 10
   }
   var canvas = document.getElementById(histogramIdString);
   if (canvas.getContext)
   {
     var ctx = canvas.getContext('2d');
     var R = 5;
     ctx.beginPath();
     ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
     ctx.lineWidth = 2;
     ctx.strokeStyle = tableColors[tableIndex];
     ctx.fillStyle = tableColors[tableIndex];
     ctx.stroke()
     ctx.fill();
   }
}

function clearHistogram(histogramIdString){
    var canvas = document.getElementById(histogramIdString);
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,histWidth[histogramIdString], histHeight[histogramIdString]);
    }
}


//Draws the beta distribution with specificied perameters
function plotBetaPdf(a_arr, b_arr, elementId){
  var a = a_arr[0];
  var b = b_arr[0];
  betaPdfWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;

  var margin = {top: 20, right: 30, bottom: 20, left: 30};
  var width = betaPdfWidth - margin.left - margin.right;
  var height = 200;
  var dataset = d3.range(n+1).map(function(d) { return {"y": jStat.beta.pdf(d/n, a, b ) } });

  // The number of datapoints
  var n = 100;

  var xScale = d3.scaleLinear()
      .domain([0, 1]) // input
      .range([0, width]); //outpu

  var yScale = d3.scaleLinear()
      .domain([0, 3]) // input
      .range([height, 0]); // output

  //d3's line generator
  var line = d3.line()
      .x(function(d, i) { return xScale(i/n); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line

  var dataset = d3.range(n+1).map(function(d) { return {"y": jStat.beta.pdf(d/n, a, b ) } });

  // Add the SVG to the page and employ
  var svg = d3.select(elementId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Call the x axis in a group tag
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  //  Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataset) // 10. Binds data to the line
       .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator
   if (a_arr.length > 1){
       dataset = d3.range(n+1).map(function(d) { return {"y": jStat.beta.pdf(d/n, a_arr[1], b_arr[1] ) } });
       svg.append("path")
         .datum(dataset) // 10. Binds data to the line
        .attr("class", "line_blue") // Assign a class for styling
         .attr("d", line); // 11. Calls the line generator
   }

    return {'plot': svg, 'xScale': xScale, 'yScale': yScale};
}

//draws divistion of stick based on vector of probabilities
function plotStickBreakingImage(prob_array, element_id){
  var margin = {top: 5, right: 30, bottom: 5, left: 30}
  var width = betaPdfWidth - margin.left - margin.right;
  var canvas = document.getElementById(element_id);
  canvas.width = betaPdfWidth; //resize the canvas to make sure the stick fits
  canvas.height = 50;
  var stickLength = width;
  var stickHeight = 10;
  var leftOffset = margin.left;
  if (canvas.getContext)
  {
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(leftOffset, 20, stickLength, stickHeight);
    ctx.fillStyle = 'White'
    ctx.strokeStyle = 'Black';
    ctx.fill();
    ctx.stroke();
    for (var i = 0; i < prob_array.length; i++){
      ctx.beginPath();
      ctx.rect(leftOffset, 20, stickLength*prob_array[i], stickHeight);
      leftOffset += stickLength*prob_array[i];
      ctx.strokeStyle = 'Black';
      ctx.fillStyle = tableColors[i];
      ctx.stroke();
      ctx.fill();
  }
  }
}


//draws from beta distribution
//displays numerical value of draw
//displays chart with probabilities for each category
//marks the sample on the graph of the pdf
//makes histogram and draw button visible
function sampleFromBeta(){
  a = 4;
  b = 2;
  betaSample = jStat.beta.sample( a, b );
  $('#betaSample').text(betaSample.toFixed(numDecimals));
  binary_samples = [0, 0];
  clearHistogram('BetaHistogram');
  drawHistogram('BetaHistogram');
  plotStickBreakingImage([betaSample, 1-betaSample], 'betaStickBreakingChart')
  document.getElementById("sampleFromBetaSample").style.visibility = "visible";

  var circles = betaPdf.plot.selectAll(".dot")
    .data([{'y':.3}]);
  circles.exit().remove()

  betaPdf.plot.selectAll(".dot").data([{'y':.3}])
    .enter().append("circle")
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d, i) { return betaPdf.xScale(betaSample)})
      .attr("cy", function(d) { return betaPdf.yScale(0) })
      .attr("r", 5);
      circles.transition()
          .duration(10)
          .attr("cx",function(d,i){return betaPdf.xScale(betaSample)})
          .attr("cy",betaPdf.yScale(0))
          .attr("r",5);
}

function sampleFromDirichlet(parameters){
    //reset histogram and samples
    categorical_samples = [0, 0, 0, 0];
    clearHistogram('DirichletHistogram');
    drawHistogram('DirichletHistogram');
    
    //generate sample (using a sequence of gamma random variables)
    var K = parameters.length;
    dirichletSample =[]
    var y = [];
    var sum = 0;
    for (var i = 0; i <K; i++){
        y[i] = jStat.gamma.sample(parameters[i],1);
        sum += y[i];
    }
    for (var i = 0; i < K; i++){
        dirichletSample[i] = y[i]/ sum;
    }

  //display sample
  var dirichletSampleText = '(';
  for(var i=0; i< dirichletSample.length; i++) {
    dirichletSampleText += (dirichletSample[i].toFixed(numDecimals) + ', ');
  }
  dirichletSampleText =  dirichletSampleText.substring(0, dirichletSampleText.length - 2) + ")";
  $('#dirichletSample').text(dirichletSampleText);

  //update stick-breaking diagram and make it possible to sample based on the most recent dirichlet draw (by making this section visible)
  document.getElementById("sampleFromDirichletSample").style.visibility = "visible";
  plotStickBreakingImage(dirichletSample, 'dirichletStickBreakingChart')

}

function sampleFromSampleDirichlet(){
    var sample =  getRandomIndexByProbability(dirichletSample);
    categorical_samples[sample]++;
    addToHistogram(sample, 'DirichletHistogram')
}

function simulateFromBetaDraw() {
    sample = Number(Math.random() > betaSample);
    binary_samples[sample]++;
    addToHistogram(sample, 'BetaHistogram');
}

function breakTheStick(alpha){
    stickparam1 = jStat.beta.sample(1,alpha);
    $('.stick-breaking-draw-1').text(stickparam1.toFixed(numDecimals));
    plotStickBreakingImage([stickparam1],"stick-after-one-step");
}

function breakTheStickAgain(alpha){
  stickparam2 = jStat.beta.sample(1,alpha);
  $('.stick-breaking-draw-2').text(stickparam2.toFixed(numDecimals))
  $('#second-break').text(' = ' + ((1-stickparam1)*stickparam2).toFixed(numDecimals))
  plotStickBreakingImage([stickparam1, (1-stickparam1)*stickparam2],"stick-after-two-steps");
}


//https://stackoverflow.com/questions/8877249/generate-random-integers-with-probabilities
function getRandomIndexByProbability(probabilities) {
    var r = Math.random(),
    index = probabilities.length - 1;
    
    probabilities.some(function (probability, i) {
                       if (r < probability) {
                       index = i;
                       return true;
                       }
                       r -= probability;
                       });
    return index;
}


function plotNormalPdf(){
  betaPdfWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;

  var margin = {top: 20, right: 30, bottom: 20, left: 30};
  var width = betaPdfWidth - margin.left - margin.right;
  var height = 100;
  var n = 100;
  // The number of datapoints

  var xScale = d3.scaleLinear()
      .domain([-3, 3]) // input
      .range([0, width]); //output

  var yScale = d3.scaleLinear()
      .domain([0, .4]) // input
      .range([height, 0]); // output

  //d3's line generator
  var line = d3.line()
      .x(function(d) { return xScale(d.x); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line

  var dataset = d3.range(-3,3,0.1).map(function(d) { return {"x":d ,"y": jStat.normal.pdf(d, 0, 1 ) } });
 
  // Add the SVG to the page and employ
  var svg = d3.select('#normalPDF').append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Call the x axis in a group tag
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  //  Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataset) // 10. Binds data to the line
       .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator

    return {'plot': svg, 'xScale': xScale, 'yScale': yScale};
}

function startOverDP(){
  console.log('starting over');
  var canvas = document.getElementById('circle');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  tables = [];
  var svg = d3.select('#normalPDF');
  svg.selectAll("*").remove();
  normalPdf = plotNormalPdf();
  drawHistogram('DPhistogram');
}