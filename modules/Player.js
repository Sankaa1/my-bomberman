// modules/Player.js
import { config } from "../utils/vars.js";
import LogManager from "../utils/LogManager.js"; // Implémenté ok

export class Player {
    constructor(scene, x, y) {
        try {
            if (!config) {
                LogManager.error('Player', "❌ ERREUR: config est undefined dans Player !");
                return;
            }
            if (!scene.gameState) {
                LogManager.error('Player', "❌ ERREUR: scene.gameState est undefined dans Player !");
                return;
            }
            
            this.config = config;
            this.scene = scene;
            this.speed = this.scene.gameState.playerSpeed;
            this.isMoving = false;
    
            LogManager.log('Player', "🔍 Création du joueur avec config:", this.config);

            this.sprite = scene.physics.add.sprite(
                this.config.player.startX * this.config.tileSize,
                this.config.player.startY * this.config.tileSize, 
                'sprites', 
                6 * this.config.tilesPerRow + 8
            )
                .setSize(12, 12)
                .setOffset(2, 2)
                .setOrigin(0.5)
                .setCollideWorldBounds(true);
            
            /* this.sprite = scene.physics.add.sprite(x, y, 'sprites', 6 * this.config.tilesPerRow + 8)
                .setSize(12, 12)
                .setOffset(2, 2)
                .setOrigin(0.5)
                .setCollideWorldBounds(true); */

            LogManager.log('Player', "📍 Position initiale du joueur - X:", this.sprite.x, "Y:", this.sprite.y);
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> constructor() : ', e);
            return;
        }
    }

    handleMovement(cursors) {
        try {
            if (!this.sprite) {
                LogManager.warn('Player', "🚨 this.sprite est undefined dans handleMovement()");
                return;
            }
            if (!cursors) {
                LogManager.warn('Player', "🚨 cursors est undefined dans handleMovement()");
                return;
            }
            this.speed = this.scene.gameState.playerSpeed;
            const body = this.sprite.body;
            body.setVelocity(0);
        
            if (cursors.left.isDown) {
                this.tryMoveHorizontal(-this.speed, 'left');
                return;
            } 
            if (cursors.right.isDown) {
                this.tryMoveHorizontal(this.speed, 'right');
                return;
            }
            if (cursors.up.isDown) {
                this.tryMoveVertical(-this.speed, 'up');
                return;
            }
            if (cursors.down.isDown) {
                this.tryMoveVertical(this.speed, 'down');
                return;
            }
            this.snapToGridX();
            this.snapToGridY();
            this.sprite.anims.stop();
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> handleMovement() : ', e);
        }
    }
    
    takeDamage() {
        try {
            if (this.scene.gameState.takeDamage()) {
                LogManager.log('Player', `💔 Le joueur a été touché ! Vies restantes: ${this.scene.gameState.lives}`);
                this.scene.tweens.add({
                    targets: this.sprite,
                    alpha: 0,
                    duration: 100,
                    yoyo: true,
                    repeat: 5
                });
                this.scene.time.delayedCall(1000, () => this.respawn(), [], this);
            } else {
                this.gameOver();
            }
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> takeDamage() : ', e);
        }
    }

    respawn() {
        try {
            LogManager.log('Player', "🔄 Respawn du joueur...");
            this.sprite.setAlpha(0);
            /* this.sprite.setPosition(
                1 * this.config.tileSize, // Hardcodé temporairement, à gérer ailleurs si besoin
                1 * this.config.tileSize
            ); */

            this.sprite.setPosition(
                this.config.player.startX * this.config.tileSize,
                this.config.player.startY * this.config.tileSize
            );

            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 1,
                duration: 500
            });
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> respawn() : ', e);
        }
    }

    gameOver() {
        try {
            LogManager.log('Player', "☠️ GAME OVER !");
            this.sprite.setVelocity(0, 0);
            this.scene.physics.world.remove(this.sprite);
            this.scene.time.delayedCall(1000, () => {
                this.scene.scene.start("GameOverScene");
            });
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> gameOver() : ', e);
        }
    }

    /** Partie inchangée pour l'instant */

    isAlignedHorizontally() {
        try {
            return Math.round(this.sprite.x) % this.config.tileSize === this.config.tileSize / 2;
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> isAlignedHorizontally() : ', e);
            return;
        }
    }
    
    isAlignedVertically() {
        try {
            return Math.round(this.sprite.y) % this.config.tileSize === this.config.tileSize / 2;
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> isAlignedVertically() : ', e);
            return;
        }
    }
    
    tryMoveHorizontal(speed, anim) {
        try {
            if (this.isAlignedVertically()) {
                this.snapToGridY(); // Alignement sur la grille avant déplacement
                this.sprite.setVelocityX(speed);
                this.sprite.anims.play(anim, true); // 🔥 Nouvelle animation liée
                this.lastDirection = speed > 0 ? "right" : "left"; // Stocke la direction
            }
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> tryMoveHorizontal() : ', e);
            return;
        }
    }
        
    tryMoveVertical(speed, anim) {
        try {
            if (this.isAlignedHorizontally()) {
                this.snapToGridX(); // Alignement horizontal forcé
                this.sprite.setVelocityY(speed);
                this.sprite.anims.play(anim, true); // 🔥 Nouvelle animation liée
                this.lastDirection = speed > 0 ? "down" : "up"; // Stocke la direction
            }
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> tryMoveVertical() : ', e);
            return;
        }
    }        
    
    snapToGridX() {
        try {
            const tileIndex = Math.floor(this.sprite.x / this.config.tileSize);
            const snapX = tileIndex * this.config.tileSize + this.config.tileSize / 2;
            this.sprite.x = snapX;
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> snapToGridX() : ', e);
            return;
        }
    }
    
    snapToGridY() {
        try {
            const tileIndex = Math.floor(this.sprite.y / this.config.tileSize);
            const snapY = tileIndex * this.config.tileSize + this.config.tileSize / 2;
            this.sprite.y = snapY;
        } catch (e) {
            LogManager.warn('Player', 'Exception levée Player -> snapToGridY() : ', e);
            return;
        }
    }
    
    get tileX() { return Math.floor(this.sprite.x / this.config.tileSize); }
    get tileY() { return Math.floor(this.sprite.y / this.config.tileSize); }
}