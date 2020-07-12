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
    this.load.spritesheet('doctorNumbers', '../assets/ProfessorNumbers.png', {
      frameHeight: 208, frameWidth: 218
    });

    this.load.animation('animations', '../assets/animations.json');
    this.load.json('dialogue', 'assets/dialogue.txt');
  }

  

  create(): void {
    let gameManager = GameManager.getInstance(this);
    gameManager.createNumberEvilCursor(0, 0, 5);
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
