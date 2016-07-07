/*
Main App for Sedona Chambers Map App
Mapblender
2016
*/
function startup(){
	that = this;
	that.token = 'pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg';
	
	L.mapbox.accessToken = 'pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg';

	var map = L.mapbox.map('map').setView([34.86394, -111.764860], 14).addControl(L.mapbox.shareControl()).addControl(L.mapbox.geocoderControl('mapbox.places'));
	that.map = map;

	var todayDateString;
	var d = new Date(); 

	todayDateString = d.toString("dddd, MMMM dd, yyyy h:mm tt");

	that.gotoloc = [];
	that.loader = document.getElementById('loader');

	var restaurantpts = L.mapbox.featureLayer('data/restaurant.json');
	var artpts = L.mapbox.featureLayer('sedonachamber.pmj9fija');

	if(window.location.href.indexOf("restaurants") > -1) {
        restaurantpts.addTo(map);
        points = restaurantpts;
    }
    else{
    	artpts.addTo(map);	
    	points = artpts; 
    }	
    
    addMouseClickListener(points);

    $('ul.nav.nav-pills li a').click(function() {   
    	
    	map.removeLayer(restaurantpts);
    	map.removeLayer(artpts);

    	if(this.innerText == 'All'){
    		artpts.addTo(map);	
    		restaurantpts.addTo(map);
    	}        
    	else if(this.innerText.search('Restaurants')>-1){
    		restaurantpts.addTo(map);
    		points = restaurantpts;
    		addMouseClickListener(points);
    	}
    	else{
    		//Galleries
    		artpts.addTo(map);	
    		points = artpts;
    		addMouseClickListener(points);
    	}
    	//change color
	    $(this).parent().addClass('active').siblings().removeClass('active');           
	});


	//search for mobile version 
	if(bowser.android||bowser.ios){
		
		map.on('popupopen', function(e) {
		    var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
		    px.y -= e.popup._container.clientHeight/2-100 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
		    map.panTo(map.unproject(px),{animate: true}); // pan to new center
		});
		//change header toolbar
		$('.nav-pills').css('margin-left','11%');
		$('.nav-pills').css('font-size','15px');		
	}	
	
	var mylocIcon = L.icon({
	     iconUrl: 'app/css/ripple.gif',
	     iconAnchor: [10, 10]
	 });

	var lc = L.control.locate({follow: true,
		keepCurrentZoomLevel: false,
		locateOptions: {maxZoom: 16},
		metric: false,
		showPopup: true, 
		markerClass: L.marker,
		markerStyle: {icon:mylocIcon},
	  	onLocationError: function(err) {
	  		vex.dialog.buttons.YES.text = 'OK';

	  		var howto = '';

	  		if(bowser.msie){
	  			howto = "<a target='_blank' style='color:#7A1800' href='http://windows.microsoft.com/en-us/internet-explorer/ie-security-privacy-settings#ie=ie-11'>How To </a>";	
	  		}
	  		else if(bowser.chrome){
	  			howto = "<a target='_blank' style='color:#7A1800' href='https://support.google.com/chrome/answer/142065?hl=en'>How To </a>";	
	  		}
	  		else if(bowser.firefox){
	  			howto = "<a target='_blank' style='color:#7A1800' href='https://support.mozilla.org/en-US/kb/improve-mozilla-location-services-turning-location'>How To </a>";	
	  		}
	  		else if(bowser.android){
	  			howto = "<a target='_blank' style='color:#7A1800' href='https://support.scruff.com/hc/en-us/articles/202623634-How-do-I-enable-location-services-on-my-Android-'>How To </a>";	
	  		}
	  		else if(bowser.ios){
	  			howto = "<a target='_blank' style='color:#7A1800' href='https://support.apple.com/en-us/HT203033'>How To </a>";	
	  		}
	  		
	  		vex.dialog.alert({
	            message: "Please Enable Your Location to find best directions from where you are.<br><br>"+howto
	        });

	  		that.loader.className = 'hide';
	  	}
	}).addTo(map);

	//turn dark if at night
	if(d.getHours()>19||d.getHours()<7){
		L.control.layers({
		    'Streets': L.mapbox.tileLayer('mapbox.streets',{maxZoom:20}),
		    'Imagery': L.mapbox.tileLayer('mapbox.satellite', {maxZoom:20}),
		    'Simple Streets': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin2opt8d00b9abnq6trki27e/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20}),
		    'Outside': L.mapbox.tileLayer('mapbox.run-bike-hike'),
		    'Sedona': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin7oyyjz000waamcx7v412nr/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20}),
		    'Red': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin2kt8ku001sb4mawvdvwjxf/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20}),
		    'Light': L.mapbox.tileLayer('mapbox.light'),
		    'Dark': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin961o3z00epcxnhaxgzwdb6/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20}).addTo(map)
		}, {
			//add other layers here
		    //'Bike Stations': L.mapbox.tileLayer('examples.bike-locations')
		}).addTo(map);
	}
	else{
		L.control.layers({
		    'Streets': L.mapbox.tileLayer('mapbox.streets',{maxZoom:20}),
		    'Imagery': L.mapbox.tileLayer('mapbox.satellite', {maxZoom:20}),
		    'Simple Streets': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin2opt8d00b9abnq6trki27e/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20}),
		    'Outside': L.mapbox.tileLayer('mapbox.run-bike-hike'),
		    'Sedona': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin7oyyjz000waamcx7v412nr/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20}),
		    'Red': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin2kt8ku001sb4mawvdvwjxf/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20}).addTo(map),
		    'Light': L.mapbox.tileLayer('mapbox.light'),
		    'Dark': L.tileLayer('https://api.mapbox.com/styles/v1/sedonachamber/cin961o3z00epcxnhaxgzwdb6/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2Vkb25hY2hhbWJlciIsImEiOiJjaW13Zmp3cGswMzd0d2tsdXBnYmVjNmRjIn0.PlcjviLrxQht-_tBEbQQeg', {maxZoom:20})
		}, {
			//add other layers here
		    //'Bike Stations': L.mapbox.tileLayer('examples.bike-locations')
		}).addTo(map);
	}
	
	that.loader.className = 'hide';
	map.on('locationfound',(function(t) {

        //find closest point
        var loc = {
            "type": "Feature",
            "properties": {
              "marker-color": "#f00",
              "marker-size": 'small'
            },
            "geometry": {
              "type": "Point",
              "coordinates": [t.longitude,t.latitude]
            }
        };

        //for locate option
        if(that.gotoloc.length==0){
        	var jsonpoints = points.getGeoJSON();
        	var newlistpoints = {};
        	newlistpoints['type'] = "FeatureCollection";
        	newlistpoints['features']=[];
	        ///filter out points
	        for (var i = 0; i < jsonpoints.features.length; i++) {
	          if(jsonpoints.features[i].geometry.type == 'Point' && jsonpoints.features[i].properties['marker-symbol']!="bus"&& jsonpoints.features[i].properties['marker-symbol']!="parking"){
	            newlistpoints['features'].push(jsonpoints.features[i]);
	          }
	        }
	        
	        var nolineslayer = L.geoJson(newlistpoints);
	        var nearestpoint = L.GeometryUtil.closestLayer(that.map,nolineslayer,t.latlng);
	        //var nearestpoint = turf.nearest(loc, jsonpoints);
	        //nearestpoint.properties['marker-color'] = '#58595B';
	        //nearestpoint.properties['marker-size'] = 'large';
	        //points.setGeoJSON(jsonpoints);
	        //points._geojson.features.concat(nearestpoint);
	        
	        if(!bowser.android&&!bowser.ios){
				points.eachLayer(function (layer) {
				    if (layer.feature.properties.title === nearestpoint.layer.feature.properties.title) {
				      	//var tomarker = layer.toGeoJSON();
				      	layer.openPopup();
				    };
				 });
	        }

			if(t.accuracy >550){
				that.map.setView(t.latlng,14);
				vex.dialog.buttons.YES.text = 'OK';
		  		
		  		vex.dialog.alert({
		            message: "Your computer says you are over "+Number(t.accuracy/3.28084).toFixed(0)+" feet from here<br><br><br><b>Please enable wifi or use your phone to locate you."
		        });
			}
			else{
				that.map.setView(t.latlng,16);

		        vex.dialog.buttons.YES.text = 'Get Directions';
		        vex.dialog.alert({
		            message: "You are within " +Number(t.accuracy/3.28084).toFixed(0) +" feet here!<br><br><i>"+nearestpoint.layer.feature.properties.title+"</i> is closest to you.<br>",
		            callback: function(value) {
		              //get directions  
		              //to
		              if(value == true){
			              var tocoords=[nearestpoint.layer.feature.geometry.coordinates[1],nearestpoint.layer.feature.geometry.coordinates[0]];
			              
						  that.loader.className = '';
						  that.getdirections(t.latlng,tocoords);
					  }
		            }
		        });
			}
        }
        //for regular directions
        else{
        	//this shouldn't happen anymore based on the lines
        	if( Object.prototype.toString.call( that.gotoloc[0] ) === '[object Array]' ) {
        		that.getdirections(t.latlng,that.gotoloc[0]);	
        	}
        	else{
        		that.getdirections(t.latlng,that.gotoloc);		
        	}
        }
        
        //that.currentloc = loc;
        that.map.stopLocate();
        //lc.stop(); 
	}));

	//cluster
	// L.mapbox.featureLayer('sedonachamber.pmj9fija').on('ready', function(e) {
	//     // The clusterGroup gets each marker in the group added to it
	//     // once loaded, and then is added to the map
	//     var clusterGroup = new L.MarkerClusterGroup();
	//     e.target.eachLayer(function(layer) {
	//         clusterGroup.addLayer(layer);
	//     });
	//     map.addLayer(clusterGroup);
	// });

	var imagecontrol = L.Control.extend({
	    options: {
	      position: 'bottomright'
	    },
	    onAdd: function (map) {
	      var container = L.DomUtil.create('div', 'img-control');
	      return container;
	    }
	});
	map.addControl(new imagecontrol());

	//map.addControl(L.mapbox.legendControl(points));
	//map.legendControl.addLegend(document.getElementById('legend').innerHTML);

	$('.img-control').click(function() {
	  window.open('http://visitsedona.com/','_blank')
	});

	vex.dialog.buttons.YES.text = 'Start Here';
	vex.dialog.buttons.NO.text = 'Browse Map';

	if(d.getDay() == 5&&d.getDate()<7){
	  todayDateString= todayDateString+'<br><br><a target="_blank" style="color:#7A1800" href="http://sedonagalleryassociation.com/?page_id=236">First Friday Art Walk. Click here for more information.</a></i>'
	}
	else if(d.getDay() == 4&&d.getDate()<7){
	  todayDateString= todayDateString+'<br><br><a target="_blank" style="color:#7A1800" href="http://sedonagalleryassociation.com/?page_id=236">First Friday Art Walk is tomorrow. Click here for more information.</a></i>'
	}
	else if(d.getHours()>18||d.getHours()<8){
	  todayDateString= todayDateString+'<br><br><i>Galleries may be closed in the evening.</i>'
	}

	vex.dialog.confirm({
	  message: "Welcome to the Walk Sedona Map!<br><br><a target='_blank' href='http://visitsedona.com/'><img src='assets/red_sedona.jpg' style='padding-bottom:20px !important;padding-right:32px !important;'></></a><a target='_blank' href='http://sedonagalleryassociation.com/'><img src='assets/sga-logo-web.jpg' style=''></></a><br><br>"+todayDateString,
	  callback: function(value) {
	    //locate for directions
	    if(value == true){

	      //locate
	      lc.start();    
	    }
	  }
	});
}

