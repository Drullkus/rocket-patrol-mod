/*

Modification Title: Rocket Terminal

Time taken to modify: 10 hours (by far)

Turn-in Modifications implemented:
  1-Point Tier
  - Create a new scrolling tile sprite for the background
    > Added space_dust.png
  - Track a high score that persists across scenes and display it in the UI
    > Persisted in browser localStorage to last across sessions
  3-Point Tier
  - Implement parallax scrolling for the background
    > 5 layers in SpaceBackground.js [ space dust, space dust, starfield, starfield, star streaks shader ]
  5-Point Tier
  - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship
    > 4 columns of 4 frames, each particle instance picks a random column

TODO
  1-Point Tier
  - Implement the 'FIRE' UI text from the original game
  - Implement the speed increase that happens after 30 seconds in the original game
  - Allow the player to control the Rocket after it's fired
  3-Point Tier
  - Display the time remaining (in seconds) on the screen
  - Using a texture atlas, create a new animated sprite (three frames minimum) for the enemy spaceships
  - Create a new title screen (e.g., new artwork, typography, layout)
  5-Point Tier
  - Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
  - Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses

Citations inlined as comments near relevant code
*/

'use strict';

console.log('hello internet');

const urlQueryParams = new URLSearchParams(window.location.search);

const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  useTicker: true,
  scene: [ new Menu(urlQueryParams.get('mode')), Play ],
  parent: 'rocket-patrol',
  pixelArt: true
};

const game = new Phaser.Game(config);

const { height: gameHeight, width: gameWidth } = game.config;

const borderUISize = gameWidth / 15;
const borderPadding = gameHeight / 45;

var keyFIRE, keyRESET, keyLEFT, keyRIGHT;
