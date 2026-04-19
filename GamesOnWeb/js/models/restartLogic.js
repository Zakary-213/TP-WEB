// Valeur mémorisée dans restartState.
const restartState = {
    // Paramètre de l'appel ou valeur de configuration.
    active: false,
    // Paramètre de l'appel ou valeur de configuration.
    type: null,
    // Paramètre de l'appel ou valeur de configuration.
    team: null,
    // Paramètre de l'appel ou valeur de configuration.
    taker: null,
    // Paramètre de l'appel ou valeur de configuration.
    side: null,
    // Paramètre de l'appel ou valeur de configuration.
    position: null,
    // Paramètre de l'appel ou valeur de configuration.
    exitPosition: null,
    // Paramètre de l'appel ou valeur de configuration.
    waitingForKick: false,
    // Paramètre de l'appel ou valeur de configuration.
    aiKickTime: 0,

    // Paramètre de l'appel ou valeur de configuration.
    cornerHalf: null,

    // Paramètre de l'appel ou valeur de configuration.
    aiCharging: false,
    // Paramètre de l'appel ou valeur de configuration.
    aiChargeStart: 0,
    // Paramètre de l'appel ou valeur de configuration.
    aiAimDirection: null,

    // Instruction nécessaire au déroulement de cette partie.
    phase: "idle" // idle | setup | aiming | kicked
// Fermeture du bloc ou de l'appel.
};

// Fonction resetRestartState : elle regroupe le traitement de cette partie.
function resetRestartState() {
    // Mise à jour de active.
    restartState.active = false;
    // Mise à jour de type.
    restartState.type = null;
    // Mise à jour de team.
    restartState.team = null;
    // Mise à jour de taker.
    restartState.taker = null;
    // Mise à jour de side.
    restartState.side = null;
    // Mise à jour de position.
    restartState.position = null;
    // Mise à jour de exitPosition.
    restartState.exitPosition = null;
    // Mise à jour de waitingForKick.
    restartState.waitingForKick = false;
    // Mise à jour de aiKickTime.
    restartState.aiKickTime = 0;
    // Mise à jour de cornerHalf.
    restartState.cornerHalf = null;
    // Mise à jour de aiCharging.
    restartState.aiCharging = false;
    // Mise à jour de aiChargeStart.
    restartState.aiChargeStart = 0;
    // Mise à jour de aiAimDirection.
    restartState.aiAimDirection = null;
    // Mise à jour de phase.
    restartState.phase = "idle";
// Fermeture du bloc ou de l'appel.
}

// Fonction isRestartActive : elle regroupe le traitement de cette partie.
function isRestartActive() {
    // Résultat renvoyé par la fonction.
    return restartState.active;
// Fermeture du bloc ou de l'appel.
}

// Fonction isRestartWaitingKick : elle regroupe le traitement de cette partie.
function isRestartWaitingKick() {
    // Résultat renvoyé par la fonction.
    return restartState.active && restartState.waitingForKick;
// Fermeture du bloc ou de l'appel.
}

// Fonction isRestartTaker : elle regroupe le traitement de cette partie.
function isRestartTaker(player) {
    // Résultat renvoyé par la fonction.
    return (
        // Instruction nécessaire au déroulement de cette partie.
        restartState.active &&
        // Instruction nécessaire au déroulement de cette partie.
        restartState.waitingForKick &&
        // Mise à jour de taker.
        restartState.taker === player
    // Fermeture du bloc ou de l'appel.
    );
// Fermeture du bloc ou de l'appel.
}

// Fonction isRestartForTeam : elle regroupe le traitement de cette partie.
function isRestartForTeam(team) {
    // Résultat renvoyé par la fonction.
    return isRestartWaitingKick() && restartState.team === team;
// Fermeture du bloc ou de l'appel.
}

// Fonction isRestartAgainstTeam : elle regroupe le traitement de cette partie.
function isRestartAgainstTeam(team) {
    // Résultat renvoyé par la fonction.
    return isRestartWaitingKick() && restartState.team && restartState.team !== team;
// Fermeture du bloc ou de l'appel.
}

