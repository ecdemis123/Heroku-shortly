angular.module('shortly', [
  'shortly.services',
  'shortly.links',
  'shortly.shorten',
  'shortly.auth',
  'ngRoute'
])
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/links', {
      templateUrl: 'app/links/links.html',
      controller: 'LinksController',
      authenticate: true
    })
    .when('/shorten', {
      templateUrl: 'app/shorten/shorten.html',
      controller: 'ShortenController',
      authenticate: true
    })
    .when('/logout', {
      authenticate: false,
      redirectTo: '/signin'
    })
    .otherwise({
      redirectTo: '/links'
    });
    // Your code here

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
}])
.factory('AttachTokens', ['$window', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
}])
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
}]);

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

angular.module('shortly.links', [])

.controller('LinksController', ['$scope', 'Links', function ($scope, Links) {
  // Your code here
  $scope.data = {};

  $scope.getLinks = function(){
    Links.getLinks()
    .then(function(linkData) {
      console.log(linkData);
      $scope.data.links = linkData;
    });
  };

  $scope.getLinks();
}])
.directive('ngLink', function() {
  return {
    restrict: 'E',
    template: " <div class='link'><img src='../assets/redirect_icon.png'> <div class='info'>  <div class='visits'> <span class='count'> {{link.visits }} </span> Visits </div> <div class ='title'> {{ link.title }}</div> <div class='original'> {{ link.url }}</div> <a href ='{{ link.base_url  + \"/api/links/\" + link.code }}'>{{ link.base_url +  '/' + link.code }}</a> </div> </div>"
  };
});

angular.module('shortly.services', [])

.factory('Links', ['$http', function ($http) {
  // Your code here
  var getLinks = function(){
    return $http({
      method: 'GET',
      url: '/api/links'
    })
    .then(function(resp){
      return resp.data;
    });
  };

  var addLink = function(link){
    return $http({
      method: 'POST',
      url: '/api/links',
      data: link
    })
    .then(function(resp){
      console.log("hello", resp);
      return resp;
    });
  };

  return {
    getLinks: getLinks,
    addLink: addLink
  };

}])
.factory('Auth', ['$http', '$location', '$window', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      console.log(resp);
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      console.log(resp);
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.shortly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shortly');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
}]);

angular.module('shortly.shorten', [])

.controller('ShortenController', ['$scope', '$location', 'Links', 'Auth', function ($scope, $location, Links, Auth) {
  $scope.link = {};

  $scope.addLink = function(){
    $scope.loading = true;
    Links.addLink($scope.link)
    .then(function(resp){
      $scope.loading = false;
      console.log('link successfully sent!');
    });
  };

}]);
