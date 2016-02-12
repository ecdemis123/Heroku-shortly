// do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('shortly.auth', [])

.controller('AuthController', ['$scope', '$window', '$location', 'Auth', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.error = '';

  $scope.signin = function () {
    $scope.hasError = false;
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.shortly', token);
        $location.path('/links');
      })
      .catch(function (error) {
        $scope.hasError = true;
        if (error) {
          console.log(error);
          $scope.error = error.data.error.toString();
          if (error.data.error.toString() === 'No user') {
            $scope.error = 'Wrong password';
          }
          setTimeout(function(){ $scope.hasError = false;}, 2000);
        }
      });
  };

  $scope.signup = function () {
    $scope.hasError = false;
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.shortly', token);
        $location.path('/links');
      })
      .catch(function (error) {
        $scope.hasError = true;
        console.error(error);
        if(error) {
          $scope.error = 'Username already exists. Pick another one!';
        }
        setTimeout(function(){ $scope.hasError = false;}, 2000);
      });
  };

  $scope.signOut = function() {
    Auth.signout();
  };

  $scope.isAuth = function() {
    var result = false;
    if (Auth.isAuth()) {
      result = true;
    }
    return result;
  };

}]);
