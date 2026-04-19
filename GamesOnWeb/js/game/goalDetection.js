// Fonction checkGoalScored : elle regroupe le traitement de cette partie.
export function checkGoalScored(ball, leftGoal, rightGoal, goalReplay) {
    // Vérification avant d'exécuter la suite.
    if (!ball || !ball.position || ball.isOutAnimationPlaying || ball.isOutOfPlay) return;

    // Valeur mémorisée dans ballCenter.
    const ballCenter = ball.position;
    // Valeur mémorisée dans playerScored.
    let playerScored = false;
    // Valeur mémorisée dans aiScored.
    let aiScored = false;

    // Vérification avant d'exécuter la suite.
    if (Math.abs(ballCenter.x) > 45) {
        // Appel de intersectsPoint pour appliquer l'action prévue.
        playerScored = rightGoal.triggerBox.intersectsPoint(ballCenter);
        // Appel de intersectsPoint pour appliquer l'action prévue.
        aiScored = leftGoal.triggerBox.intersectsPoint(ballCenter);
    // Fermeture du bloc ou de l'appel.
    }

    // Vérification avant d'exécuter la suite.
    if ((playerScored || aiScored) && goalReplay.isPlaying()) {
        // Appel de triggerGoal pour appliquer l'action prévue.
        goalReplay.triggerGoal({ playerScored, aiScored });
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}
