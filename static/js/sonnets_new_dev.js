$(document).ready(function(){
var margin = {top: 20, right: 20, bottom: 20, left: 12};
var treeContainer =  d3.select("#tree");
var i = 0;
var root;
var sonnet_idx = 1
var sonnet_idx2 = 1;
var setSonnet1Next = false;
var treeDataFromFile;
var width, height, radius;

function set_tree_dimensions(){
    width = parseInt(d3.select('#plot-and-picker').style('width'),10);
    width = Math.min(width, 1200);
    height = width;
    radius = width / 2;
}
//set_tree_dimensions();

function radialPoint(x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

var tree =  d3.cluster()
    .size([2 * Math.PI, radius - margin.right - margin.left]);

function update_tree_from_file(filename){
    set_tree_dimensions()
    $.getJSON(filename, function( treeData ) {
        // Compute the new tree layout.
        treeDataFromFile = treeData;
        root = tree(d3.hierarchy(treeData));
        update(root);
    });
}

function update_tree_with_new_options(){
    console.log("updating with new options")
    var authors = document.querySelectorAll('#choose-authors-tree input:checked');
    var counts_or_embedding; /* which feature set to use */
    if (document.querySelectorAll('#choose-features-tree input:checked')[0].value == "phonemes"){
        counts_or_embedding = "counts"
    } else {
        counts_or_embedding = "embedding"
    }
    
    /* Set filename based on selected options (author and which features*/
    var filename = 'data/sonnets/sonnet_tree_' + counts_or_embedding;
    for (i= 0; i < authors.length; i++) {
        author = String(authors[i].value).toLowerCase();
        filename = filename + "_" + author
    }
    filename = filename + ".json"
    update_tree_from_file(filename);
}

function update(source) {
    set_tree_dimensions();
    /* Respond to authors and numbers settings*/
    d3.selectAll('#choose-authors-tree .authorCheckbox, #choose-features-tree input').on('click', update_tree_with_new_options);
    d3.select('#showSonnetNumbersCheckboxTree').on('click', function(){
        d3.selectAll('#tree .sonnet-number-text').classed('hidden', !document.getElementById('showSonnetNumbersCheckboxTree').checked);
    });
    

    var sonnetLeaf, sonnetLeaf2;
    for (i=0; i < source.leaves().length; i++){
        if (source.leaves()[i].data.id == sonnet_idx){
            sonnetLeaf = source.leaves()[i];
        }
        if (source.leaves()[i].data.id == sonnet_idx2){
            sonnetLeaf2 = source.leaves()[i];
        }
    }

   var shouldSetPath = (typeof sonnetLeaf !=="undefined" && typeof sonnetLeaf2 !=="undefined");
   
   if (shouldSetPath) {
        var sonnetToSonnetPath = sonnetLeaf.path(sonnetLeaf2);
        for (i=0; i < sonnetToSonnetPath.length - 1; i++){
                sourceNode = sonnetToSonnetPath[i];
                targetNode = sonnetToSonnetPath[i+1];
        }
    }

    treeContainer.html('');
    svg = treeContainer.append("svg")
    // .attr("width", width + margin.right + margin.left)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom", function(){
        svg.attr("transform", d3.event.transform)
    }))
    // .call(d3.zoom().on("zoom", function ({transform}) {
    //     currentZoomTransform = transform;
    //     svg.attr("transform", currentZoomTransform)
    //  }))
    .append("g")
        .attr("transform", "translate(" + radius + "," + radius+ ")") 
     .append("g")
     

    var lines_g = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(source.links()) 
    .enter().append("line") /*For straight line segments */
       .attr("x1", function(d) { return radialPoint(d.source.x,d.source.y)[0]; })
       .attr("y1", function(d) { return radialPoint(d.source.x,d.source.y)[1]; })
       .attr("x2", function(d) { return radialPoint(d.target.x,d.target.y)[0]; })
       .attr("y2", function(d) { return radialPoint(d.target.x,d.target.y)[1]; })
       .attr("stroke", function(d){
        if (shouldSetPath){ 
        for (i=1; i < sonnetToSonnetPath.length ; i++){
            sourceNode = sonnetToSonnetPath[i];
            targetNode = sonnetToSonnetPath[i-1];
            if( (d.source === sourceNode && d.target === targetNode) || (d.source === targetNode && d.target === sourceNode)){
                return "#111";
            }
        }};
        return "#bbb";
       });

    var circle_g = svg.append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .attr("stroke", "black")
      .style("fill", function(d) {
        //add author data
        if (d.data.id == '0'){
            d.data.author = "Shakespeare";
        }
        if (Number(d.data.id) < 154 && Number(d.data.id) > 0) {
            d.data.author = "Shakespeare";
        } else if (Number(d.data.id) < 243 && Number(d.data.id) > 0) {
            d.data.author = "Spenser";
        } else if (Number(d.data.id) > 0) {
            d.data.author = "Sidney";
        };
        if (d.data.id == ""){
            d.data.author = "None"
            return "gray";
        }
        //set color
        return authorColorScale(d.data.author);
    })   
        .attr("r", function(d){
            if (width < 700){
                return (d.data.author != "None" ? 2 : 1);
            } else {
                return (d.data.author != "None" ? 3 : 1);
            }
        })
        .attr("stroke-width", function(d){ 
            if ( (sonnet_idx == 0 || sonnet_idx2 == 0) & d.data.id == '0' ){
                return 1;
            } else if ( d.data.id == 0 ){
                return 0;
            }
            else if (( d.data.id == sonnet_idx  || d.data.id == sonnet_idx2) ) {
                return 1;
            } else {
                return 0;
            }
        })
        .attr("title", function(d) {
            if (d.data.author == "None"){
                return;
            }
            var sonnetNum = convertSonnetIdxToDisplayNumber(Number(d.data.id))
            return d.data.author + " " + sonnetNum + ": \n" + sonnets[d.data.id]
        })
    ;

    window.addEventListener("resize", function(){
        set_tree_dimensions();
        tree
            .size([2 * Math.PI, radius - margin.right - margin.left]);
        root = tree(d3.hierarchy(treeDataFromFile));
        update(root);

    });

  var totalNumNodes = root.descendants().length;

  var text_g = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
      .attr("font-size", function(d){ // TODO: set based on num child nodes
          if (totalNumNodes > 500){
              return 4.5
          } else if (totalNumNodes < 500 && totalNumNodes > 350) {
              return 7
          } else {
              return 10
          }
      })
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .text(function(d){ 
        if (d.data.author == "None"){ 
              return "";
        } else { 
          return convertSonnetIdxToDisplayNumber(Number(d.data.id));
        } 
        })
      .classed('sonnet-number-text',true)
      .classed('hidden',!document.getElementById('showSonnetNumbersCheckboxTree').checked);

    d3.selectAll('#tree circle').on('click', clickCircle);


}

