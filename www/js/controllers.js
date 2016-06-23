angular.module('heyu.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('RemindersCtrl', function($scope, Reminders) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  Reminders.all().then(function(res){
    $scope.reminders = res;
  });
  $scope.remove = function(reminder) {
    Reminders.remove(reminder._id).then(function(res){
      console.log(res);
    });
  };
  $scope.add = function(reminder) {
    Reminders.add(reminder).then(function(res){
      console.log(res);
    });
  };
})

.controller('ReminderDetailCtrl', function($scope, $stateParams, Reminders) {
  Reminders.get($stateParams.reminderId).then(function(res){
    $scope.reminder = res;
  });
})

  .controller('ReminderNewCtrl', function($scope, $stateParams, Reminders) {
    console.log('hi');
    $scope.addReminder = function(){
      Reminders.add($stateParams.re).then(function(res){
        $scope.reminder = res;
      });
    }
  })

.controller('AccountCtrl', function($scope, Auth , $state) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.logout = function(){
    Auth.logout().then(function(){
      $state.go('login');
    })
  };

})
  .controller('LoginCtrl', function($scope, Auth, PopupService, $state, $http, $ionicLoading) {

    $scope.passportLinkedIn = function(){
      $http.get('/auth/linkedin').then(function(res){
        console.log(res);
      });
    };


    $scope.loginWithFacebook = function(){
      PopupService.loading();
      Auth.loginWithFacebook().then(function(data){
          console.log('Logged in as:', data);
          Auth.updateProfile(data).then(function(){
            console.log('User data updated');
          });
          PopupService.alert('Info','Welcome to heyu');
          $state.go('tab.reminders');
        },function(error){
          PopupService.alert('Error',error);
        })
        .finally(function(){
          PopupService.hideLoading();
        });
    };

  });

