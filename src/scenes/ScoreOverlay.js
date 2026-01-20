class ScoreOverlay extends Phaser.Scene {
    constructor() {
        super('scoreOverlayScene');

        this.p1Score = 0;
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
}