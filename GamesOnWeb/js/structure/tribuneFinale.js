// Classe TribuneFinale : elle sert de modèle pour cet élément du jeu.
class TribuneFinale extends Tribune {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene) {
        // Appel de super pour appliquer l'action prévue.
        super(scene);

        // Finale : grande arène fermée, plus imposante que tous les autres tours
        // Mise à jour de numTiers pour cet objet.
        this.numTiers = 4;        // Plus de niveaux que la demi
        // Mise à jour de rowsPerTier pour cet objet.
        this.rowsPerTier = 14;    // Beaucoup de rangées pour un "mur" de supporters
        // Mise à jour de tierGapHeight pour cet objet.
        this.tierGapHeight = 2.3; 
        // Mise à jour de rowHeight pour cet objet.
        this.rowHeight = 0.65;    // Pente réaliste mais bien haute
        // Mise à jour de hasRoof pour cet objet.
        this.hasRoof = false;     // Pas de toiture par tribune pour ce stade de finale

        // Appel de calculateDimensions pour appliquer l'action prévue.
        this.calculateDimensions();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction create : elle regroupe le traitement de cette partie.
    create() {
        // On garde un stade imposant, mais on laisse un espace entre les tribunes
        // Valeur mémorisée dans lengthFactor.
        const lengthFactor = 0.9; // tribunes un peu plus courtes pour qu'elles ne se touchent pas
        // Valeur mémorisée dans pitchLengthX.
        const pitchLengthX = this.innerX * 2 * lengthFactor;
        // Valeur mémorisée dans pitchLengthZ.
        const pitchLengthZ = this.innerZ * 2 * lengthFactor;

        // --- 1. TRIBUNES PRINCIPALES (tout en or pour la finale) ---
        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("northStandFinal", pitchLengthX, new BABYLON.Vector3(0, 0, this.innerZ), 0, "gold");
        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("southStandFinal", pitchLengthX, new BABYLON.Vector3(0, 0, -this.innerZ), Math.PI, "gold");
        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("eastStandFinal", pitchLengthZ, new BABYLON.Vector3(this.innerX, 0, 0), Math.PI / 2, "gold");
        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("westStandFinal", pitchLengthZ, new BABYLON.Vector3(-this.innerX, 0, 0), -Math.PI / 2, "gold");

        // --- 2. AURÉOLE DORÉE AUTOUR DU STADE (qui bouge) ---
        // Valeur mémorisée dans haloRadius.
        const haloRadius = this.innerX + this.standDepth + 10;
        // Préparation de halo avec Babylon.js.
        const halo = BABYLON.MeshBuilder.CreateTorus("finalHalo", {
            // Paramètre de l'appel ou valeur de configuration.
            diameter: haloRadius * 2,
            // Paramètre de l'appel ou valeur de configuration.
            thickness: 4,
            // Instruction nécessaire au déroulement de cette partie.
            tessellation: 64
        // Instruction nécessaire au déroulement de cette partie.
        }, this.scene);
        // Mise à jour de position.
        halo.position = new BABYLON.Vector3(0, this.roofHeight + 12, 0);
        // Mise à jour de parent.
        halo.parent = this.stadiumRoot;

        // Création de haloMat.
        const haloMat = new BABYLON.StandardMaterial("finalHaloMat", this.scene);
        // Mise à jour de emissiveColor.
        haloMat.emissiveColor = new BABYLON.Color3(1.0, 0.9, 0.4);
        // Mise à jour de diffuseColor.
        haloMat.diffuseColor = new BABYLON.Color3(0.8, 0.7, 0.2);
        // Mise à jour de material.
        halo.material = haloMat;

        // Animation : l'auréole tourne autour du stade et pulse légèrement
        // Valeur mémorisée dans haloAngle.
        let haloAngle = 0;
        // Appel de add pour appliquer l'action prévue.
        this.scene.onBeforeRenderObservable.add(() => {
            // Valeur mémorisée dans dt.
            const dt = this.scene.getEngine().getDeltaTime() / 1000;
            // Instruction nécessaire au déroulement de cette partie.
            haloAngle += dt * 0.5; // vitesse de rotation
            // Mise à jour de y.
            halo.rotation.y = haloAngle;

            // Valeur mémorisée dans pulse.
            const pulse = 0.8 + Math.sin(haloAngle * 2) * 0.2;
            // Mise à jour de emissiveColor.
            haloMat.emissiveColor = new BABYLON.Color3(1.0 * pulse, 0.9 * pulse, 0.5 * pulse);
        // Fermeture du bloc ou de l'appel.
        });

        // --- 3. ANIMATIONS LED SUR LES BANDES PUB ---
        // Vérification avant d'exécuter la suite.
        if (typeof this.startLEDAnimation === "function") {
            // Appel de startLEDAnimation pour appliquer l'action prévue.
            this.startLEDAnimation();
        // Fermeture du bloc ou de l'appel.
        }

        // Résultat renvoyé par la fonction.
        return this.stadiumRoot;
    // Fermeture du bloc ou de l'appel.
    }

