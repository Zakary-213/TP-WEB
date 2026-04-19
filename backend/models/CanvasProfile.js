const mongoose = require('mongoose');

// Profil persistant du joueur pour le jeu Canvas.
const canvasProfileSchema = new mongoose.Schema({
    // Utilisateur auquel appartient le profil.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Monnaie gagnée dans Canvas.
    gold: {
        type: Number,
        default: 0
    },
    // Liste des vaisseaux débloqués.
    ownedShips: {
        type: [String],
        default: ['normal']
    },
    // Vaisseau actuellement équipé.
    equippedShip: {
        type: String,
        default: 'normal'
    }
}, {
    // Ajoute automatiquement createdAt et updatedAt.
    timestamps: true
});

// Exporte le modèle Mongoose CanvasProfile.
module.exports = mongoose.model('CanvasProfile', canvasProfileSchema);
