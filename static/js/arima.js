var AR_order = 2, MA_order = 0, I_order = 0;
var num_steps = 40;
var default_AR_coeffs = [0.5, -0.6, 0.4, 0.1];
var default_MA_coeffs = [-0.5, 0.2, 0.4, 0.1];
var default_initial_vals = [3, 3, 3, 3];
var AR_error_std = 0.2
var ARIMA_params = {'AR_coeffs': default_AR_coeffs, 'MA_coeffs': default_MA_coeffs, 'error_std': AR_error_std, 'initial_vals': default_initial_vals }

$(document).ready(function(){

    $('#choose-AR-order').change(function(){
        AR_order = Number(this.value);
        generate_ARMA_equation(AR_order, I_order, MA_order, ARIMA_params.AR_coeffs, ARIMA_params.MA_coeffs);
        generate_more_options(ARIMA_params.initial_vals);    
    });
    $('#choose-MA-order').change(function(){
        MA_order = Number(this.value);
        generate_ARMA_equation(AR_order, I_order, MA_order, ARIMA_params.AR_coeffs, ARIMA_params.MA_coeffs);
        generate_more_options(ARIMA_params.initial_vals);    
    });
    $('#choose-I-order').change(function(){
        I_order = Number(this.value);
        generate_ARMA_equation(AR_order, I_order, MA_order, ARIMA_params.AR_coeffs, ARIMA_params.MA_coeffs);
        generate_more_options(ARIMA_params.initial_vals);
    });

    $('#more-options-button').click(function(){
        $('#more-options-div').toggle();
    })  

    $('#more-options-div').hide();
    generate_more_options(ARIMA_params.initial_vals);
    ARIMA_params = get_AR_params();
    console.log(ARIMA_params);
    y_vals = simulate_ARMA(AR_order, ARIMA_params, num_steps);
    plot_AR(y_vals);
});

function generate_ARMA_equation(AR_order, I_order, MA_order, AR_coeffs, MA_coeffs){
    console.log(I_order);
    var eqn_html = '\\(y_t = \\epsilon_t'
    for(i = 1; i <= AR_order; i++){
        eqn_html += ' + \\)'
        eqn_html += "<input type='number' class='equation-blank AR-parameter' value='"
        eqn_html +=  (AR_coeffs[i-1] ? String(AR_coeffs[i-1]) : String(default_AR_coeffs[i-1]));
        eqn_html += "'></input>"
        eqn_html += '\\( y_{t-' + String(i) + '}';
    }
    // eqn_html += ' + \\epsilon_t'
    for(i=1; i<= MA_order; i++){
        eqn_html += ' + \\)'
        eqn_html += "<input type='number' class='equation-blank MA-parameter' value='"
        console.log(MA_coeffs[i-1])
        eqn_html +=  (MA_coeffs[i-1] ? String(MA_coeffs[i-1]) : String(default_MA_coeffs[i-1]));
        eqn_html += "'></input>"
        eqn_html += '\\( \\epsilon_{t-' + String(i) + '}';
    }
    if (I_order > 0){
        var yString = "y";
        var newEq = ""
        for (i=1; i<=I_order; i++){
            var yPrev = yString
            yString += "'"
            newEq += "\\\\ \\) &emsp; \\(" + yString + '_{t}=' + yPrev + '_{t} -' + yPrev + '_{t-1} \\, \\,'
        }
        eqn_html = eqn_html.replaceAll("y", yString);
        eqn_html += newEq;
    }
    eqn_html += '\\)';
    $('#AR-equation').html(eqn_html);
    renderMathInElement(document.getElementById('AR-equation'));
}

function generate_more_options(initial_vals){
    var num_initial_vals = Math.max(AR_order, I_order, MA_order);
    var html_to_add = "";
    console.log(num_initial_vals);
    for (i = 0; i < num_initial_vals; i++){
        html_to_add += "\\(y_" + String(i) + " = \\)";
        html_to_add += "<input type='number' class='equation-blank initial-val-parameter' value='"
        html_to_add +=  (initial_vals[i] ? String(initial_vals[i]) : String(default_initial_vals[i]));
        html_to_add += "'></input>, "
    }
    html_to_add = html_to_add.slice(0,html_to_add.length- 2);
    console.log(html_to_add);
    $("#more-options-div").html(html_to_add);
    renderMathInElement(document.getElementById('more-options-div'));
}

function get_AR_params(){
    var AR_coeff_arr = Array(AR_order);
    var MA_coeff_arr = Array(MA_order);
    var initial_vals_arr = Array(AR_order);
    $('#AR-equation .AR-parameter').each(function(i){
        console.log(i)
        AR_coeff_arr[i] = Number(this.value);
    });
    $('#AR-equation .MA-parameter').each(function(i){
        MA_coeff_arr[i] = Number(this.value);
    });
    $('#more-options-div .initial-val-parameter').each(function(i){
        initial_vals_arr[i] = Number(this.value) ? Number(this.value) : default_initial_vals[i];
    });
    error_std = Number($('#AR-error-equation .error-std').val());
    return {'AR_coeffs': AR_coeff_arr, 'MA_coeffs': MA_coeff_arr, 'error_std': error_std, 'initial_vals': initial_vals_arr}
}

