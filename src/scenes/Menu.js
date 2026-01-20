class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('space_dust', './assets/space_dust.png');
        this.load.image('star_streaks', './assets/star_streaks.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });

        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav');
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav');
        this.load.audio('sfx-shot', './assets/sfx-shot.wav');

        // shader
        this.load.glsl('noise_revolver', 'assets/noise_revolver.glsl');
    }
    
    create() {
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        };
        // display menu text
        this.add.text(gameWidth * 0.5, gameHeight * 0.5 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(gameWidth * 0.5, gameHeight * 0.5, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(gameWidth * 0.5, gameHeight * 0.5 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            game.settings = {
                rocketSpeed: 125,
                spaceshipSpeed: 185,
                gameTimer: 60000
            };
            this.sound.play('sfx-select');
            this.scene.start('playScene');
        } else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.settings = {
                rocketSpeed: 125,
                spaceshipSpeed: 250,
                gameTimer: 45000
            };
            this.sound.play('sfx-select');
            this.scene.start('playScene');
        }
    }
}
