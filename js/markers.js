//this function adds custom icons to the map, drawing the path to the image from the geojson 
function addMarkers (map) {

	var POIlayer = L.geoJson(PointsofInterest, {
        //some options
		pointToLayer: function(feature, latlng){
		
//			return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85});
			
			return L.marker(latlng, {icon: L.icon(feature.properties.icon)});
		
		}, //end pointToLayer
		
		onEachFeature: function (feature, layer){
			//Will remove popup later
			layer.bindPopup(feature.properties.title);
			
			//add a listener for click event 
			
		} //end onEachFeature
    }); 
	
	map.addLayer(POIlayer);
	
} //ends addMarkers function 

