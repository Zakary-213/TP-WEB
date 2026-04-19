// Fonction setupCameras : elle regroupe le traitement de cette partie.
const setupCameras = (scene, canvas, playerNode) => {
    // Node intermédiaire pour lisser le suivi caméra
    // Création de cameraTargetNode.
    const cameraTargetNode = new BABYLON.TransformNode("cameraTargetNode", scene);
    // Appel de copyFrom pour appliquer l'action prévue.
    cameraTargetNode.position.copyFrom(playerNode.position);

    // 1. Caméra de dessus (TPS / vue haute)
    // Création de tpsCamera.
    const tpsCamera = new BABYLON.ArcRotateCamera(
        // Paramètre de l'appel ou valeur de configuration.
        "tpsCamera",
        // Paramètre de l'appel ou valeur de configuration.
        Math.PI,
        // Instruction nécessaire au déroulement de cette partie.
        0.9,   // angle plus haut pour éviter de voir uniquement les tribunes
        // Paramètre de l'appel ou valeur de configuration.
        70,
        // Appel de Vector3 pour appliquer l'action prévue.
        new BABYLON.Vector3(0, 0, 0),
        // Instruction nécessaire au déroulement de cette partie.
        scene
    // Fermeture du bloc ou de l'appel.
    );
    // On centre la caméra globale sur le joueur
    // Mise à jour de lockedTarget.
    tpsCamera.lockedTarget = cameraTargetNode;
    // Appel de clear pour appliquer l'action prévue.
    tpsCamera.inputs.clear();

    // 1.b Caméra "troisième personne" — vue top-down stricte
    // Création de thirdPersonCamera.
    const thirdPersonCamera = new BABYLON.ArcRotateCamera(
        // Paramètre de l'appel ou valeur de configuration.
        "thirdPersonCamera",
        // Paramètre de l'appel ou valeur de configuration.
        Math.PI,
        // Instruction nécessaire au déroulement de cette partie.
        0.01,  // vue du dessus quasi verticale
        // Paramètre de l'appel ou valeur de configuration.
        60,
        // Appel de Vector3 pour appliquer l'action prévue.
        new BABYLON.Vector3(0, 0, 0),
        // Instruction nécessaire au déroulement de cette partie.
        scene
    // Fermeture du bloc ou de l'appel.
    );
    // Mise à jour de lockedTarget.
    thirdPersonCamera.lockedTarget = cameraTargetNode;
    // Appel de clear pour appliquer l'action prévue.
    thirdPersonCamera.inputs.clear();

    // ─── Clamp du cameraTargetNode pour éviter que la caméra entre dans les tribunes ───
    // Le pitch fait 100 × 60 (X: ±50, Z: ±30). Les tribunes commencent à innerX=55, innerZ=35.
    // Avec radius=70 et beta=0.9, la caméra se place à ~55u du target en X.
    // Si le target va à X=48, la caméra arrive à X=-7 → visible mais pas dans les tribunes.
    // Si le target va à Z=27, la caméra pointe vers la tribune sud → on clamp Z à ±20.
    // Valeur mémorisée dans CAM_MAX_X.
    const CAM_MAX_X = 25;  // La cam reste proche du centre même si le joueur va jusqu'à X=50
    // Valeur mémorisée dans CAM_MAX_Z.
    const CAM_MAX_Z = 15;  // idem en Z
    // Valeur mémorisée dans SKY_MAX_X.
    const SKY_MAX_X = 48;  // SkyCam peut suivre plus loin en attaque
    // Valeur mémorisée dans SKY_MAX_Z.
    const SKY_MAX_Z = 28;  // idem en Z pour voir le fond du terrain
    // Appel de add pour appliquer l'action prévue.
    scene.onAfterRenderObservable.add(() => {
        // Valeur mémorisée dans p.
        const p = cameraTargetNode.position;
        // Valeur mémorisée dans useSkyBounds.
        const useSkyBounds = scene.activeCamera === thirdPersonCamera;
        // Valeur mémorisée dans maxX.
        const maxX = useSkyBounds ? SKY_MAX_X : CAM_MAX_X;
        // Valeur mémorisée dans maxZ.
        const maxZ = useSkyBounds ? SKY_MAX_Z : CAM_MAX_Z;
        // Vérification avant d'exécuter la suite.
        if (p.x >  maxX) p.x =  maxX;
        // Vérification avant d'exécuter la suite.
        if (p.x < -maxX) p.x = -maxX;
        // Vérification avant d'exécuter la suite.
        if (p.z >  maxZ) p.z =  maxZ;
        // Vérification avant d'exécuter la suite.
        if (p.z < -maxZ) p.z = -maxZ;
    // Fermeture du bloc ou de l'appel.
    });

    // 1.b Caméra latérale type retransmission (style FIFA)
    // Calcul de position (alpha=-π/2 = côté sud, beta=0.88, radius=105, target Y=12) :
    //   cam = (0, 12 + 105*cos(0.88), -(105*sin(0.88))) = (0, 79, -81)
    //   ligne de visée coupe Z=-35 à Y≈41 >> hauteur max tribunes (≈26u) → tribunes hors écran
    // Création de broadcastCamera.
    const broadcastCamera = new BABYLON.ArcRotateCamera(
        // Paramètre de l'appel ou valeur de configuration.
        "broadcastCamera",
        // Paramètre de l'appel ou valeur de configuration.
        -Math.PI / 2,
        // Instruction nécessaire au déroulement de cette partie.
        0.88,      // was 1.05 : plus élevé = moins de tribune dans le bas d'écran
        // Instruction nécessaire au déroulement de cette partie.
        105,       // was 90  : plus de recul = plus de terrain visible
        // Appel de Vector3 pour appliquer l'action prévue.
        new BABYLON.Vector3(0, 12, 0),  // was 0 : target légèrement hauté pour viser le milieu de terrain
        // Instruction nécessaire au déroulement de cette partie.
        scene
    // Fermeture du bloc ou de l'appel.
    );
    // Appel de clear pour appliquer l'action prévue.
    broadcastCamera.inputs.clear();
    // Mise à jour de fov.
    broadcastCamera.fov            = 0.65;
    // Mise à jour de inertia.
    broadcastCamera.inertia        = 0.9;
    // Mise à jour de panningInertia.
    broadcastCamera.panningInertia = 0.9;

    // 2. Caméra à la première personne (First Person View)
    // Création de fpvCamera.
    const fpvCamera = new BABYLON.UniversalCamera(
        // Paramètre de l'appel ou valeur de configuration.
        "fpvCamera",
        // Appel de Vector3 pour appliquer l'action prévue.
        new BABYLON.Vector3(0, 4.3, 0), // Au niveau des yeux (baissé de 8 à 4)
        // Instruction nécessaire au déroulement de cette partie.
        scene
    // Fermeture du bloc ou de l'appel.
    );
    
    // On attache la caméra au TransformNode global du joueur
    // Mise à jour de parent.
    fpvCamera.parent = playerNode;
    
    // On lui donne un angle de vue naturel
    // Mise à jour de fov.
    fpvCamera.fov = 1.2;

    // Coupe l'affichage des parties du modèle trop proches de la caméra
    // (évite de voir l'intérieur du maillot / épaules quand le joueur bouge)
    // Mise à jour de minZ.
    fpvCamera.minZ = 1.2;

    // Orientation initiale de la caméra FPV : le joueur regarde devant lui au lancement
    // Mise à jour de y.
    fpvCamera.rotation.y = Math.PI / 2;

    // Désactiver les contrôles par défaut pour éviter les conflits
    // Vérification avant d'exécuter la suite.
    if (fpvCamera.inputs) {
        // Appel de clear pour appliquer l'action prévue.
        fpvCamera.inputs.clear();
    // Fermeture du bloc ou de l'appel.
    }

    // Désactiver les touches directionnelles par defaut de la caméra 
    // (pour que ZQSD/WASD ne gère que les déplacements du joueur définis dans script.js)
    // Mise à jour de keysUp.
    fpvCamera.keysUp = [];
    // Mise à jour de keysDown.
    fpvCamera.keysDown = [];
    // Mise à jour de keysLeft.
    fpvCamera.keysLeft = [];
    // Mise à jour de keysRight.
    fpvCamera.keysRight = [];

    // Optionnellement : gestion de la souris pour la rotation POV (FPS)
    // Sera contrôlée aussi via la manette dans script.js
    // Mise à jour de inertia.
    fpvCamera.inertia = 0.9;
    // Mise à jour de angularSensibility.
    fpvCamera.angularSensibility = 1000;  // Sensibilité souris (plus bas = plus sensible)

    // Ajout : contrôle souris FPS pour la caméra FPV
    // (pointer lock + rotation caméra avec mouvement souris)
    // Valeur mémorisée dans isPointerLocked.
    let isPointerLocked = false;
    // Valeur mémorisée dans lastPointerX.
    let lastPointerX = null, lastPointerY = null;
    // Valeur mémorisée dans mouseSensitivity.
    const mouseSensitivity = 0.0022; // Ajuste la sensibilité ici

    // Fonction onPointerLockChange : elle regroupe le traitement de cette partie.
    function onPointerLockChange() {
        // Instruction nécessaire au déroulement de cette partie.
        isPointerLocked = document.pointerLockElement === canvas;
        // Vérification avant d'exécuter la suite.
        if (!isPointerLocked) {
            // Instruction nécessaire au déroulement de cette partie.
            lastPointerX = null;
            // Instruction nécessaire au déroulement de cette partie.
            lastPointerY = null;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction onMouseMove : elle regroupe le traitement de cette partie.
    function onMouseMove(e) {
        // Vérification avant d'exécuter la suite.
        if (!isPointerLocked || scene.activeCamera !== fpvCamera) return;
        // Utilise movementX/Y pour un vrai FPS
        // Valeur mémorisée dans dx.
        const dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        // Valeur mémorisée dans dy.
        const dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
        // Inverse le sens horizontal pour FPS classique (droite = droite)
        // Instruction nécessaire au déroulement de cette partie.
        fpvCamera.rotation.y += dx * mouseSensitivity;
        // Instruction nécessaire au déroulement de cette partie.
        fpvCamera.rotation.x += dy * mouseSensitivity;
        // Clamp le pitch pour éviter de se retourner
        // Mise à jour de x.
        fpvCamera.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, fpvCamera.rotation.x));
    // Fermeture du bloc ou de l'appel.
    }

    // Clique gauche sur le canvas pour activer le pointer lock
    // Appel de addEventListener pour appliquer l'action prévue.
    canvas.addEventListener("click", function () {
        // Vérification avant d'exécuter la suite.
        if (scene.activeCamera === fpvCamera && document.pointerLockElement !== canvas) {
            // Appel de requestPointerLock pour appliquer l'action prévue.
            canvas.requestPointerLock();
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    });
    // Appel de addEventListener pour appliquer l'action prévue.
    document.addEventListener("pointerlockchange", onPointerLockChange);
    // Appel de addEventListener pour appliquer l'action prévue.
    document.addEventListener("mousemove", onMouseMove);

    // Définir la caméra active par défaut (Broadcast)
    // Mise à jour de activeCamera.
    scene.activeCamera = broadcastCamera;

    // Oriente la caméra FPV selon la direction actuelle du joueur
    // Cette fonction sert au moment où on passe en FPV
    // Fonction alignFpvToDirection : elle regroupe le traitement de cette partie.
    function alignFpvToDirection(direction) {
        // Vérification avant d'exécuter la suite.
        if (!direction || direction.lengthSquared() === 0) return;

        // Calcule l'angle horizontal à partir de la direction X/Z
        // Mise à jour de y.
        fpvCamera.rotation.y = Math.atan2(direction.x, direction.z);
    // Fermeture du bloc ou de l'appel.
    }

    // Objet renvoyé, qu'on déclare ici pour pouvoir exploiter son flag allowManualSwitch
    // Valeur mémorisée dans camerasRef.
    const camerasRef = { 
        // Paramètre de l'appel ou valeur de configuration.
        tpsCamera, 
        // Paramètre de l'appel ou valeur de configuration.
        thirdPersonCamera,
        // Paramètre de l'appel ou valeur de configuration.
        broadcastCamera, 
        // Paramètre de l'appel ou valeur de configuration.
        fpvCamera, 
        // Paramètre de l'appel ou valeur de configuration.
        cameraTargetNode, 
        // Paramètre de l'appel ou valeur de configuration.
        alignFpvToDirection, 
        // Instruction nécessaire au déroulement de cette partie.
        allowManualSwitch: false 
    // Fermeture du bloc ou de l'appel.
    };

    // Résultat renvoyé par la fonction.
    return camerasRef;

// Fermeture du bloc ou de l'appel.
};
