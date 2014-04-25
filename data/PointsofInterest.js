var PointsofInterest = [{
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                                                                              
"features": [
//Fifth POI: Candy Company/Coffee Shop 
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.371953550849724, 43.07805483986813 ] 
	}, 
	"properties": { 
		"id": 4, "title": "Madison Candy Company",	
		"icon": {
			"iconUrl": "images/production24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
	
			},
		 "Descriptio": "Think about how the current businesses in this building produce value, and contrast these post-Fordist forms of production to the Fordist mode of production that used to inhabit it.", 
		 "PhotoLink": null, "Address": "744 Williamson St.", "iconLink24": null, "iconLink36": null,
        
        "Scripts":"The tour is almost done and, don’t worry, it ends with some refreshment. As you approach Ground Zero café, think about the kinds of commodity networks within which the current businesses in this neighborhood are embedded. Contrast this with the Fordist manufacturing economy that originally shaped the formation of this neighborhood. What does this tell you about the dynamic relationship between different regimes of capital accumulation and the production of space?",
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "Take some time to relax here and write down a longer response to the questions that were posed to her throughout the tour, to be submitted with the photos she took along the way."
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "Take some time to relax here and write down a longer response to the questions that were posed to her throughout the tour, to be submitted with the photos she took along the way."
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "Take some time to relax here and write down a longer response to the questions that were posed to her throughout the tour, to be submitted with the photos she took along the way."
			}
		 ],
		 // end for image set in slide show
        "audio":"audio/audio5.m4a"
	} //end properties		
}, //end feature

//Fourth POI: Wil Mar Center 
{ "type": "Feature", 
	"geometry": {
		"type": "Point", 
		"coordinates": [ -89.366976240603208, 43.079849673461318 ] 
	}, 
	"properties": { 
		"id": 3, "title": "Wil-Mar Community Center", 
		"icon": {
			"iconUrl": "images/housing24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
			
			},
		"Descriptio": ". Built as a church and now a community center, the building provides a good opportunity to reflect on how the neighborhood has changed.", "PhotoLink": null, "Address": "953 Jenifer St.", "iconLink24": null, "iconLink36": null,
        
        "Scripts":"Factories, transportation, and power are all essential to the production of commodities. But they would be useless without an additional input: labor. One of the main reasons why the Badger State Shoe Company relocated from the south of the city to the isthmus in 1910 was to have better access to labor power. The next stop on this tour is Madison’s Wil-Mar neighborhood, positioned along the famous Williamson, or “Willy”, Street. The Wil-Mar neighborhood you are now entering was originally built as residences for middle class people working in the manufacturing sector. As industry developed, Willy Street became a busy thoroughfare, prompting the development of a variety of businesses. In the 1960s, the neighborhood became a regional hub for the counterculture movement, promoting an end to the wars in southeast Asia and equality for women and people of color. The Wil-Mar Neighborhood Center, a community center originally built as a church, provides a good opportunity to reflect on how the demographics and values of the neighborhood residents have evolved during this time.",
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Interdependencies</em>: Looking across the isthmus, how do you think zoning has changed over the past century? How do you think these changes have impacted the demographic composition of the Wil-Mar and adjacent neighborhoods?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Inequalities</em>: Wil-Mar’s association with the counterculture movement in the 1960s remains present in the landscape, as evident by the large mural on the northeast side of the Wil-Mar Neighborhood Center. What does the mural represent to you? Where do you think the history of this neighborhood fits with the global justice movement today?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Alternatives</em>: Some of the businesses in this neighborhood are local or community-owned, such as the Willy Street Co-Op, a grocery store founded in 1974. How do you think these businesses differ from retail outlets in other parts of Madison?"
			}
		 ],
		 // end for image set in slide show
        "audio":"audio/audio4.m4a"
		
	}  //end properties
},


