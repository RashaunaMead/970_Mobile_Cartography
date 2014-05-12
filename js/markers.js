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

var POIlayer;
var POIlayer_gray;
var POIlayer_red;
//this function adds custom icons to the map, drawing the path to the image from the geojson 
function addMarkers (map, i) {

	POIlayer = L.geoJson(PointsofInterest[0].features[i], {
        //some options
		pointToLayer: function(feature, latlng){
			if(!current[i]){
				return L.marker(latlng, {icon: L.icon(feature.properties.icon_larger)});
			}
			if(current[i]){
				return L.marker(latlng, {icon: L.icon(feature.properties.icon_red_larger)});
			}
			//return L.marker(latlng, {icon: L.icon(feature.properties.icon)});
		}, //end pointToLayer
		
		onEachFeature: function (feature, layer){

			//listener for click event 
			layer.on("click", function() {
				
				siteID = feature.properties.id;	
				
				viewed[siteID] = true;
				
				for(var j=0; j<current.length;j++){
					current[j]=false;
				}
				current[i]=true;
				
				highlightMarkers();
				openInfoScreen (feature);
				//siteID = feature.properties.id;
			});
			
		} //end onEachFeature
    }); 
	
	//map.addLayer(POIlayer);
	if(!current[i]){
		POIlayer_gray = POIlayer;
		map.addLayer(POIlayer_gray);
	}
	if(current[i]){		
		if(POIlayer_red){
			map.removeLayer(POIlayer_red);
		}
		POIlayer_red = POIlayer;
		map.addLayer(POIlayer_red);
	}
	
} //ends addMarkers function 

//this function updates markers on map 
function updateMarkers () {
	for(var i=0; i<viewed.length-1; i++)
	{
		if(viewed[i] && !viewed[i+1]){
           addMarkers(map, i+1);             
        }
	}
	
} //ends updateMarkers function 

//this function updates markers on map 
function highlightMarkers () {
	
	addMarkers(map, siteID); 
	
} //ends highlightMarkers function 

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
    
	// add the fourth slide
	if(siteID != 4){
		var li = document.createElement('li');
		
		// this is the <div> in <li>
		var div = document.createElement('div');
		div.setAttribute('class', 'ready_next');
		div.innerHTML = "<span class='ready_next_text'>I am ready to proceed to the next site.</span>";
		li.appendChild(div);
		showImagesList.appendChild(li);	
		
//adding button functionality to the ready_next div: 
		div.addEventListener("click", function () {		
			console.log("move on to next location markers");
			
			updateLocationMenu();
			updateMarkers();
			updateRoute();
			
			if(siteID==3)
			{		
				viewed[4]=true;
			}
    
			highlightRoute();
			addScript();
			
			//close the slideshow
			$("#slideshowModal").foundation('reveal', 'close');
			
			// start to play audio after 1 sec closing slide show
			setTimeout(playAudio, 1000);
			
			
		});
		//showText.innerHTML
	}
		
	//hide the timer
	$('.orbit-timer').hide();
	//show the close button
	$('#closeSlideshow').html("&#215;");
//	$('#closeSlideshow').hide();
	$('.orbit-next').show();
    $('.orbit-prev').show();
	
	//$("#slideshowModal").foundation("reveal", "open");

	
	//-------- make changes after each slide transition --------------
	$("#slideshow_images").on("after-slide-change.fndtn.orbit", function(event, orbit) {  

// I think the close button should always appear on the slideshow. 	
//		$('#closeSlideshow').hide();
/*		if(orbit.slide_number == orbit.total_slides - 1){
			$('#closeSlideshow').show();
		}
*/
		
		// description texts change as slide goes
		if(orbit.slide_number != orbit.total_slides - 1){
			//showText.innerHTML = null;
			showText.innerHTML = imageSet[orbit.slide_number].image_texts;	
		}else{
			showText.innerHTML = "After closing this slide show window, you will be guided by the highted route and audio recording to the next site. If you want to explore more on this site, take the chance to navigate through images using previous or next buttons.";
			
		}
		
	});
	
	$("#slideshowModal").foundation("reveal", "open");
} //end "Open Info Screen" function



//resize the pop-up modal window
$('#slideshowModal').on('opened', function () {

	$(".twentytwenty-container").twentytwenty();
	$(window).trigger('resize');

	$('.orbit-next').click();	
	setTimeout("$('.orbit-prev').click()",700);	
});

