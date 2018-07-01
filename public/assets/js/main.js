/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}


var userProfileSource = document.getElementById('user-profile-template').innerHTML, // handlebars gets template
    userProfileTemplate = Handlebars.compile(userProfileSource), // handlebars compiles template into function
    userProfilePlaceholder = document.getElementById('user-profile'); // output of handlebars function placed in element
var topTracksSource = document.getElementById('top-tracks-template').innerHTML,
    topTracksTemplate = Handlebars.compile(topTracksSource);
    topTracksPlaceholder = document.getElementById('topTracks');
// var params = getHashParams();

// var access_token = params.access_token,
//     refresh_token = params.refresh_token,
//     error = params.error;

var access_token = Cookies.get('access_token'),
    refresh_token = Cookies.get('refresh_token');
     error = false;

console.log('test');
console.log(access_token);

if (error) {
  alert('There was an error during the authentication');
} else {
  if (access_token) {
    // render oauth info
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
          userProfilePlaceholder.innerHTML = userProfileTemplate(response); // handlebars inserts response into function
          console.log(response);
          $('#login').hide();
          $('#loggedin').show();
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          topTracksPlaceholder.innerHTML = topTracksTemplate(response);
          console.log(response);
          $('#login').hide();
          $('#loggedin').show();
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
          console.log(response);
          $('#login').hide();
          $('#loggedin').show();
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
          console.log(response);
          $('#login').hide();
          $('#loggedin').show();
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
          console.log(response);
          $('#login').hide();
          $('#loggedin').show();
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
          console.log(response);
          $('#login').hide();
          $('#loggedin').show();
        }
    });
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
          console.log(response);
          $('#login').hide();
          $('#loggedin').show();
        }
    });

  } else {
      // render initial screen
      $('#login').show();
      $('#loggedin').hide();
  }

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
}
