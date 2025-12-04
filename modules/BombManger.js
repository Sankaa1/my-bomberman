// modules/BombManager.js 🔥
import { gameState } from "../utils/GameState.js";
import { config } from "../utils/vars.js";
import LogManager from "../utils/LogManager.js"; // Implémenté ok

export class BombManager {
    constructor(scene, config, mapManager) {
        this.scene = scene;
        this.config = config;
        this.mapManager = mapManager;

        if (!config) {
            LogManager.error('BombManager', "❌ ERREUR: config est undefined dans BombManager !");
            return;
        }

        this.group = this.scene.physics.add.group();
    }
     /**
      * 🔥 Placement d'une bombe à l'endroit où est le joueur
      * @param {*} playerX 
      * @param {*} playerY 
      * @returns 
      */
    placeBomb(playerX, playerY) {
        try {
            if(this.group.getChildren().length >= this.scene.gameState.maxBombs){
                LogManager.log('BombManager', "❌ Limite de bombes atteinte !");
                return;
            }
            // Convertir la position du joueur en coordonnées de grille
            const tileX = Math.floor(playerX / this.config.tileSize) * this.config.tileSize + this.config.tileSize / 2;
            const tileY = Math.floor(playerY / this.config.tileSize) * this.config.tileSize + this.config.tileSize / 2;
        
            LogManager.log('BombManager', "💣 Debug BombManager | tileX: ", tileX, "tileY: ", tileY);
        
            // Vérifier si une bombe est déjà placée ici
            const existingBomb = this.group.getChildren().find(bomb => bomb.x === tileX && bomb.y === tileY);
            if (existingBomb) {
                LogManager.log('BombManager', "❌ Une bombe est déjà placée ici !");
                return;
            }
        
            // Créer la bombe
            let bomb = this.group.create(tileX, tileY, "sprites", 7 * this.config.tilesPerRow + 4)
                .setOrigin(0.5)
                .setImmovable(true);
        
            if (!bomb) {
                LogManager.error('BombManager', "❌ Erreur lors de la création de la bombe !");
                return;
            }
            
            bomb.isExploding = false;
    
            // Si le joueur est exactement sur la bombe, trouver une position libre
            // Détermine la direction prioritaire en fonction du dernier mouvement du joueur
            let lastDirection = this.scene.player.lastDirection || "down"; // Valeur par défaut (évite undefined)
            let directionOrder = [];
    
            // On définit les priorités de direction en fonction du dernier déplacement
            switch (lastDirection) {
                case "left": 
                    directionOrder = [
                        { dx: -this.config.tileSize, dy: 0 }, // Gauche (priorité)
                        { dx: 0, dy: -this.config.tileSize }, // Haut
                        { dx: 0, dy: this.config.tileSize },  // Bas
                        { dx: this.config.tileSize, dy: 0 }   // Droite
                    ];
                    break;
                case "right":
                    directionOrder = [
                        { dx: this.config.tileSize, dy: 0 },  // Droite (priorité)
                        { dx: 0, dy: -this.config.tileSize }, // Haut
                        { dx: 0, dy: this.config.tileSize },  // Bas
                        { dx: -this.config.tileSize, dy: 0 }  // Gauche
                    ];
                    break;
                case "up":
                    directionOrder = [
                        { dx: 0, dy: -this.config.tileSize }, // Haut (priorité)
                        { dx: -this.config.tileSize, dy: 0 }, // Gauche
                        { dx: this.config.tileSize, dy: 0 },  // Droite
                        { dx: 0, dy: this.config.tileSize }   // Bas
                    ];
                    break;
                case "down":
                default:
                    directionOrder = [
                        { dx: 0, dy: this.config.tileSize },  // Bas (priorité)
                        { dx: -this.config.tileSize, dy: 0 }, // Gauche
                        { dx: this.config.tileSize, dy: 0 },  // Droite
                        { dx: 0, dy: -this.config.tileSize }  // Haut
                    ];
                    break;
            }
    
            // 🔄 On essaie de déplacer le joueur vers une case libre en respectant les priorités
            for (let move of directionOrder) {
                let newX = this.scene.player.sprite.x + move.dx;
                let newY = this.scene.player.sprite.y + move.dy;
    
                let isWall = this.scene.map.walls.getChildren().some(wall =>
                    Math.round(wall.x) === Math.round(newX) && Math.round(wall.y) === Math.round(newY)
                );
    
                let isObstacle = this.scene.map.obstacles.getChildren().some(obs =>
                    Math.round(obs.x) === Math.round(newX) && Math.round(obs.y) === Math.round(newY)
                );
    
                if (!isWall && !isObstacle) {
                    // ✅ Trouvé une case libre, on déplace le joueur et on stoppe la boucle
                    this.scene.player.sprite.x = newX;
                    this.scene.player.sprite.y = newY;
                    LogManager.log('BombManager', "🚶‍♂️ Joueur déplacé hors de la bombe à", newX, newY);
                    break;
                }
            }
        
            LogManager.log('BombManager', "✅ Bombe placée à", tileX, tileY);
        
            // Lancer l'animation
            if (this.scene.anims.exists("bomb")) {
                bomb.play("bomb");
            } else {
                LogManager.error('BombManager', "❌ Animation 'bomb' introuvable !");
            }
        
            // Déclencher l'explosion après un délai
            this.scene.time.delayedCall(this.config.bomb.duration, () => this.explodeBomb(bomb), [], this);
        } catch (e) {
            LogManager.warn('BombManager', 'Exception levée BombManager -> placeBomb() : ', e);
            return;
        }
    }

