// App start
//# make

var app = angular.module('murder', ['ui.router', 'ngMaterial']);

app.controller('SuperCtrl', ['$scope', '$state', 
                     function($scope, $state) {}]);



app.config(['$stateProvider', '$urlRouterProvider',
           function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('howto', {
    url: '/howto',
    templateUrl: 'partials/howto.html'
  });

  $stateProvider.state('home', {
    url: '/home/:id',
    templateUrl: 'partials/main.html',
    controller: 'GameCtrl'
  });

  $stateProvider.state('edit', {
    url: '/edit/:id',
    templateUrl: 'partials/new-game.html',
    controller: 'NewGameCtrl'
  });

  $urlRouterProvider.otherwise('/home/');

}]);





// New directive, long press! :D
// https://gist.github.com/BobNisco/9885852
app.directive('onLongPress', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $elm, $attrs) {
      $elm.bind('touchstart', function(evt) {
        // Locally scoped variable that will keep track of the long press
        $scope.longPress = true;
 
        // We'll set a timeout for 600 ms for a long press
        $timeout(function() {
          if ($scope.longPress) {
            // If the touchend event hasn't fired,
            // apply the function given in on the element's on-long-press attribute
            $scope.$apply(function() {
              $scope.$eval($attrs.onLongPress)
            });
          }
        }, 600);
      });
 
      $elm.bind('touchend', function(evt) {
        // Prevent the onLongPress event from firing
        $scope.longPress = false;
        // If there is an on-touch-end function attached to this element, apply it
        if ($attrs.onTouchEnd) {
          $scope.$apply(function() {
            $scope.$eval($attrs.onTouchEnd)
          });
        }
      });
    }
  };
});
