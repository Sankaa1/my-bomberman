# ⚙️ Guide de Configuration

## Configuration Principale

Tous les paramètres du jeu sont centralisés dans `utils/vars.js`:

```javascript
export const config = {
    // Taille des tuiles en pixels (ne pas changer)
    tileSize: 16,
    
    // Dimensions de la grille (colonnes x rangées)
    cols: 17,    // 17 tuiles de large
    rows: 13,    // 13 tuiles de haut
    
    tilesPerRow: 16,  // Disposition sprite (ne pas changer)
}
```

---

## Paramètres du Joueur

```javascript
player: {
    startX: 1,          // Position X spawn (tuiles)
    startY: 1,          // Position Y spawn (tuiles)
    speed: 150,         // Vitesse initiale (pixels/sec)
    maxSpeed: 250,      // Vitesse max possible
}
```

### Ajustements recommandés:
- **Facile**: `speed: 100`
- **Normal**: `speed: 150` (défaut)
- **Difficile**: `speed: 200+`

---

## Paramètres des Bombes

```javascript
bomb: {
    cooldown: 500,          // Délai avant pouvoir replacer (ms)
    duration: 2000,         // Temps avant explosion (ms)
    defaultSize: 1,         // Portée initiale (tuiles)
    maxSize: 5,             // Portée maximale
    defaultMaxBombs: 1      // Nombre max initial
}
```

### Ajustements recommandés:
- **Explosion rapide**: `duration: 1000`
- **Explosion lente**: `duration: 3000`
- **Portée longue**: `defaultSize: 3`
- **Plus de bombes**: `defaultMaxBombs: 2`

---

## Paramètres des Bonus

```javascript
bonus: {
    rdmBonus: 0.7,          // Probabilité apparition (0-1)
    extraLifeWon: false     // 1UP déjà obtenu ?
}
```

### Ajustements recommandés:
- **Bonus fréquents**: `rdmBonus: 0.9`
- **Bonus rares**: `rdmBonus: 0.3`
- **Pas de bonus**: `rdmBonus: 0`

---

## Paramètres Gameplay

```javascript
// Limite de temps par niveau (secondes)
timePerLevel: 120,          // 2 minutes

// Nombre de vies au démarrage
startingLives: 3,

// Niveau de zoom caméra
zoomRate: 1.1               // 1.0 = pas de zoom, 1.5 = très zoomé
```

### Ajustements recommandés:
- **Temps court**: `timePerLevel: 60`
- **Temps long**: `timePerLevel: 180`
- **Zoom serré**: `zoomRate: 1.3`
- **Zoom large**: `zoomRate: 0.9`

---

## Paramètres Visuels

```javascript
// Couleur de fond (hex)
backgroundColor: "#4b5320",     // Vert foncé

// Taux d'apparition obstacles
mapSpawnRate: 0.7              // 70% de chance par tuile
```

### Changement de couleur:
```javascript
// Vert classique Bomberman
backgroundColor: "#4b5320",

// Bleu
backgroundColor: "#1e3a8a",

// Rouge
backgroundColor: "#7c2d12",

// Violet
backgroundColor: "#581c87",

// Noir
backgroundColor: "#000000"
```

---

## Paramètres Debug

```javascript
debug: false                // true = affiche tous les logs
```

### Dans main.js, personnaliser les logs:

```javascript
// Voir uniquement certains modules
LogManager.toggleAllDebug(false);           // Désactiver tous
LogManager.toggleDebug('BombermanGame', true);  // Activer BombermanGame
LogManager.toggleDebug('Player', true);         // Activer Player

// Modules disponibles:
// - BombermanGame
// - BombManager
// - Player
// - HUDManager
// - MapManager
// - AnimationManager
// - BonusManager
// - ResetManager
// - GameState
// - LogManager
```

---

## Configuration Recommandées

### Mode Facile
```javascript
export const config = {
    tileSize: 16,
    cols: 17,
    rows: 13,
    tilesPerRow: 16,
    
    player: {
        startX: 1,
        startY: 1,
        speed: 100,           // ← Plus lent
        maxSpeed: 180,
    },
    
    bomb: {
        cooldown: 500,
        duration: 3000,       // ← Plus de temps
        defaultSize: 1,
        maxSize: 5,
        defaultMaxBombs: 2    // ← Plus de bombes
    },
    
    bonus: {
        rdmBonus: 0.9,        // ← Plus de bonus
        extraLifeWon: false
    },
    
    zoomRate: 1.1,
    backgroundColor: "#4b5320",
    timePerLevel: 180,        // ← Plus de temps
    startingLives: 5,         // ← Plus de vies
    debug: false
};
```

