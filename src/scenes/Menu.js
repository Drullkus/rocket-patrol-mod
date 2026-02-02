class Menu extends Phaser.Scene {
    constructor(queryMode) {
        super("menuScene");

        // Dev feature to instantly enter a game mode by url parameter
        if (queryMode === 'novice') {
            this.postCreate = this.startNovice;
        } else if (queryMode === 'expert') {
            this.postCreate = this.startExpert;
        } else {
            this.postCreate = () => {}; // Allow scene to enter update loop
        }

    }

    preload() {
        // load font
        this.load.font('xirod', './assets/xirod.otf', 'opentype'); // Obtained from https://www.1001fonts.com/xirod-font.html

        // load images/tile sprites
        this.load.image('galaxy', './assets/galaxy.png');
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('space_dust', './assets/space_dust.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('star_streaks', './assets/star_streaks.png');

        this.load.spritesheet('bonus_spaceship', './assets/bonus_spaceship.png', { frameWidth: 32, frameHeight: 16 });
        this.load.spritesheet('spaceship', './assets/spaceship.png', { frameWidth: 64, frameHeight: 32 });

        const explosionAnimationConfig = { frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 15 };
        this.load.spritesheet('explosion', './assets/explosion.png', explosionAnimationConfig);
        this.load.spritesheet('explosion-green', './assets/explosion-green.png', explosionAnimationConfig);

        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav');
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav');
        this.load.audio('sfx-shot', './assets/sfx-shot.wav');

        // shader
        this.load.glsl('noise_revolver', 'assets/noise_revolver.fsh');
    }
    
    create() {
        this.createAnimations();

        this.mode = 0.5;
        this.modeSpeed = 0.015; // Higher values = less time to hold to enter one of the game modes

        this.createMenuBackground();
        this.createMenuUi();

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.postCreate();
    }

    createAnimations() {
        ['', '-green'].forEach(suffix =>
            // 4 columns of animation sequences
            [0, 1, 2, 3].forEach((columnIndex, _index, list) => this.anims.create({
                key: `explode-${columnIndex}${suffix}`,
                frames: this.anims.generateFrameNumbers(`explosion${suffix}`, {
                    frames: [1, 0, 1, 2, 3].map(rowIndex => rowIndex * list.length + columnIndex)
                }),
                frameRate: 15
            }))
        );

        ['', 'bonus_'].forEach(prefix => this.anims.create({
            key: `${prefix}spaceship`,
            frames: this.anims.generateFrameNumbers(`${prefix}spaceship`, { start: 0, end: 2 }),
            repeat: -1,
            frameRate: 10
        }));
    }

    createMenuBackground() {
        this.galaxy = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'galaxy').setOrigin(0).setAlpha(0.75);
        this.galaxy.tilePositionX = 200;
        this.galaxy.flipX = true;

        this.stars = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'starfield').setOrigin(0);
        this.stars.scale = 1.5;
        this.stars.setBlendMode('SCREEN');

        this.distantStars = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'starfield').setOrigin(0);
        this.distantStars.tilePositionY += gameHeight * 0.5;
        this.distantStars.setTint(0x88_AA_CC);
        this.distantStars.setBlendMode('SCREEN');
    }

    createMenuUi() {
        this.expertBar = this.add.rectangle(0, gameHeight, gameWidth, gameHeight * 0.05, 0x00FF00).setOrigin(0, 1);
        this.noviceBar = this.add.rectangle(gameWidth, gameHeight, gameWidth, gameHeight * 0.05, 0xF3B141).setOrigin(1, 1);

        const menuConfig = {
            fontFamily: 'xirod',
            fontSize: '26px',
            color: '#FFF'
        };

        // title
        this.add.text(gameWidth * 0.5, gameHeight * 0.5 - borderUISize - borderPadding * 4, 'ROCKET TERMINAL', {
            ...menuConfig,
            fontSize: '50px',
        }).setOrigin(0.5);

        // instructions
        this.add.text(gameWidth * 0.5, gameHeight * 0.5, 'Use ←→ arrows to move', menuConfig).setOrigin(0.5, 1);
        this.add.text(gameWidth * 0.5, gameHeight * 0.5, 'and (F) to fire', menuConfig).setOrigin(0.5, 0);

        // difficulty selector
        this.add.text(gameWidth * 0.5, gameHeight * 0.9, 'Hold arrow to select difficulty:', menuConfig).setOrigin(0.5, 0);

        this.add.text(gameWidth * 0.1, gameHeight * 0.975, '← Novice', {
            ...menuConfig,
            color: '#0F0'
        }).setOrigin(0, 0.5);

        this.add.text(gameWidth * 0.9, gameHeight * 0.975, 'Expert →', {
            ...menuConfig,
            color: '#F3B141'
        }).setOrigin(1, 0.5);
    }

    update() {
        if (keyLEFT.isDown) {
            this.mode = Math.max(this.mode - this.modeSpeed, 0);
        } else if (keyRIGHT.isDown) {
            this.mode = Math.min(this.mode + this.modeSpeed, 1);
        } else {
            this.mode = Phaser.Math.Linear(this.mode, 0.5, 0.1);
        }

        this.galaxy.tilePositionX = (1 - this.mode) * 400;
        this.distantStars.tilePositionX = this.mode * 425;
        this.stars.tilePositionX = this.mode * 350;

        const noviceLerp = Math.max(0, 1 - (2 * (this.mode)));
        const expertLerp = Math.max(0, 1 - (2 * (1 - this.mode)));
        this.noviceBar.scaleX = noviceLerp;
        this.expertBar.scaleX = expertLerp;

        if (this.mode === 0) {
            this.sound.play('sfx-select');
            this.startNovice();
        } else if (this.mode === 1) {
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
