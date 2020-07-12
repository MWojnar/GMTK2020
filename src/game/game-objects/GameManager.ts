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
    private evilClickerPhase: number = 0;
    private evilBuyerPhase: number = 0;
    private evilFighterPhase: number = 0;
    private policePhase: number = 0;
    private evilClickerModifier: number = 600;
    private evilBuyerModifier: number = 600;
    private evilFighterModifier: number = 600;
    private policeModifier: number = 600;
    private clickerButton: Button;
    private autoButton: Button;

    private constructor(scene: Scene) {
        sceneInstanceMap[scene.scene.key] = this;
        this.scene = scene;
        this.scene.add.existing(new Phaser.GameObjects.Image(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'background'));
        this.number = new Number(scene, 720 / 2, scene.cameras.main.centerY);
        this.doctorNumbers = new DoctorNumbers(scene, 900, 360, 'doctorNumbers');
        this.clickerButton = new Button(scene, 900, 540, 'button', () => '', 'Clicks', 0);
        this.autoButton = (new Button(scene, 900, 660, 'button', () => '', 'Auto', 0)).setActive(false);
        this.scene.events.on("update", this.update, this);
    }

    public static getInstance(scene: Scene): GameManager {
        if (!sceneInstanceMap[scene.scene.key]) new GameManager(scene);
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

    public incrementEvilClickerPhase(): void {
        this.evilClickerPhase++;
    }

    public incrementEvilBuyerPhase(): void {
        this.evilBuyerPhase++;
    }

    public incrementEvilFighterPhase(): void {
        this.evilFighterPhase++;
    }

    public incrementPolicePhase(): void {
        this.policePhase++;
    }

    public unlockStore(): void {
        this.clickerButton.setVisible(true);
        this.autoButton.setVisible(true);
    }

    public initiateEnd(): void {
        //todo
    }

    private update(): void {
        let evilClickerRandom: number = Math.random() * this.evilClickerModifier;
        let evilBuyerRandom: number = Math.random() * this.evilBuyerModifier;
        let evilFighterRandom: number = Math.random() * this.evilFighterModifier;
        let PoliceRandom: number = Math.random() * this.policeModifier;

        if (evilClickerRandom < this.evilClickerPhase) {
            let point = this.randPointOutsideBoundaries();
            this.createNumberEvilCursor(point.x, point.y, 10);
        }
        if (evilBuyerRandom < this.evilBuyerPhase) {
            let point = this.randPointOutsideBoundaries();
            this.createNumberEvilCursor(point.x, point.y, 10);
        }
        if (evilFighterRandom < this.evilFighterPhase) {
            let point = this.randPointOutsideBoundaries();
            this.createNumberEvilCursor(point.x, point.y, 10);
        }
        if (PoliceRandom < this.policePhase) {
            let point = this.randPointOutsideBoundaries();
            //this.createNumberPolice(point.x, point.y, 10);
        }
    }

    public destroy() {
        this.scene.events.off("update", this.update, this);
    }

    private randPointOutsideBoundaries() {
        if (Math.random() > .5) {
            if (Math.random() > .5) {
                return { x: -150, y: Math.random() * (720 + 300) - 150 };
            } else {
                return { x: 1080 + 150, y: Math.random() * (720 + 300) - 150 };
            }
        } else {
            if (Math.random() > .5) {
                return { x: Math.random() * (1080 + 300) - 150, y: -150 };
            } else {
                return { x: Math.random() * (1080 + 300) - 150, y: 720 + 150 };   
            }
        }
    }

}