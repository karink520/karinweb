var startDate = new Date(2019, 07, 19); //start on a Monday; for month, use number -1 (i.e. August is 07)
var endDate = new Date(2019, 09, 27); //Sunday
var trainingDays = Math.round((endDate - startDate)/(1000*60*60*24) + 1);
var numWeeks = trainingDays / 7 + 1;
var weeklyMiles = [];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', "Nov", 'Dec'];
for (i = 0; i < parseInt(numWeeks); i++){
  weeklyMiles.push("0");
}

/*Create a table of the proper length and lable it with dates
Using startDate and numWeeks
*/
function loadTable(){
  for (i = 0; i < numWeeks - 1; i++){
    var calendar = document.getElementById('calendar');
    calendar.innerHTML += "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td class ='weeklytotal'''></td></tr>"
  }
  var tableDatas = document.getElementsByTagName("td");
  var cellDate = new Date(startDate);
  for(var cellIndex = 0; cellIndex < tableDatas.length; cellIndex++) {
    if(tableDatas[cellIndex].className != "weeklytotal") {
      tableDatas[cellIndex].setAttribute("id",getTextDate(cellDate));
      if (cellDate.getDate() == 1) {
        tableDatas[cellIndex].innerHTML="<p>" + months[cellDate.getMonth()] + " " + cellDate.getDate() + "</p>";
      } else {
        tableDatas[cellIndex].innerHTML="<p>" + cellDate.getDate() + "</p>";
      }
      cellDate.setDate(cellDate.getDate() + 1);
    }
  }
}

function loadMileageTotals(){
     var totals = document.getElementsByClassName("weeklytotal");
     for (var i = 0; i < totals.length; i++) {
       if (totals[i].innerHTML != "0")  {
         if(weeklyMiles[i] != 0) {
         totals[i].innerHTML = weeklyMiles[i].toFixed(1) + " miles";
       }
      }
    }
  }

function showRunDetails(par){
    par.innerHTML += detailsOnHover[par.parentElement.id];
}

function hideRunDetails(par){
    par.innerHTML = details[par.parentElement.id];
}
