var width = d3.min([parseInt(d3.select('body').style("width"))-50,1000])
var height = width * 5.5 /10;
const circleColor = "rgb(252, 60, 3)";
const margin = 30;
const margintop = 10;
var miniGraphWidth = d3.min([400,width]);
var miniGraphHeight = miniGraphWidth/2;
               
var svg = d3.select("#us-map")
        .append("svg")
        .attr("width", width+10)
        .attr("height", height+10);

// Append div for tooltip to SVG
var toolTipDiv = d3.select("body")
                .append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

var tempToolTipDiv = d3.select("body")
    .append("div")   
    .attr("class", "tooltip temperature")               
    .style("opacity", 0);

// Parameters for colorbar
var legendWidth = d3.max([width/2,240]);
var legendHeight = 30;
var colorscale = d3.scaleSequential(d3.interpolateRdYlBu).domain([85,45]);
var colorScale2= d3.scaleLinear()
    .range([0,legendWidth])
    .domain([45,85]);

// create svg for colorbar legend          
var legendSvg = d3.select('#colorbar-legend').append("svg")
    .attr("width", legendWidth )
    .attr("height", legendHeight)

// Create the colorbar legend
legendSvg
.append("g")
.selectAll(".bars")
.data(d3.range(45,85), function(d) { return d; })
.enter().append("rect")
    .attr("class", "bars")
    .attr("x", function(d, i) { return (legendWidth/40)*i; })
    .attr("y", 0)
    .attr("height", legendHeight-10)
    .attr("width", (legendWidth/40))
    .style("fill", function(d, i ) { return colorscale(d); })

var legendAxis = d3.axisBottom()
    .scale(colorScale2)
    .ticks(5)
    
legendSvg.append("g").call(legendAxis)

// Create the map projection and a path for it
var projection = d3.geoAlbersUsa()
    .translate([width/2, height/2])    
    .scale([width*1.2]);        
var path = d3.geoPath()
    .projection(projection);

// Load the map json and data csv
d3.json('states-10m.json').then(us => {
    svg.append("path")
        .datum(topojson.feature(us, us.objects.states))
        .attr("class", "land")
        .attr("d", path);
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("class", "boundary")
        .attr("d", path);
    d3.csv('data/us_marathons_coded.csv').then(data =>{
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d){return projection([Number(d.longitude), Number(d.latitude)])[0]; })
            .attr("cy", function(d){return projection([Number(d.longitude), Number(d.latitude)])[1]; })
            .attr("r", function(){
                if (width > 700) { return 4;}
                else {return 3;}
            })
            .style("fill", circleColor)
            .style("opacity","1.0")
            .on("mouseover", function(d) { 
                if(this.style.opacity > 0.2){
                    showNameToolTip(d)
                } 
            })
            .on("click", function(d) { 
                if(this.style.opacity > 0.2){
                    showNameToolTip(d)
                }  
            }) 
    });
});

