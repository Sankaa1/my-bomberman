# 🧪 Test Visuel - Affichage

## Checklist de Vérification Visuelle

### ✅ HUD - Éléments Présents

- [ ] HUD hauteur 50px (pas 30px)
- [ ] Label "LIVES" en gris petit
- [ ] Label "SCORE" en gris petit
- [ ] Label "TIME" en gris petit
- [ ] Valeur vies en rouge (#FF6B6B)
- [ ] Valeur score en cyan (#4ECDC4)
- [ ] Valeur temps en jaune (#FFE66D)
- [ ] Bordure verte inférieure (séparation)
- [ ] Fond noir semi-transparent

### ✅ HUD - Affichage des Valeurs

- [ ] Vies affiche: "3 ❤️" (pas "❤️ Vies: 3")
- [ ] Score affiche: "00123" (avec zéros)
- [ ] Temps affiche: "2:00" (format mm:ss)
- [ ] Temps affiche: "0:07" (secondes)
- [ ] Temps affiche: "0:00" (fin)

### ✅ HUD - Feedback Dynamique

**Santé:**
- [ ] 3 vies: Rouge normal (#FF6B6B)
- [ ] 2 vies: Rouge normal (#FF6B6B)
- [ ] 1 vie: Rouge intense (#FF1744)

**Temps:**
- [ ] > 30s: Jaune (#FFE66D)
- [ ] 10-30s: Orange (#FFA500)
- [ ] < 10s: Rouge (#FF1744)

### ✅ HTML/CSS - Effets Visuels

- [ ] Gradient de fond visible (noir vers gris)
- [ ] Border 4px visible et vert
- [ ] Glow autour du jeu visible
- [ ] Scanlines visibles (fins traits)
- [ ] Pas de scroll horizontal
- [ ] Pas de scroll vertical

### ✅ Alignement & Spacing

- [ ] HUD centré horizontalement
- [ ] Sections vies/score/temps alignées (33% chacun)
- [ ] Padding haut/bas suffisant
- [ ] Pas de chevauchement
- [ ] Texte lisible (pas trop petit)

### ✅ Responsive Design

#### Sur Desktop (1920x1080):
- [ ] HUD complètement visible
- [ ] Glow effect visible
- [ ] Scanlines visibles
- [ ] Tout bien lisible
- [ ] **Note: 10/10**

#### Sur Tablet (768x1024):
- [ ] HUD visible
- [ ] Border adapté
- [ ] Texte lisible
- [ ] **Note: 8/10**

#### Sur Mobile (375x667):
- [ ] HUD visible (dense)
- [ ] Texte lisible
- [ ] Pas de scroll inadéquat
- [ ] **Note: 7/10**

### ✅ Performance

- [ ] FPS stable à 60
- [ ] Pas de lag HUD update
- [ ] Pas de lag scanlines
- [ ] Pas de lag animations (si ajoutées)

### ✅ Accessibilité

- [ ] Contraste blanc/noir acceptable
- [ ] Contraste couleurs/fond acceptable
- [ ] Font size lisible (≥ 16px valeurs)
- [ ] Font weight bold (lisibilité)
- [ ] Pas de clignement > 3Hz (epilepsie)

---

## Test Gameplay Visuel

### 📊 HUD Pendant le Jeu

**État Initial:**
```
LIVES      SCORE      TIME
 3 ❤️      00000      2:00
```

**Après placement bombe (score +100):**
```
LIVES      SCORE      TIME
 3 ❤️      00100      2:00
✓ Score mis à jour
```

**Après destruction 3 obstacles (score +300):**
```
LIVES      SCORE      TIME
 3 ❤️      00400      1:50
✓ Score accumulé
✓ Temps décrémente
```

**Joueur touché (1 vie perdue):**
```
LIVES      SCORE      TIME
 2 ❤️      00400      1:45
✓ Vies mises à jour
✓ Score conservé
✓ Pas de clignotement (2 vies OK)
```

**Joueur touché à nouveau:**
```
LIVES      SCORE      TIME
 1 ❤️      00400      1:40
⚠️ Texte LIVES devient rouge intense (#FF1744)
⚠️ Clignotement activé (possible)
```

**Temps < 30s:**
```
LIVES      SCORE      TIME
 1 ❤️      00400      0:28
✓ Timer devient orange
```

**Temps < 10s:**
```
LIVES      SCORE      TIME
 1 ❤️      00400      0:07
⚠️ Timer devient rouge (#FF1744)
⚠️ Pulse possible
```

**Game Over:**
```
Transition vers GameOverScene
✓ HUD disparaît
✓ Écran game over s'affiche
```

---

## Test Pausa

- [ ] P appuyé → Pause scene lancée
- [ ] HUD visible en pause
- [ ] Score/Vies conservés
- [ ] Temps arrêté
- [ ] P appuyé → Reprise
- [ ] HUD continue correctement

---

## Test Comparaison Avant/Après

### AVANT (Original)
- Hauteur: 30px ← **Petit**
- Police: 16px ← **Peu lisible**
- Couleur: Blanc ← **Pas de distinction**
- Format: "❤️ Vies: 3" ← **Verbose**
- Espace: Comprimé ← **Inconfortable**
- Bordure: Non ← **Se confond**

### APRÈS (Nouveau)
- Hauteur: 50px ← **67% plus grand!**
- Police: 20px ← **Lisible!**
- Couleur: RGB ← **Hiérarchie claire**
- Format: "3 ❤️" ← **Concis**
- Espace: Aéré ← **Confortable**
- Bordure: Oui ← **Bien séparé**

**Résultat: ✅ Amélioration majeure**

---

## Feedback Utilisateur Expected

### Avant
- "C'est petit et difficile à lire"
- "C'est pas clair où est la santé"
- "Ça se confond avec le jeu"

### Après
- "C'est clair et lisible!"
- "J'aime les couleurs"
- "Ça paraît professionnel"
- "J'aime bien l'effet rétro"

---

## Photos/Screenshots

### À capturer AVANT d'envoyer en prod:

1. **Screenshot HUD au démarrage**
   - Vérifier: "LIVES / SCORE / TIME" visibles
   - Vérifier: Couleurs correctes
   - Vérifier: Bordure verte

2. **Screenshot HUD santé critique**
   - Vérifier: Texte LIVES rouge intense
   - Vérifier: Contraste bon

3. **Screenshot HUD temps court**
   - Vérifier: Texte TIME rouge
   - Vérifier: Pulse visible (si animé)

4. **Screenshot responsive mobile**
   - Vérifier: Toujours lisible
   - Vérifier: Pas de scroll

5. **Screenshot gameplay complet**
   - Vérifier: HUD + Jeu ensemble
   - Vérifier: Bien proportionné

---

## Problèmes Possibles & Solutions

### Problème: "Texte HUD trop petit"
**Solution**: Font size déjà 20px, OK. Vérifier résolution écran (zoom navigateur?)

### Problème: "Couleurs pas assez visibles"
**Solution**: Contraste vérifié (8:1+). Vérifier gamma écran.

### Problème: "Scanlines trop visibles/pas visibles"
**Solution**: C'est normal. C'est un effet optionnel CSS. Peut être désactivé si problème.

### Problème: "HUD ne s'update pas"
**Solution**: Vérifier que `updateHUD()` est appelé dans `update()` de BombermanGame

### Problème: "HUD clignote"
**Solution**: Normal si santé critique. C'est le feedback voulu. Peut être désactivé.

---

## Performance Benchmarks

### Ciblés:
- FPS: 60 FPS stable
- CPU: < 10% pour HUD update
- GPU: < 5% pour scanlines
- Memory: < 1MB pour HUD objects

### À mesurer:
1. Ouvrir Chrome DevTools (F12)
2. Aller à Performance tab
3. Enregistrer 30 secondes de gameplay
4. Analyser le timeline
5. Vérifier FPS stable

---

## Checklist Finale AVANT Production

- [ ] Toutes les sections visuelles testées
- [ ] Tous les feedback dynamiques testés
- [ ] Performance acceptable
- [ ] Responsive design OK
- [ ] Accessibilité OK
- [ ] Pas d'erreurs console
- [ ] Code bien documenté
- [ ] Pas de breaking changes
- [ ] Screenshots prises
- [ ] Documentation mise à jour

---

*Test visuel - Version 1.0 | 05/12/2025*
