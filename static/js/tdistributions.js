$(document).ready(function(){
;

    normal_pdf_data = []
    for (x=-4; x <= 4; x+=0.1) {
        normal_pdf_data.push({"x":x, "y": jStat.normal.pdf( x, 0, 1)})
    }

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = Math.min((document.getElementsByClassName('blogdate')[0]).offsetWidth, 600) - margin.left - margin.right
    height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#tdist_plot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
            
    // Add X axis
    var xScale = d3.scaleLinear()
        .domain([-4, 4])
        .range([ 0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Add Y axis
    var yScale = d3.scaleLinear()
        .domain([0, 0.5])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yScale));

    function update(){

        // Create t distribution pdf data
        dof = parseInt(d3.select("#tdist_dof").property("value"));
        console.log(dof);
        tdist_pdf_data = []
        for (x=-4; x <= 4; x+=0.1) {
            tdist_pdf_data.push({"x": x, "y": jStat.studentt.pdf( x, dof )})
        }

        // Add lines for normal

        const u2 = svg.selectAll(".normal_line")
        .data([normal_pdf_data], function(d){ return d.x });

        u2
        .join("path")
        .attr("class","normal_line")
        .attr("fill", "none")
        .attr("stroke", "lightgray")
        .attr("stroke-width", 1.5)
        .style("opacity",function(){
            return d3.select("#normal_checkbox").property("checked") ? 1 : 0;
        })
        .attr("d", d3.line()
            .x(function(d) {return xScale(d.x) })
            .y(function(d) {return yScale(d.y) })
            )

        // Add lines for t
        const u = svg.selectAll(".tdist_line")
        .data([tdist_pdf_data], function(d){ return d.x });

        u
        .join("path")
        .attr("class","tdist_line")
        .transition()
        .duration(1000)
        .attr("d", d3.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        // svg.selectAll(".tdist")
        // .data(tdist_pdf_data)
        // .enter()
        // .append("path")
        // .attr("class",".tdist")
        // .attr("fill", "none")
        // .attr("stroke", "steelblue")
        // .attr("stroke-width", 1.5)
        // .attr("d", d3.line()
        //     .x(function(d) { return xScale(d.x) })
        //     .y(function(d) { return yScale(d.y) })
        //     )
        
    }

    update(); // Run this once at the start
    d3.selectAll("#normal_checkbox, #tdist_dof").on("change",update)

});