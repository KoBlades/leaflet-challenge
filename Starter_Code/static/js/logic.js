var map = L.map('map').setView([37.7749, -122.4194], 5); // Initial map view centered on US

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL of the GeoJSON dataset (replace with your selected dataset URL or local path)
var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

function getColor(depth) {
    // Return color based on depth (green for shallow, red for deep)
    if (depth < 10) return "#66FF66";  // Shallow (green)
    else if (depth < 50) return "#99FF33"; // Light green
    else if (depth < 100) return "#FFCC00"; // Yellow
    else if (depth < 300) return "#FF6600"; // Orange
    else return "#FF0000"; // Deep (red)
  }
  
  function getRadius(magnitude) {
    // Return radius based on magnitude (larger magnitude -> larger marker)
    return magnitude * 4;  // Adjust this multiplier as needed
  }
  
  fetch(earthquakeDataUrl)
    .then(response => response.json())
    .then(data => {
      // Add GeoJSON data to the map
      L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.place) {
            layer.bindPopup('<strong>' + feature.properties.place + '</strong><br>' +
              'Magnitude: ' + feature.properties.mag + '<br>' +
              'Depth: ' + feature.geometry.coordinates[2] + ' km');
          }
        },
        pointToLayer: function (feature, latlng) {
          // Get magnitude and depth
          var magnitude = feature.properties.mag;
          var depth = feature.geometry.coordinates[2];
          
          // Create a circle marker with size based on magnitude and color based on depth
          return L.circleMarker(latlng, {
            radius: getRadius(magnitude),
            fillColor: getColor(depth),
            color: "#000", // Border color
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
          });
        }
      }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON data:', error));
  
  // Add a legend for the depth
  var legend = L.control({ position: 'bottomright' });
  
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var depths = [0, 10, 50, 100, 300];
    var labels = ['< 10 km', '10-50 km', '50-100 km', '100-300 km', '> 300 km'];
    var colors = ["#66FF66", "#99FF33", "#FFCC00", "#FF6600", "#FF0000"];
  
    // Generate labels with colored squares
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i>' +
        labels[i] + '<br>';
    }
  
    return div;
  };
  
  legend.addTo(map);
