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
        this.playerFood = 125; //Current amount of player food.
        this.foodValue = 35; //Amount of food gained when picked up.
        this.actionCost = 5; //The cost (in food) of a given player action (move or attack).
        this.exitX = 8; //Exit X value.
        this.exitY = 1; //Exit Y value.
        this.playerStartX = 1; //Player starting X.
        this.playerStartY = 8; //Player starting Y.
        this.isGameOver = false; //Whether the game has ended. Turn will not start if this is set to true.

        /*
        Score variables.
        */
        this.playerScore = 0; //The player's current score.
        


        /*
        Arrays containing active(/alive) zombies and dead/inactive ones.
        */
        this.activeZombies = [];
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
        //Create 3 Super and 3 Regular zombies and place them in the array as dead.
        for (i = 0; i < 3; i++) {
            var regZombie = new Zombie(gameEngine, sheetOne, sheetTwo, this.gameBoard[7][1], false, false);
            this.activeZombies.push(regZombie);
            //add super zombies
            var supZombie = new Zombie(gameEngine, sheetOne, sheetTwo, this.gameBoard[7][1], false, true);
            this.activeZombies.push(supZombie);
        }

      /*
      Create an array of food.
      */
        this.foodStock = [];
        for (var i = 0; i < 6; i++) {
            var yums = new Food(gameEngine, sheetOne, this.gameBoard[5][1]);
            this.foodStock.push(yums);
        }


        this.placeZombies(1);
        this.placeFood(3);
        var foodTest = new Food(gameEngine, sheetOne, this.gameBoard[7][1]);
        this.updateUI();
        this.addListeners();

    }

    /*
    Creates a new level by regenerating the map.
    */
    createLevel() {
        this.currentLevel++; //Increment the level number.

        var difScale = this.scaleDificulty();

        this.turnNum = 1; //Reset the turn number.
        this.resetGameBoard();//Remove all current obstacles.
        this.generateObstacles(difScale[0], difScale[1]);//Re-generate obstacles.
        this.placeExit(this.exitX, this.exitY); //Re-generate exit tile.
        this.placeFood(difScale[2]); //Re-add food.
        this.placeZombies(difScale[3]); //Re-add zombies.
        this.Survivor.moveChar(this.gameBoard[this.playerStartX][this.playerStartY]);//Place survivor in starting square.
        this.updateUI(); //Update the UI.
        this.inputAccepted = true;
        
    }

    /*
    Ends the current level.
    */
    endLevel() {
        this.inputAccepted = false; //Disable input.
        //Kill all zombies currently active.
        for (const z of this.activeZombies) {
            if (z.isZombieAlive()) {
                this.killZombie(z);
            }
        }
        //Remove all food.
        this.disableFood();

    }

    /*
    Places a number of food tiles across the level.
    */
    placeFood(fnum) {
        for (var i = 0; i < fnum; i++) {
            this.foodStock[i].setActive(true);
        }

        for (const f of this.foodStock) {
            if (f.getActive()) {
                while (true) {
                    var randX = this.getRand(2, 8);
                    var randY = this.getRand(1, 8);
                    if (this.gameBoard[randX][randY].getType() == 'dirt') {
                        f.moveChar(this.gameBoard[randX][randY]);
                        break;
                    }
                }
            }

        }
    }

    /**
     * Checks to see if the survivor has entered a food space. If it has, picks up the food and adds it to total.
     */
    pickUpFood() {
        var surTile = this.Survivor.getCurrentTile();
        for (const f of this.foodStock) {
            if (surTile === f.getTile() && f.getActive()) {
                f.setActive(false);
                this.playerFood += this.foodValue;
                this.playerScore += 10;
            }
        }
    }


    /**
     * Disables all food.
     */
    disableFood() {
        for (const f of this.foodStock) {
            if (f.getActive()) {
                f.setActive(false);
            }
        }

    }

    /**
     * Checks the user for health and food values. If less than 0, trigger game over.
     */
    checkHealthAndFood() {
        if (this.currPlayerHealth <= 0 || this.playerFood <= 0) {
            this.gameOver();
        }
    }

    /**
     * Game over. Sends up popup window.
     */
    gameOver() {
        this.inputAccepted = false;
        this.isGameOver = true;
        console.log("Game Over");
        //alert("Game Over!");

        var canvas = document.getElementById("gameWorld"); //Canvas element.
        var ctx = canvas.getContext("2d"); //Context.
        ctx.rect(0, 0, 400, 400);
        //ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.fill();


    }



    /*
    Updates the UI periodically.
    */
    updateUI() {
        document.getElementById("health").innerHTML = this.currPlayerHealth;
        document.getElementById("food").innerHTML = this.playerFood;
        document.getElementById("turn").innerHTML = this.turnNum;
        document.getElementById("lvl").innerHTML = this.currentLevel;
        document.getElementById("scr").innerHTML = this.playerScore;

    }

    /*
    The turn sequence. 
    */
    turn(keyPressed) {
        if (this.inputAccepted && !this.isGameOver) {
        this.turnNum++; //Increment the turn number.
        this.playerTurn(keyPressed); //Resolve the player's actions.
        }
        this.pickUpFood();//Check to see if the player has picked anything up. If he has, add it to total.
        this.inputAccepted = false;//Turn off input until all other actions are resolved.
        this.enemyTurn() //Resolve the zombie's actions.
        this.updateUI(); //Update the UI.
        this.checkHealthAndFood();
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

        //Add score.
        this.playerScore += (5 * (this.currentLevel));

        //Deduct food from player's total.
        this.playerFood -= this.actionCost;
    }

    /*
    The Enemy's turn.
    */
    enemyTurn() {
        //Iterate over each zombie.
        for (const z of this.activeZombies) {
            //If the zombie is alive
            if (z.isZombieAlive()) {
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
                if (z.getCurrentTile() == t && z.isZombieAlive() === true) {
                    this.killZombie(z);
                    this.playerScore += 25;
                    this.updateUI();
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
    Kills the zombie, disabling rendering/collisions.
    */
    killZombie(zomb) {
        zomb.die();
    }

    /*
    Places a number of zombies in the map.
    */
    placeZombies(zNum) {

        for (var i = 0; i < zNum; i++) {
            this.activeZombies[i].activateZombie();
        }

        //Iterate over every live zombie and set it to a random tile.

        for (const z of this.activeZombies) {
            if (z.isZombieAlive()) {
                while (true) {
                    var randX = this.getRand(1, 8);
                    var randY = this.getRand(1, 3);
                    if (this.gameBoard[randX][randY].getType() == 'dirt') {
                        z.moveChar(this.gameBoard[randX][randY]);
                        break;
                    }
                }
            }
        }



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

        //If the candidate tile contains an active, alive zombie, it cannot be moved into.
        for (const z of this.activeZombies) {
            if (z.getCurrentTile() == candidateTile && z.isZombieAlive()) {
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
                if (keyName === k && this.isGameOver === false) {
                    this.turn(keyName);
                }
            }
        })

    }

    /*
    Simple difficulty scalar based on the current level number.
    */
    scaleDificulty() {

        var result = []; //The result array.
        var numThorns = 0; //The number of thorns in a level.
        var numWalls = 0; //The number of wall objects in a level.
        var numFoods = 0; //The number of food items in a level.
        var numRegZombs = 0; //The number of regular zombies in a level.
        //var numSupZombs = 0;

        if (this.currentLevel <= 3) {

            numThorns = this.getRand(2, 6);
            numWalls = this.getRand(2, 4);
            numFoods = 4;
            numRegZombs = 1;

        } else if (this.currentLevel >= 4 && this.currentLevel <= 8) {

            numThorns = this.getRand(4, 7);
            numWalls = this.getRand(3, 5);
            numFoods = this.getRand(2, 3);
            numRegZombs = 2;

        } else {

            numThorns = this.getRand(5, 9);
            numWalls = this.getRand(4, 6);
            numFoods = this.getRand(1, 2);
            numRegZombs = this.getRand(2, 3);

        }

        result[0] = numThorns;
        result[1] = numWalls;
        result[2] = numFoods;
        result[3] = numRegZombs;
        //result[4] = numSupZombs;

        return result;


    }




}

