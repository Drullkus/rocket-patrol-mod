class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    create() {
        const gameWidth = game.config.width;
        const gameHeight = game.config.height;

        const borderUISize = gameHeight / 15;
        const borderPadding = gameHeight / 45;

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, gameWidth, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        const borderColor = 0xFF_FF_FF; // White
        // white borders
        this.add.rectangle(0, 0, gameWidth, borderUISize, borderColor).setOrigin(0, 0); // Top
        this.add.rectangle(0, gameHeight - borderUISize, gameWidth, borderUISize, borderColor).setOrigin(0, 0); // Bottom
        this.add.rectangle(0, 0, borderUISize, gameHeight, borderColor).setOrigin(0, 0); // Left
        this.add.rectangle(gameWidth - borderUISize, 0, borderUISize, gameHeight, borderColor).setOrigin(0, 0); // Right

        this.p1Rocket = new Rocket(this, gameWidth/2, gameHeight - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ship01 = new Spaceship(this, gameWidth + borderUISize * 6, borderUISize * 4 + borderPadding * 0, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, gameWidth + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, gameWidth + borderUISize * 0, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.starfield.tilePositionX -= 4;
        this.p1Rocket.update();
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            console.log("kaboom ship 01");
        };

        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            console.log("kaboom ship 02");
        };

        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            console.log("kaboom ship 03");
        };
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        return rocket.x < ship.x + ship.width
            && rocket.x + rocket.width > ship.x
            && rocket.y < ship.y + ship.height
            && rocket.height + rocket.y > ship.y;
    }
}
