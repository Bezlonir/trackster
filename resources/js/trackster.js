var Trackster = {};
var API_KEY = "e943d1e8913e758cf4a60b7239f1731d";

$(document).on('touchstart', function() {
    detectTap = true; //detects all touch events
});
$(document).on('touchmove', function() {
    detectTap = false; //Excludes the scroll events from touch events
});
$(document).on('click touchend', function(event) {
    if (event.type == "click") detectTap = true; //detects click events
       if (detectTap){
          //here you can write the function or codes you wanna execute on tap

       }
 });


//runtime
$(document).ready(function() {
  //Event handler for click on search button.
  //Calls a search by song title.
  $("#search-button").click(function(){
    var searchText = $("#search-input").val();
    if (searchText) {
        Trackster.searchTracksByTitle(searchText);
    };

  });     //<----#search-button

  $("#search-button").on("vclick", function(){
      $('#search-button').click();//Trigger search button click event
  });     //<----#search-button

  //Event handler for the enter key on the
  //input box. Simulates a click.
  $("#search-input").keypress(function(e){
    if(e.which == 13){//Enter key pressed
        $('#search-button').click();//Trigger search button click event
      };
    });   //<----#search-input

  //Sort table by song if song header is
  //clicked.
  $("#song-head").click(function() {
    sortTable("song");
  });

  $("#artist-head").click(function() {
    sortTable("artist");
  });

  $("#listeners-head").click(function() {
    sortTable("listeners");
  });

});

// convert a number to a string with commas
formatNum = function(num){
    return num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

// api key: e943d1e8913e758cf4a60b7239f1731d
// secret: f846b41beb0374a5f6889fc9154ba959

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  $("#search-container").empty();
  $("#site-logo").fadeTo(200,1);
  $("#search-input").val('');
  for (i = 0; i < tracks.results.trackmatches.track.length; i++) {
    var thisTitle = tracks.results.trackmatches.track[i].name;
    var thisArtist = tracks.results.trackmatches.track[i].artist;
    var thisPic = tracks.results.trackmatches.track[i].image[1]["#text"];
    var thisListeners = tracks.results.trackmatches.track[i].listeners;
    var listenerString = formatNum(thisListeners);
    var thisURL = tracks.results.trackmatches.track[i].url;
    // contain html for a track listing
    var searchResult =
      '<div id="search-results" class="row search-results">' +
        '<div class="col-xs-1 col-xs-offset-1">' +
          '<i class="fa fa-play-circle-o"></i>' +
        '</div>' +
        '<div class="song-title col-xs-4">' +
          '<span>' + thisTitle
          + '</span>' +
        '</div>' +
        '<div class="artist col-xs-2">' +
          '<span>' + thisArtist
          + '</span>' +
        '</div>' +
        '<div class="artwork col-xs-2">' +
          '<a href="' + thisURL +
          '"><img src="' + thisPic + '"/></a>' +
        '</div>' +
        '<div class="listeners col-xs-2">' +
          '<span>' + listenerString
          + '</span>' +
        '</div>' +
      '</div>';

      $('#search-container').append(searchResult);
  }         // <--- for loop
};          // <--- renderTracks

/*
  Given a search term as a string, query the LastFM API.
  Call renderTracks to render the tracks given in the API query response.
*/
  Trackster.searchTracksByTitle = function(title) {
  $.ajax({
    url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+title+"&api_key="+API_KEY+"&format=json",
    datatype:'jsonp',
    success: function(track_data) {
      console.log(track_data);
      $("#site-logo").fadeTo(200,0.6);
      Trackster.renderTracks(track_data);

    }
});
};

function sortTable(sortOperator) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById('search-container');
  console.log(table);
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByClassName("search-results");
    console.log(rows);
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 0; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      if (sortOperator === "song") {
          x = rows[i].getElementsByClassName("song-title")[0];
          y = rows[i + 1].getElementsByClassName("song-title")[0];
        } else if (sortOperator === "artist") {
          x = rows[i].getElementsByClassName("artist")[0];
          y = rows[i + 1].getElementsByClassName("artist")[0];
        } else if ( sortOperator == "listeners") {
          x = rows[i].getElementsByClassName("listeners")[0];
          y = rows[i + 1].getElementsByClassName("listeners")[0];

      };
      console.log(x);
      // Check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        // I so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
