var Trackster = {};
var API_KEY = "e943d1e8913e758cf4a60b7239f1731d";
$(document).ready(function() {
  $("#search-button").click(function(){
    var searchText = $("#search-input").val();
    Trackster.searchTracksByTitle(searchText);
  });
});

// api key: e943d1e8913e758cf4a60b7239f1731d
// secret: f846b41beb0374a5f6889fc9154ba959

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks.
*/
Trackster.renderTracks = function(tracks) {
  for (i = 0; i < tracks.results.trackmatches.track.length; i++) {
    var thisTitle = tracks.results.trackmatches.track[i].name;
    var thisArtist = tracks.results.trackmatches.track[i].artist;
    var thisPic = tracks.results.trackmatches.track[i].image[1]["#text"];
    var thisListeners = tracks.results.trackmatches.track[i].listeners;
    var searchResult =
      '<div id="search-results" class="row">' +
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
          '<img src="' + thisPic +'"/>' +
        '</div>' +
        '<div class="popularity col-xs-2">' +
          '<span>' + thisListeners
          + '</span>' +
        '</div>' +
      '</div>';

      $('#search-container').append(searchResult);
  }
};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
  Trackster.searchTracksByTitle = function(title) {
  $.ajax({
    url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+title+"&api_key="+API_KEY+"&format=json",
    datatype:'jsonp',
    success: function(track_data) {
      Trackster.renderTracks(track_data);
    }
});
};
