// Goals (Cages)
// Fonction createGoal : elle regroupe le traitement de cette partie.
const createGoal = (scene, position, rotationY) => {
    // Goal Dimensions
    // Valeur mémorisée dans goalWidth.
    const goalWidth = 14.64; // Doublé par rapport à l'original (7.32)
    // Valeur mémorisée dans goalHeight.
    const goalHeight = 4.88; // Doublé par rapport à l'original (2.44)
    // Valeur mémorisée dans goalDepth.
    const goalDepth = 4;     // Doublé (2)
    // Valeur mémorisée dans postThickness.
    const postThickness = 0.4; // Doublé (0.2)

    // Goal Materials
    // Création de goalPostMaterial.
    const goalPostMaterial = new BABYLON.StandardMaterial("goalPostMat", scene);
    // Mise à jour de diffuseColor.
    goalPostMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // White posts

    // Création de netMaterial.
    const netMaterial = new BABYLON.StandardMaterial("netMat", scene);
    // Mise à jour de diffuseColor.
    netMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // Bright white
    // Mise à jour de alpha.
    netMaterial.alpha = 0.7; // More visible
    // Mise à jour de wireframe.
    netMaterial.wireframe = true; 
    // Mise à jour de backFaceCulling.
    netMaterial.backFaceCulling = false; // Seen from both sides

    // Création de goalGroup.
    const goalGroup = new BABYLON.TransformNode("goalGroup", scene);
    // Mise à jour de position.
    goalGroup.position = position;
    // Mise à jour de y.
    goalGroup.rotation.y = rotationY;

    // Posts (Left and Right)
    // Préparation de leftPost avec Babylon.js.
    const leftPost = BABYLON.MeshBuilder.CreateCylinder("leftPost", { height: goalHeight, diameter: postThickness }, scene);
    // Mise à jour de position.
    leftPost.position = new BABYLON.Vector3(-goalWidth / 2, goalHeight / 2, 0);
    // Mise à jour de material.
    leftPost.material = goalPostMaterial;
    // Mise à jour de parent.
    leftPost.parent = goalGroup;

    // Préparation de rightPost avec Babylon.js.
    const rightPost = BABYLON.MeshBuilder.CreateCylinder("rightPost", { height: goalHeight, diameter: postThickness }, scene);
    // Mise à jour de position.
    rightPost.position = new BABYLON.Vector3(goalWidth / 2, goalHeight / 2, 0);
    // Mise à jour de material.
    rightPost.material = goalPostMaterial;
    // Mise à jour de parent.
    rightPost.parent = goalGroup;

    // Crossbar
    // Préparation de crossbar avec Babylon.js.
    const crossbar = BABYLON.MeshBuilder.CreateCylinder("crossbar", { height: goalWidth + postThickness, diameter: postThickness }, scene);
    // Mise à jour de z.
    crossbar.rotation.z = Math.PI / 2;
    // Mise à jour de position.
    crossbar.position = new BABYLON.Vector3(0, goalHeight, 0);
    // Mise à jour de material.
    crossbar.material = goalPostMaterial;
    // Mise à jour de parent.
    crossbar.parent = goalGroup;

    // Back Supports
    // Préparation de leftBackLow avec Babylon.js.
    const leftBackLow = BABYLON.MeshBuilder.CreateCylinder("leftBackLow", { height: goalDepth, diameter: postThickness / 2 }, scene);
    // Mise à jour de x.
    leftBackLow.rotation.x = Math.PI / 2;
    // Mise à jour de position.
    leftBackLow.position = new BABYLON.Vector3(-goalWidth / 2, 0, -goalDepth / 2);
    // Mise à jour de parent.
    leftBackLow.parent = goalGroup;

    // Préparation de rightBackLow avec Babylon.js.
    const rightBackLow = BABYLON.MeshBuilder.CreateCylinder("rightBackLow", { height: goalDepth, diameter: postThickness / 2 }, scene);
    // Mise à jour de x.
    rightBackLow.rotation.x = Math.PI / 2;
    // Mise à jour de position.
    rightBackLow.position = new BABYLON.Vector3(goalWidth / 2, 0, -goalDepth / 2);
    // Mise à jour de parent.
    rightBackLow.parent = goalGroup;

        // Préparation de leftBackUp avec Babylon.js.
        const leftBackUp = BABYLON.MeshBuilder.CreateCylinder("leftBackUp", { height: Math.sqrt(goalDepth*goalDepth + goalHeight*goalHeight), diameter: postThickness / 2 }, scene);
        // Mise à jour de x.
        leftBackUp.rotation.x = Math.atan(goalDepth/goalHeight);
        // Mise à jour de position.
        leftBackUp.position = new BABYLON.Vector3(-goalWidth / 2, goalHeight/2, -goalDepth / 2);
        // Mise à jour de parent.
        leftBackUp.parent = goalGroup;

        // Préparation de rightBackUp avec Babylon.js.
        const rightBackUp = BABYLON.MeshBuilder.CreateCylinder("rightBackUp", { height: Math.sqrt(goalDepth*goalDepth + goalHeight*goalHeight), diameter: postThickness / 2 }, scene);
        // Mise à jour de x.
        rightBackUp.rotation.x = Math.atan(goalDepth/goalHeight);
        // Mise à jour de position.
        rightBackUp.position = new BABYLON.Vector3(goalWidth / 2, goalHeight/2, -goalDepth / 2);
        // Mise à jour de parent.
        rightBackUp.parent = goalGroup;

    // Net (Using CreateGround for subdivisions to create a grid/net look in wireframe)
    // Back Net
    // Préparation de netBack avec Babylon.js.
    const netBack = BABYLON.MeshBuilder.CreateGround("netBack", { width: goalWidth, height: goalHeight, subdivisions: 15 }, scene);
    // Mise à jour de x.
    netBack.rotation.x = -Math.PI / 2;
    // Mise à jour de position.
    netBack.position = new BABYLON.Vector3(0, goalHeight / 2, -goalDepth);
    // Mise à jour de material.
    netBack.material = netMaterial;
    // Mise à jour de parent.
    netBack.parent = goalGroup;

    // Left Net
    // Préparation de netLeft avec Babylon.js.
    const netLeft = BABYLON.MeshBuilder.CreateGround("netLeft", { width: goalDepth, height: goalHeight, subdivisions: 10 }, scene);
    // Mise à jour de x.
    netLeft.rotation.x = -Math.PI / 2;
    // Mise à jour de y.
    netLeft.rotation.y = -Math.PI / 2;
    // Mise à jour de position.
    netLeft.position = new BABYLON.Vector3(-goalWidth / 2, goalHeight / 2, -goalDepth / 2);
    // Mise à jour de material.
    netLeft.material = netMaterial;
    // Mise à jour de parent.
    netLeft.parent = goalGroup;
    
    // Right Net
    // Préparation de netRight avec Babylon.js.
    const netRight = BABYLON.MeshBuilder.CreateGround("netRight", { width: goalDepth, height: goalHeight, subdivisions: 10 }, scene);
    // Mise à jour de x.
    netRight.rotation.x = -Math.PI / 2;
    // Mise à jour de y.
    netRight.rotation.y = Math.PI / 2;
    // Mise à jour de position.
    netRight.position = new BABYLON.Vector3(goalWidth / 2, goalHeight / 2, -goalDepth / 2);
    // Mise à jour de material.
    netRight.material = netMaterial;
    // Mise à jour de parent.
    netRight.parent = goalGroup;
    
    // Top Net
    // Préparation de netTop avec Babylon.js.
    const netTop = BABYLON.MeshBuilder.CreateGround("netTop", { width: goalWidth, height: goalDepth, subdivisions: 15 }, scene);
    // Mise à jour de position.
    netTop.position = new BABYLON.Vector3(0, goalHeight, -goalDepth/2);
    // Mise à jour de material.
    netTop.material = netMaterial;
    // Mise à jour de parent.
    netTop.parent = goalGroup;

    // Invisible Goal Trigger Box (to detect when the ball is inside)
    // We make it slightly smaller than the goal to ensure the ball is fully in
    // Préparation de triggerBox avec Babylon.js.
    const triggerBox = BABYLON.MeshBuilder.CreateBox("goalTrigger", { width: goalWidth - 1, height: goalHeight - 0.5, depth: goalDepth - 1 }, scene);
    // Mise à jour de position.
    triggerBox.position = new BABYLON.Vector3(0, goalHeight / 2, -goalDepth / 2);
    // Mise à jour de isVisible.
    triggerBox.isVisible = false;
    // Mise à jour de parent.
    triggerBox.parent = goalGroup;
    
    // Attach the trigger box to the returned group so we can access it later
    // Mise à jour de triggerBox.
    goalGroup.triggerBox = triggerBox;

    // Expose key parts of the goal (useful for collisions / rebonds)
    // Mise à jour de leftPost.
    goalGroup.leftPost = leftPost;
    // Mise à jour de rightPost.
    goalGroup.rightPost = rightPost;
    // Mise à jour de crossbar.
    goalGroup.crossbar = crossbar;

    // Résultat renvoyé par la fonction.
    return goalGroup;
// Fermeture du bloc ou de l'appel.
};
