/**
 *Food class. Simply renders a food object.
 */

class Food extends Entity {
    constructor(game, sp1, tile) {
        super(game, 0, 0);
        this.ctx = game.ctx;
        this.tile = tile;
        this.sp1 = sp1;
        this.isAlive = false;
        this.moveChar(tile);
        //Randomly choose between two types of food.
        this.isSoda = this.coinFlip();
        this.game.addEntity(this);

        


    }

    //Places the food.
    moveChar(t) {
            this.x = t.getX();
            this.y = t.getY();
            this.tile = t;
    }

    //Simple coin flip function - source: https://coderwall.com/p/vcom6g/quick-coin-flip-heads-tails-function-in-javascript
    coinFlip() {
    return (Math.floor(Math.random() * 2) == 0);
    }
    //Enable/disable
    setActive(val) {
        this.isAlive = val;
    }

    getTile() {
        return this.tile;
    }

    getActive() {
        return this.isAlive;
    }

    //Draws the food.
    draw() {
        //Only render active food.
        if (this.isAlive) {
            if (this.isSoda) { 
            this.ctx.drawImage(this.sp1, 64, 64, 32, 32, this.x, this.y, 64, 64);
            } else {
                this.ctx.drawImage(this.sp1, 96, 64, 32, 32, this.x, this.y, 64, 64);
            }
        }
    }




}