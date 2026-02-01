class GuiOverlay extends Phaser.Scene {
    constructor() {
        super('guiOverlayScene');

        this.pointsTextConfig = {
            fontFamily: 'Courier',
            fontSize: '24px',
            color: '#F3B141',
            align: 'center'
        };
        // There appear to be no information online about making text-based particles;
        // they shall be objects and animated in this array!
        this.pointsFloatingText = [];
    }

    create() {
        const scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00FF00',
            color: '#008800',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        };

        this.p1Score = 0;
        this.p1ScoreObj = this.add.text(borderUISize + borderPadding, borderUISize, this.p1Score, scoreConfig).setOrigin(0, 0.5);

        this.highScoreObj = this.add.text(gameWidth - borderUISize - borderPadding, borderUISize, getHighScore(), scoreConfig).setOrigin(1, 0.5);

        this.fireObj = this.add.text(gameWidth * 0.5, gameHeight - borderPadding * 0.5, "(F)IRE", {
            ...scoreConfig,
            align: 'center',
            fixedWidth: 150
        }).setOrigin(0.5, 1);
    }

    update(time, deltaMillis) {
        const deltaSeconds = deltaMillis * 0.001;

        this.pointsFloatingText.forEach(text => text.y -= deltaSeconds * 50 );

        if (this.highScoreText) {
            const colorHex = huetoHexCode(time * 0.00067);
            this.highScoreText.setColor(colorHex);
            this.highScoreObj.setBackgroundColor(colorHex);
        }
    }

    setGameOver() {
        const textConfig = {
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

        this.add.text(gameWidth * 0.5, gameHeight * 0.5, 'GAME OVER', textConfig).setOrigin(0.5);
        this.add.text(gameWidth * 0.5, gameHeight * 0.5 + 64, 'Press (R) to Restart', textConfig).setOrigin(0.5);

        if (this.p1Score > getHighScore()) {
            const highScoreConfig = {
                fontFamily: 'Courier',
                fontSize: '80px',
                color: '#FFF',
                align: 'center'
            };
            this.highScoreText = this.add.text(gameWidth * 0.5, gameHeight * 0.5 - 64, 'NEW HIGH SCORE', highScoreConfig);
            this.highScoreText.setOrigin(0.5);
            this.highScoreText.setStroke('#000', 16);
            
            saveHighScore(this.p1Score);
            this.highScoreObj.text = this.p1Score;
            this.highScoreObj.setStroke('#000', 5);
            this.highScoreObj.setColor('#FFF');
        }
    }

    addScore(points) {
        this.p1Score += points;
        this.p1ScoreObj.text = this.p1Score;
    }

    awardPoints(centerX, centerY, points) {
        this.addScore(points);

        // text floating upwards
        const text = this.add.text(centerX, centerY, `+${points}`, this.pointsTextConfig).setOrigin(0.5);
        this.pointsFloatingText.push(text);
        this.time.delayedCall(350, () => removeArrayElement(this.pointsFloatingText, text));
        this.time.delayedCall(750, () => text.destroy());
    }

    setShowFire(show) {
        this.fireObj.setVisible(show);
    }
}
