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

var userProfile;
var tracksShort;
var tracksMedium;
var tracksLong;
var artistsShort;
var artistsMedium;
var artistsLong;

// set intial conditions (Recent, Tracks)
var listType = 'tracks';
var listDuration = "short";



function media_request(type, range) {
  console.log( type + ' over ' + range + " was clicked");

  var isTracks = $('#btn-tracks').hasClass('active');

  console.log(isTracks);

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {

    // console.log(data);
    var access_token = data.access_token;

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/' + type + '?time_range=' + range + '_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          console.log(response);
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          $('.btn-' + range).button('toggle');
          // $('.btn-' + type).button('toggle');
          // let responseJSON = response;
          // let responseJSON = JSON.stringify(response);
          // Cookies.set('tracksShort', responseJSON);
          // console.log(responseJSON);
        }
    });
  });
}

function long_clicked() {

  console.log("all time was clicked");

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {

    // console.log(data);
    var access_token = data.access_token;

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          console.log(response);
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          $('.btn-long').button('toggle');
          // let responseJSON = response;
          // let responseJSON = JSON.stringify(response);
          // Cookies.set('tracksShort', responseJSON);
          // console.log(responseJSON);
        }
    });
  });



}

function medium_clicked() {
  console.log("medium was clicked");

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {

    // console.log(data);
    var access_token = data.access_token;

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          console.log(response);
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          $('.btn-medium').button('toggle');
          // let responseJSON = response;
          // let responseJSON = JSON.stringify(response);
          // Cookies.set('tracksShort', responseJSON);
          // console.log(responseJSON);
        }
    });
  });
// $(this).toggleClass('active');

}

function short_clicked() {
  console.log("recent was clicked");

  $.ajax({
    url: '/refresh_token',
    data: {
      'refresh_token': refresh_token
    }
  }).done(function(data) {

    // console.log(data);
    var access_token = data.access_token;

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          console.log(response);
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          $('.btn-short').button('toggle');
          // let responseJSON = response;
          // let responseJSON = JSON.stringify(response);
          // Cookies.set('tracksShort', responseJSON);
          // console.log(responseJSON);
        }
    });
  });
// $(this).toggleClass('active');
}



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

var navbarSource = document.getElementById('navbar-Template').innerHTML,
    navbarTemplate = Handlebars.compile(navbarSource);

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

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/' + listType + '?time_range=' + listDuration + '_term&limit=50',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {

          // console.log(response);
          document.getElementById('topTracks').innerHTML = topTracksTemplate(response);
          $('.btn-' + listDuration).button('toggle');
          let responseJSON = response;
          // let responseJSON = JSON.stringify(response);
          Cookies.set('tracksShort', responseJSON);
          console.log(responseJSON);
        }
    });

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
