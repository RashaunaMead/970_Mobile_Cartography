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
var smallWindow = true;

function setMap(mapSent){
	map = mapSent;
}

$(window).load(function() {

  var winHeight = $(window).height();
  var winWidth = $(window).width();
  //.leaflet-control-zoom.
  

  zoomLevel(winWidth);
//this will need to change to add the .ontop class or map div until splash has loded or closed
  switchElements(winWidth);
    $("#container").hide();
    $("nav").hide();
    $(".ontop").hide()
    $("audio").prop('muted', true);
    //after splash pabe link clicked
     $("#splash a").click(function(){
     $("#container").show();
     $("#splash").hide();
     $(".ontop").show();
     $("nav").show();
     //Moved to responsive function
     // $("audio").load();
     // $("audio").prop('muted', false);

     if(winWidth<=midBreakPoint){
     map.setView([43.076364, -89.384336], 14);
     }
     else{
       map.setView([43.076364, -89.384336], 13);
     }

 })

});

function responsiveDivs(){

}




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
    //map.setView([43.076364, -89.384336], 14);
      $("audio").prop('muted', true);
      $(".audioForText").remove();
      $(".smallPlayer").hide();
       $("#audioText").show();
       $('.leaflet-control-zoom').show();



    }
    else{
     map.attributionControl.setPosition('topright');
     //map.setView([43.076364, -89.384336], 13);

     // $(document).foundation('joyride', 'start');
      $("#audioText").hide();
      $(".audioForText").show();
        
      // do not allow player for desktop to work
      $("#playerDesktop").prop('muted', true);
      $("#playerDesktop").hide();
    
      $(".smallPlayer").prop('muted', false);
      $(".smallPlayer").show();
      //$("audio").load();
      //$(".smallPlayer").load();
      //$("audio").prop('muted', false);


        
      $('.leaflet-control-zoom').hide();
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

$("li.Railroad").click(function(){
  map.setView(POI.features.Railroad.geometry.coordinates,zoomPOI)
});

$("li.allLocations").click(function(){
  map.setView([ 43.078307,-89.377041],zoomPOI-3)
});


$(".audioForText").click(function(){
  $(".leaflet-control-attribution").css({
    position: 'absolute'
  });
});

$(".close-reveal-modal").click(function(){

  $(".leaflet-control-attribution").css({
    position: 'relative'
  });
});







