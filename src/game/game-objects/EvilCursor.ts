import { Scene, GameObjects } from "phaser";
import { Number } from "./Number";
import { GameManager } from "./GameManager";

enum EvilCursorState {
    CLICKING_NUMBER = 'CLICKING_NUMBER',
    CLICKING_SHOP = 'CLICKING_SHOP',
    CLICKING_POLICE = 'CLICKING_POLICE'
}

export class EvilCursor extends Phaser.GameObjects.PathFollower {
    
    public static STATES = EvilCursorState;

    private clickInterval: NodeJS.Timeout;
    private number: Number;

    public constructor(scene: Scene, x: number, y: number, texture: string, durationInSeconds: number, state: EvilCursorState) {
        super(scene, null, x, y, texture);
        this.number = GameManager.getInstance(scene).getNumber();

        this.setOrigin(0, 0)
        this.setState(state);
        this.anims.play('evilCursor.animation');
        
        setTimeout(this.destroy.bind(this), durationInSeconds * 1000);
        
        this.scene.add.existing(this);
        this.anims.play('evilCursorAnimation');
        this.startFollow();
    }

    /* Return type set to any because it's overriding a method that won't allow me to have other return types */
    /* Return type is void */
    public setState(state: EvilCursorState): any {
        this.determinePath(state);
        super.setState(state);
    }

    public click() {
        this.number.add(1);
    }

    public startClicking(clicksPerSecond: number) {
        this.clickInterval = setInterval(this.click.bind(this), 1000 / clicksPerSecond);
    }

    public stopClicking() {
        clearInterval(this.clickInterval);
    }

    private determinePath(state: EvilCursorState): void {
        switch (state) {
            case EvilCursorState.CLICKING_NUMBER:
                this.setNumberPath();
                break;
            case EvilCursorState.CLICKING_SHOP:
                this.setShopPath();
                break;
            case EvilCursorState.CLICKING_POLICE:
                this.setPolicePath();
                break;
        }
    }

    private setNumberPath(): void {
        let path = new Phaser.Curves.Path(this.x, this.y);
        path.add(new Phaser.Curves.Line(new Phaser.Math.Vector2(this), this.number.getCenter()));
        this.setPath(path, { 
            rotateToPath: true,
            rotationOffset: 135,
            duration: 2000,
            onComplete: this.startClicking.bind(this, 10)
        });
    }

    private setShopPath(): void {
        let path = new Phaser.Curves.Path;
        path.add(new Phaser.Curves.Line(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(40, 40)));
        this.setPath(path, { 
            rotateToPath: true, 
            rotationOffset: 135, 
            duration: 2000,
            onComplete: () => console.log("DONE!")
        });
    }

    private setPolicePath(): void {
        let path = new Phaser.Curves.Path;
        path.add(new Phaser.Curves.Line(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(40, 40)));
        this.setPath(path, { 
            rotateToPath: true, 
            rotationOffset: 135, 
            duration: 2000,
            onComplete: () => console.log("DONE!")
        });
    }

    destroy(): void {
        this.stopClicking();
        this.path.destroy();
        super.destroy();
    }
}