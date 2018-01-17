
//An Entity representing a single Tile on the gameboard.
class Tile extends Entity {
    constructor(game, spritesheet, x, y, type) {
        super(game, x, y);
        console.log(type + " Tile created at X = " + x + " Y = " + y);
    }
}


