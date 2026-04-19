// Import des outils nécessaires dans ce fichier.
import { getSelectedTeamDisplayName } from "../utils/teamLabels.js";

// Fonction setupTeams : elle regroupe le traitement de cette partie.
export function setupTeams(scene, mode, tournamentStage) {
    // Valeur mémorisée dans isVersusMode.
    const isVersusMode = mode === "versus";

    // Fonction readStoredMeshIndex : elle regroupe le traitement de cette partie.
    const readStoredMeshIndex = (storageKey) => {
        // Valeur mémorisée dans storedMesh.
        const storedMesh = window.localStorage.getItem(storageKey);
        // Valeur mémorisée dans parsedMesh.
        const parsedMesh = Number.parseInt(storedMesh, 10);

        // Résultat renvoyé par la fonction.
        return Number.isInteger(parsedMesh) && parsedMesh >= 0 ? parsedMesh : null;
    // Fermeture du bloc ou de l'appel.
    };

    // Création de myTeam.
    const myTeam = new PlayerTeam(scene, "My Team", new BABYLON.Color3(1, 0, 0));
    // Vérification avant d'exécuter la suite.
    if (isVersusMode) {
        // Valeur mémorisée dans storedP1Mesh.
        const storedP1Mesh = readStoredMeshIndex("gow-player1-skin-mesh-index");
        // Vérification avant d'exécuter la suite.
        if (storedP1Mesh !== null) {
            // Mise à jour de meshIndex.
            myTeam.meshIndex = storedP1Mesh;
        // Fermeture du bloc ou de l'appel.
        }
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Mise à jour de meshIndex.
        myTeam.meshIndex = 1;
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de createTeamFormation pour appliquer l'action prévue.
    myTeam.createTeamFormation(1);

    // Valeur mémorisée dans opponentTeam.
    let opponentTeam;
    // Vérification avant d'exécuter la suite.
    if (isVersusMode) {
        // Mise à jour de name.
        myTeam.name = getSelectedTeamDisplayName("gow-player1-skin-ui", myTeam.name);
        // Appel de PlayerTeam pour appliquer l'action prévue.
        opponentTeam = new PlayerTeam(scene, getSelectedTeamDisplayName("gow-player2-skin-ui", "Player 2"), new BABYLON.Color3(0, 0, 1));
        // Valeur mémorisée dans storedP2Mesh.
        const storedP2Mesh = readStoredMeshIndex("gow-player2-skin-mesh-index");
        // Vérification avant d'exécuter la suite.
        if (storedP2Mesh !== null) {
            // Mise à jour de meshIndex.
            opponentTeam.meshIndex = storedP2Mesh;
        // Fermeture du bloc ou de l'appel.
        }
    // Cas utilisé quand les tests précédents échouent.
    } else {
        // Sélection du traitement selon la valeur.
        switch (tournamentStage) {
            // Option possible dans ce choix.
            case "huitieme": opponentTeam = new AITeamHuitieme(scene, "Adversaire", new BABYLON.Color3(0, 0, 1)); break;
            // Option possible dans ce choix.
            case "quart": opponentTeam = new AITeamQuart(scene, "Adversaire", new BABYLON.Color3(0, 0, 1)); break;
            // Option possible dans ce choix.
            case "demi": opponentTeam = new AITeamDemi(scene, "Adversaire", new BABYLON.Color3(0, 0, 1)); break;
            // Option possible dans ce choix.
            case "finale": opponentTeam = new AITeamFinale(scene, "Adversaire", new BABYLON.Color3(0, 0, 1)); break;
            // Option par défaut.
            default: opponentTeam = new AITeamHuitieme(scene, "Adversaire", new BABYLON.Color3(0, 0, 1)); break;
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Appel de createTeamFormation pour appliquer l'action prévue.
    opponentTeam.createTeamFormation(-1);
    // Mise à jour de opponents.
    myTeam.opponents = opponentTeam.players;
    // Mise à jour de opponents.
    opponentTeam.opponents = myTeam.players;

    // Résultat renvoyé par la fonction.
    return { myTeam, opponentTeam };
// Fermeture du bloc ou de l'appel.
}
