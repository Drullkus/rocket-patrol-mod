/*

Modification Title:

Time taken to modify: 8 hours (by far)

Modifications implemented:
  1-Point Tier
  - Create a new scrolling tile sprite for the background
  3-Point Tier
  - Implement parallax scrolling for the background
  5-Point Tier
  - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship

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
