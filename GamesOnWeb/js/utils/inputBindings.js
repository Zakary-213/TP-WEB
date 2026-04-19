// js/utils/inputBindings.js
// Centralized keybind storage + input controller

// Appel de function pour appliquer l'action prévue.
(function () {
    // Instruction nécessaire au déroulement de cette partie.
    "use strict";

    // Valeur mémorisée dans STORAGE_KEY.
    const STORAGE_KEY = "gow.keybinds.v1";
    // Valeur mémorisée dans STORAGE_KEY_P2.
    const STORAGE_KEY_P2 = "gow.keybinds.p2.v1";
    // Valeur mémorisée dans GAMEPAD_STORAGE_KEY.
    const GAMEPAD_STORAGE_KEY = "gow.gamepadbinds.v1";
    // Valeur mémorisée dans DEFAULTS.
    const DEFAULTS = {
        // Paramètre de l'appel ou valeur de configuration.
        forward: "z",
        // Paramètre de l'appel ou valeur de configuration.
        backward: "s",
        // Paramètre de l'appel ou valeur de configuration.
        left: "q",
        // Paramètre de l'appel ou valeur de configuration.
        right: "d",
        // Paramètre de l'appel ou valeur de configuration.
        sprint: "Shift",
        // Paramètre de l'appel ou valeur de configuration.
        shoot: "Space",
        // Paramètre de l'appel ou valeur de configuration.
        tackle: "t",
        // Paramètre de l'appel ou valeur de configuration.
        switchLeft: "a",
        // Instruction nécessaire au déroulement de cette partie.
        switchRight: "e"
    // Fermeture du bloc ou de l'appel.
    };
    // Touches par défaut du joueur 2 : flèches + touches dédiées
    // Complètement séparées de celles du joueur 1 (ZQSD)
    // Valeur mémorisée dans DEFAULTS_P2.
    const DEFAULTS_P2 = {
        // Paramètre de l'appel ou valeur de configuration.
        forward: "ArrowUp",
        // Paramètre de l'appel ou valeur de configuration.
        backward: "ArrowDown",
        // Paramètre de l'appel ou valeur de configuration.
        left: "ArrowLeft",
        // Paramètre de l'appel ou valeur de configuration.
        right: "ArrowRight",
        // Paramètre de l'appel ou valeur de configuration.
        sprint: "RShift",
        // Paramètre de l'appel ou valeur de configuration.
        shoot: "Enter",
        // Paramètre de l'appel ou valeur de configuration.
        tackle: "NumpadDecimal",
        // Paramètre de l'appel ou valeur de configuration.
        switchLeft: "Numpad4",
        // Instruction nécessaire au déroulement de cette partie.
        switchRight: "Numpad6"
    // Fermeture du bloc ou de l'appel.
    };
    // Valeur mémorisée dans DEFAULT_GAMEPAD.
    const DEFAULT_GAMEPAD = {
        // Paramètre de l'appel ou valeur de configuration.
        shoot: 0,
        // Paramètre de l'appel ou valeur de configuration.
        sprint: 7,
        // Paramètre de l'appel ou valeur de configuration.
        tackle: 2,
        // Paramètre de l'appel ou valeur de configuration.
        switchLeft: 4,
        // Paramètre de l'appel ou valeur de configuration.
        switchRight: 5,
        // Instruction nécessaire au déroulement de cette partie.
        options: 9
    // Fermeture du bloc ou de l'appel.
    };

    // Valeur mémorisée dans bindings.
    let bindings = loadBindings();
    // Valeur mémorisée dans player2Bindings.
    let player2Bindings = loadPlayer2Bindings();
    // Valeur mémorisée dans gamepadBindings.
    let gamepadBindings = loadGamepadBindings();

    // Fonction loadBindings : elle regroupe le traitement de cette partie.
    function loadBindings() {
        // Partie protégée en cas d'erreur.
        try {
            // Valeur mémorisée dans raw.
            const raw = localStorage.getItem(STORAGE_KEY);
            // Vérification avant d'exécuter la suite.
            if (!raw) return { ...DEFAULTS };
            // Valeur mémorisée dans parsed.
            const parsed = JSON.parse(raw);
            // Résultat renvoyé par la fonction.
            return { ...DEFAULTS, ...(parsed || {}) };
        // Gestion de l'erreur si le try échoue.
        } catch (err) {
            // Résultat renvoyé par la fonction.
            return { ...DEFAULTS };
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction saveBindings : elle regroupe le traitement de cette partie.
    function saveBindings() {
        // Partie protégée en cas d'erreur.
        try {
            // Appel de setItem pour appliquer l'action prévue.
            localStorage.setItem(STORAGE_KEY, JSON.stringify(bindings));
        // Gestion de l'erreur si le try échoue.
        } catch (err) {
            // ignore storage failures
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction loadPlayer2Bindings : elle regroupe le traitement de cette partie.
    function loadPlayer2Bindings() {
        // Partie protégée en cas d'erreur.
        try {
            // Valeur mémorisée dans raw.
            const raw = localStorage.getItem(STORAGE_KEY_P2);
            // Vérification avant d'exécuter la suite.
            if (!raw) return { ...DEFAULTS_P2 };
            // Valeur mémorisée dans parsed.
            const parsed = JSON.parse(raw) || {};
            // Migration : si les touches sauvegardées sont identiques aux anciens
            // défauts J1 (forward=z, backward=s, left=q, right=d), on remet les
            // nouveaux défauts J2 (touches fléchées) pour éviter les conflits.
            // Valeur mémorisée dans isOldP1Default.
            const isOldP1Default =
                // Appel de toLowerCase pour appliquer l'action prévue.
                (parsed.forward || "").toLowerCase() === "z" &&
                // Appel de toLowerCase pour appliquer l'action prévue.
                (parsed.backward || "").toLowerCase() === "s" &&
                // Appel de toLowerCase pour appliquer l'action prévue.
                (parsed.left || "").toLowerCase() === "q" &&
                // Appel de toLowerCase pour appliquer l'action prévue.
                (parsed.right || "").toLowerCase() === "d";
            // Vérification avant d'exécuter la suite.
            if (isOldP1Default) {
                // Résultat renvoyé par la fonction.
                return { ...DEFAULTS_P2 };
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return { ...DEFAULTS_P2, ...parsed };
        // Gestion de l'erreur si le try échoue.
        } catch (err) {
            // Résultat renvoyé par la fonction.
            return { ...DEFAULTS_P2 };
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction savePlayer2Bindings : elle regroupe le traitement de cette partie.
    function savePlayer2Bindings() {
        // Partie protégée en cas d'erreur.
        try {
            // Appel de setItem pour appliquer l'action prévue.
            localStorage.setItem(STORAGE_KEY_P2, JSON.stringify(player2Bindings));
        // Gestion de l'erreur si le try échoue.
        } catch (err) {
            // ignore storage failures
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction loadGamepadBindings : elle regroupe le traitement de cette partie.
    function loadGamepadBindings() {
        // Partie protégée en cas d'erreur.
        try {
            // Valeur mémorisée dans raw.
            const raw = localStorage.getItem(GAMEPAD_STORAGE_KEY);
            // Vérification avant d'exécuter la suite.
            if (!raw) return { ...DEFAULT_GAMEPAD };
            // Valeur mémorisée dans parsed.
            const parsed = JSON.parse(raw);
            // Résultat renvoyé par la fonction.
            return { ...DEFAULT_GAMEPAD, ...(parsed || {}) };
        // Gestion de l'erreur si le try échoue.
        } catch (err) {
            // Résultat renvoyé par la fonction.
            return { ...DEFAULT_GAMEPAD };
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction saveGamepadBindings : elle regroupe le traitement de cette partie.
    function saveGamepadBindings() {
        // Partie protégée en cas d'erreur.
        try {
            // Appel de setItem pour appliquer l'action prévue.
            localStorage.setItem(GAMEPAD_STORAGE_KEY, JSON.stringify(gamepadBindings));
        // Gestion de l'erreur si le try échoue.
        } catch (err) {
            // ignore storage failures
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction normalizeKeyValue : elle regroupe le traitement de cette partie.
    function normalizeKeyValue(value) {
        // Vérification avant d'exécuter la suite.
        if (!value) return null;
        // Vérification avant d'exécuter la suite.
        if (value === "Shift") return "Shift";
        // Vérification avant d'exécuter la suite.
        if (value === "ShiftLeft" || value === "ShiftRight" || value === "LShift" || value === "RShift") {
            // Résultat renvoyé par la fonction.
            return "Shift";
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (value === "Space") return "Space";
        // Vérification avant d'exécuter la suite.
        if (/^Key[A-Z]$/.test(value)) return value[3].toLowerCase();
        // Vérification avant d'exécuter la suite.
        if (value.length === 1) return value.toLowerCase();
        // Touches spéciales multi-caractères : ArrowUp, Enter, RShift, NumpadDecimal…
        // On les accepte telles quelles (la comparaison se fera via event.code)
        // Résultat renvoyé par la fonction.
        return value;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction valuesEqual : elle regroupe le traitement de cette partie.
    function valuesEqual(a, b) {
        // Vérification avant d'exécuter la suite.
        if (!a || !b) return false;
        // Vérification avant d'exécuter la suite.
        if (a === "Shift" || b === "Shift") return a === b;
        // Vérification avant d'exécuter la suite.
        if (a === "Space" || b === "Space") return a === b;
        // Résultat renvoyé par la fonction.
        return String(a).toLowerCase() === String(b).toLowerCase();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction findConflict : elle regroupe le traitement de cette partie.
    function findConflict(action, value) {
        // Valeur mémorisée dans keys.
        const keys = Object.keys(bindings);
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < keys.length; i += 1) {
            // Valeur mémorisée dans act.
            const act = keys[i];
            // Vérification avant d'exécuter la suite.
            if (act === action) continue;
            // Vérification avant d'exécuter la suite.
            if (valuesEqual(bindings[act], value)) return act;
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setBinding : elle regroupe le traitement de cette partie.
    function setBinding(action, value) {
        // Valeur mémorisée dans normalized.
        const normalized = normalizeKeyValue(value);
        // Vérification avant d'exécuter la suite.
        if (!normalized) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "invalid" };
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans conflictAction.
        const conflictAction = findConflict(action, normalized);
        // Vérification avant d'exécuter la suite.
        if (conflictAction) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "duplicate", conflictAction };
        // Fermeture du bloc ou de l'appel.
        }

        // Empêche de prendre une touche déjà utilisée par le joueur 2
        // Valeur mémorisée dans conflictP2.
        const conflictP2 = findPlayer2Conflict(null, normalized);
        // Vérification avant d'exécuter la suite.
        if (conflictP2) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "duplicate-p2", conflictAction: conflictP2 };
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        bindings = { ...bindings, [action]: normalized };
        // Appel de saveBindings pour appliquer l'action prévue.
        saveBindings();
        // Résultat renvoyé par la fonction.
        return { ok: true };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setBindings : elle regroupe le traitement de cette partie.
    function setBindings(next) {
        // Instruction nécessaire au déroulement de cette partie.
        bindings = { ...DEFAULTS, ...(next || {}) };
        // Appel de saveBindings pour appliquer l'action prévue.
        saveBindings();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction findPlayer2Conflict : elle regroupe le traitement de cette partie.
    function findPlayer2Conflict(action, value) {
        // Valeur mémorisée dans keys.
        const keys = Object.keys(player2Bindings);
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < keys.length; i += 1) {
            // Valeur mémorisée dans act.
            const act = keys[i];
            // Vérification avant d'exécuter la suite.
            if (act === action) continue;
            // Vérification avant d'exécuter la suite.
            if (valuesEqual(player2Bindings[act], value)) return act;
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setPlayer2Binding : elle regroupe le traitement de cette partie.
    function setPlayer2Binding(action, value) {
        // Valeur mémorisée dans normalized.
        const normalized = normalizeKeyValue(value);
        // Vérification avant d'exécuter la suite.
        if (!normalized) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "invalid" };
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans conflictAction.
        const conflictAction = findPlayer2Conflict(action, normalized);
        // Vérification avant d'exécuter la suite.
        if (conflictAction) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "duplicate", conflictAction };
        // Fermeture du bloc ou de l'appel.
        }

        // Empêche de prendre une touche déjà utilisée par le joueur 1
        // Valeur mémorisée dans conflictP1.
        const conflictP1 = findConflict(null, normalized);
        // Vérification avant d'exécuter la suite.
        if (conflictP1) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "duplicate-p1", conflictAction: conflictP1 };
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        player2Bindings = { ...player2Bindings, [action]: normalized };
        // Appel de savePlayer2Bindings pour appliquer l'action prévue.
        savePlayer2Bindings();
        // Résultat renvoyé par la fonction.
        return { ok: true };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setPlayer2Bindings : elle regroupe le traitement de cette partie.
    function setPlayer2Bindings(next) {
        // Instruction nécessaire au déroulement de cette partie.
        player2Bindings = { ...DEFAULTS_P2, ...(next || {}) };
        // Appel de savePlayer2Bindings pour appliquer l'action prévue.
        savePlayer2Bindings();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getPlayer2Bindings : elle regroupe le traitement de cette partie.
    function getPlayer2Bindings() {
        // Résultat renvoyé par la fonction.
        return { ...player2Bindings };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isValidGamepadButton : elle regroupe le traitement de cette partie.
    function isValidGamepadButton(value) {
        // Résultat renvoyé par la fonction.
        return Number.isInteger(value) && value >= 0 && value <= 17;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction findGamepadConflict : elle regroupe le traitement de cette partie.
    function findGamepadConflict(action, value) {
        // Valeur mémorisée dans keys.
        const keys = Object.keys(gamepadBindings);
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < keys.length; i += 1) {
            // Valeur mémorisée dans act.
            const act = keys[i];
            // Vérification avant d'exécuter la suite.
            if (act === action) continue;
            // Vérification avant d'exécuter la suite.
            if (gamepadBindings[act] === value) return act;
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setGamepadBinding : elle regroupe le traitement de cette partie.
    function setGamepadBinding(action, value) {
        // Vérification avant d'exécuter la suite.
        if (!isValidGamepadButton(value)) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "invalid" };
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans conflictAction.
        const conflictAction = findGamepadConflict(action, value);
        // Vérification avant d'exécuter la suite.
        if (conflictAction) {
            // Résultat renvoyé par la fonction.
            return { ok: false, reason: "duplicate", conflictAction };
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        gamepadBindings = { ...gamepadBindings, [action]: value };
        // Appel de saveGamepadBindings pour appliquer l'action prévue.
        saveGamepadBindings();
        // Résultat renvoyé par la fonction.
        return { ok: true };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setGamepadBindings : elle regroupe le traitement de cette partie.
    function setGamepadBindings(next) {
        // Instruction nécessaire au déroulement de cette partie.
        gamepadBindings = { ...DEFAULT_GAMEPAD, ...(next || {}) };
        // Appel de saveGamepadBindings pour appliquer l'action prévue.
        saveGamepadBindings();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getGamepadBindings : elle regroupe le traitement de cette partie.
    function getGamepadBindings() {
        // Résultat renvoyé par la fonction.
        return { ...gamepadBindings };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getBindings : elle regroupe le traitement de cette partie.
    function getBindings() {
        // Résultat renvoyé par la fonction.
        return { ...bindings };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isActionKey : elle regroupe le traitement de cette partie.
    function isActionKey(event, action) {
        // Valeur mémorisée dans bind.
        const bind = bindings[action];
        // Vérification avant d'exécuter la suite.
        if (!bind || !event) return false;
        // Vérification avant d'exécuter la suite.
        if (bind === "Space") return event.code === "Space";
        // Vérification avant d'exécuter la suite.
        if (bind === "Shift") return event.key === "Shift";
        // Résultat renvoyé par la fonction.
        return String(event.key || "").toLowerCase() === String(bind).toLowerCase();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getActionFromEvent : elle regroupe le traitement de cette partie.
    function getActionFromEvent(event, actions) {
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < actions.length; i += 1) {
            // Vérification avant d'exécuter la suite.
            if (isActionKey(event, actions[i])) return actions[i];
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction createInputController : elle regroupe le traitement de cette partie.
    function createInputController(config) {
        // Valeur mémorisée dans actions.
        const actions = (config && config.actions) || [
            // Paramètre de l'appel ou valeur de configuration.
            "forward",
            // Paramètre de l'appel ou valeur de configuration.
            "backward",
            // Paramètre de l'appel ou valeur de configuration.
            "left",
            // Paramètre de l'appel ou valeur de configuration.
            "right",
            // Paramètre de l'appel ou valeur de configuration.
            "sprint",
            // Paramètre de l'appel ou valeur de configuration.
            "shoot",
            // Paramètre de l'appel ou valeur de configuration.
            "switchLeft",
            // Paramètre de l'appel ou valeur de configuration.
            "switchRight",
            // Instruction nécessaire au déroulement de cette partie.
            "tackle"
        // Fermeture du bloc ou de l'appel.
        ];

        // Valeur mémorisée dans isBlocked.
        const isBlocked = (config && config.isBlocked) || function () { return false; };
        // Valeur mémorisée dans onPress.
        const onPress = (config && config.onPress) || function () {};
        // Valeur mémorisée dans onRelease.
        const onRelease = (config && config.onRelease) || function () {};

        // Fonction handleKeyDown : elle regroupe le traitement de cette partie.
        function handleKeyDown(event) {
            // Vérification avant d'exécuter la suite.
            if (isBlocked()) return;
            // Vérification avant d'exécuter la suite.
            if (event.repeat) return;
            // Valeur mémorisée dans action.
            const action = getActionFromEvent(event, actions);
            // Vérification avant d'exécuter la suite.
            if (!action) return;
            // Appel de onPress pour appliquer l'action prévue.
            onPress(action, event);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction handleKeyUp : elle regroupe le traitement de cette partie.
        function handleKeyUp(event) {
            // Vérification avant d'exécuter la suite.
            if (isBlocked()) return;
            // Valeur mémorisée dans action.
            const action = getActionFromEvent(event, actions);
            // Vérification avant d'exécuter la suite.
            if (!action) return;
            // Appel de onRelease pour appliquer l'action prévue.
            onRelease(action, event);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("keydown", handleKeyDown);
        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("keyup", handleKeyUp);

        // Résultat renvoyé par la fonction.
        return {
            // Appel de function pour appliquer l'action prévue.
            dispose: function () {
                // Appel de removeEventListener pour appliquer l'action prévue.
                window.removeEventListener("keydown", handleKeyDown);
                // Appel de removeEventListener pour appliquer l'action prévue.
                window.removeEventListener("keyup", handleKeyUp);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de inputBindings.
    window.inputBindings = {
        // Paramètre de l'appel ou valeur de configuration.
        DEFAULTS,
        // Paramètre de l'appel ou valeur de configuration.
        DEFAULTS_P2,
        // Paramètre de l'appel ou valeur de configuration.
        getBindings,
        // Paramètre de l'appel ou valeur de configuration.
        setBindings,
        // Paramètre de l'appel ou valeur de configuration.
        setBinding,
        // Paramètre de l'appel ou valeur de configuration.
        getPlayer2Bindings,
        // Paramètre de l'appel ou valeur de configuration.
        setPlayer2Bindings,
        // Paramètre de l'appel ou valeur de configuration.
        setPlayer2Binding,
        // Paramètre de l'appel ou valeur de configuration.
        isActionKey,
        // Paramètre de l'appel ou valeur de configuration.
        DEFAULT_GAMEPAD,
        // Paramètre de l'appel ou valeur de configuration.
        getGamepadBindings,
        // Paramètre de l'appel ou valeur de configuration.
        setGamepadBindings,
        // Instruction nécessaire au déroulement de cette partie.
        setGamepadBinding
    // Fermeture du bloc ou de l'appel.
    };

    // Mise à jour de createInputController.
    window.createInputController = createInputController;
// Instruction nécessaire au déroulement de cette partie.
})();
