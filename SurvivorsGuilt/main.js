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

    var tempSurvivor = new Survivor(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 200, 200);
    gameEngine.addEntity(tempSurvivor);

    gameEngine.addEntity(new Tile(gameEngine, AM.getAsset("./Assets/img/Scavengers_SpriteSheet.png"), 300, 300, "dirt1"));

    //var img = new Image();
    //img.src = './Assets/img/Scavengers_SpriteSheet.png';

    //gameEngine.addEntity(new Tile(gameEngine, img, 300, 300), "dirt1");


    console.log("All Done!");
});