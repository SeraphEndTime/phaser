import Phaser = require("phaser");
import HelloWorldScene from "./scene/HelloWorldScene";
import GameScene from "./scene/GameScene";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

const config:Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
    plugins:{
        scene:[{
            key: 'rexUI',
            plugin:UIPlugin,
            mapping:'rexUI'
        }]
    },
	scene: [GameScene,HelloWorldScene]
}

export default new Phaser.Game(config)

