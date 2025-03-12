// Battle menu prefab
class BattleMenu extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.add.existing(this)

        // set custom Menu properties
        this.options = 3
        this.choice = 0

        // initialize state machine managing menu
        scene.menuFSM = new StateMachine('ace', {
            ace: new AceOption(),
            attack: new AttackOption(),
            stroke: new StrokeOption(),
            item: new ItemOption(),
            putt: new PuttOption(),
            chip: new ChipOption(),
            drive: new DriveOption(),
            mythrilPutter: new MythrilPutter(),
        }, [scene, this])
    }
}

// menu option state classes
class AceOption extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector1
        scene.option1.text = 'ACE'
        scene.option2.text = ''
        scene.option3.text = ''

        //console.log('ace')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('ace')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('ace')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('ace')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                scene.menuSelect.play()
                this.stateMachine.transition('attack')
            }
        }
    }
}

class AttackOption extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector1
        scene.option1.text = 'ATTACK'
        scene.option2.text = ''
        scene.option3.text = ''

        //console.log('attack')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('attack')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('attack')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('ace')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                scene.menuSelect.play()
                this.stateMachine.transition('stroke')
            }
        }
    }
}

class StrokeOption extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector1
        scene.option1.text = 'STROKE'
        scene.option2.text = 'ITEM'
        scene.option3.text = ''

        //console.log('stroke')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('item')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('item')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('attack')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                scene.menuSelect.play()
                this.stateMachine.transition('putt')
            }
        }
    }
}

class ItemOption extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector2
        scene.option1.text = 'STROKE'
        scene.option2.text = 'ITEM'
        scene.option3.text = ''

        //console.log('item')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('stroke')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('stroke')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('attack')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                scene.menuSelect.play()
                this.stateMachine.transition('mythrilPutter')
            }
        }
    }
}

class PuttOption extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector1
        scene.option1.text = 'PUTT'
        scene.option2.text = 'CHIP'
        scene.option3.text = 'DRIVE'

        //console.log('putt')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('drive')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('chip')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('stroke')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                scene.menuSelect.play()
                this.stateMachine.transition('putt')
            }
        }
    }
}

class ChipOption extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector2
        scene.option1.text = 'PUTT'
        scene.option2.text = 'CHIP'
        scene.option3.text = 'DRIVE'

        //console.log('chip')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('putt')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('drive')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('stroke')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                scene.menuSelect.play()
                this.stateMachine.transition('chip')
            }
        }
    }
}

class DriveOption extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector3
        scene.option1.text = 'PUTT'
        scene.option2.text = 'CHIP'
        scene.option3.text = 'DRIVE'

        //console.log('drive')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('chip')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('putt')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('stroke')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                scene.menuSelect.play()
                this.stateMachine.transition('drive')
            }
        }
    }
}

class MythrilPutter extends State {
    enter(scene, menu) {
        scene.menuMove.play()
        scene.menuTimer = scene.menuCooldown

        scene.selector.y = scene.selector1
        scene.option1.text = 'MYTHRIL PUTTER'
        scene.option2.text = ''
        scene.option3.text = ''

        //console.log('mythril putter')
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey
        const EKey = scene.keys.EKey

        // navigate through menu
        if (scene.menuTimer <= 0 && scene.showMenu) {
            // up
            if(WKey.isDown || up.isDown) {
                this.stateMachine.transition('mythrilPutter')
            }
            // down
            if(SKey.isDown || down.isDown) {
                this.stateMachine.transition('mythrilPutter')
            }
            // back
            if(AKey.isDown || left.isDown) {
                this.stateMachine.transition('item')
            }
            // select
            if(EKey.isDown || space.isDown || DKey.isDown || right.isDown) {
                this.stateMachine.transition('mythrilPutter')
            }
        }
    }
}