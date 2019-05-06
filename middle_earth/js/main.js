//First line of main.js wraps everything in a self-executing anonymous function to move to local scope
(function(){

		var attrArray = ["Bio", "Name", "Search_Name"];
		var expressed = attrArray[0];
		
 
		var panelWidth = 300,
			panelHeight = 950;
				
	//begin script when window loads
	window.onload = setMap();

	//Example 1.4 line 1...set up choropleth map
	function setMap(){

			//map frame dimensions
		var width = 1500,
			height = 950;
			
			//create new svg container for the map
		var map = d3.select("body")
				.append("svg")
				.attr("class", "map")
				.attr("width", width)
				.attr("height", height);
				
				   //Example 2.1 line 15...create Albers equal area conic projection centered on France
		var projection = d3.geoAlbers()
				.center([0, -.0599])
				.rotate([-.097, 0])
				.parallels([0, 90])
				.scale(460000)
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
			
			//add Europe countries to map  
			var middle_Earth = map.selectAll(".middle_Earth")
				.data(middle_Earth)
				.enter()
				.append("path")
				.attr("class", function(d){
					return "middle_Earth " + "a" + d.properties.Id;
				})
				.attr("d", path)
				.on("click", function(d){
					d3.select(".panel").remove();
					setBios(d.properties)
				})
				.on("mouseover", function(d){
					highlight(d.properties);
				})
				.on("mouseout", function(d){
					dehighlight(d.properties);
				})
				
			//below Example 2.2 line 16...add style descriptor to each path
            var desc = middle_Earth.append("desc")
                .text('{"stroke": "#000", "stroke-width": "0.5px"}');
		   
			var rootSVG = d3.select('.map');
			var treeGroup = d3.selectAll('.middle_Earth');
				rootSVG.call(d3.zoom().on('zoom', function() {
				treeGroup.attr('transform', d3.event.transform);
			}));  
			
		};
		};   
		  
		//function to create dynamic label
		function setBios(props){

			var panel = d3.select("body")
				.append("div")
				.attr("width", panelWidth)
				.attr("height", panelHeight)
				.attr("class", "panel"); 
				
			var info = panel.append("text")
				
				.text(props.Bio);

			//label content
			var bioAttribute = props.bio;
			
			//create info label div
			var infolabel = d3.select("body")
				.append("div")
				.attr("class", "infolabel")
				.attr("id", props.Id + "_label")
				.html(bioAttribute);

			var regionName = infolabel.append("div")
				.attr("class", "labelname")
				.html(props.name);
		};	
				
		//function to highlight enumeration units and bars
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
})(); //last line of main.js