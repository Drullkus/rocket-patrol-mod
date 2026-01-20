class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        // track rocket's firing status
        this.isFiring = false;
        // rocket speed in pixels/frame
        this.moveSpeed = 2;

        this.sfxShot = scene.sound.add('sfx-shot');
    }

    update() {
        // left/right movement
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= gameWidth - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }

        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyFIRE) && !this.isFiring) {
            this.isFiring = true;
            this.sfxShot.play();
        }

        const yPosReset = borderUISize * 3 + borderPadding;
        // if fired, move up
        if (this.isFiring && this.y >= yPosReset) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if (this.y <= yPosReset) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = gameHeight - borderUISize - borderPadding;
    }
}
