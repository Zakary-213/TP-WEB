// Classe TribuneQuart : elle sert de modèle pour cet élément du jeu.
class TribuneQuart extends Tribune {
	// Fonction constructor : elle regroupe le traitement de cette partie.
	constructor(scene) {
		// Appel de super pour appliquer l'action prévue.
		super(scene);

		// Quart de finale : un peu plus grand que les huitièmes,
		// mais moins impressionnant que la demi-finale.
		// Mise à jour de numTiers pour cet objet.
		this.numTiers = 3;        // un étage de plus que Huitième (2 -> 3)
		// Mise à jour de rowsPerTier pour cet objet.
		this.rowsPerTier = 9;     // légèrement plus de rangées
		// Mise à jour de tierGapHeight pour cet objet.
		this.tierGapHeight = 2.2; // un peu plus d'espace entre les niveaux
		// Mise à jour de hasRoof pour cet objet.
		this.hasRoof = false;     // toujours sans toit pour garder le contraste

		// Appel de calculateDimensions pour appliquer l'action prévue.
		this.calculateDimensions();
	// Fermeture du bloc ou de l'appel.
	}

	// Fonction create : elle regroupe le traitement de cette partie.
	create() {
		// Légèrement plus long que les huitièmes, mais
		// toujours plus court que la demi-finale.
		// Valeur mémorisée dans lengthFactor.
		const lengthFactor = 0.9; // 90% de la longueur de la demi

		// Valeur mémorisée dans pitchLengthX.
		const pitchLengthX = this.innerX * 2 * lengthFactor;
		// Valeur mémorisée dans pitchLengthZ.
		const pitchLengthZ = this.innerZ * 2 * lengthFactor;

		// Tribunes principales
		// Appel de createSideStand pour appliquer l'action prévue.
		this.createSideStand(
			// Paramètre de l'appel ou valeur de configuration.
			"northStandQuart",
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
			"southStandQuart",
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
			"eastStandQuart",
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
			"westStandQuart",
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

		// Pas de tours massives ni d'arches :
		// le quart est un intermédiaire entre Huitième et Demi.

		// Animation LED sur les panneaux pub.
		// Appel de startLEDAnimation pour appliquer l'action prévue.
		this.startLEDAnimation();

		// Résultat renvoyé par la fonction.
		return this.stadiumRoot;
	// Fermeture du bloc ou de l'appel.
	}
// Fermeture du bloc ou de l'appel.
}

