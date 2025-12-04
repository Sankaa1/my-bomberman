// utils/LogManager.js
const LogManager = {
    
    debugModes: {
        'BombermanGame': true,
        'BombManager': true,
        'Player': true,
        'HUDManager': false,
        'MapManager': false,
        'AnimationManager': false,
        'BonusManager': true,
        'ResetManager': false,
        'GameState': true
    },

    log(scriptName, ...args) {
        if (this.debugModes[scriptName]) {
            console.log(...args);
        }
    },

    warn(scriptName, ...args) {
        if (this.debugModes[scriptName]) {
            console.warn(...args);
        }
    },

    error(scriptName, ...args) {
        // On garde les erreurs même si debugMode est false, parce que c’est critique
        console.error(`[${scriptName}]`, ...args);
    },

    toggleDebug(scriptName, active) {
        if (this.debugModes.hasOwnProperty(scriptName)){
            this.debugModes[scriptName] = active;
            this.log('LogManager' , `🔧 Debug mode pour ${scriptName} switched to: ${active}`);
        } else {
            this.error("LogManager", `❌ Script ${scriptName} inconnu dans debugModes`);
        }
    },

    toggleAllDebug(active) {
        for (let script in this.debugModes) {
            this.debugModes[script] = active;
        }
        this.log('LogManager', `🔧 Tous les debug modes switched to: ${active}`);
    }
};

export default LogManager;