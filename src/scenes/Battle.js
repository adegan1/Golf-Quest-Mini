class Battle extends Phaser.Scene {
    constructor() {
        super("battleScene")
    }

    init() {
        // selector locations
        this.selector1 = 420
        this.selector2 = 460
        this.selector3 = 500

        // text variables
        this.FONT = 'monkey_font'
        this.TEXT_SIZE = 44

        // menu variables
        this.menuCooldown = 60
        this.menuTimer = 0

        this.showIntro = false
        this.showMenu = false
        this.showHealth = false
    }

    create() {
        // add background image
        this.map = this.add.image(0, 0, 'battle_bg').setOrigin(0,0)

        // add character sprites
        this.windmill = this.add.sprite(1000, 2, 'battle_windmill').setOrigin(0,0).setScale(.75)

        this.hero = this.add.sprite(-200, 280, 'ace_battle').setOrigin(0,0).setScale(.65).setDepth(2)
        this.hero.anims.play('battle-idle')

        this.hitBall = this.add.sprite(650, 475, 'hit_ball').setOrigin(0,0).setScale(.5).setVisible(false).setAngle(20).setDepth(1)

        // add menus
        this.introBox = this.add.sprite(450, 50, 'enter_fight_box').setOrigin(0,0).setScale(.8).setVisible(true).setDepth(5)

        this.battleMenu = new BattleMenu(this, 50, 375, 'battle_menu').setOrigin(0,0).setScale(.75).setVisible(false).setDepth(5)
        this.selector = this.add.sprite(110, this.selector1, 'selector').setOrigin(0,0).setScale(.75).setVisible(false).setDepth(6)
        this.option1 = this.add.bitmapText(160, this.selector1, this.FONT, '', this.TEXT_SIZE+8).setVisible(true).setDepth(10)
        this.option2 = this.add.bitmapText(160, this.selector2, this.FONT, '', this.TEXT_SIZE+8).setVisible(true).setDepth(10)
        this.option3 = this.add.bitmapText(160, this.selector3, this.FONT, '', this.TEXT_SIZE+8).setVisible(true).setDepth(10)

        this.enemyText = this.add.bitmapText(490, 40, this.FONT, 'WINDMILL   LV3', this.TEXT_SIZE).setVisible(false)
        this.healthBarBack = this.add.sprite(610, 95, 'health_bar_back').setScale(.75)
        this.healthBarFront = this.add.sprite(610, 95, 'health_bar_front').setScale(.75)

        // add par animation
        this.parSprite = this.add.sprite(475, 135, 'par_sprite').setOrigin(0,0).setDepth(5).setVisible(false).setScale(.8)
        this.parSprite.anims.play('par-anim')

        // add battle tweens
        let windmillEnter = this.tweens.add({
            targets: this.windmill,
            x: 20,
            duration: 800,
            onComplete: () => {
                this.menuBlip.play()
                this.showIntro = true
            }
        })
        let heroEnter = this.tweens.add({
            targets: this.hero,
            x: 500,
            duration: 800,
        })

        // add attack tweens
        this.heroCharge = this.tweens.add({
            paused: true,
            targets: this.hero,
            scale: {from: .65, to: .75},
            duration: 550,
            hold: 750,
            onStart: () => {
                this.hero.anims.play('battle-attack')
            },
            onComplete: () => {
                this.hero.anims.play('battle-finish')
                this.hitBall.visible = true
                this.ballHit.play()
                this.ballFly.restart()
            }
        })
        this.ballFly = this.tweens.add({
            paused: true,
            targets: this.hitBall,
            x: {from: 675, to: 200},
            y: {from: 450, to: 175},
            duration: 400,
            onComplete: () => {
                this.hitBall.visible = false
                this.enemyFlash.restart()
                this.healthDrop.restart()
            }
        })
        this.enemyFlash = this.tweens.add({
            paused: true,
            targets: this.windmill,
            alpha: {from: 1, to: .2},
            repeat: 4,
            yoyo: true,
            duration: 80,
        })
        this.healthDrop = this.tweens.add({
            paused: true,
            targets: this.healthBarFront,
            scaleX: {from: .75, to: 0},
            x: {from: 610, to: 485},
            duration: 1500,
            onComplete: () => {
                this.parSprite.visible = true
                this.par.play()
                this.enemyDie.restart()
            }
        })
        this.enemyDie = this.tweens.add({
            paused: true,
            targets: this.windmill,
            alpha: {from: 1, to: 0},
            y: {from: 2, to: 50},
            duration: 300,
            hold: 1500,
            onComplete: () => {
                defeatedEnemy = true
                this.bgm.stop()
                this.scene.start('overworldScene')
            }
        })

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keys.EKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        // add sound effects
        this.menuBlip = this.sound.add('menu_blip', { volume: sfxVolume })
        this.menuMove = this.sound.add('menu_move', { volume: sfxVolume })
        this.menuSelect = this.sound.add('menu_select', { volume: sfxVolume })
        this.ballHit = this.sound.add('ball_hit', { volume: sfxVolume })
        this.par = this.sound.add('par', { volume: sfxVolume })

        // play background music
        this.bgm = this.sound.add('battle_theme', {volume: bgmVolume})
        this.bgm.loop = true
        this.bgm.play()
    }

    update() {
        // decrement menu timer
        this.menuTimer--

        // step menu
        this.menuFSM.step()

        // show correct menus
        if (this.showIntro)
        {
            this.introBox.visible = true

            if (this.keys.EKey.isDown || this.keys.space.isDown) {
                this.menuBlip.play()
                this.menuTimer = this.menuCooldown
                
                this.showIntro = false
                this.showMenu = true
                this.showHealth = true
            }
        } else {
            this.introBox.visible = false
        }

        if (this.showMenu)
        {
            this.battleMenu.visible = true
            this.selector.visible = true
            this.option1.visible = true
            this.option2.visible = true
            this.option3.visible = true
        } else {
            this.battleMenu.visible = false
            this.selector.visible = false
            this.option1.visible = false
            this.option2.visible = false
            this.option3.visible = false
        }

        if (this.showHealth)
        {
            this.healthBarBack.visible = true
            this.healthBarFront.visible = true
            this.enemyText.visible = true
        } else {
            this.healthBarBack.visible = false
            this.healthBarFront.visible = false
            this.enemyText.visible = false
        }
    }
}