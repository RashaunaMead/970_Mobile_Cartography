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

function setMap(mapSent){
	map = mapSent;
}

$(window).load(function() {
  var winHeight = $(window).height();
  var winWidth = $(window).width();

  switchElements(winWidth);
  $("#map").hide();
  $("#splash a").click(function(){
    $("#map").show();
    $("#splash").hide();
  })

});
 
$(window).on("resize", methodToFixLayout);

function methodToFixLayout( e ) {
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    //console.log(winWidth);
    switchElements(winWidth);
    
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
