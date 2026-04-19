// Classe Player2Controller : elle sert de modèle pour cet élément du jeu.
class Player2Controller {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(config) {
        // Mise à jour de scene pour cet objet.
        this.scene = config.scene;
        // Mise à jour de team pour cet objet.
        this.team = config.team;
        // Mise à jour de opponentTeam pour cet objet.
        this.opponentTeam = config.opponentTeam;
        // Mise à jour de ball pour cet objet.
        this.ball = config.ball;
        // Mise à jour de tackleController pour cet objet.
        this.tackleController = config.tackleController;

        // Mise à jour de isBlocked pour cet objet.
        this.isBlocked = typeof config.isBlocked === "function" ? config.isBlocked : (() => false);
        // Mise à jour de computeMoveAxes pour cet objet.
        this.computeMoveAxes = typeof config.computeMoveAxes === "function" ? config.computeMoveAxes : null;
        // Mise à jour de isMovementLocked pour cet objet.
        this.isMovementLocked = typeof config.isMovementLocked === "function" ? config.isMovementLocked : (() => false);
        // Mise à jour de onShoot pour cet objet.
        this.onShoot = typeof config.onShoot === "function" ? config.onShoot : null;

        // Mise à jour de input pour cet objet.
        this.input = {
            // Paramètre de l'appel ou valeur de configuration.
            forward: false,
            // Paramètre de l'appel ou valeur de configuration.
            backward: false,
            // Paramètre de l'appel ou valeur de configuration.
            left: false,
            // Paramètre de l'appel ou valeur de configuration.
            right: false,
            // Instruction nécessaire au déroulement de cette partie.
            sprint: false
        // Fermeture du bloc ou de l'appel.
        };

        // Mise à jour de isCharging pour cet objet.
        this.isCharging = false;
        // Mise à jour de chargeStart pour cet objet.
        this.chargeStart = 0;
        // Mise à jour de maxChargeTime pour cet objet.
        this.maxChargeTime = 1000;

        // Mise à jour de lastDirection pour cet objet.
        this.lastDirection = new BABYLON.Vector3(-1, 0, 0);
        // Mise à jour de playerFacing pour cet objet.
        this.playerFacing = new BABYLON.Vector3(-1, 0, 0);
        // Mise à jour de previousPlayerPosition pour cet objet.
        this.previousPlayerPosition = null;

