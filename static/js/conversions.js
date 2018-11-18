function metersToMiles(meters){
    return (meters/ 1609).toFixed(2);
}

function metersPerSecondtoMinutesPerMile(metersPerSecond){
    var minutesPerMile = (1 / metersPerSecond) / 60 * 1609;
    var minutes = Math.floor(minutesPerMile);
    var seconds = Math.round(60 * (minutesPerMile - minutes) );
    if (seconds < 10){
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
}

function processMovingTime(timeInSeconds){
  return Math.round(timeInSeconds / 60)
}

/*Returns a date in the form "2018-08-06"*/
function getTextDate(date){
  var month = date.getMonth() + 1;
  if (month < 10){
    month = "0"+ month;
  }
  var day = date.getDate();
  if (day < 10){
    day = "0" + day;
  }
  return date.getFullYear() + "-" + month + "-" + day;
}
