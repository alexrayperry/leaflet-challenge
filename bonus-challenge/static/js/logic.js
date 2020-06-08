// USGS Magnitude Earthquakes, Past Week

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Geo jason data for fault lines

var platesUrl = "PB2002_boundaries.json"

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

// function to read GeoJSON data(fault lines) and add as layer

function createFeatures(platesUrl, layer) {
    
    var tecPlates = L.geoJSON(platesUrl).addTo(layer);

}

// pass GeoJSON data to prior function

d3.json(platesUrl, function(data) {
    // Creating a geoJSON layer with the retrieved dat

    createFeatures(data.features, plates);
  
});

// create function to read USGS API data and set earthquakes as marker and diplay quake info on click.
  
 function createFeatures(queryUrl, layer) {

    function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
    "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");
  }


    function pointToLayer (feature, latlng) {
    return new L.CircleMarker(latlng, {
    radius: markerSize(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    color: "#000000",
    weight: 1,
    fillOpacity: 1
});
    }


  var quakes = L.geoJSON(queryUrl, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
      }).addTo(layer);

}

// Read in USGS data and pass data to previous funtion.

d3.json(queryUrl, function(data) {
    console.log(data);

    createFeatures(data.features, earthquakes);
    
  });

// create global variables for Map and Layers to work with in multiple functions

var myMap;
var plates = L.featureGroup();
var earthquakes = L.featureGroup();

// Create function to create map

function createMap() {

    // tile layers for grayscale, satellite, and outdoor

    var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        accessToken: "pk.eyJ1IjoiYWx4cHJ5IiwiYSI6ImNrYW9saHZjNDA0Z3ozMG82cHZpcm0xbm8ifQ.yM3ZhZhGelQpcJBz0wtaiw"
    });

    var satmap = new L.GIBSLayer('BlueMarble_NextGeneration', {
        date: new Date('2015/04/01'),
        transparent: true
    });

    var outdoormap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/outdoors-v11',
        accessToken: "pk.eyJ1IjoiYWx4cHJ5IiwiYSI6ImNrYW9saHZjNDA0Z3ozMG82cHZpcm0xbm8ifQ.yM3ZhZhGelQpcJBz0wtaiw"
    });

  // create variable to hold tile layers

    var baseMaps = {
        "Grayscale": lightmap,
        "Satellite": satmap,
        "Outdoor": outdoormap

    };

    // variable to hold map layers (markes & fault lines)

    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": plates 
    };


    // Create our map, giving it the satellite map, earthquake markers and fault lines to display on load

    myMap = L.map("map", {
        center:[
            40.09, -110.71
          ],
          zoom: 5,
          layers: [satmap, earthquakes, plates]
        });
    
    // Create layer control to allow user functionality
    
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

createMap();

