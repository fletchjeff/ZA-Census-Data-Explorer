var all_data;
var complete_data;
var data;
var current_year = 2011;

var colors = {
    col_0: '#9ECAE1',
    col_1: '#6BAED6',
    col_2: '#4292C6',
    col_3: '#2171B5',
    col_4: '#084594'
}

var gender_colors = {
    "Male": '#A6CEE3',
    "Female": '#33A02C'
}

var race_colors = {
    "Black_African": '#A6CEE3',
    "Indian_Asian": '#1F78B4',
    "Coloured": '#B2DF8A',
    "White": '#33A02C'
}

var abbrev = {
    "Gauteng": "GP",
        "Western Cape": "WC",
        "Eastern Cape": "EC",
        "Limpopo": "LP",
        "Mpumalanga": "MP",
        "Northern Cape": "NC",
        "North West": "NW",
        "KwaZulu-Natal": "ZN",
        "Free State": "FS"
}

var gender = {
    "Male": true,
        "Female": true
}

var race = {
    "Black_African": true,
        "White": true,
        "Coloured": true,
        "Indian_Asian": true
}

var age = {
    "0_4": true,
        "5_9": true,
        "10_14": true,
        "15_19": true,
        "20_24": true,
        "25_29": true,
        "30_34": true,
        "35_39": true,
        "40_44": true,
        "45_49": true,
        "50_54": true,
        "55_59": true,
        "60_64": true,
        "65_69": true,
        "70_74": true,
        "75_79": true,
        "80_84": true,
        "85_": true
}

//the d3 elements to create the SVG on the page using and albers projection
var albers = d3.geo.albers();
var path = d3.geo.path()
    .projection(albers);

//these parameters modify the default projection to be used with the SA GeoJSON data. Makes its visible in the allocated svg area
albers.scale(1300);
albers.origin([24.7, -29.2]);
albers.parallels([-22.1, -34.1]);
albers.translate([180, 170]);


//this section creates the various svgs that will be used to place data on the page
var svg = d3.select("#chart")
    .append("svg")
    .attr("width",350)
    .attr("height",300);

var provinces = svg.append("g")
    .attr("id", "provinces");

var all_provinces_svg = d3.select("#all_provinces_bar_graph")
        .append("svg:svg")
        .attr("width", 370)
        .attr("height", 300);

var tooltip = d3.select("#tooltip")
    .style("visibility", "visible");

var gender_bar_width = 68;

var gender_svg = d3.select("#gender_graph")
        .append("svg:svg")
        .attr("width", gender_bar_width+26)
        .attr("height", 50)
        .append("g")
        .attr("transform", "translate(10,0)");

var gender_svg_x_axis = gender_svg.append("g")
	    .attr("class", "x axis");

var race_bar_width = 240;
        
var race_svg = d3.select("#race_graph")
        .append("svg:svg")
        .attr("width", race_bar_width + 26)
        .attr("height", 50)        
        .append("g")
        .attr("transform", "translate(20,0)");

var race_svg_x_axis = race_svg.append("g")
	    .attr("class", "x axis");

var age_svg = d3.select("#age_graph").append("svg:svg")       

var age_svg_g = age_svg.append("g");    

var age_svg_x_axis = age_svg_g.append("g")
	    .attr("class", "x axis");

var age_svg_y_axis = age_svg_g.append("g")
	    .attr("class", "y axis");

//changes the details in the tooltip item
function tooltip_info(province, male, female, black_african, white, indian_asian, coloured, total) {
    d3.select("#tt_province")
        .text(province);
    d3.select("#tt_male")
        .text(male);
    d3.select("#tt_female")
        .text(female);
    d3.select("#tt_black_african")
        .text(black_african);
    d3.select("#tt_white")
        .text(white);
    d3.select("#tt_indian_asian")
        .text(indian_asian);
    d3.select("#tt_coloured")
        .text(coloured);
    d3.select("#tt_total")
        .text(total);
}

