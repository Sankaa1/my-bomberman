// GameOverScene.js
export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameOverScene" });
        this.resetManager = null; // 🔄 On l'initialise plus tard
    }

    setResetManager(resetManager) {
        try {
            this.resetManager = resetManager; // ✅ Stocke resetManager
        } catch (e) {
            LogManager.warn('Exception levée GameOverScene -> setResetManager() : ', e);
            return;
        }
    }

    create() {
        try {
            console.log("☠ GAME OVER ☠");

            this.add.text(100, 100, "GAME OVER", { fontSize: "36px", fill: "#FF0000" });
            this.add.text(80, 150, "Press SPACE to Restart", { fontSize: "16px", fill: "#FFFFFF" });

            this.input.keyboard.on("keydown-SPACE", () => {
                console.log("🔄 Redémarrage du jeu !");
                if (this.resetManager) {
                    this.resetManager.reset("game-over"); // ✅ Reset total avant restart
                } else {
                    console.error("❌ resetManager est introuvable !");
                }
                this.scene.start("BombermanGame"); // ✅ Recharge le jeu
            });
        } catch (e) {
            LogManager.warn('Exception levée GameOverScene -> create() : ', e);
            return;
        }
    }
}