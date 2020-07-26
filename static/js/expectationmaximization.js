var QThetaThetaOldEq = "Q(\\theta, \\theta^{(old)}) = \\mathbb{E}";
var ThetaNewEq = "\\theta^{(new)} = \\text{argmax}_{\\theta} Q(\\theta, \\theta^{(old)} )";
katex.render(ThetaNewEq, ThetaNew, {  throwOnError: false  });
katex.render(QThetaThetaOldEq, QThetaThetaOld, {  throwOnError: false  });

//Katex for Guassian mixtures
var gaussianMixtureLikelihood = "p(x | mu, Sigma, pi) ~ \\Sigma p(z) p(x|z, mu, Sigma, pi) = \\Sigma pi_k N(x |\\mu_k, \\Sigma_k)";
var classMembershipProbsEq = "\\gamma(z_{nk}):= p(z_{kn} = 1 | \\mathbf{x}_n, \\theta^{old}) = \\frac{\\pi_k N(\\mathbf{x}_n| \\mathbf{\\mu}_k^{old}, \\Sigma_k^{old})}{\\sum_{j=1}^K \\pi_j N(\\mathbf{x}_n | \\mathbf{\\mu}_j^{old}, \\mathbf{\\Sigma}_j^{old})}";
var classMembershipNotationEq ="\\gamma(z_{nk})";
katex.render(classMembershipNotationEq, classMembershipNotation, {throwOnError: false});
katex.render(classMembershipProbsEq, classMembershipProbs, {throwOnError:false});
var gaussianCompleteDataLogLikelihoodEq = "Q(\\theta, \\theta^{old}) = \\sum_{n=1}^N \\sum_{k=1}^K \\gamma(z_{nk}) (\\ln \\pi_k + \\ln N( \\mathbf{x}_n | \\mathbf{\\mu}_k, \\mathbf{\\Sigma_k})) ";
var gaussianCompleteDataLogLikelihoodExtendedEq = "\\begin{aligned} Q(\\theta, \\theta^{old}) = & \\mathbb{E}_{Z | X, \\theta^{(old)}} \\ln p(X,Z | \\theta ) \\\\= & \\mathbb{E}_{Z | X, \\theta^{(old)}} \\ln \\prod_{n=1}^N \\prod_{k=1}^K \\pi_k^{z_{nk}} N (\\mathbf{x}_n | \\mu_k, \\Sigma_k)^{z_{nk}} \\\\ = &\\mathbb{E}_{Z | X, \\theta^{old}} \\sum_{n=1}^N \\sum_{k=1}^K  z_{nk} (\\ln \\pi_k + \\ln N( \\mathbf{x}_n | \\mathbf{\\mu}_k, \\mathbf{\\Sigma_k})) \\\\ = & \\sum_{n=1}^N \\sum_{k=1}^K \\mathbb{E}_{Z | X, \\theta^{old}} (z_{nk}) (\\ln \\pi_k + \\ln N( \\mathbf{x}_n | \\mathbf{\\mu}_k, \\mathbf{\\Sigma_k})) \\\\ = & \\sum_{n=1}^N \\sum_{k=1}^K \\gamma(z_{nk}) (\\ln \\pi_k + \\ln N( \\mathbf{x}_n | \\mathbf{\\mu}_k, \\mathbf{\\Sigma_k})) \\end{aligned} ";
var muUpdate = "\\mathbf{\\mu}_k^{new} = \\frac{ \\sum_{n=1}^N \\gamma(z_{nk}) \\mathbf{x}_n }{\\sum_{n=1}^N \\gamma(z_{nk})} ";
var muUpdateDetailed ="\\text{Setting the derivative of Q with respect to } \\mathbf{\\mu}_k \\text{ to zero yields:} \\\\ \\sum_{n=1}^N \\gamma(z_{n,k}) \\mathbf{\\Sigma}_k^{-1}(\\mathbf{x}_n - \\mathbf{\\mu}_k) = 0 \\implies \\\\ \\mathbf{\\mu}_k^{new} = \\frac{ \\sum_{n=1}^N \\gamma(z_{nk}) \\mathbf{x}_n }{\\sum_{n=1}^N \\gamma(z_{nk})}";
var sigmaUpdate = ""


var showDetailsToggleObj ={};

function toggleEquationDetailsSetup(idName, idNameStr, detailedVersion, nonDetailedVersion){
    showDetailsToggleObj[idNameStr] = false;
    katex.render(nonDetailedVersion, idName, {throwOnError: false});
    $(idNameStr).click(function(){
        if (showDetailsToggleObj[idNameStr]) {
            katex.render(detailedVersion, idName, {throwOnError: false});
        } else {
            katex.render(nonDetailedVersion, idName, {throwOnError: false});
        }
        showDetailsToggleObj[idNameStr] = !showDetailsToggleObj[idNameStr];
    });
}

toggleEquationDetailsSetup(gaussianCompleteDataLogLikelihood,"#gaussianCompleteDataLogLikelihood", gaussianCompleteDataLogLikelihoodExtendedEq, gaussianCompleteDataLogLikelihoodEq);

