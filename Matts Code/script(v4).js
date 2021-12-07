var labels = true; // show the text labels beside individual boxplots?

var margin = {top: 30, right: 50, bottom: 70, left: 50};
var  width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var min = Infinity,
    max = -Infinity;
    
var data = [];

    d3.csv("AgePref.csv", function(error, csv) {
        // using an array of arrays with
        // data[n][2] 
        // where n = number of columns in the csv file 
        // data[i][0] = name of the ith column
        // data[i][1] = array of values of ith column
        var data = [];
        
        data[0] = [];
        data[1] = [];
        // add more rows if your csv file has more columns
    
        // add here the header of the csv file
        data[0][0] = "Work From Home";
        data[1][0] = "Work From Office";
        // add more rows if your csv file has more columns
    
        data[0][1] = [];
        data[1][1] = [];
      
        csv.forEach(function(x) {
            var v1 = Math.floor(x.Age),
                v2 = Math.floor(x.Preference);
                // add more variables if your csv file has more columns
                
            var rowMax = Math.max(v1, Math.max(v2));
            var rowMin = Math.min(v1, Math.min(v2));
    
            //data[0][1].push(v1);
            //data[1][1].push(v2);
             // add more rows if your csv file has more columns
            if (x.Preference == 1) data[0][1].push(v1);
            if (x.Preference == 0) data[1][1].push(v1);
            
            if (rowMax > max) max = rowMax;
            if (rowMin < min) min = rowMin;	
        });
      
        var chart = d3.box()
            .whiskers(iqr(1.5))
            .height(height)	
            .domain([min, max])
            //.showLabels(labels);
    
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "box")    
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // the x-axis
        var x = d3.scaleOrdinal()	   
            .domain( data.map(function(d) { console.log(d); return d[0] } ) )	    
            .range([0 , width], 0.7, 0.3); 		
    
        var xAxis = d3.axisBottom()
            .scale(x)
            //.orient("bottom");
    
        // the y-axis
        var y = d3.scaleLinear()
            .domain([min, max])
            .range([height + margin.top, 0 + margin.top]);
        
        var yAxis = d3.axisLeft()
        .scale(y)
        //.orient("left");
    
        // draw the boxplots	
        svg.selectAll(".box")	   
          .data(data)
          .enter().append("g")
            .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
          .call(chart.width(x.range())); 
        
              
        // add a title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 + (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "18px") 
            .text("Age Distribution for WFH Vs WFO preference");
     
         // draw y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text") // and text1
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .style("font-size", "16px") 
              .text("Ages");		
        
        // draw x axis	
        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
          .call(xAxis)
          .append("text")             // text label for the x axis
            .attr("x", (width / 2) )
            .attr("y",  10 )
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .style("font-size", "16px") 
            .text("Preference"); 
    });

// Returns a function to compute the interquartile range.
function iqr(k) {
    return function(d, i) {
        var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
    };
}
