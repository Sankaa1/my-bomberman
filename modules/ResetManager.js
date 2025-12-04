// modules/ResetManager.js
import { config } from "../utils/vars.js";
import LogManager from "../utils/LogManager.js"; // Implémenté ok

export class ResetManager {
    constructor(scene){
        this.scene = scene;
    }
    /**
     * 🔄 Reset général en fonction du contexte
     * @param {string} context - Peut être "new-level", "game-over", "full-reset", "reset-on-death"
     */
    reset(context){
        switch(context) {
            case 'new-level':
                this.resetForNewLevel();
                break;
            case 'game-over':
                this.resetForGameOver();
                break;
            case 'full-reset':
                this.resetAll();
                break;
            case 'reset-on-death':
                this.resetOnDeath();
                break;
            default:
                LogManager.warn("❌ default case dans ResetManager reset() ! ", context); return; // Pas besoin de try-catch le default fait le café
        }
    }

    /**
     * 🎯 Reset pour un NOUVEAU NIVEAU
     * -> On garde les vies et le score, mais on reset les bonus
     */
    resetForNewLevel() {
        try {
            LogManager.log("🔄 Reset pour un nouveau niveau !");
        
            // ✅ Le joueur garde ses bonus
            LogManager.log("✅ Conservation des bonus !");
            
            // Reset de l'état du portail
            this.scene.config.portalSpawned = false;
        } catch (e) {
            LogManager.warn('Exception levée ResetManager -> resetForNewLevel() : ', e);
            return;
        }
    }

    /**
     * ☠ Reset après un GAME OVER
     * -> On réinitialise TOUT
     */
    resetForGameOver() {
        try {
            LogManager.log("☠️ Reset après un Game Over !");
            this.resetAll(); // 🔄 Réinitialise tout (bonus, bombes, vies, etc.)
        } catch (e) {
            LogManager.warn('Exception levée ResetManager -> resetForGameOver() : ', e);
            return;
        }
    }

    /**
     * ☠ Reset après une mort
     * -> On réinitialise TOUT
     */
    resetOnDeath() {
        try {
            LogManager.log("💀 Reset après une mort (mais pas de Game Over) !");
    
            // ✅ Les bonus sont perdus seulement si le joueur meurt
            this.scene.config.extraLifeWon = false;
            this.scene.player.speed = config.player.speed;
            this.scene.config.bomb.size = config.bomb.size;
            this.scene.config.bomb.maxBombs = config.bomb.maxBombs;
        
            LogManager.log("❌ Bonus perdus !");
        } catch (e) {
            LogManager.warn('Exception levée ResetManager -> resetOnDeath() : ', e);
            return;
        }
    }

    /**
     * 🔄 Reset COMPLET - Remet tout à 0 comme au démarrage du jeu
     */
    resetAll() {
        try {
            LogManager.log("🔄 Reset COMPLET du jeu !");
            Object.assign(this.scene.config, config); // Recharge les valeurs par défaut
        
            // Reset du joueur
            this.scene.player.speed = config.player.speed;
            this.scene.config.player.lives = config.player.lives;
        
            // Reset des bombes
            this.scene.config.bomb.size = config.bomb.size;
            this.scene.config.bomb.maxBombs = config.bomb.maxBombs;
        
            // Reset des bonus
            this.scene.config.extraLifeWon = false;
        
            // ✅ Vérification stricte avant de vider les bonus
            if (!this.scene.bonusManager) {
                LogManager.warn("⚠ BonusManager inexistant, recréation...");
                this.scene.bonusManager = new BonusManager(this.scene);
            }
        
            // ✅ Vérifier que le groupe existe avant de tenter `.clear()`
            if (this.scene.bonusManager.group && this.scene.bonusManager.group.children) {
                LogManager.log("✅ Reset des bonus en cours...");
                this.scene.bonusManager.group.clear(true, true);
                LogManager.log("✅ Reset des bonus effectué !");
            } else {
                LogManager.warn("⚠ BonusManager.group inexistant, il sera recréé au redémarrage...");
                this.scene.bonusManager = null; // On le recréera dans BombermanGame.js
            }
        
            LogManager.log("✅ Reset TOTAL effectué !");
        } catch (e) {
            LogManager.warn('Exception levée ResetManager -> resetAll() : ', e);
            return;
        }
    }           
}