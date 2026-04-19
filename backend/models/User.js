const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma MongoDB représentant un compte utilisateur.
const userSchema = new mongoose.Schema({
    // Pseudo public du joueur.
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },
    // Email utilisé pour se connecter.
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    // Mot de passe hashé ; select:false évite de le renvoyer par défaut.
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    }
}, {
    // Ajoute automatiquement createdAt et updatedAt.
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    // Si le mot de passe n'a pas changé, pas besoin de le re-hasher.
    if (!this.isModified('password')) {
        return next();
    }
    // Génère un sel de hash sécurisé.
    const salt = await bcrypt.genSalt(10);
    // Remplace le mot de passe brut par sa version hashée.
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode d'instance pour comparer un mot de passe saisi avec le hash stocké.
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Exporte le modèle Mongoose User.
module.exports = mongoose.model('User', userSchema);
