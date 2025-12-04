// modules/BombManager.js 🔥
import { config } from "../utils/vars.js";

export class BombManager {
    constructor(scene) {
        this.scene = scene;
        this.config = config;

        if (!config) {
            console.error("❌ ERREUR: config est undefined dans BombManager !");
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
        if(this.config.bomb.maxBombs > 0){}
        // Convertir la position du joueur en coordonnées de grille
        const tileX = Math.floor(playerX / this.config.tileSize) * this.config.tileSize + this.config.tileSize / 2;
        const tileY = Math.floor(playerY / this.config.tileSize) * this.config.tileSize + this.config.tileSize / 2;
    
        //console.log("💣 Debug BombManager | tileX: ", tileX, "tileY: ", tileY);
    
        // Vérifier si une bombe est déjà placée ici
        const existingBomb = this.group.getChildren().find(bomb => bomb.x === tileX && bomb.y === tileY);
        if (existingBomb) {
            console.log("❌ Une bombe est déjà placée ici !");
            return;
        }
    
        // Créer la bombe
        let bomb = this.group.create(tileX, tileY, "sprites", 7 * this.config.tilesPerRow + 4)
            .setOrigin(0.5)
            .setImmovable(true);
    
        if (!bomb) {
            console.error("❌ Erreur lors de la création de la bombe !");
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
                console.log("🚶‍♂️ Joueur déplacé hors de la bombe à", newX, newY);
                break;
            }
        }
    
        console.log("✅ Bombe placée à", tileX, tileY);
    
        // Lancer l'animation
        if (this.scene.anims.exists("bomb")) {
            bomb.play("bomb");
        } else {
            console.error("❌ Animation 'bomb' introuvable !");
        }
    
        // Déclencher l'explosion après un délai
        this.scene.time.delayedCall(this.config.bomb.duration, () => this.explodeBomb(bomb), [], this);
    }

    /**
     * 🔥 Mécanique de l'explosion de la bombe.
     * @param {*} bomb 
     * @returns 
     */
    /* explodeBomb(bomb) {
        if (!bomb) return;
    
        console.log("💥 BOOM ! Explosion en", bomb.x, bomb.y);
    
        // Obtenir la taille de l'explosion
        let explosionSize = this.config.bomb.size;
    
        // 🔥 Explosion centrale
        this.spawnExplosion(bomb.x, bomb.y, "explosion-center");
    
        // 🔥 Propagation de l'explosion dans chaque direction
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
    
                // Vérifier si un mur indestructible bloque l'explosion
                const isWall = this.scene.map.walls.getChildren().some(wall =>
                    Math.round(wall.x) === Math.round(newX) && Math.round(wall.y) === Math.round(newY)
                );
    
                if (isWall) break; // Stopper l'explosion dans cette direction
    
                // Détecter un obstacle destructible
                let obstacle = this.scene.map.obstacles.getChildren().find(obs =>
                    Math.round(obs.x) === Math.round(newX) && Math.round(obs.y) === Math.round(newY)
                );
    
                // Détruire l'obstacle si trouvé
                if (obstacle) {
                    obstacle.destroy();
                    this.scene.bonusManager.maybeSpawnBonus(newX, newY); // 🎁 Tente de générer un bonus
                    this.spawnExplosion(newX, newY, dir.endKey);
                    
                    this.increaseScore();
                    
                    break;
                }
    
                // Jouer l'animation correcte selon la distance
                let explosionKey = (i === explosionSize) ? dir.endKey : dir.midKey;
                this.spawnExplosion(newX, newY, explosionKey);
    
                // Vérifier si le joueur est touché
                this.checkPlayerHit(newX, newY);
            }
        }
    
        // 🔄 Suppression de la bombe
        bomb.destroy();
    } */

