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



