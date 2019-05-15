// // @TODO: YOUR CODE HERE!

// // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);
// // When the browser loads, makeResponsive() is called.
// makeResponsive();
// // The code for the chart is wrapped inside a function that
// // automatically resizes the chart
// function makeResponsive() {

//     }

// Store width and height parameters to be used in later in the canvas
var svgWidth = 960;
var svgHeight = 500;

// Set svg margins 
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
// Create the width and height based svg margins and parameters to fit chart group within the canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the canvas to append the SVG group that contains the states data
// Give the canvas width and height calling the variables predifined.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create the chartGroup that will contain the data
// Use transform attribute to fit it within the canvas
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "poverty";
var chosenXAxis = "healthcare";

// Import Data
// var file = "assets/data/data.csv"
d3.csv("assets/data/data.csv")
  .then(function (statesData) {

    // Function is called and passes csv data
    successHandle(statesData);
  });

// Function takes in argument statesData
function successHandle(statesData) {

      // Loop through the data and pass argument data
      statesData.map(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

      //  Create scale functions
      // Linear Scale takes the min to be displayed in axis, and the max of the data
      var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(statesData, d => d.healthcare)])
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(statesData, d => d.poverty)])
        .range([height, 0]);

      // Create axis functions by calling the scale functions
      var bottomAxis = d3.axisBottom(xLinearScale)
      // Adjust the number of ticks for the bottom axis  
      var leftAxis = d3.axisLeft(yLinearScale);


      // Append the axes to the chart group 
      // Bottom axis moves using height 
      chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      // Only append the left axis 
      chartGroup.append("g")
        .call(leftAxis);


      // Create Circles for scatter plot
      var circlesGroup = chartGroup.selectAll("circle")
        .data(statesData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "red")
        .attr("opacity", ".6")


      // Append text to circles 
      var circlesGroup = chartGroup.selectAll()
        .data(statesData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "13px")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(d => (d.abbr));

      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
          return (`<br>Healthcare % ${d.healthcare} <br>Poverty%: ${d.poverty} `);
        });

      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function (data, index) {
          toolTip.hide(data);
        });

      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Healthcare %");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty %");



    }

