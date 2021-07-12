var sonnet_idx = 1; // sonnet to highlight (tree)
var sonnet_idx2 = 1; // second sonnet to hightlight (tree)
var sonnet_idx_2d_proj; // sonnet to highlight (scatter)
var sonnets = []; // array of sonnet text (each elt is a sonnet)
var setSonnet1Next = false;
var sonnetPositionData; // coordinates of points for scatterplot
var points; //points in 2d visualization
const numSonnets = 351; // number of sonnets (shksr + spenser + sidney)

// Tooltips throughout
$( document ).tooltip({});

// Handle show more/less buttons in 'about' section
$('#show-more').on('click', function(){
    $('#about-more').toggleClass("hidden")
    if ($('#about-more').hasClass("hidden")){
        d3.select('#show-more').html('(show more)')
    } else {
        d3.select('#show-more').html('(show less)')
    }
})

// Convert sonnet index (0-350) to sonnet number for display
function convertSonnetIdxToDisplayNumber(sonnetIdx) {
    if (sonnetIdx >= 154 && sonnetIdx < 243) { //if (author == "Spenser"){
        return sonnetIdx - 154 + 1;
    }
    else if (sonnetIdx >= 243) { //else if (author == "Sidney"){
        return sonnetIdx - (154 + 89) + 1;
    }
    else if (sonnetIdx < 154 ){ //else if (author == "Shakespeare"){
        return sonnetIdx + 1;
    }
}

// Return author for a given sonnet index (0-350)

// Color scale for authors
var authorColorScale = d3.scaleOrdinal()
    .domain(["Shakespeare", "Spenser", "Sidney"])
    .range(d3.schemeSet2)

// Highlighting and displaying sonnets

function set_sonnet(id_for_entered_number, name_for_poet_field, id_for_displaying_text, sonnet_idx_to_match, clicked_circle_directly, author_radio_classname) {
    var entered_number;
    var author;
    var poetQuery = 'input[name="' + name_for_poet_field + '"]:checked';
    if (clicked_circle_directly) {
        if (sonnet_idx_to_match < 154){
            entered_number = sonnet_idx_to_match + 1;
            author = "Shakespeare";
        } else if (sonnet_idx_to_match < 243){
            entered_number = sonnet_idx_to_match - 153;
            author = "Spenser";
        } else {
            entered_number = sonnet_idx_to_match - 242;
            author = "Sidney";
        }
        var author_class = '.' + author.toLowerCase() + author_radio_classname;
        $(author_class).prop('checked', true)     
        document.getElementById(id_for_entered_number).value = String(entered_number);
    }
    else {
        entered_number = document.getElementById(id_for_entered_number).value;
        author = document.querySelector(poetQuery).value;
        if (author == "Shakespeare"){
            if (entered_number > 154) { //deal with someone entering number out of range
                entered_number = 154
            }
            sonnet_idx_to_match = entered_number - 1;
        } else if (author == "Spenser") {
            if (entered_number > 89) {
                entered_number = 89
            }
            sonnet_idx_to_match = Number(entered_number) + 153;
        } else if (author == "Sidney") {
            if (entered_number > 108){
                entered_number = 108;
            }
            sonnet_idx_to_match = Number(entered_number) + 242;
        }
        document.getElementById(id_for_entered_number).value = String(entered_number);
        if (id_for_displaying_text == "#sonnet"){
            sonnet_idx = sonnet_idx_to_match;
        } else if (id_for_displaying_text == "#sonnet2"){
            sonnet_idx2 = sonnet_idx_to_match;
        }
    }
    
    $(id_for_displaying_text).html(sonnets[sonnet_idx_to_match]);

    d3.selectAll("circle")
        .style("fill", function(d){ return authorColorScale(d.author);}) // color based on author
        .attr("r", function(d){  
            if (d.sonnet_id == sonnet_idx_to_match){
                return 8;
            } else if (typeof d.author == "undefined"){
                return 1;
            } else {
                return 4;
            }
        })
        .attr("stroke-width", function(d){ 
            return (d.sonnet_id == sonnet_idx_to_match ? 1 : 0)
        })
}

