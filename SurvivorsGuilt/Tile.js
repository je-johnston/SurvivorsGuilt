/*
* An Entity representing a single Tile on the gameboard.
*/
class Tile extends Entity {
    constructor(game, spritesheet, x, y, type) {
        super(game, x, y);
        this.game = game;
        this.ctx = game.ctx;
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        console.log(type + " Tile created at X = " + x + " Y = " + y);

    }

    update() {
        //Shouldn't be needed.
    }

    draw() {
        this.ctx.drawImage(this.spritesheet, 128, 128, 32, 32, this.x, this.y, 64, 64);
    }

}


