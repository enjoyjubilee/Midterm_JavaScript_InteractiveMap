/* ================================
Week 7 Assignment: Midterm Functions + Signatures
================================ */

// STORY MAP INTENTION
// This slide show is to display the spatial relationship between high-growth
// companies clusters in Pennsylvania and the main airports/universities.

// SLIDE 1 shows the location points of Inc 5000 companies from 2009 - 2018 in
// PA with popups on which there are the name, city, industry and year (or years)
// it was on the list.

// SLDE 2 shows the result after filter the companies by most recent year on Inc5000
// All the filter are lists for user to choose (or simply input, depends on time
// spent). Data source: https://www.inc.com/inc5000/index.html

// SLIDE 3 shows the location points of airports in PA with popups on which there
// are name, city and 2018 year round flights volume. By a click, user can see
// the influence area (displayed as buffer, propotionally related to the volume).
// Data needs to be collected from Internet

// SLIDE 4 shows both the location points of companies and the buffer of airports.

// SLIDE 5 shows that the points inside the buffer polygons will have a differnet color from those
// outside the polygons (which is the same as plotted in slide 1), and the points
// of airports are replaced by the buffer. Three thresholds of radius can be chosen
// by users.


/* =====================
  Global Variables
===================== */
//var data;  // for holding data
var stringFilter = "";
var selectValue = 'All';

/* =====================
  Map Setup
===================== */

var mapOpts = {
  center: [41.203323, -77.194527],
  zoom: 8
};
var map = L.map('map', mapOpts);

var tileOpts = {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
};
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts).addTo(map);

/* =====================
  Slide Model
===================== */
// Define the stack
var slides = [
   {
     title: "Inc500 company",
     text: "show the high growth companies in pa",
     color:'#A7D3D4',
     filter:'City Filter',
     url:'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson',
     markers:[]
   },
   {
     title: "Companies in Philadelphia",
     text: "Company in Philadelphia",
     color:'#42B7B9',
     filter:'Industy Filter',
     url:'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson',
     dataSource:'Philadelphia',
     markers:[]
   },
   {
     title: "Aviation in PA",
     text: "public airports around Pennsylvania",
     color: '#F1F1F1',
     filter:'City Filter',
     url:"https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/aviation_dotmap.geojson",
     markers:[]
   },
   {
     title: "Aviation Buffer",
     text: "airports and its effect area",
     color:'#FFFFFF',
     url:"https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/airports_buffer6.geojson",
     markers:[]
   },
   {title: "Companies in the Buffer",
    text: "airports and its effect area",
    color: '#0000FF',
  //  url1:'https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/comp_map.geojson',
    url:"https://raw.githubusercontent.com/enjoyjubilee/Midterm_JavaScript_InteractiveMap/master/airports_buffer6.geojson",
    markers:[]
   },
 ]


// Define the procedures in the recipe
 var addTitle = (title) => {
   $('.sidebar').append(`<h1 id='title'>${title}</h1>`)
 }

 var addText = (text) => {
   $('.sidebar').append(`<p id='text'>${text}</p>`)
 }

 //var addFilter = (filter) => {
//   $('.inputgroup').append(`<label for="str">${filter}</label>`)
// }

 var setColor = (color) => {
   $('#map').css('background-color', color)
 }

 var cleanup = () => {
   $('#title').remove()
   $('#text').remove()
 }

