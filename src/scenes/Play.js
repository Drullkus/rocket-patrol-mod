class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    create() {
        // Background
        this.spaceBackground = this.scene.add('spaceBackgroundScene', SpaceBackground, false);
        this.scene.launch('spaceBackgroundScene');

        // UI
        this.scoreOverlay = this.scene.add('scoreOverlayScene', ScoreOverlay, false);
        this.scene.launch('scoreOverlayScene');

        const borderColor = 0xFF_FF_FF; // White
        // white borders
        this.add.rectangle(0, 0, gameWidth, borderUISize, borderColor).setOrigin(0, 0); // Top
        this.add.rectangle(0, gameHeight - borderUISize, gameWidth, borderUISize, borderColor).setOrigin(0, 0); // Bottom
        this.add.rectangle(0, 0, borderUISize, gameHeight, borderColor).setOrigin(0, 0); // Left
        this.add.rectangle(gameWidth - borderUISize, 0, borderUISize, gameHeight, borderColor).setOrigin(0, 0); // Right

        this.p1Rocket = new Rocket(this, gameWidth * 0.5, gameHeight - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ship01 = new Spaceship(this, gameWidth + borderUISize * 6, borderUISize * 4 + borderPadding * 0, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, gameWidth + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, gameWidth + borderUISize * 0, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.gameOver = false;

        this.clock = this.time.delayedCall(game.settings.gameTimer, this.setGameOver, null, this);
    }

    update(_time, deltaMillis) {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.remove('spaceBackgroundScene');
            this.scene.remove('scoreOverlayScene');
            this.scene.restart();
        }
        
        if (!this.gameOver) {
            const deltaSeconds = deltaMillis * 0.001;

            this.p1Rocket.update(deltaSeconds);
            this.ship01.update(deltaSeconds);
            this.ship02.update(deltaSeconds);
            this.ship03.update(deltaSeconds);
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        };
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        };
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        };
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        return rocket.x < ship.x + ship.width
            && rocket.x + rocket.width > ship.x
            && rocket.y < ship.y + ship.height
            && rocket.height + rocket.y > ship.y;
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        const boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        this.scoreOverlay.addScore(ship.points);

        this.sound.play('sfx-explosion');
    }

    setGameOver() {
        this.scoreOverlay.showGameOver();

        this.gameOver = true;
    }
}
