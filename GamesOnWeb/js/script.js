// Import des outils nécessaires dans ce fichier.
import { gamepadState, getActiveGamepad, getPrimaryStick, setupGamepadNotifications } from "./input/gamepadManager.js";
// Import des outils nécessaires dans ce fichier.
import { launchPreMatchIntro } from "./ui/preMatchIntro.js";
// Import des outils nécessaires dans ce fichier.
import { checkGoalScored } from "./game/goalDetection.js";
// Import des outils nécessaires dans ce fichier.
import { updateBallPhysics } from "./game/ballPhysics.js";
// Import des outils nécessaires dans ce fichier.
import { updatePlayerMovement } from "./game/playerMovement.js";
// Import des outils nécessaires dans ce fichier.
import { setupTeams } from "./game/teamSetup.js";
// Import des outils nécessaires dans ce fichier.
import { getVersusScoreboardLabels, getVersusTeamLabels } from "./utils/teamLabels.js";
// Import des outils nécessaires dans ce fichier.
import { saveScoreToDB } from "./score/matchResult.js";

// Récupération de l'élément HTML canvas.
const canvas = document.getElementById("renderCanvas");
// Création de engine.
const engine = new BABYLON.Engine(canvas, true);

// Appel de setupGamepadNotifications pour appliquer l'action prévue.
setupGamepadNotifications();

// Valeur mémorisée dans TOURNAMENT_STAGES.
const TOURNAMENT_STAGES = ["huitieme", "quart", "demi", "finale"];
// Valeur mémorisée dans currentTournamentStage.
let currentTournamentStage = TOURNAMENT_STAGES[0];

// Fonction getNextTournamentStage : elle regroupe le traitement de cette partie.
function getNextTournamentStage(stage) {
    // Valeur mémorisée dans idx.
    const idx = TOURNAMENT_STAGES.indexOf(stage);
    // Vérification avant d'exécuter la suite.
    if (idx < 0 || idx >= TOURNAMENT_STAGES.length - 1) return null;
    // Résultat renvoyé par la fonction.
    return TOURNAMENT_STAGES[idx + 1];
// Fermeture du bloc ou de l'appel.
}

// Fonction setGameCanvasVisible : elle regroupe le traitement de cette partie.
function setGameCanvasVisible(visible) {
    // Vérification avant d'exécuter la suite.
    if (!canvas) return;
    // Mise à jour de display.
    canvas.style.display = visible ? "block" : "none";
// Fermeture du bloc ou de l'appel.
}