    // --- NOUVELLE MÉTHODE : Création d'obélisques/pyramides d'angle ---
    // Fonction createObelisks : elle regroupe le traitement de cette partie.
    createObelisks(innerX, innerZ) {
        // Valeur mémorisée dans offsetDistX.
        const offsetDistX = innerX * 1.5;
        // Valeur mémorisée dans offsetDistZ.
        const offsetDistZ = innerZ * 1.5;
        // Valeur mémorisée dans obeliskHeight.
        const obeliskHeight = 40;

        // Création de obeliskMat.
        const obeliskMat = new BABYLON.StandardMaterial("obeliskMat", this.scene);
        // Mise à jour de diffuseColor.
        obeliskMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Roche sombre
        // Mise à jour de emissiveColor.
        obeliskMat.emissiveColor = new BABYLON.Color3(0.3, 0.2, 0.0); // Léger reflet doré

        // Valeur mémorisée dans positions.
        const positions = [
            // Appel de Vector3 pour appliquer l'action prévue.
            new BABYLON.Vector3(offsetDistX, obeliskHeight / 2, offsetDistZ),
            // Appel de Vector3 pour appliquer l'action prévue.
            new BABYLON.Vector3(-offsetDistX, obeliskHeight / 2, offsetDistZ),
            // Appel de Vector3 pour appliquer l'action prévue.
            new BABYLON.Vector3(offsetDistX, obeliskHeight / 2, -offsetDistZ),
            // Appel de Vector3 pour appliquer l'action prévue.
            new BABYLON.Vector3(-offsetDistX, obeliskHeight / 2, -offsetDistZ)
        // Fermeture du bloc ou de l'appel.
        ];

        // Appel de forEach pour appliquer l'action prévue.
        positions.forEach((pos, index) => {
            // Un obélisque est juste une pyramide très étirée
            // Préparation de obelisk avec Babylon.js.
            const obelisk = BABYLON.MeshBuilder.CreateCylinder(`obelisk_${index}`, {
                // Paramètre de l'appel ou valeur de configuration.
                height: obeliskHeight,
                // Instruction nécessaire au déroulement de cette partie.
                diameterTop: 0.5, // Petite pointe coupée
                // Instruction nécessaire au déroulement de cette partie.
                diameterBottom: 10, // Base solide
                // Instruction nécessaire au déroulement de cette partie.
                tessellation: 4
            // Instruction nécessaire au déroulement de cette partie.
            }, this.scene);
            
            // Mise à jour de position.
            obelisk.position = pos;
            // Mise à jour de y.
            obelisk.rotation.y = Math.PI / 4; // On oriente les faces vers le centre du terrain
            // Mise à jour de material.
            obelisk.material = obeliskMat;
            // Mise à jour de parent.
            obelisk.parent = this.stadiumRoot;
        // Fermeture du bloc ou de l'appel.
        });
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}