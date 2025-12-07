// modules/MapManager.js
import LogManager from "../utils/LogManager.js"; // Implémenté ok
export class MapManager {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        
        this.tileSize = config.tileSize;
        this.cols = config.cols;
        this.rows = config.rows;
        
        this.initGroups();
        this.generate();

        this.scene.cameras.main.setBackgroundColor(this.config.backgroundColor);
    }

    initGroups(){
        try {
            this.walls = this.scene.physics.add.staticGroup({
                classType: Phaser.GameObjects.Sprite,
                createCallback: (obj) => {
                    obj.setData('type', 'wall');
                }
            });
    
            this.obstacles = this.scene.physics.add.staticGroup({
                classType: Phaser.GameObjects.Sprite,
                createCallback: (obj) => {
                    obj.setData('type', 'obstacle');
                }
            });
        } catch (e) {
            LogManager.warn('Exception levée MapManager -> initGroups() : ', e);
            return;
        }
    }

    generate() {
        try {
            this.generateBorders();
            this.generateInternalBlocks();
            this.generateSafeZones();
            LogManager.log("🟢 Vérification MapManager | walls:", this.walls.getChildren().length, "murs et", this.obstacles.getChildren().length, "obstacles.");
        } catch (e) {
            LogManager.warn('Exception levée MapManager -> generate() : ', e);
            return;
        }
    }

    generateBorders(){
        try {
            const tp = this.config.tilesPerRow;
            const borderFrames = {
                corner: 10 * tp + 4,
                left: 14 * tp + 1,
                top: 14 * tp + 2,
                right: 14 * tp + 3,
                bottom: 14 * tp
            };
            LogManager.log("MapManager", `🔲 Génération des bordures - hudHeight: ${this.hudHeight}px`);
            let borderCount = 0;
            
            //Génération des murs extérieurs
            for(let x = 0; x < this.cols; x++) {
                for(let y = 0; y < this.rows; y++) {
                    if(x === 0 || y === 0 || x === this.cols - 1 || y === this.rows - 1) {
                        let frame;
                            if(
                                (x === 0 && y === 0) ||
                                (x === this.cols - 1 && y === 0) ||
                                (x === 0 && y === this.rows - 1) ||
                                (x === this.cols - 1 && y === this.rows - 1))
                                frame = borderFrames.corner;
                        else if(x === 0) frame = borderFrames.left;
                        else if(y === 0) frame = borderFrames.top;
                        else if(x === this.cols - 1) frame = borderFrames.right;
                        else frame = borderFrames.bottom;

                        this.createWall(x, y, frame);
                        borderCount++;
                    }
                }
            }
            LogManager.log("MapManager", `✅ Bordures générées: ${borderCount} murs`);
        } catch (e) {
            LogManager.warn('MapManager', 'Exception levée MapManager -> generateBorders() : ', e);
            return;
        }
    }

    generateInternalBlocks(){
        // Génération des blocs internes
        try {
            // Récupère le spawn rate du niveau actuel
            let spawnRate = 0.7; // Valeur par défaut
            if (this.scene.levelManager) {
                const levelConfig = this.scene.levelManager.getCurrentLevelConfig();
                spawnRate = levelConfig.mapSpawnRate;
            }
            
            LogManager.log("MapManager", `📍 Génération interne - hudHeight: ${this.hudHeight}px, spawnRate: ${spawnRate}`);
            let obstacleCount = 0;
            let wallCount = 0;
            
            for(let x = 2; x < this.cols - 2; x++) {
                for(let y = 2; y < this.rows - 2; y++) {
                    if(x % 2 === 0 && y % 2 === 0) {
                        this.createWall(x, y, 28); // Blocs centraux indestructibles
                        wallCount++;
                    } else if(Math.random() > spawnRate && !this.isInSafeZone(x, y)) {
                        this.createObstacle(x, y, 12); // Blocs destructibles
                        obstacleCount++;
                    }
                }
            }
            LogManager.log("MapManager", `✅ Blocs générés - Murs internes: ${wallCount}, Obstacles: ${obstacleCount}`);
        } catch (e) {
            LogManager.warn('MapManager', 'Exception levée MapManager -> generateInternalBlocks() : ', e);
            return;
        }
    }

    generateSafeZones() {
        try {
            LogManager.log("🔄 Nettoyage de la zone de spawn...");
    
            const safeZoneTiles = [
                { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }
            ];
        
            safeZoneTiles.forEach(pos => {
                this.walls.getChildren().forEach(wall => {
                    const wallX = Math.floor(wall.x / this.tileSize);
                    const wallY = Math.floor(wall.y / this.tileSize);
                    if (wallX === pos.x && wallY === pos.y) {
                        LogManager.log(`🚧 Suppression d'un mur en ${wallX}, ${wallY}`);
                        wall.destroy();
                    }
                });
        
                this.obstacles.getChildren().forEach(obstacle => {
                    const obsX = Math.floor(obstacle.x / this.tileSize);
                    const obsY = Math.floor(obstacle.y / this.tileSize);
                    if (obsX === pos.x && obsY === pos.y) {
                        LogManager.log(`🪵 Suppression d'un obstacle en ${obsX}, ${obsY}`);
                        obstacle.destroy();
                    }
                });
            });
        
            // ✅ Forcer la mise à jour du moteur physique après suppression
            this.scene.physics.world.step();
        
            setTimeout(() => {
                LogManager.log("🔍 Vérification post-nettoyage | Walls:", this.walls.countActive(), "Obstacles:", this.obstacles.countActive());
            }, 500);
        } catch (e) {
            LogManager.warn('Exception levée MapManager -> generateSafeZones() : ', e);
            return;
        }
    }               

    createWall(gridX, gridY, frame) {
        try {
            const x = gridX * this.tileSize + this.tileSize / 2;
            const y = gridY * this.tileSize + this.tileSize / 2;

            const wall = this.walls.get(x, y, 'sprites', frame)
                .setOrigin(0.5)
                .setVisible(true);        
            
            wall.body.setSize(this.tileSize, this.tileSize);
            wall.body.offset.set(0, 0);
            //LogManager.log("MapManager", `🧱 Mur ajouté à grille(${gridX}, ${gridY}) => Position pixel(${x}, ${y})`);

            return wall;
        } catch (e) {
            LogManager.warn('MapManager', 'Exception levée MapManager -> createWall() : ', e);
            return;
        }
    }

    createObstacle(gridX, gridY, frame){
        try {
            const x = gridX * this.tileSize + this.tileSize / 2;
            const y = gridY * this.tileSize + this.tileSize / 2;

            // Correction 1 : Même clé de texture ici
            const obstacle = this.obstacles.get(x, y, 'sprites', frame)
                .setOrigin(0.5)
                .setData('type', 'destructible');

            // Correction 2 : Gestion du corps physique
            obstacle.body.setSize(this.tileSize, this.tileSize);
            LogManager.log("MapManager", `🧱 Obstacle ajouté à grille(${gridX}, ${gridY}) => Position pixel(${x}, ${y})`);

            return obstacle;
        } catch (e) {
            LogManager.warn('MapManager', 'Exception levée MapManager -> createObstacle() : ', e);
            return;
        }
    }

    isInSafeZone(gridX, gridY) {
        try {
            const safePadding = 2; 
            return (
                (gridX < safePadding && gridY < safePadding) || 
                (gridX > this.cols - 1 - safePadding && gridY > this.rows - 1 - safePadding)
            );
        } catch (e) {
            LogManager.warn('Exception levée MapManager -> isInSafeZone() : ', e);
            return;
        }
    }

    checkPortalSpawn() {
        try {
            LogManager.log("🌀 Vérification du portail...");
        
            LogManager.log("🔍 Obstacles restants :", this.scene.map.obstacles.countActive());
            LogManager.log("🔍 PortalSpawned ?", this.scene.config.portalSpawned);
        
            if (!this.scene.config.portalSpawned && this.scene.map.obstacles.countActive() === 0) {
                LogManager.log('🌀 Portail de sortie débloqué !');
                this.spawnPortal();
            }
        } catch (e) {
            LogManager.warn('Exception levée MapManager -> checkPortalSpawn() : ', e);
            return;
        }
    }    

    spawnPortal() {
        try {
            LogManager.log("🚪 Tentative de création du portail...");
    
            let exitX = (this.scene.config.cols - 2) * this.scene.config.tileSize;
            let exitY = (this.scene.config.rows - 2) * this.scene.config.tileSize;
            LogManager.log(`📍 Portail positionné à X:${exitX} Y:${exitY}`);
        
            this.portal = this.scene.physics.add.sprite(exitX, exitY, 'sprites', 12 * this.scene.config.tilesPerRow)
                .setOrigin(0.5)
                .setDepth(10); // Ajout d’un Z-index élevé pour s’assurer qu’il est visible.
        
            if (!this.portal) {
                LogManager.error("❌ Échec de création du portail !");
                return;
            }
        
            this.scene.config.portalSpawned = true;
        
            this.scene.physics.add.overlap(this.scene.player.sprite, this.portal, () => {
                LogManager.log("✅ Niveau terminé !");
                
                // Vérifie s'il y a un niveau suivant
                if (this.scene.levelManager.nextLevel()) {
                    LogManager.log("📈 Passage au niveau suivant...");
                    // Réinitialise les bonus mais conserve les vies et le score
                    this.scene.gameState.playerSpeed = 150;
                    this.scene.gameState.maxBombs = 1;
                    this.scene.gameState.bombSize = 1;
                    this.scene.resetManager.reset("new-level");
                    this.scene.scene.restart();
                } else {
                    LogManager.log("🏆 Tous les niveaux complétés !");
                    this.scene.scene.start("GameOverScene");
                }
            });
        } catch (e) {
            LogManager.warn('Exception levée MapManager -> spawnPortal() : ', e);
            return;
        }
    }    
}