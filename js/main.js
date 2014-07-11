/***CLASS-LEVEL VARIABLES***/
var timeouts = [];
var map;
var currentTiles = 'modern';
var tilesToLoad = {
  13: { x1: 2061, xn: 2062, y1: 3007, yn: 3007 },
  14: { x1: 4123, xn: 4124, y1: 6015, yn: 6015 },
  15: { x1: 8246, xn: 8249, y1: 12030, yn: 12031 },
  16: { x1: 16492, xn: 16499, y1: 24060, yn: 24062 },
  17: { x1: 32987, xn: 32998, y1: 48121, yn: 48125 },
  18: { x1: 65972, xn: 65998, y1: 96241, yn: 96250 }
};
var tZ = 13, 
  tX = tilesToLoad[tZ].x1,
  tY = tilesToLoad[tZ].y1;

var imagesToLoad = [
  "/alert36.png",
  "/alert42_red.png",
  "/labor24.png",
  "/labor36.png",
  "/labor40_red.png",
  "/transportation24.png",
  "/transportation36.png",
  "/transportation40_red.png",
  "/energy24.png",
  "/energy36.png",
  "/energy40_red.png",
  "/housing24.png",
  "/housing36.png",
  "/housing40_red.png",
  "/coffee24.png",
  "/coffee36.png",
  "/coffee40_red.png"
], img = 0;

//var historicTiles = L.tileLayer ('https://{s}.tiles.mapbox.com/v3/carolinerose.71spds4i/{z}/{x}/{y}.png');
var modernTileset = L.tileLayer ('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');

window.onload = initialize();

function initialize(){
  loadmap(); //load the map
  //preloadTiles(13, 2061, 3007); //preload all map tiles so they are cached and viewable offline
  //preloadImages();

  $(document).foundation({
      orbit: {
          animation: 'slide',
          navigation_arrows: true,
          circular: true,
          timer: false,
          swipe: false,
          next_class: 'orbit-next',
          prev_class: 'orbit-prev',
          timer_show_progress_bar: false
      }
  });

  //use queue.js to parallelize asynchronous data loading for cpu efficiency
  queue()
    .defer(d3.json, "data/routes.geojson")
    .defer(d3.json, "data/PointsofInterest.geojson")
    .defer(d3.json, "data/alerts.geojson")
    .await(callback);
}

function preloadImages(){
  $("#preload img").attr("src",imagesToLoad[img]);
  $("#preload img").attr("onload","imageLoaded()");
  $("#preload img").attr("onerror","imageLoaded()");
};

function imageLoaded(){
  img++;
  if (img < imagesToLoad.length){
    preloadImages();
  }
}

function preloadTiles(tZ, tX, tY){
  var instances = ["a", "b", "c"];
  var rand = (Math.round(Math.random() * 10) % 3);
  var tS = instances[rand];

  $("#preload img").attr("src","http://a.www.toolserver.org/tiles/bw-mapnik/"+tZ+"/"+tX+"/"+tY+".png");
  $("#preload img").attr("onload","tileLoaded("+tZ+","+tX+","+tY+")");
  $("#preload img").attr("onerror","tileLoaded("+tZ+","+tX+","+tY+")");
};

function tileLoaded(tZ, tX, tY){
  var change = false;
  console.log("loaded: z: "+tZ+", x: "+tX+", y: "+tY);
  var tileset = tilesToLoad[tZ];
  if (tX < tileset.xn){
    if (tY < tileset.yn){
      tY++;
      change = true;
    } else {
      tY = tileset.y1;
      tX++;
      change = true;
    };
  } else {
    if (tZ < 18){
      tZ++
      change = true;
      tX = tilesToLoad[tZ].x1;
      tY = tilesToLoad[tZ].y1;
    };
  };
  change ? preloadTiles(tZ, tX, tY) : null;
}

