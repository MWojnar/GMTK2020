const INPUT_EVENTS = Phaser.Input.Events;

export class Button extends Phaser.GameObjects.Sprite {

    BASE_FRAME: integer = 0;
    HOVER_FRAME: integer = 1;
    PRESSED_FRAME: integer = 2;
    INACTIVE_FRAME: integer = 3;

    private startX: number = 0;
    private startY: number = 0;
    private text: Phaser.GameObjects.Text;
    private outerText: Phaser.GameObjects.Text;
    private activeCallback: Function;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, callback: Function, activeCallback: Function, text: string, outerText: string, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        this.startX = x;
        this.startY = y;
        super.setInteractive()

        this.activeCallback = activeCallback;
        this.setInteractive();
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_DOWN, this.onDown, this);
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_UP, this.onUp(callback), this);
        this.scene.input.on(INPUT_EVENTS.POINTER_UP, (event) => this.setFrame(this.active ? (this.getBounds().contains(event.upX, event.upY) ? this.HOVER_FRAME : this.BASE_FRAME) : this.frame.name), this);
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_OVER, () => this.setFrame(this.frame.name == this.BASE_FRAME.toString() && this.active ? this.HOVER_FRAME : this.frame.name), this);
        this.on(INPUT_EVENTS.GAMEOBJECT_POINTER_OUT, () => this.setFrame(this.frame.name == this.HOVER_FRAME.toString() && this.active ? this.BASE_FRAME : this.frame.name), this);
        this.scene.events.on("update", this.update, this);

        this.scene.add.existing(this);
        this.updateText(text);
        this.updateOuterText(outerText);

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
        this.setFrame(value ? (this.frame.name == this.INACTIVE_FRAME.toString() ? this.BASE_FRAME : this.frame.name) : this.INACTIVE_FRAME);
        return super.setActive(value);
    }

    public updateText(text: string): void {
        if (this.text)
            this.text.destroy();
        this.text = this.scene.add.text(this.startX - this.width / 2 + 10, this.startY - this.height / 2 + 20, text, { color: "#000000", fontSize: 16, wordWrap: { width: 200 } });
    }

    public updateOuterText(text: string): void {
        if (this.outerText)
            this.outerText.destroy();
        this.outerText = this.scene.add.text(this.startX - 210, this.startY - this.height / 2 + 20, text, { color: "#000000", fontSize: 16, wordWrap: { width: 200 } });
    }

    public update() {
        this.setActive(this.activeCallback());
        super.update();
    }
    
}