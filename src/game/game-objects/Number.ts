import * as EVENTS from '../events/events';
import { CustomEventEmitter } from '../events/CustomEventEmitter';
import { Scene } from 'phaser';
const INPUT_EVENTS = Phaser.Input.Events;
const STYLE = { 
    color: '#0f0',
    backgroundColor: '#fff',
    strokeThickness: 5,
    fontSize: '60px'
};

export class Number extends Phaser.GameObjects.Text {

    private value: number;
    private eventEmitter: CustomEventEmitter;

    public constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, '0', STYLE);
        this.value = 0;
        this.setText(this.value.toString());
        this.setOrigin(.5, .5);

        this.setInteractive({ useHandCursor: true })
        .on(INPUT_EVENTS.POINTER_UP, this.add.bind(this, 1));

        this.eventEmitter = CustomEventEmitter.getInstance();

        this.scene.add.existing(this);
    }

    public add(amount: number): void {
        this.value += amount;
        this.setText(this.value.toString());
        this.eventEmitter.emit(EVENTS.NUMBER_CHANGED, this.value - amount, this.value);
    }

    public getValue(): number {
        return this.value;
    }
}