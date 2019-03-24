( function () {
	// Display the data and details of Inc companies and airport effect area in PA

	// Set up map
	var mapOpts = {
		center: [ 41.203323, -77.194527 ],
		zoom: 8
	};
	var map = L.map( 'map', mapOpts );

	var tileOpts = {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	};
	var Stamen_TonerLite = L.tileLayer( 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts )
		.addTo( map );

	// Create the array of slides
	var slides = [
		{
			title: "Inc5000 Companies",
			text: "Here you can see the high growth companies in the Inc5000 ranking from 2009 to 2018 in Pennsylvania. Click to see the industries and cities!",
			url: 'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson',
			zoom: 6,
			coordinates: [ 41.203323, -77.194527 ],
   },
		{
			title: "Companies in Pittsburgh",
			text: "Inc5000 Companies in Pittsburgh (or the registration address of the mother company is in Pittsburgh). Click and see the industries!",
			url: 'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson',
			zoom: 10,
			coordinates: [ 40.440624, -79.995888 ],
   },
		{
			title: "Airports in Pennsylvania",
			text: "Here you can see all the public airports in Pennsylvania. Click to see the county and number of licenses of aircrafts!",
			url: "https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/aviation_dotmap.geojson",
			zoom: 6,
			coordinates: [ 41.203323, -77.194527 ],
   },
		{
			title: "Aviation Effect Area ",
			text: "Airports effect areas in Pennsylvania",
			url: "https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/airports_buffer6.geojson",
			zoom: 6,
			coordinates: [ 41.203323, -77.194527 ],
   },
		{
			title: "Airport Effect Area in Pittsburgh",
			text: "Airports effect areas in Pittsburgh",
			url: "https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/airports_buffer6.geojson",
			zoom: 10,
			coordinates: [ 40.440624, -79.995888 ],
   },
 ];
	console.log( slides );

	var currentSlide = 0;

	// Define function
	var addTitle = ( title ) => {
		$( '.sidebar' )
			.append( `<h1 id='title'>${title}</h1>` )
	}
	var addText = ( text ) => {
		$( '.sidebar' )
			.append( `<p id='text'>${text}</p>` )
	}
	var cleanup = () => {
		$( '#title' )
			.remove()
		$( '#text' )
			.remove()
	}
	var displayButton = ( currentSlide ) => {
		if ( currentSlide == 0 ) {
			$( '#previous' )
				.hide();
		} else if ( currentSlide == 4 ) {
			$( '#next' )
				.hide();
		} else {
			$( '#next' )
				.show();
			$( '#previous' )
				.show();
		};
	}

	var geoJSONLayer;
	var getAndParseData = ( data ) => {
		if ( currentSlide == 0 ) {
			// For the first slide we need to get two datasets,url1 links to companies
			$.ajax( data.url )
				.done( function ( res ) {
					parsed = JSON.parse( res );
					if ( geoJSONLayer ) // Can I just pass the {}?
						map.removeLayer( geoJSONLayer );

					geoJSONLayer = L.geoJSON( parsed, {
						onEachFeature: ( feature, layer ) => {
							//		console.log( feature )
							layer.bindPopup( "Name: " + feature.properties.company +
								",   City: " + feature.properties.city + ",  Number of years on Inc5000: " +
								feature.properties.yrs_on_list );
						}
					} );
					geoJSONLayer.addTo( map );

				} );
		} else if ( currentSlide == 1 ) {
			// For the second slide we need to filter the companies in Philadelphia
			$.ajax( data.url )
				.done( function ( res ) {
					parsed = JSON.parse( res );
					if ( geoJSONLayer )
						map.removeLayer( geoJSONLayer );

					geoJSONLayer = L.geoJSON( parsed, {
						filter: ( feature, layer ) => {
							return feature.properties.city == 'Pittsburgh'
						},
						onEachFeature: ( feature, layer ) => {
							//	console.log( feature )
							layer.bindPopup( "Name: " + feature.properties.company +
								"  City: " + feature.properties.city + " Number of years on Inc5000: " +
								feature.properties.yrs_on_list );
						}
					} );
					geoJSONLayer.addTo( map );

				} )
		} else if ( currentSlide == 2 || currentSlide == 3 ) {
			// For the third and fourth slide the popup options are the same
			$.ajax( data.url )
				.done( function ( res ) {
					parsed = JSON.parse( res );
					if ( geoJSONLayer )
						map.removeLayer( geoJSONLayer );

					geoJSONLayer = L.geoJSON( parsed, {
						onEachFeature: ( feature, layer ) => {
							//	console.log( feature )
							layer.bindPopup( "Name: " + feature.properties.FACNAME +
								",  County: " + feature.properties.COUNTY + ",  Number of licenses of aircrafts: " +
								feature.properties.LICNUM );
						}
					} );
					geoJSONLayer.addTo( map );
				} )
		} else if ( currentSlide == 4 ) {
			// For the fifth slide we filter the airport buffer by county of Philadelphia
			$.ajax( data.url )
				.done( function ( res ) {
					parsed = JSON.parse( res );
					if ( geoJSONLayer )
						map.removeLayer( geoJSONLayer );

					geoJSONLayer = L.geoJSON( parsed, {
						filter: ( feature, layer ) => {
							return feature.properties.COUNTY == 'ALLEGHENY'
						},
						onEachFeature: ( feature, layer ) => {
							//		console.log( feature )
							layer.bindPopup( "Name: " + feature.properties.FACNAME +
								",  County: " + feature.properties.COUNTY + ",  Number of licenses of aircrafts: " +
								feature.properties.LICNUM );
						}
					} );
					geoJSONLayer.addTo( map );

				} )
		} else {
			console.log( "Oops!" )
		}
	}
	var buildSlide = ( slideObject ) => {
		cleanup( slideObject )
		addTitle( slideObject.title )
		addText( slideObject.text )
		getAndParseData( slideObject )
		map.setView( slideObject.coordinates, slideObject.zoom )
	}


	// Build the current page
	buildSlide( slides[ currentSlide ] )
	displayButton( currentSlide )

	// Build next page by clicking "next"
	$( "#next" )
		.click( () => {
			currentSlide = currentSlide + 1;
			buildSlide( slides[ currentSlide ] );
			displayButton( currentSlide );
		} );

	// Come back to the previous page by clicking "previous"
	$( "#previous" )
		.click( () => {
			currentSlide = currentSlide - 1;
			buildSlide( slides[ currentSlide ] );
			displayButton( currentSlide );
		} );
} )();
