//main.js initiates the map and runs the functionality of the map 
var map;
 window.onload = loadmap();
 
var currentTile = 'modern';
//define variables hold the path to each tile layer
var historicTileset = L.tileLayer ('https://{s}.tiles.mapbox.com/v3/carolinerose.hnhm383b/{z}/{x}/{y}.png');
var modernTileset = L.tileLayer ('https://{s}.tiles.mapbox.com/v3/rashauna.hlkken8n/{z}/{x}/{y}.png');

//var studentRoute = L.geoJson(route1);
 
//these objects will hold pairs of keys (name of the tile layer) and values (variable holding the path to the tile layer) 
 var baseMaps = {
    "Modern": modernTileset,
    "Historic": historicTileset
};

/*var overlayMaps = {
	//route is defined in a .js file within the data folder. 
    "Route": studentRoute
};*/
 


 function loadmap(){
 
  map = L.map('map', { zoomControl:false});
    // tiles can change once we know our basemap 
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/rashauna.hlkken8n/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      minzoom: 5,
    }).addTo(map);
    // initial zoom & set map coords, these will change 
    map.setView([43.07790859834721, -89.37177476473153], 14);
 //   map.attributionControl.setPosition('topright');
  
  console.log(map);
  
 
  addTileToggle();
}

function addTileToggle() { //called at the end of loadmap function

//could not get the default layer control to work. Substituted my own using the toggleTiles function. 
//	L.control.layers(baseMaps, null, {position: 'bottomleft', collapsed: false}).addTo(map);
	
	document.getElementById("tileToggle").addEventListener("click", toggleTiles);
	
}

function toggleTiles(){
	if (currentTile == 'modern'){
		console.log("switch to historic basemap"); 
		//this just adds the historic basemap on top of the existing tiles
		historicTileset.addTo(map);
		//reset variable 
		currentTile = 'historic';
	}
	else if (currentTile == 'historic') {
		console.log("switch to modern basemap"); 
		//this removes the historic basemap tile layer 
		map.removeLayer (historicTileset);
		//reset variable 
		currentTile = 'modern';
	}
}

// map.addControl({ zoomControl:true });

// var map = new L.Map('map', { zoomControl:false });
// calls the find me function 
$("li.findMe").click(function(){
    	GetLocation(map);
});
// sends to responsive.js this allows map elements to be responsive
setMap(map);

addMarkers(map); //function in markers.js file