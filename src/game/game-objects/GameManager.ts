import { EvilCursor } from "./EvilCursor";
import { Scene } from "phaser";
import { Number } from "./Number";
import { CustomEventEmitter } from "../events/CustomEventEmitter";
import { DoctorNumbers } from "./DoctorNumbers";
import { Button } from "./Button";

let sceneInstanceMap = {};
export class GameManager {

    private number: Number;
    private doctorNumbers: DoctorNumbers;
    private numberEvilCursors: EvilCursor[] = [];
    private shopEvilCursors: EvilCursor[] = [];
    private policeEvilCursors: EvilCursor[] = [];
    private scene: Scene;

    private constructor(scene: Scene) {
        this.scene = scene;
        this.scene.add.existing(new Phaser.GameObjects.Image(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'background'));
        this.number = new Number(scene, 720 / 2, scene.cameras.main.centerY);
        this.doctorNumbers = new DoctorNumbers(scene, 900, 360, 'doctorNumbers');
        new Button(scene, 900, 540, 'button', () => '', 'Clicks', 0);
        (new Button(scene, 900, 660, 'button', () => '', 'Auto', 0)).setActive(false);
    }

    public static getInstance(scene: Scene): GameManager {
        if (!sceneInstanceMap[scene.scene.key]) sceneInstanceMap[scene.scene.key] = new GameManager(scene);
        return sceneInstanceMap[scene.scene.key];
    }

    public createNumberEvilCursor(x: number, y: number, duration: number): EvilCursor {
        let evilCursor = new EvilCursor(this.scene, x, y, 'evilCursor', duration, EvilCursor.STATES.CLICKING_NUMBER);
        evilCursor.on(Phaser.GameObjects.Events.DESTROY, () => {
            this.destroyEvilCursor(evilCursor);
        });
        this.numberEvilCursors.push(evilCursor);
        return evilCursor;
    }

    public createShopEvilCursor(x: number, y: number, duration: number): EvilCursor {
        let evilCursor = new EvilCursor(this.scene, x, y, 'evilCursor', duration, EvilCursor.STATES.CLICKING_SHOP);
        this.shopEvilCursors.push(evilCursor);
        return evilCursor;
    }

    public createPoliceEvilCursor(x: number, y: number, duration: number): EvilCursor {
        let evilCursor = new EvilCursor(this.scene, x, y, 'evilCursor', duration, EvilCursor.STATES.CLICKING_POLICE);
        this.policeEvilCursors.push(evilCursor);
        return evilCursor;
    }

    public destroyEvilCursor(evilCursor: EvilCursor) {
        switch (evilCursor.state) {
            case EvilCursor.STATES.CLICKING_NUMBER:
                this.numberEvilCursors = this.numberEvilCursors.filter((other) => other !== evilCursor);
                break;
            case EvilCursor.STATES.CLICKING_SHOP:
                this.shopEvilCursors = this.shopEvilCursors.filter((other) => other !== evilCursor);
                break;
            case EvilCursor.STATES.CLICKING_POLICE:
                this.policeEvilCursors.filter((other) => other !== evilCursor);
                break;
        }
    }

    public getNumber(): Number {
        return this.number;
    }

}