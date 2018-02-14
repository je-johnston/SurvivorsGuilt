/*
DungeonMaster.js
Main Logic driver of the game. Handles creating the gameboard/characters, user input, player/enemy actions, and UI.
*/
class DungeonMaster {
    constructor() {
        console.log("Dungeon Master Created.");

        /*
        Game engine and sprite sheet variables.
        */
        var canvas = document.getElementById("gameWorld"); //Canvas element.
        var ctx = canvas.getContext("2d"); //Context.
        var gameEngine = new GameEngine(); //Game Engine variable.
        var sheetOne = AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png");
        var sheetTwo = AM.getAsset("./Assets/img/Scavengers_SpriteSheet_2.png");
        gameEngine.init(ctx);
        gameEngine.start(); //Start the Game Engine.

        /*
        The Gameboard.
        */
        this.boardHeight = 10; //Height of the gameboard.
        this.boardWidth = 10; //Width of the gameboard.
        this.startingX = 75; //Starting global X location for gameboard.
        this.startingY = 75; //Starting global Y location for gameboard.
        this.gameBoard = []; //Create 2D Array representing the gameboard.
        for (var i = 0; i < this.boardWidth; i++) {
            this.gameBoard[i] = new Array(this.boardWidth);
        }

        /*
        Level and UI variables.
        */
        this.maxLevels = 10; //Maximum number of levels in one playthrough.
        this.currentLevel = 1; //The current level.
        this.maxHealth = 100; //Maximum amount of player health.
        this.currPlayerHealth = 100; //Current player health.
        this.maxFood = 200; //Maximum amount of food a player can carry.
        this.playerFood = 50; //Current amount of player food.
        this.actionCost = 5; //The cost (in food) of a given player action (move or attack).
        this.exitX = 8; //Exit X value.
        this.exitY = 1; //Exit Y value.
        this.playerStartX = 1; //Player starting X.
        this.playerStartY = 8; //Player starting Y.


        /*
        Arrays containing active(/alive) zombies and dead/inactive ones.
        */
        this.activeZombies = [];
        this.deadZombies = [];
        this.normZombDmg = 25; //How much damage a normal zombie does.
        this.supZombDmg = 35; //How much damage a super zombie does.
        

        /*
        Turn manager and input. 
        */
        this.turnNum = 1; //The current turn number.
        this.inputAccepted = true; //Whether user input is accepted or not.
        this.validKeys = ['a', 's', 'w', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', ' '];

        /*
        Begin the game. 
        */
        this.populateGameBoard(gameEngine, sheetOne);
        this.Survivor = new Survivor(gameEngine, sheetOne, sheetTwo, this.gameBoard[this.playerStartX][this.playerStartY]);
        //Create 3 Super and 3 Regular zombies and place them in the dead zombie array.
        for (i = 0; i < 1; i++) {
            var regZombie = new Zombie(gameEngine, sheetOne, sheetTwo, this.gameBoard[7][1], true, false);
            this.activeZombies.push(regZombie);
            //add super zombies
        }


        this.updateUI();
        this.addListeners();

    }

    /*
    Creates a new level by regenerating the map.
    */
    createLevel() {
        this.currentLevel++; //Increment the level number.
        this.turnNum = 1; //Reset the turn number.
        this.resetGameBoard();//Remove all current obstacles.
        this.generateObstacles(8, 8);//Re-generate obstacles.
        this.placeExit(this.exitX, this.exitY); //Re-generate exit tile.
        //Re-add zombies.
        this.Survivor.moveChar(this.gameBoard[this.playerStartX][this.playerStartY]);//Place survivor in starting square.
        this.inputAccepted = true;
        
    }

    /*
    Ends the current level.
    */
    endLevel() {
        this.inputAccepted = false; //Disable input.
       


    }

    updateUI() {
        document.getElementById("health").innerHTML = this.currPlayerHealth;
        document.getElementById("food").innerHTML = this.playerFood;
    }

    /*
    The turn sequence. 
    */
    turn(keyPressed) {
        if (this.inputAccepted) {
        this.turnNum++; //Increment the turn number.
        this.playerTurn(keyPressed); //Resolve the player's actions.
        }
        this.inputAccepted = false;//Turn off input until all other actions are resolved.
        this.enemyTurn() //Resolve the zombie's actions.
        this.updateUI(); //Update the UI.
        //Check to see if the player is still alive and has food.
        //Check to see if the player has picked anything up. If he has, add it to total.

        if (this.checkForExit()) { //Check to see if the player has reached exit. If he has, create new level.
            this.endLevel();
            this.createLevel();
        }

        this.inputAccepted = true;//Turn on input.
    }


    /*
    The player's actions.
    */
    playerTurn(keyPressed) {

        switch (keyPressed) {
            case 'w' || 'ArrowUp':
                this.moveCharacter(this.Survivor, 'up');
                break;
            case 'd' || 'ArrowRight':
                this.moveCharacter(this.Survivor, 'right');
                break;
            case 'a' || 'ArrowLeft':
                this.moveCharacter(this.Survivor, 'left');
                break;
            case 's' || 'ArrowDown':
                this.moveCharacter(this.Survivor, 'down');
                break;
            case ' ':
                if (this.Survivor.getFacingRight()) {
                    setTimeout(test, 350);
                    this.Survivor.setState('attackRight');
                    var that = this;
                    function test() {
                        that.Survivor.setState('idleRight');
                        that.survivorAttack();
                    }
                } else {
                    setTimeout(temp, 350);
                    this.Survivor.setState('attackLeft');
                    var that = this;
                    function temp() {
                        that.Survivor.setState('idleLeft');
                        that.survivorAttack();
                    }
                }
                
                break;
            default:
                console.log("Debug playerTurn");
        }

        //Deduct food from player's total.
        this.playerFood -= this.actionCost;
    }

    /*
    The Enemy's turn.
    */
    enemyTurn() {
        //Iterate over each zombie.
        for (const z of this.activeZombies) {
            //If the zombie is adjacent to the player
            if (this.isSurvivorAdjacent(z)) {
                //console.log("Survivor is adjacent to zombie.");
                //Initiate attack.
                if (z.getFacingRight() == true) {
                    setTimeout(test, 350);
                    z.setState('attackRight');
                    
                    var that = this;
                    function test() {
                        z.setState('idleRight');
                        //that.survivorAttack();
                    }
                } else {
                    console.log("test test test");
                    setTimeout(temp, 350);
                    z.setState('attackLeft');
                    var that = this;
                    function temp() {
                        z.setState('idleLeft');
                        //that.survivorAttack();
                    }
                }

                //Have the survivor take damage.
                this.survivorDamage(this.normZombDmg);
            } else {
                //Move towards the survivor.
                this.moveZombie(z);
            }
        }
    }

    /*
    Moves the zombie towards the player.
    */
    moveZombie(zomb) {
        //Gather all appropriate variables.
        var directions = []; //An array of directions that the zombie will take.
        var surTileX = this.Survivor.getCurrentTile().getTileX(); //Tile X location of the Survivor.
        var surTileY = this.Survivor.getCurrentTile().getTileY(); //Tile Y location of the Survivor.
        var zombTileX = zomb.getCurrentTile().getTileX(); //Tile X of this zombie.
        var zombTileY = zomb.getCurrentTile().getTileY(); //Tile Y of this zombie.

        var xDelta = surTileX - zombTileX; //Delta between zombie and survivor's X locations.
        var yDelta = surTileY - zombTileY; //Delta between zombie and survivor's Y locations.

        var isAbove = (yDelta < 0); //Whether the survivor is above or below the zombie.
        var isLeft = (xDelta < 0); //Whether the survivor is to the left or right of the zombie.
        var isEvenHor = (yDelta == 0); //Whether the survivor is even on the horizontal plane with the zombie.
        var isEvenVert = (xDelta == 0); //Whether the survivor is even on the veritcal plane with the zombie.


        //console.log("xDelta = " + xDelta, " yDelta = " + yDelta + " isAbove = " + isAbove + " isLeft = " + isLeft);
        //console.log("isEvenHorizontal = " + isEvenHor + " isEvenVert = " + isEvenVert);

        //Populate the directions array.
        if (isEvenHor) {
            if (isLeft) {
                directions.push('left');
            } else {
                directions.push('right');
            }
        }
        if (isEvenVert) {
            if (isAbove) {
                directions.push('up');
            } else {
                directions.push('down');
            }
        }

        if (isAbove && isLeft) {
            directions.push('left');
            directions.push('up');
        } else if (isAbove && !isLeft) {
            directions.push('up');
            directions.push('right');
        } else if (!isAbove && isLeft) {
            directions.push('down');
            directions.push('left');
        } else if (!isAbove && !isLeft) {
            directions.push('down');
            directions.push('right');
        } else {
            //Do nothing.
        }


        //console.log("Directions: " + directions[0] + " " + directions[1] + " " + directions[2] + " " + directions[3]);

        for (const t of directions) {
            if (this.moveCharacter(zomb, t)) {
                return;
            }
        }


    }


    /*
    Helper method to see if the survivor is adjacent to the current zombie.
    */
    isSurvivorAdjacent(zomb) {
        var result = false;
        var adjTiles = []; //Tile array representing the attack radius of the zombie.
        var upTile = this.gameBoard[zomb.getCurrentTile().getTileX()][zomb.getCurrentTile().getTileY() - 1];
        var downTile = this.gameBoard[zomb.getCurrentTile().getTileX()][zomb.getCurrentTile().getTileY() + 1];

        if (zomb.getFacingRight()) {
            var rightTile = this.gameBoard[zomb.getCurrentTile().getTileX() + 1][zomb.getCurrentTile().getTileY()];
            adjTiles.push(rightTile);
        } else {
            var leftTile = this.gameBoard[zomb.getCurrentTile().getTileX() - 1][zomb.getCurrentTile().getTileY()];
            adjTiles.push(leftTile);
        }
        adjTiles.push(upTile);
        adjTiles.push(downTile);

        for (const t of adjTiles) {
            if (this.Survivor.getCurrentTile() == t) {
                result = true;
            }
        }

        if (result) {
            return adjTiles;
        } else {
            return false;
        }

        return false;
    }



    /*
    Resolves the player's/survivor's attacks. 
    */
    survivorAttack() {
        var affectedTiles = []; //An array of tiles affected by the attack.
        var SurvivorTile = this.Survivor.getCurrentTile(); //Survivor's tile.
        var upTile = this.gameBoard[SurvivorTile.getTileX()][SurvivorTile.getTileY() - 1]; //Tile north of survivor.
        var DownTile = this.gameBoard[SurvivorTile.getTileX()][SurvivorTile.getTileY() + 1]; //Tile south of survivor.
        affectedTiles.push(upTile, DownTile); //Add north/south tiles to affected tiles.

        //If the survivor is facing right, add the right tile to the array. If not, add the left tile.
        if (this.Survivor.getFacingRight()) {
            var rightTile = this.gameBoard[SurvivorTile.getTileX() + 1][SurvivorTile.getTileY()];
            affectedTiles.push(rightTile);
        } else {
            var leftTile = this.gameBoard[SurvivorTile.getTileX() - 1][SurvivorTile.getTileY()];
            affectedTiles.push(leftTile);
        }

        //Have all tiles take damage, if they *can* be damaged.
        for (const t of affectedTiles) {
            t.takeDamage();
        }
        //Have all zombies that may be in those tiles take damage.
        for (const z of this.activeZombies) {
            for (const t of affectedTiles) {
                if (z.getCurrentTile() == t) {
                    this.killZombie(z);
                }
            }
        }
    }

    /*
    Handles the animation and health reduction from the survivor taking damage.
    */
    survivorDamage(dmg) {
        console.log("Survivor taking damage = " + dmg);
        //Deduct health.
        this.currPlayerHealth -= dmg;

    }


    /*
    Kills the zombie, disabling rendering/collisions and moving it into the dead zombie array.
    */
    killZombie(zomb) {
        zomb.die();
        var zindex = this.activeZombies.indexOf(zomb);
        var removedZombie = this.activeZombies.splice(zindex, 1);
        this.deadZombies.push(zomb);
    }




    /*
    Moves the character in the argument in the direction desired, if possible. If not, returns false.
    */
    moveCharacter(character, direction) {
        
        var candidateTile;
        var currTileX = character.getCurrentTile().getTileX();
        var currTileY = character.getCurrentTile().getTileY();
        var charState;
        var result = true;

        switch (direction) {
            case 'up':
                candidateTile = this.gameBoard[currTileX][currTileY - 1]; 
                break;
            case 'left':
                candidateTile = this.gameBoard[currTileX - 1][currTileY]; 
                charState = 'idleLeft';
                break;
            case 'down':
                candidateTile = this.gameBoard[currTileX][currTileY + 1]; 
                break;
            case 'right':
                candidateTile = this.gameBoard[currTileX + 1][currTileY]; 
                charState = 'idleRight';
                break;
            default:
                console.log("Debug method: moveCharacter");
                break;
        }

        //If the candidate tile contains the survivor, it cannot be moved into.
        if (this.Survivor.getCurrentTile() == candidateTile) {
            result = false;
        }

        //If the candidate tile contains is not passable, it cannot be moved into.
        if (candidateTile.canBePassed() == false) {
            result = false;
        }

        //If the candidate tile contains an active zombie, it cannot be moved into.
        for (const z of this.activeZombies) {
            if (z.getCurrentTile() == candidateTile) {
                result = false;
            }
        }

        //If the tile can be moved into, move the entity and change animation state.
        if (result) {
            character.moveChar(candidateTile);

        }

        if (charState != null) {
            character.setState(charState);
        }
        return result;
    }

    /*
    Populates the GameBoard with tiles.
    */
    populateGameBoard(gameEngine, sheet) {
        //Populate each tile as dirt to begin.
        for (var i = 0; i < this.boardHeight; i++) {
            for (var j = 0; j < this.boardWidth; j++) {
                var tile = new Tile(gameEngine, sheet, this.startingX + (i * 64), this.startingY + (j * 64), i, j, 'dirt');
                this.gameBoard[i][j] = tile;
            }
        }
        this.generatePerimeter();
        this.generateObstacles(6, 4);
        this.placeExit(this.exitX, this.exitY);
    }

    /*
    Resets the center tiles to dirt.
    */
    resetGameBoard() {
        for (var i = 1; i < this.boardHeight - 1; i++) {
            for (var j = 1; j < this.boardWidth - 1; j++) {
                this.gameBoard[i][j].setType('dirt');
            }
        }
    }

    /*
    Generates the walls on the outside of the map.
    */
    generatePerimeter() {
        for (var i = 0; i < this.boardHeight; i++) {
            for (var j = 0; j < this.boardWidth; j++) {
                if (i === 0 || j === 0 || i === (this.boardWidth - 1) || j === (this.boardHeight - 1)) {
                    this.gameBoard[i][j].setType('wall');
                }
            }
        }
    }
    
    /*
    Generates the obstacles in the center of the map.
    */
    generateObstacles(thorns, walls) {
        var numThorns = thorns;
        var numWalls = walls;

        //Place a number of thorn tiles around the center of the map.
        while (numThorns > 0) {
            var randX = this.getRand(2, (this.boardWidth - 3));
            var randY = this.getRand(2, (this.boardHeight - 3));
            if (this.gameBoard[randX][randY].getType() == "dirt") {
                this.gameBoard[randX][randY].setType("thorns");
                numThorns--;
            } 
        }

        //Place a number of impassable wall tiles around the center of the map.
        while (numWalls > 0) {
            var randX = this.getRand(2, (this.boardWidth - 3));
            var randY = this.getRand(2, (this.boardHeight - 3));
            if (this.gameBoard[randX][randY].getType() == "dirt") {
                this.gameBoard[randX][randY].setType("wall");
                numWalls--;
            }
        }
    }

    /*
    Places the exit tile at the given location.
    */
    placeExit(x, y) {
        this.gameBoard[x][y].setType('exit');
    }

    /*
    Helper method for random number generation.
    */
    getRand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    /*
    Returns true if the player has reached the exit, false otherwise.
    */
    checkForExit() {
        var result = false;
        var survTileX = this.Survivor.getCurrentTile().getTileX();
        var survTileY = this.Survivor.getCurrentTile().getTileY();
        if (this.gameBoard[survTileX][survTileY].getType() === 'exit') {
            result = true;
            console.log("Survivor is in exit.");
        }
        return result;
    }


    /*
    Adds appropriate event listeners.
    */
    addListeners() {
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            //If the key pressed is equal to a valid entry key, begin turn.
            for (const k of this.validKeys) {
                if (keyName === k) {
                    this.turn(keyName);
                }
            }
        })

    }





}