    /**
     * 🔥 Mécanique de l'explosion de la bombe.
     * @param {*} bomb 
     * @returns 
     */
    explodeBomb(bomb, explodedBombs = new Set()) {
        try {
            if (!this.scene || !bomb.active) return;
            if (!bomb || !bomb.body) {
                LogManager.warn('BombManager', "⚠ Bombe déjà supprimée ou invalide, annulation de l'explosion.");
                return;
            }
            
            if (explodedBombs.has(bomb)) {
                LogManager.log('BombManager', "⚠ Bombe déjà traitée, évitement d'une double explosion.");
                return;
            }
            
            explodedBombs.add(bomb);
            bomb.isExploding = true;
            LogManager.log('BombManager', `💥 BOOM ! Explosion en (${bomb.x}, ${bomb.y})`);
            
            let explosionSize = this.scene.gameState.bombSize; // Fix : utilise gameState
            let comboCount = 0;
            let bombsToExplode = [];
            
            this.spawnExplosion(bomb.x, bomb.y, "explosion-center");
            
            const directions = [
                { dx: 0, dy: -this.config.tileSize, startKey: "explosion-bottom", midKey: "explosion-vertical", endKey: "explosion-top" },
                { dx: 0, dy: this.config.tileSize, startKey: "explosion-top", midKey: "explosion-vertical", endKey: "explosion-bottom" },
                { dx: -this.config.tileSize, dy: 0, startKey: "explosion-right", midKey: "explosion-horizontal", endKey: "explosion-left" },
                { dx: this.config.tileSize, dy: 0, startKey: "explosion-left", midKey: "explosion-horizontal", endKey: "explosion-right" }
            ];
            
            for (let dir of directions) {
                for (let i = 1; i <= explosionSize; i++) {
                    let newX = bomb.x + dir.dx * i;
                    let newY = bomb.y + dir.dy * i;
                    
                    const isWall = this.scene.map.walls.getChildren().some(wall =>
                        Math.round(wall.x) === Math.round(newX) && Math.round(wall.y) === Math.round(newY)
                    );
                    if (isWall) {
                        LogManager.log('BombManager', `🧱 Mur bloquant à (${newX}, ${newY})`);
                        break;
                    }
                    
                    let chainedBomb = this.group.getChildren().find(b =>
                        Math.round(b.x) === Math.round(newX) && Math.round(b.y) === Math.round(newY) && !b.isExploding
                    );
                    if (chainedBomb) {
                        LogManager.log('BombManager', `💣 Bombe chaînée détectée à (${newX}, ${newY})`);
                        bombsToExplode.push(chainedBomb);
                        continue;
                    }
                    
                    let obstacle = this.scene.map.obstacles.getChildren().find(obs =>
                        Math.round(obs.x) === Math.round(newX) && Math.round(obs.y) === Math.round(newY)
                    );
                    if (obstacle) {
                        LogManager.log('BombManager', `🧱 Obstacle détruit à (${newX}, ${newY})`);
                        obstacle.destroy();
                        this.mapManager.checkPortalSpawn();
                        this.scene.bonusManager.maybeSpawnBonus(newX, newY);
                        comboCount++;
                        break;
                    }
                    
                    let explosionKey = (i === explosionSize) ? dir.endKey : dir.midKey;
                    LogManager.log('BombManager', `🔥 Spawn explosion à (${newX}, ${newY}) avec ${explosionKey}`);
                    this.spawnExplosion(newX, newY, explosionKey);
                    this.checkPlayerHit(newX, newY);
                }
            }
            
            this.increaseScore(comboCount);
            bombsToExplode.forEach(b => this.explodeBomb(b, explodedBombs));
            
            if (bomb && bomb.body) {
                LogManager.log('BombManager', `🗑 Suppression de la bombe en (${bomb.x}, ${bomb.y})`);
                bomb.disableBody(true, true);
                this.group.remove(bomb, true, true);
            } else {
                LogManager.warn('BombManager', "⚠ Tentative de suppression d'une bombe déjà supprimée.");
            }
        } catch (e) {
            LogManager.warn('BombManager', 'Exception levée BombManager -> explodeBomb() : ', e);
        }
    }

