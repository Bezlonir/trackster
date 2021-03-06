var Trackster = {};
var API_KEY = "e943d1e8913e758cf4a60b7239f1731d";
var currentSort = '';

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
    url: "https://ws.audioscrobbler.com/2.0/?method=track.search&track="+title+"&api_key="+API_KEY+"&format=json",
    datatype:'jsonp',
    success: function(track_data) {
      $("#site-logo").fadeTo(200,0.6);
      Trackster.renderTracks(track_data);

    }
});
};


// Sort the table of songs by song title, artist, or listeners, per the sortOperator.
function sortTable(sortOperator) {
  // return a nodeList containing each HTML row representing individually a search result
  var rows = document.getElementById('search-container').childNodes;

  // convert nodeList to an array so array methods can be called on it
  var rowsArray = Array.from(rows);

  //set the currentSort variable to check if a reverse sort is needed in the case that the table has been sorted by current method already
  if (sortOperator === currentSort) {
    currentSort = sortOperator + 'Rev';
  } else {
    currentSort = sortOperator;
  }

  // sort the array of song results and assign them to the sortedRows array of HTMLElements
  var sortedRows = rowsArray.sort(function(first, second){
    //sort by song title
    if (sortOperator === "song") {
        x = first.childNodes[1].
        firstChild.textContent.toLowerCase();
        y = second.childNodes[1].
        firstChild.textContent.toLowerCase();
        if (currentSort === "song") {
          return x > y ? 1 : -1;
        } else {
          return x > y ? -1 : 1;
        }

      //sort by artist
      } else if (sortOperator === "artist") {
        x = first.childNodes[2].
        firstChild.textContent.toLowerCase();
        y = second.childNodes[2].
        firstChild.textContent.toLowerCase();
        if (currentSort === "artist") {
          return x > y ? 1 : -1;
        } else {
          return x > y ? -1 : 1;
        }

      // sort by listeners
      } else if ( sortOperator == "listeners") {
        x = parseFloat(first.childNodes[4].
        firstChild.textContent.replace(/,/g, ''));

        y = parseFloat(second.childNodes[4].
        firstChild.textContent.replace(/,/g, ''));

        if (currentSort === "listeners") {
          return x > y ? -1 : 1;
        } else {
          return x > y ? 1 : -1;
        }
      };
    });


    var newTable = document.
    getElementById('search-container');
    $("#search-container").empty();

    sortedRows.forEach(function(row) {
      newTable.append(row);
    });


}
