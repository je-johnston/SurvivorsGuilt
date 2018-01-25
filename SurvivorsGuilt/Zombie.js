
class Zombie extends Entity {
    constructor(game, sp1, sp2, tile) {
        super(game, 0, 0);
        this.Animation = new Animation(sp1, 0, 0, 32, 32, .25, 6, true, false);
        this.ctx = game.ctx;
        this.tile = tile;
        this.setTile(tile);
        this.sp1 = sp1;
        this.sp2 = sp2;

        this.isFacingRight = true;
        this.setState('idleLeft');

        game.addEntity(this);

    }

    //Moves the Zombie.
    setTile(t) {

        console.log("Moving Zombie to Tile: " + t.getTileX() + "," + t.getTileY());

        this.x = t.getX();
        this.y = t.getY();
        this.tile = t;
    }

    getFacingRight() {
        return this.isFacingRight;
    }

    //Sets the current state of the Zombie.
    setState(st) {
        this.state = st;

        switch (this.state) {
            case 'idleRight':
                this.Animation = new Animation(this.sp1, 0, 0, 32, 32, .25, 6, true, false);
                this.isFacingRight = true;
                break;
            case 'idleLeft':
                this.Animation = new Animation(this.sp1, 192, 0, 32, 32, .25, 6, true, true);
                this.isFacingRight = false;
                break;
            case 'attackLeft':
                this.Animation = new Animation(this.sp2, 192, 160, 32, 32, .25, 2, false, true);
                this.isFacingRight = false;
                break;
            case 'attackRight':
                this.Animation = new Animation(this.sp1, 0, 160, 32, 32, .25, 2, false, false);

                this.isFacingRight = true;
                break;
            case 'damageLeft':

                this.isFacingRight = false;
                break;
            case 'damageRight':

                this.isFacingRight = true;
                break;
            default:
                break;


        }

    }

    //Gets the current state of the Zombie.
    getState() {
        return this.state;
    }

    //Return the tile the Zombie is currently on.
    getCurrentTile() {
        return this.tile;
    }

    //Draws the Zombie - Inherited from code from instructor.
    draw() {
        this.Animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    }

    //Not needed.
    update() {

    }



}

