class Indoors extends Phaser.Scene {
    constructor() {
        super("indoorsScene")
    }

    init() {
        // door cooldown to avoid door spam
        this.doorCooldown = 25

        // dialogue variables
        this.inDialogue = false

        this.DBOX_X = width/2
        this.DBOX_Y = height/1.2
        this.DBOX_FONT = 'monkey_font'

        this.TEXT_X = 275
        this.TEXT_Y = 450
        this.TEXT_SIZE = 36
        this.TEXT_MAX_WIDTH = 700

        this.NEXT_TEXT = '[SPACE]'
        this.NEXT_X = 675
        this.NEXT_Y = 542
        this.NEXT_SIZE = 20

        this.LETTER_TIMER = 2

        this.PORTRAIT_X = 84
        this.PORTRAIT_Y = 420

        this.dialogueConvo = 0
        this.dialogueLine = 0
        this.dialogueSpeaker = null
        this.dialogueLastSpeaker = null
        this.dialogueTyping = false
        this.dialogueText = null
        this.nextText = null

        // sound variables
        this.sfxVolume = .3
        this.bgmVolume = .15
    }

    create() {
        this.physics.world.drawDebug = false
        
        // input
        cursors = this.input.keyboard.createCursorKeys()

        // add background image
        this.map = this.add.image(0, 0, 'indoor_bg').setOrigin(0,0)
        this.layers = this.add.image(0, 0, 'indoor_layers').setOrigin(0,0).setDepth(2)  // add layers for player to walk behind

        // add collider groups
        this.wallGroup = this.add.group({ runChildUpdate: true })

        // add new Hero to scene (scene, x, y, key, frame, direction)
        this.hero = new Hero(this, indoorX, indoorY, 'ace', 0, 'down').setDepth(1)

        this.interact_icon = this.add.sprite(width/2, height/2, 'interact').setVisible(false).setDepth(3)

        // add NPC
        this.sandtraps = this.physics.add.sprite(width/2, height/4, 'sandtraps').setScale(1.25).setImmovable(true)
        this.sandtraps.body.setSize(this.sandtraps.width/1.25, this.sandtraps.height/2).setOffset(this.sandtraps.width/8.5, this.sandtraps.height/2).setAllowGravity(false)

        this.physics.add.collider(this.hero, this.sandtraps)

        // add environment walls
        let topWall = this.physics.add.sprite(width / 2, height / 21).setOrigin(0, 0).setImmovable(true);    topWall.body.setSize(1000, 70).setAllowGravity(false);     this.wallGroup.add(topWall);
        let leftShelf = this.physics.add.sprite(100, height / 3).setOrigin(0, 0).setImmovable(true);    leftShelf.body.setSize(290, 70).setAllowGravity(false);     this.wallGroup.add(leftShelf);
        let rightShelf = this.physics.add.sprite(685, height / 3).setOrigin(0, 0).setImmovable(true);    rightShelf.body.setSize(290, 70).setAllowGravity(false);     this.wallGroup.add(rightShelf);
        let leftTable = this.physics.add.sprite(127, height / 1.775).setOrigin(0, 0).setImmovable(true);    leftTable.body.setSize(155, 105).setAllowGravity(false);     this.wallGroup.add(leftTable);
        let rightTable = this.physics.add.sprite(659, height / 1.775).setOrigin(0, 0).setImmovable(true);    rightTable.body.setSize(155, 105).setAllowGravity(false);     this.wallGroup.add(rightTable);

        this.physics.add.collider(this.hero, this.wallGroup)

        // add interactable door
        this.door = this.physics.add.sprite(width / 2.025, height / 1.11).setOrigin(0, 0);    this.door.body.setSize(110, 60).setAllowGravity(false);

        // add dialogue assets
        this.dialogue = this.cache.json.get('dialogue')

        this.dialogueBox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogue_box').setScale(.85).setDepth(4).setVisible(false)
        this.dialogueText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE).setDepth(4).setVisible(false)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.NEXT_SIZE).setDepth(4).setVisible(false)

        this.acePortrait = this.add.sprite(this.PORTRAIT_X, this.PORTRAIT_Y, 'ace_portrait').setScale(.85).setOrigin(0).setDepth(4).setVisible(false)
        this.sandtrapsPortrait = this.add.sprite(this.PORTRAIT_X, this.PORTRAIT_Y, 'sandtraps_portrait').setScale(.85).setOrigin(0).setDepth(4).setVisible(false)

        // add mythril putter screen
        this.mythrilPutter = this.add.sprite(0, 0, 'mythril_putter').setOrigin(0,0).setDepth(5).setVisible(false)
        this.mythrilPutter.anims.play('mythril-putter-get')

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
        /*this.input.keyboard.on('keydown-K', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)*/

        // add sound effects
        this.dialogueBlip = this.sound.add('dialogue_blip', { volume: this.sfxVolume })
        this.itemGet = this.sound.add('item_get', { volume: this.sfxVolume })
        this.doorClose = this.sound.add('door_close', { volume: this.sfxVolume })

        // play background music
        this.bgm = this.sound.add('indoor_theme', {volume: this.bgmVolume})
        this.bgm.loop = true
        this.bgm.play()
    }

    update() {
        // decrement door cooldown timer
        if (this.doorCooldown > 0) { this.doorCooldown-- }

        // make sure we step (ie update) the hero's state machine
        this.heroFSM.step()

        if (this.hero.y <= 135) {
            this.sandtraps.setDepth(2)
        } else {
            this.sandtraps.setDepth(0)
        }

        this.interact_icon.setPosition(this.hero.x, this.hero.y - interactOffset)
        this.interact_icon.setVisible(false)

        // if player is near sandtraps
        if (Phaser.Math.Distance.BetweenPoints(this.hero, this.sandtraps) < 70 && sandtrapDialogue) {
            this.interact_icon.setVisible(true)

            if (this.keys.EKey.isDown)
            {
                sandtrapDialogue = false
                this.inDialogue = true

                // start first dialogue conversation
                this.typeText()
            }
        }

        // if player is near door
        if (Phaser.Math.Distance.BetweenPoints(this.hero, this.door) < 65 && !sandtrapDialogue && this.doorCooldown <= 0) {
            this.interact_icon.setVisible(true)

            if (Phaser.Input.Keyboard.JustDown(this.keys.EKey))
            {
                indoorX = this.hero.x
                indoorY = this.hero.y

                this.doorClose.play()
                this.bgm.stop()
                this.scene.start('overworldScene')
            }
        }

        // check for dialogue press
        if(Phaser.Input.Keyboard.JustDown(cursors.space) && this.inDialogue) {
            if (!this.dialogTyping) {
                this.typeText() // trigger dialog
            }
        }
    }

    // dialogue functionality sourced from Tina Peng
    typeText() {
        // show dialogue
        this.dialogueBox.visible = true
        this.dialogueText.visible = true
        this.nextText.visible = true

        // lock input while typing
        this.dialogueTyping = true

        // clear text
        this.dialogueText.text = ''
        this.nextText.text = ''

        // play dialogue blip
        this.dialogueBlip.play()

        // make sure there are lines left to read in this convo, otherwise jump to next convo
        if(this.dialogueLine > this.dialogue[this.dialogueConvo].length - 1) {
            this.dialogueLine = 0
            // I increment the conversation count here...
            // ..but you could create logic to exit if each conversation was self-contained
            this.dialogueConvo++
        }
        
        // make sure we haven't run out of conversations...
        if(this.dialogueConvo >= this.dialogue.length) {
            // end dialogue
            // make text box invisible
            this.inDialogue = false
            this.dialogueBox.visible = false
            this.dialogueLastSpeaker.visible = false
            this.dialogueSpeaker.visible = false

        } else {
            // if not, set current speaker
            this.dialogueSpeaker = this.dialogue[this.dialogueConvo][this.dialogueLine]['speaker']
            // correct potraits
            if (this.dialogueSpeaker == 'PROF.SANDTRAPS' || this.dialogueSpeaker == 'item') { this.dialogueSpeaker = this.sandtrapsPortrait }
            else if (this.dialogueSpeaker == 'stevenU') { this.dialogueSpeaker = this.acePortrait }

            // check if there's a new speaker (for exit/enter animations)
            if(this.dialogue[this.dialogueConvo][this.dialogueLine]['newSpeaker']) {
                // set last speaker invisible
                if(this.dialogueLastSpeaker) {
                    this.dialogueLastSpeaker.visible = false
                }
                // set current speaker visible
                this.dialogueSpeaker.visible = true
            }

            // check if there is an item obtained
            if(this.dialogue[this.dialogueConvo][this.dialogueLine]['itemGet']) {
                this.itemGet.play()

                this.mythrilPutter.visible = true
            } else {
                this.mythrilPutter.visible = false
            }

            // build dialogue (concatenate speaker + colon + line of text)
            this.combinedDialogue = 
                this.dialogue[this.dialogueConvo][this.dialogueLine]['speaker']
                + '\n' 
                + this.dialogue[this.dialogueConvo][this.dialogueLine]['dialogue']

            // create a timer to iterate through each letter in the dialogue text
            let currentChar = 0
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.combinedDialogue.length - 1,
                callback: () => { 
                    // concatenate next letter from dialogueLines
                    this.dialogueText.text += this.combinedDialogue[currentChar]
                    // advance character position
                    currentChar++
                    // check if timer has exhausted its repeats 
                    // (necessary since Phaser 3 no longer seems to have an onComplete event)
                    if(this.textTimer.getRepeatCount() == 0) {
                        // show prompt for more text
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.NEXT_SIZE).setOrigin(1).setDepth(4)
                        this.dialogueTyping = false   // un-lock input
                        this.textTimer.destroy()    // destroy timer
                    }
                },
                callbackScope: this // keep Scene context
            })
            
            // final cleanup before next iteration
            this.dialogueText.maxWidth = this.TEXT_MAX_WIDTH  // set bounds on dialogue
            this.dialogueLine++                               // increment dialogue line
            this.dialogueLastSpeaker = this.dialogueSpeaker     // set past speaker
        }
    }
}