    explodeBomb(bomb, explodedBombs = new Set()) {
        if (!bomb || explodedBombs.has(bomb)) return;
    
        // Marquer la bombe comme explosée dès le départ
        explodedBombs.add(bomb);
        bomb.isExploding = true; // Empêche tout déclenchement supplémentaire
        bomb.disableBody(true, true); // Désactive immédiatement la bombe physiquement et visuellement
    
        console.log("💥 BOOM ! Explosion en", bomb.x, bomb.y);
    
        let explosionSize = this.config.bomb.size;
        let comboCount = 0;
        let bombsToExplode = [];
    
        // Explosion centrale
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
                if (isWall) break;
    
                // Vérifier une bombe chaînée
                let chainedBomb = this.group.getChildren().find(b =>
                    Math.round(b.x) === Math.round(newX) && Math.round(b.y) === Math.round(newY) && !b.isExploding
                );
    
                if (chainedBomb) {
                    console.log("💣 Explosion en chaîne ! Bombe détectée à", newX, newY);
                    bombsToExplode.push(chainedBomb);
                    continue;
                }
    
                let obstacle = this.scene.map.obstacles.getChildren().find(obs =>
                    Math.round(obs.x) === Math.round(newX) && Math.round(obs.y) === Math.round(newY)
                );
    
                if (obstacle) {
                    obstacle.destroy();
                    this.scene.bonusManager.maybeSpawnBonus(newX, newY);
                    this.spawnExplosion(newX, newY, dir.endKey);
                    comboCount++;
                    break;
                }
    
                let explosionKey = (i === explosionSize) ? dir.endKey : dir.midKey;
                this.spawnExplosion(newX, newY, explosionKey);
                this.checkPlayerHit(newX, newY);
            }
        }
    
        this.increaseScore(comboCount);
    
        // Faire exploser les bombes chaînées immédiatement
        bombsToExplode.forEach(b => this.explodeBomb(b, explodedBombs));
    
        // Supprimer la bombe du groupe après son explosion
        this.group.remove(bomb, true, true);
    }                
        
    increaseScore(combo = 1) {
        if (combo > 0) { // ✅ Ne pas donner de points si aucun obstacle n'a été détruit
            let points = 100 * combo;
            console.log('points après * combo: ', points);
            this.config.player.score += points;
            console.log(`🎯 Score +${points} (combo x${combo})`);

            this.scene.hud.setText(`❤️ Vies: ${this.config.player.lives}  💣 Score: ${this.config.player.score}  ⏳ Temps: ${Math.max(0, Math.floor(this.scene.timerEvent.getRemainingSeconds()))}`);
        }
    }    

    checkPlayerHit(x, y) {
        const player = this.scene.player;
        const tileSize = this.config.tileSize;
        
        // 🔥 Vérification améliorée : inclut aussi la case exacte de la bombe
        if (
            (Math.abs(player.sprite.x - x) < tileSize / 2 && player.sprite.y === y) || // Même ligne, X proche
            (Math.abs(player.sprite.y - y) < tileSize / 2 && player.sprite.x === x) || // Même colonne, Y proche
            (Math.round(player.sprite.x) === Math.round(x) && Math.round(player.sprite.y) === Math.round(y)) // Exactement sur la bombe
        ) {
            console.log("🔥 Le joueur est touché par l'explosion !");
            player.takeDamage();
        }
    }    

    /**
     * 🔥 Vérifie si le joueur est touché par l'explosion
     */
    enablePlayerCollision() {
        if (!this.scene.player || !this.scene.player.sprite) {
            console.error("❌ Impossible d'activer la collision avec la bombe : le joueur n'est pas encore initialisé !");
            return;
        }
    
        console.log("🚧 Activation de la collision entre le joueur et les bombes");
        
        this.scene.physics.add.collider(this.group, this.scene.player.sprite, (player, bomb) => {
            console.log("🚧 Le joueur est bloqué par une bombe !");
        });
    }
    
    /**
    * 🔥 Gère la création et la destruction des explosions
    */
    spawnExplosion(x, y, animationKey) {
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
            console.error("❌ Animation manquante :", animationKey);
        }
    }    
}