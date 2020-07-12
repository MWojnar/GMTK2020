import { GameObjects, Scene } from "phaser";
import { GameManager } from "./GameManager";
import { Number } from "./Number";

export class NumberPolice extends GameObjects.PathFollower {

    private number: Number;
    private health = 5;
    private isDying = false;
    private damage: number;
    private speed: number;
    private damageInterval: NodeJS.Timeout;
    private isDamaging: boolean;

    public constructor(scene: Scene, x: number, y: number, texture: string, damage: number, speed: number) {
        super(scene, null, x, y, texture);
        this.number = GameManager.getInstance(scene).getNumber()
        this.damage = damage;
        this.speed = speed;

        this.setInteractive()
        .on(Phaser.Input.Events.POINTER_DOWN, this.hurt.bind(this, 1));

        this.buildPath();

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        this.scene.add.existing(this);
        this.anims.play('numberPoliceAnimation');
    }

    public update(time: number, delta: number) {
        if (!this.isDamaging && Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.number.getBounds())) {
            this.isDamaging = true;
            this.damageInterval = setInterval(this.decreaseNumber.bind(this), 500);
        } else if (this.isDamaging && this.isDying) {
            clearInterval(this.damageInterval);
        }
        if (this.isDying) {
            this.setAngle(this.angle += 10);
            this.setAlpha(this.alpha -= .01);
            this.setScale(this.scaleX -= .01, this.scaleY -= .01);
        }
    }

    public hurt(damage: number): void {
        this.health -= damage;
        console.log(this.health);
        if (this.health <= 0) {
            this.triggerDeath();
        }
    }

    private buildPath(): void {
        let path = new Phaser.Curves.Path(this.x, this.y);
        let line = new Phaser.Curves.Line(new Phaser.Math.Vector2(this), this.number.getCenter())
        let distance = line.getLength();
        let duration = distance / this.speed * 100;
        path.add(line);
        this.setPath(path, { 
            duration: duration
        });
    }

    private decreaseNumber(): void {
        this.number.add(-this.damage);
    }

    private triggerDeath(): void {
        if (!this.isDying) {
            this.isDying = true;
            let startPoint = this.path.getStartPoint();
            this.path.destroy();
            let path = new Phaser.Curves.Path(this.x, this.y);
            path.add(new Phaser.Curves.Line(new Phaser.Math.Vector2(this), startPoint));
            this.setPath(path, {
                duration: 1000,
                onComplete: this.destroy.bind(this)
            })
        }
    }

    public destroy() {
        clearInterval(this.damageInterval);
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.path.destroy();
        super.destroy();
    }
}