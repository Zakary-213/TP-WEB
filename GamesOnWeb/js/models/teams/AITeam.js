// Classe AITeam : elle sert de modèle pour cet élément du jeu.
class AITeam extends Team {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene, name, color, meshIndex = 2) {
        // Appel de super pour appliquer l'action prévue.
        super(scene, name, color, false, meshIndex);

        // Mise à jour de aiImplemented pour cet objet.
        this.aiImplemented = true;
        // Mise à jour de ballChaser pour cet objet.
        this.ballChaser = null;
        // Mise à jour de pressRadius pour cet objet.
        this.pressRadius = 30;

        // Mise à jour de aiControlledPlayer pour cet objet.
        this.aiControlledPlayer = null;
        // Mise à jour de goalkeeperLocked pour cet objet.
        this.goalkeeperLocked = false;
        // Mise à jour de goalkeeperClaiming pour cet objet.
        this.goalkeeperClaiming = false;

        // Mise à jour de goalkeeperKickCooldownUntil pour cet objet.
        this.goalkeeperKickCooldownUntil = 0;
        // Mise à jour de goalkeeperIsClearing pour cet objet.
        this.goalkeeperIsClearing = false;
        // Mise à jour de goalkeeperReleaseUntil pour cet objet.
        this.goalkeeperReleaseUntil = 0;

        // Mise à jour de goalkeeperPossessionStartTime pour cet objet.
        this.goalkeeperPossessionStartTime = 0;
        // Mise à jour de goalkeeperMinHoldDuration pour cet objet.
        this.goalkeeperMinHoldDuration = 1200;
        // Mise à jour de goalkeeperMaxHoldDuration pour cet objet.
        this.goalkeeperMaxHoldDuration = 2800;

        // Mise à jour de goalkeeperCurrentRoamTarget pour cet objet.
        this.goalkeeperCurrentRoamTarget = null;
        // Mise à jour de goalkeeperNextRoamDecisionTime pour cet objet.
        this.goalkeeperNextRoamDecisionTime = 0;

        // Mise à jour de aiShotCharging pour cet objet.
        this.aiShotCharging = false;
        // Mise à jour de aiShotChargeStart pour cet objet.
        this.aiShotChargeStart = 0;
        // Mise à jour de aiShotCarrier pour cet objet.
        this.aiShotCarrier = null;
        // Mise à jour de aiShotDirection pour cet objet.
        this.aiShotDirection = null;
        // Mise à jour de aiShotCurrentValue pour cet objet.
        this.aiShotCurrentValue = 0;

