class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, timePointsSeconds, thrustParticle, explosionParticle, moveSpeed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add to existing scene
        this.points = pointValue;
        this.timePoints = timePointsSeconds;
        this.moveSpeed = moveSpeed;

        this.explosionParticle = explosionParticle;
        this.thrustParticle = thrustParticle;

        this.play(texture);
    }

    update(deltaSeconds) {
        // move spaceship left
        this.x -= this.moveSpeed * deltaSeconds;

        // wrap from left to right edge
        if (this.x <= 0 - this.width) {
            this.reset();
        }

        if (this.visible) {
            this.thrustParticle.emitParticle(1, this.x + this.width * 0.65, this.y + this.height * 0.5);
        }
    }

    explode() {
        const centerX = this.x + this.width * 0.5;
        const centerY = this.y + this.height * 0.5;

        this.scene.scorePoints(centerX, centerY, this.points);
        this.scene.scoreClockSeconds(centerX, centerY + 30, this.timePoints);

        // temporarily hide ship
        this.setVisible(false);

        // create explosion particle effects at ship's position
        this.explosionParticle.emitParticle(10, centerX, centerY);
        this.scene.time.delayedCall(500, () => {
            this.reset();
            this.setVisible(true);
        });

        this.scene.sound.play('sfx-explosion');
    }

    reset() {
        this.x = gameWidth;
        this.play(this.anims.currentAnim.key, false); // reset anim
    }
}
