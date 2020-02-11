// X Make a plot with two probability distributions on it
// O Make a plot with their log pdfs and the difference between those two
// O Make a plot of the product of those things and display
// O Calculate and display the KL divergence
// O Make it so that I can turn on and off the pieces of each plot
// O Make it so that I can click a "clear and redraw" button and draw a distribution
// O Make the drawing work
// O Make the drawing rescale to the correct height
// O make the log plots adjust to the redrawing
// O make the KL divergence adjust to the new drawing
// O Reset button

var plotColors = {"ppdf": "#74a830", "qpdf":"#0000ff"}

var res = 100
var n = 8 * res
var xmax = 8;
var xstep = 0.01

var defaultPAndQ =  d3.range(0.01, xmax, xstep).map(function(d) { return {"ppdf": jStat.normal.pdf(d, 3, 1), "qpdf": jStat.gamma.pdf(d, 2, 1)  } });
defaultPAndQ.forEach(function(d){d["logppdf"] = Math.log(d.ppdf)});
defaultPAndQ.forEach(function(d){d["logqpdf"] = Math.log(d.qpdf)});
defaultPAndQ.forEach(function(d){d["ratio"] = d.ppdf/ d.qpdf});
defaultPAndQ.forEach(function(d){d["logratio"] = Math.log(d.ratio)});
defaultPAndQ.forEach(function(d){d["ptimeslogratio"] = d.ppdf * d.logratio});

console.log(defaultPAndQ);
console.log(typeof(defaultPDataset));

$(document).ready(function(){
    renderKatex();
    var xScale, width, margin, height;
    plot_kl(defaultPAndQ);


});

function plot_kl(dataset){
    plot_kl_distributions(dataset);
    plot_kl_log_densities(dataset);
    plot_p_log_p_over_q(dataset);
    calculate_and_display_kL_divergence(dataset);
}


function plot_kl_distributions(dataset) { 
    var plotWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
    margin = {top: 20, right: 30, bottom: 20, left: 30};
    width = plotWidth - margin.left - margin.right;
    height = 200;

    xScale = d3.scaleLinear()
        .domain([0, n/100]) // input
        .range([0, width]); //output
  
    var yScale = d3.scaleLinear()
        .domain([0, 0.5]) // input
        .range([height, 0]); // output

    // Add the SVG to the page
    var svg = d3.select('#kldivergenceplot').append("svg")
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
  
    //d3's line generator
    
    console.log('plotting line');
    var line1 = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.ppdf); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line
    
    svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line plotLine") // Assign a class for styling
    .attr("d", line1); // 11. Calls the line generator
    
  
    console.log('plotting line2');
    var line2 = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.qpdf); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line_blue") // Assign a class for styling
    .attr("d", line2); // 11. Calls the line generator

    svg
    .selectAll("myLegend")
    .data(dataset)
    .enter()
      .append('g')
      .append("text")
        .attr('x', function(d,i){ return 30 + i*60})
        .attr('y', 30)
        .text(function(d) { return d.name; })
        .style("fill", function(d){ return plotColors[d.name] })
        .style("font-size", 15)
      .on("click", function(d){
        // is the element currently visible ?
        currentOpacity = d3.selectAll("." + d.name).style("opacity")
        // Change the opacity: from 0 to 1 or from 1 to 0
        d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
      })

}

function plot_kl_log_densities(dataset){
    var yScale = d3.scaleLinear()
        .domain([-5, 1]) // input  TODO: set domain based on data
        .range([height, 0]); // output


    var svg = d3.select('#kllogprobsplot').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    var xAxisPosition = yScale(0);

    // Call the x axis in a group tag
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + xAxisPosition + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  
    //d3's line generator
    var line1 = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.logppdf); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line
    
    svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .style("stroke-dasharray", ("8, 2"))
    .attr("class", "line plotLine") // Assign a class for styling
    .attr("d", line1); // 11. Calls the line generator


    console.log('plotting line2');
    var line2 = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.logqpdf); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .style("stroke-dasharray", ("8, 2"))
    .attr("class", "line_blue") // Assign a class for styling
    .attr("d", line2); // 11. Calls the line generator


}

