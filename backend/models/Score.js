const mongoose = require('mongoose');

// Schéma générique utilisé pour sauvegarder les scores des différents jeux.
const scoreSchema = new mongoose.Schema({
    // Utilisateur propriétaire du score.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Nom technique du jeu : canvas, gamesonweb ou dom.
    game: {
        type: String,  // e.g., 'canvas'
        required: true
    },
    // Mode du jeu : solo, designer, tournament, versus, etc.
    mode: {
        type: String,  // 'solo' or 'duo'
        required: true
    },
    // Durée totale stockée en millisecondes.
    totalTime: {
        type: Number,
        required: true
    },
    // Champ historique qui sert aussi à stocker une métrique totale selon le jeu.
    totalMeteorites: {
        type: Number,
        default: 0
    },
    // Données libres propres à chaque jeu.
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    // Ajoute automatiquement createdAt et updatedAt.
    timestamps: true
});

// Exporte le modèle Mongoose Score.
module.exports = mongoose.model('Score', scoreSchema);