const dataTime=[1,2,3,4,5,6,7,8,9,10,11,12];
const monthList=['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthListShort=['Jan','Feb','Mar','Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec']
// Months slider
// Adapted from https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
var sliderMonths = d3
    .sliderBottom()
    .min(1)
    .max(12)
    .step(1)
    .width(0.9*width)
    .tickFormat(function(d,i){return monthListShort[i]})
    .tickValues(dataTime)
    .default(4)
    .handle(
        d3.symbol()
          .type(d3.symbolCircle)
          .size(200)
      )
    .on('onchange', val => {
        d3.select('#value-months').text("US marathons in " + monthList[val-1]);
        svg.selectAll("circle")
            .style("opacity", function(d){ 
                if (d.Month == monthList[val-1]){return 1.0; }
                else {return 0;}
            })
        d3.select('#slider-months g.parameter-value text').text(monthListShort[val-1]);

    })
    .on("end", val=> {
        d3.select('#slider-months g.parameter-value text').text(monthListShort[val-1]);
    });

var gTimeMonths = d3
    .select('div#slider-months')
    .append('svg')
    .attr('width', width)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(15,15)');

gTimeMonths.call(sliderMonths);

// Years Slider
// Adapted from https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
var sliderTime = d3
    .sliderBottom()
    .min(new Date(1889, 12, 1))
    .max(new Date(2020, 1, 1))
    .step(1000 * 60 * 60 * 24 * 30)
    .width(0.9*width)
    .tickFormat(d3.timeFormat('%Y'))
    .default(new Date(2020,1,1))
    .on('onchange', val => {
        d3.select('#value-inception-year').text("US marathons established by " + d3.timeFormat('%Y')(val));
        svg.selectAll("circle")
            .style("fill",function(d){
                if (d.Inception==""){return "rgb(40,40,40"} else {return circleColor}
            })
            .style("opacity", function(d){ 
                if (Number(d.Inception) <= Number(val.getYear())+1900) {return 1.0; }
                else {return 0;}
            })
    });

  var gTime = d3
    .select('div#slider-inception-year')
    .append('svg')
    .attr('width', width)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(15,15)');

gTime.call(sliderTime);
d3.select('g.parameter-value text').text('Apr')


// Code to run on tab selection of month tab
d3.select("#pick-marathons-by-month").on("click", function(){ 

    // Adjust displays, visibility, and opacity
    d3.selectAll(".inception-year").style("display","none");
    d3.selectAll(".temperature").style("display", "none")
    d3.selectAll(".months").style("display","block");
    d3.selectAll("circle").style("fill",circleColor);
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
    d3.selectAll('.tooltip').style("opacity", 0);
    toolTipDiv.style.display = "block";
    d3.select("#pick-marathons-by-month").classed("tab-heading-selected", true);

    //Adjust circles and tooltips
    svg.selectAll("circle")
        .style("opacity", function(d){ 
            if (d.Month == monthList[sliderMonths.value()-1]){return 1.0; }
            else {return 0;}
        })
        .on("mouseover", function(d) { 
            if(this.style.opacity > 0.2){
                showNameToolTip(d)
            } 
        })
        .on("click", function(d) { 
            if(this.style.opacity > 0.2){
                showNameToolTip(d)
            }  
        });
   
});

// Code to run on tab selection of year tab
d3.select("#pick-marathons-by-inception-year").on("click", function(){

    // Adjust displays, visibility, and opacity
    d3.selectAll(".months").style("display","none");
    d3.selectAll(".temperature").style("display", "none");
    d3.selectAll(".inception-year").style("display","block");
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
    d3.selectAll('.tooltip').style("opacity", 0); 
    d3.select("#pick-marathons-by-inception-year").classed("tab-heading-selected", true)

    // Adjust circles and tooltips
    svg.selectAll("circle")
        .style("fill",function(d){
            if (d.Inception==""){return "rgb(40,40,40"} else {return circleColor}
        })
        .style("opacity", function(d){ 
            if (Number(d.Inception) <= Number(sliderTime.value().getYear())+1900) {return 1.0; }
            else {return 0;}
        })
        .on("mouseover", function(d) { 
            if(this.style.opacity > 0.2){
                showNameToolTip(d);
            } 
        })
        .on("click", function(d) { 
            if(this.style.opacity > 0.2){
                showNameToolTip(d);
            }  
        });
});

// Code to run on tab selection of temperature tab
d3.select("#pick-marathons-by-temperature").on("click", function(){

    // Adjust displays, visibility, and opacity
    d3.selectAll(".months").style("display","none");
    d3.selectAll(".inception-year").style("display","none");
    d3.selectAll(".temperature").style("display", "block");
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
    d3.selectAll('.tooltip').style("opacity", 0);
    d3.select("#pick-marathons-by-temperature").classed("tab-heading-selected", true)

    // Adjust circles and tooltips and add small graph for race day temp if applicable 
    svg.selectAll("circle")
        .style("opacity",1.0)
        .style("fill",function(d){
           return colorscale(d.avgMaxTemp_F);
        })
        .on("mouseover", function(d) {showTempTooltip(d);})
        .on("click", function(d) {
            showTempTooltip(d);
            d3.select("#race-day-temperature-graph").html("");

            // Small graph for race day temperature (currently only for boston)
            var tempData;
            if (d.Name == "Boston Marathon" || d.Name == "New York City Marathon" || d.Name =="Napa Valley Marathon"){
                // Data for graph (TODO: generate programatically)
                tempData = [
                    {'Year': 2019, 'High': d.high_2019, 'Low': d.low_2019},
                    {'Year': 2018, 'High': d.high_2018, 'Low': d.low_2018},
                    {'Year': 2017, 'High': d.high_2017, 'Low': d.low_2017},
                    {'Year': 2016, 'High': d.high_2016, 'Low': d.low_2016},
                    {'Year': 2015, 'High': d.high_2015, 'Low': d.low_2015},
                    {'Year': 2014, 'High': d.high_2014, 'Low': d.low_2014},
                    {'Year': 2013, 'High': d.high_2013, 'Low': d.low_2013},
                    {'Year': 2012, 'High': d.high_2012, 'Low': d.low_2012},
                    {'Year': 2011, 'High': d.high_2011, 'Low': d.low_2011},
                    {'Year': 2010, 'High': d.high_2010, 'Low': d.low_2010},
                ]
            
                // Create svg to hold the graph
                var miniGraphSvg = d3.select("#race-day-temperature-graph")
                    .append("svg")
                    .attr("width", miniGraphWidth)
                    .attr("height", miniGraphHeight)   
            
                // X axis (TODO: fix domain/scale issues)
                var xScale = d3.scaleLinear()
                    .domain([(2010 -1970)*1000 * 60 * 60 * 24 * 365 ,(2021-1970)*1000 * 60 * 60 * 24 * 365]) 
                    .range([margin, miniGraphWidth]);

                var tickValues = [2011,2012,2013,2013,2014,2015,2016,2017, 2018, 2019, 2020];
                tickValues.forEach(function(x, idx, arr){ arr[idx] = (x-1970)*1000 * 60 * 60 * 24 * 365});

                miniGraphSvg.append("g")
                    .attr("transform", "translate(0," + Number(miniGraphHeight - margin) + ")")
                    .call(d3.axisBottom(xScale).tickValues(tickValues).tickFormat(d3.timeFormat("%Y"))); 
            
                //Y axis       
                var yScale = d3.scaleLinear()
                    .domain([30,90])
                    .range([miniGraphHeight - margin, margintop]);

                miniGraphSvg.append("g")
                    .attr("transform", "translate(" + margin + "," + "0" + ")")
                    .call(d3.axisLeft(yScale))
            
                // Lines
                var line = d3.line()
                .x(function(td) { return xScale((td.Year + 1 - 1970)*1000 * 60 * 60 * 24 * 365); }) 
                .y(function(td) { return yScale(td.High); }) 
                .defined(function (d) { return d.High !== ''; }); //handle missing in data by showing gap in graph -- e.g. 2012 NYC marathon was cancelled
            
                var lowTempLine = d3.line()
                    .x(function(td) { return xScale((td.Year + 1 - 1970)*1000 * 60 * 60 * 24 * 365); })
                    .y(function(td) { return yScale(td.Low); }) 
                    .defined(function (d) { return d.Low !== ''; }); //handle gaps in data by showing gap in graph

                miniGraphSvg.append("path")
                    .datum(tempData)
                    .attr("class", "mini-graph-line") 
                    .attr("d", line);
                
                miniGraphSvg.append("path")
                    .datum(tempData)
                    .attr("class", "mini-graph-line") 
                    .style("stroke", "CornflowerBlue")
                    .attr("d", lowTempLine);
                
                // Title
                miniGraphSvg.append("text")
                    .attr("x", (miniGraphWidth/ 2))             
                    .attr("y", margin/2)
                    .attr("text-anchor", "middle")  
                    .style("font-size", "14px") 
                    .text(d.Name + ": race day temperatures" );
            }
        });
    
})

// Functions for displaying tooltips
function showTempTooltip(d){
    tempToolTipDiv.transition()        
        .duration(200)      
        .style("opacity", .9); 
    tempToolTipDiv.html('')
    tempToolTipDiv.append("p").text(d.Name);
    tempToolTipDiv.append("p").text("avg. high: " + d.avgMaxTemp_F)
    tempToolTipDiv.append("p").text("avg. low: " + d.avgMinTemp_F)
    tempToolTipDiv
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px"); 
}

function showNameToolTip(d){
    toolTipDiv.transition()        
        .duration(200)      
        .style("opacity", .9);      
    toolTipDiv.text(d.Name)
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px");  
}

// Small graph for cumulative marathons over time
d3.csv('data/marathon_count.csv').then(data =>{

    // Create svg for graph      
    var miniGraphSvg = d3.select("#total-marathons-by-year")
        .append("svg")
        .attr("width", miniGraphWidth)
        .attr("height", miniGraphHeight)

    // X axis  
    var xScale = d3.scaleLinear()
        .domain([(1890 -1970)*1000 * 60 * 60 * 24 * 365 ,(2020-1970)*1000 * 60 * 60 * 24 * 365]) 
        .range([margin, miniGraphWidth]);


    var tickValues = [1900,1925,1950,1976,2001];
    tickValues.forEach(function(x, idx, arr){ arr[idx] = (x-1970)*1000 * 60 * 60 * 24 * 365});

    miniGraphSvg.append("g")
        .attr("transform", "translate(0," + Number(miniGraphHeight - margin) + ")")
        .call(d3.axisBottom(xScale).tickValues(tickValues).tickFormat(d3.timeFormat("%Y"))); 

    // Y axis
    var yScale = d3.scaleLinear()
        .domain([0, 200])
        .range([miniGraphHeight - margin, margintop]);

    miniGraphSvg.append("g")
        .attr("transform", "translate(" + margin + "," + "0" + ")")
        .call(d3.axisLeft(yScale).tickValues([0,50,100,150,200]));

    // Line
    var line = d3.line()
        .x(function(d, i) { return xScale((d.Year - 1970)*1000 * 60 * 60 * 24 * 365); })
        .y(function(d) { return yScale(d.Number_Of_Marathons); }) 
        .curve(d3.curveMonotoneX)

    miniGraphSvg.append("path")
        .datum(data)
        .attr("class", "mini-graph-line") 
        .attr("d", line);

    // Title
    miniGraphSvg.append("text")
        .attr("x", miniGraphWidth / 2)             
        .attr("y", margin / 2)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .text("Total number of marathons*");

});