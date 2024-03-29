angular.module('heyu.services', [])

  .factory('Reminders', function ($http, $q, $filter, Auth) {

    var initReminder = {
      uid: Auth.user ? Auth.user._id : '',
      date: moment().startOf('minute').toDate(),
      time: moment().startOf('minute').toDate(),
      recurring: false,
      text: '',
      done: false
    };

    var getReminders = function () {
      var deferred = $q.defer();
      $http.get('http://localhost:8080/api/reminders').then(function (res) {
        deferred.resolve(res.data);
      });
      return deferred.promise;
    };

    var getNextReminder = function (uid) {
      var deferred = $q.defer();
      $http.get('http://localhost:8080/api/reminders/fulfill/'+uid).then(function (res) {
        console.log(res);
        deferred.resolve(res.data);
      }, function(err){
        console.log(err);
      });
      return deferred.promise;
    };

    var addReminder = function (reminder) {
      console.log(reminder.text);
      var data = {
        uid: Auth.user._id,
        recurring: reminder.recurring,
        text: reminder.text,
        datetime: reminder.date.setHours(reminder.time.getHours(), reminder.time.getMinutes(), 0, 0) + (reminder.date.getTimezoneOffset() * 60000),
        done: reminder.done
      };

      console.log(data.datetime);
      var deferred = $q.defer();
      $http.post('http://localhost:8080/api/reminders', data).then(function (res) {
        console.log(res);
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

    var done = function(reminder){
      var deferred = $q.defer();
      $http.put('http://localhost:8080/api/reminders/' + reminder._id, {done: reminder.done}).then(function (res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    };



    return {
      all: getReminders,
      add: addReminder,
      done: done,
      remove: removeReminder,
      get: getReminderById,
      next: getNextReminder,
      init: initReminder
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
      registerOrLogin(authData.facebook).then(function (res) {
        //console.log(res);
        def.resolve(res);

      });
      //myRef.child('users').child(authData.facebook.id).set({
      //  uid: authData.facebook.id ? authData.facebook.id : null,
      //  displayName: authData.facebook.displayName ? authData.facebook.displayName : null,
      //  profileImageURL: authData.facebook.profileImageURL ? authData.facebook.profileImageURL : null,
      //  email: authData.facebook.email ? authData.facebook.email : null
      //});
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
  .service('PopupService', function ($ionicPopup, $ionicLoading, $timeout) {
    this.alert = function (title, text, to) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: text
      });
      if (to) {
        $timeout(function () {
          alertPopup.close(); //close the popup after 3 seconds for some reason
        }, to);
      }


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
