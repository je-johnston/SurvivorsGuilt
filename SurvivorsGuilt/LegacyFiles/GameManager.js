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

        document.getElementById("health").innerHTML = playerHealth;
        document.getElementById("food").innerHTML = playerFood;

        var gb = new GameBoard(gameEngine, 75, 75, 10, 10, 6, 4);
        //Create the survivor and place him in the level.
        var surv = new Survivor(gameEngine, sheetOne, sheetTwo, gb.findTile(1, 8));
        //Create an array of zombies.
        var zombies = [];
        var zOne = new Zombie(gameEngine, sheetOne, sheetTwo, gb.findTile(8, 2));
        zombies.push(zOne);
        //Create the Turn Manager.
        var tm = new TurnManager(surv, gb, zombies, this);


        this.removeAll = function () {
            gameEngine.clearEntities();
            

        }
    }

    createNextLevel() {
        console.log("GM: Creating next level");
        this.removeAll();

    }


    







}