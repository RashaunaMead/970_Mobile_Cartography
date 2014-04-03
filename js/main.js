//main.js initiates the map and runs the functionality of the map 
var map;
 window.onload = loadmap();


 function loadmap(){
 
  map = L.map('map');
    // tiles can change once we know our basemap 
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/rashauna.hlkken8n/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      minzoom: 5,
    }).addTo(map);
    // initial zoom & set map coords, these will change 
    map.setView([43.07790859834721, -89.37177476473153], 14);
    map.attributionControl.setPosition('topright');
    


   


}

 
// calls the find me function 
$("li.findMe").click(function(){
    	GetLocation(map);
});
// sends to responsive.js thes allows map elements to be responsive
setMap(map);