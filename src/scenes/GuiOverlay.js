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
        this.p1Score = 0;
        this.highScore = localStorage.getItem('highScore') ?? 0;

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

        this.p1ScoreObj = this.add.text(borderUISize + borderPadding, borderUISize, this.p1Score, scoreConfig).setOrigin(0, 0.5);
        this.highScoreObj = this.add.text(gameWidth - borderUISize - borderPadding, borderUISize, this.highScore, scoreConfig).setOrigin(1, 0.5);
    }

    update(_time, deltaMillis) {
        const deltaSeconds = deltaMillis * 0.001;

        this.pointsFloatingText.forEach(text => {
            text.y -= deltaSeconds * 50;
        });
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

        if (this.p1Score > this.highScore) {
            this.add.text(gameWidth * 0.5, gameHeight * 0.5 - 64, 'NEW HIGHSCORE', textConfig).setOrigin(0.5);
            
            this.setHighScore(this.p1Score);
        }
    }

    addScore(points) {
        this.p1Score += points;
        this.p1ScoreObj.text = this.p1Score;
    }

    setHighScore(score) {
        this.highScore = score;
        this.highScoreObj.text = this.highScore;

        localStorage.setItem('highScore', this.highScore);
    }

    awardPoints(centerX, centerY, points) {
        this.addScore(points);

        // text floating upwards
        const text = this.add.text(centerX, centerY - 10, `+${points}`, this.pointsTextConfig);
        this.pointsFloatingText.push(text);
        this.time.delayedCall(250, () => removeArrayElement(this.pointsFloatingText, text));
        this.time.delayedCall(750, () => text.destroy());
    }
}

function removeArrayElement(list, element) {
    // Remove element from array: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
    const index = list.indexOf(element);
    if (index >= 0) {
        list.splice(index, 1);
    }
}
