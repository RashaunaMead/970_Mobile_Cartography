 window.onload = loadmap();
  
 function loadmap(){
  
  var map = L.map('map');
    // tiles can change once we know our basemap 
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/rashauna.hb2aepgd/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      minzoom: 5,
    }).addTo(map);

    // initial zoom & set map coords, these will change 
    map.setView([43.07790859834721, -89.37177476473153], 16);
  
}

