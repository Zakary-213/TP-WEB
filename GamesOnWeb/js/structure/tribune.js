// Classe Tribune : elle sert de modèle pour cet élément du jeu.
class Tribune {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene) {
        // Mise à jour de scene pour cet objet.
        this.scene = scene;
        // Mise à jour de stadiumRoot pour cet objet.
        this.stadiumRoot = new BABYLON.TransformNode("stadiumRoot", scene);

        // Paramètres par défaut de la structure de base
        // Mise à jour de pitchWidth pour cet objet.
        this.pitchWidth = 100;
        // Mise à jour de pitchHeight pour cet objet.
        this.pitchHeight = 60;
        // Mise à jour de margin pour cet objet.
        this.margin = 5;
        
        // Mise à jour de rowsPerTier pour cet objet.
        this.rowsPerTier = 12;
        // Mise à jour de numTiers pour cet objet.
        this.numTiers = 3;
        // Mise à jour de rowHeight pour cet objet.
        this.rowHeight = 0.6;
        // Mise à jour de rowDepth pour cet objet.
        this.rowDepth = 1.0;
        // Mise à jour de tierGapHeight pour cet objet.
        this.tierGapHeight = 2.5;
        // Mise à jour de tierGapDepth pour cet objet.
        this.tierGapDepth = 2.0;

