class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, particleEffect) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add to existing scene
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;

        this.particleEffect = particleEffect;

        this.play('spaceship');
    }

    update(deltaSeconds) {
        // move spaceship left
        this.x -= this.moveSpeed * deltaSeconds;

        // wrap from left to right edge
        if (this.x <= 0 - this.width) {
            this.reset();
        }

    }

    explode() {
        const centerX = this.x + this.width * 0.5;
        const centerY = this.y + this.height * 0.5;

        this.scene.scoreOverlay.awardPoints(centerX, centerY, this.points);

        // temporarily hide ship
        this.alpha = 0;

        // create explosion particle effects at ship's position
        this.particleEffect.emitParticle(10, centerX, centerY);
        this.scene.time.delayedCall(500, () => {
            this.reset();
            this.alpha = 1;
        });

        this.scene.sound.play('sfx-explosion');
    }

    reset() {
        this.x = gameWidth;
        this.play('spaceship', false); // reset anim
    }
}