/* Set all circle sizes to default, circle stroke-widths to 0, scatter sonnet text to empty */
function unset_sonnet(){
    d3.selectAll("circle")
        .style("fill", function(d){ return authorColorScale(d.author);})
        .attr("r", 4)
        .attr("stroke-width", 0)
    $("#sonnet-2d").html("")
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

$("#display-sonnet-2d").click(function(){set_sonnet("sonnet_number-2d", "poet", "#sonnet-2d", sonnet_idx_2d_proj, false) });
$("#unhighlight-sonnet").click(unset_sonnet);
$("#display-sonnet").click(function(){ set_sonnet1_tree(false)} );
$("#display-sonnet2").click(function(){ set_sonnet2_tree(false)} );
// END: highlighting and displaying sonnets

// Get sonnet text from file and initial tree data from file
$.getJSON( "data/sonnets/sonnets_shakespeare_spenser_sidney.json", function( data ) {
    replot_with_position_data_from_file("data/sonnets_position_shakespeare_spenser_sidney.json")
    var sonnet_text = ""
        for (i=0; i < numSonnets; i++){
            sonnet_text = data[i]["text"]
            sonnets.push(sonnet_text);
        } 
    update_tree_from_file("data/sonnets/sonnet_tree_counts_shakespeare_spenser_sidney.json")
});

function replot_with_position_data_from_file(filename){
    $.getJSON( filename, function( positionData ) {
        sonnetPositionData = positionData;
        draw_plot(sonnetPositionData); 
    });
}

function draw_plot(sonnetData){
    scatterContainer =  d3.select("#scatter-container")
        .html("");

    var width = parseInt(scatterContainer.style('width'), 10);

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = width - margin.right - margin.left,
        height = width * 0.6; // can change if want to make this square

    // Pan and zoom
    var zoom = d3.zoom()
        .scaleExtent([.5, 16])
        .on("zoom", zoomed);

    var svg = d3.select("#scatter-container")
        .append("svg")
            .attr("viewBox", "0 0 ${width} ${height}")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);

    // x and y axes and scale
    var xScale = d3.scaleLinear()
        .domain(d3.extent(sonnetData, function(d) { return d.x }))
        .range([0, width])
    var xAxis = d3.axisBottom(xScale);
    var yScale = d3.scaleLinear()
        .domain(d3.extent(sonnetData, function(d) {return d.y}))
        .range([0, height])
    var yAxis = d3.axisLeft(yScale);
    var gX = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')')
        .classed("hidden", true)
        .call(xAxis);
    var gY = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .classed("hidden", true)
        .call(yAxis);

    // Add dots
    var points_g = svg.append("g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("clip-path", "url(#clip)")
        .classed("points_g", true);

    points = points_g.selectAll("circle")
        .data(sonnetData)
        .enter()
        .append("circle")
        .attr('cx', function(d) {return xScale(d.x)})
        .attr('cy', function(d) {return yScale(d.y)})
        .attr("r", 4)
        .attr("stroke-width", 0)
        .attr("stroke", "black")
        .attr("class", function(d) { return d.author})
        .style("fill",  d => authorColorScale(d.author))
        .attr("title", function(d) {
            var sonnetNum = convertSonnetIdxToDisplayNumber(d.sonnet_id)
            return d.author + " " + sonnetNum + ": \n" + sonnets[d.sonnet_id]
        })
        .on('click', function(i, d){
            set_sonnet("sonnet_number-2d", "poet", "#sonnet-2d", d.sonnet_id, true, "-radio")
        });

     text_labels = points_g.selectAll("text")  
        .data(sonnetData)
        .join("text")
        .text(function(d) {return convertSonnetIdxToDisplayNumber(d.sonnet_id)})
        .attr("x", function(d) {return xScale(d.x)}) 
        .attr("y", function(d) {return yScale(d.y)})
        .style("font-size", "0.8em")
        .attr("class", function(d) {return d.author}) // Will use this class to show and hide numbers for selected authors appropriately
        .classed('sonnet-number-text',true)
        .classed('hidden',!document.getElementById('showSonnetNumbersCheckbox').checked);
 
    $('.legend').css("color", function() {
        var author = $(this).attr("class").split(/\s+/)[0].substring(7)
        return authorColorScale(author);
    });

    function zoomed({transform}){
        // create new scale ojects based on event
        var new_xScale = transform.rescaleX(xScale);
        var new_yScale = transform.rescaleY(yScale);

        // update axes
        gX.call(xAxis.scale(new_xScale));
        gY.call(yAxis.scale(new_yScale));

        // update point and text positions
        points.data(sonnetData)
            .attr('cx', function(d) {return new_xScale(d.x)})
            .attr('cy', function(d) {return new_yScale(d.y)});
        text_labels.data(sonnetData)
            .attr('x', function(d) {return new_xScale(d.x)})
            .attr('y', function(d) {return new_yScale(d.y)});     
    }
}

/* Make scatterplot respond to changing author checkbox */
d3.selectAll('#choose-authors .authorCheckbox').on('click', function () {
    var author = this.value,
        checked = this.checked;
        d3.selectAll('.points_g' + ' .' + author).classed('hidden', !checked);
        d3.selectAll('text' + '.' + author).classed('hidden', !checked || !document.getElementById('showSonnetNumbersCheckbox').checked)
});

/* Replot scatter in response to changing feature or projection selection*/
$('.projection-radio, .features-radio').on('click', replot);

/* Show/hide sonnet numbers in response to checkbox click*/
$('#showSonnetNumbersCheckbox').on('click', function(){
    d3.selectAll('#scatter-container .sonnet-number-text').classed('hidden', function(){
        var showSonnetNums = document.getElementById('showSonnetNumbersCheckbox').checked;
        var authorCheckboxes = d3.selectAll('#choose-authors .authorCheckbox')._groups[0];
        var authorIsSelected;
        for( i = 0; i< authorCheckboxes.length; i++) {
            var authorIsSelected = authorCheckboxes[i].checked;
            if (this.classList.contains(authorCheckboxes[i].value)) {
                return !(showSonnetNums && authorIsSelected);
            }
        }
    })
});

function replot(){
    /* Set filename for data source based on selected options and re-plot lda/pca scatter */
    var value = document.querySelector('input[name="projection"]:checked').value;
    var featureValue = document.querySelector('input[name="feature"]:checked').value;
    var filename = "data/"+ value + "_" + featureValue + "_sonnets_position_shakespeare_spenser_sidney.json"
    replot_with_position_data_from_file(filename);
 }








// TREE

var margin = {top: 20, right: 20, bottom: 20, left: 12};
var treeContainer =  d3.select("#tree");
var width = Math.max(parseInt(treeContainer.style('width'), 10), parseInt(d3.select('#plot-and-options').style('width'),10)- parseInt(d3.select('#tree-options').style('width'),10));
width = Math.min(width, 1200);
// console.log("width " + width);
var height = width;
var radius = width / 2;
var i = 0;
var root;
var currentZoomTransform;

function radialPoint(x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

var tree =  d3.cluster()
    .size([2 * Math.PI, radius - margin.right - margin.left]);

function update_tree_from_file(filename){
    console.log("updating from file")
    $.getJSON(filename, function( treeData ) {
        // Compute the new tree layout.
        root = tree(d3.hierarchy(treeData));
        //console.log(root)
        update(root);
    });
}

function update(source) {
   console.log("updating")
    d3.selectAll('#choose-authors-tree .authorCheckbox').on('click', update_with_new_options);
    d3.selectAll('#choose-features-tree input').on('click', update_with_new_options);
    d3.select('#showSonnetNumbersCheckboxTree').on('click', function(){
        d3.selectAll('#tree .sonnet-number-text').classed('hidden', !document.getElementById('showSonnetNumbersCheckboxTree').checked);
    });


    function update_with_new_options(){
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
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .call(d3.zoom().on("zoom", function ({transform}) {
        currentZoomTransform = transform;
        svg.attr("transform", currentZoomTransform)
     }))
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

  var totalNumNodes = root.descendants().length;
  console.log(totalNumNodes)

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

function clickCircle(d, i){
    var thisSonnetNumber = Number(i.data.id) + 1;
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








// Set up tree vs. 2d selector

d3.select("#pick-tree").on("click", function(){
    // Adjust displays, visibility
    d3.selectAll(".twod-projection-viz").classed("hidden",true);
    d3.selectAll(".tree-viz").classed("hidden",false);
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
    d3.select("#pick-tree").classed("tab-heading-selected", true);
    update(root);
});

d3.select("#pick-2d-projection").on("click", function(){
    // Adjust displays, visibility
    d3.selectAll(".tree-viz").classed("hidden",true);
    d3.selectAll(".twod-projection-viz").classed("hidden",false);
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
    d3.select("#pick-2d-projection").classed("tab-heading-selected", true)
    replot();
});

d3.selectAll('.ui-tooltip').style('display', 'none');
d3.selectAll(".tree-viz").classed("hidden", true);
d3.selectAll(".twod-projection-viz").classed("hidden",false);
d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
d3.select("#pick-2d-projection").classed("tab-heading-selected", true);
replot(); /* Replot lda/pca scatterplot */