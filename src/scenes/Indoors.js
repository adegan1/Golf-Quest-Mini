class Indoors extends Phaser.Scene {
    constructor() {
        super("indoorsScene")
    }

    init() {
        // spawn locations
        this.aceSpawnX = 400
        this.aceSpawnY = 300

        // dialogue variables
        this.inDialogue = false

        this.DBOX_X = width/2
        this.DBOX_Y = height/1.2
        this.DBOX_FONT = 'monkey_font'

        this.TEXT_X = 275
        this.TEXT_Y = 450
        this.TEXT_SIZE = 36
        this.TEXT_MAX_WIDTH = 700

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
        this.bgmVolume = .2
    }

    create() {
        this.physics.world.drawDebug = false

        // add background image
        this.map = this.add.image(0, 0, 'indoor_bg').setOrigin(0,0)
        this.layers = this.add.image(0, 0, 'indoor_layers').setOrigin(0,0).setDepth(2)  // add layers for player to walk behind

        // add collider groups
        this.wallGroup = this.add.group({ runChildUpdate: true })

        // add new Hero to scene (scene, x, y, key, frame, direction)
        this.hero = new Hero(this, this.aceSpawnX, this.aceSpawnY, 'ace', 0, 'down').setDepth(1)

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
        this.dialogueText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, 'PROF.SANDTRAPS', this.TEXT_SIZE).setDepth(4).setVisible(false)

        this.acePortrait = this.add.sprite(this.PORTRAIT_X, this.PORTRAIT_Y, 'ace_portrait').setScale(.85).setOrigin(0).setDepth(4).setVisible(false)
        this.sandtrapsPortrait = this.add.sprite(this.PORTRAIT_X, this.PORTRAIT_Y, 'sandtraps_portrait').setScale(.85).setOrigin(0).setDepth(4).setVisible(false)

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

        // play background music
        this.bgm = this.sound.add('indoor_theme', {volume: this.bgmVolume})
        this.bgm.loop = true
        this.bgm.play()
    }

    update() {
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
        if (Phaser.Math.Distance.BetweenPoints(this.hero, this.sandtraps) < 70 && !this.inDialogue) {
            this.interact_icon.setVisible(true)

            if (this.keys.EKey.isDown)
            {
                this.inDialogue = true

                // start first dialogue conversation
                this.typeText()
            }
        }

        // if player is near door
        if (Phaser.Math.Distance.BetweenPoints(this.hero, this.door) < 65) {
            this.interact_icon.setVisible(true)

            if (this.keys.EKey.isDown)
            {
                this.bgm.stop()
                this.scene.start('overworldScene')
            }
        }

        // check for dialogue press
        if(Phaser.Input.Keyboard.JustDown(cursors.space) && !this.dialogTyping) {
            this.typeText() // trigger dialog
        }
    }

    // dialogue functionality sourced from Tina Peng
    typeText() {
        // show dialogue
        this.dialogueBox.visible = true
        this.dialogueText.visible = true

        // lock input while typing
        this.dialogueTyping = true

        // clear text
        this.dialogueText.text = ''

        /* JSON dialogue structure: 
            - each array within the main JSON array is a "conversation"
            - each object within a "conversation" is a "line"
            - each "line" can have 3 properties: 
                1. a speaker (required)
                2. the dialogue text (required)
                3. an (optional) flag indicating if this speaker is new
        */

        // make sure there are lines left to read in this convo, otherwise jump to next convo
        if(this.dialogueLine > this.dialogue[this.dialogueConvo].length - 1) {
            this.dialogueLine = 0
            // I increment the conversation count here...
            // ..but you could create logic to exit if each conversation was self-contained
            this.dialogueConvo++
        }
        
        // make sure we haven't run out of conversations...
        if(this.dialogueConvo >= this.dialogue.length) {
            // here I'm exiting the final conversation to return to the title...
            // ...but you could add alternate logic if needed
            console.log('End of Conversations')
            // tween out prior speaker's image
            /*if(this.dialogueLastSpeaker) {
                this.tweens.add({
                    targets: this[this.dialogueLastSpeaker],
                    x: this.OFFSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear',
                    onComplete: () => {
                        this.scene.start('titleScene')
                    }
                })
            }*/
            // make text box invisible
            this.dialogueBox.visible = false

        } else {
            // if not, set current speaker
            this.dialogueSpeaker = this.dialogue[this.dialogueConvo][this.dialogueLine]['speaker']
            // check if there's a new speaker (for exit/enter animations)
            if(this.dialogue[this.dialogueConvo][this.dialogueLine]['newSpeaker']) {
                // tween out prior speaker's image
                /*if(this.dialogueLastSpeaker) {
                    this.tweens.add({
                        targets: this[this.dialogueLastSpeaker],
                        x: this.OFFSCREEN_X,
                        duration: this.tweenDuration,
                        ease: 'Linear'
                    })
                }
                // tween in new speaker's image
                this.tweens.add({
                    targets: this[this.dialogueSpeaker],
                    x: this.DBOX_X + 50,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                })*/
            }

            // build dialogue (concatenate speaker + colon + line of text)
            this.combinedDialogue = 
                this.dialogue[this.dialogueConvo][this.dialogueLine]['speaker'].toUpperCase() 
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