function callback(error, routes, PointsofInterest, alerts){
  var POIlayer;
  var POIlayers = [];
  var POIlayer_red;
  updateMarkers(map, 0, "gray");

  //add script and next/back buttons to textModal--needs work
  if (siteID===0){
    $('.script').html(PointsofInterest.features[0].properties.Scripts[0]);
    $('.script').before( "<b><a href='#' class='previous' style='color:#C41E3A; padding-left:20px' >< previous</a></b>" );
    $('.script').before( "<b><a href='#' class='next' style='color:#C41E3A; float:right; padding-right:20px' >next ></a></b>" );
  }

  /***SCRIPTS***/
  var s=0;
  $('.next').click(function(){
    for (var i in timeouts){
      window.clearTimeout(timeouts[i]);
    };
    forwardScript();
  });

  $('.previous').click(function(){
      s--;
      s = s == -1 ? PointsofInterest.features[siteID].properties.Scripts.length-1 : s;
      updateScript(s); 

      for (var i in timeouts){
        window.clearTimeout(timeouts[i]);
      };
  });

  function forwardScript(){
    s++;
    s = s == PointsofInterest.features[siteID].properties.Scripts.length ? 0 : s;
    updateScript(s);
  }

  function updateScript(scr){
    $('.script').html(PointsofInterest.features[siteID].properties.Scripts[scr]);
  }

  function addScript(){
    $('.next').remove();
    $('.previous').remove();
    $('.script').html(PointsofInterest.features[siteID].properties.Scripts[0])
  }

  /***ROUTES***/
  var routeStyle = {
    "color": "#CE3234",
    "weight": 5,
    "opacity": 0.4
  };

  var highlightStyle = {
      "color": "#CE3234",
      "weight": 5,
      "opacity": 1
  };

  var highlightLayer, alertlayer;

  updateRoute(); //add initial route
  highlightRoute(); //highlight initial route
  updateLocationMenu(); //add first site to locations menu

  function updateRoute(){
    if (siteID < 5){
      var newroute = L.geoJson(routes.features[siteID], routeStyle).addTo(map); //visited style route underlays highlight

      map.fitBounds(L.latLngBounds(newroute.getBounds().getSouthWest(),newroute.getBounds().getNorthEast()));
      fixZoom();

      //remove old alerts and add any new alerts to map
      alertlayer ? map.removeLayer(alertlayer) : null;
      for (var alert in alerts.features){
        if (alerts.features[alert].properties.routeid === siteID){
          alertlayer = L.geoJson(alerts.features[alert], {
            pointToLayer: function(feature, latlng){
              return L.marker(latlng, {
                icon: L.icon({
                  iconUrl: "images/alert40_red.png",
                  iconSize: [40, 40],
                  popupAnchor: [0, -12]
                })
              });
            },
            
            onEachFeature: function (feature, layer){
              layer.bindPopup(feature.properties.alert);
            }
          }).addTo(map);
        }
      }
    }
  }

  function highlightRoute() {
    if (highlightLayer){
        map.removeLayer(highlightLayer);
    }
    if (siteID < 5){
      highlightLayer = L.geoJson(routes.features[siteID], {style: highlightStyle}).addTo(map);
    }
  }

  /***AUDIO***/
  function playAudio(isdesktop){  
    $("audio").prop('autoplay', true);
    $("audio").attr('src', PointsofInterest.features[siteID].properties.audio);

    if (isdesktop){
      $("audio").prop('muted', false);
      $("audio").show();
    } 
  }

  function hideAudio(){
    $("audio").prop('muted', true);
    $("audio").prop('autoplay', false);
    $("audio").hide();
  }

  function readAloud(){
    $("#readAloud").click(function(){
      updateScript(0);
      var scripts = PointsofInterest.features[siteID].properties.Scripts;

      var delay = 0;
      for (var i=0; i<scripts.length-1; i++){                      
        delay = delay + (scripts[i].length*68.2);
        timeouts[i] = window.setTimeout(function(){
          forwardScript();
        }, delay);
      }
      playAudio(true);
    })
  }

  function updateLocationMenu(){
    console.log("site id: "+siteID);
    for (var i in PointsofInterest.features){
      var poi = PointsofInterest.features[i];
      if (siteID===poi.properties.id){
        $("#locationMenu").append(
          '<li class='+poi.properties.classname+
          '><a href="#"><img src="'+poi.properties.icon.iconUrl+
          '"/> '+poi.properties.title+
          '</a></li>'
        );
        var coords = [poi.geometry.coordinates[1],poi.geometry.coordinates[0]];
        $("#locationMenu li."+poi.properties.classname).click(function(){
          map.setView(coords,zoomPOI);
        });
      }
    }
    if (siteID===4){
      $("#locationMenu").append(
        '<li class="all_locations"><a href="#"><img src="images/allLocations24.png"/> View All Locations</a></li>'
      );
      $("#locationMenu li.all_locations").click(function(){
        var boundslist = [];
        for (var lyr in POIlayers){
          boundslist.push(POIlayers[lyr].getBounds())
        }
        map.fitBounds(L.latLngBounds(boundslist));
        fixZoom();
      });
    }
  }

  /***RESPONSIVE***/
  var winDims = getWinDimensions();
  var aspectRatio = winDims[1]/winDims[0];
  var setting = winDims[1] > 640 ? "desktop" : "mobile";
  var zoomPOI = setting == "desktop" ? 18 : 19;
  var smallWindow = true;
  var adjustedBubble = false;
  var sid = 4;

  setLayout();
  $(window).on("resize", setLayout);
    
  //after splash pabe link clicked
  $("#splash a").click(function(){
    $("#container").css("visibility", "visible");
    $(".ontop").css("visibility", "visible");
    $("nav").css("visibility", "visible");
    $("#splash").hide(); //sets display property to none

    //user direction to click on play for mobile
    $('#playBubble').offset({top: 0, left: 10});
    $("#playBubble").animate({opacity: 1, top: winDims[0]-90, left: 10}, 1000);
    setting == "desktop" ? $('.audioText a').trigger('click') : null;
  });

  //desktop next step user direction bubble shown when text modal closes
  $(document).on('close.fndtn.reveal', '[data-reveal]', function (){ 
    //hide audio and set user prompt on first modal close if desktop
    if (setting == "desktop"){
      hideAudio();
      triggerIconBubble();
    };

    //after last slideshow closed, remove highlighted route
    sid += siteID===4 ? 1 : 0;
    if (sid===6){ highlightLayer ? map.removeLayer(highlightLayer) : null };
  });

  $("#container").click(function(){
    //mobile play direction bubble closed on next click after it is in place and next step direction bubble opened
    if (Math.round($('#playBubble').offset().top) === Math.round(winDims[0]-90)){
      $('#playBubble').fadeOut();
      triggerIconBubble();
    };
    $('.reveal-modal').foundation('reveal', 'close');
  });

  $(".leaflet-clickable").click(function(){
    if (Math.round($('#playBubble').offset().top) === Math.round(winDims[0]-90)){
      $('#playBubble').fadeOut();
      $('#iconClickBubble').fadeOut();
    };
  });

  function triggerIconBubble(){
    if ($('#iconClickBubble span').html().length < 1){
      //if statement ensures all of this only happens once
      $('#iconClickBubble span').html("When ready, click icon<br/>for site information");
      var iconOffset = $(".leaflet-marker-icon").offset();
      var bubbleWidth = $("#iconClickBubble").width();
      var bubbleHeight = $("#iconClickBubble").height();
      var topOffset = iconOffset.top-bubbleHeight-32;
      var leftOffset = iconOffset.left-bubbleWidth+28;
      $('#iconClickBubble').offset({top: 10, left: 10});
      $("#iconClickBubble").animate({opacity: 1, top: topOffset, left: leftOffset}, 1000);
      //events only get set once because of if statement
      $(window).click(function(){
        //next step direction bubble closed on next click after it is in place
        if (Math.round($('#iconClickBubble').offset().top) === Math.round(topOffset)){
          $('#iconClickBubble').fadeOut();
        };
      });
      $(".leaflet-clickable").click(function(){ $('#iconClickBubble').fadeOut() });
      map.on("move", function(){ adjustIconBubble() });
    };
  }

  function adjustIconBubble(){
    if ($('#iconClickBubble span').html().length > 1){
      var iconOffset = $(".leaflet-marker-icon").offset();
      var bubbleWidth = $("#iconClickBubble").width();
      var bubbleHeight = $("#iconClickBubble").height();
      var topOffset = iconOffset.top-bubbleHeight-32;
      var leftOffset = iconOffset.left-bubbleWidth+28;
      $('#iconClickBubble').offset({top: topOffset, left: leftOffset});

      if (adjustedBubble==false){ //only set event listener once
        $(window).click(function(){
            $('#iconClickBubble').fadeOut();
        });
      };
      adjustedBubble = true;
    }
  }

  function getWinDimensions(){
    return [$(window).height(), $(window).width()];
  }

  //the function that will handle the swiching
  function switchElements(width,height,screen,pos){
    if(setting == "desktop"){ 
      //@large screen
      //fit map bounds to route layer
      map.attributionControl.setPosition('bottomright');
      $("audio").prop('muted', true);
      $("audio").hide();
      $("#audioText").show();
      $('.leaflet-control-zoom').show();
      if ($('#readAloud').length == 0){
        $("#textModal div").append('<div id="readAloud"><a href="#"><div><img src="images/img/icon_26460/icon_26460.png" width="34" height="34" alt="Read Aloud"/><span>&nbsp;&nbsp;Read Text Aloud</span></div></a></div>');
        readAloud();
      };
      $('#playBubble').css({display: "none"});
      $(".leaflet-buttons-control-img").hide();
      orbitHeight();
    } else { 
      // @small screen
      map.attributionControl.setPosition('topright');
      $("audio").prop('muted', false);
      $("audio").show();
      $("#audioText").hide();
      $('.leaflet-control-zoom').hide();

      $('#playBubble span').html("Play Audio Here");
      var oheight = height-90;
      $('#playBubble').offset({top: oheight, left: 10});
      $(".leaflet-buttons-control-img").show();
    };
  };

  function setLayout() {
    winDims = getWinDimensions();
    var winHeight = winDims[0], winWidth = winDims[1];
    setting = winWidth > 640 ? "desktop" : "mobile";
    aspectRatio = winWidth/winHeight;
    zoomPOI = setting == "desktop" ? 18 : 19;
    switchElements(winWidth, winHeight);
    adjustIconBubble();
  };

  function fixZoom(){
    var z = map.getZoom()
    z = z > 19 ? 19 : z; //don't go beyond max zoom!
    map.setZoom(z);
  };

  $(".audioText").click(function(){
    $(".leaflet-control-attribution").css({
      position: 'absolute'
    });
  });

  $(".close-reveal-modal").click(function(){
    $(".leaflet-control-attribution").css({
      position: 'relative'
    });
  });

  /***MARKERS***/
  
  //this function adds custom icons to the map, drawing the path to the image from the geojson 
  function addMarkers(map, i, itype) {
    //select whether regular or highlighted marker
    itype = itype == "red" ? "icon_red_larger" : "icon_larger";
    
    POIlayer = L.geoJson(PointsofInterest.features[i], {
      pointToLayer: function(feature, latlng){
        return L.marker(latlng, {icon: L.icon(feature.properties[itype])}); //gray icon
      },
      
      onEachFeature: function (feature, layer){
        var imageSet = feature.properties.imageSet; // imageSet from PointsofIntest.js
        imageSets[feature.properties.id] = imageSet;

        layer.on("click", function() {
          highlightMarkers(feature);
          openInfoScreen(feature, imageSet);
        });  
      }
    }); 
    
    if (itype==="icon_larger"){
      POIlayers.push(POIlayer);
    } else {   
      if (POIlayer_red){
        map.removeLayer(POIlayer_red);
      }
      POIlayer_red = POIlayer;
    };
    map.addLayer(POIlayer);
  }

  function updateMarkers() {
    addMarkers(map, siteID, "gray"); //add the gray marker to the last feature
    addMarkers(map, siteID, "red"); //add red marker for the new feature
  }

  function highlightMarkers(feature) {
    currentFeature = feature.properties.id;
    addMarkers(map, currentFeature, "red"); //add red highlighted marker
  } 

  function openInfoScreen(feature, imageSet){
    console.log("openInfoScreen");
    // set show title
    showTitle.innerHTML = feature.properties.title;
    
    // set description texts for the first slide
    if(showText.innerHTML==''){
      showText.innerHTML = imageSet[0].image_texts;
    }
    
    // clear existing contents
    $("#imagesList").html("");
    
    // dynamically add images to imagesList
    for(var i = 0; i < imageSet.length; i++){
      
      // this is the <li> to hold a pair of historic/current images
      var li = document.createElement('li');
      li.setAttribute('data-orbit-slide','li_'+i);
      
      // this is the <div> in <li>
      var div = document.createElement('div');
      div.setAttribute('class', 'twentytwenty-container');
      
      // this is the <img> to hold historic image
      var imgHistorical = document.createElement('img');    
      if (setting == "desktop"){
        imgHistorical.setAttribute('src', imageSet[i].historic_large);
      } else {
        imgHistorical.setAttribute('src', imageSet[i].historic_small);
      }
      div.appendChild(imgHistorical);
      
      // this is the <img> to hold curent image
      var imgCurrent = document.createElement('img');
      if (setting == "desktop"){
        imgCurrent.setAttribute('src', imageSet[i].current_large);
      } else {
        imgCurrent.setAttribute('src', imageSet[i].current_small);
      }
      div.appendChild(imgCurrent);
      
      // this is the <div> to cotrol twenty-twenty overlay
      var divTwen = document.createElement('div');
      divTwen.setAttribute('class', 'twentytwenty-overlay');
      div.appendChild(divTwen);
      
      // add 'div' to 'li'
      li.appendChild(div);  
      
      // add 'li' to 'imagesList'
      showImagesList.appendChild(li);
    }
      
    // add the fourth slide
    if (siteID < 4){
      var li = document.createElement('li');
      li.setAttribute('data-orbit-slide','li_3');
      
      var div = document.createElement('div');
      div.setAttribute('class', 'ready_next');
      div.innerHTML = "<span class='ready_next_text'>I am ready to proceed to the next site.</span>";
      li.appendChild(div);
      showImagesList.appendChild(li); 
      
      //adding button functionality to the ready_next div: 
      div.addEventListener("click", function (){
        siteID++;
        currentFeature = siteID;
        updateLocationMenu();
        updateMarkers();
        updateRoute();
        highlightRoute();
        addScript();
        
        //close the slideshow
        $("#slideshowModal").foundation('reveal', 'close');
        //open next textModal or play next audio
        setting == "desktop" ? setTimeout(triggerTextModal, 1000) : setTimeout(playAudio, 1000);
      });
    };
 
    $('#closeSlideshow').html("&#215;"); //close button 
    $("#slideshowModal").foundation("reveal", "open");
  } //end "Open Info Screen" function

  $('#slideshowModal').on('opened', function () {
    //hack--requires manual activation to see first slide
    var firstSlide = $("#imagesList").find("li:first");
    firstSlide.attr("class","active");
    var ofSlides = $(".orbit-slide-number").find("span:last");
    var numberOfSlides = PointsofInterest.features[siteID].properties.imageSet.length;
    numberOfSlides += siteID === 4 ? 0 : 1;
    ofSlides.text(numberOfSlides);

    orbitHeight();

    $(".twentytwenty-container").twentytwenty(); //still not sure this always fires at right time
    //$(window).trigger('resize'); NOT SURE WHAT THIS WAS FOR
  });

  //make changes after each slide transition
  $("#slideshow_images").on("after-slide-change.fndtn.orbit", function(event, orbit) {
    imageSet = imageSets[currentFeature];
    // description texts change as slide goes
    if (orbit.slide_number < orbit.total_slides-1){ //if we're not on the final slide of current window
      showText.innerHTML = imageSet[orbit.slide_number].image_texts;  
    } else if (orbit.slide_number === orbit.total_slides-1){ //if we are on the final slide
      if (siteID === 4){
        showText.innerHTML = imageSet[orbit.slide_number].image_texts;
      } else if (siteID < 4){ //if we're not on the final slideshow, show this message
        showText.innerHTML = "After closing this slide show window, you will be guided by the highted route to the next site. If you want to explore more on this site, take the chance to navigate through images using previous or next buttons.";
      }
    }
  });

  function triggerTextModal(){
    $('.audioText a').trigger('click')
  }

  function orbitHeight(){
    //sets slideshow container dimensions on initiation or window resize
    if (setting == "desktop"){
      if (aspectRatio <= 1.5) {
        $(".orbit-container").height($(".twentytwenty-before").height());
        $('#slideshowModal').offset({top: 80})
      } else if (aspectRatio > 1.5 && aspectRatio <= 1.85){
        $(".orbit-container").height("32vw");
        $('#slideshowModal').offset({top: 70})
      } else if (aspectRatio > 1.85){
        $(".orbit-container").height("26vw");
        $('#slideshowModal').offset({top: 60})
      };
    } else {
      //$(".orbit-container").height($(".twentytwenty-before").height());
      $('#slideshowModal').offset({top: 0})
    }
  }
} //end of data callback

