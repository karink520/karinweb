var width = d3.min([parseInt(d3.select('body').style("width"))-50,1000])
var height = width * 5.5 /10;
               
var svg = d3.select("#us-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

var projection = d3.geoAlbersUsa()
    .translate([width/2, height/2])    
    .scale([width*1.2]);        

var path = d3.geoPath()
    .projection(projection);

d3.json('states-10m.json').then(us => {
    svg.append("path")
        .datum(topojson.feature(us, us.objects.states))
        .attr("class", "land")
        .attr("d", path);
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("class", "boundary")
        .attr("d", path);
    d3.csv('data/us_marathons_coded2.csv').then(data =>{
        console.log(data);
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d){return projection([Number(d.longitude), Number(d.latitude)])[0]; })
            .attr("cy", function(d){return projection([Number(d.longitude), Number(d.latitude)])[1]; })
            .attr("r", 3)
            .style("fill", "red")
            .style("opacity","1.0")
            .on("mouseover", function(d) { 
                if(this.style.opacity > 0.2){
                    div.transition()        
                    .duration(200)      
                    .style("opacity", .9)      
                    div.text(d.Name)
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");  
                } 
            })
            .on("click", function(d) { 
                if(this.style.opacity > 0.2){
                    div.transition()        
                    .duration(200)      
                    .style("opacity", .9)      
                    div.text(d.Name)
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px"); 
                }  
            }) 
    
    });

});

dataTime=[1,2,3,4,5,6,7,8,9,10,11,12];
monthList=['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
monthListShort=['Jan','Feb','Mar','Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec']
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
                if (d.Inception==""){return "black"} else {return "red"}
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


d3.select("#pick-marathons-by-month").on("click", function(){
    d3.selectAll(".inception-year").style("display","none");
    d3.selectAll(".months").style("display","block");
    d3.selectAll("circle").style("fill","red");
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false)
    d3.select("#pick-marathons-by-month").classed("tab-heading-selected", true)
    svg.selectAll("circle")
        .style("opacity", function(d){ 
            if (d.Month == monthList[sliderMonths.value()-1]){return 1.0; }
            else {return 0;}
        })
   
});

d3.select("#pick-marathons-by-inception-year").on("click", function(){
    d3.selectAll(".months").style("display","none");
    d3.selectAll(".inception-year").style("display","block");
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false)
    d3.select("#pick-marathons-by-inception-year").classed("tab-heading-selected", true)
    svg.selectAll("circle")
        .style("fill",function(d){
            if (d.Inception==""){return "black"} else {return "red"}
        })
        .style("opacity", function(d){ 
            if (Number(d.Inception) <= Number(sliderTime.value().getYear())+1900) {return 1.0; }
            else {return 0;}
        })
    
})
