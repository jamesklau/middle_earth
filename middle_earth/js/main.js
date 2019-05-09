//First line of main.js wraps everything in a self-executing anonymous function to move to local scope
(function(){

		//assigns attributes to an array
		var attrArray = ["Bio", "Name", "Search_Name"];
		var expressed = attrArray[0];
		
		//sets panel size for information
		var panelWidth = window.innerWidth * 0.15, 
			panelHeight = 950;
				
	//begin script when window loads
	window.onload = setMap();

	//sets up middle earth map
	function setMap(){

		//map frame dimensions, percent of screen 
		var width = window.innerWidth * 0.8,
			height = 950;
			
		//create new svg container for the map
		var map = d3.select("body")
				.append("svg")
				.attr("class", "map")
				.attr("width", width)
				.attr("height", height);
				
		//middle earth projected onto a real world location, it is a tiny location off of the coast of africa and needs to be extremely zoomed in
		var projection = d3.geoAlbers()
				.center([0, -.0599])
				.rotate([-.10, 0])
				.parallels([0, 90])
				.scale(300000)
				.translate([width / 2, height / 2]);
			
		
		var path = d3.geoPath()
				.projection(projection);
			
		//use Promise.all to parallelize asynchronous data loading
		var promises = [];
		promises.push(d3.json("data/Middle_Earth_Reproj.topojson")); //load background spatial data
		Promise.all(promises).then(callback);

		
		function callback(data){ 
			
			middleEarth = data[0];
			
			
			//translate Middle Earth TopoJSON
			var middle_Earth = topojson.feature(middleEarth, middleEarth.objects.Middle_Earth_prj_dissolved).features;
			
			//add middle earth countries to map  
			var middle_Earth = map.selectAll(".middle_Earth")
				.data(middle_Earth)
				.enter()
				.append("path")
				.attr("class", function(d){
					return "middle_Earth " + "a" + d.properties.Id;
				})
				//click to on a specific location to retreive the bio for it
				.attr("d", path)
				.on("click", function(d){
					d3.select(".panel").remove();
					setBios(d.properties)
				})
				//hover mouse over an area to highlight it for an affordance
				.on("mouseover", function(d){
					highlight(d.properties);
				})
				//dehighlight it function so that the highlighting goes away
				.on("mouseout", function(d){
					dehighlight(d.properties);
				})
                
			//add style descriptor to each path
            var desc = middle_Earth.append("desc")
                .text('{"stroke": "#000", "stroke-width": "0.5px"}');
		   
			//zoom and pan code
			var rootSVG = d3.select('.map');
			var treeGroup = d3.selectAll('.middle_Earth');
				rootSVG.call(d3.zoom().on('zoom', function() {
				treeGroup.attr('transform', d3.event.transform);
			}));   
				
            // Create form for search (see function below).
            var search = d3.select("body").append('form').attr('onsubmit', 'return false;');

            var box = search.append('input')
                .attr('type', 'text')
                .attr('id', 'location')
                .attr('placeholder', 'Type to search...');
            
            var button = search.append('input')
                .attr('type', 'button')
                .attr('value', 'Search')
                .on('click', function(){ 
                    searchMiddleEarth() 
                });
		};
		};   
		  
		//function for the bios
		function setBios(props){
               
			var panel = d3.select("body")
				.append("div")
                .attr("class", "panel")
				.attr("width", panelWidth)
				.attr("height", panelHeight)
				
				
			var info = panel.append("text")
				.text(props.Bio);
		};	
				
		//function to highlight enumeration units
		function highlight(props){
			//change stroke
			var selected = d3.selectAll(".a" + props.Id)
				.style("stroke", "blue")
				.style("stroke-width", "2");
		};
		
		//function to reset the element style on mouseout   
		function dehighlight(props){
			var selected = d3.selectAll('.a' + props.Id)
				.style("stroke", function(){
					return getStyle(this, "stroke")
				})
				.style("stroke-width", function(){
					return getStyle(this, "stroke-width")
				});
		     function getStyle(element, styleName){
				var styleText = d3.select(element)
					.select("desc")
					.text();

				var styleObject = JSON.parse(styleText);

				return styleObject[styleName];
			}; 
		};
    
        // Search function
        function searchMiddleEarth() {
            
            var selectedLocation = document.getElementById("location").value;
            var location = d3.selectAll(Search_Nam).filter(function (d) { 
                return d
            });
            

        }

    
})(); //last line of main.js