function loadmap(){
  map = L.map('map', { zoomControl:true});
  // tiles can change once we know our basemap 
  L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    minzoom: 5
  }).addTo(map);
      
  //addTileToggle();

  map.setView([43.076364, -89.384336], 14);

  var findMeOptions = {
      'iconUrl': './images/img/icon_12638/icon_12638_24r.png',  // string
      'onClick': my_button_onClick,  // callback function
      'hideText': true,  // bool
      'maxWidth': 30,  // number
      'doToggle': false,  // bool
      'toggleStatus': false  // bool
  }   

  var myButton = new L.Control.Button(findMeOptions).addTo(map);
}

function my_button_onClick() { //where is this accessed?
  console.log("find me clicked");
  GetLocation(map);
}

function addTileToggle() { //called at the end of loadmap function
  //could not get the default layer control to work. Substituted my own using the toggleTiles function. 
  //L.control.layers(baseMaps, null, {position: 'bottomleft', collapsed: false}).addTo(map);
	document.getElementById("tileToggle").addEventListener("click", toggleTiles);	
}

function toggleTiles(){
	if (currentTiles == 'modern'){
		console.log("switch to historic basemap"); 
		//this just adds the historic basemap on top of the existing tiles
		historicTileset.addTo(map);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Hide Historic Basemap</b>"; 
		//reset variable 
		currentTiles = 'historic';
	}
	else if (currentTiles == 'historic') {
		console.log("switch to modern basemap"); 
		//this removes the historic basemap tile layer 
		map.removeLayer (historicTileset);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Show Historic Basemap</b>"; 
		//reset variable 
		currentTiles = 'modern';
	}
}