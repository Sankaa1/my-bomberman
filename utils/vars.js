// utils/vars.js
/**
 * Configuration centralisée du jeu Bomberman
 */
export const config = {
    // ========== GRILLE & TAILLES ==========
    tileSize: 16,
    cols: 17,
    rows: 13,
    tilesPerRow: 16,

    // ========== GÉNÉRATION DE MAP ==========
    blocks: { 
        destructible: 12, 
        indestructible: 28 
    },
    mapSpawnRate: 0.7, // Probabilité de générer un bloc destructible
    
    // ========== JOUEUR ==========
    player: {
        startX: 1,
        startY: 1,
        speed: 150,
        maxSpeed: 250,
    },

    // ========== BOMBES ==========
    bomb: { 
        cooldown: 500,      // Délai avant de pouvoir placer une nouvelle bombe
        duration: 2000,     // Temps avant explosion (en ms)
        defaultSize: 1,     // Portée par défaut
        maxSize: 5,         // Portée maximale
        defaultMaxBombs: 1  // Nombre de bombes max par défaut
    },

    // ========== BONUS ==========
    bonus: { 
        rdmBonus: 0.7,      // Probabilité d'apparition (0-1)
        extraLifeWon: false // Bonus 1UP déjà obtenu dans le niveau
    },

    // ========== AFFICHAGE ==========
    zoomRate: 1.1,
    backgroundColor: "#4b5320",
    
    // ========== GAMEPLAY ==========
    timePerLevel: 120,      // Temps limite en secondes
    startingLives: 3,
    
    // ========== DEBUG ==========
    debug: false // Change à true pour activer tous les logs
};