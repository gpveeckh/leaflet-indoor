// Create the map
var osmUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  osm = new L.TileLayer(osmUrl, {
    maxZoom: 22,
    attribution: 'Map data &copy; OpenStreetMap contributors'
  });
var map = new L.Map('map', {
  layers: [osm],
  center: new L.LatLng(49.41873, 8.67689),
  zoom: 19
});
// This example uses a GeoJSON FeatureCollection saved to a file
// (data.json), see the other example (live/index.html) for details on
// fetching data using the OverpassAPI (this is also how the data in
// data.json was generated)
$.getJSON('data.json', function(geoJSON) {
  var indoorLayer = new L.Indoor(geoJSON, {
    getLevel: function(feature) {
      if (feature.properties.relations.length === 0) return null;
      return feature.properties.relations[0].reltags.level;
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(JSON.stringify(feature.properties, null, 4));
    },
    style: function(feature) {
      var fill = 'white';
      if (feature.properties.tags.buildingpart === 'corridor') {
        fill = '#169EC6';
      } else if (feature.properties.tags.buildingpart === 'verticalpassage') {
        fill = '#0A485B';
      }
      return {
        fillColor: fill,
        weight: 1,
        color: '#666',
        fillOpacity: 1
      };
    }
  });
  indoorLayer.setLevel('0');
  indoorLayer.addTo(map);
  var levelControl = new L.Control.Level({
    level: '0',
    levels: indoorLayer.getLevels(),
    indoorLayer: indoorLayer
  });
  levelControl.addTo(map);
});
var legend = L.control({ position: 'topright' });
legend.onAdd = function(map) {
  var d =
    'This Leaflet plugin makes it easier to create indoor ' +
    'maps. This example pulls in the data for a particular ' +
    'building, and then displays it on the map, you can ' +
    'change the level displayed by using the selector at ' +
    'the bottom right of the map.';
  var div = L.DomUtil.create('div', 'info legend');
  div.appendChild(document.createTextNode(d));
  return div;
};
legend.addTo(map);
