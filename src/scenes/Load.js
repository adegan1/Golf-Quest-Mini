class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        this.load.path = './assets/'

        // load character visuals
        this.load.image('sandtraps', 'sprites/characters/sandtrap_front.png')
        this.load.spritesheet('ace', 'sprites/characters/ace_spritesheet.png', {
            frameWidth: 54,
            frameHeight: 66,
        })
        this.load.image('wedge', 'sprites/characters/wedge_front.png')
        this.load.image('lina', 'sprites/characters/lina_front.png')

        // load JSON (dialogue text)
        this.load.json('dialogue', 'json/dialogue.json')

        // load bitmap font
        this.load.bitmapFont('monkey_font', 'fonts/monkey.png', 'fonts/monkey.xml')

        // load dialogue assets
        this.load.image('dialogue_box', 'sprites/dialogue_box.png')
        this.load.image('sandtraps_portrait', 'sprites/sandtraps_portrait.png')
        this.load.image('ace_portrait', 'sprites/ace_portrait.png')

        // load backgrounds
        this.load.image('indoor_bg', 'backgrounds/indoors_bg.png')
        this.load.image('indoor_layers', 'backgrounds/indoors_layers.png')
        this.load.image('outdoor_bg', 'backgrounds/outdoor_bg.png')

        // load other sprites
        this.load.image('interact', 'sprites/interact.png')

        // load music
        this.load.audio('indoor_theme', 'music/indoor_theme.wav')
        this.load.audio('outdoor_theme', 'music/outdoor_theme.wav')
    }

    create() {
        // hero animations (walking)
        this.anims.create({
            key: 'walk-down',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [2, 3, 4, 3, 2, 1, 0, 1] }),
        })
        this.anims.create({
            key: 'walk-left',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [7, 8, 9, 8, 7, 6, 5, 6] }),
        })
        this.anims.create({
            key: 'walk-right',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [12, 13, 14, 13, 12, 11, 10, 11] }),
        })
        this.anims.create({
            key: 'walk-up',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [17, 18, 19, 18, 17, 16, 15, 16] }),
        })

        // create input
        cursors = this.input.keyboard.createCursorKeys()

        // proceed once loading completes
        this.scene.start('indoorsScene')
        //this.scene.start('overworldScene')
    }
}