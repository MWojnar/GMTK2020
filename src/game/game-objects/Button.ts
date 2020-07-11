export class Button extends Phaser.GameObjects.Sprite {

    BASE_FRAME: integer = 0;
    PRESSED_FRAME: integer = 1;
    HOVER_FRAME: integer = 2;
    INACTIVE_FRAME: integer = 3;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        super.setInteractive()

        this.setInteractive();
        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp(callback), this)

        this.scene.add.existing(this);
    }

    onDown(): void {
        if (this.active) {
            this.setFrame(this.PRESSED_FRAME);
        }
    }

    onUp(callback: Function): Function {
        return () => {
            console.log("Name on release: " + this.frame.name);
            if (this.active && this.frame.name == this.PRESSED_FRAME.toString()) {
                this.setFrame(this.BASE_FRAME);
                callback();
            }
        }
    }
    
}