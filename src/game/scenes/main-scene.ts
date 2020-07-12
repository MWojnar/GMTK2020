/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      {@link https://github.com/digitsensitive/phaser3-typescript/blob/master/LICENSE.md | MIT License}
 */

import { GameManager } from "../game-objects/GameManager";
import { EvilCursor } from "../game-objects/EvilCursor";
import { Button } from '../game-objects/Button';
import { DoctorNumbers } from '../game-objects/DoctorNumbers';

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
    this.load.spritesheet('evilCursor', '../assets/EvilCursor.png', {
      frameHeight: 40, frameWidth: 40
    });
    this.load.json('dialogue', 'assets/dialogue.txt');
  }

  create(): void {
    let gameManager = GameManager.getInstance(this);
    // gameManager.createNumberEvilCursor(0, 0, 5);
    // gameManager.createNumberEvilCursor(100, 0, 10);    
    // gameManager.createNumberEvilCursor(200, 0, 15);    
    // gameManager.createNumberEvilCursor(300, 100, 7);    
    // gameManager.createNumberEvilCursor(300, 100, 3);    
    // gameManager.createNumberEvilCursor(300, 200, 6000);    
    // gameManager.createNumberEvilCursor(300, 300, 6000);    
    // gameManager.createNumberEvilCursor(200, 300, 6000);    
    // gameManager.createNumberEvilCursor(100, 300, 6000);    
  }

  update(): void {

  }
}
