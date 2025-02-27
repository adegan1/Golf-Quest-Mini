// Code Project: Make the Fake
// Name: Andrew Degan
// Adapted Game: Golf Quest Mini (from Steven Universe)

'use strict'

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,     // for tinting
    width: 800,             // trying to match Steven's tv resolution
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [ Menu, Load, Indoors, Overworld, Battle ]
}

const game = new Phaser.Game(config)