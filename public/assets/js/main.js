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
var tracksShort;
var tracksMedium;
var tracksLong;
var artistsShort;
var artistsMedium;
var artistsLong;
var trackList;
var desiredTracksCount = 50;

// set intial conditions (Recent, Tracks)
var listType = 'tracks';
var listRange = "short";

// detect mobile or desktop device
var desktop;
window.matchMedia("(max-width: 767px)").matches ? desktop = false : desktop = true;
console.log(`Desktop? ${desktop}`);



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

function displayCharts(response) {
  if (listType == 'tracks') {
    document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
    $("#topTracks").css("display", "block");
    $("#topArtists").css("display", "none");
  } else {
    document.getElementById('topArtists').innerHTML = topArtistsTemplate(response);
    $("#topTracks").css("display", "none");
    $("#topArtists").css("display", "block");
  }
}

function typeClicked(type) {
  listType = type; //updates list type
  $("#topTracks").toggleClass("show");
  $("#topArtists").toggleClass("show");

  media_request(listType, listRange);
}

function rangeClicked(range) {
  listRange = range; //updates duration type
  media_request(listType, listRange);
}


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
    case "short":
      timePeriod = "Recent";
      break;
    case "medium":
      timePeriod = "6 Months";
      break;
    case "long":
      timePeriod = "All Time";
      break;
  }

  for (i=0; i < desiredTracksCount; i++) {
    playlistTracks.push("spotify:track:" + trackList.items[i].id);
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

function deleteCookies(){
  let cookies = ['preloaded', 'tracksShort']

  for (i=0; i < cookies.length; i++) {
    Cookies.remove(cookies[i]);
    console.log(cookies[i] + ' was removed');
  };

  // Cookies.remove('refresh_token');
  // Cookies.remove('preloaded');
  console.log("refreshed");
  location.reload();
}

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

function updateClick(){
  console.log("update was clicked");
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
    media_request(listType, listRange);

    // $.ajax({
    //     url: 'https://api.spotify.com/v1/me/top/' + listType + '?time_range=' + listRange + '_term&limit=50',
    //     headers: {
    //       'Authorization': 'Bearer ' + access_token
    //     },
    //     success: function(response) {
    //
    //       // console.log(response);
    //       document.getElementById('filterButtons').innerHTML = filterButtons();
    //       document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
    //       $('.btn-' + listRange).button('toggle');
    //       $('.btn-' + listType).button('toggle');
    //       let responseJSON = response;
    //       // let responseJSON = JSON.stringify(response);
    //       Cookies.set('tracksShort', responseJSON);
    //       console.log(responseJSON);
    //     }
    // });

  });


  if(false) {
    // if topMedia hasn't been requested, request and save as cookies



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
            document.getElementById('user-profile').innerHTML = userProfileTemplate(response); // handlebars inserts response into function
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

      $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            // console.log(response);
            document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
            let responseJSON = response;
            // let responseJSON = JSON.stringify(response);
            Cookies.set('tracksShort', responseJSON);
            console.log(responseJSON);
          }
      });

      $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            // console.log(response);
            // document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
            Cookies.set('tracksMedium', response);
          }
      });

  });
} else {
  // topMedia has already been stored in cookies, exit loop and watch for click events
  console.log('went into else loop');
  // document.getElementById('user-profile').innerHTML = userProfileTemplate(response);
  };

  // $.ajax({
  //   url: '/refresh_token',
  //   data: {
  //     'refresh_token': refresh_token
  //   }
  // }).done(function(data) {
  //   console.log(data);
  //   var access_token = data.access_token;
  //   // console.log(access_token);
  //
  //   // oauthPlaceholder.innerHTML = oauthTemplate({
  //   //   access_token: access_token,
  //   //   refresh_token: refresh_token
  //   // });
  //
  //   Cookies.set('preloaded', true);
  //
  //   $.ajax({
  //       url: 'https://api.spotify.com/v1/me',
  //       headers: {
  //         'Authorization': 'Bearer ' + access_token
  //       },
  //       success: function(response) {
  //         document.getElementById('user-profile').innerHTML = userProfileTemplate(response); // handlebars inserts response into function
  //         userProfile = response;
  //         // console.log(response);
  //         $('#login').hide();
  //         $('#loggedin').show();
  //       }
  //   });
  //
  //   $.ajax({
  //       url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
  //       headers: {
  //         'Authorization': 'Bearer ' + access_token
  //       },
  //       success: function(response) {
  //         // console.log(response);
  //         document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
  //         topTracksShort = response;
  //         $('#login').hide();
  //         $('#loggedin').show();
  //       }
  //   });
  //
  //   $.ajax({
  //       url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
  //       headers: {
  //         'Authorization': 'Bearer ' + access_token
  //       },
  //       success: function(response) {
  //         // console.log(response);
  //         document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
  //         topTracksShort = response;
  //         $('#login').hide();
  //         $('#loggedin').show();
  //       }
  //   }).done(function() {
  //
  //
  //
  //       // $('.btn-long').click(function() {
  //       //   console.log($(this).attr('class')+" button was clicked");
  //       //
  //       //   $.ajax({
  //       //       url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
  //       //       headers: {
  //       //         'Authorization': 'Bearer ' + access_token
  //       //       },
  //       //       success: function(response) {
  //       //         document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
  //       //         console.log(response);
  //       //         $('#login').hide();
  //       //         $('#loggedin').show();
  //       //       }
  //       //   });
  //       //   $(this).toggleClass('active');
  //       // });
  //       //
  //       // $('.btn-medium').click(function() {
  //       //   console.log($(this).attr('class')+" button was clicked");
  //       //
  //       //   $.ajax({
  //       //       url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
  //       //       headers: {
  //       //         'Authorization': 'Bearer ' + access_token
  //       //       },
  //       //       success: function(response) {
  //       //         document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
  //       //         console.log(response);
  //       //         $('#login').hide();
  //       //         $('#loggedin').show();
  //       //       }
  //       //   });
  //       //   $(this).toggleClass('active');
  //       // });
  //
  //
  //
  //
  //
  //
  //   });
  //
  //
  //
  //
  // });



} else {
    // render initial screen
    $('#login').show();
    $('#loggedin').hide();
};

console.log('outside of if loop');




// document.getElementById('btn-long').addEventListener('click', function() {
//
//   console.log($(this).attr('class')+" button was clicked");
//   $.ajax({
//     url: '/refresh_token',
//     data: {
//       'refresh_token': refresh_token
//     }
//   }).done(function(data) {
//     access_token = data.access_token;
//     $.ajax({
//         url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
//         headers: {
//           'Authorization': 'Bearer ' + access_token
//         },
//         success: function(response) {
//           document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
//           console.log(response);
//
//         }
//     });
//     $(this).toggleClass('active');
//   });
// }, false);

function all_time() {
  console.log($(this).attr('class')+" button was clicked");
  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {
    access_token = data.access_token;
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          console.log(response);

        }
    });
    $(this).toggleClass('active');
  });
};



  // document.getElementById('obtain-new-token').addEventListener('click', function() {
  //   $.ajax({
  //     url: '/refresh_token',
  //     data: {
  //       'refresh_token': refresh_token
  //     }
  //   }).done(function(data) {
  //     access_token = data.access_token;
  //     oauthPlaceholder.innerHTML = oauthTemplate({
  //       access_token: access_token,
  //       refresh_token: refresh_token
  //     });
  //   });
  // }, false);

  