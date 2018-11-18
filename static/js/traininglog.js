var activitiesByDate={"2018-08-01": ["sample run"]};
var detailsOnHover= {"2018-08-01": "Lovely run!"};
var activityIds={"2018-08-01": "Lovely run!"};;
/*activities?before=&after=&page=&per_page="*/

function loadData(){
  processData(myData);
}

function processData(data){
  for(i = 0; i< data.length; i++){
    var dateString = data[i].start_date.substring(0,10);
    if (data[i].type == "Run"){
      var miles = metersToMiles(data[i].distance);
      var min = processMovingTime(data[i].moving_time);
      var pace = metersPerSecondtoMinutesPerMile(data[i].average_speed);
      var nameString = "<span class='name'> RUN: </span></br>"
      var detailsString = miles + " miles <br> " + pace + " pace <br>" + min + " min </p>";
      addMileageToTotal(dateString, miles);
    } else {
      var nameString = "<span class='name'>" + data[i].type.toUpperCase() + ": </span></br>";
      var detailsString = "<sp>" + processMovingTime(data[i].elapsed_time) + " min </p>";
    }
      detailsOnHover[dateString] = "<p>" + data[i].description + "</p>";
      if (typeof activitiesByDate[dateString] == 'undefined') {
        activitiesByDate[dateString] = [];
      }
      activitiesByDate[dateString].push({"name": nameString, "details": detailsString});
      if (document.getElementById(dateString) != null){
        document.getElementById(dateString).innerHTML +=  nameString + detailsString; /*"<p onmouseover='showRunDetails(this)' onmouseout='hideRunDetails(this)'>"*/
      }

  }
    loadMileageTotals();
}

function addMileageToTotal(dateString, miles){
    var date = new Date(dateString);
    var trainingDay = (date - startDate)/(1000*60*60*24) + 1;
    var index = Math.floor(trainingDay / 7);
    weeklyMiles[index] = parseFloat(weeklyMiles[index]) + parseFloat(miles);
}
