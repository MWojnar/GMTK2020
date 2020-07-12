import * as EVENTS from '../events/events';
import { CustomEventEmitter } from '../events/CustomEventEmitter';
import { Scene } from 'phaser';
import { GameManager } from './GameManager';
const INPUT_EVENTS = Phaser.Input.Events;
const STYLE = { 
    color: '#0f0',
    backgroundColor: '#f00',
    strokeThickness: 5,
    stroke: '#0f0',
    fontSize: '60px',
    fontFamily: 'Sans Serif'
};

export class Number extends Phaser.GameObjects.Text {

    private value: number;
    private eventEmitter: CustomEventEmitter;
    private gameManager: GameManager;

    public constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, '0', STYLE);
        this.value = 0;
        this.setText(this.value.toString());
        this.setOrigin(.5, .5);

        this.setInteractive({ useHandCursor: true })
        .on(INPUT_EVENTS.POINTER_UP, this.addClick.bind(this));

        this.eventEmitter = CustomEventEmitter.getInstance();
        this.gameManager = GameManager.getInstance(this.scene);

        this.scene.add.existing(this);
    }

    public click(amount: number): void {
        if (GameManager.getInstance(this.scene).canClickNumber()) {
            this.add(amount);
        }
    }

    public add(amount: number): void {
        this.value += amount;
        this.setText(Math.floor(this.value).toString());
        this.eventEmitter.emit(EVENTS.NUMBER_CHANGED, this.value - amount, this.value);
    }

    public addClick(): void {
        this.click(GameManager.getInstance(this.scene).getClickAmount())
        this.gameManager.playClickSound();
    }

    public getValue(): number {
        return this.value;
    }
}