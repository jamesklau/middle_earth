//begin script when window loads
window.onload = setMap();

//Example 1.4 line 1...set up choropleth map
function setMap(){
    
    //use Promise.all to parallelize asynchronous data loading
    var promises = [];
    promises.push(d3.csv("data/unitsData.csv")); //load attributes from csv
    promises.push(d3.json("data/Middle_Earth_Reproj.topojson")); //load background spatial data

    Promise.all(promises).then(callback);

    function callback(data){
        csvData = data[0];
        middleEarth = data[1];
        
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

        //translate Middle Earth TopoJSON
        var middle_Earth = topojson.feature(middleEarth, middleEarth.objects.Middle_Earth_Reproj);

//        //add Europe countries to map
//        var middle_Earth = map.append("path")
//            .datum(middle_Earth)
//            .attr("class", "countries")
//            .attr("d", path);
                
        //add Europe countries to map  
        var middle_Earth = map.selectAll(".Id")
            .data(middle_Earth)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "middle_Earth " + d.properties.Id;
            })
            .attr("d", path);
//        
//        var zoom = d3.zoom()
//            .scaleExtent([1, 40])
//            .translateExtent([[-100, -100], [width + 90, height + 100]])
//            .on("zoom", zoomed);
//
//        var x = d3.scaleLinear()
//            .domain([-1, width + 1])
//            .range([-1, width + 1]);
//
//        var y = d3.scaleLinear()
//            .domain([-1, height + 1])
//            .range([-1, height + 1]);
//
//        var xAxis = d3.axisBottom(x)
//            .ticks((width + 2) / (height + 2) * 10)
//            .tickSize(height)
//            .tickPadding(8 - height);
//
//        var yAxis = d3.axisRight(y)
//            .ticks(10)
//            .tickSize(width)
//            .tickPadding(8 - width);
//
//        var view = map.append("rect")
//            .attr("class", "view")
//            .attr("x", 0.5)
//            .attr("y", 0.5)
//            .attr("width", width - 1)
//            .attr("height", height - 1);
//
//        var gX = map.append("g")
//            .attr("class", "axis axis--x")
//            .call(xAxis);
//
//        var gY = map.append("g")
//            .attr("class", "axis axis--y")
//            .call(yAxis);
//        
//        function zoomed() {
//            view.attr("transform", d3.event.transform);
//            gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
//            gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
//        }
//        
//        map.call(d3.zoom()
//        .scaleExtent([1 / 2, 4])
//        .on("zoom", zoomed));
    };
};