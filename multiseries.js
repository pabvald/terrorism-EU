 
 
 /* Countries COLOURS */
 const COLOURS = { "EUR":'rgb(0,0,0)',        "AUT":'rgb(198,27,27)',     "BEL":'rgb( 85, 21, 172 )',  "BGR":'rgb(36, 137, 128)',
                   "HRV":'rgb(24, 38, 137)',  "CYP":'rgb( 201, 37, 104)', "CZE":'rgb(206, 197, 0 )',   "DNK":'rgb(103, 236, 10)',
                   "EST":'rgb(7, 196, 61)',   "FIN":'rgb(206, 0, 0)',     "FRA":'rgb( 240, 92, 7)',    "DEU":'rgb( 1, 135, 135 )',
                   "GRC":'rgb(84, 103, 163)', "HUN":'rgb( 88, 24, 69)',   "IRL":'rgb( 144, 12, 63 )',  "ITA":'rgb( 122, 162, 9 )',
                   "LVA":'rgb( 40, 55, 71 )', "LTU":'rgb( 39, 174, 96)',  "LUX":'rgb( 160, 64, 0)',    "SWE":'rgb( 97, 106, 107 )',
                   "MLT":'rgb( 233, 80, 56)', "NLD":'rgb( 254, 0, 73)',   "POL":'rgb( 26, 82, 118)',   "PRT":'rgb(  86, 11, 13 )',  
                   "GBR":'rgb(0, 255, 128)',  "ROU":'rgb( 84, 64, 46 )',  "SVK":'rgb( 201, 0, 186)',   "SVN":'rgb(162, 115, 9)', 
                   "ESP":'rgb( 88, 45, 63)'  
                };

/* Historical events */
const MONTHS_NAMES = { 1 : "January", 2 : "Frebruary", 3 : "March", 4 : "April", 5 : "May", 6 : "June",
                        7 : "July", 8 : "August", 9 : "September", 10 : "October", 11 : "Nomvember", 12 : "December"
                      };
 const EVENS_DEFAULT_COLOR = "grey";
 const EVENTS_OVER_COLOR = "red";
 const EVENTS_DEFAULT_OPACITY = 0.4;
 const EVENTS_POINTS_Y = -15;
 const EVENTS_DESCRIPTION_Y = -40;
 const EVENTS_DATE_Y = -25;
 const DATE_SIZE = "8px";
 
/* Lines & points */
 const HIDDEN_OPACITY = 0.3;
 const LINES_WIDTH = 1.8;
 const POINT_RADIUS = 2.2;

 /* Country names */
 const NAMES_SIZE = "9px"; 
 const TAB_SIZE= 25;  

 /* Info-boxes */
 const INFOBOX_WIDTH = 80;
 const INFOBOX_HEADER_H = 20;
 const INFOBOX_BODY_H = 40;
 const INFOBOX_TEXT_SIZE = "10px";

 /* SVG */
 const X_MARGIN_RIGHT = 90;
 const X_MARGIN_LEFT = 50;
 const Y_MARGIN_TOP = 60;
 const Y_MARGIN_BOTTOM = 30;


/**
 * Main function. It builds and draws the linear graphic.
 * @param {*} container id of the svg container
 * @param {*} width  desired width of the graphic
 * @param {*} height desired height of the graphic
 * @param {*} countries list of selected countries
 */