//adds the "," thousand separator to a number
function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//creates the data structures to be used to draw the maps, graphs and for the population numbers
function query_data(local_data) {
    return d3.nest()
        .key(function (d) {
        return d.Province;
    })
        .rollup(function (d) {
        totaller = 0;
        return {
            White: d3.sum(d, function (g) {
                if (race.White == true) {
                    if (gender[g.Gender] == true) {
                        if (age[g.Age_Group] == true) {
                            totaller += g.White;
                            return +g.White
                        } else return 0;
                    } else return 0;
                } else return 0;
            }),
            Black_African: d3.sum(d, function (g) {
                if (race.Black_African == true) {
                    if (gender[g.Gender] == true) {
                        if (age[g.Age_Group] == true) {
                            totaller += g.Black_African;
                            return +g.Black_African
                        } else return 0;
                    } else return 0;
                } else return 0;
            }),
            Coloured: d3.sum(d, function (g) {
                if (race.Coloured == true) {
                    if (gender[g.Gender] == true) {
                        if (age[g.Age_Group] == true) {
                            totaller += g.Coloured;
                            return +g.Coloured
                        } else return 0;
                    } else return 0;
                } else return 0;
            }),
            Indian_Asian: d3.sum(d, function (g) {
                if (race.Indian_Asian == true) {
                    if (gender[g.Gender] == true) {
                        if (age[g.Age_Group] == true) {
                            totaller += g.Indian_Asian;
                            return +g.Indian_Asian
                        } else return 0;
                    } else return 0;
                } else return 0;
            }),
            Male: d3.sum(d, function (g) {
                if (g.Gender == "Male") {
                    if (gender[g.Gender] == true) {
                        if (age[g.Age_Group] == true) {
                            return (race.Black_African == true ? +g.Black_African : 0) + (race.Indian_Asian == true ? +g.Indian_Asian : 0) + (race.Coloured == true ? +g.Coloured : 0) + (race.White == true ? +g.White : 0);
                        } else return 0;
                    } else return 0;
                } else return 0;
            }),
            Female: d3.sum(d, function (g) {
                if (g.Gender == "Female") {
                    if (gender[g.Gender] == true) {
                        if (age[g.Age_Group] == true) {
                            return (race.Black_African == true ? +g.Black_African : 0) + (race.Indian_Asian == true ? +g.Indian_Asian : 0) + (race.Coloured == true ? +g.Coloured : 0) + (race.White == true ? +g.White : 0);
                        } else return 0;
                    } else return 0;
                } else return 0;
            }),
            Total: totaller
        }
    })
        .sortValues(d3.descending)
        .entries(local_data);
}

//process the data to create the age graph
function age_data_query(local_data) {
	return d3.nest()
        	.key(function (d) {
        	return +d.Age_Group.split("_")[0];
    	})
    	.rollup(function (d) {
        	return d3.sum(d, function (g) {
                if (gender[g.Gender] == true) {
                    if (age[g.Age_Group] == true) {
                        return (race.Black_African == true ? +g.Black_African : 0) + (race.Indian_Asian == true ? +g.Indian_Asian : 0) + (race.Coloured == true ? +g.Coloured : 0) + (race.White == true ? +g.White : 0);
                    } else return 0;
        		}
        	})
      	})
        .sortValues(d3.descending)
        .entries(local_data)
}

//draws the age area graph
function draw_age_graph(plocal_data) {

	
	var margin = {top: 20, right: 30, bottom: 30, left: 70},
	    width = 620 - margin.left - margin.right,
	    height = 118 - margin.top - margin.bottom;
	
	var x = d3.scale.linear()
	    .domain([0, d3.max(plocal_data,function (d){
			return +d.key;
		})])
	    .range([0, width]);
	
	var y = d3.scale.linear()
	    .domain([0, d3.max(plocal_data,function (d){
			return d.values;
		})])
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .ticks(2)
	    .orient("left");
	
	var line = d3.svg.line()
	    .x(function(d) { return x(+d.key); })
	    .y(function(d) { return y(d.values); })
	    .interpolate("basis");
	
	var area = d3.svg.area()
	    .x(line.x())
	    .y1(line.y())
	    .y0(y(0));
	
	age_svg
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)

	age_svg_g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	age_svg_x_axis.attr("transform", "translate(0," + height + ")")
	    .call(xAxis);
	
	age_svg_y_axis.call(yAxis);

	var age_svg_binder = age_svg_g.selectAll(".line")
	    .data([plocal_data]);
	  
	age_svg_binder.enter().append("path")
	   	.attr("class", "line")
	    
	age_svg_binder.transition()
		.attr('d', area);

	age_svg_binder.exit().remove();
	
}

