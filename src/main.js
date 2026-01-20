/*

Modification Title:

Time taken to modify: 2 hours (by far)

Modifications implemented:
  3-Point Tier
  - Implement parallax scrolling for the background

Citations inlined as comments near relevant code
*/

"use strict";

console.log("hello internet");

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    useTicker: true,
    scene: [ Menu, Play ]
};

const game = new Phaser.Game(config);

const gameWidth = game.config.width;
const gameHeight = game.config.height;

const borderUISize = game.config.width / 15;
const borderPadding = game.config.height / 45;

var keyFIRE, keyRESET, keyLEFT, keyRIGHT;
