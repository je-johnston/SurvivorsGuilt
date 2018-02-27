﻿var AM = new AssetManager();


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
AM.queueDownload("./Assets/img/gameOver.png");
AM.queueDownload("./Assets/Aduio/scavengers_music.mp3");

AM.downloadAll(function () {
    
    var dm = new DungeonMaster();
   
});