        // Mise à jour de _onKeyDown pour cet objet.
        this._onKeyDown = (e) => this.handleKeyDown(e);
        // Mise à jour de _onKeyUp pour cet objet.
        this._onKeyUp = (e) => this.handleKeyUp(e);

        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("keydown", this._onKeyDown);
        // Appel de addEventListener pour appliquer l'action prévue.
        window.addEventListener("keyup", this._onKeyUp);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getBindings : elle regroupe le traitement de cette partie.
    getBindings() {
        // Vérification avant d'exécuter la suite.
        if (window.inputBindings && typeof window.inputBindings.getPlayer2Bindings === "function") {
            // Résultat renvoyé par la fonction.
            return window.inputBindings.getPlayer2Bindings();
        // Fermeture du bloc ou de l'appel.
        }
        // Vérification avant d'exécuter la suite.
        if (window.inputBindings && typeof window.inputBindings.getBindings === "function") {
            // Résultat renvoyé par la fonction.
            return window.inputBindings.getBindings();
        // Fermeture du bloc ou de l'appel.
        }
        // Résultat renvoyé par la fonction.
        return {
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
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction matchesAction : elle regroupe le traitement de cette partie.
    matchesAction(event, bindValue) {
        // Vérification avant d'exécuter la suite.
        if (!event || !bindValue) return false;
        // Comparaison par code (touches spéciales : flèches, Enter, Numpad, RShift…)
        // Vérification avant d'exécuter la suite.
        if (event.code && String(event.code).toLowerCase() === String(bindValue).toLowerCase()) {
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }
        // Compatibilité avec les anciennes liaisons basées sur event.key
        // Vérification avant d'exécuter la suite.
        if (bindValue === "Space") return event.code === "Space";
        // Vérification avant d'exécuter la suite.
        if (bindValue === "Shift") return event.key === "Shift";
        // Résultat renvoyé par la fonction.
        return String(event.key || "").toLowerCase() === String(bindValue).toLowerCase();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction computeKickForce : elle regroupe le traitement de cette partie.
    computeKickForce() {
        // Valeur mémorisée dans elapsed.
        const elapsed = Date.now() - this.chargeStart;
        // Valeur mémorisée dans ratio.
        const ratio = Math.min(1, Math.max(0, elapsed / this.maxChargeTime));
        // Vérification avant d'exécuter la suite.
        if (ratio < 0.33) return 8;
        // Vérification avant d'exécuter la suite.
        if (ratio < 0.66) return 15;
        // Résultat renvoyé par la fonction.
        return 25;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getChargeState : elle regroupe le traitement de cette partie.
    getChargeState() {
        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            isCharging: this.isCharging,
            // Paramètre de l'appel ou valeur de configuration.
            chargeStart: this.chargeStart,
            // Paramètre de l'appel ou valeur de configuration.
            lastDirection: this.lastDirection,
            // Paramètre de l'appel ou valeur de configuration.
            playerFacing: this.playerFacing,
            // Instruction nécessaire au déroulement de cette partie.
            activePlayer: this.team ? this.team.activePlayer : null
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleKeyDown : elle regroupe le traitement de cette partie.
    handleKeyDown(event) {
        // Empêche le scroll de la page avec les flèches / Entrée
        // Vérification avant d'exécuter la suite.
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter","NumpadDecimal","Numpad4","Numpad6"].includes(event.code)) {
            // Appel de preventDefault pour appliquer l'action prévue.
            event.preventDefault();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (this.isBlocked()) return;
        // Vérification avant d'exécuter la suite.
        if (event.repeat) return;

        // Valeur mémorisée dans binds.
        const binds = this.getBindings();
        // Valeur mémorisée dans activePlayer.
        const activePlayer = this.team ? this.team.activePlayer : null;

        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.forward)) this.input.forward = true;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.backward)) this.input.backward = true;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.left)) this.input.left = true;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.right)) this.input.right = true;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.sprint)) this.input.sprint = true;

        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.shoot) && !this.isCharging) {
            // Mise à jour de chargeStart pour cet objet.
            this.chargeStart = Date.now();
            // Mise à jour de isCharging pour cet objet.
            this.isCharging = true;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.switchLeft) && this.team && typeof this.team.getPlayerOnSide === "function") {
            // Valeur mémorisée dans p.
            const p = this.team.getPlayerOnSide("left");
            // Vérification avant d'exécuter la suite.
            if (p) this.team.activePlayer = p;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.switchRight) && this.team && typeof this.team.getPlayerOnSide === "function") {
            // Valeur mémorisée dans p.
            const p = this.team.getPlayerOnSide("right");
            // Vérification avant d'exécuter la suite.
            if (p) this.team.activePlayer = p;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (
            // Appel de matchesAction pour appliquer l'action prévue.
            this.matchesAction(event, binds.tackle) &&
            // Instruction nécessaire au déroulement de cette partie.
            this.tackleController &&
            // Instruction nécessaire au déroulement de cette partie.
            typeof this.tackleController.handleKeyDown === "function" &&
            // Instruction nécessaire au déroulement de cette partie.
            activePlayer
        // Ouverture du bloc correspondant.
        ) {
            // Appel de handleKeyDown pour appliquer l'action prévue.
            this.tackleController.handleKeyDown(event, {
                // Paramètre de l'appel ou valeur de configuration.
                activePlayer,
                // Paramètre de l'appel ou valeur de configuration.
                playerFacing: this.playerFacing,
                // Paramètre de l'appel ou valeur de configuration.
                ball: this.ball,
                // Paramètre de l'appel ou valeur de configuration.
                opponentTeam: this.opponentTeam,
                // Paramètre de l'appel ou valeur de configuration.
                team: this.team,
                // Instruction nécessaire au déroulement de cette partie.
                tackleKey: binds.tackle
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleKeyUp : elle regroupe le traitement de cette partie.
    handleKeyUp(event) {
        // Vérification avant d'exécuter la suite.
        if (this.isBlocked()) return;

        // Valeur mémorisée dans binds.
        const binds = this.getBindings();

        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.forward)) this.input.forward = false;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.backward)) this.input.backward = false;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.left)) this.input.left = false;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.right)) this.input.right = false;
        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.sprint)) this.input.sprint = false;

        // Vérification avant d'exécuter la suite.
        if (this.matchesAction(event, binds.shoot) && this.isCharging) {
            // Valeur mémorisée dans force.
            const force = this.computeKickForce();
            // Valeur mémorisée dans player.
            const player = this.team ? this.team.activePlayer : null;

            // Vérification avant d'exécuter la suite.
            if (player && this.onShoot) {
                // Appel de onShoot pour appliquer l'action prévue.
                this.onShoot({
                    // Paramètre de l'appel ou valeur de configuration.
                    player,
                    // Appel de clone pour appliquer l'action prévue.
                    direction: this.lastDirection.clone(),
                    // Instruction nécessaire au déroulement de cette partie.
                    force
                // Fermeture du bloc ou de l'appel.
                });
            // Fermeture du bloc ou de l'appel.
            }

            // Mise à jour de isCharging pour cet objet.
            this.isCharging = false;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction update : elle regroupe le traitement de cette partie.
    update(config) {
        // Vérification avant d'exécuter la suite.
        if (!this.team || !this.team.activePlayer) return null;

        // Valeur mémorisée dans dt.
        const dt = config.dt || 0;
        // Valeur mémorisée dans baseSpeed.
        const baseSpeed = config.baseSpeed || 0.07;
        // Valeur mémorisée dans sprintMultiplier.
        const sprintMultiplier = config.sprintMultiplier || 1.8;
        // Valeur mémorisée dans staminaDrainRate.
        const staminaDrainRate = config.staminaDrainRate || 0.35;
        // Valeur mémorisée dans staminaRegenRate.
        const staminaRegenRate = config.staminaRegenRate || 0.25;

        // Valeur mémorisée dans activePlayer.
        const activePlayer = this.team.activePlayer;
        // Valeur mémorisée dans moveCalculator.
        const moveCalculator = typeof config.computeMoveAxes === "function"
            // Instruction nécessaire au déroulement de cette partie.
            ? config.computeMoveAxes
            // Instruction nécessaire au déroulement de cette partie.
            : this.computeMoveAxes;

        // Valeur mémorisée dans moveX.
        let moveX = 0;
        // Valeur mémorisée dans moveZ.
        let moveZ = 0;

        // Vérification avant d'exécuter la suite.
        if (moveCalculator) {
            // Valeur mémorisée dans move.
            const move = moveCalculator(this.input) || { moveX: 0, moveZ: 0 };
            // Instruction nécessaire au déroulement de cette partie.
            moveX = move.moveX || 0;
            // Instruction nécessaire au déroulement de cette partie.
            moveZ = move.moveZ || 0;
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Vérification avant d'exécuter la suite.
            if (this.input.forward) moveX += 1;
            // Vérification avant d'exécuter la suite.
            if (this.input.backward) moveX -= 1;
            // Vérification avant d'exécuter la suite.
            if (this.input.left) moveZ += 1;
            // Vérification avant d'exécuter la suite.
            if (this.input.right) moveZ -= 1;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans isTryingToMove.
        const isTryingToMove = moveX !== 0 || moveZ !== 0;
        // Valeur mémorisée dans movementLocked.
        const movementLocked = this.isMovementLocked(activePlayer);

        // Valeur mémorisée dans stamina.
        let stamina = activePlayer.stamina;
        // Valeur mémorisée dans maxStamina.
        const maxStamina = activePlayer.maxStamina || 1;
        // Valeur mémorisée dans effectiveSpeed.
        let effectiveSpeed = baseSpeed;

        // Valeur mémorisée dans isSprinting.
        const isSprinting = !movementLocked && isTryingToMove && this.input.sprint && stamina > 0.05;

        // Vérification avant d'exécuter la suite.
        if (isSprinting) {
            // Instruction nécessaire au déroulement de cette partie.
            effectiveSpeed = baseSpeed * sprintMultiplier;
            // Instruction nécessaire au déroulement de cette partie.
            stamina -= staminaDrainRate * dt;
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Instruction nécessaire au déroulement de cette partie.
            stamina += staminaRegenRate * dt;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (stamina < 0) stamina = 0;
        // Vérification avant d'exécuter la suite.
        if (stamina > maxStamina) stamina = maxStamina;
        // Mise à jour de stamina.
        activePlayer.stamina = stamina;

        // Valeur mémorisée dans movement.
        const movement = this.tackleController.updateAndMove(
            // Paramètre de l'appel ou valeur de configuration.
            activePlayer,
            // Paramètre de l'appel ou valeur de configuration.
            movementLocked ? 0 : moveX,
            // Paramètre de l'appel ou valeur de configuration.
            movementLocked ? 0 : moveZ,
            // Instruction nécessaire au déroulement de cette partie.
            effectiveSpeed
        // Fermeture du bloc ou de l'appel.
        );

        // Valeur mémorisée dans controlledPlayer.
        const controlledPlayer = movement.controlledPlayer;
        // Valeur mémorisée dans directionOpt.
        const directionOpt = movement.directionOpt;

        // Vérification avant d'exécuter la suite.
        if (!this.previousPlayerPosition) {
            // Mise à jour de previousPlayerPosition pour cet objet.
            this.previousPlayerPosition = controlledPlayer.position.clone();
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans currentPos.
        const currentPos = controlledPlayer.position.clone();
        // Valeur mémorisée dans playerMoveVelocity.
        const playerMoveVelocity = currentPos.subtract(this.previousPlayerPosition);
        // Mise à jour de previousPlayerPosition pour cet objet.
        this.previousPlayerPosition = currentPos;

        // Vérification avant d'exécuter la suite.
        if (!movementLocked && directionOpt) {
            // Mise à jour de lastDirection pour cet objet.
            this.lastDirection = directionOpt.clone();
            // Mise à jour de playerFacing pour cet objet.
            this.playerFacing = directionOpt.clone();
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            controlledPlayer,
            // Paramètre de l'appel ou valeur de configuration.
            playerFacing: this.playerFacing,
            // Paramètre de l'appel ou valeur de configuration.
            lastDirection: this.lastDirection,
            // Paramètre de l'appel ou valeur de configuration.
            playerMoveVelocity,
            // Instruction nécessaire au déroulement de cette partie.
            isSprinting
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction dispose : elle regroupe le traitement de cette partie.
    dispose() {
        // Appel de removeEventListener pour appliquer l'action prévue.
        window.removeEventListener("keydown", this._onKeyDown);
        // Appel de removeEventListener pour appliquer l'action prévue.
        window.removeEventListener("keyup", this._onKeyUp);
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Mise à jour de Player2Controller.
window.Player2Controller = Player2Controller;