        // Appel de initMaterials pour appliquer l'action prévue.
        this.initMaterials();
        // Appel de calculateDimensions pour appliquer l'action prévue.
        this.calculateDimensions();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction calculateDimensions : elle regroupe le traitement de cette partie.
    calculateDimensions() {
        // Mise à jour de innerX pour cet objet.
        this.innerX = this.pitchWidth / 2 + this.margin;
        // Mise à jour de innerZ pour cet objet.
        this.innerZ = this.pitchHeight / 2 + this.margin;
        // Mise à jour de standDepth pour cet objet.
        this.standDepth = this.numTiers * (this.rowsPerTier * this.rowDepth) + (this.numTiers - 1) * this.tierGapDepth;

        // Mise à jour de maxY pour cet objet.
        this.maxY = (this.numTiers - 1) * (this.rowsPerTier * this.rowHeight + this.tierGapHeight) + (this.rowsPerTier - 1) * this.rowHeight;
        // Mise à jour de roofHeight pour cet objet.
        this.roofHeight = this.maxY + 10;
        // Mise à jour de towerHeight pour cet objet.
        this.towerHeight = this.roofHeight + 5;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction initMaterials : elle regroupe le traitement de cette partie.
    initMaterials() {
        // Mise à jour de blueSeatMaterial pour cet objet.
        this.blueSeatMaterial = new BABYLON.PBRMaterial("blueSeatMat", this.scene);
        // Mise à jour de albedoColor.
        this.blueSeatMaterial.albedoColor = new BABYLON.Color3(0.05, 0.2, 0.8);
        // Mise à jour de roughness.
        this.blueSeatMaterial.roughness = 0.7;

        // Mise à jour de redSeatMaterial pour cet objet.
        this.redSeatMaterial = new BABYLON.PBRMaterial("redSeatMat", this.scene);
        // Mise à jour de albedoColor.
        this.redSeatMaterial.albedoColor = new BABYLON.Color3(0.8, 0.1, 0.1);
        // Mise à jour de roughness.
        this.redSeatMaterial.roughness = 0.7;

        // Mise à jour de whiteSeatMaterial pour cet objet.
        this.whiteSeatMaterial = new BABYLON.PBRMaterial("whiteSeatMat", this.scene);
        // Mise à jour de albedoColor.
        this.whiteSeatMaterial.albedoColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        // Mise à jour de roughness.
        this.whiteSeatMaterial.roughness = 0.7;

        // Mise à jour de goldSeatMaterial pour cet objet.
        this.goldSeatMaterial = new BABYLON.PBRMaterial("goldSeatMat", this.scene);
        // Mise à jour de albedoColor.
        this.goldSeatMaterial.albedoColor = new BABYLON.Color3(1.0, 0.84, 0.0);
        // Mise à jour de metallic.
        this.goldSeatMaterial.metallic = 0.8;
        // Mise à jour de roughness.
        this.goldSeatMaterial.roughness = 0.3;

        // Mise à jour de concreteMaterial pour cet objet.
        this.concreteMaterial = new BABYLON.PBRMaterial("concreteMat", this.scene);
        // Mise à jour de albedoColor.
        this.concreteMaterial.albedoColor = new BABYLON.Color3(0.65, 0.65, 0.65);
        // Mise à jour de roughness.
        this.concreteMaterial.roughness = 0.9;

        // Mise à jour de roofMaterial pour cet objet.
        this.roofMaterial = new BABYLON.PBRMaterial("roofMat", this.scene);
        // Mise à jour de albedoColor.
        this.roofMaterial.albedoColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        // Mise à jour de alpha.
        this.roofMaterial.alpha = 0.6;

        // Mise à jour de trussMaterial pour cet objet.
        this.trussMaterial = new BABYLON.PBRMaterial("trussMat", this.scene);
        // Mise à jour de albedoColor.
        this.trussMaterial.albedoColor = new BABYLON.Color3(0.8, 0.05, 0.05); 
        // Mise à jour de metallic.
        this.trussMaterial.metallic = 0.5;
        // Mise à jour de roughness.
        this.trussMaterial.roughness = 0.4;

        // Mise à jour de adMaterial pour cet objet.
        this.adMaterial = new BABYLON.PBRMaterial("adMat", this.scene);
        // Mise à jour de albedoColor.
        this.adMaterial.albedoColor = new BABYLON.Color3(0.05, 0.05, 0.05); 
        // Mise à jour de emissiveColor.
        this.adMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);  
        // Mise à jour de emissiveIntensity.
        this.adMaterial.emissiveIntensity = 1.2;

        // Par défaut, toutes les tribunes ont un toit
        // Mise à jour de hasRoof pour cet objet.
        this.hasRoof = true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction createSideStand : elle regroupe le traitement de cette partie.
    createSideStand(name, length, position, rotationY, teamColor) {
        // Création de standGroup.
        const standGroup = new BABYLON.TransformNode(name, this.scene);
        // Mise à jour de parent.
        standGroup.parent = this.stadiumRoot;
        // Mise à jour de position.
        standGroup.position = position;
        // Mise à jour de y.
        standGroup.rotation.y = rotationY;

        // Valeur mémorisée dans aisleWidth.
        const aisleWidth = 1.5;
        // Valeur mémorisée dans numSections.
        const numSections = 5;
        // Valeur mémorisée dans sectionLength.
        const sectionLength = (length - (numSections - 1) * aisleWidth) / numSections;

        // Parcours de plusieurs valeurs.
        for (let t = 0; t < this.numTiers; t++) {
            // Valeur mémorisée dans tierBaseY.
            const tierBaseY = t * (this.rowsPerTier * this.rowHeight + this.tierGapHeight);
            // Valeur mémorisée dans tierBaseZ.
            const tierBaseZ = t * (this.rowsPerTier * this.rowDepth + this.tierGapDepth);

            // Mur de soutènement
            // Vérification avant d'exécuter la suite.
            if (t > 0) {
                // Préparation de wall avec Babylon.js.
                const wall = BABYLON.MeshBuilder.CreateBox(name + "_wall_" + t, {
                    // Instruction nécessaire au déroulement de cette partie.
                    width: length, height: this.tierGapHeight + 1, depth: 0.5
                // Instruction nécessaire au déroulement de cette partie.
                }, this.scene);
                // Mise à jour de position.
                wall.position = new BABYLON.Vector3(0, tierBaseY - this.tierGapHeight / 2 + 0.5, tierBaseZ - 0.25);
                // Mise à jour de material.
                wall.material = this.concreteMaterial;
                // Mise à jour de parent.
                wall.parent = standGroup;
            // Fermeture du bloc ou de l'appel.
            }

            // Parcours de plusieurs valeurs.
            for (let r = 0; r < this.rowsPerTier; r++) {
                // Valeur mémorisée dans seatMat.
                let seatMat;
                // Vérification avant d'exécuter la suite.
                if (teamColor === "blue") {
                    // Instruction nécessaire au déroulement de cette partie.
                    seatMat = this.blueSeatMaterial;
                // Deuxième possibilité à tester.
                } else if (teamColor === "red") {
                    // Instruction nécessaire au déroulement de cette partie.
                    seatMat = this.redSeatMaterial;
                // Deuxième possibilité à tester.
                } else if (teamColor === "white") {
                    // Instruction nécessaire au déroulement de cette partie.
                    seatMat = this.whiteSeatMaterial;
                // Deuxième possibilité à tester.
                } else if (teamColor === "gold") {
                    // Instruction nécessaire au déroulement de cette partie.
                    seatMat = this.goldSeatMaterial;
                // Cas utilisé quand les tests précédents échouent.
                } else {
                    // Instruction nécessaire au déroulement de cette partie.
                    seatMat = this.concreteMaterial;
                // Fermeture du bloc ou de l'appel.
                }
                // Valeur mémorisée dans y.
                const y = tierBaseY + r * this.rowHeight + this.rowHeight / 2;
                // Valeur mémorisée dans z.
                const z = tierBaseZ + r * this.rowDepth + this.rowDepth / 2;

                // Parcours de plusieurs valeurs.
                for (let s = 0; s < numSections; s++) {
                    // Préparation de box avec Babylon.js.
                    const box = BABYLON.MeshBuilder.CreateBox(`${name}_t${t}_r${r}_s${s}`, {
                        // Instruction nécessaire au déroulement de cette partie.
                        width: sectionLength, height: this.rowHeight, depth: this.rowDepth
                    // Instruction nécessaire au déroulement de cette partie.
                    }, this.scene);
                    // Valeur mémorisée dans xCenter.
                    const xCenter = -length / 2 + sectionLength / 2 + s * (sectionLength + aisleWidth);
                    // Mise à jour de position.
                    box.position = new BABYLON.Vector3(xCenter, y, z);
                    // Mise à jour de material.
                    box.material = seatMat;
                    // Mise à jour de parent.
                    box.parent = standGroup;
                // Fermeture du bloc ou de l'appel.
                }

                // Vérification avant d'exécuter la suite.
                if (r < this.rowsPerTier - 1) { // Escaliers
                    // Parcours de plusieurs valeurs.
                    for (let a = 0; a < numSections - 1; a++) {
                        // Préparation de stair avec Babylon.js.
                        const stair = BABYLON.MeshBuilder.CreateBox(`${name}_t${t}_r${r}_stair${a}`, {
                            // Instruction nécessaire au déroulement de cette partie.
                            width: aisleWidth, height: this.rowHeight * 0.7, depth: this.rowDepth
                        // Instruction nécessaire au déroulement de cette partie.
                        }, this.scene);
                        // Valeur mémorisée dans xOffset.
                        const xOffset = -length / 2 + sectionLength + aisleWidth / 2 + a * (sectionLength + aisleWidth);
                        // Mise à jour de position.
                        stair.position = new BABYLON.Vector3(xOffset, y - this.rowHeight * 0.15, z);
                        // Mise à jour de material.
                        stair.material = this.concreteMaterial;
                        // Mise à jour de parent.
                        stair.parent = standGroup;
                    // Fermeture du bloc ou de l'appel.
                    }
                // Fermeture du bloc ou de l'appel.
                }
            // Fermeture du bloc ou de l'appel.
            }
        // Fermeture du bloc ou de l'appel.
        }

        // Bande publicitaire
        // Préparation de adBoard avec Babylon.js.
        const adBoard = BABYLON.MeshBuilder.CreateBox(name + "_adBoard", {
            // Instruction nécessaire au déroulement de cette partie.
            width: length, height: 1.2, depth: 0.3
        // Instruction nécessaire au déroulement de cette partie.
        }, this.scene);
        // Mise à jour de position.
        adBoard.position = new BABYLON.Vector3(0, 0.6, -0.5); 
        // Mise à jour de material.
        adBoard.material = this.adMaterial;
        // Mise à jour de parent.
        adBoard.parent = standGroup;

        // Le toit (optionnel, peut être désactivé par les sous-classes)
        // Vérification avant d'exécuter la suite.
        if (this.hasRoof) {
            // Préparation de roof avec Babylon.js.
            const roof = BABYLON.MeshBuilder.CreatePlane(name + "_roof", { width: length, height: this.standDepth + 10 }, this.scene);
            // Mise à jour de material.
            roof.material = this.roofMaterial;
            // Mise à jour de x.
            roof.rotation.x = Math.PI / 2 - 0.1; // Légère inclinaison
            // Mise à jour de position.
            roof.position = new BABYLON.Vector3(0, this.roofHeight, this.standDepth / 2 - 5);
            // Mise à jour de parent.
            roof.parent = standGroup;
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return standGroup;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction createCornerTower : elle regroupe le traitement de cette partie.
    createCornerTower(name, x, z) {
        // Valeur mémorisée dans radius.
        const radius = 22; 
        // Préparation de tower avec Babylon.js.
        const tower = BABYLON.MeshBuilder.CreateCylinder(name, {
            // Paramètre de l'appel ou valeur de configuration.
            height: this.towerHeight,
            // Instruction nécessaire au déroulement de cette partie.
            diameter: radius * 2
        // Instruction nécessaire au déroulement de cette partie.
        }, this.scene);
        // Mise à jour de position.
        tower.position = new BABYLON.Vector3(x, this.towerHeight / 2, z);
        // Mise à jour de material.
        tower.material = this.concreteMaterial;
        // Mise à jour de parent.
        tower.parent = this.stadiumRoot;

        // Parcours de plusieurs valeurs.
        for (let i = 2; i < this.towerHeight - 5; i += 4) {
            // Préparation de ramp avec Babylon.js.
            const ramp = BABYLON.MeshBuilder.CreateTorus(name + "_ramp_" + i, {
                // Paramètre de l'appel ou valeur de configuration.
                diameter: (radius * 2) + 1.5,
                // Paramètre de l'appel ou valeur de configuration.
                thickness: 1.5,
                // Instruction nécessaire au déroulement de cette partie.
                tessellation: 32
            // Instruction nécessaire au déroulement de cette partie.
            }, this.scene);
            // Mise à jour de position.
            ramp.position = new BABYLON.Vector3(x, i, z);
            // Mise à jour de material.
            ramp.material = this.concreteMaterial;
            // Mise à jour de parent.
            ramp.parent = this.stadiumRoot;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction startLEDAnimation : elle regroupe le traitement de cette partie.
    startLEDAnimation() {
        // Valeur mémorisée dans time.
        let time = 0;
        // Appel de add pour appliquer l'action prévue.
        this.scene.onBeforeRenderObservable.add(() => {
            // Instruction nécessaire au déroulement de cette partie.
            time += 0.04;
            // Mise à jour de emissiveIntensity.
            this.adMaterial.emissiveIntensity = 1.1 + Math.sin(time) * 0.15;
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction create : elle regroupe le traitement de cette partie.
    create() {
        // Appel de warn pour appliquer l'action prévue.
        console.warn("La méthode create() doit être implémentée par les classes enfants.");
        // Résultat renvoyé par la fonction.
        return this.stadiumRoot;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}
