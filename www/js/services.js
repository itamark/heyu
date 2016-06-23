angular.module('heyu.services', [])

  .factory('Reminders', function ($http, $q) {
    // Might use a resource here that returns a JSON array

    var getReminders = function () {
      var deferred = $q.defer();
      $http.get('http://localhost:8080/api/reminders').then(function (res) {
        deferred.resolve(res.data);
      });
      return deferred.promise;
    };

    var addReminder = function(){
      var deferred = $q.defer();
      $http.post('http://localhost:8080/api/reminders', data).then(function (res) {
        deferred.resolve(res.data);
      });
      return deferred.promise;
    };

    var getReminderById = function (id) {
      var deferred = $q.defer();
      $http.get('http://localhost:8080/api/reminders/' + id).then(function (res) {
        deferred.resolve(res.data);
      });
      return deferred.promise;
    };

    var removeReminder = function (id) {
      var deferred = $q.defer();
      $http.delete('http://localhost:8080/api/reminders/' + id).then(function (res) {
        deferred.resolve(res.data);
      });
      return deferred.promise;
    };

    return {
      all: getReminders,
      add: addReminder,
      remove: removeReminder,
      get: getReminderById
    };
  })
  .factory("Auth", function (PopupService, $q, $ionicHistory, $firebaseAuth, $http) {
    var Auth = {};

    var myUID = window.localStorage.myUID ? window.localStorage.myUID : "";

    var myRef = new Firebase("https://cmgr.firebaseio.com/");

    Auth.persistUID = function () {
      window.localStorage.myUID = myUID;
    };

    Auth.getMyUID = function () {
      return myUID;
    };

    Auth.isOwnProfile = function (uid) {
      console.log(uid, myUID)
      return uid === myUID;
    };

    Auth.loginWithFacebook = function () {
      var def = $q.defer();

      myRef.authWithOAuthPopup("facebook", function (error, authData) {
        if (error) {
          def.reject(error);
        } else {
          myUID = authData.facebook.id;
          Auth.persistUID();
          $ionicHistory.clearCache().then(function () {
            def.resolve(authData);
          });
        }
      }, {
        scope: "public_profile,email,user_friends"
      });
      return def.promise;
    };

    Auth.logout = function () {
      var def = $q.defer();
      myUID = "";
      Auth.persistUID();
      myRef.unauth();
      $ionicHistory.clearCache().then(function () {
        def.resolve("Logged out");
      });

      return def.promise;
    };

    Auth.isLoggedIn = function () {
      var def = $q.defer();

      var facebookAuth = $firebaseAuth(myRef);

      facebookAuth.$onAuth(function (authData) {
        if (authData === null) {
          def.reject('Not logged in yet');
        } else {
          def.resolve(authData);
        }
      });

      return def.promise;
    };

    var registerOrLogin = function (data) {
      var deferred = $q.defer();
      $http.post('http://localhost:8080/api/login', data).then(function (res) {
        deferred.resolve(res.data);
      });
      return deferred.promise;
    };


    Auth.updateProfile = function (authData) {
      var def = $q.defer();
      registerOrLogin(authData.facebook).then(function(res){
        console.log(res);
      });
      //myRef.child('users').child(authData.facebook.id).set({
      //  uid: authData.facebook.id ? authData.facebook.id : null,
      //  displayName: authData.facebook.displayName ? authData.facebook.displayName : null,
      //  profileImageURL: authData.facebook.profileImageURL ? authData.facebook.profileImageURL : null,
      //  email: authData.facebook.email ? authData.facebook.email : null
      //});
      def.resolve();
      return def.promise;
    };

    Auth.getProfile = function (userId) {
      var def = $q.defer();

      myRef.child("users").child(userId).once("value", function (snapshot) {
        console.log(snapshot);
        var user = snapshot.val();
        def.resolve(user);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        def.reject(errorObject);
      });
      return def.promise;
    };

    return Auth;
  })
  .service('PopupService', function ($ionicPopup, $ionicLoading) {
    this.alert = function (title, text) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: text
      });

      return alertPopup;
    };

    this.loading = function () {
      $ionicLoading.show({
        template: 'Loading<br><ion-spinner></ion-spinner>',
      });
    };

    this.hideLoading = function () {
      $ionicLoading.hide();
    };
  });
