// Fonction updateBallPhysics : elle regroupe le traitement de cette partie.
export function updateBallPhysics(ball, goalPosts, allPlayers, dt) {
    // Vérification avant d'exécuter la suite.
    if (!ball.velocity) {
        // Mise à jour de velocity.
        ball.velocity = new BABYLON.Vector3(0, 0, 0);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (ball.velocity.lengthSquared() > 0.000001) {
        // Instruction nécessaire au déroulement de cette partie.
        ball.position.x += ball.velocity.x * dt;
        // Instruction nécessaire au déroulement de cette partie.
        ball.position.z += ball.velocity.z * dt;

        // Valeur mémorisée dans friction.
        const friction = 0.985;
        // Appel de scaleInPlace pour appliquer l'action prévue.
        ball.velocity.scaleInPlace(friction);

        // Vérification avant d'exécuter la suite.
        if (ball.velocity.lengthSquared() < 0.0001) {
            // Appel de set pour appliquer l'action prévue.
            ball.velocity.set(0, 0, 0);
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans ballRadius.
        const ballRadius = 0.55;
        // Valeur mémorisée dans postRadius.
        const postRadius = 0.2;
        // Valeur mémorisée dans collisionDistance.
        const collisionDistance = ballRadius + postRadius;

        // Valeur mémorisée dans hasBounced.
        let hasBounced = false;

        // Parcours de plusieurs valeurs.
        for (let i = 0; i < goalPosts.length; i++) {
            // Valeur mémorisée dans post.
            const post = goalPosts[i];
            // Vérification avant d'exécuter la suite.
            if (!post || hasBounced) continue;

            // Valeur mémorisée dans postPos.
            const postPos = post.getAbsolutePosition();
            // Valeur mémorisée dans diff.
            const diff = ball.position.subtract(postPos);
            // Création de horizontal.
            const horizontal = new BABYLON.Vector3(diff.x, 0, diff.z);
            // Valeur mémorisée dans dist.
            const dist = horizontal.length();

            // Vérification avant d'exécuter la suite.
            if (dist > 0 && dist < collisionDistance) {
                // Valeur mémorisée dans normal.
                const normal = horizontal.normalize();

                // Préparation de reflected avec Babylon.js.
                const reflected = BABYLON.Vector3.Reflect(ball.velocity, normal);
                // Mise à jour de velocity.
                ball.velocity = reflected.scale(0.7);

                // Mise à jour de position.
                ball.position = postPos.add(normal.scale(collisionDistance));
                // Instruction nécessaire au déroulement de cette partie.
                hasBounced = true;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if (!ball.restartLocked) {
        // Valeur mémorisée dans BALL_RADIUS.
        const BALL_RADIUS = 0.55;
        // Valeur mémorisée dans PLAYER_COLR.
        const PLAYER_COLR = 1.1;
        // Valeur mémorisée dans COMBINED_R.
        const COMBINED_R = BALL_RADIUS + PLAYER_COLR;

        // Appel de forEach pour appliquer l'action prévue.
        allPlayers.forEach(p => {
            // Vérification avant d'exécuter la suite.
            if (!p || !p.position) return;

            // Vérification avant d'exécuter la suite.
            if (
                // Mise à jour de lastKicker.
                ball.lastKicker === p &&
                // Instruction nécessaire au déroulement de cette partie.
                ball.ignorePlayerCollisionUntil &&
                // Appel de now pour appliquer l'action prévue.
                performance.now() < ball.ignorePlayerCollisionUntil
            // Ouverture du bloc correspondant.
            ) {
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // Valeur mémorisée dans dx.
            const dx = ball.position.x - p.position.x;
            // Valeur mémorisée dans dz.
            const dz = ball.position.z - p.position.z;
            // Valeur mémorisée dans dist.
            const dist = Math.sqrt(dx * dx + dz * dz);

            // Vérification avant d'exécuter la suite.
            if (dist < COMBINED_R && dist > 0.001) {
                // Valeur mémorisée dans nx.
                const nx = dx / dist;
                // Valeur mémorisée dans nz.
                const nz = dz / dist;

                // Valeur mémorisée dans dot.
                const dot = ball.velocity.x * nx + ball.velocity.z * nz;
                // Vérification avant d'exécuter la suite.
                if (dot < 0) {
                    // Instruction nécessaire au déroulement de cette partie.
                    ball.velocity.x -= 2 * dot * nx;
                    // Instruction nécessaire au déroulement de cette partie.
                    ball.velocity.z -= 2 * dot * nz;

                    // Instruction nécessaire au déroulement de cette partie.
                    ball.velocity.x *= 0.75;
                    // Instruction nécessaire au déroulement de cette partie.
                    ball.velocity.z *= 0.75;
                // Fermeture du bloc ou de l'appel.
                }

                // Valeur mémorisée dans overlap.
                const overlap = COMBINED_R - dist;
                // Instruction nécessaire au déroulement de cette partie.
                ball.position.x += nx * overlap;
                // Instruction nécessaire au déroulement de cette partie.
                ball.position.z += nz * overlap;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}
