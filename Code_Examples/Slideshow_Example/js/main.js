//============================ IMAGES METADATA: IMAGE CAPTIONS & IMAGE TEXTS===========================
var image1_caption = "IMAGE CAPTION 1";
var image1_texts = 'Its always great to learn more about the building that I have been living in for the last 5 years. As most of you already know the Badger State Shoe company was converted into an apartment complex in the late 80s and eventually became the Das Kronenberg condominium in 2004. While technically not a historic building in Madison it still serves as one of the landmarks of downtown Madison WI.';

var image2_caption = "IMAGE CAPTION 2";
var image2_texts = 'Badger State Shoe Factory building (ca. 1915) designed by Ferdinand Kronenberg in utilitarian-industrial style with neo-Classical motifs. Now "Das Kronenberg" apartments in Madison, Wisconsin. Added to the National Register of Historic Places in 1989.';

var image3_caption = "IMAGE CAPTION 3";
var image3_texts = "By about 1900 Madison leaders such as Reuben Gold Thwaites, a newspaperman and scholar, observed that the city had changed more in the last twenty years than in all the time between 1834 and 1880. <br>Between 1880 and 1900 the University of Wisconsin had become a leader in practical subjects such as agriculture, soil science, electrical engineering, and chemical engineering.  Manufacturing had made a good start.  Tourism was doing well.  Electric generating stations had made possible modern streetcars, better street lighting and cleaner power for stores and factories.  Financial institutions were sound. <br> The public schools were excellent; Madison voters had never turned down a school referendum. <br> Suburban expansion beyond the original city limits had begun on the east, south, and west sides of town. <br>The area between the eastern foot of Capitol hill and the Yahara River had become the location of three commercial and industrial sections with the potential for a fourth. <br>Tour One explores these sections which are:1-A The railroad yards and wholesale trading area south of East Washington Avenue between South Blair Street and Williamson Street and east to about Paterson Street. <br> 1-B The Fuller and Johnson factory complex north of East Washington Avenue east of North Dickinson Street to the Yahara River. <br>1-C The Northern Electrical Manufacturing area south of East Washington Avenue to Williamson Street and east of South Dickinson Street to the Yahara River. <br> 1-D A fourth section which pretty much remained the domain of bullfrogs and cattails until the 1910s and 1920s between Paterson Street and South Baldwin Street, mostly south of East Washington Avenue.";

var image_caps = [image1_caption, image2_caption, image3_caption];
var image_texts = [image1_texts, image2_texts, image3_texts];
//============================ END OF IMAGES METADATA =========================================

//----------- set image captions -----------------------------
$("#cap1").html("<p>" + image_caps[0] + "</p>");
$("#cap2").html("<p>" + image_caps[1] + "</p>");
$("#cap3").html("<p>" + image_caps[2] + "</p>");

//---------- orbit settings ----------------------------------
$(document).foundation({
    orbit: {
        animation: 'slide',
        navigation_arrows: true,
        circular: true,
        timer: false,
        next_class: 'orbit-next',
        prev_class: 'orbit-prev'
    }
});	

//---------- set image text for the first slide -----------------
$("#slideshow_texts").html("<p>" + image_texts[0] + "</p>");

//--------- resize the pop-up modal window-----------------------
$('.reveal-modal').on('opened', function () {
	    
    $(window).trigger('resize');  
});


//---------- hide PREV BUTTON initially---------------------------
$('.orbit-prev').hide();

//-------- make changes after each slide transition --------------
$("#slideshow_images").on("after-slide-change.fndtn.orbit", function(event, orbit) {  
  
    // image text changes with slide
    $("#slideshow_texts").html("<p>" + image_texts[orbit.slide_number] + "</p>");
    
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
        //$('.orbit-next').show();
        $('.orbit-prev').hide();
    }
    if(orbit.slide_number == orbit.total_slides - 1){
        $('.orbit-next').hide();
        //$('.orbit-prev').show();
    }
});