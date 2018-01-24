//Game Manager class handles object / game entity instantiation.
class GameManager {
    constructor() {
        console.log("Game Manager Created.");
        var canvas = document.getElementById("gameWorld");
        var ctx = canvas.getContext("2d");
        var gameEngine = new GameEngine();
        gameEngine.init(ctx);
        gameEngine.start();

        var sheetOne = AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png");
        var sheetTwo = AM.getAsset("./Assets/img/Scavengers_SpriteSheet_2.png");

        //Create the game board.
        var gb = new GameBoard(gameEngine, 75, 75, 10, 10, 6, 4);

        //Create the survivor and place him in the level.
        var surv = new Survivor(gameEngine, sheetOne, sheetTwo, gb.findTile(1,8));

        //Create the Turn Manager.
        var tm = new TurnManager(surv, gb);


    }




    







}