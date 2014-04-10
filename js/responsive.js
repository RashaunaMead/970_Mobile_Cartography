//breaks in css
/* Small-range 0, 640px */
/* Medium-range 641px, 1024px */
/* Large-range 1025px, 1440px */
/* 1441px, 1920px */
/* 1921px */

// responsive js elements
var map;
// is set from main.js
var midBreakPoint =640;
var largeBreakPoint = 1024;
var zoomPOI = 18;

function setMap(mapSent){
	map = mapSent;
}

$(window).load(function() {

  var winHeight = $(window).height();
  var winWidth = $(window).width();

  zoomLevel(winWidth);
//this will need to change to add the .ontop class or map div until splash has loded or closed
  switchElements(winWidth);
    $("#container").hide();
   $(".ontop").hide()
   $("#splash a").click(function(){
     $("#container").show();
     $("#splash").hide();
    $(".ontop").show();
// This will need to change to device to be a clear fix
    if(winWidth<=midBreakPoint){
    map.setView([43.076364, -89.384336], 13);

      $(document).foundation('joyride', 'start');
    }
    else{
      map.setView([43.076364, -89.384336], 14);
    }

 })

});




var zoomLevel = function (width){
     if(width>midBreakPoint){
    zoomPOI = 18;
  }
  else{
    zoomPOI = 17;
  }
}
 
$(window).on("resize", methodToFixLayout);

function methodToFixLayout( e ) {
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    //console.log(winWidth);
    switchElements(winWidth);
    zoomLevel(winWidth);
    
}
//the function that will handle the swiching
var switchElements = function (width,height,screen,pos){
  // if it is larger than mid breakpoint
  if(width> midBreakPoint){
   map.attributionControl.setPosition('bottomright');
    }
    else{
   map.attributionControl.setPosition('topright');
    }

}


/* NAV BAR Locations change map zoom and center */
//this might need to be moved to a new js file for responsive zoom levels

$("li.findMe").click(function(){
      GetLocation(map);
});

$("li.candy ").click(function(){
  map.setView(POI.features.Candy_Factory.geometry.coordinates,zoomPOI)
});

$("li.Shoe_Factory ").click(function(){
  map.setView(POI.features.Shoe_Factory.geometry.coordinates,zoomPOI)
});

$("li.Wil_Mar").click(function(){
  map.setView(POI.features.Wil_Mar.geometry.coordinates,zoomPOI)
});

$("li.Power_Plant").click(function(){
  map.setView(POI.features.Power_Plant.geometry.coordinates,zoomPOI)
});

$("li.allLocations").click(function(){
  map.setView([ 43.078307,-89.377041],zoomPOI-3)
});
