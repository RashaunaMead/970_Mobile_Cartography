 window.onload = loadmap();
    var locationlng;
    var locationlat;
    var boundsCirc;
    var radius =300;
    var accuracyCirc;
    var cirLat=43.07790859834721;
    var cirLng=-89.37177476473153;
    var coord;
    var circle;
    var circleMove;
    var locationMarker;
    var markerMove;
    var fistTime = true;
    var markerNotOnMap =true;
    var latFound;
    var lngFound;
 
    function loadmap(){
  
    var map = L.map('map');

      L.tileLayer('https://{s}.tiles.mapbox.com/v3/rashauna.hb2aepgd/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18
      }).addTo(map);

    // initial zoom and coords, updated on location found
    map.setView([43.07790859834721, -89.37177476473153], 4);
    // sets location as center of map and watches for new updates
    map.locate({setView:true, watch:true} );
     
     // initial marker and circle, coordinates will be updated on location found
     locationMarker = L.marker([43.07790859834721, -89.37177476473153]).addTo(map);
     circle = L.circle([43.07790859834721, -89.37177476473153], 1,{color:'red',fillOpacity: 0}).addTo(map);
     circleMove = L.circle([43.07790859834721, -89.37177476473153], 1,{color:'red',fillOpacity: 0}).addTo(map);
     


    //Called when location is found
    function onLocationFound(e) {

        if(fistTime){
         var stagger = 0.0005;
          cirLat = e.latlng.lat+stagger;
          cirLng = e.latlng.lng+stagger;
          console.log(fistTime);
          map.locate({ setView: false} );
          fistTime=false;
        }
       //remove markers and circles that will be updated
       map.removeLayer(locationMarker);
       map.removeLayer(circleMove);
       map.removeLayer(circle);

       updateMarkers(e);


    }
    // Adds updated markers onto the map
    function updateMarkers(e){

      //Accuracy radius used to draw the location circle
      var radiusA = e.accuracy / 2;

      if(markerNotOnMap){
        // adds the draggable geofenced marker
        var stagger = 0.0005;
          markerMove = L.marker(new L.LatLng(e.latlng.lat+stagger,e.latlng.lng+stagger), {
          draggable: true,
        });
        markerMove.bindPopup('This marker is draggable. And when your next geo location is found it will draw a red circle with a 300m radius');
        markerMove.addTo(map);

        markerNotOnMap=false;
      }

      //updates the current location marker
       locationMarker = L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radiusA + " meters from this point").openPopup();
      circle = L.circle(e.latlng, radiusA).addTo(map);

    //adds circle that acts as the geofence that is centered around moveable marker
     circleMove = L.circle([cirLat,cirLng], radius,{color:'red',fillOpacity: 0.2}).addTo(map);
     console.log(markerMove._latlng.lat);

    // Gets bounds of "geofence" circle.  This is where the break down of the geofence happens. The bounds are a square around the circle.  
    // This means a point could be inside the square and outside the circle and register as in the cicle.
    var circleBounds = circleMove.getBounds();

    //if then that checks if location marker is inside the bounds of "geofence" circle
    if(circleBounds.contains([locationMarker._latlng.lat,locationMarker._latlng.lng])){
      $('#actions').css('background', '#7eeaab');
      $("#actions").html("Inside");
     }
     else{
       $('#actions').css('background', '#DE6060');
       $("#actions").html("Outside");
     }
     
     //Called when dragend to update "geofence" circle, this will be only updated once geolocation is found again
     markerMove.on('dragend', updateCircle);
    }

    // Geo location not found error
    function onLocationError(e) {
      alert(e.message);
    }
    //calls onfound functions
    map.on('locationfound', onLocationFound);
   // map.on('locationerror', onLocationError)

   // saves new lat and long coords for "geofence"
    function  updateCircle(){
      cirLat = markerMove._latlng.lat;
      cirLng = markerMove._latlng.lng;
    }    
 
}