//Third POI: Power Plant
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.3755195746634, 43.079486335352208 ] 
	},
	"properties": { 
		"id": 2, "title": "Power Plant Transformers", 
		"icon": {
			"iconUrl": "images/energy24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
		
			},
		"Descriptio": "Think through questions about energy flows through homes and business, inequalities related to the electric grid, and alternative forms of power.", "PhotoLink": "images\/powerPlant.jpg", "Address": "722 E Main St.", "iconLink24": null, "iconLink36": null,
        
        "Scripts":"The expansion of industry and transportation networks also depended on increasing the supply of energy in the city. Madison Gas and Light Company began operating gaslights along streets in the near east in 1855. The first electrical lighting appeared in the city in the 1880s. Madison Gas & Electric was established on the isthmus in 1902. Coal was transported to the plant along the old train tracks you just explored and then burned as fuel, with the CO2 emitted through the signature four smokestacks. This helped fuel a significant expansion in Madison’s industrial base during the first half of the twentieth century. The plant is still in operation today, but in 2011 it was converted from a coal-burning facility to one that only utilizes natural gas.",
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Interdependencies</em>: Economic development has created interdependencies with other places that supply fossil fuels. Sometimes geopolitical factors can affect the price and access to these fuel sources, leading to protests such as the one shown in this poster. What are some of the factors that can contribute to rising energy prices?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Inequalities</em>: This map depicts the millions of metric tonnes of CO2 that were released into the atmosphere in order to produce goods for the global economy in 2011. The color shading shows the CO2 emissions in the country producing the goods, while the flow arrows show the volume of these goods that then were consumed in the United States. Who do you think is responsible for these emissions?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Alternatives</em>: Recently, there have been efforts to develop wind farms in rural areas of Wisconsin. What percentage of Wisconsin’s electricity do you think currently comes from renewable energy sources? Do you think development of rural wind farms is a viable alternative to urban coal plants?"
			}
		 ],
		 // end for image set in slide show
        "audio":"audio/audio3.m4a"
	} //end properties  
}, //end feature

//Second POI: Train Station
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.376029686082973, 43.076639533539343 ]
	},

	"properties": { 
		"id": 1, "title": "Chicago and NorthWestern Railroad Station", 
		"icon": {
			"iconUrl": "images/transportation24design1.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
			
			},
		"Descriptio": "Former railroad station...", "PhotoLink": "images\/railroadStation.jpg", "Address": "133 S Blair St.", "iconLink24": null, "iconLink36": null,
        
        "Scripts":"The emergence of new factories across the isthmus created new challenges too. More and more raw materials had to be brought into the city and finished goods had to be transported to markets in southern Wisconsin and beyond. The Badger State Shoe Company, for example, sold some of its goods in bulk to a national distributor based in Chicago. Other companies produced agricultural tools and machines that needed to reach farms in rural areas of the Midwest. The primary means through which goods are transported from factory to market have changed significantly since the early twentieth century―as have the distances they travel. But, you can still see evidence of these earlier transportation networks imprinted in the landscape.",
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Interdependencies</em>: The building you are currently standing in front of used to be a train station. What do you think were the main cities connected to Madison by railroad in the early twentieth century?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Inequalities</em>: How do you think that Nike shoes are transported to retail stores in Wisconsin today? How much farther do you think shoes produced by Nike travel today compared to shoes the Badger State Shoe Company produced in the nineteenth century?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Alternatives</em>: What kinds of transportation networks can you see in this area today, and what do these networks suggest about Madison’s changing position within the global economy?"
			}
		 ],
		 // end for image set in slide show
        "audio":"audio/audio2.m4a"
	} //end properties  
}, //end feature

