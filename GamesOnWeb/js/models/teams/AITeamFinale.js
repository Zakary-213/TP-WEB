// Classe AITeamFinale : elle sert de modèle pour cet élément du jeu.
class AITeamFinale extends AITeam {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene, name, color) {
        // Appel de super pour appliquer l'action prévue.
        super(scene, name, color, 3); 
        // Mise à jour de speed pour cet objet.
        this.speed = 0.1; // Très rapide (aussi rapide que le joueur !)
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction aiBehavior : elle regroupe le traitement de cette partie.
    aiBehavior(ball) {
        // Appel de aiBehavior pour appliquer l'action prévue.
        super.aiBehavior(ball);
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}