function drawMultiseries(container, width, height, countries) { 

    let selectedData = null;
    let lastYearData = null;
    let butLastYearData = null;
    let maxIncidents = null;     

    let w = width;
    let h = height;

    let x = d3.scaleLinear().domain([1970,2016]).range([0,w]);
    let y = d3.scaleLinear().range([h,0]);

    let xFormat = d3.format("d");
    let xAxis = d3.axisBottom().scale(x).ticks(8).tickFormat(xFormat);
    let yAxis = d3.axisLeft().scale(y).ticks(10).tickFormat(xFormat);

    var svg = d3.select(container).append("svg")
                                .attr("width",w+X_MARGIN_LEFT+X_MARGIN_RIGHT)
                                .attr("height",h+Y_MARGIN_TOP+Y_MARGIN_BOTTOM)
                                .append("g")
                                .attr("id","main-group")
                                .attr("transform", "translate("+X_MARGIN_LEFT+","+Y_MARGIN_TOP+")");                                
    
    setCountriesNamesColours();

    /* Appends xAxis */
    svg.append("g").attr("class","xAxis")
                    .attr("transform","translate(0,"+h+")")
                    .call(xAxis);    
    
    /* Appends the y-Axis title */
    svg.append("text").attr("id","yAxis-title1").text("Number of terrorist")
                      .style("font-size","7pt").attr("x",-50).attr("y",-20);
    svg.append("text").attr("id","yAxis-title2").text("incidents")
                      .style("font-size","7pt").attr("x",-30).attr("y",-10);


    /* Unckecks every country and checks the selected countries */
    d3.selectAll(".checkbox-country").property("checked",false);
    countries.forEach(function(d) {
        d3.select("#checkbox-"+d).property("checked", true);
    }); 


    /* Adds the historical events marks */
    d3.csv("./data/historical-events.csv", function(data) {
       
        var events_lines_group = svg.append("g").attr("id","events-lines");

        events_lines_group.selectAll(".event-line").data(data).enter()
                             .append("line")
                             .attr("class","event-line")
                             .attr("id",function(d,i) {
                                 return "event-line-"+i;
                             })
                             .attr("x1", function(d) {
                                let year = +d.Year + (+d.Month/12);
                                return x(year);
                             })
                             .attr("x2", function(d) {
                                let year = +d.Year + (+d.Month/12);
                                return x(year);
                             })
                             .attr("y1",EVENTS_POINTS_Y)
                             .attr("y2",y(0))
                             .style("stroke",EVENS_DEFAULT_COLOR)
                             .style("opacity",EVENTS_DEFAULT_OPACITY);


        var events_points = svg.append("g").attr("id","events-points");
        
        events_points.selectAll(".event-point").data(data).enter()
                               .append("circle")
                               .attr("class","event-point")
                               .attr("id",function(d,i) {
                                   return "event-point-"+i;
                               })       
                               .attr("cx",function(d) {
                                    let year = +d.Year + (+d.Month/12);
                                    return x(year);                         
                               })          
                               .attr("cy",EVENTS_POINTS_Y) 
                               .attr("r","4px")
                               .style("fill",EVENS_DEFAULT_COLOR)
                               .style("opacity",EVENTS_DEFAULT_OPACITY)
                               .on("mouseover", onMouseoverEvents)
                               .on("mouseout", onMouseoutEvents); 
                               
        var events_descriptions = svg.append("g").attr("id","events-descriptions");

        events_descriptions.selectAll(".event-description").data(data).enter()
                                .append("text")
                                .attr("class","event-description")
                                .attr("id",function(d,i) {
                                    return "event-description-"+i;
                                })
                                .attr("y",EVENTS_DESCRIPTION_Y)
                                .attr("x",function(d) {
                                    let desc = d.Event+"";
                                    let year = +d.Year + (+d.Month/12);
                                    return x(year)-(5*desc.length/2);
                                })
                                .text(function(d) {
                                    return d.Event+"";
                                })
                                .style("fill", "red")
                                .style("font-family","Sans Serif")
                                .style("font-size",NAMES_SIZE)
                                .style("opacity",0);

        var events_dates = svg.append("g").attr("id", "events-dates");

        events_dates.selectAll(".event-date").data(data).enter()
                                .append("text")
                                .attr("class","event-date")
                                .attr("id",function(d,i) {
                                    return "event-date-"+i;
                                })
                                .attr("y",EVENTS_DATE_Y)
                                .attr("x",function(d) {
                                    let date = MONTHS_NAMES[+d.Month]+", "+d.Year;
                                    let year = +d.Year + (+d.Month/12);
                                    return x(year)-(4*date.length/2);
                                })
                                .text(function(d) {
                                    return MONTHS_NAMES[+d.Month]+", "+d.Year;
                                })
                                .style("fill", "red")
                                .style("font-family","Times")
                                .style("font-size",DATE_SIZE)
                                .style("opacity",0);

    });     

    /* Adds points and lines */
    d3.csv("./data/terrorismEU1970-2016.csv", function(allData) {
        
        selectedData = getSelectedData(allData, countries);         // Gets the data of the selected countries only      
        lastYearData = getAYearData(selectedData, 2016);            // Gets the selected data of the last year only 
        butLastYearData = excludeAYearData(selectedData, 2016);     // Gets the selected data between 1970 y 2015. 2016 is omitted.

        maxIncidents = getMaxIncidents(selectedData);           //Obtains the maximum # of incidents among the selected countries      
        
        /* Sets the domain of the y and appends the y-axis*/
        y.domain([0,maxIncidents]);
        svg.append("g").attr("class","yAxis").call(yAxis);
        
        
        /*Adds the country names */        
        var names_group = svg.append("g").attr("id","names");
        
        var names = names_group.selectAll(".name-country").data(lastYearData)
                                .enter()
                                .append("text")
                                .attr("class","name-country")
                                .attr("id",function(d) {
                                    return "name-"+d.Code;
                                })                                                            
                                .attr("x",function(d) {                                    
                                    let tabs = getTabs(lastYearData,""+d.Code,+d.Incidents);
                                    return x(2016) + tabs*TAB_SIZE;})
                                .attr("y", function(d) {
                                    return y(+d.Incidents);
                                })
                                .style("font-size",NAMES_SIZE)
                                .attr("fill",function(d) {
                                    let code = "" + d.Code;
                                    return COLOURS[code];
                                })
                                .text(function(d) {
                                    return ""+d.Code;
                                });                              
                    
        /* Adds the lines */
        var lines_group = svg.append("g").attr("id","lines");
        
        var lines = lines_group.selectAll(".line").data(butLastYearData)
                                .enter()
                                .append("line")
                                .attr("class","line")
                                .attr("id",function(d) {
                                    let nextYear = +d.Year +1;
                                    return "line-"+d.Code+"-"+d.Year+"-"+nextYear;
                                })
                                .style("stroke-width",LINES_WIDTH)
                                .style("stroke",function(d) {                               
                                    return COLOURS[""+d.Code];
                                })                                                               
                                .attr("x1",function(d) {
                                    return x(+d.Year);
                                })
                                .attr("x2",function(d) {
                                    let nextYear = +d.Year+1;
                                    return x(nextYear);
                                })                               
                                .attr("y1",function(d) {
                                    return y(+d.Incidents);
                                })                                
                                .attr("y2",function(d) {
                                    let nextYear = +d.Year+1;
                                    let nextYearIncidents = getIncidents(selectedData,""+d.Code,nextYear);
                                    return y(nextYearIncidents);
                                })
                                .on("mouseover",onMouseoverLines)
                                .on("mouseout", onMouseoutLines);
                                
                                
         
        /*Adds the points */
        var points_group = svg.append("g").attr("id","points");

        var points = points_group.selectAll(".point").data(selectedData)
                              .enter()
                              .append("circle")
                              .attr("class","point")
                              .attr("id",  function(d) {
                                   return "point-" +d.Code +"-" + d.Year;
                               })
                               .attr("cx", function(d) {
                                  return x(+d.Year);
                               })
                               .attr("cy", function(d) {
                                   return y(+d.Incidents);
                               })
                               .attr("r",POINT_RADIUS+"px")
                               .attr("stroke",function(d) {
                                    let code = d.Code +"";                                                                     
                                    return ''+COLOURS[code];
                               })
                               .attr("stroke-width",(3*POINT_RADIUS/4)+"px")
                               .attr("fill", "white")
                               .on("mouseout",onMouseoutPoints)
                               .on("mouseover", function() {
                                    let id = this.id;
                                    let pieces = id.split("-");
                                    let code = pieces[1];
                                    let year = pieces[2]-0;
                                    let incidents = getIncidents(selectedData,code,year);
                                    let variation = getVariation(selectedData,code,year-1,year);
                                    let variationStr = formatVariation(variation);
                                    let infobox = svg.append("g").attr("class","info-box");
                        
                                    infobox.append("rect").attr("x",x(year)).attr("y",y(incidents)-(INFOBOX_HEADER_H+INFOBOX_BODY_H))
                                            .attr("height",INFOBOX_HEADER_H).attr("width",INFOBOX_WIDTH)
                                            .style("fill","white").style("stroke","black");
                                    infobox.append("text").text(code+" - "+year).attr("x",x(year)+10).attr("y", y(incidents)-45)
                                            .style("font-size",INFOBOX_TEXT_SIZE);
                                    infobox.append("rect").attr("x",x(year)).attr("y",y(incidents)-INFOBOX_BODY_H)
                                            .attr("height",INFOBOX_BODY_H).attr("width",INFOBOX_WIDTH)
                                            .style("fill","white").style("stroke","black");
                                    infobox.append("text").text(incidents+" incidents").attr("x",x(year)+10)
                                            .attr("y", y(incidents)-23).style("font-size",INFOBOX_TEXT_SIZE);
                                    infobox.append("text").text(variationStr).attr("x",x(year)+10).attr("y", y(incidents)-10)
                                            .style("font-size",INFOBOX_TEXT_SIZE)
                                            .style("fill", function() {
                                                    if(variation < 0) { return "green";}
                                                    else if (variation > 0) { return "red"; }                               
                                                    else { return "orange"};
                                            });
                                
                                });

    });      
}


