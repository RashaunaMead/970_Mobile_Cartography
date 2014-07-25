/***CLASS-LEVEL VARIABLES***/
var timeouts = [];
var map;
var siteID = 0; //latest site available to user
var currentFeature = 0; //feature currently highlighted
var imageSets = {};
var modernTileset = L.tileLayer('http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');
//var historicTiles = L.tileLayer ('https://a.tiles.mapbox.com/v3/carolinerose.71spds4i/{z}/{x}/{y}.png');
var currentTiles = 'modern';
var siteCoords = [];
var mapTileLayer;
var firstLocate = true;

window.onload = initialize();

function initialize(){
  cacheloading();
  loadmap(); //load the map

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
};

function callback(error, routes, PointsofInterest, alerts){
  var POIlayer;
  var POIlayers = [];
  var POIlayer_red;
  var highlightLayer, alertlayer;
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
  var winDims = getWinDimensions();
  var aspectRatio = winDims[1]/winDims[0];
  var setting = winDims[1] > 640 ? "desktop" : "mobile";
  var zoomPOI = setting == "desktop" ? 18 : 19;
  var adjustedBubble = false;
  var sid = 4;
  var s=0;

  /***INITIALIZE LAYOUT & FIRST SITE***/

  setLayout(); //adjust UI to screen size
  updateRoute(); //add initial route
  highlightRoute(); //highlight initial route
  updateMarkers(); //create initial site markers
  updateLocationMenu(); //add first site to locations menu

  //UI changes after splash page link clicked
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

  $(window).on("resize", setLayout); //respond to changes in window size

  /***USER PROMPTS***/

  $("#textModal").on('close.fndtn.reveal', function (){ 
    //set user prompt on first modal close if desktop
    if (setting == "desktop"){
      triggerIconBubble();
    };
  });

  $("#container").click(function(){
    //mobile play direction bubble closed on next click after it is in place and next step direction bubble opened
    if (Math.round($('#playBubble').offset().top) === Math.round(winDims[0]-90) && setting == "mobile"){
      $('#playBubble').fadeOut();
      triggerIconBubble();
    };
  });

  $("reveal-modal-bg").click(function(){
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
      
      var firstIcon = $(".leaflet-marker-pane").find("img:last");
      var iconOffset = firstIcon.offset();
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
  };

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
    };
  };

  /***NARRATION AUDIO***/

  function playAudio(isdesktop, site){ 
    $("audio").prop('autoplay', true);
    $("audio").attr('src', PointsofInterest.features[site].properties.audio);

    if (isdesktop){
      $("audio").prop('muted', false);
      $("audio").show();
    } 
  };

  function hideAudio(){
    $("audio").prop('muted', true);
    $("audio")[0].pause();
    $("audio").prop('autoplay', false);
    $("audio").hide();
  };

  function readAloud(){
    $("#readAloud").click(function(){
      updateScript(0, currentFeature);
      var scripts = PointsofInterest.features[currentFeature].properties.Scripts;

      var delay = 0;
      for (var i=0; i<scripts.length-1; i++){                      
        delay = delay + (scripts[i].length*68.2);
        timeouts[i] = window.setTimeout(function(){
          forwardScript(currentFeature);
        }, delay);
      }
      playAudio(true, currentFeature);
    })
  };

  /***NARRATION TEXT***/

  //add script and next/back buttons to textModal
  if (siteID===0){
    $('.script').html(PointsofInterest.features[0].properties.Scripts[0]);
    addScriptButtons(0);
  };

  function addScriptButtons(site){
    s = 0;
    $('.script').before("<div class='redButtonContainer scriptButtonContainer'><div class='redButton scriptButtons' id='next'><a href='#'><div>next ></div></a></div><div class='redButton scriptButtons' id='previous'><a href='#'><div>< previous</div></a></div></div>");

    $('#next').click(function(){
      for (var i in timeouts){
        window.clearTimeout(timeouts[i]);
      };
      forwardScript(site);
    });

    $('#previous').click(function(){
        s--;
        s = s == -1 ? PointsofInterest.features[site].properties.Scripts.length-1 : s;
        updateScript(s, site); 

        for (var i in timeouts){
          window.clearTimeout(timeouts[i]);
        };
    });
  };

  function forwardScript(site){
    s++;
    s = s == PointsofInterest.features[site].properties.Scripts.length ? 0 : s;
    updateScript(s, site);
  };

  function updateScript(scr, site){
    $('.script').html(PointsofInterest.features[site].properties.Scripts[scr]);
    if (site == 0 && $('#next').length === 0){ addScriptButtons(0); };
  };

  function addScript(){
    $('#next').remove();
    $('#previous').remove();
    $('.script').html(PointsofInterest.features[siteID].properties.Scripts[0])
  };

  /***ROUTES***/

  function updateRoute(){
    if (siteID < 5){
      var newroute = L.geoJson(routes.features[siteID], routeStyle).addTo(map); //visited style route underlays highlight

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
  };

  function highlightRoute() {
    if (highlightLayer){
        map.removeLayer(highlightLayer);
    }
    if (siteID < 5){
      highlightLayer = L.geoJson(routes.features[siteID], {style: highlightStyle}).addTo(map);
    }
  };

  /***LOCATION MENU***/

  function updateLocationMenu(){
    for (var i in PointsofInterest.features){
      var poi = PointsofInterest.features[i];
      if (siteID===poi.properties.id){
        console.log(poi);
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

        siteCoords.push(coords);
        if (siteCoords.length > 1){
          var i = siteCoords.length-1;
          var coordLats = [siteCoords[i-1][0], siteCoords[i][0]], 
          coordLons = [siteCoords[i-1][1], siteCoords[i][1]];
        } else {
          var coordLats = [43.0749355058668, siteCoords[0][0]], 
          coordLons = [-89.39899991725407, siteCoords[0][1]];
        };

        coordLats.sort(function(a, b){return a-b});
        coordLons.sort(function(a, b){return a-b});

        var bounds = L.latLngBounds([coordLats[0], coordLons[0]], [coordLats[1], coordLons[1]]);
        map.fitBounds(bounds);
      };
    };

    if (siteID===4){
      $("#locationMenu").append(
        '<li class="all_locations"><a href="#"><img src="images/allLocations24.png"/> View All Locations</a></li>'
      );
      $("#locationMenu li.all_locations").click(function(){
        var boundslist = [];
        for (var lyr in POIlayers){
          boundslist.push(POIlayers[lyr].getBounds());
        };
        map.fitBounds(L.latLngBounds(boundslist));
      });
    };
  };

  /***MARKERS***/

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
  };

  function updateMarkers() {
    addMarkers(map, siteID, "gray"); //add the gray marker to the last feature
    addMarkers(map, siteID, "red"); //add red marker for the new feature
  };

  function highlightMarkers(feature) {
    currentFeature = feature.properties.id;
    updateScript(0, currentFeature);
    addMarkers(map, currentFeature, "red"); //add red highlighted marker
  };

  /***SLIDESHOW***/

  function openInfoScreen(feature, imageSet){
    $("#show_title").html(feature.properties.title);
    
    // set description texts for the first slide
    if ($("#slideshow_texts").html().length < 1){
      $("#slideshow_texts").html(imageSet[0].image_texts);
    };
    
    // clear existing contents
    $("#imagesList").html("");

    var showImagesList = document.getElementById("imagesList");
    
    // dynamically add images to imagesList
    for(var i = 0; i < imageSet.length; i++){
      //orbit slide container
      var li = document.createElement('li');
      li.setAttribute('data-orbit-slide','li_'+i);
      li.setAttribute('id','li_'+i);
      
      //twentytwenty container
      var div = document.createElement('div');
      div.setAttribute('class', 'twentytwenty-container');

      //historic image
      var imgHistorical = document.createElement('img');    
      var histImg = setting == "desktop" ? "historic_large" : "historic_small";
      imgHistorical.setAttribute('onerror', 'imgError(this, "'+imageSet[i]["historic_small"]+'")');
      imgHistorical.setAttribute('src', imageSet[i][histImg]);
      div.appendChild(imgHistorical);
      
      //current image
      var imgCurrent = document.createElement('img');
      var currentImg = setting == "desktop" ? "current_large" : "current_small";
      imgCurrent.setAttribute('onerror', 'imgError(this, "'+imageSet[i]["current_small"]+'")');
      imgCurrent.setAttribute('src', imageSet[i][currentImg]);
      div.appendChild(imgCurrent);

      li.appendChild(div);  
      showImagesList.appendChild(li);
    };
      
    //add the next feature button slide
    if (siteID < 4){
      var li = document.createElement('li');
      li.setAttribute('data-orbit-slide','li_3');
      
      var div = document.createElement('div');
      div.setAttribute('class', 'ready_next');
      div.innerHTML = "<span class='ready_next_text'>I am ready to proceed to the next site</span>";
      li.appendChild(div);
      showImagesList.appendChild(li); 
      
      //add button functionality
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
        setting == "desktop" ? setTimeout(triggerTextModal, 1000) : setTimeout(function(){
          playAudio(true, siteID) }, 1000);
      });
    } else {
      //final note for the last site
      var li = document.createElement('li');
      li.setAttribute('data-orbit-slide','li_2');

      var div = document.createElement('div');
      div.setAttribute('class', 'lastSlide');
      div.innerHTML = "<span>This is a final note about the assignment. It is a very informative note. You will be quite edified after reading it, I promise.</span>"
      li.appendChild(div);
      showImagesList.appendChild(li);
    };
 
    $('#closeSlideshow').html("&#215;"); //close button 
    $("#slideshowModal").foundation("reveal", "open");
  }; //end openInfoScreen()

  function triggerTextModal(){
    hideAudio(); //cancel any audio playing from previous site
    $('.audioText a').trigger('click');
  };

  function orbitHeight(){
    var imageSize;

    //sets slideshow container dimensions on initiation or window resize
    if (setting == "desktop"){
      if (aspectRatio <= 1.5) {

        $(".orbit-container").height("38vw");
        $('#slideshowModal').offset({top: 80})
      } else if (aspectRatio > 1.5 && aspectRatio <= 1.85){
        $(".orbit-container").height("32vw");
        $('#slideshowModal').offset({top: 70})
      } else if (aspectRatio > 1.85){
        $(".orbit-container").height("26vw");
        $('#slideshowModal').offset({top: 60})
      };
      imageSize = "large";
    } else {
      $(".orbit-container").height("44vw");
      $('#slideshowModal').offset({top: 0})
      imageSize = "small";
    };

    //change the image sizes if screen size jumps breakpoint
    if (imageSets[currentFeature]){
      var imageSet = imageSets[currentFeature];
      for (var i=0; i<imageSet.length; i++){
        if ($("#li_"+i+" .twentytwenty-before").attr("src")!=imageSet[i]["historic_"+imageSize]){
          $("#li_"+i+" .twentytwenty-before").attr("src", imageSet[i]["historic_"+imageSize]);
          $("#li_"+i+" .twentytwenty-after").attr("src", imageSet[i]["current_"+imageSize]);
        };
      };
    };
  };

  $('#slideshowModal').on('open.fndtn.reveal', function (){
    $(".leaflet-buttons-control-img").hide(); //hide findme button
    var imageSet = imageSets[currentFeature];
    $("#slideshow_texts").html(imageSet[0].image_texts);
  });

  $('#slideshowModal').on('opened.fndtn.reveal', function (){
    //hack--requires manual activation to see first slide
    var firstSlide = $("#imagesList").find("li:first");
    firstSlide.attr("class","active");
    var ofSlides = $(".orbit-slide-number").find("span:last");
    var numberOfSlides = PointsofInterest.features[siteID].properties.imageSet.length + 1;
    ofSlides.text(numberOfSlides);

    orbitHeight();

    $(".twentytwenty-container").twentytwenty(); //still not sure this always fires at right time
  });

  $('#slideshowModal').on('close.fndtn.reveal', function (){
    if (setting == "mobile"){
      $(".leaflet-buttons-control-img").show(); //show findme button
    };

    //when last slideshow closes, remove highlighted route
    sid += siteID===4 ? 1 : 0;
    if (sid===6){ highlightLayer ? map.removeLayer(highlightLayer) : null };
  });

  //make changes after each slide transition
  $("#slideshow_images").on("after-slide-change.fndtn.orbit", function(event, orbit) {
    imageSet = imageSets[currentFeature];
    // description texts change as slide goes
    if (orbit.slide_number < orbit.total_slides-1){ //if we're not on the final slide of current window
      $("#slideshow_texts").html(imageSet[orbit.slide_number].image_texts);
      if (siteID === 4){ $(".orbit-slide-number").css("opacity",1); };
    } else if (orbit.slide_number === orbit.total_slides-1){ //if we are on the final slide
      if (siteID === 4){
        $("#slideshow_texts").html("");
        $(".orbit-slide-number").css("opacity",0);
      } else if (siteID < 4){ //if we're not on the final slideshow, show this message
        $("#slideshow_texts").html("After closing this slide show window, you will be guided by the highted route to the next site. If you want to explore more on this site, take the chance to navigate through images using previous or next buttons.");
      }
    }
  });

  $("#infoModal").on("open.fndtn.reveal", function(){
    if (setting == "desktop"){ resizeModal($(this)); };
  });

  /***RESPONSIVE LAYOUT***/

  function getWinDimensions(){
    return [$(window).height(), $(window).width()];
  };

  function setLayout() {
    winDims = getWinDimensions();
    var cHeight = winDims[0], winWidth = winDims[1];
    setting = winWidth > 640 ? "desktop" : "mobile";
    aspectRatio = winWidth/cHeight;
    zoomPOI = setting == "desktop" ? 18 : 19;
    switchElements(winWidth, cHeight);
    adjustIconBubble();
  };

  function switchElements(width,height,screen,pos){
    if(setting == "desktop"){ 
      //@large screen
      map.attributionControl.setPosition('bottomright');
      $("audio").prop('muted', true);
      $("audio").hide();
      $("#audioText").show();
      $('.leaflet-control-zoom').show();
      if ($('#readAloud').length === 0){
        $("#textModal").append('<div id="readAloud" class="redButton"><a href="#"><div><img src="images/headphones.png" alt="Read Aloud"/><span>&nbsp;&nbsp;Read Text Aloud</span></div></a></div>');
        readAloud();
      };
      $('#playBubble').css({display: "none"});
      $(".leaflet-buttons-control-img").hide();
      $("body").css("overflow","hidden");
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
      $("body").css("overflow","auto");
    };
    orbitHeight();
  };
}; //end of data callback

