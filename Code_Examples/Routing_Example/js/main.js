var coor;
var gcode;
var destcoor;
var destgcode;
var route;

var map;
var markerOrigin;
var markerDestination;
var directionLayer;

var latitude;
var longitude;
var destlatitude;
var destlongitude;

var routegeojson =
    {
    "type": "FeatureCollection",
    "features": [ { "type": "Feature", "id": 0, "properties": { "id": 1, "NAME": "Direction", "DESCR": "Direction"}, "geometry": { "type": "LineString", "coordinates": [ ]  }} ]};

var route_steps;

function initialize(){

  coor=document.getElementById("coordinates");
  gcode=document.getElementById("gcode");
  destcoor=document.getElementById("destlatlng");
  destgcode=document.getElementById("dest_address");
  route = document.getElementById("route");
}

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
      coor.value="Geolocation is not supported by this browser.";
  }
}

function showPosition(position){
    coor.value = position.coords.latitude + ", " + position.coords.longitude;
    getGeoCode();
    addOriginMarker();
}

function getGeoCode(){
    var latlngStr = coor.value.split(',', 2);

    latitude = parseFloat(latlngStr[0]);
    longitude = parseFloat(latlngStr[1]);

    var latlng = new google.maps.LatLng(latitude, longitude);

    //alert(latlng);

    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, showGeocode);
}

function setDestination(){
    destcoor.value = "43.07465,-89.384267";
    addDestinationMarker();
}

function getDestGeoCode(){

    addDestinationMarker();
    if (directionLayer){
        map.removeLayer(directionLayer)
    }

    // destination
    var destlatlngStr = destcoor.value.split(',', 2);

    destlatitude = parseFloat(destlatlngStr[0]);
    destlongitude = parseFloat(destlatlngStr[1]);

    var destlatlng = new google.maps.LatLng(destlatitude, destlongitude);

    //alert(latlng);

    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': destlatlng}, showDestGeocode);
}

function showGeocode(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
            gcode.value = results[1].formatted_address;
        }
        else {
            alert('No results found');
        }
    }
    else {
        alert('Geocoder failed due to: ' + status);
    }
  }

function showDestGeocode(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
            destgcode.value = results[1].formatted_address;
        }
        else {
            alert('No results found');
        }
    }
    else {
        alert('Geocoder failed due to: ' + status);
    }
  }

function getDirection(){

    var directionsService = new google.maps.DirectionsService();

    var start = coor.value;
    var end = destcoor.value;

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            route_steps = response.routes[0].legs[0].steps;

            var str = "";
            routegeojson.features[0].geometry.coordinates = [];
            for(var i=0;i<route_steps.length;i++){
                for(var j=0;j<route_steps[i].path.length;j++){

                    var lat = (route_steps[i].path)[j].lat();
                    var lng = (route_steps[i].path)[j].lng();
                    routegeojson.features[0].geometry.coordinates.push([lng, lat]);
                }
            }
            showDirectionMap();
        }
    });
}

function showMap() {

    initialize();

    map = L.map("map");
    // tiles can change once we know our basemap
                  L.tileLayer('https://{s}.tiles.mapbox.com/v3/rashauna.hb2aepgd/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      minzoom: 5,
    }).addTo(map);

    // initial zoom & set map coords, these will change
    map.setView([43.076155,-89.408472], 14);

    addOriginMarker();
    addDestinationMarker();
}

function showDirectionMap() {

    if(!coor.value || !destcoor.value){
        alert("Please specify your ORIGIN/DESTINATION first!");
    }
    else{
        map.setView([(latitude + destlatitude) / 2,(longitude + destlongitude) / 2], 14);

        if (directionLayer){
            map.removeLayer(directionLayer)
        }
        directionLayer = L.geoJson(routegeojson).addTo(map);
    }
}

function addOriginMarker(){
    // show the current position marker
    if(coor.value){
        var latlngStr = coor.value.split(',', 2);
        latitude = parseFloat(latlngStr[0]);
        longitude = parseFloat(latlngStr[1]);
        if(!markerOrigin){
            markerOrigin = L.marker([latitude, longitude]);
            markerOrigin.addTo(map);
            markerOrigin.bindPopup('<b>Your Position');
        }
    }
}

function addDestinationMarker(){
    // show the destination marker
    if(destcoor.value){
        var destlatlngStr = destcoor.value.split(',', 2);
        destlatitude = parseFloat(destlatlngStr[0]);
        destlongitude = parseFloat(destlatlngStr[1]);

        if(markerDestination){
            map.removeLayer(markerDestination);
        }
        markerDestination = L.marker([destlatitude, destlongitude]);
        markerDestination.addTo(map);
        markerDestination.bindPopup('<b>Destination');
    }
}

window.onload = showMap();
