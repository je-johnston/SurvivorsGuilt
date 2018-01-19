
class GameManager {
    constructor() {
        console.log("Game Manager Created.");
        var canvas = document.getElementById("gameWorld");
        var ctx = canvas.getContext("2d");
        var gameEngine = new GameEngine();
        gameEngine.init(ctx);
        gameEngine.start();

        var gb = new GameBoard(gameEngine, 100, 500, 10, 10);

        var tempSurvivor = new Survivor(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 200, 200);
        gameEngine.addEntity(tempSurvivor);




    }

}