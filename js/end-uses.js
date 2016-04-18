var data = [
        { 'label': 'Heating', 'color':'#EF1C21', 'value': 3071.84 },
        { 'label': 'Cooling', 'color':'#0071BD', 'value': 2125.94 },
        { 'label': 'Interior Lights', 'color':'#F7DF10', 'value': 5636.33 },
        { 'label': 'Exterior Lights', 'color':'#DEC310', 'value': 805.25 },
        { 'label': 'Interior Equipment', 'color':'#4A4D4A', 'value': 8393.98 },
        { 'label': 'Exterior Equipment', 'color':'#B5B2B5', 'value': 1895.08 },
        { 'label': 'Fans', 'color':'#FF79AD', 'value': 570.51 },
        { 'label': 'Pumps', 'color':'#632C94', 'value': 1086.36 },
        { 'label': 'Heat Rejection', 'color':'#F75921', 'value': 589.43 },
        { 'label': 'Humidifier', 'color':'#293094', 'value': 0 },
        { 'label': 'Heat Recovery', 'color':'#CE5921', 'value': 0 },
        { 'label': 'Water Systems', 'color':'#FFB239', 'value': 223.99 },
        { 'label': 'Refrigeration', 'color':'#29AAE7', 'value': 0 },
        { 'label': 'Generators', 'color':'#8CC739', 'value': 0 },
        ];

// Filter out the zeros, don't want to plot them        
data = data.filter(function(n){ 
  if (n.value != 0)
    return n
  }); 

// Calculate total  
totalGJ = data.reduce(function (sum, enduse) {
  return sum + enduse.value;
}, 0);

var svg = dimple.newSvg("#chartContainer-end-uses", 800, 500);

var myChart = new dimple.chart(svg, data);
myChart.setBounds(60, 30, 600, 330)
var x = myChart.addCategoryAxis("x", "label");
x.title = 'End Uses'

y = myChart.addMeasureAxis("y", "value");
y.title = 'Total Energy Consumption for all fuels [GJ]'

// Gridlines are useless
y.showGridlines = false;

x.fontSize = "12px";
y.fontSize = "12px";

mySeries = myChart.addSeries('label', dimple.plot.bar);

data.forEach( function(s) { 
 // ... do something with s ...
  myChart.assignColor(s['label'], s['color'], 'white', 1);
} );

//myChart.assignColor('Heating', '#EF1C21', 'white', 1);

var myLegend = myChart.addLegend(530, 100, 130, 400, "Right");
myChart.draw(800);

//
// Using the afterDraw callback means this code still works with animated
// draws (e.g. myChart.draw(1000)) or storyboards (though an onTick callback should
// also be used to clear the text from the previous frame)
mySeries.afterDraw = function (shape, data) {
  // Get the shape as a d3 selection
  var s = d3.select(shape),
    rect = {
      x: parseFloat(s.attr("x")),
      y: parseFloat(s.attr("y")),
      width: parseFloat(s.attr("width")),
      height: parseFloat(s.attr("height"))
    };
  // Only label bars where the text can fit
  if (rect.height >= 8) {
    // Add a text label for the value
    svg.append("text")
      // Position in the centre of the shape (vertical position is
      // manually set due to cross-browser problems with baseline)
      .attr("x", rect.x + rect.width / 2)
      .attr("y", rect.y + 13.5)
      // Centre align
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      // Make it a little transparent to tone down the black
      .style("opacity", 1)
      .style("fill", "white")
      // Format the number
      .text(d3.format(",.1f")(100*data.yValue / totalGJ) + "% ");
  }
};

// Rotate x-axis labels
x.shapes.selectAll("text").attr("transform",
function (d) {
  return d3.select(this).attr("transform") + " translate(0, 20) rotate(-45)";
});


/*
// Make legend clickable / interactive
// This is a critical step.  By doing this we orphan the legend. This
// means it will not respond to graph updates.  Without this the legend
// will redraw when the chart refreshes removing the unchecked item and
// also dropping the events we define below.
myChart.legends = [];

// This block simply adds the legend title. I put it into a d3 data
// object to split it onto 2 lines.  This technique works with any
// number of lines, it isn't dimple specific.
svg.selectAll("title_text")
  .data(["Click legend to","show/hide end uses:"])
  .enter()
  .append("text")
    .attr("x", 499)
    .attr("y", function (d, i) { return 90 + i * 14; })
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .style("color", "Black")
    .text(function (d) { return d; });


// Get a unique list of Owner values to use when filtering
var filterValues = dimple.getUniqueValues(data, "label");
// Get all the rectangles from our now orphaned legend
myLegend.shapes.selectAll("rect")
  // Add a click event to each rectangle
  .on("click", function (e) {
    // This indicates whether the item is already visible or not
    var hide = false;
    var newFilters = [];
    // If the filters contain the clicked shape hide it
    filterValues.forEach(function (f) {
      if (f === e.aggField.slice(-1)[0]) {
        hide = true;
      } else {
        newFilters.push(f);
      }
    });
    // Hide the shape or show it
    if (hide) {
      d3.select(this).style("opacity", 0.2);
    } else {
      newFilters.push(e.aggField.slice(-1)[0]);
      d3.select(this).style("opacity", 0.8);
    }
    // Update the filters
    filterValues = newFilters;
    // Filter the data
    myChart.data = dimple.filterData(data, "label", filterValues);
    // Passing a duration parameter makes the chart animate. Without
    // it there is no transition
    myChart.draw(800);
  });*/