function draw_gender_bars(local_data) {
	
	var x = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, gender_bar_width]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .ticks(1)
	    .tickSubdivide(true)
	    .tickFormat(d3.format("%"))
	    .orient("bottom");

	gender_svg_x_axis.attr("transform", "translate(0,20)")
	    .call(xAxis);
	
	var gender_data = [{"gender":"Male","total":local_data[9].values.Male},{"gender":"Female","total":local_data[9].values.Female}];
	var gender_total = +local_data[9].values.Female + +local_data[9].values.Male;
	var gender_bars = gender_svg.selectAll("rect")
        .data(gender_data);
        
	gender_bars.enter()
        .append("svg:rect")
        .attr("y",0)
        .attr("stroke", "#000000")
        .attr("stroke-width", "1")
        .attr("shape-rendering", "crispEdges")
        .attr("height", 20)
        .attr("width",gender_bar_width/2)
        .attr("x",function (datum) {
        return (datum.gender == "Male" ? 0 : 50)
    })
        .attr("fill", function (datum) {

        return gender_colors[datum.gender]
    });
                
	gender_bars.transition()

		.attr("x", function (datum) {
        return (datum.gender == "Male" ? 0 : gender_bar_width-gender_bar_width*(datum.total/gender_total))
    })
        .attr("width", function (datum) {
        return gender_bar_width*(datum.total/gender_total)
    })
        
        .attr("fill", function (datum) {

        return gender_colors[datum.gender]
    });
     

    gender_bars.exit().remove();
}

function draw_race_bars(local_data){
		var x = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, race_bar_width]);
	
		var xAxis = d3.svg.axis()
	    .scale(x)
	    .ticks(2)
	    .tickFormat(d3.format("%"))
	    .orient("bottom");

		race_svg_x_axis.attr("transform", "translate(0,20)")
	    .call(xAxis);
	
	
		var race_data = [
		{"race":"Black_African","total":local_data[9].values.Black_African},
		{"race":"Indian_Asian","total":local_data[9].values.Indian_Asian},
		{"race":"White","total":local_data[9].values.White},
		{"race":"Coloured","total":local_data[9].values.Coloured}
		];
	var race_total = +local_data[9].values.Black_African + +local_data[9].values.White + +local_data[9].values.Indian_Asian + +local_data[9].values.Coloured;
	var race_bars = race_svg.selectAll("rect")
        .data(race_data);
 
 
    var x_counter_temp = 0;         
	race_bars.enter()
        .append("svg:rect")
        .attr("y",0)
        .attr("stroke", "#000000")
        .attr("stroke-width", "1")
        .attr("shape-rendering", "crispEdges")
        .attr("x", function (datum) {
        return 0
    })
        .attr("width", function (datum) { 
        return race_bar_width;
    })
        .attr("height", 20)
        .attr("fill", function (datum) {
        return race_colors[datum.race]
    });
            
    var x_counter = 0;
	race_bars.transition()
		.attr("x", function (datum) {
        return x_counter;
    })
        .attr("width", function (datum) {
        x_counter += race_bar_width*(datum.total/race_total);
        return race_bar_width*(datum.total/race_total)
    })
        .attr("fill", function (datum) {

        return race_colors[datum.race]
    });
  

    race_bars.exit().remove(); 
}

