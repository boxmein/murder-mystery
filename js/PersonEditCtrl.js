// PersonEditCtrl.js
//# make
// edit a specific person's record (name mostly :P)

app.controller('PersonEditCtrl', ['$scope', '$mdDialog', 'person',
                                 function($scope, $mdDialog, person) {
  
  $scope.person = person;

  $scope.answer = function(answer) { 
    console.log('answering with this!', answer);
    $mdDialog.hide(answer);
  };

  $scope.cancel = $mdDialog.cancel.bind($mdDialog);

}]);

