# 🆘 Guide de Dépannage

## ❌ Erreurs Courantes et Solutions

### 1. "Blank Page" ou Erreur 404

**Symptôme**: La page est vide ou affiche une erreur 404

**Causes possibles**:
- Fichier `phaser.js` manquant
- Chemin incorrect vers les assets
- Fichier `main.js` introuvable

**Solution**:
```bash
# Vérifier la structure
cd d:\Bomber
ls -la  # Vérifier que tous les fichiers sont présents
```

Fichiers essentiels à vérifier:
- ✅ `index.html`
- ✅ `main.js`
- ✅ `modules/phaser.js`
- ✅ `src/img/bomber_asset.png`

### 2. "Canvas is not initialized" ou erreur Phaser

**Symptôme**: Erreur JavaScript dans la console

**Cause**: Les assets n'ont pas pu être chargés

**Solution**:
1. Vérifier que le serveur est lancé (voir LOCAL_SERVER.md)
2. Vérifier l'URL dans le navigateur (`http://localhost:8000`)
3. Vérifier que `src/img/bomber_asset.png` existe

```javascript
// Dans BombermanGame.js, vérifier:
this.load.spritesheet('sprites', 'src/img/bomber_asset.png', {...})
```

### 3. "Module not found" ou "Cannot find module"

**Symptôme**: Erreur `Uncaught Error: Cannot find module...`

**Cause**: Un fichier n'existe pas ou le chemin est incorrect

**Solution**:
Vérifier tous les imports. Exemple:
```javascript
// ❌ INCORRECT
import { config } from "./var.js";  // Typo: var vs vars

// ✅ CORRECT
import { config } from "./utils/vars.js";
```

Tous les imports doivent inclure l'extension `.js`:
```javascript
import LogManager from "../utils/LogManager.js";  // ← .js obligatoire
```

### 4. "LogManager is not defined"

**Symptôme**: Erreur `Uncaught ReferenceError: LogManager is not defined`

**Cause**: LogManager n'a pas été importé

**Solution**:
Ajouter en haut du fichier:
```javascript
import LogManager from "../utils/LogManager.js";
```

Vérifier dans ces fichiers:
- ✅ AnimationManager.js (maintenant correct)
- ✅ BombermanGame.js
- ✅ BombManager.js
- ✅ Player.js
- ✅ MapManager.js
- ✅ HUDManager.js
- ✅ BonusManager.js
- ✅ ResetManager.js
- ✅ GameState.js

### 5. "Joueur ne se déplace pas"

**Symptôme**: Les flèches du clavier ne font rien

**Causes possibles**:
- Cursors n'ont pas été initialisés
- Collision avec obstacle
- Vitesse = 0

**Solution**:
```javascript
// Vérifier dans setupControls():
this.cursors = this.input.keyboard.createCursorKeys();  // Doit exister

// Vérifier la vitesse:
player.speed = 150;  // Ne doit pas être 0

// Vérifier les collisions:
this.physics.add.collider(this.player.sprite, this.map.walls);
```

### 6. "Bombe ne s'explose pas"

**Symptôme**: Bombe apparaît mais rien ne se passe

**Causes possibles**:
- Animation 'bomb' inexistante
- `explodeBomb()` pas appelé
- Délai `duration` trop long

**Solution**:
1. Vérifier dans logs si bombe est créée:
   ```javascript
   LogManager.toggleDebug('BombManager', true);
   // Voir si "✅ Bombe placée à..." s'affiche
   ```

2. Vérifier la configuration:
   ```javascript
   bomb: {
       duration: 2000,  // ← Doit être positif et > 0
   }
   ```

3. Vérifier l'animation existe:
   ```javascript
   // Dans AnimationManager.js
   this.scene.anims.create({
       key: 'bomb',
       frames: this.scene.anims.generateFrameNumbers(...),
       frameRate: 3,
       repeat: -1
   });
   ```

### 7. "Exposition s'affiche pas ou au mauvais endroit"

**Symptôme**: Explosion invisible ou décalée

**Solution**:
1. Vérifier animations explosion dans AnimationManager.js:
   ```javascript
   this.scene.anims.create({
       key: 'explosion-center',
       frames: explosionFrames(8, 1),
       frameRate: 10,
       repeat: 0  // ← Important: ne doit pas répéter
   });
   ```

2. Vérifier spawn explosion dans BombManager.js:
   ```javascript
   this.spawnExplosion(bomb.x, bomb.y, "explosion-center");
   ```

3. Vérifier les frames d'animation (peuvent être incorrects):
   - Voir dans `src/img/bomber_asset.xcf` la structure sprite

### 8. "HUD ne s'affiche pas"

**Symptôme**: Pas de texte en haut de l'écran

**Solution**:
1. Vérifier que HUDManager est créé:
   ```javascript
   // Dans BombermanGame.js create():
   this.hud = new HUDManager(this);  // Doit exister
   ```

2. Vérifier update() est appelé:
   ```javascript
   update() {
       this.hud.updateHUD();  // Doit être appelé
   }
   ```