function cacheloading(){
  //remove loading icon when appcache is finished loading
  var timeout = window.setTimeout(cacheloaded, 2000);
  $(window.applicationCache).on("cached", function(){
    window.clearTimeout(timeout);
    cacheloaded();
  });
  //workaround for Firefox failing to fire cached event
  $(window.applicationCache).on("progress", function(){
    window.clearTimeout(timeout);
    timeout = window.setTimeout(cacheloaded, 2000);
  });
  $(window.applicationCache).on("error", function(){
    window.clearTimeout(timeout);
    cacheerror();
  });
};

function cacheloaded(){
  $("#loading img").attr("src","images/globe.png");
  $("#loading span").attr("id","loaded");
  $("#loading span").text('You may now use this application offline. Without an internet connection, your map range will be more limited, but adequate for module use.');
};

function cacheerror(){
  $("#loading img").attr("src","images/globeerror.png");
  $("#loading span").attr("id","error");
  $("#loading span").text('There was a problem loading the offline cache. If you might lose internet connection while using this application, please hit your browser\'s "reload" button now.');
};

function loadmap(){
  map = L.map('map', { 
    zoomControl: true,
    maxZoom: 18,
    minZoom: 14,
    maxBounds: [
      [43.0371,-89.452674],
      [43.129626,-89.306419]
    ],
    center: [43.076364, -89.384336],
    zoom: 14
  });
  // tiles can change once we know our basemap 
  mapTileLayer = L.tileLayer('http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
  }).addTo(map);
      
  //addTileToggle();

  var findMeOptions = {
      'iconUrl': './images/findme.png',  // string
      'onClick': my_button_onClick,  // callback function
      'hideText': true,  // bool
      'maxWidth': 30,  // number
      'doToggle': false,  // bool
      'toggleStatus': false  // bool
  };  

  var myButton = new L.Control.Button(findMeOptions).addTo(map);
};

