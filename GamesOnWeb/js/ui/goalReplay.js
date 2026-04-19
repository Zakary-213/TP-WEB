// js/ui/goalReplay.js
// Contrôleur de replay de but: capture les dernières frames puis les rejoue.
// Appel de function pour appliquer l'action prévue.
(function () {
    // Fonction createGoalReplayController : elle regroupe le traitement de cette partie.
    function createGoalReplayController(config) {
        // Ouverture du bloc correspondant.
        const {
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
            maxReplayTimeMs = 5000,
            // Paramètre de l'appel ou valeur de configuration.
            replayFrameStepMs = 1000 / 60,
            // Instruction nécessaire au déroulement de cette partie.
            onReplayEnd
        // Instruction nécessaire au déroulement de cette partie.
        } = config || {};

        // Valeur mémorisée dans gameState.
        let gameState = "playing"; // playing | replayBanner | replay
        // Valeur mémorisée dans pendingGoalReset.
        let pendingGoalReset = null;

        // Valeur mémorisée dans replayBuffer.
        const replayBuffer = [];
        // Valeur mémorisée dans replayFrames.
        let replayFrames = [];
        // Valeur mémorisée dans replayFrameIndex.
        let replayFrameIndex = 0;
        // Valeur mémorisée dans replayPlaybackCursor.
        let replayPlaybackCursor = 0;
        // Valeur mémorisée dans replayLastStepTime.
        let replayLastStepTime = 0;
        // Valeur mémorisée dans replayPaused.
        let replayPaused = false;
        // Valeur mémorisée dans replaySpeed.
        let replaySpeed = 1; // 1 forward, -1 rewind

        // Valeur mémorisée dans replayCameras.
        const replayCameras = {
            // Paramètre de l'appel ou valeur de configuration.
            tv: null,
            // Paramètre de l'appel ou valeur de configuration.
            ball: null,
            // Paramètre de l'appel ou valeur de configuration.
            player: null,
            // Paramètre de l'appel ou valeur de configuration.
            cinematic: null,
            // Instruction nécessaire au déroulement de cette partie.
            blend: null
        // Fermeture du bloc ou de l'appel.
        };

        // Valeur mémorisée dans cameraModes.
        const cameraModes = ["tv", "ball", "player", "cinematic"];
        // Valeur mémorisée dans currentCameraIndex.
        let currentCameraIndex = 0;
        // Valeur mémorisée dans previousActiveCamera.
        let previousActiveCamera = null;
        // Valeur mémorisée dans skipButton.
        let skipButton = null;

        // Fonction ensureSkipButton : elle regroupe le traitement de cette partie.
        function ensureSkipButton() {
            // Vérification avant d'exécuter la suite.
            if (skipButton) return;

            // Appel de getElementById pour appliquer l'action prévue.
            skipButton = document.getElementById("replay-skip-btn");
            // Vérification avant d'exécuter la suite.
            if (!skipButton) {
                // Appel de createElement pour appliquer l'action prévue.
                skipButton = document.createElement("button");
                // Mise à jour de id.
                skipButton.id = "replay-skip-btn";
                // Mise à jour de type.
                skipButton.type = "button";
                // Mise à jour de textContent.
                skipButton.textContent = "Passer le replay";
                // Appel de appendChild pour appliquer l'action prévue.
                document.body.appendChild(skipButton);
            // Fermeture du bloc ou de l'appel.
            }

            // Peut avoir ete masque via style.display="none" apres un quit.
            // Mise à jour de display.
            skipButton.style.display = "";

            // Mise à jour de onclick.
            skipButton.onclick = () => {
                // Vérification avant d'exécuter la suite.
                if (gameState === "replay" || gameState === "replayBanner") {
                    // Appel de finalizeGoal pour appliquer l'action prévue.
                    finalizeGoal();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            };
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction setSkipButtonVisible : elle regroupe le traitement de cette partie.
        function setSkipButtonVisible(visible) {
            // Vérification avant d'exécuter la suite.
            if (!skipButton) return;
            // Appel de toggle pour appliquer l'action prévue.
            skipButton.classList.toggle("replay-skip-btn--show", !!visible);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction createReplayCameras : elle regroupe le traitement de cette partie.
        function createReplayCameras() {
            // Vérification avant d'exécuter la suite.
            if (!scene || replayCameras.blend) return;

            // Mise à jour de tv.
            replayCameras.tv = new BABYLON.FreeCamera("replayTvCam", new BABYLON.Vector3(0, 30, -60), scene);
            // Mise à jour de ball.
            replayCameras.ball = new BABYLON.FreeCamera("replayBallCam", new BABYLON.Vector3(0, 10, -10), scene);
            // Mise à jour de player.
            replayCameras.player = new BABYLON.FreeCamera("replayPlayerCam", new BABYLON.Vector3(0, 5, -10), scene);

            // Mise à jour de cinematic.
            replayCameras.cinematic = new BABYLON.ArcRotateCamera(
                // Paramètre de l'appel ou valeur de configuration.
                "replayCinematicCam",
                // Paramètre de l'appel ou valeur de configuration.
                0,
                // Paramètre de l'appel ou valeur de configuration.
                Math.PI / 2.4,
                // Paramètre de l'appel ou valeur de configuration.
                12,
                // Appel de Zero pour appliquer l'action prévue.
                BABYLON.Vector3.Zero(),
                // Instruction nécessaire au déroulement de cette partie.
                scene
            // Fermeture du bloc ou de l'appel.
            );

            // Caméra de rendu finale qui fait une transition douce vers chaque angle.
            // Mise à jour de blend.
            replayCameras.blend = new BABYLON.FreeCamera("replayBlendCam", new BABYLON.Vector3(0, 20, -40), scene);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction installReplayControls : elle regroupe le traitement de cette partie.
        function installReplayControls() {
            // Appel de addEventListener pour appliquer l'action prévue.
            window.addEventListener("keydown", (e) => {
                // Vérification avant d'exécuter la suite.
                if (gameState !== "replay") return;

                // Vérification avant d'exécuter la suite.
                if (e.key === "p" || e.key === "P") {
                    // Instruction nécessaire au déroulement de cette partie.
                    replayPaused = !replayPaused;
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (e.key === "ArrowLeft") {
                    // Instruction nécessaire au déroulement de cette partie.
                    replaySpeed = -1;
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (e.key === "ArrowRight") {
                    // Instruction nécessaire au déroulement de cette partie.
                    replaySpeed = 1;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction getReplayCameraTargets : elle regroupe le traitement de cette partie.
        function getReplayCameraTargets(frame, t) {
            // Valeur mémorisée dans ballPos.
            const ballPos = frame.ball;
            // Valeur mémorisée dans trackedPlayer.
            const trackedPlayer = resolveTrackedPlayer(frame);
            // Valeur mémorisée dans actionMid.
            const actionMid = trackedPlayer && trackedPlayer.position
                // Appel de Lerp pour appliquer l'action prévue.
                ? BABYLON.Vector3.Lerp(trackedPlayer.position, ballPos, 0.5)
                // Instruction nécessaire au déroulement de cette partie.
                : ballPos;
            // Valeur mémorisée dans sideOffset.
            const sideOffset = Math.sin(t * Math.PI * 2) * 3;

            // Appel de copyFrom pour appliquer l'action prévue.
            replayCameras.tv.position.copyFrom(ballPos.add(new BABYLON.Vector3(0, 28, -55)));
            // Appel de setTarget pour appliquer l'action prévue.
            replayCameras.tv.setTarget(ballPos);

            // Appel de copyFrom pour appliquer l'action prévue.
            replayCameras.ball.position.copyFrom(ballPos.add(new BABYLON.Vector3(0, 5, -10)));
            // Appel de setTarget pour appliquer l'action prévue.
            replayCameras.ball.setTarget(ballPos);

            // Vérification avant d'exécuter la suite.
            if (trackedPlayer && trackedPlayer.position) {
                // Création de playerOffset.
                const playerOffset = new BABYLON.Vector3(sideOffset, 3, -8);
                // Appel de copyFrom pour appliquer l'action prévue.
                replayCameras.player.position.copyFrom(trackedPlayer.position.add(playerOffset));
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de copyFrom pour appliquer l'action prévue.
                replayCameras.player.position.copyFrom(ballPos.add(new BABYLON.Vector3(0, 4, -8)));
            // Fermeture du bloc ou de l'appel.
            }
            // Appel de setTarget pour appliquer l'action prévue.
            replayCameras.player.setTarget(actionMid);

            // Vérification avant d'exécuter la suite.
            if (t < 0.5) {
                // Instruction nécessaire au déroulement de cette partie.
                replayCameras.cinematic.alpha += 0.005;
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Instruction nécessaire au déroulement de cette partie.
                replayCameras.cinematic.alpha += 0.02;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (t > 0.7) {
                // En fin d'action, on remonte la caméra pour éviter les joueurs qui masquent le ballon.
                // Mise à jour de beta.
                replayCameras.cinematic.beta = Math.PI / 2.8;
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Mise à jour de beta.
                replayCameras.cinematic.beta = Math.PI / 2.4 + Math.sin(t * Math.PI) * 0.1;
            // Fermeture du bloc ou de l'appel.
            }

            // Replay en 3 phases: tir -> trajectoire -> but.
            // Vérification avant d'exécuter la suite.
            if (t < 0.25) {
                // Mise à jour de radius.
                replayCameras.cinematic.radius = 8;
                // Vérification avant d'exécuter la suite.
                if (trackedPlayer && trackedPlayer.position) {
                    // Appel de copyFrom pour appliquer l'action prévue.
                    replayCameras.cinematic.target.copyFrom(trackedPlayer.position);
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Appel de copyFrom pour appliquer l'action prévue.
                    replayCameras.cinematic.target.copyFrom(actionMid);
                // Fermeture du bloc ou de l'appel.
                }
            // Deuxième possibilité à tester.
            } else if (t < 0.7) {
                // Mise à jour de radius.
                replayCameras.cinematic.radius = 10;
                // Appel de copyFrom pour appliquer l'action prévue.
                replayCameras.cinematic.target.copyFrom(ballPos);
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Mise à jour de radius.
                replayCameras.cinematic.radius = 6;
                // Préparation de goalFocus avec Babylon.js.
                const goalFocus = BABYLON.Vector3.Lerp(ballPos, actionMid, 0.7);
                // Vérification avant d'exécuter la suite.
                if (t > 0.8) {
                    // Focus but: on privilégie la balle pour une lecture claire de l'action.
                    // Appel de copyFrom pour appliquer l'action prévue.
                    replayCameras.cinematic.target.copyFrom(ballPos);
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Création de avoidOffset.
                    const avoidOffset = new BABYLON.Vector3(4, 0, 0);
                    // Appel de copyFrom pour appliquer l'action prévue.
                    replayCameras.cinematic.target.copyFrom(goalFocus.add(avoidOffset));
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Clamp de sécurité pour éviter une caméra trop proche ou trop lointaine.
            // Vérification avant d'exécuter la suite.
            if (replayCameras.cinematic.radius < 6) replayCameras.cinematic.radius = 6;
            // Vérification avant d'exécuter la suite.
            if (replayCameras.cinematic.radius > 12) replayCameras.cinematic.radius = 12;

            // Valeur mémorisée dans mode.
            const mode = cameraModes[currentCameraIndex];
            // Valeur mémorisée dans targetPos.
            let targetPos = replayCameras.tv.position;
            // Valeur mémorisée dans targetLookAt.
            let targetLookAt = ballPos;

            // Vérification avant d'exécuter la suite.
            if (mode === "ball") {
                // Instruction nécessaire au déroulement de cette partie.
                targetPos = replayCameras.ball.position;
            // Deuxième possibilité à tester.
            } else if (mode === "player") {
                // Instruction nécessaire au déroulement de cette partie.
                targetPos = replayCameras.player.position;
                // Instruction nécessaire au déroulement de cette partie.
                targetLookAt = actionMid;
            // Deuxième possibilité à tester.
            } else if (mode === "cinematic") {
                // Instruction nécessaire au déroulement de cette partie.
                targetPos = replayCameras.cinematic.position;
                // Instruction nécessaire au déroulement de cette partie.
                targetLookAt = actionMid;
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return { targetPos, targetLookAt };
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction updateReplayCamera : elle regroupe le traitement de cette partie.
        function updateReplayCamera(frame, replayT) {
            // Vérification avant d'exécuter la suite.
            if (!scene || !replayCameras.blend || !frame) return;

            // Vérification avant d'exécuter la suite.
            if (replayFrameIndex > 0 && replayFrameIndex % 120 === 0) {
                // Instruction nécessaire au déroulement de cette partie.
                currentCameraIndex = (currentCameraIndex + 1) % cameraModes.length;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans t.
            const t = Number.isFinite(replayT)
                // Instruction nécessaire au déroulement de cette partie.
                ? replayT
                // Instruction nécessaire au déroulement de cette partie.
                : (replayFrames.length > 0 ? replayFrameIndex / replayFrames.length : 0);
            // Valeur mémorisée dans { targetPos, targetLookAt }.
            const { targetPos, targetLookAt } = getReplayCameraTargets(frame, t);
            // Valeur mémorisée dans lerpFactor.
            const lerpFactor = 0.1 + (t * 0.15);

            // Mise à jour de position.
            replayCameras.blend.position = BABYLON.Vector3.Lerp(
                // Paramètre de l'appel ou valeur de configuration.
                replayCameras.blend.position,
                // Paramètre de l'appel ou valeur de configuration.
                targetPos,
                // Instruction nécessaire au déroulement de cette partie.
                lerpFactor
            // Fermeture du bloc ou de l'appel.
            );
            // Appel de setTarget pour appliquer l'action prévue.
            replayCameras.blend.setTarget(targetLookAt);

            // Mise à jour de activeCamera.
            scene.activeCamera = replayCameras.blend;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction clearReplayState : elle regroupe le traitement de cette partie.
        function clearReplayState() {
            // Instruction nécessaire au déroulement de cette partie.
            replayFrames = [];
            // Instruction nécessaire au déroulement de cette partie.
            replayFrameIndex = 0;
            // Instruction nécessaire au déroulement de cette partie.
            replayPlaybackCursor = 0;
            // Instruction nécessaire au déroulement de cette partie.
            replayLastStepTime = 0;
            // Instruction nécessaire au déroulement de cette partie.
            replayPaused = false;
            // Instruction nécessaire au déroulement de cette partie.
            replaySpeed = 1;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction capturePlayerState : elle regroupe le traitement de cette partie.
        function capturePlayerState(player) {
            // Résultat renvoyé par la fonction.
            return {
                // Appel de clone pour appliquer l'action prévue.
                position: player.position.clone(),
                // Paramètre de l'appel ou valeur de configuration.
                currentAnim: player.currentAnim || "idle",
                // Paramètre de l'appel ou valeur de configuration.
                wobbleTime: player.wobbleTime || 0,
                // Appel de clone pour appliquer l'action prévue.
                facingDirection: player.facingDirection ? player.facingDirection.clone() : null,
                // Paramètre de l'appel ou valeur de configuration.
                modelRotationY: player.model ? player.model.rotation.y : null,
                // Instruction nécessaire au déroulement de cette partie.
                modelRotationX: player.model ? player.model.rotation.x : null
            // Fermeture du bloc ou de l'appel.
            };
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction applyPlayerState : elle regroupe le traitement de cette partie.
        function applyPlayerState(player, snapshot) {
            // Vérification avant d'exécuter la suite.
            if (!player || !snapshot) return;

            // Vérification avant d'exécuter la suite.
            if (snapshot.position) {
                // Appel de copyFrom pour appliquer l'action prévue.
                player.position.copyFrom(snapshot.position);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (snapshot.facingDirection && player.facingDirection) {
                // Appel de copyFrom pour appliquer l'action prévue.
                player.facingDirection.copyFrom(snapshot.facingDirection);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof snapshot.wobbleTime === "number") {
                // Mise à jour de wobbleTime.
                player.wobbleTime = snapshot.wobbleTime;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (player.model) {
                // Vérification avant d'exécuter la suite.
                if (typeof snapshot.modelRotationY === "number") {
                    // Mise à jour de y.
                    player.model.rotation.y = snapshot.modelRotationY;
                // Fermeture du bloc ou de l'appel.
                }
                // Vérification avant d'exécuter la suite.
                if (typeof snapshot.modelRotationX === "number") {
                    // Mise à jour de x.
                    player.model.rotation.x = snapshot.modelRotationX;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof player.playAnimation === "function") {
                // Appel de playAnimation pour appliquer l'action prévue.
                player.playAnimation(snapshot.currentAnim || "idle");
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction finalizeGoal : elle regroupe le traitement de cette partie.
        function finalizeGoal() {
            // Vérification avant d'exécuter la suite.
            if (!pendingGoalReset) return;

            // Valeur mémorisée dans result.
            const result = pendingGoalReset;
            // Instruction nécessaire au déroulement de cette partie.
            pendingGoalReset = null;
            // Appel de clearReplayState pour appliquer l'action prévue.
            clearReplayState();
            // Instruction nécessaire au déroulement de cette partie.
            gameState = "playing";

            // Vérification avant d'exécuter la suite.
            if (scene && previousActiveCamera) {
                // Mise à jour de activeCamera.
                scene.activeCamera = previousActiveCamera;
            // Fermeture du bloc ou de l'appel.
            }
            // Instruction nécessaire au déroulement de cette partie.
            previousActiveCamera = null;

            // Vérification avant d'exécuter la suite.
            if (typeof window.hideTournamentOverlayBanner === "function") {
                // Appel de hideTournamentOverlayBanner pour appliquer l'action prévue.
                window.hideTournamentOverlayBanner();
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio.stopGoal === "function") {
                // Appel de stopGoal pour appliquer l'action prévue.
                window.matchAudio.stopGoal();
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof onReplayEnd === "function") {
                // Appel de onReplayEnd pour appliquer l'action prévue.
                onReplayEnd(result);
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de setSkipButtonVisible pour appliquer l'action prévue.
            setSkipButtonVisible(false);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction captureFrame : elle regroupe le traitement de cette partie.
        function captureFrame(now) {
            // Vérification avant d'exécuter la suite.
            if (gameState !== "playing") return;
            // Vérification avant d'exécuter la suite.
            if (!ball || !ball.position || !myTeam || !opponentTeam) return;

            // Valeur mémorisée dans lastKicker.
            const lastKicker = ball.lastKicker || null;
            // Valeur mémorisée dans lastKickerTeam.
            let lastKickerTeam = null;
            // Valeur mémorisée dans lastKickerIndex.
            let lastKickerIndex = -1;

            // Vérification avant d'exécuter la suite.
            if (lastKicker) {
                // Appel de indexOf pour appliquer l'action prévue.
                lastKickerIndex = myTeam.players.indexOf(lastKicker);
                // Vérification avant d'exécuter la suite.
                if (lastKickerIndex >= 0) {
                    // Instruction nécessaire au déroulement de cette partie.
                    lastKickerTeam = "my";
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Appel de indexOf pour appliquer l'action prévue.
                    lastKickerIndex = opponentTeam.players.indexOf(lastKicker);
                    // Vérification avant d'exécuter la suite.
                    if (lastKickerIndex >= 0) {
                        // Instruction nécessaire au déroulement de cette partie.
                        lastKickerTeam = "opponent";
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de push pour appliquer l'action prévue.
            replayBuffer.push({
                // Paramètre de l'appel ou valeur de configuration.
                time: now,
                // Appel de clone pour appliquer l'action prévue.
                ball: ball.position.clone(),
                // Appel de clone pour appliquer l'action prévue.
                ballRotation: ball.rotation ? ball.rotation.clone() : null,
                // Appel de map pour appliquer l'action prévue.
                players: myTeam.players.map(capturePlayerState),
                // Appel de map pour appliquer l'action prévue.
                opponents: opponentTeam.players.map(capturePlayerState),
                // Paramètre de l'appel ou valeur de configuration.
                lastKickerTeam,
                // Instruction nécessaire au déroulement de cette partie.
                lastKickerIndex
            // Fermeture du bloc ou de l'appel.
            });

            // Répétition tant que la condition reste vraie.
            while (replayBuffer.length > 0 && now - replayBuffer[0].time > maxReplayTimeMs) {
                // Appel de shift pour appliquer l'action prévue.
                replayBuffer.shift();
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction applyFrame : elle regroupe le traitement de cette partie.
        function applyFrame(frame) {
            // Vérification avant d'exécuter la suite.
            if (!frame) return;

            // Appel de copyFrom pour appliquer l'action prévue.
            ball.position.copyFrom(frame.ball);
            // Vérification avant d'exécuter la suite.
            if (frame.ballRotation && ball.rotation) {
                // Appel de copyFrom pour appliquer l'action prévue.
                ball.rotation.copyFrom(frame.ballRotation);
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (ball.velocity) {
                // Appel de set pour appliquer l'action prévue.
                ball.velocity.set(0, 0, 0);
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de forEach pour appliquer l'action prévue.
            myTeam.players.forEach((p, i) => {
                // Appel de applyPlayerState pour appliquer l'action prévue.
                applyPlayerState(p, frame.players[i]);
            // Fermeture du bloc ou de l'appel.
            });

            // Appel de forEach pour appliquer l'action prévue.
            opponentTeam.players.forEach((p, i) => {
                // Appel de applyPlayerState pour appliquer l'action prévue.
                applyPlayerState(p, frame.opponents[i]);
            // Fermeture du bloc ou de l'appel.
            });

            // Vérification avant d'exécuter la suite.
            if (cameras && cameras.cameraTargetNode) {
                // Appel de copyFrom pour appliquer l'action prévue.
                cameras.cameraTargetNode.position.copyFrom(frame.ball);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction applyInterpolatedPlayerState : elle regroupe le traitement de cette partie.
        function applyInterpolatedPlayerState(player, snapshotA, snapshotB, t) {
            // Vérification avant d'exécuter la suite.
            if (!player || !snapshotA || !snapshotB) return;

            // Préparation de pos avec Babylon.js.
            const pos = BABYLON.Vector3.Lerp(snapshotA.position, snapshotB.position, t);
            // Appel de copyFrom pour appliquer l'action prévue.
            player.position.copyFrom(pos);

            // Vérification avant d'exécuter la suite.
            if (player.facingDirection && snapshotA.facingDirection && snapshotB.facingDirection) {
                // Préparation de facing avec Babylon.js.
                const facing = BABYLON.Vector3.Lerp(snapshotA.facingDirection, snapshotB.facingDirection, t);
                // Vérification avant d'exécuter la suite.
                if (facing.lengthSquared() > 0.000001) facing.normalize();
                // Appel de copyFrom pour appliquer l'action prévue.
                player.facingDirection.copyFrom(facing);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof snapshotA.wobbleTime === "number" && typeof snapshotB.wobbleTime === "number") {
                // Mise à jour de wobbleTime.
                player.wobbleTime = BABYLON.Scalar.Lerp(snapshotA.wobbleTime, snapshotB.wobbleTime, t);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (player.model) {
                // Vérification avant d'exécuter la suite.
                if (typeof snapshotA.modelRotationY === "number" && typeof snapshotB.modelRotationY === "number") {
                    // Mise à jour de y.
                    player.model.rotation.y = BABYLON.Scalar.Lerp(snapshotA.modelRotationY, snapshotB.modelRotationY, t);
                // Fermeture du bloc ou de l'appel.
                }
                // Vérification avant d'exécuter la suite.
                if (typeof snapshotA.modelRotationX === "number" && typeof snapshotB.modelRotationX === "number") {
                    // Mise à jour de x.
                    player.model.rotation.x = BABYLON.Scalar.Lerp(snapshotA.modelRotationX, snapshotB.modelRotationX, t);
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof player.playAnimation === "function") {
                // Valeur mémorisée dans anim.
                const anim = t < 0.5 ? snapshotA.currentAnim : snapshotB.currentAnim;
                // Appel de playAnimation pour appliquer l'action prévue.
                player.playAnimation(anim || "idle");
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction applyInterpolatedFrame : elle regroupe le traitement de cette partie.
        function applyInterpolatedFrame(frameA, frameB, t) {
            // Vérification avant d'exécuter la suite.
            if (!frameA || !frameB) return;

            // Préparation de interpolatedBall avec Babylon.js.
            const interpolatedBall = BABYLON.Vector3.Lerp(frameA.ball, frameB.ball, t);
            // Appel de copyFrom pour appliquer l'action prévue.
            ball.position.copyFrom(interpolatedBall);

            // Vérification avant d'exécuter la suite.
            if (frameA.ballRotation && frameB.ballRotation && ball.rotation) {
                // Préparation de interpolatedRot avec Babylon.js.
                const interpolatedRot = BABYLON.Vector3.Lerp(frameA.ballRotation, frameB.ballRotation, t);
                // Appel de copyFrom pour appliquer l'action prévue.
                ball.rotation.copyFrom(interpolatedRot);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (ball.velocity) {
                // Appel de set pour appliquer l'action prévue.
                ball.velocity.set(0, 0, 0);
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de forEach pour appliquer l'action prévue.
            myTeam.players.forEach((p, i) => {
                // Appel de applyInterpolatedPlayerState pour appliquer l'action prévue.
                applyInterpolatedPlayerState(p, frameA.players[i], frameB.players[i], t);
            // Fermeture du bloc ou de l'appel.
            });

            // Appel de forEach pour appliquer l'action prévue.
            opponentTeam.players.forEach((p, i) => {
                // Appel de applyInterpolatedPlayerState pour appliquer l'action prévue.
                applyInterpolatedPlayerState(p, frameA.opponents[i], frameB.opponents[i], t);
            // Fermeture du bloc ou de l'appel.
            });

            // Vérification avant d'exécuter la suite.
            if (cameras && cameras.cameraTargetNode) {
                // Appel de copyFrom pour appliquer l'action prévue.
                cameras.cameraTargetNode.position.copyFrom(interpolatedBall);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction resolveTrackedPlayer : elle regroupe le traitement de cette partie.
        function resolveTrackedPlayer(frame) {
            // Vérification avant d'exécuter la suite.
            if (!frame) return myTeam.players[0] || null;

            // Vérification avant d'exécuter la suite.
            if (frame.lastKickerTeam === "my" && Number.isInteger(frame.lastKickerIndex)) {
                // Résultat renvoyé par la fonction.
                return myTeam.players[frame.lastKickerIndex] || null;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (frame.lastKickerTeam === "opponent" && Number.isInteger(frame.lastKickerIndex)) {
                // Résultat renvoyé par la fonction.
                return opponentTeam.players[frame.lastKickerIndex] || null;
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return myTeam.players[0] || null;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction startReplay : elle regroupe le traitement de cette partie.
        function startReplay() {
            // Appel de slice pour appliquer l'action prévue.
            replayFrames = replayBuffer.slice();

            // Vérification avant d'exécuter la suite.
            if (replayFrames.length === 0) {
                // Appel de finalizeGoal pour appliquer l'action prévue.
                finalizeGoal();
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Instruction nécessaire au déroulement de cette partie.
            previousActiveCamera = scene ? scene.activeCamera : null;
            // Instruction nécessaire au déroulement de cette partie.
            gameState = "replay";
            // Instruction nécessaire au déroulement de cette partie.
            replayFrameIndex = 0;
            // Instruction nécessaire au déroulement de cette partie.
            replayPlaybackCursor = 0;
            // Instruction nécessaire au déroulement de cette partie.
            replayLastStepTime = 0;
            // Instruction nécessaire au déroulement de cette partie.
            replayPaused = false;
            // Instruction nécessaire au déroulement de cette partie.
            replaySpeed = 1;
            // Instruction nécessaire au déroulement de cette partie.
            currentCameraIndex = 0;
            // Appel de setSkipButtonVisible pour appliquer l'action prévue.
            setSkipButtonVisible(true);

            // Vérification avant d'exécuter la suite.
            if (replayFrames[0]) {
                // Appel de updateReplayCamera pour appliquer l'action prévue.
                updateReplayCamera(replayFrames[0]);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction update : elle regroupe le traitement de cette partie.
        function update(now) {
            // Vérification avant d'exécuter la suite.
            if (gameState === "replayBanner") {
                // On fige le gameplay pendant le petit intro "REPLAY".
                // Appel de setSkipButtonVisible pour appliquer l'action prévue.
                setSkipButtonVisible(true);
                // Résultat renvoyé par la fonction.
                return true;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (gameState !== "replay") return false;

            // Appel de setSkipButtonVisible pour appliquer l'action prévue.
            setSkipButtonVisible(true);

            // Vérification avant d'exécuter la suite.
            if (replayFrames.length === 0) {
                // Appel de finalizeGoal pour appliquer l'action prévue.
                finalizeGoal();
                // Résultat renvoyé par la fonction.
                return true;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (replayLastStepTime && now - replayLastStepTime < replayFrameStepMs) {
                // Résultat renvoyé par la fonction.
                return true;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans frameIndexA.
            const frameIndexA = Math.floor(replayPlaybackCursor);
            // Valeur mémorisée dans frameIndexB.
            const frameIndexB = Math.min(frameIndexA + 1, replayFrames.length - 1);
            // Valeur mémorisée dans alpha.
            const alpha = replayPlaybackCursor - frameIndexA;

            // Valeur mémorisée dans frameA.
            const frameA = replayFrames[frameIndexA];
            // Valeur mémorisée dans frameB.
            const frameB = replayFrames[frameIndexB];
            // Vérification avant d'exécuter la suite.
            if (!frameA || !frameB) {
                // Appel de finalizeGoal pour appliquer l'action prévue.
                finalizeGoal();
                // Résultat renvoyé par la fonction.
                return true;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans t.
            const t = replayFrames.length > 0 ? replayPlaybackCursor / replayFrames.length : 0;
            // Appel de applyInterpolatedFrame pour appliquer l'action prévue.
            applyInterpolatedFrame(frameA, frameB, alpha);

            // Valeur mémorisée dans blendedCameraFrame.
            const blendedCameraFrame = {
                // Paramètre de l'appel ou valeur de configuration.
                ...frameA,
                // Appel de Lerp pour appliquer l'action prévue.
                ball: BABYLON.Vector3.Lerp(frameA.ball, frameB.ball, alpha)
            // Fermeture du bloc ou de l'appel.
            };
            // Appel de updateReplayCamera pour appliquer l'action prévue.
            updateReplayCamera(blendedCameraFrame, t);

            // Instruction nécessaire au déroulement de cette partie.
            replayFrameIndex = frameIndexA;

            // Vérification avant d'exécuter la suite.
            if (!replayPaused) {
                // Valeur mémorisée dans isGoalMoment.
                const isGoalMoment = t > 0.8;
                // Valeur mémorisée dans speedMultiplier.
                const speedMultiplier = isGoalMoment ? 0.3 : 1;
                // Instruction nécessaire au déroulement de cette partie.
                replayPlaybackCursor += replaySpeed * speedMultiplier;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (replayPlaybackCursor < 0) replayPlaybackCursor = 0;
            // Instruction nécessaire au déroulement de cette partie.
            replayLastStepTime = now;

            // Vérification avant d'exécuter la suite.
            if (replayPlaybackCursor >= replayFrames.length) {
                // Appel de finalizeGoal pour appliquer l'action prévue.
                finalizeGoal();
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction triggerGoal : elle regroupe le traitement de cette partie.
        function triggerGoal(payload) {
            // Vérification avant d'exécuter la suite.
            if (gameState !== "playing") return false;
            // Vérification avant d'exécuter la suite.
            if (pendingGoalReset) return false;

            // Instruction nécessaire au déroulement de cette partie.
            pendingGoalReset = payload;
            // Appel de setSkipButtonVisible pour appliquer l'action prévue.
            setSkipButtonVisible(true);

            // Appel de dispatchEvent pour appliquer l'action prévue.
            window.dispatchEvent(new CustomEvent("match:goal"));

            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio.playGoalLoop === "function") {
                // Appel de playGoalLoop pour appliquer l'action prévue.
                window.matchAudio.playGoalLoop();
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (typeof window.showTournamentOverlayBanner === "function") {
                // Instruction nécessaire au déroulement de cette partie.
                gameState = "replayBanner";
                // Appel de showTournamentOverlayBanner pour appliquer l'action prévue.
                window.showTournamentOverlayBanner("Replay", {
                    // Paramètre de l'appel ou valeur de configuration.
                    durationMs: 1800,
                    // Paramètre de l'appel ou valeur de configuration.
                    textAnimationDurationMs: 1800,
                    // Paramètre de l'appel ou valeur de configuration.
                    forceFinaleLike: true,
                    // Paramètre de l'appel ou valeur de configuration.
                    showDelayMs: 80,
                    // Paramètre de l'appel ou valeur de configuration.
                    visibleWindowMs: 1050,
                    // Appel de function pour appliquer l'action prévue.
                    onComplete: function () {
                        // Le but a pu être annulé entre-temps.
                        // Vérification avant d'exécuter la suite.
                        if (!pendingGoalReset) {
                            // Instruction nécessaire au déroulement de cette partie.
                            gameState = "playing";
                            // Résultat renvoyé par la fonction.
                            return;
                        // Fermeture du bloc ou de l'appel.
                        }
                        // Appel de startReplay pour appliquer l'action prévue.
                        startReplay();
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                });
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de startReplay pour appliquer l'action prévue.
                startReplay();
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction isPlaying : elle regroupe le traitement de cette partie.
        function isPlaying() {
            // Résultat renvoyé par la fonction.
            return gameState === "playing";
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction isReplayActive : elle regroupe le traitement de cette partie.
        function isReplayActive() {
            // Résultat renvoyé par la fonction.
            return gameState === "replay" || gameState === "replayBanner";
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction skipReplay : elle regroupe le traitement de cette partie.
        function skipReplay() {
            // Vérification avant d'exécuter la suite.
            if (gameState === "replay" || gameState === "replayBanner") {
                // Appel de finalizeGoal pour appliquer l'action prévue.
                finalizeGoal();
                // Résultat renvoyé par la fonction.
                return true;
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction getState : elle regroupe le traitement de cette partie.
        function getState() {
            // Résultat renvoyé par la fonction.
            return gameState;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de createReplayCameras pour appliquer l'action prévue.
        createReplayCameras();
        // Appel de ensureSkipButton pour appliquer l'action prévue.
        ensureSkipButton();
        // Appel de setSkipButtonVisible pour appliquer l'action prévue.
        setSkipButtonVisible(false);
        // Vérification avant d'exécuter la suite.
        if (!window.__goalReplayControlsInstalled) {
            // Appel de installReplayControls pour appliquer l'action prévue.
            installReplayControls();
            // Mise à jour de __goalReplayControlsInstalled.
            window.__goalReplayControlsInstalled = true;
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            captureFrame,
            // Paramètre de l'appel ou valeur de configuration.
            update,
            // Paramètre de l'appel ou valeur de configuration.
            triggerGoal,
            // Paramètre de l'appel ou valeur de configuration.
            isPlaying,
            // Paramètre de l'appel ou valeur de configuration.
            getState,
            // Paramètre de l'appel ou valeur de configuration.
            isReplayActive,
            // Instruction nécessaire au déroulement de cette partie.
            skipReplay
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de createGoalReplayController.
    window.createGoalReplayController = createGoalReplayController;
// Instruction nécessaire au déroulement de cette partie.
})();
