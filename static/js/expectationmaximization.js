
// Likelihood vs. posterior selection
$('.posterior').css("display", "none")
$('#select-likelihood').addClass('selected')

$('#select-likelihood').click(function(){
    $('#select-posterior').removeClass('selected')
    $('#select-likelihood').addClass('selected')
    $('.likelihood').css("display", "block")
    $('.posterior').css("display", "none")
})

$('#select-posterior').click(function(){
    $('#select-posterior').addClass('selected')
    $('#select-likelihood').removeClass('selected')
    $('.likelihood').css("display", "none")
    $('.posterior').css("display", "block")
})

//Katex for Guassian mixtures
var gaussianMixtureLikelihood = "p(x | mu, Sigma, pi) ~ \\Sigma p(z) p(x|z, mu, Sigma, pi) = \\Sigma pi_k N(x |\\mu_k, \\Sigma_k)";
var classMembershipProbsEq = "p(z_{kn} = 1 | \\mathbf{x}_n, \\theta^{old}) = \\frac{\\pi_k^{old} N(\\mathbf{x}_n| \\mathbf{\\mu}_k^{old}, \\Sigma_k^{old})}{\\sum_{j=1}^K \\pi_j^{old} N(\\mathbf{x}_n | \\mathbf{\\mu}_j^{old}, \\mathbf{\\Sigma}_j^{old})}";
katex.render(classMembershipProbsEq, classMembershipProbs, {throwOnError:false});




$('.showExplanation').click(function() {
    $(this).next().toggle();
}
)
$('.explanation').click(function() {
    $(this).toggle();
}
)


// Hide all example details to start and on reset
function resetExamples(){
    $('#tab-select li').removeClass('selected')
    $('#select-gaussian-mixture').removeClass('selected')
    $('#select-missing-data').removeClass('selected')
    $('.gaussian-mixture').css("display", "none");
    $('.gaussian-mixture-inline').css("display", "none");
    $('.missing-data').css("display", "none");
    $('.missing-data-inline').css("display", "none");
}
resetExamples();

$('#select-reset').click(resetExamples);

//Hide explanations to start
$('.explanation').css("display", "none");

$('#select-gaussian-mixture').click( function(){
    resetExamples()
    $('#select-gaussian-mixture').addClass('selected');
    $('.gaussian-mixture').css("display", "block");
    $('.gaussian-mixture-inline').css("display", "inline");

})

$('#select-missing-data').click( function(){
    resetExamples();
    $('#select-missing-data').addClass('selected')
    $('.missing-data').css("display", "block");
    $('.missing-data-inline').css("display", "inline");
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