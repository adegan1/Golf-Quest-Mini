class Overworld extends Phaser.Scene {
    constructor() {
        super("overworldScene")
    }

    init() {
        // spawn locations
        this.aceSpawnX = 1080
        this.aceSpawnY = 400
    }

    create() {
        this.physics.world.drawDebug = false

        // add background image
        this.map = this.add.image(0, 0, 'outdoor_bg').setOrigin(0,0)

        // add collider groups
        this.wallGroup = this.add.group({ runChildUpdate: true })

        // add new Hero to scene (scene, x, y, key, frame, direction)
        this.hero = new Hero(this, this.aceSpawnX, this.aceSpawnY, 'ace', 0, 'down')

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

        // add interactable door
        this.door = this.physics.add.sprite(width * 1.345, height / 3.5).setOrigin(0, 0);    this.door.body.setSize(110, 60).setAllowGravity(false);

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
        this.input.keyboard.on('keydown-K', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

    }

    update() {
        // make sure we step (ie update) the hero's state machine
        this.heroFSM.step()

        this.interact_icon.setPosition(this.hero.x, this.hero.y - interactOffset)

        // if player is near door
        if (Phaser.Math.Distance.BetweenPoints(this.hero, this.door) < 65) {
            this.interact_icon.setVisible(true)

            if (this.keys.EKey.isDown)
            {
                this.scene.start('indoorsScene')
            }
        } else {
            this.interact_icon.setVisible(false)
        }
    }
}