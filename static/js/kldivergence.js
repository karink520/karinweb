// X Make a plot with two probability distributions on it
// O Make a plot with their log pdfs and the difference between those two
// O Make a plot of the product of those things and display
// 0 Calculate and display the KL divergence
// O Make it so that I can turn on and off the pieces of each plot
// O Make it so that I can click a "clear and redraw" button and draw a distribution
// O Make the drawing work
// O Make the drawing rescale to the correct height
// O make the log plots adjust to the redrawing
// O make the KL divergence adjust to the new drawing
// O Reset button

// O Add coding intuition for KL divergence
// O Write plan for Wasserstein distance

var plotColors = {"ppdf": "#74a830", "qpdf":"#0000ff","logppdf": "#74a830", "logqpdf":"#0000ff", "logratio": "#ffab00", "ptimeslogratio": "#000000"};
var displayNames = {"ppdf": "p(x)", "qpdf": "q(x)", "logppdf": "log(p(x))", "logqpdf": "log(q(x))", "logratio": "log(p(x) / q(x)) = log(p(x)) - log(q(x))", "ptimeslogratio": "p(x)log(p(x)/q(x))"};

var res = 100
var n = 8 * res
var xmax = 8;
var xstep = 0.01

var defaultPAndQ =  d3.range(0.01, xmax, xstep).map(function(d) { return {"x": d, "ppdf": jStat.normal.pdf(d, 3, 1), "qpdf": jStat.gamma.pdf(d, 2, 1)  } });
defaultPAndQ.forEach(function(d){d["logppdf"] = Math.log(d.ppdf)});
defaultPAndQ.forEach(function(d){d["logqpdf"] = Math.log(d.qpdf)});
defaultPAndQ.forEach(function(d){d["ratio"] = d.ppdf/ d.qpdf});
defaultPAndQ.forEach(function(d){d["logratio"] = Math.log(d.ratio)});
defaultPAndQ.forEach(function(d){d["ptimeslogratio"] = d.ppdf * d.logratio});

var currentPAndQ = defaultPAndQ;

console.log(defaultPAndQ);
console.log(typeof(defaultPDataset));

$(document).ready(function(){
    renderKatex();
    var xScale, width, margin, height;
    plot_kl(defaultPAndQ);
});

$('#drawP').click( function() {
    d3.selectAll("svg").remove();
    plot_kl_distributions(currentPAndQ, ["qpdf"]);
    plot_kl_log_densities(currentPAndQ, ["logqpdf"]);
    plot_p_log_p_over_q(currentPAndQ);
    calculate_and_display_kL_divergence(currentPAndQ);

});

$('#swapPandQ').click(function(){
    newPAndQ = d3.range(0.01, xmax, xstep).map(function(d, i) { return {"x": d, "ppdf": currentPAndQ[i].qpdf, "qpdf": currentPAndQ[i].ppdf, } });
    newPAndQ.forEach(function(d){d["logppdf"] = Math.log(d.ppdf)});
    newPAndQ.forEach(function(d){d["logqpdf"] = Math.log(d.qpdf)});
    newPAndQ.forEach(function(d){d["ratio"] = d.ppdf/ d.qpdf});
    newPAndQ.forEach(function(d){d["logratio"] = Math.log(d.ratio)});
    newPAndQ.forEach(function(d){d["ptimeslogratio"] = d.ppdf * d.logratio});
    currentPAndQ = newPAndQ;
    plot_kl(currentPAndQ);
})

$('#klReset').click(function(){
    plot_kl(defaultPAndQ);
});

function plot_kl(dataset){
    d3.selectAll("svg").remove();
    plot_kl_distributions(dataset, ["ppdf", "qpdf"]);
    plot_kl_log_densities(dataset, ["logppdf", "logqpdf"]);
    plot_p_log_p_over_q(dataset);
    calculate_and_display_kL_divergence(dataset);
}


function plot_kl_distributions(dataset, groupsToPlot) { 

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = groupsToPlot.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: dataset.map(function(d) {
          return {value: d[grpName]};
        })
      };
    });


    var plotWidth = (document.getElementsByClassName('blogdate')[0]).offsetWidth;
    margin = {top: 20, right: 30, bottom: 20, left: 30};
    width = plotWidth - margin.left - margin.right;
    height = 300;

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

    var line = d3.line()
    .x(function(d, i) { return xScale((i+1)/res); })
    .y(function(d) { return yScale(+d.value) })

    svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return plotColors[d.name] })
        .attr("fill","none")
        .style("stroke-width", 4)

    svg.selectAll("myLegend")
    .data(dataReady)
    .enter()
        .append('g')
        .append("text")
        .attr('x', width/4)
        .attr('y', function(d,i){ return height - (i+1)*20})
        .text(function(d) { return displayNames[d.name]; })
        .style("fill", function(d){ return plotColors[d.name] })
        .style("font-size", 18)
}

