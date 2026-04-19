// Fonction checkBallCollision : elle regroupe le traitement de cette partie.
function checkBallCollision(player, ball, playerFacing, team, playerMoveVelocity = null, isSprinting = false) {
    // Vérification avant d'exécuter la suite.
    if (ball.isOutAnimationPlaying || ball.isOutOfPlay) return;

    // Vérification avant d'exécuter la suite.
    if (ball.restartLocked) {
        // Mise à jour de y.
        ball.position.y = 0.75;
        // Résultat renvoyé par la fonction.
        return;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (ball.pushLockUntil && performance.now() < ball.pushLockUntil) {
        // Mise à jour de y.
        ball.position.y = 0.75;
        // Résultat renvoyé par la fonction.
        return;
    // Fermeture du bloc ou de l'appel.
    }

    // Préparation de distance avec Babylon.js.
    const distance = BABYLON.Vector3.Distance(player.position, ball.position);

    // Vérification avant d'exécuter la suite.
    if (!ball.velocity) {
        // Mise à jour de velocity.
        ball.velocity = new BABYLON.Vector3(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (distance < 2) {

        // joueur actif uniquement
        // Vérification avant d'exécuter la suite.
        if (team && team.isPlayerControlled && player !== team.activePlayer) {
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de lastKicker.
        ball.lastKicker = player;
        // Mise à jour de lastTouchTeam.
        ball.lastTouchTeam = team;

        // Création de pushDir.
        const pushDir = new BABYLON.Vector3(playerFacing.x, 0, playerFacing.z);

        // Vérification avant d'exécuter la suite.
        if (pushDir.lengthSquared() > 0) {
            // Appel de normalize pour appliquer l'action prévue.
            pushDir.normalize();

            // MODE 1 : DRIBBLE (balle collée)
            // Vérification avant d'exécuter la suite.
            if (!isSprinting) {

                // Position idéale juste devant le joueur
                // Valeur mémorisée dans desiredPos.
                const desiredPos = player.position.add(pushDir.scale(1.2));

                // interpolation douce → effet FIFA clean
                // Mise à jour de x.
                ball.position.x = BABYLON.Scalar.Lerp(ball.position.x, desiredPos.x, 0.5);
                // Mise à jour de z.
                ball.position.z = BABYLON.Scalar.Lerp(ball.position.z, desiredPos.z, 0.5);

                // IMPORTANT → on stop la vitesse sinon ça glisse
                // Appel de set pour appliquer l'action prévue.
                ball.velocity.set(0, 0, 0);
            // Fermeture du bloc ou de l'appel.
            }

            //MODE 2 : SPRINT (poussée)
            // Cas utilisé quand les tests précédents échouent.
            else {

                // Valeur mémorisée dans moveBoost.
                let moveBoost = 0;

                // Vérification avant d'exécuter la suite.
                if (playerMoveVelocity) {
                    // Création de horizontalMove.
                    const horizontalMove = new BABYLON.Vector3(
                        // Paramètre de l'appel ou valeur de configuration.
                        playerMoveVelocity.x,
                        // Paramètre de l'appel ou valeur de configuration.
                        0,
                        // Instruction nécessaire au déroulement de cette partie.
                        playerMoveVelocity.z
                    // Fermeture du bloc ou de l'appel.
                    );

                    // Appel de length pour appliquer l'action prévue.
                    moveBoost = horizontalMove.length() * 18;
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans basePushSpeed.
                const basePushSpeed = 6;
                // Valeur mémorisée dans targetSpeed.
                const targetSpeed = Math.min(basePushSpeed + moveBoost, 10);

                // Valeur mémorisée dans desiredVelocity.
                const desiredVelocity = pushDir.scale(targetSpeed);

                // Valeur mémorisée dans smoothing.
                const smoothing = 0.25;

                // Mise à jour de x.
                ball.velocity.x = BABYLON.Scalar.Lerp(
                    // Paramètre de l'appel ou valeur de configuration.
                    ball.velocity.x,
                    // Paramètre de l'appel ou valeur de configuration.
                    desiredVelocity.x,
                    // Instruction nécessaire au déroulement de cette partie.
                    smoothing
                // Fermeture du bloc ou de l'appel.
                );

                // Mise à jour de z.
                ball.velocity.z = BABYLON.Scalar.Lerp(
                    // Paramètre de l'appel ou valeur de configuration.
                    ball.velocity.z,
                    // Paramètre de l'appel ou valeur de configuration.
                    desiredVelocity.z,
                    // Instruction nécessaire au déroulement de cette partie.
                    smoothing
                // Fermeture du bloc ou de l'appel.
                );
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de y.
    ball.position.y = 0.75;
// Fermeture du bloc ou de l'appel.
}

// Fonction tryStealBall : elle regroupe le traitement de cette partie.
function tryStealBall(defender, ball, team) {

    // Vérification avant d'exécuter la suite.
    if (!ball || !ball.position) return;

    // Valeur mémorisée dans carrier.
    const carrier = ball.lastKicker;
    // Vérification avant d'exécuter la suite.
    if (!carrier || carrier === defender) return;

    // Préparation de dist avec Babylon.js.
    const dist = BABYLON.Vector3.Distance(defender.position, ball.position);

    // Vérification avant d'exécuter la suite.
    if (dist > 2.2) return;

    // direction défenseur → balle
    // Valeur mémorisée dans toBall.
    const toBall = ball.position.subtract(defender.position);
    // Vérification avant d'exécuter la suite.
    if (toBall.lengthSquared() === 0) return;

    // Valeur mémorisée dans dirToBall.
    const dirToBall = toBall.normalize();

    // direction du porteur
    // Création de carrierDir.
    const carrierDir = carrier.facingDirection || new BABYLON.Vector3(1, 0, 0);

    // angle entre défenseur et direction du porteur
    // Préparation de dot avec Babylon.js.
    const dot = BABYLON.Vector3.Dot(dirToBall, carrierDir);

    // vitesse du défenseur (approx)
    // Valeur mémorisée dans speedFactor.
    let speedFactor = 0;
    // Vérification avant d'exécuter la suite.
    if (defender._lastPosition) {
        // Valeur mémorisée dans velocity.
        const velocity = defender.position.subtract(defender._lastPosition);
        // Appel de length pour appliquer l'action prévue.
        speedFactor = velocity.length();
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de _lastPosition.
    defender._lastPosition = defender.position.clone();

    // conditions réalistes
    // Valeur mémorisée dans isBehind.
    const isBehind = dot > 0.5;
    // Valeur mémorisée dans isSideOrFront.
    const isSideOrFront = dot < 0.3;

    // Vérification avant d'exécuter la suite.
    if (isBehind) return;

    // Vérification avant d'exécuter la suite.
    if (isSideOrFront || speedFactor > 0.05) {

        // transfert de possession
        // Mise à jour de lastKicker.
        ball.lastKicker = defender;
        // Mise à jour de lastTouchTeam.
        ball.lastTouchTeam = team;

        // direction de vol de balle
        // Valeur mémorisée dans stealDir.
        const stealDir = dirToBall.scale(6);

        // Mise à jour de x.
        ball.velocity.x = stealDir.x;
        // Mise à jour de z.
        ball.velocity.z = stealDir.z;

        // petit délai pour éviter re-collision immédiate
        // Mise à jour de pushLockUntil.
        ball.pushLockUntil = performance.now() + 150;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction kick : elle regroupe le traitement de cette partie.
function kick(scene, ball, player, lastDirection, force, team) {

    // Mise à jour de lastBallPlayer.
    team.lastBallPlayer = player;
    // Appel de lockAutoSwitch pour appliquer l'action prévue.
    team.lockAutoSwitch(500);

    // Vérification avant d'exécuter la suite.
    if (team && team.isPlayerControlled) {
        // Appel de lockTeamPossession pour appliquer l'action prévue.
        team.lockTeamPossession(1550);
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Appel de lockTeamPossession pour appliquer l'action prévue.
        team.lockTeamPossession(180);
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de lastKicker.
    ball.lastKicker = player;
    // Mise à jour de lastTouchTeam.
    ball.lastTouchTeam = team;
    // Mise à jour de pushLockUntil.
    ball.pushLockUntil = performance.now() + 380;
    // Mise à jour de ignorePlayerCollisionUntil.
    ball.ignorePlayerCollisionUntil = performance.now() + 380;
    
    // Préparation de distance avec Babylon.js.
    const distance = BABYLON.Vector3.Distance(
        // Paramètre de l'appel ou valeur de configuration.
        player.position,
        // Instruction nécessaire au déroulement de cette partie.
        ball.position
    // Fermeture du bloc ou de l'appel.
    );

    // Vérification avant d'exécuter la suite.
    if (distance > 3) {
        // Résultat renvoyé par la fonction.
        return;
    // Fermeture du bloc ou de l'appel.
    }

    // Direction horizontale normalisée du tir
    // Création de dir.
    const dir = new BABYLON.Vector3(lastDirection.x, 0, lastDirection.z);
    // Vérification avant d'exécuter la suite.
    if (dir.lengthSquared() === 0) {
        // Résultat renvoyé par la fonction.
        return;
    // Fermeture du bloc ou de l'appel.
    }
    // Valeur mémorisée dans dirNorm.
    const dirNorm = dir.normalize();

    // 🔊 Son de tir
    // Vérification avant d'exécuter la suite.
    if (window.kickSound) window.kickSound.play();

    // 📷 Zoom caméra FIFA — plus le tir est fort, plus ça zoome
    // Appel de dispatchEvent pour appliquer l'action prévue.
    window.dispatchEvent(new CustomEvent("cam:event", {
        // Instruction nécessaire au déroulement de cette partie.
        detail: { type: "shot", force: force }
    // Fermeture du bloc ou de l'appel.
    }));

    // On utilise une physique simple : vitesse initiale proportionnelle à la force
    // L'unité correspond à des unités de terrain / seconde (le dt est géré dans script.js)
    // Réduction un peu plus forte pour des tirs moins longs
    // Valeur mémorisée dans speed.
    const speed = force * 0.8; // légèrement moins de portée

    // Vérification avant d'exécuter la suite.
    if (!ball.velocity) {
        // Mise à jour de velocity.
        ball.velocity = new BABYLON.Vector3(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // On annule toute ancienne animation Babylon éventuellement en cours
    // Appel de stopAnimation pour appliquer l'action prévue.
    scene.stopAnimation(ball);

    // --- Animation procédurale de Frappe (Recul puis Frappe) ---
    // Vérification avant d'exécuter la suite.
    if (player.model) {
        // Enregistrer la rotation de base
        // Valeur mémorisée dans baseRotX.
        const baseRotX = player.model.rotation.x; // Généralement -PI/2
        
        // Créer l'animation de recul (wind-up) puis de frappe (snap)
        // Création de kickAnim.
        const kickAnim = new BABYLON.Animation(
            // Paramètre de l'appel ou valeur de configuration.
            "kickAnim",
            // Paramètre de l'appel ou valeur de configuration.
            "rotation.x",
            // Instruction nécessaire au déroulement de cette partie.
            60, // fps
            // Paramètre de l'appel ou valeur de configuration.
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            // Instruction nécessaire au déroulement de cette partie.
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        // Fermeture du bloc ou de l'appel.
        );

        // Valeur mémorisée dans keys.
        const keys = [];
        // Frame 0 : position de départ
        // Appel de push pour appliquer l'action prévue.
        keys.push({ frame: 0, value: baseRotX });
        // Frame 15 : Le joueur se penche en arrière pour prendre de l'élan
        // Appel de push pour appliquer l'action prévue.
        keys.push({ frame: 15, value: baseRotX - 0.5 });
        // Frame 25 : Le joueur frappe violemment vers l'avant
        // Appel de push pour appliquer l'action prévue.
        keys.push({ frame: 25, value: baseRotX + 0.3 });
        // Frame 40 : Retour à la position initiale
        // Appel de push pour appliquer l'action prévue.
        keys.push({ frame: 40, value: baseRotX });

        // Appel de setKeys pour appliquer l'action prévue.
        kickAnim.setKeys(keys);
        
        // Ajouter une fonction d'easing (élastique/rebond) pour rendre la frappe dynamique
        // Création de easingFunction.
        const easingFunction = new BABYLON.CubicEase();
        // Appel de setEasingMode pour appliquer l'action prévue.
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        // Appel de setEasingFunction pour appliquer l'action prévue.
        kickAnim.setEasingFunction(easingFunction);

        // Appel de push pour appliquer l'action prévue.
        player.model.animations.push(kickAnim);

        // Lancer l'animation
        // Appel de beginDirectAnimation pour appliquer l'action prévue.
        scene.beginDirectAnimation(player.model, [kickAnim], 0, 40, false, 1.5, () => {
            // Nettoyage une fois terminé
            // Mise à jour de animations.
            player.model.animations = player.model.animations.filter(a => a.name !== "kickAnim");
        // Fermeture du bloc ou de l'appel.
        });

        // La balle part au moment de la frappe (vers la frame 20-25),
        // On met un petit délai de 200ms
        // Appel de setTimeout pour appliquer l'action prévue.
        setTimeout(() => {
            // Appel de resetBallOutState pour appliquer l'action prévue.
            resetBallOutState(ball);

            // Re-verrouille un tout petit peu la poussée au moment exact où la balle part
            // Mise à jour de pushLockUntil.
            ball.pushLockUntil = performance.now() + 220;
            // Mise à jour de ignorePlayerCollisionUntil.
            ball.ignorePlayerCollisionUntil = performance.now() + 220;
            // Mise à jour de lastKicker.
            ball.lastKicker = player;
            // Mise à jour de lastTouchTeam.
            ball.lastTouchTeam = team;

            // Petit décalage pour sortir la balle du corps du joueur
            // Instruction nécessaire au déroulement de cette partie.
            ball.position.x += dirNorm.x * 1.2;
            // Instruction nécessaire au déroulement de cette partie.
            ball.position.z += dirNorm.z * 1.2;

            // Mise à jour de velocity.
            ball.velocity = dirNorm.scale(speed);

            // Vérification avant d'exécuter la suite.
            if (window.matchAudio && typeof window.matchAudio.playKick === "function") {
                // Appel de playKick pour appliquer l'action prévue.
                window.matchAudio.playKick();
            // Fermeture du bloc ou de l'appel.
            }
        // Instruction nécessaire au déroulement de cette partie.
        }, 200);

    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Fallback si pas de modèle
        // Appel de resetBallOutState pour appliquer l'action prévue.
        resetBallOutState(ball);

        // Mise à jour de pushLockUntil.
        ball.pushLockUntil = performance.now() + 220;
        // Mise à jour de ignorePlayerCollisionUntil.
        ball.ignorePlayerCollisionUntil = performance.now() + 220;
        // Mise à jour de lastKicker.
        ball.lastKicker = player;
        // Mise à jour de lastTouchTeam.
        ball.lastTouchTeam = team;

        // Instruction nécessaire au déroulement de cette partie.
        ball.position.x += dirNorm.x * 1.2;
        // Instruction nécessaire au déroulement de cette partie.
        ball.position.z += dirNorm.z * 1.2;

        // Mise à jour de velocity.
        ball.velocity = dirNorm.scale(speed);

        // Vérification avant d'exécuter la suite.
        if (window.matchAudio && typeof window.matchAudio.playKick === "function") {
            // Appel de playKick pour appliquer l'action prévue.
            window.matchAudio.playKick();
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction createKickGauge : elle regroupe le traitement de cette partie.
function createKickGauge(scene){

    // Préparation de gauge avec Babylon.js.
    const gauge = BABYLON.MeshBuilder.CreatePlane(
        // Paramètre de l'appel ou valeur de configuration.
        "kickGauge",
        // Paramètre de l'appel ou valeur de configuration.
        {width:3,height:0.6},
        // Instruction nécessaire au déroulement de cette partie.
        scene
    // Fermeture du bloc ou de l'appel.
    );

    // orienter vers le sol
    // Mise à jour de x.
    gauge.rotation.x = Math.PI/2;

    // Création de mat.
    const mat = new BABYLON.StandardMaterial("gaugeMat",scene);

    // Création de texture.
    const texture = new BABYLON.DynamicTexture(
        // Paramètre de l'appel ou valeur de configuration.
        "gaugeTexture",
        // Paramètre de l'appel ou valeur de configuration.
        {width:256,height:64},
        // Instruction nécessaire au déroulement de cette partie.
        scene
    // Fermeture du bloc ou de l'appel.
    );

    // Mise à jour de hasAlpha.
    texture.hasAlpha = false;
    // Appel de updateSamplingMode pour appliquer l'action prévue.
    texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // Mise à jour de disableLighting.
    mat.disableLighting = true;
    // Mise à jour de emissiveTexture.
    mat.emissiveTexture = texture;
    // Mise à jour de backFaceCulling.
    mat.backFaceCulling = false;

    // Mise à jour de material.
    gauge.material = mat;

    // Mise à jour de isVisible.
    gauge.isVisible = false;

    // Préparation de cursor avec Babylon.js.
    const cursor = BABYLON.MeshBuilder.CreateBox(
        // Paramètre de l'appel ou valeur de configuration.
        "cursor",
        // Paramètre de l'appel ou valeur de configuration.
        {width:0.08,height:0.6,depth:0.1},
        // Instruction nécessaire au déroulement de cette partie.
        scene
    // Fermeture du bloc ou de l'appel.
    );

    // Mise à jour de parent.
    cursor.parent = gauge;

    // Mise à jour de cursor.
    gauge.cursor = cursor;
    // Mise à jour de texture.
    gauge.texture = texture;

    // Mise à jour de renderingGroupId.
    gauge.renderingGroupId = 2;
    // Mise à jour de renderingGroupId.
    gauge.cursor.renderingGroupId = 2;

    // Mise à jour de y.
    gauge.position.y = 0.05;

    // Résultat renvoyé par la fonction.
    return gauge;
// Fermeture du bloc ou de l'appel.
}

// Fonction drawGaugeColors : elle regroupe le traitement de cette partie.
function drawGaugeColors(gauge){

    // Valeur mémorisée dans ctx.
    const ctx = gauge.texture.getContext();

    // Valeur mémorisée dans w.
    const w = 256;
    // Valeur mémorisée dans h.
    const h = 64;

    // Appel de clearRect pour appliquer l'action prévue.
    ctx.clearRect(0,0,w,h);

    // fond noir (bordure)
    // Mise à jour de fillStyle.
    ctx.fillStyle = "black";
    // Appel de fillRect pour appliquer l'action prévue.
    ctx.fillRect(0,0,w,h);

    // Valeur mémorisée dans border.
    const border = 8;

    // fond intérieur blanc
    // Mise à jour de fillStyle.
    ctx.fillStyle = "white";
    // Appel de fillRect pour appliquer l'action prévue.
    ctx.fillRect(border,border,w-border*2,h-border*2);

    // Valeur mémorisée dans zoneWidth.
    const zoneWidth = (w-border*2)/3;

    // zones couleur
    // Mise à jour de fillStyle.
    ctx.fillStyle = "#22c55e";
    // Appel de fillRect pour appliquer l'action prévue.
    ctx.fillRect(border,border,zoneWidth,h-border*2);

    // Mise à jour de fillStyle.
    ctx.fillStyle = "#fb923c";
    // Appel de fillRect pour appliquer l'action prévue.
    ctx.fillRect(border+zoneWidth,border,zoneWidth,h-border*2);

    // Mise à jour de fillStyle.
    ctx.fillStyle = "#ef4444";
    // Appel de fillRect pour appliquer l'action prévue.
    ctx.fillRect(border+zoneWidth*2,border,zoneWidth,h-border*2);

    // séparateurs noirs
    // Mise à jour de fillStyle.
    ctx.fillStyle = "black";
    // Appel de fillRect pour appliquer l'action prévue.
    ctx.fillRect(border+zoneWidth-2,border,4,h-border*2);
    // Appel de fillRect pour appliquer l'action prévue.
    ctx.fillRect(border+zoneWidth*2-2,border,4,h-border*2);

    // Appel de update pour appliquer l'action prévue.
    gauge.texture.update();
// Fermeture du bloc ou de l'appel.
}

// Fonction positionGauge : elle regroupe le traitement de cette partie.
function positionGauge(gauge, player, direction){

    // Valeur mémorisée dans offset.
    const offset = 2;

    // Valeur mémorisée dans dir.
    const dir = direction.normalize();

    // Valeur mémorisée dans pos.
    const pos = player.position.subtract(dir.scale(offset));

    // Mise à jour de x.
    gauge.position.x = pos.x;
    // Mise à jour de z.
    gauge.position.z = pos.z;
    // Mise à jour de y.
    gauge.position.y = 0.1;

    // Valeur mémorisée dans angle.
    const angle = Math.atan2(dir.x,dir.z);

    // Mise à jour de y.
    gauge.rotation.y = angle;
// Fermeture du bloc ou de l'appel.
}

// Fonction updateKickGauge : elle regroupe le traitement de cette partie.
function updateKickGauge(gauge, player, direction, time){

    // Appel de positionGauge pour appliquer l'action prévue.
    positionGauge(gauge,player,direction);

    // Valeur mémorisée dans speed.
    const speed = 3;

    // Vérification avant d'exécuter la suite.
    if(!gauge.started){
        // Mise à jour de startTime.
        gauge.startTime = time;
        // Mise à jour de started.
        gauge.started = true;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans value.
    const value = (Math.sin((time - gauge.startTime)*speed - Math.PI/2)+1)/2;
    
    // Valeur mémorisée dans gaugeWidth.
    const gaugeWidth = 3;
    // Mise à jour de x.
    gauge.cursor.position.x = (value-0.5)*gaugeWidth;

    // Mise à jour de currentValue.
    gauge.currentValue = value;

    // Mise à jour de isVisible.
    gauge.isVisible = true;
    // Mise à jour de isVisible.
    gauge.cursor.isVisible = true;
// Fermeture du bloc ou de l'appel.
}

// Fonction computeKickPower : elle regroupe le traitement de cette partie.
function computeKickPower(gauge){

    // Valeur mémorisée dans value.
    const value = gauge.currentValue;

    // Vérification avant d'exécuter la suite.
    if(value < 0.33)
        // Résultat renvoyé par la fonction.
        return 25; // vert

    // Vérification avant d'exécuter la suite.
    if(value < 0.66)
        // Résultat renvoyé par la fonction.
        return 45; // orange

    // Résultat renvoyé par la fonction.
    return 55; // rouge
// Fermeture du bloc ou de l'appel.
}

// Fonction hideKickGauge : elle regroupe le traitement de cette partie.
function hideKickGauge(gauge){

    // Mise à jour de isVisible.
    gauge.isVisible = false;
    // Mise à jour de isVisible.
    gauge.cursor.isVisible = false;

    // Mise à jour de started.
    gauge.started = false;
// Fermeture du bloc ou de l'appel.
}

// Fonction isBallOutOfBounds : elle regroupe le traitement de cette partie.
function isBallOutOfBounds(ball) {
    // Valeur mémorisée dans minX.
    let minX = -49;
    // Valeur mémorisée dans maxX.
    let maxX = 49;
    // Valeur mémorisée dans minZ.
    const minZ = -29;
    // Valeur mémorisée dans maxZ.
    const maxZ = 29;

    // Derrière les buts, on laisse un peu plus de profondeur
    // Vérification avant d'exécuter la suite.
    if (ball.position.z > -7.5 && ball.position.z < 7.5) {
        // Instruction nécessaire au déroulement de cette partie.
        minX = -54;
        // Instruction nécessaire au déroulement de cette partie.
        maxX = 54;
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return (
        // Instruction nécessaire au déroulement de cette partie.
        ball.position.x < minX ||
        // Instruction nécessaire au déroulement de cette partie.
        ball.position.x > maxX ||
        // Instruction nécessaire au déroulement de cette partie.
        ball.position.z < minZ ||
        // Instruction nécessaire au déroulement de cette partie.
        ball.position.z > maxZ
    // Fermeture du bloc ou de l'appel.
    );
// Fermeture du bloc ou de l'appel.
}

// Fonction startBallOutAnimation : elle regroupe le traitement de cette partie.
function startBallOutAnimation(ball) {
    // Vérification avant d'exécuter la suite.
    if (ball.isOutAnimationPlaying || ball.isOutOfPlay) return;

    // Mise à jour de isOutAnimationPlaying.
    ball.isOutAnimationPlaying = true;
    // Mise à jour de outAnimationFinished.
    ball.outAnimationFinished = false;
    // Mise à jour de outTimer.
    ball.outTimer = 0;
    // Mise à jour de outFallDelay.
    ball.outFallDelay = 0.18; // petit délai avant de commencer à tomber

    // Vérification avant d'exécuter la suite.
    if (!ball.velocity) {
        // Mise à jour de velocity.
        ball.velocity = new BABYLON.Vector3(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // Création de outDir.
    let outDir = new BABYLON.Vector3(ball.velocity.x, 0, ball.velocity.z);

    // Si la balle sort presque sans vitesse (cas poussée),
    // on déduit la direction selon le bord franchi
    // Vérification avant d'exécuter la suite.
    if (outDir.lengthSquared() < 0.0001) {
        // Appel de Zero pour appliquer l'action prévue.
        outDir = BABYLON.Vector3.Zero();

        // Valeur mémorisée dans minX.
        let minX = -49;
        // Valeur mémorisée dans maxX.
        let maxX = 49;
        // Valeur mémorisée dans minZ.
        const minZ = -29;
        // Valeur mémorisée dans maxZ.
        const maxZ = 29;

        // Vérification avant d'exécuter la suite.
        if (ball.position.z > -7.5 && ball.position.z < 7.5) {
            // Instruction nécessaire au déroulement de cette partie.
            minX = -54;
            // Instruction nécessaire au déroulement de cette partie.
            maxX = 54;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (ball.position.x < minX) outDir.x = -1;
        // Deuxième possibilité à tester.
        else if (ball.position.x > maxX) outDir.x = 1;

        // Vérification avant d'exécuter la suite.
        if (ball.position.z < minZ) outDir.z = -1;
        // Deuxième possibilité à tester.
        else if (ball.position.z > maxZ) outDir.z = 1;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (outDir.lengthSquared() > 0) {
        // Appel de normalize pour appliquer l'action prévue.
        outDir.normalize();
    // Fermeture du bloc ou de l'appel.
    }

    // minimum de mouvement horizontal pour voir la sortie
    // Valeur mémorisée dans horizontalSpeed.
    const horizontalSpeed = Math.max(ball.velocity.length() * 0.65, 4.2);

    // Mise à jour de outVelocity.
    ball.outVelocity = new BABYLON.Vector3(
        // Paramètre de l'appel ou valeur de configuration.
        outDir.x * horizontalSpeed,
        // Paramètre de l'appel ou valeur de configuration.
        0,
        // Instruction nécessaire au déroulement de cette partie.
        outDir.z * horizontalSpeed
    // Fermeture du bloc ou de l'appel.
    );

    // On coupe la physique normale
    // Appel de set pour appliquer l'action prévue.
    ball.velocity.set(0, 0, 0);
// Fermeture du bloc ou de l'appel.
}

// Fonction updateBallOutAnimation : elle regroupe le traitement de cette partie.
function updateBallOutAnimation(ball, dt) {
    // Vérification avant d'exécuter la suite.
    if (!ball.isOutAnimationPlaying) return;

    // Instruction nécessaire au déroulement de cette partie.
    ball.outTimer += dt;

    // Glissement horizontal toujours présent
    // Instruction nécessaire au déroulement de cette partie.
    ball.outVelocity.x *= 0.975;
    // Instruction nécessaire au déroulement de cette partie.
    ball.outVelocity.z *= 0.975;

    // Pendant un très court instant, la balle glisse sans tomber
    // Vérification avant d'exécuter la suite.
    if (ball.outTimer >= ball.outFallDelay) {
        // Instruction nécessaire au déroulement de cette partie.
        ball.outVelocity.y -= 14 * dt;
    // Fermeture du bloc ou de l'appel.
    }

    // Instruction nécessaire au déroulement de cette partie.
    ball.position.x += ball.outVelocity.x * dt;
    // Instruction nécessaire au déroulement de cette partie.
    ball.position.y += ball.outVelocity.y * dt;
    // Instruction nécessaire au déroulement de cette partie.
    ball.position.z += ball.outVelocity.z * dt;

    // on laisse un peu plus de temps visible
    // Valeur mémorisée dans minVisibleTime.
    const minVisibleTime = 0.60;

    // Vérification avant d'exécuter la suite.
    if (ball.outTimer >= minVisibleTime && ball.position.y < -8) {
        // Mise à jour de isOutAnimationPlaying.
        ball.isOutAnimationPlaying = false;
        // Mise à jour de outAnimationFinished.
        ball.outAnimationFinished = true;
        // Mise à jour de isOutOfPlay.
        ball.isOutOfPlay = true;

        // Appel de set pour appliquer l'action prévue.
        ball.outVelocity.set(0, 0, 0);

        // Vérification avant d'exécuter la suite.
        if (ball.velocity) {
            // Appel de set pour appliquer l'action prévue.
            ball.velocity.set(0, 0, 0);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de setBallVisibility pour appliquer l'action prévue.
        setBallVisibility(ball, false);
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction setBallVisibility : elle regroupe le traitement de cette partie.
function setBallVisibility(ball, visible) {
    // Vérification avant d'exécuter la suite.
    if (!ball) return;

    // Vérification avant d'exécuter la suite.
    if ("isVisible" in ball) {
        // Mise à jour de isVisible.
        ball.isVisible = visible;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (ball.getChildMeshes) {
        // Valeur mémorisée dans childMeshes.
        const childMeshes = ball.getChildMeshes();
        // Appel de forEach pour appliquer l'action prévue.
        childMeshes.forEach(mesh => {
            // Mise à jour de isVisible.
            mesh.isVisible = visible;
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction resetBallOutState : elle regroupe le traitement de cette partie.
function resetBallOutState(ball) {
    // Mise à jour de isOutAnimationPlaying.
    ball.isOutAnimationPlaying = false;
    // Mise à jour de outAnimationFinished.
    ball.outAnimationFinished = false;
    // Mise à jour de isOutOfPlay.
    ball.isOutOfPlay = false;
    // Mise à jour de outTimer.
    ball.outTimer = 0;
    // Mise à jour de outFallDelay.
    ball.outFallDelay = 0;
    // Mise à jour de outVelocity.
    ball.outVelocity = new BABYLON.Vector3(0, 0, 0);

    // Appel de setBallVisibility pour appliquer l'action prévue.
    setBallVisibility(ball, true);
// Fermeture du bloc ou de l'appel.
}