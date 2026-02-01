// All tile sprite stuffs
class SpaceBackground extends Phaser.Scene {
    constructor() {
        super('spaceBackgroundScene');
        this.imageLayers = [];
    }

    create() {
        this.scrolling = true;

        // Inspired by Factorio https://factorio.com/blog/post/fff-411
        const galaxy = this.addLayer('galaxy', 5);
        galaxy.tilePositionX += 400;
        galaxy.setAlpha(0.333);

        this.addLayer('space_dust', 100).setAlpha(0.333);

        const spaceClouds = this.addLayer('space_dust', 20);
        spaceClouds.tilePositionY += gameHeight * 0.5;
        spaceClouds.scale = 4;
        spaceClouds.setTint(0xFF_EE_DD);
        spaceClouds.setAlpha(0.333);

        this.addLayer('starfield', 20).scale = 1.5;

        const distantStars = this.addLayer('starfield', 10);
        distantStars.tilePositionY += gameHeight * 0.5;
        distantStars.setTint(0x88_AA_CC);

        this.add.shader('noise_revolver', 0, 0, gameWidth, gameHeight, [ 'star_streaks' ]).setOrigin(0, 0).setBlendMode(Phaser.BlendModes.NORMAL);
    }

    addLayer(imageName, pixelsPerSecond) {
        // blending modes: https://docs.phaser.io/phaser/blend-mode
        const layer = this.add.tileSprite(0, 0, gameWidth, gameHeight, imageName).setOrigin(0, 0).setBlendMode(Phaser.BlendModes.SCREEN);
        this.imageLayers.push({pixelsPerSecond, layer});
        return layer; // For any additional configuration
    }

    update(_time, deltaMillis) {
        if (!this.scrolling) {
            return;
        }

        const deltaSeconds = deltaMillis * 0.001;

        this.imageLayers.forEach(({pixelsPerSecond, layer}) => {
            layer.tilePositionX -= pixelsPerSecond * deltaSeconds;
        })
    }
}
