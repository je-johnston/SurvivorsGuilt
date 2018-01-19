/*
* An Entity representing a single Tile on the gameboard.
*/
class Tile extends Entity {

    constructor(game, spritesheet, x, y, tileX, tileY, type) {
        super(game, x, y);
        this.game = game;
        this.ctx = game.ctx;
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.tileX = tileX;
        this.tileY = tileY;


        //The X and Y Coordinates of this tile on the sprite sheet. 128 is the default value.
        var sheetX = 128;
        var sheetY = 128;

        //The X and Y coordinates of the damaged version of this tyle on the sprite sheet.
        var dmgSheetX = 0;
        var smgSheetY = 0;

        //Whether the tile can be traversed.
        var isPassable;
        //Whether the tile can be damaged/destroyed.
        var isDamageable;
        //Whether the tile has *already* been damaged.
        var isDamaged;
        
        this.findTileType(type);
        

        console.log(type + " Tile at (" + this.tileX + "," + this.tileY + ")"+ " created at canvas position X = " + x + " Y = " + y);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getTileX() {
        return this.tileX;
    }

    getTileY() {
        return this.tileY;
    }


    getType() {
        return this.type;
    }

    canBeDamaged() {
        return this.isDamageable;
    }

    hasBeenDamaged() {
        return this.isDamaged;
    }

    update() {
        //Shouldn't be needed.
    }

    //Finds the location on the sprite sheet of a given type of tile. 
    findTileType(theType) {
        switch (theType) {
            case 'dirt':
                console.log("Choosing a Random Dirt Tile.");
                this.isDamageable = false;
                this.isPassable = true;
                var randNum = Math.floor((Math.random() * 5) + 1);
                switch (randNum) {
                    case 1:
                        this.sheetX = 0;
                        this.sheetY = 128;
                        break;
                    case 2:
                        this.sheetX = 32;
                        this.sheetY = 128;
                        break;
                    case 3:
                        this.sheetX = 64;
                        this.sheetY = 128;
                        break;
                    case 4:
                        this.sheetX = 96;
                        this.sheetY = 128;
                        break;
                    case 5:
                        this.sheetX = 128;
                        this.sheetY = 128;
                        break;
                    default:
                        break;
                }
                break;
            case 'wall':
                console.log("Choosing a Random Wall Tile.");
                this.isPassable = false;
                this.isDamageable = false;
                var randNum = Math.floor((Math.random() * 2) + 1);
                switch (randNum) {
                    case 1:
                        this.sheetX = 32;
                        this.sheetY = 96;
                        break;
                    case 2:
                        this.sheetX = 64;
                        this.sheetY = 96;
                        break;
                    default:
                        break;
                }
                break;
            case 'thorns':
                console.log("Choosing a Random Thorn Tile.");
                this.isPassable = false;
                this.isDamageable = true;
                this.hasBeenDamaged = false;
                var randNum = Math.floor((Math.random() * 5) + 1);
                console.log("Debug - Thorn RandNum = " + randNum);
                switch (randNum) {
                    case 1:
                        this.sheetX = 160;
                        this.sheetY = 64;
                        this.dmgSheetX = 0;
                        this.dmgSheetY = 192;
                        break;
                    case 2:
                        this.sheetX = 192;
                        this.sheetY = 64;
                        this.dmgSheetX = 32;
                        this.dmgSheetY = 192;
                        break;
                    case 3:
                        this.sheetX = 224;
                        this.sheetY = 64;
                        this.dmgSheetX = 64;
                        this.dmgSheetY = 192;
                        break;
                    case 4:
                        this.sheetX = 0;
                        this.sheetY = 96;
                        this.dmgSheetX = 96;
                        this.dmgSheetY = 192;
                        break;
                    case 5:
                        this.sheetX = 192;
                        this.sheetY = 96;
                        this.dmgSheetX = 160;
                        this.dmgSheetY = 192;
                        break;
                    default:
                        break;
                }
                break;
            default:
                console.log("ERROR, Debug Immediately");
                break;
        }


        

    }


    draw() {
        if (this.isDamageable === false || this.hasBeenDamaged === false) {
        this.ctx.drawImage(this.spritesheet, this.sheetX, this.sheetY, 32, 32, this.x, this.y, 64, 64);
        } else {
            this.ctx.drawImage(this.spritesheet, this.dmgSheetX, this.dmgSheetY, 32, 32, this.x, this.y, 64, 64);
        }

    }

}


