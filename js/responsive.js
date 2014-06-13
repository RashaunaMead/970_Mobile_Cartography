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
};

$(window).on("resize", setLayout);

$(window).load(function() {
  var winDims = setLayout();
  var clickcount = 0;
    
  //after splash pabe link clicked
  $("#splash a").click(function(){
    $("#container").css("visibility", "visible");
    $(".ontop").css("visibility", "visible");
    $("nav").css("visibility", "visible");
    $("#splash").hide(); //sets display property to none
    $('#helpBubble').offset({top: 0, left: 10});
    $("#helpBubble").animate({opacity: 1, top: winDims[0]-90, left: 10}, 1000);
    winDims[1] > midBreakPoint ? $('.audioText a').trigger('click') : null;
    $(window).click(function(){
      clickcount++;
      clickcount > 1 ? $('#helpBubble').fadeOut() : null;
    });
  })
});

function getWinDimensions(){
  return [$(window).height(), $(window).width()];
}

function setLayout() {
    var winDims = getWinDimensions();
    var winHeight = winDims[0], winWidth = winDims[1];
    zoomPOI = winWidth > midBreakPoint ? 18 : 19;
    switchElements(winWidth, winHeight);
    return winDims;
}

//the function that will handle the swiching
var switchElements = function (width,height,screen,pos){
  if(width > midBreakPoint){ //@large screen
    //map.setView([43.076364, -89.384336], 14);
    map.attributionControl.setPosition('bottomright');
    $("audio").prop('muted', true);
    $("audio").hide();
    $("#audioText").show();
    $('.leaflet-control-zoom').show();
    if ($('#readAloud').length == 0){
      $("#textModal div").append('<div id="readAloud"><a href="#"><div><img src="images/img/icon_26460/icon_26460.png" width="34" height="34" alt="Read Aloud"/><span>&nbsp;&nbsp;Read Text Aloud</span></div></a></div>');
    };
    $('#helpBubble').css({display: "none"});
  } else { //@small screen
    //map.setView([43.076364, -89.384336], 13);
    //$(document).foundation('joyride', 'start');

    map.attributionControl.setPosition('topright');
    $("audio").prop('muted', false);
    $("audio").show();
    $("#audioText").hide();
    $('.leaflet-control-zoom').hide();

    $('#helpBubble span').html("Play Audio Here");
    var oheight = height-60;
    $('#helpBubble').offset({top: height-90, left: 10});
  }
};


/* NAV BAR Locations change map zoom and center */
//this might need to be moved to a new js file for responsive zoom levels

// $("findMe").click(function(){
//       GetLocation(map);

// });


/*
$("li.candy ").click(function(){
  map.setView(POI.features.Candy_Factory.geometry.coordinates,zoomPOI)
});
*/

$("li.Shoe_Factory ").click(function(){
  map.setView(POI.features.Shoe_Factory.geometry.coordinates,zoomPOI)
});
/*
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
*/

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