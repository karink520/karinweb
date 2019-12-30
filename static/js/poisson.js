var poissonPdfEq = "p(y | \\lambda) = \\dfrac{\\lambda^y e^{-\\lambda}}{y!} \\text{ for } y \\in 0, 1, 2,... ";
var gammaPdfEq = "p(\\lambda | \\alpha, \\beta ) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} \\lambda^{\\alpha-1} e^{-\\beta \\lambda}, \\, x \\in (0, \\infty)";
var gammaPdfEq2 = "p(\\lambda | k, \\theta) = \\frac{1}{\\Gamma(k) \\theta^k} \\lambda^{k-1} e^{-\\lambda/\\theta}, \\, x \\in (0, \\infty)";
var gammaPdfEq3 = "p(\\lambda | \\mu, \\sigma) = \\frac{(\\mu/\\sigma^2)^{\\mu^2/\\sigma^2}}{\\Gamma(\\mu^2/\\sigma^2)} \\lambda^{\\mu^2/\\sigma^2 - 1} e^{-\\mu \\lambda / \\sigma^2}, \\, x \\in (0, \\infty) ";

var exponentialPdfEq = "p(x | \\theta) = \\text{Exp}(x ; \\theta) = \\theta e^{- \\theta x}";
var chiSquaredPdfEq = "p(x | k) = \\chi^2(x; k) = \\frac{2^{-k/2}}{\\Gamma(k/2)} x^{k/2 - 1} e^{-x/2}";
var paramTranslation1Eq = "\\alpha = k = \\frac{\\mu^2}{\\sigma^2}, \\, ";
var paramTranslation2Eq = "\\beta = \\frac{1}{\\theta} = \\frac{\\mu}{\\sigma^2}";

var yEq = "\\mathbf{y} = {y_1,...,y_N}"

var bayesTheoremProportionEq = "p(\\lambda | \\mathbf{y}) \\propto p( \\mathbf{y} | \\lambda) p(\\lambda)";
var gammaPosteriorEq = "p(\\lambda | \\mathbf{y}) = \\text{ Gamma}(\\lambda; \\alpha + \\sum\\limits_{i=1}^N y_i, \\beta + N)"
var poissonLikelihoodEq = "p(\\mathbf{y} | \\lambda) = \\prod\\limits_{i=1}^N \\frac{e^{-\\lambda}\\lambda^{y_i}}{y_i!} = e^{-N\\lambda}\\lambda^{\\sum_i^N y_i }\\prod\\limits_{i=1}^N \\frac{1}{y_i!}";
var posteriorEq = "p(\\lambda | \\mathbf{y}) \\propto p( \\mathbf{y} | \\lambda) p(\\lambda) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} \\lambda^{\\alpha - 1 + \\sum_i^N y_i} e^{-\\beta\\lambda - N \\lambda}";

var priorPredictiveEq1 = "p(y) = \\frac{p(y|\\lambda)p(\\lambda)}{p(\\lambda|y)}";
var priorPredictiveEq2 = "p(y |\\alpha, \\beta) = \\int p(y, \\lambda | \\alpha, \\beta) \\, d \\lambda = \\int p(y| \\lambda) p(\\lambda | \\alpha, \\beta) \\, d \\lambda"
var negativeBinomialEq1 = "p(y) = \\frac{\\Gamma(\\alpha + y)\\beta^\\alpha}{\\Gamma(\\alpha) y! (1+ \\beta)^{\\alpha+y}} = \\binom{\\alpha + y - 1}{y} (\\frac{\\beta}{\\beta + 1})^\\alpha (\\frac{1}{\\beta + 1})^y";


