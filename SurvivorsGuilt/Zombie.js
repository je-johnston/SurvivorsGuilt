
/*
* Zombie class.
Represents a zombie.
*/
class Zombie extends Entity {
    constructor(game, sp1, sp2, tile, isAlive, isSuper) {
        super(game, 0, 0);
        this.ctx = game.ctx;
        this.tile = tile;
        this.isAlive = isAlive;
        this.moveChar(tile);
        this.sp1 = sp1;
        this.sp2 = sp2;
        this.isSuperZombie = isSuper;
        this.isFacingRight = true;
        this.setState('idleLeft');

        game.addEntity(this);

    }

    /*
    Reactivate dead zombie.
    */
    activateZombie() {
        this.isAlive = true;
        this.isFacingRight = false;
        this.setState('idleLeft');
    }

    //Moves the zombie.
    moveChar(t) {
        if (this.isAlive) {
            console.log("Moving Zombie to Tile: " + t.getTileX() + "," + t.getTileY());
            this.x = t.getX();
            this.y = t.getY();
            this.tile = t;
        }
    }

    getFacingRight() {
        return this.isFacingRight;
    }

    //Sets the current state of the Zombie.
    setState(st) {
        this.state = st;
        if (this.isSuperZombie === false) {
            switch (this.state) {
                case 'idleRight':
                    this.Animation = new Animation(this.sp2, 128, 32, 32, 32, .25, 4, true, false);
                    this.isFacingRight = true;
                    break;
                case 'idleLeft':
                    this.Animation = new Animation(this.sp1, 192, 0, 32, 32, .25, 6, true, false);
                    this.isFacingRight = false;
                    break;
                case 'attackLeft':
                    this.Animation = new Animation(this.sp1, 64, 160, 32, 32, .25, 2, false, false);
                    this.isFacingRight = false;
                    break;
                case 'attackRight':
                    this.Animation = new Animation(this.sp2, 130, 160, 32, 32, .25, 2, true, true);
                    this.isFacingRight = true;
                    break;
                default:
                    break;

            }
        } else { //Super zombie
            switch (this.state) {
                case 'idleRight':
                    this.Animation = new Animation(this.sp2, 0, 32, 32, 32, .25, 4, true, false);
                    this.isFacingRight = true;
                    break;
                case 'idleLeft':
                    this.Animation = new Animation(this.sp1, 128, 32, 32, 32, .25, 4, true, false);
                    this.isFacingRight = false;
                    break;
                case 'attackLeft':
                    this.Animation = new Animation(this.sp1, 128, 160, 32, 32, .25, 2, false, false);
                    this.isFacingRight = false;
                    break;
                case 'attackRight':
                    this.Animation = new Animation(this.sp2, 64, 160, 32, 32, .25, 2, true, true);
                    this.isFacingRight = true;
                    break;
                default:
                    break;
            }
        }

    }

    //Gets the current state of the Zombie.
    getState() {
        return this.state;
    }

    //Return the tile the zombie is currently on.
    getCurrentTile() {
        return this.tile;
    }

    //Disables rendering the zombie.
    die() {
        this.isAlive = false;
        console.log('%c ZOMBIE DIED', 'color: green');
    }

    //Gets the zombie's status.
    isZombieAlive() {
        return this.isAlive;
    }


    //Draws the zombie.
    draw() {
        //Only render zombie if it is alive.
        if (this.isAlive) {
            this.Animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
            Entity.prototype.draw.call(this);
        }
    }

    //Not needed.
    update() {

    }





}



