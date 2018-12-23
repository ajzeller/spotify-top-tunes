/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
// function getHashParams() {
//   var hashParams = {};
//   var e, r = /([^&;=]+)=?([^&;]*)/g,
//       q = window.location.hash.substring(1);
//   while ( e = r.exec(q)) {
//      hashParams[e[1]] = decodeURIComponent(e[2]);
//   }
//   return hashParams;
// }

// Handlebars Helpers

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;

});

Handlebars.registerHelper("truncate", function(value, desired_length)
{
  if(value.length > desired_length){
    return value.substring(0, desired_length) + '...';
  }
  else {
    return value;
  }

});

Handlebars.registerHelper('formatCommas', function(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});

Handlebars.registerPartial('filterButtons', $("#filter-buttons").html());
Handlebars.registerPartial('footer', $("#footer").html());

var userProfile;
var tracksShort = [ ];
var tracksMedium = [ ];
var tracksLong = [ ];
var tracksRecent = [ ];
var artistsShort = [ ];
var artistsMedium = [ ];
var artistsLong = [ ];
var trackList;
var desiredTracksCount = 50;

// set intial conditions (Recent, Tracks)
var listType = 'tracks';
var listRange = "short";

// detect mobile or desktop device

var desktop;
window.matchMedia("(max-width: 767px)").matches ? desktop = false : desktop = true;
// console.log(`Desktop? ${desktop}`);

// get top tracks and artists for all durations

function api_query() {

  // get access token 

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {

    // console.log(data);
    // document.getElementById('filterButtons').innerHTML = filterButtons();
    var access_token = data.access_token;

    // request tracks + short

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/' + 'tracks' + '?time_range=' + 'short' + '_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          tracksShort = response;
          console.log(tracksShort);
        }
    });

        // request tracks + medium

        $.ajax({
          url: 'https://api.spotify.com/v1/me/top/' + 'tracks' + '?time_range=' + 'medium' + '_term&limit=50',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            tracksMedium = response;
            console.log(tracksMedium);
          }
      });

          // request tracks + long

    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + 'tracks' + '?time_range=' + 'long' + '_term&limit=50',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        tracksLong = response;
        console.log(tracksLong);
      }
  });

  // request tracks + recent

  $.ajax({
    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function(response) {
      tracksRecent = response;
      console.log(tracksRecent);
    }
  });

  // request artists + short

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/' + 'artists' + '?time_range=' + 'short' + '_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          artistsShort = response;
          console.log(artistsShort);
        }
    });

  // request artists + medium

    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + 'artists' + '?time_range=' + 'medium' + '_term&limit=50',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        artistsMedium = response;
        console.log(artistsMedium);
      }
  });

  // request artists + long

    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + 'artists' + '?time_range=' + 'long' + '_term&limit=50',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        artistsLong = response;
        console.log(artistsLong);
      }
    });

  });

}