toggleEquationDetailsSetup(muEquation, "#muEquation", muUpdateDetailed, muUpdate);
//toggleEquationDetailsSetup(piEquation, "#piEquation", piUpdateDetailed, piUpdate);

$('.showExplanation').click(function() {
    $(this).next().toggle();
}
)

// Hide all example details to start
$('.gaussian-mixture').css("display", "none");

//Hide explanations to start
$('.explanation').css("display", "none");

$('#select-gaussian-mixture').click( function(){
    console.log("Selected gaussian mixture")
    //$('#Xdata').text("{x_n}_n=1^N")
    katex.render("\\{x_n\\}_{n=1}^N", Xdata, {});
    $('#Zlatent').text("\(z_{nk}\), encodes the class membership of data point X_n, so z_nk=1 if x_n is in class k, zero otherwise");
    renderMathInElement(document.getElementById('Zlatent'));
    $('#thetaParams').text("Mu, Sigma, pi, the mean mu and variance Sigma of Gaussian distributions, and the mixing weights pi")
    $('#modelDecription').text("We have N data points represented by vectors x_n, that we assume to be drawn from a mixture of K multivariate Gaussian distributions \
    each with a mean given by vector mu_k and a covariance matrix given by Sigma_k. The mixing weights are given pi, a vector of length K whose components sum to 1.")
    $('#tab-select li').removeClass('selected');
    $('#select-gaussian-mixture').addClass('selected');
    $('.gaussian-mixture').css("display", "block");
})

$('#select-example2').click( function(){
    console.log("Selected example2")
    $('#Xdata').text("x_n")
    $('#Zlatent').text("z_nk")
    $('#thetaParams').text("Mu, Sigma, pi")
    $('#tab-select li').removeClass('selected')
    $('#select-example2').addClass('selected')

    $('.gaussian-mixture').css("display", "none");

})


$('#select-missing-data').click( function(){
    console.log("Selected gaussian mixture")
    $('#Xdata').text("x_n")
    $('#Zlatent').text("z_nk")
    $('#thetaParams').text("Mu, Sigma, pi")
    $('#tab-select li').removeClass('selected')
    $('#select-missing-data').addClass('selected')
    $('.gaussian-mixture').css("display", "none");
})






//Sampling vs. optimization

var samplingPlot = plotSampling();
var optimizationPlot = plotOptimization();
var samplesFromSamplesPlot = [];
var optimizationXValue = -2.7;

$('#samplingButton').click( function(){ sampleFromSamplingPlot();});
$('#optimizingButton').click( function(){ iterateOptimization();});
$('#restartOptimization').click(function(){restartOptimization();});
$('#restartSampling').click(function(){restartSampling();});


function plotOptimization() {
    var plot = plotNormalPdf('#optimization');
    return plot;
}

function restartSampling(){
    var svg = d3.select('#sampling');
    svg.selectAll("*").remove();
    samplingPlot = plotNormalPdf('#sampling');
    samplesFromSamplesPlot = [];
}

function restartOptimization() {
    var svg = d3.select('#optimization');
    svg.selectAll("*").remove();
    optimizationPlot = plotNormalPdf('#optimization');
    optimizationXValue = Math.random() * 6 - 3
}

function sampleFromSamplingPlot(){
    samplesFromSamplesPlot.push(jStat.normal.sample(0,1));
    samplingPlot.plot.selectAll(".dot").data(samplesFromSamplesPlot)
    .enter().append("circle")
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d) { return samplingPlot.xScale(d)})
      .attr("cy", function() { return samplingPlot.yScale(0) })
      .attr("r", 5)
      .style("fill", d3.color('blue'));
}

function iterateOptimization() {
    var learningRate = 4;
    var gradient =  -1 * optimizationXValue * jStat.normal.pdf(optimizationXValue, 0, 1);
    console.log(gradient);
    optimizationXValue = optimizationXValue + learningRate * gradient;
    console.log(optimizationXValue);
    var newX = optimizationXValue;

    var circles = optimizationPlot.plot.selectAll(".dot")
    .data([{'y':.3}]);
    circles.exit().remove()

    optimizationPlot.plot.selectAll(".dot").data([{'y':.3}])
    .enter().append("circle")
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d, i) { return optimizationPlot.xScale(newX)})
      .attr("cy", function() { return optimizationPlot.yScale(0) })
      .attr("r", 5)
      .style("fill", d3.color('blue'));
      circles.transition()
          .duration(500)
          .attr("cx",function(d,i){return optimizationPlot.xScale(newX)})
          .attr("cy",optimizationPlot.yScale(0))
          .attr("r",5)
          .style("fill", d3.color('blue'));
}

function plotSampling() {
    var plot = plotNormalPdf('#sampling');
    return plot;   
}

function plotNormalPdf(elementId) {
    var margin = {top: 20, right: 30, bottom: 20, left: 30};
    var width = (document.getElementsByClassName('blogdate')[0]).offsetWidth;- margin.left - margin.right;
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
  
    var dataset = d3.range(-3,3.1,0.1).map(function(d) { return {"x":d ,"y": jStat.normal.pdf(d, 0, 1 ) } });
   
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
  
      return {'plot': svg, 'xScale': xScale, 'yScale': yScale};
}