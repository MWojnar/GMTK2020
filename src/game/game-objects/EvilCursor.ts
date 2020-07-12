import { Scene, GameObjects } from "phaser";
import { Number } from "./Number";
import { GameManager } from "./GameManager";
import { CustomEventEmitter } from "../events/CustomEventEmitter";
import * as EVENTS from '../events/events';
import { NumberPolice } from "./NumberPolice";
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';
import { Button } from "./Button";
const UPDATE = Phaser.Scenes.Events.UPDATE;

enum EvilCursorState {
    CLICKING_NUMBER = 'CLICKING_NUMBER',
    CLICKING_SHOP = 'CLICKING_SHOP',
    CLICKING_POLICE = 'CLICKING_POLICE'
}

export class EvilCursor extends Phaser.GameObjects.PathFollower {
    
    public static STATES = EvilCursorState;

    private startX: number = 850;
    private startY: number = 600;
    private clickInterval: NodeJS.Timeout;
    private number: Number;
    private eventEmitter: CustomEventEmitter;
    private targetPolice: NumberPolice;
    private targetButton: Button;
    private moveTo: MoveTo;
    private speed: number = 300;
    private foundTarget: boolean;
    private numberClickSpeed: number = 10;
    private policeClickSpeed: number = 50;
    private buyChance: number = 1;

    public constructor(scene: Scene, x: number, y: number, texture: string, durationInSeconds: number, state: EvilCursorState) {
        super(scene, null, x, y, texture);
        this.number = GameManager.getInstance(scene).getNumber();
        this.eventEmitter = CustomEventEmitter.getInstance();
        // this.setOrigin(.2, .2)
        this.setState(state);
        
        // setTimeout(this.destroy.bind(this), durationInSeconds * 1000);
        if (state === EvilCursorState.CLICKING_POLICE) {
            this.setDepth(10);
            this.scene.events.on(UPDATE, this.policeStateUpdate, this);
            this.moveTo = new MoveTo(this, {
                speed: this.speed,
            })
        } else if (state === EvilCursorState.CLICKING_SHOP) {
            this.scene.events.on(UPDATE, this.shopStateUpdate, this);
            this.moveTo = new MoveTo(this, {
                speed: this.speed,
            })
        }
        
        this.scene.add.existing(this);
        this.anims.play('evilCursorAnimation');
    }

    public policeStateUpdate(): void {
        if (!this.targetPolice) {
            this.targetPolice = GameManager.getInstance(this.scene).getRandomNumberPolice();
            if (this.targetPolice) {
                this.moveTo.moveTo(this.targetPolice.x, this.targetPolice.y);
            }
        } else if (!this.foundTarget) {
            this.moveTo.moveTo(this.targetPolice.x, this.targetPolice.y);
            let newAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, this.targetPolice.x, this.targetPolice.y));
            this.setAngle(newAngle + 135);
        }
        if (this.targetPolice && !this.targetPolice.getIsDying()) {
            if (this.targetPolice.getBounds().contains(this.x, this.y)) {
                this.targetPolice.hurt(5);
            }
        } else if (this.targetPolice && this.targetPolice.getIsDying()) {
            this.foundTarget = false;
            this.targetPolice = null;
        }
        
    }

    public shopStateUpdate(): void {
        let rand = Math.round(Math.random() * 100)
        if (!this.foundTarget && rand < this.buyChance) {
            if (!this.targetButton) {
                this.targetButton = GameManager.getInstance(this.scene).getRandomShopButton();
                if (this.targetButton) {
                    this.moveTo.moveTo(this.targetButton.x, this.targetButton.y);
                    this.moveTo.once('complete', this.buyItem, this);
                }
            }
        }
        if (this.targetButton) {
            let newAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, this.targetButton.x, this.targetButton.y));
            this.setAngle(newAngle + 135);
            this.moveTo.once('complete', () => this.foundTarget = false, this);
        }
    }

    public buyItem(): void {
        this.targetButton.evilCursorClick();
        this.moveTo.moveTo(this.startX, this.startY);
        let newAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, this.startX, this.startY));
        this.setAngle(newAngle + 135);
        this.targetButton = null;
    }

    /* Return type set to any because it's overriding a method that won't allow me to have other return types */
    /* Return type is void */
    public setState(state: EvilCursorState): any {
        this.determinePath(state);
        super.setState(state);
    }

    public click() {
        this.number.add(GameManager.getInstance(this.scene).getClickAmount());
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
                // this.setShopPath();
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
            onComplete: this.startClicking.bind(this, this.numberClickSpeed)
        });
    }

    destroy(): void {
        this.scene.events.off(UPDATE, this.shopStateUpdate, this);
        this.scene.events.off(UPDATE, this.policeStateUpdate, this);
        this.stopClicking();
        this.path.destroy();
        super.destroy();
    }
}