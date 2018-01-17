var AM = new AssetManager();


function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y);
};

Background.prototype.update = function () {
};

AM.queueDownload("./Assets/img/Scavengers_SpriteSheet.png");
AM.queueDownload("./Assets/img/Scavengers_SpriteSheet_2.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    var tileOne = new Tile(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 200, 200, "dirt1");
    var tileTwo = new Tile(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 264, 264, "dirt1");
    var tileThree = new Tile(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 200, 264, "dirt1");
    var tileFour = new Tile(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 264, 200, "dirt1");
    gameEngine.addEntity(tileOne);
    gameEngine.addEntity(tileTwo);
    gameEngine.addEntity(tileThree);
    gameEngine.addEntity(tileFour);
    var tempSurvivor = new Survivor(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 200, 200);
    gameEngine.addEntity(tempSurvivor);

    

   

    console.log("All Done!");
});