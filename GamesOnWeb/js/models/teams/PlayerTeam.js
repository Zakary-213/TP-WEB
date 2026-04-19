// Classe PlayerTeam : elle sert de modèle pour cet élément du jeu.
class PlayerTeam extends Team {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor(scene, name, color) {
        // Appel de super pour appliquer l'action prévue.
        super(scene, name, color, true, 1); // meshIndex = 1 pour PlayerTeam
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction update : elle regroupe le traitement de cette partie.
    update(ball, input) {
        // Appel de update pour appliquer l'action prévue.
        super.update(ball);
        // Logique spécifique liée aux inputs du joueur humain (clavier, manette)
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}
