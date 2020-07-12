/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      {@link https://github.com/digitsensitive/phaser3-typescript/blob/master/LICENSE.md | MIT License}
 */

import "phaser";
import { MainScene } from "./scenes/main-scene";
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
  width: 1080,
  height: 720,
  type: Phaser.AUTO,
  parent: "game",
  scene: MainScene,
  backgroundColor: '#999999',
  plugins: {
    global: [{
      key: 'rexMoveTo',
      plugin: MoveToPlugin,
      start: true
    }]
  }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  const game = new Game(config);
});
