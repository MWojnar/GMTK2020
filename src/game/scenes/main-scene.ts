/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      {@link https://github.com/digitsensitive/phaser3-typescript/blob/master/LICENSE.md | MIT License}
 */

import { GameManager } from "../game-objects/GameManager";
import { EvilCursor } from "../game-objects/EvilCursor";
import { Button } from '../game-objects/Button';
import { DoctorNumbers } from '../game-objects/DoctorNumbers';
import { Animations } from "phaser";
import { NumberPolice } from "../game-objects/NumberPolice";

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  
  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    
    /* Can we load spritesheets from json like animations? */
    this.load.spritesheet('background', '../assets/Background.png', {
      frameHeight: 720, frameWidth: 1080
    });
    this.load.spritesheet('button', '../assets/GMTK2020button.png', {
      frameHeight: 60, frameWidth: 140
    });
    this.load.spritesheet('evilCursor', '../assets/GMTK2020evilcursor.png', {
      frameHeight: 64, frameWidth: 64
    });
    this.load.spritesheet('numberPolice', '../assets/GMTK2020numberpolice.png', {
      frameHeight: 128, frameWidth: 128
    });
    this.load.spritesheet('doctorNumbers', '../assets/DoctorNumbers.png', {
      frameHeight: 240, frameWidth: 360
    });

    this.load.animation('animations', '../assets/animations.json');
    this.load.json('dialogue', 'assets/dialogue.txt');
  }

  

  create(): void {
    let gameManager = GameManager.getInstance(this);
    gameManager.createNumberEvilCursor(0, 0, 5);
    // setInterval(this.createRandomThings.bind(this), 2000);
  }

  /* Just testing */
  private createRandomThings(): void {
    let gameManager = GameManager.getInstance(this);
    let rect = new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height);
    let sides: Phaser.Geom.Point[] = [ rect.getLineA().getRandomPoint(), rect.getLineB().getRandomPoint(), rect.getLineC().getRandomPoint(), rect.getLineD().getRandomPoint() ];
    let randomSide = Math.round(Math.random() * 3);
    let randomPoint: Phaser.Geom.Point = sides[randomSide];
    let randomInt = Math.round(Math.random() * 2)
    switch (randomInt) {
      case 0:
        break;
      case 1:
        gameManager.createNumberEvilCursor(randomPoint.x, randomPoint.y, 5);
        break;
      case 2:
        new NumberPolice(this, randomPoint.x, randomPoint.y, 'numberPolice', 10, 20);
        break;
    }
  }

  update(): void {

  }
}
