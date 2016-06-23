// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'heyu' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'heyu.services' is found in services.js
// 'heyu.controllers' is found in controllers.js
angular.module('heyu', ['ionic', 'heyu.controllers', 'heyu.services', 'firebase', 'ion-fab-button'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        onEnter: function ($state, Auth) {
          Auth.isLoggedIn().then(function (data) {
            // console.log('Logged in', data);
          }, function (error) {
            console.log(error);
            $state.go('login');
          })
        }
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.reminders', {
        url: '/reminders',
        views: {
          'tab-reminders': {
            templateUrl: 'templates/tab-reminders.html',
            controller: 'RemindersCtrl'
          }
        }
      })
      .state('tab.reminder-detail', {
        url: '/reminders/:reminderId',
        views: {
          'tab-reminders': {
            templateUrl: 'templates/reminder-detail.html',
            controller: 'ReminderDetailCtrl'
          }
        }
      })
      .state('tab.reminder-new', {
        url: '/reminders/new',
        views: {
          'tab-reminders': {
            templateUrl: 'templates/reminder-new.html',
            controller: 'ReminderNewCtrl'
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
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/reminders');

  });
