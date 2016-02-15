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
