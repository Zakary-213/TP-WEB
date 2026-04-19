// Classe TribuneDemi : elle sert de modèle pour cet élément du jeu.
class TribuneDemi extends Tribune {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene) {
        // Appel de super pour appliquer l'action prévue.
        super(scene);
        // Vous pouvez par exemple changer le nombre d'étages ou la taille pour la demi-finale si vous le souhaitez:
        // this.numTiers = 2; // Demi finale plus petite par exemple
        // this.calculateDimensions(); // recalculer les dimensions si on change un paramètre
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction create : elle regroupe le traitement de cette partie.
    create() {
        // --- ASSEMBLAGE PARFAIT (Zéro dépassement) ---
        // Les tribunes font exactement la taille du terrain pour former une croix parfaite.
        // Valeur mémorisée dans pitchLengthX.
        const pitchLengthX = this.innerX * 2; // 110
        // Valeur mémorisée dans pitchLengthZ.
        const pitchLengthZ = this.innerZ * 2; // 70

        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("northStand", pitchLengthX, new BABYLON.Vector3(0, 0, this.innerZ), 0, "blue");
        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("southStand", pitchLengthX, new BABYLON.Vector3(0, 0, -this.innerZ), Math.PI, "red");
        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("eastStand", pitchLengthZ, new BABYLON.Vector3(this.innerX, 0, 0), Math.PI / 2, "blue");
        // Appel de createSideStand pour appliquer l'action prévue.
        this.createSideStand("westStand", pitchLengthZ, new BABYLON.Vector3(-this.innerX, 0, 0), -Math.PI / 2, "red");

        // Création des 4 tours dans les 4 angles "vides"
        // Valeur mémorisée dans towerX.
        const towerX = this.innerX + this.standDepth / 2; // 55 + 20 = 75
        // Valeur mémorisée dans towerZ.
        const towerZ = this.innerZ + this.standDepth / 2; // 35 + 20 = 55
        // Appel de createCornerTower pour appliquer l'action prévue.
        this.createCornerTower("towerNE", towerX, towerZ);
        // Appel de createCornerTower pour appliquer l'action prévue.
        this.createCornerTower("towerNW", -towerX, towerZ);
        // Appel de createCornerTower pour appliquer l'action prévue.
        this.createCornerTower("towerSE", towerX, -towerZ);
        // Appel de createCornerTower pour appliquer l'action prévue.
        this.createCornerTower("towerSW", -towerX, -towerZ);

        // --- STRUCTURE ROUGE DU TOIT (La touche finale San Siro) ---
        // Valeur mémorisée dans trussThickness.
        const trussThickness = 4;
        
        // Poutres au-dessus des tribunes Nord/Sud
        // Préparation de trussNS1 avec Babylon.js.
        const trussNS1 = BABYLON.MeshBuilder.CreateBox("trussNS1", { width: towerX * 2.2, height: trussThickness, depth: trussThickness }, this.scene);
        // Mise à jour de position.
        trussNS1.position = new BABYLON.Vector3(0, this.towerHeight + 2, towerZ);
        // Mise à jour de material.
        trussNS1.material = this.trussMaterial;
        // Mise à jour de parent.
        trussNS1.parent = this.stadiumRoot;

        // Préparation de trussNS2 avec Babylon.js.
        const trussNS2 = BABYLON.MeshBuilder.CreateBox("trussNS2", { width: towerX * 2.2, height: trussThickness, depth: trussThickness }, this.scene);
        // Mise à jour de position.
        trussNS2.position = new BABYLON.Vector3(0, this.towerHeight + 2, -towerZ);
        // Mise à jour de material.
        trussNS2.material = this.trussMaterial;
        // Mise à jour de parent.
        trussNS2.parent = this.stadiumRoot;

        // Poutres au-dessus des tribunes Est/Ouest (plus hautes pour croiser les autres)
        // Préparation de trussEW1 avec Babylon.js.
        const trussEW1 = BABYLON.MeshBuilder.CreateBox("trussEW1", { width: trussThickness, height: trussThickness, depth: towerZ * 2.2 }, this.scene);
        // Mise à jour de position.
        trussEW1.position = new BABYLON.Vector3(towerX, this.towerHeight + trussThickness + 2, 0);
        // Mise à jour de material.
        trussEW1.material = this.trussMaterial;
        // Mise à jour de parent.
        trussEW1.parent = this.stadiumRoot;

        // Préparation de trussEW2 avec Babylon.js.
        const trussEW2 = BABYLON.MeshBuilder.CreateBox("trussEW2", { width: trussThickness, height: trussThickness, depth: towerZ * 2.2 }, this.scene);
        // Mise à jour de position.
        trussEW2.position = new BABYLON.Vector3(-towerX, this.towerHeight + trussThickness + 2, 0);
        // Mise à jour de material.
        trussEW2.material = this.trussMaterial;
        // Mise à jour de parent.
        trussEW2.parent = this.stadiumRoot;

        // Animation LED toujours présente
        // Appel de startLEDAnimation pour appliquer l'action prévue.
        this.startLEDAnimation();

        // Résultat renvoyé par la fonction.
        return this.stadiumRoot;
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}