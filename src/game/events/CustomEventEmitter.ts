
let instance = null;

export class CustomEventEmitter extends Phaser.Events.EventEmitter {

    private constructor() {
        super();
    }

    public static getInstance(): Phaser.Events.EventEmitter {
        if (!instance) instance = new CustomEventEmitter();
        return instance;
    }
}