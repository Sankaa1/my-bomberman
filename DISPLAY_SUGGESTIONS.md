# 🎨 Suggestions Visuelles Avancées

## Améliorations Visuelles Proposées (À Implémenter)

### 1. **Animations HUD**

#### Clignotement Santé Critique
```javascript
// Dans HUDManager.js
if (lives === 1) {
    this.scene.tweens.add({
        targets: this.livesText,
        alpha: { from: 1, to: 0.2 },
        duration: 400,
        repeat: -1,
        yoyo: true
    });
}
```

#### Pulse Temps Court
```javascript
if (timeRemaining <= 10) {
    this.scene.tweens.add({
        targets: this.timerText,
        scaleX: { from: 1, to: 1.1 },
        scaleY: { from: 1, to: 1.1 },
        duration: 300,
        repeat: -1,
        yoyo: true
    });
}
```

### 2. **Indicateur de Danger**

```javascript
// Ajouter un badge de danger
if (lives === 1) {
    this.dangerBadge = this.scene.add.text(
        this.scene.scale.width - 30, 
        8, 
        "⚠️ DANGER", 
        { 
            fontSize: "12px", 
            fill: "#FF1744",
            fontStyle: "bold"
        }
    );
}
```

### 3. **Feedback Combat**

#### Animation Joueur Touché
```javascript
// Dans Player.js takeDamage()
takeDamage() {
    this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0,
        duration: 100,
        yoyo: true,
        repeat: 5,  // Clignote 5 fois
        onComplete: () => {
            this.sprite.setAlpha(1);
        }
    });
}
```

#### Particles Explosion
```javascript
// Dans BombManager.js spawnExplosion()
this.scene.add.particles('sprites', {
    frame: explosionFrame,
    angle: { min: 240, max: 300 },
    speed: { min: -200, max: 200 },
    lifespan: 400
});
```

### 4. **Écran Transition Niveaux**

```javascript
// Nouveau fichier: scenes/LevelIntroScene.js
export class LevelIntroScene extends Phaser.Scene {
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Fond semi-transparent
        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8);
        
        // Texte du niveau
        this.add.text(width/2, height/2 - 40, 'LEVEL 1', {
            fontSize: '48px',
            fill: '#4b5320',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(width/2, height/2 + 20, 'GET READY!', {
            fontSize: '24px',
            fill: '#FFE66D',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Compte à rebours
        this.time.delayedCall(3000, () => {
            this.scene.stop();
            this.scene.resume('BombermanGame');
        });
    }
}
```

### 5. **Écran Pause Amélioré**

```javascript
// Fichier amélioré: scenes/PauseScene.js
export class PauseScene extends Phaser.Scene {
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background semi-opaque
        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.7);
        
        // Titre PAUSE
        this.add.text(width/2, height/2 - 60, 'PAUSED', {
            fontSize: '48px',
            fill: '#FFE66D',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Stats de pause
        const stats = [
            `Lives: ${this.scene.get('BombermanGame').gameState.lives}`,
            `Score: ${this.scene.get('BombermanGame').gameState.score}`,
            `Level: 1`
        ];
        
        stats.forEach((stat, i) => {
            this.add.text(width/2, height/2 - 10 + i * 30, stat, {
                fontSize: '16px',
                fill: '#fff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });
        
        // Instructions
        this.add.text(width/2, height/2 + 70, 'Press P to Resume', {
            fontSize: '14px',
            fill: '#aaa',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        
        this.input.keyboard.on('keydown-P', () => {
            this.scene.stop();
            this.scene.resume('BombermanGame');
        });
    }
}
```

### 6. **Écran Game Over Amélioré**

