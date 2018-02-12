//Game Manager class handles UI and level creation.
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

        var currentLevNum = 1;

        var playerHealth = 100;
        var playerFood = 100;

        //Create level (temp/debug)
        var lvl = new Level(currentLevNum, gameEngine, sheetOne, sheetTwo, this, gameEngine);

        document.getElementById("health").innerHTML = playerHealth;
        document.getElementById("food").innerHTML = playerFood;

        this.removeAll = function () {
            //gameEngine.clearEntities();
            //this.lvl = new Level(currentLevNum, gameEngine, sheetOne, sheetTwo, this);
        };
        

    }

    createNextLevel() {
        console.log("GM: Creating next level");
        this.removeAll();
        

    }


    







}