3. Vérifier le DOM:
   - Ouvrir DevTools (F12)
   - Chercher `#game-container` dans la page
   - Vérifier qu'il existe

### 9. "Le jeu lag ou FPS faible"

**Symptôme**: Mouvement saccadé ou ralenti

**Cause généralement**: Trop d'objets physiques

**Solution**:
1. Réduire la taille de la grille:
   ```javascript
   cols: 15,  // Au lieu de 17
   rows: 11   // Au lieu de 13
   ```

2. Vérifier les collisions pas trop nombreuses:
   ```javascript
   // Dans BombermanGame.js setupCollisions():
   this.physics.add.collider(this.player.sprite, this.map.walls);
   // Ne pas ajouter plusieurs fois la même collision
   ```

3. Profiler avec Chrome DevTools:
   - F12 → Performance tab
   - Clic record
   - Jouer 30 secondes
   - Analyser le timeline

### 10. "Pause ne fonctionne pas"

**Symptôme**: P ne pause pas le jeu

**Solution**:
1. Vérifier PauseScene existe:
   ```javascript
   // Dans main.js
   scene: [
       BombermanGame,
       PauseScene,           // ← Doit être là
       GameOverScene
   ]
   ```

2. Vérifier clé P initialisée:
   ```javascript
   // Dans BombermanGame.js setupControls():
   this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
   ```

3. Vérifier update() lance pause:
   ```javascript
   if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
       this.scene.launch("PauseScene");
       this.scene.pause();  // ← Pause la scène principale
   }
   ```

---

## ⚠️ Avertissements Courants

### "Bonus manquant"
- **Raison**: `bonus.rdmBonus` trop bas (ex: 0.1 = 10% de chance)
- **Fix**: Augmenter à 0.7 ou plus

### "Chaînage explosions ne marche pas"
- **Raison**: Bombes explosent avant la détection
- **Fix**: Vérifier durée: `bomb.duration: 2000` (au moins)

### "Joueur spawn au mauvais endroit"
- **Raison**: `player.startX/startY` incorrect
- **Fix**: Vérifier que valeurs sont positives et < cols/rows

### "Memory leak (jeu ralentit avec le temps)"
- **Raison**: Objets pas détruits correctement
- **Fix**: Vérifier destructions dans explodeBomb():
  ```javascript
  bomb.disableBody(true, true);  // Désactiver corps physique
  this.group.remove(bomb, true, true);  // Supprimer du group
  ```

---

## 🧪 Stratégie de Debugging

### 1. Activer les logs pertinents
```javascript
// main.js
LogManager.toggleAllDebug(false);
LogManager.toggleDebug('BombManager', true);
LogManager.toggleDebug('Player', true);
```

### 2. Ouvrir la console DevTools
```
F12 → Console tab
```

### 3. Chercher le message spécifique
```
Exemple: "💣 Bombe placée à" → Bombe créée correctement
```

### 4. Vérifier Network tab
- F12 → Network
- Recharger page (F5)
- Chercher erreurs 404 (en rouge)

### 5. Vérifier Sources tab
- F12 → Sources
- Ajouter breakpoints
- Faire action dans jeu
- Voir l'exécution pas à pas

---

## 📋 Checklist Diagnostic Rapide

- [ ] Serveur lancé ? (`http://localhost:8000`)
- [ ] Pas d'erreur 404 ? (Network tab)
- [ ] Console vide (pas d'erreurs) ?
- [ ] Assets chargés ? (voir "✅ Chargement..." dans console)
- [ ] Todos les fichiers .js existent ?
- [ ] Tous les imports valides ?
- [ ] Tous les fichiers et dossiers existent ?
- [ ] Chemins relatifs corrects ?

---

## 🆘 Assistance Avancée

### Pour débugger efficacement:

1. **Minimal example**: Créer une copie simple pour tester une feature
2. **Git bisect**: Si ça marchait avant, utiliser `git log` pour trouver quand c'est cassé
3. **DevTools Debugger**: Ajouter des breakpoints et inspecter les variables
4. **Console logs**: Ajouter des `console.log()` avant et après les actions

### Sections de code à vérifier en priorité:

1. **Initialisation**:
   - `main.js` - Configuration Phaser
   - `BombermanGame.js create()` - Setup initial
   - `AnimationManager.js` - Animations créées ?

2. **Interaction**:
   - `Player.js handleMovement()` - Entrée clavier
   - `BombManager.js placeBomb()` - Placement bombe
   - `BombManager.js explodeBomb()` - Explosion

3. **État**:
   - `GameState.js` - État global cohérent ?
   - `HUDManager.js` - Affichage correct ?
   - `ResetManager.js` - Reset fonctionne ?

---

## 📞 Escalade

Si le problème persiste:

1. Vérifier OPTIMISATIONS.md pour les changements récents
2. Vérifier CHANGELOG.md pour les bugs connus
3. Consulter CHECKLIST.md pour tester tous les points
4. Lancer en mode debug complet:
   ```javascript
   LogManager.toggleAllDebug(true);  // ← Active TOUS les logs
   ```

---

*Guide de dépannage - Bomberman v1.0.1 | 04/12/2025*
