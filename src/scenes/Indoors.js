class Indoors extends Phaser.Scene {
    constructor() {
        super("indoorsScene")
    }

    init() {
        // spawn locations
        this.aceSpawnX = 400
        this.aceSpawnY = 300
    }

    create() {
        // add background image
        this.map = this.add.image(0, 0, 'indoor_bg').setOrigin(0,0)
        this.layers = this.add.image(0, 0, 'indoor_layers').setOrigin(0,0).setDepth(1)  // add layers for player to walk behind

        // add collider groups
        this.wallGroup = this.add.group({ runChildUpdate: true })

        // add new Hero to scene (scene, x, y, key, frame, direction)
        this.hero = new Hero(this, this.aceSpawnX, this.aceSpawnY, 'ace', 0, 'down')

        this.interact_icon = this.add.sprite(width/2, height/2, 'interact').setVisible(false)

        // add environment walls
        let topWall = this.physics.add.sprite(width / 2, height / 21).setOrigin(0, 0).setImmovable(true);    topWall.body.setSize(1000, 70).setAllowGravity(false);     this.wallGroup.add(topWall);
        let leftShelf = this.physics.add.sprite(100, height / 3).setOrigin(0, 0).setImmovable(true);    leftShelf.body.setSize(290, 70).setAllowGravity(false);     this.wallGroup.add(leftShelf);
        let rightShelf = this.physics.add.sprite(685, height / 3).setOrigin(0, 0).setImmovable(true);    rightShelf.body.setSize(290, 70).setAllowGravity(false);     this.wallGroup.add(rightShelf);
        let leftTable = this.physics.add.sprite(127, height / 1.775).setOrigin(0, 0).setImmovable(true);    leftTable.body.setSize(155, 105).setAllowGravity(false);     this.wallGroup.add(leftTable);
        let rightTable = this.physics.add.sprite(659, height / 1.775).setOrigin(0, 0).setImmovable(true);    rightTable.body.setSize(155, 105).setAllowGravity(false);     this.wallGroup.add(rightTable);

        this.physics.add.collider(this.hero, this.wallGroup)

        // add interactable door
        this.door = this.physics.add.sprite(width / 2.025, height / 1.11).setOrigin(0, 0);    this.door.body.setSize(110, 60).setAllowGravity(false);

        // set up camera
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
                this.scene.start('overworldScene')
            }
        } else {
            this.interact_icon.setVisible(false)
        }
    }
}