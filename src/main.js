/*

Modification Title: Rocket Terminal

EST. Time taken to modify: 16 hours (by far)

Turn-in Modifications implemented:

  1-Point Tier (5 items, 5 points total)

  - Create a new scrolling tile sprite for the background
    > Added space_dust.png
    > Added galaxy.png from menu

  - Track a high score that persists across scenes and display it in the UI
    > Persisted in browser localStorage to last across sessions
    > High scores in storage separated by game mode

  - Implement the 'FIRE' UI text from the original game
    > Added in GuiOverlay

  - Implement the speed increase that happens after 30 seconds in the original game
    > Play.js calls accelerateShips() after 30000 milliseconds of beginning

  - Allow the player to control the Rocket after it's fired
    > Player controls rocket rotation. Visually, seems slightly cursed lol


3-Point Tier (4 items, 12 points total)

  - Implement parallax scrolling for the background
    > 5 layers in SpaceBackground.js [ space dust, space dust, starfield, starfield, star streaks shader ]

  - Using a texture atlas, create a new animated sprite (three frames minimum) for the enemy spaceships

  - Display the time remaining (in seconds) on the screen
    > Added in GuiOverlay

  - Create a new title screen (e.g., new artwork, typography, layout)

    > Created galaxy.png for menu background
    > Added public-domain font "Xirod"
    > Hold left/right key to begin instead of only pressing


  5-Point Tier (3 items, 15 points total)

  - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship
    > 4 columns of 4 frames, each particle instance picks a random column
    > Two variants for spaceships and rocket

  - Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
    > bonus_spaceship.png, flies 25% faster, awards 60 points on hit

  - Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses
    > Spaceships award 1 second
    > Bonus spaceship awards 5 seconds, enough to keep the game going if player locks in
    > Rocket misses deduct 1 second
    > Award shown as text floating from explosion

Citations inlined as comments near relevant code
*/

'use strict';

const urlQueryParams = new URLSearchParams(window.location.search);

const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  useTicker: true,
  scene: [ new Menu(urlQueryParams.get('mode')), Play ],
  parent: 'rocket-terminal',
  pixelArt: true
};

const game = new Phaser.Game(config);

const { height: gameHeight, width: gameWidth } = game.config;

const borderUISize = gameWidth / 15;
const borderPadding = gameHeight / 45;

var keyFIRE, keyRESET, keyLEFT, keyRIGHT;

function getHighScore() {
  const defaultHighScore = 100;
  return localStorage.getItem(getHighScoreName()) ?? defaultHighScore;
}

function saveHighScore(score) {
  localStorage.setItem(getHighScoreName(), score);
}

function getHighScoreName() {
  return `${game.settings.gameMode}HighScore`;
}

function removeArrayElement(list, element) {
  // Remove element from array: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
  const index = list.indexOf(element);
  if (index >= 0) {
    list.splice(index, 1);
  }
}

function huetoHexCode(h) {
  const colorHex = `${huetoRGBInteger(h).toString(16)}`.padStart(6, '0');
  return `#${colorHex}`;
}

// Yoinked and simplified from https://stackoverflow.com/a/17243070
function huetoRGBInteger(h) {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const q = 1 - f;

  var red, green, blue;
  switch (i % 6) {
    case 0: red = 1, green = f, blue = 0; break;
    case 1: red = q, green = 1, blue = 0; break;
    case 2: red = 0, green = 1, blue = f; break;
    case 3: red = 0, green = q, blue = 1; break;
    case 4: red = f, green = 0, blue = 1; break;
    case 5: red = 1, green = 0, blue = q; break;
  }

  return (Math.round(red * 255) << 16) | (Math.round(green * 255) << 8) | (Math.round(blue * 255));
}
