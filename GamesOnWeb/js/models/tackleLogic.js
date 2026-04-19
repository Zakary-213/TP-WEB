// Classe TackleController : elle sert de modèle pour cet élément du jeu.
class TackleController {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(config = {}) {
        // Mise à jour de isTackling pour cet objet.
        this.isTackling = false;
        // Mise à jour de tacklePlayer pour cet objet.
        this.tacklePlayer = null;
        // Mise à jour de tackleDirection pour cet objet.
        this.tackleDirection = new BABYLON.Vector3(1, 0, 0);
        // Mise à jour de tackleEndTime pour cet objet.
        this.tackleEndTime = 0;
        // Mise à jour de tackleCooldownUntil pour cet objet.
        this.tackleCooldownUntil = 0;

        // Mise à jour de tackleDurationMs pour cet objet.
        this.tackleDurationMs = config.tackleDurationMs ?? 260;
        // Mise à jour de tackleCooldownMs pour cet objet.
        this.tackleCooldownMs = config.tackleCooldownMs ?? 900;
        // Mise à jour de tackleSpeed pour cet objet.
        this.tackleSpeed = config.tackleSpeed ?? 0.27;
        // Mise à jour de tackleTriggerRange pour cet objet.
        this.tackleTriggerRange = config.tackleTriggerRange ?? 8.5;
        // Mise à jour de tackleOpponentRange pour cet objet.
        this.tackleOpponentRange = config.tackleOpponentRange ?? 3.2;
        // Mise à jour de playerHasBallRange pour cet objet.
        this.playerHasBallRange = config.playerHasBallRange ?? 2.2;
        // Mise à jour de tackleHitRange pour cet objet.
        this.tackleHitRange = config.tackleHitRange ?? 2.4;
        // Mise à jour de stunDurationMs pour cet objet.
        this.stunDurationMs = config.stunDurationMs ?? 1000;
        // Mise à jour de downPoseX pour cet objet.
        this.downPoseX = config.downPoseX ?? (-Math.PI / 2 + 1.05);
        // Mise à jour de getUpLerp pour cet objet.
        this.getUpLerp = config.getUpLerp ?? 0.2;

