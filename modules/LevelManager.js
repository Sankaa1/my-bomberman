// modules/LevelManager.js
import LogManager from "../utils/LogManager.js";
import { config } from "../utils/vars.js";

export class LevelManager {
    constructor(scene) {
        try {
            this.scene = scene;
            this.currentLevel = 1;
            this.maxLevels = 10; // Nombre max de niveaux

            // Définit les paramètres de difficulté pour chaque niveau
            this.levelConfigs = this.generateLevelConfigs();
            
            LogManager.log('LevelManager', `🎮 LevelManager créé - Niveau ${this.currentLevel}`);
        } catch (e) {
            LogManager.warn('LevelManager', 'Exception levée LevelManager -> constructor() :', e);
        }
    }

    generateLevelConfigs() {
        try {
            const configs = {};
            
            // Génère les configs pour chaque niveau avec progression de difficulté
            for (let level = 1; level <= this.maxLevels; level++) {
                // La difficulté augmente : moins de temps, plus d'obstacles
                const baseTime = config.timePerLevel; // 120s
                const timeReduction = (level - 1) * 10; // -10s par niveau (min 30s)
                const timePerLevel = Math.max(30, baseTime - timeReduction);
                
                const baseSpawnRate = config.mapSpawnRate; // 0.7
                const spawnRateIncrease = (level - 1) * 0.05; // +5% d'obstacles par niveau
                const mapSpawnRate = Math.min(0.95, baseSpawnRate + spawnRateIncrease);
                
                configs[level] = {
                    level: level,
                    timePerLevel: timePerLevel,
                    mapSpawnRate: mapSpawnRate,
                    difficulty: this.calculateDifficulty(level)
                };
            }
            
            return configs;
        } catch (e) {
            LogManager.warn('LevelManager', 'Exception levée LevelManager -> generateLevelConfigs() :', e);
            return {};
        }
    }

    calculateDifficulty(level) {
        try {
            if (level <= 2) return 'EASY';
            if (level <= 5) return 'MEDIUM';
            if (level <= 8) return 'HARD';
            return 'INSANE';
        } catch (e) {
            LogManager.warn('LevelManager', 'Exception levée LevelManager -> calculateDifficulty() :', e);
            return 'UNKNOWN';
        }
    }

    getCurrentLevelConfig() {
        try {
            const levelConfig = this.levelConfigs[this.currentLevel];
            if (!levelConfig) {
                LogManager.error('LevelManager', `❌ Config non trouvée pour le niveau ${this.currentLevel}`);
                return this.levelConfigs[1]; // Fallback au niveau 1
            }
            return levelConfig;
        } catch (e) {
            LogManager.warn('LevelManager', 'Exception levée LevelManager -> getCurrentLevelConfig() :', e);
            return this.levelConfigs[1];
        }
    }

    nextLevel() {
        try {
            if (this.currentLevel < this.maxLevels) {
                this.currentLevel++;
                LogManager.log('LevelManager', `📈 Passage au niveau ${this.currentLevel}`);
                return true; // Niveau suivant existe
            } else {
                LogManager.log('LevelManager', "🏆 Tous les niveaux complétés !");
                return false; // Pas de niveau suivant
            }
        } catch (e) {
            LogManager.warn('LevelManager', 'Exception levée LevelManager -> nextLevel() :', e);
            return false;
        }
    }

    reset() {
        try {
            this.currentLevel = 1;
            LogManager.log('LevelManager', "🔄 LevelManager réinitialisé");
        } catch (e) {
            LogManager.warn('LevelManager', 'Exception levée LevelManager -> reset() :', e);
        }
    }

    isLastLevel() {
        return this.currentLevel >= this.maxLevels;
    }

    getProgress() {
        return `${this.currentLevel}/${this.maxLevels}`;
    }
}
