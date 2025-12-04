# ✅ Checklist de Vérification

## 🟢 Démarrage du Jeu

- [ ] Le jeu lance sans erreurs console
- [ ] La page HTML charge correctement
- [ ] Le canvas Phaser s'affiche
- [ ] Le HUD est visible en haut de l'écran
- [ ] La carte est générée correctement

## 🎮 Contrôles

- [ ] Flèche Gauche = Joueur se déplace à gauche
- [ ] Flèche Droite = Joueur se déplace à droite
- [ ] Flèche Haut = Joueur se déplace vers le haut
- [ ] Flèche Bas = Joueur se déplace vers le bas
- [ ] ESPACE = Bombe placée à la position du joueur
- [ ] P = Pause/Reprendre

## 💣 Mécaniques de Bombe

- [ ] Bombe se place à la position correcte (centré sur tuile)
- [ ] Animation de la bombe fonctionne
- [ ] Limite de bombes respectée (max 1 par défaut)
- [ ] Explosion après 2 secondes
- [ ] Joueur se déplace automatiquement si bombe directement dessus
- [ ] Explosion en croix (4 directions)
- [ ] Obstacles détruits par l'explosion
- [ ] Murs indestructibles bloquent l'explosion
- [ ] Chaînage d'explosions fonctionne
- [ ] Joueur prend dégât si touché par explosion

## 🎁 Bonus

- [ ] Bonus apparaît après destruction d'obstacle
- [ ] Bonus collecté quand joueur passe dessus
- [ ] Bonus Speed (+30 vitesse) fonctionne
- [ ] Bonus Bomb Power (+1 portée) fonctionne
- [ ] Bonus Bomb Count (+1 bombe max) fonctionne
- [ ] Bonus 1UP (+1 vie) fonctionne
- [ ] Bonus 1UP n'apparaît qu'une fois par niveau

## ❤️ Santé & Vies

- [ ] Score affichage initial = 0
- [ ] Vies affichage initial = 3
- [ ] Joueur prend dégât si touché explosion
- [ ] Joueur respawn après dégât
- [ ] Respawn animation fonctionne
- [ ] HUD met à jour vies correctement
- [ ] À 0 vies → Game Over

## 📊 HUD & Affichage

- [ ] HUD reste visible lors du déplacement
- [ ] Texte "Vies: X" s'affiche correctement
- [ ] Texte "Score: X" s'affiche correctement
- [ ] Texte "Temps: XX" s'affiche correctement
- [ ] HUD fond noir semi-transparent
- [ ] HUD texte blanc lisible

## 🎥 Caméra & Zoom

- [ ] Caméra suit le joueur
- [ ] Zoom appliqué (1.1x)
- [ ] Pas de scrolling infini
- [ ] Limites de caméra respectées

## 🔧 Système de Logs

- [ ] Les logs de BombermanGame s'affichent (activés)
- [ ] Les logs de Player s'affichent (activés)
- [ ] Les logs d'autres modules ne s'affichent pas (désactivés)
- [ ] Console propre (pas d'erreurs)

## 📈 Performance

- [ ] FPS stable (cible 60 FPS)
- [ ] Pas de lag lors des explosions
- [ ] Pas de lag lors du placement de bombe
- [ ] Pas de lag lors de la collecte de bonus
- [ ] Pas de ralentissement avec le temps

## 🎨 Rendu Visuel

- [ ] Sprite joueur visible
- [ ] Sprite bombes visibles
- [ ] Sprite obstacles visibles
- [ ] Sprite murs visibles
- [ ] Explosions visibles
- [ ] Bonus visibles
- [ ] Animations lisses
- [ ] Pas de flickering ou de glitching

## 🔄 Reset & État du Jeu

- [ ] Pause fonctionne (scène se pause)
- [ ] Reprendre après pause fonctionne
- [ ] Bombes disparaissent après utilisation
- [ ] Obstacles restent détruits
- [ ] Score persiste après pause

## 🌐 Responsive Design

- [ ] Fonctionne sur résolution 1280x208 (16:9)
- [ ] Fonctionne sur résolution 800x130 (mobile)
- [ ] Container reste centré
- [ ] Pas de scroll horizontal/vertical non intentionnel

## 🔍 Vérifications Avancées

- [ ] Pas de memory leak (DevTools)
- [ ] Pas d'erreur d'import
- [ ] Config centralisée utilisée partout
- [ ] Pas de variables globales dangereuses
- [ ] GameState cohérent avec HUD

---

## Résultats

**Date de test**: _______________  
**Testeur**: _______________  
**Notes**: 

```
[Espace pour notes libres]
```

**Status Global**: 
- [ ] ✅ PASS - Tout fonctionne
- [ ] ⚠️ PARTIAL - Quelques bugs mineurs
- [ ] ❌ FAIL - Bugs critiques