        // Mise à jour de _tackledOpponent pour cet objet.
        this._tackledOpponent = null;
        // Mise à jour de _tackledOpponentDist pour cet objet.
        this._tackledOpponentDist = Infinity;
        // Mise à jour de tackleTeam pour cet objet.
        this.tackleTeam = null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleKeyDown : elle regroupe le traitement de cette partie.
    handleKeyDown(event, context) {
        // Vérification avant d'exécuter la suite.
        if (!event || !context) return;
        // Vérification avant d'exécuter la suite.
        if (event.repeat) return;
        // Valeur mémorisée dans bind.
        const bind = context.tackleKey || "x";
        // Valeur mémorisée dans key.
        const key = (event.key || "").toLowerCase();
        // Valeur mémorisée dans isMatch.
        const isMatch = bind === "Space"
            // Instruction nécessaire au déroulement de cette partie.
            ? event.code === "Space"
            // Instruction nécessaire au déroulement de cette partie.
            : bind === "Shift"
                // Instruction nécessaire au déroulement de cette partie.
                ? event.key === "Shift"
                // Appel de String pour appliquer l'action prévue.
                : key === String(bind).toLowerCase();
        // Vérification avant d'exécuter la suite.
        if (!isMatch) return;

        // Mise à jour de tackleTeam pour cet objet.
        this.tackleTeam = context.team || null;

        // Valeur mémorisée dans { activePlayer, playerFacing, ba....
        const { activePlayer, playerFacing, ball, opponentTeam } = context;
        // Valeur mémorisée dans now.
        const now = Date.now();
        // Vérification avant d'exécuter la suite.
        if (!this.canTackleInOwnHalf(activePlayer)) return;

        // Vérification avant d'exécuter la suite.
        if (!activePlayer || this.isTackling || now < this.tackleCooldownUntil) return;
        // Vérification avant d'exécuter la suite.
        if (!ball || !ball.position || ball.isOutAnimationPlaying || ball.isOutOfPlay) return;
        // Vérification avant d'exécuter la suite.
        if (!opponentTeam || !opponentTeam.players || opponentTeam.players.length === 0) return;

        // Préparation de distToBall avec Babylon.js.
        const distToBall = BABYLON.Vector3.Distance(activePlayer.position, ball.position);

        // Le duel doit rester local autour de la balle.
        // Vérification avant d'exécuter la suite.
        if (distToBall > this.tackleTriggerRange) return;

        // Valeur mémorisée dans targetOpponent.
        let targetOpponent = null;
        // Valeur mémorisée dans bestOpponentDist.
        let bestOpponentDist = Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        opponentTeam.players.forEach((op) => {
            // Vérification avant d'exécuter la suite.
            if (!op || !op.position) return;
            // Préparation de d avec Babylon.js.
            const d = BABYLON.Vector3.Distance(activePlayer.position, op.position);
            // Vérification avant d'exécuter la suite.
            if (d < bestOpponentDist) {
                // Instruction nécessaire au déroulement de cette partie.
                bestOpponentDist = d;
                // Instruction nécessaire au déroulement de cette partie.
                targetOpponent = op;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Vérification avant d'exécuter la suite.
        if (!targetOpponent) return;
        // Vérification avant d'exécuter la suite.
        if (bestOpponentDist > this.tackleOpponentRange) return;

        // Préparation de opponentBallDist avec Babylon.js.
        const opponentBallDist = BABYLON.Vector3.Distance(targetOpponent.position, ball.position);
        // Vérification avant d'exécuter la suite.
        if (opponentBallDist > this.playerHasBallRange) return;

        // Possession relative:
        // on bloque uniquement si le joueur humain est clairement plus proche de la balle.
        // Vérification avant d'exécuter la suite.
        if (distToBall + 0.25 < opponentBallDist) return;

        // Autoriser le tacle de face et sur les cotes, bloquer seulement par derriere.
        // Valeur mémorisée dans toOpponent.
        const toOpponent = targetOpponent.position.subtract(activePlayer.position);
        // Mise à jour de y.
        toOpponent.y = 0;

        // Valeur mémorisée dans opponentFacing.
        const opponentFacing = targetOpponent.facingDirection
            // Appel de clone pour appliquer l'action prévue.
            ? targetOpponent.facingDirection.clone()
            // Instruction nécessaire au déroulement de cette partie.
            : null;

        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            opponentFacing &&
            // Appel de lengthSquared pour appliquer l'action prévue.
            opponentFacing.lengthSquared() > 0.0001 &&
            // Appel de lengthSquared pour appliquer l'action prévue.
            toOpponent.lengthSquared() > 0.0001
        // Ouverture du bloc correspondant.
        ) {
            // Mise à jour de y.
            opponentFacing.y = 0;
            // Appel de normalize pour appliquer l'action prévue.
            opponentFacing.normalize();
            // Appel de normalize pour appliquer l'action prévue.
            toOpponent.normalize();

            // dot > 0 => le tackleur arrive dans le dos (interdit)
            // Préparation de behindDot avec Babylon.js.
            const behindDot = BABYLON.Vector3.Dot(opponentFacing, toOpponent);
            // Vérification avant d'exécuter la suite.
            if (behindDot > 0.35) return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans dashDir.
        const dashDir = targetOpponent.position.subtract(activePlayer.position);

        // Mise à jour de y.
        dashDir.y = 0;
        // Vérification avant d'exécuter la suite.
        if (dashDir.lengthSquared() < 0.0001) return;

        // Appel de normalize pour appliquer l'action prévue.
        dashDir.normalize();

        // Mise à jour de isTackling pour cet objet.
        this.isTackling = true;
        // Mise à jour de tacklePlayer pour cet objet.
        this.tacklePlayer = activePlayer;
        // Appel de copyFrom pour appliquer l'action prévue.
        this.tackleDirection.copyFrom(dashDir);
        // Mise à jour de tackleEndTime pour cet objet.
        this.tackleEndTime = now + this.tackleDurationMs;
        // Mise à jour de tackleCooldownUntil pour cet objet.
        this.tackleCooldownUntil = now + this.tackleCooldownMs;
        // Mise à jour de isTackling.
        this.tacklePlayer.isTackling = true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction beginFrame : elle regroupe le traitement de cette partie.
    beginFrame() {
        // Mise à jour de _tackledOpponent pour cet objet.
        this._tackledOpponent = null;
        // Mise à jour de _tackledOpponentDist pour cet objet.
        this._tackledOpponentDist = Infinity;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction shouldIgnoreCollision : elle regroupe le traitement de cette partie.
    shouldIgnoreCollision(pA, pB) {
        // Vérification avant d'exécuter la suite.
        if (!this.isTackling || !this.tacklePlayer) return false;
        // Résultat renvoyé par la fonction.
        return pA === this.tacklePlayer || pB === this.tacklePlayer;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction registerPotentialHit : elle regroupe le traitement de cette partie.
    registerPotentialHit(pA, pB) {
        // Vérification avant d'exécuter la suite.
        if (!this.isTackling || !this.tacklePlayer) return;

        // Valeur mémorisée dans opponent.
        let opponent = null;
        // Vérification avant d'exécuter la suite.
        if (pA === this.tacklePlayer) opponent = pB;
        // Deuxième possibilité à tester.
        else if (pB === this.tacklePlayer) opponent = pA;
        // Cas utilisé quand les tests précédents échouent.
        else return;

        // Vérification avant d'exécuter la suite.
        if (!opponent || !opponent.position || !this.tacklePlayer.position) return;

        // Valeur mémorisée dans dx.
        const dx = this.tacklePlayer.position.x - opponent.position.x;
        // Valeur mémorisée dans dz.
        const dz = this.tacklePlayer.position.z - opponent.position.z;
        // Valeur mémorisée dans d.
        const d = Math.sqrt(dx * dx + dz * dz);

        // Vérification avant d'exécuter la suite.
        if (d < this.tackleHitRange && d < this._tackledOpponentDist) {
            // Mise à jour de _tackledOpponent pour cet objet.
            this._tackledOpponent = opponent;
            // Mise à jour de _tackledOpponentDist pour cet objet.
            this._tackledOpponentDist = d;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction applyBallSteal : elle regroupe le traitement de cette partie.
    applyBallSteal(ball) {
        // Vérification avant d'exécuter la suite.
        if (!this.isTackling || !this.tacklePlayer || !this._tackledOpponent) return;
        // Vérification avant d'exécuter la suite.
        if (!ball || !ball.position) return;

        // Appel de _applyKnockdown pour appliquer l'action prévue.
        this._applyKnockdown(this._tackledOpponent);

        // Préparation de oppBallDist avec Babylon.js.
        const oppBallDist = BABYLON.Vector3.Distance(this._tackledOpponent.position, ball.position);
        // Préparation de myBallDist avec Babylon.js.
        const myBallDist = BABYLON.Vector3.Distance(this.tacklePlayer.position, ball.position);

        // Vérification avant d'exécuter la suite.
        if (oppBallDist < 3.0 || myBallDist < 3.0) {
            // Vérification avant d'exécuter la suite.
            if (!ball.velocity) {
                // Mise à jour de velocity.
                ball.velocity = new BABYLON.Vector3(0, 0, 0);
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans carryDir.
            const carryDir = this.tackleDirection.clone();
            // Mise à jour de y.
            carryDir.y = 0;

            // Vérification avant d'exécuter la suite.
            if (carryDir.lengthSquared() > 0.0001) {
                // Appel de normalize pour appliquer l'action prévue.
                carryDir.normalize();

                // orientation du joueur
                // Mise à jour de facingDirection.
                this.tacklePlayer.facingDirection = carryDir.clone();

                // transfert de possession logique
                // Mise à jour de lastKicker.
                ball.lastKicker = this.tacklePlayer;
                // Mise à jour de lastTouchTeam.
                ball.lastTouchTeam = this.tackleTeam;

                // Vérification avant d'exécuter la suite.
                if (this.tackleTeam?.lockTeamPossession) {
                    // Appel de lockTeamPossession pour appliquer l'action prévue.
                    this.tackleTeam.lockTeamPossession(500);
                // Fermeture du bloc ou de l'appel.
                }

                // IMPORTANT :
                // on garde la balle proche du joueur au lieu de l'éjecter
                // Valeur mémorisée dans holdOffset.
                const holdOffset = 1.05;
                // Mise à jour de x.
                ball.position.x = this.tacklePlayer.position.x + carryDir.x * holdOffset;
                // Mise à jour de z.
                ball.position.z = this.tacklePlayer.position.z + carryDir.z * holdOffset;
                // Mise à jour de y.
                ball.position.y = 0.75;

                // on ne propulse plus la balle
                // Appel de set pour appliquer l'action prévue.
                ball.velocity.set(0, 0, 0);

                // évite les collisions parasites juste après récupération
                // Mise à jour de pushLockUntil.
                ball.pushLockUntil = performance.now() + 120;
                // Mise à jour de ignorePlayerCollisionUntil.
                ball.ignorePlayerCollisionUntil = performance.now() + 120;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction _applyKnockdown : elle regroupe le traitement de cette partie.
    _applyKnockdown(player) {
        // Vérification avant d'exécuter la suite.
        if (!player || !player.position) return;

        // Valeur mémorisée dans now.
        const now = Date.now();
        // Valeur mémorisée dans minEnd.
        const minEnd = now + this.stunDurationMs;

        // Vérification avant d'exécuter la suite.
        if (!player._tackleStunUntil || player._tackleStunUntil < minEnd) {
            // Mise à jour de _tackleStunUntil.
            player._tackleStunUntil = minEnd;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!player._tackleDownAnchor) {
            // Mise à jour de _tackleDownAnchor.
            player._tackleDownAnchor = player.position.clone();
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de copyFrom pour appliquer l'action prévue.
            player._tackleDownAnchor.copyFrom(player.position);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de _setPlayerGray pour appliquer l'action prévue.
        this._setPlayerGray(player);
        // Appel de _setStunVfxVisible pour appliquer l'action prévue.
        this._setStunVfxVisible(player, false);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction _setPlayerGray : elle regroupe le traitement de cette partie.
    _setPlayerGray(player) {
        // Vérification avant d'exécuter la suite.
        if (!player || !player.model || !player.model.getChildMeshes) return;
        // Vérification avant d'exécuter la suite.
        if (player._tackleGrayApplied) return;

        // Valeur mémorisée dans meshes.
        const meshes = player.model.getChildMeshes();
        // Valeur mémorisée dans backups.
        const backups = [];

        // Appel de forEach pour appliquer l'action prévue.
        meshes.forEach((mesh) => {
            // Vérification avant d'exécuter la suite.
            if (!mesh || !mesh.material) return;
            // Valeur mémorisée dans mat.
            const mat = mesh.material;

            // Appel de push pour appliquer l'action prévue.
            backups.push({
                // Paramètre de l'appel ou valeur de configuration.
                material: mat,
                // Appel de clone pour appliquer l'action prévue.
                diffuse: mat.diffuseColor ? mat.diffuseColor.clone() : null,
                // Appel de clone pour appliquer l'action prévue.
                albedo: mat.albedoColor ? mat.albedoColor.clone() : null,
                // Appel de clone pour appliquer l'action prévue.
                emissive: mat.emissiveColor ? mat.emissiveColor.clone() : null
            // Fermeture du bloc ou de l'appel.
            });

            // Vérification avant d'exécuter la suite.
            if (mat.diffuseColor) mat.diffuseColor = new BABYLON.Color3(0.45, 0.45, 0.45);
            // Vérification avant d'exécuter la suite.
            if (mat.albedoColor) mat.albedoColor = new BABYLON.Color3(0.45, 0.45, 0.45);
            // Vérification avant d'exécuter la suite.
            if (mat.emissiveColor) mat.emissiveColor = new BABYLON.Color3(0.06, 0.06, 0.06);
        // Fermeture du bloc ou de l'appel.
        });

        // Mise à jour de _tackleVisualBackup.
        player._tackleVisualBackup = backups;
        // Mise à jour de _tackleGrayApplied.
        player._tackleGrayApplied = true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction _restorePlayerColor : elle regroupe le traitement de cette partie.
    _restorePlayerColor(player) {
        // Vérification avant d'exécuter la suite.
        if (!player || !player._tackleGrayApplied) return;

        // Valeur mémorisée dans backups.
        const backups = player._tackleVisualBackup || [];
        // Appel de forEach pour appliquer l'action prévue.
        backups.forEach((b) => {
            // Vérification avant d'exécuter la suite.
            if (!b || !b.material) return;
            // Vérification avant d'exécuter la suite.
            if (b.diffuse) b.material.diffuseColor = b.diffuse;
            // Vérification avant d'exécuter la suite.
            if (b.albedo) b.material.albedoColor = b.albedo;
            // Vérification avant d'exécuter la suite.
            if (b.emissive) b.material.emissiveColor = b.emissive;
        // Fermeture du bloc ou de l'appel.
        });

        // Mise à jour de _tackleVisualBackup.
        player._tackleVisualBackup = null;
        // Mise à jour de _tackleGrayApplied.
        player._tackleGrayApplied = false;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction _ensureStunVfx : elle regroupe le traitement de cette partie.
    _ensureStunVfx(player) {
        // Vérification avant d'exécuter la suite.
        if (!player || !player.scene) return null;
        // Vérification avant d'exécuter la suite.
        if (player._stunVfxRoot) return player._stunVfxRoot;

        // Valeur mémorisée dans scene.
        const scene = player.scene;

        // Création de root.
        const root = new BABYLON.TransformNode("stunVfxRoot", scene);
        // Mise à jour de parent.
        root.parent = player;
        // Mise à jour de position.
        root.position = new BABYLON.Vector3(0, 3.2, 0);

        // Préparation de halo avec Babylon.js.
        const halo = BABYLON.MeshBuilder.CreateTorus(
            // Paramètre de l'appel ou valeur de configuration.
            "stunHalo",
            // Paramètre de l'appel ou valeur de configuration.
            { diameter: 1.2, thickness: 0.08, tessellation: 24 },
            // Instruction nécessaire au déroulement de cette partie.
            scene
        // Fermeture du bloc ou de l'appel.
        );
        // Mise à jour de parent.
        halo.parent = root;
        // Mise à jour de x.
        halo.rotation.x = Math.PI / 2;

        // Création de haloMat.
        const haloMat = new BABYLON.StandardMaterial("stunHaloMat", scene);
        // Mise à jour de emissiveColor.
        haloMat.emissiveColor = new BABYLON.Color3(1.0, 0.9, 0.25);
        // Mise à jour de diffuseColor.
        haloMat.diffuseColor = new BABYLON.Color3(1.0, 0.85, 0.2);
        // Mise à jour de material.
        halo.material = haloMat;

        // Valeur mémorisée dans birds.
        const birds = [];
        // Création de birdMat.
        const birdMat = new BABYLON.StandardMaterial("stunBirdMat", scene);
        // Mise à jour de emissiveColor.
        birdMat.emissiveColor = new BABYLON.Color3(0.95, 0.95, 0.95);
        // Mise à jour de diffuseColor.
        birdMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);

        // Parcours de plusieurs valeurs.
        for (let i = 0; i < 3; i++) {
            // Préparation de bird avec Babylon.js.
            const bird = BABYLON.MeshBuilder.CreateSphere(
                // Paramètre de l'appel ou valeur de configuration.
                "stunBird",
                // Paramètre de l'appel ou valeur de configuration.
                { diameter: 0.18, segments: 8 },
                // Instruction nécessaire au déroulement de cette partie.
                scene
            // Fermeture du bloc ou de l'appel.
            );
            // Mise à jour de parent.
            bird.parent = root;
            // Mise à jour de material.
            bird.material = birdMat;
            // Appel de push pour appliquer l'action prévue.
            birds.push(bird);
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de setEnabled pour appliquer l'action prévue.
        root.setEnabled(false);
        // Mise à jour de _stunVfxRoot.
        player._stunVfxRoot = root;
        // Mise à jour de _stunVfxHalo.
        player._stunVfxHalo = halo;
        // Mise à jour de _stunVfxBirds.
        player._stunVfxBirds = birds;

        // Résultat renvoyé par la fonction.
        return root;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction _setStunVfxVisible : elle regroupe le traitement de cette partie.
    _setStunVfxVisible(player, visible) {
        // Vérification avant d'exécuter la suite.
        if (!player) return;
        // Valeur mémorisée dans root.
        const root = this._ensureStunVfx(player);
        // Vérification avant d'exécuter la suite.
        if (!root) return;
        // Appel de setEnabled pour appliquer l'action prévue.
        root.setEnabled(!!visible);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction _updateStunVfx : elle regroupe le traitement de cette partie.
    _updateStunVfx(player, nowMs) {
        // Vérification avant d'exécuter la suite.
        if (!player || !player._stunVfxRoot || !player._stunVfxRoot.isEnabled()) return;

        // Valeur mémorisée dans t.
        const t = nowMs * 0.006;

        // Vérification avant d'exécuter la suite.
        if (player._stunVfxHalo) {
            // Mise à jour de z.
            player._stunVfxHalo.rotation.z = t * 0.7;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans birds.
        const birds = player._stunVfxBirds || [];
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < birds.length; i++) {
            // Valeur mémorisée dans b.
            const b = birds[i];
            // Valeur mémorisée dans a.
            const a = t + (i * Math.PI * 2) / birds.length;
            // Valeur mémorisée dans r.
            const r = 0.8;
            // Mise à jour de x.
            b.position.x = Math.cos(a) * r;
            // Mise à jour de z.
            b.position.z = Math.sin(a) * r;
            // Mise à jour de y.
            b.position.y = 0.1 + Math.sin(t * 1.7 + i) * 0.07;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateStunnedPlayers : elle regroupe le traitement de cette partie.
    updateStunnedPlayers(team) {
        // Vérification avant d'exécuter la suite.
        if (!team || !team.players) return;

        // Valeur mémorisée dans now.
        const now = Date.now();

        // Appel de forEach pour appliquer l'action prévue.
        team.players.forEach((p) => {
            // Vérification avant d'exécuter la suite.
            if (!p || !p.position) return;

            // Vérification avant d'exécuter la suite.
            if (p._tackleStunUntil && now < p._tackleStunUntil) {
                // Vérification avant d'exécuter la suite.
                if (!p._tackleDownAnchor) {
                    // Mise à jour de _tackleDownAnchor.
                    p._tackleDownAnchor = p.position.clone();
                // Fermeture du bloc ou de l'appel.
                }

                // Appel de copyFrom pour appliquer l'action prévue.
                p.position.copyFrom(p._tackleDownAnchor);
                // Appel de _setStunVfxVisible pour appliquer l'action prévue.
                this._setStunVfxVisible(p, false);

                // Vérification avant d'exécuter la suite.
                if (p.playAnimation) {
                    // Appel de playAnimation pour appliquer l'action prévue.
                    p.playAnimation("idle");
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (p.model) {
                    // Mise à jour de x.
                    p.model.rotation.x = BABYLON.Scalar.Lerp(
                        // Paramètre de l'appel ou valeur de configuration.
                        p.model.rotation.x,
                        // Paramètre de l'appel ou valeur de configuration.
                        -Math.PI / 2,
                        // Instruction nécessaire au déroulement de cette partie.
                        0.65
                    // Fermeture du bloc ou de l'appel.
                    );
                // Fermeture du bloc ou de l'appel.
                }
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (p._tackleStunUntil && now >= p._tackleStunUntil) {
                // Mise à jour de _tackleStunUntil.
                p._tackleStunUntil = 0;
                // Mise à jour de _tackleDownAnchor.
                p._tackleDownAnchor = null;
                // Appel de _setStunVfxVisible pour appliquer l'action prévue.
                this._setStunVfxVisible(p, false);
                // Appel de _restorePlayerColor pour appliquer l'action prévue.
                this._restorePlayerColor(p);
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (p.model) {
                // Mise à jour de x.
                p.model.rotation.x = BABYLON.Scalar.Lerp(
                    // Paramètre de l'appel ou valeur de configuration.
                    p.model.rotation.x,
                    // Paramètre de l'appel ou valeur de configuration.
                    -Math.PI / 2,
                    // Instruction nécessaire au déroulement de cette partie.
                    this.getUpLerp
                // Fermeture du bloc ou de l'appel.
                );
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (!p._tackleStunUntil) {
                // Appel de _setStunVfxVisible pour appliquer l'action prévue.
                this._setStunVfxVisible(p, false);
                // Appel de _restorePlayerColor pour appliquer l'action prévue.
                this._restorePlayerColor(p);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateAndMove : elle regroupe le traitement de cette partie.
    updateAndMove(activePlayer, moveX, moveZ, normalSpeed) {
        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            this.isTackling &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tacklePlayer &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tackleTeam &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tackleTeam.isPlayerControlled &&
            // Appel de now pour appliquer l'action prévue.
            Date.now() >= this.tackleEndTime
        // Ouverture du bloc correspondant.
        ) {
            // Mise à jour de isTackling.
            this.tacklePlayer.isTackling = false;
            // Mise à jour de isTackling pour cet objet.
            this.isTackling = false;
            // Mise à jour de tacklePlayer pour cet objet.
            this.tacklePlayer = null;
            // Mise à jour de tackleTeam pour cet objet.
            this.tackleTeam = null;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            this.isTackling &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tacklePlayer &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tackleTeam &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tackleTeam.isPlayerControlled
        // Ouverture du bloc correspondant.
        ) {
            // Valeur mémorisée dans controlledPlayer.
            const controlledPlayer = this.tacklePlayer;

            // Mise à jour de facingDirection.
            controlledPlayer.facingDirection = this.tackleDirection.clone();

            // Valeur mémorisée dans directionOpt.
            const directionOpt = controlledPlayer.move(
                // Paramètre de l'appel ou valeur de configuration.
                this.tackleDirection.x,
                // Paramètre de l'appel ou valeur de configuration.
                this.tackleDirection.z,
                // Instruction nécessaire au déroulement de cette partie.
                this.tackleSpeed
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if (directionOpt && directionOpt.lengthSquared() > 0.0001) {
                // Mise à jour de facingDirection.
                controlledPlayer.facingDirection = directionOpt.clone();
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (controlledPlayer.model) {
                // Mise à jour de x.
                controlledPlayer.model.rotation.x = BABYLON.Scalar.Lerp(
                    // Paramètre de l'appel ou valeur de configuration.
                    controlledPlayer.model.rotation.x,
                    // Paramètre de l'appel ou valeur de configuration.
                    -Math.PI / 2 + 0.42,
                    // Instruction nécessaire au déroulement de cette partie.
                    0.7
                // Fermeture du bloc ou de l'appel.
                );
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return {
                // Paramètre de l'appel ou valeur de configuration.
                controlledPlayer,
                // Instruction nécessaire au déroulement de cette partie.
                directionOpt
            // Fermeture du bloc ou de l'appel.
            };
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            controlledPlayer: activePlayer,
            // Appel de move pour appliquer l'action prévue.
            directionOpt: activePlayer.move(moveX, moveZ, normalSpeed)
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction tryAITackle : elle regroupe le traitement de cette partie.
    tryAITackle(aiPlayer, ball, opponentTeam, aiTeam) {
        // Mise à jour de tackleTeam pour cet objet.
        this.tackleTeam = aiTeam || null;
        // Vérification avant d'exécuter la suite.
        if (Math.random() > 0.02) return;
        // Valeur mémorisée dans now.
        const now = Date.now();

        // Vérification avant d'exécuter la suite.
        if (!aiPlayer || this.isTackling || now < this.tackleCooldownUntil) return;
        // Vérification avant d'exécuter la suite.
        if (!ball || !ball.position || ball.isOutAnimationPlaying || ball.isOutOfPlay) return;
        // Vérification avant d'exécuter la suite.
        if (!opponentTeam || !opponentTeam.players) return;
        // Vérification avant d'exécuter la suite.
        if (!this.canTackleInOwnHalf(aiPlayer)) return;

        // Préparation de distToBall avec Babylon.js.
        const distToBall = BABYLON.Vector3.Distance(aiPlayer.position, ball.position);

        // Vérification avant d'exécuter la suite.
        if (distToBall > this.tackleTriggerRange) return;

        // trouver adversaire le + proche
        // Valeur mémorisée dans targetOpponent.
        let targetOpponent = null;
        // Valeur mémorisée dans bestDist.
        let bestDist = Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        opponentTeam.players.forEach(op => {
            // Vérification avant d'exécuter la suite.
            if (!op || !op.position) return;

            // Préparation de d avec Babylon.js.
            const d = BABYLON.Vector3.Distance(aiPlayer.position, op.position);
            // Vérification avant d'exécuter la suite.
            if (d < bestDist) {
                // Instruction nécessaire au déroulement de cette partie.
                bestDist = d;
                // Instruction nécessaire au déroulement de cette partie.
                targetOpponent = op;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Vérification avant d'exécuter la suite.
        if (!targetOpponent) return;
        // Vérification avant d'exécuter la suite.
        if (bestDist > this.tackleOpponentRange) return;

        // Préparation de opponentBallDist avec Babylon.js.
        const opponentBallDist = BABYLON.Vector3.Distance(targetOpponent.position, ball.position);
        // Vérification avant d'exécuter la suite.
        if (opponentBallDist > this.playerHasBallRange) return;

        // IMPORTANT → mêmes conditions que joueur
        // Vérification avant d'exécuter la suite.
        if (distToBall + 0.25 < opponentBallDist) return;

        // Valeur mémorisée dans toOpponent.
        const toOpponent = targetOpponent.position.subtract(aiPlayer.position);
        // Mise à jour de y.
        toOpponent.y = 0;

        // Valeur mémorisée dans opponentFacing.
        const opponentFacing = targetOpponent.facingDirection
            // Appel de clone pour appliquer l'action prévue.
            ? targetOpponent.facingDirection.clone()
            // Instruction nécessaire au déroulement de cette partie.
            : null;

        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            opponentFacing &&
            // Appel de lengthSquared pour appliquer l'action prévue.
            opponentFacing.lengthSquared() > 0.0001 &&
            // Appel de lengthSquared pour appliquer l'action prévue.
            toOpponent.lengthSquared() > 0.0001
        // Ouverture du bloc correspondant.
        ) {
            // Mise à jour de y.
            opponentFacing.y = 0;
            // Appel de normalize pour appliquer l'action prévue.
            opponentFacing.normalize();
            // Appel de normalize pour appliquer l'action prévue.
            toOpponent.normalize();

            // Préparation de behindDot avec Babylon.js.
            const behindDot = BABYLON.Vector3.Dot(opponentFacing, toOpponent);

            // Vérification avant d'exécuter la suite.
            if (behindDot > 0.35) return; // EXACT même règle
        // Fermeture du bloc ou de l'appel.
        }

        // direction tacle
        // Valeur mémorisée dans dashDir.
        const dashDir = targetOpponent.position.subtract(aiPlayer.position);
        // Mise à jour de y.
        dashDir.y = 0;

        // Vérification avant d'exécuter la suite.
        if (dashDir.lengthSquared() < 0.0001) return;

        // Appel de normalize pour appliquer l'action prévue.
        dashDir.normalize();

        // Mise à jour de isTackling pour cet objet.
        this.isTackling = true;
        // Mise à jour de tacklePlayer pour cet objet.
        this.tacklePlayer = aiPlayer;
        // Appel de copyFrom pour appliquer l'action prévue.
        this.tackleDirection.copyFrom(dashDir);
        // Mise à jour de tackleEndTime pour cet objet.
        this.tackleEndTime = now + this.tackleDurationMs;
        // Mise à jour de tackleCooldownUntil pour cet objet.
        this.tackleCooldownUntil = now + this.tackleCooldownMs;

        // Mise à jour de isTackling.
        aiPlayer.isTackling = true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateAITackle : elle regroupe le traitement de cette partie.
    updateAITackle() {
        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            this.isTackling &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tacklePlayer &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tackleTeam &&
            // Instruction nécessaire au déroulement de cette partie.
            !this.tackleTeam.isPlayerControlled &&
            // Appel de now pour appliquer l'action prévue.
            Date.now() >= this.tackleEndTime
        // Ouverture du bloc correspondant.
        ) {
            // Mise à jour de isTackling.
            this.tacklePlayer.isTackling = false;
            // Mise à jour de isTackling pour cet objet.
            this.isTackling = false;
            // Mise à jour de tacklePlayer pour cet objet.
            this.tacklePlayer = null;
            // Mise à jour de tackleTeam pour cet objet.
            this.tackleTeam = null;
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            this.isTackling &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tacklePlayer &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tackleTeam &&
            // Instruction nécessaire au déroulement de cette partie.
            !this.tackleTeam.isPlayerControlled
        // Ouverture du bloc correspondant.
        ) {
            // Valeur mémorisée dans aiPlayer.
            const aiPlayer = this.tacklePlayer;

            // Mise à jour de facingDirection.
            aiPlayer.facingDirection = this.tackleDirection.clone();

            // Valeur mémorisée dans directionOpt.
            const directionOpt = aiPlayer.move(
                // Paramètre de l'appel ou valeur de configuration.
                this.tackleDirection.x,
                // Paramètre de l'appel ou valeur de configuration.
                this.tackleDirection.z,
                // Instruction nécessaire au déroulement de cette partie.
                this.tackleSpeed
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if (directionOpt && directionOpt.lengthSquared() > 0.0001) {
                // Mise à jour de facingDirection.
                aiPlayer.facingDirection = directionOpt.clone();
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (aiPlayer.model) {
                // Mise à jour de x.
                aiPlayer.model.rotation.x = BABYLON.Scalar.Lerp(
                    // Paramètre de l'appel ou valeur de configuration.
                    aiPlayer.model.rotation.x,
                    // Paramètre de l'appel ou valeur de configuration.
                    -Math.PI / 2 + 0.42,
                    // Instruction nécessaire au déroulement de cette partie.
                    0.7
                // Fermeture du bloc ou de l'appel.
                );
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction maintainBallControl : elle regroupe le traitement de cette partie.
    maintainBallControl(ball) {
        // Vérification avant d'exécuter la suite.
        if (!this.isTackling || !this.tacklePlayer || !this.tackleTeam) return;
        // Vérification avant d'exécuter la suite.
        if (!ball || !ball.position) return;

        // seulement si le tackleur est bien le porteur logique
        // Vérification avant d'exécuter la suite.
        if (ball.lastKicker !== this.tacklePlayer || ball.lastTouchTeam !== this.tackleTeam) {
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans dir.
        const dir = this.tacklePlayer.facingDirection
            // Appel de clone pour appliquer l'action prévue.
            ? this.tacklePlayer.facingDirection.clone()
            // Appel de clone pour appliquer l'action prévue.
            : this.tackleDirection.clone();

        // Mise à jour de y.
        dir.y = 0;

        // Vérification avant d'exécuter la suite.
        if (dir.lengthSquared() < 0.0001) return;

        // Appel de normalize pour appliquer l'action prévue.
        dir.normalize();

        // Valeur mémorisée dans holdOffset.
        const holdOffset = 1.05;

        // Mise à jour de x.
        ball.position.x = BABYLON.Scalar.Lerp(
            // Paramètre de l'appel ou valeur de configuration.
            ball.position.x,
            // Paramètre de l'appel ou valeur de configuration.
            this.tacklePlayer.position.x + dir.x * holdOffset,
            // Instruction nécessaire au déroulement de cette partie.
            0.55
        // Fermeture du bloc ou de l'appel.
        );

        // Mise à jour de z.
        ball.position.z = BABYLON.Scalar.Lerp(
            // Paramètre de l'appel ou valeur de configuration.
            ball.position.z,
            // Paramètre de l'appel ou valeur de configuration.
            this.tacklePlayer.position.z + dir.z * holdOffset,
            // Instruction nécessaire au déroulement de cette partie.
            0.55
        // Fermeture du bloc ou de l'appel.
        );

        // Mise à jour de y.
        ball.position.y = 0.75;
        // Appel de set pour appliquer l'action prévue.
        ball.velocity.set(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction canTackleInOwnHalf : elle regroupe le traitement de cette partie.
    canTackleInOwnHalf(player) {
        // Vérification avant d'exécuter la suite.
        if (!player || !player.position) return false;

        // Equipe gauche (side = 1) -> moitié gauche seulement
        // Vérification avant d'exécuter la suite.
        if (player.side === 1) {
            // Résultat renvoyé par la fonction.
            return player.position.x <= 0;
        // Fermeture du bloc ou de l'appel.
        }

        // Equipe droite (side = -1) -> moitié droite seulement
        // Vérification avant d'exécuter la suite.
        if (player.side === -1) {
            // Résultat renvoyé par la fonction.
            return player.position.x >= 0;
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return false;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}