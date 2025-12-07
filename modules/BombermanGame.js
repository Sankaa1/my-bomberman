// modules/BombermanGame.js
import { gameState } from "../utils/GameState.js";
import { config } from "../utils/vars.js";
import { MapManager } from "./MapManager.js";
import { Player } from "./Player.js";
import { BombManager } from "./BombManager.js";
import { AnimationManager } from "./AnimationManager.js";
import { BonusManager } from "./BonusManager.js";
import { ResetManager } from "./ResetManager.js";
import { HUDManager } from "./HUDManager.js";
import { LevelManager } from "./LevelManager.js";
import { EnemyManager } from "./EnemyManager.js";
import LogManager from "../utils/LogManager.js"; // implémenté ok

export class BombermanGame extends Phaser.Scene {
    constructor() {
        super({ key: "BombermanGame" });
        this.gameState = gameState;
        this.config = config;
        this.isPaused = false;
        this.resetManager = null;
        this.hud = null;
        this.levelManager = null;
        this.enemyManager = null;
    }

    // modules/BombermanGame.js
    preload() {
        try {
            LogManager.log("BombermanGame", "📢 Chargement du fichier bomber_asset.png...");
            this.load.spritesheet('sprites', 'src/img/bomber_asset.png', {
                frameWidth: this.config.tileSize,
                frameHeight: this.config.tileSize
            });
            LogManager.log("BombermanGame", "📢 Sortie de this.load.spritesheet.");
            this.load.once('complete', () => {
                LogManager.log("BombermanGame", "✅ Chargement des assets terminé !");
            });
        } catch (e) {
            LogManager.warn("BombermanGame", "Exception levée BombermanGame -> preload() :", e);
            return;
        }
    }

    create() {
        try {
            LogManager.log('BombermanGame', "📢 Initialisation de la scène...");
            
            // Initialise le LevelManager si ce n'est pas déjà fait
            if (!this.levelManager) {
                this.levelManager = new LevelManager(this);
            }
            
            const levelConfig = this.levelManager.getCurrentLevelConfig();
            LogManager.log('BombermanGame', `🎮 Chargement du niveau ${this.levelManager.currentLevel} - Temps: ${levelConfig.timePerLevel}s`);
            
            this.gameState.reset(); // Remplace config.player.lives
            LogManager.log('BombermanGame', `❤️ Vies réinitialisées: ${this.gameState.lives}`);
        
            this.animationManager = new AnimationManager(this, this.config);
            this.map = new MapManager(this, this.config);
            LogManager.log('BombermanGame', "🟢 Map créée !");
            this.bombs = new BombManager(this, this.config, this.map);
            LogManager.log('BombermanGame', "🟢 Gestion des bombes activée !");
            this.player = new Player(this, 1 * this.config.tileSize, 1 * this.config.tileSize);
            LogManager.log('BombermanGame', "🟢 Joueur initialisé !");
            this.time.delayedCall(100, () => {
                this.setupCamera();
                LogManager.log('BombermanGame', "📸 Caméra configurée !");
            });
            this.setupControls();
        
            /* setTimeout(() => {
                LogManager.log('BombermanGame', "🔄 Recréation des collisions...");
                this.setupCollisions();
            }, 100); */

            this.time.delayedCall(100, () => {
                this.setupCollisions()
                LogManager.log('BombermanGame', "🔗 Collisions configurées !");
            });
    
            this.bombs.enablePlayerCollision();
            
            if (!this.bonusManager) {
                LogManager.log('BombermanGame', "🔄 Recréation du BonusManager après un reset...");
                this.bonusManager = new BonusManager(this);
            }

            // Initialise et spawn les ennemis
            if (!this.enemyManager) {
                this.enemyManager = new EnemyManager(this);
            } else {
                this.enemyManager.clear();
            }
            
            // Nombre d'ennemis augmente avec le niveau (1 + niveau/2)
            const enemyCount = Math.min(1 + Math.floor(this.levelManager.currentLevel / 2), 5);
            this.enemyManager.spawnEnemies(enemyCount, 'random');
            LogManager.log('BombermanGame', `👾 ${enemyCount} ennemi(s) spawnés pour le niveau ${this.levelManager.currentLevel}`);
    
            this.isPaused = false;
            //this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
            this.resetManager = new ResetManager(this);
    
            let gameOverScene = this.scene.get("GameOverScene");
            if (gameOverScene) {
                gameOverScene.setResetManager(this.resetManager);
            } else {
                LogManager.error('BombermanGame', "❌ Impossible de transmettre resetManager à GameOverScene !");
            }
            
            // Initialise le chronomètre du niveau avec la durée appropriée du niveau actuel
            this.levelStartTime = this.time.now; // Temps en ms depuis le démarrage de Phaser
            this.levelDuration = levelConfig.timePerLevel * 1000; // Convertir en ms
            this.timeExpiredFlag = false; // Flag pour éviter d'appeler takeDamage() plusieurs fois
            
            this.hud = new HUDManager(this);
        } catch (e) {
            LogManager.warn('BombermanGame', 'Exception levée BombermanGame -> create() : ', e);
            return;
        }
    }

