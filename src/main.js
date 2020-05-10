/*
Mark Medved, Ben Rowland, and Thane Wisherop
NAME OF GAME
DATE COMPLETED

DESCRIPTION TEXT
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    physics:{
        default:'arcade',
        arcade:{
            debug: true,
            gravity:{
                x:0,
                y:0
            }
        }
    },
    scene: [Menu, Instructions, Play]
};

let game = new Phaser.Game(config);

game.settings = {
    
};

//reserve some keyboard variables
let keyUP, keyDOWN, keyW, keyS, keySpace;
let mouseDown = false;

//need left mouse click