// modules/Enemy.js
import LogManager from "../utils/LogManager.js";

export class Enemy {
    constructor(scene, x, y, type = 'purple') {
        try {
            this.scene = scene;
            this.config = scene.config;
            this.type = type; // 'purple' ou 'orange' (différentes IA)
            this.speed = 100; // Vitesse de base
            this.direction = Phaser.Math.RND.pick(['up', 'down', 'left', 'right']);
            this.isMoving = false;
            this.lastDirectionChange = 0;
            this.directionChangeInterval = 2000; // Change de direction toutes les 2s
            
            // Sélectionne le frame initial basé sur le type
            const frameOffset = type === 'purple' ? 5 * this.config.tilesPerRow : 6 * this.config.tilesPerRow;
            
            this.sprite = scene.physics.add.sprite(x, y, 'sprites', frameOffset)
                .setSize(12, 12)
                .setOffset(2, 2)
                .setOrigin(0.5)
                .setCollideWorldBounds(true);
            
            // Création des animations si elles n'existent pas
            this.createAnimations();
            
            LogManager.log('Enemy', `🟢 Ennemi ${type} créé à (${x}, ${y})`);
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> constructor() :', e);
        }
    }

    createAnimations() {
        try {
            if (this.scene.anims.exists(`${this.type}-walk`)) {
                return; // Animations déjà créées
            }

            const frameOffset = this.type === 'purple' ? 5 : 6;
            const startFrame = frameOffset * this.config.tilesPerRow;

            // Animation de marche pour ce type d'ennemi
            this.scene.anims.create({
                key: `${this.type}-walk`,
                frames: this.scene.anims.generateFrameNumbers('sprites', {
                    start: startFrame,
                    end: startFrame + 7
                }),
                frameRate: 10,
                repeat: -1
            });

            LogManager.log('Enemy', `🎬 Animation créée pour ${this.type}-walk`);
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> createAnimations() :', e);
        }
    }

    update() {
        try {
            // Change de direction aléatoirement
            if (this.scene.time.now - this.lastDirectionChange > this.directionChangeInterval) {
                this.changeDirection();
                this.lastDirectionChange = this.scene.time.now;
            }

            // Applique le mouvement selon la direction
            this.applyMovement();
            
            // Joue l'animation
            if (!this.sprite.anims.isPlaying) {
                this.sprite.play(`${this.type}-walk`);
            }
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> update() :', e);
        }
    }

    changeDirection() {
        try {
            const directions = ['up', 'down', 'left', 'right'];
            // Favorise les changements de direction
            this.direction = Phaser.Math.RND.pick(directions);
            LogManager.log('Enemy', `🔄 Ennemi ${this.type} change de direction : ${this.direction}`);
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> changeDirection() :', e);
        }
    }

    applyMovement() {
        try {
            const velocity = this.speed;
            
            switch (this.direction) {
                case 'up':
                    this.sprite.setVelocity(0, -velocity);
                    break;
                case 'down':
                    this.sprite.setVelocity(0, velocity);
                    break;
                case 'left':
                    this.sprite.setVelocity(-velocity, 0);
                    break;
                case 'right':
                    this.sprite.setVelocity(velocity, 0);
                    break;
                default:
                    this.sprite.setVelocity(0, 0);
            }
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> applyMovement() :', e);
        }
    }

    takeDamage() {
        try {
            LogManager.log('Enemy', `💥 Ennemi ${this.type} détruit !`);
            this.sprite.destroy();
            return true;
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> takeDamage() :', e);
            return false;
        }
    }

    destroy() {
        try {
            if (this.sprite) {
                this.sprite.destroy();
            }
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> destroy() :', e);
        }
    }
}
