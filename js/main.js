
// viewed--keep track of whether a site was already viewed
var viewed = [true, false, false, false, false];
// current--keep track of the current viewed site
var current = [false, false, false, false, false];

//main.js initiates the map and runs the functionality of the map 

var map;
 window.onload = loadmap();
 
var currentTile = 'modern';
//define variables hold the path to each tile layer
//below was commented out to cut the historical tiles for time being
// var historicTileset = L.tileLayer ('https://{s}.tiles.mapbox.com/v3/carolinerose.71spds4i/{z}/{x}/{y}.png');
var modernTileset = L.tileLayer ('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');


//var studentRoute = L.geoJson(route1);
 
//these objects will hold pairs of keys (name of the tile layer) and values (variable holding the path to the tile layer) 
// Commented out for the time being until we want to add back baseme
//  var baseMaps = {
//     "Modern": modernTileset,
//     "Historic": historicTileset
// };

/*var overlayMaps = {
	//route is defined in a .js file within the data folder. 
    "Route": studentRoute
};*/
 


 function loadmap(){

 
  map = L.map('map', { zoomControl:true});
    // tiles can change once we know our basemap 
    L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      minzoom: 5,
    }).addTo(map);
    // initial zoom & set map coords, these will change 
    
    
 
  //addTileToggle();


}
// adds the find me control
L.Control.Button = L.Control.extend({
  options: {
    position: 'topleft'
  },
  initialize: function (options) {
    this._button = {};
    this.setButton(options);
  },
 
  onAdd: function (map) {
    this._map = map;
    var container = L.DomUtil.create('div', 'leaflet-control-button');
    
    this._container = container;
    
    this._update();
    return this._container;
  },
 
  onRemove: function (map) {
  },
 
  setButton: function (options) {
    var button = {
      'iconUrl': options.iconUrl,           //string
      'onClick': options.onClick,           //callback function
      'maxWidth': options.maxWidth || 70,     //number
      'doToggle': options.toggle,           //bool
      'toggleStatus': false                 //bool
    };
 
    this._button = button;
    this._update();
  },
  

  getIconUrl: function () {
    return this._button.iconUrl;
  },
  
  destroy: function () {
    this._button = {};
    this._update();
  },
  
  toggle: function (e) {
    if(typeof e === 'boolean'){
        this._button.toggleStatus = e;
    }
    else{
        this._button.toggleStatus = !this._button.toggleStatus;
    }
    this._update();
  },
  
  _update: function () {
    if (!this._map) {
      return;
    }
 
    this._container.innerHTML = '';
    this._makeButton(this._button);
 
  },
 
  _makeButton: function (button) {
    var newButton = L.DomUtil.create('div', 'leaflet-buttons-control-button leaflet-bar a', this._container);
    if(button.toggleStatus)
        L.DomUtil.addClass(newButton,'leaflet-buttons-control-toggleon');
        
    var image = L.DomUtil.create('img', 'leaflet-buttons-control-img', newButton);
    image.setAttribute('src',button.iconUrl);
    
 
    L.DomEvent
      .addListener(newButton, 'click', L.DomEvent.stop)
      .addListener(newButton, 'click', button.onClick,this)
      .addListener(newButton, 'click', this._clicked,this);
    L.DomEvent.disableClickPropagation(newButton);
    return newButton;
 
  },
  
  _clicked: function () {  //'this' refers to button
    if(this._button.doToggle){
        if(this._button.toggleStatus) { //currently true, remove class
            L.DomUtil.removeClass(this._container.childNodes[0],'leaflet-buttons-control-toggleon');
        }
        else{
            L.DomUtil.addClass(this._container.childNodes[0],'leaflet-buttons-control-toggleon');
        }
        this.toggle();
    }
    return;
  }
 
});

var myButtonOptions = {
      'iconUrl': './images/img/icon_12638/icon_12638_24r.png',  // string
      'onClick': my_button_onClick,  // callback function
      'hideText': true,  // bool
      'maxWidth': 30,  // number
      'doToggle': false,  // bool
      'toggleStatus': false  // bool
}   

var myButton = new L.Control.Button(myButtonOptions).addTo(map);

function my_button_onClick() {
    console.log("someone clicked my button");
     GetLocation(map);
}

//end of find me control

function addTileToggle() { //called at the end of loadmap function

//could not get the default layer control to work. Substituted my own using the toggleTiles function. 
//	L.control.layers(baseMaps, null, {position: 'bottomleft', collapsed: false}).addTo(map);
	
	document.getElementById("tileToggle").addEventListener("click", toggleTiles);
	
}
/* Toggles Tiles */
function toggleTiles(){
	if (currentTile == 'modern'){
		console.log("switch to historic basemap"); 
		//this just adds the historic basemap on top of the existing tiles
		historicTileset.addTo(map);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Hide Historic Basemap</b>"; 
		//reset variable 
		currentTile = 'historic';
	}
	else if (currentTile == 'historic') {
		console.log("switch to modern basemap"); 
		//this removes the historic basemap tile layer 
		map.removeLayer (historicTileset);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Show Historic Basemap</b>"; 
		//reset variable 
		currentTile = 'modern';
	}
}


// sends to responsive.js this allows map elements to be responsive
setMap(map);


/* Loads Markers Into Map*/
addMarkers(map, 0); //function defined in markers.js file


/* initial script */
    //to allow for next buttons for the intro script
if(siteID==null){
   $('.script').html(PointsofInterest[0].features[0].properties.Scripts[0]);
$('.script').before( "<b><a href='#' class='previous' style='color:#C41E3A; padding-left:20px' >< previous</a></b>" );
$('.script').before( "<b><a href='#' class='next' style='color:#C41E3A; float:right; padding-right:20px' >next ></a></b>" );
}
var i=0;

