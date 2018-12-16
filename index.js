/*
 * Author: pabvald
 * Date: 10/12/2018
 */

/** 
 * Draws the graphic every time a country (or all) is checked or unchecked.
 */
$(document).ready(function() {
    let selection_hidden = false;

    let countries = ["EUR","ESP", "FRA", "DEU"]; // Where EUR is the E.U. avg.

    d3.select("#svgcontainer").selectAll("svg").remove();
    drawMultiseries("#svgcontainer",700,420, countries);

    /*
     * Handles the checking or unchecking of a single country.
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
     *  Handles the 'click' event on the button "Uncheck all (countries)" 
     */
    d3.selectAll("#button-uncheck-all").on("click", function () {
        countries = [];
        d3.select("#svgcontainer").selectAll("svg").remove();
        drawMultiseries("#svgcontainer",700,420, countries);
    });

});

