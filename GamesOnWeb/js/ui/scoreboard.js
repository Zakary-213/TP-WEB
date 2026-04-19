// js/ui/scoreboard.js

// Classe Scoreboard : elle sert de modèle pour cet élément du jeu.
class Scoreboard {
    // Fonction constructor : elle regroupe le traitement de cette partie.
    constructor() {
        // Mise à jour de playerScore pour cet objet.
        this.playerScore = 0;
        // Mise à jour de aiScore pour cet objet.
        this.aiScore = 0;
        // Mise à jour de leftTeamLabel pour cet objet.
        this.leftTeamLabel = "YOU";
        // Mise à jour de rightTeamLabel pour cet objet.
        this.rightTeamLabel = "IA";
        
        // Mise à jour de matchTime pour cet objet.
        this.matchTime = 0;
        // Mise à jour de isMatchRunning pour cet objet.
        this.isMatchRunning = false;

        // Mise à jour de uiPlayer pour cet objet.
        this.uiPlayer = document.getElementById("score-player");
        // Mise à jour de uiAi pour cet objet.
        this.uiAi = document.getElementById("score-ai");
        // Mise à jour de uiLeftTeam pour cet objet.
        this.uiLeftTeam = document.getElementById("score-team-left");
        // Mise à jour de uiRightTeam pour cet objet.
        this.uiRightTeam = document.getElementById("score-team-right");
        // Mise à jour de timerElement pour cet objet.
        this.timerElement = document.getElementById("match-timer");

        // Appel de updateScoreDisplay pour appliquer l'action prévue.
        this.updateScoreDisplay(0, 0);
        // Appel de updateTeamLabels pour appliquer l'action prévue.
        this.updateTeamLabels(this.leftTeamLabel, this.rightTeamLabel);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateTeamLabels : elle regroupe le traitement de cette partie.
    updateTeamLabels(leftLabel, rightLabel) {
        // Mise à jour de leftTeamLabel pour cet objet.
        this.leftTeamLabel = leftLabel || "YOU";
        // Mise à jour de rightTeamLabel pour cet objet.
        this.rightTeamLabel = rightLabel || "IA";

        // Vérification avant d'exécuter la suite.
        if (this.uiLeftTeam) this.uiLeftTeam.innerText = this.leftTeamLabel;
        // Vérification avant d'exécuter la suite.
        if (this.uiRightTeam) this.uiRightTeam.innerText = this.rightTeamLabel;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction getScorelineText : elle regroupe le traitement de cette partie.
    getScorelineText() {
        // Résultat renvoyé par la fonction.
        return `${this.leftTeamLabel} ${this.playerScore} - ${this.aiScore} ${this.rightTeamLabel}`;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateScoreDisplay : elle regroupe le traitement de cette partie.
    updateScoreDisplay(p, a) {
        // Joueur marque
        // Vérification avant d'exécuter la suite.
        if (p > this.playerScore && this.uiPlayer) {
            // Appel de remove pour appliquer l'action prévue.
            this.uiPlayer.classList.remove("animate-score");
            // Force le reflow pour redémarrer l'animation si elle était déjà en cours
            // Instruction nécessaire au déroulement de cette partie.
            void this.uiPlayer.offsetWidth; 
            // Appel de add pour appliquer l'action prévue.
            this.uiPlayer.classList.add("animate-score");
        // Fermeture du bloc ou de l'appel.
        }
        
        // IA marque
        // Vérification avant d'exécuter la suite.
        if (a > this.aiScore && this.uiAi) {
            // Appel de remove pour appliquer l'action prévue.
            this.uiAi.classList.remove("animate-score");
            // Instruction nécessaire au déroulement de cette partie.
            void this.uiAi.offsetWidth;
            // Appel de add pour appliquer l'action prévue.
            this.uiAi.classList.add("animate-score");
        // Fermeture du bloc ou de l'appel.
        }

        // Mise à jour de playerScore pour cet objet.
        this.playerScore = p;
        // Mise à jour de aiScore pour cet objet.
        this.aiScore = a;
        
        // Vérification avant d'exécuter la suite.
        if (this.uiPlayer) this.uiPlayer.innerText = this.playerScore;
        // Vérification avant d'exécuter la suite.
        if (this.uiAi) this.uiAi.innerText = this.aiScore;

        // Mettre à jour aussi les panneaux 3D du stade
        // Vérification avant d'exécuter la suite.
        if (window.scoreBoard3D && window.scoreBoard3D.updateScore) {
            // Appel de updateScore pour appliquer l'action prévue.
            window.scoreBoard3D.updateScore(this.playerScore, this.aiScore);
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction playerScored : elle regroupe le traitement de cette partie.
    playerScored() {
        // Appel de updateScoreDisplay pour appliquer l'action prévue.
        this.updateScoreDisplay(this.playerScore + 1, this.aiScore);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction aiScored : elle regroupe le traitement de cette partie.
    aiScored() {
        // Appel de updateScoreDisplay pour appliquer l'action prévue.
        this.updateScoreDisplay(this.playerScore, this.aiScore + 1);
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction startTimer : elle regroupe le traitement de cette partie.
    startTimer() {
        // Mise à jour de isMatchRunning pour cet objet.
        this.isMatchRunning = true;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction stopTimer : elle regroupe le traitement de cette partie.
    stopTimer() {
        // Mise à jour de isMatchRunning pour cet objet.
        this.isMatchRunning = false;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction resetTimer : elle regroupe le traitement de cette partie.
    resetTimer() {
        // Mise à jour de matchTime pour cet objet.
        this.matchTime = 0;
        // Appel de updateTimerDisplay pour appliquer l'action prévue.
        this.updateTimerDisplay();
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateTimer : elle regroupe le traitement de cette partie.
    updateTimer(deltaTimeSeconds) {
        // Vérification avant d'exécuter la suite.
        if (this.isMatchRunning) {
            // Instruction nécessaire au déroulement de cette partie.
            this.matchTime += deltaTimeSeconds;
            // Appel de updateTimerDisplay pour appliquer l'action prévue.
            this.updateTimerDisplay();
        // Fermeture du bloc ou de l'appel.
        }
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction updateTimerDisplay : elle regroupe le traitement de cette partie.
    updateTimerDisplay() {
        // Vérification avant d'exécuter la suite.
        if (!this.timerElement) return;
        // Valeur mémorisée dans minutes.
        const minutes = Math.floor(this.matchTime / 60);
        // Valeur mémorisée dans seconds.
        const seconds = Math.floor(this.matchTime % 60);
        // Mise à jour de innerText.
        this.timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // Fermeture du bloc ou de l'appel.
    }

    // Fonction reset : elle regroupe le traitement de cette partie.
    reset() {
        // Mise à jour de playerScore pour cet objet.
        this.playerScore = 0;
        // Mise à jour de aiScore pour cet objet.
        this.aiScore = 0;
        // Mise à jour de matchTime pour cet objet.
        this.matchTime = 0;
        // Mise à jour de isMatchRunning pour cet objet.
        this.isMatchRunning = false;
        // Appel de updateScoreDisplay pour appliquer l'action prévue.
        this.updateScoreDisplay(0, 0);
        // Appel de updateTimerDisplay pour appliquer l'action prévue.
        this.updateTimerDisplay();
    // Fermeture du bloc ou de l'appel.
    }
// Fermeture du bloc ou de l'appel.
}

// Instantiate globally so it can be used easily across the game
// Mise à jour de gameScoreboard.
window.gameScoreboard = new Scoreboard();
