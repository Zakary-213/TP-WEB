// js/objects/cameraRuntime.js
// Architecture FIFA 3 couches : Brain → Rig → Camera (broadcastCamera uniquement)
// TPS / 3e personne / FPV sont gérées côté settings + runtime.
// Appel de function pour appliquer l'action prévue.
(function () {

    // ─────────────────────────────────────────────────────────────────────────────
    // Utilitaire partagé : animation fluide de switch joueur (utilisé par myTeam)
    // ─────────────────────────────────────────────────────────────────────────────
    // Fonction animateCameraSwitch : elle regroupe le traitement de cette partie.
    function animateCameraSwitch(scene, cameras, fromPlayer, toPlayer, duration) {
        // Vérification avant d'exécuter la suite.
        if (!fromPlayer || !toPlayer || !cameras?.cameraTargetNode) return;
        // Valeur mémorisée dans dur.
        var dur = duration !== undefined ? duration : 180;

        // Valeur mémorisée dans start.
        var start = cameras.cameraTargetNode.position.clone();
        // Valeur mémorisée dans end.
        var end   = toPlayer.position.clone();
        // Valeur mémorisée dans durationSeconds.
        var durationSeconds = dur > 10 ? (dur / 1000) : dur;
        // Valeur mémorisée dans safeDuration.
        var safeDuration = Math.max(0.05, durationSeconds || 0.25);
        // Valeur mémorisée dans t.
        var t = 0;

        // Valeur mémorisée dans observer.
        var observer = scene.onBeforeRenderObservable.add(function () {
            // Valeur mémorisée dans dt.
            var dt = scene.getEngine().getDeltaTime() / 1000;
            // Instruction nécessaire au déroulement de cette partie.
            t += dt / safeDuration;
            // Vérification avant d'exécuter la suite.
            if (t >= 1) t = 1;

            // Valeur mémorisée dans eased.
            var eased  = t * t * (3 - 2 * t);
            // Préparation de lerped avec Babylon.js.
            var lerped = BABYLON.Vector3.Lerp(start, end, eased);
            // Appel de copyFrom pour appliquer l'action prévue.
            cameras.cameraTargetNode.position.copyFrom(lerped);

            // Vérification avant d'exécuter la suite.
            if (t === 1) {
                // Appel de remove pour appliquer l'action prévue.
                scene.onBeforeRenderObservable.remove(observer);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CONTROLLER PRINCIPAL
    // ─────────────────────────────────────────────────────────────────────────────
    // Fonction createCameraRuntimeController : elle regroupe le traitement de cette partie.
    function createCameraRuntimeController(config) {
        // Valeur mémorisée dans opts.
        var opts             = config || {};
        // Valeur mémorisée dans scene.
        var scene            = opts.scene;
        // Valeur mémorisée dans cameras.
        var cameras          = opts.cameras;
        // Valeur mémorisée dans myTeam.
        var myTeam           = opts.myTeam;
        // Valeur mémorisée dans selectionIndicator.
        var selectionIndicator = opts.selectionIndicator;
        // Valeur mémorisée dans ballRef.
        var ballRef          = opts.ball || null;
        // Valeur mémorisée dans tournamentStage.
        var tournamentStage  = opts.tournamentStage || "";

        // État interne minimal
        // Valeur mémorisée dans state.
        var state = {
            // Paramètre de l'appel ou valeur de configuration.
            cameraRig       : null,
            // Paramètre de l'appel ou valeur de configuration.
            shake           : null,
            // Paramètre de l'appel ou valeur de configuration.
            kickZoom        : null,
            // Appel de glages pour appliquer l'action prévue.
            userZoomOffset  : 0,   // décalage ajouté par le slider réglages (en unités de radius)
            // Instruction nécessaire au déroulement de cette partie.
            time            : 0
        // Fermeture du bloc ou de l'appel.
        };

        // ── SETUP RIG ────────────────────────────────────────────────────────────
        // Fonction setupBroadcastRig : elle regroupe le traitement de cette partie.
        function setupBroadcastRig() {
            // Vérification avant d'exécuter la suite.
            if (!scene || !cameras?.broadcastCamera) return;

            // Mise à jour de cameraRig.
            state.cameraRig = new BABYLON.TransformNode("cameraRig", scene);

            // Vérification avant d'exécuter la suite.
            if (cameras.cameraTargetNode?.position) {
                // Appel de copyFrom pour appliquer l'action prévue.
                state.cameraRig.position.copyFrom(cameras.cameraTargetNode.position);
            // Fermeture du bloc ou de l'appel.
            }

            // La broadcastCamera suit ce rig, pas le joueur directement.
            // Mise à jour de lockedTarget.
            cameras.broadcastCamera.lockedTarget = state.cameraRig;
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction getBallNode : elle regroupe le traitement de cette partie.
        function getBallNode(ballArg) {
            // Résultat renvoyé par la fonction.
            return ballArg || ballRef;
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // COUCHE 1 — CAMERA BRAIN (intelligence / intensité de jeu)
        // ═════════════════════════════════════════════════════════════════════════
        // Valeur mémorisée dans cameraBrain.
        var cameraBrain = {
            // Paramètre de l'appel ou valeur de configuration.
            intensity   : 0.3,
            // Paramètre de l'appel ou valeur de configuration.
            lastBallPos : null,
            // Appel de Vector3 pour appliquer l'action prévue.
            velocity    : new BABYLON.Vector3(0, 0, 0),

            // Appel de function pour appliquer l'action prévue.
            update: function (ball, dt) {
                // Vérification avant d'exécuter la suite.
                if (!ball || !ball.position) return;

                // Vérification avant d'exécuter la suite.
                if (this.lastBallPos) {
                    // Valeur mémorisée dans rawVel.
                    var rawVel = ball.position.subtract(this.lastBallPos);
                    // Vérification avant d'exécuter la suite.
                    if (dt > 0) {
                        // Mise à jour de velocity pour cet objet.
                        this.velocity = rawVel.scale(1 / dt);
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }
                // Mise à jour de lastBallPos pour cet objet.
                this.lastBallPos = ball.position.clone();

                // Valeur mémorisée dans speed.
                var speed           = this.velocity.length();
                // Préparation de targetIntensity avec Babylon.js.
                var targetIntensity = BABYLON.Scalar.Clamp(speed / 40, 0, 1);

                // Mise à jour de intensity pour cet objet.
                this.intensity = BABYLON.Scalar.Lerp(this.intensity, targetIntensity, 0.05);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        };

        // ═════════════════════════════════════════════════════════════════════════
        // COUCHE 2 — FOCUS + ANTICIPATION + FRAMING (calcul du point cible du rig)
        // ═════════════════════════════════════════════════════════════════════════

        /** Focus FIFA : balle toujours prioritaire (85 % lancée / 70 % repos). */
        // Fonction computeFocus : elle regroupe le traitement de cette partie.
        function computeFocus(ball, player) {
            // Valeur mémorisée dans ballPos.
            var ballPos   = ball.position;
            // Valeur mémorisée dans playerPos.
            var playerPos = player.position;
            // Valeur mémorisée dans ballSpeed.
            var ballSpeed = ball.velocity
                // Appel de sqrt pour appliquer l'action prévue.
                ? Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.z * ball.velocity.z)
                // Instruction nécessaire au déroulement de cette partie.
                : 0;
            // Valeur mémorisée dans ballWeight.
            var ballWeight = ballSpeed > 1.5 ? 0.85 : 0.70;

            // Résultat renvoyé par la fonction.
            return new BABYLON.Vector3(
                // Paramètre de l'appel ou valeur de configuration.
                ballPos.x * ballWeight + playerPos.x * (1 - ballWeight),
                // Paramètre de l'appel ou valeur de configuration.
                0,
                // Instruction nécessaire au déroulement de cette partie.
                ballPos.z * ballWeight + playerPos.z * (1 - ballWeight)
            // Fermeture du bloc ou de l'appel.
            );
        // Fermeture du bloc ou de l'appel.
        }

        /**
         * Direction du jeu — lit où va le jeu, pas juste où va la balle.
         * Si la balle est lente/arrêtée, on utilise la direction du joueur.
         */
        // Fonction computeGameDirection : elle regroupe le traitement de cette partie.
        function computeGameDirection(ball, player) {
            // Valeur mémorisée dans vel.
            var vel = ball.velocity
                // Appel de Vector3 pour appliquer l'action prévue.
                ? new BABYLON.Vector3(ball.velocity.x, 0, ball.velocity.z)
                // Appel de Zero pour appliquer l'action prévue.
                : BABYLON.Vector3.Zero();

            // Balle quasi immobile → on lit la direction du joueur actif
            // Vérification avant d'exécuter la suite.
            if (vel.length() < 0.1) {
                // Vérification avant d'exécuter la suite.
                if (player.facingDirection) {
                    // Appel de Vector3 pour appliquer l'action prévue.
                    vel = new BABYLON.Vector3(player.facingDirection.x, 0, player.facingDirection.z);
                // Deuxième possibilité à tester.
                } else if (player.forward) {
                    // Appel de Vector3 pour appliquer l'action prévue.
                    vel = new BABYLON.Vector3(player.forward.x, 0, player.forward.z);
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans len.
            var len = vel.length();
            // Résultat renvoyé par la fonction.
            return len > 0.001 ? vel.scale(1 / len) : new BABYLON.Vector3(1, 0, 0);
        // Fermeture du bloc ou de l'appel.
        }

        /** Look-ahead : anticipe la trajectoire du ballon. */
        // Fonction computeLookAhead : elle regroupe le traitement de cette partie.
        function computeLookAhead(ball) {
            // Vérification avant d'exécuter la suite.
            if (!ball.velocity) return BABYLON.Vector3.Zero();
            // Résultat renvoyé par la fonction.
            return new BABYLON.Vector3(ball.velocity.x, 0, ball.velocity.z).scale(0.7);
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // SHAKE PRO — uniquement sur événement (but, tir…)
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction triggerShake : elle regroupe le traitement de cette partie.
        function triggerShake(power) {
            // Valeur mémorisée dans p.
            var p = (power !== undefined) ? power : 0.003;
            // Mise à jour de shake.
            state.shake = { power: p, time: 0.3 };
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction applyShake : elle regroupe le traitement de cette partie.
        function applyShake(cam, dt) {
            // Vérification avant d'exécuter la suite.
            if (!state.shake || !cam) return;
            // Instruction nécessaire au déroulement de cette partie.
            state.shake.time -= dt;
            // Appel de random pour appliquer l'action prévue.
            cam.alpha += (Math.random() - 0.5) * state.shake.power;
            // Appel de random pour appliquer l'action prévue.
            cam.beta  += (Math.random() - 0.5) * state.shake.power;
            // Vérification avant d'exécuter la suite.
            if (state.shake.time <= 0) {
                // Mise à jour de shake.
                state.shake = null;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // ─── KICK ZOOM (effet FIFA : zoom sur tir fort) ────────────────────────────

        /**
         * @param {number} normalizedPower  0 (tir mou) → 1 (tiré à fond)
         */
        // Fonction triggerKickZoom : elle regroupe le traitement de cette partie.
        function triggerKickZoom(normalizedPower) {
            // Préparation de p avec Babylon.js.
            var p = BABYLON.Scalar.Clamp(normalizedPower, 0, 1);
            // Tir mou : petit zoom (0.60), tir max : grand zoom (0.36)
            // Préparation de targetFov avec Babylon.js.
            var targetFov    = BABYLON.Scalar.Lerp(0.62, 0.36, p);
            // Durée de maintien du zoom : plus le tir est fort, plus on maintient
            // Préparation de holdDuration avec Babylon.js.
            var holdDuration = BABYLON.Scalar.Lerp(0.15, 0.55, p);
            // Mise à jour de kickZoom.
            state.kickZoom = {
                // Paramètre de l'appel ou valeur de configuration.
                targetFov    : targetFov,
                // Paramètre de l'appel ou valeur de configuration.
                holdTimer    : 0,
                // Paramètre de l'appel ou valeur de configuration.
                holdDuration : holdDuration,
                // Instruction nécessaire au déroulement de cette partie.
                phase        : "zoomIn"  // zoomIn | hold | zoomOut
            // Fermeture du bloc ou de l'appel.
            };
        // Fermeture du bloc ou de l'appel.
        }

        // Alias rétro-compatibilité (goalReplay, matchFlow appellent triggerGoalShake)
        // Fonction triggerGoalShake : elle regroupe le traitement de cette partie.
        function triggerGoalShake() {
            // Appel de triggerShake pour appliquer l'action prévue.
            triggerShake(0.01);
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // COUCHE 3 — UPDATE BROADCAST CAMERA (cœur du système FIFA)
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction updateBroadcastCamera : elle regroupe le traitement de cette partie.
        function updateBroadcastCamera(activePlayer, ballArg, gameplayPaused) {
            // Vérification avant d'exécuter la suite.
            if (!scene || !cameras?.broadcastCamera || !state.cameraRig || !activePlayer?.position) return;

            // Valeur mémorisée dans cam.
            var cam = cameras.broadcastCamera;
            // Valeur mémorisée dans rig.
            var rig = state.cameraRig;

            // Vérification avant d'exécuter la suite.
            if (scene.activeCamera !== cam) return;

            // Valeur mémorisée dans dt.
            var dt = scene.getEngine().getDeltaTime() / 1000;
            // Instruction nécessaire au déroulement de cette partie.
            state.time += dt;

            // Valeur mémorisée dans ball.
            var ball = getBallNode(ballArg);
            // Vérification avant d'exécuter la suite.
            if (!ball || !ball.position) return;

            // FIX : Garantir que l'intro (ou un autre script) n'a pas détourné la cible
            // Vérification avant d'exécuter la suite.
            if (cam.lockedTarget !== rig) {
                // Mise à jour de lockedTarget.
                cam.lockedTarget = rig;
            // Fermeture du bloc ou de l'appel.
            }

            // ── 1. BRAIN UPDATE ──────────────────────────────────────────────────
            // Appel de update pour appliquer l'action prévue.
            cameraBrain.update(ball, dt);
            // Valeur mémorisée dans intensity.
            var intensity = cameraBrain.intensity;

            // ── 2. FOCUS + DIRECTION DU JEU + FRAMING ────────────────────────────
            // Valeur mémorisée dans focus.
            var focus = computeFocus(ball, activePlayer);
            // Valeur mémorisée dans dir.
            var dir   = computeGameDirection(ball, activePlayer);

            // Framing offset : la caméra "regarde" dans la direction du jeu
            // → le ballon n'est jamais au centre exact (feeling TV)
            // FIX #2 : framing DYNAMIQUE selon vitesse et intensité
            // Valeur mémorisée dans ballSpeedForFraming.
            var ballSpeedForFraming = cameraBrain.velocity.length();
            // Préparation de dynamicForward avec Babylon.js.
            var dynamicForward = BABYLON.Scalar.Clamp(4 + ballSpeedForFraming * 0.2, 4, 10);
            // Valeur mémorisée dans dynamicSide.
            var dynamicSide    = 2 + intensity * 2;              // action → plus de décalage côté

            // Valeur mémorisée dans framingOffset.
            var framingOffset = dir.scale(dynamicForward);
            // Création de lateralOffset.
            var lateralOffset = new BABYLON.Vector3(-dir.z, 0, dir.x).scale(dynamicSide);

            // Quand l'action est très proche des lignes de touche, on réduit
            // le décalage latéral pour recentrer davantage le terrain et éviter
            // que la caméra se colle trop aux tribunes.
            // Valeur mémorisée dans edgeFactor.
            var edgeFactor = Math.min(
                // Paramètre de l'appel ou valeur de configuration.
                1,
                // Appel de max pour appliquer l'action prévue.
                Math.max(
                    // Appel de abs pour appliquer l'action prévue.
                    Math.abs(focus.x) / 48,
                    // Appel de abs pour appliquer l'action prévue.
                    Math.abs(focus.z) / 28
                // Fermeture du bloc ou de l'appel.
                )
            // Fermeture du bloc ou de l'appel.
            );
            // Valeur mémorisée dans lateralScale.
            var lateralScale = 0.3 * (1 - 0.6 * edgeFactor); // → plus petit près des bords

            // Valeur mémorisée dans target.
            var target = focus
                // Appel de add pour appliquer l'action prévue.
                .add(framingOffset)
                // Appel de add pour appliquer l'action prévue.
                .add(lateralOffset.scale(lateralScale));

            // Limite la zone où la caméra peut "suivre" l'action pour
            // éviter de sortir trop du terrain (et de ne voir que les tribunes)
            // Valeur mémorisée dans MAX_X.
            var MAX_X = 25;  // terrain ≈ [-50, 50] — réduit selon conseil prof
            // Valeur mémorisée dans MAX_Z.
            var MAX_Z = 15;  // terrain ≈ [-30, 30] — réduit selon conseil prof
            // Mise à jour de x.
            target.x = BABYLON.Scalar.Clamp(target.x, -MAX_X, MAX_X);
            // Mise à jour de z.
            target.z = BABYLON.Scalar.Clamp(target.z, -MAX_Z, MAX_Z);

            // FIX #1 : follow speed DYNAMIQUE (jeu lent → smooth / contre-attaque → colle)
            // Valeur mémorisée dans ballSpeedFollow.
            var ballSpeedFollow = cameraBrain.velocity.length();
            // Préparation de dynamicFollow avec Babylon.js.
            var dynamicFollow   = BABYLON.Scalar.Clamp(6 + intensity * 6 + (ballSpeedFollow / 20), 6, 14);
            // Valeur mémorisée dans followSpeed.
            var followSpeed     = gameplayPaused ? 3 : dynamicFollow;
            // Valeur mémorisée dans t.
            var t = 1 - Math.exp(-followSpeed * dt);

            // FIX #3 : CATCH-UP (caméra en retard → snap brutal — game changer)
            // Préparation de distance avec Babylon.js.
            var distance     = BABYLON.Vector3.Distance(rig.position, target);
            // Préparation de catchupBoost avec Babylon.js.
            var catchupBoost = BABYLON.Scalar.Clamp(distance / 40, 0, 1);
            // Valeur mémorisée dans finalT.
            var finalT       = Math.min(t * (1 + catchupBoost), 1); // clamp à 1 pour éviter overshoot
            // Mise à jour de position.
            rig.position     = BABYLON.Vector3.Lerp(rig.position, target, finalT);

            // ── 4. FRAMING VERTICAL (caméra descend en action, remonte au calme) ─
            // Mise à jour de y.
            rig.position.y = BABYLON.Scalar.Lerp(
                // Paramètre de l'appel ou valeur de configuration.
                rig.position.y,
                // Paramètre de l'appel ou valeur de configuration.
                2 + intensity * 2,
                // Instruction nécessaire au déroulement de cette partie.
                0.05
            // Fermeture du bloc ou de l'appel.
            );

            // ── 5. ZOOM INTELLIGENT FIFA ─────────────────────────────────────────
            // Zoom intelligent FIFA — demi : plus proche (on évite les structures du stade)
            // Valeur mémorisée dans ballSpeed.
            var ballSpeed  = cameraBrain.velocity.length();
            // Préparation de zoomOut avec Babylon.js.
            var zoomOut    = BABYLON.Scalar.Clamp(ballSpeed / 20, 0, 1);
            // Valeur mémorisée dans radiusTarget.
            var radiusTarget;
            // Vérification avant d'exécuter la suite.
            if (tournamentStage === "demi") {
                // Stade demi : structures plus hautes → on reste plus proche du terrain
                // Appel de Clamp pour appliquer l'action prévue.
                radiusTarget = BABYLON.Scalar.Clamp(
                    // Paramètre de l'appel ou valeur de configuration.
                    55 + zoomOut * 10 - intensity * 8,
                    // Instruction nécessaire au déroulement de cette partie.
                    45, 70
                // Fermeture du bloc ou de l'appel.
                );
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de Clamp pour appliquer l'action prévue.
                radiusTarget = BABYLON.Scalar.Clamp(
                    // Paramètre de l'appel ou valeur de configuration.
                    100 + zoomOut * 15 - intensity * 10,
                    // Instruction nécessaire au déroulement de cette partie.
                    75, 115
                // Fermeture du bloc ou de l'appel.
                );
            // Fermeture du bloc ou de l'appel.
            }
            // Offset utilisateur (slider zoom dans les réglages) — plus élevé = plus proche
            // Instruction nécessaire au déroulement de cette partie.
            radiusTarget -= state.userZoomOffset;
            // Mise à jour de radius.
            cam.radius = BABYLON.Scalar.Lerp(cam.radius, radiusTarget, t);

            // ── 6. FOV DYNAMIQUE avec KICK ZOOM (effet FIFA sur tir) ────────────
            // Préparation de baseFovTarget avec Babylon.js.
            var baseFovTarget = BABYLON.Scalar.Lerp(0.70, 0.58, intensity);

            // Vérification avant d'exécuter la suite.
            if (state.kickZoom) {
                // Valeur mémorisée dans kz.
                var kz = state.kickZoom;
                // Vérification avant d'exécuter la suite.
                if (kz.phase === "zoomIn") {
                    // Zoom avant rapide
                    // Valeur mémorisée dans zoomInT.
                    var zoomInT = 1 - Math.exp(-18 * dt);
                    // Mise à jour de fov.
                    cam.fov = BABYLON.Scalar.Lerp(cam.fov, kz.targetFov, zoomInT);
                    // Vérification avant d'exécuter la suite.
                    if (Math.abs(cam.fov - kz.targetFov) < 0.015) kz.phase = "hold";
                // Deuxième possibilité à tester.
                } else if (kz.phase === "hold") {
                    // Maintien bref du zoom
                    // Instruction nécessaire au déroulement de cette partie.
                    kz.holdTimer += dt;
                    // Vérification avant d'exécuter la suite.
                    if (kz.holdTimer >= kz.holdDuration) kz.phase = "zoomOut";
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Retour doux au FOV normal
                    // Valeur mémorisée dans zoomOutT.
                    var zoomOutT = 1 - Math.exp(-2.5 * dt);
                    // Mise à jour de fov.
                    cam.fov = BABYLON.Scalar.Lerp(cam.fov, baseFovTarget, zoomOutT);
                    // Vérification avant d'exécuter la suite.
                    if (Math.abs(cam.fov - baseFovTarget) < 0.008) state.kickZoom = null;
                // Fermeture du bloc ou de l'appel.
                }
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Mise à jour de fov.
                cam.fov = BABYLON.Scalar.Lerp(cam.fov, baseFovTarget, t);
            // Fermeture du bloc ou de l'appel.
            }

            // ── 7. ROTATION avec micro-drift (caméra vivante) ────────────────────
            // Valeur mémorisée dans alphaBase.
            var alphaBase = -Math.PI / 2;
            // Valeur mémorisée dans betaBase.
            var betaBase  = 0.88;  // was 1.05 : aligné avec le nouveau positionnement broadcast
            // Mise à jour de alpha.
            cam.alpha = BABYLON.Scalar.Lerp(cam.alpha, alphaBase, t);
            // Mise à jour de beta.
            cam.beta  = BABYLON.Scalar.Lerp(cam.beta,  betaBase,  t);

            // Micro mouvement TV — sensation de caméra épaule en direct
            // Appel de sin pour appliquer l'action prévue.
            cam.alpha += Math.sin(state.time * 0.2) * 0.0008;
            // Appel de cos pour appliquer l'action prévue.
            cam.beta  += Math.cos(state.time * 0.15) * 0.0005;
        // Fermeture du bloc ou de l'appel.
        }

        // Alias interne pour rétro-compat avec l'ancienne signature
        // Fonction updateBroadcastCinematic : elle regroupe le traitement de cette partie.
        function updateBroadcastCinematic(activePlayer, ballArg, playerMoveVelocity, gameplayPaused) {
            // Appel de updateBroadcastCamera pour appliquer l'action prévue.
            updateBroadcastCamera(activePlayer, ballArg, gameplayPaused);
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // GESTION INTENSITÉ (rétro-compat goalReplay / matchFlow)
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction setActionIntensity : elle regroupe le traitement de cette partie.
        function setActionIntensity(typeOrValue) {
            // Vérification avant d'exécuter la suite.
            if (typeOrValue === "goal") {
                // Mise à jour de intensity.
                cameraBrain.intensity = 1;
            // Deuxième possibilité à tester.
            } else if (typeOrValue === "shot") {
                // Mise à jour de intensity.
                cameraBrain.intensity = Math.max(cameraBrain.intensity, 0.7);
            // Deuxième possibilité à tester.
            } else if (typeOrValue === "duel") {
                // Mise à jour de intensity.
                cameraBrain.intensity = Math.max(cameraBrain.intensity, 0.55);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // TPS + 3e personne — vue du haut
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction updateCameraFollow : elle regroupe le traitement de cette partie.
        function updateCameraFollow(activePlayer) {
            // Vérification avant d'exécuter la suite.
            if (!scene || !cameras || !activePlayer || !cameras.cameraTargetNode) return;

            // Suivi joueur fluide classique pour la caméra TPS / 3e personne.
            // Vérification avant d'exécuter la suite.
            if (scene.activeCamera === cameras.tpsCamera || scene.activeCamera === cameras.thirdPersonCamera) {
                // Préparation de lerped avec Babylon.js.
                var lerped = BABYLON.Vector3.Lerp(
                    // Paramètre de l'appel ou valeur de configuration.
                    cameras.cameraTargetNode.position,
                    // Paramètre de l'appel ou valeur de configuration.
                    activePlayer.position,
                    // Instruction nécessaire au déroulement de cette partie.
                    0.12
                // Fermeture du bloc ou de l'appel.
                );
                // Appel de copyFrom pour appliquer l'action prévue.
                cameras.cameraTargetNode.position.copyFrom(lerped);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // FPV CAMERA — INCHANGÉE (touche C)
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction handleCameraToggle : elle regroupe le traitement de cette partie.
        function handleCameraToggle(activePlayer) {
            // Appel de setTimeout pour appliquer l'action prévue.
            window.setTimeout(function () {
                // Vérification avant d'exécuter la suite.
                if (!cameras || typeof cameras.alignFpvToDirection !== "function") return;
                // Vérification avant d'exécuter la suite.
                if (!activePlayer || !activePlayer.facingDirection) return;
                // Appel de alignFpvToDirection pour appliquer l'action prévue.
                cameras.alignFpvToDirection(activePlayer.facingDirection);
            // Instruction nécessaire au déroulement de cette partie.
            }, 0);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction updateFpvState : elle regroupe le traitement de cette partie.
        function updateFpvState(activePlayer) {
            // Vérification avant d'exécuter la suite.
            if (!myTeam || !myTeam.players) return;
            // Appel de forEach pour appliquer l'action prévue.
            myTeam.players.forEach(function (player) {
                // Vérification avant d'exécuter la suite.
                if (player) player.isInFpv = false;
            // Fermeture du bloc ou de l'appel.
            });
            // Vérification avant d'exécuter la suite.
            if (scene && cameras && scene.activeCamera === cameras.fpvCamera && activePlayer) {
                // Mise à jour de isInFpv.
                activePlayer.isInFpv = true;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // INDICATEUR DE SÉLECTION
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction updateSelectionIndicator : elle regroupe le traitement de cette partie.
        function updateSelectionIndicator(activePlayer) {
            // Vérification avant d'exécuter la suite.
            if (!selectionIndicator || !cameras || !scene || !activePlayer) return;
            // Valeur mémorisée dans showIndicator.
            var showIndicator = scene.activeCamera !== cameras.fpvCamera;
            // Appel de setEnabled pour appliquer l'action prévue.
            selectionIndicator.setEnabled(showIndicator);
            // Valeur mémorisée dans stamina.
            var stamina  = activePlayer.stamina !== undefined ? activePlayer.stamina : 1;
            // Valeur mémorisée dans minScale.
            var minScale = 0.25;
            // Valeur mémorisée dans maxScale.
            var maxScale = 1.0;
            // Mise à jour de y.
            selectionIndicator.scaling.y = minScale + (maxScale - minScale) * stamina;
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // AXES DE DÉPLACEMENT (calcul selon caméra active)
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction computeMoveAxes : elle regroupe le traitement de cette partie.
        function computeMoveAxes(input) {
            // Valeur mémorisée dans moveX.
            var moveX = 0;
            // Valeur mémorisée dans moveZ.
            var moveZ = 0;

            // Vérification avant d'exécuter la suite.
            if (!scene || !cameras || !input) return { moveX: moveX, moveZ: moveZ };

            // Vérification avant d'exécuter la suite.
            if (
                // Mise à jour de activeCamera.
                scene.activeCamera === cameras.tpsCamera ||
                // Mise à jour de activeCamera.
                scene.activeCamera === cameras.thirdPersonCamera
            // Ouverture du bloc correspondant.
            ) {
                // Vérification avant d'exécuter la suite.
                if (input.forward)  moveX += 1;
                // Vérification avant d'exécuter la suite.
                if (input.backward) moveX -= 1;
                // Vérification avant d'exécuter la suite.
                if (input.left)     moveZ += 1;
                // Vérification avant d'exécuter la suite.
                if (input.right)    moveZ -= 1;
                // Résultat renvoyé par la fonction.
                return { moveX: moveX, moveZ: moveZ };
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (scene.activeCamera === cameras.broadcastCamera) {
                // Valeur mémorisée dans cam.
                var cam = cameras.broadcastCamera;

                // Mapping "flèches directionnelles" écran pour la broadcast :
                // - droite/gauche clavier => droite/gauche à l'écran
                // - z/s clavier          => haut/bas à l'écran
                // Valeur mémorisée dans alpha.
                var alpha = cam.alpha;

                // Droite écran
                // Création de screenRight.
                var screenRight = new BABYLON.Vector3(
                    // Appel de cos pour appliquer l'action prévue.
                    Math.cos(alpha + Math.PI / 2),
                    // Paramètre de l'appel ou valeur de configuration.
                    0,
                    // Appel de sin pour appliquer l'action prévue.
                    Math.sin(alpha + Math.PI / 2)
                // Fermeture du bloc ou de l'appel.
                );

                // Haut écran (opposé au "right" local caméra)
                // Création de screenUp.
                var screenUp = new BABYLON.Vector3(
                    // Appel de cos pour appliquer l'action prévue.
                    -Math.cos(alpha),
                    // Paramètre de l'appel ou valeur de configuration.
                    0,
                    // Appel de sin pour appliquer l'action prévue.
                    -Math.sin(alpha)
                // Fermeture du bloc ou de l'appel.
                );

                // Préparation de moveVector avec Babylon.js.
                var moveVector = BABYLON.Vector3.Zero();
                // Vérification avant d'exécuter la suite.
                if (input.right)    moveVector.addInPlace(screenRight);
                // Vérification avant d'exécuter la suite.
                if (input.left)     moveVector.subtractInPlace(screenRight);
                // Vérification avant d'exécuter la suite.
                if (input.forward)  moveVector.addInPlace(screenUp);
                // Vérification avant d'exécuter la suite.
                if (input.backward) moveVector.subtractInPlace(screenUp);

                // Vérification avant d'exécuter la suite.
                if (moveVector.lengthSquared() > 0) {
                    // Appel de normalize pour appliquer l'action prévue.
                    moveVector.normalize();
                    // Instruction nécessaire au déroulement de cette partie.
                    moveX = moveVector.x;
                    // Instruction nécessaire au déroulement de cette partie.
                    moveZ = moveVector.z;
                // Fermeture du bloc ou de l'appel.
                }

                // Résultat renvoyé par la fonction.
                return { moveX: moveX, moveZ: moveZ };
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (scene.activeCamera === cameras.fpvCamera) {
                // Valeur mémorisée dans forward.
                var forward = cameras.fpvCamera.getForwardRay().direction.clone();
                // Mise à jour de y.
                forward.y = 0;
                // Appel de normalize pour appliquer l'action prévue.
                forward.normalize();

                // Création de right.
                var right = new BABYLON.Vector3(forward.z, 0, -forward.x);
                // Appel de normalize pour appliquer l'action prévue.
                right.normalize();

                // Préparation de moveVector avec Babylon.js.
                var moveVector = BABYLON.Vector3.Zero();
                // Vérification avant d'exécuter la suite.
                if (input.forward)  moveVector.addInPlace(forward);
                // Vérification avant d'exécuter la suite.
                if (input.backward) moveVector.subtractInPlace(forward);
                // Vérification avant d'exécuter la suite.
                if (input.right)    moveVector.addInPlace(right);
                // Vérification avant d'exécuter la suite.
                if (input.left)     moveVector.subtractInPlace(right);

                // Vérification avant d'exécuter la suite.
                if (moveVector.lengthSquared() > 0) {
                    // Appel de normalize pour appliquer l'action prévue.
                    moveVector.normalize();
                    // Instruction nécessaire au déroulement de cette partie.
                    moveX = moveVector.x;
                    // Instruction nécessaire au déroulement de cette partie.
                    moveZ = moveVector.z;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return { moveX: moveX, moveZ: moveZ };
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction syncTargetToActivePlayer : elle regroupe le traitement de cette partie.
        function syncTargetToActivePlayer(activePlayer) {
            // Vérification avant d'exécuter la suite.
            if (!activePlayer || !activePlayer.position) return;
            // Vérification avant d'exécuter la suite.
            if (cameras?.cameraTargetNode) {
                // Appel de copyFrom pour appliquer l'action prévue.
                cameras.cameraTargetNode.position.copyFrom(activePlayer.position);
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (state.cameraRig) {
                // Appel de copyFrom pour appliquer l'action prévue.
                state.cameraRig.position.copyFrom(activePlayer.position);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // BOUCLE PRINCIPALE
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction update : elle regroupe le traitement de cette partie.
        function update(activePlayer, ballArg, playerMoveVelocity, gameplayPaused) {
            // Valeur mémorisée dans dt.
            var dt = scene ? scene.getEngine().getDeltaTime() / 1000 : 0;

            // Appel de updateCameraFollow pour appliquer l'action prévue.
            updateCameraFollow(activePlayer);                                    // TPS uniquement
            // Appel de updateBroadcastCamera pour appliquer l'action prévue.
            updateBroadcastCamera(activePlayer, ballArg, gameplayPaused);        // Broadcast FIFA
            // Appel de applyShake pour appliquer l'action prévue.
            applyShake(cameras ? cameras.broadcastCamera : null, dt);            // Shake broadcast
            // Appel de updateFpvState pour appliquer l'action prévue.
            updateFpvState(activePlayer);                                        // FPV uniquement
            // Appel de updateSelectionIndicator pour appliquer l'action prévue.
            updateSelectionIndicator(activePlayer);
        // Fermeture du bloc ou de l'appel.
        }

        // ═════════════════════════════════════════════════════════════════════════
        // LISTENERS ÉVÉNEMENTS
        // ═════════════════════════════════════════════════════════════════════════

        // Fonction handleGoalEvent : elle regroupe le traitement de cette partie.
        function handleGoalEvent() {
            // Appel de triggerShake pour appliquer l'action prévue.
            triggerShake(0.01);
            // Appel de setActionIntensity pour appliquer l'action prévue.
            setActionIntensity("goal");
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction handleCameraActionEvent : elle regroupe le traitement de cette partie.
        function handleCameraActionEvent(evt) {
            // Valeur mémorisée dans type.
            var type = (evt && evt.detail && evt.detail.type) ? evt.detail.type
                     // Instruction nécessaire au déroulement de cette partie.
                     : (evt && typeof evt.detail === "string")  ? evt.detail
                     // Instruction nécessaire au déroulement de cette partie.
                     : "normal";
            // Appel de setActionIntensity pour appliquer l'action prévue.
            setActionIntensity(type);
            // Vérification avant d'exécuter la suite.
            if (type === "shot") triggerShake(0.004);
            // Vérification avant d'exécuter la suite.
            if (type === "duel") triggerShake(0.002);
        // Fermeture du bloc ou de l'appel.
        }

        // Nouvel événement universel cam:event (architecture FIFA)
        // Fonction handleCamEvent : elle regroupe le traitement de cette partie.
        function handleCamEvent(e) {
            // Valeur mémorisée dans detail.
            var detail = (e && e.detail) ? e.detail : "";
            // Format objet : { type, force } — envoyé par gameLogic.kick()
            // Valeur mémorisée dans type.
            var type  = (typeof detail === "object" && detail.type) ? detail.type : detail;
            // Valeur mémorisée dans force.
            var force = (typeof detail === "object" && detail.force) ? detail.force : 0;

            // Vérification avant d'exécuter la suite.
            if (type === "goal") { triggerShake(0.01);  setActionIntensity("goal"); }
            // Vérification avant d'exécuter la suite.
            if (type === "shot") {
                // Appel de triggerShake pour appliquer l'action prévue.
                triggerShake(0.004);
                // Appel de setActionIntensity pour appliquer l'action prévue.
                setActionIntensity("shot");
                // Zoom FIFA : normalise la force (forces usuelles : 8, 15, 25)
                // Préparation de normalizedPower avec Babylon.js.
                var normalizedPower = BABYLON.Scalar.Clamp(force / 25, 0, 1);
                // Appel de triggerKickZoom pour appliquer l'action prévue.
                triggerKickZoom(normalizedPower);
            // Fermeture du bloc ou de l'appel.
            }
            // Vérification avant d'exécuter la suite.
            if (type === "duel") { triggerShake(0.002); setActionIntensity("duel"); }
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction setZoomOffset : elle regroupe le traitement de cette partie.
        function setZoomOffset(offset) {
            // Mise à jour de userZoomOffset.
            state.userZoomOffset = Math.max(0, Number(offset) || 0);
        // Fermeture du bloc ou de l'appel.
        }

        // Fonction getZoomOffset : elle regroupe le traitement de cette partie.
        function getZoomOffset() {
            // Résultat renvoyé par la fonction.
            return state.userZoomOffset;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de setupBroadcastRig pour appliquer l'action prévue.
        setupBroadcastRig();
        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("match:goal",       handleGoalEvent);
        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("gow:cameraAction", handleCameraActionEvent);
        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("cam:event",        handleCamEvent);

        // Appel de add pour appliquer l'action prévue.
        scene.onDisposeObservable.add(function () {
            // Appel de removeEventListener pour appliquer l'action prévue.
            window.removeEventListener("match:goal",       handleGoalEvent);
            // Appel de removeEventListener pour appliquer l'action prévue.
            window.removeEventListener("gow:cameraAction", handleCameraActionEvent);
            // Appel de removeEventListener pour appliquer l'action prévue.
            window.removeEventListener("cam:event",        handleCamEvent);
        // Fermeture du bloc ou de l'appel.
        });

        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            handleCameraToggle,
            // Paramètre de l'appel ou valeur de configuration.
            computeMoveAxes,
            // Paramètre de l'appel ou valeur de configuration.
            syncTargetToActivePlayer,
            // Paramètre de l'appel ou valeur de configuration.
            update,
            // Paramètre de l'appel ou valeur de configuration.
            updateCameraFollow,
            // Paramètre de l'appel ou valeur de configuration.
            updateBroadcastCinematic,
            // Paramètre de l'appel ou valeur de configuration.
            updateFpvState,
            // Paramètre de l'appel ou valeur de configuration.
            updateSelectionIndicator,
            // Paramètre de l'appel ou valeur de configuration.
            triggerGoalShake,
            // Paramètre de l'appel ou valeur de configuration.
            setActionIntensity,
            // Paramètre de l'appel ou valeur de configuration.
            setZoomOffset,
            // Paramètre de l'appel ou valeur de configuration.
            getZoomOffset,
            // Ouverture du bloc correspondant.
            cameraBrain: {
                // Appel de intensity pour appliquer l'action prévue.
                get intensity() { return cameraBrain.intensity; },
                // Appel de target pour appliquer l'action prévue.
                get target()    { return state.cameraRig ? state.cameraRig.position : null; }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de animateCameraSwitch.
    window.animateCameraSwitch            = animateCameraSwitch;
    // Mise à jour de createCameraRuntimeController.
    window.createCameraRuntimeController  = createCameraRuntimeController;
// Instruction nécessaire au déroulement de cette partie.
})();