    setupCamera() {
        try {
            if (!this.player || !this.player.sprite) {
                LogManager.error('BombermanGame', "❌ Erreur: Impossible d'attacher la caméra au joueur !");
                return;
            }
        
            const hudHeight = 50;  // ← Correspond au HUD (hauteur augmentée)
            const gameHeight = this.map.rows * this.config.tileSize;
        
            this.cameras.main
                .startFollow(this.player.sprite, true, 0.1, 0.1)
                .setZoom(this.config.zoomRate)
                .setBounds(0, -hudHeight, this.map.cols * this.config.tileSize, gameHeight + hudHeight); 
                // 🔼 Décale la caméra pour qu'elle ne commence pas au (0,0) mais laisse de la place pour le HUD
        
            this.time.delayedCall(500, () => {
                LogManager.log('BombermanGame', "📸 Caméra ajustée avec un HUD de", hudHeight, "px");
            });
        } catch(e) {
            LogManager.warn('BombermanGame', 'Exception levée BombermanGame -> setupCamera() : ', e);
            return;
        }
    }
        
    setupControls() {
        try {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.bombKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
            LogManager.log('BombermanGame', "🎮 Contrôles initialisés - cursors:", !!this.cursors, "bombKey:", !!this.bombKey, "pauseKey:", !!this.pauseKey);
        } catch (e) {
            LogManager.warn('BombermanGame', 'Exception levée BombermanGame -> setupControls() : ', e);
        }
    }

    setupCollisions() {
        try {
            this.physics.add.collider(this.player.sprite, this.map.walls);
            this.physics.add.collider(this.player.sprite, this.map.obstacles);
            this.physics.add.collider(this.bombs.group, this.map.walls);
            this.physics.add.collider(this.bombs.group, this.map.obstacles);
        } catch (e) {
            LogManager.warn('BombermanGame', 'Exception levée BombermanGame -> setupCollisions() : ', e);
            return;
        }
    }

    update() {
        try {
            // Calcule le temps restant basé sur l'heure écoulée depuis le début du niveau
            const elapsedTime = this.time.now - this.levelStartTime;
            const newTimeRemaining = Math.max(0, this.levelDuration - elapsedTime) / 1000; // Convertir en secondes
            this.gameState.timeRemaining = newTimeRemaining;
            
            // Vérifie si le temps vient d'expirer et appelle takeDamage() une seule fois
            if (newTimeRemaining <= 0 && !this.timeExpiredFlag) {
                LogManager.log('BombermanGame', "⏳ Time's up !");
                this.timeExpiredFlag = true;
                this.player.takeDamage();
            }
            
            if (this.player) {
                this.player.handleMovement(this.cursors);
            } else {
                LogManager.warn('BombermanGame', "🚨 this.player est undefined dans update()");
            }
            
            // Met à jour et gère les ennemis
            if (this.enemyManager) {
                this.enemyManager.update();
                this.enemyManager.checkCollisionWithPlayer(this.player);
            }
            
            if (this.bombKey && Phaser.Input.Keyboard.JustDown(this.bombKey)) {
                this.bombs.placeBomb(this.player.sprite.x, this.player.sprite.y);
            } else if (!this.bombKey) {
                LogManager.warn('BombermanGame', "🚨 this.bombKey est undefined dans update()");
            }
            if (this.pauseKey && Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
                this.scene.launch("PauseScene");
                this.scene.pause();
            } else if (!this.pauseKey) {
                LogManager.warn('BombermanGame', "🚨 this.pauseKey est undefined dans update()");
            }
            this.hud.updateHUD();
        } catch (e) {
            LogManager.warn('BombermanGame', "Exception levée BombermanGame -> update() :", e);
        }
    }
}