
class GameBoard {
    constructor(gameEngine, startingX, startingY, boardWidth, boardHeight) {

        this.gameEngine = gameEngine;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.startingX = startingX;
        this.startingY = startingY;

        var asset = AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png");
      
        //var tileOne = new Tile(gameEngine, asset, 100, 600,0,0, "thorns");
        //gameEngine.addEntity(tileOne);

        //Create a 2D array representing the game board.
        var myBoard = new Array(this.boardHeight + 1); //+1 for the 'wall' tiles / perimeter.
        for (var i = 0; i < boardWidth + 1; i++) {
            //myBoard[i] = new Array(this.boardWidth + 1);
        }

        this.createBoard();
    }

    createBoard() {
        console.log("Creating the gameboard.");

    }


}