
/*
* Survivor Class
* Represents the Player on the gameboard.
*/
class Survivor extends Entity {
    constructor(game, spritesheet, tile) {
        super(game, 0, 0);
        this.Animation = new Animation(spritesheet, 32, 32, 8, .25, 6, true, 2);
        this.Animation = new Animation(spritesheet, 0, 0, 32, 32, .25, 6, true, false);
        this.ctx = game.ctx;
        this.tile = tile;
        this.setTile(tile);
        game.addEntity(this);

    }

    //Moves the survivor.
    setTile(t) {


        console.log("Moving Survivor to Tile: " + t.getTileX() + "," + t.getTileY());

        this.x = t.getX();
        this.y = t.getY();
        this.tile = t;
    }

    getCurrentTile() {
        return this.tile;
    }


    draw() {
        this.Animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }

    update() {
        
    }





}