### Mode Normal
```javascript
// Voir les valeurs par défaut dans utils/vars.js
```

### Mode Difficile
```javascript
export const config = {
    // ... même structure
    
    player: {
        startX: 1,
        startY: 1,
        speed: 200,           // ← Plus rapide
        maxSpeed: 300,
    },
    
    bomb: {
        cooldown: 500,
        duration: 1500,       // ← Explosion rapide
        defaultSize: 1,
        maxSize: 5,
        defaultMaxBombs: 1
    },
    
    bonus: {
        rdmBonus: 0.3,        // ← Peu de bonus
        extraLifeWon: false
    },
    
    timePerLevel: 60,         // ← Peu de temps
    startingLives: 1,         // ← Une seule vie
    debug: false
};
```

---

## Configuration Personnalisée

### Exemple: Sandbox (test)
```javascript
export const config = {
    // ... tous les paramètres
    
    // Configuration spéciale pour tests
    bomb: {
        cooldown: 0,          // Placer illimitées
        duration: 500,        // Explosion rapide
        defaultSize: 5,       // Portée max
        maxSize: 5,
        defaultMaxBombs: 99   // Bombes illimitées
    },
    
    player: {
        startX: 1,
        startY: 1,
        speed: 300,
        maxSpeed: 300
    },
    
    bonus: {
        rdmBonus: 1.0,        // 100% bonus
        extraLifeWon: false
    },
    
    timePerLevel: 9999,       // Temps infini
    startingLives: 99
};
```

---

## Paramètres HUD

### Affichage HUD
- Position: Haut de l'écran
- Hauteur: 30px
- Fond: Noir semi-transparent
- Texte: Blanc 16px

Modifiable dans `modules/HUDManager.js`:
```javascript
this.hudBackground = scene.add.rectangle(
    0, 0, width, 30,        // ← Hauteur ici
    0x000000,               // ← Couleur (hex)
    0.8                     // ← Opacité (0-1)
);

// Ajuster positions
this.livesText = scene.add.text(10, 5, "", ...);          // Gauche
this.scoreText = scene.add.text(width * 0.3, 5, "", ...); // Centre-gauche
this.timerText = scene.add.text(width * 0.6, 5, "", ...); // Centre-droit
```

---

## Performance

### Si FPS faible:

1. **Réduire résolution grille**:
   ```javascript
   cols: 15,   // Au lieu de 17
   rows: 11,   // Au lieu de 13
   ```

2. **Augmenter zoom**:
   ```javascript
   zoomRate: 1.3  // Moins d'objets visibles
   ```

3. **Désactiver animations**:
   - Dans AnimationManager.js, commenter createExplosionAnimations()

4. **Réduire spawn taux**:
   ```javascript
   mapSpawnRate: 0.5  // Moins d'obstacles
   ```

---

## Reset Configuration

Pour revenir aux valeurs par défaut, il suffit de redémarrer le navigateur.

Pour reset dans le jeu:
```javascript
// Dans BombermanGame.js
this.resetManager.reset("full-reset");  // Reset complet
```

---

## Sauvegarde Configuration

Si vous modifiez les paramètres souvent, créer un fichier `config-custom.js`:

```javascript
// config-custom.js
export const config = {
    // Votre configuration personnalisée
};
```

Puis dans `main.js`:
```javascript
import { config } from "./config-custom.js";  // Au lieu de vars.js
```

---

## Troubleshooting

### "Le jeu est trop facile"
→ Augmenter: `speed`, `bomb.defaultSize`, réduire: `timePerLevel`

### "Le jeu est trop difficile"
→ Augmenter: `startingLives`, `timePerLevel`, réduire: `speed`

### "Les bonus n'apparaissent pas"
→ Augmenter: `bonus.rdmBonus` (ex: 0.9)

### "Explosions trop rapides"
→ Augmenter: `bomb.duration` (ex: 3000)

### "Joueur trop lent"
→ Augmenter: `player.speed` (ex: 200)

---

*Guide de configuration - Bomberman v1.0.1 | 04/12/2025*
