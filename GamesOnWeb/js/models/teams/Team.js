// Classe Team : elle sert de modèle pour cet élément du jeu.
class Team {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene, name, color, isPlayerControlled = false, meshIndex = 0) {
        // Mise à jour de scene pour cet objet.
        this.scene = scene;
        // Mise à jour de name pour cet objet.
        this.name = name;
        // Mise à jour de color pour cet objet.
        this.color = color;
        // Mise à jour de isPlayerControlled pour cet objet.
        this.isPlayerControlled = isPlayerControlled;
        // Mise à jour de meshIndex pour cet objet.
        this.meshIndex = meshIndex;
        
        // Mise à jour de players pour cet objet.
        this.players = []; 
        // Mise à jour de score pour cet objet.
        this.score = 0;
        // Mise à jour de activePlayer pour cet objet.
        this.activePlayer = null;
        // Mise à jour de lastSwitchTime pour cet objet.
        this.lastSwitchTime = 0;
        // Mise à jour de switchCooldown pour cet objet.
        this.switchCooldown = 1000; // ms
        // Mise à jour de switchLockUntil pour cet objet.
        this.switchLockUntil = 0;

        // joueur qui presse la balle en défense
        // Mise à jour de ballChaser pour cet objet.
        this.ballChaser = null;

        // joueur qui a touché la balle en dernier (pour éviter qu'il chase sa propre passe)
        // Mise à jour de lastBallPlayer pour cet objet.
        this.lastBallPlayer = null;

        // petit délai pendant lequel on considère encore qu'on a la possession
        // Mise à jour de teamPossessionLockUntil pour cet objet.
        this.teamPossessionLockUntil = 0;