//the main draw function that puts everything on the page
function draw(local_data) {

	var bar_height = 15;
	var max;
    data = query_data(local_data);
    age_data = age_data_query(local_data);
    bar_height = 15;
    var height = (bar_height + 15) * (data.length);
    width = 150;
    max = d3.max(data, function (datum) {
        return datum["values"].Total;
    });
    var x = d3.scale.linear()
        .domain([0, d3.max(data, function (datum) {
        return datum["values"].Total;
    })])
        .rangeRound([0, width]);
    var y = d3.scale.linear()
        .domain([0, data.length])
        .rangeRound([0, height]);

	//add the totals for all the combined provinces to the data stack
    data.push({
        "key": "Total",
            "values": {
            "Total": d3.sum(data, function (datum) {
                return datum["values"].Total
            }),
                "Male": d3.sum(data, function (datum) {
                return datum["values"].Male
            }),
                "Female": d3.sum(data, function (datum) {
                return datum["values"].Female
            }),
                "Black_African": d3.sum(data, function (datum) {
                return datum["values"].Black_African
            }),
                "White": d3.sum(data, function (datum) {
                return datum["values"].White
            }),
                "Indian_Asian": d3.sum(data, function (datum) {
                return datum["values"].Indian_Asian
            }),
                "Coloured": d3.sum(data, function (datum) {
                return datum["values"].Coloured
            }),
        }
    })

	//draws the provinces bar graphs
    var all_provinces_bar_data_bind_rect = all_provinces_svg.selectAll("rect")
        .data(data);
        
        
    all_provinces_bar_data_bind_rect.enter()
        .append("svg:rect")
        .attr("x", 0)
        .attr("y", function (datum, index) {
        	return y(index);
    })
        .attr("height", bar_height)        
        .attr("stroke", "#000000")
        .attr("stroke-width", "1")
        .attr("shape-rendering", "crispEdges")
        .attr("transform", "translate(210, 1)");
        
    
    all_provinces_bar_data_bind_rect.transition()
        .attr("y", function (datum, index) {

        //this changes the colors of the provinces, put here to catch a ride on the d3 data binding pass through 
        d3.select("#" + abbrev[datum.key])
            .attr("fill", function () {

            //fill in the combined tooltip info, put here to catch a ride on the d3 data binding pass through, for the second level. Like inception, with less Leonardo
            tooltip_info("Total", addCommas(data[9]["values"].Male), addCommas(data[9]["values"].Female), addCommas(data[9]["values"].Black_African), addCommas(data[9]["values"].White), addCommas(data[9]["values"].Indian_Asian), addCommas(data[9]["values"].Coloured), addCommas(data[9]["values"].Total));
			return (datum["values"].Total > 10000000 ? colors["col_4"] : colors["col_" + (Math.floor(datum["values"].Total / 10000000 * 5))])
        })
		
		//this creates the binders for mouseovers for the map, put here to catch a ride on the d3 data binding pass through 
        d3.select("#" + abbrev[datum.key])
            .on("mouseover", function () {
            tooltip_info(datum["key"], addCommas(datum["values"].Male), addCommas(datum["values"].Female), addCommas(datum["values"].Black_African), addCommas(datum["values"].White), addCommas(datum["values"].Indian_Asian), addCommas(datum["values"].Coloured), addCommas(datum["values"].Total));
            return
        })
            .on("mouseout", function () {
            tooltip_info(data[9]["key"], addCommas(data[9]["values"].Male), addCommas(data[9]["values"].Female), addCommas(data[9]["values"].Black_African), addCommas(data[9]["values"].White), addCommas(data[9]["values"].Indian_Asian), addCommas(data[9]["values"].Coloured), addCommas(data[9]["values"].Total));

            return
        })

        return y(index);
    })
        
        .attr("width", function (datum) {
        if (datum["key"] == "Total") {
            return 0;
        } else {
            return x(datum["values"].Total);
        }
    })
        .attr("height", bar_height)
        .attr("fill", function (datum) {
        return "#B2DF8A"//colors["col_" + Math.round(((datum["values"].Total) / max) * 4)]
    });


	//add the province population totals to the left of the provinces bar graphs

    var all_provinces_bar_data_bind_text = all_provinces_svg.selectAll("text")
        .data(data);
        
        
    all_provinces_bar_data_bind_text.enter()
        .append("svg:text");
        
    
    all_provinces_bar_data_bind_text
        .attr("y", function (datum, index) {
        return y(index) + bar_height;
    })
        .attr("x", function (datum) {
        return 0
    })
        .attr("dx", 0)
        .attr("dy", 0)
        .attr("text-anchor", "middle")
        .text(function (datum) {
        return datum["key"] != "Total" ? datum["key"] + " - " + addCommas(datum["values"].Total) + "" : null;
    })
        .attr("text-anchor", "end")
        .attr("transform", "translate(200, 0)")
        .attr("fill", "#000000");

	all_provinces_bar_data_bind_rect.exit().remove();
	all_provinces_bar_data_bind_text.exit().remove();

	draw_race_bars(data);
	draw_gender_bars(data);
	draw_age_graph(age_data);
}

