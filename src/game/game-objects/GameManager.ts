import { EvilCursor } from "./EvilCursor";
import { Scene } from "phaser";
import { Number } from "./Number";
import { CustomEventEmitter } from "../events/CustomEventEmitter";
import { DoctorNumbers } from "./DoctorNumbers";

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
        this.number = new Number(scene, scene.cameras.main.centerX, scene.cameras.main.centerY);
        this.doctorNumbers = new DoctorNumbers(scene, 720, 240, 'evilCursor');
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