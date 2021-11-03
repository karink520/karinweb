var sonnets = []; // sonnet text 

// Tooltips throughout
$( document ).tooltip();
    
// Handle show more/less buttons in 'about' section
$('#show-more').on('click', function(){
    $('#about-more').toggleClass("hidden")
    var disp_text = $('#about-more').hasClass("hidden") ? '(show more)' : '(show less)';
    d3.select('#show-more').html(disp_text)
})

/* Make scatterplot respond to changing author checkbox */
function showOrHideByAuthor(){
    $('#choose-authors .authorCheckbox').each(function() {
        var author = this.value,
        checked = this.checked;
        d3.selectAll('#scatter-container' + ' .' + author).classed('hidden', !checked);
        d3.selectAll('text' + '.' + author).classed('hidden', !checked || !document.getElementById('showSonnetNumbersCheckbox').checked)
    });
}

/* Make scatterplot respond to changing author checkbox */
d3.selectAll('#choose-authors .authorCheckbox').on('click',showOrHideByAuthor);

// Color scale for authors
var authorColorScale = d3.scaleOrdinal()
    .domain(["Shakespeare", "Spenser", "Sidney"])
    .range(d3.schemeSet2)

// Color legend
$('.legend').css("color", function() {
    var author = $(this).attr("class").split(/\s+/)[0].substring(7)
    return authorColorScale(author);
});

// Convert sonnet index (0-350) to sonnet number for display
function convertSonnetIdxToDisplayNumber(sonnetIdx) {
    if (sonnetIdx >= 154 && sonnetIdx < 243) { //if (author == "Spenser"){
        return sonnetIdx - 154 + 1;
    }
    else if (sonnetIdx >= 243) { //else if (author == "Sidney"){
        return sonnetIdx - (154 + 89) + 1;
    }
    else if (sonnetIdx < 154 ){ //else if (author == "Shakespeare"){
        return sonnetIdx + 1;
    }
}




    /* Show/hide sonnet numbers in response to checkbox click*/
$('#showSonnetNumbersCheckbox').on('click', function(){
    d3.selectAll('#scatter-container .sonnet-number-text').classed('hidden', function(){
        var showSonnetNums = document.getElementById('showSonnetNumbersCheckbox').checked;
        var authorCheckboxes = d3.selectAll('#choose-authors .authorCheckbox')._groups[0];
        for( i = 0; i< authorCheckboxes.length; i++) {
            var authorIsSelected = authorCheckboxes[i].checked;
            if (this.classList.contains(authorCheckboxes[i].value)) {
                return !(showSonnetNums && authorIsSelected);
            }
        }
    })
});

// Highlighting and displaying sonnets
function set_sonnet(id_for_entered_number, name_for_poet_field, id_for_displaying_text, sonnet_idx_to_match, clicked_circle_directly, author_radio_classname) {
    var entered_number;
    var author;
    var poetQuery = 'input[name="' + name_for_poet_field + '"]:checked';
    if (clicked_circle_directly) {
        if (sonnet_idx_to_match < 154){
            entered_number = sonnet_idx_to_match + 1;
            author = "Shakespeare";
        } else if (sonnet_idx_to_match < 243){
            entered_number = sonnet_idx_to_match - 153;
            author = "Spenser";
        } else {
            entered_number = sonnet_idx_to_match - 242;
            author = "Sidney";
        }
        var author_class = '.' + author.toLowerCase() + author_radio_classname;
        $(author_class).prop('checked', true)   
        document.getElementById(id_for_entered_number).value = String(entered_number);
    }
    else {
        entered_number = document.getElementById(id_for_entered_number).value;
        author = document.querySelector(poetQuery).value;
        if (author == "Shakespeare"){
            if (entered_number > 154) { //deal with someone entering number out of range
                entered_number = 154
            }
            sonnet_idx_to_match = entered_number - 1;
        } else if (author == "Spenser") {
            if (entered_number > 89) {
                entered_number = 89
            }
            sonnet_idx_to_match = Number(entered_number) + 153;
        } else if (author == "Sidney") {
            if (entered_number > 108){
                entered_number = 108;
            }
            sonnet_idx_to_match = Number(entered_number) + 242;
        }
        document.getElementById(id_for_entered_number).value = String(entered_number);
        if (id_for_displaying_text == "#sonnet"){
            sonnet_idx = sonnet_idx_to_match;
        } else if (id_for_displaying_text == "#sonnet2"){
            sonnet_idx2 = sonnet_idx_to_match;
        }
    }
    
    $(id_for_displaying_text).html(sonnets[sonnet_idx_to_match]);

    d3.selectAll("circle")
        .style("fill", function(d){ return authorColorScale(d.author);}) // color based on author
        .attr("r", function(d){  
            if (d.sonnet_id == sonnet_idx_to_match){
                return 8;
            } else if (typeof d.author == "undefined"){
                return 1;
            } else {
                return 4;
            }
        })
        .attr("stroke-width", function(d){ 
            return (d.sonnet_id == sonnet_idx_to_match ? 1 : 0)
        })
}

/* Set all circle sizes to default, circle stroke-widths to 0, scatter sonnet text to empty */
function unset_sonnet(){
    d3.selectAll("circle")
        .style("fill", function(d){ return authorColorScale(d.author);})
        .attr("r", 4)
        .attr("stroke-width", 0)
    $("#sonnet-2d").html("")
}

$("#unhighlight-sonnet").click(unset_sonnet);
$("#display-sonnet-2d").click(function(){set_sonnet("sonnet_number-2d", "poet", "#sonnet-2d", 0, false) });
