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

        // add new Hero to scene (scene, x, y, key, frame, direction)
        this.hero = new Hero(this, this.aceSpawnX, this.aceSpawnY, 'ace', 0, 'down')

        // set up camera
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