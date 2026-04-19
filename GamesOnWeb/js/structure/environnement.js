// Crée un environnement spatial autour du stade (inspiration Galactik Football)
// Fonction createEnvironment : elle regroupe le traitement de cette partie.
const createEnvironment = (scene) => {
	// Fond de scène noir profond
	// Mise à jour de clearColor.
	scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

	// 1) Dôme d'étoiles (grosse sphère inversée)
	// Préparation de spaceDome avec Babylon.js.
	const spaceDome = BABYLON.MeshBuilder.CreateSphere("spaceDome", {
		// Paramètre de l'appel ou valeur de configuration.
		diameter: 1000,
		// Paramètre de l'appel ou valeur de configuration.
		segments: 32,
		// Instruction nécessaire au déroulement de cette partie.
		sideOrientation: BABYLON.Mesh.BACKSIDE
	// Instruction nécessaire au déroulement de cette partie.
	}, scene);

	// Création de spaceMat.
	const spaceMat = new BABYLON.StandardMaterial("spaceMat", scene);
	// Mise à jour de diffuseColor.
	spaceMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
	// Mise à jour de emissiveColor.
	spaceMat.emissiveColor = new BABYLON.Color3(0.02, 0.05, 0.15); // léger bleu nuit
	// Mise à jour de backFaceCulling.
	spaceMat.backFaceCulling = false;
	// Mise à jour de material.
	spaceDome.material = spaceMat;

	// 2) Petites étoiles (sphères très éloignées et lumineuses)
	// Création de starMat.
	const starMat = new BABYLON.StandardMaterial("starMat", scene);
	// Mise à jour de emissiveColor.
	starMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
	// Mise à jour de specularColor.
	starMat.specularColor = new BABYLON.Color3(0, 0, 0);

	// Valeur mémorisée dans starCount.
	const starCount = 250;
	// Valeur mémorisée dans starRadiusMin.
	const starRadiusMin = 250;
	// Valeur mémorisée dans starRadiusMax.
	const starRadiusMax = 450;

	// Parcours de plusieurs valeurs.
	for (let i = 0; i < starCount; i++) {
		// Préparation de star avec Babylon.js.
		const star = BABYLON.MeshBuilder.CreateSphere("star_" + i, {
			// Instruction nécessaire au déroulement de cette partie.
			diameter: 0.8
		// Instruction nécessaire au déroulement de cette partie.
		}, scene);

		// Position aléatoire sur une sphère creuse
		// Valeur mémorisée dans radius.
		const radius = starRadiusMin + Math.random() * (starRadiusMax - starRadiusMin);
		// Valeur mémorisée dans theta.
		const theta = Math.random() * Math.PI * 2;
		// Valeur mémorisée dans phi.
		const phi = Math.acos(2 * Math.random() - 1);

		// Valeur mémorisée dans x.
		const x = radius * Math.sin(phi) * Math.cos(theta);
		// Valeur mémorisée dans y.
		const y = radius * Math.cos(phi);
		// Valeur mémorisée dans z.
		const z = radius * Math.sin(phi) * Math.sin(theta);

		// Mise à jour de position.
		star.position = new BABYLON.Vector3(x, y, z);
		// Mise à jour de material.
		star.material = starMat;
		// Mise à jour de isPickable.
		star.isPickable = false;
	// Fermeture du bloc ou de l'appel.
	}

	// 3) Planètes / lunes lointaines
	// Fonction createPlanet : elle regroupe le traitement de cette partie.
	const createPlanet = (name, position, color, size) => {
		// Préparation de planet avec Babylon.js.
		const planet = BABYLON.MeshBuilder.CreateSphere(name, {
			// Instruction nécessaire au déroulement de cette partie.
			diameter: size
		// Instruction nécessaire au déroulement de cette partie.
		}, scene);
		// Mise à jour de position.
		planet.position = position;

		// Création de mat.
		const mat = new BABYLON.StandardMaterial(name + "Mat", scene);
		// Mise à jour de diffuseColor.
		mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
		// Mise à jour de emissiveColor.
		mat.emissiveColor = color;
		// Mise à jour de material.
		planet.material = mat;
		// Mise à jour de isPickable.
		planet.isPickable = false;

		// Résultat renvoyé par la fonction.
		return planet;
	// Fermeture du bloc ou de l'appel.
	};

	// Valeur mémorisée dans planet1.
	const planet1 = createPlanet(
		// Paramètre de l'appel ou valeur de configuration.
		"planetBlue",
		// Appel de Vector3 pour appliquer l'action prévue.
		new BABYLON.Vector3(-200, 120, 260),
		// Appel de Color3 pour appliquer l'action prévue.
		new BABYLON.Color3(0.2, 0.5, 1.0),
		// Instruction nécessaire au déroulement de cette partie.
		40
	// Fermeture du bloc ou de l'appel.
	);

	// Valeur mémorisée dans planet2.
	const planet2 = createPlanet(
		// Paramètre de l'appel ou valeur de configuration.
		"planetPurple",
		// Appel de Vector3 pour appliquer l'action prévue.
		new BABYLON.Vector3(260, -80, -220),
		// Appel de Color3 pour appliquer l'action prévue.
		new BABYLON.Color3(0.8, 0.3, 1.0),
		// Instruction nécessaire au déroulement de cette partie.
		30
	// Fermeture du bloc ou de l'appel.
	);

	// 4) Étoiles filantes (boules dorées en orbite autour du stade)
	// Valeur mémorisée dans shootingStars.
	const shootingStars = [];
	// Création de shootingStarMat.
	const shootingStarMat = new BABYLON.StandardMaterial("shootingStarMat", scene);
	// Mise à jour de diffuseColor.
	shootingStarMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
	// Mise à jour de emissiveColor.
	shootingStarMat.emissiveColor = new BABYLON.Color3(1.0, 0.85, 0.2); // doré
	// Mise à jour de specularColor.
	shootingStarMat.specularColor = new BABYLON.Color3(0, 0, 0);

	// Fonction createShootingStar : elle regroupe le traitement de cette partie.
	const createShootingStar = () => {
		// Préparation de star avec Babylon.js.
		const star = BABYLON.MeshBuilder.CreateSphere("shootingStar", { diameter: 1.4 }, scene);
		// Mise à jour de material.
		star.material = shootingStarMat;
		// Mise à jour de isPickable.
		star.isPickable = false;

		// Paramètres d'orbite : rayon, angle initial, vitesse angulaire et hauteur
		// Valeur mémorisée dans radius.
		const radius = 220 + Math.random() * 80; // toujours bien en dehors du stade
		// Valeur mémorisée dans angle.
		const angle = Math.random() * Math.PI * 2;
		// Valeur mémorisée dans angularSpeed.
		const angularSpeed = (0.3 + Math.random() * 0.4) * (Math.random() < 0.5 ? 1 : -1); // sens +/-
		// Valeur mémorisée dans height.
		const height = 80 + Math.random() * 40;

		// Position initiale sur le cercle
		// Valeur mémorisée dans x.
		const x = radius * Math.cos(angle);
		// Valeur mémorisée dans z.
		const z = radius * Math.sin(angle);
		// Mise à jour de position.
		star.position = new BABYLON.Vector3(x, height, z);

		// Appel de push pour appliquer l'action prévue.
		shootingStars.push({ mesh: star, radius, angle, angularSpeed, height });
	// Fermeture du bloc ou de l'appel.
	};

	// Crée quelques étoiles filantes au démarrage
	// Parcours de plusieurs valeurs.
	for (let i = 0; i < 6; i++) {
		// Appel de createShootingStar pour appliquer l'action prévue.
		createShootingStar();
	// Fermeture du bloc ou de l'appel.
	}

	// 5) Animation générale (planètes + étoiles filantes)
	// Appel de add pour appliquer l'action prévue.
	scene.onBeforeRenderObservable.add(() => {
		// Valeur mémorisée dans dt.
		const dt = scene.getEngine().getDeltaTime() / 1000;
		// Rotation des planètes
		// Instruction nécessaire au déroulement de cette partie.
		planet1.rotation.y += 0.03 * dt;
		// Instruction nécessaire au déroulement de cette partie.
		planet2.rotation.y += 0.02 * dt;

		// Mise à jour des étoiles filantes
		// Parcours de plusieurs valeurs.
		for (let i = 0; i < shootingStars.length; i++) {
			// Valeur mémorisée dans s.
			const s = shootingStars[i];
			// Vérification avant d'exécuter la suite.
			if (!s.mesh || s.mesh.isDisposed()) continue;

			// Mise à jour de l'angle d'orbite
			// Instruction nécessaire au déroulement de cette partie.
			s.angle += s.angularSpeed * dt;

			// Recalcule la position sur le cercle autour du stade (en gardant la même hauteur)
			// Valeur mémorisée dans x.
			const x = s.radius * Math.cos(s.angle);
			// Valeur mémorisée dans z.
			const z = s.radius * Math.sin(s.angle);
			// Appel de set pour appliquer l'action prévue.
			s.mesh.position.set(x, s.height, z);
		// Fermeture du bloc ou de l'appel.
		}
	// Fermeture du bloc ou de l'appel.
	});
// Fermeture du bloc ou de l'appel.
};

