

/**
 *Entity to hold the game over logo.
 */
class GameOver extends Entity {

    constructor(game, img, x, y) {

        super(game, x, y);
        this.game = game;
        this.ctx = game.ctx;
        this.x = x;
        this.y = y;
        this.image = img;

        this.isVisible = false;;
        game.addEntity(this);

    }

    toggle(val) {
        this.isVisible = val;
    }

    draw() {
        if (this.isVisible) {
            this.ctx.drawImage(this.image, this.x, this.y);
        }
    }

}