```javascript
// Fichier: scenes/GameOverScene.js (amélioré)
export class GameOverScene extends Phaser.Scene {
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Fond gradient
        this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.9);
        
        // Titre GAME OVER avec animation
        const gameOverText = this.add.text(width/2, height/2 - 80, 'GAME OVER', {
            fontSize: '60px',
            fill: '#FF1744',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animation pulse
        this.tweens.add({
            targets: gameOverText,
            scaleX: { from: 0.8, to: 1 },
            scaleY: { from: 0.8, to: 1 },
            duration: 500
        });
        
        // Stats finales
        const finalScore = this.scene.get('BombermanGame').gameState.score;
        this.add.text(width/2, height/2 - 10, `FINAL SCORE: ${finalScore}`, {
            fontSize: '24px',
            fill: '#4ECDC4',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Classement (simulé)
        this.add.text(width/2, height/2 + 30, 'TOP SCORES', {
            fontSize: '14px',
            fill: '#aaa'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(width/2, height/2 + 80, 'Press SPACE to Restart', {
            fontSize: '16px',
            fill: '#FFE66D',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('BombermanGame');
        });
    }
}
```

### 7. **Système de Notifications**

```javascript
// Nouveau fichier: modules/NotificationManager.js
export class NotificationManager {
    constructor(scene) {
        this.scene = scene;
        this.notifications = [];
    }
    
    showNotification(text, color = '#FFE66D', duration = 2000) {
        const width = this.scene.scale.width;
        const yPos = 70 + this.notifications.length * 25;
        
        const notif = this.scene.add.text(width/2, yPos, text, {
            fontSize: '14px',
            fill: color,
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Animation fade in
        this.scene.tweens.add({
            targets: notif,
            alpha: { from: 0, to: 1 },
            duration: 200
        });
        
        // Fade out après duration
        this.scene.time.delayedCall(duration, () => {
            this.scene.tweens.add({
                targets: notif,
                alpha: 0,
                duration: 300,
                onComplete: () => notif.destroy()
            });
        });
    }
}

// Usage:
// this.notificationManager.showNotification('Bonus +50!', '#FFE66D');
// this.notificationManager.showNotification('COMBO x5!', '#FF1744');
```

### 8. **Mini-Map (Optionnel)**

```javascript
// Dans HUDManager.js
createMinimap() {
    const minimapX = this.scene.scale.width - 80;
    const minimapY = 8;
    const minimapSize = 40;
    
    // Rectangle pour la minimap
    this.minimap = this.scene.add.rectangle(
        minimapX, 
        minimapY, 
        minimapSize, 
        minimapSize, 
        0x1a1a1a, 
        0.9
    ).setOrigin(0).setScrollFactor(0);
    
    // Points pour murs/obstacles
    // ... Afficher éléments en petit
}
```

### 9. **Palette de Couleurs Avancée**

```javascript
export const colorSchemes = {
    default: {
        lives: '#FF6B6B',    // Rouge
        score: '#4ECDC4',    // Cyan
        time: '#FFE66D',     // Jaune
        accent: '#4b5320',   // Vert
    },
    colorblind: {
        lives: '#E0218B',    // Magenta
        score: '#1E90FF',    // Bleu
        time: '#FF8C00',     // Orange
        accent: '#4b5320',
    },
    highContrast: {
        lives: '#FFFF00',    // Jaune vif
        score: '#00FFFF',    // Cyan vif
        time: '#FF0000',     // Rouge vif
        accent: '#FFFFFF',   // Blanc
    }
};
```

---

## 🎯 **Roadmap Visuelle**

### Phase 1 (Court terme):
- ✅ Amélioration HUD actuelle
- [ ] Animations HUD (Puls, Clignotement)
- [ ] Feedback visuel combat

### Phase 2 (Moyen terme):
- [ ] Amélioration écrans (Pause, GameOver)
- [ ] Système de notifications
- [ ] Particles avancées

### Phase 3 (Long terme):
- [ ] Mini-map
- [ ] Modes visuels (Colorblind, High Contrast)
- [ ] Cinematiques d'introduction

---

## 🧪 **Tests Visuels**

### À tester:
- [ ] Animations fluides (60 FPS)
- [ ] Contraste WCAG AA pour accessibilité
- [ ] Responsive sur all résolutions
- [ ] Performance particles
- [ ] Compatibilité navigateurs

---

*Suggestions visuelles - Version 1.0 | 05/12/2025*
