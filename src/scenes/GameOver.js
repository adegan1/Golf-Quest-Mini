class GameOver extends Phaser.Scene {
    constructor() {
        super("gameoverScene")
    }

    init() {
        // text variables
        this.FONT = 'monkey_font'
        this.TEXT_SIZE = 44

        // credits flags
        this.creditsShowing = false
        this.creditsMoving = false
    }

    create() {
        // set background
        this.add.image(0, 0, 'gameover_bg').setOrigin(0, 0)
        this.cameras.main.fadeIn(500)

        // add return text
        this.returnText = this.add.bitmapText(width*.315, 525, this.FONT, '[SPACE]\nReturn', this.TEXT_SIZE).setOrigin(.5,.5)
        this.showCreditsText = this.add.bitmapText(width*.685, 525, this.FONT, '[SHIFT]\nCredits', this.TEXT_SIZE).setOrigin(.5,.5)

        // play background music
        this.bgm = this.sound.add('ending_theme', {volume: bgmVolume})
        this.bgm.play()

        // add credits
        this.credits = this.add.sprite(width/2, height-1000, 'battle_menu').setDepth(1).setScale(1.4)
        this.creditsText = this.add.bitmapText(width*.5, height-1000, this.FONT,
            '    -Credits-\nOriginal Concept: Joe Johnston\nArt: Steven Universe Team\nAnimation: Andrew Degan\nProgramming: Andrew Degan\nMusic: Aivi & Surasshu\nSFX: Steven Universe Team\nGame Design: Andrew Degan',
            32).setDepth(1).setOrigin(.5,.5)

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
    }

    update() {
        // return to title
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

        // add credits tweens
        this.creditsShow = this.tweens.add({
            paused: true,
            targets: [this.credits, this.creditsText],
            y: {from: height-1000, to: height*.4},
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.creditsShowing = true
                this.creditsMoving = false
            }
        })
        this.creditsHide = this.tweens.add({
            paused: true,
            targets: [this.credits, this.creditsText],
            y: {from: height*.4, to: height-1000},
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.creditsShowing = false
                this.creditsMoving = false
            }
        })

        // toggle credits
        if (this.keys.shift.isDown && !this.creditsMoving) {
            if (this.creditsShowing){
                this.creditsHide.play()
            } else {
                this.creditsShow.play()
            }

            this.creditsMoving = true
        }
    }
}