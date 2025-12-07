// modules/EnemyManager.js
import LogManager from "../utils/LogManager.js";
import { Enemy } from "./Enemy.js";

export class EnemyManager {
    constructor(scene) {
        try {
            this.scene = scene;
            this.config = scene.config;
            this.enemies = [];
            
            LogManager.log('EnemyManager', "🟢 EnemyManager créé");
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> constructor() :', e);
        }
    }

    spawnEnemies(count, type = 'random') {
        try {
            for (let i = 0; i < count; i++) {
                const spawnPos = this.getRandomSpawnPosition();
                const enemyType = type === 'random' 
                    ? Phaser.Math.RND.pick(['purple', 'orange'])
                    : type;
                
                const enemy = new Enemy(this.scene, spawnPos.x, spawnPos.y, enemyType);
                this.enemies.push(enemy);
            }
            
            LogManager.log('EnemyManager', `🟢 ${count} ennemi(s) spawnés`);
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> spawnEnemies() :', e);
        }
    }

    getRandomSpawnPosition() {
        try {
            // Cherche une position aléatoire libre (pas sur un obstacle ou mur)
            let x, y, attempts = 0;
            const maxAttempts = 10;
            
            do {
                x = Phaser.Math.RND.integerInRange(3, this.config.cols - 4);
                y = Phaser.Math.RND.integerInRange(3, this.config.rows - 4);
                attempts++;
            } while (this.isPositionBlocked(x, y) && attempts < maxAttempts);
            
            return {
                x: x * this.config.tileSize + this.config.tileSize / 2,
                y: y * this.config.tileSize + this.config.tileSize / 2
            };
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> getRandomSpawnPosition() :', e);
            return { x: 100, y: 100 }; // Fallback
        }
    }

    isPositionBlocked(gridX, gridY) {
        try {
            // Vérifie si la position est bloquée par un mur ou obstacle
            const walls = this.scene.map.walls.getChildren();
            const obstacles = this.scene.map.obstacles.getChildren();
            
            const checkPosition = (group) => {
                return group.some(obj => {
                    const objGridX = Math.floor(obj.x / this.config.tileSize);
                    const objGridY = Math.floor(obj.y / this.config.tileSize);
                    return objGridX === gridX && objGridY === gridY;
                });
            };
            
            return checkPosition(walls) || checkPosition(obstacles);
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> isPositionBlocked() :', e);
            return false;
        }
    }

    update() {
        try {
            // Met à jour chaque ennemi
            this.enemies.forEach(enemy => {
                if (enemy && enemy.sprite && enemy.sprite.active) {
                    enemy.update();
                }
            });
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> update() :', e);
        }
    }

    checkCollisionWithPlayer(player) {
        try {
            this.enemies.forEach((enemy, index) => {
                if (!enemy || !enemy.sprite || !enemy.sprite.active) {
                    this.enemies.splice(index, 1);
                    return;
                }

                const distance = Phaser.Math.Distance.Between(
                    player.sprite.x,
                    player.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );

                // Collision si distance < 16 pixels (une tuile)
                if (distance < 16) {
                    LogManager.log('EnemyManager', `💥 Le joueur a touché un ennemi !`);
                    player.takeDamage();
                }
            });
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> checkCollisionWithPlayer() :', e);
        }
    }

    killEnemyAt(x, y, radius = 40) {
        try {
            // Tue les ennemis dans un rayon (pour les explosions)
            const killed = [];
            
            this.enemies = this.enemies.filter(enemy => {
                if (!enemy || !enemy.sprite) return false;

                const distance = Phaser.Math.Distance.Between(
                    x, y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );

                if (distance < radius) {
                    LogManager.log('EnemyManager', `💥 Ennemi ${enemy.type} tué par explosion !`);
                    enemy.takeDamage();
                    this.scene.gameState.addScore(100); // Bonus de points
                    killed.push(enemy);
                    return false; // Retire du tableau
                }

                return true;
            });

            return killed.length;
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> killEnemyAt() :', e);
            return 0;
        }
    }

    clear() {
        try {
            this.enemies.forEach(enemy => {
                if (enemy) enemy.destroy();
            });
            this.enemies = [];
            LogManager.log('EnemyManager', "🗑️ Tous les ennemis supprimés");
        } catch (e) {
            LogManager.warn('EnemyManager', 'Exception levée EnemyManager -> clear() :', e);
        }
    }

    getCount() {
        return this.enemies.filter(e => e && e.sprite && e.sprite.active).length;
    }
}
