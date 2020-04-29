// X Make a plot with two probability distributions on it
// X Make a plot with their log pdfs
// X Make a plot with the difference between the log pdfs and the product of the diff with P
// X Shade in the area under the curve 
// X Calculate and display the KL divergence
// X Make it so that I can turn on and off the pieces of each plot
// O Make it so that I can click a "clear and redraw" button and draw a distribution
// O Make the drawing work
// O Make the drawing rescale to the correct height
// O make the log plots adjust to the redrawing
// O make the KL divergence adjust to the new drawing
// X Reset button

// O Add coding intuition for KL divergence
// O Write plan for Wasserstein distance

var plotColors = {"ppdf": "#74a830", "qpdf":"#0000ff","logppdf": "#74a830", "logqpdf":"#0000ff", "logratio": "#ffab00", "ptimeslogratio": "#000000"};
var displayNames = {"ppdf": "p(x)", "qpdf": "q(x)", "logppdf": "log(p(x))", "logqpdf": "log(q(x))", "logratio": "log(p(x) / q(x)) = log(p(x)) - log(q(x))", "ptimeslogratio": "p(x)log(p(x)/q(x))"};

var res = 20
var n = 8 * res
var xmax = 8;
var xstep = 1.0 / res
var sketchable_svg;
var xScale;
var sketchable_yScale;
var pdata = [];

var defaultPAndQ =  d3.range(xstep, xmax, xstep).map(function(d) { return {"x": d, "ppdf": jStat.normal.pdf(d, 3, 1), "qpdf": jStat.gamma.pdf(d, 2, 1)  } });

function createDefaultPAndQ(){
  return d3.range(xstep, xmax, xstep).map(function(d) { return {"x": d, "ppdf": jStat.normal.pdf(d, 1.5, 1) * 0.75 + jStat.normal.pdf(d, 4.5, 0.5) * 0.25, "qpdf": jStat.gamma.pdf(d, 4, 0.5)  } });

}

var currentPAndQ = createDefaultPAndQ();

console.log(defaultPAndQ);
//console.log(typeof(defaultPDataset));

$(document).ready(function(){
    renderKatex();
    var width, margin, height;
    plot_kl(currentPAndQ);
});

$('#drawP').click( function() {
    //TO DO: Add some visual indication that the graph is now draggable    
    d3.selectAll("svg").remove(); //IS THIS GOING TO BE A PROBLEM?
    sketchable_svg = plot_kl_distributions(currentPAndQ, ["qpdf"]);
    plot_kl_log_densities(currentPAndQ, ["logqpdf"]);
    plot_p_log_p_over_q(currentPAndQ);
    //calculate_and_display_kL_divergence(currentPAndQ);

    var canvas = d3.select('#kldivergenceplot')
        .call(d3.drag()
        .container(function(){ return this; })
        .subject(function() { var p = [d3.event.x, d3.event.y]; return [p, p]; })
        .on('start', drag_started)
        .on('end', drag_ended)
        );
});


function coordinates_in_bounds() {
    var x1 = d3.event.x,
      y1 = d3.event.y,
      inv_y = sketchable_yScale.invert(y1),
      inv_x = xScale.invert(x1) - xScale.invert(30);

      y1 = inv_y
      x1 = inv_x

      y1 = inv_y < 0 ? sketchable_yScale(0) : y1;
    // y1 = inv_y > y_max ? sketchable_yScale(y_max) : y1;
    // x1 = inv_x < x_min ? xScale(x_min) : x1;
    // x1 = inv_x > x_max ? xScale(x_max) : x1;
    return {x: x1, y: y1};
  }

function drag_started(){
    console.log("drag started")
    var canvas = d3.select('#kldivergenceplot');
    canvas.selectAll('path.line').remove();
    var d = d3.event.subject;//,
      //active = canvas.append('path').attr('class', 'line').datum(d),
      x0 = d3.event.x,
      y0 = d3.event.y;
    pdata = [];
    d3.event.on('drag', function() { 
        var coords = coordinates_in_bounds(),
          x1 = coords.x,
          y1 = coords.y,
          dx = x1 - x0,
          dy = y1 - y0,
          last = d[d.length - 1];
          //console.log(last);
          //console.log(x1);
       // if (last[0] < x1) {
          d.push([x0 = x1, y0 = y1]);
          console.log(x0)
          console.log(x1)
          //console.log(x0);
         // pdata.push([x0, y0]);
          pdata.push([x0, y0]);
          //Math.round(xScale.invert(x0)*100)/100
       // }
       // active.attr('d', render_line);
      });
}