//toggles the gender values
function gender_clicker(gen_id) {
    if (gen_id != "gender_all") {
        gender[gen_id] = !gender[gen_id];
        gender[gen_id] ? d3.select("#" + gen_id)
            .classed("button_off", 0) : d3.select("#" + gen_id)
            .classed("button_off", 1);

    } else {
        d3.select("#Male")
            .classed("button_off", 0);
        d3.select("#Female")
            .classed("button_off", 0);
        gender = {
            "Male": true,
                "Female": true
        }
    }
    draw(all_data);
}

//toggles the race values
function race_clicker(race_id) {
    if (race_id == "race_all") {
        for (item in race) {
            d3.select("#" + item)
                .classed("button_off", 0);
            race[item] = true;
        }
    } else if (race_id == "race_none") {
        for (item in race) {
            d3.select("#" + item)
                .classed("button_off", 1);
            race[item] = false;
        }
    } else {
        race[race_id] = !race[race_id];
        race[race_id] ? d3.select("#" + race_id)
            .classed("button_off", 0) : d3.select("#" + race_id)
            .classed("button_off", 1);

    }
    draw(all_data);
}

//toggles the age values
function age_clicker(age_id) {
    if (age_id == "age_all") {
        for (item in age) {
            age_item = "age_" + item.split("_")[0];
            d3.select("#" + age_item)
                .classed("button_off", 0);
            age[item] = true;
        }
    } else if (age_id == "age_none") {
        for (item in age) {
            age_item = "age_" + item.split("_")[0];
            d3.select("#" + age_item)
                .classed("button_off", 1);
            age[item] = false;
        }
    } else {
        if (age_id != "age_85") {
            var_age = age_id.split("_")[1] + "_" + (+age_id.split("_")[1] + 4);
        } else {
            var_age = "85_";
        }

        age[var_age] = !age[var_age];
        age[var_age] ? d3.select("#" + age_id)
            .classed("button_off", 0) : d3.select("#" + age_id)
            .classed("button_off", 1);

    }
    draw(all_data);
}

//toggles between the different years
function year_clicker(year_id) {
	if (+year_id.substring(5) != current_year) {
		d3.select("#year_" + current_year).attr("class","year_button");
		current_year = +year_id.substring(5);
		all_data = complete_data[current_year];
		d3.select("#year_" + current_year).attr("class","year_button  year_button_on");
		draw(all_data);	
	}
}

//initially draws the map from the geoJSON file
d3.json("za-states.json", function (json) {
    d3.select("#loader")
        .style("visibility", "visible");
    
    //draws the map in the div.
    provinces.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("id", function (d) {
        return d.properties['name']
    })
        .attr("d", path)
        .attr("fill", "#9ECAE1");

    //fetches the census data and creates the visualisation
    d3.json("census.json", function (json) {
    	complete_data = json;
        all_data = complete_data[current_year];
        d3.select("#loader")
            .style("visibility", "hidden");
        d3.select("#loader")
            .remove();
        draw(all_data);
    });
});
