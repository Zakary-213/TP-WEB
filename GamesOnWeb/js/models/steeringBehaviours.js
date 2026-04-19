// Fonction initSteeringPlayer : elle regroupe le traitement de cette partie.
function initSteeringPlayer(player) {
    // Vérification avant d'exécuter la suite.
    if (!player) return;

    // Vérification avant d'exécuter la suite.
    if (!player.steeringVelocity) {
        // Mise à jour de steeringVelocity.
        player.steeringVelocity = new BABYLON.Vector3(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (player.maxSteeringSpeed == null) {
        // Mise à jour de maxSteeringSpeed.
        player.maxSteeringSpeed = 0.07;
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (player.maxSteeringForce == null) {
        // Mise à jour de maxSteeringForce.
        player.maxSteeringForce = 0.015;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Fonction getPlayerSteeringVelocity : elle regroupe le traitement de cette partie.
function getPlayerSteeringVelocity(player) {
    // Appel de initSteeringPlayer pour appliquer l'action prévue.
    initSteeringPlayer(player);
    // Résultat renvoyé par la fonction.
    return player.steeringVelocity;
// Fermeture du bloc ou de l'appel.
}

// Fonction seekSteering : elle regroupe le traitement de cette partie.
function seekSteering(player, target, maxSpeed = null) {
    // Vérification avant d'exécuter la suite.
    if (!player || !target) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de initSteeringPlayer pour appliquer l'action prévue.
    initSteeringPlayer(player);

    // Valeur mémorisée dans desired.
    const desired = target.subtract(player.position);
    // Mise à jour de y.
    desired.y = 0;

    // Vérification avant d'exécuter la suite.
    if (desired.lengthSquared() < 0.0001) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de normalize pour appliquer l'action prévue.
    desired.normalize();

    // Valeur mémorisée dans desiredSpeed.
    const desiredSpeed = maxSpeed ?? player.maxSteeringSpeed;
    // Appel de scaleInPlace pour appliquer l'action prévue.
    desired.scaleInPlace(desiredSpeed);

    // Valeur mémorisée dans currentVelocity.
    const currentVelocity = player.steeringVelocity.clone();
    // Mise à jour de y.
    currentVelocity.y = 0;

    // Valeur mémorisée dans steering.
    const steering = desired.subtract(currentVelocity);

    // Valeur mémorisée dans maxForce.
    const maxForce = player.maxSteeringForce;
    // Vérification avant d'exécuter la suite.
    if (steering.length() > maxForce) {
        // Appel de normalize pour appliquer l'action prévue.
        steering.normalize();
        // Appel de scaleInPlace pour appliquer l'action prévue.
        steering.scaleInPlace(maxForce);
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return steering;
// Fermeture du bloc ou de l'appel.
}

// Fonction applySteering : elle regroupe le traitement de cette partie.
function applySteering(player, steering) {
    // Vérification avant d'exécuter la suite.
    if (!player || !steering) return BABYLON.Vector3.Zero();

    // Appel de initSteeringPlayer pour appliquer l'action prévue.
    initSteeringPlayer(player);

    // Appel de addInPlace pour appliquer l'action prévue.
    player.steeringVelocity.addInPlace(steering);
    // Mise à jour de y.
    player.steeringVelocity.y = 0;

    // Valeur mémorisée dans maxSpeed.
    const maxSpeed = player.maxSteeringSpeed;
    // Vérification avant d'exécuter la suite.
    if (player.steeringVelocity.length() > maxSpeed) {
        // Appel de normalize pour appliquer l'action prévue.
        player.steeringVelocity.normalize();
        // Appel de scaleInPlace pour appliquer l'action prévue.
        player.steeringVelocity.scaleInPlace(maxSpeed);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (player.steeringVelocity.lengthSquared() < 0.00001) {
        // Appel de set pour appliquer l'action prévue.
        player.steeringVelocity.set(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return player.steeringVelocity.clone();
// Fermeture du bloc ou de l'appel.
}

// Fonction resetSteeringVelocity : elle regroupe le traitement de cette partie.
function resetSteeringVelocity(player) {
    // Vérification avant d'exécuter la suite.
    if (!player) return;
    // Appel de initSteeringPlayer pour appliquer l'action prévue.
    initSteeringPlayer(player);
    // Appel de set pour appliquer l'action prévue.
    player.steeringVelocity.set(0, 0, 0);
// Fermeture du bloc ou de l'appel.
}

// Fonction arriveSteering : elle regroupe le traitement de cette partie.
function arriveSteering(player, target, maxSpeed = null, slowRadius = 3, stopDistance = 0.2) {
    // Vérification avant d'exécuter la suite.
    if (!player || !target) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de initSteeringPlayer pour appliquer l'action prévue.
    initSteeringPlayer(player);

    // Valeur mémorisée dans desired.
    const desired = target.subtract(player.position);
    // Mise à jour de y.
    desired.y = 0;

    // Valeur mémorisée dans dist.
    const dist = desired.length();

    // Vérification avant d'exécuter la suite.
    if (dist < stopDistance) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (dist < 0.0001) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de normalize pour appliquer l'action prévue.
    desired.normalize();

    // Valeur mémorisée dans baseSpeed.
    const baseSpeed = maxSpeed ?? player.maxSteeringSpeed;

    // Valeur mémorisée dans desiredSpeed.
    let desiredSpeed = baseSpeed;
    // Vérification avant d'exécuter la suite.
    if (dist < slowRadius) {
        // Instruction nécessaire au déroulement de cette partie.
        desiredSpeed = baseSpeed * (dist / slowRadius);
        // Appel de max pour appliquer l'action prévue.
        desiredSpeed = Math.max(desiredSpeed, 0.02);
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de scaleInPlace pour appliquer l'action prévue.
    desired.scaleInPlace(desiredSpeed);

    // Valeur mémorisée dans currentVelocity.
    const currentVelocity = player.steeringVelocity.clone();
    // Mise à jour de y.
    currentVelocity.y = 0;

    // Valeur mémorisée dans steering.
    const steering = desired.subtract(currentVelocity);

    // Valeur mémorisée dans maxForce.
    const maxForce = player.maxSteeringForce;
    // Vérification avant d'exécuter la suite.
    if (steering.length() > maxForce) {
        // Appel de normalize pour appliquer l'action prévue.
        steering.normalize();
        // Appel de scaleInPlace pour appliquer l'action prévue.
        steering.scaleInPlace(maxForce);
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return steering;
// Fermeture du bloc ou de l'appel.
}

// Fonction separationSteering : elle regroupe le traitement de cette partie.
function separationSteering(player, neighbors, desiredSeparation = 4.0, maxSpeed = null) {
    // Vérification avant d'exécuter la suite.
    if (!player || !neighbors || neighbors.length === 0) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de initSteeringPlayer pour appliquer l'action prévue.
    initSteeringPlayer(player);

    // Création de sum.
    const sum = new BABYLON.Vector3(0, 0, 0);
    // Valeur mémorisée dans count.
    let count = 0;

    // Appel de forEach pour appliquer l'action prévue.
    neighbors.forEach(other => {
        // Vérification avant d'exécuter la suite.
        if (!other || other === player || !other.position) return;

        // Valeur mémorisée dans diff.
        const diff = player.position.subtract(other.position);
        // Mise à jour de y.
        diff.y = 0;

        // Valeur mémorisée dans dist.
        const dist = diff.length();

        // Vérification avant d'exécuter la suite.
        if (dist <= 0.0001) return;
        // Vérification avant d'exécuter la suite.
        if (dist >= desiredSeparation) return;

        // Appel de normalize pour appliquer l'action prévue.
        diff.normalize();

        // plus c'est proche, plus ça repousse
        // Appel de scaleInPlace pour appliquer l'action prévue.
        diff.scaleInPlace(1 / dist);

        // Appel de addInPlace pour appliquer l'action prévue.
        sum.addInPlace(diff);
        // Instruction nécessaire au déroulement de cette partie.
        count++;
    // Fermeture du bloc ou de l'appel.
    });

    // Vérification avant d'exécuter la suite.
    if (count === 0) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de scaleInPlace pour appliquer l'action prévue.
    sum.scaleInPlace(1 / count);

    // Vérification avant d'exécuter la suite.
    if (sum.lengthSquared() < 0.0001) {
        // Résultat renvoyé par la fonction.
        return BABYLON.Vector3.Zero();
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de normalize pour appliquer l'action prévue.
    sum.normalize();

    // Valeur mémorisée dans desiredSpeed.
    const desiredSpeed = maxSpeed ?? player.maxSteeringSpeed;
    // Appel de scaleInPlace pour appliquer l'action prévue.
    sum.scaleInPlace(desiredSpeed);

    // Valeur mémorisée dans currentVelocity.
    const currentVelocity = player.steeringVelocity.clone();
    // Mise à jour de y.
    currentVelocity.y = 0;

    // Valeur mémorisée dans steering.
    const steering = sum.subtract(currentVelocity);

    // Valeur mémorisée dans maxForce.
    const maxForce = player.maxSteeringForce;
    // Vérification avant d'exécuter la suite.
    if (steering.length() > maxForce) {
        // Appel de normalize pour appliquer l'action prévue.
        steering.normalize();
        // Appel de scaleInPlace pour appliquer l'action prévue.
        steering.scaleInPlace(maxForce);
    // Fermeture du bloc ou de l'appel.
    }

    // Résultat renvoyé par la fonction.
    return steering;
// Fermeture du bloc ou de l'appel.
}

// Fonction closestPointOnSegment : elle regroupe le traitement de cette partie.
function closestPointOnSegment(point, segmentStart, segmentEnd) {
    // Valeur mémorisée dans ab.
    const ab = segmentEnd.subtract(segmentStart);
    // Valeur mémorisée dans ap.
    const ap = point.subtract(segmentStart);

    // Valeur mémorisée dans abLenSq.
    const abLenSq = ab.lengthSquared();
    // Vérification avant d'exécuter la suite.
    if (abLenSq < 0.0001) {
        // Résultat renvoyé par la fonction.
        return segmentStart.clone();
    // Fermeture du bloc ou de l'appel.
    }

    // Préparation de t avec Babylon.js.
    let t = BABYLON.Vector3.Dot(ap, ab) / abLenSq;
    // Appel de Clamp pour appliquer l'action prévue.
    t = BABYLON.Scalar.Clamp(t, 0, 1);

    // Résultat renvoyé par la fonction.
    return segmentStart.add(ab.scale(t));
// Fermeture du bloc ou de l'appel.
}

// Fonction computeAvoidanceWaypoint : elle regroupe le traitement de cette partie.
function computeAvoidanceWaypoint(player, target, obstacles, options = {}) {
    // Vérification avant d'exécuter la suite.
    if (!player || !target || !obstacles || obstacles.length === 0) {
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans avoidRadius.
    const avoidRadius = options.avoidRadius ?? 7.0;
    // Valeur mémorisée dans corridorRadius.
    const corridorRadius = options.corridorRadius ?? 2.8;
    // Valeur mémorisée dans lateralOffset.
    const lateralOffset = options.lateralOffset ?? 4.0;
    // Valeur mémorisée dans forwardLook.
    const forwardLook = options.forwardLook ?? 8.0;

    // Valeur mémorisée dans forward.
    let forward = target.subtract(player.position);
    // Mise à jour de y.
    forward.y = 0;

    // Vérification avant d'exécuter la suite.
    if (forward.lengthSquared() < 0.0001) {
        // Vérification avant d'exécuter la suite.
        if (player.facingDirection && player.facingDirection.lengthSquared() > 0.0001) {
            // Appel de clone pour appliquer l'action prévue.
            forward = player.facingDirection.clone();
            // Mise à jour de y.
            forward.y = 0;
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Résultat renvoyé par la fonction.
            return null;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de normalize pour appliquer l'action prévue.
    forward.normalize();

    // Valeur mémorisée dans segmentStart.
    const segmentStart = player.position.clone();
    // Valeur mémorisée dans segmentEnd.
    const segmentEnd = player.position.add(forward.scale(forwardLook));

    // Valeur mémorisée dans mostThreatening.
    let mostThreatening = null;
    // Valeur mémorisée dans bestDist.
    let bestDist = Infinity;

    // Appel de forEach pour appliquer l'action prévue.
    obstacles.forEach(other => {
        // Vérification avant d'exécuter la suite.
        if (!other || !other.position || other === player) return;

        // Valeur mémorisée dans toObstacle.
        const toObstacle = other.position.subtract(player.position);
        // Mise à jour de y.
        toObstacle.y = 0;

        // Valeur mémorisée dans distToPlayer.
        const distToPlayer = toObstacle.length();
        // Vérification avant d'exécuter la suite.
        if (distToPlayer > avoidRadius) return;

        // Valeur mémorisée dans dirToObstacle.
        const dirToObstacle = toObstacle.clone().normalize();
        // Préparation de forwardDot avec Babylon.js.
        const forwardDot = BABYLON.Vector3.Dot(forward, dirToObstacle);

        // Vérification avant d'exécuter la suite.
        if (forwardDot <= 0.1) return;

        // Valeur mémorisée dans closest.
        const closest = closestPointOnSegment(other.position, segmentStart, segmentEnd);
        // Préparation de distToPath avec Babylon.js.
        const distToPath = BABYLON.Vector3.Distance(other.position, closest);

        // Vérification avant d'exécuter la suite.
        if (distToPath > corridorRadius) return;

        // Vérification avant d'exécuter la suite.
        if (distToPlayer < bestDist) {
            // Instruction nécessaire au déroulement de cette partie.
            bestDist = distToPlayer;
            // Instruction nécessaire au déroulement de cette partie.
            mostThreatening = other;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });

    // Vérification avant d'exécuter la suite.
    if (!mostThreatening) {
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Valeur mémorisée dans toThreat.
    const toThreat = mostThreatening.position.subtract(player.position);
    // Mise à jour de y.
    toThreat.y = 0;

    // Vérification avant d'exécuter la suite.
    if (toThreat.lengthSquared() < 0.0001) {
        // Résultat renvoyé par la fonction.
        return null;
    // Fermeture du bloc ou de l'appel.
    }

    // Création de left.
    const left = new BABYLON.Vector3(-forward.z, 0, forward.x);
    // Préparation de sideDot avec Babylon.js.
    const sideDot = BABYLON.Vector3.Dot(left, toThreat.normalize());

    // Valeur mémorisée dans lateralDir.
    const lateralDir = sideDot > 0 ? left.scale(-1) : left.clone();

    // Valeur mémorisée dans waypoint.
    const waypoint = mostThreatening.position
        // Appel de add pour appliquer l'action prévue.
        .add(lateralDir.scale(lateralOffset))
        // Appel de add pour appliquer l'action prévue.
        .add(forward.scale(1.5));

    // Mise à jour de y.
    waypoint.y = 0;
    // Résultat renvoyé par la fonction.
    return waypoint;
// Fermeture du bloc ou de l'appel.
}