// USGS Magnitude Earthquakes, Past Week

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Function to set marker sizes relative to magnitude

function markerSize(magnitude) {
    if (magnitude < 1) {
        return 3;
    }
    else if (magnitude < 2) {
       return 13;
    }
    else if (magnitude < 3) {
        return 23;
    }
    else if (magnitude < 4) {
        return 33;
    }
    else if (magnitude < 5) {
        return 43;
    }
    else {
        return 55;
    }
}

// Function to set marker color relative to magnitude

function markerColor(magnitude) {
    if (magnitude < 1) {
        return "#7FFF00";
    }
    else if (magnitude < 2) {
       return "#ADFF2F";
    }
    else if (magnitude < 3) {
        return "#FFD700";
    }
    else if (magnitude < 4) {
        return "#FFA500";
    }
    else if (magnitude < 5) {
        return "#FF8C00";
    }
    else {
        return "#FF4500";
    }
}


// Read in the API data
d3.json(queryUrl, function(data) {
    console.log(data);

    // Pass the data to createfeatures function
    createFeatures(data.features);
    
  });

// Run createfeature function to create markers
  
 function createFeatures(earthquakeData) {

    // function to create popup providing earthquake info
    function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
    "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");
  }

    // function to create markers 
    function pointToLayer (feature, latlng) {
    return new L.CircleMarker(latlng, {
    radius: markerSize(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    color: "#000000",
    weight: 1,
    fillOpacity: 1
});
    }

// Create GeoJSon layer containing the features on the earthquake data
  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
      });


 // send layer to createmap funtion
  createMap(earthquakes);

}

function createMap(earthquakes) {

    var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        accessToken: "pk.eyJ1IjoiYWx4cHJ5IiwiYSI6ImNrYW9saHZjNDA0Z3ozMG82cHZpcm0xbm8ifQ.yM3ZhZhGelQpcJBz0wtaiw"
    });

    var baseMaps = {
        "Light Map": lightmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center:[
            40.09, -110.71
          ],
          zoom: 5,
          layers: [lightmap, earthquakes]
        });
      
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomleft" });
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var magScale = [0, 1, 2, 3, 4, 5]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magScale.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(magScale[i]) + '"></i> ' +
            magScale[i] + (magScale[i + 1] ? '&ndash;' + magScale[i + 1] + '<br>' : '+');
    }

    return div;
};

  // Adding legend to the map
  legend.addTo(myMap);

    }
        