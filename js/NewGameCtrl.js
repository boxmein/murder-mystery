app.controller('NewGameCtrl', 
  ['$scope', 'StorageService', '$mdToast', '$animate', 
   '$stateParams', '$mdDialog', '$state',
  function($scope, StorageService, $mdToast, $animate, 
           $stateParams, $mdDialog, $state) {

  var INVALID_ID = $mdToast.simple('Invalid ID!').position('bottom left');
  var NO_SUCH_GAME = $mdToast.simple('No such game!').position('bottom left');
  var SAVE_SUCCESS = $mdToast.simple('Successfully saved! Opening game...')
                             .action('EDIT')
                             .highlightAction(false)
                             .position('bottom left');

  var CONFIRM_DELETE = $mdDialog.confirm()
                                .title('You *sure* you want to delete this game?')
                                .ariaLabel('Delete This Game')
                                .ok('Delete')
                                .cancel('Nah');
  
  var DELETE_SUCCESS = $mdToast.simple()
                               .action('UNDO')
                               .highlightAction(false)
                               .position('bottom left');

  if ($stateParams.id && $stateParams.id !== 'new') {

    console.log('id found: ', $stateParams.id);
    $scope.editing = true;
    var id = null;
    try { 
      id = parseInt($stateParams.id, 10); 
    } catch (err) { 
      $mdToast.show(INVALID_ID);
    }
    $scope.game = StorageService.loadGame(id);

    if (!$scope.game) {
      $scope.editing = false;

      $mdToast.show(NO_SUCH_GAME);
    }
  }
  
  if (!$scope.editing)
    $scope.game = StorageService.newGame();

  $scope.submit = function() {

    console.log('saving game', $scope.game); 

    StorageService.saveGame($scope.game);

    $state.go('home', {id: $scope.game.id}); 

    $mdToast.show(SAVE_SUCCESS).then(function() {
      $state.go('edit', {id: $scope.game.id});
    });

  };


  $scope.addPlayerRow = function($event) {
    if ($event.keyCode && $event.keyCode === 13) {
      var player = StorageService.newPlayer();

      player.name = $scope.new_player_name;

      $scope.new_player_name = '';
      $scope.game.players.push(player);      

      $event.preventDefault();
    }
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

  $scope.deleteGame = function($event, game) {
    game = $scope.game;

    var dialog = CONFIRM_DELETE.content('The game #'+game.id+' \''+game.name+'\'' + 
                          'will be wiped of existence forever and ever. You sure?')
                          .targetEvent($event);

    $mdDialog.show(dialog)
      .then(function(yes) {
        var gm = game;

        StorageService.deleteGame(game.id);
        
        $state.go('home');

        $mdToast.show(DELETE_SUCCESS.title('Deleted game \''+game.name+'\''))
        .then(function() {
          StorageService.saveGame(gm);
          $state.go('edit', {id: gm.id});
        });

      }, function(no) {});
  }; //*/

}]);
