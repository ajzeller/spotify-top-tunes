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


// var testTemplateSource = document.getElementById('test-template').innerHTML,
//     testTemplate = Handlebars.compile(testTemplateSource),
//     testTemplatePlaceholder = document.getElementById('testTemplate');
// console.log(api_response);
// testTemplatePlaceholder.innerHTML = testTemplate(api_response);
var userProfileSource = document.getElementById('user-profile-template').innerHTML, // handlebars gets template
    userProfileTemplate = Handlebars.compile(userProfileSource); // handlebars compiles template into function
    // userProfilePlaceholder = document.getElementById('user-profile'); // output of handlebars function placed in element
var topTracksSource = document.getElementById('top-tracks-template').innerHTML,
    topTracksTemplate = Handlebars.compile(topTracksSource);
    // topTracksPlaceholder = document.getElementById('topTracks');
// var params = getHashParams();

// var access_token = params.access_token,
//     refresh_token = params.refresh_token,
//     error = params.error;

var access_token = Cookies.get('access_token');
var refresh_token = Cookies.get('refresh_token'),
    error = false;

// console.log('test');
// console.log(access_token);




if (refresh_token) {
  // render oauth info
  // oauthPlaceholder.innerHTML = oauthTemplate({
  //   access_token: access_token,
  //   refresh_token: refresh_token
  // });

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {
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
          console.log(response);
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);

          $('#login').hide();
          $('#loggedin').show();
        }
    }).done(function() {
      console.log('done');

      $('.btn-long').click(function() {
        console.log($(this).attr('class')+" button was clicked");

        $.ajax({
            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
              console.log(response);
              $('#login').hide();
              $('#loggedin').show();
            }
        });
        $(this).toggleClass('active');
      });

      $('.btn-medium').click(function() {
        console.log($(this).attr('class')+" button was clicked");

        $.ajax({
            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
              console.log(response);
              $('#login').hide();
              $('#loggedin').show();
            }
        });
        $(this).toggleClass('active');
      });




    });


    // $.ajax({
    //     url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
    //     headers: {
    //       'Authorization': 'Bearer ' + access_token
    //     },
    //     success: function(response) {
    //       // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
    //       console.log(response);
    //       $('#login').hide();
    //       $('#loggedin').show();
    //     }
    // });

    // $.ajax({
    //     url: 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50',
    //     headers: {
    //       'Authorization': 'Bearer ' + access_token
    //     },
    //     success: function(response) {
    //       // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
    //       console.log(response);
    //       $('#login').hide();
    //       $('#loggedin').show();
    //     }
    // });
    // $.ajax({
    //     url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50',
    //     headers: {
    //       'Authorization': 'Bearer ' + access_token
    //     },
    //     success: function(response) {
    //       // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
    //       console.log(response);
    //       $('#login').hide();
    //       $('#loggedin').show();
    //     }
    // });
    // $.ajax({
    //     url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50',
    //     headers: {
    //       'Authorization': 'Bearer ' + access_token
    //     },
    //     success: function(response) {
    //       // topTracksPlaceholder.innerHTML = topTracksTemplate(response);
    //       console.log(response);
    //       $('#login').hide();
    //       $('#loggedin').show();
    //     }
    // });
  });



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