// Crée un indicateur visuel (petite flèche) au-dessus d'un joueur sélectionné
// Fonction createSelectionIndicator : elle regroupe le traitement de cette partie.
function createSelectionIndicator(scene, playerNode, options = {}) {
    // Valeur mémorisée dans suffix.
    const suffix = options.suffix || "";
    // Création de color.
    const color = options.color || new BABYLON.Color3(1, 0.9, 0.2);

    // Création de root.
    const root = new BABYLON.TransformNode("selectionIndicatorRoot" + suffix, scene);
        // Hauteur suffisante pour être bien au-dessus de la tête, même avec les skins les plus grands
        // Mise à jour de position.
        root.position = new BABYLON.Vector3(0, 10, 0);

    // Préparation de arrow avec Babylon.js.
    const arrow = BABYLON.MeshBuilder.CreateCylinder("selectionArrow" + suffix, {
            // Paramètre de l'appel ou valeur de configuration.
            height: 1.6,
            // Paramètre de l'appel ou valeur de configuration.
            diameterTop: 0,
            // Paramètre de l'appel ou valeur de configuration.
            diameterBottom: 0.9,
            // Instruction nécessaire au déroulement de cette partie.
            tessellation: 4
        // Instruction nécessaire au déroulement de cette partie.
        }, scene);
        // Mise à jour de parent.
        arrow.parent = root;

    // Création de mat.
    const mat = new BABYLON.StandardMaterial("selectionArrowMat" + suffix, scene);
    // Mise à jour de emissiveColor.
    mat.emissiveColor = color;
        // Mise à jour de specularColor.
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        // Mise à jour de material.
        arrow.material = mat;

        // Vérification avant d'exécuter la suite.
        if (playerNode) {
            // Mise à jour de parent.
            root.parent = playerNode;
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return root;
// Fermeture du bloc ou de l'appel.
}

// Place les deux équipes en lignes pour l'intro de match
// Fonction placeTeamsForIntro : elle regroupe le traitement de cette partie.
function placeTeamsForIntro(myTeam, opponentTeam) {
    // Fonction placeTeamLine : elle regroupe le traitement de cette partie.
    const placeTeamLine = (team, side) => {
        // Vérification avant d'exécuter la suite.
        if (!team || !team.players) return;

        // Valeur mémorisée dans lineX.
        const lineX = -5 * side; // proche de la ligne médiane côté équipe
        // Valeur mémorisée dans baseZ.
        const baseZ = -12;
        // Valeur mémorisée dans spacingZ.
        const spacingZ = 6;

        // Appel de forEach pour appliquer l'action prévue.
        team.players.forEach((p, index) => {
            // Vérification avant d'exécuter la suite.
            if (!p || !p.position) return;

            // Mise à jour de x.
            p.position.x = lineX;
            // Mise à jour de y.
            p.position.y = 0;
            // Mise à jour de z.
            p.position.z = baseZ + spacingZ * index;

            // Vérification avant d'exécuter la suite.
            if (p.model) {
                // Orientation vers le centre du terrain
                // Mise à jour de y.
                p.model.rotation.y = side === 1 ? Math.PI / 2 : -Math.PI / 2;
                // Mise à jour de z.
                p.model.rotation.z = 0;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    };

    // Équipe de gauche (side = 1) et de droite (side = -1)
    // Appel de placeTeamLine pour appliquer l'action prévue.
    placeTeamLine(myTeam, 1);
    // Appel de placeTeamLine pour appliquer l'action prévue.
    placeTeamLine(opponentTeam, -1);
// Fermeture du bloc ou de l'appel.
}

// Valeur mémorisée dans createScene.
const createScene = function (gameMode) {

    // Valeur mémorisée dans mode.
    const mode = gameMode === "versus" ? "versus" : "tournament";

    // VARIABLES 
    // Valeur mémorisée dans chargeStart.
    let chargeStart = 0;
    // Valeur mémorisée dans isCharging.
    let isCharging = false;

    // Valeur mémorisée dans maxChargeTime.
    const maxChargeTime = 1000; // 1 seconde max
    // Valeur mémorisée dans maxForce.
    const maxForce = 25;

    // Création de scene.
    const scene = new BABYLON.Scene(engine);


    // Vérification avant d'exécuter la suite.
    if (window.matchAudio && typeof window.matchAudio.init === "function") {
        // Appel de init pour appliquer l'action prévue.
        window.matchAudio.init(scene, {
            // Paramètre de l'appel ou valeur de configuration.
            whistleUrl: "./assets/Sifflet.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            kickUrl: "./assets/Kick.mp3",
            // Paramètre de l'appel ou valeur de configuration.
            goalUrl: "./assets/Goal.mp3",
            // Instruction nécessaire au déroulement de cette partie.
            debug: true
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de collisionsEnabled.
    scene.collisionsEnabled = true;

    // Light (ambiance plus douce)
    // Création de light.
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    // Mise à jour de intensity.
    light.intensity = 0.45;

    // --- Environnement (espace autour du stade) ---
    // Appel de createEnvironment pour appliquer l'action prévue.
    createEnvironment(scene); // Defined in js/structure/environnement.js

    // --- TOURNAMENT STATE ---
    // Valeur mémorisée dans tournamentStage.
    const tournamentStage = currentTournamentStage;
    // Valeur mémorisée dans isVersusMode.
    const isVersusMode = mode === "versus";

    // --- Structure ---

    // Appel de createField pour appliquer l'action prévue.
    createField(scene); 

    // Valeur mémorisée dans tribune.
    let tribune;
    // Sélection du traitement selon la valeur.
    switch(tournamentStage) {
        // Option possible dans ce choix.
        case "huitieme": tribune = new TribuneHuitieme(scene); break;
        // Option possible dans ce choix.
        case "quart": tribune = new TribuneQuart(scene); break;
        // Option possible dans ce choix.
        case "demi": tribune = new TribuneDemi(scene); break;
        // Option possible dans ce choix.
        case "finale": tribune = new TribuneFinale(scene); break;
        // Option par défaut.
        default: tribune = new TribuneHuitieme(scene); break;
    // Fermeture du bloc ou de l'appel.
    }
    // Appel de create pour appliquer l'action prévue.
    tribune.create();

    
    // --- Objects ---
    // Création de leftGoal.
    const leftGoal = createGoal(scene, new BABYLON.Vector3(-50, 0, 0), Math.PI / 2);
    // Création de rightGoal.
    const rightGoal = createGoal(scene, new BABYLON.Vector3(50, 0, 0), -Math.PI / 2);

    // Liste des poteaux (pour les rebonds de la balle)
    // Valeur mémorisée dans goalPosts.
    const goalPosts = [
        // Paramètre de l'appel ou valeur de configuration.
        leftGoal.leftPost,
        // Paramètre de l'appel ou valeur de configuration.
        leftGoal.rightPost,
        // Paramètre de l'appel ou valeur de configuration.
        rightGoal.leftPost,
        // Instruction nécessaire au déroulement de cette partie.
        rightGoal.rightPost
    // Fermeture du bloc ou de l'appel.
    ];

    // Ball
    // Valeur mémorisée dans ball.
    const ball = createBall(scene);
    // Mise à jour de checkCollisions.
    ball.checkCollisions = true;
    // Mise à jour de ellipsoid.
    ball.ellipsoid = new BABYLON.Vector3(0.55, 0.55, 0.55);

    // Mise à jour de isOutAnimationPlaying.
    ball.isOutAnimationPlaying = false;
    // Mise à jour de outAnimationFinished.
    ball.outAnimationFinished = false;
    // Mise à jour de outVelocity.
    ball.outVelocity = new BABYLON.Vector3(0, 0, 0);
    // Mise à jour de isOutOfPlay.
    ball.isOutOfPlay = false;
    // Mise à jour de outTimer.
    ball.outTimer = 0;
    // Mise à jour de outFallDelay.
    ball.outFallDelay = 0;

    // Mise à jour de pushLockUntil.
    ball.pushLockUntil = 0;
    // Mise à jour de ignorePlayerCollisionUntil.
    ball.ignorePlayerCollisionUntil = 0;
    // Mise à jour de lastKicker.
    ball.lastKicker = null;
    // Mise à jour de lastTouchTeam.
    ball.lastTouchTeam = null;

    // Mise à jour de outDecision.
    ball.outDecision = null;
    // Mise à jour de outExitPosition.
    ball.outExitPosition = null;

    // Mise à jour de restartLocked.
    ball.restartLocked = false;
    // Mise à jour de restartTaker.
    ball.restartTaker = null;

    // Panneaux de score 3D style stade
    // Appel de createScoreboard3D pour appliquer l'action prévue.
    createScoreboard3D(scene);

    // Jauge de tir
    // Valeur mémorisée dans kickGauge.
    const kickGauge = createKickGauge(scene);
    // Mise à jour de kickGauge.
    window.kickGauge = kickGauge;
    // Appel de drawGaugeColors pour appliquer l'action prévue.
    drawGaugeColors(kickGauge);

    // Valeur mémorisée dans teams.
    const teams = setupTeams(scene, mode, tournamentStage);
    // Valeur mémorisée dans myTeam.
    const myTeam = teams.myTeam;
    // Valeur mémorisée dans scoreboardLabels.
    const scoreboardLabels = mode === "versus" ? getVersusScoreboardLabels() : { left: "YOU", right: "IA" };
    // Valeur mémorisée dans versusTeamLabels.
    const versusTeamLabels = mode === "versus" ? getVersusTeamLabels() : null;

    // Vérification avant d'exécuter la suite.
    if (window.gameScoreboard && typeof window.gameScoreboard.updateTeamLabels === "function") {
        // Appel de updateTeamLabels pour appliquer l'action prévue.
        window.gameScoreboard.updateTeamLabels(scoreboardLabels.left, scoreboardLabels.right);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (window.scoreBoard3D && typeof window.scoreBoard3D.setTeamLabels === "function") {
        // Appel de setTeamLabels pour appliquer l'action prévue.
        window.scoreBoard3D.setTeamLabels(scoreboardLabels.left, scoreboardLabels.right);
    // Fermeture du bloc ou de l'appel.
    }

    // Pour l'instant, le "joueur actif" est le premier attaquant (index 3)
    // Valeur mémorisée dans activePlayer.
    let activePlayer = myTeam.players[3]; 
    // Valeur mémorisée dans basePlayer.
    const basePlayer = activePlayer;
    // Mise à jour de activePlayer.
    myTeam.activePlayer = activePlayer;

    // Indicateur de sélection (flèche) au-dessus du joueur actif (J1)
    // Valeur mémorisée dans selectionIndicator.
    const selectionIndicator = createSelectionIndicator(scene, activePlayer, {
        // Paramètre de l'appel ou valeur de configuration.
        suffix: "_p1",
        // Appel de Color3 pour appliquer l'action prévue.
        color: new BABYLON.Color3(1, 0.9, 0.2)
    // Fermeture du bloc ou de l'appel.
    });

    // Indicateur de sélection du joueur actif J2 (mode 1v1) : rouge
    // Valeur mémorisée dans player2SelectionIndicator.
    let player2SelectionIndicator = null;

    // Valeur mémorisée dans opponentTeam.
    const opponentTeam = teams.opponentTeam;
    // Vérification avant d'exécuter la suite.
    if (isVersusMode) {
        // Mise à jour de activePlayer.
        opponentTeam.activePlayer = opponentTeam.players[3] || opponentTeam.players[0] || null;

        // Appel de createSelectionIndicator pour appliquer l'action prévue.
        player2SelectionIndicator = createSelectionIndicator(scene, opponentTeam.activePlayer || null, {
            // Paramètre de l'appel ou valeur de configuration.
            suffix: "_p2",
            // Appel de Color3 pour appliquer l'action prévue.
            color: new BABYLON.Color3(1, 0.2, 0.2)
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Création de tackleController.
    const tackleController = new TackleController();
    // Valeur mémorisée dans player2Controller.
    let player2Controller = null;


    // Valeur mémorisée dans HALF_TIME_SECONDS.
    const HALF_TIME_SECONDS = 20;
    // Valeur mémorisée dans HALF_TIME_PAUSE_SECONDS.
    const HALF_TIME_PAUSE_SECONDS = 10;

    // Valeur mémorisée dans goalTimes.
    const goalTimes = {
        // Paramètre de l'appel ou valeur de configuration.
        player: [],
        // Instruction nécessaire au déroulement de cette partie.
        opponent: []
    // Fermeture du bloc ou de l'appel.
    };

    // Fonction formatMatchClock : elle regroupe le traitement de cette partie.
    const formatMatchClock = (totalSeconds) => {
        // Valeur mémorisée dans safeSeconds.
        const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
        // Valeur mémorisée dans minutes.
        const minutes = Math.floor(safeSeconds / 60);
        // Valeur mémorisée dans seconds.
        const seconds = safeSeconds % 60;
        // Résultat renvoyé par la fonction.
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    // Fermeture du bloc ou de l'appel.
    };

    // Valeur mémorisée dans gameplayPaused.
    let gameplayPaused = false;
    // Valeur mémorisée dans preMatchIntroPlaying.
    let preMatchIntroPlaying = true;

    // Fonction setGameplayPaused : elle regroupe le traitement de cette partie.
    const setGameplayPaused = (v) => {
        // Instruction nécessaire au déroulement de cette partie.
        gameplayPaused = !!v;
    // Fermeture du bloc ou de l'appel.
    };

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

    // Valeur mémorisée dans matchFlow.
    let matchFlow = null;

    // Cameras Setup (TPS et FPS gérées dans cameras.js)
    // Valeur mémorisée dans cameras.
    const cameras = setupCameras(scene, canvas, activePlayer);
    // Vérification avant d'exécuter la suite.
    if (isVersusMode && cameras && cameras.broadcastCamera) {
        // Mise à jour de activeCamera.
        scene.activeCamera = cameras.broadcastCamera;
    // Fermeture du bloc ou de l'appel.
    }
    // Valeur mémorisée dans cameraRuntime.
    const cameraRuntime = (window.createCameraRuntimeController && typeof window.createCameraRuntimeController === "function")
        // Appel de createCameraRuntimeController pour appliquer l'action prévue.
        ? window.createCameraRuntimeController({ scene, cameras, myTeam, selectionIndicator, ball, tournamentStage })
        // Instruction nécessaire au déroulement de cette partie.
        : null;

    // ── Exposition globale pour settings.js (pause + caméra) ──────
    // Mise à jour de setGameplayPaused.
    window.setGameplayPaused  = setGameplayPaused;
    // Mise à jour de gameCameras.
    window.gameCameras        = cameras;
    // Mise à jour de gameScene.
    window.gameScene          = scene;
    // Mise à jour de getActivePlayer.
    window.getActivePlayer    = () => activePlayer;
    // Mise à jour de cameraRuntime.
    window.cameraRuntime      = cameraRuntime;
    // Mise à jour de isIntroPlaying.
    window.isIntroPlaying     = () => preMatchIntroPlaying;
    // Mise à jour de isVersusMode.
    window.isVersusMode       = () => isVersusMode;
    // Mise à jour de isMatchEnded.
    window.isMatchEnded       = () => matchFlow && typeof matchFlow.getStage === "function" && matchFlow.getStage() === 3;

    // Valeur mémorisée dans goalReplay.
    const goalReplay = window.createGoalReplayController({
        // Paramètre de l'appel ou valeur de configuration.
        scene,
        // Paramètre de l'appel ou valeur de configuration.
        ball,
        // Paramètre de l'appel ou valeur de configuration.
        myTeam,
        // Paramètre de l'appel ou valeur de configuration.
        opponentTeam,
        // Paramètre de l'appel ou valeur de configuration.
        cameras,
        // Paramètre de l'appel ou valeur de configuration.
        maxReplayTimeMs: 5000,
        // Paramètre de l'appel ou valeur de configuration.
        replayFrameStepMs: 1000 / 60,
        // Ouverture du bloc correspondant.
        onReplayEnd: ({ playerScored, aiScored }) => {
            // Appel de stopAnimation pour appliquer l'action prévue.
            scene.stopAnimation(ball);
            // Mise à jour de position.
            ball.position = new BABYLON.Vector3(0, 0.65, 0);
            // Mise à jour de rotation.
            ball.rotation = new BABYLON.Vector3(0, 0, 0);

            // Vérification avant d'exécuter la suite.
            if (ball.velocity) {
                // Appel de set pour appliquer l'action prévue.
                ball.velocity.set(0, 0, 0);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (playerScored) {
                // Appel de playerScored pour appliquer l'action prévue.
                window.gameScoreboard.playerScored();
                // Appel de push pour appliquer l'action prévue.
                goalTimes.player.push(formatMatchClock(window.gameScoreboard?.matchTime));
            // Deuxième possibilité à tester.
            } else if (aiScored) {
                // Appel de aiScored pour appliquer l'action prévue.
                window.gameScoreboard.aiScored();
                // Appel de push pour appliquer l'action prévue.
                goalTimes.opponent.push(formatMatchClock(window.gameScoreboard?.matchTime));
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (myTeam && myTeam.resetPositions) myTeam.resetPositions();
            // Vérification avant d'exécuter la suite.
            if (opponentTeam && opponentTeam.resetPositions) opponentTeam.resetPositions();

            // Appel de resetTeamStamina pour appliquer l'action prévue.
            resetTeamStamina(myTeam);
            // Appel de resetTeamStamina pour appliquer l'action prévue.
            resetTeamStamina(opponentTeam);

            // Instruction nécessaire au déroulement de cette partie.
            activePlayer = myTeam.players[3];
            // Mise à jour de activePlayer.
            myTeam.activePlayer = myTeam.players[3];

            // Vérification avant d'exécuter la suite.
            if (selectionIndicator && activePlayer) {
                // Mise à jour de parent.
                selectionIndicator.parent = activePlayer;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (cameras?.fpvCamera) {
                // Mise à jour de parent.
                cameras.fpvCamera.parent = activePlayer;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (cameraRuntime && typeof cameraRuntime.syncTargetToActivePlayer === "function") {
                // Appel de syncTargetToActivePlayer pour appliquer l'action prévue.
                cameraRuntime.syncTargetToActivePlayer(activePlayer);
            // Deuxième possibilité à tester.
            } else if (cameras?.cameraTargetNode && activePlayer?.position) {
                // Appel de copyFrom pour appliquer l'action prévue.
                cameras.cameraTargetNode.position.copyFrom(activePlayer.position);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio.playWhistle === "function") {
                // Appel de playWhistle pour appliquer l'action prévue.
                window.matchAudio.playWhistle();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });
    // Mise à jour de goalReplayController.
    window.goalReplayController = goalReplay;

    // Seance de tirs au but (declenchee automatiquement par matchFlow en cas de nul)
    // Vérification avant d'exécuter la suite.
    if (window.createPenaltyShootout) {
        // Mise à jour de penaltyShootout.
        window.penaltyShootout = window.createPenaltyShootout({
            // Paramètre de l'appel ou valeur de configuration.
            scene,
            // Paramètre de l'appel ou valeur de configuration.
            ball,
            // Paramètre de l'appel ou valeur de configuration.
            myTeam,
            // Paramètre de l'appel ou valeur de configuration.
            opponentTeam,
            // Paramètre de l'appel ou valeur de configuration.
            cameras,
            // Paramètre de l'appel ou valeur de configuration.
            kickFn: kick,
            // Paramètre de l'appel ou valeur de configuration.
            kickGauge,
            // Paramètre de l'appel ou valeur de configuration.
            hideKickGauge,
            // Paramètre de l'appel ou valeur de configuration.
            setGameplayPaused,
            // Appel de function pour appliquer l'action prévue.
            onShootoutEnd: function (winner) {
                // Récupération de l'élément HTML matchEndOverlay.
                const matchEndOverlay = document.getElementById("match-end-overlay");
                // Récupération de l'élément HTML matchEndResultEl.
                const matchEndResultEl = document.getElementById("match-end-result");
                // Récupération de l'élément HTML matchEndScoreEl.
                const matchEndScoreEl = document.getElementById("match-end-score");

                // Vérification avant d'exécuter la suite.
                if (matchEndOverlay) {
                    // Mise à jour de display.
                    matchEndOverlay.style.display = "block";
                    // Appel de remove pour appliquer l'action prévue.
                    matchEndOverlay.classList.remove("match-end--you", "match-end--ai", "match-end--draw");
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (matchEndResultEl) {
                    // Mise à jour de textContent.
                    matchEndResultEl.textContent =
                        // Instruction nécessaire au déroulement de cette partie.
                        winner === "player" ? "Victoire aux tirs au but !" :
                        // Instruction nécessaire au déroulement de cette partie.
                        winner === "ai" ? "Defaite aux tirs au but" :
                        // Instruction nécessaire au déroulement de cette partie.
                        "Egalite parfaite";
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (matchEndScoreEl && window.gameScoreboard && typeof window.gameScoreboard.getScorelineText === "function") {
                    // Mise à jour de textContent.
                    matchEndScoreEl.textContent = window.gameScoreboard.getScorelineText();
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (matchEndOverlay) {
                    // Appel de add pour appliquer l'action prévue.
                    matchEndOverlay.classList.add(
                        // Instruction nécessaire au déroulement de cette partie.
                        winner === "player" ? "match-end--you" :
                        // Instruction nécessaire au déroulement de cette partie.
                        winner === "ai" ? "match-end--ai" :
                        // Instruction nécessaire au déroulement de cette partie.
                        "match-end--draw"
                    // Fermeture du bloc ou de l'appel.
                    );
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Mise à jour de penaltyShootout.
        window.penaltyShootout = null;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (isVersusMode && window.Player2Controller) {
        // Appel de Player2Controller pour appliquer l'action prévue.
        player2Controller = new window.Player2Controller({
            // Paramètre de l'appel ou valeur de configuration.
            scene,
            // Paramètre de l'appel ou valeur de configuration.
            team: opponentTeam,
            // Paramètre de l'appel ou valeur de configuration.
            opponentTeam: myTeam,
            // Paramètre de l'appel ou valeur de configuration.
            ball,
            // Paramètre de l'appel ou valeur de configuration.
            tackleController,
            // Bloque J2 uniquement pendant intro / pause / replay, pas pendant le jeu normal
            // Appel de isReplayActive pour appliquer l'action prévue.
            isBlocked: () => preMatchIntroPlaying || gameplayPaused || goalReplay.isReplayActive(),
            // Ouverture du bloc correspondant.
            computeMoveAxes: (inputP2) => {
                // Vérification avant d'exécuter la suite.
                if (cameraRuntime && typeof cameraRuntime.computeMoveAxes === "function") {
                    // Résultat renvoyé par la fonction.
                    return cameraRuntime.computeMoveAxes(inputP2);
                // Fermeture du bloc ou de l'appel.
                }
                // Valeur mémorisée dans mx.
                let mx = 0;
                // Valeur mémorisée dans mz.
                let mz = 0;
                // Vérification avant d'exécuter la suite.
                if (inputP2.forward) mx += 1;
                // Vérification avant d'exécuter la suite.
                if (inputP2.backward) mx -= 1;
                // Vérification avant d'exécuter la suite.
                if (inputP2.left) mz += 1;
                // Vérification avant d'exécuter la suite.
                if (inputP2.right) mz -= 1;
                // Résultat renvoyé par la fonction.
                return { moveX: mx, moveZ: mz };
            // Fermeture du bloc ou de l'appel.
            },
            // Appel de isRestartTaker pour appliquer l'action prévue.
            isMovementLocked: (player) => isRestartTaker(player),
            // Ouverture du bloc correspondant.
            onShoot: ({ player, direction, force }) => {
                // Vérification avant d'exécuter la suite.
                if (isRestartWaitingKick() && isRestartTaker(player)) {
                    // Appel de takeRestartKick pour appliquer l'action prévue.
                    takeRestartKick(ball, direction, force);
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Appel de kick pour appliquer l'action prévue.
                    kick(scene, ball, player, direction, force, opponentTeam);
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Branche la gestion mi-temps / fin du match (affichage + pause/reprise)
    // Vérification avant d'exécuter la suite.
    if (window.createMatchFlow) {
        // Fonction setActivePlayerFn : elle regroupe le traitement de cette partie.
        const setActivePlayerFn = (p) => {
            // Instruction nécessaire au déroulement de cette partie.
            activePlayer = p;
            // Mise à jour de activePlayer.
            myTeam.activePlayer = p;
            // Vérification avant d'exécuter la suite.
            if (selectionIndicator && p) {
                // Mise à jour de parent.
                selectionIndicator.parent = p;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        };

        // Appel de createMatchFlow pour appliquer l'action prévue.
        matchFlow = window.createMatchFlow({
            // Paramètre de l'appel ou valeur de configuration.
            halfSeconds: HALF_TIME_SECONDS,
            // Paramètre de l'appel ou valeur de configuration.
            halftimePauseSeconds: HALF_TIME_PAUSE_SECONDS,
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
            // Appel de function pour appliquer l'action prévue.
            onContinueTournament: function () {
                // Valeur mémorisée dans nextStage.
                const nextStage = getNextTournamentStage(currentTournamentStage);
                // Vérification avant d'exécuter la suite.
                if (!nextStage) {
                    // Appel de quitGame pour appliquer l'action prévue.
                    quitGame();
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }
                // Instruction nécessaire au déroulement de cette partie.
                currentTournamentStage = nextStage;
                // Appel de startGame pour appliquer l'action prévue.
                startGame("tournament");
            // Fermeture du bloc ou de l'appel.
            },
            // Appel de function pour appliquer l'action prévue.
            onQuitMatch: function () {
                // Appel de quitGame pour appliquer l'action prévue.
                quitGame();
            // Fermeture du bloc ou de l'appel.
            },
            // Paramètre de l'appel ou valeur de configuration.
            saveScoreToDB: saveScoreToDB,
            // Appel de function pour appliquer l'action prévue.
            getGoalTimeline: function () {
                // Résultat renvoyé par la fonction.
                return {
                    // Paramètre de l'appel ou valeur de configuration.
                    minuteButs: [...goalTimes.player],
                    // Instruction nécessaire au déroulement de cette partie.
                    minuteButsAdversaire: [...goalTimes.opponent]
                // Fermeture du bloc ou de l'appel.
                };
            // Fermeture du bloc ou de l'appel.
            },
            // Appel de function pour appliquer l'action prévue.
            getTeamLabels: function () {
                // Résultat renvoyé par la fonction.
                return {
                    // Paramètre de l'appel ou valeur de configuration.
                    left: versusTeamLabels?.leftName || scoreboardLabels?.left || 'YOU',
                    // Instruction nécessaire au déroulement de cette partie.
                    right: versusTeamLabels?.rightName || scoreboardLabels?.right || 'IA'
                // Fermeture du bloc ou de l'appel.
                };
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
        // Instruction nécessaire au déroulement de cette partie.
        activeMatchFlow = matchFlow;
    // Fermeture du bloc ou de l'appel.
    }

    // Input & Variables de base
    // Valeur mémorisée dans input.
    const input = {
        // Paramètre de l'appel ou valeur de configuration.
        forward:false,
        // Paramètre de l'appel ou valeur de configuration.
        backward:false,
        // Paramètre de l'appel ou valeur de configuration.
        left:false,
        // Paramètre de l'appel ou valeur de configuration.
        right:false,
        // Instruction nécessaire au déroulement de cette partie.
        sprint:false
    // Fermeture du bloc ou de l'appel.
    };

    // Valeur mémorisée dans inputController.
    const inputController = window.createInputController({
        // Appel de function pour appliquer l'action prévue.
        isBlocked: function () { return preMatchIntroPlaying; },
        // Appel de function pour appliquer l'action prévue.
        onPress: function (action, event) {
            // Vérification avant d'exécuter la suite.
            if (action === "forward") input.forward = true;
            // Vérification avant d'exécuter la suite.
            if (action === "backward") input.backward = true;
            // Vérification avant d'exécuter la suite.
            if (action === "left") input.left = true;
            // Vérification avant d'exécuter la suite.
            if (action === "right") input.right = true;
            // Vérification avant d'exécuter la suite.
            if (action === "sprint") input.sprint = true;

            // Vérification avant d'exécuter la suite.
            if (action === "shoot" && !isCharging) {
                // Appel de now pour appliquer l'action prévue.
                chargeStart = Date.now();
                // Instruction nécessaire au déroulement de cette partie.
                isCharging = true;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (action === "switchLeft") {
                // Vérification avant d'exécuter la suite.
                if (isRestartWaitingKick()) return;

                // Valeur mémorisée dans p.
                const p = myTeam.getPlayerOnSide("left");
                // Appel de switchPlayerSmooth pour appliquer l'action prévue.
                myTeam.switchPlayerSmooth(p, cameras, scene, 180);
                // Instruction nécessaire au déroulement de cette partie.
                activePlayer = myTeam.activePlayer;
                // Vérification avant d'exécuter la suite.
                if (selectionIndicator && activePlayer) {
                    // Mise à jour de parent.
                    selectionIndicator.parent = activePlayer;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (action === "switchRight") {
                // Vérification avant d'exécuter la suite.
                if (isRestartWaitingKick()) return;

                // Valeur mémorisée dans p.
                const p = myTeam.getPlayerOnSide("right");
                // Appel de switchPlayerSmooth pour appliquer l'action prévue.
                myTeam.switchPlayerSmooth(p, cameras, scene, 180);
                // Instruction nécessaire au déroulement de cette partie.
                activePlayer = myTeam.activePlayer;
                // Vérification avant d'exécuter la suite.
                if (selectionIndicator && activePlayer) {
                    // Mise à jour de parent.
                    selectionIndicator.parent = activePlayer;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (action === "tackle") {
                // Valeur mémorisée dans binds.
                const binds = window.inputBindings ? window.inputBindings.getBindings() : {};
                // Appel de handleKeyDown pour appliquer l'action prévue.
                tackleController.handleKeyDown(event, {
                    // Paramètre de l'appel ou valeur de configuration.
                    activePlayer,
                    // Paramètre de l'appel ou valeur de configuration.
                    playerFacing,
                    // Paramètre de l'appel ou valeur de configuration.
                    ball,
                    // Paramètre de l'appel ou valeur de configuration.
                    opponentTeam,
                    // Paramètre de l'appel ou valeur de configuration.
                    team: myTeam,
                    // Instruction nécessaire au déroulement de cette partie.
                    tackleKey: binds.tackle
                // Fermeture du bloc ou de l'appel.
                });
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        },
        // Appel de function pour appliquer l'action prévue.
        onRelease: function (action, event) {
            // Vérification avant d'exécuter la suite.
            if (action === "forward") input.forward = false;
            // Vérification avant d'exécuter la suite.
            if (action === "backward") input.backward = false;
            // Vérification avant d'exécuter la suite.
            if (action === "left") input.left = false;
            // Vérification avant d'exécuter la suite.
            if (action === "right") input.right = false;
            // Vérification avant d'exécuter la suite.
            if (action === "sprint") input.sprint = false;

            // Vérification avant d'exécuter la suite.
            if (action === "shoot" && isCharging) {
                // Valeur mémorisée dans force.
                const force = computeKickPower(kickGauge);

                // Appel de hideKickGauge pour appliquer l'action prévue.
                hideKickGauge(kickGauge);

                // Vérification avant d'exécuter la suite.
                if (window.penaltyShootout && window.penaltyShootout.isActive()) {
                    // Appel de handlePlayerRelease pour appliquer l'action prévue.
                    window.penaltyShootout.handlePlayerRelease(force, lastDirection);
                    // Instruction nécessaire au déroulement de cette partie.
                    isCharging = false;
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (isRestartWaitingKick()) {
                    // Appel de takeRestartKick pour appliquer l'action prévue.
                    takeRestartKick(ball, lastDirection, force);
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Appel de kick pour appliquer l'action prévue.
                    kick(scene, ball, activePlayer, lastDirection, force, myTeam);
                // Fermeture du bloc ou de l'appel.
                }

                // Instruction nécessaire au déroulement de cette partie.
                isCharging = false;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });

    // Vitesse de marche de base
    // Valeur mémorisée dans baseSpeed.
    const baseSpeed = 0.07;
    // Multiplicateur de sprint (un peu plus rapide aussi)
    // Valeur mémorisée dans SPRINT_MULTIPLIER.
    const SPRINT_MULTIPLIER = 1.8;
    // Valeur mémorisée dans STAMINA_DRAIN_RATE.
    const STAMINA_DRAIN_RATE = 0.35; // par seconde en sprint
    // Valeur mémorisée dans STAMINA_REGEN_RATE.
    const STAMINA_REGEN_RATE = 0.25; // par seconde en marche/repos

    // Création de lastDirection.
    let lastDirection = new BABYLON.Vector3(1,0,0);
    // Création de playerFacing.
    let playerFacing = new BABYLON.Vector3(1,0,0);

    // Valeur mémorisée dans previousPlayerPosition.
    let previousPlayerPosition = activePlayer.position.clone();
    // Création de playerMoveVelocity.
    let playerMoveVelocity = new BABYLON.Vector3(0, 0, 0);
    // Valeur mémorisée dans player2ChargeState.
    let player2ChargeState = null;

    // Valeur mémorisée dans lastKickTime.
    let lastKickTime = 0;
    // Valeur mémorisée dans kickCooldown.
    const kickCooldown = 300;

    // Valeur mémorisée dans goalEmergencyUntil.
    let goalEmergencyUntil = 0;
    // Valeur mémorisée dans lastGoalEmergencySwitch.
    let lastGoalEmergencySwitch = 0;

    // Fonction getTeamGoalkeeper : elle regroupe le traitement de cette partie.
    function getTeamGoalkeeper(team) {
        // Résultat renvoyé par la fonction.
        return team?.players?.find(p => p && p.role === "GK") || null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getClosestPlayerFromTeamToBall : elle regroupe le traitement de cette partie.
    function getClosestPlayerFromTeamToBall(team, ball) {
        // Vérification avant d'exécuter la suite.
        if (!team?.players || !ball?.position) return null;

        // Valeur mémorisée dans closest.
        let closest = null;
        // Valeur mémorisée dans bestDist.
        let bestDist = Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        team.players.forEach(player => {
            // Vérification avant d'exécuter la suite.
            if (!player || !player.position) return;

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(player.position, ball.position);
            // Vérification avant d'exécuter la suite.
            if (dist < bestDist) {
                // Instruction nécessaire au déroulement de cette partie.
                bestDist = dist;
                // Instruction nécessaire au déroulement de cette partie.
                closest = player;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Résultat renvoyé par la fonction.
        return closest;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction switchInstantToGoalkeeper : elle regroupe le traitement de cette partie.
    function switchInstantToGoalkeeper() {
        // Valeur mémorisée dans gk.
        const gk = getTeamGoalkeeper(myTeam);
        // Vérification avant d'exécuter la suite.
        if (!gk) return false;

        // Vérification avant d'exécuter la suite.
        if (myTeam.activePlayer !== gk) {
            // Appel de switchPlayer pour appliquer l'action prévue.
            myTeam.switchPlayer(gk, cameras);

            // Vérification avant d'exécuter la suite.
            if (cameras?.cameraTargetNode) {
                // Appel de copyFrom pour appliquer l'action prévue.
                cameras.cameraTargetNode.position.copyFrom(gk.position);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (selectionIndicator) {
                // Mise à jour de parent.
                selectionIndicator.parent = gk;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        activePlayer = myTeam.activePlayer;

        // Vérification avant d'exécuter la suite.
        if (cameraRuntime && typeof cameraRuntime.syncTargetToActivePlayer === "function") {
            // Appel de syncTargetToActivePlayer pour appliquer l'action prévue.
            cameraRuntime.syncTargetToActivePlayer(gk);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de lockAutoSwitch pour appliquer l'action prévue.
        myTeam.lockAutoSwitch(900);
        // Mise à jour de goalEmergencyModeUntil.
        myTeam.goalEmergencyModeUntil = performance.now() + 1400;
        // Appel de now pour appliquer l'action prévue.
        goalEmergencyUntil = performance.now() + 1400;
        // Appel de now pour appliquer l'action prévue.
        lastGoalEmergencySwitch = performance.now();
        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isDangerOnMyGoal : elle regroupe le traitement de cette partie.
    function isDangerOnMyGoal() {
        // Valeur mémorisée dans gk.
        const gk = getTeamGoalkeeper(myTeam);
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball?.position) return false;

        // Valeur mémorisée dans myGoalX.
        const myGoalX = gk.homePosition ? gk.homePosition.x : gk.position.x;
        // Valeur mémorisée dans isLeftGoal.
        const isLeftGoal = myGoalX < 0;

        // Valeur mémorisée dans boxDepth.
        const boxDepth = 18;
        // Valeur mémorisée dans boxHalfWidth.
        const boxHalfWidth = 16;
        // Valeur mémorisée dans warningLine.
        const warningLine = 26;

        // Valeur mémorisée dans inMyBox.
        const inMyBox = isLeftGoal
            // Appel de abs pour appliquer l'action prévue.
            ? (ball.position.x <= myGoalX + boxDepth && Math.abs(ball.position.z) <= boxHalfWidth)
            // Appel de abs pour appliquer l'action prévue.
            : (ball.position.x >= myGoalX - boxDepth && Math.abs(ball.position.z) <= boxHalfWidth);

        // Valeur mémorisée dans inDangerZone.
        const inDangerZone = isLeftGoal
            // Instruction nécessaire au déroulement de cette partie.
            ? ball.position.x <= warningLine * -1
            // Instruction nécessaire au déroulement de cette partie.
            : ball.position.x >= warningLine;

        // Valeur mémorisée dans ballTowardGoal.
        let ballTowardGoal = false;
        // Vérification avant d'exécuter la suite.
        if (ball.velocity) {
            // Valeur mémorisée dans vx.
            const vx = ball.velocity.x || 0;
            // Instruction nécessaire au déroulement de cette partie.
            ballTowardGoal = isLeftGoal ? vx < -0.08 : vx > 0.08;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans closestOpponent.
        const closestOpponent = getClosestPlayerFromTeamToBall(opponentTeam, ball);
        // Valeur mémorisée dans closestMate.
        const closestMate = getClosestPlayerFromTeamToBall(myTeam, ball);

        // Valeur mémorisée dans oppDist.
        const oppDist = closestOpponent
            // Appel de Distance pour appliquer l'action prévue.
            ? BABYLON.Vector3.Distance(closestOpponent.position, ball.position)
            // Instruction nécessaire au déroulement de cette partie.
            : Infinity;

        // Valeur mémorisée dans mateDist.
        const mateDist = closestMate
            // Appel de Distance pour appliquer l'action prévue.
            ? BABYLON.Vector3.Distance(closestMate.position, ball.position)
            // Instruction nécessaire au déroulement de cette partie.
            : Infinity;

        // Valeur mémorisée dans opponentLikelyHasBall.
        const opponentLikelyHasBall =
            // Mise à jour de lastTouchTeam.
            ball.lastTouchTeam === opponentTeam ||
            // Instruction nécessaire au déroulement de cette partie.
            oppDist < 3.2 ||
            // Instruction nécessaire au déroulement de cette partie.
            oppDist + 0.8 < mateDist;

        // Valeur mémorisée dans shooterNearBall.
        const shooterNearBall =
            // Instruction nécessaire au déroulement de cette partie.
            closestOpponent &&
            // Instruction nécessaire au déroulement de cette partie.
            closestOpponent.position &&
            // Appel de Distance pour appliquer l'action prévue.
            BABYLON.Vector3.Distance(closestOpponent.position, ball.position) < 4.5;

        // Valeur mémorisée dans activeFarFromGK.
        const activeFarFromGK =
            // Instruction nécessaire au déroulement de cette partie.
            myTeam.activePlayer &&
            // Instruction nécessaire au déroulement de cette partie.
            myTeam.activePlayer !== gk &&
            // Appel de Distance pour appliquer l'action prévue.
            BABYLON.Vector3.Distance(myTeam.activePlayer.position, gk.position) > 14;

        // déclenchement fort = dans la surface
        // Vérification avant d'exécuter la suite.
        if (inMyBox && opponentLikelyHasBall && activeFarFromGK) {
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // déclenchement moyen = l'action avance vers le but + l'adversaire contrôle
        // Vérification avant d'exécuter la suite.
        if (inDangerZone && opponentLikelyHasBall && ballTowardGoal && activeFarFromGK) {
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // déclenchement anticipation tir
        // Vérification avant d'exécuter la suite.
        if (inDangerZone && shooterNearBall && opponentLikelyHasBall && activeFarFromGK) {
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return false;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleGoalEmergencySwitch : elle regroupe le traitement de cette partie.
    function handleGoalEmergencySwitch() {
        // Valeur mémorisée dans now.
        const now = performance.now();
        // Valeur mémorisée dans gk.
        const gk = getTeamGoalkeeper(myTeam);

        // Vérification avant d'exécuter la suite.
        if (isRestartWaitingKick()) return false;

        // Si on est déjà en mode urgence GK
        // Vérification avant d'exécuter la suite.
        if (gk && myTeam.activePlayer === gk) {
            // Vérification avant d'exécuter la suite.
            if (shouldKeepGoalkeeperEmergency()) {
                // Mise à jour de goalEmergencyModeUntil.
                myTeam.goalEmergencyModeUntil = now + 200;
                // Instruction nécessaire au déroulement de cette partie.
                goalEmergencyUntil = now + 200;
                // Résultat renvoyé par la fonction.
                return true;
            // Fermeture du bloc ou de l'appel.
            }

            // danger terminé -> on libère le mode urgence
            // Mise à jour de goalEmergencyModeUntil.
            myTeam.goalEmergencyModeUntil = 0;
            // Instruction nécessaire au déroulement de cette partie.
            goalEmergencyUntil = 0;
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (now < goalEmergencyUntil) return true;
        // Vérification avant d'exécuter la suite.
        if (now - lastGoalEmergencySwitch < 500) return false;

        // Vérification avant d'exécuter la suite.
        if (isDangerOnMyGoal()) {
            // Résultat renvoyé par la fonction.
            return switchInstantToGoalkeeper();
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return false;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction shouldKeepGoalkeeperEmergency : elle regroupe le traitement de cette partie.
    function shouldKeepGoalkeeperEmergency() {
        // Valeur mémorisée dans gk.
        const gk = getTeamGoalkeeper(myTeam);
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball?.position) return false;
        // Vérification avant d'exécuter la suite.
        if (myTeam.activePlayer !== gk) return false;

        // Valeur mémorisée dans myGoalX.
        const myGoalX = gk.homePosition ? gk.homePosition.x : gk.position.x;
        // Valeur mémorisée dans isLeftGoal.
        const isLeftGoal = myGoalX < 0;

        // Valeur mémorisée dans boxDepth.
        const boxDepth = 20;
        // Valeur mémorisée dans boxHalfWidth.
        const boxHalfWidth = 18;
        // Valeur mémorisée dans warningLine.
        const warningLine = 30;

        // Valeur mémorisée dans inMyBox.
        const inMyBox = isLeftGoal
            // Appel de abs pour appliquer l'action prévue.
            ? (ball.position.x <= myGoalX + boxDepth && Math.abs(ball.position.z) <= boxHalfWidth)
            // Appel de abs pour appliquer l'action prévue.
            : (ball.position.x >= myGoalX - boxDepth && Math.abs(ball.position.z) <= boxHalfWidth);

        // Valeur mémorisée dans inDangerZone.
        const inDangerZone = isLeftGoal
            // Instruction nécessaire au déroulement de cette partie.
            ? ball.position.x <= -warningLine
            // Instruction nécessaire au déroulement de cette partie.
            : ball.position.x >= warningLine;

        // Valeur mémorisée dans closestOpponent.
        const closestOpponent = getClosestPlayerFromTeamToBall(opponentTeam, ball);
        // Valeur mémorisée dans closestMate.
        const closestMate = getClosestPlayerFromTeamToBall(myTeam, ball);

        // Valeur mémorisée dans oppDist.
        const oppDist = closestOpponent
            // Appel de Distance pour appliquer l'action prévue.
            ? BABYLON.Vector3.Distance(closestOpponent.position, ball.position)
            // Instruction nécessaire au déroulement de cette partie.
            : Infinity;

        // Valeur mémorisée dans mateDist.
        const mateDist = closestMate
            // Appel de Distance pour appliquer l'action prévue.
            ? BABYLON.Vector3.Distance(closestMate.position, ball.position)
            // Instruction nécessaire au déroulement de cette partie.
            : Infinity;

        // Valeur mémorisée dans opponentStillThreatening.
        const opponentStillThreatening =
            // Mise à jour de lastTouchTeam.
            ball.lastTouchTeam === opponentTeam ||
            // Instruction nécessaire au déroulement de cette partie.
            oppDist < 3.2 ||
            // Instruction nécessaire au déroulement de cette partie.
            oppDist + 0.8 < mateDist;

        // Valeur mémorisée dans ballTowardGoal.
        let ballTowardGoal = false;
        // Vérification avant d'exécuter la suite.
        if (ball.velocity) {
            // Valeur mémorisée dans vx.
            const vx = ball.velocity.x || 0;
            // Instruction nécessaire au déroulement de cette partie.
            ballTowardGoal = isLeftGoal ? vx < -0.05 : vx > 0.05;
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return (inMyBox && opponentStillThreatening) || (inDangerZone && (opponentStillThreatening || ballTowardGoal));
    // Fermeture du bloc ou de l'appel.
    }

    
    // Appel de add pour appliquer l'action prévue.
    scene.onBeforeRenderObservable.add(()=>{
        // ── GESTION DU SKIP MANETTE AVEC PRIORITÉ HAUTE ──
        // Valeur mémorisée dans gpSkip.
        const gpSkip = getActiveGamepad();
        // Vérification avant d'exécuter la suite.
        if (gpSkip && gpSkip.buttons) {
            // Valeur mémorisée dans gamepadBinds.
            const gamepadBinds = window.inputBindings && typeof window.inputBindings.getGamepadBindings === "function"
                // Appel de getGamepadBindings pour appliquer l'action prévue.
                ? window.inputBindings.getGamepadBindings()
                // Instruction nécessaire au déroulement de cette partie.
                : { shoot: 0, options: 9 };
            // Valeur mémorisée dans shootPressed.
            const shootPressed = !!(gpSkip.buttons[gamepadBinds.shoot] && gpSkip.buttons[gamepadBinds.shoot].pressed);
            // Valeur mémorisée dans optionsPressed.
            const optionsPressed = !!(gpSkip.buttons[gamepadBinds.options] && gpSkip.buttons[gamepadBinds.options].pressed);
            // Valeur mémorisée dans canSkip.
            const canSkip = shootPressed || optionsPressed;

            // Valeur mémorisée dans replayActive.
            const replayActive = goalReplay && typeof goalReplay.isReplayActive === "function"
                // Appel de isReplayActive pour appliquer l'action prévue.
                ? goalReplay.isReplayActive()
                // Instruction nécessaire au déroulement de cette partie.
                : false;

            // Vérification avant d'exécuter la suite.
            if (preMatchIntroPlaying || replayActive) {
                // Vérification avant d'exécuter la suite.
                if (canSkip && !gamepadState.lastSkipPressed) {
                    // Vérification avant d'exécuter la suite.
                    if (replayActive && typeof goalReplay.skipReplay === "function") {
                        // Appel de skipReplay pour appliquer l'action prévue.
                        goalReplay.skipReplay();
                    // Deuxième possibilité à tester.
                    } else if (preMatchIntroPlaying && typeof window.skipPreMatchIntro === "function") {
                        // Appel de skipPreMatchIntro pour appliquer l'action prévue.
                        window.skipPreMatchIntro();
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }
                // Mise à jour de lastSkipPressed.
                gamepadState.lastSkipPressed = canSkip;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (preMatchIntroPlaying || gameplayPaused) {
            // On fige le gameplay à la mi-temps (10 secondes)
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans now.
        const now = performance.now();
        // Appel de captureFrame pour appliquer l'action prévue.
        goalReplay.captureFrame(now);

        // Vérification avant d'exécuter la suite.
        if (goalReplay.update(now)) {
            // Pendant l'intro replay et le replay lui-meme, on masque la jauge de tir.
            // Appel de hideKickGauge pour appliquer l'action prévue.
            hideKickGauge(kickGauge);
            // Vérification avant d'exécuter la suite.
            if (selectionIndicator) selectionIndicator.setEnabled(false);
            // Vérification avant d'exécuter la suite.
            if (player2SelectionIndicator) player2SelectionIndicator.setEnabled(false);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans emergencyGoalSwitchTriggered.
        let emergencyGoalSwitchTriggered = false;

        // Vérification avant d'exécuter la suite.
        if (!isRestartWaitingKick()) {
            // Appel de handleGoalEmergencySwitch pour appliquer l'action prévue.
            emergencyGoalSwitchTriggered = handleGoalEmergencySwitch();

            // Vérification avant d'exécuter la suite.
            if (!emergencyGoalSwitchTriggered) {
                // Appel de autoSwitch pour appliquer l'action prévue.
                myTeam.autoSwitch(ball, cameras);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Instruction nécessaire au déroulement de cette partie.
        activePlayer = myTeam.activePlayer;

        // Si l'auto-switch a changé de joueur actif, on recolle la flèche dessus
        // Vérification avant d'exécuter la suite.
        if (selectionIndicator && activePlayer && selectionIndicator.parent !== activePlayer) {
            // Mise à jour de parent.
            selectionIndicator.parent = activePlayer;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (player2SelectionIndicator) {
            // Valeur mémorisée dans p2Active.
            const p2Active = opponentTeam && opponentTeam.activePlayer ? opponentTeam.activePlayer : null;
            // Vérification avant d'exécuter la suite.
            if (p2Active && player2SelectionIndicator.parent !== p2Active) {
                // Mise à jour de parent.
                player2SelectionIndicator.parent = p2Active;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (isRestartWaitingKick() && restartState.position) {
            // Mise à jour de x.
            ball.position.x = restartState.position.x;
            // Mise à jour de y.
            ball.position.y = 0.75;
            // Mise à jour de z.
            ball.position.z = restartState.position.z;

            // Vérification avant d'exécuter la suite.
            if (ball.velocity) {
                // Appel de set pour appliquer l'action prévue.
                ball.velocity.set(0, 0, 0);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (isRestartWaitingKick()) {
            // Appel de enforceRestartClearance pour appliquer l'action prévue.
            enforceRestartClearance(ball, myTeam, opponentTeam);
            // Appel de applyRestartTeamSpacing pour appliquer l'action prévue.
            applyRestartTeamSpacing(myTeam, 7.0);
            // Appel de applyRestartTeamSpacing pour appliquer l'action prévue.
            applyRestartTeamSpacing(opponentTeam, 7.0);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de updateAIRestart pour appliquer l'action prévue.
        updateAIRestart(ball);

        // Vérification avant d'exécuter la suite.
        if (cameraRuntime && typeof cameraRuntime.update === "function") {
            // Appel de update pour appliquer l'action prévue.
            cameraRuntime.update(activePlayer, ball, playerMoveVelocity, gameplayPaused);
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de forEach pour appliquer l'action prévue.
            myTeam.players.forEach(player => {
                // Mise à jour de isInFpv.
                player.isInFpv = false;
            // Fermeture du bloc ou de l'appel.
            });

            // Vérification avant d'exécuter la suite.
            if (scene.activeCamera === cameras.fpvCamera) {
                // Mise à jour de isInFpv.
                activePlayer.isInFpv = true;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (selectionIndicator) {
                // Valeur mémorisée dans showIndicator.
                const showIndicator = scene.activeCamera !== cameras.fpvCamera;
                // Appel de setEnabled pour appliquer l'action prévue.
                selectionIndicator.setEnabled(showIndicator);

                // Valeur mémorisée dans staminaForIndicator.
                const staminaForIndicator = activePlayer.stamina ?? 1;
                // Valeur mémorisée dans minScale.
                const minScale = 0.25;
                // Valeur mémorisée dans maxScale.
                const maxScale = 1.0;
                // Valeur mémorisée dans s.
                const s = minScale + (maxScale - minScale) * staminaForIndicator;
                // Mise à jour de y.
                selectionIndicator.scaling.y = s;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Indicateur J2 (mode 1v1) : visible hors FPV + jauge d'endurance rouge
        // Vérification avant d'exécuter la suite.
        if (player2SelectionIndicator) {
            // Valeur mémorisée dans p2Active.
            const p2Active = opponentTeam && opponentTeam.activePlayer ? opponentTeam.activePlayer : null;
            // Valeur mémorisée dans showIndicator.
            const showIndicator = scene.activeCamera !== cameras.fpvCamera && !!p2Active;
            // Appel de setEnabled pour appliquer l'action prévue.
            player2SelectionIndicator.setEnabled(showIndicator);

            // Vérification avant d'exécuter la suite.
            if (p2Active) {
                // Valeur mémorisée dans staminaForIndicator.
                const staminaForIndicator = p2Active.stamina ?? 1;
                // Valeur mémorisée dans minScale.
                const minScale = 0.25;
                // Valeur mémorisée dans maxScale.
                const maxScale = 1.0;
                // Valeur mémorisée dans s.
                const s = minScale + (maxScale - minScale) * staminaForIndicator;
                // Mise à jour de y.
                player2SelectionIndicator.scaling.y = s;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de update pour appliquer l'action prévue.
        myTeam.update(ball);
        // Met aussi à jour l'équipe adverse en 1v1 :
        // pour PlayerTeam, cela anime les coéquipiers non contrôlés via la logique Team.update().
        // Vérification avant d'exécuter la suite.
        if (opponentTeam && typeof opponentTeam.update === "function") {
            // Appel de update pour appliquer l'action prévue.
            opponentTeam.update(ball);
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (opponentTeam && opponentTeam.aiImplemented) {
            // Appel de forEach pour appliquer l'action prévue.
            opponentTeam.players.forEach(bot => {
                // Vérification avant d'exécuter la suite.
                if (!bot) return;

                // Appel de tryAITackle pour appliquer l'action prévue.
                tackleController.tryAITackle(
                    // Paramètre de l'appel ou valeur de configuration.
                    bot,
                    // Paramètre de l'appel ou valeur de configuration.
                    ball,
                    // Paramètre de l'appel ou valeur de configuration.
                    myTeam,
                    // Instruction nécessaire au déroulement de cette partie.
                    opponentTeam
                // Fermeture du bloc ou de l'appel.
                );
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de updateAITackle pour appliquer l'action prévue.
        tackleController.updateAITackle();

        // Applique l'etat "au sol" des joueurs tacles (stun temporaire)
        // Appel de updateStunnedPlayers pour appliquer l'action prévue.
        tackleController.updateStunnedPlayers(myTeam);
        // Appel de updateStunnedPlayers pour appliquer l'action prévue.
        tackleController.updateStunnedPlayers(opponentTeam);

        // COLLISIONS ENTRE JOUEURS (évite qu'ils se traversent)
        // Valeur mémorisée dans PLAYER_RADIUS.
        const PLAYER_RADIUS = 1.2;
        // Appel de beginFrame pour appliquer l'action prévue.
        tackleController.beginFrame();

        // Vérification avant d'exécuter la suite.
        if (opponentTeam) {
            // Joueurs de myTeam vs joueurs de opponentTeam
            // Appel de forEach pour appliquer l'action prévue.
            myTeam.players.forEach(pA => {
                // Vérification avant d'exécuter la suite.
                if (!pA) return;
                // Appel de forEach pour appliquer l'action prévue.
                opponentTeam.players.forEach(pB => {
                    // Vérification avant d'exécuter la suite.
                    if (!pB) return;

                    // Vérification avant d'exécuter la suite.
                    if (tackleController.shouldIgnoreCollision(pA, pB)) {
                        // Appel de registerPotentialHit pour appliquer l'action prévue.
                        tackleController.registerPotentialHit(pA, pB);
                        // Résultat renvoyé par la fonction.
                        return;
                    // Fermeture du bloc ou de l'appel.
                    }

                    // Appel de resolvePlayerCollision pour appliquer l'action prévue.
                    resolvePlayerCollision(pA, pB, PLAYER_RADIUS, PLAYER_RADIUS);
                // Fermeture du bloc ou de l'appel.
                });
            // Fermeture du bloc ou de l'appel.
            });
            // Joueurs de la même équipe (myTeam)
            // Parcours de plusieurs valeurs.
            for (let i = 0; i < myTeam.players.length; i++) {
                // Parcours de plusieurs valeurs.
                for (let j = i + 1; j < myTeam.players.length; j++) {
                    // Vérification avant d'exécuter la suite.
                    if (tackleController.shouldIgnoreCollision(myTeam.players[i], myTeam.players[j])) {
                        // Passage à l'itération suivante.
                        continue;
                    // Fermeture du bloc ou de l'appel.
                    }
                    // Appel de resolvePlayerCollision pour appliquer l'action prévue.
                    resolvePlayerCollision(myTeam.players[i], myTeam.players[j], PLAYER_RADIUS, PLAYER_RADIUS);
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Parcours de plusieurs valeurs.
            for (let i = 0; i < opponentTeam.players.length; i++) {
                // Parcours de plusieurs valeurs.
                for (let j = i + 1; j < opponentTeam.players.length; j++) {
                    // Vérification avant d'exécuter la suite.
                    if (tackleController.shouldIgnoreCollision(opponentTeam.players[i], opponentTeam.players[j])) {
                        // Passage à l'itération suivante.
                        continue;
                    // Fermeture du bloc ou de l'appel.
                    }
                    // Appel de resolvePlayerCollision pour appliquer l'action prévue.
                    resolvePlayerCollision(opponentTeam.players[i], opponentTeam.players[j], PLAYER_RADIUS, PLAYER_RADIUS);
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de applyBallSteal pour appliquer l'action prévue.
        tackleController.applyBallSteal(ball);
        // Appel de maintainBallControl pour appliquer l'action prévue.
        tackleController.maintainBallControl(ball);
        
        // Valeur mémorisée dans dt.
        const dt = Math.min(scene.getEngine().getDeltaTime() / 1000, 0.1);

        // Valeur mémorisée dans moveX.
        let moveX = 0;
        // Valeur mémorisée dans moveZ.
        let moveZ = 0;

        // Valeur mémorisée dans gp.
        const gp = getActiveGamepad();
        // Vérification avant d'exécuter la suite.
        if (gp && gp.axes && gp.axes.length >= 2) {
            // Valeur mémorisée dans gamepadBinds.
            const gamepadBinds = window.inputBindings && typeof window.inputBindings.getGamepadBindings === "function"
                // Appel de getGamepadBindings pour appliquer l'action prévue.
                ? window.inputBindings.getGamepadBindings()
                // Instruction nécessaire au déroulement de cette partie.
                : { shoot: 0, sprint: 7, tackle: 2, switchLeft: 4, switchRight: 5, options: 9 };
            // En FPV, le deplacement doit toujours rester sur le stick gauche.
            // Le stick droit est reserve a l'orientation de la camera.
            // Valeur mémorisée dans stick.
            const stick = (scene.activeCamera === cameras.fpvCamera)
                // Instruction nécessaire au déroulement de cette partie.
                ? { x: gp.axes[0] || 0, y: gp.axes[1] || 0 }
                // Appel de getPrimaryStick pour appliquer l'action prévue.
                : getPrimaryStick(gp.axes);
            // Valeur mémorisée dans rawX.
            const rawX = stick.x || 0;
            // Valeur mémorisée dans rawY.
            const rawY = stick.y || 0;
            // Valeur mémorisée dans deadzone.
            const deadzone = 0.15;
            // Valeur mémorisée dans stickX.
            const stickX = Math.abs(rawX) > deadzone ? rawX : 0;
            // Valeur mémorisée dans stickY.
            const stickY = Math.abs(rawY) > deadzone ? rawY : 0;

            // Vérification avant d'exécuter la suite.
            if (scene.activeCamera === cameras.broadcastCamera) {
                // Mapping manette broadcast = flèches écran
                // Stick X : gauche/droite écran | Stick Y : haut/bas écran
                // Valeur mémorisée dans alpha.
                const alpha = cameras.broadcastCamera.alpha;

                // Création de screenRight.
                const screenRight = new BABYLON.Vector3(
                    // Appel de cos pour appliquer l'action prévue.
                    Math.cos(alpha + Math.PI / 2),
                    // Paramètre de l'appel ou valeur de configuration.
                    0,
                    // Appel de sin pour appliquer l'action prévue.
                    Math.sin(alpha + Math.PI / 2)
                // Fermeture du bloc ou de l'appel.
                );
                // Création de screenUp.
                const screenUp = new BABYLON.Vector3(
                    // Appel de cos pour appliquer l'action prévue.
                    -Math.cos(alpha),
                    // Paramètre de l'appel ou valeur de configuration.
                    0,
                    // Appel de sin pour appliquer l'action prévue.
                    -Math.sin(alpha)
                // Fermeture du bloc ou de l'appel.
                );

                // Valeur mémorisée dans h.
                let h = stickX;   // droite écran
                // Valeur mémorisée dans v.
                let v = -stickY;  // haut écran

                // Fallback D-pad si stick neutre
                // Vérification avant d'exécuter la suite.
                if (h === 0 && v === 0 && gp.buttons) {
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[15] && gp.buttons[15].pressed) h += 1; // droite
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[14] && gp.buttons[14].pressed) h -= 1; // gauche
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[12] && gp.buttons[12].pressed) v += 1; // haut
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[13] && gp.buttons[13].pressed) v -= 1; // bas
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans moveVector.
                const moveVector = screenRight.scale(h).add(screenUp.scale(v));
                // Vérification avant d'exécuter la suite.
                if (moveVector.lengthSquared() > 0) {
                    // Appel de normalize pour appliquer l'action prévue.
                    moveVector.normalize();
                    // Instruction nécessaire au déroulement de cette partie.
                    moveX = moveVector.x;
                    // Instruction nécessaire au déroulement de cette partie.
                    moveZ = moveVector.z;
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Instruction nécessaire au déroulement de cette partie.
                    moveX = 0;
                    // Instruction nécessaire au déroulement de cette partie.
                    moveZ = 0;
                // Fermeture du bloc ou de l'appel.
                }
            // Deuxième possibilité à tester.
            } else if (scene.activeCamera === cameras.fpvCamera && cameras.fpvCamera) {
                // Valeur mémorisée dans fpvForward.
                const fpvForward = cameras.fpvCamera.getForwardRay().direction.clone();
                // Mise à jour de y.
                fpvForward.y = 0;

                // Vérification avant d'exécuter la suite.
                if (fpvForward.lengthSquared() > 0.000001) {
                    // Appel de normalize pour appliquer l'action prévue.
                    fpvForward.normalize();
                // Fermeture du bloc ou de l'appel.
                }

                // Création de fpvRight.
                const fpvRight = new BABYLON.Vector3(fpvForward.z, 0, -fpvForward.x);
                // Vérification avant d'exécuter la suite.
                if (fpvRight.lengthSquared() > 0.000001) {
                    // Appel de normalize pour appliquer l'action prévue.
                    fpvRight.normalize();
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans h.
                const h = stickX;
                // Valeur mémorisée dans v.
                const v = -stickY;
                // Valeur mémorisée dans moveVector.
                const moveVector = fpvForward.scale(v).add(fpvRight.scale(h));

                // Vérification avant d'exécuter la suite.
                if (moveVector.lengthSquared() > 0.000001) {
                    // Appel de normalize pour appliquer l'action prévue.
                    moveVector.normalize();
                    // Instruction nécessaire au déroulement de cette partie.
                    moveX = moveVector.x;
                    // Instruction nécessaire au déroulement de cette partie.
                    moveZ = moveVector.z;
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Instruction nécessaire au déroulement de cette partie.
                    moveX = 0;
                    // Instruction nécessaire au déroulement de cette partie.
                    moveZ = 0;
                // Fermeture du bloc ou de l'appel.
                }
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Mapping standard hors broadcast
                // Stick Y -> avant/arriere (moveX), Stick X -> gauche/droite (moveZ)
                // Instruction nécessaire au déroulement de cette partie.
                moveX = -stickY;
                // Instruction nécessaire au déroulement de cette partie.
                moveZ = -stickX;

                // Vérification avant d'exécuter la suite.
                if (moveX === 0 && moveZ === 0 && gp.buttons) {
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[12] && gp.buttons[12].pressed) moveX += 1;
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[13] && gp.buttons[13].pressed) moveX -= 1;
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[14] && gp.buttons[14].pressed) moveZ += 1;
                    // Vérification avant d'exécuter la suite.
                    if (gp.buttons[15] && gp.buttons[15].pressed) moveZ -= 1;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans sprintBtn.
            const sprintBtn = gp.buttons && gp.buttons[gamepadBinds.sprint];
            // Mise à jour de sprint.
            input.sprint = !!(sprintBtn && sprintBtn.pressed);

            // Vérification avant d'exécuter la suite.
            if (isRestartWaitingKick()) {
                // Inversion locale: la direction de visee des remises suit le ressenti joueur.
                // Mise à jour de restartAimX.
                input.restartAimX = -moveX;
                // Mise à jour de restartAimZ.
                input.restartAimZ = -moveZ;
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Mise à jour de restartAimX.
                input.restartAimX = 0;
                // Mise à jour de restartAimZ.
                input.restartAimZ = 0;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans shootBtn.
            const shootBtn = gp.buttons && gp.buttons[gamepadBinds.shoot];
            // Valeur mémorisée dans shootPressed.
            const shootPressed = !!(shootBtn && shootBtn.pressed);

            // Vérification avant d'exécuter la suite.
            if (shootPressed && !gamepadState.lastShootPressed && !isCharging) {
                // Appel de now pour appliquer l'action prévue.
                chargeStart = Date.now();
                // Instruction nécessaire au déroulement de cette partie.
                isCharging = true;
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (!shootPressed && gamepadState.lastShootPressed && isCharging) {
                // Valeur mémorisée dans force.
                const force = computeKickPower(kickGauge);
                // Appel de hideKickGauge pour appliquer l'action prévue.
                hideKickGauge(kickGauge);

                // Vérification avant d'exécuter la suite.
                if (window.penaltyShootout && window.penaltyShootout.isActive()) {
                    // Appel de handlePlayerRelease pour appliquer l'action prévue.
                    window.penaltyShootout.handlePlayerRelease(force, lastDirection);
                    // Instruction nécessaire au déroulement de cette partie.
                    isCharging = false;
                // Deuxième possibilité à tester.
                } else if (isRestartWaitingKick()) {
                    // Appel de takeRestartKick pour appliquer l'action prévue.
                    takeRestartKick(ball, lastDirection, force);
                    // Instruction nécessaire au déroulement de cette partie.
                    isCharging = false;
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Appel de kick pour appliquer l'action prévue.
                    kick(scene, ball, activePlayer, lastDirection, force, myTeam);
                    // Instruction nécessaire au déroulement de cette partie.
                    isCharging = false;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Mise à jour de lastShootPressed.
            gamepadState.lastShootPressed = shootPressed;
            // Mise à jour de lastSkipPressed.
            gamepadState.lastSkipPressed = false;

            // Valeur mémorisée dans tackleBtn.
            const tackleBtn = gp.buttons && gp.buttons[gamepadBinds.tackle];
            // Valeur mémorisée dans tacklePressed.
            const tacklePressed = !!(tackleBtn && tackleBtn.pressed);
            // Vérification avant d'exécuter la suite.
            if (tacklePressed && !gamepadState.lastTacklePressed) {
                // Appel de handleKeyDown pour appliquer l'action prévue.
                tackleController.handleKeyDown({ key: "gamepad", repeat: false }, {
                    // Paramètre de l'appel ou valeur de configuration.
                    activePlayer,
                    // Paramètre de l'appel ou valeur de configuration.
                    playerFacing,
                    // Paramètre de l'appel ou valeur de configuration.
                    ball,
                    // Paramètre de l'appel ou valeur de configuration.
                    opponentTeam,
                    // Paramètre de l'appel ou valeur de configuration.
                    team: myTeam,
                    // Instruction nécessaire au déroulement de cette partie.
                    tackleKey: "gamepad"
                // Fermeture du bloc ou de l'appel.
                });
            // Fermeture du bloc ou de l'appel.
            }
            // Mise à jour de lastTacklePressed.
            gamepadState.lastTacklePressed = tacklePressed;

            // Valeur mémorisée dans l1Btn.
            const l1Btn = gp.buttons && gp.buttons[gamepadBinds.switchLeft];
            // Valeur mémorisée dans l1Pressed.
            const l1Pressed = !!(l1Btn && l1Btn.pressed);
            // Vérification avant d'exécuter la suite.
            if (l1Pressed && !gamepadState.lastL1Pressed) {
                // Vérification avant d'exécuter la suite.
                if (!isRestartWaitingKick()) {
                    // Valeur mémorisée dans p.
                    const p = myTeam.getPlayerOnSide("left");
                    // Appel de switchPlayerSmooth pour appliquer l'action prévue.
                    myTeam.switchPlayerSmooth(p, cameras, scene, 180);
                    // Instruction nécessaire au déroulement de cette partie.
                    activePlayer = myTeam.activePlayer;
                    // Vérification avant d'exécuter la suite.
                    if (selectionIndicator && activePlayer) {
                        // Mise à jour de parent.
                        selectionIndicator.parent = activePlayer;
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Mise à jour de lastL1Pressed.
            gamepadState.lastL1Pressed = l1Pressed;

            // Valeur mémorisée dans r1Btn.
            const r1Btn = gp.buttons && gp.buttons[gamepadBinds.switchRight];
            // Valeur mémorisée dans r1Pressed.
            const r1Pressed = !!(r1Btn && r1Btn.pressed);
            // Vérification avant d'exécuter la suite.
            if (r1Pressed && !gamepadState.lastR1Pressed) {
                // Vérification avant d'exécuter la suite.
                if (!isRestartWaitingKick()) {
                    // Valeur mémorisée dans p.
                    const p = myTeam.getPlayerOnSide("right");
                    // Appel de switchPlayerSmooth pour appliquer l'action prévue.
                    myTeam.switchPlayerSmooth(p, cameras, scene, 180);
                    // Instruction nécessaire au déroulement de cette partie.
                    activePlayer = myTeam.activePlayer;
                    // Vérification avant d'exécuter la suite.
                    if (selectionIndicator && activePlayer) {
                        // Mise à jour de parent.
                        selectionIndicator.parent = activePlayer;
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Mise à jour de lastR1Pressed.
            gamepadState.lastR1Pressed = r1Pressed;

            // Valeur mémorisée dans optionsBtn.
            const optionsBtn = gp.buttons && gp.buttons[gamepadBinds.options];
            // Valeur mémorisée dans optionsPressed.
            const optionsPressed = !!(optionsBtn && optionsBtn.pressed);
            // Vérification avant d'exécuter la suite.
            if (optionsPressed && !gamepadState.lastOptionsPressed) {
                // Vérification avant d'exécuter la suite.
                if (window.settingsMenu && typeof window.settingsMenu.open === "function") {
                    // Appel de open pour appliquer l'action prévue.
                    window.settingsMenu.open();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
            // Mise à jour de lastOptionsPressed.
            gamepadState.lastOptionsPressed = optionsPressed;

            // Gestion caméra POV avec stick droit de la manette
            // Vérification avant d'exécuter la suite.
            if (scene.activeCamera === cameras.fpvCamera && gp.axes && gp.axes.length >= 4) {
                // Valeur mémorisée dans rightStickX.
                const rightStickX = gp.axes[2] || 0;
                // Valeur mémorisée dans rightStickY.
                const rightStickY = gp.axes[3] || 0;
                // Valeur mémorisée dans stickDeadzone.
                const stickDeadzone = 0.15;
                // Tourner la tête avec le stick droit
                // Vérification avant d'exécuter la suite.
                if (Math.abs(rightStickX) > stickDeadzone || Math.abs(rightStickY) > stickDeadzone) {
                    // Valeur mémorisée dans fpv.
                    const fpv = cameras.fpvCamera;
                    // Valeur mémorisée dans rotSpeed.
                    const rotSpeed = 0.04;  // Sensibilité de rotation
                    // Valeur mémorisée dans x.
                    const x = Math.abs(rightStickX) > stickDeadzone ? rightStickX : 0;
                    // Valeur mémorisée dans y.
                    const y = Math.abs(rightStickY) > stickDeadzone ? rightStickY : 0;
                    // Rotation horizontale (yaw)
                    // Instruction nécessaire au déroulement de cette partie.
                    fpv.rotation.y += x * rotSpeed;
                    // Rotation verticale (pitch)
                    // Instruction nécessaire au déroulement de cette partie.
                    fpv.rotation.x -= y * rotSpeed;
                    // Mise à jour de x.
                    fpv.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, fpv.rotation.x));
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // (Suppression) En FPV, la rotation de la caméra se fait uniquement à la souris, pas au clavier.
        // Deuxième possibilité à tester.
        } else if (cameraRuntime && typeof cameraRuntime.computeMoveAxes === "function") {
            // Valeur mémorisée dans move.
            const move = cameraRuntime.computeMoveAxes(input);
            // Instruction nécessaire au déroulement de cette partie.
            moveX = move.moveX;
            // Instruction nécessaire au déroulement de cette partie.
            moveZ = move.moveZ;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans movementState.
        const movementState = updatePlayerMovement(activePlayer, input, moveX, moveZ, dt, {
            // Paramètre de l'appel ou valeur de configuration.
            baseSpeed,
            // Paramètre de l'appel ou valeur de configuration.
            sprintMultiplier: SPRINT_MULTIPLIER,
            // Paramètre de l'appel ou valeur de configuration.
            staminaDrainRate: STAMINA_DRAIN_RATE,
            // Paramètre de l'appel ou valeur de configuration.
            staminaRegenRate: STAMINA_REGEN_RATE,
            // Paramètre de l'appel ou valeur de configuration.
            tackleController,
            // Paramètre de l'appel ou valeur de configuration.
            restartState,
            // Paramètre de l'appel ou valeur de configuration.
            isRestartTaker,
            // Paramètre de l'appel ou valeur de configuration.
            sanitizeRestartDirection,
            // Paramètre de l'appel ou valeur de configuration.
            getDefaultRestartDirection,
            // Paramètre de l'appel ou valeur de configuration.
            lastDirection,
            // Paramètre de l'appel ou valeur de configuration.
            playerFacing,
            // Instruction nécessaire au déroulement de cette partie.
            previousPlayerPosition
        // Fermeture du bloc ou de l'appel.
        });

        // Valeur mémorisée dans movement.
        const movement = movementState.movement;
        // Valeur mémorisée dans restartTakerLocked.
        const restartTakerLocked = movementState.restartTakerLocked;
        // Instruction nécessaire au déroulement de cette partie.
        lastDirection = movementState.lastDirection;
        // Instruction nécessaire au déroulement de cette partie.
        playerFacing = movementState.playerFacing;
        // Instruction nécessaire au déroulement de cette partie.
        playerMoveVelocity = movementState.playerMoveVelocity;
        // Instruction nécessaire au déroulement de cette partie.
        previousPlayerPosition = movementState.previousPlayerPosition;

        // Valeur mémorisée dans controlledPlayer.
        const controlledPlayer = movement.controlledPlayer;

        // COLLISION JOUEUR HUMAIN (J1) → BALLE
        // Appel de checkBallCollision pour appliquer l'action prévue.
        checkBallCollision(controlledPlayer, ball, playerFacing, myTeam, playerMoveVelocity, input.sprint);
        // Appel de tryStealBall pour appliquer l'action prévue.
        tryStealBall(controlledPlayer, ball, myTeam);

        // COLLISION JOUEUR HUMAIN (J2 en mode 1v1) → BALLE
        // Instruction nécessaire au déroulement de cette partie.
        player2ChargeState = null;
        // Vérification avant d'exécuter la suite.
        if (player2Controller) {
            // Valeur mémorisée dans p2State.
            const p2State = player2Controller.update({
                // Paramètre de l'appel ou valeur de configuration.
                dt,
                // Paramètre de l'appel ou valeur de configuration.
                baseSpeed,
                // Paramètre de l'appel ou valeur de configuration.
                sprintMultiplier: SPRINT_MULTIPLIER,
                // Paramètre de l'appel ou valeur de configuration.
                staminaDrainRate: STAMINA_DRAIN_RATE,
                // Paramètre de l'appel ou valeur de configuration.
                staminaRegenRate: STAMINA_REGEN_RATE,
                // Instruction nécessaire au déroulement de cette partie.
                computeMoveAxes: cameraRuntime && typeof cameraRuntime.computeMoveAxes === "function"
                    // Appel de computeMoveAxes pour appliquer l'action prévue.
                    ? (inputP2) => cameraRuntime.computeMoveAxes(inputP2)
                    // Instruction nécessaire au déroulement de cette partie.
                    : null
            // Fermeture du bloc ou de l'appel.
            });

            // Vérification avant d'exécuter la suite.
            if (typeof player2Controller.getChargeState === "function") {
                // Appel de getChargeState pour appliquer l'action prévue.
                player2ChargeState = player2Controller.getChargeState();
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (p2State && p2State.controlledPlayer) {
                // Appel de checkBallCollision pour appliquer l'action prévue.
                checkBallCollision(
                    // Paramètre de l'appel ou valeur de configuration.
                    p2State.controlledPlayer,
                    // Paramètre de l'appel ou valeur de configuration.
                    ball,
                    // Paramètre de l'appel ou valeur de configuration.
                    p2State.playerFacing,
                    // Paramètre de l'appel ou valeur de configuration.
                    opponentTeam,
                    // Paramètre de l'appel ou valeur de configuration.
                    p2State.playerMoveVelocity,
                    // Instruction nécessaire au déroulement de cette partie.
                    p2State.isSprinting
                // Fermeture du bloc ou de l'appel.
                );
                // Appel de tryStealBall pour appliquer l'action prévue.
                tryStealBall(p2State.controlledPlayer, ball, opponentTeam);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
        
        // Si la balle sort du terrain, on lance l'animation de chute
        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            ball &&
            // Instruction nécessaire au déroulement de cette partie.
            ball.position &&
            // Instruction nécessaire au déroulement de cette partie.
            !ball.isOutAnimationPlaying &&
            // Instruction nécessaire au déroulement de cette partie.
            !ball.isOutOfPlay &&
            // Appel de isBallOutOfBounds pour appliquer l'action prévue.
            isBallOutOfBounds(ball)
        // Ouverture du bloc correspondant.
        ) {
            // Mise à jour de outExitPosition.
            ball.outExitPosition = ball.position.clone();
            // Mise à jour de outDecision.
            ball.outDecision = getRestartDecision(ball, myTeam, opponentTeam);

            // Appel de startBallOutAnimation pour appliquer l'action prévue.
            startBallOutAnimation(ball);
        // Fermeture du bloc ou de l'appel.
        }

        // COLLISION JOUEURS IA → BALLE (uniquement si le comportement IA est implémenté)
        // Vérification avant d'exécuter la suite.
        if (opponentTeam && opponentTeam.aiImplemented && !isRestartWaitingKick()) {
        // Fonction aiGK stockée pour être rappelée plus tard.
        const aiGK = opponentTeam.players.find(p => p && p.role === "GK");

        // Valeur mémorisée dans reserveBallForGK.
        const reserveBallForGK =
            // Instruction nécessaire au déroulement de cette partie.
            !!aiGK &&
            // Instruction nécessaire au déroulement de cette partie.
            opponentTeam.goalkeeperClaiming &&
            // Instruction nécessaire au déroulement de cette partie.
            opponentTeam.isInOwnBox &&
            // Appel de isInOwnBox pour appliquer l'action prévue.
            opponentTeam.isInOwnBox(ball.position) &&
            // Appel de Distance pour appliquer l'action prévue.
            BABYLON.Vector3.Distance(aiGK.position, ball.position) < 10;

            // Appel de forEach pour appliquer l'action prévue.
            opponentTeam.players.forEach(bot => {
                // Vérification avant d'exécuter la suite.
                if (!bot) return;

                // IMPORTANT :
                // si la balle est réservée au GK dans sa surface,
                // les autres joueurs n'ont plus le droit d'interagir avec elle
                // Vérification avant d'exécuter la suite.
                if (reserveBallForGK && bot.role !== "GK") {
                    // Résultat renvoyé par la fonction.
                    return;
                // Fermeture du bloc ou de l'appel.
                }

                // Appel de tryStealBall pour appliquer l'action prévue.
                tryStealBall(bot, ball, opponentTeam);

                // Valeur mémorisée dans toBall.
                const toBall = ball.position.subtract(bot.position);
                // Vérification avant d'exécuter la suite.
                if (toBall.lengthSquared() === 0) return;
                // Mise à jour de y.
                toBall.y = 0;

                // Valeur mémorisée dans dir.
                let dir = null;

                // Vérification avant d'exécuter la suite.
                if (bot.facingDirection && bot.facingDirection.lengthSquared() > 0.0001) {
                    // Appel de clone pour appliquer l'action prévue.
                    dir = bot.facingDirection.clone();
                    // Mise à jour de y.
                    dir.y = 0;
                    // Appel de normalize pour appliquer l'action prévue.
                    dir.normalize();
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Valeur mémorisée dans fallback.
                    const fallback = ball.position.subtract(bot.position);
                    // Mise à jour de y.
                    fallback.y = 0;

                    // Vérification avant d'exécuter la suite.
                    if (fallback.lengthSquared() > 0.0001) {
                        // Appel de normalize pour appliquer l'action prévue.
                        fallback.normalize();
                        // Instruction nécessaire au déroulement de cette partie.
                        dir = fallback;
                    // Cas utilisé quand les tests précédents échouent.
                    } else {
                        // Appel de Vector3 pour appliquer l'action prévue.
                        dir = new BABYLON.Vector3(-1, 0, 0);
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans botIsSprinting.
                const botIsSprinting = false;
                // Appel de checkBallCollision pour appliquer l'action prévue.
                checkBallCollision(bot, ball, dir, opponentTeam, null, botIsSprinting);
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }

        // UPDATE JAUGE
        // Valeur mémorisée dans humanCharging.
        const humanCharging = isCharging;
        // Valeur mémorisée dans player2Charging.
        const player2Charging = !!(
            // Instruction nécessaire au déroulement de cette partie.
            isVersusMode &&
            // Instruction nécessaire au déroulement de cette partie.
            player2ChargeState &&
            // Instruction nécessaire au déroulement de cette partie.
            player2ChargeState.isCharging &&
            // Instruction nécessaire au déroulement de cette partie.
            player2ChargeState.activePlayer
        // Fermeture du bloc ou de l'appel.
        );
        // Valeur mémorisée dans aiRestartCharging.
        const aiRestartCharging = isRestartWaitingKick() && restartState.aiCharging && restartState.taker;
        // Valeur mémorisée dans aiCharging.
        const aiCharging = opponentTeam && opponentTeam.aiShotCharging;

        // Vérification avant d'exécuter la suite.
        if (humanCharging) {
            // Valeur mémorisée dans time.
            const time = performance.now() / 1000;

            // Appel de updateKickGauge pour appliquer l'action prévue.
            updateKickGauge(
                // Paramètre de l'appel ou valeur de configuration.
                kickGauge,
                // Paramètre de l'appel ou valeur de configuration.
                controlledPlayer,
                // Paramètre de l'appel ou valeur de configuration.
                lastDirection,
                // Instruction nécessaire au déroulement de cette partie.
                time
            // Fermeture du bloc ou de l'appel.
            );
        // Deuxième possibilité à tester.
        } else if (player2Charging) {
            // Valeur mémorisée dans time.
            const time = performance.now() / 1000;
            // Création de p2Direction.
            const p2Direction = player2ChargeState.lastDirection || player2ChargeState.playerFacing || new BABYLON.Vector3(-1, 0, 0);

            // Appel de updateKickGauge pour appliquer l'action prévue.
            updateKickGauge(
                // Paramètre de l'appel ou valeur de configuration.
                kickGauge,
                // Paramètre de l'appel ou valeur de configuration.
                player2ChargeState.activePlayer,
                // Paramètre de l'appel ou valeur de configuration.
                p2Direction,
                // Instruction nécessaire au déroulement de cette partie.
                time
            // Fermeture du bloc ou de l'appel.
            );
        // Deuxième possibilité à tester.
        } else if (aiRestartCharging) {
            // Valeur mémorisée dans time.
            const time = performance.now() / 1000;

            // Appel de updateKickGauge pour appliquer l'action prévue.
            updateKickGauge(
                // Paramètre de l'appel ou valeur de configuration.
                kickGauge,
                // Paramètre de l'appel ou valeur de configuration.
                restartState.taker,
                // Appel de getDefaultRestartDirection pour appliquer l'action prévue.
                restartState.aiAimDirection || getDefaultRestartDirection(restartState),
                // Instruction nécessaire au déroulement de cette partie.
                time
            // Fermeture du bloc ou de l'appel.
            );
        // Deuxième possibilité à tester.
        } else if (aiCharging && opponentTeam.aiShotCarrier && opponentTeam.aiShotDirection) {
            // Valeur mémorisée dans time.
            const time = performance.now() / 1000;

            // Appel de updateKickGauge pour appliquer l'action prévue.
            updateKickGauge(
                // Paramètre de l'appel ou valeur de configuration.
                kickGauge,
                // Paramètre de l'appel ou valeur de configuration.
                opponentTeam.aiShotCarrier,
                // Paramètre de l'appel ou valeur de configuration.
                opponentTeam.aiShotDirection,
                // Instruction nécessaire au déroulement de cette partie.
                time
            // Fermeture du bloc ou de l'appel.
            );
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de hideKickGauge pour appliquer l'action prévue.
            hideKickGauge(kickGauge);
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (ball.isOutAnimationPlaying) {
            // Appel de updateBallOutAnimation pour appliquer l'action prévue.
            updateBallOutAnimation(ball, dt);
        // Deuxième possibilité à tester.
        } else if (!ball.isOutOfPlay) {
            // Valeur mémorisée dans allPlayers.
            const allPlayers = [...myTeam.players];
            // Vérification avant d'exécuter la suite.
            if (opponentTeam) allPlayers.push(...opponentTeam.players);
            // Appel de updateBallPhysics pour appliquer l'action prévue.
            updateBallPhysics(ball, goalPosts, allPlayers, dt);
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (ball.outAnimationFinished && ball.outDecision) {
            // Appel de startRestart pour appliquer l'action prévue.
            startRestart(ball, ball.outDecision, myTeam, opponentTeam, cameras);
            // Mise à jour de outAnimationFinished.
            ball.outAnimationFinished = false;
            // Mise à jour de outDecision.
            ball.outDecision = null;
        // Fermeture du bloc ou de l'appel.
        }

        

        // Appel de checkGoalScored pour appliquer l'action prévue.
        checkGoalScored(ball, leftGoal, rightGoal, goalReplay);

    // Fermeture du bloc ou de l'appel.
    });



    // Appel de launchPreMatchIntro pour appliquer l'action prévue.
    launchPreMatchIntro({
        // Paramètre de l'appel ou valeur de configuration.
        scene,
        // Paramètre de l'appel ou valeur de configuration.
        cameras,
        // Paramètre de l'appel ou valeur de configuration.
        mode,
        // Paramètre de l'appel ou valeur de configuration.
        tournamentStage,
        // Paramètre de l'appel ou valeur de configuration.
        cameraRuntime,
        // Paramètre de l'appel ou valeur de configuration.
        getActivePlayer: () => activePlayer,
        // Instruction nécessaire au déroulement de cette partie.
        setIntroPlaying: (value) => { preMatchIntroPlaying = value; }
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de add pour appliquer l'action prévue.
    scene.onBeforeRenderObservable.add(() => {
        // Vérification avant d'exécuter la suite.
        if (!goalReplay.isPlaying()) {
            // Le chrono est gelé pendant le replay du but.
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans deltaSeconds.
        const deltaSeconds = Math.min(scene.getEngine().getDeltaTime() / 1000, 0.1);
        // Appel de updateTimer pour appliquer l'action prévue.
        window.gameScoreboard.updateTimer(deltaSeconds);

        // Gère la mi-temps + fin de match (dans js/ui/matchFlow.js)
        // Vérification avant d'exécuter la suite.
        if (matchFlow) matchFlow.update();
    // Fermeture du bloc ou de l'appel.
    });

    // Appel de add pour appliquer l'action prévue.
    scene.onDisposeObservable.add(() => {
        // Vérification avant d'exécuter la suite.
        if (inputController && typeof inputController.dispose === "function") {
            // Appel de dispose pour appliquer l'action prévue.
            inputController.dispose();
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });

    // Résultat renvoyé par la fonction.
    return scene;
// Fermeture du bloc ou de l'appel.
};

// Valeur mémorisée dans gameStarted.
let gameStarted = false;
// Valeur mémorisée dans activeScene.
let activeScene = null;
// Valeur mémorisée dans activeMatchFlow.
let activeMatchFlow = null;
// Valeur mémorisée dans renderLoopId.
let renderLoopId = null;

// Fonction startGame : elle regroupe le traitement de cette partie.
function startGame(mode) {
    // Nettoyage préalable si un jeu est déjà en cours
    // Vérification avant d'exécuter la suite.
    if (gameStarted) {
        // Appel de quitGame pour appliquer l'action prévue.
        quitGame();
    // Fermeture du bloc ou de l'appel.
    }

    // Récupération de l'élément HTML mainMenu.
    const mainMenu = document.getElementById("main-menu");
    // Vérification avant d'exécuter la suite.
    if (mainMenu) {
        // Appel de add pour appliquer l'action prévue.
        mainMenu.classList.add("is-hidden");
        // Appel de setAttribute pour appliquer l'action prévue.
        mainMenu.setAttribute("aria-hidden", "true");
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de setGameCanvasVisible pour appliquer l'action prévue.
    setGameCanvasVisible(true);

    // Récupération de l'élément HTML matchHud.
    const matchHud = document.getElementById("match-hud");
    // Vérification avant d'exécuter la suite.
    if (matchHud) matchHud.style.display = "flex";

    // Instruction nécessaire au déroulement de cette partie.
    gameStarted = true;
    // Appel de createScene pour appliquer l'action prévue.
    activeScene = createScene(mode);

    // Réinitialiser le scoreboard APRÈS createScene() pour avoir le canvas 3D
    // Vérification avant d'exécuter la suite.
    if (window.gameScoreboard && typeof window.gameScoreboard.reset === "function") {
        // Appel de reset pour appliquer l'action prévue.
        window.gameScoreboard.reset();
    // Fermeture du bloc ou de l'appel.
    }

    // Arrêter l'ancienne boucle si elle existe
    // Vérification avant d'exécuter la suite.
    if (renderLoopId !== null) {
        // Appel de stopRenderLoop pour appliquer l'action prévue.
        engine.stopRenderLoop();
    // Fermeture du bloc ou de l'appel.
    }

    // Démarrer une nouvelle boucle de rendu
    // Appel de runRenderLoop pour appliquer l'action prévue.
    engine.runRenderLoop(function () {
        // Vérification avant d'exécuter la suite.
        if (activeScene) activeScene.render();
    // Fermeture du bloc ou de l'appel.
    });
// Fermeture du bloc ou de l'appel.
}

// Fonction quitGame : elle regroupe le traitement de cette partie.
function quitGame() {
    // Arrêter la boucle de rendu
    // Appel de stopRenderLoop pour appliquer l'action prévue.
    engine.stopRenderLoop();
    // Instruction nécessaire au déroulement de cette partie.
    renderLoopId = null;

    // Disposer de la scène Babylon
    // Vérification avant d'exécuter la suite.
    if (activeScene) {
        // Appel de dispose pour appliquer l'action prévue.
        activeScene.dispose();
        // Instruction nécessaire au déroulement de cette partie.
        activeScene = null;
    // Fermeture du bloc ou de l'appel.
    }

    // Instruction nécessaire au déroulement de cette partie.
    gameStarted = false;

    // Nettoyage complet du matchFlow
    // Vérification avant d'exécuter la suite.
    if (activeMatchFlow) {
        // Vérification avant d'exécuter la suite.
        if (typeof activeMatchFlow.cleanup === "function") {
            // Appel de cleanup pour appliquer l'action prévue.
            activeMatchFlow.cleanup();
        // Fermeture du bloc ou de l'appel.
        }
        // Instruction nécessaire au déroulement de cette partie.
        activeMatchFlow = null;
    // Fermeture du bloc ou de l'appel.
    }
    // Mise à jour de selectedVersusStage.
    window.selectedVersusStage = TOURNAMENT_STAGES[0];

    // Arrêter tous les sons en cours
    // Vérification avant d'exécuter la suite.
    if (window.matchAudio && typeof window.matchAudio.stopAll === "function") {
        // Appel de stopAll pour appliquer l'action prévue.
        window.matchAudio.stopAll();
    // Fermeture du bloc ou de l'appel.
    }

    // Reset TOUS les globals de session de jeu
    // Mise à jour de goalReplayController.
    window.goalReplayController = null;
    // Mise à jour de penaltyShootout.
    window.penaltyShootout = null;
    // Mise à jour de gameCameras.
    window.gameCameras = null;
    // Mise à jour de gameScene.
    window.gameScene = null;
    // Mise à jour de cameraRuntime.
    window.cameraRuntime = null;
    // Mise à jour de setGameplayPaused.
    window.setGameplayPaused = null;
    // Mise à jour de getActivePlayer.
    window.getActivePlayer = null;
    // Mise à jour de isIntroPlaying.
    window.isIntroPlaying = null;
    // Mise à jour de isVersusMode.
    window.isVersusMode = null;
    // Mise à jour de isMatchEnded.
    window.isMatchEnded = null;
    // Mise à jour de scoreBoard3D.
    window.scoreBoard3D = null;

    // Masquer le canvas
    // Appel de setGameCanvasVisible pour appliquer l'action prévue.
    setGameCanvasVisible(false);

    // Masquer TOUS les overlays de jeu (utiliser style.display)
    // Valeur mémorisée dans elementIds.
    const elementIds = [
        // Paramètre de l'appel ou valeur de configuration.
        "match-hud",
        // Paramètre de l'appel ou valeur de configuration.
        "halftime-overlay",
        // Paramètre de l'appel ou valeur de configuration.
        "match-end-overlay",
        // Paramètre de l'appel ou valeur de configuration.
        "penalty-overlay",
        // Paramètre de l'appel ou valeur de configuration.
        "penalty-result-overlay",
        // Paramètre de l'appel ou valeur de configuration.
        "pre-match-tournament-overlay",
        // Instruction nécessaire au déroulement de cette partie.
        "replay-skip-btn"
    // Fermeture du bloc ou de l'appel.
    ];

    // Appel de forEach pour appliquer l'action prévue.
    elementIds.forEach(id => {
        // Récupération de l'élément HTML el.
        const el = document.getElementById(id);
        // Vérification avant d'exécuter la suite.
        if (el) el.style.display = "none";
    // Fermeture du bloc ou de l'appel.
    });

    // Masquer settings overlay
    // Récupération de l'élément HTML settingsOverlay.
    const settingsOverlay = document.getElementById("settings-overlay");
    // Vérification avant d'exécuter la suite.
    if (settingsOverlay) {
        // Appel de setAttribute pour appliquer l'action prévue.
        settingsOverlay.setAttribute("aria-hidden", "true");
    // Fermeture du bloc ou de l'appel.
    }

    // Afficher le menu principal
    // Récupération de l'élément HTML mainMenu.
    const mainMenu = document.getElementById("main-menu");
    // Vérification avant d'exécuter la suite.
    if (mainMenu) {
        // Appel de remove pour appliquer l'action prévue.
        mainMenu.classList.remove("is-hidden");
        // Appel de setAttribute pour appliquer l'action prévue.
        mainMenu.setAttribute("aria-hidden", "false");
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Mise à jour de startTournamentMatch.
window.startTournamentMatch = function () {
    // Instruction nécessaire au déroulement de cette partie.
    currentTournamentStage = TOURNAMENT_STAGES[0]; 
    // Appel de startGame pour appliquer l'action prévue.
    startGame("tournament");
// Fermeture du bloc ou de l'appel.
};

// Mise à jour de startVersusMatch.
window.startVersusMatch = function (selectedStage) {
    // Valeur mémorisée dans stage.
    const stage = TOURNAMENT_STAGES.includes(selectedStage)
        // Instruction nécessaire au déroulement de cette partie.
        ? selectedStage
        // Appel de includes pour appliquer l'action prévue.
        : (TOURNAMENT_STAGES.includes(window.selectedVersusStage) ? window.selectedVersusStage : TOURNAMENT_STAGES[0]);
    // Instruction nécessaire au déroulement de cette partie.
    currentTournamentStage = stage;
    // Mise à jour de selectedVersusStage.
    window.selectedVersusStage = stage;
    // Appel de startGame pour appliquer l'action prévue.
    startGame("versus");
// Fermeture du bloc ou de l'appel.
};

// Mise à jour de quitGame.
window.quitGame = quitGame;

// Appel de addEventListener pour appliquer l'action prévue.
window.addEventListener("resize", function () {
    // Appel de resize pour appliquer l'action prévue.
    engine.resize();
// Fermeture du bloc ou de l'appel.
});

    