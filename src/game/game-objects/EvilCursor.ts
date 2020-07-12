import { Scene, GameObjects } from "phaser";
import { Number } from "./Number";
import { GameManager } from "./GameManager";
import { CustomEventEmitter } from "../events/CustomEventEmitter";
import * as EVENTS from '../events/events';
import { NumberPolice } from "./NumberPolice";
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';
const UPDATE = Phaser.Scenes.Events.UPDATE;

enum EvilCursorState {
    CLICKING_NUMBER = 'CLICKING_NUMBER',
    CLICKING_SHOP = 'CLICKING_SHOP',
    CLICKING_POLICE = 'CLICKING_POLICE'
}

export class EvilCursor extends Phaser.GameObjects.PathFollower {
    
    public static STATES = EvilCursorState;

    private clickInterval: NodeJS.Timeout;
    private number: Number;
    private eventEmitter: CustomEventEmitter;
    private targetPolice: NumberPolice;
    private moveTo: MoveTo;
    private speed: number = 200;
    private foundTarget: boolean;
    private numberClickSpeed: number = 2;
    private policeClickSpeed: number = 2;

    public constructor(scene: Scene, x: number, y: number, texture: string, durationInSeconds: number, state: EvilCursorState) {
        super(scene, null, x, y, texture);
        this.number = GameManager.getInstance(scene).getNumber();
        this.eventEmitter = CustomEventEmitter.getInstance();
        this.setOrigin(.2, .2)
        this.setState(state);
        
        setTimeout(this.destroy.bind(this), durationInSeconds * 1000);
        if (state === EvilCursorState.CLICKING_POLICE) {
            this.setDepth(10);
            this.scene.events.on(UPDATE, this.update, this);
            this.moveTo = new MoveTo(this, {
                speed: this.speed,
            })
        }
        
        
        this.scene.add.existing(this);
        this.anims.play('evilCursorAnimation');
    }

    public update(): void {
        if (!this.targetPolice) {
            this.targetPolice = GameManager.getInstance(this.scene).getRandomNumberPolice();
            if (this.targetPolice) {
                this.moveTo.moveTo(this.targetPolice.x, this.targetPolice.y);
                this.moveTo.once('complete', this.damagePolice, this);
            }
        } else if (!this.foundTarget) {
            this.moveTo.moveTo(this.targetPolice.x, this.targetPolice.y);
            let newAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, this.targetPolice.x, this.targetPolice.y));
            this.setAngle(newAngle + 135);
        }
    }

    /* Return type set to any because it's overriding a method that won't allow me to have other return types */
    /* Return type is void */
    public setState(state: EvilCursorState): any {
        this.determinePath(state);
        super.setState(state);
    }

    private damagePolice() {
        this.foundTarget = true;
        this.clickInterval = setInterval((() => {
            if (!this.targetPolice.getIsDying()) {
                this.targetPolice.hurt(1);
            } else {
                this.foundTarget = false;
                this.targetPolice = null;
                clearInterval(this.clickInterval);
            }
        }).bind(this), 1000);
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
                // this.setPolicePath();
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
        let randomPolice = GameManager.getInstance(this.scene).getRandomNumberPolice();
            let path = new Phaser.Curves.Path;
            path.add(new Phaser.Curves.Line(new Phaser.Math.Vector2(this), randomPolice ? randomPolice.getCenter() : new Phaser.Math.Vector2(this)));
            this.setPath(path, { 
                rotateToPath: true, 
                rotationOffset: 135,
                duration: 2000,
                onComplete: () => console.log("DONE!")
            });
        this.startFollow();
    }

    destroy(): void {
        this.stopClicking();
        this.path.destroy();
        super.destroy();
    }
}