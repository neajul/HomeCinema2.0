// global vars
var now = new Date();
var open = false;
var player = new Vimeo.Player(document.getElementById('cinema'));



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

  // light mode/dark mode
  $('.light-dark input').click(function() {
    $('body').toggleClass("light");
    $('body').toggleClass("dark");
  });

  // open-close menu
  $('#toggle-menu').click(function(){
    $('.main-nav').toggleClass('hide');
  });

  // add open cinema function
  $('.cinema-button').click(function(){
    openCloseCinema();
  });

  // open chat
  $('.chat-button').click(function(){
    $(this).toggleClass('chat-open');
    $('.chat-container').toggleClass('chat-open');
  });
});



// functions
function openCloseCinema(){
  // toggle the classes
  $('.header, #body .wrapper').toggleClass('cinema-open');
  // do the thing
  if (open) {
    // close
    $({someValue: 100}).animate({someValue: 0}, {
      duration: 800,
      step: function() {
        player.setVolume(Math.ceil(this.someValue)/100);
      }, complete: function(){
        player.setMuted(true);
      },
    });
  } else {
    // open
    player.play();
    player.setMuted(false);
    $({someValue: 0}).animate({someValue: 100}, {
      duration: 800,
      step: function() {
        player.setVolume(Math.ceil(this.someValue)/100);
      }
    });
  }
  // toggle open variable
  open = !open;
}

// function to check which item is going to be next
function checkCurrentOrNext(){
  // this function works, because i sort the playorder in twig, so i can be sure we start at the earliest and end at the latest
  var found = false;
  // update now
  now = new Date();
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
