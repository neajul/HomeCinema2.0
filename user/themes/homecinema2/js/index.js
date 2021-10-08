// global vars
var now = new Date();
var open = false;
var player = new Vimeo.Player(document.getElementById('cinema'));
var next = new Date();

// idle function for cinema
var idleTimer = null;
var idleState = false;
var idleWait = 2000;



// on load
$(function(){
  // feather icons
  feather.replace();

  // check every x seconds what's playing now
  var secs = 30;
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
  $('.close-menu').click(function(){
    $('.main-nav').addClass('hide');
  });
  // check if menu is visible, and add click anywhere else to close it
  $(document).click (function (e) {
    // first check that we are not clicking the menu button
    if (e.target != $('#toggle-menu')[0]) {
      // then check if menu is open, and if that we are not clicking it
      if ($('.main-nav').is(':visible') && e.target != $('.main-nav')[0]) {
        // hide menu
        $('.main-nav').addClass('hide');
      }
    }
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

  // hide cinema buttons after a while (only desktop)
  if (!isTouchDevice()) {
    $('*').bind('mousemove keydown scroll', function(){
      showHideInterface();
    });
  }

  // Update a count down every 1 second
  var x = setInterval(function() {
    countdownUpdate();
  }, 1000);
});



// FUNctions

// leading zeros
const zeroPad = (num, places) => String(num).padStart(places, '0');

// update counter
function countdownUpdate(){
  // check if ther is a movie playing
  if (next > now) {
    // do the counter thing
    now = new Date();
    // find distance between the date and now
    var distance = next - now;
    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Display result in time element
    $('#countdown-counter').text("Next Screening in: " + zeroPad(hours, 2) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2) + " 🍿");
    // If the count down is finished, do things
    if (distance < 0) {
      // clear the counter
      $('#countdown-counter').text("");
    }
  } else {
    // clear the counter
    $('#countdown-counter').text("");
  }

}

// check if we're on phone
function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

// fade the chat buttons in out out
function showHideInterface(){
  clearTimeout(idleTimer);
  if (idleState == true) {
    // Reactivated event
    $('.cinema-interface').removeClass('fade-out');
  }

  idleState = false;
  idleTimer = setTimeout(function () {
    // Idle Event
    $('.cinema-interface').addClass('fade-out');
    idleState = true;
  }, idleWait);
}

// open or close the cinema
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
        $('.now-playing .playing-info').html(sentence);
        // make the next varable same as now for the counter script to know we are playing a movie
        next = now;
      }
    } else if (startTimeDate > now && endTimeDate > now) {
      if (found == false) {
        // this is the next event!
        found = true;
        var sentence = "Next Up: <em>" + $(this).data("title") + "</em> by " + $(this).data("author") + " +++"
        $('.now-playing .playing-info').html(sentence);
        // make the next varable same as the start date of this for the counter script to know what's up
        next = startTimeDate;
      }
    }
  });
}
