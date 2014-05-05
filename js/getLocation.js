//Get Location Function test
var firstTime = true;

var GetLocation = function(map){

 	map.locate({setView:true, watch:true, enableHighAccuracy: true} );

 	function onLocationFound(e){

      var radius = e.accuracy / 2;

      	// removes marker and circle before adding a new one
      	if(firstTime===false){
      		map.removeLayer(circle);
      		map.removeLayer(locationMarker);
      	}

      	if(e.accuracy<90){
      	//adds location and accuracy information to the map
	 		circle = L.circle(e.latlng, radius).addTo(map);
	 		locationMarker = L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point");
	 		firstTime = false;
 		}
 		//if accuracy is less than 60m then stop calling locate function
 		if(e.accuracy<40){
 			var count = 0;
 		 	console.log("accuracy is less than 30m" + count);
 		 	map.stopLocate();
 		 	
 		 	count++;
 		}
 		

 	}

	map.on('locationfound', onLocationFound);

}
