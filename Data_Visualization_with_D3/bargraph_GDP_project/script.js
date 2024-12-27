const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const dataset = data.data;
    createChart(dataset);
  })
  .catch((error) => console.error("Error fetching data:", error));

function createChart(dataset) {
  const w = 900;
  const h = 300;
  const padding = 50;
  
  const svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
  
  // Scales
  const xScale = d3
    .scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  // Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

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
  
  const tooltip = d3.select("#tooltip");
  
  // Bars
  svg
    .selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", (w - 2 * padding) / dataset.length)
    .attr("height", (d) => h - padding - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 0.9)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px")
        .attr("data-date", d[0])
        .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
}
