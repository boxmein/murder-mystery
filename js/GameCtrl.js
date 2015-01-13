// GameCtrl.js
//# make
// Controls the game view.

app.controller('GameCtrl',
  ['$scope', 'StorageService', '$mdDialog', '$stateParams', '$state',
  function($scope, StorageService, $mdDialog, $stateParams, $state) {

  $scope.$state = $state;



  $scope.openGame = function(game) {
    console.log(Date.now(), '$scope.openGame called with game:', game);
    if ($scope.dirty)
      $scope.forceSave();
    $scope.game = StorageService.loadGame(game.id);

  };

  $scope.forceSave = function() { 
    console.log('saved game', $scope.game);
    StorageService.saveGame($scope.game);
    $scope.dirty = false;

  };

  var saveCall = _.debounce($scope.forceSave, 5000);
  $scope.save = function() {
    console.log('called $scope.save');
    $scope.dirty = true;
    saveCall();
  };

  // Launch the edit dialog for a player
  $scope.edit = function(player, index, evt) {
    
    console.log('showing dialog for', player, index, evt); 

    $mdDialog.show({
      controller: 'PersonEditCtrl', 
      templateUrl: 'partials/edit-person.html',
      targetEvent: evt,
      locals: {
        person: player
      }
    }).then(function(answer) {
      $scope.game.players[index] = answer;
    });
  };

  $scope.delete = function(i) {
    $scope.game.players.splice(i,1);
    StorageService.saveGame($scope.game);
  };
  
  $scope.game = null;

  $scope.games = StorageService.listGames();
  
  console.log($scope.games);

  // TODO: Links to /home/1 will go to game #1
  if ($stateParams.id) {
    try {
      var id = parseInt($stateParams.id, 10); 
      // $state.go('home', {id: id}) won't work because md-tabs
      // _.delay ( ^ ) also
      // what else?
    }
    catch (err) {
      console.log(err);
    }
  }
}]);
