// StorageService.js
//# make
// Service for retrieval and storage of persistent game data.

angular.module('murder').factory('StorageService', function() {

  var obj = {}
    , storedData = null
    , gameid = 0;

  function generateName() {
    if (Math.random() < 0.05) {
      return _.sample(generateName.fullNames);
    }
    return _.sample(generateName.firstNames) + ' ' + 
           _.sample(generateName.lastNames);
  }

  generateName.lastNames = 
  ['Hardage','Hart','Schutt','Roehl','Arechiga','Mcmurry',
  'Bayliss','Steptoe','Durrah','Garling','Boothe','Lininger','Noriega',
  'Bouffard','Neill','Bosak','Sidhu','Mcfalls','Schmoll','Varghese',
  'Lager','Wimbush','Zelman','Nolasco','Nida','Vandermolen','Witherspoon',
  'Lucius','Huston','Crowley','Ferretti','Conn','Caplinger','Lahman','Ansari',
  'Milstead','Meese','Dave','Johnson','Loe','Huerta','Mauger','Bolger','Obyrne',
  'Mars','Davids','Solan','Rahm','Eisenhauer','Hollingworth'];

  generateName.firstNames = 
  ['Gustavo','Vickey','Fransisca','Wilton','Miles','Nell',
  'Simonne','Duane','Velia','Joaquina','Jaclyn','Daisey','Mafalda','Mariam',
  'Ashlee','Zana','Fred','Dayna','Hiram','Andree','Ilana','Hal','Ela',
  'Lavelle','Jayson','Sue','Gilda','Siobhan','Maya','An','Sun','Benjamin',
  'Carisa','Arminda','Leora','Minda','Theressa','Taina','Edmundo','Mac',
  'Angelique','Johnna','Deann','Ardell','Susy','Scotty','Inge','Darline',
  'Socorro','Avril'];

  // here's a vivid display of my sense of humor
  generateName.fullNames = ['Benedict Cumberbatch', 'Baseballbat Candycrush', 
  'Your Mom'];


  // Save data to local storage.
  obj.saveData = function() {
    if ('localStorage' in window)
      localStorage.murderData = JSON.stringify(storedData || {});
  };

  // Load data from local storage.
  // Also loads the latest used game ID.
  // uses localStorage.murderData and localStorage.gameid
  obj.loadData = function() {
    if ('localStorage' in window) {
      try {
        storedData = JSON.parse(localStorage.murderData);
        gameid = parseInt(localStorage.gameid);
      } catch (err) { 
        storedData = {}; 
        gameid = 0;

        console.warn(err);
      }
    }
    else { 
      storedData = {};
    }
  };

  // Load a specific game from storage. Pass a game ID to get.
  obj.loadGame = function(gid) {
    if (!storedData)
      this.loadData();

    if (typeof gid != 'number') 
      throw new Error('got ' + typeof gid + ', number expected');

    return storedData[gid];
  };

  // Save a game object. Calls saveData() when done to update storage, too.
  obj.saveGame = function(game) {
    if (!storedData) 
      this.loadData();
    
    if (typeof game.id != 'number') 
      throw new Error('game.gid is a ' + typeof game.id + ', number expected');

    storedData[game.id] = game;
    
    this.saveData();
  };

  // Creates a new game object. 
  obj.newGame = function() {
    
    if ('localStorage' in window)
      localStorage.gameid = gameid++;

    return {
      name: 'insert name here',
      players: [],
      open: true,
      id: gameid
    };
  };

  // Creates a new player object.
  obj.newPlayer = function() {
    return {
      name: generateName(),
      dead: false, 
      murderer: false,
      suspect: false
    };
  };

  // Lists all games, only returns the properties name players and open.
  obj.listGames = function() {
    
    if (!storedData) 
      this.loadData();

    return _.map(storedData, 
      function(each) { 
        return _.pick(each, ['id', 'open', 'name']);
      });
  };

  obj.deleteGame = function(id) {
    if (!storedData) 
      this.loadData();

    // lol
    if (id.id) 
      id = id.id;

    delete storedData[id];

    this.saveData();
  };


  // Before unload, make sure to save data.
  window.addEventListener('beforeunload', function() {
    obj.saveData();
  });

  // We're all set up. Load data, too. 
  obj.loadData();

  return obj;
});