/* _____________________________________ EVENT HANDLERS __________________________________*/

/**
 * Handles the 'mouse over' event on a line.
 */
function onMouseoverLines() {
    let id = this.id;
    let pieces = id.split("-");
    let country = pieces[1]+"";

    let lines = d3.selectAll(".line").filter(function(d) {
        if(d.Code +"" != country) { return d;}
    });

    let points = d3.selectAll(".point").filter(function(d) {
        if(d.Code +"" != country) { return d;}
    });

    let names = d3.selectAll(".name-country").filter(function(d) {
        if(d.Code +"" != country) { return d;}
    });
    
    lines.style("opacity",HIDDEN_OPACITY);   
    points.style("opacity",HIDDEN_OPACITY);
    names.style("opacity",HIDDEN_OPACITY);

}

/**
 * Handles the 'mouse out' event on a line.
 */
function onMouseoutLines() {
    let lines = d3.selectAll(".line");
    let points = d3.selectAll(".point");
    let names = d3.selectAll(".name-country");

    lines.style("opacity","1");
    points.style("opacity","1");
    names.style("opacity","1");
}

/**
 * Handles the 'mouse over' event on an historical event
 * mark.
 */
function onMouseoverEvents () {
   let point_id = this.id;
   let pieces = point_id.split("-");
   let point = d3.select("#"+point_id);
   let line_id = "#event-line-"+pieces[2];
   let line = d3.select(line_id);
   let description_id = "#event-description-"+pieces[2];
   let description = d3.select(description_id);
   let date_id = "#event-date-"+pieces[2];
   let date = d3.select(date_id);
 
   point.style("opacity",1).style("fill",EVENTS_OVER_COLOR);
   line.style("opacity",1).style("stroke",EVENTS_OVER_COLOR);
   description.style("opacity",1);
   date.style("opacity",1);

}

