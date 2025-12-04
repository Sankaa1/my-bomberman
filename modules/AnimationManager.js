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
        
            this.scene.anims.create({ key: 'up', frames: frames(6, 0), frameRate: 10, repeat: -1 });
            this.scene.anims.create({ key: 'right', frames: frames(6, 4), frameRate: 10, repeat: -1 });
            this.scene.anims.create({ key: 'down', frames: frames(6, 8), frameRate: 10, repeat: -1 });
            this.scene.anims.create({ key: 'left', frames: frames(6, 12), frameRate: 10, repeat: -1 });
        } catch (e) {
            LogManager.warn('AnimationManager', 'Exception levée AnimationManager -> createPlayerAnimations() : ', e);
            return;
        }
    }

    createBombAnimations() {
        try {
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
    
            // 🔥 Explosion centrale
            this.scene.anims.create({ key: 'explosion-center', frames: explosionFrames(8, 1), frameRate: 10, repeat: 0 });
    
            // 🔥 Segments de l'explosion
            this.scene.anims.create({ key: 'explosion-horizontal', frames: explosionFrames(9, 2), frameRate: 10, repeat: 0 });
            this.scene.anims.create({ key: 'explosion-vertical', frames: explosionFrames(8, 0), frameRate: 10, repeat: 0 });
    
            // 🔥 Extrémités (puissance 1 uniquement)
            this.scene.anims.create({ key: 'explosion-top', frames: explosionFrames(7, 0), frameRate: 10, repeat: 0 });
            this.scene.anims.create({ key: 'explosion-bottom', frames: explosionFrames(9, 0), frameRate: 10, repeat: 0 });
            this.scene.anims.create({ key: 'explosion-left', frames: explosionFrames(9, 1), frameRate: 10, repeat: 0 });
            this.scene.anims.create({ key: 'explosion-right', frames: explosionFrames(9, 3), frameRate: 10, repeat: 0 });
        } catch (e) {
            LogManager.warn('AnimationManager', 'Exception levée AnimationManager -> createExplosionAnimations() : ', e);
            return;
        }
    }
}
