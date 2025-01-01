const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

// Fetch both datasets simultaneously
Promise.all([
  fetch(countyURL).then((response) => response.json()),
  fetch(educationURL).then((response) => response.json())
])
  .then(([countyData, educationData]) => {
    createChoropleth(countyData, educationData);
  })
  .catch((error) => {
    console.error("Error fetching data:", error.message);
    console.error("Stack trace:", error.stack);
  });

function createChoropleth(countyData, educationData) {
  const w = 900;
  const h = 600;
  const padding = 60;

  // Create SVG
  const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Convert TopoJSON to GeoJSON
  const geojsonCounties = topojson.feature(countyData, countyData.objects.counties);
  console.log("GeoJSON Counties:", geojsonCounties);
  console.log("First County:", geojsonCounties.features[0]);
  console.log("First County Coordinates:", geojsonCounties.features[0].geometry.coordinates);

  // Projection and Path Generator
  const projection = d3.geoIdentity()
  .fitSize([w - padding * 2, h - padding * 2], geojsonCounties);

  const path = d3.geoPath().projection(projection);

  // Test projection with the first county
  const firstCounty = geojsonCounties.features[0];
  console.log("Testing Projection:", projection(firstCounty.geometry.coordinates[0][0]));

  // Extract education values for color scaling
  const educationValues = educationData.map(d => d.bachelorsOrHigher);

  // Define distinct colors for buckets
  const colorScale = d3.scaleQuantize()
    .domain([d3.min(educationValues), d3.max(educationValues)])
    .range([
      "#cce5ff", 
      "#99c2ff",
      "#6699ff",
      "#3366ff",
      "#5a3f99", 
      "#7a2cbf", 
    ]);

  // Tooltip for hover info
  const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "lightgrey")
    .style("padding", "5px")
    .style("border", "1px solid black")
    .style("pointer-events", "none")
    .style("opacity", 0);

  // Draw counties
  svg.selectAll(".county")
    .data(geojsonCounties.features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", path)
    .attr("data-fips", d => d.id)
    .attr("data-education", d => {
      const county = educationData.find(ed => ed.fips === d.id);
      return county ? county.bachelorsOrHigher : 0;
    })
    .attr("fill", d => {
      const county = educationData.find(ed => ed.fips === d.id);
      return county ? colorScale(county.bachelorsOrHigher) : "#ccc";
    })
    .on("mouseover", (event, d) => {
      const county = educationData.find(ed => ed.fips === d.id);
      tooltip
        .style("opacity", 0.9)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px")
        .attr("data-education", county ? county.bachelorsOrHigher : 0)
        .html(`
          County: ${county ? county.area_name : "N/A"}<br>
          State: ${county ? county.state : "N/A"}<br>
          Education: ${county ? county.bachelorsOrHigher + "%" : "N/A"}
        `);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
  
  // Legend
  const legendWidth = 300;
  const legendHeight = 20;
  const legendPadding = 10;

  const legend = svg.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${w / 2 - legendWidth / 2}, ${h - padding - 40})`);

  // Define legend scale
  const legendScale = d3.scaleLinear()
    .domain(d3.extent(educationData, d => d.bachelorsOrHigher))
    .range([0, legendWidth]);

  // Generate more ticks based on the domain
  const ticks = d3.ticks(d3.min(educationData, d => d.bachelorsOrHigher), d3.max(educationData, d => d.bachelorsOrHigher), 5);
  
  // Create legend axis
  const legendAxis = d3.axisBottom(legendScale)
    .tickSize(10)
    .tickValues(ticks)
    .tickFormat(d => `${Math.round(d)}%`);

  // Draw legend color boxes
  legend.selectAll("rect")
    .data(colorScale.range())
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (legendWidth / colorScale.range().length))
    .attr("y", 0)
    .attr("width", legendWidth / colorScale.range().length)
    .attr("height", legendHeight)
    .style("fill", d => d)
    .style("stroke", "black");

  // Add legend axis
  legend.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(legendAxis)
    .select(".domain").remove();
}
