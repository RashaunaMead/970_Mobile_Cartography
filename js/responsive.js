// responsive js elements
var map;
// is set from main.js
var midBreakPoint =600;
function setMap(mapSent){
	map = mapSent;
	console.log("got map");
}

$(window).load(function() {
      if (screen.width < midBreakPoint) {
      console.log("more than 600 start");
    }
     if (screen.width < midBreakPoint) {
      console.log("less than 600 start");
    }
});
 
$(window).on("resize", methodToFixLayout);

function methodToFixLayout( e ) {
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    //console.log(winWidth);
    
    if(winWidth> midBreakPoint){
	 map.attributionControl.setPosition('bottomright');
    }
    else{
	 map.attributionControl.setPosition('topright');
    }
}