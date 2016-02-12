angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links, Auth) {
  $scope.link = {};

  $scope.addLink = function(){
    $scope.loading = true;
    Links.addLink($scope.link)
    .then(function(resp){
      $scope.loading = false;
      console.log('link successfully sent!');
    });
  };

});
