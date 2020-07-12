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

    this.load.plugin('rexmovetoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmovetoplugin.min.js', true);
    
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
    this.load.json('shopSettings', 'assets/shopSettings.txt');
  }

  

  create(): void {
    let gameManager = GameManager.getInstance(this);
    // gameManager.getNumber().add(10000);
    // gameManager.createShopEvilCursor(800, 600, 10000);
    // setInterval(() => gameManager.createNumberEvilCursor(0, 0, 1000), 3000);
  }

  update(): void {

  }
}
