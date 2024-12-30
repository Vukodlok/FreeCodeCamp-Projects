const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    createHeatmap(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

function createHeatmap(dataset) {
  const w = 900;
  const h = 600;
  const padding = 60;

  // Scales
  const xScale = d3.scaleBand()
    .domain(dataset.monthlyVariance.map(d => d.year))
    .range([padding, w - padding])
    .padding(0.02);

  const yScale = d3.scaleBand()
  .domain(d3.range(1, 13))
  .range([padding, h - padding - 60])
  .padding(0);

  // Define a set of distinct colors for the heatmap cells and the legend
  const colors = [
  "#003f5c", "#2f6699", "#66a0cc", "#f4d03f", 
  "#f39c12", "#e74c3c", "#c0392b"
  ];

  // Create a scale to map variance to these distinct colors
  const colorScale = d3.scaleQuantize()
    .domain(d3.extent(dataset.monthlyVariance, d => d.variance))
    .range(colors);

  // SVG
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Axes
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter((d, i) => i % 10 === 0))
    .tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(month => {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return months[month - 1];
    });

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding - 60})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

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

  // Heat Map Cells
  svg.selectAll(".cell")
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", d => d.year)
    .attr("data-month", d => d.month - 1)
    .attr("data-temp", d => dataset.baseTemperature + d.variance)
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", d => colorScale(d.variance))
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 0.9)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px")
        .attr("data-year", d.year)
        .html(`
          Year: ${d.year}<br>
          Month: ${d3.timeFormat("%B")(new Date(0, d.month - 1))}<br>
          Temp: ${(dataset.baseTemperature + d.variance).toFixed(2)}°C
        `);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  // Legend
  const legendWidth = 400;
  const legendHeight = 30;
  const legendPadding = 20;

  const legendX = d3.scaleLinear()
    .domain(d3.extent(dataset.monthlyVariance, d => d.variance))
    .range([0, legendWidth]);
  
  const legend = svg.append("g")
  .attr("id", "legend")
  .attr("transform", `translate(${(w - legendWidth) / 2}, ${h - padding + 10})`);

  legend.selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (legendWidth / colors.length))
    .attr("width", legendWidth / colors.length)
    .attr("height", legendHeight)
    .style("fill", d => d);

  const legendAxis = d3.axisBottom(legendX)
    .tickFormat(d3.format(".1f"))
    .ticks(6);

  legend.append("g")
  .attr("transform", `translate(0, ${legendHeight})`)
  .call(legendAxis);
}
