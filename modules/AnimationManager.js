// modules/AnimationManager.js
import LogManager from "../utils/LogManager.js";

export class AnimationManager {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.setupGlobalAnimations();
    }

    setupGlobalAnimations() {
        try {
            this.createPlayerAnimations();
            this.createBombAnimations();
            this.createExplosionAnimations();
        } catch (e) {
            LogManager.warn('AnimationManager', 'Exception levée AnimationManager -> setupGlobalAnimations() : ', e);
            return;
        }
    }

    createPlayerAnimations() {
        try {
            const frames = (row, offset = 0) => this.scene.anims.generateFrameNumbers('sprites', {
                start: row * this.config.tilesPerRow + offset,
                end: row * this.config.tilesPerRow + offset + 3
            });
        
            // Vérifie si l'animation existe déjà avant de la créer
            if (!this.scene.anims.exists('up')) this.scene.anims.create({ key: 'up', frames: frames(6, 0), frameRate: 10, repeat: -1 });
            if (!this.scene.anims.exists('right')) this.scene.anims.create({ key: 'right', frames: frames(6, 4), frameRate: 10, repeat: -1 });
            if (!this.scene.anims.exists('down')) this.scene.anims.create({ key: 'down', frames: frames(6, 8), frameRate: 10, repeat: -1 });
            if (!this.scene.anims.exists('left')) this.scene.anims.create({ key: 'left', frames: frames(6, 12), frameRate: 10, repeat: -1 });
        } catch (e) {
            LogManager.warn('AnimationManager', 'Exception levée AnimationManager -> createPlayerAnimations() : ', e);
            return;
        }
    }

    createBombAnimations() {
        try {
            if (this.scene.anims.exists('bomb')) return; // Animation déjà créée
            
            this.scene.anims.create({
                key: 'bomb',
                frames: this.scene.anims.generateFrameNumbers('sprites', {
                    start: 7 * this.config.tilesPerRow + 4,
                    end: 7 * this.config.tilesPerRow + 9
                }),
                frameRate: 3,
                repeat: -1
            });
        } catch (e) {
            LogManager.warn('AnimationManager', 'Exception levée AnimationManager -> createBombAnimations() : ', e);
            return;
        }
    }

    createExplosionAnimations() {
        try {
            const explosionFrames = (row, colOffset = 0) => this.scene.anims.generateFrameNumbers('sprites', {
                start: row * this.config.tilesPerRow + colOffset,
                end: row * this.config.tilesPerRow + colOffset
            });
    
            // Crée les animations d'explosion seulement si elles n'existent pas
            if (!this.scene.anims.exists('explosion-center')) this.scene.anims.create({ key: 'explosion-center', frames: explosionFrames(8, 1), frameRate: 10, repeat: 0 });
            if (!this.scene.anims.exists('explosion-horizontal')) this.scene.anims.create({ key: 'explosion-horizontal', frames: explosionFrames(9, 2), frameRate: 10, repeat: 0 });
            if (!this.scene.anims.exists('explosion-vertical')) this.scene.anims.create({ key: 'explosion-vertical', frames: explosionFrames(8, 0), frameRate: 10, repeat: 0 });
            if (!this.scene.anims.exists('explosion-top')) this.scene.anims.create({ key: 'explosion-top', frames: explosionFrames(7, 0), frameRate: 10, repeat: 0 });
            if (!this.scene.anims.exists('explosion-bottom')) this.scene.anims.create({ key: 'explosion-bottom', frames: explosionFrames(9, 0), frameRate: 10, repeat: 0 });
            if (!this.scene.anims.exists('explosion-left')) this.scene.anims.create({ key: 'explosion-left', frames: explosionFrames(9, 1), frameRate: 10, repeat: 0 });
            if (!this.scene.anims.exists('explosion-right')) this.scene.anims.create({ key: 'explosion-right', frames: explosionFrames(9, 3), frameRate: 10, repeat: 0 });
        } catch (e) {
            LogManager.warn('AnimationManager', 'Exception levée AnimationManager -> createExplosionAnimations() : ', e);
            return;
        }
    }
}
