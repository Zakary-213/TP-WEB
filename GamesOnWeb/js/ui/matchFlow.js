// js/ui/matchFlow.js
// Gestion "mi-temps 1 / mi-temps 2 -> fin du match"
// Fait l'affichage et pilote pause/reprise via un callback.

// import { saveScoreToDB } from "../../../JeuCanvas/js/score/scoreStorage";

// Appel de function pour appliquer l'action prévue.
(function () {
    // Fonction createMatchFlow : elle regroupe le traitement de cette partie.
    function createMatchFlow(config) {
        // Ouverture du bloc correspondant.
        const {
            // Paramètre de l'appel ou valeur de configuration.
            halfSeconds,
            // Paramètre de l'appel ou valeur de configuration.
            halftimePauseSeconds,
            // Paramètre de l'appel ou valeur de configuration.
            mode,
            // Paramètre de l'appel ou valeur de configuration.
            tournamentStage,
            // Paramètre de l'appel ou valeur de configuration.
            setGameplayPaused,
            // Paramètre de l'appel ou valeur de configuration.
            myTeam,
            // Paramètre de l'appel ou valeur de configuration.
            opponentTeam,
            // Paramètre de l'appel ou valeur de configuration.
            cameras,
            // Paramètre de l'appel ou valeur de configuration.
            ball,
            // Paramètre de l'appel ou valeur de configuration.
            basePlayer,
            // Paramètre de l'appel ou valeur de configuration.
            setActivePlayerFn,
            // Paramètre de l'appel ou valeur de configuration.
            onContinueTournament,
            // Paramètre de l'appel ou valeur de configuration.
            onQuitMatch,
            // Paramètre de l'appel ou valeur de configuration.
            saveScoreToDB,
            // Paramètre de l'appel ou valeur de configuration.
            getGoalTimeline,
            // Instruction nécessaire au déroulement de cette partie.
            getTeamLabels
        // Instruction nécessaire au déroulement de cette partie.
        } = config || {};

        // Valeur mémorisée dans scoreboard.
        const scoreboard = window.gameScoreboard;

        // Récupération de l'élément HTML halftimeOverlay.
        const halftimeOverlay = document.getElementById("halftime-overlay");
        // Récupération de l'élément HTML halftimeCountdownEl.
        const halftimeCountdownEl = document.getElementById("halftime-countdown");
        // Récupération de l'élément HTML halftimeContinueBtn.
        const halftimeContinueBtn = document.getElementById("halftime-continue-btn");

        // Récupération de l'élément HTML matchEndOverlay.
        const matchEndOverlay = document.getElementById("match-end-overlay");
        // Récupération de l'élément HTML matchEndResultEl.
        const matchEndResultEl = document.getElementById("match-end-result");
        // Récupération de l'élément HTML matchEndScoreEl.
        const matchEndScoreEl = document.getElementById("match-end-score");
        // Récupération de l'élément HTML matchEndContinueBtn.
        const matchEndContinueBtn = document.getElementById("match-end-continue-btn");
        // Récupération de l'élément HTML matchEndQuitBtn.
        const matchEndQuitBtn = document.getElementById("match-end-quit-btn");

        // Valeur mémorisée dans stage.
        let stage = 0; // 0: phase 1 en cours, 1: pause mi-temps 1, 2: phase 2 en cours, 3: fin de match
        // Valeur mémorisée dans halftimeCountdownInterval.
        let halftimeCountdownInterval = null;
        // Valeur mémorisée dans halftimeResumeTimeout.
        let halftimeResumeTimeout = null;
        // Valeur mémorisée dans halftimePadPollInterval.
        let halftimePadPollInterval = null;
        // Valeur mémorisée dans lastHalftimeSkipPressed.
        let lastHalftimeSkipPressed = false;
        // Valeur mémorisée dans matchEndPadPollInterval.
        let matchEndPadPollInterval = null;
        // Valeur mémorisée dans lastMatchEndConfirmPressed.
        let lastMatchEndConfirmPressed = false;
        // Valeur mémorisée dans lastMatchEndMoveDir.
        let lastMatchEndMoveDir = 0;
        // Valeur mémorisée dans matchEndSelectedIndex.
        let matchEndSelectedIndex = 0;

        // Fonction getVisibleMatchEndButtons : elle regroupe le traitement de cette partie.
        function getVisibleMatchEndButtons() {
            // Valeur mémorisée dans buttons.
            const buttons = [];

            // Vérification avant d'exécuter la suite.
            if (matchEndContinueBtn && matchEndContinueBtn.style.display !== "none") {
                // Appel de push pour appliquer l'action prévue.
                buttons.push(matchEndContinueBtn);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (matchEndQuitBtn && matchEndQuitBtn.style.display !== "none") {
                // Appel de push pour appliquer l'action prévue.
                buttons.push(matchEndQuitBtn);
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return buttons;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction updateMatchEndButtonSelection : elle regroupe le traitement de cette partie.
        function updateMatchEndButtonSelection() {
            // Valeur mémorisée dans visibleButtons.
            const visibleButtons = getVisibleMatchEndButtons();
            // Vérification avant d'exécuter la suite.
            if (!visibleButtons.length) return;

            // Valeur mémorisée dans maxIndex.
            const maxIndex = visibleButtons.length - 1;
            // Vérification avant d'exécuter la suite.
            if (matchEndSelectedIndex < 0) matchEndSelectedIndex = 0;
            // Vérification avant d'exécuter la suite.
            if (matchEndSelectedIndex > maxIndex) matchEndSelectedIndex = maxIndex;

            // Appel de forEach pour appliquer l'action prévue.
            visibleButtons.forEach(function (btn, index) {
                // Appel de toggle pour appliquer l'action prévue.
                btn.classList.toggle("overlay-action-btn--selected", index === matchEndSelectedIndex);
            // Fermeture du bloc ou de l'appel.
            });
            // saveScoreToDB(); // Erreur: cet appel était déplacé et manquait d'arguments
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction moveMatchEndSelection : elle regroupe le traitement de cette partie.
        function moveMatchEndSelection(dir) {
            // Valeur mémorisée dans visibleButtons.
            const visibleButtons = getVisibleMatchEndButtons();
            // Vérification avant d'exécuter la suite.
            if (visibleButtons.length <= 1) return;

            // Instruction nécessaire au déroulement de cette partie.
            matchEndSelectedIndex += dir;
            // Vérification avant d'exécuter la suite.
            if (matchEndSelectedIndex < 0) matchEndSelectedIndex = visibleButtons.length - 1;
            // Vérification avant d'exécuter la suite.
            if (matchEndSelectedIndex >= visibleButtons.length) matchEndSelectedIndex = 0;

            // Appel de updateMatchEndButtonSelection pour appliquer l'action prévue.
            updateMatchEndButtonSelection();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction confirmMatchEndSelection : elle regroupe le traitement de cette partie.
        function confirmMatchEndSelection() {
            // Valeur mémorisée dans visibleButtons.
            const visibleButtons = getVisibleMatchEndButtons();
            // Vérification avant d'exécuter la suite.
            if (!visibleButtons.length) return;

            // Valeur mémorisée dans selected.
            const selected = visibleButtons[matchEndSelectedIndex] || visibleButtons[0];
            // Vérification avant d'exécuter la suite.
            if (selected === matchEndContinueBtn) {
                // Appel de handleMatchEndContinue pour appliquer l'action prévue.
                handleMatchEndContinue();
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de handleMatchEndQuit pour appliquer l'action prévue.
                handleMatchEndQuit();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction handleMatchEndKeyboard : elle regroupe le traitement de cette partie.
        function handleMatchEndKeyboard(e) {
            // Vérification avant d'exécuter la suite.
            if (stage !== 3) return;
            // Vérification avant d'exécuter la suite.
            if (!matchEndOverlay || matchEndOverlay.style.display === "none") return;

            // Vérification avant d'exécuter la suite.
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                // Appel de moveMatchEndSelection pour appliquer l'action prévue.
                moveMatchEndSelection(-1);
                // Appel de preventDefault pour appliquer l'action prévue.
                e.preventDefault();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                // Appel de moveMatchEndSelection pour appliquer l'action prévue.
                moveMatchEndSelection(1);
                // Appel de preventDefault pour appliquer l'action prévue.
                e.preventDefault();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (e.key === "x" || e.key === "X" || e.key === "Enter" || e.key === " ") {
                // Appel de confirmMatchEndSelection pour appliquer l'action prévue.
                confirmMatchEndSelection();
                // Appel de preventDefault pour appliquer l'action prévue.
                e.preventDefault();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction stopCountdown : elle regroupe le traitement de cette partie.
        function stopCountdown() {
            // Vérification avant d'exécuter la suite.
            if (halftimeCountdownInterval) {
                // Appel de clearInterval pour appliquer l'action prévue.
                clearInterval(halftimeCountdownInterval);
                // Instruction nécessaire au déroulement de cette partie.
                halftimeCountdownInterval = null;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction resetBallToCenter : elle regroupe le traitement de cette partie.
        function resetBallToCenter() {
            // Vérification avant d'exécuter la suite.
            if (!ball) return;

            // Vérification avant d'exécuter la suite.
            if (ball.velocity) ball.velocity.set(0, 0, 0);
            // Mise à jour de restartLocked.
            ball.restartLocked = false;
            // Mise à jour de restartTaker.
            ball.restartTaker = null;
            // Mise à jour de isOutAnimationPlaying.
            ball.isOutAnimationPlaying = false;
            // Mise à jour de outAnimationFinished.
            ball.outAnimationFinished = false;
            // Mise à jour de isOutOfPlay.
            ball.isOutOfPlay = false;
            // Mise à jour de outTimer.
            ball.outTimer = 0;
            // Mise à jour de outDecision.
            ball.outDecision = null;
            // Mise à jour de outExitPosition.
            ball.outExitPosition = null;

            // Mise à jour de x.
            ball.position.x = 0;
            // Mise à jour de y.
            ball.position.y = 0.65;
            // Mise à jour de z.
            ball.position.z = 0;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction recenterToBasePlayer : elle regroupe le traitement de cette partie.
        function recenterToBasePlayer() {
            // Vérification avant d'exécuter la suite.
            if (myTeam && myTeam.resetPositions) myTeam.resetPositions();
            // Vérification avant d'exécuter la suite.
            if (opponentTeam && opponentTeam.resetPositions) opponentTeam.resetPositions();

            // Vérification avant d'exécuter la suite.
            if (setActivePlayerFn && basePlayer) {
                // Appel de setActivePlayerFn pour appliquer l'action prévue.
                setActivePlayerFn(basePlayer);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (cameras?.fpvCamera && basePlayer) {
                // Mise à jour de parent.
                cameras.fpvCamera.parent = basePlayer;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (cameras?.cameraTargetNode && basePlayer?.position) {
                // Appel de copyFrom pour appliquer l'action prévue.
                cameras.cameraTargetNode.position.copyFrom(basePlayer.position);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction cleanupRestartStateIfAny : elle regroupe le traitement de cette partie.
        function cleanupRestartStateIfAny() {
            // resetRestartState est défini par js/models/restartLogic.js
            // Vérification avant d'exécuter la suite.
            if (typeof resetRestartState === "function") {
                // Appel de resetRestartState pour appliquer l'action prévue.
                resetRestartState();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction hideHalftimeOverlay : elle regroupe le traitement de cette partie.
        function hideHalftimeOverlay() {
            // Vérification avant d'exécuter la suite.
            if (halftimeOverlay) halftimeOverlay.style.display = "none";
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction showHalftimeOverlay : elle regroupe le traitement de cette partie.
        function showHalftimeOverlay() {
            // Vérification avant d'exécuter la suite.
            if (!halftimeOverlay) return;
            // Mise à jour de display.
            halftimeOverlay.style.display = "block";
            // Appel de remove pour appliquer l'action prévue.
            halftimeOverlay.classList.remove("halftime-overlay--show");
            // force reflow pour relancer l'animation
            // Instruction nécessaire au déroulement de cette partie.
            void halftimeOverlay.offsetWidth;
            // Appel de add pour appliquer l'action prévue.
            halftimeOverlay.classList.add("halftime-overlay--show");
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction startHalftimeCountdown : elle regroupe le traitement de cette partie.
        function startHalftimeCountdown() {
            // Vérification avant d'exécuter la suite.
            if (!halftimeCountdownEl) return;

            // Appel de stopCountdown pour appliquer l'action prévue.
            stopCountdown();

            // petit "beat" immédiat
            // Valeur mémorisée dans initial.
            const initial = Math.max(0, halftimePauseSeconds);
            // Mise à jour de textContent.
            halftimeCountdownEl.textContent = String(initial);
            // Appel de remove pour appliquer l'action prévue.
            halftimeCountdownEl.classList.remove("halftime-countdown--beat", "halftime-countdown--danger");
            // Appel de add pour appliquer l'action prévue.
            halftimeCountdownEl.classList.add("halftime-countdown--beat");
            // Appel de toggle pour appliquer l'action prévue.
            halftimeCountdownEl.classList.toggle(
                // Paramètre de l'appel ou valeur de configuration.
                "halftime-countdown--danger",
                // Instruction nécessaire au déroulement de cette partie.
                halftimePauseSeconds <= 3
            // Fermeture du bloc ou de l'appel.
            );

            // Valeur mémorisée dans remaining.
            let remaining = halftimePauseSeconds;
            // Appel de setInterval pour appliquer l'action prévue.
            halftimeCountdownInterval = setInterval(function () {
                // Instruction nécessaire au déroulement de cette partie.
                remaining -= 1;
                // Valeur mémorisée dans value.
                const value = Math.max(0, remaining);

                // Vérification avant d'exécuter la suite.
                if (halftimeCountdownEl) {
                    // Mise à jour de textContent.
                    halftimeCountdownEl.textContent = String(value);
                    // Appel de remove pour appliquer l'action prévue.
                    halftimeCountdownEl.classList.remove("halftime-countdown--beat");
                    // Instruction nécessaire au déroulement de cette partie.
                    void halftimeCountdownEl.offsetWidth;
                    // Appel de add pour appliquer l'action prévue.
                    halftimeCountdownEl.classList.add("halftime-countdown--beat");

                    // Appel de toggle pour appliquer l'action prévue.
                    halftimeCountdownEl.classList.toggle(
                        // Paramètre de l'appel ou valeur de configuration.
                        "halftime-countdown--danger",
                        // Instruction nécessaire au déroulement de cette partie.
                        value <= 3
                    // Fermeture du bloc ou de l'appel.
                    );
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (value <= 0) {
                    // Appel de stopCountdown pour appliquer l'action prévue.
                    stopCountdown();
                // Fermeture du bloc ou de l'appel.
                }
            // Instruction nécessaire au déroulement de cette partie.
            }, 1000);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction stopTimerAt : elle regroupe le traitement de cette partie.
        function stopTimerAt(seconds) {
            // Vérification avant d'exécuter la suite.
            if (!scoreboard) return;
            // Vérification avant d'exécuter la suite.
            if (scoreboard.stopTimer) scoreboard.stopTimer();
            // Mise à jour de matchTime.
            scoreboard.matchTime = seconds;
            // Vérification avant d'exécuter la suite.
            if (scoreboard.updateTimerDisplay) scoreboard.updateTimerDisplay();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction startTimerIfPossible : elle regroupe le traitement de cette partie.
        function startTimerIfPossible() {
            // Vérification avant d'exécuter la suite.
            if (!scoreboard) return;
            // Vérification avant d'exécuter la suite.
            if (scoreboard.startTimer) scoreboard.startTimer();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction stopMatchEndGamepadPolling : elle regroupe le traitement de cette partie.
        function stopMatchEndGamepadPolling() {
            // Vérification avant d'exécuter la suite.
            if (matchEndPadPollInterval) {
                // Appel de clearInterval pour appliquer l'action prévue.
                clearInterval(matchEndPadPollInterval);
                // Instruction nécessaire au déroulement de cette partie.
                matchEndPadPollInterval = null;
            // Fermeture du bloc ou de l'appel.
            }
            // Instruction nécessaire au déroulement de cette partie.
            lastMatchEndConfirmPressed = false;
            // Instruction nécessaire au déroulement de cette partie.
            lastMatchEndMoveDir = 0;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction startMatchEndGamepadPolling : elle regroupe le traitement de cette partie.
        function startMatchEndGamepadPolling() {
            // Appel de stopMatchEndGamepadPolling pour appliquer l'action prévue.
            stopMatchEndGamepadPolling();

            // Appel de setInterval pour appliquer l'action prévue.
            matchEndPadPollInterval = setInterval(function () {
                // Vérification avant d'exécuter la suite.
                if (stage !== 3) return;
                // Vérification avant d'exécuter la suite.
                if (!matchEndOverlay || matchEndOverlay.style.display === "none") return;

                // Valeur mémorisée dans visibleButtons.
                const visibleButtons = getVisibleMatchEndButtons();
                // Vérification avant d'exécuter la suite.
                if (!visibleButtons.length) {
                    // Instruction nécessaire au déroulement de cette partie.
                    lastMatchEndConfirmPressed = false;
                    // Instruction nécessaire au déroulement de cette partie.
                    lastMatchEndMoveDir = 0;
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans pads.
                const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
                // Valeur mémorisée dans pad.
                const pad = pads.find(function (p) { return p && p.connected; }) || null;
                // Vérification avant d'exécuter la suite.
                if (!pad || !pad.buttons) {
                    // Instruction nécessaire au déroulement de cette partie.
                    lastMatchEndConfirmPressed = false;
                    // Instruction nécessaire au déroulement de cette partie.
                    lastMatchEndMoveDir = 0;
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans binds.
                const binds = window.inputBindings && typeof window.inputBindings.getGamepadBindings === "function"
                    // Appel de getGamepadBindings pour appliquer l'action prévue.
                    ? window.inputBindings.getGamepadBindings()
                    // Instruction nécessaire au déroulement de cette partie.
                    : { shoot: 0 };

                // Valeur mémorisée dans shootIndex.
                const shootIndex = Number.isInteger(binds.shoot) ? binds.shoot : 0;
                // Valeur mémorisée dans shootBtn.
                const shootBtn = pad.buttons[shootIndex];
                // Valeur mémorisée dans shootPressed.
                const shootPressed = !!(shootBtn && shootBtn.pressed);

                // Valeur mémorisée dans leftPressed.
                const leftPressed = !!(pad.buttons[14] && pad.buttons[14].pressed);
                // Valeur mémorisée dans rightPressed.
                const rightPressed = !!(pad.buttons[15] && pad.buttons[15].pressed);
                // Valeur mémorisée dans upPressed.
                const upPressed = !!(pad.buttons[12] && pad.buttons[12].pressed);
                // Valeur mémorisée dans downPressed.
                const downPressed = !!(pad.buttons[13] && pad.buttons[13].pressed);
                // Valeur mémorisée dans axisX.
                const axisX = Array.isArray(pad.axes) ? Number(pad.axes[0] || 0) : 0;
                // Valeur mémorisée dans axisY.
                const axisY = Array.isArray(pad.axes) ? Number(pad.axes[1] || 0) : 0;

                // Valeur mémorisée dans moveDir.
                let moveDir = 0;
                // Vérification avant d'exécuter la suite.
                if (leftPressed || upPressed || axisX < -0.55 || axisY < -0.55) {
                    // Instruction nécessaire au déroulement de cette partie.
                    moveDir = -1;
                // Deuxième possibilité à tester.
                } else if (rightPressed || downPressed || axisX > 0.55 || axisY > 0.55) {
                    // Instruction nécessaire au déroulement de cette partie.
                    moveDir = 1;
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (moveDir !== 0 && lastMatchEndMoveDir === 0) {
                    // Appel de moveMatchEndSelection pour appliquer l'action prévue.
                    moveMatchEndSelection(moveDir);
                // Fermeture du bloc ou de l'appel.
                }

                // Instruction nécessaire au déroulement de cette partie.
                lastMatchEndMoveDir = moveDir;

                // Vérification avant d'exécuter la suite.
                if (shootPressed && !lastMatchEndConfirmPressed) {
                    // Appel de confirmMatchEndSelection pour appliquer l'action prévue.
                    confirmMatchEndSelection();
                // Fermeture du bloc ou de l'appel.
                }

                // Instruction nécessaire au déroulement de cette partie.
                lastMatchEndConfirmPressed = shootPressed;
            // Instruction nécessaire au déroulement de cette partie.
            }, 80);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction stopHalftimeGamepadPolling : elle regroupe le traitement de cette partie.
        function stopHalftimeGamepadPolling() {
            // Vérification avant d'exécuter la suite.
            if (halftimePadPollInterval) {
                // Appel de clearInterval pour appliquer l'action prévue.
                clearInterval(halftimePadPollInterval);
                // Instruction nécessaire au déroulement de cette partie.
                halftimePadPollInterval = null;
            // Fermeture du bloc ou de l'appel.
            }
            // Instruction nécessaire au déroulement de cette partie.
            lastHalftimeSkipPressed = false;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction startHalftimeGamepadPolling : elle regroupe le traitement de cette partie.
        function startHalftimeGamepadPolling() {
            // Appel de stopHalftimeGamepadPolling pour appliquer l'action prévue.
            stopHalftimeGamepadPolling();

            // Appel de setInterval pour appliquer l'action prévue.
            halftimePadPollInterval = setInterval(function () {
                // Vérification avant d'exécuter la suite.
                if (stage !== 1) return;

                // Valeur mémorisée dans pads.
                const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
                // Valeur mémorisée dans pad.
                const pad = pads.find(function (p) { return p && p.connected; }) || null;
                // Vérification avant d'exécuter la suite.
                if (!pad || !pad.buttons) {
                    // Instruction nécessaire au déroulement de cette partie.
                    lastHalftimeSkipPressed = false;
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans binds.
                const binds = window.inputBindings && typeof window.inputBindings.getGamepadBindings === "function"
                    // Appel de getGamepadBindings pour appliquer l'action prévue.
                    ? window.inputBindings.getGamepadBindings()
                    // Instruction nécessaire au déroulement de cette partie.
                    : { shoot: 0 };

                // Valeur mémorisée dans shootIndex.
                const shootIndex = Number.isInteger(binds.shoot) ? binds.shoot : 0;
                // Valeur mémorisée dans shootBtn.
                const shootBtn = pad.buttons[shootIndex];
                // Valeur mémorisée dans shootPressed.
                const shootPressed = !!(shootBtn && shootBtn.pressed);

                // Vérification avant d'exécuter la suite.
                if (shootPressed && !lastHalftimeSkipPressed) {
                    // Appel de resumeSecondHalf pour appliquer l'action prévue.
                    resumeSecondHalf();
                // Fermeture du bloc ou de l'appel.
                }

                // Instruction nécessaire au déroulement de cette partie.
                lastHalftimeSkipPressed = shootPressed;
            // Instruction nécessaire au déroulement de cette partie.
            }, 80);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction resumeSecondHalf : elle regroupe le traitement de cette partie.
        function resumeSecondHalf() {
            // Vérification avant d'exécuter la suite.
            if (stage !== 1) return;

            // Vérification avant d'exécuter la suite.
            if (halftimeResumeTimeout) {
                // Appel de clearTimeout pour appliquer l'action prévue.
                clearTimeout(halftimeResumeTimeout);
                // Instruction nécessaire au déroulement de cette partie.
                halftimeResumeTimeout = null;
            // Fermeture du bloc ou de l'appel.
            }

            // Instruction nécessaire au déroulement de cette partie.
            stage = 2;

            // Fonction resetTeamStamina : elle regroupe le traitement de cette partie.
            const resetTeamStamina = (team) => {
                // Vérification avant d'exécuter la suite.
                if (!team || !team.players) return;
                // Appel de forEach pour appliquer l'action prévue.
                team.players.forEach(p => {
                    // Vérification avant d'exécuter la suite.
                    if (!p) return;
                    // Valeur mémorisée dans max.
                    const max = p.maxStamina || 1;
                    // Mise à jour de stamina.
                    p.stamina = max;
                // Fermeture du bloc ou de l'appel.
                });
            // Fermeture du bloc ou de l'appel.
            };

            // Appel de resetTeamStamina pour appliquer l'action prévue.
            resetTeamStamina(myTeam);
            // Appel de resetTeamStamina pour appliquer l'action prévue.
            resetTeamStamina(opponentTeam);

            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio.playWhistle === "function") {
                // Appel de playWhistle pour appliquer l'action prévue.
                window.matchAudio.playWhistle();
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de setGameplayPaused pour appliquer l'action prévue.
            setGameplayPaused(false);
            // Appel de startTimerIfPossible pour appliquer l'action prévue.
            startTimerIfPossible();
            // Appel de hideHalftimeOverlay pour appliquer l'action prévue.
            hideHalftimeOverlay();
            // Appel de stopCountdown pour appliquer l'action prévue.
            stopCountdown();
            // Appel de stopHalftimeGamepadPolling pour appliquer l'action prévue.
            stopHalftimeGamepadPolling();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction triggerHalftime1 : elle regroupe le traitement de cette partie.
        function triggerHalftime1() {
            // Vérification avant d'exécuter la suite.
            if (stage !== 0) return;
            // Instruction nécessaire au déroulement de cette partie.
            stage = 1;
            // Appel de setGameplayPaused pour appliquer l'action prévue.
            setGameplayPaused(true);

            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio.playWhistle === "function") {
                // Appel de playWhistle pour appliquer l'action prévue.
                window.matchAudio.playWhistle();
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de stopTimerAt pour appliquer l'action prévue.
            stopTimerAt(halfSeconds);
            // Appel de hideHalftimeOverlay pour appliquer l'action prévue.
            hideHalftimeOverlay();

            // Appel de cleanupRestartStateIfAny pour appliquer l'action prévue.
            cleanupRestartStateIfAny();
            // Appel de recenterToBasePlayer pour appliquer l'action prévue.
            recenterToBasePlayer();
            // Appel de resetBallToCenter pour appliquer l'action prévue.
            resetBallToCenter();

            // Appel de showHalftimeOverlay pour appliquer l'action prévue.
            showHalftimeOverlay();
            // Appel de startHalftimeCountdown pour appliquer l'action prévue.
            startHalftimeCountdown();
            // Appel de startHalftimeGamepadPolling pour appliquer l'action prévue.
            startHalftimeGamepadPolling();
            // overlay mi-temps est visible pendant la pause uniquement

            // Appel de setTimeout pour appliquer l'action prévue.
            halftimeResumeTimeout = window.setTimeout(resumeSecondHalf, halftimePauseSeconds * 1000);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction triggerEndMatch : elle regroupe le traitement de cette partie.
        function triggerEndMatch() {
            // Vérification avant d'exécuter la suite.
            if (stage !== 2) return;
            // Instruction nécessaire au déroulement de cette partie.
            stage = 3;
            // Appel de setGameplayPaused pour appliquer l'action prévue.
            setGameplayPaused(true);

            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio.playWhistle === "function") {
                // Appel de playWhistle pour appliquer l'action prévue.
                window.matchAudio.playWhistle();
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de stopTimerAt pour appliquer l'action prévue.
            stopTimerAt(halfSeconds * 2);
            // Appel de hideHalftimeOverlay pour appliquer l'action prévue.
            hideHalftimeOverlay();
            // Appel de stopCountdown pour appliquer l'action prévue.
            stopCountdown();

            // Appel de cleanupRestartStateIfAny pour appliquer l'action prévue.
            cleanupRestartStateIfAny();
            // Appel de recenterToBasePlayer pour appliquer l'action prévue.
            recenterToBasePlayer();
            // Appel de resetBallToCenter pour appliquer l'action prévue.
            resetBallToCenter();

            // Vérification avant d'exécuter la suite.
            if (matchEndOverlay) {
                // Mise à jour de display.
                matchEndOverlay.style.display = "block";
                // Appel de remove pour appliquer l'action prévue.
                matchEndOverlay.classList.remove("match-end--you", "match-end--ai", "match-end--draw");
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans youScore.
            const youScore = scoreboard?.playerScore ?? 0;
            // Valeur mémorisée dans aiScore.
            const aiScore = scoreboard?.aiScore ?? 0;
            // Valeur mémorisée dans playerWon.
            const playerWon = youScore > aiScore;

            // Vérification avant d'exécuter la suite.
            if (matchEndResultEl && matchEndScoreEl) {
                // Vérification avant d'exécuter la suite.
                if (youScore > aiScore) {
                    // Vérification avant d'exécuter la suite.
                    if (matchEndOverlay) matchEndOverlay.classList.add("match-end--you");
                    // Mise à jour de textContent.
                    matchEndResultEl.textContent = "Victoire !";
                // Deuxième possibilité à tester.
                } else if (aiScore > youScore) {
                    // Vérification avant d'exécuter la suite.
                    if (matchEndOverlay) matchEndOverlay.classList.add("match-end--ai");
                    // Mise à jour de textContent.
                    matchEndResultEl.textContent = "Défaite !";
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Vérification avant d'exécuter la suite.
                    if (matchEndOverlay) matchEndOverlay.classList.add("match-end--draw");
                    // Mise à jour de textContent.
                    matchEndResultEl.textContent = "Match nul";
                // Fermeture du bloc ou de l'appel.
                }

                // Mise à jour de textContent.
                matchEndScoreEl.textContent = scoreboard && typeof scoreboard.getScorelineText === "function"
                    // Appel de getScorelineText pour appliquer l'action prévue.
                    ? scoreboard.getScorelineText()
                    // Instruction nécessaire au déroulement de cette partie.
                    : `YOU ${youScore} - ${aiScore} IA`;
            // Fermeture du bloc ou de l'appel.
            }

            // Boutons de fin: tournoi gagne => Continuer + Quitter, sinon Quitter seul.
            // Vérification avant d'exécuter la suite.
            if (matchEndContinueBtn) {
                // Valeur mémorisée dans canContinueTournament.
                const canContinueTournament = mode === "tournament" && playerWon && tournamentStage !== "finale";
                // Mise à jour de display.
                matchEndContinueBtn.style.display = canContinueTournament ? "inline-flex" : "none";
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (matchEndQuitBtn) {
                // Mise à jour de display.
                matchEndQuitBtn.style.display = "inline-flex";
            // Fermeture du bloc ou de l'appel.
            }

            // Instruction nécessaire au déroulement de cette partie.
            matchEndSelectedIndex = 0;
            // Appel de updateMatchEndButtonSelection pour appliquer l'action prévue.
            updateMatchEndButtonSelection();

            // Sauvegarde du score une seule fois à la fin du match
            // Vérification avant d'exécuter la suite.
            if (typeof saveScoreToDB === "function") {
                // Valeur mémorisée dans youScore.
                const youScore = scoreboard?.playerScore ?? 0;
                // Valeur mémorisée dans aiScore.
                const aiScore = scoreboard?.aiScore ?? 0;
                // Valeur mémorisée dans finalResult.
                let finalResult = "draw";
                // Vérification avant d'exécuter la suite.
                if (youScore > aiScore) finalResult = "win";
                // Deuxième possibilité à tester.
                else if (aiScore > youScore) finalResult = "loss";

                // Valeur mémorisée dans timeline.
                const timeline = typeof getGoalTimeline === "function"
                    // Appel de getGoalTimeline pour appliquer l'action prévue.
                    ? getGoalTimeline()
                    // Instruction nécessaire au déroulement de cette partie.
                    : { minuteButs: [], minuteButsAdversaire: [] };
                // Valeur mémorisée dans labels.
                const labels = typeof getTeamLabels === "function"
                    // Appel de getTeamLabels pour appliquer l'action prévue.
                    ? getTeamLabels()
                    // Instruction nécessaire au déroulement de cette partie.
                    : { left: 'YOU', right: 'IA' };

                // Appel de saveScoreToDB pour appliquer l'action prévue.
                saveScoreToDB({
                    // Paramètre de l'appel ou valeur de configuration.
                    mode: mode || "versus",
                    // Paramètre de l'appel ou valeur de configuration.
                    totalButs: youScore,
                    // Paramètre de l'appel ou valeur de configuration.
                    totalButsAdversaire: aiScore,
                    // Paramètre de l'appel ou valeur de configuration.
                    result: finalResult,
                    // Paramètre de l'appel ou valeur de configuration.
                    tournamentStage: mode === "tournament" ? tournamentStage : null,
                    // Paramètre de l'appel ou valeur de configuration.
                    teamLeftLabel: labels.left,
                    // Paramètre de l'appel ou valeur de configuration.
                    teamRightLabel: labels.right,
                    // Appel de isArray pour appliquer l'action prévue.
                    minuteButs: Array.isArray(timeline.minuteButs) ? timeline.minuteButs : [],
                    // Appel de isArray pour appliquer l'action prévue.
                    minuteButsAdversaire: Array.isArray(timeline.minuteButsAdversaire) ? timeline.minuteButsAdversaire : []
                // Appel de then pour appliquer l'action prévue.
                }).then(res => {
                    // Appel de log pour appliquer l'action prévue.
                    console.log("Score football sauvegardé:", res);
                // Ouverture du bloc correspondant.
                }).catch(err => {
                    // Appel de error pour appliquer l'action prévue.
                    console.error("Erreur lors de la sauvegarde du score football:", err);
                // Fermeture du bloc ou de l'appel.
                });
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de startMatchEndGamepadPolling pour appliquer l'action prévue.
            startMatchEndGamepadPolling();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction handleMatchEndContinue : elle regroupe le traitement de cette partie.
        function handleMatchEndContinue() {
            // Vérification avant d'exécuter la suite.
            if (typeof onContinueTournament === "function") {
                // Appel de onContinueTournament pour appliquer l'action prévue.
                onContinueTournament();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (typeof window.quitGame === "function") window.quitGame();
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction handleMatchEndQuit : elle regroupe le traitement de cette partie.
        function handleMatchEndQuit() {
            // Vérification avant d'exécuter la suite.
            if (typeof onQuitMatch === "function") {
                // Appel de onQuitMatch pour appliquer l'action prévue.
                onQuitMatch();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (typeof window.quitGame === "function") window.quitGame();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (halftimeContinueBtn) {
            // Appel de addEventListener pour appliquer l'action prévue.
            halftimeContinueBtn.addEventListener("click", resumeSecondHalf);
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (matchEndContinueBtn) {
            // Appel de addEventListener pour appliquer l'action prévue.
            matchEndContinueBtn.addEventListener("click", handleMatchEndContinue);
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (matchEndQuitBtn) {
            // Appel de addEventListener pour appliquer l'action prévue.
            matchEndQuitBtn.addEventListener("click", handleMatchEndQuit);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de addEventListener pour appliquer l'action prévue.
        document.addEventListener("keydown", handleMatchEndKeyboard);

        // Résultat renvoyé par la fonction.
        return {
            // Appel de function pour appliquer l'action prévue.
            update: function () {
                // Vérifier que la scène est toujours active (évite les appels orphelins)
                // Vérification avant d'exécuter la suite.
                if (!window.gameScene) return;
                
                // Vérification avant d'exécuter la suite.
                if (!scoreboard) return;
                // Vérification avant d'exécuter la suite.
                if (stage === 0 && scoreboard.matchTime >= halfSeconds) {
                    // Appel de triggerHalftime1 pour appliquer l'action prévue.
                    triggerHalftime1();
                // Deuxième possibilité à tester.
                } else if (stage === 2 && scoreboard.matchTime >= halfSeconds * 2) {
                    // Appel de triggerEndMatch pour appliquer l'action prévue.
                    triggerEndMatch();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            },
            // Appel de function pour appliquer l'action prévue.
            getStage: function () { return stage; },
            // Appel de function pour appliquer l'action prévue.
            cleanup: function () {
                // Appel de stopCountdown pour appliquer l'action prévue.
                stopCountdown();
                // Vérification avant d'exécuter la suite.
                if (halftimeResumeTimeout) {
                    // Appel de clearTimeout pour appliquer l'action prévue.
                    clearTimeout(halftimeResumeTimeout);
                    // Instruction nécessaire au déroulement de cette partie.
                    halftimeResumeTimeout = null;
                // Fermeture du bloc ou de l'appel.
                }
                // Appel de stopHalftimeGamepadPolling pour appliquer l'action prévue.
                stopHalftimeGamepadPolling();
                // Appel de stopMatchEndGamepadPolling pour appliquer l'action prévue.
                stopMatchEndGamepadPolling();
                // Vérification avant d'exécuter la suite.
                if (halftimeContinueBtn) {
                    // Appel de removeEventListener pour appliquer l'action prévue.
                    halftimeContinueBtn.removeEventListener("click", resumeSecondHalf);
                // Fermeture du bloc ou de l'appel.
                }
                // Vérification avant d'exécuter la suite.
                if (matchEndContinueBtn) {
                    // Appel de removeEventListener pour appliquer l'action prévue.
                    matchEndContinueBtn.removeEventListener("click", handleMatchEndContinue);
                // Fermeture du bloc ou de l'appel.
                }
                // Vérification avant d'exécuter la suite.
                if (matchEndQuitBtn) {
                    // Appel de removeEventListener pour appliquer l'action prévue.
                    matchEndQuitBtn.removeEventListener("click", handleMatchEndQuit);
                // Fermeture du bloc ou de l'appel.
                }
                // Appel de removeEventListener pour appliquer l'action prévue.
                document.removeEventListener("keydown", handleMatchEndKeyboard);
                // Appel de hideHalftimeOverlay pour appliquer l'action prévue.
                hideHalftimeOverlay();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de createMatchFlow.
    window.createMatchFlow = createMatchFlow;
// Instruction nécessaire au déroulement de cette partie.
})();

