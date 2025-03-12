class Battle extends Phaser.Scene {
    constructor() {
        super("battleScene")
    }

    init() {
        // sound variables
        this.sfxVolume = .3
        this.bgmVolume = .15

        // selector locations
        this.selector1 = 420
        this.selector2 = 460
        this.selector3 = 500

        // text variables
        this.FONT = 'monkey_font'
        this.TEXT_SIZE = 44

        // menu variables
        this.menuCooldown = 20
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

        this.hero = this.add.sprite(-200, 280, 'ace_battle').setOrigin(0,0).setScale(.65)
        this.hero.anims.play('battle-idle')

        //this.hitBall = this.add.sprite(100, 100, 'hit_ball').setOrigin(0,0).setScale(.65)

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

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keys.EKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        // add sound effects
        this.menuBlip = this.sound.add('menu_blip', { volume: this.sfxVolume })
        this.menuMove = this.sound.add('menu_move', { volume: this.sfxVolume })
        this.menuSelect = this.sound.add('menu_select', { volume: this.sfxVolume })
        this.ballHit = this.sound.add('ball_hit', { volume: this.sfxVolume })
        this.par = this.sound.add('par', { volume: this.sfxVolume })

        // play background music
        this.bgm = this.sound.add('battle_theme', {volume: this.bgmVolume})
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