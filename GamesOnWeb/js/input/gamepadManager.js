// Ouverture du bloc correspondant.
export const gamepadState = {
    // Paramètre de l'appel ou valeur de configuration.
    index: null,
    // Paramètre de l'appel ou valeur de configuration.
    lastShootPressed: false,
    // Paramètre de l'appel ou valeur de configuration.
    lastTacklePressed: false,
    // Paramètre de l'appel ou valeur de configuration.
    lastL1Pressed: false,
    // Paramètre de l'appel ou valeur de configuration.
    lastR1Pressed: false,
    // Paramètre de l'appel ou valeur de configuration.
    lastOptionsPressed: false,
    // Instruction nécessaire au déroulement de cette partie.
    lastSkipPressed: false
// Fermeture du bloc ou de l'appel.
};

// Fonction getActiveGamepad : elle regroupe le traitement de cette partie.
export function getActiveGamepad() {
    // Valeur mémorisée dans pads.
    const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
    // Vérification avant d'exécuter la suite.
    if (gamepadState.index !== null && pads[gamepadState.index]) {
        // Résultat renvoyé par la fonction.
        return pads[gamepadState.index];
    // Fermeture du bloc ou de l'appel.
    }
    // Parcours de plusieurs valeurs.
    for (let i = 0; i < pads.length; i += 1) {
        // Vérification avant d'exécuter la suite.
        if (pads[i]) return pads[i];
    // Fermeture du bloc ou de l'appel.
    }
    // Résultat renvoyé par la fonction.
    return null;
// Fermeture du bloc ou de l'appel.
}

// Fonction getPrimaryStick : elle regroupe le traitement de cette partie.
export function getPrimaryStick(axes) {
    // Valeur mémorisée dans list.
    const list = Array.isArray(axes) ? axes : [];
    // Vérification avant d'exécuter la suite.
    if (list.length < 2) return { x: 0, y: 0 };

    // Vérification avant d'exécuter la suite.
    if (list.length >= 4) {
        // Valeur mémorisée dans mag01.
        const mag01 = Math.abs(list[0]) + Math.abs(list[1]);
        // Valeur mémorisée dans mag23.
        const mag23 = Math.abs(list[2]) + Math.abs(list[3]);
        // Vérification avant d'exécuter la suite.
        if (mag23 > mag01 * 1.2) {
            // Résultat renvoyé par la fonction.
            return { x: list[2], y: list[3] };
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return { x: list[0], y: list[1] };
// Fermeture du bloc ou de l'appel.
}

// Fonction setupGamepadNotifications : elle regroupe le traitement de cette partie.
export function setupGamepadNotifications() {
    // Récupération de l'élément HTML notif.
    const notif = document.getElementById("gamepad-notif");
    // Récupération de l'élément HTML notifName.
    const notifName = document.getElementById("gamepad-name");
    // Récupération de l'élément HTML menu.
    const menu = document.getElementById("main-menu");
    // Vérification avant d'exécuter la suite.
    if (!notif || !notifName) return;

    // Valeur mémorisée dans hideTimeout.
    let hideTimeout = null;

    // Fonction showNotif : elle regroupe le traitement de cette partie.
    function showNotif(message, durationMs) {
        // Vérification avant d'exécuter la suite.
        if (menu && (menu.classList.contains("is-hidden") || menu.getAttribute("aria-hidden") === "true")) {
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }
        // Mise à jour de textContent.
        notifName.textContent = message;
        // Mise à jour de display.
        notif.style.display = "flex";
        // Vérification avant d'exécuter la suite.
        if (hideTimeout) window.clearTimeout(hideTimeout);
        // Appel de setTimeout pour appliquer l'action prévue.
        hideTimeout = window.setTimeout(function () {
            // Mise à jour de display.
            notif.style.display = "none";
        // Instruction nécessaire au déroulement de cette partie.
        }, durationMs || 3000);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction shortName : elle regroupe le traitement de cette partie.
    function shortName(id) {
        // Vérification avant d'exécuter la suite.
        if (!id) return "Manette";
        // Résultat renvoyé par la fonction.
        return id.length > 30 ? id.substring(0, 30) + "..." : id;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleConnect : elle regroupe le traitement de cette partie.
    function handleConnect(gamepad) {
        // Vérification avant d'exécuter la suite.
        if (!gamepad) return;
        // Vérification avant d'exécuter la suite.
        if (typeof gamepad.index === "number") {
            // Mise à jour de index.
            gamepadState.index = gamepad.index;
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de showNotif pour appliquer l'action prévue.
        showNotif(shortName(gamepad.id) + " connectee !");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleDisconnect : elle regroupe le traitement de cette partie.
    function handleDisconnect(gamepad) {
        // Vérification avant d'exécuter la suite.
        if (!gamepad) return;
        // Vérification avant d'exécuter la suite.
        if (typeof gamepad.index === "number" && gamepadState.index === gamepad.index) {
            // Mise à jour de index.
            gamepadState.index = null;
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de showNotif pour appliquer l'action prévue.
        showNotif(shortName(gamepad.id) + " deconnectee !");
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (window.BABYLON && BABYLON.GamepadManager) {
        // Création de gamepadManager.
        const gamepadManager = new BABYLON.GamepadManager();
        // Appel de add pour appliquer l'action prévue.
        gamepadManager.onGamepadConnectedObservable.add(handleConnect);
        // Appel de add pour appliquer l'action prévue.
        gamepadManager.onGamepadDisconnectedObservable.add(handleDisconnect);
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("gamepadconnected", function (event) {
        // Appel de handleConnect pour appliquer l'action prévue.
        handleConnect(event.gamepad);
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("gamepaddisconnected", function (event) {
        // Appel de handleDisconnect pour appliquer l'action prévue.
        handleDisconnect(event.gamepad);
    // Fermeture du bloc ou de l'appel.
    });

    // Fonction scanExistingGamepads : elle regroupe le traitement de cette partie.
    function scanExistingGamepads() {
        // Valeur mémorisée dans pads.
        const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < pads.length; i += 1) {
            // Vérification avant d'exécuter la suite.
            if (pads[i] && pads[i].connected) {
                // Appel de showNotif pour appliquer l'action prévue.
                showNotif(shortName(pads[i].id) + " connectee !", 4000);
                // Résultat renvoyé par la fonction.
                return true;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return false;
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de scanExistingGamepads pour appliquer l'action prévue.
    scanExistingGamepads();

    // Valeur mémorisée dans scanCount.
    let scanCount = 0;
    // Valeur mémorisée dans scanTimer.
    const scanTimer = window.setInterval(function () {
        // Instruction nécessaire au déroulement de cette partie.
        scanCount += 1;
        // Vérification avant d'exécuter la suite.
        if (scanExistingGamepads() || scanCount >= 10) {
            // Appel de clearInterval pour appliquer l'action prévue.
            window.clearInterval(scanTimer);
        // Fermeture du bloc ou de l'appel.
        }
    // Instruction nécessaire au déroulement de cette partie.
    }, 500);
// Fermeture du bloc ou de l'appel.
}
