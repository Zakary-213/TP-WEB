// Ball
// Implémentation prête pour un ballon en .glb
// - Tu peux changer `ballRootUrl` et `ballFileName` selon l'emplacement / nom de ton fichier.
// - On garde une petite sphère de secours qui disparaît quand le .glb est chargé.
// Fonction createBall : elle regroupe le traitement de cette partie.
const createBall = (scene) => {
    // Nœud racine du ballon (c'est lui qui est animé et déplacé dans script.js)
    // Création de ball.
    const ball = new BABYLON.TransformNode("ball", scene);
    // Mise à jour de position.
    ball.position = new BABYLON.Vector3(0, 0.75, 0);

    // Vitesse personnalisée pour la physique simple (tir, rebonds)
    // Mise à jour de velocity.
    ball.velocity = new BABYLON.Vector3(0, 0, 0);

    // Placeholder sphérique au cas où le .glb met du temps à charger
    // Préparation de placeholder avec Babylon.js.
    const placeholder = BABYLON.MeshBuilder.CreateSphere("ballPlaceholder", { diameter: 1.1 }, scene);
    // Mise à jour de parent.
    placeholder.parent = ball;
    // Création de ballMaterial.
    const ballMaterial = new BABYLON.StandardMaterial("ballMat", scene);
    // Mise à jour de emissiveColor.
    ballMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    // Mise à jour de material.
    placeholder.material = ballMaterial;

    // Chemin et nom du fichier GLB à adapter par toi
    // Valeur mémorisée dans ballRootUrl.
    const ballRootUrl = "textures/";         
    // Valeur mémorisée dans ballFileName.
    const ballFileName = "football_anime.glb"; 

    // Appel de ImportMesh pour appliquer l'action prévue.
    BABYLON.SceneLoader.ImportMesh(
        // Paramètre de l'appel ou valeur de configuration.
        "",
        // Paramètre de l'appel ou valeur de configuration.
        ballRootUrl,
        // Paramètre de l'appel ou valeur de configuration.
        ballFileName,
        // Paramètre de l'appel ou valeur de configuration.
        scene,
        // Ouverture du bloc correspondant.
        (meshes) => {
            // Vérification avant d'exécuter la suite.
            if (!meshes || meshes.length === 0) {
                // Résultat renvoyé par la fonction.
                return;
            // Fermeture du bloc ou de l'appel.
            }

            // On groupe les meshes du .glb sous le nœud "ball" pour qu'il suive les animations existantes
            // Appel de forEach pour appliquer l'action prévue.
            meshes.forEach((m) => {
                // Mise à jour de parent.
                m.parent = ball;
            // Fermeture du bloc ou de l'appel.
            });

            // Optionnel: on peut ajuster l'échelle globale du ballon importé ici
            // Mise à jour de scaling.
            ball.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

            // On masque la sphère de secours une fois le .glb chargé
            // Appel de setEnabled pour appliquer l'action prévue.
            placeholder.setEnabled(false);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    );

    // --- Rotation automatique : le ballon roule dans le sens de son déplacement ---
    // Valeur mémorisée dans lastPosition.
    let lastPosition = ball.position.clone();
    // Valeur mémorisée dans radius.
    const radius = 0.55; // rayon approximatif du ballon (diamètre 1.1)

    // Appel de add pour appliquer l'action prévue.
    scene.onBeforeRenderObservable.add(() => {
        // Valeur mémorisée dans current.
        const current = ball.position.clone();
        // Valeur mémorisée dans delta.
        const delta = current.subtract(lastPosition);
        // On ne regarde que le déplacement au sol (XZ)
        // Valeur mémorisée dans dx.
        const dx = delta.x;
        // Valeur mémorisée dans dz.
        const dz = delta.z;
        // Valeur mémorisée dans distance.
        const distance = Math.sqrt(dx * dx + dz * dz);

        // Vérification avant d'exécuter la suite.
        if (distance > 0.0001) {
            // Direction de déplacement dans le plan XZ
            // Création de moveDir.
            const moveDir = new BABYLON.Vector3(dx, 0, dz).normalize();
            // Axe de rotation = direction de déplacement x up (0,1,0)
            // Création de up.
            const up = new BABYLON.Vector3(0, 1, 0);
            // Préparation de axis avec Babylon.js.
            let axis = BABYLON.Vector3.Cross(moveDir, up);
            // Vérification avant d'exécuter la suite.
            if (axis.lengthSquared() > 0.0001) {
                // Appel de normalize pour appliquer l'action prévue.
                axis = axis.normalize();
                // angle de rotation = distance / rayon (roulement sans glissement)
                // Valeur mémorisée dans angle.
                const angle = distance / radius;
                // Appel de rotate pour appliquer l'action prévue.
                ball.rotate(axis, angle, BABYLON.Space.WORLD);
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Appel de copyFrom pour appliquer l'action prévue.
        lastPosition.copyFrom(current);
    // Fermeture du bloc ou de l'appel.
    });

    // Résultat renvoyé par la fonction.
    return ball;
// Fermeture du bloc ou de l'appel.
};