var poissonDerivationEq1 = "p(y) = \\text{Binom}(y; M, r\\Delta t) = \\frac{M!}{(M-y)!y!}(r \\Delta t)^y (1 - r \\Delta t)^{M - y}"
var poissonDerivationEq2 = "\\lim_{\\Delta t \\to 0} \\frac{M!}{(M-y)!y!}(r \\Delta t)^y (1 - r \\Delta t)^{M - y} "
var poissonDerivationEq3 = "\\frac{1}{y!} \\lim_{\\Delta t \\to 0} M^y (r \\Delta t)^{y} (1- r\\Delta t)^M = \\frac{1}{y!} \\lim_{\\Delta t \\to 0} (rT)^{-y} (1- r\\Delta t)^M";
var poissonDerivationEq4 = "p(y) = \\frac{1}{y!} (rT)^{-y} e^{-rT}";

var definitionOfEEq = "\\lim_{\\epsilon \\to 0} (1+ \\epsilon)^{1/\\epsilon} = e";
var MEq = "M = \\frac{T}{\\Delta t} = \\frac{1}{-r\\Delta t} (-rT)";
var MtoTheYEq = "M^y";
var applicationOfDefinitionOfEEq = "\\lim_{\\Delta t \\to 0} (1 + (-r \\Delta t))^{\\frac{1}{-r\\Delta t} (-rT)} = e^{-rT}";

katex.render(poissonPdfEq, poissonPdfEquation, {  throwOnError: false  });
katex.render(gammaPdfEq, gammaPdfEquation, {  throwOnError: false  });
katex.render(exponentialPdfEq, exponentialPdfEquation, {throwOnError: false});
katex.render(chiSquaredPdfEq, chiSquaredPdfEquation, {throwOnError: false});
katex.render(paramTranslation1Eq, paramTranslation1Equation,{throwOnError: false});
katex.render(paramTranslation2Eq, paramTranslation2Equation,{throwOnError: false});
katex.render(gammaPdfEq, gammaParam1,{  throwOnError: false  });
katex.render(gammaPdfEq2, gammaParam2,{  throwOnError: false  });
katex.render(gammaPdfEq3, gammaParam3,{  throwOnError: false  });
katex.render(yEq, yEquation, {throwOnError: false});
katex.render(bayesTheoremProportionEq, bayesTheoremProportion, {throwOnError:false});
katex.render(poissonLikelihoodEq, poissonLikelihoodEquation, {throwOnError: false});
katex.render(posteriorEq, posteriorEquation, {throwOnError: false});

katex.render(negativeBinomialEq1, negativeBinomialEquation1, {throwOnError:false});
katex.render(priorPredictiveEq1, priorPredictiveEquation1, {throwOnError: false});
katex.render(priorPredictiveEq2, priorPredictiveEquation2, {throwOnError: false});

katex.render(gammaPosteriorEq, gammaPosteriorEquation, {throwOnError: false});
katex.render(poissonDerivationEq1, poissonDerivationEquation1, {throwOnError: false});
katex.render(poissonDerivationEq2, poissonDerivationEquation2, {throwOnError: false});
katex.render(poissonDerivationEq3, poissonDerivationEquation3, {throwOnError: false});
katex.render(poissonDerivationEq4, poissonDerivationEquation4, {throwOnError: false});
katex.render(MEq, MEquation, {throwOnError: false});
katex.render(definitionOfEEq, definitionOfE,{throwOnError:false});
katex.render(applicationOfDefinitionOfEEq, applicationOfDefinitionOfEEquation,{throwOnError:false});
katex.render(MtoTheYEq, MtoTheY, {throwOnError: false});



var lambda = 2;
var alpha = 2;
var beta = 0.5;
var r = 1;
var M = 3;
var datasetForPoissonFromBinomialPlot = []
var poissonPdf = plotPoissonPdf(lambda, 16, "#poissonPdfGraph");
var gammaPdf = plotGammaPdf(alpha, beta, 2000, "#gammaPdfGraph");
var poissonFromBinomialPlot = plotPoissonFromBinomial(0.3, M, '#poissonFromBinomialPlot');
var poissonProcess = plotPoisson(r, '#poissonPlot');
var slider = document.getElementById("num_subintervalsRange");

// // Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  console.log($('this'));
  this.previousElementSibling.childNodes[2].innerHTML =  "= " + this.value;
  M = this.value;
  plotPoissonFromBinomial(0.3, M, '#poissonFromBinomialPlot');
}

$('#choose-lambda').change(function(){ lambda = $(this).val(); updatePoissonPdf(lambda, 16, "#poissonPdfGraph");});
$('#choose-alpha').change(function(){ alpha = Number($(this).val());  gammaPdf = updateGammaPdf(alpha, beta, 2000);});
$('#choose-beta').change(function(){ beta = Number($(this).val()); gammaPdf = updateGammaPdf(alpha, beta, 2000);});
$('#choose-r').change(function(){ r = Number($(this).val()); updatePoisson(r);});


function plotPoissonFromBinomial(r, num_ticks, elementId){
    var xMax = 10;
    var plotWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
    var margin = {top: 20, right: 30, bottom: 20, left: 30};
    var width = plotWidth - margin.left - margin.right;
    var height = 50;

    if (!poissonFromBinomialPlot) {

        var svg=d3.select(elementId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var dataset = [];
        var mostRecentPoint = 0;
        var interval = jStat.exponential.sample(r);
        while (interval > 10){
            interval = jStat.exponential.sample(r); //Note: resample until the first point lies on the interval [0,10]
        }
        mostRecentPoint += interval;
        while (mostRecentPoint < 10){
            dataset.push({"time": mostRecentPoint});
            interval = jStat.exponential.sample(r);
            mostRecentPoint += interval;
        }
        datasetForPoissonFromBinomialPlot = dataset;
        
    } else {
        var svg = poissonFromBinomialPlot.svg;
        svg.selectAll("*").remove()
        var dataset = datasetForPoissonFromBinomialPlot;
    }

    var xScale = d3.scaleLinear()
    .domain([0, xMax])         
    .range([0, width]); 

    var ticks = [0];
    var tickLabels = ['0'];
    for (var i = 1; i < num_ticks; i++){
        ticks.push(i * xMax/num_ticks);
        tickLabels.push(i+"\u0394t/T");
    }
    ticks.push(xMax);
    tickLabels.push("T")     

    var myAxis = d3.axisBottom()
    .scale(xScale)
    .tickValues(ticks)
    .tickFormat(function(d,i){ return tickLabels[i] });

    svg.append("g")
            .attr("class", "axis")
            .call(myAxis)
            .attr("transform","translate(0,50)");

    svg.selectAll(".dot")
        .data(dataset)
    .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.time) })
        .attr("cy", 0)
        .attr("r", 5);
    
    var count = dataset.length;
    $('#poissonFromBinomialCounts').text('y = ' + count);
    
     return {"svg": svg};

}

function updatePoisson(r){
    var svg = poissonProcess.svg;
    var dataset = [];
    var mostRecentPoint = 0;
    var interval = jStat.exponential.sample(r);
    mostRecentPoint += interval;
    while (mostRecentPoint < 10){
        dataset.push({"time": mostRecentPoint});
        interval = jStat.exponential.sample(r);
        mostRecentPoint += interval;
    }

    svg.selectAll(".dot").remove();
    svg.selectAll(".dot").exit();

    svg.selectAll(".dot")
        .data(dataset)
    .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return poissonProcess.xScale(d.time) })
        .attr("cy", 0)
        .attr("r", 5);

    var count = dataset.length;
    $('#poissonCounts').text('y = ' + count);
    }