function media_request(type, range) {
  // console.log( type + ' over ' + range + " was clicked");


  // console.log(isTracks);

  

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {

    // console.log(data);
    // document.getElementById('filterButtons').innerHTML = filterButtons();
    var access_token = data.access_token;

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/' + 'tracks' + '?time_range=' + range + '_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          console.log(response);
          trackList = response;
          // document.getElementById('filter-Buttons').innerHTML = filterButtons();
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          // displayCharts(response);
          // if (listType == 'tracks') {
          //   document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          //
          // } else {
          //   document.getElementById('topArtists').innerHTML = topArtistsTemplate(response);
          // }
          // listType == 'tracks' ? document.getElementById('topTracks').innerHTML = topTracksTemplate(response) : document.getElementById('topTracks').innerHTML = topArtistsTemplate(response);
          document.getElementById('filterButtons').innerHTML = filterButtons();
          $('.btn-' + range).button('toggle');
          $('.btn-' + type).button('toggle');
          // $("topTracks").toggleClass("show-mobile");
          // $("topArtists").toggleClass("hide-mobile");
          // $('.btn-' + type).button('toggle');
          // let responseJSON = response;
          // let responseJSON = JSON.stringify(response);
          // Cookies.set('tracksShort', responseJSON);
          // console.log(responseJSON);
        }
    });

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/' + 'artists' + '?time_range=' + range + '_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          console.log(response);
          // document.getElementById('filter-Buttons').innerHTML = filterButtons();
          document.getElementById('topArtists').innerHTML = topArtistsTemplate(response);
          // displayCharts(response);
          // if (listType == 'tracks') {
          //   document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          //
          // } else {
          //   document.getElementById('topArtists').innerHTML = topArtistsTemplate(response);
          // }
          // listType == 'tracks' ? document.getElementById('topTracks').innerHTML = topTracksTemplate(response) : document.getElementById('topTracks').innerHTML = topArtistsTemplate(response);
          document.getElementById('filterButtons').innerHTML = filterButtons();
          $('.btn-' + range).button('toggle');
          $('.btn-' + type).button('toggle');

          // desiredTracksCount = 50;
          document.getElementById('add-playlist').innerHTML = "Add Top <span id='trackCount'>" + desiredTracksCount + "</span> to Library";

          // $('.btn-' + type).button('toggle');
          // let responseJSON = response;
          // let responseJSON = JSON.stringify(response);
          // Cookies.set('tracksShort', responseJSON);
          // console.log(responseJSON);
        }
    });

  });
}

function increaseDesiredTracksCount() {
  console.log("you pressed increase");
  if (desiredTracksCount < 50) {
    desiredTracksCount += 5;
    document.getElementById('trackCount').innerHTML = desiredTracksCount;
    console.log(desiredTracksCount);
  }
  else {

  }
}

function decreaseDesiredTracksCount() {
  console.log("you pressed decrease");
  if (desiredTracksCount > 5) {
    desiredTracksCount -= 5;
    document.getElementById('trackCount').innerHTML = desiredTracksCount;
    console.log(desiredTracksCount);
  }
  else {

  }
}

function displayCharts() {

  switch(listRange) {
    case "short":
      document.getElementById('topTracks').innerHTML = topTracksTemplate(tracksShort);
      document.getElementById('topArtists').innerHTML = topArtistsTemplate(artistsShort);
      trackList = tracksShort;
    break;

    case "medium":
      document.getElementById('topTracks').innerHTML = topTracksTemplate(tracksMedium);
      document.getElementById('topArtists').innerHTML = topArtistsTemplate(artistsMedium);
      trackList = tracksMedium;
    break;

    case "long":
      document.getElementById('topTracks').innerHTML = topTracksTemplate(tracksLong);
      document.getElementById('topArtists').innerHTML = topArtistsTemplate(artistsLong);
      trackList = tracksLong;
    break;

    case "recent":
      if  (listType == 'tracks') {
        console.log(listType);
        console.log("listType is tracks");

        document.getElementById('topTracks').innerHTML = recentTracksTemplate(tracksRecent);
        trackList = tracksRecent;
        $('.btn-artists').addClass('disabled');
        
      } else {
        listType = 'tracks';
        console.log(listType);
        console.log("clicked recent while artists selected");

        $("#topTracks").toggleClass("show");
        $("#topArtists").toggleClass("show");

        document.getElementById('topTracks').innerHTML = recentTracksTemplate(tracksRecent);
        $('.btn-' + listType).button('toggle');
        trackList = tracksRecent;
        $('.btn-artists').addClass('disabled');
      }
      
    break;

  }
}

// function typeClicked(type) {
//   listType = type; //updates list type

//   // switches tracks/artists visibility on mobile 

//   $("#topTracks").toggleClass("show");
//   $("#topArtists").toggleClass("show");

//   media_request(listType, listRange);
// }

// function rangeClicked(range) {
//   listRange = range; //updates duration type

//   $('.btn-' + range).button('toggle');

//   media_request(listType, listRange);
// }

