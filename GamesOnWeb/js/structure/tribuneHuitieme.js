// Classe TribuneHuitieme : elle sert de modèle pour cet élément du jeu.
class TribuneHuitieme extends Tribune {
	// Fonction constructor : elle regroupe le traitement de cette partie.
	constructor(scene) {
		// Appel de super pour appliquer l'action prévue.
		super(scene);
		// Huitième de finale : stade plus modeste
		// Mise à jour de numTiers pour cet objet.
		this.numTiers = 2;      // un étage de moins
		// Mise à jour de rowsPerTier pour cet objet.
		this.rowsPerTier = 8;   // moins de rangées
		// Mise à jour de tierGapHeight pour cet objet.
		this.tierGapHeight = 2; // niveaux plus rapprochés
		// Mise à jour de hasRoof pour cet objet.
		this.hasRoof = false;   // pas de toit pour les huitièmes

		// Appel de calculateDimensions pour appliquer l'action prévue.
		this.calculateDimensions();
	// Fermeture du bloc ou de l'appel.
	}

	// Fonction create : elle regroupe le traitement de cette partie.
	create() {
		// Tribunes légèrement plus courtes que pour la demi
		// Valeur mémorisée dans shrinkFactor.
		const shrinkFactor = 0.8; // 80% de la longueur, mais même recul que la demi

		// Valeur mémorisée dans pitchLengthX.
		const pitchLengthX = this.innerX * 2 * shrinkFactor;
		// Valeur mémorisée dans pitchLengthZ.
		const pitchLengthZ = this.innerZ * 2 * shrinkFactor;

		// Appel de createSideStand pour appliquer l'action prévue.
		this.createSideStand(
			// Paramètre de l'appel ou valeur de configuration.
			"northStand8",
			// Paramètre de l'appel ou valeur de configuration.
			pitchLengthX,
			// Appel de Vector3 pour appliquer l'action prévue.
			new BABYLON.Vector3(0, 0, this.innerZ),
			// Paramètre de l'appel ou valeur de configuration.
			0,
			// Instruction nécessaire au déroulement de cette partie.
			"blue"
		// Fermeture du bloc ou de l'appel.
		);

		// Appel de createSideStand pour appliquer l'action prévue.
		this.createSideStand(
			// Paramètre de l'appel ou valeur de configuration.
			"southStand8",
			// Paramètre de l'appel ou valeur de configuration.
			pitchLengthX,
			// Appel de Vector3 pour appliquer l'action prévue.
			new BABYLON.Vector3(0, 0, -this.innerZ),
			// Paramètre de l'appel ou valeur de configuration.
			Math.PI,
			// Instruction nécessaire au déroulement de cette partie.
			"red"
		// Fermeture du bloc ou de l'appel.
		);

		// Appel de createSideStand pour appliquer l'action prévue.
		this.createSideStand(
			// Paramètre de l'appel ou valeur de configuration.
			"eastStand8",
			// Paramètre de l'appel ou valeur de configuration.
			pitchLengthZ,
			// Appel de Vector3 pour appliquer l'action prévue.
			new BABYLON.Vector3(this.innerX, 0, 0),
			// Paramètre de l'appel ou valeur de configuration.
			Math.PI / 2,
			// Instruction nécessaire au déroulement de cette partie.
			"blue"
		// Fermeture du bloc ou de l'appel.
		);

		// Appel de createSideStand pour appliquer l'action prévue.
		this.createSideStand(
			// Paramètre de l'appel ou valeur de configuration.
			"westStand8",
			// Paramètre de l'appel ou valeur de configuration.
			pitchLengthZ,
			// Appel de Vector3 pour appliquer l'action prévue.
			new BABYLON.Vector3(-this.innerX, 0, 0),
			// Paramètre de l'appel ou valeur de configuration.
			-Math.PI / 2,
			// Instruction nécessaire au déroulement de cette partie.
			"red"
		// Fermeture du bloc ou de l'appel.
		);

		// Pas de grandes tours ni de grosses poutres rouges ici :
		// le stade de huitième reste visuellement plus simple.

		// Animation LED sur les panneaux pub.
		// Appel de startLEDAnimation pour appliquer l'action prévue.
		this.startLEDAnimation();

		// Résultat renvoyé par la fonction.
		return this.stadiumRoot;
	// Fermeture du bloc ou de l'appel.
	}
// Fermeture du bloc ou de l'appel.
}

