// modules/HUDManager.js
import LogManager from "../utils/LogManager.js";

export class HUDManager {
    constructor(scene) {
        try {
            this.scene = scene;
            const width = scene.scale.width;
            this.hudBackground = scene.add.rectangle(0, 0, width, 30, 0x000000, 0.8).setOrigin(0, 0).setScrollFactor(0);
            this.hudContainer = scene.add.container(0, 0).setScrollFactor(0);

            this.livesText = scene.add.text(10, 5, "", { fontSize: "16px", fill: "#FFF" });
            this.scoreText = scene.add.text(width * 0.3, 5, "", { fontSize: "16px", fill: "#FFF" });
            this.timerText = scene.add.text(width * 0.6, 5, "", { fontSize: "16px", fill: "#FFF" });

            this.hudContainer.add([this.hudBackground, this.livesText, this.scoreText, this.timerText]);
            
            // Cache des dernières valeurs affichées pour éviter les mises à jour inutiles
            this.lastLives = -1;
            this.lastScore = -1;
            this.lastTimeRemaining = -1;
            
            this.updateHUD();
            LogManager.log('HUDManager', "🟢 HUDManager créé");
        } catch (e) {
            LogManager.warn('HUDManager', "Exception levée HUDManager -> constructor() :", e);
        }
    }

    updateHUD() {
        try {
            if (!this.scene.gameState) {
                LogManager.warn('HUDManager', "🚨 this.scene.gameState est undefined dans updateHUD()");
                return;
            }
            const { lives, score, timeRemaining } = this.scene.gameState;
            
            // Mise à jour uniquement si les valeurs changent (optimisation)
            if (lives !== this.lastLives) {
                this.livesText.setText(`❤️ Vies: ${lives}`);
                this.lastLives = lives;
            }
            
            if (score !== this.lastScore) {
                this.scoreText.setText(`💣 Score: ${score}`);
                this.lastScore = score;
            }
            
            const displayTime = Math.max(0, Math.floor(timeRemaining));
            if (displayTime !== this.lastTimeRemaining) {
                this.timerText.setText(`⏳ Temps: ${displayTime}`);
                this.lastTimeRemaining = displayTime;
            }
        } catch (e) {
            LogManager.warn('HUDManager', "Exception levée HUDManager -> updateHUD() :", e);
        }
    }
}