// Fonction getRestartDecision : elle regroupe le traitement de cette partie.
function getRestartDecision(ball, myTeam, opponentTeam) {
    // Vérification avant d'exécuter la suite.
    if (!ball || !ball.position) return null;

    // Valeur mémorisée dans exitPos.
    const exitPos = ball.outExitPosition ? ball.outExitPosition.clone() : ball.position.clone();
    // Valeur mémorisée dans x.
    const x = exitPos.x;
    // Valeur mémorisée dans z.
    const z = exitPos.z;

    // Valeur mémorisée dans lastTeam.
    const lastTeam = ball.lastTouchTeam || null;

    // Valeur mémorisée dans minX.
    let minX = -49;
    // Valeur mémorisée dans maxX.
    let maxX = 49;
    // Valeur mémorisée dans minZ.
    const minZ = -29;
    // Valeur mémorisée dans maxZ.
    const maxZ = 29;

    // Valeur mémorisée dans inGoalWidth.
    const inGoalWidth = z > -7.5 && z < 7.5;
    // Vérification avant d'exécuter la suite.
    if (inGoalWidth) {
        // Instruction nécessaire au déroulement de cette partie.
        minX = -54;
        // Instruction nécessaire au déroulement de cette partie.
        maxX = 54;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (z < minZ) {
        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            type: "throwIn",
            // Paramètre de l'appel ou valeur de configuration.
            side: "top",
            // Paramètre de l'appel ou valeur de configuration.
            team: lastTeam === myTeam ? opponentTeam : myTeam,
            // Instruction nécessaire au déroulement de cette partie.
            exitPosition: exitPos
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (z > maxZ) {
        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            type: "throwIn",
            // Paramètre de l'appel ou valeur de configuration.
            side: "bottom",
            // Paramètre de l'appel ou valeur de configuration.
            team: lastTeam === myTeam ? opponentTeam : myTeam,
            // Instruction nécessaire au déroulement de cette partie.
            exitPosition: exitPos
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (x < minX) {
        // Vérification avant d'exécuter la suite.
        if (lastTeam === myTeam) {
            // Résultat renvoyé par la fonction.
            return {
                // Paramètre de l'appel ou valeur de configuration.
                type: "corner",
                // Paramètre de l'appel ou valeur de configuration.
                side: "left",
                // Paramètre de l'appel ou valeur de configuration.
                team: opponentTeam,
                // Instruction nécessaire au déroulement de cette partie.
                exitPosition: exitPos
            // Fermeture du bloc ou de l'appel.
            };
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            type: "goalKick",
            // Paramètre de l'appel ou valeur de configuration.
            side: "left",
            // Paramètre de l'appel ou valeur de configuration.
            team: myTeam,
            // Instruction nécessaire au déroulement de cette partie.
            exitPosition: exitPos
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (x > maxX) {
        // Vérification avant d'exécuter la suite.
        if (lastTeam === opponentTeam) {
            // Résultat renvoyé par la fonction.
            return {
                // Paramètre de l'appel ou valeur de configuration.
                type: "corner",
                // Paramètre de l'appel ou valeur de configuration.
                side: "right",
                // Paramètre de l'appel ou valeur de configuration.
                team: myTeam,
                // Instruction nécessaire au déroulement de cette partie.
                exitPosition: exitPos
            // Fermeture du bloc ou de l'appel.
            };
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return {
            // Paramètre de l'appel ou valeur de configuration.
            type: "goalKick",
            // Paramètre de l'appel ou valeur de configuration.
            side: "right",
            // Paramètre de l'appel ou valeur de configuration.
            team: opponentTeam,
            // Instruction nécessaire au déroulement de cette partie.
            exitPosition: exitPos
        // Fermeture du bloc ou de l'appel.
        };
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return null;
// Fermeture du bloc ou de l'appel.
}

// Fonction startRestart : elle regroupe le traitement de cette partie.
function startRestart(ball, decision, myTeam, opponentTeam, cameras) {
    // Vérification avant d'exécuter la suite.
    if (!ball || !decision) return;

    // Appel de resetBallOutState pour appliquer l'action prévue.
    resetBallOutState(ball);

    // Vérification avant d'exécuter la suite.
    if (!ball.velocity) {
        // Mise à jour de velocity.
        ball.velocity = new BABYLON.Vector3(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }
    // Appel de set pour appliquer l'action prévue.
    ball.velocity.set(0, 0, 0);

    // Mise à jour de active.
    restartState.active = true;
    // Mise à jour de type.
    restartState.type = decision.type;
    // Mise à jour de team.
    restartState.team = decision.team;
    // Mise à jour de side.
    restartState.side = decision.side;
    // Mise à jour de exitPosition.
    restartState.exitPosition = decision.exitPosition ? decision.exitPosition.clone() : ball.position.clone();
    // Mise à jour de waitingForKick.
    restartState.waitingForKick = true;
    // Mise à jour de phase.
    restartState.phase = "setup";

    // Mise à jour de restartLocked.
    ball.restartLocked = true;
    // Mise à jour de restartTaker.
    ball.restartTaker = null;

    // Vérification avant d'exécuter la suite.
    if (decision.type === "throwIn") {
        // Appel de placeThrowIn pour appliquer l'action prévue.
        placeThrowIn(ball, decision, myTeam, opponentTeam, cameras);
    // Deuxième possibilité à tester.
    } else if (decision.type === "corner") {
        // Appel de placeCorner pour appliquer l'action prévue.
        placeCorner(ball, decision, myTeam, opponentTeam, cameras);
    // Deuxième possibilité à tester.
    } else if (decision.type === "goalKick") {
        // Appel de placeGoalKick pour appliquer l'action prévue.
        placeGoalKick(ball, decision, myTeam, opponentTeam, cameras);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (decision.team && !decision.team.isPlayerControlled) {
        // Mise à jour de aiKickTime.
        restartState.aiKickTime = performance.now() + 500;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction placeThrowIn : elle regroupe le traitement de cette partie.
function placeThrowIn(ball, decision, myTeam, opponentTeam, cameras) {
    // Valeur mémorisée dans restartTeam.
    const restartTeam = decision.team;
    // Vérification avant d'exécuter la suite.
    if (!restartTeam) return;

    // Valeur mémorisée dans exitPos.
    const exitPos = decision.exitPosition || ball.position;
    // Préparation de x avec Babylon.js.
    const x = BABYLON.Scalar.Clamp(exitPos.x, -45, 45);

    // Valeur mémorisée dans playerZ.
    let playerZ;
    // Valeur mémorisée dans ballZ.
    let ballZ;

    // Vérification avant d'exécuter la suite.
    if (decision.side === "top") {
        // Instruction nécessaire au déroulement de cette partie.
        playerZ = -29.0;
        // Instruction nécessaire au déroulement de cette partie.
        ballZ = -27.8;
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Instruction nécessaire au déroulement de cette partie.
        playerZ = 29.0;
        // Instruction nécessaire au déroulement de cette partie.
        ballZ = 27.8;
    // Fermeture du bloc ou de l'appel.
    }

    // Création de taker.
    const taker = getClosestPlayerToPosition(restartTeam, new BABYLON.Vector3(x, 0, playerZ), false);
    // Vérification avant d'exécuter la suite.
    if (!taker) return;

    // Mise à jour de x.
    taker.position.x = x;
    // Mise à jour de z.
    taker.position.z = playerZ;

    // Mise à jour de x.
    ball.position.x = x;
    // Mise à jour de y.
    ball.position.y = 0.75;
    // Mise à jour de z.
    ball.position.z = ballZ;

    // Appel de orientPlayerTowardBall pour appliquer l'action prévue.
    orientPlayerTowardBall(taker, ball);

    // Mise à jour de taker.
    restartState.taker = taker;
    // Mise à jour de position.
    restartState.position = ball.position.clone();

    // Mise à jour de restartTaker.
    ball.restartTaker = taker;

    // Appel de setRestartActivePlayer pour appliquer l'action prévue.
    setRestartActivePlayer(restartTeam, taker, cameras);

    // Vérification avant d'exécuter la suite.
    if (restartTeam.lockAutoSwitch) restartTeam.lockAutoSwitch(1200);
    // Vérification avant d'exécuter la suite.
    if (restartTeam.lockTeamPossession) restartTeam.lockTeamPossession(1200);
// Fermeture du bloc ou de l'appel.
}

// Fonction placeCorner : elle regroupe le traitement de cette partie.
function placeCorner(ball, decision, myTeam, opponentTeam, cameras) {
    // Valeur mémorisée dans restartTeam.
    const restartTeam = decision.team;
    // Vérification avant d'exécuter la suite.
    if (!restartTeam) return;

    // Valeur mémorisée dans exitPos.
    const exitPos = decision.exitPosition || ball.position;

    // Valeur mémorisée dans takerX.
    let takerX, ballX;
    // Valeur mémorisée dans takerZ.
    let takerZ, ballZ;

    // Vérification avant d'exécuter la suite.
    if (decision.side === "left") {
        // Instruction nécessaire au déroulement de cette partie.
        takerX = -47.8;
        // Instruction nécessaire au déroulement de cette partie.
        ballX = -48.8;
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Instruction nécessaire au déroulement de cette partie.
        takerX = 47.8;
        // Instruction nécessaire au déroulement de cette partie.
        ballX = 48.8;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans topCorner.
    const topCorner = exitPos.z < 0;

    // Vérification avant d'exécuter la suite.
    if (topCorner) {
        // Instruction nécessaire au déroulement de cette partie.
        takerZ = -28.6;
        // Instruction nécessaire au déroulement de cette partie.
        ballZ = -27.8;
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Instruction nécessaire au déroulement de cette partie.
        takerZ = 28.6;
        // Instruction nécessaire au déroulement de cette partie.
        ballZ = 27.8;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans taker.
    const taker = getClosestPlayerToPosition(
        // Paramètre de l'appel ou valeur de configuration.
        restartTeam,
        // Appel de Vector3 pour appliquer l'action prévue.
        new BABYLON.Vector3(takerX, 0, takerZ),
        // Instruction nécessaire au déroulement de cette partie.
        false
    // Fermeture du bloc ou de l'appel.
    );
    // Vérification avant d'exécuter la suite.
    if (!taker) return;

    // Mise à jour de x.
    taker.position.x = takerX;
    // Mise à jour de z.
    taker.position.z = takerZ;

    // Mise à jour de x.
    ball.position.x = ballX;
    // Mise à jour de y.
    ball.position.y = 0.75;
    // Mise à jour de z.
    ball.position.z = ballZ;

    // Appel de orientPlayerTowardBall pour appliquer l'action prévue.
    orientPlayerTowardBall(taker, ball);

    // Mise à jour de taker.
    restartState.taker = taker;
    // Mise à jour de position.
    restartState.position = ball.position.clone();
    // Mise à jour de cornerHalf.
    restartState.cornerHalf = topCorner ? "top" : "bottom";

    // Mise à jour de restartTaker.
    ball.restartTaker = taker;

    // Appel de setRestartActivePlayer pour appliquer l'action prévue.
    setRestartActivePlayer(restartTeam, taker, cameras);

    // Vérification avant d'exécuter la suite.
    if (restartTeam.lockAutoSwitch) restartTeam.lockAutoSwitch(1200);
    // Vérification avant d'exécuter la suite.
    if (restartTeam.lockTeamPossession) restartTeam.lockTeamPossession(1200);
// Fermeture du bloc ou de l'appel.
}

// Fonction placeGoalKick : elle regroupe le traitement de cette partie.
function placeGoalKick(ball, decision, myTeam, opponentTeam, cameras) {
    // Valeur mémorisée dans restartTeam.
    const restartTeam = decision.team;
    // Vérification avant d'exécuter la suite.
    if (!restartTeam) return;

    // Valeur mémorisée dans goalkeeper.
    const goalkeeper = getGoalkeeper(restartTeam);
    // Vérification avant d'exécuter la suite.
    if (!goalkeeper) return;

    // Valeur mémorisée dans playerX.
    let playerX, ballX;

    // Vérification avant d'exécuter la suite.
    if (decision.side === "left") {
        // Instruction nécessaire au déroulement de cette partie.
        playerX = -41.5;
        // Instruction nécessaire au déroulement de cette partie.
        ballX = -40.0;
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Instruction nécessaire au déroulement de cette partie.
        playerX = 41.5;
        // Instruction nécessaire au déroulement de cette partie.
        ballX = 40.0;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans playerZ.
    const playerZ = 0;
    // Valeur mémorisée dans ballZ.
    const ballZ = 0;

    // Mise à jour de x.
    goalkeeper.position.x = playerX;
    // Mise à jour de z.
    goalkeeper.position.z = playerZ;

    // Mise à jour de x.
    ball.position.x = ballX;
    // Mise à jour de y.
    ball.position.y = 0.75;
    // Mise à jour de z.
    ball.position.z = ballZ;

    // Appel de orientPlayerTowardBall pour appliquer l'action prévue.
    orientPlayerTowardBall(goalkeeper, ball);

    // Mise à jour de taker.
    restartState.taker = goalkeeper;
    // Mise à jour de position.
    restartState.position = ball.position.clone();

    // Mise à jour de restartTaker.
    ball.restartTaker = goalkeeper;

    // Appel de setRestartActivePlayer pour appliquer l'action prévue.
    setRestartActivePlayer(restartTeam, goalkeeper, cameras);

    // Vérification avant d'exécuter la suite.
    if (restartTeam.lockAutoSwitch) restartTeam.lockAutoSwitch(1200);
    // Vérification avant d'exécuter la suite.
    if (restartTeam.lockTeamPossession) restartTeam.lockTeamPossession(1200);
// Fermeture du bloc ou de l'appel.
}

// Fonction setRestartActivePlayer : elle regroupe le traitement de cette partie.
function setRestartActivePlayer(team, taker, cameras) {
    // Vérification avant d'exécuter la suite.
    if (!team || !taker) return;

    // Vérification avant d'exécuter la suite.
    if (team.switchPlayerSmooth) {
        // Appel de switchPlayerSmooth pour appliquer l'action prévue.
        team.switchPlayerSmooth(taker, cameras, team.scene, 160);
    // Deuxième possibilité à tester.
    } else if (team.switchPlayer) {
        // Appel de switchPlayer pour appliquer l'action prévue.
        team.switchPlayer(taker, cameras);
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Mise à jour de activePlayer.
        team.activePlayer = taker;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction getClosestPlayerToPosition : elle regroupe le traitement de cette partie.
function getClosestPlayerToPosition(team, targetPos, excludeGK = false) {
    // Vérification avant d'exécuter la suite.
    if (!team || !team.players || !targetPos) return null;

    // Valeur mémorisée dans closest.
    let closest = null;
    // Valeur mémorisée dans bestDist.
    let bestDist = Infinity;

    // Appel de forEach pour appliquer l'action prévue.
    team.players.forEach(player => {
        // Vérification avant d'exécuter la suite.
        if (!player || !player.position) return;
        // Vérification avant d'exécuter la suite.
        if (excludeGK && player.role === "GK") return;

        // Préparation de dist avec Babylon.js.
        const dist = BABYLON.Vector3.Distance(player.position, targetPos);
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

// Fonction getGoalkeeper : elle regroupe le traitement de cette partie.
function getGoalkeeper(team) {
    // Vérification avant d'exécuter la suite.
    if (!team || !team.players) return null;
    // Résultat renvoyé par la fonction.
    return team.players.find(player => player && player.role === "GK") || null;
// Fermeture du bloc ou de l'appel.
}

// Fonction orientPlayerTowardBall : elle regroupe le traitement de cette partie.
function orientPlayerTowardBall(player, ball) {
    // Vérification avant d'exécuter la suite.
    if (!player || !ball || !player.model) return;

    // Valeur mémorisée dans dir.
    const dir = ball.position.subtract(player.position);
    // Mise à jour de y.
    dir.y = 0;

    // Vérification avant d'exécuter la suite.
    if (dir.lengthSquared() === 0) return;

    // Appel de normalize pour appliquer l'action prévue.
    dir.normalize();
    // Appel de orientPlayerTowardDirection pour appliquer l'action prévue.
    orientPlayerTowardDirection(player, dir);
// Fermeture du bloc ou de l'appel.
}

// Fonction orientPlayerTowardDirection : elle regroupe le traitement de cette partie.
function orientPlayerTowardDirection(player, dir) {
    // Vérification avant d'exécuter la suite.
    if (!player || !dir) return;

    // Valeur mémorisée dans flat.
    const flat = dir.clone();
    // Mise à jour de y.
    flat.y = 0;

    // Vérification avant d'exécuter la suite.
    if (flat.lengthSquared() === 0) return;
    // Appel de normalize pour appliquer l'action prévue.
    flat.normalize();

    // Mise à jour de facingDirection.
    player.facingDirection = flat.clone();

    // Vérification avant d'exécuter la suite.
    if (player.model) {
        // Mise à jour de y.
        player.model.rotation.y = Math.atan2(flat.x, flat.z);
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction sanitizeRestartDirection : elle regroupe le traitement de cette partie.
function sanitizeRestartDirection(direction, state) {
    // Préparation de dir avec Babylon.js.
    let dir = direction ? direction.clone() : BABYLON.Vector3.Zero();
    // Mise à jour de y.
    dir.y = 0;

    // Vérification avant d'exécuter la suite.
    if (dir.lengthSquared() === 0) {
        // Appel de getDefaultRestartDirection pour appliquer l'action prévue.
        dir = getDefaultRestartDirection(state);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (state.type === "throwIn") {
        // Vérification avant d'exécuter la suite.
        if (state.side === "top" && dir.z <= 0) dir.z = Math.abs(dir.z) || 0.35;
        // Vérification avant d'exécuter la suite.
        if (state.side === "bottom" && dir.z >= 0) dir.z = -Math.abs(dir.z) || -0.35;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (state.type === "corner") {
        // Valeur mémorisée dans topHalf.
        const topHalf = state.cornerHalf === "top";

        // Vérification avant d'exécuter la suite.
        if (state.side === "left" && dir.x <= 0) dir.x = Math.abs(dir.x) || 0.35;
        // Vérification avant d'exécuter la suite.
        if (state.side === "right" && dir.x >= 0) dir.x = -Math.abs(dir.x) || -0.35;

        // Vérification avant d'exécuter la suite.
        if (topHalf && dir.z <= 0) dir.z = Math.abs(dir.z) || 0.35;
        // Vérification avant d'exécuter la suite.
        if (!topHalf && dir.z >= 0) dir.z = -Math.abs(dir.z) || -0.35;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (state.type === "goalKick") {
        // Vérification avant d'exécuter la suite.
        if (state.side === "left" && dir.x <= 0) dir.x = Math.abs(dir.x) || 0.4;
        // Vérification avant d'exécuter la suite.
        if (state.side === "right" && dir.x >= 0) dir.x = -Math.abs(dir.x) || -0.4;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (dir.lengthSquared() === 0) {
        // Appel de getDefaultRestartDirection pour appliquer l'action prévue.
        dir = getDefaultRestartDirection(state);
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de normalize pour appliquer l'action prévue.
    dir.normalize();
    // Résultat renvoyé par la fonction.
    return dir;
// Fermeture du bloc ou de l'appel.
}

// Fonction getDefaultRestartDirection : elle regroupe le traitement de cette partie.
function getDefaultRestartDirection(state) {
    // Vérification avant d'exécuter la suite.
    if (!state) return new BABYLON.Vector3(1, 0, 0);

    // Vérification avant d'exécuter la suite.
    if (state.type === "throwIn") {
        // Résultat renvoyé par la fonction.
        return state.side === "top"
            // Appel de Vector3 pour appliquer l'action prévue.
            ? new BABYLON.Vector3(0.6, 0, 1)
            // Appel de Vector3 pour appliquer l'action prévue.
            : new BABYLON.Vector3(0.6, 0, -1);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (state.type === "corner") {
        // Valeur mémorisée dans topHalf.
        const topHalf = state.cornerHalf === "top";

        // Vérification avant d'exécuter la suite.
        if (state.side === "left") {
            // Résultat renvoyé par la fonction.
            return topHalf
                // Appel de Vector3 pour appliquer l'action prévue.
                ? new BABYLON.Vector3(1, 0, 1)
                // Appel de Vector3 pour appliquer l'action prévue.
                : new BABYLON.Vector3(1, 0, -1);
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Résultat renvoyé par la fonction.
            return topHalf
                // Appel de Vector3 pour appliquer l'action prévue.
                ? new BABYLON.Vector3(-1, 0, 1)
                // Appel de Vector3 pour appliquer l'action prévue.
                : new BABYLON.Vector3(-1, 0, -1);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (state.type === "goalKick") {
        // Résultat renvoyé par la fonction.
        return state.side === "left"
            // Appel de Vector3 pour appliquer l'action prévue.
            ? new BABYLON.Vector3(1, 0, 0.15)
            // Appel de Vector3 pour appliquer l'action prévue.
            : new BABYLON.Vector3(-1, 0, 0.15);
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return new BABYLON.Vector3(1, 0, 0);
// Fermeture du bloc ou de l'appel.
}

// Fonction getRestartClearanceRadius : elle regroupe le traitement de cette partie.
function getRestartClearanceRadius() {
    // Vérification avant d'exécuter la suite.
    if (!isRestartWaitingKick()) return 0;
    // Résultat renvoyé par la fonction.
    return restartState.type === "goalKick" ? 7.0 : 4.5;
// Fermeture du bloc ou de l'appel.
}

// Fonction getRestartSafeRadius : elle regroupe le traitement de cette partie.
function getRestartSafeRadius() {
    // Vérification avant d'exécuter la suite.
    if (!isRestartWaitingKick()) return 0;
    // Résultat renvoyé par la fonction.
    return restartState.type === "goalKick" ? 9.0 : 6.0;
// Fermeture du bloc ou de l'appel.
}

// Fonction updateTeamForRestart : elle regroupe le traitement de cette partie.
function updateTeamForRestart(team, ball) {
    // Vérification avant d'exécuter la suite.
    if (!isRestartWaitingKick() || !team || !team.players || !restartState.position) return false;

    // Valeur mémorisée dans taker.
    const taker = restartState.taker;
    // Valeur mémorisée dans ballPos.
    const ballPos = restartState.position.clone();
    // Valeur mémorisée dans isTakerTeam.
    const isTakerTeam = restartState.team === team;

    // Mise à jour de ballChaser.
    team.ballChaser = null;

    // Vérification avant d'exécuter la suite.
    if ("aiControlledPlayer" in team) {
        // Mise à jour de aiControlledPlayer.
        team.aiControlledPlayer = taker;
    // Fermeture du bloc ou de l'appel.
    }
    // Vérification avant d'exécuter la suite.
    if ("goalkeeperLocked" in team) {
        // Mise à jour de goalkeeperLocked.
        team.goalkeeperLocked = false;
    // Fermeture du bloc ou de l'appel.
    }
    // Vérification avant d'exécuter la suite.
    if ("goalkeeperClaiming" in team) {
        // Mise à jour de goalkeeperClaiming.
        team.goalkeeperClaiming = false;
    // Fermeture du bloc ou de l'appel.
    }
    // Vérification avant d'exécuter la suite.
    if ("aiShotCharging" in team) {
        // Mise à jour de aiShotCharging.
        team.aiShotCharging = false;
        // Mise à jour de aiShotCarrier.
        team.aiShotCarrier = null;
        // Mise à jour de aiShotDirection.
        team.aiShotDirection = null;
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de forEach pour appliquer l'action prévue.
    team.players.forEach(player => {
        // Vérification avant d'exécuter la suite.
        if (!player) return;

        // tireur figé
        // Vérification avant d'exécuter la suite.
        if (player === taker) {
            // Vérification avant d'exécuter la suite.
            if (player.playAnimation) player.playAnimation("idle");
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // joueur humain actif jamais piloté par l'IA
        // Vérification avant d'exécuter la suite.
        if (team.isPlayerControlled && player === team.activePlayer) {
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // GK ne monte pas sur touche / corner
        // Vérification avant d'exécuter la suite.
        if (player.role === "GK" && restartState.type !== "goalKick") {
            // Valeur mémorisée dans gkHold.
            const gkHold = player.homePosition.clone();
            // Appel de movePlayerTowards pour appliquer l'action prévue.
            team.movePlayerTowards(player, gkHold, 0.04);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans target.
        let target;

        // Vérification avant d'exécuter la suite.
        if (isTakerTeam) {
            // Appel de getDynamicSupportTarget pour appliquer l'action prévue.
            target = getDynamicSupportTarget(team, player, ballPos);
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de getDynamicMarkingTarget pour appliquer l'action prévue.
            target = getDynamicMarkingTarget(team, player, ballPos, restartState.team);
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!target) return;

        // Mise à jour de x.
        target.x = Math.max(player.minX, Math.min(player.maxX, target.x));
        // Mise à jour de z.
        target.z = Math.max(player.minZ, Math.min(player.maxZ, target.z));

        // Valeur mémorisée dans speed.
        const speed = isTakerTeam ? 0.075 : 0.05;
        // Appel de movePlayerTowards pour appliquer l'action prévue.
        team.movePlayerTowards(player, target, speed);
    // Fermeture du bloc ou de l'appel.
    });

    // Résultat renvoyé par la fonction.
    return true;
// Fermeture du bloc ou de l'appel.
}

// Fonction scoreRestartPassTarget : elle regroupe le traitement de cette partie.
function scoreRestartPassTarget(team, taker, candidate, ball) {
    // Vérification avant d'exécuter la suite.
    if (!team || !taker || !candidate || !candidate.position || !ball || !ball.position) return -Infinity;
    // Vérification avant d'exécuter la suite.
    if (candidate === taker) return -Infinity;

    // Valeur mémorisée dans toMate.
    const toMate = candidate.position.subtract(ball.position);
    // Valeur mémorisée dans dist.
    const dist = toMate.length();

    // Vérification avant d'exécuter la suite.
    if (restartState.type === "throwIn" && (dist < 4 || dist > 20)) return -Infinity;
    // Vérification avant d'exécuter la suite.
    if (restartState.type === "corner" && (dist < 4 || dist > 28)) return -Infinity;
    // Vérification avant d'exécuter la suite.
    if (restartState.type === "goalKick" && (dist < 6 || dist > 34)) return -Infinity;

    // Valeur mémorisée dans score.
    let score = 100 - dist;

    // Vérification avant d'exécuter la suite.
    if (candidate.role === "ATT") score += 8;
    // Vérification avant d'exécuter la suite.
    if (candidate.role === "DEF") score += 4;

    // Vérification avant d'exécuter la suite.
    if (restartState.type === "goalKick") {
        // Vérification avant d'exécuter la suite.
        if (restartState.side === "left" && candidate.position.x > ball.position.x) score += 18;
        // Vérification avant d'exécuter la suite.
        if (restartState.side === "right" && candidate.position.x < ball.position.x) score += 18;
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Vérification avant d'exécuter la suite.
        if (restartState.side === "left" && candidate.position.x > ball.position.x) score += 8;
        // Vérification avant d'exécuter la suite.
        if (restartState.side === "right" && candidate.position.x < ball.position.x) score += 8;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans opponents.
    const opponents = team.opponents || [];
    // Appel de forEach pour appliquer l'action prévue.
    opponents.forEach(op => {
        // Vérification avant d'exécuter la suite.
        if (!op || !op.position) return;

        // Préparation de d avec Babylon.js.
        const d = BABYLON.Vector3.Distance(op.position, candidate.position);
        // Vérification avant d'exécuter la suite.
        if (d < 10) {
            // Instruction nécessaire au déroulement de cette partie.
            score -= (10 - d) * 5.5;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });

    // Valeur mémorisée dans seg.
    const seg = candidate.position.subtract(ball.position);
    // Valeur mémorisée dans segLenSq.
    const segLenSq = seg.lengthSquared();

    // Vérification avant d'exécuter la suite.
    if (segLenSq > 0.001) {
        // Appel de forEach pour appliquer l'action prévue.
        opponents.forEach(op => {
            // Vérification avant d'exécuter la suite.
            if (!op || !op.position) return;

            // Valeur mémorisée dans ap.
            const ap = op.position.subtract(ball.position);
            // Préparation de t avec Babylon.js.
            const t = BABYLON.Scalar.Clamp(BABYLON.Vector3.Dot(ap, seg) / segLenSq, 0, 1);
            // Valeur mémorisée dans proj.
            const proj = ball.position.add(seg.scale(t));
            // Préparation de dLine avec Babylon.js.
            const dLine = BABYLON.Vector3.Distance(op.position, proj);

            // Vérification avant d'exécuter la suite.
            if (dLine < 2.2) {
                // Instruction nécessaire au déroulement de cette partie.
                score -= (2.2 - dLine) * 25;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return score;
// Fermeture du bloc ou de l'appel.
}

// Fonction findBestRestartPassTarget : elle regroupe le traitement de cette partie.
function findBestRestartPassTarget(team, taker, ball) {
    // Vérification avant d'exécuter la suite.
    if (!team || !team.players) return null;

    // Valeur mémorisée dans best.
    let best = null;
    // Valeur mémorisée dans bestScore.
    let bestScore = -Infinity;

    // Appel de forEach pour appliquer l'action prévue.
    team.players.forEach(player => {
        // Vérification avant d'exécuter la suite.
        if (!player || player === taker) return;

        // Valeur mémorisée dans score.
        const score = scoreRestartPassTarget(team, taker, player, ball);

        // Vérification avant d'exécuter la suite.
        if (score > bestScore) {
            // Instruction nécessaire au déroulement de cette partie.
            bestScore = score;
            // Instruction nécessaire au déroulement de cette partie.
            best = player;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });

    // Résultat renvoyé par la fonction.
    return best;
// Fermeture du bloc ou de l'appel.
}

// Fonction takeRestartKick : elle regroupe le traitement de cette partie.
function takeRestartKick(ball, direction, gaugeForce) {
    // Vérification avant d'exécuter la suite.
    if (!ball || !restartState.active || !restartState.waitingForKick || !restartState.taker) {
        // Résultat renvoyé par la fonction.
        return;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans cleanDir.
    const cleanDir = sanitizeRestartDirection(direction, restartState);

    // Vérification avant d'exécuter la suite.
    if (!ball.velocity) {
        // Mise à jour de velocity.
        ball.velocity = new BABYLON.Vector3(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans force.
    let force = gaugeForce;

    // Vérification avant d'exécuter la suite.
    if (restartState.type === "throwIn") {
        // Vérification avant d'exécuter la suite.
        if (gaugeForce <= 30) force = 30;
        // Deuxième possibilité à tester.
        else if (gaugeForce <= 45) force = 45;
        // Cas utilisé quand les tests précédents échouent.
        else force = 65;
    // Deuxième possibilité à tester.
    } else if (restartState.type === "corner") {
        // Vérification avant d'exécuter la suite.
        if (gaugeForce <= 30) force = 30;
        // Deuxième possibilité à tester.
        else if (gaugeForce <= 45) force = 45;
        // Cas utilisé quand les tests précédents échouent.
        else force = 60;
    // Deuxième possibilité à tester.
    } else if (restartState.type === "goalKick") {
        // Vérification avant d'exécuter la suite.
        if (gaugeForce <= 30) force = 32;
        // Deuxième possibilité à tester.
        else if (gaugeForce <= 45) force = 46;
        // Cas utilisé quand les tests précédents échouent.
        else force = 60;
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de lastKicker.
    ball.lastKicker = restartState.taker;
    // Mise à jour de lastTouchTeam.
    ball.lastTouchTeam = restartState.team;

    // Instruction nécessaire au déroulement de cette partie.
    ball.position.x += cleanDir.x * 0.9;
    // Instruction nécessaire au déroulement de cette partie.
    ball.position.z += cleanDir.z * 0.9;

    // Mise à jour de velocity.
    ball.velocity = cleanDir.scale(force);

    // Vérification avant d'exécuter la suite.
    if (window.matchAudio && typeof window.matchAudio.playKick === "function") {
        // Appel de playKick pour appliquer l'action prévue.
        window.matchAudio.playKick();
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de phase.
    restartState.phase = "kicked";
    // Vérification avant d'exécuter la suite.
    if (restartState.team) {
        // Mise à jour de switchLockUntil.
        restartState.team.switchLockUntil = 0;
        // Mise à jour de teamPossessionLockUntil.
        restartState.team.teamPossessionLockUntil = performance.now() + 250;
    // Fermeture du bloc ou de l'appel.
    }
    // Appel de endRestart pour appliquer l'action prévue.
    endRestart(ball);
// Fermeture du bloc ou de l'appel.
}

// Fonction endRestart : elle regroupe le traitement de cette partie.
function endRestart(ball) {
    // Vérification avant d'exécuter la suite.
    if (!ball) return;

    // Mise à jour de restartLocked.
    ball.restartLocked = false;
    // Mise à jour de restartTaker.
    ball.restartTaker = null;

    // Mise à jour de pushLockUntil.
    ball.pushLockUntil = performance.now() + 180;
    // Mise à jour de ignorePlayerCollisionUntil.
    ball.ignorePlayerCollisionUntil = performance.now() + 180;

    // Appel de resetRestartState pour appliquer l'action prévue.
    resetRestartState();
// Fermeture du bloc ou de l'appel.
}

// Fonction updateAIRestart : elle regroupe le traitement de cette partie.
function updateAIRestart(ball) {
    // Vérification avant d'exécuter la suite.
    if (!isRestartWaitingKick()) return;
    // Vérification avant d'exécuter la suite.
    if (!restartState.team || restartState.team.isPlayerControlled) return;
    // Vérification avant d'exécuter la suite.
    if (!restartState.taker) return;

    // Valeur mémorisée dans now.
    const now = performance.now();
    // Vérification avant d'exécuter la suite.
    if (now < restartState.aiKickTime) return;

    // Valeur mémorisée dans taker.
    const taker = restartState.taker;
    // Valeur mémorisée dans targetMate.
    const targetMate = findBestRestartPassTarget(restartState.team, taker, ball);

    // Valeur mémorisée dans baseDir.
    let baseDir;
    // Vérification avant d'exécuter la suite.
    if (targetMate) {
        // Appel de subtract pour appliquer l'action prévue.
        baseDir = targetMate.position.subtract(ball.position);
        // Mise à jour de y.
        baseDir.y = 0;
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Appel de getDefaultRestartDirection pour appliquer l'action prévue.
        baseDir = getDefaultRestartDirection(restartState);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (baseDir.lengthSquared() === 0) {
        // Appel de getDefaultRestartDirection pour appliquer l'action prévue.
        baseDir = getDefaultRestartDirection(restartState);
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de normalize pour appliquer l'action prévue.
    baseDir.normalize();

    // Vérification avant d'exécuter la suite.
    if (!restartState.aiCharging) {
        // Mise à jour de aiCharging.
        restartState.aiCharging = true;
        // Mise à jour de aiChargeStart.
        restartState.aiChargeStart = now;
        // Mise à jour de phase.
        restartState.phase = "aiming";
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans t.
    const t = (now - restartState.aiChargeStart) / 1000;
    // Valeur mémorisée dans scan.
    const scan = Math.sin(t * 3.4) * 0.32;
    // Valeur mémorisée dans cos.
    const cos = Math.cos(scan);
    // Valeur mémorisée dans sin.
    const sin = Math.sin(scan);

    // Création de scannedDir.
    let scannedDir = new BABYLON.Vector3(
        // Paramètre de l'appel ou valeur de configuration.
        baseDir.x * cos - baseDir.z * sin,
        // Paramètre de l'appel ou valeur de configuration.
        0,
        // Instruction nécessaire au déroulement de cette partie.
        baseDir.x * sin + baseDir.z * cos
    // Fermeture du bloc ou de l'appel.
    );

    // Appel de sanitizeRestartDirection pour appliquer l'action prévue.
    scannedDir = sanitizeRestartDirection(scannedDir, restartState);
    // Mise à jour de aiAimDirection.
    restartState.aiAimDirection = scannedDir.clone();

    // Appel de orientPlayerTowardDirection pour appliquer l'action prévue.
    orientPlayerTowardDirection(taker, restartState.aiAimDirection);

    // Valeur mémorisée dans chargeDuration.
    const chargeDuration = now - restartState.aiChargeStart;
    // Vérification avant d'exécuter la suite.
    if (chargeDuration < 900) return;

    // Valeur mémorisée dans fakeGaugeForce.
    let fakeGaugeForce = 45;
    // Vérification avant d'exécuter la suite.
    if (restartState.type === "corner") fakeGaugeForce = 60;
    // Vérification avant d'exécuter la suite.
    if (restartState.type === "goalKick") fakeGaugeForce = 60;

    // Appel de takeRestartKick pour appliquer l'action prévue.
    takeRestartKick(ball, restartState.aiAimDirection, fakeGaugeForce);
// Fermeture du bloc ou de l'appel.
}

// Fonction enforceRestartClearance : elle regroupe le traitement de cette partie.
function enforceRestartClearance(ball, myTeam, opponentTeam) {
    // Vérification avant d'exécuter la suite.
    if (!isRestartWaitingKick()) return;
    // Vérification avant d'exécuter la suite.
    if (!restartState.taker || !ball || !ball.position) return;

    // Valeur mémorisée dans radius.
    const radius = getRestartClearanceRadius();

    // Valeur mémorisée dans allPlayers.
    const allPlayers = [
        // Paramètre de l'appel ou valeur de configuration.
        ...(myTeam?.players || []),
        // Instruction nécessaire au déroulement de cette partie.
        ...(opponentTeam?.players || [])
    // Fermeture du bloc ou de l'appel.
    ];

    // Appel de forEach pour appliquer l'action prévue.
    allPlayers.forEach(player => {
        // Vérification avant d'exécuter la suite.
        if (!player || !player.position) return;
        // Vérification avant d'exécuter la suite.
        if (player === restartState.taker) return;

        // Valeur mémorisée dans dx.
        const dx = player.position.x - ball.position.x;
        // Valeur mémorisée dans dz.
        const dz = player.position.z - ball.position.z;
        // Valeur mémorisée dans dist.
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Vérification avant d'exécuter la suite.
        if (dist < radius) {
            // Valeur mémorisée dans nx.
            let nx = 0;
            // Valeur mémorisée dans nz.
            let nz = 0;

            // Vérification avant d'exécuter la suite.
            if (dist > 0.001) {
                // Instruction nécessaire au déroulement de cette partie.
                nx = dx / dist;
                // Instruction nécessaire au déroulement de cette partie.
                nz = dz / dist;
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Instruction nécessaire au déroulement de cette partie.
                nx = player.side === 1 ? -1 : 1;
                // Instruction nécessaire au déroulement de cette partie.
                nz = 0;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans push.
            const push = radius - dist;
            // Instruction nécessaire au déroulement de cette partie.
            player.position.x += nx * push;
            // Instruction nécessaire au déroulement de cette partie.
            player.position.z += nz * push;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });
// Fermeture du bloc ou de l'appel.
}

// Fonction spreadRestartTargets : elle regroupe le traitement de cette partie.
function spreadRestartTargets(targets, minSpacing = 5.5) {
    // Vérification avant d'exécuter la suite.
    if (!targets || targets.length === 0) return targets;

    // Fonction result stockée pour être rappelée plus tard.
    const result = targets.map(t => t.clone());

    // Parcours de plusieurs valeurs.
    for (let pass = 0; pass < 4; pass++) {
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < result.length; i++) {
            // Parcours de plusieurs valeurs.
            for (let j = i + 1; j < result.length; j++) {
                // Valeur mémorisée dans a.
                const a = result[i];
                // Valeur mémorisée dans b.
                const b = result[j];

                // Valeur mémorisée dans dx.
                const dx = b.x - a.x;
                // Valeur mémorisée dans dz.
                const dz = b.z - a.z;
                // Valeur mémorisée dans dist.
                const dist = Math.sqrt(dx * dx + dz * dz);

                // Vérification avant d'exécuter la suite.
                if (dist < minSpacing) {
                    // Valeur mémorisée dans nx.
                    const nx = dist > 0.001 ? dx / dist : 0;
                    // Valeur mémorisée dans nz.
                    const nz = dist > 0.001 ? dz / dist : 1;

                    // Valeur mémorisée dans push.
                    const push = (minSpacing - dist) * 0.5;

                    // Instruction nécessaire au déroulement de cette partie.
                    a.x -= nx * push;
                    // Instruction nécessaire au déroulement de cette partie.
                    a.z -= nz * push;

                    // Instruction nécessaire au déroulement de cette partie.
                    b.x += nx * push;
                    // Instruction nécessaire au déroulement de cette partie.
                    b.z += nz * push;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return result;
// Fermeture du bloc ou de l'appel.
}

// Fonction getDynamicSupportTarget : elle regroupe le traitement de cette partie.
function getDynamicSupportTarget(team, player, ballPos) {
    // Valeur mémorisée dans t.
    const t = performance.now() * 0.0012;
    // Valeur mémorisée dans side.
    const side = player.side || 1;

    // le GK ne monte jamais sur touche/corner
    // Vérification avant d'exécuter la suite.
    if (player.role === "GK" && restartState.type !== "goalKick") {
        // Résultat renvoyé par la fonction.
        return player.homePosition.clone();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction fieldPlayers stockée pour être rappelée plus tard.
    const fieldPlayers = team.players.filter(p => p && p.role !== "GK");
    // Valeur mémorisée dans fieldIndex.
    const fieldIndex = Math.max(0, fieldPlayers.indexOf(player));

    // Valeur mémorisée dans target.
    let target = player.homePosition.clone();

    // Vérification avant d'exécuter la suite.
    if (restartState.type === "throwIn") {
        // Répartition type :
        // 0 = solution courte haute
        // 1 = solution courte basse
        // 2 = solution intermédiaire au coeur du jeu
        // 3 = solution plus lointaine / opposée

        // Vérification avant d'exécuter la suite.
        if (fieldIndex === 0) {
            // Mise à jour de x.
            target.x = ballPos.x + side * 8;
            // Mise à jour de z.
            target.z = ballPos.z - 10;
        // Fermeture du bloc ou de l'appel.
        }
        // Deuxième possibilité à tester.
        else if (fieldIndex === 1) {
            // Mise à jour de x.
            target.x = ballPos.x + side * 8;
            // Mise à jour de z.
            target.z = ballPos.z + 10;
        // Fermeture du bloc ou de l'appel.
        }
        // Deuxième possibilité à tester.
        else if (fieldIndex === 2) {
            // on garde une zone plus intérieure sur le terrain
            // Mise à jour de x.
            target.x = player.homePosition.x + side * 8;
            // Mise à jour de z.
            target.z = player.homePosition.z * 0.6;
        // Fermeture du bloc ou de l'appel.
        }
        // Cas utilisé quand les tests précédents échouent.
        else {
            // joueur plus loin, plus utile comme solution de renversement
            // Mise à jour de x.
            target.x = player.homePosition.x + side * 12;
            // Mise à jour de z.
            target.z = player.homePosition.z;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (restartState.type === "corner") {
        // Valeur mémorisée dans inwardX.
        const inwardX = restartState.side === "left" ? 1 : -1;

        // Vérification avant d'exécuter la suite.
        if (fieldIndex === 0) {
            // Mise à jour de x.
            target.x = ballPos.x + inwardX * 10;
            // Mise à jour de z.
            target.z = ballPos.z + (restartState.cornerHalf === "top" ? 8 : -8);
        // Fermeture du bloc ou de l'appel.
        }
        // Deuxième possibilité à tester.
        else if (fieldIndex === 1) {
            // Mise à jour de x.
            target.x = ballPos.x + inwardX * 16;
            // Mise à jour de z.
            target.z = restartState.cornerHalf === "top" ? -5 : 5;
        // Fermeture du bloc ou de l'appel.
        }
        // Deuxième possibilité à tester.
        else if (fieldIndex === 2) {
            // Mise à jour de x.
            target.x = player.homePosition.x + inwardX * 10;
            // Mise à jour de z.
            target.z = player.homePosition.z * 0.7;
        // Fermeture du bloc ou de l'appel.
        }
        // Cas utilisé quand les tests précédents échouent.
        else {
            // Mise à jour de x.
            target.x = player.homePosition.x;
            // Mise à jour de z.
            target.z = player.homePosition.z;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (restartState.type === "goalKick") {
        // Valeur mémorisée dans dirX.
        const dirX = restartState.side === "left" ? 1 : -1;

        // Vérification avant d'exécuter la suite.
        if (player.role === "DEF") {
            // Mise à jour de x.
            target.x = player.homePosition.x + dirX * 8;
            // Mise à jour de z.
            target.z = player.homePosition.z < 0 ? -16 : 16;
        // Deuxième possibilité à tester.
        } else if (player.role === "ATT") {
            // Mise à jour de x.
            target.x = player.homePosition.x + dirX * 10;
            // Mise à jour de z.
            target.z = player.homePosition.z < 0 ? -8 : 8;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // mouvement vivant autour de la zone choisie
    // Appel de sin pour appliquer l'action prévue.
    target.x += Math.sin(t + fieldIndex * 1.7) * 2.4;
    // Appel de cos pour appliquer l'action prévue.
    target.z += Math.cos(t * 1.15 + fieldIndex * 2.1) * 3.0;

    // sécurité autour du ballon seulement pour les solutions courtes
    // Vérification avant d'exécuter la suite.
    if (restartState.type === "throwIn" && fieldIndex <= 1) {
        // Valeur mémorisée dans dx.
        const dx = target.x - ballPos.x;
        // Valeur mémorisée dans dz.
        const dz = target.z - ballPos.z;
        // Valeur mémorisée dans dist.
        const dist = Math.sqrt(dx * dx + dz * dz);
        // Valeur mémorisée dans safeR.
        const safeR = getRestartSafeRadius() + 1.0;

        // Vérification avant d'exécuter la suite.
        if (dist < safeR) {
            // Valeur mémorisée dans nx.
            const nx = dist > 0.001 ? dx / dist : side;
            // Valeur mémorisée dans nz.
            const nz = dist > 0.001 ? dz / dist : (fieldIndex === 0 ? -1 : 1);
            // Mise à jour de x.
            target.x = ballPos.x + nx * safeR;
            // Mise à jour de z.
            target.z = ballPos.z + nz * safeR;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de x.
    target.x = Math.max(player.minX, Math.min(player.maxX, target.x));
    // Mise à jour de z.
    target.z = Math.max(player.minZ, Math.min(player.maxZ, target.z));

    // Résultat renvoyé par la fonction.
    return target;
// Fermeture du bloc ou de l'appel.
}

// Fonction getDynamicMarkingTarget : elle regroupe le traitement de cette partie.
function getDynamicMarkingTarget(team, player, ballPos, takerTeam) {
    // Vérification avant d'exécuter la suite.
    if (!takerTeam || !takerTeam.players) {
        // Résultat renvoyé par la fonction.
        return player.homePosition.clone();
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans taker.
    const taker = restartState.taker;

    // Fonction candidates stockée pour être rappelée plus tard.
    const candidates = takerTeam.players.filter(p => {
        // Vérification avant d'exécuter la suite.
        if (!p || !p.position) return false;
        // Vérification avant d'exécuter la suite.
        if (p === taker) return false;
        // Vérification avant d'exécuter la suite.
        if (restartState.type !== "goalKick" && p.role === "GK") return false;
        // Résultat renvoyé par la fonction.
        return true;
    // Fermeture du bloc ou de l'appel.
    });

    // Vérification avant d'exécuter la suite.
    if (!candidates.length) {
        // Résultat renvoyé par la fonction.
        return player.homePosition.clone();
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans bestTargetPlayer.
    let bestTargetPlayer = null;
    // Valeur mémorisée dans bestScore.
    let bestScore = Infinity;

    // Appel de forEach pour appliquer l'action prévue.
    candidates.forEach(candidate => {
        // Préparation de dist avec Babylon.js.
        const dist = BABYLON.Vector3.Distance(player.position, candidate.position);
        // Vérification avant d'exécuter la suite.
        if (dist < bestScore) {
            // Instruction nécessaire au déroulement de cette partie.
            bestScore = dist;
            // Instruction nécessaire au déroulement de cette partie.
            bestTargetPlayer = candidate;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });

    // Vérification avant d'exécuter la suite.
    if (!bestTargetPlayer) {
        // Résultat renvoyé par la fonction.
        return player.homePosition.clone();
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans goalDir.
    const goalDir = restartState.side === "left"
        // Appel de Vector3 pour appliquer l'action prévue.
        ? new BABYLON.Vector3(1, 0, 0)
        // Appel de Vector3 pour appliquer l'action prévue.
        : new BABYLON.Vector3(-1, 0, 0);

    // Valeur mémorisée dans desired.
    const desired = bestTargetPlayer.position.subtract(goalDir.scale(4.5));

    // Valeur mémorisée dans tt.
    const tt = performance.now() * 0.001;
    // Appel de sin pour appliquer l'action prévue.
    desired.z += Math.sin(tt + player.homePosition.z * 0.15) * 1.8;

    // Valeur mémorisée dans dx.
    const dx = desired.x - ballPos.x;
    // Valeur mémorisée dans dz.
    const dz = desired.z - ballPos.z;
    // Valeur mémorisée dans dist.
    const dist = Math.sqrt(dx * dx + dz * dz);
    // Valeur mémorisée dans safeR.
    const safeR = getRestartSafeRadius() + 1.5;

    // Vérification avant d'exécuter la suite.
    if (dist < safeR) {
        // Valeur mémorisée dans nx.
        const nx = dist > 0.001 ? dx / dist : -player.side;
        // Valeur mémorisée dans nz.
        const nz = dist > 0.001 ? dz / dist : (player.homePosition.z < 0 ? -1 : 1);
        // Mise à jour de x.
        desired.x = ballPos.x + nx * safeR;
        // Mise à jour de z.
        desired.z = ballPos.z + nz * safeR;
    // Fermeture du bloc ou de l'appel.
    }

    // latence de réaction = ils suivent moins parfaitement
    // Vérification avant d'exécuter la suite.
    if (!player.restartLagTarget) {
        // Mise à jour de restartLagTarget.
        player.restartLagTarget = desired.clone();
    // Fermeture du bloc ou de l'appel.
    }

    // Mise à jour de restartLagTarget.
    player.restartLagTarget = BABYLON.Vector3.Lerp(
        // Paramètre de l'appel ou valeur de configuration.
        player.restartLagTarget,
        // Paramètre de l'appel ou valeur de configuration.
        desired,
        // Instruction nécessaire au déroulement de cette partie.
        0.07
    // Fermeture du bloc ou de l'appel.
    );

    // Mise à jour de x.
    player.restartLagTarget.x = Math.max(player.minX, Math.min(player.maxX, player.restartLagTarget.x));
    // Mise à jour de z.
    player.restartLagTarget.z = Math.max(player.minZ, Math.min(player.maxZ, player.restartLagTarget.z));

    // Résultat renvoyé par la fonction.
    return player.restartLagTarget.clone();
// Fermeture du bloc ou de l'appel.
}

// Fonction applyRestartTeamSpacing : elle regroupe le traitement de cette partie.
function applyRestartTeamSpacing(team, minSpacing = 7.0) {
    // Vérification avant d'exécuter la suite.
    if (!team || !team.players) return;

    // Parcours de plusieurs valeurs.
    for (let pass = 0; pass < 3; pass++) {
        // Parcours de plusieurs valeurs.
        for (let i = 0; i < team.players.length; i++) {
            // Valeur mémorisée dans a.
            const a = team.players[i];
            // Vérification avant d'exécuter la suite.
            if (!a || a === restartState.taker) continue;

            // Parcours de plusieurs valeurs.
            for (let j = i + 1; j < team.players.length; j++) {
                // Valeur mémorisée dans b.
                const b = team.players[j];
                // Vérification avant d'exécuter la suite.
                if (!b || b === restartState.taker) continue;

                // Valeur mémorisée dans dx.
                const dx = b.position.x - a.position.x;
                // Valeur mémorisée dans dz.
                const dz = b.position.z - a.position.z;
                // Valeur mémorisée dans dist.
                const dist = Math.sqrt(dx * dx + dz * dz);

                // Vérification avant d'exécuter la suite.
                if (dist < minSpacing) {
                    // Valeur mémorisée dans nx.
                    const nx = dist > 0.001 ? dx / dist : 1;
                    // Valeur mémorisée dans nz.
                    const nz = dist > 0.001 ? dz / dist : 0;
                    // Valeur mémorisée dans push.
                    const push = (minSpacing - dist) * 0.5;

                    // Instruction nécessaire au déroulement de cette partie.
                    a.position.x -= nx * push;
                    // Instruction nécessaire au déroulement de cette partie.
                    a.position.z -= nz * push;
                    // Instruction nécessaire au déroulement de cette partie.
                    b.position.x += nx * push;
                    // Instruction nécessaire au déroulement de cette partie.
                    b.position.z += nz * push;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}