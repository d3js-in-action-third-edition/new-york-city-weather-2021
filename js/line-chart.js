// Load the data
d3.csv("./data/weekly_temperature.csv", d3.autoType).then(data => {
  console.log("data temperature", data);
  drawLineChart(data);
});

// Create the line chart here
const drawLineChart = (data) => {

  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 170, bottom: 25, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const aubergine = "#75485E";

  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  /****************************/
  /*    Declare the scales    */
  /****************************/
  // X scale
  const firstDate = d3.min(data, d => d.date);
  const lastDate = d3.max(data, d => d.date);
  const xScale = d3.scaleTime()
    .domain([d3.timeMonth.floor(firstDate), lastDate])
    .range([0, innerWidth]);

  // Y scale
  const minTemp = d3.min(data, d => d.min_temp_F);
  const maxTemp = d3.max(data, d => d.max_temp_F);
  console.log(minTemp, maxTemp);
  const yScale = d3.scaleLinear()
    .domain([0, maxTemp])
    .range([innerHeight, 0]);

  
  /***************************/
  /*     Append the axes     */
  /***************************/
  // Bottom axis
  const bottomAxis = d3.axisBottom(xScale)
    // .tickValues([2021-01-01, 2021-01-02, 2021-01-03, 2021-01-04, 2021-01-05])
    .tickFormat(d3.timeFormat("%b %d"));
  innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);
  d3.selectAll(".axis-x text")
    .attr("y", "10px");

  // Left axis
  const leftAxis = d3.axisLeft(yScale);
  innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(leftAxis);
  d3.selectAll(".axis-y text")
    .attr("dx", "-5px");

  
  /************************************************/
  /*   Area chart of the temperature variability  */
  /************************************************/
  // Initialize the area generator
  const areaGenerator = d3.area()
    .x(d => xScale(d.date))
    .y0(d => yScale(d.min_temp_F))
    .y1(d => yScale(d.max_temp_F))
    .curve(d3.curveCatmullRom);

  // Draw the area
  innerChart
    .append("path")
      .attr("d", areaGenerator(data))
      .attr("fill", aubergine)
      .attr("fill-opacity", 0.2);

  
  /*********************************************/
  /*   Line chart of the average temperature   */
  /*********************************************/
  // Draw the data points
  innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.avg_temp_F))
      .attr("fill", aubergine);
    
  // Initialize the line/curve generator
  const curveGenerator = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.avg_temp_F))
    .curve(d3.curveCatmullRom);
    
  // Draw the line/curve
  innerChart
    .append("path")
      .attr("d", curveGenerator(data))
      .attr("fill", "none")
      .attr("stroke", aubergine);

  
  /************************/
  /*      Add labels      */
  /************************/

  // Label for y-axis (Temperature (F))
  svg
    .append("text")
      .attr("class", "chart-label")
      .text("Temperature (°F)")
      .attr("y", 20);

  // Label for line chart
  innerChart
    .append("text")
      .attr("class", "chart-label")
      .text("Average temperature")
      .attr("x", xScale(lastDate) + 10)
      .attr("y", yScale(data[data.length - 1].avg_temp_F))
      .attr("fill", aubergine)
      .attr("alignment-baseline", "middle");

  // Annotation for max temperature
  innerChart
    .append("text")
      .attr("class", "chart-label")
      .text("Maximum temperature")
      .attr("x", xScale(data[data.length - 4].date) + 13)
      .attr("y", yScale(data[data.length - 4].max_temp_F) - 20)
      .attr("fill", aubergine);
  innerChart
    .append("line")
      .attr("x1", xScale(data[data.length - 4].date))
      .attr("y1", yScale(data[data.length - 4].max_temp_F) - 3)
      .attr("x2", xScale(data[data.length - 4].date) + 10)
      .attr("y2", yScale(data[data.length - 4].max_temp_F) - 20)
      .attr("stroke", aubergine)
      .attr("stroke-width", 2);

  // Annotation for min temperature
  innerChart
    .append("text")
      .attr("class", "chart-label")
      .text("Minimum temperature")
      .attr("x", xScale(data[data.length - 3].date) + 13)
      .attr("y", yScale(data[data.length - 3].min_temp_F) + 20)
      .attr("fill", aubergine)
      .attr("alignment-baseline", "hanging");
  innerChart
    .append("line")
      .attr("x1", xScale(data[data.length - 3].date))
      .attr("y1", yScale(data[data.length - 3].min_temp_F) + 3)
      .attr("x2", xScale(data[data.length - 3].date) + 10)
      .attr("y2", yScale(data[data.length - 3].min_temp_F) + 20)
      .attr("stroke", aubergine)
      .attr("stroke-width", 2);

};