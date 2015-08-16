angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $location, $ionicLoading, $ionicPopup, Users) {
  $scope.username = null;
  $scope.password = null;

  $scope.login = function (username, password) {
    $ionicLoading.show({
      template: 'Logging in...'
    });

    Users.auth(username, password, function (err, user) {
      $ionicLoading.hide();

      if (!err && user) {
        window.localStorage.setItem("isLoggedIn", "true");
        window.localStorage.setItem("user", JSON.stringify(user));
        $location.path( "/tab/explore" );
      } else {
        $ionicPopup.alert({
          title: 'Could not login :(',
          template: 'Kindly check if you typed your username and password correctly.'
        });
      }
    });
  };
})

.controller('RegisterCtrl', function($scope, $location, $ionicLoading, $ionicPopup, Users) {
  $scope.username  = null;
  $scope.password  = null;
  $scope.firstname = null;
  $scope.lastname  = null;

  $scope.register = function (username, password, firstname, lastname) {
    $ionicLoading.show({
      template: 'Creating your account...'
    });
    Users.register(username, password, firstname, lastname, function (err, user) {
      $ionicLoading.hide();

      if (!err && user) {
        window.localStorage.setItem("isLoggedIn", "true");
        window.localStorage.setItem("user", JSON.stringify(user));
        $ionicLoading.hide();
        $location.path( "/tab/explore" );
        // $location.path( "/onboarding" );
      } else {
        $ionicPopup.alert({
          title: 'Could not register :(',
          template: "We've encountered an issue while trying to register your account. Please try again."
        });
      }
    });
  };
})

.controller('OnboardingCtrl', function($scope, $location) {

})

.controller('ExploreCtrl', function($scope, $ionicLoading, $ionicPopup, Locations) {
  $scope.locations = [];

  $scope.$on('$ionicView.enter', function (e) {
    if ($scope.locations.length === 0) {
      $ionicLoading.show({
        template: 'Searching for restaurants...'
      });

      navigator.geolocation.getCurrentPosition(function (position) {
        Locations.search(position.coords.latitude, position.coords.longitude, function (err, locations) {
          $scope.locations = locations;
          $ionicLoading.hide();

          if (locations.length === 0) {
            $ionicPopup.alert({
              title: 'No restaurants found',
              template: "We couldn't find good restaurants near you."
            });
          }
        });
      }, function (err) {
          console.log('code: '    + err.code    + '\n' +
                'message: ' + err.message + '\n');
      });
    }
  });
})

.controller('ExploreDetailCtrl', function($scope, $stateParams, $ionicPopup, $location, Locations, Donations, Users) {
  $scope.location = Locations.get($stateParams.locationId);
  $scope.user = null;

  $scope.$on('$ionicView.enter', function (e) {
    if (!$scope.location) {
      $location.path( "/tab/explore" );
    }

    Users.self(function (err, user) {
      $scope.user = user;
    });
  });

  $scope.openMap = function (location) {
    var latlng = location.lnglat[1] + ',' + location.lnglat[0];

    if(ionic.Platform.isIOS()) {
      window.open('waze://?ll=' + latlng + '&navigate=yes');
    } else if (ionic.Platform.isAndroid()) {
      window.open('geo:' + latlng + '?&q=' + latlng);
    }
  };

  $scope.checkIn = function (location) {
    Donations.create($scope.location._id, $scope.user._id, function (err) {
      if (err) {
        $ionicPopup.alert({
          title: 'Oh noes!',
          template: "Ops, something went wrong. Please try again after a few minutes."
        });

        return;
      }

      var alertPopup = $ionicPopup.alert({
        title: 'Thanks for Checking In!',
        template: '<strong>' + location.name + "</strong> will donate a portion of your bill to our charity. <br><br>You can track the people you've helped in the Donations page by clicking the tab below."
      });

      alertPopup.then(function(res) {
        $location.path( "/tab/explore" );
      });

    });
  };
})

.controller('DonationsCtrl', function($scope, $ionicLoading, Donations, Users) {
  $scope.donations = [];

  $scope.$on('$ionicView.enter', function (e) {
    $ionicLoading.show({
      template: 'Fetching donations...'
    });

    Users.self(function (err, user) {
      Donations.all(user._id, function (err, donations) {
        console.log(donations);
        $scope.donations = donations;
        $ionicLoading.hide();
      });
    });
  });
})

.controller('AccountCtrl', function($scope, $location, Users) {
  $scope.user = null;

  $scope.$on('$ionicView.enter', function (e) {
    Users.self(function (err, user) {
      $scope.user = user;
    });
  });

  $scope.logout = function () {
    window.localStorage.clear();
    $location.path( "/login" );
  };
});
