// USGS Magnitude 1.0+ Earthquakes, Past Week

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data);

    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    
  });
  
  function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");

  }

  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
  });
 
  createMap(earthquakes);

}

function createMap(earthquakes) {

    var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: "pk.eyJ1IjoiYWx4cHJ5IiwiYSI6ImNrYW9saHZjNDA0Z3ozMG82cHZpcm0xbm8ifQ.yM3ZhZhGelQpcJBz0wtaiw"
    });

    var baseMaps = {
        "Street Map": streetmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center:[
            40.09, -95.71
          ],
          zoom: 5,
          layers: [streetmap, earthquakes]
        });
      
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);
    }
        