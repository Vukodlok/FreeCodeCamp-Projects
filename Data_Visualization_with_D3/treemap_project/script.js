const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    createTreemap(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

function createTreemap(data) {
  const w = 960;
  const h = 600;

  const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Create a root hierarchy
  const root = d3.hierarchy(data)
    .sum((d) => d.value) // Size of each tile based on value
    .sort((a, b) => b.value - a.value);

  // Create treemap layout
  d3.treemap()
    .size([w, h])
    .paddingInner(1)(root);

  // Define a color scale
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Add tiles
  const tile = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  tile.append("rect")
    .attr("class", "tile")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .style("fill", (d) => colorScale(d.data.category))
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 0.9)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px")
        .attr("data-value", d.data.value)
        .html(`
          Name: ${d.data.name}<br>
          Category: ${d.data.category}<br>
          Value: ${d.data.value}
        `);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  // Add text labels
  tile.append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][a-z])/g)) // Split long names
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => 13 + i * 10)
    .text((d) => d)
    .style("font-size", "10px")
    .style("fill", "white");

  // Legend
  const categories = root.leaves()
    .map(d => d.data.category)
    .filter((v, i, a) => a.indexOf(v) === i);

  const legendWidth = 800;
  const legendHeight = 100;
  const itemsPerRow = Math.ceil(categories.length / 2); // Split into two rows

  const legend = d3.select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("width", legendWidth)
    .attr("height", legendHeight);

  const legendItems = legend.selectAll(".legend-item")
    .data(categories)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      return `translate(${col * 100}, ${row * 30})`;
    });

  legendItems.append("rect")
    .attr("class", "legend-item")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", (d) => colorScale(d));

  legendItems.append("text")
    .attr("x", 30)
    .attr("y", 15)
    .text((d) => d)
    .style("font-size", "12px")
    .style("alignment-baseline", "middle");
}