function drag_ended(){
    //console.log(pdata);
    for (var i=0; i < currentPAndQ.length; i++) {
        currentPAndQ[i].ppdf = 0;
    }
    for( var j=0; j < pdata.length; j++){
        var lastAssignedK = 0;
        var lastValidY = 0;
        var dy = 0;
        //console.log(pdata[j][0]);
        //console.log(xScale(pdata[j][0]));
        //console.log(xScale.invert(pdata[j][0]));
        var thisX = Math.round( pdata[j][0] * res) / res;
        console.log(thisX);
        for (var k=0; k< currentPAndQ.length; k++){
            if ( Math.abs(currentPAndQ[k].x - thisX) <= xstep/2){
                dy = (pdata[j][1] - lastValidY) / (k - lastAssignedK);
                lastValidY = pdata[j][1];           
                lastAssignedK = k;
                currentPAndQ[k].ppdf = pdata[j][1];
            } else if (k > lastAssignedK && k < lastAssignedK + 1) {
                currentPAndQ[k].ppdf = lastValidY + (k-lastAssignedK) * dy;
            }
        }
        //find index of closest x value
       // var index
        //set the associated ppdf to match
    }
    for(var k=0; k< currentPAndQ.length; k++){
        var match_found = false;
        var closestBelowIndex = 0;
        for(var j=0; j<pdata.length; j++){
            var thisX = Math.round( pdata[j][0] * res) / res;
            if (thisX < currentPAndQ[k].x){
                closestBelowIndex = j;
            }
            if ( Math.abs(currentPAndQ[k].x - thisX) <= 0.005){
                match_found = true;
                currentPAndQ[k].ppdf = pdata[j][1];
            }
        }
        if (!match_found && closestBelowIndex !=0 && closestBelowIndex != pdata.length-1) {
            currentPAndQ[k].ppdf = currentPAndQ[k-1].ppdf + xstep*(pdata[closestBelowIndex][1] - pdata[closestBelowIndex+1][1])/ (pdata[closestBelowIndex][0] - pdata[closestBelowIndex+1][0])
        }
    }
    plot_kl(currentPAndQ);
    console.log("drag ended");
    //turn off the dragability here?
}


$('#swapPandQ').click(function(){
    newPAndQ = d3.range(xstep, xmax, xstep).map(function(d, i) { return {"x": d, "ppdf": currentPAndQ[i].qpdf, "qpdf": currentPAndQ[i].ppdf, } });
    currentPAndQ = newPAndQ.slice();
    plot_kl(currentPAndQ);
})

$('#klReset').click(function(){
    currentPAndQ = createDefaultPAndQ();
    plot_kl(currentPAndQ);
});

function robust_log(z){
    if (z < 1e-100){
        return -100;
    } else {
        return Math.log(z);
    }
}

function plot_kl(dataset){
    d3.selectAll("svg").remove();
    dataset = normalize(dataset);
    sketchable_svg = plot_kl_distributions(dataset, ["ppdf", "qpdf"]);

    dataset.forEach(function(d){d["logppdf"] = robust_log(d.ppdf)});
    dataset.forEach(function(d){d["logqpdf"] = robust_log(d.qpdf)});
    dataset.forEach(function(d){d["logratio"] = d.logppdf - d.logqpdf});
    dataset.forEach(function(d){d["ptimeslogratio"] = d.ppdf * d.logratio});
    console.log(dataset);
    plot_kl_log_densities(dataset, ["logppdf", "logqpdf"]);
    plot_p_log_p_over_q(dataset);
    calculate_and_display_kL_divergence(dataset);
}

function normalize(dataset){
    p_sum = 0;
    q_sum = 0;
    for (var i = 0; i< dataset.length; i++){
        p_sum += dataset[i].ppdf * xstep;
        q_sum += dataset[i].qpdf * xstep;
    }
    dataset.forEach(function(d){d["ppdf"] =d.ppdf / p_sum});
    dataset.forEach(function(d){d["qpdf"] =d.qpdf / q_sum});
    return dataset;
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
        .domain([0, n/res]) // input
        .range([0, width]); //output
  
    sketchable_yScale = d3.scaleLinear()
        .domain([0, 0.7]) // input
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
        .call(d3.axisLeft(sketchable_yScale)); // Create an axis component with d3.axisLeft

    var line = d3.line()
    .curve(d3.curveBasis) 
    .x(function(d, i) { return xScale((i+1)/res); })
    .y(function(d) { return sketchable_yScale(+d.value) })

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

    console.log(svg);
    return svg;
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
        .curve(d3.curveBasis)   
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
    var groupsToPlot = ["logratio", "ptimeslogratio"]
    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = groupsToPlot.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: dataset.map(function(d) {
          return {value: d[grpName]};
        })
      };
    });
    
    //console.log(dataReady)
    var lower_bound = d3.max([d3.extent(dataset, function(d) { return d.logratio; })[0], -8]);
    var upper_bound =d3.extent(dataset, function(d) { return d.logratio; })[1]

    var max_abs_bound = d3.max([Math.abs(lower_bound), Math.abs(upper_bound)]);
    var yScaleRight = d3.scaleLinear()
        .domain([-max_abs_bound , max_abs_bound ] ) // input
        .range([height, 0]) // output
        .nice();
    
    var left_y_extent = d3.extent(dataset, function(d) { return d.ptimeslogratio; });
    max_abs_bound = d3.max([Math.abs(left_y_extent[0]), Math.abs(left_y_extent[1])])
    console.log(max_abs_bound);
    var yScale = d3.scaleLinear()
        .domain([-max_abs_bound, max_abs_bound]) // input
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
    .curve(d3.curveBasis)   
      .x(function(d, i) { return xScale((i+1)/res); })
      .y(function(d) { return yScale(+d.value) })
    
    var lineRight = d3.line()
    .curve(d3.curveBasis) 
      .x(function(d, i) { return xScale((i+1)/res); })
      .y(function(d) { return yScaleRight(+d.value) })

    var	area = d3.area()	
    .x(function(d ) { return xScale(d.x) })	//CHANGE
    .y0(yScale(0))					
    .y1(function(d) { return yScale(d.ptimeslogratio); }) //CHANGE
  
  svg.append("path")
      .data([dataset]) // CHANGE
      .attr("class", "shaded-area")
      .attr("d", area);

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
    $(calculatedKLDivergence).text(kl_divergence.toFixed(2));
}




