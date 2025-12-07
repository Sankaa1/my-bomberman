// main.js
import LogManager from "./utils/LogManager.js";
import { config } from "./utils/vars.js";
import { BombermanGame } from "./modules/BombermanGame.js";
import { PauseScene } from "./scenes/PauseScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";

// Phaser is now available globally from CDN (loaded in index.html)
// eslint-disable-next-line no-undef
const phaserConfig = {
    type: Phaser.AUTO,
    width: config.cols * config.tileSize,   // Largeur en pixels
    height: config.rows * config.tileSize,  // Hauteur en pixels
    scale: { 
        mode: Phaser.Scale.FIT,             // Ajuste la taille à l'écran
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
    render: { 
        pixelArt: true,                     // Style pixel art ❤️
        antialias: false                    // Désactive l'antialiasing
    },
    physics: {
        default: "arcade",                  // Moteur physique Arcade ❤️
        arcade: { 
            debug: false,                   // Interrupteur à bascule mode debug
            gravity: { y: 0 },              // Pas de gravité
            tileBias: 16                    // Empêche le blocage dans les murs
        }
    },
    scene: [
        BombermanGame,                      // Scène principale 
        PauseScene,                         // Scène de pause
        GameOverScene,
    ]
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(phaserConfig);

//LogManager.toggleAllDebug(config.debug); // Initialise avec la valeur de config false-> Pas de log
// Zoom sur un script pour débug -> Seuls les logs du fichier
LogManager.toggleAllDebug(false);
LogManager.toggleDebug('BombermanGame', true); // Sniper activé
LogManager.toggleDebug('Player', true)