// trying alt approach

function typeClicked_2(type) {
  if (type != listType ) {
    
    if (listRange != 'recent') {
    
      //updates list type

    listType = type; 
    console.log(listType);
    console.log(listRange);


    // toggles active state of type/range buttons

    document.getElementById('filterButtons').innerHTML = filterButtons();
    $('.btn-' + listType).button('toggle');
    $('.btn-' + listRange).button('toggle');

    // switches tracks/artists visibility on mobile 

    $("#topTracks").toggleClass("show");
    $("#topArtists").toggleClass("show");

    displayCharts();

    } else {
      document.getElementById('filterButtons').innerHTML = filterButtons();
      $('.btn-' + listType).button('toggle');
      $('.btn-' + listRange).button('toggle');
      $('.btn-artists').addClass('disabled');


      console.log("last played is only for tracks");

    }

    document.getElementById('add-playlist').innerHTML = "Add Top <span id='trackCount'>" + desiredTracksCount + "</span> to Library";

  } else {
    console.log("you already clicked this type");
  }
}


function rangeClicked_2(range) {
  listRange = range; //updates duration type
  console.log(listType);
    console.log(listRange);

    // toggles active state of type/range buttons


    document.getElementById('filterButtons').innerHTML = filterButtons();
    $('.btn-' + listType).button('toggle');
    $('.btn-' + listRange).button('toggle');

  displayCharts();

  document.getElementById('add-playlist').innerHTML = "Add Top <span id='trackCount'>" + desiredTracksCount + "</span> to Library";

}

// Saves the tracks from the currently selected duration as a playlist in user's Library

function create_playlist() {
  console.log(userProfile);
  console.log(listType);
  console.log(listRange);

  userId = userProfile.id;
  console.log(userId);

  
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
  var date = new Date();
  
  var month = months[date.getMonth()].substring(0,3);
  var year = date.getFullYear();

  var timePeriod = "";
  var playlistTracks = [ ];
  // playlistTracks.length =  trackList.items.length-1;
  console.log(playlistTracks);

  switch(listRange) {
    case "recent":
      timePeriod = "Recently Played";
      break;
    case "short":
      timePeriod = "Past Month";
      break;
    case "medium":
      timePeriod = "Past 6 Months";
      break;
    case "long":
      timePeriod = "All Time";
      break;
  }
if (listRange != 'recent') {
  for (i=0; i < desiredTracksCount; i++) {
    playlistTracks.push("spotify:track:" + trackList.items[i].id);
  }
} else {
  for (i=0; i < desiredTracksCount; i++) {
    playlistTracks.push("spotify:track:" + trackList.items[i].track.id);
  }
}
  

  console.log(playlistTracks);

  console.log(timePeriod);
  console.log(trackList.items.length);

  var playlistName = "mytop" + desiredTracksCount + " " + timePeriod + " (" + month + " " + year + ")";
  // var playlistName = "mytop50";

  console.log(playlistName);
  
  var urlString = 'https://api.spotify.com/v1/users/' + userId + '/playlists';

  var jsonData = {
    "name": playlistName,
    "public": false
  };

  var addTracksData = {
    "uris": playlistTracks,
  };

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {

    // console.log(data);
    var access_token = data.access_token;

    $.ajax({
      type: 'POST',
      url: urlString,
      data: JSON.stringify(jsonData),
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json',
      },
      
      success: function(result) {
        playlistId = result.id;
        var urlStringAddTracks = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';

        console.log(playlistId);
        console.log('Add Playlist success! :)');
        console.log(access_token);

        $.ajax({
          type: 'POST',
          url: urlStringAddTracks,
          data: JSON.stringify(addTracksData),
          dataType: 'json',
          headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json',
          },
          
          success: function(result) {
            console.log('Add tracks to playlist success! :)');
            document.getElementById('add-playlist').innerHTML = 'Playlist added 👌';
    
            
          },
          error: function() {
            console.log('Error adding tracks! :(');
          }
        });

      },
      error: function() {
        console.log('Error adding playlist! :(');
      }
    });

  });

};







