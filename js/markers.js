//this file created by Caroline. 

// keep track of which site are they working on
var siteID;

//===============some elements in the images slideshow window=============//
// this is the modal window holding images slideshow
var slideshowModal = document.getElementById("slideshowModal");
// title for this set of images slideshow
var showTitle = document.getElementById("show_title"); 
// description texts for the images
var showText = document.getElementById("slideshow_texts");
// this is the <ul> imagesList holding images
var showImagesList = document.getElementById("imagesList");

// current window width, height
var cwinWidth = $(window).width();
var cwinHeight = $(window).height();

$(window).on("resize", function(){
	cwinWidth = $(window).width();
	cwinHeight = $(window).height();
});

//this function adds custom icons to the map, drawing the path to the image from the geojson 
function addMarkers (map) {

	var POIlayer = L.geoJson(PointsofInterest, {
        //some options
		pointToLayer: function(feature, latlng){
			return L.marker(latlng, {icon: L.icon(feature.properties.icon)});
		}, //end pointToLayer
		
		onEachFeature: function (feature, layer){

			//listener for click event 
			layer.on("click", function() {
				openInfoScreen (feature);
				siteID = feature.properties.id;
			});
			
		} //end onEachFeature
    }); 
	
	map.addLayer(POIlayer);
	
} //ends addMarkers function 


function openInfoScreen (feature){
	console.log("open info screen for ", feature.properties.title);
	
	// set show title
	showTitle.innerHTML = feature.properties.title;
	
	// imageSet from PointsofIntest.js
	var imageSet = feature.properties.imageSet;
	
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
    	
	//hide the timer
	$('.orbit-timer').hide();
	//show the close button
	$('#closeSlideshow').html("&#215;");
	$('.orbit-next').show();
    $('.orbit-prev').show();
	
	//$("#slideshowModal").foundation("reveal", "open");

	
	//-------- make changes after each slide transition --------------
	$("#slideshow_images").on("after-slide-change.fndtn.orbit", function(event, orbit) {  

		// description texts change as slide goes
		showText.innerHTML = imageSet[orbit.slide_number].image_texts;		
	});
	
	$("#slideshowModal").foundation("reveal", "open");
}



//resize the pop-up modal window
$('#slideshowModal').on('opened', function () {

	$(".twentytwenty-container").twentytwenty();
	$(window).trigger('resize');

	$('.orbit-next').click();	
	setTimeout("$('.orbit-prev').click()",700);	
});

