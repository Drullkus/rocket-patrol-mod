class Menu extends Phaser.Scene {
    constructor(queryMode) {
        super("menuScene");

        if (queryMode == 'novice') {
            this.postCreate = this.startNovice;
        } else if (queryMode == 'expert') {
            this.postCreate = this.startExpert;
        } else {
            this.postCreate = () => {};
        }

    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('space_dust', './assets/space_dust.png');
        this.load.image('star_streaks', './assets/star_streaks.png');
        this.load.spritesheet('explosion-pfx', './assets/explosion-pfx.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 15
        });

        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav');
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav');
        this.load.audio('sfx-shot', './assets/sfx-shot.wav');

        // shader
        this.load.glsl('noise_revolver', 'assets/noise_revolver.fsh');
    }
    
    create() {
        [0, 1, 2, 3].forEach(columnIndex => this.anims.create({
            key: `explode-${columnIndex}`,
            frames: this.anims.generateFrameNumbers(`explosion-pfx`, {
                frames: [4, 0, 4, 8, 12].map(rowIndex => rowIndex + columnIndex)
            }),
            frameRate: 15
        }));

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

        this.postCreate();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx-select');
            this.startNovice();
        } else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.sound.play('sfx-select');
            this.startExpert();
        }
    }

    startNovice() {
        game.settings = {
            gameMode: 'novice',
            rocketSpeed: 125,
            spaceshipSpeed: 185,
            gameTimer: 60000
        };

        this.scene.start('playScene');
    }

    startExpert() {
        game.settings = {
            gameMode: 'expert',
            rocketSpeed: 125,
            spaceshipSpeed: 250,
            gameTimer: 45000
        };

        this.scene.start('playScene');
    }
}
