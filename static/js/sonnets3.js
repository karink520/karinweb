var sonnet_idx = document.getElementById("sonnet_number").value - 1;
var sonnet_idx2 = 1;
var sonnet_idx_2d_proj;
var sonnets = [];
var setSonnet1Next = false;
var sonnetPositionData;
var points; //points in 2d visualization
const numSonnets = 351;

// Tooltips throughout
$( document ).tooltip({});

// Color scale for authors
var z = d3.scaleOrdinal()
    .domain(["Shakespeare", "Spenser", "Sidney"])
    .range(d3.schemeSet2)

// Highlighting and displaying sonnets

function set_sonnet_2d() {
    console.log("setting_sonnet")
    var entered_number = document.getElementById("sonnet_number-2d").value;
    var author = document.querySelector('input[name="poet"]:checked').value;

    if (author == "Shakespeare"){ 
        sonnet_idx_2d_proj = entered_number - 1;
    } else if (author == "Spenser") {
        sonnet_idx_2d_proj = Number(entered_number) + 153;
    } else if (author == "Sidney") {
        sonnet_idx_2d_proj = Number(entered_number) + 242;
    }
    
    $("#sonnet-2d").html(sonnets[sonnet_idx_2d_proj]);
    d3.selectAll("circle").style("fill", function(d){ 
        if (d.sonnet_id == sonnet_idx_2d_proj){
            return "red";
        } else {
            return z(d.author);
        }
    })
}

function unset_sonnet(){
    d3.selectAll("circle").style("fill", function(d){ return z(d.author);})
    $("#sonnet-2d").html("")
}

function set_sonnet() {
    console.log("setting sonnet")
    sonnet_idx = document.getElementById("sonnet_number").value - 1;
    $("#sonnet").html(sonnets[sonnet_idx]);
    update(root);
}

function set_sonnet2() {
    console.log("setting sonnet2")
    sonnet_idx2 = document.getElementById("sonnet_number2").value - 1;
    $("#sonnet2").html(sonnets[sonnet_idx2]);
    update(root);
}

$("#display-sonnet-2d").click(set_sonnet_2d);
$("#unhighlight-sonnet").click(unset_sonnet);
$("#display-sonnet").click(set_sonnet);
$("#display-sonnet2").click(set_sonnet2);
// END: highlighting and displaying sonnets

// Get sonnet text from file and initial tree data from file
$.getJSON( "data/sonnets_shakespeare_spenser_sidney.json", function( data ) {
    replot_with_position_data_from_file("data/sonnets_position_shakespeare_spenser_sidney.json")
    var sonnet_text = ""
        for (i=0; i < numSonnets; i++){
            sonnet_text = data[i]["text"]
            sonnets.push(sonnet_text);
        } 
    update_tree_from_file("data/sonnet_tree_shakespeare_spenser_sidney.json")
    update(root); // set tree -- make sure it has text data
});

function replot_with_position_data_from_file(filename){
    $.getJSON( filename, function( positionData ) {
        sonnetPositionData = positionData;
        draw_plot(sonnetPositionData); 
    });
}

