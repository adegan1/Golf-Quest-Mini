class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        this.load.path = './assets/'

        // load character visuals
        this.load.image('sandtraps', 'sprites/characters/sandtrap_front.png')
        this.load.spritesheet('ace', 'sprites/characters/ace_spritesheet.png', {
            frameWidth: 54,
            frameHeight: 66,
        })
        this.load.spritesheet('ace_battle', 'sprites/characters/ace_battle_spritesheet.png', {
            frameWidth: 280,
            frameHeight: 363,
        })
        this.load.image('wedge', 'sprites/characters/wedge_front.png')
        this.load.image('lina', 'sprites/characters/lina_front.png')
        this.load.image('battle_windmill', 'sprites/battle_windmill.png')

        // load JSON (dialogue text)
        this.load.json('dialogue', 'json/dialogue.json')

        // load bitmap font
        this.load.bitmapFont('monkey_font', 'fonts/monkey.png', 'fonts/monkey.xml')

        // load dialogue assets
        this.load.image('dialogue_box', 'sprites/dialogue_box.png')
        this.load.image('sandtraps_portrait', 'sprites/sandtraps_portrait.png')
        this.load.image('ace_portrait', 'sprites/ace_portrait.png')

        // load backgrounds
        this.load.image('indoor_bg', 'backgrounds/indoors_bg.png')
        this.load.image('indoor_layers', 'backgrounds/indoors_layers.png')
        this.load.image('outdoor_bg', 'backgrounds/outdoor_bg.png')
        this.load.image('battle_bg', 'backgrounds/battle_bg.png')
        this.load.image('gameover_bg', 'backgrounds/gameover_bg.png')

        // load other sprites
        this.load.image('interact', 'sprites/interact.png')
        this.load.image('door_indicator', 'sprites/door_indicator.png')
        this.load.image('windmill', 'sprites/windmill.png')
        this.load.image('alertBox', 'sprites/enemy_alert.png')
        this.load.image('hit_ball', 'sprites/hit_ball.png')

        this.load.image('circleTransition', 'sprites/circleTransition.png')
        this.load.image('screenTransition', 'sprites/screenTransition.png')

        this.load.image('enter_fight_box', 'sprites/enter_fight_box.png')
        this.load.image('battle_menu', 'sprites/battle_options.png')
        this.load.image('selector', 'sprites/selector.png')

        this.load.image('health_bar_back', 'sprites/health_bar_back.png')
        this.load.image('health_bar_front', 'sprites/health_bar_front.png')

        this.load.spritesheet('mythril_putter', 'backgrounds/mythril_putter.png', {
            frameWidth: 800,
            frameHeight: 600,
        })
        this.load.spritesheet('par_sprite', 'sprites/parSprite.png', {
            frameWidth: 309,
            frameHeight: 178,
        })

        // load sfx
        this.load.audio('dialogue_blip', 'sfx/dialogueBlip.wav')
        this.load.audio('item_get', 'sfx/itemGet.wav')
        this.load.audio('door_close', 'sfx/doorClose.wav')
        this.load.audio('enemy_alert', 'sfx/warning.wav')
        this.load.audio('enter_battle', 'sfx/enterBattle.wav')

        this.load.audio('menu_blip', 'sfx/menuBlip.wav')
        this.load.audio('menu_move', 'sfx/menuMove.wav')
        this.load.audio('menu_select', 'sfx/menuSelect.wav')
        this.load.audio('ball_hit', 'sfx/ballHit.wav')
        this.load.audio('par', 'sfx/par.wav')

        // load music
        this.load.audio('indoor_theme', 'music/indoor_theme.wav')
        this.load.audio('outdoor_theme', 'music/outdoor_theme.wav')
        this.load.audio('battle_theme', 'music/battle_theme.wav')
        this.load.audio('ending_theme', 'music/ending_theme.wav')
    }

    create() {
        // hero animations (walking)
        this.anims.create({
            key: 'walk-down',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [2, 3, 4, 3, 2, 1, 0, 1] }),
        })
        this.anims.create({
            key: 'walk-left',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [7, 8, 9, 8, 7, 6, 5, 6] }),
        })
        this.anims.create({
            key: 'walk-right',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [12, 13, 14, 13, 12, 11, 10, 11] }),
        })
        this.anims.create({
            key: 'walk-up',
            frameRate: 12,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ace', { frames: [17, 18, 19, 18, 17, 16, 15, 16] }),
        })

        this.anims.create({
            key: 'mythril-putter-get',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('mythril_putter', { frames: [0, 1] }),
        })

        // hero battle animations
        this.anims.create({
            key: 'battle-idle',
            frameRate: 1,
            frames: this.anims.generateFrameNumbers('ace_battle', { frames: [0] }),
        })
        this.anims.create({
            key: 'battle-attack',
            frameRate: 6,
            frames: this.anims.generateFrameNumbers('ace_battle', { frames: [1, 1, 1, 1, 2, 3, 3, 2] }),
        })
        this.anims.create({
            key: 'battle-finish',
            frameRate: 1,
            frames: this.anims.generateFrameNumbers('ace_battle', { frames: [4] }),
        })

        this.anims.create({
            key: 'par-anim',
            frameRate: 6,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('par_sprite', { frames: [0, 1] }),
        })

        // create input
        cursors = this.input.keyboard.createCursorKeys()

        // proceed once loading completes
        this.scene.start('indoorsScene')
        //this.scene.start('overworldScene')
        //this.scene.start('battleScene')
        //this.scene.start('gameoverScene')
    }
}