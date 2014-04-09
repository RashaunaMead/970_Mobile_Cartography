function addMarkers (map) {

	var POIlayer = new L.geoJson(PointsofInterest, {
//		pointToLayer: makeMarker;
		
        //some options
    }).addTo(map);
	

} //ends addMarkers function 

