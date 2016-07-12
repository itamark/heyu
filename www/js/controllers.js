angular.module('heyu.controllers', [])

  .controller('FulfillCtrl', function ($scope, Reminders, Auth) {

    Reminders.next(Auth.user._id).then(function(res){
      console.log(res);
    });



  })

  .controller('RemindersCtrl', function ($scope, Reminders, PopupService, $timeout, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    var updateReminders = function(){
      Reminders.all().then(function (res) {
        $scope.reminders = res;
      });
    };

    $scope.$on('$ionicView.enter', function (e) {
      updateReminders();
    });

    $scope.toggleDone = function(reminder){
      reminder.done = !reminder.done;
      Reminders.done(reminder).then(function(res){
        updateReminders();
      });
    };


    $scope.remove = function (reminder) {
      Reminders.remove(reminder._id).then(function (res) {
        console.log(res);
      });
    };
    //$scope.add = function (reminder) {
    //  Reminders.add(reminder).then(function (res) {
    //    $timeout(function(){
    //      PopupService.alert('Info', 'Success!', 3000);
    //      $state.go('tab.reminders');
    //    }, 0);
    //
    //    console.log(res);
    //  });
    //};
  })

  .controller('ReminderDetailCtrl', function ($scope, $stateParams, Reminders) {
    Reminders.get($stateParams.reminderId).then(function (res) {
      $scope.reminder = res;
    });
  })

  .controller('ReminderNewCtrl', function ($scope, $stateParams, $filter, Reminders, PopupService, $state) {
    $scope.reminder = Reminders.init;

    $scope.addReminder = function () {
      Reminders.add($scope.reminder).then(function (res) {
        PopupService.alert('Success!', 'Reminder added!', 1000);
        $state.go('tab.reminders');
        $scope.reminder = Reminders.init;
      });
    }
  })

  .controller('AccountCtrl', function ($scope, Auth, $state) {
    $scope.settings = {
      enableFriends: true
    };

    $scope.logout = function () {
      Auth.logout().then(function () {
        $state.go('login');
      })
    };

  })
  .controller('LoginCtrl', function ($scope, Auth, PopupService, $state, $http, $ionicLoading, $rootScope) {

    $scope.passportLinkedIn = function () {
      $http.get('/auth/linkedin').then(function (res) {
        console.log(res);
      });
    };


    $scope.loginWithFacebook = function () {
      PopupService.loading();
      Auth.loginWithFacebook().then(function (data) {
        console.log('Logged in as:', data);
        Auth.updateProfile(data).then(function (res) {
          console.log(res);
          $rootScope.user = Auth.user = res;
          console.log('User data updated');
        });
        PopupService.alert('Info', 'Welcome to heyu');
        $state.go('tab.reminders');
      }, function (error) {
        PopupService.alert('Error', error);
      })
        .finally(function () {
          PopupService.hideLoading();
        });
    };

  });