function plot_kl_log_densities(dataset, groupsToPlot) {

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = groupsToPlot.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: dataset.map(function(d) {
          return {value: d[grpName]};
        })
      };
    });

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

    var line = d3.line()
        .x(function(d, i) { return xScale((i+1)/res); })
        .y(function(d) { return yScale(+d.value) })

    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return plotColors[d.name] })
        .attr("fill","none")
        .style("stroke-width", 4)
        .style("stroke-dasharray", ("8, 2"))

    svg.selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr('x', width/4)
          .attr('y', function(d,i){ return height - (i+1)*20})
          .attr("class", function(d){ return"text_".concat(d.name)})
          .text(function(d) { return displayNames[d.name]; })
          .style("fill", function(d){ return plotColors[d.name] })
          .style("font-size", 18)

}


function plot_p_log_p_over_q(dataset){
    var groupsToPlot = ["logratio", "ppdf", "ptimeslogratio"]
    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = groupsToPlot.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: dataset.map(function(d) {
          return {value: d[grpName]};
        })
      };
    });
    // I strongly advise to have a look to dataReady with
    console.log(dataReady)

    var yScaleRight = d3.scaleLinear()
        .domain(d3.extent(dataset, function(d) { return d.logratio; } )) // input
        .range([height, 0]) // output
        .nice();
    
    var yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, function(d) { return d.ptimeslogratio; })) // input
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
        .attr("class", "axisOrange")	
        .attr("transform", "translate(" + width + " ,0)")	    		
        .call(d3.axisRight(yScaleRight));

    //d3's line generator
    var line = d3.line()
      .x(function(d, i) { return xScale((i+1)/res); })
      .y(function(d) { return yScale(+d.value) })
    
    var lineRight = d3.line()
      .x(function(d, i) { return xScale((i+1)/res); })
      .y(function(d) { return yScaleRight(+d.value) })


    svg.selectAll("myLines")
      .data(dataReady.slice(0,1))
      .enter()
      .append("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return lineRight(d.values) } )
        .attr("stroke", function(d){ return plotColors[d.name] })
        .style("stroke-dasharray", ("8, 2"))
        .style("stroke-width", 4)
        .style("fill", "none")

    svg.selectAll("myLines")
      .data(dataReady.slice(1,2))
      .enter()
      .append("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return plotColors[d.name] })
        .style("stroke-width", 4)
        .style("fill", "none")
        svg.selectAll("myLines")
    
    svg.selectAll("myLines")
      .data(dataReady.slice(2,3))
      .enter()
      .append("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return plotColors[d.name] })
        .style("stroke-width", 4)

    svg.selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr('x', width/4)
          .attr('y', function(d,i){ return height - 10-i*20})
          .attr("class", function(d){ return"text_".concat(d.name)})
          .text(function(d) { return "☑️ " +displayNames[d.name]; })
          .style("fill", function(d){ return plotColors[d.name] })
          .style("font-size", 18)
        .on("click", function(d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.name).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          if (currentOpacity == 1 || currentOpacity == 0.5){
            d3.selectAll("." + d.name).transition().style("opacity", 0)
            d3.selectAll(".text_"+ d.name).text("🔲 " + displayNames[d.name])
          } else {
            d3.selectAll("." + d.name).transition().style("opacity", 1)
            d3.selectAll(".text_"+ d.name).text("☑️ " + displayNames[d.name])
            if (d.name == "ptimeslogratio"){
                d3.selectAll(".ptimeslogratio").transition().style("opacity", 0.5)
            }
          }
        })
}

function calculate_and_display_kL_divergence(dataset){
    var kl_divergence = d3.sum(dataset, function(d){ return d.ptimeslogratio*xstep});
    console.log(kl_divergence);
    $(calculatedKLDivergence).text(kl_divergence.toFixed(3));
}




function renderKatex(){
    KLdefinitionEq = "D_{KL}(P || Q) = \\displaystyle\\sum_{x \\in X} P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right)";
    KLdefinitionContEq = "D_{KL}(P || Q) = \\int_{x \\in X} P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right) \\, dx";
    KLdefinitionContDispEq = "D_{KL}(P || Q) = \\int P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right) \\, dx = \\,";

    katex.render(KLdefinitionEq, KLdefinition, {throwOnError: false}); //text to render, element id
    katex.render(KLdefinitionContDispEq, KLdefinitionDisplay, {throwOnError: false});
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

    nonsymmetricEq = "D_{KL} (P || Q ) \\neq D_{KL}( Q || P)" 
    katex.render(nonsymmetricEq, nonsymmetric, {throwOnError: false});
}