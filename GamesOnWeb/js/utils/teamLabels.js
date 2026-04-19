// Valeur mémorisée dans TEAM_SKIN_NAMES.
const TEAM_SKIN_NAMES = {
    // Paramètre de l'appel ou valeur de configuration.
    skin0: "PARIS",
    // Paramètre de l'appel ou valeur de configuration.
    skin1: "LYON",
    // Paramètre de l'appel ou valeur de configuration.
    huitieme: "MARSEILLE",
    // Paramètre de l'appel ou valeur de configuration.
    finale: "BORDEAUX",
    // Paramètre de l'appel ou valeur de configuration.
    demi: "LILLE",
    // Paramètre de l'appel ou valeur de configuration.
    quart: "NANTES",
    // Paramètre de l'appel ou valeur de configuration.
    skin6: "TOULOUSE",
    // Paramètre de l'appel ou valeur de configuration.
    skin7: "RENNES",
    // Paramètre de l'appel ou valeur de configuration.
    skin8: "NICE",
    // Instruction nécessaire au déroulement de cette partie.
    skin9: "STRASBOURG"
// Fermeture du bloc ou de l'appel.
};

// Valeur mémorisée dans DEFAULT_LEFT_LABEL.
const DEFAULT_LEFT_LABEL = "YOU";
// Valeur mémorisée dans DEFAULT_RIGHT_LABEL.
const DEFAULT_RIGHT_LABEL = "IA";

// Fonction normalizeLabel : elle regroupe le traitement de cette partie.
function normalizeLabel(label) {
    // Résultat renvoyé par la fonction.
    return String(label || "")
        // Appel de normalize pour appliquer l'action prévue.
        .normalize("NFD")
        // Appel de replace pour appliquer l'action prévue.
        .replace(/[\u0300-\u036f]/g, "")
        // Appel de toUpperCase pour appliquer l'action prévue.
        .toUpperCase()
        // Appel de replace pour appliquer l'action prévue.
        .replace(/[^A-Z0-9]/g, "");
// Fermeture du bloc ou de l'appel.
}

// Fonction getTeamDisplayNameFromSkinId : elle regroupe le traitement de cette partie.
export function getTeamDisplayNameFromSkinId(skinId, fallbackName) {
    // Résultat renvoyé par la fonction.
    return TEAM_SKIN_NAMES[skinId] || fallbackName || "TEAM";
// Fermeture du bloc ou de l'appel.
}

// Fonction getSelectedTeamDisplayName : elle regroupe le traitement de cette partie.
export function getSelectedTeamDisplayName(storageKey, fallbackName) {
    // Vérification avant d'exécuter la suite.
    if (typeof window === "undefined" || !window.localStorage) {
        // Résultat renvoyé par la fonction.
        return fallbackName || "TEAM";
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans skinId.
    const skinId = window.localStorage.getItem(storageKey);
    // Résultat renvoyé par la fonction.
    return getTeamDisplayNameFromSkinId(skinId, fallbackName);
// Fermeture du bloc ou de l'appel.
}

// Fonction getTeamShortLabel : elle regroupe le traitement de cette partie.
export function getTeamShortLabel(name, fallbackLabel) {
    // Valeur mémorisée dans normalized.
    const normalized = normalizeLabel(name);
    // Vérification avant d'exécuter la suite.
    if (normalized.length >= 2) {
        // Résultat renvoyé par la fonction.
        return normalized.slice(0, 2);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (normalized.length === 1) {
        // Résultat renvoyé par la fonction.
        return normalized + (fallbackLabel ? String(fallbackLabel).slice(0, 1) : "X");
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return fallbackLabel || "XX";
// Fermeture du bloc ou de l'appel.
}

// Fonction getVersusTeamLabels : elle regroupe le traitement de cette partie.
export function getVersusTeamLabels() {
    // Résultat renvoyé par la fonction.
    return {
        // Appel de getSelectedTeamDisplayName pour appliquer l'action prévue.
        leftName: getSelectedTeamDisplayName("gow-player1-skin-ui", DEFAULT_LEFT_LABEL),
        // Appel de getSelectedTeamDisplayName pour appliquer l'action prévue.
        rightName: getSelectedTeamDisplayName("gow-player2-skin-ui", DEFAULT_RIGHT_LABEL)
    // Fermeture du bloc ou de l'appel.
    };
// Fermeture du bloc ou de l'appel.
}

// Fonction getVersusScoreboardLabels : elle regroupe le traitement de cette partie.
export function getVersusScoreboardLabels() {
    // Valeur mémorisée dans names.
    const names = getVersusTeamLabels();
    // Résultat renvoyé par la fonction.
    return {
        // Appel de getTeamShortLabel pour appliquer l'action prévue.
        left: getTeamShortLabel(names.leftName, DEFAULT_LEFT_LABEL.slice(0, 2)),
        // Appel de getTeamShortLabel pour appliquer l'action prévue.
        right: getTeamShortLabel(names.rightName, DEFAULT_RIGHT_LABEL.slice(0, 2))
    // Fermeture du bloc ou de l'appel.
    };
// Fermeture du bloc ou de l'appel.
}
