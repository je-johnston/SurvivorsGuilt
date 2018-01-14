
function Tile(game, spritesheet, x, y, type) {
    //this.Animation = new Animation(spritesheet, 32, 32, 8, .25, 6, true, 2);
    this.ctx = game.ctx;
    Entity.call(this, game, x, y);

    //console.log("Survivor created at x: " + x + "y: " + y);
}



Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;
