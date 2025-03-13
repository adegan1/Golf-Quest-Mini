class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    init() {
        // text variables
        this.FONT = 'monkey_font'
        this.TEXT_SIZE = 28
    }

    preload() {
        this.load.path = './assets/'

        // load bitmap font
        this.load.bitmapFont('monkey_font', 'fonts/monkey.png', 'fonts/monkey.xml')

        // load images
        this.load.image('title_bg', 'backgrounds/title_image.png')
        this.load.image('press_start', 'sprites/press_start.png')

        // load sfx
        this.load.audio('title_theme', 'music/title_theme.wav')
        this.load.audio('title_blip', 'sfx/titleBlip.wav')
    }

    create() {
        // set background
        this.add.image(0, 0, 'title_bg').setOrigin(0, 0)

        // add press start button
        this.startButton = this.add.sprite(385, 450, 'press_start').setScale(1.25)
        let startBlink = this.tweens.add({
            targets: this.startButton,
            alpha: {from: 0, to: 1},
            duration: 170,
            yoyo: true,
            hold: 150,
            repeat: -1,
        })

        // add class information
        this.classInfo = this.add.bitmapText(10, height, this.FONT, 'UCSC Winter 2025 - CMPM 120', this.TEXT_SIZE).setOrigin(0,1)

        // add sound effects
        this.titleBlip = this.sound.add('title_blip', { volume: sfxVolume })

        // play background music
        this.bgm = this.sound.add('title_theme', {volume: bgmVolume})
        this.bgm.loop = true
        this.bgm.play()
    }

    update() {
        // check for any keyboard input
        this.input.keyboard.on('keydown', this.startGame)
    }

    startGame() {
        this.scene.bgm.stop()
        this.scene.scene.start('loadScene')
    }
}