function renderKatex(){
    KLdefinitionEq = "D_{KL}(P || Q) = \\displaystyle\\sum_{x \\in X} P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right)";
    KLdefinitionContEq = "D_{KL}(P || Q) = \\int_{x \\in X} P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right) \\, dx";
    KLdefinitionContDispEq = "D_{KL}(P || Q) = \\int P(x) \\log \\left( \\frac{P(x)}{Q(x)} \\right) \\, dx \\approx \\,";

    katex.render(KLdefinitionContEq, KLdefinition, {throwOnError: false}); //text to render, element id
    katex.render(KLdefinitionContDispEq, KLdefinitionDisplay, {throwOnError: false});
    //katex.render( , , {throwOnError: false}); //text to render, element id

    KLdiffOfLogsEq = "\\int P(x) ( \\log P(x) - \\log Q(x)).";
    katex.render(KLdiffOfLogsEq , KLdiffOfLogs, {throwOnError: false});
    logDiffIdentityEq = "\\log \\frac{a}{b} = \\log a - \\log b";
    katex.render( logDiffIdentityEq,  logDiffIdentity, {throwOnError: false});

    KLdivOfPWithSelfEq = "\\log \\left( \\frac{P(x)}{P(x)} \\right) = \\log(1) = 0";
    katex.render(KLdivOfPWithSelfEq, KLdivOfPWithSelf, {throwOnError: false});
    KLdivOfPWithSelfEq2 = "D_{KL} (P || P) = 0";
    katex.render(KLdivOfPWithSelfEq2, KLdivOfPWithSelf2, {throwOnError: false});

    jensensEq = "\\int p(x) c(g(x))  \\, dx \\geq c \\left( \\int p(x) g(x) \\, dx \\right)";
    katex.render(jensensEq, jensens, {throwOnError: false});
    jensensEq2 = "g(x) = \\frac{Q(x)}{P(x)}";
    katex.render(jensensEq2, jensens2, {throwOnError: false});
    jensensEq3 = "D_{KL} (P || Q) = \\displaystyle\\int P(x) \\left(-\\log\\frac{Q(x)}{P(x)}\\right) \\, dx \\geq -\\log \\left( \\int P(x) \\frac{Q(x)}{P(x)} \\, dx \\right) = -\\log \\left(\\int Q(x) \\, dx \\right)= -\\log(1) = 0";
    katex.render(jensensEq3, jensens3, {throwOnError: false});

    nonsymmetricEq = "D_{KL} (P || Q ) \\neq D_{KL}( Q || P)"; 
    katex.render(nonsymmetricEq, nonsymmetric, {throwOnError: false});

    codingEq0 = "0.25 \\times 2 + 0.5 \\times 1 + 0.25 \\times 2 = \\sum\\limits_{x \\in \\{p,e,t\\}} - P(x) \\log_2 P(x) = 1.5."
    katex.render(codingEq0, codingEquation0, {throwOnError: false});

    codingEq1 = "0.25 \\times 1 + 0.5 \\times 2 + 0.25 \\times 2 = \\sum\\limits_{x \\in \\{p,e,t\\}} - P(x) \\log_2 Q(x) = 1.75."
    katex.render(codingEq1, codingEquation1, {throwOnError: false});

    codingEq2 = "\\sum\\limits_{x \\in \\{p,e,t\\}} - P(x) \\log_2 Q(x) - \\sum\\limits_{x \\in \\{p,e,t\\}} - P(x) \\log_2 P(x) = \\sum\\limits_{x \\in \\{p,e,t\\}} P(x) \\log_2 \\frac{P(x)}{Q(x)}."
    katex.render(codingEq2, codingEquation2, {throwOnError: false});

    crossEntropyEq = "\\int - P(x) \\log Q(x) \\, dx- \\int - P(x) \\log P(x) \\, dx";
    katex.render(crossEntropyEq, crossEntropy, {throwOnError: false});
}