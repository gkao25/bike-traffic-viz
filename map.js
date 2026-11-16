// import D3
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Import Mapbox as an ESM module
import mapboxgl from "https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm";

// Check that Mapbox GL JS is loaded
console.log("Mapbox GL JS Loaded:", mapboxgl);

// Set your Mapbox access token here
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2thbyIsImEiOiJjbHcwNjNod3cwcWJ0MmlwNzI1amgyZ284In0.pH0JYKOqLMoCYrLxl6lMDg";

// Initialize the map
const map = new mapboxgl.Map({
  container: "map", // ID of the div where the map will render
  style: "mapbox://styles/mapbox/streets-v12", // Map style
  center: [-71.09415, 42.36027], // [longitude, latitude]
  zoom: 12, // Initial zoom level
  minZoom: 5, // Minimum allowed zoom
  maxZoom: 18, // Maximum allowed zoom
});

// import bike lane data
map.on("load", async () => {
  const lineStyle = {
    "line-color": "#32D400", // A bright green using hex code
    "line-width": 5, // Thicker lines
    "line-opacity": 0.6, // Slightly less transparent
  };

  // adding the data source
  map.addSource("boston_route", {
    type: "geojson",
    data: "data/Existing_Bike_Network_2022.geojson",
  });

  map.addSource("cambridge_route", {
    type: "geojson",
    data: "data/RECREATION_BikeFacilities.geojson",
  });

  // visualizing data
  map.addLayer({
    id: "bike-lanes-boston",
    type: "line",
    source: "boston_route",
    paint: lineStyle,
  });

  map.addLayer({
    id: "bike-lanes-cambridge",
    type: "line",
    source: "cambridge_route",
    paint: lineStyle,
  });

  // fetching station data
  let jsonData;
  try {
    const jsonurl = "data/bluebikes-stations.json";
    jsonData = await d3.json(jsonurl);
    console.log("Loaded JSON Data:", jsonData); // Log to verify structure
  } catch (error) {
    console.error("Error loading JSON:", error); // Handle errors
  }
  let stations = jsonData.data.stations;
  console.log("Stations Array:", stations);

  // adding station markers
  const svg = d3.select("#map").select("svg");

  // Append circles to the SVG for each station
  const circles = svg
    .selectAll("circle")
    .data(stations)
    .enter()
    .append("circle")
    .attr("r", 5) // Radius of the circle
    .attr("fill", "steelblue") // Circle fill color
    .attr("stroke", "white") // Circle border color
    .attr("stroke-width", 1) // Circle border thickness
    .attr("opacity", 0.8); // Circle opacity

  // Function to update circle positions when the map moves/zooms
  function updatePositions() {
    circles
      .attr("cx", (d) => getCoords(d).cx) // Set the x-position using projected coordinates
      .attr("cy", (d) => getCoords(d).cy); // Set the y-position using projected coordinates
  }

  // Initial position update when map loads
  updatePositions();

  // Reposition markers on map interactions
  map.on("move", updatePositions); // Update during map movement
  map.on("zoom", updatePositions); // Update during zooming
  map.on("resize", updatePositions); // Update on window resize
  map.on("moveend", updatePositions); // Final adjustment after movement ends
});

function getCoords(station) {
  const point = new mapboxgl.LngLat(+station.lon, +station.lat); // Convert lon/lat to Mapbox LngLat
  const { x, y } = map.project(point); // Project to pixel coordinates
  return { cx: x, cy: y }; // Return as object for use in SVG attributes
}
