$(document).ready(function(){
    var sonnetPositionData; // coordinates of points for scatterplot
    const numSonnets = 351; // number of sonnets (shksr + spenser + sidney)
    var pca_or_lda_value = $('#pick-pca').hasClass('tab-heading-selected') ? 'pca' : 'lda';

    // Get sonnet text from file and initial tree data from file
    $.getJSON( "data/sonnets/sonnets_shakespeare_spenser_sidney.json", function( data ) {
        make_scatterplot_with_position_data_from_file("data/sonnets_position_shakespeare_spenser_sidney.json")
        var sonnet_text = ""
            for (i=0; i < numSonnets; i++){
                sonnet_text = data[i]["text"]
                sonnets.push(sonnet_text);
            } 
        //update_tree_from_file("data/sonnets/sonnet_tree_counts_shakespeare_spenser_sidney.json")
    });

    function make_scatterplot_with_position_data_from_file(filename){
        $.getJSON( filename, function( positionData ) {
            sonnetPositionData = positionData;
            create_scatter_plot(sonnetPositionData); 
        });
    }

    function get_height(margin){
        return parseInt(d3.select("#options").style('height'), 10) + parseInt(d3.select("#options").style('padding-top'), 10)
        + parseInt(d3.select("#options").style('padding-bottom'), 10) - margin.top - margin.bottom;
    }


    function create_scatter_plot(positionData){
        var dotRadius = 4;
        var margin = {top: 5, right: 25, bottom: 5, left: 10},
        width = parseInt(d3.select(".tab-heading-container").style('width'), 10) - margin.left - margin.right - 3,
        height =  get_height(margin)
        d3.select('#scatter-container').html('');

        var svg = d3.select("#scatter-container")
        .append("svg")
            .attr("width", width)// + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .classed('white-background', true)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var xScale = d3.scaleLinear()
            .domain(d3.extent(positionData, function(d) { return d.x }))
            .range([ 0, width - 15]);

        // Add Y axis
        var yScale = d3.scaleLinear()
            .domain(d3.extent(positionData, function(d) { return d.y }))
            .range([ height-5, 5]);        

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", width + 2 * (dotRadius + 2) )
            .attr("height", height )
            .attr("x", -(dotRadius + 2))
            .attr("y", 0);

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

        // Create the scatter variable: where both the circles and the brush take place
        var scatter = svg.append('g')
            .attr("clip-path", "url(#clip)") 

        scatter
            .selectAll("dot")
            .data(positionData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.x) )
            .attr("cy", d => yScale(d.y) )
            .attr("r", dotRadius)
            .attr("stroke-width", 0)
            .attr("stroke", "black")
            .attr("class", function(d) { return d.author})
            .style("fill",  d => authorColorScale(d.author))
            .attr("title", function(d) {
                var sonnetNum = convertSonnetIdxToDisplayNumber(d.sonnet_id)
                return d.author + " " + sonnetNum + ": \n" + sonnets[d.sonnet_id]
            })
            .on('click', function(d){
                set_sonnet("sonnet_number-2d", "poet", "#sonnet-2d", d.sonnet_id, true, "-radio")
            })

        var text_labels = scatter.selectAll("text")  
            .data(positionData)
            .join("text")
            .text(function(d) {return convertSonnetIdxToDisplayNumber(d.sonnet_id)})
            .attr("x", d=> xScale(d.x)) 
            .attr("y",  d=> yScale(d.y))
            .style("font-size", "0.8em")
            .attr("class", d => d.author) // Will use this class to show and hide numbers for selected authors appropriately
            .classed('sonnet-number-text',true)
            .classed('hidden',!document.getElementById('showSonnetNumbersCheckbox').checked);   
        
        showOrHideByAuthor(); /* Make scatterplot display according to author checkbox */
        
        function updatePlot(){
            // get new scale
            var newX = d3.event.transform.rescaleX(xScale);
            var newY = d3.event.transform.rescaleY(yScale);
            // update circles and text
            svg.selectAll("circle")
                .attr("cx", d => newX(d.x) )
                .attr("cy", d => newY(d.y) )
            text_labels
                .attr('x',  d => newX(d.x))
                .attr('y',  d => newY(d.y));
        }

        window.addEventListener("resize", function(){
            console.log("redrawing")
            width = parseInt(d3.select(".tab-heading-container").style('width'), 10) - margin.left - margin.right - 3;
            d3.select("#scatter-container svg").style('width', width);
            d3.selectAll("rect").attr('width', width)

            xScale= d3.scaleLinear()
                .domain(d3.extent(positionData, function(d) { return d.x }))
                .range([ 0, width - 15]);
  
            svg.selectAll("circle")
                .attr("cx", d => xScale(d.x) )
                .attr("cy", d => yScale(d.y) )  
            text_labels
                .attr('x', d => xScale(d.x))
                .attr('y', d => yScale(d.y));
        }
        );

        function plot_with_new_data (newPositionData){
            positionData = newPositionData;
            //reset scales
            xScale = d3.scaleLinear()
                .domain(d3.extent(positionData, function(d) { return d.x }))
                .range([ 0, width - 15]);

            yScale = d3.scaleLinear()
                .domain(d3.extent(positionData, function(d) { return d.y }))
                .range([ height-5, 5]);        

            svg.selectAll("circle")
                .data(positionData)  // Update with new data
                .transition()  // Transition from old to new
                .duration(800)  // Length of animation
                .attr("cx", d => xScale(d.x) )
                .attr("cy", d => yScale(d.y) )
            text_labels
                .attr('x', d => xScale(d.x))
                .attr('y', d => yScale(d.y));
        };

        // Deal with selecting diff features
        $('.features-radio').on('click', check_features_and_projection_and_make_scatterplot);
    }

    function check_features_and_projection_and_make_scatterplot(){
        var featureValue = document.querySelector('input[name="feature"]:checked').value;
        var filename = "data/"+ pca_or_lda_value + "_" + featureValue + "_sonnets_position_shakespeare_spenser_sidney.json"
        make_scatterplot_with_position_data_from_file(filename);
    }

    d3.select("#pick-tree").on("click", function(){
        d3.selectAll(".twod-projection-viz").classed("hidden",true);
        d3.selectAll(".tree-viz").classed("hidden",false);
        d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
        d3.select("#pick-tree").classed("tab-heading-selected", true);
       // update(root);
    });
    
    d3.select("#pick-pca").on("click", function(){
        pca_or_lda_value ='pca'
        d3.selectAll(".tree-viz").classed("hidden",true);
        d3.selectAll(".twod-projection-viz").classed("hidden",false);
        d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
        d3.select("#pick-pca").classed("tab-heading-selected", true)
        check_features_and_projection_and_make_scatterplot()
    });

    d3.select("#pick-lda").on("click", function(){
        pca_or_lda_value = 'lda'
        d3.selectAll(".tree-viz").classed("hidden",true);
        d3.selectAll(".twod-projection-viz").classed("hidden",false);
        d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
        d3.select("#pick-lda").classed("tab-heading-selected", true)
        check_features_and_projection_and_make_scatterplot()
    });
    
    
    d3.selectAll('.ui-tooltip').style('display', 'none');
    d3.selectAll(".tree-viz").classed("hidden", true);
    d3.selectAll(".twod-projection-viz").classed("hidden",false);
});