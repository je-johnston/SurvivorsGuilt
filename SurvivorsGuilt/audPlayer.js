
class audPlayer {

    constructor() {

        console.log("Audio beginning");

        this.music = new Audio('./Assets/Audio/scavengers_music.mp3');
        this.music.play();
        this.music.loop = true;

        this.audButton = document.getElementById("musicToggler");

        var that = this;
        this.audButton.onclick = function () {
            that.toggleMusic();
        }

        this.audButton.onmousedown = function () {
            console.log("Audio Button Mouse Down");
            that.audButton.style.fontWeight = "bold";
        }

        this.audButton.onmouseup = function () {
            console.log("Audio Button Mouse Up");
            that.audButton.style.fontWeight = "normal";
        }



    }

    toggleMusic() {
        console.log("Toggling Music.");
        if (this.music.paused) {
            this.music.play();
        } else {
            this.music.pause();
        }
    }





}