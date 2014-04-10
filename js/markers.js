//this file created by Caroline. 
//this function adds custom icons to the map, drawing the path to the image from the geojson 
function addMarkers (map) {

	var POIlayer = L.geoJson(PointsofInterest, {
        //some options
		pointToLayer: function(feature, latlng){
			return L.marker(latlng, {icon: L.icon(feature.properties.icon)});
		}, //end pointToLayer
		
		onEachFeature: function (feature, layer){

			//listener for click event 
			layer.on("click", function() {
				openInfoScreen (feature)
			});
			
		} //end onEachFeature
    }); 
	
	map.addLayer(POIlayer);
	
} //ends addMarkers function 


function openInfoScreen (feature){
	console.log("open info screen for ", feature.properties.title);
	
	var infoScreen = document.getElementById("infoScreen");
	infoScreen.style.visibility = "visible";
	
	//for now, the div will disappear when you click on it. 
	infoScreen.addEventListener("click", function(){
		infoScreen.style.visibility = "hidden";
	});
	

}
