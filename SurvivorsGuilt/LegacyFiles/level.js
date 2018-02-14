//Level Class. Creates a new level based upon the level number passed in.
class Level {
    constructor(levNum, gmengine, sheetOne, sheetTwo, gameMan, eng) {
        this.levNum = levNum;
        this.gmengine = gmengine;
        this.sheetOne = sheetOne;
        this.sheetTwo = sheetTwo;
        this.gameMan = gameMan;
        this.eng = eng;

        //Create the game board.
        var gb = new GameBoard(gmengine, 75, 75, 10, 10, 6, 4);

        //Create the survivor and place him in the level.
        var surv = new Survivor(gmengine, sheetOne, sheetTwo, gb.findTile(1,8));

        //Create an array of zombies.
        var zombies = [];
        var zOne = new Zombie(gmengine, sheetOne, sheetTwo, gb.findTile(8, 2));
        zombies.push(zOne);


        //Create the Turn Manager.
        var tm = new TurnManager(surv, gb, zombies, gameMan);

        console.log("Level: " + levNum + " Created.");

        


    }

}