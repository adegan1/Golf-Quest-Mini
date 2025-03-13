// Code Project: Make the Fake
// Name: Andrew Degan
// Adapted Game: Golf Quest Mini (from Steven Universe)

// Phaser Major Components:
// Physics Systems
// Cameras
// Text Objects
// Animation Manager
// Tween Manager
// Timers, etc.

// Missable Features:
// Game controls show up if player does not move at beginning of game

// Asset Citation:
// Golf Quest Mini concept art by the Steven Universe Team:
// https://stevencrewniverse.tumblr.com/post/90482139787/a-selection-of-character-prop-and-effect-designs

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
    scene: [ Menu, Load, Indoors, Overworld, Battle, GameOver ]
}

const game = new Phaser.Game(config)

let { width, height } = game.config

let interactOffset = 70
let cursors = null

// progress flags
let startFade = true
let sandtrapDialogue = true
let defeatedEnemy = false

// spawn location variables
let indoorX = 400
let indoorY = 300

let outdoorX = 1090
let outdoorY = 200

// sound variables
let sfxVolume = .3
let bgmVolume = .15