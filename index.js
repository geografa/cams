'use strict';
const mapboxgl = require('mapbox-gl');
// const mapbox = require('mapbox');
// const turf = require('turf');
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JhZmEiLCJhIjoiY2pxbjFhMTg1MDJ2MzQ0bXJpZ2c5NjM3eCJ9.XDmc8knZy11F1omDy_P22w';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/grafa/ck5ediqej18c81ioj4jrgw8su',
    center: [-122.67143949070442,45.54722707150694],
    zoom: 11,
    minZoom: 10
});

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['cctvinventory'] });
    // Change the cursor style as a UI indicator.
    var lng = e.lngLat.lng,
        lat = e.lngLat.lat;
    var url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/' + lng +','+ lat + ';-122.58458586634072,45.58556897518142?sources=0&destinations=all&access_token=pk.eyJ1IjoiZ3JhZmEiLCJhIjoiY2pxbjFhMTg1MDJ2MzQ0bXJpZ2c5NjM3eCJ9.XDmc8knZy11F1omDy_P22w';

    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload  = function() {
       var jsonResponse = req.response;
       // document.getElementById("demo").innerHTML = jsonResponse.features;
       // do something with jsonResponse
       var eta = Math.ceil(jsonResponse.durations[0][1]/60);

       document.getElementById('pop').innerHTML = '<img src=" '+ feature.properties["cctv-url"] + '" /><br><h2>' + 
         eta + ' min to PDX ✈</h2>';
    };
    req.send();
    // https://apiportal.odot.state.or.us/api-details#api=tripcheck-api-v1-0&operation=Dms_GetStatus&definition=DmsStatusItem

    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return;
    }

    var feature = features[0];
    var coords = feature.geometry.coordinates;
    
    if (!features.length) {
        popup.remove();
        return;
    }
    popup.setLngLat(coords)
        .setHTML('<div id ="pop"><div>')
        .addTo(map);
});