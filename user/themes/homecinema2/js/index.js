// now
var now = new Date();

// on load
$(function(){
  // feather icons
  feather.replace();

  // check every x seconds what's playing now
  var secs = 60;
  (function(){
    checkCurrentOrNext();
    setTimeout(arguments.callee, secs * 1000);
  })();
});

// function to check which item is going to be next
// this function works, because i sort the playorder in twig, so i can be sure we start at the earliest and end at the latest
function checkCurrentOrNext(){
  var found = false;
  // update now
  now = new Date();
  console.log("now:");
  console.log(now);
  console.log(" ");
  // loop through all playorder items
  $('.playorder li').each(function(){
    // get start/end times
    var datetime = $(this).data("time").split(" ");
    var date = datetime[0].split("-");
    var time = datetime[1].split(":");
    var startTimeDate = new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
    var endTimeDate = new Date(startTimeDate.getTime() + $(this).data("duration") * 60000);

    // first check if this event is now
    if (startTimeDate < now && endTimeDate > now) {
      if (found == false) {
        // this is the current event!
        found = true;
        var sentence = "Now playing: <em>" + $(this).data("title") + "</em> by " + $(this).data("author") + " +++"
        $('.now-playing').html(sentence);
      }
    } else if (startTimeDate > now && endTimeDate > now) {
      if (found == false) {
        // this is the next event!
        found = true;
        var sentence = "Next Up: <em>" + $(this).data("title") + "</em> by " + $(this).data("author") + " +++"
        $('.now-playing').html(sentence);
      }
    }
  });
}
