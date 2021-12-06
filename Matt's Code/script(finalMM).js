var margin = {
        top: 10,
        right: 50,
        bottom: 20,
        left: 50
    },
    width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var min = Infinity,
    max = -Infinity;

var chart = d3.box()
    .whiskers(iqr(1.5))
    .width(width)
    .height(height);

var data = [];

d3.csv("agePref.csv", function(error, csv) {
    if (error) throw error;

    //var data = [];
    data[0] = [];
	data[1] = [];

    // add here the header of the csv file
	data[0][0] = "Work From Home";
	data[1][0] = "Work From Office";

    data[0][1] = [];
	data[1][1] = [];

    csv.forEach(function(x) {
		var v1 = Math.floor(x.Age),
			v2 = Math.floor(x.Preference);
            d=data[v1];
			// add more variables if your csv file has more columns
			
		var rowMax = Math.max(v1, Math.max(v2));
		var rowMin = Math.min(v1, Math.min(v2));

        if (x.Preference == 1) data[0][1].push(v1);
        if (x.Preference == 0) data[1][1].push(v1);
        
		if (rowMax > max) max = rowMax;
		if (rowMin < min) min = rowMin;	
	});

    /*csv.forEach(function(x) {
        var e = Math.floor(x.Age),
            r = Math.floor(x.Preference),
            d = data[e];
        if (!d) d = data[e] = [s];
        else d.push(s);
        if (s > max) max = s;
        if (s < min) min = s;
    });*/

    chart.domain([min, max]);

    var svg = d3.select("body").selectAll("svg")
        .data(data)
        .enter().append("svg")
        .attr("class", "box")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(chart);

    setInterval(function() {
        svg.datum(randomize).call(chart.duration(1000));
    }, 2000);
});

function randomize(d) {
    if (!d.randomizer) d.randomizer = randomizer(d);
    return d.map(d.randomizer);
}

function randomizer(d) {
    var k = d3.max(d) * .02;
    return function(d) {
        return Math.max(min, Math.min(max, d + k * (Math.random() - .5)));
    };
}

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