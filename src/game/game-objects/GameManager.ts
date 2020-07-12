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
    public numberEvilCursor: EvilCursor;
    public shopEvilCursor: EvilCursor;
    public policeEvilCursor: EvilCursor;
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

    private soundClick: Phaser.Sound.BaseSound;
    private soundKillBot: Phaser.Sound.BaseSound;
    private soundNumberHurt: Phaser.Sound.BaseSound;
    private soundUpgrade: Phaser.Sound.BaseSound;

    private constructor(scene: Scene) {
        sceneInstanceMap[scene.scene.key] = this;
        this.scene = scene;
        this.eventEmitter = CustomEventEmitter.getInstance();
        this.scene.add.existing(new Phaser.GameObjects.Image(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'background'));
        let shopSettings = this.scene.cache.json.get('shopSettings');
        this.curClickerPrice = shopSettings.initClickerPrice;
        this.curAutoPrice = shopSettings.initAutoPrice;
        this.curClickAmount = shopSettings.initClickerAmount;
        this.curAutoAmount = shopSettings.initAutoAmount;
        this.clickerExponent = shopSettings.clickerExponent;
        this.autoExponent = shopSettings.autoExponent;
        this.number = new Number(scene, 720 / 2, scene.cameras.main.centerY);
        this.doctorNumbers = new DoctorNumbers(scene, 910, 360, 'doctorNumbers');
        this.clickerButton = new Button(scene, 960, 550, 'button', this.buyClicker.bind(this), this.canBuyClicker.bind(this), 'Buy (-' + this.curClickerPrice + ')', '+' + this.curClickAmount + ' Per Click', 0);
        this.autoButton = new Button(scene, 960, 650, 'button', this.buyAuto.bind(this), this.canBuyAuto.bind(this), 'Buy (-' + this.curAutoPrice + ')', '+' + this.curAutoAmount + ' Per Second', 0);
        this.scene.events.on("update", this.update, this);
        this.soundClick = this.scene.sound.add('click');
        this.soundKillBot = this.scene.sound.add('killbot');
        this.soundNumberHurt = this.scene.sound.add('numberhurt');
        this.soundUpgrade = this.scene.sound.add('upgrade');
    }

    public static getInstance(scene: Scene): GameManager {
        if (!sceneInstanceMap[scene.scene.key]) new GameManager(scene);
        return sceneInstanceMap[scene.scene.key];
    }

    public canClickNumber(): boolean {
        if (this.numberEvilCursor) {
            return this.number.getBounds().contains(this.numberEvilCursor.x, this.numberEvilCursor.y);
        } else return true;
    }

    public createNumberEvilCursor(x: number, y: number, duration: number): EvilCursor {
        let evilCursor = new EvilCursor(this.scene, x, y, 'evilCursor', duration, EvilCursor.STATES.CLICKING_NUMBER);
        if (this.numberEvilCursor)
            this.numberEvilCursor.destroy();
        evilCursor.on(Phaser.GameObjects.Events.DESTROY, () => {
            this.destroyEvilCursor(evilCursor);
        });
        this.numberEvilCursor = evilCursor;
        return evilCursor;
    }

    public createShopEvilCursor(x: number, y: number, duration: number): EvilCursor {
        let evilCursor = new EvilCursor(this.scene, x, y, 'evilCursor', duration, EvilCursor.STATES.CLICKING_SHOP);
        if (this.shopEvilCursor)
            this.shopEvilCursor.destroy();
        this.shopEvilCursor = evilCursor;
        return evilCursor;
    }

    public createPoliceEvilCursor(x: number, y: number, duration: number): EvilCursor {
        let evilCursor = new EvilCursor(this.scene, x, y, 'evilCursor', duration, EvilCursor.STATES.CLICKING_POLICE);
        if (this.policeEvilCursor)
            this.policeEvilCursor.destroy();
        this.policeEvilCursor = evilCursor;
        return evilCursor;
    }

    public destroyEvilCursor(evilCursor: EvilCursor): void {
        switch (evilCursor.state) {
            case EvilCursor.STATES.CLICKING_NUMBER:
                this.numberEvilCursor = undefined;
                break;
            case EvilCursor.STATES.CLICKING_SHOP:
                this.shopEvilCursor = undefined;
                break;
            case EvilCursor.STATES.CLICKING_POLICE:
                this.policeEvilCursor = undefined;
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
        if (!this.numberEvilCursor) {
            let point = this.randPointOutsideBoundaries();
            this.createNumberEvilCursor(point.x, point.y, 10);
        }
    }

    public incrementEvilBuyerPhase(): void {
        this.evilBuyerPhase++;
        if (!this.shopEvilCursor) {
            let point = this.randPointOutsideBoundaries();
            this.createShopEvilCursor(point.x, point.y, 10);
        }
    }

    public incrementEvilFighterPhase(): void {
        this.evilFighterPhase++;
        if (!this.policeEvilCursor) {
            let point = this.randPointOutsideBoundaries();
            this.createPoliceEvilCursor(point.x, point.y, 10);
        }
    }

    public incrementPolicePhase(): void {
        this.policePhase++;
    }

    public unlockStore(): void {
        this.storeUnlocked = true;
    }

    public initiateEnd(): void {
        this.scene.cameras.main.shake(10000, 0.01);
        this.scene.cameras.main.fadeOut(10000, 255, 255, 255);
    }

    private update(): void {
        let PoliceRandom: number = Math.random() * this.policeModifier;
        if (this.curAutoAmount > 0)
            this.number.add(this.curAutoAmount / 60);

        if (PoliceRandom < this.policePhase) {
            let point = this.randPointOutsideBoundaries();
            this.createNumberPolice(point.x, point.y, 500);
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
        this.playUpgradeSound();
    }

    public buyAuto(): void {
        this.number.add(-this.curAutoPrice);
        this.curAutoAmount++;
        this.curAutoPrice *= this.autoExponent;
        this.autoButton.updateText("Buy (-" + Math.ceil(this.curAutoPrice).toString() + ")");
        this.autoButton.updateOuterText("+" + Math.floor(this.curAutoAmount).toString() + " Per Second");
        this.playUpgradeSound();
    }

    public canBuyClicker(): boolean {
        return this.storeUnlocked && this.number.getValue() > this.curClickerPrice;
    }

    public canBuyAuto(): boolean {
        return this.storeUnlocked && this.number.getValue() > this.curAutoPrice;
    }

    public playClickSound(): void {
        this.soundClick.play();
    }

    public playKillBotSound(): void {
        this.soundKillBot.play();
    }

    public playNumberHurtSound(): void {
        this.soundNumberHurt.play();
    }

    public playUpgradeSound(): void {
        this.soundUpgrade.play();
    }

}