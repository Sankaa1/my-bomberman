// utils/GameState.js
import LogManager from "./LogManager.js";
export class GameState {
    constructor(){
        try {
            this.lives = 3;                 // Vies du joueur (peut augmenter 1 seule fois par niveau si tirage chanceux)
            this.score = 0;                 // Score
            this.timeRemaining = 120;       // Temps pour finir le niveau en secondes sinon takeDamage()
            this.maxBombs = 1;              // Nombre max de bombes qu'on peut poser (augmente par bonus)
            this.bombSize = 1;              // Taille de la bombe (augmente par bonus)
            this.playerSpeed = 150;         // Vitesse du joueur (augmente par bonus)
        } catch (e) {
            LogManager.warn('GameState', 'Exception levée GameState -> constructor() : ', e);
            return;
        }
    }

    reset(){ // Sera appelé en cas de game over ou de nouvelle partie
        try {
            this.lives = 3;
            this.score = 0;
            this.timeRemaining = 120;
            this.maxBombs = 1;
            this.bombSize = 1;
            this.playerSpeed = 150;
        } catch (e) {
            LogManager.warn('GameState', 'Exception levée GameState -> reset() : ', e);
            return;
        }
    }

    addScore(points){ // Nommage explicite
        try {
            this.score += points;
        } catch (e) {
            LogManager.warn('GameState', 'Exception levée GameState -> addScore() : ', e);
            return;
        }
    }

    takeDamage(){ // Le joueur est touché (pour l'instant par une bombe, ensuite aussi par un ennemi)   
        try {
            this.lives--;
            return this.lives > 0;
        } catch (e) {
            LogManager.warn('GameState', 'Exception levée GameState -> addScore() : ', e);
            return;
        }
    }

    applyBonus(type){ // Modification des propriétés du joueur en fonction du bonus obtenu
        LogManager.log('GameState', 'applyBonus appelé avec type', type);
        LogManager.log('GameState', 
            'Avant - playerSpeed:', this.playerSpeed, 
            'maxBombs:', this.maxBombs, 
            'bombSize:', this.bombSize,
            'lives:',this.lives
        );
        switch(type) {
            case 'speed': this.playerSpeed += 30; break;
            case 'bomb-power': this.bombSize += 1; break;
            case 'bomb-count': this.maxBombs += 1; break;
            case 'life-up': this.lives += 1; break;
            default: LogManager.warn('GameState', 'Default case GameState -> applyBonus() type envoyé:' , type); break;
        }
        LogManager.log('GameState', 
            'Après - playerSpeed:', this.playerSpeed, 
            'maxBombs:', this.maxBombs, 
            'bombSize:', this.bombSize,
            'lives:',this.lives
        );
    }
}

export const gameState = new GameState();