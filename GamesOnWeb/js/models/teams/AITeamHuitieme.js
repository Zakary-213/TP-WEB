// Classe AITeamHuitieme : elle sert de modèle pour cet élément du jeu.
class AITeamHuitieme extends AITeam {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene, name, color) {
        // Appel de super pour appliquer l'action prévue.
        super(scene, name, color, 2);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction aiBehavior : elle regroupe le traitement de cette partie.
    aiBehavior(ball) {
        // Vérification avant d'exécuter la suite.
        if (!ball || !ball.position) return;

        // Valeur mémorisée dans now.
        const now = performance.now();
        // Valeur mémorisée dans gk.
        const gk = this.getGoalkeeper();

        // fenêtre de release après une relance
        // Vérification avant d'exécuter la suite.
        if (gk && this.goalkeeperIsClearing && now < this.goalkeeperReleaseUntil) {
            // Mise à jour de goalkeeperLocked pour cet objet.
            this.goalkeeperLocked = true;
            // Mise à jour de aiControlledPlayer pour cet objet.
            this.aiControlledPlayer = gk;
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;
            // Appel de repositionForGoalkeeperDistribution pour appliquer l'action prévue.
            this.repositionForGoalkeeperDistribution(gk);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (gk && this.goalkeeperIsClearing && now >= this.goalkeeperReleaseUntil) {
            // Préparation de distGKBall avec Babylon.js.
            const distGKBall = BABYLON.Vector3.Distance(gk.position, ball.position);
            // Valeur mémorisée dans ballMoving.
            const ballMoving = ball.velocity && ball.velocity.lengthSquared() > 0.05;

            // Vérification avant d'exécuter la suite.
            if (distGKBall > 3.2 || ballMoving || ball.lastKicker !== gk || ball.lastTouchTeam !== this) {
                // Mise à jour de goalkeeperIsClearing pour cet objet.
                this.goalkeeperIsClearing = false;
                // Mise à jour de goalkeeperReleaseUntil pour cet objet.
                this.goalkeeperReleaseUntil = 0;
                // Mise à jour de goalkeeperCurrentRoamTarget pour cet objet.
                this.goalkeeperCurrentRoamTarget = null;
                // Mise à jour de goalkeeperNextRoamDecisionTime pour cet objet.
                this.goalkeeperNextRoamDecisionTime = 0;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (gk && this.isGoalkeeperHandlingBall(ball)) {
            // Mise à jour de goalkeeperLocked pour cet objet.
            this.goalkeeperLocked = true;
            // Mise à jour de aiControlledPlayer pour cet objet.
            this.aiControlledPlayer = gk;
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;

            // Appel de handleGoalkeeperPossession pour appliquer l'action prévue.
            this.handleGoalkeeperPossession(gk, ball);
            // Appel de repositionForGoalkeeperDistribution pour appliquer l'action prévue.
            this.repositionForGoalkeeperDistribution(gk);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans teamHasBall.
        const teamHasBall = this.hasRealPossession(ball);

        // Vérification avant d'exécuter la suite.
        if (teamHasBall) {
            // Appel de attackBehavior pour appliquer l'action prévue.
            this.attackBehavior(ball);
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de defenseBehavior pour appliquer l'action prévue.
            this.defenseBehavior(ball);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // -----------------------
    // HELPERS
    // -----------------------
    // Fonction getGoalkeeper : elle regroupe le traitement de cette partie.
    getGoalkeeper() {
        // Résultat renvoyé par la fonction.
        return this.players.find(p => p && p.role === "GK") || null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction setFacing : elle regroupe le traitement de cette partie.
    setFacing(player, dir) {
        // Vérification avant d'exécuter la suite.
        if (!player || !dir || dir.lengthSquared() < 0.0001) return;

        // Valeur mémorisée dans d.
        const d = dir.clone();
        // Mise à jour de y.
        d.y = 0;

        // Vérification avant d'exécuter la suite.
        if (d.lengthSquared() < 0.0001) return;
        // Appel de normalize pour appliquer l'action prévue.
        d.normalize();

        // Mise à jour de facingDirection.
        player.facingDirection = d.clone();

        // Vérification avant d'exécuter la suite.
        if (player.model) {
            // Mise à jour de y.
            player.model.rotation.y = Math.atan2(d.x, d.z);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isInOwnBox : elle regroupe le traitement de cette partie.
    isInOwnBox(pos) {
        // Vérification avant d'exécuter la suite.
        if (!pos) return false;
        // Résultat renvoyé par la fonction.
        return pos.x > 38 && Math.abs(pos.z) < 14;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction isGoalkeeperHandlingBall : elle regroupe le traitement de cette partie.
    isGoalkeeperHandlingBall(ball) {
        // Valeur mémorisée dans gk.
        const gk = this.getGoalkeeper();
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball || !ball.position) return false;

        // Vérification avant d'exécuter la suite.
        if (this.goalkeeperIsClearing && performance.now() < this.goalkeeperReleaseUntil) {
            // Résultat renvoyé par la fonction.
            return false;
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return (
            // Mise à jour de lastTouchTeam.
            ball.lastTouchTeam === this &&
            // Mise à jour de lastKicker.
            ball.lastKicker === gk &&
            // Appel de Distance pour appliquer l'action prévue.
            BABYLON.Vector3.Distance(gk.position, ball.position) < 2.0
        // Fermeture du bloc ou de l'appel.
        );
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction shouldGoalkeeperClaim : elle regroupe le traitement de cette partie.
    shouldGoalkeeperClaim(ball, enemyCarrier) {
        // Valeur mémorisée dans gk.
        const gk = this.getGoalkeeper();
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball || !ball.position) return false;
        // Vérification avant d'exécuter la suite.
        if (!this.isInOwnBox(ball.position)) return false;

        // Préparation de gkDist avec Babylon.js.
        const gkDist = BABYLON.Vector3.Distance(gk.position, ball.position);
        // Vérification avant d'exécuter la suite.
        if (gkDist > 9.5) return false;

        // Valeur mémorisée dans ballSpeed.
        const ballSpeed = ball.velocity ? ball.velocity.length() : 0;

        // Valeur mémorisée dans enemyHasTightControl.
        const enemyHasTightControl =
            // Instruction nécessaire au déroulement de cette partie.
            enemyCarrier &&
            // Appel de Distance pour appliquer l'action prévue.
            BABYLON.Vector3.Distance(enemyCarrier.position, ball.position) < 1.7 &&
            // Appel de Distance pour appliquer l'action prévue.
            BABYLON.Vector3.Distance(enemyCarrier.position, gk.position) > 2.2;

        // Vérification avant d'exécuter la suite.
        if (gkDist < 2.8) return true;
        // Vérification avant d'exécuter la suite.
        if (ballSpeed > 2.2) return true;
        // Vérification avant d'exécuter la suite.
        if (!enemyHasTightControl) return true;

        // Résultat renvoyé par la fonction.
        return false;
    // Fermeture du bloc ou de l'appel.
    }

    // -----------------------
    // DEFENSE
    // -----------------------
    // Fonction defenseBehavior : elle regroupe le traitement de cette partie.
    defenseBehavior(ball) {
        // Valeur mémorisée dans bestPlayer.
        let bestPlayer = null;
        // Valeur mémorisée dans bestScore.
        let bestScore = -Infinity;

        // Valeur mémorisée dans enemyCarrier.
        let enemyCarrier = null;
        // Valeur mémorisée dans targetPos.
        let targetPos = ball.position.clone();

        // Création de defendGoalDir.
        const defendGoalDir = new BABYLON.Vector3(1, 0, 0);

        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            ball.lastTouchTeam &&
            // Instruction nécessaire au déroulement de cette partie.
            ball.lastTouchTeam !== this &&
            // Instruction nécessaire au déroulement de cette partie.
            ball.lastKicker &&
            // Instruction nécessaire au déroulement de cette partie.
            ball.lastKicker.position
        // Ouverture du bloc correspondant.
        ) {
            // Préparation de carrierDistToBall avec Babylon.js.
            const carrierDistToBall = BABYLON.Vector3.Distance(
                // Paramètre de l'appel ou valeur de configuration.
                ball.lastKicker.position,
                // Instruction nécessaire au déroulement de cette partie.
                ball.position
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if (carrierDistToBall < 2.2) {
                // Instruction nécessaire au déroulement de cette partie.
                enemyCarrier = ball.lastKicker;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans gk.
        const gk = this.getGoalkeeper();
        // Vérification avant d'exécuter la suite.
        if (gk) {
            // Appel de updateGoalkeeper pour appliquer l'action prévue.
            this.updateGoalkeeper(gk, ball, enemyCarrier);
        // Fermeture du bloc ou de l'appel.
        }

        // si le GK claim la balle, les autres restent hors de sa surface
        // Vérification avant d'exécuter la suite.
        if (this.goalkeeperClaiming) {
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;

            // Appel de forEach pour appliquer l'action prévue.
            this.players.forEach(player => {
                // Vérification avant d'exécuter la suite.
                if (!player || player.role === "GK") return;

                // Valeur mémorisée dans target.
                const target = player.homePosition.clone();

                // Vérification avant d'exécuter la suite.
                if (target.x > 34) target.x = 34;
                // Vérification avant d'exécuter la suite.
                if (Math.abs(target.z) < 8) {
                    // Mise à jour de z.
                    target.z = target.z >= 0 ? 10 : -10;
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

            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (enemyCarrier) {
            // Appel de add pour appliquer l'action prévue.
            targetPos = enemyCarrier.position.add(defendGoalDir.scale(1.8));
            // Mise à jour de y.
            targetPos.y = 0;
            // Mise à jour de z.
            targetPos.z = enemyCarrier.position.z;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player => {
            // Vérification avant d'exécuter la suite.
            if (!player || player.role === "GK") return;
            // Vérification avant d'exécuter la suite.
            if (player._tackleStunUntil && Date.now() < player._tackleStunUntil) return;

            // Valeur mémorisée dans toTarget.
            const toTarget = targetPos.subtract(player.position);
            // Valeur mémorisée dans dist.
            const dist = toTarget.length();

            // Vérification avant d'exécuter la suite.
            if (dist > this.pressRadius) return;

            // Valeur mémorisée dans score.
            let score = 0;

            // Instruction nécessaire au déroulement de cette partie.
            score -= dist * 1.0;
            // Appel de abs pour appliquer l'action prévue.
            score -= Math.abs(player.position.z - targetPos.z) * 0.9;

            // Vérification avant d'exécuter la suite.
            if (enemyCarrier) {
                // Valeur mémorisée dans fromCarrierToDef.
                const fromCarrierToDef = player.position.subtract(enemyCarrier.position);
                // Mise à jour de y.
                fromCarrierToDef.y = 0;

                // Vérification avant d'exécuter la suite.
                if (fromCarrierToDef.lengthSquared() > 0.0001) {
                    // Appel de normalize pour appliquer l'action prévue.
                    fromCarrierToDef.normalize();

                    // Préparation de goalSideDot avec Babylon.js.
                    const goalSideDot = BABYLON.Vector3.Dot(defendGoalDir, fromCarrierToDef);

                    // Vérification avant d'exécuter la suite.
                    if (goalSideDot < -0.1) {
                        // Instruction nécessaire au déroulement de cette partie.
                        score -= 1000;
                    // Deuxième possibilité à tester.
                    } else if (goalSideDot < 0.15) {
                        // Instruction nécessaire au déroulement de cette partie.
                        score -= 6;
                    // Cas utilisé quand les tests précédents échouent.
                    } else {
                        // Instruction nécessaire au déroulement de cette partie.
                        score += 12 + goalSideDot * 10;
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (player.position.x > enemyCarrier.position.x) {
                    // Instruction nécessaire au déroulement de cette partie.
                    score += 6;
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Instruction nécessaire au déroulement de cette partie.
                    score -= 8;
                // Fermeture du bloc ou de l'appel.
                }
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de abs pour appliquer l'action prévue.
                score -= Math.abs(player.position.x - ball.position.x) * 0.35;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (score > bestScore) {
                // Instruction nécessaire au déroulement de cette partie.
                bestScore = score;
                // Instruction nécessaire au déroulement de cette partie.
                bestPlayer = player;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Mise à jour de ballChaser pour cet objet.
        this.ballChaser = bestPlayer;

        // Vérification avant d'exécuter la suite.
        if (this.ballChaser) {
            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(this.ballChaser, targetPos);
            // Appel de markPlayerMovedThisFrame pour appliquer l'action prévue.
            this.markPlayerMovedThisFrame(this.ballChaser);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // -----------------------
    // ATTACK
    // -----------------------
    // Fonction attackBehavior : elle regroupe le traitement de cette partie.
    attackBehavior(ball) {
        // Valeur mémorisée dans ballCarrier.
        let ballCarrier = null;
        // Valeur mémorisée dans bestDist.
        let bestDist = Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player => {
            // Vérification avant d'exécuter la suite.
            if (!player || player.role === "GK") return;

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(player.position, ball.position);

            // Vérification avant d'exécuter la suite.
            if (dist < bestDist) {
                // Instruction nécessaire au déroulement de cette partie.
                bestDist = dist;
                // Instruction nécessaire au déroulement de cette partie.
                ballCarrier = player;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Vérification avant d'exécuter la suite.
        if (!ballCarrier) return;

        // Valeur mémorisée dans isNearGoal.
        const isNearGoal = ballCarrier.position.x < -34;
        // Valeur mémorisée dans isCenteredEnough.
        const isCenteredEnough = Math.abs(ballCarrier.position.z) < 16;
        // Valeur mémorisée dans shouldPrepareShot.
        const shouldPrepareShot = isNearGoal && isCenteredEnough;

        // Vérification avant d'exécuter la suite.
        if (this.aiShotCharging) {
            // Appel de handleAIShot pour appliquer l'action prévue.
            this.handleAIShot(ball);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (shouldPrepareShot) {
            // Appel de startAIShot pour appliquer l'action prévue.
            this.startAIShot(ballCarrier, ball);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Création de dir.
        let dir = new BABYLON.Vector3(-50, 0, 0).subtract(ballCarrier.position);

        // Valeur mémorisée dans margin.
        const margin = 5;

        // Vérification avant d'exécuter la suite.
        if (ballCarrier.position.z > 25 - margin) dir.z -= 2;
        // Vérification avant d'exécuter la suite.
        if (ballCarrier.position.z < -25 + margin) dir.z += 2;
        // Vérification avant d'exécuter la suite.
        if (ballCarrier.position.x < -45 + margin) dir.x += 1.5;

        // Appel de forEach pour appliquer l'action prévue.
        this.opponents.forEach(opponent => {
            // Vérification avant d'exécuter la suite.
            if (!opponent || !opponent.position) return;

            // Valeur mémorisée dans toOpponent.
            const toOpponent = opponent.position.subtract(ballCarrier.position);
            // Valeur mémorisée dans dist.
            const dist = toOpponent.length();

            // Vérification avant d'exécuter la suite.
            if (dist < 8) {
                // Valeur mémorisée dans avoid.
                const avoid = ballCarrier.position.subtract(opponent.position);
                // Mise à jour de y.
                avoid.y = 0;

                // Vérification avant d'exécuter la suite.
                if (avoid.lengthSquared() > 0.0001) {
                    // Appel de normalize pour appliquer l'action prévue.
                    avoid.normalize();
                    // Appel de addInPlace pour appliquer l'action prévue.
                    dir.addInPlace(avoid.scale(3));
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Vérification avant d'exécuter la suite.
        if (dir.lengthSquared() === 0) return;

        // Mise à jour de y.
        dir.y = 0;
        // Appel de normalize pour appliquer l'action prévue.
        dir.normalize();

        // Mise à jour de aiControlledPlayer pour cet objet.
        this.aiControlledPlayer = ballCarrier;
        // Mise à jour de ballChaser pour cet objet.
        this.ballChaser = ballCarrier;

        // Valeur mémorisée dans carrierTarget.
        const carrierTarget = ballCarrier.position.add(dir.scale(6));

        // Appel de moveAICarrierTowards pour appliquer l'action prévue.
        this.moveAICarrierTowards(ballCarrier, carrierTarget, {
            // Paramètre de l'appel ou valeur de configuration.
            maxSpeed: 0.07,
            // Paramètre de l'appel ou valeur de configuration.
            maxForce: 0.028,
            // Instruction nécessaire au déroulement de cette partie.
            facingDirection: dir
        // Fermeture du bloc ou de l'appel.
        });

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player => {
            // Vérification avant d'exécuter la suite.
            if (!player || player === ballCarrier) return;
            // Vérification avant d'exécuter la suite.
            if (player.role === "GK") return;

            // Valeur mémorisée dans support.
            const support = player.homePosition.clone();
            // Instruction nécessaire au déroulement de cette partie.
            support.x += (ballCarrier.position.x - player.homePosition.x) * 0.5;
            // Instruction nécessaire au déroulement de cette partie.
            support.z += (ballCarrier.position.z - player.homePosition.z) * 0.5;

            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(player, support);
            // Appel de markPlayerMovedThisFrame pour appliquer l'action prévue.
            this.markPlayerMovedThisFrame(player);
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // -----------------------
    // GK MAIN
    // -----------------------
    // Fonction updateGoalkeeper : elle regroupe le traitement de cette partie.
    updateGoalkeeper(gk, ball, enemyCarrier) {
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball || !ball.position) return;

        // Valeur mémorisée dans threatPos.
        const threatPos = enemyCarrier ? enemyCarrier.position.clone() : ball.position.clone();
        // Valeur mémorisée dans enemyInBox.
        const enemyInBox = this.isInOwnBox(threatPos);

        // Valeur mémorisée dans gkHasBall.
        const gkHasBall =
            // Mise à jour de lastTouchTeam.
            ball.lastTouchTeam === this &&
            // Mise à jour de lastKicker.
            ball.lastKicker === gk &&
            // Appel de Distance pour appliquer l'action prévue.
            BABYLON.Vector3.Distance(gk.position, ball.position) < 2.0;

        // Vérification avant d'exécuter la suite.
        if (gkHasBall) {
            // Mise à jour de goalkeeperLocked pour cet objet.
            this.goalkeeperLocked = true;
            // Mise à jour de aiControlledPlayer pour cet objet.
            this.aiControlledPlayer = gk;
            // Appel de handleGoalkeeperPossession pour appliquer l'action prévue.
            this.handleGoalkeeperPossession(gk, ball);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // priorité GK sur toute balle dangereuse dans sa surface
        // Vérification avant d'exécuter la suite.
        if (this.shouldGoalkeeperClaim(ball, enemyCarrier)) {
            // Mise à jour de goalkeeperLocked pour cet objet.
            this.goalkeeperLocked = true;
            // Mise à jour de goalkeeperClaiming pour cet objet.
            this.goalkeeperClaiming = true;
            // Mise à jour de aiControlledPlayer pour cet objet.
            this.aiControlledPlayer = gk;
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;

            // Valeur mémorisée dans target.
            const target = ball.position.clone();
            // Mise à jour de x.
            target.x = BABYLON.Scalar.Clamp(target.x, 43.2, 47.0);
            // Mise à jour de z.
            target.z = BABYLON.Scalar.Clamp(target.z, -6.2, 6.2);
            // Mise à jour de y.
            target.y = 0;

            // Appel de moveGoalkeeperTowards pour appliquer l'action prévue.
            this.moveGoalkeeperTowards(gk, target, false, 0.082);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (!enemyInBox) {
            // Valeur mémorisée dans target.
            const target = gk.homePosition.clone();
            // Mise à jour de x.
            target.x = gk.homePosition.x;

            // Préparation de desiredZ avec Babylon.js.
            const desiredZ = BABYLON.Scalar.Clamp(ball.position.z * 0.10, -4.0, 4.0);
            // Mise à jour de z.
            target.z = BABYLON.Scalar.Lerp(gk.position.z, desiredZ, 0.06);

            // Appel de moveGoalkeeperTowards pour appliquer l'action prévue.
            this.moveGoalkeeperTowards(gk, target, true, 0.05);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de goalkeeperLocked pour cet objet.
        this.goalkeeperLocked = true;

        // Valeur mémorisée dans target.
        const target = gk.homePosition.clone();
        // Mise à jour de x.
        target.x = gk.homePosition.x;

        // Valeur mémorisée dans trackZ.
        const trackZ = enemyCarrier ? enemyCarrier.position.z : ball.position.z;
        // Préparation de desiredZ avec Babylon.js.
        const desiredZ = BABYLON.Scalar.Clamp(trackZ * 0.45, -4.8, 4.8);
        // Mise à jour de z.
        target.z = BABYLON.Scalar.Lerp(gk.position.z, desiredZ, 0.07);

        // Appel de moveGoalkeeperTowards pour appliquer l'action prévue.
        this.moveGoalkeeperTowards(gk, target, true, 0.058);
        // Appel de tryGoalkeeperIntercept pour appliquer l'action prévue.
        this.tryGoalkeeperIntercept(gk, ball);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction moveGoalkeeperTowards : elle regroupe le traitement de cette partie.
    moveGoalkeeperTowards(gk, target, keepFacingForward = true, speedOverride = null) {
        // Vérification avant d'exécuter la suite.
        if (!gk || !target) return;
        // Vérification avant d'exécuter la suite.
        if (gk.isTackling) return;
        // Vérification avant d'exécuter la suite.
        if (gk._tackleStunUntil && Date.now() < gk._tackleStunUntil) return;

        // Valeur mémorisée dans toTarget.
        const toTarget = target.subtract(gk.position);
        // Mise à jour de y.
        toTarget.y = 0;
        // Valeur mémorisée dans dist.
        const dist = toTarget.length();

        // Vérification avant d'exécuter la suite.
        if (dist < 0.05) {
            // Appel de resetSteeringVelocity pour appliquer l'action prévue.
            resetSteeringVelocity(gk);

            // Vérification avant d'exécuter la suite.
            if (gk.playAnimation) gk.playAnimation("idle");
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans facingDir.
        let facingDir = null;

        // Vérification avant d'exécuter la suite.
        if (keepFacingForward) {
            // Appel de Vector3 pour appliquer l'action prévue.
            facingDir = new BABYLON.Vector3(-1, 0, 0);
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de clone pour appliquer l'action prévue.
            facingDir = toTarget.clone();
            // Mise à jour de y.
            facingDir.y = 0;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans speed.
        const speed = speedOverride ?? (dist > 1.5 ? 0.08 : 0.06);

        // Appel de moveAIPlayerTowards pour appliquer l'action prévue.
        this.moveAIPlayerTowards(gk, target, {
            // Paramètre de l'appel ou valeur de configuration.
            maxSpeed: speed,
            // Paramètre de l'appel ou valeur de configuration.
            maxForce: 0.024,
            // Paramètre de l'appel ou valeur de configuration.
            stopDistance: 0.05,
            // Instruction nécessaire au déroulement de cette partie.
            facingDirection: facingDir
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction tryGoalkeeperIntercept : elle regroupe le traitement de cette partie.
    tryGoalkeeperIntercept(gk, ball) {
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball || !ball.position) return;

        // Préparation de distToBall avec Babylon.js.
        const distToBall = BABYLON.Vector3.Distance(gk.position, ball.position);
        // Vérification avant d'exécuter la suite.
        if (distToBall > 1.8) return;

        // Vérification avant d'exécuter la suite.
        if (!ball.velocity) {
            // Mise à jour de velocity.
            ball.velocity = new BABYLON.Vector3(0, 0, 0);
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de lastKicker.
        ball.lastKicker = gk;
        // Mise à jour de lastTouchTeam.
        ball.lastTouchTeam = this;
        // Appel de set pour appliquer l'action prévue.
        ball.velocity.set(0, 0, 0);

        // Mise à jour de goalkeeperIsClearing pour cet objet.
        this.goalkeeperIsClearing = false;
        // Mise à jour de goalkeeperReleaseUntil pour cet objet.
        this.goalkeeperReleaseUntil = 0;
        // Mise à jour de goalkeeperPossessionStartTime pour cet objet.
        this.goalkeeperPossessionStartTime = performance.now();
        // Mise à jour de goalkeeperCurrentRoamTarget pour cet objet.
        this.goalkeeperCurrentRoamTarget = null;
        // Mise à jour de goalkeeperNextRoamDecisionTime pour cet objet.
        this.goalkeeperNextRoamDecisionTime = 0;

        // Création de holdDir.
        const holdDir = new BABYLON.Vector3(-1, 0, 0);
        // Appel de setFacing pour appliquer l'action prévue.
        this.setFacing(gk, holdDir);

        // Mise à jour de x.
        ball.position.x = gk.position.x + holdDir.x * 0.95;
        // Mise à jour de z.
        ball.position.z = gk.position.z + holdDir.z * 0.95;
        // Mise à jour de y.
        ball.position.y = 0.75;

        // Mise à jour de pushLockUntil.
        ball.pushLockUntil = performance.now() + 180;
        // Mise à jour de ignorePlayerCollisionUntil.
        ball.ignorePlayerCollisionUntil = performance.now() + 180;

        // Appel de lockTeamPossession pour appliquer l'action prévue.
        this.lockTeamPossession(950);
    // Fermeture du bloc ou de l'appel.
    }

    // -----------------------
    // GK POSSESSION
    // -----------------------
    // Fonction handleGoalkeeperPossession : elle regroupe le traitement de cette partie.
    handleGoalkeeperPossession(gk, ball) {
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball || !ball.position) return;

        // Valeur mémorisée dans now.
        const now = performance.now();

        // Vérification avant d'exécuter la suite.
        if (!this.goalkeeperPossessionStartTime) {
            // Mise à jour de goalkeeperPossessionStartTime pour cet objet.
            this.goalkeeperPossessionStartTime = now;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans heldFor.
        const heldFor = now - this.goalkeeperPossessionStartTime;

        // Valeur mémorisée dans nearestOpponent.
        let nearestOpponent = null;
        // Valeur mémorisée dans nearestDist.
        let nearestDist = Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        this.opponents.forEach(op => {
            // Vérification avant d'exécuter la suite.
            if (!op || !op.position) return;

            // Préparation de d avec Babylon.js.
            const d = BABYLON.Vector3.Distance(op.position, gk.position);
            // Vérification avant d'exécuter la suite.
            if (d < nearestDist) {
                // Instruction nécessaire au déroulement de cette partie.
                nearestDist = d;
                // Instruction nécessaire au déroulement de cette partie.
                nearestOpponent = op;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Valeur mémorisée dans passTarget.
        const passTarget = this.findBestGoalkeeperPassTarget(gk);

        // Valeur mémorisée dans underPressure.
        const underPressure = nearestDist < 3.8;
        // Valeur mémorisée dans canPassNow.
        const canPassNow = passTarget && heldFor > this.goalkeeperMinHoldDuration;
        // Valeur mémorisée dans mustReleaseNow.
        const mustReleaseNow =
            // Instruction nécessaire au déroulement de cette partie.
            heldFor > this.goalkeeperMaxHoldDuration ||
            // Instruction nécessaire au déroulement de cette partie.
            canPassNow ||
            // Instruction nécessaire au déroulement de cette partie.
            (underPressure && heldFor > 700);

        // Vérification avant d'exécuter la suite.
        if (!mustReleaseNow) {
            // Valeur mémorisée dans roamTarget.
            const roamTarget = this.computeGoalkeeperRoamTarget(gk, nearestOpponent);
            // Appel de moveGoalkeeperWithBall pour appliquer l'action prévue.
            this.moveGoalkeeperWithBall(gk, ball, roamTarget);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de goalkeeperDistribute pour appliquer l'action prévue.
        this.goalkeeperDistribute(gk, ball, passTarget);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction moveGoalkeeperWithBall : elle regroupe le traitement de cette partie.
    moveGoalkeeperWithBall(gk, ball, target) {
        // Appel de moveAIGoalkeeperWithBall pour appliquer l'action prévue.
        this.moveAIGoalkeeperWithBall(gk, ball, target);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction computeGoalkeeperRoamTarget : elle regroupe le traitement de cette partie.
    computeGoalkeeperRoamTarget(gk, nearestOpponent) {
        // Valeur mémorisée dans now.
        const now = performance.now();

        // Vérification avant d'exécuter la suite.
        if (
            // Instruction nécessaire au déroulement de cette partie.
            this.goalkeeperCurrentRoamTarget &&
            // Instruction nécessaire au déroulement de cette partie.
            now < this.goalkeeperNextRoamDecisionTime
        // Ouverture du bloc correspondant.
        ) {
            // Résultat renvoyé par la fonction.
            return this.goalkeeperCurrentRoamTarget.clone();
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans target.
        const target = gk.position.clone();

        // Valeur mémorisée dans minX.
        const minX = 43.5;
        // Valeur mémorisée dans maxX.
        const maxX = 46.7;
        // Valeur mémorisée dans minZ.
        const minZ = -4.8;
        // Valeur mémorisée dans maxZ.
        const maxZ = 4.8;

        // Mise à jour de x.
        target.x = 45.4;
        // Mise à jour de z.
        target.z = BABYLON.Scalar.Lerp(gk.position.z, 0, 0.18);

        // Vérification avant d'exécuter la suite.
        if (nearestOpponent && nearestOpponent.position) {
            // Valeur mémorisée dans away.
            const away = gk.position.subtract(nearestOpponent.position);
            // Mise à jour de y.
            away.y = 0;

            // Vérification avant d'exécuter la suite.
            if (away.lengthSquared() > 0.0001) {
                // Appel de normalize pour appliquer l'action prévue.
                away.normalize();

                // Instruction nécessaire au déroulement de cette partie.
                target.x += away.x * 0.9;
                // Instruction nécessaire au déroulement de cette partie.
                target.z += away.z * 1.2;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de x.
        target.x = BABYLON.Scalar.Clamp(target.x, minX, maxX);
        // Mise à jour de z.
        target.z = BABYLON.Scalar.Clamp(target.z, minZ, maxZ);

        // Mise à jour de goalkeeperCurrentRoamTarget pour cet objet.
        this.goalkeeperCurrentRoamTarget = target.clone();
        // Mise à jour de goalkeeperNextRoamDecisionTime pour cet objet.
        this.goalkeeperNextRoamDecisionTime = now + 420;

        // Résultat renvoyé par la fonction.
        return target;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction goalkeeperDistribute : elle regroupe le traitement de cette partie.
    goalkeeperDistribute(gk, ball, passTarget = null) {
        // Vérification avant d'exécuter la suite.
        if (!gk || !ball || !ball.position) return;
        // Vérification avant d'exécuter la suite.
        if (this.goalkeeperIsClearing) return;

        // Vérification avant d'exécuter la suite.
        if (!passTarget) {
            // Appel de findBestGoalkeeperPassTarget pour appliquer l'action prévue.
            passTarget = this.findBestGoalkeeperPassTarget(gk);
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans kickDir.
        let kickDir;
        // Valeur mémorisée dans kickForce.
        let kickForce;

        // Vérification avant d'exécuter la suite.
        if (passTarget) {
            // Appel de subtract pour appliquer l'action prévue.
            kickDir = passTarget.position.subtract(gk.position);
            // Mise à jour de y.
            kickDir.y = 0;

            // Vérification avant d'exécuter la suite.
            if (kickDir.lengthSquared() > 0.0001) {
                // Appel de normalize pour appliquer l'action prévue.
                kickDir.normalize();
            // Cas utilisé quand les tests précédents échouent.
            } else {
                // Appel de Vector3 pour appliquer l'action prévue.
                kickDir = new BABYLON.Vector3(-1, 0, 0);
            // Fermeture du bloc ou de l'appel.
            }

            // Instruction nécessaire au déroulement de cette partie.
            kickForce = 38;
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Appel de Vector3 pour appliquer l'action prévue.
            kickDir = new BABYLON.Vector3(-1, 0, 0);
            // Mise à jour de z.
            kickDir.z = (Math.random() - 0.5) * 0.45;
            // Appel de normalize pour appliquer l'action prévue.
            kickDir.normalize();

            // Instruction nécessaire au déroulement de cette partie.
            kickForce = 52;
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de setFacing pour appliquer l'action prévue.
        this.setFacing(gk, kickDir);

        // Mise à jour de goalkeeperIsClearing pour cet objet.
        this.goalkeeperIsClearing = true;
        // Mise à jour de goalkeeperReleaseUntil pour cet objet.
        this.goalkeeperReleaseUntil = performance.now() + 380;
        // Mise à jour de goalkeeperKickCooldownUntil pour cet objet.
        this.goalkeeperKickCooldownUntil = performance.now() + 900;

        // Mise à jour de aiControlledPlayer pour cet objet.
        this.aiControlledPlayer = gk;
        // Mise à jour de goalkeeperLocked pour cet objet.
        this.goalkeeperLocked = true;
        // Mise à jour de ballChaser pour cet objet.
        this.ballChaser = null;
        // Mise à jour de goalkeeperCurrentRoamTarget pour cet objet.
        this.goalkeeperCurrentRoamTarget = null;
        // Mise à jour de goalkeeperNextRoamDecisionTime pour cet objet.
        this.goalkeeperNextRoamDecisionTime = 0;

        // Appel de kick pour appliquer l'action prévue.
        kick(this.scene, ball, gk, kickDir, kickForce, this);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction findBestGoalkeeperPassTarget : elle regroupe le traitement de cette partie.
    findBestGoalkeeperPassTarget(gk) {
        // Vérification avant d'exécuter la suite.
        if (!gk) return null;

        // Valeur mémorisée dans bestMate.
        let bestMate = null;
        // Valeur mémorisée dans bestScore.
        let bestScore = -Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player => {
            // Vérification avant d'exécuter la suite.
            if (!player || player === gk) return;
            // Vérification avant d'exécuter la suite.
            if (player.role === "GK") return;

            // Valeur mémorisée dans toMate.
            const toMate = player.position.subtract(gk.position);
            // Valeur mémorisée dans dist.
            const dist = toMate.length();

            // Vérification avant d'exécuter la suite.
            if (dist < 7 || dist > 32) return;

            // Valeur mémorisée dans score.
            let score = 0;

            // Instruction nécessaire au déroulement de cette partie.
            score += (gk.position.x - player.position.x) * 2.2;
            // Appel de abs pour appliquer l'action prévue.
            score -= Math.abs(player.position.z) * 0.18;

            // Appel de forEach pour appliquer l'action prévue.
            this.opponents.forEach(op => {
                // Vérification avant d'exécuter la suite.
                if (!op || !op.position) return;

                // Préparation de d avec Babylon.js.
                const d = BABYLON.Vector3.Distance(op.position, player.position);
                // Vérification avant d'exécuter la suite.
                if (d < 9) {
                    // Instruction nécessaire au déroulement de cette partie.
                    score -= (9 - d) * 2.5;
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            });

            // Vérification avant d'exécuter la suite.
            if (score > bestScore) {
                // Instruction nécessaire au déroulement de cette partie.
                bestScore = score;
                // Instruction nécessaire au déroulement de cette partie.
                bestMate = player;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });

        // Résultat renvoyé par la fonction.
        return bestScore > 0 ? bestMate : null;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction repositionForGoalkeeperDistribution : elle regroupe le traitement de cette partie.
    repositionForGoalkeeperDistribution(gk) {
        // Vérification avant d'exécuter la suite.
        if (!gk) return;

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player => {
            // Vérification avant d'exécuter la suite.
            if (!player || player === gk) return;

            // Valeur mémorisée dans target.
            const target = player.homePosition.clone();

            // Vérification avant d'exécuter la suite.
            if (target.x > 34) {
                // Mise à jour de x.
                target.x = 34;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (Math.abs(target.z) < 8) {
                // Mise à jour de z.
                target.z = target.z >= 0 ? 10 : -10;
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

    // -----------------------
    // AI SHOT (pour les tirs à courte distance)
    // -----------------------
    // Fonction startAIShot : elle regroupe le traitement de cette partie.
    startAIShot(player, ball) {
        // Mise à jour de aiShotCharging pour cet objet.
        this.aiShotCharging = true;
        // Mise à jour de aiShotChargeStart pour cet objet.
        this.aiShotChargeStart = performance.now();
        // Mise à jour de aiShotCarrier pour cet objet.
        this.aiShotCarrier = player;
        // Mise à jour de aiControlledPlayer pour cet objet.
        this.aiControlledPlayer = player;
        // Mise à jour de ballChaser pour cet objet.
        this.ballChaser = player;

        // Mise à jour de aiShotDirection pour cet objet.
        this.aiShotDirection = new BABYLON.Vector3(-1, 0, 0);
        // Mise à jour de aiShotCurrentValue pour cet objet.
        this.aiShotCurrentValue = 0;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction handleAIShot : elle regroupe le traitement de cette partie.
    handleAIShot(ball) {
        // Valeur mémorisée dans player.
        const player = this.aiShotCarrier;
        // Vérification avant d'exécuter la suite.
        if (!player || !ball || !ball.position) {
            // Mise à jour de aiShotCharging pour cet objet.
            this.aiShotCharging = false;
            // Mise à jour de aiShotCarrier pour cet objet.
            this.aiShotCarrier = null;
            // Mise à jour de aiShotDirection pour cet objet.
            this.aiShotDirection = null;
            // Mise à jour de aiControlledPlayer pour cet objet.
            this.aiControlledPlayer = null;
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans now.
        const now = performance.now();
        // Valeur mémorisée dans chargeTime.
        const chargeTime = now - this.aiShotChargeStart;

        // Fonction enemyGK stockée pour être rappelée plus tard.
        const enemyGK = this.opponents.find(p => p && p.role === "GK") || null;

        // Valeur mémorisée dans baseTargetZ.
        let baseTargetZ = 0;
        // Vérification avant d'exécuter la suite.
        if (enemyGK) {
            // Instruction nécessaire au déroulement de cette partie.
            baseTargetZ = enemyGK.position.z >= 0 ? -7 : 7;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans scanOffset.
        const scanOffset = Math.sin((chargeTime / 1000) * 7) * 2.8;
        // Préparation de targetZ avec Babylon.js.
        const targetZ = BABYLON.Scalar.Clamp(baseTargetZ + scanOffset, -8.5, 8.5);

        // Création de goalTarget.
        const goalTarget = new BABYLON.Vector3(-50, 0, targetZ);
        // Valeur mémorisée dans dir.
        const dir = goalTarget.subtract(player.position);
        // Mise à jour de y.
        dir.y = 0;

        // Vérification avant d'exécuter la suite.
        if (dir.lengthSquared() > 0.0001) {
            // Appel de normalize pour appliquer l'action prévue.
            dir.normalize();
            // Mise à jour de aiShotDirection pour cet objet.
            this.aiShotDirection = dir.clone();
        // Cas utilisé quand les tests précédents échouent.
        } else {
            // Mise à jour de aiShotDirection pour cet objet.
            this.aiShotDirection = new BABYLON.Vector3(-1, 0, 0);
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de aiControlledPlayer pour cet objet.
        this.aiControlledPlayer = player;
        // Mise à jour de ballChaser pour cet objet.
        this.ballChaser = player;

        // Appel de setFacing pour appliquer l'action prévue.
        this.setFacing(player, this.aiShotDirection);

        // Préparation de shotDistance avec Babylon.js.
        const shotDistance = BABYLON.Vector3.Distance(player.position, ball.position);
        // Vérification avant d'exécuter la suite.
        if (shotDistance > 2.6) {
            // Mise à jour de aiShotCharging pour cet objet.
            this.aiShotCharging = false;
            // Mise à jour de aiShotCarrier pour cet objet.
            this.aiShotCarrier = null;
            // Mise à jour de aiShotDirection pour cet objet.
            this.aiShotDirection = null;
            // Mise à jour de aiControlledPlayer pour cet objet.
            this.aiControlledPlayer = null;
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans clearSideFromGK.
        const clearSideFromGK = !enemyGK || Math.abs(targetZ - enemyGK.position.z) > 2.2;
        // Valeur mémorisée dans enoughCharge.
        const enoughCharge = chargeTime > 380;
        // Valeur mémorisée dans mustShoot.
        const mustShoot = chargeTime > 900;

        // Vérification avant d'exécuter la suite.
        if (enoughCharge && clearSideFromGK || mustShoot) {
            // Valeur mémorisée dans force.
            const force = 55;

            // Appel de kick pour appliquer l'action prévue.
            kick(
                // Paramètre de l'appel ou valeur de configuration.
                this.scene,
                // Paramètre de l'appel ou valeur de configuration.
                ball,
                // Paramètre de l'appel ou valeur de configuration.
                player,
                // Paramètre de l'appel ou valeur de configuration.
                this.aiShotDirection,
                // Paramètre de l'appel ou valeur de configuration.
                force,
                // Instruction nécessaire au déroulement de cette partie.
                this
            // Fermeture du bloc ou de l'appel.
            );

            // Mise à jour de aiShotCharging pour cet objet.
            this.aiShotCharging = false;
            // Mise à jour de aiShotCarrier pour cet objet.
            this.aiShotCarrier = null;
            // Mise à jour de aiShotDirection pour cet objet.
            this.aiShotDirection = null;
            // Mise à jour de aiControlledPlayer pour cet objet.
            this.aiControlledPlayer = null;
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;

            // Mise à jour de teamPossessionLockUntil pour cet objet.
            this.teamPossessionLockUntil = performance.now() + 180;
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    
// Fermeture du bloc ou de l'appel.
}