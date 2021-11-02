function plotVoltageTrace(dataset) {
    var widthOfContainer = document.getElementById('plotpane').offsetWidth;
    console.log(widthOfContainer);
// 2. Use the margin convention practice
  var margin = {top: 20, right: 30, bottom: 30, left: 50}
    , width = widthOfContainer - margin.left - margin.right// Use the window's width
    , height = 150; // Use the window's height

  // The number of datapoints
  //var n = 21;
  var n = dataset.length;

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
      .domain([0, n/20]) // input
      //.domain([0, 0.5]);
      .range([0, width]); // output

  // 6. Y scale will use the randomly generate number
  var yMax = 0.050; //max to display in volts
  var yScale = d3.scaleLinear()
      .domain([-0.080, 0.050]) // input
      .range([height, 0]); // output

  // 7. d3's line generator
  var line = d3.line()
      .x(function(d, i) { return xScale(i/20); }) // set the x values for the line generator
      .y(function(d) { return yScale( Math.min(d.y, yMax)) }) // set the y values for the line generator
      .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 1. Add the SVG to the page and employ #2
  d3.select("svg").remove();
  var svg = d3.select("#plotpane")
    .append("svg")
        // Class to make it responsive.
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // 9. Append the path, bind the data, and call the line generator
  svg.append("path")
      .datum(dataset) // 10. Binds data to the line
      .attr("class", "line") // Assign a class for styling
      .attr("d", line); // 11. Calls the line generator

   svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("font-size","12px")
      .attr("x", width / 2)
      .attr("y", height + 30)
      .text("time (ms)");

  svg.append("text")
      .attr("class", "y label")
      .attr("font-size","12px")
      .attr("text-anchor", "end")
      .attr("y", -35)
      .attr("x", 2)
      //.attr("dy", ".1em")
      .attr("transform", "rotate(-90)")
      .text("potential (V)");
}