function addMouseClickListener(points){

	//this is dynamic based on the selected points
	points.on('click', function (e) {
	  	e.layer.openPopup();
	  	
	  	//make sure it doesn't take a line type
	  	if(e.layer.feature.geometry.type == 'Point'){
	  		that.gotoloc = [e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0]];	
	  	}

		$("#direc" ).on('click', function (e) {
			e.preventDefault();
			that.loader.className = '';
		  	//get direction same
		  	that.map.stopLocate();
		    that.map.locate();
		});

		that.layertitle = e.layer.feature.properties.title;
		//add event for event click for 
		$('#linksite').on('click', function (e) {
			ga('send', 'event', 'linksite', 'click', that.layertitle);
		});
		// $("#direc" ).on('touchstart', function (e) {
		// 	e.preventDefault();
		// 	that.loader.className = '';
		//   	//get direction same
		//   	that.map.stopLocate();
		//     that.map.locate();
		// });
		//ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
		ga('send', 'event', 'marker', 'click', e.layer.feature.properties.title);
	});


	/*points.on('mouseover', function (e) {
	  	e.layer.openPopup();
	  	
	  	//make sure it doesn't take a line type
	  	if(e.layer.feature.geometry.type == 'Point'){
	  		that.gotoloc = [e.layer.feature.geometry.coordinates[1],e.layer.feature.geometry.coordinates[0]];	
	  	}

		$("#direc" ).on('click', function (e) {
			e.preventDefault();
			that.loader.className = '';
		  	//get direction same
		  	that.map.stopLocate();
		    that.map.locate();
		});
	});*/
}