        // Mise à jour de goalEmergencyModeUntil pour cet objet.
        this.goalEmergencyModeUntil = 0;

        
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction addPlayer : elle regroupe le traitement de cette partie.
    addPlayer(position, side = 1) {

        // Valeur mémorisée dans newPlayer.
        const newPlayer = createPlayer(this.scene, position, this.color, this.meshIndex);
        // Mise à jour de teamRef.
        newPlayer.teamRef = this;
        
        // On modifie la taille du joueur pour qu'elle corresponde à ce qui était dans script.js
        // Vérification avant d'exécuter la suite.
        if(newPlayer.model){
            // Appel de getChildMeshes pour appliquer l'action prévue.
            newPlayer.model.getChildMeshes().forEach(mesh=>{
                // Mise à jour de scaling.
                mesh.scaling = new BABYLON.Vector3(8,8,8);
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }

        // Ajout de la boite de collision
        // Mise à jour de ellipsoid.
        newPlayer.ellipsoid = new BABYLON.Vector3(1,1,1);
        // Mise à jour de checkCollisions.
        newPlayer.checkCollisions = true;

        // Orientation de base selon le côté de l'équipe
        // side = 1 : équipe de gauche (regarde vers +X)
        // side = -1 : équipe de droite (regarde vers -X)
        // Mise à jour de side.
        newPlayer.side = side;

        // Sauvegarde pour reset
        // Mise à jour de initialPosition.
        newPlayer.initialPosition = position.clone();
        // Mise à jour de initialRotationY.
        newPlayer.initialRotationY = side === 1 ? Math.PI / 2 : -Math.PI / 2;

        // Appel de push pour appliquer l'action prévue.
        this.players.push(newPlayer);
        // Résultat renvoyé par la fonction.
        return newPlayer;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction createTeamFormation : elle regroupe le traitement de cette partie.
    createTeamFormation(side){

        // Valeur mémorisée dans startX.
        const startX = -20 * side;

        // Valeur mémorisée dans gkX.
        const gkX = side === 1 ? -47 : 47;

        // Valeur mémorisée dans formation.
        const formation = [
            // Appel de Vector3 pour appliquer l'action prévue.
            { role: "GK",  pos: new BABYLON.Vector3(gkX, 0, 0) },
            // Appel de Vector3 pour appliquer l'action prévue.
            { role: "DEF", pos: new BABYLON.Vector3(startX - (5 * side), 0, -10) },
            // Appel de Vector3 pour appliquer l'action prévue.
            { role: "DEF", pos: new BABYLON.Vector3(startX - (5 * side), 0, 10) },
            // Appel de Vector3 pour appliquer l'action prévue.
            { role: "ATT", pos: new BABYLON.Vector3(startX + (5 * side), 0, -8) },
            // Appel de Vector3 pour appliquer l'action prévue.
            { role: "ATT", pos: new BABYLON.Vector3(startX + (5 * side), 0, 8) }
        // Fermeture du bloc ou de l'appel.
        ];

        // Appel de forEach pour appliquer l'action prévue.
        formation.forEach(data=>{

            // Valeur mémorisée dans player.
            const player = this.addPlayer(data.pos, side);

            // Mise à jour de role.
            player.role = data.role;

            // position tactique de base
            // Mise à jour de homePosition.
            player.homePosition = data.pos.clone();

            // Mise à jour de wanderTarget.
            player.wanderTarget = player.homePosition.clone();
            // Mise à jour de nextWanderTime.
            player.nextWanderTime = 0;

            // état de l'IA
            // Mise à jour de state.
            player.state = "IDLE";

            // Vérification avant d'exécuter la suite.
            if(player.role === "GK"){
                // Mise à jour de minX.
                player.minX = player.homePosition.x - 2;
                // Mise à jour de maxX.
                player.maxX = player.homePosition.x + 2;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if(player.role === "DEF"){
                // Mise à jour de minX.
                player.minX = player.homePosition.x - 10;
                // Mise à jour de maxX.
                player.maxX = 40;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if(player.role === "ATT"){
                // Mise à jour de minX.
                player.minX = -10;
                // Mise à jour de maxX.
                player.maxX = 40;
            // Fermeture du bloc ou de l'appel.
            }

            // Mise à jour de minZ.
            player.minZ = -25;
            // Mise à jour de maxZ.
            player.maxZ = 25;
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction update : elle regroupe le traitement de cette partie.
    update(ball){
        // Vérification avant d'exécuter la suite.
        if (updateTeamForRestart(this, ball)) return;
        // Valeur mémorisée dans teamHasBall.
        const teamHasBall = this.hasBall(ball);

        // si on récupère la balle on annule le chasseur
        // Vérification avant d'exécuter la suite.
        if(teamHasBall){
            // Mise à jour de ballChaser pour cet objet.
            this.ballChaser = null;
        // Fermeture du bloc ou de l'appel.
        }

        // choix du chasseur
        // Vérification avant d'exécuter la suite.
        if(!this.ballChaser){

            // On ne choisit un chasseur que si la balle est relativement libre/lente,
            // mais on ne coupe jamais toute l'IA de l'équipe.
            // Vérification avant d'exécuter la suite.
            if(!ball.velocity || ball.velocity.length() <= 0.1){
                // Mise à jour de ballChaser pour cet objet.
                this.ballChaser = this.getClosestFieldPlayerToBall(ball);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Cas utilisé quand les tests précédents échouent.
        else{

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(
                // Paramètre de l'appel ou valeur de configuration.
                this.ballChaser.position,
                // Instruction nécessaire au déroulement de cette partie.
                ball.position
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if(dist > 20){
                // Mise à jour de ballChaser pour cet objet.
                this.ballChaser = this.getClosestFieldPlayerToBall(ball);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // défenseurs les plus proches de la balle
        // Valeur mémorisée dans closestDef.
        let closestDef = null;
        // Valeur mémorisée dans farthestDef.
        let farthestDef = null;

        // Valeur mémorisée dans bestDist.
        let bestDist = Infinity;
        // Valeur mémorisée dans worstDist.
        let worstDist = -Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player=>{

            // Vérification avant d'exécuter la suite.
            if(player.role !== "DEF") return;

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(
                // Paramètre de l'appel ou valeur de configuration.
                player.position,
                // Instruction nécessaire au déroulement de cette partie.
                ball.position
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if(dist < bestDist){
                // Instruction nécessaire au déroulement de cette partie.
                bestDist = dist;
                // Instruction nécessaire au déroulement de cette partie.
                closestDef = player;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if(dist > worstDist){
                // Instruction nécessaire au déroulement de cette partie.
                worstDist = dist;
                // Instruction nécessaire au déroulement de cette partie.
                farthestDef = player;
            // Fermeture du bloc ou de l'appel.
            }

        // Fermeture du bloc ou de l'appel.
        });

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player=>{

            // Vérification avant d'exécuter la suite.
            if(player === this.activePlayer) return;

            // -----------------------
            // DEFENSE
            // -----------------------
            // Vérification avant d'exécuter la suite.
            if(!teamHasBall){

                // Vérification avant d'exécuter la suite.
                if(player === this.ballChaser){
                    // Mise à jour de state.
                    player.state = "CHASE";
                // Fermeture du bloc ou de l'appel.
                }
                // Cas utilisé quand les tests précédents échouent.
                else{
                    // Mise à jour de state.
                    player.state = "POSITION";
                // Fermeture du bloc ou de l'appel.
                }

            // Fermeture du bloc ou de l'appel.
            }

            // -----------------------
            // ATTAQUE
            // -----------------------
            // Cas utilisé quand les tests précédents échouent.
            else{

                // Vérification avant d'exécuter la suite.
                if(player === closestDef){
                    // Mise à jour de state.
                    player.state = "SUPPORT";
                // Fermeture du bloc ou de l'appel.
                }
                // Deuxième possibilité à tester.
                else if(player === farthestDef){
                    // Mise à jour de state.
                    player.state = "COVER";
                // Fermeture du bloc ou de l'appel.
                }
                // Deuxième possibilité à tester.
                else if(player.role === "ATT"){
                    // Mise à jour de state.
                    player.state = "ATTACK_POSITION";
                // Fermeture du bloc ou de l'appel.
                }

            // Fermeture du bloc ou de l'appel.
            }

            // Appel de updatePlayerAI pour appliquer l'action prévue.
            this.updatePlayerAI(player, ball, teamHasBall);

        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updatePlayerAI : elle regroupe le traitement de cette partie.
    updatePlayerAI(player, ball, teamHasBall){

        // Valeur mémorisée dans ballPos.
        const ballPos = ball.position;

        // -----------------------
        // CHASE
        // -----------------------
        // Vérification avant d'exécuter la suite.
        if(player.state === "CHASE"){

            // Vérification avant d'exécuter la suite.
            if(player.role === "GK"){

                // Préparation de dist avec Babylon.js.
                const dist = BABYLON.Vector3.Distance(
                    // Paramètre de l'appel ou valeur de configuration.
                    player.position,
                    // Instruction nécessaire au déroulement de cette partie.
                    ball.position
                // Fermeture du bloc ou de l'appel.
                );

                // Vérification avant d'exécuter la suite.
                if(dist > 12) return;
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(player, ball.position);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // -----------------------
        // SUPPORT
        // -----------------------
        // Vérification avant d'exécuter la suite.
        if(player.state === "SUPPORT"){

            // Valeur mémorisée dans target.
            const target = this.activePlayer.position.clone();

            // Instruction nécessaire au déroulement de cette partie.
            target.x -= 14 * player.side;
            // Mise à jour de z.
            target.z = player.homePosition.z * 1.2;

            // Valeur mémorisée dans liveOffset.
            const liveOffset = this.getLiveOffset(player, 0.8, 0.0018);
            // Appel de addInPlace pour appliquer l'action prévue.
            target.addInPlace(liveOffset);

            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(player, target);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // -----------------------
        // COVER
        // -----------------------
        // Vérification avant d'exécuter la suite.
        if(player.state === "COVER"){

            // Valeur mémorisée dans target.
            const target = player.homePosition.clone();

            // Instruction nécessaire au déroulement de cette partie.
            target.x += (ball.position.x - player.homePosition.x) * 0.4;
            // Instruction nécessaire au déroulement de cette partie.
            target.z += (ball.position.z - player.homePosition.z) * 0.3;

            // Valeur mémorisée dans liveOffset.
            const liveOffset = this.getLiveOffset(player, 0.7, 0.0015);
            // Appel de addInPlace pour appliquer l'action prévue.
            target.addInPlace(liveOffset);

            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(player, target);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // -----------------------
        // ATTACK POSITION
        // triangle offensif
        // -----------------------
        // Vérification avant d'exécuter la suite.
        if(player.state === "ATTACK_POSITION"){

            // Valeur mémorisée dans target.
            const target = player.homePosition.clone();

            // l'attaquant avance avec le jeu mais ne dépasse pas une limite
            // Valeur mémorisée dans attackLine.
            const attackLine = ball.position.x + (10 * player.side);

            // Mise à jour de x.
            target.x = Math.max(player.minX, Math.min(player.maxX, attackLine));

            // Mise à jour de z.
            target.z = player.homePosition.z * 1.4;

            // Valeur mémorisée dans liveOffset.
            const liveOffset = this.getLiveOffset(player, 1.0, 0.002);
            // Appel de addInPlace pour appliquer l'action prévue.
            target.addInPlace(liveOffset);

            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(player, target);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }

        // -----------------------
        // POSITION
        // -----------------------
        // Vérification avant d'exécuter la suite.
        if(player.state === "POSITION"){

            // Valeur mémorisée dans target.
            let target = player.homePosition.clone();

            // Valeur mémorisée dans liveOffset.
            const liveOffset = this.getLiveOffset(player, 1.5, 0.0015);
            // Appel de addInPlace pour appliquer l'action prévue.
            target.addInPlace(liveOffset);

            // Vérification avant d'exécuter la suite.
            if(player.role === "DEF"){

                // Valeur mémorisée dans influence.
                let influence = 0.25;

                // Instruction nécessaire au déroulement de cette partie.
                target.x += (ballPos.x - player.homePosition.x) * influence;
                // Instruction nécessaire au déroulement de cette partie.
                target.z += (ballPos.z - player.homePosition.z) * influence;

            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if(player.role === "ATT"){

                // Instruction nécessaire au déroulement de cette partie.
                target.x += (ballPos.x - player.homePosition.x) * 0.3;
                // Instruction nécessaire au déroulement de cette partie.
                target.z += (player.homePosition.z - ballPos.z) * 0.2;

            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if(player.role === "GK"){

                // Mise à jour de x.
                target.x = player.homePosition.x;

                // Instruction nécessaire au déroulement de cette partie.
                target.z += (ballPos.z - player.homePosition.z) * 0.2;
            // Fermeture du bloc ou de l'appel.
            }

            // Mise à jour de x.
            target.x = Math.max(player.minX, Math.min(player.maxX, target.x));
            // Mise à jour de z.
            target.z = Math.max(player.minZ, Math.min(player.maxZ, target.z));

            // Appel de movePlayerTowards pour appliquer l'action prévue.
            this.movePlayerTowards(player, target);
            // Résultat renvoyé par la fonction.
            return;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }
    
    // Fonction movePlayerTowards : elle regroupe le traitement de cette partie.
    movePlayerTowards(player, target, speedOverride = null) {
        // Vérification avant d'exécuter la suite.
        if (!player || !target) return;
        // Vérification avant d'exécuter la suite.
        if (player.isTackling) return;

        // Appel de initSteeringPlayer pour appliquer l'action prévue.
        initSteeringPlayer(player);

        // Valeur mémorisée dans baseSpeed.
        const baseSpeed = speedOverride ?? 0.07;
        // Valeur mémorisée dans stopDistance.
        const stopDistance = 0.35;
        // Valeur mémorisée dans slowRadius.
        const slowRadius = 2.2;

        // Mise à jour de maxSteeringSpeed.
        player.maxSteeringSpeed = baseSpeed;
        // Mise à jour de maxSteeringForce.
        player.maxSteeringForce = 0.012;

        // Valeur mémorisée dans useAvoid.
        const useAvoid = player.role !== "GK";

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
                avoidRadius: 8.0,
                // Paramètre de l'appel ou valeur de configuration.
                corridorRadius: 2.8,
                // Paramètre de l'appel ou valeur de configuration.
                lateralOffset: 4.5,
                // Instruction nécessaire au déroulement de cette partie.
                forwardLook: 8.0
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

        // Valeur mémorisée dans arriveForce.
        const arriveForce = arriveSteering(
            // Paramètre de l'appel ou valeur de configuration.
            player,
            // Paramètre de l'appel ou valeur de configuration.
            finalTarget,
            // Paramètre de l'appel ou valeur de configuration.
            baseSpeed,
            // Paramètre de l'appel ou valeur de configuration.
            slowRadius,
            // Instruction nécessaire au déroulement de cette partie.
            stopDistance
        // Fermeture du bloc ou de l'appel.
        );

        // Valeur mémorisée dans neighbors.
        const neighbors = this.getSeparationNeighbors(player);

        // Valeur mémorisée dans separationForce.
        const separationForce = separationSteering(
            // Paramètre de l'appel ou valeur de configuration.
            player,
            // Paramètre de l'appel ou valeur de configuration.
            neighbors,
            // Paramètre de l'appel ou valeur de configuration.
            3.2,
            // Instruction nécessaire au déroulement de cette partie.
            baseSpeed
        // Fermeture du bloc ou de l'appel.
        );

        // Valeur mémorisée dans steering.
        const steering = arriveForce.add(separationForce.scale(0.65));
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
        if (!avoidanceTarget && player.facingDirection && player.facingDirection.lengthSquared() > 0.0001) {
            // Instruction nécessaire au déroulement de cette partie.
            facingDirection = moveDir;
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de facingDirection.
        player.facingDirection = facingDirection.clone();

        // Vérification avant d'exécuter la suite.
        if (player.model) {
            // Mise à jour de y.
            player.model.rotation.y = Math.atan2(facingDirection.x, facingDirection.z);
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans moveSpeed.
        const moveSpeed = velocity.length();
        // Appel de move pour appliquer l'action prévue.
        player.move(moveDir.x, moveDir.z, moveSpeed);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction resetPositions : elle regroupe le traitement de cette partie.
    resetPositions(){

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player=>{

            // Mise à jour de position.
            player.position = player.initialPosition.clone();
            // Appel de resetSteeringVelocity pour appliquer l'action prévue.
            resetSteeringVelocity(player);
            
            // Vérification avant d'exécuter la suite.
            if(player.model){
                // Mise à jour de y.
                player.model.rotation.y = player.initialRotationY;
                // Mise à jour de z.
                player.model.rotation.z = 0;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if(player.playAnimation){
                // Appel de playAnimation pour appliquer l'action prévue.
                player.playAnimation("idle");
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction switchPlayer : elle regroupe le traitement de cette partie.
    switchPlayer(newPlayer, cameras){

        // Vérification avant d'exécuter la suite.
        if(!newPlayer) return;

        // Mise à jour de activePlayer pour cet objet.
        this.activePlayer = newPlayer;

        // Vérification avant d'exécuter la suite.
        if(cameras){
            // Très important :
            // on NE change PAS lockedTarget ici
            // la TPS doit rester lock sur cameraTargetNode

            // Vérification avant d'exécuter la suite.
            if(cameras.fpvCamera){
                // Mise à jour de parent.
                cameras.fpvCamera.parent = newPlayer;
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction switchPlayerSmooth : elle regroupe le traitement de cette partie.
    switchPlayerSmooth(newPlayer, cameras, scene, duration = 180){
        // Vérification avant d'exécuter la suite.
        if(!newPlayer) return;
        // Vérification avant d'exécuter la suite.
        if(newPlayer === this.activePlayer) return;

        // Valeur mémorisée dans oldPlayer.
        const oldPlayer = this.activePlayer;
        // Mise à jour de activePlayer pour cet objet.
        this.activePlayer = newPlayer;

        // Vérification avant d'exécuter la suite.
        if(cameras?.fpvCamera){
            // Mise à jour de parent.
            cameras.fpvCamera.parent = newPlayer;
        // Fermeture du bloc ou de l'appel.
        }

        // Valeur mémorisée dans canAnimateCamera.
        const canAnimateCamera =
            // Instruction nécessaire au déroulement de cette partie.
            scene &&
            // Instruction nécessaire au déroulement de cette partie.
            cameras &&
            // Instruction nécessaire au déroulement de cette partie.
            cameras.cameraTargetNode &&
            // Instruction nécessaire au déroulement de cette partie.
            oldPlayer &&
            // Instruction nécessaire au déroulement de cette partie.
            scene.activeCamera !== cameras.fpvCamera;

        // Vérification avant d'exécuter la suite.
        if (canAnimateCamera) {
            // Appel de animateCameraSwitch pour appliquer l'action prévue.
            animateCameraSwitch(scene, cameras, oldPlayer, newPlayer, duration);
        // Deuxième possibilité à tester.
        } else if(cameras?.cameraTargetNode){
            // Appel de copyFrom pour appliquer l'action prévue.
            cameras.cameraTargetNode.position.copyFrom(newPlayer.position);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getClosestPlayerToBall : elle regroupe le traitement de cette partie.
    getClosestPlayerToBall(ball){

        // Valeur mémorisée dans closest.
        let closest = null;
        // Valeur mémorisée dans bestDist.
        let bestDist = Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player=>{

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(
                // Paramètre de l'appel ou valeur de configuration.
                player.position,
                // Instruction nécessaire au déroulement de cette partie.
                ball.position
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if(dist < bestDist){
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

    // Fonction hasBall : elle regroupe le traitement de cette partie.
    hasBall(ball){

        // pendant un court instant après une passe / frappe,
        // on considère encore que l'équipe a la possession
        // Vérification avant d'exécuter la suite.
        if(performance.now() < this.teamPossessionLockUntil){
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if(!this.activePlayer) return false;

        // Préparation de dist avec Babylon.js.
        const dist = BABYLON.Vector3.Distance(
            // Paramètre de l'appel ou valeur de configuration.
            this.activePlayer.position,
            // Instruction nécessaire au déroulement de cette partie.
            ball.position
        // Fermeture du bloc ou de l'appel.
        );

        // Résultat renvoyé par la fonction.
        return dist < 8;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction teamHasBall : elle regroupe le traitement de cette partie.
    teamHasBall(ball){

        // Pendant un court instant après une passe / frappe,
        // on considère encore que l'équipe a la possession
        // Vérification avant d'exécuter la suite.
        if(performance.now() < this.teamPossessionLockUntil){
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        }

        // Parcours de plusieurs valeurs.
        for(const player of this.players){
            // Vérification avant d'exécuter la suite.
            if(!player || !player.position) continue;

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(
                // Paramètre de l'appel ou valeur de configuration.
                player.position,
                // Instruction nécessaire au déroulement de cette partie.
                ball.position
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if(dist < 3){
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

    // Trouve le joueur de champ le plus proche de la balle
    // Fonction getClosestFieldPlayerToBall : elle regroupe le traitement de cette partie.
    getClosestFieldPlayerToBall(ball){

        // Valeur mémorisée dans closest.
        let closest = null;
        // Valeur mémorisée dans bestDist.
        let bestDist = Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player=>{

            // Vérification avant d'exécuter la suite.
            if(player === this.activePlayer) return;

            // Vérification avant d'exécuter la suite.
            if(player.role === "GK") return;

            // Vérification avant d'exécuter la suite.
            if(player === this.lastBallPlayer) return;

            // Préparation de dist avec Babylon.js.
            const dist = BABYLON.Vector3.Distance(
                // Paramètre de l'appel ou valeur de configuration.
                player.position,
                // Instruction nécessaire au déroulement de cette partie.
                ball.position
            // Fermeture du bloc ou de l'appel.
            );

            // Vérification avant d'exécuter la suite.
            if(dist < bestDist){
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

    // Fonction autoSwitch : elle regroupe le traitement de cette partie.
    autoSwitch(ball, cameras){
        // Valeur mémorisée dans now.
        const now = performance.now();

        // Vérification avant d'exécuter la suite.
        if (now < this.goalEmergencyModeUntil) return;

        // Auto switch uniquement quand MON équipe a la balle
        // Vérification avant d'exécuter la suite.
        if(!this.teamHasBall(ball)) return;

        // Vérification avant d'exécuter la suite.
        if(now < this.switchLockUntil) return;
        // Vérification avant d'exécuter la suite.
        if(now - this.lastSwitchTime < this.switchCooldown) return;

        // Valeur mémorisée dans closest.
        const closest = this.getClosestPlayerToBall(ball);

        // Vérification avant d'exécuter la suite.
        if(!closest) return;
        // Vérification avant d'exécuter la suite.
        if(closest === this.activePlayer) return;

        // Préparation de distActive avec Babylon.js.
        const distActive = BABYLON.Vector3.Distance(
            // Paramètre de l'appel ou valeur de configuration.
            this.activePlayer.position,
            // Instruction nécessaire au déroulement de cette partie.
            ball.position
        // Fermeture du bloc ou de l'appel.
        );

        // Préparation de distClosest avec Babylon.js.
        const distClosest = BABYLON.Vector3.Distance(
            // Paramètre de l'appel ou valeur de configuration.
            closest.position,
            // Instruction nécessaire au déroulement de cette partie.
            ball.position
        // Fermeture du bloc ou de l'appel.
        );

        // Vérification avant d'exécuter la suite.
        if(distClosest + 1 < distActive){
            // Appel de switchPlayerSmooth pour appliquer l'action prévue.
            this.switchPlayerSmooth(closest, cameras, this.scene, 180);
            // Mise à jour de lastSwitchTime pour cet objet.
            this.lastSwitchTime = now;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction lockAutoSwitch : elle regroupe le traitement de cette partie.
    lockAutoSwitch(duration = 600){
        // Mise à jour de switchLockUntil pour cet objet.
        this.switchLockUntil = performance.now() + duration;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction lockTeamPossession : elle regroupe le traitement de cette partie.
    lockTeamPossession(duration = 1200){
        // Mise à jour de teamPossessionLockUntil pour cet objet.
        this.teamPossessionLockUntil = performance.now() + duration;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction switchLeft : elle regroupe le traitement de cette partie.
    switchLeft(){
        // Résultat renvoyé par la fonction.
        return this.getPlayerOnSide("left");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction switchRight : elle regroupe le traitement de cette partie.
    switchRight(){
        // Résultat renvoyé par la fonction.
        return this.getPlayerOnSide("right");
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getPlayerOnSide : elle regroupe le traitement de cette partie.
    getPlayerOnSide(direction){

        // Valeur mémorisée dans current.
        const current = this.activePlayer;
        // Vérification avant d'exécuter la suite.
        if(!current) return null;

        // Valeur mémorisée dans bestPlayer.
        let bestPlayer = null;
        // Valeur mémorisée dans bestScore.
        let bestScore = -Infinity;

        // Appel de forEach pour appliquer l'action prévue.
        this.players.forEach(player => {

            // Vérification avant d'exécuter la suite.
            if(player === current) return;

            // Valeur mémorisée dans dx.
            const dx = player.position.x - current.position.x;
            // Valeur mémorisée dans dz.
            const dz = player.position.z - current.position.z;

            // Valeur mémorisée dans dist.
            const dist = Math.sqrt(dx*dx + dz*dz);

            // vecteur direction
            // Création de dir.
            const dir = new BABYLON.Vector3(dx,0,dz).normalize();

            // axe droite/gauche
            // Création de right.
            const right = new BABYLON.Vector3(0,0,-1);

            // Valeur mémorisée dans score.
            let score;

            // Vérification avant d'exécuter la suite.
            if(direction === "right"){
                // Appel de Dot pour appliquer l'action prévue.
                score = BABYLON.Vector3.Dot(dir, right);
            // Fermeture du bloc ou de l'appel.
            }
            // Cas utilisé quand les tests précédents échouent.
            else{
                // Appel de Dot pour appliquer l'action prévue.
                score = BABYLON.Vector3.Dot(dir, right.scale(-1));
            // Fermeture du bloc ou de l'appel.
            }

            // on pénalise la distance
            // Instruction nécessaire au déroulement de cette partie.
            score = score - dist * 0.02;

            // Vérification avant d'exécuter la suite.
            if(score > bestScore){
                // Instruction nécessaire au déroulement de cette partie.
                bestScore = score;
                // Instruction nécessaire au déroulement de cette partie.
                bestPlayer = player;
            // Fermeture du bloc ou de l'appel.
            }

        // Fermeture du bloc ou de l'appel.
        });

        // Résultat renvoyé par la fonction.
        return bestPlayer;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getLiveOffset : elle regroupe le traitement de cette partie.
    getLiveOffset(player, amplitude = 1.2, speed = 0.0015){

        // Valeur mémorisée dans time.
        const time = performance.now() * speed;

        // Résultat renvoyé par la fonction.
        return new BABYLON.Vector3(
            // Appel de sin pour appliquer l'action prévue.
            Math.sin(time + player.homePosition.x) * amplitude,
            // Paramètre de l'appel ou valeur de configuration.
            0,
            // Appel de cos pour appliquer l'action prévue.
            Math.cos(time + player.homePosition.z) * amplitude
        // Fermeture du bloc ou de l'appel.
        );
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getSeparationNeighbors : elle regroupe le traitement de cette partie.
    getSeparationNeighbors(player) {
        // Vérification avant d'exécuter la suite.
        if (!player) return [];

        // Résultat renvoyé par la fonction.
        return this.players.filter(other => {
            // Vérification avant d'exécuter la suite.
            if (!other || other === player) return false;
            // Vérification avant d'exécuter la suite.
            if (!other.position) return false;
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getAvoidOpponents : elle regroupe le traitement de cette partie.
    getAvoidOpponents(player) {
        // Vérification avant d'exécuter la suite.
        if (!player) return [];

        // Vérification avant d'exécuter la suite.
        if (!this.opponents || !Array.isArray(this.opponents)) {
            // Résultat renvoyé par la fonction.
            return [];
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return this.opponents.filter(other => {
            // Vérification avant d'exécuter la suite.
            if (!other || !other.position) return false;
            // Vérification avant d'exécuter la suite.
            if (other === player) return false;
            // Vérification avant d'exécuter la suite.
            if (other.role === "GK") return false;
            // Résultat renvoyé par la fonction.
            return true;
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}