// modules/BonusManager.js
import { config } from "../utils/vars.js";
import LogManager from "../utils/LogManager.js"; // Implémenté ok
import { ResetManager } from "./ResetManager.js";

export class BonusManager {
    constructor(scene){
        this.scene = scene;
        this.config = config;
        this.group = this.scene.physics.add.group(); // Regroupement des bonus
        this.extraLifeWon = config.extraLifeWon; // false par défaut. En entrant dans le niveau on a une chance d'obtenir un 1up
        this.tpr = config.tilesPerRow;
    }

    create() {
        try {
            LogManager.log('BonusManager', "📢 Initialisation de la scène...");
    
            // ✅ Initialisation du ResetManager après l'initialisation des modules
            this.resetManager = new ResetManager(this);
        
            // ✅ Vérifier que bonusManager est bien créé avant de transmettre resetManager
            if (!this.bonusManager) {
                LogManager.warn('BonusManager', "⚠ BonusManager n'est pas encore initialisé !");
            }
        
            // ✅ Transmettre resetManager à GameOverScene
            let gameOverScene = this.scene.get("GameOverScene");
            if (gameOverScene) {
                gameOverScene.setResetManager(this.resetManager);
            } else {
                LogManager.error('BonusManager', "❌ Impossible de transmettre resetManager à GameOverScene !");
            }
        } catch (e) {
            LogManager.warn('BonusManager', 'Exception levée BonusManager -> create() : ', e);
            return;
        }
    }    

    /**
     * 📦 Fait apparaître un bonus avec une certaine probabilité lorsqu'un obstacle est détruit.
     */
    maybeSpawnBonus(x,y){
        try {
            const chance = Math.random();
            if(chance > this.config.bonus.rdmBonus){
                const bonusType = this.getRandomBonusType();
                this.spawnBonus(x, y, bonusType);
            }
        } catch (e) {
            LogManager.warn('BonusManager', 'Exception levée BonusManager -> maybeSpawnBonus() : ', e);
            return;
        }
    }

    /**
     * 🎲 Sélectionne un bonus aléatoire.
     */
    getRandomBonusType(){
        try {
            const types = this.extraLifeWon ? ['speed', 'bomb-power', 'bomb-count'] : ['speed', 'bomb-power', 'bomb-count', 'life-up'] ;
            return types[Math.floor(Math.random() * types.length)];
        } catch (e) {
            LogManager.warn('BonusManager', 'Exception levée BonusManager -> getRandomBonusType() : ', e);
            return;
        }
    }

    /**
     * 🎁 Génère un bonus à une position donnée.
     */
    spawnBonus(x, y, type){
        try {
            let frame;
            switch(type){
                case 'speed': 
                    frame = this.tpr * 8 + 8;
                    break;
                case 'life-up': 
                    frame = this.tpr * 8 + 9; 
                    this.extraLifeWon = true;
                    break;
                case 'bomb-power': frame = this.tpr * 8 + 10;
                    break;
                case 'bomb-count': frame = this.tpr * 8 + 11;
                    break;
            }

            const bonus = this.group.create(x, y, 'sprites', frame).setOrigin(0.5);
            bonus.type = type;

            LogManager.log('BonusManager', `🎁 Bonus apparu: ${type} en (${x}, ${y})`);

            // Détection de la collision
            this.scene.physics.add.overlap(this.scene.player.sprite, bonus, () => {
                this.collectBonus(bonus);
            });
        } catch (e) {
            LogManager.warn('BonusManager', 'Exception levée BonusManager -> spawnBonus() : ', e);
            return;
        }
    }

    /**
     * 🎮 Applique l'effet du bonus au joueur et le détruit.
     */
    collectBonus(bonus){
        let type;
        switch(bonus.type){
            case 'speed':
                //this.scene.player.speed += 30;
                type = 'speed';
                LogManager.log('BonusManager', "🏃‍♂️ Vitesse du joueur augmentée ! Vitesse actuelle: ", this.scene.gameState.playerSpeed);
                break;
            case 'bomb-power': 
                //this.scene.gameState.bombSize += 1;
                type = 'bomb-power';
                LogManager.log('BonusManager', "🔥 Puissance des bombes augmentée ! Puissance actuelle:", this.scene.gameState.bombSize);
                break;
            case 'bomb-count': 
                //this.scene.gameState.maxBombs = Math.max(this.scene.gameState.maxBombs ?? 1, 1) + 1;
                type = 'bomb-count';
                LogManager.log('BonusManager', "💣 Nombre de bombes augmenté ! Bombes actuelles:", this.scene.gameState.maxBombs);
                break;
            case 'life-up':
                //this.scene.gameState.lives += 1;
                LogManager.log('BonusManager', "Nombre de vies augmenté ! Vies actuelles: ", this.scene.gameState.lives);
                type = 'life-up';
                break;
            default:
                LogManager.warn('BonusManager', "❌ default case dans BonusManager collectBonus() ! Valeur passée: ", bonus.type); break; // Pas besoin de try-catch le default fait le café
        }
        this.scene.gameState.applyBonus(type);
        bonus.destroy();
    }

    /**
     * 🎮 On reset les paramètres princpaux à l'entrée d'un nouveau LV ou après un game over
     */
    reset(){
        try {
            this.extraLifeWon = false;
            this.scene.player.speed = this.config.player.speed;
            this.scene.config.bomb.size = this.config.bomb.defaultSize;
            this.scene.config.bomb.maxBombs = this.config.bomb.defaultMaxBombs;
        LogManager.log('BonusManager', "🔄 Reset des bonus !");
        } catch (e) {
            LogManager.warn('BonusManager', 'Exception levée BonusManager -> reset() : ', e);
            return;
        }
    }
}