/**
 * Handles the 'mouse out' event on an historical event mark.
 */
function onMouseoutEvents() {
    let points = d3.selectAll(".event-point");
    let lines = d3.selectAll(".event-line");
    let descriptions = d3.selectAll(".event-description");
    let dates = d3.selectAll(".event-date");

    points.style("opacity",EVENTS_DEFAULT_OPACITY).style("fill",EVENS_DEFAULT_COLOR);
    lines.style("opacity",EVENTS_DEFAULT_OPACITY).style("stroke",EVENS_DEFAULT_COLOR);
    descriptions.style("opacity",0);
    dates.style("opacity",0);
}


/**
 * Handles the 'mouse out' on a point.
 */
function onMouseoutPoints () {
    d3.selectAll(".info-box").remove();
}


/* __________________________________ UTILITY FUNCTIONS _________________________________*/

/**
 * Sets the colour of every checkbox name.
 */
function setCountriesNamesColours() {
    let country;
    let id = "#li-"
    for(let code in COLOURS) {
       country = d3.select(id+code);
       country.style("color",COLOURS[code]);
    }   
}

/**
 * Obtains the tabs which a given country's name label needs.
 * @param {*} data countrie's data
 * @param {*} code a three-letter code
 * @param {*} incidents number of incidents 
 */