function plot_p_log_p_over_q(dataset){
    var yScale = d3.scaleLinear()
        .domain([-4, 4]) // input
        .range([height, 0]); // output
    
    var yScaleRight = d3.scaleLinear()
        .domain([-0.4, 0.4]) // input
        .range([height, 0]); // output

    var svg = d3.select('#p_log_p_over_q').append("svg")
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
    
    svg.append("g")				
        .attr("class", "y axis")	
        .attr("transform", "translate(" + width + " ,0)")	
        .style("fill", "red")		
        .call(d3.axisRight(yScaleRight));

    //d3's line generator
    var line1 = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.logratio); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

    svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line plotLine") // Assign a class for styling
    .attr("d", line1); // 11. Calls the line generator

    var line2 = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); }) // set the x values for the line generator
    .y(function(d) { return yScaleRight(d.ppdf); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

    svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line plotLine") // Assign a class for styling
    .attr("d", line2); // 11. Calls the line generator


    console.log('plotting line2');
    var line3 = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); }) // set the x values for the line generator
    .y(function(d) { return yScaleRight(d.ptimeslogratio); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    svg.append("path")
    .datum(dataset) // 10. Binds data to the line
    .attr("class", "line_blue") // Assign a class for styling
    .attr("d", line3); // 11. Calls the line generator

}

function calculate_and_display_kL_divergence(dataset){
    var kl_divergence = d3.sum(dataset, function(d){ return d.ptimeslogratio*xstep});
    console.log(kl_divergence);
    $(calculatedKLDivergence).text(kl_divergence);
}




function renderKatex(){
    KLdefinitionEq = "D_{KL}(P || Q) = \\displaystyle\\sum_{x \\in X} P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right)";
    KLdefinitionContEq = "D_{KL}(P || Q) = \\int_{x \\in X} P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right) \\, dx";
    katex.render(KLdefinitionEq, KLdefinition, {throwOnError: false}); //text to render, element id
    //katex.render( , , {throwOnError: false}); //text to render, element id

    KLdiffOfLogsEq = "\\sum P(x) ( \\log P(x) - \\log Q(x))";
    katex.render(KLdiffOfLogsEq , KLdiffOfLogs, {throwOnError: false});
    
    KLdivOfPWithSelfEq = "\\log \\left( \\frac{P(x)}{P(x)} \\right) = \\log(1) = 0";
    katex.render(KLdivOfPWithSelfEq, KLdivOfPWithSelf, {throwOnError: false});
    KLdivOfPWithSelfEq2 = "D_{KL} (P || P) = 0";
    katex.render(KLdivOfPWithSelfEq2, KLdivOfPWithSelf2, {throwOnError: false});

    jensensEq = "\\int p(x) c(g(x))  \\, dx \\geq c \\left( \\int p(x) g(x) \\, dx \\right)";
    katex.render(jensensEq, jensens, {throwOnError: false});
    jensensEq2 = "g(x) = \\frac{q(x)}{p(x)}";
    katex.render(jensensEq2, jensens2, {throwOnError: false});
    jensensEq3 = "D_{KL} (P || Q) = \\displaystyle\\int p(x) \\left(-\\log\\frac{p(x)}{q(x)}\\right) \\, dx \\geq -\\log \\left( \\int p(x) \\frac{q(x)}{p(x)} \\, dx \\right) = -\\log \\left(\\int q(x) \\, dx \\right)= -\\log(1) = 0";
    katex.render(jensensEq3, jensens3, {throwOnError: false});

    nonsymmetricEq = "D_{KL} (P || Q ) \\neq D_{KL}() Q || P)" 
    katex.render(nonsymmetricEq, nonsymmetric, {throwOnError: false});
}