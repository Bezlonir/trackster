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

};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  $.ajax({
    url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+title+"&api_key="+API_KEY+"&format=json",
    datatype:'jsonp',
    success: function() {
      console.log("data pulled");}
});
};
