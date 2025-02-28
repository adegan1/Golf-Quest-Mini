class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        this.load.path = './assets/'

        // load character visuals
        this.load.spritesheet('ace', 'sprites/characters/ace_spritesheet.png', {
            frameWidth: 54,
            frameHeight: 66,
        })
        this.load.image('wedge', 'sprites/characters/wedge_front.png')
        this.load.image('lina', 'sprites/characters/lina_front.png')

        // load backgrounds
        this.load.image('indoor_bg', 'backgrounds/indoors_bg.png')
        this.load.image('indoor_layers', 'backgrounds/indoors_layers.png')
        this.load.image('outdoor_bg', 'backgrounds/outdoor_bg.png')

        // load other sprites
        this.load.image('interact', 'sprites/interact.png')
    }

    create() {
        // hero animations (walking)
        this.anims.create({
            key: 'walk-down',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 0 }),
        })
        this.anims.create({
            key: 'walk-left',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 1, end: 1 }),
        })
        this.anims.create({
            key: 'walk-right',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 2, end: 2 }),
        })
        /*this.anims.create({
            key: 'walk-up',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
        })*/

        // proceed once loading completes
        this.scene.start('overworldScene')
    }
}