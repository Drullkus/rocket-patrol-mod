"use strict";

console.log("hello internet");

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
};

const game = new Phaser.Game(config);

var keyFIRE, keyRESET, keyLEFT, keyRIGHT;