function getTabs(data,code,incidents) {
    let margin = 5;
    let tabs = 1;
    let itsSelfFound = false;
    
    for(let d of data) {
        let codeTemp = "" +d.Code;
        let incidentsTemp = +d.Incidents;

        if( (incidentsTemp < incidents+margin) && (incidentsTemp > incidents-margin)  ) {
            if(codeTemp === code) {
                return tabs;
            } else {               
                tabs+=1;
            }
        }
    }

    return tabs;
}

/**
 * Obtains th number of terrorist incidents ocurred in a given country
 * in a given year.
 * @param {*} data 
 * @param {*} code three-letter code indicating the country
 * @param {*} year 
 */
function getIncidents(data,code,year) {   
    for(let d of data) {
        let codeTemp = "" +d.Code;
        if( codeTemp === code && (+d.Year) === year) {
            return +d.Incidents;
        }
    }
}

 /* Gets the data of the selected countries only */
function getSelectedData(data, countries) {
    let selectedData = [];
    data.forEach(function(d) {
        if(countries.includes(d.Code)) {
          selectedData.push(d);
        }
    }); 
    
    return selectedData;
}

/**
 * Obtains the maximum number of incidents among the data.
 * @param {*} data 
 */
function getMaxIncidents(data) {
    let maxIncidents = 0;
    data.forEach(function (d) {
        if(+d.Incidents > maxIncidents) { 
          maxIncidents = +d.Incidents;             
        }
    });  
    
    return maxIncidents;
}

/**
 * Obtains a given year's data.
 * @param {*} data all the data
 * @param {*} year the wanted year
 */
function getAYearData(data, year) {
    let aYearData = [];

    data.forEach(function(d) {
        if(+d.Year === year) {
            aYearData.push(d);
        }
    });

    return aYearData;
}

/**
 * Omits a given year's data.
 * @param {*} data all the data
 * @param {*} year the not wanted year that must be excluded.
 */
function excludeAYearData(data, year) {
    let excludeAYearData = [];

    data.forEach(function(d) {
        if(+d.Year !== year) {
            excludeAYearData.push(d);
        }
    });

    return excludeAYearData;
}

/**
 * Calculatates the increase or decrease (%) in the number of terrorist incidents 
 * in a given country from one year to another.
 * @param {*} data 
 * @param {*} code the code of the country
 * @param {*} year the initial year
 * @param {*} nextYear  the final year
 */
function getVariation(data, code, year, nextYear) {
    let incidentsYear = getIncidents(data,code, year);
    let incidentsNextYear = getIncidents(data,code,nextYear);

    if(incidentsYear === 0) {
        return NaN;
    }
    let variation = (incidentsNextYear - incidentsYear) / incidentsYear * 100;

    return variation;
}

/**
 * Converts the variation into a proper formatted string.
 * @param {*} variation the variation in the incidents.
 */
function formatVariation(variation) {    

    if(variation === NaN || variation === Infinity || variation === -Infinity) {
        return '';
    }
    if(variation > 0) {
        return  `+${variation.toFixed(2)}%`;
    } else if (variation < 0) {
        return  `${variation.toFixed(2)}%`;
    } else {
        return `-`;
    }
}
