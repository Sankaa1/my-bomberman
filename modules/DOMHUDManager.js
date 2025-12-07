// modules/DOMHUDManager.js
// Gestionnaire du HUD HTML/CSS (en dehors de Phaser)
import LogManager from "../utils/LogManager.js";

export class DOMHUDManager {
    constructor(gameState, levelManager) {
        try {
            this.gameState = gameState;
            this.levelManager = levelManager;
            this.hudContainer = document.getElementById('hud-container');
            
            if (!this.hudContainer) {
                throw new Error("❌ Element #hud-container non trouvé dans le DOM !");
            }
            
            this.createHUDHTML();
            this.cacheElements();
            
            LogManager.log('DOMHUDManager', "🟢 HUD DOM créé avec succès");
        } catch (e) {
            LogManager.warn('DOMHUDManager', "Exception levée DOMHUDManager -> constructor() :", e);
        }
    }
    
    createHUDHTML() {
        // Crée la structure HTML du HUD
        this.hudContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 100%; padding: 0 20px; background-color: rgba(10, 10, 10, 0.95);">
                <!-- Section VIES (Gauche) -->
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #aaaaaa; font-weight: bold; margin-bottom: 3px;">LIVES</div>
                    <div id="hud-lives" style="font-size: 20px; color: #FF6B6B; font-weight: bold;">3 ❤️</div>
                </div>
                
                <!-- Section SCORE (Centre-Gauche) -->
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #aaaaaa; font-weight: bold; margin-bottom: 3px;">SCORE</div>
                    <div id="hud-score" style="font-size: 20px; color: #4ECDC4; font-weight: bold;">00000</div>
                </div>
                
                <!-- Section NIVEAU (Centre-Droit) -->
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #aaaaaa; font-weight: bold; margin-bottom: 3px;">LEVEL</div>
                    <div id="hud-level" style="font-size: 20px; color: #A4D65E; font-weight: bold;">1</div>
                </div>
                
                <!-- Section TEMPS (Droite) -->
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #aaaaaa; font-weight: bold; margin-bottom: 3px;">TIME</div>
                    <div id="hud-timer" style="font-size: 20px; color: #FFE66D; font-weight: bold;">2:00</div>
                </div>
            </div>
        `;
    }
    
    cacheElements() {
        // Cache les références aux éléments du DOM pour une meilleure performance
        this.livesElement = document.getElementById('hud-lives');
        this.scoreElement = document.getElementById('hud-score');
        this.levelElement = document.getElementById('hud-level');
        this.timerElement = document.getElementById('hud-timer');
        
        // Cache les dernières valeurs affichées
        this.lastLives = -1;
        this.lastScore = -1;
        this.lastLevel = -1;
        this.lastTimeRemaining = -1;
    }
    
    update(timeRemaining) {
        try {
            // Mise à jour des vies
            if (this.gameState.lives !== this.lastLives) {
                const livesText = `${this.gameState.lives} ❤️`;
                this.livesElement.textContent = livesText;
                this.lastLives = this.gameState.lives;
                
                // Feedback visuel si santé basse
                if (this.gameState.lives === 1) {
                    this.livesElement.style.color = "#FF1744";
                } else if (this.gameState.lives === 2) {
                    this.livesElement.style.color = "#FF6B6B";
                } else {
                    this.livesElement.style.color = "#FF6B6B";
                }
            }
            
            // Mise à jour du score
            if (this.gameState.score !== this.lastScore) {
                this.scoreElement.textContent = this.gameState.score.toString().padStart(5, "0");
                this.lastScore = this.gameState.score;
            }
            
            // Mise à jour du niveau
            if (this.levelManager) {
                const currentLevel = this.levelManager.currentLevel;
                if (currentLevel !== this.lastLevel) {
                    this.levelElement.textContent = currentLevel.toString();
                    this.lastLevel = currentLevel;
                }
            }
            
            // Mise à jour du temps restant
            const displayTime = Math.max(0, Math.floor(timeRemaining));
            if (displayTime !== this.lastTimeRemaining) {
                const minutes = Math.floor(displayTime / 60);
                const seconds = displayTime % 60;
                this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
                this.lastTimeRemaining = displayTime;
                
                // Feedback visuel si temps faible
                if (displayTime <= 10) {
                    this.timerElement.style.color = "#FF1744";
                } else if (displayTime <= 30) {
                    this.timerElement.style.color = "#FFA500";
                } else {
                    this.timerElement.style.color = "#FFE66D";
                }
            }
        } catch (e) {
            LogManager.warn('DOMHUDManager', "Exception levée DOMHUDManager -> update() :", e);
        }
    }
}
