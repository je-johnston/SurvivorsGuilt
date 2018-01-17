
/*
* Survivor Class
* Represents the Player on the gameboard.
*/
class Survivor extends Entity {
    constructor(game, spritesheet, x, y) {
        super(game, x, y);
        this.Animation = new Animation(spritesheet, 32, 32, 8, .25, 6, true, 2);
        this.ctx = game.ctx;
        console.log("Survivor created at X = " + x + " Y = " + y);
    }

    draw() {
        this.Animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }

    update() {
        //Test Code.
        //this.x += this.game.clockTick * 44;
        //if (this.x > 800) this.x = -200;
        //Entity.prototype.update.call(this);
    }


}



//Legacy Code

////Creates a new Surivor at the given coordinates.
//function Survivor(game, spritesheet, x, y) {
//    this.Animation = new Animation(spritesheet, 32, 32, 8, .25, 6, true, 2);
//    this.ctx = game.ctx;
//    Entity.call(this, game, x, y);

//    console.log("Survivor created at x: " + x + "y: " + y);
//}

//Survivor.prototype = new Entity();
//Survivor.prototype.constructor = Survivor;

////Survivor.prototype.update = function () {
////    this.x += this.game.clockTick * 44;
////    if (this.x > 800) this.x = -200;
////    Entity.prototype.update.call(this);
////}


//Survivor.prototype.draw = function () {
//    this.Animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//    Entity.prototype.draw.call(this);
//}