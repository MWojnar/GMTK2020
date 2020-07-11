/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      {@link https://github.com/digitsensitive/phaser3-typescript/blob/master/LICENSE.md | MIT License}
 */
import { Button } from '../game-objects/Button';

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.image("myImage", "../assets/phaser.png");
    this.load.spritesheet('button', '../assets/ExampleButton.png', {
      frameHeight: 300, frameWidth: 400
    });
  }

  create(): void {
    let button = new Button(this, 400, 300, 'button', () => console.log('Button pressed'));
    // this.phaserSprite = this.add.sprite(400, 300, "myImage");
  }

  update(): void {

  }
}
