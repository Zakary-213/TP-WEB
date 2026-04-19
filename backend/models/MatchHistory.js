const mongoose = require('mongoose');

// Schéma historique prévu pour les résultats de matchs GamesOnWeb.
const matchHistorySchema = new mongoose.Schema({
    // Utilisateur propriétaire de l'historique.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Nom technique du jeu.
    game: {
        type: String,  // e.g., 'canvas'
        required: true
    },
    // Mode du match : tournoi, versus, 1v1...
    mode: {
        type: String,  // 'solo' or 'duo'
        required: true
    },
    // Nombre total de buts du joueur ou de l'équipe principale.
    totalButs: {
        type: Number,
        required: true
    },
    // Ancien champ réutilisable pour des métriques secondaires.
    totalMeteorites: {
        type: Number,
        default: 0
    },
    // Données détaillées du match.
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    // Ajoute automatiquement createdAt et updatedAt.
    timestamps: true
});

// Exporte le modèle historique.
module.exports = mongoose.model('MatchHistory', matchHistorySchema);
