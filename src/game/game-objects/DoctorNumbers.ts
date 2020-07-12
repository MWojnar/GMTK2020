import * as EVENTS from '../events/events';
import { CustomEventEmitter } from "../events/CustomEventEmitter";
import { GameManager } from './GameManager';

export class DoctorNumbers extends Phaser.GameObjects.Sprite {

    HAPPY_FRAME: integer = 0;
    HAPPY2_FRAME: integer = 1;
    OVER_EXCITED_FRAME: integer = 2;
    DISAPPOINTED_FRAME: integer = 3;
    SLIGHTLY_ANGRY_FRAME: integer = 4;
    ROLLING_EYES_FRAME: integer = 5;
    EXCITED_ANGRY_FRAME: integer = 6;
    ANGRY_FRAME: integer = 7;
    SCARED_FRAME: integer = 8;
    VERY_ANGRY_FRAME: integer = 9;
    CRAZED_FRAME: integer = 10;
    INSANE_FRAME: integer = 11;

    private text: Phaser.GameObjects.Text = undefined;
    private eventNumbers = [];
    private dialogue;
    private eventEmitter: CustomEventEmitter;
    private gameManager: GameManager;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        this.scene.add.existing(this);
        this.text = this.scene.add.text(720 + 10, 0, "Hello! I’m Professor Numbers! I’m here to teach you all about the wonderful world of counting! Click on the 0 in the center to count to the next number!", { color: "#000000", fontSize: 24, wordWrap: { width: 340 } });
        this.dialogue = this.scene.cache.json.get('dialogue');
        this.dialogue.forEach(element => this.eventNumbers.push(element.numberTrigger));
        this.eventEmitter = CustomEventEmitter.getInstance();
        this.eventEmitter.on(EVENTS.NUMBER_CHANGED, this.onNumberIncrease, this);
        this.gameManager = GameManager.getInstance(scene);
    }

    private onNumberIncrease(prev, cur): void {
        let numsToDo = this.eventNumbers.filter(element => element <= cur);
        this.eventNumbers = this.eventNumbers.filter(element => element > cur);
        numsToDo.forEach(num => this.startEvent(this.dialogue.filter(element => element.numberTrigger === num)[0]));
    }

    private startEvent(event) {
        if (event) {
            if (this.text)
                this.text.destroy();
            this.text = this.scene.add.text(720 + 10, 0, event.text, { color: "#000000", fontSize: 24, wordWrap: { width: 340 } });
            event.event.split('|').forEach(e => this.enactEvent(e));
            switch (event.frame) {
                case "happy": this.setFrame(this.HAPPY_FRAME); break;
                case "happy2": this.setFrame(this.HAPPY2_FRAME); break;
                case "over-excited": this.setFrame(this.OVER_EXCITED_FRAME); break;
                case "disappointed": this.setFrame(this.DISAPPOINTED_FRAME); break;
                case "slightly-angry": this.setFrame(this.SLIGHTLY_ANGRY_FRAME); break;
                case "rolling-eyes": this.setFrame(this.ROLLING_EYES_FRAME); break;
                case "excited-angry": this.setFrame(this.EXCITED_ANGRY_FRAME); break;
                case "angry": this.setFrame(this.ANGRY_FRAME); break;
                case "scared": this.setFrame(this.SCARED_FRAME); break;
                case "very-angry": this.setFrame(this.VERY_ANGRY_FRAME); break;
                case "crazed": this.setFrame(this.CRAZED_FRAME); break;
                case "insane": this.setFrame(this.INSANE_FRAME); break;
            }
        }
    }

    private enactEvent(event) {
        switch (event) {
            case "unlockStore": this.gameManager.unlockStore(); break;
            case "incrementEvilClicker": this.gameManager.incrementEvilClickerPhase(); break;
            case "incrementNumberPolice": this.gameManager.incrementPolicePhase(); break;
            case "incrementEvilBuyer": this.gameManager.incrementEvilBuyerPhase(); break;
            case "incrementEvilFighter": this.gameManager.incrementEvilFighterPhase(); break;
            case "end": this.gameManager.initiateEnd(); break;
        }
    }

    public destroy() {
        this.eventEmitter.off(EVENTS.NUMBER_CHANGED, this.onNumberIncrease, this);
        super.destroy();
    }
    
}