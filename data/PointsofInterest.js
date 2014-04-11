var PointsofInterest = [{
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                                                                              
"features": [
//Fifth POI: Candy Factory/Coffee Shop 
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.371953550849724, 43.07805483986813 ] 
	}, 
	"properties": { 
		"id": 4, "title": "Madison Candy Factory",	
		"icon": {
			"iconUrl": "images/production24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
	
			},
		 "Descriptio": "�Think about how the current businesses in this building produce value, and contrast these post-Fordist forms of production to the Fordist mode of production that used to inhabit it.", 
		 "PhotoLink": null, "Address": "744 Williamson St.", "iconLink24": null, "iconLink36": null,
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....A"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....B"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....C"
			}
		 ]
		 // end for image set in slide show
        
	} //end properties		
}, //end feature

//Fourth POI: Wil Mar Center 
{ "type": "Feature", 
	"geometry": {
		"type": "Point", 
		"coordinates": [ -89.366976240603208, 43.079849673461318 ] 
	}, 
	"properties": { 
		"id": 3, "title": "Wil-Mar Neighborhood Center", 
		"icon": {
			"iconUrl": "images/housing24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
			
			},
		"Descriptio": ". Built as a church and now a community center, the building provides a good opportunity to reflect on how the neighborhood has changed.", "PhotoLink": null, "Address": "953 Jenifer St.", "iconLink24": null, "iconLink36": null,
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....A"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....B"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....C"
			}
		 ]
		 // end for image set in slide show
        
	}  //end properties
},


//Third POI: Power Plant
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.375201651182024, 43.079766795017484 ] 
	},
	"properties": { 
		"id": 2, "title": "Power Plant", 
		"icon": {
			"iconUrl": "images/energy24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
		
			},
		"Descriptio": "Think through questions about energy flows through homes and business, inequalities related to the electric grid, and alternative forms of power.", "PhotoLink": "images\/powerPlant.jpg", "Address": "722 E Main St.", "iconLink24": null, "iconLink36": null,
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....A"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....B"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....C"
			}
		 ]
		 // end for image set in slide show
        
	} //end properties  
}, //end feature

//Second POI: Train Station
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.377256640357785, 43.077604078273943 ]
	},

	"properties": { 
		"id": 1, "title": "Railroad Station (now MG&E)", 
		"icon": {
			"iconUrl": "images/transportation24design1.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
			
			},
		"Descriptio": "Former railroad station...", "PhotoLink": "images\/railroadStation.jpg", "Address": "133 S Blair St.", "iconLink24": null, "iconLink36": null,
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....A"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....B"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....C"
			}
		 ]
		 // end for image set in slide show
        
	} //end properties  
}, //end feature

//First POI: Shoe Factory
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.378615022118979, 43.081285046311976 ] 
	}, 

	"properties": { 
		"id": 0, "title": "Badger State Shoe Factory", 
		"icon": {
			"iconUrl": "images/labor24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
			
			},
		"Descriptio": "(From Wikipedia) The building was constructed in 1910 after the company had originally expanded its production to Madison in 1900.  designated a landmark by the Madison Landmarks Commission in 1989.", "PhotoLink": "images\/BadgerStateShoeFactory1.jpg", "Address": "123 N Blount", "iconLink24": null, "iconLink36": null,
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....A"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....B"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "texts come along with images go here ....C"
			}
		 ]
		 // end for image set in slide show
        
	} //end properties 
} //end feature
] //end features list
} //end feature collection  
]; //end object