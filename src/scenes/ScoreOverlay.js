class ScoreOverlay extends Phaser.Scene {
    constructor() {
        super('scoreOverlayScene');

        this.p1Score = 0;

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

    addScore(scored) {
        this.p1Score += scored;
        this.playerScore.text = this.p1Score;
    }

    create() {
        this.add.rectangle(0, borderUISize + borderPadding, gameWidth, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        const scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        };

        this.playerScore = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
    }

    update(_time, deltaMillis) {
        const deltaSeconds = deltaMillis * 0.001;

        this.pointsFloatingText.forEach(text => {
            text.y -= deltaSeconds * 50;
        });
    }

    showGameOver() {
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
