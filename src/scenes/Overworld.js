class Overworld extends Phaser.Scene {
    constructor() {
        super("overworldScene")
    }

    init() {
        // door cooldown to avoid door spam
        this.doorCooldown = 25

        // scene variables
        this.encounteredEnemy = false
    }

    create() {
        this.physics.world.drawDebug = false

        // add background image
        this.map = this.add.image(0, 0, 'outdoor_bg').setOrigin(0,0)

        // add collider groups
        this.wallGroup = this.add.group({ runChildUpdate: true })

        // add new Hero to scene (scene, x, y, key, frame, direction)
        this.hero = new Hero(this, outdoorX, outdoorY, 'ace', 0, 'down').setDepth(1)

        this.interact_icon = this.add.sprite(width/2, height/2, 'interact').setVisible(false)

        // add environment walls
        let house = this.physics.add.sprite(width * 1.345, height / 4.85).setOrigin(0, 0).setImmovable(true);    house.body.setSize(300, 50).setAllowGravity(false);     this.wallGroup.add(house);
        let houseBushes = this.physics.add.sprite(width * 1.345, height / 5.4).setOrigin(0, 0).setImmovable(true);    houseBushes.body.setSize(800, 50).setAllowGravity(false);     this.wallGroup.add(houseBushes);
        let moatLeft = this.physics.add.sprite(width * 1.02, height / 2.75).setOrigin(0, 0).setImmovable(true);    moatLeft.body.setSize(50, 300).setAllowGravity(false);     this.wallGroup.add(moatLeft);
        let moatRight = this.physics.add.sprite(width * 1.665, height / 2.75).setOrigin(0, 0).setImmovable(true);    moatRight.body.setSize(50, 300).setAllowGravity(false);     this.wallGroup.add(moatRight);
        let pathLeft = this.physics.add.sprite(width * 0.76, height * 1.075).setOrigin(0, 0).setImmovable(true);    pathLeft.body.setSize(800, 600).setAllowGravity(false);     this.wallGroup.add(pathLeft);
        let pathRight = this.physics.add.sprite(width * 1.615, height * 1.2385).setOrigin(0, 0).setImmovable(true);    pathRight.body.setSize(300, 800).setAllowGravity(false);     this.wallGroup.add(pathRight);
        let pathBottom = this.physics.add.sprite(width * 0.85, height * 1.835).setOrigin(0, 0).setImmovable(true);    pathBottom.body.setSize(1000, 50).setAllowGravity(false);     this.wallGroup.add(pathBottom);
        let pathHoleEnd = this.physics.add.sprite(width * 0.325, height * 1.7).setOrigin(0, 0).setImmovable(true);    pathHoleEnd.body.setSize(50, 200).setAllowGravity(false);     this.wallGroup.add(pathHoleEnd);

        this.physics.add.collider(this.hero, this.wallGroup)

        // add interactable door and hole
        this.door = this.physics.add.sprite(width * 1.345, height / 3.5).setOrigin(0, 0);    this.door.body.setSize(110, 60).setAllowGravity(false);
        this.hole = this.physics.add.sprite(width * .47, height * 1.665).setOrigin(0, 0);    this.hole.body.setSize(50, 50).setAllowGravity(false);

        // add enemy encounter objects and tweens
        this.alertBox = this.add.sprite(width * 1.49, height * 1.8, 'alertBox').setVisible(false).setScale(.85).setDepth(5)
        this.tweenCamera = this.add.sprite(0, 0, 'ace').setVisible(false)
        this.circleTransition = this.add.sprite(width * 1.05, height * 1.65, 'circleTransition').setVisible(false).setDepth(10)

        if (!defeatedEnemy) {
            this.windmill = this.add.sprite(width * .52, height * 1.59, 'windmill').setVisible(true).setScale(.8)
        }

        let encounterHeroTween = this.tweens.chain({
            paused: true,
            tweens: [
                {
                    delay: 200,
                    targets: this.hero,
                    x: 890,
                    duration: 1000
                }
            ]
        })

        let encounterWindmillTween = this.tweens.chain({
            paused: true,
            tweens: [
                {
                    delay: 200,
                    targets: this.windmill,
                    x: 775,
                    duration: 1000,
                }
            ]
        })

        let encounterCameraTween = this.tweens.chain({
            paused: true,
            tweens: [
                {
                    delay: 200,
                    targets: this.tweenCamera,
                    x: 725,
                    duration: 1000,
                    onStart: () => {
                        this.tweenCamera.x = this.hero.x
                        this.tweenCamera.y = this.hero.y
                        this.cameras.main.startFollow(this.tweenCamera, false, 0.5, 0.5)
                    },
                    onComplete: () => {
                        this.alertBox.visible = false
                        transitionTween.restart()
                    }
                }
            ]
        })

        let transitionTween = this.tweens.add({
            paused: true,
            delay: 200,
            targets: this.circleTransition,
            scale: {from: 10, to: .5},
            duration: 750,
            onStart: () => {
                this.circleTransition.visible = true
                this.enterBattle.play()
            },
            onComplete: () => {
                outdoorX = this.hero.x
                outdoorY = this.hero.y

                this.bgm.stop()
                this.scene.start('battleScene')
            }
        })

        // enemy encounter trigger
        this.enemyEncounter = this.physics.add.sprite(width * 1.125, height * 1.65).setOrigin(0, 0);    this.enemyEncounter.body.setSize(100, 200).setAllowGravity(false);

        if (!defeatedEnemy){
            this.physics.add.overlap(this.hero, this.enemyEncounter, () => {
                if (!this.encounteredEnemy) {
                    this.encounteredEnemy = true
                    this.alertBox.visible = true
                    this.enemyAlert.play()
    
                    encounterHeroTween.restart()
                    encounterWindmillTween.restart()
                    encounterCameraTween.restart()
                }
            })
        }

        // set up camera
        this.cameras.main.setBounds(0, 0, this.map.width, this.map.height)
        this.cameras.main.startFollow(this.hero, false, 0.5, 0.5)
        this.physics.world.setBounds(0, 0, this.map.width, this.map.height)

        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.keys.EKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        // debug key listener (assigned to K key)
        /*this.input.keyboard.on('keydown-K', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)*/

        // add sound effects
        this.doorClose = this.sound.add('door_close', { volume: sfxVolume })
        this.enemyAlert = this.sound.add('enemy_alert', { volume: sfxVolume / 2 })
        this.enterBattle = this.sound.add('enter_battle', { volume: sfxVolume })

        // play background music
        this.bgm = this.sound.add('outdoor_theme', {volume: bgmVolume})
        this.bgm.loop = true
        this.bgm.play()
    }

    update() {
        // decrement door cooldown timer
        if (this.doorCooldown > 0) { this.doorCooldown-- }

        // make sure we step (ie update) the hero's state machine
        this.heroFSM.step()

        this.interact_icon.setPosition(this.hero.x, this.hero.y - interactOffset)
        this.interact_icon.setVisible(false)

        // if player is near door
        if (Phaser.Math.Distance.BetweenPoints(this.hero, this.door) < 65 && this.doorCooldown <= 0) {
            this.interact_icon.setVisible(true)

            if (Phaser.Input.Keyboard.JustDown(this.keys.EKey))
            {
                outdoorX = this.hero.x
                outdoorY = this.hero.y

                this.doorClose.play()
                this.bgm.stop()
                this.scene.start('indoorsScene')
            }
        }

        // if player is near end hole
        if (Phaser.Math.Distance.BetweenPoints(this.hero, this.hole) < 65) {
            this.interact_icon.setVisible(true)

            if (Phaser.Input.Keyboard.JustDown(this.keys.EKey))
            {
                this.bgm.stop()
                this.scene.start('gameoverScene')
            }
        }
    }
}