function set_sonnet1_tree(clicked_circle_directly) {
    sonnet_idx = document.getElementById("sonnet_number").value - 1;
    set_sonnet("sonnet_number", "tree-viz-poet-1", "#sonnet", sonnet_idx, clicked_circle_directly, "-radio-tree")
    update(root);
}

function set_sonnet2_tree(clicked_circle_directly) {
    sonnet_idx2 = document.getElementById("sonnet_number2").value - 1;
    set_sonnet("sonnet_number2", "tree-viz-poet-2", "#sonnet2", sonnet_idx2, clicked_circle_directly,"-radio-tree2")
    update(root);
}

function clickCircle(d, i){
    var thisSonnetNumber = Number(d.data.id) + 1;
    console.log(thisSonnetNumber);
    d3.selectAll('.ui-tooltip').style('display', 'none');
    if (setSonnet1Next) {
        document.getElementById("sonnet_number").value = thisSonnetNumber;
        set_sonnet1_tree(true);
    } else {
        document.getElementById("sonnet_number2").value = thisSonnetNumber
        set_sonnet2_tree(true);
    }
    
    setSonnet1Next = !setSonnet1Next;
    update(root);
}

$("#display-sonnet").click(function(){ set_sonnet1_tree(false)} );
$("#display-sonnet2").click(function(){ set_sonnet2_tree(false)} );






    var sonnetPositionData; // coordinates of points for scatterplot
    const numSonnets = 351; // number of sonnets (shksr + spenser + sidney)
    var pca_or_lda_value = $('#pick-pca').hasClass('tab-heading-selected') ? 'pca' : 'lda';
    

    // Get sonnet text from file and initial tree data from file
    $.getJSON( "data/sonnets/sonnets_shakespeare_spenser_sidney.json", function( data ) {
        //make_scatterplot_with_position_data_from_file("data/sonnets_position_shakespeare_spenser_sidney.json")
        make_scatterplot_with_position_data_from_file("data/pca_embedding_sonnets_position_shakespeare_spenser_sidney.json")
        var sonnet_text = ""
            for (i=0; i < numSonnets; i++){
                sonnet_text = data[i]["text"]
                sonnets.push(sonnet_text);
            } 
        update_tree_from_file("data/sonnets/sonnet_tree_counts_shakespeare_spenser_sidney.json")
        set_tree_dimensions();
        tree
            .size([2 * Math.PI, radius - margin.right - margin.left]);
       // root = tree(d3.hierarchy(treeDataFromFile));
        //update(root);
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
        width = parseInt(d3.select("#plot-and-picker").style('width'), 10) //- margin.left - margin.right - 3,
        //height =  get_height(margin)
        height = width;
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
            width = parseInt(d3.select("#plot-and-picker").style('width'), 10); //- margin.left - margin.right - 3;
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

        // Deal with selecting diff features
        $('.features-radio').on('click', check_features_and_projection_and_make_scatterplot);
    }

    function check_features_and_projection_and_make_scatterplot(){
        var featureValue = document.querySelector('input[name="feature"]:checked').value;
        var filename = "data/"+ pca_or_lda_value + "_" + featureValue + "_sonnets_position_shakespeare_spenser_sidney.json"
        make_scatterplot_with_position_data_from_file(filename);
    }

    function copy_feature_selections_from_tree(){
        if ($('#scatter-container').hasClass('hidden')){ // If not already selected, copy over author/feature settings
            $('#choose-authors-tree .authorCheckbox').each(function(i) {
                $('#choose-authors .authorCheckbox')[i].checked = this.checked;
            });
            $('#choose-features-tree input').each(function(i){
                $('#features input')[i].checked = this.checked;
            });
            $('#show-sonnet-numbers-tree input').each(function(i){
                $('#show-sonnet-numbers input')[i].checked = this.checked;
            });
        };
    }

    /* Handle tab selections */
    d3.select("#pick-tree").on("click", function(){
        if ($('#tree').hasClass('hidden')){ // If tree not already selected, copy over author/feature settings
            $('#choose-authors .authorCheckbox').each(function(i) {
                $('#choose-authors-tree .authorCheckbox')[i].checked = this.checked;
            });
            $('#features input').each(function(i){
                $('#choose-features-tree input')[i].checked = this.checked;
            });
            $('#features input').each(function(i){
                $('#choose-features-tree input')[i].checked = this.checked;
            });
            $('#show-sonnet-numbers input').each(function(i){
                $('#show-sonnet-numbers-tree input')[i].checked = this.checked;
            });
        };
        d3.selectAll(".twod-projection-viz").classed("hidden",true);
        d3.selectAll(".tree-viz").classed("hidden",false);
        d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
        d3.select("#pick-tree").classed("tab-heading-selected", true);
        update_tree_with_new_options();
        //update(root);
    });
    
    d3.select("#pick-pca").on("click", function(){
        pca_or_lda_value ='pca'
        copy_feature_selections_from_tree()
        d3.selectAll(".tree-viz").classed("hidden",true);
        d3.selectAll(".twod-projection-viz").classed("hidden",false);
        d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
        d3.select("#pick-pca").classed("tab-heading-selected", true)
        check_features_and_projection_and_make_scatterplot()
    });

    d3.select("#pick-lda").on("click", function(){
        pca_or_lda_value = 'lda'
        copy_feature_selections_from_tree()
        d3.selectAll(".tree-viz").classed("hidden",true);
        d3.selectAll(".twod-projection-viz").classed("hidden",false);
        d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
        d3.select("#pick-lda").classed("tab-heading-selected", true)
        check_features_and_projection_and_make_scatterplot()
    });
    
    
    d3.selectAll('.ui-tooltip').style('display', 'none');
    d3.selectAll(".tree-viz").classed("hidden", true);
    d3.selectAll(".twod-projection-viz").classed("hidden",false);
    check_features_and_projection_and_make_scatterplot()
});