//var plotMarkersForloop = (data) => {
//  for (let i = 0; i< data.length; i++){
//    data[i].addTo(map)}};

  var myMarkers = [];
  var getAndParseData = (data) => {
  if (currentSlide==0){
    // For the first slide we need to get two datasets,url1 links to companies
    $.ajax(data.url).done(function(res){
      parsed = JSON.parse(res);
      _.each(parsed.features,function(feature){
      var a = L.geoJSON(feature).bindPopup("Name: "+feature.properties.company+
      "  City: "+feature.properties.city+" Number of years on Inc5000: "+
      feature.properties.yrs_on_list);
      data.markers.push(a);
    })
  });
  /*  $.ajax(data.url2).done(function(res){
      parsed = JSON.parse(res);
      _.each(parsed.features,function(feature){
      var a= L.geoJSON(feature).bindPopup("Name: "+feature.properties.FACNAME+
      "  County: "+feature.properties.COUNTY+" Number of aircraft licenses: "+
      feature.properties.LICNAME)
      myMarkers.push(a)
    })
  });*/
}else if (currentSlide==1){
    // For the second slide we need to filter the dataset of companies in Philly
    $.ajax(data.url).done(function(res){
      parsed = JSON.parse(res);
      _.each(parsed.features,function(feature){
      var a = L.geoJSON(feature, {
        filter: function(feature, layer) {
            return feature.properties.city == 'Philadelphia'
        }}).bindPopup("Name: "+feature.properties.company+
      "  City: "+feature.properties.city+" Number of years on Inc5000: "+
      feature.properties.yrs_on_list)
      data.markers.push(a)
    })
  })
}else if (currentSlide==2){
    // For the third slide, plot points of companies and the popup
    $.ajax(data.url).done(function(res){
      parsed = JSON.parse(res);
      _.each(parsed.features,function(feature){
      var a= L.geoJSON(feature).bindPopup("Name: "+feature.properties.FACNAME+
      "  County: "+feature.properties.COUNTY+" Number of aircraft licenses: "+
      feature.properties.LICNAME)
      data.markers.push(a)
    })
  });
}else if (currentSlide==3){
    // For the third slide, plot points of airpots and the popups
    $.ajax(data.url).done(function(res){
      parsed = JSON.parse(res);
      _.each(parsed.features,function(feature){
      var a= L.geoJSON(feature).bindPopup("Name: "+feature.properties.FACNAME+
      "  County: "+feature.properties.COUNTY+" Number of aircraft licenses: "+
      feature.properties.LICNAME)
      data.markers.push(a)
    })

  });
  }else{
    // For the third slide, plot buffers of airports and the popups
    $.ajax(data.url).done(function(res){
      parsed = JSON.parse(res);
      _.each(parsed.features,function(feature)
        {
      var a= L.geoJSON(feature,{
        filter:function(feature, layer) {
            return feature.properties.city == 'Philadelphia'
        }}).bindPopup("Name: "+feature.properties.FACNAME+
    "  County: "+feature.properties.COUNTY+" Number of aircraft licenses: "+
    feature.properties.LICNAME)
    data.markers.push(a)
    })
  })
};
myMarkers = data.markers
console.log(myMarkers);
 //_.each(myMarkers, function(marker) { marker.addTo(map); });
}

var plotMarkers = (data) => {
_.each(data, function(marker) { marker.addTo(map); });
}

var removeMarkers = (data) => {
_.each(data,function(marker) { map.removeLayer(marker);});
}


/*  var parsedRes = [];
  var cleanParsed = [];
  var finalParsed = [];
  var markers = [];*/
/*
  var parseData = function(res) {
// Parse the JSON returned (res)
  parsedRes = JSON.parse(res);
  myfeature = parsedRes.features;

// parse data for plot geoJSON
  for(let i=0;i<parsedRes.features.length;i++){
    cleanOne = parsedRes.features[i];
    cleanParsed.push(cleanOne);
    console.log("1")
  }
// parse data for popups
  for(let i=0;i<cleanParsed.length;i++){
    propertyOne = cleanParsed[i].properties;
    finalParsed.push(propertyOne);
    console.log("2")
  }
// get the array of markers and popup
  for(let i=0;i<finalParsed.length;i++){
    markerOne = L.geoJSON(parsedRes).bindPopup(cleanParsed[i].CITY + "," + cleanParsed[i].NAME)
    markers.push(markerOne);
    console.log("3")

  return cleanParsed
  return finalParsed
  return markers
 }
}
*/
/* =====================
  BindEvents
===================== */

// Build up the recipe
  var buildSlide = (slideObject) => {
  cleanup(slideObject)
  addTitle(slideObject.title)
  addText(slideObject.text)
//  addFilter(slideObject.filter)
//  setColor(slideObject.color)
  getAndParseData(slideObject)
  plotMarkers(slideObject.markers)
}


// "Cook" pages
  var currentSlide = 0;
  buildSlide(slides[currentSlide])

// "Cook" the next page by clicking "next"
  $("#next").click(() => {
    removeMarkers(slides[currentSlide].markers)
    currentSlide = currentSlide + 1;
    buildSlide(slides[currentSlide]);
  });

// "Cook" the previous page by clicking "previous"
  $("#previous").click(() => {
    removeMarkers(slides[currentSlide].markers)
    currentSlide = currentSlide - 1;
    buildSlide(slides[currentSlide]);
  });
