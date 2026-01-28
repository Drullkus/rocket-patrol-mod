class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    create() {
        // Background
        this.spaceBackground = this.scene.add('spaceBackgroundScene', SpaceBackground, false);
        this.scene.launch('spaceBackgroundScene');

        // UI
        this.scoreOverlay = this.scene.add('guiOverlayScene', GuiOverlay, false);
        this.scene.launch('guiOverlayScene');

        // Green explosion for ships
        this.explosionGreen = this.add.particles(0, 0, `explosion-green`, {
            anim: [0, 1, 2, 3].map(index => `explode-${index}-green`),
            lifespan: { min: 150, max: 500 },
            speed: { min: 50, max: 125 },
            scale: 4,
            rotate: { start: 0, end: 90 },
            emitting: false
        });

        // Smaller explosion for rocket
        this.explosion = this.add.particles(0, 0, `explosion`, {
            anim: [0, 1, 2, 3].map(index => `explode-${index}`),
            lifespan: { min: 150, max: 300 }, // Expires slightly sooner
            speed: { min: 10, max: 50 }, // Less spread
            scale: 2,
            rotate: { start: 0, end: 45 },
            emitting: false
        });

        // Entities
        this.p1Rocket = new Rocket(this, gameWidth * 0.5, gameHeight - borderUISize - borderPadding, 'rocket', null, this.explosion).setOrigin(0.5, 0);

        this.ship01 = new Spaceship(this, gameWidth + borderUISize * 6, borderUISize * 4 + borderPadding * 0, 'spaceship', 0, 30, this.explosionGreen).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, gameWidth + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20, this.explosionGreen).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, gameWidth + borderUISize * 0, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10, this.explosionGreen).setOrigin(0, 0);

        { // Stays in here instead of GuiOverlay so that Space can draw over the borders and spaceships under borders
            // Border numbers
            const borderColor = 0xAF_4F_00;
            const topYEdge = borderUISize * 2; // Make top border twice as thick to fit GUI numbers
            const bottomYEdge = gameHeight - topYEdge - borderUISize;

            // Borders
            this.add.rectangle(0, 0, gameWidth, topYEdge, borderColor).setOrigin(0, 0); // Top
            this.add.rectangle(0, gameHeight - borderUISize, gameWidth, borderUISize, borderColor).setOrigin(0, 0); // Bottom
            this.add.rectangle(0, topYEdge, borderUISize, bottomYEdge, borderColor).setOrigin(0, 0); // Left
            this.add.rectangle(gameWidth - borderUISize, topYEdge, borderUISize, bottomYEdge, borderColor).setOrigin(0, 0); // Right
        }

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
            this.scene.remove('guiOverlayScene');
            this.scene.restart();
        }

        const deltaSeconds = deltaMillis * 0.001;
        
        if (!this.gameOver) {
            this.p1Rocket.update(deltaSeconds);
            this.ship01.update(deltaSeconds);
            this.ship02.update(deltaSeconds);
            this.ship03.update(deltaSeconds);
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.explode();
            this.ship01.explode();
        };
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.explode();
            this.ship02.explode();
        };
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.explode();
            this.ship03.explode();
        };
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        return rocket.x < ship.x + ship.width
            && rocket.x + rocket.width > ship.x
            && rocket.y < ship.y + ship.height
            && rocket.height + rocket.y > ship.y;
    }

    setGameOver() {
        this.scoreOverlay.setGameOver();

        this.gameOver = true;
    }
}
