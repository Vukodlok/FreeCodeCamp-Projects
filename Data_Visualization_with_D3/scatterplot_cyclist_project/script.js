const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    createChart(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

function createChart(dataset) {
  const w = 900;
  const h = 500;
  const padding = 60;

  // Parse time for Y-axis
  const parseTime = (time) => {
    const [minutes, seconds] = time.split(":").map(Number);
    return new Date(1970, 0, 1, 0, minutes, seconds); // Use a reference date
  };

  // Scales
  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(d.Year, 0, 1)),
      d3.max(dataset, (d) => new Date(d.Year, 0, 1)),
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => parseTime(d.Time)),
      d3.max(dataset, (d) => parseTime(d.Time)),
    ])
    .range([h - padding, padding]);

  // SVG
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  // Legend
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${w - padding * 1.8}, ${h - padding * 1.6})`);
  
  // Add a border around the legend text
legend
  .append("rect")
  .attr("x", -5) // Adjust as needed to fit the text
  .attr("y", -15) // Adjust to move the rectangle to the top
  .attr("width", 110) // Adjust the width of the border
  .attr("height", 50) // Adjust the height of the border
  .attr("fill", "none") // No fill for the rectangle
  .attr("stroke", "black") // Border color
  .attr("stroke-width", 2); // Border thickness

  // Legend Item 1: Doping Allegations
  legend
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .style("fill", "red");

  legend
    .append("text")
    .attr("x", 10)
    .attr("y", 4)
    .text("Doping Allegations")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  // Legend Item 2: No Allegations
  legend
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 20)
    .attr("r", 5)
    .style("fill", "green");

  legend
    .append("text")
    .attr("x", 10)
    .attr("y", 24)
    .text("No Allegations")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");


  // Tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "lightgrey")
    .style("padding", "5px")
    .style("border", "1px solid black")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Dots
  svg
    .selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(new Date(d.Year, 0, 1)))
    .attr("cy", (d) => yScale(parseTime(d.Time)))
    .attr("r", 5)
    .attr("data-xvalue", (d) => new Date(d.Year, 0, 1).toISOString())
    .attr("data-yvalue", (d) => parseTime(d.Time).toISOString())
    .style("fill", (d) => (d.Doping ? "red" : "green"))
    .on("mouseover", (event, d) => {
  tooltip
    .style("opacity", 0.9)
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY - 28 + "px")
    .attr("data-year", new Date(d.Year, 0, 1).toISOString())
    .html(
        `Year: ${d.Year}<br>Time: ${d.Time}${
          d.Doping ? `<br>${d.Doping}` : ""
        }`
      );
  })
    .on("mouseout", () => {
  tooltip
    .style("opacity", 0)
    .attr("data-year", null); // Clear data-year on mouseout
  });
}
