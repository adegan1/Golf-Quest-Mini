class Overworld extends Phaser.Scene {
    constructor() {
        super("overworldScene")
    }

    create() {
        // add background image
        this.map = this.add.image(0, 0, 'map').setOrigin(0,0)

        // add new Hero to scene (scene, x, y, key, frame, direction)
        this.hero = new Hero(this, 200, 150, 'hero', 0, 'down')

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

        // debug key listener (assigned to K key)
        this.input.keyboard.on('keydown-K', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

    }

    update() {
        // make sure we step (ie update) the hero's state machine
        this.heroFSM.step()
    }
}