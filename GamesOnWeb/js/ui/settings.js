// js/ui/settings.js
// Menu Paramètres — Échap pour ouvrir / fermer
// Pause gameplay + switch caméra depuis le panneau

// Appel de function pour appliquer l'action prévue.
(function () {
    // Instruction nécessaire au déroulement de cette partie.
    "use strict";

    // Valeur mémorisée dans isOpen.
    let isOpen = false;

    // Récupération de l'élément HTML overlay.
    const overlay    = document.getElementById("settings-overlay");
    // Récupération de l'élément HTML closeBtn.
    const closeBtn   = document.getElementById("settings-close-btn");
    // Récupération de l'élément HTML resumeBtn.
    const resumeBtn  = document.getElementById("settings-resume-btn");
    // Récupération de l'élément HTML quitBtn.
    const quitBtn    = document.getElementById("settings-quit-btn");
    // Récupération de l'élément HTML soundSlider.
    const soundSlider  = document.getElementById("set-sound-vol");
    // Récupération de l'élément HTML soundVal.
    const soundVal     = document.getElementById("set-sound-vol-val");
    // Récupération de l'élément HTML musicSlider.
    const musicSlider  = document.getElementById("set-music-vol");
    // Récupération de l'élément HTML musicVal.
    const musicVal     = document.getElementById("set-music-vol-val");
    // Récupération de l'élément HTML camBtns.
    const camBtns    = document.querySelectorAll(".settings-option-btn[data-cam]");
    // Récupération de l'élément HTML keybindBtns.
    const keybindBtns = document.querySelectorAll(".settings-keybind-btn[data-action]");
    // Récupération de l'élément HTML keybindP2Btns.
    const keybindP2Btns = document.querySelectorAll(".settings-keybind-btn[data-action-p2]");
    // Récupération de l'élément HTML gamepadBtns.
    const gamepadBtns = document.querySelectorAll(".settings-gamepad-btn[data-gamepad-action]");
    // Valeur mémorisée dans TPS_BASE_RADIUS.
    const TPS_BASE_RADIUS = 70;  // radius de base de la caméra TPS
    // Valeur mémorisée dans THIRD_BASE_RADIUS.
    const THIRD_BASE_RADIUS = 60;  // radius de base de la caméra 3e personne
    // Valeur mémorisée dans keybinds.
    let keybinds = {};
    // Valeur mémorisée dans gamepadBinds.
    let gamepadBinds = {};
    // Valeur mémorisée dans listeningAction.
    let listeningAction = null;
    // Valeur mémorisée dans listeningActionP2.
    let listeningActionP2 = null;
    // Valeur mémorisée dans listeningGamepadAction.
    let listeningGamepadAction = null;
    // Valeur mémorisée dans lastNavAt.
    let lastNavAt = 0;
    // Valeur mémorisée dans lastSubmitPressed.
    let lastSubmitPressed = false;
    // Valeur mémorisée dans lastBackPressed.
    let lastBackPressed = false;


    // ── Helpers caméra ─────────────────────────────────────────────
    // Fonction getActiveCamLabel : elle regroupe le traitement de cette partie.
    function getActiveCamLabel() {
        // Valeur mémorisée dans cams.
        var cams = window.gameCameras;
        // Valeur mémorisée dans scene.
        var scene = window.gameScene;
        // Vérification avant d'exécuter la suite.
        if (!cams || !scene) return null;
        // Vérification avant d'exécuter la suite.
        if (scene.activeCamera === cams.tpsCamera)          return "tps";
        // Vérification avant d'exécuter la suite.
        if (scene.activeCamera === cams.thirdPersonCamera) return "third";
        // Vérification avant d'exécuter la suite.
        if (scene.activeCamera === cams.broadcastCamera)    return "broadcast";
        // Vérification avant d'exécuter la suite.
        if (scene.activeCamera === cams.fpvCamera)          return "fpv";
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction syncCamButtons : elle regroupe le traitement de cette partie.
    function syncCamButtons() {
        // Valeur mémorisée dans current.
        var current = getActiveCamLabel();
        // Valeur mémorisée dans isVersus.
        var isVersus = typeof window.isVersusMode === "function" && window.isVersusMode();
        // Appel de forEach pour appliquer l'action prévue.
        camBtns.forEach(function (btn) {
            // Valeur mémorisée dans active.
            var active = btn.dataset.cam === current ||
                         // Instruction nécessaire au déroulement de cette partie.
                         (current === null && btn.dataset.cam === "broadcast");
            // Appel de toggle pour appliquer l'action prévue.
            btn.classList.toggle("active", active);
            // Vérification avant d'exécuter la suite.
            if (isVersus) {
                // Mise à jour de disabled.
                btn.disabled = btn.dataset.cam !== "broadcast";
                // Appel de toggle pour appliquer l'action prévue.
                btn.classList.toggle("is-locked", btn.dataset.cam !== "broadcast");
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Mise à jour de disabled.
                btn.disabled = false;
                // Appel de remove pour appliquer l'action prévue.
                btn.classList.remove("is-locked");
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction formatKeyLabel : elle regroupe le traitement de cette partie.
    function formatKeyLabel(value) {
        // Vérification avant d'exécuter la suite.
        if (!value) return "-";
        // Vérification avant d'exécuter la suite.
        if (value === "Space") return "Space";
        // Vérification avant d'exécuter la suite.
        if (value === "Shift") return "Shift";
        // Touches spéciales
        // Valeur mémorisée dans SPECIAL.
        const SPECIAL = {
            // Paramètre de l'appel ou valeur de configuration.
            "arrowup": "↑",
            // Paramètre de l'appel ou valeur de configuration.
            "arrowdown": "↓",
            // Paramètre de l'appel ou valeur de configuration.
            "arrowleft": "←",
            // Paramètre de l'appel ou valeur de configuration.
            "arrowright": "→",
            // Paramètre de l'appel ou valeur de configuration.
            "enter": "Entrée",
            // Paramètre de l'appel ou valeur de configuration.
            "rshift": "Shift►",
            // Paramètre de l'appel ou valeur de configuration.
            "shiftright": "Shift►",
            // Paramètre de l'appel ou valeur de configuration.
            "numpaddecimal": "Num .",
            // Paramètre de l'appel ou valeur de configuration.
            "numpad4": "Num 4",
            // Instruction nécessaire au déroulement de cette partie.
            "numpad6": "Num 6"
        // Fermeture du bloc ou de l'appel.
        };
        // Valeur mémorisée dans lc.
        const lc = value.toLowerCase();
        // Vérification avant d'exécuter la suite.
        if (SPECIAL[lc]) return SPECIAL[lc];
        // Vérification avant d'exécuter la suite.
        if (value.length === 1) return value.toUpperCase();
        // Résultat renvoyé par la fonction.
        return value;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction syncKeybindButtons : elle regroupe le traitement de cette partie.
    function syncKeybindButtons() {
        // Appel de forEach pour appliquer l'action prévue.
        keybindBtns.forEach(function (btn) {
            // Valeur mémorisée dans action.
            const action = btn.dataset.action;
            // Mise à jour de textContent.
            btn.textContent = formatKeyLabel(keybinds[action]);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans player2Binds.
    let player2Binds = {};

    // Fonction syncKeybindP2Buttons : elle regroupe le traitement de cette partie.
    function syncKeybindP2Buttons() {
        // Appel de forEach pour appliquer l'action prévue.
        keybindP2Btns.forEach(function (btn) {
            // Valeur mémorisée dans action.
            const action = btn.dataset.actionP2;
            // Mise à jour de textContent.
            btn.textContent = formatKeyLabel(player2Binds[action]);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction formatGamepadLabel : elle regroupe le traitement de cette partie.
    function formatGamepadLabel(value) {
        // Valeur mémorisée dans map.
        var map = {
            // Paramètre de l'appel ou valeur de configuration.
            0: "X",
            // Paramètre de l'appel ou valeur de configuration.
            1: "O",
            // Paramètre de l'appel ou valeur de configuration.
            2: "Carre",
            // Paramètre de l'appel ou valeur de configuration.
            3: "Triangle",
            // Paramètre de l'appel ou valeur de configuration.
            4: "L1",
            // Paramètre de l'appel ou valeur de configuration.
            5: "R1",
            // Paramètre de l'appel ou valeur de configuration.
            6: "L2",
            // Paramètre de l'appel ou valeur de configuration.
            7: "R2",
            // Paramètre de l'appel ou valeur de configuration.
            8: "Share",
            // Paramètre de l'appel ou valeur de configuration.
            9: "Options",
            // Paramètre de l'appel ou valeur de configuration.
            10: "L3",
            // Paramètre de l'appel ou valeur de configuration.
            11: "R3",
            // Paramètre de l'appel ou valeur de configuration.
            12: "Haut",
            // Paramètre de l'appel ou valeur de configuration.
            13: "Bas",
            // Paramètre de l'appel ou valeur de configuration.
            14: "Gauche",
            // Instruction nécessaire au déroulement de cette partie.
            15: "Droite"
        // Fermeture du bloc ou de l'appel.
        };
        // Vérification avant d'exécuter la suite.
        if (!Number.isInteger(value)) return "-";
        // Résultat renvoyé par la fonction.
        return map[value] || ("Btn" + value);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction syncGamepadButtons : elle regroupe le traitement de cette partie.
    function syncGamepadButtons() {
        // Appel de forEach pour appliquer l'action prévue.
        gamepadBtns.forEach(function (btn) {
            // Valeur mémorisée dans action.
            const action = btn.dataset.gamepadAction;
            // Mise à jour de textContent.
            btn.textContent = formatGamepadLabel(gamepadBinds[action]);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setListeningButton : elle regroupe le traitement de cette partie.
    function setListeningButton(nextAction) {
        // Appel de forEach pour appliquer l'action prévue.
        keybindBtns.forEach(function (btn) {
            // Appel de toggle pour appliquer l'action prévue.
            btn.classList.toggle("is-listening", btn.dataset.action === nextAction);
            // Vérification avant d'exécuter la suite.
            if (btn.dataset.action === nextAction) {
                // Mise à jour de textContent.
                btn.textContent = "Appuie...";
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setListeningP2Button : elle regroupe le traitement de cette partie.
    function setListeningP2Button(nextAction) {
        // Appel de forEach pour appliquer l'action prévue.
        keybindP2Btns.forEach(function (btn) {
            // Valeur mémorisée dans act.
            const act = btn.dataset.actionP2;
            // Appel de toggle pour appliquer l'action prévue.
            btn.classList.toggle("is-listening", act === nextAction);
            // Vérification avant d'exécuter la suite.
            if (act === nextAction) {
                // Mise à jour de textContent.
                btn.textContent = "Appuie...";
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setListeningGamepadButton : elle regroupe le traitement de cette partie.
    function setListeningGamepadButton(nextAction) {
        // Appel de forEach pour appliquer l'action prévue.
        gamepadBtns.forEach(function (btn) {
            // Appel de toggle pour appliquer l'action prévue.
            btn.classList.toggle("is-listening", btn.dataset.gamepadAction === nextAction);
            // Vérification avant d'exécuter la suite.
            if (btn.dataset.gamepadAction === nextAction) {
                // Mise à jour de textContent.
                btn.textContent = "Appuie...";
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction captureKey : elle regroupe le traitement de cette partie.
    function captureKey(event) {
        // Vérification avant d'exécuter la suite.
        if (!listeningAction) return;
        // Appel de preventDefault pour appliquer l'action prévue.
        event.preventDefault();

        // Vérification avant d'exécuter la suite.
        if (event.key === "Escape") {
            // Instruction nécessaire au déroulement de cette partie.
            listeningAction = null;
            // Appel de setListeningButton pour appliquer l'action prévue.
            setListeningButton(null);
            // Appel de syncKeybindButtons pour appliquer l'action prévue.
            syncKeybindButtons();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans value.
        let value = null;
        // Vérification avant d'exécuter la suite.
        if (event.key === "Shift") {
            // Instruction nécessaire au déroulement de cette partie.
            value = "Shift";
        // Deuxième possibilité à tester.
        } else if (event.code === "Space") {
            // Instruction nécessaire au déroulement de cette partie.
            value = "Space";
        // Deuxième possibilité à tester.
        } else if (event.key && event.key.length === 1) {
            // Appel de toLowerCase pour appliquer l'action prévue.
            value = event.key.toLowerCase();
        // Deuxième possibilité à tester.
        } else if (event.key) {
            // Instruction nécessaire au déroulement de cette partie.
            value = event.key;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!value) return;

        // Valeur mémorisée dans inputBindings.
        var inputBindings = window.inputBindings;
        // Vérification avant d'exécuter la suite.
        if (!inputBindings || typeof inputBindings.setBinding !== "function") return;

        // Valeur mémorisée dans result.
        var result = inputBindings.setBinding(listeningAction, value);
        // Vérification avant d'exécuter la suite.
        if (!result.ok) {
            // Valeur mémorisée dans currentAction.
            var currentAction = listeningAction;
            // Appel de setListeningButton pour appliquer l'action prévue.
            setListeningButton(null);
            // Instruction nécessaire au déroulement de cette partie.
            listeningAction = null;
            // Vérification avant d'exécuter la suite.
            if (currentAction) {
                // Récupération de l'élément HTML btn.
                var btn = document.querySelector(
                    // Instruction nécessaire au déroulement de cette partie.
                    '.settings-keybind-btn[data-action="' + currentAction + '"]'
                // Fermeture du bloc ou de l'appel.
                );
                // Vérification avant d'exécuter la suite.
                if (btn) {
                    // Mise à jour de textContent.
                    btn.textContent = "Deja pris";
                    // Appel de setTimeout pour appliquer l'action prévue.
                    window.setTimeout(function () {
                        // Appel de syncKeybindButtons pour appliquer l'action prévue.
                        syncKeybindButtons();
                    // Instruction nécessaire au déroulement de cette partie.
                    }, 800);
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (typeof inputBindings.getBindings === "function") {
            // Appel de getBindings pour appliquer l'action prévue.
            keybinds = inputBindings.getBindings();
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        listeningAction = null;
        // Appel de setListeningButton pour appliquer l'action prévue.
        setListeningButton(null);
        // Appel de syncKeybindButtons pour appliquer l'action prévue.
        syncKeybindButtons();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction captureKeyP2 : elle regroupe le traitement de cette partie.
    function captureKeyP2(event) {
        // Vérification avant d'exécuter la suite.
        if (!listeningActionP2) return;
        // Appel de preventDefault pour appliquer l'action prévue.
        event.preventDefault();

        // Vérification avant d'exécuter la suite.
        if (event.key === "Escape") {
            // Instruction nécessaire au déroulement de cette partie.
            listeningActionP2 = null;
            // Appel de setListeningP2Button pour appliquer l'action prévue.
            setListeningP2Button(null);
            // Appel de syncKeybindP2Buttons pour appliquer l'action prévue.
            syncKeybindP2Buttons();
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Préférer event.code pour les touches spéciales (flèches, Enter, Numpad...)
        // Valeur mémorisée dans value.
        let value = null;
        // Vérification avant d'exécuter la suite.
        if (event.code && event.code !== "" && event.code !== "Unidentified") {
            // Cas particuliers simples basés sur event.key
            // Vérification avant d'exécuter la suite.
            if (event.key === "Shift") {
                // Instruction nécessaire au déroulement de cette partie.
                value = event.code; // "ShiftLeft" ou "ShiftRight"
            // Deuxième possibilité à tester.
            } else if (event.code === "Space") {
                // Instruction nécessaire au déroulement de cette partie.
                value = "Space";
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Instruction nécessaire au déroulement de cette partie.
                value = event.code; // "ArrowUp", "Enter", "KeyZ", "Numpad4"...
            // Fermeture du bloc ou de l'appel.
            }
        // Deuxième possibilité à tester.
        } else if (event.key && event.key.length === 1) {
            // Appel de toLowerCase pour appliquer l'action prévue.
            value = event.key.toLowerCase();
        // Deuxième possibilité à tester.
        } else if (event.key) {
            // Instruction nécessaire au déroulement de cette partie.
            value = event.key;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!value) return;

        // Valeur mémorisée dans inputBindings.
        var inputBindings = window.inputBindings;
        // Vérification avant d'exécuter la suite.
        if (!inputBindings || typeof inputBindings.setPlayer2Binding !== "function") return;

        // Valeur mémorisée dans result.
        var result = inputBindings.setPlayer2Binding(listeningActionP2, value);
        // Vérification avant d'exécuter la suite.
        if (!result.ok) {
            // Valeur mémorisée dans currentAction.
            var currentAction = listeningActionP2;
            // Appel de setListeningP2Button pour appliquer l'action prévue.
            setListeningP2Button(null);
            // Instruction nécessaire au déroulement de cette partie.
            listeningActionP2 = null;
            // Vérification avant d'exécuter la suite.
            if (currentAction) {
                // Récupération de l'élément HTML btns.
                var btns = document.querySelectorAll(
                    // Instruction nécessaire au déroulement de cette partie.
                    '.settings-keybind-btn[data-action-p2="' + currentAction + '"]'
                // Fermeture du bloc ou de l'appel.
                );
                // Appel de forEach pour appliquer l'action prévue.
                btns.forEach(function (btn) {
                    // Mise à jour de textContent.
                    btn.textContent = "Déjà pris";
                // Fermeture du bloc ou de l'appel.
                });
                // Appel de setTimeout pour appliquer l'action prévue.
                window.setTimeout(function () { syncKeybindP2Buttons(); }, 800);
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (typeof inputBindings.getPlayer2Bindings === "function") {
            // Appel de getPlayer2Bindings pour appliquer l'action prévue.
            player2Binds = inputBindings.getPlayer2Bindings();
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        listeningActionP2 = null;
        // Appel de setListeningP2Button pour appliquer l'action prévue.
        setListeningP2Button(null);
        // Appel de syncKeybindP2Buttons pour appliquer l'action prévue.
        syncKeybindP2Buttons();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction captureGamepadBinding : elle regroupe le traitement de cette partie.
    function captureGamepadBinding() {
        // Vérification avant d'exécuter la suite.
        if (!listeningGamepadAction) return;
        // Valeur mémorisée dans pads.
        var pads = (navigator.getGamepads && navigator.getGamepads()) || [];
        // Valeur mémorisée dans pad.
        var pad = pads.find(function (p) { return p && p.connected; }) || null;
        // Vérification avant d'exécuter la suite.
        if (!pad || !pad.buttons) return;

        // Valeur mémorisée dans pressedIndex.
        var pressedIndex = -1;
        // Parcours de plusieurs valeurs.
        for (var i = 0; i < pad.buttons.length; i += 1) {
            // Vérification avant d'exécuter la suite.
            if (pad.buttons[i] && pad.buttons[i].pressed) {
                // Instruction nécessaire au déroulement de cette partie.
                pressedIndex = i;
                // Sortie immédiate du bloc en cours.
                break;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (pressedIndex < 0) return;

        // Valeur mémorisée dans inputBindings.
        var inputBindings = window.inputBindings;
        // Vérification avant d'exécuter la suite.
        if (!inputBindings || typeof inputBindings.setGamepadBinding !== "function") return;

        // Valeur mémorisée dans result.
        var result = inputBindings.setGamepadBinding(listeningGamepadAction, pressedIndex);
        // Vérification avant d'exécuter la suite.
        if (!result.ok) {
            // Valeur mémorisée dans currentAction.
            var currentAction = listeningGamepadAction;
            // Appel de setListeningGamepadButton pour appliquer l'action prévue.
            setListeningGamepadButton(null);
            // Instruction nécessaire au déroulement de cette partie.
            listeningGamepadAction = null;
            // Vérification avant d'exécuter la suite.
            if (currentAction) {
                // Récupération de l'élément HTML btn.
                var btn = document.querySelector(
                    // Instruction nécessaire au déroulement de cette partie.
                    '.settings-gamepad-btn[data-gamepad-action="' + currentAction + '"]'
                // Fermeture du bloc ou de l'appel.
                );
                // Vérification avant d'exécuter la suite.
                if (btn) {
                    // Mise à jour de textContent.
                    btn.textContent = "Deja pris";
                    // Appel de setTimeout pour appliquer l'action prévue.
                    window.setTimeout(function () {
                        // Appel de syncGamepadButtons pour appliquer l'action prévue.
                        syncGamepadButtons();
                    // Instruction nécessaire au déroulement de cette partie.
                    }, 800);
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (typeof inputBindings.getGamepadBindings === "function") {
            // Appel de getGamepadBindings pour appliquer l'action prévue.
            gamepadBinds = inputBindings.getGamepadBindings();
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        listeningGamepadAction = null;
        // Appel de setListeningGamepadButton pour appliquer l'action prévue.
        setListeningGamepadButton(null);
        // Appel de syncGamepadButtons pour appliquer l'action prévue.
        syncGamepadButtons();
    // Fermeture du bloc ou de l'appel.
    }

    // ── Appliquer le zoom actuel à la caméra active ────────────────
    // Fonction applyCurrentZoom : elle regroupe le traitement de cette partie.
    function applyCurrentZoom() {
        // Récupération de l'élément HTML slider.
        var slider = document.getElementById("set-cam-zoom");
        // Vérification avant d'exécuter la suite.
        if (!slider) return;
        // Valeur mémorisée dans offset.
        var offset = Number(slider.value);
        // Vérification avant d'exécuter la suite.
        if (window.cameraRuntime && typeof window.cameraRuntime.setZoomOffset === "function") {
            // Appel de setZoomOffset pour appliquer l'action prévue.
            window.cameraRuntime.setZoomOffset(offset);
        // Fermeture du bloc ou de l'appel.
        }
        // Valeur mémorisée dans cams.
        var cams = window.gameCameras;
        // Vérification avant d'exécuter la suite.
        if (cams && cams.tpsCamera) {
            // Mise à jour de radius.
            cams.tpsCamera.radius = TPS_BASE_RADIUS - offset;
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (cams && cams.thirdPersonCamera) {
            // Mise à jour de radius.
            cams.thirdPersonCamera.radius = THIRD_BASE_RADIUS - offset;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction switchCamera : elle regroupe le traitement de cette partie.
    function switchCamera(camLabel) {
        // Valeur mémorisée dans cams.
        var cams  = window.gameCameras;
        // Valeur mémorisée dans scene.
        var scene = window.gameScene;
        // Vérification avant d'exécuter la suite.
        if (!cams || !scene) return;

        // Vérification avant d'exécuter la suite.
        if (typeof window.isVersusMode === "function" && window.isVersusMode()) {
            // Instruction nécessaire au déroulement de cette partie.
            camLabel = "broadcast";
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (camLabel === "broadcast" && cams.broadcastCamera) {
            // Mise à jour de activeCamera.
            scene.activeCamera = cams.broadcastCamera;
        // Deuxième possibilité à tester.
        } else if (camLabel === "tps" && cams.tpsCamera) {
            // Mise à jour de activeCamera.
            scene.activeCamera = cams.tpsCamera;
        // Deuxième possibilité à tester.
        } else if (camLabel === "third" && cams.thirdPersonCamera) {
            // Mise à jour de activeCamera.
            scene.activeCamera = cams.thirdPersonCamera;
        // Deuxième possibilité à tester.
        } else if (camLabel === "fpv" && cams.fpvCamera) {
            // Mise à jour de activeCamera.
            scene.activeCamera = cams.fpvCamera;
            // Valeur mémorisée dans ap.
            var ap = typeof window.getActivePlayer === "function" ? window.getActivePlayer() : null;
            // Vérification avant d'exécuter la suite.
            if (window.cameraRuntime && typeof window.cameraRuntime.handleCameraToggle === "function") {
                // Vérification avant d'exécuter la suite.
                if (ap) window.cameraRuntime.handleCameraToggle(ap);
            // Deuxième possibilité à tester.
            } else if (typeof cams.alignFpvToDirection === "function") {
                // Vérification avant d'exécuter la suite.
                if (ap && ap.facingDirection) cams.alignFpvToDirection(ap.facingDirection);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
        // Réappliquer le zoom — évite le reset du radius après changement de caméra
        // Appel de applyCurrentZoom pour appliquer l'action prévue.
        applyCurrentZoom();
        // Appel de syncCamButtons pour appliquer l'action prévue.
        syncCamButtons();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isInGameContext : elle regroupe le traitement de cette partie.
    function isInGameContext() {
        // Récupération de l'élément HTML mainMenu.
        var mainMenu = document.getElementById("main-menu");
        // Vérification avant d'exécuter la suite.
        if (!mainMenu) return true;
        // Résultat renvoyé par la fonction.
        return mainMenu.getAttribute("aria-hidden") === "true";
    // Fermeture du bloc ou de l'appel.
    }

    // ── Ouverture ──────────────────────────────────────────────────
    // Fonction open : elle regroupe le traitement de cette partie.
    function open() {
        // Vérification avant d'exécuter la suite.
        if (!overlay) return;
        // Bloqué pendant l'intro d'avant-match
        // Vérification avant d'exécuter la suite.
        if (typeof window.isIntroPlaying === "function" && window.isIntroPlaying()) return;
        // Instruction nécessaire au déroulement de cette partie.
        isOpen = true;
        // Instruction nécessaire au déroulement de cette partie.
        lastSubmitPressed = false;
        // Instruction nécessaire au déroulement de cette partie.
        lastBackPressed = false;
        // Appel de syncKeybindButtons pour appliquer l'action prévue.
        syncKeybindButtons();
        // Appel de syncKeybindP2Buttons pour appliquer l'action prévue.
        syncKeybindP2Buttons();
        // Appel de syncGamepadButtons pour appliquer l'action prévue.
        syncGamepadButtons();
        // Appel de syncCamButtons pour appliquer l'action prévue.
        syncCamButtons();

        // Valeur mémorisée dans isVersus.
        var isVersus = typeof window.isVersusMode === "function" && window.isVersusMode();
        // Récupération de l'élément HTML cameraRow.
        var cameraRow = document.querySelector(".settings-row-camera-mode");
        // Récupération de l'élément HTML p2Section.
        var p2Section = document.querySelector(".settings-section-p2");
        // Vérification avant d'exécuter la suite.
        if (cameraRow) cameraRow.style.display = isVersus ? "none" : "flex";
        // Vérification avant d'exécuter la suite.
        if (p2Section) p2Section.style.display = isVersus ? "block" : "none";
        // Vérification avant d'exécuter la suite.
        if (isVersus) {
            // Appel de switchCamera pour appliquer l'action prévue.
            switchCamera("broadcast");
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de add pour appliquer l'action prévue.
        overlay.classList.add("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        overlay.setAttribute("aria-hidden", "false");
        // Vérification avant d'exécuter la suite.
        if (typeof window.setGameplayPaused === "function") {
            // Appel de setGameplayPaused pour appliquer l'action prévue.
            window.setGameplayPaused(true);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // ── Fermeture ──────────────────────────────────────────────────
    // Fonction close : elle regroupe le traitement de cette partie.
    function close() {
        // Vérification avant d'exécuter la suite.
        if (!overlay) return;
        // Instruction nécessaire au déroulement de cette partie.
        isOpen = false;
        // Appel de remove pour appliquer l'action prévue.
        overlay.classList.remove("settings-overlay--open");
        // Appel de setAttribute pour appliquer l'action prévue.
        overlay.setAttribute("aria-hidden", "true");

        // Ne reprend le gameplay que si le match n'est pas terminé
        // Valeur mémorisée dans matchEnded.
        var matchEnded = typeof window.isMatchEnded === "function" && window.isMatchEnded();
        // Vérification avant d'exécuter la suite.
        if (!matchEnded && typeof window.setGameplayPaused === "function") {
            // Appel de setGameplayPaused pour appliquer l'action prévue.
            window.setGameplayPaused(false);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction toggle : elle regroupe le traitement de cette partie.
    function toggle() { isOpen ? close() : open(); }

    // Fonction isSettingsOpen : elle regroupe le traitement de cette partie.
    function isSettingsOpen() {
        // Résultat renvoyé par la fonction.
        return isOpen && overlay && overlay.getAttribute("aria-hidden") !== "true";
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getFocusableElements : elle regroupe le traitement de cette partie.
    function getFocusableElements() {
        // Vérification avant d'exécuter la suite.
        if (!overlay) return [];
        // Valeur mémorisée dans versusMode.
        var versusMode = typeof window.isVersusMode === "function" && window.isVersusMode();
        // Résultat renvoyé par la fonction.
        return Array.prototype.slice.call(
            // Appel de querySelectorAll pour appliquer l'action prévue.
            overlay.querySelectorAll(
                // Instruction nécessaire au déroulement de cette partie.
                versusMode
                    // Instruction nécessaire au déroulement de cette partie.
                    ? "button.settings-keybind-btn, button.settings-gamepad-btn, #settings-close-btn, #settings-resume-btn, #settings-quit-btn"
                    // Instruction nécessaire au déroulement de cette partie.
                    : "button.settings-option-btn, button.settings-keybind-btn, button.settings-gamepad-btn, #settings-close-btn, #settings-resume-btn, #settings-quit-btn"
            // Fermeture du bloc ou de l'appel.
            )
        // Fermeture du bloc ou de l'appel.
        );
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getFocusIndex : elle regroupe le traitement de cette partie.
    function getFocusIndex(list) {
        // Récupération de l'élément HTML active.
        var active = document.activeElement;
        // Valeur mémorisée dans idx.
        var idx = list.indexOf(active);
        // Résultat renvoyé par la fonction.
        return idx >= 0 ? idx : 0;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction focusAt : elle regroupe le traitement de cette partie.
    function focusAt(list, index) {
        // Vérification avant d'exécuter la suite.
        if (!list.length) return;
        // Valeur mémorisée dans i.
        var i = index % list.length;
        // Vérification avant d'exécuter la suite.
        if (i < 0) i += list.length;
        // Appel de focus pour appliquer l'action prévue.
        list[i].focus();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction moveFocus : elle regroupe le traitement de cette partie.
    function moveFocus(list, delta) {
        // Appel de focusAt pour appliquer l'action prévue.
        focusAt(list, getFocusIndex(list) + delta);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleSettingsNavKey : elle regroupe le traitement de cette partie.
    function handleSettingsNavKey(e) {
        // Vérification avant d'exécuter la suite.
        if (!isSettingsOpen() || listeningAction || listeningGamepadAction) return;
        // Valeur mémorisée dans list.
        var list = getFocusableElements();
        // Vérification avant d'exécuter la suite.
        if (!list.length) return;

        // Vérification avant d'exécuter la suite.
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            // Appel de preventDefault pour appliquer l'action prévue.
            e.preventDefault();
            // Appel de moveFocus pour appliquer l'action prévue.
            moveFocus(list, -1);
        // Deuxième possibilité à tester.
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            // Appel de preventDefault pour appliquer l'action prévue.
            e.preventDefault();
            // Appel de moveFocus pour appliquer l'action prévue.
            moveFocus(list, 1);
        // Deuxième possibilité à tester.
        } else if (e.key === "Enter" || e.key === " ") {
            // Récupération de l'élément HTML active.
            var active = document.activeElement;
            // Vérification avant d'exécuter la suite.
            if (active && typeof active.click === "function") {
                // Appel de preventDefault pour appliquer l'action prévue.
                e.preventDefault();
                // Appel de click pour appliquer l'action prévue.
                active.click();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getNavInputFromGamepad : elle regroupe le traitement de cette partie.
    function getNavInputFromGamepad(pad) {
        // Vérification avant d'exécuter la suite.
        if (!pad) return null;
        // Valeur mémorisée dans axes.
        var axes = pad.axes || [];
        // Valeur mémorisée dans deadzone.
        var deadzone = 0.4;
        // Valeur mémorisée dans axX.
        var axX = axes.length > 0 ? axes[0] : 0;
        // Valeur mémorisée dans axY.
        var axY = axes.length > 1 ? axes[1] : 0;

        // Vérification avant d'exécuter la suite.
        if (Math.abs(axY) > Math.abs(axX)) {
            // Vérification avant d'exécuter la suite.
            if (axY > deadzone) return "down";
            // Vérification avant d'exécuter la suite.
            if (axY < -deadzone) return "up";
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Vérification avant d'exécuter la suite.
            if (axX > deadzone) return "right";
            // Vérification avant d'exécuter la suite.
            if (axX < -deadzone) return "left";
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans btns.
        var btns = pad.buttons || [];
        // Vérification avant d'exécuter la suite.
        if (btns[12] && btns[12].pressed) return "up";
        // Vérification avant d'exécuter la suite.
        if (btns[13] && btns[13].pressed) return "down";
        // Vérification avant d'exécuter la suite.
        if (btns[14] && btns[14].pressed) return "left";
        // Vérification avant d'exécuter la suite.
        if (btns[15] && btns[15].pressed) return "right";

        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction pollSettingsGamepad : elle regroupe le traitement de cette partie.
    function pollSettingsGamepad() {
        // Vérification avant d'exécuter la suite.
        if (isSettingsOpen() && !listeningAction) {
            // Valeur mémorisée dans list.
            var list = getFocusableElements();
            // Vérification avant d'exécuter la suite.
            if (list.length) {
                // Valeur mémorisée dans pads.
                var pads = (navigator.getGamepads && navigator.getGamepads()) || [];
                // Valeur mémorisée dans pad.
                var pad = pads.find(function (p) { return p && p.connected; }) || null;
                // Valeur mémorisée dans nav.
                var nav = getNavInputFromGamepad(pad);
                // Valeur mémorisée dans now.
                var now = performance.now();
                // Vérification avant d'exécuter la suite.
                if (nav && now - lastNavAt > 180) {
                    // Instruction nécessaire au déroulement de cette partie.
                    lastNavAt = now;
                    // Vérification avant d'exécuter la suite.
                    if (nav === "left" || nav === "up") moveFocus(list, -1);
                    // Vérification avant d'exécuter la suite.
                    if (nav === "right" || nav === "down") moveFocus(list, 1);
                // Fermeture du bloc ou de l'appel.
                }
                // Valeur mémorisée dans submit.
                var submit = pad && pad.buttons && pad.buttons[0] && pad.buttons[0].pressed;
                // Vérification avant d'exécuter la suite.
                if (submit && !lastSubmitPressed) {
                    // Récupération de l'élément HTML active.
                    var active = document.activeElement;
                    // Vérification avant d'exécuter la suite.
                    if (active && typeof active.click === "function") {
                        // Appel de click pour appliquer l'action prévue.
                        active.click();
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }
                // Instruction nécessaire au déroulement de cette partie.
                lastSubmitPressed = !!submit;

                // Valeur mémorisée dans back.
                var back = pad && pad.buttons && pad.buttons[1] && pad.buttons[1].pressed;
                // Vérification avant d'exécuter la suite.
                if (back && !lastBackPressed) {
                    // Appel de close pour appliquer l'action prévue.
                    close();
                // Fermeture du bloc ou de l'appel.
                }
                // Instruction nécessaire au déroulement de cette partie.
                lastBackPressed = !!back;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (isSettingsOpen()) {
            // Appel de captureGamepadBinding pour appliquer l'action prévue.
            captureGamepadBinding();
        // Fermeture du bloc ou de l'appel.
        }
        // Appel de requestAnimationFrame pour appliquer l'action prévue.
        window.requestAnimationFrame(pollSettingsGamepad);
    // Fermeture du bloc ou de l'appel.
    }

    // ── Touche Échap ───────────────────────────────────────────────
    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("keydown", function (e) {
        // Vérification avant d'exécuter la suite.
        if (e.key === "Escape") {
            // Appel de preventDefault pour appliquer l'action prévue.
            e.preventDefault();
            // Vérification avant d'exécuter la suite.
            if (isSettingsOpen()) {
                // Appel de close pour appliquer l'action prévue.
                close();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (isInGameContext()) {
                // Appel de open pour appliquer l'action prévue.
                open();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("keydown", handleSettingsNavKey, true);

    // ── Boutons ────────────────────────────────────────────────────
    // Vérification avant d'exécuter la suite.
    if (closeBtn)  closeBtn.addEventListener("click", close);
    // Vérification avant d'exécuter la suite.
    if (resumeBtn) resumeBtn.addEventListener("click", close);
    // Vérification avant d'exécuter la suite.
    if (quitBtn)   quitBtn.addEventListener("click", function () {
        // Appel de close pour appliquer l'action prévue.
        close();
        // Vérification avant d'exécuter la suite.
        if (typeof window.quitGame === "function") {
            // Appel de quitGame pour appliquer l'action prévue.
            window.quitGame();
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });
    // Vérification avant d'exécuter la suite.
    if (overlay)   overlay.addEventListener("click", function (e) {
        // Vérification avant d'exécuter la suite.
        if (e.target === overlay) close();
    // Fermeture du bloc ou de l'appel.
    });

    // ── Boutons caméra ─────────────────────────────────────────────
    // Appel de forEach pour appliquer l'action prévue.
    camBtns.forEach(function (btn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        btn.addEventListener("click", function () {
            // Appel de switchCamera pour appliquer l'action prévue.
            switchCamera(btn.dataset.cam);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de forEach pour appliquer l'action prévue.
    keybindBtns.forEach(function (btn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        btn.addEventListener("click", function () {
            // Instruction nécessaire au déroulement de cette partie.
            listeningAction = btn.dataset.action;
            // Appel de setListeningButton pour appliquer l'action prévue.
            setListeningButton(listeningAction);
            // Instruction nécessaire au déroulement de cette partie.
            listeningActionP2 = null;
            // Appel de setListeningP2Button pour appliquer l'action prévue.
            setListeningP2Button(null);
            // Instruction nécessaire au déroulement de cette partie.
            listeningGamepadAction = null;
            // Appel de setListeningGamepadButton pour appliquer l'action prévue.
            setListeningGamepadButton(null);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de forEach pour appliquer l'action prévue.
    keybindP2Btns.forEach(function (btn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        btn.addEventListener("click", function () {
            // Instruction nécessaire au déroulement de cette partie.
            listeningActionP2 = btn.dataset.actionP2;
            // Appel de setListeningP2Button pour appliquer l'action prévue.
            setListeningP2Button(listeningActionP2);
            // Instruction nécessaire au déroulement de cette partie.
            listeningAction = null;
            // Appel de setListeningButton pour appliquer l'action prévue.
            setListeningButton(null);
            // Instruction nécessaire au déroulement de cette partie.
            listeningGamepadAction = null;
            // Appel de setListeningGamepadButton pour appliquer l'action prévue.
            setListeningGamepadButton(null);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de forEach pour appliquer l'action prévue.
    gamepadBtns.forEach(function (btn) {
        // Appel de addEventListener pour appliquer l'action prévue.
        btn.addEventListener("click", function () {
            // Instruction nécessaire au déroulement de cette partie.
            listeningGamepadAction = btn.dataset.gamepadAction;
            // Appel de setListeningGamepadButton pour appliquer l'action prévue.
            setListeningGamepadButton(listeningGamepadAction);
            // Instruction nécessaire au déroulement de cette partie.
            listeningAction = null;
            // Appel de setListeningButton pour appliquer l'action prévue.
            setListeningButton(null);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("keydown", captureKey, true);
    // Appel de addEventListener pour appliquer l'action prévue.
    window.addEventListener("keydown", captureKeyP2, true);
    // Appel de pollSettingsGamepad pour appliquer l'action prévue.
    pollSettingsGamepad();

    // ── Sliders volume ─────────────────────────────────────────────
    // Fonction syncSlider : elle regroupe le traitement de cette partie.
    function syncSlider(slider, display, audioMethod) {
        // Vérification avant d'exécuter la suite.
        if (!slider || !display) return;
        // Appel de addEventListener pour appliquer l'action prévue.
        slider.addEventListener("input", function () {
            // Mise à jour de textContent.
            display.textContent = slider.value + "%";
            // Valeur mémorisée dans vol.
            var vol = Number(slider.value) / 100;
            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio[audioMethod] === "function") {
                // Instruction nécessaire au déroulement de cette partie.
                window.matchAudio[audioMethod](vol);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de syncSlider pour appliquer l'action prévue.
    syncSlider(soundSlider, soundVal, "setVolume");
    // Appel de syncSlider pour appliquer l'action prévue.
    syncSlider(musicSlider, musicVal, "setMusicVolume");

    // ── Slider zoom caméra ─────────────────────────────────────────
    // Récupération de l'élément HTML zoomSlider.
    var zoomSlider = document.getElementById("set-cam-zoom");
    // Récupération de l'élément HTML zoomVal.
    var zoomVal    = document.getElementById("set-cam-zoom-val");

    // Vérification avant d'exécuter la suite.
    if (zoomSlider && zoomVal) {
        // Appel de addEventListener pour appliquer l'action prévue.
        zoomSlider.addEventListener("input", function () {
            // Valeur mémorisée dans offset.
            var offset = Number(zoomSlider.value);
            // Mise à jour de textContent.
            zoomVal.textContent = offset === 0 ? "Base" : "+" + offset;

            // Broadcast camera : via cameraRuntime
            // Vérification avant d'exécuter la suite.
            if (window.cameraRuntime && typeof window.cameraRuntime.setZoomOffset === "function") {
                // Appel de setZoomOffset pour appliquer l'action prévue.
                window.cameraRuntime.setZoomOffset(offset);
            // Fermeture du bloc ou de l'appel.
            }

            // TPS camera : ajustement direct du radius
            // Valeur mémorisée dans cams.
            var cams = window.gameCameras;
            // Vérification avant d'exécuter la suite.
            if (cams && cams.tpsCamera) {
                // Mise à jour de radius.
                cams.tpsCamera.radius = TPS_BASE_RADIUS - offset;
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (cams && cams.thirdPersonCamera) {
                // Mise à jour de radius.
                cams.thirdPersonCamera.radius = THIRD_BASE_RADIUS - offset;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (window.inputBindings && typeof window.inputBindings.getBindings === "function") {
        // Appel de getBindings pour appliquer l'action prévue.
        keybinds = window.inputBindings.getBindings();
    // Fermeture du bloc ou de l'appel.
    }
    // Vérification avant d'exécuter la suite.
    if (window.inputBindings && typeof window.inputBindings.getPlayer2Bindings === "function") {
        // Appel de getPlayer2Bindings pour appliquer l'action prévue.
        player2Binds = window.inputBindings.getPlayer2Bindings();
    // Fermeture du bloc ou de l'appel.
    }
    // Vérification avant d'exécuter la suite.
    if (window.inputBindings && typeof window.inputBindings.getGamepadBindings === "function") {
        // Appel de getGamepadBindings pour appliquer l'action prévue.
        gamepadBinds = window.inputBindings.getGamepadBindings();
    // Fermeture du bloc ou de l'appel.
    }
    // Appel de syncKeybindButtons pour appliquer l'action prévue.
    syncKeybindButtons();
    // Appel de syncKeybindP2Buttons pour appliquer l'action prévue.
    syncKeybindP2Buttons();
    // Appel de syncGamepadButtons pour appliquer l'action prévue.
    syncGamepadButtons();

    // ── API publique ───────────────────────────────────────────────
    // Mise à jour de settingsMenu.
    window.settingsMenu = { open: open, close: close, toggle: toggle };
// Instruction nécessaire au déroulement de cette partie.
})();
