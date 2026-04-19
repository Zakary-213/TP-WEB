// Fonction createPlayer : elle regroupe le traitement de cette partie.
const createPlayer = (scene, position, teamColor, meshIndex = 0) => {
    // Création de wPlayer.
    const wPlayer = new BABYLON.TransformNode("player", scene);
    // Mise à jour de position.
    wPlayer.position = position;

    // Mise à jour de animations.
    wPlayer.animations = {};
    // Mise à jour de wobbleTime.
    wPlayer.wobbleTime = 0;
    // Mise à jour de isInFpv.
    wPlayer.isInFpv = false;
    // Endurance (0-1) utilisée pour le sprint
    // Mise à jour de stamina.
    wPlayer.stamina = 1;
    // Mise à jour de maxStamina.
    wPlayer.maxStamina = 1;
    // Direction actuelle du joueur
    // Par défaut, l'équipe de gauche regarde vers +X
    // Mise à jour de facingDirection.
    wPlayer.facingDirection = new BABYLON.Vector3(1, 0, 0);

    // Appel de ImportMesh pour appliquer l'action prévue.
    BABYLON.SceneLoader.ImportMesh(
        // Paramètre de l'appel ou valeur de configuration.
        "",
        // Paramètre de l'appel ou valeur de configuration.
        "textures/",
        // Paramètre de l'appel ou valeur de configuration.
        "cricketers_pack_low_poly.glb",
        // Paramètre de l'appel ou valeur de configuration.
        scene,
        // Fonction function : elle regroupe le traitement de cette partie.
        function (meshes, particleSystems, skeletons, animationGroups) {


            // Création de model.
            const model = new BABYLON.TransformNode("playerModel", scene);
            // Mise à jour de parent.
            model.parent = wPlayer;

            // Valeur mémorisée dans playerMesh.
            const playerMesh = meshes[meshIndex];

            // Mise à jour de parent.
            playerMesh.parent = model;
            // Mise à jour de scaling.
            playerMesh.scaling = new BABYLON.Vector3(8,8,8);
            
            // Centrage dynamique du joueur basé sur sa géométrie (X/Z)
            // Ça enlève le décalage (offset) de base du fichier 3D, peu importe le skin sélectionné
            // Appel de computeWorldMatrix pour appliquer l'action prévue.
            playerMesh.computeWorldMatrix(true);
            // Valeur mémorisée dans centerLocal.
            const centerLocal = playerMesh.getBoundingInfo().boundingBox.center;
            // Mise à jour de x.
            playerMesh.position.x = -centerLocal.x * 8;
            // Mise à jour de z.
            playerMesh.position.z = -centerLocal.z * 8;

            // Orientation de base :
            // - équipe sur la gauche (side = 1) regarde vers +X
            // - équipe sur la droite (side = -1) regarde vers -X (vers l'adversaire)
            // Valeur mémorisée dans side.
            const side = wPlayer.side || 1;
            // Mise à jour de y.
            model.rotation.y = side === 1 ? Math.PI / 2 : -Math.PI / 2;
            // Mise à jour de x.
            model.rotation.x = -Math.PI / 2;

            // Ajuste la hauteur pour que les pieds soient au niveau du sol (y = 0)
            // Appel de computeWorldMatrix pour appliquer l'action prévue.
            playerMesh.computeWorldMatrix(true);
            // Valeur mémorisée dans bbox.
            const bbox = playerMesh.getBoundingInfo().boundingBox;
            // Valeur mémorisée dans minYWorld.
            const minYWorld = bbox.minimumWorld.y;
            // Valeur mémorisée dans offsetY.
            const offsetY = -minYWorld;
            // Instruction nécessaire au déroulement de cette partie.
            model.position.y += offsetY;

            // Mise à jour de model.
            wPlayer.model = model;

            // récupérer les animations
            // Appel de forEach pour appliquer l'action prévue.
            animationGroups.forEach((anim) => {

                // Vérification avant d'exécuter la suite.
                if(anim.name.toLowerCase().includes("idle"))
                    // Mise à jour de idle.
                    wPlayer.animations.idle = anim;

                // Vérification avant d'exécuter la suite.
                if(anim.name.toLowerCase().includes("run") || anim.name.toLowerCase().includes("walk"))
                    // Mise à jour de run.
                    wPlayer.animations.run = anim;

            // Fermeture du bloc ou de l'appel.
            });

            // animation par défaut
            // Vérification avant d'exécuter la suite.
            if(wPlayer.animations.idle){
                // Appel de start pour appliquer l'action prévue.
                wPlayer.animations.idle.start(true);
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de forEach pour appliquer l'action prévue.
            meshes.forEach((mesh, index) => {
                // Vérification avant d'exécuter la suite.
                if (index !== meshIndex && mesh !== playerMesh && mesh.parent !== playerMesh) {
                    // Appel de dispose pour appliquer l'action prévue.
                    mesh.dispose();
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            });
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    );

    // --- ENCAPSULATION DES MÉTHODES ---

    // Mise à jour de currentAnim.
    wPlayer.currentAnim = "idle";
    
    // Mise à jour de playAnimation.
    wPlayer.playAnimation = function(name) {
        // Vérification avant d'exécuter la suite.
        if (!this.animations) return;
        // Vérification avant d'exécuter la suite.
        if (this.currentAnim === name) return;

        // Parcours de plusieurs valeurs.
        for (let anim in this.animations) {
            // Appel de stop pour appliquer l'action prévue.
            this.animations[anim].stop();
        // Fermeture du bloc ou de l'appel.
        }

        // Vérification avant d'exécuter la suite.
        if (this.animations[name]) {
            // Appel de start pour appliquer l'action prévue.
            this.animations[name].start(true);
            // Mise à jour de currentAnim pour cet objet.
            this.currentAnim = name;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    };

    // Mise à jour de move.
    wPlayer.move = function(moveX, moveZ, speed) {
        // Vérification avant d'exécuter la suite.
        if (moveX !== 0 || moveZ !== 0) {
            // Appel de playAnimation pour appliquer l'action prévue.
            this.playAnimation("run");
            
            // Animation procédurale de dandinement ("wobble")
            // Valeur mémorisée dans dt.
            const dt = scene.getEngine().getDeltaTime() / 1000;
            // Instruction nécessaire au déroulement de cette partie.
            this.wobbleTime += dt * 15; // Vitesse de balancement
            
            // Normalisation pour ne pas aller plus vite en diagonale
            // Valeur mémorisée dans length.
            const length = Math.sqrt(moveX * moveX + moveZ * moveZ);

            // sécurité (évite NaN)
            // Vérification avant d'exécuter la suite.
            if(length === 0){
                // Appel de playAnimation pour appliquer l'action prévue.
                this.playAnimation("idle");
                // Résultat renvoyé par la fonction.
                return null;
            // Fermeture du bloc ou de l'appel.
            }

            // Appel de playAnimation pour appliquer l'action prévue.
            this.playAnimation("run");

            // Valeur mémorisée dans normX.
            const normX = moveX / length;
            // Valeur mémorisée dans normZ.
            const normZ = moveZ / length;

            // Mémorise la dernière direction du joueur
            // Appel de copyFromFloats pour appliquer l'action prévue.
            this.facingDirection.copyFromFloats(normX, 0, normZ);

            // Instruction nécessaire au déroulement de cette partie.
            this.position.x += normX * speed;
            // Instruction nécessaire au déroulement de cette partie.
            this.position.z += normZ * speed;

            // Empêche le joueur de sortir des limites du terrain
            // Valeur mémorisée dans minX.
            let minX = -49;
            // Valeur mémorisée dans maxX.
            let maxX = 49;
            // Valeur mémorisée dans minZ.
            const minZ = -29;
            // Valeur mémorisée dans maxZ.
            const maxZ = 29;

            // Si le joueur est face au but (au centre sur l'axe Z), on agrandit la limite X
            // Vérification avant d'exécuter la suite.
            if (this.position.z > -7.5 && this.position.z < 7.5) {
                // Appel de but pour appliquer l'action prévue.
                minX = -54; // Profondeur du but (environ 4)
                // Instruction nécessaire au déroulement de cette partie.
                maxX = 54;
            // Fermeture du bloc ou de l'appel.
            }

            // Vérification avant d'exécuter la suite.
            if (this.position.x < minX) this.position.x = minX;
            // Vérification avant d'exécuter la suite.
            if (this.position.x > maxX) this.position.x = maxX;
            // Vérification avant d'exécuter la suite.
            if (this.position.z < minZ) this.position.z = minZ;
            // Vérification avant d'exécuter la suite.
            if (this.position.z > maxZ) this.position.z = maxZ;

            // Rotation du modèle vers la direction de déplacement
            // Vérification avant d'exécuter la suite.
            if (this.model) {

                // Calcul du yaw (rotation autour de Y) à partir de la direction XZ
                // Pour un mesh dont l'avant est +Z : yaw = atan2(dirX, dirZ)
                // Valeur mémorisée dans yaw.
                const yaw = Math.atan2(normX, normZ);

                // Mise à jour de y.
                this.model.rotation.y = BABYLON.Scalar.Lerp(
                    // Paramètre de l'appel ou valeur de configuration.
                    this.model.rotation.y,
                    // Paramètre de l'appel ou valeur de configuration.
                    yaw,
                    // Instruction nécessaire au déroulement de cette partie.
                    0.15
                // Fermeture du bloc ou de l'appel.
                );
                
                // Appliquer le wobble (balancement gauche / droite)
                // L'axe X du modèle est son "front/back" roll selon la setup
                // Valeur mémorisée dans wobbleAmount.
                const wobbleAmount = this.isInFpv ? 0.04 : 0.15;
                // Mise à jour de x.
                this.model.rotation.x = -Math.PI / 2 + Math.sin(this.wobbleTime) * wobbleAmount;
            // Fermeture du bloc ou de l'appel.
            }

            // Résultat renvoyé par la fonction.
            return new BABYLON.Vector3(normX, 0, normZ);
        // Fermeture du bloc ou de l'appel.
        }
        // Cas utilisé quand les tests précédents échouent.
        else {
            // Appel de playAnimation pour appliquer l'action prévue.
            this.playAnimation("idle");
            
            // Revenir doucement à la position droite quand on s'arrête
            // Vérification avant d'exécuter la suite.
            if (this.model) {
                // Mise à jour de x.
                this.model.rotation.x = BABYLON.Scalar.Lerp(this.model.rotation.x, -Math.PI / 2, 0.1);
            // Fermeture du bloc ou de l'appel.
            }
            
            // Résultat renvoyé par la fonction.
            return null; // Pas de mouvement
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    };

    // Résultat renvoyé par la fonction.
    return wPlayer;
// Fermeture du bloc ou de l'appel.
};