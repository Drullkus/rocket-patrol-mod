class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, particleEffect) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        // track rocket's firing status
        this.isFiring = false;
        // rocket speed in pixels/frame
        this.moveSpeed = game.settings.rocketSpeed;

        this.sfxShot = scene.sound.add('sfx-shot');

        this.particleEffect = particleEffect;

        this.angularSpeed = 1/256;
    }

    update(deltaSeconds) {
        // left/right movement
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed * deltaSeconds;
            } else if (keyRIGHT.isDown && this.x <= gameWidth - borderUISize - this.width) {
                this.x += this.moveSpeed * deltaSeconds;
            }
        } else {
            if (keyLEFT.isDown) {
                this.setRotation(this.rotation - this.angularSpeed);
            } else if (keyRIGHT.isDown) {
                this.setRotation(this.rotation + this.angularSpeed);
            }
        }

        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyFIRE) && !this.isFiring) {
            this.fire();
        }

        const yPosReset = borderUISize * 2 + borderPadding;
        // if fired, move up
        if (this.isFiring && this.y >= yPosReset) {
            const increment = this.moveSpeed * deltaSeconds;
            const movementDirection = new Phaser.Math.Vector2(0, -1);
            movementDirection.rotate(this.rotation);
            movementDirection.scale(increment);

            this.x += movementDirection.x;
            this.y += movementDirection.y;
        }
        // reset on miss
        if (this.y <= yPosReset) {
            this.explode();
        }
    }

    fire() {
        this.isFiring = true;
        this.sfxShot.play();
        this.scene.setShowFire(false);
        this.fireX = this.x;
    }

    explode() {
        const centerX = this.x + this.width * 0.5;
        const centerY = this.y + this.height * 0.5;

        this.particleEffect.emitParticle(4, centerX, centerY);

        this.isFiring = false;
        this.x = this.fireX;
        this.y = gameHeight - borderUISize - borderPadding;

        this.scene.setShowFire(true);

        this.setAngle(0);
    }
}
