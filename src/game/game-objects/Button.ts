const INPUT_EVENTS = Phaser.Input.Events;

export class Button extends Phaser.GameObjects.Sprite {

    BASE_FRAME: integer = 0;
    PRESSED_FRAME: integer = 1;
    HOVER_FRAME: integer = 2;
    INACTIVE_FRAME: integer = 3;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        super.setInteractive()

        this.setInteractive();
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_DOWN, this.onDown, this);
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_UP, this.onUp(callback), this);
        this.scene.input.on(INPUT_EVENTS.POINTER_UP, (event) => this.setFrame(this.getBounds().contains(event.upX, event.upY) ? this.HOVER_FRAME : this.BASE_FRAME), this);
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_OVER, () => this.setFrame(this.frame.name == this.BASE_FRAME.toString() ? this.HOVER_FRAME : this.frame.name), this);
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_OUT, () => this.setFrame(this.frame.name == this.HOVER_FRAME.toString() ? this.BASE_FRAME : this.frame.name), this);

        this.scene.add.existing(this);

    }

    onDown(): void {
        if (this.active) {
            this.setFrame(this.PRESSED_FRAME);
        }
    }

    onUp(callback: Function): Function {
        return () => {
            if (this.active && this.frame.name == this.PRESSED_FRAME.toString()) {
                callback();
                this.setFrame(this.BASE_FRAME);
            }
        }
    }

    setActive(value: boolean): this {
        this.setFrame(value ? this.BASE_FRAME : this.INACTIVE_FRAME);
        return super.setActive(value);
    }
    
}