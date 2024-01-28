//store the API endpoint as geoJSON
let geoJSON_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//console.log() url and examining data
d3.json(geoJSON_url).then(function (data){
    console.log(data);
});

//creating the map object and coordinates and zoom used for center of United States
let starterPoint = L.map("map", {
  center: [37.0902,-95.7129 ], zoom: 4
});

//making the tile layer that will be the background of the map.
let starterMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

//added topo layer
let topoMapLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let mapLayers = {
  "Street Map": starterMapLayer,
  "Topographic Map": topoMapLayer
};

//starter map added to the created tile layer
starterMapLayer.addTo(starterPoint);

//retrieving the earthquake geoJSON data with "geoJSON_url"
d3.json(geoJSON_url).then(function(data) {

//function created to return style data for every earthquake placed on the map
function markerStyle(feature) {
  return {
    fillOpacity: 1,
    opacity: 1,
    radius: markerRadius(feature.properties.mag),
    stroke: true,
    fillColor: markerColor(feature.geometry.coordinates[2]),
    color: "black",
    weight: 0.65
  };
}

//set marker color based on earthquake depth
function markerColor(depth) {
  switch (true) {
    case depth > 90:
      return "#ee0000";
    case depth > 70:
      return "#ee3800";
    case depth > 50:
      return "#ee6f00";
    case depth > 30:
      return "#eec600";
    case depth > 10:
      return "#daee00";
    default:
      return "#a3ee00";}
    }
//create radius size based on magnitude
function markerRadius(magnitude) {
  if (magnitude === 0) {
    return 1;}
return magnitude * 4;
}

//adding geoJSON layer, and features to the map based on earthquake data
L.geoJson(data, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng);
  }, style: markerStyle,
 //adding a popup for every marker to display info on the earthquake
  onEachFeature: function (feature, layer) {
    layer.bindPopup("Magnitude: "
    + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
  }
}).addTo(starterPoint);

//creating legend for the map
let legend = L.control({position: "bottomright"
});

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  let depthLevel = [-10, 10, 30, 50, 70, 90];
  let legendColor = ["#9fee00", "#daee00", "#eed600", "#ee9300", "#ea782c", "#ea322c"]

  //for loop to create color sqaure in the legend per each interval
  for (let i = 0; i < depthLevel.length; i++) {div.innerHTML += "<i style='background: " + legendColor[i] + "'></i> "
     + depthLevel[i] + (depthLevel[i + 1] ? "&ndash;" + depthLevel[i + 1] + "<br>" : "+");}
  return div;
};

//add legend to the map
legend.addTo(starterPoint);
});

//created a layer control
  L.control.layers(mapLayers).addTo(starterPoint);