function plotPoisson(r, elementId){
    var plotWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
    var margin = {top: 20, right: 30, bottom: 20, left: 30};
    var width = plotWidth - margin.left - margin.right;
    var height = 50;
    var svg=d3.select(elementId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear()
        .domain([0, 10])         
        .range([0, width]); 
    
    // Draw the axis
    svg
      .append("g")
      .attr("transform", "translate(0,50)")      // This controls the vertical position of the Axis
      .call(d3.axisBottom(xScale));

    var dataset = [];
    var mostRecentPoint = 0;
    var interval = jStat.exponential.sample(r);
    mostRecentPoint += interval;
    while (mostRecentPoint < 10){
        dataset.push({"time": mostRecentPoint});
        interval = jStat.exponential.sample(r);
        mostRecentPoint += interval;
    }

    console.log(dataset);
    svg.selectAll(".dot")
        .data(dataset)
    .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.time) })
        .attr("cy", 0)
        .attr("r", 5);

    var count = dataset.length;
    $('#poissonCounts').text('y = ' + count);

    return{ "svg": svg, "xScale": xScale};

}

function updatePoissonPdf(theta, n, elementId){
    var dataset = d3.range(n+1).map(function(d) { return {"pmf": jStat.poisson.pdf(d, theta) } });
    console.log(dataset);
    var svg = d3.select(elementId);
    var xScale = poissonPdf.xScale
    var yScale = poissonPdf.yScale

    svg.selectAll(".dot")
        .data(dataset)
        .transition()
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(i) })
        .attr("cy", function(d) { return yScale(d.pmf) })
        .attr("r", 5);

}

function plotPoissonPdf(theta,n, elementId){
    var plotWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
    var margin = {top: 20, right: 30, bottom: 20, left: 30};
    var width = plotWidth - margin.left - margin.right;
    var height = 200;
    var dataset = d3.range(n+1).map(function(d) { return {"pmf": jStat.poisson.pdf(d, theta) } });

    var xScale = d3.scaleLinear()
        .domain([0, n]) // input
        .range([0, width]); //output
  
    var yScale = d3.scaleLinear()
        .domain([0, 0.4]) // input
        .range([height, 0]); // output
  
    //d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.pmf); }) // set the y values for the line generator

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

      svg.selectAll(".dot")
          .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", function(d, i) { return xScale(i) })
          .attr("cy", function(d) { return yScale(d.pmf) })
          .attr("r", 5);
  
      return {'plot': svg, 'xScale': xScale, 'yScale': yScale, 'margin': margin, 'line': line};
  }

  function plotGammaPdf(alpha, beta ,n, elementId){
    var plotWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
    var margin = {top: 20, right: 30, bottom: 20, left: 30};
    var width = plotWidth - margin.left - margin.right;
    var height = 200;
    var dataset = d3.range(1,n+1).map(function(d) { return {"pdf": jStat.gamma.pdf(d/100, Number(alpha), 1/Number(beta)) } });

    var xScale = d3.scaleLinear()
        .domain([0, n/100]) // input
        .range([0, width]); //output
  
    var yScale = d3.scaleLinear()
        .domain([0, 0.5]) // input
        .range([height, 0]); // output
  
    //d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale((i+1)/100); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.pdf); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line
  
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
  
      svg.append("path")
          .datum(dataset) // 10. Binds data to the line
         .attr("class", "line plotLine") // Assign a class for styling
          .attr("d", line); // 11. Calls the line generator

      return {'plot': svg, 'xScale': xScale, 'yScale': yScale, 'margin': margin, 'line': line};
  }

  function updateGammaPdf(alpha, beta, n){
        var dataset = d3.range(1,n+1).map(function(d) { return {"pdf": jStat.gamma.pdf(d/100, alpha, 1/beta) } });
        console.log(dataset);
        var xScale = gammaPdf.xScale;    
        var yScale = gammaPdf.yScale;
        var svg = gammaPdf.plot;
            line = gammaPdf.line;

        svg.selectAll(".plotLine")
            .data(dataset)
            .transition()
            .attr("class", "line plotLine") // Assign a class for styling
            .attr("d", line(dataset)); // 11. Calls the line generator


          return {'plot': svg, 'xScale': xScale, 'yScale': yScale, 'line': line};
      }
  

