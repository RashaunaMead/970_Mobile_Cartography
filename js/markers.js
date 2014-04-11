//this file created by Caroline. 

//orbit settings
$(document).foundation({
    orbit: {
        animation: 'slide',
        navigation_arrows: true,
        circular: false,
        timer: false,
		swipe: false,
        next_class: 'orbit-next',
        prev_class: 'orbit-prev',
		timer_show_progress_bar: false
    }
});	

//resize the pop-up modal window
$('.reveal-modal').on('opened', function () {

	$(".twentytwenty-container").twentytwenty();
	$(window).trigger('resize');  
});
	
//hide PREV BUTTON initially
$('.orbit-prev').hide();

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
				openInfoScreen (feature)
			});
			
		} //end onEachFeature
    }); 
	
	map.addLayer(POIlayer);
	
} //ends addMarkers function 


function openInfoScreen (feature){
	console.log("open info screen for ", feature.properties.title);
	
	var infoScreen = document.getElementById("slideshowModal");
	//infoScreen.style.visibility = "visible";
	document.getElementById("show_title").textContent = feature.properties.title;
	
	// set image text for the first slide
	if($("#slideshow_texts").innerHTML==null){
		$("#slideshow_texts").html(feature.properties.imageSet[0].image_texts);
	}

	//-------- make changes after each slide transition --------------
	$("#slideshow_images").on("after-slide-change.fndtn.orbit", function(event, orbit) {  

		// image text changes with slide
		$("#slideshow_texts").html(feature.properties.imageSet[orbit.slide_number].image_texts);

		// CLOSE BUTTON shows only on the last slide
		if(orbit.slide_number == orbit.total_slides - 1){
			$(".close-reveal-modal").html("&#215;");
		}
		else{
			$(".close-reveal-modal").html("");
		}

		// hide/show PREV/NEXT BUTTON
		$('.orbit-next').show();
		$('.orbit-prev').show();

		if(orbit.slide_number == 0){
			$('.orbit-prev').hide();
		}
		if(orbit.slide_number == orbit.total_slides - 1){
			$('.orbit-next').hide();
		}
	});
	
	$("#slideshowModal").foundation("reveal", "open");
	
	//for now, the div will disappear when you click on it. 
	//infoScreen.addEventListener("click", function(){
	//	infoScreen.style.visibility = "hidden";
	//);
	

}