function draw_plot(sonnetData){
    scatterContainer =  d3.select("#scatter-container");
    scatterContainer.html("")
    var width = parseInt(scatterContainer.style('width'), 10);
    //var height = parseInt(scatterContainer.style('height'), 10);

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = width - margin.right - margin.left,
        // height = 500 - margin.top - margin.bottom;
        // width = 800,
        height = width / 2;

    // Pan and zoom
    var zoom = d3.zoom()
        .scaleExtent([.5, 16])
        // .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var svg = d3.select("#scatter-container")
        .append("svg")
            // //.attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 ${width} ${height}")
            // .classed("svg-content-responsive", true)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

    // clipping region 
    // svg.append("defs").append("clipPath")
    //     .attr("id", "clip")
    // .append("rect")
    //     .attr("width", width)
    //     .attr("height", height);

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

    points = points_g.selectAll("circle").data(sonnetData);
    points = points.enter().append("circle")
        .attr('cx', function(d) {return xScale(d.x)})
        .attr('cy', function(d) {return yScale(d.y)})
        .attr("r", 4)
        .attr("class", function(d) { return d.author})
        .style("fill",  d => z(d.author))
        .attr("title", function(d) {
            if (d.author == "Spenser"){
                var sonnetNum = d.sonnet_id - 153
            }
            if (d.author == "Sidney"){
                var sonnetNum = d.sonnet_id - (154 + 89 - 1);
            }
            if (d.author == "Shakespeare"){
                var sonnetNum = d.sonnet_id +1 ;
            }
            return d.author + " " + sonnetNum + ": \n" + sonnets[d.sonnet_id]
        })
    
    
    $('.legend').css("color", function() {
        var author = $(this).attr("class").split(/\s+/)[0].substring(7)
        return z(author);
    });


    function zoomed({transform}){
        // create new scale ojects based on event
        var new_xScale = transform.rescaleX(xScale);
        var new_yScale = transform.rescaleY(yScale);
        // update axes
        gX.call(xAxis.scale(new_xScale));
        gY.call(yAxis.scale(new_yScale));
        points.data(sonnetData)
            .attr('cx', function(d) {return new_xScale(d.x)})
            .attr('cy', function(d) {return new_yScale(d.y)});
    }

}

d3.selectAll('#choose-authors .authorCheckbox').on('click', function () {
    var author = this.value,
        checked = this.checked;
        d3.selectAll('.' + author).classed('hidden', !checked);
});

$('.projection-radio').on('click', function() {
    replot();
});

function replot(){
    var value = document.querySelector('input[name="projection"]:checked').value;
    if (value == "pca"){
        replot_with_position_data_from_file("data/pca_sonnets_position_shakespeare_spenser_sidney.json")
    } else if (value == "lda"){
        replot_with_position_data_from_file("data/lda_sonnets_position_shakespeare_spenser_sidney.json")
    }
}








// TREE

var margin = {top: 20, right: 20, bottom: 20, left: 20};
var treeContainer =  d3.select("#tree");
var width = parseInt(treeContainer.style('width'), 10);
var height = width;
//var width = 1200 - margin.right - margin.left;
//var height = 1200 - margin.top - margin.bottom;
var radius = width / 2;
var i = 0,
    duration = 750,
    root;

var tree =  d3.cluster()
    .size([2 * Math.PI, radius - 100])

var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", "0 0 ${width} ${height}")
    .append("g")
        .attr("transform", "translate(" + radius + "," + radius+ ")");

function update_tree_from_file(filename){
    d3.select('#tree').html('');
    svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + radius + "," + radius+ ")");

    $.getJSON(filename, function( treeData ) {
        // Compute the new tree layout.
        root = tree(d3.hierarchy(treeData));
        console.log(root)
        update(root);
    });
}

