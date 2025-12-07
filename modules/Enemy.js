// modules/Enemy.js
import LogManager from "../utils/LogManager.js";

export class Enemy {
    constructor(scene, x, y, type = 'purple') {
        try {
            this.scene = scene;
            this.config = scene.config;
            this.type = type; // 'purple' ou 'orange' (différentes IA)
            this.speed = 80; // Vitesse légèrement inférieure au joueur
            this.direction = Phaser.Math.RND.pick(['up', 'down', 'left', 'right']);
            this.lastDirectionChange = 0;
            this.directionChangeInterval = 2000; // Change de direction toutes les 2s
            
            // Frame initial: purple à 5*tilesPerRow (lignes 0-3), orange à 6*tilesPerRow (lignes 4-7)
            const frameOffset = type === 'purple' ? 5 * this.config.tilesPerRow : 6 * this.config.tilesPerRow;
            
            this.sprite = scene.physics.add.sprite(x, y, 'sprites', frameOffset)
                .setSize(12, 12)
                .setOffset(2, 2)
                .setOrigin(0.5);
            
            // Création des animations si elles n'existent pas
            this.createAnimations();
            
            LogManager.log('Enemy', `🟢 Ennemi ${type} créé à (${x}, ${y})`);
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> constructor() :', e);
        }
    }

    createAnimations() {
        try {
            const directions = ['up', 'right', 'down', 'left'];
            const frameOffset = this.type === 'purple' ? 5 : 6;
            const baseFrame = frameOffset * this.config.tilesPerRow;

            // Crée une animation pour chaque direction (4 frames par direction)
            // Spritesheet organisation: ligne 0=up, ligne 1=right, ligne 2=down, ligne 3=left
            directions.forEach((dir, index) => {
                const animKey = `${this.type}-${dir}`;
                if (this.scene.anims.exists(animKey)) return;

                const startFrame = baseFrame + (index * 4);
                this.scene.anims.create({
                    key: animKey,
                    frames: this.scene.anims.generateFrameNumbers('sprites', {
                        start: startFrame,
                        end: startFrame + 3
                    }),
                    frameRate: 8,
                    repeat: -1
                });
            });

            LogManager.log('Enemy', `🎬 Animations créées pour ${this.type} (4 directions, 4 frames chacune)`);
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> createAnimations() :', e);
        }
    }

    update() {
        try {
            // Change de direction aléatoirement ou si coincé
            if (this.scene.time.now - this.lastDirectionChange > this.directionChangeInterval) {
                this.changeDirection();
                this.lastDirectionChange = this.scene.time.now;
            }

            // Essaye de se déplacer (respecte les collisions physiques)
            this.tryMove();
            
            // Joue l'animation correspondant à la direction
            const animKey = `${this.type}-${this.direction}`;
            if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key !== animKey) {
                this.sprite.play(animKey);
            }
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> update() :', e);
        }
    }

    changeDirection() {
        try {
            const directions = ['up', 'right', 'down', 'left'];
            const previousDirection = this.direction;
            
            // Essaye une nouvelle direction aléatoire
            do {
                this.direction = Phaser.Math.RND.pick(directions);
            } while (this.direction === previousDirection && Math.random() < 0.7); // 70% chance de changement
            
            LogManager.log('Enemy', `🔄 Ennemi ${this.type} change de direction: ${previousDirection} → ${this.direction}`);
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> changeDirection() :', e);
        }
    }

    tryMove() {
        try {
            const velocity = this.speed;
            let newVelX = 0;
            let newVelY = 0;
            
            switch (this.direction) {
                case 'up':
                    newVelY = -velocity;
                    break;
                case 'down':
                    newVelY = velocity;
                    break;
                case 'left':
                    newVelX = -velocity;
                    break;
                case 'right':
                    newVelX = velocity;
                    break;
            }
            
            // Applique la vélocité (la physique gérera les collisions avec les obstacles)
            this.sprite.setVelocity(newVelX, newVelY);
        } catch (e) {
            LogManager.warn('Enemy', 'Exception levée Enemy -> tryMove() :', e);
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
