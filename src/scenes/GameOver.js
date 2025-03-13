class GameOver extends Phaser.Scene {
    constructor() {
        super("gameoverScene")
    }

    init() {
        // text variables
        this.FONT = 'monkey_font'
        this.TEXT_SIZE = 44
    }

    create() {
        // set background
        this.add.image(0, 0, 'gameover_bg').setOrigin(0, 0)

        // add return text
        this.enemyText = this.add.bitmapText(width/2, 500, this.FONT, ' [SPACE]\nTo Return', this.TEXT_SIZE).setOrigin(.5,.5)

        // play background music
        this.bgm = this.sound.add('ending_theme', {volume: bgmVolume})
        this.bgm.play()

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
    }

    update() {
        if (this.keys.space.isDown) {
            // reset global variables
            startFade = true
            interactOffset = 70
            cursors = null
            sandtrapDialogue = true
            indoorX = 400
            indoorY = 300
            outdoorX = 1090
            outdoorY = 200
            defeatedEnemy = false
            sfxVolume = .3
            bgmVolume = .15

            // return to title
            this.bgm.stop()
            this.scene.start('menuScene')
        }
    }
}