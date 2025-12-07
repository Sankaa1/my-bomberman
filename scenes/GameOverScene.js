// GameOverScene.js
import LogManager from "../utils/LogManager.js";
import { config } from "../utils/vars.js";

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameOverScene" });
        this.resetManager = null; // 🔄 On l'initialise plus tard
    }

    setResetManager(resetManager) {
        try {
            this.resetManager = resetManager; // ✅ Stocke resetManager
        } catch (e) {
            LogManager.warn('GameOverScene', 'Exception levée GameOverScene -> setResetManager() : ', e);
            return;
        }
    }

    create() {
        try {
            LogManager.log('GameOverScene', '☠ GAME OVER ☠');

            // Récupère les dimensions du canvas
            const centerX = this.scale.width / 2;
            const centerY = this.scale.height / 2;
            const sceneConfig = config.gameOverScene;

            // Titre "GAME OVER" centré
            this.add.text(centerX, centerY + sceneConfig.titleYOffset, "GAME OVER", {
                fontSize: sceneConfig.titleFontSize,
                fill: sceneConfig.titleColor
            }).setOrigin(0.5, 0.5); // Centre le texte sur son pivot

            // Instructions centré sous le titre
            this.add.text(centerX, centerY + sceneConfig.titleYOffset + sceneConfig.instructionYOffset, "Press SPACE to Restart", {
                fontSize: sceneConfig.instructionFontSize,
                fill: sceneConfig.instructionColor
            }).setOrigin(0.5, 0.5); // Centre le texte sur son pivot

            this.input.keyboard.on("keydown-SPACE", () => {
                LogManager.log('GameOverScene', '🔄 Redémarrage du jeu !');
                if (this.resetManager) {
                    this.resetManager.reset("game-over"); // ✅ Reset total avant restart
                } else {
                    LogManager.error('GameOverScene', '❌ resetManager est introuvable !');
                }
                this.scene.start("BombermanGame"); // ✅ Recharge le jeu
            });
        } catch (e) {
            LogManager.warn('GameOverScene', 'Exception levée GameOverScene -> create() : ', e);
            return;
        }
    }
}