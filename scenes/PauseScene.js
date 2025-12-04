import LogManager from "../utils/LogManager.js"; // implémenté ok
export class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: "PauseScene" });
    }

    create() {
        try {
            LogManager.log("⏸ Jeu en pause");

            // Ajout du texte Pause (optionnel)
            this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
                        "Pause", { fontSize: "32px", fill: "#FFF" })
                .setOrigin(0.5);

            // Ajout de l'écouteur pour reprendre la partie
            this.input.keyboard.on('keydown-P', () => {
                LogManager.log("▶ Reprise du jeu !");
                this.scene.stop(); // Arrête la scène Pause
                this.scene.resume("BombermanGame"); // Reprend la scène du jeu
            });
        } catch(e) {
            LogManager.warn('Exception levée PauseScene -> create() : ', e);
            return;
        }
    }
}
