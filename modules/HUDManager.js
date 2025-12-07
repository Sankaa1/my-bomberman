// modules/HUDManager.js
import LogManager from "../utils/LogManager.js";

export class HUDManager {
    constructor(scene) {
        try {
            this.scene = scene;
            const width = scene.scale.width;
            const hudHeight = 50;
            
            // Fond simple rectangle - centré
            this.hudBackground = scene.add.rectangle(width / 2, 0, width, hudHeight, 0x0a0a0a, 0.95)
                .setOrigin(0.5, 0)
                .setScrollFactor(0)
                .setDepth(1000); // Très élevé pour rester au-dessus

            // Section VIES (Gauche) - 25% de la largeur
            const leftX = width * 0.17;
            
            this.livesLabel = scene.add.text(leftX, 8, "LIVES", { 
                fontSize: "10px", 
                fill: "#aaaaaa",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001).setY(8);
            
            this.livesText = scene.add.text(leftX, 22, "", { 
                fontSize: "20px", 
                fill: "#FF6B6B",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);

            // Section SCORE (Centre) - 50% de la largeur
            const centerX = width * 0.5;
            
            this.scoreLabel = scene.add.text(centerX, 8, "SCORE", { 
                fontSize: "10px", 
                fill: "#aaaaaa",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
            
            this.scoreText = scene.add.text(centerX, 22, "", { 
                fontSize: "20px", 
                fill: "#4ECDC4",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);

            // Section TEMPS (Droite) - 75% de la largeur
            const rightX = width * 0.83;
            
            this.timerLabel = scene.add.text(rightX, 8, "TIME", { 
                fontSize: "10px", 
                fill: "#aaaaaa",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
            
            this.timerText = scene.add.text(rightX, 22, "", { 
                fontSize: "20px", 
                fill: "#FFE66D",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);

            // Section NIVEAU (entre score et temps)
            const levelX = width * 0.67;
            
            this.levelLabel = scene.add.text(levelX, 8, "LEVEL", { 
                fontSize: "10px", 
                fill: "#aaaaaa",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
            
            this.levelText = scene.add.text(levelX, 22, "", { 
                fontSize: "20px", 
                fill: "#A4D65E",
                fontFamily: "Arial",
                fontStyle: "bold"
            }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
            
            // Cache des dernières valeurs affichées pour éviter les mises à jour inutiles
            this.lastLives = -1;
            this.lastScore = -1;
            this.lastTimeRemaining = -1;
            this.lastLevel = -1;
            this.hudHeight = hudHeight;
            
            this.updateHUD();
            LogManager.log('HUDManager', "🟢 HUDManager créé avec nouveau design");
            // Debug: expose positions and sizes
            try {
                LogManager.log('HUDManager', `debug: hudHeight=${this.hudHeight}, canvasWidth=${width}`);
                LogManager.log('HUDManager', `debug: hudBackground @ (${this.hudBackground.x}, ${this.hudBackground.y}) origin=${this.hudBackground.originX},${this.hudBackground.originY}`);
                LogManager.log('HUDManager', `debug: livesLabel @ (${this.livesLabel.x}, ${this.livesLabel.y}), livesText @ (${this.livesText.x}, ${this.livesText.y})`);
            } catch (e) {
                LogManager.warn('HUDManager', 'Exception debug HUD logging :', e);
            }
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
                this.livesText.setText(`${lives} ❤️`);
                this.lastLives = lives;
                
                // Feedback visuel si santé basse
                if (lives === 1) {
                    this.livesText.setFill("#FF1744");
                } else if (lives === 2) {
                    this.livesText.setFill("#FF6B6B");
                } else {
                    this.livesText.setFill("#FF6B6B");
                }
            }
            
            if (score !== this.lastScore) {
                this.scoreText.setText(score.toString().padStart(5, "0"));
                this.lastScore = score;
            }

            // Mise à jour du numéro de niveau
            if (this.scene.levelManager) {
                const currentLevel = this.scene.levelManager.currentLevel;
                if (currentLevel !== this.lastLevel) {
                    this.levelText.setText(currentLevel.toString());
                    this.lastLevel = currentLevel;
                }
            }
            
            const displayTime = Math.max(0, Math.floor(timeRemaining));
            if (displayTime !== this.lastTimeRemaining) {
                const minutes = Math.floor(displayTime / 60);
                const seconds = displayTime % 60;
                this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, "0")}`);
                this.lastTimeRemaining = displayTime;
                
                // Feedback visuel si temps faible
                if (displayTime <= 10) {
                    this.timerText.setFill("#FF1744");
                } else if (displayTime <= 30) {
                    this.timerText.setFill("#FFA500");
                } else {
                    this.timerText.setFill("#FFE66D");
                }
            }
        } catch (e) {
            LogManager.warn('HUDManager', "Exception levée HUDManager -> updateHUD() :", e);
        }
    }
}
