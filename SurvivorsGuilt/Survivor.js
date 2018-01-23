
/*
* Survivor Class
* Represents the Player on the gameboard.
*/
class Survivor extends Entity {
    constructor(game, spritesheet, tile) {
        super(game, 0, 0);
        this.Animation = new Animation(spritesheet, 32, 32, 8, .25, 6, true, 2);
        this.ctx = game.ctx;
        this.tile = tile;
        this.setTile(tile);

        //Doesn't work, examine.
        //console.log("Survivor created at Tile: " + tile.getX + "," + tile.getY);


        this.moveSurvivor = function () {
            console.log("temp");
        }


    }

    setTile(t) {

        this.x = t.getX();
        this.y = t.getY();

    }


    draw() {
        this.Animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }

    update() {
        
    }





}