    increaseScore(combo = 1) {
        try {
            if (combo > 0) { // ✅ Ne pas donner de points si aucun obstacle n'a été détruit
                let points = 100 * combo;
                LogManager.log('BombManager', 'points après * combo: ', points);
                this.scene.gameState.score += points;
                LogManager.log('BombManager', `🎯 Score +${points} (combo x${combo})`);
            }
        } catch (e) {
            LogManager.warn('BombManager', 'Exception levée BombManager -> increaseScore() : ', e);
            return;
        }
    }    

    checkPlayerHit(x, y) {
        try {
            const player = this.scene.player;
            const tileSize = this.config.tileSize;
            
            // 🔥 Vérification améliorée : inclut aussi la case exacte de la bombe
            if (
                (Math.abs(player.sprite.x - x) < tileSize / 2 && player.sprite.y === y) || // Même ligne, X proche
                (Math.abs(player.sprite.y - y) < tileSize / 2 && player.sprite.x === x) || // Même colonne, Y proche
                (Math.round(player.sprite.x) === Math.round(x) && Math.round(player.sprite.y) === Math.round(y)) // Exactement sur la bombe
            ) {
                LogManager.log('BombManager', "🔥 Le joueur est touché par l'explosion !");
                player.takeDamage();
            }
        } catch (e) {
            LogManager.warn('BombManager', 'Exception levée BombManager -> checkPlayerHit() : ', e);
            return;
        }
    }    

    /**
     * 🔥 Vérifie si le joueur est touché par l'explosion
     */
    enablePlayerCollision() {
        try {
            if (!this.scene.player || !this.scene.player.sprite) {
                LogManager.error('BombManager', "❌ Impossible d'activer la collision avec la bombe : le joueur n'est pas encore initialisé !");
                return;
            }
        
            LogManager.log('BombManager', "🚧 Activation de la collision entre le joueur et les bombes");
            
            this.scene.physics.add.collider(this.group, this.scene.player.sprite, (player, bomb) => {
                LogManager.log('BombManager', "🚧 Le joueur est bloqué par une bombe !");
            });
        } catch (e) {
            LogManager.warn('BombManager', 'Exception levée BombManager -> enablePlayerCollision() : ', e);
            return;
        }
    }
    
    /**
    * 🔥 Gère la création et la destruction des explosions
    */
    spawnExplosion(x, y, animationKey) {
        try {
            if (this.scene.anims.exists(animationKey)) {
                let explosion = this.scene.add.sprite(x, y, "sprites").setOrigin(0.5);
                explosion.play(animationKey);
        
                // 💥 Effet de zoom sur l'explosion
                this.scene.tweens.add({
                    targets: explosion,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 100,
                    yoyo: true
                });
        
                this.scene.time.delayedCall(500, () => explosion.destroy(), [], this);
            } else {
                LogManager.error('BombManager', "❌ Animation manquante :", animationKey);
            }
        } catch (e) {
            LogManager.warn('BombManager', 'Exception levée BombManager -> spawnExplosion() : ', e);
            return;
        }
    }
}