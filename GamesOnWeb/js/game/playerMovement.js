// Fonction updatePlayerMovement : elle regroupe le traitement de cette partie.
export function updatePlayerMovement(activePlayer, input, moveX, moveZ, dt, params) {
    // Valeur mémorisée dans baseSpeed.
    const baseSpeed = params.baseSpeed;
    // Valeur mémorisée dans sprintMultiplier.
    const sprintMultiplier = params.sprintMultiplier;
    // Valeur mémorisée dans staminaDrainRate.
    const staminaDrainRate = params.staminaDrainRate;
    // Valeur mémorisée dans staminaRegenRate.
    const staminaRegenRate = params.staminaRegenRate;
    // Valeur mémorisée dans tackleController.
    const tackleController = params.tackleController;
    // Valeur mémorisée dans restartState.
    const restartState = params.restartState;
    // Valeur mémorisée dans isRestartTaker.
    const isRestartTaker = params.isRestartTaker;
    // Valeur mémorisée dans sanitizeRestartDirection.
    const sanitizeRestartDirection = params.sanitizeRestartDirection;
    // Valeur mémorisée dans getDefaultRestartDirection.
    const getDefaultRestartDirection = params.getDefaultRestartDirection;

    // Valeur mémorisée dans lastDirection.
    let lastDirection = params.lastDirection;
    // Valeur mémorisée dans playerFacing.
    let playerFacing = params.playerFacing;
    // Valeur mémorisée dans previousPlayerPosition.
    let previousPlayerPosition = params.previousPlayerPosition;

    // Valeur mémorisée dans restartTakerLocked.
    const restartTakerLocked = isRestartTaker(activePlayer);

    // Valeur mémorisée dans stamina.
    let stamina = activePlayer.stamina;
    // Valeur mémorisée dans maxStamina.
    const maxStamina = activePlayer.maxStamina || 1;
    // Valeur mémorisée dans isTryingToMove.
    const isTryingToMove = (moveX !== 0 || moveZ !== 0);

    // Valeur mémorisée dans effectiveSpeed.
    let effectiveSpeed = baseSpeed;

    // Vérification avant d'exécuter la suite.
    if (!restartTakerLocked && isTryingToMove && input.sprint && stamina > 0.05) {
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
    let movement;

    // Vérification avant d'exécuter la suite.
    if (restartTakerLocked) {
        // Appel de updateAndMove pour appliquer l'action prévue.
        movement = tackleController.updateAndMove(activePlayer, 0, 0, baseSpeed);

        // Priorite au vecteur analogique (manette) calcule dans script.js
        // puis fallback clavier si absent/neutre.
        // Valeur mémorisée dans aimX.
        let aimX = Number(input.restartAimX) || 0;
        // Valeur mémorisée dans aimZ.
        let aimZ = Number(input.restartAimZ) || 0;

        // Vérification avant d'exécuter la suite.
        if (Math.abs(aimX) < 0.001) aimX = 0;
        // Vérification avant d'exécuter la suite.
        if (Math.abs(aimZ) < 0.001) aimZ = 0;

        // Vérification avant d'exécuter la suite.
        if (aimX === 0 && aimZ === 0) {
            // Vérification avant d'exécuter la suite.
            if (input.forward) aimX += 1;
            // Vérification avant d'exécuter la suite.
            if (input.backward) aimX -= 1;
            // Vérification avant d'exécuter la suite.
            if (input.left) aimZ += 1;
            // Vérification avant d'exécuter la suite.
            if (input.right) aimZ -= 1;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (aimX !== 0 || aimZ !== 0) {
            // Création de aim.
            const aim = new BABYLON.Vector3(aimX, 0, aimZ);
            // Appel de normalize pour appliquer l'action prévue.
            aim.normalize();

            // Appel de sanitizeRestartDirection pour appliquer l'action prévue.
            lastDirection = sanitizeRestartDirection(aim, restartState);
            // Appel de clone pour appliquer l'action prévue.
            playerFacing = lastDirection.clone();
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de getDefaultRestartDirection pour appliquer l'action prévue.
            lastDirection = getDefaultRestartDirection(restartState);
            // Appel de clone pour appliquer l'action prévue.
            playerFacing = lastDirection.clone();
        // Fermeture du bloc ou de l'appel.
        }
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Appel de updateAndMove pour appliquer l'action prévue.
        movement = tackleController.updateAndMove(activePlayer, moveX, moveZ, effectiveSpeed);
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans controlledPlayer.
    const controlledPlayer = movement.controlledPlayer;
    // Valeur mémorisée dans directionOpt.
    const directionOpt = movement.directionOpt;

    // Valeur mémorisée dans currentPlayerPosition.
    const currentPlayerPosition = controlledPlayer.position.clone();
    // Valeur mémorisée dans playerMoveVelocity.
    const playerMoveVelocity = currentPlayerPosition.subtract(previousPlayerPosition);
    // Instruction nécessaire au déroulement de cette partie.
    previousPlayerPosition = currentPlayerPosition;

    // Vérification avant d'exécuter la suite.
    if (!restartTakerLocked && directionOpt) {
        // Instruction nécessaire au déroulement de cette partie.
        lastDirection = directionOpt;
        // Appel de clone pour appliquer l'action prévue.
        playerFacing = lastDirection.clone();
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return {
        // Paramètre de l'appel ou valeur de configuration.
        movement,
        // Paramètre de l'appel ou valeur de configuration.
        lastDirection,
        // Paramètre de l'appel ou valeur de configuration.
        playerFacing,
        // Paramètre de l'appel ou valeur de configuration.
        playerMoveVelocity,
        // Paramètre de l'appel ou valeur de configuration.
        previousPlayerPosition,
        // Instruction nécessaire au déroulement de cette partie.
        restartTakerLocked
    // Fermeture du bloc ou de l'appel.
    };
// Fermeture du bloc ou de l'appel.
}
