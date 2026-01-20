// All tile sprite stuffs
class SpaceBackground extends Phaser.Scene {
    constructor() {
        super('spaceBackgroundScene');
        this.layers = [];
    }

    configureLayers() {
        // Inspired by Factorio https://factorio.com/blog/post/fff-411
        this.addLayer('space_dust', 250);

        const spaceClouds = this.addLayer('space_dust', 250 * 0.2);
        spaceClouds.tilePositionY += gameHeight * 0.5;
        spaceClouds.scale = 4;
        spaceClouds.setTint(0xFF_EE_DD);

        this.addLayer('starfield', 250 * 0.333).scale = 1.5;

        const distantStars = this.addLayer('starfield', 250 * 0.125);
        distantStars.tilePositionY += gameHeight * 0.5;
        distantStars.setTint(0x88_AA_CC);
    }

    addLayer(imageName, pixelsPerSecond) {
        // blending modes: https://docs.phaser.io/phaser/blend-mode
        const layer = this.add.tileSprite(0, 0, gameWidth, gameHeight, imageName).setOrigin(0, 0).setBlendMode(Phaser.BlendModes.SCREEN);
        this.layers.push({pixelsPerSecond, layer});
        return layer; // For any additional configuration
    }

    update(_time, deltaMillis) {
        const deltaSeconds = deltaMillis / 1000;

        this.layers.forEach(({pixelsPerSecond, layer}) => {
            layer.tilePositionX -= pixelsPerSecond * deltaSeconds;
        })
    }
}