// var testTemplateSource = document.getElementById('test-template').innerHTML,
//     testTemplate = Handlebars.compile(testTemplateSource),
//     testTemplatePlaceholder = document.getElementById('testTemplate');
// console.log(api_response);
// testTemplatePlaceholder.innerHTML = testTemplate(api_response);

    // userProfilePlaceholder = document.getElementById('user-profile'); // output of handlebars function placed in element
var topTracksSource = document.getElementById('top-tracks-template').innerHTML,
    topTracksTemplate = Handlebars.compile(topTracksSource);
    // topTracksPlaceholder = document.getElementById('topTracks');
// var params = getHashParams();

var recentTracksSource = document.getElementById('recent-tracks-template').innerHTML,
    recentTracksTemplate = Handlebars.compile(recentTracksSource);

var navbarSource = document.getElementById('navbar-Template').innerHTML,
    navbarTemplate = Handlebars.compile(navbarSource);

var topArtistsSource = document.getElementById('top-artists-template').innerHTML,
    topArtistsTemplate = Handlebars.compile(topArtistsSource);

var filterButtonsSource = document.getElementById('filter-buttons').innerHTML,
    filterButtons = Handlebars.compile(filterButtonsSource);

var footerSource = document.getElementById('footerSection').innerHTML,
    footerSection = Handlebars.compile(footerSource);


document.getElementById('footer').innerHTML = footerSection();


// var access_token = params.access_token,
//     refresh_token = params.refresh_token,
//     error = params.error;

var access_token = Cookies.get('access_token');
var refresh_token = Cookies.get('refresh_token'),
    error = false;
var response_preloaded = Cookies.get('preloaded'),
    error = false;

// console.log(response_preloaded);
// console.log('test');
// console.log(access_token);

// function deleteCookies(){
//   let cookies = ['preloaded', 'tracksShort']

//   for (i=0; i < cookies.length; i++) {
//     Cookies.remove(cookies[i]);
//     console.log(cookies[i] + ' was removed');
//   };

//   // Cookies.remove('refresh_token');
//   // Cookies.remove('preloaded');
//   console.log("refreshed");
//   location.reload();
// }



function signOut(){
  let cookies = ['refresh_token', 'preloaded', 'tracksShort']

  for (i=0; i < cookies.length; i++) {
    Cookies.remove(cookies[i]);
    console.log(cookies[i] + ' was removed');
  };

  // Cookies.remove('refresh_token');
  // Cookies.remove('preloaded');
  console.log("refreshed");
  location.reload();
}

if (refresh_token) {



  // if refresh token cookie exists, display the default views

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {
    console.log(data);
    var access_token = data.access_token;
    // console.log(access_token);

    // oauthPlaceholder.innerHTML = oauthTemplate({
    //   access_token: access_token,
    //   refresh_token: refresh_token
    // });



    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          // document.getElementById('user-profile').innerHTML = userProfileTemplate(response); // handlebars inserts response into function
          document.getElementById('navbarTemplate').innerHTML = navbarTemplate(response); // handlebars inserts response into function
          userProfile = response;
          console.log(userProfile);
          // console.log(response);
          $('#login').hide();
          $('#loggedin').show();
          Cookies.set('preloaded', true);
          response_preloaded = Cookies.get('preloaded');
          console.log(response_preloaded);
        }
    });

    $("#topTracks").toggleClass("show");
    // $("#topArtists").toggleClass("show");

    var promise = new Promise(function(resolve, reject) {
      api_query();

      if(true) {
        resolve("it worked");
      }
      else {
        reject(Error("It broke"));
      }
    });

    // promise.then(function(result) {
    //   displayCharts();
    // }, function(err) {
    //   console.log("error");
    // });
    
    media_request(listType, listRange);


  });



} else {
    // render initial screen
    $('#login').show();
    $('#loggedin').hide();
};