//First POI: Shoe Factory
{ "type": "Feature", 
	"geometry": { 
		"type": "Point", 
		"coordinates": [ -89.378615022118979, 43.081285046311976 ] 
	}, 

	"properties": { 
		"id": 0, "title": "Badger State Shoe Factory", 
		"icon": {
			"iconUrl": "images/labor24design2.png",
			"iconSize": [24, 24], // size of the icon
			"iconAnchor": [12, 12], // point of the icon which will correspond to marker's location
			"popupAnchor": [0, -12] // point from which the popup should open relative to the iconAnchor
			
			},
		"Descriptio": "(From Wikipedia) The building was constructed in 1910 after the company had originally expanded its production to Madison in 1900.  designated a landmark by the Madison Landmarks Commission in 1989.", "PhotoLink": "images\/BadgerStateShoeFactory1.jpg", "Address": "123 N Blount", "iconLink24": null, "iconLink36": null,
		
		"Scripts": "Hello. My name is Stephen Young. I’m a member of faculty in International Studies and Geography at UW-Madison, and I teach courses on globalization. Today, you are going on an expedition through the City of Madison. I’ll be guiding you through the City with audio and visual materials. But the landscape itself will be your main teacher.<br>The tour is designed to help you meet three learning objectives. First, you will find out how Madison, like any city, has been shaped by its interdependencies with other places around the world. Most case studies of globalization focus on cities such as New York or Tokyo. But, as you’ll see, the landscape in Madison also bears the marks of various rounds of global economic restructuring.<br>Second, by mapping these interdependencies, you’ll also be exploring the relationship between global economic integration and rising inequalities. Madison occupies a privileged position within global networks of production and trade. But Madison’s prosperity always has been bound together with the relative impoverishment of other people and places. <br>Third, by grounding the analysis in the landscape that surrounds you, I hope to dispel the idea that globalization is something that happens “out there”, beyond our control. Ultimately, the economy works the way it does because of decisions people make about what to buy, where to invest their money, and so on. If those actions are not promoting the wellbeing of the community and the planet, you can think about alternatives. I want you to reflect on how your own actions impact the lives of others―including those who may seem distant―in positive or negative ways. <br> Today’s lesson about globalization takes place on Madison’s isthmus, a narrow strip of land located between Lakes Mendota and Monona that formed at the end of the last glacial period over ten thousand years ago. Three Michigan-based businessmen purchased this land in the 1830s. At that time, there wasn’t a single building or road in the area. Nevertheless, ambitious plans were drawn up to develop the city according to a grid-like structure fanning out from what is now the Capitol. In 1856, Madison officially was recognized as a city, by which time it also had been awarded the status of state capital.  <br>As well as money, the development of a city requires raw materials and labor power. The acquisition of these different inputs helps to underscore the idea that Madison always has been a product of broader regional and global flows. Those distinctive cream-colored bricks used to build many of the older buildings in the city? They were made from clay quarried close to Milwaukee. The quaint, yet decorative architecture of older houses you see just off campus? They signal the waves of migrants who arrived in the city from Germany and Scandinavia in the second half on the ninetieth century. <br>But beware the lie of the land! Landscapes also are shaped in ways that reflect inequalities in power between different population groups. The role played by some migrant populations may not be so apparent at first glance. Processes of urbanization in the nineteenth century worked to marginalize the rich cultural histories of native populations who have lived in this area since the isthmus first was formed ten thousand years ago. Discriminatory attitudes and regulations continue to restrict racial diversity across the city to this day. Reading the landscape means paying careful attention to these erasures too. <br> Soon, you will be introduced to your first destination on the tour. The main drivers of Madison’s economy always have been services supporting the university and the state government. But other industries have played an important role too. The isthmus is where the first factories were established in the city in the late nineteenth century. The manufacturing sector in Madison reflected the dominant system of production of the time: Fordism. Companies invested in the construction of large factories across the isthmus and directly employed hundreds of assembly line workers in industries ranging from machinery to food processing. <br> In recent decades, manufacturing has declined on the isthmus, and across Madison, although the impacts have not been as dramatic as in other parts of the “rust belt” spanning much of the Great Lakes region. Today, services are more dominant in this part of the city than ever. The transition to a service or post-Fordist economy has overlain and altered much of the landscape. But, as we’ll see, that earlier era of manufacturing remains sedimented within the built environment of the isthmus. <br> Your first destination is a six-story building constructed at the start of the twentieth century. Between 1910-1930, it was home to the Badger State Shoe Company. At its peak, the company employed about 250 workers―of whom half were women―and produced roughly 2,000 pairs of shoes a day. As you explore the factory, think about how the shoe factory was embedded within evolving local, regional, and global economies.",
        
        // for image set in slide show
		 "imageSet": [
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Interdependencies</em>: The Badger State Company was originally based in this factory in Milwaukee. The company relocated to south Madison in 1903 and then, in 1910, to the building in front of you. What factors do you think influenced its operations at this site, on the corner of East Dayton & Blount, between 1910-1930?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Inequalities</em>: There used to be an open market located just across the street from where you’re standing. Who do you think would have been the main consumers of the goods produced by the Badger State Shoe Company and similar companies located on the isthmus?"
			},
			{
				"historic_small": "images/historic_small.jpg",
				"historic_large": "images/historic_large.jpg",
				"current_small": "images/current_small.jpg",
				"current_large": "images/current_large.jpg",
				"image_texts": "<em>Alternatives</em>: Most Nike shoes are made in factories like this in southeast Asia. Why do you think Nike chooses to have its shoes made in these locations, rather than in American cities like Madison? Who do you think the main consumers of shoes produced by Nike are?"
			}
		 ],
		 // end for image set in slide show
        "audio":"audio/audio1.m4a"
	} //end properties 
} //end feature
] //end features list
} //end feature collection  
]; //end object