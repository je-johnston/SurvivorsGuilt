//Game Manager class handles object / game entity instantiation.
class GameManager {
    constructor() {
        console.log("Game Manager Created.");
        var canvas = document.getElementById("gameWorld");
        var ctx = canvas.getContext("2d");
        var gameEngine = new GameEngine();
        gameEngine.init(ctx);
        gameEngine.start();

        //Create the game board.
        var gb = new GameBoard(gameEngine, 75, 75, 10, 10, 6);

        //Create the survivor and place him in the level.
        var surv = new Survivor(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), gb.findTile(1,8));

        //Create the Turn Manager.
        var tm = new TurnManager(surv, gb);


    }




    







}