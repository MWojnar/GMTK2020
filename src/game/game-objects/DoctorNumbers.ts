import * as EVENTS from '../events/events';
import { CustomEventEmitter } from "../events/CustomEventEmitter";
import { GameManager } from './GameManager';

export class DoctorNumbers extends Phaser.GameObjects.Sprite {

    private text: Phaser.GameObjects.Text = undefined;
    private eventNumbers = [];
    private dialogue;
    private eventEmitter: CustomEventEmitter;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | integer) {
        super(scene, x, y, texture, frame);
        this.scene.add.existing(this);
        this.text = this.scene.add.text(720 + 10, 0, "Hello World!", { color: "#000000", fontSize: 32, wordWrap: { width: 340 } });
        this.dialogue = this.scene.cache.json.get('dialogue');
        this.dialogue.forEach(element => this.eventNumbers.push(element.numberTrigger));
        this.eventEmitter = CustomEventEmitter.getInstance();
        this.eventEmitter.on(EVENTS.NUMBER_CHANGED, this.onNumberIncrease.bind(this));
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
            this.text = this.scene.add.text(720 + 10, 0, event.text, { color: "#000000", fontSize: 32, wordWrap: { width: 340 } });
            if (event.numberTrigger === 10)
                GameManager.getInstance(this.scene).createNumberEvilCursor(100, 100, 5);
        }
    }
    
}