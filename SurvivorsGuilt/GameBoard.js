
class GameBoard {

    constructor(gameEngine, startingX, startingY, boardWidth, boardHeight, numThorns, numWalls) {

        this.gameEngine = gameEngine;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.startingX = startingX;
        this.startingY = startingY;
        this.numThorns = numThorns;
        this.numWalls = numWalls;
        var asset = AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png");

        



        //Create a 2D array representing the game board.
        var myBoard = [];
        for (var i = 0; i < boardWidth; i++) {
            myBoard[i] = new Array(this.boardWidth);
        }

        //Add Tiles to the game board.
        for (var i = 0; i < this.boardHeight; i++) {
            for (var j = 0; j < this.boardWidth; j++) {
                //Tiles are "dirt" by default.
                var tileType = "dirt";
                //If at the edges of the map, place impassable walls.
                if (i === 0 || j === 0 || i === (this.boardWidth - 1) || j === (this.boardHeight - 1)) {
                    tileType = "wall";
                }
                //Place the exit tile in the top right corner.
                if (i === (this.boardWidth - 2) && j === 1) {
                    tileType = 'exit';
                }

                var tile = new Tile(gameEngine, asset, this.startingX + (i*64), this.startingY+(j*64), i, j, tileType);
                myBoard[i][j] = tile;

            }
        }


        //Place a number of thorn tiles around the map.
        while (numThorns > 0) {


            var randX = this.getRand(2, (this.boardWidth - 3));
            var randY = this.getRand(2, (this.boardHeight - 3));

            var tempTile = myBoard[randX][randY];

            if (tempTile.getType() != "dirt") {
                continue; 
            }
            
            tempTile.setType("thorns"); 
            numThorns--;
        }

        while (numWalls > 0) {


            var randX = this.getRand(2, (this.boardWidth - 3));
            var randY = this.getRand(2, (this.boardHeight - 3));

            var tempTile = myBoard[randX][randY];

            if (tempTile.getType() != "dirt") {
                continue;
            }


            tempTile.setType("wall");
            numWalls--;
        }


        //Add all tiles to the game engine.
        for (var i = 0; i < this.boardHeight; i++) {
            for (var j = 0; j < this.boardWidth; j++) {
                gameEngine.addEntity(myBoard[i][j]);
            }
        }


        this.findTile = function (tx, ty) {
            return myBoard[tx][ty];
        }

        
    }



        getRand(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }




}