function simulate_ARMA(AR_order, ARIMA_params, num_steps){

    var AR_coeffs = ARIMA_params.AR_coeffs;
    var MA_coeffs = ARIMA_params.MA_coeffs;
    var error_std = ARIMA_params.error_std;
    var initial_vals = ARIMA_params.initial_vals
    console.log('initial_vals' + initial_vals);
    var y = new Array(num_steps);
    var eps = new Array(num_steps);
    for (t = 0; t < AR_order; t++){
        y[t] = Number(initial_vals[t]);
        console.log(y[t]);
    }
    for (t = 0; t < MA_order; t++){
        eps[t] = jStat.normal.sample(0, error_std);
    }
    for (t = AR_order; t <= num_steps; t++){
        eps[t] = jStat.normal.sample(0, error_std)
        var error = eps[t];
        y_new = 0;
        for (i=1; i<= AR_order; i++)
            y_new += AR_coeffs[i-1] * y[t-i];

        for (i=1; i<= Math.min(MA_order, t); i++){
            error += MA_coeffs[i-1] * eps[t-i];
        }
        y_new += error
        y[t] = y_new;
    }
    if (I_order > 0){
        for(i=1; i<=I_order; i++){
            y_int = y;
            console.log(y_int.length);
            y_int[0] = initial_vals[0]; //TODO: careful with initial values here!
            for(k=1; k<= num_steps; k++){
                y_int[k] = y[k] + y_int[k-1]
            }
        }
        console.log(y_int)
        return y_int;
    }

    console.log(y)
    return y
}

var margin = {top: 10, right: 30, bottom: 30, left: 20},
    width = Math.min((document.getElementsByClassName('blogdate')[0]).offsetWidth, 600) - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

function plot_AR(y_vals){
    var dotRadius = 3;

    var svg = d3.select("#AR-plot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var xScale = d3.scaleLinear()
        .domain([0, y_vals.length - 1])
        .range([ 0, width]);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Add Y axis
    var yScale = d3.scaleLinear()
        .domain([-5, 5])
        .range([ height, 0]);
    var yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width + 2 * (dotRadius + 2) )
        .attr("height", height )
        .attr("x", -(dotRadius + 2))
        .attr("y", 0);

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = svg.append('g')
        .attr("clip-path", "url(#clip)")    

    // Add dots
    //svg.append('g')
    scatter
        .selectAll("dot")
        .data(y_vals)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {  return xScale(i); } )
        .attr("cy", function (d) { return yScale(d); } )
        .attr("r", dotRadius)
        .style("fill", function(d, i){ 
            if (i< AR_order){return "gray"} else {return "blue"};
        })

    // Add lines
    scatter.append('path')
      .datum(y_vals)
      .classed("ar-line",true)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1)
      .attr("d", d3.line()
        .x(function(d, i) { return xScale(i); })
        .y(function(d) { return yScale(d); })
        )

    svg.append('text')
        .classed('plot-title',true)
        .attr('x', width/2 - 40)
        .attr('y', 10)
        .style("font-size", "18px") 
        .text(function(){
            return'ARIMA('+ AR_order + ', ' + I_order + ', ' + MA_order +')'
        })
    
    var zoom = d3.zoom()
        .scaleExtent([.05, 10])  
        .extent([[0, 0], [width, height]])
        .on("zoom", updatePlot);
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);
    
    function updatePlot(){
        // get new scale
        //var newX = d3.event.transform.rescaleX(xScale);
        var newY = d3.event.transform.rescaleY(yScale);

        // update axes
       // xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // update circles and lines
        svg.selectAll("circle")
        //.attr("cx", function (d, i) {  return newX(i); } )
        .attr("cy", function (d) {  return newY(d); } )

        svg.selectAll(".ar-line")
        .attr("d", d3.line()
           // .x(function(d, i) { return newX(i); })
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return newY(d); })
        )
            
    }
  
    

    // Update when button is clicked
    d3.select('#makeplot-button').on('click', function(){
        ARIMA_params = get_AR_params();
        y_vals = simulate_ARMA(AR_order, ARIMA_params, num_steps)

        //reset axes
        xAxis.call(d3.axisBottom(xScale));
        yAxis.call(d3.axisLeft(yScale));
    
        svg.selectAll("circle")
            .data(y_vals)  // Update with new data
            .transition()  // Transition from old to new
            .duration(800)  // Length of animation
            .attr("cx", function (d, i) {  return xScale(i); } )
            .attr("cy", function (d) {  return yScale(d); } )
            .style("fill", function(d, i){ 
                if (i< Math.max(AR_order, I_order, MA_order)){return "gray"} else {return "blue"};
            })

        svg.selectAll(".ar-line")
            .datum(y_vals)
            .transition()  // Transition from old to new
            .duration(800)  // Length of animation
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d); })
            )
        
        svg.select(".plot-title")
            .text(generate_plot_title(AR_order, I_order, MA_order)); 
    })
}

function generate_plot_title(AR_order, I_order, MA_order) {
    var title = 'ARIMA('+ AR_order + ', ' + I_order + ', ' + MA_order +')';
    if (AR_order == 0 && I_order == 0 && MA_order == 0){
        title += ", White noise";
    } else if (AR_order == 1 && I_order == 0 && MA_order == 0) {
        title += " Random walk"
    }
    return title;
}
