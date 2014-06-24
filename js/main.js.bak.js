/***CLASS-LEVEL VARIABLES***/
var viewed = [true, false, false, false, false]; //keep track of which sites were viewed (REPLACE WITH SITEID)
var timeouts = [];
var map;
var currentTiles = 'modern';
//var historicTiles = L.tileLayer ('https://{s}.tiles.mapbox.com/v3/carolinerose.71spds4i/{z}/{x}/{y}.png');
var modernTileset = L.tileLayer ('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');

window.onload = initialize();

function initialize(){
  loadmap(); //load the map

  //use queue.js to parallelize asynchronous data loading for cpu efficiency
  queue()
    .defer(d3.json, "data/routes.geojson")
    .defer(d3.json, "data/PointsofInterest.geojson")
    .defer(d3.json, "data/POIzoom.geojson")
    .await(callback);
}

function callback(error, routes, PointsofInterest, POI){
  addMarkers(map, 0); //function defined in markers.js

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
    "color": "#E2788B",
    "weight": 5,
    "opacity": 0.7
  };

  var highlightStyle = {
      "color": "#C41E3A",
      "weight": 5,
      "opacity": 1
  };

  //add initial route and recenter map on it
  var initrouteLayer = L.geoJson(routes.features[0], routeStyle).addTo(map);
  map.fitBounds(L.latLngBounds(initrouteLayer.getBounds().getSouthWest(),initrouteLayer.getBounds().getNorthEast()));
  var z = map.getZoom() > 18 ? 18 : map.getZoom(); //don't go beyond max zoom!
  map.setZoom(z);
  
  //highlight initial route
  var highlightLayer = L.geoJson(routes.features[0], highlightStyle).addTo(map);

  function updateRoute(){
    if (siteID < 5){
      var newroute = L.geoJson(routes.features[siteID], routeStyle).addTo(map); //visited style route underlays highlight
      map.fitBounds(L.latLngBounds(newroute.getBounds().getSouthWest(),newroute.getBounds().getNorthEast()));
      var z = map.getZoom() > 18 ? 18 : map.getZoom(); //don't go beyond max zoom!
      map.setZoom(z);
    }
  }

  function highlightRoute() {
    if(highlightLayer){
        map.removeLayer(highlightLayer);
    }
    if(siteID < 5){
      highlightLayer = L.geoJson(routes.features[siteID], {style: highlightStyle}).addTo(map);
    }
  }

  /***AUDIO***/
  function playAudio(isdesktop){  
    //var winHeight = $(window).height();
    //var winWidth = $(window).width();
    console.log('playAudio site '+siteID);

    $("audio").prop('autoplay', true);
    $("audio").attr('src', PointsofInterest.features[siteID].properties.audio);

    if (isdesktop){
      $("audio").prop('muted', false);
      $("audio").show();
      $("#textModal .close-reveal-modal").click(function(){ hideAudio() });
    } 
  }

  function hideAudio(){
    $("audio").prop('muted', true);
    $("audio").prop('autoplay', false);
    $("audio").hide();
  }

  function readAloud(){
    $("#readAloud").click(function(){
      console.log("clicked");
      i = 0;
      updateScript(i);
      //start audio
      //start timer

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
    var locationMenu = document.getElementById('locationMenu');
    
    // show site in location menu after the site was explored
    for(var i=0; i<viewed.length-1; i++){
      if(viewed[i] && !viewed[i+1]){
        if(i==0 && document.getElementsByClassName('Railroad').length==0){
          var locationLi = document.createElement('li');
          locationLi.setAttribute('class', 'Railroad');
          locationLi.innerHTML = '<a href="#"><img src="images/transportation24design1.png"  alt="Locations"/> Railroad Station</a>';
          locationMenu.appendChild(locationLi);
          $("li.Railroad").click(function(){
            map.setView(POI.features.Railroad.geometry.coordinates,zoomPOI)
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

  /***RESPONSIVE***/
  var midBreakPoint =640;
  var largeBreakPoint = 1024;
  var zoomPOI = 18;
  var smallWindow = true;
  var winDims = setLayout();
  var adjustedBubble = false;

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
    winDims[1] > midBreakPoint ? $('.audioText a').trigger('click') : null;
  });

  //desktop next step user direction bubble shown when text modal closes
  $(document).on('close.fndtn.reveal', '[data-reveal]', function (){ 
    triggerIconBubble();
    console.log("reveal close--siteID=="+siteID);
    //after last slideshow closed, remove highlighted route
    if (siteID===4 || siteID===5){
      siteID++
    } else if (siteID===6){
      if (highlightLayer){
        map.removeLayer(highlightLayer);
      }
    }
  });

  $(window).click(function(){
    //mobile play direction bubble closed on next click after it is in place and next step direction bubble opened
    if (Math.round($('#playBubble').offset().top) === Math.round(winDims[0]-90)){
      $('#playBubble').fadeOut();
      triggerIconBubble();
    };
  });

  function triggerIconBubble(){
    if ($('#iconClickBubble span').html().length < 1){
      $('#iconClickBubble span').html("When ready, click icon<br/>for site information");
      var iconOffset = $(".leaflet-marker-icon").offset();
      var bubbleWidth = $("#iconClickBubble").width();
      var bubbleHeight = $("#iconClickBubble").height();
      var topOffset = iconOffset.top-bubbleHeight-32;
      var leftOffset = iconOffset.left-bubbleWidth+28;
      $('#iconClickBubble').offset({top: 10, left: 10});
      $("#iconClickBubble").animate({opacity: 1, top: topOffset, left: leftOffset}, 1000);

      $(window).click(function(){
        //next step direction bubble closed on next click after it is in place
        if (Math.round($('#iconClickBubble').offset().top) === Math.round(topOffset)){
          $('#iconClickBubble').fadeOut();
        };
      });
      $(".leaflet-clickable").click(function(){ $('#iconClickBubble').fadeOut() });
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

      if (adjustedBubble==false){
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
    if(width > midBreakPoint){ 
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
    };
    adjustIconBubble();
  };

  function setLayout() {
      var winDims = getWinDimensions();
      var winHeight = winDims[0], winWidth = winDims[1];
      zoomPOI = winWidth > midBreakPoint ? 18 : 19;
      switchElements(winWidth, winHeight);
      return winDims;
  }

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

  /***MARKERS--NEEDS ORGANIZING***/
  var POIlayer;
  var POIlayer_gray = [];
  var POIlayer_red;
  //this function adds custom icons to the map, drawing the path to the image from the geojson 
  function addMarkers (map, i) {
    console.log("marker index: "+i);
    POIlayer = L.geoJson(PointsofInterest.features[i], {
          //some options
      pointToLayer: function(feature, latlng){
        //in each clause, first case is for updateMarkers, second case is for highlightMarkers
        if ((i!==siteID && i!==currentFeature) || (i===siteID && i!==currentFeature)){
          return L.marker(latlng, {icon: L.icon(feature.properties.icon_larger)}); //gray icon
        } else if ((i===siteID && i===currentFeature) || (i!==siteID && i===currentFeature)){
          return L.marker(latlng, {icon: L.icon(feature.properties.icon_red_larger)}); //red icon
        }
      }, //end pointToLayer
      
      onEachFeature: function (feature, layer){
        var imageSet = feature.properties.imageSet; // imageSet from PointsofIntest.js
        imageSets[feature.properties.id] = imageSet;

        //listener for click event 
        layer.on("click", function() {    
          viewed[siteID] = true;
          
          highlightMarkers(feature);
          openInfoScreen(feature, imageSet);
          //siteID = feature.properties.id;
        });
        
      } //end onEachFeature
      }); 
    
    if((i!==siteID && i!==currentFeature) || (i===siteID && i!==currentFeature)){
      console.log(POIlayer_gray.indexOf(POIlayer));
      POIlayer_gray.push(POIlayer);
      map.addLayer(POIlayer);
    } else if ((i===siteID && i===currentFeature) || (i!==siteID && i===currentFeature)){   
      if (POIlayer_red){
        map.removeLayer(POIlayer_red);
      }
      POIlayer_red = POIlayer;
      map.addLayer(POIlayer_red);
    }
    
  } //ends addMarkers function 

  function updateMarkers () {
    addMarkers(map, siteID-1); //add the gray marker to the last feature
      addMarkers(map, siteID); //add red marker for the new feature
  }

  function highlightMarkers(feature) {
    currentFeature = feature.properties.id;
    addMarkers(map, siteID); //add gray site marker
    addMarkers(map, currentFeature); //add red highlighted marker
  } 

  function openInfoScreen(feature, imageSet){
    console.log("open info screen for ", feature.properties.title);
    
    // set show title
    showTitle.innerHTML = feature.properties.title;
    
    // set description texts for the first slide
    if(showText.innerHTML==''){
      showText.innerHTML = imageSet[0].image_texts;
    }
    
    // clear existing contents
    showImagesList.innerHTML = '';
    
    // dynamically add images to imagesList
    for(var i = 0; i < imageSet.length; i++){
      
      // this is the <li> to hold a pair of historic/current images
      var li = document.createElement('li');
      
      // this is the <div> in <li>
      var div = document.createElement('div');
      div.setAttribute('class', 'twentytwenty-container');
      
      // this is the <img> to hold historic image
      var imgHistorical = document.createElement('img');    
      if(cwinWidth > midBreakPoint){
        imgHistorical.setAttribute('src', imageSet[i].historic_large);
      }else
      {
        imgHistorical.setAttribute('src', imageSet[i].historic_small);
      }
      div.appendChild(imgHistorical);
      
      // this is the <img> to hold curent image
      var imgCurrent = document.createElement('img');
      if(cwinWidth > midBreakPoint){
        imgCurrent.setAttribute('src', imageSet[i].current_large);
      }else
      {
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
      
      // this is the <div> in <li>
      var div = document.createElement('div');
      div.setAttribute('class', 'ready_next');
      div.innerHTML = "<span class='ready_next_text'>I am ready to proceed to the next site.</span>";
      li.appendChild(div);
      showImagesList.appendChild(li); 
      
  //adding button functionality to the ready_next div: 
      div.addEventListener("click", function () {
        //for ready_next div class  
        siteID++;
        currentFeature = siteID;
        
        updateLocationMenu();
        updateMarkers();
        updateRoute();
        
        if(siteID==3) { viewed[4]=true }; //why is this here?
      
        highlightRoute();
        addScript();
        
        //close the slideshow
        $("#slideshowModal").foundation('reveal', 'close');
        
        //open textModal for desktop version
        if (getWinDimensions()[1]>midBreakPoint){
            setTimeout(triggerTextModal, 1000);
        } else {
          // start to play audio 2 secs after closing slide show
          setTimeout(playAudio, 1000);
        }
      });
    }
      
    //hide the timer
    $('.orbit-timer').hide();
    //show the close button
    $('#closeSlideshow').html("&#215;");
  //  $('#closeSlideshow').hide();
    $('.orbit-next').show();
      $('.orbit-prev').show();
    
    $("#slideshowModal").foundation("reveal", "open");
  } //end "Open Info Screen" function

  //-------- make changes after each slide transition --------------
  $("#slideshow_images").on("after-slide-change.fndtn.orbit", function(event, orbit) {
    imageSet = imageSets[currentFeature];
    // description texts change as slide goes
    if (orbit.slide_number < orbit.total_slides-1){ //if we're not on the final slide of current window
      showText.innerHTML = imageSet[orbit.slide_number].image_texts;  
    } else if (orbit.slide_number === orbit.total_slides-1){ //if we are on the final slide
      if (siteID === 4){
        showText.innerHTML = imageSet[orbit.slide_number].image_texts;
      } else if (siteID < 4){ //if we're not on the final slideshow, show this message
        showText.innerHTML = "After closing this slide show window, you will be guided by the highted route and audio recording to the next site. If you want to explore more on this site, take the chance to navigate through images using previous or next buttons.";
      }
    }
  });

  function triggerTextModal(){
    $('.audioText a').trigger('click')
  }

  //resize the pop-up modal window
  $('#slideshowModal').on('opened', function () {

    $(".twentytwenty-container").twentytwenty();
    $(window).trigger('resize');

    $('.orbit-next').click(); 
    setTimeout("$('.orbit-prev').click()",700); 
  });
} //end of callback

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