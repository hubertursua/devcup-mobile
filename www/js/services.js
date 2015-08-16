var API_URL = (ENV === 'production') ? 'http://52.76.53.137:4000/api' : 'http://0.0.0.0:4000/api';

angular.module('starter.services', [])

.factory('Locations', function ($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var locations = [];

  return {
    search: function(lat, lng, cb) {
      $http.get(API_URL + '/locations/search?lat=' + lat + '&lng=' + lng).
        then(function(response) {
          // this callback will be called asynchronously
          // when the response is available
          locations = response.data.data;
          cb(null, locations);
        }, function(response) {
          console.error(response);
          cb();
        });
    },
    remove: function(location) {
      locations.splice(locations.indexOf(location), 1);
    },
    get: function(locationId) {
      for (var i = 0; i < locations.length; i++) {
        if (locations[i]._id === locationId) {
          return locations[i];
        }
      }
      return null;
    }
  };
})

.factory('Donations', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var donations = [];

  return {
    all: function(userId, cb) {
      console.log(API_URL + '/donations/user/' + userId);
      $http.get(API_URL + '/donations/user/' + userId).
        then(function(response) {
          // this callback will be called asynchronously
          // when the response is available
          donations = response.data.data;
          for (var i = 0; i < donations.length; ++i) {
            donations[i].selfie_url = API_URL + '/../uploads/' + donations[i].selfie_path;
          }

          console.log(response.data);
          cb(null, donations);
        }, function(response) {
          console.error(response);
          cb();
        });
      return donations;
    },
    remove: function(donation) {
      donations.splice(donations.indexOf(donation), 1);
    },
    get: function(locationId) {
      for (var i = 0; i < donations.length; i++) {
        if (donations[i].id === donationId) {
          return donations[i];
        }
      }
      return null;
    },
    create: function (locationId, userId, cb) {
      var checkinDate = new Date();
      var amount = 50;
      $http.post(API_URL + '/donations', {
        loc: locationId,
        user_id: userId,
        checkin_date: checkinDate,
        amount: amount
      }).
        then(function(response) {
          // this callback will be called asynchronously
          // when the response is available
          cb(null);
        }, function(response) {
          console.error(response);
          cb();
        });
    }
  };
})

.factory('Users', function($http) {
  var currentUser = null;

  return {
    auth: function(username, password, cb) {
      $http.post(API_URL + '/users/auth', {
        username: username,
        password: password
      }).
        then(function(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(response.data);
          currentUser = response.data.data;
          cb(null, currentUser);
        }, function(response) {
          console.error(response);
          cb();
        });
    },
    register: function(username, password, firstname, lastname, cb) {
      $http.post(API_URL + '/users/register', {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname
      }).
        then(function(response) {
          // this callback will be called asynchronously
          // when the response is available
          currentUser = response.data.data;
          cb(null, currentUser);
        }, function(response) {
          console.error(response);
          cb();
        });
    },
    self: function(cb) {
      return cb(null, currentUser);
    },
    set: function(user, cb) {
      currentUser = user;
      return cb(null, user);
    }
  };
});