        // Mise à jour de _aiFrameMoveId pour cet objet.
        this._aiFrameMoveId = 0;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction update : elle regroupe le traitement de cette partie.
    update(ball) {
        // Vérification avant d'exécuter la suite.
        if (!ball || !ball.position) return;

        // Vérification avant d'exécuter la suite.
        if (updateTeamForRestart(this, ball)) return;

        // Mise à jour de _aiFrameMoveId pour cet objet.
        this._aiFrameMoveId = this.scene && this.scene.getFrameId
            // Appel de getFrameId pour appliquer l'action prévue.
            ? this.scene.getFrameId()
            // Appel de now pour appliquer l'action prévue.
            : performance.now();

        // Mise à jour de aiControlledPlayer pour cet objet.
        this.aiControlledPlayer = null;
        // Mise à jour de goalkeeperLocked pour cet objet.
        this.goalkeeperLocked = false;
        // Mise à jour de goalkeeperClaiming pour cet objet.
        this.goalkeeperClaiming = false;

        // Vérification avant d'exécuter la suite.
        if (this.aiShotCharging) {
            // Appel de handleAIShot pour appliquer l'action prévue.
            this.handleAIShot(ball);
            // Appel de updateBasePositioning pour appliquer l'action prévue.
            this.updateBasePositioning(ball);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de aiBehavior pour appliquer l'action prévue.
        this.aiBehavior(ball);
        // Appel de updateBasePositioning pour appliquer l'action prévue.
        this.updateBasePositioning(ball);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction aiBehavior : elle regroupe le traitement de cette partie.
    aiBehavior(ball) {
        // override
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction hasRealPossession : elle regroupe le traitement de cette partie.
    hasRealPossession(ball) {
        // Vérification avant d'exécuter la suite.
        if (!ball || !ball.position) return false;

        // Vérification avant d'exécuter la suite.
        if (performance.now() < this.teamPossessionLockUntil) {
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (ball.lastTouchTeam !== this) {
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Parcours de plusieurs valeurs.
        for (const player of this.players) {
            // Vérification avant d'exécuter la suite.
            if (!player || !player.position) continue;

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(player.position, ball.position);
            // Vérification avant d'exécuter la suite.
            if (dist < 2.0) {
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

    // Fonction updateBasePositioning : elle regroupe le traitement de cette partie.
    updateBasePositioning(ball) {
        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player => {
            // Vérification avant d'exécuter la suite.
            if (!player) return;

            // Vérification avant d'exécuter la suite.
            if (player === this.ballChaser) return;
            // Vérification avant d'exécuter la suite.
            if (player === this.aiControlledPlayer) return;
            // Vérification avant d'exécuter la suite.
            if (player.role === "GK" && this.goalkeeperLocked) return;
            // Vérification avant d'exécuter la suite.
            if (this.hasPlayerMovedThisFrame(player)) return;

            // Valeur mémorisée dans target.
            let target = player.homePosition.clone();

            // Vérification avant d'exécuter la suite.
            if (player.role === "GK") {
                // Mise à jour de x.
                target.x = player.homePosition.x;
                // Instruction nécessaire au déroulement de cette partie.
                target.z += (ball.position.z - player.homePosition.z) * 0.2;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (player.role === "DEF") {
                // Instruction nécessaire au déroulement de cette partie.
                target.x += (ball.position.x - player.homePosition.x) * 0.3;
                // Instruction nécessaire au déroulement de cette partie.
                target.z += (ball.position.z - player.homePosition.z) * 0.3;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (player.role === "ATT") {
                // Instruction nécessaire au déroulement de cette partie.
                target.x += (ball.position.x - player.homePosition.x) * 0.5;
                // Instruction nécessaire au déroulement de cette partie.
                target.z += (ball.position.z - player.homePosition.z) * 0.4;
            // Fermeture du bloc ou de l'appel.
            }

            // Mise à jour de x.
            target.x = Math.max(player.minX, Math.min(player.maxX, target.x));
            // Mise à jour de z.
            target.z = Math.max(player.minZ, Math.min(player.maxZ, target.z));

            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(player, target);
            // Appel de markPlayerMovedThisFrame pour appliquer l'action prévue.
            this.markPlayerMovedThisFrame(player);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction moveAIPlayerTowards : elle regroupe le traitement de cette partie.
    moveAIPlayerTowards(player, target, options = {}) {
        // Vérification avant d'exécuter la suite.
        if (!player || !target) return;
        // Vérification avant d'exécuter la suite.
        if (player.isTackling) return;
        // Vérification avant d'exécuter la suite.
        if (player._tackleStunUntil && Date.now() < player._tackleStunUntil) return;

        // Appel de initSteeringPlayer pour appliquer l'action prévue.
        initSteeringPlayer(player);

        // Valeur mémorisée dans maxSpeed.
        const maxSpeed = options.maxSpeed ?? 0.07;
        // Valeur mémorisée dans maxForce.
        const maxForce = options.maxForce ?? 0.02;
        // Valeur mémorisée dans stopDistance.
        const stopDistance = options.stopDistance ?? 0.15;
        // Valeur mémorisée dans slowRadius.
        const slowRadius = options.slowRadius ?? 2.8;

        // Mise à jour de maxSteeringSpeed.
        player.maxSteeringSpeed = maxSpeed;
        // Mise à jour de maxSteeringForce.
        player.maxSteeringForce = maxForce;

        // Valeur mémorisée dans useAvoid.
        const useAvoid = options.useAvoid ?? false;

        // Valeur mémorisée dans opponents.
        const opponents = useAvoid
            // Appel de getAvoidOpponents pour appliquer l'action prévue.
            ? this.getAvoidOpponents(player)
            // Instruction nécessaire au déroulement de cette partie.
            : [];

        // Valeur mémorisée dans avoidanceTarget.
        const avoidanceTarget = useAvoid
            // Appel de computeAvoidanceWaypoint pour appliquer l'action prévue.
            ? computeAvoidanceWaypoint(player, target, opponents, {
                // Paramètre de l'appel ou valeur de configuration.
                avoidRadius: options.avoidRadius ?? 8.0,
                // Paramètre de l'appel ou valeur de configuration.
                corridorRadius: options.corridorRadius ?? 2.8,
                // Paramètre de l'appel ou valeur de configuration.
                lateralOffset: options.lateralOffset ?? 4.5,
                // Instruction nécessaire au déroulement de cette partie.
                forwardLook: options.forwardLook ?? 8.0
            // Fermeture du bloc ou de l'appel.
            })
            // Instruction nécessaire au déroulement de cette partie.
            : null;

        // Valeur mémorisée dans finalTarget.
        const finalTarget = avoidanceTarget || target;

        // Valeur mémorisée dans toTarget.
        const toTarget = finalTarget.subtract(player.position);
        // Mise à jour de y.
        toTarget.y = 0;
        // Valeur mémorisée dans dist.
        const dist = toTarget.length();

        // Vérification avant d'exécuter la suite.
        if (dist < stopDistance) {
            // Appel de resetSteeringVelocity pour appliquer l'action prévue.
            resetSteeringVelocity(player);

            // Vérification avant d'exécuter la suite.
            if (player.playAnimation) {
                // Appel de playAnimation pour appliquer l'action prévue.
                player.playAnimation("idle");
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans steering.
        const steering = arriveSteering(
            // Paramètre de l'appel ou valeur de configuration.
            player,
            // Paramètre de l'appel ou valeur de configuration.
            finalTarget,
            // Paramètre de l'appel ou valeur de configuration.
            maxSpeed,
            // Paramètre de l'appel ou valeur de configuration.
            slowRadius,
            // Instruction nécessaire au déroulement de cette partie.
            stopDistance
        // Fermeture du bloc ou de l'appel.
        );

        // Valeur mémorisée dans velocity.
        const velocity = applySteering(player, steering);

        // Vérification avant d'exécuter la suite.
        if (velocity.lengthSquared() < 0.00001) {
            // Vérification avant d'exécuter la suite.
            if (player.playAnimation) {
                // Appel de playAnimation pour appliquer l'action prévue.
                player.playAnimation("idle");
            // Fermeture du bloc ou de l'appel.
            }
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans moveDir.
        const moveDir = velocity.clone();
        // Mise à jour de y.
        moveDir.y = 0;

        // Vérification avant d'exécuter la suite.
        if (moveDir.lengthSquared() < 0.00001) return;

        // Appel de normalize pour appliquer l'action prévue.
        moveDir.normalize();

        // Valeur mémorisée dans facingDirection.
        let facingDirection = moveDir;

        // Vérification avant d'exécuter la suite.
        if (!avoidanceTarget && options.facingDirection && options.facingDirection.lengthSquared() > 0.0001) {
            // Appel de clone pour appliquer l'action prévue.
            facingDirection = options.facingDirection.clone();
            // Mise à jour de y.
            facingDirection.y = 0;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (facingDirection && facingDirection.lengthSquared() > 0.0001) {
            // Appel de setFacing pour appliquer l'action prévue.
            this.setFacing(player, facingDirection);
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans moveSpeed.
        const moveSpeed = velocity.length();
        // Appel de move pour appliquer l'action prévue.
        player.move(moveDir.x, moveDir.z, moveSpeed);
        // Appel de markPlayerMovedThisFrame pour appliquer l'action prévue.
        this.markPlayerMovedThisFrame(player);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction moveAICarrierTowards : elle regroupe le traitement de cette partie.
    moveAICarrierTowards(player, target, options = {}) {
        // Vérification avant d'exécuter la suite.
        if (!player || !target) return;

        // Appel de moveAIPlayerTowards pour appliquer l'action prévue.
        this.moveAIPlayerTowards(player, target, {
            // Paramètre de l'appel ou valeur de configuration.
            maxSpeed: options.maxSpeed ?? 0.07,
            // Paramètre de l'appel ou valeur de configuration.
            maxForce: options.maxForce ?? 0.028,
            // Paramètre de l'appel ou valeur de configuration.
            stopDistance: options.stopDistance ?? 0.05,
            // Paramètre de l'appel ou valeur de configuration.
            slowRadius: options.slowRadius ?? 3.2,
            // Paramètre de l'appel ou valeur de configuration.
            facingDirection: options.facingDirection ?? null,

            // Paramètre de l'appel ou valeur de configuration.
            useAvoid: true,
            // Paramètre de l'appel ou valeur de configuration.
            avoidRadius: options.avoidRadius ?? 9.0,
            // Paramètre de l'appel ou valeur de configuration.
            corridorRadius: options.corridorRadius ?? 3.0,
            // Paramètre de l'appel ou valeur de configuration.
            lateralOffset: options.lateralOffset ?? 5.0,
            // Instruction nécessaire au déroulement de cette partie.
            forwardLook: options.forwardLook ?? 9.0
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction moveAIGoalkeeperWithBall : elle regroupe le traitement de cette partie.
    moveAIGoalkeeperWithBall(gk, ball, target) {
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball || !target) return;

        // Création de holdDir.
        const holdDir = new BABYLON.Vector3(-1, 0, 0);

        // Appel de moveAIPlayerTowards pour appliquer l'action prévue.
        this.moveAIPlayerTowards(gk, target, {
            // Paramètre de l'appel ou valeur de configuration.
            maxSpeed: 0.042,
            // Paramètre de l'appel ou valeur de configuration.
            maxForce: 0.02,
            // Paramètre de l'appel ou valeur de configuration.
            stopDistance: 0.05,
            // Instruction nécessaire au déroulement de cette partie.
            facingDirection: holdDir
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de setFacing pour appliquer l'action prévue.
        this.setFacing(gk, holdDir);

        // Mise à jour de lastKicker.
        ball.lastKicker = gk;
        // Mise à jour de lastTouchTeam.
        ball.lastTouchTeam = this;

        // Vérification avant d'exécuter la suite.
        if (!ball.velocity) {
            // Mise à jour de velocity.
            ball.velocity = new BABYLON.Vector3(0, 0, 0);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de set pour appliquer l'action prévue.
        ball.velocity.set(0, 0, 0);

        // Mise à jour de x.
        ball.position.x = gk.position.x + holdDir.x * 0.95;
        // Mise à jour de z.
        ball.position.z = gk.position.z + holdDir.z * 0.95;
        // Mise à jour de y.
        ball.position.y = 0.75;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction markPlayerMovedThisFrame : elle regroupe le traitement de cette partie.
    markPlayerMovedThisFrame(player) {
        // Vérification avant d'exécuter la suite.
        if (!player) return;
        // Mise à jour de _aiLastMoveFrame.
        player._aiLastMoveFrame = this._aiFrameMoveId;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction hasPlayerMovedThisFrame : elle regroupe le traitement de cette partie.
    hasPlayerMovedThisFrame(player) {
        // Vérification avant d'exécuter la suite.
        if (!player) return false;
        // Résultat renvoyé par la fonction.
        return player._aiLastMoveFrame === this._aiFrameMoveId;
    // Fermeture du bloc ou de l'appel.
    }

    
    
// Fermeture du bloc ou de l'appel.
}