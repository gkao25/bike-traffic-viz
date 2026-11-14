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
});
