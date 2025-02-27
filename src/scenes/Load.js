class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        this.load.path = './assets/'
        /*this.load.spritesheet('hero', 'hero-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })*/

        // load character visuals
        this.load.image('ace', 'sprites/characters/ace_front.png')
        this.load.image('wedge', 'sprites/characters/wedge_front.png')
        this.load.image('lina', 'sprites/characters/lina_front.png')

        // load backgrounds
        this.load.image('indoor_bg', 'backgrounds/indoors_bg.png')
        this.load.image('outdoor_bg', 'backgrounds/outdoor_bg.png')
    }

    create() {
        // hero animations (walking)
        /*this.anims.create({
            key: 'walk-down',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
        })
        this.anims.create({
            key: 'walk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
        })
        this.anims.create({
            key: 'walk-up',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
        })
        this.anims.create({
            key: 'walk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
        })*/

        // proceed once loading completes
        this.scene.start('indoorsScene')
    }
}