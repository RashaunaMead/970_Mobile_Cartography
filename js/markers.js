var siteID = 0, //latest site available to user
	currentFeature = 0; //feature currently highlighted

var imageSets = {};

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

var POIlayer;
var POIlayer_gray = [];
var POIlayer_red;
//this function adds custom icons to the map, drawing the path to the image from the geojson 
function addMarkers (map, i) {
	console.log("marker index: "+i);
	POIlayer = L.geoJson(PointsofInterest[0].features[i], {
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
			console.log("move on to next location markers");
			siteID++;
			currentFeature = siteID;
			
			updateLocationMenu();
			updateMarkers();
			updateRoute();
			
			if(siteID==3) {	viewed[4]=true }; //why is this here?
    
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
//	$('#closeSlideshow').hide();
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
			console.log("orbit.slide_number: "+orbit.slide_number+", orbit.total_slides: "+orbit.total_slides);
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