function my_button_onClick() { //where is this accessed?
  getLocation(map);
};

function addTileToggle() { //called at the end of loadmap function
  //could not get the default layer control to work. Substituted my own using the toggleTiles function. 
  //L.control.layers(baseMaps, null, {position: 'bottomleft', collapsed: false}).addTo(map);
	document.getElementById("tileToggle").addEventListener("click", toggleTiles);	
};

function toggleTiles(){
	if (currentTiles == 'modern'){
		console.log("switch to historic basemap"); 
		//this just adds the historic basemap on top of the existing tiles
		historicTileset.addTo(map);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Hide Historic Basemap</b>"; 
		//reset variable 
		currentTiles = 'historic';
	} else if (currentTiles == 'historic') {
		console.log("switch to modern basemap"); 
		//this removes the historic basemap tile layer 
		map.removeLayer (historicTileset);
		//change the button text
		document.getElementById("tileToggle").innerHTML = "<b>Show Historic Basemap</b>"; 
		//reset variable 
		currentTiles = 'modern';
	};
};

function imgError(image, alturl){
  //fall back to small slideshow images if offline
  image.src = alturl;
};

function resizeModal(modal){
  var cHeight = $("#container").height();
  var rmTop = parseInt(modal.css("top"));
  var rmHeight = modal.height();
  if (rmHeight > cHeight){
    modal.height(cHeight - (rmTop * 2));
  };
};

function getLocation(map){
  map.locate({setView:false, watch:true, enableHighAccuracy: true} );

  function onLocationFound(e){
    var radius = e.accuracy / 2;

    // removes marker and circle before adding a new one
    if(firstLocate===false){
      map.removeLayer(circle);
      map.removeLayer(locationMarker);
    };

    //adds location and accuracy information to the map
    if(e.accuracy<90){
      circle = L.circle(e.latlng, radius).addTo(map);
      locationMarker = L.marker(e.latlng).addTo(map).bindPopup("You are within " + Math.round(radius) + " meters of this point");
      firstLocate = false;
    };

    //if accuracy is less than 60m then stop calling locate function
    if(e.accuracy<40){
      var count = 0;
      console.log("accuracy is less than 30m" + count);
      map.stopLocate();
      count++;
    };

    var cZoom = map.getZoom();
    map.setView(e.latlng, cZoom);
    removeFoundMarker(circle, locationMarker);
  };

  map.on('locationfound', onLocationFound);
};

function removeFoundMarker(circle, marker){
  setTimeout(function() {
    map.removeLayer(circle);
    map.removeLayer(marker);
  }, 10000);
};