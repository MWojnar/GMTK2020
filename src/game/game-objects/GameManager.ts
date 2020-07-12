import { EvilCursor } from "./EvilCursor";
import { Scene } from "phaser";
import { Number } from "./Number";
import { CustomEventEmitter } from "../events/CustomEventEmitter";
import { DoctorNumbers } from "./DoctorNumbers";
import { Button } from "./Button";
import { NumberPolice } from "./NumberPolice";
import * as EVENTS from '../events/events';


let sceneInstanceMap = {};
export class GameManager {

    private number: Number;
    private eventEmitter: CustomEventEmitter;
    private doctorNumbers: DoctorNumbers;
    private numberEvilCursors: EvilCursor[] = [];
    private shopEvilCursors: EvilCursor[] = [];
    private policeEvilCursors: EvilCursor[] = [];
    private numberPolice: NumberPolice[] = [];
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
    private storeUnlocked: boolean = false;
    private curClickerPrice: number = 15;
    private curAutoPrice: number = 150;
    private curClickAmount: number = 1;
    private curAutoAmount: number = 0;
    private clickerExponent: number = 1.15;
    private autoExponent: number = 1.15;

    private constructor(scene: Scene) {
        sceneInstanceMap[scene.scene.key] = this;
        this.scene = scene;
        this.eventEmitter = CustomEventEmitter.getInstance();
        this.scene.add.existing(new Phaser.GameObjects.Image(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'background'));
        this.number = new Number(scene, 720 / 2, scene.cameras.main.centerY);
        this.doctorNumbers = new DoctorNumbers(scene, 910, 360, 'doctorNumbers');
        this.clickerButton = new Button(scene, 960, 550, 'button', this.buyClicker.bind(this), this.canBuyClicker.bind(this), 'Buy (-15)', '+1 Per Click', 0);
        this.autoButton = new Button(scene, 960, 650, 'button', this.buyAuto.bind(this), this.canBuyAuto.bind(this), 'Buy (-150)', '+0 Per Second', 0);
        this.scene.events.on("update", this.update, this);
        let shopSettings = this.scene.cache.json.get('shopSettings');
        this.curClickerPrice = shopSettings.initClickerPrice;
        this.curAutoPrice = shopSettings.initAutoPrice;
        this.curClickAmount = shopSettings.initClickerAmount;
        this.curAutoAmount = shopSettings.initAutoAmount;
        this.clickerExponent = shopSettings.clickerExponent;
        this.autoExponent = shopSettings.autoExponent;
    }

    public static getInstance(scene: Scene): GameManager {
        if (!sceneInstanceMap[scene.scene.key]) new GameManager(scene);
        return sceneInstanceMap[scene.scene.key];
    }

    public canClickNumber(): boolean {
        return !this.numberEvilCursors.some((numberEvilCursor: EvilCursor) => this.number.getBounds().contains(numberEvilCursor.x, numberEvilCursor.y));
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

    public destroyEvilCursor(evilCursor: EvilCursor): void {
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

    public createNumberPolice(x: number, y: number, damage: number): NumberPolice {
        let numberPolice = new NumberPolice(this.scene, x, y, 'numberPolice', damage, 20);
        this.numberPolice.push(numberPolice);
        this.eventEmitter.emit(EVENTS.POLICE_SPAWNED);
        return numberPolice;
    }

    public getRandomNumberPolice(): NumberPolice {
        let length = this.numberPolice.length;
        return length ? this.numberPolice[Math.round(Math.random() * length)] : null;
    }

    public destroyNumberPolice(numberPolice: NumberPolice): void {
        this.numberPolice = this.numberPolice.filter((other) => other !== numberPolice);
    }

    public getRandomShopButton(): Button {
        let button: Button = null;
        if (this.canBuyAuto() && this.canBuyClicker()) {
            let rand = Math.round(Math.random());
            if (rand === 0) button = this.clickerButton;
            else button = this.autoButton;
        }
        else if (this.canBuyAuto()) button = this.autoButton;
        else if (this.canBuyClicker()) button = this.clickerButton;
        return button;
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
        this.storeUnlocked = true;
    }

    public initiateEnd(): void {
        //todo
    }

    private update(): void {
        let evilClickerRandom: number = Math.random() * this.evilClickerModifier;
        let evilBuyerRandom: number = Math.random() * this.evilBuyerModifier;
        let evilFighterRandom: number = Math.random() * this.evilFighterModifier;
        let PoliceRandom: number = Math.random() * this.policeModifier;
        if (this.curAutoAmount > 0)
            this.number.add(this.curAutoAmount / 60);

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
            this.createNumberPolice(point.x, point.y, 10);
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

    public getClickAmount(): number {
        return this.curClickAmount;
    }

    public buyClicker(): void {
        this.number.add(-this.curClickerPrice);
        this.curClickAmount++;
        this.curClickerPrice *= this.clickerExponent;
        this.clickerButton.updateText("Buy (-" + Math.ceil(this.curClickerPrice).toString() + ")");
        this.clickerButton.updateOuterText("+" + Math.floor(this.curClickAmount).toString() + " Per Click");
    }

    public buyAuto(): void {
        this.number.add(-this.curAutoPrice);
        this.curAutoAmount++;
        this.curAutoPrice *= this.autoExponent;
        this.autoButton.updateText("Buy (-" + Math.ceil(this.curAutoPrice).toString() + ")");
        this.autoButton.updateOuterText("+" + Math.floor(this.curAutoAmount).toString() + " Per Second");
    }

    public canBuyClicker(): boolean {
        return this.storeUnlocked && this.number.getValue() > this.curClickerPrice;
    }

    public canBuyAuto(): boolean {
        return this.storeUnlocked && this.number.getValue() > this.curAutoPrice;
    }

}