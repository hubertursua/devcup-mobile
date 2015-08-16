var ENV = 'production';
// var ENV = 'development';

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angularMoment'])

.run(function($http, $ionicPlatform, Users) {
    $http.defaults.headers.common['Content-Type'] = 'application/json';

    if (window.localStorage.getItem("isLoggedIn") == "true" && window.localStorage.getItem("user")) {
        try {
            var userData = JSON.parse(window.localStorage.getItem("user"));
            Users.set(userData, function () {

            });
        } catch (e) {
            window.localStorage.clear();
        }
    }

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false).text('');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
        })
        .state('onboarding', {
            url: '/onboarding',
            templateUrl: 'templates/onboarding.html',
            controller: 'OnboardingCtrl'
        })
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('tab.explore', {
            url: '/explore',
            views: {
                'tab-explore': {
                    templateUrl: 'templates/tab-explore.html',
                    controller: 'ExploreCtrl'
                }
            }
        })
        .state('tab.explore-detail', {
            url: '/explore/:locationId',
            views: {
                'tab-explore': {
                    templateUrl: 'templates/explore-detail.html',
                    controller: 'ExploreDetailCtrl'
                }
            }
        })
        .state('tab.donations', {
            url: '/donations',
            views: {
                'tab-donations': {
                    templateUrl: 'templates/tab-donations.html',
                    controller: 'DonationsCtrl'
                }
            }
        })
        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    if (window.localStorage.getItem("isLoggedIn") == "true") {
        $urlRouterProvider.otherwise('/tab/explore');
    } else {
        $urlRouterProvider.otherwise('/login');
    }
});
