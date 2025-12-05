# 🎮 Bomberman - Jeu Phaser 3

Un jeu Bomberman retro développé avec **Phaser 3**, reprenant les mécaniques classiques du jeu original.

## 📋 Contenu du projet

```
Bomber/
├── index.html              # Point d'entrée HTML avec CSS intégré
├── main.js                 # Configuration Phaser et initialisation
├── modules/
│   ├── AnimationManager.js # Gestion des animations des sprites
│   ├── BombermanGame.js    # Scène principale du jeu
│   ├── BombManager.js       # Logique des bombes et explosions
│   ├── BonusManager.js     # Gestion des bonus (vitesse, puissance, etc.)
│   ├── HUDManager.js       # Interface utilisateur (vies, score, temps)
│   ├── MapManager.js       # Génération et gestion de la carte
│   ├── Player.js           # Logique du joueur et mouvements
│   ├── ResetManager.js     # Gestion des resets (mort, game over, niveau)
│   └── phaser.js           # Bibliothèque Phaser 3
├── scenes/
│   ├── GameOverScene.js    # Écran de fin de jeu
│   └── PauseScene.js       # Écran de pause
├── utils/
│   ├── GameState.js        # État global du jeu (vies, score, bonus)
│   ├── LogManager.js       # Système de logging avec contrôle par script
│   └── vars.js             # Configuration centralisée du jeu
└── src/
    └── img/
        └── bomber_asset.png # Spritesheet du jeu
```

## 🎮 Contrôles

- **Flèches** : Se déplacer
- **ESPACE** : Placer une bombe
- **P** : Pause/Reprendre

## ⚙️ Configuration

La configuration centralisée se trouve dans `utils/vars.js` :

```javascript
{
    tileSize: 16,                    // Taille d'une tuile en pixels
    cols: 17, rows: 13,             // Dimensions de la grille
    player.speed: 150,              // Vitesse initiale du joueur
    bomb.duration: 2000,            // Temps avant explosion (ms)
    timePerLevel: 120,              // Limite de temps par niveau (s)
    startingLives: 3,               // Nombre de vies au démarrage
    zoomRate: 1.1                   // Niveau de zoom de la caméra
}
```

## 🐛 Debug

Contrôler les logs par module dans `main.js` :

```javascript
LogManager.toggleDebug('BombermanGame', true);  // Active logs pour BombermanGame
LogManager.toggleAllDebug(false);               // Désactive tous les logs
```

## 🎯 Mécaniques principales

### Joueur
- Mouvement fluide sur grille
- Respawn après dégât
- Collecte de bonus

### Bombes
- Placement limité (augmente par bonus)
- Explosions en croix (4 directions)
- Chaînage automatique (une bombe explose d'autres bombes)
- Destruction des obstacles

### Bonus
- **Speed** (+30 vitesse)
- **Bomb Power** (+1 portée)
- **Bomb Count** (+1 bombe max)
- **1UP** (+1 vie, une seule par niveau)

### Carte
- Murs indestructibles (bordures + grille)
- Obstacles destructibles (aléatoires)
- Zones de sécurité (coin haut-gauche)
- Portail pour niveau suivant

## 🚀 Améliorations effectuées

### Optimisations de performance
- ✅ HUDManager : Mise à jour sélective (uniquement si changement)
- ✅ Caching des valeurs HUD

### Corrections de bugs
- ✅ Import LogManager manquant dans AnimationManager
- ✅ Correction LogManager.err → LogManager.error
- ✅ Doublons de vérification dans Player

### Améliorations d'affichage
- ✅ HTML5 sémantique avec meta tags
- ✅ CSS responsive avec styles pixel art
- ✅ Box-shadow pour effet de profondeur
- ✅ Couleurs cohérentes avec thème

### Configuration
- ✅ vars.js complétée avec tous les paramètres
- ✅ Documentation structurée
- ✅ Commentaires clarifiés

## 📱 Responsive Design

Le jeu s'adapte automatiquement à différentes résolutions via Phaser.Scale.FIT.

## 🔧 Prérequis

- Navigateur moderne (ES6 modules)
- Serveur HTTP local pour tester (modules ES6)

## 📝 Licence

Projet personnel - Jeu d'apprentissage Phaser 3
