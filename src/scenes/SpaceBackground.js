// All tile sprite stuffs
class SpaceBackground extends Phaser.Scene {
    constructor() {
        super('spaceBackgroundScene');
        this.layers = [];
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