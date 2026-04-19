// Field and Markings
// Fonction createField : elle regroupe le traitement de cette partie.
const createField = (scene) => {
    // Pitch (Ground)
    // Préparation de ground avec Babylon.js.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 60 }, scene);
    // Création de groundMaterial.
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    // Mise à jour de diffuseColor.
    groundMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // Green
    // Mise à jour de material.
    ground.material = groundMaterial;

    // Field Markings Material
    // Création de markingsMaterial.
    const markingsMaterial = new BABYLON.StandardMaterial("markingsMat", scene);
    // Mise à jour de diffuseColor.
    markingsMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    // Mise à jour de emissiveColor.
    markingsMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Make it bright white

    // Helper to create a line (thin plane)
    // Fonction createLine : elle regroupe le traitement de cette partie.
    const createLine = (name, boxOptions, position) => {
        // Préparation de line avec Babylon.js.
        const line = BABYLON.MeshBuilder.CreateBox(name, boxOptions, scene);
        // Mise à jour de position.
        line.position = position;
        // Mise à jour de material.
        line.material = markingsMaterial;
        // Résultat renvoyé par la fonction.
        return line;
    // Fermeture du bloc ou de l'appel.
    };

    // Border Lines
    // Appel de createLine pour appliquer l'action prévue.
    createLine("lineTop", { width: 100, height: 0.02, depth: 0.5 }, new BABYLON.Vector3(0, 0.01, 30));
    // Appel de createLine pour appliquer l'action prévue.
    createLine("lineBottom", { width: 100, height: 0.02, depth: 0.5 }, new BABYLON.Vector3(0, 0.01, -30));
    // Appel de createLine pour appliquer l'action prévue.
    createLine("lineLeft", { width: 0.5, height: 0.02, depth: 60 }, new BABYLON.Vector3(-50, 0.01, 0));
    // Appel de createLine pour appliquer l'action prévue.
    createLine("lineRight", { width: 0.5, height: 0.02, depth: 60 }, new BABYLON.Vector3(50, 0.01, 0));

    // Center Line
    // Appel de createLine pour appliquer l'action prévue.
    createLine("centerLine", { width: 0.5, height: 0.02, depth: 60 }, new BABYLON.Vector3(0, 0.01, 0));

    // Center Circle (Torus)
    // Préparation de centerCircle avec Babylon.js.
    const centerCircle = BABYLON.MeshBuilder.CreateTorus("centerCircle", { diameter: 20, thickness: 0.5, tessellation: 64 }, scene);
    // Mise à jour de y.
    centerCircle.position.y = 0.01; // Slightly above ground
    // Mise à jour de material.
    centerCircle.material = markingsMaterial;

    // Penalty Areas
    // Valeur mémorisée dans penaltyWidth.
    const penaltyWidth = 16.5; // Depth into field
    // Valeur mémorisée dans penaltyHeight.
    const penaltyHeight = 40.32; // Width along goal line
    
    // Left Penalty Area
    // Appel de createLine pour appliquer l'action prévue.
    createLine("penaltyLeftTop", { width: penaltyWidth, height: 0.02, depth: 0.5 }, new BABYLON.Vector3(-50 + penaltyWidth / 2, 0.01, penaltyHeight / 2));
    // Appel de createLine pour appliquer l'action prévue.
    createLine("penaltyLeftBottom", { width: penaltyWidth, height: 0.02, depth: 0.5 }, new BABYLON.Vector3(-50 + penaltyWidth / 2, 0.01, -penaltyHeight / 2));
    // Appel de createLine pour appliquer l'action prévue.
    createLine("penaltyLeftSide", { width: 0.5, height: 0.02, depth: penaltyHeight }, new BABYLON.Vector3(-50 + penaltyWidth, 0.01, 0));

    // Right Penalty Area
    // Appel de createLine pour appliquer l'action prévue.
    createLine("penaltyRightTop", { width: penaltyWidth, height: 0.02, depth: 0.5 }, new BABYLON.Vector3(50 - penaltyWidth / 2, 0.01, penaltyHeight / 2));
    // Appel de createLine pour appliquer l'action prévue.
    createLine("penaltyRightBottom", { width: penaltyWidth, height: 0.02, depth: 0.5 }, new BABYLON.Vector3(50 - penaltyWidth / 2, 0.01, -penaltyHeight / 2));
    // Appel de createLine pour appliquer l'action prévue.
    createLine("penaltyRightSide", { width: 0.5, height: 0.02, depth: penaltyHeight }, new BABYLON.Vector3(50 - penaltyWidth, 0.01, 0));

    // Résultat renvoyé par la fonction.
    return ground;
// Fermeture du bloc ou de l'appel.
};