function getdirections(start,end){
	that = this;
	
	//duration in seconds/60 more because its cycling
	//distance in meters/3.28084 ft
	//distance in meters/0.000621371 miles
	if(that.directionlayer){
		that.map.removeLayer(that.directionlayer)
	}
	if(that.to){
		that.map.removeLayer(that.to)
	}
	if(that.from){
		that.map.removeLayer(that.from)
	}
	
	that.to = L.circle(end, 26,{
		    color: '#fff',
		    fillColor: '#9E2C2E',
		    fillOpacity: 0.7
	   }).addTo(map);  

	//from 
	that.from = L.circle(start, 26,{
		    color: '#fff',
		    fillColor: '#A1D490',
		    fillOpacity: 0.7
	}).addTo(map).bindPopup("You are here.").bringToFront();
	
	//using cycling because walking doesn't give adequate directions
	var dir_url = "https://api.tiles.mapbox.com/v4/directions/mapbox.cycling/"+start.lng+','+start.lat+";"+end[1]+','+end[0]+".json?instructions=json&geometry=line&access_token="+that.token
	
	$.get( dir_url, function( data ) {

		if(data.routes.length>0){
			var directions = {};
			directions.geometry = data.routes[0].geometry;
			directions.type="Feature";
		    directions.properties = {};
		    
		    //directions.properties.popupContent		    
		    var customPopup= "<i>Walking Time: "+Number(data.routes[0].duration/19).toFixed(0)+" minutes<br><br>Walking Distance: "+Number(data.routes[0].distance*0.000621371).toFixed(0)+" miles";
			
			var dirStyle = {
			    "color": "#61C5BE",
			    "weight": 5,
			    "dashArray": '5,10',
			    "opacity": 0.9
			};

			that.directionlayer = L.geoJson(directions,dirStyle).bindPopup(customPopup).addTo(that.map);
			
			//zoom to
			var bounds = that.directionlayer.getBounds();
			if(bowser.android||bowser.ios){
				//that.map.setView(start);
				//that.map.zoomOut(1);
				that.map.fitBounds(bounds,{padding: [73,73]});

				that.directionlayer.eachLayer(function(m) {
				  	m.openPopup();
				  	//that.map.setView(start);
				});
			}
			else{
				that.map.fitBounds(bounds,{padding: [15,15]});
				that.directionlayer.eachLayer(function(m) {
				  	m.openPopup();
				});
			}
		}
		else{
			vex.dialog.alert({
	            message: "No Current Directions, please try again."
	        });
		}	
		that.gotoloc = [];  
		that.loader.className = 'hide';
	});
}