function update(source) {
    d3.selectAll('#choose-authors-tree .authorCheckbox').on('click', function(){
        var authors = document.querySelectorAll('#choose-authors-tree input:checked');

        console.log(authors[0]);

        if (authors.length == 3){
            update_tree_from_file("data/sonnet_tree_shakespeare_spenser_sidney.json");
        }
        else if (authors.length==2){
            if ([authors[0].value == "Shakespeare"] && [authors[1].value == "Spenser"]) {
                update_tree_from_file("data/sonnet_tree_shakespeare_and_spenser.json")
            }
        } else if (authors.length == 1 && authors[0].value=="Shakespeare"){
            update_tree_from_file("data/sonnet_tree.json")
        }
    });

    console.log("updating tree diagram");

    var sonnetLeaf, sonnetLeaf2;
    for (i=0;i < source.leaves().length; i++){
        if (source.leaves()[i].data.id == sonnet_idx + 1){
            sonnetLeaf = source.leaves()[i];
        }
        if (source.leaves()[i].data.id == sonnet_idx2 + 1){
            sonnetLeaf2 = source.leaves()[i];
        }
    }

   var sonnetToSonnetPath = sonnetLeaf.path(sonnetLeaf2);
   //console.log(sonnetToSonnetPath);
   for (i=0; i < sonnetToSonnetPath.length - 1; i++){
        sourceNode = sonnetToSonnetPath[i];
        targetNode = sonnetToSonnetPath[i+1];
   }

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(source.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y))
          .attr("stroke", function(d){
            for (i=1; i < sonnetToSonnetPath.length ; i++){
                sourceNode = sonnetToSonnetPath[i];
                targetNode = sonnetToSonnetPath[i-1];
                if(d.source === sourceNode && d.target === targetNode || d.source === targetNode && d.target === sourceNode){
                    return "#111";
                }
            } 
            return "#bbb";
       });

    svg.append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .attr("fill", d => d.children ? "#555" : "#999")
      .style("fill", function(d) { 
        //add author data
        if (d.data.id == ""){
            d.data.author = "None"
            return "gray";
        }
        d.data.id = Number(d.data.id);
        if (d.data.id <= 154 && d.data.id >= 0) {
            d.data.author = "Shakespeare";
        } else if (d.data.id <= 243) {
            d.data.author = "Spenser";
        } else {
            d.data.author = "Sidney";
        };
        //set color
        if ( d.data.id== sonnet_idx + 1 || d.data.id == sonnet_idx2 + 1) {
            return d.children ? "red" : "red";
        } else {
            return z(d.data.author);
        };
    })   
        .attr("r", function(d){
            if (d.data.author != "None"){
                return 3
            } else { return 1}
        })
        .attr("title", function(d) {
            if (d.data.author=="None"){
                return;
            }
            if (d.data.author == "Spenser"){
                var sonnetNum = d.data.id - 154
            }
            if (d.data.author == "Sidney"){
                var sonnetNum = d.data.id - (154 + 89);
            }
            if (d.data.author == "Shakespeare"){
                var sonnetNum = Number(d.data.id);
            }
            return d.data.author + " " + sonnetNum + ": \n" + sonnets[d.data.id]
        })
    ;


  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
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
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      //.text("")
      //.text(d => d.data.id)
    .clone(true).lower()
      .attr("stroke", "white");

    d3.selectAll('circle').on('click', clickCircle);
}

function clickCircle(d, i){
    var thisSonnetNumber = i.data.id;
    // console.log(thisSonnetNumber);
    if (thisSonnetNumber == "Your sonnet!") {    
    }
    else if (setSonnet1Next) {
        document.getElementById("sonnet_number").value = thisSonnetNumber;
        set_sonnet();
    } else {
        document.getElementById("sonnet_number2").value = thisSonnetNumber
        set_sonnet2();
    }
    
    setSonnet1Next = !setSonnet1Next;
    update(root);
}









// Set up tree vs. 2d selector

d3.select("#pick-tree").on("click", function(){
    // Adjust displays, visibility, and opacity
    d3.selectAll(".twod-projection-viz").classed("hidden",true);
    d3.selectAll(".tree-viz").classed("hidden",false);
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
    //d3.selectAll('.tooltip').style("opacity", 0); 
    d3.select("#pick-tree").classed("tab-heading-selected", true)

});

d3.select("#pick-2d-projection").on("click", function(){
    // Adjust displays, visibility, and opacity
    d3.selectAll(".tree-viz").classed("hidden",true);
    d3.selectAll(".twod-projection-viz").classed("hidden",false);
    d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
    //d3.selectAll('.tooltip').style("opacity", 0); 
    d3.select("#pick-2d-projection").classed("tab-heading-selected", true)
    replot();
});

d3.selectAll(".tree-viz").classed("hidden", true);
d3.selectAll(".twod-projection-viz").classed("hidden",false);
d3.selectAll(".tab-heading").classed("tab-heading-selected", false);
d3.select("#pick-2d-projection").classed("tab-heading-selected", true);
replot();