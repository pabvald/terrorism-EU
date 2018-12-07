
$(document).ready(function() {
    let selection_hidden = false;

    let countries = ["EUR","ESP", "FRA", "DEU"]; // Where EUR is the E.U. avg.

    d3.select("#svgcontainer").selectAll("svg").remove();
    drawMultiseries("#svgcontainer",700,420, countries);

    /*
     * Handles the checking or unchecking of a country.
     */
    $("input[type=checkbox]").change(function () { 

        if(this.checked) {
            countries.push(this.name);           
        } else {          
            countries = countries.filter(country => country != this.name);
        }
       
        d3.select("#svgcontainer").selectAll("svg").remove();
        drawMultiseries("#svgcontainer",700,420, countries);
    });

    
    /*     
     * Handles the 'click' event on the button "Hide/Show selection". 
     */
    d3.selectAll("#button-select-countries").on("click", function() {

        if(selection_hidden) {
            d3.selectAll(".selectioncontainer").transition().duration(1000).style("display","block");
            d3.select("#svgcontainer").style("margin-left","0%");
            d3.select(".button").attr("value","Hide selection")
            selection_hidden = false;
        } else {
            d3.selectAll(".selectioncontainer").transition().duration(1000).style("display","none");
            d3.select("#svgcontainer").style("margin-left","25.5%");
            d3.select(".button").attr("value","Show selection")
            selection_hidden = true;
        }
            
    });

    /*
     *  Handles the 'click' event on the button "Uncheck all" 
     */
    d3.selectAll("#button-uncheck-all").on("click", function () {
        countries = [];
        d3.select("#svgcontainer").selectAll("svg").remove();
        drawMultiseries("#svgcontainer",700,420, countries);
    });

});