$('.next').click(function(){
    i++;
    if(i==PointsofInterest[0].features[0].properties.Scripts.length){i=0}
     updateScript(i);
});
$('.previous').click(function(){
    i--;
    if(i==-1){i=PointsofInterest[0].features[0].properties.Scripts.length}
     updateScript(i); 
});

function updateScript(i){
    $('.script').html(PointsofInterest[0].features[0].properties.Scripts[i]);
}
/*Load Route Into Map*/ 
var routeStyle = {
    "color": "#645e5f",
    "weight": 5,
    "opacity": 0.7
};

// the style of the highlighted route segment
var highlightStyle = {
    "color": "#C41E3A",
    "weight": 5,
    "opacity": 0.8
};

// all segments of the route
//var initrouteLayer = L.geoJson(routes[0].features[0], {style: routeStyle});
var initrouteLayer = L.geoJson(routes[0].features[0]); // default blue color for routes
initrouteLayer.addTo(map);
// hilighted segment
var highlightLayer;

// audio
var audioDesktop = document.getElementById("playerDesktop");
var audioMobile = document.getElementById("playerMobile");

$('#slideshowModal').on('closed', function () {
	
    updateLocationMenu();
    updateMarkers();
    updateRoute();
	
    if(siteID==3)
    {
        viewed[4]=true;
    }
    
    highlightRoute();
    addScript();
    
    // start to play audio after 1 sec closing sliede show
	setTimeout(playAudio, 1000);
});

function updateRoute(){
    // show the route to next site after the previous site was viewed
    for(var i=0; i<viewed.length-1; i++){
        if(viewed[i] && !viewed[i+1]){
            //routeLayer[i].addTo(map);
            //var route = L.geoJson(routes[0].features[i+1], {style: routeStyle});
            var route = L.geoJson(routes[0].features[i+1]); // default blue color for route
            route.addTo(map);
            
        }
    }
}

function highlightRoute()
{
    if(highlightLayer){
        map.removeLayer(highlightLayer);
    }
    // "siteID" is a variable declared in markers.js to keep track of which site they are working on
	if(siteID < 4){
		highlightLayer = L.geoJson(routes[0].features[siteID + 1], {style: highlightStyle});
		highlightLayer.addTo(map);
	}

	console.log(highlightLayer);
}

function addScript(){
$('.next').remove();
$('.previous').remove();
	//console.log("siteID",siteID);
	for(var prop in PointsofInterest[0]){
		//console.log(PointsofInterest[0][prop]);
		for(var key in PointsofInterest[0][prop]){
			//console.log(PointsofInterest[0][prop][key]);
			for(var one in PointsofInterest[0][prop][key]){
			
				//console.log(PointsofInterest[0][prop][key][one].id);
				if(siteID === PointsofInterest[0][prop][key][one].id - 1){
					//console.log("X",PointsofInterest[0][prop][key][one].Scripts);
					if(siteID<4){
						$('.script').html(PointsofInterest[0][prop][key][one].Scripts[0])
					}
				}

			}
		}

	}
	// var scriptNum = siteID;

	// console.log("x",L.geoJson(routes[0].features[siteID + 1]));

	// $('.script').html();

}

function playAudio()
{	
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    if(winWidth > midBreakPoint){
        audioDesktop.setAttribute('src', PointsofInterest[0].features[siteID+1].properties.audio);
        audioDesktop.play();
    }
    else{
        audioMobile.setAttribute('src', PointsofInterest[0].features[siteID+1].properties.audio);
        audioMobile.play(); 
    }
}

function updateLocationMenu()
{   
    var locationMenu = document.getElementById('locationMenu');
    // show site in location menu after the site was explored
    for(var i=0; i<viewed.length-1; i++){
        if(viewed[i] && !viewed[i+1]){
            
            if(i==0 && document.getElementsByClassName('Railroad').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'Railroad');
                locationLi.innerHTML = '<a href="#"><img src="images/transportation24design1.png"  alt="Locations"/> Railroad Station</a>';
                locationMenu.appendChild(locationLi);
                $("li.Railroad").click(function(){                    map.setView(POI.features.Railroad.geometry.coordinates,zoomPOI)
});
            }
            
            if(i==1 && document.getElementsByClassName('Power_Plant').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'Power_Plant');
                locationLi.innerHTML = '<a href="#"><img src="images/energy24design2.png" alt="Locations"/> Power Plant</a>';
                locationMenu.appendChild(locationLi);
                $("li.Power_Plant").click(function(){
  map.setView(POI.features.Power_Plant.geometry.coordinates,zoomPOI)
});
            }
            if(i==2 && document.getElementsByClassName('Wil_Mar').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'Wil_Mar');
                locationLi.innerHTML = '<a href="#"><img src="images/housing24design2.png" alt="Locations"/> Community Center</a>';
                locationMenu.appendChild(locationLi);
                $("li.Wil_Mar").click(function(){
  map.setView(POI.features.Wil_Mar.geometry.coordinates,zoomPOI)
});
            }
            if(i==3 && document.getElementsByClassName('candy').length==0){
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'candy');
                locationLi.innerHTML = '<a href="#"><img src="images/coffee24_grey.png"  alt="Locations"/> Candy Company</a>';
                locationMenu.appendChild(locationLi);
                $("li.candy ").click(function(){
  map.setView(POI.features.Candy_Factory.geometry.coordinates,zoomPOI)
});
                var locationLi = document.createElement('li');
                locationLi.setAttribute('class', 'allLocations');
                locationLi.innerHTML = '<a href="#">All Locations</a>';
                locationMenu.appendChild(locationLi);
                $("li.allLocations").click(function(){
  map.setView([ 43.078307,-89.377041],zoomPOI-3)
});
            }
            
            
        }
    }
}
