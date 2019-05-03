//First line of main.js wraps everything in a self-executing anonymous function to move to local scope
(function(){

		var attrArray = ["Bio", "Name", "Search_Name"];
		var expressed = attrArray[0];
		
 
		var chartWidth = 300,
				chartHeight = 950;
				
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
					return "middle_Earth " + d.properties.Id;
				})
				.attr("d", path)
				.on("click", function(d){
					console.log(d)
					setBios(d.properties)
				});
		   
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
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.attr("class", "chart");
				
			var info = panel.append("text")
				.text(props.bio);

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
		
		//function to create coordinated bar chart
		
		//function setPanel(props){}
			//create a second svg element to hold the bar chart

				
		//function to highlight enumeration units and bars
		function highlight(props){
			//change stroke
			var selected = d3.selectAll(props.Id)
				.style("stroke", "blue")
				.style("stroke-width", "2");
		};
})(); //last line of main.js