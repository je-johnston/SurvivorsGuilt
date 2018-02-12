//Turn Manager Class. Handles input, player actions and enemy actions.

class TurnManager {
    constructor(survivor, gameboard, zombies, gameMan) {
        console.log("Turn Manager Created.");
        //The number of turns.
        this.turnNum = 0;
        //The Survivor.
        this.survivor = survivor;
        //The Zombies.
        this.zombies = zombies;
        //The Game Board.
        this.gameboard = gameboard;
        //Reference to the game manager.
        this.gameMan = gameMan;

        

        //Whether input is accepted or not.
        this.inputAccepted = true;



        //Handle Keyboard Input.
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            this.turn(keyName);
        })
    }


    //The turn sequence.
    turn(key) {
        console.log("Key Pressed: " + key)

        //Only allow input if all previous action has completed.
        if (this.inputAccepted) {
            //Disable user input.
            this.inputAccepted = false;

            //Increment the turn number.
            this.turnNum++;

            //Resolve the player's actions.
            this.playerAction(key);

            //Check to see if the player has moved to the exit. If he has, end level.
            if (this.survivor.getCurrentTile().getType() == 'exit') {
                console.log("Survivor has reached exit.");
                this.gameMan.createNextLevel();
            }
            //If survivor has not reached exit, resolve the enemy's actions.
            for (const z of this.zombies) {
                this.enemyAction(z);
            }

            //Return input to user.
            this.inputAccepted = true;
        }
        
    }

    //Initiate player action.
    playerAction(key) {
        //Get the survivor's tile.
        var survTile = this.survivor.getCurrentTile();

        switch (key) {
            case 'd': //Attempt to move the survivor to the right.
                this.moveEntity(this.survivor, 'right');
                
                break;
            case 'w': //Attempt to move the survivor up.
                this.moveEntity(this.survivor, 'up');
                break;
            case 'a': //Attempt to move the survivor left.
                this.moveEntity(this.survivor, 'left');
                
                break;
            case 's': //Attempt to move the survivor down.
                this.moveEntity(this.survivor, 'down');
                break;
            case ' ': //Attempt to attack in the direction the survivor is facing.
                if (this.survivor.getFacingRight()) {
                    setTimeout(test, 350);
                    this.survivor.setState('attackRight');
                    var that = this;
                    function test() {
                        that.survivor.setState('idleRight');
                        that.resolvePlayerAttacks();
                    }
                } else {
                    setTimeout(temp, 350);
                    this.survivor.setState('attackLeft');
                    var that = this;
                    function temp() {
                        that.survivor.setState('idleLeft');
                        that.resolvePlayerAttacks();
                    }
                }
                //this.survivor.setState('idleRight');
                break;
            default:
                console.log("Not a valid key.");
                break;
        }
    }


    //Resolves the player's attacks.
    resolvePlayerAttacks() {
        //Populate an array with the tiles the player will be attacking.
        var affectedTiles = [];
        var surTile = this.survivor.getCurrentTile();
        var upTile = this.gameboard.findTile(surTile.getTileX(), surTile.getTileY() - 1);
        var downTile = this.gameboard.findTile(surTile.getTileX(), surTile.getTileY() + 1);

        affectedTiles.push(surTile, upTile, downTile);

        if (this.survivor.getFacingRight()) {
            var rightTile = this.gameboard.findTile(surTile.getTileX() + 1, surTile.getTileY());
            affectedTiles.push(rightTile);
        } else {
            var leftTile = this.gameboard.findTile(surTile.getTileX() - 1, surTile.getTileY());
            affectedTiles.push(leftTile);
        };

        for (let val of affectedTiles) {
            val.takeDamage();
        }

    }

    //Resolves the zombie's actions.
    enemyAction(zombie) {
        //Get the survivor's tile.
        var surTile = this.survivor.getCurrentTile();
        //Get the current Zombie's tile.
        var zTile = zombie.getCurrentTile();

        if (this.checkForSurvivor(zTile, surTile)) {
            //Survivor is next to a zombie. Initiate attack animation and have survivor take damage.
        } else {
            //Survivor is not next to this zombie. Have it move towards survivor's location.
            this.moveZombie(zTile, surTile, zombie);
        }
    }

    //Moves the zombie closer to the player.
    moveZombie(zTile, surTile, zombie) {

        //Capture the delta between the zombie's location and the player's.
        var xDelta = zTile.getTileX() - surTile.getTileX();
        var yDelta = zTile.getTileY() - surTile.getTileY();

        var absX = Math.abs(xDelta);
        var absY = Math.abs(yDelta);

        //Whether the survivor is up/down and left/right of the current zombie.
        var isAbove = (yDelta > 0);
        var isEvenHorz = (xDelta == 0);
        var isEvenVert = (yDelta == 0);
        var isToLeft = (xDelta > 0);


        //An array representing the desired directions in order of attempted execution.
        var zDir = ['left', 'down', 'right', 'up'];

        if (isAbove && !isToLeft) {
            zDir = ['up', 'right', 'left', 'down'];
        }



        for (const z of zDir) {
            if (this.moveEntity(zombie, z)) {
                break;
            }
        }



        

    }


    //Checks to see if the player is adjacent to the zombie. Returns true if he is, false otherwise.
    checkForSurvivor(zTile, surTile) {
    //Populate an array with all tiles adjacent to the current zombie.
        var affectedTiles = [];
        var upTile = this.gameboard.findTile(zTile.getTileX(), zTile.getTileY() - 1);
        var downTile = this.gameboard.findTile(zTile.getTileX(), zTile.getTileY() + 1);
        var rightTile = this.gameboard.findTile(zTile.getTileX() + 1, zTile.getTileY());
        var leftTile = this.gameboard.findTile(zTile.getTileX() - 1, zTile.getTileY());
        affectedTiles.push(leftTile, upTile, downTile, rightTile);

        //Check to see if the survivor is in one of those tiles.
        for (let val of affectedTiles) {
            if (val.getTileX() == surTile.getTileX() && val.getTileY() == surTile.getTileY()) {
                return true;
            }
        }
        return false;
    }

    //Moves an entity if possible. If not, simply returns false.
    moveEntity(character, direction) {
        var orgTile = character.getCurrentTile();
        var candidateTile;
        var charState;
        var result = true;

        switch (direction) {
            case 'up':
                candidateTile = this.gameboard.findTile(orgTile.getTileX(), orgTile.getTileY() - 1);
                break;
            case 'left':
                candidateTile = this.gameboard.findTile(orgTile.getTileX() - 1, orgTile.getTileY());
                charState = 'idleLeft';
                break;
            case 'down':
                candidateTile = this.gameboard.findTile(orgTile.getTileX(), orgTile.getTileY() + 1);
                break;
            case 'right':
                candidateTile = this.gameboard.findTile(orgTile.getTileX() + 1, orgTile.getTileY());
                charState = 'idleRight';
                break;
            default:
                console.log("Debug method: moveEntity in file: TurnManager.js");
                break;
        }

        //If the candidate tile contains the survivor, it cannot be moved into.
        if (this.survivor.getCurrentTile() == candidateTile) {
            result = false;
        }

        //If the candidate tile contains is not passable, it cannot be moved into.
        if (candidateTile.canBePassed() == false) {
            result = false;
        }

        //If the candidate tile contains a zombie, it cannot be moved into.
        for (const z of this.zombies) {
            if (z.getCurrentTile() == candidateTile) {
                result = false;
            }
        }

        //If the tile can be moved into, move the entity and change animation state.
        if (result) {
            character.setTile(candidateTile);
            
        }

        if (charState != null) {
            character.setState(charState);
        }

        

        return result;

    }




}